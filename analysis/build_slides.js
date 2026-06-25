const pptxgen = require("pptxgenjs");
const path = require("path");

const OUT = path.join(__dirname, "output");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.author = "Data Science";
pres.title = "NDB重症化予防ニーズマップ";

// ===== palette =====
const NAVY = "1F3864";
const NAVY2 = "2E5496";
const INK = "263238";
const GRAY = "5A6473";
const LIGHT = "F2F5FA";
const WHITE = "FFFFFF";
const DM = "7F77DD";   // 糖尿病
const CKD = "1D9E75";  // CKD
const CV = "D85A30";   // 心血管
const RED = "A32D2D";
const FONT = "Yu Gothic";
const FONTB = "Yu Gothic";

const W = 13.33, H = 7.5;
const MX = 0.7; // margin x

// ===== helpers =====
function makeShadow() {
  return { type: "outer", color: "000000", blur: 7, offset: 3, angle: 135, opacity: 0.13 };
}

function header(slide, no, kicker, title) {
  // top bar accent
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.12, fill: { color: NAVY } });
  // section number chip
  slide.addShape(pres.shapes.OVAL, { x: MX, y: 0.5, w: 0.62, h: 0.62, fill: { color: NAVY } });
  slide.addText(String(no), { x: MX, y: 0.5, w: 0.62, h: 0.62, align: "center", valign: "middle",
    fontSize: 24, bold: true, color: WHITE, fontFace: FONTB, margin: 0 });
  // kicker + title
  slide.addText(kicker, { x: MX + 0.8, y: 0.46, w: 9, h: 0.32, fontSize: 12, bold: true,
    color: NAVY2, fontFace: FONTB, charSpacing: 2, margin: 0 });
  slide.addText(title, { x: MX + 0.8, y: 0.74, w: 11.5, h: 0.55, fontSize: 26, bold: true,
    color: INK, fontFace: FONTB, margin: 0 });
}

function card(slide, x, y, w, h, fill) {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fill || WHITE },
    line: { color: "E2E8F0", width: 0.75 }, shadow: makeShadow() });
}

// ============================================================
// SLIDE 1 — Title
// ============================================================
let s = pres.addSlide();
s.background = { color: NAVY };
// motif: faint circles
s.addShape(pres.shapes.OVAL, { x: 10.2, y: -1.6, w: 5, h: 5, fill: { color: NAVY2, transparency: 60 } });
s.addShape(pres.shapes.OVAL, { x: 11.6, y: 3.6, w: 3.6, h: 3.6, fill: { color: "3A5A8A", transparency: 55 } });
s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 2.05, w: 0.16, h: 2.5, fill: { color: CV } });
s.addText("NDB第10回オープンデータ分析レポート", { x: MX + 0.4, y: 2.05, w: 11, h: 0.5,
  fontSize: 16, color: "CADCFC", fontFace: FONTB, charSpacing: 1, margin: 0 });
s.addText("二次医療圏別\n重症化予防ニーズマップの構築", { x: MX + 0.4, y: 2.55, w: 11.5, h: 1.9,
  fontSize: 40, bold: true, color: WHITE, fontFace: FONTB, lineSpacingMultiple: 1.05, margin: 0 });
s.addText("― 特定健診データに基づく地域別リスク層別化の試み ―", { x: MX + 0.4, y: 4.7, w: 11, h: 0.5,
  fontSize: 17, color: "CADCFC", fontFace: FONT, margin: 0 });
// footer chips
const chips = ["糖尿病", "CKD（慢性腎臓病）", "心血管"];
const chipColors = [DM, CKD, CV];
chips.forEach((c, i) => {
  const cx = MX + 0.4 + i * 2.7;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: 5.6, w: 2.5, h: 0.5, rectRadius: 0.25,
    fill: { color: chipColors[i] } });
  s.addText(c, { x: cx, y: 5.6, w: 2.5, h: 0.5, align: "center", valign: "middle",
    fontSize: 13, bold: true, color: WHITE, fontFace: FONTB, margin: 0 });
});
s.addText("335 二次医療圏  |  8 検査指標  |  2022年度", { x: MX + 0.4, y: 6.55, w: 11, h: 0.4,
  fontSize: 13, color: "9DB2D6", fontFace: FONT, margin: 0 });

