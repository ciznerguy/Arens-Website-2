import { Announcement, EventItem, GradeLevel, LearningSpace, QuickLink, GalleryPhoto, StaffMember } from './types';
import { allTeachersList } from './data/teachersList';

export const schoolLogoSvg = `
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-school-cyan">
  <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="4" fill="#0d1424" />
  <circle cx="50" cy="50" r="40" stroke="#818cf8" stroke-width="2" />
  <path d="M30 45 L50 25 L70 45 L50 65 Z" fill="#22d3ee" opacity="0.15" />
  <path d="M50 22 L50 78" stroke="#22d3ee" stroke-width="2" />
  <path d="M30 45 H70" stroke="#22d3ee" stroke-width="1.5" />
  <path d="M35 55 C42 55 46 59 50 62 C54 59 58 55 65 55 V42 C58 42 54 45 50 48 C46 45 42 42 35 42 Z" fill="#e2e8f0" stroke="#0d1424" stroke-width="1.5" />
  <ellipse cx="50" cy="38" rx="14" ry="4" transform="rotate(30 50 38)" stroke="#818cf8" stroke-width="1.5" fill="none" />
  <ellipse cx="50" cy="38" rx="14" ry="4" transform="rotate(-30 50 38)" stroke="#818cf8" stroke-width="1.5" fill="none" />
  <circle cx="50" cy="38" r="2.5" fill="#22d3ee" />
</svg>
`;

export interface NewsArticle {
  title: string;
  content: string;
  imageUrl: string;
  url?: string;
}

// 4 Custom-designed homepage ticker updates with full details
export const schoolNewsArticles: NewsArticle[] = [
  {
    title: "הרשמה למגמת סייבר ובינה מלאכותית",
    content: "ההרשמה למגמת סייבר ובינה מלאכותית לשנת הלימודים הבאה בעיצומה. נותרו מקומות אחרונים, מהרו להירשם ולהבטיח את מקומכם בתכנית המצטיינים המובילה!",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80",
    url: "course/cyber-signup"
  },
  {
    title: "גמר אליפות הרובוטיקה הארצית",
    content: "נבחרת הרובוטיקה הבית-ספרית של משה ארנס קטפה את המקום הראשון בגמר הארצי ותייצג את ישראל בגאווה רבה בתחרות העולמית הקרובה!",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80",
    url: "course/robotics-championship"
  },
  {
    title: "הישגים יוצאי דופן בבחינות הבגרות",
    content: "גאווה מקומית עצומה: הישג של 100% זכאות לבגרות לתלמידי מחזור ט\' המצטיינים במקצועות המדעים, הטכנולוגיה, הסייבר והפיזיקה!",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80",
    url: "course/bagrut-achievements"
  },
  {
    title: "יריד הקיימות השנתי \'אקו-ארנס\'",
    content: "השבוע התקיים יריד הקיימות הענק \'אקו-ארנס\' בהובלה מלאה של תלמידינו, המציגים פתרונות ירוקים, חדשניים ואקולוגיים לעולם נקי ובריא יותר.",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80",
    url: "course/eco-arens"
  }
];

export const announcementsData: Announcement[] = [
  {
    id: 'ann-1',
    title: 'פותחים את שנת הלימודים בהתרגשות עצומה!',
    content: 'אנו מברכים את כל קהילת בית הספר בשש-שנתי משה ארנס פתח תקווה בשנת לימודים פורייה, מהנה ומוצלחת. צוות בית הספר נרגש לקבל את פני התלמידים וההורים למרחב של מצוינות מדעית, טכנולוגית וחברתית.',
    date: '2026-07-06',
    category: 'כללי',
    author: 'נאוה שקל ששון, מנהלת בית הספר',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ann-2',
    title: 'חגיגת הקיימות השנתית של ביה"ס "אקו-ארנס"',
    content: 'יריד קיימות קהילתי חגיגי הכולל דוכני מיחזור, פרויקטים אקולוגיים וסדנאות ירוקות שהכינו תלמידי בית הספר. תודה לכל המשתתפים, ההורים והתלמידים שלקחו חלק ביוזמה החשובה למען הסביבה שלנו.',
    date: '2026-07-05',
    category: 'חברתי',
    author: 'צוות חינוך חברתי',
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4486622410?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ann-3',
    title: 'חדר הפודקאסט של ארנס – הקול שלכם נשמע!',
    content: 'אנו גאים להשיק את חדר הפודקאסטים הבית ספרי החדש של ארנס. במרחב ייחודי זה תלמידי בית הספר מקליטים פודקאסטים, מראיינים אנשי חינוך ורוח, ודנים בנושאים חברתיים, אקטואליים ומדעיים המעניינים אותם.',
    date: '2026-07-04',
    category: 'פדגוגי',
    author: 'צוות תקשורת וקולנוע',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800'
  }
];

