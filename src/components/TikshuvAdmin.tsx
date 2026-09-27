import React, { useState, useEffect } from 'react';
import {
  Laptop,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Check,
  X,
  GraduationCap,
  KeyRound,
  Wrench,
  Search,
  AlertCircle,
  FileText,
  Mail,
  Phone,
  Bookmark
} from 'lucide-react';
import { TikshuvGuide, TikshuvCoordinatorContact, TikshuvStep, TikshuvCategory, TikshuvType } from '../types';
import {
  subscribeToTikshuvGuides,
  subscribeToTikshuvContact,
  saveTikshuvGuide,
  deleteTikshuvGuide,
  saveTikshuvContact,
  resetTikshuvGuidesToDefault,
  getStoredTikshuvGuides,
  getStoredTikshuvContact
} from '../services/tikshuvStorage';

interface TikshuvAdminProps {
  currentUserEmail?: string;
  currentUserName?: string;
  onPreviewPortal?: () => void;
}

export const TikshuvAdmin: React.FC<TikshuvAdminProps> = ({
  currentUserEmail,
  currentUserName,
  onPreviewPortal
}) => {
  const [guides, setGuides] = useState<TikshuvGuide[]>(getStoredTikshuvGuides());
  const [contact, setContact] = useState<TikshuvCoordinatorContact>(getStoredTikshuvContact());
  const [searchFilter, setSearchFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'guides' | 'contact'>('guides');

  // Editing Guide State
  const [isEditingGuide, setIsEditingGuide] = useState(false);
  const [editingGuide, setEditingGuide] = useState<Partial<TikshuvGuide>>({});
  const [steps, setSteps] = useState<TikshuvStep[]>([]);
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Editing Contact State
  const [contactForm, setContactForm] = useState<TikshuvCoordinatorContact>(contact);

  useEffect(() => {
    const unsubGuides = subscribeToTikshuvGuides(setGuides);
    const unsubContact = subscribeToTikshuvContact((c) => {
      const sanitized = {
        ...c,
        email: (c.email && !c.email.includes('ciznerguy.com')) ? c.email : 'ciznerguy@taded.org.il'
      };
      setContact(sanitized);
      setContactForm(sanitized);
    });
    return () => {
      unsubGuides();
      unsubContact();
    };
  }, []);

  const handleStartAddGuide = () => {
    setEditingGuide({
      id: `guide-${Date.now()}`,
      title: '',
      subtitle: '',
      category: 'classroom',
      type: 'guide',
      summary: '',
      detailedContent: [],
      isPinned: false,
      author: currentUserName || 'גיא ציזנר - רכז תקשוב',
      externalUrl: '',
      updatedAt: new Date().toISOString().split('T')[0]
    });
    setSteps([]);
    setFaqs([]);
    setTagsInput('Google Classroom, מורים');
    setIsEditingGuide(true);
  };

  const handleStartEditGuide = (guide: TikshuvGuide) => {
    setEditingGuide({ ...guide });
    setSteps(guide.steps ? [...guide.steps] : []);
    setFaqs(guide.faq ? [...guide.faq] : []);
    setTagsInput((guide.tags || []).join(', '));
    setIsEditingGuide(true);
  };

  const handleAddStep = () => {
    const newStepNum = steps.length + 1;
    setSteps([
      ...steps,
      {
        stepNumber: newStepNum,
        title: `שלב ${newStepNum}: `,
        description: '',
        tip: '',
        codeSnippet: ''
      }
    ]);
  };

  const handleRemoveStep = (idx: number) => {
    const updated = steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, stepNumber: i + 1 }));
    setSteps(updated);
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { q: '', a: '' }]);
  };

  const handleRemoveFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const handleSaveGuide = async () => {
    if (!editingGuide.title?.trim() || !editingGuide.summary?.trim()) {
      alert('נא להזין כותרת ותקציר למדריך');
      return;
    }

    const processedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const fullGuide: TikshuvGuide = {
      id: editingGuide.id || `guide-${Date.now()}`,
      title: editingGuide.title.trim(),
      subtitle: editingGuide.subtitle?.trim() || undefined,
      category: (editingGuide.category as TikshuvCategory) || 'classroom',
      type: (editingGuide.type as TikshuvType) || 'guide',
      summary: editingGuide.summary.trim(),
      detailedContent: editingGuide.detailedContent || [],
      steps: steps.length > 0 ? steps : undefined,
      faq: faqs.length > 0 ? faqs : undefined,
      tags: processedTags.length > 0 ? processedTags : ['תקשוב'],
      isPinned: !!editingGuide.isPinned,
      author: editingGuide.author || 'רכז תקשוב',
      externalUrl: editingGuide.externalUrl?.trim() || undefined,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    await saveTikshuvGuide(fullGuide);
    setIsEditingGuide(false);
    setSaveSuccessMsg('המדריך נשמר בהצלחה וסונכרן למערכת!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleDeleteGuide = async (id: string, title: string) => {
    if (confirm(`האם אתה בטוח שברצונך למחוק את המדריך: "${title}"?`)) {
      await deleteTikshuvGuide(id);
    }
  };

  const handleSaveContact = async () => {
    await saveTikshuvContact(contactForm);
    setSaveSuccessMsg('פרטי רכז התקשוב עודכנו בהצלחה!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleResetDefaults = async () => {
    if (confirm('פעולה זו תשחזר את כל מדריכי ברירת המחדל (כולל מדריך ההתחברות המחוזי של תיכון ארנס ומדריכי Google Classroom). להמשיך?')) {
      await resetTikshuvGuidesToDefault();
      setSaveSuccessMsg('המדריכים שוחזרו לברירת המחדל בהצלחה!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  const filteredGuides = guides.filter((g) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      g.title.toLowerCase().includes(q) ||
      g.summary.toLowerCase().includes(q) ||
      (g.subtitle && g.subtitle.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 text-white text-right" dir="rtl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#142345] via-[#101b33] to-[#0c1424] border border-school-cyan/40 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-school-cyan/20 text-school-cyan border border-school-cyan/30 px-3 py-0.5 rounded-full text-xs font-bold">
              <Laptop className="w-3.5 h-3.5" />
              <span>אזור מורשה: רכז תקשוב וחדשנות דיגיטלית</span>
            </div>
            <h2 className="text-2xl font-black text-white">ניהול מרחב תקשוב, הדרכות וכלי עבודה למורים</h2>
            <p className="text-xs text-school-muted">
              מחובר: <span className="text-school-cyan font-bold">{currentUserName || 'גיא ציזנר'}</span> ({currentUserEmail || 'ciznerguy@taded.org.il'})
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {onPreviewPortal && (
              <button
                onClick={onPreviewPortal}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-bold transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5 text-school-cyan" />
                <span>צפייה בדף המורים</span>
              </button>
            )}

            <button
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-school-muted hover:text-white border border-school-line text-xs font-medium transition-all"
              title="שחזור מדריכי ברירת מחדל"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>שחזור ברירת מחדל</span>
            </button>
          </div>
        </div>

        {saveSuccessMsg && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-school-line/60 pb-3">
        <button
          onClick={() => { setActiveTab('guides'); setIsEditingGuide(false); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'guides'
              ? 'bg-school-cyan text-[#0a1122]'
              : 'bg-school-bg hover:bg-white/5 text-school-muted hover:text-white border border-school-line/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>מדריכים והנחיות ({guides.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('contact'); setIsEditingGuide(false); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'contact'
              ? 'bg-school-cyan text-[#0a1122]'
              : 'bg-school-bg hover:bg-white/5 text-school-muted hover:text-white border border-school-line/60'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>פרטי רכז התקשוב והודעה לצוות</span>
        </button>
      </div>

      {/* Guides Tab Content */}
      {activeTab === 'guides' && !isEditingGuide && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#111a2e] border border-school-line/80 p-4 rounded-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-school-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="חיפוש מדריך לניהול..."
                className="w-full bg-school-bg border border-school-line focus:border-school-cyan rounded-xl py-2 pr-10 pl-4 text-xs text-white placeholder-school-muted/60 focus:outline-none"
              />
            </div>

            <button
              onClick={handleStartAddGuide}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-school-cyan hover:bg-cyan-300 text-[#0a1122] font-black text-xs transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>הוסף מדריך חדש</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                className="bg-[#121c32] border border-school-line/80 hover:border-school-cyan/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      guide.category === 'classroom'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : guide.category === 'account'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-school-cyan/20 text-school-cyan'
                    }`}>
                      {guide.category === 'classroom' && 'Google Classroom'}
                      {guide.category === 'account' && 'התחברות ומייל'}
                      {guide.category === 'troubleshooting' && 'פתרון תקלות'}
                      {guide.category === 'cloud' && 'סביבות ענן'}
                      {guide.category === 'ai' && 'בינה מלאכותית'}
                    </span>
                    {guide.isPinned && (
                      <span className="text-[10px] bg-school-gold/20 text-school-gold px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Bookmark className="w-3 h-3" />
                        <span>נעוץ בראש הדף</span>
                      </span>
                    )}
                    <span className="text-[10px] text-school-muted">עודכן: {guide.updatedAt}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">{guide.title}</h3>
                  {guide.subtitle && (
                    <div className="text-xs text-school-muted font-medium">{guide.subtitle}</div>
                  )}
                  <p className="text-xs text-school-muted/80 line-clamp-2 max-w-3xl">{guide.summary}</p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleStartEditGuide(guide)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-school-cyan/15 hover:bg-school-cyan/25 text-school-cyan text-xs font-bold transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>עריכה</span>
                  </button>

                  <button
                    onClick={() => handleDeleteGuide(guide.id, guide.title)}
                    className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs transition-all"
                    title="מחק מדריך"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guide Editor Form */}
      {activeTab === 'guides' && isEditingGuide && (
        <div className="bg-[#111a2f] border border-school-line rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-school-line/60 pb-4">
            <h3 className="text-lg font-bold text-white">
              {editingGuide.id && guides.some((g) => g.id === editingGuide.id) ? 'עריכת מדריך קיים' : 'יצירת מדריך חדש'}
            </h3>
            <button
              onClick={() => setIsEditingGuide(false)}
              className="text-school-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-school-muted">כותרת המדריך *</label>
              <input
                type="text"
                value={editingGuide.title || ''}
                onChange={(e) => setEditingGuide({ ...editingGuide, title: e.target.value })}
                placeholder="לדוגמה: פתיחת כיתת לימוד חדשה ב-Google Classroom"
                className="w-full bg-school-bg border border-school-line focus:border-school-cyan rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-school-muted">תת-כותרת (אופציונלי)</label>
              <input
                type="text"
                value={editingGuide.subtitle || ''}
                onChange={(e) => setEditingGuide({ ...editingGuide, subtitle: e.target.value })}
                placeholder="לדוגמה: צעד אחר צעד לצוות ההוראה"
                className="w-full bg-school-bg border border-school-line focus:border-school-cyan rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-school-muted">קטגוריה</label>
              <select
                value={editingGuide.category || 'classroom'}
                onChange={(e) => setEditingGuide({ ...editingGuide, category: e.target.value as TikshuvCategory })}
                className="w-full bg-school-bg border border-school-line focus:border-school-cyan rounded-xl p-2.5 text-xs text-white"
              >
                <option value="classroom">Google Classroom</option>
                <option value="account">התחברות ומייל ארגוני</option>
                <option value="cloud">סביבות ענן וכלים</option>
                <option value="troubleshooting">פתרון תקלות ודגשים</option>
                <option value="ai">בינה מלאכותית</option>
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-school-muted">תקציר קצר (מוצג בכרטיסייה) *</label>
              <textarea
                rows={2}
                value={editingGuide.summary || ''}
                onChange={(e) => setEditingGuide({ ...editingGuide, summary: e.target.value })}
                placeholder="הסבר קצר בן משפט-שניים על מהות המדריך..."
                className="w-full bg-school-bg border border-school-line focus:border-school-cyan rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-school-muted">קישור חיצוני / משאב (אופציונלי)</label>
              <input
                type="text"
                value={editingGuide.externalUrl || ''}
                onChange={(e) => setEditingGuide({ ...editingGuide, externalUrl: e.target.value })}
                placeholder="https://..."
                className="w-full bg-school-bg border border-school-line focus:border-school-cyan rounded-xl p-2.5 text-xs text-white dir-ltr text-right"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-school-muted">תגיות (מופרדות בפסיקים)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Google Classroom, פתיחת כיתה, תשפ״ז"
                className="w-full bg-school-bg border border-school-line focus:border-school-cyan rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 md:col-span-2">
              <input
                type="checkbox"
                id="isPinnedCheck"
                checked={!!editingGuide.isPinned}
                onChange={(e) => setEditingGuide({ ...editingGuide, isPinned: e.target.checked })}
                className="w-4 h-4 rounded text-school-cyan focus:ring-school-cyan bg-school-bg border-school-line cursor-pointer"
              />
              <label htmlFor="isPinnedCheck" className="text-xs font-bold text-white cursor-pointer">
                סמן מדריך זה כנעוץ בראש הדף (Featured)
              </label>
            </div>
          </div>

          {/* Steps Editor */}
          <div className="space-y-4 border-t border-school-line/60 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">שלבי ביצוע (צעד אחר צעד)</h4>
                <p className="text-[11px] text-school-muted">הוסיפו שלבים מפורטים כדי להקל על המורים</p>
              </div>
              <button
                type="button"
                onClick={handleAddStep}
                className="inline-flex items-center gap-1 bg-school-cyan/20 text-school-cyan px-3 py-1 rounded-xl text-xs font-bold hover:bg-school-cyan/30 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>הוסף שלב</span>
              </button>
            </div>

            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div key={idx} className="bg-school-bg border border-school-line p-3.5 rounded-xl space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-school-cyan">שלב {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="text-rose-400 hover:text-rose-300 text-xs"
                    >
                      הסר שלב
                    </button>
                  </div>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => {
                      const copy = [...steps];
                      copy[idx].title = e.target.value;
                      setSteps(copy);
                    }}
                    placeholder="כותרת השלב"
                    className="w-full bg-[#121c32] border border-school-line/80 rounded-lg p-2 text-xs text-white"
                  />
                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={(e) => {
                      const copy = [...steps];
                      copy[idx].description = e.target.value;
                      setSteps(copy);
                    }}
                    placeholder="תיאור הפעולה לביצוע..."
                    className="w-full bg-[#121c32] border border-school-line/80 rounded-lg p-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={step.codeSnippet || ''}
                    onChange={(e) => {
                      const copy = [...steps];
                      copy[idx].codeSnippet = e.target.value;
                      setSteps(copy);
                    }}
                    placeholder="קוד / כתובת להעתקה בלחיצה (אופציונלי, למשל: a@taded.org.il)"
                    className="w-full bg-[#121c32] border border-school-line/80 rounded-lg p-2 text-xs text-school-cyan font-mono dir-ltr text-right"
                  />
                  <input
                    type="text"
                    value={step.tip || ''}
                    onChange={(e) => {
                      const copy = [...steps];
                      copy[idx].tip = e.target.value;
                      setSteps(copy);
                    }}
                    placeholder="טיפ או דגש מיוחד (אופציונלי)"
                    className="w-full bg-[#121c32] border border-school-line/80 rounded-lg p-2 text-xs text-amber-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-school-line/60">
            <button
              type="button"
              onClick={() => setIsEditingGuide(false)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-school-muted text-xs font-bold"
            >
              ביטול
            </button>
            <button
              type="button"
              onClick={handleSaveGuide}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-school-cyan text-[#0a1122] font-black text-xs hover:bg-cyan-300 transition-all shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>שמור מדריך</span>
            </button>
          </div>
        </div>
      )}

      {/* Coordinator Contact Tab */}
      {activeTab === 'contact' && (
        <div className="bg-[#111a2f] border border-school-line rounded-2xl p-6 space-y-4 max-w-3xl">
          <div className="border-b border-school-line/60 pb-3">
            <h3 className="text-base font-bold text-white">פרטי יצירת קשר של רכז התקשוב הבית-ספרי</h3>
            <p className="text-xs text-school-muted">פרטים אלו מוצגים לצוות המורים בראש דף התקשוב ובכרטיס הסיוע</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-school-muted">שם מלא</label>
              <input
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full bg-school-bg border border-school-line focus:border-school-cyan rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-school-muted">תפקיד / תיאור</label>
              <input
                type="text"
                value={contactForm.title}
                onChange={(e) => setContactForm({ ...contactForm, title: e.target.value })}
                className="w-full bg-school-bg border border-school-line focus:border-school-cyan rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-school-muted">כתובת מייל לפנייה</label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full bg-school-bg border border-school-line focus:border-school-cyan rounded-xl p-2.5 text-xs text-white dir-ltr text-right"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-school-muted">מיקום / חדר בבית הספר</label>
              <input
                type="text"
                value={contactForm.office || ''}
                onChange={(e) => setContactForm({ ...contactForm, office: e.target.value })}
                className="w-full bg-school-bg border border-school-line focus:border-school-cyan rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-school-muted">הודעה אישית / מסר תמיכה לצוות ההוראה</label>
              <textarea
                rows={3}
                value={contactForm.supportMessage}
                onChange={(e) => setContactForm({ ...contactForm, supportMessage: e.target.value })}
                className="w-full bg-school-bg border border-school-line focus:border-school-cyan rounded-xl p-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              onClick={handleSaveContact}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-school-cyan text-[#0a1122] font-black text-xs hover:bg-cyan-300 transition-all shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>שמור פרטים מעודכנים</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default TikshuvAdmin;
