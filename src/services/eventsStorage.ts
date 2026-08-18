import { TeacherEvent, WorkshopRegistration, Workshop } from '../types';
import { appendRegistrationToGoogleSheet, syncAllRegistrationsToGoogleSheet } from './googleWorkspace';
import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

const EVENTS_STORAGE_KEY = 'arens_teacher_events_v2';
const REGISTRATIONS_STORAGE_KEY = 'arens_workshop_registrations_v1';

// Exact event details based on official program flyer
export const DEFAULT_TEACHER_EVENT: TeacherEvent = {
  id: 'arens-pedagogy-2026',
  title: 'יום הערכות',
  subtitle: 'יום הערכות שש שנתי משה ארנס',
  description: 'ברוכים הבאים ליום ההיערכות השש-שנתי ע"ש משה ארנס בטרמינל העיצוב בת ים. נשמח לראותכם! בברכת שנת עשייה, צמיחה והתפתחות 🌸',
  date: '2026-08-25',
  hours: '09:00 - 15:00',
  location: 'טרמינל העיצוב בת ים',
  contactPerson: 'צוות הנהלה ופדגוגיה',
  contactEmail: 'pedagogy@arens.tik-tak.school',
  contactPhone: '03-9052200',
  status: 'open',
  schedule: [
    { 
      time: '09:00 - 09:30', 
      activity: 'פתיחה: פתיחת יום והתכנסות', 
      location: 'מתחם ראשי' 
    },
    { 
      time: '10:00 - 11:00', 
      activity: 'סדנאות לבחירה: נגרות (25 איש), טרריום (40 איש), ארומתרפיה (20 איש), גזרות נייר (40 איש)', 
      location: 'סדנאות טרמינל העיצוב' 
    },
    { 
      time: '11:00 - 11:30', 
      activity: 'הפסקה: זמן רענון ויציאה מהסדנאות (כולל בופר ללו"ז)', 
      location: 'מתחם הפסקה' 
    },
    { 
      time: '11:30 - 12:00', 
      activity: 'מפגשים נפרדים: מורי התיכון - מפגש עם נאוה | מורי חטיבת הנעורים - מפגש עם אלי', 
      location: 'אולמות נפרדים' 
    },
    { 
      time: '12:00 - 12:45', 
      activity: 'ארוחת צהריים: ארוחה משותפת וזמן הפסקה צוותי', 
      location: 'מתחם ארוחה' 
    },
    { 
      time: '12:45 - 14:30', 
      activity: 'עבודה צוותית: מפגש עם רכזי השכבה והיועצים | נאוה עם מורים מקצועיים בתיכון | אלי עם מורים מקצועיים בחטיבת הנעורים', 
      location: 'מרחבי עבודה' 
    },
    { 
      time: '14:30 - 15:00', 
      activity: 'סיכום יום: מליאת סיכום ואיחולי שנת לימודים מוצלחת', 
      location: 'אולם מרכזי' 
    }
  ],
  workshops: [
    {
      id: 'ws-carpentry',
      title: 'נגרות',
      description: 'סדנת נגרות ויצירה בעץ - תכנון, עבודה עם כלי נגרות ובניית פריט מעוצב.',
      instructor: 'מנחה סדנת נגרות',
      room: 'חדר נגרות',
      maxCapacity: 25,
      timeSlot: '10:00 - 11:00',
      category: 'יצירה ואמנות',
      icon: 'Sparkles'
    },
    {
      id: 'ws-terrarium',
      title: 'טרריום',
      description: 'סדנת בנייה ועיצוב של טרריום אקולוגי אישי - חיבור לטבע וצמחים.',
      instructor: 'מנחה סדנת טרריום',
      room: 'מעבדה ירוקה - טרמינל העיצוב',
      maxCapacity: 40,
      timeSlot: '10:00 - 11:00',
      category: 'סביבה וטבע',
      icon: 'Sparkles'
    },
    {
      id: 'ws-aromatherapy',
      title: 'ארומתרפיה',
      description: 'סדנת ארומתרפיה חווייתית - הכרת שמנים אתריים, הפגת מתחים ותערובות מותאמות.',
      instructor: 'מנחה סדנת ארומתרפיה',
      room: 'מרחב רווחה - טרמינל העיצוב',
      maxCapacity: 20,
      timeSlot: '10:00 - 11:00',
      category: 'בריאות וחוסן',
      icon: 'HeartHandshake'
    },
    {
      id: 'ws-paper-cuts',
      title: 'גזרות נייר',
      description: 'סדנת אמנות גזירות נייר מסורתית ומודרנית - דיוק, יצירתיות ועיצובים מרהיבים.',
      instructor: 'מנחה סדנת גזרות נייר',
      room: 'סטודיו אמנות - טרמינל העיצוב',
      maxCapacity: 40,
      timeSlot: '10:00 - 11:00',
      category: 'יצירה ואמנות',
      icon: 'Sparkles'
    }
  ]
};

