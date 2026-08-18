import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, Clock, MapPin, Users, Plus, Trash2, Edit3, Save, 
  FileSpreadsheet, FileText, Printer, Download, RefreshCw, CheckCircle, 
  AlertCircle, Search, ArrowRight, ShieldCheck, UserPlus, MoveRight, 
  ExternalLink, Layers, Check, X, Sliders, Sparkles, Database,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Copy, ListPlus,
  Share2, MessageCircle, Loader2
} from 'lucide-react';

import { motion, AnimatePresence } from 'motion/react';
import { TeacherEvent, Workshop, WorkshopRegistration, EventStatus } from '../types';
import { 
  getStoredEvents, 
  saveStoredEvents, 
  deleteStoredEvent,
  getStoredRegistrations, 
  saveStoredRegistrations,
  getWorkshopCapacity,
  moveTeacherToWorkshop,
  cancelRegistration,
  formatToIsraeliDate,
  DEFAULT_TEACHER_EVENT,
  subscribeToTeacherEvents,
  subscribeToRegistrations
} from '../services/eventsStorage';
import { 
  requestGoogleAccessToken,
  createEventGoogleSheet, 
  syncAllRegistrationsToGoogleSheet, 
  createAssignmentGoogleDoc, 
  createDoorSignsGoogleDoc, 
  downloadRegistrationsCSV,
  copyRegistrationsToClipboard,
  openGoogleSheetsDirect,
  openGoogleDocsDirect,
  openPrintableAssignmentReport,
  downloadAssignmentDoc,
  getStoredAccessToken
} from '../services/googleWorkspace';

interface TeacherEventsAdminProps {
  onBack?: () => void;
  onOpenPublicRegistration?: () => void;
}