// ============================================================
// SLIDE 2 — 背景
// ============================================================
s = pres.addSlide();
s.background = { color: LIGHT };
header(s, 1, "BACKGROUND", "背景 ― なぜ地域別の重症化予防ニーズか");
// left: narrative
card(s, MX, 1.55, 6.6, 5.3);
s.addText([
  { text: "課題", options: { bold: true, color: NAVY, fontSize: 15, breakLine: true, paraSpaceAfter: 6 } },
  { text: "生活習慣病の重症化（透析導入・心血管イベント）は医療費とQOLに大きな影響。多くは特定健診の検査値異常の段階で介入可能。", options: { color: INK, fontSize: 14, breakLine: true, paraSpaceAfter: 14 } },
  { text: "地域差という壁", options: { bold: true, color: NAVY, fontSize: 15, breakLine: true, paraSpaceAfter: 6 } },
  { text: "食習慣・受診行動・人口構成・医療資源は地域で異なり、画一的な介入は非効率。限られた保健事業リソースを活かすには「どこで・どの疾患のリスクが高いか」の可視化が不可欠。", options: { color: INK, fontSize: 14, breakLine: true, paraSpaceAfter: 14 } },
  { text: "NDBオープンデータの活用", options: { bold: true, color: NAVY, fontSize: 15, breakLine: true, paraSpaceAfter: 6 } },
  { text: "悉皆性の高い全国の特定健診集計値を二次医療圏単位で提供。地域診断の基盤として有用。", options: { color: INK, fontSize: 14 } },
], { x: MX + 0.35, y: 1.85, w: 5.9, h: 4.7, valign: "top", margin: 0 });
// right: objective
s.addShape(pres.shapes.RECTANGLE, { x: 7.55, y: 1.55, w: 5.1, h: 5.3, fill: { color: NAVY } });
s.addText("本分析の目的", { x: 7.9, y: 1.9, w: 4.5, h: 0.5, fontSize: 17, bold: true, color: WHITE, fontFace: FONTB, margin: 0 });
const objs = [
  "二次医療圏別の重症化リスクを定量的に層別化する指標を設計",
  "糖尿病・CKD・心血管の3領域＋複合スコアを算出",
  "地域ごとのリスクプロファイルの差異を可視化し、保健事業の優先度判断に資する基礎情報を提供",
];
objs.forEach((o, i) => {
  const yy = 2.7 + i * 1.32;
  s.addShape(pres.shapes.OVAL, { x: 7.9, y: yy, w: 0.5, h: 0.5, fill: { color: CV } });
  s.addText(String(i + 1), { x: 7.9, y: yy, w: 0.5, h: 0.5, align: "center", valign: "middle", fontSize: 16, bold: true, color: WHITE, fontFace: FONTB, margin: 0 });
  s.addText(o, { x: 8.55, y: yy - 0.1, w: 3.85, h: 1.2, fontSize: 13, color: "E8EEF8", fontFace: FONT, valign: "top", margin: 0 });
});

// ============================================================
// SLIDE 3 — 方法
// ============================================================
s = pres.addSlide();
s.background = { color: LIGHT };
header(s, 2, "METHODS", "方法 ― データとスコアリング手法");
// data source strip
card(s, MX, 1.55, 11.95, 1.15);
s.addText([
  { text: "データソース   ", options: { bold: true, color: NAVY, fontSize: 14 } },
  { text: "厚生労働省 第10回NDBオープンデータ／2022年度 特定健診（原則40〜74歳）／二次医療圏単位の集計表（全335圏域）／最大指標HbA1cで約2,292万人", options: { color: INK, fontSize: 13 } },
], { x: MX + 0.35, y: 1.55, w: 11.3, h: 1.15, valign: "middle", margin: 0 });

// 3 domains with indicators
const dom = [
  { name: "糖尿病", color: DM, items: ["HbA1c ≧ 6.5%", "空腹時血糖 ≧ 126"] },
  { name: "CKD", color: CKD, items: ["eGFR < 60", "尿蛋白 (＋)以上"] },
  { name: "心血管", color: CV, items: ["収縮期血圧 ≧ 140", "LDL ≧ 140", "中性脂肪 ≧ 150", "心電図 所見あり"] },
];
dom.forEach((d, i) => {
  const cx = MX + i * 4.06;
  card(s, cx, 2.95, 3.75, 1.95);
  s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 2.95, w: 3.75, h: 0.5, fill: { color: d.color } });
  s.addText(d.name, { x: cx, y: 2.95, w: 3.75, h: 0.5, align: "center", valign: "middle", fontSize: 15, bold: true, color: WHITE, fontFace: FONTB, margin: 0 });
  s.addText(d.items.map((it, j) => ({ text: it, options: { bullet: { code: "2022" }, color: INK, fontSize: 12.5, breakLine: true, paraSpaceAfter: 3 } })),
    { x: cx + 0.25, y: 3.6, w: 3.3, h: 1.25, valign: "top", margin: 0 });
});

