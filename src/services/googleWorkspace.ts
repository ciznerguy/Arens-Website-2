import { TeacherEvent, WorkshopRegistration, Workshop } from '../types';

const formatToIsraeliDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) return trimmed;
  const parts = trimmed.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    const cleanDay = day.split('T')[0];
    return `${cleanDay.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }
  return dateStr;
};

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/drive.file'
].join(' ');

// Token state in memory & sessionStorage
let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

export const getStoredAccessToken = (): string | null => {
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }
  try {
    const stored = sessionStorage.getItem('arens_google_access_token');
    const expires = sessionStorage.getItem('arens_google_token_expires');
    if (stored && expires && Number(expires) > Date.now()) {
      cachedAccessToken = stored;
      tokenExpiresAt = Number(expires);
      return stored;
    }
  } catch (e) {
    console.error('Failed reading token from storage', e);
  }
  return null;
};

export const setStoredAccessToken = (token: string, expiresInSeconds: number = 3600) => {
  cachedAccessToken = token;
  tokenExpiresAt = Date.now() + (expiresInSeconds - 60) * 1000;
  try {
    sessionStorage.setItem('arens_google_access_token', token);
    sessionStorage.setItem('arens_google_token_expires', tokenExpiresAt.toString());
  } catch (e) {
    console.error('Failed storing token', e);
  }
};

export const clearStoredAccessToken = () => {
  cachedAccessToken = null;
  tokenExpiresAt = 0;
  try {
    sessionStorage.removeItem('arens_google_access_token');
    sessionStorage.removeItem('arens_google_token_expires');
  } catch (e) {
    console.error('Failed clearing token', e);
  }
};

// Check if GIS is loaded or load it dynamically
export const ensureGoogleIdentityLoaded = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject(new Error('שגיאה בטעינת ספריית Google Identity Services'));
    };
    document.head.appendChild(script);
  });
};

// Prompt OAuth Token Client
export const requestGoogleAccessToken = async (): Promise<string> => {
  const existingToken = getStoredAccessToken();
  if (existingToken) return existingToken;

  await ensureGoogleIdentityLoaded();

  return new Promise((resolve, reject) => {
    try {
      const google = (window as any).google;
      if (!google?.accounts?.oauth2) {
        throw new Error('Google OAuth2 client is not available');
      }

      // If client ID is defined in Vite env, use it, otherwise use platform client
      const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || 
                       (window as any).gapiClientId || 
                       '363823936832-823e1dm08ek262dpflcens14os5bnsuu.apps.googleusercontent.com';

      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: (response: any) => {
          if (response.error) {
            console.error('OAuth token error:', response);
            reject(new Error(response.error_description || response.error || 'אימות Google בוטל או נכשל'));
            return;
          }
          if (response.access_token) {
            const expiresIn = Number(response.expires_in) || 3600;
            setStoredAccessToken(response.access_token, expiresIn);
            resolve(response.access_token);
          } else {
            reject(new Error('לא התקבל Access Token מ-Google'));
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err: any) {
      reject(err);
    }
  });
};

// ==========================================
// GOOGLE SHEETS API INTEGRATION
// ==========================================

export interface SheetCreationResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
}

/**
 * Creates a brand new Google Spreadsheet for the Event with styled headers
 */
export const createEventGoogleSheet = async (
  event: TeacherEvent,
  registrations: WorkshopRegistration[],
  token?: string
): Promise<SheetCreationResult> => {
  const accessToken = token || (await requestGoogleAccessToken());
  const title = `רישום סדנאות - ${event.title} - ארנס (${new Date().toLocaleDateString('he-IL')})`;

  const payload = {
    properties: {
      title,
      locale: 'iw_IL',
      autoRecalc: 'ON_CHANGE',
      timeZone: 'Asia/Jerusalem'
    },
    sheets: [
      {
        properties: {
          title: 'נרשמים לסדנאות',
          gridProperties: {
            rowCount: 200,
            columnCount: 12,
            frozenRowCount: 1
          },
          rightToLeft: true
        }
      }
    ]
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`שגיאה ביצירת גיליון Google Sheets: ${errorBody}`);
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Write headers & all current registrations
  await syncAllRegistrationsToGoogleSheet(spreadsheetId, event, registrations, accessToken);

  return {
    spreadsheetId,
    spreadsheetUrl
  };
};

/**
 * Overwrites / Syncs all current registrations into the Google Sheet
 */
export const syncAllRegistrationsToGoogleSheet = async (
  spreadsheetId: string,
  event: TeacherEvent,
  registrations: WorkshopRegistration[],
  token?: string
): Promise<void> => {
  const accessToken = token || (await requestGoogleAccessToken());

  // Headers matching the requested requirements
  const headerRow = [
    'תאריך ושעת רישום',
    'שם מלא',
    'טלפון',
    'אימייל',
    'תפקיד / מקצוע הוראה',
    'סדנה שנבחרה',
    'חדר / מיקום',
    'שעות פעילות',
    'מנחה הסדנה',
    'הערות מיוחדות',
    'מזהה רישום'
  ];

  const rows = registrations.map(reg => {
    const workshop = event.workshops.find(w => w.id === reg.workshopId);
    return [
      reg.registeredAt || new Date().toLocaleString('he-IL'),
      reg.fullName,
      reg.phone,
      reg.email,
      reg.roleOrSubject,
      reg.workshopTitle || workshop?.title || 'סדנה כללית',
      reg.room || workshop?.room || '',
      reg.timeSlot || workshop?.timeSlot || '',
      reg.instructor || workshop?.instructor || '',
      reg.notes || '',
      reg.id
    ];
  });

  // Clear existing content from sheet first
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'נרשמים לסדנאות'!A1:Z500:clear`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (e) {
    console.warn('Clear range notice:', e);
  }

  // Update with full dataset
  const values = [headerRow, ...rows];
  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'נרשמים לסדנאות'!A1?valueInputOption=USER_ENTERED`;

  const response = await fetch(updateUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      range: "'נרשמים לסדנאות'!A1",
      majorDimension: 'ROWS',
      values
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`שגיאה בעדכון Google Sheets: ${errorBody}`);
  }
};

/**
 * Appends a single new registration row to an existing Google Sheet
 */
export const appendRegistrationToGoogleSheet = async (
  spreadsheetId: string,
  event: TeacherEvent,
  reg: WorkshopRegistration,
  token?: string,
  silentOnly: boolean = false
): Promise<boolean> => {
  let accessToken = token || getStoredAccessToken();
  if (!accessToken) {
    if (silentOnly) {
      // In silent mode (e.g. general teacher registering), do not pop up Google sign-in
      return false;
    }
    accessToken = await requestGoogleAccessToken();
  }
  if (!accessToken) return false;

  const workshop = event.workshops.find(w => w.id === reg.workshopId);

  const row = [
    reg.registeredAt || new Date().toLocaleString('he-IL'),
    reg.fullName,
    reg.phone,
    reg.email,
    reg.roleOrSubject,
    reg.workshopTitle || workshop?.title || 'סדנה כללית',
    reg.room || workshop?.room || '',
    reg.timeSlot || workshop?.timeSlot || '',
    reg.instructor || workshop?.instructor || '',
    reg.notes || '',
    reg.id
  ];

  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'נרשמים לסדנאות'!A:K:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(appendUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: [row]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    console.warn('Auto-append row warning:', err);
    return false;
  }
  return true;
};

// ==========================================
// GOOGLE DOCS API INTEGRATION
// ==========================================

export interface DocCreationResult {
  documentId: string;
  documentUrl: string;
}

/**
 * 2.2 Generates a comprehensive formatted Assignment Schedule Google Doc
 */
export const createAssignmentGoogleDoc = async (
  event: TeacherEvent,
  registrations: WorkshopRegistration[],
  token?: string
): Promise<DocCreationResult> => {
  const accessToken = token || (await requestGoogleAccessToken());
  const title = `דוח שיבוץ מורים לסדנאות - ${event.title} - ארנס`;

  // 1. Create document
  const createResp = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });

  if (!createResp.ok) {
    const err = await createResp.text();
    throw new Error(`שגיאה ביצירת מסמך Google Docs: ${err}`);
  }

  const doc = await createResp.json();
  const documentId = doc.documentId;
  const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;

  // 2. Build structured text payload
  let textContent = '';
  textContent += `בית הספר השש-שנתי ע"ש משה ארנס - פתח תקוה\n`;
  textContent += `דוח שיבוץ מורים וסדנאות: ${event.title}\n`;
  textContent += `תאריך האירוע: ${event.date} | שעות: ${event.hours} | מיקום מרכזי: ${event.location}\n`;
  textContent += `איש קשר לפניות: ${event.contactPerson} (${event.contactEmail})\n`;
  textContent += `סה"כ נרשמים במערכת: ${registrations.length} מורים\n`;
  textContent += `הופק בתאריך: ${new Date().toLocaleString('he-IL')}\n\n`;

  if (event.schedule && event.schedule.length > 0) {
    textContent += `--- סדר יום ולוח זמנים כללי ---\n`;
    event.schedule.forEach(s => {
      textContent += `• ${s.time} - ${s.activity} ${s.location ? `(${s.location})` : ''}\n`;
    });
    textContent += `\n`;
  }

  textContent += `====================================================\n`;
  textContent += `פירוט סדנאות ורשימות משובצים:\n`;
  textContent += `====================================================\n\n`;

  event.workshops.forEach((workshop, wIdx) => {
    const workshopRegs = registrations.filter(r => r.workshopId === workshop.id);
    const capacityPct = Math.round((workshopRegs.length / workshop.maxCapacity) * 100);

    textContent += `[סדנה #${wIdx + 1}] ${workshop.title}\n`;
    textContent += `מנחה / מרצה: ${workshop.instructor}\n`;
    textContent += `מיקום / חדר: ${workshop.room} | שעות: ${workshop.timeSlot}\n`;
    textContent += `תפוסה: ${workshopRegs.length} מתוך ${workshop.maxCapacity} מקומות (${capacityPct}% תפוסה)\n`;
    if (workshop.description) {
      textContent += `תיאור: ${workshop.description}\n`;
    }
    textContent += `רשימת המורים המשובצים:\n`;

    if (workshopRegs.length === 0) {
      textContent += `  (טרם נרשמו מורים לסדנה זו)\n`;
    } else {
      workshopRegs.forEach((reg, rIdx) => {
        textContent += `  ${rIdx + 1}. ${reg.fullName} | טלפון: ${reg.phone} | אימייל: ${reg.email} | תפקיד: ${reg.roleOrSubject} ${reg.notes ? `[הערות: ${reg.notes}]` : ''}\n`;
      });
    }

    textContent += `\n----------------------------------------------------\n\n`;
  });

  textContent += `בברכת יום פורה ומעצים,\nהנהלת שש-שנתי ע"ש משה ארנס\n`;

  // 3. Batch insert text into document
  const updateResp = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: textContent
          }
        }
      ]
    })
  });

  if (!updateResp.ok) {
    const err = await updateResp.text();
    console.warn('Notice inserting doc text:', err);
  }

  return {
    documentId,
    documentUrl
  };
};

