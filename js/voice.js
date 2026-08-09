/* ============================================================
   推免助手 PushMian Buddy — 语音模块（背诵秒表 / 语音识别 / 中英文朗读）
   ============================================================ */
let introTimer = null, introSec = 0;
let recog = null; // 语音识别实例

function updateIntroTimer(){
  const el = $("#introTimer");
  if(el){ const mm = String(Math.floor(introSec / 60)).padStart(2, "0"); const ss = String(introSec % 60).padStart(2, "0"); el.textContent = mm + ":" + ss; }
}
function introStart(){ if(introTimer){ flash("已在计时中"); return; } introTimer = setInterval(() => { introSec++; updateIntroTimer(); }, 1000); flash("开始计时，开始背诵吧"); }
function introPause(){ if(introTimer){ clearInterval(introTimer); introTimer = null; flash("已暂停"); } else { flash("计时未在运行"); } }
function introReset(){ if(introTimer){ clearInterval(introTimer); introTimer = null; } introSec = 0; updateIntroTimer(); flash("已重置"); }

function voiceStatus(msg, cls){
  const el = $("#voiceStatus");
  if(el){ el.textContent = msg; el.className = "voicestatus " + (cls || "muted"); }
}
function voiceStart(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR){
    voiceStatus("❌ 当前浏览器不支持语音识别，请用 Chrome / Edge 桌面版（并用 localhost 打开）", "bad");
    confirmModal("当前浏览器不支持语音识别（Web Speech API）。请用 Chrome 或 Edge 桌面版打开本页（需通过 http://127.0.0.1:8000 访问，不能直接双击文件打开）。", { title: "语音识别不可用" });
    return;
  }
  if(recog){ voiceStatus("正在聆听…", "on"); return; }
  recog = new SR();
  const langEl = $("#voiceLang");
  recog.lang = langEl ? langEl.value : "zh-CN";
  recog.continuous = true;
  recog.interimResults = true;
  let base = ($("#introVoice") ? $("#introVoice").value : "");
  recog.onstart = function(){ voiceStatus("正在聆听…请对着麦克风背诵", "on"); };
  recog.onresult = function(e){
    let interim = "";
    for(let i = e.resultIndex; i < e.results.length; i++){
      const r = e.results[i];
      if(r.isFinal){ base += r[0].transcript; }
      else { interim += r[0].transcript; }
    }
    const ta = $("#introVoice"); if(ta) ta.value = base + interim;
    voiceStatus("正在识别…（已转写 " + (base + interim).length + " 字）", "on");
  };
  recog.onerror = function(ev){
    let m = ev.error || "未知错误";
    let hint = m;
    if(m === "not-allowed" || m === "service-not-allowed") hint = "麦克风权限被拒绝：请点击浏览器地址栏左侧的麦克风图标，允许麦克风后重试";
    else if(m === "no-speech") hint = "没有检测到语音，请靠近麦克风再说一次";
    else if(m === "network") hint = "网络错误：Chrome 的语音识别走 Google 云服务，国内通常被墙。请改用 Edge 浏览器（走微软服务，国内可用）重试，或直接把口述文字粘贴到文本框";
    else if(m === "aborted") hint = "已中止";
    else hint = "语音识别出错：" + m;
    voiceStatus(hint, "bad");
    flash(hint);
  };
  recog.onend = function(){ recog = null; voiceStatus("已停止（可点「开始语音输入」继续）", "muted"); };
  try{
    recog.start();
    voiceStatus("正在请求麦克风权限…（若弹出提示请点「允许」）", "on");
  }catch(e){
    recog = null;     voiceStatus("启动失败：" + e.message, "bad");
    confirmModal("启动失败：" + e.message + "\n可能是已在运行中，先点「停止」再试。", { title: "语音输入失败" });
  }
}
function voiceStop(){ if(recog){ try{ recog.stop(); }catch(e){} recog = null; voiceStatus("已停止", "muted"); flash("已停止语音输入"); } else { voiceStatus("语音识别未在运行", "muted"); } }
function voiceClear(){ const ta = $("#introVoice"); if(ta){ ta.value = ""; voiceStatus("已清空文本框", "muted"); } }

/* ---- 自我介绍：字数统计 + 时间估算 ---- */
function introStat(el){
  const len = (el.value || "").trim().length;
  const box = document.getElementById("st-" + el.dataset.key);
  if(!box) return;
  const wpm = el.dataset.key === "ppt_full" ? 260 : 220; // PPT语速稍快；短稿按口语语速
  const min = Math.max(0.5, Math.round(len / wpm * 10) / 10);
  box.textContent = "字数：" + len + " ｜ 估算时长：约 " + min + " 分钟" + (min > 8 ? "（⚠️ 超 PPT 建议时长，请精简）" : len === 0 ? "（尚未填写）" : "");
}

/* ---- 中文朗读（题库题目/关键词 + 语音合成） ---- */
function pickZhVoice(){
  try{
    const vs = window.speechSynthesis.getVoices() || [];
    if(!vs.length) return null;
    const prefs = ["Microsoft Xiaoxiao","Microsoft Yunxi","Microsoft Yunyang","Microsoft Huihui","Google 普通话","Google 粤語","ting-ting","Mei-Jia"];
    for(const n of prefs){ const v = vs.find(v => v.name && v.name.includes(n)); if(v) return v; }
    return vs.find(v => /^zh/i.test(v.lang)) || null;
  }catch(e){ return null; }
}
function speakZh(text){
  try{
    if(!window.speechSynthesis){ flash("当前浏览器不支持语音合成"); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN"; u.rate = 0.95;
    const v = pickZhVoice(); if(v) u.voice = v;
    window.speechSynthesis.speak(u);
  }catch(e){}
}