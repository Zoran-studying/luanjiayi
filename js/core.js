/* ============================================================
   推免助手 PushMian Buddy — 核心模块（状态/工具/持久化/渲染/事件分发）
   ============================================================ */
const STORE_KEY = "pmb_state_v1";
const INTERVALS = [1, 3, 7, 15, 30]; // SM-2 复习间隔（天）：不会/模糊 从最短间隔起步，掌握后仍会延长间隔反复强化
/* 全真面试各分类题量配比（可在题库页「全真模拟设置」中调节） */
const IV_COMP_CATS = ["基础","数据结构","计算机组成原理","操作系统","计算机网络","深度学习","AI智能体","项目经历","生物信息","英文","科研深挖","翻译"];
const IV_COMP_DEFAULT = { 基础:3, 数据结构:1, 计算机组成原理:1, 操作系统:1, 计算机网络:1, 深度学习:2, AI智能体:0, 项目经历:1, 生物信息:0, 英文:5, 科研深挖:5, 翻译:2 };
function getIvComp(){ return IV_COMP_CATS.reduce((o,c) => { o[c] = Math.max(0, (S.settings.ivComp[c]) | 0); return o; }, {}); }
const CONTENT_VER = 10;

/* —— 本地日期（修复旧版 toISOString 的 UTC 时区错位）—— */
function fmtDate(d){ return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function todayStr(){ return fmtDate(new Date()); }
function addDays(d, n){ const x = new Date(d + "T00:00:00"); x.setDate(x.getDate() + n); return fmtDate(x); }
function daysBetween(a, b){ return Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000); }

let S = null;          // 全局状态
let CURTAB = "home";   // 当前模块（标记后原地刷新用）
let DOCBANK_SRC = null; // 真题分区：当前文档
let __tabName = "home", __tabStart = Date.now(); // 各板块学习计时
let __scrollY = 0;                                // 全量重渲染时保留的滚动位置

/* ---------------- 工具 ---------------- */
function $(sel, root){ return (root || document).querySelector(sel); }
function esc(s){ return (s==null?"":String(s)).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
/* ---- 轻量 Markdown 渲染（用于展示答案，保留可编辑性：仅当用户编辑时才可能丢失原文标记） ---- */
function mdHtml(raw){
  if(raw == null) raw = "";
  const lines = esc(raw).split("\n");
  const inline = s => s.replace(/\*\*([^*]+?)\*\*/g, "<b>$1</b>").replace(/`([^`]+)`/g, "<code>$1</code>");
  const out = [];
  let i = 0, codeBuf = null;
  while(i < lines.length){
    const l = lines[i];
    if(/^\s*```/.test(l)){
      if(codeBuf == null){ codeBuf = []; i++; continue; }
      out.push(`<div class="codewrap"><pre class="hl">` + codeBuf.map(hlLine).join("\n") + `</pre><button class="copybtn" onclick="copyCode(this)">复制</button></div>`);
      codeBuf = null; i++; continue;
    }
    if(codeBuf != null){ codeBuf.push(l); i++; continue; }
    if(/^\s*(?:>|&gt;)\s?/.test(l)){
      const q = [];
      while(i < lines.length && /^\s*(?:>|&gt;)\s?/.test(lines[i])){ q.push(inline(lines[i].replace(/^\s*(?:>|&gt;)\s?/, ""))); i++; }
      out.push("<blockquote>" + q.join("\n") + "</blockquote>"); continue;
    }
    if(l.indexOf("|") >= 0){
      const parse = r => { const p = r.split("|"); if(p[0] && !p[0].trim()) p.shift(); if(p.length && !p[p.length-1].trim()) p.pop(); return p.map(t => inline(t.trim())); };
      const isSep = r => /^[\s|:]*:?-{3,}[\s|:-]*$/.test(r.trim());
      const blk = [l]; let j = i + 1;
      while(j < lines.length && lines[j].indexOf("|") >= 0){ blk.push(lines[j]); j++; }
      // 修复：只有块内存在 `---` 分隔行才按表格解析，
      // 避免把含 |V|/|y| 这类绝对值记号的普通文本（如复杂度）误渲染成错位表格。
      if(blk.length >= 2 && blk.some(isSep)){
        const head = parse(blk[0]);
        const rows = [];
        for(let k = 1; k < blk.length; k++){ if(!isSep(blk[k])) rows.push(parse(blk[k])); }
        i = j;
        out.push("<table class='mdt'><thead><tr>" + head.map(c => "<th>" + c + "</th>").join("") + "</tr></thead><tbody>"
          + rows.map(r => "<tr>" + r.map(c => "<td>" + c + "</td>").join("") + "</tr>").join("") + "</tbody></table>");
        continue;
      }
    }
    if(/^\s*#{1,6}\s/.test(l)){ out.push("<b>" + inline(l.replace(/^\s*#{1,6}\s/, "")) + "</b>"); i++; continue; }
    if(/^\s*[-*•]\s+/.test(l)){
      const items = [];
      while(i < lines.length && /^\s*[-*•]\s+/.test(lines[i])){ items.push("<li>" + inline(lines[i].replace(/^\s*[-*•]\s+/, "")) + "</li>"); i++; }
      out.push("<ul>" + items.join("") + "</ul>"); continue;
    }
    if(/^\s*\d+[.、)]\s+/.test(l)){
      const items = [];
      while(i < lines.length && /^\s*\d+[.、)]\s+/.test(lines[i])){ items.push("<li>" + inline(lines[i].replace(/^\s*\d+[.、)]\s+/, "")) + "</li>"); i++; }
      out.push("<ol>" + items.join("") + "</ol>"); continue;
    }
    out.push(inline(l)); i++;
  }
  return out.join("\n");
}
function uid(){ return "x" + Math.random().toString(36).slice(2, 9); }

