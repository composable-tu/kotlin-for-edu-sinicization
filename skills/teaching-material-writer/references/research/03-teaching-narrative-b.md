# 03 · 教学叙事研究 B 篇：困难概念与高级主题怎么教

**语料**：三份国际一流大学编程课程 PPT 的讲师备注（speaker notes）全文精读。

| 简称 | 文件 | 页数/含备注页数 | 主题 |
|---|---|---|---|
| 《OOP》 | `sources/pptx-extracts/Object-Oriented Programming.md` | 42 / 35 | 面向对象（封装/继承/多态/抽象） |
| 《并发》 | `sources/pptx-extracts/Parallel & Concurrent Programming.md` | 53 / 48 | 并行与并发、锁、内存模型 |
| 《异步》 | `sources/pptx-extracts/Asynchronous Programming in Kotlin.md` | 125 / 111 | 异步编程、协程 |

**方法**：逐页精读 `[讲师备注]`，识别"教授写给讲师的口头剧本"中的可迁移模式，每条附英文原文证据（文件+Slide 编号），并去编程化提炼为任何学科可套用的通用形式。

---

## 一、抽象概念的可视化 / 具象化策略

并发、异步、内存模型"看不见摸不着"，这三套备注展示了八种把抽象钉在地面上的手段。

### 模式 1.1 「图纸—实物」类比：给"抽象规格 vs 具体实例"找实物对应

**通用形式**：当概念成对出现（模板/实例、规则/案例、理论/现象），用"图纸 vs 按图纸盖的房子"这类制造类隐喻一次性锚定两者关系。

> "A class is like a blueprint, and by following it you can build a representative of that class, i.e. a specific object."
> —— 《OOP》Slide 3 备注

### 模式 1.2 「机器黑箱」类比：用复杂机械解释"隐藏实现"

**通用形式**：讲"封装/接口/模块化"时，选一个学生日常使用但绝不了解内部构造的机器（汽车），把"你只需按按钮，内部流程与你无关"具象化。

> "The car's engine can be started, and for this to happen some routines should be followed (e.g. check the fuel level, battery voltage, etc.). But the Car type can provide only the startEngine() method and hide the execution of all these routines from the outside world."
> —— 《OOP》Slide 6 备注

同一个 Car 例子在 Slide 5（abstraction）、Slide 9（inheritance：Vehicle 基类）、Slide 10（composition：Every vehicle has an engine）被反复调用——**一个隐喻域贯穿四个概念**，认知负担只付一次。

### 模式 1.3 时间轴泳道「逐帧动画」：把不可见的并发过程拍成电影

**通用形式**：多个并行主体交互的过程，用"横轴=时间、纵轴=各主体泳道"的图，**拆成连续多页幻灯片逐帧播放**，每页只新增一个事件；最后一页给出"全景真实图"和一句总结性的落点句。备注只负责口头配音。

《异步》Slides 45–52 连续 8 页同题《How is this actually better than threads?》：Main / IO / Default 三条泳道，每页只加一步（post → fetch → blocked → done → process → show → "Not blocked"）。备注逐帧配音：

> Slide 47："It switches its context to IO to fetch some data in a blocking/waiting way."
> Slide 52（落点句）："What was the point of all of this? While all of this was happening, the user could have been interacting with the UI because at no point was the main execution thread waiting for something or synchronizing with anything."
> —— 《异步》Slides 45–52 备注

随后 Slide 53 翻到"现实全景"：**先放慢动作，再给真实速度**——"In reality, the picture would look more like this."（Slide 53 备注）

同款手法：《异步》Slides 6–9（单线程执行 → What we want vs What we get → 多线程版）用时间线揭示"阻塞"；Slides 65–76 用 12 页逐帧播放一个异常在任务树中的传播路径。

### 模式 1.4 复杂图表的「分层增量构建」：一图四页，每页只加一种边

