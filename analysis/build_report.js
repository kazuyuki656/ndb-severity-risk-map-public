const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, PageNumber, Header, Footer, TableOfContents,
  PageBreak, VerticalAlign
} = require('docx');

const OUT = path.join(__dirname, 'output');
const CW = 9360; // content width (US Letter, 1" margins)

// ---- helpers ----
const border = { style: BorderStyle.SINGLE, size: 1, color: "BFBFBF" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 60, bottom: 60, left: 120, right: 120 };

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 300 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, size: 21, font: "Yu Gothic" })],
  });
}

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 280, after: 160 },
    children: [new TextRun({ text, bold: true, size: 28, font: "Yu Gothic", color: "1F3864" })] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 220, after: 120 },
    children: [new TextRun({ text, bold: true, size: 24, font: "Yu Gothic", color: "2E5496" })] });
}

function bullet(text) {
  return new Paragraph({ numbering: { reference: "bullets", level: 0 },
    spacing: { after: 80, line: 290 },
    children: [new TextRun({ text, size: 21, font: "Yu Gothic" })] });
}

function caption(text) {
  return new Paragraph({ spacing: { before: 60, after: 200 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, size: 18, italics: true, font: "Yu Gothic", color: "595959" })] });
}

function img(file, w, h) {
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120 },
    children: [new ImageRun({ type: "png", data: fs.readFileSync(path.join(OUT, file)),
      transformation: { width: w, height: h },
      altText: { title: file, description: file, name: file } })] });
}

function hcell(text, width) {
  return new TableCell({ borders, width: { size: width, type: WidthType.DXA }, margins: cellMargins,
    shading: { fill: "1F3864", type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, size: 19, color: "FFFFFF", font: "Yu Gothic" })] })] });
}
function dcell(text, width, opts = {}) {
  return new TableCell({ borders, width: { size: width, type: WidthType.DXA }, margins: cellMargins,
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: opts.align || AlignmentType.LEFT,
      children: [new TextRun({ text, size: 19, font: "Yu Gothic", bold: !!opts.bold,
        color: opts.color || "000000" })] })] });
}

function makeTable(widths, headerRow, dataRows) {
  const rows = [new TableRow({ tableHeader: true, children: headerRow.map((t,i)=>hcell(t, widths[i])) })];
  dataRows.forEach((r, ri) => {
    rows.push(new TableRow({ children: r.map((c, i) => {
      const fill = ri % 2 === 1 ? "F2F5FA" : undefined;
      if (typeof c === 'object') return dcell(c.t, widths[i], {...c, fill: c.fill || fill});
      return dcell(c, widths[i], { fill, align: i===0?AlignmentType.LEFT:AlignmentType.CENTER });
    }) }));
  });
  return new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: widths, rows });
}

// ============ DOCUMENT ============
const children = [];

// --- Title page ---
children.push(new Paragraph({ spacing: { before: 1800, after: 120 }, alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "NDB第10回オープンデータを用いた", bold: true, size: 30, font: "Yu Gothic", color: "1F3864" })] }));
children.push(new Paragraph({ spacing: { after: 120 }, alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "二次医療圏別 重症化予防ニーズマップの構築", bold: true, size: 36, font: "Yu Gothic", color: "1F3864" })] }));
children.push(new Paragraph({ spacing: { before: 200, after: 1200 }, alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "― 特定健診データに基づく地域別リスク層別化の試み ―", size: 22, font: "Yu Gothic", color: "595959" })] }));
children.push(new Paragraph({ spacing: { after: 80 }, alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "データサイエンス分析レポート", size: 22, font: "Yu Gothic" })] }));
children.push(new Paragraph({ spacing: { after: 80 }, alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "2026年6月", size: 20, font: "Yu Gothic", color: "595959" })] }));
children.push(new Paragraph({ children: [new PageBreak()] }));

// --- TOC ---
children.push(new Paragraph({ spacing: { after: 160 },
  children: [new TextRun({ text: "目次", bold: true, size: 28, font: "Yu Gothic", color: "1F3864" })] }));