/* ---- 题干指纹（内容哈希）：跨题库重生成的 id 漂移时，用指纹把旧进度迁移到同题干新种子 ----
   规范化 = 去空白 + 小写 + djb2 32 位哈希 + 长度，同题干必同指纹，碰撞概率可忽略 */
function fpOf(t){
  const s = String(t || "").replace(/\s+/g, "").toLowerCase();
  if(!s) return "";
  let h = 5381;
  for(let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(16) + "_" + s.length;
}

/* ---- 轻量代码高亮（答案代码块内部着色：注释/字符串/数字/关键字） ---- */
const HL_KW = new Set(["const","let","var","function","return","if","else","elif","for","while","do","def","class","new","import","from","as","not","and","or","in","is","None","True","False","self","this","null","undefined","true","false","async","await","try","except","finally","raise","lambda","bool","int","float","str","list","dict","tuple","set","void","struct","enum","with","yield","global","nonlocal","pass","break","continue","switch","case","default","char","double","long","short","unsigned","signed","static","public","private","protected","return","NULL","nullptr"]);
function hlLine(line){
  const re = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`|#[^\n]*|\/\/[^\n]*|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b)/g;
  let out = "", i = 0, m;
  const put = (s, cls) => { out += cls ? '<span class="h-' + cls + '">' + s + "</span>" : s; };
  while((m = re.exec(line))){
    put(line.slice(i, m.index));
    const t = m[0];
    const cls = (t[0] === '"' || t[0] === "'" || t[0] === "`") ? "str"
      : (t[0] === "#" || t[0] === "/") ? "com"
      : /^\d/.test(t) ? "num"
      : HL_KW.has(t) ? "kw" : "";
    put(t, cls);
    i = m.index + t.length;
  }
  put(line.slice(i));
  return out;
}