**通用形式**：复杂的形式化图（关系图、流图、因果图）不要一页抛出；同一张底图连续多页，每页只新增一类元素并命名它。

《并发》Slides 40–43 讲 happens-before 关系：Slide 40 只画 po（program-order）和 rf（reads-from）；Slide 41 加 sw（synchronizes-with）；Slide 42 加 hb = (po ∪ sw)+；Slide 43 用完整图推出结论。备注每页只解释新加的边：

> "Synchronizes with indicates a relation that appears when two operations force threads to synchronize."（Slide 41）
> "Happens before is a transitive closure of the program order and synchronizes with relations."（Slide 42）
> —— 《并发》Slides 40–43 备注

### 模式 1.5 「新概念 = 已知概念的变体」：用旧知搭桥 + 只讲增量

**通用形式**：每一个新概念出现时，备注第一句话就是"它像你已经会的 X，区别只有一点"，然后**只讲那一点区别**。

> "Continuation<in T> ∼ Generic callback" —— 《异步》Slide 20（幻灯片原文）
> "You can think of context like Map<Key<Element>, Element>" —— 《异步》Slide 30（幻灯片原文）
> "Channel is like BlockingQueue, but with suspending calls instead of blocking ones. Blocking put → suspending send. Blocking take → suspending receive." —— 《异步》Slide 93（幻灯片原文）
> "There is a phrase by Robin Milner: 'Well typed programs cannot go wrong.' … JMM guarantees a similar concept: 'Well-synchronized programs have simple interleaving semantics.'" —— 《并发》Slide 36 备注（把内存模型保证类比到学生已学的类型系统保证）

### 模式 1.6 拟人化与角色对话：让抽象实体开口说话

**通用形式**：状态机、调度器、任务等无生命实体，通过示例代码里的输出字符串获得人格和情绪，形成"角色对话剧"，学生通过记住角色性格记住状态语义。

《异步》Slides 88–91 取消机制的四个版本中，代码输出全是台词：

> `println("job: I'm sleeping $it...")` / `println("main: I'm tired of waiting!")` / `println("main: Now I can quit.")` / `println("job: I won't give up $it")`
> —— 《异步》Slides 88–89

异常传播动画里，任务间的对话直接写在图上：

> "Check this out"（Slide 67）/ "No, thank you"（Slide 68，SupervisorJob 拒绝接管子任务异常）
> —— 《异步》Slides 65–76

### 模式 1.7 「反直觉输出清单」：列出全部可能结果制造惊奇

**通用形式**：理论（内存模型/非确定性）讲不动时，先亮出"这段代码所有可能的输出"，让学生对其中一两个"不可能"的结果震惊，再用理论解释它。

> 幻灯片列出 "Possible outputs: 0, 0 / 0, 1 / 1, 1 / 1, 0"，备注逐个解释，最后聚焦反直觉项：
> "Though it looks counterintuitive, there are a couple of reasons we may get the last of these outputs."
> —— 《并发》Slide 33

### 模式 1.8 物理隐喻：给不可见的硬件行为造一个心智模型

**通用形式**：涉及底层机制（缓存、传播延迟、硬件）时，明确说"可以把它想成……"，给一个虽不严格但可推理的模型，并坦白它只是近似。

> "Changes do not get written to RAM instantly. They first go to the cache, which can be thought of as a queue of changes to RAM. … The problem is that only the small first portion of the queue is checked."
> —— 《并发》Slide 33 备注

### 模式 1.9 虚拟状态的诚实标注

**通用形式**：图里画出"其实不存在的状态"时，明确告诉学生为什么画虚框——这本身就是一次建模思维教学。

> "The Running box is dashed, because we can think of it as a virtual state. It would make no sense to have a separate Thread.state for 'Running', because by the time you got this information, there's a good chance that the scheduler would already have moved the thread back to Runnable."
> —— 《并发》Slide 15 备注

---

## 二、错误优先教学：先看错的，再引出对的

三套语料中"错误优先"不仅是局部技巧，在《异步》中升级为**整门课的组织原则**。

