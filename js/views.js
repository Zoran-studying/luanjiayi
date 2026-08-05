/* ============================================================
   推免助手 PushMian Buddy — 视图模块（各板块渲染 + 局部交互）
   ============================================================ */

/* ---------------- 工具：信息雷达截止倒计时 ---------------- */
function radarDue(dl){
  if(!dl) return null;
  const s = String(dl);
  let m = s.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if(m){ return { iso: m[1] + "-" + m[2] + "-" + m[3], diff: daysBetween(todayStr(), m[1] + "-" + m[2] + "-" + m[3]) }; }
  m = s.match(/(\d{4})?年?(\d{1,2})月(\d{1,2})日/);
  if(m){ const y = m[1] || new Date().getFullYear(); const iso = y + "-" + m[2] + "-" + m[3]; return { iso, diff: daysBetween(todayStr(), iso) }; }
  // 仅精确到年月（如 "2026-09"、"2026-09~10"、"2026-09月底"）：按该月最后一天估算倒计时
  m = s.match(/(\d{4})[-/.](\d{1,2})/);
  if(m){ const last = new Date(+m[1], +m[2], 0).getDate(); const iso = m[1] + "-" + m[2] + "-" + last; return { iso, diff: daysBetween(todayStr(), iso) }; }
  return null;
}
function dueBadge(dl){
  const r = radarDue(dl);
  if(!r) return "";
  if(r.diff < 0) return `<span class="due-badge due-over">已截止${-r.diff}天</span>`;
  if(r.diff === 0) return `<span class="due-badge due-today">今天截止</span>`;
  if(r.diff <= 3) return `<span class="due-badge due-soon">余${r.diff}天</span>`;
  return `<span class="due-badge">余${r.diff}天</span>`;
}

/* ============================================================
   首次使用表单
   ============================================================ */
function viewSetup(){
  return `
  <h1 class="h1">欢迎使用推免工作台</h1>
  <p class="muted" style="margin-bottom:16px">首次使用请填写基本信息，这些信息会显示在首页和导出报告中。填写后可随时在「学习台账」中修改。</p>
  <section class="card">
    <div class="cardh">填写个人信息</div>
    <div class="setupform">
      <label class="setuplabel">姓名 <input class="setupinput" id="setupName" value="${esc(S.profile.name)}" placeholder="例：张三"/></label>
      <label class="setuplabel">学校 · 学院 <input class="setupinput" id="setupSchool" value="${esc(S.profile.school)}" placeholder="例：同济大学 · 环境科学与工程学院"/></label>
      <label class="setuplabel">专业 <input class="setupinput" id="setupMajor" value="${esc(S.profile.major)}" placeholder="例：海洋科学（本科）"/></label>
      <label class="setuplabel">GPA <input class="setupinput" id="setupGpa" value="${esc(S.profile.gpa)}" placeholder="例：4.07 / 5.0"/></label>
      <label class="setuplabel">排名 <input class="setupinput" id="setupRank" value="${esc(S.profile.rank)}" placeholder="例：专业第二（绩点/综测）"/></label>
    </div>
    <div class="row" style="margin-top:16px">
      <button class="btn" data-act="saveSetup">保存并进入</button>
      <button class="btn sm alt" data-act="skipSetup">跳过，稍后填写</button>
    </div>
  </section>`;
}

/* ============================================================
   首屏工作台
   ============================================================ */