// scoring flow
s.addText("スコアリング手順", { x: MX, y: 5.15, w: 6, h: 0.4, fontSize: 14, bold: true, color: NAVY, fontFace: FONTB, margin: 0 });
const steps = ["リスク該当率を算出", "偏差値化（平均50・SD10）", "領域内平均＝領域スコア", "3領域平均＝複合スコア → 5ティア層別化"];
steps.forEach((st, i) => {
  const cw = i === 3 ? 3.55 : 2.7;
  let cx = MX;
  for (let k = 0; k < i; k++) cx += (k === 3 ? 3.55 : 2.7) + 0.32;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: 5.6, w: cw, h: 0.85, rectRadius: 0.08, fill: { color: WHITE }, line: { color: NAVY2, width: 1 }, shadow: makeShadow() });
  s.addText([{ text: "STEP " + (i + 1), options: { color: NAVY2, fontSize: 9.5, bold: true, breakLine: true } },
    { text: st, options: { color: INK, fontSize: 12, bold: true } }],
    { x: cx + 0.1, y: 5.6, w: cw - 0.2, h: 0.85, align: "center", valign: "middle", fontFace: FONTB, margin: 0 });
  if (i < 3) s.addText("→", { x: cx + cw + 0.02, y: 5.6, w: 0.3, h: 0.85, align: "center", valign: "middle", fontSize: 12, color: NAVY2, margin: 0 });
});

// ============================================================
// SLIDE 4 — 結果① 指標別該当率
// ============================================================
s = pres.addSlide();
s.background = { color: LIGHT };
header(s, 3, "RESULTS 1", "結果① ― 検査項目別の全国リスク該当率");
card(s, MX, 1.6, 7.2, 5.25);
s.addImage({ path: path.join(OUT, "fig2_indicator_rates.png"), x: MX + 0.2, y: 1.85, w: 6.8, h: 4.7, sizing: { type: "contain", w: 6.8, h: 4.7 } });
// right takeaways
s.addText("ポイント", { x: 8.2, y: 1.75, w: 4.5, h: 0.4, fontSize: 16, bold: true, color: NAVY, fontFace: FONTB, margin: 0 });
const r1 = [
  ["心電図(30.6%)・LDL(27.7%)・収縮期血圧(20.6%)", "が高頻度。尿蛋白(3.4%)が最少。"],
  ["eGFR・収縮期血圧で圏域間SDが大", "→ 地域差が顕著な指標。"],
  ["心電図はSD12.8と極端", "→ 検査実施率の地域差を反映、解釈注意。"],
];
r1.forEach((t, i) => {
  const yy = 2.35 + i * 1.45;
  card(s, 8.2, yy, 4.45, 1.25);
  s.addShape(pres.shapes.RECTANGLE, { x: 8.2, y: yy, w: 0.1, h: 1.25, fill: { color: NAVY2 } });
  s.addText([{ text: t[0], options: { bold: true, color: INK, fontSize: 13, breakLine: true, paraSpaceAfter: 3 } },
    { text: t[1], options: { color: GRAY, fontSize: 12 } }],
    { x: 8.45, y: yy + 0.12, w: 4.1, h: 1.0, valign: "middle", fontFace: FONT, margin: 0 });
});

