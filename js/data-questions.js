/* ============================================================
   推免助手 PushMian Buddy — 种子数据（计算机科学与技术方向）
   说明：仅在首次初始化时写入 localStorage，之后以本地存储为准。
   专业分类（数据结构/计算机组成原理/操作系统/计算机网络）的题库
   由 data-qa.js 的 SEED_QUESTIONS_QA（612 题，自 md文件/QA_*.md 解析）提供，
   本文件仅保留 基础 / 科研深挖 / 英文 / 翻译。
   ============================================================ */

const SEED_QUESTIONS = [

/* ---------------- 中文基础问答 ---------------- */
{id:"q001",cat:"基础",q:"请做一个自我介绍。",ans:"各位老师好，我是朱礼翔，天津科技大学智能科学与先进制造实验班（人工智能方向）2023 级本科生，GPA 4.36/5.0、专业综合排名 1/57，中共预备党员，通过大学英语六级（CET-6 510）。我的科研围绕人工智能展开：一是作为主持人负责国家级大创项目「锐鉴医学-全谱系微生物快检方案」，用深度学习预测 crRNA 序列、结合计算机视觉做试剂颜色识别与定量分析，通过随机数据增强与时间折叠解决荧光值波动，结合 AIR 模块与多池化融合策略把准确率提升到 97.68%；二是提出难度感知的自适应检索增强生成框架 DARE-RAG，相关论文已以第一作者被 CCF-C 类会议录用。我熟悉 Python、C++、Java，掌握 PyTorch、TensorFlow，核心课程覆盖数据结构、算法、操作系统与机器学习。希望能在贵校继续深耕人工智能方向，谢谢。",tip:"用'一个标签+三个支撑'记忆：如'一个做人工智能的学生'，再用排名、项目（DARE-RAG/锐鉴医学）、技能支撑。",pit:"忌流水账、忌超时、忌与简历雷同无重点。"},
{id:"q002",cat:"基础",q:"你为什么选择报考我们学校/这个专业？",ans:"我报考贵校主要基于三点：第一，贵校在人工智能/检索增强与多模态方向的积累，正好承接我在 DARE-RAG 与「锐鉴医学」多模态分析上的前期工作；第二，平台与实验室资源能支撑我把大创与课程项目推向真正的研究；第三，我的代码功底（Python/C++/PyTorch）与竞赛经历（国家级奖项 7 项、省部级 13 项）与贵方向互补，能较快融入。以贵校相关课题组为例，把理论落地到真实系统的研究路径正是我想走的路。",tip:"针对具体学校可说：'贵系在XX方向的积累，正好承接我的XX研究。'",pit:"空泛吹捧等于没说；要与自身经历挂钩。"},
{id:"q003",cat:"基础",q:"你本科所学专业与报考方向的关联？",ans:"我本科就读天津科技大学智能科学与先进制造实验班（人工智能方向），系统修读了《自然语言处理》《数字图像处理》《算法设计与分析》等课程，并自学了吴恩达、李沐等的机器学习/深度学习系列课程，与报考的人工智能方向同属 AI 学科体系。数据结构、算法、深度学习模型等知识奠定了我的基础；课程设计与竞赛经历培养了我的工程与调试能力。若跨到别的 AI 子方向，我也会强调数学与编程迁移能力。",tip:"跨方向者强调已做的知识补充（自学课程、开源项目）。",pit:"不要否定原专业，要强调'迁移能力'。"},
{id:"q004",cat:"基础",q:"谈谈你对计算机科学/人工智能专业的理解。",ans:"人工智能既研究计算与智能的本质（表示、学习、推理），也研究如何用软硬件系统解决真实问题，涵盖模型、数据、系统三个层面。它强调理论-算法-系统-应用的闭环：算法是灵魂，系统是载体，应用是归宿。我的体会是它实践性极强——我在 DARE-RAG 里既要调模型又要搭检索/生成 pipeline，只有亲手实现、调试、优化，才能真正理解教材上的抽象概念。",tip:"落到'理论-系统-应用'闭环，体现立体认知。",pit:"只背定义不谈意义会显得浅。"},
{id:"q005",cat:"基础",q:"你未来的研究方向规划是什么？",ans:"我希望聚焦人工智能（检索增强生成/多模态方向）。短期研一补齐数学与系统基础、熟练工程工具；中期围绕 DARE-RAG 与「锐鉴医学」的延伸问题定题，发 1-2 篇高质量论文并开放源码；长期视成果考虑读博，朝大模型落地与可信 AI 结合的方向发展。规划聚焦但留有调整空间。",tip:"开放但聚焦，留灵活调整空间。",pit:"过于死板或过于模糊都扣分。"},
{id:"q006",cat:"基础",q:"录取后如何开展研究生阶段的学习和研究？",ans:"录取后我会分四步：课程上把数学、统计与深度学习理论学扎实；技能上入学前重温数据结构与算法、补齐 PyTorch/Linux/版本控制等工程能力；科研上尽快融入课题组、每周组会汇报并复现组内论文；综合素质上坚持英文文献与学术写作训练。目标是研一末能独立推进一个小课题，把 DARE-RAG 的后续方向做深。",tip:"具体到'入学前复习X/动手做Y/每周组会'。",pit:"只说'好好学'无说服力。"},
{id:"q007",cat:"基础",q:"你认为自己读研的优势和劣势分别是什么？",ans:"优势是基础扎实（GPA 4.36/5.0、排名 1/57）、代码功底与工程能力好，能独立完成从数据到模型的完整链路，有一作 CCF-C 论文与国家级大创经历，竞赛累计国家级奖项 7 项、省部级 13 项。劣势是长周期科研与学术写作还在打磨，缺乏大型科研项目经验。我正在通过复现顶会论文、写技术博客与参与导师课题来弥补，希望读研期间补齐从'做项目'到'做研究'这一环。",tip:"劣势配'已在做的行动'，化被动为主动。",pit:"劣势说成致命伤，或假大空。"},
{id:"q008",cat:"基础",q:"你本科印象最深刻的一门课及收获？",ans:"印象最深的是《自然语言处理》及由此展开的 DARE-RAG 研究。这门课让我把注意力机制、Transformer、上下文学习等抽象概念变成可运行的代码，直接促成了我后续把检索增强框架做成论文，也奠定了我的 NLP 基础。",tip:"选与报考方向强相关的课，并联系自己的项目。",pit:"选无关课且说不出收获。"},
{id:"q009",cat:"基础",q:"如果研究生阶段遇到科研瓶颈，你会如何应对？",ans:"我会分四步：先调整心态不慌；再梳理问题、拆解成可检验的小假设；然后向导师和师兄师姐请教、查文献找替代方法；最后持续小步尝试。比如我做 DARE-RAG 的难度判定模块效果不稳时，我逐步隔离探针特征与门控，逐项验证，最终找到瓶颈并解决。",tip:"体现韧性+沟通能力，并用自己的项目例子佐证。",pit:"说'硬扛不说'或'直接换题'都差。"},
{id:"q010",cat:"基础",q:"你的读研/职业规划是什么？",ans:"短期在硕士阶段系统训练科研、围绕检索增强与多模态完成高质量论文并开源代码；中期优先考虑读博深化研究，若就业则进入大厂/研究机构做算法或模型研发；长期希望成为人工智能方向的技术专家。始终紧扣专业，留有余地。",tip:"留余地：'优先考虑读博，若就业则进入XX方向单位'。",pit:"说'还没想好'或'想赚钱'。"},
{id:"q011",cat:"基础",q:"如果研究方向与导师不一致，如何协调？",ans:"我会尊重导师整体方向，主动沟通寻找交叉点。人工智能是交叉性强的学科，常能在方法上找到重叠——比如导师做多模态或计算机视觉，我可以研究检索增强在其中的应用，或把医学图像思路迁移过去。先在交叉处做出成果，再逐步拓展，既不放弃自我也不与导师对立。",tip:"举'我偏好X、导师做Y，可研究X在Y中的应用'。",pit:"对立表态或完全放弃自我。"},
{id:"q012",cat:"基础",q:"团队中你倾向领导者还是合作者？",ans:"我更倾向做可靠的主持人+合作者。国家级大创「锐鉴医学」我作为主持人统筹三人分工，既能在需要时统筹推进，也能在别人牵头时踏实补位。此外我担任班长和学部团委副书记，统筹过不少团学活动。关键是补位而不越位，以目标为导向灵活转换角色。",tip:"强调'补位而不越位'，用大创主持人的真实例子。",pit:"只说一种且贬低另一种。"},
{id:"q013",cat:"基础",q:"谈谈你对关键技术'自主可控'的理解与自身责任。",ans:"自主可控是指在大模型、深度学习框架、算力芯片等关键领域掌握自主核心技术，摆脱对外依赖。人工智能是数字经济的底座，基础模型与工具链的自主化关系国家安全与产业升级。我研究检索增强与多模态，正好服务大模型落地的基础能力建设，这正是我能贡献的方向。",tip:"落到自身研究如何服务国家需求。",pit:"喊口号无个人落点。"},
{id:"q014",cat:"基础",q:"如何看待科研诚信？",ans:"科研诚信核心是诚实、严谨、负责。人工智能领域数据可复现是基本要求，篡改实验数据或结果不可复现会误导后续研究。我承诺如实记录实验、公开代码与数据、规范引用。本科期间我的项目实验与论文数据都完整存档，可随时复核。",tip:"举本科原始记录完整保存的实例。",pit:"空谈概念。"},
{id:"q015",cat:"基础",q:"你本科最自豪的一项成果/经历？",ans:"我最自豪的是 DARE-RAG：从检索增强的问题出发，我提出难度感知的自适应检索增强框架，通过探针检索、不确定性门控等设计把它做成论文，以第一作者被 CCF-C 类会议录用。用 STAR 框架讲：情境是大模型检索增强成本高、判据单一；任务是要自适应判断是否扩展检索；行动是我设计了特征、门控与检索重排并做了充分消融；结果是形成可复用的框架（开源），并沉淀了论文与代码。",tip:"带上可量化的结果(如'CCF-C 一作录用')。",pit:"贪多或无法展开细节。"},


/* ---------------- 科研深挖（围绕你的科研项目，连环压力追问） ---------------- */
{id:"r401",cat:"科研深挖",q:"请完整讲一遍你的科研项目（科学问题→方法→结果→意义）。",ans:"以 DARE-RAG 为例。科学问题：大模型进行检索增强时，如何自适应地判断查询是否需要扩展检索，以减少不必要的开销、提升质量。方法：我采用探针检索提取 8 维不确定性特征，用门控机制做难度感知的自适应检索，配合分层检索/重排实现；基于公开基准数据验证。结果：相比 baseline 在相关度量上取得提升，论文以第一作者被 CCF-C 类会议录用。意义：为检索增强生成提供了一种按难度自适应的低成本方案，代码已开源。用'故事线'而非堆砌，2-3 分钟讲完。",tip:"用'故事线'而非堆砌，3分钟讲完。",pit:"只罗列实验无逻辑主线。"},
{id:"r402",cat:"科研深挖",q:"压力追问：你怎么证明你的方法真的更好，而不是调参/数据巧合？",ans:"在 DARE-RAG 中我严格设立 fair baseline，固定实验条件与随机种子；做多组重复实验与显著性检验（如多折交叉验证）；对门控、检索重排等模块逐项做消融（ablation），验证每个模块的贡献；报告方差与误差线，不只看单一最优结果，并且指出在哪类查询上收益最大、在哪类上收益有限。",tip:"主动提'baseline 公平性+消融+统计检验'。",pit:"只贴最优数字。"},
{id:"r403",cat:"科研深挖",q:"压力追问：实验数据异常/结果不理想时你如何处理？",ans:"在 DARE-RAG 中如果门控检索结果异常，我先排查数据 pipeline（数据泄露、标签错、归一化错误）；再固定随机种子，用探针可视化与逐步消融定位热点；对离群点和失败 case 逐条分析原因而非直接删除；若模型不收敛，调整学习率、初始化并减小批大小。全程保留实验日志与配置，保证可复现。",tip:"展示'定位-验证-记录'的工程素养。",pit:"回避异常或隐瞒失败实验。"},
{id:"r404",cat:"科研深挖",q:"压力追问：你的项目和报考导师的研究方向有什么关系？",ans:"我的 DARE-RAG（检索增强）与「锐鉴医学」（多模态）工作与被报考导师的系统/NLP方向有明确接口——例如我实现的探针检索与特征门控可复用到导师的大模型检索任务上，多模态颜色识别技巧可迁移到医学影像。我已在读与复现导师组相关论文，能快速进入状态。先谈共性方法，再谈我能贡献的工程能力。",tip:"主动把'已复现论文'说出来。",pit:"答不出衔接点。"},
{id:"r405",cat:"科研深挖",q:"压力追问：这个项目有什么实际价值？会不会只是实验室玩具？",ans:"可从三个层面回答：一是科学价值，DARE-RAG 揭示了'难度感知自适应检索'的可行路径，为后续 RAG 工作提供 baseline；二是工程价值，我公开了完整的评测流程与代码、以及基准数据使用方法，可被他人复现并迁移到实际问答/检索场景；三是现实应用，多模态/快检思路可走向具体落地场景。同时诚实说明当前局限与已规划的后续验证。",tip:"谈'开源、可复现、可迁移'这类可验证证据。",pit:"吹嘘或全盘否认价值。"},
{id:"r406",cat:"科研深挖",q:"压力追问：项目中你遇到的最大困难是什么？怎么克服的？",ans:"最大困难是在 DARE-RAG 里让门控既能识别困难查询又不引入额外开销（性能/成本平衡）。我用探针检索提取 8 维特征、先用较小模型验证假设，再用逐步消融隔离变量逐项对比，最终采用分层检索权重与门控阈值取得稳定收敛，并把经验沉淀为可复用的实验脚本。重点讲'排查过程'而非只讲结果。",tip:"讲排查过程体现问题分解能力。",pit:"说不清细节，只喊'难'。"},
{id:"r407",cat:"科研深挖",q:"压力追问：如何评估你模型的泛化能力与公平性？",ans:"在 DARE-RAG 中我用独立测试集与多种划分方式（K 折）评估；做跨查询分布/域外（OOD）测试；关注不同难度查询上的表现差异，报告不同子群体的表现与方差；必要时引入数据增强与正则化提升鲁棒性。",tip:"提到 OOD 与公平性很加分。",pit:"只用单一测试集。"},
{id:"r408",cat:"科研深挖",q:"综合追问：你的几个项目看起来分散，如果用一条主线串联，怎么讲？",ans:"主线=「从真实问题出发，用 AI 方法+工程能力把它做出来」：DARE-RAG（检索增强生成）解决大模型检索的自适应问题，「锐鉴医学」把深度学习搬到微生物快检/医疗的多模态场景，都统一于我'能独立完成从问题建模到代码落地的工程能力'，并服务于报考方向的研究与应用。",tip:"提前准备一条'AI 落地'的个人研究叙事。",pit:"各项目各自为政。"},

/* ---------------- 英文问答 ---------------- */
{id:"e501",cat:"英文",q:"Could you introduce yourself?",ans:"I'm Lixiang Zhu, a 2023 undergrad majoring in AI at Tianjin University of Science and Technology, GPA 4.36/5.0, ranked 1st in my major. My research focuses on retrieval-augmented generation: I proposed DARE-RAG, a difficulty-aware adaptive RAG framework, which was accepted as a first-author paper at a CCF-C conference. I'm skilled in Python and PyTorch, and eager to continue AI research here.",tip:"Keep it under 90 seconds; end with your research interest.",pit:"Reading a memorized script with no pause."},
{id:"e502",cat:"英文",q:"Why do you choose our university / this program?",ans:"Because of your strength in AI / retrieval-augmented generation / multimodal research, which perfectly extends my DARE-RAG and multimodal medical-imaging work toward real research. I've also read several papers from your group and admire the way you connect theory with system building.",tip:"Name a specific lab/platform if you can.",pit:"Generic praise with no personal link."},
{id:"e503",cat:"英文",q:"What are your research interests and future plans?",ans:"I focus on retrieval-augmented generation and multimodal AI. I plan to pursue a master's and ideally a PhD, building reliable and efficient RAG/LLM systems while contributing open-source code. I want to grow from 'doing projects' to 'doing research'.",tip:"Show a clear, feasible trajectory.",pit:"Too vague or unrealistic."},
{id:"e504",cat:"英文",q:"Describe one of your research projects briefly.",ans:"I built DARE-RAG, a difficulty-aware adaptive retrieval-augmented generation framework. It uses probe features and an uncertainty gate to decide whether query expansion is needed, cutting computation while keeping quality. I designed the pipeline, implemented it in Python/PyTorch, ran experiments and ablations, and published it as a first-author CCF-C paper.",tip:"Use the 'question-method-result' frame in English too.",pit:"Jumping into jargon without context."},
{id:"e505",cat:"英文",q:"What are your strengths and weaknesses?",ans:"Strength: solid fundamentals (GPA 4.36/5.0, ranked 1st) and the ability to finish a project from idea to deployment, with a first-authored CCF-C paper. Weakness: I need more experience in long-term research methodology, which I hope to gain here. I'm working on it by reading and reproducing papers.",tip:"Pair every weakness with a fixing action.",pit:"Listing fatal weaknesses."},
{id:"e506",cat:"英文",q:"How do you handle setbacks in research?",ans:"I stay calm, break the problem into smaller parts, reproduce it, and consult my supervisor and seniors. For example, when module performance in DARE-RAG was unstable, I isolated each feature and ran ablations to locate the hotspot, then solved it step by step.",tip:"Tell a short real story from DARE-RAG.",pit:"Saying 'I never fail'."},
{id:"e507",cat:"英文",q:"What are the hot topics in computer science today?",ans:"Large language models and their reasoning, retrieval-augmented generation, efficient training and inference, and trustworthy AI. I follow these topics closely and think about how to contribute to them—my DARE-RAG work sits exactly at the RAG/LLM intersection.",tip:"Mention one concrete topic you know well (e.g., RAG).",pit:"Listing names you can't explain."},
{id:"e508",cat:"英文",q:"Why are algorithms and data structures important?",ans:"They determine the efficiency and scalability of every system—a good choice can turn an O(n²) solution into O(n log n). They also underpin large language models' inference and indexing, and they are the foundation of technical interviews and research.",tip:"Give a concrete example (e.g., O(n²)→O(n log n)).",pit:"Only saying 'they are important'."},
{id:"e509",cat:"英文",q:"What software and tools are you familiar with?",ans:"I'm most experienced with Python and PyTorch, which power my DARE-RAG experiments, plus C/C++, Git, and Linux. I also have moderate experience with SQL and common debuggers/profilers, and I enjoy contributing to open-source projects.",tip:"Be honest about proficiency levels.",pit:"Claiming tools you can't explain."},
{id:"e510",cat:"英文",q:"Where do you see yourself in 10 years?",ans:"I hope to be a researcher in retrieval-augmented generation and multimodal AI, ideally contributing research papers and open-source tools that people actually use in practice. I want to keep bridging research and engineering, informed by the real problems I see in AI applications.",tip:"Tie back to long-term contribution.",pit:"Only talking about money."},

/* ---------------- 英文文献翻译题（近3年期刊/顶会摘要片段） ---------------- */
{id:"t601",cat:"翻译",q:"原文：Transformer-based large language models exhibit strong in-context learning abilities, enabling them to solve new tasks from a few examples without updating model parameters.",ans:"参考译文：基于 Transformer 的大语言模型展现出强大的上下文学习能力，使其无需更新模型参数即可从少量示例中解决新任务。关键词：in-context learning 上下文学习；a few examples 少量示例；parameters 参数。",tip:"长难句先找主干再补修饰。",pit:"把 in-context learning 误译。"},
{id:"t602",cat:"翻译",q:"原文：Concurrency bugs are notoriously hard to detect; this paper presents a dynamic analysis tool that combines happens-before and lock-order techniques to locate them efficiently.",ans:"参考译文：并发缺陷是出了名地难以检测；本文提出一种动态分析工具，结合 happens-before 与锁顺序两种技术来高效定位它们。关键词：concurrency 并发；dynamic analysis 动态分析。",tip:"注意固定术语译法。",pit:"happens-before 不译成'先于关系'。"},
{id:"t603",cat:"翻译",q:"原文：To guarantee serializability under concurrency, modern databases rely on two-phase locking or optimistic concurrency control with validation.",ans:"参考译文：为保证并发下的可串行化，现代数据库依赖两阶段锁或带验证的乐观并发控制。关键词：serializability 可串行化；optimistic concurrency control 乐观并发控制。",tip:"术语先译准确再组织句子。",pit:"two-phase locking 译错。"},
{id:"t604",cat:"翻译",q:"原文：Packet loss is inevitable on the Internet; TCP mitigates it through sequence numbers, acknowledgments, and adaptive retransmission timeouts.",ans:"参考译文：互联网上数据包丢失不可避免；TCP 通过序列号、确认应答和自适应重传超时来缓解该问题。关键词：sequence number 序列号；retransmission 重传。",tip:"主句-方式状语先分清。",pit:"把 TCP 与 IP 混译。"},
{id:"t605",cat:"翻译",q:"原文：This work presents a distributed storage system that achieves linearizable consistency with high availability even during network partitions.",ans:"参考译文：本工作提出一个分布式存储系统，即使在网络分区期间也能以高可用性实现线性一致。关键词：linearizable consistency 线性一致性；network partition 网络分区。",tip:"注意'even during'的让步语义。",pit:"partition 误译为'分区（磁盘）'。"},
{id:"t606",cat:"翻译",q:"原文：Graph neural networks generalize deep learning to graph-structured data, capturing both node features and topological dependencies.",ans:"参考译文：图神经网络把深度学习推广到图结构数据，同时捕获节点特征与拓扑依赖。关键词：graph-structured data 图结构数据；topological 拓扑的。",pit:"只译出'神经网络'漏掉'图'。"},
{id:"t607",cat:"翻译",q:"原文：The key insight is that reducing cache misses at the memory hierarchy level often yields greater speedups than further micro-optimizing arithmetic operations.",ans:"参考译文：关键洞察是：在存储层次上减少缓存缺失，往往比继续微优化算术运算带来更大加速。关键词：cache miss 缓存缺失；speedup 加速。",tip:"'the key insight'是强调点。",pit:"hierarchy 漏译。"},
{id:"t608",cat:"翻译",q:"原文：Despite its simplicity, the B+ tree remains the dominant indexing structure in relational databases owing to its high fan-out and ordered leaf nodes.",ans:"参考译文：尽管简单，B+ 树仍是关系数据库中最主要的索引结构，这得益于其高扇出与有序叶子节点。关键词：fan-out 扇出；indexing structure 索引结构。",pit:"fan-out 译成'扇出'之外的含义。"},
{id:"t609",cat:"翻译",q:"原文：An adversarial example is an input crafted to fool a well-trained model, highlighting the gap between model accuracy and true robustness.",ans:"参考译文：对抗样本是为欺骗训练良好的模型而构造的输入，凸显了模型准确率与真正鲁棒性之间的差距。关键词：adversarial example 对抗样本；robustness 鲁棒性。",pit:"fool 译成'愚弄'过于生硬。"},
{id:"t610",cat:"翻译",q:"原文：Open-source collaboration shortens the feedback loop between researchers and practitioners, accelerating the adoption of new systems in production.",ans:"参考译文：开源协作缩短了研究人员与实践者之间的反馈回路，加速新系统在生产环境中的采用。关键词：feedback loop 反馈回路；adoption 采用。",pit:"practitioners 漏译或误译。"},

/* ---------------- 论文精读（AI 里程碑论文深度理解） ---------------- */

/* —— Transformer 与注意力机制 —— */
{id:"r001",cat:"论文精读",q:"【Attention Is All You Need】Transformer 用 Multi-Head Attention 替代了 RNN/CNN，核心动机是什么？",ans:"论文指出 RNN 的问题是序列计算（无法并行，O(n) 步才能处理 n 个 token），CNN 虽然可以并行但需要堆叠多层才能捕获长距离依赖。Self-attention 的优势：1）任意两个位置直接相连，路径长度 O(1)，长距离依赖无需绕路；2）计算可完全并行化；3）注意力权重可解释。Multi-Head 的作用是让模型同时关注不同子空间的信息（如语法关系、语义关系），类似 CNN 的多通道。这是 Transformer 成为后续所有 LLM 基础架构的根本原因。",tip:"用'并行性 + 长距离依赖 + 可解释性'三个维度回答。",pit:"只说'Attention 比 RNN 好'但说不出为什么。"},
{id:"r002",cat:"论文精读",q:"【Attention Is All You Need】Scaled Dot-Product Attention 公式中为什么要除以 √d_k？",ans:"注意力分数 `score = QK^T / √d_k`。当 d_k（键向量维度）很大时，Q 和 K 的点积结果的方差会随 d_k 线性增长（假设 Q、K 各分量独立同分布、均值为 0、方差为 1，则点积的方差为 d_k）。方差过大会导致 softmax 输出趋向 one-hot 分布（梯度消失），训练不稳定。除以 √d_k 将方差重新缩放到 1，使 softmax 的输入落在合理范围内，梯度能正常流动。这是数值稳定性的标准技巧，不是 Transformer 独创。",tip:"从方差分析角度解释，用'softmax 饱和'说明后果。",pit:"只说'防止数值太大'但说不出方差推导。"},
{id:"r003",cat:"论文精读",q:"【Transformer】Positional Encoding 为什么用正弦/余弦函数而不是可学习的位置嵌入？",ans:"论文用 sin/cos 是因为：1）理论上能泛化到训练时未见过的序列长度（正弦函数是周期函数，任何位置都能算出编码）；2）相对位置可以通过线性变换表示——`PE(pos+k)` 可以表示为 `PE(pos)` 的线性函数，模型能学到相对位置关系。可学习嵌入的缺点是固定了最大长度，超出就无法处理。实际效果上，两者差别不大（BERT 用可学习嵌入效果也很好），但正弦编码在长度泛化上理论优势更明确。",tip:"用'长度泛化'和'相对位置线性表示'两个理论优势回答。",pit:"只说'可以泛化'但说不出数学性质。"},

/* —— RAG 原始论文 —— */
{id:"r004",cat:"论文精读",q:"【RAG】Lewis et al. 2020 提出的 RAG 有两种变体 RAG-Sequence 和 RAG-Token，区别是什么？",ans:"RAG-Sequence：对整个生成序列使用相同的检索文档集。即先检索 top-k 文档，然后生成器基于这 k 个文档生成整个回答，每个文档对所有 token 的生成都有贡献。RAG-Token：每个 token 可以使用不同的检索文档。生成每个 token 时重新计算文档权重，相当于在生成过程中动态切换参考文档。直觉上，RAG-Token 更灵活（不同 token 关注不同文档），但计算开销更大。论文实验显示两者在不同任务上各有优劣，RAG-Sequence 在开放式生成上更好，RAG-Token 在需要精确引用的任务上更好。",tip:"用'同一文档 vs 动态切换'的对比说清区别。",pit:"只说'两种模式'但说不出具体差异。"},
{id:"r005",cat:"论文精读",q:"【RAG】论文的检索器用 DPR（Dense Passage Retrieval），它和传统 BM25 的本质区别是什么？",ans:"BM25 是稀疏检索：基于词频（TF-IDF 的变体）做关键词匹配，无法处理语义相似但词不同的情况（如同义词、改写）。DPR 是稠密检索：用双编码器（query encoder + passage encoder）把问题和文档都映射为稠密向量，用内积/余弦相似度做匹配。DPR 的优势是语义匹配——'谁创立了苹果公司'能匹配到'乔布斯创建了 Apple'。但 DPR 的缺点是需要训练、索引构建成本高、且在精确关键词匹配上不如 BM25。所以后来很多系统（如你的 RAG 智能体）用混合检索（BM25 + 向量）来兼顾两者。",tip:"用'语义匹配 vs 关键词匹配'对比，提到混合检索。",pit:"只说'DPR 用向量'但不说 BM25 的原理。"},
{id:"r006",cat:"论文精读",q:"【RAG】论文提到 RAG 可以解决 LLM 的'幻觉'问题，原理是什么？为什么不能完全解决？",ans:"RAG 通过检索外部知识让模型'有据可依'——生成时参考真实文档，减少凭空编造。原理：参数化记忆（LLM 权重）存储通用知识和语言能力，非参数化记忆（检索索引）存储可更新的事实知识，两者互补。不能完全解决的原因：1）检索本身可能不准（检索到无关文档）；2）模型可能忽略检索结果，仍用自己的参数知识回答；3）检索到的文档本身可能有错误；4）生成过程中模型可能在文档基础上'添油加醋'。你的 DARE-RAG 的门控机制就是在解决第一个问题——判断什么时候检索、检索什么。",tip:"用'四个失败模式'说明为什么不能完全解决。",pit:"只说'RAG 能减少幻觉'但不说局限。"},

/* —— 训练方法经典论文 —— */
{id:"r007",cat:"论文精读",q:"【Dropout】Srivastava et al. 2014 的 Dropout 为什么能防止过拟合？训练和推理时的行为有什么不同？",ans:"Dropout 在训练时以概率 p 随机将神经元输出置零。效果：1）相当于训练了 2^n 个子网络的集成（ensemble），测试时用所有神经元但输出乘以 (1-p) 做缩放；2）强迫每个神经元不能依赖特定的其他神经元（打破共适应），学到更鲁棒的特征；3）类似数据增强——每次前向传播的网络结构都不同。训练时每次 forward 用不同的 mask，推理时用全部神经元且不 drop（因为要确定性输出）。你的锐鉴医学模型用了 Dropout(0.3)，正是这个论文的直接应用。",tip:"用'集成学习 + 打破共适应'两个原理解释。",pit:"只说'随机丢弃'但说不出为什么有效。"},
{id:"r008",cat:"论文精读",q:"【Batch Normalization】Ioffe & Szegedy 2015 提出 BN 的核心作用是什么？为什么能加速训练？",ans:"BN 对每个 mini-batch 内的特征做归一化（减均值除标准差），再做可学习的仿射变换。加速训练的原因：1）解决了 Internal Covariate Shift——每层输入的分布在训练过程中不断变化，BN 稳定了每层的输入分布；2）使损失函数的等高线更圆润（loss landscape 更平滑），允许用更大的学习率；3）有轻微的正则化效果（因为每个样本的归一化依赖 mini-batch 中其他样本）。注意：后来有论文（How Does BN Help?）指出 BN 的真正作用是让损失 landscape 更平滑而非减少 ICS，但核心结论不变——BN 确实加速训练。",tip:"用'稳定分布 + 平滑 loss landscape'解释。",pit:"只说'加速收敛'但说不出原理。"},
{id:"r009",cat:"论文精读",q:"【Adam】Kingma & Ba 2014 的 Adam 优化器结合了哪两种方法？各自的贡献是什么？",ans:"Adam = Momentum（动量）+ RMSProp（自适应学习率）。Momentum 的贡献：用梯度的指数移动平均代替当前梯度，方向一致的梯度会累积加速，方向振荡的梯度会相互抵消，加速收敛并减少震荡。RMSProp 的贡献：对每个参数维护梯度平方的移动平均，用它来缩放学习率——梯度大的参数学习率自动减小，梯度小的参数学习率自动增大，适合稀疏梯度和非平稳目标。Adam 还加了偏差修正（前几步动量估计偏小，除以 (1-β^t) 修正），使训练初期更稳定。你的锐鉴医学模型用的就是 Adam。",tip:"用'Momentum 加速 + RMSProp 自适应'的分工解释。",pit:"只说'Adam 是最常用的优化器'但说不出组成。"},

/* —— 大语言模型谱系 —— */
{id:"r010",cat:"论文精读",q:"【BERT vs GPT】BERT 用双向 Encoder，GPT 用单向 Decoder，为什么选择不同？对下游任务有什么影响？",ans:"GPT 用因果掩码（causal mask）的 Decoder，每个 token 只能看到左边的上下文，适合自回归生成（从左到右续写）。BERT 用双向 Encoder，每个 token 能看到左右两边的所有上下文，适合理解任务（分类、NER、问答）。选择不同的原因：生成任务天然需要单向（否则生成时能看到未来的 token，不符合实际使用场景）；理解任务需要完整上下文才能做出准确判断。BERT 不能直接做生成（没有因果掩码），GPT 做理解任务时信息不完整（看不到右边）。后来 T5 用 Encoder-Decoder 统一了两种范式，你的 DARE-RAG 也是基于 Decoder-only 的 GPT 路线。",tip:"用'因果掩码 vs 双向'和'生成 vs 理解'的对应关系回答。",pit:"只说'BERT 双向 GPT 单向'但不说为什么。"},
{id:"r011",cat:"论文精读",q:"【GPT-3】Brown et al. 2020 的 Few-Shot Learning 是怎么工作的？为什么不需要微调？",ans:"GPT-3 的 Few-Shot 是在 prompt 中给几个示例（如 3-5 个 input-output 对），然后让模型对新 input 生成 output。不需要微调的原因：GPT-3 有 175B 参数，在海量数据上预训练时已经学会了'从示例中学习模式'的元能力（meta-learning）。预训练目标（next token prediction）本身就是在做 in-context learning——给定上下文预测下一个 token，本质上就是模式匹配。所以给几个示例，模型就能推断出任务模式并应用。这和传统的 fine-tuning（更新所有参数）本质不同——Few-Shot 不更新任何参数，只改变输入。",tip:"用'meta-learning + 预训练目标'解释为什么不需要微调。",pit:"只说'给几个例子就行'但说不出原理。"},
{id:"r012",cat:"论文精读",q:"【Scaling Laws】Kaplan et al. 2020 发现的 Scaling Law 核心结论是什么？对工业界的影响？",ans:"核心结论：LLM 的性能（loss）与三个因素呈幂律关系——模型参数量 N、数据量 D、计算量 C。具体地，L ∝ N^(-α)，α ≈ 0.076。关键发现：1）性能提升是可预测的——给定 N、D、C 可以预测最终 loss；2）模型越大、数据越多、算力越大，性能越好，没有饱和迹象；3）N 和 D 应同步扩展，只增大模型不增数据会边际递减。对工业界的影响：直接催生了'大力出奇迹'路线——GPT-4、PaLM、LLaMA 都是按 Scaling Law 预测的最优配置来训练的。Chinchilla 论文（#46）进一步修正了 N 和 D 的最优比例。",tip:"用'幂律关系 + 可预测性 + 同步扩展'三个要点回答。",pit:"只说'越大越好'但说不出幂律关系。"},

/* —— 对齐与 RLHF —— */
{id:"r013",cat:"论文精读",q:"【InstructGPT】RLHF 的三个阶段分别是什么？为什么需要 SFT 阶段？",ans:"1）SFT（Supervised Fine-Tuning）：用人工标注的高质量 prompt-response 对微调 GPT-3，让模型学会遵循指令的基本格式和风格。2）训练 Reward Model：收集模型多个回答，人工排序，训练一个奖励模型来预测人类偏好。3）PPO 优化：用强化学习（PPO 算法）优化策略模型，使其生成的回答获得更高的奖励分数。SFT 阶段的必要性：直接用 RL 从 GPT-3 开始训练效果很差——原始 GPT-3 的输出分布太散，RL 探索效率极低。SFT 先把模型拉到'大致正确'的分布附近，RL 在此基础上微调，大幅降低了 RL 的搜索空间。",tip:"用'三个阶段 + SFT 降低搜索空间'回答。",pit:"只说'用人类反馈训练'但说不出三个阶段。"},
{id:"r014",cat:"论文精读",q:"【DPO】Rafailov et al. 2023 的 DPO 为什么能替代 RLHF 中的 PPO？",ans:"DPO 的核心洞察：RLHF 中的 RL 优化目标（最大化奖励同时保持与 SFT 模型的 KL 散度约束）可以解析求解，不需要训练单独的 Reward Model，也不需要 PPO。DPO 推导出一个闭式解：直接用偏好数据（chosen vs rejected）训练策略模型，损失函数是二元交叉熵的形式。优势：1）不需要单独的 RM 训练，减少了一步训练；2）不需要 PPO 的复杂工程（GAE、clipping、value function）；3）训练更稳定，超参更少。本质是把'训练 RM → RL 优化'两步合并为一步直接优化。你的推免面试如果被问到'RLHF 和 DPO 的区别'，可以用这个框架回答。",tip:"用'闭式解替代 RL 两步'的数学洞察回答。",pit:"只说'DPO 更简单'但说不出为什么。"},

/* —— 高效架构与推理 —— */
{id:"r015",cat:"论文精读",q:"【FlashAttention】Dao et al. 2022 的核心创新是什么？为什么能加速？",ans:"标准 Attention 需要把完整的 N×N 注意力矩阵存到 GPU 的 HBM（高带宽内存），当序列很长时（如 N=8192），这个矩阵占用大量显存且 HBM 读写成为瓶颈。FlashAttention 的创新：用 tiling（分块）技术，把 Q、K、V 分成小块，每块在 SRAM（片上缓存，速度快 10-100 倍）中完成注意力计算，不需要把完整的 N×N 矩阵写入 HBM。数学上等价（精确注意力，非近似），只是改变了计算顺序（在线 softmax 算法）。效果：训练速度提升 2-4 倍，显存从 O(N²) 降到 O(N)。这就是为什么你的 LLM 能处理长上下文的关键技术。",tip:"用'HBM vs SRAM + tiling + 在线 softmax'解释。",pit:"只说'更快更省显存'但说不出 tiling 原理。"},
{id:"r016",cat:"论文精读",q:"【LoRA】Hu et al. 2021 的低秩适配为什么有效？为什么不直接微调全参数？",ans:"全参数微调大模型（如 LLaMA 7B）需要更新所有参数，显存和计算成本极高。LoRA 的思路：冻结原始权重 W，只训练低秩分解 ΔW = AB（A: d×r, B: r×d, r<<d）。效果等价于在原始权重上加一个低秩增量。有效的原因：1）大模型微调时的权重变化矩阵通常是低秩的（任务只需要调整一小部分特征方向）；2）参数量从 d² 降到 2dr（如 r=8 时减少 64 倍）；3）推理时可以把 ΔW 合并回 W，零额外开销。这是 Parameter-Efficient Fine-Tuning（PEFT）的代表方法，后续衍生出 QLoRA（量化 + LoRA）等。",tip:"用'低秩假设 + 参数量对比 + 零推理开销'三个优势回答。",pit:"只说'只训练一小部分参数'但说不出低秩假设。"},
{id:"r017",cat:"论文精读",q:"【Mamba】Gu & Dao 2023 的选择性状态空间模型（S6）相比 Transformer 有什么优势？",ans:"Transformer 的自注意力计算复杂度是 O(N²)（N 为序列长度），长序列时计算和显存开销剧增。Mamba 用选择性状态空间模型（S6）替代注意力：核心是状态转移方程 `h_t = A h_{t-1} + B x_t`，输出 `y_t = C h_t`，复杂度 O(N)。'选择性'指的是 A、B 矩阵依赖输入 x（输入相关的选择机制），而非固定，这让模型能动态决定'记住什么、忘记什么'。优势：线性复杂度处理超长序列（如 100 万 token）；推理时只需维护固定大小的隐藏状态，无需 KV Cache。劣势：在需要精确信息检索的任务（如复制、查找）上不如 Transformer。目前 Mamba 在长序列建模上很有前景，但还没完全取代 Transformer。",tip:"用'O(N) vs O(N²) + 选择性机制 + 推理效率'对比。",pit:"只说'比 Transformer 快'但说不出 S6 原理。"},

/* —— 生成模型 —— */
{id:"r018",cat:"论文精读",q:"【GAN】Goodfellow et al. 2014 的生成对抗网络中，Generator 和 Discriminator 各自学什么？训练时的博弈过程？",ans:"Generator（G）学习从噪声 z 生成假数据，目标是'骗过'Discriminator。Discriminator（D）学习区分真实数据和 G 生成的假数据。训练过程是极小极大博弈：`min_G max_D V(D,G) = E[log D(x)] + E[log(1-D(G(z)))]`。D 想最大化对真实/假数据的正确分类概率，G 想最小化 D 对假数据的判断准确率。理想平衡时 G 生成的数据分布与真实分布完全一致，D 对任何输入的判断概率都是 0.5（无法区分）。训练难点：模式崩塌（G 只生成少数几种样本）、训练不稳定（D 太强 G 梯度消失）。后续 WGAN（你的论文列表中有）用 Wasserstein 距离替代 JS 散度来缓解这些问题。",tip:"用'极小极大博弈 + 理想平衡态 + 模式崩塌'回答。",pit:"只说'两个网络对抗'但说不出博弈目标。"},
{id:"r019",cat:"论文精读",q:"【Diffusion Models】Ho et al. 2020 的 DDPM 前向过程和反向过程分别做什么？",ans:"前向过程（加噪）：对真实数据 x_0 逐步加高斯噪声，经过 T 步后变成纯噪声 x_T ~ N(0,I)。每步 `x_t = √(1-β_t) x_{t-1} + √β_t ε`，ε~N(0,I)。反向过程（去噪）：训练一个神经网络（U-Net）预测每步加入的噪声 ε_θ(x_t, t)，然后用它从 x_T 逐步去噪还原回 x_0。训练目标是 `L = ||ε - ε_θ(x_t, t)||²`，即让网络预测的噪声尽量接近实际加入的噪声。生成时从随机噪声出发，反复调用网络去噪，最终得到清晰图像。本质是把生成问题转化为去噪问题——'先破坏再学习修复'。你的论文列表中的 Latent Diffusion（Stable Diffusion）是在此基础上加了 VAE 压缩，降低计算成本。",tip:"用'加噪→去噪'的两步框架回答。",pit:"只说'扩散模型生成图片'但说不出前向/反向过程。"},

/* —— 图神经网络 —— */
{id:"r020",cat:"论文精读",q:"【GCN】Kipf & Welling 2016 的图卷积网络的核心操作是什么？和传统 CNN 的区别？",ans:"GCN 的核心操作：对每个节点，聚合其所有邻居的特征，然后做线性变换+激活。公式：`H^{(l+1)} = σ(D̃^{-1/2} Ã D̃^{-1/2} H^{(l)} W^{(l)})`，其中 Ã = A + I（邻接矩阵加自环），D̃ 是度矩阵。本质是'消息传递'——每个节点从邻居收集信息。和传统 CNN 的区别：1）CNN 处理规则网格（如图像像素），GCN 处理不规则图（节点数和连接模式都不同）；2）CNN 的卷积核大小固定，GCN 的'感受野'取决于节点的度；3）GCN 不需要固定大小的输入。应用场景：社交网络分析、分子性质预测、推荐系统。",tip:"用'消息传递 + 不规则图 vs 规则网格'对比。",pit:"只说'图上的卷积'但说不出消息传递机制。"},

/* —— 综合理解 —— */
{id:"r021",cat:"论文精读",q:"【综合】从 AlexNet（2012）到 DeepSeek-R1（2025），AI 发展的主线是什么？",ans:"主线可以概括为三条并行的脉络：1）架构演进：CNN（AlexNet/VGG/ResNet）→ RNN/LSTM → Transformer → Mamba 等替代架构，核心趋势是更强的表达力和更好的并行性；2）规模扩展：从百万参数（AlexNet）到万亿参数（GPT-4），Scaling Law 驱动的'大力出奇迹'，加上 LoRA/FlashAttention 等效率技术让规模化可行；3）范式转变：从监督学习（ImageNet 分类）→ 预训练+微调（BERT/GPT）→ 提示工程+上下文学习（GPT-3）→ 对齐与人类偏好（RLHF/DPO）→ 推理能力（CoT/R1）。你的研究（RAG）处于第二和第三条脉络的交汇处——用检索增强来扩展 LLM 的知识边界。",tip:"用'架构→规模→范式'三条主线概括。",pit:"按时间罗列论文但说不出主线。"},
{id:"r022",cat:"论文精读",q:"【综合】你读过的 62 篇论文中，哪 3 篇对你的研究方向（RAG/LLM）影响最大？为什么？",ans:"1）Lewis et al. 2020（RAG 原始论文）——直接定义了 RAG 范式：参数化记忆 + 非参数化记忆的结合方式，是我 DARE-RAG 的理论基础。2）Vaswani et al. 2017（Transformer）——所有 LLM 的基础架构，理解注意力机制是理解 RAG 中检索和生成的前提。3）Brown et al. 2020（GPT-3）——证明了 Few-Shot/In-Context Learning 的能力，说明 LLM 可以通过上下文利用外部知识，这正是 RAG 的出发点。这三篇构成了'检索怎么做的基础（Transformer）→ 检索和生成怎么结合（RAG）→ 为什么需要检索（LLM 的局限）'的完整逻辑链。",tip:"选 3 篇并用逻辑链串联。",pit:"随便选 3 篇说不出关联。"},
{id:"r023",cat:"论文精读",q:"【综合】Chain-of-Thought（CoT）为什么能让 LLM 推理能力提升？和 RAG 有什么互补关系？",ans:"CoT（Wei et al. 2022）让 LLM 在回答前先输出推理过程（'Let's think step by step'）。提升原因：1）分解复杂问题为简单子步骤，每步的预测更准确；2）中间推理过程作为'工作记忆'，减少单步推理的负担；3）本质上是在 prompt 中增加了计算量（test-time compute），类似人类打草稿。和 RAG 的互补：RAG 提供外部事实知识（减少幻觉），CoT 提供推理能力（多步逻辑）。两者结合 = 有据可依 + 有理可推。你的 DARE-RAG 如果加入 CoT，可以让模型在决定是否扩展检索前先分析查询的推理需求，门控决策会更准确。",tip:"用'分解问题 + 工作记忆 + test-time compute'解释 CoT。",pit:"只说'让模型一步步想'但说不出为什么有效。"},
{id:"r024",cat:"论文精读",q:"【AlphaFold】Jumper et al. 2021 用什么方法解决了蛋白质结构预测问题？和你的锐鉴医学有什么关联？",ans:"AlphaFold 2 用 Evoformer（改进的 Transformer）处理多序列比对（MSA）和残基对特征，用 Structure Module（等变注意力网络）预测 3D 坐标。核心创新：1）Evoformer 在 MSA 表示和残基对表示之间交替做注意力，捕获共演化信息；2）用 Frames Attention 预测每个残基的局部坐标系，再组装全局结构。和锐鉴医学的关联：都是用深度学习解决生物学问题。AlphaFold 预测蛋白质 3D 结构，锐鉴医学预测 crRNA 的荧光强度（功能）。两者都用序列表示学习（蛋白质序列 vs RNA 序列），都面临数据稀缺问题（AlphaFold 用 MSA 增强数据，锐鉴医学用时间标签增强）。AlphaFold 3（你的论文列表 #60）进一步扩展到蛋白质-核酸-小分子的复合物预测。",tip:"用'序列表示学习 + 数据增强'建立关联。",pit:"说'都是生物学但没关系'。"},

/* —— 视觉与经典CNN —— */
{id:"r025",cat:"论文精读",q:"【AlexNet】Krizhevsky et al. 2012 为什么能引爆深度学习革命？和传统方法的本质区别？",ans:"AlexNet 在 ImageNet 上把 top-5 错误率从 26% 降到 16%，核心突破：1）用 ReLU 替代 Sigmoid/Tanh，解决梯度消失问题，训练速度提升 6 倍；2）用 Dropout 防止过拟合；3）用 GPU 训练（2 块 GTX 580），让大规模网络变得可行；4）数据增强（随机裁剪、水平翻转）扩大训练集。本质区别：传统方法靠手工特征（SIFT、HOG），AlexNet 端到端学习特征。这证明了'深度网络 + 大数据 + GPU'的组合威力，直接催生了后续所有深度学习的爆发。",tip:"用'ReLU+Dropout+GPU+端到端'四个关键词。",pit:"只说'用了很多层'。"},
{id:"r026",cat:"论文精读",q:"【VGGNet】Simonyan & Zisserman 2014 用 3×3 小卷积核替代大卷积核，为什么？",ans:"VGGNet 全用 3×3 卷积核，堆叠多层。关键洞察：两个 3×3 卷积的感受野等于一个 5×5，三个等于一个 7×7，但参数量更少。以 3 层 3×3 vs 1 层 7×7 为例：参数量比为 3×(C×3×3×C) vs 1×(C×7×7×C) = 27C² vs 49C²，减少约 45%。同时每层后接 ReLU，非线性更强（3 次 ReLU vs 1 次）。VGG 证明了'更深更窄'比'更浅更宽'更有效，为后续 ResNet 等超深网络铺路。",tip:"用参数量计算和非线性次数对比。",pit:"只说'小卷积核更好'但说不出为什么。"},
{id:"r027",cat:"论文精读",q:"【ResNet】He et al. 2015 的残差连接为什么能训练超深网络？",ans:"核心问题：网络加深后，理论上更深的网络至少不比浅层差（恒等映射），但实际训练时深层网络反而准确率下降（退化问题，不是过拟合）。ResNet 的解法：学习残差 F(x) = H(x) - x，而非直接学 H(x)。如果恒等映射是最优的，网络只需学 F(x)→0（比学 H(x)=x 容易得多）。数学上：`y = F(x) + x`，梯度可以通过 skip connection 直接回传：`∂y/∂x = ∂F/∂x + 1`，即使 ∂F/∂x 很小，梯度也不会消失。这让训练 152 层甚至 1000+ 层的网络成为可能。你的手撕神经网络 ch8 应该实现了这个结构。",tip:"用'学习残差比学习恒等映射容易 + 梯度直通'解释。",pit:"只说'加了一条捷径'但说不出梯度分析。"},
{id:"r028",cat:"论文精读",q:"【U-Net】Ronneberger et al. 2015 的编码器-解码器结构中，Skip Connection 的作用是什么？",ans:"U-Net 用于生物医学图像分割（和你的锐鉴医学同领域）。编码器逐步下采样提取特征，解码器上采样恢复分辨率。Skip Connection 把编码器每层的特征图直接拼接到解码器对应层。作用：1）恢复空间细节——下采样丢失了位置信息，skip connection 把高分辨率特征传给解码器；2）缓解梯度消失——提供了梯度回传的捷径；3）多尺度特征融合——解码器同时有深层语义特征和浅层细节特征。在医学图像分割中，边界精度至关重要，skip connection 对保持分割边界很关键。",tip:"用'恢复空间细节 + 多尺度融合'解释。",pit:"只说'连接编码器和解码器'。"},
{id:"r029",cat:"论文精读",q:"【Knowledge Distillation】Hinton et al. 2015 的知识蒸馏核心思想是什么？",ans:"用大模型（Teacher）的软标签（soft label）训练小模型（Student）。关键 insight：Teacher 的 softmax 输出（温度 T>1 时更平滑）包含了类别之间的相似性信息（如'猫'和'狗'的输出概率都较高），这比硬标签（one-hot）信息量更丰富。Student 同时学习 Teacher 的软标签和真实硬标签，损失 = α×KL(soft) + (1-α)×CE(hard)。效果：小模型可以达到接近大模型的性能，但推理速度快很多。这和 LoRA 的思路相反——LoRA 是微调大模型，蒸馏是用大模型训练小模型。两者都是模型压缩的方法。",tip:"用'软标签包含类间关系信息'解释核心 insight。",pit:"只说'用大模型教小模型'但说不出软标签的作用。"},

/* —— NLP 经典 —— */
{id:"r030",cat:"论文精读",q:"【Word2Vec】Mikolov et al. 2013 的 Word2Vec 为什么能学到语义关系？",ans:"核心假设是'分布式语义假说'——意思相近的词出现在相似的上下文中。Word2Vec 用浅层神经网络（CBOW 或 Skip-gram）预测上下文词。训练后，每个词的嵌入向量编码了其上下文信息。经典的'king - man + woman ≈ queen'说明向量空间捕获了语义关系。本质上，Word2Vec 是一个降维操作——把高维的 one-hot 词表示压缩为低维稠密向量（如 300 维），同时保留语义关系。后续的 BERT、GPT 等都是在这个基础上发展的，只不过从静态词向量变成了上下文相关的动态表示。",tip:"用'分布式语义假说 + 降维 + 语义关系'解释。",pit:"只说'把词变成向量'但说不出为什么有效。"},
{id:"r031",cat:"论文精读",q:"【Seq2Seq】Sutskever et al. 2014 的编码器-解码器架构有什么局限？",ans:"Seq2Seq 用一个 RNN 编码整个输入序列到一个固定长度的向量（context vector），另一个 RNN 从这个向量解码生成输出。局限：1）信息瓶颈——整个输入压缩为一个固定向量，长序列信息丢失严重（论文自己也承认长句子效果差）；2）编码器最后一步的隐藏状态要承担所有信息，梯度回传路径长。这些局限直接催生了 Bahdanau Attention（你的论文列表 #7）——让解码器在每一步都能'回头看'编码器的所有隐藏状态，而不是只依赖最后一个向量。Attention 是 Seq2Seq 到 Transformer 的关键过渡。",tip:"用'信息瓶颈 + 固定向量'解释局限。",pit:"只说'效果不好'但说不出具体原因。"},
{id:"r032",cat:"论文精读",q:"【Bahdanau Attention】2014 年的注意力机制和 Transformer 的 Self-Attention 有什么区别？",ans:"Bahdanau Attention 是 cross-attention：解码器在生成每个 token 时，对编码器所有位置计算注意力权重，动态选择关注输入的哪些部分。关键区别：1）Bahdanau 是单向的（解码器→编码器），Self-Attention 是同序列内任意位置互相看；2）Bahdanau 用加性注意力（MLP），Transformer 用点积注意力（更快）；3）Bahdanau 仍基于 RNN（序列计算），Transformer 完全并行。历史意义：Bahdanau 证明了注意力机制的价值，Vaswani 在此基础上去掉了 RNN，用纯注意力构建了 Transformer。",tip:"用'cross-attention vs self-attention + RNN vs 并行'对比。",pit:"只说'都是注意力'但说不出区别。"},

/* —— 生成模型 —— */
{id:"r033",cat:"论文精读",q:"【VAE】Kingma & Welling 2013 的变分自编码器和普通自编码器有什么区别？",ans:"普通自编码器（AE）把输入压缩为确定性的潜在表示 z，解码器从 z 重建输入。VAE 把 z 变成概率分布（高斯分布），编码器输出均值 μ 和方差 σ²，z 从 N(μ,σ²) 采样得到。关键区别：VAE 的潜在空间是连续的、有结构的（通过 KL 散度正则化），可以从潜在空间随机采样生成新数据。普通 AE 的潜在空间不连续，采样可能生成无意义数据。VAE 的损失 = 重建损失 + KL 散度（让潜在分布接近标准正态）。后续的 Stable Diffusion 中的 VAE 就是用这个思想压缩图像到潜在空间。",tip:"用'概率潜在空间 + KL 正则化 + 可采样'对比。",pit:"只说'加了噪声'但说不出概率建模。"},
{id:"r034",cat:"论文精读",q:"【WaveNet】van den Oord et al. 2016 用什么结构生成原始音频？为什么不用 RNN？",ans:"WaveNet 用因果膨胀卷积（Causal Dilated Convolution）生成音频。每层用膨胀率指数增长的卷积核（如 1,2,4,8...），使得感受野随层数指数增长，能捕获长距离依赖。不用 RNN 的原因：1）RNN 序列计算太慢，生成 1 秒音频（16000 采样点）需要 16000 步；2）RNN 的长期记忆有限。膨胀卷积可以并行处理，且感受野更大。残差连接和 skip connection 保证梯度流动。效果：生成的语音质量远超当时的统计参数合成。这是非自回归/半自回归生成的早期探索，和后来的扩散模型思路有相似之处。",tip:"用'膨胀卷积指数增长感受野 + 并行性'解释。",pit:"只说'用卷积生成声音'。"},
{id:"r035",cat:"论文精读",q:"【WGAN】Arjovsky et al. 2017 用 Wasserstein 距离替代 JS 散度，解决了什么问题？",ans:"原始 GAN 用 JS 散度衡量生成分布和真实分布的差异。问题：当两个分布不重叠时（高维空间中很常见），JS 散度恒为 log2，梯度为零，D 无法给 G 有用的梯度。Wasserstein 距离（推土机距离）即使在分布不重叠时也能提供有意义的距离度量和梯度。WGAN 的改动：1）D 改为 Critic（输出实数值而非概率）；2）损失函数改为 `E[Critic(x_real)] - E[Critic(x_fake)]`；3）对 Critic 做 weight clipping 保证 Lipschitz 约束。后续 WGAN-GP 用梯度惩罚替代 clipping，训练更稳定。这是 GAN 训练稳定性的重要突破。",tip:"用'JS散度在不重叠时梯度为零 + Wasserstein提供有意义梯度'解释。",pit:"只说'更稳定'但说不出数学原因。"},
{id:"r036",cat:"论文精读",q:"【CycleGAN】Zhu et al. 2017 的循环一致性是什么意思？解决了什么问题？",ans:"CycleGAN 实现无配对的图像风格转换（如马→斑马、夏天→冬天）。核心约束：如果把马转成斑马再转回来，应该得到原来的马。公式：`x → G(x) → F(G(x)) ≈ x`，即 F∘G ≈ identity。这就是循环一致性损失（cycle consistency loss）。解决的问题：配对数据很难获得（需要同一场景的马和斑马照片），循环一致性让模型在没有配对数据的情况下也能学到有意义的转换。直觉：转换必须保留内容信息（否则无法还原），只改变风格信息。这是无配对图像翻译的开创性工作。",tip:"用'无配对 + 循环一致性约束 + 内容保留'解释。",pit:"只说'图片风格转换'但说不出无配对的创新。"},
{id:"r037",cat:"论文精读",q:"【StyleGAN】Karras et al. 2018 的 AdaIN 是怎么控制生成图像的风格的？",ans:"AdaIN（Adaptive Instance Normalization）的工作流程：1）对输入噪声 z 先生成一个固定的'常量'特征图（4×4×512）；2）用 Mapping Network 把 z 映射为风格向量 w；3）每层用 w 通过 AdaIN 调制特征图——先对特征图做实例归一化（减均值除标准差），再用 w 的仿射变换缩放和平移。效果：w 控制了每层的'风格'——低层控制姿态/脸型，高层控制颜色/纹理。这实现了风格的分层控制（style mixing），是 AI 生成人脸（thispersondoesnotexist.com）的技术基础。",tip:"用'Mapping Network + AdaIN 分层控制'解释。",pit:"只说'控制风格'但说不出 AdaIN 机制。"},

/* —— 图神经网络 —— */
{id:"r038",cat:"论文精读",q:"【GAT】Veličković et al. 2018 的图注意力网络和 GCN 有什么区别？",ans:"GCN 对邻居做均值聚合（权重固定，等于度数的倒数），GAT 用注意力机制学习邻居的权重。具体：GAT 对每对相邻节点计算注意力系数 α_ij = softmax(LeakyReLU(a^T [Wh_i || Wh_j]))，权重由节点特征决定而非图结构。优势：1）不同邻居的重要性可以不同（重要节点权重大）；2）可以学到多头注意力（类似 Transformer），更鲁棒。GCN 假设所有邻居同等重要，在异质图上效果受限。GAT 在引文网络等任务上优于 GCN。和 Transformer 的关系：GAT 本质上是把 Self-Attention 用在了图结构数据上。",tip:"用'可学习注意力权重 vs 固定权重'对比。",pit:"只说'加了注意力'但说不出具体差异。"},

/* —— 预训练与大模型 —— */
{id:"r039",cat:"论文精读",q:"【GPT-2】Radford et al. 2019 的核心发现是什么？和 GPT-1 有什么区别？",ans:"GPT-2 的核心发现是'语言模型是无监督多任务学习者'——只用下一个词预测的目标训练，不针对任何特定任务，就能在零样本（zero-shot）设置下完成翻译、问答、摘要等任务。和 GPT-1 的区别：1）规模更大（1.5B vs 117M）；2）不微调，直接用 prompt 做零样本；3）证明了'能力涌现'——足够大的语言模型自然获得多任务能力。GPT-2 当时因为'太危险'（可能被用于生成假新闻）而延迟发布，这也是 AI 安全讨论的起点。这直接铺垫了 GPT-3 的 Few-Shot 能力。",tip:"用'零样本多任务 + 能力涌现 + 安全争议'回答。",pit:"只说'比 GPT-1 大'。"},
{id:"r040",cat:"论文精读",q:"【T5】Raffel et al. 2019 为什么要把所有 NLP 任务统一为 Text-to-Text 格式？",ans:"T5 的思路：把分类、翻译、问答、摘要等所有任务都转化为'输入文本→输出文本'的格式。例如情感分类：输入 'sentiment: I love this movie'，输出 'positive'。好处：1）一个模型架构解决所有任务，不需要为每个任务设计不同的输出头；2）预训练和下游任务的形式完全一致，迁移更自然；3）可以通过 prompt 格式区分不同任务（如加前缀 'translate English to German:'）。T5 还系统比较了预训练目标、架构、数据量等因素，是 Encoder-Decoder 路线的巅峰之作。和 Decoder-only（GPT）的分道扬镳也从此开始。",tip:"用'统一格式 + 一个模型解决所有任务'解释。",pit:"只说'把所有任务变成文本'但说不出好处。"},
{id:"r041",cat:"论文精读",q:"【BERT】Devlin et al. 2018 的 MLM 预训练目标是什么？为什么不能用标准语言模型目标？",ans:"MLM（Masked Language Model）随机遮盖输入中 15% 的 token，让模型预测被遮盖的词。不能用标准 LM 目标（从左到右预测下一个词）的原因：BERT 用双向 Encoder，每个位置能看到所有其他位置。如果用标准 LM，模型在预测位置 i 的词时能看到位置 i+1 的词（因为是双向的），这相当于在考试时偷看答案，预训练目标就失去了意义。MLM 强制模型只能从上下文中预测，不泄露答案。但 MLM 也导致了预训练和微调的不一致——微调时没有 mask，这也是后来 RoBERTa 等工作改进的方向。",tip:"用'双向不能用标准LM + mask避免泄露'解释。",pit:"只说'随机遮盖'但说不出为什么不用LM目标。"},
{id:"r042",cat:"论文精读",q:"【LLaMA】Touvron et al. 2023 的核心贡献是什么？和 GPT-3 有什么区别？",ans:"LLaMA 的核心贡献是证明了'开源小模型可以匹配闭源大模型'。具体改进：1）用 RMSNorm 替代 LayerNorm（更稳定）；2）用 SwiGLU 激活函数替代 ReLU（效果更好）；3）用 RoPE 旋转位置编码（支持长度外推）；4）用 Chinchilla 的最优数据/参数比训练（1.4T token 训 7B/13B/33B/65B）。和 GPT-3 的区别：GPT-3 是 175B 参数、闭源、只通过 API 访问；LLaMA 是 7B-65B、开源、可以在消费级 GPU 上运行。LLaMA 开源后催生了 Alpaca、Vicuna 等一大批开源社区模型，彻底改变了 LLM 生态。",tip:"用'开源 + 架构改进 + Chinchilla 最优比'回答。",pit:"只说'开源的 GPT-3'。"},

/* —— 视觉Transformer —— */
{id:"r043",cat:"论文精读",q:"【ViT】Dosovitskiy et al. 2020 把图像分成 16×16 的 patch 输入 Transformer，为什么？",ans:"Transformer 处理的是 1D token 序列，不能直接处理 2D 图像。ViT 的做法：把图像切成固定大小的 patch（如 16×16），每个 patch 展平为 1D 向量，加上位置编码后作为 token 输入 Transformer。为什么 16×16：1）太小（如 4×4）序列太长，计算量 O(n²) 爆炸；2）太大（如 32×32）丢失细节。16×16 是精度和效率的平衡。ViT 的意义：证明了纯 Transformer 可以在视觉任务上超越 CNN（需要大数据预训练），打破了 CNN 在视觉领域的垄断。后续的 DeiT、Swin Transformer 等都是在这个基础上发展的。",tip:"用'1D序列化2D + patch大小权衡 + 打破CNN垄断'解释。",pit:"只说'把图片切成块'但说不出设计考量。"},
{id:"r044",cat:"论文精读",q:"【DETR】Carion et al. 2020 用 Transformer 做目标检测，和传统 R-CNN 系列有什么区别？",ans:"传统检测流程：Anchor 生成→特征提取→分类+回归→NMS 后处理，需要大量手工设计（anchor 大小、NMS 阈值等）。DETR 把检测转化为集合预测问题：1）CNN 提取特征；2）Transformer Encoder 处理特征图，Decoder 用可学习的 object queries 从特征中提取物体；3）二部图匹配（Hungarian loss）直接预测 N 个物体，不需要 NMS。优势：端到端训练、不需要 anchor、不需要 NMS；劣势：需要更长训练时间、对小物体效果差。DETR 证明了 Transformer 的全局注意力可以替代 CNN 的局部感受野做物体关系建模。",tip:"用'集合预测 + 不需要anchor和NMS + 二部图匹配'回答。",pit:"只说'用 Transformer 做检测'。"},

/* —— 多模态 —— */
{id:"r045",cat:"论文精读",q:"【CLIP】Radford et al. 2021 的对比学习怎么实现图文匹配？",ans:"CLIP 训练两个编码器：Image Encoder（ViT 或 ResNet）和 Text Encoder（Transformer）。训练时，一个 batch 有 N 对图文对，计算所有 N×N 的图文相似度矩阵，对角线是正样本（匹配的图文对），其余是负样本。损失函数是对称的对比损失（InfoNCE）：让匹配的图文对相似度最高，不匹配的最低。训练数据是从互联网收集的 4 亿图文对。效果：zero-shot 分类——给一张图片和几个文本描述，选最匹配的文本作为预测类别，不需要任何微调就能在 ImageNet 上达到 ResNet-50 的水平。这是多模态基础模型的起点。",tip:"用'对比学习 + N×N相似度矩阵 + zero-shot'解释。",pit:"只说'图文配对训练'但说不出对比学习机制。"},
{id:"r046",cat:"论文精读",q:"【DALL-E】Ramesh et al. 2021 的文本生成图像是怎么工作的？",ans:"DALL-E 1 用 dVAE（离散变分自编码器）把图像压缩为离散 token，然后用 Transformer 建模文本+图像 token 的联合分布。训练分两步：1）先训练 dVAE 把 256×256 图像压缩为 32×32=1024 个离散 token；2）用 GPT 架构的 Transformer 同时处理文本 token 和图像 token，用自回归方式预测下一个 token。生成时：先编码文本，然后 Transformer 自回归生成图像 token，最后 dVAE 解码回图像。和后续 Stable Diffusion 的区别：DALL-E 是自回归生成（逐 token），Stable Diffusion 是扩散模型（逐步去噪），后者质量和效率更高。",tip:"用'dVAE压缩 + 自回归联合建模'解释。",pit:"只说'根据文字画图'但说不出架构。"},

/* —— 对齐与安全 —— */
{id:"r047",cat:"论文精读",q:"【Constitutional AI】Bai et al. 2022 用 AI 反馈替代人类反馈，思路是什么？",ans:"RLHF 需要大量人类标注（排序模型回答），成本高且标注者能力有限。Constitutional AI 的思路：1）先让模型生成回答；2）用一组'宪法原则'（如'回答应该无害'）让 AI 自己评判回答是否违反原则；3）用 AI 的评判结果训练 Reward Model，再用 RL 优化。关键创新：用 AI 反馈（RLAIF）替代人类反馈，大幅降低标注成本。两阶段：SL-CAI（用自我批评+修正的监督学习）和 RLAIF（用 AI 偏好的 RL）。效果接近 RLHF 但标注成本降低 10 倍以上。这是 AI 自我改进的重要方向。",tip:"用'宪法原则 + AI自我评判 + RLAIF'解释。",pit:"只说'用AI代替人'但说不出具体流程。"},
{id:"r048",cat:"论文精读",q:"【ReAct】Yao et al. 2022 的 Reasoning + Acting 范式是什么？",ans:"ReAct 让 LLM 交替进行推理（Thought）和行动（Action）。例如：Thought: 我需要查一下今天的天气 → Action: search('今天天气') → Observation: 北京晴 25°C → Thought: 用户问的是上海 → Action: search('上海天气') → Observation: 上海多云 20°C → Answer: 上海今天多云 20°C。核心思想：纯推理（CoT）可能产生幻觉（因为没有外部验证），纯行动（工具调用）缺乏规划。ReAct 结合两者：推理提供规划和反思，行动获取真实信息。这是 Agent（智能体）范式的基础，你的 RAG 智能体实践中的工具调用就是这个思想的应用。",tip:"用'Thought-Action-Observation循环'解释。",pit:"只说'推理加行动'但说不出循环机制。"},

/* —— 效率与工程 —— */
{id:"r049",cat:"论文精读",q:"【Switch Transformer】Fedus et al. 2021 的稀疏专家模型怎么实现万亿参数？",ans:"Switch Transformer 用 Mixture of Experts（MoE）：每个 token 只激活少数几个专家（FFN 模块），而非全部。具体：路由器（Router）为每个 token 选择 top-1 个专家，只计算该专家的 FFN，其余专家跳过。效果：总参数量 1.6 万亿，但每个 token 只激活约 1/100 的参数，计算量和 dense 7B 模型差不多。优势：用相同计算量获得更大的模型容量。劣势：负载均衡困难（有些专家被过度使用），需要辅助损失函数来平衡。后续的 Mixtral、DeepSeek-V3 都用了 MoE 架构。",tip:"用'top-1路由 + 稀疏激活 + 负载均衡'解释。",pit:"只说'只用一部分参数'但说不出 MoE 机制。"},
{id:"r050",cat:"论文精读",q:"【Chinchilla】Hoffmann et al. 2022 的核心结论是什么？对大模型训练有什么影响？",ans:"Chinchilla 的核心结论：在固定计算预算下，模型参数量 N 和训练数据量 D 应该同比例扩展，最优比例是 D ≈ 20N（即 70B 模型需要 1.4T token）。此前的实践（如 GPT-3 175B 只用 300B token）严重欠训练——模型太大但数据不够。影响：1）LLaMA 7B 用 1T token 训练（远超 Chinchilla 最优比），性能匹配更大的欠训练模型；2）改变了'越大越好'的观念——同样的算力，训练一个小但充分的模型比训练一个大但欠训练的模型更划算；3）推动了数据质量的重要性——数据不够时，提升数据质量比增大模型更有效。",tip:"用'D ≈ 20N + 欠训练问题 + 小模型充分训练'回答。",pit:"只说'数据和模型要匹配'但说不出比例。"},

/* —— 科学AI —— */
{id:"r051",cat:"论文精读",q:"【AlphaFold 3】Abramson et al. 2024 相比 AlphaFold 2 有什么突破？",ans:"AlphaFold 2 只预测蛋白质结构，AlphaFold 3 扩展到蛋白质-核酸-小分子-离子的复合物预测。技术突破：1）用 Diffusion Module 替代 Structure Module，基于扩散模型生成 3D 坐标，更灵活地处理不同类型的分子；2）引入 cross-attention 处理不同分子间的交互；3）能预测蛋白质与 DNA/RNA/小药物分子的结合位点。对你的意义：锐鉴医学处理的是 crRNA（核酸）和蛋白质（Cas12a）的交互，AlphaFold 3 的技术路线可能对你的后续研究有启发——用扩散模型预测 RNA-蛋白质复合物结构。",tip:"用'从蛋白质到复合物 + 扩散模型替代'对比。",pit:"只说'更准了'但说不出技术变化。"},
{id:"r052",cat:"论文精读",q:"【Gemini 1.5】Reid et al. 2024 怎么实现百万级 token 的长上下文？",ans:"Gemini 1.5 Pro 支持 100 万 token 的上下文窗口（约 1 小时视频或 1 万页文档）。核心技术：1）MoE 架构——稀疏激活降低长序列的计算成本；2）改进的位置编码（可能用了 RoPE 的长度外推变体）；3）高效的注意力实现（可能用了 Ring Attention 或类似的分布式长序列方案）。评估方法：'大海捞针'测试——在长文本的随机位置插入一个事实，看模型能否检索到。实际挑战：长上下文的训练数据很难获取（需要超长文档），推理时 KV Cache 的显存占用巨大。这是当前 LLM 研究的热点方向之一。",tip:"用'MoE + 位置编码外推 + 大海捞针测试'回答。",pit:"只说'支持很长的文本'。"},

/* —— RL 与搜索 —— */
{id:"r053",cat:"论文精读",q:"【AlphaGo】Silver et al. 2016 用哪三个组件击败人类围棋冠军？",ans:"1）策略网络（Policy Network）：预测下一步最优落子位置，用人类棋谱监督学习训练；2）价值网络（Value Network）：评估当前棋局的胜率，用自我对弈的 RL 训练；3）蒙特卡洛树搜索（MCTS）：结合策略网络和价值网络做前瞻搜索。三者协同：策略网络提供候选走法，价值网络评估走法好坏，MCTS 在两者基础上做全局规划。关键创新：用深度学习替代了传统围棋程序的手工评估函数，用 RL 超越了人类水平。后续 AlphaGo Zero（#20）去掉了人类棋谱，纯自我对弈更强。",tip:"用'策略网络+价值网络+MCTS'三组件回答。",pit:"只说'用神经网络下棋'但说不出三个组件。"},
{id:"r054",cat:"论文精读",q:"【PPO】Schulman et al. 2017 为什么成为 RLHF 的默认 RL 算法？",ans:"PPO（Proximal Policy Optimization）的核心是 clipped surrogate objective：限制策略更新的幅度，避免一步更新太猛导致崩溃。公式：`L = min(r(θ)A, clip(r(θ), 1-ε, 1+ε)A)`，其中 r(θ) 是新旧策略的概率比，A 是优势函数。为什么成为 RLHF 默认：1）比 TRPO（Trust Region Policy Optimization）简单——TRPO 需要二阶优化和 KL 约束，PPO 只用一阶优化+clipping；2）稳定——clipping 防止策略更新过大；3）样本效率高——可以多次复用同一批数据。InstructGPT 和后续几乎所有 RLHF 系统都用 PPO，你的论文列表中 PPO 和 RLHF 的关联就是这条线。",tip:"用'clipped objective + 比TRPO简单 + 稳定'回答。",pit:"只说'一种 RL 算法'但说不出为什么选它。"},
{id:"r055",cat:"论文精读",q:"【AlphaZero】Silver et al. 2017 去掉人类棋谱后怎么自我超越？",ans:"AlphaZero 从零开始（纯随机策略），通过自我对弈 + RL + MCTS 循环改进：1）用当前策略网络自我对弈生成棋谱；2）用棋谱训练新的策略网络和价值网络；3）用新网络指导 MCTS 搜索，MCTS 的结果又作为新策略的训练目标。循环迭代。关键 insight：不需要人类知识作为起点，只要搜索空间和评估函数定义正确，纯自我探索就能超越人类。在围棋、国际象棋、将棋上都击败了对应的世界冠军程序。这证明了'通用强化学习+搜索'的强大，也为后来的 GPT 等'从数据中自动学习'的范式提供了理论支持。",tip:"用'自我对弈→训练→搜索→新策略'循环解释。",pit:"只说'自己学自己'但说不出循环机制。"},

/* —— 检测与分割 —— */
{id:"r056",cat:"论文精读",q:"【SAM】Kirillov et al. 2023 的 Segment Anything 怎么实现零样本分割？",ans:"SAM 用 Promptable 分割任务训练：给定图像 + 提示（点/框/文本），输出分割掩码。训练数据：SA-1B 数据集（1100 万图像、10 亿掩码），通过数据引擎（模型辅助标注→自动标注）高效收集。架构：图像 Encoder（ViT）+ Prompt Encoder + 轻量级 Mask Decoder。零样本能力：在 SA-1B 上训练后，不需要任何下游数据微调，直接给提示就能分割从未见过的物体。这和 CLIP 类似——用大规模预训练实现 zero-shot 泛化。SAM 的开源推动了图像分割的民主化，任何开发者都能用它做分割任务。",tip:"用'Promptable任务 + 数据引擎 + zero-shot泛化'解释。",pit:"只说'能分割任何东西'但说不出为什么。"},

/* —— 偏好优化 —— */
{id:"r057",cat:"论文精读",q:"【DPO】Rafailov et al. 2023 的推导核心是什么？为什么不需要 Reward Model？",ans:"DPO 的关键推导：RLHF 的目标是 `max E[r(x,y)] - β·KL(π_θ || π_ref)`，可以解析求解得到最优策略 π*(y|x) ∝ π_ref(y|x)·exp(r(x,y)/β)。反过来，奖励函数可以表示为 `r(x,y) = β·log(π*(y|x)/π_ref(y|x)) + β·log Z(x)`。把这代入偏好损失（Bradley-Terry 模型），Z(x) 消掉，得到 DPO 损失：`L = -log σ(β·log(π_θ(y_w|x)/π_ref(y_w|x)) - β·log(π_θ(y_l|x)/π_ref(y_l|x)))`。核心 insight：不需要单独的 Reward Model，直接用策略模型的 log 比率差来表示偏好。这把 RM + RL 两步合并为一步监督学习。",tip:"用'闭式解推导 + log比率差替代RM'解释。",pit:"只说'更简单'但说不出推导。"},

/* —— 代码与评测 —— */
{id:"r058",cat:"论文精读",q:"【Codex/MBPP】Chen et al. 2021 评估代码生成模型的方法是什么？",ans:"HumanEval 和 MBPP（Mostly Basic Python Problems）是两个代码生成基准。HumanEval：164 道 Python 题，给函数签名+文档字符串，模型生成函数体，用单元测试验证正确性。MBPP：974 道基础 Python 题。评估指标是 pass@k：生成 k 个候选代码，只要有一个通过所有测试就算正确。Codex（GPT-3 的代码微调版）在 HumanEval 上 pass@1=28.8%，pass@100=72.3%。意义：首次证明 LLM 可以生成可执行的代码，开启了'AI 编程'时代。后续的 CodeLlama、DeepSeek-Coder 等都是在这个基准上竞争。",tip:"用'pass@k + 单元测试验证 + HumanEval'解释。",pit:"只说'测试代码能不能跑'。"},

/* —— 综合理解补充 —— */
{id:"r059",cat:"论文精读",q:"【SimCLR】Chen et al. 2020 的对比学习框架是怎么做自监督视觉预训练的？",ans:"SimCLR 的流程：1）对每张图像做两次随机增强（裁剪+颜色扰动+翻转），得到同一图像的两个'视图'；2）用 CNN 编码两个视图得到特征向量；3）损失函数让同一图像的两个视图特征尽量接近（正样本），不同图像的特征尽量远离（负样本）。关键发现：数据增强的选择对效果影响巨大——颜色扰动是最关键的增强（因为要迫使模型学习语义特征而非颜色捷径）。后续的 BYOL、MoCo 等去掉了负样本对，进一步简化。这是自监督学习的经典范式，证明了不需要人工标注也能学到好的视觉表示。",tip:"用'数据增强构造正样本 + 对比损失'解释。",pit:"只说'自己学特征'但说不出对比学习机制。"},
{id:"r060",cat:"论文精读",q:"【MMLU】Hendrycks et al. 2020 的大规模多任务评测涵盖哪些领域？为什么重要？",ans:"MMLU（Massive Multitask Language Understanding）包含 57 个学科的 14000+ 道选择题，涵盖 STEM（数学、物理、计算机）、人文（历史、法律、哲学）、社会科学（经济、心理）等。题目来自考试（如 GRE、AP、医学执照考试）。重要性：1）首次大规模评测 LLM 的'世界知识'深度和广度；2）跨学科评估防止模型在特定领域过拟合；3）成为 LLM 能力的标准基准——GPT-4 在 MMLU 上 86.4%，接近人类专家水平。和你的关系：MMLU 的计算机科学子集可以测试 LLM 的 CS 基础知识，这也是你面试中可能被问到的领域。",tip:"用'57个学科 + 跨学科 + 标准基准'回答。",pit:"只说'一个测试'但说不出覆盖范围。"},
{id:"r061",cat:"论文精读",q:"【PaLM】Chowdhery et al. 2022 的 Pathways 系统解决了什么工程问题？",ans:"PaLM 540B 用了 6144 块 TPU v4 训练。Pathways 是 Google 的分布式训练系统，解决的核心问题：1）异构计算——不同节点的计算能力不同，Pathways 动态分配任务避免木桶效应；2）容错——6000+ 块 TPU 的故障率很高，Pathways 支持热迁移和检查点恢复；3）并行策略——结合了数据并行（每块 TPU 处理不同数据）和模型并行（同一模型分布在多块 TPU 上），用 Expert Parallelism 处理 MoE 层。效果：训练效率比传统数据并行提升 2-3 倍。PaLM 2（Gemini 的前身）在 Pathways 上训练了更大规模的模型。",tip:"用'异构计算+容错+混合并行'三个工程挑战回答。",pit:"只说'用很多TPU训练'。"},
{id:"r062",cat:"论文精读",q:"【DeepSeek-V3】2024 的技术报告有什么创新？和你读过的其他论文有什么联系？",ans:"DeepSeek-V3 的创新：1）Multi-head Latent Attention（MLA）——用低秩压缩 KV Cache，推理时显存大幅降低（和 LoRA 的低秩思想异曲同工）；2）DeepSeekMoE——更细粒度的专家划分（256 个路由专家 vs Switch Transformer 的 128 个），每个 token 激活更多但更小的专家；3）辅助 loss-free 的负载均衡策略。和你读过的论文的联系：MLA 对应 FlashAttention（效率优化）和 LoRA（低秩压缩）；MoE 对应 Switch Transformer（稀疏专家）；训练用了 Chinchilla 最优比。DeepSeek-R1（#62）在此基础上加入了强化学习推理训练，和你的 CoT/RLHF 论文直接相关。",tip:"用'MLA低秩压缩+DeepSeekMoE+loss-free均衡'回答。",pit:"只说'中国的大模型'但说不出技术细节。"},
{id:"r063",cat:"论文精读",q:"【DeepSeek-R1】2025 用 RL 训练推理能力的思路和 InstructGPT 有什么本质区别？",ans:"InstructGPT 的 RLHF 训练的是'遵循指令'的能力（让模型按人类期望的格式和风格回答），奖励信号来自人类偏好。DeepSeek-R1 的 RL 训练的是'推理'能力（让模型学会分步骤思考数学/编程问题），奖励信号来自正确性验证（答案对不对、代码能不能跑）。本质区别：1）奖励来源不同——人类偏好 vs 客观正确性；2）优化目标不同——风格对齐 vs 逻辑推理；3）R1 发现 RL 训练过程中模型会自发涌现 Chain-of-Thought（不需要手动加 CoT prompt），这证明了推理能力可以通过 RL 从基础模型中'激励'出来。这和 AlphaZero 的自我超越有相似之处——都不依赖人类示范，纯靠奖励信号学习。",tip:"用'风格对齐 vs 逻辑推理 + 自发涌现CoT'对比。",pit:"只说'都是 RL 训练'但说不出区别。"},

/* —— 补充覆盖剩余论文 —— */
{id:"r064",cat:"论文精读",q:"【DQN】Mnih et al. 2013 用深度强化学习玩 Atari 游戏，核心创新是什么？",ans:"DQN（Deep Q-Network）的核心创新：1）用 CNN 直接从游戏像素输入学习 Q 值函数（端到端学习状态→动作价值映射）；2）经验回放（Experience Replay）——把交互经验存入缓冲区，随机采样训练，打破数据相关性；3）目标网络（Target Network）——用固定参数的目标网络计算 Q 目标值，避免训练振荡。这三者结合让深度 RL 首次在多个 Atari 游戏上超越人类水平。经验回放和目标网络后来成为深度 RL 的标准技巧。这是深度学习和强化学习的首次重大结合，直接铺垫了 AlphaGo。",tip:"用'CNN端到端+经验回放+目标网络'三个创新。",pit:"只说'用神经网络玩游戏'。"},
{id:"r065",cat:"论文精读",q:"【GPT-1】Radford et al. 2018 的'Improving Language Understanding by Generative Pre-Training'做了什么？",ans:"GPT-1 的贡献：1）证明了'预训练+微调'范式——先在大规模无标注文本上用语言模型目标（预测下一个词）预训练 Transformer Decoder，再在下游任务上微调；2）用 Transformer Decoder（而非 Encoder）做预训练，保持了自回归生成能力；3）在 12 个 NLP 任务中的 9 个达到 SOTA。和 BERT 的区别：GPT-1 是单向的（从左到右），BERT 是双向的。GPT-1 的历史意义：确立了'生成式预训练'（Generative Pre-Training，GPT 名字的由来）的路线，后续 GPT-2/3/4 都沿这条路发展。",tip:"用'预训练+微调范式 + 单向Decoder + 12任务9个SOTA'回答。",pit:"只说'第一个 GPT'但说不出具体贡献。"},
{id:"r066",cat:"论文精读",q:"【MuZero】Schrittwieser et al. 2019 相比 AlphaZero 有什么突破？",ans:"AlphaZero 需要知道游戏规则（环境模型）才能做规划，MuZero 的突破是'不需要知道规则也能规划'。它学一个'世界模型'（World Model）来预测环境的动态：给定当前状态和动作，预测下一个状态和奖励。然后在这个学到的模型上做 MCTS 搜索。具体：1）Representation Network 把观测编码为隐藏状态；2）Dynamics Network 预测下一步隐藏状态和奖励；3）Prediction Network 预测策略和价值。在 Atari、围棋、国际象棋上都超越了 AlphaZero，因为它可以处理不完全知道规则的环境（如视频游戏）。这是'世界模型'方向的里程碑。",tip:"用'学到的世界模型替代已知规则'解释核心突破。",pit:"只说'比 AlphaZero 更强'但说不出区别。"},
{id:"r067",cat:"论文精读",q:"【NeRF】Mildenhall et al. 2020 用神经辐射场做视角合成，核心思想是什么？",ans:"NeRF 用 MLP 表示 3D 场景：输入 5D 坐标（x,y,z 位置 + 观察方向 θ,φ），输出该点的颜色和体积密度。渲染时：从相机出发射线，沿射线采样多个点，用 MLP 查询每个点的颜色和密度，用体积渲染公式积分得到最终像素颜色。训练：给定多张已知视角的照片，优化 MLP 参数使渲染结果与真实照片一致。效果：可以从任意新视角生成逼真的图像。和你的关系：NeRF 是 3D 视觉的里程碑，后来的 3D Gaussian Splatting 等方法都在此基础上发展。对多模态 AI（如你的锐鉴医学中如果需要 3D 可视化）可能有启发。",tip:"用'5D→颜色密度+体积渲染+多视角训练'解释。",pit:"只说'用神经网络做3D'但说不出渲染原理。"},
{id:"r068",cat:"论文精读",q:"【Latent Diffusion】Rombach et al. 2022（Stable Diffusion 基础）为什么要先用 VAE 压缩再做扩散？",ans:"直接在像素空间做扩散（如 DDPM）计算量巨大——256×256×3 的图像有 196608 维，每步去噪都要处理这么大的空间。Latent Diffusion 的解法：先用预训练的 VAE Encoder 把图像压缩到低维潜在空间（如 32×32×4=4096 维，压缩约 48 倍），然后在潜在空间做扩散。好处：1）计算量大幅降低（处理 4096 维 vs 196608 维）；2）VAE 已经学到了语义表示，扩散模型只需在这个表示上做精细调整；3）可以灵活控制生成过程（如用 CLIP 文本编码做条件生成）。这就是 Stable Diffusion 能在消费级 GPU 上运行的关键。",tip:"用'像素空间太大→潜在空间压缩48倍'解释。",pit:"只说'先压缩再生成'但说不出计算量对比。"},
{id:"r069",cat:"论文精读",q:"【GPT-4】OpenAI 2023 的技术报告公开了哪些信息？没公开哪些？",ans:"GPT-4 技术报告公开的：1）多模态（支持图像输入）；2）在多个基准上超越 GPT-3.5（MMLU 86.4%、HumanEval 67%等）；3）用了 RLHF 对齐；4）有'可预测的缩放'特性（可以用小模型预测大模型性能）。没公开的（也是争议最大的）：模型架构、参数量、训练数据、训练细节。这是 OpenAI 从'开放'转向'闭源'的标志。社区的反应：各种猜测（1.8T MoE 等），但都没有官方确认。对比 LLaMA 开源了所有细节，两种路线的分野从此开始。GPT-4 的评测方法（MMLU、HumanEval、BARS 等）成为了后续所有大模型的对比基准。",tip:"用'公开了什么+没公开什么+社区争议'回答。",pit:"只说'很强的模型'。"},
{id:"r070",cat:"论文精读",q:"【Deep RL from Human Preferences】Christiano et al. 2017 和 InstructGPT 的 RLHF 有什么关系？",ans:"这篇论文是 RLHF 的起源——首次提出用人类偏好来训练 RL 奖励模型，替代手工设计的奖励函数。具体：1）让 agent 执行任务，人类比较不同轨迹的偏好；2）用偏好数据训练 Reward Model；3）用 PPO 优化 agent 最大化奖励。InstructGPT（2022）把这个框架从游戏/机器人搬到了语言模型：把'轨迹比较'变成'回答比较'，把'游戏奖励'变成'回答质量评分'。技术路线完全一致：人类偏好→RM→RL。所以 InstructGPT 论文引用了这篇作为 RLHF 的技术基础。你的论文列表中 #51 和 #44 的关系就是源流关系。",tip:"用'RLHF起源：偏好→RM→RL三步'回答。",pit:"只说'都是 RLHF'但说不出谁是源头。"},
{id:"r071",cat:"论文精读",q:"【综合】你读的 62 篇论文中，哪些论文之间有直接的'传承'关系？请画出一条技术演进线。",ans:"一条清晰的演进线：Word2Vec（2013, 静态词向量）→ Seq2Seq（2014, 编码器-解码器）→ Bahdanau Attention（2014, 注意力机制）→ Transformer（2017, 纯注意力）→ GPT-1（2018, 生成式预训练）→ GPT-2（2019, 涌现能力）→ GPT-3（2020, Few-Shot）→ InstructGPT（2022, RLHF 对齐）→ DPO（2023, 直接偏好优化）→ DeepSeek-R1（2025, RL 推理训练）。这条线展示了从词嵌入到对齐大模型的完整技术路径，每一步都解决前一步的核心瓶颈。你的 DARE-RAG 站在这条线的末端——在对齐后的大模型基础上，用检索增强扩展其知识边界。",tip:"用一条清晰的传承链串联62篇中最关键的节点。",pit:"随便列几篇说不出关系。"},

/* ---------------- 项目深挖（基于真实代码的针对性面试题） ---------------- */
{id:"p001",cat:"项目深挖",q:"【锐鉴医学】模型用了两条并行卷积路径（kernel=1 和 kernel=2），为什么这样设计？kernel=1 的卷积实际在做什么？",ans:"model.py 中 group_w1 用 kernel=1 的 Conv1D 实际上不做局部跨碱基交互，而是对每个碱基位置独立做 1×1 卷积，作用等价于对 4 通道 one-hot 做线性组合（升维到 256），相当于一个逐点的全连接层。group_w2 用 kernel=2 才真正捕获相邻两个碱基的局部模式。两条路径并行让模型同时学到「单碱基特征」和「双碱基组合特征」，最后 Concatenate 合并，比单路径表达力更强。这是多尺度卷积的常见思路。",tip:"回答时用'逐点线性组合'和'局部模式'两个关键词对比两条路径。",pit:"只说'kernel=1 就是 1×1 卷积'但不解释它在生物学序列上的实际意义。"},
{id:"p002",cat:"项目深挖",q:"【锐鉴医学】你用了 LocallyConnected1D，它和 Conv1D 的本质区别是什么？为什么在这一步选择 LocallyConnected？",ans:"Conv1D 在所有位置共享同一组卷积核权重，LocallyConnected1D 则对每个位置维护独立的权重矩阵。在 crRNA 预测中，序列不同位置（如 PAM 区 vs spacer 区）的生物学意义完全不同，用 LocallyConnected 让每个位置有自己的变换参数，相当于给每个位置定制一个小型 MLP，比共享权重的 Conv1D 更灵活。代价是参数量增大，但这里输入经过 Pooling 后序列长度已经很短（约 20），参数量可控。",tip:"用'位置特异性'来解释生物学动机。",pit:"只说'参数更多所以更好'，没有从数据特性出发解释。"},
{id:"p003",cat:"项目深挖",q:"【锐鉴医学】每条路径都做了 MaxPool 和 AvgPool 然后 Concatenate，为什么不只用 MaxPool？拼接后特征维度是多少？",ans:"MaxPool 捕获最强激活（最显著的碱基模式），AvgPool 保留整体统计信息（平均响应水平）。两者拼接后既保留峰值信号又有全局概括，信息更丰富。以 group_w1 为例：Conv1D 输出 256 通道、MaxPool 和 AvgPool 各输出 256 通道，Concatenate 得到 512 通道；再经过 LocallyConnected1D(3) 输出 3 通道。两条路径的 LC 输出在 axis=1 拼接后进入 Flatten，最终输入全连接层。",tip:"用'峰值信号+全局统计'说明双池化的互补性。",pit:"只说'效果更好'说不出维度变化。"},
{id:"p004",cat:"项目深挖",q:"【锐鉴医学】Concatenate(axis=1) 把 merged_pool 与自身拼接，这相当于做了什么？",ans:"model.py:73 的 `Concatenate([merged_pool, merged_pool])` 实际上是把相同的特征复制了一份。这相当于对特征做了一次 Dropout-like 的冗余，或者说是为后续 Flatten 提供更多维度。更深层的意图可能是原论文设计了两个并行分支（group_w1 和 group_w2）各自做 merge，但代码里两条路径的 LC 输出维度相同，所以用了自身拼接来保持维度对称。实际效果等价于把特征维度翻倍。",tip:"诚实说'这可能是为了匹配原论文的维度设计'。",pit:"强行编造一个不存在的理由。"},
{id:"p005",cat:"项目深挖",q:"【锐鉴医学】你用 30min 和 20min 两个标签做数据增强，这和传统的旋转/裁剪增强有什么区别？",ans:"传统数据增强（旋转、翻转、加噪声）改变的是输入数据本身，标签不变。锐鉴医学的做法是同一条 crRNA 序列在两个不同时间点（30min 和 20min）测得的荧光强度不同，我把同一条序列用两个标签各训练一次，相当于告诉模型「同一输入在不同观测条件下有两个合理输出」。这本质上是多任务/多标签学习的思想，不是几何增强，而是利用了实验设计本身的冗余来增加训练信号。20min 的数据相当于对 30min 数据的正则化——模型要学到时间维度上的稳定性。",tip:"用'多任务学习'和'正则化'两个角度解释。",pit:"只说'数据翻倍了所以更好'。"},
{id:"p006",cat:"项目深挖",q:"【锐鉴医学】归一化公式中 1e-8 的作用？推理时怎么反归一化？",ans:"`(y - y_min) / (y_max - y_min + 1e-8)` 中的 1e-8 是防止分母为零的数值稳定项。如果所有标签值相同（y_max = y_min），分母为零会导致 NaN。加 1e-8 后结果变成极大值而非 NaN，虽然这种情况罕见但防御性编程很重要。推理时反归一化公式是 `y_pred_real = y_pred × (y_max - y_min) + y_min`，其中 y_min 和 y_max 需要持久化保存（我存到了 y_min_max.npy 文件中）。",tip:"提到'防御性编程'和 y_min_max.npy 的持久化。",pit:"只说'防止除零'但说不出推理时怎么用。"},
{id:"p007",cat:"项目深挖",q:"【锐鉴医学】EarlyStopping(patience=20) 配合 450 epochs，如果验证集 loss 在第 100 轮就不再下降，模型实际训练了多少轮？",ans:"EarlyStopping 会在验证集 loss 连续 20 轮不下降时停止训练。如果第 100 轮开始不下降，到第 120 轮触发停止，实际训练约 120 轮。关键是 EarlyStopping 默认配合 `ModelCheckpoint` 使用时保存的是最佳权重（best），而非最后一轮的权重。我的代码没有显式保存最佳权重，所以最终模型是停止时的权重，不是最佳权重。这是一个可以改进的地方——应该加 `save_best_only=True`。",tip:"主动指出'没有保存最佳权重'这个缺陷并说改进方案。",pit:"只说'120轮'不提权重保存问题。"},
{id:"p008",cat:"项目深挖",q:"【锐鉴医学】train_test_split(random_state=42) 是否会导致同一 crRNA 的 30min 和 20min 标签被分到训练集和测试集？这算数据泄漏吗？",ans:"会的。因为 X_aug 是 `[X, X]` 拼接，同一条序列出现两次但标签不同。随机划分时，同一条序列的 30min 版本可能进训练集、20min 版本进测试集，造成数据泄漏——模型间接「见过」测试集中的序列。正确做法是先按序列 ID 分组，保证同一序列的所有标签都在同一集合中。我在项目文档中意识到了这个问题（model.py:46 注释提到'保证target序列无重叠'），但代码实现上还没完全做到。这是面试时应该主动承认的改进点。",tip:"主动承认并提出改进方案（分组划分）。",pit:"说'没有数据泄漏'或者回避这个问题。"},
{id:"p009",cat:"项目深挖",q:"【锐鉴医学】下拉菜单中只有3个病毒，实际支持多少种？列表怎么确定的？",ans:"index.html 前端只硬编码了3个病毒作为演示。实际系统中，病毒列表来自 NCBI Taxonomy 数据库。ry-crispr-platform 的后端通过 API 从 NCBI 动态获取病毒分类单元列表，前端通过调用后端接口来填充下拉菜单。我做的独立前端（index.html）为了演示方便只放了3个，但后端的 sgrna_design.py 服务支持通过 FASTA 文件上传任意序列，不依赖预定义列表。",tip:"区分'演示版'和'完整版'的能力。",pit:"只说'就3个'。"},
{id:"p010",cat:"项目深挖",q:"【锐鉴医学】任务ID用 Math.random().toString(36) 生成，有什么安全隐患？",ans:"`Math.random()` 是伪随机数，可预测。生成的 ID 只有约 60 种可能的字符（36进制），10位长度的碰撞概率虽低但可被枚举。生产环境的改进方案：后端用 UUID v4（128位随机）或数据库自增 ID + 业务前缀。对于医疗系统这种涉及敏感数据的场景，ID 可预测意味着攻击者可以遍历查看他人任务结果，这是严重的隐私漏洞。",tip:"从'可预测→隐私泄露'角度解释严重性。",pit:"只说'不够随机'但不解释后果。"},
{id:"p011",cat:"项目深挖",q:"【锐鉴医学】前端用 localStorage 存任务列表，换浏览器就没了。多设备同步怎么设计？",ans:"localStorage 是浏览器本地存储，无跨设备能力。改为多设备同步的方案：后端新增任务表（SQLAlchemy ORM），每次提交任务写入数据库；前端每次加载时从后端 API 拉取当前用户的任务列表。认证可以用 JWT token。ry-crispr-platform 的后端已经有数据库和 API 框架，加一个任务管理接口工作量不大。实际考虑：如果只是单机演示，localStorage 够用；如果要多人协作或远程访问，必须走后端持久化。",tip:"根据场景分级回答'演示够用'和'生产需要后端'。",pit:"只说'用数据库替换'不分场景。"},

/* —— RAG 智能体实践（课程问答助手）—— */
{id:"p012",cat:"项目深挖",q:"【RAG智能体】分词器的分隔符列表按什么顺序排列？把空格放最前面会怎样？",ans:"rag.py:354 的分隔符 `['\\n## ', '\\n### ', '\\n', '。', '；', '，', ' ']` 按从大到小的粒度排列：先按 Markdown 标题切分章节，再按段落换行切分，最后按句子和空格切分。RecursiveCharacterTextSplitter 的逻辑是优先尝试列表前面的分隔符，切不满足 chunk_size 时才用后面的。如果把空格放最前面，所有文本会先按单词切，破坏句子和段落的语义完整性，导致检索时上下文碎片化，回答质量大幅下降。",tip:"用'从大粒度到小粒度'的递进逻辑解释。",pit:"只说'不能乱放'但说不出递归切分的机制。"},
{id:"p013",cat:"项目深挖",q:"【RAG智能体】为什么取 k×4 的结果再手动截断，而不是直接 k=wanted？",ans:"FAISS 返回的是近似最近邻（ANN），不是精确最近邻。多取 4 倍再过滤有两个原因：一是后续有 source/chapter 的元数据过滤（rag.py:380-383），过滤后可能不足 wanted 条；二是可以对结果做二次排序或质量检查。比如我需要按 source 筛选某份资料，FAISS 不知道这个条件，只能先多取再在 Python 层过滤。`max(wanted*4, 12)` 保证至少取 12 条，避免 wanted=1 时只取 1 条没有筛选余地。",tip:"用'元数据过滤'和'近似搜索的不确定性'两个理由。",pit:"只说'多取更准'说不出具体原因。"},
{id:"p014",cat:"项目深挖",q:"【RAG智能体】L2 距离转余弦相似度的公式 1.0 - d²/2.0 是怎么推导的？normalize_L2 起什么作用？",ans:"当向量被 L2 归一化（`normalize_L2=True`）后，‖a‖=‖b‖=1。余弦相似度 `cos(a,b) = a·b`，而 L2 距离平方 `d² = ‖a-b‖² = ‖a‖² + ‖b‖² - 2a·b = 2 - 2·cos(a,b)`，所以 `cos(a,b) = 1 - d²/2`。代码中 `score = 1.0 - raw_score / 2.0` 正是这个公式。`normalize_L2=True` 确保所有向量先归一化到单位球面上，这样 L2 距离和余弦相似度就有一一对应关系。如果不归一化，L2 距离受向量模长影响，不能直接反映方向相似性。",tip:"手推一遍 ‖a-b‖² 的展开式，这是面试加分项。",pit:"只说'这是标准做法'但推不出公式。"},
{id:"p015",cat:"项目深挖",q:"【RAG智能体】faiss.write_index 在 Windows Unicode 路径上报错，你怎么发现的？调试过程？",ans:"我在中文路径（如 D:\\HuaweiMoveData\\用户\\...）下运行时，faiss.write_index 抛出 OSError。查了 faiss 的 GitHub issues，发现是 faiss 的 C++ 底层用了 `fopen` 而不是 `_wfopen`，不支持 Windows 宽字符路径。解决方案是先用 `faiss.serialize_index(index).tobytes()` 把索引序列化为 numpy 数组，再用 pathlib 的 `write_bytes()` 写文件——pathlib 底层用的是宽字符 API，能正确处理中文路径。加载时反向操作：`np.frombuffer` + `faiss.deserialize_index`。这个坑花了我大半天，但学到序列化/反序列化是跨平台文件 IO 的通用解法。",tip:"用'发现问题→查原因→找替代方案'的叙事结构。",pit:"只说'Windows 不支持中文路径'但说不出解决过程。"},
{id:"p016",cat:"项目深挖",q:"【RAG智能体】引用验证机制能挡住 LLM 编造的引用吗？有什么漏洞？",ans:"agent.py:138-153 的 `_ensure_citations` 会逐字检查 quote 是否出现在检索到的片段原文中。这能挡住大部分编造——如果 LLM 凭空写了一段话，原文中找不到就直接丢弃。但有两个漏洞：一是「拼接型编造」——LLM 把两个不同片段的句子拼在一起，每个子句都在原文中，但拼接后的含义歪曲了原文；二是「同义改写」——LLM 换了几个词但意思相同，逐字匹配就匹配不上。改进方向是用语义相似度（如 embedding 余弦）做引用验证，而不只是字符串精确匹配。",tip:"主动分析漏洞并提出改进方案。",pit:"只说'能挡住'或'挡不住'没有分析。"},
{id:"p017",cat:"项目深挖",q:"【RAG智能体】字符级交集判断答案是否被上下文支持，有什么缺陷？",ans:"agent.py:178-207 用 `answer_chars & context_chars` 做中文字符交集。核心缺陷是：1）无法区分「人工」和「人工智能」——共享「人」「工」但语义不同；2）高频字（如「的」「是」「在」）几乎总是匹配，导致即使答案完全是编造的，只要用了一些常见字就能通过检查；3）代码用了 stop_chars 过滤高频字（line 183-188），但过滤列表不完整。更好的方案是用 n-gram 匹配（如 2-gram/3-gram）或关键词 TF-IDF 匹配，而不是单字符匹配。",tip:"用具体例子（人工 vs 人工智能）说明缺陷。",pit:"只说'可能不准'举不出具体反例。"},
{id:"p018",cat:"项目深挖",q:"【RAG智能体】当 found=True 但 citations=[] 时直接降级为未找到，为什么？",ans:"这是一个保守设计决策。agent.py:258-261 的逻辑是：如果 LLM 说'找到了答案'但拿不出任何引用支撑，说明答案很可能是幻觉（hallucination）。与其冒险输出一个没有来源的答案给学生，不如直接告诉用户'未找到'。权衡在于：可能漏掉一些确实存在但引用格式不对的答案（false negative），但避免了输出错误知识（false positive）。对于教育场景（学生复习），宁可少答不可错答。代码在 line 252-255 有一个 fallback 机制：如果 found=True 且答案被上下文支持，会尝试用最相关片段做 fallback 引用，只有 fallback 也失败才降级。",tip:"用'宁可少答不可错答'的教育场景逻辑解释。",pit:"只说'为了安全'但说不出权衡。"},
{id:"p019",cat:"项目深挖",q:"【RAG智能体】为什么用 RunnableBranch 三路分发而不做意图识别？",ans:"agent.py:63-73 用 RunnableBranch 做硬编码的三路分发，而不是让 LLM 自己判断走哪个分支。原因：1）可靠性——意图识别本身可能出错，如果 LLM 把问答请求误判为出题，用户体验灾难性；2）确定性——outline/quiz/answer 三个模式的 prompt 结构完全不同，硬编码分发比 LLM 自主路由更可控；3）成本——意图识别多一次 LLM 调用，增加延迟和费用。缺点是不够灵活，新增模式需要改代码。权衡：生产系统用硬分发保可靠，研究系统可以试意图识别。",tip:"用'可靠性 > 灵活性'的工程权衡解释。",pit:"只说'硬编码更简单'。"},
{id:"p020",cat:"项目深挖",q:"【RAG智能体】JSON 解析失败时再调 LLM 修复格式，能保证不添加事实吗？",ans:"不能完全保证。agent.py:118-135 的修复 prompt 说'只修复格式，不添加事实'，但 LLM 没有强制机制保证它不修改内容。实际上 LLM 在修复 JSON 时可能会：1）补全缺失字段用默认值（这些默认值可能引入错误事实）；2）重新组织内容导致语义变化；3）修复失败后抛出异常。代码的改进方向是：用 Pydantic 的 `model_validate_json(strict=True)` 做严格校验，或者用 JSON Schema 约束输出格式，让结构化输出从模型端保证（如 OpenAI 的 function calling）。当前的修复 prompt 只是一个 fallback，最终如果还是失败就抛 ValueError。",tip:"诚实承认'不能保证'并提出 function calling 方案。",pit:"说'能保证'或完全回避问题。"},

/* —— 手撕神经网络 —— */
{id:"p021",cat:"项目深挖",q:"【手撕NN】单层感知机无法表示 XOR，多层组合怎么解决？请画出计算图。",ans:"XOR 可以分解为：XOR(x1,x2) = AND(OR(x1,x2), NAND(x1,x2))。计算图有两层：第一层并行计算 OR(x1,x2) 和 NAND(x1,x2)，得到两个中间值 s1 和 s2；第二层计算 AND(s1,s2) 得到最终输出。例如输入 (0,1)：OR→1, NAND→1, AND→1，正确输出 1。输入 (0,0)：OR→0, NAND→1, AND→0。输入 (1,1)：OR→1, NAND→0, AND→0。这证明了多层感知机的表达力远超单层——这也是 Minsky 批判感知机后，Hinton 等人坚持多层网络研究的理论基础。",tip:"用具体输入输出验证 XOR 分解的正确性。",pit:"只说'用两层'但画不出具体结构。"},
{id:"p022",cat:"项目深挖",q:"【手撕NN】感知机的参数是手动调的，自动学习需要什么算法？写出更新规则。",ans:"需要用梯度下降（Gradient Descent）+ 反向传播自动学习。更新规则：对权重 w_i，`w_i = w_i - η × ∂L/∂w_i`，其中 η 是学习率，L 是损失函数（如均方误差）。以 AND 门为例，损失 L = (y_pred - y_true)²，∂L/∂w_i = 2(y_pred - y_true) × x_i（链式法则）。训练时遍历所有输入组合，计算梯度，更新权重，直到损失收敛。这就是 ch4（训练神经网络）和 ch5（反向传播）的核心内容——从手动调参到自动学习的关键跃迁。",tip:"写出具体的梯度更新公式并用 AND 门做例子。",pit:"只说'梯度下降'但写不出公式。"},
{id:"p023",cat:"项目深挖",q:"【手撕NN】用计算图解释反向传播，请手推一个具体例子。",ans:"以 y = (x1+x2) × (x1×w1) 为例。正向传播：s = x1+x2, t = x1×w1, y = s×t。反向传播从 y=1 开始（假设 ∂y/∂y=1）：∂y/∂t = s, ∂y/∂s = t。然后继续往回传：∂y/∂x1 = ∂y/∂s × ∂s/∂x1 + ∂y/∂t × ∂t/∂x1 = t×1 + s×w1（注意 x1 同时出现在两条路径，需要求和）。∂y/∂w1 = ∂y/∂t × ∂t/∂x1 = s×x1。这就是链式法则的核心：每个节点只关心自己的局部梯度，乘以上游传来的梯度就得到全局梯度。计算图的优势是把复杂的全局求导分解为简单的局部乘法。",tip:"用手算过程体现链式法则的分解思想。",pit:"只背概念但不会具体计算。"},
{id:"p024",cat:"项目深挖",q:"【手撕NN】链式法则和动态规划有什么相似之处？",ans:"两者的核心都是「子问题分解 + 结果复用」。链式法则把复合函数 f(g(h(x))) 的求导分解为 f'·g'·h' 的连乘，每个局部导数只依赖当前节点的输入输出。动态规划把复杂问题分解为重叠子问题，每个子问题只计算一次并存储。相似点：1）都是从局部推全局；2）都避免重复计算（反向传播复用正向传播的中间值，DP 用 memoization）；3）都可以用 DAG（有向无环图）表示计算过程。区别在于链式法则沿 DAG 反向遍历求导，DP 通常正向或自底向上求最优值。",tip:"用'子问题分解 + 结果复用'概括共同点。",pit:"说'两者没太大关系'。"},
{id:"p025",cat:"项目深挖",q:"【手撕NN】卷积层怎么保留空间信息？解释感受野概念。",ans:"全连接层把 28×28 图像展平为 784 维向量，丢失了像素之间的空间关系（相邻像素 vs 远距离像素）。卷积层用一个小的卷积核（如 3×3）在图像上滑动，每个输出神经元只连接输入的一个局部区域（3×3=9 个像素），保留了空间局部性。感受野（receptive field）是指输出特征图上一个神经元对应输入图像的区域大小。例如 3 层 3×3 卷积堆叠后，每个输出神经元的感受野是 7×7。深层网络的感受野越来越大，能捕获更大范围的语义信息。这是 CNN 在图像任务上优于全连接网络的根本原因。",tip:"用具体数字（3层3×3→7×7）说明感受野计算。",pit:"只说'保留形状'说不出感受野。"},
{id:"p026",cat:"项目深挖",q:"【手撕NN】Pool 层的作用？为什么卷积后常接 Pooling 而不是堆更多卷积？",ans:"Pooling 有三个作用：1）降维——减少特征图尺寸，降低计算量和参数量；2）平移不变性——MaxPool 让特征对小范围平移不敏感（物体偏移几个像素仍能识别）；3）扩大感受野——Pooling 后再接卷积，等效于用更大的窗口看原图。为什么不一直堆卷积：纯卷积堆叠参数量大、容易过拟合，且感受野增长慢（线性）。Pooling 一步就能把尺寸减半，感受野翻倍。但过度 Pooling 会丢失细节信息，所以现代网络（如 ResNet）倾向用 stride=2 的卷积替代 Pooling。",tip:"用三个作用（降维/平移不变/扩感受野）结构化回答。",pit:"只说'缩小尺寸'。"},

/* —— 企业出海舆情风险管理系统 —— */
{id:"p027",cat:"项目深挖",q:"【舆情系统】LangGraph 10个节点分别是什么？为什么不做动态节点数量？",ans:"README 描述的 10 节点流程大致是：输入接收→数据清洗→去重→语言识别→RAG 检索→LLM 分析→风险评分→规则校准→预警判断→结果存储。固定 10 节点而非动态调整的原因：1）业务流程是确定的——每条舆情都需要经过完整的分析链路，不存在'简单输入跳过某些步骤'的场景；2）可调试性——固定流程容易定位问题（哪个节点输出异常一目了然）；3）LangGraph 的状态机语义适合固定流程，动态分支用条件边（conditional edge）实现更合适。如果要做动态，可以用 LangGraph 的 `Send` API 或改用循环图结构。",tip:"用'业务确定性+可调试性'解释固定流程的设计。",pit:"只说'固定更简单'。"},
{id:"p028",cat:"项目深挖",q:"【舆情系统】Chroma 和 FAISS 的区别？为什么舆情系统选 Chroma、课程助手选 FAISS？",ans:"FAISS 是 Facebook 开源的纯向量检索库，专注 ANN 搜索，性能极高，但不管理元数据和文档。Chroma 在 FAISS 之上加了文档存储、元数据过滤、持久化等上层功能，是完整的向量数据库。选择原因：舆情系统需要按风险等级、时间范围等维度过滤结果，Chroma 的元数据过滤更方便；课程助手需要精细控制索引构建和序列化（如自定义持久化格式），FAISS 更底层更灵活。本质上是'应用层便利性 vs 底层控制力'的权衡。",tip:"用'元数据过滤需求'和'底层控制需求'对比两者。",pit:"只说'Chroma 更高级'。"},
{id:"p029",cat:"项目深挖",q:"【舆情系统】Mock LLM 模式的实现逻辑？回答有意义还是随机的？",ans:"Mock LLM 不调用真实 API，而是根据输入关键词返回预设的模板回答。例如输入包含'风险'就返回高风险模板，包含'正面'就返回低风险模板。回答有意义——它基于规则生成结构化输出（JSON 格式、五维评分、处置建议），不是随机字符串。目的是让系统在没有 API Key 的情况下能完整演示全流程（从输入到可视化），方便答辩和展示。切换到真实 DeepSeek 只需改 .env 一行配置。",tip:"说明 Mock 模式的'规则驱动'本质和演示价值。",pit:"说'就是假数据'。"},
{id:"p030",cat:"项目深挖",q:"【舆情系统】SHA-256 去重只能精确匹配，99% 相同的文本怎么办？",ans:"SHA-256 是密码学哈希，任何微小变化（哪怕改一个标点）都会产生完全不同的哈希值。改进方案：1）MinHash + LSH（Locality-Sensitive Hashing）——把文本转为 n-gram 集合，用 MinHash 估计 Jaccard 相似度，相似文本大概率映射到相同桶中；2）SimHash——把文本映射为固定长度的位串，汉距离反映语义相似度；3）embedding 相似度——用模型把文本编码为向量，余弦相似度超过阈值就视为重复。生产环境中通常组合使用：SHA-256 去除完全相同的文本，SimHash/MinHash 去除近似重复。",tip:"用三种方案（MinHash/SimHash/embedding）分层回答。",pit:"只说'哈希不能处理相似文本'。"},
{id:"p031",cat:"项目深挖",q:"【舆情系统】五维风险评分是什么？某个维度极高但其他很低怎么处理？",ans:"五个维度大致是：情感负面程度、涉及人物级别（如政府/企业高管）、传播范围（媒体/社交平台数量）、敏感主题（政治/经济/安全）、历史事件关联度。每条维度独立打分后加权求和。强制升级规则是：即使总分不高，只要某一维度超过阈值（如涉及国家领导人），就强制标记为高风险并触发预警。这是'一票否决'机制——某些风险维度的严重性不能被其他维度的低分稀释。代码中用 if-else 规则实现，不完全依赖 LLM 判断。",tip:"用'加权求和 + 一票否决'两层机制解释。",pit:"只说'五个维度加起来'。"},
{id:"p032",cat:"项目深挖",q:"【舆情系统】SQLite 并发100个分析请求会出什么问题？怎么迁移？",ans:"SQLite 是文件级锁，写操作时整个数据库文件被锁定，并发写入会排队等待甚至报错。100 个并发分析请求同时写入结果会严重阻塞。迁移方案：换 PostgreSQL——支持行级锁和 MVCC（多版本并发控制），真正支持并发读写。代码改动：1）改 DATABASE_URL 连接串；2）SQLAlchemy 的 ORM 层基本不用改（已做了方言抽象）；3）需要处理的差异：SQLite 的 AUTOINCREMENT vs PostgreSQL 的 SERIAL，以及 JSON 函数语法差异。FastAPI + SQLAlchemy 的架构让数据库迁移成本很低。",tip:"用'文件级锁 vs 行级锁/MVCC'解释核心差异。",pit:"只说'SQLite 不支持并发'。"},
{id:"p033",cat:"项目深挖",q:"【舆情系统】Pinia 和 Vuex 的核心区别？你选 Pinia 的理由？",ans:"Vuex 是 Vue 2 时代的官方状态管理，用 mutation（同步）+ action（异步）的模式修改状态，概念较重。Pinia 是 Vue 3 推荐的新一代状态管理：1）去掉了 mutation，直接在 action 中修改 state，代码更简洁；2）完整支持 TypeScript 类型推断；3）支持 composition API 风格的 store 定义；4）体积更小（约 1KB）。我选 Pinia 是因为项目用 Vue 3 + TypeScript，Pinia 的类型安全和简洁 API 与技术栈更匹配。实际代码中 stores/ 目录下的 store 定义比传统 Vuex 写法少约 40% 的模板代码。",tip:"用'去掉 mutation + TS 类型推断'两个核心差异解释。",pit:"只说'Pinia 是新版 Vuex'。"},

/* —— 通用追问 —— */
{id:"p034",cat:"项目深挖",q:"这四个项目里哪个独立完成度最高？哪些参考了教程？",ans:"独立完成度最高的是锐鉴医学——从论文理解、模型复现（model.py）、数据处理（Table S2 清洗+增强）、到前端页面（index.html + Tailwind）都是我做的，只有模型架构参考了原论文 CNN12ae 的设计。RAG 智能体实践是在课程实训框架基础上，我独立写了 RAG 检索（rag.py 436行）、引用验证（agent.py 的 _ensure_citations）、多模式路由（RunnableBranch）。手撕神经网络参考了《深度学习入门：基于Python的理论与实现》一书的代码框架，但我自己实现了反向传播和 CNN 的核心部分。企业出海舆情系统用了 LangChain/LangGraph 的官方模板做脚手架，核心业务逻辑（风险评分、预警规则、RAG 检索）是我自己写的。",tip:"诚实分层说明参考和原创部分。",pit:"说'全是自己写的'或'全是参考的'。"},
{id:"p035",cat:"项目深挖",q:"如果重新设计其中一个项目，你会改变什么架构决策？",ans:"我会重新设计 RAG 智能体的引用验证机制。当前的字符级交集（agent.py:178-207）太粗糙，改为：1）用 n-gram（2-gram/3-gram）匹配替代单字符匹配，解决'人工'vs'人工智能'的问题；2）对 LLM 输出的每个句子单独验证，而不是整段判断；3）引入 embedding 语义相似度做二次校验。另外，rag.py 的 FAISS 索引用 pickle 序列化不够安全（pickle 可执行任意代码），生产环境应改为 JSON + faiss.save_index。",tip:"选一个具体问题深入讲改进方案。",pit:"说'全部推倒重来'。"},
{id:"p036",cat:"项目深挖",q:"做这些项目时遇到的最棘手的 bug 是什么？怎么解决的？",ans:"最棘手的是 rag.py 的 Windows Unicode 路径问题。faiss.write_index 在中文路径下报 OSError，但报错信息不明确（只说'无法打开文件'）。我花了大半天排查：1）先怀疑权限问题，改了各种目录都不行；2）用英文路径测试发现正常，确认是编码问题；3）查 faiss GitHub issues 找到根因（C++ 底层用 fopen 不支持宽字符）；4）最终用 faiss.serialize_index + pathlib.write_bytes 绕过。学到的教训：跨平台开发时，文件路径要尽早用 pathlib 处理，不要依赖 C 底层库的 IO 能力。",tip:"用'排查过程'叙事，体现工程素养。",pit:"说'遇到很多bug但都解决了'没有细节。"},
{id:"p037",cat:"项目深挖",q:"DARE-RAG 和 RAG 智能体实践都做 RAG，两者有什么区别？能合并吗？",ans:"两者虽然都做 RAG，但定位不同：DARE-RAG 是研究项目，核心贡献是难度感知的自适应检索——通过探针特征和门控机制判断查询是否需要扩展检索，是 RAG 的「优化方法」。RAG 智能体是应用项目，核心是把课程资料做成可问答、可出题、可生成提纲的教学助手，是 RAG 的「应用系统」。能合并的部分：检索引擎（都用向量相似度）、prompt 工程。不能直接合并的部分：DARE-RAG 的探针检索需要额外的特征提取模块，而课程助手是固定 top-k 检索。如果要合并，可以在课程助手中加一个'难度感知'模式——对复杂问题自动扩展检索，简单问题直接回答。",tip:"用'方法 vs 应用'的框架对比两个项目。",pit:"说'都是 RAG 所以差不多'。"}]