export const gradesData: GradeLevel[] = [
  {
    grade: 'ז',
    coordinator: "רועי רותם",
    description: "שכבת המעבר וההסתגלות לבית הספר. דגש על רכישת מיומנויות למידה עצמאיות, גיבוש חברתי, והכרת מסלולי הייחודיות השונים של בית הספר.",
    classes: [
      { id: 'z1', name: "ז' 1 - מדעי-טכנולוגי", homeroomTeacher: 'מחנכ/ת הכיתה', room: 'קומה 1, חדר 101', specialty: 'סייבר מטריקס ורובוטיקה' },
      { id: 'z2', name: "ז' 2 - כיתת מופת", homeroomTeacher: 'מחנכ/ת הכיתה', room: 'קומה 1, חדר 102', specialty: 'מצוינות מתמטית-מדעית' },
      { id: 'z3', name: "ז' 3 - ספורט והישגיות", homeroomTeacher: 'מחנכ/ת הכיתה', room: 'קומה 1, חדר 103', specialty: 'חינוך גופני ומנהיגות' },
      { id: 'z4', name: "ז' 4 - כיתה עיונית", homeroomTeacher: 'מחנכ/ת הכיתה', room: 'קומה 1, חדר 104' },
      { id: 'z5', name: "ז' 5 - אומנויות הבמה והקולנוע", homeroomTeacher: 'מחנכ/ת הכיתה', room: 'קומה 1, חדר 105', specialty: 'תיאטרון, קולנוע ומוזיקה' },
      { id: 'z6', name: "ז' 6 - רצים לחיים", homeroomTeacher: 'מחנכ/ת הכיתה', room: 'קומה 1, חדר 106', specialty: 'יזמות ומעורבות חברתית' }
    ]
  },
  {
    grade: 'ח',
    coordinator: "איריס שחמון ורינת שטקל",
    description: "שכבת העומק הטכנולוגי והחקר. תלמידי השכבה מובילים פרויקטים של מעורבות קהילתית, משתתפים בסדנאות ומפתחים חשיבה ביקורתית.",
    classes: [
      { id: 'h1', name: "ח' 1 - מדעית-טכנולוגית", homeroomTeacher: 'מחנכ/ת הכיתה', room: 'קומה 2, חדר 201', specialty: 'עמ"ט (מדעית-טכנולוגית)' },
      { id: 'h2', name: "ח' 2 - כיתת מופת", homeroomTeacher: 'מחנכ/ת הכיתה', room: 'קומה 2, חדר 202', specialty: 'שביט מצוינות מדעית' },
      { id: 'h3', name: "ח' 3 - סייבר קוד", homeroomTeacher: 'מחנכ/ת הכיתה', room: 'קומה 2, חדר 203', specialty: 'סייבר מטריקס' },
      { id: 'h4', name: "ח' 4 - כיתה עיונית", homeroomTeacher: 'מחנכ/ת הכיתה', room: 'קומה 2, חדר 204' },
      { id: 'h5', name: "ח' 5 - מנהיגות חברתית", homeroomTeacher: 'מחנכ/ת הכיתה', room: 'קומה 2, חדר 205', specialty: 'שגרירים צעירים ודיבייט' }
    ]
  },
  {
    grade: 'ט',
    coordinator: "נדב גורן וסמדר קקון",
    description: "שכבת הבוגרים והכנה לחטיבה העליונה. גיבוש זהות אישית ואזרחית, עבודות גמר, ליווי ומנהיגות של השכבות הצעירות, והתכוננות לקראת בחירת מגמות בבית הספר השש-שנתי.",
    classes: [
      { id: 't1', name: "ט' 1 - סייבר ומדעים", homeroomTeacher: 'מחנכ/ת הכיתה', room: 'קומה 3, חדר 301', specialty: 'סייבר מטריקס ופיזיקה' },
      { id: 't2', name: "ט' 2 - כיתת מופת", homeroomTeacher: 'מחנכ/ת הכיתה', room: 'קומה 3, חדר 302', specialty: 'מתמטיקה מואצת' },
      { id: 't3', name: "ט' 3 - דיפלומטיה ויחב\"ל", homeroomTeacher: 'מחנכ/ת הכיתה', room: 'קומה 3, חדר 303', specialty: 'מועדון דיבייט ואנגלית מוגברת' },
      { id: 't4', name: "ט' 4 - כיתה עיונית", homeroomTeacher: 'מחנכ/ת הכיתה', room: 'קומה 3, חדר 304' },
      { id: 't5', name: "ט' 5 - יזמות וניהול", homeroomTeacher: 'מחנכ/ת הכיתה', room: 'קומה 3, חדר 305', specialty: 'ניהול עסקי וכלכלה' }
    ]
  },
  {
    grade: 'י',
    coordinator: "נירית גרובר",
    description: "כניסה לחטיבה העליונה. דגש על היבחנות, בחירת מגמות מורחבות ובניית זהות בוגרת לקראת תעודת בגרות איכותית.",
    classes: [
      { id: 'y1', name: "י' 1 - סייבר מורחב", homeroomTeacher: 'מחנכ/ת שכבה י', room: 'קומה 4, חדר 401', specialty: 'פיזיקה מוגברת וסייבר' },
      { id: 'y2', name: "י' 2 - כיתת מופת", homeroomTeacher: 'מחנכ/ת שכבה י', room: 'קומה 4, חדר 402', specialty: 'מתמטיקה ומחשבים' },
      { id: 'y3', name: "י' 3 - דיפלומטיה", homeroomTeacher: 'מחנכ/ת שכבה י', room: 'קומה 4, חדר 403', specialty: 'יחב\"ל ותקשורת' },
      { id: 'y4', name: "י' 4 - חינוך גופני", homeroomTeacher: 'מחנכ/ת שכבה י', room: 'קומה 4, חדר 404', specialty: 'אימון ספורטיבי ומנהיגות' }
    ]
  },
  {
    grade: 'יא',
    coordinator: "ניר מלכה",
    description: "שנת שיא במבחני הבגרות, סיורים לימודיים ממוקדים, גיבוש שכבתי והעמקה מקצועית במגמות הטכנולוגיות וההומניסטיות.",
    classes: [
      { id: 'ya1', name: "יא' 1 - הנדסת תוכנה", homeroomTeacher: 'מחנכ/ת שכבה יא', room: 'קומה 4, חדר 405', specialty: 'סייבר ופיתוח אפליקציות' },
      { id: 'ya2', name: "יא' 2 - פיזיקה יישומית", homeroomTeacher: 'מחנכ/ת שכבה יא', room: 'קומה 4, חדר 406', specialty: 'מערכות רובוטיות וחקר' },
      { id: 'ya3', name: "יא' 3 - תיאטרון מורחב", homeroomTeacher: 'מחנכ/ת שכבה יא', room: 'קומה 4, חדר 407', specialty: 'תיאטרון ואומנויות הבמה' },
      { id: 'ya4', name: "יא' 4 - חינוך גופני", homeroomTeacher: 'מחנכ/ת שכבה יא', room: 'קומה 4, חדר 408', specialty: 'פיזיולוגיה וכושר גופני' }
    ]
  },
  {
    grade: 'יב',
    coordinator: "אורלי רז",
    description: "שנת הסיום המרגשת. הכנה לגיוס ולשירות משמעותי, עבודות גמר יצירתיות, ופרויקטים ייחודיים המהווים חותם חינוכי בבית הספר.",
    classes: [
      { id: 'yb1', name: "יב' 1 - פיתוח והייטק", homeroomTeacher: 'מחנכ/ת שכבה יב', room: 'קומה 5, חדר 501', specialty: 'אלגוריתמיקה ואבטחת מידע' },
      { id: 'yb2', name: "יב' 2 - הנדסת חלל", homeroomTeacher: 'מחנכ/ת שכבה יב', room: 'קומה 5, חדר 502', specialty: 'אווירונאוטיקה ע\"ש משה ארנס' },
      { id: 'yb3', name: "יב' 3 - קולנוע וניו-מדיה", homeroomTeacher: 'מחנכ/ת שכבה יב', room: 'קומה 5, חדר 503', specialty: 'בימוי והפקה דוקומנטרית' },
      { id: 'yb4', name: "יב' 4 - יזמות וכלכלה", homeroomTeacher: 'מחנכ/ת שכבה יב', room: 'קומה 5, חדר 504', specialty: 'ניהול עסקי וכלכלה' }
    ]
  }
];

