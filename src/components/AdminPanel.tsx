import { saveStaffMember, deleteStaffMember, resetStaffToDefaults, getStoredStaffMembers, subscribeToStaffMembers } from '../services/staffStorage';
import { saveNewsArticle, deleteNewsArticle, resetNewsToDefaults, getStoredNews, saveSetting } from '../services/cmsStorage';
import { syncPageOverrideToCloud, syncGradeClassesToCloud } from '../services/pagesStorage';
import { syncAdminConfigToCloud, subscribeToAdminSettings, fetchAdminConfigFromCloud, getStoredEditors } from '../services/adminStorage';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  BookOpen, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Code, 
  Settings, 
  UserPlus, 
  Save, 
  RotateCcw, 
  Key, 
  Check, 
  Copy, 
  X, 
  Link, 
  FileText, 
  AlertTriangle, 
  Paperclip,
  UploadCloud, 
  LogOut, 
  ExternalLink, 
  HelpCircle, 
  Eye, 
  EyeOff,
  UserCheck,
  PlusCircle,
  FilePlus,
  RefreshCw,
  Search,
  CheckCircle,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Palette,
  Sparkles,
  Shuffle,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  GraduationCap,
  Home,
  Compass,
  FileDown,
  Info,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { TeacherEventsAdmin } from './TeacherEventsAdmin';
import { MajorsAdmin } from './MajorsAdmin';
import { getStoredMajors } from '../services/majorsStorage';
import { 
  INTERNAL_PAGES, 
  InternalPage, 
  getInternalPageOverrides, 
  saveInternalPageOverride, 
  deleteInternalPageOverride,
  deleteInternalPagePermanently,
  getAllPagesMap,
  getGradeClassesOverrides,
  saveGradeClassesOverride,
  getInternalPage
} from '../data/internalPages';
import { schoolNewsArticles, NewsArticle, defaultStaffMembers, gradesData } from '../data';
import { StaffMember, QuickLink } from '../types';
import { getHebrewInitials, getAvatarColor } from '../utils/avatarUtils';
import { SITE_THEMES, DESIGN_TRENDS } from '../data/themes';
import { getQuickLinks, saveQuickLink, deleteQuickLink } from '../data/quickLinks';

// Initial default editors
const DEFAULT_EDITORS = [
  { email: 'nava.ss@arens.school', name: 'נאווה שקל ששון', role: 'מנהלת שש-שנתי' },
  { email: 'dan.p@arens.school', name: 'דן פנחס', role: 'מנהל חטיבת נעורים' },
  { email: '1003045545@taded.org.il', name: 'מנהל ראשי', role: 'מנהל ראשי' }
];

interface Editor {
  email: string;
  name: string;
  role: string;
}

// Audience parser & formatter helpers
const parseAudience = (audStr: string) => {
  if (!audStr || audStr === 'כללי' || audStr === 'all') {
    return { students: true, parents: true, teachers: true };
  }
  const lower = audStr.toLowerCase();
  const students = lower.includes('תלמיד') || lower.includes('student');
  const parents = lower.includes('הור') || lower.includes('parent');
  const teachers = lower.includes('מור') || lower.includes('teacher');
  
  if (!students && !parents && !teachers) {
    return { students: true, parents: true, teachers: true };
  }
  return { students, parents, teachers };
};

const formatAudience = (selected: { students: boolean; parents: boolean; teachers: boolean }) => {
  if (selected.students && selected.parents && selected.teachers) {
    return 'כללי';
  }
  const list: string[] = [];
  if (selected.students) list.push('תלמידים');
  if (selected.parents) list.push('הורים');
  if (selected.teachers) list.push('מורים');
  
  if (list.length === 0) return 'כללי';
  return list.join(', ');
};

interface AdminPanelProps {
  onClose: () => void;
  onNavigateToPage?: (url: string) => void;
  activeTheme?: string;
  onThemeChange?: (themeId: string) => void;
}

