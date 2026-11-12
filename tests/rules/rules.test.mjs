// Firestore security rules tests (stage 0, 2026-11-11).
// They run against the local emulator only, never against the live database.
// Run from the repo root: npm run test:rules   (needs Java on PATH)
//
// The people used for coordinator and counselor tests are taken by name from src/data/permissions.ts,
// so no addresses are written in this file. Admin and teacher users are made-up test addresses.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test, before, after, beforeEach, describe } from "node:test";
import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, collection, setLogLevel } from "firebase/firestore";

setLogLevel("error");

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const rules = readFileSync(join(root, "firestore.rules"), "utf8");

// --- People from the permissions table ------------------------------------------------------
const permSrc = readFileSync(join(root, "src/data/permissions.ts"), "utf8");
const ENGLISH_PAGE_KEY = /export const ENGLISH_PAGE_KEY = '([^']+)'/.exec(permSrc)[1];
const table = permSrc
  .split("\n")
  .map(l => l.trim())
  .filter(l => l.startsWith("{ name:"))
  .map(l => new Function("ENGLISH_PAGE_KEY", "return (" + l.replace(/,$/, "") + ");")(ENGLISH_PAGE_KEY));
const person = name => {
  const p = table.find(r => r.name === name);
  if (!p) throw new Error("not in permissions table: " + name);
  return p;
};

const pagesSrc = readFileSync(join(root, "src/data/internalPages.ts"), "utf8");
function keyMap(constName) {
  const block = new RegExp("export const " + constName + "[^{]*\\{([\\s\\S]*?)\\};").exec(pagesSrc)[1];
  const map = {};
  for (const m of block.matchAll(/'([^']+)':\s*"([^"]+)"/g)) map[m[1]] = m[2].replace(/^\/+|\/+$/g, "");
  return map;
}
const GRADE = keyMap("GRADE_CANONICAL_KEYS");
const COUNSELOR = keyMap("COUNSELOR_CANONICAL_KEYS");
const pageDocId = key => encodeURIComponent(key.trim().replace(/^\/+|\/+$/g, ""));

const majorCoordinator = person("תומר ברגהאוס"); // physics
const gradeCoordinator = person("אורלי רז");     // grade יב + English page
const counselor = person("עופרי טל לובינסקי");    // counselor pages י and יב

const ADMIN_EMAIL = "admin@rules-test.example";
const TEACHER_EMAIL = "teacher@rules-test.example";
const OTHER_EMAIL = "someone@rules-test.example";

// --- Test environment -----------------------------------------------------------------------
let env;
const anon = () => env.unauthenticatedContext().firestore();
const user = (email, verified = true) =>
  env.authenticatedContext(email.replace(/[^a-z0-9]/gi, "_"), { email, email_verified: verified }).firestore();

const validRegistration = () => ({
  eventId: "ev1", workshopId: "w1", fullName: "Test Person", phone: "0500000000", email: "p@rules-test.example",
});

before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-arens-rules",
    firestore: { rules, host: "127.0.0.1", port: 8085 },
  });
});

after(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async ctx => {
    const db = ctx.firestore();
    await setDoc(doc(db, "access/editors"), { emails: [ADMIN_EMAIL] });
    for (const c of ["news", "events", "settings", "pages", "staff", "tikshuv_guides", "tikshuv_settings"]) {
      await setDoc(doc(db, c, "seed"), { t: 1 });
    }
    await setDoc(doc(db, "majors/major-physics"), { id: "major-physics", title: "פיזיקה" });
    await setDoc(doc(db, "majors/major-biology"), { id: "major-biology", title: "ביולוגיה" });
    await setDoc(doc(db, "registrations/r1"), validRegistration());
    await setDoc(doc(db, "staff_v3/teacher"), { name: "Teacher", email: TEACHER_EMAIL, bio: "", imageUrl: "", roleDescription: "" });
    await setDoc(doc(db, "staff_v3/other"), { name: "Other", email: OTHER_EMAIL, bio: "", imageUrl: "", roleDescription: "" });
  });
});

const CONTENT = ["news", "events", "majors", "settings", "pages", "staff", "staff_v3", "tikshuv_guides", "tikshuv_settings", "page_overrides", "grade_classes", "registrations"];

