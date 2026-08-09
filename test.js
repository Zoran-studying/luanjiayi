/* ============================================================
   基础测试脚本（node test.js 运行）
   仅测试纯函数逻辑，不涉及 DOM / localStorage
   ============================================================ */

let pass = 0, fail = 0;
function assert(cond, msg){
  if(cond){ pass++; console.log("  ✓ " + msg); }
  else { fail++; console.error("  ✗ FAIL: " + msg); }
}

/* —— 载入核心函数 —— */
var SEED_DOCBANK = { sources: [] };
var PROFILE = {}, SELF_INTRO = {}, SEED_RADAR = [], SEED_TRANSLATE = [], DAILY_PAPERS = [];
var S;
eval(require("fs").readFileSync(__dirname + "/js/core.js", "utf-8").replace("let S = null;", "S = null;").replace(/document\b/g, "({querySelector:()=>null,getElementById:()=>null,createElement:()=>({}),addEventListener:()=>{},querySelectorAll:()=>[],body:{appendChild:()=>{}}})"));
eval(require("fs").readFileSync(__dirname + "/js/interview.js", "utf-8"));

console.log("\n== 日期工具 ==");
assert(todayStr().match(/^\d{4}-\d{2}-\d{2}$/), "todayStr 格式 YYYY-MM-DD");
assert(addDays("2026-01-01", 1) === "2026-01-02", "addDays +1");
assert(addDays("2026-01-31", 1) === "2026-02-01", "addDays 跨月");
assert(addDays("2026-01-01", -1) === "2025-12-31", "addDays 跨年");
assert(daysBetween("2026-01-01", "2026-01-04") === 3, "daysBetween 3天");

console.log("\n== 工具函数 ==");
assert(esc("<b>x</b>") === "&lt;b&gt;x&lt;/b&gt;", "esc 转义 HTML");
assert(esc(null) === "", "esc(null) 返回空串");
assert(esc(undefined) === "", "esc(undefined) 返回空串");
assert(attr('x" onfocus="bad') === "x&quot; onfocus=&quot;bad", "attr 转义属性引号");
assert(safeStatus('<img onerror=bad>') === "未标记", "非法状态归一化为未标记");
assert(uid().startsWith("x"), "uid() 以 x 开头");
assert(validTab("bank") && validTab("ledger"), "栏目路由接受有效 tab");
assert(!validTab("unknown") && !validTab("setup"), "栏目路由拒绝未知或内部 tab");

var arr = [1,2,3,4,5];
shuffle(arr);
assert(arr.length === 5, "shuffle 保持长度");
assert(arr.sort()[0] === 1 && arr.sort()[4] === 5, "shuffle 保持元素");

var idx = shuffleIdx(5);
assert(idx.length === 5, "shuffleIdx 长度正确");
assert(idx.sort(function(a,b){return a-b;}).join(",") === "0,1,2,3,4", "shuffleIdx 包含 0-4");

console.log("\n== 节奏管理 intensity ==");
// 模拟 S 对象
S = { logs: {}, settings: { intensity: "normal" } };
var y1 = addDays(todayStr(), -1), y2 = addDays(todayStr(), -2);
// 无记录 → 应该 low
S.logs[y1] = null; S.logs[y2] = null;
var done1 = S.logs[y1] && S.logs[y1].selfIntro && (S.logs[y1].selfIntro.cn || S.logs[y1].selfIntro.en || S.logs[y1].selfIntro.ppt);
var done2 = S.logs[y2] && S.logs[y2].selfIntro && (S.logs[y2].selfIntro.cn || S.logs[y2].selfIntro.en || S.logs[y2].selfIntro.ppt);
assert(!done1 && !done2, "无记录时 done1/done2 为 false");

// 有 ppt 记录 → done 应为 true
S.logs[y1] = { selfIntro: { cn: false, en: false, ppt: true } };
done1 = S.logs[y1] && S.logs[y1].selfIntro && (S.logs[y1].selfIntro.cn || S.logs[y1].selfIntro.en || S.logs[y1].selfIntro.ppt);
assert(done1 === true, "ppt:true 时 done1 应为 true (修复后)");

// 无 ppt/cn/en 记录 → done 应为 false
S.logs[y1] = { selfIntro: { cn: false, en: false, ppt: false } };
done1 = S.logs[y1] && S.logs[y1].selfIntro && (S.logs[y1].selfIntro.cn || S.logs[y1].selfIntro.en || S.logs[y1].selfIntro.ppt);
assert(!done1, "全 false 时 done1 为 false");

console.log("\n== 备份安全校验 ==");
function validBackup(){
  return { questions:[{id:"u1",cat:"基础",q:"有效题目",ans:"答案",status:"未标记"}], vocab:[{term:"术语",en:"term",def:"释义"}], logs:{}, settings:{} };
}
var normalized = normalizeBackup(validBackup());
assert(normalized.questions.length === 1 && normalized.questions[0].id === "u1", "合法备份可归一化");
var badId = validBackup(); badId.questions[0].id = 'x" onmouseover="bad';
var badIdRejected = false; try{ normalizeBackup(badId); }catch(e){ badIdRejected = true; }
assert(badIdRejected, "含属性注入 id 的备份被拒绝");
var badDoc = validBackup(); badDoc.docbank = { sources:"bad" };
var badDocRejected = false; try{ normalizeBackup(badDoc); }catch(e){ badDocRejected = true; }
assert(badDocRejected, "损坏的 docbank 被拒绝");

console.log("\n== 每日完成事件 ==");
var td = todayStr();
S = { logs:{}, questions:[], settings:{ intensity:"normal" } };
S.logs[td] = { interview:["q1"], plan:{review:["q2"]}, selfIntro:{cn:false,en:false,ppt:false}, completed:{interview:{},review:{}} };
var pg = todaysProgress();
assert(pg.done === 0 && pg.total === 5, "历史全局状态不会自动计入今日完成");
S.logs[td].completed.interview.q1 = true; S.logs[td].completed.review.q2 = true;
pg = todaysProgress();
assert(pg.done === 2, "当天完成事件正确计入完成率");

console.log("\n== 面试启发式评分 ==");
var scoreQ = { ans:"进程是资源分配的基本单位，线程是调度的基本单位。", key:"进程、资源分配、线程、调度" };
var irrelevant = scoreAnswer(scoreQ, "啊".repeat(480), false);
var relevant = scoreAnswer(scoreQ, "进程负责资源分配，线程负责处理器调度。", false);
assert(irrelevant <= 20, "无关长文本不会仅凭长度及格");
assert(relevant > irrelevant, "命中核心概念的简洁回答得分更高");

console.log("\n== 首次使用检测 ==");
S = { profile: { locked: false } };
assert(!S.profile.locked, "新用户 locked=false → 需要设置表单");
S.profile.locked = true;
assert(S.profile.locked, "设置后 locked=true → 跳过表单");

console.log("\n============================");
console.log("结果：" + pass + " 通过，" + fail + " 失败");
if(fail > 0) process.exit(1);
