# 构建系统

::: info
本文翻译自：https://kotlinlang.org/education/
:::

今天我们要谈谈构建系统：这是一种遵循特定原则的方法，用于将源代码转换为计算机可执行的形式。

## 是什么？为什么？

构建系统 —— 一种能够自动将源代码转换为某种构建产物（可执行文件、库）的软件。构建系统可用于：

- 一次性配置构建方案并长期使用~~（复制粘贴到新项目中）~~
- 统一构建流程并在不同项目中复用逻辑
- 依赖项管理*
- 测试与验证
- 增量构建*

![](/assets/kotlin-edu-sinicization/kotlin-build-system.png)

::: info
你可能已经习惯于在 IDE 中按下某个“神奇”的热键来运行代码。但这种方式在可扩展性和通用性方面都不足，难以应用于实际项目中。这就是为什么我们需要构建系统来协助完成幻灯片中展示的各项任务。

\*并非所有构建系统都支持依赖管理和增量构建——例如 Maven。
:::

## 怎么做？

![](/assets/kotlin-edu-sinicization/kotlin-build-system-how.png)

::: info
构建系统负责将程序从原始形式（包括源代码、图标、图像、声音等）经过一系列中间步骤（具体步骤取决于程序所使用的语言、框架和操作系统），最终转换为可与他人共享且他人能够“开箱即用”的可执行和/或可分发形式。
:::

## Maven

`pom.xml` —— **P**roject **O**bject **M**odel

**声明式**：你定义配置，但无需指定实现方式。

**约定式**：你通过特定规则描述所需内容。

**生命周期**：它可以支持从编译到测试等全流程。

**插件**可帮助你处理非常规的繁重工作。

**坐标**位于 `pom.xml` 中：`groupId`、`artifactId`、`version`。

**仓库**：你可以按需加载（并缓存）依赖项。

了解更多：[search.maven.org](https://search.maven.org/)（Maven Central）

::: info
如果我们谈论的是 JVM 领域，Maven 曾经是最广泛使用的构建系统。与许多其他构建系统不同，Maven 采用声明式设计：你只需描述想要构建的内容，而无需指定具体的构建方式。若要在构建过程中进行自定义处理，你需要使用自定义插件，这些插件可以现成寻找并复用，也可以从头开始自行创建。

Maven 高度依赖约定：为了简化构建过程，你应该为项目采用预定义的布局，并使用标准的工具进行编译、测试等操作。如果你需要自定义构建的任何方面，虽然可以实现，但这可能需要大量的额外配置和/或自定义插件。

Maven 还提供了一种简单的方式来共享和使用 JVM 依赖项。每个依赖项都有其“坐标”（一个描述依赖项组名、工件名和版本的结构化字符串元组），这些坐标被 Maven 及其兼容工具普遍理解。仅凭依赖项的坐标，就足以在构建过程中找到并下载该依赖项。
:::

## `pom.xml`

```XML
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.mycompany.app</groupId>
    <artifactId>my-app</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>1.7</maven.compiler.source>
        <maven.compiler.target>1.7</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

::: info
Maven 如今不再像以前那样被广泛使用，其主要原因恰恰也是它曾一度成为（JVM 领域）头号构建系统的理由。虽然其声明式和基于约定的特性确实简化了标准用例，但一旦需要实现特定功能（例如增量构建支持或非简单的自定义构建逻辑），就不得不让配置变得臃肿，甚至可能需要开发大量自定义的 Maven 插件，否则根本无法实现。随着时间推移，社区积累了足够多的问题，从而催生了对替代构建系统的需求。

Maven 采用 XML 进行配置这一事实，在当今时代也无助于提升其受欢迎程度。
:::

## Gradle

`build.gradle`、`settings.gradle`

**DSL**：它使用 Kotlin 或 Groovy 代替 XML。

**任务**：你可以定义可能相互依赖且相当复杂的操作。

**插件**提供了一些非传统的预定义任务，用于处理繁重的工作。

**模块**具有独立的编译单元。每个单元都会被构建为一个独立的 JAR（或其他类型的构建产物）。

**仓库**：你可以复用 Maven 仓库。

**依赖管理**：你可以轻松声明和解析依赖关系。

**语言无关**：Gradle 适用于 Kotlin、Java、Scala、C++、JS 和 COBOL。

了解更多：[docs.gradle.org](https://docs.gradle.org/)

::: info
这就是 Gradle 发挥作用的地方。它试图通过使用富 DSL 的通用编程语言（Groovy 和 Kotlin）进行配置，将描述构建的声明式和命令式方法的优势结合起来。这使你能够为常规构建提供简单的声明式描述（可通过约定进行定义），同时还能自定义更复杂的场景，而无需编写独立的插件。不过，如果你确实需要插件，也可以自行编写插件来定制构建流程。

在依赖管理方面，它采用了与 Maven 相同的基于坐标的方案，这使其能够轻松向后兼容现有的 Maven 风格依赖库。

此外，Gradle 的可扩展性意味着你不仅限于用它来构建 JVM 项目。它足够灵活，可根据需要用于构建 C++ 或 JavaScript 等非 JVM 语言的项目。
:::

## 在 IntelliJ IDEA 中创建新的 Gradle 项目

![](/assets/kotlin-edu-sinicization/new-gradle-project-in-intellij-idea.png)

::: info
如果你在 IntelliJ IDEA 中使用“新建项目”向导创建新项目，系统将默认选择 Gradle 作为构建工具。在“新建项目”向导中，你还可以指定 Gradle 应使用的 JDK。
:::

## Java 字节码

```Kotlin
plugins {
    kotlin("jvm") version "1.8.0"
    application
}

group = "org.constructor.jetbrains.kotlin"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}