### 模式 2.1 「反模式阶梯」：全课级错误驱动结构

《异步》前 15 页是一座反模式博物馆，每个方案都先被完整展示、再被亲手拆掉：

1. 单线程阻塞（Slides 6–8）："What we get … blocked"；
2. 多线程（Slide 9）："Now that we have more threads, we would expect to be able to do more work. Instead, we're faced with new blocks"；
3. 回调/CPS（Slides 11–12）："The } ladder is the Stairway to Heaven Highway to 'Callback Hell'"；
4. Promise（Slides 13–14）："Error handling can be complicated … these wrappers are objects and take up considerable memory"；
5. **直到 Slide 15 才亮出答案 suspend**："This looks and feels sequential, allowing you to focus on the logic of your code."

**通用形式**：正确方案登场前，让它要取代的每一代旧方案都以"完整代码 + 具体缺陷清单"的形式展览一遍；学生的求知欲由"每个方案怎么失败"接力驱动，而不是由大纲驱动。

### 模式 2.2 报错原文直接上幻灯片：错误信息是免费教具

**通用形式**：把编译器/运行时的报错原文原样放进 slide，让学生先在课堂见过它。

> `Cannot access 'poop': it is invisible (private in a supertype) in 'MyCat'` —— 《OOP》Slide 20；备注随后给最小修复："To fix this snippet, we can update the poop() signature and replace the private modifier with protected"
> `Exception in thread "main" java.lang.OutOfMemoryError: unable to create native thread: possibly out of memory or process/resource limits reached` —— 《异步》Slide 58；备注："When we do this, we encounter a problem: On most machines, it is impossible to create a million threads at the same time."

### 模式 2.3 「WRONG!」自我纠错：讲师先犯学生必犯的错

**通用形式**：写出"看起来对"的代码，盖上大大的 WRONG，再解释为什么——精确命中学生将来的第一反应。

> Slide 54 给出看似正确的百万协程代码；Slide 55 同一段代码标红 "WRONG!" 并补一句规则："The default behavior is sequential, you have to ask for concurrency."
> —— 《异步》Slides 54–55

配套的还有命名即警告的函数签名：`suspend fun CoroutineScope.dontDoThisPlease()`（《异步》Slide 85）。

### 模式 2.4 先现象、后理论、再修复（三明治）

内存模型一段是标准范例：Slide 33–35 只展示"无保证"的诡异现象（乱序输出、死循环挂起）→ Slides 36–45 建立理论（DRF-SC、happens-before）→ Slide 38–39 用 `@Volatile` 修复第一页的例子。**同一个例子贯穿"现象—理论—修复"三段**。

修复后还回头补一刀，防止学生过度泛化：

> "The @Volatile annotation would not fix the bug in the Counter class example … reading, incrementing, and writing are still non-trivial operations that can interleave despite the happens before relation."
> —— 《并发》Slide 46 备注

### 模式 2.5 反模式的"复活"回访

Slide 28 埋下的复杂示例，在 Slide 77 被重新拖出来"验尸"，标题就叫 "Now you see it"：

> "This exception handler is useless if this code is not inside a SupervisorJob."（幻灯片原文）
> 备注："Now that we know how exceptions are handled inside coroutines, we can say that in our example ExceptionHandler might be useless…"
> —— 《异步》Slides 28 / 77

《异步》Slide 83–84 同款：先用 GlobalScope 写出泄漏版本（"Any downloadContent or processContent crash results in a coroutines leak"），下一页用 coroutineScope 重写。

---

## 三、渐进式复杂度爬坡：125 页《异步》课的认知阶梯解剖

### 3.1 整体骨架（阶段表）

