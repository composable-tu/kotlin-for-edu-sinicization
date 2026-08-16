# 04 幻灯片页面级设计方法论

> 语料：JetBrains 官方 Kotlin 课程 PPT 提取文本（含讲师备注），7 门课横向扫描：
> Introduction to Kotlin（26页）、Exceptions（9页）、Testing（23页）、Build Systems（37页）、Reflection (JVM)（45页）、Backend Development Basics（57页）、The JVM & the Kotlin Compiler（103页）。
> 所有引用格式：`《文件名》Slide N`。提取文本中删除线等富文本会丢失格式（如 "run ~~Java~~ Kotlin" 提取为 "run Java Kotlin"），已结合上下文还原。

---

## 0. 总览：这套课件的三条底层设计律

1. **页面是"帧"不是"文档"**：一页只承载一个可被口头解释完的动作（一个概念、一段代码、一次结果、一步动画）。超过这个量的内容被**拆成序列**，而不是塞进一页。
2. **重复是特性，不是缺陷**：同一个代码面板、同一张图、同一个列表在连续多页反复出现，每页只改动/新增一处，靠"页间差分"制造注意力聚焦。全语料中最极端的例子是同一张图连用 14 页。
3. **幻灯片示"形"，备注载"声"**：页面给眼睛（代码、图、短句），讲师备注给耳朵（叙事、展开、参考文献、冷笑话）。页面自解释到"能看懂在讲什么"，但真正的解释量在备注里。

---

## 1. 单页信息密度

### 1.1 典型密度：5–12 行正文

绝大多数内容页落在"标题 + 5~12 行内容"区间，无论内容是 bullet 还是代码：

- 《Introduction to Kotlin》Slide 9（Functions）：标题 + 5 段短代码（共11行）+ 4 条要点说明。
- 《Exceptions_》Slide 2（What? Why?）：标题 + 1 句定义 + 3 类来源 + 3 条"为什么用" + 2 条"不要用"，共约 10 行——这已是本课最密的一页。
- 《Build Systems》Slide 4（Maven）：7 条特性 bullet + 3 个文件名标签，约 10 行。
- 《Reflection (JVM)》Slide 35（What are the drawbacks?）：4 条缺点 + 1 条劝告，5 行。

### 1.2 三种"稀疏页"及其使用时机

**（a）单句页**——用于钉住一个"必须被记住的一句话"：
- 《Introduction to Kotlin》Slide 4 整页正文只有一句：`Kotlin is named after an island in the Gulf of Finland.`（备注补一句 Google Maps 彩蛋）。
- 《Testing_》Slide 2 用 3 行递进格言开场（"Every program contains bugs. / If a program does not contain bugs, the algorithm... / If neither... no one needs the program"）——单句页的变体：格言三连。
- 《Backend Development Basics》Slide 11（HTTP）全页只有两行：`text based communication protocol (http 1.*)` / `can handle text and binary data`。

**（b）纯图页**——标题 + 图，零正文。用于"图本身即全部内容"的场合：
- 《The JVM & the Kotlin Compiler》Slide 3（Compilation process – Java vs C）：标题 + 对比图，无一行文字，全部解释在备注。
- 《Build Systems》Slide 3（How?）和 Slide 7（New Gradle Project in IntelliJ IDEA）：标题 + 流程图/截图。
- 《Reflection (JVM)》Slide 28、69：标题 + IDE 截图。

**（c）悬念页/表情页**——标题即内容：
- 《Reflection (JVM)》Slide 7 标题就是一个 `👀`，页面上只有 Java 异常层次图 + 一行 "And a lot in java.util"。

### 1.3 层级：只有两级——标题行 + 正文行

- 全语料未见三、四级嵌套标题。层级感靠**标题的冒号分级**实现（见 §2.2）和 bullet 的粗体术语实现：《Backend Development Basics》大量使用 `- **术语**: 解释` 的两段式行（Slide 4、16、18、47）。
- 密度反例：《Backend Development Basics》是全语料 bullet 最密的课（单页常 12–15 行、双层嵌套），也是唯一几乎无讲师备注的课（57 页仅 1 页有备注）。对照《The JVM & the Kotlin Compiler》（103 页 96 页有备注、页面反而更稀疏），可得出结论：**页面密度与备注覆盖度成反比——写得越满的页，越不需要/越没有讲稿**，而依赖现场讲解的课会把内容留在备注、把页面留白。

