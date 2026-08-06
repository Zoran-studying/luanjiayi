/* ============================================================
   推免助手 PushMian Buddy — 词汇闪卡 / 文献翻译 / 点词查词 / 英语听力
   ============================================================ */

/* ---- 词汇闪卡 ---- */
let vocabFlash = { mode:"en2cn", weakOnly:false, order:[], i:0, revealed:false };
function vfRenderCard(){
  const card = $("#vfCard"); if(!card) return;
  if(!vocabFlash.order.length){ card.innerHTML = '<span class="muted">选好模式后点「开始 / 重洗」</span>'; return; }
  const pool = vfPool();
  const v = pool[vocabFlash.order[vocabFlash.i]];
  if(!v){ card.innerHTML = '<span class="muted">无词汇</span>'; return; }
  let front, back;
  if(vocabFlash.mode === "cn2en"){ front = v.term; back = v.en; }
  else if(vocabFlash.mode === "mixed"){ if(Math.random() < 0.5){ front = v.en; back = v.term; } else { front = v.term; back = v.en; } }
  else { front = v.en; back = v.term; }
  card.innerHTML = `<div class="vffront">${esc(front)}</div>
    <div class="vfback ${vocabFlash.revealed ? '' : 'hidden'}">${vocabFlash.revealed ? esc(back) : '（点「显示答案」查看）'}</div>`;
  const prog = $("#vfProg"); if(prog) prog.textContent = `第 ${vocabFlash.i + 1} / ${vocabFlash.order.length} 张`;
}
function vfMode(m){ vocabFlash.mode = m; flash("模式：" + (m === "en2cn" ? "英→中" : m === "cn2en" ? "中→英" : "混合")); if(vocabFlash.order.length) vfRenderCard(); }
function vfWeak(){ vocabFlash.weakOnly = !vocabFlash.weakOnly; flash( vocabFlash.weakOnly ? "已开启弱项模式（只背不会/模糊）" : "已关闭弱项模式（全部词汇）" ); vfStart(); }
function vfPool(){ return vocabFlash.weakOnly ? S.vocab.filter(v => v.status === "不会" || v.status === "模糊") : S.vocab; }
function vfStart(){ const pool = vfPool(); if(!pool.length){ flash(vocabFlash.weakOnly ? "弱项模式下暂无不会/模糊词汇" : "暂无词汇"); return; } vocabFlash.order = pool.map((v,i) => i); shuffle(vocabFlash.order); vocabFlash.i = 0; vocabFlash.revealed = false; vfRenderCard(); flash("已洗牌，开始背诵"); }
function vfReveal(){ vocabFlash.revealed = true; vfRenderCard(); }
function vfNext(){ if(!vocabFlash.order.length) return; vocabFlash.i = (vocabFlash.i + 1) % vocabFlash.order.length; vocabFlash.revealed = false; vfRenderCard(); }
function vfMark(st){ if(!vocabFlash.order.length) return; const pool = vfPool(); const realIdx = pool[vocabFlash.order[vocabFlash.i]] ? S.vocab.indexOf(pool[vocabFlash.order[vocabFlash.i]]) : -1; if(realIdx >= 0) markVocab(realIdx, st); flash("已标记：" + st); vfNext(); }

