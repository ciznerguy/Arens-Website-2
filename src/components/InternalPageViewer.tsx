import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Users,
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
  Clock,
  Image as ImageIcon,
  X,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  Footprints,
  HeartHandshake,
  Target,
  ExternalLink,
  Maximize2,
  Eye,
  PhoneCall,
  ShieldCheck,
  Mail
} from 'lucide-react';
import { 
  getInternalPage, 
  INTERNAL_PAGES, 
  InternalPage, 
  getInternalPageOverrides, 
  getGradeClassesOverrides, 
  detectGradeFromKey, 
  GRADE_CANONICAL_KEYS,
  COUNSELOR_CANONICAL_KEYS,
  COUNSELOR_INFO_BY_GRADE,
  isCounselorPage,
  getCounselorMainPage,
  isGradeMainPage,
  getGradeMainPage,
  getGradeBaseDefaultPage
} from '../data/internalPages';
import { JuniorHighCards } from './JuniorHighCards';
import { HighSchoolGradeCards } from './HighSchoolGradeCards';
import { ArticleImageGallery } from './ArticleImageGallery';
import { gradesData } from '../data';
import { allTeachersList } from '../data/teachersList';
import { getHebrewInitials, getAvatarColor } from '../utils/avatarUtils';
import { TeacherAvatar } from './TeacherAvatar';
import { ParentsMeetingSlideshow } from './ParentsMeetingSlideshow';
import { getStoredMajors } from '../services/majorsStorage';
import { SchoolMajor, StaffMember } from '../types';