children.push(new TableOfContents("目次", { hyperlink: true, headingStyleRange: "1-2" }));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ========== 1. 背景 ==========
children.push(h1("1. 背景"));
children.push(body("生活習慣病の重症化予防は、わが国の医療費適正化と健康寿命延伸における中核的な政策課題である。特に糖尿病性腎症の重症化による人工透析導入、高血圧・脂質異常症を背景とした心血管イベントは、患者のQOLを著しく損なうとともに医療費を大きく押し上げる。これらの多くは特定健診で捕捉される検査値異常の段階で介入可能であり、ハイリスク者を早期に同定し保健指導につなげる疾病管理プログラム（DMP）の意義は大きい。"));
children.push(body("一方で、生活習慣病リスクの分布には大きな地域差が存在することが知られている。食習慣・運動習慣・受診行動・人口構成・医療資源は地域によって異なり、画一的な介入では効率が上がりにくい。限られた保健事業リソースを最大限に活用するには、「どの地域で・どの疾患領域のリスクが高いか」をエビデンスに基づいて可視化し、介入の優先順位づけを行うことが求められる。"));
children.push(body("厚生労働省が公表するNDB（レセプト情報・特定健診等情報データベース）オープンデータは、悉皆性の高い全国規模の特定健診集計値を二次医療圏単位で提供しており、こうした地域診断の基盤として有用である。本分析では、第10回NDBオープンデータ（2022年度特定健診）を用いて、全国335二次医療圏の重症化リスクを糖尿病・慢性腎臓病（CKD）・心血管の3疾患領域で複合的にスコア化し、地域別の重症化予防ニーズを可視化する「ニーズマップ」の構築を試みた。"));
children.push(new Paragraph({ spacing: { before: 80, after: 120 },
  children: [new TextRun({ text: "本分析の目的", bold: true, size: 21, font: "Yu Gothic" })] }));
children.push(bullet("特定健診検査値から、二次医療圏別の重症化リスクを定量的に層別化する指標を設計する"));
children.push(bullet("糖尿病・CKD・心血管の3領域それぞれと、それらを統合した複合スコアを算出する"));
children.push(bullet("地域ごとのリスクプロファイルの差異を明らかにし、保健事業の優先度判断に資する基礎情報を提供する"));

// ========== 2. 方法 ==========
children.push(h1("2. 方法"));

children.push(h2("2.1 データソース"));
children.push(body("厚生労働省「第10回NDBオープンデータ」のうち、特定健診検査項目（2022年度実施分）の集計表を使用した。対象は特定健診の受診者（原則40〜74歳）であり、検査項目別に「都道府県×二次医療圏×性×5歳階級×検査値階層」のクロス集計人数が公表されている。本分析では二次医療圏単位（全335圏域）の集計表を用いた。最大の対象指標であるHbA1cで約2,292万人の受診者が集計対象に含まれる。"));

children.push(h2("2.2 対象指標とリスク定義"));
children.push(body("3つの疾患領域に対し、計8つの検査項目を選定した。各項目について、臨床的に保健指導・受診勧奨の対象となりうる検査値階層を「リスク該当」と定義し、二次医療圏ごとに受診者全体に占めるリスク該当者の割合（リスク該当率）を算出した。"));
children.push(makeTable([1500, 3000, 4860],
  ["疾患領域", "検査項目", "リスク該当と定義した階層"],
  [
    [{t:"糖尿病",bold:true}, "HbA1c", "6.5%以上（NGSP値）"],
    [{t:"",}, "空腹時血糖", "126 mg/dL以上"],
    [{t:"CKD",bold:true}, "eGFR", "60 mL/min/1.73㎡未満"],
    [{t:""}, "尿蛋白", "（＋）以上"],
    [{t:"心血管",bold:true}, "収縮期血圧", "140 mmHg以上"],
    [{t:""}, "LDLコレステロール", "140 mg/dL以上"],
    [{t:""}, "中性脂肪", "150 mg/dL以上"],
    [{t:""}, "心電図", "所見あり"],
  ]));
children.push(caption("表1. 疾患領域別の対象指標とリスク定義"));

