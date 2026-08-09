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
  const editing = S.profile.locked === true;
  return `
  <h1 class="h1">${editing ? "编辑个人资料" : "欢迎使用推免工作台"}</h1>
  <p class="muted" style="margin-bottom:16px">${editing ? "修改后的资料会同步显示在首页，并保存在当前浏览器。" : "首次使用请填写基本信息，这些信息会显示在首页和导出报告中。填写后可随时在「学习台账」中修改。"}</p>
  <section class="card">
    <div class="cardh">填写个人信息</div>
    <div class="setupform">
      <label class="setuplabel">姓名 <input class="setupinput" id="setupName" value="${esc(S.profile.name)}" placeholder="例：张三"/></label>
      <label class="setuplabel">学校 · 学院 <input class="setupinput" id="setupSchool" value="${esc(S.profile.school)}" placeholder="例：浙江大学 · 计算机科学与技术学院"/></label>
      <label class="setuplabel">专业 <input class="setupinput" id="setupMajor" value="${esc(S.profile.major)}" placeholder="例：计算机科学与技术（本科）"/></label>
      <label class="setuplabel">GPA <input class="setupinput" id="setupGpa" value="${esc(S.profile.gpa)}" placeholder="例：4.07 / 5.0"/></label>
      <label class="setuplabel">排名 <input class="setupinput" id="setupRank" value="${esc(S.profile.rank)}" placeholder="例：专业第二（绩点/综测）"/></label>
      <label class="setuplabel">目标方向 <input class="setupinput" id="setupTarget" value="${esc(S.profile.target)}" placeholder="例：计算机视觉 / 人工智能"/></label>
    </div>
    <div class="row" style="margin-top:16px">
      <button class="btn" data-act="saveSetup">${editing ? "保存修改" : "保存并进入"}</button>
      ${editing ? '<button class="btn sm alt" data-act="cancelSetup">取消</button>' : '<button class="btn sm alt" data-act="skipSetup">跳过，稍后填写</button>'}
    </div>
  </section>`;
}

/* ============================================================
   首屏工作台
   ============================================================ */