/* ---- 文献翻译练习 ---- */
let trFlash = { order:[], i:0, revealed:false };
function trRender(){
  const panel = $("#trPanel"); if(!panel) return;
  if(!trFlash.order.length){ panel.innerHTML = '<span class="muted">点「随机来一题」开始</span>'; return; }
  const t = S.translate[trFlash.order[trFlash.i]];
  if(!t){ panel.innerHTML = '<span class="muted">无题目</span>'; return; }
  panel.innerHTML = `<div class="tren"><span class="lab">英译汉：</span>${wrapWords(esc(t.en))}</div>
    <p class="muted">点击句子中任意单词可查中文释义、近义词/同根词并朗读发音。</p>
    <textarea class="ed" id="trUser" placeholder="在此输入你的中文译文..."></textarea>
    <div class="row">
      <button class="btn" onclick="trReveal()">查看参考译文</button>
      <button class="btn alt" onclick="trNext()">下一题 ➡</button>
      <button class="mini" onclick="trMark('掌握')">掌握</button>
      <button class="mini bad" onclick="trMark('不会')">不会</button>
    </div>
    <div id="trRef" class="trref" style="display:none"><b>参考译文：</b><span class="editable" contenteditable="true" data-tid="${t.id}" data-field="cn">${esc(t.cn)}</span></div>`;
  const prog = $("#trProg"); if(prog) prog.textContent = `第 ${trFlash.i + 1} / ${trFlash.order.length} 题`;
  bindCommon();
}
function trStart(){ trFlash.order = shuffleIdx(S.translate.length); trFlash.i = 0; trFlash.revealed = false; trRender(); }
function trReveal(){ const r = $("#trRef"); if(r) r.style.display = "block"; trFlash.revealed = true; }
function trNext(){ if(!trFlash.order.length) return; trFlash.i = (trFlash.i + 1) % trFlash.order.length; trFlash.revealed = false; trRender(); }
function trMark(st){ if(!trFlash.order.length) return; const t = S.translate[trFlash.order[trFlash.i]]; if(t){ t.status = st; if(st === "掌握") t.nextReview = ""; else t.nextReview = addDays(todayStr(), 1); save(); } flash("已标记：" + st); trNext(); }

