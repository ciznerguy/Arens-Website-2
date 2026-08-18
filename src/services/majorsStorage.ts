import { SchoolMajor } from '../types';
import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

const MAJORS_STORAGE_KEY = 'arens_school_majors_v1';

export const DEFAULT_MAJORS: SchoolMajor[] = [
  // חטיבת ביניים
  {
    id: 'major-ms-cs',
    title: 'מדעי המחשב',
    division: 'middle_school',
    shortDescription: 'חשיפה לעולמות התכנות, אלגוריתמיקה, בינה מלאכותית ומחשבה חישובית.',
    fullDescription: 'מסלול מדעי המחשב בחטיבת הביניים מקנה יסודות מוצקים במחשבה חישובית, תכנות, פיתוח חשיבה לוגית ואלגוריתמית, והתנסות מעשית בפתרון בעיות טכנולוגיות.',
    icon: 'Cpu',
    highlights: [
      'יסודות תכנות ופיתוח אלגוריתמיקה',
      'מבוא לחשיבה חישובית ולוגיקה',
      'פיתוח פרויקטים מעשיים'
    ],
    targetGrades: "שכבות ז'-ט'",
    contactPerson: 'רכז מסלול מדעי המחשב חט״ב',
    hoursPerWeek: '4 שעות שבועיות',
    isFeatured: true
  },
  {
    id: 'major-ms-sport',
    title: 'ספורט',
    division: 'middle_school',
    shortDescription: 'פיתוח כושר גופני, מיומנויות ספורט מגוונות, אורח חיים בריא ומנהיגות.',
    fullDescription: 'מסלול ספורט בחטיבת הביניים המשלב אימוני כושר, ענפי ספורט קבוצתיים ואישיים, עקרונות תזונה נבונה ופיתוח ערכי מנהיגות, התמדה ועבודת צוות.',
    icon: 'Trophy',
    highlights: [
      'אימוני כושר גופני ופיתוח אתלטיקה',
      'ענפי ספורט קבוצתיים ואישיים',
      'אורח חיים בריא ומנהיגות ספורטיבית'
    ],
    targetGrades: "שכבות ז'-ט'",
    contactPerson: 'רכז מסלול ספורט חט״ב',
    hoursPerWeek: '4 שעות שבועיות',
    isFeatured: true
  },
  // חטיבה עליונה
  {
    id: 'major-hs-cs',
    title: 'מדעי המחשב והנדסת תוכנה',
    division: 'high_school',
    shortDescription: 'מגמה מדעית-טכנולוגית לבגרות - תכנות, מבני נתונים ואלגוריתמיקה מתקדמת.',
    fullDescription: 'מגמת מדעי המחשב והנדסת תוכנה בחטיבה העליונה מעניקה הכנה מקיפה לרמות הבגרות הגבוהות, הכוללת תכנות מונחה עצמים, אלגוריתמיקה, מבני נתונים ופרויקטי גמר.',
    icon: 'Laptop',
    highlights: [
      'לימודים לבגרות ברמה מוגברת',
      'תכנות מונחה עצמים ואלגוריתמיקה',
      'פרויקטי פיתוח ותוכנה'
    ],
    targetGrades: "שכבות י'-יב'",
    contactPerson: 'רכז מגמת מדעי המחשב והנדסת תוכנה',
    hoursPerWeek: '5-10 יח"ל לבגרות',
    isFeatured: true
  }
];

/**
 * Subscribe to Real-time School Majors
 */
export const subscribeToMajors = (callback: (majors: SchoolMajor[]) => void) => {
  try {
    const majorsRef = collection(db, 'majors');
    const unsubscribe = onSnapshot(
      majorsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const majors: SchoolMajor[] = [];
          snapshot.forEach((docSnap) => {
            majors.push({ ...(docSnap.data() as SchoolMajor), id: docSnap.id });
          });
          localStorage.setItem(MAJORS_STORAGE_KEY, JSON.stringify(majors));
          callback(majors);
        } else {
          // Initialize defaults
          DEFAULT_MAJORS.forEach(m => {
            setDoc(doc(db, 'majors', m.id), m).catch(console.warn);
          });
          callback(DEFAULT_MAJORS);
        }
      },
      (error) => {
        console.warn('Majors real-time subscription fallback:', error);
        callback(getStoredMajors());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Error setting up majors listener:', err);
    callback(getStoredMajors());
    return () => {};
  }
};

export const getStoredMajors = (): SchoolMajor[] => {
  try {
    const raw = localStorage.getItem(MAJORS_STORAGE_KEY);
    if (!raw) {
      saveStoredMajors(DEFAULT_MAJORS);
      return DEFAULT_MAJORS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed loading stored majors', e);
  }
  return DEFAULT_MAJORS;
};

export const saveStoredMajors = (majors: SchoolMajor[]) => {
  try {
    localStorage.setItem(MAJORS_STORAGE_KEY, JSON.stringify(majors));
  } catch (e) {
    console.error('Failed saving majors', e);
  }
};

export const addMajor = async (major: Omit<SchoolMajor, 'id'>): Promise<SchoolMajor> => {
  const all = getStoredMajors();
  const newMajor: SchoolMajor = {
    ...major,
    id: 'major-' + Date.now().toString(36)
  };
  
  try {
    await setDoc(doc(db, 'majors', newMajor.id), newMajor);
  } catch (err) {
    console.warn('Failed saving major to Firestore:', err);
  }

  const updated = [newMajor, ...all];
  saveStoredMajors(updated);
  return newMajor;
};

export const updateMajor = async (major: SchoolMajor): Promise<boolean> => {
  const all = getStoredMajors();
  const idx = all.findIndex(m => m.id === major.id);
  if (idx === -1) return false;
  
  try {
    await setDoc(doc(db, 'majors', major.id), major, { merge: true });
  } catch (err) {
    console.warn('Failed updating major in Firestore:', err);
  }

  all[idx] = major;
  saveStoredMajors(all);
  return true;
};

export const deleteMajor = async (majorId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'majors', majorId));
  } catch (err) {
    console.warn('Failed deleting major in Firestore:', err);
  }

  const all = getStoredMajors();
  const updated = all.filter(m => m.id !== majorId);
  saveStoredMajors(updated);
  return true;
};
