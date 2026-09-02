import React, { useState, useEffect } from 'react';
import { Share2, Check } from 'lucide-react';
import { getStoredMajors } from '../services/majorsStorage';
import { getAllPagesMap } from '../data/internalPages';

interface FloatingWhatsAppShareProps {
  activeTab: string;
  selectedInternalPageUrl: string | null;
  selectedMajorId: string | null;
}

export default function FloatingWhatsAppShare({
  activeTab,
  selectedInternalPageUrl,
  selectedMajorId
}: FloatingWhatsAppShareProps) {
  const [copied, setCopied] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Determine if we are on the home page view
  const hash = currentHash.replace(/^#/, '');
  const isHomePage =
    (!hash || hash === 'home') &&
    (activeTab === 'home' || !activeTab) &&
    !selectedInternalPageUrl &&
    !selectedMajorId;

  // Do not render on the main homepage
  if (isHomePage) {
    return null;
  }

  // Helper to determine accurate page title
  const getPageTitle = (): string => {
    const majors = getStoredMajors();
    if (selectedMajorId) {
      const major = majors.find(m => m.id === selectedMajorId);
      if (major) return `מגמת ${major.title}`;
    }

    if (activeTab === 'major-page' && selectedMajorId) {
      const major = majors.find(m => m.id === selectedMajorId);
      if (major) return `מגמת ${major.title}`;
    }

    if (selectedInternalPageUrl) {
      const cleanUrl = selectedInternalPageUrl.replace(/^course\//, '').replace(/^#/, '');
      const pagesMap = getAllPagesMap();
      if (pagesMap[cleanUrl]) {
        return pagesMap[cleanUrl].title;
      }
      if (pagesMap[selectedInternalPageUrl]) {
        return pagesMap[selectedInternalPageUrl].title;
      }
    }

    switch (activeTab) {
      case 'majors':
        return 'מגמות ומסלולי לימוד';
      case 'newsletter':
        return 'מידעון בית ספרי';
      case 'teachers-events':
      case 'teachers-events-admin':
        return 'סדנאות והרשמה - חדר מורים';
      case 'students':
        return 'פורטל תלמידים';
      case 'parents':
        return 'פורטל הורים';
      case 'teachers':
        return 'פורטל מורים וצוות';
      case 'contact':
        return 'צור קשר';
      case 'home-page-1':
        return 'דף תוכן בית ספרי';
      default:
        return 'בית ספר שש-שנתי משה ארנס';
    }
  };

  const getShareUrl = (): string => {
    const base = 'https://arens.org.il';
    
    if (selectedMajorId) {
      return `${base}/#major-${selectedMajorId}`;
    }
    if (selectedInternalPageUrl) {
      const clean = selectedInternalPageUrl.replace(/^#/, '');
      return `${base}/#${clean}`;
    }
    if (activeTab && activeTab !== 'home' && activeTab !== 'internal-page') {
      return `${base}/#${activeTab}`;
    }
    if (window.location.hash) {
      return `${base}/${window.location.hash}`;
    }
    return base;
  };

  const pageTitle = getPageTitle();

  const handleShareWhatsApp = () => {
    const url = getShareUrl();
    const text = `שלום, מצרף קישור לצפייה ב"${pageTitle}" - בית ספר שש-שנתי משה ארנס:\n${url}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    
    // Copy to clipboard as fallback feedback
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <aside 
      aria-label="שיתוף עמוד בוואטסאפ"
      className="fixed bottom-6 left-6 z-[9999] flex items-center group pointer-events-auto"
      id="floating-whatsapp-share-container"
    >
      <button
        id="floating-whatsapp-share-btn"
        onClick={handleShareWhatsApp}
        type="button"
        aria-label={`שתף עמוד זה בוואטסאפ (${pageTitle})`}
        title={`שתף עמוד זה בוואטסאפ (${pageTitle})`}
        className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-2xl shadow-emerald-950/70 border-2 border-emerald-400/50 hover:scale-105 transition-all duration-200 cursor-pointer font-bold text-xs"
      >
        {/* WhatsApp Icon SVG */}
        <svg 
          className="w-5 h-5 fill-current shrink-0" 
          viewBox="0 0 24 24" 
          aria-hidden="true"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>

        <span className="hidden sm:inline">שתף בוואטסאפ</span>
        {copied && (
          <span className="flex items-center gap-1 text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded-full text-emerald-200">
            <Check className="w-3 h-3" />
            הועתק
          </span>
        )}
      </button>
    </aside>
  );
}
