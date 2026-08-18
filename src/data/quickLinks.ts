import { QuickLink } from '../types';

export const DEFAULT_QUICK_LINKS: QuickLink[] = [
  {
    id: 'ql-1',
    title: 'מערכת משוב (Mashov)',
    url: 'https://web.mashov.info/',
    iconName: 'UserCheck',
    badge: 'חובה',
    category: 'מערכות למידה',
    audience: 'כללי',
    showInMenu: true
  },
  {
    id: 'ql-2',
    title: 'פורטל תלמידים והורים משרד החינוך',
    url: 'https://students.education.gov.il/',
    iconName: 'GraduationCap',
    category: 'משרד החינוך',
    audience: 'תלמידים',
    showInMenu: true
  },
  {
    id: 'ql-3',
    title: 'אופק (סנונית)',
    url: 'https://ofek.snunit.k12.il/',
    iconName: 'Compass',
    category: 'מערכות למידה',
    audience: 'תלמידים',
    showInMenu: true
  },
  {
    id: 'ql-4',
    title: 'Google Classroom',
    url: 'https://classroom.google.com/',
    iconName: 'Chrome',
    category: 'מערכות למידה',
    audience: 'כללי',
    showInMenu: true
  },
  {
    id: 'ql-5',
    title: 'ספרייה דיגיטלית כותר',
    url: 'https://www.kotar.co.il/',
    iconName: 'BookOpen',
    category: 'מערכות למידה',
    audience: 'תלמידים',
    showInMenu: true
  },
  {
    id: 'ql-6',
    title: 'תשלומים בית-ספריים (פורטל הורים)',
    url: 'https://parents.education.gov.il/',
    iconName: 'CreditCard',
    category: 'שירותים',
    audience: 'הורים',
    showInMenu: true
  },
  {
    id: 'ql-7',
    title: 'פורטל עובדי הוראה (מורים)',
    url: 'https://pob.education.gov.il/',
    iconName: 'Users',
    category: 'מורים',
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
