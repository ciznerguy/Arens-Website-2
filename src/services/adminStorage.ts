import { db } from './firebase';
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';

export interface Editor {
  email: string;
  name: string;
  role: string;
}

export const DEFAULT_EDITORS: Editor[] = [
  { email: '1003045545@taded.org.il', name: 'מנהל ראשי', role: 'מנהל ראשי' },
  { email: 'orly.raz.1010@gmail.com', name: 'ח אורלי', role: 'רכז שכבה יב\'' },
  { email: 'kamilroy35@gmail.com', name: 'שקל ששון נאוה', role: 'מנהל מערכת' }
];

/**
 * Get stored editors from cache or defaults
 */
export const getStoredEditors = (): Editor[] => {
  try {
    const raw = localStorage.getItem('arens_cms_editors');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed reading stored editors', e);
  }
  return DEFAULT_EDITORS;
};

/**
 * Subscribe to CMS Editors & Config from Firestore in real-time
 */
export const subscribeToAdminSettings = (callback?: (editors: Editor[]) => void) => {
  try {
    const unsub = onSnapshot(doc(db, 'settings', 'admin_config'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();

        if (data.editors && Array.isArray(data.editors) && data.editors.length > 0) {
          localStorage.setItem('arens_cms_editors', JSON.stringify(data.editors));
          window.dispatchEvent(new CustomEvent('arens_cms_editors_updated', { detail: data.editors }));
          if (callback) callback(data.editors);
        } else {
          // If document exists but has no editors yet, bootstrap it once with the canonical editors
          syncAdminConfigToCloud('editors', DEFAULT_EDITORS);
        }
        if (data.homepageSettings) {
          localStorage.setItem('arens_homepage_settings', JSON.stringify(data.homepageSettings));
          window.dispatchEvent(new Event('homepage_settings_updated'));
        }
        if (data.heroBalls) {
          localStorage.setItem('arens_hero_balls', JSON.stringify(data.heroBalls));
          window.dispatchEvent(new Event('hero_balls_updated'));
        }
        if (data.customTheme) {
          localStorage.setItem('arens_school_custom_theme', JSON.stringify(data.customTheme));
          window.dispatchEvent(new Event('arens_school_theme_updated'));
        }
      } else {
        // Bootstrap initial document on Firestore
        syncAdminConfigToCloud('editors', DEFAULT_EDITORS);
      }
    }, (err) => {
      console.warn('Admin settings Firestore subscription error:', err);
    });
    return unsub;
  } catch (err) {
    console.warn('Admin settings Firestore subscription setup error:', err);
    return () => {};
  }
};

/**
 * Write configuration directly to Firestore cloud
 */
export const syncAdminConfigToCloud = async (key: string, value: any) => {
  try {
    // Update local storage immediately for fast UI feedback
    if (key === 'editors' && Array.isArray(value)) {
      localStorage.setItem('arens_cms_editors', JSON.stringify(value));
      window.dispatchEvent(new CustomEvent('arens_cms_editors_updated', { detail: value }));
    }
    // Write directly to cloud Firestore
    await setDoc(doc(db, 'settings', 'admin_config'), {
      [key]: value,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Failed syncing admin config to Firestore:', err);
  }
};

/**
 * Fetch latest admin config from Firestore directly
 */
export const fetchAdminConfigFromCloud = async () => {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'admin_config'));
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.editors && Array.isArray(data.editors) && data.editors.length > 0) {
        localStorage.setItem('arens_cms_editors', JSON.stringify(data.editors));
        window.dispatchEvent(new CustomEvent('arens_cms_editors_updated', { detail: data.editors }));
      }
      return data;
    }
  } catch (e) {
    console.warn('Could not fetch admin config from cloud:', e);
  }
  return null;
};