| 阶段 | Slides | 内容 | 认知动作 |
|---|---|---|---|
| 0 | 2–4 | 议程 → 回顾线程状态图 → 痛点清单 | 激活旧知 + 建立需求 |
| 1 | 5–9 | 最小例子 postItem：单线程→想要→实际→多线程 | 时间线可视化痛点 |
| 2 | 11–15 | CPS→Promise→suspend，三代方案对比 | 反模式阶梯 |
| 3 | 16–18 | 协程 1958–2017 历史 | 合法性铺垫 |
| 4 | 20–25 | 编译器如何变换 suspend（状态机） | 第一次"开盖"（简化版） |
| 5 | 27–28 | runBlocking 最小用法 → 百万协程复杂全景 | **全景先行，承诺拆解** |
| 6 | 29–44 | scope→context→Job→states→dispatchers→调度器内部 | 部件逐个讲解 |
| 7 | 45–53 | 泳道动画：到底比线程好在哪 | 回收动机（payoff） |
| 8 | 54–59 | 协程 vs 线程对照实验 | 对照实验 |
| 9 | 60–91 | 线程切换坑→Mutex→异常（12页动画）→结构化并发→取消 | 危险与治理 |
| 10 | 92–98 | channels：入门→素数筛→fan-in/out | 递进案例 |
| 11 | 100–124 | sequences→二次开盖→async/await→builder 动物园→Android | 延伸与落地 |

### 模式 3.2 「痛点—解药」链：每个新机制都是上一个痛点的药

**通用形式**：绝不"因为大纲有 X 所以讲 X"；每个新概念出现前 1–2 页必先制造一个 X 才能解决的痛。

- Mutex 的引入：Slide 60 先讲"thread switching problem"（"we do not know which thread exactly will take our suspending function"），Slide 61 用 russianRoulette 展示持锁挂起会炸，Slide 62 才给 Mutex。
- CoroutineScope 的引入：Slide 25 故意从普通代码调 suspend 函数触发编译错误，备注顺势解释为什么需要环境：

> "In order for that to be possible, there has to be that 'something else', which comes from the environment where the suspend call is being made. That environment is the CoroutineScope interface."
> —— 《异步》Slide 25 备注

### 模式 3.3 「一例贯穿」（golden thread）

postItem 三函数例子从 Slide 5 出现，Slide 15 用 suspend 重写，Slides 20–22 拿它做编译器变换，Slide 24 "Now we can finally post items without blocking the execution thread!"，Slides 103–106 拿同一函数做第二次深度剖析（"Remember this code?"）。**学生全程只需理解一个业务场景，复杂度全部加在机制层**。

### 模式 3.4 「全景先行 + 承诺逐步拆解」

Slide 28 一次性甩出带 context、exception handler、LAZY 启动的百万协程完整代码，随后幻灯片原文写明合同：

> "Now we are going to cover all of this step by step." —— 《异步》Slide 28

这是典型的 advance organizer：先给全貌让学生知道终点，再逐一还债。

### 模式 3.5 「同例多轮微调」：每轮只改一个变量

取消机制四连页（Slides 88–91）用同一个 job 示例：88 版不听取消（阻塞感知不到）→ 89 版捕获异常继续跑（"which is not good design – though it may sometimes be useful"）→ 90 版用 isActive 主动检查 → 91 版 NonCancellable 特例。**一次只动一个维度，失败模式逐个暴露**。

### 模式 3.6 「二次下潜」：黑箱讲一遍，开盖再讲一遍

Slides 20–23 先给"simplified version"的状态机（备注明说 "This is a simplified representation of what is happening. We'll go into more detail later in this lecture."），Slides 103–106 在学生掌握全部上层概念后，回到同一函数给出接近真实字节码的完整版本。**同一个底层机制按两种分辨率各讲一次，间隔 80 页**。

### 模式 3.7 难度排序明示

并发课对三种同步机制的处理同样自觉：

> "Synchronization mechanisms help us fix problems that arise in a mutable shared state environment. We are going to cover 3 of them in order of their increasing difficulty." —— 《并发》Slide 21 备注

并把最危险的放到最后、贴上警告标签："Atomics, which work directly with shared memory (DANGER ZONE)"（《并发》Slide 21 幻灯片原文）。

