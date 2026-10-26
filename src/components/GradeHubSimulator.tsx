import React, { useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  ExternalLink, 
  RefreshCw, 
  X, 
  Check, 
  GraduationCap, 
  Users, 
  FileDown, 
  Compass, 
  Sparkles, 
  Clock, 
  Award, 
  Mail, 
  ChevronLeft, 
  Maximize2, 
  Minimize2,
  Share2,
  CheckCircle2,
  BookOpen,
  Wifi,
  Battery,
  Layers,
  ArrowRight,
  Heart
} from 'lucide-react';
import { gradesData } from '../data';
import { allTeachersList } from '../data/teachersList';
import { TeacherAvatar } from './TeacherAvatar';
import { getStoredMajors } from '../services/majorsStorage';
import { getGradeMainPage, GRADE_CANONICAL_KEYS, COUNSELOR_CANONICAL_KEYS } from '../data/internalPages';

interface GradeHubSimulatorProps {
  grade: string;
  onGradeChange?: (grade: string) => void;
  isOpenAsModal?: boolean;
  onClose?: () => void;
  // Optional live preview data from the active editor
  livePreviewData?: {
    title?: string;
    subtitle?: string;
    content?: string[];
    sections?: Array<{ title: string; content?: string; text?: any; list?: string[] }>;
    pdfFiles?: Array<{ name: string; url: string; size?: string }>;
    classes?: Array<{ id: string; name: string; specialty?: string; homeroomTeacher?: string; room?: string }>;
  };
  onEditSection?: (section: 'home' | 'classes' | 'subpages') => void;
}