function viewHome(){
  const d = getDay();
  const qById = id => S.questions.find(q => q.id === id);
  const priRank = p => p === "高" ? 0 : p === "中" ? 1 : 2;
  const radar = S.radar.slice().sort((a,b) => priRank(a.priority) - priRank(b.priority));
  const safeLink = l => /^(https?:\/\/|mailto:)/i.test(l || "") ? `<a href="${esc(l)}" target="_blank" rel="noopener">链接</a>` : (l ? `<span class="muted">${esc(l)}</span>` : "—");
  const radarRows = radar.map(r => `<tr class="${r.priority === '高' ? 'hi' : ''}">
    <td>${esc(r.school)}</td><td>${esc(r.college)}</td><td>${esc(r.major)}</td>
    <td><span class="tag">${esc(r.type)}</span></td>
    <td>${esc(r.deadline)} ${dueBadge(r.deadline)}</td>
    <td>${safeLink(r.link)}</td>
    <td>${r.match === "是" ? '<b class="ok">匹配</b>' : esc(r.match)}</td>
    <td><span class="pri ${r.priority}">${r.priority}</span></td>
    <td>${esc(r.status)}</td><td class="note">${esc(r.note || "")}</td></tr>`).join("");

  const reviewItems = (d.plan.review || []).map(qById).filter(Boolean).map(q => `<li>${esc(q.q)} <span class="mini">[${catName(q.cat)}]</span>${srcTag(q)}</li>`).join("") || "<li class='muted'>暂无可复习项（去标记模糊/不会的题目会自动进入）</li>";
  const newItems = (d.plan.newInterview || []).slice(0, 3).map(qById).filter(Boolean).map(q => `<li>${esc(q.q)}${srcTag(q)}</li>`).join("") || "<li class='muted'>—</li>";
  const consItems = (d.plan.consolidate || []).map(qById).filter(Boolean).map(q => `<li>${esc(q.q)}${srcTag(q)}</li>`).join("") || "<li class='muted'>—</li>";

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
      ${srcTag(q)}
      <details class="dbans"><summary><span class="lab">参考答案</span><span class="muted">${(q.ans || "").length > 160 ? "（长答案，点击展开）" : ""}</span></summary><div class="ivans"><span class="editable" contenteditable="true" data-eid="${attr(q.id)}">${mdHtml(q.ans || "")}</span></div></details>
      ${q.tip ? `<div class="ivans tip"><span class="lab">加分</span>${esc(q.tip)}</div>` : ""}
      ${q.pit ? `<div class="ivans pit"><span class="lab">避坑</span>${esc(q.pit)}</div>` : ""}
      ${q.extra ? `<div class="ivans extra"><span class="lab">思考</span>${esc(q.extra)}</div>` : ""}
      <span class="mbtns">
        <button class="mini" data-act="mk" data-arg="${attr(q.id)}|掌握">已掌握</button>
        <button class="mini warn" data-act="mk" data-arg="${attr(q.id)}|模糊">模糊</button>
        <button class="mini bad" data-act="mk" data-arg="${attr(q.id)}|不会">不会</button>
      </span></li>`).join("");
    return `<div class="ivcat">${catName(cat)}（${ivGroups[cat].length}）</div><ul class="ivlist">${items}</ul>`;
  }).join("");

  const enc = S.settings.intensity === "low" ? `<div class="warnbar">⚠️ 节奏管理：检测到连续两天未完成任务，今日任务强度已自动下调，请轻装前进，稳住状态。</div>` : "";
  const prog = todaysProgress();
  const stk = streakDays();

  return `
  ${enc}
  <div class="cmdbar">
    <button class="cmd" data-jump="home" data-anchor="planSec">今日计划</button>
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
    <p class="muted" style="margin:6px 0 0">完成项 = 自我介绍三件套打卡 + 当日模拟面试题已标记 + 复习队列已标记。</p>
  </section>

  <section class="card">
    <div class="cardh">信息雷达 <span class="muted">（仅推送新增 + 3天内截止；高优先级置顶；截止倒计时自动标注）</span></div>
    <div class="scroll"><table class="tbl"><thead><tr><th>学校/所</th><th>学院/系</th><th>专业方向</th><th>类型</th><th>截止</th><th>链接</th><th>匹配</th><th>优先级</th><th>状态</th><th>备注</th></tr></thead><tbody>${radarRows}</tbody></table></div>
    <button class="btn sm" data-act="addRadar">+ 新增通知</button>
  </section>

  <section class="card" id="planSec">
    <div class="cardh">今日学习计划（三栏待办）</div>
    <div class="three">
      <div class="col"><div class="colh new">新学内容</div><ul>${newItems}<li>新词汇：<b>${esc(d.plan.newVocab || "")}</b></li><li>文献：<b>${esc(d.plan.paper || "")}</b></li></ul></div>
      <div class="col"><div class="colh rev">复习内容（SM-2 到期待复习）</div><ul>${reviewItems}</ul></div>
      <div class="col"><div class="colh con">巩固内容（已掌握${S.settings.intensity === "low" ? "随机1道" : "随机3道"}）</div><ul>${consItems}</ul></div>
    </div>
  </section>

  ${siBox}

  <section class="card" id="todayIvSec">
    <div class="cardh">今日模拟面试习题（中文 ${iv.filter(q => ["基础","数据结构","计算机组成原理","操作系统","计算机网络","深度学习","AI智能体","项目经历","生物信息","科研深挖"].includes(q.cat)).length} + 英文 ${iv.filter(q => q.cat === "英文").length} + 翻译 ${iv.filter(q => q.cat === "翻译").length}）</div>
    ${ivHtml}
    <div class="row">
      <button class="btn" data-act="regenDay">重新生成今日面试</button>
      <button class="btn alt" data-act="fullInterview">进入全真面试模式（科研深挖追问）</button>
      <button class="btn sm" data-act="saveLog">保存今日学习日志</button>
    </div>
    <div class="lognote"><label for="lognote">今日日志备注 <span class="autosavehint">输入后自动保存</span></label><textarea id="lognote" placeholder="记录薄弱知识点、掌握情况...">${esc(d.note || "")}</textarea></div>
  </section>`;
}

/* ============================================================
   模块A：面试题库
   ============================================================ */
function viewBank(){
  if(!bankFilterState) bankFilterState = { cat:"", st:"全部" }; // 仅首次进入时初始化，切换 tab 不丢筛选状态
  const cats = ["基础","数据结构","计算机组成原理","操作系统","计算机网络","深度学习","AI智能体","项目经历","生物信息","科研深挖","英文","翻译","词汇翻译"];
  const stat = ["全部","未标记","掌握","模糊","不会","收藏"];
  const comp = getIvComp();
  const srcOpts = [...new Set(S.questions.map(q => (q.src || "").split(" · ")[0]).filter(Boolean))].sort();
  const filterBar = `<div class="filters">
    分类：${cats.map(c => `<button class="chip" data-act="bf" data-arg="cat:${c}">${catName(c)}</button>`).join("")}
    状态：${stat.map(s => `<button class="chip" data-act="bf" data-arg="st:${s}">${s === "收藏" ? "收藏" : s}</button>`).join("")}
    <input class="search" id="qsearch" value="${esc(bankFilterState.w || "")}" placeholder="搜索题干/关键词/来源..." oninput="bankFilter(this.value)"/>
    <select class="search" id="qsrc" onchange="bankSrc(this.value)"><option value="">全部来源</option>${srcOpts.map(x => `<option value="${esc(x)}" ${bankFilterState.src === x ? 'selected' : ''}>${esc(x)}</option>`).join("")}</select>
    <button class="btn sm" data-act="randQ">随机抽题</button>
    <button class="btn sm alt" data-act="fullInterview">全真面试模式</button>
    <button class="btn sm fire" data-act="focusReview">重点复习（不会 ${S.questions.filter(q => q.status === "不会").length}）</button>
    <button class="btn sm" data-act="showImport">+ 批量导入题目</button>
  </div>`;
  const due = dueReview();
  const dueHtml = due.length ? `<div class="duebox">待复习队列（${due.length}）：` + due.map(q => `<span class="chip sm" data-act="focusQ" data-arg="${attr(q.id)}">${esc(q.q.slice(0, 18))}</span>`).join("") + `</div>` : "";
  const favN = S.questions.filter(q => q.fav).length;
  return `<h1 class="h1">模拟面试题库</h1>
    <div class="stat">总题量 ${S.questions.length} | 掌握 ${S.questions.filter(q => q.status === "掌握").length} | 模糊 ${S.questions.filter(q => q.status === "模糊").length} | 不会 ${S.questions.filter(q => q.status === "不会").length} | 收藏 ${favN} | 待复习 ${due.length}</div>

  <section class="card">
    <div class="cardh">英语听力 · 随机抽题播报</div>
    <div class="row">
      <button class="btn" data-act="enListenPick">随机抽题并语音播报</button>
      <span class="muted">点击后用英语朗读一道英文面试题，再点题目/答案查看对照。</span>
    </div>
    <div id="enListenBox">${enListenHtml()}</div>
  </section>

    ${filterBar}${dueHtml}
    <div id="qlist"></div>
    <div id="bankfoot"></div>

  <section class="card">
    <div class="cardh">全真模拟面试 · 各分类题量配比 <span class="muted">（进入全真模拟时按此抽题，可随时改）</span></div>
    <div class="ivcomp">
      ${IV_COMP_CATS.map(c => `<label class="ivcomprow"><span>${catName(c)}</span><input class="setnum" type="number" min="0" max="20" data-ivc="${c}" value="${comp[c]}"/></label>`).join("")}
    </div>
    <div class="row"><button class="btn sm" data-act="saveIvComp">保存配比</button><button class="btn sm alt" data-act="ivReset">恢复默认</button></div>
  </section>

  <section class="card">
    <div class="cardh">文献翻译（${S.translate.length} 题 · 英译汉，含参考译文）</div>
    <p class="muted">以下为全部文献翻译练习题目，点击英文单词会把该单词发送到第三方词典/翻译服务查询；请勿在上下文中放入敏感信息。点击题目可展开参考译文并标记进度。</p>
    <div class="scroll">${S.translate.map(t => `<details class="dbans"><summary class="enq">${wrapWords(esc(t.en))}</summary>
      <div class="ansbox"><b>参考译文：</b><span class="editable" contenteditable="true" data-tid="${attr(t.id)}" data-field="cn">${esc(t.cn || "")}</span></div>
      <div class="row"><button class="mini" data-act="trmk" data-arg="${attr(t.id)}|掌握">掌握</button><button class="mini warn" data-act="trmk" data-arg="${attr(t.id)}|模糊">模糊</button><button class="mini bad" data-act="trmk" data-arg="${attr(t.id)}|不会">不会</button></div>
    </details>`).join("")}</div>
  </section>`;
}

/* ---- 题目来源标签（文件 · 章节）---- */
function srcTag(q){
  return q && q.src ? `<div class="ivsrc"><span class="lab">来源</span>${esc(q.src)}</div>` : "";
}

/* ---- 题库条目统一渲染（列表初始渲染与筛选重建共用） ---- */
function bankItemHtml(q){
  const st = safeStatus(q.status);
  return `<div class="qitem" data-id="${attr(q.id)}"><div class="qtop"><span class="cat">${catName(q.cat)}</span><span class="st st-${st}">${st}</span>
    <span class="mbtns">
      <button class="mini ${q.fav ? 'fav-on' : ''}" data-act="fav" data-arg="${attr(q.id)}" title="收藏/取消">${q.fav ? "★" : "☆"}</button>
      <button class="mini" data-act="spkQ" data-arg="${attr(q.id)}" title="朗读题目+关键词">朗读</button>
      <button class="mini" data-act="copyQans" data-arg="${attr(q.id)}" title="复制题目+答案">复制答案</button>
      <button class="mini" data-act="mk" data-arg="${attr(q.id)}|掌握">掌握</button><button class="mini warn" data-act="mk" data-arg="${attr(q.id)}|模糊">模糊</button><button class="mini bad" data-act="mk" data-arg="${attr(q.id)}|不会">不会</button>
    </span></div>
    <div class="qq"><span class="editable" contenteditable="true" data-eid="${attr(q.id)}" data-field="q">${esc(q.q)}</span></div>
    ${srcTag(q)}
    ${q.key ? `<div class="qqkey"><b>关键词：</b><span class="editable" contenteditable="true" data-eid="${attr(q.id)}" data-field="key">${esc(q.key)}</span></div>` : ""}
    ${q.tip ? `<div class="qqtip"><b>加分：</b>${esc(q.tip)}</div>` : ""}
    ${q.pit ? `<div class="qqpit"><b>避坑：</b>${esc(q.pit)}</div>` : ""}
    ${q.extra ? `<div class="qqextra"><b>延伸：</b>${esc(q.extra)}</div>` : ""}
    <details class="dbans"><summary>查看完整答案</summary>
      <div class="ansbox editable" contenteditable="true" data-eid="${attr(q.id)}" data-field="ans">${mdHtml(q.ans || "")}</div>
    </details>
  </div>`;
}

/* ---- 题库筛选/搜索（统一状态机：分类/状态/关键词 一次性重建，chip 高亮） ---- */
let bankFilterState = { cat:"", st:"全部", src:"", w:"" };
const BANK_PAGE_SIZE = 30; // 每页题量，避免一次性渲染 1656 题卡顿
let bankPage = 1;           // 已加载页数
let bankListCache = [];     // 当前筛选结果缓存（供分页追加）
function bankApplyFilters(){
  let list = S.questions.slice();
  if(bankFilterState.cat) list = list.filter(q => q.cat === bankFilterState.cat);
  if(bankFilterState.st === "收藏") list = list.filter(q => q.fav);
  else if(bankFilterState.st !== "全部") list = list.filter(q => (q.status || "未标记") === bankFilterState.st);
  if(bankFilterState.src) list = list.filter(q => (q.src || "").split(" · ")[0] === bankFilterState.src);
  return list;
}
function bankItemsHtml(items){ return items.map(bankItemHtml).join(""); }
function bindBankFoot(list, shown){
  const foot = $("#bankfoot");
  if(!foot) return;
  foot.innerHTML = (shown < list.length)
    ? `<div class="row"><button class="btn sm" data-act="bankFeed">载入更多（已显示 ${shown}/${list.length}）</button></div>`
    : "";
}
function renderBankList(resetPage){
  const inp = $("#qsearch");
  const w = (inp ? inp.value : "").toLowerCase().trim();
  bankFilterState.w = w; // 同步搜索词：全量重渲染（如切 tab）后能恢复搜索
  let list = bankApplyFilters();
  if(w) list = list.filter(q => (q.q + " " + (q.ans || "") + " " + (q.src || "")).toLowerCase().includes(w));
  bankListCache = list;
  if(resetPage) bankPage = 1;
  const box = $("#qlist");
  if(!box) return;
  const shown = Math.min(bankPage * BANK_PAGE_SIZE, list.length);
  box.innerHTML = bankItemsHtml(list.slice(0, shown)) || "<p class='muted'>无匹配题目</p>";
  bindBankFoot(list, shown);
  bindCommon();
}
function bankFeed(){
  const box = $("#qlist"), foot = $("#bankfoot");
  if(!box || !bankListCache.length) return;
  const start = bankPage * BANK_PAGE_SIZE;
  const chunk = bankListCache.slice(start, start + BANK_PAGE_SIZE);
  if(!chunk.length) return;
  bankPage++;
  box.insertAdjacentHTML("beforeend", bankItemsHtml(chunk));
  bindBankFoot(bankListCache, bankPage * BANK_PAGE_SIZE);
  bindCommon();
}
function filterBank(arg){
  const [k,v] = arg.split(":");
  if(k === "cat") bankFilterState.cat = (bankFilterState.cat === v) ? "" : v;
  else if(k === "st") bankFilterState.st = (bankFilterState.st === v) ? "全部" : v;
  document.querySelectorAll("[data-act='bf']").forEach(b => {
    const [bk,bv] = b.dataset.arg.split(":");
    const active = (bk === "cat" && bankFilterState.cat === bv) || (bk === "st" && bankFilterState.st === bv);
    b.classList.toggle("on", active);
  });
  renderBankList(true);
}
function bankFilter(v){
  renderBankList(true);
}
function bankSrc(v){
  bankFilterState.src = v;
  renderBankList(true);
}

/* ---- 批量导入题目（粘贴文档/文本自动切分） ---- */
function showImport(){
  const cats = ["基础","数据结构","计算机组成原理","操作系统","计算机网络","科研深挖","英文","翻译"];
  const panel = `<section class="card" id="importPanel"><div class="cardh">+ 批量导入题目（支持从论文/课件/笔记粘贴文本）</div>
    <div class="row">归类到：<select id="impCat">${cats.map(c => `<option value="${c}">${catName(c)}</option>`).join("")}</select> | <span class="muted">每行一道题，或用空行分隔</span></div>
    <textarea id="impText" class="ed" placeholder="例：&#10;B+树与哈希索引的区别？&#10;TCP 拥塞控制有哪些阶段？&#10;进程与线程的本质区别是什么？"></textarea>
    <div class="row"><button class="btn" data-act="doImport">解析并入库</button><button class="btn sm" data-act="cancelImport">取消</button></div>
    <div id="impOut" class="muted"></div></section>`;
  const root = $("#app");
  updateBottomNav("bank");
  document.title = "批量导入题目 · PushMian Buddy";
  root.innerHTML = navBar("bank") + `<main class="main" id="mainContent" tabindex="-1"><h1 class="h1">模拟面试题库</h1>${panel}</main>`;
  bindCommon();
}
function doImport(){
  const ta = $("#impText");
  if(!ta || !ta.value.trim()){ flash("请先粘贴题目文本", "warn"); return; }
  const cat = $("#impCat").value;
  const lines = ta.value.split(/\n+/).map(s => s.trim()).filter(Boolean);
  const cand = [];
  lines.forEach(line => {
    const clean = line.replace(/^[0-9]+[.、)]\s*/, "").replace(/^[Qq][0-9]*[.、)]\s*/, "");
    if(clean.length < 4) return;
    cand.push({ id: uid(), cat, q: clean, ans: "（待补充：点击参考答案处直接编辑）", tip:"", pit:"", extra:"", key:"", status:"未标记", nextReview:"", reviewStage:0, fav:false });
  });
  if(!cand.length){ flash("未解析到有效题目（每行至少4字）", "warn"); return; }
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
      <button class="chk checkbtn ${s[key === 'cn_short' ? 'cn' : key === 'en_short' ? 'en' : 'ppt'] ? 'done' : ''}" data-act="siToggle" data-arg="${key === 'cn_short' ? 'cn' : key === 'en_short' ? 'en' : 'ppt'}" aria-pressed="${s[key === 'cn_short' ? 'cn' : key === 'en_short' ? 'en' : 'ppt'] ? 'true' : 'false'}">${s[key === 'cn_short' ? 'cn' : key === 'en_short' ? 'en' : 'ppt'] ? '今日已打卡' : '今日未打卡'}</button>
    </section>`;
  return `<h1 class="h1">自我介绍专项训练</h1>
  <div class="stat">三套文稿输入后自动保存，跨会话持续生效。下方「秒表 + 语音输入」：边背边计时，背完看语音转文字逐句纠错。</div>

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
    <p class="muted">点「开始语音输入」→ 允许麦克风 → 背诵 → 实时转写；背完点「停止」对照文稿纠错。<b>提示：Chrome 语音识别走 Google 云服务，国内常报"网络错误"；请用 <u>Edge 浏览器</u>（走微软服务）重试</b>。若仍不行，直接把口述文字粘贴到下方文本框。</p>
    <textarea class="ed tall" id="introVoice" placeholder="对着麦克风背诵，语音会自动转写到这里；背完后对照上方文稿逐句纠错..."></textarea>
  </section>

  ${introCard("①","简短中文自我介绍（1–2分钟通用版）","cn_short",false)}
  ${introCard("②","简短英文自我介绍（1–2分钟通用版）","en_short",false)}
  ${introCard("③","PPT 完整版自我介绍（5–8分钟复试汇报版）","ppt_full",true)}`;
}

