import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit3, Save, X, Check, AlertCircle, ArrowRight,
  BookOpen, Sparkles, Cpu, Trophy, Laptop, Eye, HelpCircle,
  FileText, Download, UploadCloud, Paperclip, ChevronDown, ChevronUp,
  Database, Atom, Globe, TrendingUp, Languages, Users, FlaskConical, Code, Dna
} from 'lucide-react';
import { SchoolMajor, SchoolMajorSubPage } from '../types';
import { 
  getStoredMajors, 
  saveStoredMajors, 
  addMajor, 
  updateMajor, 
  deleteMajor, 
  subscribeToMajors,
  resetToOfficialMajors,
  DEFAULT_MAJORS 
} from '../services/majorsStorage';

interface MajorsAdminProps {
  onBack?: () => void;
  restrictedMajorId?: string | null; // If set, coordinator can only view/edit this major
  coordinatorRoleName?: string;
}

export const MajorsAdmin: React.FC<MajorsAdminProps> = ({ 
  onBack, 
  restrictedMajorId,
  coordinatorRoleName 
}) => {
  const [majors, setMajors] = useState<SchoolMajor[]>(getStoredMajors());
  const [editingMajor, setEditingMajor] = useState<SchoolMajor | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'high_school'>('all');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Subpage editor inside major
  const [editingSubPage, setEditingSubPage] = useState<SchoolMajorSubPage | null>(null);
  const [isCreatingSubPage, setIsCreatingSubPage] = useState(false);
  const [subPageFormData, setSubPageFormData] = useState<SchoolMajorSubPage>({
    id: '',
    title: '',
    subtitle: '',
    content: [''],
    pdfFiles: []
  });

  // Form State for Major
  const [formData, setFormData] = useState<Partial<SchoolMajor>>({
    title: '',
    division: 'high_school',
    shortDescription: '',
    fullDescription: '',
    icon: 'BookOpen',
    highlights: [''],
    targetGrades: "שכבות י'-יב'",
    contactPerson: '',
    hoursPerWeek: '5 יח"ל לבגרות',
    isFeatured: true,
    prerequisites: '',
    syllabusLink: '',
    sections: [],
    pdfFiles: [],
    subPages: []
  });

  // PDF drag & drop state
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);

  useEffect(() => {
    const unsub = subscribeToMajors((fetched) => {
      setMajors(fetched);
      if (restrictedMajorId) {
        const target = fetched.find(m => m.id === restrictedMajorId);
        if (target && !editingMajor && !isCreating) {
          handleEdit(target);
        }
      }
    });
    return () => {
      unsub();
    };
  }, [restrictedMajorId]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const getMajorIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Database': return <Database className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Atom': return <Atom className="w-5 h-5" />;
      case 'Globe': return <Globe className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      case 'Languages': return <Languages className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      case 'FlaskConical': return <FlaskConical className="w-5 h-5" />;
      case 'Code': return <Code className="w-5 h-5" />;
      case 'Laptop': return <Laptop className="w-5 h-5" />;
      case 'Trophy': return <Trophy className="w-5 h-5" />;
      case 'Dna': return <Dna className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const handleEdit = (major: SchoolMajor) => {
    setEditingMajor(major);
    setFormData({
      ...major,
      highlights: major.highlights && major.highlights.length > 0 ? [...major.highlights] : [''],
      pdfFiles: major.pdfFiles ? [...major.pdfFiles] : [],
      sections: major.sections ? [...major.sections] : [],
      subPages: major.subPages ? [...major.subPages] : []
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
      targetGrades: "שכבות י'-יב'",
      contactPerson: '',
      hoursPerWeek: '5 יח"ל לבגרות',
      isFeatured: true,
      prerequisites: '',
      syllabusLink: '',
      sections: [],
      pdfFiles: [],
      subPages: []
    });
    setIsCreating(true);
  };

  const handlePdfUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newFiles: { name: string; url: string; size?: string }[] = [];

    Array.from(files).forEach(file => {
      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Url = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          pdfFiles: [
            ...(prev.pdfFiles || []),
            { name: file.name, url: base64Url, size: sizeStr }
          ]
        }));
      };
      reader.readAsDataURL(file);
    });

    showToast('הקובץ נוסף בהצלחה לרשימת הקבצים של המגמה.');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.shortDescription?.trim()) {
      showToast('נא למלא לפחות שם מגמה ותיאור קצר', 'error');
      return;
    }

    const cleanHighlights = (formData.highlights || []).filter(h => h.trim().length > 0);

    if (isCreating) {
      const created = await addMajor({
        title: formData.title.trim(),
        division: 'high_school',
        shortDescription: formData.shortDescription.trim(),
        fullDescription: formData.fullDescription?.trim() || formData.shortDescription.trim(),
        icon: formData.icon || 'BookOpen',
        highlights: cleanHighlights,
        targetGrades: formData.targetGrades?.trim() || "שכבות י'-יב'",
        contactPerson: formData.contactPerson?.trim() || '',
        hoursPerWeek: formData.hoursPerWeek?.trim() || '5 יח"ל לבגרות',
        isFeatured: !!formData.isFeatured,
        prerequisites: formData.prerequisites?.trim(),
        syllabusLink: formData.syllabusLink?.trim(),
        pdfFiles: formData.pdfFiles || [],
        sections: formData.sections || [],
        subPages: formData.subPages || []
      });
      setMajors(getStoredMajors());
      showToast('השינויים נשמרו בהצלחה');
    } else if (editingMajor) {
      const updatedObj: SchoolMajor = {
        ...editingMajor,
        title: formData.title.trim(),
        division: 'high_school',
        shortDescription: formData.shortDescription.trim(),
        fullDescription: formData.fullDescription?.trim() || formData.shortDescription.trim(),
        icon: formData.icon || 'BookOpen',
        highlights: cleanHighlights,
        targetGrades: formData.targetGrades?.trim() || "שכבות י'-יב'",
        contactPerson: formData.contactPerson?.trim() || '',
        hoursPerWeek: formData.hoursPerWeek?.trim() || '5 יח"ל לבגרות',
        isFeatured: !!formData.isFeatured,
        prerequisites: formData.prerequisites?.trim(),
        syllabusLink: formData.syllabusLink?.trim(),
        pdfFiles: formData.pdfFiles || [],
        sections: formData.sections || [],
        subPages: formData.subPages || []
      };
      await updateMajor(updatedObj);
      setEditingMajor(updatedObj);
      setMajors(getStoredMajors());
      showToast('השינויים נשמרו בהצלחה');
    }

    if (!restrictedMajorId) {
      setEditingMajor(null);
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`האם אתה בטוח שברצונך למחוק את מגמת "${title}"?`)) {
      await deleteMajor(id);
      setMajors(getStoredMajors());
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

  // Subpage handlers
  const handleSaveSubPage = () => {
    if (!subPageFormData.title.trim()) {
      showToast('נא להזין כותרת לדף המשנה', 'error');
      return;
    }
    const currentSubPages = formData.subPages ? [...formData.subPages] : [];
    if (isCreatingSubPage) {
      currentSubPages.push({
        ...subPageFormData,
        id: 'sub-' + Date.now().toString(36)
      });
    } else {
      const idx = currentSubPages.findIndex(s => s.id === subPageFormData.id);
      if (idx >= 0) {
        currentSubPages[idx] = subPageFormData;
      }
    }
    setFormData({ ...formData, subPages: currentSubPages });
    setEditingSubPage(null);
    setIsCreatingSubPage(false);
    showToast('דף המשנה נשמר');
  };

  const visibleMajors = restrictedMajorId 
    ? majors.filter(m => m.id === restrictedMajorId)
    : majors;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-6 px-4 sm:px-6 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center space-x-3 space-x-reverse">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 flex items-center gap-2 text-sm font-medium cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                חזרה
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">
                {restrictedMajorId ? `ניהול ${visibleMajors[0]?.title || 'המגמה שלי'}` : 'ניהול מגמות הלימוד'}
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                {restrictedMajorId ? `מחובר כ${coordinatorRoleName || 'רכז/ת מגמה'} - עריכת תוכן, סילבוס, קבצים ודפי משנה` : 'עריכה ועדכון דפי המגמות והסילבוסים'}
              </p>
            </div>
          </div>

          {!restrictedMajorId && (
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg shadow-cyan-950/40 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              הוסף מגמה חדשה
            </button>
          )}
        </div>

        {/* Toast notification */}
        {notification && (
          <div className={`p-4 rounded-2xl text-xs md:text-sm flex items-center gap-2 ${
            notification.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
          }`}>
            <Check className="w-4 h-4" />
            <span>{notification.message}</span>
          </div>
        )}

        {/* Form view for editing / creating */}
        {(isCreating || editingMajor) && (
          <div className="bg-[#101b33] rounded-3xl p-6 md:p-8 border-2 border-cyan-500/40 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {getMajorIcon(formData.icon)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {isCreating ? 'יצירת מגמה חדשה' : `עריכת דף מגמה: ${formData.title}`}
                  </h2>
                </div>
              </div>

              {!restrictedMajorId && (
                <button
                  onClick={() => { setIsCreating(false); setEditingMajor(null); }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    שם המגמה <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="למשל: דאטה אנליסט / פיזיקה"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    היקף שעות / יחידות לימוד
                  </label>
                  <input
                    type="text"
                    placeholder="למשל: 5 יח״ל לבגרות"
                    value={formData.hoursPerWeek || ''}
                    onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    אייקון המגמה
                  </label>
                  <select
                    value={formData.icon || 'BookOpen'}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Database">📊 דאטה אנליסט (Database)</option>
                    <option value="Sparkles">🎭 תיאטרון ומחזות זמר (Sparkles)</option>
                    <option value="Atom">⚛️ פיזיקה (Atom)</option>
                    <option value="Globe">🌍 סייבר גיאוגרפיה (Globe)</option>
                    <option value="TrendingUp">📈 מנהל וכלכלה (TrendingUp)</option>
                    <option value="Languages">🗣️ ערבית (Languages)</option>
                    <option value="Users">👥 מדעי החברה (Users)</option>
                    <option value="FlaskConical">🧪 כימיה (FlaskConical)</option>
                    <option value="Code">💻 הנדסת תוכנה (Code)</option>
                    <option value="Trophy">🏆 חנ"ג (Trophy)</option>
                    <option value="Dna">🧬 ביולוגיה (Dna)</option>
                    <option value="BookOpen">📖 ספר / ידע כללי (BookOpen)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    רכז/ת המגמה / איש קשר
                  </label>
                  <input
                    type="text"
                    placeholder="שם רכז/ת המגמה"
                    value={formData.contactPerson || ''}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    שכבות יעד
                  </label>
                  <input
                    type="text"
                    placeholder="למשל: שכבות י'-יב'"
                    value={formData.targetGrades || "שכבות י'-יב'"}
                    onChange={(e) => setFormData({ ...formData, targetGrades: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  תיאור תמציתי (מופיע בכרטיסיות הראשיות) <span className="text-rose-400">*</span>
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
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  תיאור מלא ופירוט תכנית הלימודים
                </label>
                <textarea
                  rows={4}
                  placeholder="פירוט מלא על תכנית הלימודים, מטרות המגמה, מעבדות, פרויקטים ואפשרויות המשך..."
                  value={formData.fullDescription || ''}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              {/* Highlights List */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  דגשים, נושאי לימוד ונקודות מפתח
                </label>
                <div className="space-y-2">
                  {(formData.highlights || ['']).map((hl, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`דגש ${idx + 1}...`}
                        value={hl}
                        onChange={(e) => handleHighlightChange(idx, e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeHighlightRow(idx)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addHighlightRow}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1.5 mt-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    הוסף נקודת דגש נוספת
                  </button>
                </div>
              </div>

              {/* PDF Documents & Syllabus Upload (like grade pages) */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    <span>קבצי סילבוס, טפסים ומסמכים (PDF)</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {(formData.pdfFiles || []).length} קבצים מצורפים
                  </span>
                </div>

                {/* Upload zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingPdf(true); }}
                  onDragLeave={() => setIsDraggingPdf(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingPdf(false);
                    handlePdfUpload(e.dataTransfer.files);
                  }}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                    isDraggingPdf ? 'border-cyan-400 bg-cyan-950/30' : 'border-slate-700 hover:border-slate-600 bg-slate-900/40'
                  }`}
                >
                  <UploadCloud className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-300 font-bold">
                    גרור לכאן קבצי PDF או לחץ לבחירה מהמחשב
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    מתאים לדפי מידע, סילבוסים, דפי קבלה וטפסים עבור תלמידים והורים
                  </p>
                  <label className="mt-3 inline-block px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold cursor-pointer border border-cyan-500/30">
                    <span>בחר קובץ מהמחשב</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      multiple
                      onChange={(e) => handlePdfUpload(e.target.files)}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Attached files list */}
                {(formData.pdfFiles || []).length > 0 && (
                  <div className="space-y-2 pt-2">
                    {formData.pdfFiles!.map((pdf, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/70 border border-slate-700">
                        <div className="flex items-center gap-2 text-xs text-slate-200">
                          <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span className="font-semibold">{pdf.name}</span>
                          {pdf.size && <span className="text-[10px] text-slate-400">({pdf.size})</span>}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = formData.pdfFiles!.filter((_, i) => i !== idx);
                            setFormData({ ...formData, pdfFiles: filtered });
                          }}
                          className="p-1.5 rounded-lg bg-slate-700 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Subpages Section (like grade pages) */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>דפי משנה / פרויקטים של המגמה</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSubPageFormData({
                        id: '',
                        title: '',
                        subtitle: '',
                        content: [''],
                        pdfFiles: []
                      });
                      setIsCreatingSubPage(true);
                      setEditingSubPage(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 text-xs font-bold border border-cyan-500/40 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    הוסף דף משנה
                  </button>
                </div>

                {(formData.subPages || []).length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-3">
                    טרם נוצרו דפי משנה למגמה זו. ניתן ליצור דפים לפרויקטים, עבודות חקר או תחרויות.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {formData.subPages!.map((sub, sIdx) => (
                      <div key={sIdx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/70 border border-slate-700">
                        <div>
                          <div className="text-xs font-bold text-white">{sub.title}</div>
                          {sub.subtitle && <div className="text-[11px] text-slate-400">{sub.subtitle}</div>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSubPageFormData({ ...sub });
                              setEditingSubPage(sub);
                              setIsCreatingSubPage(false);
                            }}
                            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-cyan-300 text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            ערוך
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedSubs = formData.subPages!.filter((_, i) => i !== sIdx);
                              setFormData({ ...formData, subPages: updatedSubs });
                            }}
                            className="p-1.5 rounded-lg bg-slate-700 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* SubPage Modal */}
                {(isCreatingSubPage || editingSubPage) && (
                  <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-base font-bold text-white">
                          {isCreatingSubPage ? 'הוספת דף משנה חדש למגמה' : `עריכת דף משנה: ${subPageFormData.title}`}
                        </h3>
                        <button
                          type="button"
                          onClick={() => { setIsCreatingSubPage(false); setEditingSubPage(null); }}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">כותרת דף המשנה *</label>
                          <input
                            type="text"
                            required
                            placeholder="כותרת הדף..."
                            value={subPageFormData.title}
                            onChange={(e) => setSubPageFormData({ ...subPageFormData, title: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">תת כותרת</label>
                          <input
                            type="text"
                            placeholder="תת כותרת..."
                            value={subPageFormData.subtitle || ''}
                            onChange={(e) => setSubPageFormData({ ...subPageFormData, subtitle: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">תוכן הדף</label>
                          <textarea
                            rows={4}
                            placeholder="תוכן דף המשנה..."
                            value={(subPageFormData.content || []).join('\n')}
                            onChange={(e) => setSubPageFormData({ ...subPageFormData, content: e.target.value.split('\n') })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => { setIsCreatingSubPage(false); setEditingSubPage(null); }}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs cursor-pointer"
                        >
                          ביטול
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveSubPage}
                          className="px-5 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs cursor-pointer"
                        >
                          שמור דף משנה
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                {!restrictedMajorId && (
                  <button
                    type="button"
                    onClick={() => { setIsCreating(false); setEditingMajor(null); }}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    ביטול
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs md:text-sm font-bold shadow-lg shadow-cyan-950/40 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  שמור שינויים
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 11 Majors Cards Grid (when not restricted or when selecting to edit) */}
        {!restrictedMajorId && !isCreating && !editingMajor && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300">
                11 מגמות פעילות בבית הספר:
              </span>
              <span className="text-xs text-cyan-400 font-bold">
                {visibleMajors.length} מגמות
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleMajors.map((major) => (
                <div
                  key={major.id}
                  className="bg-[#101b33] p-5 rounded-2xl border border-slate-700/80 hover:border-cyan-500/60 transition-all space-y-4 flex flex-col justify-between shadow-lg"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
                          {getMajorIcon(major.icon)}
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          {major.hoursPerWeek || '5 יח"ל'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEdit(major)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
                          title="ערוך דף מגמה"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(major.id, major.title)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="מחק מגמה"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white">{major.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {major.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap justify-between gap-2">
                    <div>רכז/ת: <span className="text-slate-200">{major.coordinatorName || major.contactPerson || 'סגל המגמה'}</span></div>
                    <div>קבצים: <span className="text-cyan-400 font-bold">{(major.pdfFiles || []).length}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
