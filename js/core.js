/* ============================================================
   推免助手 PushMian Buddy — 核心模块（状态/工具/持久化/渲染/事件分发）
   ============================================================ */
const STORE_KEY = "pmb_state_v1";
const INTERVALS = [1, 3, 7, 15, 30]; // SM-2 复习间隔（天）：不会/模糊 从最短间隔起步，掌握后仍会延长间隔反复强化
/* 全真面试各分类题量配比（可在题库页「全真模拟设置」中调节） */
const IV_COMP_CATS = ["基础","数据结构","计算机组成原理","操作系统","计算机网络","深度学习","AI智能体","项目经历","生物信息","英文","科研深挖","翻译"];
const IV_COMP_DEFAULT = { 基础:3, 数据结构:1, 计算机组成原理:1, 操作系统:1, 计算机网络:1, 深度学习:2, AI智能体:0, 项目经历:1, 生物信息:0, 英文:5, 科研深挖:5, 翻译:2 };
function getIvComp(){ return IV_COMP_CATS.reduce((o,c) => { o[c] = Math.max(0, (S.settings.ivComp[c]) | 0); return o; }, {}); }
const CONTENT_VER = 13;

/* —— 本地日期（修复旧版 toISOString 的 UTC 时区错位）—— */
function fmtDate(d){ return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function todayStr(){ return fmtDate(new Date()); }
function addDays(d, n){ const x = new Date(d + "T00:00:00"); x.setDate(x.getDate() + n); return fmtDate(x); }
function daysBetween(a, b){ return Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000); }

let S = null;          // 全局状态
let CURTAB = "home";   // 当前模块（标记后原地刷新用）
let DOCBANK_SRC = null; // 真题分区：当前文档
let SETUP_RETURN = null; // 从台账编辑资料时的返回栏目
let __tabName = "home", __tabStart = Date.now(); // 各板块学习计时
const __scrollByTab = Object.create(null);         // 各栏目独立保存滚动位置

