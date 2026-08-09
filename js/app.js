/* ============================================================
   推免助手 PushMian Buddy — 入口模块（弹窗事件委托 / PWA / 启动）
   ============================================================ */

/* ---- 页内通用弹层按钮委托（openModal/promptModal/confirmModal 的一键） ---- */
document.addEventListener("click", function(ev){
  const btn = ev.target.closest("[data-mact]");
  if(!btn) return;
  const pop = btn.closest(".gmodal");
  if(!pop) return;
  const act = btn.dataset.mact;
  if(act === "close"){ closeModal(pop); ev.stopPropagation(); }
  else if(act === "cancel"){ if(pop._onCancel) pop._onCancel(); ev.stopPropagation(); }
  else if(act === "ok" || act === "gold"){ if(pop._onOk) pop._onOk(); ev.stopPropagation(); }
  else if(act === "mark"){
    const qid = btn.dataset.id, st = btn.dataset.st;
    markQuestion(qid, st); flash("已标记：" + st); closeModal(pop);
    if(CURTAB === "bank") renderBankList(false); else render(CURTAB);
    ev.stopPropagation();
  }
  else if(act === "radarPri"){ handle("radarPri", btn.dataset.val); ev.stopPropagation(); }
});

/* ---- 点词查词：.wword 全局事件委托（不污染 HTML） ---- */
document.addEventListener("click", function(ev){
  const w = ev.target.closest(".wword");
  if(w){ wordLookup(w); ev.preventDefault(); ev.stopPropagation(); }
});

/* ---- 弹窗按钮统一事件委托（修复：不再把用户文本拼进 onclick 字符串） ---- */
document.addEventListener("click", function(ev){
  const btn = ev.target.closest("[data-popact]");
  if(!btn) return;
  const pop = btn.closest(".wordpop");
  if(!pop) return;
  const act = btn.dataset.popact;

  /* —— 点词查词弹窗 #wordPop —— */
  if(pop.id === "wordPop"){
    const word = pop.getAttribute("data-cur") || "";
    const raw = pop.getAttribute("data-raw") || word;
    const ctx = pop.dataset.ctx || "";
    if(act === "speak"){ speakWord(word); ev.stopPropagation(); }
    else if(act === "close"){ pop.style.display = "none"; }
    else if(act === "wbToggle"){
      const isWB = (S.wordBank || []).some(w => w.word === word);
      if(isWB) wordBankRemove(word); else wordBankAdd(word, raw, ctx);
      ev.stopPropagation();
    }
  }
  /* —— 抽词背诵弹窗 #wbPracticePop —— */
  else if(pop.id === "wbPracticePop"){
    const word = pop.getAttribute("data-cur") || "";
    if(act === "wpSpeak"){ speakWord(word); ev.stopPropagation(); }
    else if(act === "wpClose"){ pop.style.display = "none"; }
    else if(act === "wpShowZh"){ const sec = pop.querySelector("#wbZhSec"); if(sec) sec.style.display = "block"; }
    else if(act === "wpMark"){ wbPracticeMark(btn.dataset.st); }
    else if(act === "wpShuffle"){ wordBankPractice(); }
  }
});

/* ---- 弹窗外空白点击：通用弹窗只响应遮罩，查词浮层响应页面空白 ---- */
document.addEventListener("click", function(ev){
  const shade = ev.target.closest(".modalbackdrop");
  if(shade && ev.target === shade){
    const modal = shade.querySelector(".gmodal");
    if(modal && modal._closable){
      if(modal._onCancel) modal._onCancel(); else closeModal(modal);
    }
    return;
  }
  if(ev.target.closest(".wordpop")) return;
  if(ev.target.closest(".wword")) return;
  // data-act 的目标处理器可能在本次点击中刚创建弹窗，不能再被同一次冒泡关闭。
  if(ev.target.closest("[data-act],[data-tab],[data-jump],[data-popact],[data-mact]")) return;
  document.querySelectorAll(".wordpop:not(.gmodal)").forEach(p => { if(p.style.display !== "none") p.style.display = "none"; });
});

document.addEventListener("keydown", function(ev){
  const pop = currentModal();
  if(!pop) return;
  if(ev.key === "Tab"){
    const items = [...pop.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')]
      .filter(el => el.offsetParent !== null);
    if(!items.length){ ev.preventDefault(); pop.focus(); return; }
    const first = items[0], last = items[items.length - 1];
    if(ev.shiftKey && document.activeElement === first){ ev.preventDefault(); last.focus(); }
    else if(!ev.shiftKey && document.activeElement === last){ ev.preventDefault(); first.focus(); }
    return;
  }
  if(ev.key !== "Escape" || !pop._closable) return;
  ev.preventDefault();
  if(pop._onCancel) pop._onCancel(); else closeModal(pop);
});

/* ---- PWA：离线可用（仅 http/https 环境，file:// 自动跳过）+ 新版本提示 ---- */
function showUpdatePrompt(){
  if(document.getElementById("swUpdateBar")) return;
  const bar = document.createElement("div");
  bar.id = "swUpdateBar"; bar.className = "updatebar";
  bar.innerHTML = '<span>📦 发现新版本，点击刷新后生效（新题库/新功能）</span><button data-update="apply">立即刷新</button><button class="x" data-update="dismiss">×</button>';
  bar.addEventListener("click", function(ev){
    const btn = ev.target.closest("[data-update]"); if(!btn) return;
    if(btn.dataset.update === "apply") applyUpdate(); else dismissUpdate();
  });
  document.body.appendChild(bar);
}
function applyUpdate(){ location.reload(); }
function dismissUpdate(){ const b = document.getElementById("swUpdateBar"); if(b) b.remove(); }

function registerSW(){
  if(!("serviceWorker" in navigator)) return;
  if(location.protocol !== "http:" && location.protocol !== "https:") return;
  if(location.protocol === "http:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then(reg => {
      // 已受控（非首次安装）时，检测到新 SW 安装成功 → 提示刷新
      if(!navigator.serviceWorker.controller) return;
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing;
        if(!nw) return;
        nw.addEventListener("statechange", () => {
          if(nw.state === "installed") showUpdatePrompt();
        });
      });
    }).catch(e => console.warn("SW 注册失败（可忽略）", e));
  });
}

/* ---- 启动 ---- */
window.addEventListener("DOMContentLoaded", () => {
  startup();
  registerSW();
});