/* ---- 点词查词弹窗（文献翻译练习专用） ---- */
let __localDict = null, __dictCache = {};
function buildLocalDict(){
  if(__localDict) return __localDict;
  __localDict = {};
  (S.vocab || []).forEach(v => {
    if(!v.en) return;
    const en = v.en.toLowerCase();
    __localDict[en] = { term:v.term, def:v.def, ex:v.ex };
    en.split(/[^a-z'-]+/).forEach(w => { if(w.length > 2 && !__localDict[w]) __localDict[w] = { term:v.term, def:v.def, ex:v.ex }; });
  });
  return __localDict;
}
function wrapWords(text){
  // 修复：不再用全局变量记录"最后一次渲染的句子"；
  // wordLookup 里通过 closest('.enq,.tren') 取点击词所在的真实句子。
  return text.replace(/([A-Za-z][A-Za-z'-]*)/g, m => '<span class="wword">' + m + '</span>');
}
function zhOf(clean, raw){
  if(typeof CHINESE_GLOSSARY === "object" && CHINESE_GLOSSARY){
    if(CHINESE_GLOSSARY[clean]) return CHINESE_GLOSSARY[clean];
    if(CHINESE_GLOSSARY[raw.toLowerCase()]) return CHINESE_GLOSSARY[raw.toLowerCase()];
  }
  return null;
}

/* ---- 单词·不会 库（永不自动清除，仅手动移除） ---- */
function wordBankAdd(word, raw, ctx){
  if(!S.wordBank) S.wordBank = [];
  if(S.wordBank.some(w => w.word === word)){ flash("已在重点复习中"); refreshWordPopBtn(); return; }
  const zh = zhOf(word, raw) || "";
  S.wordBank.push({ word, raw: raw || word, zh, ctx: ctx || "", addedAt: todayStr(), status:"不会" });
  save();
  flash("已加入重点复习（单词·不会）");
  refreshWordPopBtn();
}
function wordBankRemove(word){
  if(!S.wordBank) return;
  const before = S.wordBank.length;
  S.wordBank = S.wordBank.filter(w => w.word !== word);
  if(S.wordBank.length === before){ flash("不在重点复习中"); return; }
  save();
  flash("✅ 已移出重点复习");
  refreshWordPopBtn();
}
function refreshWordPopBtn(){
  const pop = document.getElementById("wordPop");
  if(!pop) return;
  const btn = pop.querySelector(".wbpact button");
  if(!btn) return;
  const word = pop.getAttribute("data-cur") || "";
  const isWB = (S.wordBank || []).some(w => w.word === word);
  btn.className = "mini " + (isWB ? "on" : "bad");
  btn.textContent = isWB ? "已在重点复习 · 移出" : "标记为不会 · 加入重点复习";
}
function fetchWithRetry(url, opts, retries){
  retries = retries || 1;
  return fetch(url, opts).then(function(r){
    if(!r.ok && retries > 0){
      return new Promise(function(resolve){ setTimeout(resolve, 500); })
        .then(function(){ return fetchWithRetry(url, opts, retries - 1); });
    }
    return r.ok ? r.json() : null;
  }).catch(function(){
    if(retries > 0){
      return new Promise(function(resolve){ setTimeout(resolve, 500); })
        .then(function(){ return fetchWithRetry(url, opts, retries - 1); });
    }
    return null;
  });
}
function lookupWord(clean){
  // 并行查询：英文释义(音标/例句) + 中文翻译 + 近义词 + 同根词；各自独立降级，不阻塞渲染
  var enP = fetchWithRetry("https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(clean))
    .then(function(d){ return d; }).catch(function(){ return null; });
  var zhP = fetchWithRetry("https://api.mymemory.translated.net/get?q=" + encodeURIComponent(clean) + "&langpair=en|zh-CN")
    .then(function(d){
      var t = d && d.responseData && d.responseData.translatedText;
      if(!t || t === clean) return null;
      if(t.length > 40) return null;
      if(/^[a-zA-Z0-9\s''\-.,;:!?()«»]+$/.test(t)) return null;
      return t;
    })
    .catch(function(){ return null; });
  var synP = fetchWithRetry("https://api.datamuse.com/words?rel_syn=" + encodeURIComponent(clean) + "&max=8")
    .then(function(d){ return d || []; }).catch(function(){ return []; });
  var derivP = fetchWithRetry("https://api.datamuse.com/words?sp=" + encodeURIComponent(clean) + "*&max=8")
    .then(function(d){ return d || []; }).catch(function(){ return []; });
  return Promise.all([enP, zhP, synP, derivP]).then(function(res){ return { en: res[0], zh: res[1], syn: res[2], deriv: res[3] }; });
}
function wordLookup(el){
  const raw = el.textContent;
  const clean = raw.toLowerCase().replace(/[^a-z'-]/g, "");
  if(!clean) return;
  // 修复 __wordCtx：取当前点击词所在句子作为上下文
  const sentEl = el.closest(".enq, .tren");
  const ctx = sentEl ? sentEl.textContent.trim() : "";
  let pop = document.getElementById("wordPop");
  if(!pop){ pop = document.createElement("div"); pop.id = "wordPop"; pop.className = "wordpop"; document.body.appendChild(pop); }
  pop.setAttribute("data-cur", clean);
  pop.setAttribute("data-raw", raw);
  pop.setAttribute("data-ctx", ctx);
  buildLocalDict();
  const local = __localDict[clean] || __localDict[raw.toLowerCase()];
  const localZh = zhOf(clean, raw) || (local ? local.term : null);
  const isWB = (S.wordBank || []).some(w => w.word === clean);
  const zhHtml = localZh
    ? `<div class="wpsec zhh" id="wpZhSec" data-zh="1"><div class="wplab">中文释义</div><div class="zhdef">${esc(localZh)}</div></div>`
    : `<div class="wpsec zhh" id="wpZhSec"><div class="wplab">中文释义</div><span class="muted">联网翻译中...</span></div>`;
  const localHtml = local
    ? `<div class="wpsec"><div class="wplab">本地专业释义</div><div><b>${esc(local.term)}</b>：${esc(local.def || "")}</div>${local.ex ? `<div class="wpex">例：${esc(local.ex)}</div>` : ""}</div>`
    : "";
  const head = `<div class="wphd"><b class="wpword">${esc(raw)}</b>
    <button class="mini" data-popact="speak">朗读</button>
    <button class="mini" data-popact="close">✕ 关闭</button></div>`;
  const wbBtn = `<button class="mini ${isWB ? 'on' : 'bad'}" data-popact="wbToggle">${isWB ? "已在重点复习 · 移出" : "标记为不会 · 加入重点复习"}</button>`;
  pop.innerHTML = head + `<div id="wpBody" class="wpbody">
    <div class="wpsec wbpact"><div class="row" style="margin:0">${wbBtn}</div></div>
    ${zhHtml}${localHtml}
    <div class="wpsec" id="wpSynSec" style="display:none"></div>
    <div class="wpsec" id="wpDerivSec" style="display:none"></div>
    <div class="wpsec" id="wpEnSec"><div class="wplab">英文参考释义</div><span class="muted">查询中...</span></div></div>`;
  pop.style.display = "block";
  // 联网查词（带缓存 + 离线降级）
  if(__dictCache[clean] != null){
    fillLookup(clean, __dictCache[clean]);
  } else {
    lookupWord(clean)
      .then(res => { __dictCache[clean] = res; fillLookup(clean, res); })
      .catch(() => { __dictCache[clean] = false; fillLookup(clean, false); });
  }
}
function fillLookup(clean, res){
  const set = (id, html) => { const el = document.getElementById(id); if(el) el.innerHTML = html; };
  const zhSec = document.getElementById("wpZhSec");
  if(!res){ // 离线/全部失败：只补中文占位，不覆盖已有本地中文
    if(zhSec && !zhSec.getAttribute("data-zh")) zhSec.innerHTML = `<div class="wplab">中文释义</div><span class="muted">未找到中文释义（离线状态，可点朗读听发音）</span>`;
    set("wpEnSec", `<div class="wplab">英文参考释义</div><span class="muted">未找到在线释义（离线或网络受限）</span>`);
    return;
  }
  if(zhSec && !zhSec.getAttribute("data-zh")){
    if(res.zh) zhSec.innerHTML = `<div class="wplab">中文释义</div><div class="zhdef">${esc(res.zh)}</div>`;
    else zhSec.innerHTML = `<div class="wplab">中文释义</div><span class="muted">未找到中文释义（可查看下方英文参考释义）</span>`;
  }
  if(res.zh){ // 联网查到的中文释义回写已入重点复习的单词（下次直接显示）
    const wb = (S.wordBank || []).find(w => w.word === clean && !w.zh);
    if(wb){ wb.zh = res.zh; save(); }
  }
  const en = res.en || [];
  let synList = (res.syn || []).map(s => s.word || "").filter(Boolean);
  en.forEach(e => (e.meanings || []).forEach(m => (m.synonyms || []).forEach(w => synList.push(w))));
  synList = [...new Set(synList)].filter(w => w.toLowerCase() !== clean).slice(0, 10);
  set("wpSynSec", `<div class="wplab">近义词</div>` + (synList.length
    ? `<div class="wpsyns">${synList.map(w => `<span class="wptag">${esc(w)}</span>`).join("")}</div>`
    : `<span class="muted">未找到近义词</span>`));
  const derivList = (res.deriv || []).map(s => s.word || "").filter(w => w && w.toLowerCase() !== clean && !synList.some(x => x.toLowerCase() === w.toLowerCase())).slice(0, 8);
  set("wpDerivSec", `<div class="wplab">同根词 / 派生词</div>` + (derivList.length
    ? `<div class="wpsyns">${derivList.map(w => `<span class="wptag">${esc(w)}</span>`).join("")}</div>`
    : `<span class="muted">未找到同根词</span>`));
  let onHtml = "";
  if(!en.length){
    onHtml = `<span class="muted">未找到英文释义（可点朗读听发音）</span>`;
  } else {
    en.slice(0, 2).forEach(e => {
      if(e.phonetics){ const ph = e.phonetics.find(p => p.text); if(ph) onHtml += `<div class="wpphon">音标：${esc(ph.text)}</div>`; }
      (e.meanings || []).slice(0, 4).forEach(m => {
        onHtml += `<div class="wpmean"><b>${esc(m.partOfSpeech || "")}</b>`;
        (m.definitions || []).slice(0, 2).forEach(d => { onHtml += `<div>${esc(d.definition || "")}</div>`; if(d.example) onHtml += `<div class="wpex">例：${esc(d.example)}</div>`; });
        onHtml += `</div>`;
      });
    });
  }
  set("wpEnSec", `<div class="wplab">英文参考释义</div>` + onHtml);
}
function speakWord(word){
  try{
    if(!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = "en-US"; u.rate = 0.85;
    const v = pickEnVoice(); if(v) u.voice = v;
    window.speechSynthesis.speak(u);
  }catch(e){}
}
function closeWordPop(){ const p = document.getElementById("wordPop"); if(p) p.style.display = "none"; }

/* ---- 单词·不会 抽词背诵（弹窗式闪卡） ---- */
function wordBankPractice(){
  const wb = (S.wordBank || []).filter(w => w.status === "不会");
  if(!wb.length){ flash("暂无单词，去文献翻译点词标记吧"); return; }
  let pop = document.getElementById("wbPracticePop");
  if(!pop){ pop = document.createElement("div"); pop.id = "wbPracticePop"; pop.className = "wordpop"; document.body.appendChild(pop); }
  const w = wb[Math.floor(Math.random() * wb.length)];
  pop.setAttribute("data-cur", w.word);
  pop.innerHTML = `<div class="wphd"><b class="wpword">${esc(w.raw || w.word)}</b>
      <button class="mini" data-popact="wpSpeak">朗读</button>
      <button class="mini" data-popact="wpClose">✕ 关闭</button></div>
    <div class="wpbody">
      <div class="wpsec"><div class="wplab">所在句子</div><div>${esc(w.ctx || "（无上下文）")}</div></div>
      <div class="wpsec zhh" id="wbZhSec" style="display:none"><div class="wplab">中文释义</div><div class="zhdef">${esc(w.zh || "（暂无本地中文释义）")}</div></div>
      <div class="wpsec"><button class="btn" data-popact="wpShowZh">显示中文释义</button></div>
      <div class="row" style="margin-top:10px">
        <button class="mini" data-popact="wpMark" data-st="掌握">掌握 · 移出</button>
        <button class="mini bad" data-popact="wpMark" data-st="不会">仍不会 · 下一题</button>
        <button class="mini alt" data-popact="wpShuffle">换一题</button>
      </div>
    </div>`;
  pop.style.display = "block";
}
function wbPracticeMark(st){
  const pop = document.getElementById("wbPracticePop");
  if(!pop) return;
  const word = pop.getAttribute("data-cur") || "";
  if(!word) return;
  if(st === "掌握"){
    wordBankRemove(word);
    pop.style.display = "none";
    flash("已掌握并移出重点复习");
  } else {
    flash("继续练习，下一题");
    wordBankPractice();
  }
}
function closeWbPop(){ const p = document.getElementById("wbPracticePop"); if(p) p.style.display = "none"; }

/* ---- 英语听力·随机抽题播报 ---- */
let enListen = { q:null };
function enListenHtml(){
  if(!enListen.q) return '<p class="muted">点「随机抽题并语音播报」，会用英语朗读一道英文面试题。</p>';
  return `<div class="qitem">
    <div class="qtop"><span class="cat">英文听力</span>
      <span class="mbtns"><button class="mini" onclick="enListenSpeak()">再播报一次</button>
      <button class="mini" onclick="enListenPick()">换一题</button></span></div>
    <details class="dbans"><summary>点击查看题目（英文）</summary><div class="ansbox enq">${esc(enListen.q.q)}</div></details>
    <details class="dbans"><summary>点击查看答案</summary><div class="ansbox">${esc(enListen.q.ans || "")}</div></details>
  </div>`;
}
function pickEnVoice(){
  try{
    const vs = window.speechSynthesis.getVoices() || [];
    if(!vs.length) return null;
    const prefs = ["Google US English","Microsoft Aria","Microsoft Zira","Samantha","Microsoft Jenny","Google UK English Female"];
    for(const n of prefs){ const v = vs.find(v => v.name && v.name.includes(n)); if(v) return v; }
    let v = vs.find(v => /en[-_]US/i.test(v.lang) && /female|aria|zira|jenny|samantha/i.test(v.name));
    if(v) return v;
    v = vs.find(v => /en[-_]US/i.test(v.lang));
    if(v) return v;
    v = vs.find(v => /^en/i.test(v.lang));
    return v || null;
  }catch(e){ return null; }
}
function enListenSpeak(){
  if(!enListen.q) return;
  try{
    if(!window.speechSynthesis){ alert("当前浏览器不支持语音合成（TTS），建议用 Chrome / Edge。"); return; }
    window.speechSynthesis.cancel();
    const text = enListen.q.q;
    const chunks = text.split(/(?<=[.?!;])\s+/).filter(s => s.trim());
    const list = chunks.length ? chunks : [text];
    const voice = pickEnVoice();
    list.forEach((seg,k) => {
      const u = new SpeechSynthesisUtterance(seg);
      u.lang = "en-US";
      if(voice) u.voice = voice;
      u.rate = 0.9; u.pitch = 1;
      u.onstart = () => voiceStatus("正在播报（native 英音）…", "on");
      if(k === list.length - 1) u.onend = () => voiceStatus("播报结束，点题目/答案查看文本", "muted");
      window.speechSynthesis.speak(u);
    });
    voiceStatus("正在播报…", "on");
  }catch(e){ console.warn("TTS error", e); voiceStatus("播报失败：" + e.message, "bad"); }
}
function enListenPick(){
  const qs = S.questions.filter(q => q.cat === "英文");
  if(!qs.length){ alert("暂无英文题"); return; }
  enListen.q = qs[Math.floor(Math.random() * qs.length)];
  const box = $("#enListenBox"); if(box) box.innerHTML = enListenHtml();
  enListenSpeak();
  flash("正在播报英文面试题…");
}

/* ---- 文献翻译（调用在线翻译 API 逐句翻译，离线时降级提示） ---- */
function litTranslate(){
  const inp = $("#litInput");
  if(!inp || !inp.value.trim()){ alert("请先粘贴英文段落"); return; }
  const txt = inp.value.trim();
  const o = $("#litOut");
  if(!o) return;
  o.innerHTML = `<div class="docout">
    <p><b>原文</b><br>${esc(txt)}</p>
    <p><b>学术翻译（逐句）</b><br><span class="muted">翻译中...</span></p>
  </div>`;
  const sentences = txt.split(/(?<=[.?!;])\s+/).filter(s => s.trim());
  const chunks = [];
  let buf = "";
  sentences.forEach(s => {
    if((buf + " " + s).length > 450){ if(buf) chunks.push(buf); buf = s; }
    else buf = buf ? buf + " " + s : s;
  });
  if(buf) chunks.push(buf);
  const translateChunk = c => fetchWithRetry("https://api.mymemory.translated.net/get?q=" + encodeURIComponent(c) + "&langpair=en|zh-CN")
    .then(d => {
      const t = d && d.responseData && d.responseData.translatedText;
      if(!t || t === c) return null;
      if(t.length > 40 && /^[a-zA-Z0-9\s''\-.,;:!?()«»]+$/.test(t)) return null;
      return t;
    })
    .catch(() => null);
  Promise.all(chunks.map(translateChunk)).then(results => {
    const fail = results.some(r => r == null);
    if(fail || !results.length){
      o.innerHTML = `<div class="docout">
        <p><b>原文</b><br>${esc(txt)}</p>
        <p><b>学术翻译</b><br><span class="muted">翻译失败（离线或网络受限）。建议先联网，或把重点句子发给 AI 助手精译。</span></p>
      </div>`;
      return;
    }
    const zh = results.join("\n");
    o.innerHTML = `<div class="docout">
      <p><b>原文</b><br>${esc(txt)}</p>
      <p><b>学术翻译</b><br>${esc(zh)}</p>
      <p><b>可背诵金句提炼</b><br><span class="muted">将你最想记住的 1–2 句话复制到对话中，可帮助改写成复试口语版金句。</span></p>
    </div>`;
  });
}