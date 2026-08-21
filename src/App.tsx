import { subscribeToStaffMembers, getStoredStaffMembers } from './services/staffStorage';
import { subscribeToNews, subscribeToSettings } from './services/cmsStorage';
import { subscribeToPageOverrides } from './services/pagesStorage';
import { subscribeToAdminSettings } from './services/adminStorage';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Calendar, 
  HelpCircle, 
  Phone, 
  MapPin, 
  Search, 
  ChevronDown, 
  Award, 
  Users, 
  Lightbulb, 
  Rocket, 
  Shield, 
  Clock, 
  Mail, 
  Brain, 
  UserCheck, 
  GraduationCap, 
  Compass, 
  Chrome, 
  CreditCard, 
  ChevronRight, 
  ChevronLeft,
  Menu, 
  X, 
  ExternalLink, 
  Map, 
  Send, 
  Info,
  Cpu,
  Palette,
  Globe,
  Sparkles,
  FileText,
  Lock,
  Sun,
  Moon,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';
import { 
  schoolLogoSvg, 
  schoolNewsArticles, 
  announcementsData, 
  learningSpacesData, 
  quickLinksData, 
  galleryPhotosData, 
  mosheArensBio, 
  schoolRegulations,
  NewsArticle,
  defaultStaffMembers
} from './data';
import { StaffMember } from './types';
import { getHebrewInitials, getAvatarColor } from './utils/avatarUtils';
import FloatingHeroBalls from './components/FloatingHeroBalls';
import InternalPageViewer from './components/InternalPageViewer';
import AdminPanel from './components/AdminPanel';
import { RolePortalHomepage } from './components/RolePortalHomepage';
import { TeacherEventRegistration } from './components/TeacherEventRegistration';
import { TeacherEventsAdmin } from './components/TeacherEventsAdmin';
import { MajorsExplorer } from './components/MajorsExplorer';
import { HomepageMajorsSection } from './components/HomepageMajorsSection';
import { MajorDedicatedPage } from './components/MajorDedicatedPage';
import { getUpcomingTeacherEvents } from './services/eventsStorage';
import { SITE_THEMES } from './data/themes';
import SEOMeta from './components/SEOMeta';
import { getQuickLinks } from './data/quickLinks';
import { INTERNAL_PAGES, getInternalPageOverrides, getAllPagesMap } from './data/internalPages';
import { InternalPage, QuickLink, TeacherEvent } from './types';

/* Helper to convert relative URLs to full links on Tik-Tak */
const SITE_URL = "https://arens.tik-tak.school/";
const getFullUrl = (url: string) => {
  if (url.startsWith("http")) return url;
  return SITE_URL + url;
};

const OFFICIAL_GRADES = [
  { g: "ז", u: "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%96-%d7%94%d7%a6%d7%a2%d7%93-%d7%94%d7%a8%d7%90%d7%a9%d7%95%d7%9f-%d7%91%d7%93%d7%a8%d7%9a-%d7%94%d7%97%d7%93%d7%a9%d7%94/" },
  { g: "ח", u: "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%97-%d7%a6%d7%9e%d7%99%d7%97%d7%94-%d7%95%d7%94%d7%a2%d7%9e%d7%a7%d7%94-%d7%9e%d7%92%d7%9c%d7%99%d7%9d-%d7%90%d7%aa-%d7%94%d7%9b%d7%95%d7%97%d7%95%d7%aa-%d7%a9/" },
  { g: "ט", u: "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%98-%d7%91%d7%97%d7%99%d7%a8%d7%95%d7%aa-%d7%a2%d7%a6%d7%9e%d7%90%d7%95%d7%aa-%d7%95%d7%90%d7%97%d7%a8%d7%99%d7%95%d7%aa/" },
  { g: "י", u: "course/%d7%97%d7%98%d7%a2-2/%d7%a4%d7%95%d7%a1%d7%98-%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99/" },
  { g: "יא", u: "course/%d7%97%d7%98%d7%a2-2/%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%90/" },
  { g: "יב", u: "course/%d7%97%d7%98%d7%a2-2/%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%91/" }
];