children.push(h2("2.3 スコアリング手法"));
children.push(body("地域間比較を可能にするため、以下の手順で標準化スコアを算出した。"));
children.push(bullet("① 各指標のリスク該当率を、全335圏域における分布をもとに標準化（Zスコア化）し、偏差値（平均50・標準偏差10）に変換した。値が高いほどリスクが高いことを示す。"));
children.push(bullet("② 疾患領域ごとに、当該領域に属する指標の偏差値を平均し「領域スコア」（糖尿病・CKD・心血管）とした。"));
children.push(bullet("③ 3つの領域スコアの平均を「複合スコア」とし、二次医療圏の総合的な重症化リスクの指標とした。"));
children.push(bullet("④ 複合スコアにより335圏域を5段階（高リスク〜低リスク、各20%）のリスクティアに分類した。"));
children.push(body("さらに、地域間の年齢構成の違いによる交絡を除去するため、年齢（7階級）×性別（2区分）の14層について直接法による標準化を行った。基準集団には全国の特定健診受診者の年齢・性別構成を用い、各圏域の層別リスク率を基準集団の重みで加重平均して「年齢・性別調整リスク率」を算出し、同じ手順で調整版の複合スコアを得た。本レポートでは粗スコアと調整スコアの両方を提示する。", {align: AlignmentType.LEFT}));
children.push(body("なお、集計値が10未満のセルはNDBの秘匿処理により非公開（「‐」表示）であり、本分析では0として扱った。", {align: AlignmentType.LEFT}));

children.push(h2("2.4 使用環境"));
children.push(body("データ処理・集計はPython（pandas, openpyxl）で実装し、ETL・スコアリング・可視化用データ加工をパイプライン化した。出力はTableau / Superset接続用のCSVおよびコロプレスマップ用JSONとして整備し、コードはGitHubでバージョン管理した。"));

// ========== 3. 結果 ==========
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(h1("3. 結果"));

children.push(h2("3.1 検査項目別の全国リスク該当率"));
children.push(body("8指標の全国リスク該当率（圏域平均）を表2に示す。心電図所見あり（30.6%）、LDL高値（27.7%）、収縮期血圧高値（20.6%）の順に高く、尿蛋白陽性（3.4%）が最も低かった。圏域間のばらつき（標準偏差）はeGFR低下（SD 2.9）と収縮期血圧高値（SD 3.4）で比較的大きく、これらの指標で地域差が顕著であることが示された。"));
children.push(makeTable([3200, 1550, 1550, 3060],
  ["検査項目", "該当率(平均)", "圏域間SD", "対象者数"],
  [
    ["心電図 所見あり", "30.6%", "12.8", "364,256"],
    ["LDL 140以上", "27.7%", "1.8", "29,013,858"],
    ["収縮期血圧 140以上", "20.6%", "3.4", "29,117,980"],
    ["中性脂肪 150以上", "17.0%", "1.6", "29,063,398"],
    ["eGFR 60未満", "11.2%", "2.9", "2,538,415"],
    ["HbA1c 6.5以上", "8.0%", "1.2", "22,918,781"],
    ["空腹時血糖 126以上", "6.4%", "1.0", "24,160,772"],
    ["尿蛋白 (＋)以上", "3.4%", "0.8", "28,960,047"],
  ]));
children.push(caption("表2. 検査項目別の全国リスク該当率（335二次医療圏の平均）"));
children.push(img("fig2_indicator_rates.png", 540, 300));
children.push(caption("図1. 検査項目別 全国リスク該当率（エラーバーは圏域間の標準偏差）"));

children.push(h2("3.2 複合スコアによる地域層別化"));
children.push(body("複合スコアは平均50.0・標準偏差4.8、範囲は36.5〜70.2であった。スコア上位（高リスク）の二次医療圏を表3に示す。新潟県・佐渡（70.2）、沖縄県・宮古（68.9）、高知県・安芸（65.6）が上位を占め、離島・地方圏が目立った。"));
children.push(makeTable([900, 2400, 1515, 1515, 1515, 1515],
  ["順位", "二次医療圏", "複合", "糖尿病", "CKD", "心血管"],
  [
    ["1", "新潟県 佐渡", {t:"70.2",bold:true,color:"A32D2D"}, "64.0", {t:"87.5",color:"A32D2D"}, "59.1"],
    ["2", "沖縄県 宮古", {t:"68.9",bold:true,color:"A32D2D"}, "66.2", {t:"83.2",color:"A32D2D"}, "57.4"],
    ["3", "高知県 安芸", {t:"65.6",bold:true,color:"A32D2D"}, "70.5", "57.7", "68.5"],
    ["4", "青森県 八戸地域", {t:"63.3",bold:true,color:"A32D2D"}, {t:"76.2",color:"A32D2D"}, "57.6", "56.1"],
    ["5", "鹿児島県 曽於", {t:"62.4",bold:true,color:"A32D2D"}, {t:"77.2",color:"A32D2D"}, "61.8", "48.1"],
    ["6", "沖縄県 八重山", {t:"62.3",bold:true}, "65.2", "69.7", "52.1"],
    ["7", "鹿児島県 奄美", {t:"62.1",bold:true}, "59.6", "72.7", "54.0"],
    ["8", "北海道 留萌", {t:"62.1",bold:true}, "74.4", "57.8", "54.1"],
    ["9", "茨城県 日立", {t:"61.6",bold:true}, "67.6", "53.3", "64.0"],
    ["10", "石川県 能登北部", {t:"60.9",bold:true}, "65.3", "56.6", "60.7"],
  ]));
