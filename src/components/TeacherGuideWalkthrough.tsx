import React, { useState, useEffect } from 'react';
import { 
  Lock, Key, Sparkles, CheckCircle2, User, Camera, 
  Save, Play, Pause, RefreshCw, Printer, Share2, Check,
  ChevronRight, ChevronLeft, ArrowLeft, MousePointer, HelpCircle,
  ExternalLink, UploadCloud, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TeacherGuideWalkthroughProps {
  onOpenAdmin?: () => void;
  onBackToHome?: () => void;
}

export const TeacherGuideWalkthrough: React.FC<TeacherGuideWalkthroughProps> = ({
  onOpenAdmin,
  onBackToHome
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [selectedGender, setSelectedGender] = useState<'female' | 'male'>('female');

  // Interactive simulation form states (exact replica of the real profile screen)
  const [simName, setSimName] = useState<string>('ישראלה ישראלי');
  const [simRole, setSimRole] = useState<string>('מורה מן המניין (נקבה - ישראלה ישראלי)');
  const [simRoleDesc, setSimRoleDesc] = useState<string>('מורת מקצוע בחטיבה ובתיכון');
  const [simEmail, setSimEmail] = useState<string>('israela.israeli@arens.school');
  const [simPassword, setSimPassword] = useState<string>('••••••••••••');
  const [simBio, setSimBio] = useState<string>('מורת מקצוע מן המניין בבית הספר השש-שנתי משה ארנס. מובילה פדגוגית בכיתות הלימוד.');
  const [simHasPhoto, setSimHasPhoto] = useState<boolean>(false);
  const [simIsSaved, setSimIsSaved] = useState<boolean>(false);

  // Sync gender
  useEffect(() => {
    if (selectedGender === 'male') {
      setSimName('ישראל ישראלי');
      setSimRole('מורה מן המניין (זכר - ישראל ישראלי)');
      setSimRoleDesc('מורה מקצועי ומחנך כיתה ח6 חט"ב');
      setSimEmail('israel.israeli@arens.school');
      setSimBio('מורה מן המניין בבית הספר השש-שנתי משה ארנס. מוביל למידה משמעותית ומצוינות אישית.');
    } else {
      setSimName('ישראלה ישראלי');
      setSimRole('מורה מן המניין (נקבה - ישראלה ישראלי)');
      setSimRoleDesc('מורת מקצוע בחטיבה ובתיכון');
      setSimEmail('israela.israeli@arens.school');
      setSimBio('מורת מקצוע מן המניין בבית הספר השש-שנתי משה ארנס. מובילה פדגוגית בכיתות הלימוד.');
    }
    setSimHasPhoto(false);
    setSimIsSaved(false);
  }, [selectedGender]);

  // Steps definition
  const steps = [
    {
      id: 0,
      title: 'שלב 1: לחיצה על המנעול 🔒 בראש האתר',
      subtitle: 'איתור אייקון המנעול בסרגל הניווט העליון',
      description: 'גולשים לכתובת arens.org.il. בסרגל העליון (Header) בראש הדף מופיע אייקון מנעול 🔒 ("כניסת צוות"). לחיצה עליו פותחת מיד את חלון ההתחברות!',
      badge: 'המנעול בראש הדף',
      tip: 'הסמן המונפש מראה לכם בדיוק את מיקום המנעול בראש העמוד לצד תפריטי הניווט.'
    },
    {
      id: 1,
      title: 'שלב 2: התחברות למערכת הניהול',
      subtitle: 'הזנת אימייל וסיסמת גישה',
      description: 'מזינים את כתובת האימייל הבית-ספרית שלכם ואת סיסמת הגישה שקיבלתם מבית הספר, ולוחצים על "התחברות למערכת".',
      badge: 'כניסה מאובטחת',
      tip: 'אם אינכם בטוחים באיזה אימייל אתם רשומים בסגל, פנו לרכז התקשוב והוא יעדכן זאת מיד.'
    },
    {
      id: 2,
      title: 'שלב 3: עריכת הפרופיל והעלאת תמונה',
      subtitle: 'המסך המדויק שנפתח: תצוגה מקדימה משמאל, טופס והעלאת תמונה מימין',
      description: 'זהו המסך המדויק שנפתח עבורכם! בצד ימין עורכים את השם, התפקיד והביוגרפיה, ומעלים תמונת פנים אישית. בצד שמאל רואים תצוגה מקדימה חיה (Live Preview). המערכת מכווצת את התמונה אוטומטית ל-30KB!',
      badge: 'הפרופיל האישי שלי',
      tip: 'אין צורך להקטין או לחתוך את התמונה מראש – המערכת מבצעת כיווץ אופטימלי מהיר אוטומטית.'
    },
    {
      id: 3,
      title: 'שלב 4: כרטיס המורה פעיל ומסונכרן באתר',
      subtitle: 'הכרטיס מופיע בזמן אמת עבור תלמידים והורים',
      description: 'בלחיצה על "שמור והחל שינויים", הכרטיס המעודכן עם תמונתכם מסונכרן מיידית בכל רחבי האתר – בדף הסגל ובחלונות המורים של השכבות והמגמות.',
      badge: 'סנכרון מלא באתר',
      tip: 'תוכלו לשוב ולעדכן את התמונה או הפרטים בכל עת באותה הדרך בדיוק.'
    }
  ];

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}/#/teacher-guide`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#070c18] text-white p-4 sm:p-6 lg:p-8 font-sans text-right dir-rtl" dir="rtl">
      
      {/* Top Header & Actions Bar */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-school-line/60">
        
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-school-cyan/15 border border-school-cyan/30 text-school-cyan text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>הדמיה מונפשת חיה למורה • שש-שנתי משה ארנס</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            הדרכה מונפשת: כניסה דרך המנעול 🔒 ועדכון כרטיס המורה האישי
          </h1>
          <p className="text-xs text-school-muted mt-1 max-w-2xl">
            צפו בתנועת העכבר המונפשת צעד-אחר-צעד: לחיצה על המנעול בראש האתר, כניסה למערכת, והעלאת תמונת פרופיל במסך המורה המדויק.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Gender toggle */}
          <div className="bg-[#0f172a] p-1 rounded-xl border border-school-line flex items-center text-xs">
            <button
              onClick={() => setSelectedGender('female')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedGender === 'female' 
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' 
                  : 'text-school-muted hover:text-white'
              }`}
            >
              ישראלה ישראלי (נקבה)
            </button>
            <button
              onClick={() => setSelectedGender('male')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedGender === 'male' 
                  ? 'bg-school-cyan/20 text-school-cyan border border-school-cyan/30' 
                  : 'text-school-muted hover:text-white'
              }`}
            >
              ישראל ישראלי (זכר)
            </button>
          </div>

          {/* Auto play toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              isPlaying
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-white/5 border-school-line hover:border-school-cyan text-school-muted hover:text-white'
            }`}
            title={isPlaying ? 'עצור אנימציה רציפה' : 'הפעל אנימציה רציפה'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'השהה אנימציה' : 'נגן אנימציה רציפה'}</span>
          </button>

          {/* Print / PDF */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-school-line hover:border-school-cyan text-xs font-bold text-school-muted hover:text-white transition-all cursor-pointer"
            title="הדפסה או שמירה כ-PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>הדפס / PDF</span>
          </button>

          {/* Copy link */}
          <button
            onClick={handleCopyShareLink}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-school-cyan/15 border border-school-cyan/30 hover:bg-school-cyan/25 text-xs font-bold text-school-cyan transition-all cursor-pointer"
            title="העתק קישור לשליחה בווטסאפ לצוות המורים"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'הקישור הועתק!' : 'שתף בווטסאפ'}</span>
          </button>

          {/* External site link in separate window */}
          <a
            href="https://arens.org.il/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/90 border border-school-cyan/40 hover:bg-school-cyan/20 text-school-cyan text-xs font-bold transition-all shadow-md shadow-school-cyan/10 cursor-pointer"
            title="פתיחת אתר בית הספר בחלון נפרד לצורך התחברות אמיתית"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>פתיחת האתר בחלון נפרד</span>
          </a>

          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="px-3 py-2 rounded-xl bg-white/5 border border-school-line text-xs font-bold text-school-muted hover:text-white transition-all cursor-pointer"
            >
              חזרה לאתר
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Container */}
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {steps.map((st, idx) => {
            const isActive = currentStep === idx;
            return (
              <button
                key={st.id}
                onClick={() => {
                  setCurrentStep(idx);
                  setIsPlaying(false);
                }}
                className={`p-4 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'bg-[#101b33] border-school-cyan shadow-lg shadow-school-cyan/10'
                    : 'bg-[#0b1222] border-school-line/60 hover:border-school-line text-school-muted hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeStepBorder"
                    className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-school-cyan to-blue-500" 
                  />
                )}
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-school-cyan/20 text-school-cyan' : 'bg-white/5 text-school-muted'
                  }`}>
                    {st.badge}
                  </span>
                  <span className="font-mono text-xs font-black text-school-muted/60">0{idx + 1}</span>
                </div>
                <h3 className={`text-xs sm:text-sm font-extrabold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {st.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Active Step Presentation Window */}
        <div className="bg-[#0e162b] border border-school-line/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left side (Text instructions & step details) */}
            <div className="lg:col-span-4 space-y-5 order-2 lg:order-1">
              
              <div className="space-y-2">
                <span className="text-xs font-black text-school-cyan tracking-wider uppercase">
                  שלב {currentStep + 1} מתוך 4
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {steps[currentStep].title}
                </h2>
                <p className="text-xs text-school-cyan font-bold">
                  {steps[currentStep].subtitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-school-muted leading-relaxed">
                {steps[currentStep].description}
              </p>

              {/* Tip Box */}
              <div className="p-4 rounded-2xl bg-school-cyan/5 border border-school-cyan/20 space-y-1">
                <div className="flex items-center gap-1.5 text-school-cyan text-xs font-bold">
                  <HelpCircle className="w-4 h-4" />
                  <span>שימו לב:</span>
                </div>
                <p className="text-xs text-school-muted leading-relaxed">
                  {steps[currentStep].tip}
                </p>
              </div>

              {/* Prev / Next controls */}
              <div className="flex items-center justify-between pt-4 border-t border-school-line/40">
                <button
                  onClick={() => {
                    setCurrentStep(prev => Math.max(0, prev - 1));
                    setIsPlaying(false);
                  }}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>שלב קודם</span>
                </button>

                <div className="flex gap-1.5">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentStep(i);
                        setIsPlaying(false);
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        currentStep === i ? 'bg-school-cyan w-6' : 'bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => {
                    setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
                    setIsPlaying(false);
                  }}
                  disabled={currentStep === steps.length - 1}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-school-cyan text-slate-950 disabled:opacity-30 text-xs font-bold transition-all cursor-pointer hover:bg-cyan-300"
                >
                  <span>שלב הבא</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right side (Live Animated Simulation Sandbox) */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <div className="bg-[#090f1e] border-2 border-school-line/80 rounded-2xl overflow-hidden shadow-2xl relative">
                
                {/* Browser-like window top bar */}
                <div className="bg-[#0f172a] px-4 py-3 border-b border-school-line/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  
                  {/* Address bar */}
                  <div className="flex-1 max-w-sm mx-4 bg-[#070c18] border border-school-line/60 rounded-lg px-3 py-1 flex items-center justify-between text-[11px] font-mono text-slate-300 text-left dir-ltr">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-emerald-400">🔒</span>
                      <span>
                        {currentStep === 0 && 'https://arens.org.il/'}
                        {currentStep === 1 && 'https://arens.org.il/#/admin'}
                        {currentStep >= 2 && 'https://arens.org.il/#/admin (פרופיל אישי)'}
                      </span>
                    </div>
                    <RefreshCw className="w-3 h-3 text-school-muted shrink-0" />
                  </div>

                  <span className="text-[10px] text-school-cyan font-bold">הדמיית מורה חיה</span>
                </div>

                {/* Animated Sandbox Canvas based on active step */}
                <div className="p-4 sm:p-6 min-h-[460px] flex flex-col justify-center bg-gradient-to-b from-[#090f1e] to-[#070c18] relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    
                    {/* STEP 1: Animated Header & Lock Button Click */}
                    {currentStep === 0 && (
                      <motion.div
                        key="step-0-lock-sim"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        className="space-y-6 text-center relative"
                      >
                        {/* Mock Header of arens.org.il with the Lock Icon */}
                        <div className="p-3.5 bg-[#0e172c] border border-school-line rounded-2xl flex items-center justify-between shadow-xl">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-school-cyan/20 border border-school-cyan/40 flex items-center justify-center font-black text-xs text-school-cyan">
                              שש
                            </div>
                            <span className="text-xs font-black text-white">שש-שנתי משה ארנס</span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-school-muted">
                            <span className="hover:text-white">דף הבית</span>
                            <span className="hover:text-white">שכבות</span>
                            <span className="hover:text-white">מרחב תקשוב</span>
                            <span className="hover:text-white">סגל מורים</span>
                          </div>

                          {/* THE LOCK BUTTON - MUTED & DISABLED IN SIMULATION */}
                          <div className="relative">
                            <div 
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-400 font-bold text-xs opacity-60 cursor-not-allowed select-none pointer-events-none"
                              title="כפתור מנעול זה מנוטרל בהדמיה - יש לעקוב אחרי ההדמיה בחלון נפרד"
                            >
                              <Lock className="w-3.5 h-3.5 text-slate-500" />
                              <span>כניסת צוות (מנעול - מושבת בהדמיה 🔒)</span>
                            </div>
                          </div>
                        </div>

                        {/* Informational pointer highlighting lock location on real site */}
                        <div
                          className="absolute pointer-events-none z-30"
                          style={{ top: '55%', left: '40%' }}
                        >
                          <div className="flex items-center gap-1.5 bg-slate-900/95 px-3 py-1.5 rounded-full border border-amber-400/60 shadow-2xl text-amber-200 text-[10px] font-bold">
                            <Info className="w-3.5 h-3.5 text-amber-400" />
                            <span>מיקום המנעול באתר האמיתי (כאן בהדמיה הוא מושבת)</span>
                          </div>
                        </div>

                        {/* Informational Guidance Banner explaining that the lock is disabled */}
                        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-right space-y-2">
                          <div className="flex items-start gap-2.5">
                            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <p className="text-xs font-black text-amber-300">
                                שימו לב: כפתור המנעול מושבת בהדמיה — יש לעקוב אחרי ההדמיה בחלון נפרד
                              </p>
                              <p className="text-[11px] text-slate-200 leading-relaxed">
                                כדי להתחבר ולבצע שינויים אמיתיים, פתחו את האתר בחלון נפרד ולחצו על המנעול בראש העמוד. בהדמיה זו עקבו באמצעות כפתור <span className="font-bold text-white bg-white/10 px-1.5 py-0.5 rounded">שלב הבא</span>.
                              </p>
                            </div>
                          </div>
                          
                          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-school-line/40">
                            <a
                              href="https://arens.org.il/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-school-cyan/20 hover:bg-school-cyan/30 border border-school-cyan/40 text-[11px] font-bold text-school-cyan transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>פתיחת arens.org.il בחלון נפרד להתחברות</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => setCurrentStep(1)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-school-cyan hover:bg-cyan-300 text-slate-950 text-[11px] font-black transition-all cursor-pointer shadow-md"
                            >
                              <span>המשך לשלב הבא בהדמיה</span>
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Mock Hero content beneath */}
                        <div className="p-5 rounded-2xl bg-[#121c33]/70 border border-school-line/60 space-y-1.5">
                          <span className="text-[10px] text-school-cyan bg-school-cyan/10 px-2.5 py-0.5 rounded-full font-bold">
                            שש שנתי ע"ש משה ארנס • פתח תקווה
                          </span>
                          <h4 className="text-lg font-black text-white">ארנס מצמיח אדם וחברה</h4>
                          <p className="text-xs text-school-muted max-w-md mx-auto">
                            מרחב למידה חדשני, דיאלוג, והעצמה אישית ופדגוגית לכלל תלמידי וצוות בית הספר.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: Login Dialog */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step-1-login-sim"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="max-w-sm mx-auto w-full bg-[#101b33] border border-school-line rounded-3xl p-6 space-y-4 shadow-2xl relative"
                      >
                        <div className="text-center space-y-1">
                          <div className="w-11 h-11 rounded-full bg-school-cyan/15 flex items-center justify-center text-school-cyan mx-auto mb-2 border border-school-cyan/30">
                            <Key className="w-5 h-5" />
                          </div>
                          <h4 className="text-sm font-black text-white">כניסת צוות עריכה ומנהלים</h4>
                          <p className="text-[10px] text-school-muted">התחבר לצורך ביצוע שינויים בדפי האתר ובעדכונים שוטפים</p>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[10px] text-white font-bold block">כתובת אימייל מורשית</label>
                            <input 
                              type="text" 
                              readOnly 
                              value={simEmail} 
                              className="w-full bg-[#080d19] border border-school-cyan/60 text-school-cyan font-mono text-xs rounded-xl py-2 px-3 focus:outline-none"
                              dir="ltr"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-white font-bold block">סיסמת גישה</label>
                            <input 
                              type="password" 
                              readOnly 
                              value={simPassword} 
                              className="w-full bg-[#080d19] border border-school-line/60 text-white font-mono text-xs rounded-xl py-2 px-3 focus:outline-none"
                              dir="ltr"
                            />
                          </div>

                          <motion.button
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            onClick={() => setCurrentStep(2)}
                            className="w-full py-2.5 rounded-xl font-black bg-gradient-to-r from-school-cyan to-blue-500 text-slate-950 text-xs shadow-md hover:bg-cyan-300 transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            <span>התחברות למערכת</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: EXACT REPLICA OF THE TEACHER PROFILE SCREEN (AS IN USER SCREENSHOT) */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step-2-profile-sim"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4 w-full"
                      >
                        {/* Top Banner (Exact match to screenshot) */}
                        <div className="bg-[#121c33] border border-school-line/60 rounded-2xl p-4 flex items-center justify-between">
                          <div className="text-right">
                            <h3 className="text-base font-black text-white">הפרופיל האישי שלי</h3>
                            <p className="text-[11px] text-school-muted">
                              כאן ניתן לערוך את כרטיס המורה שלך: שם, תפקיד, פילוסופיה חינוכית, אימייל ליצירת קשר ותמונת פרופיל אישית.
                            </p>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-school-cyan/15 border border-school-cyan/30 flex items-center justify-center text-school-cyan shrink-0">
                            <User className="w-5 h-5" />
                          </div>
                        </div>

                        {/* Grid: Left is Live Preview, Right is Inputs + Dropzone (Exact match to screenshot) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                          
                          {/* Live Preview Column (Left) */}
                          <div className="lg:col-span-4 bg-[#101b33] border border-school-line/60 rounded-2xl p-4 space-y-3">
                            <div className="flex items-center justify-between text-[11px] text-school-cyan font-bold border-b border-school-line/40 pb-2">
                              <span>תצוגה מקדימה באתר</span>
                              <span className="font-mono text-[9px] text-school-muted">Live Preview</span>
                            </div>

                            <div className="bg-[#0b1222] border border-school-line/60 rounded-xl p-3.5 space-y-2 relative">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-school-cyan/20 border border-school-cyan flex items-center justify-center text-school-cyan font-black text-xs shrink-0 overflow-hidden">
                                  {simHasPhoto ? (
                                    <span className="text-emerald-400 font-bold">תמונה ✓</span>
                                  ) : (
                                    'יש'
                                  )}
                                </div>
                                <div className="text-right flex-1 min-w-0">
                                  <h4 className="text-xs font-black text-white truncate">{simName}</h4>
                                  <p className="text-[10px] text-school-cyan font-bold truncate">{simRoleDesc}</p>
                                </div>
                              </div>
                              <p className="text-[9px] font-mono text-school-muted truncate text-right">{simEmail}</p>
                            </div>

                            <div className="p-3 bg-school-cyan/5 border border-school-cyan/20 rounded-xl space-y-1 text-right">
                              <p className="text-[10px] font-bold text-school-cyan">סנכרון מיידי בכל רחבי האתר:</p>
                              <p className="text-[9px] text-school-muted leading-relaxed">
                                כל עדכון שתבצעו כאן יופיע מיידית ברשימת המורים, בדף הסגל, ובחלוניות המורים.
                              </p>
                            </div>
                          </div>

                          {/* Form Inputs & Upload Dropzone Column (Right) */}
                          <div className="lg:col-span-8 bg-[#101b33] border border-school-line/60 rounded-2xl p-4 space-y-3 text-right">
                            
                            {/* Inputs Row 1 */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-white block">שם מלא *</label>
                                <input 
                                  type="text" 
                                  value={simName} 
                                  onChange={(e) => setSimName(e.target.value)}
                                  className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-white block">תפקיד בבית הספר *</label>
                                <input 
                                  type="text" 
                                  value={simRole} 
                                  readOnly
                                  className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-1.5 px-2.5 text-xs text-school-muted"
                                />
                              </div>
                            </div>

                            {/* Inputs Row 2 */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-white block">תיאור תפקיד מפורט (מופיע בכרטיס המורה)</label>
                                <input 
                                  type="text" 
                                  value={simRoleDesc} 
                                  onChange={(e) => setSimRoleDesc(e.target.value)}
                                  className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-white block">כתובת אימייל ליצירת קשר עם תלמידים והורים</label>
                                <input 
                                  type="text" 
                                  value={simEmail} 
                                  onChange={(e) => setSimEmail(e.target.value)}
                                  className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-1.5 px-2.5 text-xs text-white font-mono text-left"
                                  dir="ltr"
                                />
                              </div>
                            </div>

                            {/* Bio */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-white block">אודות ופילוסופיה חינוכית (מוצג בחלונית המורה המלאה)</label>
                              <textarea 
                                rows={2}
                                value={simBio}
                                onChange={(e) => setSimBio(e.target.value)}
                                className="w-full bg-[#080d19] border border-school-line/60 rounded-xl py-1.5 px-2.5 text-xs text-white leading-relaxed resize-none"
                              />
                            </div>

                            {/* The Photo Upload Dropzone (As in screenshot) */}
                            <div className="space-y-1 pt-1">
                              <label className="text-[10px] font-bold text-white block">העלאת תמונת פרופיל אישית</label>
                              
                              <div 
                                onClick={() => setSimHasPhoto(!simHasPhoto)}
                                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                                  simHasPhoto 
                                    ? 'border-emerald-400 bg-emerald-500/10' 
                                    : 'border-school-line/60 hover:border-school-cyan bg-[#080d19]/80'
                                }`}
                              >
                                <Camera className="w-5 h-5 text-school-cyan mx-auto mb-1" />
                                <p className="text-xs font-bold text-white">
                                  {simHasPhoto ? 'תמונת הפרופיל נקלטה בהצלחה! (כיווץ אוטומטי 30KB)' : 'לחצו כאן או גררו קובץ תמונה מהמחשב או הטלפון'}
                                </p>
                                <p className="text-[10px] text-school-muted">התמונה תותאם אוטומטית לתצוגה חדה ומהירה</p>
                              </div>
                            </div>

                            {/* Save button */}
                            <button
                              onClick={() => {
                                setSimIsSaved(true);
                                setTimeout(() => setCurrentStep(3), 800);
                              }}
                              className={`w-full py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                simIsSaved 
                                  ? 'bg-emerald-500 text-slate-950' 
                                  : 'bg-gradient-to-r from-school-cyan to-blue-500 text-slate-950 hover:bg-cyan-300 shadow-md'
                              }`}
                            >
                              <Save className="w-4 h-4" />
                              <span>{simIsSaved ? 'נשמר בהצלחה! עובר לתוצאה החיה...' : 'שמור והחל שינויים'}</span>
                            </button>

                          </div>

                        </div>
                      </motion.div>
                    )}

                    {/* STEP 4: LIVE CARD ON SCHOOL WEBSITE */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step-3-live-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4 max-w-sm mx-auto w-full text-center"
                      >
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>כרטיס המורה המעודכן שלך באתר בית הספר</span>
                        </div>

                        {/* Rendered Staff Card */}
                        <div className="bg-[#121c33] border-2 border-school-cyan/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl relative overflow-hidden">
                          <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-tr from-school-cyan/30 to-blue-500/30 border-2 border-school-cyan flex items-center justify-center text-school-cyan font-black text-xl shadow-lg">
                            {simHasPhoto ? '✓' : 'י״י'}
                          </div>

                          <div className="space-y-1">
                            <h3 className="text-base font-black text-white">{simName}</h3>
                            <p className="text-xs font-bold text-school-cyan">{simRoleDesc}</p>
                            <p className="text-[11px] font-mono text-school-muted">{simEmail}</p>
                          </div>

                          <p className="text-[11px] text-school-muted/90 bg-black/20 p-3 rounded-xl border border-white/5 leading-relaxed">
                            "{simBio}"
                          </p>

                          <div className="pt-2 border-t border-school-line/40 flex items-center justify-between text-[10px] text-emerald-400 font-bold">
                            <span>סטטוס: מעודכן ופעיל</span>
                            <span>מסונכרן בזמן אמת ✓</span>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            onClick={() => setCurrentStep(0)}
                            className="inline-flex items-center gap-1.5 text-xs text-school-cyan hover:underline font-bold cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>התחל את ההדמיה מחדש</span>
                          </button>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* 4 Summary Cards for printable / static review */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-school-cyan" />
              <span>תקציר השלבים המלא לעיונכם:</span>
            </h3>
            <span className="text-xs text-school-muted">ניתן להדפיס או לשלוח בווטסאפ לכל מורה</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((st, i) => (
              <div 
                key={st.id} 
                onClick={() => {
                  setCurrentStep(i);
                  setIsPlaying(false);
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                  currentStep === i 
                    ? 'bg-[#101b33] border-school-cyan shadow-md' 
                    : 'bg-[#090f1e] border-school-line/60 hover:border-school-line'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-xl bg-school-cyan/20 text-school-cyan font-black text-xs flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-[10px] font-bold text-school-muted">{st.badge}</span>
                </div>
                <h4 className="text-sm font-extrabold text-white">{st.title}</h4>
                <p className="text-xs text-school-muted leading-relaxed line-clamp-3">
                  {st.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
