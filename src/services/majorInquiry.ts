// Sends a major inquiry to the coordinator by email, through a Google Apps Script web app
// owned by the school's taded.org.il account. The script only sends to staff addresses on its own list.
// Project "פרויקט ללא שם" under 1003045545@taded.org.il, deployment v1 (2026-11-08)
export const MAJOR_INQUIRY_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyQXdMoyFRaRgCT2kzgfcbf9EhvYxvRqp3A1ah2girOKl2lqpHIEyPYi9_ZDJg4IeGGGg/exec';

export interface MajorInquiry {
  to: string;
  majorTitle: string;
  name: string;
  grade: string;
  contact: string;
  message: string;
  website: string; // hidden trap field, real visitors leave it empty
}

export const sendMajorInquiry = async (inquiry: MajorInquiry): Promise<boolean> => {
  if (!MAJOR_INQUIRY_ENDPOINT || !inquiry.to) {
    return false;
  }
  try {
    // text/plain keeps this a "simple" request, so the browser sends it without a CORS preflight
    const response = await fetch(MAJOR_INQUIRY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(inquiry),
    });
    if (!response.ok) {
      return false;
    }
    const result = await response.json();
    return result && result.ok === true;
  } catch (e) {
    console.error('Major inquiry failed:', e);
    return false;
  }
};