children.push(caption("表3. 重症化リスク複合スコア上位10二次医療圏"));

children.push(h2("3.3 都道府県・地方ブロック別の傾向"));
children.push(body("都道府県別に集約すると、沖縄県（59.1）、高知県（57.1）、鹿児島県（56.6）が高く、東京都（42.2）、鳥取県（42.7）、滋賀県（43.7）が低かった。地方ブロック別では北海道・四国・九州で高く、関東・近畿で低い「西高東低かつ大都市低リスク」の傾向がみられた。"));
children.push(makeTable([3120, 3120, 3120],
  ["地方ブロック", "平均複合スコア", "含まれる県数"],
  [
    ["北海道", "53.1", "1"],
    ["四国", "53.1", "4"],
    ["九州", "52.1", "8"],
    ["東北", "51.3", "6"],
    ["中部", "49.8", "9"],
    ["中国", "49.1", "5"],
    ["関東", "48.0", "7"],
    ["近畿", "48.0", "7"],
  ]));
children.push(caption("表4. 地方ブロック別 平均複合スコア"));
children.push(img("fig1_domain_bars.png", 560, 373));
children.push(caption("図2. 都道府県別 3ドメインスコア（複合スコア上位15県）"));

children.push(h2("3.4 疾患領域は相互に独立"));
children.push(body("3つの領域スコア間の相関係数は、糖尿病×心血管でr=0.39（中程度）、糖尿病×CKDおよびCKD×心血管でいずれもr=0.10（弱い）であった。すなわち、複合スコアが同程度の地域でも、その内訳となるリスク構造は地域ごとに大きく異なる。たとえば徳島県・西部はCKDが突出（62.0）する一方で糖尿病は平均的（49.6）であり、青森県・八戸地域は糖尿病が突出（76.2）する。この独立性は、複合スコア単独ではなく領域別スコアを併せて見る必要があることを示している。"));
children.push(img("fig3_domain_scatter.png", 600, 262));
children.push(caption("図3. 領域スコア間の散布図（各点=二次医療圏）。点が広く散らばり、領域間の相関が弱いことを示す"));

children.push(h2("3.5 性差"));
children.push(body("主要指標のリスク該当率は一貫して男性で高かった（HbA1c高値：男性9.6% vs 女性4.6%、収縮期血圧高値：男性20.2% vs 女性15.9%、eGFR低下：男性13.0% vs 女性9.9%）。LDL高値のみ男女差がほぼなかった（男性28.4% vs 女性28.2%）。男性で一貫して高いことは、性別の交絡を調整する必要性を示している。"));

