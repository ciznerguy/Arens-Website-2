import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Printer, 
  Download, 
  Share2, 
  ChevronLeft, 
  Check, 
  Send,
  BookOpen,
  Info,
  ArrowRight,
  Heart,
  CreditCard,
  FileCheck,
  GraduationCap,
  MapPin,
  User,
  Compass,
  Award,
  TrendingUp,
  Rocket,
  Calendar,
  Sparkles,
  Link as LinkIcon,
  Cpu,
  Trophy,
  Laptop,
  Medal,
  Clock
} from 'lucide-react';
import { getInternalPage, INTERNAL_PAGES, InternalPage, getInternalPageOverrides, getGradeClassesOverrides } from '../data/internalPages';
import { gradesData } from '../data';
import { getStoredMajors } from '../services/majorsStorage';
import { SchoolMajor } from '../types';

// Helper to check if this page is a grade main page
const isGradeMainPage = (url: string): boolean => {
  const normalized = url.replace(/^\/+|\/+$/g, "").toLowerCase();
  return (
    normalized.includes("course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%96") ||
    normalized.includes("course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%97") ||
    normalized.includes("course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%98") ||
    normalized.includes("course/%d7%97%d7%98%d7%a2-2/%d7%a4%d7%95%d7%a1%d7%98-%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99") ||
    normalized.includes("course/%d7%97%d7%98%a2-2/%d7%a4%d7%95%d7%a1%d7%98-%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99") ||
    normalized.includes("course/%d7%97%d7%98%d7%a2-2/%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%90") ||
    normalized.includes("course/%d7%97%d7%98%a2-2/%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%90") ||
    normalized.includes("course/%d7%97%d7%98%d7%a2-2/%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%91") ||
    normalized.includes("course/%d7%97%d7%98%a2-2/%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%91")
  );
};