/**
 * 2.2 Generates Door Signs Google Doc (1 page / section per workshop with room, title, instructor and attendance check)
 */
export const createDoorSignsGoogleDoc = async (
  event: TeacherEvent,
  registrations: WorkshopRegistration[],
  token?: string
): Promise<DocCreationResult> => {
  const accessToken = token || (await requestGoogleAccessToken());
  const title = `שלטי דלתות לסדנאות - ${event.title} - ארנס`;

  const createResp = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });

  if (!createResp.ok) {
    const err = await createResp.text();
    throw new Error(`שגיאה ביצירת מסמך שלטי דלתות: ${err}`);
  }

  const doc = await createResp.json();
  const documentId = doc.documentId;
  const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;

  let textContent = '';
  textContent += `בית הספר השש-שנתי ע"ש משה ארנס - פתח תקוה\n`;
  textContent += `שלטי דלתות ורישום נוכחות: ${event.title}\n`;
  textContent += `תאריך: ${event.date} | לוח זמנים: ${event.hours}\n\n`;

  event.workshops.forEach((workshop, wIdx) => {
    const workshopRegs = registrations.filter(r => r.workshopId === workshop.id);

    textContent += `\n\n============================================================\n`;
    textContent += `                    חדר: ${workshop.room}\n`;
    textContent += `============================================================\n\n`;
    textContent += `שם הסדנה: ${workshop.title}\n`;
    textContent += `מנחה: ${workshop.instructor}\n`;
    textContent += `שעות הפעילות: ${workshop.timeSlot}\n`;
    textContent += `תפוסה: ${workshopRegs.length} / ${workshop.maxCapacity} משתתפים\n\n`;
    textContent += `--- דף רישום נוכחות בכניסה לחדר ---\n\n`;

    if (workshopRegs.length === 0) {
      textContent += `[  ] ___________________________ (מקום פנוי)\n`;
      textContent += `[  ] ___________________________ (מקום פנוי)\n`;
      textContent += `[  ] ___________________________ (מקום פנוי)\n`;
    } else {
      workshopRegs.forEach((reg, rIdx) => {
        textContent += `[  ]  ${rIdx + 1}.  ${reg.fullName.padEnd(25, ' ')} | תפקיד: ${reg.roleOrSubject}\n`;
      });
      // Blank rows for walk-ins
      textContent += `[  ]  _____. ___________________________ (הצטרפות במקום)\n`;
      textContent += `[  ]  _____. ___________________________ (הצטרפות במקום)\n`;
    }

    textContent += `\n\n(נא לתלות על דלת החדר לפני תחילת המושב)\n`;
    textContent += `------------------------------------------------------------\n`;
  });

  await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: textContent
          }
        }
      ]
    })
  });

  return {
    documentId,
    documentUrl
  };
};

