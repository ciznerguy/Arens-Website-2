export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'דחוף' | 'פדגוגי' | 'חברתי' | 'כללי';
  author: string;
  imageUrl?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  category: 'מבחן' | 'אירוע חברתי' | 'טקס' | 'אחר';
}

export interface BellPeriod {
  period: number;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  name: string;
}

export interface ClassInfo {
  id: string;
  name: string; // e.g. "ז' 1"
  homeroomTeacher: string; // מחנך/ת
  room: string;
  specialty?: string; // e.g. "כיתת מופת", "סייבר"
}

export interface GradeLevel {
  grade: string;
  coordinator: string; // רכז/ת שכבה
  description: string;
  classes: ClassInfo[];
}

export interface LearningSpace {
  id: string;
  name: string;
  coordinator: string;
  iconName: string;
  description: string;
  topics: string[];
  resources: { title: string; url: string }[];
}

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  iconName: string;
  badge?: string;
  category: 'מערכות למידה' | 'שירותים' | 'משרד החינוך' | 'לתלמידים' | 'להורים' | 'למורים' | string;
  audience?: 'students' | 'parents' | 'teachers' | 'all' | 'תלמידים' | 'הורים' | 'מורים' | 'כללי';
  showInMenu?: boolean;
}

export interface InternalPage {
  title: string;
  category: string;
  subtitle?: string;
  icon?: string;
  content: string[];
  audience?: 'students' | 'parents' | 'teachers' | 'all' | 'תלמידים' | 'הורים' | 'מורים' | 'כללי';
  showInMenu?: boolean;
  date?: string;
  sections?: {
    title: string;
    text?: string | string[];
    badge?: string;
    list?: string[];
  }[];
  interactiveFields?: {
    label: string;
    placeholder: string;
    type: 'text' | 'textarea' | 'select';
    options?: string[];
  }[];
  pdfFiles?: {
    name: string;
    url: string;
    size?: string;
  }[];
}

export interface GalleryPhoto {
  id: string;
  title: string;
  imageUrl: string;
  category: 'לימודים' | 'אירועים' | 'ספורט' | 'טקסים';
  date: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  isManagement: boolean;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
}

export type EventStatus = 'draft' | 'open' | 'closed' | 'completed';

export interface Workshop {
  id: string;
  title: string;
  description: string;
  instructor: string;
  room: string;
  maxCapacity: number;
  timeSlot: string; // e.g. "10:30 - 12:30"
  category?: string; // e.g. "AI בחינוך", "חוסן ורגש", "פדגוגיה"
  icon?: string;
}

export interface WorkshopRegistration {
  id: string;
  eventId: string;
  workshopId: string;
  workshopTitle: string;
  fullName: string;
  phone: string;
  email: string;
  roleOrSubject: string; // תפקיד / מקצוע הוראה
  notes?: string;
  registeredAt: string; // ISO string / formatted date
  room: string;
  timeSlot: string;
  instructor: string;
  syncedToGoogleSheet?: boolean;
}

export interface TeacherEvent {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  date: string; // e.g. "2026-09-01"
  hours: string; // e.g. "08:30 - 14:00"
  location: string; // e.g. "אודיטוריום ראשי ומרחבי למידה"
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  status: EventStatus;
  schedule?: { time: string; activity: string; location?: string }[];
  workshops: Workshop[];
  googleSheetId?: string;
  googleSheetUrl?: string;
  autoSyncGoogleSheets?: boolean;
}

export interface SchoolMajor {
  id: string;
  title: string;
  division: 'middle_school' | 'high_school'; // חטיבת ביניים או חטיבה עליונה
  shortDescription: string;
  fullDescription: string;
  icon?: string;
  highlights: string[];
  targetGrades: string; // e.g. "שכבות ז'-ט'" או "שכבות י'-יב'"
  contactPerson?: string;
  hoursPerWeek?: string;
  isFeatured?: boolean;
  prerequisites?: string;
  syllabusLink?: string;
}



