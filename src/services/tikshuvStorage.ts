import { TikshuvGuide, TikshuvCoordinatorContact, TikshuvQuickLink } from '../types';
import { defaultTikshuvGuides, defaultTikshuvContact, defaultTikshuvQuickLinks } from '../data/defaultTikshuvData';
import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

const TIKSHUV_GUIDES_KEY = 'arens_tikshuv_guides_v2';
const TIKSHUV_SETTINGS_KEY = 'arens_tikshuv_settings_v2';
const TIKSHUV_LINKS_KEY = 'arens_tikshuv_links_v2';

export const getStoredTikshuvGuides = (): TikshuvGuide[] => {
  try {
    const raw = localStorage.getItem(TIKSHUV_GUIDES_KEY);
    if (!raw) return defaultTikshuvGuides;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (e) {
    console.error('Failed loading stored tikshuv guides:', e);
  }
  return defaultTikshuvGuides;
};

export const getStoredTikshuvContact = (): TikshuvCoordinatorContact => {
  try {
    const raw = localStorage.getItem(TIKSHUV_SETTINGS_KEY);
    if (!raw) return defaultTikshuvContact;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const merged = { ...defaultTikshuvContact, ...parsed };
      if (!merged.email || merged.email === 'me@ciznerguy.com' || merged.email.includes('ciznerguy.com')) {
        merged.email = 'ciznerguy@taded.org.il';
      }
      return merged;
    }
  } catch (e) {
    console.error('Failed loading stored tikshuv contact:', e);
  }
  return defaultTikshuvContact;
};

export const getStoredTikshuvQuickLinks = (): TikshuvQuickLink[] => {
  try {
    const raw = localStorage.getItem(TIKSHUV_LINKS_KEY);
    if (!raw) return defaultTikshuvQuickLinks;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (e) {
    console.error('Failed loading stored tikshuv quick links:', e);
  }
  return defaultTikshuvQuickLinks;
};

export const subscribeToTikshuvGuides = (callback: (guides: TikshuvGuide[]) => void) => {
  try {
    const guidesRef = collection(db, 'tikshuv_guides');
    const unsubscribe = onSnapshot(
      guidesRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: TikshuvGuide[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...(docSnap.data() as TikshuvGuide), id: docSnap.id });
          });
          // Sort: pinned first, then updated date
          list.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return (b.updatedAt || '').localeCompare(a.updatedAt || '');
          });
          localStorage.setItem(TIKSHUV_GUIDES_KEY, JSON.stringify(list));
          window.dispatchEvent(new Event('arens_tikshuv_guides_updated'));
          callback(list);
        } else {
          // Initialize Firestore with defaults
          defaultTikshuvGuides.forEach((g) => {
            setDoc(doc(db, 'tikshuv_guides', g.id), g).catch(console.warn);
          });
          localStorage.setItem(TIKSHUV_GUIDES_KEY, JSON.stringify(defaultTikshuvGuides));
          callback(defaultTikshuvGuides);
        }
      },
      (error) => {
        console.warn('Tikshuv guides real-time subscription fallback:', error);
        callback(getStoredTikshuvGuides());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Error setting up Tikshuv guides listener:', err);
    callback(getStoredTikshuvGuides());
    return () => {};
  }
};

export const subscribeToTikshuvContact = (callback: (contact: TikshuvCoordinatorContact) => void) => {
  try {
    const settingsDocRef = doc(db, 'tikshuv_settings', 'general');
    const unsubscribe = onSnapshot(
      settingsDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as TikshuvCoordinatorContact;
          const merged = { ...defaultTikshuvContact, ...data };
          if (!merged.email || merged.email === 'me@ciznerguy.com' || merged.email.includes('ciznerguy.com')) {
            merged.email = 'ciznerguy@taded.org.il';
            setDoc(settingsDocRef, merged).catch(console.warn);
          }
          localStorage.setItem(TIKSHUV_SETTINGS_KEY, JSON.stringify(merged));
          callback(merged);
        } else {
          setDoc(settingsDocRef, defaultTikshuvContact).catch(console.warn);
          localStorage.setItem(TIKSHUV_SETTINGS_KEY, JSON.stringify(defaultTikshuvContact));
          callback(defaultTikshuvContact);
        }
      },
      (error) => {
        console.warn('Tikshuv contact listener fallback:', error);
        callback(getStoredTikshuvContact());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Error in Tikshuv contact listener:', err);
    callback(getStoredTikshuvContact());
    return () => {};
  }
};

export const saveTikshuvGuide = async (guide: TikshuvGuide): Promise<void> => {
  const guideWithDate: TikshuvGuide = {
    ...guide,
    updatedAt: new Date().toISOString().split('T')[0]
  };

  // Local state update first
  const current = getStoredTikshuvGuides();
  const index = current.findIndex((g) => g.id === guide.id);
  let updated: TikshuvGuide[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = guideWithDate;
  } else {
    updated = [guideWithDate, ...current];
  }
  localStorage.setItem(TIKSHUV_GUIDES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('arens_tikshuv_guides_updated'));

  // Firestore update
  try {
    await setDoc(doc(db, 'tikshuv_guides', guide.id), guideWithDate);
  } catch (e) {
    console.warn('Firestore write failed for Tikshuv guide, cached locally:', e);
  }
};

export const deleteTikshuvGuide = async (guideId: string): Promise<void> => {
  const current = getStoredTikshuvGuides();
  const updated = current.filter((g) => g.id !== guideId);
  localStorage.setItem(TIKSHUV_GUIDES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('arens_tikshuv_guides_updated'));

  try {
    await deleteDoc(doc(db, 'tikshuv_guides', guideId));
  } catch (e) {
    console.warn('Firestore delete failed for Tikshuv guide, updated locally:', e);
  }
};

export const saveTikshuvContact = async (contact: TikshuvCoordinatorContact): Promise<void> => {
  localStorage.setItem(TIKSHUV_SETTINGS_KEY, JSON.stringify(contact));
  try {
    await setDoc(doc(db, 'tikshuv_settings', 'general'), contact);
  } catch (e) {
    console.warn('Firestore settings update error:', e);
  }
};

export const resetTikshuvGuidesToDefault = async (): Promise<void> => {
  localStorage.setItem(TIKSHUV_GUIDES_KEY, JSON.stringify(defaultTikshuvGuides));
  window.dispatchEvent(new Event('arens_tikshuv_guides_updated'));
  for (const g of defaultTikshuvGuides) {
    try {
      await setDoc(doc(db, 'tikshuv_guides', g.id), g);
    } catch (e) {
      console.warn('Error resetting guide:', e);
    }
  }
};
