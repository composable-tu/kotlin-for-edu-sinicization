# Kotlin for Education - Sinicization

Kotlin 是一门现代、简洁且安全的编程语言，已被 Google、亚马逊、Twitter、Reddit、Netflix、Uber、Slack 等顶尖企业广泛采用。在全球，有超过 400 所大学教授 Kotlin。

[Kotlin for Education](https://kotlinlang.org/education/) 是 JetBrains 公司联合德国康斯特大学（Constructor University）、塞浦路斯那波勒斯大学（Neapolis University）等全球高校共同打磨的一套免费全学期 Kotlin 编程语言教学资源包（英文）。该资源包含完整课程大纲、13 节课程幻灯片和讲师笔记备注。课程覆盖面向对象、函数式、泛型、并行并发、异步编程等计算机科学概念。

该项目基于 Kotlin for Education 教学资源包，译成了该资源包的简体中文版本。该项目属全网首例 Kotlin for Education 中文化公开项目*。

> \*指使用百度、Bing、Google、微信搜一搜、DeepSeek、字节豆包、腾讯元宝、Kimi、阿里 Qwen、Grok、Gemini 搜索引擎或 AI 工具，搜索不到在本项目之前就存在的 Kotlin for Education 教学资源包中文版本。

> [!note]
> 本仓库所有文本文档及演示文稿源自 JetBrains 免费无门槛提供的 [Kotlin for Education](https://kotlinlang.org/education/) 教育资源，相关作品知识产权归属于 JetBrains 公司和/或其关联公司。本仓库仅基于上述作品进行二次创作演绎（翻译）。若本仓库侵犯了 JetBrains 公司的知识产权，请及时与我联系。

> [!warning]
> 这是一个正在进行的项目，仓库内文件可能不完善且随时可发生变动，请留意。
>
> 由于 Microsoft PowerPoint 不兼容 Google 幻灯片的演讲者备注超链接能力，因此该仓库未翻译/注明演讲者备注的超链接部分。

## 在线讲义

https://composable-tu.github.io/kotlin-for-edu-sinicization/

## Agent Skills

项目同时基于 Kotlin for Education 教育资源包进行了知识与方法论蒸馏，形成一套跨编程语言的教学课件编写助手 Skill。

### 核心方法

学生先「想要」，再「知道」——术语是解药的名字，解药登场之前，病必须先被看见。由此推导出七个心智模型：

* **张力先于术语**：概念名词永远最后出场，前面是完整的痛点演进弧
* **一例贯穿**：一门课只用一个主例子，复杂度全部加在机制层
* **双层分工**：幻灯片是学生带走的锚点，讲师备注是课堂剧本，任何信息只出现在一层
* **重复即设计**：讲过程必用序列，同一面板跨多页、每页只变一处
* **差异教学**：新概念的第一句话永远是「它像你已会的 X，区别只有一点」
* **诚实的近似**：每次简化声明边界，每次延期锚定到「第 X 讲」
* **结构契约**：先声明可裁剪的课程骨架，评估结构与教学块同构

这些直觉多数有教育学理论对应（Productive Failure、认知负荷理论等）。

此外，大部分教师的隐顾虑是「AI 写的课件没有我的风格、质量失控」。该 Skill 将产出两层——给学生看的页面，和给教师演示的讲师备注。AI 管结构，教师管风格。

### 安装

在项目文件夹中打开终端，运行以下命令即可安装：

```shell
npx skills add composable-tu/kotlin-for-edu-sinicization
```

之后直接提出教学请求即可自动激活，例如：

- 帮我写一节《数据库索引》的课件，45 分钟课
- 学生总说听不懂递归，帮我设计讲法
- 这是我们学院的《数据结构》大纲，帮我改进
- 帮我出一份这一讲的测验，附讲评

课件类产出固定包含页面与讲师备注两层。

## TODO

- [x] Kotlin 入门
- [x] 面向对象编程
- [x] 泛型
- [x] 集合
- [x] 函数式编程
- [ ] 并行与并发编程
- [ ] 异步编程
- [x] 异常（选修主题）
- [x] 测试（选修主题）
- [x] 构建系统（进阶主题）
- [x] Java 虚拟机与 Kotlin 编译器（进阶主题）
- [ ] 反射（JVM）（进阶主题）
- [x] Kotlin 后端开发基础

---

# 《Kotlin 编程》课程大纲

## 先修要求

具备基础编程知识

## 课程时长

为期一学期的课程，并设有选修及进阶主题作为补充课程

## 课前准备建议

学生需准备好可运行的编程环境。这可以是任何支持 Kotlin 的集成开发环境（IDE），例如 IntelliJ IDEA。免费的教育版许可证可在此处下载：https://www.jetbrains.com/community/education/#students

## 课程描述

本课程将带领学生深入学习 Kotlin 编程语言——这是一种现代、强大且表达力丰富的语言，应用范围广泛，涵盖从 Android 开发到 Web 开发及数据科学等多个领域。学生将学习如何运用 Kotlin 解决实际的软件开发问题，并系统学习数据类型、变量与控制流、函数、面向对象编程、异常处理、集合与泛型、`lambda` 表达式以及高阶函数等内容。此外，学生还将学习 Kotlin 的多项关键特性，例如空安全、扩展函数和协程。课程尾声，学生将以 Gradle 为例学习构建系统，并探索编译技术以及 Kotlin K2 编译器的运作原理。

# 课程内容

大纲一：

1. Kotlin 入门
2. 面向对象编程
3. 泛型
4. 集合
5. 函数式编程

大纲二：

6. 并行与并发编程
7. 异步编程

选修/进阶：

8. 异常（选修主题）
9. 测试（选修主题）
10. 构建系统（进阶主题）
11. Java 虚拟机与 Kotlin 编译器（进阶主题）
12. 反射（JVM）（进阶主题）

## 教师评估资源

### 理论测验

> 每个主题各一份

### 作业（GitHub 仓库）

- 作业 1，Alias 游戏，主题 1-2
- 作业 2，平衡搜索树的实现，主题 3-5
- 作业 3，创建一个非阻塞 UI 模拟器，主题 6-7
- 【可选】作业 4，修复损坏的 Gradle 构建，主题 10

### 实践测试

- 测试 1，完成主题 1-5 后
- 测试 2，完成主题 6-7 后
- 期末测试，完成主题 7 后

Kotlin Notebook 中的 Kotlin 编程课程：https://github.com/nbirillo/jvm-development-course/tree/main/src/notebooks/

Kotlin Notebook 如何助您教授编程：https://blog.jetbrains.com/kotlin/2025/08/how-kotlin-notebook-helps-teach-programming/

### 实践练习（适用于 IntelliJ IDEA 的 IDE 内课程）：

- [Kotlin-Onboarding：入门](https://jb.gg/academy/kotlin-onboarding)，配合第 1 单元
- [Kotlin-Onboarding：面向对象编程](https://jb.gg/academy/kotlin-oop)，配合第 2 单元
- [Kotlin-Onboarding：集合](https://jb.gg/academy/kotlin-collections)，配合第 3-4 单元
- [Kotlin 中的 IDE 代码重构入门](https://jb.gg/refactoring-kotlin)，可选，教授关键重构概念，建议在完成第 1-5 单元后进行
- [Kotlin 算法挑战](https://jb.gg/academy/kotlin-algorithm)，可选，讲解常用算法及其在 Kotlin 中的实现，建议在完成第 1-5 主题后再进行

## 学习目标

- 为学生打下坚实的 Kotlin 编程语言基础。
- 指导学生如何运用 Kotlin 解决软件开发中的实际问题。
- 使学生能够编写高效、易读且易于维护的 Kotlin 代码。
- 让学生熟悉 Kotlin 的关键特性，例如空安全、扩展函数和协程。
- 帮助学生更深入地理解计算机科学的基础概念，例如并发计算，以及如何将其应用于 Kotlin 软件开发。

## 预期学习成果

完成本模块后，学生将能够：

- 利用 Kotlin 的独特特性编写可读、可维护且表达力强的代码。
- 运用 Kotlin 解决软件开发中的实际问题。
- 编写高效且经过优化的 Kotlin 代码。
- 使用 Gradle 构建系统。
- 理解 Kotlin 编译器的运作原理。

## 推荐资料

- Roman Elizarov、Svetlana Isakova、Sebastian Aigner 和 Dmitry Jemerov：《Kotlin in Action》（第二版），Manning Publications，2022 年：https://www.manning.com/books/kotlin-in-action-second-edition
- Kotlin 官方文档：https://kotlinlang.org/docs/home.html


