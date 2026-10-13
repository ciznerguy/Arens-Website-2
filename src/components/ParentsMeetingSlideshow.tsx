import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Maximize2, 
  Minimize2, 
  Download, 
  ExternalLink, 
  FileText, 
  Layers, 
  Grid,
  Check, 
  RefreshCw,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

export const ParentsMeetingSlideshow: React.FC = () => {
  const [viewMode, setViewMode] = useState<'slides' | 'grid'>('slides');
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const TOTAL_SLIDES = 20;
  const PDF_URL = '/asifat-horim-2026.pdf';

  const slideTitles: { [key: number]: string } = {
    1: 'שער המצגת - אסיפת הורים תשפ״ז 2026',
    2: 'חזון בית הספר - חמשת העוגנים הפדגוגיים',
    3: 'אמנת בית הספר לאקלים מיטבי (7 עקרונות)',
    4: 'הדרך שלי בארנס - ציר חמש השנים',
    5: 'שלוש השכבות - י׳, י״א, י״ב',
    6: 'לוח זמנים ומפת הבגרויות - כיתות י׳-י״ב',
    7: 'שכבת י׳ - פתיח',
    8: 'שכבת י׳ - למידה בין תחומית',
    9: 'שכבת י׳ - אכפת לי, מרחב פעולה ומשמעות',
    10: 'שכבת י׳ - חינוך, תכנים ייעוציים ופיננסיים',
    11: 'ערוצי המידע והתקשורת של בית הספר',
    12: 'שכבת י״א - פתיח',
    13: 'שכבת י״א - מיומנויות ואתגרים בחיים',
    14: 'שכבת י״א - לוח זמנים ובגרויות',
    15: 'מרכז ״צומחים לדעת״ - פיתוח לומד עצמאי',
    16: 'ערוצי המידע והתקשורת הבית ספריים',
    17: 'שכבת י״ב - פתיח',
    18: 'שכבת י״ב - מיומנויות ומשאירים חותם',
    19: 'שכבת י״ב - לוח זמנים וסיום בגרויות',
    20: 'ערוצי התקשורת והמידע השוטף'
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev < TOTAL_SLIDES ? prev + 1 : 1));
  };

  const handlePrev = () => {
    setCurrentSlide(prev => (prev > 1 ? prev - 1 : TOTAL_SLIDES));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'slides') return;
      if (e.key === 'ArrowLeft') {
        handleNext();
      } else if (e.key === 'ArrowRight') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  const handleCopyLink = () => {
    const fullUrl = window.location.origin + PDF_URL;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div 
      ref={containerRef}
      className={`rounded-2xl border border-school-line/80 bg-school-panel overflow-hidden shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-[#0a0f1d] p-4 flex flex-col justify-between' : ''
      }`}
    >
      {/* Top Header & Control Bar */}
      <div className="p-4 sm:p-5 border-b border-school-line/60 bg-gradient-to-r from-school-panel2 via-school-panel to-school-panel flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Title & Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileText className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-black text-white">
              מצגת אסיפת הורים תשפ״ז - תיכון משה ארנס
            </h3>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-school-cyan/20 text-school-cyan border border-school-cyan/30">
              קובץ מקורי • 20 שקופיות
            </span>
          </div>
          <p className="text-xs text-school-muted">
            {viewMode === 'slides' 
              ? `שקופית ${currentSlide} מתוך ${TOTAL_SLIDES}: ${slideTitles[currentSlide] || ''}`
              : `גלריית כל ${TOTAL_SLIDES} מסכי המצגת - לחצו על כל מסך כדי לצפות בו בגודל מלא`}
          </p>
        </div>

        {/* Action Controls & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* View Mode Switcher */}
          <div className="inline-flex rounded-xl bg-school-bg/80 p-1 border border-school-line/70">
            <button
              onClick={() => setViewMode('slides')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'slides'
                  ? 'bg-school-cyan text-school-bg shadow-sm'
                  : 'text-school-muted hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>מצגת שקופיות</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-school-cyan text-school-bg shadow-sm'
                  : 'text-school-muted hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>כל המסכים</span>
            </button>
          </div>

          {/* Download PDF Button */}
          <a
            href={PDF_URL}
            download="asifat-horim-2026-mosh-arens.pdf"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600/30 transition-all cursor-pointer shadow-sm"
            title="הורדת קובץ ה-PDF המלא (359 KB) למחשב או לטלפון"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">הורדת PDF</span>
          </a>

          {/* Open in New Window */}
          <a
            href={PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-school-card text-school-muted hover:text-white border border-school-line/60 text-xs font-bold transition-all cursor-pointer"
            title="פתיחת קובץ ה-PDF בלשונית נפרדת"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">לשונית נפרדת</span>
          </a>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-school-card text-school-muted hover:text-white border border-school-line/60 transition-all cursor-pointer"
            title={isFullscreen ? 'יציאה ממסך מלא' : 'מסך מלא'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Display Area */}
      <div className="relative bg-[#0d1527] min-h-[460px] flex flex-col justify-center items-center">
        {viewMode === 'slides' ? (
          /* SLIDE BY SLIDE DISPLAY */
          <div className="w-full flex flex-col items-center justify-between p-3 sm:p-6 space-y-4 flex-1">
            {/* Screen Image Container */}
            <div className="relative w-full max-w-5xl aspect-[16/9] rounded-xl overflow-hidden bg-white shadow-2xl border border-slate-700/50 flex items-center justify-center">
              <img
                src={`/slides/asifat-horim/page-${currentSlide}.png`}
                alt={`מסך מצגת אסיפת הורים שקופית ${currentSlide}`}
                className="w-full h-full object-contain transition-transform duration-200 select-none"
                style={{ transform: `scale(${zoomLevel})` }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />

              {/* Navigation Overlay Buttons */}
              <button
                onClick={handlePrev}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-slate-950/75 hover:bg-slate-950 text-white shadow-xl backdrop-blur-sm transition-all hover:scale-110 cursor-pointer border border-white/20 active:scale-95"
                title="שקופית קודמת (חץ ימינה)"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-slate-950/75 hover:bg-slate-950 text-white shadow-xl backdrop-blur-sm transition-all hover:scale-110 cursor-pointer border border-white/20 active:scale-95"
                title="שקופית הבאה (חץ שמאלה)"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Slide Counter Badge */}
              <div className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-slate-950/80 text-white text-xs font-mono font-bold backdrop-blur-md border border-white/20 shadow-md">
                {currentSlide} / {TOTAL_SLIDES}
              </div>

              {/* Zoom Controls */}
              <div className="absolute bottom-3 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-950/80 text-white text-xs backdrop-blur-md border border-white/20 shadow-md">
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2))}
                  className="p-1 hover:text-school-cyan transition-colors"
                  title="הגדל"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                  className="p-1 hover:text-school-cyan transition-colors"
                  title="הקטן"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                {zoomLevel !== 1 && (
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="p-1 hover:text-school-cyan transition-colors"
                    title="איפוס גודל"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Thumbnail Navigator */}
            <div className="w-full max-w-5xl overflow-x-auto pb-2 pt-1 flex items-center gap-2 scrollbar-thin">
              {Array.from({ length: TOTAL_SLIDES }, (_, i) => i + 1).map((slideNum) => (
                <button
                  key={slideNum}
                  onClick={() => {
                    setCurrentSlide(slideNum);
                    setZoomLevel(1);
                  }}
                  className={`relative shrink-0 w-20 sm:w-24 aspect-[16/9] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    currentSlide === slideNum
                      ? 'border-school-cyan ring-2 ring-school-cyan/40 scale-105'
                      : 'border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-500'
                  }`}
                  title={slideTitles[slideNum] || `שקופית ${slideNum}`}
                >
                  <img
                    src={`/slides/asifat-horim/page-${slideNum}.png`}
                    alt={`שקופית ${slideNum}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-0.5">
                    <span className="text-[10px] font-bold text-white font-mono">{slideNum}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* GRID OF ALL 20 SLIDES */
          <div className="w-full max-w-6xl p-4 sm:p-6 overflow-y-auto max-h-[750px]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: TOTAL_SLIDES }, (_, i) => i + 1).map((slideNum) => (
                <div
                  key={slideNum}
                  onClick={() => {
                    setCurrentSlide(slideNum);
                    setViewMode('slides');
                    setZoomLevel(1);
                  }}
                  className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-xl ${
                    currentSlide === slideNum
                      ? 'border-school-cyan ring-2 ring-school-cyan/50 shadow-lg'
                      : 'border-slate-700/80 hover:border-school-cyan/80 bg-slate-900'
                  }`}
                >
                  <div className="aspect-[16/9] bg-white flex items-center justify-center overflow-hidden">
                    <img
                      src={`/slides/asifat-horim/page-${slideNum}.png`}
                      alt={`שקופית ${slideNum}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-2.5 bg-school-panel2/95 border-t border-school-line/60">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white truncate max-w-[85%]">
                        {slideTitles[slideNum] || `שקופית ${slideNum}`}
                      </span>
                      <span className="text-school-cyan font-mono font-bold text-[10px] shrink-0">
                        #{slideNum}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Bar */}
      <div className="p-3 sm:p-4 bg-school-panel2 border-t border-school-line/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-school-muted">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
          <span>קובץ מקור בשרת: <strong className="text-white">asifat-horim-2026.pdf</strong> (359 KB)</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="hover:text-school-cyan transition-colors flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
            <span>{copied ? 'קישור ה-PDF הועתק!' : 'העתקת קישור ישיר ל-PDF'}</span>
          </button>
          <span>•</span>
          <a
            href={PDF_URL}
            download="asifat-horim-2026-mosh-arens.pdf"
            className="text-school-cyan hover:underline font-bold"
          >
            הורדה ישירה למכשיר
          </a>
        </div>
      </div>
    </div>
  );
};
