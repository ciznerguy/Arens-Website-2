const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Helper to reverse Hebrew for jsPDF standard font rendering
function reverseHebrew(str) {
  if (!str) return '';
  const hebrewRegex = /[\u0590-\u05FF]/;
  if (!hebrewRegex.test(str)) return str;

  const tokens = str.match(/[\u0590-\u05FF]+|[a-zA-Z0-9%״׳.,:;!?()"\/\-_]+|\s+/g) || [str];
  const reversedTokens = tokens.reverse().map(token => {
    if (hebrewRegex.test(token)) {
      return token.split('').reverse().join('');
    }
    if (token.includes('(') || token.includes(')')) {
      return token.replace(/\(/g, 'TEMP_OPEN').replace(/\)/g, '(').replace(/TEMP_OPEN/g, ')');
    }
    return token;
  });
  return reversedTokens.join('');
}

const targetDir = path.join(__dirname, '../public/forms');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Download file helper
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

// Font setup
const fontBase64 = fs.readFileSync('/usr/share/fonts/truetype/freefont/FreeSans.ttf').toString('base64');
const fontBoldBase64 = fs.readFileSync('/usr/share/fonts/truetype/freefont/FreeSansBold.ttf').toString('base64');

function createBaseDoc() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  doc.addFileToVFS('FreeSans.ttf', fontBase64);
  doc.addFont('FreeSans.ttf', 'FreeSans', 'normal');
  doc.addFileToVFS('FreeSansBold.ttf', fontBoldBase64);
  doc.addFont('FreeSansBold.ttf', 'FreeSans', 'bold');
  return doc;
}

function drawSchoolHeader(doc, title, subtitle) {
  const pageW = 210;

  // Header border bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageW, 26, 'F');

  doc.setFillColor(34, 211, 238); // cyan-400
  doc.rect(0, 26, pageW, 2, 'F');

  // Title
  doc.setFont('FreeSans', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(reverseHebrew('בית הספר השש-שנתי ע"ש משה ארנס • פתח תקווה'), pageW / 2, 11, { align: 'center' });

  doc.setFont('FreeSans', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  doc.text(reverseHebrew('מחוז מרכז • משרד החינוך • עיריית פתח תקווה'), pageW / 2, 19, { align: 'center' });

  // Form title banner
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(15, 34, pageW - 30, 18, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(15, 34, pageW - 30, 18, 2, 2, 'S');

  doc.setFont('FreeSans', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(reverseHebrew(title), pageW / 2, 42, { align: 'center' });

  if (subtitle) {
    doc.setFont('FreeSans', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(reverseHebrew(subtitle), pageW / 2, 48, { align: 'center' });
  }

  // Footer
  doc.setFont('FreeSans', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(reverseHebrew('שש-שנתי משה ארנס • כתובת: אריה בראון 3, פתח תקווה • טלפון: 03-7349373 • אתר: arens.org.il'), pageW / 2, 287, { align: 'center' });
}

function drawSectionTitle(doc, y, title) {
  doc.setFillColor(224, 242, 254);
  doc.rect(15, y, 180, 7, 'F');
  doc.setDrawColor(186, 230, 253);
  doc.rect(15, y, 180, 7, 'S');

  doc.setFont('FreeSans', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(3, 105, 161);
  doc.text(reverseHebrew(title), 190, y + 5, { align: 'right' });
}

function drawFormField(doc, x, y, w, label, value = '') {
  doc.setFont('FreeSans', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(reverseHebrew(label + ':'), x + w, y + 4, { align: 'right' });

  // dotted line
  doc.setDrawColor(203, 213, 225);
  doc.setLineDash([1, 1], 0);
  doc.line(x, y + 5, x + w - (doc.getTextWidth(reverseHebrew(label)) + 6), y + 5);
  doc.setLineDash([]);
}

function drawSignatureBlock(doc, y) {
  doc.setFont('FreeSans', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(reverseHebrew('הצהרה וחתימה:'), 190, y, { align: 'right' });

  doc.setFont('FreeSans', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(reverseHebrew('אני החתום/ה מטה מצהיר/ה כי כל הפרטים שנמסרו לעיל הינם מלאים, נכונים ומדויקים.'), 190, y + 6, { align: 'right' });

  const sigY = y + 16;
  drawFormField(doc, 130, sigY, 60, 'שם מלא');
  drawFormField(doc, 75, sigY, 50, 'תאריך');
  drawFormField(doc, 15, sigY, 55, 'חתימת ההורה');
}

// 1. Student Card High School
function generateStudentCardHigh() {
  const doc = createBaseDoc();
  drawSchoolHeader(doc, 'כרטיס תלמיד/ה - חטיבה עליונה (שכבות י\'-יב\')', 'שנת הלימודים תשפ"ז • פרטי רישום ועדכון נתונים אישיים');

  let y = 60;
  drawSectionTitle(doc, y, '1. פרטי התלמיד/ה');
  y += 12;
  drawFormField(doc, 110, y, 80, 'שם משפחה');
  drawFormField(doc, 15, y, 85, 'שם פרטי');
  y += 10;
  drawFormField(doc, 110, y, 80, 'מספר תעודת זהות (כולל ביקורת)');
  drawFormField(doc, 15, y, 85, 'תאריך לידה (יום/חודש/שנה)');
  y += 10;
  drawFormField(doc, 110, y, 80, 'כתובת מלאה (רחוב ומספר בית)');
  drawFormField(doc, 60, y, 45, 'עיר / יישוב');
  drawFormField(doc, 15, y, 40, 'מיקוד');
  y += 10;
  drawFormField(doc, 110, y, 80, 'טלפון נייד תלמיד/ה');
  drawFormField(doc, 15, y, 85, 'כתובת דוא"ל תלמיד/ה');
  y += 10;
  drawFormField(doc, 110, y, 80, 'מגמת לימוד ראשית');
  drawFormField(doc, 15, y, 85, 'מגמת לימוד משנית / הרחבה');

  y += 16;
  drawSectionTitle(doc, y, '2. פרטי ההורים / אפוטרופוס');
  y += 12;
  drawFormField(doc, 110, y, 80, 'שם האב המלא ות.ז.');
  drawFormField(doc, 15, y, 85, 'טלפון נייד אב');
  y += 10;
  drawFormField(doc, 110, y, 80, 'שם האם המלא ות.ז.');
  drawFormField(doc, 15, y, 85, 'טלפון נייד אם');
  y += 10;
  drawFormField(doc, 110, y, 80, 'כתובת דוא"ל הורים לקבלת הודעות');
  drawFormField(doc, 15, y, 85, 'מצב משפחתי (נשואים/גרושים/אחר)');

  y += 16;
  drawSectionTitle(doc, y, '3. נתונים בריאותיים והערות מיוחדות');
  y += 10;
  doc.setFont('FreeSans', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(reverseHebrew('האם קיימת רגישות / אלרגיה מסכנת חיים או בעיה רפואית כרונית?'), 190, y, { align: 'right' });
  y += 7;
  drawFormField(doc, 15, y, 175, 'פירוט רגישויות, תרופות קבועות או התאמות נדרשות');

  y += 20;
  drawSignatureBlock(doc, y);

  doc.save(path.join(targetDir, 'student-card-high.pdf'));
}

// 2. Student Card Junior High
function generateStudentCardJunior() {
  const doc = createBaseDoc();
  drawSchoolHeader(doc, 'כרטיס תלמיד/ה - חטיבת הנעורים (שכבות ז\'-ט\')', 'שנת הלימודים תשפ"ז • פרטי רישום, קליטה ושיבוץ');

  let y = 60;
  drawSectionTitle(doc, y, '1. פרטי התלמיד/ה והרכב כיתתי');
  y += 12;
  drawFormField(doc, 110, y, 80, 'שם משפחה');
  drawFormField(doc, 15, y, 85, 'שם פרטי');
  y += 10;
  drawFormField(doc, 110, y, 80, 'מספר תעודת זהות');
  drawFormField(doc, 15, y, 85, 'בית ספר יסודי מזין / בית ספר קודם');
  y += 10;
  drawFormField(doc, 110, y, 80, 'כתובת מגורים');
  drawFormField(doc, 60, y, 45, 'יישוב');
  drawFormField(doc, 15, y, 40, 'מיקוד');
  y += 10;
  drawFormField(doc, 110, y, 80, 'שכבה וכיתה מיועדת');
  drawFormField(doc, 15, y, 85, 'מסלול לימודים (מופת / עמ"ט / אולימפית / רגיל)');

  y += 16;
  drawSectionTitle(doc, y, '2. פרטי הורים ואיש קשר לחירום');
  y += 12;
  drawFormField(doc, 110, y, 80, 'שם הורה 1, ת.ז. וטלפון נייד');
  drawFormField(doc, 15, y, 85, 'דוא"ל הורה 1');
  y += 10;
  drawFormField(doc, 110, y, 80, 'שם הורה 2, ת.ז. וטלפון נייד');
  drawFormField(doc, 15, y, 85, 'דוא"ל הורה 2');
  y += 10;
  drawFormField(doc, 15, y, 175, 'איש קשר נוסף למקרה חירום (שם, קרבה ומספר טלפון)');

  y += 16;
  drawSectionTitle(doc, y, '3. הצהרת ויתור והערות בריאותיות');
  y += 10;
  drawFormField(doc, 15, y, 175, 'אלרגיות, רגישות למזון או מגבלות בפעילות גופנית');

  y += 24;
  drawSignatureBlock(doc, y);

  doc.save(path.join(targetDir, 'student-card-junior.pdf'));
}

// 3. Health Declaration
function generateHealthDeclaration() {
  const doc = createBaseDoc();
  drawSchoolHeader(doc, 'הצהרת בריאות שנתית לתלמיד/ה (חובה)', 'חוזר מנכ"ל משרד החינוך • שנת הלימודים תשפ"ז');

  let y = 60;
  drawSectionTitle(doc, y, 'פרטי התלמיד/ה');
  y += 12;
  drawFormField(doc, 110, y, 80, 'שם מלא של התלמיד/ה');
  drawFormField(doc, 15, y, 85, 'מספר תעודת זהות');
  y += 10;
  drawFormField(doc, 110, y, 80, 'שכבה וכיתה');
  drawFormField(doc, 15, y, 85, 'שם מחנך/ת הכיתה');

  y += 16;
  drawSectionTitle(doc, y, 'הצהרת ההורים בנושא בריאותי');
  y += 12;
  doc.setFont('FreeSans', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const text1 = 'הריני להצהיר בזאת כי נכון להיום בריאותו/ה של בני/בתי תקינה, ואין כל מניעה בריאותית להשתתפותו/ה המלאה בכל הפעילויות הלימודיות, החברתיות, הסיורים, הטיולים ושיעורי החינוך הגופני של בית הספר.';
  doc.text(reverseHebrew(text1), 190, y, { align: 'right', maxWidth: 175 });

  y += 18;
  doc.text(reverseHebrew('אנא סמן/י את המשבצת המתאימה:'), 190, y, { align: 'right' });
  y += 8;

  // Box 1
  doc.rect(185, y - 4, 4, 4);
  doc.text(reverseHebrew('אין לבני/בתי כל מגבלה רפואית, מחלה כרונית או אלרגיה ידועה.'), 178, y, { align: 'right' });
  y += 9;

  // Box 2
  doc.rect(185, y - 4, 4, 4);
  doc.text(reverseHebrew('לבני/בתי קיימת מגבלה רפואית / אלרגיה / נטילת תרופות קבועה (מצורף מסמך רפואי רשמי).'), 178, y, { align: 'right' });

  y += 12;
  drawFormField(doc, 15, y, 175, 'פירוט המגבלה והנחיות לצוות במקרה הצורך');

  y += 25;
  drawSignatureBlock(doc, y);

  doc.save(path.join(targetDir, 'health-declaration.pdf'));
}

// 4. Confidentiality Waiver General
function generateConfidentialityWaiverGeneral() {
  const doc = createBaseDoc();
  drawSchoolHeader(doc, 'כתב ויתור סודיות והסכמה למסירת מידע - כללי', 'שש-שנתי ע"ש משה ארנס • שנת הלימודים תשפ"ז');

  let y = 60;
  drawSectionTitle(doc, y, 'פרטי מוסר/ת ההרשאה');
  y += 12;
  drawFormField(doc, 110, y, 80, 'שם ההורה / אפוטרופוס');
  drawFormField(doc, 15, y, 85, 'ת.ז. ההורה');
  y += 10;
  drawFormField(doc, 110, y, 80, 'שם התלמיד/ה');
  drawFormField(doc, 15, y, 85, 'ת.ז. התלמיד/ה');

  y += 16;
  drawSectionTitle(doc, y, 'נוסח כתב הוויתור');
  y += 12;
  doc.setFont('FreeSans', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const p1 = 'הריני מוותר/ת בזאת על סודיות רפואית, פדגוגית, פסיכולוגית וטיפולית כלפי הנהלת בית הספר השש-שנתי ע"ש משה ארנס, הצוות החינוכי, יועצות השכבה והצוות הטיפולי המוסמך.';
  doc.text(reverseHebrew(p1), 190, y, { align: 'right', maxWidth: 175 });
  y += 16;

  const p2 = 'אני מסמיך/ה את בית הספר לקבל ולמסור מידע מקצועי ורלוונטי מגורמים מקצועיים מוסמכים (כגון מתי"א, שפ"ח, גורמי רווחה ובריאות), וזאת אך ורק לצורך התאמת המענים הפדגוגיים, הרגשיים והאישיים לטובת התלמיד/ה.';
  doc.text(reverseHebrew(p2), 190, y, { align: 'right', maxWidth: 175 });
  y += 20;

  const p3 = 'ידוע לי כי המידע שיימסר יישמר בסודיות מלאה על פי חוק הגנת הפרטיות, וייחשף אך ורק בפני גורמים מורשים בצוות החינוכי והמקצועי של המוסד.';
  doc.text(reverseHebrew(p3), 190, y, { align: 'right', maxWidth: 175 });

  y += 30;
  drawSignatureBlock(doc, y);

  doc.save(path.join(targetDir, 'confidentiality-waiver-general.pdf'));
}

// 5. Psychological Waiver
function generateConfidentialityWaiverPsychological() {
  const doc = createBaseDoc();
  drawSchoolHeader(doc, 'אישור ויתור סודיות עבור השירות הפסיכולוגי-חינוכי (שפ"ח)', 'עיריית פתח תקווה • מינהל החינוך • השירות הפסיכולוגי החינוכי');

  let y = 60;
  drawSectionTitle(doc, y, 'פרטי ההורים והתלמיד/ה');
  y += 12;
  drawFormField(doc, 110, y, 80, 'שם התלמיד/ה');
  drawFormField(doc, 15, y, 85, 'מספר ת.ז.');
  y += 10;
  drawFormField(doc, 110, y, 80, 'שם האב ות.ז.');
  drawFormField(doc, 15, y, 85, 'שם האם ות.ז.');
  y += 10;
  drawFormField(doc, 110, y, 80, 'שכבה וכיתה בארנס');
  drawFormField(doc, 15, y, 85, 'יועצת השכבה');

  y += 16;
  drawSectionTitle(doc, y, 'הרשאה להחלפת מידע עם השירות הפסיכולוגי');
  y += 12;
  doc.setFont('FreeSans', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const t1 = 'אנו, הורי התלמיד/ה הנ"ל, נותנים בזאת את הסכמתנו לפסיכולוג/ית בית הספר מטעם השפ"ח (השירות הפסיכולוגי החינוכי פתח תקווה) לקיים קשר מקצועי, לקיים תצפית חינוכית במידת הצורך ולהחליף מידע עם הצוות החינוכי והטיפולי של בית הספר.';
  doc.text(reverseHebrew(t1), 190, y, { align: 'right', maxWidth: 175 });
  y += 20;

  const t2 = 'ההסכמה ניתנת לצורך הבנת צרכיו הייחודיים של התלמיד/ה וגיבוש תוכנית תמיכה וליווי מיטבית עבורו/ה במסגרת בית הספר.';
  doc.text(reverseHebrew(t2), 190, y, { align: 'right', maxWidth: 175 });

  y += 35;
  drawSignatureBlock(doc, y);

  doc.save(path.join(targetDir, 'confidentiality-waiver-psychological.pdf'));
}

// 6. Grade Appeal
function generateGradeAppeal() {
  const doc = createBaseDoc();
  drawSchoolHeader(doc, 'טופס ערעור על ציון (מחצית / שנתי / מגן)', 'הנהלת שש-שנתי ע"ש משה ארנס • הליך ערעור פדגוגי מוסדר');

  let y = 60;
  drawSectionTitle(doc, y, '1. פרטי המערער/ת');
  y += 12;
  drawFormField(doc, 110, y, 80, 'שם התלמיד/ה');
  drawFormField(doc, 15, y, 85, 'כיתה ושכבה');
  y += 10;
  drawFormField(doc, 110, y, 80, 'מקצוע הלימוד שעליו מערערים');
  drawFormField(doc, 15, y, 85, 'שם המורה המלמד/ת');
  y += 10;
  drawFormField(doc, 110, y, 80, 'סוג הציון (מבחן/מחצית/מגן/בגרות)');
  drawFormField(doc, 15, y, 85, 'הציון שהתקבל');

  y += 16;
  drawSectionTitle(doc, y, '2. נימוקי הערעור');
  y += 10;
  doc.setFont('FreeSans', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(reverseHebrew('נא לפרט בצורה עניינית את הנימוקים הפדגוגיים, שאלות שלגביהן חל לדעתך אי-דיוק בבדיקה או חישוב הממוצע:'), 190, y, { align: 'right' });
  y += 8;

  // 4 Lines for appeal reasons
  for (let i = 0; i < 4; i++) {
    doc.setDrawColor(203, 213, 225);
    doc.line(15, y, 190, y);
    y += 8;
  }

  y += 6;
  drawSectionTitle(doc, y, '3. החלטת רכז/ת המקצוע וההנהלה (למילוי ע"י הצוות)');
  y += 10;
  drawFormField(doc, 110, y, 80, 'החלטה: התקבל / נדחה / תיקון נקודתי');
  drawFormField(doc, 15, y, 85, 'ציון סופי מעודכן');
  y += 10;
  drawFormField(doc, 110, y, 80, 'שם רכז/ת המקצוע וחתימה');
  drawFormField(doc, 15, y, 85, 'תאריך קבלת ההחלטה');

  y += 18;
  drawSignatureBlock(doc, y);

  doc.save(path.join(targetDir, 'grade-appeal-form.pdf'));
}

// 7. Book Lending Project
function generateBookLending() {
  const doc = createBaseDoc();
  drawSchoolHeader(doc, 'טופס הצטרפות לפרויקט השאלת ספרי לימוד תשפ"ז', 'פרויקט השאלת ספרים בית ספרי בהתאם להנחיות משרד החינוך');

  let y = 60;
  drawSectionTitle(doc, y, 'פרטי התלמיד/ה וההורים');
  y += 12;
  drawFormField(doc, 110, y, 80, 'שם מלא של התלמיד/ה');
  drawFormField(doc, 15, y, 85, 'שכבה מיועדת בתשפ"ז (ז\'-יב\')');
  y += 10;
  drawFormField(doc, 110, y, 80, 'שם ההורה');
  drawFormField(doc, 15, y, 85, 'טלפון נייד הורה');

  y += 16;
  drawSectionTitle(doc, y, 'תנאי פרויקט השאלת ספרים');
  y += 12;
  doc.setFont('FreeSans', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const t1 = '• פרויקט השאלת ספרים מעניק לכל תלמיד סל ספרי לימוד מלא ואיכותי לשנת הלימודים, בתשלום אגרה מפוקחת כחוק.';
  doc.text(reverseHebrew(t1), 190, y, { align: 'right' });
  y += 8;
  const t2 = '• התלמיד והוריו מתחייבים לשמור על שלמות הספרים ולהחזירם במצב תקין ומכובד בתום שנת הלימודים.';
  doc.text(reverseHebrew(t2), 190, y, { align: 'right' });
  y += 8;
  const t3 = '• במקרה של אובדן ספר או נזק בלתי הפיך, מתחייב ההורה להחליפו בספר חדש או לשלם את עלותו.';
  doc.text(reverseHebrew(t3), 190, y, { align: 'right' });
  y += 14;

  doc.rect(185, y - 4, 4, 4);
  doc.text(reverseHebrew('הנני מעוניין/ת להצטרף לפרויקט השאלת הספרים ומאשר/ת את התנאים.'), 178, y, { align: 'right' });

  y += 35;
  drawSignatureBlock(doc, y);

  doc.save(path.join(targetDir, 'book-lending-project.pdf'));
}

// 8. Scholarship Request
function generateScholarshipRequest() {
  const doc = createBaseDoc();
  drawSchoolHeader(doc, 'בקשת מלגה או הסדר תשלום באגרות חינוך תשפ"ז', 'ועדת מלגות • שש-שנתי ע"ש משה ארנס • סיוע מוסדר בדיסקרטיות');

  let y = 60;
  drawSectionTitle(doc, y, 'פרטי התלמיד/ה והמשפחה');
  y += 12;
  drawFormField(doc, 110, y, 80, 'שם התלמיד/ה ומספר ת.ז.');
  drawFormField(doc, 15, y, 85, 'שכבה וכיתה');
  y += 10;
  drawFormField(doc, 110, y, 80, 'שמות ההורים ומספרי נייד');
  drawFormField(doc, 15, y, 85, 'מספר נפשות במשפחה');

  y += 16;
  drawSectionTitle(doc, y, 'נימוקי הפנייה ומסמכים מצורפים');
  y += 10;
  doc.setFont('FreeSans', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(reverseHebrew('נא לצרף אישורים רלוונטיים (אישור הכנסה / 3 תלושי שכר / אישור אבטלה / אישור ביטוח לאומי / נכות):'), 190, y, { align: 'right' });
  y += 8;

  for (let i = 0; i < 3; i++) {
    doc.setDrawColor(203, 213, 225);
    doc.line(15, y, 190, y);
    y += 8;
  }

  y += 8;
  doc.setFont('FreeSans', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(reverseHebrew('ידוע לנו כי הבקשה תידון בוועדת המלגות בדיסקרטיות מוחלטת, ותשובה תימסר בהקדם האפשרי.'), 190, y, { align: 'right' });

  y += 25;
  drawSignatureBlock(doc, y);

  doc.save(path.join(targetDir, 'scholarship-request.pdf'));
}

// 9. Field Trip Parent Approval
function generateFieldTripApproval() {
  const doc = createBaseDoc();
  drawSchoolHeader(doc, 'אישור הורים קבוע ליציאה לפעילויות חוץ וסיורים', 'חוזר מנכ"ל בטיחות בטיולים • שנת הלימודים תשפ"ז');

  let y = 60;
  drawSectionTitle(doc, y, 'פרטי התלמיד/ה והכיתה');
  y += 12;
  drawFormField(doc, 110, y, 80, 'שם התלמיד/ה');
  drawFormField(doc, 15, y, 85, 'תעודת זהות');
  y += 10;
  drawFormField(doc, 110, y, 80, 'כיתה ומחנך/ת');
  drawFormField(doc, 15, y, 85, 'טלפון חירום של ההורים');

  y += 16;
  drawSectionTitle(doc, y, 'נוסח אישור היציאה');
  y += 12;
  doc.setFont('FreeSans', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const t1 = 'אנו מאשרים לבננו/בנתנו להשתתף בסיורים הלימודיים, בטיולים השנתיים, בסיורי המגמות ובפעילויות השל"ח והחינוך החברתי המתקיימים מחוץ לכותלי בית הספר במהלך שנת הלימודים תשפ"ז.';
  doc.text(reverseHebrew(t1), 190, y, { align: 'right', maxWidth: 175 });
  y += 16;

  const t2 = 'ידוע לנו כי כל פעילות חוץ מלווה במאבטחים, חובשים ורכבי ליווי בהתאם להנחיות הלשכה לתיאום טיולים של משרד החינוך ומשטרת ישראל.';
  doc.text(reverseHebrew(t2), 190, y, { align: 'right', maxWidth: 175 });

  y += 30;
  drawSignatureBlock(doc, y);

  doc.save(path.join(targetDir, 'field-trip-parent-approval.pdf'));
}

// 10. Math Summer Work Grade 8
function generateMathSummerWork() {
  const doc = createBaseDoc();
  drawSchoolHeader(doc, 'חוברת עבודת קיץ במתמטיקה - עולים לכיתה ח\'', 'צוות מתמטיקה חטיבת הנעורים • חזרה ותרגול לקראת שנת תשפ"ז');

  let y = 60;
  drawSectionTitle(doc, y, 'הנחיות כלליות לעבודת הקיץ');
  y += 12;
  doc.setFont('FreeSans', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const p1 = 'תלמידים יקרים, עבודת הקיץ נועדה לסייע לכם לרענן ולחזק את המיומנויות המתמטיות שנלמדו במהלך כיתה ז\', ולהכין אתכם בצורה מיטבית ללימודי מתמטיקה בכיתה ח\'.';
  doc.text(reverseHebrew(p1), 190, y, { align: 'right', maxWidth: 175 });
  y += 14;

  const p2 = 'הנושאים הנכללים בחוברת: אלגברה בסיסית, כינוס איברים דומים, פתרון משוואות ממעלה ראשונה, שאלות מילוליות בסיסיות, וגיאומטריה (שטחים והיקפים של מצולעים).';
  doc.text(reverseHebrew(p2), 190, y, { align: 'right', maxWidth: 175 });
  y += 16;

  drawSectionTitle(doc, y, 'פרקי התרגול');
  y += 12;
  doc.text(reverseHebrew('1. ציר המספרים, מספרים מכוונים ופעולות חשבון.'), 190, y, { align: 'right' });
  y += 8;
  doc.text(reverseHebrew('2. ביטויים אלגבריים והצבת ערכים מספריים.'), 190, y, { align: 'right' });
  y += 8;
  doc.text(reverseHebrew('3. פתרון משוואות ושימוש בחוק הפילוג.'), 190, y, { align: 'right' });
  y += 8;
  doc.text(reverseHebrew('4. בעיות מילוליות חד-שלביות ורב-שלביות.'), 190, y, { align: 'right' });
  y += 8;
  doc.text(reverseHebrew('5. זוויות, משולשים ומרובעים.'), 190, y, { align: 'right' });
  y += 14;

  doc.setFont('FreeSans', 'bold');
  doc.setTextColor(3, 105, 161);
  doc.text(reverseHebrew('יש להגיש את החוברת פתורה בשבוע הראשון של שנת הלימודים למורה למתמטיקה.'), 190, y, { align: 'right' });

  doc.save(path.join(targetDir, 'math-summer-work-grade-8.pdf'));
}

// 11. English Book Report
function generateEnglishBookReport() {
  const doc = createBaseDoc();
  drawSchoolHeader(doc, 'English Book Report Guidelines - Grades 8 & 9', 'English Department • Junior High • Summer Reading Assignment');

  let y = 60;
  drawSectionTitle(doc, y, 'Summer Reading Guidelines');
  y += 12;
  doc.setFont('FreeSans', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  doc.text(reverseHebrew('Dear Students, reading in English over the summer is one of the best ways to improve your vocabulary, comprehension, and fluency.'), 190, y, { align: 'right', maxWidth: 175 });
  y += 14;

  drawSectionTitle(doc, y, 'Required Components of the Report');
  y += 12;
  doc.text(reverseHebrew('1. Book Information: Title, Author, Number of Pages, Genre.'), 190, y, { align: 'right' });
  y += 8;
  doc.text(reverseHebrew('2. Main Characters: Describe the protagonist and antagonist (3-4 sentences each).'), 190, y, { align: 'right' });
  y += 8;
  doc.text(reverseHebrew('3. Setting: Where and when does the story take place?'), 190, y, { align: 'right' });
  y += 8;
  doc.text(reverseHebrew('4. Plot Summary: Briefly explain the beginning, climax, and resolution (6-8 sentences).'), 190, y, { align: 'right' });
  y += 8;
  doc.text(reverseHebrew('5. Personal Opinion: Did you enjoy the book? Why or why not? Would you recommend it?'), 190, y, { align: 'right' });
  y += 16;

  doc.setFont('FreeSans', 'bold');
  doc.setTextColor(3, 105, 161);
  doc.text(reverseHebrew('Due Date: The assignment must be handed in during the first week of school.'), 190, y, { align: 'right' });

  doc.save(path.join(targetDir, 'english-book-report.pdf'));
}

async function main() {
  console.log('Generating official school PDF forms in /public/forms ...');

  generateStudentCardHigh();
  generateStudentCardJunior();
  generateHealthDeclaration();
  generateConfidentialityWaiverGeneral();
  generateConfidentialityWaiverPsychological();
  generateGradeAppeal();
  generateBookLending();
  generateScholarshipRequest();
  generateFieldTripApproval();
  generateMathSummerWork();
  generateEnglishBookReport();

  console.log('PDF forms generated successfully.');

  // Download original DOCX files from arens.tik-tak.school
  console.log('Downloading original DOCX files from arens.tik-tak.school ...');
  const docxFiles = [
    { name: 'student-card-high.docx', url: 'https://arens.tik-tak.school/wp-content/uploads/sites/120/2024/11/%D7%9B%D7%A8%D7%98%D7%99%D7%A1-%D7%9C%D7%AA%D7%9C%D7%9E%D7%99%D7%93-%D7%9C%D7%AA%D7%99%D7%9B%D7%95%D7%9F.docx' },
    { name: 'student-card-junior.docx', url: 'https://arens.tik-tak.school/wp-content/uploads/sites/120/2024/11/%D7%9B%D7%A8%D7%98%D7%99%D7%A1-%D7%9C%D7%AA%D7%9C%D7%9E%D7%99%D7%93-%D7%9C%D7%build/docx' },
    { name: 'student-card-junior.docx', url: 'https://arens.tik-tak.school/wp-content/uploads/sites/120/2024/11/%D7%9B%D7%A8%D7%98%D7%99%D7%A1-%D7%9C%D7%AA%D7%9C%D7%9E%D7%99%D7%93-%D7%9C%D7%97%D7%98%D7%99%D7%91%D7%94.docx' },
    { name: 'confidentiality-waiver-general.docx', url: 'https://arens.tik-tak.school/wp-content/uploads/sites/120/2024/11/%D7%95%D7%99%D7%AA%D7%95%D7%A8-%D7%A1%D7%95%D7%93%D7%99%D7%95%D7%AA-4.docx' },
    { name: 'confidentiality-waiver-psychological.docx', url: 'https://arens.tik-tak.school/wp-content/uploads/sites/120/2024/11/%D7%9E%D7%A1%D7%9E%D7%9A-%D7%90%D7%99%D7%A9%D7%95%D7%A8-%D7%9C%D7%A4%D7%A1%D7%99%D7%95%D7%9B%D7%95%D7%9C%D7%95%D7%92-%D7%90%D7%99%D7%A9%D7%95%D7%A8-%D7%95%D7%99%D7%AA%D7%95%D7%A8-%D7%A1%D7%95%D7%93%D7%99%D7%95%D7%AA-1-1.docx' },
    { name: 'health-declaration.docx', url: 'https://arens.tik-tak.school/wp-content/uploads/sites/120/2024/11/%D7%94%D7%A6%D7%94%D7%A8%D7%AA-%D7%91%D7%A8%D7%99%D7%90%D7%95%D7%AA-1.docx' },
    { name: 'grade-appeal-form.docx', url: 'https://arens.tik-tak.school/wp-content/uploads/sites/120/2024/11/%D7%98%D7%95%D7%A4%D7%A1-%D7%A2%D7%A8%D7%A2%D7%95%D7%A8-%D7%A2%D7%9C-%D7%A6%D7%99%D7%95%D7%9F-%D7%94%D7%92%D7%A9%D7%94.docx' }
  ];

  for (const item of docxFiles) {
    try {
      await downloadFile(item.url, path.join(targetDir, item.name));
      console.log('Downloaded:', item.name);
    } catch (e) {
      console.warn('Failed downloading:', item.name, e.message);
    }
  }

  console.log('All forms prepared in /public/forms.');
}

main().catch(console.error);