export default function AdminPanel({ onClose, onNavigateToPage, activeTheme, onThemeChange }: AdminPanelProps) {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>('1003045545@taded.org.il');
  const [loginPassword, setLoginPassword] = useState<string>('admin123');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Admin User Info
  const [currentUser, setCurrentUser] = useState<Editor | null>(null);

  // CMS Tabs
  const [activeTab, setActiveTab] = useState<'homepage' | 'pages' | 'my-grade' | 'majors' | 'news' | 'editors' | 'theme' | 'staff' | 'socials' | 'quick-links' | 'teachers-events'>('homepage');

  // Homepage Settings State
  const [hpSubtitle, setHpSubtitle] = useState<string>('שש שנתי ע"ש משה ארנס');
  const [hpTitle, setHpTitle] = useState<string>('ארנס מצמיח אדם וחברה');
  const [hpDescription, setHpDescription] = useState<string>('רוצים ללמוד ולהצליח ולצד זה להתפתח ולהתקדם? הגעתם למקום הנכון! בואו ללמוד במקום שיוביל אתכם לצמוח ולבנות חברה טובה יותר…');
  const [hpBall1, setHpBall1] = useState<string>('לומד עצמאי');
  const [hpBall2, setHpBall2] = useState<string>('מרחבי למידה');
  const [hpBall3, setHpBall3] = useState<string>('דיאלוג');
  const [hpPrimaryBtn, setHpPrimaryBtn] = useState<string>('כניסה לשכבות');
  const [hpSecondaryBtn, setHpSecondaryBtn] = useState<string>('מה מתרחש אצלנו?');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('arens_homepage_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setHpSubtitle(parsed.heroSubtitle || 'שש שנתי ע"ש משה ארנס');
        setHpTitle(parsed.heroTitle || 'ארנס מצמיח אדם וחברה');
        setHpDescription(parsed.heroDescription || 'רוצים ללמוד ולהצליח ולצד זה להתפתח ולהתקדם? הגעתם למקום הנכון! בואו ללמוד במקום שיוביל אתכם לצמוח ולבנות חברה טובה יותר…');
        setHpBall1(parsed.ball1 || 'לומד עצמאי');
        setHpBall2(parsed.ball2 || 'מרחבי למידה');
        setHpBall3(parsed.ball3 || 'דיאלוג');
        setHpPrimaryBtn(parsed.primaryBtnText || 'כניסה לשכבות');
        setHpSecondaryBtn(parsed.secondaryBtnText || 'מה מתרחש אצלנו?');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveHomepageSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = {
      heroSubtitle: hpSubtitle.trim(),
      heroTitle: hpTitle.trim(),
      heroDescription: hpDescription.trim(),
      ball1: hpBall1.trim(),
      ball2: hpBall2.trim(),
      ball3: hpBall3.trim(),
      primaryBtnText: hpPrimaryBtn.trim(),
      secondaryBtnText: hpSecondaryBtn.trim()
    };
    localStorage.setItem('arens_homepage_settings', JSON.stringify(settings));
    localStorage.setItem('arens_hero_balls', JSON.stringify([settings.ball1, settings.ball2, settings.ball3]));
    
    syncAdminConfigToCloud('homepageSettings', settings);
    syncAdminConfigToCloud('heroBalls', [settings.ball1, settings.ball2, settings.ball3]);

    window.dispatchEvent(new Event('homepage_settings_updated'));
    window.dispatchEvent(new Event('hero_balls_updated'));
    
    setSaveSuccess('הגדרות וכותרות דף הבית נשמרו בהצלחה!');
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  const handleResetHomepageSettings = () => {
    askConfirmation(
      'איפוס תוכן דף הבית',
      'האם אתה בטוח שברצונך לשחזר את כותרות ותכני דף הבית לברירת המחדל?',
      () => {
        localStorage.removeItem('arens_homepage_settings');
        localStorage.removeItem('arens_hero_balls');
        setHpSubtitle('שש שנתי ע"ש משה ארנס');
        setHpTitle('ארנס מצמיח אדם וחברה');
        setHpDescription('רוצים ללמוד ולהצליח ולצד זה להתפתח ולהתקדם? הגעתם למקום הנכון! בואו ללמוד במקום שיוביל אתכם לצמוח ולבנות חברה טובה יותר…');
        setHpBall1('לומד עצמאי');
        setHpBall2('מרחבי למידה');
        setHpBall3('דיאלוג');
        setHpPrimaryBtn('כניסה לשכבות');
        setHpSecondaryBtn('מה מתרחש אצלנו?');

        window.dispatchEvent(new Event('homepage_settings_updated'));
        window.dispatchEvent(new Event('hero_balls_updated'));

        setSaveSuccess('תוכן דף הבית שוחזר לברירת המחדל.');
        setTimeout(() => setSaveSuccess(null), 3500);
      },
      'כן, שחזר לברירת מחדל'
    );
  };

  // Theme Customizer States
  const [themeSubTab, setThemeSubTab] = useState<'trends' | 'manual'>('trends');
  const [trendSetIndex, setTrendSetIndex] = useState<number>(0);
  const [themePrompt, setThemePrompt] = useState<string>('');
  const [promptStatus, setPromptStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [customColors, setCustomColors] = useState<Record<string, string>>({
    "school-bg": "#333d4e",
    "school-panel": "#3e495b",
    "school-panel2": "#4a566a",
    "school-cyan": "#22d3ee",
    "school-violet": "#818cf8",
    "school-text": "#f8fafc",
    "school-muted": "#e2e8f0",
  });

  // Editors Management state
  const [editors, setEditors] = useState<Editor[]>(() => getStoredEditors());
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('עורך תוכן');
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [copiedThemeLink, setCopiedThemeLink] = useState(false);

  // Pages Management state
  const [allPagesMap, setAllPagesMap] = useState<Record<string, InternalPage>>({});
  const [selectedPageKey, setSelectedPageKey] = useState<string>('');
  const [searchPageQuery, setSearchPageQuery] = useState<string>('');
  const [editMode, setEditMode] = useState<'visual' | 'code'>('visual');
  const [isCreatingNewPage, setIsCreatingNewPage] = useState<boolean>(false);

  // Editing page state
  const [newPageKey, setNewPageKey] = useState<string>('');
  const [pageTitle, setPageTitle] = useState<string>('');
  const [pageCategory, setPageCategory] = useState<string>('חט"ב');
  const [pageSubtitle, setPageSubtitle] = useState<string>('');
  const [pageIcon, setPageIcon] = useState<string>('BookOpen');
  const [pageAudience, setPageAudience] = useState<string>('כללי');
  const [pageShowInMenu, setPageShowInMenu] = useState<boolean>(false);
  const [pageContent, setPageContent] = useState<string[]>(['']);

  // Quick Links Management state
  const [quickLinksList, setQuickLinksList] = useState<QuickLink[]>([]);
  const [editingQuickLinkId, setEditingQuickLinkId] = useState<string | null>(null);
  const [quickLinkTitle, setQuickLinkTitle] = useState<string>('');
  const [quickLinkUrl, setQuickLinkUrl] = useState<string>('');
  const [quickLinkCategory, setQuickLinkCategory] = useState<string>('מערכות למידה');
  const [quickLinkAudience, setQuickLinkAudience] = useState<string>('כללי');
  const [quickLinkIcon, setQuickLinkIcon] = useState<string>('ExternalLink');
  const [quickLinkBadge, setQuickLinkBadge] = useState<string>('');
  const [quickLinkShowInMenu, setQuickLinkShowInMenu] = useState<boolean>(true);
  
  // Sections state
  const [pageSections, setPageSections] = useState<any[]>([]);
  
  // PDF Files state
  const [pagePdfFiles, setPagePdfFiles] = useState<{name: string; url: string; size?: string;}[]>([]);
  const [isDraggingPdf, setIsDraggingPdf] = useState<boolean>(false);
  
  // JSON Raw string state for code editor
  const [rawJsonStr, setRawJsonStr] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // --- Grade Layer Management & RBAC States ---
  const [impersonatedRole, setImpersonatedRole] = useState<string | null>(null);
  const [selectedSubPageUrl, setSelectedSubPageUrl] = useState<string | null>(null);
  const [isEditingSubPage, setIsEditingSubPage] = useState<boolean>(false);
  const [isCreatingSubPage, setIsCreatingSubPage] = useState<boolean>(false);
  const [adminSelectedGrade, setAdminSelectedGrade] = useState<string>('ז');
  const [gradeSubWorkspace, setGradeSubWorkspace] = useState<'home' | 'classes' | 'subpages'>('home');
  const [gradeClassesList, setGradeClassesList] = useState<any[]>([]);

  // Grade Coordinator Invitation State (Super Admin)
  const [coordInviteName, setCoordInviteName] = useState<string>('');
  const [coordInviteEmail, setCoordInviteEmail] = useState<string>('');
  const [coordInviteLink, setCoordInviteLink] = useState<string | null>(null);

  // Grade Main Page Edit States
  const [gradeMainTitle, setGradeMainTitle] = useState<string>('');
  const [gradeMainSubtitle, setGradeMainSubtitle] = useState<string>('');
  const [gradeMainContent, setGradeMainContent] = useState<string>('');
  const [gradeMainSections, setGradeMainSections] = useState<any[]>([]);
  const [gradeMainPdfFiles, setGradeMainPdfFiles] = useState<any[]>([]);

  // Grade Sub-page Edit States
  const [subPageUrl, setSubPageUrl] = useState<string>('');
  const [subPageTitle, setSubPageTitle] = useState<string>('');
  const [subPageSubtitle, setSubPageSubtitle] = useState<string>('');
  const [subPageContent, setSubPageContent] = useState<string>('');
  const [subPagePdfFiles, setSubPagePdfFiles] = useState<any[]>([]);

  // Role detection helpers
  const isSuperAdmin = (role: string) => {
    return role === 'מנהל ראשי' || role === 'סופר אדמין' || role === 'סופר אדמין (Super Admin)' || role === 'מנהלת שש-שנתי';
  };

  const isAdmin = (role: string) => {
    return role === 'אדמין' || role === 'אדמין (Admin)' || role === 'מנהל חטיבת נעורים';
  };

  const isGradeCoordinator = (role: string) => {
    return role.startsWith('רכז שכבה') || role.startsWith('רכז/ת שכבה') || role.includes('רכז שכבה') || role.includes('רכז/ת שכבה');
  };

  const isMajorCoordinator = (role: string) => {
    return role.startsWith('רכז מגמת') || role.startsWith('רכז/ת מגמת') || role.includes('רכז מגמת') || role.includes('רכז/ת מגמת') || role.includes('רכז מגמה');
  };

  const getMajorIdFromCoordinatorRole = (role: string): string | null => {
    if (!isMajorCoordinator(role)) return null;
    const r = role.toLowerCase();
    if (r.includes('דאטה') || r.includes('data')) return 'major-data-analyst';
    if (r.includes('תיאטרון') || r.includes('מחזות')) return 'major-theater-musicals';
    if (r.includes('פיזיקה')) return 'major-physics';
    if (r.includes('גיאוגרפיה') || r.includes('סייבר גיאוגרפיה')) return 'major-cyber-geography';
    if (r.includes('מנהל') || r.includes('כלכלה')) return 'major-business-econ';
    if (r.includes('ערבית')) return 'major-arabic';
    if (r.includes('מדעי החברה') || r.includes('חברה')) return 'major-social-sciences';
    if (r.includes('כימיה')) return 'major-chemistry';
    if (r.includes('תוכנה') || r.includes('הנדסת תוכנה') || r.includes('מחשבים')) return 'major-software-eng';
    if (r.includes('חנ"ג') || r.includes('חינוך גופני') || r.includes('ספורט')) return 'major-pe';
    if (r.includes('ביולוגיה')) return 'major-biology';
    return null;
  };

  const getGradeFromCoordinatorRole = (role: string): string | null => {
    if (!isGradeCoordinator(role)) return null;
    if (role.includes("ז'")) return "ז";
    if (role.includes("ח'")) return "ח";
    if (role.includes("ט'")) return "ט";
    if (role.includes("יא'")) return "יא";
    if (role.includes("יב'")) return "יב";
    if (role.includes("י'")) return "י";
    if (role.includes('ז')) return 'ז';
    if (role.includes('ח')) return 'ח';
    if (role.includes('ט')) return 'ט';
    if (role.includes('יא')) return 'יא';
    if (role.includes('יב')) return 'יב';
    if (role.includes('י')) return 'י';
    return null;
  };

  const GRADE_MAIN_KEYS: Record<string, string> = {
    'ז': "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%96-%d7%94%d7%a6%d7%a2%d7%93-%d7%94%d7%a8%d7%90%d7%a9%d7%95%d7%9f-%d7%91%d7%93%d7%a8%d7%9a-%d7%94%d7%a7%d7%93%d7%a9%d7%94/",
    'ח': "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%97-%d7%a6%d7%9e%d7%99%d7%97%d7%94-%d7%95%d7%94%d7%a2%d7%9e%d7%a7%d7%94-%d7%9e%d7%92%d7%9c%d7%99%d7%9d-%d7%90%d7%aa-%d7%94%d7%9b%d7%95%d7%97%d7%95%d7%aa-%d7%a9/",
    'ט': "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%98-%d7%91%d7%97%d7%99%d7%a8%d7%95%d7%aa-%d7%a2%d7%a6%d7%9e%d7%a0%d7%95%d7%aa-%d7%95%d7%90%d7%a7%d7%a8%d7%99%d7%95%d7%aa/",
    'י': "course/%d7%97%d7%98%a2-2/%d7%a4%d7%95%d7%a1%d7%98-%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99/",
    'יא': "course/%d7%97%d7%98%a2-2/%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%90/",
    'יב': "course/%d7%97%d7%98%a2-2/%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%91/"
  };

  const getGradeForPage = (url: string, page: any): string | null => {
    if (!url) return null;
    let decoded = '';
    try {
      decoded = decodeURIComponent(url).toLowerCase();
    } catch {
      decoded = url.toLowerCase();
    }
    const title = (page?.title || '').toLowerCase();
    const subtitle = (page?.subtitle || '').toLowerCase();
    const category = (page?.category || '').toLowerCase();
    
    const fullSearchText = `${decoded} ${title} ${subtitle} ${category}`;

    // 1. High school multi-char grades first (יא, יב)
    if (
      fullSearchText.includes("שכבה-יא") || fullSearchText.includes("שכבת-יא") || 
      fullSearchText.includes("שכבת יא") || fullSearchText.includes("שכבה יא") || 
      fullSearchText.includes("כיתה יא") || fullSearchText.includes("כיתות יא")
    ) return 'יא';

    if (
      fullSearchText.includes("שכבה-יב") || fullSearchText.includes("שכבת-יב") || 
      fullSearchText.includes("שכבת יב") || fullSearchText.includes("שכבה יב") || 
      fullSearchText.includes("כיתה יב") || fullSearchText.includes("כיתות יב")
    ) return 'יב';

    // 2. Middle school grades: ז, ח, ט (Check BEFORE single letter 'י')
    if (
      fullSearchText.includes("שכבת-ז") || fullSearchText.includes("שכבה-ז") || 
      fullSearchText.includes("שכבת ז") || fullSearchText.includes("שכבה ז") || 
      fullSearchText.includes("כיתה ז") || fullSearchText.includes("כיתות ז")
    ) return 'ז';

    if (
      fullSearchText.includes("שכבת-ח") || fullSearchText.includes("שכבה-ח") || 
      fullSearchText.includes("שכבת ח") || fullSearchText.includes("שכבה ח") || 
      fullSearchText.includes("כיתה ח") || fullSearchText.includes("כיתות ח")
    ) return 'ח';

    if (
      fullSearchText.includes("שכבת-ט") || fullSearchText.includes("שכבה-ט") || 
      fullSearchText.includes("שכבת ט") || fullSearchText.includes("שכבה ט") || 
      fullSearchText.includes("כיתה ט") || fullSearchText.includes("כיתות ט")
    ) return 'ט';

    // 3. High school Grade Yod (י) - strictly check single letter 'י' (not יא/יב/Words)
    if (
      fullSearchText.includes("שכבת-י-") || fullSearchText.includes("שכבת-י/") ||
      fullSearchText.includes("שכבה-י-") || fullSearchText.includes("שכבה-י/") ||
      /(שכבת|שכבה|כיתה|כיתות)\s*[-']?\s*י(?![אבגדהוזחטיכלמנסעפצקרשת])/i.test(fullSearchText)
    ) return 'י';

    return null;
  };

  const effectiveRole = impersonatedRole || currentUser?.role || '';

  // News updates state
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [editingNewsIdx, setEditingNewsIdx] = useState<number | null>(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImage, setNewsImage] = useState('');
  const [newsUrl, setNewsUrl] = useState('');
  const [searchNewsQuery, setSearchNewsQuery] = useState('');

  // Staff maintenance states
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null); // 'new' or actual id
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [staffRoleDescription, setStaffRoleDescription] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffBio, setStaffBio] = useState('');
  const [staffImageUrl, setStaffImageUrl] = useState('');
  const [staffIsManagement, setStaffIsManagement] = useState(false);
  const [searchStaffQuery, setSearchStaffQuery] = useState('');
  const [isDraggingStaffPhoto, setIsDraggingStaffPhoto] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showResetStaffConfirm, setShowResetStaffConfirm] = useState<boolean>(false);
  const [staffFormError, setStaffFormError] = useState<string | null>(null);

  // Global Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  const askConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText: string = 'כן, מחק',
    cancelText: string = 'ביטול'
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
    });
  };

  // Social media states
  const [socialFacebook, setSocialFacebook] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialYoutube, setSocialYoutube] = useState('');

  // Save feedback state
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [pageSaveError, setPageSaveError] = useState<string | null>(null);
  const [classSaveStatus, setClassSaveStatus] = useState<boolean>(false);

  // Load configuration on mount
  useEffect(() => {
    // Check local storage for persistent login token
    const token = localStorage.getItem('arens_cms_token');
    const savedUser = localStorage.getItem('arens_cms_user');
    if (token && savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(savedUser));
    }

    // Load Editors from Firestore cloud & local cache
    const initialEditors = getStoredEditors();
    setEditors(initialEditors);
    fetchAdminConfigFromCloud().then((cloudData) => {
      if (cloudData && cloudData.editors && Array.isArray(cloudData.editors) && cloudData.editors.length > 0) {
        setEditors(cloudData.editors);
      }
    });

    // Load Pages including overrides
    refreshPagesMap();

    // Load News Updates
    const savedNews = localStorage.getItem('arens_cms_news');
    if (savedNews) {
      setNewsArticles(JSON.parse(savedNews));
    } else {
      setNewsArticles(schoolNewsArticles);
    }

    // Load Staff Members
    setStaffMembers(getStoredStaffMembers());

    // Subscribe to live staff updates
    const unsubStaff = subscribeToStaffMembers((liveStaff) => {
      setStaffMembers(liveStaff);
    });

    // Load Socials
    const savedSocials = localStorage.getItem('arens_cms_socials');
    if (savedSocials) {
      try {
        const parsed = JSON.parse(savedSocials);
        setSocialFacebook(parsed.facebook || '');
        setSocialInstagram(parsed.instagram || '');
        setSocialYoutube(parsed.youtube || '');
      } catch (e) {
        console.error(e);
      }
    } else {
      setSocialFacebook('https://www.facebook.com/arens.pt');
      setSocialInstagram('https://www.instagram.com/arens_school_pt');
      setSocialYoutube('https://www.youtube.com/@ArensSchool');
    }

    return () => {
      unsubStaff();
    };
  }, []);

  // Automatically select relevant tab for grade coordinators or major coordinators
  useEffect(() => {
    if (isLoggedIn) {
      if (isGradeCoordinator(effectiveRole)) {
        setActiveTab('my-grade');
      } else if (isMajorCoordinator(effectiveRole)) {
        setActiveTab('majors');
      }
    }
  }, [isLoggedIn, effectiveRole]);

  // Load Grade main page details on grade change or update
  useEffect(() => {
    const cleanActiveGrade = (isGradeCoordinator(effectiveRole) 
      ? (getGradeFromCoordinatorRole(effectiveRole) || 'ז') 
      : adminSelectedGrade).replace(/'/g, '').trim();

    const mainPageKey = GRADE_MAIN_KEYS[cleanActiveGrade] || '';
    const mainPage = allPagesMap[mainPageKey];

    if (mainPage) {
      setGradeMainTitle(mainPage.title || '');
      setGradeMainSubtitle(mainPage.subtitle || '');
      setGradeMainContent((mainPage.content || []).join('\n'));
      setGradeMainSections(mainPage.sections || []);
      setGradeMainPdfFiles(mainPage.pdfFiles || []);
    } else {
      setGradeMainTitle(`שכבת ${cleanActiveGrade}`);
      setGradeMainSubtitle('');
      setGradeMainContent('');
      setGradeMainSections([]);
      setGradeMainPdfFiles([]);
    }
  }, [adminSelectedGrade, effectiveRole, allPagesMap, gradeSubWorkspace]);

  // Load Grade classes and tracks when active grade changes
  useEffect(() => {
    const cleanActiveGrade = (isGradeCoordinator(effectiveRole) 
      ? (getGradeFromCoordinatorRole(effectiveRole) || 'ז') 
      : adminSelectedGrade).replace(/'/g, '').trim();

    const overrides = getGradeClassesOverrides();
    if (overrides[cleanActiveGrade] !== undefined) {
      setGradeClassesList(overrides[cleanActiveGrade]);
    } else {
      const defaultG = gradesData.find(g => g.grade === cleanActiveGrade);
      setGradeClassesList(defaultG?.classes || []);
    }
  }, [adminSelectedGrade, effectiveRole, gradeSubWorkspace]);

  // Listen to external page & quick links updates to refresh local map
  useEffect(() => {
    refreshPagesMap();
    refreshQuickLinks();
    fetchAdminConfigFromCloud();

    const unsubAdmin = subscribeToAdminSettings((liveEditors) => {
      setEditors(liveEditors);
    });

    const handleUpdate = () => {
      refreshPagesMap();
    };
    const handleQuickLinksUpdate = () => {
      refreshQuickLinks();
    };

    const handleEditorsUpdate = (e: any) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setEditors(e.detail);
        return;
      }
      const stored = localStorage.getItem('arens_cms_editors');
      if (stored) {
        try {
          setEditors(JSON.parse(stored));
        } catch (err) {}
      }
    };

    window.addEventListener('internal_pages_updated', handleUpdate);
    window.addEventListener('quick_links_updated', handleQuickLinksUpdate);
    window.addEventListener('arens_cms_editors_updated', handleEditorsUpdate);
    return () => {
      unsubAdmin();
      window.removeEventListener('internal_pages_updated', handleUpdate);
      window.removeEventListener('quick_links_updated', handleQuickLinksUpdate);
      window.removeEventListener('arens_cms_editors_updated', handleEditorsUpdate);
    };
  }, []);

  const refreshQuickLinks = () => {
    setQuickLinksList(getQuickLinks());
  };

  const refreshPagesMap = () => {
    setAllPagesMap(getAllPagesMap());
  };

  // Synchronize customColors state when activeTheme or activeTab changes
  useEffect(() => {
    if (activeTab === 'theme') {
      const root = document.documentElement;
      const computedColors: Record<string, string> = {};
      const keys = ["school-bg", "school-panel", "school-panel2", "school-cyan", "school-violet", "school-text", "school-muted"];
      keys.forEach(key => {
        const val = root.style.getPropertyValue(`--color-${key}`).trim();
        if (val) {
          computedColors[key] = val;
        } else {
          const themeObj = SITE_THEMES.find(t => t.id === activeTheme) || SITE_THEMES[0];
          computedColors[key] = themeObj.colors[key as keyof typeof themeObj.colors];
        }
      });
      setCustomColors(computedColors);
    }
  }, [activeTheme, activeTab]);

  const handleColorChange = (key: string, value: string) => {
    const updated = { ...customColors, [key]: value };
    setCustomColors(updated);
    
    // Auto compute line color opacity based on light/dark background
    const isLight = updated["school-bg"].toLowerCase() === '#ffffff' || updated["school-bg"].toLowerCase() === '#f8fafc' || updated["school-bg"].toLowerCase() === '#f1f5f9';
    const line = isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(148, 163, 184, 0.14)';
    
    const customThemeObj = {
      id: 'custom-prompt-theme',
      name: 'עיצוב בהתאמה אישית',
      icon: '🎨',
      colors: {
        ...updated,
        "school-line": line
      }
    };
    
    localStorage.setItem('arens_school_custom_theme', JSON.stringify(customThemeObj));
    if (onThemeChange) {
      onThemeChange('custom-prompt-theme');
    }
  };

  const handleApplyTrendTheme = (trendColors: any) => {
    setCustomColors(trendColors);
    
    const customThemeObj = {
      id: 'custom-prompt-theme',
      name: 'עיצוב בהתאמה אישית',
      icon: '🎨',
      colors: {
        ...trendColors,
        "school-line": trendColors["school-line"] || "rgba(148, 163, 184, 0.14)"
      }
    };
    
    localStorage.setItem('arens_school_custom_theme', JSON.stringify(customThemeObj));
    if (onThemeChange) {
      onThemeChange('custom-prompt-theme');
    }
  };

  const handleApplyPromptTheme = (promptText: string) => {
    if (!promptText.trim()) return;
    setPromptStatus('loading');
    
    setTimeout(() => {
      const p = promptText.toLowerCase();
      let bg = '#070b14';
      let panel = '#0d1424';
      let panel2 = '#101a30';
      let cyan = '#22d3ee';
      let violet = '#818cf8';
      let text = '#e2e8f0';
      let muted = '#94a3b8';
      let line = 'rgba(148, 163, 184, 0.14)';
      
      const isLight = p.includes('בהיר') || p.includes('לבן') || p.includes('light') || p.includes('white') || p.includes('שמש');
      
      if (isLight) {
        bg = '#f8fafc';
        panel = '#ffffff';
        panel2 = '#f1f5f9';
        text = '#0f172a';
        muted = '#475569';
        line = 'rgba(15, 23, 42, 0.08)';
        
        if (p.includes('ירוק') || p.includes('green') || p.includes('טבע') || p.includes('זית') || p.includes('אקולוגי')) {
          cyan = '#15803d';
          violet = '#16a34a';
        } else if (p.includes('כתום') || p.includes('אש') || p.includes('sunset') || p.includes('שקיעה')) {
          cyan = '#ea580c';
          violet = '#f97316';
        } else if (p.includes('סגול') || p.includes('לילך') || p.includes('purple')) {
          cyan = '#7c3aed';
          violet = '#a78bfa';
        } else if (p.includes('זהב') || p.includes('חול') || p.includes('royal') || p.includes('gold')) {
          cyan = '#b45309';
          violet = '#d97706';
        } else if (p.includes('אדום') || p.includes('בורדו') || p.includes('red')) {
          cyan = '#b91c1c';
          violet = '#dc2626';
        } else {
          // Classic blue light
          cyan = '#0284c7';
          violet = '#4f46e5';
        }
      } else {
        // Dark themes
        if (p.includes('ירוק') || p.includes('אזמרגד') || p.includes('green') || p.includes('טבע') || p.includes('eco')) {
          bg = '#050c0b';
          panel = '#0a1715';
          panel2 = '#102421';
          cyan = '#10b981';
          violet = '#34d399';
          line = 'rgba(16, 185, 129, 0.12)';
        } else if (p.includes('זהב') || p.includes('מלכותי') || p.includes('royal') || p.includes('gold') || p.includes('amber') || p.includes('יוקרתי')) {
          bg = '#090d16';
          panel = '#0f1626';
          panel2 = '#192239';
          cyan = '#fbbf24';
          violet = '#f59e0b';
          line = 'rgba(251, 191, 36, 0.12)';
        } else if (p.includes('סייבר') || p.includes('ורוד') || p.includes('פוקסיה') || p.includes('cyber') || p.includes('neon') || p.includes('ניאון') || p.includes('אולטרה') || p.includes('סגול')) {
          bg = '#0f051d';
          panel = '#1a0b36';
          panel2 = '#281452';
          cyan = '#f43f5e';
          violet = '#d946ef';
          line = 'rgba(217, 70, 239, 0.15)';
        } else if (p.includes('אדום') || p.includes('אש') || p.includes('בורדו') || p.includes('red') || p.includes('volcano')) {
          bg = '#0f0505';
          panel = '#1f0d0d';
          panel2 = '#2e1414';
          cyan = '#ef4444';
          violet = '#f87171';
          line = 'rgba(239, 68, 68, 0.15)';
        } else if (p.includes('כתום') || p.includes('sunset') || p.includes('שקיעה') || p.includes('חמים') || p.includes('orange')) {
          bg = '#0d0703';
          panel = '#1c1007';
          panel2 = '#29180b';
          cyan = '#f97316';
          violet = '#fb923c';
          line = 'rgba(249, 115, 22, 0.14)';
        } else if (p.includes('כסף') || p.includes('אפור') || p.includes('gray') || p.includes('silver') || p.includes('מתכת')) {
          bg = '#0b0f14';
          panel = '#131922';
          panel2 = '#1e2633';
          cyan = '#94a3b8';
          violet = '#cbd5e1';
          line = 'rgba(148, 163, 184, 0.15)';
        } else {
          bg = '#070b14';
          panel = '#0d1424';
          panel2 = '#101a30';
          cyan = '#06b6d4';
          violet = '#8b5cf6';
          line = 'rgba(148, 163, 184, 0.14)';
        }
      }
      
      const customThemeObj = {
        id: 'custom-prompt-theme',
        name: 'עיצוב מתוך פרומפט',
        icon: '🔮',
        colors: {
          "school-bg": bg,
          "school-panel": panel,
          "school-panel2": panel2,
          "school-cyan": cyan,
          "school-violet": violet,
          "school-text": text,
          "school-muted": muted,
          "school-line": line
        }
      };
      
      localStorage.setItem('arens_school_custom_theme', JSON.stringify(customThemeObj));
      if (onThemeChange) {
        onThemeChange('custom-prompt-theme');
      }
      
      setCustomColors({
        "school-bg": bg,
        "school-panel": panel,
        "school-panel2": panel2,
        "school-cyan": cyan,
        "school-violet": violet,
        "school-text": text,
        "school-muted": muted,
      });
      
      setPromptStatus('success');
      setTimeout(() => setPromptStatus('idle'), 3000);
    }, 800);
  };

  // Simulated login check
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // Any password works for testing to make it easy for user, but we'll show elegant simulated check
    if (!loginEmail || !loginPassword) {
      setLoginError('נא למלא את כל השדות');
      return;
    }

    // Try matching an editor
    const matched = editors.find(ed => ed.email.toLowerCase() === loginEmail.toLowerCase()) || 
                    DEFAULT_EDITORS.find(ed => ed.email.toLowerCase() === loginEmail.toLowerCase());
    
    const loggedUser = matched || {
      email: loginEmail,
      name: loginEmail.split('@')[0],
      role: 'עורך אורח'
    };

    localStorage.setItem('arens_cms_token', 'simulated_jwt_token_12345');
    localStorage.setItem('arens_cms_user', JSON.stringify(loggedUser));
    setCurrentUser(loggedUser);
    setIsLoggedIn(true);

    // If editor list didn't include them, append them
    if (matched && !editors.some(ed => ed.email === matched.email)) {
      const updated = [...editors, matched];
      setEditors(updated);
      localStorage.setItem('arens_cms_editors', JSON.stringify(updated));
      syncAdminConfigToCloud('editors', updated);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('arens_cms_token');
    localStorage.removeItem('arens_cms_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  // MULTI EDITOR INVITE
  const handleInviteEditorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    // Check if editor already exists
    if (editors.some(ed => ed.email.toLowerCase() === inviteEmail.toLowerCase())) {
      alert('כתובת אימייל זו כבר קיימת ברשימת העורכים המורשים.');
      return;
    }

    const newEditor: Editor = {
      email: inviteEmail.trim(),
      name: inviteName.trim(),
      role: inviteRole
    };

    const updatedEditors = [...editors, newEditor];
    setEditors(updatedEditors);
    localStorage.setItem('arens_cms_editors', JSON.stringify(updatedEditors));
    syncAdminConfigToCloud('editors', updatedEditors);

    // Generate dynamic shareable invite link
    const baseUrl = window.location.origin + window.location.pathname;
    const inviteLink = `${baseUrl}?invite=true&email=${encodeURIComponent(newEditor.email)}&name=${encodeURIComponent(newEditor.name)}&role=${encodeURIComponent(newEditor.role)}`;
    setGeneratedInviteLink(inviteLink);

    // Clear form
    setInviteEmail('');
    setInviteName('');
  };

  const handleCopyInviteLink = () => {
    if (!generatedInviteLink) return;
    navigator.clipboard.writeText(generatedInviteLink);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const handleCopyThemeLink = () => {
    try {
      const baseUrl = window.location.origin + window.location.pathname;
      const themeLink = `${baseUrl}?theme=${activeTheme}`;
      navigator.clipboard.writeText(themeLink);
      setCopiedThemeLink(true);
      setTimeout(() => setCopiedThemeLink(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteEditor = (email: string) => {
    if (currentUser?.email === email) {
      alert('אינך יכול להסיר את עצמך מרשימת העורכים.');
      return;
    }
    askConfirmation(
      'אישור הסרת עורך',
      `האם אתה בטוח שברצונך להסיר את העורך "${email}"?`,
      () => {
        const updated = editors.filter(ed => ed.email !== email);
        setEditors(updated);
        localStorage.setItem('arens_cms_editors', JSON.stringify(updated));
        syncAdminConfigToCloud('editors', updated);
        setSaveSuccess('העורך הוסר בהצלחה');
        setTimeout(() => setSaveSuccess(null), 3000);
      },
      'כן, הסר עורך'
    );
  };

  // --- Grade Layer Management Handlers ---
  const handleSaveGradeMainPage = () => {
    const cleanActiveGrade = (isGradeCoordinator(effectiveRole) 
      ? (getGradeFromCoordinatorRole(effectiveRole) || 'ז') 
      : adminSelectedGrade).replace(/'/g, '').trim();

    const mainPageKey = GRADE_MAIN_KEYS[cleanActiveGrade];
    if (!mainPageKey) return;

    const originalPage = allPagesMap[mainPageKey] || {
      title: `שכבת ${cleanActiveGrade}`,
      category: `שכבה ${cleanActiveGrade}`,
      icon: 'BookOpen'
    };

    const updatedPage: InternalPage = {
      ...originalPage,
      title: gradeMainTitle,
      subtitle: gradeMainSubtitle,
      content: gradeMainContent.split('\n').map(line => line.trim()).filter(Boolean),
      sections: gradeMainSections,
      pdfFiles: gradeMainPdfFiles
    };

    saveInternalPageOverride(mainPageKey, updatedPage);
    refreshPagesMap();
    setSaveSuccess(`דף הבית של שכבת ${cleanActiveGrade} עודכן בהצלחה!`);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleStartCreateGradeSubPage = () => {
    setSubPageUrl('');
    setSubPageTitle('');
    setSubPageSubtitle('');
    setSubPageContent('');
    setSubPagePdfFiles([]);
    setIsCreatingSubPage(true);
    setIsEditingSubPage(false);
  };

  const handleStartEditGradeSubPage = (url: string) => {
    const page = allPagesMap[url];
    if (!page) return;

    setSubPageUrl(url);
    setSubPageTitle(page.title || '');
    setSubPageSubtitle(page.subtitle || '');
    setSubPageContent((page.content || []).join('\n'));
    setSubPagePdfFiles(page.pdfFiles || []);
    setIsEditingSubPage(true);
    setIsCreatingSubPage(false);
  };

  const handleSaveGradeSubPage = () => {
    if (!subPageTitle.trim()) {
      setPageSaveError('נא להזין כותרת לדף');
      setTimeout(() => setPageSaveError(null), 4000);
      return;
    }

    const cleanActiveGrade = (isGradeCoordinator(effectiveRole) 
      ? (getGradeFromCoordinatorRole(effectiveRole) || 'ז') 
      : adminSelectedGrade).replace(/'/g, '').trim();

    let targetUrl = subPageUrl;
    if (isCreatingSubPage) {
      // Generate a friendly, readable URL path
      const safeTitle = subPageTitle.replace(/\s+/g, '-').trim();
      targetUrl = `course/שכבה-${cleanActiveGrade}/${safeTitle}`;
    }

    if (!targetUrl) return;

    const pageObj: InternalPage = {
      title: subPageTitle.trim(),
      subtitle: subPageSubtitle.trim(),
      category: `שכבה ${cleanActiveGrade}`,
      icon: 'FileText',
      content: subPageContent.split('\n').map(line => line.trim()).filter(Boolean),
      pdfFiles: subPagePdfFiles,
      sections: []
    };

    setPageSaveError(null);
    saveInternalPageOverride(targetUrl, pageObj);
    refreshPagesMap();
    setSaveSuccess(isCreatingSubPage ? 'דף משנה חדש נוצר בהצלחה!' : 'השינויים נשמרו בהצלחה!');
    setTimeout(() => setSaveSuccess(null), 3000);

    // Keep active editor open with newly saved data
    setSubPageUrl(targetUrl);
    setSubPageTitle(pageObj.title);
    setSubPageSubtitle(pageObj.subtitle || '');
    setSubPageContent((pageObj.content || []).join('\n'));
    setSubPagePdfFiles(pageObj.pdfFiles || []);
    setIsCreatingSubPage(false);
    setIsEditingSubPage(true);
  };

  const handleDeleteGradeSubPage = (url: string) => {
    const pageObj = allPagesMap[url];
    const pageTitleStr = pageObj ? pageObj.title : url;

    askConfirmation(
      'אישור מחיקת דף משנה',
      `האם אתה בטוח שברצונך למחוק את הדף "${pageTitleStr}"? פעולה זו אינה הפיכה.`,
      () => {
        deleteInternalPagePermanently(url);
        deleteInternalPageOverride(url);
        refreshPagesMap();
        setSaveSuccess('הדף נמחק בהצלחה!');
        setTimeout(() => setSaveSuccess(null), 3000);
      },
      'כן, מחק דף'
    );
  };

  // Section and PDF helpers for grade main and subpages
  const handleAddGradeMainSection = () => {
    setGradeMainSections(prev => [...prev, { title: '', content: '' }]);
  };
  const handleUpdateGradeMainSection = (index: number, field: 'title' | 'content', value: string) => {
    setGradeMainSections(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };
  const handleRemoveGradeMainSection = (index: number) => {
    setGradeMainSections(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddGradeMainPdf = () => {
    setGradeMainPdfFiles(prev => [...prev, { name: '', url: '' }]);
  };
  const handleUpdateGradeMainPdf = (index: number, field: 'name' | 'url', value: string) => {
    setGradeMainPdfFiles(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };
  const handleRemoveGradeMainPdf = (index: number) => {
    setGradeMainPdfFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSubPagePdf = () => {
    setSubPagePdfFiles(prev => [...prev, { name: '', url: '' }]);
  };
  const handleUpdateSubPagePdf = (index: number, field: 'name' | 'url', value: string) => {
    setSubPagePdfFiles(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };
  const handleRemoveSubPagePdf = (index: number) => {
    setSubPagePdfFiles(prev => prev.filter((_, i) => i !== index));
  };

  // GRADE CLASSES & TRACKS MANAGEMENT HANDLERS
  const handleAddGradeClass = () => {
    const cleanActiveGrade = (isGradeCoordinator(effectiveRole) 
      ? (getGradeFromCoordinatorRole(effectiveRole) || 'ז') 
      : adminSelectedGrade).replace(/'/g, '').trim();

    setGradeClassesList(prev => [
      ...prev,
      {
        id: 'cls_' + Date.now(),
        name: `כיתה ${cleanActiveGrade}' ${prev.length + 1} - מסלול`,
        specialty: 'מסלול ייחודי'
      }
    ]);
  };

  const handleUpdateGradeClass = (index: number, field: string, value: string) => {
    setGradeClassesList(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveGradeClass = (index: number) => {
    setGradeClassesList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveGradeClasses = () => {
    const cleanActiveGrade = (isGradeCoordinator(effectiveRole) 
      ? (getGradeFromCoordinatorRole(effectiveRole) || 'ז') 
      : adminSelectedGrade).replace(/'/g, '').trim();

    saveGradeClassesOverride(cleanActiveGrade, gradeClassesList);
    setClassSaveStatus(true);
    setSaveSuccess(`הרכב הכיתות ומסלולי הלימוד של שכבת ${cleanActiveGrade} נשמרו בהצלחה!`);
    setTimeout(() => {
      setSaveSuccess(null);
      setClassSaveStatus(false);
    }, 3500);
  };

  const handleQuickInviteCoordinator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordInviteName || !coordInviteEmail) return;

    const cleanActiveGrade = (isGradeCoordinator(effectiveRole) 
      ? (getGradeFromCoordinatorRole(effectiveRole) || 'ז') 
      : adminSelectedGrade).replace(/'/g, '').trim();

    const roleName = `רכז שכבה ${cleanActiveGrade}`;
    const newEd: Editor = {
      name: coordInviteName.trim(),
      email: coordInviteEmail.trim(),
      role: roleName
    };

    const updated = [...editors.filter(ed => ed.email.toLowerCase() !== coordInviteEmail.toLowerCase()), newEd];
    setEditors(updated);
    localStorage.setItem('arens_cms_editors', JSON.stringify(updated));
    syncAdminConfigToCloud('editors', updated);

    const baseUrl = window.location.origin + window.location.pathname;
    const link = `${baseUrl}?invite=true&email=${encodeURIComponent(newEd.email)}&name=${encodeURIComponent(newEd.name)}&role=${encodeURIComponent(newEd.role)}`;
    setCoordInviteLink(link);
    setCoordInviteName('');
    setCoordInviteEmail('');
  };

  // PAGE SELECT / CREATION LOAD
  const handleSelectPage = (key: string) => {
    setSelectedPageKey(key);
    setIsCreatingNewPage(false);
    
    const page = allPagesMap[key] || getInternalPage(key);
    if (page) {
      setPageTitle(page.title || '');
      setPageCategory(page.category || 'חט"ב');
      setPageSubtitle(page.subtitle || '');
      setPageIcon(page.icon || 'BookOpen');
      setPageAudience(page.audience || 'כללי');
      setPageShowInMenu(!!page.showInMenu);
      setPageContent(page.content && page.content.length > 0 ? [...page.content] : ['']);
      setPageSections(page.sections ? JSON.parse(JSON.stringify(page.sections)) : []);
      setPagePdfFiles(page.pdfFiles ? JSON.parse(JSON.stringify(page.pdfFiles)) : []);
      
      // Update code string
      setRawJsonStr(JSON.stringify(page, null, 2));
      setJsonError(null);
    }
  };

  const handleStartCreateNewPage = () => {
    setIsCreatingNewPage(true);
    setSelectedPageKey('');
    setNewPageKey('course/custom/' + Math.random().toString(36).substring(2, 7));
    setPageTitle('');
    setPageCategory('חט"ב');
    setPageSubtitle('');
    setPageIcon('BookOpen');
    setPageAudience('כללי');
    setPageShowInMenu(false);
    setPageContent(['']);
    setPageSections([]);
    setPagePdfFiles([]);
    
    const defaultPageObj: InternalPage = {
      title: 'כותרת דף חדש',
      category: 'חט"ב',
      subtitle: 'תת כותרת לדף החדש',
      icon: 'BookOpen',
      audience: 'כללי',
      showInMenu: false,
      date: new Date().toISOString().split('T')[0],
      content: ['פסקה ראשונה של תוכן הדף.'],
      sections: [],
      pdfFiles: []
    };
    setRawJsonStr(JSON.stringify(defaultPageObj, null, 2));
    setJsonError(null);
  };

  // DYNAMIC INPUT BUILDERS
  const handleAddParagraph = () => {
    setPageContent([...pageContent, '']);
  };

  const handleRemoveParagraph = (idx: number) => {
    if (pageContent.length <= 1) return;
    setPageContent(pageContent.filter((_, i) => i !== idx));
  };

  const handleParagraphChange = (idx: number, value: string) => {
    const updated = [...pageContent];
    updated[idx] = value;
    setPageContent(updated);
  };

  const handleAddSection = () => {
    const newSec = {
      title: 'סעיף חדש',
      text: '',
      list: []
    };
    setPageSections([...pageSections, newSec]);
  };

  const handleRemoveSection = (sIdx: number) => {
    setPageSections(pageSections.filter((_, i) => i !== sIdx));
  };

  const handleSectionFieldChange = (sIdx: number, field: string, value: any) => {
    const updated = [...pageSections];
    updated[sIdx][field] = value;
    setPageSections(updated);
  };

  const handleAddSectionBullet = (sIdx: number) => {
    const updated = [...pageSections];
    if (!updated[sIdx].list) updated[sIdx].list = [];
    updated[sIdx].list.push('');
    setPageSections(updated);
  };

  const handleRemoveSectionBullet = (sIdx: number, bIdx: number) => {
    const updated = [...pageSections];
    updated[sIdx].list = updated[sIdx].list.filter((_: any, i: number) => i !== bIdx);
    setPageSections(updated);
  };

  const handleSectionBulletChange = (sIdx: number, bIdx: number, val: string) => {
    const updated = [...pageSections];
    updated[sIdx].list[bIdx] = val;
    setPageSections(updated);
  };

  // PDF FILES ATTACHMENT HANDLERS
  const processUploadedFiles = (files: FileList) => {
    const pdfs = Array.from(files).filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (pdfs.length === 0) {
      alert('נא להעלות קבצי PDF בלבד!');
      return;
    }

    pdfs.forEach(file => {
      // Check size (warn if > 2MB because of localStorage space)
      if (file.size > 2 * 1024 * 1024) {
        if (!confirm(`קובץ ה-PDF "${file.name}" שוקל יותר מ-2MB. שמירת קבצים כה גדולים בדפדפן עשויה להכשיל את הפעולה (מגבלות זיכרון מקומי). האם להמשיך?`)) {
          return;
        }
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        if (!url) return;

        // format size
        let formattedSize = '';
        if (file.size < 1024) {
          formattedSize = `${file.size} B`;
        } else if (file.size < 1024 * 1024) {
          formattedSize = `${(file.size / 1024).toFixed(1)} KB`;
        } else {
          formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
        }

        const newPdfObj = {
          name: file.name.replace(/\.pdf$/i, ''),
          url,
          size: formattedSize
        };

        setPagePdfFiles(prev => [...prev, newPdfObj]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFiles(e.target.files);
    }
  };

  const handlePdfRemove = (index: number) => {
    setPagePdfFiles(pagePdfFiles.filter((_, i) => i !== index));
  };

  const handlePdfDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPdf(true);
  };

  const handlePdfDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPdf(false);
  };

  const handlePdfDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPdf(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  // RAW JSON LIVE VALIDATOR
  const handleCodeChange = (val: string) => {
    setRawJsonStr(val);
    try {
      const parsed = JSON.parse(val);
      // Basic type validation
      if (typeof parsed !== 'object' || parsed === null) {
        setJsonError('ה-JSON חייב להיות אובייקט חוקי {}');
        return;
      }
      if (!parsed.title || typeof parsed.title !== 'string') {
        setJsonError('התוכנית חייבת להכיל שדה כותרת (title) מסוג מחרוזת');
        return;
      }
      if (!parsed.category || typeof parsed.category !== 'string') {
        setJsonError('התוכנית חייבת להכיל שדה קטגוריה (category) מסוג מחרוזת');
        return;
      }
      if (parsed.content && !Array.isArray(parsed.content)) {
        setJsonError('השדה תוכן (content) חייב להיות מערך של פסקאות [string]');
        return;
      }
      
      setJsonError(null);
    } catch (e: any) {
      setJsonError(`שגיאת קוד JSON: ${e.message}`);
    }
  };

  // SAVE ACTION
  const handleSavePage = () => {
    setSaveSuccess(null);
    let targetKey = isCreatingNewPage ? newPageKey : selectedPageKey;
    if (!targetKey) {
      setPageSaveError('שגיאה: לא נבחר דף או כתובת URL חוקית');
      setTimeout(() => setPageSaveError(null), 4000);
      return;
    }

    // Clean up key
    targetKey = targetKey.replace(/^\/+|\/+$/g, "").trim();
    if (!targetKey) {
      setPageSaveError('נא להזין כתובת URL חוקית לדף');
      setTimeout(() => setPageSaveError(null), 4000);
      return;
    }

    let finalPageObj: InternalPage;

    if (editMode === 'code') {
      try {
        finalPageObj = JSON.parse(rawJsonStr);
      } catch (e: any) {
        setPageSaveError('לא ניתן לשמור: קוד ה-JSON אינו תקין. תקן את השגיאות המוצגות באדום.');
        setTimeout(() => setPageSaveError(null), 5000);
        return;
      }
    } else {
      // Visual mode assembly
      if (!pageTitle.trim()) {
        setPageSaveError('נא להזין כותרת לדף');
        setTimeout(() => setPageSaveError(null), 4000);
        return;
      }
      finalPageObj = {
        title: pageTitle.trim(),
        category: pageCategory.trim(),
        subtitle: pageSubtitle.trim() || undefined,
        icon: pageIcon.trim() || undefined,
        audience: (pageAudience as any) || 'כללי',
        showInMenu: pageShowInMenu,
        date: (isCreatingNewPage ? new Date().toISOString().split('T')[0] : (allPagesMap[targetKey]?.date || new Date().toISOString().split('T')[0])),
        content: pageContent.map(p => p.trim()).filter(Boolean),
        sections: pageSections.map(sec => ({
          title: sec.title.trim(),
          text: sec.text ? (typeof sec.text === 'string' ? sec.text.trim() : sec.text) : undefined,
          list: sec.list ? sec.list.map((li: string) => li.trim()).filter(Boolean) : undefined
        })).filter(sec => sec.title),
        pdfFiles: pagePdfFiles.length > 0 ? pagePdfFiles : undefined
      };
    }

    // Clear error
    setPageSaveError(null);

    // Save
    saveInternalPageOverride(targetKey, finalPageObj);
    
    // Refresh lists
    refreshPagesMap();
    
    // Keep the current page selected and active in the editor
    setSelectedPageKey(targetKey);
    setIsCreatingNewPage(false);

    // Sync active editor inputs with final saved object
    setPageTitle(finalPageObj.title);
    setPageCategory(finalPageObj.category);
    setPageSubtitle(finalPageObj.subtitle || '');
    setPageIcon(finalPageObj.icon || 'BookOpen');
    setPageAudience(finalPageObj.audience || 'כללי');
    setPageShowInMenu(!!finalPageObj.showInMenu);
    setPageContent(finalPageObj.content && finalPageObj.content.length > 0 ? [...finalPageObj.content] : ['']);
    setPageSections(finalPageObj.sections ? JSON.parse(JSON.stringify(finalPageObj.sections)) : []);
    setPagePdfFiles(finalPageObj.pdfFiles ? JSON.parse(JSON.stringify(finalPageObj.pdfFiles)) : []);
    setRawJsonStr(JSON.stringify(finalPageObj, null, 2));

    // Feedback
    setSaveSuccess(`הדף "${finalPageObj.title}" נשמר וסונכרן בהצלחה!`);

    setTimeout(() => setSaveSuccess(null), 4000);
  };

  // RESET PAGE TO DEFAULT
  const handleResetToDefault = () => {
    if (!selectedPageKey) return;
    if (!INTERNAL_PAGES[selectedPageKey]) {
      alert('דף זה נוצר מאפס, אין לו גרסת ברירת מחדל.');
      return;
    }

    askConfirmation(
      'איפוס דף למקור',
      'האם אתה בטוח שברצונך לאפס דף זה לגרסתו המקורית? כל השינויים שביצעת יימחקו.',
      () => {
        deleteInternalPageOverride(selectedPageKey);
        setSaveSuccess('הדף שוחזר לגרסת ברירת המחדל המקורית בהצלחה.');
        handleSelectPage(selectedPageKey);
        setTimeout(() => setSaveSuccess(null), 4000);
      },
      'כן, שחזר למקור'
    );
  };

  // DELETE PAGE PERMANENTLY
  const handleDeletePage = (keyToDeleteParam?: string) => {
    const keyToDelete = keyToDeleteParam || selectedPageKey;
    if (!keyToDelete) return;
    const pageObj = allPagesMap[keyToDelete];
    const pageTitleStr = pageObj ? pageObj.title : keyToDelete;

    askConfirmation(
      'אישור מחיקת דף',
      `האם אתה בטוח שברצונך למחוק את הדף "${pageTitleStr}"?\nפעולה זו תסיר את הדף מהאתר.`,
      () => {
        deleteInternalPagePermanently(keyToDelete);
        setSaveSuccess(`הדף "${pageTitleStr}" נמחק בהצלחה.`);
        refreshPagesMap();
        if (selectedPageKey === keyToDelete) {
          setSelectedPageKey('');
          setIsCreatingNewPage(false);
        }
        setTimeout(() => setSaveSuccess(null), 4000);
      },
      'כן, מחק דף זה'
    );
  };

  // QUICK LINKS MANAGEMENT HANDLERS
  const handleStartAddQuickLink = () => {
    setEditingQuickLinkId(null);
    setQuickLinkTitle('');
    setQuickLinkUrl('');
    setQuickLinkCategory('מערכות למידה');
    setQuickLinkAudience('כללי');
    setQuickLinkIcon('ExternalLink');
    setQuickLinkBadge('');
    setQuickLinkShowInMenu(true);
  };

  const handleEditQuickLink = (link: QuickLink) => {
    setEditingQuickLinkId(link.id);
    setQuickLinkTitle(link.title);
    setQuickLinkUrl(link.url);
    setQuickLinkCategory(link.category || 'מערכות למידה');
    setQuickLinkAudience(link.audience || 'כללי');
    setQuickLinkIcon(link.iconName || 'ExternalLink');
    setQuickLinkBadge(link.badge || '');
    setQuickLinkShowInMenu(link.showInMenu !== false);
  };

  const handleSaveQuickLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLinkTitle.trim() || !quickLinkUrl.trim()) {
      alert('נא למלא כותרת וקישור תקינים');
      return;
    }
    const newLink: QuickLink = {
      id: editingQuickLinkId || 'ql-' + Date.now(),
      title: quickLinkTitle.trim(),
      url: quickLinkUrl.trim(),
      category: quickLinkCategory,
      audience: quickLinkAudience as any,
      iconName: quickLinkIcon || 'ExternalLink',
      badge: quickLinkBadge.trim() || undefined,
      showInMenu: quickLinkShowInMenu
    };
    saveQuickLink(newLink);
    refreshQuickLinks();
    handleStartAddQuickLink();
    setSaveSuccess(`הקישור המהיר "${newLink.title}" נשמר בהצלחה!`);
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  const handleDeleteQuickLinkAction = (id: string, title: string) => {
    askConfirmation(
      'אישור מחיקת קישור מהיר',
      `האם אתה בטוח שברצונך למחוק את הקישור המהיר "${title}"?`,
      () => {
        deleteQuickLink(id);
        if (editingQuickLinkId === id) {
          handleStartAddQuickLink();
        }
        refreshQuickLinks();
        setSaveSuccess(`הקישור המהיר "${title}" הוסר בהצלחה`);
        setTimeout(() => setSaveSuccess(null), 3500);
      },
      'כן, מחק קישור'
    );
  };

  // NEWS UPDATES METHODS
  const handleStartEditNews = (idx: number) => {
    setEditingNewsIdx(idx);
    const art = newsArticles[idx];
    setNewsTitle(art.title);
    setNewsContent(art.content || '');
    setNewsImage(art.imageUrl);
    setNewsUrl(art.url || '');
  };

  const handleStartCreateNews = () => {
    setEditingNewsIdx(-1); // -1 means creating new news
    setNewsTitle('');
    setNewsContent('');
    setNewsImage('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80');
    setNewsUrl('');
  };

  const handleSaveNews = () => {
    if (!newsTitle.trim() || !newsContent.trim()) {
      alert('נא למלא כותרת ותוכן עבור העדכון');
      return;
    }

    let updatedNews = [...newsArticles];
    const item: NewsArticle = {
      title: newsTitle.trim(),
      content: newsContent.trim(),
      imageUrl: newsImage.trim() || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
      url: newsUrl.trim() || undefined
    };

    if (editingNewsIdx === -1) {
      // Create new
      updatedNews = [item, ...updatedNews];
    } else if (editingNewsIdx !== null) {
      // Update existing
      updatedNews[editingNewsIdx] = item;
    }

    setNewsArticles(updatedNews);
    localStorage.setItem('arens_cms_news', JSON.stringify(updatedNews));
    const newsDoc: any = {
      ...item,
      id: editingNewsIdx === -1 ? 'news-' + Date.now() : (newsArticles[editingNewsIdx]?.id || 'news-' + Date.now()),
      date: new Date().toLocaleDateString('he-IL'),
      category: 'כללי',
      author: 'הנהלת ביה"ס'
    };
    saveNewsArticle(newsDoc);
    
    // Dispatch synchronization event so Home page news list updates immediately too!
    window.dispatchEvent(new Event('internal_pages_updated'));
    
    setEditingNewsIdx(null);
    setSaveSuccess('העדכון נשמר וסונכרן בדף הבית בהצלחה.');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleDeleteNews = (idx: number) => {
    const art = newsArticles[idx];
    const title = art ? art.title : 'עדכון זה';
    askConfirmation(
      'אישור מחיקת עדכון',
      `האם אתה בטוח שברצונך למחוק את העדכון "${title}" מדף הבית?`,
      () => {
        const updated = newsArticles.filter((_, i) => i !== idx);
        setNewsArticles(updated);
        localStorage.setItem('arens_cms_news', JSON.stringify(updated));
        window.dispatchEvent(new Event('internal_pages_updated'));
        setSaveSuccess('העדכון נמחק בהצלחה.');
        setTimeout(() => setSaveSuccess(null), 3000);
      },
      'כן, מחק עדכון'
    );
  };

  const handleResetNewsToDefault = () => {
    askConfirmation(
      'איפוס עדכונים למקור',
      'האם אתה בטוח שברצונך לשחזר את רשימת העדכונים המקורית? כל השינויים שביצעת יימחקו.',
      () => {
        localStorage.removeItem('arens_cms_news');
        setNewsArticles(schoolNewsArticles);
        window.dispatchEvent(new Event('internal_pages_updated'));
        setSaveSuccess('רשימת העדכונים שוחזרה לברירת המחדל.');
        setTimeout(() => setSaveSuccess(null), 3000);
      },
      'כן, שחזר למקור'
    );
  };

  // Staff CRUD functions
  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffFormError(null);
    if (!staffName.trim() || !staffRole.trim()) {
      setStaffFormError('נא למלא שם מלא ותפקיד.');
      return;
    }

    let updatedStaff = [...staffMembers];
    const member: StaffMember = {
      id: editingStaffId === 'new' ? 'staff-' + Date.now() : (editingStaffId || 'staff-' + Date.now()),
      name: staffName.trim(),
      role: staffRole.trim(),
      roleDescription: staffRoleDescription.trim(),
      email: staffEmail.trim() || undefined,
      bio: staffBio.trim(),
      imageUrl: staffImageUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      isManagement: staffIsManagement
    };

    if (editingStaffId === 'new') {
      updatedStaff = [member, ...updatedStaff];
    } else if (editingStaffId) {
      updatedStaff = updatedStaff.map(s => s.id === editingStaffId ? member : s);
    }

    setStaffMembers(updatedStaff);
    saveStaffMember(member);
    
    // Dispatch synchronization event so Home page staff list updates immediately too!
    window.dispatchEvent(new Event('internal_pages_updated'));
    
    setEditingStaffId(null);
    setSaveSuccess('איש/ת הצוות נשמר/ה בהצלחה במערכת.');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleDeleteStaff = (id: string) => {
    const updated = staffMembers.filter(s => s.id !== id);
    setStaffMembers(updated);
    deleteStaffMember(id);
    window.dispatchEvent(new Event('internal_pages_updated'));
    setDeleteConfirmId(null);
    setSaveSuccess('איש/ת הצוות נמחק/ה מהמערכת.');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleResetStaffToDefault = () => {
    setStaffMembers(defaultStaffMembers);
    resetStaffToDefaults();
    window.dispatchEvent(new Event('internal_pages_updated'));
    setShowResetStaffConfirm(false);
    setSaveSuccess('רשימת אנשי הצוות שוחזרה לברירת המחדל (136 מורים).');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleMoveStaffUp = (id: string) => {
    const index = staffMembers.findIndex(s => s.id === id);
    if (index <= 0) return;
    const updated = [...staffMembers];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setStaffMembers(updated);
    localStorage.setItem('arens_cms_staff', JSON.stringify(updated));
    window.dispatchEvent(new Event('internal_pages_updated'));
  };

  const handleMoveStaffDown = (id: string) => {
    const index = staffMembers.findIndex(s => s.id === id);
    if (index < 0 || index >= staffMembers.length - 1) return;
    const updated = [...staffMembers];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setStaffMembers(updated);
    localStorage.setItem('arens_cms_staff', JSON.stringify(updated));
    window.dispatchEvent(new Event('internal_pages_updated'));
  };

  const handleSaveSocials = (e: React.FormEvent) => {
    e.preventDefault();
    const socialsObj = {
      facebook: socialFacebook.trim(),
      instagram: socialInstagram.trim(),
      youtube: socialYoutube.trim()
    };
    localStorage.setItem('arens_cms_socials', JSON.stringify(socialsObj));
    saveSetting('socials', socialsObj);
    window.dispatchEvent(new Event('internal_pages_updated'));
    setSaveSuccess('הקישורים לרשתות החברתיות נשמרו בהצלחה!');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleStaffPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1500000) { // Limit size to ~1.5MB for localStorage safety
        alert('הקובץ גדול מדי. מומלץ להעלות תמונה קלה יותר מ-1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setStaffImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStaffPhotoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingStaffPhoto(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('אנא העלה קובץ תמונה בלבד.');
        return;
      }
      if (file.size > 1500000) {
        alert('הקובץ גדול מדי. מומלץ להעלות תמונה קלה יותר מ-1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setStaffImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filters for lists
  const filteredPagesList = Object.keys(allPagesMap).filter(key => {
    const page = allPagesMap[key];
    const query = searchPageQuery.toLowerCase();
    return page.title.toLowerCase().includes(query) || 
           page.category.toLowerCase().includes(query) || 
           key.toLowerCase().includes(query);
  });

  const filteredNewsList = newsArticles.filter(art => 
    art.title.toLowerCase().includes(searchNewsQuery.toLowerCase())
  );

  const cleanActiveGrade = (isGradeCoordinator(effectiveRole) 
    ? (getGradeFromCoordinatorRole(effectiveRole) || 'ז') 
    : adminSelectedGrade).replace(/'/g, '').trim();

  const mainPageKey = GRADE_MAIN_KEYS[cleanActiveGrade] || '';

  const gradeSubPagesList = Object.keys(allPagesMap).filter((key) => {
    if (key === mainPageKey) return false;
    const page = allPagesMap[key];
    const g = getGradeForPage(key, page);
    return g === cleanActiveGrade;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-school-bg/95 backdrop-blur-md p-0 text-right font-sans">
      
      <div className="relative bg-[#0d1527] w-full h-full flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header Block */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-school-line/50 bg-[#090f1d] shrink-0">
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-school-line/80 text-school-muted hover:text-white hover:bg-white/5 transition-all"
            title="סגור פאנל"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-school-cyan animate-[spin_10s_linear_infinite]" />
            <div>
              <h2 className="text-lg font-black text-white">מערכת ניהול תוכן (CMS) • שש-שנתי משה ארנס</h2>
              <p className="text-[10px] text-school-cyan font-bold">פאנל ניהול ועריכת תוכן דינמי בזמן אמת</p>
            </div>
          </div>
        </div>

        {/* NOT LOGGED IN VIEW */}
        {!isLoggedIn ? (
          <div className="flex-grow flex items-center justify-center p-8 bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.06),transparent_65%)]">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md bg-[#101b33] border border-school-line rounded-3xl p-8 space-y-6 shadow-xl"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-school-cyan/10 rounded-full flex items-center justify-center mx-auto text-school-cyan">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-white">כניסת צוות עריכה ומנהלים</h3>
                <p className="text-xs text-school-muted">התחבר לצורך ביצוע שינויים בדפי האתר ובעדכונים שוטפים</p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-white font-bold">כתובת אימייל מורשית</label>
                  <input 
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@arens.school"
                    className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-school-cyan transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-white font-bold">סיסמת גישה</label>
                  <input 
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-school-cyan transition-colors"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full btn py-3 rounded-xl font-bold bg-gradient-to-r from-school-cyan to-cyan-400 text-school-bg shadow-md hover:-translate-y-0.5 transition-all text-xs text-center"
                >
                  התחברות למערכת
                </button>
              </form>

              <div className="pt-2 border-t border-school-line/40 text-center space-y-1.5">
                <p className="text-[10px] text-school-muted">סיירת העריכה פתוחה לצוות המנהלי. כניסה מהירה:</p>
                <div className="flex justify-center gap-2">
                  <button 
                    onClick={() => { setLoginEmail('admin@arens.school'); setLoginPassword('admin123'); }}
                    className="text-[10px] bg-school-cyan/5 border border-school-cyan/20 hover:bg-school-cyan/10 text-school-cyan px-2.5 py-1 rounded-md transition-all"
                  >
                    מנהל ראשי (admin@arens.school)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* LOGGED IN CMS WORKSPACE */
          <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Controls */}
            <div className="w-full md:w-60 bg-[#090f1d] border-l border-school-line/50 p-4 flex flex-col justify-between shrink-0">
              <div className="space-y-6">
                
                {/* Active user info */}
                <div className="bg-[#121c33] border border-school-line/60 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-school-cyan/10 flex items-center justify-center text-school-cyan font-black text-xs">
                      {currentUser?.name[0]}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-extrabold text-white truncate max-w-[130px]">{currentUser?.name}</p>
                      <p className="text-[9px] text-school-cyan font-semibold">{currentUser?.role}</p>
                    </div>
                  </div>
                  <div className="text-[9px] text-school-muted truncate">{currentUser?.email}</div>

                  {/* Super Admin Impersonation Dropdown */}
                  {currentUser && isSuperAdmin(currentUser.role) && (
                    <div className="pt-2 border-t border-school-line/40 space-y-1">
                      <label className="text-[9px] text-school-muted font-bold block">סימולציית תפקיד (תצוגת רכז):</label>
                      <select
                        value={impersonatedRole || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setImpersonatedRole(val ? val : null);
                        }}
                        className="w-full bg-school-bg border border-school-line/60 rounded-lg py-1 px-1.5 text-[10px] text-white focus:outline-none focus:border-school-cyan cursor-pointer"
                      >
                        <option value="">מנהל ראשי (תצוגה רגילה)</option>
                        <optgroup label="רכזי שכבות">
                          <option value="רכז שכבה ז'">רכז שכבה ז'</option>
                          <option value="רכז שכבה ח'">רכז שכבה ח'</option>
                          <option value="רכז שכבה ט'">רכז שכבה ט'</option>
                          <option value="רכז שכבה י'">רכז שכבה י'</option>
                          <option value="רכז שכבה יא'">רכז שכבה יא'</option>
                          <option value="רכז שכבה יב'">רכז שכבה יב'</option>
                        </optgroup>
                        <optgroup label="רכזי 11 המגמות">
                          <option value="רכז מגמת דאטה אנליסט">רכז מגמת דאטה אנליסט</option>
                          <option value="רכז מגמת תיאטרון ומחזות זמר">רכז מגמת תיאטרון ומחזות זמר</option>
                          <option value="רכז מגמת פיזיקה">רכז מגמת פיזיקה</option>
                          <option value="רכז מגמת סייבר גיאוגרפיה">רכז מגמת סייבר גיאוגרפיה</option>
                          <option value="רכז מגמת מנהל וכלכלה">רכז מגמת מנהל וכלכלה</option>
                          <option value="רכז מגמת ערבית">רכז מגמת ערבית</option>
                          <option value="רכז מגמת מדעי החברה">רכז מגמת מדעי החברה</option>
                          <option value="רכז מגמת כימיה">רכז מגמת כימיה</option>
                          <option value="רכז מגמת הנדסת תוכנה">רכז מגמת הנדסת תוכנה</option>
                          <option value="רכז מגמת חנ&quot;ג">רכז מגמת חנ"ג</option>
                          <option value="רכז מגמת ביולוגיה">רכז מגמת ביולוגיה</option>
                        </optgroup>
                      </select>
                    </div>
                  )}
                </div>

                {/* Tab selector buttons */}
                <div className="space-y-1.5">
                  {isGradeCoordinator(effectiveRole) ? (
                    <button 
                      onClick={() => { setActiveTab('my-grade'); }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'my-grade' 
                          ? 'bg-school-cyan/15 text-white border border-school-cyan/30' 
                          : 'text-school-muted hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-school-cyan" />
                        <span>ניהול השכבה שלי ({getGradeFromCoordinatorRole(effectiveRole)})</span>
                      </span>
                    </button>
                  ) : isMajorCoordinator(effectiveRole) ? (
                    <button 
                      onClick={() => { setActiveTab('majors'); }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'majors' 
                          ? 'bg-school-cyan/15 text-white border border-school-cyan/30' 
                          : 'text-school-muted hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>ניהול המגמה שלי ({effectiveRole.replace('רכז מגמת ', '').replace('רכז/ת מגמת ', '')})</span>
                      </span>
                    </button>
                  ) : (
                    <>
                      {/* Homepage Hero & Content Tab */}
                      <button 
                        onClick={() => { setActiveTab('homepage'); setEditingNewsIdx(null); }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          activeTab === 'homepage' 
                            ? 'bg-school-cyan/15 text-white border border-school-cyan/30' 
                            : 'text-school-muted hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-school-cyan" />
                          <span>עריכת תוכן דף הבית</span>
                        </span>
                        <span className="text-[9px] bg-school-cyan/20 text-school-cyan px-2 py-0.5 rounded-full font-bold">
                          ראשי
                        </span>
                      </button>

                      <button 
                        onClick={() => { setActiveTab('pages'); setEditingNewsIdx(null); }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          activeTab === 'pages' 
                            ? 'bg-school-cyan/15 text-white border border-school-cyan/30' 
                            : 'text-school-muted hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-school-cyan" />
                          <span>ניהול ועדכון דפים</span>
                        </span>
                        <span className="text-[9px] bg-school-bg px-2 py-0.5 rounded-full border border-school-line text-school-muted font-bold font-mono">
                          {Object.keys(allPagesMap).length}
                        </span>
                      </button>

                      {/* Quick Links Management Tab */}
                      <button 
                        onClick={() => { setActiveTab('quick-links'); handleStartAddQuickLink(); }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          activeTab === 'quick-links' 
                            ? 'bg-school-cyan/15 text-white border border-school-cyan/30' 
                            : 'text-school-muted hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Compass className="w-4 h-4 text-amber-400" />
                          <span>ניהול קישורים מהירים</span>
                        </span>
                        <span className="text-[9px] bg-school-bg px-2 py-0.5 rounded-full border border-school-line text-school-muted font-bold font-mono">
                          {quickLinksList.length}
                        </span>
                      </button>

                      {/* Grade Layers Tab for Admins/Super Admins */}
                      <button 
                        onClick={() => { setActiveTab('my-grade'); }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          activeTab === 'my-grade' 
                            ? 'bg-school-cyan/15 text-white border border-school-cyan/30' 
                            : 'text-school-muted hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-cyan-400" />
                          <span>ניהול ועריכת שכבות</span>
                        </span>
                        <span className="text-[9px] bg-school-bg px-2 py-0.5 rounded-full border border-school-line text-school-muted font-bold font-mono">
                          6
                        </span>
                      </button>

                      {/* School Majors & Tracks Tab */}
                      <button 
                        onClick={() => { setActiveTab('majors'); }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          activeTab === 'majors' 
                            ? 'bg-school-cyan/15 text-white border border-school-cyan/30' 
                            : 'text-school-muted hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-amber-400" />
                          <span>מגמות ומסלולי לימוד</span>
                        </span>
                        <span className="text-[9px] bg-school-bg px-2 py-0.5 rounded-full border border-school-line text-amber-300 font-bold font-mono">
                          חט״ב + תיכון
                        </span>
                      </button>

                      <button 
                        onClick={() => { setActiveTab('news'); setEditingNewsIdx(null); }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          activeTab === 'news' 
                            ? 'bg-school-cyan/15 text-white border border-school-cyan/30' 
                            : 'text-school-muted hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <PlusCircle className="w-4 h-4 text-school-violet" />
                          <span>עדכונים מהשטח (בית ספר)</span>
                        </span>
                        <span className="text-[9px] bg-school-bg px-2 py-0.5 rounded-full border border-school-line text-school-muted font-bold font-mono">
                          {newsArticles.length}
                        </span>
                      </button>

                      <button 
                        onClick={() => { setActiveTab('editors'); setEditingNewsIdx(null); }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          activeTab === 'editors' 
                            ? 'bg-school-cyan/15 text-white border border-school-cyan/30' 
                            : 'text-school-muted hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-cyan-400" />
                          <span>צוות עורכים מורשים</span>
                        </span>
                        <span className="text-[9px] bg-school-bg px-2 py-0.5 rounded-full border border-school-line text-school-muted font-bold font-mono">
                          {editors.length}
                        </span>
                      </button>

                      <button 
                        onClick={() => { setActiveTab('theme'); setEditingNewsIdx(null); }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          activeTab === 'theme' 
                            ? 'bg-school-cyan/15 text-white border border-school-cyan/30' 
                            : 'text-school-muted hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Palette className="w-4 h-4 text-emerald-400" />
                          <span>עיצוב ותמות האתר</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 select-none">
                          🔮 AI
                        </span>
                      </button>

                      <button 
                        onClick={() => { setActiveTab('staff'); setEditingStaffId(null); }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          activeTab === 'staff' 
                            ? 'bg-school-cyan/15 text-white border border-school-cyan/30' 
                            : 'text-school-muted hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-amber-400" />
                          <span>סגל ואנשי צוות</span>
                        </span>
                        <span className="text-[9px] bg-school-bg px-2 py-0.5 rounded-full border border-school-line text-school-muted font-bold font-mono">
                          {staffMembers.length}
                        </span>
                      </button>

                      <button 
                        onClick={() => { setActiveTab('socials'); setEditingStaffId(null); }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          activeTab === 'socials' 
                            ? 'bg-school-cyan/15 text-white border border-school-cyan/30' 
                            : 'text-school-muted hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-pink-400" />
                          <span>רשתות חברתיות</span>
                        </span>
                        <span className="text-[9px] bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/20 font-bold font-mono">
                          3
                        </span>
                      </button>

                      <button 
                        onClick={() => { setActiveTab('teachers-events'); }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          activeTab === 'teachers-events' 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                            : 'text-school-muted hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                          <span>אירועים וסדנאות מורים</span>
                        </span>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                          Google Sync
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Log out */}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>התנתקות מפאנל המנהל</span>
              </button>
            </div>

            {/* CMS Workspace Content Area */}
            <div className="flex-grow overflow-y-auto p-6 bg-[#0a101f] relative">
              
              {/* SAVE SUCCESS NOTIFICATION */}
              <AnimatePresence>
                {saveSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="absolute top-4 left-6 right-6 z-20 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between shadow-lg text-emerald-400 text-xs"
                  >
                    <div className="flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span>{saveSuccess}</span>
                    </div>
                    <button onClick={() => setSaveSuccess(null)} className="hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 0. HOMEPAGE HERO & TITLES EDITING WORKSPACE */}
              {activeTab === 'homepage' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  
                  {/* Header Box */}
                  <div className="bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-school-cyan/10 border border-school-cyan/30 text-school-cyan">
                          <Home className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-white">עריכת כותרות ותכני דף הבית (הירו)</h3>
                          <p className="text-xs text-school-muted">עדכן את הכותרות הראשיות, כדורי הערכים והתיאור הראשי המוצגים בראש דף הבית בזמן אמת</p>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleResetHomepageSettings}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                        title="שחזר כותרות לברירת המחדל"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>איפוס לברירת מחדל</span>
                      </button>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSaveHomepageSettings} className="space-y-6">
                    
                    {/* Hero Titles Block */}
                    <div className="bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-5">
                      <h4 className="text-sm font-extrabold text-school-cyan flex items-center gap-2 border-b border-school-line/50 pb-3">
                        <Sparkles className="w-4 h-4 text-school-cyan" />
                        <span>כותרות מודגשות וסלוגן ראשי (Hero Section)</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        {/* Subtitle Badge */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white block">
                            תת-כותרת (תגית עליונה בולטת)
                          </label>
                          <input
                            type="text"
                            required
                            value={hpSubtitle}
                            onChange={(e) => setHpSubtitle(e.target.value)}
                            placeholder='לדוגמה: שש שנתי ע"ש משה ארנס'
                            className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-school-cyan font-bold"
                          />
                          <p className="text-[10px] text-school-muted">מופיע בתוך תגית מעוגלת בולטת בראש דף הבית</p>
                        </div>

                        {/* Main Headline */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white block">
                            כותרת ענקית ראשית (אפקט הקלדה)
                          </label>
                          <input
                            type="text"
                            required
                            value={hpTitle}
                            onChange={(e) => setHpTitle(e.target.value)}
                            placeholder="לדוגמה: ארנס מצמיח אדם וחברה"
                            className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-school-cyan font-bold"
                          />
                          <p className="text-[10px] text-school-muted">הכותרת הראשית הגדולה שנכתבת באפקט הקלדה דינמי</p>
                        </div>

                      </div>

                      {/* Hero Paragraph / Description */}
                      <div className="space-y-2 pt-2">
                        <label className="text-xs font-bold text-white block">
                          פסקה / תיאור קצר תחת הכותרת
                        </label>
                        <textarea
                          rows={3}
                          value={hpDescription}
                          onChange={(e) => setHpDescription(e.target.value)}
                          placeholder="תיאור קצר שמזמין את התלמידים וההורים לגלוש באתר..."
                          className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-school-cyan leading-relaxed resize-none"
                        />
                      </div>
                    </div>

                    {/* Value Orbs / Floating Balls Block */}
                    <div className="bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-5">
                      <h4 className="text-sm font-extrabold text-school-cyan flex items-center gap-2 border-b border-school-line/50 pb-3">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        <span>טקסט כדורי הערכים המרחפים (3 עיגולים אינטראקטיביים)</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        <div className="space-y-2 bg-[#080d19] p-3.5 rounded-xl border border-school-line/40">
                          <label className="text-xs font-bold text-school-cyan block flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 block" />
                            <span>עיגול ערך #1</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={hpBall1}
                            onChange={(e) => setHpBall1(e.target.value)}
                            placeholder="לדוגמה: לומד עצמאי"
                            className="w-full bg-[#101b33] border border-school-line/60 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-school-cyan font-bold"
                          />
                        </div>

                        <div className="space-y-2 bg-[#080d19] p-3.5 rounded-xl border border-school-line/40">
                          <label className="text-xs font-bold text-school-violet block flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 block" />
                            <span>עיגול ערך #2</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={hpBall2}
                            onChange={(e) => setHpBall2(e.target.value)}
                            placeholder="לדוגמה: מרחבי למידה"
                            className="w-full bg-[#101b33] border border-school-line/60 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-school-cyan font-bold"
                          />
                        </div>

                        <div className="space-y-2 bg-[#080d19] p-3.5 rounded-xl border border-school-line/40">
                          <label className="text-xs font-bold text-emerald-400 block flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 block" />
                            <span>עיגול ערך #3</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={hpBall3}
                            onChange={(e) => setHpBall3(e.target.value)}
                            placeholder="לדוגמה: דיאלוג"
                            className="w-full bg-[#101b33] border border-school-line/60 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-school-cyan font-bold"
                          />
                        </div>

                      </div>
                    </div>

                    {/* Action Buttons Labels Block */}
                    <div className="bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-5">
                      <h4 className="text-sm font-extrabold text-school-cyan flex items-center gap-2 border-b border-school-line/50 pb-3">
                        <Link className="w-4 h-4 text-amber-400" />
                        <span>כפתורי הנעה לפעולה בדף הבית</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white block">
                            טקסט כפתור ראשי (גלילה לשכבות)
                          </label>
                          <input
                            type="text"
                            required
                            value={hpPrimaryBtn}
                            onChange={(e) => setHpPrimaryBtn(e.target.value)}
                            placeholder="לדוגמה: כניסה לשכבות"
                            className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-school-cyan font-bold"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white block">
                            טקסט כפתור משני (מבזקים/עדכונים)
                          </label>
                          <input
                            type="text"
                            required
                            value={hpSecondaryBtn}
                            onChange={(e) => setHpSecondaryBtn(e.target.value)}
                            placeholder="לדוגמה: מה מתרחש אצלנו?"
                            className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-school-cyan font-bold"
                          />
                        </div>

                      </div>
                    </div>

                    {/* Live Preview Card */}
                    <div className="bg-[#080d19] border border-school-cyan/30 rounded-2xl p-6 space-y-4 shadow-xl">
                      <p className="text-[10px] text-school-cyan font-black tracking-widest uppercase">תצוגה מקדימה חיה של כותרת דף הבית</p>
                      
                      <div className="space-y-3 pr-2 border-r-2 border-school-cyan">
                        <div className="inline-flex items-center gap-2 text-xs font-bold text-school-cyan bg-school-cyan/10 border border-school-cyan/30 px-3 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-school-cyan animate-pulse" />
                          <span>{hpSubtitle}</span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black text-white">
                          <span className="bg-gradient-to-r from-white via-school-cyan to-school-violet bg-clip-text text-transparent">
                            {hpTitle}
                          </span>
                        </h2>

                        <p className="text-xs text-school-muted max-w-xl leading-relaxed">
                          {hpDescription}
                        </p>

                        <div className="flex gap-2 pt-1 text-[11px]">
                          <span className="bg-school-cyan text-slate-900 font-bold px-3 py-1 rounded-lg">{hpPrimaryBtn}</span>
                          <span className="bg-white/10 text-white font-bold px-3 py-1 rounded-lg">{hpSecondaryBtn}</span>
                        </div>
                      </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="submit"
                        className="btn px-8 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-school-cyan to-cyan-400 text-school-bg shadow-[0_4px_20px_rgba(34,211,238,0.3)] hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>שמור שינויים בדף הבית</span>
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* 1. PAGES EDITING WORKSPACE */}
              {activeTab === 'pages' && (
                <div className="space-y-6">
                  
                  {/* Select or create layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Pages directory select list */}
                    <div className="lg:col-span-4 bg-[#101b33] border border-school-line rounded-2xl p-4 space-y-4">
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-school-cyan uppercase">קטלוג דפים</span>
                        <button 
                          onClick={handleStartCreateNewPage}
                          className="flex items-center gap-1.5 bg-school-cyan/10 border border-school-cyan/20 hover:bg-school-cyan/25 text-school-cyan text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          <FilePlus className="w-3.5 h-3.5" />
                          <span>דף חדש מאפס</span>
                        </button>
                      </div>

                      <div className="relative">
                        <input 
                          type="text"
                          value={searchPageQuery}
                          onChange={(e) => setSearchPageQuery(e.target.value)}
                          placeholder="סינון מהיר של דפים..."
                          className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 pr-8 pl-3 text-[11px] text-white focus:outline-none focus:border-school-cyan"
                        />
                        <Search className="w-3.5 h-3.5 text-school-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      <div className="space-y-1 max-h-[68vh] overflow-y-auto pr-1">
                        {filteredPagesList.map((key) => {
                          const page = allPagesMap[key];
                          const isSelected = selectedPageKey === key && !isCreatingNewPage;
                          return (
                            <div
                              key={key}
                              className={`w-full text-right p-2.5 rounded-xl text-xs border transition-all flex items-center justify-between group ${
                                isSelected 
                                  ? 'bg-school-cyan/15 border-school-cyan text-white font-bold' 
                                  : 'bg-[#080d19]/40 border-school-line/40 text-school-muted hover:text-white hover:border-school-line'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => handleSelectPage(key)}
                                className="flex-grow text-right truncate pl-2 flex items-center justify-between cursor-pointer"
                              >
                                <div className="truncate space-y-0.5">
                                  <p className="truncate flex items-center gap-1.5">
                                    <span>{page.title}</span>
                                    {page.showInMenu && (
                                      <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold shrink-0">
                                        בתפריט
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-[9px] text-school-muted truncate font-mono">{key}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0 px-2">
                                  <span className="text-[9px] px-2 py-0.5 rounded bg-[#13223e] border border-school-line text-school-cyan font-bold">
                                    {page.category}
                                  </span>
                                  {page.audience && (
                                    <span className="text-[8px] text-purple-300 font-semibold">
                                      {page.audience}
                                    </span>
                                  )}
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePage(key);
                                }}
                                className="p-1.5 text-school-muted hover:text-red-400 hover:bg-red-500/15 rounded-lg transition-colors shrink-0 cursor-pointer"
                                title="מחיקת דף זה"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Editor form */}
                    <div className="lg:col-span-8 space-y-6">
                      
                      {selectedPageKey || isCreatingNewPage ? (
                        <div className="bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-6">
                          
                          {/* Page general title or path */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-school-line/60 pb-4">
                            <div>
                              <span className="text-[10px] text-school-cyan font-bold uppercase tracking-wider">
                                {isCreatingNewPage ? 'יצירת דף חדש לחלוטין' : 'עריכת דף קיים'}
                              </span>
                              <h3 className="text-base font-extrabold text-white">
                                {isCreatingNewPage ? 'דף עצמאי חדש' : pageTitle}
                              </h3>
                              <p className="text-[10px] text-school-muted font-mono mt-1">
                                URL/מפתח: {isCreatingNewPage ? newPageKey : selectedPageKey}
                              </p>
                            </div>

                            {/* Mode toggle (Visual vs Code) */}
                            <div className="flex items-center gap-1.5 bg-[#080d19] border border-school-line/60 p-1 rounded-xl shrink-0">
                              <button
                                onClick={() => setEditMode('visual')}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                  editMode === 'visual' 
                                    ? 'bg-school-cyan text-school-bg shadow' 
                                    : 'text-school-muted hover:text-white'
                                }`}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>עריכה רגילה</span>
                              </button>
                              <button
                                onClick={() => setEditMode('code')}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                  editMode === 'code' 
                                    ? 'bg-school-cyan text-school-bg shadow' 
                                    : 'text-school-muted hover:text-white'
                                }`}
                              >
                                <Code className="w-3.5 h-3.5" />
                                <span>עריכת קוד JSON</span>
                              </button>
                            </div>
                          </div>

                          {/* --- EDIT MODE 1: CODE JSON --- */}
                          {editMode === 'code' && (
                            <div className="space-y-4">
                              <div className="bg-school-bg/80 border border-school-line/80 rounded-xl p-4 text-xs space-y-2">
                                <h4 className="font-bold text-white flex items-center gap-1.5 text-[11px]">
                                  <Code className="w-4 h-4 text-school-cyan" />
                                  <span>עריכה גולמית ישירה של קובץ התוכן</span>
                                </h4>
                                <p className="text-[10px] text-school-muted leading-relaxed">
                                  הזן אובייקט JSON תקני התואם לממשק הדף הפנימי. המערכת תבצע וולידציה אוטומטית למניעת שגיאות.
                                </p>
                              </div>

                              {jsonError && (
                                <div className="p-3 bg-red-500/10 border border-red-500/35 text-red-400 rounded-xl text-xs font-mono">
                                  {jsonError}
                                </div>
                              )}

                              <div className="relative">
                                <textarea
                                  value={rawJsonStr}
                                  onChange={(e) => handleCodeChange(e.target.value)}
                                  rows={18}
                                  className="w-full bg-[#080d19] border border-school-line/60 rounded-xl p-4 text-xs font-mono text-cyan-400 focus:outline-none focus:border-school-cyan leading-relaxed text-left"
                                  dir="ltr"
                                />
                              </div>
                            </div>
                          )}

                          {/* --- EDIT MODE 2: VISUAL FORM --- */}
                          {editMode === 'visual' && (
                            <div className="space-y-6">
                              
                              {/* Url path input if creating */}
                              {isCreatingNewPage && (
                                <div className="bg-school-cyan/5 border border-school-cyan/20 p-4 rounded-xl space-y-2">
                                  <label className="text-xs text-white font-bold block">כתובת ה-URL / מפתח הדף (בלעז/באנגלית) *</label>
                                  <input 
                                    type="text"
                                    required
                                    value={newPageKey}
                                    onChange={(e) => setNewPageKey(e.target.value)}
                                    placeholder="course/about/my-new-page"
                                    className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-school-cyan text-left font-mono"
                                    dir="ltr"
                                  />
                                  <p className="text-[9px] text-school-muted">מפתח ייחודי זה יקבע את הכתובת של הדף החדש, למשל: course/custom-page-name</p>
                                </div>
                              )}

                              {/* Core meta params */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-xs text-white font-bold">כותרת הדף *</label>
                                  <input 
                                    type="text"
                                    required
                                    value={pageTitle}
                                    onChange={(e) => setPageTitle(e.target.value)}
                                    placeholder="הזן כותרת"
                                    className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-school-cyan"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-xs text-white font-bold">קטגוריית תוכן / פרק</label>
                                  <select 
                                    value={pageCategory}
                                    onChange={(e) => setPageCategory(e.target.value)}
                                    className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-school-cyan"
                                  >
                                    <option value="אודותינו">אודותינו (דבר המנהלת, חזון וכדומה)</option>
                                    <option value="חט&quot;ב">חטיבת ביניים (שכבות ז-ט, מסלולים)</option>
                                    <option value="חט&quot;ע">חטיבה עליונה (שכבות י-יב, מגמות)</option>
                                    <option value="עדכוני בית הספר">עדכוני בית הספר וחדשות</option>
                                    <option value="מידע כללי">מידע כללי וטפסים</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-xs text-white font-bold">תת-כותרת (פרוזה / תקציר)</label>
                                  <input 
                                    type="text"
                                    value={pageSubtitle}
                                    onChange={(e) => setPageSubtitle(e.target.value)}
                                    placeholder="הזן משפט הסבר קצר"
                                    className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-school-cyan"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-xs text-white font-bold">אייקון מוביל לדף</label>
                                  <select 
                                    value={pageIcon}
                                    onChange={(e) => setPageIcon(e.target.value)}
                                    className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-school-cyan font-mono"
                                  >
                                    <option value="BookOpen">ספר פתוח (BookOpen)</option>
                                    <option value="Award">מצוינות / גביע (Award)</option>
                                    <option value="Users">קהילה / תלמידים (Users)</option>
                                    <option value="Rocket">טכנולוגיה / חדשנות (Rocket)</option>
                                    <option value="GraduationCap">אקדמיה / כובע (GraduationCap)</option>
                                    <option value="Compass">דרך / מסע (Compass)</option>
                                    <option value="Calendar">לוח שנה (Calendar)</option>
                                    <option value="FileText">מסמך / טפסים (FileText)</option>
                                  </select>
                                </div>
                              </div>

                              {/* Target Audience & Navigation Menu Toggle */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#080d19]/80 border border-school-line/60 p-4 rounded-2xl">
                                <div className="space-y-2">
                                  <label className="text-xs text-school-cyan font-extrabold flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5" />
                                    <span>קהל יעד (הצג במרחבי התוכן)</span>
                                  </label>
                                  <div className="bg-[#0c1426] border border-school-line/60 rounded-xl p-2.5 space-y-2">
                                    <div className="flex flex-wrap items-center gap-3">
                                      <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer select-none hover:text-school-cyan transition-colors">
                                        <input
                                          type="checkbox"
                                          checked={parseAudience(pageAudience).students}
                                          onChange={(e) => {
                                            const current = parseAudience(pageAudience);
                                            const next = { ...current, students: e.target.checked };
                                            setPageAudience(formatAudience(next));
                                          }}
                                          className="w-4 h-4 rounded text-school-cyan bg-[#080d19] border-school-line focus:ring-school-cyan cursor-pointer"
                                        />
                                        <span>לתלמידים</span>
                                      </label>

                                      <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer select-none hover:text-school-cyan transition-colors">
                                        <input
                                          type="checkbox"
                                          checked={parseAudience(pageAudience).parents}
                                          onChange={(e) => {
                                            const current = parseAudience(pageAudience);
                                            const next = { ...current, parents: e.target.checked };
                                            setPageAudience(formatAudience(next));
                                          }}
                                          className="w-4 h-4 rounded text-school-cyan bg-[#080d19] border-school-line focus:ring-school-cyan cursor-pointer"
                                        />
                                        <span>להורים</span>
                                      </label>

                                      <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer select-none hover:text-school-cyan transition-colors">
                                        <input
                                          type="checkbox"
                                          checked={parseAudience(pageAudience).teachers}
                                          onChange={(e) => {
                                            const current = parseAudience(pageAudience);
                                            const next = { ...current, teachers: e.target.checked };
                                            setPageAudience(formatAudience(next));
                                          }}
                                          className="w-4 h-4 rounded text-school-cyan bg-[#080d19] border-school-line focus:ring-school-cyan cursor-pointer"
                                        />
                                        <span>למורים</span>
                                      </label>
                                    </div>
                                    <div className="text-[10px] text-school-cyan/90 font-medium pt-1 border-t border-school-line/30 flex items-center gap-1">
                                      <span>נבחר:</span>
                                      <span className="font-bold text-white">{pageAudience || 'כללי'}</span>
                                    </div>
                                  </div>
                                  <p className="text-[9px] text-school-muted">
                                    סמן ב-V את קהלי היעד (ניתן לבחור 2 מתוך 3 או כל שילוב רצוי).
                                  </p>
                                </div>

                                <div className="flex flex-col justify-center space-y-2">
                                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                    <input 
                                      type="checkbox"
                                      checked={pageShowInMenu}
                                      onChange={(e) => setPageShowInMenu(e.target.checked)}
                                      className="w-4 h-4 rounded text-school-cyan bg-[#0c1426] border-school-line focus:ring-school-cyan cursor-pointer"
                                    />
                                    <span className="text-xs font-black text-white">הכלל תוכן זה בתפריט הניווט הראשי</span>
                                  </label>
                                  <p className="text-[9px] text-school-muted leading-snug">
                                    כאשר מסומן, קישור ישיר לדף זה יופיע אוטומטית בתפריט העליון תחת הקטגוריה המתאימה.
                                  </p>
                                </div>
                              </div>

                              {/* Content paragraph sections */}
                              <div className="space-y-3.5 border-t border-school-line/40 pt-5">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-xs font-bold text-white">פסקאות התוכן העיקריות של הדף ({pageContent.length})</h4>
                                  <button 
                                    type="button"
                                    onClick={handleAddParagraph}
                                    className="flex items-center gap-1 text-[10px] text-school-cyan font-extrabold hover:underline"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>הוסף פסקה</span>
                                  </button>
                                </div>

                                <div className="space-y-2.5">
                                  {pageContent.map((paragraph, pIdx) => (
                                    <div key={pIdx} className="flex gap-2 items-start">
                                      <textarea 
                                        value={paragraph}
                                        onChange={(e) => handleParagraphChange(pIdx, e.target.value)}
                                        placeholder={`הזן פסקה מספר ${pIdx + 1}`}
                                        rows={2}
                                        className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-school-cyan leading-relaxed"
                                      />
                                      <button
                                        type="button"
                                        disabled={pageContent.length <= 1}
                                        onClick={() => handleRemoveParagraph(pIdx)}
                                        className="p-2 text-school-muted hover:text-red-400 disabled:opacity-30 transition-all border border-school-line/50 rounded-xl hover:bg-white/5"
                                        title="מחק פסקה"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* EXTRA SUB SECTIONS */}
                              <div className="space-y-4 border-t border-school-line/40 pt-5">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-xs font-bold text-white">סעיפי מידע מורחבים / תיבות תוכן ({pageSections.length})</h4>
                                  <button 
                                    type="button"
                                    onClick={handleAddSection}
                                    className="flex items-center gap-1 text-[10px] text-school-cyan font-extrabold hover:underline"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>הוסף סעיף מורחב</span>
                                  </button>
                                </div>

                                {pageSections.length === 0 ? (
                                  <div className="text-center py-6 border border-dashed border-school-line/40 rounded-xl text-[10px] text-school-muted">
                                    אין סעיפי תיבות מורחבים מוגדרים עבור דף זה. לחץ למעלה להוספה.
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    {pageSections.map((sec, sIdx) => (
                                      <div key={sIdx} className="bg-[#0c1426] border border-school-line/50 rounded-xl p-4 space-y-3">
                                        <div className="flex items-center justify-between border-b border-school-line/30 pb-2">
                                          <span className="text-[10px] text-school-cyan font-extrabold">סעיף מספר {sIdx + 1}</span>
                                          <button 
                                            onClick={() => handleRemoveSection(sIdx)}
                                            className="text-[9px] text-red-400 font-extrabold hover:underline flex items-center gap-1"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                            <span>הסר סעיף זה</span>
                                          </button>
                                        </div>

                                        <div className="space-y-2">
                                          <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white block">כותרת סעיף</label>
                                            <input 
                                              type="text"
                                              value={sec.title}
                                              onChange={(e) => handleSectionFieldChange(sIdx, 'title', e.target.value)}
                                              placeholder="למשל: סגל הוראה, תכנית שנתית, קישורי עזר"
                                              className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none focus:border-school-cyan"
                                            />
                                          </div>

                                          <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white block">תיאור קצר או תוכן הסעיף</label>
                                            <textarea 
                                              value={sec.text || ''}
                                              onChange={(e) => handleSectionFieldChange(sIdx, 'text', e.target.value)}
                                              placeholder="הזן פסקת הסבר קצרה המופיעה בתוך הסעיף"
                                              rows={2}
                                              className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none focus:border-school-cyan"
                                            />
                                          </div>

                                          {/* Bullets inside section */}
                                          <div className="space-y-2 pt-2 border-t border-school-line/20">
                                            <div className="flex items-center justify-between">
                                              <span className="text-[10px] text-school-muted font-bold">רשימת נקודות (bullets) בסעיף</span>
                                              <button 
                                                type="button"
                                                onClick={() => handleAddSectionBullet(sIdx)}
                                                className="text-[9px] text-school-cyan hover:underline"
                                              >
                                                + הוסף נקודה
                                              </button>
                                            </div>

                                            <div className="space-y-1.5">
                                              {sec.list && sec.list.map((bullet: string, bIdx: number) => (
                                                <div key={bIdx} className="flex gap-1.5 items-center">
                                                  <input 
                                                    type="text"
                                                    value={bullet}
                                                    onChange={(e) => handleSectionBulletChange(sIdx, bIdx, e.target.value)}
                                                    placeholder="הקלד משפט נקודה..."
                                                    className="w-full bg-[#080d19] border border-school-line/40 rounded-lg py-1 px-2.5 text-xs text-white focus:outline-none focus:border-school-cyan"
                                                  />
                                                  <button 
                                                    onClick={() => handleRemoveSectionBullet(sIdx, bIdx)}
                                                    className="p-1 text-school-muted hover:text-red-400"
                                                    title="הסר נקודה"
                                                  >
                                                    <X className="w-3 h-3" />
                                                  </button>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* PDF FILES ATTACHMENTS SECTION */}
                              <div className="space-y-4 border-t border-school-line/40 pt-5">
                                <div className="space-y-1">
                                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                                    <Paperclip className="w-4 h-4 text-school-cyan" />
                                    <span>קבצי PDF מצורפים לעמוד ({pagePdfFiles.length})</span>
                                  </h4>
                                  <p className="text-[10px] text-school-muted leading-relaxed">
                                    גרור והשלך קבצי PDF או לחץ על התיבה להעלאת מסמכים, חוברות, דפי עבודה או הנחיות לעמוד זה.
                                  </p>
                                </div>

                                {/* Drag and drop zone */}
                                <div
                                  onDragOver={handlePdfDragOver}
                                  onDragLeave={handlePdfDragLeave}
                                  onDrop={handlePdfDrop}
                                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                                    isDraggingPdf
                                      ? 'border-school-cyan bg-school-cyan/5 text-school-cyan scale-[1.01]'
                                      : 'border-school-line/60 bg-[#080d19]/40 hover:border-school-cyan/40 hover:bg-[#080d19]/60'
                                  }`}
                                >
                                  <input
                                    type="file"
                                    id="pdf-upload-input"
                                    accept=".pdf"
                                    multiple
                                    onChange={handlePdfFileChange}
                                    className="hidden"
                                  />
                                  <label
                                    htmlFor="pdf-upload-input"
                                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                                  >
                                    <div className="w-12 h-12 bg-school-cyan/10 rounded-full flex items-center justify-center text-school-cyan mb-1">
                                      <UploadCloud className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-extrabold text-white">גרור והשלך קובץ PDF לכאן או לחץ לבחירה</span>
                                    <span className="text-[9px] text-school-muted">קבצים מסוג PDF בלבד, מומלץ עד 2MB</span>
                                  </label>
                                </div>

                                {/* Uploaded list */}
                                {pagePdfFiles.length > 0 && (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    {pagePdfFiles.map((pdf, index) => (
                                      <div
                                        key={index}
                                        className="bg-[#0c1426] border border-school-line/60 rounded-xl p-3 flex items-center justify-between gap-3 shadow-sm"
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
                                            <FileText className="w-4.5 h-4.5" />
                                          </div>
                                          <div className="text-right min-w-0">
                                            <input
                                              type="text"
                                              value={pdf.name}
                                              onChange={(e) => {
                                                const updated = [...pagePdfFiles];
                                                updated[index].name = e.target.value;
                                                setPagePdfFiles(updated);
                                              }}
                                              className="text-xs font-bold text-white bg-transparent border-b border-transparent hover:border-school-cyan/40 focus:border-school-cyan focus:outline-none min-w-0 w-full"
                                              title="לחץ לעריכת שם הקובץ"
                                              placeholder="שם הקובץ"
                                            />
                                            {pdf.size && <span className="text-[9px] text-school-muted">{pdf.size}</span>}
                                          </div>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => handlePdfRemove(index)}
                                          className="p-1.5 text-school-muted hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors"
                                          title="הסר קובץ"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                            </div>
                          )}

                          {/* Save feedback & error banners */}
                          {pageSaveError && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2 mb-3 animate-pulse">
                              <AlertCircle className="w-4 h-4 shrink-0" />
                              <span>{pageSaveError}</span>
                            </div>
                          )}

                          {saveSuccess && (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2 mb-3">
                              <CheckCircle className="w-4 h-4 shrink-0" />
                              <span>{saveSuccess}</span>
                            </div>
                          )}

                          {/* Save & Reset buttons */}
                          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-school-line/60 pt-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={handleSavePage}
                                disabled={editMode === 'code' && !!jsonError}
                                className="inline-flex items-center gap-2 btn px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-school-cyan to-cyan-400 text-school-bg shadow hover:-translate-y-0.5 disabled:opacity-40 transition-all text-xs"
                              >
                                <Save className="w-4 h-4" />
                                <span>שמור שינויים וסנכרן</span>
                              </button>

                              {!isCreatingNewPage && INTERNAL_PAGES[selectedPageKey] && (
                                <button
                                  type="button"
                                  onClick={handleResetToDefault}
                                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border border-school-line bg-school-panel hover:text-school-cyan transition-colors"
                                  title="איפוס לגרסת המקור"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>שחזר למקור</span>
                                </button>
                              )}

                              {!isCreatingNewPage && selectedPageKey && (
                                <button
                                  type="button"
                                  onClick={() => handleDeletePage()}
                                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                  title="מחיקת דף זה לצמיתות"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>מחק דף זה</span>
                                </button>
                              )}
                            </div>

                            {/* View Live action */}
                            {!isCreatingNewPage && onNavigateToPage && (
                              <button
                                onClick={() => {
                                  onNavigateToPage(selectedPageKey);
                                  onClose();
                                }}
                                className="inline-flex items-center gap-1.5 text-xs text-school-cyan font-bold hover:underline"
                              >
                                <span>צפה בדף חי באתר</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                        </div>
                      ) : (
                        <div className="bg-[#101b33] border border-school-line rounded-2xl p-12 text-center space-y-4">
                          <div className="w-16 h-16 bg-school-cyan/10 rounded-full flex items-center justify-center mx-auto text-school-cyan">
                            <FileText className="w-8 h-8" />
                          </div>
                          <h3 className="text-xl font-extrabold text-white">לא נבחר דף לעריכה</h3>
                          <p className="text-xs text-school-muted max-w-md mx-auto leading-relaxed">
                            בחר דף קיים מרשימת הקטלוג מימין לעריכה ויזואלית מלאה או עריכת קוד JSON גולמי, או לחץ על כפתור "דף חדש מאפס" כדי להקים דף עצמאי באתר.
                          </p>
                          <div className="flex justify-center gap-4 pt-2">
                            <button 
                              onClick={handleStartCreateNewPage}
                              className="btn px-5 py-2.5 rounded-xl font-bold bg-school-cyan text-school-bg text-xs shadow hover:-translate-y-0.5 transition-all"
                            >
                              יצירת דף חדש ראשון
                            </button>
                          </div>
                        </div>
                      )}

                    </div>

                  </div>

                </div>
              )}

              {/* QUICK LINKS MANAGEMENT WORKSPACE */}
              {activeTab === 'quick-links' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101b33] border border-school-line p-6 rounded-2xl">
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                        מערכת ניהול קישורים מהירים
                      </span>
                      <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                        <Compass className="w-6 h-6 text-amber-400" />
                        <span>קישורים מהירים ומערכות בית הספר</span>
                      </h3>
                      <p className="text-xs text-school-muted mt-1 leading-relaxed">
                        נהל את הקישורים השימושיים המופיעים בתפריט הראשי ובפורטלים הפנימיים לתלמידים, להורים ולמורים.
                      </p>
                    </div>

                    <button
                      onClick={handleStartAddQuickLink}
                      className="px-4 py-2.5 rounded-xl font-bold bg-amber-400 text-slate-950 text-xs shadow hover:bg-amber-300 transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>הוסף קישור מהיר חדש</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* List of Quick Links */}
                    <div className="lg:col-span-7 space-y-3">
                      <h4 className="text-sm font-extrabold text-white flex items-center justify-between">
                        <span>רשימת קישורים מהירים קיימים ({quickLinksList.length})</span>
                      </h4>

                      <div className="space-y-2.5">
                        {quickLinksList.map((link) => (
                          <div
                            key={link.id}
                            className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                              editingQuickLinkId === link.id
                                ? 'bg-amber-400/10 border-amber-400 text-white'
                                : 'bg-[#101b33] border-school-line/60 hover:border-school-line text-slate-200'
                            }`}
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-white truncate">{link.title}</span>
                                {link.badge && (
                                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
                                    {link.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-school-muted truncate dir-ltr text-right font-mono">
                                {link.url}
                              </p>
                              <div className="flex flex-wrap gap-2 text-[9px] pt-1">
                                <span className="px-2 py-0.5 rounded bg-school-bg border border-school-line text-school-cyan font-bold">
                                  {link.category || 'מערכות למידה'}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-school-bg border border-school-line text-purple-300 font-bold">
                                  {link.audience || 'כללי'}
                                </span>
                                {link.showInMenu !== false && (
                                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                                    מוצג בתפריט
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleEditQuickLink(link)}
                                className="p-2 text-school-cyan hover:bg-school-cyan/10 rounded-xl transition-colors border border-school-line"
                                title="ערוך קישור זה"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteQuickLinkAction(link.id, link.title)}
                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-school-line"
                                title="מחק קישור"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Link Editor Form */}
                    <div className="lg:col-span-5">
                      <form onSubmit={handleSaveQuickLinkSubmit} className="bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-4 sticky top-6">
                        <div className="border-b border-school-line/60 pb-3 flex items-center justify-between">
                          <h4 className="text-sm font-extrabold text-white">
                            {editingQuickLinkId ? 'עריכת קישור מהיר' : 'הוספת קישור מהיר חדש'}
                          </h4>
                          {editingQuickLinkId && (
                            <button
                              type="button"
                              onClick={handleStartAddQuickLink}
                              className="text-[10px] text-amber-400 font-bold hover:underline"
                            >
                              + הוסף חדש במקום
                            </button>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-white font-bold">כותרת הקישור *</label>
                          <input
                            type="text"
                            required
                            value={quickLinkTitle}
                            onChange={(e) => setQuickLinkTitle(e.target.value)}
                            placeholder="למשל: מערכת משוב, Google Classroom"
                            className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-white font-bold">כתובת URL / קישור *</label>
                          <input
                            type="text"
                            required
                            value={quickLinkUrl}
                            onChange={(e) => setQuickLinkUrl(e.target.value)}
                            placeholder="https://... או course/my-page"
                            className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400 dir-ltr"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs text-white font-bold">קטגוריה</label>
                            <select
                              value={quickLinkCategory}
                              onChange={(e) => setQuickLinkCategory(e.target.value)}
                              className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400"
                            >
                              <option value="מערכות למידה">מערכות למידה</option>
                              <option value="שירותים">שירותים וטפסים</option>
                              <option value="משרד החינוך">משרד החינוך</option>
                              <option value="כללי">כללי</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs text-white font-bold flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-amber-400" />
                              <span>קהל יעד</span>
                            </label>
                            <div className="bg-[#080d19] border border-school-line/60 rounded-xl p-2.5 space-y-2">
                              <div className="flex flex-wrap items-center gap-3">
                                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer select-none hover:text-amber-400 transition-colors">
                                  <input
                                    type="checkbox"
                                    checked={parseAudience(quickLinkAudience).students}
                                    onChange={(e) => {
                                      const current = parseAudience(quickLinkAudience);
                                      const next = { ...current, students: e.target.checked };
                                      setQuickLinkAudience(formatAudience(next));
                                    }}
                                    className="w-4 h-4 rounded text-amber-400 bg-[#0c1426] border-school-line focus:ring-amber-400 cursor-pointer"
                                  />
                                  <span>תלמידים</span>
                                </label>

                                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer select-none hover:text-amber-400 transition-colors">
                                  <input
                                    type="checkbox"
                                    checked={parseAudience(quickLinkAudience).parents}
                                    onChange={(e) => {
                                      const current = parseAudience(quickLinkAudience);
                                      const next = { ...current, parents: e.target.checked };
                                      setQuickLinkAudience(formatAudience(next));
                                    }}
                                    className="w-4 h-4 rounded text-amber-400 bg-[#0c1426] border-school-line focus:ring-amber-400 cursor-pointer"
                                  />
                                  <span>הורים</span>
                                </label>

                                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer select-none hover:text-amber-400 transition-colors">
                                  <input
                                    type="checkbox"
                                    checked={parseAudience(quickLinkAudience).teachers}
                                    onChange={(e) => {
                                      const current = parseAudience(quickLinkAudience);
                                      const next = { ...current, teachers: e.target.checked };
                                      setQuickLinkAudience(formatAudience(next));
                                    }}
                                    className="w-4 h-4 rounded text-amber-400 bg-[#0c1426] border-school-line focus:ring-amber-400 cursor-pointer"
                                  />
                                  <span>מורים</span>
                                </label>
                              </div>
                              <div className="text-[10px] text-amber-300/90 font-medium pt-1 border-t border-school-line/30 flex items-center gap-1">
                                <span>נבחר:</span>
                                <span className="font-bold text-white">{quickLinkAudience || 'כללי'}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs text-white font-bold">תגית מודגשת (Badge)</label>
                            <input
                              type="text"
                              value={quickLinkBadge}
                              onChange={(e) => setQuickLinkBadge(e.target.value)}
                              placeholder="למשל: חובה, חדש"
                              className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs text-white font-bold">אייקון</label>
                            <select
                              value={quickLinkIcon}
                              onChange={(e) => setQuickLinkIcon(e.target.value)}
                              className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                            >
                              <option value="ExternalLink">קישור חיצוני (ExternalLink)</option>
                              <option value="UserCheck">משוב / משתמש (UserCheck)</option>
                              <option value="GraduationCap">פורטל / אקדמיה (GraduationCap)</option>
                              <option value="Compass">אופק / מצפן (Compass)</option>
                              <option value="Chrome">כרום / קלאסרום (Chrome)</option>
                              <option value="BookOpen">ספרייה / כותר (BookOpen)</option>
                              <option value="CreditCard">תשלומים (CreditCard)</option>
                            </select>
                          </div>
                        </div>

                        <div className="pt-2">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={quickLinkShowInMenu}
                              onChange={(e) => setQuickLinkShowInMenu(e.target.checked)}
                              className="w-4 h-4 rounded text-amber-400 bg-[#080d19] border-school-line focus:ring-amber-400 cursor-pointer"
                            />
                            <span className="text-xs font-bold text-white">הצג בתפריט קישורים מהירים</span>
                          </label>
                        </div>

                        <div className="pt-3 border-t border-school-line/40 flex items-center justify-end gap-3">
                          {editingQuickLinkId && (
                            <button
                              type="button"
                              onClick={handleStartAddQuickLink}
                              className="px-4 py-2 rounded-xl text-xs font-bold border border-school-line text-school-muted hover:text-white"
                            >
                              ביטול
                            </button>
                          )}
                          <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl font-bold bg-amber-400 text-slate-950 text-xs shadow hover:bg-amber-300 transition-all flex items-center gap-1.5"
                          >
                            <Save className="w-4 h-4" />
                            <span>שמור קישור מהיר</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* 1.5. GRADE LAYER MANAGEMENT WORKSPACE (ניהול ועריכת שכבות) */}
              {activeTab === 'my-grade' && (
                <div className="space-y-6">
                  
                  {/* Grade Layer Header & Switcher */}
                  <div className="bg-[#101b33] border border-school-line rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-school-line/40 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-school-cyan/15 border border-school-cyan/30 flex items-center justify-center text-school-cyan">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                            <span>ניהול ועריכת שכבות לימוד</span>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-school-cyan/15 border border-school-cyan/30 text-school-cyan">
                              שכבה {cleanActiveGrade}
                            </span>
                          </h2>
                          <p className="text-xs text-school-muted">
                            {isGradeCoordinator(effectiveRole) 
                              ? `אזור ניהול ייעודי עבור רכז שכבה ${cleanActiveGrade}`
                              : 'בחר שכבה מהרשימה כדי לערוך את דף הבית השכבתי, כיתות הלימוד ודפי המשנה'
                            }
                          </p>
                        </div>
                      </div>

                      {/* View Page Preview Button */}
                      {mainPageKey && (
                        <button
                          onClick={() => {
                            window.location.hash = mainPageKey;
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-school-line hover:border-school-cyan text-xs font-bold text-school-cyan transition-colors self-start md:self-auto cursor-pointer"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>תצוגה מקדימה באתר</span>
                        </button>
                      )}
                    </div>

                    {/* Admin Grade Switcher Tabs (If not locked to coordinator) */}
                    {!isGradeCoordinator(effectiveRole) && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-school-muted block">בחירת שכבת גיל לעריכה:</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                            {[
                              { id: 'ז', label: "שכבת ז'", sub: 'חט"ב' },
                              { id: 'ח', label: "שכבת ח'", sub: 'חט"ב' },
                              { id: 'ט', label: "שכבת ט'", sub: 'חט"ב' },
                              { id: 'י', label: "שכבת י'", sub: 'חט"ע' },
                              { id: 'יא', label: "שכבת יא'", sub: 'חט"ע' },
                              { id: 'יב', label: "שכבת יב'", sub: 'חט"ע' }
                            ].map((g) => {
                              const isActive = cleanActiveGrade === g.id;
                              return (
                                <button
                                  key={g.id}
                                  onClick={() => {
                                    setAdminSelectedGrade(g.id);
                                    setIsEditingSubPage(false);
                                    setIsCreatingSubPage(false);
                                  }}
                                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                                    isActive
                                      ? 'bg-gradient-to-r from-school-cyan/25 to-school-violet/25 border-school-cyan text-white font-black shadow-md'
                                      : 'bg-[#080d19]/60 border-school-line/50 text-school-muted hover:text-white hover:border-school-line'
                                  }`}
                                >
                                  <p className="text-xs font-black">{g.label}</p>
                                  <p className={`text-[9px] font-bold ${isActive ? 'text-school-cyan' : 'text-school-muted/70'}`}>{g.sub}</p>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Super Admin Quick Invitation Widget for current grade */}
                        {isSuperAdmin(effectiveRole) && (
                          <div className="bg-[#080d19]/80 border border-school-cyan/30 rounded-xl p-4 space-y-3 mt-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                                <UserPlus className="w-4 h-4 text-school-cyan" />
                                <span>זימון ומינוי רכז/ת ייעודי/ת לשכבת {cleanActiveGrade}</span>
                              </h4>
                              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-school-cyan/20 text-school-cyan font-bold">הרשאה לשכבה בלבד</span>
                            </div>

                            <form onSubmit={handleQuickInviteCoordinator} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                              <div className="md:col-span-4">
                                <label className="text-[10px] text-school-muted block mb-1">שם רכז/ת השכבה *</label>
                                <input
                                  type="text"
                                  required
                                  value={coordInviteName}
                                  onChange={(e) => setCoordInviteName(e.target.value)}
                                  placeholder={`למשל: רכז/ת שכבת ${cleanActiveGrade}`}
                                  className="w-full bg-[#101b33] border border-school-line/60 rounded-lg py-1.5 px-2.5 text-xs text-white focus:outline-none"
                                />
                              </div>

                              <div className="md:col-span-5">
                                <label className="text-[10px] text-school-muted block mb-1">אימייל להזמנה *</label>
                                <input
                                  type="email"
                                  required
                                  value={coordInviteEmail}
                                  onChange={(e) => setCoordInviteEmail(e.target.value)}
                                  placeholder="coordinator@arens.school"
                                  className="w-full bg-[#101b33] border border-school-line/60 rounded-lg py-1.5 px-2.5 text-xs text-white focus:outline-none text-left"
                                  dir="ltr"
                                />
                              </div>

                              <div className="md:col-span-3">
                                <button
                                  type="submit"
                                  className="w-full py-2 px-3 rounded-lg bg-school-cyan hover:bg-cyan-300 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <UserPlus className="w-3.5 h-3.5" />
                                  <span>צור קישור הזמנה לרכז</span>
                                </button>
                              </div>
                            </form>

                            {coordInviteLink && (
                              <div className="p-3 bg-school-cyan/10 border border-school-cyan/40 rounded-lg space-y-2">
                                <div className="flex items-center justify-between">
                                  <p className="text-[11px] font-bold text-school-cyan">
                                    קישור הזימון עבור רכז/ת שכבה {cleanActiveGrade} נוצר בהצלחה!
                                  </p>
                                  <button onClick={() => setCoordInviteLink(null)} className="text-school-muted hover:text-white">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    readOnly
                                    value={coordInviteLink}
                                    className="w-full bg-[#080d19] border border-school-line rounded py-1 px-2 text-[10px] text-school-cyan font-mono text-left"
                                    dir="ltr"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(coordInviteLink);
                                      alert('קישור ההזמנה הועתק ללוח!');
                                    }}
                                    className="px-3 py-1 bg-school-cyan text-slate-950 font-bold rounded text-xs whitespace-nowrap cursor-pointer"
                                  >
                                    העתק קישור
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Workspace Sub-tab Switcher: Home Page vs Classes vs Subpages */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-school-line/30">
                      <button
                        onClick={() => { setGradeSubWorkspace('home'); setIsEditingSubPage(false); setIsCreatingSubPage(false); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          gradeSubWorkspace === 'home'
                            ? 'bg-school-cyan text-slate-950 font-black shadow-md'
                            : 'bg-white/5 text-school-muted hover:text-white border border-school-line/50'
                        }`}
                      >
                        <Home className="w-3.5 h-3.5" />
                        <span>דף הבית של שכבת {cleanActiveGrade}</span>
                      </button>

                      <button
                        onClick={() => { setGradeSubWorkspace('classes'); setIsEditingSubPage(false); setIsCreatingSubPage(false); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          gradeSubWorkspace === 'classes'
                            ? 'bg-school-cyan text-slate-950 font-black shadow-md'
                            : 'bg-white/5 text-school-muted hover:text-white border border-school-line/50'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>עריכה/הסרה של כיתות ומסלולים ({gradeClassesList.length})</span>
                      </button>

                      <button
                        onClick={() => setGradeSubWorkspace('subpages')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          gradeSubWorkspace === 'subpages'
                            ? 'bg-school-cyan text-slate-950 font-black shadow-md'
                            : 'bg-white/5 text-school-muted hover:text-white border border-school-line/50'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>דפי משנה נוספים ({gradeSubPagesList.length})</span>
                      </button>
                    </div>
                  </div>

                  {/* SUB-WORKSPACE 1: GRADE MAIN PAGE EDITOR */}
                  {gradeSubWorkspace === 'home' && (
                    <div className="bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-6">
                      <div className="flex items-center justify-between border-b border-school-line/40 pb-3">
                        <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-school-cyan" />
                          <span>עריכת דף הבית הראשי של שכבת {cleanActiveGrade}</span>
                        </h3>
                        <button
                          onClick={handleSaveGradeMainPage}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-school-cyan to-cyan-400 text-slate-950 font-black text-xs hover:shadow-lg transition-all cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>שמור דף בית שכבתי</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-8 space-y-5">
                          {/* Title */}
                          <div className="space-y-1.5">
                            <label className="text-xs text-white font-bold block">כותרת ראשית של השכבה *</label>
                            <input
                              type="text"
                              value={gradeMainTitle}
                              onChange={(e) => setGradeMainTitle(e.target.value)}
                              placeholder="למשל: שכבת ז' - הצעד הראשון בדרך החדשה"
                              className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-school-cyan"
                            />
                          </div>

                          {/* Subtitle */}
                          <div className="space-y-1.5">
                            <label className="text-xs text-white font-bold block">תת-כותרת / סלוגן שכבתי</label>
                            <input
                              type="text"
                              value={gradeMainSubtitle}
                              onChange={(e) => setGradeMainSubtitle(e.target.value)}
                              placeholder="למשל: ברוכים הבאים לחטיבת הביניים שש-שנתי ארנס..."
                              className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-school-cyan"
                            />
                          </div>

                          {/* Content (Paragraphs) */}
                          <div className="space-y-1.5">
                            <label className="text-xs text-white font-bold block">תוכן ראשי (כל שורת רווח מייצרת פסקה חדשה)</label>
                            <textarea
                              value={gradeMainContent}
                              onChange={(e) => setGradeMainContent(e.target.value)}
                              rows={6}
                              placeholder="כתיבת המבוא השכבתי, מטרות השכבה והברכה לתלמידים וההורים..."
                              className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-school-cyan resize-none leading-relaxed"
                            />
                          </div>

                          {/* Sections / Pillars Repeater */}
                          <div className="space-y-3 pt-3 border-t border-school-line/40">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                                  <Compass className="w-4 h-4 text-school-violet" />
                                  <span>סעיפי חזון ומידע ייחודי לשכבה ({gradeMainSections.length})</span>
                                </h4>
                                <p className="text-[10px] text-school-muted">אבני דרך, מסלולים ייחודיים או נושאים שכבתיים</p>
                              </div>
                              <button
                                type="button"
                                onClick={handleAddGradeMainSection}
                                className="flex items-center gap-1 bg-school-violet/15 border border-school-violet/30 text-school-violet hover:bg-school-violet/25 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>הוסף סעיף מידע</span>
                              </button>
                            </div>

                            {gradeMainSections.length === 0 ? (
                              <p className="text-xs text-school-muted/70 italic bg-[#080d19]/40 p-3 rounded-xl border border-school-line/30 text-center">
                                טרם הוגדרו סעיפי מידע נוספים עבור דף הבית. לחץ "הוסף סעיף מידע" כדי ליצור אחד.
                              </p>
                            ) : (
                              <div className="space-y-3">
                                {gradeMainSections.map((sec, idx) => (
                                  <div key={idx} className="bg-[#080d19] border border-school-line/60 p-4 rounded-xl space-y-3 relative">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-school-cyan">סעיף {idx + 1}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveGradeMainSection(idx)}
                                        className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1 cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>הסר</span>
                                      </button>
                                    </div>

                                    <input
                                      type="text"
                                      value={sec.title || ''}
                                      onChange={(e) => handleUpdateGradeMainSection(idx, 'title', e.target.value)}
                                      placeholder="כותרת הסעיף (למשל: מסלול מנהיגות)"
                                      className="w-full bg-[#101b33] border border-school-line/60 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-school-cyan"
                                    />

                                    <textarea
                                      value={sec.content || ''}
                                      onChange={(e) => handleUpdateGradeMainSection(idx, 'content', e.target.value)}
                                      placeholder="פירוט הסעיף..."
                                      rows={2}
                                      className="w-full bg-[#101b33] border border-school-line/60 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-school-cyan resize-none"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Attached PDF Files */}
                          <div className="space-y-3 pt-3 border-t border-school-line/40">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                                  <FileDown className="w-4 h-4 text-emerald-400" />
                                  <span>טפסים, קבצים ומסמכי PDF לשכבה ({gradeMainPdfFiles.length})</span>
                                </h4>
                                <p className="text-[10px] text-school-muted">מערכות שעות, אישורים, דפי מידע וטפסים להורדה</p>
                              </div>
                              <button
                                type="button"
                                onClick={handleAddGradeMainPdf}
                                className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>הוסף מסמך / PDF</span>
                              </button>
                            </div>

                            {gradeMainPdfFiles.length === 0 ? (
                              <p className="text-xs text-school-muted/70 italic bg-[#080d19]/40 p-3 rounded-xl border border-school-line/30 text-center">
                                אין מסמכים מצורפים בדף הבית של השכבה.
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {gradeMainPdfFiles.map((pdf, idx) => (
                                  <div key={idx} className="bg-[#080d19] border border-school-line/60 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                      <input
                                        type="text"
                                        value={pdf.name || ''}
                                        onChange={(e) => handleUpdateGradeMainPdf(idx, 'name', e.target.value)}
                                        placeholder="שם הקובץ (למשל: מערכת שעות ז'2)"
                                        className="bg-[#101b33] border border-school-line/60 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-school-cyan"
                                      />
                                      <input
                                        type="text"
                                        value={pdf.url || ''}
                                        onChange={(e) => handleUpdateGradeMainPdf(idx, 'url', e.target.value)}
                                        placeholder="כתובת / קישור לקובץ PDF (URL)"
                                        className="bg-[#101b33] border border-school-line/60 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-school-cyan dir-ltr text-left font-mono"
                                        dir="ltr"
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveGradeMainPdf(idx)}
                                      className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Quick Preview & Guidance sidebar */}
                        <div className="md:col-span-4 space-y-4">
                          <div className="bg-[#080d19] border border-school-line/60 p-4 rounded-xl space-y-3">
                            <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                              <Info className="w-4 h-4 text-school-cyan" />
                              <span>טיפים לעריכת דף השכבה</span>
                            </h4>
                            <ul className="text-[11px] text-school-muted space-y-2 list-disc list-inside leading-relaxed">
                              <li>הכותרת הראשית מופיעה בראש דף השכבה עם סגנון טיפוגרפי מודרני.</li>
                              <li>בפסקאות התוכן מומלץ לפרט על ייחודיות השכבה והצוות המוביל.</li>
                              <li>ניתן לצרף מסמכי PDF ישירים עבור מערכת שעות, הודעות הנהלה וטפסים.</li>
                              <li>כל השינויים נשמרים ישירות ב-CMS המרכזי של בית הספר.</li>
                            </ul>
                          </div>

                          <button
                            onClick={handleSaveGradeMainPage}
                            className={`w-full btn py-3 rounded-xl font-extrabold shadow-md hover:-translate-y-0.5 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer ${
                              saveSuccess?.includes('שכבת') 
                                ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400' 
                                : 'bg-gradient-to-r from-school-cyan to-cyan-400 text-slate-950'
                            }`}
                          >
                            {saveSuccess?.includes('שכבת') ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                            <span>{saveSuccess?.includes('שכבת') ? 'השינויים נשמרו בהצלחה!' : 'שמור שינויים'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Inline feedback for grade main page */}
                      {saveSuccess && (
                        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-between text-emerald-300 font-bold text-xs shadow-md">
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span>{saveSuccess}</span>
                          </div>
                          <button type="button" onClick={() => setSaveSuccess(null)} className="text-emerald-400 hover:text-white p-1 cursor-pointer">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUB-WORKSPACE 2: GRADE CLASSES & TRACKS EDITOR */}
                  {gradeSubWorkspace === 'classes' && (
                    <div className="bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-school-line/40 pb-4">
                        <div>
                          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                            <Users className="w-5 h-5 text-school-cyan" />
                            <span>ניהול, עריכה והסרה של כיתות ומסלולי שכבת {cleanActiveGrade}</span>
                          </h3>
                          <p className="text-xs text-school-muted mt-1">
                            כאן תוכלו לערוך שמות כיתות, לעדכן מסלולי לימוד או להסיר/להוסיף כיתות בשכבה. השינויים ייקלטו וישתקפו מיידית בדף השכבה הרשמי.
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleAddGradeClass}
                            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-school-line text-xs font-bold text-white transition-all cursor-pointer"
                          >
                            <Plus className="w-4 h-4 text-school-cyan" />
                            <span>הוסף כיתה / מסלול חדש</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleSaveGradeClasses}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer shadow-md ${
                              classSaveStatus 
                                ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400 scale-105' 
                                : 'bg-gradient-to-r from-school-cyan to-cyan-400 text-slate-950 hover:shadow-lg hover:scale-102'
                            }`}
                          >
                            {classSaveStatus ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Save className="w-4 h-4 shrink-0" />}
                            <span>{classSaveStatus ? 'נשמר בהצלחה!' : 'שמור כיתות ומסלולים'}</span>
                          </button>
                        </div>
                      </div>

                      {/* INLINE UPDATE NOTIFICATION BANNER */}
                      {saveSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-3.5 bg-emerald-500/20 border border-emerald-500/50 rounded-xl flex items-center justify-between text-emerald-300 font-bold text-xs shadow-md"
                        >
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span>{saveSuccess}</span>
                          </div>
                          <button type="button" onClick={() => setSaveSuccess(null)} className="text-emerald-400 hover:text-white p-1 cursor-pointer">
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}

                      {gradeClassesList.length === 0 ? (
                        <div className="p-8 text-center bg-[#080d19] rounded-xl border border-school-line/50 space-y-3">
                          <p className="text-xs text-school-muted">אין כיתות או מסלולים מוגדרים בשכבה זו כעת.</p>
                          <button
                            type="button"
                            onClick={handleAddGradeClass}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-school-cyan text-slate-950 font-bold text-xs cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>הוסף כיתה ראשונה בשכבה</span>
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {gradeClassesList.map((cls, idx) => (
                            <div key={cls.id || idx} className="bg-[#080d19] border border-school-line/70 hover:border-school-cyan/50 rounded-xl p-4 space-y-3 relative group transition-all">
                              <div className="flex items-center justify-between pb-2 border-b border-school-line/30">
                                <span className="text-xs font-black text-school-cyan">כיתה #{idx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGradeClass(idx)}
                                  className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                                  title="הסר כיתה זו"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span className="text-[10px]">הסר</span>
                                </button>
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <label className="text-[10px] text-school-muted block mb-1">שם הכיתה *</label>
                                  <input
                                    type="text"
                                    value={cls.name || ''}
                                    onChange={(e) => handleUpdateGradeClass(idx, 'name', e.target.value)}
                                    placeholder={`למשל: כיתה ${cleanActiveGrade}'1 - מדעית`}
                                    className="w-full bg-[#101b33] border border-school-line/60 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-school-cyan"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] text-school-muted block mb-1">תחום התמחות / מסלול ייחודי</label>
                                  <input
                                    type="text"
                                    value={cls.specialty || ''}
                                    onChange={(e) => handleUpdateGradeClass(idx, 'specialty', e.target.value)}
                                    placeholder="למשל: רובוטיקה, מנהיגות, אמנויות..."
                                    className="w-full bg-[#101b33] border border-school-line/60 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-school-cyan"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUB-WORKSPACE 3: GRADE SUBPAGES LIST / EDITOR */}
                  {gradeSubWorkspace === 'subpages' && (
                    <div className="space-y-6">
                      
                      {/* If user is editing or creating a subpage */}
                      {isCreatingSubPage || isEditingSubPage ? (
                        <div className="bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-5">
                          <div className="flex items-center justify-between border-b border-school-line/40 pb-3">
                            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                              <FileText className="w-4 h-4 text-school-cyan" />
                              <span>{isCreatingSubPage ? `יצירת דף משנה / כיתה חדשה לשכבת ${cleanActiveGrade}` : 'עריכת דף משנה'}</span>
                            </h3>
                            <button
                              onClick={() => { setIsEditingSubPage(false); setIsCreatingSubPage(false); }}
                              className="text-xs text-school-muted hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4 shrink-0 -scale-x-100" />
                              <span>ביטול וחזרה לרשימה</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-8 space-y-4">
                              <div className="space-y-1.5">
                                <label className="text-xs text-white font-bold block">כותרת הדף / שם הכיתה *</label>
                                <input
                                  type="text"
                                  value={subPageTitle}
                                  onChange={(e) => setSubPageTitle(e.target.value)}
                                  placeholder='למשל: כיתה ז1 - מסלול מופת, או פעילות של"ר'
                                  className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-school-cyan"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-xs text-white font-bold block">תת-כותרת / תיאור קצר</label>
                                <input
                                  type="text"
                                  value={subPageSubtitle}
                                  onChange={(e) => setSubPageSubtitle(e.target.value)}
                                  placeholder="למשל: תיאור קצר או הודעה לתלמידים"
                                  className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-school-cyan"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-xs text-white font-bold block">תוכן הדף / פירוט</label>
                                <textarea
                                  value={subPageContent}
                                  onChange={(e) => setSubPageContent(e.target.value)}
                                  rows={6}
                                  placeholder="פירוט התכנים, לוח זמנים, הודעות ומידע לתלמידים..."
                                  className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-school-cyan resize-none leading-relaxed"
                                />
                              </div>

                              {/* Subpage PDF Attachments */}
                              <div className="space-y-3 pt-3 border-t border-school-line/40">
                                <div className="flex items-center justify-between">
                                  <label className="text-xs text-white font-bold block">קבצים ומסמכים מצורפים לדף זה ({subPagePdfFiles.length})</label>
                                  <button
                                    type="button"
                                    onClick={handleAddSubPagePdf}
                                    className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 text-xs font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>הוסף מסמך</span>
                                  </button>
                                </div>

                                {subPagePdfFiles.map((pdf, idx) => (
                                  <div key={idx} className="bg-[#080d19] border border-school-line/60 p-2.5 rounded-xl flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={pdf.name || ''}
                                      onChange={(e) => handleUpdateSubPagePdf(idx, 'name', e.target.value)}
                                      placeholder="שם המסמך"
                                      className="w-1/2 bg-[#101b33] border border-school-line/60 rounded-lg py-1 px-2 text-xs text-white"
                                    />
                                    <input
                                      type="text"
                                      value={pdf.url || ''}
                                      onChange={(e) => handleUpdateSubPagePdf(idx, 'url', e.target.value)}
                                      placeholder="כתובת URL"
                                      className="w-1/2 bg-[#101b33] border border-school-line/60 rounded-lg py-1 px-2 text-xs text-white dir-ltr font-mono"
                                      dir="ltr"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSubPagePdf(idx)}
                                      className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="md:col-span-4 space-y-4">
                              <div className="bg-[#080d19] border border-school-line/60 p-4 rounded-xl space-y-2 text-xs text-school-muted">
                                <p className="font-bold text-white">נתיב URL של הדף:</p>
                                <p className="font-mono text-[10px] text-school-cyan break-all dir-ltr text-left">
                                  {subPageUrl || `course/שכבה-${cleanActiveGrade}/${(subPageTitle || 'שם-הדף').replace(/\s+/g, '-')}`}
                                </p>
                                <p className="text-[10px] pt-2">דף זה ישויך אוטומטית לקטגוריה "שכבה {cleanActiveGrade}".</p>
                              </div>

                              <div className="space-y-2">
                                <button
                                  onClick={handleSaveGradeSubPage}
                                  className="w-full btn py-2.5 rounded-xl font-extrabold bg-gradient-to-r from-school-cyan to-cyan-400 text-slate-950 text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
                                >
                                  <Save className="w-4 h-4" />
                                  <span>שמור שינויים</span>
                                </button>
                                {saveSuccess && (
                                  <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-emerald-300 font-bold text-xs">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>{saveSuccess}</span>
                                  </div>
                                )}
                                <button
                                  onClick={() => { setIsEditingSubPage(false); setIsCreatingSubPage(false); }}
                                  className="w-full btn py-2.5 rounded-xl font-bold bg-white/5 border border-school-line hover:bg-white/10 text-white text-xs cursor-pointer"
                                >
                                  חזרה לרשימת הדפים
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* SUBPAGES LIST */
                        <div className="bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-school-line/40 pb-3">
                            <div>
                              <h3 className="font-extrabold text-white text-base">
                                רשימת דפי משנה וכיתות עבור שכבת {cleanActiveGrade}
                              </h3>
                              <p className="text-xs text-school-muted">
                                נמצאו {gradeSubPagesList.length} דפים משוייכים לשכבה זו
                              </p>
                            </div>

                            <button
                              onClick={handleStartCreateGradeSubPage}
                              className="flex items-center justify-center gap-2 bg-gradient-to-r from-school-cyan to-cyan-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                            >
                              <PlusCircle className="w-4 h-4" />
                              <span>יצירת דף משנה / כיתה חדשה</span>
                            </button>
                          </div>

                          {gradeSubPagesList.length === 0 ? (
                            <div className="text-center py-12 bg-[#080d19]/50 border border-school-line/40 rounded-xl space-y-3">
                              <FileText className="w-10 h-10 text-school-muted/50 mx-auto" />
                              <p className="text-sm font-bold text-white">אין דפי משנה נוספים עבור שכבת {cleanActiveGrade}</p>
                              <p className="text-xs text-school-muted">תוכל ליצור דף חדש עבור כיתות לימוד, פעילויות שכבתיות או הודעות מיוחדות.</p>
                              <button
                                onClick={handleStartCreateGradeSubPage}
                                className="mt-2 inline-flex items-center gap-1.5 bg-school-cyan/15 border border-school-cyan/30 text-school-cyan font-bold px-4 py-2 rounded-xl text-xs hover:bg-school-cyan/25 transition-all cursor-pointer"
                              >
                                <Plus className="w-4 h-4" />
                                <span>יצירת דף משנה חדש</span>
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {gradeSubPagesList.map((key) => {
                                const page = allPagesMap[key];
                                return (
                                  <div
                                    key={key}
                                    className="bg-[#080d19] border border-school-line/60 hover:border-school-cyan/50 p-4 rounded-xl space-y-3 transition-all flex flex-col justify-between"
                                  >
                                    <div>
                                      <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-extrabold text-white text-sm line-clamp-1">{page.title}</h4>
                                        <span className="text-[9px] bg-school-cyan/10 border border-school-cyan/20 text-school-cyan px-2 py-0.5 rounded-full font-bold shrink-0">
                                          שכבה {cleanActiveGrade}
                                        </span>
                                      </div>
                                      {page.subtitle && (
                                        <p className="text-xs text-school-muted mt-1 line-clamp-1">{page.subtitle}</p>
                                      )}
                                      <p className="text-[10px] text-school-muted/70 font-mono mt-2 truncate dir-ltr text-left" dir="ltr">
                                        {key}
                                      </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-school-line/40">
                                      <button
                                        onClick={() => { window.location.hash = key; }}
                                        className="text-[11px] text-school-cyan hover:underline flex items-center gap-1 font-bold cursor-pointer"
                                      >
                                        <Globe className="w-3.5 h-3.5" />
                                        <span>צפה בדף</span>
                                      </button>

                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => handleStartEditGradeSubPage(key)}
                                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-school-cyan/10 border border-school-cyan/20 text-school-cyan hover:bg-school-cyan/25 text-xs font-bold transition-all cursor-pointer"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                          <span>עריכה</span>
                                        </button>

                                        <button
                                          onClick={() => handleDeleteGradeSubPage(key)}
                                          className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs transition-all cursor-pointer"
                                          title="מחיקת דף"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  )}

                </div>
              )}

              {/* 2. NEWS UPDATES WORKSPACE */}
              {activeTab === 'news' && (
                <div className="space-y-6">
                  
                  {editingNewsIdx !== null ? (
                    /* EDITING SINGLE NEWS ARTICLE */
                    <div className="bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-5">
                      <div className="flex items-center justify-between border-b border-school-line/40 pb-3">
                        <h3 className="font-extrabold text-white">
                          {editingNewsIdx === -1 ? 'יצירת עדכון חדש לדף הבית' : 'עריכת עדכון דף בית'}
                        </h3>
                        <button 
                          onClick={() => setEditingNewsIdx(null)}
                          className="text-xs text-school-muted hover:text-white flex items-center gap-1"
                        >
                          <ChevronLeft className="w-4 h-4 shrink-0 -scale-x-100" />
                          <span>חזרה לרשימה</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        
                        <div className="md:col-span-8 space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-xs text-white font-bold block">כותרת העדכון / אירוע *</label>
                            <input 
                              type="text"
                              value={newsTitle}
                              onChange={(e) => setNewsTitle(e.target.value)}
                              placeholder="למשל: סדנת סופר סתם, מקום ראשון לנבחרת..."
                              className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-school-cyan"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs text-white font-bold block">תוכן העדכון / פירוט *</label>
                            <textarea 
                              value={newsContent}
                              onChange={(e) => setNewsContent(e.target.value)}
                              placeholder="הזן את פרטי העדכון, המידע והתוכן בהרחבה..."
                              rows={4}
                              className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-school-cyan resize-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs text-white font-bold block">קישור למידע נוסף (כתובת URL פנימית או חיצונית - לא חובה)</label>
                            <input 
                              type="text"
                              value={newsUrl}
                              onChange={(e) => setNewsUrl(e.target.value)}
                              placeholder="למשל: course/about/news-link (או השאר ריק)"
                              className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-school-cyan text-left font-mono"
                              dir="ltr"
                            />
                            <p className="text-[9px] text-school-muted">בלחיצה על העדכון בטיקר, המשתמש יוכל לעבור לקישור זה במידה והוגדר.</p>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs text-white font-bold block">קישור חיצוני לתמונה בעדכון</label>
                            <input 
                              type="text"
                              value={newsImage}
                              onChange={(e) => setNewsImage(e.target.value)}
                              placeholder="https://images.unsplash.com/photo-..."
                              className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-school-cyan text-left font-mono"
                              dir="ltr"
                            />
                          </div>
                        </div>

                        {/* Image Preview Block */}
                        <div className="md:col-span-4 space-y-3">
                          <span className="text-xs text-white font-bold block">תצוגה מקדימה לתמונה</span>
                          <div className="aspect-[16/10] bg-school-bg rounded-xl border border-school-line/60 overflow-hidden flex items-center justify-center relative">
                            {newsImage ? (
                              <img 
                                src={newsImage} 
                                alt="תצוגה" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="text-[10px] text-school-muted text-center p-3">אין תמונה מוגדרת או הקישור שבור</div>
                            )}
                          </div>
                        </div>

                      </div>

                      <div className="flex items-center gap-3 pt-3 border-t border-school-line/40">
                        <button
                          onClick={handleSaveNews}
                          className="inline-flex items-center gap-2 btn px-6 py-2 rounded-xl font-bold bg-gradient-to-r from-school-cyan to-cyan-400 text-school-bg hover:-translate-y-0.5 transition-all text-xs"
                        >
                          <Save className="w-4 h-4" />
                          <span>שמור עדכון</span>
                        </button>
                        <button
                          onClick={() => setEditingNewsIdx(null)}
                          className="px-4 py-2 border border-school-line rounded-xl text-xs hover:bg-white/5"
                        >
                          ביטול
                        </button>
                      </div>

                    </div>
                  ) : (
                    /* LIST OF NEWS ARTICLES */
                    <div className="bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-4">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-extrabold text-white text-base">ניהול עדכוני הבאנר הראשי (טיקר עדכונים רץ)</h3>
                          <p className="text-[10px] text-school-muted">ערוך, מחק או הוסף עדכונים המופיעים בבאנר הראשי של דף הבית באותיות צבעוניות מתאימות.</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={handleStartCreateNews}
                            className="flex items-center gap-1.5 bg-school-cyan text-school-bg text-xs font-bold px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5 shadow-md"
                          >
                            <Plus className="w-4 h-4" />
                            <span>הוסף עדכון חדש</span>
                          </button>
                          
                          <button 
                            onClick={handleResetNewsToDefault}
                            className="flex items-center gap-1.5 border border-school-line text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
                            title="שחזור לרשימה המקורית"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>אפס רשימה</span>
                          </button>
                        </div>
                      </div>

                      <div className="relative max-w-md">
                        <input 
                          type="text"
                          value={searchNewsQuery}
                          onChange={(e) => setSearchNewsQuery(e.target.value)}
                          placeholder="חיפוש עדכון..."
                          className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2 pr-9 pl-3 text-xs text-white focus:outline-none"
                        />
                        <Search className="w-4 h-4 text-school-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* Updates Table/List */}
                      <div className="border border-school-line/60 rounded-xl overflow-hidden bg-[#080d19]/30">
                        <div className="grid grid-cols-12 gap-2 bg-[#090f1d] px-4 py-2.5 text-[11px] font-bold text-school-muted border-b border-school-line/50">
                          <div className="col-span-1 text-center">תמונה</div>
                          <div className="col-span-6">כותרת העדכון</div>
                          <div className="col-span-3 font-mono">קישור ניווט</div>
                          <div className="col-span-2 text-center">פעולות</div>
                        </div>

                        <div className="divide-y divide-school-line/40 max-h-[64vh] overflow-y-auto">
                          {filteredNewsList.map((art, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-2 px-4 py-3 text-xs items-center hover:bg-white/5 transition-colors">
                              
                              <div className="col-span-1 flex justify-center">
                                <div className="w-10 h-7 rounded bg-school-bg overflow-hidden border border-school-line">
                                  <img 
                                    src={art.imageUrl} 
                                    alt="" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="col-span-6 font-bold text-white line-clamp-1">{art.title}</div>
                              
                              <div className="col-span-3 text-school-cyan truncate font-mono text-[10px]" dir="ltr">{art.url}</div>

                              <div className="col-span-2 flex items-center justify-center gap-3">
                                <button
                                  onClick={() => handleStartEditNews(idx)}
                                  className="text-school-cyan hover:text-white transition-colors"
                                  title="ערוך עדכון"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteNews(idx)}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                  title="מחק עדכון"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                            </div>
                          ))}

                          {filteredNewsList.length === 0 && (
                            <div className="text-center py-10 text-xs text-school-muted">לא נמצאו עדכונים תואמים</div>
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* 5. STAFF MAINTENANCE WORKSPACE */}
              {activeTab === 'staff' && (
                <div className="space-y-6">
                  
                  {editingStaffId !== null ? (
                    /* EDITING SINGLE STAFF MEMBER */
                    <form onSubmit={handleSaveStaff} className="bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-5">
                      <div className="flex items-center justify-between border-b border-school-line/40 pb-3">
                        <h3 className="font-extrabold text-white">
                          {editingStaffId === 'new' ? 'הוספת איש/ת צוות חדש/ה' : 'עריכת פרטי איש/ת צוות'}
                        </h3>
                        <button 
                          type="button"
                          onClick={() => { setEditingStaffId(null); setStaffFormError(null); }}
                          className="text-xs text-school-muted hover:text-white flex items-center gap-1"
                        >
                          <ChevronLeft className="w-4 h-4 shrink-0 -scale-x-100" />
                          <span>חזרה לרשימה</span>
                        </button>
                      </div>

                      {staffFormError && (
                        <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-3 text-xs text-red-400 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{staffFormError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        
                        {/* Right Column: Name, Role, Bio, Management status */}
                        <div className="md:col-span-8 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs text-white font-bold block">שם מלא *</label>
                              <input 
                                type="text"
                                required
                                value={staffName}
                                onChange={(e) => setStaffName(e.target.value)}
                                placeholder="לדוגמה: יעל כהן"
                                className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-school-cyan transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs text-white font-bold block">תפקיד / מקצוע הוראה *</label>
                              <input 
                                type="text"
                                required
                                value={staffRole}
                                onChange={(e) => setStaffRole(e.target.value)}
                                placeholder="לדוגמה: מורה לפיזיקה ורכזת שכבה"
                                className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-school-cyan transition-colors"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs text-white font-bold block">
                              תיאור תפקיד מפורט (טקסטואלי)
                            </label>
                            <input 
                              type="text"
                              value={staffRoleDescription}
                              onChange={(e) => setStaffRoleDescription(e.target.value)}
                              placeholder='לדוגמה: מחנכת י&apos;2 מורה לכימיה חט"ע רכזת שכבה י&apos; ורכזת מגמה כימיה'
                              className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-school-cyan transition-colors"
                            />
                            <p className="text-[10px] text-school-muted">
                              פירוט מלא של תפקידי ההוראה, החינוך והריכוז (למשל: &quot;סגן מנהל חט&quot;נ ומחנך כתה ט4 חט&quot;נ&quot;).
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs text-white font-bold block">
                              כתובת אימייל (ליצירת קשר עם המורה)
                            </label>
                            <input 
                              type="email"
                              value={staffEmail}
                              onChange={(e) => setStaffEmail(e.target.value)}
                              placeholder="לדוגמה: teacher@arens.org.il או teacher@gmail.com"
                              className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-school-cyan transition-colors text-left dir-ltr"
                            />
                            <p className="text-[10px] text-school-muted">
                              כתובת זו תאפשר לתלמידים ולהורים לשלוח פנייה ישירה למורה.
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs text-white font-bold block">ביוגרפיה קצרה (יוצג בפופאפ בלחיצה)</label>
                            <textarea 
                              rows={4}
                              value={staffBio}
                              onChange={(e) => setStaffBio(e.target.value)}
                              placeholder="כתבו כמה מילים על איש/ת הצוות, פילוסופיה חינוכית או רקע פדגוגי..."
                              className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-school-cyan transition-colors resize-none"
                            />
                          </div>

                          <div className="flex items-center gap-3 bg-[#080d19]/40 border border-school-line/50 p-4 rounded-xl">
                            <input 
                              type="checkbox"
                              id="isManagement"
                              checked={staffIsManagement}
                              onChange={(e) => setStaffIsManagement(e.target.checked)}
                              className="w-4 h-4 text-school-cyan bg-school-bg border-school-line rounded focus:ring-school-cyan focus:ring-2 accent-school-cyan"
                            />
                            <label htmlFor="isManagement" className="text-xs text-white font-bold cursor-pointer select-none">
                              <span>חבר הנהלה / בעל תפקיד ניהול בכיר</span>
                              <span className="block text-[10px] text-school-muted font-normal mt-0.5">חברי הנהלה יוצגו תמיד בסרגל אנשי הצוות הראשי בדף הבית.</span>
                            </label>
                          </div>
                        </div>

                        {/* Left Column: Photo Upload / Select Preset */}
                        <div className="md:col-span-4 space-y-4">
                          <label className="text-xs text-white font-bold block">תמונת פרופיל</label>
                          
                          {/* Photo preview and Drag & Drop */}
                          <div 
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingStaffPhoto(true); }}
                            onDragLeave={() => setIsDraggingStaffPhoto(false)}
                            onDrop={handleStaffPhotoDrop}
                            className={`relative border-2 border-dashed rounded-2xl p-4 text-center flex flex-col items-center justify-center min-h-[180px] transition-all ${
                              isDraggingStaffPhoto 
                                ? 'border-school-cyan bg-school-cyan/5' 
                                : 'border-school-line/60 hover:border-school-cyan/55 bg-[#080d19]'
                            }`}
                          >
                            {staffImageUrl && !staffImageUrl.includes('unsplash.com') && !staffImageUrl.includes('placeholder') ? (
                              <div className="space-y-3 w-full">
                                <img 
                                  src={staffImageUrl} 
                                  alt="Preview" 
                                  className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-school-cyan/50 shadow-md"
                                />
                                <button 
                                  type="button"
                                  onClick={() => setStaffImageUrl('')}
                                  className="text-[10px] text-red-400 hover:text-red-300 font-bold underline cursor-pointer"
                                >
                                  הסרת תמונה וחזרה לאוואטר ראשי תיבות
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-2 pointer-events-none flex flex-col items-center">
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAvatarColor(staffName || 'צוות').bg} flex items-center justify-center border ${getAvatarColor(staffName || 'צוות').border} shadow-sm mb-1`}>
                                  <span className={`text-xl font-black ${getAvatarColor(staffName || 'צוות').text}`}>
                                    {getHebrewInitials(staffName || 'צוות')}
                                  </span>
                                </div>
                                <p className="text-[11px] text-white font-bold">העלאת תמונה אמיתית (מחליפה את האוואטר)</p>
                                <p className="text-[9px] text-school-muted">לחצו לבחירת תמונה מקומית או גררו קובץ לכאן</p>
                              </div>
                            )}

                            {!staffImageUrl && (
                              <input 
                                type="file"
                                accept="image/*"
                                onChange={handleStaffPhotoChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                            )}
                          </div>

                          {/* Quick avatar presets */}
                          <div className="space-y-2">
                            <span className="text-[10px] text-school-muted block font-bold">או בחרו מתבניות תמונות סגל מוכנות:</span>
                            <div className="flex gap-2 flex-wrap justify-center">
                              {[
                                { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', label: 'מורה א' },
                                { url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400', label: 'מורה ב' },
                                { url: 'https://images.unsplash.com/photo-1580894732444-8fecef2271ff?auto=format&fit=crop&q=80&w=400', label: 'מורה ג' },
                                { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', label: 'מורה ד' },
                                { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400', label: 'מורה ה' }
                              ].map((preset, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setStaffImageUrl(preset.url)}
                                  className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                                    staffImageUrl === preset.url ? 'border-school-cyan scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                                  }`}
                                  title={preset.label}
                                >
                                  <img src={preset.url} alt="" className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-school-line/40">
                        <button 
                          type="button"
                          onClick={() => { setEditingStaffId(null); setStaffFormError(null); }}
                          className="px-5 py-2.5 rounded-xl border border-school-line/60 text-xs font-bold text-school-text hover:bg-white/5 transition-all"
                        >
                          ביטול
                        </button>
                        <button 
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-school-cyan to-cyan-400 text-school-bg text-xs font-extrabold flex items-center gap-1.5 hover:-translate-y-0.5 transition-all shadow-md"
                        >
                          <Save className="w-4 h-4" />
                          <span>שמירת שינויים בסגל</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* LIST VIEW OF ALL STAFF MEMBERS */
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#101b33] border border-school-line rounded-2xl p-4">
                        
                        {/* Search input */}
                        <div className="relative flex-grow max-w-md">
                          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-school-muted" />
                          <input 
                            type="text"
                            value={searchStaffQuery}
                            onChange={(e) => setSearchStaffQuery(e.target.value)}
                            placeholder="חיפוש איש צוות לפי שם או תפקיד..."
                            className="w-full bg-[#080d19] border border-school-line/50 rounded-xl py-2 pl-4 pr-10 text-xs text-white placeholder:text-school-muted focus:outline-none focus:border-school-cyan transition-colors"
                          />
                          {searchStaffQuery && (
                            <button 
                              type="button"
                              onClick={() => setSearchStaffQuery('')}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-school-muted hover:text-white text-xs"
                            >
                              נקה
                            </button>
                          )}
                        </div>

                        {/* Top action buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button 
                            type="button"
                            onClick={() => {
                              setEditingStaffId('new');
                              setStaffName('');
                              setStaffRole('');
                              setStaffRoleDescription('');
                              setStaffEmail('');
                              setStaffBio('');
                              setStaffImageUrl('');
                              setStaffIsManagement(false);
                              setStaffFormError(null);
                            }}
                            className="btn py-2 px-4 rounded-xl bg-school-cyan text-school-bg text-xs font-extrabold flex items-center gap-1.5 hover:-translate-y-0.5 transition-all shadow-sm"
                          >
                            <Plus className="w-4 h-4" />
                            <span>הוספת איש צוות</span>
                          </button>

                          {!showResetStaffConfirm ? (
                            <button 
                              type="button"
                              onClick={() => setShowResetStaffConfirm(true)}
                              className="p-2 rounded-xl border border-school-line/60 text-school-muted hover:text-white hover:bg-white/5 transition-all"
                              title="שחזר סגל מקורי"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-xl text-[10px] text-white">
                              <span className="font-bold text-red-400">שחזור?</span>
                              <button
                                type="button"
                                onClick={handleResetStaffToDefault}
                                className="text-red-400 hover:text-red-300 font-bold px-1 py-0.5 hover:bg-red-500/10 rounded"
                              >
                                שחזר
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowResetStaffConfirm(false)}
                                className="text-school-muted hover:text-white px-1 py-0.5 hover:bg-white/5 rounded"
                              >
                                ביטול
                              </button>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Staff list card directory */}
                      <div className="bg-[#101b33] border border-school-line rounded-2xl p-5">
                        <div className="flex items-center justify-between border-b border-school-line/40 pb-3 mb-4">
                          <h4 className="text-xs font-bold text-white">רשימת סגל בית הספר ({staffMembers.length})</h4>
                          <span className="text-[10px] text-school-muted">לחצו על שורת איש צוות לעריכה, או השתמשו בחצים לשינוי הסדר</span>
                        </div>

                        <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                          {staffMembers
                            .filter(member => {
                              const q = searchStaffQuery.toLowerCase();
                              return member.name.toLowerCase().includes(q) || member.role.toLowerCase().includes(q);
                            })
                            .map((member) => (
                              <div 
                                key={member.id}
                                className="group flex items-center justify-between p-3 rounded-xl bg-school-bg/40 border border-school-line/40 hover:border-school-cyan/30 hover:bg-school-bg/75 transition-all"
                              >
                                <div 
                                  className="flex items-center gap-3.5 cursor-pointer flex-grow"
                                  onClick={() => {
                                    setEditingStaffId(member.id);
                                    setStaffName(member.name);
                                    setStaffRole(member.role);
                                    setStaffRoleDescription(member.roleDescription || '');
                                    setStaffEmail(member.email || '');
                                    setStaffBio(member.bio);
                                    setStaffImageUrl(member.imageUrl);
                                    setStaffIsManagement(member.isManagement);
                                    setStaffFormError(null);
                                  }}
                                >
                                  <div className="w-11 h-11 rounded-full overflow-hidden border border-school-line/60 shrink-0 flex items-center justify-center">
                                    {member.imageUrl && !member.imageUrl.includes('unsplash.com') && !member.imageUrl.includes('placeholder') ? (
                                      <img 
                                        src={member.imageUrl} 
                                        alt={member.name} 
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className={`w-full h-full bg-gradient-to-br ${getAvatarColor(member.name).bg} flex items-center justify-center select-none`}>
                                        <span className={`text-xs font-black ${getAvatarColor(member.name).text}`}>
                                          {getHebrewInitials(member.name)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-white group-hover:text-school-cyan transition-colors">{member.name}</span>
                                      {member.email && (
                                        <span className="text-[9px] bg-school-cyan/10 text-school-cyan border border-school-cyan/20 px-1.5 py-0.2 rounded font-mono dir-ltr">{member.email}</span>
                                      )}
                                      {member.isManagement && (
                                        <span className="text-[9px] bg-amber-400/10 text-amber-300 border border-amber-400/20 px-2 py-0.5 rounded-full font-bold">תפקיד ניהול / דף הבית</span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-school-muted line-clamp-1">
                                      {member.roleDescription ? `${member.role} • ${member.roleDescription}` : member.role}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {/* Up/Down Sorting Buttons - only shown if search is empty to avoid index mismatch confusion */}
                                  {!searchStaffQuery && (
                                    <div className="flex items-center gap-0.5 border-l border-school-line/30 pl-2 ml-1">
                                      <button
                                        type="button"
                                        onClick={() => handleMoveStaffUp(member.id)}
                                        className="p-1 text-school-muted hover:text-school-cyan hover:bg-white/5 rounded transition-all disabled:opacity-20 disabled:pointer-events-none"
                                        disabled={staffMembers.findIndex(s => s.id === member.id) === 0}
                                        title="הזז למעלה"
                                      >
                                        <ChevronUp className="w-4 h-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleMoveStaffDown(member.id)}
                                        className="p-1 text-school-muted hover:text-school-cyan hover:bg-white/5 rounded transition-all disabled:opacity-20 disabled:pointer-events-none"
                                        disabled={staffMembers.findIndex(s => s.id === member.id) === staffMembers.length - 1}
                                        title="הזז למטה"
                                      >
                                        <ChevronDown className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}

                                  <button 
                                    type="button"
                                    onClick={() => {
                                      setEditingStaffId(member.id);
                                      setStaffName(member.name);
                                      setStaffRole(member.role);
                                      setStaffBio(member.bio);
                                      setStaffImageUrl(member.imageUrl);
                                      setStaffIsManagement(member.isManagement);
                                      setStaffFormError(null);
                                    }}
                                    className="p-1.5 text-school-muted hover:text-school-cyan hover:bg-school-cyan/10 rounded-lg transition-all"
                                    title="עריכת פרטים"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Deletion confirmation without window.confirm */}
                                  {deleteConfirmId === member.id ? (
                                    <div className="flex items-center gap-1 bg-red-500/15 border border-red-500/20 px-2 py-1 rounded-lg text-[10px]">
                                      <span className="text-red-400 font-bold">למחוק?</span>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteStaff(member.id)}
                                        className="text-red-400 hover:text-red-300 font-extrabold px-1.5 py-0.5 hover:bg-red-500/20 rounded"
                                      >
                                        כן
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setDeleteConfirmId(null)}
                                        className="text-school-muted hover:text-white px-1.5 py-0.5 hover:bg-white/5 rounded"
                                      >
                                        לא
                                      </button>
                                    </div>
                                  ) : (
                                    <button 
                                      type="button"
                                      onClick={() => setDeleteConfirmId(member.id)}
                                      className="p-1.5 text-school-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                      title="מחיקת איש צוות"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}

                          {staffMembers.filter(member => {
                            const q = searchStaffQuery.toLowerCase();
                            return member.name.toLowerCase().includes(q) || member.role.toLowerCase().includes(q);
                          }).length === 0 && (
                            <div className="text-center py-10 text-xs text-school-muted">לא נמצאו אנשי צוות תואמים</div>
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* 3. EDITORS TEAM WORKSPACE */}
              {activeTab === 'editors' && (
                <div className="space-y-6">
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Invite new editor Form */}
                    <div className="lg:col-span-5 bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-4">
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-white text-base">הזמנת עורך חדש (Multi-Editor Invite)</h3>
                        <p className="text-[10px] text-school-muted leading-relaxed">הזן אימייל ושם מלא כדי להוסיף עורך מורשה נוסף וליצור קישור הזמנה ישיר.</p>
                      </div>

                      <form onSubmit={handleInviteEditorSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-white font-bold">שם מלא של העורך *</label>
                          <input 
                            type="text"
                            required
                            value={inviteName}
                            onChange={(e) => setInviteName(e.target.value)}
                            placeholder="ישראל ישראלי"
                            className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-white font-bold">כתובת אימייל *</label>
                          <input 
                            type="email"
                            required
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="name@domain.com"
                            className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none text-left"
                            dir="ltr"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-white font-bold">תפקיד / הרשאת גישה</label>
                          <select 
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value)}
                            className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none"
                          >
                            <option value="עורך תוכן">עורך תוכן (עריכת דפים ועדכונים)</option>
                            <option value="מנהל מערכת">מנהל מערכת (ניהול דפים, מנהלים וקוד)</option>
                            <option value="עורך אורח">עורך אורח (הרשאת צפייה ועדכונים בלבד)</option>
                            <option disabled className="text-school-muted font-bold pt-2">--- רכזי שכבות ---</option>
                            <option value="רכז שכבה ז'">רכז שכבה ז' (ניהול דפי שכבה ז' בלבד)</option>
                            <option value="רכז שכבה ח'">רכז שכבה ח' (ניהול דפי שכבה ח' בלבד)</option>
                            <option value="רכז שכבה ט'">רכז שכבה ט' (ניהול דפי שכבה ט' בלבד)</option>
                            <option value="רכז שכבה י'">רכז שכבה י' (ניהול דפי שכבה י' בלבד)</option>
                            <option value="רכז שכבה יא'">רכז שכבה יא' (ניהול דפי שכבה יא' בלבד)</option>
                            <option value="רכז שכבה יב'">רכז שכבה יב' (ניהול דפי שכבה יב' בלבד)</option>
                            <option disabled className="text-school-muted font-bold pt-2">--- רכזי 11 המגמות (תשפ"ז) ---</option>
                            <option value="רכז מגמת דאטה אנליסט">רכז מגמת דאטה אנליסט (ניהול תוכן וסילבוס)</option>
                            <option value="רכז מגמת תיאטרון ומחזות זמר">רכז מגמת תיאטרון ומחזות זמר (ניהול תוכן וסילבוס)</option>
                            <option value="רכז מגמת פיזיקה">רכז מגמת פיזיקה (ניהול תוכן וסילבוס)</option>
                            <option value="רכז מגמת סייבר גיאוגרפיה">רכז מגמת סייבר גיאוגרפיה (ניהול תוכן וסילבוס)</option>
                            <option value="רכז מגמת מנהל וכלכלה">רכז מגמת מנהל וכלכלה (ניהול תוכן וסילבוס)</option>
                            <option value="רכז מגמת ערבית">רכז מגמת ערבית (ניהול תוכן וסילבוס)</option>
                            <option value="רכז מגמת מדעי החברה">רכז מגמת מדעי החברה (ניהול תוכן וסילבוס)</option>
                            <option value="רכז מגמת כימיה">רכז מגמת כימיה (ניהול תוכן וסילבוס)</option>
                            <option value="רכז מגמת הנדסת תוכנה">רכז מגמת הנדסת תוכנה (ניהול תוכן וסילבוס)</option>
                            <option value="רכז מגמת חנ&quot;ג">רכז מגמת חנ"ג (ניהול תוכן וסילבוס)</option>
                            <option value="רכז מגמת ביולוגיה">רכז מגמת ביולוגיה (ניהול תוכן וסילבוס)</option>
                          </select>
                        </div>

                        <button 
                          type="submit"
                          className="w-full flex items-center justify-center gap-2 btn py-3 rounded-xl font-bold bg-gradient-to-r from-school-cyan to-cyan-400 text-school-bg shadow hover:-translate-y-0.5 transition-all text-xs"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>צור קישור הזמנה לעורך</span>
                        </button>
                      </form>

                      {/* Generated Invite Block */}
                      <AnimatePresence>
                        {generatedInviteLink && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#080d19]/80 border border-school-cyan/30 rounded-xl p-4 space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-school-line/30 pb-1">
                              <span className="text-[10px] text-school-cyan font-bold">קישור הזמנה מוכן לצוות</span>
                              <button onClick={() => setGeneratedInviteLink(null)} className="text-school-muted hover:text-white">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-[9px] text-school-muted leading-relaxed">העורך נוסף מיידית לרשימת המורשים. העתק את הקישור מטה ושלח לו אותו:</p>
                            
                            <div className="flex gap-2 items-center">
                              <input 
                                type="text" 
                                readOnly 
                                value={generatedInviteLink}
                                className="w-full bg-school-bg border border-school-line rounded-lg py-1 px-2.5 font-mono text-[9px] text-school-muted text-left"
                                dir="ltr"
                              />
                              <button 
                                onClick={handleCopyInviteLink}
                                className="p-1.5 border border-school-cyan/20 bg-school-cyan/5 hover:bg-school-cyan/15 text-school-cyan rounded-lg transition-colors shrink-0"
                                title="העתק קישור"
                              >
                                {copiedInvite ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>

                    {/* Authorized Editors list */}
                    <div className="lg:col-span-7 bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-4">
                      <div>
                        <h3 className="font-extrabold text-white text-base">רשימת עורכים מורשים במערכת</h3>
                        <p className="text-[10px] text-school-muted">עורכים אלו מורשים להתחבר ל-CMS, לעדכן ולשנות תכנים באתר.</p>
                      </div>

                      <div className="border border-school-line/60 rounded-xl overflow-hidden bg-[#080d19]/30">
                        <div className="grid grid-cols-12 gap-2 bg-[#090f1d] px-4 py-2 text-[11px] font-bold text-school-muted border-b border-school-line/50">
                          <div className="col-span-4">שם העורך</div>
                          <div className="col-span-5">כתובת אימייל</div>
                          <div className="col-span-2 text-center">הרשאה</div>
                          <div className="col-span-1 text-center">הסר</div>
                        </div>

                        <div className="divide-y divide-school-line/40 max-h-[64vh] overflow-y-auto">
                          {editors.map((ed) => (
                            <div key={ed.email} className="grid grid-cols-12 gap-2 px-4 py-3 text-xs items-center hover:bg-white/5 transition-colors">
                              <div className="col-span-4 font-bold text-white flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-school-cyan/10 flex items-center justify-center text-school-cyan text-[10px] font-black uppercase shrink-0">
                                  {ed.name[0]}
                                </div>
                                <span className="truncate">{ed.name}</span>
                              </div>
                              <div className="col-span-5 text-school-muted truncate font-mono text-[10px]" dir="ltr">{ed.email}</div>
                              <div className="col-span-2 text-center">
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                                  ed.role.startsWith('רכז')
                                    ? 'bg-amber-400/10 border-amber-400/20 text-amber-400'
                                    : ed.role === 'מנהל מערכת' || ed.role === 'מנהל ראשי'
                                    ? 'bg-red-400/10 border-red-400/20 text-red-400'
                                    : ed.role === 'עורך אורח'
                                    ? 'bg-slate-400/10 border-slate-400/20 text-slate-400'
                                    : 'bg-school-cyan/10 border-school-cyan/20 text-school-cyan'
                                }`}>
                                  {ed.role}
                                </span>
                              </div>
                              <div className="col-span-1 flex justify-center">
                                <button
                                  disabled={currentUser?.email === ed.email}
                                  onClick={() => handleDeleteEditor(ed.email)}
                                  className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-20"
                                  title={currentUser?.email === ed.email ? "אינך יכול למחוק את עצמך" : "מחק עורך"}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* 3.5. SOCIAL NETWORKS MANAGEMENT WORKSPACE */}
              {activeTab === 'socials' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-school-line/30 pb-4">
                    <h2 className="text-xl font-black text-white">רשתות חברתיות וערוצי שידור</h2>
                    <p className="text-xs text-school-muted mt-1">עדכון קישורים לפלטפורמות החברתיות של בית הספר. קישורים אלו יוצגו בראש הדף מתחת ללוגו (רק קישורים פעילים יוצגו).</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Form Panel */}
                    <form onSubmit={handleSaveSocials} className="lg:col-span-7 bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-6">
                      <div className="space-y-4">
                        
                        {/* Facebook Link Input */}
                        <div className="space-y-2">
                          <label className="text-xs text-white font-bold flex items-center gap-2">
                            <Facebook className="w-4 h-4 text-blue-500 shrink-0" />
                            <span>קישור לעמוד הפייסבוק (Facebook URL)</span>
                          </label>
                          <input 
                            type="url"
                            value={socialFacebook}
                            onChange={(e) => setSocialFacebook(e.target.value)}
                            placeholder="https://facebook.com/your-school-page"
                            className="w-full text-xs text-white bg-school-bg border border-school-line rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-school-cyan/50 focus:border-school-cyan transition-all text-left dir-ltr"
                          />
                          <p className="text-[10px] text-school-muted">השאר/י ריק כדי להסתיר את סמל הפייסבוק מהאתר.</p>
                        </div>

                        {/* Instagram Link Input */}
                        <div className="space-y-2">
                          <label className="text-xs text-white font-bold flex items-center gap-2">
                            <Instagram className="w-4 h-4 text-pink-500 shrink-0" />
                            <span>קישור לעמוד האינסטגרם (Instagram URL)</span>
                          </label>
                          <input 
                            type="url"
                            value={socialInstagram}
                            onChange={(e) => setSocialInstagram(e.target.value)}
                            placeholder="https://instagram.com/your-school-profile"
                            className="w-full text-xs text-white bg-school-bg border border-school-line rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-school-cyan/50 focus:border-school-cyan transition-all text-left dir-ltr"
                          />
                          <p className="text-[10px] text-school-muted">השאר/י ריק כדי להסתיר את סמל האינסטגרם מהאתר.</p>
                        </div>

                        {/* YouTube Link Input */}
                        <div className="space-y-2">
                          <label className="text-xs text-white font-bold flex items-center gap-2">
                            <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                            <span>קישור לערוץ היוטיוב (YouTube Channel URL)</span>
                          </label>
                          <input 
                            type="url"
                            value={socialYoutube}
                            onChange={(e) => setSocialYoutube(e.target.value)}
                            placeholder="https://youtube.com/@your-school-channel"
                            className="w-full text-xs text-white bg-school-bg border border-school-line rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-school-cyan/50 focus:border-school-cyan transition-all text-left dir-ltr"
                          />
                          <p className="text-[10px] text-school-muted">השאר/י ריק כדי להסתיר את סמל היוטיוב מהאתר.</p>
                        </div>

                      </div>

                      <div className="pt-4 border-t border-school-line/40 flex justify-end">
                        <button 
                          type="submit"
                          className="px-6 py-3 bg-school-cyan hover:bg-school-cyan/90 text-slate-950 text-xs font-black rounded-xl flex items-center gap-2 hover:-translate-y-0.5 transition-all shadow-md cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>שמירת שינויים ועדכון קישורים</span>
                        </button>
                      </div>
                    </form>

                    {/* Preview Panel */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-4">
                        <h3 className="font-extrabold text-white text-sm">תצוגה מקדימה של סמלים פעילים</h3>
                        <p className="text-[11px] text-school-muted leading-relaxed">כך יופיעו הקישורים מתחת ללוגו בראש האתר. רק פלטפורמות עם כתובת תקינה יוצגו בפועל.</p>
                        
                        <div className="p-4 bg-school-bg border border-school-line/60 rounded-xl flex flex-col gap-3">
                          <div className="text-[10px] text-school-muted font-bold border-b border-school-line/30 pb-2 mb-1">
                            ראש הדף (צד ימין מתחת ללוגו):
                          </div>
                          
                          <div className="flex items-center gap-4 py-2 px-3 bg-white/5 rounded-lg w-fit">
                            {socialFacebook.trim() ? (
                              <div className="p-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200" title="פייסבוק">
                                <Facebook className="w-4 h-4" />
                              </div>
                            ) : (
                              <span className="p-1.5 text-school-muted opacity-30 border border-transparent rounded-lg cursor-not-allowed" title="פייסבוק לא פעיל">
                                <Facebook className="w-4 h-4" />
                              </span>
                            )}

                            {socialInstagram.trim() ? (
                              <div className="p-1.5 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-lg hover:bg-pink-500 hover:text-white transition-all duration-200" title="אינסטגרם">
                                <Instagram className="w-4 h-4" />
                              </div>
                            ) : (
                              <span className="p-1.5 text-school-muted opacity-30 border border-transparent rounded-lg cursor-not-allowed" title="אינסטגרם לא פעיל">
                                <Instagram className="w-4 h-4" />
                              </span>
                            )}

                            {socialYoutube.trim() ? (
                              <div className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200" title="יוטיוב">
                                <Youtube className="w-4 h-4" />
                              </div>
                            ) : (
                              <span className="p-1.5 text-school-muted opacity-30 border border-transparent rounded-lg cursor-not-allowed" title="יוטיוב לא פעיל">
                                <Youtube className="w-4 h-4" />
                              </span>
                            )}
                          </div>

                          <div className="text-[10px] space-y-1.5 mt-2">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${socialFacebook.trim() ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                              <span className="text-school-muted">פייסבוק: <strong className={socialFacebook.trim() ? 'text-emerald-400' : 'text-red-400'}>{socialFacebook.trim() ? 'פעיל' : 'לא פעיל'}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${socialInstagram.trim() ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                              <span className="text-school-muted">אינסטגרם: <strong className={socialInstagram.trim() ? 'text-emerald-400' : 'text-red-400'}>{socialInstagram.trim() ? 'פעיל' : 'לא פעיל'}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${socialYoutube.trim() ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                              <span className="text-school-muted">יוטיוב: <strong className={socialYoutube.trim() ? 'text-emerald-400' : 'text-red-400'}>{socialYoutube.trim() ? 'פעיל' : 'לא פעיל'}</strong></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* 4. DESIGN AND THEME MANAGEMENT WORKSPACE */}
              {activeTab === 'theme' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Top header and sub-tabs selector */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-school-line/30 pb-4">
                    <div>
                      <h2 className="text-xl font-black text-white">עיצוב ותמות האתר</h2>
                      <p className="text-xs text-school-muted mt-1">שליטה מלאה בצבעים, ברקעים, בכרטיסיות ובטרנדים העיצוביים של האתר.</p>
                    </div>
                    
                    {/* Sub-tabs toggles */}
                    <div className="flex bg-[#080d19] p-1 rounded-xl border border-school-line/40 shrink-0">
                      <button
                        onClick={() => setThemeSubTab('trends')}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          themeSubTab === 'trends'
                            ? 'bg-school-cyan text-slate-950 shadow-md'
                            : 'text-school-muted hover:text-white'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>גלריית טרנדים והצעות</span>
                      </button>
                      <button
                        onClick={() => setThemeSubTab('manual')}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          themeSubTab === 'manual'
                            ? 'bg-school-cyan text-slate-950 shadow-md'
                            : 'text-school-muted hover:text-white'
                        }`}
                      >
                        <Palette className="w-3.5 h-3.5" />
                        <span>התאמה אישית ובינה מלאכותית</span>
                      </button>
                    </div>
                  </div>

                  {/* Active Theme Sync Status & Shareable URL */}
                  <div className="bg-[#101b33]/60 border border-school-line/60 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link className="w-4 h-4 text-school-cyan" />
                        <h3 className="font-extrabold text-white text-xs sm:text-sm">קישור ישיר לעיצוב הנוכחי (סנכרון שרת/לקוח)</h3>
                      </div>
                      <p className="text-[11px] text-school-muted max-w-2xl leading-relaxed">
                        עיצוב האתר נשמר בדפדפן שלך. כדי להחיל עיצוב זה עבור משתמשים אחרים, גולשים, או על שרת הייצור (Netlify), השתמש בקישור הייחודי המכיל את פרמטר העיצוב. המערכת תזהה את העיצוב מהקישור באופן אוטומטי ותשמור אותו בדפדפן של המבקרים!
                      </p>
                    </div>
                    
                    <button
                      onClick={handleCopyThemeLink}
                      className="flex items-center gap-2 bg-[#080d19] border border-school-line hover:border-school-cyan/40 hover:bg-school-cyan/5 text-[11px] text-white font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow shrink-0 self-stretch md:self-center justify-center"
                    >
                      {copiedThemeLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">הקישור הועתק בהצלחה!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-school-cyan" />
                          <span>העתק קישור מותאם לעיצוב זה</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* SUB-TAB 1: TRENDS GALLERY */}
                  {themeSubTab === 'trends' && (
                    <div className="space-y-6 animate-fade-in">
                      {/* Interactive suggestions panel */}
                      <div className="bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-amber-400" />
                              <h3 className="font-extrabold text-white text-base">הצעות עיצוב מוכנות מראש (טרנדים מובילים)</h3>
                            </div>
                            <p className="text-xs text-school-muted">
                              הצגנו עבורך 4 הצעות עיצוב ייחודיות המבוססות על טרנדים מודרניים בדיגיטל. לחץ על הצעה כלשהי כדי להחיל אותה מיידית על כל האתר בקליק אחד!
                            </p>
                          </div>

                          {/* Shuffle Button */}
                          <button
                            onClick={() => setTrendSetIndex((prev) => (prev + 1) % 3)}
                            className="flex items-center gap-2 bg-[#080d19] border border-school-line hover:border-school-cyan/40 hover:bg-school-cyan/5 text-xs text-white font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow shrink-0 self-start sm:self-center"
                          >
                            <Shuffle className="w-4 h-4 text-school-cyan animate-pulse" />
                            <span>בקש 4 הצעות עיצוב אחרות</span>
                          </button>
                        </div>

                        {/* Bento Grid of 4 designs based on trendSetIndex */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                          {DESIGN_TRENDS.slice(trendSetIndex * 4, trendSetIndex * 4 + 4).map((trend) => {
                            // Check if this trend is currently active (matching colors)
                            const isCurrent = Object.keys(trend.colors).every(
                              (key) => customColors[key]?.toLowerCase() === trend.colors[key as keyof typeof trend.colors]?.toLowerCase()
                            );
                            
                            return (
                              <button
                                key={trend.id}
                                onClick={() => handleApplyTrendTheme(trend.colors)}
                                className={`group text-right p-4 rounded-2xl border transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-[210px] ${
                                  isCurrent
                                    ? 'bg-school-cyan/10 border-school-cyan shadow-[0_0_15px_rgba(34,211,238,0.15)] ring-2 ring-school-cyan/30'
                                    : 'bg-[#080d19]/60 border-school-line hover:border-school-cyan/50 hover:bg-[#0c1324]'
                                }`}
                              >
                                <div className="space-y-2 w-full">
                                  <div className="flex items-center justify-between">
                                    <span className="text-2xl select-none">{trend.icon}</span>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-school-cyan/80 bg-school-cyan/10 px-2 py-0.5 rounded-md">
                                      {trend.trendName}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="block font-black text-white text-sm group-hover:text-school-cyan transition-colors">
                                      {trend.name}
                                    </span>
                                    <span className="block text-[11px] text-school-muted leading-relaxed mt-1 line-clamp-3">
                                      {trend.desc}
                                    </span>
                                  </div>
                                </div>

                                {/* Mini Color Palette & Checkmark */}
                                <div className="flex items-center justify-between w-full pt-3 border-t border-school-line/20">
                                  {/* Color spheres */}
                                  <div className="flex -space-x-1.5 rtl:space-x-reverse">
                                    <span className="w-5 h-5 rounded-full border border-[#080d19] shadow-inner" style={{ backgroundColor: trend.colors["school-bg"] }} title="רקע" />
                                    <span className="w-5 h-5 rounded-full border border-[#080d19] shadow-inner" style={{ backgroundColor: trend.colors["school-panel"] }} title="שכבה ראשית" />
                                    <span className="w-5 h-5 rounded-full border border-[#080d19] shadow-inner" style={{ backgroundColor: trend.colors["school-cyan"] }} title="צבע דגש" />
                                    <span className="w-5 h-5 rounded-full border border-[#080d19] shadow-inner" style={{ backgroundColor: trend.colors["school-text"] }} title="טקסט" />
                                  </div>

                                  {isCurrent ? (
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                      פעיל כעת
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-school-muted group-hover:text-white transition-colors">
                                      החל עיצוב זה
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        
                        <div className="text-center pt-2">
                          <p className="text-[11px] text-school-muted">
                            עמוד {trendSetIndex + 1} מתוך 3 (סך הכל 12 תבניות טרנדיות מוכנות). לחץ על הכפתור "בקש 4 הצעות עיצוב אחרות" כדי לטעון תבניות נוספות!
                          </p>
                        </div>
                      </div>

                      {/* Built-in legacy presets */}
                      <div className="bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-4">
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-white text-base">תבניות עיצוב בסיסיות מובנות</h3>
                          <p className="text-xs text-school-muted">בחר מתוך רשימת תבניות העיצוב המקוריות והקלאסיות של המערכת</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                          {SITE_THEMES.map((theme) => (
                            <button
                              key={theme.id}
                              onClick={() => {
                                if (onThemeChange) onThemeChange(theme.id);
                              }}
                              className={`flex flex-col justify-between p-3.5 rounded-xl text-right transition-all border cursor-pointer text-xs ${
                                activeTheme === theme.id 
                                  ? 'bg-school-cyan/15 text-white font-bold border-school-cyan/40 shadow-inner' 
                                  : 'bg-[#080d19]/40 hover:bg-white/5 text-school-muted hover:text-white border-school-line/60'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg select-none">{theme.icon}</span>
                                <span className="font-extrabold text-white text-xs">{theme.name}</span>
                              </div>
                              <span className="block text-[10px] text-school-muted mb-3 line-clamp-2 leading-relaxed h-[32px]">{theme.desc}</span>
                              <div className="flex gap-1 justify-end pt-2 border-t border-school-line/10">
                                <span className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: theme.colors["school-bg"] }} />
                                <span className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: theme.colors["school-panel"] }} />
                                <span className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: theme.colors["school-cyan"] }} />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 2: ADVANCED CUSTOMIZATION */}
                  {themeSubTab === 'manual' && (
                    <div className="space-y-6 animate-fade-in">
                      {/* AI Design Prompt Generator */}
                      <div className="bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Palette className="w-5 h-5 text-emerald-400" />
                            <h3 className="font-extrabold text-white text-base">מחולל סגנונות מבוסס בינה מלאכותית (AI Styling Prompt Engine)</h3>
                          </div>
                          <p className="text-xs text-school-muted leading-relaxed">
                            כתוב פרומפט המאפשר לשלוט בעיצוב האתר. המערכת תפענח את הפרומפט שלך ותשנה את צבעי האתר בצורה אופטימלית ונקייה, ללא פגיעה בתכנים ובמידע!
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-xs text-white font-black">הפרומפט לעיצוב האתר:</label>
                            <textarea
                              rows={3}
                              value={themePrompt}
                              onChange={(e) => setThemePrompt(e.target.value)}
                              placeholder="לדוגמה: רקע בצבע חול מדברי עם כיתוב חום וזהב מלכותי בהיר..."
                              className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-school-cyan/60 resize-none font-sans placeholder-school-muted/50 text-right"
                            />
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleApplyPromptTheme(themePrompt)}
                                disabled={promptStatus === 'loading'}
                                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-900 text-xs font-extrabold px-6 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 cursor-pointer shadow-lg"
                              >
                                {promptStatus === 'loading' ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>מפענח ומחיל עיצוב...</span>
                                  </>
                                ) : (
                                  <>
                                    <Palette className="w-4 h-4" />
                                    <span>החל עיצוב מבוסס פרומפט</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {promptStatus === 'success' && (
                              <span className="text-xs font-bold text-emerald-400 animate-pulse flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4" />
                                העיצוב החדש פוענח והוחל בהצלחה!
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Global background and manual fine-tuning */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Global Background Rapid Swapper */}
                        <div className="lg:col-span-5 bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                          <div className="space-y-1">
                            <h3 className="font-extrabold text-white text-base">שינוי גורף מהיר של רקע האתר</h3>
                            <p className="text-xs text-school-muted leading-relaxed">
                              בחר צבע רקע ראשי בצעד אחד. המערכת תבצע התאמה גורפת חכמה של שכבות הכרטיסיות, פנלים וצבעי הטקסט כדי לשמור על קריאות וניגודיות (קונטרסט) מושלמת!
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5 pt-2">
                            {[
                              { id: "bg-black", label: "⬛️ שחור מוחלט", colors: { "school-bg": "#000000", "school-panel": "#0a0a0a", "school-panel2": "#121212", "school-text": "#f8fafc", "school-muted": "#94a3b8" } },
                              { id: "bg-space", label: "🌌 כחול קוסמי", colors: { "school-bg": "#333d4e", "school-panel": "#3e495b", "school-panel2": "#4a566a", "school-text": "#f8fafc", "school-muted": "#e2e8f0" } },
                              { id: "bg-purple", label: "🍆 סגול לילה", colors: { "school-bg": "#0a0518", "school-panel": "#140c28", "school-panel2": "#1d123a", "school-text": "#f3e8ff", "school-muted": "#c084fc" } },
                              { id: "bg-green", label: "🌲 יער עמוק", colors: { "school-bg": "#050c0b", "school-panel": "#0a1715", "school-panel2": "#102421", "school-text": "#f0fdf4", "school-muted": "#86efac" } },
                              { id: "bg-sand", label: "🪵 חול מדבר", colors: { "school-bg": "#fcfbfa", "school-panel": "#ffffff", "school-panel2": "#f5f4f0", "school-text": "#1c1917", "school-muted": "#78716c" } },
                              { id: "bg-ivory", label: "🥚 שנהב חמים", colors: { "school-bg": "#f9f6f0", "school-panel": "#ffffff", "school-panel2": "#efebe4", "school-text": "#291a0c", "school-muted": "#8c7a6b" } },
                              { id: "bg-steel", label: "🪨 אפור פלדה", colors: { "school-bg": "#12151c", "school-panel": "#1a1e28", "school-panel2": "#242a38", "school-text": "#f1f5f9", "school-muted": "#94a3b8" } },
                              { id: "bg-white", label: "☀️ לבן קלאסי", colors: { "school-bg": "#ffffff", "school-panel": "#f8fafc", "school-panel2": "#f1f5f9", "school-text": "#0f172a", "school-muted": "#475569" } }
                            ].map((preset) => {
                              const isActive = customColors["school-bg"]?.toLowerCase() === preset.colors["school-bg"].toLowerCase();
                              return (
                                <button
                                  key={preset.id}
                                  onClick={() => {
                                    const merged = { ...customColors, ...preset.colors };
                                    handleApplyTrendTheme(merged);
                                  }}
                                  className={`p-3 rounded-xl border text-right transition-all text-[11px] font-bold flex items-center justify-between cursor-pointer ${
                                    isActive
                                      ? 'bg-school-cyan/15 text-white border-school-cyan shadow-sm'
                                      : 'bg-[#080d19]/60 border-school-line hover:border-school-cyan/40 text-school-muted hover:text-white'
                                  }`}
                                >
                                  <span>{preset.label}</span>
                                  <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: preset.colors["school-bg"] }} />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Fine-Tuning Colors */}
                        <div className="lg:col-span-7 bg-[#101b33] border border-school-line rounded-2xl p-6 space-y-4">
                          <div className="space-y-1">
                            <h3 className="font-extrabold text-white text-base">כוונון עדין של פלטת הצבעים</h3>
                            <p className="text-xs text-school-muted">
                              שלוט על צבע כרטיסיות השכבות וצבע הטקסט בנפרד! לחץ על הצבעים כדי לכוונן באופן נקודתי.
                            </p>
                          </div>

                          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                            {[
                              { section: "שכבות וכרטיסיות (Layers & Cards)", items: [
                                { key: "school-panel", label: "צבע כרטיסייה / שכבה ראשית", desc: "תיבות תוכן, תפריטים וכרטיסיות ראשיות" },
                                { key: "school-panel2", label: "צבע כרטיסייה / שכבה משנית", desc: "תיבות משנה פנימיות, שדות קלט וטבלאות" }
                              ]},
                              { section: "טקסט וקריאות (Text & Legibility)", items: [
                                { key: "school-text", label: "צבע טקסט ראשי", desc: "כותרות ופסקאות תוכן מרכזיות" },
                                { key: "school-muted", label: "צבע טקסט עמום / משני", desc: "תאריכים, הערות, תת-כותרות ומידע פחות בולט" }
                              ]},
                              { section: "דגשים ורקע (Highlights & Background)", items: [
                                { key: "school-bg", label: "צבע רקע האתר", desc: "רקע עמוק לעמודי האתר הראשיים" },
                                { key: "school-cyan", label: "צבע דגש ראשי", desc: "כפתורים פעילים, לינקים וכותרות מודגשות" },
                                { key: "school-violet", label: "צבע דגש משני", desc: "אלמנטים משלימים, אפקטי מעבר והובר" }
                              ]}
                            ].map((group, groupIdx) => (
                              <div key={groupIdx} className="space-y-1.5 pt-2 border-t border-school-line/10 first:border-t-0 first:pt-0">
                                <h4 className="text-[10px] font-black text-school-cyan uppercase tracking-wider">{group.section}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {group.items.map((colorItem) => (
                                    <div key={colorItem.key} className="flex items-center justify-between gap-3 p-2 rounded-xl bg-[#080d19]/40 border border-school-line/30 text-right">
                                      <div className="space-y-0.5">
                                        <span className="block text-[11px] font-bold text-white">{colorItem.label}</span>
                                        <span className="block text-[9px] text-school-muted leading-tight truncate max-w-[170px]">{colorItem.desc}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="font-mono text-[9px] text-school-muted uppercase">{customColors[colorItem.key] || "#"}</span>
                                        <input
                                          type="color"
                                          value={customColors[colorItem.key] || "#000000"}
                                          onChange={(e) => handleColorChange(colorItem.key, e.target.value)}
                                          className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 shrink-0"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 8.5. SCHOOL MAJORS & TRACKS (MIDDLE SCHOOL & HIGH SCHOOL) */}
              {activeTab === 'majors' && (
                <div className="max-w-7xl mx-auto">
                  <MajorsAdmin 
                    restrictedMajorId={isMajorCoordinator(effectiveRole) ? getMajorIdFromCoordinatorRole(effectiveRole) : null}
                    coordinatorRoleName={effectiveRole}
                  />
                </div>
              )}

              {/* 9. TEACHERS EVENTS & WORKSHOPS GOOGLE SYNC WORKSPACE */}
              {activeTab === 'teachers-events' && (
                <div className="max-w-7xl mx-auto -m-6">
                  <TeacherEventsAdmin />
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* Global Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in dir-rtl">
          <div className="bg-[#101b33] border border-school-line/80 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl text-right animate-scale-up">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{confirmModal.title || 'אישור פעולה'}</h3>
                <p className="text-xs text-school-muted">נדרש אישור לביצוע פעולה זו</p>
              </div>
            </div>

            <p className="text-xs md:text-sm text-school-text leading-relaxed bg-[#080d19]/60 p-4 rounded-xl border border-school-line/40 whitespace-pre-line">
              {confirmModal.message}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-5 py-2.5 rounded-xl text-xs font-bold border border-school-line bg-school-panel hover:bg-school-panel2 text-school-muted hover:text-white transition-colors cursor-pointer"
              >
                {confirmModal.cancelText || 'ביטול'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const action = confirmModal.onConfirm;
                  setConfirmModal(prev => ({ ...prev, isOpen: false }));
                  if (action) action();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg hover:from-red-500 hover:to-rose-500 transition-all cursor-pointer"
              >
                {confirmModal.confirmText || 'כן, מחק'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