const SEED_QUESTIONS_EN = [
  {
    "id": "en-1",
    "cat": "英文",
    "q": "Could you please introduce your hometown?",
    "ans": "My hometown is a city with a rich culture and rapid technological development. Growing up there, I became interested in how software can solve everyday problems, which led me to choose computer science.",
    "tip": "",
    "pit": "",
    "extra": "",
    "status": "未标记",
    "nextReview": "",
    "reviewStage": 0
  },
  {
    "id": "en-2",
    "cat": "英文",
    "q": "Can you introduce your undergraduate university?",
    "ans": "I studied at Tianjin University of Science and Technology, where the AI program offered a solid balance of theory and practice. Courses such as machine learning, data structures, and operating systems laid a strong foundation for my research in retrieval-augmented generation.",
    "tip": "",
    "pit": "",
    "extra": "",
    "status": "未标记",
    "nextReview": "",
    "reviewStage": 0
  },
  {
    "id": "en-3",
    "cat": "英文",
    "q": "What are your strengths and weaknesses?",
    "ans": "My strengths are careful debugging, patient experiment design, and good teamwork. My weakness is that I sometimes focus too much on small details, which may slow overall progress. I'm learning to manage time and priorities to improve efficiency.",
    "tip": "",
    "pit": "",
    "extra": "",
    "status": "未标记",
    "nextReview": "",
    "reviewStage": 0
  },
  {
    "id": "en-4",
    "cat": "英文",
    "q": "Why did you choose computer science as your major?",
    "ans": "I chose computer science because it combines logical thinking with creativity. I enjoy the moment when an abstract algorithm becomes a working, efficient program, and I want to build systems that genuinely help people.",
    "tip": "",
    "pit": "",
    "extra": "",
    "status": "未标记",
    "nextReview": "",
    "reviewStage": 0
  },
  {
    "id": "en-5",
    "cat": "英文",
    "q": "What is your favorite programming language and why?",
    "ans": "My favorite language is C/C++ because it gives me fine-grained control over memory and performance, which is essential for systems programming. I also use Python for prototyping and data analysis.",
    "tip": "",
    "pit": "",
    "extra": "",
    "status": "未标记",
    "nextReview": "",
    "reviewStage": 0
  },
  {
    "id": "en-6",
    "cat": "英文",
    "q": "How do you keep up with new technologies?",
    "ans": "I read papers from top conferences, follow well-known open-source projects, and reproduce interesting work in my free time. I also write technical blogs to consolidate what I learn.",
    "tip": "",
    "pit": "",
    "extra": "",
    "status": "未标记",
    "nextReview": "",
    "reviewStage": 0
  },
  {
    "id": "en-7",
    "cat": "英文",
    "q": "Do you prefer working independently or in a team?",
    "ans": "Both, depending on the task. I can drive a task independently from design to completion, but I also enjoy teamwork. In team projects, I make sure to communicate clearly and help teammates when they are blocked.",
    "tip": "",
    "pit": "",
    "extra": "",
    "status": "未标记",
    "nextReview": "",
    "reviewStage": 0
  },
  {
    "id": "en-8",
    "cat": "英文",
    "q": "What do you think is the biggest challenge in computer science today?",
    "ans": "I think scaling AI and systems while keeping them reliable, efficient, and trustworthy is a major challenge. Bridging the gap between research prototypes and robust production systems is both difficult and important.",
    "tip": "",
    "pit": "",
    "extra": "",
    "status": "未标记",
    "nextReview": "",
    "reviewStage": 0
  },
  {
    "id": "en-9",
    "cat": "英文",
    "q": "Tell me about a time you failed and what you learned.",
    "ans": "Once a project I led almost missed its deadline because I underestimated integration effort. I learned to break tasks into smaller milestones and review progress weekly, which has made my later projects much more reliable.",
    "tip": "",
    "pit": "",
    "extra": "",
    "status": "未标记",
    "nextReview": "",
    "reviewStage": 0
  },
  {
    "id": "en-10",
    "cat": "英文",
    "q": "What kind of supervisor and research environment are you looking for?",
    "ans": "I'm looking for a supervisor who values both rigor and creativity, and a group with active discussions and open communication. I believe regular feedback and a supportive environment help me grow fastest.",
    "tip": "",
    "pit": "",
    "extra": "",
    "status": "未标记",
    "nextReview": "",
    "reviewStage": 0
  },
  {
    "id": "en-11",
    "cat": "英文",
    "q": "Do you have any experience contributing to open source?",
    "ans": "Yes. I've submitted bug fixes and small features to open-source projects, and maintained my own repositories. This taught me code review conventions, documentation, and how to collaborate asynchronously with others.",
    "tip": "",
    "pit": "",
    "extra": "",
    "status": "未标记",
    "nextReview": "",
    "reviewStage": 0
  },
  {
    "id": "en-12",
    "cat": "英文",
    "q": "How do you handle pressure and deadlines?",
    "ans": "I prioritize tasks, split large work into milestones, and keep a clear schedule. When pressure rises, I communicate early with teammates and adjust the plan instead of hiding problems.",
    "tip": "",
    "pit": "",
    "extra": "",
    "status": "未标记",
    "nextReview": "",
    "reviewStage": 0
  },
  {
    "id": "en-13",
    "cat": "英文",
    "q": "What do you think makes a good research paper?",
    "ans": "A good paper clearly identifies a real problem, proposes a novel and convincing solution, and validates it with rigorous experiments. Reproducibility and clarity of presentation are also essential.",
    "tip": "",
    "pit": "",
    "extra": "",
    "status": "未标记",
    "nextReview": "",
    "reviewStage": 0
  },
  {
    "id": "en-14",
    "cat": "英文",
    "q": "Why should we accept you into this program?",
    "ans": "I bring solid fundamentals, hands-on project experience, and a strong willingness to learn. My background in systems and algorithms matches the group's direction, and I'm ready to contribute from day one.",
    "tip": "",
    "pit": "",
    "extra": "",
    "status": "未标记",
    "nextReview": "",
    "reviewStage": 0
  },
  {
    "id": "en-15",
    "cat": "英文",
    "q": "What are your expectations for the master's program?",
    "ans": "I expect to build rigorous research training, publish quality papers, and improve my academic writing. I also hope to contribute to the group's open-source tools and grow into an independent researcher.",
    "tip": "",
    "pit": "",
    "extra": "",
    "status": "未标记",
    "nextReview": "",
    "reviewStage": 0
  }
];