/**
 * Copy tab-delimited registrations to clipboard for 1-click paste into Google Sheets / Excel
 */
export const copyRegistrationsToClipboard = async (
  event: TeacherEvent,
  registrations: WorkshopRegistration[]
): Promise<boolean> => {
  const header = ['תאריך רישום', 'שם מלא', 'טלפון', 'אימייל', 'תפקיד', 'סדנה', 'חדר', 'שעות', 'מנחה', 'הערות'];
  const rows = registrations.map(reg => {
    const workshop = event.workshops.find(w => w.id === reg.workshopId);
    return [
      reg.registeredAt || '',
      reg.fullName || '',
      reg.phone || '',
      reg.email || '',
      reg.roleOrSubject || '',
      reg.workshopTitle || workshop?.title || '',
      workshop?.room || reg.room || '',
      workshop?.timeSlot || reg.timeSlot || '',
      workshop?.instructor || reg.instructor || '',
      reg.notes || ''
    ].join('\t');
  });

  const tsv = [header.join('\t'), ...rows].join('\n');
  try {
    await navigator.clipboard.writeText(tsv);
    return true;
  } catch (e) {
    console.error('Clipboard copy failed:', e);
    return false;
  }
};

/**
 * Direct 1-Click Export to Google Sheets:
 * Copies tab-separated data to clipboard, downloads formatted CSV file, and opens sheets.new
 */