// --- Anonymous visitor ----------------------------------------------------------------------
describe("anonymous visitor", () => {
  test("reads every public collection", async () => {
    for (const c of CONTENT) {
      if (c === "registrations") continue; // private since security stage 1, tested below
      await assertSucceeds(getDocs(collection(anon(), c)));
    }
  });
  test("cannot read registrations (stage 1)", async () => {
    await assertFails(getDocs(collection(anon(), "registrations")));
    await assertFails(getDoc(doc(anon(), "registrations/r1")));
  });
  test("cannot write to any collection", async () => {
    for (const c of CONTENT) await assertFails(setDoc(doc(anon(), c, "x"), { t: 1 }));
    await assertFails(setDoc(doc(anon(), "majors/major-physics"), { t: 1 }, { merge: true }));
    await assertFails(setDoc(doc(anon(), "zz_unknown/x"), { t: 1 }));
  });
  test("creates a valid registration", async () => {
    await assertSucceeds(setDoc(doc(anon(), "registrations/new1"), validRegistration()));
  });
  test("cannot update or delete a registration", async () => {
    await assertFails(updateDoc(doc(anon(), "registrations/r1"), { notes: "x" }));
    await assertFails(deleteDoc(doc(anon(), "registrations/r1")));
  });
  test("invalid registrations are refused", async () => {
    await assertFails(setDoc(doc(anon(), "registrations/bad1"), { ...validRegistration(), evil: true }));
    const missing = validRegistration(); delete missing.phone;
    await assertFails(setDoc(doc(anon(), "registrations/bad2"), missing));
    await assertFails(setDoc(doc(anon(), "registrations/bad3"), { ...validRegistration(), fullName: "a".repeat(101) }));
    await assertFails(setDoc(doc(anon(), "registrations/bad4"), { ...validRegistration(), notes: "a".repeat(1001) }));
    await assertFails(setDoc(doc(anon(), "registrations/bad5"), { ...validRegistration(), syncedToGoogleSheet: true }));
  });
  test("cannot read the admin list", async () => {
    await assertFails(getDoc(doc(anon(), "access/editors")));
  });
});

// --- Admin ----------------------------------------------------------------------------------
describe("admin", () => {
  test("writes to every content collection", async () => {
    const db = user(ADMIN_EMAIL);
    for (const c of CONTENT) {
      if (c === "registrations") continue; // a new registration must be valid, even from an admin (below)
      await assertSucceeds(setDoc(doc(db, c, "admin-write"), { t: 1 }));
    }
    await assertSucceeds(updateDoc(doc(db, "registrations/r1"), { notes: "admin note" }));
    await assertSucceeds(deleteDoc(doc(db, "registrations/r1")));
    await assertSucceeds(deleteDoc(doc(db, "majors/major-biology")));
  });
  test("cannot create an invalid registration either", async () => {
    await assertFails(setDoc(doc(user(ADMIN_EMAIL), "registrations/bad"), { t: 1 }));
  });
  test("reads registrations", async () => {
    await assertSucceeds(getDocs(collection(user(ADMIN_EMAIL), "registrations")));
  });
  test("reads the admin list but cannot change it", async () => {
    const db = user(ADMIN_EMAIL);
    await assertSucceeds(getDoc(doc(db, "access/editors")));
    await assertFails(setDoc(doc(db, "access/editors"), { emails: [] }));
  });
  test("an unverified email is not treated as admin", async () => {
    await assertFails(setDoc(doc(user(ADMIN_EMAIL, false), "news/x"), { t: 1 }));
  });
});

// --- Signed-in user with no role ------------------------------------------------------------
describe("signed-in user without a role", () => {
  test("cannot write anywhere", async () => {
    const db = user("nobody@rules-test.example");
    for (const c of CONTENT) {
      if (c === "registrations") continue; // creating a valid registration is open to everyone
      await assertFails(setDoc(doc(db, c, "x"), { t: 1 }));
    }
    await assertFails(setDoc(doc(db, "majors/major-physics"), { t: 1 }, { merge: true }));
  });
  test("cannot read the admin list", async () => {
    await assertFails(getDoc(doc(user("nobody@rules-test.example"), "access/editors")));
  });
  test("cannot read registrations", async () => {
    await assertFails(getDocs(collection(user("nobody@rules-test.example"), "registrations")));
  });
});

// --- Major coordinator ----------------------------------------------------------------------
describe("major coordinator", () => {
  const email = () => majorCoordinator.emails[0];
  test("updates their own major", async () => {
    await assertSucceeds(setDoc(doc(user(email()), "majors/major-physics"), { title: "פיזיקה חדש" }, { merge: true }));
  });
  test("cannot update another major, create or delete majors", async () => {
    const db = user(email());
    await assertFails(setDoc(doc(db, "majors/major-biology"), { title: "x" }, { merge: true }));
    await assertFails(setDoc(doc(db, "majors/major-new"), { title: "x" }));
    await assertFails(deleteDoc(doc(db, "majors/major-physics")));
  });
  test("cannot write pages or class lists", async () => {
    const db = user(email());
    const key = GRADE["יב"];
    await assertFails(setDoc(doc(db, "page_overrides", pageDocId(key)), { key, pageJson: "{}" }));
    await assertFails(setDoc(doc(db, "grade_classes/יב"), { classesJson: "[]" }));
  });
});

