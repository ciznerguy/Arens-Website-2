import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  ShieldCheck,
  FileText,
  UserCheck,
  GraduationCap,
  Layers,
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Building,
  KeyRound,
  FileDown,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface CmsManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CmsManualModal: React.FC<CmsManualModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sections = [
    { id: 'all', title: 'המסמך המלא ברצף', icon: FileText, badge: 'כולל הכל' },
    { id: 'intro', title: 'מבוא וכניסה למערכת', icon: KeyRound, badge: 'כללי' },
    { id: 'super-admin', title: 'חלק א׳: מנהל ראשי וסופר אדמין', icon: ShieldCheck, badge: 'Full Admin' },
    { id: 'junior-high', title: 'חלק ב׳: מנהל חטיבת נעורים', icon: Building, badge: 'חט״ב' },
    { id: 'grade-coord', title: 'חלק ג׳: רכז/ת שכבה ומחנך/ת', icon: Layers, badge: 'שכבות' },
    { id: 'major-coord', title: 'חלק ד׳: רכז/ת מגמה ומקצוע', icon: GraduationCap, badge: 'מגמות' },
    { id: 'teacher-profile', title: 'חלק ה׳: פרופיל מורה ועורך תוכן', icon: UserCheck, badge: 'סגל' },
    { id: 'guidelines', title: 'חלק ו׳: אבטחה, פרטיות וזכויות יוצרים', icon: AlertTriangle, badge: 'דגשים' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    const title = 'מדריך_שימוש_מערכת_ניהול_ארנס_לפי_תפקידים';
    const content = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>חוברת הוראות שימוש במערכת הניהול (CMS) - תיכון ארנס</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; line-height: 1.6; color: #1e293b; background: #fff; padding: 40px; margin: 0; direction: rtl; }
    h1 { color: #0f172a; border-bottom: 3px solid #0284c7; padding-bottom: 12px; margin-bottom: 8px; }
    h2 { color: #0369a1; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 36px; }
    h3 { color: #0f766e; margin-top: 20px; }
    .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: bold; margin-bottom: 10px; }
    .card { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 18px; margin: 15px 0; }
    .tip { background: #fef3c7; border-right: 4px solid #f59e0b; padding: 12px 16px; margin: 12px 0; border-radius: 4px; }
    ul { padding-right: 22px; }
    li { margin-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: right; }
    th { background: #f1f5f9; color: #0f172a; font-weight: bold; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #cbd5e1; font-size: 13px; color: #64748b; text-align: center; }
    @media print { body { padding: 15px; } .card { break-inside: avoid; } h2 { break-before: auto; } }
  </style>
</head>
<body>
  <div style="text-align: center; margin-bottom: 30px;">
    <div style="font-size: 14px; color: #64748b; font-weight: bold;">תיכון שש-שנתי ע"ש משה ארנס • משרד החינוך (מחוז תל אביב)</div>
    <h1>חוברת הוראות ומדריך שימוש במערכת הניהול (CMS)</h1>
    <div style="color: #475569; font-size: 15px;">הנחיות הפעלה מפורטות לפי תפקידים והרשאות • שנת הלימודים תשפ"ו (2026)</div>
  </div>

  <h2>1. מבוא, כניסה למערכת וכללי יסוד</h2>
  <div class="card">
    <p>מערכת הניהול (CMS) של תיכון ארנס מאפשרת לצוות בית הספר לנהל ולעדכן את תכני האתר בזמן אמת, באופן עצמאי, פשוט ומאובטח. המערכת פועלת בענן ומסנכרנת את השינויים מיד לכלל המשתמשים.</p>
    <h3>כיצד נכנסים למערכת?</h3>
    <ul>
      <li>גולשים לאתר בית הספר בכתובת: <strong>arens.org.il</strong>.</li>
      <li>גוללים לתחתית העמוד או לוחצים על כפתור המנעול הדיסקרטי בפינת האתר.</li>
      <li>מזינים את כתובת הדוא"ל המורשית שלכם (חשבון משרד החינוך / Google הארגוני <code>@taded.org.il</code> או מייל שאושר מראש).</li>
      <li>מיד עם ההזדהות, המערכת תזהה את תפקידכם ותפתח בפניכם את לשוניות העריכה המותאמות במדויק להרשאותיכם.</li>
    </ul>
    <div class="tip"><strong>דגש חשוב:</strong> כל שמירה מתבצעת ישירות לענן. מומלץ לבדוק את התצוגה המקדימה בסיום העריכה.</div>
  </div>

  <h2>2. חלק א׳: מנהל ראשי וסופר אדמין (Full Site Admin)</h2>
  <div class="card">
    <span class="badge">הרשאה מלאה לכל חלקי האתר</span>
    <p>בעלי תפקיד זה מנהלים את התשתית הראשית של האתר, את ההודעות המרכזיות, את הגדרות המערכת וכלל העורכים:</p>
    <ul>
      <li><strong>דף הבית (Homepage CMS):</strong>
        <ul>
          <li><strong>הודעה מתפרצת (Breaking Banner):</strong> עדכון הודעה דחופה בראש האתר, בחירת צבע התראה, הגדרת קישור רלוונטי והפעלה/כיבוי בלחיצת כפתור.</li>
          <li><strong>חלון קופץ מרכזי (Modal Announcement):</strong> ניסוח הודעה חגיגית או דחופה הנפתחת בעת כניסת גולשים לאתר, הוספת תמונה וכפתור הנעה לפעולה.</li>
          <li><strong>באנר עליון (Hero Section):</strong> עריכת כותרת ראשית, משפט מפתח (סלוגן) ותמונות מתחלפות.</li>
          <li><strong>מדדי מצוינות וסטטיסטיקות:</strong> עדכון נתוני הצלחה, זכאות לתעודת בגרות, אחוזי גיוס ופרויקטים ייחודיים.</li>
        </ul>
      </li>
      <li><strong>קטלוג דפי התוכן (Pages):</strong>
        <ul>
          <li>יצירת דפי תוכן חדשים ועריכת דפים קיימים.</li>
          <li>שיוך חטיבתי: שש-שנתי (מוצג לכלל באי האתר), חטיבת נעורים (ז׳-ט׳), או חטיבה עליונה (י׳-יב׳).</li>
          <li>עריכת פסקאות, הוספת גלריות תמונות, קבצים להורדה (PDF/טפסים) וקישורי וידאו.</li>
        </ul>
      </li>
      <li><strong>קישורים מהירים (Quick Links):</strong> הוספה וסידור כפתורי ניווט מהיר בדף הבית (משו״ב, פורטל עובדי הוראה, מודל וכו').</li>
      <li><strong>חדשות ועדכונים (News):</strong> העלאת כתבות חדשות, גלריות אירועים, וסימון כתבות מובלטות שיופיעו בראש הדף.</li>
      <li><strong>סגל מורים (Staff Directory):</strong> הוספת מורים, עדכון שיוך כיתתי, מקצועות הוראה ופרטי קשר.</li>
      <li><strong>ניהול עורכים והרשאות (Editors):</strong> הוספת אנשי צוות למערכת הניהול והגדרת תפקידם המדויק.</li>
      <li><strong>עיצוב ותמות האתר (Themes):</strong> מעבר בין ערכות צבעים (Dark, Light, Cosmic, Cyber) ובחירת סגנונות עיצוב.</li>
      <li><strong>רשתות חברתיות ומזכירות:</strong> עדכון קישורים לפייסבוק/אינסטגרם/יוטיוב וכתובות הדוא"ל של מזכירויות חט"נ וחט"ע.</li>
      <li><strong>לוח אירועים וסדנאות:</strong> סנכרון עם Google Calendar והגדרת אירועים פדגוגיים.</li>
    </ul>
  </div>

  <h2>3. חלק ב׳: מנהל חטיבת נעורים (חט״ב - שכבות ז׳-ט׳)</h2>
  <div class="card">
    <span class="badge">מורשה חט"ב מלא</span>
    <p>למנהל חטיבת הנעורים הרשאה ממוקדת לניהול כלל התכנים והפעילויות של שכבות חטיבת הביניים:</p>
    <ul>
      <li><strong>דפי תוכן חטיבתיים:</strong> עריכה ויצירה של דפי תוכן המשויכים לחטיבת הנעורים ולמרחב השש-שנתי (דפי פרויקטים, מעברים, קליטת תלמידי כיתות ו׳ ועוד).</li>
      <li><strong>ניהול שכבות ז׳, ח׳, ט׳:</strong> שליטה מלאה בלוחות ההודעות, מערכות השעות, ולוחות המבחנים של כל אחת משלוש שכבות החטיבה.</li>
      <li><strong>מגמות ומסלולי חט״ב:</strong> עדכון מסלולי ההצטיינות הייחודיים לחטיבת הנעורים (מופת, מדעים, שפות, ספורט ועוד).</li>
    </ul>
  </div>

  <h2>4. חלק ג׳: רכז/ת שכבה ומחנך/ת</h2>
  <div class="card">
    <span class="badge">ניהול השכבה שלי</span>
    <p>רכזי שכבות ומחנכים מקבלים גישה ישירה ללשונית "ניהול השכבה שלי" לשכבה עליה הם מופקדים (לדוגמה: שכבה יב׳):</p>
    <ul>
      <li><strong>לוח מודעות שכבתי:</strong> פרסום עדכונים שוטפים לתלמידים ולהורים (לוחות זמנים, פעילויות חברתיות, ימי הורים, טיולים שנתיים).</li>
      <li><strong>מערכת שעות שבועית:</strong> העלאת קובץ מערכת שעות עדכני או קישור ישיר לצפייה במערכת.</li>
      <li><strong>לוח מבחנים ואירועים:</strong> עדכון מועדי בחינות, מתכונות, מועדי ב׳ וימי שיא שכבתיים.</li>
      <li><strong>צוות מחנכים ובעלי תפקידים:</strong> הצגת רשימת כיתות השכבה, שמות המחנכים ושעות קבלת הורים.</li>
      <li><strong>קבצים וטפסים להורדה:</strong> העלאת אישורי יציאה לפעילות חוץ, הנחיות לעבודות קיץ, ודפי קשר.</li>
    </ul>
  </div>

  <h2>5. חלק ד׳: רכז/ת מגמה ומקצוע (אנגלית, מדעי המחשב וכד׳)</h2>
  <div class="card">
    <span class="badge">עריכת מגמה / דפי מקצוע</span>
    <p>רכזי מגמות ומקצועות נהנים מגישה ממוקדת לעדכון מרחב המגמה שלהם באתר:</p>
    <ul>
      <li><strong>חזון המגמה ותנאי קבלה:</strong> תיאור מטרות המגמה, ייחודיות הלמידה, תנאי סף ודרישות קבלה למועמדים.</li>
      <li><strong>סילבוס ותוכנית הלימודים:</strong> פירוט נושאי הלימוד לפי שנות לימוד (כיתות י׳, יא׳, יב׳), היקף יחידות לימוד ומבנה הבגרות.</li>
      <li><strong>חומרי למידה ופרויקטים:</strong> הצגת תוצרי תלמידים, עבודות גמר מצטיינות, קישורים לסביבות תכנות ומעבדות.</li>
      <li><strong>סגל מורי המגמה:</strong> פירוט המורים המלמדים במגמה ותחומי התמחותם.</li>
    </ul>
  </div>

  <h2>6. חלק ה׳: פרופיל מורה אישי ועורך תוכן</h2>
  <div class="card">
    <span class="badge">עבור כלל מורי וצוות בית הספר</span>
    <p>כל מורה בעל הרשאת עריכה יכול לעדכן את כרטיס המורה האישי המוצג בסגל בית הספר:</p>
    <ul>
      <li><strong>לשונית "הפרופיל שלי":</strong> לחיצה על הלשונית בראש מערכת הניהול.</li>
      <li><strong>העלאת תמונת פרופיל אישית:</strong> בחירת תמונה מהמחשב או הנייד (המערכת מכווצת את התמונה אוטומטית להתאמה מיטבית).</li>
      <li><strong>תפקידים ומקצועות:</strong> פירוט תפקידי ההוראה, מקצועות הלימוד, חינוך כיתה וריכוז.</li>
      <li><strong>דרכי התקשרות ושעות מענה:</strong> כתובת מייל ליצירת קשר ושעות ייעודיות לשיח עם תלמידים והורים.</li>
    </ul>
  </div>

  <h2>7. חלק ו׳: דגשי אבטחה, פרטיות וזכויות יוצרים</h2>
  <div class="card" style="border-right: 4px solid #ef4444;">
    <ul>
      <li><strong>פרטיות תלמידים:</strong> חל איסור מוחלט על פרסום ציונים אישיים, מספרי תעודות זהות או מידע רפואי/אישי של תלמידים.</li>
      <li><strong>אישורי צילום:</strong> פרסום תמונות תלמידים יתבצע רק עבור תלמידים שיש עבורם אישור פרסום תקף בתחילת השנה.</li>
      <li><strong>זכויות יוצרים:</strong> יש לוודא שימוש בתמונות, סרטונים וחומרים מקוריים של בית הספר או כאלו המותרים בשימוש חינוכי.</li>
      <li><strong>סיום עבודה:</strong> בסיום עדכון התכנים, מומלץ לבצע יציאה מסודרת ממערכת הניהול (Logout).</li>
    </ul>
  </div>

  <div class="footer">
    תיכון שש-שנתי ע"ש משה ארנס • רכז תקשוב וחדשנות דיגיטלית: גיא ציזנר (ciznerguy@taded.org.il)
  </div>
</body>
</html>`;

    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    if (printableRef.current) {
      navigator.clipboard.writeText(printableRef.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto cursor-pointer"
      dir="rtl"
      onClick={onClose}
    >
      {/* Container */}
      <div
        className="bg-[#0e172a] border border-school-cyan/40 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-fade-in text-white cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#13203c] via-[#0f192f] to-[#122244] border-b border-school-line/60 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-school-cyan to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-school-cyan/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-school-cyan uppercase tracking-wider bg-school-cyan/10 border border-school-cyan/30 px-2.5 py-0.5 rounded-full">
                  תיכון ארנס • מערכת ניהול CMS
                </span>
                <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  תשפ״ו 2026
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                חוברת הוראות שימוש במערכת הניהול של האתר
              </h2>
              <p className="text-xs text-school-muted">
                מדריך מפורט לפי תפקידים והרשאות: מנהל ראשי, חט״ב, רכזי שכבות, רכזי מגמות וסגל ההוראה
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 hover:text-school-cyan border border-white/20 text-white font-black text-xs transition-all cursor-pointer shadow-sm"
              title="חזרה למרחב התקשוב"
            >
              <ChevronRight className="w-4 h-4 text-school-cyan" />
              <span>חזרה</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-school-cyan hover:bg-cyan-300 text-slate-950 font-black text-xs transition-all shadow-md shadow-school-cyan/20"
              title="הדפסה או שמירה כ-PDF"
            >
              <Printer className="w-4 h-4" />
              <span>הדפסה / שמירה כ-PDF</span>
            </button>

            <button
              onClick={handleDownloadHtml}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs transition-all"
              title="הורדת קובץ מסמך עצמאי להדפסה וקריאה במחשב"
            >
              <Download className="w-4 h-4 text-school-cyan" />
              <span className="hidden sm:inline">הורדת קובץ מסמך</span>
            </button>

            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs transition-all"
              title="העתקת תוכן המסמך ללוח"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-school-muted" />}
              <span className="hidden md:inline">{copied ? 'הועתק!' : 'העתק'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 border border-white/20 flex items-center justify-center text-white transition-all mr-1"
              title="סגירה"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Tabs (Quick Jump) */}
        <div className="bg-[#0b1222] border-b border-school-line/40 px-4 py-2.5 overflow-x-auto flex items-center gap-1.5 scrollbar-thin">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-school-cyan text-slate-950 shadow-md shadow-school-cyan/20'
                    : 'bg-white/5 text-school-muted hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-school-cyan'}`} />
                <span>{sec.title}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body / Printable Document */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-8 text-sm leading-relaxed" ref={printableRef}>
          
          {/* Header Card for Document */}
          <div className="bg-gradient-to-br from-[#121f38] to-[#0c1424] border border-school-cyan/30 rounded-2xl p-5 sm:p-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
              <div>
                <span className="text-[11px] font-extrabold text-school-cyan tracking-wider">
                  תיכון שש-שנתי ע״ש משה ארנס • משרד החינוך
                </span>
                <h1 className="text-2xl font-black text-white mt-0.5">
                  חוברת הוראות ומדריך שימוש במערכת הניהול (CMS)
                </h1>
                <p className="text-xs text-school-muted mt-1">
                  הנחיות עבודה מובחנות לפי הרשאות: מנהלים ראשיים, הנהלת חט״ב, רכזי שכבות, רכזי מקצוע ומגמה, תקשוב ומורים
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto bg-black/30 border border-white/10 px-3 py-2 rounded-xl text-xs font-mono text-school-muted">
                <span>גרסה: תשפ״ו (2026)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/5 border border-white/5 p-2.5 rounded-xl">
                <span className="text-[10px] text-school-muted block">כתובת המערכת</span>
                <span className="font-bold text-school-cyan">arens.org.il</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-2.5 rounded-xl">
                <span className="text-[10px] text-school-muted block">סוג הזדהות</span>
                <span className="font-bold text-white">Google / משרד החינוך</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-2.5 rounded-xl">
                <span className="text-[10px] text-school-muted block">סנכרון ענן</span>
                <span className="font-bold text-emerald-400">מיידי</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-2.5 rounded-xl">
                <span className="text-[10px] text-school-muted block">תמיכה טכנית</span>
                <span className="font-bold text-amber-300">רכז תקשוב (גיא ציזנר)</span>
              </div>
            </div>
          </div>

          {/* SECTION: INTRO */}
          {(activeSection === 'all' || activeSection === 'intro') && (
            <div className="bg-[#101b33] border border-school-line/60 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-school-line/40 pb-3">
                <KeyRound className="w-5 h-5 text-school-cyan" />
                <h3 className="text-lg font-black text-white">1. מבוא, כניסה למערכת וכללי יסוד</h3>
                <span className="text-[11px] bg-school-cyan/10 text-school-cyan border border-school-cyan/30 px-2 py-0.5 rounded-full font-bold mr-auto">
                  מדריך כניסה
                </span>
              </div>

              <p className="text-xs sm:text-sm text-school-muted">
                מערכת הניהול של אתר תיכון ארנס נבנתה במטרה לאפשר לכל בעל תפקיד בבית הספר לנהל את המרחב הרלוונטי עבורו בצורה פשוטה, ידידותית ומהירה, ללא צורך בידע טכני מוקדם.
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">שלבי הכניסה למערכת:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-[#0b1222] border border-white/10 rounded-xl p-3.5 space-y-1.5">
                    <div className="w-6 h-6 rounded-lg bg-school-cyan text-slate-950 font-black flex items-center justify-center text-xs">1</div>
                    <div className="font-bold text-white">גלישה לאתר</div>
                    <p className="text-school-muted text-[11px]">נכנסים לכתובת <strong className="text-school-cyan">arens.org.il</strong> מכל מחשב או טלפון נייד.</p>
                  </div>
                  <div className="bg-[#0b1222] border border-white/10 rounded-xl p-3.5 space-y-1.5">
                    <div className="w-6 h-6 rounded-lg bg-school-cyan text-slate-950 font-black flex items-center justify-center text-xs">2</div>
                    <div className="font-bold text-white">כפתור ניהול / מנעול</div>
                    <p className="text-school-muted text-[11px]">גוללים לתחתית העמוד או לוחצים על כפתור המנעול הדיסקרטי הממוקם בפוטר האתר.</p>
                  </div>
                  <div className="bg-[#0b1222] border border-white/10 rounded-xl p-3.5 space-y-1.5">
                    <div className="w-6 h-6 rounded-lg bg-school-cyan text-slate-950 font-black flex items-center justify-center text-xs">3</div>
                    <div className="font-bold text-white">הזדהות אוטומטית</div>
                    <p className="text-school-muted text-[11px]">מזינים את כתובת הדוא״ל הארגונית שלכם (סיומת <code>@taded.org.il</code>) להזדהות מאובטחת.</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs p-3.5 rounded-xl flex items-start gap-2.5">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <strong>שמירה אוטומטית בזמן אמת:</strong> המערכת פועלת מול ענן נתונים חי. כל לחיצה על "שמירה" או עדכון טופס מתעדכנת מיד באתר החי ומסונכרנת לכל הגולשים.
                </div>
              </div>
            </div>
          )}

          {/* SECTION: SUPER ADMIN */}
          {(activeSection === 'all' || activeSection === 'super-admin') && (
            <div className="bg-[#101b33] border border-school-line/60 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-school-line/40 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-black text-white">2. חלק א׳: מנהל ראשי וסופר אדמין (Full Site Admin)</h3>
                <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold mr-auto">
                  כלל חלקי האתר
                </span>
              </div>

              <p className="text-xs sm:text-sm text-school-muted">
                למנהל הראשי ולסופר אדמין גישה מלאה לכלל לשוניות הניהול, הגדרות האתר, עיצוב ותשתית העורכים:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Homepage */}
                <div className="bg-[#0b1222] border border-white/10 rounded-xl p-4 space-y-2">
                  <h4 className="font-black text-white flex items-center gap-1.5 text-sm">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>ניהול דף הבית (Homepage)</span>
                  </h4>
                  <ul className="space-y-1.5 text-school-muted">
                    <li>• <strong>הודעה מתפרצת (Breaking Banner):</strong> עדכון הודעה דחופה בראש האתר, בחירת צבע התראה וקישור.</li>
                    <li>• <strong>חלון קופץ מרכזי (Modal Announcement):</strong> הודעה חגיגית הנפתחת בעת כניסת גולשים לאתר עם תמונה וכפתור לפעולה.</li>
                    <li>• <strong>באנר Hero:</strong> עריכת כותרת ראשית, משפט מפתח (סלוגן) ותמונות מתחלפות.</li>
                    <li>• <strong>מדדי מצוינות:</strong> עדכון נתוני הצלחה, זכאות לבגרות, אחוזי גיוס ופרויקטים.</li>
                  </ul>
                </div>

                {/* Pages */}
                <div className="bg-[#0b1222] border border-white/10 rounded-xl p-4 space-y-2">
                  <h4 className="font-black text-white flex items-center gap-1.5 text-sm">
                    <FileText className="w-4 h-4 text-school-cyan" />
                    <span>קטלוג דפי תוכן (Pages)</span>
                  </h4>
                  <ul className="space-y-1.5 text-school-muted">
                    <li>• <strong>יצירת דפים חדשים:</strong> הוספת דף תוכן ייעודי עם כותרת, תיאור, תוכן עשיר וגלריה.</li>
                    <li>• <strong>שיוך חטיבתי:</strong> שש-שנתי (מוצג לכלל), חטיבת נעורים (ז׳-ט׳), או חטיבה עליונה (י׳-יב׳).</li>
                    <li>• <strong>קבצים וקישורים:</strong> הוספת קבצים להורדה (PDF) וקישורים חיצוניים.</li>
                  </ul>
                </div>

                {/* News & Editors */}
                <div className="bg-[#0b1222] border border-white/10 rounded-xl p-4 space-y-2">
                  <h4 className="font-black text-white flex items-center gap-1.5 text-sm">
                    <UserCheck className="w-4 h-4 text-purple-400" />
                    <span>עורכים, סגל וחדשות</span>
                  </h4>
                  <ul className="space-y-1.5 text-school-muted">
                    <li>• <strong>צוות עורכים (Editors):</strong> הוספת עורכים חדשים והגדרת תפקידם המדויק.</li>
                    <li>• <strong>סגל מורים (Staff):</strong> עדכון מורים, מקצועות, כיתות ותמונות פרופיל.</li>
                    <li>• <strong>חדשות ואירועים (News):</strong> העלאת כתבות, תמונות והצמדת כתבות מובלטות לראש הדף.</li>
                  </ul>
                </div>

                {/* Theme, Social & Contact */}
                <div className="bg-[#0b1222] border border-white/10 rounded-xl p-4 space-y-2">
                  <h4 className="font-black text-white flex items-center gap-1.5 text-sm">
                    <Building className="w-4 h-4 text-blue-400" />
                    <span>עיצוב, רשתות והגדרות מזכירות</span>
                  </h4>
                  <ul className="space-y-1.5 text-school-muted">
                    <li>• <strong>עיצוב ותמות (Themes):</strong> בחירת ערכת צבעים (Dark, Light, Cosmic, Cyber) וסגנון.</li>
                    <li>• <strong>רשתות חברתיות:</strong> עדכון קישורים לפייסבוק, אינסטגרם, יוטיוב וטיקטוק בית ספרי.</li>
                    <li>• <strong>מזכירות ויצירת קשר:</strong> עדכון כתובות דוא״ל של מזכירות חט״נ וחט״ע, טלפונים ופקס.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: JUNIOR HIGH DIRECTOR */}
          {(activeSection === 'all' || activeSection === 'junior-high') && (
            <div className="bg-[#101b33] border border-school-line/60 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-school-line/40 pb-3">
                <Building className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-black text-white">3. חלק ב׳: מנהל חטיבת נעורים (חט״ב - שכבות ז׳-ט׳)</h3>
                <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold mr-auto">
                  מורשה חט״ב מלא
                </span>
              </div>

              <p className="text-xs sm:text-sm text-school-muted">
                מנהל חטיבת הנעורים מורשה לנהל באופן בלעדי וממוקד את כלל התכנים והפעילויות של שכבות חטיבת הביניים:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#0b1222] border border-white/10 rounded-xl p-4 space-y-2">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>דפי תוכן חטיבתיים</span>
                  </div>
                  <p className="text-school-muted text-[11px]">
                    עריכה ויצירה של דפי תוכן המשויכים לחטיבת הנעורים ולמרחב השש-שנתי (פרויקטים ייחודיים, מעברים, קליטת כיתות ו׳ ועוד).
                  </p>
                </div>

                <div className="bg-[#0b1222] border border-white/10 rounded-xl p-4 space-y-2">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>ניהול שכבות ז׳, ח׳, ט׳</span>
                  </div>
                  <p className="text-school-muted text-[11px]">
                    שליטה מלאה בלוח ההודעות, מערכות השעות, לוח המבחנים וקבצי ההורדה של כל אחת משלוש שכבות החטיבה.
                  </p>
                </div>

                <div className="bg-[#0b1222] border border-white/10 rounded-xl p-4 space-y-2">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>מגמות ומסלולי חט״ב</span>
                  </div>
                  <p className="text-school-muted text-[11px]">
                    עדכון מסלולי ההצטיינות הייחודיים לחטיבת הנעורים (מופת, מדעים, שפות, ספורט ואומנויות).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: GRADE COORDINATOR */}
          {(activeSection === 'all' || activeSection === 'grade-coord') && (
            <div className="bg-[#101b33] border border-school-line/60 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-school-line/40 pb-3">
                <Layers className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white">4. חלק ג׳: רכז/ת שכבה ומחנך/ת</h3>
                <span className="text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold mr-auto">
                  ניהול השכבה שלי
                </span>
              </div>

              <p className="text-xs sm:text-sm text-school-muted">
                רכזי שכבות ומחנכים מקבלים גישה ישירה ללשונית "ניהול השכבה שלי" לשכבה עליה הם מופקדים (לדוגמה: שכבה יב׳):
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#0b1222] border border-white/10 rounded-xl p-3.5 space-y-1">
                  <div className="font-bold text-white">לוח מודעות והודעות שכבתי</div>
                  <p className="text-school-muted text-[11px]">פרסום עדכונים שוטפים לתלמידים ולהורים (לוחות זמנים, פעילויות חברתיות, ימי הורים, טיולים שנתיים).</p>
                </div>
                <div className="bg-[#0b1222] border border-white/10 rounded-xl p-3.5 space-y-1">
                  <div className="font-bold text-white">מערכת שעות שבועית</div>
                  <p className="text-school-muted text-[11px]">העלאת קובץ מערכת שעות עדכני או קישור ישיר לצפייה במערכת.</p>
                </div>
                <div className="bg-[#0b1222] border border-white/10 rounded-xl p-3.5 space-y-1">
                  <div className="font-bold text-white">לוח מבחנים ואירועים</div>
                  <p className="text-school-muted text-[11px]">עדכון מועדי בחינות, מתכונות, מועדי ב׳ וימי שיא שכבתיים.</p>
                </div>
                <div className="bg-[#0b1222] border border-white/10 rounded-xl p-3.5 space-y-1">
                  <div className="font-bold text-white">צוות מחנכים וקבצים להורדה</div>
                  <p className="text-school-muted text-[11px]">הצגת רשימת כיתות השכבה, שמות המחנכים, שעות קבלה והעלאת אישורי יציאה לפעילות ודפי הנחיות.</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: MAJOR / SUBJECT COORDINATOR */}
          {(activeSection === 'all' || activeSection === 'major-coord') && (
            <div className="bg-[#101b33] border border-school-line/60 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-school-line/40 pb-3">
                <GraduationCap className="w-5 h-5 text-school-cyan" />
                <h3 className="text-lg font-black text-white">5. חלק ד׳: רכז/ת מגמה ומקצוע (אנגלית, מדעי המחשב וכד׳)</h3>
                <span className="text-[11px] bg-school-cyan/10 text-school-cyan border border-school-cyan/30 px-2 py-0.5 rounded-full font-bold mr-auto">
                  עריכת מגמה ומקצוע
                </span>
              </div>

              <p className="text-xs sm:text-sm text-school-muted">
                רכזי מגמות ומקצועות נהנים מגישה ממוקדת לעדכון מרחב המגמה שלהם באתר (לדוגמה: דפי מקצוע אנגלית, מדעי המחשב והנדסת תוכנה):
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#0b1222] border border-white/10 rounded-xl p-3.5 space-y-1">
                  <div className="font-bold text-white">חזון ותנאי קבלה למגמה</div>
                  <p className="text-school-muted text-[11px]">תיאור מטרות המגמה, ייחודיות הלמידה, תנאי סף ודרישות קבלה למועמדים.</p>
                </div>
                <div className="bg-[#0b1222] border border-white/10 rounded-xl p-3.5 space-y-1">
                  <div className="font-bold text-white">סילבוס ותוכנית הלימודים</div>
                  <p className="text-school-muted text-[11px]">פירוט נושאי הלימוד לפי שנות לימוד (י׳, יא׳, יב׳), היקף יחידות לימוד ומבנה בחינות הבגרות.</p>
                </div>
                <div className="bg-[#0b1222] border border-white/10 rounded-xl p-3.5 space-y-1">
                  <div className="font-bold text-white">פרויקטים וחומרי עזר</div>
                  <p className="text-school-muted text-[11px]">הצגת תוצרי תלמידים, עבודות גמר מצטיינות, קישורים לסביבות למידה ומעבדות.</p>
                </div>
                <div className="bg-[#0b1222] border border-white/10 rounded-xl p-3.5 space-y-1">
                  <div className="font-bold text-white">סגל מורי המגמה</div>
                  <p className="text-school-muted text-[11px]">פירוט המורים המלמדים במגמה, תחומי התמחותם ודרכי יצירת קשר.</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: TEACHER PROFILE */}
          {(activeSection === 'all' || activeSection === 'teacher-profile') && (
            <div className="bg-[#101b33] border border-school-line/60 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-school-line/40 pb-3">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-black text-white">6. חלק ה׳: פרופיל מורה אישי ועורך תוכן</h3>
                <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold mr-auto">
                  עבור כלל המורים
                </span>
              </div>

              <p className="text-xs sm:text-sm text-school-muted">
                כל מורה בעל הרשאת עריכה במערכת יכול לעדכן את כרטיס המורה האישי שלו המוצג בעמוד סגל בית הספר:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#0b1222] border border-white/10 rounded-xl p-3.5 space-y-1">
                  <div className="font-bold text-white">לשונית "הפרופיל שלי"</div>
                  <p className="text-school-muted text-[11px]">נכנסים למערכת הניהול ולוחצים על הלשונית הראשונה "הפרופיל שלי".</p>
                </div>
                <div className="bg-[#0b1222] border border-white/10 rounded-xl p-3.5 space-y-1">
                  <div className="font-bold text-white">העלאת תמונת פרופיל</div>
                  <p className="text-school-muted text-[11px]">בוחרים תמונה מהמחשב או הטלפון. המערכת תבצע כיווץ אוטומטי לטעינה מהירה באתר.</p>
                </div>
                <div className="bg-[#0b1222] border border-white/10 rounded-xl p-3.5 space-y-1">
                  <div className="font-bold text-white">תפקידים ודרכי התקשרות</div>
                  <p className="text-school-muted text-[11px]">מעדכנים מקצועות הוראה, כיתות חינוך, כתובת מייל ושעות מענה להורים ותלמידים.</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: GUIDELINES & SECURITY */}
          {(activeSection === 'all' || activeSection === 'guidelines') && (
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-rose-500/30 pb-3">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="text-lg font-black text-rose-200">7. חלק ו׳: דגשי אבטחה, פרטיות וזכויות יוצרים</h3>
                <span className="text-[11px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold mr-auto">
                  דגשי חובה
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-black/30 border border-rose-500/20 rounded-xl p-3.5 space-y-1">
                  <div className="font-bold text-white">הגנת פרטיות תלמידים</div>
                  <p className="text-rose-200/80 text-[11px]">
                    חל איסור מוחלט על פרסום ציונים אישיים, מספרי תעודות זהות, חוות דעת אישיות או מידע רפואי באתר.
                  </p>
                </div>
                <div className="bg-black/30 border border-rose-500/20 rounded-xl p-3.5 space-y-1">
                  <div className="font-bold text-white">אישורי צילום תקפים</div>
                  <p className="text-rose-200/80 text-[11px]">
                    פרסום תמונות תלמידים מפעילויות יתבצע אך ורק עבור תלמידים שהוריהם אישרו פרסום בטופס תחילת השנה.
                  </p>
                </div>
                <div className="bg-black/30 border border-rose-500/20 rounded-xl p-3.5 space-y-1">
                  <div className="font-bold text-white">זכויות יוצרים בחומרים</div>
                  <p className="text-rose-200/80 text-[11px]">
                    שימוש בתמונות, סרטונים וקבצים ייעשה תוך הקפדה על זכויות יוצרים או שימוש בחומרים בית ספריים מקוריים.
                  </p>
                </div>
                <div className="bg-black/30 border border-rose-500/20 rounded-xl p-3.5 space-y-1">
                  <div className="font-bold text-white">יציאה מסודרת מהמערכת</div>
                  <p className="text-rose-200/80 text-[11px]">
                    בסיום עבודת העריכה (במיוחד ממחשב משותף בחדר המורים), הקפידו על לחיצה על כפתור היציאה (Logout).
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-[#101b33] border-t border-school-line/60 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-school-muted">
            לשאלות נוספות או תמיכה טכנית: <strong className="text-white">גיא ציזנר</strong> (רכז תקשוב וטכנו-פדגוגיה • ciznerguy@taded.org.il)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-school-cyan text-slate-950 font-black hover:bg-cyan-300 transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>הדפסה / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs transition-all border border-white/20 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-school-cyan" />
              <span>חזרה למרחב התקשוב</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
