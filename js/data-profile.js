/* ============================================================
   推免助手 PushMian Buddy — 种子数据（由 data.js 拆分，内容未改动）
   说明：仅在首次初始化时写入 localStorage，之后以本地存储为准。
   ============================================================ */

const PROFILE = {
  name: "",
  school: "",
  major: "",
  gpa: "",
  rank: "",
  qualification: "",
  party: "",
  research: [],
  directions: [],
  target: "",
  window: "",
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
   cat: 基础 | 专业海科 | 专业海生 | 专业环市 | 科研深挖 | 英文 | 翻译
   diff: 1(易) 2(中) 3(难)
   字段：q 题干 / ans 参考答案 / tip 加分话术 / pit 踩坑提醒
   ============================================================ */
const SEED_APPS = [
{school:"同济大学",college:"环境科学与工程学院",major:"市政工程",mentor:"（待定，重点目标）",emailDate:"",reply:"未联系",interview:"",material:"待准备",next:"研读市政工程/水质净化方向导师近年论文，锁定1-2位意向导师",priority:"高",deadline:""},
{school:"厦门大学",college:"海洋与地球学院",major:"海洋生物学/海洋科学",mentor:"（待定）",emailDate:"",reply:"未联系",interview:"",material:"待准备",next:"关注夏令营/预推免通知",priority:"中",deadline:""},
{school:"中国海洋大学",college:"海洋生命学院",major:"海洋生物学",mentor:"（待定）",emailDate:"",reply:"未联系",interview:"",material:"待准备",next:"关注预推免",priority:"中",deadline:""},
{school:"中科院海洋所",college:"海洋生态与环境科学",major:"海洋科学",mentor:"（待定）",emailDate:"",reply:"未联系",interview:"",material:"待准备",next:"关注推免/直博通知",priority:"中",deadline:""},
{school:"中科院烟台海岸带所",college:"海岸带环境过程",major:"环境科学",mentor:"（待定）",emailDate:"",reply:"未联系",interview:"",material:"待准备",next:"关注预推免",priority:"中",deadline:""}
];

/* —— 导师智能匹配种子（基于用户科研背景） —— */
const SEED_MENTORS = [
{name:"（同济环境学院·市政/水质净化方向）",school:"同济大学",field:"市政工程/水质净化与生态工程",match:"高",reason:"好氧反硝化菌→污水同步脱氮；eDNA监测→水质生物评估，方向高度契合。"},
{name:"（厦大海洋生物/浮游生态方向）",school:"厦门大学",field:"海洋生物学/浮游动物生态",match:"高",reason:"猛水蚤-微藻摄食研究直接对接浮游动物生态与食物网。"},
{name:"（海大海洋微生物/氮循环方向）",school:"中国海洋大学",field:"海洋环境微生物/氮循环",match:"高",reason:"Halomonas反硝化与nirS/nosZ研究同属海洋氮循环微生物。"},
{name:"（中科院海洋所·微生物生态）",school:"中科院海洋所",field:"海洋微生物生态",match:"高",reason:"功能基因与环境微生物方法(eDNA)高度匹配。"},
{name:"（烟台海岸带所·湿地生态）",school:"中科院烟台海岸带所",field:"滨海湿地生态/氮循环",match:"高",reason:"滨海湿地Halomonas研究与海岸带氮去除直接对应。"},
{name:"（浙大环境/市政方向）",school:"浙江大学",field:"环境工程/水处理",match:"中",reason:"脱氮工艺与eDNA水质监测可延伸入市政水处理。"},
{name:"（天大环境/市政方向）",school:"天津大学",field:"市政工程/水污染控制",match:"中",reason:"好氧反硝化工程化应用与市政污水脱氮契合。"}
];

/* —— 信息雷达种子（推免时间轴 + 重点院校，用户持续更新） —— */
const SEED_RADAR = [
{school:"上海交通大学",college:"海洋学院（徐汇校区）",major:"海洋科学/海洋生物学/生物海洋学",type:"推免(第二批选拔)",deadline:"预计 2026-09月底–10月初（以官网为准）",link:"https://soo.sjtu.edu.cn/",match:"是",priority:"高",status:"待跟踪",note:"2025 cycle 第二批报名延至10/6、复试10/9-10；2026 cycle 预计同期。需提前联系导师（直博须导师同意）。"},
{school:"南京大学",college:"地理与海洋科学学院",major:"海洋科学/资源与环境",type:"推免预报名",deadline:"预计 2026-09-14 17:00",link:"https://sgos.nju.edu.cn/",match:"是",priority:"中",status:"待跟踪",note:"南大推免系统8/1开放、整体约9/15关闭，本院截止早于校线(9/14)。必须预报名方有效。"},
{school:"复旦大学",college:"大气与海洋科学系",major:"海洋科学/气象",type:"推免预报名",deadline:"预计 2026-09-04 10:00–09-10 16:00",link:"https://gsao.fudan.edu.cn/",match:"是",priority:"中",status:"待跟踪",note:"设气象与大气环境/气候/大气物理化学/海洋气象与物理海洋四方向；海洋+环境交叉契合。"},
{school:"复旦大学",college:"环境科学与工程系",major:"环境科学/资源与环境(市政相关)",type:"推免预报名",deadline:"预计 2026-08-25–09-10（第二轮约10/7）",link:"https://environment.fudan.edu.cn/",match:"是",priority:"高",status:"待跟踪",note:"环境系预报名8/25-9/10，前10%或科研突出；第二轮约10/7。与同济市政互补，建议同步关注。"},
{school:"中山大学",college:"海洋科学学院（珠海）",major:"海洋科学/海洋生物学",type:"推免预报名",deadline:"预计 2026-07-17–08-10（当前或已开放）",link:"https://marine.sysu.edu.cn/",match:"是",priority:"中",status:"待跟踪",note:"预报名系统 enroll.sysu.edu.cn；含硕士/直博。7-8月窗口，现在即可关注是否开放。"},

{school:"同济大学",college:"环境科学与工程学院",major:"市政工程",type:"预推免",deadline:"2026-09-19 24:00",link:"https://yzbm.tongji.edu.cn/",match:"是",priority:"高",status:"待投递",note:"重点目标！预报名9.19截止(报考服务系统)；复试约9月下旬；8月即启动导师套磁。"},
{school:"同济大学",college:"环境科学与工程学院",major:"市政工程/环境",type:"夏令营(开放日)",deadline:"2026-07-05 已截止",link:"https://sese.tongji.edu.cn/",match:"是",priority:"中",status:"已结束-跟进",note:"2026优秀大学生开放日6.25-7.5报名已截止，关注补录/预推免衔接与入选结果邮件。"},
{school:"浙江大学",college:"海洋学院(舟山)",major:"海洋科学/海洋技术与工程",type:"预推免",deadline:"2026-09-09 17:00",link:"https://yjsy.zju.edu.cn/",match:"是",priority:"中",status:"待投递",note:"系统7/28已开放；需2000字攻读计划；舟山大面试钉钉群；9月获资格后填推免系统。"},
{school:"厦门大学",college:"海洋与地球学院",major:"海洋科学/海洋生物学",type:"预推免",deadline:"2026-09-01",link:"https://ssyjsbm.xmu.edu.cn/",match:"是",priority:"中",status:"待投递",note:"系统8/1-9/1开放；需专家推荐信+成绩单PDF；入围邮件通知。"},
{school:"中科院海洋所",college:"海洋生态与环境科学",major:"海洋科学/微生物生态",type:"推免/直博",deadline:"2026-07-14~17夏令营已结；推免9月",link:"http://qdio.cas.cn/",match:"是",priority:"中",status:"已结束-转推免",note:"夏令营7.14-17已办；关注9月推免生简章(预计约60人)。"},
{school:"全国推免服务系统",college:"教育部",major:"推免",type:"系统开放",deadline:"2026-09-28 开放 / 10-20 关闭",link:"https://yz.chsi.com.cn/tm/",match:"是",priority:"高",status:"待开放",note:"9.28填报志愿，10.20关闭，务必设日历提醒；同济预报名≠系统录取，仍须在此确认。"},
{school:"中科院各所",college:"海洋/生态/环境",major:"直博/硕博",type:"推免",deadline:"2026-09~10",link:"https://www.ucas.ac.cn/",match:"部分",priority:"中",status:"待跟踪",note:"关注中科院大学招生网与各所通知；烟台海岸带所(湿地氮循环)高度匹配。"},
{school:"厦门大学",college:"海洋与地球学院",major:"海洋科学/生物学",type:"预推免",deadline:"2026-09",link:"https://coe.xmu.edu.cn/",match:"是",priority:"中",status:"待跟踪",note:""},
{school:"中国海洋大学",college:"海洋生命学院",major:"海洋生物学",type:"预推免",deadline:"2026-09",link:"https://www.ouc.edu.cn/",match:"是",priority:"中",status:"待跟踪",note:""}
];

/* —— 每日文献推荐种子（顶刊方向） —— */
const DAILY_PAPERS = [
"Water Research — 好氧反硝化菌在污水处理中的同步脱氮除碳",
"Environmental Science & Technology — 滨海湿地氮循环的微生物机制",
"ISME Journal — nirS/nosZ功能基因与N2O排放的耦合",
"Marine Ecology Progress Series — 桡足类摄食对浮游植物群落的下行控制",
"Environmental DNA — 水环境eDNA提取方法的优化与质控",
"Global Change Biology — 变暖与酸化对海岸带氮循环的综合影响"
];


/* ============================================================
   真题分区种子（来自用户上传的 6 份文档，首次初始化写入 localStorage）
   结构：sources[] -> sections[] -> items[]{id,q,ans,status}
   ============================================================ */
