import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Sparkles, Cpu, Trophy, Laptop, ArrowRight,
  CheckCircle2, Compass, GraduationCap, Clock, User, ChevronLeft,
  ExternalLink, Layers, Search, Filter
} from 'lucide-react';
import { SchoolMajor } from '../types';
import { getStoredMajors, subscribeToMajors } from '../services/majorsStorage';

interface MajorsExplorerProps {
  onBack?: () => void;
  onOpenAdmin?: () => void;
}

export const MajorsExplorer: React.FC<MajorsExplorerProps> = ({ onBack, onOpenAdmin }) => {
  const [majors, setMajors] = useState<SchoolMajor[]>(getStoredMajors());
  const [selectedDivision, setSelectedDivision] = useState<'all' | 'middle_school' | 'high_school'>('all');
  const [selectedMajor, setSelectedMajor] = useState<SchoolMajor | null>(null);
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
      case 'Laptop': return <Laptop className="w-6 h-6" />;
      case 'Cpu': return <Cpu className="w-6 h-6" />;
      case 'Trophy': return <Trophy className="w-6 h-6" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  const filteredMajors = majors.filter(m => {
    const matchesDivision = selectedDivision === 'all' || m.division === selectedDivision;
    const matchesSearch = 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.fullDescription.toLowerCase().includes(searchQuery.toLowerCase());
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
              <h1 className="text-2xl font-bold text-white">מגמות ומסלולי לימוד</h1>
              <p className="text-slate-400 text-xs mt-0.5">שש שנתי משה ארנס - מובילים למצוינות</p>
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
              כל המסלולים ({majors.length})
            </button>
            <button
              onClick={() => setSelectedDivision('high_school')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDivision === 'high_school' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              חטיבה עליונה ({majors.filter(m => m.division === 'high_school').length})
            </button>
            <button
              onClick={() => setSelectedDivision('middle_school')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDivision === 'middle_school' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              חטיבת ביניים ({majors.filter(m => m.division === 'middle_school').length})
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredMajors.map((major) => (
            <div
              key={major.id}
              onClick={() => setSelectedMajor(major)}
              className="bg-slate-850 hover:bg-slate-800/90 rounded-3xl p-6 border border-slate-700/60 hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                    {getIcon(major.icon)}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    major.division === 'high_school' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30' : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {major.division === 'high_school' ? 'חטיבה עליונה' : 'חטיבת ביניים'}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {major.title}
                  </h3>
                  <p className="text-slate-300 text-xs md:text-sm mt-2 leading-relaxed line-clamp-3">
                    {major.shortDescription}
                  </p>
                </div>

                {major.highlights && major.highlights.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    {major.highlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-5 mt-5 border-t border-slate-700/50 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                <span>למידע מורחב ומלא</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Major Detail Modal */}
        {selectedMajor && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {getIcon(selectedMajor.icon)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedMajor.title}</h2>
                    <span className="text-xs text-cyan-400 font-semibold">
                      {selectedMajor.division === 'high_school' ? 'חטיבה עליונה' : 'חטיבת ביניים'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMajor(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">אודות המגמה</h4>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    {selectedMajor.fullDescription || selectedMajor.shortDescription}
                  </p>
                </div>

                {selectedMajor.highlights && selectedMajor.highlights.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">דגשים ונושאי לימוד</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedMajor.highlights.map((h, i) => (
                        <div key={i} className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 text-xs text-slate-300 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
                  <div className="bg-slate-800/40 p-3 rounded-xl">
                    <div className="text-slate-400">שכבות יעד:</div>
                    <div className="font-semibold text-white mt-0.5">{selectedMajor.targetGrades || 'כלל השכבות'}</div>
                  </div>
                  <div className="bg-slate-800/40 p-3 rounded-xl">
                    <div className="text-slate-400">היקף שעות:</div>
                    <div className="font-semibold text-white mt-0.5">{selectedMajor.hoursPerWeek || 'על פי תכנית'}</div>
                  </div>
                  <div className="bg-slate-800/40 p-3 rounded-xl col-span-2 sm:col-span-1">
                    <div className="text-slate-400">איש קשר:</div>
                    <div className="font-semibold text-white mt-0.5">{selectedMajor.contactPerson || 'רכז השכבה'}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  onClick={() => setSelectedMajor(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  סגור
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