kotlin {
    jvmToolchain(8)
}

application {
    mainClass.set("MainKt")
}
```

```Text
Failed to calculate the value
of task ':compileJava' property
'javaCompiler'. Unable to download
toolchain matching these requirements:
languageVersion=8, vendor=any,
implementation=vendor-specific
Unable to download toolchain. This
might indicate that the combination
(version, architecture, release/early
access, …) for the requested
JDK is not available. Could not read
'https:^/api.adoptopenjdk.net/v3/binary/latest/8/ga/mac/aarch64/jdk/h'
as it does not exist.
```

::: info
不过，在选择 JDK 时必须谨慎。例如，在 IntelliJ IDEA 2023.1 中，默认的构建脚本很可能会失败，这在使用 Gradle 时经常发生。这是因为我们在“新建项目”向导中选择了 JDK 17，而生成的脚本却针对 JDK 8。
:::

我使用的是 JetBrains Runtime 17.0.5，因此我的 JDK 版本是 17，为了解决这个问题，我这样操作：

```Kotlin
kotlin {
    jvmToolchain(17)
}
```

但通常情况下，你会看到以下内容，而不是 `jvmToolchain`：

```Kotlin
tasks.withType<KotlinCompile> {
    kotlinOptions.jvmTarget = "1.8"
}
```

::: info
要解决这个问题，我们可以调整 Gradle 构建脚本中 `jvmToolchain` 的版本，或者我也可以通过将 `kotlin` 代码块替换为专门针对 `KotlinCompile` 任务的配置来彻底改变 Kotlin 目标的配置方式，后者是更常见的方法。

`jvmToolchain` 是 Gradle 的一项相对较新的功能。本讲课中并未涉及该内容，但值得大家在闲暇时了解一下。
:::

## 构建脚本

Gradle 努力在使用过程式语言（Groovy 或 Kotlin）的同时，呈现出声明式构建配置的样貌。

在 `build.gradle.kts` 中首先映入眼帘的是 `plugins { ^^. }` 代码块，它属于以下类的方法：

```Shell
class org.gradle.kotlin.dsl.KotlinBuildScript
:> abstract class ProjectDelegate
:> interface Project : Comparable, ExtensionAware, PluginAware
```

::: info
正如我们之前提到的，Gradle 使用 Kotlin 或 Groovy 进行配置。

通常，构建工具会采用声明式语言进行配置，这使得任务更加简单。

对于 Gradle 而言，我们的脚本充当现有配置的扩展（这符合“约定优于配置”的模型）。我们正在处理的是 `KotlinBuildScript`，它本身就是 `Project` 的一个实现。因此，在处理 `build.gradle.kts` 文件时，你可以将其视为向 `Project` 类提供详细信息。注意：如果你有多个 `build.gradle.kts` 文件（子项目），那么每个文件都有自己的 `Project` 实例，该实例也会从父级继承配置。
:::

## 项目

项目接口是你在构建文件中与 Gradle 进行交互的主要 API。通过 `Project`，你可以通过编程方式访问 Gradle 的所有功能。`Project` 与 `build.gradle` 文件之间存在一对一的关系。

生命周期：

1. 为每个项目创建一个 `Project` 对象。
2. 为构建创建一个 `org.gradle.api.initialization.Settings` 实例。
3. 如果存在 `settings.gradle` 脚本，则使用 `Settings` 对象对其进行解析。
4. 使用 `Settings` 对象创建 `Project` 实例的层次结构。
5. 通过执行每个项目的 `build.gradle` 文件来解析该项目。

::: info
项目接口是 Gradle 为开发者提供的配置入口点。

当人们将一个项目描述为多模块项目时，通常是指由顶级 `build.gradle` 文件定义的主（顶级）项目包含其他项目，而每个子项目都有各自独立的 `build.gradle` 文件。

当 Gradle 配置项目时，它会创建一个 `Project` 类的实例以及一个 `Settings` 实例。随后，它会查找 `settings.gradle` 文件（一个 Gradle 项目中应仅有一个），并利用该文件来配置设置。在获取主 `Project` 实例和 `Settings` 实例后，它会从顶级 `build.gradle` 文件开始依次评估所有 `build.gradle` 文件。
:::

## 项目设置

如果我们执行以下步骤：

```Text
Project -> New -> Module
```

将出现一个新文件夹（即一个新模块）。它拥有自己的 `build.gradle.kts` 文件，但没有 `settings.gradle.kts` 文件，同时根目录下的设置文件中会添加一行：

```Kotlin
rootProject.name = "gradle-tutorial"
include("module")
```

附注：对于单项目构建，设置文件是可选的。

::: info
如果你在 IntelliJ IDEA 中创建一个新模块，系统会生成一个包含新 `build.gradle` 文件且没有设置文件的新文件夹，但顶层 `settings.gradle` 文件会发生变化：现在它将包含该新模块，从而告知 Gradle，除了运行顶层配置脚本外，还必须在指定的文件夹中查找另一个脚本。
:::

在 `settings.gradle.kts` 中添加以下内容：

```Kotlin
rootProject.name = "gradle-tutorial"
include("module")
println("Initialization phase.")
```

```Shell
Initialization phase.
> Task :prepareKotlinBuildScriptModel UP-TO-DATE