### 1.4 通用原则

- 一页 = 一个认知动作。判断标准：这页能不能用一句话向讲师描述("这页展示 X 的错误输出")？需要用"和"来描述的页，拆。
- 概念定义、代码、运行结果、图，尽量不同页；必须同页时（如代码+输出），用视觉分区（左右栏/上下框）而不是混排。证据：《Reflection (JVM)》Slide 8–10 代码与输出分栏并列；《Exceptions_》Slide 4 代码与控制台输出分区块。

---

## 2. 标题句式

### 2.1 默认句式：名词短语（话题式），2–4 个词

压倒性多数标题是极短名词短语：Variables / Functions / Loops / Ranges / Null safety / Elvis operator ?: / Safe Calls / TODO（以上全出自《Introduction to Kotlin》）；Tasks / Plugins / The Wrapper / Version catalog（《Build Systems》）；KLibs（《The JVM & the Kotlin Compiler》）。

### 2.2 冒号分级：`大主题: 子话题`，让标题自己承担"章节导航"

同一前缀标题连排即构成一节，无需额外分隔页：
- 《Testing_》Slide 7–12 连续六页标题 `Testing: types`；Slide 13–16 连续四页 `Testing: levels`。
- 《Reflection (JVM)》Slide 4–21 连续 `Reflection in Java: the main entry point / getting fields / setting fields / getting class methods`。
- 《Build Systems》Slide 25–28 `Dependency management: Repositories / Dependencies`；Slide 11–19 `Project: Settings / Tasks`。
- 《The JVM & the Kotlin Compiler》Slide 45–50 `Java interoperability: nullability / collection mapping`；Slide 92–101 `Compiler plugins: FIR extensions / IR extensions / popular plugins`。

### 2.3 疑问句标题：只用在"节的入口"和"苏格拉底式追问链"

- 节入口：《Exceptions_》Slide 2 `What? Why?` → Slide 3 `How?`（两页开启全课，同样的结构在《Build Systems》Slide 2–3 重复出现，是该讲师团队的固定开场模板）。
- 追问链：《The JVM & the Kotlin Compiler》Slide 15 标题下挂问题 `Why, then, do we need the interpreter?`，Slide 16 用 Interpreter vs JIT-compiler 对比图回答，Slide 17 继续问 `What sorts of JIT code are worth compiling?`，Slide 18 再问 `How can we understand which pieces of code will take a long time to execute?`——**一个问题一页，问题写在页面上作为持久副标题**，答案在下页出现。
- 单发问题标题：《Reflection (JVM)》Slide 34 `Why is reflection necessary?`、Slide 35 `What are the drawbacks?`——问答成对出现，一页问+答（bullets），一页反问+答。

### 2.4 断言式/祈使式标题：稀有但全部用于"态度页"

用于表达立场、警告、收尾，占比 <5%：
- 《Introduction to Kotlin》Slide 21 `Unsafe Calls` 标题下第一条即断言：`Please, avoid using unsafe calls!`
- 《Reflection (JVM)》Slide 44 `Takeaways` 第一条 `If you have the opportunity to solve a problem without reflection, do it.`（命令句）；Slide 35 结尾 `Avoid using reflection if you don't really need it!`
- 《Build Systems》Slide 36 `Gradle can do so much more!`（感叹号收束范围声明）。

### 2.5 规律总结

- **话题式标题是常态**：页面内容是代码/图/列表时，标题只负责"贴标签"，因为结论由讲师口述。
- **断言式标题出现的唯一时机**：该页的全部目的就是给出一个判断（警告、建议、彩蛋）。此时页面往往极简（一两行）。
- 完整句不进标题时，就作为页面第一行 bullet 出现（如《Testing_》Slide 6 首条 `Testing demonstrates the presence of defects, but it does not prove their absence.`——整页最像"断言标题"的内容其实放在正文首行）。

---

## 3. 代码在幻灯片上的排版

### 3.1 长度：主流 5–15 行；两个极端均有明确修辞目的

- 最短：《Introduction to Kotlin》Slide 19 Elvis 示例核心只有 3 行函数体。
- 最长（常规上限）：《Build Systems》Slide 5 完整 pom.xml 约 19 行；Slide 19 自定义 Task + 控制台输出约 20 行。
- 超长（故意吓人）：《The JVM & the Kotlin Compiler》Slide 80 整页 IR 树转储 40+ 行，备注直言 `Look and be horrified by its complexity!`——超长代码的唯一合法用途是**展示复杂度本身**，且紧跟着 Slide 81–88 用 8 页把它逐块拆解。