// Helper to determine what grade a page belongs to
const getGradeForPage = (url: string, page: any): string | null => {
  if (!url) return null;
  let decoded = '';
  try {
    decoded = decodeURIComponent(url).toLowerCase();
  } catch {
    decoded = url.toLowerCase();
  }
  const title = (page?.title || '').toLowerCase();
  const subtitle = (page?.subtitle || '').toLowerCase();
  const category = (page?.category || '').toLowerCase();
  
  const fullSearchText = `${decoded} ${title} ${subtitle} ${category}`;

  // 1. High school multi-char grades first (יא, יב)
  if (
    fullSearchText.includes("שכבה-יא") || fullSearchText.includes("שכבת-יא") || 
    fullSearchText.includes("שכבת יא") || fullSearchText.includes("שכבה יא") || 
    fullSearchText.includes("כיתה יא") || fullSearchText.includes("כיתות יא")
  ) return 'יא';

  if (
    fullSearchText.includes("שכבה-יב") || fullSearchText.includes("שכבת-יב") || 
    fullSearchText.includes("שכבת יב") || fullSearchText.includes("שכבה יב") || 
    fullSearchText.includes("כיתה יב") || fullSearchText.includes("כיתות יב")
  ) return 'יב';

  // 2. Middle school grades: ז, ח, ט (Check BEFORE single letter 'י')
  if (
    fullSearchText.includes("שכבת-ז") || fullSearchText.includes("שכבה-ז") || 
    fullSearchText.includes("שכבת ז") || fullSearchText.includes("שכבה ז") || 
    fullSearchText.includes("כיתה ז") || fullSearchText.includes("כיתות ז")
  ) return 'ז';

  if (
    fullSearchText.includes("שכבת-ח") || fullSearchText.includes("שכבה-ח") || 
    fullSearchText.includes("שכבת ח") || fullSearchText.includes("שכבה ח") || 
    fullSearchText.includes("כיתה ח") || fullSearchText.includes("כיתות ח")
  ) return 'ח';

  if (
    fullSearchText.includes("שכבת-ט") || fullSearchText.includes("שכבה-ט") || 
    fullSearchText.includes("שכבת ט") || fullSearchText.includes("שכבה ט") || 
    fullSearchText.includes("כיתה ט") || fullSearchText.includes("כיתות ט")
  ) return 'ט';

  // 3. High school Grade Yod (י) - strictly check single letter 'י' (not יא/יב/Words)
  if (
    fullSearchText.includes("שכבת-י-") || fullSearchText.includes("שכבת-י/") ||
    fullSearchText.includes("שכבה-י-") || fullSearchText.includes("שכבה-י/") ||
    /(שכבת|שכבה|כיתה|כיתות)\s*[-']?\s*י(?![אבגדהוזחטיכלמנסעפצקרשת])/i.test(fullSearchText)
  ) return 'י';

  return null;
};

interface InternalPageViewerProps {
  pageUrl: string;
  onNavigateToPage: (url: string) => void;
  onGoBackHome: () => void;
}

export default function InternalPageViewer({ 
  pageUrl, 
  onNavigateToPage, 
  onGoBackHome 
}: InternalPageViewerProps) {
  // Reactive trigger to force update content instantly when overrides are changed in CMS
  const [updateCounter, setUpdateCounter] = useState(0);
  const [classesOverrides, setClassesOverrides] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const handleUpdate = () => setUpdateCounter(c => c + 1);
    const handleClassesUpdate = () => setClassesOverrides(getGradeClassesOverrides());
    
    handleClassesUpdate();
    window.addEventListener('internal_pages_updated', handleUpdate);
    window.addEventListener('grade_classes_updated', handleClassesUpdate);
    return () => {
      window.removeEventListener('internal_pages_updated', handleUpdate);
      window.removeEventListener('grade_classes_updated', handleClassesUpdate);
    };
  }, []);

  const page = getInternalPage(pageUrl);
  
  let decodedUrl = '';
  try {
    decodedUrl = decodeURIComponent(pageUrl).toLowerCase();
  } catch {
    decodedUrl = pageUrl.toLowerCase();
  }

  const isMainGrade = isGradeMainPage(pageUrl);
  const detectedGrade = (page ? getGradeForPage(pageUrl, page) : null) || getGradeForPage(pageUrl, null);
  const currentGrade = detectedGrade || (
    (decodedUrl.includes('שכבת-יא') || decodedUrl.includes('שכבה-יא') || decodedUrl.includes('שכבת יא')) ? 'יא' :
    (decodedUrl.includes('שכבת-יב') || decodedUrl.includes('שכבה-יב') || decodedUrl.includes('שכבת יב')) ? 'יב' :
    (decodedUrl.includes('שכבת-ז') || decodedUrl.includes('שכבה-ז') || decodedUrl.includes('שכבת ז')) ? 'ז' :
    (decodedUrl.includes('שכבת-ח') || decodedUrl.includes('שכבה-ח') || decodedUrl.includes('שכבת ח')) ? 'ח' :
    (decodedUrl.includes('שכבת-ט') || decodedUrl.includes('שכבה-ט') || decodedUrl.includes('שכבת ט')) ? 'ט' :
    (decodedUrl.includes('שכבת-י') || decodedUrl.includes('שכבה-י') || decodedUrl.includes('שכבת י')) ? 'י' : 'ז'
  );

  const finalPage = page || {
    title: `שכבת ${currentGrade}`,
    subtitle: `דף הבית הרשמי של שכבת ${currentGrade} - שש-שנתי משה ארנס`,
    category: `שכבת ${currentGrade}`,
    content: [`ברוכים הבאים לאתר הרשמי והאינטראקטיבי של שכבת ${currentGrade}. כאן תוכלו למצוא עדכונים שוטפים, דפי מידע, חומרי לימוד וקישורים רלוונטיים עבור תלמידי השכבה והוריהם.`],
    sections: [],
    pdfFiles: []
  };

  // Retrieve overrides to get real-time dynamic additions
  const overrides = getInternalPageOverrides();
  const allPages = { ...INTERNAL_PAGES, ...overrides };

  // Filter sub-pages belonging to this grade
  const subPages = currentGrade ? Object.entries(allPages).filter(([url, p]) => {
    if (isGradeMainPage(url)) return false;
    const g = getGradeForPage(url, p);
    return g === currentGrade;
  }) : [];

  // Find grade level classes (using local storage overrides if available)
  const gradeLevelInfo = currentGrade ? gradesData.find(g => g.grade === currentGrade) : null;
  const defaultClasses = gradeLevelInfo?.classes || [];
  const cleanGradeKey = (currentGrade || 'ז').replace(/'/g, '').trim();
  const gradeClasses = (currentGrade && classesOverrides[cleanGradeKey] !== undefined) 
    ? classesOverrides[cleanGradeKey] 
    : defaultClasses;
  const gradeCoordinator = gradeLevelInfo?.coordinator || 'רכז/ת השכבה';

  // Determine division for this grade
  const isMiddleSchoolGrade = ['ז', 'ח', 'ט'].includes(cleanGradeKey);
  const isHighSchoolGrade = ['י', 'יא', 'יב'].includes(cleanGradeKey);
  
  // Filter only existing majors matching this division
  const allStoredMajors = getStoredMajors();
  const relevantMajors = allStoredMajors.filter(m => {
    if (isMiddleSchoolGrade && m.division === 'middle_school') return true;
    if (isHighSchoolGrade && m.division === 'high_school') return true;
    return false;
  });

  const getMajorIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-school-cyan" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'Laptop': return <Laptop className="w-5 h-5 text-school-cyan" />;
      case 'Medal': return <Medal className="w-5 h-5 text-amber-400" />;
      default: return <Sparkles className="w-5 h-5 text-school-cyan" />;
    }
  };

  const [formInputs, setFormInputs] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState<string | null>(null);

  const handleDownloadFeedback = (fileName: string) => {
    setDownloadedFileName(fileName);
    setTimeout(() => {
      setDownloadedFileName(null);
    }, 4000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormInputs({});
    }, 4000);
  };

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // If this is a main grade page, render the custom high-fidelity "site-within-a-site" sub-site
  if (isMainGrade && currentGrade) {
    return (
      <div className="min-h-screen text-right" dir="rtl">
        {/* HERO SECTION - SUB-SITE BRANDING */}
        <div className="relative overflow-hidden bg-gradient-to-b from-school-bg via-school-panel/60 to-school-bg py-20 px-4 md:px-8 border-b border-school-line/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(34,211,238,0.15),transparent_70%)] pointer-events-none" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-school-cyan/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-school-violet/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto space-y-6 relative z-10">
            {/* Breadcrumbs inside Hero */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-school-muted/80 mb-6 select-none justify-start">
              <button 
                onClick={onGoBackHome}
                className="hover:text-school-cyan transition-colors"
              >
                דף הבית
              </button>
              <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
              <span className="text-school-cyan font-bold">שכבות הגיל</span>
              <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
              <span className="text-school-text font-bold truncate">שכבה {currentGrade}</span>
            </div>

            {/* Custom Slogan Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-school-cyan/10 border border-school-cyan/20 text-xs text-school-cyan font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>אתר השכבה הרשמי</span>
            </div>

            {/* Big Beautiful Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-school-text tracking-tight leading-tight">
              {finalPage.title}
            </h1>

            {/* Glowing line */}
            <div className="w-24 h-1.5 bg-gradient-to-r from-school-cyan to-school-violet rounded-full shadow-[0_0_12px_rgba(34,211,238,0.7)]" />

            {/* Subtitle */}
            {finalPage.subtitle && (
              <p className="text-lg md:text-xl font-bold text-school-cyan/90 max-w-3xl leading-relaxed">
                {finalPage.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* BENTO GRID SUB-SITE LAYOUT */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* RIGHT SIDE: MAIN CONTENT & CLASSES GRID (col-span-8) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* About Column */}
              <div className="bg-school-panel border border-school-line rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.04),transparent_70%)] pointer-events-none" />
                
                <h2 className="text-xl font-extrabold text-school-text flex items-center gap-2.5 pb-3 border-b border-school-line/50">
                  <Compass className="w-5 h-5 text-school-cyan" />
                  <span>על השכבה והחזון הפדגוגי</span>
                </h2>

                <div className="space-y-4 text-sm md:text-base text-school-muted/95 leading-relaxed text-justify">
                  {finalPage.content.map((paragraph, pIdx) => (
                    <p key={pIdx}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Subsections if any */}
                {finalPage.sections && finalPage.sections.length > 0 && (
                  <div className="space-y-6 pt-4">
                    {finalPage.sections.map((sec, sIdx) => (
                      <div 
                        key={sIdx} 
                        className="bg-school-panel2 border border-school-line/40 p-5 md:p-6 rounded-2xl space-y-3"
                      >
                        <h3 className="font-bold text-sm text-school-text flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-school-cyan to-school-violet shrink-0" />
                          {sec.title}
                        </h3>
                        
                        {sec.text && (
                          <div className="text-xs md:text-sm text-school-muted leading-relaxed space-y-2">
                            {Array.isArray(sec.text) ? (
                              sec.text.map((t, idx) => <p key={idx}>{t}</p>)
                            ) : (
                              <p>{sec.text}</p>
                            )}
                          </div>
                        )}

                        {sec.list && sec.list.length > 0 && (
                          <ul className="grid grid-cols-1 gap-2 text-xs md:text-sm text-school-muted pr-4 list-disc marker:text-school-cyan">
                            {sec.list.map((li, lIdx) => (
                              <li key={lIdx} className="leading-relaxed">
                                {li}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Classes & Staff Section */}
              {gradeClasses.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-school-violet animate-pulse" />
                    <h2 className="text-xl font-extrabold text-school-text">כיתות ומסלולי השכבה</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {gradeClasses.map((cls) => (
                      <div 
                        key={cls.id}
                        className="group bg-school-panel hover:bg-school-panel2 border border-school-line/80 hover:border-school-cyan/40 rounded-2xl p-5 transition-all duration-300 relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-24 h-24 bg-[radial-gradient(circle_at_0%_0%,rgba(139,92,246,0.06),transparent_70%)] pointer-events-none" />
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1.5">
                            <h3 className="font-extrabold text-school-text text-base group-hover:text-school-cyan transition-colors">
                              {cls.name}
                            </h3>
                            {cls.specialty && (
                              <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-school-cyan/10 border border-school-cyan/20 text-school-cyan font-bold">
                                {cls.specialty}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grade Majors & Tracks Section - ONLY displays active & existing majors for this specific grade */}
              {relevantMajors.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between pb-1 border-b border-school-line/40">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-school-cyan animate-pulse" />
                      <h2 className="text-xl font-extrabold text-school-text">
                        {isMiddleSchoolGrade ? 'מסלולי ומגמות החטיבה' : 'מגמות החטיבה העליונה'}
                      </h2>
                    </div>
                    <span className="text-xs text-school-muted font-bold">
                      ({relevantMajors.length} מגמות פעילות)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relevantMajors.map((major) => (
                      <div
                        key={major.id}
                        className="bg-school-panel hover:bg-school-panel2 border border-school-line hover:border-school-cyan/50 rounded-2xl p-5 space-y-3 transition-all duration-300 shadow-md group relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-school-cyan/10 flex items-center justify-center border border-school-cyan/20 group-hover:scale-105 transition-transform">
                              {getMajorIcon(major.icon || '')}
                            </div>
                            <h3 className="font-extrabold text-base text-white group-hover:text-school-cyan transition-colors">
                              {major.title}
                            </h3>
                          </div>
                          {major.hoursPerWeek && (
                            <span className="text-[10px] font-bold text-school-cyan bg-school-cyan/10 px-2 py-0.5 rounded-md border border-school-cyan/20 shrink-0">
                              {major.hoursPerWeek}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-school-muted leading-relaxed">
                          {major.shortDescription || major.fullDescription}
                        </p>

                        {major.highlights && major.highlights.length > 0 && (
                          <div className="space-y-1.5 pt-2 border-t border-school-line/40">
                            {major.highlights.slice(0, 3).map((hl, hIdx) => (
                              <div key={hIdx} className="flex items-center gap-2 text-[11px] text-school-muted/90">
                                <span className="w-1.5 h-1.5 rounded-full bg-school-cyan shrink-0" />
                                <span className="line-clamp-1">{hl}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* LEFT SIDE: NAVIGATION, COORDINATOR & PDFS (col-span-4) */}
            <div className="lg:col-span-4 space-y-6">

              {/* Coordinator Card */}
              <div className="bg-gradient-to-br from-school-panel2 to-school-panel border border-school-line rounded-3xl p-6 text-center space-y-3 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[radial-gradient(circle_at_100%_0%,rgba(34,211,238,0.06),transparent_70%)] pointer-events-none" />
                <div className="w-16 h-16 bg-school-cyan/10 rounded-full flex items-center justify-center mx-auto text-school-cyan border border-school-cyan/20 shadow-inner">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-black text-base text-school-text">{gradeCoordinator}</h3>
                </div>
              </div>

              {/* Sub-sites & Info pages */}
              {subPages.length > 0 && (
                <div className="bg-school-panel border border-school-line rounded-3xl p-6 space-y-4 shadow-md">
                  <h3 className="font-extrabold text-xs text-school-cyan uppercase tracking-wider pb-2 border-b border-school-line/50 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-school-cyan shrink-0" />
                    <span>דפי מידע ותתי-אתרים ({subPages.length})</span>
                  </h3>
                  
                  <div className="space-y-2">
                    {subPages.map(([url, p], idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigateToPage(url)}
                        className="w-full text-right flex items-center justify-between p-3.5 rounded-xl border border-school-line bg-school-panel2/40 hover:bg-school-cyan/5 hover:border-school-cyan/40 hover:text-school-cyan text-xs text-school-muted font-bold transition-all group"
                      >
                        <span className="truncate pl-2 group-hover:text-white transition-colors">{p.title}</span>
                        <ArrowRight className="w-4 h-4 shrink-0 -scale-x-100 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PDF Attachments */}
              {finalPage.pdfFiles && finalPage.pdfFiles.length > 0 && (
                <div className="bg-school-panel border border-school-line rounded-3xl p-6 space-y-4 shadow-md">
                  <h3 className="font-extrabold text-xs text-emerald-400 uppercase tracking-wider pb-2 border-b border-school-line/50 flex items-center gap-2">
                    <FileText className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                    <span>קבצי מידע ומסמכי הורדה ({finalPage.pdfFiles.length})</span>
                  </h3>
                  
                  <div className="space-y-2">
                    {finalPage.pdfFiles.map((pdf, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDownloadFeedback(pdf.name)}
                        className="w-full text-right flex items-center justify-between p-3.5 rounded-xl border border-school-line bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/10 hover:border-emerald-500/30 text-xs text-school-muted font-bold transition-all group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Download className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="truncate text-white/90 group-hover:text-emerald-300 transition-colors">{pdf.name}</span>
                        </div>
                        <span className="text-[9px] font-semibold bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full shrink-0">
                          {downloadedFileName === pdf.name ? 'הורד!' : 'PDF'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Utility Panel - Back & Share */}
              <div className="bg-school-panel border border-school-line rounded-3xl p-4 flex gap-2 shadow-sm">
                <button
                  onClick={handleShare}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-school-panel2 border border-school-line hover:border-school-cyan hover:text-school-cyan transition-colors"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <Share2 className="w-4 h-4 shrink-0" />}
                  <span>{copiedLink ? "הועתק!" : "שתף דף"}</span>
                </button>
                <button
                  onClick={onGoBackHome}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-school-cyan text-school-bg hover:bg-cyan-400 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 shrink-0 -scale-x-100" />
                  <span>חזרה לדף הבית</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }

  const [copiedLinkFeedback, setCopiedLinkFeedback] = useState(false); // keep standard view separate if needed


  if (!page) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6 text-right">
        <div className="w-16 h-16 bg-school-violet/10 text-school-violet rounded-full flex items-center justify-center mx-auto">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">הדף מוגדר כעת לשכפול פנימי</h2>
        <p className="text-school-muted text-sm max-w-md mx-auto">
          אנו משכפלים ומעבירים את כל דפי האתר הקיים לתוך העיצוב החדש והמתקדם. בקרוב הדף יהיה זמין במלואו באופן פנימי.
        </p>
        <button 
          onClick={onGoBackHome}
          className="btn px-6 py-2.5 rounded-xl bg-school-cyan text-school-bg font-bold text-xs"
        >
          חזרה לדף הבית
        </button>
      </div>
    );
  }

  // Related pages in the same category to show in sidebar
  const relatedPages = Object.entries(INTERNAL_PAGES).filter(
    ([url, p]) => p.category === page.category && url !== pageUrl
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 text-right">
      
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-school-muted mb-8 select-none">
        <button 
          onClick={onGoBackHome}
          className="hover:text-school-cyan transition-colors"
        >
          דף הבית
        </button>
        <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
        <span className="text-school-muted/80">{page.category}</span>
        <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
        <span className="text-school-text font-bold truncate">{page.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- MAIN PAGE CONTENT --- */}
        <motion.div 
          key={pageUrl}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-8 bg-school-panel border border-school-line rounded-3xl p-6 md:p-10 space-y-8 shadow-xl relative overflow-hidden"
        >
          {/* Subtle decoration */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.08),transparent_70%)] pointer-events-none" />

          {/* Header Title Block */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-school-cyan/5 border border-school-cyan/15 text-[10px] text-school-cyan font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-school-cyan" />
              {page.category}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-school-text tracking-tight leading-tight">
              {page.title}
            </h2>
            {page.subtitle && (
              <p className="text-sm text-school-cyan/95 font-semibold leading-relaxed">
                {page.subtitle}
              </p>
            )}
            
            {/* Quick Utility bar */}
            <div className="flex flex-wrap gap-3 pt-3 text-[11px] text-school-muted border-b border-school-line/50 pb-5">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-1.5 hover:text-white transition-colors bg-school-bg/40 border border-school-line/60 px-3 py-1.5 rounded-lg"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>הדפס דף</span>
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center gap-1.5 hover:text-white transition-colors bg-school-bg/40 border border-school-line/60 px-3 py-1.5 rounded-lg"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "הקישור הועתק!" : "שתף דף"}</span>
              </button>
              <span className="mr-auto self-center opacity-60">עודכן לאחרונה: יולי 2026</span>
            </div>
          </div>

          {/* Core Paragraphs */}
          <div className="space-y-4 text-sm md:text-base text-school-muted/95 leading-relaxed text-justify">
            {page.content.map((paragraph, pIdx) => (
              <p key={pIdx}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Dynamic Extra Sections */}
          {page.sections && page.sections.length > 0 && (
            <div className="space-y-6 pt-4">
              {page.sections.map((sec, sIdx) => (
                <div 
                  key={sIdx} 
                  className="bg-school-panel2 border border-school-line/60 p-5 md:p-6 rounded-2xl space-y-4"
                >
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-school-cyan to-school-violet shrink-0" />
                    {sec.title}
                  </h3>
                  
                  {sec.text && (
                    <div className="text-xs md:text-sm text-school-muted leading-relaxed space-y-2">
                      {Array.isArray(sec.text) ? (
                        sec.text.map((t, idx) => <p key={idx}>{t}</p>)
                      ) : (
                        <p>{sec.text}</p>
                      )}
                    </div>
                  )}

                  {sec.list && sec.list.length > 0 && (
                    <ul className="grid grid-cols-1 gap-2.5 text-xs md:text-sm text-school-muted pr-4 list-disc marker:text-school-cyan">
                      {sec.list.map((li, lIdx) => (
                        <li key={lIdx} className="leading-relaxed">
                          {li}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* PDF Files attachments */}
          {page.pdfFiles && page.pdfFiles.length > 0 && (
            <div className="border-t border-school-line/60 pt-6 mt-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-emerald-500/5 border-r-2 border-emerald-400 p-4 rounded-l-2xl">
                <div className="space-y-0.5">
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <FileText className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
                    <span>קבצים ומסמכי PDF להורדה ישירה ({page.pdfFiles.length})</span>
                  </h3>
                  <p className="text-[11px] text-school-muted">הורדה חופשית ומיידית למכשירך - אין צורך למלא טפסים או לשלוח פנייה למזכירות!</p>
                </div>
                <span className="text-[10px] font-black bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-full self-start sm:self-center border border-emerald-500/20">
                  הורדה חופשית
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {page.pdfFiles.map((file, idx) => (
                  <a
                    key={idx}
                    href={file.url}
                    download={file.name.endsWith('.pdf') ? file.name : `${file.name}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleDownloadFeedback(file.name)}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-school-line bg-[#0c1426]/60 hover:bg-emerald-500/5 hover:border-emerald-500/30 hover:text-emerald-400 transition-all group shadow-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 shrink-0 group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="text-right min-w-0">
                        <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate">{file.name}</p>
                        {file.size && <p className="text-[10px] text-school-muted mt-0.5">{file.size}</p>}
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-school-bg/80 border border-school-line flex items-center justify-center text-school-muted hover:text-white group-hover:border-emerald-500/40 transition-colors shrink-0">
                      <Download className="w-3.5 h-3.5" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Toast Notification for direct instant downloads */}
          {downloadedFileName && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-6 right-6 left-6 sm:left-auto sm:w-96 z-50 bg-[#0a1424] border border-emerald-500/30 shadow-2xl shadow-emerald-950/40 rounded-2xl p-4 flex items-start gap-3 text-right"
              dir="rtl"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <h5 className="text-xs font-extrabold text-white">הקובץ ירד בהצלחה!</h5>
                <p className="text-[11px] text-school-muted truncate leading-relaxed">
                  הקובץ <span className="text-emerald-400 font-bold">"{downloadedFileName}"</span> הורד ישירות למכשירך ללא פנייה למזכירות.
                </p>
              </div>
            </motion.div>
          )}

          {/* Interactive Duplicate Simulated Forms */}
          {page.interactiveFields && page.interactiveFields.length > 0 && (
            <div className="border-t border-school-line/80 pt-8 mt-10 space-y-6">
              <div className="bg-gradient-to-l from-school-cyan/5 to-transparent border-r-2 border-school-cyan p-4 rounded-l-2xl">
                <h4 className="font-bold text-sm text-white">רישום דיגיטלי / הגשת פניות ישירה</h4>
                <p className="text-xs text-school-muted mt-1">מלאו את הפרטים מטה לצורך הורדת קבצים מותאמים אישית או שליחת טפסים למזכירות</p>
              </div>

              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-2"
                >
                  <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <p className="font-extrabold text-emerald-400 text-sm">הפעולה בוצעה בהצלחה!</p>
                  <p className="text-xs text-school-muted">
                    הקובץ המבוקש מוכן להורדה / פנייתך נקלטה במזכירות בית הספר.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="grid grid-cols-1 gap-4">
                  {page.interactiveFields.map((field, fIdx) => (
                    <div key={fIdx} className="space-y-1.5 text-right">
                      <label className="text-xs font-bold text-white">
                        {field.label}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          required
                          value={formInputs[field.label] || ''}
                          onChange={(e) => setFormInputs({ ...formInputs, [field.label]: e.target.value })}
                          className="w-full bg-school-panel2 border border-school-line/60 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-school-cyan"
                        >
                          <option value="">{field.placeholder}</option>
                          {field.options?.map((opt, oIdx) => (
                            <option key={oIdx} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          required
                          rows={3}
                          value={formInputs[field.label] || ''}
                          onChange={(e) => setFormInputs({ ...formInputs, [field.label]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full bg-school-panel2 border border-school-line/60 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-school-cyan"
                        />
                      ) : (
                        <input
                          type="text"
                          required
                          value={formInputs[field.label] || ''}
                          onChange={(e) => setFormInputs({ ...formInputs, [field.label]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full bg-school-panel2 border border-school-line/60 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-school-cyan"
                        />
                      )}
                    </div>
                  ))}

                  <button
                    type="submit"
                    className="mt-2 inline-flex items-center justify-center gap-2 btn py-3 rounded-xl font-bold bg-gradient-to-r from-school-cyan to-cyan-400 text-school-bg shadow-md hover:-translate-y-0.5 transition-all text-xs"
                  >
                    <Send className="w-4 h-4 shrink-0" />
                    <span>שלח פנייה / הורד קבצים מותאמים</span>
                  </button>
                </form>
              )}
            </div>
          )}

        </motion.div>

        {/* --- SIDEBAR RELATED PAGES --- */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Related Links in same category */}
          {relatedPages.length > 0 && (
            <div className="bg-school-panel border border-school-line rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-xs text-school-cyan uppercase tracking-wider">
                עוד ב{page.category}
              </h3>
              <div className="h-px bg-school-line" />
              <div className="space-y-2">
                {relatedPages.map(([url, p], rIdx) => (
                  <button
                    key={rIdx}
                    onClick={() => onNavigateToPage(url)}
                    className="w-full text-right flex items-center justify-between p-3 rounded-xl border border-school-line bg-school-panel2/40 hover:bg-school-cyan/5 hover:border-school-cyan/40 hover:text-school-cyan text-xs text-school-muted font-medium transition-all group"
                  >
                    <span className="truncate pl-2 group-hover:text-white transition-colors">{p.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 -scale-x-100 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Call to action: Contact the school */}
          <div className="bg-gradient-to-br from-[#121c33] to-[#0a1020] border border-school-line rounded-3xl p-6 text-center space-y-4 shadow-md">
            <div className="w-10 h-10 bg-school-cyan/10 rounded-full flex items-center justify-center mx-auto text-school-cyan">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-white">צריכים עזרה או פרטים נוספים?</h4>
              <p className="text-[11px] text-school-muted leading-relaxed">צוות מזכירות הנהלת שש-שנתי ארנס זמין עבורכם לכל שאלה, הכוונה או סיוע ברישום דיגיטלי.</p>
            </div>
            <button 
              onClick={() => onNavigateToPage('contact')} 
              className="w-full btn py-2 rounded-xl text-[11px] font-bold bg-school-panel border border-school-line hover:border-school-cyan text-white hover:text-school-cyan transition-colors"
            >
              פנייה ישירה למזכירות
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
