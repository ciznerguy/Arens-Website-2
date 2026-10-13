import React, { useEffect, useRef, useState } from 'react';

interface BallState {
  text: string;
  className: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isDragging: boolean;
  dragStartX: number;
  dragStartY: number;
}

const DEFAULT_BALL_TEXTS = ["לומד עצמאי", "מרחבי למידה", "דיאלוג"];

export default function FloatingHeroBalls() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ballRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const [ballTexts, setBallTexts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('arens_hero_balls');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_BALL_TEXTS;
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');

  // Sync state with local storage updates
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('arens_hero_balls');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= 3) {
            setBallTexts(parsed);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('hero_balls_updated', handleUpdate);
    window.addEventListener('homepage_settings_updated', handleUpdate);
    return () => {
      window.removeEventListener('hero_balls_updated', handleUpdate);
      window.removeEventListener('homepage_settings_updated', handleUpdate);
    };
  }, []);

  // Keep state mutable in ref to avoid react state update lags in animation loop
  const ballsRef = useRef<BallState[]>([
    {
      text: ballTexts[0] || "לומד עצמאי",
      className: "c1",
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
    },
    {
      text: ballTexts[1] || "מרחבי למידה",
      className: "c2",
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
    },
    {
      text: ballTexts[2] || "דיאלוג",
      className: "c3",
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
    },
  ]);

  // Keep refs in sync when ballTexts change
  useEffect(() => {
    ballsRef.current.forEach((b, i) => {
      if (ballTexts[i]) {
        b.text = ballTexts[i];
      }
    });
  }, [ballTexts]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId: number;
    let W = container.clientWidth || window.innerWidth;
    let H = container.clientHeight || 750;
    let R = Math.max(52, Math.min(88, W * 0.062));

    const handleResize = () => {
      if (!container) return;
      W = container.clientWidth || window.innerWidth;
      H = container.clientHeight || 750;
      R = Math.max(52, Math.min(88, W * 0.062));

      ballsRef.current.forEach((b, i) => {
        // Adjust ball sizes dynamically
        const el = ballRefs[i].current;
        if (el) {
          el.style.width = `${R * 2}px`;
          el.style.height = `${R * 2}px`;
          el.style.fontSize = `${R * 0.27}px`;
        }

        // Initialize positions if first load
        if (!b.x) {
          b.x = W * (0.2 + i * 0.25) + R;
          b.y = H * 0.55;
        }

        // Clip positions inside screen bounds
        b.x = Math.min(Math.max(b.x, R), W - R);
        b.y = Math.min(Math.max(b.y, 90 + R), H - R);
      });
    };

    // Run initial setup
    handleResize();
    window.addEventListener('resize', handleResize);

    // Physics update frame loop
    const step = () => {
      const TOP = 90;
      const balls = ballsRef.current;

      balls.forEach((b, i) => {
        if (!b.isDragging) {
          // Physics movement integration
          b.x += b.vx;
          b.y += b.vy;
          b.vx *= 0.995; // friction
          b.vy *= 0.995;

          // Gentle persistent motion so they don't stop forever
          if (Math.abs(b.vx) < 0.15) b.vx += (Math.random() - 0.5) * 0.06;
          if (Math.abs(b.vy) < 0.15) b.vy += (Math.random() - 0.5) * 0.06;
        }

        // Wall collisions
        if (b.x < R) {
          b.x = R;
          b.vx = Math.abs(b.vx) * 0.8;
        }
        if (b.x > W - R) {
          b.x = W - R;
          b.vx = -Math.abs(b.vx) * 0.8;
        }
        if (b.y < TOP + R) {
          b.y = TOP + R;
          b.vy = Math.abs(b.vy) * 0.8;
        }
        if (b.y > H - R) {
          b.y = H - R;
          b.vy = -Math.abs(b.vy) * 0.8;
        }
      });

      // Ball-to-ball collisions
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const a = balls[i];
          const c = balls[j];
          const dx = c.x - a.x;
          const dy = c.y - a.y;
          const d = Math.hypot(dx, dy) || 0.001;

          if (d < R * 2) {
            const nx = dx / d;
            const ny = dy / d;
            const overlap = (R * 2 - d) / 2;

            // Push them apart gently
            if (!a.isDragging) {
              a.x -= nx * overlap;
              a.y -= ny * overlap;
            }
            if (!c.isDragging) {
              c.x += nx * overlap;
              c.y += ny * overlap;
            }

            // Elastic collisions (velocity swap projection)
            const p = (a.vx - c.vx) * nx + (a.vy - c.vy) * ny;
            if (p > 0) {
              if (!a.isDragging) {
                a.vx -= p * nx;
                a.vy -= p * ny;
              }
              if (!c.isDragging) {
                c.vx += p * nx;
                c.vy += p * ny;
              }
            }
          }
        }
      }

      // Update actual DOM transforms
      balls.forEach((b, i) => {
        const el = ballRefs[i].current;
        if (el) {
          el.style.transform = `translate(${(b.x - R).toFixed(1)}px, ${(b.y - R).toFixed(1)}px)`;
        }
      });

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Pointer drag event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, index: number) => {
    const b = ballsRef.current[index];
    const el = ballRefs[index].current;
    if (!el) return;

    el.setPointerCapture(e.pointerId);
    b.isDragging = true;
    b.dragStartX = e.clientX - b.x;
    b.dragStartY = e.clientY - b.y;
    b.vx = 0;
    b.vy = 0;
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>, index: number) => {
    const b = ballsRef.current[index];
    if (!b.isDragging) return;

    const newX = e.clientX - b.dragStartX;
    const newY = e.clientY - b.dragStartY;

    b.vx = newX - b.x;
    b.vy = newY - b.y;
    b.x = newX;
    b.y = newY;
  };

  const handlePointerUp = (index: number) => {
    const b = ballsRef.current[index];
    b.isDragging = false;
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-30 w-full h-full overflow-hidden pointer-events-none select-none"
    >
      {/* Styles defined here to make the component fully self-contained and accurate */}
      <style>{`
        .pball {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          border-radius: 50%;
          font-weight: 900;
          color: #fff;
          cursor: grab;
          user-select: none;
          -webkit-user-select: none;
          line-height: 1.3;
          padding: 12px;
          will-change: transform;
          transition: box-shadow 0.3s;
          touch-action: none;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          pointer-events: auto;
        }
        .pball:active {
          cursor: grabbing;
        }
        .pball.c1 {
          background: radial-gradient(circle at 32% 26%, rgba(34, 211, 238, 0.4), rgba(10, 16, 30, 0.88) 74%);
          border: 1.5px solid rgba(34, 211, 238, 0.6);
          box-shadow: 0 0 34px rgba(34, 211, 238, 0.3), inset 0 0 26px rgba(34, 211, 238, 0.16);
        }
        .pball.c2 {
          background: radial-gradient(circle at 32% 26%, rgba(129, 140, 248, 0.42), rgba(10, 16, 30, 0.88) 74%);
          border: 1.5px solid rgba(129, 140, 248, 0.6);
          box-shadow: 0 0 34px rgba(129, 140, 248, 0.32), inset 0 0 26px rgba(129, 140, 248, 0.17);
        }
        .pball.c3 {
          background: radial-gradient(circle at 32% 26%, rgba(45, 212, 191, 0.4), rgba(10, 16, 30, 0.88) 74%);
          border: 1.5px solid rgba(45, 212, 191, 0.6);
          box-shadow: 0 0 34px rgba(45, 212, 191, 0.3), inset 0 0 26px rgba(45, 212, 191, 0.16);
        }
        .pball:hover {
          box-shadow: 0 0 55px rgba(34, 211, 238, 0.5), inset 0 0 26px rgba(34, 211, 238, 0.22);
        }
      `}</style>

      {ballsRef.current.map((b, i) => (
        <div
          key={i}
          ref={ballRefs[i]}
          className={`pball ${b.className}`}
          onPointerDown={(e) => handlePointerDown(e, i)}
          onPointerMove={(e) => handlePointerMove(e, i)}
          onPointerUp={() => handlePointerUp(i)}
          onPointerCancel={() => handlePointerUp(i)}
          onDoubleClick={() => {
            const newText = prompt(`ערוך את הטקסט של כדור ${i + 1}:`, b.text);
            if (newText && newText.trim()) {
              const updated = [...ballTexts];
              updated[i] = newText.trim();
              setBallTexts(updated);
              localStorage.setItem('arens_hero_balls', JSON.stringify(updated));
              window.dispatchEvent(new Event('hero_balls_updated'));
            }
          }}
          title="גרור עם העכבר או לחץ פעמיים לעריכת הטקסט"
        >
          <span>{b.text}</span>
        </div>
      ))}

      {/* Touch/Drag interaction tip */}
      <div className="absolute bottom-6 left-6 z-40 text-[12px] text-school-muted flex items-center gap-2 pointer-events-auto bg-slate-900/80 border border-school-cyan/40 px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-school-cyan animate-pulse" />
        <span>✋ ניתן לגרור ולשחק עם כדורי הערכים</span>
      </div>
    </div>
  );
}
