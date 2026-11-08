import React, { useEffect, useRef, useState } from 'react';
import { Mail } from 'lucide-react';

interface EmailContactButtonProps {
  email: string;
  name: string;
  label?: string;
  className?: string;
  iconClassName?: string;
}

// A mailto: link does nothing on a computer with no default mail program
// (common for people who use Gmail or Outlook in the browser).
// So the button opens a small menu: Gmail, Outlook, or the computer's mail program.
// The address itself is never shown on the page.
export function EmailContactButton({ email, name, label = 'פנייה במייל', className = '', iconClassName = 'w-3.5 h-3.5' }: EmailContactButtonProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const subject = `פנייה אל ${name} - שש שנתי משה ארנס`;
  const to = encodeURIComponent(email);
  const su = encodeURIComponent(subject);

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}`;
  const outlookUrl = `https://outlook.office.com/mail/deeplink/compose?to=${to}&subject=${su}`;
  const mailtoUrl = `mailto:${email}?subject=${su}`;

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const optionClass = 'block w-full text-right px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-[#1D4ED8] transition-colors';

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={className}
        title="בחירת דרך לשליחת מייל"
      >
        <Mail className={iconClassName} />
        <span>{label}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="relative z-10 mt-1.5 w-full min-w-[180px] bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden text-right"
          dir="rtl"
        >
          <a role="menuitem" href={gmailUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className={optionClass}>
            שליחה דרך Gmail
          </a>
          <a role="menuitem" href={outlookUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className={optionClass + ' border-t border-slate-100'}>
            שליחה דרך Outlook
          </a>
          <a role="menuitem" href={mailtoUrl} onClick={() => setOpen(false)} className={optionClass + ' border-t border-slate-100'}>
            תוכנת המייל במחשב
          </a>
        </div>
      )}
    </div>
  );
}