/* ---- 复制文本（兼容剪贴板 API 与低版本回退） ---- */
function fallbackCopy(txt, done){
  try{
    const ta = document.createElement("textarea");
    ta.value = txt; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    document.execCommand("copy"); ta.remove(); done();
  }catch(e){ flash("复制失败，请手动选择复制"); }
}
function copyText(txt){
  const done = () => flash("✅ 已复制");
  if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(done, () => fallbackCopy(txt, done)); }
  else fallbackCopy(txt, done);
}
function copyCode(btn){
  const pre = btn.closest(".codewrap").querySelector("pre");
  const txt = pre ? pre.innerText : "";
  if(!txt){ flash("无可复制内容"); return; }
  const done = () => { btn.textContent = "已复制"; btn.classList.add("copied"); setTimeout(() => { btn.textContent = "复制"; btn.classList.remove("copied"); }, 1500); };
  if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(done, () => fallbackCopy(txt, done)); }
  else fallbackCopy(txt, done);
}
function shuffle(arr){ for(let i = arr.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
function shuffleIdx(n){ const a = []; for(let i = 0; i < n; i++) a.push(i); return shuffle(a); }

/* ---------------- 持久化（瘦身：仅存用户进度与题干增量，题目内容从种子重建） ---------------- */
const Q_DELTA_KEYS = ["q","ans","key","tip","pit","extra","cat","status","reviewStage","nextReview","fav"];
let _seedCache = null;
function buildSeedList(){
  const base = [];
  (SEED_QUESTIONS || []).forEach(s => { if(s && s.id != null) base.push(s); });
  (SEED_QUESTIONS_QA || []).forEach(s => { if(s && s.id != null) base.push(s); });
  (SEED_QUESTIONS_EN || []).forEach(s => { if(s && s.id != null) base.push(s); });
  (SEED_QUESTIONS_VOCAB || []).forEach(s => { if(s && s.id != null) base.push(s); });
  return base;
}
function seedCache(){
  if(!_seedCache){
    const list = buildSeedList();
    const map = {}; const ids = new Set();
    list.forEach(s => { if(s.id != null){ map[s.id] = s; ids.add(s.id); } });
    _seedCache = { list, map, ids };
  }
  return _seedCache;
}
function compactQuestion(q){
  const base = seedCache().map[q.id];
  if(!base) return JSON.parse(JSON.stringify(q)); // 用户自建题：整条保留
  const d = { id: q.id };
  Q_DELTA_KEYS.forEach(k => { if(q[k] !== base[k] && q[k] !== undefined) d[k] = q[k]; });
  // 有用户进度时才带指纹：未来题库重生成（id 可能漂移）时据此迁移进度，避免错位/丢失
  if(Object.keys(d).length > 1) d.fp = fpOf(q.q);
  return d;
}
function expandQuestions(comps, baseList){
  const byId = {}, byFp = {};
  const compsArr = comps || [];
  compsArr.forEach(c => { if(c && c.id != null) byId[c.id] = c; if(c && c.fp) byFp[c.fp] = c; });
  const canonIds = new Set();
  const usedIds = new Set();
  const out = [];
  (baseList || []).forEach(s => {
    let c = byId[s.id];
    if(!c && s.q) c = byFp[fpOf(s.q)]; // id 已漂移 → 按题干指纹回迁旧进度
    if(c) usedIds.add(c.id);
    const o = JSON.parse(JSON.stringify(s));
    if(c) Q_DELTA_KEYS.forEach(k => { if(c[k] !== undefined) o[k] = c[k]; });
    out.push(o);
    canonIds.add(s.id);
  });
  compsArr.forEach(c => {
    if(c && c.id != null && !canonIds.has(c.id) && !usedIds.has(c.id)){
      // 未被任何种子接纳的孤儿项：
      //  - 用户自建（x/u 开头）保留整条；
      //  - 引擎题（qa-* 前缀）若已无题干文本（历史 id 漂移产生的空壳）则丢弃，
      //    避免出现只有 id、没有题干/答案的僵尸题。
      const engine = /^qa-/.test(String(c.id));
      if(!engine || (c.q && String(c.q).trim())) out.push(JSON.parse(JSON.stringify(c)));
    }
  });
  return out;
}
function doSave(){
  try{
    let payload = S;
    if(S && Array.isArray(S.questions)){
      const rest = {};
      Object.keys(S).forEach(k => { if(k !== "questions") rest[k] = S[k]; });
      payload = Object.assign(rest, { _compact: true, questions: S.questions.map(compactQuestion) });
    }
    localStorage.setItem(STORE_KEY, JSON.stringify(payload));
  }catch(e){ alert("保存失败：可能是数据过大超出浏览器存储限制（"+e.name+"）。请先导出备份并减少内容。"); }
}
let __saveT = null;
function save(){ // 节流：高频调用合并为一次写入，降低切 tab / 标记时的全量序列化开销
  if(__saveT) return;
  __saveT = setTimeout(() => { __saveT = null; doSave(); }, 200);
}
function flushNow(){ if(__saveT){ clearTimeout(__saveT); __saveT = null; } doSave(); }
function load(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(!raw) return false;
    const d = JSON.parse(raw);
    if(d && d._compact && Array.isArray(d.questions)){
      d.questions = expandQuestions(d.questions, seedCache().list);
    }
    S = d;
    return true;
  }catch(e){ console.warn("读取本地存储失败", e); }
  return false;
}
function flushTabTime(name, start){
  if(!name || !start) return;
  const elapsed = (Date.now() - start) / 1000;
  if(elapsed < 1) return;
  const d = getDay();
  d.timeByTab = d.timeByTab || {};
  d.timeByTab[name] = (d.timeByTab[name] || 0) + elapsed;
  save();
}
function fmtMin(sec){ sec = Math.round(sec || 0); const m = Math.floor(sec / 60), s = sec % 60; return m + "分" + (s < 10 ? "0" : "") + s + "秒"; }
const TAB_LABELS = { home:"首屏工作台", bank:"面试题库A", focus:"重点复习", docbank:"真题分区", intro:"自我介绍", vocab:"词汇文献", ledger:"学习台账" };

/* ---------------- 状态兜底（旧备份/缺字段自动补全，防导入崩溃） ---------------- */
function ensureState(){
  const defaultProfile = () => JSON.parse(JSON.stringify(PROFILE));
  const defaultArr = s => JSON.parse(JSON.stringify(s));
  if(!S || typeof S !== "object") S = {};
  if(!S.profile) S.profile = defaultProfile();
  if(!S.selfIntro) S.selfIntro = defaultArr(SELF_INTRO);
  if(!Array.isArray(S.questions)) S.questions = defaultArr(SEED_QUESTIONS);
  if(!Array.isArray(S.vocab)) S.vocab = defaultArr(SEED_VOCAB);
  if(!Array.isArray(S.radar)) S.radar = defaultArr(SEED_RADAR);
  if(!S.docbank) S.docbank = defaultArr(SEED_DOCBANK);
  if(!Array.isArray(S.translate)) S.translate = defaultArr(SEED_TRANSLATE);
  if(!Array.isArray(S.papers)) S.papers = defaultArr(DAILY_PAPERS);
  if(!Array.isArray(S.wordBank)) S.wordBank = [];
  if(!S.logs) S.logs = {};
  if(!S.settings) S.settings = {};
  if(!S.settings.streak) S.settings.streak = 0;
  if(!S.settings.lastActive) S.settings.lastActive = "";
  if(!S.settings.intensity) S.settings.intensity = "normal";
  if(!S.settings.totalPractice) S.settings.totalPractice = 0;
  if(S.settings.masteryRetire == null) S.settings.masteryRetire = false;
  if(!S.settings.ivComp || typeof S.settings.ivComp !== "object") S.settings.ivComp = {};
  IV_COMP_CATS.forEach(c => { if(S.settings.ivComp[c] == null) S.settings.ivComp[c] = IV_COMP_DEFAULT[c]; });
  S.questions.forEach(q => { if(q.fav == null) q.fav = false; });
}

/* ---------------- 种子合入 + 内容迁移（非破坏性）---------------- */
function mergeSeeds(){
  ensureState();
  // —— 内容迁移 v8→v9：专业分类题库整体切换为 408 QA 库 ——
  // v8 中专业分类（数据结构/计算机组成原理/操作系统/计算机网络）曾用少量种子题，
  // v9 起由 data-qa.js 的 SEED_QUESTIONS_QA（612 题）接管。迁移规则：
  // 仅删除 v8 的旧专业种子题（id 以 q/r/e/t 开头的数字段或固定前缀），
  // 保留用户自建项（x/u 开头）与 基础/科研/英文/翻译/词汇翻译，保留学习日志与设置。
  if(S.contentVersion >= 8 && S.contentVersion < 9){
    S.questions = S.questions.filter(q => {
      const id = q.id || "";
      if(/^[xu]/.test(id)) return true;
      if(!q.cat) return true;
      return !["数据结构","计算机组成原理","操作系统","计算机网络"].includes(q.cat);
    });
    S.contentVersion = 9;
  }
  // —— 内容迁移 v7→v8：海洋方向 → 计算机方向 整体切换 ——
  // 旧版本主题（海洋微生物/市政水处理）整体替换为计算机方向种子：
  // 题库/词汇/翻译重建，仅保留用户自建项（id 以 x/u 开头），保留学习日志与设置。
  if((S.contentVersion || 0) < 8){
    S.questions = S.questions.filter(q => /^[xu]/.test(q.id || ""));
    S.vocab = [];
    S.translate = [];
    S.radar = JSON.parse(JSON.stringify(SEED_RADAR));
    S.papers = JSON.parse(JSON.stringify(DAILY_PAPERS));
    S.docbank = JSON.parse(JSON.stringify(SEED_DOCBANK));
    S.contentVersion = 8;
  }
  // 历史数据去重：旧版本种子曾含重复词条（保留首次出现的较完整词条及其标记）
  const seenV = new Set();
  S.vocab = S.vocab.filter(v => { const k = (v.term || "").toLowerCase(); if(!k || seenV.has(k)) return false; seenV.add(k); return true; });
  const haveQ = new Set(S.questions.map(q => q.id));
  JSON.parse(JSON.stringify(SEED_QUESTIONS)).forEach(q => { if(!haveQ.has(q.id)) S.questions.push(q); });
  JSON.parse(JSON.stringify(SEED_QUESTIONS_QA || [])).forEach(q => { if(!haveQ.has(q.id)){ S.questions.push(q); haveQ.add(q.id); } });
  const haveV = new Set(S.vocab.map(v => v.term));
  JSON.parse(JSON.stringify(SEED_VOCAB)).forEach(v => { if(!haveV.has(v.term)) S.vocab.push(v); });
  const haveR = new Set(S.radar.map(r => r.school + r.major + r.type));
  JSON.parse(JSON.stringify(SEED_RADAR)).forEach(r => { if(!haveR.has(r.school + r.major + r.type)) S.radar.push(r); });
  JSON.parse(JSON.stringify(SEED_QUESTIONS_EN)).forEach(q => { if(!haveQ.has(q.id)){ S.questions.push(q); haveQ.add(q.id); } });
  const haveQV = new Set(S.questions.map(q => q.id));
  JSON.parse(JSON.stringify(SEED_QUESTIONS_VOCAB)).forEach(q => { if(!haveQV.has(q.id)){ S.questions.push(q); haveQV.add(q.id); } });
  const haveVT = new Set(S.vocab.map(v => v.term));
  JSON.parse(JSON.stringify(SEED_VOCAB_TB)).forEach(v => { if(!haveVT.has(v.term)){ S.vocab.push(v); haveVT.add(v.term); } });

  if(!S.translate) S.translate = JSON.parse(JSON.stringify(SEED_TRANSLATE));
  else { const haveT = new Set(S.translate.map(t => t.id)); JSON.parse(JSON.stringify(SEED_TRANSLATE)).forEach(t => { if(!haveT.has(t.id)) S.translate.push(t); }); }
  if(!S.docbank) S.docbank = JSON.parse(JSON.stringify(SEED_DOCBANK));

  // 关键词提醒：无论新旧用户一律补齐（幂等，仅填充缺失项）
  S.questions.forEach(q => { if(!q.key && KEY_ANSWERS[q.id]) q.key = KEY_ANSWERS[q.id]; });

  // —— 内容升级迁移：完整答案同步 + 词汇释义刷新；"词汇翻译"改为合并（保留用户编辑/标记）——
  if(S.contentVersion !== CONTENT_VER){
    const ansMap = {};
    [...SEED_QUESTIONS, ...(SEED_QUESTIONS_QA || []), ...SEED_QUESTIONS_EN, ...SEED_QUESTIONS_VOCAB].forEach(s => { if(s.id && s.ans != null) ansMap[s.id] = s.ans; });
    S.questions.forEach(q => { if(ansMap[q.id] != null) q.ans = ansMap[q.id]; });
    const vMap = {};
    [...SEED_VOCAB, ...SEED_VOCAB_TB].forEach(v => { if(v.term) vMap[v.term] = v; });
    S.vocab.forEach(v => { const nv = vMap[v.term]; if(nv){ v.en = nv.en; v.def = nv.def; v.ex = nv.ex; v.syn = nv.syn; } });
    // 词汇：只刷新种子词条字段，绝不过滤删除任何已有词条（含用户自增词与标记状态，非破坏性）
    // "词汇翻译"分类：补齐种子缺失项即可，不清空（非破坏性）
    const haveQV2 = new Set(S.questions.filter(q => q.cat === "词汇翻译").map(q => q.id));
    JSON.parse(JSON.stringify(SEED_QUESTIONS_VOCAB)).forEach(q => { if(!haveQV2.has(q.id)){ S.questions.push(q); haveQV2.add(q.id); } });
    S.contentVersion = CONTENT_VER;
  }

  // —— 字段兜底 ——
  if(!Array.isArray(S.wordBank)) S.wordBank = [];
  save();
}

function init(){
  if(load()){ mergeSeeds(); return; }
  S = {
    profile: JSON.parse(JSON.stringify(PROFILE)),
    selfIntro: JSON.parse(JSON.stringify(SELF_INTRO)),
    questions: JSON.parse(JSON.stringify(SEED_QUESTIONS.concat(SEED_QUESTIONS_QA || []))),
    vocab: JSON.parse(JSON.stringify(SEED_VOCAB)),
    radar: JSON.parse(JSON.stringify(SEED_RADAR)),
    docbank: JSON.parse(JSON.stringify(SEED_DOCBANK)),
    translate: JSON.parse(JSON.stringify(SEED_TRANSLATE)),
    papers: JSON.parse(JSON.stringify(DAILY_PAPERS)),
    wordBank: [],
    logs: {},
    settings: { streak: 0, lastActive: "", intensity: "normal", totalPractice: 0 }
  };
  mergeSeeds();
  save();
}

/* ---------------- 每日生成 ---------------- */
function pick(arr, n, prefer){ // 洗牌后取前 n（修复旧版 used-set 死循环）
  const src = arr.filter(q => prefer.includes(q.status)).concat(arr.filter(q => !prefer.includes(q.status)));
  shuffle(src);
  return src.slice(0, n).map(q => q.id);
}
function dueReview(){
  // SM-2 到期待复习：凡 nextReview 已到期（含已掌握但到期的强化项）都进入复盘
  const t = todayStr();
  return S.questions.filter(q => q.nextReview && q.nextReview <= t);
}
function genDay(date){
  const t = date || todayStr();
  const q = S.questions;
  const byCat = c => q.filter(x => x.cat === c);
  const interview = [].concat(
    pick(byCat("基础"), 2, ["模糊","不会"]),
    pick(byCat("数据结构"), 2, ["模糊","不会"]),
    pick(byCat("计算机组成原理"), 1, ["模糊","不会"]),
    pick(byCat("操作系统"), 1, ["模糊","不会"]),
    pick(byCat("计算机网络"), 2, ["模糊","不会"]),
    pick(byCat("深度学习"), 1, ["模糊","不会"]),
    pick(byCat("项目经历"), 1, ["模糊","不会"]),
    pick(byCat("AI智能体"), 1, ["模糊","不会"]),
    pick(byCat("科研深挖"), 2, ["模糊","不会"]),
    pick(byCat("英文"), 3, ["模糊","不会"]),
    pick(byCat("翻译"), 1, ["模糊","不会"])
  );
  const seen = new Set(); const uniq = []; interview.forEach(id => { if(!seen.has(id)){ seen.add(id); uniq.push(id); } });
  const review = dueReview().map(x => x.id).slice(0, 8);
  const cons = shuffle(S.questions.filter(x => x.status === "掌握")).slice(0, 3).map(x => x.id);
  const newVocab = S.vocab.length ? S.vocab[Math.floor(Math.random() * S.vocab.length)].term : "（词汇）";
  const paper = S.papers.length ? S.papers[Math.floor(Math.random() * S.papers.length)] : "";
  S.logs[t] = {
    date: t, interview: uniq,
    plan: { newInterview: uniq, review, consolidate: cons, newVocab, paper },
    selfIntro: { cn:false, en:false, ppt:false },
    weak: [], note: ""
  };
  save();
  return S.logs[t];
}
function getDay(date){
  const t = date || todayStr();
  if(!S.logs[t]) return genDay(t);
  return S.logs[t];
}

/* ---------------- 状态标记 ---------------- */
function markQuestion(id, status){
  const q = S.questions.find(x => x.id === id); if(!q) return;
  const prev = q.status;
  q.status = status;
  const t = todayStr();
  if(status === "不会"){
    // 彻底遗忘：回到最短间隔，从头学
    q.reviewStage = 0;
    q.nextReview = addDays(t, INTERVALS[0]);
  } else if(status === "模糊"){
    // 复习阶段递增：首次标记明天复习；再次标记仍弱 → 升一档间隔（艾宾浩斯梯度）
    const wasWeak = prev === "模糊" || prev === "不会";
    q.reviewStage = wasWeak ? Math.min((q.reviewStage || 0) + 1, INTERVALS.length - 1) : 0;
    q.nextReview = addDays(t, INTERVALS[q.reviewStage]);
  } else { // 掌握：默认延长间隔后仍会排期回来强化（SM-2 闭环）；开启「掌握后不再强化」则彻底退出复习
    const st = (q.reviewStage == null) ? 0 : q.reviewStage;
    const ns = Math.min(st + 1, INTERVALS.length - 1);
    q.reviewStage = ns;
    if(S.settings.masteryRetire) q.nextReview = "";
    else q.nextReview = addDays(t, INTERVALS[ns]);
  }
  S.settings.totalPractice = (S.settings.totalPractice || 0) + 1;
  save();
}
function markVocab(idx, status){
  const v = S.vocab[idx]; if(!v) return;
  const t = todayStr();
  if(status === "不会"){
    v.reviewStage = 0;
    v.nextReview = addDays(t, INTERVALS[0]);
  } else if(status === "模糊"){
    const wasWeak = v.status === "模糊" || v.status === "不会";
    v.reviewStage = wasWeak ? Math.min((v.reviewStage || 0) + 1, INTERVALS.length - 1) : 0;
    v.nextReview = addDays(t, INTERVALS[v.reviewStage]);
  } else { // 掌握：默认延长间隔后仍会排期回来强化（SM-2 闭环，与题库一致）；可设置不再强化
    const st = (v.reviewStage == null) ? 0 : v.reviewStage;
    const ns = Math.min(st + 1, INTERVALS.length - 1);
    v.reviewStage = ns;
    if(S.settings.masteryRetire) v.nextReview = "";
    else v.nextReview = addDays(t, INTERVALS[ns]);
  }
  v.status = status;
  save();
}
function toggleFav(id){
  const q = S.questions.find(x => x.id === id); if(!q) return;
  q.fav = !q.fav; save();
}

/* ---------------- 导航与渲染 ---------------- */
const TABS = [
  ["home","首屏工作台"], ["bank","面试题库"], ["focus","重点复习"],
  ["docbank","真题分区"], ["intro","自我介绍"], ["vocab","词汇·文献"], ["ledger","学习台账"]
];
const BN_TABS = [["home","首屏"],["bank","题库"],["focus","重点"],["docbank","真题"],["intro","自介"],["vocab","词汇"],["ledger","台账"]];
function navBar(){
  return `<nav class="nav">` + TABS.map(([k,l]) => `<button class="navbtn" data-tab="${k}">${l}</button>`).join("") + `</nav>`;
}
function createBottomNav(){
  if(document.getElementById("bottomnav")) return;
  const el = document.createElement("div");
  el.id = "bottomnav"; el.className = "bottomnav";
  el.innerHTML = BN_TABS.map(([k,lb]) => `<button data-tab="${k}" id="bn-${k}"><span>${lb}</span></button>`).join("");
  document.body.appendChild(el);
}
function updateBottomNav(tab){
  const ns = document.querySelectorAll("#bottomnav button");
  if(ns.length) ns.forEach(b => b.classList.toggle("on", b.dataset.tab === tab));
}
function render(tab, after){
  tab = tab || "home";
  flushTabTime(__tabName, __tabStart);
  const freshBank = (tab === "bank") && (CURTAB !== "bank"); // 新进题库页才回到第 1 页
  CURTAB = tab; __tabName = tab; __tabStart = Date.now();
  updateBottomNav(tab);
  __saveScroll();
  const root = $("#app");
  let html = navBar() + `<main class="main">`;
  if(tab === "setup") html += viewSetup();
  else if(tab === "home") html += viewHome();
  else if(tab === "bank") html += viewBank();
  else if(tab === "focus") html += viewFocus();
  else if(tab === "docbank") html += viewDocBank();
  else if(tab === "intro") html += viewIntro();
  else if(tab === "vocab") html += viewVocab();
  else if(tab === "ledger") html += viewLedger();
  html += `</main>`;
  root.innerHTML = html;
  bindCommon();
  if(tab === "bank") renderBankList(freshBank);
  if(tab === "docbank" && dbSearchTerm) dbFilter(dbSearchTerm); // 恢复真题分区搜索过滤
  if(after) after();
  // 保留滚动位置（标记/切页全量重渲染后不跳回顶部）
  try{ window.scrollTo(0, __scrollY); }catch(e){}
}
function __saveScroll(){
  __scrollY = (window.pageYOffset != null ? window.pageYOffset : 0) || document.documentElement.scrollTop || 0;
}
function bindCommon(){
  document.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => render(b.dataset.tab));
  document.querySelectorAll("[data-jump]").forEach(b => {
    b.onclick = () => {
      const go = () => { const el = document.getElementById(b.dataset.anchor); if(el) el.scrollIntoView({behavior:"smooth"}); };
      if(CURTAB === b.dataset.jump) go(); else render(b.dataset.jump, go);
    };
  });
  document.querySelectorAll("[data-act]").forEach(b => b.onclick = () => handle(b.dataset.act, b.dataset.arg));
  document.querySelectorAll(".editable").forEach(el => {
    el.onfocus = () => { el.dataset.orig = el.innerText; };
    el.onblur = () => {
      const txt = el.innerText.trim();
      if(el.dataset.orig != null && txt === el.dataset.orig.trim()) return;
      if(el.dataset.eid){ const q = S.questions.find(x => x.id === el.dataset.eid); if(q){ q[el.dataset.field || "ans"] = txt; save(); } }
      else if(el.dataset.did){ dbUpdate(el.dataset.did, el.dataset.field || "ans", txt); }
      else if(el.dataset.tid){ const t = S.translate.find(x => x.id === el.dataset.tid); if(t){ t[el.dataset.field || "cn"] = txt; save(); } }
    };
  });
}

