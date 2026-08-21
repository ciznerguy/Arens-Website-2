import { SchoolMajor } from '../types';
import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

const MAJORS_STORAGE_KEY = 'arens_school_majors_v3';

export const DEFAULT_MAJORS: SchoolMajor[] = [
  {
    id: 'major-software-eng',
    title: 'הנדסת תוכנה',
    division: 'high_school',
    shortDescription: 'תכנות מונחה עצמים, אלגוריתמיקה מתקדמת, מבני נתונים, פרויקטי גמר וסייבר.',
    fullDescription: 'מגמת הנדסת תוכנה ברמה מוגברת (5-10 יח"ל) מכשירה תלמידים בפיתוח מערכות תוכנה מורכבות, תכנות ב-Java/Python/C#, מבני נתונים, אלגוריתמיקה ופרויקטי גמר מעשיים.',
    icon: 'Code',
    highlights: [
      'תכנות מונחה עצמים ואלגוריתמיקה ברמה גבוהה',
      'מבני נתונים, מודלים חישוביים ומערכות מורכבות',
      'פרויקט גמר הנדסי ויישומי'
    ],
    targetGrades: "שכבות י'-יב'",
    contactPerson: 'גיא ציזנר',
    coordinatorName: 'גיא ציזנר',
    coordinatorContact: 'ciznerguy@taded.org.il',
    hoursPerWeek: '5-10 יח"ל לבגרות',
    isFeatured: true
  },
  {
    id: 'major-chemistry',
    title: 'כימיה',
    division: 'high_school',
    shortDescription: 'חקר מבנה החומר, תגובות כימיות, מעבדות מתקדמות, ננו-טכנולוגיה ותרופות.',
    fullDescription: 'מגמת כימיה מציעה לימוד מעמיק של מבנה האטום והקשר הכימי, אנרגיה, שיווי משקל, כימיה אורגנית, מעבדות חקר מתקדמות וקשר לתעשיית ההייטק והביוטק.',
    icon: 'FlaskConical',
    highlights: [
      'מעבדת חקר מעשית וניסויים אינטראקטיביים',
      'הבנת מבנה החומר ותהליכים כימיים מורכבים',
      'חיבור לתעשיית התרופות, הננו-טכנולוגיה והאנרגיה'
    ],
    targetGrades: "שכבות י'-יב'",
    contactPerson: 'נירית גרובר',
    coordinatorName: 'נירית גרובר',
    coordinatorContact: 'niritrdt@gmail.com',
    hoursPerWeek: '5 יח"ל לבגרות',
    isFeatured: true
  },
  {
    id: 'major-biology',
    title: 'ביולוגיה',
    division: 'high_school',
    shortDescription: 'חקר מערכות החיים, גנטיקה, אקולוגיה, פיזיולוגיה של האדם וביוטכנולוגיה.',
    fullDescription: 'מגמת ביולוגיה מעניקה הבנה מעמיקה במערכות גוף האדם, התא, אקולוגיה, גנטיקה, אבולוציה וביוטכנולוגיה, תוך שילוב עבודות מעבדה מקיפות ומחקר שדה.',
    icon: 'Dna',
    highlights: [
      'ביולוגיה של האדם, התא והתורשה (גנטיקה)',
      'מעבדות חקר ביולוגיות וסיורי שדה אקולוגיים',
      'עבודת ביוחקר אישית יישומית'
    ],
    targetGrades: "שכבות י'-יב'",
    contactPerson: 'גיל דוידוביץ\'',
    coordinatorName: 'גיל דוידוביץ\'',
    coordinatorContact: 'gil.davidovitz@gmail.com',
    hoursPerWeek: '5 יח"ל לבגרות',
    isFeatured: true
  },
  {
    id: 'major-pe',
    title: 'חנ"ג',
    division: 'high_school',
    shortDescription: 'חינוך גופני מוגבר, פיזיולוגיה של המאמץ, אנטומיה, תזונת ספורט ומנהיגות.',
    fullDescription: 'מגמת חינוך גופני (חנ"ג מוגבר) משלבת ידע עיוני מעמיק באנטומיה, פיזיולוגיה ופסיכולוגיה של הספורט, יחד עם אימונים מעשיים, מיומנויות הדרכה והובלת אורח חיים ספורטיבי.',
    icon: 'Trophy',
    highlights: [
      'אנטומיה, פיזיולוגיה של המאמץ ותורת האימון',
      'התנסות בענפי ספורט מגוונים ואימוני כושר מתקדמים',
      'הסמכה והדרכה בתחום הספורט והבריאות'
    ],
    targetGrades: "שכבות י'-יב'",
    contactPerson: 'תומר נעמן',
    coordinatorName: 'תומר נעמן',
    coordinatorContact: 'tomertna19922@gmail.com',
    hoursPerWeek: '5 יח"ל לבגרות',
    isFeatured: true
  },
  {
    id: 'major-physics',
    title: 'פיזיקה',
    division: 'high_school',
    shortDescription: 'מכניקה, אלקטרומגנטיות, קרינה וחומר, אופטיקה ופיזיקה מודרנית.',
    fullDescription: 'מגמת הפיזיקה מקנה ידע מדעי מעמיק בחוקי הטבע, ניסויי מעבדה מתקדמים, פיתוח חשיבה אנליטית וכמותית, ומבוא לתחומי הנדסה ומדעים מדויקים.',
    icon: 'Atom',
    highlights: [
      'מכניקה, חשמל ומגנטיות ברמה מוגברת',
      'מעבדות חקר וניסויים מעשיים',
      'פיזיקה מודרנית, קרינה וחומר'
    ],
    targetGrades: "שכבות י'-יב'",
    contactPerson: 'תומר ברגהאוס',
    coordinatorName: 'תומר ברגהאוס',
    coordinatorContact: 't.berghaus@gmail.com',
    hoursPerWeek: '5 יח"ל לבגרות',
    isFeatured: true
  },
  {
    id: 'major-data-analyst',
    title: 'דאטה אנליסט',
    division: 'high_school',
    shortDescription: 'מגמת דאטה אנליסט, ניתוח נתונים מתקדם, סטטיסטיקה יישומית ובינה מלאכותית.',
    fullDescription: 'מגמת דאטה אנליסט (מידע ונתונים) מקנה כלים מעשיים ומתקדמים לעבודה עם מאגרי נתונים, עיבוד וניתוח מידע, מודלים סטטיסטיים, הדמיות נתונים ואלגוריתמים לקבלת החלטות.',
    icon: 'Database',
    highlights: [
      'איסוף, עיבוד וניתוח מאגרי נתונים (Big Data)',
      'סטטיסטיקה יישומית והדמיות נתונים מתקדמות',
      'שימוש בכלים טכנולוגיים מובילים בתעשייה'
    ],
    targetGrades: "שכבות י'-יב'",
    contactPerson: 'אילת דניאל (ליפסקי) ומשה מנשה',
    coordinatorName: 'אילת דניאל (ליפסקי) ומשה מנשה',
    coordinatorContact: 'ayelet.daniel@gmail.com',
    hoursPerWeek: '5 יח"ל לבגרות',
    isFeatured: true
  },
  {
    id: 'major-business-econ',
    title: 'מנהל וכלכלה',
    division: 'high_school',
    shortDescription: 'יסודות הכלכלה, שוק ההון, ניהול עסקי, יזמות ושיווק בעידן הדיגיטלי.',
    fullDescription: 'מגמת מנהל וכלכלה מעניקה ידע מעשי בעולם הפיננסים, חשיבה עסקית, עקרונות מיקרו ומאקרו כלכלה, ניתוח דוחות כספיים ופיתוח מיזמים עסקיים.',
    icon: 'TrendingUp',
    highlights: [
      'עקרונות המיקרו והמאקרו כלכלה ושוק ההון',
      'ניהול עסקי, יזמות, שיווק ואסטרטגיה',
      'עבודת חקר ופרויקט יזמי מעשי'
    ],
    targetGrades: "שכבות י'-יב'",
    contactPerson: 'רז קצב',
    coordinatorName: 'רז קצב',
    coordinatorContact: 'razkyk007@gmail.com',
    hoursPerWeek: '5 יח"ל לבגרות',
    isFeatured: true
  },
  {
    id: 'major-social-sciences',
    title: 'מדעי החברה',
    division: 'high_school',
    shortDescription: 'פסיכולוגיה, סוציולוגיה, הבנת נפש האדם, מבנה החברה ומחקר מדעי.',
    fullDescription: 'מגמת מדעי החברה משלבת לימודי פסיכולוגיה וסוציולוגיה. התלמידים חוקרים התנהגות אנושית, תהליכים חברתיים, זהות אישית, קבוצות ומבצעים עבודת מחקר יישומית.',
    icon: 'Users',
    highlights: [
      'לימודי פסיכולוגיה: תהליכי תפיסה, למידה, הנעה ורגש',
      'לימודי סוציולוגיה: תרבות, חברות, משפחה ושינויים חברתיים',
      'עבודת חקר עצמאית מונחית'
    ],
    targetGrades: "שכבות י'-יב'",
    contactPerson: 'איילה ברונשטיין ואורה שוורץ',
    coordinatorName: 'איילה ברונשטיין ואורה שוורץ',
    coordinatorContact: 'ayalabronstein@gmail.com',
    hoursPerWeek: '5 יח"ל לבגרות',
    isFeatured: true
  },
  {
    id: 'major-cyber-geo',
    title: 'סייבר גיאוגרפיה',
    division: 'high_school',
    shortDescription: 'מערכות מידע גיאוגרפיות (GIS), ניתוח מרחבי, חישה מרחוק וסייבר גאוגרפי.',
    fullDescription: 'מגמה ייחודית המשלבת גיאוגרפיה אדם-סביבה יחד עם טכנולוגיות מיפוי ממוחשב, חישה מרחוק, ניתוח נתוני לוויין וסייבר מרחבי.',
    icon: 'Globe',
    highlights: [
      'מערכות GIS ומיפוי דיגיטלי מתקדם',
      'חישה מרחוק וניתוח תצלומי לוויין',
      'תכנון מרחבי, סביבה וגיאופוליטיקה'
    ],
    targetGrades: "שכבות י'-יב'",
    contactPerson: 'שחר צור ואורנה גינדי',
    coordinatorName: 'שחר צור ואורנה גינדי',
    coordinatorContact: 'shahar.tzur1@gmail.com',
    hoursPerWeek: '5 יח"ל לבגרות',
    isFeatured: true
  },
  {
    id: 'major-arabic',
    title: 'ערבית',
    division: 'high_school',
    shortDescription: 'השפה והתרבות הערבית, תקשורת, עיתונות, מודיעין וספרות עשירה.',
    fullDescription: 'מגמת ערבית ברמה מוגברת מכשירה את התלמידים בהבנת הנקרא והנשמע, שפה תקשורתית וספרותית, היכרות מעמיקה עם המזרח התיכון ואופק להשתלבות ביחידות מודיעין מובחרות.',
    icon: 'Languages',
    highlights: [
      'שפה עשירה: ערבית ספרותית ותקשורתית',
      'הכרת התרבות, האקטואליה וההיסטוריה של המזרח התיכון',
      'הכנה לקראת מיונים ליחידות מודיעין וטכנולוגיה'
    ],
    targetGrades: "שכבות י'-יב'",
    contactPerson: 'נירה פרקש',
    coordinatorName: 'נירה פרקש',
    coordinatorContact: 'nniirraa@gmail.com',
    hoursPerWeek: '5 יח"ל לבגרות',
    isFeatured: true
  },
  {
    id: 'major-theater',
    title: 'תיאטרון ומחזות זמר',
    division: 'high_school',
    shortDescription: 'אמנויות הבמה, בימוי, משחק, שירה, תנועה והפקת מחזות זמר מקוריים.',
    fullDescription: 'מגמת תיאטרון ומחזות זמר משלבת עבודה מעשית ואינטנסיבית על אמנויות הבמה: משחק, פיתוח קול, כוריאוגרפיה, כתיבה דרמטית, בימוי והפקות במה מלאות.',
    icon: 'Sparkles',
    highlights: [
      'סדנאות משחק, שירה, פיתוח קול ותנועה',
      'בימוי, כתיבה דרמטית וניתוח טקסטים',
      'הפקת מופע גמר ומחזמר שנתי מול קהל'
    ],
    targetGrades: "שכבות י'-יב'",
    contactPerson: 'מוטי חובה ופסי טל',
    coordinatorName: 'מוטי חובה ופסי טל',
    coordinatorContact: 'motyhova@gmail.com',
    hoursPerWeek: '5 יח"ל לבגרות',
    isFeatured: true
  }
];