---

## 四、OOP 课的教法：经典难点怎么引入

### 4.1 概念对用「平行句式」对比

最易混淆的 abstraction vs encapsulation，幻灯片用一组严格平行的句子：

> "Abstraction is about what others see and how they interact with an object. / Encapsulation is about how an object operates internally and how it responds to messages." —— 《OOP》Slide 7

备注再补承认混淆 + 各自一句话概括："What is the difference between abstraction and encapsulation? It seems they are similar and highly related."（Slide 7 备注）

**通用形式**：两个易混概念，用"X is about A / Y is about B"的同构句式并排写，差异自然浮出。

### 4.2 「一域一例」：不同概念用不同动物

- 抽象/封装/继承/组合：Car → Vehicle → Engine（成人世界的机器隐喻）
- 子类型的人性化：Eleanor/Nate（见下）
- 类型层级：Polygon→Quadrangle→Rectangle→Square 几何图谱（Slide 12，配 Diamond Problem 伪代码）
- 接口 vs 抽象类、可见性修饰符、模板方法：Cat 家族（RegularCat/SickCat/MyCat/DomesticCat），Slides 18–22
- 多态：Dog/Cat + DomesticAnimal（Slide 23）

personified 子类型讲解是全语料最生动的段落：

> "Eleanor – A student, a woman, a beer enthusiast, and the reigning UFC champion. Nate – A developer, a man, an anime lover, and a recreational swimmer." … "When Eleanor gets her degree, she will stop being a student and she may cease to exhibit the associated behaviors, but her overall identity will not change and the behaviors associated with her other properties will be unaffected." —— 《OOP》Slide 11

**通用形式**："一个实体同时属于多个类目，退出某个类目不改变其本体"——用真实人物的多重身份讲角色/类型/身份的分离。

### 4.3 词源开讲

> "Polymorphism = poly (many) + morphē (form)." —— 《OOP》Slide 13 备注

### 4.4 权威引用定调

> "Design and document for inheritance, or else prohibit it." (Joshua Bloch, Effective Java, Item 19) —— 《OOP》Slide 21 备注

### 4.5 诚实教学：主动拆自家概念的台

> "Inheritance is often redundant and can be replaced with composition." —— 《OOP》Slide 10 幻灯片原文
> 备注："In most scenarios, inheritance design can be replaced with composition. Composition can be captured with the phrase 'one object is a part of another object'."

讲单例时两面都给参考文献（Singletons are evil / Singletons are good，Slide 39）。**通用形式**：教工具的同时教它的声誉争议，学生学到的是判断力而非教条。

### 4.6 复杂度安抚：在陡坡处说"你其实不用全会"

> "(optional): If you're feeling like constructors and init blocks seem complicated, you're in luck. In most situations you won't need all these features. To quote Andrey Breslav … (Audience): What if I need more than one constructor? (Andrey): You don't :)" —— 《OOP》Slide 15 备注

**通用形式**：在语法细节最密的地方，备注提醒讲师停下来告诉学生"这段日常用不到"，并用一句权威幽默卸压。

### 4.7 苏格拉底式提问写进备注

> "Why do you think this is the case? Well, one possible answer is that if a developer wants a class to be used by other developers, they should design the class properly and mark it with the open keyword explicitly." —— 《OOP》Slide 21 备注
> "Why do we even need CoroutineScope if it only has one property – CoroutineContext? Couldn't we achieve the same result by just using CoroutineContext?" —— 《异步》Slide 30 备注

**通用形式**：备注明确写出"在这里停下来向学生抛这个问题"，并给出期望答案——把课堂互动点固化成剧本。

---

## 五、对比教学法

### 5.1 专用「X vs Y」页 + 视觉并列

