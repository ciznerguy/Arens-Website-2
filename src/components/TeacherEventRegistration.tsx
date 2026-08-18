import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, Users, CheckCircle, AlertCircle, 
  Search, Sparkles, BookOpen, Cpu, HeartHandshake, Gamepad2, 
  Printer, ArrowRight, Phone, Mail, User, Check, RefreshCw,
  ExternalLink, Info, ShieldCheck, ChevronRight, Share2, MessageCircle, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TeacherEvent, Workshop, WorkshopRegistration } from '../types';
import { 
  getStoredEvents, 
  getStoredRegistrations, 
  getWorkshopCapacity, 
  registerTeacherForWorkshop,
  formatToIsraeliDate,
  subscribeToTeacherEvents,
  subscribeToRegistrations
} from '../services/eventsStorage';

interface TeacherEventRegistrationProps {
  initialEventId?: string;
  onBackToPortal?: () => void;
  onBack?: () => void;
  onOpenAdmin?: () => void;
}

export const TeacherEventRegistration: React.FC<TeacherEventRegistrationProps> = ({
  initialEventId,
  onBackToPortal,
  onBack,
  onOpenAdmin
}) => {
  const handleBack = onBackToPortal || onBack;
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [events, setEvents] = useState<TeacherEvent[]>(getStoredEvents());
  const [selectedEventId, setSelectedEventId] = useState<string>(() => {
    if (initialEventId) return initialEventId;
    const list = getStoredEvents();
    const openEvent = list.find(e => e.status === 'open');
    return openEvent ? openEvent.id : (list[0]?.id || '');
  });

  useEffect(() => {
    if (initialEventId) {
      setSelectedEventId(initialEventId);
    }
  }, [initialEventId]);

  const [registrations, setRegistrations] = useState<WorkshopRegistration[]>(getStoredRegistrations());
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [roleOrSubject, setRoleOrSubject] = useState('');
  const [notes, setNotes] = useState('');

  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successRegistration, setSuccessRegistration] = useState<WorkshopRegistration | null>(null);

  // Lookup existing registration
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<WorkshopRegistration | null | undefined>(undefined);

  // Listen to storage sync events
  useEffect(() => {
    const unsubEvents = subscribeToTeacherEvents((liveEvents) => {
      setEvents(liveEvents);
    });
    const unsubRegs = subscribeToRegistrations((liveRegs) => {
      setRegistrations(liveRegs);
    });
    const syncData = () => {
      setEvents(getStoredEvents());
      setRegistrations(getStoredRegistrations());
    };
    window.addEventListener('arens_events_updated', syncData);
    window.addEventListener('arens_registrations_updated', syncData);
    return () => {
      unsubEvents();
      unsubRegs();
      window.removeEventListener('arens_events_updated', syncData);
      window.removeEventListener('arens_registrations_updated', syncData);
    };
  }, []);

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];

  // Categories list
  const categories = currentEvent?.workshops
    ? ['all', ...Array.from(new Set(currentEvent.workshops.map(w => w.category || 'כללי')))]
    : ['all'];

  // Filtered workshops
  const filteredWorkshops = (currentEvent?.workshops || []).filter(w => {
    const matchesCategory = selectedCategory === 'all' || (w.category || 'כללי') === selectedCategory;
    const matchesSearch = 
      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.room.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectWorkshop = (workshop: Workshop) => {
    const capacity = getWorkshopCapacity(workshop, currentEvent.id, registrations);
    if (capacity.isFull) {
      setErrorMessage(`הסדנה "${workshop.title}" מלאה לחלוטין. אנא בחר/י סדנה אחרת.`);
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }
    setSelectedWorkshopId(workshop.id);
    setErrorMessage(null);
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkshopId) {
      setErrorMessage('נא לבחור סדנה מהרשימה לפני השליחה');
      return;
    }
    if (!fullName.trim() || !phone.trim() || !email.trim() || !roleOrSubject.trim()) {
      setErrorMessage('נא למלא את כל שדות החובה המסומנים בכוכבית (*)');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await registerTeacherForWorkshop(currentEvent, selectedWorkshopId, {
        fullName,
        phone,
        email,
        roleOrSubject,
        notes
      });

      if (res.success && res.registration) {
        setSuccessRegistration(res.registration);
        setRegistrations(getStoredRegistrations());
      } else {
        setErrorMessage(res.error || 'חלה שגיאה ברישום. נסו שוב.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'שגיאת תקשורת בביצוע ההרשמה');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = lookupQuery.trim().toLowerCase().replace(/[^0-9a-z@._-]/g, '');
    if (!clean) return;

    const found = registrations.find(r => 
      r.eventId === currentEvent?.id && (
        r.phone.replace(/[^0-9]/g, '') === clean.replace(/[^0-9]/g, '') ||
        r.email.trim().toLowerCase() === clean
      )
    );
    setLookupResult(found || null);
  };

  const getWorkshopIcon = (category?: string, icon?: string) => {
    if (icon === 'Cpu' || category?.includes('AI')) return <Cpu className="w-5 h-5 text-cyan-400" />;
    if (icon === 'HeartHandshake' || category?.includes('חוסן')) return <HeartHandshake className="w-5 h-5 text-rose-400" />;
    if (icon === 'Sparkles' || category?.includes('PBL')) return <Sparkles className="w-5 h-5 text-amber-400" />;
    if (icon === 'Gamepad2' || category?.includes('משחוק')) return <Gamepad2 className="w-5 h-5 text-emerald-400" />;
    return <BookOpen className="w-5 h-5 text-school-cyan" />;
  };

  return (
    <div className="min-h-screen bg-[#080d19] text-slate-100 py-10 px-4 md:px-8 font-sans selection:bg-school-cyan selection:text-slate-900" dir="rtl">
      
      {/* Top Breadcrumb & Controls */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-school-line/60 pb-4">
        <div className="flex items-center gap-2 text-xs text-school-muted">
          {onBackToPortal && (
            <button 
              onClick={onBackToPortal}
              className="hover:text-school-cyan transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>חזרה לפורטל המורים</span>
            </button>
          )}
          <span className="opacity-40">/</span>
          <span className="text-white font-bold">מערכת רישום ושיבוץ סדנאות</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setIsLookupOpen(true); setLookupResult(undefined); setLookupQuery(''); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-school-panel border border-school-line text-xs font-bold text-school-cyan hover:border-school-cyan/40 hover:bg-school-cyan/10 transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>בדיקת שיבוץ אישי</span>
          </button>

          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-school-panel2 border border-school-line text-xs font-bold text-amber-400 hover:border-amber-400/50 hover:bg-amber-400/10 transition-all cursor-pointer"
              title="כניסה לממשק ניהול סדנאות ו-Google Workspace"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>פאנל ניהול וסנכרון</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* EVENT HERO BANNER */}
        {currentEvent && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#101b33] via-[#0d1629] to-[#080d19] border border-school-cyan/30 p-6 md:p-10 shadow-2xl">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-school-cyan/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-school-cyan/15 border border-school-cyan/30 text-school-cyan text-xs font-black tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>שש-שנתי ע"ש משה ארנס | הרשמה לסדנאות צוות</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* WhatsApp Direct Share */}
                  <button
                    type="button"
                    onClick={() => {
                      const base = window.location.origin + window.location.pathname;
                      const directLink = `${base}#teachers-events?eventId=${currentEvent.id}`;
                      const formattedDate = formatToIsraeliDate(currentEvent.date);
                      const msg = `שלום לצוות ארנס 🌟\nמצורף קישור ישיר להרשמה ובחירת סדנה ליום ההיערכות והפדגוגיה:\n📌 *${currentEvent.title}*\n📅 *תאריך:* ${formattedDate}\n⏰ *שעות:* ${currentEvent.hours}\n📍 *מיקום:* ${currentEvent.location}\n\n🔗 *לכניסה ובחירת סדנה ישירות:*\n${directLink}\n\nנא להזדרז ולהירשם - המקומות מוגבלים!`;
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                    title="שתף קישור ישיר להרשמה בקבוצת המורים בוואטסאפ"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>שליחה בוואטסאפ</span>
                  </button>

                  {/* Copy Direct Link */}
                  <button
                    type="button"
                    onClick={async () => {
                      const base = window.location.origin + window.location.pathname;
                      const directLink = `${base}#teachers-events?eventId=${currentEvent.id}`;
                      try {
                        await navigator.clipboard.writeText(directLink);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2500);
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-school-panel border border-school-line text-xs font-bold text-school-cyan hover:border-school-cyan hover:bg-school-cyan/10 transition-all cursor-pointer"
                    title="העתק קישור ישיר"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-black">הקישור הועתק!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>העתק קישור ישיר</span>
                      </>
                    )}
                  </button>

                  {/* Status Badge */}
                  <div className={`px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 ${
                    currentEvent.status === 'open' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                    currentEvent.status === 'closed' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${currentEvent.status === 'open' ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
                    <span>
                      {currentEvent.status === 'open' ? 'ההרשמה פתוחה כעת' :
                       currentEvent.status === 'closed' ? 'ההרשמה נסגרה' :
                       currentEvent.status === 'completed' ? 'האירוע הסתיים' : 'טיוטת אירוע'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-2xl md:text-4xl font-black text-white leading-tight flex flex-wrap items-center gap-3">
                  <span>{currentEvent.title}</span>
                  {currentEvent.date && (
                    <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-black text-school-cyan bg-school-cyan/15 border border-school-cyan/35 px-3 py-1 rounded-xl font-mono shadow-sm" dir="ltr">
                      <Calendar className="w-3.5 h-3.5 text-school-cyan" />
                      <span>{formatToIsraeliDate(currentEvent.date)}</span>
                    </span>
                  )}
                </h1>
                {currentEvent.subtitle && (
                  <p className="text-sm md:text-base text-school-cyan font-medium mt-1.5">
                    {currentEvent.subtitle}
                  </p>
                )}
                <p className="text-xs md:text-sm text-school-muted mt-3 max-w-3xl leading-relaxed">
                  {currentEvent.description}
                </p>
              </div>

              {/* Event Meta Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="flex items-center gap-3 bg-[#080d19]/80 border border-school-line/60 rounded-2xl p-3">
                  <div className="p-2 rounded-xl bg-school-cyan/10 text-school-cyan">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-school-muted font-bold">תאריך האירוע</p>
                    <p className="text-xs font-black text-white font-mono" dir="ltr">{formatToIsraeliDate(currentEvent.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#080d19]/80 border border-school-line/60 rounded-2xl p-3">
                  <div className="p-2 rounded-xl bg-school-cyan/10 text-school-cyan">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-school-muted font-bold">לוח זמנים</p>
                    <p className="text-xs font-black text-white">{currentEvent.hours}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#080d19]/80 border border-school-line/60 rounded-2xl p-3">
                  <div className="p-2 rounded-xl bg-school-cyan/10 text-school-cyan">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-school-muted font-bold">מיקום מרכזי</p>
                    <p className="text-xs font-black text-white truncate max-w-[140px]">{currentEvent.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#080d19]/80 border border-school-line/60 rounded-2xl p-3">
                  <div className="p-2 rounded-xl bg-school-cyan/10 text-school-cyan">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-school-muted font-bold">נרשמו עד כה</p>
                    <p className="text-xs font-black text-school-cyan">
                      {registrations.filter(r => r.eventId === currentEvent.id).length} מורים
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule Timeline Accordion */}
              {currentEvent.schedule && currentEvent.schedule.length > 0 && (
                <div className="border-t border-school-line/40 pt-4 mt-2">
                  <p className="text-xs font-bold text-school-cyan mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>לוח זמנים מפורט של יום ההיערכות:</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {currentEvent.schedule.map((item, idx) => (
                      <div key={idx} className="bg-[#101b33]/60 border border-school-line/30 rounded-xl p-2.5 flex items-start gap-2">
                        <span className="font-mono text-school-cyan text-[11px] font-bold shrink-0">{item.time}</span>
                        <div className="min-w-0">
                          <p className="font-bold text-white text-[11px] truncate">{item.activity}</p>
                          {item.location && <p className="text-[10px] text-school-muted truncate">{item.location}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* STEP 1: WORKSHOP SELECTION */}
        <div className="space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-school-cyan text-slate-950 text-xs font-black">1</span>
                <span>בחירת סדנה פדגוגית להרשמה</span>
              </h2>
              <p className="text-xs text-school-muted mt-1">
                יש לבחור סדנה אחת בלבד. המערכת נועלת אוטומטית סדנאות שהגיעו למכסת המקסימום.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-school-cyan text-slate-900 shadow-md shadow-school-cyan/20'
                      : 'bg-school-panel border border-school-line text-school-muted hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'כל הסדנאות' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-school-muted absolute right-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="חיפוש סדנה לפי שם, מנחה, נושא או חדר..."
              className="w-full bg-[#101b33] border border-school-line/60 rounded-2xl py-3 pr-10 pl-4 text-xs text-white focus:outline-none focus:border-school-cyan transition-all"
            />
          </div>

          {/* Workshop Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWorkshops.map((workshop) => {
              const capacity = getWorkshopCapacity(workshop, currentEvent.id, registrations);
              const isSelected = selectedWorkshopId === workshop.id;

              return (
                <div
                  key={workshop.id}
                  onClick={() => !capacity.isFull && handleSelectWorkshop(workshop)}
                  className={`relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between border ${
                    capacity.isFull 
                      ? 'bg-[#0b101d] border-rose-950/60 opacity-60 cursor-not-allowed' 
                      : isSelected
                      ? 'bg-[#122143] border-school-cyan shadow-xl shadow-school-cyan/15 -translate-y-1 cursor-pointer ring-2 ring-school-cyan/40'
                      : 'bg-[#101b33] border-school-line hover:border-school-cyan/50 hover:bg-[#121f3d] cursor-pointer'
                  }`}
                >
                  {/* Selected Tick or Full Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/5 border border-school-line text-school-muted">
                      {workshop.category || 'סדנה מקצועית'}
                    </span>

                    {capacity.isFull ? (
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400">
                        הסדנה מלאה
                      </span>
                    ) : isSelected ? (
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-school-cyan text-slate-900 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>נבחרה</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        נותרו {capacity.remainingSeats} מקומות
                      </span>
                    )}
                  </div>

                  {/* Title & Details */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-2xl bg-school-cyan/10 border border-school-cyan/20 shrink-0">
                        {getWorkshopIcon(workshop.category, workshop.icon)}
                      </div>
                      <div>
                        <h3 className="font-black text-white text-base leading-snug">
                          {workshop.title}
                        </h3>
                        <p className="text-xs text-school-cyan font-semibold mt-0.5">
                          מנחה: {workshop.instructor}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-school-muted leading-relaxed line-clamp-3">
                      {workshop.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-300">
                      <span className="flex items-center gap-1 bg-[#080d19] px-2.5 py-1 rounded-lg border border-school-line/40">
                        <MapPin className="w-3 h-3 text-school-cyan" />
                        <span>{workshop.room}</span>
                      </span>
                      <span className="flex items-center gap-1 bg-[#080d19] px-2.5 py-1 rounded-lg border border-school-line/40">
                        <Clock className="w-3 h-3 text-school-cyan" />
                        <span>{workshop.timeSlot}</span>
                      </span>
                    </div>
                  </div>

                  {/* Capacity Progress Bar */}
                  <div className="space-y-1.5 pt-4 mt-4 border-t border-school-line/40">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-school-muted">תפוסת חדר</span>
                      <span className={capacity.isFull ? 'text-rose-400' : 'text-white'}>
                        {capacity.registeredCount} / {capacity.totalCapacity} ({capacity.occupancyPercentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#080d19] overflow-hidden border border-school-line/30">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          capacity.isFull 
                            ? 'bg-rose-500' 
                            : capacity.occupancyPercentage > 80 
                            ? 'bg-amber-400' 
                            : 'bg-gradient-to-r from-school-cyan to-cyan-400'
                        }`}
                        style={{ width: `${capacity.occupancyPercentage}%` }}
                      />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* STEP 2: TEACHER REGISTRATION FORM */}
        <div className="bg-[#101b33] border border-school-line rounded-3xl p-6 md:p-10 space-y-6 shadow-2xl">
          
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-school-cyan text-slate-950 text-xs font-black">2</span>
              <span>פרטי המורה ואישור שיבוץ</span>
            </h2>
            <p className="text-xs text-school-muted mt-1">
              אנא מלאו את הפרטים האישיים במדויק. עם השליחה, השיבוץ ישוריין אוטומטית ויתועד ביומן האירוע.
            </p>
          </div>

          {/* Active selection summary banner */}
          {selectedWorkshopId ? (
            <div className="p-4 rounded-2xl bg-school-cyan/10 border border-school-cyan/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-school-cyan text-slate-900">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-school-cyan uppercase tracking-wider">הסדנה שנבחרה לשיבוץ:</p>
                  <p className="text-sm font-black text-white">
                    {currentEvent.workshops.find(w => w.id === selectedWorkshopId)?.title}
                  </p>
                  <p className="text-xs text-school-muted">
                    חדר: {currentEvent.workshops.find(w => w.id === selectedWorkshopId)?.room} | שעות: {currentEvent.workshops.find(w => w.id === selectedWorkshopId)?.timeSlot}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedWorkshopId(null)}
                className="text-xs text-school-cyan hover:underline font-bold"
              >
                החלף סדנה
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 font-bold">
              <Info className="w-4 h-4 shrink-0" />
              <span>טרם בחרת סדנה. אנא לחץ/י על כרטיס הסדנה הרצויה מתוך הרשימה מעלה.</span>
            </div>
          )}

          {/* Error notice */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 font-bold animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmitRegistration} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white flex items-center gap-1">
                  <span>שם מלא</span>
                  <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-school-muted absolute right-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="לדוגמה: ישראל ישראלי"
                    className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-3 pr-10 pl-4 text-xs text-white focus:outline-none focus:border-school-cyan font-bold"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white flex items-center gap-1">
                  <span>מספר טלפון נייד</span>
                  <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-school-muted absolute right-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="לדוגמה: 050-1234567"
                    className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-3 pr-10 pl-4 text-xs text-white focus:outline-none focus:border-school-cyan font-bold"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white flex items-center gap-1">
                  <span>כתובת דוא״ל</span>
                  <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-school-muted absolute right-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@arens.tik-tak.school"
                    className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-3 pr-10 pl-4 text-xs text-white focus:outline-none focus:border-school-cyan font-bold"
                  />
                </div>
              </div>

              {/* Role or Subject */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white flex items-center gap-1">
                  <span>תפקיד בבית הספר / מקצוע הוראה</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={roleOrSubject}
                  onChange={(e) => setRoleOrSubject(e.target.value)}
                  placeholder="לדוגמה: מחנך כיתה ט׳ / מורה למדעים / רכזת"
                  className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-school-cyan font-bold"
                />
              </div>

            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white">
                הערות מיוחדות / בקשות נגישות / תזונה (אופציונלי)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="אם יש צורך בהנגשה מיוחדת, רגישויות מזון או נושא ספציפי שתרצו להעלות בסדנה..."
                className="w-full bg-[#080d19] border border-school-line/60 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-school-cyan resize-none"
              />
            </div>

            {/* Submit button */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-school-line/50">
              <button
                type="submit"
                disabled={isSubmitting || !selectedWorkshopId}
                className="btn px-8 py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-school-cyan to-cyan-400 text-school-bg shadow-[0_4px_25px_rgba(34,211,238,0.35)] hover:shadow-[0_6px_35px_rgba(34,211,238,0.5)] hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>שומר שיבוץ במערכת...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>אישור הרשמה ושיבוץ לסדנה</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* CONFIRMATION TICKET POPUP MODAL */}
      <AnimatePresence>
        {successRegistration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#101b33] border border-school-cyan rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 text-right relative overflow-hidden"
            >
              {/* Confetti decoration / gradient background */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-school-cyan/20 rounded-full blur-2xl pointer-events-none" />

              <div className="text-center space-y-2 border-b border-school-line/60 pb-5">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white">
                  השיבוץ נקלט בהצלחה!
                </h3>
                <p className="text-xs text-school-muted">
                  כרטיס שיבוץ רשמי לסדנת יום ההיערכות בשש-שנתי ע"ש משה ארנס
                </p>
              </div>

              {/* Printable Ticket Box */}
              <div id="print-registration-ticket" className="bg-[#080d19] border border-school-cyan/40 rounded-2xl p-5 space-y-4 shadow-inner">
                
                <div className="flex items-center justify-between border-b border-school-line/40 pb-3">
                  <div>
                    <p className="text-[10px] text-school-cyan font-bold uppercase">שם המורה</p>
                    <p className="text-base font-black text-white">{successRegistration.fullName}</p>
                  </div>
                  <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-md text-school-muted font-mono">
                    {successRegistration.roleOrSubject}
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] text-school-muted">סדנה שנבחרה:</p>
                    <p className="text-sm font-black text-school-cyan">{successRegistration.workshopTitle}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[10px] text-school-muted">מיקום / חדר:</p>
                      <p className="font-bold text-white">{successRegistration.room}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-school-muted">שעות הסדנה:</p>
                      <p className="font-bold text-white">{successRegistration.timeSlot}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-school-muted">מנחה:</p>
                      <p className="font-bold text-white">{successRegistration.instructor}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-school-muted">מועד רישום:</p>
                      <p className="font-bold text-white">{successRegistration.registeredAt}</p>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-school-muted border-t border-school-line/40 pt-2 text-center font-mono">
                  קוד אישור: {successRegistration.id}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>הדפסת כרטיס</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSuccessRegistration(null);
                    setSelectedWorkshopId(null);
                    setFullName('');
                    setPhone('');
                    setEmail('');
                    setRoleOrSubject('');
                    setNotes('');
                  }}
                  className="btn px-6 py-2.5 rounded-xl text-xs font-black bg-school-cyan text-slate-900 hover:bg-cyan-300 transition-all cursor-pointer"
                >
                  סגור וסיים
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LOOKUP EXISTING REGISTRATION MODAL */}
      <AnimatePresence>
        {isLookupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#101b33] border border-school-line rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-right"
            >
              <div className="flex items-center justify-between border-b border-school-line pb-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-school-cyan" />
                  <span>בדיקת שיבוץ אישי קיים</span>
                </h3>
                <button 
                  onClick={() => setIsLookupOpen(false)}
                  className="text-school-muted hover:text-white text-xs font-bold"
                >
                  סגור
                </button>
              </div>

              <form onSubmit={handleLookup} className="space-y-3">
                <label className="text-xs text-school-muted block">
                  הזינו מספר טלפון או כתובת אימייל שנרשמתם עמם:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    placeholder="050-1234567 או email@domain.com"
                    className="flex-1 bg-[#080d19] border border-school-line rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-school-cyan"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-school-cyan text-slate-900 text-xs font-bold hover:bg-cyan-300 transition-all"
                  >
                    חפש
                  </button>
                </div>
              </form>

              {lookupResult !== undefined && (
                <div className="pt-2">
                  {lookupResult ? (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-xs">
                      <p className="font-black text-emerald-400">נמצא שיבוץ עבור {lookupResult.fullName}:</p>
                      <p className="text-white font-bold">סדנה: {lookupResult.workshopTitle}</p>
                      <p className="text-school-muted">חדר: {lookupResult.room} | שעות: {lookupResult.timeSlot}</p>
                      <p className="text-[10px] text-school-muted">תאריך רישום: {lookupResult.registeredAt}</p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold">
                      לא נמצא רישום התואם לפרטים שהזנת לאירוע זה.
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