// Initial verified list of 11 registered teachers from production
export const INITIAL_REGISTERED_TEACHERS: WorkshopRegistration[] = [
  {
    id: 'reg-1',
    eventId: 'arens-pedagogy-2026',
    workshopId: 'ws-carpentry',
    workshopTitle: 'נגרות',
    fullName: 'ציזנר גיא',
    phone: '052-6564464',
    email: '1003045545@taded.org.il',
    roleOrSubject: 'מדעי המחשב',
    notes: '',
    registeredAt: '17.8.2026, 19:09',
    room: 'חדר נגרות',
    timeSlot: '10:00 - 11:00',
    instructor: 'צוות טרמינל העיצוב'
  },
  {
    id: 'reg-2',
    eventId: 'arens-pedagogy-2026',
    workshopId: 'ws-carpentry',
    workshopTitle: 'נגרות',
    fullName: 'רז קצב',
    phone: '0526855951',
    email: 'razkyk007@gmail.com',
    roleOrSubject: 'מחנך נחשון',
    notes: '',
    registeredAt: '17.8.2026, 19:13',
    room: 'חדר נגרות',
    timeSlot: '10:00 - 11:00',
    instructor: 'צוות טרמינל העיצוב'
  },
  {
    id: 'reg-3',
    eventId: 'arens-pedagogy-2026',
    workshopId: 'ws-aromatherapy',
    workshopTitle: 'ארומתרפיה',
    fullName: 'בזן מלכה',
    phone: '0533252900',
    email: 'bezuma9@gmail.com',
    roleOrSubject: 'מורה לספרות ועברית',
    notes: '',
    registeredAt: '17.8.2026, 19:21',
    room: 'מרחב רווחה - טרמינל העיצוב',
    timeSlot: '10:00 - 11:00',
    instructor: 'מומחית ארומתרפיה'
  },
  {
    id: 'reg-4',
    eventId: 'arens-pedagogy-2026',
    workshopId: 'ws-carpentry',
    workshopTitle: 'נגרות',
    fullName: 'אורלי רז',
    phone: '0523892522',
    email: 'orly.raz.1010@gmail.com',
    roleOrSubject: 'רכזת שכבה יב',
    notes: 'טבעוני בבקשה',
    registeredAt: '17.8.2026, 19:48',
    room: 'חדר נגרות',
    timeSlot: '10:00 - 11:00',
    instructor: 'צוות טרמינל העיצוב'
  },
  {
    id: 'reg-5',
    eventId: 'arens-pedagogy-2026',
    workshopId: 'ws-aromatherapy',
    workshopTitle: 'ארומתרפיה',
    fullName: 'אימאן מחאמיד',
    phone: '0548390285',
    email: 'eman.mahameed28@gmail.com',
    roleOrSubject: 'מחנכת י״ב 3',
    notes: '',
    registeredAt: '17.8.2026, 19:53',
    room: 'מרחב רווחה - טרמינל העיצוב',
    timeSlot: '10:00 - 11:00',
    instructor: 'מומחית ארומתרפיה'
  },
  {
    id: 'reg-6',
    eventId: 'arens-pedagogy-2026',
    workshopId: 'ws-carpentry',
    workshopTitle: 'נגרות',
    fullName: 'אסתי זינגר',
    phone: '050200787',
    email: 'estisinger1967@gmail.com',
    roleOrSubject: 'מורה למתמטיקה',
    notes: '',
    registeredAt: '17.8.2026, 20:07',
    room: 'חדר נגרות',
    timeSlot: '10:00 - 11:00',
    instructor: 'צוות טרמינל העיצוב'
  },
  {
    id: 'reg-7',
    eventId: 'arens-pedagogy-2026',
    workshopId: 'ws-aromatherapy',
    workshopTitle: 'ארומתרפיה',
    fullName: 'דיאנה ואינטרוב',
    phone: '0545751161',
    email: 'zhvaintrub@gmail.com',
    roleOrSubject: 'מורה למתמטיקה',
    notes: '',
    registeredAt: '17.8.2026, 21:19',
    room: 'מרחב רווחה - טרמינל העיצוב',
    timeSlot: '10:00 - 11:00',
    instructor: 'מומחית ארומתרפיה'
  },
  {
    id: 'reg-8',
    eventId: 'arens-pedagogy-2026',
    workshopId: 'ws-aromatherapy',
    workshopTitle: 'ארומתרפיה',
    fullName: 'עמליה נורלה',
    phone: '0549259359',
    email: 'namalia1@gmail.com',
    roleOrSubject: 'מתגברת חינוך',
    notes: '',
    registeredAt: '17.8.2026, 21:21',
    room: 'מרחב רווחה - טרמינל העיצוב',
    timeSlot: '10:00 - 11:00',
    instructor: 'מומחית ארומתרפיה'
  },
  {
    id: 'reg-9',
    eventId: 'arens-pedagogy-2026',
    workshopId: 'ws-terrarium',
    workshopTitle: 'טרריום',
    fullName: 'אורה שורץ',
    phone: '0524627712',
    email: 'oraschwarz7@gmail.com',
    roleOrSubject: 'מורה למדעי החברה',
    notes: '',
    registeredAt: '17.8.2026, 22:23',
    room: 'מעבדה ירוקה - טרמינל העיצוב',
    timeSlot: '10:00 - 11:00',
    instructor: 'מומחה בוטניקה וסביבה'
  },
  {
    id: 'reg-10',
    eventId: 'arens-pedagogy-2026',
    workshopId: 'ws-aromatherapy',
    workshopTitle: 'ארומתרפיה',
    fullName: 'צביה כהן',
    phone: '0546497708',
    email: 'zvia.cohen243@gmail.com',
    roleOrSubject: 'סייעת',
    notes: '',
    registeredAt: '18.8.2026, 7:32',
    room: 'מרחב רווחה - טרמינל העיצוב',
    timeSlot: '10:00 - 11:00',
    instructor: 'מומחית ארומתרפיה'
  },
  {
    id: 'reg-11',
    eventId: 'arens-pedagogy-2026',
    workshopId: 'ws-terrarium',
    workshopTitle: 'טרריום',
    fullName: 'גיל ד.',
    phone: '0508765543',
    email: 'gil.davidovitz@gmail.com',
    roleOrSubject: 'אדם',
    notes: 'צמחוני',
    registeredAt: '18.8.2026, 8:09',
    room: 'מעבדה ירוקה - טרמינל העיצוב',
    timeSlot: '10:00 - 11:00',
    instructor: 'מומחה בוטניקה וסביבה'
  }
];


