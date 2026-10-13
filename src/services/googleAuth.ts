import { StaffMember } from '../types';
import { saveStaffMember, getStoredStaffMembers } from './staffStorage';
import { Editor, getStoredEditors, syncAdminConfigToCloud, DEFAULT_EDITORS } from './adminStorage';
import { allTeachersList } from '../data/teachersList';

export interface GoogleUserProfile {
  email: string;
  name: string;
  picture?: string;
  hd?: string; // Hosted domain (e.g. taded.org.il)
}

/**
 * Normalizes a Hebrew or English name for tolerant comparison
 */
export const normalizeName = (rawName?: string): string => {
  if (!rawName) return '';
  return rawName
    .trim()
    .toLowerCase()
    .replace(/["'״׳`\-\–—_.]/g, '')
    .replace(/\s+/g, ' ');
};

/**
 * Checks if an email is an organizational school email (e.g. taded.org.il)
 */
export const isOrganizationalEmail = (email: string, hd?: string): boolean => {
  const clean = email.trim().toLowerCase();
  if (hd && (hd.includes('taded.org.il') || hd.includes('arens.school') || hd.includes('amalnet.k12.il') || hd.includes('education.gov.il'))) {
    return true;
  }
  return (
    clean.endsWith('@taded.org.il') ||
    clean.endsWith('@arens.school') ||
    clean.endsWith('@amalnet.k12.il') ||
    clean.endsWith('@education.gov.il') ||
    clean.includes('.taded.org.il')
  );
};

/**
 * Dictionary of known transliterations between English Google names and Hebrew Staff names
 */
const KNOWN_NAME_ALIASES: Record<string, string> = {
  'ella kreiczer': 'אלה קריצר',
  'ella kreitzer': 'אלה קריצר',
  'guy tsizner': 'גיא ציזנר',
  'guy cizner': 'גיא ציזנר',
  'orly raz': 'אורלי רז',
  'nava shekel sasson': 'נאוה שקל ששון',
  'eli levin': 'אלי לוין',
  'yaron elner': 'ירון אלנר'
};

/**
 * Match a Google user against school staff members
 */
export const matchStaffMemberByGoogleProfile = (
  profile: GoogleUserProfile,
  staffList: StaffMember[]
): StaffMember | null => {
  const cleanEmail = profile.email.trim().toLowerCase();
  const cleanName = normalizeName(profile.name);

  // 1. Direct email match in current staff list
  const directMatch = staffList.find(s => s.email?.trim().toLowerCase() === cleanEmail);
  if (directMatch) return directMatch;

  // 2. Direct email match in static allTeachersList fallback
  const staticMatch = allTeachersList.find(s => s.email?.trim().toLowerCase() === cleanEmail);
  if (staticMatch) return staticMatch;

  // 3. Name alias match (e.g. Ella Kreiczer -> אלה קריצר)
  const aliasedHebrewName = KNOWN_NAME_ALIASES[cleanName];
  if (aliasedHebrewName) {
    const matchByAlias = staffList.find(s => normalizeName(s.name) === normalizeName(aliasedHebrewName)) ||
                          allTeachersList.find(s => normalizeName(s.name) === normalizeName(aliasedHebrewName));
    if (matchByAlias) return matchByAlias;
  }

  // 4. Exact normalized name match
  const matchByName = staffList.find(s => normalizeName(s.name) === cleanName) ||
                      allTeachersList.find(s => normalizeName(s.name) === cleanName);
  if (matchByName) return matchByName;

  // 5. Partial name match (both first and last name present)
  const nameParts = cleanName.split(' ').filter(p => p.length > 1);
  if (nameParts.length >= 2) {
    const candidate = staffList.find(s => {
      const sNorm = normalizeName(s.name);
      return nameParts.every(part => sNorm.includes(part));
    }) || allTeachersList.find(s => {
      const sNorm = normalizeName(s.name);
      return nameParts.every(part => sNorm.includes(part));
    });

    if (candidate) return candidate;
  }

  return null;
};

/**
 * Decodes a Google JWT Credential Token safely
 */
export const decodeGoogleJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed decoding Google JWT', e);
    return null;
  }
};

/**
 * Ensures Google Identity Services (GSI) script is loaded
 */
export const ensureGoogleIdentityLoaded = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && ((window as any).google?.accounts?.id || (window as any).google?.accounts?.oauth2)) {
      resolve();
      return;
    }

    const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('שגיאה בטעינת ספריית Google Identity')));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('שגיאה בטעינת ספריית Google Identity'));
    document.head.appendChild(script);
  });
};

