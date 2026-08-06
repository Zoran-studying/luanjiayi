/* ============================================================
   推免助手 PushMian Buddy — 入口模块（弹窗事件委托 / PWA / 启动）
   ============================================================ */

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

/* ---- 弹窗外空白点击：关闭所有弹窗（点词本身会打开弹窗，需排除） ---- */
document.addEventListener("click", function(ev){
  if(ev.target.closest(".wordpop")) return;
  if(ev.target.closest(".wword")) return;
  document.querySelectorAll(".wordpop").forEach(p => { if(p.style.display !== "none") p.style.display = "none"; });
});

/* ---- PWA：离线可用（仅 http/https 环境，file:// 自动跳过）+ 新版本提示 ---- */
function showUpdatePrompt(){
  if(document.getElementById("swUpdateBar")) return;
  const bar = document.createElement("div");
  bar.id = "swUpdateBar"; bar.className = "updatebar";
  bar.innerHTML = '<span>📦 发现新版本，点击刷新后生效（新题库/新功能）</span><button onclick="applyUpdate()">立即刷新</button><button class="x" onclick="dismissUpdate()">×</button>';
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