function introCoach(type){
  if(type === "cn") return "【中文自我介绍背诵检查】\n请现在口述你的1–2分钟中文自我介绍（参照模块B文稿）。\n口述完成后，请告诉我：① 是否卡顿/超时；② 哪一句最不流畅；③ 是否有冗余废话。\n我会针对流畅度、逻辑、时间把控、语言冗余进行点评并修正措辞。\n（也可直接把你的口述文字粘贴给我，我来批改。）";
  if(type === "en") return "【English Self-Intro Check】\nPlease recite your 1–2 min English intro now.\nAfter that, tell me: ① any hesitation/over-time; ② the weakest sentence; ③ filler words used.\nI'll give feedback on fluency, logic, timing, and wordiness, and polish your phrasing.";
  if(type === "ppt") return "【PPT 完整版模拟汇报 · 评委模式】\n你将进行5–8分钟完整讲述（科学问题→方法→结果→意义→未来设想）。\n我（评委）会在中途随机打断提问，例如：\n· '你的 baseline 公平吗？消融实验做了吗？'\n· '这个方法的时间/空间复杂度是多少？'\n· '如何证明你的结果不是调参运气？'\n· '这个系统在生产环境能落地吗？'\n讲述结束后我会给你综合评分与改进建议。\n（在对话中直接开始讲述，我会适时打断。）";
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
    <div class="cardh">个人资料</div>
    <div class="profilegrid">
      <div><span>姓名</span><b>${esc(S.profile.name || "未填写")}</b></div>
      <div><span>学校</span><b>${esc(S.profile.school || "未填写")}</b></div>
      <div><span>专业</span><b>${esc(S.profile.major || "未填写")}</b></div>
      <div><span>目标方向</span><b>${esc(S.profile.target || "未填写")}</b></div>
    </div>
    <button class="btn sm" data-act="editProfile">编辑个人资料</button>
  </section>
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
  if(byCat["计算机网络"]) plan.push("补强计算机网络概念（TCP/UDP、三次握手、拥塞控制、DNS）");
  if(byCat["数据结构"]) plan.push("重练算法题与复杂度分析（排序/哈希/树/图/DP）");
  if(byCat["计算机组成原理"]) plan.push("巩固组成原理（数据表示/存储层次/Cache/指令系统/中断流水线）");
  if(byCat["操作系统"]) plan.push("巩固操作系统核心（进程线程、同步、虚拟内存、调度）");
  if(byCat["科研深挖"]) plan.push("重练科研项目的'故事线'与被追问救场数据（baseline/消融/异常处理）");
  if(byCat["英文"]) plan.push("每天跟读1段英文自我介绍+1篇摘要朗读");
  if(byCat["翻译"]) plan.push("每日精译1句顶刊原文，积累术语");
  if(!plan.length) plan.push("保持节奏，增加广度刷题与英文流利度训练");
  return { weak, mastered, total, rate, byCat, plan };
}
function recentWeekLogs(){
  const days = []; for(let i=0;i<7;i++) days.push(addDays(todayStr(), -i));
  return days.map(d => S.logs[d]).filter(Boolean);
}
function weeklyReportText(){
  const { weak, mastered, total, rate, byCat, plan } = weeklyReportData();
  const siDays = recentWeekLogs().filter(l => l.selfIntro && (l.selfIntro.cn || l.selfIntro.en || l.selfIntro.ppt)).length;
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
  const siDays = recentWeekLogs().filter(l => l.selfIntro && (l.selfIntro.cn || l.selfIntro.en || l.selfIntro.ppt)).length;
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
  const dueV = v.filter(x => x.nextReview && x.nextReview <= todayStr());
  const rows = v.map((x,i) => { const vst=safeStatus(x.status); return `<tr class="${vst === '不会' ? 'hi' : ''}">
    <td><b>${esc(x.term)}</b></td><td>${esc(x.en)}</td><td>${esc(x.def)}</td>
    <td class="ex">${esc(x.ex || "")}</td><td>${esc(x.syn || "—")}</td>
    <td><span class="st st-${vst}">${vst}</span></td>
    <td><button class="mini" data-act="mv" data-arg="${i}|掌握">掌握</button>
        <button class="mini warn" data-act="mv" data-arg="${i}|模糊">模糊</button>
        <button class="mini bad" data-act="mv" data-arg="${i}|不会">不会</button></td></tr>`; }).join("");
  return `<h1 class="h1">专业词汇库 & 文献工具</h1>
  <div class="stat">词汇 ${v.length} | 待复习 ${dueV.length} | ${vocabFlash.weakOnly ? '当前闪卡：弱项模式（只背不会/模糊）' : '当前闪卡：全部词汇'}</div>
  ${dueV.length ? `<div class="duebox">今日待复习词汇（${dueV.length}）：${dueV.map(x => esc(x.term)).join("、")}</div>` : ""}

  <section class="card">
    <div class="cardh">中英文对照背诵（闪卡）</div>
    <div class="row">模式：
      <button class="chip ${vocabFlash.mode === 'en2cn' ? 'on' : ''}" data-act="vfMode" data-arg="en2cn">英→中</button>
      <button class="chip ${vocabFlash.mode === 'cn2en' ? 'on' : ''}" data-act="vfMode" data-arg="cn2en">中→英</button>
      <button class="chip ${vocabFlash.mode === 'mixed' ? 'on' : ''}" data-act="vfMode" data-arg="mixed">混合</button>
      <button class="chip ${vocabFlash.weakOnly ? 'on' : ''}" data-act="vfWeak">弱项模式</button>
      <button class="btn sm" data-act="vfStart">开始 / 重洗</button>
    </div>
    <div class="vfcard" id="vfCard"><span class="muted">选好模式后点「开始 / 重洗」</span></div>
    <div class="row">
      <button class="btn" data-act="vfReveal">显示答案</button>
      <button class="btn alt" data-act="vfNext">下一张</button>
      <button class="mini" data-act="vfMark" data-arg="掌握">掌握</button>
      <button class="mini warn" data-act="vfMark" data-arg="模糊">模糊</button>
      <button class="mini bad" data-act="vfMark" data-arg="不会">不会</button>
    </div>
    <div id="vfProg" class="muted"></div>
  </section>

  <section class="card">
    <div class="cardh">文献翻译练习（英译汉，含参考译文，可编辑）</div>
    <p class="muted">题目来自你上传的文档 + 摘抄的学术句子。点击单词会把该单词发送到第三方词典/翻译服务查询；请勿在上下文中放入敏感信息。</p>
    <div class="row">
      <button class="btn sm" data-act="trStart">随机来一题 / 重洗</button>
      <button class="btn sm alt" data-act="trNext">下一题</button>
    </div>
    <div id="trPanel"><span class="muted">点「随机来一题」开始</span></div>
    <div id="trProg" class="muted"></div>
  </section>

  <section class="card">
    <div class="cardh">专业词汇库（数据结构 / 计算机组成原理 / 操作系统 / 计算机网络 / 数据库 / AI）</div>
    <div class="scroll"><table class="tbl"><thead><tr><th>术语</th><th>英文</th><th>释义</th><th>论文应用例句</th><th>同义</th><th>状态</th><th>标记</th></tr></thead><tbody>${rows}</tbody></table></div>
  </section>

  <section class="card">
    <div class="cardh">文献翻译总览（${S.translate.length} 题，点击展开查看参考译文）</div>
    <p class="muted">以下为全部文献翻译练习题目，含英译汉参考译文。点击题目展开答案对照；可标记掌握/不会（标"不会"自动进重点复习）。</p>
    <div class="trlist">${S.translate.map((t,i) => {
      const st = safeStatus(t.status);
      return `<div class="qitem trrow">
        <div class="qtop"><span class="cat">翻译 ${i + 1}</span><span class="st st-${st}">${st}</span>
          <span class="mbtns"><button class="mini" data-act="trmk" data-arg="${attr(t.id)}|掌握">掌握</button><button class="mini warn" data-act="trmk" data-arg="${attr(t.id)}|模糊">模糊</button><button class="mini bad" data-act="trmk" data-arg="${attr(t.id)}|不会">不会</button></span></div>
        <details class="dbans"><summary class="enq">${wrapWords(esc(t.en))}</summary>
          <div class="ansbox"><b>参考译文：</b><span class="editable" contenteditable="true" data-tid="${attr(t.id)}" data-field="cn">${esc(t.cn || "")}</span></div></details>
      </div>`;
    }).join("")}</div>
  </section>

  <section class="card">
    <div class="cardh">文献辅助工具</div>
    <p class="muted">粘贴英文段落，获取学术翻译参考。提交后文本会发送到第三方翻译服务；请勿粘贴个人隐私、未公开论文或其他敏感内容，单次最多 3000 字符。</p>
    <textarea id="litInput" class="ed" placeholder="Paste English paragraph here..."></textarea>
    <div class="row">
      <button class="btn" data-act="litTranslate">学术翻译 + 金句提炼</button>
      <button class="btn alt" data-act="litDaily">今日推荐文献</button>
    </div>
    <div id="litOut"></div>
  </section>

  <section class="card">
    <div class="cardh">每日顶刊推荐（NeurIPS / CVPR / SIGMOD / OSDI / SOSP 等）</div>
    <ul class="paperlist">${S.papers.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
    <button class="btn sm" data-act="addPaper">+ 添加文献</button>
  </section>`;
}

