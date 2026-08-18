import { db } from './firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

/**
 * Subscribe to CMS Editors & Config from Firestore
 */
export const subscribeToAdminSettings = (callback?: () => void) => {
  try {
    const unsub = onSnapshot(doc(db, 'settings', 'admin_config'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.editors) {
          localStorage.setItem('arens_cms_editors', JSON.stringify(data.editors));
        }
        if (data.homepageSettings) {
          localStorage.setItem('arens_homepage_settings', JSON.stringify(data.homepageSettings));
        }
        if (data.heroBalls) {
          localStorage.setItem('arens_hero_balls', JSON.stringify(data.heroBalls));
        }
        if (data.customTheme) {
          localStorage.setItem('arens_school_custom_theme', JSON.stringify(data.customTheme));
        }
        if (callback) callback();
      }
    });
    return unsub;
  } catch (err) {
    console.warn('Admin settings Firestore subscription error:', err);
    return () => {};
  }
};

export const syncAdminConfigToCloud = async (key: string, value: any) => {
  try {
    await setDoc(doc(db, 'settings', 'admin_config'), {
      [key]: value
    }, { merge: true });
  } catch (err) {
    console.warn('Failed syncing admin config to Firestore:', err);
  }
};