/* ---------------- 词汇翻译（计算机专业英文术语 → 中文） ---------------- */
const SEED_QUESTIONS_VOCAB = [
  {"id":"voc-cs-1","cat":"词汇翻译","q":"英译汉：Time Complexity","ans":"时间复杂度","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-2","cat":"词汇翻译","q":"英译汉：Data Structure","ans":"数据结构","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-3","cat":"词汇翻译","q":"英译汉：Divide and Conquer","ans":"分治法","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-4","cat":"词汇翻译","q":"英译汉：Dynamic Programming","ans":"动态规划","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-5","cat":"词汇翻译","q":"英译汉：Greedy Algorithm","ans":"贪心算法","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-6","cat":"词汇翻译","q":"英译汉：Hash Table","ans":"哈希表（散列表）","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-7","cat":"词汇翻译","q":"英译汉：Linked List","ans":"链表","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-8","cat":"词汇翻译","q":"英译汉：Binary Search Tree","ans":"二叉搜索树","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-9","cat":"词汇翻译","q":"英译汉：Red-Black Tree","ans":"红黑树","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-10","cat":"词汇翻译","q":"英译汉：B+ Tree","ans":"B+树","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-11","cat":"词汇翻译","q":"英译汉：Priority Queue","ans":"优先队列","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-12","cat":"词汇翻译","q":"英译汉：Breadth-First Search","ans":"广度优先搜索","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-13","cat":"词汇翻译","q":"英译汉：Shortest Path","ans":"最短路径","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-14","cat":"词汇翻译","q":"英译汉：Minimum Spanning Tree","ans":"最小生成树","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-15","cat":"词汇翻译","q":"英译汉：Binary Search","ans":"二分查找","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-16","cat":"词汇翻译","q":"英译汉：Operating System","ans":"操作系统","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-17","cat":"词汇翻译","q":"英译汉：Process","ans":"进程","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-18","cat":"词汇翻译","q":"英译汉：Thread","ans":"线程","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-19","cat":"词汇翻译","q":"英译汉：Deadlock","ans":"死锁","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-20","cat":"词汇翻译","q":"英译汉：Semaphore","ans":"信号量","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-21","cat":"词汇翻译","q":"英译汉：Mutex","ans":"互斥锁","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-22","cat":"词汇翻译","q":"英译汉：Race Condition","ans":"竞态条件","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-23","cat":"词汇翻译","q":"英译汉：Virtual Memory","ans":"虚拟内存","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-24","cat":"词汇翻译","q":"英译汉：Paging","ans":"分页","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-25","cat":"词汇翻译","q":"英译汉：Page Replacement","ans":"页面置换","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-26","cat":"词汇翻译","q":"英译汉：System Call","ans":"系统调用","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-27","cat":"词汇翻译","q":"英译汉：Context Switch","ans":"上下文切换","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-28","cat":"词汇翻译","q":"英译汉：Cache","ans":"高速缓存","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-29","cat":"词汇翻译","q":"英译汉：Transmission Control Protocol","ans":"传输控制协议（TCP）","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-30","cat":"词汇翻译","q":"英译汉：User Datagram Protocol","ans":"用户数据报协议（UDP）","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-31","cat":"词汇翻译","q":"英译汉：Three-Way Handshake","ans":"三次握手","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-32","cat":"词汇翻译","q":"英译汉：Congestion Control","ans":"拥塞控制","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-33","cat":"词汇翻译","q":"英译汉：Sliding Window","ans":"滑动窗口","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-34","cat":"词汇翻译","q":"英译汉：Domain Name System","ans":"域名系统（DNS）","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-35","cat":"词汇翻译","q":"英译汉：Hypertext Transfer Protocol","ans":"超文本传输协议（HTTP）","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-36","cat":"词汇翻译","q":"英译汉：Load Balancing","ans":"负载均衡","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-37","cat":"词汇翻译","q":"英译汉：Microservices","ans":"微服务","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-38","cat":"词汇翻译","q":"英译汉：Distributed System","ans":"分布式系统","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-39","cat":"词汇翻译","q":"英译汉：Transaction","ans":"事务","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-40","cat":"词汇翻译","q":"英译汉：Serializability","ans":"可串行化","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-41","cat":"词汇翻译","q":"英译汉：Compiler","ans":"编译器","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-42","cat":"词汇翻译","q":"英译汉：Abstract Syntax Tree","ans":"抽象语法树","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-43","cat":"词汇翻译","q":"英译汉：Machine Learning","ans":"机器学习","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-44","cat":"词汇翻译","q":"英译汉：Neural Network","ans":"神经网络","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-45","cat":"词汇翻译","q":"英译汉：Deep Learning","ans":"深度学习","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-46","cat":"词汇翻译","q":"英译汉：Gradient Descent","ans":"梯度下降","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-47","cat":"词汇翻译","q":"英译汉：Overfitting","ans":"过拟合","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-48","cat":"词汇翻译","q":"英译汉：Regularization","ans":"正则化","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-49","cat":"词汇翻译","q":"英译汉：Transformer","ans":"Transformer（变换器）","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0},
  {"id":"voc-cs-50","cat":"词汇翻译","q":"英译汉：Attention Mechanism","ans":"注意力机制","tip":"","pit":"","extra":"","status":"未标记","nextReview":"","reviewStage":0}
];

/* —— 关键词提醒（题库A/重点复习的「关键词」默认显示）—— */
const KEY_ANSWERS = {
"q001": "结构：个人简介+教育背景+科研经历+专业契合度。控制在2分钟，突出与报考方向相关的课程/项目/科研，体现代码功底与团队协作。",
"q002": "单位优势+平台资源+个人发展契合。提前了解目标院校的特色方向、重点实验室与导师论文，结合兴趣表达真诚向往。",
"q003": "知识迁移+技能互补+兴趣衔接。例如数据结构/编程能力可直接迁移到系统与算法方向；跨方向者强调已补的课程。",
"q004": "学科定义+核心子领域+理论-系统-应用闭环+个人视角。",
"q005": "初步意向+选择理由+阶段性计划。分阶段：研一补基础/熟工具，研二定题发论文，研三写大论文并考虑读博。",
"q006": "课程学习+技能储备+科研参与+综合素质四维展开。",
"q007": "优势匹配+劣势客观+改进措施。优势要有依据（排名、代码、项目）；劣势要真实且已在弥补。",
"q008": "课程名+印象深刻点+专业收获，最好有具体细节/项目成果。",
"q009": "调整心态+梳理问题+寻求帮助+持续尝试四步。最好有本科类似经历佐证。",
"q010": "短期(硕士训练)+中期(读博或就业)+长期(技术专家/研究员)，始终紧扣专业。",
"q011": "尊重导师+主动沟通+寻找交叉+灵活调整。计算机是交叉学科，常能在方法/场景上找到重叠。",
"q012": "灵活转换角色，更享受可靠合作者同时具备领导潜力，用实例说明。",
"q013": "内涵(核心技术/自主掌控)+计算机科学的基础性作用+个人如何结合国家需求。",
"q014": "诚实/严谨/负责；结合代码与数据可复现要求，造假危害研究生态；自身承诺如实记录、开源可验证。",
"q015": "选一项能体现能力的事，用STAR(情境-任务-行动-结果)讲清，带上量化结果。",
"r401": "科学问题→方法→结果→意义的故事线，3分钟讲完。",
"r402": "fair baseline+固定随机种子+重复与显著性+消融实验+报告方差。",
"r403": "排查数据泄露/标签错/归一化；profiler定位；离群分析；保留实验日志。",
"r404": "找到方法与导师方向的接口；已复现组内论文；谈可贡献的工程能力。",
"r405": "工程价值(落地/开源/用户)+科学价值(baseline/结论)；诚实说局限。",
"r406": "具体难点→排查过程(定位-隔离-解决)→沉淀经验。",
"r407": "独立测试集+K折+OOD测试+子群体公平性+正则化。",
"r408": "一条'问题导向+工程方法'主线统一各项目，落到报考方向。",
"e501": "90秒内：背景+排名+研究方向+报考意愿。",
"e502": "点出具体方向/实验室/论文，体现真诚。",
"e503": "清晰可行轨迹：硕士→博士/方向。",
"e504": "用question-method-result框架。",
"e505": "优势有依据+劣势配改进行动。",
"e506": "讲一个真实小故事。",
"e507": "提一个你能展开的具体热点。",
"e508": "给一个复杂度例子证明重要性。",
"e509": "诚实说明熟练度。",
"e510": "长期贡献与技术专家定位。",
"t601": "找主干；固定术语(上下文学习/in-context learning)译准确。",
"t602": "固定术语译法(并发/动态分析/happens-before)。",
"t603": "术语先行(可串行化/两阶段锁/乐观并发控制)。",
"t604": "主句-方式状语分清；TCP/IP不混。",
"t605": "注意让步语义；network partition网络分区。",
"t606": "图神经网络：节点特征+拓扑依赖都译出。",
"t607": "缓存缺失/存储层次/加速。",
"t608": "B+树/扇出/有序叶子节点。",
"t609": "对抗样本/鲁棒性；fool译自然。",
"t610": "反馈回路/生产环境采用；practitioners译出。",
"p001": "kernel=1做逐点线性组合（升维），kernel=2捕获相邻碱基模式，多尺度卷积。",
"p002": "LocallyConnected各位置独立权重，适合位置特异性强的序列数据。",
"p003": "MaxPool捕获峰值，AvgPool保留全局统计，拼接后信息更丰富。",
"p004": "自身拼接等价于特征维度翻倍，可能是为了匹配原论文维度设计。",
"p005": "不是几何增强，是利用多时间点标签做多任务/正则化。",
"p006": "1e-8防除零；推理用y_min_max.npy反归一化。",
"p007": "约120轮；应加save_best_only保存最佳权重。",
"p008": "存在数据泄漏风险；改进：按序列ID分组划分。",
"p009": "演示版只放3个；完整版从NCBI动态获取。",
"p010": "Math.random可预测→隐私泄露；改用UUID v4。",
"p011": "多设备需后端持久化（任务表+API）；单机演示localStorage够用。",
"p012": "从大粒度到小粒度递归切分，空格放最前会碎片化语义。",
"p013": "元数据过滤+近似搜索不确定性，多取再筛选更可靠。",
"p014": "归一化后‖a-b‖²=2-2cos(a,b)，所以cos=1-d²/2。",
"p015": "发现→查原因(C++ fopen)→用serialize+pathlib绕过。",
"p016": "能挡住大部分编造；漏洞：拼接型编造和同义改写。",
"p017": "高频字匹配导致误判；改进：n-gram或embedding相似度。",
"p018": "保守设计：宁可少答(false negative)不可错答(false positive)。",
"p019": "硬分发保可靠、省成本；意图识别可能出错。",
"p020": "不能保证；改进：function calling或strict JSON Schema。",
"p021": "XOR=AND(OR,NAND)，两层结构，具体输入验证。",
"p022": "梯度下降+反向传播，w=w-η×∂L/∂w。",
"p023": "链式法则：局部梯度×上游梯度，节点只关心局部。",
"p024": "子问题分解+结果复用，DAG上反向遍历。",
"p025": "卷积核滑动保留局部空间关系；感受野=输出对应输入区域。",
"p026": "降维+平移不变+扩感受野；现代网络用stride卷积替代。",
"p027": "10节点覆盖完整分析链；固定流程保可调试性。",
"p028": "Chroma有元数据过滤（舆情需要）；FAISS底层灵活（课程助手需要）。",
"p029": "规则驱动的模板回答，非随机；用于无API Key时完整演示。",
"p030": "MinHash+LSH/SimHash/embedding相似度分层去重。",
"p031": "加权求和+维度阈值一票否决。",
"p032": "SQLite文件级锁→PostgreSQL行级锁/MVCC。",
"p033": "去掉mutation+TS类型推断；代码量少约40%。",
"p034": "诚实分层：参考部分+原创部分。",
"p035": "选一个具体改进讲透（如引用验证、序列化安全）。",
"p036": "用排查过程叙事：发现→定位→解决→教训。",
"p037": "DARE-RAG是方法优化，课程助手是应用系统；检索层可合并。",
"r001": "并行性+长距离依赖O(1)+可解释性；Multi-Head捕获不同子空间。",
"r002": "方差随d_k增长→softmax饱和；除以√d_k将方差缩放到1。",
"r003": "长度泛化+相对位置线性表示；可学习嵌入固定最大长度。",
"r004": "RAG-Sequence同一文档集生成全程；RAG-Token每token可切换文档。",
"r005": "BM25稀疏关键词匹配；DPR稠密语义匹配；混合检索兼顾两者。",
"r006": "检索不准/模型忽略/文档错误/添油加醋四个失败模式。",
"r007": "集成学习+打破共适应；训练drop推理不drop。",
"r008": "稳定输入分布+平滑loss landscape+轻微正则化。",
"r009": "Momentum加速收敛+RMSProp自适应学习率+偏差修正。",
"r010": "GPT因果掩码→生成；BERT双向→理解；T5统一两者。",
"r011": "预训练学会meta-learning；Few-Shot不更新参数只改输入。",
"r012": "幂律关系L∝N^(-α)；可预测性；N和D同步扩展。",
"r013": "SFT→RM→PPO三阶段；SFT降低RL搜索空间。",
"r014": "闭式解替代RM+PPO两步；更稳定超参更少。",
"r015": "tiling分块在SRAM计算；精确注意力非近似；O(N²)→O(N)。",
"r016": "低秩假设ΔW=AB；参数量减少64倍；推理时合并零开销。",
"r017": "O(N)线性复杂度；输入相关选择机制；固定隐藏状态推理。",
"r018": "G生成骗D；D区分真假；极小极大博弈；理想态D=0.5。",
"r019": "前向加噪→反向去噪；训练预测噪声ε；L=||ε-ε_θ||²。",
"r020": "聚合邻居特征+线性变换；消息传递vs规则网格卷积。",
"r021": "架构演进→规模扩展→范式转变三条主线。",
"r022": "RAG原始论文+Transformer+GPT-3；构成完整逻辑链。",
"r023": "分解问题+工作记忆+test-time compute；与RAG互补。",
"r024": "Evoformer+Structure Module；序列表示学习+数据增强关联。",
"r025": "ReLU+Dropout+GPU+端到端；从手工特征到自动学习。",
"r026": "两个3×3感受野等于5×5；参数量减45%+非线性更强。",
"r027": "学残差F(x)=H(x)-x比学H(x)容易；梯度直通∂y/∂x=∂F/∂x+1。",
"r028": "恢复空间细节+缓解梯度消失+多尺度特征融合。",
"r029": "软标签包含类间关系；温度T>1平滑分布；Student学Teacher的泛化能力。",
"r030": "分布式语义假说；降维保留语义关系；静态→动态表示。",
"r031": "信息瓶颈：固定向量压缩长序列；催生了Attention机制。",
"r032": "cross-attention vs self-attention；加性vs点积；RNN vs并行。",
"r033": "概率潜在空间+KL正则化；可采样生成新数据。",
"r034": "因果膨胀卷积；感受野指数增长；并行替代序列计算。",
"r035": "JS散度在不重叠时梯度为零；Wasserstein提供有意义梯度。",
"r036": "无配对数据；循环一致性约束x→G(x)→F(G(x))≈x。",
"r037": "Mapping Network生成w；AdaIN逐层调制特征；分层风格控制。",
"r038": "可学习注意力权重vs GCN固定均值权重；多头注意力。",
"r039": "零样本多任务；能力涌现；安全争议延迟发布。",
"r040": "统一Text-to-Text格式；一个架构解决所有任务。",
"r041": "双向不能用标准LM（偷看答案）；MLM遮盖15%避免泄露。",
"r042": "RMSNorm+SwiGLU+RoPE+Chinchilla最优比；开源改变生态。",
"r043": "1D序列化2D；16×16是精度效率平衡；打破CNN垄断。",
"r044": "集合预测+二部图匹配；不需要anchor和NMS。",
"r045": "N×N对比学习矩阵；4亿图文对；zero-shot分类。",
"r046": "dVAE压缩为离散token+Transformer自回归联合建模。",
"r047": "宪法原则+AI自我评判；RLAIF替代人类标注降成本。",
"r048": "Thought-Action-Observation循环；推理+行动互补。",
"r049": "MoE top-1路由；1.6万亿参数但只激活1/100。",
"r050": "D≈20N最优比；GPT-3欠训练；小模型充分训练更划算。",
"r051": "从蛋白质到复合物；Diffusion Module替代Structure Module。",
"r052": "MoE+RoPE长度外推+分布式长序列注意力。",
"r053": "策略网络+价值网络+MCTS三组件协同。",
"r054": "clipped surrogate objective；比TRPO简单；稳定高效。",
"r055": "自我对弈→训练→MCTS搜索→新策略循环。",
"r056": "Promptable分割+SA-1B数据引擎+zero-shot泛化。",
"r057": "闭式解替代RM+PPO两步；log比率差直接优化。",
"r058": "pass@k指标+单元测试验证+HumanEval基准。",
"r059": "两次增强构造正样本+InfoNCE对比损失。",
"r060": "57学科14000+题；跨学科评测LLM世界知识。",
"r061": "异构计算+容错+混合并行（数据+模型+专家并行）。",
"r062": "MLA低秩压缩KV Cache+DeepSeekMoE细粒度专家。",
"r063": "奖励来源不同（人类偏好vs正确性）；自发涌现CoT。",
"r064": "CNN端到端+经验回放+目标网络；深度RL起点。",
"r065": "预训练+微调范式；单向Decoder；12任务9个SOTA。",
"r066": "学到的世界模型替代已知规则；World Model+MCTS。",
"r067": "5D坐标→颜色密度；体积渲染；多视角训练优化MLP。",
"r068": "像素空间太大→潜在空间压缩48倍；Stable Diffusion可在消费GPU运行。",
"r069": "公开多模态+评测；没公开架构/参数/数据；社区争议。",
"r070": "RLHF起源：人类偏好→RM→PPO；InstructGPT搬到了LLM。",
"r071": "Word2Vec→Seq2Seq→Attention→Transformer→GPT→RLHF→DPO→R1。"
};
