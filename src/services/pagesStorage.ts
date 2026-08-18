import { InternalPage } from '../types';
import { db } from './firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { getInternalPageOverrides, getDeletedPageKeys } from '../data/internalPages';

/**
 * Subscribe to Real-Time Page Overrides and Grade Classes from Firestore
 */
export const subscribeToPageOverrides = (callback?: () => void) => {
  try {
    const unsub = onSnapshot(doc(db, 'settings', 'pages_overrides'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.overrides) {
          localStorage.setItem('internal_pages_overrides', JSON.stringify(data.overrides));
        }
        if (data.deleted) {
          localStorage.setItem('internal_pages_deleted', JSON.stringify(data.deleted));
        }
        if (data.gradeClasses) {
          localStorage.setItem('grade_classes_overrides', JSON.stringify(data.gradeClasses));
        }
        window.dispatchEvent(new Event('internal_pages_updated'));
        window.dispatchEvent(new Event('grade_classes_updated'));
        if (callback) callback();
      }
    });
    return unsub;
  } catch (err) {
    console.warn('Page overrides Firestore subscription fallback:', err);
    return () => {};
  }
};

export const syncPageOverrideToCloud = async (
  overrides: Record<string, InternalPage>,
  deleted: string[]
) => {
  try {
    await setDoc(doc(db, 'settings', 'pages_overrides'), {
      overrides,
      deleted
    }, { merge: true });
  } catch (err) {
    console.warn('Failed syncing page overrides to Firestore:', err);
  }
};

export const syncGradeClassesToCloud = async (gradeClasses: Record<string, any[]>) => {
  try {
    await setDoc(doc(db, 'settings', 'pages_overrides'), {
      gradeClasses
    }, { merge: true });
  } catch (err) {
    console.warn('Failed syncing grade classes to Firestore:', err);
  }
};
