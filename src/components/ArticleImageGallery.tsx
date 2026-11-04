import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ZoomIn, 
  Pause, 
  Play, 
  Images, 
  LayoutGrid,
  Sparkles,
  Maximize2
} from 'lucide-react';

export interface GalleryImageItem {
  url: string;
  title?: string;
  caption?: string;
  fileName?: string;
}

interface ArticleImageGalleryProps {
  images: Array<GalleryImageItem | string>;
  pageTitle?: string;
  onImageZoom?: (image: GalleryImageItem) => void;
}

export const ArticleImageGallery: React.FC<ArticleImageGalleryProps> = ({
  images,
  pageTitle,
  onImageZoom
}) => {
  // Normalize images and cap at 10
  const normalizedImages: GalleryImageItem[] = (images || [])
    .filter(Boolean)
    .slice(0, 10)
    .map(item => {
      const rawItem: GalleryImageItem = typeof item === 'string' ? { url: item } : { ...item };
      let cleanUrl = (rawItem.url || '').trim();
      if (cleanUrl.startsWith('public/')) {
        cleanUrl = '/' + cleanUrl.slice(7);
      } else if (!cleanUrl.startsWith('/') && !cleanUrl.startsWith('http') && !cleanUrl.startsWith('data:')) {
        cleanUrl = '/' + cleanUrl;
      }
      return { ...rawItem, url: cleanUrl };
    })
    .filter(item => item.url && item.url.trim().length > 0);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const timerRef = useRef<any>(null);

  // Keep currentIndex in bounds
  useEffect(() => {
    if (currentIndex >= normalizedImages.length && normalizedImages.length > 0) {
      setCurrentIndex(0);
    }
  }, [normalizedImages.length, currentIndex]);

  // Auto-slide effect (rotates every 5 seconds)
  useEffect(() => {
    if (!isPlaying || isHovered || normalizedImages.length <= 1 || viewMode === 'grid') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setDirection('next');
      setCurrentIndex(prev => (prev + 1) % normalizedImages.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, normalizedImages.length, viewMode]);

  if (normalizedImages.length === 0) {
    return null;
  }

  const currentItem = normalizedImages[currentIndex] || normalizedImages[0];
  const isMultiple = normalizedImages.length > 1;

  const handleNext = () => {
    setDirection('next');
    setCurrentIndex(prev => (prev + 1) % normalizedImages.length);
  };

  const handlePrev = () => {
    setDirection('prev');
    setCurrentIndex(prev => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  };

  const handleSelect = (idx: number) => {
    setDirection(idx > currentIndex ? 'next' : 'prev');
    setCurrentIndex(idx);
  };

  return (
    <div 
      className="my-6 space-y-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Header & View Mode Switcher */}
      {isMultiple && (
        <div className="flex items-center justify-between px-1 text-xs">
          <div className="flex items-center gap-1.5 text-school-muted font-bold">
            <Images className="w-3.5 h-3.5 text-school-cyan" />
            <span>גלריית פעילות ({normalizedImages.length} תמונות)</span>
          </div>

          <div className="flex items-center gap-1 bg-school-panel2 border border-school-line/60 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('slider')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'slider' 
                  ? 'bg-school-cyan text-slate-950 shadow-sm' 
                  : 'text-school-muted hover:text-white'
              }`}
            >
              <Images className="w-3 h-3" />
              <span>מצגת תמונות</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'grid' 
                  ? 'bg-school-cyan text-slate-950 shadow-sm' 
                  : 'text-school-muted hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              <span>כל התמונות</span>
            </button>
          </div>
        </div>
      )}

      {/* --- MODE 1: SLIDESHOW FRAME --- */}
      {viewMode === 'slider' && (
        <>
          <div className="relative h-[360px] sm:h-[440px] md:h-[500px] w-full bg-[#050811] border border-school-line/80 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl group select-none flex items-center justify-center p-2 sm:p-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: direction === 'next' ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === 'next' ? -40 : 40 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full flex items-center justify-center p-2 sm:p-4 overflow-hidden"
              >
                {/* Ambient Soft Blurred Background to fill empty aspect space seamlessly */}
                <img 
                  src={currentItem.url} 
                  alt="" 
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-20 scale-125 pointer-events-none"
                />

                {/* Foreground image scaled down properly with object-contain so 100% of the photo is visible without any clipping */}
                <img 
                  src={currentItem.url} 
                  alt={currentItem.title || currentItem.caption || pageTitle || `תמונה ${currentIndex + 1}`}
                  className="relative max-h-full max-w-full h-auto w-auto object-contain mx-auto z-10 cursor-pointer drop-shadow-2xl rounded-xl hover:scale-[1.01] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  onClick={() => onImageZoom && onImageZoom(currentItem)}
                  onError={(e) => {
                    const target = e.currentTarget;
                    const currentSrc = target.getAttribute('src');
                    const fallbacks = [
                      '/learning-space.png',
                      '/assets/learning-space.png',
                      '/מרחב למידה.png',
                      '/assets/מרחב למידה.png'
                    ];
                    const nextFallback = fallbacks.find(f => f !== currentSrc && !target.dataset.tried?.includes(f));
                    if (nextFallback) {
                      target.dataset.tried = (target.dataset.tried || '') + ',' + nextFallback;
                      target.src = nextFallback;
                    }
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Floating Controls (Top) */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-20">
              {/* Top Right: Counter & Pause/Play */}
              {isMultiple ? (
                <div className="flex items-center gap-1.5 pointer-events-auto bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-white shadow-md">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1 rounded-md hover:bg-white/20 text-school-muted hover:text-white transition-colors cursor-pointer"
                    title={isPlaying ? 'השהה החלפה אוטומטית' : 'הפעל החלפה אוטומטית'}
                  >
                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                  <span className="text-[11px] text-slate-300 font-mono font-bold px-1">
                    {currentIndex + 1} / {normalizedImages.length}
                  </span>
                </div>
              ) : <div />}

              {/* Top Left: Zoom Action */}
              {onImageZoom && (
                <button
                  type="button"
                  onClick={() => onImageZoom(currentItem)}
                  className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/70 hover:bg-school-cyan hover:text-slate-950 text-white backdrop-blur-md transition-all shadow-md cursor-pointer hover:scale-105 border border-white/10 text-xs font-bold"
                  title="לחץ להגדלת התמונה במסך מלא"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">הגדל תמונה</span>
                </button>
              )}
            </div>

            {/* Prev / Next Navigation Arrows */}
            {isMultiple && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="התמונה הקודמת"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-school-cyan hover:text-slate-950 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-85 group-hover:opacity-100 shadow-lg cursor-pointer hover:scale-110 active:scale-95 border border-white/10 z-20"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="התמונה הבאה"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-school-cyan hover:text-slate-950 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-85 group-hover:opacity-100 shadow-lg cursor-pointer hover:scale-110 active:scale-95 border border-white/10 z-20"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Clean Dedicated Caption Box below the frame - does NOT obstruct any part of the photo */}
          {(currentItem.title || currentItem.caption) && (
            <div className="bg-[#0b1224] border border-school-line/70 rounded-2xl p-3.5 px-4 text-right shadow-md space-y-1">
              {currentItem.title && (
                <h4 className="text-white font-extrabold text-sm md:text-base flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-school-cyan shrink-0" />
                  <span>{currentItem.title}</span>
                </h4>
              )}
              {currentItem.caption && (
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed pr-4">
                  {currentItem.caption}
                </p>
              )}
            </div>
          )}

          {/* Thumbnails Strip & Indicators below the main slider */}
          {isMultiple && (
            <div className="flex items-center justify-between gap-3 pt-1 px-1">
              {/* Thumbnail preview buttons */}
              <div className="flex items-center gap-2.5 overflow-x-auto py-1">
                {normalizedImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    className={`relative w-16 h-12 md:w-20 md:h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      currentIndex === idx
                        ? 'border-school-cyan shadow-md shadow-school-cyan/30 scale-105 opacity-100 ring-2 ring-school-cyan/20'
                        : 'border-school-line/60 opacity-60 hover:opacity-100 hover:border-school-cyan/40'
                    }`}
                    title={img.title || `תמונה ${idx + 1}`}
                  >
                    <img 
                      src={img.url} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    {currentIndex === idx && (
                      <div className="absolute inset-0 bg-school-cyan/10" />
                    )}
                  </button>
                ))}
              </div>

              {/* Quick Dots / Progress Indicator */}
              <div className="flex items-center gap-1.5 shrink-0">
                {normalizedImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    aria-label={`עבור לתמונה ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx 
                        ? 'w-6 bg-school-cyan' 
                        : 'w-1.5 bg-school-line/60 hover:bg-school-muted/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* --- MODE 2: GRID VIEW (SHOW ALL PHOTOS CLEARLY SIDE BY SIDE) --- */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {normalizedImages.map((item, idx) => (
            <div 
              key={idx}
              className="bg-[#0b1224] border border-school-line/70 hover:border-school-cyan/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
              onClick={() => onImageZoom && onImageZoom(item)}
            >
              {/* Photo Frame */}
              <div className="relative h-64 sm:h-72 w-full bg-[#050811] flex items-center justify-center p-3 overflow-hidden">
                <img 
                  src={item.url} 
                  alt="" 
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-20 scale-125 pointer-events-none"
                />
                <img 
                  src={item.url} 
                  alt={item.title || item.caption || `תמונה ${idx + 1}`}
                  className="relative max-h-full max-w-full h-auto w-auto object-contain z-10 rounded-lg group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 left-2.5 z-20 p-1.5 rounded-lg bg-black/60 text-white group-hover:bg-school-cyan group-hover:text-slate-950 transition-colors">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>

              {/* Caption & Info */}
              {(item.title || item.caption) && (
                <div className="p-3.5 px-4 text-right space-y-1 border-t border-school-line/60 flex-1 flex flex-col justify-center">
                  {item.title && (
                    <h5 className="font-extrabold text-sm text-white group-hover:text-school-cyan transition-colors">
                      {item.title}
                    </h5>
                  )}
                  {item.caption && (
                    <p className="text-xs text-school-muted leading-relaxed line-clamp-3">
                      {item.caption}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