// ==========================================
// REAL-TIME FIRESTORE SUBSCRIPTIONS
// ==========================================

export const subscribeToTeacherEvents = (callback: (events: TeacherEvent[]) => void) => {
  try {
    const eventsRef = collection(db, 'events');
    const unsubscribe = onSnapshot(
      eventsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const events: TeacherEvent[] = [];
          snapshot.forEach((docSnap) => {
            events.push({ ...(docSnap.data() as TeacherEvent), id: docSnap.id });
          });
          localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
          callback(events);
        } else {
          // If remote is empty, check localStorage first before falling back to default
          const currentLocal = getStoredEvents();
          if (currentLocal && currentLocal.length > 0) {
            saveStoredEvents(currentLocal);
            callback(currentLocal);
          } else {
            saveStoredEvent(DEFAULT_TEACHER_EVENT);
            callback([DEFAULT_TEACHER_EVENT]);
          }
        }
      },
      (error) => {
        console.warn('Firestore events listener fallback:', error);
        callback(getStoredEvents());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Error in subscribeToTeacherEvents:', err);
    callback(getStoredEvents());
    return () => {};
  }
};

export const subscribeToRegistrations = (callback: (registrations: WorkshopRegistration[]) => void) => {
  try {
    const regsRef = collection(db, 'registrations');
    const unsubscribe = onSnapshot(
      regsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const registrations: WorkshopRegistration[] = [];
          snapshot.forEach((docSnap) => {
            registrations.push({ ...(docSnap.data() as WorkshopRegistration), id: docSnap.id });
          });
          localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(registrations));
          callback(registrations);
        } else {
          // If Firestore is empty, seed with initial 11 teachers
          INITIAL_REGISTERED_TEACHERS.forEach(reg => {
            setDoc(doc(db, 'registrations', reg.id), reg, { merge: true }).catch(console.warn);
          });
          localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(INITIAL_REGISTERED_TEACHERS));
          callback(INITIAL_REGISTERED_TEACHERS);
        }
      },
      (error) => {
        console.warn('Firestore registrations listener fallback:', error);
        callback(getStoredRegistrations());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Error in subscribeToRegistrations:', err);
    callback(getStoredRegistrations());
    return () => {};
  }
};

