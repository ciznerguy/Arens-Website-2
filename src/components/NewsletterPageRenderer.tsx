import React from 'react';
import { NewsletterPageData } from '../data/newsletterData';
import { QrCode, ExternalLink } from 'lucide-react';

interface NewsletterPageRendererProps {
  page: NewsletterPageData;
  scale?: number;
  isPrintMode?: boolean;
}

// Logo Component matching the official Moshe Arens emblem in the PDF
const SchoolLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = size === 'lg' ? 'w-24 h-24' : size === 'sm' ? 'w-12 h-12' : 'w-16 h-16';
  return (
    <div className={`relative ${sizeClasses} flex flex-col items-center justify-center`}>
      <svg viewBox="0 0 120 120" className="w-full h-full">
        {/* Curved text path */}
        <path id="curve" d="M 15 50 A 45 45 0 0 1 105 50" fill="none" />
        <text className="text-[9px] font-bold fill-slate-700" textAnchor="middle">
          <textPath href="#curve" startOffset="50%">
            בית ספר שש שנתי
          </textPath>
        </text>

        {/* Figures with heart */}
        <circle cx="45" cy="40" r="8" className="fill-[#7aa842]" />
        <path d="M 38 48 Q 45 65 52 50" className="stroke-[#7aa842] stroke-[5] fill-none stroke-linecap-round" />
        
        <circle cx="75" cy="40" r="8" className="fill-[#7aa842]" />
        <path d="M 68 50 Q 75 65 82 48" className="stroke-[#7aa842] stroke-[5] fill-none stroke-linecap-round" />

        {/* Hearts and flower leaves in center */}
        <circle cx="60" cy="48" r="4" className="fill-[#e05638]" />
        <circle cx="53" cy="42" r="3" className="fill-[#f59e0b]" />
        <circle cx="67" cy="42" r="3" className="fill-[#f59e0b]" />
        <circle cx="60" cy="38" r="3.5" className="fill-[#e05638]" />

        {/* Lower curve */}
        <path d="M 35 70 Q 60 95 85 70" fill="none" className="stroke-[#222] stroke-[2]" />
        <text x="60" y="80" textAnchor="middle" className="text-[11px] font-black fill-[#222]">
          משה ארנס
        </text>
        <text x="60" y="92" textAnchor="middle" className="text-[7.5px] font-bold fill-slate-600">
          מצמיח אדם וחברה
        </text>
      </svg>
    </div>
  );
};

