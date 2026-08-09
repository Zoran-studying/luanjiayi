/* ============================================================
   题库生成器 parse-qa.js
   ─────────────────────────────────────────────────────────
   把 md文件/ 目录下全部 md 的问答解析进 js/data-qa.js 题库种子，
   每题带 src 来源字段（来源文件 · 章节）。

   用法（在 pushmian-buddy 根目录）：
     npm run gen:qa
   或
     node scripts/parse-qa.js

   约定：
   - md文件/ 位于本仓库根目录的上一级（与 pushmian-buddy 同级）。
   - 6 个 QA_*.md 是四科精选问答（id 前缀 qa-ds1/qa-ds2/qa-ds3/qa-co/qa-os/qa-cn
     保持稳定，老用户标记进度不丢；其余文件仅保留去重后的独有问题）。
   - DS_* 章节文件是 PPT 转文本 + AI 占位问答（"根据文档内容…通常指的是…"），
     会被 isPlaceholder 自动剔除，数据结构内容由 QA_DataStructure_* 承担。
   - 新增独立分类：深度学习 / AI智能体 / 项目经历 / 生物信息。
   - 新增 md 后：改下方 SRC 数组（补一行 {file, cat, prefix}）再重跑即可。
   ============================================================ */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const MD_CANDIDATES = [
  path.join(__dirname, "..", "md文件"),       // 推荐：仓库内，可随代码版本管理
  path.join(__dirname, "..", "..", "md文件") // 兼容旧工作区布局
];
const MDDIR = MD_CANDIDATES.find(p => fs.existsSync(p)) || MD_CANDIDATES[0];
const OUT   = path.join(__dirname, "..", "js", "data-qa.js");
const CHECK_ONLY = process.argv.includes("--check");
const MIN_EXPECTED = 1000;