function viewHome(){
  const d = getDay();
  const qById = id => S.questions.find(q => q.id === id);
  const radar = S.radar.slice().sort((a,b) => (a.priority === "高" ? -1 : 1) - (b.priority === "高" ? -1 : 1));
  const radarRows = radar.map(r => `<tr class="${r.priority === '高' ? 'hi' : ''}">
    <td>${esc(r.school)}</td><td>${esc(r.college)}</td><td>${esc(r.major)}</td>
    <td><span class="tag">${esc(r.type)}</span></td>
    <td>${esc(r.deadline)} ${dueBadge(r.deadline)}</td>
    <td>${r.link ? `<a href="${esc(r.link)}" target="_blank" rel="noopener">链接</a>` : "—"}</td>
    <td>${r.match === "是" ? '<b class="ok">匹配</b>' : esc(r.match)}</td>
    <td><span class="pri ${r.priority}">${r.priority}</span></td>
    <td>${esc(r.status)}</td><td class="note">${esc(r.note || "")}</td></tr>`).join("");

  const reviewItems = (d.plan.review || []).map(qById).filter(Boolean).map(q => `<li>${esc(q.q)} <span class="mini">[${catName(q.cat)}]</span></li>`).join("") || "<li class='muted'>暂无可复习项（去标记模糊/不会的题目会自动进入）</li>";
  const newItems = (d.plan.newInterview || []).slice(0, 3).map(qById).filter(Boolean).map(q => `<li>${esc(q.q)}</li>`).join("") || "<li class='muted'>—</li>";
  const consItems = (d.plan.consolidate || []).map(qById).filter(Boolean).map(q => `<li>${esc(q.q)}</li>`).join("") || "<li class='muted'>—</li>";

  const si = d.selfIntro || {cn:false,en:false,ppt:false};
  const siBox = `<div class="sibox">
    <div class="sititle">今日强制任务 · 自我介绍练习</div>
    <div class="sicheck">
      <label class="chk ${si.cn ? 'done' : ''}">${si.cn ? '已完成' : '待完成'} 中文自我介绍背诵自检</label>
      <label class="chk ${si.en ? 'done' : ''}">${si.en ? '已完成' : '待完成'} 英文自我介绍背诵自检</label>
      <label class="chk ${si.ppt ? 'done' : ''}">${si.ppt ? '已完成' : '待完成'} 5–8分钟 PPT 版综合自我介绍演练</label>
    </div>
    <button class="btn" data-act="siCheck">前往自我介绍模块打卡 →</button>
  </div>`;

  const iv = (d.interview || []).map(qById).filter(Boolean);
  const ivGroups = {};
  iv.forEach(q => { (ivGroups[q.cat] = ivGroups[q.cat] || []).push(q); });
  const ivHtml = Object.keys(ivGroups).map(cat => {
    const items = ivGroups[cat].map(q => `<li><b>${esc(q.q)}</b>
      <div class="ivans"><span class="lab">参考</span><span class="editable" contenteditable="true" data-eid="${q.id}">${esc(q.ans || "")}</span></div>
      <div class="ivans tip"><span class="lab">加分</span>${esc(q.tip)}</div>
      <div class="ivans pit"><span class="lab">避坑</span>${esc(q.pit)}</div>
      ${q.extra ? `<div class="ivans extra"><span class="lab">思考</span>${esc(q.extra)}</div>` : ""}
      <span class="mbtns">
        <button class="mini" data-act="mk" data-arg="${q.id}|掌握">已掌握</button>
        <button class="mini warn" data-act="mk" data-arg="${q.id}|模糊">模糊</button>
        <button class="mini bad" data-act="mk" data-arg="${q.id}|不会">不会</button>
      </span></li>`).join("");
    return `<div class="ivcat">${catName(cat)}（${ivGroups[cat].length}）</div><ul class="ivlist">${items}</ul>`;
  }).join("");

  const enc = S.settings.intensity === "low" ? `<div class="warnbar">⚠️ 节奏管理：检测到连续两天未完成任务，今日任务强度已自动下调，请轻装前进，稳住状态。</div>` : "";
  const prog = todaysProgress();
  const stk = streakDays();

  return `
  ${enc}
  <div class="cmdbar">
    <button class="cmd" data-tab="home">今日计划</button>
    <button class="cmd" data-act="regenDay">抽题模拟面试</button>
    <button class="cmd fire" data-tab="focus">重点复习</button>
    <button class="cmd" data-tab="docbank">真题分区</button>
    <button class="cmd" data-tab="vocab">翻译文献</button>
    <button class="cmd" data-tab="ledger">本周复盘</button>
    <button class="cmd" data-tab="intro">背诵检查</button>
    <button class="cmd" data-act="pptSim">PPT模拟</button>
    <button class="cmd" data-act="exportData">导出备份</button>
  </div>
  <h1 class="h1">推免全流程工作台</h1>
  <div class="sub">${todayStr()} | ${esc(S.profile.major)} | ${esc(S.profile.gpa)} | ${esc(S.profile.rank)} | ${esc(S.profile.target)}</div>

  <section class="card">
    <div class="cardh">今日完成率 ${prog.pct}%（${prog.done}/${prog.total}）<span class="muted">| 连续打卡 ${stk} 天</span></div>
    <div class="progwrap"><div class="progfill" style="width:${prog.pct}%"></div></div>
    <p class="muted" style="margin:6px 0 0">完成项 = 自我介绍三件套打卡 + 复习队列已标记（掌握/模糊/不会）。</p>
  </section>

  <section class="card">
    <div class="cardh">信息雷达 <span class="muted">（仅推送新增 + 3天内截止；高优先级置顶；截止倒计时自动标注）</span></div>
    <div class="scroll"><table class="tbl"><thead><tr><th>学校/所</th><th>学院/系</th><th>专业方向</th><th>类型</th><th>截止</th><th>链接</th><th>匹配</th><th>优先级</th><th>状态</th><th>备注</th></tr></thead><tbody>${radarRows}</tbody></table></div>
    <button class="btn sm" data-act="addRadar">+ 新增通知</button>
  </section>

  <section class="card">
    <div class="cardh">今日学习计划（三栏待办）</div>
    <div class="three">
      <div class="col"><div class="colh new">新学内容</div><ul>${newItems}<li>新词汇：<b>${esc(d.plan.newVocab || "")}</b></li><li>文献：<b>${esc(d.plan.paper || "")}</b></li></ul></div>
      <div class="col"><div class="colh rev">复习内容（模糊/不会优先）</div><ul>${reviewItems}</ul></div>
      <div class="col"><div class="colh con">巩固内容（已掌握随机3道）</div><ul>${consItems}</ul></div>
    </div>
  </section>

  ${siBox}

  <section class="card">
    <div class="cardh">今日模拟面试习题（中文 ${iv.filter(q => ["基础","专业海科","专业海生","专业环市","科研深挖"].includes(q.cat)).length} + 英文 ${iv.filter(q => q.cat === "英文").length} + 翻译 ${iv.filter(q => q.cat === "翻译").length}）</div>
    ${ivHtml}
    <div class="row">
      <button class="btn" data-act="regenDay">重新生成今日面试</button>
      <button class="btn alt" data-act="fullInterview">进入全真面试模式（科研深挖追问）</button>
      <button class="btn sm" data-act="saveLog">保存今日学习日志</button>
    </div>
    <div class="lognote">今日日志备注：<textarea id="lognote" placeholder="记录薄弱知识点、掌握情况...">${esc(d.note || "")}</textarea></div>
  </section>`;
}

/* ============================================================
   模块A：面试题库
   ============================================================ */