BUILD SUCCESSFUL in 3s
```

![](/assets/kotlin-edu-sinicization/kotlin-build-system-project-setting.png)

::: info
如果你在设置中添加了任何内容，Gradle 就必须重新配置该项目。

这并不一定意味着所有内容都会被重新配置，但你必须记住，设置是 Gradle 首先评估的内容，因此它对设置中的任何更改都非常敏感。首先，Gradle 会初始化项目及其设置，然后配置项目和子项目，之后你才能进入具体任务的执行阶段。
:::

## 项目任务

项目本质上是一组 `Task` 对象的集合。每个任务执行某项基本工作，例如编译类、运行单元测试或将 JAR 文件打包为 ZIP 格式。

任务包括：

- 默认任务；
- 插件提供的任务；
- 用户直接在构建配置中定义的自定义任务。

任务之间可以相互依赖。Gradle 会构建一个任务的无环有向图。

::: info
配置好 Gradle 项目后，我们需要执行构建产物、运行测试等操作。

构建是一个 Gradle 任务。项目配置完成后，所有交互操作都是通过项目中定义的任务来完成的。你可以将 Gradle 项目视为一组任务的集合。

Gradle 提供了一些默认任务。还有由 Gradle 配置中包含的插件提供的任务。此外，还有直接在项目配置中编写的自定义任务。

任务之间可以相互依赖。例如，构建和测试是两个独立的任务，但通常构建任务依赖于测试任务，这意味着当你运行构建任务时，测试任务会先于构建任务执行。任务可能会接受输入（例如为最终可执行文件指定的名称），并提供输出（即可执行文件本身）。
:::

## 任务

![](/assets/kotlin-edu-sinicization/kotlin-tasks.png)

```Kotlin
./gradlew build
```

::: info
由于任务之间可能相互依赖，因此当你调用一个任务时，并非仅仅是要求 Gradle 执行那项单独的工作。

实际上，Gradle 维护着一个图，该图表示所有任务，以及调用其中任何一个任务所产生的“任务路径”。例如，要构建一个 Kotlin 应用程序，Gradle 将执行一系列任务，包括编译和测试。
:::

![](/assets/kotlin-edu-sinicization/kotlin-tasks-2.png)

```Kotlin
./gradlew build -x test
```

不运行测试进行构建。

::: info
在某些情况下，你可能希望 Gradle 跳过某些任务，这可以通过向 Gradle 提供额外参数来实现。在本例中，我们在运行构建时跳过了测试任务。
:::

## 项目任务

配置语言是 Kotlin（或 Groovy）DSL，因此一切皆有可能。

你可以为已存在的任务添加行为。

```Kotlin
fun Task.printName() = println("Hi! My name is ${this.name}")