/**
 * Triggers interactive Google Sign-In and returns profile details
 */
export const requestGoogleSignInProfile = async (): Promise<GoogleUserProfile> => {
  await ensureGoogleIdentityLoaded();

  const google = (window as any).google;
  if (!google?.accounts?.oauth2) {
    throw new Error('Google Identity Services אינה זמינה כעת.');
  }

  const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
                   (window as any).gapiClientId ||
                   '363823936832-823e1dm08ek262dpflcens14os5bnsuu.apps.googleusercontent.com';

  return new Promise((resolve, reject) => {
    try {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            console.error('Google OAuth error:', tokenResponse);
            reject(new Error(tokenResponse.error_description || tokenResponse.error || 'ההתחברות עם Google בוטלה או נכשלה'));
            return;
          }

          if (!tokenResponse.access_token) {
            reject(new Error('לא התקבל טוקן גישה מ-Google'));
            return;
          }

          try {
            // Fetch profile info using access token
            const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
            });
            if (!resp.ok) {
              throw new Error('שגיאה בקבלת פרטי המשתמש מ-Google');
            }
            const data = await resp.json();
            resolve({
              email: data.email,
              name: data.name || `${data.given_name || ''} ${data.family_name || ''}`.trim(),
              picture: data.picture,
              hd: data.hd
            });
          } catch (err: any) {
            reject(new Error(err.message || 'שגיאה בעיבוד נתוני Google'));
          }
        }
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err: any) {
      reject(err);
    }
  });
};

/**
 * Handles full sign-in lifecycle for Google login:
 * 1. Matches staff member
 * 2. If organizational email used, auto-updates staff profile in Firestore/local
 * 3. Registers editor if needed
 * 4. Returns logged-in Editor object and optional message
 */
export const processGoogleLoginResult = async (
  profile: GoogleUserProfile,
  currentEditors: Editor[],
  setEditorsState: (editors: Editor[]) => void
): Promise<{ user: Editor; updatedProfile?: boolean; matchedMember?: StaffMember }> => {
  const staff = getStoredStaffMembers();
  const matchedMember = matchStaffMemberByGoogleProfile(profile, staff);

  const cleanEmail = profile.email.trim().toLowerCase();

  // Check if user is known editor or default editor
  const storedEditors = getStoredEditors();
  const knownEditor = currentEditors.find(e => e.email.toLowerCase() === cleanEmail) ||
                      DEFAULT_EDITORS.find(e => e.email.toLowerCase() === cleanEmail) ||
                      storedEditors.find(e => e.email.toLowerCase() === cleanEmail);

  if (!matchedMember && !knownEditor) {
    throw new Error(
      `חשבון Google זה (${cleanEmail}) אינו מופיע ברשימת צוות בית הספר. ` +
      `אם הינך מורה חדש, אנא פנה לרכז התקשוב להוספתך לרשימת הצוות.`
    );
  }

  let updatedProfile = false;
  const isOrg = isOrganizationalEmail(cleanEmail, profile.hd);

  // If organizational email is used and we found a matched staff member whose profile email differs
  if (matchedMember) {
    const currentMemberEmail = (matchedMember.email || '').trim().toLowerCase();
    
    // Auto-update profile to organizational email if entered with org email
    if (isOrg && currentMemberEmail !== cleanEmail) {
      const updatedStaff: StaffMember = {
        ...matchedMember,
        email: cleanEmail,
        imageUrl: matchedMember.imageUrl || profile.picture || ''
      };
      await saveStaffMember(updatedStaff);
      updatedProfile = true;
    } else if (!matchedMember.imageUrl && profile.picture) {
      // Opportunistically save user photo from Google profile
      const updatedStaff: StaffMember = {
        ...matchedMember,
        imageUrl: profile.picture
      };
      await saveStaffMember(updatedStaff);
    }
  }

  const role = matchedMember?.role || knownEditor?.role || 'מורה';
  const name = matchedMember?.name || knownEditor?.name || profile.name;

  const loggedUser: Editor = {
    email: cleanEmail,
    name: name,
    role: role
  };

  // Ensure user is in editors list
  if (!currentEditors.some(e => e.email.toLowerCase() === cleanEmail)) {
    const updatedEditors = [...currentEditors, loggedUser];
    setEditorsState(updatedEditors);
    localStorage.setItem('arens_cms_editors', JSON.stringify(updatedEditors));
    syncAdminConfigToCloud('editors', updatedEditors);
  }

  return {
    user: loggedUser,
    updatedProfile,
    matchedMember: matchedMember || undefined
  };
};