function viewBank(){
  if(!bankFilterState) bankFilterState = { cat:"", st:"全部" }; // 仅首次进入时初始化，切换 tab 不丢筛选状态
  const cats = ["基础","专业海科","专业海生","专业环市","科研深挖","英文","翻译","词汇翻译"];
  const stat = ["全部","未标记","掌握","模糊","不会","收藏"];
  const filterBar = `<div class="filters">
    分类：${cats.map(c => `<button class="chip" data-act="bf" data-arg="cat:${c}">${catName(c)}</button>`).join("")}
    状态：${stat.map(s => `<button class="chip" data-act="bf" data-arg="st:${s}">${s === "收藏" ? "收藏" : s}</button>`).join("")}
    <input class="search" id="qsearch" placeholder="搜索题干/关键词..." oninput="bankFilter(this.value)"/>
    <button class="btn sm" data-act="randQ">随机抽题</button>
    <button class="btn sm alt" data-act="fullInterview">全真面试模式</button>
    <button class="btn sm fire" data-act="focusReview">重点复习（不会 ${S.questions.filter(q => q.status === "不会").length}）</button>
    <button class="btn sm" data-act="showImport">+ 批量导入题目</button>
  </div>`;
  const due = dueReview();
  const dueHtml = due.length ? `<div class="duebox">待复习队列（${due.length}）：` + due.map(q => `<span class="chip sm" data-act="focusQ" data-arg="${q.id}">${esc(q.q.slice(0, 18))}</span>`).join("") + `</div>` : "";
  const favN = S.questions.filter(q => q.fav).length;
  const list = S.questions.map(bankItemHtml).join("");
  return `<h1 class="h1">模拟面试题库</h1>
    <div class="stat">总题量 ${S.questions.length} | 掌握 ${S.questions.filter(q => q.status === "掌握").length} | 模糊 ${S.questions.filter(q => q.status === "模糊").length} | 不会 ${S.questions.filter(q => q.status === "不会").length} | 收藏 ${favN} | 待复习 ${due.length}</div>

  <section class="card">
    <div class="cardh">英语听力 · 随机抽题播报</div>
    <div class="row">
      <button class="btn" onclick="enListenPick()">随机抽题并语音播报</button>
      <span class="muted">点击后会用英语朗读一道英文面试题；再点题目/答案查看文本对照。</span>
    </div>
    <div id="enListenBox">${enListenHtml()}</div>
  </section>

    ${filterBar}${dueHtml}
    <div id="qlist">${list}</div>

  <section class="card">
    <div class="cardh">文献翻译（${S.translate.length} 题 · 英译汉，含参考译文）</div>
    <p class="muted">以下为全部文献翻译练习题目，点击英文句子中任意单词可查中文释义、词形与朗读发音；点击题目展开参考译文。可标记掌握/不会（标"不会"自动进重点复习）。</p>
    <div class="scroll">${S.translate.map(t => `<details class="dbans"><summary class="enq">${wrapWords(esc(t.en))}</summary>
      <div class="ansbox"><b>参考译文：</b><span class="editable" contenteditable="true" data-tid="${t.id}" data-field="cn">${esc(t.cn || "")}</span></div>
      <div class="row"><button class="mini" data-act="trmk" data-arg="${t.id}|掌握">掌握</button><button class="mini warn" data-act="trmk" data-arg="${t.id}|模糊">模糊</button><button class="mini bad" data-act="trmk" data-arg="${t.id}|不会">不会</button></div>
    </details>`).join("")}</div>
  </section>`;
}

/* ---- 题库条目统一渲染（列表初始渲染与筛选重建共用） ---- */
function bankItemHtml(q){
  const st = q.status || "未标记";
  return `<div class="qitem" data-id="${q.id}"><div class="qtop"><span class="cat">${catName(q.cat)}</span><span class="st st-${st}">${st}</span>
    <span class="mbtns">
      <button class="mini ${q.fav ? 'fav-on' : ''}" data-act="fav" data-arg="${q.id}" title="收藏/取消">${q.fav ? "★" : "☆"}</button>
      <button class="mini" data-act="spkQ" data-arg="${q.id}" title="朗读题目+关键词">朗读</button>
      <button class="mini" data-act="mk" data-arg="${q.id}|掌握">掌握</button><button class="mini warn" data-act="mk" data-arg="${q.id}|模糊">模糊</button><button class="mini bad" data-act="mk" data-arg="${q.id}|不会">不会</button>
    </span></div>
    <div class="qq"><span class="editable" contenteditable="true" data-eid="${q.id}" data-field="q">${esc(q.q)}</span></div>
    ${q.key ? `<div class="qqkey"><b>关键词：</b><span class="editable" contenteditable="true" data-eid="${q.id}" data-field="key">${esc(q.key)}</span></div>` : ""}
    ${q.tip ? `<div class="qqtip"><b>加分：</b>${esc(q.tip)}</div>` : ""}
    ${q.pit ? `<div class="qqpit"><b>避坑：</b>${esc(q.pit)}</div>` : ""}
    ${q.extra ? `<div class="qqextra"><b>延伸：</b>${esc(q.extra)}</div>` : ""}
    <details class="dbans"><summary>查看完整答案</summary>
      <div class="ansbox editable" contenteditable="true" data-eid="${q.id}" data-field="ans">${esc(q.ans || "")}</div>
    </details>
  </div>`;
}

/* ---- 题库筛选/搜索（统一状态机：分类/状态/关键词 一次性重建，chip 高亮） ---- */
let bankFilterState = { cat:"", st:"全部" };
function renderBankList(){
  const inp = $("#qsearch");
  const w = (inp ? inp.value : "").toLowerCase().trim();
  let list = S.questions.slice();
  if(bankFilterState.cat) list = list.filter(q => q.cat === bankFilterState.cat);
  if(bankFilterState.st === "收藏") list = list.filter(q => q.fav);
  else if(bankFilterState.st !== "全部") list = list.filter(q => (q.status || "未标记") === bankFilterState.st);
  if(w) list = list.filter(q => (q.q + " " + (q.ans || "")).toLowerCase().includes(w));
  const box = $("#qlist");
  if(!box) return;
  box.innerHTML = list.map(bankItemHtml).join("") || "<p class='muted'>无匹配题目</p>";
  bindCommon();
}
function filterBank(arg){
  const [k,v] = arg.split(":");
  if(k === "cat") bankFilterState.cat = (bankFilterState.cat === v) ? "" : v;
  else if(k === "st") bankFilterState.st = v;
  document.querySelectorAll("[data-act='bf']").forEach(b => {
    const [bk,bv] = b.dataset.arg.split(":");
    const active = (bk === "cat" && bankFilterState.cat === bv) || (bk === "st" && bankFilterState.st === bv);
    b.classList.toggle("on", active);
  });
  renderBankList();
}
function bankFilter(v){
  renderBankList();
}