// ============================================================
// SLIDE 5 — 結果② 高リスク圏域
// ============================================================
s = pres.addSlide();
s.background = { color: LIGHT };
header(s, 4, "RESULTS 2", "結果② ― 重症化リスク上位の二次医療圏");
// stat callouts
const stats = [["50.0", "複合スコア平均"], ["36.5–70.2", "スコア範囲"], ["67", "高リスク圏域(上位20%)"]];
stats.forEach((st, i) => {
  const cx = MX + i * 4.06;
  s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.6, w: 3.75, h: 1.1, fill: { color: NAVY } });
  s.addText(st[0], { x: cx + 0.2, y: 1.68, w: 3.4, h: 0.62, fontSize: 28, bold: true, color: WHITE, fontFace: FONTB, valign: "middle", margin: 0 });
  s.addText(st[1], { x: cx + 0.2, y: 2.28, w: 3.4, h: 0.35, fontSize: 11, color: "CADCFC", fontFace: FONT, margin: 0 });
});
// table
const rows = [
  [{ text: "順位", options: { fill: { color: NAVY }, color: WHITE, bold: true, align: "center" } },
   { text: "二次医療圏", options: { fill: { color: NAVY }, color: WHITE, bold: true } },
   { text: "複合", options: { fill: { color: NAVY }, color: WHITE, bold: true, align: "center" } },
   { text: "糖尿病", options: { fill: { color: DM }, color: WHITE, bold: true, align: "center" } },
   { text: "CKD", options: { fill: { color: CKD }, color: WHITE, bold: true, align: "center" } },
   { text: "心血管", options: { fill: { color: CV }, color: WHITE, bold: true, align: "center" } }],
];
const data = [
  ["1", "新潟県 佐渡", "70.2", "64.0", "87.5", "59.1"],
  ["2", "沖縄県 宮古", "68.9", "66.2", "83.2", "57.4"],
  ["3", "高知県 安芸", "65.6", "70.5", "57.7", "68.5"],
  ["4", "青森県 八戸地域", "63.3", "76.2", "57.6", "56.1"],
  ["5", "鹿児島県 曽於", "62.4", "77.2", "61.8", "48.1"],
  ["6", "沖縄県 八重山", "62.3", "65.2", "69.7", "52.1"],
];
data.forEach((d, ri) => {
  const fill = ri % 2 ? "EAF0F8" : WHITE;
  rows.push([
    { text: d[0], options: { align: "center", bold: true, color: NAVY, fill: { color: fill } } },
    { text: d[1], options: { fill: { color: fill }, color: INK } },
    { text: d[2], options: { align: "center", bold: true, color: RED, fill: { color: fill } } },
    { text: d[3], options: { align: "center", color: INK, fill: { color: fill } } },
    { text: d[4], options: { align: "center", color: INK, fill: { color: fill } } },
    { text: d[5], options: { align: "center", color: INK, fill: { color: fill } } },
  ]);
});
s.addTable(rows, { x: MX, y: 2.95, w: 8.0, colW: [0.9, 2.9, 1.05, 1.05, 1.05, 1.05],
  rowH: 0.52, fontSize: 13, fontFace: FONT, valign: "middle", border: { pt: 0.5, color: "D5DEEA" } });
// side note
s.addShape(pres.shapes.RECTANGLE, { x: 9.1, y: 2.95, w: 3.55, h: 3.6, fill: { color: WHITE }, line: { color: "E2E8F0", width: 0.75 }, shadow: makeShadow() });
s.addShape(pres.shapes.RECTANGLE, { x: 9.1, y: 2.95, w: 3.55, h: 0.5, fill: { color: NAVY2 } });
s.addText("傾向", { x: 9.1, y: 2.95, w: 3.55, h: 0.5, align: "center", valign: "middle", fontSize: 14, bold: true, color: WHITE, fontFace: FONTB, margin: 0 });
s.addText([
  { text: "離島・地方圏に集中", options: { bold: true, color: INK, fontSize: 13.5, breakLine: true, paraSpaceAfter: 8 } },
  { text: "佐渡・宮古・奄美などの離島、青森・鹿児島・高知などの地方が上位。", options: { color: GRAY, fontSize: 12.5, breakLine: true, paraSpaceAfter: 12 } },
  { text: "低リスクは大都市部", options: { bold: true, color: INK, fontSize: 13.5, breakLine: true, paraSpaceAfter: 8 } },
  { text: "東京都内圏域・神奈川北部が下位。受診率・年齢構成の影響を含む。", options: { color: GRAY, fontSize: 12.5 } },
], { x: 9.35, y: 3.65, w: 3.05, h: 2.75, valign: "top", fontFace: FONT, margin: 0 });

