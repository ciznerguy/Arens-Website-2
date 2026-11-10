// Staff edit permissions (stage 3B, 2026-11-10).
// Every staff member can edit their own profile. The people below can also edit specific pages.
// Admins (access/editors in Firestore) can edit everything and are not listed here.
// The same table is written into firestore.rules by scripts/gen-rules.mjs: after changing it,
// regenerate the rules and publish them in the Firebase console, or the database will refuse the save.

export interface StaffPermissions {
  name: string;
  emails: string[];         // every address this person may sign in with
  majors: string[];         // majors/{id}
  grades: string[];         // grade main page + the grade's class list
  counselorGrades: string[]; // grade counselor page
  pages: string[];          // other internal pages, by canonical key
}

export const ENGLISH_PAGE_KEY = 'course/english-department';

export const STAFF_PERMISSIONS: StaffPermissions[] = [
  // Major coordinators (names from each major page)
  { name: 'נירה פרקש', emails: ['1002106184@taded.org.il', 'nniirraa@gmail.com'], majors: ['major-arabic'], grades: [], counselorGrades: [], pages: [] },
  { name: "גיל דוידוביץ'", emails: ['1002219714@taded.org.il', 'gil.davidovitz@gmail.com'], majors: ['major-biology'], grades: [], counselorGrades: [], pages: [] },
  { name: 'רז קצב', emails: ['1004920898@taded.org.il', 'razkyk007@gmail.com'], majors: ['major-business-econ'], grades: [], counselorGrades: [], pages: [] },
  { name: 'נירית גרובר', emails: ['1002112929@taded.org.il', 'niritrdt@gmail.com'], majors: ['major-chemistry'], grades: ['י'], counselorGrades: [], pages: [] },
  { name: 'שחר צור', emails: ['1004263270@taded.org.il', 'shahar.tzur1@gmail.com'], majors: ['major-cyber-geo'], grades: [], counselorGrades: [], pages: [] },
  { name: 'אורנה גינדי', emails: ['orna.gindy@gmail.com'], majors: ['major-cyber-geo'], grades: [], counselorGrades: [], pages: [] },
  { name: 'אילת דניאל', emails: ['1002360965@taded.org.il', 'ayelet.daniel@gmail.com'], majors: ['major-data-analyst'], grades: [], counselorGrades: [], pages: [] },
  { name: 'משה מנשה', emails: ['moligi.m@gmail.com'], majors: ['major-data-analyst'], grades: [], counselorGrades: [], pages: [] },
  { name: 'תומר נעמן', emails: ['tomertna19922@gmail.com'], majors: ['major-pe'], grades: [], counselorGrades: [], pages: [] },
  { name: 'תומר ברגהאוס', emails: ['1002052761@taded.org.il', 't.berghaus@gmail.com'], majors: ['major-physics'], grades: [], counselorGrades: [], pages: [] },
  { name: 'איילה ברונשטיין', emails: ['1002192548@taded.org.il', 'ayalabronstein@gmail.com'], majors: ['major-social-sciences'], grades: [], counselorGrades: [], pages: [] },
  { name: 'אורה שוורץ', emails: ['1005339870@taded.org.il'], majors: ['major-social-sciences'], grades: [], counselorGrades: [], pages: [] },
  { name: 'מוטי חובה', emails: ['1002446924@taded.org.il', 'motyhova@gmail.com'], majors: ['major-theater'], grades: [], counselorGrades: [], pages: [] },
  { name: 'פסי טל', emails: ['1002286027@taded.org.il'], majors: ['major-theater'], grades: [], counselorGrades: [], pages: [] },

  // Grade coordinators
  { name: 'רועי רותם', emails: ['1003361718@taded.org.il'], majors: [], grades: ['ז'], counselorGrades: [], pages: [] },
  { name: 'איריס שחמון', emails: ['1002011426@taded.org.il'], majors: [], grades: ['ח'], counselorGrades: [], pages: [] },
  { name: 'נדב גורן', emails: ['1002185618@taded.org.il'], majors: [], grades: ['ט'], counselorGrades: [], pages: [] },
  { name: 'ניר מלכה', emails: ['nirmalka6@gmail.com'], majors: [], grades: ['יא'], counselorGrades: [], pages: [] },
  { name: 'אורלי רז', emails: ['1002641566@taded.org.il', 'orly.raz.1010@gmail.com'], majors: [], grades: ['יב'], counselorGrades: [], pages: [ENGLISH_PAGE_KEY] },

  // Grade counselors
  { name: 'ענבל ממן', emails: ['1002209480@taded.org.il'], majors: [], grades: [], counselorGrades: ['ז'], pages: [] },
  { name: 'אורית הדר לבהר', emails: ['1004148827@taded.org.il'], majors: [], grades: [], counselorGrades: ['ז'], pages: [] },
  { name: 'רינת שטקל', emails: ['1002153760@taded.org.il'], majors: [], grades: [], counselorGrades: ['ח'], pages: [] },
  { name: 'סמדר קקון', emails: ['1002084284@taded.org.il'], majors: [], grades: [], counselorGrades: ['ט'], pages: [] },
  { name: 'ענבל ישראלי לונדין', emails: ['buli1774@gmail.com'], majors: [], grades: [], counselorGrades: ['י', 'יא'], pages: [] },
  { name: 'עופרי טל לובינסקי', emails: ['1002127608@taded.org.il'], majors: [], grades: [], counselorGrades: ['י', 'יב'], pages: [] },
];

export const NO_PERMISSIONS: StaffPermissions = { name: '', emails: [], majors: [], grades: [], counselorGrades: [], pages: [] };

function mergePermissions(list: StaffPermissions[]): StaffPermissions {
  if (list.length === 0) {
    return NO_PERMISSIONS;
  }
  const unique = (arr: string[]) => Array.from(new Set(arr));
  return {
    name: list[0].name,
    emails: unique(list.flatMap(p => p.emails)),
    majors: unique(list.flatMap(p => p.majors)),
    grades: unique(list.flatMap(p => p.grades)),
    counselorGrades: unique(list.flatMap(p => p.counselorGrades)),
    pages: unique(list.flatMap(p => p.pages)),
  };
}

export function getPermissionsForEmail(email?: string | null): StaffPermissions {
  if (!email) {
    return NO_PERMISSIONS;
  }
  const e = email.trim().toLowerCase();
  return mergePermissions(STAFF_PERMISSIONS.filter(p => p.emails.some(x => x.toLowerCase() === e)));
}

// Admin role simulation: the simulated role text holds the person's name
export function getPermissionsForRoleText(text?: string | null): StaffPermissions {
  if (!text) {
    return NO_PERMISSIONS;
  }
  return mergePermissions(STAFF_PERMISSIONS.filter(p => text.includes(p.name)));
}

// Firestore document id for a page key (keys contain "/", which ids cannot)
export function pageDocId(pageKey: string): string {
  return encodeURIComponent(pageKey.trim().replace(/^\/+|\/+$/g, ''));
}