val task3 = tasks.register("thirdTask") {
    doFirst { printName() }
}

tasks.filter { task -> task.group?.let { it != "useless" } ?: false }
     .forEach {
         it.dependsOn(task3)
     }

tasks.test {
    useJUnitPlatform()
}
```

::: info
由于 Gradle 使用图灵完备语言进行配置，你可以在配置脚本中编写任何内容。请勿滥用此功能。

你还可以对现有的任务进行重新配置，例如添加或移除依赖项。

你可以通过运行 `./gradlew tasks` 来获取所有可用任务的列表。这就是你在 IntelliJ IDEA 的 Gradle 工具窗口中看到的内容。
:::

任务具有输入和输出。Gradle 会缓存任务的结果。如果在新的运行中输入的哈希值未发生变化，Gradle 会使用之前的缓存结果：`UP-TO-DATE`。如果哈希值发生了变化，但缓存中仍有该结果，则使用：`FROM-CACHE`。否则，它仍会尝试复用之前的结果。

::: info
Gradle 将其增量构建的能力进一步提升，并试图将所有操作都以增量方式进行。如果你的源文件完全没有更改，而你只是再次运行构建并为可执行文件指定了不同的名称，那么 Gradle 就不会运行测试，因为测试结果是最新的，且测试结果不应有任何变化。
:::

```Kotlin
tasks.register("targetTask") {
    group = "useless"
    dependsOn(tasks.named("dependencyTask"))
    println("${this.name}, configuration")
    doFirst {
        println("${this.name}, first in execution")
    }
}

tasks.register("dependencyTask") {
    println("${this.name}, configuration")
    doFirst {
        println("${this.name}, first in execution")
    }
    doLast {
        println("${this.name}, last in execution")
    }
}
```

```Shell
./gradlew :targetTask

Executing 'targetTask'...

> Configure project :
targetTask, configuration
dependencyTask, configuration

> Task :dependencyTask
dependencyTask, first in execution
dependencyTask, last in execution

> Task :targetTask
targetTask, first in execution
```

::: info
现在，让我们看看如何在 Gradle 中定义自己的任务。

你可以在配置脚本中访问项目的任务属性。

在那里，你可以注册一个新任务并为其命名。

`Register` 是一个泛型函数，允许你指定任务所继承的类；在这种情况下，你将从一开始就获得被继承类任务的基础功能。（本示例中我们不采用这种方式。）在任务主体（即 `lambda` 表达式）中，你负责配置任务。这段代码在 Gradle 项目配置时执行，它并非任务本身的代码。

任务本身的代码应放置在 `doFirst` 或 `doLast` 代码块中。之所以提供这两种选项，是因为若你继承了已定义的任务，该任务本身已有待执行的操作，你需要决定自己的代码应在已定义内容之前还是之后运行。

你可能会遇到使用 `create` 而不是 `register` 来创建任务的方法。那是过时的 Gradle API。两者的区别在于：`create` 会立即配置任务，而 `register` 则在任务首次被调用时才进行配置。对于拥有大量模块且包含许多耗时配置任务的大型项目，这种方式能节省大量时间；因为每位开发者通常只需使用现有任务中的一小部分，而无需从一开始就配置所有任务。
:::

## 插件

Gradle 的大多数实用功能都是通过在配置脚本的 `plugins` 块中添加插件来实现的。

插件会添加新的任务（例如 `JavaCompile`）、领域对象（例如 `SourceSet`）和约定（例如将 Java 源代码定位在 `src/main/java`），还可以扩展核心对象和其他插件的对象。

插件分为二进制插件和脚本插件。二进制插件通常是外部的插件 JAR 文件。脚本插件通常在构建过程中使用。

::: info
在大多数 Gradle 脚本中，你首先看到的是 `plugins` 代码块。

插件是 Gradle 配置的扩展，提供预定义的任务及其他功能。

基础版 Gradle 本身并不具备构建 Java 或 Kotlin 项目的能力，但通过添加 Kotlin 插件，我们便能提供能够组装 Kotlin 应用程序或库的任务。
:::

Gradle 将其核心插件（例如 `application`、`java`）作为发行版的一部分提供。

应用社区插件：

```Kotlin
plugins {
    application // 核心插件
    kotlin("jvm") version "1.8.0" // id("org.jetbrains.kotlin.jvm") version "1.8.0"
    id("io.gitlab.arturbosch.detekt") version "1.21.0" apply false // 稍后在子项目中应用它
}
```

还有一些插件是从 `buildSrc` 构建的，然后通过 `id` 应用，就像它们是社区插件一样。

可以通过 `settings.gradle.kts` 文件中的 `pluginManagement { … }` 块添加自定义插件仓库。

::: info
只要指定了一个插件，它就会立即应用于该项目及其所有子项目。

有时，你可能只需要在部分子项目中使用某个插件，而非全部子项目。在这种情况下，建议在顶级脚本中引入该插件并指定版本，然后在相关子项目中通过名称调用该插件以应用它。在子项目中调用插件时，无需指定版本，因为 Gradle 已知你正在使用哪个版本。

Gradle 插件存储在专用仓库中，你可以在 `settings.gradle` 文件的特定配置块中指定额外的仓库。

如果插件未存储在任何仓库中，而仅以源代码形式存在，则有一个专用的 buildSrc 文件夹用于存放它。Gradle 会在配置项目之前先运行 `buildSrc` 以了解其中可用的内容，但使用 `buildSrc` 存在风险，因为这会破坏 Gradle 的一些缓存机制。
:::

```Kotlin
// 我们的 build.gradle.kts 文件
plugins {
    kotlin("jvm") version "1.8.0"
    application
}

