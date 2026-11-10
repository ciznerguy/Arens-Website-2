import { InternalPage } from '../types';
import { db } from './firebase';
import { doc, setDoc, onSnapshot, collection } from 'firebase/firestore';
import { pageDocId } from '../data/permissions';

/**
 * Page content storage (stage 3B, 2026-11-10).
 *
 * Before: every page override and every grade's class list lived in ONE document, settings/pages_overrides.
 * A coordinator could not be allowed to save their own page without being allowed to overwrite all pages.
 *
 * Now: each page is saved in its own document, page_overrides/{pageDocId(key)}, and each grade's classes in
 * grade_classes/{grade}. The security rules decide per document who may write it.
 * The old document stays untouched and is still read underneath, so nothing saved before is lost:
 * a per-page document wins over the old entry, and { removed: true } hides an old entry.
 * The deleted-pages list stays in the old document (admins only).
 */

let baseOverrides: Record<string, InternalPage> = {};
let baseDeleted: string[] = [];
let baseClasses: Record<string, any[]> = {};
let pageDocs: Record<string, InternalPage | null> = {}; // null = removed
let classDocs: Record<string, any[]> = {};
let lastMergedOverrides: Record<string, InternalPage> = {};
let lastMergedClasses: Record<string, any[]> = {};

function mergedOverrides(): Record<string, InternalPage> {
  const merged: Record<string, InternalPage> = { ...baseOverrides };
  Object.keys(pageDocs).forEach(key => {
    const page = pageDocs[key];
    if (page) {
      merged[key] = page;
    } else {
      delete merged[key];
    }
  });
  return merged;
}

function mergedClasses(): Record<string, any[]> {
  return { ...baseClasses, ...classDocs };
}

function publish(callback?: () => void) {
  lastMergedOverrides = mergedOverrides();
  lastMergedClasses = mergedClasses();
  try {
    localStorage.setItem('internal_pages_overrides', JSON.stringify(lastMergedOverrides));
    localStorage.setItem('internal_pages_deleted', JSON.stringify(baseDeleted));
    localStorage.setItem('grade_classes_overrides', JSON.stringify(lastMergedClasses));
  } catch (e) {
    console.warn('LocalStorage write failed:', e);
  }
  window.dispatchEvent(new Event('internal_pages_updated'));
  window.dispatchEvent(new Event('grade_classes_updated'));
  if (callback) {
    callback();
  }
}

/**
 * Subscribe to page overrides and grade classes (old shared document + per-page documents)
 */
export const subscribeToPageOverrides = (callback?: () => void) => {
  const unsubs: Array<() => void> = [];
  try {
    unsubs.push(onSnapshot(doc(db, 'settings', 'pages_overrides'), (docSnap) => {
      if (!docSnap.exists()) {
        return;
      }
      const data = docSnap.data();
      if (data.overridesJson) {
        try {
          const parsed = JSON.parse(data.overridesJson);
          if (parsed && typeof parsed === 'object') {
            baseOverrides = parsed;
          }
        } catch (e) {
          console.warn('Error parsing cloud overridesJson:', e);
        }
      }
      if (data.deletedJson) {
        try {
          const parsedDeleted = JSON.parse(data.deletedJson);
          if (Array.isArray(parsedDeleted)) {
            baseDeleted = parsedDeleted;
          }
        } catch (e) {}
      }
      if (data.gradeClassesJson) {
        try {
          const parsedClasses = JSON.parse(data.gradeClassesJson);
          if (parsedClasses && typeof parsedClasses === 'object') {
            baseClasses = parsedClasses;
          }
        } catch (e) {}
      }
      publish(callback);
    }, (err) => {
      console.warn('Page overrides Firestore subscription fallback:', err);
    }));

    unsubs.push(onSnapshot(collection(db, 'page_overrides'), (snap) => {
      const next: Record<string, InternalPage | null> = {};
      snap.forEach(d => {
        const data = d.data();
        if (!data.key) {
          return;
        }
        if (data.removed === true) {
          next[data.key] = null;
          return;
        }
        try {
          next[data.key] = JSON.parse(data.pageJson);
        } catch (e) {
          console.warn('Error parsing page document', d.id, e);
        }
      });
      pageDocs = next;
      publish(callback);
    }, (err) => {
      console.warn('Per-page overrides subscription fallback:', err);
    }));

    unsubs.push(onSnapshot(collection(db, 'grade_classes'), (snap) => {
      const next: Record<string, any[]> = {};
      snap.forEach(d => {
        try {
          const parsed = JSON.parse(d.data().classesJson);
          if (Array.isArray(parsed)) {
            next[d.id] = parsed;
          }
        } catch (e) {}
      });
      classDocs = next;
      publish(callback);
    }, (err) => {
      console.warn('Grade classes subscription fallback:', err);
    }));
  } catch (err) {
    console.warn('Error setting up page overrides listener:', err);
  }
  return () => {
    unsubs.forEach(u => u());
  };
};

