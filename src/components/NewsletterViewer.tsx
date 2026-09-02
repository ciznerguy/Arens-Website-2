import React, { useState, useRef } from 'react';
import { 
  ArrowRight, 
  FileText, 
  Sparkles, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Printer, 
  Download, 
  Grid, 
  Search, 
  Layout, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Bus, 
  Phone, 
  GraduationCap, 
  Users,
  Loader2,
  Check
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { NEWSLETTER_PAGES } from '../data/newsletterData';
import { NewsletterPageRenderer } from './NewsletterPageRenderer';

interface NewsletterViewerProps {
  onBack: () => void;
}

export const NewsletterViewer: React.FC<NewsletterViewerProps> = ({ onBack }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'single' | 'grid' | 'all'>('single');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenPrintContainerRef = useRef<HTMLDivElement>(null);

  const totalPages = NEWSLETTER_PAGES.length;

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      setDownloadSuccess(false);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const printableElements = hiddenPrintContainerRef.current?.querySelectorAll<HTMLElement>('.pdf-page-item');
      
      if (printableElements && printableElements.length > 0) {
        for (let i = 0; i < printableElements.length; i++) {
          const el = printableElements[i];
          const canvas = await html2canvas(el, {
            scale: 1.5,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.9);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();

          if (i > 0) {
            pdf.addPage();
          }

          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        }

        pdf.save('מידעון_תשפז_שש_שנתי_משה_ארנס.pdf');
      } else {
        window.print();
      }

      setIsGeneratingPdf(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setIsGeneratingPdf(false);
      window.print();
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 15, 150));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 15, 75));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Filter pages if search query is provided
  const filteredPages = searchQuery.trim() === '' 
    ? NEWSLETTER_PAGES 
    : NEWSLETTER_PAGES.filter(p => 
        p.title.includes(searchQuery) || 
        p.summary.includes(searchQuery) ||
        p.category.includes(searchQuery)
      );

  const activePageData = NEWSLETTER_PAGES.find(p => p.pageNumber === currentPage) || NEWSLETTER_PAGES[0];

  const quickJumpTopics = [
    { page: 1, label: 'שער', icon: FileText },
    { page: 3, label: 'דבר המנהלת', icon: Sparkles },
    { page: 5, label: 'דבר מנהל חט״ב', icon: BookOpen },
    { page: 6, label: 'אמנת האקלים', icon: CheckCircle2 },
    { page: 7, label: 'הנהלה', icon: Phone },
    { page: 8, label: 'רכזי מגמות', icon: GraduationCap },
    { page: 11, label: 'לוח חופשות', icon: Calendar },
    { page: 13, label: 'לוח צלצולים', icon: Clock },
    { page: 14, label: 'מחנכים', icon: Users },
    { page: 16, label: 'הסעות ותחב״צ', icon: Bus },
    { page: 17, label: 'אסיפות הורים', icon: Calendar },
  ];

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-school-bg py-8 px-4 sm:px-6 lg:px-8 text-school-text select-text"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Breadcrumb / Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-school-line/60">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-school-panel2 border border-school-line text-xs font-bold text-school-text hover:text-school-cyan hover:border-school-cyan/40 transition-all group shadow-sm"
          >
            <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>חזרה לדף הבית</span>
          </button>

          {/* Download & Print Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-school-cyan to-cyan-400 text-slate-950 font-black text-xs hover:brightness-110 transition-all shadow-md shadow-school-cyan/20 cursor-pointer disabled:opacity-50"
              title="הורדת קובץ המידעון המלא (PDF)"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>מכין קובץ PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>הקובץ הורד בהצלחה!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>הורדת המידעון (PDF)</span>
                </>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-school-panel border border-school-line text-xs font-bold text-school-text hover:text-school-cyan transition-all shadow-sm cursor-pointer"
              title="הדפסת עמודי המידעון"
            >
              <Printer className="w-4 h-4 text-school-cyan" />
              <span>הדפסה</span>
            </button>
          </div>
        </div>

        {/* Hidden Container for high-res PDF export */}
        <div 
          ref={hiddenPrintContainerRef} 
          style={{ position: 'fixed', left: '-9999px', top: '-9999px', opacity: 0, pointerEvents: 'none' }}
        >
          {NEWSLETTER_PAGES.map((pageItem) => (
            <div key={pageItem.pageNumber} className="pdf-page-item" style={{ width: '794px', minHeight: '1123px', backgroundColor: '#ffffff', color: '#000000', margin: 0, padding: 0 }}>
              <NewsletterPageRenderer page={pageItem} />
            </div>
          ))}
        </div>

        {/* Branded Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-school-panel2 via-school-panel to-school-panel2 border border-school-line p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-school-cyan/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-school-violet/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10 space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-school-cyan/15 border border-school-cyan/30 text-school-cyan text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>שש-שנתי ע״ש משה ארנס • שנת הלימודים תשפ״ז 2026-2027</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-school-text tracking-tight">
              מידעון תשפ״ז
            </h1>

            <div className="space-y-1.5 text-xs sm:text-sm text-school-muted">
              <p className="font-bold text-school-text text-sm sm:text-base">במידעון תמצאו:</p>
              <ul className="space-y-1 text-school-muted pr-2">
                <li>• בעלי תפקידים ודרכי התקשרות עימם</li>
                <li>• לוח חופשות</li>
                <li>• לוח שיעורים</li>
                <li>• לו”ז הסעות – איסוף ופיזור</li>
                <li>• מועדי אסיפות הורים</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Jump Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-school-muted px-1">
            <span>מעבר מהיר לעמודי המידעון:</span>
            <span>17 עמודים</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {quickJumpTopics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentPage(topic.page);
                  setViewMode('single');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 ${
                  currentPage === topic.page && viewMode === 'single'
                    ? 'bg-school-cyan text-slate-950 shadow-md shadow-school-cyan/20'
                    : 'bg-school-panel border border-school-line text-school-muted hover:text-school-text hover:border-school-cyan/40'
                }`}
              >
                <topic.icon className="w-3.5 h-3.5" />
                <span>{topic.label}</span>
                <span className="text-[10px] opacity-75">({topic.page})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Viewer Controls Header */}
        <div className="rounded-2xl border border-school-line bg-school-panel p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
          {/* View Modes & Search */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <div className="flex items-center p-1 bg-school-bg rounded-xl border border-school-line">
              <button
                onClick={() => setViewMode('single')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'single' ? 'bg-school-cyan text-slate-950' : 'text-school-muted hover:text-school-text'
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                <span>עמוד בודד</span>
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'grid' ? 'bg-school-cyan text-slate-950' : 'text-school-muted hover:text-school-text'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>רשת עמודים</span>
              </button>

              <button
                onClick={() => setViewMode('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'all' ? 'bg-school-cyan text-slate-950' : 'text-school-muted hover:text-school-text'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>גלילה מלאה</span>
              </button>
            </div>

            {/* Quick Filter Search */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="חיפוש נושא או מילה במידעון..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 pl-3 pr-8 py-1.5 rounded-xl bg-school-bg border border-school-line text-xs text-school-text focus:outline-none focus:border-school-cyan"
              />
              <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-school-muted" />
            </div>
          </div>

          {/* Pager & Zoom Controls */}
          <div className="flex items-center gap-3">
            {viewMode === 'single' && (
              <div className="flex items-center gap-1 bg-school-bg px-2 py-1 rounded-xl border border-school-line">
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="p-1 rounded-lg hover:bg-school-panel text-school-text disabled:opacity-30"
                  title="עמוד הבא"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1 px-2 text-xs font-bold text-school-text">
                  <select
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="bg-transparent text-school-cyan font-black border-none focus:outline-none cursor-pointer"
                  >
                    {NEWSLETTER_PAGES.map((p) => (
                      <option key={p.pageNumber} value={p.pageNumber} className="bg-slate-900 text-white">
                        עמוד {p.pageNumber} - {p.title}
                      </option>
                    ))}
                  </select>
                  <span className="text-school-muted">/ {totalPages}</span>
                </div>

                <button
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className="p-1 rounded-lg hover:bg-school-panel text-school-text disabled:opacity-30"
                  title="עמוד קודם"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Zoom Controls */}
            {viewMode === 'single' && (
              <div className="hidden sm:flex items-center gap-1 bg-school-bg px-2 py-1 rounded-xl border border-school-line">
                <button
                  onClick={handleZoomOut}
                  className="p-1 rounded-lg hover:bg-school-panel text-school-muted hover:text-school-text"
                  title="הקטנה"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono font-bold text-school-text w-9 text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-1 rounded-lg hover:bg-school-panel text-school-muted hover:text-school-text"
                  title="הגדלה"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-school-bg border border-school-line text-school-muted hover:text-school-cyan transition-colors"
              title="מסך מלא"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Viewer Workspace */}
        <div className="rounded-3xl border border-school-line bg-slate-950/40 p-4 sm:p-8 flex flex-col items-center justify-center min-h-[600px] shadow-2xl overflow-auto">
          
          {/* SINGLE PAGE MODE */}
          {viewMode === 'single' && (
            <div 
              className="transition-transform duration-200 flex justify-center w-full"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              <NewsletterPageRenderer page={activePageData} />
            </div>
          )}

          {/* GRID MODE */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
              {filteredPages.map((p) => (
                <div 
                  key={p.pageNumber}
                  onClick={() => {
                    setCurrentPage(p.pageNumber);
                    setViewMode('single');
                  }}
                  className={`group cursor-pointer rounded-2xl border p-2 transition-all space-y-2 bg-school-panel ${
                    currentPage === p.pageNumber
                      ? 'border-school-cyan ring-2 ring-school-cyan/30'
                      : 'border-school-line hover:border-school-cyan/50 hover:shadow-lg'
                  }`}
                >
                  <div className="aspect-[1/1.414] bg-white rounded-xl overflow-hidden pointer-events-none scale-100 origin-top flex items-start justify-center p-1">
                    <div className="transform scale-[0.35] sm:scale-[0.28] origin-top">
                      <NewsletterPageRenderer page={p} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-2 pt-1 text-xs">
                    <span className="font-bold text-school-text truncate group-hover:text-school-cyan">{p.title}</span>
                    <span className="text-[10px] font-mono text-school-muted">#{p.pageNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ALL PAGES SCROLL MODE */}
          {viewMode === 'all' && (
            <div className="space-y-10 w-full flex flex-col items-center">
              {filteredPages.map((p) => (
                <div key={p.pageNumber} className="w-full flex flex-col items-center space-y-2">
                  <div className="w-full max-w-[760px] flex items-center justify-between text-xs font-bold text-school-muted px-2">
                    <span>עמוד {p.pageNumber} - {p.title}</span>
                    <span className="text-[10px] bg-school-panel px-2.5 py-0.5 rounded-full border border-school-line">{p.category}</span>
                  </div>
                  <NewsletterPageRenderer page={p} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Carousel Bar at Bottom */}
        <div className="rounded-2xl bg-school-panel border border-school-line p-4 space-y-3 shadow-md">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-school-text">רצועת עמודים מהירה:</span>
            <span className="text-school-muted font-normal">לחץ על עמוד לתצוגה מוגדלת</span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {NEWSLETTER_PAGES.map((p) => (
              <button
                key={p.pageNumber}
                onClick={() => {
                  setCurrentPage(p.pageNumber);
                  setViewMode('single');
                }}
                className={`relative shrink-0 rounded-xl overflow-hidden border p-1 transition-all text-right ${
                  currentPage === p.pageNumber && viewMode === 'single'
                    ? 'border-school-cyan ring-2 ring-school-cyan bg-school-cyan/10'
                    : 'border-school-line hover:border-school-cyan/40 bg-school-bg'
                }`}
              >
                <div className="w-16 h-22 bg-white rounded-lg flex items-center justify-center overflow-hidden pointer-events-none">
                  <div className="transform scale-[0.09] origin-center">
                    <NewsletterPageRenderer page={p} />
                  </div>
                </div>
                <div className="mt-1 text-[10px] font-black text-center text-school-text">
                  עמ׳ {p.pageNumber}
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default NewsletterViewer;
