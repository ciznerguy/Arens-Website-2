import React, { useState, useEffect } from 'react';
import { InternalPage, QuickLink, TeacherEvent } from '../types';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  ExternalLink, 
  ArrowLeft, 
  Clock, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Compass, 
  UserCheck, 
  CreditCard, 
  Calendar, 
  Award, 
  ChevronRight,
  PlusCircle,
  HelpCircle,
  FileSpreadsheet,
  MapPin
} from 'lucide-react';
import { getUpcomingTeacherEvents, formatToIsraeliDate, subscribeToTeacherEvents } from '../services/eventsStorage';

interface RolePortalHomepageProps {
  role: 'students' | 'parents' | 'teachers';
  allPagesMap: Record<string, InternalPage>;
  quickLinks: QuickLink[];
  onNavigateToPage: (url: string) => void;
  onNavigateToTab: (tab: string, eventId?: string) => void;
  onRoleChange?: (newRole: 'students' | 'parents' | 'teachers') => void;
  showClassicHomeToggle?: boolean;
  onToggleClassicHome?: () => void;
}

export const RolePortalHomepage: React.FC<RolePortalHomepageProps> = ({
  role,
  allPagesMap,
  quickLinks,
  onNavigateToPage,
  onNavigateToTab,
  onRoleChange,
  showClassicHomeToggle,
  onToggleClassicHome
}) => {
  // Card limit count state (starts at 6, loads 6 more each time)
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Future events for teachers with real-time sync
  const [upcomingEvents, setUpcomingEvents] = useState<TeacherEvent[]>(() => {
    return role === 'teachers' ? getUpcomingTeacherEvents() : [];
  });

  useEffect(() => {
    if (role !== 'teachers') return;
    // Initial fetch
    setUpcomingEvents(getUpcomingTeacherEvents());

    // Subscribe to Firestore live changes
    const unsub = subscribeToTeacherEvents((events) => {
      const active = events.filter(e => (e.status as string) !== 'archived');
      setUpcomingEvents(active);
    });


    const handleLocalUpdate = () => {
      setUpcomingEvents(getUpcomingTeacherEvents());
    };
    window.addEventListener('arens_events_updated', handleLocalUpdate);

    return () => {
      unsub();
      window.removeEventListener('arens_events_updated', handleLocalUpdate);
    };
  }, [role]);

  // Role metadata
  const roleConfig = {
    students: {
      badge: 'מרחב התלמידים',
      title: 'לתלמיד',
      headingText: 'לתלמיד',
      subtitle: 'כל מה שצריך ללמידה איכותית, מערכות שעות, מסלולים, עבודות קיץ ומידע חברתי בשש-שנתי משה ארנס',
      icon: GraduationCap,
      color: 'from-school-cyan to-blue-500',
      badgeBg: 'bg-school-cyan/15 text-school-cyan border-school-cyan/30',
      audienceValues: ['students', 'תלמידים', 'כללי', 'all']
    },
    parents: {
      badge: 'מרחב ההורים',
      title: 'להורה',
      headingText: 'להורה',
      subtitle: 'מידעון בית הספר, תשלומי הורים, פרויקט השאלת ספרים, טפסי רישום ועדכונים שוטפים מההנהלה',
      icon: Users,
      color: 'from-school-violet to-purple-500',
      badgeBg: 'bg-school-violet/15 text-school-violet border-school-violet/30',
      audienceValues: ['parents', 'הורים', 'כללי', 'all']
    },
    teachers: {
      badge: 'מרחב הסגל החינוכי',
      title: 'למורה',
      headingText: 'למורה',
      subtitle: 'גישה ישירה למערכת משוב, אופק, Google Classroom, פורטל עובדי הוראה, טפסים פדגוגיים ותכניות עבודה',
      icon: BookOpen,
      color: 'from-amber-400 to-orange-500',
      badgeBg: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
      audienceValues: ['teachers', 'מורים', 'כללי', 'all']
    }
  }[role];

  const IconComp = roleConfig.icon;

  // Filter relevant pages for this role
  const pageEntries = (Object.entries(allPagesMap) as [string, InternalPage][]).filter(([url, page]) => {
    if (!page || url === 'home-page-1') return false;
    const aud = String(page.audience || 'כללי').toLowerCase();
    const cat = String(page.category || '');
    const tit = String(page.title || '');
    
    if (role === 'students') {
      return aud.includes('students') || aud.includes('תלמיד') || aud.includes('כללי') || aud.includes('all') || 
             cat.includes('חט') || cat.includes('תלמיד');
    }
    if (role === 'parents') {
      return aud.includes('parents') || aud.includes('הור') || aud.includes('כללי') || aud.includes('all') || 
             cat.includes('הורים') || tit.includes('תשלום') || tit.includes('השאלת');
    }
    if (role === 'teachers') {
      return aud.includes('teachers') || aud.includes('מור') || aud.includes('כללי') || aud.includes('all') || 
             cat.includes('מורים') || tit.includes('משוב') || tit.includes('פדגוג');
    }
    return true;
  });

  // Sort by date or url order (newest items first)
  pageEntries.sort(([urlA, pageA], [urlB, pageB]) => {
    if (pageA.date && pageB.date) {
      return new Date(pageB.date).getTime() - new Date(pageA.date).getTime();
    }
    if (pageA.date) return -1;
    if (pageB.date) return 1;
    return 0;
  });

  const visiblePages = pageEntries.slice(0, visibleCount);
  const hasMorePages = visibleCount < pageEntries.length;

  // Filter relevant quick links for this role
  const filteredQuickLinks = quickLinks.filter(link => {
    if (!link) return false;
    const aud = String(link.audience || 'כללי').toLowerCase();
    if (role === 'students') return aud.includes('students') || aud.includes('תלמיד') || aud.includes('כללי') || aud.includes('all');
    if (role === 'parents') return aud.includes('parents') || aud.includes('הור') || aud.includes('כללי') || aud.includes('all');
    if (role === 'teachers') return aud.includes('teachers') || aud.includes('מור') || aud.includes('כללי') || aud.includes('all');
    return true;
  });

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in max-w-7xl mx-auto px-4 md:px-8 pt-4">
      
      {/* HERO BANNER SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-school-panel via-school-panel2 to-school-bg border border-school-line/60 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-school-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-school-violet/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5 text-right">
          
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-black shadow-sm ${roleConfig.badgeBg}`}>
            <IconComp className="w-4 h-4 shrink-0" />
            <span>{roleConfig.badge}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {roleConfig.title}
          </h1>

          <p className="text-sm md:text-base text-school-muted leading-relaxed font-normal max-w-2xl">
            {roleConfig.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap gap-3 items-center">
            {role === 'teachers' && upcomingEvents.length > 0 && (
              <button
                onClick={() => onNavigateToTab('teachers-events', upcomingEvents[0].id)}
                className="px-6 py-2.5 rounded-2xl bg-[#2a4563] hover:bg-[#345579] border-2 border-[#38bdf8]/60 hover:border-[#38bdf8] text-white font-extrabold text-sm md:text-base shadow-lg shadow-sky-950/40 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>הרשמה לסדנאות ({upcomingEvents[0].date || 'אירוע קרוב'})</span>
              </button>
            )}

            <button
              onClick={() => {
                const el = document.getElementById('recent-contents-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-school-cyan to-cyan-400 text-slate-950 font-black text-xs hover:shadow-lg hover:scale-102 transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>צפה בתכנים האחרונים ({pageEntries.length})</span>
            </button>
            <button
              onClick={() => onNavigateToTab('home')}
              className="px-4 py-2.5 rounded-xl bg-school-panel/80 hover:bg-white/10 border border-school-line text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ChevronRight className="w-4 h-4 text-school-cyan" />
              <span>חזרה לדף הבית הראשי</span>
            </button>
          </div>

        </div>
      </section>

      {/* SPECIAL FEATURED BANNER FOR TEACHERS: WORKSHOPS & EVENTS MODULE */}
      {role === 'teachers' && (
        <section className="bg-gradient-to-r from-[#101b33] via-[#0d1c38] to-[#122347] border-2 border-school-cyan/40 hover:border-school-cyan rounded-3xl p-6 md:p-8 shadow-xl shadow-school-cyan/5 transition-all">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Google Workspace Sync
                </span>
                <span className="text-[10px] font-bold text-school-cyan bg-school-cyan/15 px-2.5 py-1 rounded-full">
                  חדש ופעיל
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white flex flex-wrap items-center gap-2.5">
                <FileSpreadsheet className="w-6 h-6 text-emerald-400 shrink-0" />
                <span>{upcomingEvents[0]?.title || 'הרשמה לסדנאות יום ההיערכות והשתלמויות הצוות'}</span>
                {upcomingEvents[0]?.date && (
                  <span className="inline-flex items-center gap-1 text-xs md:text-sm font-black text-school-cyan bg-school-cyan/15 border border-school-cyan/35 px-3 py-1 rounded-xl font-mono shadow-sm" dir="ltr">
                    <Calendar className="w-3.5 h-3.5 text-school-cyan" />
                    <span>{formatToIsraeliDate(upcomingEvents[0].date)}</span>
                  </span>
                )}
              </h2>
              <p className="text-xs md:text-sm text-school-muted leading-relaxed">
                {upcomingEvents[0]?.subtitle || 'בחרו את הסדנה המועדפת עליכם, שריינו מקום בזמן אמת עם נעילת מכסות אוטומטית, וקבלו אישור שיבוץ מיידי המסונכרן ישירות ל-Google Sheets ו-Google Docs של בית הספר.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigateToTab('teachers-events')}
                className="btn px-6 py-3.5 rounded-2xl bg-gradient-to-r from-school-cyan to-cyan-400 text-slate-950 font-black text-xs md:text-sm shadow-lg shadow-school-cyan/20 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>כניסה לטופס ההרשמה לסדנאות</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateToTab('teachers-events-admin')}
                className="btn px-4 py-3.5 rounded-2xl bg-school-panel border border-school-line text-white hover:text-school-cyan hover:border-school-cyan font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                title="פאנל ניהול לאחראי האירוע"
              >
                <span>ממשק ניהול (Admin)</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* QUICK ACCESS LINKS BAR */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-school-line/40">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-school-cyan" />
            <span>גישה מהירה ומערכות מרכזיות {roleConfig.headingText}</span>
          </h2>
          <span className="text-xs text-school-muted font-bold">({filteredQuickLinks.length} קישורים)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {filteredQuickLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target={link.url.startsWith('http') ? '_blank' : '_self'}
              onClick={(e) => {
                if (!link.url.startsWith('http')) {
                  e.preventDefault();
                  onNavigateToPage(link.url);
                }
              }}
              rel="noopener noreferrer"
              className="bg-school-panel/70 hover:bg-school-panel border border-school-line/60 hover:border-school-cyan/60 rounded-2xl p-3.5 flex flex-col justify-between space-y-3 group transition-all duration-200 hover:-translate-y-1 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-school-cyan/10 group-hover:bg-school-cyan/20 flex items-center justify-center text-school-cyan transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </div>
                {link.badge && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-school-cyan/20 text-school-cyan border border-school-cyan/30">
                    {link.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-extrabold text-white group-hover:text-school-cyan transition-colors line-clamp-2 leading-snug">
                {link.title}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* 6 LATEST CONTENTS GRID SECTION */}
      <section id="recent-contents-grid" className="space-y-6 pt-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-school-line/50">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-school-cyan" />
              <span>תכנים אחרונים שנוספו {roleConfig.headingText}</span>
            </h2>
            <p className="text-xs text-school-muted mt-1">
              מוצגים {visiblePages.length} מתוך {pageEntries.length} תכנים, דפי מידע ועדכונים
            </p>
          </div>

          <div className="text-xs font-bold text-school-cyan bg-school-cyan/10 border border-school-cyan/30 px-3 py-1.5 rounded-xl">
            תצוגה בכרטיסיות (3 בשורה)
          </div>
        </div>

        {pageEntries.length === 0 ? (
          <div className="bg-school-panel/50 border border-school-line/60 rounded-2xl p-10 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-school-muted mx-auto" />
            <h3 className="text-base font-extrabold text-white">טרם נוספו תכנים ייעודיים {roleConfig.headingText}</h3>
            <p className="text-xs text-school-muted max-w-md mx-auto">
              ניתן להוסיף דפים ותכנים חדשים מתוך פאנל הניהול ולסווג אותם עבור {roleConfig.headingText}.
            </p>
          </div>
        ) : (
          <>
            {/* CARDS GRID - 3 PER ROW ON DESKTOP */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* CHRONOLOGICAL FUTURE WORKSHOP CARDS (FIRST CARDS ON THE RIGHT FOR TEACHERS) */}
              {role === 'teachers' && upcomingEvents.map((event, evIdx) => (
                <div
                  key={event.id || `up-ev-${evIdx}`}
                  onClick={() => onNavigateToTab('teachers-events', event.id)}
                  className="bg-gradient-to-b from-[#0f2847] via-[#0d213d] to-school-panel2 border-2 border-school-cyan/60 hover:border-school-cyan rounded-3xl p-6 space-y-4 shadow-xl hover:shadow-2xl hover:shadow-school-cyan/10 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between group relative overflow-hidden ring-1 ring-school-cyan/30"
                >
                  <div className="space-y-3">
                    
                    {/* Top tags */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>הרשמה פתוחה לסדנאות</span>
                      </span>
                      {event.date && (
                        <span className="text-[10px] text-school-cyan font-bold flex items-center gap-1 font-mono bg-school-cyan/10 px-2 py-0.5 rounded-lg border border-school-cyan/20">
                          <Calendar className="w-3 h-3 text-school-cyan" />
                          <span>{event.date}</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-black text-lg text-white group-hover:text-school-cyan transition-colors leading-snug">
                      {event.title}
                    </h3>

                    {/* Subtitle / Excerpt */}
                    {event.subtitle && (
                      <p className="text-xs text-school-muted font-medium line-clamp-2 leading-relaxed">
                        {event.subtitle}
                      </p>
                    )}

                    {/* Event details snapshot */}
                    <div className="space-y-1.5 bg-black/30 p-3 rounded-2xl border border-school-line/60 text-xs">
                      {event.hours && (
                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                          <span className="text-school-muted flex items-center gap-1">
                            <Clock className="w-3 h-3 text-school-cyan" />
                            <span>שעות:</span>
                          </span>
                          <span className="font-bold font-mono">{event.hours}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                          <span className="text-school-muted flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-school-cyan" />
                            <span>מיקום:</span>
                          </span>
                          <span className="font-bold">{event.location}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-white/5">
                        <span className="text-school-muted">מבחר סדנאות:</span>
                        <span className="font-bold text-school-cyan font-mono">{(event.workshops || []).length} סדנאות לבחירה</span>
                      </div>
                    </div>

                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-school-line/40 flex items-center justify-between text-xs font-black text-school-cyan group-hover:underline">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>שריין מקום בסדנה עכשיו</span>
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[10px] bg-school-cyan text-slate-950 font-black px-2 py-0.5 rounded-md">
                      הרשם
                    </span>
                  </div>

                </div>
              ))}

              {visiblePages.map(([url, page], idx) => (
                <div
                  key={url || idx}
                  onClick={() => onNavigateToPage(url)}
                  className="bg-gradient-to-b from-school-panel/90 to-school-panel2 border border-school-line/70 hover:border-school-cyan/60 rounded-3xl p-6 space-y-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="space-y-3">
                    
                    {/* Top tags */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-school-cyan/15 text-school-cyan border border-school-cyan/30">
                        {page.category || 'כללי'}
                      </span>
                      {page.date && (
                        <span className="text-[10px] text-school-muted flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-school-muted" />
                          <span>{page.date}</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-black text-lg text-white group-hover:text-school-cyan transition-colors leading-snug line-clamp-2">
                      {page.title}
                    </h3>

                    {/* Subtitle / Excerpt */}
                    {page.subtitle && (
                      <p className="text-xs text-school-muted font-medium line-clamp-2 leading-relaxed">
                        {page.subtitle}
                      </p>
                    )}

                    {/* Paragraph snippet */}
                    {page.content && page.content.length > 0 && (
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 bg-black/20 p-3 rounded-2xl border border-white/5">
                        {page.content[0]}
                      </p>
                    )}

                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-school-line/40 flex items-center justify-between text-xs font-bold text-school-cyan group-hover:underline">
                    <span className="flex items-center gap-1">
                      <span>קרא את התוכן המלא</span>
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    </span>
                    {page.pdfFiles && page.pdfFiles.length > 0 && (
                      <span className="text-[10px] text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md">
                        {page.pdfFiles.length} קבצי PDF
                      </span>
                    )}
                  </div>

                </div>
              ))}
            </div>

            {/* SHOW MORE BUTTON (+6 MORE CARDS EACH CLICK) */}
            {hasMorePages && (
              <div className="text-center pt-8">
                <button
                  type="button"
                  onClick={handleShowMore}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-school-cyan via-cyan-400 to-school-cyan text-slate-950 font-black text-xs hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer inline-flex items-center gap-2 shadow-lg"
                >
                  <PlusCircle className="w-4 h-4 shrink-0" />
                  <span>הצג עוד תכנים (+6 כרטיסיות)</span>
                </button>
                <p className="text-[11px] text-school-muted mt-2">
                  מוצגים כעת {visiblePages.length} מתוך {pageEntries.length} תכנים קיימים במערכת
                </p>
              </div>
            )}
          </>
        )}

      </section>

    </div>
  );
};