/* ---- 批量导入题目（粘贴文档/文本自动切分） ---- */
function showImport(){
  const cats = ["基础","专业海科","专业海生","专业环市","科研深挖","英文","翻译"];
  const panel = `<section class="card" id="importPanel"><div class="cardh">+ 批量导入题目（支持从论文/课件/笔记粘贴文本）</div>
    <div class="row">归类到：<select id="impCat">${cats.map(c => `<option value="${c}">${catName(c)}</option>`).join("")}</select> | <span class="muted">每行一道题，或用空行分隔</span></div>
    <textarea id="impText" class="ed" placeholder="例：&#10;好氧反硝化与厌氧反硝化的区别？&#10;温度如何影响 nirS 基因丰度？&#10;为什么近岸水体富氧环境仍可发生反硝化？"></textarea>
    <div class="row"><button class="btn" data-act="doImport">解析并入库</button><button class="btn sm" data-act="cancelImport">取消</button></div>
    <div id="impOut" class="muted"></div></section>`;
  const root = $("#app");
  root.innerHTML = navBar() + `<main class="main"><h1 class="h1">模拟面试题库</h1>${panel}</main>`;
  bindCommon();
}
function doImport(){
  const ta = $("#impText");
  if(!ta || !ta.value.trim()){ alert("请先粘贴题目文本"); return; }
  const cat = $("#impCat").value;
  const lines = ta.value.split(/\n+/).map(s => s.trim()).filter(Boolean);
  const cand = [];
  lines.forEach(line => {
    const clean = line.replace(/^[0-9]+[.、)]\s*/, "").replace(/^[Qq][0-9]*[.、)]\s*/, "");
    if(clean.length < 4) return;
    cand.push({ id: uid(), cat, q: clean, ans: "（待补充：点击参考答案处直接编辑）", tip:"", pit:"", extra:"", key:"", status:"未标记", nextReview:"", reviewStage:0, fav:false });
  });
  if(!cand.length){ alert("未解析到有效题目（每行至少4字）"); return; }
  S.questions.push(...cand);
  save();
  const out = $("#impOut");
  if(out) out.innerHTML = `✅ 已导入 ${cand.length} 题到【${catName(cat)}】。`;
  flash("导入成功");
  setTimeout(() => render("bank"), 900);
}

/* ============================================================
   模块B：自我介绍专项
   ============================================================ */
function viewIntro(){
  const si = S.selfIntro;
  const d = getDay(); const s = d.selfIntro || {cn:false,en:false,ppt:false};
  const mm = String(Math.floor(introSec / 60)).padStart(2, "0");
  const ss = String(introSec % 60).padStart(2, "0");
  const introCard = (num, title, key, tall) => `
    <section class="card">
      <div class="cardh">${num} ${title}</div>
      <textarea class="ed ${tall ? 'tall' : ''}" data-key="${key}" oninput="introStat(this)">${esc(si[key] || "")}</textarea>
      <div class="introstat muted" id="st-${key}"></div>
      <div class="row">
        <button class="btn sm" data-act="saveIntro" data-arg="${key}">保存</button>
        <button class="btn sm alt" data-act="checkIntro" data-arg="${key === 'cn_short' ? 'cn' : key === 'en_short' ? 'en' : 'ppt'}">${key === 'ppt_full' ? "模拟PPT汇报" : "发起背诵检查"}</button>
      </div>
      <label class="chk ${s[key === 'cn_short' ? 'cn' : key === 'en_short' ? 'en' : 'ppt'] ? 'done' : ''}" data-act="siToggle" data-arg="${key === 'cn_short' ? 'cn' : key === 'en_short' ? 'en' : 'ppt'}">${s[key === 'cn_short' ? 'cn' : key === 'en_short' ? 'en' : 'ppt'] ? '今日已打卡' : '今日未打卡'}</label>
    </section>`;
  return `<h1 class="h1">自我介绍专项训练</h1>
  <div class="stat">三套文稿已永久存储，跨会话持续生效。下方「秒表 + 语音输入」：边背边计时，背完看语音转文字逐句纠错。</div>

  <section class="card">
    <div class="cardh">背诵秒表 + 语音输入纠错</div>
    <div class="timerwrap">
      <div class="timer" id="introTimer">${mm}:${ss}</div>
      <div class="timerbtns">
        <button class="btn" data-act="introStart">开始计时</button>
        <button class="btn alt" data-act="introPause">暂停</button>
        <button class="btn sm" data-act="introReset">重置</button>
      </div>
    </div>
    <div class="row">
      识别语言：<select id="voiceLang" class="sel"><option value="zh-CN">中文</option><option value="en-US">English</option></select>
      <button class="btn" data-act="voiceStart">开始语音输入</button>
      <button class="btn alt" data-act="voiceStop">停止</button>
      <button class="btn sm" data-act="voiceClear">清空</button>
    </div>
    <div id="voiceStatus" class="voicestatus muted">未启动</div>
    <p class="muted">提示：点「开始语音输入」→ 允许麦克风 → 对着麦克风背诵 → 实时转写。背完点「停止」再对照文稿纠错。<b>重要：Chrome 的语音识别走 Google 云服务，国内网络通常连不上会报"网络错误"；请改用 <u>Edge 浏览器</u>（走微软服务，国内可用）打开本页重试</b>。若仍不行，可直接把口述文字粘贴到下方文本框。</p>
    <textarea class="ed tall" id="introVoice" placeholder="对着麦克风背诵，语音会自动转写到这里；背完后对照上方文稿逐句纠错..."></textarea>
  </section>

  ${introCard("①","简短中文自我介绍（1–2分钟通用版）","cn_short",false)}
  ${introCard("②","简短英文自我介绍（1–2分钟通用版）","en_short",false)}
  ${introCard("③","PPT 完整版自我介绍（5–8分钟复试汇报版）","ppt_full",true)}`;
}

function introCoach(type){
  if(type === "cn") return "【中文自我介绍背诵检查】\n请现在口述你的1–2分钟中文自我介绍（参照模块B文稿）。\n口述完成后，请告诉我：① 是否卡顿/超时；② 哪一句最不流畅；③ 是否有冗余废话。\n我会针对流畅度、逻辑、时间把控、语言冗余进行点评并修正措辞。\n（也可直接把你的口述文字粘贴给我，我来批改。）";
  if(type === "en") return "【English Self-Intro Check】\nPlease recite your 1–2 min English intro now.\nAfter that, tell me: ① any hesitation/over-time; ② the weakest sentence; ③ filler words used.\nI'll give feedback on fluency, logic, timing, and wordiness, and polish your phrasing.";
  if(type === "ppt") return "【PPT 完整版模拟汇报 · 评委模式】\n你将进行5–8分钟完整讲述（科学问题→方法→结果→意义→未来设想）。\n我（评委）会在中途随机打断提问，例如：\n· '你这个最适温度区间，重复几次？误差多大？'\n· 'nosZ缺失会不会导致N2O逃逸？你测了吗？'\n· '这项研究对同济市政工程有什么用？'\n· '如果让你把菌做成填料，中试怎么设计？'\n讲述结束后我会给你综合评分与改进建议。\n（在对话中直接开始讲述，我会适时打断。）";
  return "请口述后进行点评。";
}
function pptSim(){ return introCoach("ppt"); }