- 《OOP》Slide 18：interface vs abstract class，幻灯片直接印着 "VS"
- 《OOP》Slide 38：object expression vs lambda，印着 "vs"
- 《并发》Slide 2–3：parallel vs concurrent（配图），幻灯片点出四象限："It is possible to have parallelism without concurrency, and concurrency without parallelism."；备注展开三种组合："A parallel application / A concurrent application / A parallel and concurrent application"
- 《并发》Slide 4：processes vs threads；Slide 5：preemptive vs cooperative；Slide 10：run vs start（"Never call Thread.run()!"）

### 5.2 「差异教学」：新概念 = 旧概念的同构表格，只讲 delta

Job（协程任务）的状态表刻意复刻 Thread 状态表的结构（state × flags），备注只讲差别：

> "Job has similar states to Thread. The major difference is that Job has no blocked state, since coroutines suspend instead of blocking. Also, both the Cancelled and Completed states are accompanied by their '-ing' analog. These exist because the coroutine finishes only when all of its children finish." —— 《异步》Slide 33 备注

同样手法用于取消语义："just like how code in a thread may be unaware that somebody is trying to interrupt that thread"（《异步》Slide 88 备注）。

**通用形式**：教新机制时，把它与已学机制放进同一张表格/同一张图，相同项快速带过，**把课堂时间全部花在差异行上**。

### 5.3 「同题双跑」：对照实验

百万协程 vs 百万线程：Slides 54–59 同一段逻辑分别用 launch/delay 与 thread/sleep 跑（备注逐行说明替换关系："We replace launch… with thread… We replace the suspending delay with the thread's sleep."），协程版全部打印，线程版当场 OOM。结论句落在备注："The main takeaway here is that coroutines are not threads. They help solve similar problems, but overall they are built differently."（《异步》Slide 59 备注）

### 5.4 对比的时机与克制的结论

对比页从不当第一个知识点出现——总是先让学生分别掌握两端，再来对比；且对比结论克制，不做价值碾压（"similar problems, built differently"，而非"线程不好"）。C# async/await 一页同时完成跨国对比与致敬：

> "The C# approach was a great inspiration for the Kotlin team when they were designing coroutines, as it was for Dart, TS, JS, Python, Rust, C++..." —— 《异步》Slide 115

---

## 六、动机页设计：难的课怎么开场

### 6.1 痛点清单开场（需求驱动）

《异步》Slide 4 一页五条痛点："Threads aren't cheap" / "Threads aren't always available. Some platforms, such as JavaScript, do not even support them." / "Working with threads is hard. Bugs in threads (which are extremely difficult to debug), race conditions, and deadlocks are common problems…"。备注为每条展开具体机制。

### 6.2 「先立靶再射」：替学生说出显然解法，再推翻

> "There's a seemingly obvious solution to the problem of having a considerable number of threads that remain blocked… we can just increase the number of threads… This does not always work, however, because there is a limit to the number of threads an application can use." —— 《异步》Slide 4 备注

**通用形式**：预演学生心中的"那为什么不直接……"，先替他们说出口，再给出它失效的量化原因（线程数上限、上下文切换成本）。

### 6.3 历史纵深：难概念不是新潮而是回归

> "Melvin Conway coined the term 'coroutine' in 1958 for his assembly program." / "Go'09, C#'12, Kotlin'17, C++'20, OpenJDK, Project Loom." —— 《异步》Slide 17
> 备注："Coroutines are not a new concept. They existed long before Kotlin, Java, and even C."

### 6.4 动机双轨：性能轨 + 体验轨

> "The main motivation for using parallelism is the desire to improve the performance… The main motivation for concurrency is the desire to increase responsiveness. This was used even before multi-core processors to enable proper user interfaces." —— 《并发》Slide 2 备注

**通用形式**：一对易混概念，先分清它们各自服务的人类需求（快 vs 不卡），需求分开了概念才分得开。

### 6.5 行业落地收尾（首尾呼应）

开场讲"为什么值得学"，结尾用真实产业作证：