/* ---------------- 工具 ---------------- */
function $(sel, root){ return (root || document).querySelector(sel); }
function esc(s){ return (s==null?"":String(s)).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function attr(s){ return esc(s); }
const SAFE_STATUSES = new Set(["未标记","掌握","模糊","不会"]);
const SAFE_CATS = new Set(["基础","数据结构","计算机组成原理","操作系统","计算机网络","深度学习","AI智能体","项目经历","生物信息","英文","科研深挖","翻译","词汇翻译"]);
function safeStatus(s){ return SAFE_STATUSES.has(s) ? s : "未标记"; }
function isPlainObject(o){ return !!o && typeof o === "object" && !Array.isArray(o) && (Object.getPrototypeOf(o) === Object.prototype || Object.getPrototypeOf(o) === null); }
function cleanStr(v, name, max, required){
  if(v == null) v = "";
  if(typeof v !== "string") throw new Error(name + " 必须是文本");
  if(required && !v.trim()) throw new Error(name + " 不能为空");
  if(v.length > max) throw new Error(name + " 超过长度限制 " + max);
  return v;
}
function cleanId(v, name){
  const s = cleanStr(v, name, 120, true);
  if(!/^[A-Za-z0-9._:-]+$/.test(s)) throw new Error(name + " 含非法字符");
  return s;
}
function cleanReviewDate(v, name){
  const s = cleanStr(v, name, 10, false);
  if(s && !/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new Error(name + " 日期格式应为 YYYY-MM-DD");
  return s;
}
function ownMap(o){
  const out = {};
  if(!isPlainObject(o)) return out;
  Object.keys(o).forEach(k => { if(Object.prototype.hasOwnProperty.call(o, k)) out[k] = o[k]; });
  return out;
}

/* ---- 备份白名单校验与归一化：未知字段丢弃，非法字段拒绝整次导入 ---- */
const IMPORT_MAX_BYTES = 8 * 1024 * 1024;
function normalizeBackup(d){
  if(!isPlainObject(d)) throw new Error("备份根节点必须是对象");
  if(!Array.isArray(d.questions) || !Array.isArray(d.vocab)) throw new Error("缺少 questions/vocab 数组");
  if(d.questions.length > 10000) throw new Error("questions 数量超过 10000");
  if(d.vocab.length > 5000) throw new Error("vocab 数量超过 5000");
  const seenQ = new Set();
  const questions = d.questions.map((q, i) => {
    if(!isPlainObject(q)) throw new Error("questions[" + i + "] 不是对象");
    const id = cleanId(q.id, "questions[" + i + "].id");
    if(seenQ.has(id)) throw new Error("题目 id 重复：" + id); seenQ.add(id);
    const cat = cleanStr(q.cat, "questions[" + i + "].cat", 30, true);
    if(!SAFE_CATS.has(cat)) throw new Error("不支持的题目分类：" + cat);
    const edits = ownMap(q._userEdits);
    return {
      id, cat,
      q: cleanStr(q.q, "questions[" + i + "].q", 20000, true),
      ans: cleanStr(q.ans, "questions[" + i + "].ans", 120000, false),
      key: cleanStr(q.key, "questions[" + i + "].key", 10000, false),
      tip: cleanStr(q.tip, "questions[" + i + "].tip", 10000, false),
      pit: cleanStr(q.pit, "questions[" + i + "].pit", 10000, false),
      extra: cleanStr(q.extra, "questions[" + i + "].extra", 20000, false),
      src: cleanStr(q.src, "questions[" + i + "].src", 1000, false),
      status: safeStatus(q.status),
      reviewStage: Math.max(0, Math.min(INTERVALS.length - 1, Number(q.reviewStage) || 0)),
      nextReview: cleanReviewDate(q.nextReview, "questions[" + i + "].nextReview"),
      fav: q.fav === true,
      _userEdits: { q:edits.q === true, ans:edits.ans === true, key:edits.key === true }
    };
  });
  const seenTerms = new Set();
  const vocab = d.vocab.map((v, i) => {
    if(!isPlainObject(v)) throw new Error("vocab[" + i + "] 不是对象");
    const term = cleanStr(v.term, "vocab[" + i + "].term", 500, true);
    const tk = term.toLowerCase(); if(seenTerms.has(tk)) throw new Error("词汇重复：" + term); seenTerms.add(tk);
    return { term, en:cleanStr(v.en,"vocab.en",2000,false), def:cleanStr(v.def,"vocab.def",10000,false), ex:cleanStr(v.ex,"vocab.ex",20000,false), syn:cleanStr(v.syn,"vocab.syn",5000,false), status:safeStatus(v.status), reviewStage:Math.max(0,Math.min(INTERVALS.length-1,Number(v.reviewStage)||0)), nextReview:cleanReviewDate(v.nextReview,"vocab.nextReview") };
  });
  const profileSrc = isPlainObject(d.profile) ? d.profile : (typeof PROFILE === "object" ? PROFILE : {});
  const profile = {};
  ["name","school","major","gpa","rank","target"].forEach(k => profile[k] = cleanStr(profileSrc[k], "profile."+k, 2000, false));
  profile.locked = profileSrc.locked === true;
  const introSrc = isPlainObject(d.selfIntro) ? d.selfIntro : (typeof SELF_INTRO === "object" ? SELF_INTRO : {});
  const selfIntro = {};
  ["cn_short","en_short","ppt_full"].forEach(k => selfIntro[k] = cleanStr(introSrc[k], "selfIntro."+k, 120000, false));
  const radarInput = Array.isArray(d.radar) ? d.radar : JSON.parse(JSON.stringify(typeof SEED_RADAR !== "undefined" ? SEED_RADAR : []));
  const radar = radarInput.slice(0, 1000).map((r,i) => {
    if(!isPlainObject(r)) throw new Error("radar["+i+"] 不是对象");
    const o = {}; ["school","college","major","type","deadline","link","match","status","note"].forEach(k => o[k] = cleanStr(r[k],"radar."+k,k === "note" ? 10000 : 2000,false));
    o.priority = ["高","中","低"].includes(r.priority) ? r.priority : "中"; return o;
  });
  const translateInput = Array.isArray(d.translate) ? d.translate : JSON.parse(JSON.stringify(typeof SEED_TRANSLATE !== "undefined" ? SEED_TRANSLATE : []));
  const seenTranslate = new Set();
  const translate = translateInput.slice(0, 5000).map((t,i) => {
    if(!isPlainObject(t)) throw new Error("translate["+i+"] 不是对象");
    const id=cleanId(t.id,"translate.id"); if(seenTranslate.has(id)) throw new Error("翻译 id 重复："+id); seenTranslate.add(id);
    return { id, en:cleanStr(t.en,"translate.en",30000,true), cn:cleanStr(t.cn,"translate.cn",30000,false), status:safeStatus(t.status), nextReview:cleanReviewDate(t.nextReview,"translate.nextReview") };
  });
  const papersInput = Array.isArray(d.papers) ? d.papers : JSON.parse(JSON.stringify(typeof DAILY_PAPERS !== "undefined" ? DAILY_PAPERS : []));
  const papers = papersInput.slice(0, 2000).map((p,i) => cleanStr(p,"papers["+i+"]",10000,false));
  const wordBank = Array.isArray(d.wordBank) ? d.wordBank.slice(0, 5000).map((w,i) => {
    if(!isPlainObject(w)) throw new Error("wordBank["+i+"] 不是对象");
    return { word:cleanStr(w.word,"wordBank.word",500,true), raw:cleanStr(w.raw,"wordBank.raw",500,false), zh:cleanStr(w.zh,"wordBank.zh",5000,false), ctx:cleanStr(w.ctx,"wordBank.ctx",30000,false), addedAt:cleanReviewDate(w.addedAt,"wordBank.addedAt"), status:safeStatus(w.status) };
  }) : [];
  let docbank;
  if(d.docbank == null) docbank = JSON.parse(JSON.stringify(SEED_DOCBANK));
  else {
    if(!isPlainObject(d.docbank) || !Array.isArray(d.docbank.sources) || d.docbank.sources.length > 200) throw new Error("docbank.sources 格式不正确");
    const seenDoc = new Set(), seenSource = new Set();
    docbank = { sources:d.docbank.sources.map((s,si) => {
      if(!isPlainObject(s) || !Array.isArray(s.sections) || s.sections.length > 500) throw new Error("docbank source 格式不正确");
      const sid = cleanId(s.id,"docbank.source.id");
      if(seenSource.has(sid)) throw new Error("真题来源 id 重复："+sid); seenSource.add(sid);
      return { id:sid, title:cleanStr(s.title,"docbank.source.title",2000,true), desc:cleanStr(s.desc,"docbank.source.desc",10000,false), sections:s.sections.map((sec,ci) => {
        if(!isPlainObject(sec) || !Array.isArray(sec.items) || sec.items.length > 10000) throw new Error("docbank section 格式不正确");
        return { name:cleanStr(sec.name,"docbank.section.name",2000,true), items:sec.items.map((it,ii) => {
          if(!isPlainObject(it)) throw new Error("docbank item 格式不正确");
          const id = cleanId(it.id,"docbank.item.id"); if(seenDoc.has(id)) throw new Error("真题 id 重复："+id); seenDoc.add(id);
          return { id, q:cleanStr(it.q,"docbank.item.q",20000,true), ans:cleanStr(it.ans,"docbank.item.ans",120000,false), status:safeStatus(it.status), nextReview:cleanReviewDate(it.nextReview,"docbank.item.nextReview") };
        }) };
      }) };
    }) };
  }
  const logs = {};
  if(d.logs != null && !isPlainObject(d.logs)) throw new Error("logs 必须是对象");
  Object.keys(d.logs || {}).slice(0, 5000).forEach(date => {
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("日志日期非法："+date);
    const l = d.logs[date]; if(!isPlainObject(l)) throw new Error("日志 "+date+" 格式不正确");
    const ids = a => Array.isArray(a) ? a.slice(0,10000).map((x,i) => cleanId(x,"日志题目 id")) : [];
    const plan = isPlainObject(l.plan) ? l.plan : {};
    const si = isPlainObject(l.selfIntro) ? l.selfIntro : {};
    const done = isPlainObject(l.completed) ? l.completed : {};
    const boolMap = o => { const r={}; Object.keys(ownMap(o)).slice(0,10000).forEach(k => { cleanId(k,"完成记录 id"); if(o[k] === true) r[k]=true; }); return r; };
    const timeByTab = {}; Object.keys(ownMap(l.timeByTab)).forEach(k => { const n=Number(l.timeByTab[k]); if(Number.isFinite(n) && n >= 0) timeByTab[k]=Math.min(n,31536000); });
    logs[date] = { date, interview:ids(l.interview), plan:{ newInterview:ids(plan.newInterview), review:ids(plan.review), consolidate:ids(plan.consolidate), newVocab:cleanStr(plan.newVocab,"日志词汇",2000,false), paper:cleanStr(plan.paper,"日志文献",10000,false) }, selfIntro:{cn:si.cn===true,en:si.en===true,ppt:si.ppt===true}, weak:ids(l.weak), note:cleanStr(l.note,"日志备注",30000,false), timeByTab, completed:{interview:boolMap(done.interview),review:boolMap(done.review)} };
  });
  const settingsSrc = isPlainObject(d.settings) ? d.settings : {};
  const ivComp = {}; IV_COMP_CATS.forEach(c => { const n=Number(ownMap(settingsSrc.ivComp)[c]); ivComp[c]=Number.isFinite(n)?Math.max(0,Math.min(20,Math.floor(n))):IV_COMP_DEFAULT[c]; });
  const settings = { streak:Math.max(0,Number(settingsSrc.streak)||0), lastActive:cleanStr(settingsSrc.lastActive,"settings.lastActive",20,false), intensity:settingsSrc.intensity === "low" ? "low" : "normal", totalPractice:Math.max(0,Number(settingsSrc.totalPractice)||0), masteryRetire:settingsSrc.masteryRetire===true, ivComp };
  return { profile, selfIntro, questions, vocab, radar, docbank, translate, papers, wordBank, logs, settings, contentVersion:Number(d.contentVersion)||0 };
}
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
const Q_DELTA_KEYS = ["q","ans","key","tip","pit","extra","cat","status","reviewStage","nextReview","fav","_userEdits"];
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
  const inferred = Object.assign({}, q._userEdits || {});
  ["q","ans","key"].forEach(k => { if(q[k] !== base[k] && q[k] !== undefined) inferred[k] = true; });
  if(Object.keys(inferred).some(k => inferred[k])) d._userEdits = inferred;
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
    if(c){
      o._userEdits = Object.assign({}, o._userEdits || {});
      ["q","ans","key"].forEach(k => { if(c[k] !== undefined && c[k] !== s[k]) o._userEdits[k] = true; });
    }
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
  }catch(e){ flash("保存失败：可能是数据过大超出浏览器存储限制（"+e.name+"）。请先导出备份并减少内容。", "err"); }
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
    // 非破坏性升级：旧状态无法可靠区分“旧种子答案”和“用户编辑”，因此只补空字段。
    // 新版本开始由 _userEdits 显式记录编辑；任何用户覆盖字段都绝不被内容升级覆盖。
    S.questions.forEach(q => { if(ansMap[q.id] != null && !q.ans && !(q._userEdits && q._userEdits.ans)) q.ans = ansMap[q.id]; });
    const vMap = {};
    [...SEED_VOCAB, ...SEED_VOCAB_TB].forEach(v => { if(v.term) vMap[v.term] = v; });
    S.vocab.forEach(v => { const nv = vMap[v.term]; if(nv){ if(!v.en) v.en = nv.en; if(!v.def) v.def = nv.def; if(!v.ex) v.ex = nv.ex; if(!v.syn) v.syn = nv.syn; } });
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
  const quota = n => S.settings.intensity === "low" ? (n > 1 ? Math.ceil(n / 2) : 0) : n;
  const interview = [].concat(
    pick(byCat("基础"), quota(2), ["模糊","不会"]),
    pick(byCat("数据结构"), quota(2), ["模糊","不会"]),
    pick(byCat("计算机组成原理"), quota(1), ["模糊","不会"]),
    pick(byCat("操作系统"), quota(1), ["模糊","不会"]),
    pick(byCat("计算机网络"), quota(2), ["模糊","不会"]),
    pick(byCat("深度学习"), quota(1), ["模糊","不会"]),
    pick(byCat("项目经历"), quota(1), ["模糊","不会"]),
    pick(byCat("AI智能体"), quota(1), ["模糊","不会"]),
    pick(byCat("科研深挖"), quota(2), ["模糊","不会"]),
    pick(byCat("英文"), quota(3), ["模糊","不会"]),
    pick(byCat("翻译"), quota(1), ["模糊","不会"])
  );
  const seen = new Set(); const uniq = []; interview.forEach(id => { if(!seen.has(id)){ seen.add(id); uniq.push(id); } });
  const review = dueReview().map(x => x.id).slice(0, S.settings.intensity === "low" ? 4 : 8);
  const cons = shuffle(S.questions.filter(x => x.status === "掌握")).slice(0, S.settings.intensity === "low" ? 1 : 3).map(x => x.id);
  const newVocab = S.vocab.length ? S.vocab[Math.floor(Math.random() * S.vocab.length)].term : "（词汇）";
  const paper = S.papers.length ? S.papers[Math.floor(Math.random() * S.papers.length)] : "";
  S.logs[t] = {
    date: t, interview: uniq,
    plan: { newInterview: uniq, review, consolidate: cons, newVocab, paper },
    selfIntro: { cn:false, en:false, ppt:false },
    weak: [], note: "", completed: { interview:{}, review:{} }
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
  // 每日完成度记录“今天执行过标记”这一事件，不能直接复用跨天的全局掌握状态。
  const day = S.logs[t] || genDay(t);
  day.completed = day.completed || { interview:{}, review:{} };
  day.completed.interview = day.completed.interview || {};
  day.completed.review = day.completed.review || {};
  if((day.interview || []).includes(id)) day.completed.interview[id] = true;
  if(day.plan && (day.plan.review || []).includes(id)) day.completed.review[id] = true;
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
function navBar(active){
  const links = TABS.map(([k,l]) => `<button class="navbtn${active === k ? " on" : ""}" data-tab="${k}"${active === k ? ' aria-current="page"' : ""}>${l}</button>`).join("");
  return `<nav class="nav" aria-label="主导航"><div class="navinner">
    <div class="navbrand"><span class="brandtitle">推免工作台</span><span class="brandmeta">2026 备考档案</span></div>
    <div class="navlinks">${links}</div>
  </div></nav>`;
}
function createBottomNav(){
  if(document.getElementById("bottomnav")) return;
  const el = document.createElement("nav");
  el.id = "bottomnav"; el.className = "bottomnav";
  el.setAttribute("aria-label", "移动端导航");
  el.innerHTML = BN_TABS.map(([k,lb]) => `<button data-tab="${k}" id="bn-${k}"><span>${lb}</span></button>`).join("");
  document.body.appendChild(el);
}
function updateBottomNav(tab){
  const ns = document.querySelectorAll("#bottomnav button");
  if(ns.length) ns.forEach(b => {
    const active = b.dataset.tab === tab;
    b.classList.toggle("on", active);
    if(active) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
  });
}
function validTab(tab){ return TABS.some(([key]) => key === tab); }
function tabFromLocation(){
  const tab = String(location.hash || "").replace(/^#/, "");
  return validTab(tab) ? tab : "home";
}
function syncTabRoute(tab, replace){
  if(!validTab(tab)) return;
  const hash = "#" + tab;
  if(location.hash === hash) return;
  const method = replace ? "replaceState" : "pushState";
  history[method]({ tab }, "", hash);
}
function captureVisibleDrafts(){
  const active = document.activeElement;
  if(active && active.classList && active.classList.contains("editable")) active.blur();
  const note = $("#lognote");
  if(note && S){ getDay().note = note.value; save(); }
  document.querySelectorAll("textarea[data-key]").forEach(el => {
    if(S && S.selfIntro && el.dataset.key) S.selfIntro[el.dataset.key] = el.value;
  });
  const answer = $("#ivAns");
  if(answer && ivState && ivState.i < ivState.list.length) ivState.answers[ivState.i] = answer.value;
}
function render(tab, after, opts){
  const o = opts || {};
  tab = tab || "home";
  if(tab !== "setup" && !validTab(tab)) tab = "home";
  const previousTab = CURTAB;
  captureVisibleDrafts();
  const modal = currentModal();
  if(modal) closeModal(modal);
  document.querySelectorAll(".wordpop:not(.gmodal)").forEach(pop => { pop.style.display = "none"; });
  if(previousTab === "intro" && tab !== "intro"){
    if(recog) voiceStop();
    if(introTimer){ clearInterval(introTimer); introTimer = null; }
  }
  if(previousTab !== tab && window.speechSynthesis) try{ window.speechSynthesis.cancel(); }catch(e){}
  __scrollByTab[previousTab] = (window.pageYOffset != null ? window.pageYOffset : 0) || document.documentElement.scrollTop || 0;
  flushTabTime(__tabName, __tabStart);
  const freshBank = (tab === "bank") && (CURTAB !== "bank"); // 新进题库页才回到第 1 页
  CURTAB = tab; __tabName = tab; __tabStart = Date.now();
  if(tab !== "setup" && !o.fromHistory) syncTabRoute(tab, o.replaceRoute === true);
  updateBottomNav(tab);
  const root = $("#app");
  let html = navBar(tab) + `<main class="main" id="mainContent" tabindex="-1">`;
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
  if(tab === "intro") document.querySelectorAll("textarea[data-key]").forEach(introStat);
  if(tab === "bank") renderBankList(freshBank);
  if(tab === "docbank" && dbSearchTerm) dbFilter(dbSearchTerm); // 恢复真题分区搜索过滤
  const changed = previousTab !== tab;
  const targetY = __scrollByTab[tab] || 0;
  document.title = (tab === "setup" ? "初始设置" : (TAB_LABELS[tab] || "推免工作台")) + " · PushMian Buddy";
  requestAnimationFrame(() => {
    try{ window.scrollTo(0, targetY); }catch(e){}
    if(after) after();
    if(changed && o.focusMain !== false){
      const main = $("#mainContent");
      if(main) try{ main.focus({ preventScroll:true }); }catch(e){ main.focus(); }
    }
  });
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
  const note = $("#lognote");
  if(note) note.addEventListener("input", () => { getDay().note = note.value; save(); });
  const answer = $("#ivAns");
  if(answer) answer.addEventListener("input", () => { if(ivState && ivState.i < ivState.list.length) ivState.answers[ivState.i] = answer.value; });
  document.querySelectorAll("textarea[data-key]").forEach(el => {
    el.addEventListener("input", () => { if(S.selfIntro && el.dataset.key){ S.selfIntro[el.dataset.key] = el.value; save(); } });
  });
  document.querySelectorAll(".editable").forEach(el => {
    el.setAttribute("role", "textbox");
    el.setAttribute("aria-multiline", "true");
    if(!el.hasAttribute("aria-label")){
      const field = el.dataset.field || "ans";
      el.setAttribute("aria-label", field === "q" ? "编辑题目" : field === "key" ? "编辑关键词" : field === "cn" ? "编辑参考译文" : "编辑参考答案");
    }
    el.onfocus = () => { el.dataset.orig = el.innerText; };
    el.onblur = () => {
      const txt = el.innerText.trim();
      if(el.dataset.orig != null && txt === el.dataset.orig.trim()) return;
      if(el.dataset.eid){ const q = S.questions.find(x => x.id === el.dataset.eid); if(q){ const field = el.dataset.field || "ans"; q[field] = txt; q._userEdits = q._userEdits || {}; q._userEdits[field] = true; save(); } }
      else if(el.dataset.did){ dbUpdate(el.dataset.did, el.dataset.field || "ans", txt); }
      else if(el.dataset.tid){ const t = S.translate.find(x => x.id === el.dataset.tid); if(t){ t[el.dataset.field || "cn"] = txt; save(); } }
    };
  });
}

function catName(c){ return {基础:"中文基础问答",数据结构:"数据结构与算法",计算机组成原理:"计算机组成原理",操作系统:"操作系统",计算机网络:"计算机网络",科研深挖:"科研深挖",深度学习:"深度学习",AI智能体:"AI智能体",项目经历:"项目经历",生物信息:"生物信息",英文:"英文问答",翻译:"文献翻译",词汇翻译:"英文词汇翻译"}[c] || "其他"; }

let __flashT = null;
function flash(msg, type){
  const f = document.createElement("div");
  f.className = "flash" + (type ? " flash-" + type : "");
  f.setAttribute("role", type === "err" ? "alert" : "status");
  f.setAttribute("aria-live", type === "err" ? "assertive" : "polite");
  f.textContent = msg;
  const old = document.querySelector(".flash");
  if(old) old.remove();
  document.body.appendChild(f);
  clearTimeout(__flashT);
  __flashT = setTimeout(() => { f.remove(); __flashT = null; }, 2600);
}

/* ---------------- 页内弹层（替代 alert/prompt/confirm） ----------------
   复用 .wordpop 样式体系，新增 data-mact 事件委托（不污染 onclick）。
   openModal(title, bodyHtml, opts) 返回弹层节点 pp：
     opts.foot   → 底部按钮 HTML（可选）
     opts.closable → 是否显示右上角关闭（默认 true）
   通过 pp 节点上的 _onOk/_onCancel 由 app.js 的 data-mact 委托触发。 */
function openModal(title, bodyHtml, opts){
  const o = opts || {};
  const titleId = "modal_title_" + uid();
  const foot = o.foot ? `<div class="mfoot_btns">${o.foot}</div>` : "";
  const shell = document.createElement("div");
  shell.className = "modalbackdrop";
  const pop = document.createElement("div");
  pop.className = "wordpop gmodal";
  pop.style.display = "block";
  pop.tabIndex = -1;
  pop.setAttribute("role", "dialog");
  pop.setAttribute("aria-modal", "true");
  pop.setAttribute("aria-labelledby", titleId);
  pop.innerHTML = (o.closable === false ? "" : '<div class="wphd gclose"><button class="modalclose" data-mact="close" aria-label="关闭弹窗">✕</button></div>')
    + `<div class="wphd"><span class="wpword" id="${titleId}">${esc(title)}</span></div>`
    + `<div class="wpbody" style="max-height:52vh;overflow-y:auto">${bodyHtml}</div>${foot}`;
pop._closable = o.closable !== false;
  pop._returnFocus = document.activeElement;
  shell.appendChild(pop);
  document.body.appendChild(shell);
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => {
    const target = pop.querySelector("[autofocus], input:not([disabled]), textarea:not([disabled]), select:not([disabled])")
      || pop.querySelector("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])");
    (target || pop).focus();
  });
  return pop;
}
function closeModal(pop){
  if(!pop) pop = currentModal();
  if(pop){
    const returnFocus = pop._returnFocus;
    if(pop._onClose){ const fn = pop._onClose; pop._onClose = null; fn(); }
    const shell = pop.closest(".modalbackdrop");
    (shell || pop).remove();
    if(!currentModal()) document.body.classList.remove("modal-open");
    if(returnFocus && document.contains(returnFocus)) returnFocus.focus();
  }
}
function currentModal(){ return document.querySelector(".gmodal"); }
/* 输入型弹层：opts={title, placeholder, initial}，onOk(v) */
function promptModal(opts, onOk, onCancel){
  const id = "pm_" + uid();
  const body = `<input id="${id}" class="search" style="width:100%;box-sizing:border-box" placeholder="${esc(opts.placeholder || "")}" value="${esc(opts.initial || "")}" autofocus/>`;
  const pop = openModal(opts.title, body, {
    foot: `<button class="btn" data-mact="ok" data-for="${id}">确定</button><button class="btn sm alt" data-mact="cancel">取消</button>`,
    closable: true
  });
  const inp = document.getElementById(id);
  if(inp){ inp.focus(); inp.select(); }
  pop._onOk = () => { const v = (document.getElementById(id) || {}).value || ""; closeModal(); if(onOk) onOk(v); };
  pop._onCancel = () => { closeModal(); if(onCancel) onCancel(); };
  return pop;
}
/* 确认弹层：onOk() / onCancel() */
function confirmModal(message, opts, onOk, onCancel){
  const o = opts || {};
  const pop = openModal(o.title || "请确认", `<p class="muted" style="margin:2px 0">${esc(message)}</p>`, {
    foot: `<button class="btn" data-mact="gold">确定</button><button class="btn sm alt" data-mact="cancel">取消</button>`,
    closable: o.closable !== false
  });
  pop._onOk = () => { closeModal(); if(onOk) onOk(); };
  pop._onCancel = () => { closeModal(); if(onCancel) onCancel(); };
  return pop;
}

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
  }catch(e){ flash("导出失败：" + e.message, "err"); }
}
function importData(){
  const fi = $("#importFile");
  if(!fi || !fi.files || !fi.files[0]){ flash("请先选择备份文件"); return; }
  if(fi.files[0].size > IMPORT_MAX_BYTES){ flash("备份文件超过 8MB，已拒绝导入", "err"); fi.value = ""; return; }
  const rd = new FileReader();
  rd.onload = () => {
    try{
      const d = normalizeBackup(JSON.parse(rd.result));
      confirmModal("导入将覆盖当前全部数据（含学习进度）。建议先导出当前数据作为双重保险。确定继续吗？", { title: "导入备份" }, function(){
        S = d;
        mergeSeeds();
        flushNow();
        fi.value = ""; // 复位，允许连续导入同一文件
        flash("导入成功", "ok");
        render(CURTAB);
      });
    }catch(e){ fi.value = ""; flash("导入校验失败：" + e.message, "err"); }
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
  const si = d.selfIntro || {cn:false,en:false,ppt:false};
  const doneChecks = (si.cn ? 1 : 0) + (si.en ? 1 : 0) + (si.ppt ? 1 : 0);
  const completed = d.completed || { interview:{}, review:{} };
  const iv = d.interview || [];
  const rev = (d.plan && d.plan.review) || [];
  const markedIv = iv.filter(id => completed.interview && completed.interview[id]).length;
  const markedRev = rev.filter(id => completed.review && completed.review[id]).length;
  const total = 3 + iv.length + rev.length;
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
    confirmModal("将重新抽取今日全部面试题并替换当前队列（已完成的打卡与学习时长会保留）。确定继续吗？", { title: "重新抽题模拟面试" }, function(){
      var old = S.logs[todayStr()] || {}; delete S.logs[todayStr()]; var d = getDay();
      d.note = old.note || ""; d.selfIntro = old.selfIntro || {cn:false,en:false,ppt:false}; d.timeByTab = old.timeByTab || {};
      save(); flash("已重新抽题（打卡与学习时长已保留）");
      render("home", function(){
        var el = document.getElementById("todayIvSec");
        if(el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  },
  saveLog: function(){ var d = getDay(); var ta = $("#lognote"); d.note = ta ? ta.value : ""; save(); flash("已保存今日学习日志"); },
  siCheck: function(){ render("intro"); },
  siToggle: function(arg){ var d = getDay(); d.selfIntro = d.selfIntro || {cn:false,en:false,ppt:false}; d.selfIntro[arg] = !d.selfIntro[arg]; save(); render("intro"); },
  saveIntro: function(arg){ var ta = document.querySelector('textarea[data-key="' + arg + '"]'); if(ta){ S.selfIntro[arg] = ta.value; save(); flash("已保存文稿"); } },
  checkIntro: function(arg){ openModal("背诵检查", "<pre class='coach'>" + esc(introCoach(arg)) + "</pre>", { foot: `<button class="btn" data-mact="close">开始口述（关闭弹窗后即可跟随）</button>` }); },
  pptSim: function(){ openModal("PPT 完整版模拟汇报 · 评委模式", "<pre class='coach'>" + esc(pptSim()) + "</pre>", { foot: `<button class="btn" data-mact="close">开始讲述</button>` }); },
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
  ivEnd: function(){ if(ivState){ var ta = $("#ivAns"); if(ivState.i < ivState.list.length) ivState.answers[ivState.i] = ta ? ta.value : ""; ivState.i = ivState.list.length; renderInterview(); } },
  ivResMark: function(arg){
    var p = arg.split("|"); markQuestion(p[0], p[1]);
    if(ivState){ if(p[1] === "不会") ivState.marks[p[0]] = true; else delete ivState.marks[p[0]]; renderInterviewResult(); }
    flash("已标记：" + p[1]);
  },
  ivAgain: function(){ ivState = null; openFullInterview(); },
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
    if(!pool.length){ flash("当前筛选条件下没有题目", "warn"); return; }
    var q = pool[Math.floor(Math.random() * pool.length)];
    openModal("随机抽题", `<div class="qq" style="font-size:15px">${esc(q.q)}</div>`
      + (q.ans ? `<div class="ivans" style="margin-top:8px"><span class="lab">参考</span>${mdHtml(q.ans)}</div>` : "")
      + (q.tip ? `<div class="ivans tip"><span class="lab">加分</span>${esc(q.tip)}</div>` : "")
      + (q.pit ? `<div class="ivans pit"><span class="lab">避坑</span>${esc(q.pit)}</div>` : "")
      + (q.key ? `<div class="ivans"><span class="lab">关键词</span>${esc(q.key)}</div>` : ""),
      { foot: `<button class="btn" data-mact="mark" data-id="${attr(q.id)}" data-st="模糊">标模糊</button><button class="btn bad" data-mact="mark" data-id="${attr(q.id)}" data-st="不会">标不会</button><button class="btn sm alt" data-mact="close">关闭</button>` });
  },
  focusQ: function(arg){ var q = S.questions.find(function(x){ return x.id === arg; }); if(q) openModal("待复习 · " + catName(q.cat), `<div class="qq">${esc(q.q)}</div>${q.ans ? `<div class="ivans" style="margin-top:6px"><span class="lab">参考</span>${mdHtml(q.ans)}</div>` : ""}`, { foot: `<button class="btn sm alt" data-mact="close">关闭</button>` }); },
  litTranslate: function(){ litTranslate(); },
  litDaily: function(){
    var p = S.papers.length ? S.papers[Math.floor(Math.random() * S.papers.length)] : ""; var o = $("#litOut");
    if(o) o.innerHTML = '<div class="docout"><b>今日推荐：</b>' + esc(p) + '<br><span class="muted">建议精读摘要，提炼1句可背诵金句。</span></div>';
  },
  addPaper: function(){
    promptModal({ title: "添加文献", placeholder: "输入文献标题", initial: "" }, function(t){
      if(t){ S.papers.unshift(t); save(); render("vocab"); flash("已添加文献", "ok"); }
    });
  },
  weekly: function(){ weeklyReport(); },
  weeklyExport: function(){ var txt = weeklyReportText(); downloadText("weekly-report-" + serDate() + ".txt", txt); flash("已导出周报", "ok"); },
  addRadar: function(){
    var staged = { school:"", college:"", major:"", type:"", deadline:"", link:"", match:"部分", status:"待跟踪", note:"" };
    var FIELDS = [ ["school","学校/研究所","学校或研究所名称"], ["college","学院/系","可留空"], ["major","专业方向","可留空"], ["type","通知类型","如：夏令营 / 预推免"], ["deadline","截止时间","如 2026-09-30"] ];
    var fi = 0;
    window.__radarStaged = staged;
    function cleanup(){ delete window.__radarStaged; delete window.__radarFinish; }
    function cancelWizard(){ cleanup(); flash("已取消新增通知"); }
    function finish(pri){
      if(!staged.school){ flash("未填写学校，已取消", "warn"); return; }
      staged.priority = pri;
      S.radar.push(staged);
      closeModal(); cleanup(); save(); render("home"); flash("已新增通知", "ok");
    }
    window.__radarFinish = finish;
    (function askNext(){
      if(fi >= FIELDS.length){
        var priPop = openModal("设置优先级", "<p class='muted' style='margin:2px 0'>优先级将用于首屏置顶排序</p>", {
          foot: ["高","中","低"].map(function(p){ return `<button class="btn ${p==='高'?'bad':''}" data-mact="radarPri" data-val="${p}">${p}</button>`; }).join(""),
          closable: true
        });
        priPop._onCancel = function(){ closeModal(priPop); cancelWizard(); };
        return;
      }
      var f = FIELDS[fi];
      promptModal({ title: f[1], placeholder: f[2], initial: "" }, function(v){
        staged[f[0]] = v; fi++; askNext();
      }, cancelWizard);
    })();
  },
  radarPri: function(arg){
    if(window.__radarFinish) window.__radarFinish(arg);
  },
  dbSrc: function(arg){ DOCBANK_SRC = arg; render("docbank"); },
  dbAdd: function(arg){
    var p = arg.split("|"); var s = S.docbank.sources.find(function(x){ return x.id === p[0]; });
    if(!s) return; var secName; try{ secName=decodeURIComponent(p.slice(1).join("|")); }catch(e){ return; } var secObj = s.sections.find(function(x){ return x.name === secName; }); if(!secObj) return;
    promptModal({ title: "新增真题题目", placeholder: "输入新题目（至少 4 个字）", initial: "" }, function(q){
      if(q && q.trim().length >= 4){ secObj.items.push({ id:"u" + Math.random().toString(36).slice(2,9), q:q.trim(), ans:"（待补充：点击答案处直接编辑）", status:"未标记" }); save(); render("docbank"); flash("已新增题目", "ok"); }
      else if(q && q.trim()){ flash("题目至少 4 个字", "warn"); }
    });
  },
  dbDel: function(arg){
    confirmModal("确定删除该题？此操作不可恢复。", { title: "删除真题" }, function(){
      S.docbank.sources.forEach(function(s){ s.sections.forEach(function(sec){
        var i = sec.items.findIndex(function(x){ return x.id === arg; });
        if(i >= 0){ sec.items.splice(i, 1); save(); render("docbank"); flash("已删除", "ok"); }
      }); });
    });
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
  vfMode: function(arg){ vfMode(arg); },
  vfWeak: function(){ vfWeak(); },
  vfStart: function(){ vfStart(); },
  vfReveal: function(){ vfReveal(); },
  vfNext: function(){ vfNext(); },
  vfMark: function(arg){ vfMark(arg); },
  trStart: function(){ trStart(); },
  trNext: function(){ trNext(); },
  trReveal: function(){ trReveal(); },
  trMark: function(arg){ trMark(arg); },
  enListenPick: function(){ enListenPick(); },
  enListenSpeak: function(){ enListenSpeak(); },
  home: function(){ render("home"); },
  saveSetup: function(){
    S.profile.name = ($("#setupName") || {}).value || "";
    S.profile.school = ($("#setupSchool") || {}).value || "";
    S.profile.major = ($("#setupMajor") || {}).value || "";
    S.profile.gpa = ($("#setupGpa") || {}).value || "";
    S.profile.rank = ($("#setupRank") || {}).value || "";
    S.profile.target = ($("#setupTarget") || {}).value || "";
    const back = SETUP_RETURN || "home";
    SETUP_RETURN = null;
    S.profile.locked = true; save(); flash("✅ 个人信息已保存"); render(back);
  },
  editProfile: function(){ SETUP_RETURN = CURTAB; render("setup"); },
  cancelSetup: function(){ var back = SETUP_RETURN || "home"; SETUP_RETURN = null; render(back); },
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
  window.addEventListener("beforeunload", () => { try{ captureVisibleDrafts(); flushTabTime(__tabName, __tabStart); flushNow(); }catch(e){} });
  const routeChanged = () => {
    if(!S || !S.profile || !S.profile.locked) return;
    const tab = tabFromLocation();
    if(tab !== CURTAB) render(tab, null, { fromHistory:true });
  };
  window.addEventListener("popstate", routeChanged);
  window.addEventListener("hashchange", routeChanged);
  // 预载 TTS 语音列表
  if(window.speechSynthesis){ try{ window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices(); }catch(e){} }
  createBottomNav();
  // 首次使用：profile 未填写 → 先显示设置表单
  if(!S.profile.locked){
    render("setup");
  } else {
    const initialTab = tabFromLocation();
    syncTabRoute(initialTab, true);
    render(initialTab, null, { fromHistory:true, focusMain:false });
  }
}