/* ============================================================
   模块D：学习台账 + 周报
   ============================================================ */
function viewLedger(){
  const days = []; for(let i = 6; i >= 0; i--) days.push(addDays(todayStr(), -i));
  const cells = days.map(dt => {
    const log = S.logs[dt];
    const iv = log ? (log.interview || []).length : 0;
    const si = log && log.selfIntro ? (["cn","en","ppt"].filter(k => log.selfIntro[k]).length) : 0;
    return `<td class="${dt === todayStr() ? 'today' : ''}"><div class="dnum">${dt.slice(5)}</div><div class="dst">题${iv}·自${si}/3</div></td>`;
  }).join("");
  const weak = S.questions.filter(q => q.status === "模糊" || q.status === "不会");
  const byCat = {}; weak.forEach(q => byCat[q.cat] = (byCat[q.cat] || 0) + 1);
  const weakHtml = Object.keys(byCat).map(c => `<span class="chip sm">${catName(c)}: ${byCat[c]}</span>`).join("") || "<span class='muted'>暂无薄弱项</span>";
  const todayLog = S.logs[todayStr()] || {};
  const tt = Object.assign({}, todayLog.timeByTab || {});
  if(__tabName){ tt[__tabName] = (tt[__tabName] || 0) + (Date.now() - __tabStart) / 1000; }
  const todayTotal = Object.values(tt).reduce((a,b) => a + b, 0);
  const maxT = Math.max(1, ...Object.values(tt));
  const todayRows = Object.keys(TAB_LABELS).map(k => {
    const sec = tt[k] || 0;
    const pct = Math.round(sec / maxT * 100);
    return `<tr><td>${TAB_LABELS[k]}</td><td>${fmtMin(sec)}</td><td><div class="tbar" style="width:${pct}%"></div></td></tr>`;
  }).join("");
  const weekByTab = {};
  days.forEach(dt => { const l = S.logs[dt]; if(l && l.timeByTab){ Object.keys(l.timeByTab).forEach(k => weekByTab[k] = (weekByTab[k] || 0) + l.timeByTab[k]); } });
  const weekTotal = Object.values(weekByTab).reduce((a,b) => a + b, 0);
  const weekRows = Object.keys(TAB_LABELS).map(k => `<tr><td>${TAB_LABELS[k]}</td><td>${fmtMin(weekByTab[k] || 0)}</td></tr>`).join("");
  const stk = streakDays();
  return `<h1 class="h1">学习计划与台账</h1>
  <section class="card">
    <div class="cardh">本周日历视图 <span class="muted">（题=当日面试题量，自=自我介绍打卡；连续打卡 ${stk} 天）</span></div>
    <table class="cal"><tr>${cells}</tr></table>
  </section>
  <section class="card">
    <div class="cardh">今日各板块学习时长（总计 ${fmtMin(todayTotal)}，当前：${TAB_LABELS[__tabName] || '—'}）</div>
    <table class="tbl"><thead><tr><th>板块</th><th>时长</th><th>占比</th></tr></thead><tbody>${todayRows}</tbody></table>
  </section>
  <section class="card">
    <div class="cardh">本周各板块累计时长（总计 ${fmtMin(weekTotal)}）</div>
    <table class="tbl"><thead><tr><th>板块</th><th>累计时长</th></tr></thead><tbody>${weekRows}</tbody></table>
  </section>
  <section class="card">
    <div class="cardh">薄弱知识点分布</div>
    <div>${weakHtml}</div>
    <div class="row"><button class="btn" data-act="weekly">生成本周复盘报告</button><button class="btn alt" data-act="weeklyExport">导出周报(.txt)</button></div>
    <div id="weeklyOut"></div>
  </section>
  <section class="card">
    <div class="cardh">数据备份 <span class="muted">（强烈建议改版/换设备前导出）</span></div>
    <div class="row">
      <button class="btn" data-act="exportData">导出备份(JSON)</button>
      <button class="btn alt" data-act="importData">导入备份</button>
      <input type="file" id="importFile" accept=".json,application/json" style="display:none" onchange="importData()"/>
    </div>
    <p class="muted">导出文件包含全部题库标记、学习日志、文稿与词汇进度，可随时恢复。</p>
  </section>`;
}

/* ---- 周报（视图内展示 + 导出文本复用） ---- */
function weeklyReportData(){
  const weak = S.questions.filter(q => q.status === "模糊" || q.status === "不会");
  const mastered = S.questions.filter(q => q.status === "掌握").length;
  const total = S.questions.length;
  const rate = total ? Math.round(mastered / total * 100) : 0;
  const byCat = {}; weak.forEach(q => byCat[q.cat] = (byCat[q.cat] || 0) + 1);
  const plan = [];
  if(byCat["专业环市"]) plan.push("补强环境/市政/氮循环概念（好氧反硝化、anammox、人工湿地脱氮）");
  if(byCat["科研深挖"]) plan.push("重练三项研究的'故事线'与被追问救场数据");
  if(byCat["英文"]) plan.push("每天跟读1段英文自我介绍+1篇摘要朗读");
  if(byCat["翻译"]) plan.push("每日精译1句顶刊原文，积累术语");
  if(!plan.length) plan.push("保持节奏，增加广度刷题与英文流利度训练");
  return { weak, mastered, total, rate, byCat, plan };
}
function weeklyReportText(){
  const { weak, mastered, total, rate, byCat, plan } = weeklyReportData();
  const siDays = Object.values(S.logs).filter(l => l.selfIntro && (l.selfIntro.cn || l.selfIntro.en || l.selfIntro.ppt)).length;
  const lines = [];
  lines.push("【推免助手 · 本周复盘报告】");
  lines.push("周期：" + addDays(todayStr(), -6) + " ~ " + todayStr());
  lines.push("· 题库：共 " + total + " 题，已掌握 " + mastered + "（" + rate + "%），薄弱 " + weak.length + "。");
  lines.push("· 薄弱分布：" + (Object.keys(byCat).map(c => catName(c) + " " + byCat[c]).join("、") || "无"));
  lines.push("· 自我介绍打卡：" + siDays + " 天有记录。");
  lines.push("· 连续打卡：" + streakDays() + " 天。");
  lines.push("【下周补强清单】");
  plan.forEach(p => lines.push("  - " + p));
  lines.push("");
  lines.push("（由 PushMian Buddy 生成）");
  return lines.join("\n");
}
function weeklyReport(){
  const { weak, mastered, total, rate, byCat, plan } = weeklyReportData();
  const siDays = Object.values(S.logs).filter(l => l.selfIntro && (l.selfIntro.cn || l.selfIntro.en || l.selfIntro.ppt)).length;
  const out = $("#weeklyOut");
  if(!out) return;
  out.innerHTML = `<div class="docout">
    <p><b>本周复盘报告（${addDays(todayStr(), -6)} ~ ${todayStr()}）</b></p>
    <p>· 题库：共 ${total} 题，已掌握 ${mastered}（${rate}%），薄弱 ${weak.length}。</p>
    <p>· 薄弱分布：${Object.keys(byCat).map(c => catName(c) + " " + byCat[c]).join("、") || "无"}</p>
    <p>· 自我介绍打卡：本周共 ${siDays} 天有记录 | 连续打卡 ${streakDays()} 天</p>
    <p><b>下周补强清单：</b></p><ul>${plan.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
  </div>`;
}

