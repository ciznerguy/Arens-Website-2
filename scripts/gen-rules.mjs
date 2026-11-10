// Writes the permission tables from src/data/permissions.ts into firestore.rules
// (the block between the GENERATED markers). Run: node scripts/gen-rules.mjs
// Then publish firestore.rules in the Firebase console; Netlify does not deploy rules.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const permSrc = readFileSync(join(root, "src/data/permissions.ts"), "utf8");
const pagesSrc = readFileSync(join(root, "src/data/internalPages.ts"), "utf8");

const ENGLISH_PAGE_KEY = /export const ENGLISH_PAGE_KEY = '([^']+)'/.exec(permSrc)[1];

// Each table row is one line: { name: ..., emails: [...], ... }
const rows = permSrc
  .split("\n")
  .map(line => line.trim())
  .filter(line => line.startsWith("{ name:"))
  .map(line => {
    const obj = line.replace(/,$/, "");
    return new Function("ENGLISH_PAGE_KEY", "return (" + obj + ");")(ENGLISH_PAGE_KEY);
  });

function readKeyMap(constName) {
  const block = new RegExp("export const " + constName + "[^{]*\\{([\\s\\S]*?)\\};").exec(pagesSrc)[1];
  const map = {};
  for (const m of block.matchAll(/'([^']+)':\s*"([^"]+)"/g)) {
    map[m[1]] = m[2].replace(/^\/+|\/+$/g, "");
  }
  return map;
}
const gradeKeys = readKeyMap("GRADE_CANONICAL_KEYS");
const counselorKeys = readKeyMap("COUNSELOR_CANONICAL_KEYS");

const pageDocId = key => encodeURIComponent(key.trim().replace(/^\/+|\/+$/g, ""));

const majors = {};
const pages = {};
const classes = {};
const add = (table, id, emails) => {
  table[id] = Array.from(new Set([...(table[id] || []), ...emails.map(e => e.toLowerCase())]));
};
const addPage = (key, emails) => {
  const id = pageDocId(key);
  const current = pages[id] || { key, emails: [] };
  current.emails = Array.from(new Set([...current.emails, ...emails.map(e => e.toLowerCase())]));
  pages[id] = current;
};

for (const r of rows) {
  r.majors.forEach(m => add(majors, m, r.emails));
  r.grades.forEach(g => {
    if (!gradeKeys[g]) throw new Error("unknown grade " + g);
    addPage(gradeKeys[g], r.emails);
    add(classes, g, r.emails);
  });
  r.counselorGrades.forEach(g => {
    if (!counselorKeys[g]) throw new Error("unknown counselor grade " + g);
    addPage(counselorKeys[g], r.emails);
  });
  r.pages.forEach(p => addPage(p, r.emails));
}

const q = s => "'" + s.replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
const list = arr => "[" + arr.map(q).join(", ") + "]";
const ind = "        ";
const block = [
  "    // BEGIN GENERATED (node scripts/gen-rules.mjs, do not edit by hand)",
  "    function majorEditors() {",
  "      return {",
  Object.entries(majors).map(([id, e]) => ind + q(id) + ": " + list(e)).join(",\n"),
  "      };",
  "    }",
  "    function classEditors() {",
  "      return {",
  Object.entries(classes).map(([id, e]) => ind + q(id) + ": " + list(e)).join(",\n"),
  "      };",
  "    }",
  "    function pageEditors() {",
  "      return {",
  Object.entries(pages).map(([id, p]) => ind + q(id) + ": {'key': " + q(p.key) + ", 'emails': " + list(p.emails) + "}").join(",\n"),
  "      };",
  "    }",
  "    // END GENERATED",
].join("\n");

const rulesPath = join(root, "firestore.rules");
let rules = readFileSync(rulesPath, "utf8");
const crlf = rules.includes("\r\n");
if (crlf) rules = rules.replace(/\r\n/g, "\n");
const re = /    \/\/ BEGIN GENERATED[\s\S]*?\/\/ END GENERATED/;
if (!re.test(rules)) throw new Error("GENERATED markers not found in firestore.rules");
rules = rules.replace(re, () => block);
if (crlf) rules = rules.replace(/\n/g, "\r\n");
writeFileSync(rulesPath, rules);
console.log("rows " + rows.length + ", majors " + Object.keys(majors).length + ", pages " + Object.keys(pages).length + ", grades " + Object.keys(classes).length);
