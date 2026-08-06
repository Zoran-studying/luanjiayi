# 推免全流程智能工作台 · PushMian Buddy

为推免（推荐免试研究生）面试准备的**纯前端**学习工作台，内容面向**计算机科学与技术方向**（数据结构与算法、操作系统、计算机网络、数据库、人工智能等）。数据全部保存在浏览器 localStorage 中，无需后端。

## 快速开始

语音识别（Web Speech API）与部分浏览器能力要求**通过 HTTP 访问**，不能直接双击打开 index.html：

```bash
# 在项目目录下启动本地服务器
python -m http.server 8000
# 然后浏览器打开 http://127.0.0.1:8000
```

- 语音识别：Chrome 走 Google 云服务（国内通常连不上），**建议用 Edge 浏览器**。
- 支持 PWA：Chrome/Edge 打开后可用「安装应用」，离线可刷题。

## 功能模块

| 模块 | 说明 |
|---|---|
| 🏠 首屏工作台 | 今日计划（新学/复习/巩固）、信息雷达（截止倒计时）、模拟面试、完成率与连续打卡 |
| 📚 面试题库 A | 分类题库（基础/数据结构/计算机组成原理/操作系统/计算机网络/科研深挖/英文/翻译），支持收藏 ⭐、🔊朗读、搜索、批量导入、随机抽题、全真面试模式 |
| 🔥 重点复习 | 全工作台「不会」内容自动归档（题库/真题/词汇/翻译/单词），仅手动移出 |
| 🗂 真题分区 | 用户上传多份文档的真题总库，可编辑/添加/删除/标记 |
| 🎤 自我介绍 B | 三套文稿 + 背诵秒表 + 语音输入纠错 + 字数/时长估算 + 打卡 |
| 🔤 词汇·文献 C | 计算机专业词汇闪卡（含弱项模式）、文献翻译练习（点词查词/朗读/加入不会库）、每日顶刊推荐 |
| 📅 学习台账 D | 周历视图、板块学习时长、薄弱分布、周报生成/导出、**数据备份（导出/导入 JSON）** |

## 数据备份（重要）

所有进度存于浏览器 localStorage，清缓存/换浏览器即丢失。请在「学习台账 → 数据备份」中**定期导出 JSON 备份**，必要时导入恢复。

## 项目结构

```
index.html            # 入口（按依赖顺序加载脚本）
manifest.webmanifest  # PWA 清单
sw.js                 # Service Worker（离线缓存）
icons/icon.svg        # 应用图标
css/styles.css        # 全部样式
js/
  data-profile.js     # 种子数据：用户画像/自我介绍/雷达/文献
  data-questions.js   # 种子数据：面试题库（中文/英文/词汇翻译/关键词）
  data-qa.js          # 专业题库 1656 题（自 md文件/ 全部 md 解析，每题含 src 来源字段）
                      # 全库合计 1764 题 = data-qa(1656) + data-questions(基础/科研深挖/英文/翻译/词汇翻译)
  data-vocab.js       # 种子数据：专业词汇 + 中文释义词典
  data-docs.js        # 种子数据：真题文档库 + 文献翻译
  core.js             # 状态/持久化/迁移/渲染/事件分发/启动
  views.js            # 各板块视图渲染与局部交互
  flashcards.js       # 闪卡/翻译练习/点词查词/听力
  voice.js            # 秒表/语音识别/中英文朗读
  interview.js        # 全真面试模式与评分导出
  app.js              # 弹窗事件委托 / PWA 注册 / 启动
scripts/
  parse-qa.js         # 题库生成器：解析 md文件/ → js/data-qa.js（npm run gen:qa）
```

## 数据模型与迁移

- 首次打开写入种子数据；之后以 localStorage（键 `pmb_state_v1`）为准。
- `CONTENT_VER`（core.js）控制内容升级；迁移为**非破坏性合并**（保留标记与用户编辑），升级前请先导出备份。

## 开发约定

- 所有用户输入渲染前必须过 `esc()`（已转义 `& < > " '`）。
- 禁止把用户内容拼进 `onclick` 字符串；弹窗按钮统一用 `data-popact` + 事件委托（app.js）。
- 日期一律使用本地日期函数（`todayStr`/`addDays`），不要用 `toISOString`（UTC 时区会错位一天）。

## 题库生成（改 md 资料后）

`js/data-qa.js` 由 `scripts/parse-qa.js` 自动生成，覆盖 `md文件/` 全部问答题，每题带 `src`（来源文件 · 章节）。新增/修改 md 后运行：

```
npm run gen:qa        # 重新解析 → 覆盖 js/data-qa.js
npm run lint          # 语法 + SW 缓存一致性
npm run test          # 基础逻辑测试
```

新增 md 文件时，在 `scripts/parse-qa.js` 的 `SRC` 数组补一行 `{ file, cat, prefix }` 再重跑即可。`DS_*.md` 为 PPT 转文本 + AI 占位问答，会被自动剔除，无需处理。