/* ============================================================
   模块C：词汇 & 文献
   ============================================================ */
function viewVocab(){
  const v = S.vocab;
  const dueV = v.filter(x => x.nextReview && x.nextReview <= todayStr() && x.status !== "掌握");
  const rows = v.map((x,i) => `<tr class="${x.status === '不会' ? 'hi' : ''}">
    <td><b>${esc(x.term)}</b></td><td>${esc(x.en)}</td><td>${esc(x.def)}</td>
    <td class="ex">${esc(x.ex || "")}</td><td>${esc(x.syn || "—")}</td>
    <td><span class="st st-${(x.status || '未标记')}">${x.status || '未标记'}</span></td>
    <td><button class="mini" data-act="mv" data-arg="${i}|掌握">掌握</button>
        <button class="mini warn" data-act="mv" data-arg="${i}|模糊">模糊</button>
        <button class="mini bad" data-act="mv" data-arg="${i}|不会">不会</button></td></tr>`).join("");
  return `<h1 class="h1">专业词汇库 & 文献工具</h1>
  <div class="stat">词汇 ${v.length} | 待复习 ${dueV.length} | ${vocabFlash.weakOnly ? '当前闪卡：弱项模式（只背不会/模糊）' : '当前闪卡：全部词汇'}</div>
  ${dueV.length ? `<div class="duebox">今日待复习词汇（${dueV.length}）：${dueV.map(x => esc(x.term)).join("、")}</div>` : ""}

  <section class="card">
    <div class="cardh">中英文对照背诵（闪卡）</div>
    <div class="row">模式：
      <button class="chip ${vocabFlash.mode === 'en2cn' ? 'on' : ''}" onclick="vfMode('en2cn')">英→中</button>
      <button class="chip ${vocabFlash.mode === 'cn2en' ? 'on' : ''}" onclick="vfMode('cn2en')">中→英</button>
      <button class="chip ${vocabFlash.mode === 'mixed' ? 'on' : ''}" onclick="vfMode('mixed')">混合</button>
      <button class="chip ${vocabFlash.weakOnly ? 'on' : ''}" onclick="vfWeak()">弱项模式</button>
      <button class="btn sm" onclick="vfStart()">开始 / 重洗</button>
    </div>
    <div class="vfcard" id="vfCard"><span class="muted">选好模式后点「开始 / 重洗」</span></div>
    <div class="row">
      <button class="btn" onclick="vfReveal()">显示答案</button>
      <button class="btn alt" onclick="vfNext()">下一张</button>
      <button class="mini" onclick="vfMark('掌握')">掌握</button>
      <button class="mini warn" onclick="vfMark('模糊')">模糊</button>
      <button class="mini bad" onclick="vfMark('不会')">不会</button>
    </div>
    <div id="vfProg" class="muted"></div>
  </section>

  <section class="card">
    <div class="cardh">文献翻译练习（英译汉，含参考译文，可编辑）</div>
    <p class="muted">题目来自你上传的文档 + 摘抄的学术句子（不含期刊名）。点「查看参考译文」对照，可标记掌握/不会。</p>
    <div class="row">
      <button class="btn sm" onclick="trStart()">随机来一题 / 重洗</button>
      <button class="btn sm alt" onclick="trNext()">下一题</button>
    </div>
    <div id="trPanel"><span class="muted">点「随机来一题」开始</span></div>
    <div id="trProg" class="muted"></div>
  </section>

  <section class="card">
    <div class="cardh">专业词汇库（海洋微生物 / 氮循环 / 滨海湿地 / eDNA / 市政水处理）</div>
    <div class="scroll"><table class="tbl"><thead><tr><th>术语</th><th>英文</th><th>释义</th><th>论文应用例句</th><th>同义</th><th>状态</th><th>标记</th></tr></thead><tbody>${rows}</tbody></table></div>
  </section>

  <section class="card">
    <div class="cardh">文献翻译总览（${S.translate.length} 题，点击展开查看参考译文）</div>
    <p class="muted">以下为全部文献翻译练习题目，含英译汉参考译文。点击题目展开答案对照；可标记掌握/不会（标"不会"自动进重点复习）。</p>
    <div class="trlist">${S.translate.map((t,i) => {
      const st = t.status || "未标记";
      return `<div class="qitem trrow">
        <div class="qtop"><span class="cat">翻译 ${i + 1}</span><span class="st st-${st}">${st}</span>
          <span class="mbtns"><button class="mini" data-act="trmk" data-arg="${t.id}|掌握">掌握</button><button class="mini warn" data-act="trmk" data-arg="${t.id}|模糊">模糊</button><button class="mini bad" data-act="trmk" data-arg="${t.id}|不会">不会</button></span></div>
        <details class="dbans"><summary class="enq">${wrapWords(esc(t.en))}</summary>
          <div class="ansbox"><b>参考译文：</b><span class="editable" contenteditable="true" data-tid="${t.id}" data-field="cn">${esc(t.cn || "")}</span></div></details>
      </div>`;
    }).join("")}</div>
  </section>

  <section class="card">
    <div class="cardh">文献辅助工具</div>
    <p class="muted">粘贴英文段落，获取精准学术翻译 + 面试可背诵金句提炼。</p>
    <textarea id="litInput" class="ed" placeholder="Paste English paragraph here..."></textarea>
    <div class="row">
      <button class="btn" data-act="litTranslate">学术翻译 + 金句提炼</button>
      <button class="btn alt" data-act="litDaily">今日推荐文献</button>
    </div>
    <div id="litOut"></div>
  </section>

  <section class="card">
    <div class="cardh">每日顶刊推荐（Water Research / ES&T / ISME / MEPS 等）</div>
    <ul class="paperlist">${S.papers.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
    <button class="btn sm" data-act="addPaper">+ 添加文献</button>
  </section>`;
}