// After a refused save, put the last known cloud state back so the screen does not show unsaved content
function restoreFromCloud() {
  publish();
}

async function writePage(key: string, page: InternalPage | null) {
  const ref = doc(db, 'page_overrides', pageDocId(key));
  if (page) {
    await setDoc(ref, { key, pageJson: JSON.stringify(page), updatedAt: new Date().toISOString() });
  } else {
    await setDoc(ref, { key, removed: true, updatedAt: new Date().toISOString() });
  }
}

/**
 * Save page changes. Returns true only if the database accepted every change.
 * - (key, page): save one page.
 * - (allOverrides, deletedList): save whatever differs from the last cloud state.
 */
export const syncPageOverrideToCloud = async (
  pageKeyOrOverrides: string | Record<string, InternalPage>,
  pageOrDeleted?: InternalPage | string[]
): Promise<boolean> => {
  try {
    if (typeof pageKeyOrOverrides === 'string') {
      await writePage(pageKeyOrOverrides, pageOrDeleted as InternalPage);
      return true;
    }
    const overrides = pageKeyOrOverrides;
    const deleted = (pageOrDeleted as string[]) || [];
    const writes: Promise<void>[] = [];
    Object.keys(overrides).forEach(key => {
      if (JSON.stringify(overrides[key]) !== JSON.stringify(lastMergedOverrides[key])) {
        writes.push(writePage(key, overrides[key]));
      }
    });
    Object.keys(lastMergedOverrides).forEach(key => {
      if (!(key in overrides)) {
        writes.push(writePage(key, null));
      }
    });
    if (JSON.stringify(deleted) !== JSON.stringify(baseDeleted)) {
      writes.push(setDoc(doc(db, 'settings', 'pages_overrides'), {
        deletedJson: JSON.stringify(deleted),
        updatedAt: new Date().toISOString()
      }, { merge: true }));
    }
    await Promise.all(writes);
    return true;
  } catch (err) {
    console.warn('Failed syncing page overrides to Firestore:', err);
    restoreFromCloud();
    return false;
  }
};

/**
 * Save grade class lists. Returns true only if the database accepted every change.
 */
export const syncGradeClassesToCloud = async (
  gradeOrAll: string | Record<string, any[]>,
  classesList?: any[]
): Promise<boolean> => {
  try {
    let changed: Record<string, any[]>;
    if (typeof gradeOrAll === 'string' && classesList) {
      changed = { [gradeOrAll]: classesList };
    } else {
      const all = gradeOrAll as Record<string, any[]>;
      changed = {};
      Object.keys(all).forEach(grade => {
        if (JSON.stringify(all[grade]) !== JSON.stringify(lastMergedClasses[grade])) {
          changed[grade] = all[grade];
        }
      });
    }
    await Promise.all(Object.keys(changed).map(grade =>
      setDoc(doc(db, 'grade_classes', grade), {
        classesJson: JSON.stringify(changed[grade]),
        updatedAt: new Date().toISOString()
      })
    ));
    return true;
  } catch (err) {
    console.warn('Failed syncing grade classes to Firestore:', err);
    restoreFromCloud();
    return false;
  }
};
