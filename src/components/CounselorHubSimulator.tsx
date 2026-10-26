import React, { useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  ExternalLink, 
  RefreshCw, 
  X, 
  Heart,
  FileDown, 
  Sparkles, 
  Clock, 
  Mail, 
  ChevronLeft, 
  Share2, 
  CheckCircle2, 
  Wifi, 
  Battery, 
  ArrowRight,
  Send,
  PhoneCall,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { allTeachersList } from '../data/teachersList';
import { TeacherAvatar } from './TeacherAvatar';
import { 
  getCounselorMainPage, 
  COUNSELOR_CANONICAL_KEYS, 
  COUNSELOR_INFO_BY_GRADE, 
  GRADE_CANONICAL_KEYS 
} from '../data/internalPages';

interface CounselorHubSimulatorProps {
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
    receptionHours?: string;
  };
  onEditSection?: (section: 'home' | 'subpages') => void;
}

export const CounselorHubSimulator: React.FC<CounselorHubSimulatorProps> = ({
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

  // Discreet simulated form state
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [inquiryTopic, setInquiryTopic] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const cleanGrade = (grade || 'ז').replace(/['"״]/g, '').trim();

  // Retrieve stored page data for this counselor
  const storedPage = getCounselorMainPage(cleanGrade);
  const counselorInfo = COUNSELOR_INFO_BY_GRADE[cleanGrade];

  // Merge live preview data with stored data so uncommitted edits display instantly
  const title = (livePreviewData?.title !== undefined && livePreviewData.title.trim())
    ? livePreviewData.title
    : (storedPage?.title || counselorInfo?.title || `מרחב יועצת שכבה ${cleanGrade}`);

  const subtitle = (livePreviewData?.subtitle !== undefined && livePreviewData.subtitle.trim())
    ? livePreviewData.subtitle
    : (storedPage?.subtitle || counselorInfo?.subtitle || `ליווי רגשי, העצמה אישית ומענה אישי - שכבה ${cleanGrade}`);

  const contentParagraphs = (livePreviewData?.content !== undefined)
    ? livePreviewData.content
    : (storedPage?.content || []);

  const sections = (livePreviewData?.sections !== undefined)
    ? livePreviewData.sections
    : (storedPage?.sections || []);

  const pdfFiles = (livePreviewData?.pdfFiles !== undefined)
    ? livePreviewData.pdfFiles
    : (storedPage?.pdfFiles || []);

  const liveCounselorUrl = COUNSELOR_CANONICAL_KEYS[cleanGrade] || `course/counseling/grade-${cleanGrade}`;
  const liveGradeUrl = GRADE_CANONICAL_KEYS[cleanGrade];

  // Resolve counselor staff members
  const counselorNames = counselorInfo?.counselors || [];
  const resolvedCounselors = counselorNames.map(name => {
    const match = allTeachersList.find(t => 
      t.name === name || 
      t.name.includes(name) || 
      name.includes(t.name) ||
      (name.includes('לבהר') && t.name.includes('לבהר')) ||
      (name.includes('שטקל') && t.name.includes('שטקל')) ||
      (name.includes('קקון') && t.name.includes('קקון')) ||
      (name.includes('לונדין') && t.name.includes('לונדין')) ||
      (name.includes('לובינסקי') && t.name.includes('לובינסקי'))
    );
    return {
      name,
      staff: match,
      role: match?.role || `יועצת שכבה ${cleanGrade}`
    };
  });

  const handleOpenLiveOnSite = () => {
    window.location.hash = liveCounselorUrl;
  };

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSimulatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !inquiryTopic) return;
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setStudentName('');
      setStudentClass('');
      setContactPhone('');
      setInquiryTopic('');
    }, 4500);
  };

  return (
    <div className={`flex flex-col ${isOpenAsModal ? 'fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-2 md:p-6 overflow-hidden' : 'space-y-4'}`}>
      
      {/* SIMULATOR TOOLBAR */}
      <div className="bg-[#0b1329] border border-school-line/70 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        
        {/* Left: Grade Selector & Status */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-sm">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">הדמיה חיה של דף יועצת שכבה</h3>
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
                    ? 'bg-purple-500 text-white font-black shadow-sm'
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
                ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40 shadow-sm'
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
                ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40 shadow-sm'
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
                ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40 shadow-sm'
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-xs font-bold text-purple-200 transition-all cursor-pointer"
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

            <div className="hidden md:flex items-center gap-1.5 bg-[#080d19] px-3 py-1 rounded-lg border border-school-line/40 font-mono text-[10px] text-purple-300">
              <span>arens.school/#</span>
              <span className="text-white">{liveCounselorUrl}</span>
            </div>

            <div className="text-[10px] text-purple-300 font-bold flex items-center gap-1">
              <Heart className="w-3 h-3 text-purple-400" />
              <span>מרחב ייעוץ והכוונה</span>
            </div>
          </div>

          {/* SIMULATED PAGE CONTENT */}
          <div className="max-h-[80vh] overflow-y-auto text-right" dir="rtl">
            
            {/* HERO SECTION */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[#181133] via-school-panel/80 to-school-bg py-12 px-6 md:px-10 border-b border-purple-500/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(168,85,247,0.2),transparent_70%)] pointer-events-none" />
              <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-4 relative z-10 max-w-4xl mx-auto">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-school-muted/80 select-none">
                  <span>דף הבית</span>
                  <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
                  <span>שכבות הגיל</span>
                  <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
                  <span className="hover:text-school-cyan transition-colors cursor-pointer" onClick={() => { if (liveGradeUrl) window.location.hash = liveGradeUrl; }}>
                    שכבה {cleanGrade}
                  </span>
                  <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-purple-300 font-bold">דף יועצת השכבה</span>
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs text-purple-300 font-bold">
                  <Heart className="w-3.5 h-3.5 text-purple-400" />
                  <span>מרחב ייעוץ וליווי רגשי • שכבה {cleanGrade}'</span>
                </div>

                {/* Main Title */}
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  {title}
                </h1>

                {/* Glowing line */}
                <div className="w-20 h-1.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.7)]" />

                {/* Subtitle */}
                {subtitle && (
                  <p className="text-sm md:text-base font-bold text-purple-200/90 leading-relaxed">
                    {subtitle}
                  </p>
                )}

                {/* Fast Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-school-line hover:border-purple-400 text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-purple-400" />}
                    <span>{copiedLink ? 'הקישור הועתק!' : 'שתף דף'}</span>
                  </button>

                  {liveGradeUrl && (
                    <button
                      type="button"
                      onClick={() => { window.location.hash = liveGradeUrl; }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-school-cyan/10 border border-school-cyan/30 hover:bg-school-cyan/20 text-xs font-bold text-school-cyan transition-all cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5 -scale-x-100" />
                      <span>חזרה לדף שכבה {cleanGrade}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* BENTO GRID SIMULATION */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-5xl mx-auto">
                
                {/* MAIN CONTENT COLUMN (col-span-8) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* ABOUT & MANIFESTO */}
                  <div className="bg-[#0b1329] border border-school-line/80 rounded-2xl p-5 md:p-6 space-y-4 shadow-lg relative overflow-hidden">
                    <div className="flex items-center gap-2 pb-3 border-b border-school-line/40">
                      <Heart className="w-5 h-5 text-purple-400" />
                      <h2 className="text-base md:text-lg font-black text-white">דבר יועצת השכבה</h2>
                    </div>

                    {contentParagraphs.length === 0 ? (
                      <p className="text-xs text-school-muted/80 italic">
                        הטקסט והחזון הייעוצי נמצאים כעת בעריכה.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {contentParagraphs.map((para, pIdx) => (
                          <p key={pIdx} className="text-xs md:text-sm text-school-muted leading-relaxed">
                            {para}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SECTIONS & LIFE SKILLS WORKSHOPS */}
                  {sections.length > 0 && (
                    <div className="space-y-4">
                      {sections.map((sec, sIdx) => {
                        const secText = sec.content !== undefined ? sec.content : sec.text;
                        return (
                          <div key={sIdx} className="bg-[#0b1329] border border-school-line/70 p-5 rounded-2xl space-y-2.5 shadow-md">
                            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 shrink-0" />
                              <span>{sec.title || 'תכנית ופעילות ייעוצית'}</span>
                            </h3>

                            {secText && (
                              <p className="text-xs text-school-muted leading-relaxed whitespace-pre-line">
                                {typeof secText === 'string' ? secText : Array.isArray(secText) ? secText.join('\n') : ''}
                              </p>
                            )}

                            {sec.list && sec.list.length > 0 && (
                              <ul className="grid grid-cols-1 gap-1.5 text-xs text-school-muted pr-4 list-disc marker:text-purple-400">
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

                  {/* DISCRETE CONTACT FORM SIMULATOR */}
                  <div className="bg-gradient-to-br from-[#120d2a] via-[#0b1329] to-[#080d19] border border-purple-500/30 rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
                          <Send className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-white">טופס פנייה דיסקרטית ליועצת השכבה</h3>
                          <p className="text-[11px] text-purple-200/70">
                            פנייה ישירה ומאובטחת ליועצת - מענה יינתן בהקדם
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                        דיסקרטיות מובטחת
                      </span>
                    </div>

                    {inquirySent ? (
                      <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs text-center font-bold space-y-1">
                        <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
                        <p>הפנייה נשלחה בהצלחה ליועצת השכבה!</p>
                        <p className="text-[10px] text-emerald-200/80 font-normal">ניצור עמך קשר דיסקרטי בהקדם האפשרי.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSimulatedSubmit} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-school-muted block mb-1">שם מלא (תלמיד/ה או הורה):</label>
                            <input
                              type="text"
                              value={studentName}
                              onChange={(e) => setStudentName(e.target.value)}
                              placeholder="ישראל ישראלי"
                              className="w-full bg-[#050b18] border border-school-line/70 rounded-xl px-3 py-2 text-xs text-white placeholder-school-muted/50 focus:border-purple-400 focus:outline-none"
                              required
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-school-muted block mb-1">כיתה (לדוגמה: {cleanGrade}1):</label>
                            <input
                              type="text"
                              value={studentClass}
                              onChange={(e) => setStudentClass(e.target.value)}
                              placeholder={`כיתה ${cleanGrade}2`}
                              className="w-full bg-[#050b18] border border-school-line/70 rounded-xl px-3 py-2 text-xs text-white placeholder-school-muted/50 focus:border-purple-400 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-school-muted block mb-1">טלפון / דוא"ל לחזרה:</label>
                          <input
                            type="text"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            placeholder="050-0000000 / email@domain.com"
                            className="w-full bg-[#050b18] border border-school-line/70 rounded-xl px-3 py-2 text-xs text-white placeholder-school-muted/50 focus:border-purple-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-school-muted block mb-1">תוכן הפנייה / נושא ההתייעצות:</label>
                          <textarea
                            rows={3}
                            value={inquiryTopic}
                            onChange={(e) => setInquiryTopic(e.target.value)}
                            placeholder="תאר/י בקצרה את הנושא שבו תרצה/י להתייעץ..."
                            className="w-full bg-[#050b18] border border-school-line/70 rounded-xl px-3 py-2 text-xs text-white placeholder-school-muted/50 focus:border-purple-400 focus:outline-none resize-none"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>שליחת פנייה דיסקרטית ליועצת</span>
                        </button>
                      </form>
                    )}
                  </div>

                  {/* EMERGENCY HOTLINES BANNER */}
                  <div className="bg-[#0b1329] border border-school-line/70 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-school-muted">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-extrabold text-white block">קווי סיוע ותמיכה רגשית 24/7 בשעת חירום:</span>
                        <span className="text-[11px] text-school-muted">ער"ן: 1201 | סה"ר (בצ'אט) | מוקד 105 להגנה על ילדים ברשת</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* SIDEBAR COLUMN (col-span-4) */}
                <div className="lg:col-span-4 space-y-5">
                  
                  {/* COUNSELORS PROFILE CARD */}
                  <div className="bg-gradient-to-br from-[#1b153b] to-[#0b1329] border border-purple-500/40 rounded-2xl p-5 text-center space-y-4 shadow-lg relative overflow-hidden">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] font-extrabold text-purple-300">
                      <ShieldCheck className="w-3 h-3 text-purple-400" />
                      <span>יועצת שכבה {cleanGrade}'</span>
                    </div>

                    <div className="space-y-4">
                      {resolvedCounselors.map((counselor, cIdx) => (
                        <div key={cIdx} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#080d19]/80 border border-school-line/50">
                          <TeacherAvatar
                            name={counselor.name}
                            imageUrl={counselor.staff?.imageUrl}
                            className="w-16 h-16 rounded-full shadow-md"
                            textClassName="text-xl font-black"
                            borderClassName="border-2 border-purple-400/50"
                          />
                          <div className="space-y-0.5">
                            <h4 className="font-extrabold text-sm text-white">{counselor.name}</h4>
                            <p className="text-[11px] text-purple-300 font-bold">{counselor.role}</p>
                            {counselor.staff?.email && (
                              <a
                                href={`mailto:${counselor.staff.email}`}
                                className="inline-flex items-center gap-1 text-[10px] text-school-muted hover:text-white transition-colors mt-1 select-all"
                              >
                                <Mail className="w-3 h-3 text-purple-400" />
                                <span>{counselor.staff.email}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Reception Hours Box */}
                    <div className="bg-[#080d19] border border-school-line/60 rounded-xl p-3 text-right space-y-1">
                      <span className="text-[10px] font-bold text-purple-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>שעות קבלת קהל ופניות:</span>
                      </span>
                      <p className="text-[11px] text-school-muted leading-relaxed">
                        מפגשים אישיים עם תלמידים והורים מתקיימים בתיאום מראש בחדר הייעוץ או באמצעות טופס הפנייה.
                      </p>
                    </div>
                  </div>

                  {/* PDF FORMS & DOWNLOADS */}
                  <div className="bg-[#0b1329] border border-school-line rounded-2xl p-5 space-y-3 shadow-md">
                    <div className="flex items-center justify-between pb-2 border-b border-school-line/40">
                      <h3 className="font-extrabold text-xs text-emerald-400 flex items-center gap-1.5">
                        <FileDown className="w-4 h-4" />
                        <span>טפסים ושאלונים ({pdfFiles.length})</span>
                      </h3>
                      {onEditSection && (
                        <button
                          type="button"
                          onClick={() => onEditSection('home')}
                          className="text-[10px] text-purple-300 hover:underline font-bold cursor-pointer"
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
                                setDownloadFeedback(pdf.name);
                                setTimeout(() => setDownloadFeedback(null), 2000);
                              }}
                              className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <FileDown className="w-3 h-3" />
                              <span>הורד</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {downloadFeedback && (
                      <p className="text-[10px] text-emerald-300 text-center font-bold">
                        מדמה הורדה של {downloadFeedback}
                      </p>
                    )}
                  </div>

                  {/* QUICK LINK BACK TO MAIN GRADE PAGE */}
                  {liveGradeUrl && (
                    <div className="bg-[#0b1329] border border-school-line rounded-2xl p-4 shadow-sm">
                      <button
                        type="button"
                        onClick={() => { window.location.hash = liveGradeUrl; }}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-school-cyan/15 hover:bg-school-cyan/25 border border-school-cyan/30 text-school-cyan transition-colors cursor-pointer"
                      >
                        <ArrowRight className="w-4 h-4 shrink-0 -scale-x-100" />
                        <span>מעבר לדף שכבה {cleanGrade} הראשי</span>
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};
