/* 真实浏览器回归：npm run test:e2e（首次使用先 npm install && npx playwright install chromium） */
const pwPath = process.env.PMB_PLAYWRIGHT_PATH || "playwright";
const { chromium } = require(pwPath);

let pass = 0;
function assert(cond, msg){ if(!cond) throw new Error("FAIL: " + msg); pass++; console.log("  ✓ " + msg); }

(async function(){
  const browser = await chromium.launch({ headless:true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const pageErrors = [], consoleErrors = [];
  page.on("pageerror", e => pageErrors.push(e.message));
  page.on("console", m => { if(m.type() === "error") consoleErrors.push(m.text()); });
  await page.goto("http://127.0.0.1:8000", { waitUntil:"networkidle" });
  if(await page.locator("#setupName").count()) await page.locator('[data-act="skipSetup"]').click();

  assert(await page.locator('.navbtn.on[data-tab="home"][aria-current="page"]').count() === 1, "主导航清楚标记当前栏目");
  const titleOffset = await page.locator(".navbrand").evaluate(el => {
    const box = el.getBoundingClientRect();
    return Math.abs((box.left + box.width / 2) - window.innerWidth / 2);
  });
  assert(titleOffset < 1, "顶部标题与视口中心对齐");
  await page.locator('[data-act="pptSim"]').click();
  assert(await page.locator('.modalbackdrop .gmodal[role="dialog"]').isVisible(), "功能按钮打开的通用弹窗保持可见");
  assert(await page.locator("body").evaluate(el => el.classList.contains("modal-open")), "弹窗打开时锁定背景滚动");
  await page.keyboard.press("Shift+Tab");
  assert((await page.locator(":focus").innerText()).includes("开始讲述"), "弹窗焦点在首尾控件之间循环");
  await page.keyboard.press("Escape");
  assert(await page.locator(".gmodal").count() === 0, "通用弹窗支持 Escape 关闭");

  await page.locator('[data-act="addRadar"]').click();
  assert(await page.locator('.gmodal input').isVisible(), "新增通知按钮正常打开输入弹窗");
  assert(await page.locator('.gmodal input').evaluate(el => document.activeElement === el), "输入弹窗自动聚焦文本框");
  await page.locator(".modalbackdrop").click({ position:{ x:4, y:4 } });
  assert(await page.locator(".gmodal").count() === 0, "点击遮罩可取消输入弹窗");

  await page.evaluate(() => window.scrollTo(0, 520));
  await page.waitForTimeout(50);
  await page.locator('[data-tab="bank"]').first().click();
  await page.waitForSelector("#qlist .qitem");
  await page.waitForTimeout(50);
  assert(new URL(page.url()).hash === "#bank" && (await page.title()).includes("面试题库"), "栏目切换同步 URL 与页面标题");
  assert(await page.evaluate(() => window.scrollY < 30), "首次进入栏目从顶部开始");
  await page.goBack({ waitUntil:"domcontentloaded" });
  await page.waitForFunction(() => CURTAB === "home");
  await page.waitForTimeout(50);
  assert(await page.evaluate(() => window.scrollY > 400), "浏览器后退恢复上一栏目及滚动位置");
  await page.goForward({ waitUntil:"domcontentloaded" });
  await page.waitForFunction(() => CURTAB === "bank");
  assert(await page.locator("#qlist .qitem").count() === 30, "题库首屏按 30 条分页");

  const introOriginal = await page.evaluate(() => S.selfIntro.cn_short);
  await page.locator('[data-tab="intro"]').first().click();
  const introBox = page.locator('textarea[data-key="cn_short"]');
  await introBox.fill(introOriginal + "\n自动保存回归");
  assert(await page.locator('button[data-act="siToggle"]').first().getAttribute("aria-pressed") !== null, "自我介绍打卡使用键盘可操作按钮");
  await page.locator('[data-tab="home"]').first().click();
  await page.locator('[data-tab="intro"]').first().click();
  assert((await introBox.inputValue()).endsWith("自动保存回归"), "自我介绍文稿切换栏目后仍自动保存");
  await page.evaluate(original => { S.selfIntro.cn_short = original; save(); render("ledger"); }, introOriginal);
  await page.locator('[data-act="editProfile"]').click();
  assert(await page.locator("#setupTarget").isVisible(), "学习台账可进入个人资料编辑并修改目标方向");
  await page.locator('[data-act="cancelSetup"]').click();
  assert(await page.locator('[data-act="editProfile"]').isVisible(), "取消资料编辑后返回学习台账");
  await page.evaluate(() => render("bank"));
  await page.waitForSelector("#qlist .qitem");

  const logic = await page.evaluate(async function(){
    const result = {};
    const originalState = JSON.parse(JSON.stringify(S));

    S.vocab.forEach(v => { v.status="掌握"; });
    S.vocab.slice(0,3).forEach(v => { v.status="不会"; });
    vocabFlash = { mode:"en2cn", weakOnly:true, order:[], i:0, revealed:false, cardKey:"", direction:"en2cn" };
    const oldRandom = Math.random; Math.random = () => 0;
    render("vocab"); vfStart(); vfMark("掌握");
    result.weakAfterOne = { text:document.querySelector("#vfCard").innerText, left:vocabFlash.order.length };
    vfMark("掌握"); vfMark("掌握");
    result.weakFinished = { left:vocabFlash.order.length, progress:document.querySelector("#vfProg").innerText };

    render("vocab");
    vocabFlash = { mode:"mixed", weakOnly:false, order:[S.vocab[0].term], i:0, revealed:false, cardKey:"", direction:"en2cn" };
    const seq=[0.1,0.9]; Math.random=()=>seq.shift() ?? 0.9;
    vfRenderCard(); const mixedBefore=document.querySelector("#vfCard .vffront").innerText;
    vfReveal(); const mixedAfter=document.querySelector("#vfCard .vffront").innerText;
    result.mixedStable = mixedBefore === mixedAfter;
    Math.random = oldRandom;

    const host=document.createElement("div");
    host.innerHTML='<div class="enq"><span id="wa" class="wword">alpha</span> <span id="wb" class="wword">beta</span></div>';
    document.body.appendChild(host);
    const originalLookup=lookupWord;
    lookupWord=clean => new Promise(resolve => setTimeout(() => resolve({en:[{meanings:[{partOfSpeech:"noun",definitions:[{definition:clean+"-definition"}]}]}],zh:clean+"-zh",syn:[],deriv:[]}), clean === "alpha" ? 80 : 10));
    wordLookup(document.querySelector("#wa")); wordLookup(document.querySelector("#wb"));
    await new Promise(resolve => setTimeout(resolve,120));
    result.lookup = { current:document.querySelector("#wordPop").dataset.cur, body:document.querySelector("#wpEnSec").innerText };
    lookupWord=originalLookup; host.remove();

    S.logs={"2020-01-01":{selfIntro:{cn:true,en:false,ppt:false}}};
    result.weeklyOldCount=(weeklyReportText().match(/自我介绍打卡：(\d+) 天/)||[])[1];

    S=originalState; ensureState();
    const sample=S.questions[0];
    ivState={list:[sample],i:0,answers:[],marks:{}}; renderInterview();
    document.querySelector("#ivAns").value="当前答案必须保存"; ACTIONS.ivEnd();
    result.earlyAnswer=ivState.answers[0];
    const ended=ivState; ACTIONS.ivAgain();
    result.againStarted=ivState !== ended && ivState.i === 0;

    const scoreQ={ans:"进程是资源分配的基本单位，线程是调度的基本单位。",key:"进程、资源分配、线程、调度"};
    result.scores={irrelevant:scoreAnswer(scoreQ,"啊".repeat(480),false),relevant:scoreAnswer(scoreQ,"进程负责资源分配，线程负责处理器调度。",false)};

    let rejected=false;
    try{ normalizeBackup({questions:[{id:'x" onfocus="bad',cat:"基础",q:"题目"}],vocab:[{term:"词"}]}); }catch(e){ rejected=true; }
    result.badBackupRejected=rejected;

    S=originalState; ensureState();
    delete S.logs["2099-01-01"]; delete S.logs["2099-01-02"];
    S.settings.intensity="low"; const low=genDay("2099-01-01").interview.length;
    S.settings.intensity="normal"; const normal=genDay("2099-01-02").interview.length;
    result.intensity={low,normal};

    S=originalState; ensureState();
    const edited=S.questions[0]; edited.ans="用户自定义答案"; delete edited._userEdits; S.contentVersion=CONTENT_VER-1;
    mergeSeeds(); result.editPreserved=edited.ans;
    return result;
  });

  assert(logic.weakAfterOne.left === 2 && !logic.weakAfterOne.text.includes("无词汇"), "弱项闪卡标掌握后继续下一张");
  assert(logic.weakFinished.left === 0 && logic.weakFinished.progress.includes("完成"), "弱项闪卡可完整结束一轮");
  assert(logic.mixedStable, "混合模式揭晓时不翻转题面");
  assert(logic.lookup.current === "beta" && logic.lookup.body.includes("beta-definition"), "旧查词请求不会覆盖新结果");
  assert(logic.weeklyOldCount === "0", "周报忽略七天以前的打卡");
  assert(logic.earlyAnswer === "当前答案必须保存", "提前结束面试保存当前答案");
  assert(logic.againStarted, "面试结束后可开始新一场");
  assert(logic.scores.irrelevant <= 20 && logic.scores.relevant > logic.scores.irrelevant, "启发式评分不会奖励无关长文本");
  assert(logic.badBackupRejected, "恶意备份字段被拒绝");
  assert(logic.intensity.low < logic.intensity.normal, "低强度模式实际减少出题量");
  assert(logic.editPreserved === "用户自定义答案", "内容升级保留用户编辑答案");
  await page.evaluate(() => Promise.race([navigator.serviceWorker.ready, new Promise((_,reject) => setTimeout(() => reject(new Error("SW timeout")),10000))]));
  await page.reload({ waitUntil:"networkidle" });
  await context.setOffline(true);
  await page.reload({ waitUntil:"domcontentloaded" });
  assert((await page.title()).includes("PushMian Buddy") && await page.locator("#app").count() === 1, "PWA 缓存支持离线重启");
  await context.setOffline(false);
  assert(pageErrors.length === 0, "页面无未捕获异常");
  assert(consoleErrors.length === 0, "页面控制台无 error");
  console.log("\n浏览器回归：" + pass + " 项通过");
  await browser.close();
})().catch(async e => { console.error(e); process.exit(1); });