// ============================================================
// SLIDE 6 — 結果③ ドメイン独立性
// ============================================================
s = pres.addSlide();
s.background = { color: LIGHT };
header(s, 5, "RESULTS 3", "結果③ ― 3疾患領域は相互に独立");
card(s, MX, 1.6, 7.0, 5.25);
s.addImage({ path: path.join(OUT, "fig3_domain_scatter.png"), x: MX + 0.15, y: 2.4, w: 6.7, h: 3.0, sizing: { type: "contain", w: 6.7, h: 3.0 } });
s.addText("各点＝二次医療圏（n=335）", { x: MX + 0.15, y: 5.5, w: 6.7, h: 0.35, align: "center", fontSize: 11, italic: true, color: GRAY, fontFace: FONT, margin: 0 });
// correlation callouts + message
s.addText("ドメイン間相関", { x: 7.9, y: 1.75, w: 4.7, h: 0.4, fontSize: 16, bold: true, color: NAVY, fontFace: FONTB, margin: 0 });
const corr = [["糖尿病 × 心血管", "r = 0.39", "中程度"], ["糖尿病 × CKD", "r = 0.10", "弱い"], ["CKD × 心血管", "r = 0.10", "弱い"]];
corr.forEach((c, i) => {
  const yy = 2.3 + i * 0.78;
  s.addShape(pres.shapes.RECTANGLE, { x: 7.9, y: yy, w: 4.75, h: 0.66, fill: { color: WHITE }, line: { color: "E2E8F0", width: 0.75 } });
  s.addText(c[0], { x: 8.05, y: yy, w: 2.6, h: 0.66, valign: "middle", fontSize: 13, color: INK, fontFace: FONT, margin: 0 });
  s.addText(c[1], { x: 10.5, y: yy, w: 1.3, h: 0.66, valign: "middle", align: "right", fontSize: 15, bold: true, color: NAVY2, fontFace: FONTB, margin: 0 });
  s.addText(c[2], { x: 11.8, y: yy, w: 0.8, h: 0.66, valign: "middle", align: "center", fontSize: 10, color: GRAY, fontFace: FONT, margin: 0 });
});
// key message box
s.addShape(pres.shapes.RECTANGLE, { x: 7.9, y: 4.95, w: 4.75, h: 1.9, fill: { color: NAVY } });
s.addShape(pres.shapes.RECTANGLE, { x: 7.9, y: 4.95, w: 0.12, h: 1.9, fill: { color: CV } });
s.addText([
  { text: "★ 最重要の発見", options: { bold: true, color: CV, fontSize: 13, breakLine: true, paraSpaceAfter: 6 } },
  { text: "複合スコアが同程度でも、地域ごとにリスク構造（糖尿病優位／CKD優位／心血管優位）は異なる。", options: { color: WHITE, fontSize: 13, breakLine: true } },
], { x: 8.2, y: 5.15, w: 4.3, h: 1.55, valign: "middle", fontFace: FONT, margin: 0 });

