import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Laptop,
  GraduationCap,
  KeyRound,
  Cloud,
  Wrench,
  Video,
  FileText,
  ExternalLink,
  ChevronLeft,
  Copy,
  Check,
  Sparkles,
  Phone,
  Mail,
  HelpCircle,
  X,
  Printer,
  ShieldCheck,
  Bookmark,
  Share2,
  Calendar,
  AlertCircle,
  Globe
} from 'lucide-react';
import { TikshuvGuide, TikshuvCategoryFilter, TikshuvCoordinatorContact, TikshuvQuickLink } from '../types';
import {
  subscribeToTikshuvGuides,
  subscribeToTikshuvContact,
  getStoredTikshuvGuides,
  getStoredTikshuvContact,
  getStoredTikshuvQuickLinks
} from '../services/tikshuvStorage';

interface TikshuvPortalProps {
  onNavigateToTab?: (tab: string) => void;
  onOpenAdminTikshuv?: () => void;
  isAdmin?: boolean;
}

export const TikshuvPortal: React.FC<TikshuvPortalProps> = ({
  onNavigateToTab,
  onOpenAdminTikshuv,
  isAdmin
}) => {
  const [guides, setGuides] = useState<TikshuvGuide[]>(getStoredTikshuvGuides());
  const [contact, setContact] = useState<TikshuvCoordinatorContact>(getStoredTikshuvContact());
  const [quickLinks] = useState<TikshuvQuickLink[]>(getStoredTikshuvQuickLinks());
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TikshuvCategoryFilter>('all');
  
  // Modal viewer state
  const [activeGuideModal, setActiveGuideModal] = useState<TikshuvGuide | null>(null);
  
  // Feedback copy state
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const coordinatorEmail = (contact.email && !contact.email.includes('ciznerguy.com')) 
    ? contact.email 
    : 'ciznerguy@taded.org.il';

  useEffect(() => {
    const unsubGuides = subscribeToTikshuvGuides(setGuides);
    const unsubContact = subscribeToTikshuvContact(setContact);
    return () => {
      unsubGuides();
      unsubContact();
    };
  }, []);

  const handleCopy = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const categories = [
    { id: 'all', label: 'כל המדריכים', icon: FileText, count: guides.length },
    { id: 'classroom', label: 'Google Classroom', icon: GraduationCap, count: guides.filter(g => g.category === 'classroom').length },
    { id: 'account', label: 'התחברות ומייל ארגוני', icon: KeyRound, count: guides.filter(g => g.category === 'account').length },
    { id: 'cloud', label: 'סביבות ענן וכלים', icon: Cloud, count: guides.filter(g => g.category === 'cloud').length },
    { id: 'troubleshooting', label: 'פתרון תקלות ודגשים', icon: Wrench, count: guides.filter(g => g.category === 'troubleshooting').length }
  ];

  const filteredGuides = useMemo(() => {
    return guides.filter(g => {
      // Category filter
      if (selectedCategory !== 'all' && g.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = g.title.toLowerCase().includes(q);
        const inSub = (g.subtitle || '').toLowerCase().includes(q);
        const inSummary = g.summary.toLowerCase().includes(q);
        const inTags = g.tags.some(t => t.toLowerCase().includes(q));
        const inSteps = g.steps?.some(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
        return inTitle || inSub || inSummary || inTags || inSteps;
      }
      return true;
    });
  }, [guides, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-school-bg text-white pb-24" dir="rtl">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#131f38] via-[#0d1527] to-school-bg border-b border-school-line/60 pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-school-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-80 h-80 bg-school-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb & Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-xs text-school-muted">
              <button 
                onClick={() => onNavigateToTab?.('home')}
                className="hover:text-white transition-colors"
              >
                ראשי
              </button>
              <ChevronLeft className="w-3.5 h-3.5" />
              <button 
                onClick={() => onNavigateToTab?.('teachers')}
                className="hover:text-white transition-colors"
              >
                מרחב מורים
              </button>
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="text-school-cyan font-bold">תקשוב וחדשנות דיגיטלית</span>
            </div>

            {isAdmin && onOpenAdminTikshuv && (
              <button
                onClick={onOpenAdminTikshuv}
                className="inline-flex items-center gap-2 bg-school-gold/20 hover:bg-school-gold/30 text-school-gold border border-school-gold/40 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>פאנל ניהול תקשוב</span>
              </button>
            )}
          </div>

          {/* Title Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-school-cyan/10 border border-school-cyan/30 text-school-cyan text-xs font-bold">
                <Laptop className="w-4 h-4" />
                <span>מרכז ידע, מדריכים וכלים דיגיטליים למורי ארנס</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                תקשוב וחדשנות דיגיטלית <span className="text-transparent bg-clip-text bg-gradient-to-r from-school-cyan via-blue-400 to-school-gold">לצוות ההוראה</span>
              </h1>

              <p className="text-sm sm:text-base text-school-muted leading-relaxed max-w-3xl">
                מרכז המדריכים הבית ספרי: הנחיות צעד-אחר-צעד לסביבות הענן של גוגל, כניסה בהזדהות אחידה למחוז תל אביב, פתרונות לתקלות נפוצות, וכלי עבודה דיגיטליים לשדרוג ההוראה והלמידה.
              </p>

              {/* Quick Entry Buttons */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                <a
                  href="https://classroom.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-school-cyan text-[#0a1122] font-black text-xs hover:bg-cyan-300 transition-all shadow-md shadow-school-cyan/20"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>כניסה ל-Classroom</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <button
                  onClick={() => {
                    const el = guides.find(g => g.id === 'guide-google-login-arens');
                    if (el) setActiveGuideModal(el);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs transition-all"
                >
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>מדריך התחברות למייל הארגוני (Google)</span>
                </button>

                <a
                  href="https://sites.google.com/view/tad-tikshuv/%D7%93%D7%A3-%D7%94%D7%91%D7%99%D7%AA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-school-muted hover:text-white border border-school-line text-xs font-semibold transition-all"
                >
                  <Globe className="w-4 h-4 text-pink-400" />
                  <span>פורטל תקשוב מחוז ת"א</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            </div>

            {/* Coordinator Card */}
            <div className="lg:col-span-4 bg-gradient-to-br from-[#162340] to-[#0f182c] border border-school-cyan/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-school-cyan/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-xl bg-school-cyan/20 border border-school-cyan/40 flex items-center justify-center text-school-cyan font-black text-lg">
                  ג״צ
                </div>
                <div>
                  <div className="text-[11px] font-bold text-school-cyan uppercase tracking-wider">רכז התקשוב הבית-ספרי</div>
                  <div className="text-base font-black text-white">{contact.name}</div>
                  <div className="text-xs text-school-muted">{contact.title}</div>
                </div>
              </div>

              <p className="text-xs text-school-muted/90 leading-relaxed mb-4 bg-black/20 p-3 rounded-xl border border-white/5">
                "{contact.supportMessage}"
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-school-muted bg-white/5 px-3 py-2 rounded-lg">
                  <span className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-school-cyan" />
                    <span>מייל רכז תקשוב:</span>
                  </span>
                  <button 
                    onClick={() => handleCopy(coordinatorEmail)}
                    className="font-mono text-school-cyan hover:underline flex items-center gap-1 font-semibold"
                    title="לחצו להעתקה"
                  >
                    <span>{coordinatorEmail}</span>
                    {copiedText === coordinatorEmail ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-school-muted" />
                    )}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-school-muted bg-white/5 px-3 py-2 rounded-lg gap-2">
                  <span className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>מוקד תמיכה משרד החינוך:</span>
                  </span>
                  <div className="flex items-center gap-2 font-mono text-amber-300 font-bold self-end sm:self-auto">
                    <button 
                      onClick={() => handleCopy('*6552')}
                      className="hover:underline flex items-center gap-1 bg-amber-400/10 hover:bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30 transition-colors"
                      title="לחצו להעתקת 6552*"
                    >
                      <span>*6552</span>
                      {copiedText === '*6552' ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-school-muted" />
                      )}
                    </button>
                    <span className="text-white/40 text-xs">או</span>
                    <button 
                      onClick={() => handleCopy('073-3983960')}
                      className="hover:underline flex items-center gap-1 bg-amber-400/10 hover:bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30 transition-colors"
                      title="לחצו להעתקת 073-3983960"
                    >
                      <span>073-3983960</span>
                      {copiedText === '073-3983960' ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-school-muted" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Search & Topic Filter Bar (Required by User) */}
        <div className="bg-[#121c33] border border-school-line/80 rounded-2xl p-4 sm:p-5 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-school-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חיפוש מדריך, נושא או מילת מפתח (לדוגמה: קלאסרום, הזדהות אחידה, סיסמה, Meet)..."
                className="w-full bg-school-bg/90 border border-school-line/70 focus:border-school-cyan rounded-xl py-2.5 pr-11 pl-10 text-sm text-white placeholder-school-muted/70 focus:outline-none focus:ring-1 focus:ring-school-cyan transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-school-muted hover:text-white"
                  title="נקה חיפוש"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className="text-xs text-school-muted font-bold whitespace-nowrap self-end md:self-center">
              נמצאו <span className="text-school-cyan font-mono text-sm">{filteredGuides.length}</span> מדריכים
            </div>
          </div>

          {/* Topic Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-3 border-t border-school-line/40 no-scrollbar">
            <span className="text-xs text-school-muted font-bold ml-1 whitespace-nowrap">סינון לפי נושא:</span>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as TikshuvCategoryFilter)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-school-cyan text-[#0a1122] shadow-sm font-black'
                      : 'bg-school-bg hover:bg-white/5 text-school-muted hover:text-white border border-school-line/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-[#0a1122]/20 text-[#0a1122]' : 'bg-white/10 text-school-muted'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Guide Banner (User's attached PDF guide) */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="mb-10 bg-gradient-to-r from-blue-950/60 via-[#101c38] to-[#122347] border-2 border-school-cyan/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-school-cyan/20 to-transparent w-72 h-full pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 bg-school-cyan/20 border border-school-cyan/40 text-school-cyan px-3 py-1 rounded-full text-xs font-black">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>מדריך רשמי מומלץ למורי תיכון ארנס ומחוז תל אביב</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  מדריך להתחברות למייל הארגוני (Google) - שלוש שיטות ופתרון תקלות
                </h2>
                <p className="text-sm text-school-muted leading-relaxed">
                  הנחיות מלאות להתחברות קלה לסביבות הענן של גוגל באמצעות הכתובת הגנרית <span className="text-school-cyan font-mono font-bold bg-school-cyan/10 px-1.5 py-0.5 rounded">a@taded.org.il</span>, פורטל התקשוב המחוזי, ופתרון בעיות הרשאה עם חשבון Gmail פרטי.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-xs">
                  <span className="bg-white/5 border border-white/10 text-school-muted px-2.5 py-1 rounded-lg">שיטה 1: התחברות מהירה (מומלץ)</span>
                  <span className="bg-white/5 border border-white/10 text-school-muted px-2.5 py-1 rounded-lg">שיטה 2: פורטל התקשוב המחוזי</span>
                  <span className="bg-white/5 border border-white/10 text-school-muted px-2.5 py-1 rounded-lg">שיטה 3: כתובת מייל אישית</span>
                  <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2.5 py-1 rounded-lg">גלישה בסתר / פרופיל כרום</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
                <button
                  onClick={() => {
                    const g = guides.find(x => x.id === 'guide-google-login-arens');
                    if (g) setActiveGuideModal(g);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-school-cyan to-blue-400 text-[#0a1122] font-black text-sm hover:opacity-95 transition-all shadow-lg shadow-school-cyan/20 whitespace-nowrap"
                >
                  <span>קרא את המדריך המלא</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => handleCopy('a@taded.org.il', e)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-bold transition-all"
                  title="העתק כתובת גנרית"
                >
                  <Copy className="w-3.5 h-3.5 text-school-cyan" />
                  <span>העתק כתובת גנרית: a@taded.org.il</span>
                  {copiedText === 'a@taded.org.il' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => {
            const isLoginGuide = guide.id === 'guide-google-login-arens';
            return (
              <div
                key={guide.id}
                onClick={() => setActiveGuideModal(guide)}
                className={`group cursor-pointer rounded-2xl border transition-all duration-300 flex flex-col justify-between p-6 ${
                  isLoginGuide
                    ? 'bg-gradient-to-br from-[#121f3a] to-[#0d1628] border-school-cyan/50 hover:border-school-cyan shadow-lg shadow-school-cyan/10'
                    : 'bg-[#111a2f] border-school-line/80 hover:border-school-cyan/50 hover:bg-[#131e36] shadow-sm'
                }`}
              >
                <div>
                  {/* Card Header Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      guide.category === 'classroom'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : guide.category === 'account'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : guide.category === 'troubleshooting'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-school-cyan/10 text-school-cyan border-school-cyan/20'
                    }`}>
                      {guide.category === 'classroom' && 'Google Classroom'}
                      {guide.category === 'account' && 'התחברות ומייל'}
                      {guide.category === 'troubleshooting' && 'פתרון תקלות'}
                      {guide.category === 'cloud' && 'סביבות ענן'}
                      {guide.category === 'ai' && 'בינה מלאכותית'}
                    </span>

                    {guide.isPinned && (
                      <span className="text-[10px] bg-school-gold/20 text-school-gold border border-school-gold/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>מומלץ</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-bold text-white group-hover:text-school-cyan transition-colors mb-1.5 leading-snug">
                    {guide.title}
                  </h3>
                  {guide.subtitle && (
                    <div className="text-xs text-school-muted/80 font-medium mb-3">
                      {guide.subtitle}
                    </div>
                  )}

                  {/* Summary */}
                  <p className="text-xs text-school-muted leading-relaxed line-clamp-3 mb-4">
                    {guide.summary}
                  </p>
                </div>

                <div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {guide.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-school-bg/80 text-school-muted px-2 py-0.5 rounded-md border border-school-line/60">
                        #{tag}
                      </span>
                    ))}
                    {guide.tags.length > 3 && (
                      <span className="text-[10px] text-school-muted/70 self-center">
                        +{guide.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-school-line/50 flex items-center justify-between text-xs">
                    <span className="text-school-muted text-[11px]">
                      {guide.steps ? `${guide.steps.length} שלבים` : 'מדריך מקוון'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-school-cyan font-bold group-hover:translate-x-[-3px] transition-transform">
                      <span>קרא מדריך</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredGuides.length === 0 && (
          <div className="text-center py-16 bg-[#111a2f] border border-school-line rounded-2xl p-8">
            <HelpCircle className="w-12 h-12 text-school-muted mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">לא נמצאו מדריכים התואמים לחיפוש</h3>
            <p className="text-xs text-school-muted mb-4">נסו לשנות את מילת החיפוש או לאפס את סינון הנושאים</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-4 py-2 rounded-xl bg-school-cyan/20 text-school-cyan border border-school-cyan/30 text-xs font-bold hover:bg-school-cyan/30 transition-all"
            >
              הצג את כל המדריכים
            </button>
          </div>
        )}

        {/* Quick Links Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">קישורים מהירים ומשאבים חיצוניים</h2>
              <p className="text-xs text-school-muted">מעבר מהיר למערכות ההוראה וסביבות הענן של משרד החינוך</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#111b31] border border-school-line/80 hover:border-school-cyan/50 hover:bg-[#14213d] rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-school-cyan/15 text-school-cyan flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Laptop className="w-4 h-4" />
                    </div>
                    {link.badge && (
                      <span className="text-[10px] font-bold bg-white/5 text-school-muted border border-white/10 px-2 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-school-cyan transition-colors mb-1">
                    {link.title}
                  </h4>
                  <p className="text-xs text-school-muted leading-relaxed line-clamp-2">
                    {link.description}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-school-line/40 flex items-center justify-between text-[11px] text-school-cyan font-bold">
                  <span>כניסה למערכת</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-[-2px] transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Full Guide Modal Reader */}
      {activeGuideModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setActiveGuideModal(null)}
        >
          <div 
            className="bg-[#0f172a] border border-school-line rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#14213d] to-[#0f172a] border-b border-school-line/70 p-5 sm:p-6 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-school-cyan/20 text-school-cyan border border-school-cyan/30 px-2.5 py-0.5 rounded-full font-bold">
                    {activeGuideModal.category === 'classroom' && 'Google Classroom'}
                    {activeGuideModal.category === 'account' && 'התחברות ומייל ארגוני'}
                    {activeGuideModal.category === 'troubleshooting' && 'פתרון תקלות'}
                    {activeGuideModal.category === 'cloud' && 'סביבות ענן'}
                    {activeGuideModal.category === 'ai' && 'בינה מלאכותית'}
                  </span>
                  {activeGuideModal.author && (
                    <span className="text-[11px] text-school-muted">מאת: {activeGuideModal.author}</span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">{activeGuideModal.title}</h2>
                {activeGuideModal.subtitle && (
                  <p className="text-xs sm:text-sm text-school-muted">{activeGuideModal.subtitle}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 text-school-muted hover:text-white hover:bg-white/10 rounded-xl transition-all"
                  title="הדפסה"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveGuideModal(null)}
                  className="p-2 text-school-muted hover:text-white hover:bg-white/10 rounded-xl transition-all"
                  title="סגירה"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-sm text-white/90 leading-relaxed print:p-0">
              {/* Introduction / Summary */}
              {activeGuideModal.detailedContent && activeGuideModal.detailedContent.length > 0 ? (
                <div className="space-y-2 bg-[#142038]/60 p-4 rounded-2xl border border-school-cyan/20 text-sm">
                  {activeGuideModal.detailedContent.map((paragraph, idx) => (
                    <p key={idx} className="text-school-muted/95 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              ) : (
                <div className="bg-[#142038]/60 p-4 rounded-2xl border border-school-line text-sm text-school-muted">
                  {activeGuideModal.summary}
                </div>
              )}

              {/* Key Details Table (if any) */}
              {activeGuideModal.keyDetailsTable && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-school-cyan uppercase tracking-wider">
                    ריכוז פרטי התחברות וקישורים
                  </h4>
                  <div className="overflow-x-auto rounded-2xl border border-school-line bg-school-bg">
                    <table className="w-full text-xs text-right">
                      <thead className="bg-[#14223d] text-school-muted border-b border-school-line font-bold">
                        <tr>
                          <th className="p-3">נושא / סביבה</th>
                          <th className="p-3">פרטים וכתובת</th>
                          <th className="p-3 text-left">פעולה</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-school-line/40">
                        {activeGuideModal.keyDetailsTable.map((row, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 font-semibold text-white">{row.label}</td>
                            <td className="p-3 font-mono text-school-cyan dir-ltr text-right">{row.value}</td>
                            <td className="p-3 text-left">
                              {row.copyable && (
                                <button
                                  onClick={() => handleCopy(row.value)}
                                  className="inline-flex items-center gap-1 bg-school-cyan/15 hover:bg-school-cyan/25 text-school-cyan px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
                                >
                                  {copiedText === row.value ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span>הועתק</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>העתק</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Step by Step Instructions */}
              {activeGuideModal.steps && activeGuideModal.steps.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-school-cyan uppercase tracking-wider">
                    שלבי ביצוע מפורטים
                  </h4>
                  <div className="space-y-4">
                    {activeGuideModal.steps.map((step) => (
                      <div 
                        key={step.stepNumber}
                        className="bg-[#121c32] border border-school-line/80 rounded-2xl p-4 sm:p-5 space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-xl bg-school-cyan text-[#0a1122] font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            {step.stepNumber}
                          </span>
                          <div className="space-y-1 flex-1">
                            <h5 className="text-base font-bold text-white">{step.title}</h5>
                            <p className="text-xs text-school-muted leading-relaxed">{step.description}</p>
                          </div>
                        </div>

                        {step.subSteps && (
                          <div className="mr-10 space-y-1.5 pt-1">
                            {step.subSteps.map((sub, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-2 text-xs text-white/90">
                                <span className="text-school-cyan font-bold">•</span>
                                <span>{sub}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {step.codeSnippet && (
                          <div className="mr-10 flex items-center justify-between bg-black/40 border border-school-cyan/30 rounded-xl px-4 py-2 font-mono text-xs text-school-cyan dir-ltr">
                            <span>{step.codeSnippet}</span>
                            <button
                              onClick={() => handleCopy(step.codeSnippet!)}
                              className="inline-flex items-center gap-1 text-[11px] text-white hover:text-school-cyan bg-white/10 hover:bg-white/15 px-2 py-1 rounded-lg transition-all"
                            >
                              {copiedText === step.codeSnippet ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span>העתק</span>
                            </button>
                          </div>
                        )}

                        {step.tip && (
                          <div className="mr-10 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs p-3 rounded-xl flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{step.tip}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Troubleshooting / FAQ Section */}
              {activeGuideModal.faq && activeGuideModal.faq.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    <span>פתרון תקלות ודגשים חשובים</span>
                  </h4>
                  <div className="space-y-3">
                    {activeGuideModal.faq.map((item, fIdx) => (
                      <div key={fIdx} className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-4 space-y-1.5">
                        <div className="font-bold text-rose-300 text-xs flex items-center gap-2">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{item.q}</span>
                        </div>
                        <p className="text-xs text-school-muted/95 leading-relaxed mr-5">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* External Video or Link */}
              {activeGuideModal.externalUrl && (
                <div className="pt-2">
                  <a
                    href={activeGuideModal.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-school-cyan text-[#0a1122] font-black text-xs hover:bg-cyan-300 transition-all shadow-md"
                  >
                    <span>מעבר למשאב המלא באתר החיצוני</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-[#121c32] border-t border-school-line/60 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-school-muted">
                זקוקים לסיוע נוסף? פנו לרכז התקשוב: <strong className="text-white">{contact.name}</strong> ({coordinatorEmail})
              </div>
              <button
                onClick={() => setActiveGuideModal(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold transition-all"
              >
                סגור מדריך
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TikshuvPortal;
