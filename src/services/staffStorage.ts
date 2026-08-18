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

const STAFF_STORAGE_KEY = 'arens_cms_staff';

export const subscribeToStaffMembers = (callback: (staff: StaffMember[]) => void) => {
  try {
    const staffRef = collection(db, 'staff');
    const unsubscribe = onSnapshot(
      staffRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const staff: StaffMember[] = [];
          snapshot.forEach((docSnap) => {
            staff.push({ ...(docSnap.data() as StaffMember), id: docSnap.id });
          });
          localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staff));
          window.dispatchEvent(new Event('arens_cms_staff_updated'));
          callback(staff);
        } else {
          defaultStaffMembers.forEach(s => {
            setDoc(doc(db, 'staff', s.id), s).catch(console.warn);
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
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
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
    await setDoc(doc(db, 'staff', member.id), member);
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
    await deleteDoc(doc(db, 'staff', id));
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
      await deleteDoc(doc(db, 'staff', member.id)).catch(console.warn);
    }
    for (const member of defaultStaffMembers) {
      await setDoc(doc(db, 'staff', member.id), member).catch(console.warn);
    }
  } catch (err) {
    console.warn('Error resetting staff in Firestore:', err);
  }
  saveStoredStaffMembers(defaultStaffMembers);
};