> "Coroutines are used heavily in Android development. Almost every view of every application has a related CoroutineScope…" —— 《异步》Slide 123 备注

### 6.6 与前课的连续性作为动机

《并发》Slide 8 标题即 "Throwback: Single abstract method interfaces"，备注："Let's think back on single abstract method interfaces, which we covered in the previous lecture." —— 旧知识被重新征用为新技术（Runnable）的地基，学生获得"学过的东西真有用"的即时回报。

---

## 七、幽默与人格化：怎么给难点减重

### 7.1 幽默的分布规律：只在危险与失败处

通读三套备注，幽默从不出现在概念定义处（定义句一律精确克制），集中出现在三类位置：

1. **危险区**：`(DANGER ZONE)`（《并发》Slide 21）、`suspend fun russianRoulette()` + "Murphy's law: 'Anything that can go wrong will go wrong.'"（《异步》Slide 61）、"we do not recommend repeating it at home."（《异步》Slide 40 备注）
2. **失败/死锁处**："the lock can never be released because the thread is blocked – very sad."（《并发》Slide 25 备注）、`throw Exception("Some jobs just want to watch the world burn")`（《异步》Slides 78–80）
3. **冗余样板处**：callback hell 系列——"The } ladder is the Stairway to Heaven Highway to 'Callback Hell'"（Slide 12）、"Please help! I am being dragged into Callback Hell!!!"（Slide 109 注释）

**通用形式**：幽默是错误展品的解说词，让学生在笑声中记住"这里会疼"。

### 7.2 文化梗降低陌生感

> "One cannot just walk into a suspending function." —— 《异步》Slide 25（魔戒梗）
> "2 and then to infinity and beyond" —— 《异步》Slide 101（玩具总动员）

### 7.3 代码内幽默：示例数据自带性格

> `init { require(name.isNotEmpty()) { "An empty name is absurd!" } }`、`set(value) { println("What do you expect to happen?") }` —— 《OOP》Slide 33
> `println("Only positive attitude!")` / `println("Don't ask this!")`（PositiveAttitude 类）—— 《OOP》Slide 24
> 幻灯片标题直接吐槽反模式："Why do you prohibit a cat from pooping?!" —— 《OOP》Slide 22

### 7.4 备注里的小情绪注脚（写给讲师的舞台提示）

"very sad"、":)"、"you're in luck"——备注允许讲师带表情念稿，人格通过口头语气而非幻灯片正文传递。**幻灯片保持专业，备注承载温度**，这是三套语料一致的分工。

---

## 八、回顾与预告结构：课中的"前后呼应"工程

### 8.1 显式埋点（foreshadow）

> "You probably noticed the open keyword added to the Point class declaration. Why do we need this? We'll talk about it in a few slides." —— 《OOP》Slide 16 备注
> "Interfaces cannot have a state. (We'll get back to this a bit later.)" —— 《OOP》Slide 18 幻灯片原文
> "What happens upon cancellation will be covered in the coming slides." —— 《异步》Slide 32 备注
> "We will revisit this idea when discussing structured concurrency." —— 《异步》Slide 30 备注

**通用形式**：出现"暂时讲不清"的元素时，明说"几页后再解释"，把悬念记账。

### 8.2 显式回捞（recall）

- 开场即复习：《异步》Slide 3 "Let's look back at the states of a thread"，把上一讲的线程状态图重画一遍作为全课地基。
- 旧课回收：《并发》Slide 8 "Throwback"。
- 概念回访："Let's get back to the OOP abstraction principle."（《OOP》Slide 18 备注）、"Let's return to the polymorphism principle and implement a simple example in Kotlin."（《OOP》Slide 23 备注）
- 全课级回捞："Remember this code? … Now that we know much more, let's get a better approximation of what's going on under the hood."（《异步》Slide 103）
- 学完即回看："Now you see it"（《异步》Slide 77）。

### 8.3 「三线合流」：把前面所有伏笔拧成一股

