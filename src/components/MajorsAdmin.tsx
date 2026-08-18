import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit3, Save, X, Check, AlertCircle, ArrowRight,
  BookOpen, Sparkles, Cpu, Trophy, Laptop, Eye, HelpCircle
} from 'lucide-react';
import { SchoolMajor } from '../types';
import { 
  getStoredMajors, 
  saveStoredMajors, 
  addMajor, 
  updateMajor, 
  deleteMajor,
  subscribeToMajors,
  DEFAULT_MAJORS 
} from '../services/majorsStorage';

interface MajorsAdminProps {
  onBack: () => void;
}

export const MajorsAdmin: React.FC<MajorsAdminProps> = ({ onBack }) => {
  const [majors, setMajors] = useState<SchoolMajor[]>(getStoredMajors());
  const [editingMajor, setEditingMajor] = useState<SchoolMajor | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'middle_school' | 'high_school'>('all');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<SchoolMajor>>({
    title: '',
    division: 'high_school',
    shortDescription: '',
    fullDescription: '',
    icon: 'BookOpen',
    highlights: [''],
    targetGrades: '',
    contactPerson: '',
    hoursPerWeek: '',
    isFeatured: false,
    prerequisites: '',
    syllabusLink: ''
  });

  useEffect(() => {
    const unsub = subscribeToMajors((fetched) => {
      setMajors(fetched);
    });
    return () => {
      unsub();
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleEdit = (major: SchoolMajor) => {
    setEditingMajor(major);
    setFormData({
      ...major,
      highlights: major.highlights && major.highlights.length > 0 ? [...major.highlights] : ['']
    });
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setEditingMajor(null);
    setFormData({
      title: '',
      division: 'high_school',
      shortDescription: '',
      fullDescription: '',
      icon: 'BookOpen',
      highlights: [''],
      targetGrades: '',
      contactPerson: '',
      hoursPerWeek: '',
      isFeatured: false,
      prerequisites: '',
      syllabusLink: ''
    });
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.shortDescription?.trim()) {
      showToast('נא למלא לפחות שם מגמה ותיאור קצר', 'error');
      return;
    }

    const cleanHighlights = (formData.highlights || []).filter(h => h.trim().length > 0);

    if (isCreating) {
      await addMajor({
        title: formData.title.trim(),
        division: formData.division || 'high_school',
        shortDescription: formData.shortDescription.trim(),
        fullDescription: formData.fullDescription?.trim() || formData.shortDescription.trim(),
        icon: formData.icon || 'BookOpen',
        highlights: cleanHighlights,
        targetGrades: formData.targetGrades?.trim() || '',
        contactPerson: formData.contactPerson?.trim() || '',
        hoursPerWeek: formData.hoursPerWeek?.trim() || '',
        isFeatured: !!formData.isFeatured,
        prerequisites: formData.prerequisites?.trim(),
        syllabusLink: formData.syllabusLink?.trim()
      });
      showToast('המגמה נוספה בהצלחה לבסיס הנתונים!');
    } else if (editingMajor) {
      await updateMajor({
        ...editingMajor,
        title: formData.title.trim(),
        division: formData.division || 'high_school',
        shortDescription: formData.shortDescription.trim(),
        fullDescription: formData.fullDescription?.trim() || formData.shortDescription.trim(),
        icon: formData.icon || 'BookOpen',
        highlights: cleanHighlights,
        targetGrades: formData.targetGrades?.trim() || '',
        contactPerson: formData.contactPerson?.trim() || '',
        hoursPerWeek: formData.hoursPerWeek?.trim() || '',
        isFeatured: !!formData.isFeatured,
        prerequisites: formData.prerequisites?.trim(),
        syllabusLink: formData.syllabusLink?.trim()
      });
      showToast('המגמה עודכנה בהצלחה בזמן אמת!');
    }

    setEditingMajor(null);
    setIsCreating(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`האם אתה בטוח שברצונך למחוק את מגמת "${title}"?`)) {
      await deleteMajor(id);
      showToast(`המגמה "${title}" נמחקה.`);
    }
  };

  const handleHighlightChange = (index: number, val: string) => {
    const arr = [...(formData.highlights || [''])];
    arr[index] = val;
    setFormData({ ...formData, highlights: arr });
  };

  const addHighlightRow = () => {
    setFormData({
      ...formData,
      highlights: [...(formData.highlights || []), '']
    });
  };

  const removeHighlightRow = (index: number) => {
    const arr = [...(formData.highlights || [''])];
    arr.splice(index, 1);
    setFormData({ ...formData, highlights: arr.length ? arr : [''] });
  };

  const filteredMajors = majors.filter(m => {
    if (activeTab === 'all') return true;
    return m.division === activeTab;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3 space-x-reverse">
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 flex items-center gap-2 text-sm font-medium"
            >
              <ArrowRight className="w-4 h-4" />
              חזרה לאתר
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">ניהול מגמות ומסלולי לימוד</h1>
              <p className="text-slate-400 text-xs mt-0.5">סנכרון מיידי עם בסיס הנתונים בענן (Firestore)</p>
            </div>
          </div>

          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-cyan-950/40 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            הוסף מגמה חדשה
          </button>
        </div>

        {/* Toast notification */}
        {notification && (
          <div className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
            notification.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
          }`}>
            <Check className="w-4 h-4" />
            <span>{notification.message}</span>
          </div>
        )}

        {/* Form Modal / View when Creating or Editing */}
        {(isCreating || editingMajor) && (
          <div className="bg-slate-800/90 rounded-3xl p-6 md:p-8 border border-cyan-500/30 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <h2 className="text-xl font-bold text-white">
                {isCreating ? 'יצירת מגמה / מסלול חדש' : `עריכת מגמה: ${editingMajor?.title}`}
              </h2>
              <button
                onClick={() => { setIsCreating(false); setEditingMajor(null); }}
                className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    שם המגמה / המסלול <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="למשל: ביוטכנולוגיה / סייבר"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    שיוך לחטיבה <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.division || 'high_school'}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="high_school">חטיבה עליונה (שכבות י'-יב')</option>
                    <option value="middle_school">חטיבת ביניים (שכבות ז'-ט')</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    שכבות יעד
                  </label>
                  <input
                    type="text"
                    placeholder="למשל: שכבות י'-יב'"
                    value={formData.targetGrades || ''}
                    onChange={(e) => setFormData({ ...formData, targetGrades: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    רכז המגמה / איש קשר
                  </label>
                  <input
                    type="text"
                    placeholder="למשל: ישראל ישראלי"
                    value={formData.contactPerson || ''}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    היקף שעות / יחידות לימוד
                  </label>
                  <input
                    type="text"
                    placeholder="למשל: 5 יח״ל לבגרות / 4 שעות שבועיות"
                    value={formData.hoursPerWeek || ''}
                    onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    אייקון מוביל
                  </label>
                  <select
                    value={formData.icon || 'BookOpen'}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="BookOpen">ספר / ידע (BookOpen)</option>
                    <option value="Laptop">מחשב / תוכנה (Laptop)</option>
                    <option value="Cpu">טכנולוגיה / AI (Cpu)</option>
                    <option value="Trophy">ספורט / מנהיגות (Trophy)</option>
                    <option value="Sparkles">מצוינות (Sparkles)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  תיאור קצר (יוצג בכרטיס הראשי) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="תיאור תמציתי של המגמה..."
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  תיאור מורחב ומפורט
                </label>
                <textarea
                  rows={3}
                  placeholder="פירוט מלא על תכנית הלימודים, מטרות המגמה ואפשרויות ההמשך..."
                  value={formData.fullDescription || ''}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  נקודות מפתח / דגשים של המסלול
                </label>
                <div className="space-y-2">
                  {(formData.highlights || ['']).map((hl, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`נקודה ${idx + 1}...`}
                        value={hl}
                        onChange={(e) => handleHighlightChange(idx, e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeHighlightRow(idx)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addHighlightRow}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    הוסף נקודת מפתח
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => { setIsCreating(false); setEditingMajor(null); }}
                  className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-950/40 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  שמור שינויים בבסיס הנתונים
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Division Filter Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            כל המגמות והמסלולים ({majors.length})
          </button>
          <button
            onClick={() => setActiveTab('high_school')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'high_school' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            חטיבה עליונה ({majors.filter(m => m.division === 'high_school').length})
          </button>
          <button
            onClick={() => setActiveTab('middle_school')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'middle_school' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            חטיבת ביניים ({majors.filter(m => m.division === 'middle_school').length})
          </button>
        </div>

        {/* Majors List Table/Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMajors.map((major) => (
            <div
              key={major.id}
              className="bg-slate-850 p-5 rounded-2xl border border-slate-700/60 hover:border-slate-600 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    major.division === 'high_school' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30' : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {major.division === 'high_school' ? 'חטיבה עליונה' : 'חטיבת ביניים'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEdit(major)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
                      title="ערוך מגמה"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(major.id, major.title)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors"
                      title="מחק מגמה"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white">{major.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {major.shortDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap justify-between gap-2">
                <div>שכבות: <span className="text-slate-200">{major.targetGrades || 'לא הוגדר'}</span></div>
                <div>היקף: <span className="text-slate-200">{major.hoursPerWeek || 'לא הוגדר'}</span></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