function catName(c){ return {基础:"中文基础问答",数据结构:"数据结构与算法",计算机组成原理:"计算机组成原理",操作系统:"操作系统",计算机网络:"计算机网络",科研深挖:"科研深挖",深度学习:"深度学习",AI智能体:"AI智能体",项目经历:"项目经历",生物信息:"生物信息",英文:"英文问答",翻译:"文献翻译",词汇翻译:"英文词汇翻译"}[c] || c; }

function flash(msg){ const f = document.createElement("div"); f.className = "flash"; f.textContent = msg; document.body.appendChild(f); setTimeout(() => f.remove(), 1800); }

/* ---------------- 数据备份（导出 / 导入） ---------------- */
function exportData(){
  try{
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pushmian-backup-" + todayStr() + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
    flash("✅ 已导出备份文件");
  }catch(e){ alert("导出失败：" + e.message); }
}
function importData(){
  const fi = $("#importFile");
  if(!fi || !fi.files || !fi.files[0]){ flash("请先选择备份文件"); return; }
  const rd = new FileReader();
  rd.onload = () => {
    try{
      const d = JSON.parse(rd.result);
      if(!d || !Array.isArray(d.questions) || !Array.isArray(d.vocab)){ alert("备份文件格式不正确（缺少 questions/vocab 数组）"); return; }
      if(!confirm("导入将覆盖当前全部数据（含学习进度）。确定继续？建议先导出当前数据作为双重保险。")) return;
      S = d;
      mergeSeeds();
      save();
      fi.value = ""; // 复位，允许连续导入同一文件
      flash("✅ 导入成功");
      render(CURTAB);
    }catch(e){ alert("导入解析失败：" + e.message); }
  };
  rd.readAsText(fi.files[0], "utf-8");
}

