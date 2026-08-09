/* ============================================================
   轻量 lint（node lint.js 运行，无第三方依赖）
   1. 全部 js 文件语法检查
   2. sw.js 预缓存列表必须与 index.html 引入的脚本一致
   ============================================================ */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

let pass = 0, fail = 0;
function ok(msg){ pass++; console.log("  ✓ " + msg); }
function bad(msg){ fail++; console.error("  ✗ FAIL: " + msg); }

const root = __dirname;

/* 1. 语法检查全部 js 文件 */
const jsFiles = fs.readdirSync(path.join(root, "js")).filter(f => f.endsWith(".js")).map(f => path.join(root, "js", f));
jsFiles.push(path.join(root, "sw.js"), path.join(root, "test.js"), path.join(root, "test-e2e.js"), path.join(root, "lint.js"), path.join(root, "scripts", "parse-qa.js"));
console.log("\n== 语法检查 ==");
jsFiles.forEach(f => {
  try{
    execFileSync(process.execPath, ["--check", f], { stdio: "pipe" });
    ok(path.relative(root, f));
  }catch(e){
    bad(path.relative(root, f) + "\n" + (e.stderr ? e.stderr.toString() : e.message));
  }
});

/* 2. sw.js 缓存列表与 index.html 脚本一致性 */
console.log("\n== PWA 缓存清单一致性 ==");
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf-8");
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf-8");
const coreSrc = fs.readFileSync(path.join(root, "js", "core.js"), "utf-8");
const scripts = [];
const re = /<script src="([^"]+)"><\/script>/g;
let m;
while((m = re.exec(indexHtml))) scripts.push(m[1].replace(/^\.\//, ""));
const assetsMatch = sw.match(/const ASSETS = \[([\s\S]*?)\];/);
const assets = assetsMatch ? Array.from(assetsMatch[1].matchAll(/"([^"]+)"/g), x => x[1].replace(/^\.\//, "")) : [];
const missing = scripts.filter(s => !assets.includes(s));
const extra = assets.filter(a => !scripts.includes(a) && a.endsWith(".js"));
if(missing.length){ bad("sw.js 预缓存缺少：" + missing.join(", ")); }
else ok("sw.js 覆盖全部 " + scripts.length + " 个脚本");
if(extra.length){ bad("sw.js 预缓存了未引用的文件：" + extra.join(", ")); }
else ok("sw.js 无多余缓存项");

/* 2b. HTML/PWA 静态资源与 manifest 基础校验 */
console.log("\n== HTML / Manifest / 静态资源 ==");
try{
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.webmanifest"), "utf-8"));
  if(!manifest.name || !manifest.start_url || !Array.isArray(manifest.icons)) bad("manifest 缺少 name/start_url/icons");
  else ok("manifest.webmanifest JSON 与必需字段有效");
  const indexTheme = (indexHtml.match(/<meta\s+name="theme-color"\s+content="([^"]+)"/) || [])[1];
  if(indexTheme && manifest.theme_color && indexTheme.toLowerCase() === manifest.theme_color.toLowerCase()) ok("HTML 与 Manifest 主题色一致");
  else bad("HTML 与 Manifest 主题色不一致");
  const cssSrc = fs.readFileSync(path.join(root, "css", "styles.css"), "utf-8");
  const cssBg = (cssSrc.match(/--bg:\s*(#[0-9a-fA-F]{6})/) || [])[1];
  if(cssBg && manifest.background_color && cssBg.toLowerCase() === manifest.background_color.toLowerCase()) ok("CSS 与 Manifest 背景色一致");
  else bad("CSS 与 Manifest 背景色不一致");
  const refs = [];
  for(const x of indexHtml.matchAll(/(?:src|href)="([^"]+)"/g)){
    const ref = x[1]; if(!/^(?:https?:|data:|#)/.test(ref)) refs.push(ref.replace(/^\.\//,""));
  }
  const missingRefs = refs.filter(ref => !fs.existsSync(path.join(root, ref)));
  if(missingRefs.length) bad("index.html 引用了不存在的资源：" + missingRefs.join(", "));
  else ok("index.html 本地资源引用全部存在");
}catch(e){ bad("manifest/HTML 校验失败：" + e.message); }

/* 2c. 所有 data-act 必须在 ACTIONS 中有处理器 */
console.log("\n== 页面行为映射 ==");
const uiSource = fs.readdirSync(path.join(root, "js")).filter(f => f.endsWith(".js"))
  .map(f => fs.readFileSync(path.join(root, "js", f), "utf-8")).join("\n");
const actionRefs = [...new Set(Array.from(uiSource.matchAll(/data-act=["']([A-Za-z0-9_]+)["']/g), x => x[1]))];
const actionBlock = (coreSrc.match(/var ACTIONS\s*=\s*\{([\s\S]*?)\r?\n\};\r?\nfunction handle/) || [])[1] || "";
const actionKeys = new Set(Array.from(actionBlock.matchAll(/^\s{2}([A-Za-z0-9_]+):\s*function/gm), x => x[1]));
const missingActions = actionRefs.filter(a => !actionKeys.has(a));
if(missingActions.length) bad("缺少 data-act 处理器：" + missingActions.join(", "));
else ok(actionRefs.length + " 个 data-act 均有处理器");

/* 3. sw.js 缓存版本号与 core.js 的 CONTENT_VER 一致（改内容忘更新缓存会缓存旧代码） */
console.log("\n== SW 缓存版本一致性 ==");
const ver = (coreSrc.match(/const CONTENT_VER\s*=\s*(\d+)/) || [])[1];
const cacheName = (sw.match(/const CACHE\s*=\s*"([^"]+)"/) || [])[1];
if(ver && cacheName){
  if(cacheName.indexOf("v" + ver) >= 0) ok("SW 缓存 " + cacheName + " 与 CONTENT_VER=" + ver + " 一致");
  else bad("SW 缓存名 " + cacheName + " 与 CONTENT_VER=" + ver + " 不一致，请同步升级 sw.js 的 CACHE 名");
}else{
  if(!ver) bad("无法从 core.js 解析 CONTENT_VER");
  if(!cacheName) bad("无法从 sw.js 解析 CACHE 名");
}

console.log("\n============================");
console.log("结果：" + pass + " 通过，" + fail + " 失败");
if(fail > 0) process.exit(1);