export const openGoogleSheetsDirect = async (
  event: TeacherEvent,
  registrations: WorkshopRegistration[]
): Promise<{ success: boolean; message: string }> => {
  // 1. Copy to clipboard
  await copyRegistrationsToClipboard(event, registrations);
  
  // 2. Download CSV
  downloadRegistrationsCSV(event, registrations);

  // 3. Open Google Sheets
  window.open('https://sheets.new', '_blank', 'noopener,noreferrer');

  return {
    success: true,
    message: 'קובץ הנתונים הורד, והטבלה הועתקה ללוח! בגיליון Google Sheets שנפתח פשוט הדבק (Ctrl+V) או טען את הקובץ.'
  };
};

/**
 * Direct 1-Click Export to Google Docs (and downloadable Word / Google Docs .doc file)
 */
export const openGoogleDocsDirect = async (
  event: TeacherEvent,
  registrations: WorkshopRegistration[]
): Promise<{ success: boolean; message: string }> => {
  // 1. Download formatted .doc file
  downloadAssignmentDoc(event, registrations);

  // 2. Open Google Docs
  window.open('https://docs.new', '_blank', 'noopener,noreferrer');

  return {
    success: true,
    message: 'מסמך השיבוץ הופק והורד בהצלחה! ב-Google Docs שנפתח תוכלו לגרור את הקובץ או להדביק את הנתונים.'
  };
};

/**
 * Downloads a rich formatted .doc (Word / Google Docs compatible HTML file)
 */