const GRADES = [
  { g: "ז", u: "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%96-%d7%94%d7%a6%d7%a2%d7%93-%d7%94%d7%a2%d7%aa-%d7%a8%d7%90%d7%a9%d7%aa-%d7%91%d7%93%d7%a8%d7%9a-%d7%94%d7%97%d7%93%d7%a9%d7%94/" },
  { g: "ח", u: "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%97-%d7%a6%d7%9e%d7%99%d7%97%d7%94-%d7%95%d7%94%d7%a2%d7%9e%d7%a7%d7%94-%d7%9e%d7%92%d7%9c%d7%99%d7%9d-%d7%90%d7%aa-%d7%94%d7%9b%d7%95%d7%97%d7%95%d7%aa-%d7%a9/" },
  { g: "ט", u: "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%98-%d7%91%d7%97%d7%99%d7%a8%d7%95%d7%aa-%d7%a2%d7%a6%d7%9e%d7%90%d7%95%d7%aa-%d7%95%d7%90%d7%97%d7%a8%d7%99%d7%95%d7%aa/" },
  { g: "י", u: "course/%d7%a4%d7%95%d7%a1%d7%98-%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99/" },
  { g: "יא", u: "course/%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%90/" },
  { g: "יב", u: "course/%d7%97%d7%98%d7%a2-2/%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%91/" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeTheme, setActiveTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlTheme = params.get('theme');
        if (urlTheme) {
          localStorage.setItem('arens_school_theme', urlTheme);
          return urlTheme;
        }
      } catch (e) {
        console.error('Error parsing theme from URL:', e);
      }
    }
    return localStorage.getItem('arens_school_theme') || 'cosmic-dark';
  });

  // Dark/Light mode state helper
  const isDark = !['classic-light', 'trend-nordic', 'trend-emerald', 'trend-sakura', 'trend-sepia'].includes(activeTheme);

  const toggleDarkMode = () => {
    if (isDark) {
      setActiveTheme('classic-light');
    } else {
      setActiveTheme('cosmic-dark');
    }
  };

  const [isThemePickerOpen, setIsThemePickerOpen] = useState<boolean>(false);
  const [selectedInternalPageUrl, setSelectedInternalPageUrl] = useState<string | null>(null);
  const [selectedMajorId, setSelectedMajorId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [hoveredNavIndex, setHoveredNavIndex] = useState<number | null>(null);
  const navHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNavMouseEnter = (idx: number) => {
    if (navHoverTimeoutRef.current) {
      clearTimeout(navHoverTimeoutRef.current);
      navHoverTimeoutRef.current = null;
    }
    setHoveredNavIndex(idx);
  };

  const handleNavMouseLeave = () => {
    if (navHoverTimeoutRef.current) {
      clearTimeout(navHoverTimeoutRef.current);
    }
    navHoverTimeoutRef.current = setTimeout(() => {
      setHoveredNavIndex(null);
    }, 300);
  };
  
  // Dynamic news articles state loaded from localstorage or default school articles
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  // Dynamic staff members state loaded from localstorage or default school articles
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  // Selected staff member for bio modal popup
  const [selectedStaffForModal, setSelectedStaffForModal] = useState<StaffMember | null>(null);
  // State to toggle between showing only management staff vs all staff on the homepage
  const [showAllStaffOnHomepage, setShowAllStaffOnHomepage] = useState<boolean>(false);

  // Dynamic socials state loaded from localstorage or default socials
  const [socials, setSocials] = useState<{ facebook: string; instagram: string; youtube: string }>({
    facebook: '',
    instagram: '',
    youtube: ''
  });

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [inviteGreeting, setInviteGreeting] = useState<string | null>(null);

  // Active role for the new portal homepage (students, parents, teachers)
  const [homeRole, setHomeRole] = useState<'students' | 'parents' | 'teachers'>('students');
  // Toggle to view classic homepage layout
  const [showClassicHome, setShowClassicHome] = useState<boolean>(false);
  // Selected event ID for teacher registration view
  const [selectedEventIdForRegistration, setSelectedEventIdForRegistration] = useState<string | undefined>(undefined);

  // Dynamic pages map and quick links
  const [allPagesMap, setAllPagesMap] = useState<Record<string, InternalPage>>({});
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  // Dynamic upcoming teacher events
  const [upcomingEventsList, setUpcomingEventsList] = useState<TeacherEvent[]>(() => getUpcomingTeacherEvents());

  const refreshPages = () => {
    setAllPagesMap(getAllPagesMap());
  };

  const refreshQuickLinksList = () => {
    setQuickLinks(getQuickLinks());
  };

  const refreshTeacherEvents = () => {
    setUpcomingEventsList(getUpcomingTeacherEvents());
  };

  // Sync news articles, staff members and socials with local storage updates instantly
  useEffect(() => {
    const unsubStaff = subscribeToStaffMembers((liveStaff) => {
      setStaffMembers(liveStaff);
    });

    const unsubNews = subscribeToNews((liveNews) => {
      setNewsArticles(liveNews);
    });

    const unsubPages = subscribeToPageOverrides(() => {
      refreshPages();
    });

    const unsubAdmin = subscribeToAdminSettings();

    const loadNews = () => {
      const savedNews = localStorage.getItem('arens_cms_news');
      if (savedNews) {
        setNewsArticles(JSON.parse(savedNews));
      } else {
        setNewsArticles(schoolNewsArticles);
      }
    };
    const loadStaff = () => {
      setStaffMembers(getStoredStaffMembers());
    };
    const loadSocials = () => {
      const savedSocials = localStorage.getItem('arens_cms_socials');
      if (savedSocials) {
        try {
          const parsed = JSON.parse(savedSocials);
          setSocials({
            facebook: parsed.facebook || '',
            instagram: parsed.instagram || '',
            youtube: parsed.youtube || ''
          });
        } catch (e) {
          console.error(e);
        }
      } else {
        setSocials({
          facebook: 'https://www.facebook.com/arens.pt',
          instagram: 'https://www.instagram.com/arens_school_pt',
          youtube: 'https://www.youtube.com/@ArensSchool'
        });
      }
    };
    loadNews();
    loadStaff();
    loadSocials();
    refreshPages();
    refreshQuickLinksList();

    const handlePagesUpdate = () => {
      loadNews();
      loadStaff();
      loadSocials();
      refreshPages();
      refreshTeacherEvents();
    };
    const handleQuickLinksUpdate = () => {
      refreshQuickLinksList();
    };
    const handleEventsUpdate = () => {
      refreshTeacherEvents();
    };

    window.addEventListener('internal_pages_updated', handlePagesUpdate);
    window.addEventListener('quick_links_updated', handleQuickLinksUpdate);
    window.addEventListener('arens_events_updated', handleEventsUpdate);
    window.addEventListener('arens_registrations_updated', handleEventsUpdate);
    return () => {
      unsubStaff();
      unsubNews();
      unsubPages();
      unsubAdmin();
      window.removeEventListener('internal_pages_updated', handlePagesUpdate);
      window.removeEventListener('quick_links_updated', handleQuickLinksUpdate);
      window.removeEventListener('arens_events_updated', handleEventsUpdate);
      window.removeEventListener('arens_registrations_updated', handleEventsUpdate);
    };
  }, []);

  // Apply theme variables dynamically to the document root & sync with URL query parameters
  useEffect(() => {
    let colorsObj = null;
    if (activeTheme === 'custom-prompt-theme') {
      const savedCustom = localStorage.getItem('arens_school_custom_theme');
      if (savedCustom) {
        try {
          colorsObj = JSON.parse(savedCustom).colors;
        } catch (e) {
          console.error(e);
        }
      }
    }
    
    if (!colorsObj) {
      const themeObj = SITE_THEMES.find(t => t.id === activeTheme) || SITE_THEMES[0];
      colorsObj = themeObj.colors;
    }
    
    localStorage.setItem('arens_school_theme', activeTheme);
    
    const root = document.documentElement;
    Object.entries(colorsObj).forEach(([key, val]) => {
      root.style.setProperty(`--color-${key}`, val as string);
    });

    // Synchronize URL search parameters with the selected theme
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get('theme') !== activeTheme) {
        url.searchParams.set('theme', activeTheme);
        window.history.replaceState({}, '', url.toString());
      }
    } catch (e) {
      console.error('Error syncing theme with URL query parameters:', e);
    }
  }, [activeTheme]);

  // Handle case when user updates URL manually (or via sharing/links)
  useEffect(() => {
    const handleUrlThemeSync = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlTheme = params.get('theme');
        if (urlTheme && urlTheme !== activeTheme) {
          if (SITE_THEMES.some(t => t.id === urlTheme) || urlTheme === 'custom-prompt-theme') {
            setActiveTheme(urlTheme);
          }
        }
      } catch (e) {
        console.error('Error handling URL theme sync:', e);
      }
    };

    window.addEventListener('popstate', handleUrlThemeSync);
    // Periodically check in case of client-side navigation without popstate
    const interval = setInterval(handleUrlThemeSync, 1000);
    return () => {
      window.removeEventListener('popstate', handleUrlThemeSync);
      clearInterval(interval);
    };
  }, [activeTheme]);

  // Check URL parameters for active editor invitation links
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('invite') === 'true') {
        const email = params.get('email');
        const name = params.get('name');
        const role = params.get('role') || 'עורך תוכן';

        if (email && name) {
          // Add invited user to authorized list in local storage
          let editors = [];
          const stored = localStorage.getItem('arens_cms_editors');
          if (stored) {
            editors = JSON.parse(stored);
          } else {
            editors = [
              { email: 'nava.ss@arens.school', name: 'נאווה שקל ששון', role: 'מנהלת שש-שנתי' },
              { email: 'dan.p@arens.school', name: 'דן פנחס', role: 'מנהל חטיבת נעורים' },
              { email: 'admin@arens.school', name: 'מנהל מערכת', role: 'מנהל ראשי' }
            ];
          }

          const exists = editors.some((ed: any) => ed.email.toLowerCase() === email.toLowerCase());
          if (!exists) {
            editors.push({ email, name, role });
            localStorage.setItem('arens_cms_editors', JSON.stringify(editors));
          }

          // Force login as the invited editor directly
          localStorage.setItem('arens_cms_token', 'simulated_jwt_token_12345');
          localStorage.setItem('arens_cms_user', JSON.stringify({ email, name, role }));

          setInviteGreeting(`שלום ${name}! הזמנתך כ-${role} אושרה בהצלחה. נכנסת ישירות למערכת הניהול.`);
          setIsAdminOpen(true);

          // Clear search parameters from URL elegantly to prevent loops
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Synchronize hash, pathname and query params with page state
  useEffect(() => {
    const handleUrlRouteSync = () => {
      try {
        const hash = window.location.hash.replace(/^#/, '');
        const searchParams = new URLSearchParams(window.location.search);
        const pageParam = searchParams.get('page');

        if (hash === 'home-page-1' || pageParam === 'home-page-1' || window.location.pathname.endsWith('/home-page-1')) {
          setActiveTab('home-page-1');
          setSelectedInternalPageUrl('home-page-1');
        } else if (hash === 'students' || pageParam === 'students') {
          setActiveTab('students');
          setSelectedInternalPageUrl(null);
        } else if (hash === 'parents' || pageParam === 'parents') {
          setActiveTab('parents');
          setSelectedInternalPageUrl(null);
        } else if (hash === 'teachers' || pageParam === 'teachers') {
          setActiveTab('teachers');
          setSelectedInternalPageUrl(null);
        } else if (hash.startsWith('teachers-events') || pageParam === 'teachers-events') {
          setActiveTab('teachers-events');
          setSelectedInternalPageUrl(null);
          // Parse optional eventId
          const eventIdMatch = hash.match(/eventId=([^&]+)/);
          const qEventId = searchParams.get('eventId');
          if (eventIdMatch && eventIdMatch[1]) {
            setSelectedEventIdForRegistration(decodeURIComponent(eventIdMatch[1]));
          } else if (qEventId) {
            setSelectedEventIdForRegistration(qEventId);
          }
        } else if (hash.startsWith('teachers-events-admin') || pageParam === 'teachers-events-admin') {
          setActiveTab('teachers-events-admin');
          setSelectedInternalPageUrl(null);
        } else if (hash.startsWith('major-')) {
          const mId = hash.replace('major-', '');
          setSelectedMajorId(mId);
          setActiveTab('major-page');
          setSelectedInternalPageUrl(null);
        } else if (hash === 'majors' || pageParam === 'majors') {
          setActiveTab('majors');
          setSelectedInternalPageUrl(null);
        } else if (hash.startsWith('course/')) {
          setSelectedInternalPageUrl(hash);
          setActiveTab('internal-page');
        } else if (hash === 'contact') {
          setActiveTab('contact');
        } else if (hash === 'home') {
          setActiveTab('home');
          setSelectedInternalPageUrl(null);
        }
      } catch (e) {
        console.error('Error syncing URL route:', e);
      }
    };

    handleUrlRouteSync();
    window.addEventListener('hashchange', handleUrlRouteSync);
    window.addEventListener('popstate', handleUrlRouteSync);
    return () => {
      window.removeEventListener('hashchange', handleUrlRouteSync);
      window.removeEventListener('popstate', handleUrlRouteSync);
    };
  }, []);

  // News Article Selected Modal state
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsArticle | null>(null);
  
  const [contactSuccess, setContactSuccess] = useState<boolean>(false);
  
  // Custom Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'parent', // 'parent' | 'student' | 'guest'
    message: ''
  });

  // Homepage Hero & Titles State
  const [homepageSettings, setHomepageSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('arens_homepage_settings');
      if (saved) {
        return {
          heroSubtitle: 'שש שנתי ע"ש משה ארנס',
          heroTitle: 'ארנס מצמיח אדם וחברה',
          heroDescription: 'רוצים ללמוד ולהצליח ולצד זה להתפתח ולהתקדם? הגעתם למקום הנכון! בואו ללמוד במקום שיוביל אתכם לצמוח ולבנות חברה טובה יותר…',
          primaryBtnText: 'כניסה לשכבות',
          secondaryBtnText: 'מה מתרחש אצלנו?',
          ...JSON.parse(saved)
        };
      }
    } catch (e) {
      console.error(e);
    }
    return {
      heroSubtitle: 'שש שנתי ע"ש משה ארנס',
      heroTitle: 'ארנס מצמיח אדם וחברה',
      heroDescription: 'רוצים ללמוד ולהצליח ולצד זה להתפתח ולהתקדם? הגעתם למקום הנכון! בואו ללמוד במקום שיוביל אתכם לצמוח ולבנות חברה טובה יותר…',
      primaryBtnText: 'כניסה לשכבות',
      secondaryBtnText: 'מה מתרחש אצלנו?'
    };
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('arens_homepage_settings');
        if (saved) {
          setHomepageSettings((prev: any) => ({ ...prev, ...JSON.parse(saved) }));
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('homepage_settings_updated', handleUpdate);
    return () => window.removeEventListener('homepage_settings_updated', handleUpdate);
  }, []);

  // Typewriter text state for hero
  const [sg1, setSg1] = useState('');
  const [typeText, setTypeText] = useState('');
  const [showSub, setShowSub] = useState(false);

  useEffect(() => {
    // Typewriter effect for requested sub-title and main title
    const subText = homepageSettings.heroSubtitle || 'שש שנתי ע"ש משה ארנס';
    const mainText = homepageSettings.heroTitle || 'ארנס מצמיח אדם וחברה';

    const seq = [
      { id: 'sg1', text: subText },
      { id: 'type', text: mainText }
    ];
    
    let currentSeqIdx = 0;
    let currentCharIdx = 0;
    let timeout: NodeJS.Timeout;

    const runType = () => {
      if (currentSeqIdx >= seq.length) {
        setShowSub(true);
        return;
      }
      
      const item = seq[currentSeqIdx];
      const partialText = item.text.substring(0, currentCharIdx + 1);
      
      if (item.id === 'sg1') setSg1(partialText);
      else if (item.id === 'type') setTypeText(partialText);
      
      currentCharIdx++;
      
      if (currentCharIdx >= item.text.length) {
        currentSeqIdx++;
        currentCharIdx = 0;
        timeout = setTimeout(runType, 380);
      } else {
        timeout = setTimeout(runType, 40 + Math.random() * 65);
      }
    };

    timeout = setTimeout(runType, 400);
    return () => clearTimeout(timeout);
  }, [homepageSettings.heroSubtitle, homepageSettings.heroTitle]);


  // Form handle submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.name && contactForm.message) {
      setContactSuccess(true);
      setTimeout(() => {
        setContactSuccess(false);
        setContactForm({ name: '', email: '', phone: '', role: 'parent', message: '' });
      }, 4000);
    }
  };

  // Structured site navigation to match authentic arens.tik-tak.school links
  const NAV_ITEMS = [
    {
      t: "דף הבית",
      tab: "home"
    },
    {
      t: "אודותינו",
      sub: [
        { t: "דבר המנהלת-שש שנתי", url: "course/%d7%90%d7%95%d7%93%d7%95%d7%aa%d7%99%d7%a0%d7%95/%d7%93%d7%91%d7%a8-%d7%94%d7%9e%d7%a0%d7%94%d7%9c%d7%aa-%d7%a9%d7%a9-%d7%a9%d7%a0%d7%aa%d7%99/" },
        { t: "דבר מנהל חטיבת הנעורים", url: "course/%d7%93%d7%91%d7%a8-%d7%9e%d7%a0%d7%94%d7%9c-%d7%97%d7%98%d7%91%d7%aa-%d7%94%d7%a0%d7%a2%d7%95%d7%a8%d7%99%d7%9d/" },
        { t: "אורחות החיים של ארנס", url: "course/%d7%90%d7%95%d7%93%d7%95%d7%aa%d7%99%d7%a0%d7%95/%d7%90%d7%95%d7%a8%d7%97%d7%95%d7%aa-%d7%97%d7%99%d7%99%d7%9d-%d7%91%d7%a8%d7%a0%d7%a1/" },
        { t: "חזון", url: "course/%d7%97%d7%96%d7%95%d7%9f-%d7%91/" }
      ]
    },
    {
      t: "לתלמידים 🎓",
      tab: "students",
      sub: [
        { t: "לתלמידים 🎓", tab: "students" },
        { t: "משוב תלמידים", externalUrl: "https://web.mashov.info/students/login" },
        { t: "פורטל תלמידים ובוגרים", externalUrl: "https://students.education.gov.il/" },
        { t: "Google Classroom", externalUrl: "https://classroom.google.com/" },
        { t: "כניסה לשכבות (ז'-יב')", isAnchor: true, anchor: "grades" },
        { t: "שישי אישי ומרכז הלמידה", url: "course/%d7%97%d7%98%d7%91/%d7%a9%d7%99%d7%a9%d7%99-%d7%90%d7%99%d7%a9%d7%99/" },
        { t: "חינוך חברתי חט\"ב", url: "course/%d7%97%d7%98%d7%91/%d7%97%d7%99%d7%a0%d7%95%d7%a5-%d7%97%d7%91%d7%a8%d7%aa%d7%99-%d7%97%d7%98%d7%91/" },
        { t: "מעורבות חברתית", url: "course/%d7%97%d7%98%d7%91/%d7%9e%d7%a2%d7%95%d7%a8%d7%91%d7%95%d7%aa-%d7%97%d7%91%d7%a8%d7%aa%d7%99-%d7%97%d7%91%d7%a8%d7%aa%d7%99-2/" },
        { t: "עבודות קיץ לעולים לכיתה ז'", url: "course/%d7%97%d7%98%d7%91/%d7%a2%d7%91%d7%95%d7%93%d7%95%d7%aa-%d7%a7%d7%99%d7%a5-%d7%9c%d7%a2%d7%95%d7%9c%d7%99%d7%9d-%d7%9c%d7%9b%d7%99%d7%aa%d7%94-%d7%96/" },
        { t: "עבודות קיץ לעולים לכיתות ח-ט", url: "course/%d7%97%d7%98%d7%91/%d7%a2%d7%91%d7%95%d7%93%d7%95%d7%aa-%d7%a7%d7%99%d7%a5-%d7%9c%d7%a2%d7%95%d7%9c%d7%99%d7%9d-%d7%9c%d7%9b%d7%15%d7%aa-%d7%97-%d7%98/" }
      ]
    },
    {
      t: "להורים 👨‍👩‍👧",
      tab: "parents",
      sub: [
        { t: "להורים 👨‍👩‍👧", tab: "parents" },
        { t: "משוב הורים", externalUrl: "https://web.mashov.info/parents/login" },
        { t: "פורטל הורים", externalUrl: "https://parents.education.gov.il/" },
        { t: "תשלומי הורים חטיבה עליונה", url: "course/%d7%aa%d7%a9%d7%9c%d7%95%d7%9e%d7%99-%d7%94%d7%95%d7%a8%d7%99%d7%9d-%d7%97%d7%98%d7%91%d7%99%d7%a2%d7%95%d7%a0%d7%94/" },
        { t: "פרויקט השאלת ספרים תשפ\"ז", url: "course/%a4%d7%a8%d7%95%d7%99%d7%a7%d7%98-%d7%94%d7%a9%d7%a4%d7%9c%d7%aa-%d7%a1%d7%a4%d7%a8%d7%99%d7%9d-%d7%aa%d7%a9%d7%a4%d7%95/" },
        { t: "טפסים חשובים וטפסי רישום", url: "course/%d7%98%d7%a4%d7%a1%d7%99-%d7%a8%d7%99%d7%a9%d7%95%d7%9d/" },
        { t: "מידעון בית הספר", url: "course/%d7%9e%d7%99%d7%93%d7%a2%d7%95%d7%9f-%d7%9e%d7%97%d7%a6%d7%99%d7%aa-%d7%90-%d7%aa%d7%a9%d7%a4%d7%94/" }
      ]
    },
    {
      t: "למורים 🍎",
      tab: "teachers",
      sub: [
        { t: "למורים 🍎", tab: "teachers" },
        { t: "משוב עובדי הוראה", externalUrl: "https://web.mashov.info/" },
        { t: "פורטל עובדי הוראה", externalUrl: "https://pob.education.gov.il/" },
        { t: "Google Classroom", externalUrl: "https://classroom.google.com/" },
        { t: "הרשמה לסדנאות ואירועי צוות 🌟", tab: "teachers-events" },
        { t: "ניהול אירועים וסדנאות (Google Sync) ⚙️", tab: "teachers-events-admin" },
        { t: "טפסים ודיווחי משוב", url: "course/%d7%98%d7%a4%d7%a1%d7%99-%d7%a8%d7%99%d7%a9%d7%95%d7%9d/" }
      ]
    },
    {
      t: "חט\"ב",
      sub: [
        { t: "מסלולים ומגמות חט\"ב 💻🏆", tab: "majors" },
        { t: "שכבת ז': הצעד הראשון בדרך החדשה", url: "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%96-%d7%94%d7%a6%d7%a2%d7%93-%d7%94%d7%a8%d7%90%d7%a9%d7%95%d7%9f-%d7%91%d7%93%d7%a8%d7%9a-%d7%94%d7%97%d7%93%d7%a9%d7%94/" },
        { t: "שכבת ח': צמיחה והעמקה – מגלים את הכוחות שבכם", url: "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%97-%d7%a6%d7%9e%d7%99%d7%97%d7%94-%d7%95%d7%94%d7%a2%d7%9e%d7%a7%d7%94-%d7%9e%d7%92%d7%9c%d7%99%d7%9d-%d7%90%d7%aa-%d7%94%d7%9b%d7%95%d7%97%d7%95%d7%aa-%d7%a9/" },
        { t: "שכבת ט': בחירות, עצמאות ואחריות", url: "course/%d7%97%d7%98%d7%91/%d7%a9%d7%9b%d7%91%d7%aa-%d7%98-%d7%91%d7%97%d7%99%d7%a8%d7%95%d7%aa-%d7%a2%d7%a6%d7%9e%d7%90%d7%95%d7%aa-%d7%95%d7%90%d7%97%d7%a8%d7%99%d7%95%d7%aa/" },
        { t: "חינוך חברתי חט\"ב", url: "course/%d7%97%d7%98%d7%91/%d7%97%d7%99%d7%a0%d7%95%d7%a5-%d7%97%d7%91%d7%a8%d7%aa%d7%99-%d7%97%d7%98%d7%91/" },
        { t: "מעורבות חברתית", url: "course/%d7%97%d7%98%d7%91/%d7%9e%d7%a2%d7%95%d7%a8%d7%91%d7%95%d7%aa-%d7%97%d7%91%d7%a8%d7%aa%d7%99-%d7%97%d7%91%d7%a8%d7%aa%d7%99-%d7%aa-2/" },
        { t: "שישי אישי ומרכז הלמידה", url: "course/%d7%97%d7%98%d7%91/%d7%a9%d7%99%d7%a9%d7%99-%d7%90%d7%99%d7%a9%d7%99/" },
        { t: "עבודות קיץ לעולים לכיתה ז'", url: "course/%d7%97%d7%98%d7%91/%d7%a2%d7%91%d7%95%d7%93%d7%95%d7%aa-%d7%a7%d7%99%d7%a5-%d7%9c%d7%a2%d7%95%d7%9c%d7%99%d7%9d-%d7%9c%d7%9b%d7%99%d7%aa%d7%94-%d7%96/" },
        { t: "עבודות קיץ לעולים לכיתות ח-ט", url: "course/%d7%97%d7%98%d7%91/%d7%a2%d7%91%d7%95%d7%93%d7%95%d7%aa-%d7%a7%d7%99%d7%a5-%d7%9c%d7%a2%d7%95%d7%9c%d7%99%d7%9d-%d7%9c%d7%9b%d7%15%d7%aa-%d7%97-%d7%98/" }
      ]
    },
    {
      t: "חט\"ע",
      sub: [
        { t: "מגמות החטיבה העליונה 💻🏆", tab: "majors" },
        { t: "שכבת י'", url: "course/%d7%97%d7%98%d7%a2-2/%d7%a4%d7%95%d7%a1%d7%98-%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99/" },
        { t: "שכבת יא'", url: "course/%d7%97%d7%98%d7%a2-2/%d7%90%d7%91%d7%90-%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%90/" },
        { t: "שכבת יב'", url: "course/%d7%97%d7%98%d7%a2-2/%d7%a9%d7%9b%d7%91%d7%aa-%d7%99%d7%91/" },
        { t: "תכנית היבחנות תלת שנתית", url: "course/%d7%97%d7%98%d7%a2-2/%d7%aa%d7%9b%d7%a0%d7%99%d7%aa-%d7%94%d7%99%d7%91%d7%97%d7%a0%d7%95%d7%aa-%d7%aa%d7%aa-%d7%a9%d7%a0%d7%aa%d7%99/" },
        { t: "מגמות", url: "course/%d7%97%d7%98%d7%a2-2/%d7%9e%d7%92%d7%9e%d7%95%d7%aa/" }
      ]
    },
    {
      t: "חוברת מגמות תשפ\"ז",
      url: "course/%d7%97%d7%98%d7%91/%d7%97%d7%95%d7%91%d7%a8%d7%aa-%d7%9e%d7%92%d7%9e%d7%95%d7%aa-%d7%aa%d7%a9%d7%a4%d7%95/"
    },
    {
      t: "מיזם נופלי העיר פתח תקווה",
      url: "course/%d7%9e%d7%99%d7%96%d7%9d-%d7%a0%d7%95%d7%a4%d7%9c%d7%99-%d7%94%d7%a2%d7%99%d7%a8-%d7%a4%d7%aa%d7%97-%d7%aa%d7%a7%d7%95%d7%95%d7%94/"
    },
    {
      t: "מידעון",
      url: "course/%d7%9e%d7%99%d7%93%d7%a2%d7%95%d7%9f-%d7%9e%d7%97%d7%a6%d7%99%d7%aa-%d7%90-%d7%aa%d7%a9%d7%a4%d7%94/"
    },
    {
      t: "תשלומי הורים חטיבה עליונה",
      url: "course/%d7%aa%d7%a9%d7%9c%d7%95%d7%9e%d7%99-%d7%94%d7%95%d7%a8%d7%99%d7%9d-%d7%97%d7%98%d7%99%d7%91%d7%94-%d7%a2%d7%9c%d7%99%d7%95%d7%a0%d7%94/"
    },
    {
      t: "טפסים חשובים",
      url: "course/%d7%98%d7%a4%d7%a1%d7%99-%d7%a8%d7%99%d7%a9%d7%95%d7%9d/"
    }
  ];

  // Navigation Menu structure matching original format with clean sub-items
  const NAV_ITEMS_ALT1 = useMemo(() => {
    const items: any[] = [
      {
        t: "דף הבית",
        tab: "home"
      },
      {
        t: "אודותינו",
        sub: [
          { t: "דבר המנהלת-שש שנתי", url: "course/%d7%90%d7%95%d7%93%d7%95%d7%aa%d7%99%d7%a0%d7%95/%d7%93%d7%91%d7%a8-%d7%94%d7%9e%d7%a0%d7%94%d7%9c%d7%aa-%d7%a9%d7%a9-%d7%a9%d7%a0%d7%aa%d7%99/" },
          { t: "דבר מנהל חטיבת הנעורים", url: "course/%d7%93%d7%91%d7%a8-%d7%9e%d7%a0%d7%94%d7%9c-%d7%97%d7%98%d7%91%d7%aa-%d7%94%d7%a0%d7%a2%d7%95%d7%a8%d7%99%d7%9d/" },
          { t: "אורחות החיים של ארנס", url: "course/%d7%90%d7%95%d7%93%d7%95%d7%aa%d7%99%d7%a0%d7%95/%d7%90%d7%95%d7%a8%d7%97%d7%95%d7%aa-%d7%97%d7%99%d7%99%d7%9d-%d7%91%d7%a8%d7%a0%d7%a1/" },
          { t: "חזון בית הספר", url: "course/%d7%97%d7%96%d7%95%d7%9f-%d7%91/" },
          { t: "מיזם נופלי העיר פתח תקווה", url: "course/%d7%9e%d7%99%d7%96%d7%9d-%d7%a0%d7%95%d7%a4%d7%9c%d7%99-%d7%94%d7%a2%d7%99%d7%a8-%d7%a4%d7%aa%d7%97-%d7%aa%d7%a7%d7%95%d7%95%d7%94/" }
        ]
      },
      {
        t: "לתלמידים",
        tab: "students"
      },
      {
        t: "להורים",
        tab: "parents"
      },
      {
        t: "למורים",
        tab: "teachers"
      },
      {
        t: "קישורים מהירים",
        sub: [
          { t: "חוברת מגמות תשפ\"ז", url: "course/%d7%97%d7%98%d7%91/%d7%97%d7%95%d7%91%d7%a8%d7%aa-%d7%9e%d7%92%d7%9e%d7%95%d7%aa-%d7%aa%d7%a9%d7%a4%d7%95/" },
          { t: "פרויקט השאלת ספרים תשפ\"ז", url: "course/%a4%d7%a8%d7%95%d7%99%d7%a7%d7%98-%d7%94%d7%a9%d7%a4%d7%9c%d7%aa-%d7%a1%d7%a4%d7%a8%d7%99%d7%9d-%d7%aa%d7%a9%d7%a4%d7%95/" },
          { t: "מיזם נופלי העיר פתח תקווה", url: "course/%d7%9e%d7%99%d7%96%d7%9d-%d7%a0%d7%95%d7%a4%d7%9c%d7%99-%d7%94%d7%a2%d7%99%d7%a8-%d7%a4%d7%aa%d7%97-%d7%aa%d7%a7%d7%95%d7%95%d7%94/" },
          { t: "מידעון בית הספר", url: "course/%d7%9e%d7%99%d7%93%d7%a2%d7%95%d7%9f-%d7%9e%d7%97%d7%a6%d7%99%d7%aa-%d7%90-%d7%aa%d7%a9%d7%a4%d7%94/" },
          { t: "תשלומי הורים חטיבה עליונה", url: "course/%d7%aa%d7%a9%d7%9c%d7%95%d7%9e%d7%99-%d7%94%d7%95%d7%a8%d7%99%d7%9d-%d7%97%d7%98%d7%91%d7%99%d7%a2%d7%95%d7%a0%d7%94/" },
          { t: "טפסים חשובים וטפסי רישום", url: "course/%d7%98%d7%a4%d7%a1%d7%99-%d7%a8%d7%99%d7%a9%d7%95%d7%9d/" }
        ]
      }
    ];

    return items;
  }, []);

  const NAV_ITEMS_ALT1_UNUSED: any[] = [];
  const OLD_ITEMS: any[] = [];

  // Quick external helpful links from school
  const EXTERNAL_LINKS = [
    { t: "חוברת מגמות תשפ\"ז", url: "course/%d7%97%d7%95%d7%91%d7%a8%d7%aa-%d7%9e%d7%92%d7%9e%d7%95%d7%aa-%d7%aa%d7%a9%d7%a4%d7%95/" },
    { t: "השאלת ספרים תשפ\"ז", url: "course/%a4%d7%a8%d7%95%d7%99%d7%a7%d7%98-%d7%94%d7%a9%d7%90%d7%9c%d7%aa-%d7%a1%d7%a4%d7%a8%d7%99%d7%9d-%d7%aa%d7%a9%d7%a4%d7%95/" },
    { t: "מיזם נופלי העיר פתח תקווה", url: "course/%d7%9e%d7%99%d7%96%d7%9d-%d7%a0%d7%95%d7%a4%d7%9c%d7%99-%d7%94%d7%a2%d7%99%d7%a8-%d7%a4%d7%aa%d7%97-%d7%aa%d7%a7%d7%95%d7%95%d7%94/" },
    { t: "מידעון מחצית", url: "course/%d7%9e%d7%99%d7%93%d7%a2%d7%95%d7%9f-%d7%9e%d7%97%d7%a6%d7%99%d7%aa-%d7%90-%d7%aa%d7%a9%d7%a4%d7%94/" },
    { t: "תשלומי הורים חטיבה עליונה", url: "course/%d7%aa%d7%a9%d7%9c%d7%95%d7%9e%d7%99-%d7%94%d7%95%d7%a8%d7%99%d7%9d-%d7%97%d7%98%d7%99%d7%91%d7%94-%d7%a2%d7%9c%d7%99%d7%95%d7%a0%d7%94/" }
  ];

  const isHomePage1 = activeTab === 'home-page-1' || selectedInternalPageUrl === 'home-page-1';
  const currentNavItems = NAV_ITEMS_ALT1;

  const handleNavClick = (item: any) => {
    if (item.externalUrl) {
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
    } else if (item.url === 'home-page-1' || item.tab === 'home-page-1') {
      setSelectedInternalPageUrl('home-page-1');
      setActiveTab('home-page-1');
      window.location.hash = 'home-page-1';
    } else if (item.tab === 'teachers-events') {
      if (item.eventId) {
        setSelectedEventIdForRegistration(item.eventId);
      }
      setActiveTab('teachers-events');
      setSelectedInternalPageUrl(null);
      window.location.hash = 'teachers-events';
    } else if (item.url) {
      setSelectedInternalPageUrl(item.url);
      setActiveTab('internal-page');
    } else if (item.tab) {
      setActiveTab(item.tab);
      setSelectedInternalPageUrl(null);
      window.location.hash = item.tab;
      if (item.anchor) {
        setTimeout(() => {
          const el = document.getElementById(item.anchor);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (item.anchor || item.isAnchor) {
      if (isHomePage1) {
        setActiveTab('home-page-1');
        setSelectedInternalPageUrl('home-page-1');
      } else {
        setActiveTab('home');
        setSelectedInternalPageUrl(null);
      }
      setTimeout(() => {
        const el = document.getElementById(item.anchor || 'grades');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    if (navHoverTimeoutRef.current) {
      clearTimeout(navHoverTimeoutRef.current);
      navHoverTimeoutRef.current = null;
    }
    setHoveredNavIndex(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative text-school-text bg-school-bg selection:bg-school-cyan/30 selection:text-white">
      <SEOMeta activeTab={activeTab} selectedInternalPageUrl={selectedInternalPageUrl} />
      
      {/* GLOWING HEADER */}
      <header className="sticky top-0 right-0 left-0 z-50 transition-all duration-300 border-b border-school-line/30 bg-school-bg/75 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 min-h-[5.5rem] py-2 flex items-center justify-between">
          
          {/* Logo, Brand & Socials Column */}
          <div className="flex flex-col items-start gap-1 py-1 shrink-0">
            <button 
              onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-3 shrink-0 text-right group pointer-events-auto"
            >
              <div className="relative p-2 rounded-2xl bg-white/10 border-2 border-school-cyan/60 shadow-[0_0_24px_rgba(34,211,238,0.5)] backdrop-blur-md group-hover:border-school-cyan group-hover:shadow-[0_0_36px_rgba(34,211,238,0.8)] transition-all duration-300">
                <img 
                  src="https://arens.tik-tak.school/wp-content/uploads/sites/120/2024/12/cropped-לוגו-שקוף-ארנס-1.png" 
                  alt="לוגו ארנס" 
                  className="h-12 md:h-16 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-all duration-300"
                />
              </div>
              <div>
                <h1 className="font-black text-xs md:text-sm text-white leading-tight">
                  שש שנתי
                </h1>
                <p className="text-[10px] md:text-[11px] text-school-cyan font-bold tracking-wide">
                  ע"ש משה ארנס פתח תקווה
                </p>
              </div>
            </button>

            {/* Socials immediately under the logo */}
            {(socials.facebook || socials.instagram || socials.youtube) && (
              <div className="flex items-center gap-3 pr-1 animate-fade-in">
                {socials.facebook && (
                  <a 
                    href={socials.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-school-muted hover:text-school-cyan hover:scale-110 transition-all duration-200"
                    title="פייסבוק"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                  </a>
                )}
                {socials.instagram && (
                  <a 
                    href={socials.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-school-muted hover:text-school-cyan hover:scale-110 transition-all duration-200"
                    title="אינסטגרם"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                  </a>
                )}
                {socials.youtube && (
                  <a 
                    href={socials.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-school-muted hover:text-school-cyan hover:scale-110 transition-all duration-200"
                    title="יוטיוב"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 mr-auto ml-4">
            {currentNavItems.map((item, idx) => (
              <div 
                key={idx} 
                className="relative"
                onMouseEnter={() => handleNavMouseEnter(idx)}
                onMouseLeave={handleNavMouseLeave}
              >
                <button
                  onClick={() => {
                    if (item.sub) {
                      if (hoveredNavIndex === idx) {
                        setHoveredNavIndex(null);
                      } else {
                        handleNavMouseEnter(idx);
                      }
                    } else {
                      handleNavClick(item);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === item.tab 
                      ? 'text-white bg-school-cyan/15 border border-school-cyan/30 shadow-sm' 
                      : 'text-school-muted hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span>{item.t}</span>
                  {item.sub && (
                    <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${hoveredNavIndex === idx ? 'rotate-180 text-school-cyan' : ''}`} />
                  )}
                </button>

                {/* Dropdown Menu Wrapper with Padding Bridge to prevent mouse gap closing */}
                {item.sub && hoveredNavIndex === idx && (
                  <div 
                    className="absolute top-full right-0 pt-2 min-w-[260px] z-50 animate-fade-in"
                    onMouseEnter={() => handleNavMouseEnter(idx)}
                    onMouseLeave={handleNavMouseLeave}
                  >
                    <div className="p-2 rounded-2xl bg-[#1c2536]/95 border border-school-line/80 shadow-2xl backdrop-blur-xl space-y-1">
                      {item.sub.map((subItem: any, subIdx) => (
                        <button
                          key={subIdx}
                          onClick={() => handleNavClick(subItem)}
                          className="w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-semibold text-school-muted hover:text-white hover:bg-gradient-to-r hover:from-school-cyan/20 hover:to-school-violet/20 transition-all duration-150 cursor-pointer flex items-center justify-between"
                        >
                          <span>{subItem.t}</span>
                          {subItem.externalUrl && <ExternalLink className="w-3 h-3 text-school-cyan/70 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Action Buttons Header */}
          <div className="flex items-center gap-2">
            {/* Dark / Light Mode Toggle Button */}
            <button 
              onClick={toggleDarkMode}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-school-line bg-school-panel/40 text-school-text hover:text-white hover:border-school-cyan/40 hover:bg-school-cyan/10 transition-all cursor-pointer shadow-sm group"
              title={isDark ? "מעבר למצב בהיר (Light Mode)" : "מעבר למצב כהה (Dark Mode)"}
              aria-label="החלפת מצב תצוגה יום/לילה"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                  <span className="hidden sm:inline text-xs font-semibold text-amber-200">מצב בהיר</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-400 group-hover:-rotate-12 transition-transform duration-300" />
                  <span className="hidden sm:inline text-xs font-semibold text-indigo-200">מצב כהה</span>
                </>
              )}
            </button>

            <button 
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center justify-center p-2.5 rounded-xl border border-school-line bg-school-panel/30 text-school-cyan hover:text-white hover:border-school-cyan/40 hover:bg-school-cyan/5 transition-all"
              title="כניסה לפאנל הניהול"
            >
              <Lock className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setActiveTab('contact')}
              className="hidden lg:flex btn px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-l from-school-cyan to-school-cyan/80 text-school-bg shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_30px_rgba(34,211,238,0.45)] hover:-translate-y-0.5 transition-all"
            >
              פנייה למזכירות
            </button>

            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-school-line bg-school-panel/50 text-white hover:bg-school-panel transition-all"
              aria-label="תפריט"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-school-bg/95 border-b border-school-line backdrop-blur-lg overflow-y-auto max-h-[calc(100vh-80px)] pointer-events-auto"
            >
              <div className="p-4 space-y-4">
                {currentNavItems.map((item, idx) => (
                  <div key={idx} className="space-y-1.5 border-b border-school-line/30 pb-3 last:border-0 last:pb-0">
                    <button
                      onClick={() => handleNavClick(item)}
                      className="w-full text-right font-bold text-sm text-white"
                    >
                      {item.t}
                    </button>
                    {item.sub && (
                      <div className="grid grid-cols-1 gap-1 pr-3 border-r border-school-line">
                        {item.sub.map((subItem: any, subIdx) => (
                          <button
                            key={subIdx}
                            onClick={() => handleNavClick(subItem)}
                            className="text-right py-1.5 text-xs text-school-muted hover:text-school-cyan transition-all"
                          >
                            {subItem.t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* External links in mobile */}
                <div className="space-y-2 pt-2">
                  <p className="text-[11px] font-bold text-school-muted">קישורים חיצוניים שימושיים:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {EXTERNAL_LINKS.map((link, lIdx) => (
                      <button
                        key={lIdx}
                        onClick={() => handleNavClick(link)}
                        className="flex items-center gap-1 text-school-muted hover:text-white text-right"
                      >
                        <span className="truncate">{link.t}</span>
                        <ChevronLeft className="w-2.5 h-2.5 shrink-0 opacity-60" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin Trigger Mobile */}
                <div className="pt-4 border-t border-school-line/20">
                  <button
                    onClick={() => {
                      setIsAdminOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-school-cyan/25 bg-school-cyan/5 text-school-cyan font-bold text-xs"
                  >
                    <Lock className="w-4 h-4" />
                    <span>כניסה לפאנל הניהול (CMS)</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- MAIN PAGE ROUTER --- */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ORIGINAL HOMEPAGE */}
          {(activeTab === 'home' || activeTab === 'home-page-1' || selectedInternalPageUrl === 'home-page-1') && (
            <motion.div
              key="home-original"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-0"
            >
              
              {/* BRANDED HERO SECTION */}
              <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-b from-school-bg via-school-panel/60 to-school-bg px-4 md:px-8 border-b border-school-line/30">
                {/* Aurora gradient background blobs */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_55%_45%_at_82%_30%,rgba(34,211,238,0.13),transparent_65%),radial-gradient(ellipse_50%_55%_at_15%_75%,rgba(129,140,248,0.12),transparent_65%),radial-gradient(ellipse_80%_40%_at_50%_115%,rgba(45,212,191,0.08),transparent_60%)] animate-[aurora_12s_ease-in-out_infinite_alternate]" />
                
                {/* Drifting blurred cosmic orbs */}
                <div className="absolute top-[12%] -right-[90px] w-[340px] h-[340px] rounded-full bg-school-cyan/25 filter blur-[80px] pointer-events-none animate-[float_10s_ease-in-out_infinite]" />
                <div className="absolute bottom-[8%] left-[6%] w-[280px] h-[280px] rounded-full bg-school-violet/25 filter blur-[80px] pointer-events-none animate-[float_10s_ease-in-out_infinite_delay-3s]" />

                {/* Physics bouncing balls */}
                <FloatingHeroBalls />

                <div className="max-w-7xl mx-auto w-full relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-20">
                  
                  {/* Left content block */}
                  <div className="lg:col-span-8 text-right space-y-6 max-w-2xl select-none">
                    
                    {/* Requested Sub-title */}
                    <div className="inline-flex items-center gap-3 text-sm md:text-base font-extrabold tracking-wider text-school-cyan bg-school-cyan/10 border border-school-cyan/30 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                      <span className="w-2 h-2 rounded-full bg-school-cyan animate-pulse" />
                      <span>{sg1 || 'שש שנתי ע"ש משה ארנס'}</span>
                    </div>
                    
                    {/* Requested Big Headline */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.12]">
                      <span className="bg-gradient-to-r from-white via-school-cyan to-school-violet bg-[size:200%_auto] bg-clip-text text-transparent animate-[gradshift_5s_linear_infinite]">
                        {typeText || 'ארנס מצמיח אדם וחברה'}
                      </span>
                      <span className="inline-block w-[10px] h-[0.9em] mr-2 bg-school-cyan shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-[blink_1s_step-end_infinite]" />
                    </h1>

                    <div className="w-32 h-1.5 bg-gradient-to-l from-school-cyan via-school-violet to-school-cyan rounded-full shadow-[0_0_16px_rgba(34,211,238,0.8)] animate-[grow_1.2s_ease-out_both]" />

                    {showSub && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                      >
                        <p className="text-sm md:text-base text-school-muted leading-relaxed max-w-xl font-light">
                          {homepageSettings.heroDescription}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                          <a 
                            href="#grades" 
                            onClick={(e) => {
                              e.preventDefault();
                              document.getElementById('grades')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="btn px-7 py-3 rounded-xl font-bold bg-gradient-to-r from-school-cyan to-cyan-400 text-school-bg shadow-[0_8px_30px_rgba(34,211,238,0.35)] hover:shadow-[0_12px_40px_rgba(34,211,238,0.5)] hover:-translate-y-0.5 transition-all"
                          >
                            {homepageSettings.primaryBtnText || 'כניסה לשכבות'}
                          </a>
                          <button 
                            onClick={() => {
                              if (newsArticles.length > 0) {
                                setSelectedNewsArticle(newsArticles[0]);
                              }
                            }}
                            className="btn px-7 py-3 rounded-xl font-bold bg-white/5 border border-school-line hover:border-school-cyan hover:text-school-cyan transition-all cursor-pointer"
                          >
                            {homepageSettings.secondaryBtnText || 'מה מתרחש אצלנו?'}
                          </button>
                        </div>
                      </motion.div>
                    )}

                  </div>

                </div>

                {/* News Ticker Strip spanning 100% screen width */}
                <div className="absolute bottom-0 left-0 right-0 z-30 h-14 bg-transparent border-t border-school-cyan/20 flex items-center overflow-hidden">
                  {/* Label: Fixed on the right */}
                  <div className="relative z-40 bg-transparent backdrop-blur-sm px-5 h-full flex items-center gap-2 border-l border-school-cyan/25 shrink-0 select-none">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] md:text-xs font-black tracking-wider text-school-cyan uppercase">מבזקי ארנס:</span>
                  </div>

                  {/* Scrolling ticker area */}
                  <div className="flex-grow overflow-hidden relative h-full flex items-center" dir="ltr">
                    <div className="animate-marquee flex items-center gap-16 py-1 whitespace-nowrap">
                      {/* First set of news */}
                      {newsArticles.map((art, i) => (
                        <button
                          key={`art1-${i}`}
                          onClick={() => setSelectedNewsArticle(art)}
                          className="flex items-center gap-3 text-right hover:text-school-cyan group transition-colors focus:outline-none cursor-pointer"
                          dir="rtl"
                        >
                          <span className="text-[11px] md:text-xs font-black text-school-text group-hover:text-school-cyan transition-colors">
                            {art.title}
                          </span>
                          <span className="text-school-cyan/40 font-bold select-none text-[11px] md:text-xs">◆</span>
                        </button>
                      ))}

                      {/* Duplicated set for infinite loop */}
                      {newsArticles.map((art, i) => (
                        <button
                          key={`art2-${i}`}
                          onClick={() => setSelectedNewsArticle(art)}
                          className="flex items-center gap-3 text-right hover:text-school-cyan group transition-colors focus:outline-none cursor-pointer"
                          dir="rtl"
                        >
                          <span className="text-[11px] md:text-xs font-black text-school-text group-hover:text-school-cyan transition-colors">
                            {art.title}
                          </span>
                          <span className="text-school-cyan/40 font-bold select-none text-[11px] md:text-xs">◆</span>
                        </button>
                      ))}

                      {/* Triplicated set if we have very few articles to prevent gap in loop */}
                      {newsArticles.length < 5 && newsArticles.map((art, i) => (
                        <button
                          key={`art3-${i}`}
                          onClick={() => setSelectedNewsArticle(art)}
                          className="flex items-center gap-3 text-right hover:text-school-cyan group transition-colors focus:outline-none cursor-pointer"
                          dir="rtl"
                        >
                          <span className="text-[11px] md:text-xs font-black text-school-text group-hover:text-school-cyan transition-colors">
                            {art.title}
                          </span>
                          <span className="text-school-cyan/40 font-bold select-none text-[11px] md:text-xs">◆</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* GRADES ACCESS SECTION */}
              <section id="grades" className="py-24 max-w-7xl mx-auto px-4 md:px-8 scroll-mt-20">
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
                  <span className="text-xs font-bold tracking-widest text-school-cyan uppercase">שש-שנתי ארנס</span>
                  <h2 className="text-3xl md:text-4xl font-black text-school-text">כניסה לשכבות</h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-school-cyan to-school-violet mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                  {OFFICIAL_GRADES.map((g) => (
                    <button
                      key={g.g}
                      onClick={() => {
                        setSelectedInternalPageUrl(g.u);
                        setActiveTab('internal-page');
                      }}
                      className="group relative overflow-hidden p-8 rounded-[20px] bg-gradient-to-b from-school-panel2 to-school-panel border border-school-line hover:border-school-cyan/50 hover:-translate-y-1.5 transition-all duration-300 text-center block w-full cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.12),transparent_70%)] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
                      <div className="text-5xl md:text-6xl font-black bg-gradient-to-b from-school-text to-school-cyan bg-clip-text text-transparent mb-4 relative z-10">
                        {g.g}
                      </div>
                      <div className="text-xs text-school-muted font-bold group-hover:text-school-cyan flex items-center justify-center gap-1 transition-colors relative z-10">
                        <span>כניסה לשכבה</span>
                        <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* HOMEPAGE MAJORS & TRACKS SECTION */}
              <section id="homepage-majors" className="py-16 border-t border-school-line/30 bg-school-panel/30">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                  <HomepageMajorsSection 
                    onExploreAll={() => {
                      setActiveTab('majors');
                      window.location.hash = 'majors';
                    }}
                    onSelectMajor={(majorId) => {
                      setSelectedMajorId(majorId);
                      setActiveTab('major-page');
                      window.location.hash = `major-${majorId}`;
                    }}
                  />
                </div>
              </section>

              {/* STAFF SECTION */}
              <section id="staff" className="py-24 border-t border-school-line/30 bg-school-bg relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,211,238,0.03),transparent_60%)] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                  
                  {/* Header */}
                  <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
                    <span className="text-xs font-bold tracking-widest text-school-cyan uppercase">צוות שש-שנתי ארנס</span>
                    <h2 className="text-3xl md:text-4xl font-black text-school-text">הסגל החינוכי והניהולי</h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-school-cyan to-school-violet mx-auto rounded-full" />
                    <p className="text-xs text-school-muted mt-2">
                      הכירו את נשות ואנשי המקצוע המובילים את הקהילה החינוכית שלנו למצוינות, ערכים וחדשנות פדגוגית.
                    </p>
                  </div>

                  {/* Staff Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {staffMembers
                      .filter(m => showAllStaffOnHomepage || m.isManagement)
                      .map((member) => (
                        <div
                          key={member.id}
                          onClick={() => setSelectedStaffForModal(member)}
                          className="group bg-gradient-to-b from-school-panel2 to-school-panel border border-school-line rounded-[20px] overflow-hidden p-6 hover:border-school-cyan/40 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center cursor-pointer relative"
                        >
                          {/* Accent dot */}
                          {member.isManagement && (
                            <span className="absolute top-4 left-4 text-[9px] font-black bg-amber-400/10 text-amber-500 border border-amber-400/20 px-2 py-0.5 rounded-full select-none">
                              הנהלה
                            </span>
                          )}

                          {/* Profile Photo or Hebrew Initials Avatar */}
                          <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-school-line/60 group-hover:border-school-cyan/50 transition-colors mb-5 shadow-inner">
                            {member.imageUrl && !member.imageUrl.includes('unsplash.com') && !member.imageUrl.includes('placeholder') ? (
                              <img 
                                src={member.imageUrl} 
                                alt={member.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${getAvatarColor(member.name).bg} flex items-center justify-center text-white select-none`}>
                                <span className={`text-2xl font-black tracking-wider ${getAvatarColor(member.name).text}`}>
                                  {getHebrewInitials(member.name)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <h3 className="text-base font-extrabold text-school-text group-hover:text-school-cyan transition-colors line-clamp-1">
                            {member.name}
                          </h3>
                          <p className="text-xs text-school-muted font-semibold mt-1 mb-3 h-8 line-clamp-2" title={member.roleDescription || member.role}>
                            {member.roleDescription || member.role}
                          </p>

                          <div className="mt-auto pt-3 border-t border-school-line/40 w-full text-[10px] text-school-cyan font-bold flex items-center justify-center gap-1 opacity-85 group-hover:opacity-100 transition-opacity">
                            <span>הצגת ביוגרפיה</span>
                            <span>←</span>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Toggle Link/Button to view rest of staff */}
                  <div className="text-center mt-12">
                    <button
                      onClick={() => setShowAllStaffOnHomepage(!showAllStaffOnHomepage)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-school-panel border border-school-line hover:border-school-cyan/50 text-xs font-bold text-school-text hover:text-school-cyan hover:shadow-lg transition-all cursor-pointer"
                    >
                      <span>{showAllStaffOnHomepage ? 'הצג חברי הנהלה בלבד' : 'לצפייה בכל אנשי הצוות'}</span>
                      <span className={`inline-block transition-transform duration-300 ${showAllStaffOnHomepage ? 'rotate-180' : ''}`}>
                        {showAllStaffOnHomepage ? '↑' : '←'}
                      </span>
                    </button>
                  </div>

                </div>
              </section>

            </motion.div>
          )}

          {/* TAB 2: ABOUT SECTION */}
          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto px-4 py-16 space-y-24 text-right"
            >
              
              {/* Introduction & Principals */}
              <div className="space-y-16">
                
                {/* School Leader Banner */}
                <div id="principal" className="bg-school-panel border border-school-line p-8 md:p-12 rounded-3xl space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.15),transparent_70%)]" />
                  <span className="text-xs font-bold text-school-cyan uppercase tracking-wider">מנהיגות השש-שנתי</span>
                  <h3 className="text-2xl md:text-3xl font-black text-school-text">דבר המנהלת - נאווה שקל ששון</h3>
                  <div className="h-px bg-school-line" />
                  <div className="text-school-muted text-sm leading-relaxed space-y-4">
                    <p className="font-bold text-school-text text-base">קהילת שש-שנתי משה ארנס היקרה,</p>
                    <p>
                      אני נרגשת לברך אתכם באתר האינטרנט החדיש של בית הספר שלנו. הקמת בית ספר חדש היא אתגר מופלא, והזדמנות חד-פעמית לעצב את עתיד החינוך כאן בפתח תקווה. בית הספר שלנו נקרא בגאווה על שמו של משה ארנס ז"ל - מדען יוצא דופן, מהנדס אווירונאוטיקה ומדינאי בעל תחושת שליחות עמוקה. ברוחו ובדמותו, אנו שואפים ליצור בית ספר שהוא שילוב הרמוני של מצוינות מדעית וטכנולוגית בלתי מתפשרת, יחד עם השקפת עולם הומניסטית, מכבדת ומאמינה באדם.
                    </p>
                    <p>
                      הצוות החינוכי המעולה שלנו נבחר בקפידה רבה, והוא מורכב מאנשי מקצוע המשלבים רמה אקדמית גבוהה עם אהבת הוראה, אכפתיות ורגישות רגשית רבה. אנו פועלים יום-יום כדי ליצור מרחבי למידה המותאמים למאה ה-21: מרחבים בהם התלמיד אינו קולט מידע פסיבי, אלא יוצר, חוקר, שואל שאלות קשות ועובד בצוותים לפתרון בעיות אמיתיות מן העולם.
                    </p>
                    <p>
                      אנו מאמינים כי חינוך מיטבי מתרחש מתוך שותפות אמיתית. הדלת של הנהלת בית הספר והצוות פתוחה תמיד בפניכם, ההורים והתלמידים, לשיח בונה, שיתוף פעולה ויוזמות פורצות דרך. יחד נצעד קדימה, נתפתח, נלמד ונוביל את שש-שנתי ארנס למצוינות ופסגות חדשות.
                    </p>
                  </div>
                </div>

                {/* Middle School Leader Banner */}
                <div id="middle-school" className="bg-school-panel border border-school-line p-8 md:p-12 rounded-3xl space-y-6">
                  <span className="text-xs font-bold text-school-cyan uppercase tracking-wider">חטיבת הביניים</span>
                  <h3 className="text-2xl md:text-3xl font-black text-school-text">דבר מנהל חטיבת הנעורים</h3>
                  <div className="h-px bg-school-line" />
                  <p className="text-school-muted text-sm leading-relaxed">
                    חטיבת הביניים היא ציר מעבר משמעותי בחיי המתבגרים. אנו מתמקדים בהקניית סביבת לימודים בטוחה, מכילה ומאפשרת, המשלבת למידה אקדמית רב-תחומית יחד עם פיתוח מיומנויות חברתיות, מנהיגות, יזמות ומחויבות הדדית. אנו פועלים כדי להעניק לכל תלמיד ותלמידה את הכלים הנדרשים לממש את מלוא הפוטנציאל הייחודי הגלום בהם.
                  </p>
                </div>

              </div>

              {/* MOSHE ARENS BIOGRAPHY BIOGRAPHY CARD */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-school-panel2 border border-school-line rounded-3xl p-8 overflow-hidden relative">
                <div className="md:col-span-4 flex justify-center">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-school-cyan/30 max-w-[240px]">
                    <img 
                      src={mosheArensBio.imageUrl} 
                      alt={mosheArensBio.name} 
                      className="w-full h-auto object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-school-bg/90 to-transparent" />
                  </div>
                </div>
                <div className="md:col-span-8 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-school-cyan uppercase">על שמו אנו נקראים</span>
                    <h3 className="text-3xl font-black text-school-text">{mosheArensBio.name}</h3>
                    <p className="text-xs text-school-violet font-bold">{mosheArensBio.lifespan} • {mosheArensBio.title}</p>
                  </div>
                  <p className="text-school-muted text-sm leading-relaxed text-justify">
                    {mosheArensBio.content}
                  </p>
                </div>
              </div>

              {/* BENTO GRID: THREE CORE PILLARS */}
              <div id="vision" className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-school-text">עמודי התווך של החזון</h3>
                  <p className="text-xs text-school-muted">הערכים המנחים את העשייה החינוכית והחברתית בשש-שנתי משה ארנס</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  <div className="bg-school-panel rounded-2xl p-6 border border-school-line text-center space-y-3">
                    <div className="w-12 h-12 bg-school-cyan/10 rounded-full flex items-center justify-center mx-auto text-school-cyan shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-school-text">מצוינות STEM וטכנולוגיה</h4>
                    <p className="text-xs text-school-muted leading-relaxed">
                      חשיפת התלמידים לתחומי המדעים המדויקים, סייבר, רובוטיקה ופיזיקה אווירונאוטית, ועידוד פתרון בעיות אמיתיות מן העולם הדיגיטלי.
                    </p>
                  </div>

                  <div className="bg-school-panel rounded-2xl p-6 border border-school-line text-center space-y-3">
                    <div className="w-12 h-12 bg-school-violet/10 rounded-full flex items-center justify-center mx-auto text-school-violet shadow-[0_0_15px_rgba(129,140,248,0.2)]">
                      <Users className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-school-text">הומניזם ורגישות חברתית</h4>
                    <p className="text-xs text-school-muted leading-relaxed">
                      טיפוח אהבת האדם, סובלנות לדעות שונות, ערכי התנדבות, מנהיגות צעירה, ומעורבות אזרחית פעילה למען תיקון ושיפור הקהילה.
                    </p>
                  </div>

                  <div className="bg-school-panel rounded-2xl p-6 border border-school-line text-center space-y-3">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                      <Lightbulb className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-school-text">חדשנות פדגוגית ומיומנויות</h4>
                    <p className="text-xs text-school-muted leading-relaxed">
                      מעבר מלמידה פסיבית לחקר עצמאי פעיל, שימוש בחדרי פודקאסט וניו-מדיה, עבודת צוות שיתופית וניהול זמנים עצמאי.
                    </p>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB: MAJORS & TRACKS DIRECT TAB */}
          {activeTab === 'majors' && (
            <motion.div
              key="majors-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto px-4 py-8 space-y-6 text-right"
            >
              <MajorsExplorer 
                onNavigateToTab={(t) => setActiveTab(t)}
                onSelectMajor={(majorId) => {
                  setSelectedMajorId(majorId);
                  setActiveTab('major-page');
                  window.location.hash = `major-${majorId}`;
                }}
                onBack={() => {
                  setActiveTab('home');
                  window.location.hash = 'home';
                }}
              />
            </motion.div>
          )}

          {/* TAB: DEDICATED MAJOR PAGE (LIKE GRADE LAYER PAGES) */}
          {activeTab === 'major-page' && selectedMajorId && (
            <motion.div
              key="major-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MajorDedicatedPage 
                majorId={selectedMajorId}
                onBack={() => {
                  setActiveTab('home');
                  window.location.hash = 'home';
                }}
                onSelectOtherMajor={(otherId) => {
                  setSelectedMajorId(otherId);
                  window.location.hash = `major-${otherId}`;
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {/* TAB 3: STEM & LEARNING SPACES */}
          {activeTab === 'spaces' && (
            <motion.div
              key="spaces"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto px-4 py-16 space-y-12 text-right"
            >
              
              <div className="text-center space-y-2 max-w-2xl mx-auto mb-12">
                <span className="text-xs font-black tracking-widest text-school-cyan uppercase">חדשנות בחזית הטכנולוגיה</span>
                <h2 className="text-3xl md:text-4xl font-black text-white">מרחבי למידה, חדשנות ו-STEM</h2>
                <p className="text-xs text-school-muted leading-relaxed">
                  שש-שנתי ארנס מצויד במרחבי למידה חדשניים המאפשרים למידה רב-תחומית, פיתוח פרויקטים מעשיים, והתנסות בטכנולוגיות מתקדמות.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {learningSpacesData.map((space) => {
                  const Icon = space.iconName === 'Cpu' ? Cpu : 
                              space.iconName === 'Wrench' ? Rocket :
                              space.iconName === 'Globe' ? Globe :
                              space.iconName === 'Palette' ? Palette :
                              space.iconName === 'Users' ? Users : Cpu;
                  return (
                    <div 
                      key={space.id}
                      className="bg-school-panel border border-school-line rounded-3xl p-8 space-y-6 flex flex-col justify-between hover:border-school-cyan/30 transition-all duration-300"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 bg-school-cyan/10 rounded-2xl flex items-center justify-center text-school-cyan shrink-0">
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-lg text-white">{space.name}</h3>
                            <p className="text-[11px] text-school-muted font-bold">רכז התחום: {space.coordinator}</p>
                          </div>
                        </div>

                        <p className="text-xs text-school-muted leading-relaxed">
                          {space.description}
                        </p>

                        <div className="space-y-1.5 pt-2">
                          <p className="text-xs font-bold text-white">נושאי לימוד והתנסות:</p>
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-school-muted">
                            {space.topics.map((topic, tIdx) => (
                              <div key={tIdx} className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-school-cyan" />
                                <span className="truncate">{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Learning Portals */}
                      <div className="border-t border-school-line pt-4 mt-6">
                        <p className="text-xs font-bold text-white mb-2">פורטלים ומערכות למידה בתחום:</p>
                        <div className="flex flex-wrap gap-2">
                          {space.resources.map((res, rIdx) => (
                            <a
                              key={rIdx}
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-school-panel2 border border-school-line text-[11px] text-school-muted hover:text-school-cyan transition-colors"
                            >
                              <span>{res.title}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          ))}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </motion.div>
          )}



          {/* TAB 5: REGULATIONS AND DISCIPLINE */}
          {activeTab === 'regulations' && (
            <motion.div
              key="regulations"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-4 py-16 space-y-12 text-right"
            >
              
              <div className="text-center space-y-2 max-w-2xl mx-auto mb-12">
                <span className="text-xs font-black tracking-widest text-school-cyan uppercase">תקנון בית הספר</span>
                <h2 className="text-3xl md:text-4xl font-black text-white">אורחות חיים וקוד התנהגות</h2>
                <p className="text-xs text-school-muted leading-relaxed">
                  תקנון בית הספר נועד להסדיר סביבה לימודית מכבדת, בטוחה ותומכת המאפשרת לכל תלמיד לפרוח. אנא הקפידו לקרוא ולשמור על הנהלים.
                </p>
              </div>

              <div className="space-y-6">
                {schoolRegulations.map((reg, rIdx) => (
                  <div key={rIdx} className="bg-school-panel border border-school-line rounded-3xl p-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-school-cyan/10 flex items-center justify-center text-school-cyan font-black text-sm">
                        {rIdx + 1}
                      </div>
                      <h3 className="font-extrabold text-lg text-white">{reg.title}</h3>
                    </div>
                    <div className="h-px bg-school-line/50" />
                    <ul className="space-y-3.5 pr-4 text-xs text-school-muted leading-relaxed list-disc marker:text-school-cyan">
                      {reg.rules.map((rule, ruleIdx) => (
                        <li key={ruleIdx}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

            </motion.div>
          )}

          {/* TAB 6: CONTACT & OFFICE */}
          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto px-4 py-16 space-y-12 text-right"
            >
              
              <div className="text-center space-y-2 max-w-2xl mx-auto mb-12">
                <span className="text-xs font-black tracking-widest text-school-cyan uppercase">מזכירות ועזרה</span>
                <h2 className="text-3xl md:text-4xl font-black text-white">צור קשר עם בית הספר</h2>
                <p className="text-xs text-school-muted leading-relaxed">
                  נשמח לעמוד לרשותכם בכל שאלה, בירור או פנייה. אנא מלאו את הטופס ונחזור אליכם בהקדם האפשרי.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Contact Form Block */}
                <div className="lg:col-span-7 bg-school-panel border border-school-line rounded-3xl p-8 space-y-6">
                  <h3 className="font-bold text-lg text-white">שליחת פנייה דיגיטלית למזכירות</h3>
                  
                  {contactSuccess ? (
                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-2 animate-fade-in">
                      <p className="font-bold text-emerald-400">הפנייה נשלחה בהצלחה!</p>
                      <p className="text-xs text-school-muted">צוות המזכירות קיבל את פנייתך ויענה בהקדם המרבי.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-white font-bold">שם מלא *</label>
                          <input 
                            type="text" 
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            placeholder="ישראל ישראלי"
                            className="w-full bg-school-panel2 border border-school-line/60 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-school-cyan transition-all text-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-white font-bold">כתובת אימייל</label>
                          <input 
                            type="email" 
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            placeholder="israel@gmail.com"
                            className="w-full bg-school-panel2 border border-school-line/60 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-school-cyan transition-all text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-white font-bold">טלפון לנייד</label>
                          <input 
                            type="tel" 
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            placeholder="050-0000000"
                            className="w-full bg-school-panel2 border border-school-line/60 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-school-cyan transition-all text-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-white font-bold">תפקיד / זיקה</label>
                          <select 
                            value={contactForm.role}
                            onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                            className="w-full bg-school-panel2 border border-school-line/60 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-school-cyan transition-all text-white"
                          >
                            <option value="parent">הורה לתלמיד/ה בבית הספר</option>
                            <option value="student">תלמיד/ה בבית הספר</option>
                            <option value="guest">אורח / מתעניין ברישום</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-white font-bold">תוכן הפנייה *</label>
                        <textarea 
                          required
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          placeholder="כיצד נוכל לעזור לך?"
                          className="w-full bg-school-panel2 border border-school-line/60 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-school-cyan transition-all text-white"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full btn py-3 rounded-xl font-bold bg-gradient-to-r from-school-cyan to-cyan-400 text-school-bg shadow-md hover:-translate-y-0.5 transition-all text-center"
                      >
                        שלח פנייה דיגיטלית
                      </button>
                    </form>
                  )}
                </div>

                {/* Map & Secretary Contacts Block */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Secretary Contacts Card */}
                  <div className="bg-school-panel border border-school-line rounded-3xl p-8 space-y-5">
                    <h3 className="font-bold text-lg text-white">מזכירות בית הספר</h3>
                    <div className="h-px bg-school-line" />
                    
                    <div className="space-y-4 text-xs text-school-muted leading-relaxed">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-school-cyan mt-0.5 shrink-0" />
                        <div>
                          <p className="font-bold text-white">כתובת בית הספר</p>
                          <p>ויצמן 46, פתח תקווה</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-school-cyan mt-0.5 shrink-0" />
                        <div>
                          <p className="font-bold text-white">טלפון מזכירות</p>
                          <p className="font-mono">03-7349373</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-school-cyan mt-0.5 shrink-0" />
                        <div>
                          <p className="font-bold text-white">פקס מזכירות</p>
                          <p className="font-mono">03-7349680</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-school-cyan mt-0.5 shrink-0" />
                        <div>
                          <p className="font-bold text-white">כתובת אימייל</p>
                          <p className="font-mono">arens2244@gmail.com</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SVG Interactive Simulated Map */}
                  <div className="bg-school-panel border border-school-line rounded-3xl p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                        <Map className="w-4 h-4 text-school-cyan" />
                        <span>מיקום שש-שנתי ארנס במפה</span>
                      </h4>
                      <span className="text-[9px] bg-school-panel2 border border-school-line text-school-muted px-2 py-0.5 rounded-md font-mono">פתח תקווה</span>
                    </div>

                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-school-panel2 border border-school-line flex items-center justify-center">
                      {/* SVG Canvas Map Pattern Grid */}
                      <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full opacity-35">
                        <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
                        <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
                        <line x1="0" y1="150" x2="400" y2="150" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
                        <line x1="100" y1="0" x2="100" y2="200" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
                        <line x1="200" y1="0" x2="200" y2="200" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
                        <line x1="300" y1="0" x2="300" y2="200" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
                        {/* Streets routes simulation */}
                        <path d="M 20,40 L 380,40" stroke="rgba(148,163,184,0.25)" strokeWidth="8" fill="none" />
                        <path d="M 200,10 L 200,190" stroke="rgba(148,163,184,0.25)" strokeWidth="8" fill="none" />
                        <path d="M 320,10 L 320,190" stroke="rgba(148,163,184,0.25)" strokeWidth="6" fill="none" />
                      </svg>

                      {/* Map pointer pin indicator */}
                      <div className="absolute top-[80px] left-[180px] flex flex-col items-center select-none">
                        <div className="relative animate-bounce">
                          <MapPin className="w-8 h-8 text-school-cyan fill-school-cyan/20 drop-shadow-[0_4px_8px_rgba(34,211,238,0.4)]" />
                        </div>
                        <div className="bg-school-bg/95 border border-school-line text-white px-3 py-1.5 rounded-lg text-[9px] font-bold text-center shadow-2xl">
                          <p>שש-שנתי ע"ש משה ארנס</p>
                          <p className="text-[8px] text-school-muted font-normal">שרגא רפאלי 6, פתח תקווה</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </motion.div>
          )}

          {/* ROLE PORTALS: STUDENTS, PARENTS, TEACHERS */}
          {(activeTab === 'students' || activeTab === 'parents' || activeTab === 'teachers') && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <RolePortalHomepage 
                role={activeTab}
                allPagesMap={allPagesMap}
                quickLinks={quickLinks}
                onRoleChange={(newRole) => {
                  setActiveTab(newRole);
                  setHomeRole(newRole);
                  window.location.hash = newRole;
                }}
                onNavigateToPage={(url) => {
                  if (url === 'contact') {
                    setActiveTab('contact');
                  } else {
                    setSelectedInternalPageUrl(url);
                    setActiveTab('internal-page');
                  }
                }}
                onNavigateToTab={(tab) => {
                  setActiveTab(tab);
                }}
              />
            </motion.div>
          )}

          {/* TEACHERS WORKSHOP REGISTRATION PORTAL */}
          {activeTab === 'teachers-events' && (
            <motion.div
              key="teachers-events"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <TeacherEventRegistration 
                initialEventId={selectedEventIdForRegistration}
                onOpenAdmin={() => {
                  setActiveTab('teachers-events-admin');
                  window.location.hash = 'teachers-events-admin';
                }}
                onBack={() => {
                  setActiveTab('home');
                  window.location.hash = 'home';
                }}
              />
            </motion.div>
          )}

          {/* TEACHERS WORKSHOPS ADMIN & GOOGLE WORKSPACE SYNC */}
          {activeTab === 'teachers-events-admin' && (
            <motion.div
              key="teachers-events-admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <TeacherEventsAdmin 
                onOpenPublicRegistration={() => {
                  setActiveTab('teachers-events');
                  window.location.hash = 'teachers-events';
                }}
                onBack={() => {
                  setActiveTab('teachers');
                  window.location.hash = 'teachers';
                }}
              />
            </motion.div>
          )}

          {/* TAB 4: INTERNAL PAGE DUPLICATOR VIEW */}
          {activeTab === 'internal-page' && selectedInternalPageUrl && selectedInternalPageUrl !== 'home-page-1' && (
            <motion.div
              key="internal-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InternalPageViewer 
                pageUrl={selectedInternalPageUrl}
                onNavigateToPage={(url) => {
                  if (url === 'contact') {
                    setActiveTab('contact');
                  } else if (url === 'home-page-1') {
                    setSelectedInternalPageUrl('home-page-1');
                    setActiveTab('home-page-1');
                    window.location.hash = 'home-page-1';
                  } else {
                    setSelectedInternalPageUrl(url);
                    setActiveTab('internal-page');
                  }
                }}
                onGoBackHome={() => {
                  setActiveTab('home');
                }}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>



      {/* --- SLEEK FUTURISTIC DARK FOOTER --- */}
      <footer className="bg-gradient-to-b from-transparent to-[#050912] border-t border-school-line/30 pt-16 pb-8 text-center relative overflow-hidden">
        
        {/* Orbs background inside footer */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[380px] h-[380px] rounded-full bg-school-cyan/5 filter blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 relative z-10">
          
          <img 
            src="https://arens.tik-tak.school/wp-content/uploads/sites/120/2024/12/cropped-לוגו-שקוף-ארנס-1.png" 
            alt="ארנס לוגו" 
            className="h-20 w-auto mx-auto drop-shadow-[0_0_15px_rgba(34,211,238,0.35)]"
          />

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">ביה"ס השש שנתי על-שם משה ארנס, פתח תקווה</h3>
            <p className="text-xs text-school-muted font-light max-w-md mx-auto leading-relaxed">
              רוח של מצוינות מדעית וטכנולוגית בלתי מתפשרת, המשתלבת בהרמוניה עם ערכי הומניזם, אהבת האדם, ועשייה קהילתית משמעותית.
            </p>
          </div>

          {/* Social media connections */}
          <div className="flex gap-4 justify-center">
            <a 
              href="https://www.facebook.com/share/14JYrtChwMX/?mibextid=wwXIfr" 
              target="_blank" 
              rel="noopener noreferrer"
              title="פייסבוק"
              className="w-11 h-11 rounded-full border border-school-line bg-school-panel hover:border-school-cyan hover:text-school-cyan flex items-center justify-center font-bold transition-all hover:-translate-y-0.5 shadow-md"
            >
              f
            </a>
            <a 
              href="https://www.instagram.com/arens_school?igsh=MWlhejF4Ymx0b2J0aw==" 
              target="_blank" 
              rel="noopener noreferrer"
              title="אינסטגרם"
              className="w-11 h-11 rounded-full border border-school-line bg-school-panel hover:border-school-cyan hover:text-school-cyan flex items-center justify-center font-bold transition-all hover:-translate-y-0.5 shadow-md"
            >
              ◎
            </a>
            <a 
              href="https://www.youtube.com/@6%D7%A9%D7%A0%D7%AA%D7%99%D7%9E%D7%A9%D7%94%D7%90%D7%A8%D7%A0%D7%A1" 
              target="_blank" 
              rel="noopener noreferrer"
              title="הפודקאסט שלנו ביוטיוב"
              className="w-11 h-11 rounded-full border border-school-line bg-school-panel hover:border-school-cyan hover:text-school-cyan flex items-center justify-center font-bold transition-all hover:-translate-y-0.5 shadow-md text-sm"
            >
              ▶
            </a>
          </div>

          <div className="h-px bg-school-line/30 max-w-xl mx-auto" />

          {/* Copyright legal stuff */}
          <div className="space-y-2 text-[11px] text-school-muted/80">
            <p className="font-medium text-white/90 flex flex-wrap justify-center items-center gap-2">
              <span>מצמיח אדם וחברה • הדגמת עיצוב מחודש — כל הזכויות שמורות לביה"ס</span>
              <span className="text-school-line/60">|</span>
              <button 
                onClick={() => setIsAdminOpen(true)}
                className="text-school-cyan hover:text-white transition-colors flex items-center gap-1 font-bold hover:underline"
              >
                <Lock className="w-3 h-3" />
                <span>כניסה לניהול מערכת (CMS)</span>
              </button>
            </p>
            <p className="font-light">שש שנתי ע"ש משה ארנס פתח תקווה © {new Date().getFullYear()}</p>
          </div>

        </div>
      </footer>

      {/* --- CMS MODAL --- */}
      {isAdminOpen && (
        <AdminPanel 
          onClose={() => setIsAdminOpen(false)} 
          onNavigateToPage={(url) => {
            setSelectedInternalPageUrl(url);
            setActiveTab('internal-page');
          }}
          activeTheme={activeTheme}
          onThemeChange={setActiveTheme}
        />
      )}

      {/* --- INVITATION TOAST --- */}
      <AnimatePresence>
        {inviteGreeting && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 p-4 bg-school-cyan/15 border border-school-cyan rounded-2xl flex items-center gap-3 shadow-2xl max-w-sm text-right text-white text-xs"
          >
            <UserCheck className="w-5 h-5 text-school-cyan shrink-0 animate-bounce" />
            <div>
              <p className="font-bold text-school-cyan">הזמנת עורכים אושרה!</p>
              <p className="text-[11px] text-school-muted mt-0.5">{inviteGreeting}</p>
            </div>
            <button onClick={() => setInviteGreeting(null)} className="text-school-muted hover:text-white mr-auto self-start">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* MODAL FOR SINGLE NEWS ARTICLE DETAILS */}
        {selectedNewsArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-school-bg/85 backdrop-blur-md"
            onClick={() => setSelectedNewsArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-[#0e1628] border border-school-cyan/25 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl text-right relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Banner */}
              <div className="relative h-64 md:h-80 w-full bg-[#0a101e] overflow-hidden">
                <img 
                  src={selectedNewsArticle.imageUrl} 
                  alt={selectedNewsArticle.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1628] via-[#0e1628]/45 to-transparent" />
                
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedNewsArticle(null)}
                  className="absolute top-4 left-4 p-2.5 rounded-full bg-black/40 border border-white/10 hover:border-school-cyan hover:text-school-cyan text-white transition-all cursor-pointer z-20 backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Tag */}
                <div className="absolute bottom-4 right-6 bg-school-cyan/15 border border-school-cyan/35 px-3 py-1 rounded-full">
                  <span className="text-[10px] md:text-xs font-black text-school-cyan uppercase tracking-wider">מבזק חדשות שוטף</span>
                </div>
              </div>

              {/* Text Area */}
              <div className="p-6 md:p-8 space-y-4">
                <h3 className="text-xl md:text-2xl font-black text-white leading-snug">
                  {selectedNewsArticle.title}
                </h3>
                
                <div className="w-12 h-0.5 bg-school-cyan rounded-full" />

                <p className="text-sm md:text-base text-school-muted leading-relaxed font-light whitespace-pre-line">
                  {selectedNewsArticle.content}
                </p>

                {/* Footer with actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-school-line/50">
                  {selectedNewsArticle.url ? (
                    <button
                      onClick={() => {
                        setSelectedInternalPageUrl(selectedNewsArticle.url!);
                        setActiveTab('internal-page');
                        setSelectedNewsArticle(null);
                      }}
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-school-cyan to-cyan-400 text-school-bg hover:-translate-y-0.5 transition-all text-xs cursor-pointer shadow-lg shadow-school-cyan/20"
                    >
                      <span>למידע נוסף והרשמה</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    onClick={() => setSelectedNewsArticle(null)}
                    className="px-5 py-2.5 border border-school-line/85 rounded-xl text-xs hover:bg-white/5 transition-all text-white cursor-pointer"
                  >
                    סגור חלונית
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* STAFF BIO MODAL POPUP */}
        {selectedStaffForModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-school-bg/85 backdrop-blur-md"
            onClick={() => setSelectedStaffForModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-[#0e1628] border border-school-cyan/25 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl text-right relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-school-cyan via-school-violet to-school-cyan" />
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedStaffForModal(null)}
                className="absolute top-4 left-4 p-2.5 rounded-full bg-black/40 border border-white/10 hover:border-school-cyan hover:text-school-cyan text-white transition-all cursor-pointer z-20 backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6 md:p-8 space-y-6">
                
                {/* Photo and Header Info */}
                <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right pt-2">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-school-cyan/50 shadow-md shrink-0 flex items-center justify-center">
                    {selectedStaffForModal.imageUrl && !selectedStaffForModal.imageUrl.includes('unsplash.com') && !selectedStaffForModal.imageUrl.includes('placeholder') ? (
                      <img 
                        src={selectedStaffForModal.imageUrl} 
                        alt={selectedStaffForModal.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${getAvatarColor(selectedStaffForModal.name).bg} flex items-center justify-center text-white select-none`}>
                        <span className={`text-3xl font-black ${getAvatarColor(selectedStaffForModal.name).text}`}>
                          {getHebrewInitials(selectedStaffForModal.name)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-white">{selectedStaffForModal.name}</h3>
                    <p className="text-xs text-school-cyan font-bold">{selectedStaffForModal.role}</p>
                    {selectedStaffForModal.roleDescription && (
                      <p className="text-[11px] text-school-muted bg-white/5 border border-school-line/50 rounded-lg px-2.5 py-1 inline-block mt-1">
                        {selectedStaffForModal.roleDescription}
                      </p>
                    )}
                    {selectedStaffForModal.email && (
                      <div className="pt-2">
                        <a 
                          href={`mailto:${selectedStaffForModal.email}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-school-cyan/10 hover:bg-school-cyan/20 border border-school-cyan/30 text-school-cyan text-xs font-semibold transition-colors"
                          title="שלח אימייל ישיר למורה"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span className="dir-ltr">{selectedStaffForModal.email}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-school-line/40 pt-4" />

                {/* Biography */}
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  <h4 className="text-xs font-bold tracking-wider text-school-muted uppercase">אודות ופילוסופיה חינוכית</h4>
                  <p className="text-xs text-white/95 leading-relaxed whitespace-pre-wrap">
                    {selectedStaffForModal.bio || `${selectedStaffForModal.name} משמש/ת בתפקיד ${selectedStaffForModal.role} בבית הספר שש-שנתי ארנס. מחויב/ת להצלחת התלמידים, טיפוח חשיבה מדעית וטכנולוגית, והקניית ערכים חברתיים ומובילות קהילתית.`}
                  </p>
                </div>

                {/* Bottom Footer Close Button */}
                <div className="border-t border-school-line/30 pt-4 mt-2 text-left shrink-0">
                  <button
                    onClick={() => setSelectedStaffForModal(null)}
                    className="px-5 py-2 border border-school-line/85 rounded-xl text-xs hover:bg-white/5 transition-all text-white cursor-pointer"
                  >
                    סגור חלונית
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