export const learningSpacesData: LearningSpace[] = [
  {
    id: 'space-cyber',
    name: 'סייבר מטריקס: הדור הבא של עולם ההייטק',
    coordinator: 'רכז/ת התחום',
    iconName: 'Cpu',
    description: 'מסלול הדגל הטכנולוגי המכשיר את תלמידי בית הספר בעולמות הפיתוח, התכנות, האלגוריתמיקה ואבטחת המידע (סייבר הגנתי). התלמידים נחשפים לטכנולוגיות מתקדמות וחשיבה לוגית ברמה גבוהה.',
    topics: ['יסודות התכנות והקוד', 'מבוא לרשתות ואבטחת מידע', 'סייבר הגנתי ואלגוריתמיקה', 'חשיבה טכנולוגית יישומית'],
    resources: [
      { title: 'פורטל הלמידה של משרד החינוך', url: 'https://students.education.gov.il/' },
      { title: 'מערכת משוב למעקב פדגוגי', url: 'https://web.mashov.info/' }
    ]
  },
  {
    id: 'space-robotics',
    name: 'מסלול רובוטיקה: העתיד מתחיל כאן',
    coordinator: 'רכז/ת התחום',
    iconName: 'Wrench',
    description: 'תכנית ייחודית שבה תלמידי בית הספר מתנסים בתכנון, בנייה מכנית ותכנות של מערכות רובוטיות אוטונומיות. המסלול משלב הדמיה, עבודה מעשית ופיתוח מיומנויות פתרון בעיות ועבודת צוות.',
    topics: ['תכנון ובנייה מכנית', 'תכנות בקרים וחיישנים', 'פתרון אתגרים הנדסיים', 'עבודת צוות ורוח קבוצתית'],
    resources: [
      { title: 'פורטל התלמידים הלאומי', url: 'https://students.education.gov.il/' }
    ]
  },
  {
    id: 'space-debate',
    name: 'מועדון דיבייט ואנגלית מוגברת',
    coordinator: 'רכז/ת התחום',
    iconName: 'Globe',
    description: 'פיתוח מיומנויות שיח, כושר ביטוי, עמידה מול קהל ואומנות הנאום והשכנוע בשפה האנגלית והעברית. התלמידים מפתחים חשיבה ביקורתית, הבנה דיפלומטית ויכולת ניסוח טיעונים רציונליים.',
    topics: ['אמנות הנאום (Public Speaking)', 'תרגול דיבייט וכושר שכנוע', 'דיפלומטיה ויחסים בינלאומיים', 'הרחבת אוצר המילים באנגלית'],
    resources: [
      { title: 'אתר כותר לספרי למידה דיגיטליים', url: 'https://www.kotar.co.il/' }
    ]
  },
  {
    id: 'space-cinema',
    name: 'מסלול הקולנוע ותקשורת חזותית',
    coordinator: 'רכז/ת התחום',
    iconName: 'Palette',
    description: 'למידה חווייתית ומעשית של עולם הקולנוע והתקשורת החזותית. התלמידים שותפים ליצירה קולנועית שלמה הכוללת כתיבת תסריטים, בימוי, צילום, משחק ועריכת סרטים קצרים בחדר המדיה הבית ספרי.',
    topics: ['כתיבת תסריט ובימוי', 'צילום ועריכה דיגיטלית', 'שפת הקולנוע והמדיה', 'חדר הפודקאסט והפקת תוכן'],
    resources: [
      { title: 'ספרייה דיגיטלית - כותר', url: 'https://www.kotar.co.il/' }
    ]
  },
  {
    id: 'space-performing',
    name: 'אומנויות הבמה ותיאטרון',
    coordinator: 'רכז/ת התחום',
    iconName: 'Users',
    description: 'מרחב ליצירה והבעה עצמית באמצעות משחק, דרמה ומחזות זמר. התלמידים מתנסים בעמידה על במה, פיתוח קול, תנועה ומשחק, המעניקים להם ביטחון עצמי רב, יצירתיות וכישורי עבודה קבוצתית.',
    topics: ['יסודות הדרמה והמשחק', 'תנועה במה וביטוי גופני', 'הפקת מחזות זמר ומופעים', 'עבודת צוות והעצמה אישית'],
    resources: [
      { title: 'מערכת אופק לבתי הספר השש-שנתיים', url: 'https://ofek.snunit.k12.il/' }
    ]
  },
  {
    id: 'space-shavit',
    name: 'שביט מצוינות מדעית',
    coordinator: 'רכז/ת התחום',
    iconName: 'Calculator',
    description: 'מסלול יוקרתי ייחודי לטיפוח תלמידים מצטיינים בתחומי המדעים, הפיזיקה והמתמטיקה. המסלול מציע תכנים אקדמיים מתקדמים, ניסויי חקר במעבדות והכנה לתחרויות ואולימפיאדות מדעיות.',
    topics: ['מצוינות מתמטית', 'חקר מדעי וניסויי מעבדה', 'מבוא לפיזיקה וכימיה', 'פיתוח חשיבה אנליטית'],
    resources: [
      { title: 'פורטל תלמידים משרד החינוך', url: 'https://students.education.gov.il/' }
    ]
  }
];