/* ---------------- 学习统计：连续打卡 / 今日完成率 ---------------- */
function _dayActive(key){
  const l = S.logs[key]; if(!l) return false;
  const t = (l.timeByTab && Object.keys(l.timeByTab).length) ? true : false;
  const si = l.selfIntro && (l.selfIntro.cn || l.selfIntro.en || l.selfIntro.ppt);
  const note = l.note && l.note.trim();
  return !!(t || si || note);
}
function streakDays(){
  const d = new Date(); let n = 0;
  if(_dayActive(fmtDate(d))){ n++; d.setDate(d.getDate() - 1); }
  while(_dayActive(fmtDate(d))){ n++; d.setDate(d.getDate() - 1); }
  return n;
}
function todaysProgress(){
  const d = getDay();
  const qById = id => S.questions.find(q => q.id === id);
  const si = d.selfIntro || {cn:false,en:false,ppt:false};
  const doneChecks = (si.cn ? 1 : 0) + (si.en ? 1 : 0) + (si.ppt ? 1 : 0);
  const iv = (d.interview || []).map(qById).filter(Boolean);
  const markedIv = iv.filter(q => q.status && q.status !== "未标记").length;
  const rev = (d.plan.review || []).map(qById).filter(Boolean);
  const markedRev = rev.filter(q => q.status && q.status !== "未标记").length;
  const total = 3 + iv.length + (rev.length || 0);
  const done = doneChecks + markedIv + markedRev;
  return { done, total, pct: total ? Math.round(done / total * 100) : 100 };
}