// ============================================================
// SLIDE 7 — 結果④ 年齢調整
// ============================================================
s = pres.addSlide();
s.background = { color: LIGHT };
header(s, 6, "RESULTS 4", "結果④ ― 年齢・性別調整で地域差の見え方が変わる");
// choropleth compare map
card(s, MX, 1.55, 7.45, 3.95);
s.addImage({ path: path.join(OUT, "fig4_choropleth_compare.png"), x: MX + 0.15, y: 1.7, w: 7.15, h: 3.65, sizing: { type: "contain", w: 7.15, h: 3.65 } });
s.addText("左：粗スコア ／ 右：年齢・性別調整スコア（色が濃いほど高リスク）", { x: MX, y: 5.5, w: 7.45, h: 0.3, align: "center", fontSize: 10.5, italic: true, color: GRAY, fontFace: FONT, margin: 0 });
// right: Spearman stat
s.addShape(pres.shapes.RECTANGLE, { x: 8.35, y: 1.55, w: 4.3, h: 1.15, fill: { color: NAVY } });
s.addText("ρ = 0.62", { x: 8.55, y: 1.62, w: 4.0, h: 0.62, fontSize: 26, bold: true, color: WHITE, fontFace: FONTB, valign: "middle", margin: 0 });
s.addText("粗 vs 調整スコアの順位相関（Spearman）→ 順位は大きく変動", { x: 8.55, y: 2.22, w: 4.0, h: 0.42, fontSize: 10.5, color: "CADCFC", fontFace: FONT, margin: 0 });
// right: key message
s.addShape(pres.shapes.RECTANGLE, { x: 8.35, y: 2.85, w: 4.3, h: 2.65, fill: { color: WHITE }, line: { color: "E2E8F0", width: 0.75 }, shadow: makeShadow() });
s.addShape(pres.shapes.RECTANGLE, { x: 8.35, y: 2.85, w: 0.12, h: 2.65, fill: { color: CV } });
s.addText([
  { text: "年齢構成の交絡を補正", options: { bold: true, color: NAVY, fontSize: 14, breakLine: true, paraSpaceAfter: 7 } },
  { text: "粗スコアの「西高東低」の相当部分は、地方圏の高齢者割合の高さを反映していた。", options: { color: INK, fontSize: 12.5, breakLine: true, paraSpaceAfter: 9 } },
  { text: "調整後も上位を維持する圏域こそ、年齢では説明できない真の高リスク地域。", options: { color: INK, fontSize: 12.5 } },
], { x: 8.65, y: 3.05, w: 3.85, h: 2.3, valign: "top", fontFace: FONT, margin: 0 });
// bottom: 3 mover cards
const movers = [
  { t: "高齢構成で過大評価", c: "185FA5", sub: "調整で下落", items: ["熱海伊東 20→298位", "萩 51→316位", "沼田 18→257位"] },
  { t: "若年構成で過小評価", c: "1D9E75", sub: "調整で上昇", items: ["つくば 280→125位", "大阪市 271→117位", "仙台 236→87位"] },
  { t: "真の高リスク", c: "A32D2D", sub: "調整後も上位", items: ["八戸地域 1位", "茨城・日立 2位", "新潟・佐渡 3位"] },
];
movers.forEach((m, i) => {
  const cx = MX + i * 4.06;
  card(s, cx, 5.95, 3.75, 1.3);
  s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 5.95, w: 3.75, h: 0.45, fill: { color: m.c } });
  s.addText([{ text: m.t, options: { bold: true, color: WHITE, fontSize: 12.5 } },
    { text: "  " + m.sub, options: { color: "F0F0F0", fontSize: 10 } }],
    { x: cx + 0.15, y: 5.95, w: 3.6, h: 0.45, valign: "middle", fontFace: FONTB, margin: 0 });
  s.addText(m.items.map((it) => ({ text: it, options: { color: INK, fontSize: 11, breakLine: true, paraSpaceAfter: 1 } })),
    { x: cx + 0.2, y: 6.45, w: 3.45, h: 0.78, valign: "top", fontFace: FONT, margin: 0 });
});

// ============================================================
// SLIDE 8 — 考察
// ============================================================
s = pres.addSlide();
s.background = { color: LIGHT };
header(s, 7, "DISCUSSION", "考察 ― 示唆と限界");
// left: implications
s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 1.6, w: 5.9, h: 0.55, fill: { color: NAVY2 } });
s.addText("実務への示唆", { x: MX + 0.2, y: 1.6, w: 5.5, h: 0.55, valign: "middle", fontSize: 15, bold: true, color: WHITE, fontFace: FONTB, margin: 0 });
const imp = [
  ["ターゲティング", "領域が突出する圏域に特化型プログラムを優先導入（CKD優位の佐渡・宮古、糖尿病優位の曽於・八戸）"],
  ["提案の定量化", "「貴地域はeGFR低下が全国上位」など偏差値ベースの客観的根拠を提示"],
  ["資源配分", "圏域間SDが大きいeGFR・血圧は地域選定による事業効率の改善余地が大きい"],
];
imp.forEach((t, i) => {
  const yy = 2.35 + i * 1.5;
  card(s, MX, yy, 5.9, 1.32);
  s.addText(t[0], { x: MX + 0.25, y: yy + 0.12, w: 5.4, h: 0.4, fontSize: 14, bold: true, color: NAVY, fontFace: FONTB, margin: 0 });
  s.addText(t[1], { x: MX + 0.25, y: yy + 0.52, w: 5.45, h: 0.72, fontSize: 12.5, color: INK, fontFace: FONT, valign: "top", margin: 0 });
});
// right: limitations
s.addShape(pres.shapes.RECTANGLE, { x: 6.95, y: 1.6, w: 5.7, h: 0.55, fill: { color: "8A4B2B" } });
s.addText("限界（解釈上の留意点）", { x: 7.15, y: 1.6, w: 5.3, h: 0.55, valign: "middle", fontSize: 15, bold: true, color: WHITE, fontFace: FONTB, margin: 0 });
card(s, 6.95, 2.35, 5.7, 4.5);
const lim = [
  ["受診者バイアス", "対象は健診受診者のみ。受診率の地域差が大都市の低スコアに影響しうる"],
  ["検査実施率の偏り", "心電図(36万)・eGFR(254万)は対象者が少なく、心電図SDは極端"],
  ["秘匿セルの扱い", "10未満セルを0処理。小規模圏域(離島)でスコアが不安定"],
  ["年齢調整の残存課題", "直接法で年齢・性別を調整済。基準集団選択と階級内構成差は残る"],
  ["断面データ", "2022年度単年。因果・経時変化は評価不可"],
  ["スコア設計の任意性", "単純平均で重みづけなし。閾値設定で結果は変動"],
];
lim.forEach((t, i) => {
  const yy = 2.55 + i * 0.71;
  s.addText("●", { x: 7.15, y: yy, w: 0.4, h: 0.62, fontSize: 13, color: CV, valign: "middle", margin: 0 });
  s.addText([{ text: t[0] + "  ", options: { bold: true, color: INK, fontSize: 12.5 } },
    { text: t[1], options: { color: GRAY, fontSize: 11.5 } }],
    { x: 7.55, y: yy, w: 4.95, h: 0.62, valign: "middle", fontFace: FONT, margin: 0 });
});