### 3.2 高亮重点的手段（按使用频率）

1. **行尾注释当标注**（最高频）：把"这行为什么重要"写成行内注释——
   - 《Introduction to Kotlin》Slide 7：`b = a  // Reassigning to 'var' is okay`、`a = 4  // Error: Val cannot be reassigned`、`val c: Int  // Type required when no initializer is provided`。每行代码配一条教学注释，页面代码即自带讲解。
   - 《Build Systems》Slide 27：依赖声明 6 行每行前有 `// the string notation... // map notation + api...` 注释。
   - 《Reflection (JVM)》Slide 8：`dog.name = "Bob" // ERROR!!`（全文件出现 3 次 `ERROR!!`）。
2. **控制台输出作为独立区块**：错误和结果不用文字描述，直接贴真实输出——
   - 《Exceptions_》Slide 3 贴 `Exception in thread "main" java.lang.NullPointerException`。
   - 《Reflection (JVM)》Slide 9 贴完整 `IllegalAccessException` 堆栈。
   - 《Build Systems》Slide 8 贴 Gradle 真实报错（`Failed to calculate the value of task ':compileJava'...`）。
   - 《The JVM & the Kotlin Compiler》Slide 51/52 代码尾行注释 `// It compiles!`（出现 3 次）——用注释冒充输出，标记"这居然能通过编译"。
3. **成对/成组排列制造对比**：
   - 左右 VS：《Introduction to Kotlin》Slide 13 `if (a && b) { ... }  VS  if (a and b) { ... }`；《The JVM & the Kotlin Compiler》Slide 16 Interpreter vs JIT-compiler 中缝一个 `vs`。
   - 上下等价：《Introduction to Kotlin》Slide 10 两段代码中缝放一句 `is the same as`。
   - 三连简化：《Introduction to Kotlin》Slide 5 同一个 Hello World 给 3 个版本（带参数 → 无参数 → 表达式函数体），页尾一行 `Where is ";"???` 引导发现差异。
4. **删除线改写**：《Introduction to Kotlin》Slide 2 `More than a gazillion devices run ~~Java~~ Kotlin`——用删除线讲"历史事实的更正"，同一页还有 `Lactose free / Sugar free / Gluten free` 的玩笑 bullet，把语言特性宣传写成食品标签。
5. **伪代码/占位符**：《The JVM & the Kotlin Compiler》Slide 45–47 Kotlin 侧类型写作 `var a: ???? = foo()`——四个问号本身是悬念，下一页才揭晓 `String!`。
6. **ASCII 层级记号**：《Build Systems》Slide 10 用 `:> ` 缩进写出类型链 `class KotlinBuildScript :> abstract class ProjectDelegate :> interface Project`。

### 3.3 错误代码的展示法

错误永远以"**先给看似正确的代码 → 贴真实报错 → 给修法**"三段式出现，从不单独展示"错误代码清单"：
- 《Reflection (JVM)》Slide 8（改字段，标 `Reflection magic`）→ Slide 9（同代码 + IllegalAccessException 堆栈）→ Slide 10（加 `it.isAccessible = true` 两行，输出 `Bob`）。
- 《Build Systems》Slide 8（生成脚本 + Gradle 下载 JDK 失败报错）→ Slide 9（`jvmToolchain(8)` 改 17 + 备选写法，首行 `...so my JDK version is 17, and to fix the problem I do:`）。
- 《The JVM & the Kotlin Compiler》Slide 20–21（同一段 JIT 优化代码，`PI = 3.141592653589` 被改成 `PI = 4`，页上加一个 `Reflection` 箭头指出元凶）。

---

## 4. 演进式代码序列（本语料最核心的页面模式）

### 4.1 普遍程度：占内容页的一半以上