// ==========================================
// STORAGE ACCESS METHODS
// ==========================================

export const getStoredEvents = (): TeacherEvent[] => {
  try {
    const saved = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading teacher events from storage:', e);
  }
  return [DEFAULT_TEACHER_EVENT];
};

export const getStoredEventById = (eventId: string): TeacherEvent | undefined => {
  const events = getStoredEvents();
  return events.find(e => e.id === eventId) || (eventId === DEFAULT_TEACHER_EVENT.id ? DEFAULT_TEACHER_EVENT : undefined);
};

export const saveStoredEvents = async (events: TeacherEvent[]): Promise<void> => {
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    window.dispatchEvent(new Event('arens_events_updated'));

    const firestorePromise = (async () => {
      const promises = events.map(ev => {
        const cleanEv = JSON.parse(JSON.stringify(ev));
        return setDoc(doc(db, 'events', ev.id), cleanEv, { merge: true });
      });
      await Promise.all(promises);
    })();

    // Timeout after 2.5 seconds to prevent UI hangs while allowing background sync to complete
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 2500));
    await Promise.race([firestorePromise, timeoutPromise]);
  } catch (e) {
    console.error('Error saving teacher events:', e);
  }
};

export const saveStoredEvent = async (event: TeacherEvent): Promise<void> => {
  try {
    const current = getStoredEvents();
    const existingIndex = current.findIndex(e => e.id === event.id);
    let updated: TeacherEvent[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = event;
    } else {
      updated = [event, ...current];
    }
    await saveStoredEvents(updated);
  } catch (e) {
    console.error('Error saving teacher event:', e);
  }
};

export const deleteStoredEvent = async (eventId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'events', eventId)).catch(console.warn);
    const current = getStoredEvents();
    const updated = current.filter(e => e.id !== eventId);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('arens_events_updated'));
  } catch (e) {
    console.error('Error deleting teacher event:', e);
  }
};