/* ============================================================
   重点复习板块（不会题目按类型自动分文件夹）
   ============================================================ */
function viewFocus(){
  const due = S.questions.filter(q => q.status === "不会");
  const dueSched = dueReview().filter(q => q.status !== "不会"); // “不会”已有独立归档，避免重复展示
  const dbNo = [];
  S.docbank.sources.forEach(s => s.sections.forEach(sec => sec.items.forEach(it => { if(it.status === "不会") dbNo.push({src:s.title, it}); })));
  const vocabNo = S.vocab.filter(x => x.status === "不会");
  const trNo = S.translate.filter(x => x.status === "不会");
  const wbNo = (S.wordBank || []).filter(w => w.status === "不会");
  const masteryCard = `<section class="card"><div class="cardh">复习策略：掌握后是否继续强化复习</div>
    <div class="row"><button class="btn sm ${S.settings.masteryRetire ? 'fire' : ''}" data-act="toggleMastery">${S.settings.masteryRetire ? '✅ 已开启：掌握后不再强化' : '○ 关闭：掌握后仍会回来强化'}</button>
    <span class="muted">开启后，已掌握题目将不再排期复习，重点复习只保留「不会 / 模糊」；描述请见按钮。「掌握/模糊/不会」标记仍实时生效。</span></div></section>`;
  if(!due.length && !dueSched.length && !dbNo.length && !vocabNo.length && !trNo.length && !wbNo.length){
    return `<h1 class="h1">重点复习板块</h1>${masteryCard}
    <div class="card"><div class="cardh">暂无【不会】题目</div>
    <p class="muted">在整个工作台任意位置（面试题库A / 真题分区 / 词汇闪卡 / 文献翻译）把题目标记【不会】，都会自动归入本板块。</p>
    <button class="btn" data-tab="bank">前往面试题库 →</button>
    <button class="btn" data-tab="docbank">前往真题分区 →</button>
    <button class="btn" data-tab="vocab">前往词汇文献 →</button></div>`;
  }
  let dueHtml = "";
  if(dueSched.length){
    const dg = {};
    dueSched.forEach(x => (dg[x.cat] = dg[x.cat] || []).push(x));
    dueHtml = `<section class="card"><div class="cardh">SM-2 到期待复习（${dueSched.length}）<span class="muted">— 掌握/模糊/不会 均按记忆曲线自动排期，标记后进入下一间隔</span></div>`
      + Object.keys(dg).map(cat => {
        return `<div class="ivcat">${catName(cat)}（${dg[cat].length}）</div><ul class="ivlist">` + dg[cat].map(q => {
          const st = safeStatus(q.status);
          return `<li class="qitem"><div class="qtop"><span class="cat">${catName(q.cat)}</span><span class="st st-${st}">${st}</span>
            <span class="mbtns"><button class="mini" data-act="mk" data-arg="${attr(q.id)}|掌握">掌握</button><button class="mini warn" data-act="mk" data-arg="${attr(q.id)}|模糊">模糊</button><button class="mini bad" data-act="mk" data-arg="${attr(q.id)}|不会">不会</button></span></div>
            <div class="qq"><span class="editable" contenteditable="true" data-eid="${attr(q.id)}" data-field="q">${esc(q.q)}</span></div>${srcTag(q)}
            <details class="dbans"><summary>参考答案<span class="muted">（下次复习 ${esc(q.nextReview || "—")}）</span></summary><div class="ansbox">${mdHtml(q.ans || "")}</div></details>
          </li>`;
        }).join("") + `</ul>`;
      }).join("") + `</section>`;
  }
  const groups = {};
  due.forEach(q => { (groups[q.cat] = groups[q.cat] || []).push(q); });
  let html = `<h1 class="h1">重点复习板块 · 全工作台"不会"自动归档</h1>
  <div class="stat">题库A 不会 ${due.length} | SM-2 到期待复习 ${dueSched.length} | 真题分区 不会 ${dbNo.length} | 专业词汇 不会 ${vocabNo.length} | 文献翻译 不会 ${trNo.length} | 单词不会 ${wbNo.length}。</div>`
    + masteryCard + dueHtml;
  Object.keys(groups).forEach(cat => {
    html += `<section class="card"><div class="cardh">${catName(cat)}（${groups[cat].length}）</div>` + groups[cat].map(q => {
      const st = safeStatus(q.status);
      return `<div class="qitem"><div class="qtop"><span class="cat">${catName(q.cat)}</span><span class="st st-${st}">${st}</span>
        <span class="mbtns"><button class="mini" data-act="mk" data-arg="${attr(q.id)}|掌握">掌握</button><button class="mini warn" data-act="mk" data-arg="${attr(q.id)}|模糊">模糊</button><button class="mini bad" data-act="mk" data-arg="${attr(q.id)}|不会">不会</button><button class="mini" data-act="copyQans" data-arg="${attr(q.id)}">复制答案</button></span></div>
        <div class="qq"><span class="editable" contenteditable="true" data-eid="${attr(q.id)}" data-field="q">${esc(q.q)}</span></div>
        ${srcTag(q)}
        ${q.key ? `<div class="qqkey"><b>关键词：</b><span class="editable" contenteditable="true" data-eid="${attr(q.id)}" data-field="key">${esc(q.key)}</span></div>` : ""}
        ${q.tip ? `<div class="qqtip"><b>加分：</b>${esc(q.tip)}</div>` : ""}
        ${q.pit ? `<div class="qqpit"><b>避坑：</b>${esc(q.pit)}</div>` : ""}
        <details class="dbans"><summary>查看完整答案</summary><div class="ansbox editable" contenteditable="true" data-eid="${attr(q.id)}" data-field="ans">${mdHtml(q.ans || "")}</div></details>
      </div>`;
    }).join("") + `</section>`;
  });
  if(dbNo.length){
    html += `<section class="card"><div class="cardh">真题分区 · 不会（${dbNo.length}）<span class="muted">— 来自真题分区，标记掌握/模糊即移出</span></div>`;
    const bySrc = {}; dbNo.forEach(x => { (bySrc[x.src] = bySrc[x.src] || []).push(x.it); });
    Object.keys(bySrc).forEach(t => {
      html += `<div class="ivcat">${esc(t)}（${bySrc[t].length}）</div><ul class="ivlist">` + bySrc[t].map(it => {
        return `<li class="qitem"><div class="qtop"><span class="cat">真题分区</span><span class="st st-不会">不会</span>
          <span class="mbtns"><button class="mini" data-act="dbmk" data-arg="${attr(it.id)}|掌握">掌握</button><button class="mini warn" data-act="dbmk" data-arg="${attr(it.id)}|模糊">模糊</button></span></div>
          <div class="qq">${esc(it.q)}</div>
          <details class="dbans"><summary>查看答案</summary><div class="ansbox">${mdHtml(it.ans || "")}</div></details></li>`;
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
        <span class="mbtns"><button class="mini" data-act="trmk" data-arg="${attr(t.id)}|掌握">掌握</button><button class="mini warn" data-act="trmk" data-arg="${attr(t.id)}|模糊">模糊</button></span></div>
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
   真题分区：文档总库（来自用户上传的多份文档）
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
let dbSearchTerm = "";
function dbFilter(v){
  v = (v || "").toLowerCase();
  dbSearchTerm = v;
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
        const st = safeStatus(it.status);
        return `<div class="qitem dbitem" data-qid="${attr(it.id)}">
          <div class="qtop"><span class="dbid">#${esc(it.id)}</span>
            <span class="st st-${st}">${st}</span>
            <span class="mbtns">
              <button class="mini" data-act="dbmk" data-arg="${attr(it.id)}|掌握">掌握</button>
              <button class="mini warn" data-act="dbmk" data-arg="${attr(it.id)}|模糊">模糊</button>
              <button class="mini bad" data-act="dbmk" data-arg="${attr(it.id)}|不会">不会</button>
              <button class="mini" data-act="dbDel" data-arg="${attr(it.id)}">删除</button>
            </span></div>
          <div class="qq"><span class="editable" contenteditable="true" data-did="${attr(it.id)}" data-field="q">${esc(it.q)}</span></div>
          <details class="dbans"><summary>查看 / 编辑答案</summary>
            <div class="editable ansbox" contenteditable="true" data-did="${attr(it.id)}" data-field="ans">${mdHtml(it.ans || "")}</div>
          </details>
        </div>`;
      }).join("");
      h += `<button class="btn sm" data-act="dbAdd" data-arg="${attr(s.id)}|${attr(encodeURIComponent(sec.name))}">+ 在本板块添加题目</button>`;
      h += `</section>`;
    });
    h += `</div>`;
    return h;
  }
  let body = "";
  if(cur === "all"){ body = srcs.map(renderSource).join(""); }
  else { const s = srcs.find(x => x.id === cur); body = s ? renderSource(s) : "<p class='muted'>未找到该文档</p>"; }
  return `<h1 class="h1">真题分区 · 文档总库</h1>
  <div class="stat">共收录 ${total} 条（来自 ${srcs.length} 份文档）。所有题目与答案均可直接点击编辑、自行添加录入；可标记掌握/模糊/不会，标「不会」自动进重点复习。</div>

  <section class="card">
    <div class="cardh">英语听力 · 随机抽题播报</div>
    <div class="row">
      <button class="btn" data-act="enListenPick">随机抽题并语音播报</button>
      <span class="muted">用英语朗读一道英文面试题，再点题目/答案查看对照。</span>
    </div>
    <div id="enListenBox">${enListenHtml()}</div>
  </section>

  <div class="filters">
    <div class="srcbar">${tabs}</div>
    <input class="search" id="dbSearch" value="${esc(dbSearchTerm || "")}" placeholder="搜索题目/关键词..." oninput="dbFilter(this.value)"/>
  </div>
  ${body}`;
}
