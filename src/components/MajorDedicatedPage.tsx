import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, ArrowLeft, GraduationCap, Clock, Compass, CheckCircle2,
  FileText, Download, Share2, ChevronLeft, Sparkles,
  Database, Atom, Globe, TrendingUp, Languages, Users, FlaskConical,
  Code, Laptop, Trophy, Dna, Cpu, BookOpen, Layers, ExternalLink,
  Eye, X, Check, Filter, ShieldCheck, Mail, Phone,
  Send, Award, Radio, Calendar
} from 'lucide-react';
import { SchoolMajor } from '../types';
import { getStoredMajors, subscribeToMajors } from '../services/majorsStorage';
import { allTeachersList } from '../data/teachersList';
import { TeacherAvatar } from './TeacherAvatar';
import { sendMajorInquiry } from '../services/majorInquiry';

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
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryGrade, setInquiryGrade] = useState('ט׳ לקראת י׳');
  const [inquiryContact, setInquiryContact] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);
  const [inquirySending, setInquirySending] = useState(false);
  const [inquiryError, setInquiryError] = useState(false);
  const [inquiryTrap, setInquiryTrap] = useState('');

  const [activePdfPreview, setActivePdfPreview] = useState<{
    name: string;
    url: string;
    size?: string;
    category?: string;
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCoordinatorModalOpen, setIsCoordinatorModalOpen] = useState(false);

  useEffect(() => {
    const unsub = subscribeToMajors((live) => {
      setMajors(live);
    });
    return () => unsub();
  }, []);

  // Handle escape key to close PDF modal and Coordinator modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isCoordinatorModalOpen) setIsCoordinatorModalOpen(false);
        if (activePdfPreview) setActivePdfPreview(null);
        if (isContactModalOpen) setIsContactModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePdfPreview, isContactModalOpen, isCoordinatorModalOpen]);

  const major = (majors && majors.length > 0) ? (majors.find(m => m.id === majorId) || majors[0]) : null;

  // Resolve matching coordinator from real staff members list
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
    
    // Generic match by coordinator name in real staff list
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

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inquirySending) {
      return;
    }
    setInquirySending(true);
    setInquiryError(false);
    const sent = await sendMajorInquiry({
      to: coordinatorDisplayEmail || '',
      majorTitle: major ? major.title : '',
      name: inquiryName,
      grade: inquiryGrade,
      contact: inquiryContact,
      message: inquiryMessage,
      website: inquiryTrap,
    });
    setInquirySending(false);
    if (!sent) {
      setInquiryError(true);
      return;
    }
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setIsContactModalOpen(false);
      setInquiryMessage('');
      setInquiryName('');
      setInquiryContact('');
    }, 2200);
  };

  if (!major) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-['Rubik',sans-serif]" dir="rtl">
        <p className="text-xl font-bold mb-4 text-[#0F172A]">המגמה לא נמצאה</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-[#1D4ED8] text-white rounded-full font-bold shadow-md hover:bg-blue-800 transition-all cursor-pointer"
        >
          חזרה למגמות בית הספר
        </button>
      </div>
    );
  }

  // Real coordinator details
  const coordinatorDisplayName = coordinatorInfo?.name || major.coordinatorName || major.contactPerson || 'רכז/ת המגמה';
  const coordinatorDisplayRole = coordinatorInfo?.role || `רכז/ת מגמת ${major.title || ''}`;
  const coordinatorDisplayEmail = coordinatorInfo?.email || major.coordinatorContact;
  const coordinatorImageUrl = coordinatorInfo?.imageUrl;

  // Real PDF files
  const rawPdfs = major.pdfFiles || [];
  const categoriesList = Array.from(new Set(rawPdfs.map(p => p.category).filter(Boolean))) as string[];
  const filteredPdfs = selectedCategory === 'all' 
    ? rawPdfs 
    : rawPdfs.filter(p => p.category === selectedCategory);

  // Real Highlights
  const highlights = major.highlights || [];

  // Real Custom Sections
  const sections = major.sections || [];

  const getMajorIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Database': return <Database className="w-6 h-6" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      case 'Atom': return <Atom className="w-6 h-6" />;
      case 'Globe': return <Globe className="w-6 h-6" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6" />;
      case 'Languages': return <Languages className="w-6 h-6" />;
      case 'Users': return <Users className="w-6 h-6" />;
      case 'FlaskConical': return <FlaskConical className="w-6 h-6" />;
      case 'Code': return <Code className="w-6 h-6" />;
      case 'Laptop': return <Laptop className="w-6 h-6" />;
      case 'Trophy': return <Trophy className="w-6 h-6" />;
      case 'Dna': return <Dna className="w-6 h-6" />;
      case 'Cpu': return <Cpu className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 select-none text-right font-['Rubik',sans-serif]" dir="rtl">
      
      {/* ============================================================== */}
      {/* 1. TOP BAR: BREADCRUMBS & NAVIGATION                           */}
      {/* ============================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 backdrop-blur-md border border-[#0F172A]/08 rounded-2xl p-3 sm:px-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-[#434655]">
          <span className="cursor-pointer hover:text-[#1D4ED8] transition-colors" onClick={onBack}>דף הבית</span>
          <ChevronLeft className="w-3.5 h-3.5 text-[#747686]" />
          <span>{major.division === 'middle_school' ? 'חט״ב' : 'חטי״ע'}</span>
          <ChevronLeft className="w-3.5 h-3.5 text-[#747686]" />
          <span className="cursor-pointer hover:text-[#1D4ED8] transition-colors" onClick={onBack}>מגמות</span>
          <ChevronLeft className="w-3.5 h-3.5 text-[#747686]" />
          <span className="font-bold text-[#1D4ED8] truncate">{major.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1D4ED8]/10 text-[#1D4ED8] hover:bg-[#1D4ED8]/20 text-xs sm:text-sm font-bold transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>לכל המגמות</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold transition-all cursor-pointer"
            title="העתקת קישור למגמה"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-600" />}
            <span className="hidden sm:inline">{copied ? 'הועתק!' : 'שתף'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. HERO STATEMENT CARD (light, blue accent stripe on the right)   */}
      {/* ============================================================== */}
      <section className="bg-[#F5F8FF] text-[#0F172A] border border-[#1D4ED8]/15 border-r-4 border-r-[#1D4ED8] rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col gap-6 relative overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#1D4ED8]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#FEA619]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Real Badges */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]/40 text-xs font-black">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span>{major.division === 'middle_school' ? 'חטיבת ביניים' : 'חטיבה עליונה'}</span>
          </span>

          {major.hoursPerWeek && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1D4ED8]/10 text-[#1D4ED8] text-xs font-bold border border-[#1D4ED8]/20">
              <GraduationCap className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span>{major.hoursPerWeek}</span>
            </span>
          )}

          {major.targetGrades && (
            <span className="px-3 py-1 rounded-full bg-[#FFFFFF] text-[#334155] text-xs font-medium border border-[#0F172A]/10">
              {major.targetGrades}
            </span>
          )}
        </div>

        {/* Real Title & Description */}
        <div className="space-y-3 relative z-10 max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1D4ED8] flex items-center justify-center text-white shrink-0 shadow-sm">
              {getMajorIcon(major.icon || (major as any).iconName)}
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
              {major.title}
            </h1>
          </div>

          <p className="text-base sm:text-lg text-[#334155] font-normal leading-relaxed max-w-3xl">
            {major.shortDescription || major.fullDescription}
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2 relative z-10">
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#F59E0B] hover:bg-[#d98205] text-[#0F172A] font-black text-sm sm:text-base shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <span>רישום ופנייה למגמה</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          {rawPdfs.length > 0 && (
            <button
              onClick={() => setActivePdfPreview(rawPdfs[0])}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#FFFFFF] hover:bg-[#EEF2FF] text-[#1D4ED8] font-bold text-sm border border-[#1D4ED8]/25 active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#d98205]" />
              <span>{rawPdfs[0].name} (PDF)</span>
            </button>
          )}

          {coordinatorDisplayEmail && (
            <a
              href={`mailto:${coordinatorDisplayEmail}?subject=${encodeURIComponent(`פנייה בנושא ${major.title}`)}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-[#FFFFFF] hover:bg-[#EEF2FF] text-[#1D4ED8] font-medium text-xs sm:text-sm border border-[#1D4ED8]/25 transition-all"
            >
              <Mail className="w-4 h-4 text-[#1D4ED8]" />
              <span>מייל לרכז/ת</span>
            </a>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2.5. COORDINATOR PROFILE CARD (כרטיס רכז/ת המגמה - מיד לאחר הכותרת) */}
      {/* ============================================================== */}
      {/* ============================================================== */}
      {/* 2.5. COORDINATOR PROFILE CARD (כרטיס רכז/ת המגמה - מיד לאחר הכותרת) */}
      {/* ============================================================== */}
      <section 
        className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0F172A]/08 shadow-md hover:shadow-lg hover:border-[#1D4ED8]/40 transition-all flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-2.5 h-full bg-[#1D4ED8]" />

        <div 
          onClick={() => setIsCoordinatorModalOpen(true)}
          className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-right w-full md:w-auto cursor-pointer group"
          title="לחץ לצפייה בכרטיס המלא של רכז/ת המגמה"
        >
          <div className="relative shrink-0">
            <TeacherAvatar
              name={coordinatorDisplayName}
              imageUrl={coordinatorImageUrl}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl shadow-lg border-2 border-white ring-2 ring-[#1D4ED8]/20 group-hover:ring-4 group-hover:ring-[#1D4ED8]/40 group-hover:scale-105 transition-all object-cover"
              textClassName="text-2xl font-black"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold" title="רכז/ת פעיל/ה">
              ✓
            </div>
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#855300] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                <Users className="w-3.5 h-3.5" />
                <span>הובלת המגמה וליווי אישי</span>
              </span>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0037B0]">
                {coordinatorDisplayRole}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-[#1D4ED8] group-hover:bg-[#1D4ED8] group-hover:text-white transition-colors">
                לחץ לפתיחת כרטיס מלא ←
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors">
              {coordinatorDisplayName}
            </h2>

            {coordinatorInfo?.bio ? (
              <p className="text-xs sm:text-sm text-[#434655] leading-relaxed max-w-2xl line-clamp-2">
                {coordinatorInfo.bio}
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-[#434655] leading-relaxed">
                צוות המגמה מלווה באופן אישי כל תלמיד ותלמידה לאורך שנות הלימוד, החקר והבגרות.
              </p>
            )}

            {coordinatorDisplayEmail && (
              <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[11px] font-bold text-[#434655]">דוא״ל רשמי:</span>
                <span className="text-xs font-mono font-bold text-[#1D4ED8] bg-blue-50/80 px-2.5 py-0.5 rounded-md border border-blue-100/60 select-all" dir="ltr">
                  {coordinatorDisplayEmail}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contact actions on the left side */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-[#0F172A]/06">
          <button
            onClick={() => setIsCoordinatorModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-[#EAEDFF] hover:bg-[#DAE2FD] text-[#0037B0] font-black text-xs sm:text-sm transition-all cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>כרטיס רכז/ת מלא</span>
          </button>

          {coordinatorDisplayEmail && (
            <a
              href={`mailto:${coordinatorDisplayEmail}?subject=${encodeURIComponent(`פנייה בנושא ${major.title}`)}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#1D4ED8] hover:bg-[#153bb0] text-white text-xs sm:text-sm font-black transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-cyan-300" />
              <span>פנייה במייל</span>
            </a>
          )}

          <button
            onClick={() => setIsContactModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs sm:text-sm font-bold border border-slate-200 active:scale-95 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span>טופס פנייה מקוון</span>
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. QUICK HIGHLIGHTS GRID (Real Metadata Only)                  */}
      {/* ============================================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: היקף בגרות */}
        <div className="bg-white rounded-2xl p-5 border border-[#0F172A]/08 shadow-sm flex flex-col gap-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-[#434655]">היקף מסלול</span>
          <h3 className="text-base font-black text-[#0F172A]">{major.hoursPerWeek || '5 יח״ל לבגרות'}</h3>
        </div>

        {/* Card 2: חטיבה ושכבות */}
        <div className="bg-white rounded-2xl p-5 border border-[#0F172A]/08 shadow-sm flex flex-col gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#004F35] flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-[#434655]">שכבות יעד</span>
          <h3 className="text-base font-black text-[#0F172A]">{major.targetGrades || "שכבות י'-יב'"}</h3>
        </div>

        {/* Card 3: רכז/ת המגמה */}
        <div className="bg-white rounded-2xl p-5 border border-[#0F172A]/08 shadow-sm flex flex-col gap-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#855300] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-[#434655]">הובלת המגמה</span>
          <h3 className="text-base font-black text-[#0F172A] truncate">{coordinatorDisplayName}</h3>
        </div>

        {/* Card 4: חומרי לימוד וסילבוס */}
        <div className="bg-white rounded-2xl p-5 border border-[#0F172A]/08 shadow-sm flex flex-col gap-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-[#434655]">חומרי לימוד וסילבוס</span>
          <h3 className="text-base font-black text-[#0F172A]">
            {rawPdfs.length > 0 ? `${rawPdfs.length} קובצי PDF זמינים` : 'תוכנית לימודים מאושרת'}
          </h3>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. MAIN BODY (Real Highlights, Sections, PDFs & Faculty)        */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RIGHT COLUMN (8 COLS): Full description, Real Highlights & Sections */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section: תיאור מקיף של המגמה */}
          {major.fullDescription && major.fullDescription !== major.shortDescription && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0F172A]/08 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-[#0F172A]/08 pb-3">
                <div className="w-9 h-9 rounded-xl bg-[#1D4ED8]/10 text-[#1D4ED8] flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-[#0F172A]">אודות המגמה ותוכנית הלימודים</h2>
              </div>
              <p className="text-sm sm:text-base text-[#434655] leading-relaxed whitespace-pre-line">
                {major.fullDescription}
              </p>
            </div>
          )}

          {/* Section: דגשים ויתרונות מרכזיים (Real Highlights) */}
          {highlights.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0F172A]/08 shadow-sm space-y-5">
              <div className="flex items-center gap-3 border-b border-[#0F172A]/08 pb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#855300] flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#0F172A]">דגשים ויתרונות מרכזיים</h2>
                  <p className="text-xs text-[#434655]">העשייה הפדגוגית והחווייתית במסלול</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {highlights.map((hl, hIdx) => (
                  <div 
                    key={hIdx}
                    className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#0F172A]/06 flex items-start gap-3 hover:border-[#1D4ED8]/30 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#1D4ED8] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-bold text-[#0F172A] leading-snug">{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: תכנים ופרקים מתוך הנתונים המקוריים (Real Sections) */}
          {sections.length > 0 && (
            <div className="space-y-6">
              {sections.map((sec, sIdx) => {
                const secText = typeof sec.text === 'string' ? sec.text : Array.isArray(sec.text) ? sec.text.join('\n') : '';
                return (
                  <div key={sIdx} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0F172A]/08 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 border-b border-[#0F172A]/08 pb-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center font-bold">
                        <Layers className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl font-black text-[#0F172A]">{sec.title}</h2>
                    </div>

                    {secText && (
                      <p className="text-sm text-[#434655] leading-relaxed whitespace-pre-line">
                        {secText}
                      </p>
                    )}

                    {sec.list && sec.list.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {sec.list.map((item, iIdx) => (
                          <div 
                            key={iIdx}
                            className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#0F172A]/06 flex items-start gap-2.5"
                          >
                            <span className="w-2 h-2 rounded-full bg-[#1D4ED8] shrink-0 mt-1.5" />
                            <span className="text-xs font-bold text-[#0F172A] leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Section: מאגר קובצי PDF (Real PDFs Only) */}
          {rawPdfs.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0F172A]/08 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0F172A]/08 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#0F172A]">מאגר חומרי לימוד וסילבוסים</h2>
                    <p className="text-xs text-[#434655]">קובצי PDF לצפייה ישירה ולהורדה</p>
                  </div>
                </div>

                {categoriesList.length > 1 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedCategory === 'all'
                          ? 'bg-[#1D4ED8] text-white shadow-xs'
                          : 'bg-slate-100 text-[#434655] hover:bg-slate-200'
                      }`}
                    >
                      הכל ({rawPdfs.length})
                    </button>
                    {categoriesList.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-[#1D4ED8] text-white shadow-xs'
                            : 'bg-slate-100 text-[#434655] hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredPdfs.map((pdf, pIdx) => (
                  <div 
                    key={pIdx}
                    className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#0F172A]/08 hover:border-[#1D4ED8]/40 hover:bg-[#EAEDFF]/30 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] truncate group-hover:text-[#1D4ED8] transition-colors">
                          {pdf.name}
                        </h4>
                        <p className="text-[11px] text-[#434655] mt-0.5 flex items-center gap-2">
                          <span>{pdf.category || 'חומר עזר'}</span>
                          <span>•</span>
                          <span>{pdf.size || 'PDF'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setActivePdfPreview(pdf)}
                        className="p-2 rounded-xl bg-white hover:bg-blue-50 text-[#1D4ED8] border border-blue-100 shadow-xs cursor-pointer"
                        title="צפייה מקוונת"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadPdf(pdf.url, pdf.name)}
                        className="p-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-xs cursor-pointer"
                        title="הורדת קובץ"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* LEFT COLUMN (4 COLS): Real Faculty Member & Other Real Majors */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* CARD: צוות המגמה (Real Staff Info Only) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0F172A]/08 shadow-sm space-y-5 text-center">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#855300] bg-amber-50 px-3 py-1 rounded-full mx-auto">
                <Users className="w-3.5 h-3.5" />
                <span>הובלת המגמה וליווי התלמיד</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8FF] border border-[#0F172A]/06 space-y-4">
              <div className="flex flex-col items-center">
                <TeacherAvatar
                  name={coordinatorDisplayName}
                  imageUrl={coordinatorImageUrl}
                  className="w-20 h-20 rounded-full shadow-md border-2 border-white mb-2"
                  textClassName="text-xl font-black"
                />
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0037B0] mb-1">
                  {coordinatorDisplayRole}
                </span>
                <h3 className="text-lg font-black text-[#0F172A]">
                  {coordinatorDisplayName}
                </h3>
              </div>

              {coordinatorInfo?.bio && (
                <p className="text-xs text-[#434655] leading-relaxed">
                  {coordinatorInfo.bio}
                </p>
              )}

              {coordinatorDisplayEmail && (
                <div className="text-[11px] text-slate-600 font-mono bg-white py-1.5 px-3 rounded-lg border border-slate-200 select-all" dir="ltr">
                  {coordinatorDisplayEmail}
                </div>
              )}

              <div className="pt-1 flex flex-col gap-2">
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#1D4ED8] hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>שליחת פנייה ישירה לרכז/ת</span>
                </button>

                {coordinatorDisplayEmail && (
                  <a
                    href={`mailto:${coordinatorDisplayEmail}?subject=${encodeURIComponent(`פנייה בנושא מגמת ${major.title}`)}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold text-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    <span>פתיחת תוכנת דואר</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Major Switcher (Real Majors Only) */}
          {majors.length > 1 && (
            <div className="bg-white rounded-3xl p-5 border border-[#0F172A]/08 shadow-sm space-y-3">
              <h4 className="text-xs font-black text-[#0F172A] border-b border-[#0F172A]/08 pb-2">
                מגמות נוספות בבית הספר
              </h4>
              <div className="space-y-1.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                {majors.filter(m => m.id !== major.id).map(other => (
                  <button
                    key={other.id}
                    onClick={() => {
                      if (onSelectOtherMajor) {
                        onSelectOtherMajor(other.id);
                      }
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF8FF] text-right transition-colors text-xs font-bold text-[#0F172A] cursor-pointer group"
                  >
                    <span className="group-hover:text-[#1D4ED8] truncate">{other.title}</span>
                    <ChevronLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1D4ED8] group-hover:-translate-x-0.5 transition-transform shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ============================================================== */}
      {/* 5. MODAL: INQUIRY FORM MODAL                                   */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsContactModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-right font-['Rubik',sans-serif]"
              dir="rtl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1D4ED8] flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-black text-[#0F172A]">
                    פנייה למגמת {major.title}
                  </h3>
                </div>
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {inquirySent ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-[#0F172A]">הפנייה נשלחה בהצלחה!</h4>
                  <p className="text-xs text-[#434655]">
                    רכז/ת המגמה ({coordinatorDisplayName}) יחזרו אליכם בהקדם.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">שם מלא של התלמיד/ה:</label>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="ישראל ישראלי"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#1D4ED8] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1">שכבה נוכחית:</label>
                      <select
                        value={inquiryGrade}
                        onChange={(e) => setInquiryGrade(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#1D4ED8] outline-none bg-white"
                      >
                        <option value="ט׳ לקראת י׳">שכבה ט׳ (עולים לי׳)</option>
                        <option value="ח׳">שכבה ח׳</option>
                        <option value="ז׳">שכבה ז׳</option>
                        <option value="י׳">שכבה י׳</option>
                        <option value="הורה">פניית הורה</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1">טלפון / אימייל לחזרה:</label>
                      <input
                        type="text"
                        required
                        value={inquiryContact}
                        onChange={(e) => setInquiryContact(e.target.value)}
                        placeholder="050-0000000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#1D4ED8] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">שאלה או פנייה לרכז/ת המגמה:</label>
                    <textarea
                      rows={3}
                      required
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      placeholder="הודעתכם לרכז/ת המגמה..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#1D4ED8] outline-none resize-none"
                    />
                  </div>

                  {/* Hidden trap field: people never see it, bots fill it */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={inquiryTrap}
                    onChange={(e) => setInquiryTrap(e.target.value)}
                    className="hidden"
                  />

                  {inquiryError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-1">
                      <p className="font-bold">הפנייה לא נשלחה.</p>
                      {coordinatorDisplayEmail ? (
                        <p>
                          אפשר לשלוח מייל ישירות לרכז/ת:{' '}
                          <a
                            href={`mailto:${coordinatorDisplayEmail}?subject=${encodeURIComponent(`פנייה בנושא מגמת ${major.title}`)}`}
                            className="underline font-bold"
                          >
                            {coordinatorDisplayEmail}
                          </a>
                        </p>
                      ) : (
                        <p>לא נמצאה כתובת מייל לרכז/ת המגמה. אפשר לפנות למזכירות בית הספר.</p>
                      )}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={inquirySending}
                      className="w-full py-3 rounded-full bg-[#F59E0B] hover:bg-[#d98205] disabled:opacity-60 disabled:cursor-wait text-[#0F172A] font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {inquirySending ? (
                        <span>שולח...</span>
                      ) : (
                        <span>שליחת פנייה ישירה לרכז/ת</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 6. MODAL: PDF VIEWER MODAL                                     */}
      {/* ============================================================== */}
      <AnimatePresence>
        {activePdfPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePdfPreview(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full h-[92vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col text-right font-['Rubik',sans-serif]"
              dir="rtl"
            >
              {/* Header */}
              <div className="p-3.5 sm:px-6 bg-[#FAF8FF] border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#1D4ED8] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-black text-[#0F172A] truncate">
                      {activePdfPreview.name}
                    </h3>
                    <p className="text-[11px] text-[#434655]">
                      <span>{activePdfPreview.category || 'חומר עזר'}</span> • <span>{major.title}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDownloadPdf(activePdfPreview.url, activePdfPreview.name)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold hover:bg-emerald-200 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">הורדה</span>
                  </button>

                  <a
                    href={activePdfPreview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">חלון חדש</span>
                  </a>

                  <button
                    onClick={() => setActivePdfPreview(null)}
                    className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* PDF Content Area */}
              <div className="flex-1 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center p-2">
                <object
                  data={`${activePdfPreview.url}#toolbar=1&navpanes=0`}
                  type="application/pdf"
                  className="w-full h-full border-none rounded-2xl bg-white shadow-inner"
                >
                  <iframe
                    src={`${activePdfPreview.url}#toolbar=1&navpanes=0`}
                    className="w-full h-full border-none rounded-2xl bg-white"
                    title={activePdfPreview.name}
                  />
                </object>
              </div>

              {/* Footer */}
              <div className="p-3 sm:px-6 bg-[#FAF8FF] border-t border-slate-200 flex items-center justify-between text-xs text-[#434655] shrink-0">
                <span>תצוגה מקוונת של המסמך מתוך מאגר המגמה</span>
                <button
                  onClick={() => setActivePdfPreview(null)}
                  className="font-bold text-[#1D4ED8] hover:underline cursor-pointer"
                >
                  סגור
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 6. DEDICATED COORDINATOR PROFILE MODAL (כרטיס רכז/ת מלא)        */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isCoordinatorModalOpen && (
          <div 
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-md animate-fade-in"
            onClick={() => setIsCoordinatorModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.35 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden text-right relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative top accent */}
              <div className="h-2 w-full bg-gradient-to-r from-[#1D4ED8] via-[#FEA619] to-[#1D4ED8]" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsCoordinatorModalOpen(false)}
                className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer z-10"
                title="סגור חלונית"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 sm:p-8 space-y-6">
                {/* Avatar and Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-right pt-1">
                  <TeacherAvatar
                    name={coordinatorDisplayName}
                    imageUrl={coordinatorImageUrl}
                    className="w-24 h-24 rounded-2xl shadow-lg border-2 border-white ring-2 ring-[#1D4ED8]/20 object-cover shrink-0"
                    textClassName="text-2xl font-black"
                  />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-100 text-[#0037B0]">
                        {coordinatorDisplayRole}
                      </span>
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-100 text-[#855300]">
                        הובלת מגמת {major.title}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-[#0F172A]">
                      {coordinatorDisplayName}
                    </h3>
                  </div>
                </div>

                {/* Bio / Educational Role */}
                <div className="bg-[#FAF8FF] p-4 sm:p-5 rounded-2xl border border-[#0F172A]/06 space-y-1.5">
                  <h4 className="text-xs font-black text-[#855300] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>אודות ותפקיד חינוכי במגמה</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#434655] leading-relaxed whitespace-pre-wrap">
                    {coordinatorInfo?.bio || `${coordinatorDisplayName} משמש/ת בתפקיד ${coordinatorDisplayRole} בבית הספר השש-שנתי ע״ש משה ארנס ומלווה אישית את תלמידי המגמה להצלחה ולמיצוי מלוא הפוטנציאל.`}
                  </p>
                </div>

                {/* Email Contact (Official Email Only - No Phone Numbers) */}
                {coordinatorDisplayEmail && (
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-[#0037B0]">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-[#1D4ED8]" />
                        <span>דואר אלקטרוני רשמי:</span>
                      </span>
                      <span className="font-mono text-slate-600 text-xs select-all" dir="ltr">
                        {coordinatorDisplayEmail}
                      </span>
                    </div>

                    <a
                      href={`mailto:${coordinatorDisplayEmail}?subject=${encodeURIComponent(`פנייה אל ${coordinatorDisplayName} בנושא מגמת ${major.title}`)}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1D4ED8] hover:bg-blue-800 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all"
                    >
                      <Mail className="w-4 h-4" />
                      <span>שליחת פנייה ישירה בדוא״ל</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">שש-שנתי משה ארנס • פתח תקווה</span>
                <button
                  type="button"
                  onClick={() => setIsCoordinatorModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  סגירה
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