export const getStoredRegistrations = (): WorkshopRegistration[] => {
  try {
    const saved = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading workshop registrations:', e);
  }
  return INITIAL_REGISTERED_TEACHERS;
};

export const saveStoredRegistrations = (registrations: WorkshopRegistration[]): void => {
  try {
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(registrations));
    window.dispatchEvent(new Event('arens_registrations_updated'));
  } catch (e) {
    console.error('Error saving workshop registrations:', e);
  }
};

// ==========================================
// WORKSHOP CAPACITY & REGISTRATION LOGIC
// ==========================================

export interface WorkshopCapacityInfo {
  workshopId: string;
  totalCapacity: number;
  registeredCount: number;
  remainingSeats: number;
  isFull: boolean;
  occupancyPercentage: number;
}

export const getWorkshopCapacity = (
  workshop: Workshop,
  eventId: string,
  allRegistrations: WorkshopRegistration[]
): WorkshopCapacityInfo => {
  const registeredCount = allRegistrations.filter(
    r => r.eventId === eventId && r.workshopId === workshop.id
  ).length;
  const totalCapacity = workshop.maxCapacity || 25;
  const remainingSeats = Math.max(0, totalCapacity - registeredCount);
  const isFull = remainingSeats <= 0;
  const occupancyPercentage = Math.min(100, Math.round((registeredCount / totalCapacity) * 100));

  return {
    workshopId: workshop.id,
    totalCapacity,
    registeredCount,
    remainingSeats,
    isFull,
    occupancyPercentage
  };
};

/**
 * Register a teacher for a workshop
 */
export const registerTeacherForWorkshop = async (
  event: TeacherEvent,
  workshopId: string,
  teacherData: {
    fullName: string;
    phone: string;
    email: string;
    roleOrSubject: string;
    notes?: string;
  }
): Promise<{ success: boolean; registration?: WorkshopRegistration; error?: string }> => {
  let allRegistrations = getStoredRegistrations();

  try {
    const querySnap = await getDocs(collection(db, 'registrations'));
    if (!querySnap.empty) {
      allRegistrations = querySnap.docs.map(d => ({ ...(d.data() as WorkshopRegistration), id: d.id }));
    }
  } catch (err) {
    console.warn('Using local cache for check:', err);
  }

  const workshop = event.workshops.find(w => w.id === workshopId);
  if (!workshop) {
    return { success: false, error: 'הסדנה שנבחרה לא נמצאה' };
  }

  if (event.status !== 'open') {
    return { success: false, error: 'ההרשמה לאירוע זה אינה פתוחה כעת' };
  }

  const cleanPhone = teacherData.phone.replace(/[^0-9]/g, '');
  const cleanEmail = teacherData.email.trim().toLowerCase();

  const existingRegIndex = allRegistrations.findIndex(
    r => r.eventId === event.id && (
      r.phone.replace(/[^0-9]/g, '') === cleanPhone ||
      r.email.trim().toLowerCase() === cleanEmail
    )
  );

  if (existingRegIndex >= 0 && allRegistrations[existingRegIndex].workshopId === workshopId) {
    return {
      success: true,
      registration: allRegistrations[existingRegIndex],
      error: 'הנך כבר רשום/ה לסדנה זו בהצלחה'
    };
  }

  const capacity = getWorkshopCapacity(workshop, event.id, allRegistrations);
  if (capacity.isFull) {
    return {
      success: false,
      error: `סדנה זו (${workshop.title}) מלאה עד אפס מקום. אנא בחר/י סדנה חלופית.`
    };
  }

  const regId = 'reg-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
  const newReg: WorkshopRegistration = {
    id: regId,
    eventId: event.id,
    workshopId: workshop.id,
    workshopTitle: workshop.title,
    fullName: teacherData.fullName.trim(),
    phone: teacherData.phone.trim(),
    email: teacherData.email.trim(),
    roleOrSubject: teacherData.roleOrSubject.trim(),
    notes: teacherData.notes?.trim() || '',
    registeredAt: new Date().toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' }),
    room: workshop.room,
    timeSlot: workshop.timeSlot,
    instructor: workshop.instructor,
    syncedToGoogleSheet: false
  };

  try {
    if (existingRegIndex >= 0) {
      const oldDocId = allRegistrations[existingRegIndex].id;
      if (oldDocId) {
        await deleteDoc(doc(db, 'registrations', oldDocId)).catch(console.warn);
      }
    }

    await setDoc(doc(db, 'registrations', newReg.id), newReg);

    let updatedList: WorkshopRegistration[];
    if (existingRegIndex >= 0) {
      updatedList = [...allRegistrations];
      updatedList[existingRegIndex] = newReg;
    } else {
      updatedList = [...allRegistrations, newReg];
    }
    saveStoredRegistrations(updatedList);

    if (event.googleSheetId) {
      appendRegistrationToGoogleSheet(event.googleSheetId, event, newReg)
        .then(() => {
          newReg.syncedToGoogleSheet = true;
          setDoc(doc(db, 'registrations', newReg.id), newReg, { merge: true }).catch(console.warn);
        })
        .catch(err => console.warn('Google sheet sync failed:', err));
    }

    return { success: true, registration: newReg };
  } catch (err) {
    console.error('Registration save error:', err);
    return { success: false, error: 'שגיאה בשמירה בבסיס הנתונים' };
  }
};

