import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Cpu, Info, Terminal } from 'lucide-react';

interface MatrixBannerProps {
  setActiveTab: (tab: string) => void;
}

export default function MatrixBanner({ setActiveTab }: MatrixBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // School slogans and keywords to rain down based on arens.tik-tak.school
    const schoolMessages = [
      'מצוינות',
      'טכנולוגיה',
      'אנושיות',
      'סייבר',
      'רובוטיקה',
      'מדעים',
      'מנהיגות',
      'יזמות',
      'קיימות',
      'חדשנות',
      'ערכים',
      'אקו-ארנס',
      'סייבר_מטריקס',
      'פתח_תקווה',
      'למידה_משמעותית',
      'חקר_מדעי',
      'כיתה_אולימפית',
      'מופת'
    ];

    const hebrewChars = 'אבגדהוזחטיכלמנסעפצקרשת';

    let width = (canvas.width = containerRef.current?.clientWidth || window.innerWidth);
    let height = (canvas.height = 360); // standard height for banner

    const fontSize = 16;
    const columnsCount = Math.floor(width / fontSize) + 1;

    interface DropState {
      y: number;
      speed: number;
      word: string | null;
      wordCharIndex: number;
      delay: number;
      colorType: 'green' | 'gold' | 'blue';
    }

    const drops: DropState[] = Array.from({ length: columnsCount }).map(() => {
      const isWord = Math.random() < 0.12; // Staggered word drops
      const word = isWord ? schoolMessages[Math.floor(Math.random() * schoolMessages.length)] : null;
      const colorType = word 
        ? (word.includes('סייבר') || word.includes('מטריקס') ? 'blue' : word.includes('מצוינות') || word.includes('חדשנות') ? 'gold' : 'green')
        : 'green';

      return {
        y: Math.random() * -80, // Staggered start positions above viewport
        speed: Math.random() * 1.2 + 0.6,
        word,
        wordCharIndex: 0,
        delay: Math.floor(Math.random() * 20),
        colorType
      };
    });

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      width = canvas.width = containerRef.current.clientWidth;
      height = canvas.height = containerRef.current.clientHeight || 360;
    };

    // Use ResizeObserver for perfect responsive container tracking
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const draw = () => {
      // Semi-transparent overlay to keep the beautiful falling stream tail trail
      ctx.fillStyle = 'rgba(2, 6, 23, 0.15)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${fontSize}px "JetBrains Mono", "Courier New", monospace`;
      ctx.textAlign = 'center';

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];

        if (drop.delay > 0) {
          drop.delay--;
          continue;
        }

        const x = i * fontSize;
        const screenY = drop.y * fontSize;

        let char = '';
        let isHighlighted = false;

        if (drop.word) {
          // If we are dropping a word, draw its current letter
          const cleanWord = drop.word.replace(/_/g, ' ');
          char = cleanWord[drop.wordCharIndex] || '';
          isHighlighted = true;

          if (drop.colorType === 'gold') {
            ctx.fillStyle = 'rgba(245, 158, 11, 0.95)'; // Gold
          } else if (drop.colorType === 'blue') {
            ctx.fillStyle = 'rgba(34, 211, 238, 0.95)'; // Cyan
          } else {
            ctx.fillStyle = 'rgba(74, 222, 128, 0.95)'; // Green text
          }
        } else {
          // Draw standard random falling matrix letters
          char = hebrewChars[Math.floor(Math.random() * hebrewChars.length)];
          
          if (Math.random() < 0.04) {
            ctx.fillStyle = '#ffffff'; // Occasional shiny white head
            isHighlighted = true;
          } else {
            ctx.fillStyle = 'rgba(16, 185, 129, 0.38)'; // Normal green stream
          }
        }

        if (isHighlighted) {
          ctx.shadowColor = ctx.fillStyle as string;
          ctx.shadowBlur = 8;
        } else {
          ctx.shadowBlur = 0;
        }

        if (char) {
          ctx.fillText(char, x, screenY);
        }
        ctx.shadowBlur = 0;

        // Move drop vertically
        drop.y += drop.speed;

        if (drop.word) {
          // Speed control for words so they are readable
          if (Math.floor(drop.y) % 2 === 0) {
            drop.wordCharIndex++;
            const cleanWord = drop.word.replace(/_/g, ' ');
            if (drop.wordCharIndex >= cleanWord.length) {
              drop.word = null;
              drop.wordCharIndex = 0;
              drop.y = Math.random() * -10;
              drop.delay = Math.floor(Math.random() * 40 + 20);
            }
          }
        } else {
          // Reset when drop exits the frame
          if (screenY > height) {
            if (Math.random() < 0.08) { // 8% chance to convert to a Hebrew school slogan stream
              drop.word = schoolMessages[Math.floor(Math.random() * schoolMessages.length)];
              drop.wordCharIndex = 0;
              const rand = Math.random();
              drop.colorType = rand < 0.35 ? 'gold' : rand < 0.7 ? 'blue' : 'green';
            }
            drop.y = 0;
            drop.speed = Math.random() * 1.2 + 0.6;
            drop.delay = Math.floor(Math.random() * 25);
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[320px] md:h-[380px] bg-slate-950 overflow-hidden border-b border-emerald-950/50"
    >
      {/* Background Matrix Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 block w-full h-full pointer-events-none opacity-85"
      />

      {/* Retro Horizontal TV Raster lines & Dark vignette shadow gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.1)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

      {/* Cyber Corner HUD elements */}
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-emerald-500/30 pointer-events-none hidden sm:block" />
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-emerald-500/30 pointer-events-none hidden sm:block" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-emerald-500/30 pointer-events-none hidden sm:block" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-emerald-500/30 pointer-events-none hidden sm:block" />

      {/* Overlay contents */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 md:p-12 z-10 max-w-5xl mx-auto space-y-6">
        
        {/* Glowing Active Cyber Matrix Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-2 tracking-wide backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.1)] select-none"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Terminal className="w-3.5 h-3.5" />
          <span className="font-mono">מערכת סייבר מטריקס פעילה • אקו-ארנס 2026</span>
        </motion.div>

        {/* Central main title */}
        <div className="space-y-2 md:space-y-3">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
          >
            בית הספר השש-שנתי ע"ש <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(245,158,11,0.25)]">משה ארנס</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-lg lg:text-xl text-emerald-300 font-bold tracking-wide max-w-3xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          >
            שש שנתי ע"ש משה ארנס פתח תקווה
          </motion.p>
        </div>

        {/* Detailed school overview line */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xs md:text-sm text-slate-300 font-light max-w-2xl leading-relaxed hidden sm:block select-none"
        >
          מרחב חינוכי מתקדם המשלב למידת חקר, פיתוח פרויקטים טכנולוגיים, הגנת סייבר ורובוטיקה, 
          לצד מחויבות חברתית עמוקה ופיתוח מיומנויות המנהיגות של העתיד.
        </motion.p>

        {/* Dynamic Navigation buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 pt-2"
        >
          <button 
            onClick={() => setActiveTab('spaces')}
            className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs md:text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <Cpu className="w-4 h-4 text-slate-950" />
            <span>מרחבי למידה וסייבר</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('about')}
            className="bg-slate-900/85 hover:bg-slate-800 active:scale-95 text-slate-200 hover:text-white border border-slate-700/60 font-extrabold px-5 py-2.5 rounded-xl text-xs md:text-sm transition-all flex items-center gap-2 transform hover:-translate-y-0.5 backdrop-blur-sm"
          >
            <Info className="w-4 h-4 text-slate-300" />
            <span>דבר המנהלת וחזון בית הספר</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
