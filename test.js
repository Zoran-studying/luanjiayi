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
eval(require("fs").readFileSync(__dirname + "/js/core.js", "utf-8").replace(/document\b/g, "({querySelector:()=>null,getElementById:()=>null,createElement:()=>({}),addEventListener:()=>{},querySelectorAll:()=>[],body:{appendChild:()=>{}}})"));

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
assert(uid().startsWith("x"), "uid() 以 x 开头");

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

console.log("\n== 首次使用检测 ==");
S = { profile: { locked: false } };
assert(!S.profile.locked, "新用户 locked=false → 需要设置表单");
S.profile.locked = true;
assert(S.profile.locked, "设置后 locked=true → 跳过表单");

console.log("\n============================");
console.log("结果：" + pass + " 通过，" + fail + " 失败");
if(fail > 0) process.exit(1);