/* ---------- 归一化，用于去重 ---------- */
function normQ(s){
  return String(s || "").toLowerCase().replace(/[\s\u3000，。？！、．:：；;,.!?（）()【】\[\]「」"'“”‘’《》<>-]/g, "").replace(/q\d+$/,"");
}
const existingIdByQ = new Map();
if(fs.existsSync(OUT)){
  try{
    const old = require(OUT).SEED_QUESTIONS_QA || [];
    old.forEach(q => { const k=normQ(q.q); if(k && q.id) existingIdByQ.set(k, q.id); });
  }catch(e){ console.warn("警告：无法读取现有题库 id，将为全部题目重新生成稳定 id：" + e.message); }
}

/* ---------- 章节标题抽取 ---------- */
function cleanHeading(h){
  return h.replace(/^[#\s]*/, "").replace(/\s*[#\s]*$/,"").trim();
}

/* ---------- 答案是否疑似"占位/模板生成" ---------- */
function isPlaceholder(a){
  if(!a) return true;
  if(/根据文档内容|供学习和复习使用|是一个重要的概念|具有以下几个主要特点|通常指的是|以下是一个|仅供参考/.test(a)) return true;
  return a.length < 6;
}

/* ============================================================
   Handler A：QA 文件 / 408汇总 / 毕业实习 / 锐鉴医学
   question: ^#{3,6}\s*Q\d*\s*[.．、:：]?\s*(.+)
   或        ^\*\*(?:Q|问题)\d*\s*[：:.]\s*(.+)\*\*$
   answer  : ^\*\*(?:答|A|Answer|答案|回答)[:：]?\*\*\s*(.*)
             ^\*\*核心回答[:：]\s*(.*)
   或        ^A[:：]\s*(.*)
   ============================================================ */
function parseLines(lines){
  const out = [];
  let cur = null, section = "";
  const headingRe = /^(#{1,2})\s+(.+)$/;   // # / ## 视为章节
  const qReH = /^#{3,6}\s*Q\s*\d*\s*[.．、:：]?\s*(.+)$/;
  const qReN = /^#{3,6}\s*问答\s*\d+\s*[：:]\s*(.+)$/;                      // ### 问答30：xxx？
  const qReD = /^#{3,6}\s*\d+(?:\.\d+)*\s*[.．、]\s*(.+[？?])\s*$/;        // ### 1. xxx？
  const qReB = /^\*\*(?:Q|问题|Question)\s*\d*\s*[：:.]\s*(.+?)\*\*\s*$/;
  const qReSub = /^\#{3}\s*(问题|Question)\s*\d*\s*$/; // "### 问题 1" 或 "### Q1"
  const aRe = /^\*\*(?:答|A|Answer|答案|回答)\s*[:：]?\*\*\s*(.*)$/;
  const aRe2 = /^\*\*核心回答\s*[:：]?\s*(.*)$/;
  const aRe3 = /^A\s*[:：]\s*(.*)$/;

  const push = () => {
    if(cur){
      const q = cur.q.trim().replace(/^#{1,6}\s*/, "").trim();
      let a = cur.a.trim().replace(/^\*\*[:：]\s*/, ""); // 清理「**核心回答**：」解析残留的「**：」
      if(q && a.length >= 6 && !isPlaceholder(a)) out.push({ q, a, sec: cur.sec });
      cur = null;
    }
  };

  for(let i=0;i<lines.length;i++){
    let l = lines[i];
    if(!l.trim()) continue;
    const h = l.match(headingRe);
    if(h){
      const txt = cleanHeading(h[2]);
      if(!/^(目录|内容分布|文档概述|详细内容|参考文献|表格\s*\d)/.test(txt) && !/^第\s*\d+\s*页$/.test(txt)){
        push(); section = txt;
      }
      continue;
    }
    let m = l.match(qReH) || l.match(qReN) || l.match(qReD) || l.match(qReB);
    if(!m && qReSub.test(l)){ m = [l, ""]; }
    if(m){
      push();
      cur = { q: m[1] || "", a: "", sec: section };
      continue;
    }
    let am = l.match(aRe) || l.match(aRe2) || l.match(aRe3);
    if(am){
      if(!cur){ cur = { q: "", a: "", sec: section }; }
      cur.a = am[1] ? am[1].trim() : "";
      continue;
    }
    if(cur){
      if(/^-{3,}$/.test(l.trim())){ push(); continue; }
      const strip = l.replace(/^[|>]\s*/, "").replace(/\s*[|>]$/, "").trim();
      if(strip) cur.a += (cur.a ? "\n" : "") + strip;
    }
  }
  push();
  return out;
}

/* ============================================================
   Handler B：智能体实践深度分析报告（加粗问题 + 段落回答）
   question: ^\*\*(.+[？?])\*\*$   且不含 Q 编号，长度>=6
   answer  : 后续非加粗段落，直到下一个问题/标题
   ============================================================ */
function parseBoldQA(lines){
  const out = [];
  let cur = null, section = "";
  const headingRe = /^(#{1,3})\s+(.+)$/;
  const qRe = /^\*\*(.+[？?])\*\*\s*$/;
  const push = () => {
    if(cur){
      const q = cur.q.trim(), a = cur.a.trim();
      if(q.length >= 6 && a.length >= 10 && !isPlaceholder(a)) out.push({ q, a, sec: section });
      cur = null;
    }
  };
  for(let i=0;i<lines.length;i++){
    let l = lines[i];
    if(!l.trim()) continue;
    const h = l.match(headingRe);
    if(h && !/^(目录|内容分布|参考文献)/.test(cleanHeading(h[2]))){
      push(); section = cleanHeading(h[2]); continue;
    }
    const m = l.match(qRe);
    if(m && !/^#{1,6}\s/.test(l)){
      push();
      cur = { q: m[1], a: "" };
      continue;
    }
    if(cur && !/^#{1,6}\s/.test(l)){
      const strip = l.replace(/^[|>]\s*/, "").replace(/\s*[|>]$/, "").trim();
      if(strip && !/^-{3,}$/.test(strip)) cur.a += (cur.a ? "\n" : "") + strip;
    }
  }
  push();
  return out;
}

/* ============================================================
   文件 → 分类 / id 前缀 / 解析器
   ============================================================ */
const SRC = [
  // —— 四科问答（保留原 id 前缀，便于用户进度不丢）——
  { file: "QA_DataStructure_1.md",   cat: "数据结构",     prefix: "qa-ds1" },
  { file: "QA_DataStructure_2.md",   cat: "数据结构",     prefix: "qa-ds2" },
  { file: "QA_DataStructure_3.md",   cat: "数据结构",     prefix: "qa-ds3" },
  { file: "QA_ComputerOrganization.md", cat: "计算机组成原理", prefix: "qa-co" },
  { file: "QA_OperatingSystem.md",   cat: "操作系统",     prefix: "qa-os" },
  { file: "QA_ComputerNetwork.md",   cat: "计算机网络",   prefix: "qa-cn" },
  // —— 408 总汇总（与 QA 文件同源，靠去重跳过重复；保留少量独有问题）——
  { file: "408四科考点问答总汇总.md", cat: "408总汇总",    prefix: "qa-408" },
  // —— 四科章节笔记（Q&A 内嵌，去重后仅保留章节独有）——
  { file: "CN_0_计算机网络体系结构.md", cat: "计算机网络",  prefix: "qa-cn0" },
  { file: "CN_1_物理层.md",           cat: "计算机网络",  prefix: "qa-cn1" },
  { file: "CN_2_数据链路层.md",       cat: "计算机网络",  prefix: "qa-cn2" },
  { file: "CN_3_网络层.md",           cat: "计算机网络",  prefix: "qa-cn3" },
  { file: "CN_4_传输层.md",           cat: "计算机网络",  prefix: "qa-cn4" },
  { file: "CN_5_应用层.md",           cat: "计算机网络",  prefix: "qa-cn5" },
  { file: "CO_0_计算机系统概述.md",   cat: "计算机组成原理", prefix: "qa-co0" },
  { file: "CO_1_数据的表示与运算.md", cat: "计算机组成原理", prefix: "qa-co1" },
  { file: "CO_2_存储系统.md",         cat: "计算机组成原理", prefix: "qa-co2" },
  { file: "CO_3_指令系统.md",         cat: "计算机组成原理", prefix: "qa-co3" },
  { file: "CO_4_中央处理器.md",       cat: "计算机组成原理", prefix: "qa-co4" },
  { file: "OS_0_计算机系统概述.md",   cat: "操作系统",     prefix: "qa-os0" },
  { file: "OS_1_进程管理.md",         cat: "操作系统",     prefix: "qa-os1" },
  { file: "OS_2_内存管理.md",         cat: "操作系统",     prefix: "qa-os2" },
  { file: "OS_3_文件管理.md",         cat: "操作系统",     prefix: "qa-os3" },
  { file: "OS_4_输入输出管理.md",     cat: "操作系统",     prefix: "qa-os4" },
  // DS_* 章节文件为 PPT 转文本 + AI 占位问答，isPlaceholder 会全部剔除（提取 0 题），
  // 数据结构内容由 QA_DataStructure_* 承担，故不列在 SRC 中。
  // —— 新增独立分类 ——
  { file: "深度学习完整知识问答.md",   cat: "深度学习",    prefix: "qa-dl",  mode: "lines" },
  { file: "毕业实习项目内容问答.md",   cat: "项目经历",    prefix: "qa-int", mode: "lines" },
  { file: "智能体实践深度分析报告.md", cat: "AI智能体",    prefix: "qa-agt", mode: "bold" },
  { file: "锐鉴医学项目文档.md",       cat: "生物信息",    prefix: "qa-bio", mode: "lines" },
];

/* ---------- 题干指纹：由内容稳定生成 id，防止在 md 中间插入/删除题时 id 整体漂移 ---------- */
function hash32(s){
  s = String(s || "").replace(/\s+/g, "").toLowerCase();
  let h = 2166136261;
  for(let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h.toString(16);
}

const all = [];
const seenQ = new Set(); // 归一化题干去重
function add(item, fileShort, prefix){
  const key = normQ(item.q);
  if(!key || seenQ.has(key)) return false;
  seenQ.add(key);
  item.cat = item.cat || CAT;          // 分类来自所属文件配置
  item.src = fileShort + (item.sec ? " · " + item.sec : "");
  // 优先复用现有同题干 id，确保老用户进度稳定；仅新题使用内容哈希 id。
  item.id = existingIdByQ.get(key) || (prefix + "-" + hash32(item.q).slice(0, 8));
  all.push(item);
  return true;
}
let CAT = "";

const missingFiles = SRC.filter(s => !fs.existsSync(path.join(MDDIR, s.file))).map(s => s.file);
if(missingFiles.length){
  console.error("题库生成已中止：缺少 " + missingFiles.length + " 个必需源文件（未修改 data-qa.js）");
  missingFiles.forEach(f => console.error("  - " + f));
  console.error("查找目录：" + MDDIR);
  process.exit(1);
}

for(const s of SRC){
  const full = path.join(MDDIR, s.file);
  const t = fs.readFileSync(full, "utf8");
  const lines = t.split("\n");
  const items = s.mode === "bold" ? parseBoldQA(lines) : parseLines(lines);
  const fileShort = s.file.replace(/\.md$/, "");
  CAT = s.cat;
  /* ---- 迁移说明：id 稳定性 ----
     v11 起题干改用内容哈希生成稳定 id；老版本为"文件内顺序编号"，
     曾在 md 中间插入/删除题后重生成导致整文件 id 漂移、用户旧进度错位或产生空壳题。
     已由 core.js 的"指纹迁移 + 空壳清理"兜底：带进度且同题干的旧 id 会自动回迁。 */
  let n = 0, added = 0;
  items.forEach(it => {
    n++;
    it.n = n;
    if(add(it, fileShort, s.prefix)) added++;
  });
  console.log((s.file.padEnd(30)), "提取", String(items.length).padStart(3), "题 → 新入库", added, "（分类:", s.cat + "）");
}

/* ---------- 导出 ---------- */
function esc(s){ return String(s||"").replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\r/g,"").replace(/\n/g,"\\n"); }
const byCat = {};
all.forEach(q => byCat[q.cat] = (byCat[q.cat] || 0) + 1);

const header = `/* ============================================================
   推免助手 PushMian Buddy — 问答库种子（由 md文件/ 全部 md 自动解析生成）
   每题含 src 来源字段（来源文件 · 章节），避免"只有问题不知出处"。
   生成命令：npm run gen:qa（见 scripts/parse-qa.js）
   ============================================================ */
`;
const linesOut = [header, "const SEED_QUESTIONS_QA = ["];
all.forEach(q => {
  linesOut.push(`{id:"${q.id}",cat:"${q.cat}",q:"${esc(q.q)}",ans:"${esc(q.a)}",src:"${esc(q.src)}",tip:"",pit:"",extra:"${esc(q.sec||"")}",status:"未标记",nextReview:"",reviewStage:0,fav:false},`);
});
linesOut.push("];");
linesOut.push("");
linesOut.push("/* 分类统计 */");
Object.keys(byCat).forEach(c => linesOut.push(`// ${c}: ${byCat[c]}`));
linesOut.push("");
linesOut.push(`if(typeof module !== "undefined") module.exports = { SEED_QUESTIONS_QA };`);
const generated = linesOut.join("\n");
if(all.length < MIN_EXPECTED) throw new Error("生成题量异常：" + all.length + " < " + MIN_EXPECTED + "，已拒绝覆盖");
const ids = new Set();
all.forEach(q => { if(ids.has(q.id)) throw new Error("生成结果存在重复 id：" + q.id); ids.add(q.id); });
new vm.Script(generated, { filename:"data-qa.generated.js" });
if(CHECK_ONLY){
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8").replace(/\r\n/g,"\n") : "";
  if(current.trimEnd() !== generated.replace(/\r\n/g,"\n").trimEnd()){
    const a=current.split("\n"), b=generated.replace(/\r\n/g,"\n").split("\n");
    let first=0; while(first<Math.min(a.length,b.length) && a[first]===b[first]) first++;
    console.error("题库生成检查失败：js/data-qa.js 与源 Markdown 不一致（未修改文件）");
    console.error("首个差异位于第 " + (first+1) + " 行；当前/生成总行数 " + a.length + "/" + b.length);
    console.error("当前：" + (a[first] || "").slice(0,300));
    console.error("生成：" + (b[first] || "").slice(0,300));
    process.exit(1);
  }
  console.log("\n题库生成检查通过：", all.length, "题，现有 data-qa.js 与源文件一致");
}else{
  const tmp = OUT + ".tmp-" + process.pid;
  fs.writeFileSync(tmp, generated, "utf8");
  try{ fs.renameSync(tmp, OUT); }
  catch(e){ try{ if(fs.existsSync(tmp)) fs.unlinkSync(tmp); }catch(_){} throw e; }
  console.log("\n已原子更新", OUT, "共", all.length, "题");
}
console.log("按分类:", JSON.stringify(byCat));
