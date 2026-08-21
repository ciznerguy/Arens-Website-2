import { schoolNewsArticles } from '../data';
import { InternalPage } from '../types';
export type { InternalPage };

export const INTERNAL_PAGES: Record<string, InternalPage> = {
  "home-page-1": {
    title: "דף בית חלופי (דוגמה 1)",
    category: "דפי הבית",
    subtitle: "דף בית עם תפריט ניווט מותאם: אודותינו, לתלמידים, להורים, למורים, קישורים מהירים",
    icon: "Globe",
    content: [
      "דף בית זה הנו גרסת תצוגה חלופית (home-page-1) של בית הספר השש-שנתי משה ארנס פתח תקווה.",
      "בדף זה משולב תפריט ניווט עליון מובנה המיועד לתלמידים, להורים, למורים, אודותינו וקישורים מהירים."
    ]
  },
  // --- אודותינו ---
  "course/%d7%90%d7%95%d7%93%d7%95%d7%aa%d7%99%d7%a0%d7%95/%d7%93%d7%91%d7%a8-%d7%94%d7%9e%d7%a0%d7%94%d7%9c%d7%aa-%d7%a9%d7%a9-%d7%a9%d7%a0%d7%aa%d7%99/": {
    title: "דבר המנהלת - נאווה שקל ששון",
    category: "אודותינו",
    subtitle: "מנהלת בית הספר השש-שנתי משה ארנס",
    icon: "User",
    content: [
      "קהילת שש-שנתי משה ארנס פתח תקווה היקרה, תלמידים, הורים וצוותי חינוך יקרים,",
      "אני נרגשת לקבל את פניכם במרחב הדיגיטלי החדש של בית הספר שלנו. הקמתו של ביה\"ס השש-שנתי משה ארנס היא מלאכת מחשבת, יצירה חינוכית משותפת שנבנית מתוך חזון רחב ועמוק של התאמת הלמידה למאה ה-21.",
      "בית ספרנו קרוי בגאווה על שמו של משה ארנס ז\"ל - איש מדע ומהנדס מחונן, פרופסור לאווירונאוטיקה, שר ביטחון ושר חוץ של מדינת ישראל. בדמותו ועל פי מורשתו, אנו מעצבים מוסד חינוכי המשלב בין מצוינות מדעית וטכנולוגית בלתי מתפשרת לבין חינוך ערכי, הומניסטי, ואהבת אדם.",
      "אנו רואים בכל תלמידה ותלמיד עולם ומלואו. השאיפה שלנו היא להעניק לכל אחד מכם את התנאים הטובים ביותר לממש את הפוטנציאל האישי שלו, תוך פיתוח חשיבה עצמאית, יצירתיות, יכולת פתרון בעיות מורכבות ומעורבות חברתית עמוקה.",
      "שלכם תמיד בברכת שנת לימודים ועשייה פורחת,"
    ],
    sections: [
      {
        title: "עקרונות המנהיגות החינוכית שלנו",
        text: "הנהלת בית הספר והצוות החינוכי מחויבים לשלושה עקרונות יסוד:",
        list: [
          "יחס אישי ומענה רגשי לכל תלמיד ותלמידה.",
          "פדגוגיה חדשנית המבוססת על פרויקטים (PBL), חקר ולמידה מעשית.",
          "שותפות אמיתית ושקופה עם קהילת ההורים והעירייה."
        ]
      }
    ]
  },
  "course/%d7%93%d7%91%d7%a8-%d7%9e%d7%a0%d7%94%d7%9c-%d7%97%d7%98%d7%91%d7%aa-%d7%94%d7%a0%d7%a2%d7%95%d7%a8%d7%99%d7%9d/": {
    title: "דבר מנהל חטיבת הנעורים",
    category: "אודותינו",
    subtitle: "מנהיגות חטיבת הביניים - צומחים ומגלים כוחות",
    icon: "Users",
    content: [
      "תלמידים והורים יקרים של חטיבת הביניים,",
      "המעבר לחטיבת הביניים הוא שלב משמעותי ומלא התרגשות בחיי המתבגר. זוהי תקופה של גילוי עצמי, גיבוש זהות, פיתוח עצמאות והעמקת תחומי העניין.",
      "בחטיבת הנעורים \"ארנס\" אנו פועלים ללא לאות כדי להבטיח מעבר רך, בטוח ומעצים. אנו מציעים מגוון רחב של מסלולים ייחודיים המאפשרים לכל תלמיד ללמוד מתוך תשוקה פנימית - בין אם במדעים, בספורט, באומנויות הבמה או בקולנוע.",
      "צוות החינוך והייעוץ שלנו ערוך ללוות אתכם בכל צעד, להקשיב, לתמוך ולחזק את תחושת השייכות הבית-ספרית והקהילתית."
    ],
    sections: [
      {
        title: "מטרות ויעדים לחטיבת הביניים",
        text: "בחטיבה אנו מתמקדים ב:",
        list: [
          "הסתגלות מיטבית של תלמידי כיתות ז' החדשים.",
          "פיתוח אחריות אישית ומיומנויות ניהול זמן עצמיות.",
          "גיבוש חברתי מונע אלימות וטיפוח אקלים כיתתי חם ומכיל."
        ]
      }
    ]
  },
  "course/%d7%90%d7%95%d7%93%d7%95%d7%aa%d7%99%d7%a0%d7%95/%d7%90%d7%95%d7%a8%d7%97%d7%95%d7%aa-%d7%97%d7%99%d7%99%d7%9d-%d7%91%d7%a8%d7%a0%d7%a1/": {
    title: "אורחות החיים של ארנס",
    category: "אודותינו",
    subtitle: "תקנון בית הספר, נורמות התנהגות ואקלים מכבד",
    icon: "FileText",
    content: [
      "אורחות החיים בבית הספר משקפים את הערכים שאנו מאמינים בהם: כבוד הדדי, אחריות, יושרה, מצוינות וסבלנות.",
      "התקנון שלהלן נכתב בשיתוף הנהלת ביה\"ס, נציגות ההורים ומועצת התלמידים, והוא מהווה קוד התנהגות מחייב לכל קהילת ארנס.",
      "אנו מאמינים כי משמעת עצמית והקפדה על הכללים מייצרות סביבה מוגנת המאפשרת למידה איכותית ויצירת קשרים חברתיים בריאים."
    ],
    sections: [
      {
        title: "לבוש ותלבושת אחידה",
        text: [
          "הגעה לבית הספר חובה בחולצה עם סמל בית הספר מודפס בחזית.",
          "בחורף ניתן ללבוש סווטשירט חלק, אך חובה ללבוש חולצת סמל מתחתיו.",
          "לשיעורי חינוך גופני יש להגיע בנעלי ספורט סגורות וחולצת ספורט ייעודית."
        ]
      },
      {
        title: "טוהר הבחינות והישגיות",
        text: "אנו מייחסים חשיבות עליונה ליושרה אקדמית. העתקה בבחינות או עבודות פוגעת בערך הלמידה ותגרור פסילת המבחן ושיחת בירור משמעתית."
      },
      {
        title: "טכנולוגיה וסלולריים",
        text: "מכשירים סלולריים ושעונים חכמים יישארו כבויים בתוך התיק במהלך כל שעות השיעור, אלא אם המורה אישר במפורש שימוש פדגוגי מכוון."
      }
    ]
  },
  "course/%d7%97%d7%96%d7%95%d7%9f-%d7%91/": {
    title: "חזון בית הספר",
    category: "אודותינו",
    subtitle: "מצמיח אדם וחברה - הערכים המובילים אותנו",
    icon: "Eye",
    content: [
      "חזון בית הספר השש-שנתי משה ארנס מבוסס על השילוב שבין פדגוגיה עתידנית, פיתוח ערכים הומניסטיים והתאמה למיומנויות המאה ה-21.",
      "אנו שואפים להיות מגדלור של מצוינות לימודית, מדעית וחברתית, המצמיח בוגרים סקרנים, בעלי חוסן נפשי ואחריות אזרחית המובילים שינוי חיובי בקהילה ובמדינה."
    ],
    sections: [
      {
        title: "מצוינות טכנולוגית ומדעית (STEM)",
        text: "פיתוח מסלולים בתחומי הפיזיקה, סייבר, רובוטיקה וכלכלה כדי להעניק לבוגרינו יתרון תחרותי בעולם הטכנולוגי הגלובלי."
      },
      {
        title: "מנהיגות ומעורבות אזרחית",
        text: "עידוד רוח התנדבות, מנהיגות צעירה, תרומה לקהילה וסבלנות לדעות שונות מתוך אמונה כי הכוח לשנות נמצא בידינו."
      },
      {
        title: "למידה מבוססת פרויקטים וחקר",
        text: "מעבר משינון פסיבי ללמידה דינמית, המפתחת מיומנויות עבודת צוות, פרזנטציה, חשיבה ביקורתית ויצירתיות."
      }
    ]
  },

  // --- חט"ב ---
  "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%96-%d7%94%d7%a6%d7%a2%d7%93-%d7%94%d7%a8%d7%90%d7%a9%d7%95%d7%9f-%d7%91%d7%93%d7%a8%d7%9a-%d7%94%d7%97%d7%93%d7%a9%d7%94/": {
    title: "שכבת ז': הצעד הראשון בדרך החדשה",
    category: "חטיבת הביניים",
    subtitle: "שנת המעבר וההשתלבות בחטיבת הנעורים",
    icon: "Footprints",
    content: [
      "ברוכים הבאים לשכבת ז'! המעבר מבית הספר היסודי לחטיבה הוא שלב מרגש של גדילה וגילוי עצמי.",
      "בשנה זו אנו שמים דגש מיוחד על ההסתגלות החברתית והרגשית של התלמיד, הקניית הרגלי למידה עצמאיים, וחשיפה ראשונה למגוון המגמות ומרחבי ה-STEM בבית הספר.",
      "במהלך השנה נקיים סדנאות גיבוש, ימי שדה ופרויקטים שכבתיים שיעזרו לכל תלמיד למצוא את מקומו הייחודי."
    ],
    sections: [
      {
        title: "פעילויות דגל של השכבה",
        text: "בכיתה ז' אנו מובילים מספר פרויקטים ייחודיים:",
        list: [
          "תכנית 'גשר לעתיד' - סדנאות גיבוש והיכרות בין תלמידים מבתי ספר מזינים שונים.",
          "מבוא ל-STEM - סבב חשיפה מעשי במעבדות הסייבר, הרובוטיקה והקולנוע.",
          "טקס קבלת התורה והמשפחה - אירוע חגיגי וקהילתי."
        ]
      }
    ]
  },
  "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%97-%d7%a6%d7%9e%d7%99%d7%97%d7%94-%d7%95%d7%94%d7%a2%d7%9e%d7%a7%d7%94-%d7%9e%d7%92%d7%9c%d7%99%d7%9d-%d7%90%d7%aa-%d7%94%d7%9b%d7%95%d7%97%d7%95%d7%aa-%d7%a9/": {
    title: "שכבת ח': צמיחה והעמקה – מגלים את הכוחות שבכם",
    category: "חטיבת הביניים",
    subtitle: "שנת ההעמקה הלימודית, מנהיגות ועשייה חברתית",
    icon: "TrendingUp",
    content: [
      "כיתה ח' היא שנת העמקה וצמיחה פנימית. לאחר שהתלמידים הסתגלו היטב לחטיבה, זה הזמן להעצים את כוחותיהם, לפתח חשיבה ביקורתית ולהוביל עשייה חברתית משמעותית.",
      "בשכבה זו, התלמידים מתחילים לקחת אחריות רבה יותר על פרויקטים פדגוגיים מורכבים ומשתתפים בימי שדה אקולוגיים ובסיורים ברחבי הארץ."
    ],
    sections: [
      {
        title: "פרויקטים מרכזיים בכיתה ח'",
        text: "התלמידים משתלבים בפרויקטים כגון:",
        list: [
          "תכנית 'אקו-ארנס' - חקר מעשי ויריד קיימות מונחה סביבה.",
          "מסע בעקבות קהילות ומנהיגות - סיורים בשכונות העיר ומוסדות המדינה.",
          "חינוך פיננסי ויזמות - סדנאות חווייתיות להבנת עולם הכלכלה הדינמי."
        ]
      }
    ]
  },
  "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%98-%d7%91%d7%97%d7%99%d7%a8%d7%95%d7%aa-%d7%a2%d7%a6%d7%9e%d7%90%d7%95%d7%aa-%d7%95%d7%90%d7%97%d7%a8%d7%99%d7%95%d7%aa/": {
    title: "שכבת ט': בחירות, עצמאות ואחריות",
    category: "חטיבת הביניים",
    subtitle: "שנת הסיום של חטיבת הביניים והיערכות לתיכון",
    icon: "Award",
    content: [
      "תלמידי שכבת ט' היקרים נמצאים בשנת מפתח משמעותית המהווה גשר ישיר אל החטיבה העליונה.",
      "זוהי שנת בחירה, בגרות אישית ואחריות מוגברת. הדגש השנה הוא על היערכות אקדמית ואישית, קבלת החלטות מושכלת לקראת רישום למגמות בתיכון, והובלת מנהיגות בית-ספרית בשכבות הצעירות."
    ],
    sections: [
      {
        title: "תהליך בחירת המגמות ותוצרי סוף שנה",
        text: "כדי להבטיח מעבר מוצלח וחלק לחטיבה העליונה, אנו מקיימים:",
        list: [
          "ערבי חשיפה ובוקר מגמות ייעודי המציג את תכנית הלימודים בתיכון.",
          "פרויקט חקר מסכם - 'עבודת השורשים והזהות האזרחית שלי'.",
          "טקס סיום חגיגי ומרגש של חטיבת הביניים."
        ]
      }
    ]
  },
  "course/%d7%97%d7%98%d7%91/%d7%97%d7%99%d7%a0%d7%95%d7%a5-%d7%97%d7%91%d7%a8%d7%aa%d7%99-%d7%97%d7%98%d7%91/": {
    title: "חינוך חברתי חט\"ב",
    category: "חטיבת הביניים",
    subtitle: "חוויות, טקסים, גיבוש והעצמה ערכית מחוץ לכיתה",
    icon: "Heart",
    content: [
      "הלמידה בבית הספר אינה מצטמצמת רק לספרי הלימוד. החינוך החברתי הוא הלב הפועם של בית הספר, שבו ערכים מתורגמים למעשים ולחוויות חקוקות בזיכרון.",
      "אנו מקיימים פעילויות חברתיות מגוונות, סיורים, הצגות, הרצאות השראה, חגיגות פורים, אירועי שיא, וימי מנהיגות המעניקים נפח ערכי ועשיר לחיי היומיום של תלמידינו."
    ],
    sections: [
      {
        title: "מועצת התלמידים והובלת יוזמות",
        text: "מועצת התלמידים של חטיבת הביניים נבחרת באופן דמוקרטי ומובילה יוזמות של שינוי אקלים, הפסקות פעילות ומכירות צדקה קהילתיות."
      }
    ]
  },
  "course/%d7%97%d7%98%d7%91/%d7%9e%d7%a2%d7%95%d7%a8%d7%91%d7%95%d7%aa-%d7%97%d7%91%d7%a8%d7%aa%d7%99-%d7%97%d7%91%d7%a8%d7%aa%d7%99%d7%aa-2/": {
    title: "מעורבות חברתית",
    category: "חטיבת הביניים",
    subtitle: "נתינה, התנדבות ומחויבות אישית לקהילת פתח תקווה",
    icon: "HeartHandshake",
    content: [
      "משה ארנס ז\"ל האמין כי תפקידו של החינוך הוא להצמיח אזרחים המשרתים את חברתם באהבה ובאחריות. תכנית מעורבות חברתית נועדה להנחיל ערך זה הלכה למעשה.",
      "כל תלמידי בית הספר נוטלים חלק בפרויקטי התנדבות לאורך השנה - החל מתמיכה בקשישים, איסוף מזון למשפחות נזקקות, שותפות עם עמותת 'גדולים מהחיים', ועד למיזמי איכות סביבה ירוקים."
    ],
    sections: [
      {
        title: "תחומי התנדבות מובילים",
        text: "התלמידים יכולים לבחור מתוך מגוון אפשרויות התנדבות:",
        list: [
          "סיוע לימודי וחונכות חברתית לילדי בתי ספר יסודיים באזור.",
          "מרכז הגינון והקיימות הקהילתי באקולוגיית 'אקו-ארנס'.",
          "התנדבות וליווי של בעלי צרכים מיוחדים ואירועי סיוע קהילתיים."
        ]
      }
    ]
  },
  "course/%d7%97%d7%98%d7%91/%d7%9e%d7%a1%d7%a2%d7%90%d7%95%d7%aa-2/": {
    title: "המסעאו\"ת – חיבור בין תחומי דעת לפיתוח מיומנויות המאה ה-21",
    category: "חטיבת הביניים",
    subtitle: "למידה רב-תחומית פורצת דרך דרך סיורי חקר ופרויקטים",
    icon: "Compass",
    content: [
      "תכנית המסעאו\"ת (מסעות חקר רב-תחומיים) היא עמוד תווך פדגוגי בבית ספרנו, המאחד תחומי דעת שונים לתוך חוויית למידה אחידה ומסקרנת.",
      "במקום ללמוד מקצועות בנפרד בצורה מנותקת, תלמידי החטיבה יוצאים למסעות חקר המשלבים מדעים, היסטוריה, ספרות וטכנולוגיה סביב נושא מרכזי אחד, תוך פיתוח מיומנויות חיוניות."
    ],
    sections: [
      {
        title: "מיומנויות המאה ה-21 הנרכשות במסלול",
        text: "התכנית מאתגרת את התלמידים לפתח:",
        list: [
          "עבודת צוות ושיתוף פעולה במרחב גלובלי.",
          "חשיבה ביקורתית, שאילת שאלות וניתוח מקורות מידע עצמאיים.",
          "פרזנטציה (עמידה מול קהל) והצגת תוצרים בטכנולוגיות מתקדמות."
        ]
      }
    ]
  },
  "course/%d7%97%d7%98%d7%91/%d7%a9%d7%99%d7%a9%d7%99-%d7%90%d7%99%d7%a9%d7%99/%d7%94%d7%99%d7%99%d7%97%d7%95%d7%93%d7%99%d7%95%d7%aa-%d7%a9%d7%9c-%d7%90%d7%a8%d7%a0%d7%a1/": {
    title: "מסלולים ייחודיים בחט\"ב",
    category: "חטיבת הביניים",
    subtitle: "ללמוד מתוך תשוקה ונטיית לב - סייבר, רובוטיקה, אומנויות, ספורט וקולנוע",
    icon: "Sparkles",
    content: [
      "אנו מאמינים כי תלמיד מצליח היכן שליבו חפץ. לכן, בית הספר מציע 5 מסלולי ייחודיות פדגוגיים המקנים העשרה משמעותית מעבר לתכנית הלימודים הרגילה.",
      "כל תלמיד בוחר מסלול ייחודי אחד שבו הוא מעמיק, חוקר ויוצר תוצרים לאורך שלוש השנים בחטיבת הביניים."
    ],
    sections: [
      {
        title: "חמשת מסלולי הדגל שלנו בחטיבה",
        text: "סקירה קצרה של המסלולים הייחודיים:",
        list: [
          "סייבר ומחשבים - לימוד שפות קוד, אלגוריתמיקה ואבטחת מידע ברמה גבוהה.",
          "רובוטיקה והנדסה - תכנון ובניית מערכות רובוטיות אוטונומיות בשיתוף פעולה.",
          "אומנויות הבמה ותיאטרון - פיתוח משחק, דרמה ועמידה בביטחון עצמי על במה.",
          "מסלול קולנוע וניו-מדיה - בימוי, צילום, עריכה, וניהול חדר הפודקאסט הבית ספרי.",
          "אקדמיית הספורט - פיתוח כושר גופני, אורח חיים בריא ומצוינות אתלטית."
        ]
      }
    ]
  },
  "course/%d7%97%d7%98%d7%91/%d7%9b%d7%99%d7%aa%d7%94-%d7%90%d7%95%d7%9c%d7%99%d7%9e%d7%a4%d7%99%d7%aa/": {
    title: "כיתה אולימפית",
    category: "חטיבת הביניים",
    subtitle: "מצוינות מתמטית-מדעית וטיפוח דור המדענים הבא",
    icon: "Target",
    content: [
      "הכיתה האולימפית מיועדת לתלמידים מצטיינים בעלי יכולות יוצאות דופן וסקרנות עמוקה לתחומי המתמטיקה והמדעים המדויקים.",
      "התכנית נבנתה בשיתוף פעולה עם מוסדות אקדמיים מובילים ומכשירה את התלמידים להתמודד עם אתגרי מתמטיקה מורכבים, פתרון בעיות הנדסיות, והכנה לאולימפיאדות הארציות והבינלאומיות."
    ],
    sections: [
      {
        title: "ייחודיות ותכני הכיתה האולימפית",
        text: "הלימודים בכיתה זו כוללים:",
        list: [
          "מתמטיקה מואצת ומתקדמת ברמת חשיבה אקדמית.",
          "פיתוח אלגוריתמים מתקדמים ויסודות מדעי המחשב.",
          "ליווי מנטורינג אישי על ידי חוקרים ומרצים מהאקדמיה."
        ]
      }
    ]
  },
  "course/%d7%97%d7%98%d7%91/%d7%9b%d7%99%d7%aa%d7%94-%d7%9e%d7%93%d7%a2%d7%99%d7%aa/": {
    title: "הכיתה המדעית – מרחב לחדשנות, חקר ומצוינות מדעית",
    category: "חטיבת הביניים",
    subtitle: "כיתת עמ\"ט (מדעית-טכנולוגית) - מנהיגות מדעית מובילה",
    icon: "Cpu",
    content: [
      "הכיתה המדעית-טכנולוגית (תכנית עמ\"ט) בבית ספרנו מהווה פלטפורמה ייחודית לתלמידים המעוניינים להעמיק במדעי החיים, פיזיקה, כימיה ותכנות.",
      "הלמידה מבוססת ברובה על עבודה חווייתית במעבדות החדשניות של בית הספר, ביצוע ניסויים פורצי דרך, חקר עצמאי של תופעות טבע ופיתוח פרויקטים טכנולוגיים יישומיים."
    ],
    sections: [
      {
        title: "מרכיבי תכנית עמ\"ט המדעית",
        text: "במסגרת הכיתה המדעית נלמדים הנושאים הבאים:",
        list: [
          "פיזיקה יישומית ואווירונאוטיקה.",
          "ביוטכנולוגיה, גנטיקה וכימיה ירוקה.",
          "תכנות יישומי וסייבר בסיסי."
        ]
      }
    ]
  },
  "course/%d7%97%d7%98%d7%91/%d7%a4%d7%a8%d7%95%d7%99%d7%a7%d7%98-%d7%94%d7%9e%d7%a0%d7%98%d7%95%d7%a8%d7%99%d7%a0%d7%92/": {
    title: "פרויקט המנטורינג",
    category: "חטיבת הביניים",
    subtitle: "חיבור דורות: הייטקיסטים ומבוגרים מלווים את דור העתיד",
    icon: "Award",
    content: [
      "פרויקט המנטורינג הייחודי של שש-שנתי ארנס מחבר בין תלמידי בית הספר לבין מנטורים מובילים מתעשיית ההייטק, האקדמיה וקהילת ההורים המקצועית.",
      "במסגרת הפרויקט, התלמידים זוכים לליווי אישי או קבוצתי קבוע המפתח את ביטחונם העצמי, מקנה להם כלים מעשיים לתכנון עתידם, ומאפשר להם להוציא לפועל פרויקטים טכנולוגיים וחברתיים ברמה מקצועית אמיתית."
    ],
    sections: [
      {
        title: "יתרונות פרויקט המנטורינג",
        list: [
          "ליווי אישי והכוונה על ידי אנשי מקצוע מובילים מתעשיית ההייטק והמדע.",
          "רכישת מיומנויות מעשיות של פיתוח פרויקטים, עבודת צוות ופרזנטציה.",
          "חיזוק הביטחון העצמי ותחושת המסוגלות האישית של התלמיד."
        ]
      }
    ]
  },
  "course/%d7%97%d7%98%d7%91/%d7%a2%d7%91%d7%95%d7%93%d7%95%d7%aa-%d7%a7%d7%99%d7%a5-%d7%9c%d7%a2%d7%95%d7%9c%d7%99%d7%9d-%d7%9c%d7%9b%d7%15%d7%aa-%d7%97-%d7%98/": {
    title: "עבודות קיץ לעולים לכיתות ח-ט",
    category: "חטיבת הביניים",
    subtitle: "משימות מעבר, עבודות חקר ותרגול לימי הקיץ",
    icon: "BookOpen",
    content: [
      "על מנת להגיע מוכנים ומלאי ביטחון לשנת הלימודים הבאה, צוותי המקצוע של חטיבת הביניים ריכזו עבורכם משימות תרגול, קריאה וחקר קלות לימי הקיץ.",
      "עבודות אלו מסייעות לשמר את הידע הקיים ולהבטיח פתיחת שנה חלקה ומוצלחת."
    ],
    sections: [
      {
        title: "משימות קיץ לפי מקצועות",
        list: [
          "מתמטיקה - חוברת תרגול וחזרה על נושאי הליבה בהתאם לרמות הלימוד השונות.",
          "אנגלית - קריאת ספר קיץ (Book Report) ומבדק אוצר מילים.",
          "מדעים וטכנולוגיה - עבודת מחקר וסקירה קלה במקצועות הפיזיקה והביולוגיה לעולים לט'."
        ]
      }
    ],
    pdfFiles: [
      {
        name: "חוברת עבודת קיץ במתמטיקה - עולים לכיתה ח",
        url: "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKFNjaG9vbCBEb2N1bWVudCkKL0NyZWF0b3IgKEFyZW5zIFNjaG9vbCkKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbNCAwIFJdCi9Db3VudCAxCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMyAwIFIKL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNSAwIFIKPj4KPj4KL0NvbnRlbnRzIDYgMCBSCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKNiAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKNTQgNzAwIFRkCihTY2hvb2wgRG9jdW1lbnQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNzMgMDAwMDAgbiAKMDAwMDAwMDEyMCAwMDAwMCBuIAowMDAwMDAwMTcxIDAwMDAwIG4gCjAwMDAwMDAzMDIgMDAwMDAgbiAKMDAwMDAwMDM4MiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDcKL1Jvb3QgMiAwIFIKPj4Kc3RhcnR4cmVmCjQ3OQolJUVPRgo=",
        size: "1.2 MB"
      },
      {
        name: "חוברת עבודת קיץ במתמטיקה - עולים לכיתה ט",
        url: "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKFNjaG9vbCBEb2N1bWVudCkKL0NyZWF0b3IgKEFyZW5zIFNjaG9vbCkKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbNCAwIFJdCi9Db3VudCAxCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMyAwIFIKL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNSAwIFIKPj4KPj4KL0NvbnRlbnRzIDYgMCBSCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKNiAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKNTQgNzAwIFRkCihTY2hvb2wgRG9jdW1lbnQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNzMgMDAwMDAgbiAKMDAwMDAwMDEyMCAwMDAwMCBuIAowMDAwMDAwMTcxIDAwMDAwIG4gCjAwMDAwMDAzMDIgMDAwMDAgbiAKMDAwMDAwMDM4MiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDcKL1Jvb3QgMiAwIFIKPj4Kc3RhcnR4cmVmCjQ3OQolJUVPRgo=",
        size: "1.4 MB"
      },
      {
        name: "אנגלית - משימות קריאה שכבת ח-ט (Book Report)",
        url: "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKFNjaG9vbCBEb2N1bWVudCkKL0NyZWF0b3IgKEFyZW5zIFNjaG9vbCkKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbNCAwIFJdCi9Db3VudCAxCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMyAwIFIKL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNSAwIFIKPj4KPj4KL0NvbnRlbnRzIDYgMCBSCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKNiAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKNTQgNzAwIFRkCihTY2hvb2wgRG9jdW1lbnQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNzMgMDAwMDAgbiAKMDAwMDAwMDEyMCAwMDAwMCBuIAowMDAwMDAwMTcxIDAwMDAwIG4gCjAwMDAwMDAzMDIgMDAwMDAgbiAKMDAwMDAwMDM4MiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDcKL1Jvb3QgMiAwIFIKPj4Kc3RhcnR4cmVmCjQ3OQolJUVPRgo=",
        size: "950 KB"
      }
    ]
  },
  "course/%d7%97%d7%98%d7%91/%d7%97%d7%95%d7%91%d7%a8%d7%aa-%d7%9e%d7%92%d7%9e%d7%95%d7%aa-%d7%aa%d7%a9%d7%a4%d7%95/": {
    title: "חוברת מגמות תשפ\"ז",
    category: "חטיבה עליונה",
    subtitle: "מדריך מקיף לבחירת מגמות מורחבות (5 יח\"ל) בחטיבה העליונה",
    icon: "BookOpen",
    content: [
      "החטיבה העליונה של שש-שנתי משה ארנס מציעה 11 מגמות לימוד מורחבות מובילות ברמת 5 יחידות לימוד בגרות בחזית המדע, הטכנולוגיה, הרוח, החברה והספורט.",
      "חוברת המגמות שלהלן מפרטת את 11 המגמות הפועלות בבית הספר: דאטה אנליסט, תיאטרון ומחזות זמר, פיזיקה, סייבר גיאוגרפיה, מנהל וכלכלה, ערבית, מדעי החברה, כימיה, הנדסת תוכנה, חנ\"ג, וביולוגיה.",
      "אנו ממליצים לקרוא את המידע בעיון רב יחד עם ההורים ולהתייעץ עם רכזי המגמות והנהלת התיכון לצורך קבלת ההחלטה הטובה ביותר."
    ],
    sections: [
      {
        title: "מגמות המדע, ההנדסה והטכנולוגיה",
        text: "מגמות טכנולוגיות ומדעיות מתקדמות (5 יח\"ל):",
        list: [
          "דאטה אנליסט - ניתוח נתונים מתקדם, סטטיסטיקה יישומית ובינה מלאכותית.",
          "הנדסת תוכנה - תכנות מונחה עצמים, אלגוריתמיקה מתקדמת, מבני נתונים וסייבר.",
          "פיזיקה - מכניקה, אלקטרומגנטיות, קרינה וחומר וניסויי מעבדה מתקדמים.",
          "כימיה - מבנה החומר, תגובות כימיות, ננו-טכנולוגיה ומעבדות חקר.",
          "ביולוגיה - מערכות החיים, גנטיקה, אקולוגיה, פיזיולוגיה וביוטכנולוגיה.",
          "סייבר גיאוגרפיה - מערכות GIS, מיפוי ממוחשב, חישה מרחוק וניתוח מרחבי."
        ]
      },
      {
        title: "מגמות הרוח, החברה, האמנות והספורט",
        text: "מגמות עיוניות, יצירתיות ויישומיות (5 יח\"ל):",
        list: [
          "תיאטרון ומחזות זמר - אמנויות הבמה, בימוי, משחק, שירה, תנועה והפקת מחזות זמר.",
          "מנהל וכלכלה - יסודות הכלכלה, שוק ההון, ניהול עסקי, יזמות ושיווק.",
          "מדעי החברה - פסיכולוגיה, סוציולוגיה, הבנת נפש האדם ומחקר מדעי יישומי.",
          "ערבית - שפה ותקשורת, תרבות המזרח התיכון ואופק ליחידות מודיעין.",
          "חנ\"ג - חינוך גופני מוגבר, פיזיולוגיה של המאמץ, אנטומיה ומנהיגות ספורטיבית."
        ]
      }
    ]
  },
  "course/%d7%97%d7%98%d7%a2-2/%d7%a4%d7%95%d7%a1%d7%98-%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99/": {
    title: "שכבת י'",
    category: "חטיבה עליונה",
    subtitle: "שנת המעבר לתיכון והתנעה לקראת תעודת בגרות",
    icon: "Compass",
    content: [
      "ברוכים הבאים לחטיבה העליונה! כיתה י' היא שנת יסוד משמעותית שבה נבנים הרגלי הלמידה הנדרשים לבחינות הבגרות.",
      "בשנה זו, התלמידים משתלבים באופן מלא במגמות הלימוד המורחבות שבחרו, מתחילים את תכנית המעורבות החברתית הארצית (מחויבות אישית), ונחשפים למבנה היבחנות הבגרות החדש של משרד החינוך."
    ],
    sections: [
      {
        title: "משימות מרכזיות בשכבת י'",
        text: "המטרות העיקריות בשנה זו כוללות:",
        list: [
          "הסתגלות לחטיבה העליונה ודרישותיה הלימודיות המוגברות.",
          "תחילת ההיערכות לבגרות במקצועות השונים.",
          "התחלת פרויקט גמר 5 יחידות לימוד במגמות."
        ]
      }
    ]
  },
  "course/%d7%97%d7%98%a2-2/%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%90/": {
    title: "שכבת יא'",
    category: "חטיבה עליונה",
    subtitle: "שנת המאמץ המרוכז והתקדמות משמעותית לקראת תעודת בגרות איכותית",
    icon: "TrendingUp",
    content: [
      "כיתה יא' היא שנת השיא הפדגוגית והלימודית בתיכון משה ארנס, בה נבחנים התלמידים בחלק ניכר מבחינות הבגרות הלאומיות.",
      "בשנה זו אנו שמים דגש מיוחד על ליווי אישי ולימודי ממוקד, בניית מרתוני למידה תומכים וסדנאות פיתוח חוסן אישי על מנת להבטיח את הצלחתם של כל תלמידה ותלמיד."
    ],
    sections: [
      {
        title: "פעילויות שיא בשכבת יא'",
        text: "לצד המאמץ הלימודי, השכבה שותפה לעשייה ערכית וחברתית:",
        list: [
          "המסע הישראלי - מסע חווייתי וערכי המהווה אבן דרך בגיבוש הזהות האישית והאזרחית.",
          "הובלת מיזמי הנצחה וקהילה בפתח תקווה.",
          "ימי עיון וסיורים לימודיים ממוקדים במרכזי מחקר ותעשייה."
        ]
      }
    ]
  },
  "course/%d7%97%d7%98%a2-2/%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%91/": {
    title: "שכבת יב'",
    category: "חטיבה עליונה",
    subtitle: "מסיימים את התיכון בגאווה ומתכוננים לשירות משמעותי ותרומה למדינה",
    icon: "Award",
    content: [
      "כיתה יב' היא שנת הסיכום המרגשת של מסלול הלימודים השש-שנתי בבית ספרנו.",
      "השנה מוקדשת להשלמת תעודת הבגרות, כתיבת עבודות גמר יצירתיות, והכנה מעמיקה ומקיפה לקראת שירות צבאי, לאומי או אזרחי משמעותי בהמשך מורשתו של משה ארנס ז\"ל."
    ],
    sections: [
      {
        title: "אירועי דגל של שכבת יב'",
        text: "שנת הסיום מאופיינת באירועים ייחודיים:",
        list: [
          "סדנאות הכנה לצה\"ל ויום בעקבות לוחמים.",
          "הפקת מופע הסיום החגיגי והמסורתי של בית הספר.",
          "הובלת מועצת התלמידים הבית-ספרית ומיזמי חונכות לתלמידי חטיבת הביניים."
        ]
      }
    ]
  },
  "course/%d7%97%d7%98%a2-2/%d7%aa%d7%9b%d7%a0%d7%99%d7%aa-%d7%94%d7%99%d7%91%d7%97%d7%a0%d7%95%d7%aa-%d7%aa%d7%aa-%d7%a9%d7%a0%d7%aa%d7%99%d7%aa/": {
    title: "תכנית היבחנות תלת שנתית",
    category: "חטיבה עליונה",
    subtitle: "פריסה מבוקרת ומאוזנת של בחינות הבגרות לאורך שלוש השנים",
    icon: "Calendar",
    content: [
      "בית הספר מאמין כי פריסה חכמה של בחינות הבגרות מפחיתה עומסים, מונעת שחיקה ומאפשרת לתלמידים להגיע להישגים מרביים.",
      "תכנית ההיבחנות התלת-שנתית בפתח תקווה מתוכננת בקפידה רבה ומחלקת את המקצועות השונים בין כיתות י', יא' ו-יב' בהתאם לרמה ולדרישות הפדגוגיות."
    ],
    sections: [
      {
        title: "עקרונות חלוקת ההיבחנות בתיכון",
        text: "פריסת המקצועות הכללית בבית הספר:",
        list: [
          "כיתה י' - התמקדות במקצועות פנימיים, הערכה חלופית ותחילת פרויקט מעורבות חברתית.",
          "כיתה יא' - היבחנות במקצועות חובה מובילים (כמו היסטוריה, לשון ותנ\"ך) לצד הגברות ראשונות במגמות.",
          "כיתה יב' - השלמת מקצועות הליבה (מתמטיקה ואנגלית) והגשת פרויקטים מתקדמים ברמת 5 יחידות לימוד."
        ]
      }
    ]
  },
  "course/%d7%97%d7%98%a2-2/%d7%94%d7%aa%d7%99%d7%9b%d7%95%d7%9f-%d7%9b%d7%9e%d7%9b%d7%99%d7%a0%d7%94-%d7%aa%d7%aa-%d7%a9%d7%a0%d7%aa%d7%99%d7%aa/": {
    title: "התיכון כמכינה תלת שנתית",
    category: "חטיבה עליונה",
    subtitle: "הכנה אקדמית, טכנולוגית ומנהיגותית לעולם המחר",
    icon: "Rocket",
    content: [
      "מבנה הלימודים בחטיבה העליונה של שש-שנתי משה ארנס מעוצב ומתוכנן כמכינה אמיתית לחיים הבוגרים, ומעניק לתלמידים ארגז כלים ייחודי.",
      "אנו מציעים למידה מתקדמת, קורסים אקדמיים בשיתוף אוניברסיטאות, סיורים מעשיים בחברות טכנולוגיה מובילות וסדנאות פיתוח חוסן ומנהיגות."
    ],
    sections: [
      {
        title: "מסלולי המכינה לשנת תשפ\"ז",
        text: "התכנית פועלת בשלושה ערוצים מקבילים:",
        list: [
          "הערוץ האקדמי - אפשרות לצבירת נקודות זכות אקדמיות במהלך הלימודים בתיכון.",
          "הערוץ הביטחוני והמנהיגותי - הכנה מנטלית ופיזית מעמיקה לקראת מיונים ליחידות עילית וטכנולוגיות בצה\"ס.",
          "ערוץ היזמות וההייטק - פיתוח פרויקטים מעשיים בליווי מהנדסי תעשייה מהשורה הראשונה."
        ]
      }
    ]
  },
"course/%d7%97%d7%98%a2-2/%d7%9e%d7%b2%d7%9e%d7%95%d7%aa/": {
    title: "מגמות",
    category: "חטיבה עליונה",
    subtitle: "הרחבת אופקים וצבירת 5 יחידות לימוד מעשיות",
    icon: "Cpu",
    content: [
      "מגמות הלימוד בחטיבה העליונה הן המקום בו התלמידים יכולים לחקור את תחומי העניין שלהם לעומק, לצבור יחידות בגרות מוגברות ולהתכונן לעולם התעסוקה והמחקר המודרני.",
      "כל תלמיד בוחר מגמה אחת או שתיים מתוך מגוון רחב של מסלולים מדעיים, הנדסיים, חברתיים ואומנותיים הנתמכים בציוד ומעבדות קצה מתקדמות."
    ],
    sections: [
      {
        title: "פרטי הרשמה ומעקב פדגוגי",
        text: "הקבלה למגמות נעשית על סמך הישגי כיתה ט', ראיונות אישיים עם רכזי המגמה והמלצות הצוות החינוכי."
      }
    ]
  },

  // --- קישורים נוספים ---
  "course/%a4%d7%a8%d7%95%d7%99%d7%a7%d7%98-%d7%94%d7%a9%d7%90%d7%9c%d7%aa-%d7%a1%d7%a4%d7%a8%d7%99%d7%9d-%d7%aa%d7%a9%d7%a4%d7%95/": {
    title: "פרויקט השאלת ספרים תשפ\"ז",
    category: "שירותים להורים",
    subtitle: "הנחיות, הרשמה מקוונת ותנאי השתתפות בפרויקט השאלת ספרי לימוד",
    icon: "BookOpen",
    content: [
      "הורים יקרים של שש-שנתי משה ארנס,",
      "גם בשנת הלימודים הבאה, בית הספר מוביל את פרויקט השאלת ספרי הלימוד הארצי, במטרה להקל על העלויות הכלכליות של ההורים ולהבטיח שלכל תלמיד יהיה סל ספרים מלא, תקין ומעודכן ביום הראשון ללימודים.",
      "ההצטרפות לפרויקט מבוצעת באופן דיגיטלי דרך פורטל ההורים ומותנית בתשלום אגרת ההשאלה השנתית המפוקחת על ידי משרד החינוך והחזרת סל הספרים הנוכחי במצב תקין ושלם."
    ],
    sections: [
      {
        title: "שלבי ההרשמה וחלוקת הספרים",
        text: "אנא עקבו אחר השלבים הבאים:",
        list: [
          "הסדרת תשלום אגרת השאלה (280 ש\"ח לחטיבה, 320 ש\"ח לתיכון) בפורטל ההורים.",
          "החזרת ספרי השנה הקודמת למחסן הספרים הבית-ספרי בהתאם ללוח הזמנים שיישלח.",
          "קבלת סל הספרים החדש בתאריכי החלוקה המרוכזים במהלך חודש אוגוסט."
        ]
      }
    ],
    interactiveFields: [
      {
        label: "שם ההורה הפונה",
        placeholder: "ישראל ישראלי",
        type: "text"
      },
      {
        label: "בחרו שכבת לימוד של הילד",
        placeholder: "בחר שכבה",
        type: "select",
        options: ["שכבה ז", "שכבה ח", "שכבה ט", "שכבה י", "שכבה יא", "שכבה יב"]
      },
      {
        label: "הערות או בקשה מיוחדת לגבי ספרים חסרים",
        placeholder: "כתבו כאן",
        type: "textarea"
      }
    ]
  },
  "course/%d7%9e%d7%99%d7%96%d7%9d-%d7%a0%d7%95%d7%a4%d7%9c%d7%99-%d7%94%d7%a2%d7%99%d7%a8-%d7%a4%d7%aa%d7%97-%d7%aa%d7%a7%d7%95%d7%95%d7%94/": {
    title: "מיזם נופלי העיר פתח תקווה",
    category: "פרויקטים",
    subtitle: "מיזם דיגיטלי חינוכי להנצחת זכרם וסיפורם של נופלי פתח תקווה במלחמות ישראל",
    icon: "Heart",
    content: [
      "\"במותם ציוו לנו את החיים\" - מיזם הנצחת נופלי העיר פתח תקווה הוא מפעל חינוכי וערכי עמוק המובל כולו על ידי תלמידי בית הספר השש-שנתי משה ארנס.",
      "במסגרת המיזם, תלמידינו נפגשים עם משפחות שכולות, חוקרים את קורות חייהם של הנופלים, אוספים תמונות, זיכרונות ועדויות, ומקימים גלעד דיגיטלי חם ומכבד המתעד את סיפורי הגבורה והחיים שנגדעו.",
      "פרויקט זה מפתח בקרב התלמידים תחושת שליחות היסטורית, סולידריות חברתית ואחריות לאומית עמוקה."
    ],
    sections: [
      {
        title: "מטרות המיזם הלאומי-קהילתי",
        text: "עקרונות המיזם:",
        list: [
          "הנצחה דינמית של נופלי העיר דרך סיפורים אישיים ולא רק נתונים יבשים.",
          "חיבור הדור הצעיר לעברם ולמורשת הגבורה של פתח תקווה.",
          "הפקת סרטוני זיכרון וכתבות חקר דיגיטליות המפורסמות ברשת."
        ]
      }
    ]
  },
  "course/%d7%9e%d7%99%d7%93%d7%a2%d7%95%d7%9f-%d7%9e%d7%97%d7%a6%d7%99%d7%aa-%d7%90-%d7%aa%d7%a9%d7%a4%d7%94/": {
    title: "מידעון מחצית",
    category: "עדכונים ומידע",
    subtitle: "מידעון דיגיטלי מסכם של עשייה, הישגים ויוזמות בשש-שנתי ארנס",
    icon: "FileText",
    content: [
      "אנו גאים להציג בפניכם את המידעון הבית-ספרי הדיגיטלי המסכם מחצית גדושה של לימודים, פרויקטים חברתיים, הישגים ספורטיביים ופריצות דרך מדעיות.",
      "המידעון מרכז את הרגעים היפים של תלמידינו - הקלטות פודקאסט, זכייה באליפויות מחוזיות בכדורסל ואתלטיקה, יצירות תיאטרון מקוריות וניסויים מתקדמים במעבדות הסייבר והפיזיקה האווירונאוטית.",
      "אנו מודים לצוותי ההוראה, לתלמידים היוזמים ולהורים השותפים שהופכים את 'ארנס' לבית חם של חינוך ומצוינות."
    ],
    sections: [
      {
        title: "נקודות מפתח מתוך המידעון השנתי",
        text: "הישגים ראויים לציון מהמחצית האחרונה:",
        list: [
          "הקמת חדר הפודקאסטים החדש והשקת ערוץ היוטיוב הרשמי של ביה\"ס.",
          "מקום ראשון לנבחרת הכדורסל של ארנס באליפות משרד החינוך.",
          "קמפיין קהילתי מצליח של מועצת התלמידים לגיוס תרומות בשותפות עם עמותת 'גדולים מהחיים'."
        ]
      }
    ]
  },
  "course/%d7%aa%d7%a9%d7%9c%d7%95%d7%9e%d7%99-%d7%94%d7%95%d7%a8%d7%99%d7%9d-%d7%97%d7%9e%d7%99%d7%91%d7%a2-%d7%a2%d7%9c%d7%99%d7%95%d7%a0%d7%94/": {
    title: "תשלומי הורים חטיבה עליונה",
    category: "שירותים להורים",
    subtitle: "פירוט תשלומי רשות וחובה, אירועי תרבות וסל פעילויות משלים לתיכון",
    icon: "CreditCard",
    content: [
      "הורים יקרים,",
      "תשלומי ההורים המאושרים על ידי משרד החינוך ועדת החינוך של הכנסת משמשים למימון פעילויות תרבות והעשרה משלימות כגון: הצגות, סיורים לימודיים, סל תרבות, מסיבות שכבה, ימי גיבוש, ביטוח תאונות אישיות, ומסעות ישראליים.",
      "אנו מקפידים על גבייה מבוקרת ושקופה ומאפשרים פריסת תשלומים נוחה דרך מערכת הגבייה המקוונת המאובטחת לרווחת המשפחות."
    ],
    sections: [
      {
        title: "פירוט אגרות וסלי השירותים לשנת הלימודים",
        text: "התשלומים מחולקים ל:",
        list: [
          "תשלומי חובה - ביטוח תאונות אישיות לתלמיד (מפוקח ומחייב בחוק).",
          "תשלומי רשות - סל תרבות (הצגות ומופעים), סיורים לימודיים מודרכים ומסיבות סיום.",
          "תרומות רשות ייעודיות - פרויקט השאלת ספרי לימוד ותמיכה ביוזמות רווחה בית-ספריות."
        ]
      }
    ],
    interactiveFields: [
      {
        label: "שם התלמיד ומספר זהות",
        placeholder: "ישראל ישראלי, ת.ז 123456789",
        type: "text"
      },
      {
        label: "שכבת לימוד נוכחית של התלמיד/ה",
        placeholder: "בחר שכבה בתיכון",
        type: "select",
        options: ["כיתה י", "כיתה יא", "כיתה יב"]
      }
    ]
  },
  "course/%d7%98%d7%a4%d7%a1%d7%99-%d7%a8%d7%99%d7%a9%d7%95%d7%9d/": {
    title: "טפסים חשובים",
    category: "טפסים ורישום",
    subtitle: "טפסי רישום, הצהרות בריאות ואישורי פעילות להורדה ישירה",
    icon: "FileText",
    content: [
      "לנוחיותכם, ריכזנו בעמוד זה את כל הטפסים והאישורים הנדרשים לאורך שנת הלימודים בבית הספר השש-שנתי משה ארנס.",
      "אין צורך לשלוח פנייה מוקדמת או להמתין לאישור - פשוט הורידו את הקבצים הנדרשים ישירות מכאן, מלאו אותם והגישו אותם במרוכז.",
      "מילוי מדויק ומהיר של הטפסים מסייע לצוות המנהלי והפדגוגי להעניק לילדיכם מענה בטוח ומיטבי."
    ],
    sections: [
      {
        title: "הנחיות להגשת טפסים",
        text: "לאחר הורדת הקובץ הרלוונטי והדפסתו, אנא הגישו אותו חתום למחנך או למזכירות בהתאם להנחיות המופיעות בראש הטופס."
      }
    ],
    pdfFiles: [
      {
        name: "טופס רישום והצטרפות לבית הספר השש-שנתי (תשפ\"ז)",
        url: "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKFNjaG9vbCBEb2N1bWVudCkKL0NyZWF0b3IgKEFyZW5zIFNjaG9vbCkKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbNCAwIFJdCi9Db3VudCAxCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMyAwIFIKL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNSAwIFIKPj4KPj4KL0NvbnRlbnRzIDYgMCBSCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKNiAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKNTQgNzAwIFRkCihTY2hvb2wgRG9jdW1lbnQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNzMgMDAwMDAgbiAKMDAwMDAwMDEyMCAwMDAwMCBuIAowMDAwMDAwMTcxIDAwMDAwIG4gCjAwMDAwMDAzMDIgMDAwMDAgbiAKMDAwMDAwMDM4MiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDcKL1Jvb3QgMiAwIFIKPj4Kc3RhcnR4cmVmCjQ3OQolJUVPRgo=",
        size: "450 KB"
      },
      {
        name: "הצהרת בריאות שנתית חתומה על ידי הורה (חובה)",
        url: "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKFNjaG9vbCBEb2N1bWVudCkKL0NyZWF0b3IgKEFyZW5zIFNjaG9vbCkKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbNCAwIFJdCi9Db3VudCAxCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMyAwIFIKL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNSAwIFIKPj4KPj4KL0NvbnRlbnRzIDYgMCBSCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKNiAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKNTQgNzAwIFRkCihTY2hvb2wgRG9jdW1lbnQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNzMgMDAwMDAgbiAKMDAwMDAwMDEyMCAwMDAwMCBuIAowMDAwMDAwMTcxIDAwMDAwIG4gCjAwMDAwMDAzMDIgMDAwMDAgbiAKMDAwMDAwMDM4MiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDcKL1Jvb3QgMiAwIFIKPj4Kc3RhcnR4cmVmCjQ3OQolJUVPRgo=",
        size: "280 KB"
      },
      {
        name: "אישור הורים קבוע ליציאה לסיורים וטיולים שנתיים",
        url: "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKFNjaG9vbCBEb2N1bWVudCkKL0NyZWF0b3IgKEFyZW5zIFNjaG9vbCkKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbNCAwIFJdCi9Db3VudCAxCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMyAwIFIKL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNSAwIFIKPj4KPj4KL0NvbnRlbnRzIDYgMCBSCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKNiAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKNTQgNzAwIFRkCihTY2hvb2wgRG9jdW1lbnQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNzMgMDAwMDAgbiAKMDAwMDAwMDEyMCAwMDAwMCBuIAowMDAwMDAwMTcxIDAwMDAwIG4gCjAwMDAwMDAzMDIgMDAwMDAgbiAKMDAwMDAwMDM4MiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDcKL1Jvb3QgMiAwIFIKPj4Kc3RhcnR4cmVmCjQ3OQolJUVPRgo=",
        size: "320 KB"
      },
      {
        name: "בקשת מלגה או הנחה באגרות חינוך ותשלומי הורים",
        url: "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKFNjaG9vbCBEb2N1bWVudCkKL0NyZWF0b3IgKEFyZW5zIFNjaG9vbCkKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbNCAwIFJdCi9Db3VudCAxCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMyAwIFIKL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNSAwIFIKPj4KPj4KL0NvbnRlbnRzIDYgMCBSCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKNiAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKNTQgNzAwIFRkCihTY2hvb2wgRG9jdW1lbnQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNzMgMDAwMDAgbiAKMDAwMDAwMDEyMCAwMDAwMCBuIAowMDAwMDAwMTcxIDAwMDAwIG4gCjAwMDAwMDAzMDIgMDAwMDAgbiAKMDAwMDAwMDM4MiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDcKL1Jvb3QgMiAwIFIKPj4Kc3RhcnR4cmVmCjQ3OQolJUVPRgo=",
        size: "610 KB"
      }
    ]
  }
};