// Helper to determine what grade a page belongs to
const getGradeForPage = (url: string, page: any): string | null => {
  if (!url && !page) return null;
  const gradeFromUrl = detectGradeFromKey(url);
  if (gradeFromUrl) return gradeFromUrl;
  if (page?.title) {
    const gradeFromTitle = detectGradeFromKey(page.title);
    if (gradeFromTitle) return gradeFromTitle;
  }
  if (page?.category) {
    const gradeFromCat = detectGradeFromKey(page.category);
    if (gradeFromCat) return gradeFromCat;
  }

  let decoded = '';
  try {
    decoded = decodeURIComponent(url || '').toLowerCase();
  } catch {
    decoded = (url || '').toLowerCase();
  }
  const title = (page?.title || '').toLowerCase();
  const subtitle = (page?.subtitle || '').toLowerCase();
  const category = (page?.category || '').toLowerCase();
  
  const fullSearchText = `${decoded} ${title} ${subtitle} ${category}`;

  // 1. High school multi-char grades first (יא, יב)
  if (
    fullSearchText.includes("שכבה-יא") || fullSearchText.includes("שכבת-יא") || 
    fullSearchText.includes("שכבת יא") || fullSearchText.includes("שכבה יא") || 
    fullSearchText.includes("כיתה יא") || fullSearchText.includes("כיתות יא") ||
    fullSearchText.includes("שכבת יא'") || fullSearchText.includes("שכבה יא'")
  ) return 'יא';

  if (
    fullSearchText.includes("שכבה-יב") || fullSearchText.includes("שכבת-יב") || 
    fullSearchText.includes("שכבת יב") || fullSearchText.includes("שכבה יב") || 
    fullSearchText.includes("כיתה יב") || fullSearchText.includes("כיתות יב") ||
    fullSearchText.includes("שכבת יב'") || fullSearchText.includes("שכבה יב'")
  ) return 'יב';

  // 2. Middle school grades: ז, ח, ט (Check BEFORE single letter 'י')
  if (
    fullSearchText.includes("שכבת-ז") || fullSearchText.includes("שכבה-ז") || 
    fullSearchText.includes("שכבת ז") || fullSearchText.includes("שכבה ז") || 
    fullSearchText.includes("כיתה ז") || fullSearchText.includes("כיתות ז") ||
    fullSearchText.includes("שכבת ז'") || fullSearchText.includes("שכבה ז'")
  ) return 'ז';

  if (
    fullSearchText.includes("שכבת-ח") || fullSearchText.includes("שכבה-ח") || 
    fullSearchText.includes("שכבת ח") || fullSearchText.includes("שכבה ח") || 
    fullSearchText.includes("כיתה ח") || fullSearchText.includes("כיתות ח") ||
    fullSearchText.includes("שכבת ח'") || fullSearchText.includes("שכבה ח'")
  ) return 'ח';

  if (
    fullSearchText.includes("שכבת-ט") || fullSearchText.includes("שכבה-ט") || 
    fullSearchText.includes("שכבת ט") || fullSearchText.includes("שכבה ט") || 
    fullSearchText.includes("כיתה ט") || fullSearchText.includes("כיתות ט") ||
    fullSearchText.includes("שכבת ט'") || fullSearchText.includes("שכבה ט'")
  ) return 'ט';

  // 3. High school Grade Yod (י) - strictly check single letter 'י' (not יא/יב/Words)
  if (
    fullSearchText.includes("שכבת-י-") || fullSearchText.includes("שכבת-י/") ||
    fullSearchText.includes("שכבה-י-") || fullSearchText.includes("שכבה-י/") ||
    fullSearchText.includes("שכבת י'") || fullSearchText.includes("שכבה י'") ||
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

  // Directly fetch the latest grade main page when viewing a main grade page
  const liveGradePage = (isMainGrade && currentGrade) ? (getGradeMainPage(currentGrade) || page) : page;

  const finalPage = liveGradePage || {
    title: `שכבת ${currentGrade}`,
    subtitle: `דף הבית הרשמי של שכבת ${currentGrade} - שש-שנתי משה ארנס`,
    category: `שכבת ${currentGrade}`,
    content: [],
    sections: [],
    pdfFiles: []
  };

  // Retrieve overrides to get real-time dynamic additions
  const overrides = getInternalPageOverrides();
  const allPages = { ...INTERNAL_PAGES, ...overrides };

  // Filter sub-pages belonging to this grade (sorted newest to oldest)
  const subPages = currentGrade ? Object.entries(allPages).filter(([url, p]) => {
    if (isGradeMainPage(url)) return false;
    const g = getGradeForPage(url, p);
    if (g === currentGrade) return true;
    if (['ז', 'ח', 'ט'].includes(currentGrade)) {
      if ((p as any)?.divisionScope === 'junior' && ((p as any)?.isJuniorShared || (p as any)?.grades?.includes(currentGrade))) return true;
    }
    if (['י', 'יא', 'יב'].includes(currentGrade)) {
      if (((p as any)?.divisionScope === 'high' || (p as any)?.divisionScope === 'high-school') && ((p as any)?.isHighSchoolShared || (p as any)?.grades?.includes(currentGrade))) return true;
    }
    return false;
  }).sort(([urlA, pA], [urlB, pB]) => {
    // Newest activity/shared page appears first
    if (urlA.includes('grade-9-interpersonal-communication-workshop')) return -1;
    if (urlB.includes('grade-9-interpersonal-communication-workshop')) return 1;
    if (urlA.includes('high-school/rabin')) return -1;
    if (urlB.includes('high-school/rabin')) return 1;
    if (urlA.includes('junior/rabin')) return -1;
    if (urlB.includes('junior/rabin')) return 1;
    if ((pA as any)?.isHighSchoolShared && !(pB as any)?.isHighSchoolShared) return -1;
    if (!(pA as any)?.isHighSchoolShared && (pB as any)?.isHighSchoolShared) return 1;
    if ((pA as any)?.isJuniorShared && !(pB as any)?.isJuniorShared) return -1;
    if (!(pA as any)?.isJuniorShared && (pB as any)?.isJuniorShared) return 1;
    return 0;
  }) : [];

  // Find grade level classes (using local storage overrides if available)
  const cleanGradeKey = (currentGrade || 'ז').replace(/['"״]/g, '').trim();
  const gradeLevelInfo = currentGrade ? gradesData.find(g => g.grade.replace(/['"״]/g, '').trim() === cleanGradeKey) : null;
  const defaultClasses = gradeLevelInfo?.classes || [];
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
  const [downloadedFileInfo, setDownloadedFileInfo] = useState<{ name: string; url: string } | null>(null);
  const [activeImageZoom, setActiveImageZoom] = useState<{ url: string; title?: string; caption?: string } | null>(null);
  const [activePdfPreview, setActivePdfPreview] = useState<{
    url: string;
    name: string;
    size?: string;
    docxUrl?: string;
  } | null>(null);

  const [docPageIdx, setDocPageIdx] = useState<number>(0);
  const [docZoom, setDocZoom] = useState<number>(100);
  const [docViewMode, setDocViewMode] = useState<'sheet' | 'native'>('sheet');

  const openPdfPreview = (pdf: { url: string; name: string; size?: string; docxUrl?: string }) => {
    setDocPageIdx(0);
    setDocZoom(100);
    setDocViewMode('sheet');
    setActivePdfPreview(pdf);
  };

  const getDocPreviewPages = (url: string): string[] => {
    if (!url) return [];
    const filename = url.split('/').pop()?.replace('.pdf', '') || '';
    if (filename === 'choveret-megamot-arens') {
      return [
        '/forms/previews/choveret-megamot-arens-page-1.png',
        '/forms/previews/choveret-megamot-arens-page-2.png'
      ];
    }
    if (filename === 'asifat-horim-2026') {
      return [
        '/forms/previews/asifat-horim-2026-page-1.png',
        '/forms/previews/asifat-horim-2026-page-2.png',
        '/forms/previews/asifat-horim-2026-page-3.png'
      ];
    }
    return [`/forms/previews/${filename}-page-1.png`];
  };

  const handlePrintDocument = (imgUrl: string, title: string) => {
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
          <head>
            <title>${title}</title>
            <style>
              body { margin: 0; padding: 20px; display: flex; justify-content: center; background: #fff; font-family: sans-serif; }
              img { max-width: 100%; height: auto; box-shadow: none; }
              @media print { body { padding: 0; } img { width: 100%; } }
            </style>
          </head>
          <body>
            <img src="${imgUrl}" onload="window.print();" />
          </body>
        </html>
      `);
      printWin.document.close();
    }
  };

  const handleDownloadFeedback = (fileName: string, fileUrl?: string) => {
    setDownloadedFileInfo({ name: fileName, url: fileUrl || '' });
    setTimeout(() => {
      setDownloadedFileInfo(null);
    }, 6000);
  };

  const handleDirectFileDownload = async (fileUrl: string, defaultName: string) => {
    handleDownloadFeedback(defaultName, fileUrl);
    const cleanName = defaultName.endsWith('.pdf') || defaultName.endsWith('.docx') ? defaultName : `${defaultName}.pdf`;

    try {
      // 1. Fetch file as binary Blob to ensure valid local download
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
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
    } catch (err) {
      console.warn('Direct file download fallback to window.open:', err);
      // Fallback: open in new tab so user can save or print directly
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
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

                {(!finalPage.content || finalPage.content.filter(p => p && p.trim()).length === 0) && (!finalPage.sections || finalPage.sections.length === 0) ? (
                  <div className="text-center py-8 px-4 bg-school-panel2/40 border border-dashed border-school-line/60 rounded-2xl space-y-2">
                    <Clock className="w-6 h-6 text-school-cyan/70 mx-auto" />
                    <p className="text-sm font-bold text-school-text">התוכן יעלה בקרוב</p>
                    <p className="text-xs text-school-muted">צוות השכבה מעדכן את המידע והחזון הפדגוגי בימים אלו.</p>
                  </div>
                ) : (
                  <div className="space-y-4 text-sm md:text-base text-school-muted/95 leading-relaxed text-justify">
                    {finalPage.content.filter(p => p && p.trim()).map((paragraph, pIdx) => (
                      <p key={pIdx}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {/* Subsections if any */}
                {finalPage.sections && finalPage.sections.length > 0 && (
                  <div className="space-y-6 pt-4">
                    {finalPage.sections.map((sec: any, sIdx: number) => {
                      const sectionText = sec.content !== undefined ? sec.content : sec.text;
                      const hasText = sectionText && (typeof sectionText === 'string' ? sectionText.trim().length > 0 : Array.isArray(sectionText) ? sectionText.length > 0 : false);
                      const hasList = sec.list && sec.list.length > 0;

                      return (
                        <div 
                          key={sIdx} 
                          className="bg-school-panel2 border border-school-line/40 p-5 md:p-6 rounded-2xl space-y-3"
                        >
                          <h3 className="font-bold text-sm text-school-text flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-school-cyan to-school-violet shrink-0" />
                            {sec.title || 'מידע שכבתי'}
                          </h3>
                          
                          {hasText && (
                            <div className="text-xs md:text-sm text-school-muted leading-relaxed space-y-2">
                              {Array.isArray(sectionText) ? (
                                sectionText.map((t: string, idx: number) => <p key={idx}>{t}</p>)
                              ) : (
                                <p className="whitespace-pre-line">{sectionText}</p>
                              )}
                            </div>
                          )}

                          {hasList && (
                            <ul className="grid grid-cols-1 gap-2 text-xs md:text-sm text-school-muted pr-4 list-disc marker:text-school-cyan">
                              {sec.list.map((li: string, lIdx: number) => (
                                <li key={lIdx} className="leading-relaxed">
                                  {li}
                                </li>
                              ))}
                            </ul>
                          )}

                          {!hasText && !hasList && (
                            <p className="text-xs text-school-muted/70 italic">המידע בסעיף זה יעלה בקרוב</p>
                          )}
                        </div>
                      );
                    })}
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

              {/* Coordinator / Leadership Card */}
              {(() => {
                // Find all matching staff members for this grade
                interface LeaderItem {
                  name: string;
                  role: string;
                  staff?: StaffMember;
                }
                const coordinatorsList: LeaderItem[] = [];

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
                    { role: "אחראית פדגוגית", name: "שילת בדש" },
                    { role: "יועצת השכבה", name: "סמדר קקון" }
                  ]
                };

                const resolvedLeadership = (gradeLevelInfo?.leadership && gradeLevelInfo.leadership.length > 0)
                  ? gradeLevelInfo.leadership
                  : (standardLeadershipByGrade[cleanGradeKey] || null);

                if (resolvedLeadership && resolvedLeadership.length > 0) {
                  resolvedLeadership.forEach(leader => {
                    const match = allTeachersList.find(t => 
                      t.name === leader.name || 
                      t.name.includes(leader.name) || 
                      leader.name.includes(t.name) ||
                      (leader.name.includes('מנור') && t.name.includes('מנור')) ||
                      (leader.name.includes('שטקל') && t.name.includes('שטקל')) ||
                      (leader.name.includes('לבהר') && t.name.includes('לבהר')) ||
                      (leader.name.includes('מדויל') && t.name.includes('מדויל'))
                    );
                    coordinatorsList.push({
                      name: match?.name || leader.name,
                      role: leader.role,
                      staff: match
                    });
                  });
                } else {
                  const names = gradeCoordinator.split(/ ו|&|,/).map(n => n.trim()).filter(Boolean);
                  names.forEach(name => {
                    const match = allTeachersList.find(t => t.name.includes(name) || name.includes(t.name));
                    coordinatorsList.push({
                      name: match?.name || name,
                      role: match?.role || `הנהלת שכבה ${cleanGradeKey}`,
                      staff: match
                    });
                  });
                }

                return (
                  <div className="bg-gradient-to-br from-school-panel2 to-school-panel border border-school-line rounded-3xl p-6 text-center space-y-4 shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_100%_0%,rgba(34,211,238,0.08),transparent_70%)] pointer-events-none" />
                    
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-school-cyan/10 border border-school-cyan/20 text-[10px] font-extrabold text-school-cyan">
                      <span>הנהלת וריכוז שכבה {cleanGradeKey}</span>
                    </div>

                    <div className="space-y-4">
                      {coordinatorsList.map((coord, cIdx) => (
                        <div key={cIdx} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-school-bg/40 border border-school-line/50">
                          {/* Avatar with Hebrew initials or uploaded photo */}
                          <TeacherAvatar
                            name={coord.name}
                            imageUrl={coord.staff?.imageUrl}
                            className="w-16 h-16 rounded-full shadow-sm"
                            textClassName="text-xl font-black"
                            borderClassName="border-2 border-school-cyan/40"
                          />

                          <div className="space-y-0.5">
                            <h3 className="font-black text-sm text-school-text">{coord.name}</h3>
                            <p className="text-[11px] text-school-cyan font-bold">{coord.role || `רכז/ת שכבה ${currentGrade}`}</p>
                            {coord.staff?.email && (
                              <p className="text-[10px] text-school-muted mt-1 select-all hover:text-white transition-colors">{coord.staff.email}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Dedicated Layer Counselor Card */}
              {COUNSELOR_CANONICAL_KEYS[cleanGradeKey] && (
                <div className="bg-gradient-to-br from-[#1b153b] via-school-panel to-school-panel2 border border-purple-500/30 rounded-3xl p-6 text-center space-y-4 shadow-md relative overflow-hidden group hover:border-purple-400/50 transition-all">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_100%_0%,rgba(168,85,247,0.15),transparent_70%)] pointer-events-none" />
                  
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[10px] font-extrabold text-purple-300">
                    <Heart className="w-3 h-3 text-purple-400" />
                    <span>ייעוץ והכוונה שכבתי</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-black text-sm text-school-text group-hover:text-purple-300 transition-colors">
                      {COUNSELOR_INFO_BY_GRADE[cleanGradeKey]?.title || `מרחב יועצת שכבה ${cleanGradeKey}`}
                    </h3>
                    <p className="text-[11px] text-school-muted leading-relaxed line-clamp-2">
                      {COUNSELOR_INFO_BY_GRADE[cleanGradeKey]?.subtitle || 'ליווי רגשי, העצמה אישית, סדנאות כישורי חיים ודלת פתוחה לכל תלמיד והורה'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigateToPage(COUNSELOR_CANONICAL_KEYS[cleanGradeKey])}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 transition-all cursor-pointer shadow-sm group-hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                  >
                    <span>כניסה לדף יועצת שכבה {cleanGradeKey}'</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 -scale-x-100" />
                  </button>
                </div>
              )}

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
                      <div
                        key={idx}
                        className="w-full text-right flex items-center justify-between p-3 rounded-xl border border-school-line bg-[#0c1426]/70 hover:bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/30 text-xs transition-all group"
                      >
                        <button
                          type="button"
                          onClick={() => openPdfPreview(pdf)}
                          className="flex items-center gap-2.5 min-w-0 flex-1 text-right cursor-pointer"
                          title="לחץ לצפייה מקדימה במסמך"
                        >
                          <FileText className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="truncate text-white/90 group-hover:text-emerald-300 transition-colors font-bold text-xs">{pdf.name}</span>
                        </button>

                        <div className="flex items-center gap-1.5 shrink-0 mr-2">
                          <button
                            type="button"
                            onClick={() => openPdfPreview(pdf)}
                            className="p-1.5 rounded-lg bg-school-bg/80 border border-school-line text-school-muted hover:text-white hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all cursor-pointer"
                            title="צפייה מקדימה בטופס"
                          >
                            <Eye className="w-3.5 h-3.5 text-school-cyan" />
                          </button>
                          <a
                            href={pdf.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-school-bg/80 border border-school-line text-school-muted hover:text-white hover:border-school-cyan/40 hover:bg-school-cyan/10 transition-all cursor-pointer"
                            title="פתיחה בלשונית נפרדת"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-school-cyan" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDirectFileDownload(pdf.url, pdf.name)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
                            title="הורדת קובץ PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Utility Panel - Back */}
              <div className="bg-school-panel border border-school-line rounded-3xl p-4 flex gap-2 shadow-sm">
                <button
                  onClick={onGoBackHome}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-school-cyan text-school-bg hover:bg-cyan-400 transition-colors"
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

  // Dedicated Layer Counselor Sub-Site Page Rendering
  const isCounselingPage = isCounselorPage(pageUrl) || pageUrl.includes('counseling');
  if (isCounselingPage && currentGrade) {
    const counselorPageData = getCounselorMainPage(currentGrade) || finalPage;
    const counselorInfo = COUNSELOR_INFO_BY_GRADE[cleanGradeKey];
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
        role: match?.role || `יועצת שכבה ${cleanGradeKey}`
      };
    });

    const mainGradeUrl = GRADE_CANONICAL_KEYS[cleanGradeKey];

    return (
      <div className="min-h-screen text-right" dir="rtl">
        {/* HERO SECTION */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#181133] via-school-panel/80 to-school-bg py-20 px-4 md:px-8 border-b border-purple-500/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(168,85,247,0.2),transparent_70%)] pointer-events-none" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto space-y-6 relative z-10">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-school-muted/80 mb-6 select-none justify-start">
              <button onClick={onGoBackHome} className="hover:text-purple-300 transition-colors">
                דף הבית
              </button>
              <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
              <span>שכבות הגיל</span>
              <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
              {mainGradeUrl ? (
                <button onClick={() => onNavigateToPage(mainGradeUrl)} className="hover:text-school-cyan transition-colors font-bold">
                  שכבה {cleanGradeKey}
                </button>
              ) : (
                <span>שכבה {cleanGradeKey}</span>
              )}
              <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
              <span className="text-purple-300 font-bold truncate">דף יועצת השכבה</span>
            </div>

            {/* Custom Slogan Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs text-purple-300 font-bold">
              <Heart className="w-3.5 h-3.5 text-purple-400" />
              <span>מרחב ייעוץ והכוונה • שש-שנתי משה ארנס</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-school-text tracking-tight leading-tight">
              {counselorPageData.title}
            </h1>

            {/* Glowing line */}
            <div className="w-24 h-1.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.7)]" />

            {/* Subtitle */}
            {counselorPageData.subtitle && (
              <p className="text-lg md:text-xl font-bold text-purple-200/90 max-w-3xl leading-relaxed">
                {counselorPageData.subtitle}
              </p>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-school-line hover:border-purple-400 text-xs font-bold text-white transition-all cursor-pointer shadow-sm"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-purple-400" />}
                <span>{copiedLink ? 'הקישור הועתק!' : 'שתף דף'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-school-line hover:border-purple-400 text-xs font-bold text-white transition-all cursor-pointer shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 text-purple-400" />
                <span>הדפס דף</span>
              </button>

              {mainGradeUrl && (
                <button
                  onClick={() => onNavigateToPage(mainGradeUrl)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-school-cyan/15 border border-school-cyan/30 hover:bg-school-cyan/25 text-xs font-bold text-school-cyan transition-all cursor-pointer shadow-sm mr-auto"
                >
                  <ArrowRight className="w-3.5 h-3.5 -scale-x-100" />
                  <span>מעבר לדף שכבה {cleanGradeKey}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BENTO GRID */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* MAIN CONTENT (col-span-8) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* About / Counselor Message */}
              <div className="bg-school-panel border border-school-line rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-[radial-gradient(circle_at_0%_0%,rgba(168,85,247,0.1),transparent_70%)] pointer-events-none" />
                
                <h2 className="text-xl font-extrabold text-school-text flex items-center gap-2.5 pb-3 border-b border-school-line/50">
                  <Heart className="w-5 h-5 text-purple-400" />
                  <span>דבר יועצת השכבה</span>
                </h2>

                <div className="space-y-4 text-school-muted text-sm md:text-base leading-relaxed">
                  {counselorPageData.content && counselorPageData.content.length > 0 ? (
                    counselorPageData.content.map((pText, idx) => (
                      <p key={idx}>{pText}</p>
                    ))
                  ) : (
                    <p>המרחב הייעוצי נמצא כעת בעריכה ועדכון שוטף.</p>
                  )}
                </div>
              </div>

              {/* Sections / Workshops & Life Skills */}
              {counselorPageData.sections && counselorPageData.sections.length > 0 && (
                <div className="space-y-6">
                  {counselorPageData.sections.map((section, idx) => {
                    const secText = (section as any).content !== undefined ? (section as any).content : section.text;
                    return (
                      <div key={idx} className="bg-school-panel border border-school-line rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
                        <h3 className="text-lg font-black text-school-text flex items-center gap-2.5 pb-2 border-b border-school-line/50">
                          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 shrink-0" />
                          <span>{section.title}</span>
                        </h3>

                        {secText && (
                          <div className="text-school-muted text-sm md:text-base leading-relaxed whitespace-pre-line">
                            {typeof secText === 'string' ? secText : Array.isArray(secText) ? secText.join('\n') : ''}
                          </div>
                        )}

                        {section.list && section.list.length > 0 && (
                          <ul className="grid grid-cols-1 gap-2 text-sm text-school-muted pr-4 list-disc marker:text-purple-400">
                            {section.list.map((item, lIdx) => (
                              <li key={lIdx} className="leading-relaxed">{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Interactive Discrete Contact Box */}
              <div className="bg-gradient-to-br from-[#1b153b]/80 via-school-panel to-school-panel2 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-5 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">טופס פנייה דיסקרטית ליועצת השכבה</h3>
                      <p className="text-xs text-purple-200/70">פנייה אישית ומאובטחת לצוות הייעוץ החינוכי</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold self-start sm:self-auto">
                    שמירה מלאה על פרטיות
                  </span>
                </div>

                {isSubmitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm text-center font-bold space-y-2">
                    <Check className="w-8 h-8 mx-auto text-emerald-400" />
                    <p className="text-base">הפנייה נשלחה בהצלחה ליועצת השכבה!</p>
                    <p className="text-xs text-emerald-200/80 font-normal">ניצור עמך קשר דיסקרטי בהקדם האפשרי. תודה על פנייתך.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-school-muted block mb-1">שם מלא (תלמיד/ה או הורה):</label>
                        <input
                          type="text"
                          required
                          value={formInputs['counselor_name'] || ''}
                          onChange={(e) => setFormInputs(prev => ({ ...prev, counselor_name: e.target.value }))}
                          placeholder="ישראל ישראלי"
                          className="w-full bg-school-bg border border-school-line rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-school-muted/50 focus:border-purple-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-school-muted block mb-1">כיתה (לדוגמה: {cleanGradeKey}1):</label>
                        <input
                          type="text"
                          value={formInputs['counselor_class'] || ''}
                          onChange={(e) => setFormInputs(prev => ({ ...prev, counselor_class: e.target.value }))}
                          placeholder={`כיתה ${cleanGradeKey}2`}
                          className="w-full bg-school-bg border border-school-line rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-school-muted/50 focus:border-purple-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-school-muted block mb-1">טלפון / דוא"ל לחזרה:</label>
                      <input
                        type="text"
                        required
                        value={formInputs['counselor_contact'] || ''}
                        onChange={(e) => setFormInputs(prev => ({ ...prev, counselor_contact: e.target.value }))}
                        placeholder="050-0000000 / yourname@domain.com"
                        className="w-full bg-school-bg border border-school-line rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-school-muted/50 focus:border-purple-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-school-muted block mb-1">תוכן הפנייה / נושא ההתייעצות:</label>
                      <textarea
                        rows={3}
                        required
                        value={formInputs['counselor_message'] || ''}
                        onChange={(e) => setFormInputs(prev => ({ ...prev, counselor_message: e.target.value }))}
                        placeholder="תאר/י בקצרה את הנושא שבו תרצה/י להתייעץ..."
                        className="w-full bg-school-bg border border-school-line rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-school-muted/50 focus:border-purple-400 focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Send className="w-4 h-4" />
                      <span>שליחת פנייה דיסקרטית ליועצת השכבה</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Emergency Hotline Banner */}
              <div className="bg-school-panel border border-school-line rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-school-muted">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-white block text-sm">קווי סיוע ותמיכה רגשית 24/7 בשעת חירום:</span>
                    <span className="text-xs text-school-muted">ער"ן: 1201 | סה"ר (בצ'אט) | מוקד 105 להגנה על ילדים ובני נוער ברשת</span>
                  </div>
                </div>
              </div>

            </div>

            {/* SIDEBAR (col-span-4) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Counselors Profile Card */}
              <div className="bg-gradient-to-br from-[#1b153b] to-school-panel border border-purple-500/40 rounded-3xl p-6 text-center space-y-4 shadow-xl relative overflow-hidden">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] font-extrabold text-purple-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>צוות יועצות שכבה {cleanGradeKey}'</span>
                </div>

                <div className="space-y-4">
                  {resolvedCounselors.map((counselor, cIdx) => (
                    <div key={cIdx} className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-school-bg/60 border border-school-line/60">
                      <TeacherAvatar
                        name={counselor.name}
                        imageUrl={counselor.staff?.imageUrl}
                        className="w-16 h-16 rounded-full shadow-md"
                        textClassName="text-xl font-black"
                        borderClassName="border-2 border-purple-400/50"
                      />
                      <div className="space-y-0.5">
                        <h4 className="font-black text-sm text-school-text">{counselor.name}</h4>
                        <p className="text-[11px] text-purple-300 font-bold">{counselor.role}</p>
                        {counselor.staff?.email && (
                          <a
                            href={`mailto:${counselor.staff.email}`}
                            className="inline-flex items-center gap-1 text-[11px] text-school-muted hover:text-white transition-colors mt-1 select-all"
                          >
                            <Mail className="w-3 h-3 text-purple-400" />
                            <span>{counselor.staff.email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Office hours */}
                <div className="bg-school-bg/70 border border-school-line/60 rounded-2xl p-4 text-right space-y-1.5">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>שעות קבלת קהל ופניות:</span>
                  </span>
                  <p className="text-xs text-school-muted leading-relaxed">
                    מפגשים ושיחות אישיות מתקיימים בתיאום מראש בחדר הייעוץ או באמצעות שליחת הודעה בטופס הדיסקרטי.
                  </p>
                </div>
              </div>

              {/* PDF Documents */}
              {counselorPageData.pdfFiles && counselorPageData.pdfFiles.length > 0 && (
                <div className="bg-school-panel border border-school-line rounded-3xl p-6 space-y-4 shadow-md">
                  <h3 className="font-extrabold text-xs text-emerald-400 uppercase tracking-wider pb-2 border-b border-school-line/50 flex items-center gap-2">
                    <FileText className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                    <span>טפסים ושאלונים להורדה ({counselorPageData.pdfFiles.length})</span>
                  </h3>
                  
                  <div className="space-y-2">
                    {counselorPageData.pdfFiles.map((pdf, idx) => (
                      <div
                        key={idx}
                        className="w-full text-right flex items-center justify-between p-3 rounded-xl border border-school-line bg-[#0c1426]/70 hover:bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/30 text-xs transition-all group"
                      >
                        <button
                          type="button"
                          onClick={() => openPdfPreview(pdf)}
                          className="flex items-center gap-2.5 min-w-0 flex-1 text-right cursor-pointer"
                          title="לחץ לצפייה מקדימה במסמך"
                        >
                          <FileText className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="truncate text-white/90 group-hover:text-emerald-300 transition-colors font-bold text-xs">{pdf.name}</span>
                        </button>

                        <div className="flex items-center gap-1.5 shrink-0 mr-2">
                          <button
                            type="button"
                            onClick={() => openPdfPreview(pdf)}
                            className="p-1.5 rounded-lg bg-school-bg/80 border border-school-line text-school-muted hover:text-white hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all cursor-pointer"
                            title="צפייה מקדימה בטופס"
                          >
                            <Eye className="w-3.5 h-3.5 text-school-cyan" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDirectFileDownload(pdf.url, pdf.name)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
                            title="הורדת קובץ"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Back */}
              <div className="bg-school-panel border border-school-line rounded-3xl p-4 space-y-2 shadow-sm">
                {mainGradeUrl && (
                  <button
                    onClick={() => onNavigateToPage(mainGradeUrl)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4 shrink-0 -scale-x-100" />
                    <span>חזרה לדף שכבה {cleanGradeKey}</span>
                  </button>
                )}
                <button
                  onClick={onGoBackHome}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-school-panel2 border border-school-line text-school-muted hover:text-white transition-colors cursor-pointer"
                >
                  <span>חזרה לדף הבית</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6 text-right">
        <div className="w-16 h-16 bg-school-cyan/10 text-school-cyan rounded-full flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">בקרוב</h2>
        <p className="text-school-muted text-sm max-w-md mx-auto">
          התוכן עבור דף זה נמצא בעריכה ויועלה לאתר בקרוב.
        </p>
        <button 
          onClick={onGoBackHome}
          className="btn px-6 py-2.5 rounded-xl bg-school-cyan text-school-bg font-bold text-xs cursor-pointer hover:bg-cyan-300 transition-colors"
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
              <span className="mr-auto self-center opacity-60">עודכן לאחרונה: יולי 2026</span>
            </div>
          </div>

          {/* Main Hero Image if provided (only if page does not have a gallery) */}
          {page.imageUrl && (!page.images || page.images.length === 0) && (
            <div className="rounded-2xl overflow-hidden border border-school-line shadow-lg bg-school-panel2">
              <img 
                src={page.imageUrl} 
                alt={page.title} 
                className="w-full h-auto max-h-[480px] object-cover object-center hover:scale-[1.01] transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  const currentSrc = target.getAttribute('src');
                  const fallbacks = [
                    '/learning-space.png',
                    '/assets/learning-space.png',
                    '/מרחב למידה.png',
                    '/assets/מרחב למידה.png',
                    '/assets/מרחב-למידה.png',
                    '/מרחב-למידה.png',
                    '/learning-space.jpg',
                    '/assets/learning-space.jpg'
                  ];
                  const nextFallback = fallbacks.find(f => f !== currentSrc && !target.dataset.tried?.includes(f));
                  if (nextFallback) {
                    target.dataset.tried = (target.dataset.tried || '') + ',' + nextFallback;
                    target.src = nextFallback;
                  }
                }}
              />
            </div>
          )}

          {/* Core Paragraphs & Rotating Image Gallery (Displayed right after the first paragraph) */}
          {(() => {
            const validParagraphs = (page.content || []).filter(p => p && p.trim());
            const hasGallery = page.images && page.images.length > 0;
            const firstParagraph = validParagraphs[0];
            const remainingParagraphs = validParagraphs.slice(1);

            if (validParagraphs.length === 0 && (!page.sections || page.sections.length === 0) && !hasGallery) {
              return (
                <div className="text-center py-12 px-6 bg-school-panel2/50 border border-dashed border-school-line/60 rounded-2xl space-y-2">
                  <Clock className="w-8 h-8 text-school-cyan/70 mx-auto" />
                  <h3 className="text-base font-bold text-school-text">בקרוב</h3>
                  <p className="text-xs text-school-muted">מידע מפורט בנושא זה יעודכן ויועלה לאתר בקרוב.</p>
                </div>
              );
            }

            return (
              <div className="space-y-4 text-sm md:text-base text-school-muted/95 leading-relaxed text-justify">
                {/* First paragraph */}
                {firstParagraph && (
                  <p>{firstParagraph}</p>
                )}

                {/* Rotating Gallery (Displayed right after first paragraph) */}
                {hasGallery && (
                  <ArticleImageGallery 
                    images={page.images!} 
                    pageTitle={page.title} 
                    onImageZoom={(img) => setActiveImageZoom(img)} 
                  />
                )}

                {/* Remaining paragraphs */}
                {remainingParagraphs.map((paragraph, pIdx) => (
                  <p key={pIdx}>
                    {paragraph}
                  </p>
                ))}
              </div>
            );
          })()}

          {/* Dedicated Parents Meeting Presentation Slide Deck */}
          {(pageUrl.includes('asifat-horim') || page.title.includes('אסיפת הורים') || pageUrl.includes('אסיפת-הורים') || pageUrl.includes('%d7%90%d7%a1%d7%99%d7%a4%d7%aa-%d7%94%d7%95%d7%a8%d7%99%d7%9d')) && (
            <div className="space-y-4 pt-2">
              <ParentsMeetingSlideshow />
            </div>
          )}

          {/* Dedicated Heyzine / Flipbook Embed Player */}
          {((page as any).flipbookUrl || pageUrl.includes('אורחות-חיים') || pageUrl.includes('%d7%90%d7%95%d7%a8%d7%97%d7%95%d7%aa-%d7%97%d7%99%d7%99%d7%9d')) && (
            <div className="space-y-4 pt-4">
              <div className="bg-gradient-to-r from-school-cyan/15 via-school-panel2 to-school-panel border border-school-cyan/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-school-cyan" />
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {(page as any).flipbookTitle || 'חוברת אורחות החיים הדיגיטלית של ארנס'}
                    </h3>
                  </div>
                  <p className="text-xs text-school-muted">
                    דפדפו בחוברת האינטראקטיבית המלאה, או פתחו אותה לצפייה במסך מלא.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <a
                    href={(page as any).flipbookUrl || "https://heyzine.com/flip-book/1d61aa33cb.html"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-school-cyan text-school-bg font-bold text-xs hover:bg-cyan-300 transition-all shadow-md shadow-school-cyan/20 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>פתיחה במסך מלא</span>
                  </a>
                </div>
              </div>

              {/* Responsive Flipbook Iframe Container */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-school-line/80 shadow-2xl bg-[#0b1329]">
                <div className="w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] min-h-[480px] max-h-[750px]">
                  <iframe
                    src={(page as any).flipbookUrl || "https://heyzine.com/flip-book/1d61aa33cb.html"}
                    title={(page as any).flipbookTitle || "חוברת אורחות החיים"}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Interactive Banner for Newsletter Page */}
          {(page.title.includes('מידעון') || pageUrl.includes('מידעון') || pageUrl.includes('%d7%9e%d7%99%d7%93%d7%a2%d7%95%d7%9f')) && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-school-cyan/15 via-school-panel2 to-school-panel border border-school-cyan/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-right">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-school-cyan" />
                  <span>צפייה במידעון בנגן PDF אינטראקטיבי מלא</span>
                </h3>
                <p className="text-xs text-school-muted">
                  לנוחיותכם, ניתן לדפדף בכל דפי המידעון, להגדיל/להקטין ולהוריד את הקובץ ישירות למכשיר.
                </p>
              </div>
              <button
                onClick={() => onNavigateToPage ? onNavigateToPage('newsletter') : (window.location.hash = 'newsletter')}
                className="px-5 py-2.5 rounded-xl bg-school-cyan text-slate-950 font-bold text-xs hover:bg-cyan-300 transition-all shadow-md shadow-school-cyan/20 whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>פתח נגן מידעון מלא (PDF)</span>
              </button>
            </div>
          )}

          {/* Interactive Banner for Majors Booklet Page */}
          {(page.title.includes('חוברת מגמות') || pageUrl.includes('מגמות') || pageUrl.includes('%d7%9e%d7%92%d7%9e%d7%95%d7%aa')) && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-school-violet/15 via-school-panel2 to-school-panel border border-school-violet/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-right">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-school-violet" />
                  <span>קטלוג 11 המגמות האינטראקטיבי של שש-שנתי ארנס</span>
                </h3>
                <p className="text-xs text-school-muted">
                  לצפייה בפירוט מלא של כל 11 המגמות, נושאי הלימוד, רכזי המגמות ותנאי הקבלה:
                </p>
              </div>
              <button
                onClick={() => onNavigateToPage ? onNavigateToPage('majors') : (window.location.hash = 'majors')}
                className="px-5 py-2.5 rounded-xl bg-school-violet text-white font-bold text-xs hover:bg-violet-600 transition-all shadow-md shadow-school-violet/20 whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>מעבר לקטלוג המגמות המלא</span>
              </button>
            </div>
          )}

          {/* Dedicated Cards Grid for Social Education Junior High (חינוך חברתי חט"ב) */}
          {(pageUrl.includes('חינוך-חברתי-חטב') || pageUrl.includes('%d7%97%d7%99%d7%a0%d7%95%d7%9a-%d7%97%d7%91%d7%a8%d7%aa%d7%99-%d7%97%d7%98%d7%91') || page.title.includes('חינוך חברתי חט')) && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-school-line/50">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-400" />
                  <h3 className="text-lg font-black text-white">כרטיסיות פעילויות וטקסי החינוך החברתי בחט״ב</h3>
                </div>
                <span className="text-xs text-school-cyan font-bold bg-school-cyan/10 px-2.5 py-1 rounded-full border border-school-cyan/20">
                  מוצג מהחדש לישן
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Newest: Grade 9 Interpersonal Communication & Leadership Workshop */}
                <div 
                  onClick={() => onNavigateToPage('course/junior/grade-9-interpersonal-communication-workshop')}
                  className="group rounded-2xl bg-gradient-to-br from-[#101b33] to-[#0d1424] hover:bg-[#142342] border-2 border-purple-500/40 hover:border-purple-400 shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-school-panel2">
                    <img 
                      src="/assets/aistudio/2_a7007af7.jpeg" 
                      alt="סדנת תקשורת בינאישית ומנהיגות בשכבת ט" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101b33] via-transparent to-black/30" />
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md text-purple-400 flex items-center justify-center font-black">
                        <HeartHandshake className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-purple-500/80 backdrop-blur-md text-white border-purple-400 shadow">
                        פעילות חדשה בשכבה ט׳ 🌟
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-black text-base text-white group-hover:text-purple-300 transition-colors">
                        סדנת תקשורת בינאישית ומנהיגות בשכבת ט׳
                      </h4>
                      <p className="text-xs text-purple-300/80 font-medium mt-0.5">
                        חיזוק האקלים הבית-ספרי בהובלת "מן אנד מיינד"
                      </p>
                      <p className="text-xs text-school-muted leading-relaxed mt-2 line-clamp-2">
                        מתודיקה מעשית מעולם התיאטרון והאימפרוביזציה: הקשבה פעילה, שפת גוף ותרבות דיון, יישוב קונפליקטים ומנהיגות חברתית.
                      </p>
                    </div>
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:text-purple-300">
                      <span>כניסה לדף הפעילות המלא (גלריית תמונות)</span>
                      <ArrowRight className="w-4 h-4 -scale-x-100 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* 2. Rabin Memorial Ceremony */}
                <div 
                  onClick={() => onNavigateToPage('course/junior/rabin-memorial-ceremony')}
                  className="group p-5 rounded-2xl bg-gradient-to-br from-[#101b33] to-[#0d1424] hover:bg-[#142342] border-2 border-amber-500/40 hover:border-amber-400 shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                        <Heart className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse">
                        פעילות שיא חדשה 🌟
                      </span>
                    </div>
                    <div>
                      <h4 className="font-black text-base text-white group-hover:text-amber-300 transition-colors">
                        יום הזיכרון ליצחק רבין ז״ל בחטיבת הביניים
                      </h4>
                      <p className="text-xs text-amber-300/80 font-medium mt-0.5">
                        מילים, יוזמות ותקווה בפעולה
                      </p>
                    </div>
                    <p className="text-xs text-school-muted leading-relaxed">
                      טקס בית-ספרי, כרזות סובלנות ב-AI (ז׳), סדנת ציר זמן וענן מילים (ח׳), ויוזמות מנהיגות לתמיכה בלוחמים ובמשפחות המילואים (ט׳).
                    </p>
                  </div>
                  <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
                    <span>כניסה לדף הטקס והפעילות המלא</span>
                    <ArrowRight className="w-4 h-4 -scale-x-100 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 2. Fallen Memorial Project */}
                <div 
                  onClick={() => onNavigateToPage('course/%d7%9e%d7%99%d7%96%d7%9d-%d7%a0%d7%95%d7%a4%d7%9c%d7%99-%d7%94%d7%a2%d7%99%d7%a8-%d7%a4%d7%aa%d7%97-%d7%aa%d7%a7%d7%95%d7%95%d7%94/')}
                  className="group p-5 rounded-2xl bg-[#0b1324] hover:bg-[#101b33] border border-school-line/60 hover:border-rose-400/60 shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                        <Heart className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-rose-500/15 text-rose-300 border-rose-500/30">
                        הנצחה וחיבור קהילתי
                      </span>
                    </div>
                    <div>
                      <h4 className="font-black text-base text-white group-hover:text-rose-300 transition-colors">
                        מיזם נופלי העיר פתח תקווה
                      </h4>
                      <p className="text-xs text-school-muted font-medium mt-0.5">
                        גשר של חיבור, זיכרון ותמיכה במשפחות השכולות
                      </p>
                    </div>
                    <p className="text-xs text-school-muted/80 leading-relaxed">
                      תיבות מכתבים אישיות, הרצאת השראה מרגשת עם משפחת סגן שחר בן-נון ז״ל, ומסורת של מארזי פורים למשפחות.
                    </p>
                  </div>
                  <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-school-cyan group-hover:text-cyan-300">
                    <span>צפייה במיזם המלא</span>
                    <ArrowRight className="w-4 h-4 -scale-x-100 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 3. Community Engagement */}
                <div 
                  onClick={() => onNavigateToPage('course/%D7%97%D7%98%D7%91/%D7%9E%D7%A2%D7%95%D7%A8%D7%91%D7%95%AA-%D7%97%D7%91%D7%A8%D7%AA%D7%99-%D7%97%D7%91%D7%a8%D7%aa%D7%99%D7%aa-2/')}
                  className="group p-5 rounded-2xl bg-[#0b1324] hover:bg-[#101b33] border border-school-line/60 hover:border-pink-400/60 shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-pink-500/15 text-pink-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                        <HeartHandshake className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-pink-500/15 text-pink-300 border-pink-500/30">
                        ערכים ונתינה
                      </span>
                    </div>
                    <div>
                      <h4 className="font-black text-base text-white group-hover:text-pink-300 transition-colors">
                        מעורבות חברתית והתנדבות בחט״ב
                      </h4>
                      <p className="text-xs text-school-muted font-medium mt-0.5">
                        נתינה, התנדבות ומחויבות אישית לקהילה
                      </p>
                    </div>
                    <p className="text-xs text-school-muted/80 leading-relaxed">
                      חונכות לימודית, התנדבות בקהילת פתח תקווה, אקולוגיה וקיימות עירונית בגינת אקו-ארנס.
                    </p>
                  </div>
                  <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-school-cyan group-hover:text-cyan-300">
                    <span>צפייה בתוכנית המעורבות</span>
                    <ArrowRight className="w-4 h-4 -scale-x-100 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 4. Student Council */}
                <div 
                  className="p-5 rounded-2xl bg-[#0b1324] border border-school-line/60 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-black">
                        <Users className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-cyan-500/15 text-cyan-300 border-cyan-500/30">
                        מנהיגות נוער
                      </span>
                    </div>
                    <div>
                      <h4 className="font-black text-base text-white">
                        מועצת התלמידים והובלת יוזמות
                      </h4>
                      <p className="text-xs text-school-muted font-medium mt-0.5">
                        קול התלמידים, אירועי שיא והפסקות פעילות
                      </p>
                    </div>
                    <p className="text-xs text-school-muted/80 leading-relaxed">
                      נציגות כיתתית דמוקרטית, ארגון הפסקות פעילות מוזיקליות, מכירות צדקה ושיפור האקלים החברתי בחטיבה.
                    </p>
                  </div>
                  <div className="pt-4 mt-3 border-t border-white/5 text-[11px] font-bold text-school-muted">
                    <span>פעילות קבועה לאורך שנת הלימודים</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dedicated Cards Grid for All-School Social Education Page (חינוך חברתי וערכי - שש שנתי) */}
          {pageUrl !== 'course/junior/rabin-memorial-ceremony' && pageUrl !== 'course/high-school/rabin-memorial-ceremony' && !pageUrl.includes('חינוך-חברתי-חטב') && !pageUrl.includes('%d7%97%d7%99%d7%a0%d7%95%d7%9a-%d7%97%d7%91%d7%a8%d7%aa%d7%99-%d7%97%d7%98%d7%91') && (pageUrl.includes('חינוך-חברתי') || pageUrl.includes('%d7%97%d7%99%d7%a0%d7%95%d7%9a-%d7%97%d7%91%d7%a8%d7%aa%d7%99') || page.title.includes('חינוך חברתי')) && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-school-line/50">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-400" />
                  <h3 className="text-lg font-black text-white">כרטיסיות פעילויות וטקסי שיא בחינוך החברתי</h3>
                </div>
                <span className="text-xs text-school-cyan font-bold bg-school-cyan/10 px-2.5 py-1 rounded-full border border-school-cyan/20">
                  מוצג מהחדש לישן
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Newest: Grade 9 Interpersonal Communication & Leadership Workshop */}
                <div 
                  onClick={() => onNavigateToPage('course/junior/grade-9-interpersonal-communication-workshop')}
                  className="group rounded-2xl bg-gradient-to-br from-[#101b33] to-[#0d1424] hover:bg-[#142342] border-2 border-purple-500/40 hover:border-purple-400 shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-school-panel2">
                    <img 
                      src="/assets/aistudio/2_a7007af7.jpeg" 
                      alt="סדנת תקשורת בינאישית ומנהיגות בשכבת ט" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101b33] via-transparent to-black/30" />
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md text-purple-400 flex items-center justify-center font-black">
                        <HeartHandshake className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-purple-500/80 backdrop-blur-md text-white border-purple-400 shadow">
                        פעילות חדשה בשכבה ט׳ 🌟
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between text-right">
                    <div>
                      <h4 className="font-black text-base text-white group-hover:text-purple-300 transition-colors">
                        סדנת תקשורת בינאישית ומנהיגות בשכבת ט׳
                      </h4>
                      <p className="text-xs text-purple-300/80 font-medium mt-0.5">
                        חיזוק האקלים הבית-ספרי בהובלת "מן אנד מיינד"
                      </p>
                      <p className="text-xs text-school-muted leading-relaxed mt-2 line-clamp-2">
                        מתודיקה מעשית מעולם התיאטרון והאימפרוביזציה: הקשבה פעילה, שפת גוף ותרבות דיון, יישוב קונפליקטים ומנהיגות חברתית.
                      </p>
                    </div>
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:text-purple-300">
                      <span>כניסה לדף הפעילות המלא (גלריית תמונות)</span>
                      <ArrowRight className="w-4 h-4 -scale-x-100 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* 2. High School Rabin Memorial & Democracy Seminar */}
                <div 
                  onClick={() => onNavigateToPage('course/high-school/rabin-memorial-ceremony')}
                  className="group p-5 rounded-2xl bg-gradient-to-br from-[#101b33] to-[#0d1424] hover:bg-[#142342] border-2 border-amber-500/40 hover:border-amber-400 shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3 text-right">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                        <Award className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse">
                        פעילות שיא חדשה 🌟
                      </span>
                    </div>
                    <div>
                      <h4 className="font-black text-base text-white group-hover:text-amber-300 transition-colors">
                        סמינר דמוקרטיה ויום רבין בתיכון
                      </h4>
                      <p className="text-xs text-amber-300/80 font-medium mt-0.5">
                        אזרחות אקטיבית, מנהיגות ודמוקרטיה בפעולה (שכבות י׳-יב׳)
                      </p>
                    </div>
                    <p className="text-xs text-school-muted leading-relaxed">
                      טקס מרגש, קיר כרזות (י׳), בחירות דמוקרטיות למועצת התלמידים (יא׳), ופרויקט חקר החברה הישראלית וניסוח הצעות חוק (יב׳).
                    </p>
                  </div>
                  <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
                    <span>כניסה לדף הסמינר והטקס המלא</span>
                    <ArrowRight className="w-4 h-4 -scale-x-100 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 2. Junior High Rabin Memorial Ceremony */}
                <div 
                  onClick={() => onNavigateToPage('course/junior/rabin-memorial-ceremony')}
                  className="group p-5 rounded-2xl bg-[#0b1324] hover:bg-[#101b33] border border-school-line/60 hover:border-blue-400/60 shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3 text-right">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                        <Heart className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-blue-500/15 text-blue-300 border-blue-500/30">
                        חטיבת הביניים
                      </span>
                    </div>
                    <div>
                      <h4 className="font-black text-base text-white group-hover:text-blue-300 transition-colors">
                        יום הזיכרון ליצחק רבין בחטיבת הביניים
                      </h4>
                      <p className="text-xs text-school-muted font-medium mt-0.5">
                        מילים, יוזמות ותקווה בפעולה (שכבות ז׳-ט׳)
                      </p>
                    </div>
                    <p className="text-xs text-school-muted/80 leading-relaxed">
                      טקס בית-ספרי, כרזות סובלנות ב-AI (ז׳), סדנת ציר זמן וענן מילים (ח׳), ויוזמות מנהיגות לתמיכה בלוחמים ובמשפחות המילואים (ט׳).
                    </p>
                  </div>
                  <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-school-cyan group-hover:text-cyan-300">
                    <span>צפייה בטקס חט״ב המלא</span>
                    <ArrowRight className="w-4 h-4 -scale-x-100 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 3. Fallen Memorial Project */}
                <div 
                  onClick={() => onNavigateToPage('course/%d7%9e%d7%99%d7%96%d7%9d-%d7%a0%d7%95%d7%a4%d7%9c%d7%99-%d7%94%d7%a2%d7%99%d7%a8-%d7%a4%d7%aa%d7%97-%d7%aa%d7%a7%d7%95%d7%95%d7%94/')}
                  className="group p-5 rounded-2xl bg-[#0b1324] hover:bg-[#101b33] border border-school-line/60 hover:border-rose-400/60 shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3 text-right">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                        <Heart className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-rose-500/15 text-rose-300 border-rose-500/30">
                        הנצחה וחיבור קהילתי
                      </span>
                    </div>
                    <div>
                      <h4 className="font-black text-base text-white group-hover:text-rose-300 transition-colors">
                        מיזם נופלי העיר פתח תקווה
                      </h4>
                      <p className="text-xs text-school-muted font-medium mt-0.5">
                        גשר של חיבור, זיכרון ותמיכה במשפחות השכולות
                      </p>
                    </div>
                    <p className="text-xs text-school-muted/80 leading-relaxed">
                      תיבות מכתבים אישיות, הרצאת השראה מרגשת עם משפחת סגן שחר בן-נון ז״ל, ומסורת של מארזי פורים למשפחות.
                    </p>
                  </div>
                  <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-school-cyan group-hover:text-cyan-300">
                    <span>צפייה במיזם המלא</span>
                    <ArrowRight className="w-4 h-4 -scale-x-100 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 4. Community Engagement */}
                <div 
                  onClick={() => onNavigateToPage('course/%D7%97%D7%98%D7%91/%D7%9E%D7%A2%D7%95%D7%A8%D7%91%D7%95%AA-%D7%97%D7%91%D7%A8%D7%AA%D7%99-%D7%97%D7%91%D7%a8%D7%aa%D7%99%D7%aa-2/')}
                  className="group p-5 rounded-2xl bg-[#0b1324] hover:bg-[#101b33] border border-school-line/60 hover:border-pink-400/60 shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3 text-right">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-pink-500/15 text-pink-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                        <HeartHandshake className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-pink-500/15 text-pink-300 border-pink-500/30">
                        ערכים ונתינה
                      </span>
                    </div>
                    <div>
                      <h4 className="font-black text-base text-white group-hover:text-pink-300 transition-colors">
                        מעורבות חברתית והתנדבות בקהילה
                      </h4>
                      <p className="text-xs text-school-muted font-medium mt-0.5">
                        נתינה, התנדבות ומחויבות אישית לקהילה
                      </p>
                    </div>
                    <p className="text-xs text-school-muted/80 leading-relaxed">
                      חונכות לימודית, התנדבות בקהילת פתח תקווה, אקולוגיה וקיימות עירונית בגינת אקו-ארנס.
                    </p>
                  </div>
                  <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-school-cyan group-hover:text-cyan-300">
                    <span>צפייה בתוכנית המעורבות</span>
                    <ArrowRight className="w-4 h-4 -scale-x-100 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dedicated Hub Blocks for High School Students Portal */}
          {(pageUrl === 'students-high' || pageUrl === 'course/חטע' || pageUrl.includes('%d7%97%d7%98%d7%a2-2') || page.title.includes('לתלמידי חטיבה עליונה') || page.title.includes('חטיבה עליונה')) && (
            <HighSchoolGradeCards onNavigateToPage={onNavigateToPage} />
          )}

          {/* Dynamic Extra Sections */}
          {page.sections && page.sections.length > 0 && (
            <div className="space-y-6 pt-4">
              {page.sections
                .filter((sec: any) => {
                  const t = (sec.title || '').trim();
                  return !t.includes('שכבות הלימוד בחטיבה העליונה') && !t.includes('שכבות הלימוד בחט"ע');
                })
                .map((sec: any, sIdx: number) => {
                const sectionText = sec.content !== undefined ? sec.content : sec.text;
                const hasText = sectionText && (typeof sectionText === 'string' ? sectionText.trim().length > 0 : Array.isArray(sectionText) ? sectionText.length > 0 : false);
                const hasList = sec.list && sec.list.length > 0;

                return (
                  <div 
                    key={sIdx} 
                    className="bg-school-panel2 border border-school-line/60 p-5 md:p-6 rounded-2xl space-y-4"
                  >
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-school-cyan to-school-violet shrink-0" />
                      {sec.title || 'סעיף מידע'}
                    </h3>
                    
                    {hasText && (
                      <div className="text-xs md:text-sm text-school-muted leading-relaxed space-y-2">
                        {Array.isArray(sectionText) ? (
                          sectionText.map((t: string, idx: number) => <p key={idx}>{t}</p>)
                        ) : (
                          <p className="whitespace-pre-line">{sectionText}</p>
                        )}
                      </div>
                    )}

                    {hasList && (
                      <ul className="grid grid-cols-1 gap-2.5 text-xs md:text-sm text-school-muted pr-4 list-disc marker:text-school-cyan">
                        {sec.list.map((li: string, lIdx: number) => (
                          <li key={lIdx} className="leading-relaxed">
                            {li}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Section Images Gallery (e.g. Workshop photos in Grade 9 & Social Education) */}
                    {sec.images && sec.images.length > 0 && (
                      <div className="pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {sec.images.map((img: any, imgIdx: number) => {
                            const imgObj = typeof img === 'string' ? { url: img } : img;
                            return (
                              <div 
                                key={imgIdx} 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveImageZoom(imgObj);
                                }}
                                className="group/img relative rounded-xl overflow-hidden border border-school-line/70 bg-[#080d19] shadow-md cursor-pointer hover:border-school-cyan/70 transition-all hover:scale-[1.01]"
                              >
                                <div className="aspect-[16/10] overflow-hidden bg-black/40">
                                  <img 
                                    src={imgObj.url} 
                                    alt={imgObj.title || imgObj.caption || 'תמונת פעילות'} 
                                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                  />
                                </div>
                                {(imgObj.title || imgObj.caption) && (
                                  <div className="p-3 bg-school-panel/95 border-t border-white/5 text-right flex items-center justify-between gap-2">
                                    <div className="truncate pr-1">
                                      {imgObj.title && <p className="text-xs font-bold text-white truncate">{imgObj.title}</p>}
                                      {imgObj.caption && <p className="text-[11px] text-school-muted truncate mt-0.5">{imgObj.caption}</p>}
                                    </div>
                                    <span className="p-1 px-2 rounded-lg bg-school-cyan/15 text-school-cyan text-[10px] font-bold shrink-0 border border-school-cyan/20">
                                      הגדל 🔍
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {!hasText && !hasList && (!sec.images || sec.images.length === 0) && (
                      <p className="text-xs text-school-muted/70 italic">המידע בסעיף זה יעלה בקרוב</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Dedicated Hub Blocks for Junior Portals */}
          {(pageUrl === 'students-junior' || pageUrl === 'course/חטב' || page.title.includes('חטיבת נעורים') || page.title.includes('לתלמידי חטיבת נעורים')) && (
            <JuniorHighCards onNavigateToPage={onNavigateToPage} />
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
                {page.pdfFiles.map((file, idx) => {
                  const isNewsletter = file.name.includes('מידעון') || file.url.includes('מידעון') || file.url.includes('%d7%9e%d7%99%d7%93%d7%a2%d7%95%d7%9f');
                  
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-school-line bg-[#0c1426]/70 hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all group shadow-sm"
                    >
                      {/* Title & Preview Trigger */}
                      <button
                        type="button"
                        onClick={() => {
                          if (isNewsletter && onNavigateToPage) {
                            onNavigateToPage('newsletter');
                          } else {
                            openPdfPreview(file);
                          }
                        }}
                        className="flex items-center gap-3 min-w-0 flex-1 text-right cursor-pointer"
                        title={isNewsletter ? "לחץ למעבר למידעון המלא" : "לחץ לצפייה מקדימה במסמך"}
                      >
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 group-hover:scale-105 transition-transform">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="text-right min-w-0 flex-1">
                          <p className="text-xs md:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-school-muted mt-0.5 flex items-center gap-1.5">
                            <span>{isNewsletter ? '17 עמודים' : (file.size || 'קובץ PDF')}</span>
                            <span className="text-white/20">•</span>
                            <span className="text-emerald-400/90 font-medium">צפייה או הורדה</span>
                          </p>
                        </div>
                      </button>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 mr-2">
                        {file.docxUrl && (
                          <button
                            type="button"
                            onClick={() => handleDirectFileDownload(file.docxUrl!, `${file.name}.docx`)}
                            className="text-[10px] font-bold bg-blue-500/15 hover:bg-blue-500/30 text-blue-400 px-2 py-1.5 rounded-lg border border-blue-500/30 transition-all cursor-pointer flex items-center gap-1"
                            title="הורדת הטופס בפורמט Word (DOCX) למילוי ממוחשב"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Word</span>
                          </button>
                        )}

                        {!isNewsletter && (
                          <>
                            <button
                              type="button"
                              onClick={() => openPdfPreview(file)}
                              className="w-8 h-8 rounded-lg bg-school-bg/80 border border-school-line flex items-center justify-center text-school-muted hover:text-white hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                              title="צפייה מקדימה במסמך"
                            >
                              <Eye className="w-3.5 h-3.5 text-school-cyan" />
                            </button>

                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg bg-school-bg/80 border border-school-line flex items-center justify-center text-school-muted hover:text-white hover:border-school-cyan/40 hover:bg-school-cyan/10 transition-colors cursor-pointer"
                              title="פתיחה בלשונית נפרדת"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-school-cyan" />
                            </a>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            if (isNewsletter && onNavigateToPage) {
                              e.preventDefault();
                              onNavigateToPage('newsletter');
                            } else {
                              handleDirectFileDownload(file.url, file.name);
                            }
                          }}
                          className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-colors cursor-pointer"
                          title={isNewsletter ? "פתיחת מידעון" : "הורדת קובץ PDF"}
                        >
                          {isNewsletter ? <BookOpen className="w-3.5 h-3.5 text-school-cyan" /> : <Download className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Toast Notification for direct instant downloads */}
          {downloadedFileInfo && (
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
              <div className="space-y-1 min-w-0 flex-1">
                <h5 className="text-xs font-extrabold text-white">הקובץ מוכן להורדה / פתיחה!</h5>
                <p className="text-[11px] text-school-muted truncate leading-relaxed">
                  <span className="text-emerald-400 font-bold">"{downloadedFileInfo.name}"</span>
                </p>
                {downloadedFileInfo.url && (
                  <p className="text-[10px] text-school-muted pt-1 border-t border-school-line/40">
                    לא נפתח אוטומטית?{' '}
                    <a
                      href={downloadedFileInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-school-cyan underline font-bold hover:text-white"
                    >
                      לחץ כאן לפתיחה ישירה
                    </a>
                  </p>
                )}
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

      {/* --- Image Zoom Lightbox Modal --- */}
      <AnimatePresence>
        {activeImageZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImageZoom(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#080d19] border border-school-line rounded-3xl overflow-hidden shadow-2xl flex flex-col cursor-default text-right"
              dir="rtl"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveImageZoom(null)}
                className="absolute top-4 left-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:text-school-cyan hover:bg-black/90 transition-all border border-white/10 cursor-pointer"
                title="סגור"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Image in lightbox */}
              <div className="w-full max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={activeImageZoom.url}
                  alt={activeImageZoom.title || activeImageZoom.caption || 'תמונה בהגדלה'}
                  className="w-full h-full object-contain max-h-[70vh]"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const currentSrc = target.getAttribute('src');
                    const fallbacks = [
                      '/learning-space.png',
                      '/assets/learning-space.png',
                      '/מרחב למידה.png',
                      '/assets/מרחב למידה.png',
                      '/assets/מרחב-למידה.png',
                      '/מרחב-למידה.png',
                      '/learning-space.jpg',
                      '/assets/learning-space.jpg'
                    ];
                    const nextFallback = fallbacks.find(f => f !== currentSrc && !target.dataset.tried?.includes(f));
                    if (nextFallback) {
                      target.dataset.tried = (target.dataset.tried || '') + ',' + nextFallback;
                      target.src = nextFallback;
                    }
                  }}
                />
              </div>

              {/* Caption & Title */}
              {(activeImageZoom.title || activeImageZoom.caption) && (
                <div className="p-5 md:p-6 bg-[#0c1426] border-t border-school-line space-y-1.5">
                  {activeImageZoom.title && (
                    <h4 className="text-base font-extrabold text-white">
                      {activeImageZoom.title}
                    </h4>
                  )}
                  {activeImageZoom.caption && (
                    <p className="text-xs md:text-sm text-school-muted leading-relaxed">
                      {activeImageZoom.caption}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* PDF Document Preview Modal */}
        {activePdfPreview && (() => {
          const previewPages = getDocPreviewPages(activePdfPreview.url);
          const currentImg = previewPages[docPageIdx] || previewPages[0];
          const hasMultiplePages = previewPages.length > 1;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePdfPreview(null)}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 cursor-default"
            >
              <motion.div
                initial={{ scale: 0.93, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.93, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-5xl w-full h-[92vh] bg-[#080d19] border border-school-line rounded-3xl overflow-hidden shadow-2xl flex flex-col text-right"
                dir="rtl"
              >
                {/* Modal Header */}
                <div className="p-3.5 md:px-6 bg-[#0c1426] border-b border-school-line flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm md:text-base font-extrabold text-white truncate">
                        {activePdfPreview.name}
                      </h3>
                      <p className="text-[11px] text-school-muted">
                        {activePdfPreview.size || 'קובץ רשמי'} • בית ספר שש-שנתי משה ארנס
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Print Button */}
                    {currentImg && (
                      <button
                        type="button"
                        onClick={() => handlePrintDocument(currentImg, activePdfPreview.name)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-bold transition-all cursor-pointer"
                        title="הדפסת המסמך ישירות"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">הדפסה</span>
                      </button>
                    )}

                    {/* Download PDF button */}
                    <button
                      type="button"
                      onClick={() => handleDirectFileDownload(activePdfPreview.url, activePdfPreview.name)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all cursor-pointer"
                      title="הורדת קובץ PDF מלא למכשיר"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">הורדת PDF</span>
                    </button>

                    {/* Word version if available */}
                    {activePdfPreview.docxUrl && (
                      <button
                        type="button"
                        onClick={() => handleDirectFileDownload(activePdfPreview.docxUrl!, `${activePdfPreview.name}.docx`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-400 text-xs font-bold transition-all cursor-pointer"
                        title="הורדת גרסת Word למילוי ממוחשב"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">הורדת Word</span>
                      </button>
                    )}

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
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-school-muted hover:text-white transition-all cursor-pointer"
                      title="סגור"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Toolbar for Zoom, Pages & Views */}
                <div className="bg-[#0b1324] px-4 py-2 border-b border-school-line/60 flex items-center justify-between text-xs text-school-muted shrink-0 flex-wrap gap-2">
                  {/* Zoom controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDocZoom(prev => Math.max(50, prev - 15))}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                      title="הקטן תצוגה"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono font-bold text-white/90 min-w-[42px] text-center">
                      {docZoom}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setDocZoom(prev => Math.min(200, prev + 15))}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                      title="הגדל תצוגה"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    {docZoom !== 100 && (
                      <button
                        type="button"
                        onClick={() => setDocZoom(100)}
                        className="text-[10px] text-school-cyan underline hover:text-white mr-1 cursor-pointer"
                      >
                        איפוס
                      </button>
                    )}
                  </div>

                  {/* Multi-page switcher */}
                  {hasMultiplePages && (
                    <div className="flex items-center gap-2 bg-black/30 px-2.5 py-1 rounded-xl border border-school-line/40">
                      <button
                        type="button"
                        disabled={docPageIdx <= 0}
                        onClick={() => setDocPageIdx(prev => Math.max(0, prev - 1))}
                        className="p-1 rounded text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="עמוד קודם"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] font-bold text-emerald-400">
                        עמוד {docPageIdx + 1} מתוך {previewPages.length}
                      </span>
                      <button
                        type="button"
                        disabled={docPageIdx >= previewPages.length - 1}
                        onClick={() => setDocPageIdx(prev => Math.min(previewPages.length - 1, prev + 1))}
                        className="p-1 rounded text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="עמוד הבא"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDocViewMode('sheet')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        docViewMode === 'sheet'
                          ? 'bg-school-cyan/20 text-school-cyan border border-school-cyan/30'
                          : 'bg-white/5 text-school-muted hover:text-white'
                      }`}
                    >
                      תצוגת מסמך
                    </button>
                    <button
                      type="button"
                      onClick={() => setDocViewMode('native')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        docViewMode === 'native'
                          ? 'bg-school-cyan/20 text-school-cyan border border-school-cyan/30'
                          : 'bg-white/5 text-school-muted hover:text-white'
                      }`}
                      title="תצוגת תוסף PDF של הדפדפן (אם נתמך)"
                    >
                      תוסף דפדפן
                    </button>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 w-full bg-[#050914] relative overflow-auto p-4 md:p-8 flex items-start justify-center">
                  {docViewMode === 'sheet' && currentImg ? (
                    <div
                      className="relative transition-transform duration-200 shadow-2xl rounded-xl overflow-hidden bg-white max-w-3xl w-full border border-slate-300"
                      style={{ transform: `scale(${docZoom / 100})`, transformOrigin: 'top center' }}
                    >
                      <img
                        src={currentImg}
                        alt={`${activePdfPreview.name} - עמוד ${docPageIdx + 1}`}
                        className="w-full h-auto block select-none bg-white"
                        onError={() => setDocViewMode('native')}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-slate-900 rounded-xl overflow-hidden">
                      <object
                        data={`${activePdfPreview.url}#toolbar=1&navpanes=0`}
                        type="application/pdf"
                        className="w-full h-full border-none bg-white"
                      >
                        <iframe
                          src={`${activePdfPreview.url}#toolbar=1&navpanes=0`}
                          className="w-full h-full border-none bg-white"
                          title={activePdfPreview.name}
                        />
                      </object>
                    </div>
                  )}
                </div>

                {/* Modal Footer with quick instructions */}
                <div className="p-3 px-6 bg-[#0c1426] border-t border-school-line flex items-center justify-between text-[11px] text-school-muted shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>
                      המסמך מוצג בתצוגה רשמית מלאה. ניתן להדפיס ישירות, להוריד כ-PDF או Word, או לפתוח בכרטיסייה חדשה.
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
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
