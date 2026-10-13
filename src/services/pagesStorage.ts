import { InternalPage } from '../types';
import { db } from './firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

/**
 * Subscribe to Real-Time Page Overrides and Grade Classes from Firestore
 */
export const subscribeToPageOverrides = (callback?: () => void) => {
  try {
    const unsub = onSnapshot(doc(db, 'settings', 'pages_overrides'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        let hasUpdates = false;

        // Parse overridesJson or raw overrides
        if (data.overridesJson) {
          try {
            const parsed = JSON.parse(data.overridesJson);
            if (parsed && typeof parsed === 'object') {
              localStorage.setItem('internal_pages_overrides', JSON.stringify(parsed));
              hasUpdates = true;
            }
          } catch (e) {
            console.warn('Error parsing cloud overridesJson:', e);
          }
        } else if (data.overrides && typeof data.overrides === 'object' && Object.keys(data.overrides).length > 0) {
          localStorage.setItem('internal_pages_overrides', JSON.stringify(data.overrides));
          hasUpdates = true;
        }

        // Parse deleted
        if (data.deletedJson) {
          try {
            const parsedDeleted = JSON.parse(data.deletedJson);
            if (Array.isArray(parsedDeleted)) {
              localStorage.setItem('internal_pages_deleted', JSON.stringify(parsedDeleted));
              hasUpdates = true;
            }
          } catch (e) {}
        } else if (Array.isArray(data.deleted)) {
          localStorage.setItem('internal_pages_deleted', JSON.stringify(data.deleted));
          hasUpdates = true;
        }

        // Parse gradeClasses
        if (data.gradeClassesJson) {
          try {
            const parsedClasses = JSON.parse(data.gradeClassesJson);
            if (parsedClasses && typeof parsedClasses === 'object') {
              localStorage.setItem('grade_classes_overrides', JSON.stringify(parsedClasses));
              hasUpdates = true;
            }
          } catch (e) {}
        } else if (data.gradeClasses && typeof data.gradeClasses === 'object') {
          localStorage.setItem('grade_classes_overrides', JSON.stringify(data.gradeClasses));
          hasUpdates = true;
        }

        if (hasUpdates) {
          window.dispatchEvent(new Event('internal_pages_updated'));
          window.dispatchEvent(new Event('grade_classes_updated'));
          if (callback) callback();
        }
      }
    }, (err) => {
      console.warn('Page overrides Firestore subscription fallback:', err);
    });
    return unsub;
  } catch (err) {
    console.warn('Error setting up page overrides listener:', err);
    return () => {};
  }
};

export const syncPageOverrideToCloud = async (
  overrides: Record<string, InternalPage>,
  deleted: string[]
) => {
  try {
    await setDoc(doc(db, 'settings', 'pages_overrides'), {
      overridesJson: JSON.stringify(overrides),
      deletedJson: JSON.stringify(deleted),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Failed syncing page overrides to Firestore:', err);
  }
};

export const syncGradeClassesToCloud = async (gradeClasses: Record<string, any[]>) => {
  try {
    await setDoc(doc(db, 'settings', 'pages_overrides'), {
      gradeClassesJson: JSON.stringify(gradeClasses),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Failed syncing grade classes to Firestore:', err);
  }
};