export const quickLinksData: QuickLink[] = [
  {
    id: 'ql-students-mashov',
    title: 'משוב תלמידים',
    url: 'https://web.mashov.info/students/login',
    iconName: 'UserCheck',
    badge: 'חובה',
    category: 'מערכות למידה',
    audience: 'תלמידים',
    showInMenu: true
  },
  {
    id: 'ql-parents-mashov',
    title: 'משוב הורים',
    url: 'https://web.mashov.info/parents/login',
    iconName: 'UserCheck',
    badge: 'משוב',
    category: 'מערכות למידה',
    audience: 'הורים',
    showInMenu: true
  },
  {
    id: 'ql-teachers-mashov',
    title: 'משוב עובדי הוראה',
    url: 'https://web.mashov.info/',
    iconName: 'UserCheck',
    badge: 'סגל',
    category: 'מערכות למידה',
    audience: 'מורים',
    showInMenu: true
  },
  {
    id: 'ql-students-graduates-portal',
    title: 'פורטל תלמידים ובוגרים',
    url: 'https://students.education.gov.il/',
    iconName: 'GraduationCap',
    category: 'משרד החינוך',
    audience: 'תלמידים',
    showInMenu: true
  },
  {
    id: 'ql-parents-portal',
    title: 'פורטל הורים',
    url: 'https://parents.education.gov.il/',
    iconName: 'CreditCard',
    category: 'שירותים',
    audience: 'הורים',
    showInMenu: true
  },
  {
    id: 'ql-teachers-portal',
    title: 'פורטל עובדי הוראה',
    url: 'https://pob.education.gov.il/',
    iconName: 'Users',
    category: 'משרד החינוך',
    audience: 'מורים',
    showInMenu: true
  },
  {
    id: 'ql-classroom-students',
    title: 'Google Classroom',
    url: 'https://classroom.google.com/',
    iconName: 'Chrome',
    category: 'מערכות למידה',
    audience: 'תלמידים',
    showInMenu: true
  },
  {
    id: 'ql-classroom-teachers',
    title: 'Google Classroom למורים',
    url: 'https://classroom.google.com/',
    iconName: 'Chrome',
    category: 'מערכות למידה',
    audience: 'מורים',
    showInMenu: true
  }
];

