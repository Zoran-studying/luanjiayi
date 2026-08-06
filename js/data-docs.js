/* ============================================================
   推免助手 PushMian Buddy — 种子数据（计算机科学与技术方向）
   说明：仅在首次初始化时写入 localStorage，之后以本地存储为准。
   ============================================================ */

const SEED_DOCBANK = {"sources":[
{"id":"cs60","title":"计算机专业推免复试·高频真题精简版","desc":"面试考生回忆整理，含答题模板与要点","sections":[
{"name":"自我介绍与报考认知类","items":[
{"id":"cs60-1","q":"请做一个自我介绍。（通用，各高校计算机专业常考）","ans":"【答题模板】个人简介+教育背景+项目经历+专业契合度\n【答】我叫[姓名]，来自[大学]计算机科学与技术专业，GPA [X]/5.0，综合排名专业前[Y]%。\n在校期间我系统学习了数据结构、算法、操作系统、计算机网络、数据库与编译原理等核心\n课程。大三我参与了一个[项目]：负责[模块]，用[C/C++/Python]实现了[方案]，性能对比\nbaseline 提升[量化指标]。这段经历让我熟悉了 Linux、Git 与调试/性能分析工具，也培养\n了对[方向]的研究兴趣。我性格沉稳、做事细致，能独立完成从设计到实现再到验证的完整\n链路。如果有幸被录取，我希望在[报考方向]继续深造，尽早融入课题组。\n【答题技巧】控制在2-3分钟，突出与报考方向相关的课程、项目与科研经历，强调代码功底\n与团队协作等素养。\n2. 你为什么选择报考我们学校的计算机专业？\n★★★ (清华、北大、浙大、上交等多校考察)"},
{"id":"cs60-2","q":"你为什么选择报考我们学校的计算机专业？★★★","ans":"【答题模板】单位优势+平台资源+个人发展契合\n【答】我报考贵校主要基于三点。第一，贵校计算机学科在[系统/AI/数据库]方向积累深厚，\n我曾精读贵系老师发表的论文，其研究思路让我非常向往。第二，贵系平台与实验室资源能\n支撑我把课程项目推向真实系统研究。第三，我的代码功底与贵方向互补，能较快融入课题\n组。我未来的职业规划是从事[方向]研究，贵校的资源与方向能为我提供最匹配的成长土壤。\n【答题技巧】提前了解目标院校的特色方向、重点实验室与导师论文，结合自身经历表达真诚\n的向往。\n3. 你本科所学专业与计算机/报考方向的关联是什么？\n★★★★ (跨方向考生重点考察)"},
{"id":"cs60-3","q":"你本科所学专业与报考方向的关联是什么？★★★★","ans":"【答题模板】知识迁移+技能互补+兴趣衔接\n【答】我本科是[专业]，与计算机同属[学科体系]。首先，课程上我系统学习了[核心课程]，\n这些知识为理解[报考方向]提供了基础。其次，工程技能上我熟悉 C/C++、Python、Linux、\nGit 与调试/性能工具，这些能力在[方向]研究中完全适用。此外，我在[项目]中锻炼了从需\n求到实现的系统思维。虽然[特定知识]还需补课，但我已自学[课程/教材]并完成[练习/项目]，\n我相信能顺利衔接贵系的研究工作。\n【答题技巧】强调课程重合度、技能共通性，并展示已经为衔接所做的补充。\n4. 谈谈你对计算机科学专业的理解。\n★★★★"},
{"id":"cs60-4","q":"谈谈你对计算机科学专业的理解。★★★★","ans":"【答题模板】学科定义+核心子领域+理论-系统-应用闭环+个人视角\n【答】计算机科学既研究计算的本质（可计算性、复杂度），也研究如何用软硬件系统解决真\n实问题。核心子领域包括算法、系统、网络、数据库与人工智能。它强调理论-系统-应用的闭\n环：算法是灵魂，系统是载体，应用是归宿。我的体会是它实践性极强——只有亲手实现、调试\n与优化，才能真正理解教材上的抽象概念。\n【答题技巧】落到'理论-系统-应用'闭环，结合自身课程与项目经历。\n5. 你未来的研究方向规划是什么？\n★★★★"},
{"id":"cs60-5","q":"你未来的研究方向规划是什么？★★★★","ans":"【答题模板】初步意向+选择理由+阶段性计划\n【答】我希望聚焦[方向]。短期研一补齐数学与系统基础、熟练工程工具；中期围绕[具体问\n题]定题，发表 1-2 篇高质量论文并开源代码；长期视成果考虑读博，朝[方向]继续发展。\n规划聚焦但留有调整空间，会结合导师意见动态修正。\n【答题技巧】开放但聚焦，展示可执行的分阶段规划。\n6. 录取后如何开展研究生阶段的学习和研究？\n★★★"}
]},
{"name":"数据结构与算法类","items":[
{"id":"cs60-6","q":"数组与链表的区别及各自适用场景？★★★","ans":"【要点】数组连续存储、O(1) 随机访问、插入删除 O(n)、缓存友好；链表通过指针链接、\n已知节点处插入删除 O(1)、随机访问 O(n)、有指针开销。场景：频繁随机访问用数组；频繁\n增删、长度不定用链表。\n【展开】可进一步谈链表的变体（双向、循环、带头结点）与数组扩容（动态数组均摊 O(1)）。"},
{"id":"cs60-7","q":"哈希表冲突怎么解决？请举例。★★★★","ans":"【要点】链地址法（HashMap 用拉链，冲突链表过长转红黑树）与开放定址法（线性探测、\n二次探测、双重哈希）。负载因子过高需扩容 rehash。\n【展开】线性探测的聚集问题，以及为什么均匀哈希函数重要。也可谈一致性哈希在分布式缓\n存中的应用。"},
{"id":"cs60-8","q":"快速排序的原理、复杂度与优化？★★★★★","ans":"【要点】选枢轴划分，左小右大后递归。平均/期望 O(n log n)，最坏 O(n²)。优化：三数\n取中选枢轴、小区间用插入排序、递归转迭代、三路划分处理重复元素。\n【展开】谈稳定性（不稳定）、实际为什么通常比归并快（缓存局部性、原地）。"},
{"id":"cs60-9","q":"动态规划的适用条件，举一个例子？★★★★","ans":"【要点】最优子结构+重叠子问题。步骤：定义状态→转移方程→初值与遍历顺序→空间优化。\n【展开】以最长公共子序列或 0-1 背包为例现场推导状态与转移，体现逻辑清晰。\n【避坑】不要与分治（子问题独立）和贪心（局部最优即全局最优）混淆。"}
]},
{"name":"操作系统类","items":[
{"id":"cs60-10","q":"进程与线程的区别？★★★★★","ans":"【要点】进程是资源分配基本单位，独立地址空间；线程是调度基本单位，同进程线程共享\n地址空间，创建切换开销更小。\n【展开】可谈协程（用户态调度、栈切换）与线程模型的差异，体现知识面。"},
{"id":"cs60-11","q":"死锁的四个必要条件及处理方法？★★★★★","ans":"【要点】互斥、持有并等待、不可剥夺、环路等待。预防（破坏某条件）、避免（银行家算\n法）、检测与解除。\n【展开】可举例：两个线程互相持有对方需要的锁形成死锁；或数据库中的两阶段锁。\n【避坑】四条件顺序与含义要准确。"},
{"id":"cs60-12","q":"虚拟内存的原理与作用？★★★","ans":"【要点】逻辑/物理地址分离，分页分段按需装入，缺页中断换入，程序可用地址空间大于物\n理内存，同时提供隔离与共享。\n【展开】页面置换算法（LRU、Clock），以及为什么用近似 LRU。"}
]},
{"name":"计算机网络类","items":[
{"id":"cs60-13","q":"TCP 三次握手的过程及为什么要三次？★★★★★","ans":"【要点】SYN→SYN+ACK→ACK。目的：同步双方序号、确认收发能力，防止失效的连接请求\n突然到达造成错误连接（半连接问题）。\n【展开】谈四次挥手与 TIME_WAIT 的作用，体现对协议机制的完整理解。"},
{"id":"cs60-14","q":"TCP 与 UDP 的区别及应用场景？★★★★","ans":"【要点】TCP 面向连接、可靠、有序、有流量与拥塞控制，开销大；UDP 无连接、低延迟、\n可容忍丢包。场景：Web/文件传输用 TCP；DNS、直播、游戏用 UDP。\n【展开】可谈 QUIC（基于 UDP 的可靠传输）作为趋势。"},
{"id":"cs60-15","q":"HTTP 与 HTTPS 的区别？★★★","ans":"【要点】HTTPS=HTTP+TLS，握手协商加密套件、证书校验与密钥交换，之后加密传输，保\n证机密性、完整性与身份认证；代价是握手延迟与计算开销。\n【展开】可谈证书链与中间人攻击的防护。"}
]}
]},
{"id":"cs-os","title":"操作系统与并发·真题精选","desc":"进程/线程/同步/内存经典题，含思路","sections":[
{"name":"进程与线程类","items":[
{"id":"cs-os-1","q":"进程有哪些状态？如何转换？★★★","ans":"【要点】就绪、运行、阻塞三态。就绪被调度→运行；运行时间片耗尽→就绪；运行请求事\n件→阻塞；事件完成→就绪。现代系统还有新建与终止。\n【展开】可画状态图口述转换条件，注意就绪与阻塞之间不能直接转换。"},
{"id":"cs-os-2","q":"什么是上下文切换？为什么开销大？★★★","ans":"【要点】CPU 保存当前进程上下文、恢复另一进程上下文的过程。开销来自寄存器/页表/缓\n存刷新与内核进出。\n【展开】对比线程切换（共享地址空间，缓存更友好）与协程切换（用户态）。"},
{"id":"cs-os-3","q":"线程池的作用是什么？★★★","ans":"【要点】复用线程避免频繁创建销毁，控制并发数，任务队列解耦提交与执行，提升吞吐与\n稳定性。\n【展开】可谈线程池参数（核心/最大线程数、队列、拒绝策略）。"}
]},
{"name":"同步与死锁类","items":[
{"id":"cs-os-4","q":"如何用信号量解决生产者-消费者问题？★★★★","ans":"【要点】empty（初值 n）、full（初值 0）、mutex（初值 1）。生产者先 P(empty) 再\nP(mutex)，放入后 V(mutex) V(full)；消费者先 P(full) 再 P(mutex)，取出后 V(mutex)\nV(empty)。\n【避坑】先资源后互斥的顺序不能颠倒，否则可能死锁。"},
{"id":"cs-os-5","q":"什么是竞态条件？如何避免？★★★★","ans":"【要点】多个执行流访问共享数据、结果依赖执行次序。避免方法：互斥锁、原子操作、无\n锁编程（CAS）、避免共享（线程本地存储）。\n【展开】可谈 volatile 与原子性的区别，以及内存序。"},
{"id":"cs-os-6","q":"什么是活锁与饥饿？与死锁有何不同？★★★","ans":"【要点】饥饿是低优先级任务长期得不到资源；活锁是任务不断让位、互相让导致都无进展\n但都在运行。死锁是互相等待永不前进。\n【展开】可谈优先级老化机制防止饥饿。"}
]},
{"name":"内存管理类","items":[
{"id":"cs-os-7","q":"什么是内碎片与外碎片？如何解决？★★★","ans":"【要点】内碎片是块内浪费，外碎片是空闲块过碎。分页消除外碎片（页内内碎片小），分\n段保留逻辑意义但易外碎片，可紧凑；伙伴系统与 slab 分配器管理小对象。\n【展开】可谈 malloc 的实现（glibc 的 ptmalloc）体现深度。"},
{"id":"cs-os-8","q":"LRU 页面置换算法的原理及近似实现？★★★★","ans":"【要点】淘汰最久未使用的页，需要维护访问时间，理论最优之一但硬件代价高。近似实现\n有 Clock（二次机会）算法，用引用位循环扫描。\n【展开】对比 FIFO 的 Belady 异常，说明 LRU 不会出现该异常。"}
]}
]},
{"id":"cs-net","title":"计算机网络与数据库·真题精选","desc":"TCP/IP、事务与系统设计经典题","sections":[
{"name":"TCP/IP 类","items":[
{"id":"cs-net-1","q":"TCP 如何保证可靠传输？★★★★","ans":"【要点】序列号与确认应答、超时重传、滑动窗口流控、累积确认与选择性确认（SACK）、\n校验和。接收方按序交付、丢弃重复段。\n【展开】可谈快速重传（3 个重复 ACK）与快速恢复。"},
{"id":"cs-net-2","q":"TCP 拥塞控制的主要阶段？★★★★","ans":"【要点】慢启动（cwnd 指数增长至阈值）、拥塞避免（线性增长）、快速重传、快速恢复。\n发生丢包/超时减小 cwnd 并调节阈值。\n【展开】说明拥塞控制（网络负载）与流量控制（接收能力）的区别。"},
{"id":"cs-net-3","q":"DNS 解析的完整过程？★★★","ans":"【要点】查本地缓存/hosts→本地 DNS 递归→根/顶级/权威服务器迭代→得到 IP 返回并缓存。\n【展开】可谈 DNS 缓存污染与 HTTPS 化解析（DoH）。"}
]},
{"name":"数据库与事务类","items":[
{"id":"cs-net-4","q":"什么是事务？ACID 分别指什么？★★★★","ans":"【要点】事务是操作的执行单元。原子性（要么全做要么全不做）、一致性（状态合法）、\n隔离性（并发互不影响）、持久性（提交即固化）。\n【展开】谈实现手段：回滚日志（原子）、锁/多版本（隔离）、WAL（持久）。"},
{"id":"cs-net-5","q":"什么是可串行化？两阶段锁如何保证它？★★★★","ans":"【要点】并发事务执行结果等价于某个串行执行。两阶段锁分扩展（只加锁）与收缩（只释\n放）两阶段，保证冲突操作顺序一致。\n【展开】可谈死锁检测与多版本并发控制（MVCC）作为替代。"},
{"id":"cs-net-6","q":"B+树为什么适合做数据库索引？★★★★","ans":"【要点】数据只在叶子且叶子链表相连（范围查询高效）；非叶只存键，扇出大树矮（磁盘\nIO 少）；自平衡。\n【展开】对比哈希索引（等值快但范围差）与 LSM-Tree（写优化）。"}
]},
{"name":"系统设计类","items":[
{"id":"cs-net-7","q":"如何设计一个短链接系统？★★★★","ans":"【要点】映射算法（哈希+进制转换/自增 ID）、存储（DB+缓存）、重定向（302/301）、高\n可用（多副本、负载均衡）。\n【展开】谈一致性（ID 生成）、容量估算与防滥用，体现系统思维。"},
{"id":"cs-net-8","q":"什么是缓存击穿、穿透与雪崩？如何应对？★★★★","ans":"【要点】穿透：查不存在数据，用空值缓存/布隆过滤器；击穿：热点 key 过期，用互斥锁/逻\n辑过期；雪崩：大量 key 同时过期，过期时间加随机/多级缓存/限流降级。\n【展开】谈缓存与 DB 的一致性更新策略。"}
]}
]}
]};