children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(h2("3.6 年齢・性別調整スコアと地理的分布"));
children.push(body("年齢・性別調整後の複合スコアと粗スコアの順位相関はSpearman ρ=0.62であり、調整によって順位が大きく変動した。図4の左（粗スコア）と右（年齢・性別調整スコア）の地図を比較すると、四国・九州南部・北海道などの高齢化が進んだ地方圏で色が薄まる一方、関東・近畿の大都市部では相対的に色が濃くなる。すなわち、粗スコアでみられた「西高東低」の地域差の一部は、地域の年齢構成の違い（高齢者割合の差）による交絡を反映していたことが分かる。"));
children.push(img("fig4_choropleth_compare.png", 600, 300));
children.push(caption("図4. 都道府県別 複合スコアの地図（左：粗スコア／右：年齢・性別調整スコア）。色が濃いほど高リスク"));
children.push(body("圏域単位での変動を図5に示す。対角線から上方に外れる圏域は調整により順位が上昇（粗スコアが年齢構成により過小評価されていた）、下方に外れる圏域は順位が下落（過大評価されていた）したことを意味する。"));
children.push(img("fig6_crude_vs_adjusted.png", 360, 336));
children.push(caption("図5. 粗スコアと年齢・性別調整スコアの散布図（各点=二次医療圏 n=335）"));
children.push(body("順位変動の大きい代表的な圏域を表5に示す。熱海伊東・萩・南檜山・沼田といった高齢化の進む地方圏は、粗スコアでは上位だが調整により大きく順位を下げた。逆につくば・大阪市・仙台などの大都市圏は、若年層の多い人口構成によって粗スコアでは低く見えていたが、調整後に順位が上昇した。一方で青森県・八戸地域や茨城県・日立は調整後も上位を維持しており、年齢構成では説明できない真に高いリスクを抱える地域と考えられる。"));
children.push(makeTable([2550, 1450, 1450, 4060],
  ["二次医療圏", "粗順位", "調整順位", "解釈"],
  [
    [{t:"青森県 八戸地域",bold:true}, "4", {t:"1",bold:true,color:"A32D2D"}, "調整後も最上位＝真のリスク高"],
    [{t:"茨城県 日立",bold:true}, "9", {t:"2",bold:true,color:"A32D2D"}, "調整後も上位＝真のリスク高"],
    ["新潟県 佐渡", "1", "3", "高齢構成を補正しても高位"],
    [{t:"静岡県 熱海伊東",color:"185FA5"}, "20", {t:"298",color:"185FA5"}, "高齢構成による過大評価"],
    [{t:"山口県 萩",color:"185FA5"}, "51", {t:"316",color:"185FA5"}, "高齢構成による過大評価"],
    [{t:"群馬県 沼田",color:"185FA5"}, "18", {t:"257",color:"185FA5"}, "高齢構成による過大評価"],
    [{t:"茨城県 つくば",color:"1D9E75"}, "280", {t:"125",color:"1D9E75"}, "若年構成による過小評価が顕在化"],
    [{t:"大阪府 大阪市",color:"1D9E75"}, "271", {t:"117",color:"1D9E75"}, "若年構成による過小評価が顕在化"],
    [{t:"宮城県 仙台",color:"1D9E75"}, "236", {t:"87",color:"1D9E75"}, "若年構成による過小評価が顕在化"],
  ]));
children.push(caption("表5. 年齢・性別調整による順位変動が大きい二次医療圏"));

// ========== 4. 考察 ==========
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(h1("4. 考察"));

children.push(h2("4.1 主要な知見"));
children.push(body("本分析により、全国335二次医療圏の重症化リスクを3疾患領域で定量化し、地域間で大きな差があることを示した。複合スコア上位には離島・地方圏が集中し、大都市部（特に東京都内圏域）が低リスク側に集まった。ただし年齢・性別調整を行うと順位は大きく変動し（ρ=0.62）、この地域差の相当部分が地域の年齢構成の違いを反映していたことが明らかになった。一方で八戸地域・日立のように調整後も上位を維持する圏域は、年齢構成では説明できない真に高いリスクを抱えており、優先的な介入対象として特定できる。"));
children.push(body("最も重要な知見は、3つの疾患領域が相互にほぼ独立していた点である（相関r=0.10〜0.39）。これは、地域の重症化予防ニーズが「総合的に高い/低い」という一次元では捉えられず、地域ごとに異なるリスク構造（糖尿病優位型・CKD優位型・心血管優位型）を持つことを意味する。画一的なプログラムではなく、地域のリスクプロファイルに応じた介入メニューの出し分けが効率的であることを、データが支持している。"));

children.push(h2("4.2 実務への示唆"));
children.push(bullet("ターゲティング：複合スコア上位かつ特定領域が突出する圏域（例：CKD優位の佐渡・宮古、糖尿病優位の曽於・八戸）は、領域特化型プログラムの優先導入候補となる。"));
children.push(bullet("提案の定量化：自治体・健保組合への保健事業提案において、「貴地域はeGFR低下が全国上位」といった偏差値ベースの客観的根拠を提示できる。"));
children.push(bullet("資源配分：圏域間SDの大きいeGFR・収縮期血圧は地域差が大きく、地域選定による事業効率の改善余地が大きい領域といえる。"));

