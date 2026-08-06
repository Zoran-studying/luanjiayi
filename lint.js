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
jsFiles.push(path.join(root, "test.js"), path.join(root, "lint.js"));
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

console.log("\n============================");
console.log("结果：" + pass + " 通过，" + fail + " 失败");
if(fail > 0) process.exit(1);
