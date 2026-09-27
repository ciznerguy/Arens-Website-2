const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function reverseHebrew(str) {
  if (!str) return '';
  const hebrewRegex = /[\u0590-\u05FF]/;
  if (!hebrewRegex.test(str)) return str;

  // Split into tokens (hebrew word, punctuation, numbers, etc.)
  const tokens = str.match(/[\u0590-\u05FF]+|[a-zA-Z0-9%״׳.,:;!?()"-]+|\s+/g) || [str];
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

const W = 297;
const H = 167; // 16:9 widescreen in mm

const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [W, H] });

const fontBase64 = fs.readFileSync('/usr/share/fonts/truetype/freefont/FreeSans.ttf').toString('base64');
const fontBoldBase64 = fs.readFileSync('/usr/share/fonts/truetype/freefont/FreeSansBold.ttf').toString('base64');

doc.addFileToVFS('FreeSans.ttf', fontBase64);
doc.addFont('FreeSans.ttf', 'FreeSans', 'normal');

doc.addFileToVFS('FreeSansBold.ttf', fontBoldBase64);
doc.addFont('FreeSansBold.ttf', 'FreeSans', 'bold');

function drawSlideDecorations(doc, isCover = false) {
  // Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, 'F');

  // Candlestick chart elements on left side
  doc.setFillColor(204, 251, 241); // light teal
  doc.rect(12, 10, 3, 25, 'F');
  doc.setFillColor(254, 215, 170); // light orange
  doc.rect(18, 18, 3, 18, 'F');
  doc.setFillColor(204, 251, 241);
  doc.rect(24, 6, 3, 30, 'F');
  doc.setFillColor(254, 215, 170);
  doc.rect(30, 22, 3, 14, 'F');

  // Candlestick elements at bottom left
  doc.setFillColor(204, 251, 241);
  doc.rect(10, 115, 2.5, 30, 'F');
  doc.setFillColor(254, 215, 170);
  doc.rect(15, 125, 2.5, 20, 'F');
  doc.setFillColor(204, 251, 241);
  doc.rect(20, 110, 2.5, 35, 'F');
  doc.setFillColor(254, 215, 170);
  doc.rect(25, 130, 2.5, 15, 'F');

  // Candlestick elements at bottom center/right
  doc.setFillColor(254, 215, 170);
  doc.rect(110, 135, 3, 20, 'F');
  doc.setFillColor(204, 251, 241);
  doc.rect(116, 128, 3, 28, 'F');
  doc.setFillColor(254, 215, 170);
  doc.rect(122, 140, 3, 16, 'F');

  // Top orange accent band
  doc.setFillColor(249, 115, 22);
  doc.rect(190, 32, 95, 28, 'F');

  // Teal chevrons pointing right
  doc.setFillColor(45, 212, 191);
  for (let i = 0; i < 5; i++) {
    const x = 110 + i * 16;
    doc.triangle(x, 32, x + 12, 46, x, 60, 'F');
  }

  // School Logo at top right
  doc.setDrawColor(34, 197, 94); // green
  doc.setLineWidth(0.8);
  doc.circle(275, 16, 9);
  doc.setFont('FreeSans', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(22, 101, 52);
  doc.text(reverseHebrew('תיכון ארנס'), 275, 14, { align: 'center' });
  doc.text(reverseHebrew('אדם וחברה'), 275, 18, { align: 'center' });

  // Footer slogan
  if (!isCover) {
    doc.setFont('FreeSans', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(249, 115, 22); // orange
    doc.text(reverseHebrew('ארנס מצמיח אדם וחברה'), 148, 155, { align: 'center' });
  }
}

function drawCard(doc, x, y, w, h, title, subtitle = '', borderColor = [13, 148, 136]) {
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.7);
  doc.roundedRect(x, y, w, h, 3, 3, 'FD');

  doc.setFont('FreeSans', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  if (subtitle) {
    doc.text(reverseHebrew(title), x + w / 2, y + h / 2 - 2, { align: 'center' });
    doc.setFont('FreeSans', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(reverseHebrew(subtitle), x + w / 2, y + h / 2 + 5, { align: 'center' });
  } else {
    doc.text(reverseHebrew(title), x + w / 2, y + h / 2 + 2, { align: 'center' });
  }
}

// -------------------------------------------------------------
// SLIDE 1: Cover
// -------------------------------------------------------------
drawSlideDecorations(doc, true);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(28);
doc.setTextColor(13, 148, 136); // teal
doc.text(reverseHebrew('אסיפת הורים'), 225, 80, { align: 'center' });
doc.text(reverseHebrew('תשפ״ז תיכון'), 225, 93, { align: 'center' });
doc.text(reverseHebrew('משה ארנס'), 225, 106, { align: 'center' });
doc.setFontSize(24);
doc.text('2026', 225, 120, { align: 'center' });

// -------------------------------------------------------------
// SLIDE 2: חזון בית-הספר
// -------------------------------------------------------------
doc.addPage([W, H], 'landscape');
drawSlideDecorations(doc);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(20);
doc.setTextColor(15, 23, 42);
doc.text(reverseHebrew('חזון בית-הספר'), 210, 25, { align: 'right' });
doc.setFontSize(16);
doc.setTextColor(30, 41, 59);
doc.text(reverseHebrew('״ארנס מצמיח אדם וחברה״'), 250, 35, { align: 'right' });
doc.setFont('FreeSans', 'normal');
doc.setFontSize(12);
doc.text(reverseHebrew('טיפוח אדם ערכי, לומד עצמאי, פעיל ותורם לחברה בה הוא חיי.'), 250, 46, { align: 'right' });

// 5 Anchors
drawCard(doc, 200, 75, 75, 20, 'חוזקות ואזורי צמיחה');
drawCard(doc, 118, 75, 75, 20, 'האדם הלומד');
drawCard(doc, 36, 75, 75, 20, 'דיאלוג');

drawCard(doc, 150, 110, 75, 20, 'מרחבי בחירה');
drawCard(doc, 68, 110, 75, 20, 'אחריות אישית וחברתית');

// -------------------------------------------------------------
// SLIDE 3: אמנת בית הספר
// -------------------------------------------------------------
doc.addPage([W, H], 'landscape');
drawSlideDecorations(doc);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(20);
doc.setTextColor(15, 23, 42);
doc.text(reverseHebrew('אמנת בית הספר'), 200, 25, { align: 'center' });

doc.setFont('FreeSans', 'normal');
doc.setFontSize(9);
doc.setTextColor(30, 41, 59);
doc.text(reverseHebrew('אנו, תלמידי ותלמידות בית הספר, צוות החינוך וההוראה, ההורים והקהילה הבית ספרית,'), 260, 36, { align: 'right' });
doc.text(reverseHebrew('מאמינים כי אקלים מיטבי נבנה מתוך כבוד, אחריות, הקשבה ושותפות.'), 260, 42, { align: 'right' });
doc.text(reverseHebrew('כולנו שותפים ליצירת מרחב בטוח, מכבד ומאפשר – מקום שבו כל אדם מרגיש שייך, מוגן ובעל ערך.'), 260, 50, { align: 'right' });
doc.setFont('FreeSans', 'bold');
doc.text(reverseHebrew('לפיכך אנו מתחייבים לפעול ברוח העקרונות הבאים:'), 260, 58, { align: 'right' });

const charterRules = [
  'אנחנו בוחרים בשיח ובכבוד הדדי, ולא באלימות פיזית, מילולית או חברתית.',
  'אנחנו לוקחים אחריות על המעשים שלנו.',
  'אנחנו שומרים על המרחב הדיגיטלי ומתחייבים לא לפרסם, לשתף או להפיץ תוכן פוגעני או מבזה.',
  'אנחנו שומרים על סביבה נקייה בבית הספר ועל הרכוש המשותף.',
  'אנחנו מכבדים את הגבולות והמרחב האישי של כל באי בית הספר.',
  'אנחנו לא עומדים מנגד כשמישהו נפגע, ומשתפים או מדווחים כשנדרשת עזרה.',
  'אנחנו פועלים כדי שכל אחת ואחד ירגישו שייכים, רצויים ובעלי ערך בקהילת בית הספר.'
];

doc.setFont('FreeSans', 'normal');
doc.setFontSize(9.5);
charterRules.forEach((rule, idx) => {
  doc.text(reverseHebrew(`• ${rule}`), 260, 68 + idx * 8, { align: 'right' });
});

// -------------------------------------------------------------
// SLIDE 4: הדרך שלי בארנס
// -------------------------------------------------------------
doc.addPage([W, H], 'landscape');
drawSlideDecorations(doc);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(16);
doc.setTextColor(13, 148, 136);

doc.setFillColor(255, 255, 255);
doc.setDrawColor(13, 148, 136);
doc.roundedRect(110, 50, 77, 18, 3, 3, 'FD');
doc.text(reverseHebrew('הדרך שלי בארנס.......'), 148, 62, { align: 'center' });

// 5 Boxes
const pathBoxes = [
  { t1: 'שנה ראשונה', t2: 'למידה מהחלומות' },
  { t1: 'שנה שניה', t2: 'פיתוח חזון בית הספר' },
  { t1: 'שנה שלישית', t2: 'קהילה מקצועית לומדת' },
  { t1: 'שנה רביעית', t2: 'הטמעת מיומנויות ואמנה' },
  { t1: 'שנה חמישית', t2: 'פיתוח מרחבי למידה' }
];

pathBoxes.forEach((b, i) => {
  const x = 12 + i * 55;
  drawCard(doc, x, 95, 50, 30, b.t1, b.t2);
  if (i < 4) {
    doc.setFont('FreeSans', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(13, 148, 136);
    doc.text('→', x + 52.5, 112);
  }
});

// -------------------------------------------------------------
// SLIDE 5: שלוש השכבות
// -------------------------------------------------------------
doc.addPage([W, H], 'landscape');
drawSlideDecorations(doc);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(22);
doc.setTextColor(249, 115, 22);
doc.text(reverseHebrew('״ארנס מצמיח אדם וחברה״'), 148, 30, { align: 'center' });

drawCard(doc, 90, 55, 117, 18, 'שכבת י׳ – אכפת לי');
drawCard(doc, 90, 85, 117, 18, 'שכבת י״א – אתגרים בחיים');
drawCard(doc, 90, 115, 117, 18, 'שכבת י״ב – משאירים חותם');

// -------------------------------------------------------------
// SLIDE 6: לוח זמנים ובגרויות (שקופית מרכזית)
// -------------------------------------------------------------
doc.addPage([W, H], 'landscape');
drawSlideDecorations(doc);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(22);
doc.setTextColor(249, 115, 22);
doc.text(reverseHebrew('לוח זמנים'), 148, 25, { align: 'center' });

function drawScheduleCol(doc, x, title, items) {
  doc.setFont('FreeSans', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(reverseHebrew(title), x + 40, 42, { align: 'center' });

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(x, 46, 80, 95, 2, 2, 'FD');

  doc.setFont('FreeSans', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(30, 41, 59);

  items.forEach((it, idx) => {
    doc.text(reverseHebrew(it), x + 77, 52 + idx * 7.5, { align: 'right' });
  });
}

const colYod = [
  '1. אכפת לי',
  '2. מבוא למדעים',
  '3. תעבורה',
  '4. מתמטיקה 3 יח״ל - בגרות פנימית (25%)',
  '5. היסטוריה - חיצוני (35%) + מבוקרות (35%)',
  '6. לשון - הערכה פנימית (30%) אקדמיה י2, י3',
  '7. תנ״ך - הערכה פנימית (15%)',
  '8. ספרות - הערכה פנימית (30%) + 2 משימות מבוקרות',
  '9. מגמות - הערכה פנימית',
  '10. אנגלית - ספרות פנימי',
  '11. מעורבות חברתית - 60 שעות אישיות + 9 קבוצתיות'
];

const colYodAlef = [
  '1. מתמטיקה 3 יח״ל - בגרות חורף חיצונית (35%)',
  '2. מתמטיקה 4 יח״ל - בגרות חיצונית (65%)',
  '3. מתמטיקה 5 יח״ל - בגרות חיצונית (60%)',
  '4. אנגלית - בגרות חורף חיצונית (54%), פנימית (20%)',
  '5. ספרות - מבוקרת (17.5%) + חיצונית (35%) חורף',
  '6. לשון - בגרות חיצונית (70%)',
  '7. תנ״ך - מחצית 2 (35%) + משימות מבוקרות (35%)',
  '8. אזרחות - 2 משימות מבוקרות',
  '9. היסטוריה הערכה חלופית 30%',
  '10. מגמות',
  '11. מעורבות חברתית - 30 שעות אישיות + 21 קבוצתיות'
];

const colYodBet = [
  '1. מתמטיקה 3 יח״ל - בגרות חיצונית חורף וקיץ (40%)',
  '2. מתמטיקה 4 יח״ל - בגרות חיצונית (35%)',
  '3. מתמטיקה 5 יח״ל - בגרות חיצונית (40%)',
  '4. אנגלית - בגרות חיצונית בע״פ חורף (26%)',
  '5. אזרחות - הערכה חיצונית (35%) חורף, 30% חלופית',
  '6. תנ״ך - 17% משימה מבוקרת, 35% חיצונית קיץ',
  '7. מגמות',
  '8. מעורבות חברתית - 26 שעות קבוצתיות'
];

drawScheduleCol(doc, 195, 'כיתה י׳', colYod);
drawScheduleCol(doc, 108, 'כיתה י״א', colYodAlef);
drawScheduleCol(doc, 21, 'כיתה י״ב', colYodBet);

// -------------------------------------------------------------
// SLIDE 7: פתיח שכבת י׳
// -------------------------------------------------------------
doc.addPage([W, H], 'landscape');
drawSlideDecorations(doc, true);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(36);
doc.setTextColor(13, 148, 136);
doc.text(reverseHebrew('שכבת י׳'), 210, 85, { align: 'center' });
doc.setFont('FreeSans', 'bold');
doc.setFontSize(14);
doc.setTextColor(249, 115, 22);
doc.text(reverseHebrew('ארנס מצמיח אדם וחברה'), 148, 145, { align: 'center' });

// -------------------------------------------------------------
// SLIDE 8: למידה בין תחומית
// -------------------------------------------------------------
doc.addPage([W, H], 'landscape');
drawSlideDecorations(doc);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(22);
doc.setTextColor(249, 115, 22);
doc.text(reverseHebrew('למידה בין תחומית'), 148, 30, { align: 'center' });

drawCard(doc, 155, 70, 95, 25, 'מרכיבים לחברת מופת', 'לשון + תנ״ך');
drawCard(doc, 45, 70, 95, 25, 'זהות וחברה', 'היסטוריה + ספרות');

// -------------------------------------------------------------
// SLIDE 9: אכפת לי – מרחב פעולה השפעה ומשמעות
// -------------------------------------------------------------
doc.addPage([W, H], 'landscape');
drawSlideDecorations(doc);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(20);
doc.setTextColor(249, 115, 22);
doc.text(reverseHebrew('אכפת לי – מרחב פעולה השפעה ומשמעות .'), 148, 30, { align: 'center' });

const yodBoxes = [
  'השבעה באוקטובר\nרצח רבין - סמינר דמוקרטיה\nיום השואה\nיום הזיכרון',
  'סיום מחצית\n-\nסוף שנה',
  'אקו ארנס',
  'פורים'
];

yodBoxes.forEach((text, i) => {
  const x = 30 + i * 60;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(13, 148, 136);
  doc.roundedRect(x, 55, 52, 55, 3, 3, 'FD');

  const lines = text.split('\n');
  doc.setFont('FreeSans', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  lines.forEach((l, li) => {
    doc.text(reverseHebrew(l), x + 26, 70 + li * 8, { align: 'center' });
  });

  if (i < 3) {
    doc.setFontSize(14);
    doc.setTextColor(13, 148, 136);
    doc.text('→', x + 54, 82);
  }
});

// -------------------------------------------------------------
// SLIDE 10: חינוך
// -------------------------------------------------------------
doc.addPage([W, H], 'landscape');
drawSlideDecorations(doc);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(22);
doc.setTextColor(249, 115, 22);
doc.text(reverseHebrew('חינוך'), 148, 28, { align: 'center' });

drawCard(doc, 155, 55, 95, 26, 'הכרות, הצבת מטרות', 'אזורי חוזק');
drawCard(doc, 45, 55, 95, 26, 'ניהול זמן', 'עבודה בקבוצות');

drawCard(doc, 155, 95, 95, 28, 'השכלה כללית', 'חינוך פיננסי');
drawCard(doc, 45, 95, 95, 28, 'תכנים ייעוציים', 'אינטרנט בטוח, נוער גאה, חרדות, דור האלכוהול');

// -------------------------------------------------------------
// SLIDE 11: ערוצים שלנו
// -------------------------------------------------------------
doc.addPage([W, H], 'landscape');
drawSlideDecorations(doc);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(22);
doc.setTextColor(13, 148, 136);
doc.text(reverseHebrew('ערוצים שלנו'), 220, 28, { align: 'center' });

// Simple bar chart graphic
doc.setFillColor(45, 212, 191);
doc.rect(20, 95, 40, 45, 'F');
doc.rect(65, 85, 40, 55, 'F');
doc.rect(110, 65, 40, 75, 'F');

doc.setFont('FreeSans', 'bold');
doc.setFontSize(14);
doc.setTextColor(15, 23, 42);
doc.text(reverseHebrew('אתר בית הספר'), 250, 60, { align: 'right' });
doc.text(reverseHebrew('יוטיוב'), 190, 60, { align: 'right' });
doc.text(reverseHebrew('אינסטגרם'), 250, 85, { align: 'right' });
doc.text(reverseHebrew('פייסבוק'), 190, 85, { align: 'right' });

// -------------------------------------------------------------
// SLIDE 12: פתיח שכבת י״א
// -------------------------------------------------------------
doc.addPage([W, H], 'landscape');
drawSlideDecorations(doc, true);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(36);
doc.setTextColor(13, 148, 136);
doc.text(reverseHebrew('שכבת י״א'), 210, 85, { align: 'center' });
doc.setFont('FreeSans', 'bold');
doc.setFontSize(14);
doc.setTextColor(249, 115, 22);
doc.text(reverseHebrew('ארנס מצמיח אדם וחברה'), 148, 145, { align: 'center' });

// -------------------------------------------------------------
// SLIDE 13: מיומנויות ואתגרים בחיים (י״א)
// -------------------------------------------------------------
doc.addPage([W, H], 'landscape');
drawSlideDecorations(doc);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(20);
doc.setTextColor(249, 115, 22);
doc.text(reverseHebrew('מיומנויות'), 148, 25, { align: 'center' });

drawCard(doc, 195, 40, 75, 18, 'לומד עצמאי');
drawCard(doc, 110, 40, 75, 18, 'ניהול עצמי');
drawCard(doc, 25, 40, 75, 18, 'בחירה ואחריות, עבודת צוות');

doc.setFont('FreeSans', 'bold');
doc.setFontSize(18);
doc.setTextColor(249, 115, 22);
doc.text(reverseHebrew('אתגרים בחיים'), 148, 75, { align: 'center' });

drawCard(doc, 195, 85, 75, 20, 'מסע ישראלי, מסע לפולין');
drawCard(doc, 110, 85, 75, 20, 'מסגרות המשך: צה״ל, מכינות');
drawCard(doc, 25, 85, 75, 20, 'בגרויות, רשיון נהיגה, פיננסית');
drawCard(doc, 110, 112, 75, 20, 'מערכות יחסים: זוגיות וקהילה');

// -------------------------------------------------------------
// SLIDE 14: לוח זמנים (י״א)
// -------------------------------------------------------------
doc.addPage([W, H], 'landscape');
drawSlideDecorations(doc);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(22);
doc.setTextColor(249, 115, 22);
doc.text(reverseHebrew('לוח זמנים'), 148, 25, { align: 'center' });
drawScheduleCol(doc, 195, 'כיתה י׳', colYod);
drawScheduleCol(doc, 108, 'כיתה י״א', colYodAlef);
drawScheduleCol(doc, 21, 'כיתה י״ב', colYodBet);

// -------------------------------------------------------------
// SLIDE 15: מרכז צומחים לדעת
// -------------------------------------------------------------
doc.addPage([W, H], 'landscape');
drawSlideDecorations(doc);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(22);
doc.setTextColor(249, 115, 22);
doc.text(reverseHebrew('מרכז צומחים לדעת'), 148, 25, { align: 'center' });

drawCard(doc, 105, 40, 85, 20, 'פיתוח לומד עצמאי');

const tzmBoxes = ['הצבת יעדים', 'עבודת צוות', 'אחריות', 'ניהול זמן'];
tzmBoxes.forEach((b, idx) => {
  drawCard(doc, 20 + idx * 65, 75, 60, 20, b);
});

drawCard(doc, 105, 110, 85, 20, 'מיומנויות לחיים');

// -------------------------------------------------------------
// SLIDE 16: ערוצים שלנו
// -------------------------------------------------------------
doc.addPage([W, H], 'landscape');
drawSlideDecorations(doc);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(22);
doc.setTextColor(13, 148, 136);
doc.text(reverseHebrew('ערוצים שלנו'), 220, 28, { align: 'center' });
doc.setFillColor(45, 212, 191);
doc.rect(20, 95, 40, 45, 'F');
doc.rect(65, 85, 40, 55, 'F');
doc.rect(110, 65, 40, 75, 'F');
doc.setFont('FreeSans', 'bold');
doc.setFontSize(14);
doc.setTextColor(15, 23, 42);
doc.text(reverseHebrew('אתר בית הספר'), 250, 60, { align: 'right' });
doc.text(reverseHebrew('יוטיוב'), 190, 60, { align: 'right' });
doc.text(reverseHebrew('אינסטגרם'), 250, 85, { align: 'right' });
doc.text(reverseHebrew('פייסבוק'), 190, 85, { align: 'right' });

// -------------------------------------------------------------
// SLIDE 17: פתיח שכבת י״ב
// -------------------------------------------------------------
doc.addPage([W, H], 'landscape');
drawSlideDecorations(doc, true);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(36);
doc.setTextColor(13, 148, 136);
doc.text(reverseHebrew('שכבת י״ב'), 210, 85, { align: 'center' });
doc.setFont('FreeSans', 'bold');
doc.setFontSize(14);
doc.setTextColor(249, 115, 22);
doc.text(reverseHebrew('ארנס מצמיח אדם וחברה'), 148, 145, { align: 'center' });

// -------------------------------------------------------------
// SLIDE 18: מיומנויות ומשאירים חותם (י״ב)
// -------------------------------------------------------------
doc.addPage([W, H], 'landscape');
drawSlideDecorations(doc);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(20);
doc.setTextColor(249, 115, 22);
doc.text(reverseHebrew('מיומנויות'), 148, 25, { align: 'center' });

drawCard(doc, 195, 40, 75, 18, 'לומד עצמאי');
drawCard(doc, 110, 40, 75, 18, 'ניהול עצמי');
drawCard(doc, 25, 40, 75, 18, 'בחירה ואחריות, עבודת צוות');

doc.setFont('FreeSans', 'bold');
doc.setFontSize(18);
doc.setTextColor(249, 115, 22);
doc.text(reverseHebrew('משאירים חותם'), 148, 75, { align: 'center' });

drawCard(doc, 195, 85, 75, 20, 'הפסיפס הישראלי');
drawCard(doc, 110, 85, 75, 20, 'מסגרות המשך: צה״ל, מכינות');
drawCard(doc, 25, 85, 75, 20, 'סיום בגרויות');
drawCard(doc, 75, 112, 145, 20, 'לקחת אחריות על השארת חותם ולהפרד בצורה משמעותית');

// -------------------------------------------------------------
// SLIDE 19: לוח זמנים (י״ב)
// -------------------------------------------------------------
doc.addPage([W, H], 'landscape');
drawSlideDecorations(doc);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(22);
doc.setTextColor(249, 115, 22);
doc.text(reverseHebrew('לוח זמנים'), 148, 25, { align: 'center' });
drawScheduleCol(doc, 195, 'כיתה י׳', colYod);
drawScheduleCol(doc, 108, 'כיתה י״א', colYodAlef);
drawScheduleCol(doc, 21, 'כיתה י״ב', colYodBet);

// -------------------------------------------------------------
// SLIDE 20: ערוצים שלנו
// -------------------------------------------------------------
doc.addPage([W, H], 'landscape');
drawSlideDecorations(doc);
doc.setFont('FreeSans', 'bold');
doc.setFontSize(22);
doc.setTextColor(13, 148, 136);
doc.text(reverseHebrew('ערוצים שלנו'), 220, 28, { align: 'center' });
doc.setFillColor(45, 212, 191);
doc.rect(20, 95, 40, 45, 'F');
doc.rect(65, 85, 40, 55, 'F');
doc.rect(110, 65, 40, 75, 'F');
doc.setFont('FreeSans', 'bold');
doc.setFontSize(14);
doc.setTextColor(15, 23, 42);
doc.text(reverseHebrew('אתר בית הספר'), 250, 60, { align: 'right' });
doc.text(reverseHebrew('יוטיוב'), 190, 60, { align: 'right' });
doc.text(reverseHebrew('אינסטגרם'), 250, 85, { align: 'right' });
doc.text(reverseHebrew('פייסבוק'), 190, 85, { align: 'right' });

// Output
const targetPdfPath = path.join(__dirname, '../public/asifat-horim-2026.pdf');
fs.writeFileSync(targetPdfPath, Buffer.from(doc.output('arraybuffer')));
console.log('Successfully generated presentation PDF at:', targetPdfPath);

// Render pages as PNG images for high-res instant screen rendering
try {
  const slidesDir = path.join(__dirname, '../public/slides/asifat-horim');
  if (!fs.existsSync(slidesDir)) {
    fs.mkdirSync(slidesDir, { recursive: true });
  }
  execSync(`gs -sDEVICE=png16m -r150 -o "${slidesDir}/page-%d.png" "${targetPdfPath}"`);
  console.log('Successfully rendered slide page images into:', slidesDir);
} catch (err) {
  console.error('Error rendering slide images with gs:', err.message);
}
