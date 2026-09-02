import React from 'react';
import { 
  ArrowRight, 
  Footprints, 
  TrendingUp, 
  Award, 
  Cpu, 
  Target, 
  Trophy, 
  Sparkles, 
  HeartHandshake, 
  Heart, 
  Compass,
  BookOpen
} from 'lucide-react';

interface JuniorHighCardsProps {
  onNavigateToPage: (url: string) => void;
}

export const JuniorHighCards: React.FC<JuniorHighCardsProps> = ({ onNavigateToPage }) => {
  const allJuniorItems = [
    {
      title: "שכבת ז': הצעד הראשון בדרך החדשה",
      subtitle: "שנת המעבר, ההסתגלות וההשתלבות",
      desc: "קליטה וגיבוש, הסתגלות למסגרת השש-שנתית, תכנית 'גשר לעתיד' ומבוא מעשי ל-STEM.",
      icon: Footprints,
      badge: "שכבה ז'",
      badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      accentBorder: "hover:border-emerald-400/60",
      iconBg: "bg-emerald-500/15 text-emerald-400",
      textColor: "group-hover:text-emerald-300",
      url: "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%96-%d7%94%d7%a6%d7%a2%d7%93-%d7%94%d7%a8%d7%90%d7%a9%d7%95%d7%9f-%d7%91%d7%93%d7%a8%d7%9a-%d7%94%d7%97%d7%93%d7%a9%d7%94/"
    },
    {
      title: "שכבת ח': צמיחה והעמקה – מגלים את הכוחות שבכם",
      subtitle: "העמקה לימודית, חקר ומנהיגות צעירה",
      desc: "גילוי כוחות אישיים, פיתוח מיומנויות חקר, תכנית 'אקו-ארנס' ועשייה חברתית מובילה.",
      icon: TrendingUp,
      badge: "שכבה ח'",
      badgeColor: "bg-teal-500/15 text-teal-300 border-teal-500/30",
      accentBorder: "hover:border-teal-400/60",
      iconBg: "bg-teal-500/15 text-teal-400",
      textColor: "group-hover:text-teal-300",
      url: "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%97-%d7%a6%d7%9e%d7%99%d7%97%d7%94-%d7%95%d7%94%d7%a2%d7%9e%d7%a7%d7%94-%d7%9e%d7%92%d7%9c%d7%99%d7%9d-%d7%90%d7%aa-%d7%94%d7%9b%d7%95%d7%97%d7%95%d7%aa-%d7%a9/"
    },
    {
      title: "שכבת ט': בחירות, עצמאות ואחריות",
      subtitle: "סיום חט\"ב והיערכות לחטיבה העליונה",
      desc: "היערכות למעבר לתיכון, בחירת מגמות לימוד, עבודת שורשים וטקס סיום חגיגי של חטיבת הביניים.",
      icon: Award,
      badge: "שכבה ט'",
      badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/30",
      accentBorder: "hover:border-blue-400/60",
      iconBg: "bg-blue-500/15 text-blue-400",
      textColor: "group-hover:text-blue-300",
      url: "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%98-%d7%91%d7%97%d7%99%d7%a8%d7%95%d7%aa-%d7%a2%d7%a6%d7%9e%d7%90%d7%95%d7%aa-%d7%95%d7%90%d7%97%d7%a8%d7%99%d7%95%d7%aa/"
    },
    {
      title: "הכיתה המדעית",
      subtitle: "מרחב לחדשנות, חקר ומצוינות מדעית",
      desc: "תכנית עמ\"ט (מדעית-טכנולוגית): פיזיקה יישומית, ביולוגיה, תכנות ומעבדות חדשניות.",
      icon: Cpu,
      badge: "עמ\"ט ו-STEM",
      badgeColor: "bg-sky-500/15 text-sky-300 border-sky-500/30",
      accentBorder: "hover:border-sky-400/60",
      iconBg: "bg-sky-500/15 text-sky-400",
      textColor: "group-hover:text-sky-300",
      url: "course/%d7%97%d7%98%d7%91/%d7%9b%d7%99%d7%aa%d7%94-%d7%9e%d7%93%d7%a2%d7%99%d7%aa/"
    },
    {
      title: "כיתה אולימפית",
      subtitle: "מצוינות מתמטית ומדעית מואצת",
      desc: "טיפוח דור המדענים הבא: פתרון בעיות מורכבות, חשיבה אקדמית והכנה לאולימפיאדות.",
      icon: Target,
      badge: "מצוינות על",
      badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      accentBorder: "hover:border-amber-400/60",
      iconBg: "bg-amber-500/15 text-amber-400",
      textColor: "group-hover:text-amber-300",
      url: "course/%d7%97%d7%98%d7%91/%d7%9b%d7%99%d7%aa%d7%94-%d7%90%d7%95%d7%9c%d7%99%d7%9e%d7%a4%d7%99%d7%aa/"
    },
    {
      title: "אקדמיית הכדורסל",
      subtitle: "מצוינות ספורטיבית, אתלטיקה וערכים",
      desc: "אימוני כדורסל ברמה מקצועית, מעטפת אתלטיקה וכושר, תזונת ספורט וליווי אישי מקיף.",
      icon: Trophy,
      badge: "ספורט והישגיות",
      badgeColor: "bg-orange-500/15 text-orange-300 border-orange-500/30",
      accentBorder: "hover:border-orange-400/60",
      iconBg: "bg-orange-500/15 text-orange-400",
      textColor: "group-hover:text-orange-300",
      url: "course/%d7%97%d7%98%d7%91/%d7%90%d7%a7%d7%93%d7%9e%d7%99%d7%99%d7%aa-%d7%94%d7%9b%d7%93%d7%95%d7%a8%d7%a1%d7%9c/"
    },
    {
      title: "שישי אישי ומרכז הלמידה",
      subtitle: "הייחודיות של ארנס: מרחב תמיכה והעצמה",
      desc: "תגבורים ממוקדים בקבוצות קטנות, מרחב פיתוח פרויקטים אישיים והעצמה לימודית ורגשית.",
      icon: Sparkles,
      badge: "העצמה אישית",
      badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
      accentBorder: "hover:border-purple-400/60",
      iconBg: "bg-purple-500/15 text-purple-400",
      textColor: "group-hover:text-purple-300",
      url: "course/%d7%97%d7%98%d7%91/%d7%a9%d7%99%d7%a9%d7%99-%d7%90%d7%99%d7%a9%d7%99/%d7%94%d7%99%d7%99%d7%97%d7%95%d7%93%d7%99%d7%95%d7%aa-%d7%a9%d7%9c-%d7%90%d7%a8%d7%a0%d7%a1/"
    },
    {
      title: "פרויקט המנטורינג",
      subtitle: "חיבור דורות: הייטקיסטים ומבוגרים מלווים",
      desc: "מנטורים בכירים מהתעשייה והאקדמיה מלווים ומעצימים את התלמידים להצלחה מעשית.",
      icon: HeartHandshake,
      badge: "מנהיגות וחדשנות",
      badgeColor: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
      accentBorder: "hover:border-indigo-400/60",
      iconBg: "bg-indigo-500/15 text-indigo-400",
      textColor: "group-hover:text-indigo-300",
      url: "course/%d7%97%d7%98%d7%91/%d7%a4%d7%a8%d7%95%d7%99%d7%a7%d7%98-%d7%94%d7%9e%d7%a0%d7%98%d7%95%d7%a8%d7%99%d7%a0%d7%92/"
    },
    {
      title: "חינוך חברתי חט\"ב",
      subtitle: "חוויות, טקסים, גיבוש והעצמה ערכית",
      desc: "פעילויות גיבוש, מועצת תלמידים פעילה, אירועי שיא, טקסים חגיגיים והפסקות פעילות.",
      icon: Heart,
      badge: "הווי וקהילה",
      badgeColor: "bg-rose-500/15 text-rose-300 border-rose-500/30",
      accentBorder: "hover:border-rose-400/60",
      iconBg: "bg-rose-500/15 text-rose-400",
      textColor: "group-hover:text-rose-300",
      url: "course/%d7%97%d7%98%d7%91/%d7%97%d7%99%d7%a0%d7%95%d7%9a-%d7%97%d7%91%d7%a8%d7%aa%d7%99-%d7%97%d7%98%d7%91/"
    },
    {
      title: "מעורבות חברתית",
      subtitle: "נתינה, התנדבות ומחויבות לקהילה",
      desc: "תרומה לקהילת פתח תקווה, סיוע לימודי, קיימות ירוקה ושותפויות קהילתיות מחממות לב.",
      icon: HeartHandshake,
      badge: "ערכים ונתינה",
      badgeColor: "bg-pink-500/15 text-pink-300 border-pink-500/30",
      accentBorder: "hover:border-pink-400/60",
      iconBg: "bg-pink-500/15 text-pink-400",
      textColor: "group-hover:text-pink-300",
      url: "course/%d7%97%d7%98%d7%91/%d7%9e%d7%a2%d7%95%d7%a8%d7%91%d7%95%d7%aa-%d7%97%d7%91%d7%a8%d7%aa%d7%99-%d7%97%d7%91%d7%a8%d7%aa%d7%99%d7%aa-2/"
    },
    {
      title: "המסעאו\"ת",
      subtitle: "למידה רב-תחומית פורצת דרך ומיומנויות",
      desc: "מסעות חקר, סיורים בשטח ופרויקטים המשלבים מדעים, היסטוריה, ספרות ומיומנויות המאה ה-21.",
      icon: Compass,
      badge: "חקר ומסעות",
      badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      accentBorder: "hover:border-emerald-400/60",
      iconBg: "bg-emerald-500/15 text-emerald-400",
      textColor: "group-hover:text-emerald-300",
      url: "course/%d7%97%d7%98%d7%91/%d7%9e%d7%a1%d7%a2%d7%90%d7%95%d7%aa-2/"
    },
    {
      title: "עבודות קיץ לעולים לכיתות ח-ט",
      subtitle: "משימות מעבר, חקר ותרגול לימי הקיץ",
      desc: "חוברות תרגול במתמטיקה, אנגלית ומדעים לשמירה על רצף הלמידה והיערכות מיטבית לשנה הבאה.",
      icon: BookOpen,
      badge: "למידה ותרגול",
      badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      accentBorder: "hover:border-cyan-400/60",
      iconBg: "bg-cyan-500/15 text-cyan-400",
      textColor: "group-hover:text-cyan-300",
      url: "course/%d7%97%d7%98%d7%91/%d7%a2%d7%91%d7%95%d7%93%d7%95%d7%aa-%d7%a7%d7%99%d7%a5-%d7%9c%d7%a2%d7%95%d7%9c%d7%99%d7%9d-%d7%9c%d7%9b%d7%99%d7%aa%d7%95%d7%aa-%d7%97-%d7%98/"
    }
  ];

  return (
    <div className="pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allJuniorItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateToPage(item.url)}
              className={`group p-5 rounded-2xl bg-[#0b1324] hover:bg-[#101b33] border border-school-line/60 ${item.accentBorder} shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between`}
            >
              <div className="space-y-3 text-right">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center font-black group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <div>
                  <h5 className={`font-black text-sm md:text-base text-white ${item.textColor} transition-colors`}>
                    {item.title}
                  </h5>
                  <p className="text-xs text-school-muted font-medium mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
                <p className="text-xs text-school-muted/80 leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between text-xs font-bold text-school-cyan group-hover:text-cyan-300">
                <span>צפייה בתוכן המלא</span>
                <ArrowRight className="w-4 h-4 -scale-x-100 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
