import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Camera, UploadCloud, CheckCircle2, Sparkles, 
  Trash2, Save, ShieldCheck, Award, GraduationCap, Info,
  AlertCircle, RefreshCw, ExternalLink, BookOpen, HeartHandshake
} from 'lucide-react';
import { StaffMember } from '../types';
import { saveStaffMember } from '../services/staffStorage';
import { getHebrewInitials, getAvatarColor } from '../utils/avatarUtils';

interface MyProfileTabProps {
  currentUser: { email: string; name: string; role: string } | null;
  staffMembers: StaffMember[];
  onProfileUpdated?: (updated: StaffMember) => void;
  isFullAdmin?: boolean;
}

export const MyProfileTab: React.FC<MyProfileTabProps> = ({
  currentUser,
  staffMembers,
  onProfileUpdated,
  isFullAdmin = false
}) => {
  // Resolve current staff member based on email or name
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isManagement, setIsManagement] = useState(false);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize or match member
  useEffect(() => {
    if (!currentUser) return;
    const cleanEmail = currentUser.email.trim().toLowerCase();
    
    // Find matching staff member
    let match = staffMembers.find(s => s.email?.trim().toLowerCase() === cleanEmail);
    if (!match && currentUser.name) {
      match = staffMembers.find(s => s.name.trim().toLowerCase() === currentUser.name.trim().toLowerCase());
    }

    if (match) {
      setSelectedStaffId(match.id);
      setName(match.name || '');
      setRole(match.role || '');
      setRoleDescription(match.roleDescription || '');
      setEmail(match.email || currentUser.email || '');
      setBio(match.bio || '');
      setImageUrl(match.imageUrl || '');
      setIsManagement(!!match.isManagement);
    } else {
      // New profile for this teacher
      setName(currentUser.name || '');
      setRole(currentUser.role || 'מורה');
      setEmail(currentUser.email || '');
      setRoleDescription('');
      setBio('');
      setImageUrl('');
      setIsManagement(false);
    }
  }, [currentUser, staffMembers]);

  // Handle admin selecting a different staff member to edit
  const handleSelectDifferentStaff = (id: string) => {
    setSelectedStaffId(id);
    const found = staffMembers.find(s => s.id === id);
    if (found) {
      setName(found.name || '');
      setRole(found.role || '');
      setRoleDescription(found.roleDescription || '');
      setEmail(found.email || '');
      setBio(found.bio || '');
      setImageUrl(found.imageUrl || '');
      setIsManagement(!!found.isManagement);
    }
  };

  const handlePhotoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('נא להעלות קובץ תמונה בלבד.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('קובץ התמונה גדול מ-2MB. אנא בחר תמונה קטנה יותר.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPhoto(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handlePhotoFile(file);
  };

  const handlePhotoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handlePhotoFile(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('נא להזין שם מלא.');
      return;
    }

    setIsSaving(true);
    try {
      const memberId = selectedStaffId || ('staff-' + Date.now());
      const updatedMember: StaffMember = {
        id: memberId,
        name: name.trim(),
        role: role.trim() || 'מורה',
        roleDescription: roleDescription.trim(),
        email: email.trim() || currentUser?.email || undefined,
        bio: bio.trim(),
        imageUrl: imageUrl || '',
        isManagement
      };

      await saveStaffMember(updatedMember);
      if (onProfileUpdated) {
        onProfileUpdated(updatedMember);
      }

      // Dispatch global events so whole app reflects changes
      window.dispatchEvent(new Event('arens_cms_staff_updated'));
      window.dispatchEvent(new Event('internal_pages_updated'));

      setSaveSuccess('הפרופיל האישי שלך נשמר בהצלחה בבסיס הנתונים ומתעדכן בכל האתר!');
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: any) {
      console.error('Failed to save profile:', err);
      setErrorMessage('אירעה שגיאה בשמירת הפרופיל. נא לנסות שנית.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-right" dir="rtl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-school-panel via-school-panel2 to-school-panel border border-school-line/60 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-school-cyan/15 border border-school-cyan/30 flex items-center justify-center text-school-cyan shadow-sm shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-white">הפרופיל האישי שלי</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  סנכרון ענן מלא (Firestore)
                </span>
              </div>
              <p className="text-xs text-school-muted mt-1">
                כאן ניתן לערוך את כרטיס המורה שלך: שם, תפקיד, פילוסופיה חינוכית, אימייל ליצירת קשר ותמונת פרופיל אישית.
              </p>
            </div>
          </div>

          {/* Admin override selector */}
          {isFullAdmin && staffMembers.length > 0 && (
            <div className="flex items-center gap-2 bg-[#080d19]/60 border border-school-line/60 rounded-xl p-2 shrink-0">
              <span className="text-[11px] text-school-muted font-bold whitespace-nowrap">עריכת איש צוות:</span>
              <select
                value={selectedStaffId}
                onChange={(e) => handleSelectDifferentStaff(e.target.value)}
                className="bg-school-bg border border-school-line/60 rounded-lg py-1 px-2 text-xs text-white focus:outline-none focus:border-school-cyan cursor-pointer"
              >
                {staffMembers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.role})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Save Notifications */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-2xl text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span className="font-bold">{saveSuccess}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-500/15 border border-red-500/30 text-red-300 rounded-2xl text-xs flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span className="font-bold">{errorMessage}</span>
        </div>
      )}

      {/* Main Form & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Right Column: Edit Form */}
        <div className="lg:col-span-8 bg-school-panel/70 border border-school-line/60 rounded-3xl p-6 shadow-sm space-y-6">
          <form onSubmit={handleSave} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white block">
                  שם מלא <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="לדוגמה: ישראל ישראלי"
                  className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-school-cyan transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white block">
                  תפקיד בבית הספר <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="לדוגמה: מחנכת כיתה ח'6 ומורה לחנ&quot;ג"
                  className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-school-cyan transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white block">
                  תיאור תפקיד מפורט (מופיע בכרטיס המורה)
                </label>
                <input
                  type="text"
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  placeholder="לדוגמה: מורה לחינוך גופני ומחנכת כיתה ח6 חט&quot;ב"
                  className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-school-cyan transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white block">
                  כתובת אימייל ליצירת קשר עם תלמידים והורים
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@arens.school"
                  className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-school-cyan transition-colors dir-ltr text-right"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white block">
                אודות ופילוסופיה חינוכית (מוצג בחלונית המורה המלאה)
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="כתבו כמה משפטים על החזון החינוכי שלכם, הגישה לתלמידים, תחומי עניין והישגים..."
                className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-school-cyan transition-colors leading-relaxed"
              />
            </div>

            {/* Photo Upload Area */}
            <div className="space-y-2 pt-2 border-t border-school-line/40">
              <label className="text-xs font-bold text-white block">
                העלאת תמונת פרופיל אישית
              </label>
              
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDraggingPhoto(true); }}
                onDragLeave={() => setIsDraggingPhoto(false)}
                onDrop={handlePhotoDrop}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center min-h-[160px] transition-all ${
                  isDraggingPhoto 
                    ? 'border-school-cyan bg-school-cyan/10' 
                    : 'border-school-line/60 hover:border-school-cyan/50 bg-[#080d19]/80'
                }`}
              >
                {imageUrl && !imageUrl.includes('placeholder') ? (
                  <div className="space-y-3 w-full">
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-school-cyan shadow-md"
                    />
                    <div className="flex justify-center gap-2">
                      <button 
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="text-[11px] text-red-400 hover:text-red-300 font-bold underline cursor-pointer"
                      >
                        הסרת תמונה וחזרה לאוואטר אותיות
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pointer-events-none flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-school-cyan/10 flex items-center justify-center text-school-cyan mb-1">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-white font-bold">לחצו כאן או גררו קובץ תמונה מהמחשב או הטלפון</p>
                    <p className="text-[10px] text-school-muted">תומך בפורמטים JPG, PNG עד גודל 2MB</p>
                  </div>
                )}

                {!imageUrl && (
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoInputChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                )}
              </div>

              {/* Quick Preset Avatars */}
              <div className="pt-2">
                <span className="text-[10px] text-school-muted block mb-1.5 font-bold">או בחרו מתבניות תמונות סגל מוכנות:</span>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', label: 'תבנית 1' },
                    { url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400', label: 'תבנית 2' },
                    { url: 'https://images.unsplash.com/photo-1580894732444-8fecef2271ff?auto=format&fit=crop&q=80&w=400', label: 'תבנית 3' },
                    { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', label: 'תבנית 4' },
                    { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400', label: 'תבנית 5' }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        imageUrl === preset.url ? 'border-school-cyan scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      title={preset.label}
                    >
                      <img src={preset.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4 border-t border-school-line/40 flex items-center justify-between">
              <span className="text-[11px] text-school-muted">
                השינויים יישמרו ישירות בבסיס הנתונים ויוצגו מיד בכל חלקי האתר.
              </span>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-school-cyan to-cyan-400 text-school-bg shadow-md hover:-translate-y-0.5 transition-all text-xs cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>שומר בבסיס הנתונים...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>שמירת שינויים בפרופיל</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Left Column: Live Card Preview */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-school-panel/70 border border-school-line/60 rounded-3xl p-5 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-school-line/40 pb-2.5">
              <span className="text-xs font-black text-school-cyan flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                תצוגה מקדימה באתר
              </span>
              <span className="text-[10px] text-school-muted font-mono">Live Preview</span>
            </div>

            {/* Staff Card Preview */}
            <div className="bg-[#121a2c] border border-school-line/60 rounded-2xl p-4 space-y-3 shadow-md">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-school-cyan/40">
                  {imageUrl && !imageUrl.includes('placeholder') ? (
                    <img 
                      src={imageUrl} 
                      alt={name || 'מורה'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getAvatarColor(name || 'מורה').bg} flex items-center justify-center select-none`}>
                      <span className={`text-base font-black ${getAvatarColor(name || 'מורה').text}`}>
                        {getHebrewInitials(name || 'מורה')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="overflow-hidden">
                  <h4 className="text-sm font-extrabold text-white truncate">
                    {name || 'שם המורה'}
                  </h4>
                  <p className="text-[11px] text-school-cyan font-bold truncate">
                    {role || 'תפקיד בבית הספר'}
                  </p>
                  {roleDescription && (
                    <p className="text-[10px] text-school-muted truncate mt-0.5">
                      {roleDescription}
                    </p>
                  )}
                </div>
              </div>

              {email && (
                <div className="pt-2 border-t border-school-line/30 flex items-center gap-1.5 text-[11px] text-school-cyan font-semibold">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="dir-ltr truncate">{email}</span>
                </div>
              )}

              {bio && (
                <div className="pt-2 border-t border-school-line/30 text-[11px] text-school-muted line-clamp-3 leading-relaxed">
                  {bio}
                </div>
              )}
            </div>

            <div className="p-3 bg-school-cyan/5 border border-school-cyan/20 rounded-xl text-[11px] text-school-muted leading-relaxed">
              <span className="font-bold text-school-cyan block mb-0.5">סנכרון מיידי בכל רחבי האתר:</span>
              כל עדכון שתבצעו כאן יופיע מיידית ברשימת המורים, בדף הסגל, בחלונית המורה המוקפצת (Modal) ובצוותי המגמות והשכבות.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