export const NewsletterPageRenderer: React.FC<NewsletterPageRendererProps> = ({ 
  page, 
  isPrintMode = false 
}) => {
  const { content } = page;

  return (
    <div 
      data-newsletter-page={page.pageNumber}
      className={`relative w-full max-w-[760px] aspect-[1/1.414] bg-[#fbfbfa] text-slate-900 p-8 sm:p-12 shadow-2xl rounded-2xl border border-slate-300 flex flex-col justify-between overflow-hidden text-right font-sans select-text ${
        isPrintMode ? 'shadow-none border-none rounded-none bg-white p-6' : ''
      }`}
      dir="rtl"
    >
      {/* Dashed outer border frame like the PDF */}
      <div className="absolute inset-3.5 border-2 border-dashed border-slate-300/80 rounded-xl pointer-events-none" />

      {/* Watermark Logo in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
          <circle cx="50" cy="50" r="45" />
        </svg>
      </div>

      {/* PAGE 1: COVER */}
      {content.type === 'cover' && (
        <div className="relative z-10 h-full flex flex-col justify-between items-center text-center py-2">
          {/* Logo */}
          <div className="pt-2">
            <SchoolLogo size="lg" />
          </div>

          {/* Main Title Block (Terracotta / Coral Pill) */}
          <div className="w-full max-w-md my-4">
            <div className="bg-[#de6953] text-white py-4 px-6 rounded-3xl shadow-sm">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide">מידעון</h1>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-4 tracking-tight">
              שש שנתי ע״ש משה ארנס
            </p>
          </div>

          {/* Year Badge (Olive Green Pill on Right side) */}
          <div className="self-start -mr-8 sm:-mr-12 my-2">
            <div className="bg-[#9bb865] text-white px-8 py-3 rounded-l-3xl shadow-sm text-right">
              <p className="text-lg font-black tracking-wide">2026-2027</p>
              <p className="text-base font-bold">תשפ״ז</p>
            </div>
          </div>

          {/* School Building Photo */}
          <div className="w-full h-56 sm:h-64 rounded-xl overflow-hidden shadow-md border border-slate-200 mt-auto">
            <img 
              src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1000&auto=format&fit=crop&q=80" 
              alt="שש שנתי משה ארנס" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* PAGE 2: TABLE OF CONTENTS & DECLARATION */}
      {content.type === 'toc' && (
        <div className="relative z-10 h-full flex flex-col justify-between py-2">
          <div className="flex items-center justify-between">
            <div className="relative inline-block pb-2">
              <h2 className="text-3xl font-black text-[#de6953]">במידעון תמצאו</h2>
              <div className="h-1.5 bg-[#de6953] w-full rounded-full mt-1" />
            </div>
            <SchoolLogo size="sm" />
          </div>

          {/* Bullet Items */}
          <div className="space-y-4 my-6 pr-2">
            {content.data.items.map((item: string, idx: number) => (
              <div key={idx} className="flex items-center gap-3 text-lg font-black text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Hand-drawn style Green border box for Digital Health Declaration */}
          <div className="p-6 rounded-[32px] border-4 border-[#9bb865] bg-transparent text-center space-y-3 mt-auto mb-4">
            <h3 className="text-xl font-black text-slate-900">
              יש למלא הצהרת בריאות דיגיטלית
            </h3>
            <p className="text-sm font-bold text-slate-800">
              באמצעות הברקוד הבא
            </p>
            <p className="text-xs font-semibold text-slate-600">
              סרקו או לחצו למעבר
            </p>

            <div className="flex flex-col items-center justify-center pt-2">
              <div className="w-40 h-40 bg-white p-3 rounded-2xl border border-slate-300 shadow-sm flex items-center justify-center">
                <QrCode className="w-32 h-32 text-slate-950" />
              </div>
              <a 
                href={content.data.declarationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#7aa842] hover:underline"
              >
                <span>כניסה לפורטל משרד החינוך</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* PAGES 3-5: LETTERS (PRINCIPALS) */}
      {content.type === 'letter' && (
        <div className="relative z-10 h-full flex flex-col justify-between py-2">
          {/* Header Banner */}
          <div className="flex items-center justify-between">
            <div className="bg-[#de6953] text-white px-8 py-2.5 rounded-3xl shadow-sm">
              <h2 className="text-xl font-black">{content.data.authorTitle}</h2>
            </div>
            <SchoolLogo size="sm" />
          </div>

          {/* Salutation */}
          {content.data.salutation && (
            <p className="text-xl font-black text-slate-900 mt-6">{content.data.salutation}</p>
          )}

          {/* Paragraphs */}
          <div className="space-y-3.5 text-sm sm:text-[15px] leading-relaxed text-slate-800 text-justify my-4">
            {content.data.paragraphs.map((p: string, idx: number) => {
              const isCenterHighlight = p.includes('*צומחים לדעת');
              return isCenterHighlight ? (
                <div key={idx} className="my-6 text-center font-black text-slate-900 text-lg">
                  *צומחים לדעת, צומחים להיות וצומחים לעשות*
                </div>
              ) : (
                <p key={idx}>{p}</p>
              );
            })}
          </div>

          {/* Signature */}
          {content.data.signature && (
            <div className="mt-auto pt-6 text-center space-y-1 text-slate-900 font-bold">
              <p className="text-base">בברכה,</p>
              {content.data.signature.split('\n').map((line: string, i: number) => (
                <p key={i} className={i === 0 ? 'text-lg font-black' : 'text-base font-semibold'}>
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PAGE 6: CLIMATE TREATY */}
      {content.type === 'climate' && (
        <div className="relative z-10 h-full flex flex-col justify-between py-2">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <SchoolLogo size="sm" />
            </div>
            <h2 className="text-3xl font-black text-[#1e3a8a] tracking-tight">אמנת האקלים שלנו</h2>
            <p className="text-xs text-slate-700 max-w-lg mx-auto leading-relaxed">
              {content.data.preamble}
            </p>
            <p className="text-xs font-bold text-slate-900 italic">
              {content.data.callout}
            </p>
          </div>

          <div className="my-2 bg-[#9bb865]/20 text-slate-900 text-center py-1.5 px-4 rounded-xl text-xs font-black">
            לפיכך אנו מתחייבים לפעול ברוח העקרונות הבאים:
          </div>

          {/* Principles with side icons */}
          <div className="space-y-2">
            {content.data.principles.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-2xl bg-slate-100/80 border border-slate-200">
                <span className="w-3 h-3 rounded-full bg-[#9bb865] shrink-0" />
                <span className="text-xs font-bold text-slate-800 leading-snug">{item.text}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-center font-bold text-[#1e3a8a] pt-3 border-t border-slate-200 mt-2">
            {content.data.footer}
          </p>
        </div>
      )}

      {/* PAGES 7, 8, 9, 10, 13: TABLES */}
      {content.type === 'table' && (
        <div className="relative z-10 h-full flex flex-col justify-between py-2">
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <div className="bg-[#de6953] text-white px-6 py-2 rounded-3xl text-base font-black shadow-sm">
              {page.title.includes('דרכי התקשרות') ? 'דרכי התקשרות' : page.title}
            </div>
            {content.data.schoolPhone && (
              <div className="bg-[#9bb865] text-white px-4 py-1.5 rounded-3xl text-xs font-black">
                בית ספר ארנס- {content.data.schoolPhone}
              </div>
            )}
          </div>

          {/* Subheader */}
          {content.data.sections && (
            <div className="space-y-4 my-3 flex-1 flex flex-col justify-start">
              {content.data.sections.map((sec: any, sIdx: number) => (
                <div key={sIdx} className="space-y-1.5">
                  <h3 className="text-base font-black text-slate-900">
                    {sec.title}
                  </h3>
                  <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-right border-collapse text-xs">
                      <thead className="bg-[#9bb865] text-slate-950 font-black">
                        <tr>
                          <th className="p-2 border-l border-slate-400">תפקיד</th>
                          <th className="p-2 border-l border-slate-400">שם</th>
                          <th className="p-2">כתובת מייל</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dashed divide-slate-300 bg-white">
                        {sec.rows.map((r: any, rIdx: number) => (
                          <tr key={rIdx} className={rIdx % 2 === 1 ? 'bg-slate-50' : ''}>
                            <td className="p-2 font-bold text-slate-900 border-l border-dashed border-slate-300">{r.role}</td>
                            <td className="p-2 text-slate-800 border-l border-dashed border-slate-300">{r.name}</td>
                            <td className="p-2 font-mono text-[11px] text-slate-900 dir-ltr text-right">
                              {r.email}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bell Schedule Table (Page 13) */}
          {content.data.scheduleTable && (
            <div className="my-2 flex-1 flex flex-col justify-center">
              <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-right border-collapse text-[11px]">
                  <thead className="bg-[#9bb865] text-slate-950 font-black">
                    <tr>
                      <th className="p-1.5 border-l border-slate-400">שיעור/הפסקה</th>
                      <th className="p-1.5 text-center border-l border-slate-400">משעה</th>
                      <th className="p-1.5 text-center border-l border-slate-400">עד שעה</th>
                      <th className="p-1.5 text-center">משך</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashed divide-slate-300 bg-white">
                    {content.data.scheduleTable.map((row: any, idx: number) => (
                      <tr 
                        key={idx} 
                        className={row.isBreak ? 'bg-amber-100/70 font-black text-amber-950' : (idx % 2 === 1 ? 'bg-slate-50' : '')}
                      >
                        <td className="p-1 font-bold border-l border-dashed border-slate-300">{row.period}</td>
                        <td className="p-1 text-center font-mono border-l border-dashed border-slate-300">{row.start}</td>
                        <td className="p-1 text-center font-mono border-l border-dashed border-slate-300">{row.end}</td>
                        <td className="p-1 text-center font-semibold">{row.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PAGES 11-12: HOLIDAYS & VACATIONS */}
      {content.type === 'schedule' && (
        <div className="relative z-10 h-full flex flex-col justify-between py-2">
          <div className="flex items-center justify-between">
            <div className="bg-[#de6953] text-white px-6 py-2 rounded-3xl text-lg font-black shadow-sm">
              {page.title.includes('חלק ב') ? 'פסח ומועדי אביב' : 'לוח חופשות תשפ״ז'}
            </div>
            <SchoolLogo size="sm" />
          </div>

          <div className="space-y-3 my-4 pr-1">
            {content.data.events.map((ev: any, idx: number) => (
              <div key={idx} className="space-y-0.5 border-b border-dashed border-slate-300 pb-2">
                <h3 className="text-base font-black text-[#9bb865]">{ev.holiday}</h3>
                <p className="text-xs text-slate-800 leading-relaxed font-semibold">{ev.dates}</p>
                {ev.note && (
                  <p className="text-xs font-bold text-amber-800">{ev.note}</p>
                )}
                {ev.resume && (
                  <p className="text-xs font-black text-slate-900">{ev.resume}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGES 14-15: TEACHERS */}
      {content.type === 'teachers' && (
        <div className="relative z-10 h-full flex flex-col justify-between py-2">
          <div className="flex items-center justify-between">
            <div className="bg-[#de6953] text-white px-6 py-2 rounded-3xl text-lg font-black shadow-sm">
              {page.title}
            </div>
            <SchoolLogo size="sm" />
          </div>

          {/* Leaders line */}
          <div className="my-2 text-xs font-black text-slate-900">
            {content.data.lead && <p>{content.data.lead}</p>}
            {content.data.leaders && (
              <div className="flex justify-between">
                {content.data.leaders.map((l: string, i: number) => (
                  <span key={i}>{l}</span>
                ))}
              </div>
            )}
          </div>

          {/* 3 Columns Grid */}
          <div className="grid grid-cols-3 gap-2 border border-slate-300 rounded-xl overflow-hidden bg-white">
            {content.data.columns.map((col: any, cIdx: number) => (
              <div key={cIdx} className="border-l border-slate-300 last:border-l-0">
                <div className="bg-[#9bb865] text-slate-950 font-black text-center py-1.5 text-xs">
                  {col.grade}
                </div>
                <div className="p-1.5 sm:p-2 space-y-1 text-[10.5px] sm:text-[11px] text-slate-800">
                  {col.classes.map((cls: string, clsIdx: number) => (
                    <div key={clsIdx} className="border-b border-dashed border-slate-200 pb-0.5 last:border-b-0 font-semibold leading-snug">
                      {cls}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 16: TRANSIT & BUSES */}
      {content.type === 'transit' && (
        <div className="relative z-10 h-full flex flex-col justify-between py-2">
          <div className="flex items-center justify-between">
            <div className="bg-[#de6953] text-white px-6 py-2 rounded-3xl text-lg font-black shadow-sm">
              לוח הסעות
            </div>
            <SchoolLogo size="sm" />
          </div>

          {/* Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden my-2 bg-white">
            <table className="w-full text-right border-collapse text-xs">
              <thead className="bg-[#9bb865] text-slate-950 font-black">
                <tr>
                  <th className="p-2 border-l border-slate-400">קווי אוטובוס</th>
                  <th className="p-2 border-l border-slate-400">תחנה</th>
                  <th className="p-2 text-center">שעת איסוף</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed divide-slate-300 text-[11px]">
                {content.data.studentBuses.map((bus: any, i: number) => (
                  <tr key={i}>
                    <td className="p-2 font-bold border-l border-dashed border-slate-300">{bus.line}</td>
                    <td className="p-2 border-l border-dashed border-slate-300">{bus.route}</td>
                    <td className="p-2 text-center font-mono font-bold">{bus.pickupTime}</td>
                  </tr>
                ))}
                {content.data.publicBuses.map((pb: any, i: number) => (
                  <tr key={`p-${i}`} className="bg-slate-50">
                    <td className="p-2 font-bold border-l border-dashed border-slate-300">{pb.line}<br/><span className="text-[9px] text-slate-500 font-normal">תחבורה ציבורית</span></td>
                    <td className="p-2 border-l border-dashed border-slate-300">{pb.stop}</td>
                    <td className="p-2 text-center font-semibold text-[10px]">{pb.freq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Transit Box */}
          <div className="space-y-1 pt-2">
            <div className="bg-[#de6953] text-white px-4 py-1.5 rounded-2xl text-xs font-black inline-block">
              דרכי הגעה בתחב״צ
            </div>
            <div className="p-3 rounded-2xl border-2 border-blue-200 bg-blue-50/50 text-center space-y-1 text-[11px] font-bold text-slate-900">
              <p className="text-sm font-black text-blue-900">שש שנתי ארנס</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 pt-1 text-slate-800 text-[10px]">
                {content.data.publicTransitSummary.map((t: string, idx: number) => (
                  <div key={idx} className="bg-white p-1 rounded border border-blue-200">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 17: PARENT MEETINGS & BOOK LENDING */}
      {content.type === 'events' && (
        <div className="relative z-10 h-full flex flex-col justify-between py-2">
          <div className="flex items-center justify-between">
            <div className="bg-[#de6953] text-white px-6 py-2 rounded-3xl text-lg font-black shadow-sm">
              אסיפות הורים
            </div>
            <SchoolLogo size="sm" />
          </div>

          {/* Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden my-3 bg-white">
            <table className="w-full text-right border-collapse text-xs">
              <thead className="bg-[#9bb865] text-slate-950 font-black">
                <tr>
                  <th className="p-2 text-center border-l border-slate-400">תאריך</th>
                  <th className="p-2 border-l border-slate-400">שכבה</th>
                  <th className="p-2 text-center">שעה</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed divide-slate-300 text-xs">
                {content.data.parentMeetings.map((m: any, idx: number) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50' : ''}>
                    <td className="p-2 text-center font-mono border-l border-dashed border-slate-300">{m.date}</td>
                    <td className="p-2 font-bold border-l border-dashed border-slate-300">{m.grade}</td>
                    <td className="p-2 text-center font-mono font-black text-slate-900">{m.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Book Lending Coordinator */}
          <div className="space-y-3 pt-2">
            <div className="bg-[#de6953] text-white px-6 py-2 rounded-3xl text-base font-black inline-block shadow-sm">
              רפרנטית השאלת ספרים
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-300 text-center space-y-2 shadow-sm">
              <p className="text-xl font-black text-slate-900">{content.data.bookLending.name}</p>
              <p className="text-sm font-bold text-[#9bb865]">{content.data.bookLending.role}</p>
              <p className="text-lg font-mono font-black text-slate-900 dir-ltr">{content.data.bookLending.phone}</p>
            </div>
          </div>
        </div>
      )}

      {/* Page Number Indicator */}
      <div className="relative z-10 pt-2 flex items-center justify-between text-[10px] text-slate-400 font-bold">
        <span>שש שנתי ע״ש משה ארנס פתח תקווה</span>
        <span>עמוד {page.pageNumber} מתוך 17</span>
      </div>
    </div>
  );
};
