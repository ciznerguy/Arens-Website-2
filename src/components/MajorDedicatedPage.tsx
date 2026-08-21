import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, GraduationCap, Clock, User, Compass, CheckCircle2,
  FileText, Download, Share2, Printer, ChevronLeft, Sparkles,
  Database, Atom, Globe, TrendingUp, Languages, Users, FlaskConical,
  Code, Laptop, Trophy, Dna, Cpu, BookOpen, Layers, ExternalLink, Calendar
} from 'lucide-react';
import { SchoolMajor, StaffMember } from '../types';
import { getStoredMajors, subscribeToMajors } from '../services/majorsStorage';
import { allTeachersList } from '../data/teachersList';
import { getHebrewInitials, getAvatarColor } from '../utils/avatarUtils';

interface MajorDedicatedPageProps {
  majorId: string;
  onBack: () => void;
  onSelectOtherMajor?: (id: string) => void;
}

export const MajorDedicatedPage: React.FC<MajorDedicatedPageProps> = ({
  majorId,
  onBack,
  onSelectOtherMajor
}) => {
  const [majors, setMajors] = useState<SchoolMajor[]>(() => getStoredMajors());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsub = subscribeToMajors((live) => {
      setMajors(live);
    });
    return () => unsub();
  }, []);

  const major = (majors && majors.length > 0) ? (majors.find(m => m.id === majorId) || majors[0]) : null;

  // Resolve matching coordinator from real staff members
  const coordinatorInfo = (() => {
    if (!major) return null;
    const majorIdSafe = String(major.id || '').toLowerCase();
    const majorTitleSafe = String(major.title || '');
    const rawName = String(major.coordinatorName || major.contactPerson || '');

    if (majorIdSafe.includes('software') || majorTitleSafe.includes('הנדסת תוכנה') || majorTitleSafe.includes('מחשבים')) {
      const gMatch = allTeachersList.find(t => (t.name && t.name.includes('ציזנר')) || (t.email && t.email.includes('ciznerguy')));
      if (gMatch) return gMatch;
    }
    if (majorIdSafe.includes('chemistry') || majorTitleSafe.includes('כימיה')) {
      const cMatch = allTeachersList.find(t => t.name && (t.name.includes('נירית גרובר') || t.name.includes('גרובר')));
      if (cMatch) return cMatch;
    }
    if (majorIdSafe.includes('biology') || majorTitleSafe.includes('ביולוגיה')) {
      const bMatch = allTeachersList.find(t => t.name && (t.name.includes('דוידוביץ') || t.name.includes('גיל')));
      if (bMatch) return bMatch;
    }
    if (majorIdSafe.includes('pe') || majorTitleSafe.includes('חנ"ג') || majorTitleSafe.includes('חינוך גופני')) {
      const pMatch = allTeachersList.find(t => t.name && (t.name.includes('נעמן') || t.name.includes('תומר')));
      if (pMatch) return pMatch;
    }
    if (majorIdSafe.includes('physics') || majorTitleSafe.includes('פיזיקה')) {
      const phyMatch = allTeachersList.find(t => (t.name && t.name.includes('ברגהאוס')) || (t.email && t.email.includes('t.berghaus')));
      if (phyMatch) return phyMatch;
    }
    if (majorIdSafe.includes('data') || majorTitleSafe.includes('דאטה') || majorTitleSafe.includes('נתונים')) {
      const dMatch = allTeachersList.find(t => (t.name && t.name.includes('דניאל')) || (t.email && t.email.includes('ayelet.daniel')));
      if (dMatch) return dMatch;
    }
    if (majorIdSafe.includes('business') || majorIdSafe.includes('econ') || majorTitleSafe.includes('מנהל') || majorTitleSafe.includes('כלכלה')) {
      const kMatch = allTeachersList.find(t => t.name && (t.name.includes('קצב') || t.name.includes('רז קצב')));
      if (kMatch) return kMatch;
    }
    if (majorIdSafe.includes('social') || majorTitleSafe.includes('מדעי החברה') || majorTitleSafe.includes('פסיכולוגיה')) {
      const socMatch = allTeachersList.find(t => t.name && (t.name.includes('ברונשטיין') || t.name.includes('שוורץ')));
      if (socMatch) return socMatch;
    }
    if (majorIdSafe.includes('cyber-geo') || majorTitleSafe.includes('גיאוגרפיה') || majorTitleSafe.includes('גאוגרפיה')) {
      const geoMatch = allTeachersList.find(t => t.name && (t.name.includes('שחר צור') || t.name.includes('גינדי')));
      if (geoMatch) return geoMatch;
    }
    if (majorIdSafe.includes('arabic') || majorTitleSafe.includes('ערבית')) {
      const arMatch = allTeachersList.find(t => t.name && (t.name.includes('פרקש') || t.name.includes('נירה')));
      if (arMatch) return arMatch;
    }
    if (majorIdSafe.includes('theater') || majorTitleSafe.includes('תיאטרון')) {
      const thMatch = allTeachersList.find(t => t.name && (t.name.includes('חובה') || t.name.includes('מוטי')));
      if (thMatch) return thMatch;
    }
    if (majorTitleSafe.includes('תנ"ך')) {
      const tMatch = allTeachersList.find(t => t.name && (t.name.includes('שרית כץ') || t.name.includes('כץ')));
      if (tMatch) return tMatch;
    }
    if (majorTitleSafe.includes('מתמטיקה')) {
      const mMatch = allTeachersList.find(t => t.name && (t.name.includes('ירון יעקב') || t.name.includes('יעקב')));
      if (mMatch) return mMatch;
    }
    if (majorTitleSafe.includes('אנגלית')) {
      const oMatch = allTeachersList.find(t => t.name && (t.name.includes('אורלי רז') || t.name.includes('רז')));
      if (oMatch) return oMatch;
    }
    
    // Generic match by coordinator name
    if (rawName && !rawName.includes('רכז/ת')) {
      const match = allTeachersList.find(t => t.name && (t.name.includes(rawName) || rawName.includes(t.name)));
      if (match) return match;
    }

    return null;
  })();

  if (!major) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-school-text" dir="rtl">
        <p className="text-xl font-bold mb-4">המגמה לא נמצאה</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-school-cyan/20 hover:bg-school-cyan/30 text-school-cyan rounded-xl font-bold border border-school-cyan/40 transition-all cursor-pointer"
        >
          חזרה למגמות בית הספר
        </button>
      </div>
    );
  }

  const coordinatorDisplayName = coordinatorInfo?.name || major.coordinatorName || major.contactPerson || 'סגל המגמה';
  const coordinatorDisplayRole = coordinatorInfo?.role || `רכז/ת מגמת ${major.title || ''}`;
  const coordinatorDisplayEmail = coordinatorInfo?.email || major.coordinatorContact;

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Database': return <Database className="w-8 h-8" />;
      case 'Sparkles': return <Sparkles className="w-8 h-8" />;
      case 'Atom': return <Atom className="w-8 h-8" />;
      case 'Globe': return <Globe className="w-8 h-8" />;
      case 'TrendingUp': return <TrendingUp className="w-8 h-8" />;
      case 'Languages': return <Languages className="w-8 h-8" />;
      case 'Users': return <Users className="w-8 h-8" />;
      case 'FlaskConical': return <FlaskConical className="w-8 h-8" />;
      case 'Code': return <Code className="w-8 h-8" />;
      case 'Laptop': return <Laptop className="w-8 h-8" />;
      case 'Trophy': return <Trophy className="w-8 h-8" />;
      case 'Dna': return <Dna className="w-8 h-8" />;
      case 'Cpu': return <Cpu className="w-8 h-8" />;
      default: return <BookOpen className="w-8 h-8" />;
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!major) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-school-text" dir="rtl">
        <p className="text-xl font-bold mb-4">המגמה לא נמצאה</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-school-cyan/20 text-school-cyan font-bold"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה למגמות
        </button>
      </div>
    );
  }

  const otherMajors = majors.filter(m => m.id !== major.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 py-10 space-y-10 text-right"
      dir="rtl"
    >
      {/* Breadcrumb & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-school-line/60 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-school-muted">
          <button 
            onClick={onBack}
            className="hover:text-school-cyan transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>דף הבית / כל המגמות</span>
          </button>
          <span>/</span>
          <span className="text-school-cyan font-bold truncate max-w-xs">{major.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-school-panel border border-school-line text-xs font-bold text-school-muted hover:text-school-text transition-colors cursor-pointer"
            title="העתק קישור"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'הועתק!' : 'שיתוף'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-school-panel border border-school-line text-xs font-bold text-school-muted hover:text-school-text transition-colors cursor-pointer"
            title="הדפס עמוד"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>הדפסה</span>
          </button>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-school-cyan/20 text-school-cyan hover:bg-school-cyan/30 font-extrabold text-xs transition-colors cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>חזרה</span>
          </button>
        </div>
      </div>

      {/* HERO HEADER - Styled like Grade Layer Pages */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-school-panel via-school-panel2 to-slate-900 border border-school-line/80 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-school-cyan/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-school-cyan/20 text-school-cyan border border-school-cyan/30">
                {major.units || '5 יח״ל בגרות'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-school-panel text-school-muted border border-school-line">
                {major.division === 'middle_school' ? 'חטיבת ביניים (ז-ט)' : 'חטיבה עליונה (י-יב)'}
              </span>
              {major.category && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  {major.category}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-school-text leading-tight tracking-tight">
              {major.title}
            </h1>

            <p className="text-sm md:text-base text-school-muted leading-relaxed">
              {major.shortDescription || major.fullDescription}
            </p>
          </div>

          <div className="shrink-0 flex md:flex-col items-center justify-center p-6 bg-school-panel/80 rounded-2xl border border-school-line/80 backdrop-blur-sm text-school-cyan shadow-inner">
            <div className="w-16 h-16 rounded-2xl bg-school-cyan/15 flex items-center justify-center mb-2">
              {getIcon(major.iconName)}
            </div>
            <span className="text-[11px] font-black text-school-muted text-center">שש-שנתי ארנס</span>
          </div>
        </div>
      </div>

      {/* QUICK HIGHLIGHT CARDS (3 Stats / Key Features) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-school-panel/80 border border-school-line/60 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-school-cyan/10 text-school-cyan flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-school-text">היקף תעודת בגרות</h3>
            <p className="text-xs text-school-muted mt-1">{major.units || '5 יח״ל מוגברות ואיכותיות'}</p>
          </div>
        </div>

        <div className="bg-school-panel/80 border border-school-line/60 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-500/30 flex items-center justify-center shrink-0">
            {coordinatorInfo?.imageUrl && !coordinatorInfo.imageUrl.includes('unsplash.com') && !coordinatorInfo.imageUrl.includes('placeholder') ? (
              <img 
                src={coordinatorInfo.imageUrl} 
                alt={coordinatorDisplayName} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${getAvatarColor(coordinatorDisplayName).bg} flex items-center justify-center select-none`}>
                <span className={`text-sm font-black ${getAvatarColor(coordinatorDisplayName).text}`}>
                  {getHebrewInitials(coordinatorDisplayName)}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-school-text">{coordinatorDisplayName}</h3>
            <p className="text-xs text-school-cyan mt-0.5 font-bold">{coordinatorDisplayRole}</p>
            {coordinatorDisplayEmail && (
              <p className="text-[11px] text-school-muted mt-0.5 select-all hover:text-white transition-colors">{coordinatorDisplayEmail}</p>
            )}
          </div>
        </div>

        <div className="bg-school-panel/80 border border-school-line/60 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-school-text">אפיק אקדמי ועתידי</h3>
            <p className="text-xs text-school-muted mt-1">בונוס אקדמי מורחב במוסדות להשכלה גבוהה ובצה״ל</p>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RIGHT (MAIN) COLUMN - Detailed Description & Syllabus */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Full Overview Section */}
          <div className="bg-school-panel border border-school-line rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-school-line/60 pb-4">
              <div className="w-8 h-8 rounded-lg bg-school-cyan/10 flex items-center justify-center text-school-cyan font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-extrabold text-school-text">אודות המגמה ותוכנית הלימודים</h2>
            </div>

            <div className="text-sm text-school-muted leading-relaxed whitespace-pre-line space-y-4">
              {major.fullDescription || major.shortDescription}
            </div>
          </div>

          {/* Key Topics & Syllabus Grid */}
          {major.keyTopics && major.keyTopics.length > 0 && (
            <div className="bg-school-panel border border-school-line rounded-3xl p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-school-line/60 pb-4">
                <div className="w-8 h-8 rounded-lg bg-school-cyan/10 flex items-center justify-center text-school-cyan font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-extrabold text-school-text">נושאי לימוד מרכזיים ותחומי חקר</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {major.keyTopics.map((topic, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-school-panel2 border border-school-line/50 hover:border-school-cyan/40 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-school-cyan shrink-0 mt-0.5" />
                    <span className="text-xs font-bold text-school-text leading-snug">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admission Requirements & Conditions */}
          {major.requirements && (
            <div className="bg-school-panel border border-school-line rounded-3xl p-8 space-y-4">
              <div className="flex items-center gap-3 border-b border-school-line/60 pb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-extrabold text-school-text">תנאי קבלה והתאמה למסלול</h2>
              </div>

              <p className="text-xs md:text-sm text-school-muted leading-relaxed">
                {major.requirements}
              </p>
            </div>
          )}

        </div>

        {/* LEFT (SIDEBAR) COLUMN - Documents, Attachments & Other Majors */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Syllabus PDF & Files Download Card */}
          {major.syllabusPdfUrl && (
            <div className="bg-gradient-to-br from-school-cyan/10 via-school-panel to-school-panel border border-school-cyan/30 rounded-3xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-school-cyan/20 flex items-center justify-center text-school-cyan">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-school-text">סילבוס וחוברת המגמה</h3>
                  <p className="text-[11px] text-school-muted">מסמך רשמי להורדה וצפייה</p>
                </div>
              </div>

              <a
                href={major.syllabusPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-school-cyan text-school-bg font-extrabold text-xs shadow-md hover:bg-school-cyan/90 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>הורדת סילבוס מלא (PDF)</span>
              </a>
            </div>
          )}

          {/* Quick Major Info Box */}
          <div className="bg-school-panel border border-school-line rounded-3xl p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-school-text border-b border-school-line pb-3">
              תעודת זהות למגמה
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-school-muted">
                <span>יחידות בגרות:</span>
                <span className="font-bold text-school-text">{major.units || '5 יח״ל'}</span>
              </div>
              <div className="h-px bg-school-line/40" />
              
              <div className="flex items-center justify-between text-school-muted">
                <span>חטיבה:</span>
                <span className="font-bold text-school-text">
                  {major.division === 'middle_school' ? 'חט״ב' : 'חטיבה עליונה'}
                </span>
              </div>
              <div className="h-px bg-school-line/40" />

              <div className="flex items-center justify-between text-school-muted">
                <span>רכז/ת תחום:</span>
                <span className="font-bold text-school-text">{coordinatorDisplayName}</span>
              </div>
            </div>
          </div>

          {/* Other Majors Quick Switcher */}
          {otherMajors.length > 0 && (
            <div className="bg-school-panel border border-school-line rounded-3xl p-6 space-y-4">
              <h3 className="font-extrabold text-sm text-school-text border-b border-school-line pb-3">
                מגמות ומסלולים נוספים
              </h3>

              <div className="space-y-2">
                {otherMajors.slice(0, 5).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      if (onSelectOtherMajor) {
                        onSelectOtherMajor(m.id);
                      }
                    }}
                    className="w-full text-right p-2.5 rounded-xl bg-school-panel2 border border-school-line/40 hover:border-school-cyan/40 hover:bg-school-cyan/5 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-school-cyan shrink-0" />
                      <span className="text-xs font-bold text-school-text group-hover:text-school-cyan transition-colors truncate">
                        {m.title}
                      </span>
                    </div>
                    <ChevronLeft className="w-3.5 h-3.5 text-school-muted group-hover:text-school-cyan shrink-0 transition-transform group-hover:-translate-x-0.5" />
                  </button>
                ))}
              </div>

              <button
                onClick={onBack}
                className="w-full text-center text-xs font-bold text-school-cyan hover:underline pt-2 block cursor-pointer"
              >
                לכל {majors.length} המגמות &larr;
              </button>
            </div>
          )}

        </div>

      </div>

    </motion.div>
  );
};