export const downloadAssignmentDoc = (
  event: TeacherEvent,
  registrations: WorkshopRegistration[]
) => {
  let html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>דוח שיבוץ מורים - ${event.title}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; direction: rtl; text-align: right; margin: 30px; }
        h1 { color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 8px; font-size: 24px; }
        h2 { color: #0369a1; font-size: 18px; margin-top: 25px; }
        h3 { color: #0f172a; font-size: 15px; margin-top: 15px; }
        p { font-size: 13px; color: #334155; line-height: 1.6; }
        .meta-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; margin-bottom: 25px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 25px; font-size: 12px; }
        th { background: #0284c7; color: #ffffff; font-weight: bold; text-align: right; padding: 8px 10px; border: 1px solid #0284c7; }
        td { padding: 8px 10px; border: 1px solid #cbd5e1; text-align: right; }
        tr:nth-child(even) { background-color: #f1f5f9; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; background: #e0f2fe; color: #0369a1; font-weight: bold; font-size: 11px; }
        .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 15px; font-size: 11px; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <h1>בית הספר השש-שנתי ע"ש משה ארנס - פתח תקוה</h1>
      <h2>דוח שיבוץ מורים לסדנאות: ${event.title}</h2>
      
      <div class="meta-box">
        <p><strong>תאריך האירוע:</strong> ${event.date ? formatToIsraeliDate(event.date) : 'טרם נקבע'} &nbsp;|&nbsp; <strong>שעות:</strong> ${event.hours} &nbsp;|&nbsp; <strong>מיקום:</strong> ${event.location}</p>
        <p><strong>איש קשר לפניות:</strong> ${event.contactPerson || 'מזכירות בית הספר'} (${event.contactEmail || ''})</p>
        <p><strong>סה"כ מורים רשומים במערכת:</strong> ${registrations.length}</p>
        <p><strong>תאריך הפקת הדוח:</strong> ${new Date().toLocaleString('he-IL')}</p>
      </div>
  `;

  if (event.schedule && event.schedule.length > 0) {
    html += `
      <h3>לוח זמנים וסדר יום כללי</h3>
      <table>
        <thead>
          <tr>
            <th style="width: 120px;">שעה</th>
            <th>פעילות</th>
            <th style="width: 180px;">מיקום</th>
          </tr>
        </thead>
        <tbody>
    `;
    event.schedule.forEach(s => {
      html += `<tr><td><strong>${s.time}</strong></td><td>${s.activity}</td><td>${s.location || ''}</td></tr>`;
    });
    html += `</tbody></table>`;
  }

  html += `<h2>פירוט הסדנאות ורשימות המורים המשובצים</h2>`;

  event.workshops.forEach((ws, idx) => {
    const wsRegs = registrations.filter(r => r.workshopId === ws.id);
    html += `
      <div style="page-break-inside: avoid; margin-top: 20px;">
        <h3>[סדנה #${idx + 1}] ${ws.title}</h3>
        <p>
          <strong>מנחה:</strong> ${ws.instructor} &nbsp;|&nbsp;
          <strong>מיקום / חדר:</strong> ${ws.room} &nbsp;|&nbsp;
          <strong>שעות:</strong> ${ws.timeSlot} &nbsp;|&nbsp;
          <strong>תפוסה:</strong> ${wsRegs.length} מתוך ${ws.maxCapacity} (${Math.round((wsRegs.length / ws.maxCapacity) * 100)}%)
        </p>
        ${ws.description ? `<p style="font-style: italic; color: #475569;">${ws.description}</p>` : ''}
        
        <table>
          <thead>
            <tr>
              <th style="width: 35px;">#</th>
              <th>שם המורה</th>
              <th>טלפון</th>
              <th>אימייל</th>
              <th>תפקיד / מקצוע</th>
              <th>הערות</th>
            </tr>
          </thead>
          <tbody>
    `;

    if (wsRegs.length === 0) {
      html += `<tr><td colspan="6" style="text-align: center; color: #94a3b8;">טרם נרשמו מורים לסדנה זו</td></tr>`;
    } else {
      wsRegs.forEach((r, rIdx) => {
        html += `
          <tr>
            <td>${rIdx + 1}</td>
            <td><strong>${r.fullName}</strong></td>
            <td>${r.phone || '-'}</td>
            <td>${r.email || '-'}</td>
            <td>${r.roleOrSubject || '-'}</td>
            <td>${r.notes || '-'}</td>
          </tr>
        `;
      });
    }

    html += `</tbody></table></div>`;
  });

  html += `
      <div class="footer">
        הופק באמצעות מערכת ניהול הסדנאות והאירועים - שש-שנתי ע"ש משה ארנס פתח תקוה
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF' + html], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `דוח שיבוץ מורים - ${event.title}.doc`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Opens a print-friendly window with the full assignment report
 */
export const openPrintableAssignmentReport = (
  event: TeacherEvent,
  registrations: WorkshopRegistration[]
) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('נא לאפשר חלונות קופצים בדפדפן כדי להציג את הדוח להדפסה.');
    return;
  }

  let content = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="utf-8">
      <title>דוח שיבוץ מורים - ${event.title}</title>
      <style>
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none; }
          .page-break { page-break-after: always; }
        }
        body { font-family: system-ui, -apple-system, sans-serif; direction: rtl; text-align: right; padding: 25px; max-width: 900px; margin: 0 auto; color: #0f172a; }
        .header { border-bottom: 3px solid #0284c7; padding-bottom: 15px; margin-bottom: 20px; }
        .title { font-size: 22px; font-weight: 900; color: #0369a1; }
        .subtitle { font-size: 14px; color: #475569; margin-top: 5px; }
        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 25px; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 25px; font-size: 12px; }
        th { background: #0284c7; color: white; padding: 8px 10px; text-align: right; font-weight: 700; border: 1px solid #0284c7; }
        td { padding: 8px 10px; border: 1px solid #cbd5e1; text-align: right; }
        tr:nth-child(even) { background-color: #f8fafc; }
        .workshop-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; margin-bottom: 25px; page-break-inside: avoid; }
        .btn-print { background: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="no-print" style="text-align: left; margin-bottom: 15px;">
        <button class="btn-print" onclick="window.print()">🖨️ הדפס דוח / שמור כ-PDF</button>
      </div>

      <div class="header">
        <div class="title">בית הספר השש-שנתי ע"ש משה ארנס - פתח תקוה</div>
        <div class="subtitle">דוח שיבוץ מורים לסדנאות: ${event.title}</div>
      </div>

      <div class="info-grid">
        <div><strong>תאריך:</strong> ${event.date ? formatToIsraeliDate(event.date) : 'טרם נקבע'}</div>
        <div><strong>שעות:</strong> ${event.hours}</div>
        <div><strong>מיקום:</strong> ${event.location}</div>
        <div><strong>סה"כ נרשמים:</strong> ${registrations.length} מורים</div>
      </div>
  `;

  event.workshops.forEach((ws, idx) => {
    const wsRegs = registrations.filter(r => r.workshopId === ws.id);
    content += `
      <div class="workshop-card">
        <h3 style="margin-top: 0; color: #0284c7;">סדנה #${idx + 1}: ${ws.title}</h3>
        <p style="font-size: 13px; margin: 5px 0;"><strong>מנחה:</strong> ${ws.instructor} | <strong>חדר:</strong> ${ws.room} | <strong>שעות:</strong> ${ws.timeSlot} | <strong>תפוסה:</strong> ${wsRegs.length}/${ws.maxCapacity}</p>
        
        <table>
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>שם מלא</th>
              <th>טלפון</th>
              <th>אימייל</th>
              <th>תפקיד</th>
              <th>הערות</th>
            </tr>
          </thead>
          <tbody>
    `;

    if (wsRegs.length === 0) {
      content += `<tr><td colspan="6" style="text-align: center; color: #94a3b8;">אין עדיין נרשמים לסדנה זו</td></tr>`;
    } else {
      wsRegs.forEach((r, rIdx) => {
        content += `
          <tr>
            <td>${rIdx + 1}</td>
            <td><strong>${r.fullName}</strong></td>
            <td>${r.phone || '-'}</td>
            <td>${r.email || '-'}</td>
            <td>${r.roleOrSubject || '-'}</td>
            <td>${r.notes || '-'}</td>
          </tr>
        `;
      });
    }

    content += `</tbody></table></div>`;
  });

  content += `</body></html>`;
  printWindow.document.write(content);
  printWindow.document.close();
};

/**
 * Fallback: Generate and trigger download of CSV file
 */
export const downloadRegistrationsCSV = (event: TeacherEvent, registrations: WorkshopRegistration[]) => {
  const header = ['תאריך רישום', 'שם מלא', 'טלפון', 'אימייל', 'תפקיד', 'סדנה', 'חדר', 'שעות', 'מנחה', 'הערות'];
  const rows = registrations.map(reg => {
    const workshop = event.workshops.find(w => w.id === reg.workshopId);
    return [
      `"${reg.registeredAt || ''}"`,
      `"${(reg.fullName || '').replace(/"/g, '""')}"`,
      `"${reg.phone || ''}"`,
      `"${reg.email || ''}"`,
      `"${(reg.roleOrSubject || '').replace(/"/g, '""')}"`,
      `"${(reg.workshopTitle || workshop?.title || '').replace(/"/g, '""')}"`,
      `"${workshop?.room || ''}"`,
      `"${workshop?.timeSlot || ''}"`,
      `"${workshop?.instructor || ''}"`,
      `"${(reg.notes || '').replace(/"/g, '""')}"`
    ].join(',');
  });

  const csvContent = '\uFEFF' + [header.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `נרשמים לסדנאות - ${event.title}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
