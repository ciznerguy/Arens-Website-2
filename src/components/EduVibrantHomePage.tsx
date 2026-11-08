import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  ChevronLeft, 
  Calendar, 
  GraduationCap, 
  MapPin, 
  Phone, 
  ExternalLink, 
  LogIn, 
  Award, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  Radio, 
  Layers,
  Cpu,
  Trophy,
  Dna,
  Atom,
  Languages,
  Mail,
  FlaskConical,
  Code,
  Search,
  X,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';
import { SchoolMajor, StaffMember } from '../types';
import { NewsArticle } from '../data';
import { allTeachersList } from '../data/teachersList';
import { TeacherAvatar } from './TeacherAvatar';
import { EmailContactButton } from './EmailContactButton';

interface EduVibrantHomePageProps {
  onNavigateToPage: (url: string) => void;
  onNavigateToGrade: (grade: string) => void;
  onSelectMajor: (majorId: string) => void;
  onOpenEventsNews: () => void;
  onOpenContact: () => void;
  allNews?: NewsArticle[];
  majors?: SchoolMajor[];
}

export default function EduVibrantHomePage({
  onNavigateToPage,
  onNavigateToGrade,
  onSelectMajor,
  onOpenEventsNews,
  onOpenContact,
  allNews = [],
  majors = []
}: EduVibrantHomePageProps) {
  // Staff Directory Search State
  const [isStaffDirectoryOpen, setIsStaffDirectoryOpen] = useState(false);
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [staffFilter, setStaffFilter] = useState<'all' | 'management' | 'junior' | 'high'>('all');

  // Selected Staff Member for Full Profile Modal
  const [selectedStaffMember, setSelectedStaffMember] = useState<StaffMember | null>(null);

  // Height of the sticky site header, so the opening photo fills exactly the screen below it
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;
    const measure = () => setHeaderHeight(header.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedStaffMember) {
          setSelectedStaffMember(null);
        } else if (isStaffDirectoryOpen) {
          setIsStaffDirectoryOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStaffMember, isStaffDirectoryOpen]);

  // Official school grades
  const gradeCards = [
    { grade: 'ז', label: 'שכבת ז׳', tag: 'צעד ראשון', colorBg: 'bg-[#1D4ED8]/10 text-[#1D4ED8]', arrowColor: 'text-[#1D4ED8]', url: 'course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%96-%d7%94%d7%a6%d7%a2%d7%93-%d7%94%d7%a8%d7%90%d7%a9%d7%95%d7%9f-%d7%91%d7%93%d7%a8%d7%9a-%d7%94%d7%97%d7%93%d7%a9%d7%94/' },
    { grade: 'ח', label: 'שכבת ח׳', tag: 'צמיחה והעמקה', colorBg: 'bg-[#F59E0B]/20 text-[#855300]', arrowColor: 'text-[#855300]', url: 'course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%97-%d7%a6%d7%9e%d7%99%d7%97%d7%94-%d7%95%d7%94%d7%a2%d7%9e%d7%a7%d7%94-%d7%9e%d7%92%d7%9c%d7%99%d7%9d-%d7%90%d7%aa-%d7%94%d7%9b%d7%95%d7%97%d7%95%d7%aa-%d7%a9/' },
    { grade: 'ט', label: 'שכבת ט׳', tag: 'בחירה ואחריות', colorBg: 'bg-[#6FFBBE]/40 text-[#004F35]', arrowColor: 'text-[#004F35]', url: 'course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%98-%d7%91%d7%97%d7%99%d7%a8%d7%95%d7%aa-%d7%a2%d7%a6%d7%9e%d7%90%d7%95%d7%aa-%d7%95%d7%90%d7%97%d7%a8%d7%99%d7%95%d7%aa/' },
    { grade: 'י', label: 'שכבת י׳', tag: 'מעבר לתיכון', colorBg: 'bg-[#1D4ED8] text-white', arrowColor: 'text-[#1D4ED8]', url: 'course/%d7%97%d7%98%d7%a2-2/%d7%a4%d7%95%d7%a1%d7%98-%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99/' },
    { grade: 'י״א', label: 'שכבת י״א', tag: 'בגרויות ומנהיגות', colorBg: 'bg-[#DAE2FD] text-[#0037B0]', arrowColor: 'text-[#0037B0]', url: 'course/%d7%97%d7%98%d7%a2-2/%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%90/' },
    { grade: 'י״ב', label: 'שכבת י״ב', tag: 'סיום ומכינה', colorBg: 'bg-[#FFDDB8] text-[#855300]', arrowColor: 'text-[#855300]', url: 'course/%d7%97%d7%98%d7%a2-2/%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%91/' },
  ];

  // Real School Leadership (Principals & Vice Principals)
  const leadershipMembers = [
    allTeachersList.find(t => t.name.includes('נאוה שקל')) || {
      id: 'staff-1',
      name: 'נאוה שקל ששון',
      role: 'מנהלת שש שנתי',
      email: '1002042738@taded.org.il',
      bio: 'מנהלת בית הספר השש-שנתי ע״ש משה ארנס. מובילה את המוסד החינוכי למצוינות אקדמית, ערכית וחברתית.',
      imageUrl: ''
    },
    allTeachersList.find(t => t.name.includes('אלי לוין')) || {
      id: 'staff-2',
      name: 'אלי לוין',
      role: 'מנהל חטיבת נעורים',
      email: '1002482479@taded.org.il',
      bio: 'מנהל חטיבת הנעורים. מוביל את העשייה החינוכית, הפדגוגית והערכית בחטיבה.',
      imageUrl: '/assets/aistudio/__________f148c680.jpeg'
    },
    allTeachersList.find(t => t.name.includes('ניר מלכה')) || {
      id: 'staff-80',
      name: 'ניר מלכה',
      role: 'סגן ראשון ורכז פדגוגי',
      email: 'nirmalka6@gmail.com',
      bio: 'סגן ראשון, רכז פדגוגי ורכז שכבה בחטיבה העליונה.',
      imageUrl: '/assets/aistudio/__________59314f26.jpeg'
    },
    allTeachersList.find(t => t.name.includes('נדב גורן')) || {
      id: 'staff-31',
      name: 'נדב גורן',
      role: 'סגן מנהל חט"נ ומוביל שכבה ט\'',
      email: '1002185618@taded.org.il',
      bio: 'סגן מנהל חטיבת הנעורים ומוביל שכבה ט\'.',
      imageUrl: ''
    },
    allTeachersList.find(t => t.name.includes('איריס שחמון')) || {
      id: 'staff-126',
      name: 'איריס שחמון',
      role: 'סגנית מנהל חט"נ ומובילת שכבה ח\'',
      email: '1002011426@taded.org.il',
      bio: 'סגנית מנהל חטיבת הנעורים ומובילת שכבת ח\'.',
      imageUrl: ''
    }
  ];

  // Filtered teachers list for the Directory Modal
  const filteredStaffList = allTeachersList.filter(teacher => {
    // Search query match
    if (staffSearchQuery.trim()) {
      const q = staffSearchQuery.toLowerCase();
      const matchName = teacher.name.toLowerCase().includes(q);
      const matchRole = (teacher.role || '').toLowerCase().includes(q);
      const matchDesc = (teacher.roleDescription || '').toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchDesc) return false;
    }

    // Role division filter
    if (staffFilter === 'management') {
      return teacher.isManagement || teacher.role?.includes('מנהל') || teacher.role?.includes('סגן');
    }
    if (staffFilter === 'junior') {
      return teacher.role?.includes('חט"נ') || teacher.roleDescription?.includes('חט"נ') || teacher.roleDescription?.includes('נעורים');
    }
    if (staffFilter === 'high') {
      return teacher.role?.includes('חט"ע') || teacher.roleDescription?.includes('חט"ע') || teacher.roleDescription?.includes('עליונה');
    }

    return true;
  });

  // Real Majors List (displayed up to 8)
  const realFeaturedMajors = majors.length > 0 ? majors.slice(0, 8) : [];

  // Real News / Updates
  const realNewsList = allNews.length > 0 ? allNews.slice(0, 4) : [];

  const getMajorIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Database': return <Cpu className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Atom': return <Atom className="w-5 h-5" />;
      case 'Globe': return <Languages className="w-5 h-5" />;
      case 'Languages': return <Languages className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      case 'FlaskConical': return <FlaskConical className="w-5 h-5" />;
      case 'Code': return <Code className="w-5 h-5" />;
      case 'Trophy': return <Trophy className="w-5 h-5" />;
      case 'Dna': return <Dna className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 select-none text-right font-['Rubik',sans-serif]" dir="rtl">
      
      {/* ============================================================== */}
      {/* 1. HERO BANNER STATEMENT                                       */}
      {/* ============================================================== */}
      {/* Full-screen opening: the school photo spans the whole width and fills the screen below the header */}
      <section
        className="relative w-screen mx-[calc(50%-50vw)] -mt-6 overflow-hidden text-white flex items-center"
        style={{ minHeight: `calc(100svh - ${headerHeight}px)` }}
      >
        <img
          src="/assets/school/arens-building.jpg"
          srcSet="/assets/school/arens-building-800.jpg 800w, /assets/school/arens-building.jpg 1600w"
          sizes="100vw"
          alt="בניין שש-שנתי משה ארנס, פתח תקווה"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        {/* Dark overlay: stronger on the right where the text sits, lighter on the left to show the building */}
        <div className="absolute inset-0 bg-[#0B1A3A]/55 md:bg-transparent md:bg-gradient-to-l md:from-[#0B1A3A]/85 md:via-[#0B1A3A]/45 md:to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-6">
          
          <div className="flex items-center gap-2 text-[#FEA619] relative z-10">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-wider">שש-שנתי משה ארנס • פתח תקווה</span>
          </div>

          <div className="flex flex-col gap-3 relative z-10 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              ללמוד. ליזום. להוביל.
            </h1>
            <p className="text-xl sm:text-2xl text-[#CAD3FF] font-extrabold">
              מצמיח אדם וחברה
            </p>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl font-normal">
              מרחב של מצוינות מדעית, טכנולוגית, ערכית וקהילתית המטפח את כוחות התלמיד ומעצב עתיד איכותי.
            </p>
          </div>

          {/* Action Buttons: Exact Requested Design (כניסה לשכבות + מה מתרחש אצלנו + משו״ב) */}
          <div className="flex flex-wrap items-center gap-3 pt-2 relative z-10">
            {/* Button 1: כניסה לשכבות */}
            <a 
              href="#grades-section"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('grades-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-[#00D2FF] hover:bg-[#00B4DB] text-[#071328] font-black text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>כניסה לשכבות</span>
            </a>

            {/* Button 2: מה מתרחש אצלנו? */}
            <button 
              type="button"
              onClick={onOpenEventsNews}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm border border-white/30 active:scale-95 transition-all cursor-pointer"
            >
              <span>מה מתרחש אצלנו?</span>
            </button>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. QUICK ACCESS TO GRADES (שכבות בית הספר)                     */}
      {/* ============================================================== */}
      <section id="grades-section" className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#F59E0B] rounded-full" />
            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A]">כניסה מהירה לשכבות</h2>
          </div>
          <span className="text-xs text-[#434655] font-bold">חט״ב וחטיבה עליונה</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {gradeCards.map((g) => (
            <button
              key={g.grade}
              type="button"
              onClick={() => onNavigateToGrade(g.url)}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FFFFFF] border border-[#C4C5D7]/40 shadow-xs hover:shadow-md hover:border-[#1D4ED8]/40 active:scale-95 transition-all text-center cursor-pointer group"
            >
              <span className={`w-12 h-12 rounded-full ${g.colorBg} flex items-center justify-center text-xl font-black shadow-xs group-hover:scale-110 transition-transform`}>
                {g.grade}
              </span>
              <span className="text-sm font-bold text-[#0F172A] mt-2 group-hover:text-[#1D4ED8] transition-colors">
                {g.label}
              </span>
              <span className="text-[11px] text-[#434655] font-medium mt-0.5">
                {g.tag}
              </span>
              <span className={`mt-2 ${g.arrowColor} flex items-center text-xs font-bold gap-1 group-hover:-translate-x-1 transition-transform`}>
                <span>כניסה</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. AGENDA & NEWS (חדשות ואירועים שוטפים - נתוני אמת בלבד)        */}
      {/* ============================================================== */}
      {realNewsList.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-[#1D4ED8] rounded-full" />
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A]">חדשות ואירועים שוטפים</h2>
            </div>
            <button 
              type="button"
              onClick={onOpenEventsNews}
              className="text-xs text-[#1D4ED8] font-black flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>לכל העדכונים</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {realNewsList.map((article, aIdx) => (
              <div 
                key={aIdx}
                onClick={onOpenEventsNews}
                className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#C4C5D7]/40 shadow-xs hover:shadow-md hover:border-[#1D4ED8]/30 transition-all flex flex-col sm:flex-row items-start gap-4 cursor-pointer group"
              >
                {article.imageUrl && (
                  <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-base font-black text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-[#434655] line-clamp-2 mt-1.5 leading-relaxed">
                      {article.content}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-[#1D4ED8]">
                    <span>קרא עוד</span>
                    <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 4. REAL MAJORS & TRACKS (מגמות בית הספר)                        */}
      {/* ============================================================== */}
      {realFeaturedMajors.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <span className="text-xs text-[#1D4ED8] font-black uppercase tracking-wider">למידה מתוך תשוקה</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] mt-0.5">מגמות הלימוד בארנס</h2>
            </div>
            <button 
              type="button"
              onClick={() => onNavigateToPage('course/%d7%97%d7%98%d7%91/%d7%97%d7%95%d7%91%d7%a8%d7%aa-%d7%9e%d7%92%d7%9e%d7%95%d7%aa-%d7%aa%d7%a9%d7%a4%d7%95/')}
              className="text-xs text-[#1D4ED8] font-black flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>לקטלוג המלא</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {realFeaturedMajors.map((m) => (
              <div 
                key={m.id}
                onClick={() => onSelectMajor(m.id)}
                className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#C4C5D7]/50 shadow-sm hover:shadow-md hover:border-[#1D4ED8]/50 flex flex-col justify-between h-48 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start">
                  <span className="w-10 h-10 rounded-xl bg-[#1D4ED8] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    {getMajorIcon(m.icon || (m as any).iconName)}
                  </span>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#EAEDFF] text-[#0037B0] font-black border border-[#C4C5D7]/30">
                    {m.division === 'middle_school' ? 'חט״ב' : 'חטי״ע'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors truncate">
                    {m.title}
                  </h3>
                  <p className="text-xs text-[#434655] line-clamp-2 mt-1 leading-relaxed">
                    {m.shortDescription || m.fullDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#C4C5D7]/30 flex items-center justify-between text-[11px] text-[#1D4ED8] font-bold">
                  <span>צפייה בתוכנית המגמה</span>
                  <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 5. EDUCATIONAL PILLARS (עמודי התווך של בית הספר)                */}
      {/* ============================================================== */}
      <section className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-[#FFFFFF] p-6 rounded-2xl shadow-sm border border-[#C4C5D7]/40 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#0F172A]">מצוינות מדעית וטכנולוגית</h3>
            <p className="text-xs text-[#434655] leading-relaxed">
              שילוב מחקר מתקדם, מעבדות חקר, סייבר, הנדסת תוכנה ומדעים מוגברים.
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-2xl shadow-sm border border-[#C4C5D7]/40 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#0F172A]">מנהיגות ומעורבות חברתית</h3>
            <p className="text-xs text-[#434655] leading-relaxed">
              חינוך לערכים, התנדבות קהילתית, פיתוח יוזמות אזרחיות וטיפוח מנהיגות צעירה.
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-2xl shadow-sm border border-[#C4C5D7]/40 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#004F35] flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#0F172A]">שש-שנתי ע״ש משה ארנס</h3>
            <p className="text-xs text-[#434655] leading-relaxed">
              רצף פדגוגי וחברתי משכבה ז׳ ועד י״ב באווירה תומכת, מעצימה ומכבדת.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. LEADERSHIP SPOTLIGHT (צוות ההנהלה והסגנים)                   */}
      {/* ============================================================== */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#1D4ED8] rounded-full" />
            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A]">הנהלת בית הספר</h2>
          </div>
          <span className="text-xs text-[#434655] font-bold">מנהלת, מנהל חט״נ וסגני מנהלים</span>
        </div>

        {/* 5 Management Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {leadershipMembers.map((member) => (
            <div 
              key={member.id} 
              onClick={() => setSelectedStaffMember(member)}
              className="bg-[#FFFFFF] p-5 rounded-2xl flex flex-col items-center text-center shadow-sm border border-[#C4C5D7]/40 hover:border-[#1D4ED8]/60 hover:shadow-lg transition-all justify-between cursor-pointer group hover:-translate-y-1 select-none"
              title="לחץ לצפייה בכרטיס המלא של איש הצוות"
            >
              <div className="flex flex-col items-center w-full">
                <TeacherAvatar
                  name={member.name}
                  imageUrl={member.imageUrl}
                  className="w-20 h-20 rounded-full shadow-md border-2 border-white mb-2.5 group-hover:scale-105 group-hover:ring-2 group-hover:ring-[#1D4ED8]/30 transition-all"
                  textClassName="text-xl font-black"
                />
                <h3 className="text-base font-black text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors">{member.name}</h3>
                <span className="text-xs font-bold text-[#1D4ED8] mt-0.5 line-clamp-1">{member.role}</span>
                <p className="text-xs text-[#434655] mt-2 leading-relaxed line-clamp-2">
                  {member.bio}
                </p>

                <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#1D4ED8] bg-[#EAEDFF]/60 px-3 py-1 rounded-full group-hover:bg-[#1D4ED8] group-hover:text-white transition-all">
                  <span>פתיחת כרטיס אישי מלא</span>
                  <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                </div>
              </div>

              {member.email && (
                <div className="w-full pt-3 mt-3 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                  <EmailContactButton
                    email={member.email}
                    name={member.name}
                    className="w-full py-2 px-3 bg-[#EAEDFF] hover:bg-[#DAE2FD] rounded-full text-[#0037B0] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Direct Link to Full Staff Directory & Search */}
        <div className="text-center pt-3">
          <button
            type="button"
            onClick={() => setIsStaffDirectoryOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1D4ED8] hover:bg-blue-800 text-white font-black text-sm shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4 text-[#FEA619]" />
            <span>לצפייה בכלל אנשי הסגל והצוות החינוכי (חיפוש מלא)</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. ESSENTIAL EDUCATIONAL LINKS                                  */}
      {/* ============================================================== */}
      <section className="flex flex-col gap-4 bg-[#EAEDFF]/60 p-6 sm:p-8 rounded-3xl border border-[#C4C5D7]/40">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#1D4ED8]" />
          <h2 className="text-lg sm:text-xl font-black text-[#0F172A]">קישורים חיוניים לתלמידים והורים</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <a 
            href="https://web.mashov.info/students/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-4 bg-[#FFFFFF] rounded-2xl border border-[#C4C5D7]/40 hover:border-[#1D4ED8] transition-all flex flex-col items-center text-center shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center group-hover:scale-110 transition-transform">
              <LogIn className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-[#0F172A] mt-2 group-hover:text-[#1D4ED8]">משו״ב תלמידים והורים</span>
            <span className="text-[10px] text-[#434655] mt-0.5">ציונים, משמעת ומערכת</span>
          </a>

          <a 
            href="https://ofek.snunit.k12.il/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-4 bg-[#FFFFFF] rounded-2xl border border-[#C4C5D7]/40 hover:border-[#1D4ED8] transition-all flex flex-col items-center text-center shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#855300] flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-[#0F172A] mt-2 group-hover:text-[#1D4ED8]">מט״ח - סביבת אופק</span>
            <span className="text-[10px] text-[#434655] mt-0.5">משימות וחומרי למידה</span>
          </a>

          <a 
            href="https://students.education.gov.il/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-4 bg-[#FFFFFF] rounded-2xl border border-[#C4C5D7]/40 hover:border-[#1D4ED8] transition-all flex flex-col items-center text-center shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#004F35] flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-[#0F172A] mt-2 group-hover:text-[#1D4ED8]">פורטל התלמידים הלאומי</span>
            <span className="text-[10px] text-[#434655] mt-0.5">ציוני בגרות רשמיים</span>
          </a>

          <a 
            href="https://classroom.google.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-4 bg-[#FFFFFF] rounded-2xl border border-[#C4C5D7]/40 hover:border-[#1D4ED8] transition-all flex flex-col items-center text-center shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center group-hover:scale-110 transition-transform">
              <ExternalLink className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-[#0F172A] mt-2 group-hover:text-[#1D4ED8]">Google Classroom</span>
            <span className="text-[10px] text-[#434655] mt-0.5">כיתות דיגיטליות</span>
          </a>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. FOOTER CONTACT BAR & ACTIVE SOCIAL LINKS                    */}
      {/* ============================================================== */}
      <section className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#C4C5D7]/40 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#434655]">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#1D4ED8]" />
          <span>רחוב רפאל איתן 3, אם המושבות, פתח תקווה</span>
          <span>•</span>
          <a 
            href="https://waze.com/ul?q=שש+שנתי+משה+ארנס+פתח+תקוה" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#1D4ED8] font-bold hover:underline"
          >
            Waze
          </a>
          <span>•</span>
          <a 
            href="tel:039130700" 
            className="text-[#1D4ED8] font-bold hover:underline"
          >
            מזכירות: 03-9130700
          </a>
        </div>

        {/* Active School Social Links */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#0F172A]">עקבו אחרינו:</span>
          <a 
            href="https://www.facebook.com/arens.school" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
            title="פייסבוק שש-שנתי משה ארנס"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a 
            href="https://www.instagram.com/arens_school?igsh=MWlhejF4Ymx0b2J0aw==" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-colors"
            title="אינסטגרם שש-שנתי משה ארנס"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a 
            href="https://www.youtube.com/@6%D7%A9%D7%A0%D7%AA%D7%99%D7%9E%D7%A9%D7%94%D7%90%D7%A8%D7%A0%D7%A1" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors"
            title="יוטיוב שש-שנתי משה ארנס"
          >
            <Youtube className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. MODAL: FULL SEARCHABLE STAFF DIRECTORY (ספר הצוות המלא)     */}
      {/* ============================================================== */}
      {isStaffDirectoryOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsStaffDirectoryOpen(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 text-right font-['Rubik',sans-serif]"
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-[#FAF8FF] border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1D4ED8]/10 text-[#1D4ED8] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#0F172A]">
                    הסגל החינוכי והניהולי – שש-שנתי משה ארנס
                  </h3>
                  <p className="text-xs text-[#434655]">
                    {allTeachersList.length} אנשי סגל והוראה במערכת בית הספר
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsStaffDirectoryOpen(false)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="p-4 sm:px-6 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="relative w-full sm:flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={staffSearchQuery}
                  onChange={(e) => setStaffSearchQuery(e.target.value)}
                  placeholder="חיפוש מורה לפי שם, תפקיד, מקצוע או שכבה..."
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#1D4ED8] outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setStaffFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    staffFilter === 'all'
                      ? 'bg-[#1D4ED8] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  הכל ({allTeachersList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStaffFilter('management')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    staffFilter === 'management'
                      ? 'bg-[#1D4ED8] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  הנהלה
                </button>
                <button
                  type="button"
                  onClick={() => setStaffFilter('junior')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    staffFilter === 'junior'
                      ? 'bg-[#1D4ED8] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  חט״ב (נעורים)
                </button>
                <button
                  type="button"
                  onClick={() => setStaffFilter('high')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    staffFilter === 'high'
                      ? 'bg-[#1D4ED8] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  חטיבה עליונה
                </button>
              </div>
            </div>

            {/* Teachers Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-slate-50">
              {filteredStaffList.length === 0 ? (
                <div className="text-center py-16 space-y-2">
                  <Users className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-[#0F172A]">לא נמצאו אנשי צוות התואמים את החיפוש</p>
                  <p className="text-xs text-[#434655]">נסו לשנות את מונח החיפוש או לבטל את הסינון</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredStaffList.map((teacher) => (
                    <div 
                      key={teacher.id}
                      onClick={() => setSelectedStaffMember(teacher)}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-[#1D4ED8]/60 hover:shadow-md transition-all flex items-start gap-3.5 cursor-pointer group hover:-translate-y-0.5 select-none"
                      title="לחץ לצפייה בכרטיס המלא של איש הצוות"
                    >
                      <TeacherAvatar
                        name={teacher.name}
                        imageUrl={teacher.imageUrl}
                        className="w-12 h-12 rounded-full shrink-0 shadow-xs border border-slate-100 group-hover:scale-105 group-hover:ring-2 group-hover:ring-[#1D4ED8]/30 transition-all"
                        textClassName="text-sm font-black"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-black text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors truncate">
                            {teacher.name}
                          </h4>
                          {teacher.isManagement && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-[#855300]">
                              הנהלה
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#434655] mt-0.5 line-clamp-1" title={teacher.roleDescription || teacher.role}>
                          {teacher.roleDescription || teacher.role}
                        </p>
                        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-[#1D4ED8] font-bold inline-flex items-center gap-1 group-hover:underline">
                            <span>פתיחת כרטיס מלא</span>
                            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 px-6 bg-[#FAF8FF] border-t border-slate-200 flex items-center justify-between text-xs text-[#434655] shrink-0">
              <span>מוצגים {filteredStaffList.length} אנשי סגל</span>
              <button
                type="button"
                onClick={() => setIsStaffDirectoryOpen(false)}
                className="font-bold text-[#1D4ED8] hover:underline cursor-pointer"
              >
                סגירה
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. DEDICATED STAFF PROFILE MODAL (כרטיס איש צוות מלא)           */}
      {/* ============================================================== */}
      <AnimatePresence>
        {selectedStaffMember && (
          <div 
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-md animate-fade-in"
            onClick={() => setSelectedStaffMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.35 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden text-right relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative top accent */}
              <div className="h-2 w-full bg-gradient-to-r from-[#1D4ED8] via-[#FEA619] to-[#1D4ED8]" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedStaffMember(null)}
                className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer z-10"
                title="סגור חלונית"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 sm:p-8 space-y-6">
                {/* Avatar and Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-right pt-1">
                  <TeacherAvatar
                    name={selectedStaffMember.name}
                    imageUrl={selectedStaffMember.imageUrl}
                    className="w-24 h-24 rounded-2xl shadow-lg border-2 border-white ring-2 ring-[#1D4ED8]/20 object-cover shrink-0"
                    textClassName="text-2xl font-black"
                  />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-100 text-[#0037B0]">
                        {selectedStaffMember.role}
                      </span>
                      {selectedStaffMember.isManagement && (
                        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-100 text-[#855300]">
                          הנהלת בית הספר
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-black text-[#0F172A]">
                      {selectedStaffMember.name}
                    </h3>
                    {selectedStaffMember.roleDescription && selectedStaffMember.roleDescription !== selectedStaffMember.role && (
                      <p className="text-xs font-bold text-[#434655]">
                        {selectedStaffMember.roleDescription}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bio / Educational Role */}
                <div className="bg-[#FAF8FF] p-4 sm:p-5 rounded-2xl border border-[#0F172A]/06 space-y-1.5">
                  <h4 className="text-xs font-black text-[#855300] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>אודות ותפקיד חינוכי</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#434655] leading-relaxed whitespace-pre-wrap">
                    {selectedStaffMember.bio || `${selectedStaffMember.name} משמש/ת בתפקיד ${selectedStaffMember.role} בבית הספר השש-שנתי ע״ש משה ארנס. שותפ/ה לעשייה החינוכית, הערכית והפדגוגית למען התלמידים והקהילה.`}
                  </p>
                </div>

                {/* Email Contact (Official Email Only - No Phone Numbers) */}
                {selectedStaffMember.email && (
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2.5">
                    <EmailContactButton
                      email={selectedStaffMember.email}
                      name={selectedStaffMember.name}
                      label="שליחת פנייה ישירה בדוא״ל"
                      iconClassName="w-4 h-4"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1D4ED8] hover:bg-blue-800 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">שש-שנתי משה ארנס • פתח תקווה</span>
                <button
                  type="button"
                  onClick={() => setSelectedStaffMember(null)}
                  className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  סגירה
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
