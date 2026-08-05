/* ============================================================
   推免助手 PushMian Buddy — 全真模拟面试（出题 / 答题 / 评分 / 导出报告）
   ============================================================ */
let ivState = null;

function openFullInterview(){
  if(ivState){ renderInterview(); return; }
  const pickN = (cat, n) => {
    const pool = S.questions.filter(q => q.cat === cat);
    shuffle(pool);
    return pool.slice(0, n);
  };
  const proCats = ["专业海科","专业海生","专业环市"];
  const pro = [];
  proCats.forEach(c => { const p = S.questions.filter(q => q.cat === c); if(p.length) pro.push(p[Math.floor(Math.random() * p.length)]); });
  // 去重补足：从三个专业分类洗牌后无放回补齐（不会抽到重复题）
  const proIds = new Set(pro.map(q => q.id));
  shuffle(S.questions.filter(q => proCats.includes(q.cat))).forEach(q => { if(pro.length >= 3) return; if(!proIds.has(q.id)){ pro.push(q); proIds.add(q.id); } });
  if(pro.length < 3){ alert("专业题不足 3 题，请先补充题目。"); return; }
  const basic = pickN("基础", 3);
  const eng = pickN("英文", 5);
  const res = pickN("科研深挖", 5);
  const tr = pickN("翻译", 2);
  if(basic.length < 3 || eng.length < 5 || res.length < 5 || tr.length < 2){
    alert("题库题量不足以组成 18 题面试（基础需≥3、英文≥5、科研深挖≥5、翻译≥2、专业≥3），请先补充题目。");
    return;
  }
  const list = [...basic, ...pro.slice(0, 3), ...eng, ...res, ...tr];
  ivState = { list, i:0, answers:[], marks:{} };
  flash("全真面试启动：3基础+3专业+5英文+5科研+2翻译");
  renderInterview();
}
function renderInterview(){
  const root = $("#app");
  if(!ivState){ render("bank"); return; }
  if(ivState.i >= ivState.list.length){ renderInterviewResult(); return; }
  const q = ivState.list[ivState.i];
  root.innerHTML = navBar() + `<main class="main">
    <h1 class="h1">全真模拟面试（${ivState.i + 1}/${ivState.list.length}）</h1>
    <div class="stat">类别：${catName(q.cat)} ｜ 答完点「下一题」；标记「不会」自动进重点复习；可随时提前结束出分。</div>
    <section class="card">
      <div class="cardh">第 ${ivState.i + 1} 题 · ${catName(q.cat)}</div>
      <div class="qq" style="font-size:16px;line-height:1.8">${esc(q.q)}</div>
      <button class="btn sm fire" data-act="spkQ" data-arg="${q.id}">朗读题目</button>
      <textarea class="ed tall" id="ivAns" placeholder="在此输入你的口头作答（也可留空，直接看参考答案）...">${esc(ivState.answers[ivState.i] || "")}</textarea>
      <div class="row">
        <button class="btn" data-act="ivNext">提交并下一题 ➡</button>
        <button class="btn sm fire" data-act="ivMarkNo">标记「不会」并下一题</button>
        <button class="btn sm alt" data-act="ivEnd">提前结束并出分</button>
      </div>
    </section></main>`;
  bindCommon();
}
function interviewReportText(){
  if(!ivState) return "";
  const { list, answers, marks } = ivState;
  const lines = [];
  lines.push("【全真模拟面试 · 评分报告】");
  lines.push("时间：" + new Date().toLocaleString());
  list.forEach((q, idx) => {
    const ua = (answers[idx] || "").trim();
    const score = scoreAnswer(q, ua, !!marks[q.id]);
    lines.push("");
    lines.push("第" + (idx + 1) + "题 [" + catName(q.cat) + "] 得分 " + score + " 分" + (marks[q.id] ? "（已标不会）" : ""));
    lines.push("题干：" + q.q);
    lines.push("我的作答：" + (ua || "（未作答）"));
    lines.push("参考答案：" + (q.ans || ""));
  });
  const { total, avg, level } = scoreTotal();
  lines.push("");
  lines.push("总分：" + total + " / " + list.length * 100 + " ｜ 平均 " + avg + " 分（" + level + "）");
  return lines.join("\n");
}
function scoreAnswer(q, ua, isMk){
  if(!ua) return isMk ? 30 : 0;
  let s = Math.min(60, Math.round(ua.length / 8));
  const ref = q.ans || "";
  const uaL = ua.toLowerCase();
  // 关键词命中：中文 2 字以上词组 + 英文实词（≥3 字母），英文题也能评出区分度
  const zhKeys = (ref.match(/[\u4e00-\u9fa5]{2,}/g) || []).slice(0, 15);
  const enKeys = (ref.toLowerCase().match(/[a-z][a-z'-]{2,}/g) || [])
    .filter(w => !["the","and","that","with","this","for","are","was","not","but","you","your"].includes(w))
    .slice(0, 10);
  const keys = zhKeys.concat(enKeys);
  let hit = 0;
  const seen = new Set();
  keys.forEach(k => { const kk = k.toLowerCase(); if(!seen.has(kk) && uaL.includes(kk)){ hit++; seen.add(kk); } });
  s += Math.round(hit / Math.max(1, keys.length) * 40);
  return Math.min(100, s);
}
function scoreTotal(){
  const { list, answers, marks } = ivState;
  let total = 0;
  list.forEach((q, idx) => total += scoreAnswer(q, (answers[idx] || "").trim(), !!marks[q.id]));
  const avg = Math.round(total / list.length);
  const level = avg >= 85 ? "优秀" : avg >= 70 ? "良好" : avg >= 50 ? "及格" : "需加强";
  return { total, avg, level };
}
/* ---- 下载文本文件 ---- */
function downloadText(name, text){
  try{
    const blob = new Blob(["\uFEFF" + text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  }catch(e){ alert("导出失败：" + e.message); }
}
function renderInterviewResult(){
  const { list, marks } = ivState;
  const answers = ivState.answers || [];
  let rows = "";
  list.forEach((q, idx) => {
    const ua = (answers[idx] || "").trim();
    const score = scoreAnswer(q, ua, !!marks[q.id]);
    rows += `<div class="qitem">
      <div class="qtop"><span class="cat">${catName(q.cat)}</span><span class="st st-${marks[q.id] ? '不会' : '未标记'}">${marks[q.id] ? '已标不会' : '未标'}</span>
        <span class="mbtns"><button class="mini" data-act="ivResMark" data-arg="${q.id}|掌握">掌握</button><button class="mini bad" data-act="ivResMark" data-arg="${q.id}|不会">不会</button></span></div>
      <div class="qq">${esc(q.q)}</div>
      <details class="dbans"><summary>你的作答（得分 ${score}）</summary><div class="ansbox">${esc(ua || '（未作答）')}</div></details>
      <details class="dbans" open><summary>参考答案（点击收起）</summary><div class="ansbox">${esc(q.ans || "")}</div></details>
    </div>`;
  });
  const { total, avg, level } = scoreTotal();
  const root = $("#app");
  root.innerHTML = navBar() + `<main class="main">
    <h1 class="h1">全真面试结束 · 评分报告</h1>
    <div class="stat">总分 ${total} / ${list.length * 100} ｜ 平均 ${avg} 分（${level}）｜ 共 ${list.length} 题，${Object.keys(marks).length} 题标「不会」已入重点复习。</div>
    <div class="row"><button class="btn" data-act="ivAgain">再来一场</button><button class="btn alt" data-act="ivExit">返回题库</button><button class="btn sm" data-act="ivExport">导出评分报告(.txt)</button></div>
    ${rows}</main>`;
  bindCommon();
}