/* ============================================================
   推免助手 PushMian Buddy — 种子数据（计算机科学与技术方向）
   说明：仅在首次初始化时写入 localStorage，之后以本地存储为准。
   ============================================================ */

const PROFILE = {
  name: "",
  school: "",
  major: "",
  gpa: "",
  rank: "",
  target: "",
  locked: false
};

/* —— 三套自我介绍文稿（已按用户画像起草，可在模块B持续迭代） —— */
const SELF_INTRO = {
  cn_short: "",
  en_short: "",

  ppt_full: ""
};

/* ============================================================
   面试题库
   cat: 基础 | 数据结构 | 计算机组成原理 | 操作系统 | 计算机网络 | 科研深挖 | 英文 | 翻译 | 词汇翻译
   （专业分类 数据结构/计算机组成原理/操作系统/计算机网络 题库由 data-qa.js 的 SEED_QUESTIONS_QA 612 题提供）
   diff: 1(易) 2(中) 3(难)
   字段：q 题干 / ans 参考答案 / tip 加分话术 / pit 踩坑提醒
   ============================================================ */

/* —— 信息雷达种子（推免时间轴 + 重点院校，用户持续更新） —— */
const SEED_RADAR = [
{school:"清华大学",college:"计算机科学与技术系",major:"计算机科学与技术",type:"预推免",deadline:"预计 2026-09 中旬（以官网为准）",link:"https://yz.tsinghua.edu.cn/",match:"是",priority:"高",status:"待跟踪",note:"重点目标！需提前联系导师并准备机试/算法题；关注系官网复试通知。"},
{school:"北京大学",college:"计算机学院",major:"计算机科学与技术/软件",type:"预推免",deadline:"预计 2026-09 中旬（以官网为准）",link:"https://admission.pku.edu.cn/",match:"是",priority:"高",status:"待跟踪",note:"推免系统预报名通常在 8 月底-9 月中旬开放，必须预报名方有效。"},
{school:"浙江大学",college:"计算机科学与技术学院",major:"计算机科学与技术",type:"预推免",deadline:"预计 2026-09 上旬（以官网为准）",link:"https://yjsy.zju.edu.cn/",match:"是",priority:"中",status:"待跟踪",note:"留意学院通知，需准备项目经历与英文自我介绍。"},
{school:"上海交通大学",college:"电子信息与电气工程学院·计算机系",major:"计算机科学与技术",type:"预推免",deadline:"预计 2026-09 中旬（以官网为准）",link:"https://yzb.sjtu.edu.cn/",match:"是",priority:"中",status:"待跟踪",note:"分方向选拔，含机试；关注电院官网。"},
{school:"南京大学",college:"计算机科学与技术系",major:"计算机科学与技术/软件",type:"预推免",deadline:"预计 2026-09-14（以官网为准）",link:"https://yzb.nju.edu.cn/",match:"是",priority:"中",status:"待跟踪",note:"南大推免系统开放后需尽快预报名，本院截止通常早于校线。"},
{school:"哈尔滨工业大学",college:"计算学部",major:"计算机科学与技术",type:"预推免",deadline:"预计 2026-09（以官网为准）",link:"http://yzb.hit.edu.cn/",match:"是",priority:"中",status:"待跟踪",note:"关注预推免与机试安排。"},
{school:"中国科学技术大学",college:"计算机科学与技术学院",major:"计算机科学与技术",type:"预推免",deadline:"预计 2026-09（以官网为准）",link:"https://yz.ustc.edu.cn/",match:"部分",priority:"中",status:"待跟踪",note:"关注学院推免通知。"},
{school:"北京航空航天大学",college:"计算机学院",major:"计算机科学与技术",type:"预推免",deadline:"预计 2026-09（以官网为准）",link:"http://yzb.buaa.edu.cn/",match:"部分",priority:"中",status:"待跟踪",note:"关注预推免，准备机试。"},
{school:"全国推免服务系统",college:"教育部",major:"推免",type:"系统开放",deadline:"2026-09-28 开放 / 10-20 关闭",link:"https://yz.chsi.com.cn/tm/",match:"是",priority:"高",status:"待开放",note:"9.28 填报志愿，10.20 关闭，务必设日历提醒；院校预报名≠系统录取，仍须在此确认。"},
{school:"各目标院校夏令营",college:"计算机/软件",major:"计算机科学与技术",type:"夏令营",deadline:"预计 2026-06~07（以官网为准）",link:"",match:"部分",priority:"中",status:"待跟踪",note:"暑期夏令营是提前拿 offer 的关键通道，需尽早准备材料与机试。"}
];

/* —— 每日文献推荐种子（顶刊方向） —— */
const DAILY_PAPERS = [
"NeurIPS — 大语言模型的推理能力与思维链（Chain-of-Thought）",
"CVPR — 视觉基础模型与多模态对齐",
"SIGMOD — 云数据库与 HTAP 系统设计",
"OSDI / SOSP — 大规模分布式存储与一致性协议",
"ACL — 低资源语言的神经机器翻译",
"ICSE / FSE — 代码大模型在软件缺陷检测中的应用"
];


/* ============================================================
   真题分区种子（示例，首次初始化写入 localStorage）
   结构：sources[] -> sections[] -> items[]{id,q,ans,status}
   ============================================================ */