// ============================================================
// SLIDE 9 — 結論
// ============================================================
s = pres.addSlide();
s.background = { color: NAVY };
s.addShape(pres.shapes.OVAL, { x: -1.5, y: 4.5, w: 5, h: 5, fill: { color: NAVY2, transparency: 60 } });
s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 0.9, w: 0.62, h: 0.62, fill: { color: CV } });
s.addText("8", { x: MX, y: 0.9, w: 0.62, h: 0.62, align: "center", valign: "middle", fontSize: 24, bold: true, color: WHITE, fontFace: FONTB, margin: 0 });
s.addText("CONCLUSION", { x: MX + 0.8, y: 0.88, w: 8, h: 0.32, fontSize: 12, bold: true, color: "9DB2D6", fontFace: FONTB, charSpacing: 2, margin: 0 });
s.addText("結論", { x: MX + 0.8, y: 1.16, w: 8, h: 0.55, fontSize: 26, bold: true, color: WHITE, fontFace: FONTB, margin: 0 });

s.addText("全国335二次医療圏の重症化リスクを3領域で複合スコア化する地域診断の枠組みを構築した。", { x: MX, y: 2.2, w: 11.8, h: 0.7, fontSize: 17, color: "E8EEF8", fontFace: FONT, margin: 0 });

const conc = [
  ["地域差の多くは年齢構成", "粗の地域差の相当部分は高齢化の交絡。"],
  ["真の高リスクを特定", "調整後も上位の八戸・日立が優先対象。"],
  ["領域は相互に独立", "地域ごとに固有のリスク構造を持つ。"],
  ["EBPMの基盤", "年齢調整済の地域診断で実務提案へ。"],
];
conc.forEach((t, i) => {
  const cx = MX + (i % 2) * 6.0;
  const cy = 3.2 + Math.floor(i / 2) * 1.7;
  s.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 5.7, h: 1.45, fill: { color: "29406A" } });
  s.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 0.12, h: 1.45, fill: { color: CV } });
  s.addText(t[0], { x: cx + 0.35, y: cy + 0.2, w: 5.2, h: 0.5, fontSize: 17, bold: true, color: WHITE, fontFace: FONTB, margin: 0 });
  s.addText(t[1], { x: cx + 0.35, y: cy + 0.72, w: 5.2, h: 0.6, fontSize: 13, color: "CADCFC", fontFace: FONT, valign: "top", margin: 0 });
});
s.addText("データ出典：厚生労働省 第10回NDBオープンデータ（2022年度 特定健診）", { x: MX, y: 6.95, w: 11.8, h: 0.35, fontSize: 10.5, color: "7E93B8", fontFace: FONT, margin: 0 });

// ===== write =====
pres.writeFile({ fileName: path.join(OUT, "NDB重症化予防ニーズマップ_スライド.pptx") })
  .then(f => console.log("Saved:", f));