kotlin { // 由 kotlin("jvm") 社区插件提供
    jvmToolchain(8)
}

application { // 由 application 核心插件提供
    mainClass.set("MainKt")
}
```

通过这段代码，我们已向项目中应用了两个插件。

::: info
在此示例中，我们应用了两个插件：`kotlin` 和 `application`。它们各自提供了一个 Gradle DSL 扩展，用于配置其行为。此外，它们还提供了用于构建 Kotlin 代码和可执行文件的任务。
:::

```Kotlin
// 我们的 build.gradle.kts 文件
plugins {
    kotlin("jvm") apply false
    kotlin("plugin.serialization") apply false
}

allProjects {
    apply {
        plugin("kotlin")
    }
}
```

在此，我们仅将 Kotlin 插件积极地应用到了项目中的所有模块。

::: info
在此示例中，我们并非将插件添加到顶级项目中，而是添加到所有子项目中。

所谓立即应用，是指不等到子项目中的某个任务需要这些插件时才进行配置，而是在项目配置完成时立即进行配置。这就是 `allProjects` 代码块的工作原理。在 Gradle 中，立即加载和延迟加载是相当复杂的概念，且存在诸多注意事项，仅凭一堂课是无法充分涵盖这些内容的。
:::

```Kotlin
// 我们的 build.gradle.kts 文件
plugins {
    kotlin("jvm") apply false
    kotlin("plugin.serialization") apply false
}

…

val ignored = listOf("common")

configure(subprojects.filter { it.name !in ignored }) {
    apply {
        plugin("kotlinx-serialization")
    }
}
```

我们为除 `common` 之外的所有模块应用了 `kotlinx-serialization` 插件。

::: info
在此，我们需要说明一下，我们正在使用 `module` 和 `subproject` 这两个词。IntelliJ IDEA 将 Gradle 子项目视为顶级项目的模块。Gradle 则将每个 `build.gradle` 文件视为一个独立的项目，尽管它们以分层结构排列，并且可能会使用上级项目中的任务。这更多是一个术语问题，而非技术层面的差异。
:::

## 依赖管理

Gradle 会在仓库中查找已声明的依赖项，这些仓库可以是本地目录或远程仓库。此过程称为依赖解析。

一旦依赖项解析完成，解析机制会将依赖项对应的底层文件存储在本地缓存（即本地 Maven 仓库）中。

当存在冲突的传递性依赖时，Gradle 会处理依赖解析。此行为也可以进行自定义。

::: info
Gradle 的主要功能之一是依赖项管理。

为了管理依赖项，如果当前机器上不存在这些依赖项，Gradle 必须知道去哪里查找它们。

如果 Gradle 在远程位置找到了某个依赖项，它会将其存储在本地以备将来使用。

Gradle 还能处理存在不同版本的传递性依赖项的情况，这意味着应用程序的两个部分需要同一个工件，但版本不同。
:::

### 仓库

```Kotlin
repositories {
    mavenCentral()
    maven {
        url = uri("https://your.company.com/maven")
            credentials {
                username = USER_NAME
                password = PASSWORD
            }
        }
    flatDir {
        dirs("libraries")
    }
}
```

::: info
要告诉 Gradle 在哪里查找依赖项，你需要指定仓库。

最常见的是 `mavenCentral`，它是 JVM 包的主要远程存储库。

在你的公司中，可能有一个包含私有包的私有 Maven 仓库，这可能需要授权。Gradle 也提供了配置此功能的方法。

有时你可能希望使用手头现有的本地 JAR 文件。在这种情况下，你可以声明一个用于存储构建产物的目录，Gradle 会扫描该目录以识别其中可用的资源。
:::

### 依赖

```Kotlin
val ktor_version: String by project