/**
 * Reset and Seed all 11 official majors into Firestore
 */
export const resetToOfficialMajors = async (): Promise<SchoolMajor[]> => {
  try {
    // 1. Delete old mock majors if exist
    const oldIds = ['major-ms-cs', 'major-ms-sport', 'major-hs-cs'];
    for (const oldId of oldIds) {
      try {
        await deleteDoc(doc(db, 'majors', oldId));
      } catch (e) {
        // ignore
      }
    }

    // 2. Set all 11 default majors
    for (const m of DEFAULT_MAJORS) {
      await setDoc(doc(db, 'majors', m.id), m, { merge: true });
    }

    saveStoredMajors(DEFAULT_MAJORS);
    return DEFAULT_MAJORS;
  } catch (err) {
    console.warn('Error resetting to official majors:', err);
    saveStoredMajors(DEFAULT_MAJORS);
    return DEFAULT_MAJORS;
  }
};

/**
 * Subscribe to Real-time School Majors
 */
export const subscribeToMajors = (callback: (majors: SchoolMajor[]) => void) => {
  // 1. Initial synchronous call
  callback(getStoredMajors());

  // 2. Custom local event listener for instant UI updates
  const handleLocalUpdate = (e: Event) => {
    const customEvent = e as CustomEvent<SchoolMajor[]>;
    if (customEvent.detail && Array.isArray(customEvent.detail)) {
      callback(customEvent.detail);
    } else {
      callback(getStoredMajors());
    }
  };

  window.addEventListener('majors_updated', handleLocalUpdate);
  window.addEventListener('storage', handleLocalUpdate);

  try {
    const majorsRef = collection(db, 'majors');
    const unsubscribe = onSnapshot(
      majorsRef,
      async (snapshot) => {
        if (!snapshot.empty) {
          const majors: SchoolMajor[] = [];
          snapshot.forEach((docSnap) => {
            majors.push({ ...(docSnap.data() as SchoolMajor), id: docSnap.id });
          });

          // Check if it's the old 3 mock items or missing the official 11 majors
          const hasOldMocks = majors.some(m => m.id === 'major-ms-cs' || m.id === 'major-ms-sport');
          const hasDataAnalyst = majors.some(m => m.id === 'major-data-analyst');

          if (hasOldMocks || (!hasDataAnalyst && majors.length < 11)) {
            // Auto-migrate to 11 official majors in Firestore
            const synced = await resetToOfficialMajors();
            callback(synced);
            return;
          }

          localStorage.setItem(MAJORS_STORAGE_KEY, JSON.stringify(majors));
          callback(majors);
        } else {
          // Initialize defaults
          const synced = await resetToOfficialMajors();
          callback(synced);
        }
      },
      (error) => {
        console.warn('Majors real-time subscription fallback:', error);
        callback(getStoredMajors());
      }
    );
    return () => {
      window.removeEventListener('majors_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
      unsubscribe();
    };
  } catch (err) {
    console.warn('Error setting up majors listener:', err);
    return () => {
      window.removeEventListener('majors_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
    };
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
    window.dispatchEvent(new CustomEvent('majors_updated', { detail: majors }));
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
  
  const updated = [newMajor, ...all];
  saveStoredMajors(updated);

  try {
    await setDoc(doc(db, 'majors', newMajor.id), newMajor);
  } catch (err) {
    console.warn('Failed saving major to Firestore:', err);
  }

  return newMajor;
};

export const updateMajor = async (major: SchoolMajor): Promise<boolean> => {
  const all = getStoredMajors();
  const idx = all.findIndex(m => m.id === major.id);
  if (idx === -1) {
    all.push(major);
  } else {
    all[idx] = major;
  }
  
  saveStoredMajors(all);

  try {
    await setDoc(doc(db, 'majors', major.id), major, { merge: true });
  } catch (err) {
    console.warn('Failed updating major in Firestore:', err);
  }

  return true;
};

export const deleteMajor = async (majorId: string): Promise<boolean> => {
  const all = getStoredMajors();
  const updated = all.filter(m => m.id !== majorId);
  saveStoredMajors(updated);

  try {
    await deleteDoc(doc(db, 'majors', majorId));
  } catch (err) {
    console.warn('Failed deleting major in Firestore:', err);
  }

  return true;
};
