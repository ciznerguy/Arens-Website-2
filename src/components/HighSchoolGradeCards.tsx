import React from 'react';
import { 
  ArrowRight, 
  Compass, 
  TrendingUp, 
  Award, 
  GraduationCap 
} from 'lucide-react';

interface HighSchoolGradeCardsProps {
  onNavigateToPage: (url: string) => void;
}

export const HighSchoolGradeCards: React.FC<HighSchoolGradeCardsProps> = ({ onNavigateToPage }) => {
  const gradeItems = [
    {
      title: "שכבת י': ביסוס המגמות והמעבר לתיכון",
      subtitle: "שנת המעבר, ההתנעה והמחויבות האישית",
      desc: "ביסוס הלמידה במגמות, תחילת פרויקטי גמר, התאקלמות לדרישות החט\"ע ופיתוח מעורבות חברתית פעילה.",
      icon: Compass,
      badge: "שכבה י'",
      badgeColor: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
      accentBorder: "hover:border-indigo-400/60",
      iconBg: "bg-indigo-500/15 text-indigo-400",
      textColor: "group-hover:text-indigo-300",
      url: "course/%d7%97%d7%98%d7%a2-2/%d7%a4%d7%95%d7%a1%d7%98-%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99/"
    },
    {
      title: "שכבת יא': האצת הבגרויות והמסע הישראלי",
      subtitle: "שנת המאמץ המרוכז והעשייה הערכית",
      desc: "האצת הלמידה לבגרויות הלאומיות, המסע הישראלי המעצב ומיזמי הנצחה וקהילה מובילים בפתח תקווה.",
      icon: TrendingUp,
      badge: "שכבה יא'",
      badgeColor: "bg-violet-500/15 text-violet-300 border-violet-500/30",
      accentBorder: "hover:border-violet-400/60",
      iconBg: "bg-violet-500/15 text-violet-400",
      textColor: "group-hover:text-violet-300",
      url: "course/%d7%97%d7%98%d7%a2-2/%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%90/"
    },
    {
      title: "שכבת יב': סיום, בגרות מלאה והכנה לצה\"ל",
      subtitle: "שנת ההנהגה, מופע הסיום ושירות משמעותי",
      desc: "שנת הסיום והבגרות המלאה, סדנאות הכנה לצה\"ל, הפקת מופע הסיום המסורתי ומיזמי הובלה ומנהיגות.",
      icon: Award,
      badge: "שכבה יב'",
      badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      accentBorder: "hover:border-amber-400/60",
      iconBg: "bg-amber-500/15 text-amber-400",
      textColor: "group-hover:text-amber-300",
      url: "course/%d7%97%d7%98%d7%a2-2/%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%91/"
    }
  ];

  return (
    <div className="space-y-4 pt-3">
      <div className="flex items-center justify-between border-b border-school-line/60 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-school-violet/15 text-school-violet flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-base md:text-lg text-white">
              שכבות הלימוד בחטיבה העליונה
            </h4>
            <p className="text-xs text-school-muted">מעבר מהיר לדפי השכבות, תוכניות לימוד ופעילויות שיא</p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-school-violet bg-school-violet/10 border border-school-violet/25 px-3 py-1 rounded-full">
          שכבות י' - יב'
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gradeItems.map((item, idx) => {
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
                <p className="text-xs text-school-muted/80 leading-relaxed line-clamp-3">
                  {item.desc}
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-school-cyan group-hover:text-cyan-300">
                <span>צפייה בתוכן השכבה</span>
                <ArrowRight className="w-4 h-4 -scale-x-100 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