export const GradeHubSimulator: React.FC<GradeHubSimulatorProps> = ({
  grade,
  onGradeChange,
  isOpenAsModal = false,
  onClose,
  livePreviewData,
  onEditSection
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState<string | null>(null);

  const cleanGrade = (grade || 'ז').replace(/['"״]/g, '').trim();

  // Retrieve default or stored page data for this grade
  const storedPage = getGradeMainPage(cleanGrade);
  const gradeLevelInfo = gradesData.find(g => g.grade.replace(/['"״]/g, '').trim() === cleanGrade);

  // Merge live preview data with stored data so uncommitted edits display instantly
  const title = (livePreviewData?.title !== undefined && livePreviewData.title.trim()) 
    ? livePreviewData.title 
    : (storedPage?.title || `שכבת ${cleanGrade}`);

  const subtitle = (livePreviewData?.subtitle !== undefined && livePreviewData.subtitle.trim())
    ? livePreviewData.subtitle
    : (storedPage?.subtitle || `דף הבית והריכוז הרשמי של שכבת ${cleanGrade} - שש שנתי משה ארנס`);

  const contentParagraphs = (livePreviewData?.content !== undefined)
    ? livePreviewData.content
    : (storedPage?.content || (gradeLevelInfo?.description ? [gradeLevelInfo.description] : []));

  const sections = (livePreviewData?.sections !== undefined)
    ? livePreviewData.sections
    : (storedPage?.sections || []);

  const pdfFiles = (livePreviewData?.pdfFiles !== undefined)
    ? livePreviewData.pdfFiles
    : (storedPage?.pdfFiles || []);

  const classesList = (livePreviewData?.classes !== undefined)
    ? livePreviewData.classes
    : (gradeLevelInfo?.classes || []);

  // Division determination
  const isMiddleSchool = ['ז', 'ח', 'ט'].includes(cleanGrade);
  const isHighSchool = ['י', 'יא', 'יב'].includes(cleanGrade);
  const divisionLabel = isMiddleSchool ? 'חטיבת נעורים' : 'חטיבה עליונה';

  // Relevant majors matching division
  const allMajors = getStoredMajors();
  const relevantMajors = allMajors.filter(m => {
    if (isMiddleSchool && m.division === 'middle_school') return true;
    if (isHighSchool && m.division === 'high_school') return true;
    return false;
  });

  // Leadership & Coordinator resolution
  const standardLeadershipByGrade: Record<string, { role: string; name: string }[]> = {
    'ז': [
      { role: "רכז שכבה", name: "רועי רותם" },
      { role: "יועצת השכבה", name: "ענבל ממן" },
      { role: "יועצת השכבה", name: "אורית הדר לבהר" }
    ],
    'ח': [
      { role: "מובילת שכבה", name: "איריס שחמון" },
      { role: "אחראית פדגוגית", name: "שני מנור זמר טוב" },
      { role: "יועצת השכבה", name: "רינת שטקל" }
    ],
    'ט': [
      { role: "מוביל שכבה", name: "נדב גורן" },
      { role: "אחראית פדגוגית", name: "ענבל מדויל" },
      { role: "יועצת השכבה", name: "סמדר קקון" }
    ],
    'י': [
      { role: "רכז/ת שכבה", name: "הנהלת שכבת י'" },
      { role: "יועצת השכבה", name: "ענבל ישראלי לונדין" }
    ],
    'יא': [
      { role: "רכז/ת שכבה", name: "הנהלת שכבת יא'" },
      { role: "יועצת השכבה", name: "ענבל ישראלי לונדין" }
    ],
    'יב': [
      { role: "רכזת שכבה יב' ואנגלית", name: "אורלי רז" },
      { role: "יועצת השכבה", name: "עופרי טל לובינסקי" }
    ]
  };

  const leadershipList = (gradeLevelInfo?.leadership && gradeLevelInfo.leadership.length > 0)
    ? gradeLevelInfo.leadership
    : (standardLeadershipByGrade[cleanGrade] || [
        { role: `רכז/ת שכבה ${cleanGrade}`, name: gradeLevelInfo?.coordinator || `רכז/ת שכבת ${cleanGrade}` }
      ]);

  const liveCanonicalKey = GRADE_CANONICAL_KEYS[cleanGrade] || `course/שכבה-${cleanGrade}`;

  const handleOpenLiveOnSite = () => {
    window.location.hash = liveCanonicalKey;
  };

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className={`flex flex-col ${isOpenAsModal ? 'fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-2 md:p-6 overflow-hidden' : 'space-y-4'}`}>
      
      {/* SIMULATOR TOOLBAR */}
      <div className="bg-[#0b1329] border border-school-line/70 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        
        {/* Left: Grade Selector & Status */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-school-cyan/20 border border-school-cyan/40 flex items-center justify-center text-school-cyan shadow-sm">
            <Monitor className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">הדמיה חיה של דף ריכוז השכבה</h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>זמן אמת</span>
              </span>
            </div>
            <p className="text-[11px] text-school-muted">
              תצוגה מקדימה מדויקת כפי שהתלמידים וההורים רואים באתר
            </p>
          </div>
        </div>

        {/* Center: Grade Switcher (ז, ח, ט, י, יא, יב) */}
        {onGradeChange && (
          <div className="flex items-center bg-[#050b18] p-1 rounded-xl border border-school-line/60 gap-1">
            <span className="text-[10px] text-school-muted px-2 font-bold">שכבה:</span>
            {[
              { id: 'ז', label: "ז'" },
              { id: 'ח', label: "ח'" },
              { id: 'ט', label: "ט'" },
              { id: 'י', label: "י'" },
              { id: 'יא', label: "יא'" },
              { id: 'יב', label: "יב'" }
            ].map(g => (
              <button
                key={g.id}
                type="button"
                onClick={() => onGradeChange(g.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  cleanGrade === g.id
                    ? 'bg-school-cyan text-slate-950 font-black shadow-sm'
                    : 'text-school-muted hover:text-white hover:bg-white/5'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        )}

        {/* Device Switcher (Desktop, Tablet, Mobile) */}
        <div className="flex items-center bg-[#050b18] p-1 rounded-xl border border-school-line/60 gap-1">
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            title="תצוגת מחשב שולחני (Desktop)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              deviceMode === 'desktop'
                ? 'bg-school-cyan/20 text-school-cyan border border-school-cyan/40 shadow-sm'
                : 'text-school-muted hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">מחשב</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceMode('tablet')}
            title="תצוגת טאבלט (Tablet 768px)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              deviceMode === 'tablet'
                ? 'bg-school-cyan/20 text-school-cyan border border-school-cyan/40 shadow-sm'
                : 'text-school-muted hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">טאבלט</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            title="תצוגת טלפון נייד (Mobile 390px)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              deviceMode === 'mobile'
                ? 'bg-school-cyan/20 text-school-cyan border border-school-cyan/40 shadow-sm'
                : 'text-school-muted hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">נייד</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRefreshKey(k => k + 1)}
            title="רענן הדמיה"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-school-muted hover:text-white border border-school-line/60 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleOpenLiveOnSite}
            title="פתח דף זה באתר החי"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-school-cyan/15 hover:bg-school-cyan/25 border border-school-cyan/30 text-xs font-bold text-school-cyan transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">פתח באתר החי</span>
          </button>

          {onEditSection && (
            <button
              type="button"
              onClick={() => onEditSection('home')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-school-line text-xs font-bold text-white transition-all cursor-pointer"
            >
              <span>ערוך דף</span>
            </button>
          )}

          {isOpenAsModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              title="סגור הדמיה"
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* SIMULATOR VIEWPORT CANVAS */}
      <div 
        key={refreshKey}
        className={`bg-[#060a14] rounded-2xl border border-school-line/40 p-4 md:p-8 flex items-center justify-center overflow-auto ${
          isOpenAsModal ? 'flex-1' : 'min-h-[700px]'
        }`}
      >
        <div 
          className={`transition-all duration-300 mx-auto shadow-2xl relative ${
            deviceMode === 'desktop' 
              ? 'w-full max-w-6xl rounded-2xl border border-school-line/60 bg-school-bg overflow-hidden'
              : deviceMode === 'tablet'
                ? 'w-[768px] max-w-full rounded-[2.5rem] border-[10px] border-slate-800 bg-school-bg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]'
                : 'w-[390px] max-w-full rounded-[3rem] border-[12px] border-slate-900 bg-school-bg overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)]'
          }`}
        >

          {/* MOBILE / TABLET TOP NOTCH & STATUS BAR */}
          {(deviceMode === 'mobile' || deviceMode === 'tablet') && (
            <div className="bg-slate-950 text-white px-6 py-2.5 flex items-center justify-between text-[11px] font-bold select-none border-b border-white/5">
              <span>09:41</span>
              {deviceMode === 'mobile' && (
                <div className="w-20 h-4 bg-slate-900 rounded-full border border-white/10 mx-auto -mt-1" />
              )}
              <div className="flex items-center gap-2 text-school-muted">
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>
          )}

          {/* SIMULATED BROWSER / APP HEADER */}
          <div className="bg-[#121c33] border-b border-school-line/50 px-4 py-2.5 flex items-center justify-between text-xs text-school-muted select-none">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-[11px] font-bold text-white pr-2 border-r border-school-line/40">
                בית הספר השש שנתי משה ארנס
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 bg-[#080d19] px-3 py-1 rounded-lg border border-school-line/40 font-mono text-[10px] text-school-cyan">
              <span>arens.school/#</span>
              <span className="text-white">{liveCanonicalKey}</span>
            </div>

            <div className="text-[10px] text-school-cyan font-bold flex items-center gap-1">
              <span>תצוגת תלמיד והורה</span>
            </div>
          </div>

          {/* SIMULATED GRADE HUB CONTENT */}
          <div className="max-h-[75vh] overflow-y-auto text-right font-sans" dir="rtl">

            {/* HERO BANNER */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[#101b33] via-school-bg to-[#0b1329] py-10 px-5 md:px-10 border-b border-school-line/30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(34,211,238,0.18),transparent_70%)] pointer-events-none" />
              <div className="absolute top-10 left-5 w-48 h-48 bg-school-cyan/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-5 right-5 w-56 h-56 bg-school-violet/10 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-5xl mx-auto space-y-4 relative z-10">
                
                {/* Breadcrumbs */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-school-muted/80 select-none">
                  <span>דף הבית</span>
                  <ChevronLeft className="w-3 h-3" />
                  <span className="text-school-cyan font-bold">{divisionLabel}</span>
                  <ChevronLeft className="w-3 h-3" />
                  <span className="text-white font-bold">שכבת {cleanGrade}</span>
                </div>

                {/* Slogan Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-school-cyan/15 border border-school-cyan/30 text-xs text-school-cyan font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>אתר השכבה הרשמי • תשפ&quot;ו</span>
                </div>

                {/* Main Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                  {title}
                </h1>

                {/* Gradient divider line */}
                <div className="w-20 h-1 bg-gradient-to-r from-school-cyan to-school-violet rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />

                {/* Subtitle */}
                {subtitle && (
                  <p className="text-sm md:text-base font-bold text-school-cyan/90 max-w-3xl leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* BENTO GRID CONTENT */}
            <div className="max-w-5xl mx-auto p-5 md:p-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* RIGHT COLUMN: ABOUT & CLASSES & SECTIONS (col-span-8) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* ABOUT / PEDAGOGICAL VISION CARD */}
                  <div className="bg-[#101b33] border border-school-line rounded-2xl p-5 md:p-6 space-y-4 shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between pb-3 border-b border-school-line/50">
                      <h2 className="text-base md:text-lg font-black text-white flex items-center gap-2">
                        <Compass className="w-5 h-5 text-school-cyan" />
                        <span>על השכבה והחזון הפדגוגי</span>
                      </h2>
                      {onEditSection && (
                        <button
                          type="button"
                          onClick={() => onEditSection('home')}
                          className="text-[10px] text-school-cyan hover:underline font-bold cursor-pointer"
                        >
                          ערוך מלל
                        </button>
                      )}
                    </div>

                    {contentParagraphs.length === 0 ? (
                      <div className="text-center py-6 px-4 bg-[#080d19]/60 border border-dashed border-school-line/60 rounded-xl space-y-1">
                        <Clock className="w-5 h-5 text-school-cyan/70 mx-auto" />
                        <p className="text-xs font-bold text-white">התוכן יעלה בקרוב</p>
                        <p className="text-[11px] text-school-muted">צוות השכבה מעדכן את המידע בימים אלו.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 text-xs md:text-sm text-school-muted leading-relaxed">
                        {contentParagraphs.map((par, pIdx) => (
                          <p key={pIdx}>{par}</p>
                        ))}
                      </div>
                    )}

                    {/* SUBSECTIONS / PILLARS */}
                    {sections.length > 0 && (
                      <div className="space-y-4 pt-3 border-t border-school-line/40">
                        {sections.map((sec, sIdx) => {
                          const secText = sec.content !== undefined ? sec.content : sec.text;
                          return (
                            <div key={sIdx} className="bg-[#080d19] border border-school-line/50 p-4 rounded-xl space-y-2">
                              <h3 className="font-extrabold text-xs md:text-sm text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-school-cyan to-school-violet shrink-0" />
                                <span>{sec.title || 'מידע שכבתי'}</span>
                              </h3>
                              {secText && (
                                <p className="text-xs text-school-muted leading-relaxed whitespace-pre-line">
                                  {typeof secText === 'string' ? secText : Array.isArray(secText) ? secText.join('\n') : ''}
                                </p>
                              )}
                              {sec.list && sec.list.length > 0 && (
                                <ul className="grid grid-cols-1 gap-1 text-xs text-school-muted pr-4 list-disc marker:text-school-cyan">
                                  {sec.list.map((li, lIdx) => (
                                    <li key={lIdx}>{li}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* CLASSES & TRACKS */}
                  {classesList.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-1">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-school-violet" />
                          <h2 className="text-base md:text-lg font-black text-white">כיתות ומסלולי השכבה</h2>
                        </div>
                        <span className="text-[10px] text-school-muted font-bold">
                          ({classesList.length} כיתות מוגדרות)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {classesList.map((cls, idx) => (
                          <div 
                            key={cls.id || idx}
                            className="bg-[#101b33] hover:bg-[#152342] border border-school-line/70 hover:border-school-cyan/40 rounded-xl p-4 transition-all"
                          >
                            <h3 className="font-extrabold text-white text-sm">
                              {cls.name}
                            </h3>
                            {cls.specialty && (
                              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-school-cyan/15 border border-school-cyan/30 text-school-cyan font-bold">
                                {cls.specialty}
                              </span>
                            )}
                            {cls.homeroomTeacher && (
                              <p className="text-[11px] text-school-muted mt-2">
                                מחנך/ת: {cls.homeroomTeacher}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* RELEVANT MAJORS */}
                  {relevantMajors.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between pb-1 border-b border-school-line/30">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-school-cyan" />
                          <h3 className="text-sm font-extrabold text-white">
                            {isMiddleSchool ? 'מסלולי ומגמות החטיבה' : 'מגמות החטיבה העליונה'}
                          </h3>
                        </div>
                        <span className="text-[10px] text-school-muted font-bold">
                          ({relevantMajors.length} מגמות)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {relevantMajors.slice(0, 4).map((m) => (
                          <div key={m.id} className="bg-[#101b33] border border-school-line/60 rounded-xl p-3.5 space-y-1">
                            <h4 className="text-xs font-bold text-white">{m.title || (m as any).name}</h4>
                            <p className="text-[11px] text-school-muted line-clamp-2">
                              {m.shortDescription || m.fullDescription}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* LEFT COLUMN: COORDINATOR CARD & PDF DOWNLOADS (col-span-4) */}
                <div className="lg:col-span-4 space-y-6">

                  {/* COORDINATOR / LEADERSHIP CARD */}
                  <div className="bg-gradient-to-br from-[#121c33] to-[#0c1426] border border-school-line rounded-2xl p-5 text-center space-y-4 shadow-md">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-school-cyan/15 border border-school-cyan/30 text-[10px] font-black text-school-cyan">
                      <span>הנהלת וריכוז שכבה {cleanGrade}</span>
                    </div>

                    <div className="space-y-3">
                      {leadershipList.map((leader, lIdx) => {
                        const matchedStaff = allTeachersList.find(t => 
                          t.name === leader.name || 
                          t.name.includes(leader.name) || 
                          leader.name.includes(t.name)
                        );
                        return (
                          <div key={lIdx} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#080d19]/60 border border-school-line/40">
                            <TeacherAvatar
                              name={leader.name}
                              imageUrl={matchedStaff?.imageUrl}
                              className="w-14 h-14 rounded-full shadow-md"
                              textClassName="text-lg font-black"
                              borderClassName="border-2 border-school-cyan/40"
                            />

                            <div className="space-y-0.5">
                              <h4 className="font-extrabold text-sm text-white">{leader.name}</h4>
                              <p className="text-[11px] text-school-cyan font-bold">{leader.role}</p>
                              {matchedStaff?.email && (
                                <p className="text-[10px] text-school-muted mt-1 select-all hover:text-white transition-colors">
                                  {matchedStaff.email}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* DEDICATED LAYER COUNSELOR CARD */}
                  {COUNSELOR_CANONICAL_KEYS[cleanGrade] && (
                    <div className="bg-gradient-to-br from-[#1b153b] via-[#121c33] to-[#0d1424] border border-purple-500/30 rounded-2xl p-4 text-center space-y-3 shadow-md relative overflow-hidden group hover:border-purple-400/50 transition-all">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-[10px] font-extrabold text-purple-300">
                        <Heart className="w-3 h-3 text-purple-400" />
                        <span>ייעוץ והכוונה שכבתי</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-white group-hover:text-purple-300 transition-colors">
                          דף יועצת שכבה {cleanGrade}'
                        </h4>
                        <p className="text-[10px] text-purple-200/80 leading-relaxed">
                          ליווי רגשי, סדנאות כישורי חיים, שעות קבלת קהל ופנייה דיסקרטית
                        </p>
                      </div>
                      <a
                        href={`#${COUNSELOR_CANONICAL_KEYS[cleanGrade]}`}
                        className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-[11px] font-bold bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 transition-all cursor-pointer shadow-sm"
                      >
                        <span>מעבר לדף יועצת שכבה {cleanGrade}'</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0 -scale-x-100" />
                      </a>
                    </div>
                  )}

                  {/* PDF FORMS & DOWNLOADS */}
                  <div className="bg-[#101b33] border border-school-line rounded-2xl p-5 space-y-3 shadow-md">
                    <div className="flex items-center justify-between pb-2 border-b border-school-line/40">
                      <h3 className="font-extrabold text-xs text-emerald-400 flex items-center gap-1.5">
                        <FileDown className="w-4 h-4" />
                        <span>טפסים ומסמכי PDF ({pdfFiles.length})</span>
                      </h3>
                      {onEditSection && (
                        <button
                          type="button"
                          onClick={() => onEditSection('home')}
                          className="text-[10px] text-school-cyan hover:underline font-bold cursor-pointer"
                        >
                          ערוך
                        </button>
                      )}
                    </div>

                    {pdfFiles.length === 0 ? (
                      <p className="text-xs text-school-muted/70 italic text-center py-3">
                        אין מסמכים מצורפים כעת
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {pdfFiles.map((pdf, pIdx) => (
                          <div
                            key={pIdx}
                            className="flex items-center justify-between p-2.5 bg-[#080d19] border border-school-line/50 rounded-xl hover:border-emerald-500/40 transition-colors"
                          >
                            <span className="text-xs font-bold text-white truncate max-w-[170px]" title={pdf.name}>
                              {pdf.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const cleanName = pdf.name.endsWith('.pdf') ? pdf.name : `${pdf.name}.pdf`;
                                fetch(pdf.url)
                                  .then(res => {
                                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                                    return res.blob();
                                  })
                                  .then(blob => {
                                    const blobUrl = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = blobUrl;
                                    a.download = cleanName;
                                    document.body.appendChild(a);
                                    a.click();
                                    setTimeout(() => {
                                      document.body.removeChild(a);
                                      window.URL.revokeObjectURL(blobUrl);
                                    }, 3000);
                                  })
                                  .catch(() => {
                                    window.open(pdf.url, '_blank', 'noopener,noreferrer');
                                  });
                                setDownloadFeedback(`הקובץ "${pdf.name}" נפתח/הורד בהצלחה`);
                                setTimeout(() => setDownloadFeedback(null), 3500);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold cursor-pointer"
                            >
                              הורדה
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {downloadFeedback && (
                      <p className="text-[10px] text-emerald-300 font-bold bg-emerald-500/20 p-1.5 rounded-lg text-center animate-fade-in">
                        {downloadFeedback}
                      </p>
                    )}
                  </div>

                  {/* QUICK SIMULATOR SHARE LINK */}
                  <div className="p-4 bg-[#080d19] border border-school-line/60 rounded-2xl text-center space-y-2">
                    <p className="text-xs text-white font-bold">שיתוף דף השכבה</p>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="w-full py-2 px-3 rounded-xl bg-school-cyan/20 hover:bg-school-cyan/30 border border-school-cyan/40 text-school-cyan text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'הקישור הועתק!' : 'העתק קישור לדף השכבה'}</span>
                    </button>
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
