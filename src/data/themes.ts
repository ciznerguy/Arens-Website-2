export interface ThemeColors {
  "school-bg": string;
  "school-panel": string;
  "school-panel2": string;
  "school-cyan": string;
  "school-violet": string;
  "school-text": string;
  "school-muted": string;
  "school-line": string;
}

export interface SiteTheme {
  id: string;
  name: string;
  icon: string;
  desc: string;
  colors: ThemeColors;
}

export const SITE_THEMES: SiteTheme[] = [
  {
    id: "cosmic-dark",
    name: "קוסמי אפל",
    icon: "🌌",
    desc: "מראה אפור-גרפיט בהיר, נעים וקריא במיוחד",
    colors: {
      "school-bg": "#434e62",
      "school-panel": "#505d74",
      "school-panel2": "#5d6c86",
      "school-cyan": "#22d3ee",
      "school-violet": "#818cf8",
      "school-text": "#f8fafc",
      "school-muted": "#cbd5e1",
      "school-line": "rgba(255, 255, 255, 0.22)"
    }
  },
  {
    id: "royal-gold",
    name: "זהב מלכותי",
    icon: "👑",
    desc: "רקע כהה מהודר עם נגיעות זהב ואמבר יוקרתי",
    colors: {
      "school-bg": "#0b0f19",
      "school-panel": "#111827",
      "school-panel2": "#1f2937",
      "school-cyan": "#fbbf24",
      "school-violet": "#f59e0b",
      "school-text": "#f9fafb",
      "school-muted": "#9ca3af",
      "school-line": "rgba(251, 191, 36, 0.12)"
    }
  },
  {
    id: "emerald-eco",
    name: "אזמרגד ירוק",
    icon: "🌱",
    desc: "מוטיב אקולוגי וטבע רענן עם צבעי אזמרגד ומנטה",
    colors: {
      "school-bg": "#060f0e",
      "school-panel": "#0d1f1c",
      "school-panel2": "#132f2b",
      "school-cyan": "#10b981",
      "school-violet": "#34d399",
      "school-text": "#f0fdf4",
      "school-muted": "#86efac",
      "school-line": "rgba(16, 185, 129, 0.12)"
    }
  },
  {
    id: "cyberpunk-neon",
    name: "אולטרה סייבר",
    icon: "⚡",
    desc: "שילוב נועז ותוסס של ורוד פוקסיה וורוד ניאון",
    colors: {
      "school-bg": "#0f051d",
      "school-panel": "#1a0b36",
      "school-panel2": "#281452",
      "school-cyan": "#f43f5e",
      "school-violet": "#d946ef",
      "school-text": "#fdf2f8",
      "school-muted": "#f472b6",
      "school-line": "rgba(217, 70, 239, 0.15)"
    }
  },
  {
    id: "classic-light",
    name: "בהיר קלאסי",
    icon: "☀️",
    desc: "רקע בהיר ונקי למראה אקדמי מסורתי ומכובד",
    colors: {
      "school-bg": "#f8fafc",
      "school-panel": "#ffffff",
      "school-panel2": "#f1f5f9",
      "school-cyan": "#0284c7",
      "school-violet": "#4f46e5",
      "school-text": "#0f172a",
      "school-muted": "#475569",
      "school-line": "rgba(15, 23, 42, 0.08)"
    }
  }
];

export interface DesignTrend {
  id: string;
  name: string;
  trendName: string;
  icon: string;
  desc: string;
  colors: ThemeColors;
}

