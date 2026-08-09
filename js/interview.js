/* ============================================================
   推免助手 PushMian Buddy — 全真模拟面试（出题 / 答题 / 评分 / 导出报告）
   ============================================================ */
let ivState = null;

function openFullInterview(){
  if(ivState){ renderInterview(); return; }
  // 题量配比读取自「全真模拟设置」（S.settings.ivComp），默认见 core.js IV_COMP_DEFAULT
  const comp = getIvComp();
  const list = [];
  const short = [];
  IV_COMP_CATS.forEach(c => {
    const n = comp[c];
    if(n <= 0) return;
    const pool = S.questions.filter(q => q.cat === c);
    shuffle(pool);
    const take = pool.slice(0, n);
    if(take.length < n) short.push(catName(c) + "缺" + (n - take.length));
    list.push(...take);
  });
  if(list.length < 2){ flash("题库题量不足，请先补充题目再进入全真面试。"); return; }
  shuffle(list);
  ivState = { list, i: 0, answers: [], marks: {} };
  const sum = IV_COMP_CATS.filter(c => comp[c] > 0).map(c => catName(c) + comp[c]).join("+");
  flash((short.length ? "⚠️ " + short.join("、") + "；" : "") + "全真面试启动：共 " + list.length + " 题（" + sum + "）");
  renderInterview();
}
function renderInterview(){
  const root = $("#app");
  if(!ivState){ render("bank"); return; }
  if(ivState.i >= ivState.list.length){ renderInterviewResult(); return; }
  const q = ivState.list[ivState.i];
  updateBottomNav("bank");
  document.title = "全真模拟面试 · PushMian Buddy";
  root.innerHTML = navBar("bank") + `<main class="main" id="mainContent" tabindex="-1">
    <h1 class="h1">全真模拟面试（${ivState.i + 1}/${ivState.list.length}）</h1>
    <div class="stat">类别：${catName(q.cat)} ｜ 答完点「下一题」；标记「不会」自动进重点复习；可随时提前结束出分。</div>
    <section class="card">
      <div class="cardh">第 ${ivState.i + 1} 题 · ${catName(q.cat)}</div>
      <div class="qq" style="font-size:16px;line-height:1.8">${esc(q.q)}</div>
      <button class="btn sm fire" data-act="spkQ" data-arg="${attr(q.id)}">朗读题目</button>
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
    lines.push("第" + (idx + 1) + "题 [" + catName(q.cat) + "] 启发式参考分 " + score + " 分" + (marks[q.id] ? "（已标不会）" : ""));
    lines.push("题干：" + q.q);
    lines.push("我的作答：" + (ua || "（未作答）"));
    lines.push("参考答案：" + (q.ans || ""));
  });
  const { total, avg, level } = scoreTotal();
  lines.push("");
  lines.push("启发式参考总分：" + total + " / " + list.length * 100 + " ｜ 平均 " + avg + " 分（" + level + "）");
  lines.push("说明：该分数仅依据关键词覆盖、回答完整度与表达结构计算，不等同于真实评委评分。");
  return lines.join("\n");
}
function scoreAnswer(q, ua, isMk){
  if(!ua) return 0;
  const ref = String(q.ans || ""), uaL = ua.toLowerCase();
  const keys = [];
  String(q.key || "").split(/[、，,;；|/\s]+/).forEach(k => { if(k.length >= 2) keys.push(k.toLowerCase()); });
  // 没有显式关键词时，从参考答案抽取中文二元组和英文实词；避免把整段中文误当成一个不可命中的关键词。
  if(!keys.length){
    (ref.match(/[\u4e00-\u9fa5]{2,}/g) || []).forEach(seg => {
      const clean = seg.replace(/(?:的是|一个|进行|可以|以及|通过|这个|主要|包括|需要)/g, "");
      for(let i=0; i<clean.length-1 && keys.length<30; i++) keys.push(clean.slice(i,i+2));
    });
    (ref.toLowerCase().match(/[a-z][a-z'-]{2,}/g) || [])
      .filter(w => !["the","and","that","with","this","for","are","was","not","but","you","your","from","into"].includes(w))
      .slice(0,20).forEach(w => keys.push(w));
  }
  const uniqKeys = [...new Set(keys)].slice(0,40);
  const hit = uniqKeys.filter(k => uaL.includes(k)).length;
  const coverage = uniqKeys.length ? Math.round(hit / uniqKeys.length * 60) : 0;
  const meaningful = ua.replace(/\s+/g, "").length;
  const completeness = Math.min(20, Math.round(meaningful / 8));
  const connectors = (ua.match(/首先|其次|最后|因为|因此|包括|例如|一方面|另一方面|first|second|finally|because|therefore|for example/gi) || []).length;
  const structure = Math.min(10, connectors * 3 + ((ua.match(/[。！？.!?]/g) || []).length >= 2 ? 2 : 0));
  const chars = uaL.replace(/\s+/g, "");
  const diversity = chars.length ? new Set(chars).size / chars.length : 0;
  const specificity = Math.min(10, Math.round(diversity * 20));
  let total = coverage + completeness + structure + specificity;
  if(hit === 0 && uniqKeys.length) total = Math.min(total, 20);
  if(isMk) total = Math.min(total, 40);
  return Math.max(0, Math.min(100, Math.round(total)));
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
  }catch(e){ flash("导出失败：" + e.message, "err"); }
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
        <span class="mbtns"><button class="mini" data-act="ivResMark" data-arg="${attr(q.id)}|掌握">掌握</button><button class="mini bad" data-act="ivResMark" data-arg="${attr(q.id)}|不会">不会</button></span></div>
      <div class="qq">${esc(q.q)}</div>
      <details class="dbans"><summary>你的作答（得分 ${score}）</summary><div class="ansbox">${esc(ua || '（未作答）')}</div></details>
      <details class="dbans" open><summary>参考答案（点击收起）</summary><div class="ansbox">${mdHtml(q.ans || "")}</div></details>
    </div>`;
  });
  const { total, avg, level } = scoreTotal();
  const root = $("#app");
  updateBottomNav("bank");
  document.title = "面试评分报告 · PushMian Buddy";
  root.innerHTML = navBar("bank") + `<main class="main" id="mainContent" tabindex="-1">
    <h1 class="h1">全真面试结束 · 评分报告</h1>
    <div class="stat">启发式参考分 ${total} / ${list.length * 100} ｜ 平均 ${avg} 分（${level}）｜ 共 ${list.length} 题，${Object.keys(marks).length} 题标「不会」已入重点复习。<span class="muted"> 仅依据关键词覆盖、完整度与表达结构，不等同于真实评委评分。</span></div>
    <div class="row"><button class="btn" data-act="ivAgain">再来一场</button><button class="btn alt" data-act="ivExit">返回题库</button><button class="btn sm" data-act="ivExport">导出评分报告(.txt)</button></div>
    ${rows}</main>`;
  bindCommon();
}