/* ============================================================
   重点复习板块（不会题目按类型自动分文件夹）
   ============================================================ */
function viewFocus(){
  const due = S.questions.filter(q => q.status === "不会");
  const dbNo = [];
  S.docbank.sources.forEach(s => s.sections.forEach(sec => sec.items.forEach(it => { if(it.status === "不会") dbNo.push({src:s.title, it}); })));
  const vocabNo = S.vocab.filter(x => x.status === "不会");
  const trNo = S.translate.filter(x => x.status === "不会");
  const wbNo = (S.wordBank || []).filter(w => w.status === "不会");
  if(!due.length && !dbNo.length && !vocabNo.length && !trNo.length && !wbNo.length){
    return `<h1 class="h1">重点复习板块</h1>
    <div class="card"><div class="cardh">暂无【不会】题目</div>
    <p class="muted">在整个工作台任意位置（面试题库A / 真题分区 / 词汇闪卡 / 文献翻译）把题目标记【不会】，都会自动归入本板块。</p>
    <button class="btn" data-tab="bank">前往面试题库 →</button>
    <button class="btn" data-tab="docbank">前往真题分区 →</button>
    <button class="btn" data-tab="vocab">前往词汇文献 →</button></div>`;
  }
  const groups = {};
  due.forEach(q => { (groups[q.cat] = groups[q.cat] || []).push(q); });
  let html = `<h1 class="h1">重点复习板块 · 全工作台"不会"自动归档</h1>
  <div class="stat">题库A 不会 ${due.length} | 真题分区 不会 ${dbNo.length} | 专业词汇 不会 ${vocabNo.length} | 文献翻译 不会 ${trNo.length} | 单词不会 ${wbNo.length}。所有项目持久保留，仅手动点击「掌握/移出」才会移出。</div>`;
  Object.keys(groups).forEach(cat => {
    html += `<section class="card"><div class="cardh">${catName(cat)}（${groups[cat].length}）</div>` + groups[cat].map(q => {
      const st = q.status || "未标记";
      return `<div class="qitem"><div class="qtop"><span class="cat">${catName(q.cat)}</span><span class="st st-${st}">${st}</span>
        <span class="mbtns"><button class="mini" data-act="mk" data-arg="${q.id}|掌握">掌握</button><button class="mini warn" data-act="mk" data-arg="${q.id}|模糊">模糊</button><button class="mini bad" data-act="mk" data-arg="${q.id}|不会">不会</button></span></div>
        <div class="qq"><span class="editable" contenteditable="true" data-eid="${q.id}" data-field="q">${esc(q.q)}</span></div>
        ${q.key ? `<div class="qqkey"><b>关键词：</b><span class="editable" contenteditable="true" data-eid="${q.id}" data-field="key">${esc(q.key)}</span></div>` : ""}
        ${q.tip ? `<div class="qqtip"><b>加分：</b>${esc(q.tip)}</div>` : ""}
        ${q.pit ? `<div class="qqpit"><b>避坑：</b>${esc(q.pit)}</div>` : ""}
        <details class="dbans"><summary>查看完整答案</summary><div class="ansbox editable" contenteditable="true" data-eid="${q.id}" data-field="ans">${esc(q.ans || "")}</div></details>
      </div>`;
    }).join("") + `</section>`;
  });
  if(dbNo.length){
    html += `<section class="card"><div class="cardh">真题分区 · 不会（${dbNo.length}）<span class="muted">— 来自真题分区，标记掌握/模糊即移出</span></div>`;
    const bySrc = {}; dbNo.forEach(x => { (bySrc[x.src] = bySrc[x.src] || []).push(x.it); });
    Object.keys(bySrc).forEach(t => {
      html += `<div class="ivcat">${esc(t)}（${bySrc[t].length}）</div><ul class="ivlist">` + bySrc[t].map(it => {
        return `<li class="qitem"><div class="qtop"><span class="cat">真题分区</span><span class="st st-不会">不会</span>
          <span class="mbtns"><button class="mini" data-act="dbmk" data-arg="${it.id}|掌握">掌握</button><button class="mini warn" data-act="dbmk" data-arg="${it.id}|模糊">模糊</button></span></div>
          <div class="qq">${esc(it.q)}</div>
          <details class="dbans"><summary>查看答案</summary><div class="ansbox">${esc(it.ans || "")}</div></details></li>`;
      }).join("") + `</ul>`;
    });
    html += `</section>`;
  }
  if(vocabNo.length){
    html += `<section class="card"><div class="cardh">专业词汇 · 不会（${vocabNo.length}）<span class="muted">— 来自词汇闪卡/词汇表，标记掌握/模糊即移出</span></div><ul class="ivlist">`;
    html += vocabNo.map(x => {
      const idx = S.vocab.indexOf(x);
      return `<li class="qitem"><div class="qtop"><span class="cat">词汇</span><span class="st st-不会">不会</span>
        <span class="mbtns"><button class="mini" data-act="vmk" data-arg="${idx}|掌握">掌握</button><button class="mini warn" data-act="vmk" data-arg="${idx}|模糊">模糊</button></span></div>
        <div class="qq"><b>${esc(x.term)}</b> <span class="muted">${esc(x.en)}</span></div>
        ${x.def ? `<div class="qqkey">${esc(x.def)}</div>` : ""}
        ${x.ex ? `<div class="ivans tip"><span class="lab">例句</span>${esc(x.ex)}</div>` : ""}</li>`;
    }).join("");
    html += `</ul></section>`;
  }
  if(trNo.length){
    html += `<section class="card"><div class="cardh">文献翻译 · 不会（${trNo.length}）<span class="muted">— 来自文献翻译练习，标记掌握/模糊即移出</span></div><ul class="ivlist">`;
    html += trNo.map(t => {
      return `<li class="qitem"><div class="qtop"><span class="cat">翻译</span><span class="st st-不会">不会</span>
        <span class="mbtns"><button class="mini" data-act="trmk" data-arg="${t.id}|掌握">掌握</button><button class="mini warn" data-act="trmk" data-arg="${t.id}|模糊">模糊</button></span></div>
        <div class="qq enq">${esc(t.en)}</div>
        <details class="dbans"><summary>查看参考译文</summary><div class="ansbox">${esc(t.cn || "")}</div></details></li>`;
    }).join("");
    html += `</ul></section>`;
  }
  if(wbNo.length){
    html += `<section class="card"><div class="cardh">单词 · 不会（${wbNo.length}）<span class="muted">— 从文献翻译练习点词标记加入，移出需手动点击</span><button class="btn sm alt" data-act="wordBankPractice" style="float:right">抽词背诵</button></div><ul class="ivlist">`;
    html += wbNo.map(w => {
      return `<li class="qitem"><div class="qtop"><span class="cat">单词</span><span class="st st-不会">不会</span>
        <span class="mbtns"><button class="mini" data-act="wbRem" data-arg="${esc(w.word)}">移出（已掌握）</button></span></div>
        <div class="qq"><b style="font-size:16px;color:var(--blue)">${esc(w.raw || w.word)}</b> ${w.zh ? `<span class="muted">— ${esc(w.zh)}</span>` : '<span class="muted">— 暂无中文释义</span>'}</div>
        ${w.ctx ? `<details class="dbans"><summary>所在句子</summary><div class="ansbox">${esc(w.ctx)}</div></details>` : ""}
      </li>`;
    }).join("");
    html += `</ul></section>`;
  }
  return html;
}