/* ============================================================
   文献翻译练习种子（计算机顶会/期刊摘要片段，英译汉）
   mergeSeeds 时按 id 合并入 S.translate
   ============================================================ */
const SEED_TRANSLATE = [
  {
    "id": "tr-1",
    "en": "Large language models trained on internet-scale corpora exhibit emergent abilities in reasoning, planning, and tool use that are not explicitly programmed.",
    "cn": "在互联网规模语料上训练的大语言模型展现出推理、规划与工具使用等涌现能力，这些能力并非被显式编程实现。",
    "status": "未标记"
  },
  {
    "id": "tr-2",
    "en": "This paper designs a lock-free concurrent data structure that eliminates contention on the critical path and achieves near-linear scalability on multicore processors.",
    "cn": "本文设计了一种无锁并发数据结构，消除了关键路径上的争用，并在多核处理器上实现了近线性可扩展性。",
    "status": "未标记"
  },
  {
    "id": "tr-3",
    "en": "Databases increasingly rely on a hybrid transactional and analytical processing architecture to serve real-time decisions without separate data pipelines.",
    "cn": "数据库日益依赖混合事务与分析处理（HTAP）架构，以无需独立数据管道即可服务实时决策。",
    "status": "未标记"
  },
  {
    "id": "tr-4",
    "en": "Packet-level simulation shows that the proposed congestion control algorithm improves throughput by 20% while reducing tail latency under bursty traffic.",
    "cn": "分组级仿真表明，所提出的拥塞控制算法在突发流量下使吞吐量提升 20%，同时降低了尾部延迟。",
    "status": "未标记"
  },
  {
    "id": "tr-5",
    "en": "A key challenge in distributed storage is maintaining strong consistency during network partitions without sacrificing availability.",
    "cn": "分布式存储的一个关键挑战是：在网络分区期间保持强一致性的同时不牺牲可用性。",
    "status": "未标记"
  },
  {
    "id": "tr-6",
    "en": "Compiler optimizations such as loop unrolling and vectorization often yield larger speedups than algorithm-level changes when memory bandwidth is the bottleneck.",
    "cn": "在内存带宽成为瓶颈时，循环展开与向量化等编译器优化往往比算法层面的改动带来更大的加速比。",
    "status": "未标记"
  },
  {
    "id": "tr-7",
    "en": "Attention mechanisms allow models to focus on the most relevant tokens, which is the core of the Transformer architecture.",
    "cn": "注意力机制使模型能够聚焦于最相关的词元，这是 Transformer 架构的核心。",
    "status": "未标记"
  },
  {
    "id": "tr-8",
    "en": "Regularization techniques penalize model complexity to mitigate overfitting, improving generalization on unseen data.",
    "cn": "正则化技术通过惩罚模型复杂度来缓解过拟合，从而提升模型在未见数据上的泛化能力。",
    "status": "未标记"
  },
  {
    "id": "tr-9",
    "en": "Containerization packages an application with its dependencies so that it runs consistently across development, testing, and production environments.",
    "cn": "容器化将应用与其依赖打包，使其在开发、测试与生产环境中一致运行。",
    "status": "未标记"
  },
  {
    "id": "tr-10",
    "en": "Microservice architectures trade increased operational complexity for independent scalability and fault isolation among services.",
    "cn": "微服务架构以增加的运维复杂度换取各服务间的独立扩展与故障隔离。",
    "status": "未标记"
  },
  {
    "id": "tr-11",
    "en": "Snapshot isolation reduces write contention in database transactions at the cost of more frequent conflicts on concurrent updates.",
    "cn": "快照隔离降低了数据库事务中的写争用，但代价是并发更新时冲突更频繁。",
    "status": "未标记"
  },
  {
    "id": "tr-12",
    "en": "The evaluation demonstrates that our method outperforms strong baselines by a wide margin while maintaining comparable inference latency.",
    "cn": "评估表明，我们的方法大幅超越强基线，同时保持可比的推理延迟。",
    "status": "未标记"
  },
  {
    "id": "tr-13",
    "en": "Transfer learning pretrains a model on a large source domain and fine-tunes it on a target task with limited labeled data.",
    "cn": "迁移学习先在大型源领域上预训练模型，再在标注数据有限的目标任务上进行微调。",
    "status": "未标记"
  },
  {
    "id": "tr-14",
    "en": "In distributed systems, the consensus protocol determines the order of operations across replicas to guarantee consistency.",
    "cn": "在分布式系统中，共识协议决定各副本间的操作顺序，以保证一致性。",
    "status": "未标记"
  },
  {
    "id": "tr-15",
    "en": "Profiling reveals that memory allocation dominates the runtime, motivating a custom arena allocator to reduce allocation overhead.",
    "cn": "性能剖析显示内存分配占据了主要运行时间，因此采用自定义竞技场分配器以降低分配开销。",
    "status": "未标记"
  },
  {
    "id": "tr-16",
    "en": "A bloom filter provides a space-efficient probabilistic test for set membership at the cost of a small false-positive rate.",
    "cn": "布隆过滤器为集合成员判定提供空间高效的概率性测试，代价是存在较小的误判率。",
    "status": "未标记"
  },
  {
    "id": "tr-17",
    "en": "Cache coherence protocols maintain a consistent view of memory across cores, directly affecting the performance of parallel workloads.",
    "cn": "缓存一致性协议使各核之间保持内存视图一致，直接影响并行负载的性能。",
    "status": "未标记"
  },
  {
    "id": "tr-18",
    "en": "Dynamic analysis tools track the execution of a program at runtime to detect memory errors and concurrency bugs.",
    "cn": "动态分析工具在运行时跟踪程序执行，以检测内存错误与并发缺陷。",
    "status": "未标记"
  },
  {
    "id": "tr-19",
    "en": "By caching precomputed results, memoization turns an exponential recursive algorithm into a polynomial one.",
    "cn": "通过缓存已计算结果，记忆化将指数级递归算法转化为多项式级算法。",
    "status": "未标记"
  },
  {
    "id": "tr-20",
    "en": "Reproducibility is essential in systems research: releasing source code and benchmark scripts lets others verify and build upon the results.",
    "cn": "可复现性在系统研究中至关重要：发布源代码与基准脚本使他人能够验证并在此基础上继续研究。",
    "status": "未标记"
  }
];