export const DESIGN_TRENDS: DesignTrend[] = [
  // SET 1 (Index 0-3)
  {
    id: "trend-glassmorphism",
    name: "גלסמורפיזם סלייט",
    trendName: "Glassmorphism",
    icon: "💎",
    desc: "שקיפויות רכות בסגנון זכוכית כהה, שילוב כחול סלייט וטורקיז",
    colors: {
      "school-bg": "#060b13",
      "school-panel": "#0b1325",
      "school-panel2": "#111d35",
      "school-cyan": "#06b6d4",
      "school-violet": "#6366f1",
      "school-text": "#f8fafc",
      "school-muted": "#94a3b8",
      "school-line": "rgba(6, 182, 212, 0.15)"
    }
  },
  {
    id: "trend-nordic",
    name: "נורדי מינימליסטי",
    trendName: "Nordic Minimalist",
    icon: "🪵",
    desc: "סגנון סקנדינבי חמים ונקי, רקע שנהב עדין עם דגשים בגוון ירוק זית",
    colors: {
      "school-bg": "#fcfbfa",
      "school-panel": "#ffffff",
      "school-panel2": "#f5f4f0",
      "school-cyan": "#3f6212",
      "school-violet": "#1e293b",
      "school-text": "#1c1917",
      "school-muted": "#78716c",
      "school-line": "rgba(63, 98, 18, 0.08)"
    }
  },
  {
    id: "trend-neo-brutalism",
    name: "נאו-ברוטליזם מודרני",
    trendName: "Neo-Brutalism",
    icon: "⚡",
    desc: "עיצוב נועז ומלא אנרגיה, שילוב של סגול ניאון, צהוב עז וקונטרסט גבוה",
    colors: {
      "school-bg": "#0f0f15",
      "school-panel": "#161622",
      "school-panel2": "#242436",
      "school-cyan": "#facc15",
      "school-violet": "#a855f7",
      "school-text": "#ffffff",
      "school-muted": "#a1a1aa",
      "school-line": "rgba(168, 85, 247, 0.16)"
    }
  },
  {
    id: "trend-sunset",
    name: "שקיעה חמימה",
    trendName: "Warm Sunset",
    icon: "🌅",
    desc: "רקע שוקולד-פחם חמים ועשיר עם נגיעות של כתום שקיעה וורוד אש",
    colors: {
      "school-bg": "#0d0706",
      "school-panel": "#160e0c",
      "school-panel2": "#221614",
      "school-cyan": "#ea580c",
      "school-violet": "#f43f5e",
      "school-text": "#fff7ed",
      "school-muted": "#fdba74",
      "school-line": "rgba(234, 88, 12, 0.14)"
    }
  },

  // SET 2 (Index 4-7)
  {
    id: "trend-terminal",
    name: "רטרו טרמינל",
    trendName: "Retro Dev Code",
    icon: "📟",
    desc: "נוסטלגיה של מסכי קוד ירוקים, רקע ירוק-שחור עם כיתוב מנטה ואמבר",
    colors: {
      "school-bg": "#050806",
      "school-panel": "#090e0b",
      "school-panel2": "#111a14",
      "school-cyan": "#10b981",
      "school-violet": "#f59e0b",
      "school-text": "#e6f4ea",
      "school-muted": "#a7f3d0",
      "school-line": "rgba(16, 185, 129, 0.12)"
    }
  },
  {
    id: "trend-emerald",
    name: "יער אזמרגד",
    trendName: "Emerald Forest",
    icon: "🌲",
    desc: "מוטיב ירוק מרגיע ואלגנטי, רקע בהיר ומרענן עם דגשים של ירוק עד",
    colors: {
      "school-bg": "#f0fdf4",
      "school-panel": "#ffffff",
      "school-panel2": "#dcfce7",
      "school-cyan": "#15803d",
      "school-violet": "#16a34a",
      "school-text": "#14532d",
      "school-muted": "#166534",
      "school-line": "rgba(21, 128, 61, 0.08)"
    }
  },
  {
    id: "trend-amethyst",
    name: "אמטיסט מלכותי",
    trendName: "Royal Amethyst",
    icon: "🔮",
    desc: "צבעי סגול-עמוק עשירים, רקע שזיף מסתורי ונגיעות לילך ואינדיגו",
    colors: {
      "school-bg": "#0b0716",
      "school-panel": "#120c24",
      "school-panel2": "#1d143a",
      "school-cyan": "#c084fc",
      "school-violet": "#e9d5ff",
      "school-text": "#f5f3ff",
      "school-muted": "#d8b4fe",
      "school-line": "rgba(192, 132, 252, 0.15)"
    }
  },
  {
    id: "trend-steel",
    name: "סילבר הייטק",
    trendName: "Steel & Silver Tech",
    icon: "🛡️",
    desc: "רקע פלדה קרה מתכתי עם כרום, אפורים נקיים וסגול-כחלחל עתידני",
    colors: {
      "school-bg": "#0b0f14",
      "school-panel": "#131922",
      "school-panel2": "#1e2633",
      "school-cyan": "#38bdf8",
      "school-violet": "#94a3b8",
      "school-text": "#f8fafc",
      "school-muted": "#cbd5e1",
      "school-line": "rgba(56, 189, 248, 0.12)"
    }
  },

  // SET 3 (Index 8-11)
  {
    id: "trend-ocean",
    name: "אוקיינוס עמוק",
    trendName: "Deep Ocean",
    icon: "🌊",
    desc: "רקע כחול ימי עמוק עם פאנלים מרווחים, ונגיעות סייבר-טורקיז זוהר",
    colors: {
      "school-bg": "#030712",
      "school-panel": "#080f25",
      "school-panel2": "#0f1a3e",
      "school-cyan": "#00f2fe",
      "school-violet": "#4facfe",
      "school-text": "#e0f2fe",
      "school-muted": "#bae6fd",
      "school-line": "rgba(0, 242, 254, 0.14)"
    }
  },
  {
    id: "trend-sakura",
    name: "פריחת הדובדבן",
    trendName: "Sakura Blossom",
    icon: "🌸",
    desc: "שילוב גוונים בהירים של ורוד פסטל וסאקורה עם רקע ורדרד מרגיע ונעים",
    colors: {
      "school-bg": "#fff5f5",
      "school-panel": "#ffffff",
      "school-panel2": "#ffe3e3",
      "school-cyan": "#db2777",
      "school-violet": "#f472b6",
      "school-text": "#5c0632",
      "school-muted": "#9d174d",
      "school-line": "rgba(219, 39, 119, 0.08)"
    }
  },
  {
    id: "trend-indigo",
    name: "אינדיגו קלאסי",
    trendName: "Classic Indigo",
    icon: "🧿",
    desc: "עיצוב הייטק וקורפורייט סמכותי, צבעי אינדיגו עמוקים ומקצועיים",
    colors: {
      "school-bg": "#070b19",
      "school-panel": "#0f142c",
      "school-panel2": "#192045",
      "school-cyan": "#3b82f6",
      "school-violet": "#6366f1",
      "school-text": "#f1f5f9",
      "school-muted": "#a5b4fc",
      "school-line": "rgba(99, 102, 241, 0.14)"
    }
  },
  {
    id: "trend-sepia",
    name: "נוסטלגיה ספיה",
    trendName: "Vintage Sepia",
    icon: "📜",
    desc: "רקע נייר עתיק ונעים לעין, צבעי שמנת עדינים עם נגיעות חום טרקוטה",
    colors: {
      "school-bg": "#faf7f2",
      "school-panel": "#ffffff",
      "school-panel2": "#f0ebd4",
      "school-cyan": "#9a3412",
      "school-violet": "#ea580c",
      "school-text": "#431407",
      "school-muted": "#7c2d12",
      "school-line": "rgba(154, 52, 18, 0.08)"
    }
  }
];
