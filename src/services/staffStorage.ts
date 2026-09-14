import { StaffMember } from '../types';
import { defaultStaffMembers } from '../data';
import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

const STAFF_COLLECTION_NAME = 'staff_v3';
const STAFF_STORAGE_KEY = 'arens_cms_staff_v3';

/**
 * Universal matcher for Guy Tsizner to guarantee there is strictly ONLY ONE Tsizner in the system.
 */
export const isGuyTsizner = (s?: { id?: string; name?: string; email?: string } | null): boolean => {
  if (!s) return false;
  if (s.id === 'staff-108') return true;
  const name = (s.name || '').trim();
  if (name.includes('ציזנר') || name.includes('צייזנר')) return true;
  const email = (s.email || '').trim().toLowerCase();
  if (email.includes('cizner') || email.includes('tzizner')) return true;
  if (email === '1003045545@taded.org.il' || email.includes('1003045545')) return true;
  if (email === 'me@ciznerguy.com' || email === 'guy.tzizner@arens.school') return true;
  return false;
};

/**
 * Consolidates all staff members, guaranteeing that Guy Tsizner has only ONE record (staff-108),
 * merges any custom photos or profile edits, normalizes Yaron Elner's role, and removes any duplicate entries.
 */
export const consolidateStaff = (rawStaff: StaffMember[]): StaffMember[] => {
  // Normalize Yaron Elner to guarantee the second deputy title is removed, correct coordinator roles set, and he is not marked as management
  const normalizedStaff = rawStaff.map(member => {
    const isYaron = member.id === 'staff-11' || 
      (member.name && member.name.includes('אלנר')) || 
      member.email === 'yaronelner82@gmail.com';
    if (isYaron) {
      const needsFix = member.isManagement || 
        member.role?.includes('סגן') || 
        member.roleDescription?.includes('סגן') || 
        member.bio?.includes('סגן') ||
        !member.role?.includes('צומחים לדעת') ||
        !member.role?.includes('מדידה');
      if (needsFix) {
        const updatedYaron: StaffMember = {
          ...member,
          id: 'staff-11',
          name: 'ירון אלנר',
          role: 'רכז צומחים לדעת, רכז מדידה והערכה ומורה לאנגלית חט"ע',
          roleDescription: 'רכז צומחים לדעת, רכז מדידה והערכה ומורה לאנגלית חט"ע',
          bio: 'רכז מרכז "צומחים לדעת", רכז מדידה והערכה ומורה לאנגלית בחטיבה העליונה.',
          isManagement: false
        };
        // Persist correction to Firestore in the background
        setDoc(doc(db, STAFF_COLLECTION_NAME, 'staff-11'), updatedYaron).catch(console.warn);
        return updatedYaron;
      }
    }

    // Normalize grade leadership roles for grades ז, ח, ט
    if (member.id === 'staff-119' || (member.name && member.name.includes('רועי רותם'))) {
      if (!member.role?.includes("שכבה ז'")) {
        const fixed = { ...member, role: "רכז שכבה ז' ומחנך ראשי כתה תקשורתית ז 10 חט\"נ" };
        setDoc(doc(db, STAFF_COLLECTION_NAME, member.id), fixed).catch(console.warn);
        return fixed;
      }
    }
    if (member.id === 'staff-82' || (member.name && member.name.includes('ענבל ממן'))) {
      if (!member.role?.includes("שכבה ז'")) {
        const fixed = { ...member, role: "יועצת שכבה ז' חט\"נ" };
        setDoc(doc(db, STAFF_COLLECTION_NAME, member.id), fixed).catch(console.warn);
        return fixed;
      }
    }
    if (member.id === 'staff-67' || (member.name && member.name.includes('לבהר'))) {
      if (!member.role?.includes("שכבה ז'")) {
        const fixed = { ...member, role: "יועצת שכבה ז' ומחנכת כתה ז2 חט\"נ" };
        setDoc(doc(db, STAFF_COLLECTION_NAME, member.id), fixed).catch(console.warn);
        return fixed;
      }
    }
    if (member.id === 'staff-126' || (member.name && member.name.includes('שחמון'))) {
      if (!member.role?.includes("מובילת שכבה ח'")) {
        const fixed = { ...member, role: "סגנית מנהל חט\"נ, מובילת שכבה ח' ומחנכת ח3" };
        setDoc(doc(db, STAFF_COLLECTION_NAME, member.id), fixed).catch(console.warn);
        return fixed;
      }
    }
    if (member.id === 'staff-83' || (member.name && member.name.includes('שני מנור'))) {
      if (!member.role?.includes("אחראית פדגוגית שכבה ח'")) {
        const fixed = { ...member, role: "אחראית פדגוגית שכבה ח', רכזת מערכת ומחנכת כתה ח5 חט\"נ" };
        setDoc(doc(db, STAFF_COLLECTION_NAME, member.id), fixed).catch(console.warn);
        return fixed;
      }
    }
    if (member.id === 'staff-128' || (member.name && member.name.includes('שטקל'))) {
      if (!member.role?.includes("שכבה ח'")) {
        const fixed = { ...member, role: "יועצת שכבה ח' ומחנכת כתה ח8 חט\"נ" };
        setDoc(doc(db, STAFF_COLLECTION_NAME, member.id), fixed).catch(console.warn);
        return fixed;
      }
    }
    if (member.id === 'staff-31' || (member.name && member.name.includes('נדב גורן'))) {
      if (!member.role?.includes("מוביל שכבה ט'")) {
        const fixed = { ...member, role: "סגן מנהל חט\"נ, מוביל שכבה ט' ומחנך כתה ט4 חט\"נ" };
        setDoc(doc(db, STAFF_COLLECTION_NAME, member.id), fixed).catch(console.warn);
        return fixed;
      }
    }
    if (member.id === 'staff-74' || (member.name && member.name.includes('מדויל'))) {
      if (!member.role?.includes("אחראית פדגוגית שכבה ט'")) {
        const fixed = { ...member, role: "אחראית פדגוגית שכבה ט', מחנכת כתה ט3 ומורה למסע\"אות חט\"נ" };
        setDoc(doc(db, STAFF_COLLECTION_NAME, member.id), fixed).catch(console.warn);
        return fixed;
      }
    }
    if (member.id === 'staff-17' || (member.name && member.name.includes('שילת בדש'))) {
      if (!member.role?.includes("אחראית פדגוגית שכבה ט'")) {
        const fixed = { ...member, role: "אחראית פדגוגית שכבה ט' ומורת שילוב חט\"נ" };
        setDoc(doc(db, STAFF_COLLECTION_NAME, member.id), fixed).catch(console.warn);
        return fixed;
      }
    }
    if (member.id === 'staff-112' || (member.name && member.name.includes('קקון'))) {
      if (!member.role?.includes("שכבה ט'")) {
        const fixed = { ...member, role: "יועצת שכבה ט' ומחנכת כתה ט 1 חט\"נ" };
        setDoc(doc(db, STAFF_COLLECTION_NAME, member.id), fixed).catch(console.warn);
        return fixed;
      }
    }
    return member;
  });

  const guyEntries = normalizedStaff.filter(isGuyTsizner);
  const otherStaff = normalizedStaff.filter(s => !isGuyTsizner(s));

  if (guyEntries.length > 0) {
    // Find if any entry has a custom photo uploaded (base64 data URL or uploaded file)
    const customPhotoEntry = guyEntries.find(g => g.imageUrl && !g.imageUrl.includes('unsplash.com') && g.imageUrl.length > 20);
    const photo = customPhotoEntry ? customPhotoEntry.imageUrl : '';

    // Find custom bio or role details
    const customBio = guyEntries.find(g => g.bio && g.bio.length > 10)?.bio ||
      'רכז מגמת מדעי המחשב והנדסת תוכנה בחטיבה העליונה, מורה להנדסת תוכנה ורכז תקשוב בית ספרי.';

    const existing108 = guyEntries.find(g => g.id === 'staff-108');

    const unifiedGuy: StaffMember = {
      ...(existing108 || guyEntries[0]),
      id: 'staff-108',
      name: 'גיא ציזנר',
      role: 'רכז מגמת מדעי המחשב והנדסת תוכנה, ורכז תקשוב',
      roleDescription: 'רכז מגמת מדעי המחשב והנדסת תוכנה חט"ע, מורה למדעי המחשב ורכז תקשוב בית ספרי',
      email: 'ciznerguy@taded.org.il',
      bio: customBio,
      imageUrl: photo,
      isManagement: false
    };

    // Remove any extra duplicate entries from Firestore in the background
    guyEntries.forEach(g => {
      if (g.id !== 'staff-108') {
        deleteDoc(doc(db, STAFF_COLLECTION_NAME, g.id)).catch(console.warn);
      }
    });

    // Make sure staff-108 is saved to Firestore
    setDoc(doc(db, STAFF_COLLECTION_NAME, 'staff-108'), unifiedGuy).catch(console.warn);

    return [...otherStaff, unifiedGuy];
  }

  return otherStaff;
};