dependencies {
    // 字符串表示法，例如 group:name:version
    implementation("io.ktor:ktor-server-core-jvm:$ktor_version")
    // 映射表示法 + api（可访问内部实现）
    api("io.ktor", "ktor-server-netty-jvm", ktor_version)
    // 对另一个项目的依赖
    implementation(project(":neighborProject"))
    // 将 libs 目录下的所有 JAR 文件添加到编译类路径
    implementation(fileTree("libs"))
    // 测试依赖
    testImplementation(kotlin("test"))
}
```

::: info
定义好仓库后，你可以声明依赖项，依赖项主要分为以下几种类型：

- API 依赖项在运行时和编译时均可通过传递性提供给代码的使用者。
- 实现依赖在编译时（源代码中）对你可用，但对你的代码使用者不可用。
- `testImplementation` 与 `implementation` 类似，但仅在测试时对你可用。
- `runtimeOnly` 仅在运行时包含该依赖，而 `compileOnly` 仅在编译时包含该依赖。
- 此外还有其他类型。
  :::

```Kotlin
// settings.gradle.kts
val utilitiesRepo = "https:^/github.com/JetBrains-Research/plugin-utilities.git"
val utilitiesProjectName = "org.jetbrains.research.pluginUtilities"

sourceControl {
    gitRepository(URI.create(utilitiesRepo)) {
        producesModule("$utilitiesProjectName:plugin-utilities-core")
    }
}
```

```Kotlin
// build.gradle.kts
val utilitiesProjectName = "org.jetbrains.research.pluginUtilities"

