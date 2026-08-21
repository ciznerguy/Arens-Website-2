import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Sparkles, Cpu, Trophy, Laptop, ArrowLeft,
  CheckCircle2, Compass, GraduationCap, Clock, User, ChevronLeft,
  ExternalLink, Layers, Search, Filter, Database, Atom, Globe,
  TrendingUp, Languages, Users, FlaskConical, Code, Dna, FileText, Download, X
} from 'lucide-react';
import { SchoolMajor } from '../types';
import { getStoredMajors, subscribeToMajors } from '../services/majorsStorage';

interface HomepageMajorsSectionProps {
  onExploreAll?: () => void;
  onSelectMajor?: (majorId: string) => void;
}

export const HomepageMajorsSection: React.FC<HomepageMajorsSectionProps> = ({ onExploreAll, onSelectMajor }) => {
  const [majors, setMajors] = useState<SchoolMajor[]>(() => getStoredMajors());
  const [selectedDivision, setSelectedDivision] = useState<'all' | 'middle_school' | 'high_school'>('all');

  useEffect(() => {
    const unsub = subscribeToMajors((liveMajors) => {
      setMajors(liveMajors);
    });
    return () => {
      unsub();
    };
  }, []);

  const getIcon = (iconName?: string) => {
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

  const filteredMajors = majors.filter(m => {
    return selectedDivision === 'all' || m.division === selectedDivision;
  });

  return (
    <section id="majors-section" className="space-y-6 pt-6" dir="rtl">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-school-line/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest text-school-cyan uppercase">מסלולי מצוינות והשכלה גבוהה</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Firestore
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-school-text">מגמות ומסלולי לימוד</h3>
          <p className="text-xs text-school-muted">
            מגוון עשיר של 11 מגמות מתקדמות המשלבות ידע מדעי, טכנולוגי, הומניסטי ואמנותי
          </p>
        </div>

        {/* Division Filter Buttons & Explore All */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex bg-school-panel/80 p-1 rounded-xl border border-school-line text-xs font-bold">
            <button
              onClick={() => setSelectedDivision('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedDivision === 'all'
                  ? 'bg-school-cyan/20 text-school-cyan font-extrabold shadow-sm'
                  : 'text-school-muted hover:text-school-text'
              }`}
            >
              כל המגמות ({majors.length})
            </button>
            <button
              onClick={() => setSelectedDivision('high_school')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedDivision === 'high_school'
                  ? 'bg-school-cyan/20 text-school-cyan font-extrabold shadow-sm'
                  : 'text-school-muted hover:text-school-text'
              }`}
            >
              חטיבה עליונה ({majors.filter(m => m.division === 'high_school').length})
            </button>
          </div>

          {onExploreAll && (
            <button
              onClick={onExploreAll}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-school-cyan/10 hover:bg-school-cyan/20 text-school-cyan text-xs font-bold border border-school-cyan/30 transition-all cursor-pointer"
            >
              <span>לכל המגמות</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Majors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMajors.map((major) => (
          <div
            key={major.id}
            onClick={() => {
              if (onSelectMajor) {
                onSelectMajor(major.id);
              } else if (onExploreAll) {
                onExploreAll();
              }
            }}
            className="bg-school-panel/70 hover:bg-school-panel border border-school-line hover:border-school-cyan/50 rounded-2xl p-5 space-y-3 cursor-pointer transition-all duration-200 group flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-school-cyan/10 text-school-cyan border border-school-cyan/20 group-hover:scale-105 transition-transform">
                  {getIcon(major.iconName)}
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-school-violet/15 text-school-violet border border-school-violet/30">
                  {major.units || '5 יח"ל'}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-base text-school-text group-hover:text-school-cyan transition-colors">
                  {major.title}
                </h4>
                <p className="text-xs text-school-muted leading-relaxed line-clamp-2 mt-1">
                  {major.shortDescription || major.fullDescription}
                </p>
              </div>

              {major.keyTopics && major.keyTopics.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-school-line/40">
                  {major.keyTopics.slice(0, 2).map((h, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-school-muted truncate">
                      <CheckCircle2 className="w-3 h-3 text-school-cyan shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-school-cyan group-hover:underline">
              <span>מעבר לעמוד המגמה המלא</span>
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