children.push(h2("4.3 限界"));
children.push(body("本分析の解釈には以下の限界に留意する必要がある。"));
children.push(bullet("① 受診者バイアス：対象は特定健診受診者に限られ、未受診者は含まれない。健診受診率は地域差が大きく、受診率の低い地域では健康意識の高い層に偏る（リスクが過小評価される）可能性がある。大都市の低スコアはこのバイアスを部分的に含みうる。"));
children.push(bullet("② 検査実施率の偏り：心電図やeGFR（血清クレアチニン）は全受診者に実施されるわけではなく、対象者数が他指標より大幅に少ない（心電図36万人、eGFR254万人 vs 他指標2,300〜2,900万人）。心電図の圏域間SDが極端に大きい（12.8、最大88.5%）のは、実施基準・対象選定の地域差を反映したものであり、真のリスク差とは限らない。心電図スコアは慎重に解釈すべきである。"));
children.push(bullet("③ 秘匿セルの扱い：集計10未満のセルを0としたため、人口の小さい圏域（離島等）ではリスク該当者数が過小に集計され、リスク該当率が不安定になりうる。佐渡・宮古等の小規模圏域の高スコアには、分母・分子の小ささに起因する変動が含まれる可能性がある。"));
children.push(bullet("④ 年齢・性別調整の残存課題：本分析では直接法により年齢・性別を調整した（3.6）が、基準集団に全国の受診者構成を用いているため、他の集計（外部基準人口）との直接比較には注意を要する。また年齢を7階級の離散区分で扱っており、階級内の構成差は調整できていない。"));
children.push(bullet("⑤ 断面データ：2022年度単年の横断データであり、因果関係や経時変化は評価できない。"));
children.push(bullet("⑥ スコア設計の任意性：領域スコアを構成指標の単純平均としており、指標間の重みづけや臨床的重要度は反映していない。閾値設定やリスク定義により結果は変動しうる。"));

// ========== 5. 結論 ==========
children.push(h1("5. 結論"));
children.push(body("第10回NDBオープンデータ（2022年度特定健診）を用い、全国335二次医療圏の重症化リスクを糖尿病・CKD・心血管の3領域で複合スコア化する地域診断の枠組みを構築した。重症化リスクには明瞭な地域差があり、粗スコアでは離島・地方圏で高く大都市部で低い傾向が認められたが、年齢・性別調整によりその相当部分が地域の年齢構成の違いに起因することを示した。調整後も上位を維持する圏域（八戸地域・日立など）は、真に介入優先度の高い地域として特定できる。"));
children.push(body("もう一つの重要な知見は、3つの疾患領域が相互に独立しており、地域ごとに固有のリスク構造を持つという点である。これは、重症化予防の保健事業を地域のリスクプロファイルに応じて設計・出し分けることの有効性を示唆する。年齢・性別調整を組み込んだ本枠組みは、受診率の併用といったさらなる精緻化を加えることで、自治体・健保組合向けの保健事業の優先順位づけや、データに基づく提案（EBPM）の実務的な基盤となりうる。"));

children.push(new Paragraph({ spacing: { before: 320, after: 80 },
  border: { top: { style: BorderStyle.SINGLE, size: 4, color: "1F3864", space: 8 } },
  children: [new TextRun({ text: "データ出典", bold: true, size: 19, font: "Yu Gothic" })] }));
children.push(new Paragraph({ spacing: { after: 60 },
  children: [new TextRun({ text: "厚生労働省「第10回NDBオープンデータ」（2022年度 特定健診検査項目集計）", size: 18, font: "Yu Gothic", color: "595959" })] }));
children.push(new Paragraph({ children: [new TextRun({ text: "分析コード・出力データ：GitHubリポジトリ ndb-severity-risk-map（非公開）にて管理", size: 18, font: "Yu Gothic", color: "595959" })] }));

// ============ BUILD ============
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Yu Gothic", size: 21 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Yu Gothic", color: "1F3864" },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Yu Gothic", color: "2E5496" },
        paragraph: { spacing: { before: 220, after: 120 }, outlineLevel: 1 } },
    ]
  },
  numbering: { config: [
    { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
      alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 600, hanging: 280 } } } }] },
  ]},
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 },
      margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "", size: 18, font: "Yu Gothic" }),
        new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Yu Gothic", color: "595959" })] })] }) },
    children,
  }]
});

Packer.toBuffer(doc).then(buf => {
  const out = path.join(OUT, "NDB重症化予防ニーズマップ_分析レポート.docx");
  fs.writeFileSync(out, buf);
  console.log("Saved:", out);
});