/* ---------------- 行为分发（查表式） ---------------- */
function refreshCurrent(){
  // 题库页：只局部重建列表，保留搜索词/页码/滚动位置；其余板块全量重渲染（含滚动保留）
  if(CURTAB === "bank"){ renderBankList(false); }
  else render(CURTAB);
}
var ACTIONS = {
  mk: function(arg){ var p = arg.split("|"); markQuestion(p[0], p[1]); flash("已标记：" + p[1]); refreshCurrent(); },
  mv: function(arg){ var p = arg.split("|"); markVocab(parseInt(p[0], 10), p[1]); flash("已标记：" + p[1]); refreshCurrent(); },
  fav: function(arg){ toggleFav(arg); refreshCurrent(); },
  toggleMastery: function(){
    S.settings.masteryRetire = !S.settings.masteryRetire;
    if(S.settings.masteryRetire){
      S.questions.forEach(function(q){ if(q.status === "掌握") q.nextReview = ""; });
      S.vocab.forEach(function(v){ if(v.status === "掌握") v.nextReview = ""; });
      save(); flash("已开启「掌握后不再强化」：已掌握题不会再来复习，并清空现有掌握项的排期");
    }else{
      save(); flash("已关闭：掌握后仍会按记忆曲线回来强化复习");
    }
    render(CURTAB);
  },
  spkQ: function(arg){ var q = S.questions.find(function(x){ return x.id === arg; }); if(q) speakZh(q.q + "。" + (q.key || "")); },
  regenDay: function(){
    var old = S.logs[todayStr()] || {}; delete S.logs[todayStr()]; var d = getDay();
    d.note = old.note || ""; d.selfIntro = old.selfIntro || {cn:false,en:false,ppt:false}; d.timeByTab = old.timeByTab || {};
    save(); flash("已重新抽题（打卡与学习时长已保留）"); render("home");
  },
  saveLog: function(){ var d = getDay(); var ta = $("#lognote"); d.note = ta ? ta.value : ""; save(); flash("已保存今日学习日志"); },
  siCheck: function(){ render("intro"); },
  siToggle: function(arg){ var d = getDay(); d.selfIntro = d.selfIntro || {cn:false,en:false,ppt:false}; d.selfIntro[arg] = !d.selfIntro[arg]; save(); render("intro"); },
  saveIntro: function(arg){ var ta = document.querySelector('textarea[data-key="' + arg + '"]'); if(ta){ S.selfIntro[arg] = ta.value; save(); flash("已保存文稿"); } },
  checkIntro: function(arg){ alert(introCoach(arg)); },
  pptSim: function(){ alert(pptSim()); },
  introStart: function(){ introStart(); },
  introPause: function(){ introPause(); },
  introReset: function(){ introReset(); },
  voiceStart: function(){ voiceStart(); },
  voiceStop: function(){ voiceStop(); },
  voiceClear: function(){ voiceClear(); },
  fullInterview: function(){ openFullInterview(); },
  ivNext: function(){ if(!ivState) return; var ta = $("#ivAns"); ivState.answers[ivState.i] = ta ? ta.value : ""; ivState.i++; renderInterview(); },
  ivMarkNo: function(){
    if(!ivState) return; var q = ivState.list[ivState.i]; markQuestion(q.id, "不会"); ivState.marks[q.id] = true;
    var ta = $("#ivAns"); ivState.answers[ivState.i] = ta ? ta.value : ""; ivState.i++; renderInterview();
  },
  ivEnd: function(){ if(ivState){ ivState.i = ivState.list.length; renderInterview(); } },
  ivResMark: function(arg){
    var p = arg.split("|"); markQuestion(p[0], p[1]);
    if(ivState){ if(p[1] === "不会") ivState.marks[p[0]] = true; else delete ivState.marks[p[0]]; renderInterviewResult(); }
    flash("已标记：" + p[1]);
  },
  ivAgain: function(){ openFullInterview(); },
  ivExit: function(){ ivState = null; render("bank"); },
  ivExport: function(){ var txt = interviewReportText(); downloadText("interview-report-" + serDate() + ".txt", txt); flash("已导出评分报告"); },
  bf: function(arg){ filterBank(arg); },
  bankFeed: function(){ bankFeed(); },
  randQ: function(){
    // 根据当前筛选条件随机抽题
    var pool = S.questions.slice();
    if(bankFilterState.cat) pool = pool.filter(function(q){ return q.cat === bankFilterState.cat; });
    if(bankFilterState.st === "收藏") pool = pool.filter(function(q){ return q.fav; });
    else if(bankFilterState.st !== "全部") pool = pool.filter(function(q){ return (q.status || "未标记") === bankFilterState.st; });
    if(!pool.length){ alert("当前筛选条件下没有题目"); return; }
    var q = pool[Math.floor(Math.random() * pool.length)];
    if(q) alert("抽题：\n\n" + q.q + "\n\n【参考】" + (q.ans || "") + "\n\n【加分】" + (q.tip || "") + "\n\n【避坑】" + (q.pit || ""));
  },
  focusQ: function(arg){ var q = S.questions.find(function(x){ return x.id === arg; }); if(q) alert("【" + catName(q.cat) + "】\n\n" + q.q + "\n\n参考：" + (q.ans || "")); },
  litTranslate: function(){ litTranslate(); },
  litDaily: function(){
    var p = S.papers.length ? S.papers[Math.floor(Math.random() * S.papers.length)] : ""; var o = $("#litOut");
    if(o) o.innerHTML = '<div class="docout"><b>今日推荐：</b>' + esc(p) + '<br><span class="muted">建议精读摘要，提炼1句可背诵金句。</span></div>';
  },
  addPaper: function(){ var t = prompt("输入文献标题："); if(t){ S.papers.unshift(t); save(); render("vocab"); } },
  weekly: function(){ weeklyReport(); },
  weeklyExport: function(){ var txt = weeklyReportText(); downloadText("weekly-report-" + serDate() + ".txt", txt); flash("已导出周报"); },
  addRadar: function(){
    var s = prompt("学校/研究所："); if(!s) return;
    S.radar.push({ school:s, college:prompt("学院/系：") || "", major:prompt("专业方向：") || "", type:prompt("通知类型") || "", deadline:prompt("截止时间：") || "", link:"", match:"部分", priority:prompt("优先级(高/中/低)：") || "中", status:"待跟踪", note:"" });
    save(); render("home");
  },
  dbSrc: function(arg){ DOCBANK_SRC = arg; render("docbank"); },
  dbAdd: function(arg){
    var p = arg.split("|"); var s = S.docbank.sources.find(function(x){ return x.id === p[0]; });
    if(!s) return; var secObj = s.sections.find(function(x){ return x.name === p[1]; }); if(!secObj) return;
    var q = prompt("输入新题目：");
    if(q && q.trim().length >= 4){ secObj.items.push({ id:"u" + Math.random().toString(36).slice(2,9), q:q.trim(), ans:"（待补充：点击答案处直接编辑）", status:"未标记" }); save(); render("docbank"); }
    else if(q && q.trim()){ flash("题目至少 4 个字"); }
  },
  dbDel: function(arg){
    if(!confirm("确定删除该题？")) return;
    S.docbank.sources.forEach(function(s){ s.sections.forEach(function(sec){
      var i = sec.items.findIndex(function(x){ return x.id === arg; });
      if(i >= 0){ sec.items.splice(i, 1); save(); render("docbank"); }
    }); });
  },
  dbmk: function(arg){ var p = arg.split("|"); dbMark(p[0], p[1]); flash("已标记：" + p[1]); render(CURTAB); },
  vmk: function(arg){ var p = arg.split("|"); markVocab(parseInt(p[0], 10), p[1]); flash("已标记：" + p[1]); render(CURTAB); },
  trmk: function(arg){
    var p = arg.split("|"); var t = S.translate.find(function(x){ return x.id === p[0]; });
    if(t){ t.status = p[1]; if(p[1] === "掌握") t.nextReview = ""; else t.nextReview = addDays(todayStr(), 1); save(); }
    flash("已标记：" + p[1]); render(CURTAB);
  },
  wbRem: function(arg){ wordBankRemove(arg); render(CURTAB); },
  focusReview: function(){ render("focus"); },
  showImport: function(){ showImport(); },
  doImport: function(){ doImport(); },
  cancelImport: function(){ render("bank"); },
  exportData: function(){ exportData(); },
  copyQans: function(arg){ var q = S.questions.find(function(x){ return x.id === arg; }); if(q) copyText(q.q + "\n\n" + (q.ans || "")); },
  saveIvComp: function(){
    document.querySelectorAll("[data-ivc]").forEach(function(inp){
      var c = inp.dataset.ivc, v = parseInt(inp.value, 10);
      if(!isNaN(v) && v >= 0 && v <= 20) S.settings.ivComp[c] = v;
    });
    save(); flash("✅ 已保存全真面试配比"); render(CURTAB);
  },
  ivReset: function(){ S.settings.ivComp = Object.assign({}, IV_COMP_DEFAULT); save(); flash("已恢复默认配比"); render(CURTAB); },
  importData: function(){ var fi = $("#importFile"); if(fi) fi.click(); },
  wordBankPractice: function(){ wordBankPractice(); },
  home: function(){ render("home"); },
  saveSetup: function(){
    S.profile.name = ($("#setupName") || {}).value || "";
    S.profile.school = ($("#setupSchool") || {}).value || "";
    S.profile.major = ($("#setupMajor") || {}).value || "";
    S.profile.gpa = ($("#setupGpa") || {}).value || "";
    S.profile.rank = ($("#setupRank") || {}).value || "";
    S.profile.locked = true; save(); flash("✅ 个人信息已保存"); render("home");
  },
  skipSetup: function(){ S.profile.locked = true; save(); render("home"); }
};
function handle(act, arg){
  var fn = ACTIONS[act];
  if(fn) fn(arg);
}

function serDate(){ return todayStr(); }

/* ---------------- 启动 ---------------- */
function startup(){
  init();
  // 节奏管理：连续两天未完成任务 → 下调强度
  const y1 = addDays(todayStr(), -1), y2 = addDays(todayStr(), -2);
  const done1 = S.logs[y1] && S.logs[y1].selfIntro && (S.logs[y1].selfIntro.cn || S.logs[y1].selfIntro.en || S.logs[y1].selfIntro.ppt);
  const done2 = S.logs[y2] && S.logs[y2].selfIntro && (S.logs[y2].selfIntro.cn || S.logs[y2].selfIntro.en || S.logs[y2].selfIntro.ppt);
  S.settings.intensity = (!done1 && !done2) ? "low" : "normal";
  save();
  getDay(); // 确保今日数据生成
  window.addEventListener("beforeunload", () => { try{ flushTabTime(__tabName, __tabStart); flushNow(); }catch(e){} });
  // 预载 TTS 语音列表
  if(window.speechSynthesis){ try{ window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices(); }catch(e){} }
  createBottomNav();
  // 首次使用：profile 未填写 → 先显示设置表单
  if(!S.profile.locked){
    render("setup");
  } else {
    render("home");
  }
}