// --- Grade coordinator ----------------------------------------------------------------------
describe("grade coordinator", () => {
  const email = () => gradeCoordinator.emails[0];
  const grade = () => gradeCoordinator.grades[0];
  test("saves their grade page and class list", async () => {
    const db = user(email());
    const key = GRADE[grade()];
    await assertSucceeds(setDoc(doc(db, "page_overrides", pageDocId(key)), { key, pageJson: "{}", updatedAt: "now" }));
    await assertSucceeds(setDoc(doc(db, "grade_classes", grade()), { classesJson: "[]", updatedAt: "now" }));
  });
  test("saves the extra page listed for them (English)", async () => {
    await assertSucceeds(setDoc(doc(user(email()), "page_overrides", pageDocId(ENGLISH_PAGE_KEY)), { key: ENGLISH_PAGE_KEY, pageJson: "{}" }));
  });
  test("cannot save another grade's page or classes", async () => {
    const db = user(email());
    const other = Object.keys(GRADE).find(g => g !== grade());
    await assertFails(setDoc(doc(db, "page_overrides", pageDocId(GRADE[other])), { key: GRADE[other], pageJson: "{}" }));
    await assertFails(setDoc(doc(db, "grade_classes", other), { classesJson: "[]" }));
  });
  test("cannot store another page's key under their own document", async () => {
    const key = GRADE[grade()];
    await assertFails(setDoc(doc(user(email()), "page_overrides", pageDocId(key)), { key: "course/english-department-x", pageJson: "{}" }));
  });
  test("cannot add unknown fields or delete", async () => {
    const db = user(email());
    const key = GRADE[grade()];
    await assertFails(setDoc(doc(db, "page_overrides", pageDocId(key)), { key, pageJson: "{}", evil: 1 }));
    await assertFails(setDoc(doc(db, "grade_classes", grade()), { classesJson: "[]", evil: 1 }));
    await assertFails(deleteDoc(doc(db, "grade_classes", grade())));
  });
  test("cannot update majors", async () => {
    await assertFails(setDoc(doc(user(email()), "majors/major-physics"), { title: "x" }, { merge: true }));
  });
});

// --- Grade counselor ------------------------------------------------------------------------
describe("grade counselor", () => {
  const email = () => counselor.emails[0];
  test("saves each of their counselor pages", async () => {
    const db = user(email());
    for (const g of counselor.counselorGrades) {
      const key = COUNSELOR[g];
      await assertSucceeds(setDoc(doc(db, "page_overrides", pageDocId(key)), { key, pageJson: "{}" }));
    }
  });
  test("cannot save other counselor pages, grade pages or class lists", async () => {
    const db = user(email());
    const otherGrade = Object.keys(COUNSELOR).find(g => !counselor.counselorGrades.includes(g));
    await assertFails(setDoc(doc(db, "page_overrides", pageDocId(COUNSELOR[otherGrade])), { key: COUNSELOR[otherGrade], pageJson: "{}" }));
    const g = counselor.counselorGrades[0];
    await assertFails(setDoc(doc(db, "page_overrides", pageDocId(GRADE[g])), { key: GRADE[g], pageJson: "{}" }));
    await assertFails(setDoc(doc(db, "grade_classes", g), { classesJson: "[]" }));
  });
});

// --- Teacher (own staff card) ---------------------------------------------------------------
describe("teacher", () => {
  test("updates bio, imageUrl and roleDescription on their own card", async () => {
    const db = user(TEACHER_EMAIL);
    await assertSucceeds(updateDoc(doc(db, "staff_v3/teacher"), { bio: "שלום", imageUrl: "https://x.example/a.jpg", roleDescription: "מורה" }));
  });
  test("cannot change other fields on their own card", async () => {
    const db = user(TEACHER_EMAIL);
    await assertFails(updateDoc(doc(db, "staff_v3/teacher"), { name: "Other name" }));
    await assertFails(updateDoc(doc(db, "staff_v3/teacher"), { email: OTHER_EMAIL }));
  });
  test("cannot update another person's card, create or delete cards", async () => {
    const db = user(TEACHER_EMAIL);
    await assertFails(updateDoc(doc(db, "staff_v3/other"), { bio: "x" }));
    await assertFails(setDoc(doc(db, "staff_v3/new"), { name: "x", email: TEACHER_EMAIL }));
    await assertFails(deleteDoc(doc(db, "staff_v3/teacher")));
  });
});

