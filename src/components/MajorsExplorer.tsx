import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Sparkles, Cpu, Trophy, Laptop, ArrowRight,
  CheckCircle2, Compass, GraduationCap, Clock, User, ChevronLeft,
  ExternalLink, Layers, Search, Filter, Database, Atom, Globe,
  TrendingUp, Languages, Users, FlaskConical, Code, Dna, FileText, Download
} from 'lucide-react';
import { SchoolMajor } from '../types';
import { getStoredMajors, subscribeToMajors } from '../services/majorsStorage';

interface MajorsExplorerProps {
  onBack?: () => void;
  onOpenAdmin?: () => void;
  onSelectMajor?: (majorId: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const MajorsExplorer: React.FC<MajorsExplorerProps> = ({ onBack, onOpenAdmin, onSelectMajor, onNavigateToTab }) => {
  const [majors, setMajors] = useState<SchoolMajor[]>(getStoredMajors());
  const [selectedDivision, setSelectedDivision] = useState<'all' | 'middle_school' | 'high_school'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsub = subscribeToMajors((fetched) => {
      setMajors(fetched);
    });
    return () => {
      unsub();
    };
  }, []);

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Database': return <Database className="w-6 h-6" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      case 'Atom': return <Atom className="w-6 h-6" />;
      case 'Globe': return <Globe className="w-6 h-6" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6" />;
      case 'Languages': return <Languages className="w-6 h-6" />;
      case 'Users': return <Users className="w-6 h-6" />;
      case 'FlaskConical': return <FlaskConical className="w-6 h-6" />;
      case 'Code': return <Code className="w-6 h-6" />;
      case 'Laptop': return <Laptop className="w-6 h-6" />;
      case 'Trophy': return <Trophy className="w-6 h-6" />;
      case 'Dna': return <Dna className="w-6 h-6" />;
      case 'Cpu': return <Cpu className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  const filteredMajors = (majors || []).filter(m => {
    if (!m) return false;
    const matchesDivision = selectedDivision === 'all' || m.division === selectedDivision;
    const q = (searchQuery || '').toLowerCase();
    const title = String(m.title || '').toLowerCase();
    const sDesc = String(m.shortDescription || '').toLowerCase();
    const fDesc = String(m.fullDescription || '').toLowerCase();
    const matchesSearch = 
      title.includes(q) ||
      sDesc.includes(q) ||
      fDesc.includes(q);
    return matchesDivision && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3 space-x-reverse">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 flex items-center gap-2 text-sm font-medium cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                חזרה לפורטל
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">מגמות ומסלולי לימוד תשפ"ז</h1>
              <p className="text-slate-400 text-xs mt-0.5">שש שנתי משה ארנס - 11 מגמות מובילות למצוינות ואקדמיה</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              סנכרון Real-Time בענן פעיל
            </span>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-all cursor-pointer"
              >
                עריכת מגמות
              </button>
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-850 p-4 rounded-2xl border border-slate-800">
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedDivision('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDivision === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              כל המגמות ({majors.length})
            </button>
            <button
              onClick={() => setSelectedDivision('high_school')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDivision === 'high_school' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              חטיבה עליונה ({majors.filter(m => m.division === 'high_school').length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="חיפוש מגמה / מסלול..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Majors Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMajors.map((major) => (
            <div
              key={major.id}
              onClick={() => {
                if (onSelectMajor) {
                  onSelectMajor(major.id);
                }
              }}
              className="bg-[#101b33]/90 hover:bg-[#152342] rounded-3xl p-6 border border-slate-700/60 hover:border-cyan-500/60 transition-all cursor-pointer flex flex-col justify-between group shadow-lg hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform shadow-inner">
                    {getIcon(major.iconName)}
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    {major.units || '5 יח"ל'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {major.title}
                  </h3>
                  <p className="text-slate-300 text-xs mt-2 leading-relaxed line-clamp-3">
                    {major.shortDescription || major.fullDescription}
                  </p>
                </div>

                {major.keyTopics && major.keyTopics.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    {major.keyTopics.slice(0, 2).map((h, i) => (
                      <div key={i} className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-cyan-400 font-bold group-hover:underline">
                <span>מעבר לעמוד המגמה המלא</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