export const subscribeToStaffMembers = (callback: (staff: StaffMember[]) => void) => {
  try {
    const staffRef = collection(db, STAFF_COLLECTION_NAME);
    const unsubscribe = onSnapshot(
      staffRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const rawList: StaffMember[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as StaffMember;
            // Clean up legacy unsplash stock placeholder images
            const cleanedImageUrl = (data.imageUrl && data.imageUrl.includes('unsplash.com')) ? '' : (data.imageUrl || '');
            rawList.push({ ...data, id: docSnap.id, imageUrl: cleanedImageUrl });
          });

          // Consolidate and guarantee strictly ONE Tsizner
          const staff = consolidateStaff(rawList);

          try {
            localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staff));
          } catch (e) {
            console.warn('LocalStorage save quota note:', e);
          }
          window.dispatchEvent(new Event('arens_cms_staff_updated'));
          callback(staff);
        } else {
          // Initialize collection with all default teachers
          defaultStaffMembers.forEach(s => {
            const cleanedMember = { ...s, imageUrl: (s.imageUrl && s.imageUrl.includes('unsplash.com')) ? '' : (s.imageUrl || '') };
            setDoc(doc(db, STAFF_COLLECTION_NAME, s.id), cleanedMember).catch(console.warn);
          });
          const consolidatedDefaults = consolidateStaff(defaultStaffMembers);
          try {
            localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(consolidatedDefaults));
          } catch (e) {
            console.warn('LocalStorage save quota note:', e);
          }
          callback(consolidatedDefaults);
        }
      },
      (error) => {
        console.warn('Staff real-time subscription fallback:', error);
        callback(getStoredStaffMembers());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Error setting up staff listener:', err);
    callback(getStoredStaffMembers());
    return () => {};
  }
};