结构化并发一节是教科书级的回收现场——前文分头讲的 Job 层级、异常传播、scope 分组，在此合并成一个命名概念：

> "Coroutines forming a parent-children hierarchy, exceptions being propagated and never lost, and all the work being grouped into scopes – together these features make up the structured concurrency approach, which is much easier to work with than ordinary multi-threaded programming." —— 《异步》Slide 82 备注

还有延迟揭晓的"钥匙句"：

> "Continuation, which we have now encountered several times, is a generic callback, and this is the key to understanding the machinery behind coroutines." —— 《异步》Slide 107 备注

### 8.4 备注中的「导演指令」

备注中存在系统性的舞台提示，值得作为写讲师备注的规范：

- `(optional)` 深度标记：《OOP》Slides 8、15、31——允许讲师按学情跳过；
- 提问点："Why do you think this is the case?"（《OOP》Slide 21）；
- 转场句："We've discussed fundamental OOP principles in general without talking about programming languages. Now let's see how Kotlin helps us follow those principles."（《OOP》Slide 14 备注）；
- 每页结尾附 References 链接清单，供讲师备课时下潜。

---

## 九、困难概念教学锦囊（针对抽象/困难主题的 8 条策略）

1. **痛点开路，解药殿后**：先让抽象问题的代价可见（时间线泳道逐帧动画、报错原文、反直觉输出清单），学生"疼了"之后再给机制。每引入一个新概念，前 1–2 页必须先制造一个只有它才能解决的痛。（依据：《异步》全课结构；《并发》Slides 19–21）

2. **泳道动画法**：多个并行主体交互的过程，拆成 6–12 页连续幻灯片，横轴时间、纵轴主体，每页只新增一个事件，最后一页给"真实速度全景"+ 一句落点总结。备注只写配音台词，不重复图上内容。（依据：《异步》Slides 45–53、65–76）

3. **差异教学法**：新概念先声明"它像你已经会的 X，区别只有一点"，并复用 X 的表格/图形结构，课堂时间全部花在差异行上。（依据：《异步》Slide 33 Job vs Thread 状态表；Slides 20/30/93 的"∼/like"句式）

4. **反模式阶梯**：正确方案登场前，把它要取代的旧方案逐代展览——完整代码 + 具体缺陷清单；并安排"WRONG!"页，讲师先当众犯学生必犯的错。（依据：《异步》Slides 5–15、54–55、83–84；《OOP》Slide 20）

5. **一例贯穿 + 同例多轮微调**：全课只用一个业务例子，复杂度全部加在机制层；讲行为变化时同一例子连续多轮重写，每轮只改一个变量；底层机制按"黑箱简版→开盖完整版"两种分辨率各讲一次，中间隔足量上层知识。（依据：postItem 贯穿《异步》Slides 5→103；取消四连页 88–91）

6. **概念对用平行句式，需求对分轨讲**：易混的两个概念用"X is about A / Y is about B"同构句式并排定义；若它们服务不同人类需求（快 vs 不卡），先分需求再分概念。（依据：《OOP》Slide 7；《并发》Slide 2）

7. **全景先行合同**：陡峭章节开头先甩出完整复杂实例 + 明说"接下来逐步拆解每一样"（advance organizer），结尾必回访该实例验尸。（依据：《异步》Slide 28 → Slide 77）

8. **幽默只放危险处，温度只放备注里**：定义句保持精确克制，幽默集中在危险区、死锁、样板代码三类"会疼的地方"，用文化梗和拟人对话（实体开口说台词）减重；同时用"复杂度安抚"（"你日常用不到全部特性"）在语法最密处给台阶。幻灯片保持专业，人格与情绪通过讲师备注的口头语气传递。（依据：《并发》Slide 25；《异步》Slides 12、61、88–89；《OOP》Slides 15、22）

---

*研究方法：全文精读三份 PPT 提取文件（含全部 `[讲师备注]`），共 220 页、194 页含讲师备注；所有引文逐字摘自语料原文。*
