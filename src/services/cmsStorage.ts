import { Announcement } from '../types';
import { announcementsData } from '../data';
import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

const NEWS_STORAGE_KEY = 'arens_cms_news';

export const subscribeToNews = (callback: (news: Announcement[]) => void) => {
  try {
    const newsRef = collection(db, 'news');
    const unsubscribe = onSnapshot(
      newsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const news: Announcement[] = [];
          snapshot.forEach((docSnap) => {
            news.push({ ...(docSnap.data() as Announcement), id: docSnap.id });
          });
          localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(news));
          window.dispatchEvent(new Event('arens_cms_news_updated'));
          callback(news);
        } else {
          announcementsData.forEach(a => {
            setDoc(doc(db, 'news', a.id), a).catch(console.warn);
          });
          localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(announcementsData));
          callback(announcementsData);
        }
      },
      (error) => {
        console.warn('News real-time subscription fallback:', error);
        callback(getStoredNews());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Error setting up news listener:', err);
    callback(getStoredNews());
    return () => {};
  }
};

export const getStoredNews = (): Announcement[] => {
  try {
    const raw = localStorage.getItem(NEWS_STORAGE_KEY);
    if (!raw) return announcementsData;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (e) {
    console.error('Failed loading stored news:', e);
  }
  return announcementsData;
};

export const saveStoredNews = (news: Announcement[]): void => {
  try {
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(news));
    window.dispatchEvent(new Event('arens_cms_news_updated'));
  } catch (e) {
    console.error('Failed saving news to localStorage:', e);
  }
};

export const saveNewsArticle = async (article: Announcement): Promise<void> => {
  try {
    await setDoc(doc(db, 'news', article.id), article);
  } catch (err) {
    console.warn('Error saving news to Firestore:', err);
  }
  const current = getStoredNews();
  const idx = current.findIndex(n => n.id === article.id);
  let updated: Announcement[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = article;
  } else {
    updated = [article, ...current];
  }
  saveStoredNews(updated);
};

export const deleteNewsArticle = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'news', id));
  } catch (err) {
    console.warn('Error deleting news from Firestore:', err);
  }
  const current = getStoredNews();
  const updated = current.filter(n => n.id !== id);
  saveStoredNews(updated);
};

export const resetNewsToDefaults = async (): Promise<void> => {
  try {
    const current = getStoredNews();
    for (const item of current) {
      await deleteDoc(doc(db, 'news', item.id)).catch(console.warn);
    }
    for (const item of announcementsData) {
      await setDoc(doc(db, 'news', item.id), item).catch(console.warn);
    }
  } catch (err) {
    console.warn('Error resetting news in Firestore:', err);
  }
  saveStoredNews(announcementsData);
};


export const subscribeToSettings = (key: string, callback: (data: any) => void) => {
  try {
    const unsub = onSnapshot(doc(db, 'settings', key), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback(data);
      }
    });
    return unsub;
  } catch (err) {
    console.warn('Error listening to settings:', err);
    return () => {};
  }
};

export const saveSetting = async (key: string, data: any): Promise<void> => {
  try {
    await setDoc(doc(db, 'settings', key), data, { merge: true });
  } catch (err) {
    console.warn('Error saving setting to Firestore:', err);
  }
};