export const galleryPhotosData: GalleryPhoto[] = [
  {
    id: 'photo-1',
    title: 'חגיגת הקיימות ויריד אקו-ארנס השנתי',
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4486622410?auto=format&fit=crop&q=80&w=800',
    category: 'אירועים',
    date: '2026-06-15'
  },
  {
    id: 'photo-2',
    title: 'הקלטת פרק בכורה בחדר הפודקאסט החדש',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800',
    category: 'לימודים',
    date: '2026-06-08'
  },
  {
    id: 'photo-3',
    title: 'נבחרת הכדורסל של ארנס חוגגת מקום ראשון',
    imageUrl: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=800',
    category: 'ספורט',
    date: '2026-05-18'
  },
  {
    id: 'photo-4',
    title: 'ביקור חווייתי של שכבה ח\' במוזיאון הילדים בחולון',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800',
    category: 'אירועים',
    date: '2026-05-10'
  },
  {
    id: 'photo-5',
    title: 'ניסויי חקר מדעיים מרתקים של תלמידי כיתת עמ"ט',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
    category: 'לימודים',
    date: '2026-04-22'
  },
  {
    id: 'photo-6',
    title: 'סדנת כתיבת סופר סת"ם לתלמידי שכבה ז\'',
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800',
    category: 'טקסים',
    date: '2026-03-12'
  }
];

