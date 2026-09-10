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

export const subscribeToStaffMembers = (callback: (staff: StaffMember[]) => void) => {
  try {
    const staffRef = collection(db, STAFF_COLLECTION_NAME);
    const unsubscribe = onSnapshot(
      staffRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const staff: StaffMember[] = [];
          snapshot.forEach((docSnap) => {
            staff.push({ ...(docSnap.data() as StaffMember), id: docSnap.id });
          });

          // Ensure Guy Tzizner is recognized as Major Coordinator for Computer Science & Software Engineering
          const guyIdx = staff.findIndex(s => s.id === 'staff-108' || s.name === 'גיא ציזנר' || s.email === 'ciznerguy@taded.org.il' || s.email === 'me@ciznerguy.com');
          if (guyIdx >= 0) {
            const guy = staff[guyIdx];
            if (!guy.role?.includes('רכז מגמת') || !guy.role?.includes('מדעי המחשב')) {
              const updatedGuy: StaffMember = {
                ...guy,
                role: 'רכז מגמת מדעי המחשב והנדסת תוכנה, ורכז תקשוב',
                roleDescription: 'רכז מגמת מדעי המחשב והנדסת תוכנה חט"ע, מורה למדעי המחשב ורכז תקשוב בית ספרי',
                bio: guy.bio && guy.bio.includes('רכז מגמת') 
                  ? guy.bio 
                  : 'רכז מגמת מדעי המחשב והנדסת תוכנה בחטיבה העליונה, מורה למדעי המחשב ורכז תקשוב בית ספרי.'
              };
              staff[guyIdx] = updatedGuy;
              setDoc(doc(db, STAFF_COLLECTION_NAME, guy.id), updatedGuy).catch(console.warn);
            }
          }

          // Sort staff to maintain predictable order (management first or by id)
          localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staff));
          window.dispatchEvent(new Event('arens_cms_staff_updated'));
          callback(staff);
        } else {
          // Initialize collection with all default teachers
          defaultStaffMembers.forEach(s => {
            setDoc(doc(db, STAFF_COLLECTION_NAME, s.id), s).catch(console.warn);
          });
          localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(defaultStaffMembers));
          callback(defaultStaffMembers);
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
      return defaultStaffMembers;
    }
    const parsed: StaffMember[] = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const guyIdx = parsed.findIndex(s => s.id === 'staff-108' || s.name === 'גיא ציזנר' || s.email === 'ciznerguy@taded.org.il' || s.email === 'me@ciznerguy.com');
      if (guyIdx >= 0 && (!parsed[guyIdx].role?.includes('רכז מגמת') || !parsed[guyIdx].role?.includes('מדעי המחשב'))) {
        parsed[guyIdx] = {
          ...parsed[guyIdx],
          role: 'רכז מגמת מדעי המחשב והנדסת תוכנה, ורכז תקשוב',
          roleDescription: 'רכז מגמת מדעי המחשב והנדסת תוכנה חט"ע, מורה למדעי המחשב ורכז תקשוב בית ספרי'
        };
        localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed loading stored staff:', e);
  }
  return defaultStaffMembers;
};

export const saveStoredStaffMembers = (staff: StaffMember[]): void => {
  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staff));
    window.dispatchEvent(new Event('arens_cms_staff_updated'));
  } catch (e) {
    console.error('Failed saving staff to localStorage:', e);
  }
};

export const saveStaffMember = async (member: StaffMember): Promise<void> => {
  try {
    await setDoc(doc(db, STAFF_COLLECTION_NAME, member.id), member);
  } catch (err) {
    console.warn('Error saving staff member to Firestore:', err);
  }
  const current = getStoredStaffMembers();
  const idx = current.findIndex(s => s.id === member.id);
  let updated: StaffMember[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = member;
  } else {
    updated = [member, ...current];
  }
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
