import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, GraduationCap, Clock, Compass, CheckCircle2,
  FileText, Download, Share2, Printer, ChevronLeft, Sparkles,
  Database, Atom, Globe, TrendingUp, Languages, Users, FlaskConical,
  Code, Laptop, Trophy, Dna, Cpu, BookOpen, Layers, ExternalLink,
  Eye, X, Maximize2, Check, Filter
} from 'lucide-react';
import { SchoolMajor } from '../types';
import { getStoredMajors, subscribeToMajors } from '../services/majorsStorage';
import { allTeachersList } from '../data/teachersList';
import { TeacherAvatar } from './TeacherAvatar';

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
  const [activePdfPreview, setActivePdfPreview] = useState<{
    name: string;
    url: string;
    size?: string;
    category?: string;
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const unsub = subscribeToMajors((live) => {
      setMajors(live);
    });
    return () => unsub();
  }, []);

  // Handle escape key to close PDF modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePdfPreview) {
        setActivePdfPreview(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePdfPreview]);

  const major = (majors && majors.length > 0) ? (majors.find(m => m.id === majorId) || majors[0]) : null;

  // Resolve matching coordinator from real staff members
  const coordinatorInfo = (() => {
    if (!major) return null;
    const majorIdSafe = String(major.id || '').toLowerCase();
    const majorTitleSafe = String(major.title || '');
    const rawName = String(major.coordinatorName || major.contactPerson || '');

    if (majorIdSafe.includes('software') || majorTitleSafe.includes('הנדסת תוכנה') || majorTitleSafe.includes('מחשב') || majorTitleSafe.includes('מדעי המחשב')) {
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

  const handleDownloadPdf = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = name.endsWith('.pdf') ? name : `${name}.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      }, 3000);
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

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

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const otherMajors = majors.filter(m => m.id !== major.id);

  // Available categories for PDF files
  const rawPdfs = major.pdfFiles || [];
  const categoriesList = Array.from(new Set(rawPdfs.map(p => p.category).filter(Boolean))) as string[];
  const filteredPdfs = selectedCategory === 'all' 
    ? rawPdfs 
    : rawPdfs.filter(p => p.category === selectedCategory);

  const getCategoryTheme = (cat?: string) => {
    switch (cat) {
      case 'מחוון והנחיות':
        return {
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          border: 'hover:border-emerald-500/50',
          iconBg: 'bg-emerald-500/15 text-emerald-400',
          dot: 'bg-emerald-400'
        };
      case 'מכניקה וקינמטיקה':
        return {
          badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          border: 'hover:border-cyan-500/50',
          iconBg: 'bg-cyan-500/15 text-cyan-400',
          dot: 'bg-cyan-400'
        };
      case 'אופטיקה גיאומטרית':
        return {
          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          border: 'hover:border-amber-500/50',
          iconBg: 'bg-amber-500/10 text-amber-400',
          dot: 'bg-amber-400'
        };
      case 'חשמל ומגנטיות':
        return {
          badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          border: 'hover:border-purple-500/50',
          iconBg: 'bg-purple-500/15 text-purple-400',
          dot: 'bg-purple-400'
        };
      default:
        return {
          badge: 'bg-school-cyan/15 text-school-cyan border-school-cyan/30',
          border: 'hover:border-school-cyan/50',
          iconBg: 'bg-school-cyan/10 text-school-cyan',
          dot: 'bg-school-cyan'
        };
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 text-right select-text" 
      dir="rtl"
    >
      {/* TOP NAVIGATION BREADCRUMBS & ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-school-line/60 pb-5">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-school-muted hover:text-school-cyan transition-colors bg-school-panel2 border border-school-line px-3.5 py-2 rounded-xl cursor-pointer group"
        >
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          <span>חזרה לקטלוג המגמות</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-school-text bg-school-panel2 hover:bg-school-line/30 border border-school-line px-3 py-2 rounded-xl transition-all cursor-pointer"
            title="העתק קישור למגמה"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-school-cyan" />}
            <span>{copied ? 'הקישור הועתק!' : 'שתף'}</span>
          </button>
        </div>
      </div>

      {/* HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-school-panel2 via-school-panel to-school-bg border border-school-line/80 p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_100%_0%,rgba(34,211,238,0.12),transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(circle_at_0%_100%,rgba(168,85,247,0.08),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-school-cyan/15 text-school-cyan border border-school-cyan/30">
                {major.division === 'middle_school' ? 'חטיבת ביניים' : 'חטיבה עליונה'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-school-panel text-school-muted border border-school-line">
                {major.targetGrades || "שכבות י'-יב'"}
              </span>
              {major.hoursPerWeek && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  {major.hoursPerWeek}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-school-text tracking-tight">
              {major.title}
            </h1>

            <p className="text-sm md:text-base text-school-muted leading-relaxed">
              {major.shortDescription || major.fullDescription}
            </p>
          </div>

          <div className="shrink-0 flex md:flex-col items-center justify-center p-6 bg-school-panel/80 rounded-2xl border border-school-line/80 backdrop-blur-sm text-school-cyan shadow-inner">
            <div className="w-16 h-16 rounded-2xl bg-school-cyan/15 flex items-center justify-center mb-2">
              {getIcon(major.icon || (major as any).iconName)}
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
            <p className="text-xs text-school-muted mt-1">{major.hoursPerWeek || (major as any).units || '5 יח״ל לבגרות'}</p>
          </div>
        </div>

        <div className="bg-school-panel/80 border border-school-line/60 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
          <TeacherAvatar
            name={coordinatorDisplayName}
            imageUrl={coordinatorInfo?.imageUrl}
            className="w-12 h-12 rounded-xl"
            textClassName="text-sm font-black"
            borderClassName="border border-emerald-500/30"
          />
          <div>
            <h3 className="text-sm font-extrabold text-school-text">{coordinatorDisplayName}</h3>
            <p className="text-xs text-school-cyan mt-0.5 font-bold">{coordinatorDisplayRole}</p>
            {coordinatorDisplayEmail && (
              <p className="text-[11px] text-school-muted mt-0.5 select-all hover:text-white transition-colors font-mono inline-block" dir="ltr">{coordinatorDisplayEmail}</p>
            )}
          </div>
        </div>

        <div className="bg-school-panel/80 border border-school-line/60 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-school-text">אפיק אקדמי ועתידי</h3>
            <p className="text-xs text-school-muted mt-1">בונוס אקדמי מורחב במוסדות להשכלה גבוהה, עתודה וצה״ל</p>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RIGHT (MAIN) COLUMN - Detailed Description, Syllabus & PDF Lab Repository */}
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

          {/* DEDICATED PDF LAB & INQUIRY REPOSITORY (מעבדות חקר, ניסויים ותדריכים) */}
          {rawPdfs.length > 0 && (
            <div className="bg-gradient-to-br from-school-panel via-school-panel2 to-school-panel border-2 border-school-cyan/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_100%_0%,rgba(34,211,238,0.1),transparent_70%)] pointer-events-none" />

              {/* Section Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-school-line/60 pb-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-school-cyan/10 border border-school-cyan/30 text-xs text-school-cyan font-black">
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>מעבדות חקר וניסויים 5 יח״ל</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    מאגר תדריכי ניסוי, דוחות מעבדה ומחוונים
                  </h2>
                  <p className="text-xs text-school-muted">
                    תדריכים רשמיים לצפייה מקוונת ולהורדה, כולל מערכות ניסוי, עיבוד גרפי ושאלות בגרות
                  </p>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-school-bg/80 border border-school-line text-xs font-extrabold text-school-cyan shrink-0">
                  {rawPdfs.length} קבצי מעבדה
                </div>
              </div>

              {/* Category Filter Pills (if multiple categories exist) */}
              {categoriesList.length > 1 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-school-muted font-bold flex items-center gap-1.5 pl-2">
                    <Filter className="w-3 h-3 text-school-cyan" />
                    <span>סינון לפי תחום:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-school-cyan text-slate-950 shadow-md shadow-school-cyan/20 scale-105'
                        : 'bg-school-panel2 border border-school-line/60 text-school-muted hover:text-white'
                    }`}
                  >
                    הכל ({rawPdfs.length})
                  </button>
                  {categoriesList.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-school-cyan text-slate-950 shadow-md shadow-school-cyan/20 scale-105'
                          : 'bg-school-panel2 border border-school-line/60 text-school-muted hover:text-white'
                      }`}
                    >
                      {cat} ({rawPdfs.filter(p => p.category === cat).length})
                    </button>
                  ))}
                </div>
              )}

              {/* Lab Files Cards Grid */}
              <div className="grid grid-cols-1 gap-4 pt-2">
                {filteredPdfs.map((pdf, idx) => {
                  const theme = getCategoryTheme(pdf.category);
                  return (
                    <div
                      key={idx}
                      className={`group p-4 sm:p-5 rounded-2xl bg-[#090e1d] border border-school-line/80 ${theme.border} transition-all duration-300 shadow-md hover:shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
                    >
                      {/* Right info side */}
                      <div className="flex items-start gap-3.5 min-w-0 flex-1">
                        <div className={`w-11 h-11 rounded-2xl ${theme.iconBg} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform shadow-sm`}>
                          <FileText className="w-5 h-5" />
                        </div>

                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {pdf.category && (
                              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold border ${theme.badge}`}>
                                {pdf.category}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-mono">
                              {pdf.size || 'PDF'}
                            </span>
                          </div>

                          <h4 className="font-black text-sm sm:text-base text-white group-hover:text-school-cyan transition-colors leading-snug">
                            {pdf.name}
                          </h4>

                          {pdf.description && (
                            <p className="text-xs text-school-muted leading-relaxed line-clamp-2">
                              {pdf.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Left actions side */}
                      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        <button
                          type="button"
                          onClick={() => setActivePdfPreview(pdf)}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-school-cyan text-slate-950 font-black text-xs hover:bg-cyan-300 transition-all shadow-md shadow-school-cyan/20 cursor-pointer hover:scale-105 active:scale-95"
                          title="צפייה מקוונת במסמך המלא"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>צפייה מקוונת</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadPdf(pdf.url, pdf.name)}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-school-panel2 hover:bg-school-line/40 border border-school-line/70 text-slate-200 hover:text-white font-bold text-xs transition-all cursor-pointer"
                          title="הורדת קובץ PDF למכשיר"
                        >
                          <Download className="w-3.5 h-3.5 text-school-cyan" />
                          <span>הורדה</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick tip at bottom */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-school-bg/60 border border-school-line/40 text-[11px] text-school-muted">
                <Sparkles className="w-4 h-4 text-school-cyan shrink-0" />
                <span>
                  ניתן להדפיס את דפי הניסוי ישירות מנגן המסמכים או להורידם למכשיר לצורך מענה במעבדה.
                </span>
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

          {/* Quick Labs Sidebar Card (when PDFs exist) */}
          {rawPdfs.length > 0 && (
            <div className="bg-school-panel border border-school-line rounded-3xl p-6 space-y-4 shadow-md">
              <div className="flex items-center justify-between pb-2 border-b border-school-line/60">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-school-cyan" />
                  <h3 className="font-extrabold text-sm text-school-text">תדריכי מעבדה ({rawPdfs.length})</h3>
                </div>
                <span className="text-[10px] text-school-cyan font-bold">5 יח״ל</span>
              </div>

              <div className="space-y-2">
                {rawPdfs.map((pdf, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePdfPreview(pdf)}
                    className="w-full text-right p-2.5 rounded-xl bg-school-panel2 hover:bg-school-cyan/10 border border-school-line/50 hover:border-school-cyan/40 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-3.5 h-3.5 text-school-cyan shrink-0" />
                      <span className="text-xs font-bold text-school-text group-hover:text-school-cyan transition-colors truncate">
                        {pdf.name}
                      </span>
                    </div>
                    <Eye className="w-3.5 h-3.5 text-school-muted group-hover:text-school-cyan shrink-0 transition-transform group-hover:scale-110" />
                  </button>
                ))}
              </div>
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
                <span className="font-bold text-school-text">{major.hoursPerWeek || '5 יח״ל'}</span>
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

              {rawPdfs.length > 0 && (
                <>
                  <div className="h-px bg-school-line/40" />
                  <div className="flex items-center justify-between text-school-muted">
                    <span>מסמכי מעבדה:</span>
                    <span className="font-bold text-school-cyan">{rawPdfs.length} קבצי PDF</span>
                  </div>
                </>
              )}
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

      {/* --- INTERACTIVE PDF DOCUMENT VIEWER MODAL (FULL SCREEN) --- */}
      <AnimatePresence>
        {activePdfPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePdfPreview(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 cursor-default"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full h-[92vh] bg-[#080d19] border border-school-line rounded-3xl overflow-hidden shadow-2xl flex flex-col text-right"
              dir="rtl"
            >
              {/* Modal Header */}
              <div className="p-3.5 md:px-6 bg-[#0c1426] border-b border-school-line flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-school-cyan/15 border border-school-cyan/30 flex items-center justify-center text-school-cyan shrink-0">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm md:text-base font-black text-white truncate">
                      {activePdfPreview.name}
                    </h3>
                    <p className="text-[11px] text-school-muted flex items-center gap-2">
                      <span>{activePdfPreview.category || 'תדריך מעבדה'}</span>
                      <span>•</span>
                      <span>{activePdfPreview.size || 'PDF'}</span>
                      <span>•</span>
                      <span>מגמת פיזיקה 5 יח״ל - משה ארנס</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Download PDF button */}
                  <button
                    type="button"
                    onClick={() => handleDownloadPdf(activePdfPreview.url, activePdfPreview.name)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all cursor-pointer"
                    title="הורדת קובץ PDF מלא למכשיר"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">הורדת PDF</span>
                  </button>

                  {/* Open in new tab */}
                  <a
                    href={activePdfPreview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-school-panel hover:bg-white/10 border border-school-line text-school-cyan text-xs font-bold transition-all cursor-pointer"
                    title="פתיחה בלשונית נפרדת בדפדפן"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">חלון חדש</span>
                  </a>

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setActivePdfPreview(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
                    title="סגור (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Content Area (Embedded PDF Reader) */}
              <div className="flex-1 w-full bg-[#050914] relative overflow-hidden flex items-center justify-center p-1 sm:p-2">
                <object
                  data={`${activePdfPreview.url}#toolbar=1&navpanes=0`}
                  type="application/pdf"
                  className="w-full h-full border-none rounded-xl bg-white"
                >
                  <iframe
                    src={`${activePdfPreview.url}#toolbar=1&navpanes=0`}
                    className="w-full h-full border-none rounded-xl bg-white"
                    title={activePdfPreview.name}
                  />
                </object>
              </div>

              {/* Modal Footer */}
              <div className="p-3 px-6 bg-[#0c1426] border-t border-school-line flex items-center justify-between text-[11px] text-school-muted shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>
                    תדריך הניסוי מוצג בנגן מקוון מלא. ניתן לדפדף, להגדיל, להדפיס או להוריד את הקובץ ישירות למכשיר.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePdfPreview(null)}
                  className="text-xs text-white/70 hover:text-white underline cursor-pointer"
                >
                  סגירת מסמך
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