dependencies {
    implementation("$utilitiesProjectName:plugin-utilities-core") {
        version {
            branch = main
        }
    }
}
```

这里有一个来自 GitHub 仓库主分支的实现依赖项。

::: info
还有其他方法可以定位和引入依赖项。

例如，你可以从源代码构建依赖项，或者在引用 Git 中的依赖项时指定要使用的分支。

我们不会详细介绍这些更复杂的选项，因为它们仅适用于非常特定的情况，且通常并不常用。
:::

## Gradle 属性

属性用于配置 Gradle 自身及特定项目的行为。

按优先级从高到低排序：

- 命令行标志，例如 `--build-cache`
- 存储在本地 `gradle.properties` 文件中的属性。
- 存储在 `~/.gradle/gradle.properties` 文件中的属性。
- Gradle 属性，例如 `org.gradle.caching=true`，通常存储在项目根目录中的 `gradle.properties` 文件中，或通过 `GRADLE_USER_HOME` 环境变量设置。
- 环境变量

有关所有可用属性的信息，请参阅 `./gradlew properties`

::: info
你的 Gradle 构建是通过 Gradle 属性进行配置的。配置值的来源有多种，具体内容已在幻灯片中展示。
:::

```Kotlin
// gradle.properties
kotlin.code.style=official
username=student
```

```Kotlin
// build.gradle.kts
val username: String by project
val kotlinCodeStyle = project.property("kotlin.code.style") as String
tasks.register("printProps") {
   doLast {
       println(username)
       println(kotlinCodeStyle)
       println(System.getProperty("idea.version"))
   }
}
```

::: info
属性是键值对，其中键是属性名称，值是属性值。如果你需要在构建配置中使用属性值，可以通过属性名称从配置中获取该值（例如，通过 `project.property` 或使用 `by project` 委托）。
:::

```Kotlin
// projectDir/module/build.gradle.kts
tasks.register("printProperty") {
    val prop: String? by project
    doLast {
        println(prop ?: "Not set")
    }
}
```

```Shell
./gradlew :module:printProperty -> Not set
```

如果我们在 `projectDir/module/gradle.properties` 中添加 `prop="Prop set"`，则：

```Shell
./gradlew :module:printProperty -> Prop set
./gradlew -Pprop="Override prop":module:printProperty -> Override prop
```

::: info
这是一个关于属性解析的示例。
:::

## 包装器

执行任何 Gradle 构建的推荐方法是借助 Gradle 包装器（Gradle Wrapper）。

包装器是一个脚本，它会调用指定版本的 Gradle，并在必要时预先下载该版本。

借助包装器，你可以在本地构建和运行项目等，而无需在机器上安装全局 Gradle。

> 升级 Gradle 版本的一种方法是手动修改包装器的 `gradle-wrapper.properties` 文件中的 `distributionUrl` 属性。
>
> —— Gradle 文档

::: info
为了尽可能实现系统无关性，每个 Gradle 项目都包含 Gradle 包装器。

这意味着，只要你的系统安装了 JVM，当你尝试运行 Gradle 时，它就会在系统中查找合适的 Gradle 版本。如果系统中存在 Gradle，它将直接使用该版本；如果不存在，Gradle 会下载所需的发行版，然后使用该版本进行运行。这导致了项目中升级 Gradle 版本的一种相当特殊的方法：你必须修改一个字符串，该字符串指定了 Gradle 将尝试从中下载所需发行版的 URL。
:::

## 版本目录

你可以在以下两个位置之一配置所有插件、依赖项和版本：

- 在 `settings.gradle.kts` 文件中，通过 `dependencyResolutionManagement { versionCatalogs { … } }`
- 在名为 `libs.versions.toml` 的专用 TOML 文件中（通常存储在 Gradle 文件夹内）。

该 TOML 文件具有特殊结构：

```TOML
[versions]
kotlin = "1.7.10"

[libraries]
junit-jupiter-api = {
module = "org.junit.jupiter:junit-jupiter-api", version.ref = "junit-jupiter"
}

[plugins]
kotlin-jvm = { id = "org.jetbrains.kotlin.jvm", version.ref = "kotlin" }
```

::: info
依赖管理中的一大难题在于版本管理。有时很难在依赖块中手动更新版本。在 `settings.gradle` 中指定版本可能会导致不必要的缓存问题，而属性也不适合用于此目的，这使得难以明确且简洁地管理版本。

版本目录通过使用一个 TOML 文件来存储对项目至关重要的所有依赖版本，从而解决了这一问题。
:::

```Kotlin
// build.gradle.kts
plugins {
    val kotlinVersion = libs.versions.kotlin.get()
    id(libs.plugins.kotlin.jvm.get().pluginId) version kotlinVersion
        apply false
}

allProjects {
    dependencies {
        testImplementation(rootProject.libs.junit.jupiter.api)
    }
}
```

在此，我们在 TOML 文件中添加了一个插件和一个依赖项。

::: info
如果你拥有一个专用的版本目录，只需在 `build.gradle` 文件中将其作为唯一的权威来源即可。
:::

## 总结

- Gradle 是一款构建自动化工具，它使用 Kotlin DSL 作为配置语言；
- Gradle 是一个 JVM 应用程序，因此无需额外安装，且 Gradle 项目通常自带一个 Gradle 包装器用于构建；
- Gradle 遵循“约定优于配置”的原则；
- 项目及每个子项目的配置均定义在 `build.gradle.kts` 文件中；
- Gradle 的大部分功能来自任务，这些任务定义在插件中，或由项目本身实现；
- 只要用户定义了所有版本或冲突解决策略，Gradle 就能管理依赖关系。

## Gradle 的功能远不止于此！

Gradle 还支持许多其他功能，但今天我们不作详细介绍：

- 缓存
- 多模块项目
- 更多块：
  - `allprojects { }` 和 `subprojects { }`
  - `publishing { }`
  - `artifacts { }`
- 兼容性
- 解析策略
- 源代码集（Source Sets）

::: info
说实话，我们遗漏了 Gradle 的许多功能。再次提醒，如果你想成为 Gradle 高手，建议参考其出色的文档和教程。
:::