横向统计（按"同一代码/图/列表跨 ≥3 页、每页仅增量变化"计）：
- 《Reflection (JVM》：Dog 类面板重复 **10 页**（Slide 3, 5–7, 11–19 中的大多数），左侧代码变、右侧 Dog 类不变。
- 《The JVM & the Kotlin Compiler》：
  - GC 内存图动画 4 页（Slide 11–14，`Before GC / After GC / Current state` 三区，每页推进一轮回收）；
  - CFG 控制流图动画 **14 页**（Slide 54–67，整图完全不变，仅高亮节点移动；备注每页只写一句推进词：`Then it finds the while loop,` → `evaluates its condition,` → `and either enters the loop's body or exits the loop.`）；
  - FIR 树 6 页（Slide 34–39，同一棵树，每页高亮一个节点，备注逐一解释：`This is where parameter and return types are represented in the FIR.`）；
  - IR 树 8 页（Slide 81–88，同构）；resolved tree 7 页（Slide 72–78，同一行代码 + 每页新增一条标注）；
  - 编译器流水线大图重复 **11 页**（Slide 24, 26, 27, 33, 41, 43, 68, 70, 71, 89, 90）——每进入一个新阶段就回到这张图。
- 《Testing_》：累积列表 6+4 页（见 §6）。
- 《Build Systems》Slide 15–16：任务依赖图 2 页，唯一差异是命令 `./gradlew build` → `./gradlew build -x test` + 新增一行说明 `Build without running tests.`。
- 《Introduction to Kotlin》Slide 5（Hello World 三连）、Slide 24（`run({...})` → `run {...}` 好/坏对照）。

### 4.2 改动的标注方式：三种

1. **不改文本，只改高亮**（最常见）：页面文本逐字重复，差异全部由颜色/框选承担（提取文本因此看起来完全相同）。备注承担"这次看哪里"的指引——《The JVM & the Kotlin Compiler》Slide 55–66 十二页文本全同，备注各只讲一步。
2. **文本增量**：只新增一行/一个标签，旧内容原位保留——《The JVM & the Kotlin Compiler》Slide 46 在 `????` 后新增 `String!`，Slide 47 再新增 `String! is the type range: [String..String?]`；Slide 62–67 在 CFG 图上逐页点亮 `true/false` 边标记和 `x is A` 结论。
3. **一句话锚定差异**：在页面上明说改了什么——《Build Systems》Slide 16 的新增行 `Build without running tests.`；Slide 9 的 `But usually instead of jvmToolchain you will see:`。

### 4.3 序列的收束

序列结束时要么给出"最终成品+结论标签"（《Reflection (JVM)》Slide 10 输出 `Bob`），要么进入下一节前用一张全景图定格（《The JVM & the Kotlin Compiler》Slide 67 在 CFG 动画末页新增 `x is A` 得出 smart cast 结论）。

### 4.4 通用原则

- 讲"过程"（执行、推导、优化、报错）必须用序列，讲"状态"才用单页。
- 序列内所有页面**布局像素级一致**，只允许一个变量变化；观众的眼睛自然落在变化处——这就是这些课件不需要动画效果也能"动"的原因（把动画拆成帧）。
- 序列长度可以很长（14 页）而不显冗余，因为每页认知负荷≈0（只看一个高亮）；但备注必须逐页写推进词，否则序列失去讲解节奏。

---

## 5. 图表使用

### 5.1 哪些概念配图（按出现场景归类）

| 概念类型 | 图的形式 | 证据 |
|---|---|---|
| 类型/继承层次 | 树状层次图 | 《Exceptions_》Slide 7（Java 异常层次，标题就是 👀）；《Build Systems》Slide 10 用 `:>` 文本链 |
| 编译/执行流水线 | 分阶段框图 | 《The JVM & the Kotlin Compiler》Slide 5（JVM 内部）、Slide 23–24（编译器三大件→全管线），重复 11 次作导航地图 |
| 内存模型 | 分区框图 + 对象块 | 同上 Slide 6（堆/非堆）、9（Young/Old 里的 A–E 对象）、10（Eden/S0/S1/Tenured 比例） |
| 动态过程 | 同图多帧动画 | 同上 Slide 11–14（GC）、54–67（CFG 游标） |
| 语法树/中间表示 | 节点-箭头树 | 同上 Slide 25（Source→tokens→CST→AST 四联图）、29–39（PSI/FIR）、80–88（IR） |
| 统计规律 | 坐标曲线 | 同上 Slide 7（对象寿命分布曲线，仅两行文字） |
| 依赖/任务关系 | 有向无环图 | 《Build Systems》Slide 15–16（build→test→compile→jar 层级） |
| 真实界面 | 截图 | 《Build Systems》Slide 7（IDEA 新建项目向导）；《Reflection (JVM)》Slide 28、69（PSI viewer / 诊断截图） |

### 5.2 图 + 文字的配合规则

- **图页正文趋近于零，解释全部进备注**：《The JVM & the Kotlin Compiler》Slide 9 图上只有 `A B C D E / Stack / Young generation / Old generation` 等标签，备注却完整叙述"哪些对象可达、E 为什么死、C 为什么跟着死"。
- **图内标签即讲稿提纲**：CFG 图的节点文字就是备注叙述的脚本（`Enter function bar` → `Evaluate loop condition` → ...），二者一一对应。
- **图上允许加"讲台用语"**：《Reflection (JVM)》Slide 20 的字节码旁配 `Reflection magic`；Slide 8–10 的输出区标 `Reflection magic`——非正式标签降低距离感。
- **一张图讲一个变量**：曲线图（Slide 7）配两行文字讲一个假设；内存图每页只讲一代（young/old）；多变量概念拆成多张图而不是一张复合大图。

---

## 6. 列表 vs 叙事的分工

### 6.1 Bullet 页的四个合法时机

1. **概念属性枚举**（是什么/有什么）：《Introduction to Kotlin》Slide 2（Why Kotlin? 6 条）；《Build Systems》Slide 4/6（Maven/Gradle 特性各 6–8 条）。
2. **正反清单**：《Exceptions_》Slide 2 的 `Why use exceptions: 3条` + `Do NOT use exceptions for: 2条`；《Reflection (JVM)》Slide 34（why）→ 35（drawbacks）对页。
3. **工具/选项目录**：《Backend Development Basics》Slide 29（Ktor 插件 7 条）、Slide 56（部署选项）；《The JVM & the Kotlin Compiler》Slide 102（流行编译器插件 6 条）。
4. **收尾总结**：《Build Systems》Slide 35 Summary 6 条；《Reflection (JVM)》Slide 44 Takeaways 4 条。

### 6.2 累积列表（progressive list）：列表被拆成逐页生长的序列

《Testing_》Slide 7–12：`Testing: types` 连续六页，每页**只新增一行**（Functional → +Load → +Stress → +Configuration → +Regression → +Others），备注每页只解释新增的那一行。Slide 13–16 用同样手法讲 levels（Unit → +Integration → +System → +Acceptance）。这是"逐项揭示"（one-bullet-at-a-time）在静态讲义上的等价物：**观众永远看到的是"到目前为止的完整清单 + 刚刚出现的高亮行"**。

### 6.3 页面类型的节奏配比（一门课的典型编排）

概念 bullet 页 → 代码页（无 bullet，纯代码）→ 结果/报错页（或同页下半区）→ 图页 → 下一概念。观察：
- 《Introduction to Kotlin》Slide 6–24 几乎全是"标题 + 代码 + 2–4 行说明"的代码页，纯 bullet 页只有 Slide 2 一张——语言入门课以代码页为主体。
- 《Testing_》前 16 页几乎全是 bullet/列表页（概念课），后 7 页转入代码页（JUnit 实操）——概念课先 bullet 后代码。
- 《The JVM & the Kotlin Compiler》前 22 页概念+图，中段大规模代码/树序列，结尾 Slide 102 插一张目录页收尾。
- 单句页/纯图页作为"呼吸点"穿插在密集段之间（如《Introduction to Kotlin》Slide 3 Logo、Slide 4 单句页出现在 Slide 2 大清单之后）。

---

## 7. 短课 vs 长课的结构差异

### 7.1 《Exceptions_》（9 页）——短课策略：零导航开销，每页都是"主战场"

- 没有目录页、没有小结页、没有分隔页；Slide 1 标题页 → Slide 2–3 用 `What? Why?` / `How?` 两页完成全部框架 → Slide 4–8 五页全是代码+输出 → Slide 9 谢幕。
- 每页信息密度显著更高（Slide 6 一页塞进 4 个 catch + finally + 两条策略说明），因为页数预算小，"一页一个动作"的规则放宽为"一页一个小节"。
- 备注反而更长：Slide 2 的备注含 6 条外链（Effective Java、Elizarov 博客、MIT 教程、c2 wiki…）——短课把"延伸阅读"全部压进备注而非页面。

### 7.2 《The JVM & the Kotlin Compiler》（103 页）——长课策略：用重复结构替代导航设施

- 同样**没有议程页**。定位感完全由两个机制提供：①冒号分级标题（`Kotlin compiler: ...`、`Java interoperability: ...`）；②**地图图反复回访**——编译器流水线大图在 11 个节点重现，每次回来时高亮当前阶段，等于内置"你在这里"指示器。
- 大量使用低成本"翻页帧"（CFG 14 页、IR 8 页）拉长讲解时间而不增加备课复杂度（一图做一次，改高亮即可）。
- 收尾有明确的三段式：Slide 91–101（KLib/插件专题，"更多可能性"）→ Slide 102（流行插件目录页）→ Slide 103 Thanks。中间没有任何休息页——节奏控制交给翻页帧序列，而非插入停顿页。
- 《Build Systems》（37 页，中长课）同样结尾双页：Slide 35 Summary（6 条要点回顾）+ Slide 36 `Gradle can do so much more!`（未覆盖主题清单=范围声明）。

### 7.3 结论

- 短课：密度换页数；开场两页（What/Why + How）代替全部导航；备注承担全部外延。
- 长课：页数换密度；用"回访地图 + 分级标题"代替议程页；用翻页帧把一个复杂对象拆成可讲 10 分钟的序列；结尾固定 Summary/范围声明/Thanks 三件套。
- 共同点：两档课都**不做**课中议程回顾和休息页——这是这套语料最反直觉的一致决定。

---

## 8. 章节分隔与导航

- **开场模板**：`What? Why?` → `How?` 双页出现在《Exceptions_》Slide 2–3 与《Build Systems》Slide 2–3（grep 证实 `What? Why?` 还存在于未细读的 Generics.md），是该系列固定起手式。
- **节内导航**：冒号标题连排（§2.2）+ 重复地图图（§7.2）。
- **转场页**：无专门转场页；转场由"标题前缀更换"完成（如《Reflection (JVM)》从 Slide 22 `Reflection in Kotlin: under the hood` 起切换前缀，读者即刻知道换了战场）。
- **收尾三件套**：资源页（`When in doubt → kotlinlang.org`，《Introduction to Kotlin》Slide 25；Resources，《Backend Development Basics》Slide 57）/ Summary-Takeaways / Thanks 品牌页（全系列 13 门课中 12 门以 `Thanks!` 页收尾，仅 Backend 例外）。
- **范围声明页**：《Build Systems》Slide 36 列出"今天不讲的"（Caching、Multi-module、publishing…）——主动划定边界，防止受众期待溢出。

---

## 9. 强调与标记（视觉修辞清单）

| 手段 | 用途 | 证据 |
|---|---|---|
| 删除线 ~~X~~ | 更正历史/取代关系 | 《Introduction to Kotlin》Slide 2 `run ~~Java~~ Kotlin` |
| 👀 | "注意看这个图/事实" | 《Introduction to Kotlin》Slide 2 `Android 👀`；《Reflection (JVM)》Slide 7 整页标题 |
| `// ERROR!!` / `// It compiles!` | 反直觉结果标记 | 《Reflection (JVM)》Slide 8；《The JVM & the Kotlin Compiler》Slide 51–52 |
| `VS` / `vs` | 并排对比 | 《Introduction to Kotlin》Slide 13；《The JVM & the Kotlin Compiler》Slide 16 |
| `is the same as` | 等价声明 | 《Introduction to Kotlin》Slide 10 |
| `????` 占位 | 制造悬念，下页揭晓 | 《The JVM & the Kotlin Compiler》Slide 45–47 |
| `Reflection magic` | 给"黑科技"命名 | 《Reflection (JVM)》Slide 8–10 |
| 感叹号+断言 | 行为劝告 | `Please, avoid using unsafe calls!`（Intro 21）；`Avoid using reflection...!`（Reflection 35） |
| 玩笑 bullet | 注意力急救 | Intro Slide 2 `Lactose free / Sugar free / Gluten free`；Reflection Slide 34 `It's just really cool!`；备注 `Look and be horrified by its complexity!`（JVM 80） |
| `:)` / `;^)` | 冲淡报错演示的紧张感 | JVM Slide 52 `error("YOLO! :)")`；Exceptions Slide 6 `println("NPE ;^)")` |

修辞原则：**所有花活只用于两类时刻——需要突然提高注意力（图、反直觉结果）或降低压力（报错、警告）。** 常规概念页零装饰。

---

## 10. 课件页面设计速查表（可执行规则）

**密度**
1. 单页正文 ≤ 12 行（bullet 或代码行总数）；概念页目标 5–8 行。
2. 代码块常规 5–15 行；>20 行仅当目的是"展示复杂度本身"，且后续必须逐块拆解。
3. 一页只做一件事（一个概念/一段代码/一个结果/一步变化）；要用"和"描述的页必须拆。
4. 每门课保留少量 1–3 行"单句页/纯图页"作为节奏呼吸点，插在密集段之间。

**标题**
5. 默认 2–4 词名词短语；不用完整句做常规标题。
6. 用冒号做层级：`大主题: 子话题`；同一前缀连排即成一节（这同时就是你的导航系统）。
7. 疑问句标题只用于：节入口（What? Why? / How?）和追问链（一页一问，答案在下页）。
8. 断言式/祈使式标题配极简页面（≤2 行），仅用于警告、建议、彩蛋。
9. 结论性完整句优先放正文首行 bullet，而不是改造成标题。

**代码**
10. 每行关键代码配一条行尾教学注释（`// 为什么重要`），让代码自带讲解。
11. 错误三段式：看似正确的代码 → 真实报错原文（独立区块）→ 修法；不要孤立罗列"错误示例"。
12. 对比用并排（VS）或上下（is the same as）成组出现，同页只对比一个维度。
13. 真实控制台输出/报错直接粘贴，不做转述。

**演进序列**
14. 讲过程必用序列：同一面板跨多页，每页只变一个东西（高亮/一行/一个标签），布局保持像素级一致。
15. 序列可以长（5–14 页）；每页备注只写一句推进词，推进词连读应是完整叙事。
16. 序列结束页必须给出成品/结论标签（正确输出、最终结论）。

**列表**
17. Bullet 只用于：属性枚举、正反清单、工具目录、总结页——四种之一，其余场合用代码页或图页。
18. 清单 >4 项且需逐项讲时，用"累积列表"：每页加一行、其余原样重印，备注只讲新增行。
19. 正反成对出现（Why 用 X → Drawbacks of X），一页正、一页反。

**图**
20. 层次→树图；流水线→阶段框图；内存→分区图；过程→同图多帧；语法/IR→节点树；统计→曲线；工具→截图。凡"结构"和"过程"类概念优先图解。
21. 图页正文趋近于零；图内标签=讲稿提纲；解释写进备注。一张图只讲一个变量。

**结构**
22. 开场固定两页：`What? Why?` → `How?`。
23. 长课（>40 页）设一张"地图图"，每进入新阶段回访一次并高亮当前位置（替代议程页）。
24. 收尾三件套：资源链接页 / Summary（≤6 条）/ Thanks 页。
25. 加一张"范围声明页"列出本课不讲的内容，管理预期。

**修辞**
26. 删除线用于更正/取代；👀 用于"看这里"；`// It compiles!`/`ERROR!!` 用于反直觉结果；玩笑每课 1–3 处，只放在高张力时刻。
27. 备注=讲稿：重复页的备注只写增量；外链与延伸阅读放备注不放页面；页面给眼睛，备注给耳朵。

**红线（从反面语料得出）**
28. 不要双层嵌套 bullet + 12 行以上的"文档式"页面（Backend Development Basics 的做法与全系列相反，且其代价是讲稿缺失）。
29. 不要在单页内混合多个概念、多段无关代码、或代码+大段理论。
30. 不要用连续多页"全新内容"页轰炸——长内容必须组织成可回访的锚点（图/前缀标题/固定面板）+增量帧。

---

## 附：本课语料的页面类型分布（人工归档估计）

| 页型 | 占比 | 说明 |
|---|---|---|
| 标题+代码+少量说明 | ~35% | 语言/工具课主体 |
| 演进序列帧（重复面板+单点变化） | ~30% | 长课主体，单页认知负荷最低 |
| 概念 bullet 页 | ~15% | 定义、正反清单、目录 |
| 纯图/截图页 | ~10% | 结构与过程可视化 |
| 单句页/悬念页/表情页 | ~5% | 节奏与注意力工具 |
| 导航与收尾页（What-Why/How、Summary、Thanks、资源） | ~5% | 固定模板复用 |