/**
 * Move a teacher to another workshop (Admin action)
 */
export const moveTeacherToWorkshop = (
  registrationId: string,
  targetWorkshopId: string,
  event: TeacherEvent
): { success: boolean; error?: string } => {
  const allRegistrations = getStoredRegistrations();
  const regIndex = allRegistrations.findIndex(r => r.id === registrationId);

  if (regIndex === -1) {
    return { success: false, error: 'הנרשם לא נמצא במערכת' };
  }

  const targetWorkshop = event.workshops.find(w => w.id === targetWorkshopId);
  if (!targetWorkshop) {
    return { success: false, error: 'סדנת היעד לא נמצאה' };
  }

  const updatedReg: WorkshopRegistration = {
    ...allRegistrations[regIndex],
    workshopId: targetWorkshop.id,
    workshopTitle: targetWorkshop.title,
    room: targetWorkshop.room,
    timeSlot: targetWorkshop.timeSlot,
    instructor: targetWorkshop.instructor
  };

  const updatedList = [...allRegistrations];
  updatedList[regIndex] = updatedReg;
  saveStoredRegistrations(updatedList);

  setDoc(doc(db, 'registrations', registrationId), updatedReg, { merge: true }).catch(console.warn);

  if (event.googleSheetId) {
    syncAllRegistrationsToGoogleSheet(event.googleSheetId, event, updatedList).catch(console.warn);
  }

  return { success: true };
};

/**
 * Cancel / Delete a registration (Admin action)
 */
export const cancelRegistration = (registrationId: string, event?: TeacherEvent): boolean => {
  deleteDoc(doc(db, 'registrations', registrationId)).catch(console.warn);
  const allRegistrations = getStoredRegistrations();
  const updatedList = allRegistrations.filter(r => r.id !== registrationId);
  saveStoredRegistrations(updatedList);

  if (event && event.googleSheetId) {
    syncAllRegistrationsToGoogleSheet(event.googleSheetId, event, updatedList).catch(console.warn);
  }

  return true;
};

/**
 * Formats date string to Israeli standard format: DD/MM/YYYY
 */
export const formatToIsraeliDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    return trimmed;
  }
  const parts = trimmed.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    const cleanDay = day.split('T')[0];
    return `${cleanDay.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
  return dateStr;
};

/**
 * Get published/open upcoming events for homepage portal
 */
export const getUpcomingTeacherEvents = (): TeacherEvent[] => {
  const events = getStoredEvents();
  return events.filter(e => (e.status as string) !== 'archived');
};

