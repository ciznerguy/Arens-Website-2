import { QuickLink } from '../types';

export const DEFAULT_QUICK_LINKS: QuickLink[] = [
  {
    id: 'ql-students-mashov',
    title: 'משוב תלמידים',
    url: 'https://web.mashov.info/students/login',
    iconName: 'UserCheck',
    badge: 'חובה',
    category: 'מערכות למידה',
    audience: 'תלמידים',
    showInMenu: true
  },
  {
    id: 'ql-parents-mashov',
    title: 'משוב הורים',
    url: 'https://web.mashov.info/parents/login',
    iconName: 'UserCheck',
    badge: 'משוב',
    category: 'מערכות למידה',
    audience: 'הורים',
    showInMenu: true
  },
  {
    id: 'ql-teachers-mashov',
    title: 'משוב עובדי הוראה',
    url: 'https://web.mashov.info/',
    iconName: 'UserCheck',
    badge: 'סגל',
    category: 'מערכות למידה',
    audience: 'מורים',
    showInMenu: true
  },
  {
    id: 'ql-students-graduates-portal',
    title: 'פורטל תלמידים ובוגרים',
    url: 'https://students.education.gov.il/',
    iconName: 'GraduationCap',
    category: 'משרד החינוך',
    audience: 'תלמידים',
    showInMenu: true
  },
  {
    id: 'ql-parents-portal',
    title: 'פורטל הורים',
    url: 'https://parents.education.gov.il/',
    iconName: 'CreditCard',
    category: 'שירותים',
    audience: 'הורים',
    showInMenu: true
  },
  {
    id: 'ql-teachers-portal',
    title: 'פורטל עובדי הוראה',
    url: 'https://pob.education.gov.il/',
    iconName: 'Users',
    category: 'משרד החינוך',
    audience: 'מורים',
    showInMenu: true
  },
  {
    id: 'ql-classroom-students',
    title: 'Google Classroom',
    url: 'https://classroom.google.com/',
    iconName: 'Chrome',
    category: 'מערכות למידה',
    audience: 'תלמידים',
    showInMenu: true
  },
  {
    id: 'ql-classroom-teachers',
    title: 'Google Classroom למורים',
    url: 'https://classroom.google.com/',
    iconName: 'Chrome',
    category: 'מערכות למידה',
    audience: 'מורים',
    showInMenu: true
  }
];

export function getQuickLinks(): QuickLink[] {
  if (typeof window === 'undefined') return DEFAULT_QUICK_LINKS;
  try {
    const saved = localStorage.getItem('quick_links_overrides');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading quick links', e);
  }
  return DEFAULT_QUICK_LINKS;
}

export function saveAllQuickLinks(links: QuickLink[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('quick_links_overrides', JSON.stringify(links));
    window.dispatchEvent(new Event('quick_links_updated'));
  } catch (e) {
    console.error('Error saving quick links', e);
  }
}

export function saveQuickLink(link: QuickLink) {
  const current = getQuickLinks();
  const index = current.findIndex(l => l.id === link.id);
  let updated: QuickLink[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = link;
  } else {
    updated = [link, ...current];
  }
  saveAllQuickLinks(updated);
}

export function deleteQuickLink(id: string) {
  const current = getQuickLinks();
  const updated = current.filter(l => l.id !== id);
  saveAllQuickLinks(updated);
}