export const mosheArensBio = {
  name: 'משה ארנס',
  lifespan: '1925 - 2019',
  title: 'מהנדס, מדינאי, ופרופסור לאווירונאוטיקה',
  content: 'משה ארנס ז״ל היה מבכירי המדינאים והביטחוניסטים של מדינת ישראל, כיהן כשר הביטחון בשלוש תקופות שונות, כשר החוץ וכשגריר ישראל בארצות הברית. לצד פועלו המדיני והלאומי העמוק, ארנס היה איש מדע וחינוך משכמו ומעלה - בוגר הטכניון וה-MIT, פרופסור חבר בפקולטה להנדסת אווירונאוטיקה בטכניון, וסמנכ״ל התעשייה האווירית אשר הוביל פרויקטים ביטחוניים וטכנולוגיים חלוציים ובראשם מטוס ה"לביא". דמותו מייצגת את השילוב המופלא שבין מצוינות אקדמית, תבונה טכנולוגית, מנהיגות ערכית וציונית, ואהבת אדם עמוקה - ערכים המהווים נר לרגלי בית הספר הנושא את שמו בגאון בפתח תקווה.',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Moshe_Arens_mod.jpg'
};

export const schoolRegulations = [
  {
    title: 'הופעה ותלבושת אחידה',
    rules: [
      'על כל תלמידי בית הספר להגיע לבית הספר בחולצת קצרת/ארוכת שרוול עם סמל בית הספר המודפס באופן ברור.',
      'לשיעורי חינוך גופני (ספורט) יש להגיע עם חולצת ספורט ייעודית (חולצת טי כחולה/אפורה עם סמל) ונעלי ספורט סגורות.',
      'חל איסור מוחלט על הגעה בכפכפים, נעלי בית או ללא חולצה אחידה. בימי חורף, סווטשירט או ג׳קט המולבש מעל החולצה הבית-ספרית אינו חייב לשאת סמל, אך מתחתיו חובה ללבוש את חולצת בית הספר.'
    ]
  },
  {
    title: 'שימוש במכשירים סלולריים וטכנולוגיים',
    rules: [
      'במהלך השיעורים, על כל המכשירים הסלולריים והשעונים החכמים להיות כבויים ובתוך תיקי הגב בלבד.',
      'שימוש בטלפונים מותר במהלך ההפסקות בלבד, ובכפוף להנחיות החינוכיות ושמירה על פרטיות הזולת (חל איסור על צילום או הקלטה ללא הסכמה ברורה).',
      'המורים רשאים לאפשר שימוש פדגוגי במכשיר הסלולרי או בלפטופים במהלך השיעור בלבד לצורך פעילות מוגדרת ומבוקרת.'
    ]
  },
  {
    title: 'נוכחות, עמידה בזמנים והתנהגות כללית',
    rules: [
      'הלימודים בבית הספר מתחילים בשעה 08:00 בדיוק. תלמידים מתבקשים להגיע עד השעה 07:55 כדי להתארגן בכיתות בצורה נינוחה.',
      'איחור לשיעור ייחשב כהפרת משמעת ויגרור רישום במערכת המשוב. שלושה איחורים בלתי מוצדקים יגררו שיחה עם המחנכ/ת ופעילות מתקנת.',
      'חובה לשמור על התנהגות מכבדת וסבלנית כלפי כל קהילת בית הספר: חברים, מורים, אנשי הנהלה, עובדי מנהלה והורים. אלימות מכל סוג (פיזית, מילולית או דיגיטלית ברשתות החברתיות) תטופל בחומרה אפסית ותגרור השעיה מיידית.'
    ]
  }
];

export const defaultStaffMembers: StaffMember[] = allTeachersList;