/* ============================================================
   真题分区：文档总库（来自用户上传的 6 份文档）
   ============================================================ */
function dbUpdate(id, field, val){
  for(const s of S.docbank.sources){
    for(const sec of s.sections){
      const it = sec.items.find(x => x.id === id);
      if(it){ it[field] = val; save(); return; }
    }
  }
}
function dbItem(id){
  for(const s of S.docbank.sources){
    for(const sec of s.sections){
      const it = sec.items.find(x => x.id === id);
      if(it) return it;
    }
  }
  return null;
}
function dbMark(id, status){
  const it = dbItem(id);
  if(it){ it.status = status; if(status === "掌握") it.nextReview = ""; else it.nextReview = addDays(todayStr(), INTERVALS[0]); save(); }
}
function dbFilter(v){
  v = (v || "").toLowerCase();
  document.querySelectorAll("#app .dbitem").forEach(el => {
    el.style.display = (!v || el.innerText.toLowerCase().includes(v)) ? "" : "none";
  });
}
function viewDocBank(){
  const db = S.docbank;
  const srcs = db.sources;
  const cur = DOCBANK_SRC || "all";
  const tabs = [["all","全部文档总库"]].concat(srcs.map(s => [s.id, s.title])).map(([id,name]) =>
     `<button class="chip ${cur === id ? 'on' : ''}" data-act="dbSrc" data-arg="${id}">${esc(name)}</button>`).join("");
  const total = srcs.reduce((a,s) => a + s.sections.reduce((b,sec) => b + sec.items.length, 0), 0);
  function renderSource(s){
    let h = `<div class="docsrc"><div class="docdesc">${esc(s.desc || "")}</div>`;
    s.sections.forEach(sec => {
      h += `<section class="card"><div class="cardh">${esc(sec.name)}（${sec.items.length}）</div>`;
      h += sec.items.map(it => {
        const st = it.status || "未标记";
        return `<div class="qitem dbitem" data-qid="${it.id}">
          <div class="qtop"><span class="dbid">#${esc(it.id)}</span>
            <span class="st st-${st}">${st}</span>
            <span class="mbtns">
              <button class="mini" data-act="dbmk" data-arg="${it.id}|掌握">掌握</button>
              <button class="mini warn" data-act="dbmk" data-arg="${it.id}|模糊">模糊</button>
              <button class="mini bad" data-act="dbmk" data-arg="${it.id}|不会">不会</button>
              <button class="mini" data-act="dbDel" data-arg="${it.id}">删除</button>
            </span></div>
          <div class="qq"><span class="editable" contenteditable="true" data-did="${it.id}" data-field="q">${esc(it.q)}</span></div>
          <details class="dbans"><summary>查看 / 编辑答案</summary>
            <div class="editable ansbox" contenteditable="true" data-did="${it.id}" data-field="ans">${esc(it.ans || "")}</div>
          </details>
        </div>`;
      }).join("");
      h += `<button class="btn sm" data-act="dbAdd" data-arg="${s.id}|${esc(sec.name)}">+ 在本板块添加题目</button>`;
      h += `</section>`;
    });
    h += `</div>`;
    return h;
  }
  let body = "";
  if(cur === "all"){ body = srcs.map(renderSource).join(""); }
  else { const s = srcs.find(x => x.id === cur); body = s ? renderSource(s) : "<p class='muted'>未找到该文档</p>"; }
  return `<h1 class="h1">真题分区 · 文档总库</h1>
  <div class="stat">共收录 ${total} 条（来自你上传的 6 份文档）。所有题目与答案均可直接点击编辑、自行添加录入；可标记掌握/模糊/不会，标「不会」自动进重点复习。</div>

  <section class="card">
    <div class="cardh">英语听力 · 随机抽题播报</div>
    <div class="row">
      <button class="btn" onclick="enListenPick()">随机抽题并语音播报</button>
      <span class="muted">用英语朗读一道英文面试题；再点题目/答案查看文本对照。</span>
    </div>
    <div id="enListenBox">${enListenHtml()}</div>
  </section>

  <div class="filters">
    <div class="srcbar">${tabs}</div>
    <input class="search" id="dbSearch" placeholder="搜索题目/关键词..." oninput="dbFilter(this.value)"/>
  </div>
  ${body}`;
}