// Helper functions for local storage persistence
export function getInternalPageOverrides(): Record<string, InternalPage> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem('internal_pages_overrides');
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
}

export function getDeletedPageKeys(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('internal_pages_deleted');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

import { syncPageOverrideToCloud, syncGradeClassesToCloud } from '../services/pagesStorage';

export function saveInternalPageOverride(key: string, page: InternalPage) {
  if (typeof window === 'undefined') return;
  try {
    const overrides = getInternalPageOverrides();
    const cleanKey = key.replace(/^\/+|\/+$/g, "");
    overrides[cleanKey] = page;
    if (key !== cleanKey) {
      overrides[key] = page;
    }
    try {
      localStorage.setItem('internal_pages_overrides', JSON.stringify(overrides));
    } catch (lsErr) {
      console.warn('LocalStorage quota exceeded, proceeding with Firestore save:', lsErr);
    }

    // Remove from deleted list if present
    const deleted = getDeletedPageKeys();
    let updatedDeleted = deleted;
    if (deleted.includes(cleanKey) || deleted.includes(key)) {
      updatedDeleted = deleted.filter(k => k !== cleanKey && k !== key);
      try {
        localStorage.setItem('internal_pages_deleted', JSON.stringify(updatedDeleted));
      } catch (e) {}
    }

    // Cloud sync to Firestore
    syncPageOverrideToCloud(overrides, updatedDeleted).catch(console.warn);

    window.dispatchEvent(new Event('internal_pages_updated'));
  } catch (e) {
    console.error('Failed to save override', e);
  }
}

export function deleteInternalPageOverride(key: string) {
  if (typeof window === 'undefined') return;
  try {
    const overrides = getInternalPageOverrides();
    const cleanKey = key.replace(/^\/+|\/+$/g, "");
    delete overrides[cleanKey];
    try {
      localStorage.setItem('internal_pages_overrides', JSON.stringify(overrides));
    } catch (e) {}

    // Remove from deleted list if resetting to default
    const deleted = getDeletedPageKeys();
    let updatedDeleted = deleted;
    if (deleted.includes(cleanKey)) {
      updatedDeleted = deleted.filter(k => k !== cleanKey);
      try {
        localStorage.setItem('internal_pages_deleted', JSON.stringify(updatedDeleted));
      } catch (e) {}
    }

    // Cloud sync to Firestore
    syncPageOverrideToCloud(overrides, updatedDeleted).catch(console.warn);

    window.dispatchEvent(new Event('internal_pages_updated'));
  } catch (e) {
    console.error('Failed to delete override', e);
  }
}

export function deleteInternalPagePermanently(key: string) {
  if (typeof window === 'undefined') return;
  try {
    const cleanKey = key.replace(/^\/+|\/+$/g, "");

    // 1. Remove from overrides
    const overrides = getInternalPageOverrides();
    delete overrides[cleanKey];
    try {
      localStorage.setItem('internal_pages_overrides', JSON.stringify(overrides));
    } catch (e) {}

    // 2. Add to deleted list
    const deleted = getDeletedPageKeys();
    if (!deleted.includes(cleanKey)) {
      deleted.push(cleanKey);
      try {
        localStorage.setItem('internal_pages_deleted', JSON.stringify(deleted));
      } catch (e) {}
    }

    // Cloud sync to Firestore
    syncPageOverrideToCloud(overrides, deleted).catch(console.warn);

    window.dispatchEvent(new Event('internal_pages_updated'));
  } catch (e) {
    console.error('Failed to delete page permanently', e);
  }
}

export function getAllPagesMap(): Record<string, InternalPage> {
  const overrides = getInternalPageOverrides();
  const deletedKeys = getDeletedPageKeys();
  const combined: Record<string, InternalPage> = { ...INTERNAL_PAGES };

  // Add overrides
  Object.entries(overrides).forEach(([key, val]) => {
    combined[key] = val;
    const cleanKey = key.replace(/^\/+|\/+$/g, "");
    combined[cleanKey] = val;
    combined[`${cleanKey}/`] = val;
  });

  // Filter out deleted keys
  deletedKeys.forEach((k) => {
    delete combined[k];
    delete combined[`${k}/`];
    Object.keys(combined).forEach((rawKey) => {
      if (rawKey.replace(/^\/+|\/+$/g, "") === k) {
        delete combined[rawKey];
      }
    });
  });

  return combined;
}

// Map friendly text or alternative keys in case encoding variations occur
export function getInternalPage(key: string): InternalPage | null {
  // Normalize key by removing trailing/leading slashes
  const cleanKey = key.replace(/^\/+|\/+$/g, "");
  
  // Check if deleted
  const deletedKeys = getDeletedPageKeys();
  if (deletedKeys.includes(cleanKey)) {
    return null;
  }
  
  // 1. Check if there is an explicit override for this exact input cleanKey
  const overrides = getInternalPageOverrides();
  if (overrides[cleanKey]) {
    return overrides[cleanKey];
  }

  // 2. Resolve matching raw key from INTERNAL_PAGES
  let matchedRawKey: string | null = null;
  for (const rawKey of Object.keys(INTERNAL_PAGES)) {
    const cleanRawKey = rawKey.replace(/^\/+|\/+$/g, "");
    if (cleanRawKey === cleanKey || cleanRawKey.includes(cleanKey) || cleanKey.includes(cleanRawKey)) {
      matchedRawKey = rawKey;
      break;
    }
  }

  let basePage: InternalPage | null = null;
  let resolvedStorageKey = cleanKey;

  if (matchedRawKey) {
    basePage = INTERNAL_PAGES[matchedRawKey];
    resolvedStorageKey = matchedRawKey.replace(/^\/+|\/+$/g, "");
  } else {
    // Fallback map for common Hebrew strings
    const fallbackMap: Record<string, string> = {
      "דבר המנהלת-שש שנתי": "course/%d7%90%d7%95%d7%93%d7%95%d7%aa%d7%99%d7%a0%d7%95/%d7%93%d7%91%d7%a8-%d7%94%d7%9e%d7%a0%d7%94%d7%9c%d7%aa-%d7%a9%d7%a9-%d7%a9%d7%a0%d7%aa%d7%99/",
      "דבר מנהל חטיבת הנעורים": "course/%d7%93%d7%91%d7%a8-%d7%9e%d7%a0%d7%94%d7%9c-%d7%97%d7%98%d7%91%d7%aa-%d7%94%d7%a0%d7%a2%d7%95%d7%a8%d7%99%d7%9d/",
      "אורחות החיים של ארנס": "course/%d7%90%d7%95%d7%93%d7%95%d7%aa%d7%99%d7%a0%d7%95/%d7%90%d7%95%d7%a8%d7%97%d7%95%d7%aa-%d7%97%d7%99%d7%99%d7%9d-%d7%91%d7%a8%d7%a0%d7%a1/",
      "חזון": "course/%d7%90%d7%95%d7%93%d7%95%d7%aa%d7%99%d7%a0%d7%95/%d7%97%d7%96%d7%95%d7%9f-%d7%91/",
      "שכבת ז'": "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%96-%d7%94%d7%a6%d7%a2%d7%93-%d7%94%d7%a8%d7%90%d7%a9%d7%95%d7%9f-%d7%91%d7%93%d7%a8%d7%9a-%d7%94%d7%97%d7%93%d7%a9%d7%94/",
      "שכבת ח'": "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%97-%d7%a6%d7%9e%d7%99%d7%97%d7%94-%d7%95%d7%94%d7%a2%d7%9e%d7%a7%d7%94-%d7%9e%d7%92%d7%9c%d7%99%d7%9d-%d7%90%d7%aa-%d7%94%d7%9b%d7%95%d7%97%d7%95%d7%aa-%d7%a9/",
      "שכבת ט'": "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%98-%d7%91%d7%97%d7%99%d7%a8%d7%95%d7%aa-%d7%a2%d7%a6%d7%9e%d7%90%d7%95%d7%aa-%d7%95%d7%90%d7%97%d7%a8%d7%99%d7%95%d7%aa/",
      "שכבת י": "course/%d7%97%d7%98%a2-2/%d7%a4%d7%95%d7%a1%d7%98-%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99/",
      "שכבת יא": "course/%d7%97%d7%98%a2-2/%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%90/",
      "שכבת יב": "course/%d7%97%d7%98%a2-2/%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%91/",
      "חוברת מגמות": "course/%d7%97%d7%98%d7%91/%d7%97%d7%95%d7%91%d7%a8%d7%aa-%d7%9e%d7%92%d7%9e%d7%95%d7%aa-%d7%aa%d7%a9%d7%a4%d7%95/",
      "השאלת ספרים": "course/%a4%d7%a8%d7%95%d7%99%d7%a7%d7%98-%d7%94%d7%a9%d7%90%d7%9c%d7%aa-%d7%a1%d7%a4%d7%a8%d7%99%d7%9d-%d7%aa%d7%a9%d7%a4%d7%95/",
      "נופלי העיר": "course/%d7%9e%d7%99%d7%96%d7%9d-%d7%a0%d7%95%d7%a4%d7%9c%d7%99-%d7%94%d7%a2%d7%99%d7%a8-%d7%a4%d7%aa%d7%97-%d7%aa%d7%a7%d7%95%d7%95%d7%94/",
      "מידעון": "course/%d7%9e%d7%99%d7%93%d7%a2%d7%95%d7%9f-%d7%9e%d7%97%d7%a6%d7%99%d7%aa-%d7%90-%d7%aa%d7%a9%d7%a4%d7%94/",
      "תשלומי הורים": "course/%d7%aa%d7%a9%d7%9c%d7%95%d7%9e%d7%99-%d7%94%d7%95%d7%a8%d7%99%d7%9d-%d7%97%d7%98%d7%99%d7%91%d7%94-%d7%a2%d7%9c%d7%99%d7%95%d7%a0%d7%94/",
      "טפסים חשובים": "course/%d7%90%d7%95%d7%93%d7%95%d7%aa%d7%99%d7%a0%d7%95/%d7%90%d7%95%d7%a8%d7%97%d7%95%d7%aa-%d7%97%d7%99%d7%99%d7%9d-%d7%91%d7%a8%d7%a0%d7%a1/"
    };

    let matchedFallbackUrl: string | null = null;
    for (const [hebText, urlVal] of Object.entries(fallbackMap)) {
      if (cleanKey.includes(hebText) || hebText.includes(cleanKey)) {
        matchedFallbackUrl = urlVal;
        break;
      }
    }

    if (matchedFallbackUrl) {
      basePage = INTERNAL_PAGES[matchedFallbackUrl];
      resolvedStorageKey = matchedFallbackUrl.replace(/^\/+|\/+$/g, "");
    } else {
      // Check if it matches any of our custom news articles!
      const matchedArticle = schoolNewsArticles.find(art => {
        if (!art.url) return false;
        const cleanArtUrl = art.url.replace(/^\/+|\/+$/g, "");
        return cleanArtUrl === cleanKey || cleanArtUrl.includes(cleanKey) || cleanKey.includes(cleanArtUrl);
      });

      if (matchedArticle) {
        basePage = {
          title: matchedArticle.title,
          category: "עדכוני בית הספר",
          subtitle: "חדשות ודיווחים שוטפים מחיי העשייה בתיכון משה ארנס",
          content: [
            matchedArticle.content || `שמחים וגאים לשתף אתכם בפרטי העדכון: "${matchedArticle.title}". עשייה מבורכת זו היא נדבך נוסף בחיים השוקקים של בית הספר השש-שנתי ע"ש משה ארנס פתח תקווה.`,
            "האירועים והמיזמים השונים המובלים על ידי תלמידינו וצוותי ההוראה משלבים בין מצוינות אקדמית, פיתוח אישי, יצירתיות ותרומה משמעותית לקהילה ולסביבה.",
            "לפרטים נוספים, רישום לפעילויות המשך או קבלת תמיכה, הורים ותלמידים מוזמנים לפנות לרכזי השכבה או למזכירות דרך עמוד צור הקשר הדיגיטלי."
          ],
          sections: [
            {
              title: "מפתחות להצלחה ומנהיגות בארנס",
              text: "האירוע המוצג משקף את ערכי היסוד של המוסד:",
              list: [
                "חתירה מתמדת למצוינות, חדשנות וחקר מבוסס מיומנויות.",
                "אחריות הדדית, כבוד אדם וחיבור עמוק לקהילת פתח תקווה.",
                "יצירת אקלים חינוכי מיטבי, תומך ומעצים לכל תלמידה ותלמיד."
              ]
            }
          ]
        };
        resolvedStorageKey = matchedArticle.url.replace(/^\/+|\/+$/g, "");
      }
    }
  }

  // 3. If we resolved to a key, see if an override exists for that resolved key
  const resolvedClean = resolvedStorageKey ? resolvedStorageKey.replace(/^\/+|\/+$/g, "") : "";
  if (resolvedClean && overrides[resolvedClean]) {
    return overrides[resolvedClean];
  }

  return basePage;
}

// Helper functions for grade classes/tracks overrides
export function getGradeClassesOverrides(): Record<string, any[]> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem('grade_classes_overrides');
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
}

export function saveGradeClassesOverride(grade: string, classes: any[]) {
  if (typeof window === 'undefined') return;
  try {
    const overrides = getGradeClassesOverrides();
    // Normalize grade key e.g. "ז'", "ז", "י'", "י"
    const cleanGrade = grade.replace(/'/g, '').trim();
    overrides[cleanGrade] = classes;
    try {
      localStorage.setItem('grade_classes_overrides', JSON.stringify(overrides));
    } catch (e) {}
    syncGradeClassesToCloud(overrides).catch(console.warn);
    window.dispatchEvent(new Event('grade_classes_updated'));
  } catch (e) {
    console.error('Failed to save grade classes override', e);
  }
}
