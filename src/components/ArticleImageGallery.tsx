import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ZoomIn, 
  Pause, 
  Play, 
  Images, 
  Sparkles 
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
  // Normalize images and cap at 5
  const normalizedImages: GalleryImageItem[] = (images || [])
    .filter(Boolean)
    .slice(0, 5)
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
  const timerRef = useRef<any>(null);

  // Keep currentIndex in bounds
  useEffect(() => {
    if (currentIndex >= normalizedImages.length && normalizedImages.length > 0) {
      setCurrentIndex(0);
    }
  }, [normalizedImages.length, currentIndex]);

  // Auto-slide effect (rotates every 4.5 seconds)
  useEffect(() => {
    if (!isPlaying || isHovered || normalizedImages.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setDirection('next');
      setCurrentIndex(prev => (prev + 1) % normalizedImages.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, normalizedImages.length]);

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
      {/* Main Slideshow Frame */}
      <div className="relative aspect-[16/9] md:aspect-[21/9] w-full bg-[#080d19] border border-school-line/70 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl group select-none">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: direction === 'next' ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 'next' ? -40 : 40 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src={currentItem.url} 
              alt={currentItem.title || currentItem.caption || pageTitle || `תמונה ${currentIndex + 1}`}
              className="w-full h-full object-cover object-center cursor-pointer"
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

        {/* Subtle Dark Gradient Overlay for Title/Caption readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Floating Controls (Top) */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {/* Top Right: Counter & Pause/Play */}
          {isMultiple ? (
            <div className="flex items-center gap-1.5 pointer-events-auto bg-black/60 backdrop-blur-md px-2 py-1 rounded-xl border border-white/10 text-white shadow-md">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 rounded-md hover:bg-white/20 text-school-muted hover:text-white transition-colors cursor-pointer"
                title={isPlaying ? 'השהה החלפה אוטומטית' : 'הפעל החלפה אוטומטית'}
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <span className="text-[10px] text-slate-300 font-mono font-bold px-1">
                {currentIndex + 1} / {normalizedImages.length}
              </span>
            </div>
          ) : <div />}

          {/* Top Left: Zoom Action */}
          {onImageZoom && (
            <button
              type="button"
              onClick={() => onImageZoom(currentItem)}
              className="pointer-events-auto p-2 rounded-xl bg-black/60 hover:bg-school-cyan hover:text-slate-950 text-white backdrop-blur-md transition-all shadow-md cursor-pointer hover:scale-105"
              title="לחץ להגדלת התמונה"
            >
              <ZoomIn className="w-4 h-4" />
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
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-school-cyan hover:text-slate-950 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 shadow-md cursor-pointer hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="התמונה הבאה"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-school-cyan hover:text-slate-950 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 shadow-md cursor-pointer hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Title and Caption at Bottom */}
        {(currentItem.title || currentItem.caption) && (
          <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 text-right pointer-events-none">
            {currentItem.title && (
              <h4 className="text-white font-black text-sm md:text-base drop-shadow-md tracking-tight">
                {currentItem.title}
              </h4>
            )}
            {currentItem.caption && (
              <p className="text-slate-200 text-xs md:text-sm mt-0.5 line-clamp-2 drop-shadow">
                {currentItem.caption}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Thumbnails Strip & Indicators below the main slider */}
      {isMultiple && (
        <div className="flex items-center justify-between gap-2 pt-1 px-1">
          {/* Thumbnail preview buttons */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {normalizedImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`relative w-14 h-10 md:w-16 md:h-11 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  currentIndex === idx
                    ? 'border-school-cyan shadow-md shadow-school-cyan/20 scale-105 opacity-100'
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
    </div>
  );
};