export const getStoredStaffMembers = (): StaffMember[] => {
  try {
    const raw = localStorage.getItem(STAFF_STORAGE_KEY);
    if (!raw) {
      return consolidateStaff(defaultStaffMembers);
    }
    const parsed: StaffMember[] = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const cleaned = parsed.map(member => {
        if (member.imageUrl && member.imageUrl.includes('unsplash.com')) {
          return { ...member, imageUrl: '' };
        }
        return member;
      });
      const consolidated = consolidateStaff(cleaned);
      return consolidated;
    }
  } catch (e) {
    console.error('Failed loading stored staff:', e);
  }
  return consolidateStaff(defaultStaffMembers);
};

export const saveStoredStaffMembers = (staff: StaffMember[]): void => {
  try {
    const consolidated = consolidateStaff(staff);
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(consolidated));
    window.dispatchEvent(new Event('arens_cms_staff_updated'));
  } catch (e) {
    console.error('Failed saving staff to localStorage:', e);
  }
};

export const saveStaffMember = async (member: StaffMember): Promise<void> => {
  // If editing or saving Guy Tsizner, always route to staff-108
  let targetMember = member;
  if (isGuyTsizner(member)) {
    targetMember = {
      ...member,
      id: 'staff-108',
      name: 'גיא ציזנר',
      role: member.role || 'רכז מגמת מדעי המחשב והנדסת תוכנה, ורכז תקשוב',
      roleDescription: member.roleDescription || 'רכז מגמת מדעי המחשב והנדסת תוכנה חט"ע, מורה למדעי המחשב ורכז תקשוב בית ספרי',
      email: 'ciznerguy@taded.org.il',
      isManagement: false
    };
  }

  try {
    await setDoc(doc(db, STAFF_COLLECTION_NAME, targetMember.id), targetMember);
  } catch (err) {
    console.warn('Error saving staff member to Firestore:', err);
  }

  const current = getStoredStaffMembers();
  const filtered = isGuyTsizner(targetMember)
    ? current.filter(s => !isGuyTsizner(s))
    : current.filter(s => s.id !== targetMember.id);

  const updated = consolidateStaff([...filtered, targetMember]);
  saveStoredStaffMembers(updated);
};

export const deleteStaffMember = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, STAFF_COLLECTION_NAME, id));
  } catch (err) {
    console.warn('Error deleting staff member from Firestore:', err);
  }
  const current = getStoredStaffMembers();
  const updated = current.filter(s => s.id !== id);
  saveStoredStaffMembers(updated);
};

export const resetStaffToDefaults = async (): Promise<void> => {
  try {
    const current = getStoredStaffMembers();
    for (const member of current) {
      await deleteDoc(doc(db, STAFF_COLLECTION_NAME, member.id)).catch(console.warn);
    }
    for (const member of defaultStaffMembers) {
      await setDoc(doc(db, STAFF_COLLECTION_NAME, member.id), member).catch(console.warn);
    }
  } catch (err) {
    console.warn('Error resetting staff in Firestore:', err);
  }
  saveStoredStaffMembers(defaultStaffMembers);
};