export const TeacherEventsAdmin: React.FC<TeacherEventsAdminProps> = ({
  onBack,
  onOpenPublicRegistration
}) => {
  const [events, setEvents] = useState<TeacherEvent[]>(getStoredEvents());
  const [selectedEventId, setSelectedEventId] = useState<string>(() => {
    const list = getStoredEvents();
    return list[0]?.id || '';
  });

  const [registrations, setRegistrations] = useState<WorkshopRegistration[]>(getStoredRegistrations());

  // Active admin sub-tab: 'dashboard' | 'event-settings' | 'workshops' | 'registrations' | 'google-workspace'
  const [subTab, setSubTab] = useState<'dashboard' | 'event-settings' | 'workshops' | 'registrations' | 'google-workspace'>('dashboard');

  // Search & Filters in Registrations table
  const [filterWorkshop, setFilterWorkshop] = useState<string>('all');
  const [regSearchTerm, setRegSearchTerm] = useState<string>('');

  // Status & Notification
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string; link?: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Workshop Edit / Add Modal
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [isNewWorkshop, setIsNewWorkshop] = useState<boolean>(false);

  // Schedule Item Edit / Add Modal
  const [editingScheduleIndex, setEditingScheduleIndex] = useState<number | null>(null);
  const [isAddingSchedule, setIsAddingSchedule] = useState<boolean>(false);
  const [scheduleForm, setScheduleForm] = useState<{ time: string; activity: string; location: string }>({
    time: '',
    activity: '',
    location: ''
  });

  // Manual Add Registration Modal
  const [isManualAddOpen, setIsManualAddOpen] = useState<boolean>(false);
  const [manualForm, setManualForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    roleOrSubject: '',
    workshopId: '',
    notes: ''
  });

  // Transfer Teacher Modal
  const [transferTargetReg, setTransferTargetReg] = useState<WorkshopRegistration | null>(null);
  const [targetWorkshopId, setTargetWorkshopId] = useState<string>('');

  // Date picker calendar popover & state
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [calendarViewDate, setCalendarViewDate] = useState<Date>(() => {
    const list = getStoredEvents();
    const ev = list[0];
    return ev?.date ? new Date(ev.date) : new Date();
  });

  // Delete event confirmation modal
  const [isDeleteEventModalOpen, setIsDeleteEventModalOpen] = useState<boolean>(false);

  // Door Signs Print Preview Modal
  const [isPrintDoorSignsOpen, setIsPrintDoorSignsOpen] = useState<boolean>(false);

  // Refresh data on mount or storage event
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

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0] || DEFAULT_TEACHER_EVENT;
  const eventRegistrations = registrations.filter(r => r.eventId === currentEvent.id);

  const [saveSuccessBanner, setSaveSuccessBanner] = useState<string | null>(null);

  const showNotification = (type: 'success' | 'error', message: string, link?: string) => {
    setNotification({ type, message, link });
    if (type === 'success') {
      setSaveSuccessBanner(message);
      setTimeout(() => setSaveSuccessBanner(null), 3500);
    }
    setTimeout(() => setNotification(null), 6000);
  };

  // ==========================================
  // EVENT SETTINGS HANDLERS
  // ==========================================
  const handleUpdateEventField = (field: keyof TeacherEvent, value: any) => {
    const updatedEvents = events.map(ev => {
      if (ev.id === currentEvent.id) {
        return { ...ev, [field]: value };
      }
      return ev;
    });
    setEvents(updatedEvents);
    saveStoredEvents(updatedEvents);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await saveStoredEvents(events);
      showNotification('success', '✓ השינויים נשמרו בהצלחה וסונכרנו לענן!');
    } catch (err) {
      console.error('Error saving event:', err);
      showNotification('error', 'אירעה שגיאה בשמירת הנתונים לענן. אנא נסה שוב.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateNewEvent = () => {
    const newId = 'event-' + Date.now().toString(36);
    const newEv: TeacherEvent = {
      id: newId,
      title: 'אירוע סדנאות חדש לצוות',
      subtitle: 'סדנאות והשתלמות מקצועית',
      description: 'תיאור האירוע ופירוט מטרותיו עבור הצוות החינוכי...',
      date: new Date().toISOString().split('T')[0],
      hours: '08:30 - 13:30',
      location: 'קמפוס ארנס',
      contactPerson: 'מזכירות בית הספר',
      contactEmail: 'office@arens.tik-tak.school',
      status: 'draft',
      workshops: []
    };
    const updated = [...events, newEv];
    setEvents(updated);
    setSelectedEventId(newId);
    saveStoredEvents(updated);
    setSubTab('event-settings');
    showNotification('success', 'אירוע חדש נוצר בהצלחה!');
  };

  const handleConfirmDeleteEvent = async () => {
    if (!currentEvent) return;
    await deleteStoredEvent(currentEvent.id);
    const remainingEvents = getStoredEvents();
    setEvents(remainingEvents);
    setIsDeleteEventModalOpen(false);

    if (remainingEvents.length > 0) {
      setSelectedEventId(remainingEvents[0].id);
    } else {
      setSelectedEventId('');
    }
    showNotification('success', `האירוע "${currentEvent.title}" וכל הנרשמים אליו נמחקו לצמיתות.`);
  };


  // ==========================================
  // WORKSHOP MANAGEMENT HANDLERS
  // ==========================================
  const handleOpenAddWorkshop = () => {
    setEditingWorkshop({
      id: 'ws-' + Date.now().toString(36),
      title: '',
      description: '',
      instructor: '',
      room: '',
      maxCapacity: 20,
      timeSlot: currentEvent.hours || '10:30 - 12:30',
      category: 'פדגוגיה'
    });
    setIsNewWorkshop(true);
  };

  const handleDuplicateWorkshop = (ws: Workshop) => {
    const duplicated: Workshop = {
      ...ws,
      id: 'ws-' + Date.now().toString(36),
      title: `${ws.title} (העתק)`,
    };
    const updated = [...(currentEvent.workshops || []), duplicated];
    handleUpdateEventField('workshops', updated);
    showNotification('success', `הסדנה "${ws.title}" שוכפלה בהצלחה!`);
  };

  const handleSaveWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkshop || !editingWorkshop.title.trim()) return;

    let updatedWorkshops = [...(currentEvent.workshops || [])];
    if (isNewWorkshop) {
      updatedWorkshops.push(editingWorkshop);
    } else {
      updatedWorkshops = updatedWorkshops.map(w => w.id === editingWorkshop.id ? editingWorkshop : w);
    }

    handleUpdateEventField('workshops', updatedWorkshops);
    setEditingWorkshop(null);
    showNotification('success', `הסדנה "${editingWorkshop.title}" נשמרה בהצלחה!`);
  };

  const handleDeleteWorkshop = (workshopId: string) => {
    if (!confirm('האם אתם בטוחים שברצונכם למחוק סדנה זו?')) return;
    const updatedWorkshops = (currentEvent.workshops || []).filter(w => w.id !== workshopId);
    handleUpdateEventField('workshops', updatedWorkshops);
    showNotification('success', 'הסדנה נמחקה בהצלחה.');
  };

  // ==========================================
  // SCHEDULE MANAGEMENT HANDLERS
  // ==========================================
  const handleOpenAddSchedule = () => {
    setScheduleForm({ time: '', activity: '', location: '' });
    setIsAddingSchedule(true);
    setEditingScheduleIndex(null);
  };

  const handleOpenEditSchedule = (index: number) => {
    const item = (currentEvent.schedule || [])[index];
    if (!item) return;
    setScheduleForm({
      time: item.time,
      activity: item.activity,
      location: item.location || ''
    });
    setEditingScheduleIndex(index);
    setIsAddingSchedule(false);
  };

  const handleSaveScheduleItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleForm.time.trim() || !scheduleForm.activity.trim()) return;

    let currentSchedule = [...(currentEvent.schedule || [])];
    if (isAddingSchedule) {
      currentSchedule.push({
        time: scheduleForm.time.trim(),
        activity: scheduleForm.activity.trim(),
        location: scheduleForm.location.trim()
      });
    } else if (editingScheduleIndex !== null) {
      currentSchedule[editingScheduleIndex] = {
        time: scheduleForm.time.trim(),
        activity: scheduleForm.activity.trim(),
        location: scheduleForm.location.trim()
      };
    }

    handleUpdateEventField('schedule', currentSchedule);
    setIsAddingSchedule(false);
    setEditingScheduleIndex(null);
    setScheduleForm({ time: '', activity: '', location: '' });
    showNotification('success', 'לוח הזמנים עודכן בהצלחה!');
  };

  const handleDeleteScheduleItem = (index: number) => {
    const currentSchedule = (currentEvent.schedule || []).filter((_, i) => i !== index);
    handleUpdateEventField('schedule', currentSchedule);
    showNotification('success', 'שורת הלו״ז נמחקה בהצלחה.');
  };

  const handleMoveScheduleItem = (index: number, direction: 'up' | 'down') => {
    const currentSchedule = [...(currentEvent.schedule || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentSchedule.length) return;

    const temp = currentSchedule[index];
    currentSchedule[index] = currentSchedule[targetIndex];
    currentSchedule[targetIndex] = temp;

    handleUpdateEventField('schedule', currentSchedule);
  };

  const handleApplyDefaultSchedule = () => {
    if (!confirm('האם להחיל לוח זמנים מומלץ סטנדרטי ליום היערכות?')) return;
    const defaultSchedule = [
      { time: '08:30 - 09:00', activity: 'התכנסות, קפה וכיבוד בוקר חגיגי', location: 'לובי האודיטוריום' },
      { time: '09:00 - 10:15', activity: 'מליאת פתיחה: דבר המנהלת והצגת יעדי השנה', location: 'אודיטוריום מרכזי' },
      { time: '10:15 - 10:45', activity: 'הפסקת התרעננות ושיח עמיתים', location: 'רחבת המורים' },
      { time: '10:45 - 12:45', activity: 'מושבי סדנאות פדגוגיות (בחירה מראש לפי מכסות)', location: 'מרחבי הלמידה והמעבדות' },
      { time: '12:45 - 13:15', activity: 'ארוחת צהריים משותפת', location: 'חדר אוכל / מתחם מורים' },
      { time: '13:15 - 14:00', activity: 'מליאת סיכום, תובנות וברכות לשנה החדשה', location: 'אודיטוריום מרכזי' }
    ];
    handleUpdateEventField('schedule', defaultSchedule);
    showNotification('success', 'לוח זמנים סטנדרטי נטען בהצלחה!');
  };

  // ==========================================
  // REGISTRATIONS MANAGEMENT HANDLERS
  // ==========================================
  const handleTransferTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTargetReg || !targetWorkshopId) return;

    const res = moveTeacherToWorkshop(transferTargetReg.id, targetWorkshopId, currentEvent);
    if (res.success) {
      setRegistrations(getStoredRegistrations());
      setTransferTargetReg(null);
      setTargetWorkshopId('');
      showNotification('success', 'המורה הועבר/ה לסדנה החדשה בהצלחה!');
    } else {
      showNotification('error', res.error || 'שגיאה בהעברת המורה');
    }
  };

  const handleDeleteRegistration = (regId: string, teacherName: string) => {
    if (!confirm(`האם לבטל את שיבוץ המורה "${teacherName}"? פעולה זו תפנה מקום מיידית בסדנה.`)) return;
    cancelRegistration(regId, currentEvent);
    setRegistrations(getStoredRegistrations());
    showNotification('success', `שיבוץ ${teacherName} בוטל והמקום פונה בהצלחה.`);
  };

  const handleManualAddRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.fullName.trim() || !manualForm.workshopId) return;

    const workshop = currentEvent.workshops.find(w => w.id === manualForm.workshopId);
    if (!workshop) return;

    const newReg: WorkshopRegistration = {
      id: 'reg-' + Date.now().toString(36),
      eventId: currentEvent.id,
      workshopId: workshop.id,
      workshopTitle: workshop.title,
      fullName: manualForm.fullName.trim(),
      phone: manualForm.phone.trim() || '050-0000000',
      email: manualForm.email.trim() || 'teacher@arens.tik-tak.school',
      roleOrSubject: manualForm.roleOrSubject.trim() || 'צוות הוראה',
      notes: manualForm.notes.trim(),
      registeredAt: new Date().toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' }),
      room: workshop.room,
      timeSlot: workshop.timeSlot,
      instructor: workshop.instructor
    };

    const updated = [...registrations, newReg];
    setRegistrations(updated);
    saveStoredRegistrations(updated);
    setIsManualAddOpen(false);
    setManualForm({ fullName: '', phone: '', email: '', roleOrSubject: '', workshopId: '', notes: '' });
    showNotification('success', `המורה ${newReg.fullName} שובץ/ה בהצלחה לסדנה "${workshop.title}"!`);
  };

  const handleResetAllRegistrations = () => {
    if (!confirm('אזהרה: פעולה זו תמחק את כל הנרשמים לאירוע הנוכחי! האם להמשיך?')) return;
    const remaining = registrations.filter(r => r.eventId !== currentEvent.id);
    setRegistrations(remaining);
    saveStoredRegistrations(remaining);
    showNotification('success', 'כל רשימות הנרשמים לאירוע אופסו בהצלחה.');
  };

  const getDirectRegistrationLink = () => {
    const base = window.location.origin + window.location.pathname;
    return `${base}#teachers-events?eventId=${currentEvent.id}`;
  };

  const handleShareWhatsApp = () => {
    const directLink = getDirectRegistrationLink();
    const formattedDate = formatToIsraeliDate(currentEvent.date);
    const msg = `שלום לצוות ארנס 🌟\nמצורף קישור ישיר להרשמה ובחירת סדנה ליום ההיערכות והפדגוגיה:\n📌 *${currentEvent.title}*\n📅 *תאריך:* ${formattedDate}\n⏰ *שעות:* ${currentEvent.hours}\n📍 *מיקום:* ${currentEvent.location}\n\n🔗 *לכניסה ובחירת סדנה ישירות מהנייד/מחשב:*\n${directLink}\n\nנא להזדרז ולהירשם - המקומות בכל סדנה מוגבלים!`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyDirectLink = async () => {
    const directLink = getDirectRegistrationLink();
    try {
      await navigator.clipboard.writeText(directLink);
      showNotification('success', 'הקישור הישיר להרשמת המורים הועתק ללוח (Clipboard) בהצלחה!');
    } catch (e) {
      showNotification('error', 'לא ניתן היה להעתיק את הקישור אוטומטית. נסו שוב.');
    }
  };

  // ==========================================
  // GOOGLE WORKSPACE (SHEETS & DOCS) ACTIONS
  // ==========================================

  const handleCreateGoogleSheet = async () => {
    setIsProcessing(true);
    try {
      const res = await createEventGoogleSheet(currentEvent, eventRegistrations);
      handleUpdateEventField('googleSheetId', res.spreadsheetId);
      handleUpdateEventField('googleSheetUrl', res.spreadsheetUrl);
      window.open(res.spreadsheetUrl, '_blank');
      showNotification('success', 'גיליון Google Sheets נוצר בהצלחה בחשבונך ונפתח כעת!');
    } catch (err: any) {
      console.error(err);
      showNotification('error', err.message || 'שגיאה ביצירת גיליון Google Sheets בחשבונך. אנא ודא/י שאישרת גישה.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSyncToExistingGoogleSheet = async () => {
    if (!currentEvent.googleSheetId) {
      return handleCreateGoogleSheet();
    }
    setIsProcessing(true);
    try {
      await syncAllRegistrationsToGoogleSheet(currentEvent.googleSheetId, currentEvent, eventRegistrations);
      if (currentEvent.googleSheetUrl) {
        window.open(currentEvent.googleSheetUrl, '_blank');
      }
      showNotification('success', 'כל שורות הנרשמים סונכרנו בהצלחה לגיליון ה-Google Sheets שלך!');
    } catch (err: any) {
      console.error(err);
      showNotification('error', err.message || 'שגיאה בסנכרון הנתונים לגיליון');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateAssignmentGoogleDoc = async () => {
    setIsProcessing(true);
    try {
      const res = await openGoogleDocsDirect(currentEvent, eventRegistrations);
      showNotification('success', res.message);
    } catch (err: any) {
      console.error(err);
      downloadAssignmentDoc(currentEvent, eventRegistrations);
      showNotification('success', 'מסמך שיבוץ מעוצב הורד בהצלחה.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateDoorSignsGoogleDoc = async () => {
    setIsProcessing(true);
    try {
      setIsPrintDoorSignsOpen(true);
      showNotification('success', 'חלון הפקת שלטי דלתות נפתח.');
    } catch (err: any) {
      console.error(err);
      showNotification('error', err.message || 'שגיאה בהפקת שלטי דלתות');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filtered registrations table list
  const filteredRegs = eventRegistrations.filter(r => {
    const matchesWorkshop = filterWorkshop === 'all' || r.workshopId === filterWorkshop;
    const matchesSearch = 
      (r.fullName || '').toLowerCase().includes(regSearchTerm.toLowerCase()) ||
      (r.phone || '').includes(regSearchTerm) ||
      (r.email || '').toLowerCase().includes(regSearchTerm.toLowerCase()) ||
      (r.roleOrSubject || '').toLowerCase().includes(regSearchTerm.toLowerCase()) ||
      (r.workshopTitle || '').toLowerCase().includes(regSearchTerm.toLowerCase()) ||
      (r.notes || '').toLowerCase().includes(regSearchTerm.toLowerCase());
    return matchesWorkshop && matchesSearch;
  });

  // Calculate totals
  const totalCapacity = (currentEvent.workshops || []).reduce((sum, w) => sum + (w.maxCapacity || 0), 0);
  const totalRegistered = eventRegistrations.length;
  const overallOccupancyPct = totalCapacity > 0 ? Math.round((totalRegistered / totalCapacity) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#080d19] text-slate-100 py-8 px-4 md:px-8 font-sans selection:bg-school-cyan selection:text-slate-900 relative" dir="rtl">
      
      {/* FLOATING SUCCESS TOAST (PROMINENT GREEN NOTIFICATION) */}
      <AnimatePresence>
        {saveSuccessBanner && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-2xl shadow-emerald-950/60 border border-emerald-400 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{saveSuccessBanner}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BAR */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-school-line/60 pb-5">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-school-panel border border-school-line hover:text-school-cyan transition-all cursor-pointer"
                title="חזרה"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white">
                  ניהול אירועים וסדנאות לצוות המורים
                </h1>
                <span className="text-[10px] bg-school-cyan/20 text-school-cyan px-2 py-0.5 rounded-full font-bold border border-school-cyan/30">
                  Google Workspace Sync
                </span>
              </div>
              <p className="text-xs text-school-muted mt-0.5">
                בקרת הרשמות, תפוסות, שיבוצים ויצוא ישיר ל-Google Sheets ו-Google Docs
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Event Selector Dropdown */}
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="bg-[#101b33] border border-school-line rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-school-cyan"
            >
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} {ev.date ? `| ${formatToIsraeliDate(ev.date)}` : ''} ({ev.status === 'open' ? 'פתוח' : ev.status === 'draft' ? 'טיוטה' : 'סגור'})
                </option>
              ))}
            </select>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-emerald-600/20"
              title="שליחת הודעה והרשמה ישירה למורים בוואטסאפ"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>שליחה בוואטסאפ</span>
            </button>

            <button
              onClick={handleCopyDirectLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-school-panel border border-school-line text-xs font-bold text-school-cyan hover:border-school-cyan hover:bg-school-cyan/10 transition-all cursor-pointer"
              title="העתקת קישור ישיר לטופס ההרשמה של אירוע זה"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>העתק קישור ישיר</span>
            </button>

            <button
              onClick={handleCreateNewEvent}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-school-panel border border-school-line text-xs font-bold text-white hover:border-school-cyan hover:text-school-cyan transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>אירוע חדש</span>
            </button>

            {onOpenPublicRegistration && (
              <button
                onClick={onOpenPublicRegistration}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-school-cyan text-slate-900 text-xs font-black hover:bg-cyan-300 transition-all cursor-pointer shadow-md shadow-school-cyan/20"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>צפייה בטופס</span>
              </button>
            )}
          </div>
        </div>

        {/* NOTIFICATION TOAST */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 text-xs font-bold ${
                notification.type === 'success' 
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
                  : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {notification.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{notification.message}</span>
              </div>

              {notification.link && (
                <a
                  href={notification.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white font-bold flex items-center gap-1 text-[11px]"
                >
                  <span>פתח מסמך</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ADMIN SUB-TABS */}
        <div className="flex flex-wrap items-center gap-2 border-b border-school-line/60 pb-3">
          <button
            onClick={() => setSubTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'dashboard'
                ? 'bg-school-cyan text-slate-900 shadow-md shadow-school-cyan/20'
                : 'bg-school-panel border border-school-line text-school-muted hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>דשבורד מעקב ותפוסות</span>
          </button>

          <button
            onClick={() => setSubTab('registrations')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'registrations'
                ? 'bg-school-cyan text-slate-900 shadow-md shadow-school-cyan/20'
                : 'bg-school-panel border border-school-line text-school-muted hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>טבלת נרשמים ושיבוצים ({eventRegistrations.length})</span>
          </button>

          <button
            onClick={() => setSubTab('workshops')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'workshops'
                ? 'bg-school-cyan text-slate-900 shadow-md shadow-school-cyan/20'
                : 'bg-school-panel border border-school-line text-school-muted hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ניהול סדנאות ({(currentEvent.workshops || []).length})</span>
          </button>

          <button
            onClick={() => setSubTab('google-workspace')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'google-workspace'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-900 shadow-md'
                : 'bg-[#101b33] border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Google Workspace (Sheets & Docs)</span>
          </button>

          <button
            onClick={() => setSubTab('event-settings')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'event-settings'
                ? 'bg-school-cyan text-slate-900 shadow-md shadow-school-cyan/20'
                : 'bg-school-panel border border-school-line text-school-muted hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>הגדרות ופרטי האירוע</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* SUBTAB 1: DASHBOARD & LIVE OCCUPANCY                      */}
        {/* ========================================================= */}
        {subTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-[#101b33] border border-school-line rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-school-muted text-xs font-bold">
                  <span>סך הכל מורים רשומים</span>
                  <Users className="w-4 h-4 text-school-cyan" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{totalRegistered}</span>
                  <span className="text-xs text-school-muted">מתוך {totalCapacity} מקומות</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#080d19] overflow-hidden">
                  <div className="h-full bg-school-cyan rounded-full" style={{ width: `${overallOccupancyPct}%` }} />
                </div>
              </div>

              <div className="bg-[#101b33] border border-school-line rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-school-muted text-xs font-bold">
                  <span>אחוז תפוסה כולל</span>
                  <Sliders className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-400">{overallOccupancyPct}%</span>
                  <span className="text-xs text-school-muted">תפוסה כוללת</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#080d19] overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${overallOccupancyPct}%` }} />
                </div>
              </div>

              <div className="bg-[#101b33] border border-school-line rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-school-muted text-xs font-bold">
                  <span>מספר סדנאות פעילות</span>
                  <Layers className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-amber-400">{(currentEvent.workshops || []).length}</span>
                  <span className="text-xs text-school-muted">סדנאות פדגוגיות</span>
                </div>
                <p className="text-[10px] text-school-muted">
                  {(currentEvent.workshops || []).filter(w => getWorkshopCapacity(w, currentEvent.id, registrations).isFull).length} סדנאות מלאות
                </p>
              </div>

              <div className="bg-[#101b33] border border-school-line rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-school-muted text-xs font-bold">
                  <span>סטטוס ההרשמה</span>
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="pt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-black inline-block ${
                    currentEvent.status === 'open' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                    currentEvent.status === 'closed' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {currentEvent.status === 'open' ? 'הרשמה פתוחה' : currentEvent.status === 'closed' ? 'הרשמה סגורה' : 'טיוטה'}
                  </span>
                </div>
                <p className="text-[10px] text-school-muted">תאריך האירוע: {currentEvent.date}</p>
              </div>

            </div>

            {/* Per Workshop Live Occupancy Cards */}
            <div className="bg-[#101b33] border border-school-line rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-school-line/60 pb-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-school-cyan" />
                  <span>תפוסת סדנאות בזמן אמת</span>
                </h3>
                <span className="text-xs text-school-muted">מתעדכן מיידית עם כל שיבוץ</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(currentEvent.workshops || []).map((workshop) => {
                  const cap = getWorkshopCapacity(workshop, currentEvent.id, registrations);
                  return (
                    <div 
                      key={workshop.id}
                      className="bg-[#080d19] border border-school-line/60 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-white text-xs leading-snug">{workshop.title}</h4>
                          <p className="text-[11px] text-school-cyan mt-0.5">מנחה: {workshop.instructor}</p>
                        </div>
                        {cap.isFull ? (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                            מלאה (100%)
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 shrink-0">
                            נותרו {cap.remainingSeats}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-school-muted">
                        <span>חדר: {workshop.room}</span>
                        <span>{cap.registeredCount} מתוך {cap.totalCapacity} משתתפים</span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-2 rounded-full bg-[#101b33] overflow-hidden border border-school-line/30">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            cap.isFull ? 'bg-rose-500' : cap.occupancyPercentage > 75 ? 'bg-amber-400' : 'bg-school-cyan'
                          }`}
                          style={{ width: `${cap.occupancyPercentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#101b33] border border-school-line rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-white">סנכרון ודוחות Google Workspace</p>
                  <p className="text-[11px] text-school-muted">הפקה בלחיצת כפתור של דוחות שיבוץ, טבלאות גיליון ושלטי דלתות</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCreateAssignmentGoogleDoc}
                  disabled={isProcessing}
                  className="px-3.5 py-2 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold hover:bg-blue-500/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>הפק מסמך שיבוץ ב-Docs</span>
                </button>

                <button
                  onClick={() => setIsPrintDoorSignsOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>הדפסת שלטי דלתות</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 2: REGISTRATIONS TABLE                             */}
        {/* ========================================================= */}
        {subTab === 'registrations' && (
          <div className="space-y-4">
            
            {/* Table Control Bar */}
            <div className="bg-[#101b33] border border-school-line rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {/* Search */}
                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 text-school-muted absolute right-3 top-2.5" />
                  <input
                    type="text"
                    value={regSearchTerm}
                    onChange={(e) => setRegSearchTerm(e.target.value)}
                    placeholder="חיפוש לפי שם, טלפון, אימייל או תפקיד..."
                    className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 pr-9 pl-3 text-xs text-white focus:outline-none focus:border-school-cyan"
                  />
                </div>

                {/* Filter by workshop */}
                <select
                  value={filterWorkshop}
                  onChange={(e) => setFilterWorkshop(e.target.value)}
                  className="bg-[#080d19] border border-school-line/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-school-cyan font-bold"
                >
                  <option value="all">כל הסדנאות ({eventRegistrations.length})</option>
                  {(currentEvent.workshops || []).map(w => (
                    <option key={w.id} value={w.id}>
                      {w.title} ({eventRegistrations.filter(r => r.workshopId === w.id).length})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsManualAddOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-school-cyan text-slate-900 text-xs font-black hover:bg-cyan-300 transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>הוספת מורה ידנית</span>
                </button>

                <button
                  onClick={handleCreateGoogleSheet}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition-all cursor-pointer disabled:opacity-50"
                  title="פתיחת גיליון Google Sheets עם הנתונים"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>ייצוא ל-Sheets</span>
                </button>

                <button
                  onClick={handleCreateAssignmentGoogleDoc}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/20 border border-blue-500/40 text-xs font-bold text-blue-300 hover:bg-blue-500/30 transition-all cursor-pointer disabled:opacity-50"
                  title="הורדת מסמך שיבוץ מעוצב ל-Google Docs / Word"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>ייצוא ל-Docs</span>
                </button>

                <button
                  onClick={() => downloadRegistrationsCSV(currentEvent, eventRegistrations)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-school-panel border border-school-line text-xs font-bold text-white hover:text-school-cyan transition-all cursor-pointer"
                  title="הורדת קובץ CSV ל-Excel"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>

                <button
                  onClick={handleResetAllRegistrations}
                  className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                  title="איפוס רשימת נרשמים"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Table */}
            <div className="bg-[#101b33] border border-school-line rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#080d19] border-b border-school-line text-school-muted uppercase text-[10px] font-black">
                    <tr>
                      <th className="p-3.5">#</th>
                      <th className="p-3.5">שם המורה</th>
                      <th className="p-3.5">טלפון</th>
                      <th className="p-3.5">אימייל</th>
                      <th className="p-3.5">תפקיד / מקצוע</th>
                      <th className="p-3.5">סדנה שנבחרה</th>
                      <th className="p-3.5">חדר ושעות</th>
                      <th className="p-3.5">מועד רישום</th>
                      <th className="p-3.5 text-center">פעולות ניהול</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-school-line/40">
                    {filteredRegs.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-10 text-school-muted text-xs">
                          לא נמצאו נרשמים העונים לקריטריונים אלו.
                        </td>
                      </tr>
                    ) : (
                      filteredRegs.map((reg, idx) => (
                        <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3.5 text-school-muted font-mono">{idx + 1}</td>
                          <td className="p-3.5 font-bold text-white">{reg.fullName}</td>
                          <td className="p-3.5 text-slate-300 font-mono" dir="ltr">{reg.phone}</td>
                          <td className="p-3.5 text-slate-300 font-mono" dir="ltr">{reg.email}</td>
                          <td className="p-3.5 text-school-muted">{reg.roleOrSubject}</td>
                          <td className="p-3.5">
                            <span className="font-bold text-school-cyan block">{reg.workshopTitle}</span>
                            {reg.notes && <span className="text-[10px] text-amber-300/80 block truncate max-w-[160px]">הערה: {reg.notes}</span>}
                          </td>
                          <td className="p-3.5 text-slate-300">
                            <span>{reg.room}</span>
                            <span className="block text-[10px] text-school-muted">{reg.timeSlot}</span>
                          </td>
                          <td className="p-3.5 text-school-muted text-[11px]">{reg.registeredAt}</td>
                          <td className="p-3.5">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Move button */}
                              <button
                                onClick={() => {
                                  setTransferTargetReg(reg);
                                  setTargetWorkshopId(reg.workshopId);
                                }}
                                className="p-1.5 rounded-lg bg-school-cyan/10 hover:bg-school-cyan/20 text-school-cyan transition-colors"
                                title="העבר לסדנה אחרת"
                              >
                                <MoveRight className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete button */}
                              <button
                                onClick={() => handleDeleteRegistration(reg.id, reg.fullName)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                                title="ביטול שיבוץ ופינוי מקום"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 3: WORKSHOPS MANAGEMENT                            */}
        {/* ========================================================= */}
        {subTab === 'workshops' && (
          <div className="space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-school-line/60 pb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>סדנאות ומסלולי למידה באירוע</span>
                  <span className="text-[11px] font-bold text-school-cyan bg-school-cyan/10 px-2 py-0.5 rounded-full border border-school-cyan/30">
                    {(currentEvent.workshops || []).length} סדנאות
                  </span>
                </h3>
                <p className="text-xs text-school-muted mt-0.5">עריכה מלאה של תכנים, הגדרת מכסות מקומות, שעות פעילות, חדרים ומנחים</p>
              </div>
              <button
                onClick={handleOpenAddWorkshop}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-school-cyan text-slate-900 text-xs font-black hover:bg-cyan-300 transition-all cursor-pointer shadow-md shadow-school-cyan/20"
              >
                <Plus className="w-4 h-4" />
                <span>הוסף סדנה חדשה</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(currentEvent.workshops || []).map((workshop) => {
                const cap = getWorkshopCapacity(workshop, currentEvent.id, registrations);
                return (
                  <div
                    key={workshop.id}
                    className="bg-[#101b33] border border-school-line hover:border-school-line/80 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-lg"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-school-cyan bg-school-cyan/10 border border-school-cyan/20 px-2.5 py-0.5 rounded-md">
                            {workshop.category || 'פדגוגיה'}
                          </span>
                          <h4 className="font-bold text-white text-base mt-1.5 leading-snug">{workshop.title}</h4>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleDuplicateWorkshop(workshop)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                            title="שכפל סדנה זו"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingWorkshop(workshop);
                              setIsNewWorkshop(false);
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-school-cyan/20 text-school-cyan cursor-pointer"
                            title="ערוך סדנה"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteWorkshop(workshop.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                            title="מחק סדנה"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {workshop.description && (
                        <p className="text-xs text-school-muted leading-relaxed line-clamp-3">
                          {workshop.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2.5 pt-3 border-t border-school-line/50 text-xs">
                      <div className="grid grid-cols-2 gap-2 text-slate-300">
                        <div>
                          <span className="text-school-muted text-[10px] block">מנחה / מרצה:</span>
                          <span className="font-bold text-white">{workshop.instructor || 'לא צוין'}</span>
                        </div>
                        <div>
                          <span className="text-school-muted text-[10px] block">חדר / מיקום:</span>
                          <span className="font-bold text-white">{workshop.room || 'טרם נקבע'}</span>
                        </div>
                        <div>
                          <span className="text-school-muted text-[10px] block">שעות פעילות:</span>
                          <span className="font-bold text-white font-mono">{workshop.timeSlot || currentEvent.hours}</span>
                        </div>
                        <div>
                          <span className="text-school-muted text-[10px] block">מכסה ותפוסה:</span>
                          <span className={`font-bold font-mono ${cap.isFull ? 'text-rose-400' : 'text-school-cyan'}`}>
                            {cap.registeredCount} / {workshop.maxCapacity} ({cap.occupancyPercentage}%)
                          </span>
                        </div>
                      </div>

                      {/* Mini capacity bar */}
                      <div className="w-full bg-[#080d19] h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${cap.isFull ? 'bg-rose-500' : 'bg-school-cyan'}`}
                          style={{ width: `${Math.min(100, cap.occupancyPercentage)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 4: GOOGLE WORKSPACE SYNC & DOCS GENERATION        */}
        {/* ========================================================= */}
        {subTab === 'google-workspace' && (
          <div className="space-y-6">
            
            {/* Header info */}
            <div className="bg-[#101b33] border border-school-line rounded-3xl p-6 md:p-8 space-y-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">יצוא נתונים ישיר ל-Google Workspace</h3>
                  <p className="text-xs text-school-muted">יצוא מהיר ואינטואיטיבי של רשימות הנרשמים, השיבוצים ושלטי הכניסה בלחיצה אחת</p>
                </div>
              </div>
            </div>

            {/* 2 Clean & Intuitive Action Cards: Export to Sheets & Export to Docs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* CARD 1: EXPORT TO SHEETS */}
              <div className="bg-[#101b33] border-2 border-emerald-500/30 hover:border-emerald-500/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl flex flex-col justify-between transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        <FileSpreadsheet className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white">יצא ל-Google Sheets</h4>
                        <span className="text-[11px] text-emerald-300 font-bold">גיליון אלקטרוני מסונכרן</span>
                      </div>
                    </div>
                    {currentEvent.googleSheetId && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-bold border border-emerald-500/40">
                        מקושר
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-school-muted leading-relaxed">
                    יצוא אוטומטי של כל הנרשמים ופרטיהם (שם, טלפון, מייל, סדנה, חדר, שעות והערות) ישירות לגיליון Google Sheets מעוצב.
                  </p>

                  <div className="bg-[#080d19] border border-school-line/60 rounded-xl p-3.5 space-y-1.5 text-xs">
                    <div className="flex justify-between text-school-muted text-[11px]">
                      <span>אירוע נוכחי:</span>
                      <span className="text-white font-bold">{currentEvent.title}</span>
                    </div>
                    <div className="flex justify-between text-school-muted text-[11px]">
                      <span>סה״כ נרשמים ליצוא:</span>
                      <span className="text-school-cyan font-bold font-mono">{eventRegistrations.length} מורים</span>
                    </div>
                    {currentEvent.googleSheetUrl && (
                      <div className="pt-1 border-t border-school-line/40 flex justify-between items-center text-[11px]">
                        <span className="text-school-muted">קישור ישיר:</span>
                        <a 
                          href={currentEvent.googleSheetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                        >
                          <span>פתח גיליון קיים</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={currentEvent.googleSheetId ? handleSyncToExistingGoogleSheet : handleCreateGoogleSheet}
                  disabled={isProcessing}
                  className="w-full btn py-4 rounded-2xl text-sm font-black bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <FileSpreadsheet className="w-5 h-5" />}
                  <span>{currentEvent.googleSheetId ? 'יצא ל-Sheets (סנכרן נתונים)' : 'יצא ל-Sheets'}</span>
                </button>
              </div>

              {/* CARD 2: EXPORT TO DOCS */}
              <div className="bg-[#101b33] border-2 border-blue-500/30 hover:border-blue-500/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl flex flex-col justify-between transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
                        <FileText className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white">יצא ל-Google Docs</h4>
                        <span className="text-[11px] text-blue-300 font-bold">מסמך שיבוץ ודוחות רשמיים</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full font-bold border border-blue-500/40">
                      מוכן להדפסה
                    </span>
                  </div>

                  <p className="text-xs text-school-muted leading-relaxed">
                    יצירת מסמך Google Docs מעוצב עם כותרות, לוח זמנים, טבלאות שיבוץ מורים לפי סדנאות ושלטי כניסה לדלתות החדרים.
                  </p>

                  <div className="bg-[#080d19] border border-school-line/60 rounded-xl p-3.5 space-y-1.5 text-xs">
                    <div className="flex justify-between text-school-muted text-[11px]">
                      <span>מספר סדנאות במסמך:</span>
                      <span className="text-white font-bold font-mono">{(currentEvent.workshops || []).length} סדנאות</span>
                    </div>
                    <div className="flex justify-between text-school-muted text-[11px]">
                      <span>פורמט מסמך:</span>
                      <span className="text-school-cyan font-bold">דוח שיבוץ רשמי</span>
                    </div>
                    <div className="pt-1 border-t border-school-line/40 flex justify-between items-center text-[11px]">
                      <span className="text-school-muted">אפשרות נוספת:</span>
                      <button
                        onClick={handleCreateDoorSignsGoogleDoc}
                        disabled={isProcessing}
                        className="text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>הפק גם שלטי דלתות ב-Docs</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleCreateAssignmentGoogleDoc}
                    disabled={isProcessing}
                    className="w-full btn py-4 rounded-2xl text-sm font-black bg-gradient-to-r from-blue-500 to-indigo-400 text-slate-950 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                    <span>יצא ל-Docs</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Quick CSV Export Alternative */}
            <div className="bg-[#101b33] border border-school-line rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-school-muted">
                <Download className="w-4 h-4 text-school-cyan" />
                <span>מעוניינים בקובץ מקומי? ניתן להוריד את רשימת הנרשמים כקובץ Excel / CSV ישירות למחשב</span>
              </div>
              <button
                onClick={() => downloadRegistrationsCSV(currentEvent, eventRegistrations)}
                className="btn px-4 py-2 rounded-xl text-xs font-bold bg-school-panel border border-school-line text-white hover:text-school-cyan hover:border-school-cyan transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>הורד קובץ CSV</span>
              </button>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 5: EVENT SETTINGS & FULL SCHEDULE EDITOR            */}
        {/* ========================================================= */}
        {subTab === 'event-settings' && (
          <div className="space-y-8">
            
            {/* CARD 1: GENERAL EVENT SETTINGS & DATES */}
            <div className="bg-[#101b33] border border-school-line rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-school-line/60 pb-3">
                <div>
                  <h3 className="text-base font-black text-white">פרטי האירוע, תאריכים והגדרות פדגוגיות</h3>
                  <p className="text-xs text-school-muted">עריכת כותרות, תאריך קיום האירוע, שעות כלליות, מיקום בית ספרי וסטטוס הרשמה</p>
                </div>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white block">כותרת האירוע *</label>
                    <input
                      type="text"
                      required
                      value={currentEvent.title}
                      onChange={(e) => handleUpdateEventField('title', e.target.value)}
                      className="w-full bg-[#080d19] border border-school-line/60 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-school-cyan font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white block">תת-כותרת / סלוגן חינוכי</label>
                    <input
                      type="text"
                      value={currentEvent.subtitle || ''}
                      onChange={(e) => handleUpdateEventField('subtitle', e.target.value)}
                      className="w-full bg-[#080d19] border border-school-line/60 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-school-cyan font-bold"
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-white block">תאריך קיום האירוע *</label>
                        {currentEvent.date && (
                          <span className="text-[10px] text-school-cyan bg-school-cyan/15 px-2 py-0.5 rounded-md font-mono font-bold" dir="ltr">
                            {formatToIsraeliDate(currentEvent.date)} (DD/MM/YYYY)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <button
                          type="button"
                          onClick={() => handleUpdateEventField('date', '2026-08-25')}
                          className="px-2 py-0.5 rounded bg-[#080d19] text-school-cyan hover:bg-school-cyan/20 border border-school-cyan/30 cursor-pointer font-bold"
                        >
                          25/08/2026
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateEventField('date', new Date().toISOString().split('T')[0])}
                          className="px-2 py-0.5 rounded bg-[#080d19] text-slate-300 hover:bg-white/10 border border-school-line/60 cursor-pointer"
                        >
                          היום
                        </button>
                      </div>
                    </div>

                    <div className="relative flex items-center">
                      <input
                        type="text"
                        required
                        value={currentEvent.date}
                        onChange={(e) => handleUpdateEventField('date', e.target.value)}
                        placeholder="YYYY-MM-DD (לדוגמה: 2026-09-01)"
                        className="w-full bg-[#080d19] border border-school-line/60 rounded-xl p-3 pl-12 text-xs text-white focus:outline-none focus:border-school-cyan font-bold font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const parsed = currentEvent.date ? new Date(currentEvent.date) : new Date();
                          if (!isNaN(parsed.getTime())) {
                            setCalendarViewDate(parsed);
                          }
                          setIsCalendarOpen(!isCalendarOpen);
                        }}
                        className="absolute left-2.5 p-2 rounded-lg bg-school-cyan/20 hover:bg-school-cyan/30 text-school-cyan border border-school-cyan/40 transition-all cursor-pointer shadow-sm"
                        title="פתח לוח שנה לבחירת תאריך"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    </div>

                    {/* CUSTOM INTERACTIVE CALENDAR POPOVER */}
                    <AnimatePresence>
                      {isCalendarOpen && (
                        <div className="absolute z-50 top-full mt-2 right-0 w-80 bg-[#0d1629] border-2 border-school-cyan/50 rounded-2xl p-4 shadow-2xl space-y-3">
                          <div className="flex items-center justify-between border-b border-school-line/60 pb-2.5">
                            <div className="flex items-center gap-1 text-xs font-black text-white">
                              <Calendar className="w-4 h-4 text-school-cyan" />
                              <span>
                                {calendarViewDate.toLocaleString('he-IL', { month: 'long', year: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const prev = new Date(calendarViewDate);
                                  prev.setMonth(prev.getMonth() - 1);
                                  setCalendarViewDate(prev);
                                }}
                                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 cursor-pointer"
                                title="חודש קודם"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = new Date(calendarViewDate);
                                  next.setMonth(next.getMonth() + 1);
                                  setCalendarViewDate(next);
                                }}
                                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 cursor-pointer"
                                title="חודש הבא"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsCalendarOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer ml-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Days of week header */}
                          <div className="grid grid-cols-7 text-center text-[10px] font-black text-school-muted">
                            {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map((d, i) => (
                              <span key={i} className="py-1">{d}</span>
                            ))}
                          </div>

                          {/* Calendar Days Matrix */}
                          <div className="grid grid-cols-7 gap-1 text-center text-xs">
                            {(() => {
                              const year = calendarViewDate.getFullYear();
                              const month = calendarViewDate.getMonth();
                              const firstDayOfMonth = new Date(year, month, 1).getDay();
                              const daysInMonth = new Date(year, month + 1, 0).getDate();
                              const cells = [];

                              // Empty leading cells
                              for (let i = 0; i < firstDayOfMonth; i++) {
                                cells.push(<div key={`empty-${i}`} className="p-1.5" />);
                              }

                              // Day cells
                              for (let day = 1; day <= daysInMonth; day++) {
                                const formattedDayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const isSelected = currentEvent.date === formattedDayStr;
                                const isToday = new Date().toISOString().split('T')[0] === formattedDayStr;

                                cells.push(
                                  <button
                                    key={day}
                                    type="button"
                                    onClick={() => {
                                      handleUpdateEventField('date', formattedDayStr);
                                      setIsCalendarOpen(false);
                                    }}
                                    className={`py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-school-cyan text-slate-900 font-black shadow-md shadow-school-cyan/30'
                                        : isToday
                                        ? 'border border-school-cyan/60 text-school-cyan hover:bg-school-cyan/15'
                                        : 'text-slate-200 hover:bg-white/10'
                                    }`}
                                  >
                                    {day}
                                  </button>
                                );
                              }
                              return cells;
                            })()}
                          </div>

                          <div className="pt-2 border-t border-school-line/60 flex items-center justify-between text-[11px]">
                            <button
                              type="button"
                              onClick={() => {
                                const now = new Date();
                                setCalendarViewDate(now);
                                handleUpdateEventField('date', now.toISOString().split('T')[0]);
                                setIsCalendarOpen(false);
                              }}
                              className="text-school-cyan font-bold hover:underline cursor-pointer"
                            >
                              בחר את היום
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const target = new Date(2026, 7, 25);
                                setCalendarViewDate(target);
                                handleUpdateEventField('date', '2026-08-25');
                                setIsCalendarOpen(false);
                              }}
                              className="text-school-cyan font-bold hover:underline cursor-pointer"
                            >
                              25.8.2026
                            </button>
                          </div>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white block">מסגרת שעות כללית *</label>
                    <input
                      type="text"
                      required
                      value={currentEvent.hours}
                      onChange={(e) => handleUpdateEventField('hours', e.target.value)}
                      placeholder="08:30 - 14:00"
                      className="w-full bg-[#080d19] border border-school-line/60 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-school-cyan font-bold font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white block">מיקום מרכזי ומרחבי פעילות *</label>
                    <input
                      type="text"
                      required
                      value={currentEvent.location}
                      onChange={(e) => handleUpdateEventField('location', e.target.value)}
                      placeholder="אודיטוריום ראשי ומרחבי החדשנות"
                      className="w-full bg-[#080d19] border border-school-line/60 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-school-cyan"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white block">סטטוס פתיחת ההרשמה למורים</label>
                    <select
                      value={currentEvent.status}
                      onChange={(e) => handleUpdateEventField('status', e.target.value as EventStatus)}
                      className="w-full bg-[#080d19] border border-school-line/60 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-school-cyan font-bold"
                    >
                      <option value="open">🟢 פתוח להרשמת מורים (מוצג בפורטל)</option>
                      <option value="closed">🔴 הרשמה סגורה (מודיע שההרשמה נסגרה)</option>
                      <option value="draft">🟡 טיוטה (מוסתר מכלל המורים)</option>
                      <option value="completed">⚪ האירוע הסתיים</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white block">איש / אשת קשר לפניות</label>
                    <input
                      type="text"
                      value={currentEvent.contactPerson}
                      onChange={(e) => handleUpdateEventField('contactPerson', e.target.value)}
                      placeholder="רכז/ת פדגוגיה ופיתוח מקצועי"
                      className="w-full bg-[#080d19] border border-school-line/60 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-school-cyan"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white block">אימייל לפניות ושאלות</label>
                    <input
                      type="email"
                      value={currentEvent.contactEmail}
                      onChange={(e) => handleUpdateEventField('contactEmail', e.target.value)}
                      placeholder="pedagogy@arens.tik-tak.school"
                      className="w-full bg-[#080d19] border border-school-line/60 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-school-cyan"
                    />
                  </div>

                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-white block">תיאור האירוע, מטרות ודבר ההנהלה לצוות</label>
                  <textarea
                    rows={3}
                    value={currentEvent.description}
                    onChange={(e) => handleUpdateEventField('description', e.target.value)}
                    placeholder="ברוכים הבאים ליום ההיערכות הפדגוגי..."
                    className="w-full bg-[#080d19] border border-school-line/60 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-school-cyan leading-relaxed resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn px-8 py-3 rounded-xl text-xs font-black bg-school-cyan text-slate-900 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-school-cyan/20"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{isProcessing ? 'שומר ומסנכרן...' : 'שמור פרטי אירוע ראשיים'}</span>
                  </button>
                </div>

              </form>
            </div>

            {/* CARD 2: DETAILED SCHEDULE BUILDER (עורך לוח זמנים מפורט) */}
            <div className="bg-[#101b33] border border-school-line rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-school-line/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-school-cyan/15 text-school-cyan border border-school-cyan/30">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span>לוח זמנים מפורט של יום ההיערכות</span>
                      <span className="text-[11px] font-bold text-school-cyan bg-school-cyan/10 px-2 py-0.5 rounded-full border border-school-cyan/30">
                        {(currentEvent.schedule || []).length} תחנות לו״ז
                      </span>
                    </h3>
                    <p className="text-xs text-school-muted mt-0.5">
                      עריכה, הוספה וסידור של כל שלבי היום (התכנסות, מליאות, הפסקות, מושבי סדנאות וארוחות)
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplyDefaultSchedule}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-school-panel border border-school-line text-xs font-bold text-slate-300 hover:text-white hover:border-slate-400 transition-all cursor-pointer"
                    title="טען תבנית לוח זמנים מומלץ ליום היערכות"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>טען לו״ז מומלץ סטנדרטי</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenAddSchedule}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-school-cyan text-slate-900 text-xs font-black hover:bg-cyan-300 transition-all cursor-pointer shadow-md shadow-school-cyan/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>הוסף שורת לו״ז חדשה</span>
                  </button>
                </div>
              </div>

              {/* Schedule Timeline Cards Grid */}
              {(!currentEvent.schedule || currentEvent.schedule.length === 0) ? (
                <div className="text-center py-10 border border-dashed border-school-line/60 rounded-2xl p-6 space-y-3 bg-[#080d19]/40">
                  <Clock className="w-8 h-8 text-school-muted mx-auto" />
                  <p className="text-xs text-school-muted font-bold">טרם הוזן לוח זמנים מפורט לאירוע זה</p>
                  <div className="flex justify-center gap-2 pt-2">
                    <button
                      onClick={handleOpenAddSchedule}
                      className="px-4 py-2 rounded-xl bg-school-cyan text-slate-900 text-xs font-bold hover:bg-cyan-300 cursor-pointer"
                    >
                      הוסף שורת לו״ז ראשונה
                    </button>
                    <button
                      onClick={handleApplyDefaultSchedule}
                      className="px-4 py-2 rounded-xl bg-school-panel border border-school-line text-white text-xs font-bold hover:text-school-cyan cursor-pointer"
                    >
                      טען לו״ז סטנדרטי מומלץ
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {currentEvent.schedule.map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative bg-[#0b1325] hover:bg-[#0f1a33] border border-school-line/70 hover:border-school-cyan/60 rounded-2xl p-4 transition-all flex flex-col justify-between space-y-3 shadow-md"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-school-cyan text-xs font-bold bg-school-cyan/10 border border-school-cyan/20 px-2.5 py-1 rounded-lg">
                            {item.time}
                          </span>

                          {/* Action controls */}
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleMoveScheduleItem(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer"
                              title="הזז קודם / למעלה"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveScheduleItem(idx, 'down')}
                              disabled={idx === (currentEvent.schedule?.length || 0) - 1}
                              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer"
                              title="הזז מאוחר / למטה"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditSchedule(idx)}
                              className="p-1 rounded-lg bg-white/5 hover:bg-school-cyan/20 text-school-cyan cursor-pointer"
                              title="ערוך שורה זו"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteScheduleItem(idx)}
                              className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                              title="מחק שורה זו"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-bold text-white text-xs md:text-sm leading-snug">
                          {item.activity}
                        </h4>
                      </div>

                      {item.location && (
                        <div className="pt-2 border-t border-school-line/40 flex items-center gap-1.5 text-[11px] text-school-muted font-medium">
                          <MapPin className="w-3 h-3 text-school-cyan shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* CARD 3: DANGER ZONE - DELETE EVENT (מחיקת אירוע מהמערכת) */}
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-rose-300">אזור פעולות רגישות (מחיקת אירוע)</h3>
                    <p className="text-xs text-rose-200/70 mt-0.5">
                      מחיקת אירוע זה תסיר אותו לצמיתות ממאגר האירועים, כולל כל הסדנאות וכל נתוני הרישום של המורים.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDeleteEventModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-rose-900/30"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>מחק אירוע זה מהמערכת</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT WORKSHOP                                */}
      {/* ========================================================= */}
      <AnimatePresence>
        {editingWorkshop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#101b33] border border-school-line rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 text-right"
            >
              <div className="flex items-center justify-between border-b border-school-line pb-3">
                <h3 className="text-base font-black text-white">
                  {isNewWorkshop ? 'הוספת סדנה חדשה לאירוע' : 'עריכת סדנה'}
                </h3>
                <button
                  onClick={() => setEditingWorkshop(null)}
                  className="text-school-muted hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveWorkshop} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-white block">שם הסדנה *</label>
                  <input
                    type="text"
                    required
                    value={editingWorkshop.title}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, title: e.target.value })}
                    placeholder="לדוגמה: בינה מלאכותית בהוראה"
                    className="w-full bg-[#080d19] border border-school-line rounded-xl p-2.5 text-white font-bold focus:outline-none focus:border-school-cyan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-white block">שם המנחה / מרצה *</label>
                    <input
                      type="text"
                      required
                      value={editingWorkshop.instructor}
                      onChange={(e) => setEditingWorkshop({ ...editingWorkshop, instructor: e.target.value })}
                      placeholder="שם המנחה"
                      className="w-full bg-[#080d19] border border-school-line rounded-xl p-2.5 text-white focus:outline-none focus:border-school-cyan"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-white block">חדר / מיקום *</label>
                    <input
                      type="text"
                      required
                      value={editingWorkshop.room}
                      onChange={(e) => setEditingWorkshop({ ...editingWorkshop, room: e.target.value })}
                      placeholder="חדר 104 / מעבדה"
                      className="w-full bg-[#080d19] border border-school-line rounded-xl p-2.5 text-white focus:outline-none focus:border-school-cyan"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-white block">מכסת משתתפים מקסימלית *</label>
                    <input
                      type="number"
                      min="1"
                      max="200"
                      required
                      value={editingWorkshop.maxCapacity}
                      onChange={(e) => setEditingWorkshop({ ...editingWorkshop, maxCapacity: Number(e.target.value) || 20 })}
                      className="w-full bg-[#080d19] border border-school-line rounded-xl p-2.5 text-white focus:outline-none focus:border-school-cyan"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-white block">שעות פעילות *</label>
                    <input
                      type="text"
                      required
                      value={editingWorkshop.timeSlot}
                      onChange={(e) => setEditingWorkshop({ ...editingWorkshop, timeSlot: e.target.value })}
                      placeholder="10:30 - 12:30"
                      className="w-full bg-[#080d19] border border-school-line rounded-xl p-2.5 text-white focus:outline-none focus:border-school-cyan"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white block">תיאור קצר של הסדנה</label>
                  <textarea
                    rows={2}
                    value={editingWorkshop.description}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, description: e.target.value })}
                    placeholder="נושאי הסדנה ותוצרי הלמידה..."
                    className="w-full bg-[#080d19] border border-school-line rounded-xl p-2.5 text-white focus:outline-none focus:border-school-cyan resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingWorkshop(null)}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/15"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-school-cyan text-slate-900 font-black hover:bg-cyan-300 transition-all cursor-pointer"
                  >
                    שמור סדנה
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT SCHEDULE ITEM                           */}
      {/* ========================================================= */}
      <AnimatePresence>
        {(isAddingSchedule || editingScheduleIndex !== null) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#101b33] border border-school-line rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 text-right"
            >
              <div className="flex items-center justify-between border-b border-school-line pb-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-school-cyan" />
                  <span>{isAddingSchedule ? 'הוספת פעילות ללוח הזמנים (לו״ז)' : 'עריכת שורת לו״ז'}</span>
                </h3>
                <button
                  onClick={() => {
                    setIsAddingSchedule(false);
                    setEditingScheduleIndex(null);
                  }}
                  className="text-school-muted hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Preset Tags */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-school-muted font-bold block">תבניות מהירות לפעילויות נפוצות:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { act: 'התכנסות, קפה וכיבוד בוקר חגיגי', time: '08:30 - 09:00', loc: 'לובי האודיטוריום' },
                    { act: 'מליאת פתיחה: דבר המנהלת והצגת יעדי השנה', time: '09:00 - 10:15', loc: 'אודיטוריום מרכזי' },
                    { act: 'הפסקת התרעננות ושיח עמיתים', time: '10:15 - 10:45', loc: 'רחבת המורים' },
                    { act: 'מושבי סדנאות פדגוגיות (בחירה מראש לפי מכסות)', time: '10:45 - 12:45', loc: 'מרחבי הלמידה והמעבדות' },
                    { act: 'ארוחת צהריים משותפת', time: '12:45 - 13:15', loc: 'חדר אוכל / מתחם מורים' },
                    { act: 'מליאת סיכום, תובנות וברכות לשנה החדשה', time: '13:15 - 14:00', loc: 'אודיטוריום מרכזי' }
                  ].map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setScheduleForm({
                        activity: preset.act,
                        time: scheduleForm.time || preset.time,
                        location: preset.loc
                      })}
                      className="px-2.5 py-1 rounded-lg bg-[#080d19] border border-school-line/60 hover:border-school-cyan/50 text-[11px] text-slate-300 hover:text-school-cyan transition-all cursor-pointer"
                    >
                      + {preset.act.split(':')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSaveScheduleItem} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-white block">שעות / טווח זמנים *</label>
                  <input
                    type="text"
                    required
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    placeholder="לדוגמה: 08:30 - 09:00"
                    className="w-full bg-[#080d19] border border-school-line rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none focus:border-school-cyan"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white block">תיאור הפעילות / תוכן התחנה *</label>
                  <input
                    type="text"
                    required
                    value={scheduleForm.activity}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, activity: e.target.value })}
                    placeholder="לדוגמה: מליאת פתיחה והצגת תוכנית שנתית"
                    className="w-full bg-[#080d19] border border-school-line rounded-xl p-2.5 text-white font-bold focus:outline-none focus:border-school-cyan"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white block">מיקום / חדר (אופציונלי)</label>
                  <input
                    type="text"
                    value={scheduleForm.location}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                    placeholder="לדוגמה: אודיטוריום ראשי / קומה 2"
                    className="w-full bg-[#080d19] border border-school-line rounded-xl p-2.5 text-white focus:outline-none focus:border-school-cyan"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-school-line/60">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingSchedule(false);
                      setEditingScheduleIndex(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/15 cursor-pointer"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-school-cyan text-slate-900 font-black hover:bg-cyan-300 transition-all cursor-pointer shadow-md shadow-school-cyan/20"
                  >
                    {isAddingSchedule ? 'הוסף שורת לו״ז' : 'שמור שינויים'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: TRANSFER TEACHER WORKSHOP                          */}
      {/* ========================================================= */}
      <AnimatePresence>
        {transferTargetReg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#101b33] border border-school-line rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-right"
            >
              <div className="flex items-center justify-between border-b border-school-line pb-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <MoveRight className="w-4 h-4 text-school-cyan" />
                  <span>העברת מורה לסדנה אחרת</span>
                </h3>
                <button onClick={() => setTransferTargetReg(null)} className="text-school-muted hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-[#080d19] rounded-xl text-xs space-y-1">
                <p className="text-white font-bold">{transferTargetReg.fullName}</p>
                <p className="text-school-muted">סדנה נוכחית: {transferTargetReg.workshopTitle}</p>
              </div>

              <form onSubmit={handleTransferTeacher} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-white block">בחר סדנת יעד חדשה:</label>
                  <select
                    value={targetWorkshopId}
                    onChange={(e) => setTargetWorkshopId(e.target.value)}
                    className="w-full bg-[#080d19] border border-school-line rounded-xl p-2.5 text-white font-bold focus:outline-none focus:border-school-cyan"
                  >
                    {(currentEvent.workshops || []).map(w => {
                      const cap = getWorkshopCapacity(w, currentEvent.id, registrations);
                      return (
                        <option key={w.id} value={w.id}>
                          {w.title} ({cap.registeredCount}/{w.maxCapacity} {cap.isFull ? '- מלאה' : ''})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setTransferTargetReg(null)}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-school-cyan text-slate-900 font-black hover:bg-cyan-300"
                  >
                    בצע העברה
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: MANUAL ADD REGISTRATION                            */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isManualAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#101b33] border border-school-line rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-right"
            >
              <div className="flex items-center justify-between border-b border-school-line pb-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-school-cyan" />
                  <span>הוספת שיבוץ מורה ידנית על ידי מנהל</span>
                </h3>
                <button onClick={() => setIsManualAddOpen(false)} className="text-school-muted hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleManualAddRegistration} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-white block">שם מלא *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.fullName}
                    onChange={(e) => setManualForm({ ...manualForm, fullName: e.target.value })}
                    className="w-full bg-[#080d19] border border-school-line rounded-xl p-2.5 text-white font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-white block">טלפון</label>
                    <input
                      type="tel"
                      value={manualForm.phone}
                      onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                      className="w-full bg-[#080d19] border border-school-line rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-white block">אימייל</label>
                    <input
                      type="email"
                      value={manualForm.email}
                      onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                      className="w-full bg-[#080d19] border border-school-line rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-white block">תפקיד / מקצוע הוראה</label>
                  <input
                    type="text"
                    value={manualForm.roleOrSubject}
                    onChange={(e) => setManualForm({ ...manualForm, roleOrSubject: e.target.value })}
                    placeholder="מחנך / מורה מקצועי"
                    className="w-full bg-[#080d19] border border-school-line rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-white block">סדנה לשיבוץ *</label>
                  <select
                    required
                    value={manualForm.workshopId}
                    onChange={(e) => setManualForm({ ...manualForm, workshopId: e.target.value })}
                    className="w-full bg-[#080d19] border border-school-line rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="">-- בחר סדנה --</option>
                    {(currentEvent.workshops || []).map(w => (
                      <option key={w.id} value={w.id}>
                        {w.title} ({w.room})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsManualAddOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-school-cyan text-slate-900 font-black hover:bg-cyan-300"
                  >
                    הוסף מורה
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: DIRECT PRINT DOOR SIGNS (A4 PREVIEW)               */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isPrintDoorSignsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white text-slate-900 rounded-3xl p-6 md:p-10 max-w-3xl w-full shadow-2xl space-y-6 text-right max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b pb-3 no-print">
                <div>
                  <h3 className="text-lg font-black">תצוגת הדפסת שלטי דלתות (A4)</h3>
                  <p className="text-xs text-slate-500">לחצו על כפתור ההדפסה להפקת השלטים לתלייה על דלתות החדרים</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>הדפס עכשיו (Ctrl+P)</span>
                  </button>
                  <button
                    onClick={() => setIsPrintDoorSignsOpen(false)}
                    className="px-3 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    סגור
                  </button>
                </div>
              </div>

              {/* Printable Pages */}
              <div className="space-y-12">
                {(currentEvent.workshops || []).map((workshop, idx) => {
                  const wsRegs = eventRegistrations.filter(r => r.workshopId === workshop.id);
                  return (
                    <div key={workshop.id} className="border-4 border-slate-900 p-8 rounded-2xl space-y-6 bg-white page-break-after">
                      
                      {/* Header */}
                      <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                        <p className="text-xs font-bold tracking-widest uppercase text-slate-600">
                          שש-שנתי ע"ש משה ארנס - פתח תקוה | {currentEvent.title}
                        </p>
                        <div className="bg-slate-900 text-white font-black text-3xl py-2 px-6 rounded-xl inline-block mt-2">
                          חדר: {workshop.room}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-2xl font-black text-slate-900 leading-tight">
                          {workshop.title}
                        </h2>
                        <div className="flex justify-between text-sm font-bold text-slate-700 border-b pb-2">
                          <span>מנחה: {workshop.instructor}</span>
                          <span>שעות: {workshop.timeSlot}</span>
                        </div>
                      </div>

                      {/* Participants Checkbox Table */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-black text-slate-900">רשימת משתתפים ורישום נוכחות בכניסה:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {wsRegs.map((reg, rIdx) => (
                            <div key={reg.id} className="border border-slate-300 p-2 rounded-lg flex items-center justify-between">
                              <span className="font-bold">{rIdx + 1}. {reg.fullName}</span>
                              <span className="w-5 h-5 border-2 border-slate-400 rounded block" />
                            </div>
                          ))}
                          {/* Blank rows for walk-ins */}
                          <div className="border border-dashed border-slate-400 p-2 rounded-lg flex items-center justify-between text-slate-400">
                            <span>_____. ______________________</span>
                            <span className="w-5 h-5 border-2 border-slate-300 rounded block" />
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: DELETE EVENT CONFIRMATION                          */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isDeleteEventModalOpen && currentEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#150a10] border-2 border-rose-500/60 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5 text-right"
            >
              <div className="flex items-center gap-3 border-b border-rose-500/30 pb-4">
                <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">אישור מחיקת אירוע לצמיתות</h3>
                  <span className="text-xs text-rose-300 font-bold">פעולה זו היא בלתי הפיכה!</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed bg-[#0a0508] p-4 rounded-2xl border border-rose-500/20">
                <p>
                  האם אתה בטוח שברצונך למחוק את האירוע:
                  <br />
                  <strong className="text-white text-sm block mt-1">"{currentEvent.title}"</strong>
                </p>
                <div className="text-[11px] text-rose-300/90 pt-2 border-t border-rose-500/20 space-y-1">
                  <div>• יימחקו כל {currentEvent.workshops?.length || 0} הסדנאות המוגדרות בו.</div>
                  <div>• יימחקו כל {eventRegistrations.length} רישומי המורים והשיבוצים.</div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteEventModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  ביטול
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteEvent}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-900/40"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>כן, מחק אירוע זה</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
