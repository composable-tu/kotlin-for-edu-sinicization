# Java 虚拟机与 Kotlin 编译器

::: info
本文翻译自：https://kotlinlang.org/education/
:::

## Java 语言

- 诞生于 1995 年。
- 是一种具有强静态类型的面向对象编程语言。
- 支持即时（JIT）编译。
- 使用 Java 虚拟机（JVM）。
- 具有垃圾回收机制，这意味着你可以分配内存，系统会自动释放它。

::: info
强类型化的特点在于，该语言不允许在表达式中混合不同类型，也不进行自动隐式转换。例如，你无法从字符串中减去一个集合。弱类型化的语言会自动执行许多隐式转换，即使这会导致精度损失或转换结果存在歧义。与 JavaScript 类似，运算式 `50 + '2' - '5'` 定义明确且返回 `497`，因为在 `50 + '2'` 中，值 `50` 被转换为字符串并进行字符串连接以得到 `'502'`；而在 `'502' - '5'` 中，两个操作数均被转换为数字并进行减法运算，最终得到 `497`。
:::

## 编译过程 —— Java vs C

![](/assets/kotlin-edu-sinicization/compilation-process–java-vs-c.jpg)

::: info
在 Java 问世之前，许多计算机程序都是为特定的计算机系统编写的，且更倾向于采用手动内存管理，因为这种方式更高效且可预测（例如 C、C++）。随着 20 世纪 90 年代后半期 Java 的出现，自动内存管理已成为一种普遍做法。

JVM 的优势在于“一次编写，到处运行”的原则。这意味着，你用 Java 或任何其他 JVM 语言编写的代码都会被编译成某种 Java 字节码，该字节码可以在任何 JVM 实现上运行，而无需考虑处理器设计、操作系统以及其他平台特有的特性。这是 JVM 和 Java 本身的一大优势，而像 C 和 C++ 这样的低级语言则难以将程序从一个操作系统迁移到另一个操作系统，同时仍能保证程序的良好运行和编译。
:::

## Java 字节码

```Java
public class Main {
    public static void main(String[] args) {
        System.out.print("Hello, World!");
    }
}
```

编译成：

```Java
public class examples/Main {

  public <init>()V
   L0
    LINENUMBER 3 L0
    ALOAD 0
    INVOKESPECIAL java/lang/Object.<init> ()V
    RETURN
   L1
    LOCALVARIABLE this Lorg/examples/Main; L0 L1 0
    MAXSTACK = 1
    MAXLOCALS = 1

  public static main([Ljava/lang/String;)V
   L0
    LINENUMBER 5 L0
    GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
    LDC "Hello, World!"
    ICONST_0
    ANEWARRAY java/lang/Object
    INVOKEVIRTUAL java/io/PrintStream.print
           (Ljava/lang/String;[Ljava/lang/Object;)Ljava/io/PrintStream;
    POP
   L1
    LINENUMBER 6 L1
    RETURN
   L2
    LOCALVARIABLE args [Ljava/lang/String; L0 L2 0
    MAXSTACK = 3
    MAXLOCALS = 1
}
```

::: info
JVM 字节码比机器码更高级。它了解 Java 类型系统，并且是针对一种基于栈的抽象机器设计的，而现代物理机器则是基于寄存器的。
:::

## JVM 内部构造

![](/assets/kotlin-edu-sinicization/the-jvm-under-the-hood.png)

::: info
JVM 的核心组件之一是解释器，它会逐行解析 JVM 字节码，并将代码转换为应用程序运行所在的物理机器所能接受的本机代码。

除了解释器和类加载服务外，JVM 还包含内存管理器、任务调度器等众多组件。
:::

## 内存组织

JVM 内存分为两部分：

- 静态内存（或称非堆内存）在 JVM 启动时创建，主要用于存储类结构、字段、方法数据以及方法和构造器的代码。
  - 已加载的类
  - 所有线程的栈
  - JVM 自身的服务内存
  - 较小 —— 栈内存约为 1024 KB
- 堆内存是所有 JVM 线程共享的运行时数据区，用于为所有 Java 对象分配内存。
  - 程序执行期间创建的所有对象
  - 较大 —— 从几 MB 到几 TB

::: info
JVM 内存分为两部分：堆内存和静态内存。

静态内存于 JVM 启动时创建，用于存储各类结构，例如运行时常量池、字段和方法数据、方法及构造器的代码，以及内部化字符串。此类内存还用于存储 JVM 本身的代码、JVM 内部结构、已加载的分析器代理代码、数据等。

堆是为所有 Java 对象分配内存的运行时数据区。它在 JVM 启动时创建，其大小会随着应用程序的运行而增大或缩小。根据垃圾回收策略的不同，堆可以是固定大小或可变大小。固定大小的堆可以通过 `-Xms VM` 选项指定，而可变大小的堆则可以通过 `-Xmx` 选项设置其最大大小。
:::

## 弱分代假说

根据弱分代假说，对象往往寿命较短。

一个相关的假设是：对象存活的时间越长，其继续存活的可能性就越大。

![](/assets/kotlin-edu-sinicization/weak-generational-hypothesis.png)

## 分代

程序的内存可分为两代：

- 年轻代
- 老年代

垃圾回收（GC）也可按此方式划分：

- 小规模垃圾回收仅清理年轻代中的对象
- 全面垃圾回收则清理两代中的对象

::: info
这种“弱分代假说”被应用于垃圾回收中，即自动释放程序不再使用的内存的过程。根据弱分代假说，程序的内存被划分为两个代：年轻代和老年代。对象最初作为年轻代的成员被创建，一旦它们在经过一定次数的垃圾回收周期后仍未被销毁，就会被移至老年代。

这种划分的依据在于，大多数对象在创建后不久就需要进行垃圾回收。由于不太可能被回收的对象位于老代，因此对年轻代的垃圾回收频率更高，且开销更小。这可以提升垃圾回收器乃至整个程序的性能。
:::

## 死对象

![](/assets/kotlin-edu-sinicization/dead-objects.png)

::: info
当垃圾回收被触发时，垃圾回收器会回收死对象占用的内存。死对象是指在任意代中没有任何引用的对象。

考虑上述示例。在年轻代中，我们有三个对象：A、B 和 C。它们都拥有引用（无论是来自栈还是其他对象），因此乍看之下，它们似乎都是存活的对象。

如果我们考察老代中的两个对象 D 和 E，会发现对象 E 没有任何引用，因此它是一个死对象。

然而，由于对象 C 的唯一引用来自一个死对象，因此它也可以被视为死对象。
:::

## 串行垃圾回收器

最早出现的垃圾回收器是串行垃圾回收器，它采用单线程模式，并行垃圾回收器和 CMS 垃圾回收器均以此为基础。

- 在串行垃圾回收器中，堆被划分为 4 个区域：
  - 伊甸园（Eden）—— 约占年轻代的 8/10
  - 幸存 0 区（Survivor 0）—— 约占年轻代的 1/10
  - 幸存 1 区（Survivor 1）—— 约占年轻代的 1/10
  - 老年代（Tenured）—— 约占堆的 2/3

- （几乎）所有对象都在伊甸园区域中创建。

![](/assets/kotlin-edu-sinicization/serial-garbage-collector.png)

::: info
最早开发的垃圾回收器是串行垃圾回收器。它采用单线程模式，这意味着所有垃圾回收操作都在一个线程中进行。此后开发的所有垃圾回收器均基于这一原理，只是进行了某些修改和优化。

堆内存被划分为 4 个区域：伊甸园区，占据年轻代可用空间的 8/10；两个大小相等的幸存区，同样属于年轻代；以及老年代区，占据堆上约 2/3 的可用内存。

几乎所有对象最初都会被放置在伊甸园区。不过，也有一些例外。例如，那些在程序生命周期内很可能被持续使用的重量级常量，可以立即被放置在老年代区。
:::

## 垃圾回收的工作原理

![](/assets/kotlin-edu-sinicization/how-garbage-collection-works.png)

::: info
以上是一个关于串行垃圾回收器如何工作的示例。

最初，所有 4 个堆区域都是空的。在程序执行过程中，所有对象都被放置在伊甸园中，直到某个时刻该区域空间耗尽。

此时，小规模垃圾回收过程将从年轻代开始，随后转向老年代。首先，系统会统计伊甸园区域中所有已销毁和存活的对象，然后将所有存活对象依次移动到幸存 0 区域，以消除它们之间的空隙。
:::

![](/assets/kotlin-edu-sinicization/how-garbage-collection-works-2.png)

::: info
新对象将继续被放置在伊甸园，直到该区域再次满载，此时将再次执行小规模垃圾回收过程。首先，计算伊甸园和幸存 0 区中所有已死亡和存活的对象，然后将所有存活的对象依次移动到幸存 1 区。
:::

![](/assets/kotlin-edu-sinicization/how-garbage-collection-works-3.png)

::: info
该过程将重复进行，直到其中一个幸存区域空间耗尽。每次小规模垃圾回收都会将已占用幸存区域和伊甸园区域中的对象移动到空闲的幸存区域。
:::

![](/assets/kotlin-edu-sinicization/how-garbage-collection-works-4.png)

::: info
如果某个幸存区域没有足够的空闲空间来接收来自伊甸园的对象，则会启动一次完整垃圾回收过程。在这种情况下，那些在经过一定轮次垃圾回收后仍存活的对象会被移至老年代区域，其余对象则被移至空闲的幸存区域。
:::

## 即时编译

![](/assets/kotlin-edu-sinicization/just-in-time-compilation.jpg)

- 程序剖析在运行时进行。
- 代码片段会针对特定平台进行编译，以优化执行时间。

_解释一条命令的速度远比在处理器上直接执行该命令慢得多。_

那么，我们为什么还需要解释器呢？

::: info
所有编程语言要么在运行时被解释执行，要么被静态编译成某种代码（机器码、字节码等），然后由硬件或专门设计的软件（解释器）在运行时进行解释执行。这种编译被称为提前编译（AOT）。例如，C、C++、D、Rust、Haskell、C#、基于 JVM 的语言、TS 等都采用这种编译方式，但 Python、JS、Ruby 则不采用。

为了获得更快的执行速度，JVM 平台积极采用动态编译，这也被称为即时（JIT）编译。动态编译通过在应用程序运行时，在后台将 Java 字节码块转换为优化的本机代码来提升性能。其工作原理与静态编译器有显著差异，JVM 采用了一套不同的编译技术来生成高性能代码。

字节码可以通过多种方式编译成特定平台的可执行代码。随后，会进行多层优化。JVM可能会分析哪些代码是瓶颈，并针对当前平台对其进行优化，使用 AOT 无法使用的特定平台优化技术。
:::

**解释器**：

- 几乎可以立即开始运行。
- 可执行代码的性能较差。

**JIT 编译器**：

- 经过较长时间的延迟后才开始工作（需要时间进行优化）。
- 可执行（编译后）代码的性能很高。

哪些类型的 JIT 代码值得编译？

运行时间较长的代码，或者频繁执行的代码，因为编译带来的开销将被优化后的执行效率所抵消。

我们如何判断哪些代码段的执行时间会很长？

有个叫艾伦·图灵的人曾说这是**不可能**的。

但从经验上看，这是可行的。如果某段代码的单次执行时间足够长，那么将来很可能也会如此。

![](/assets/kotlin-edu-sinicization/alan-turing.png)

::: info
从纯理论角度而言，无法确定程序的哪些部分是瓶颈。但我们可以引入一些指标，并在程序启动时的短时间内进行测量，从而尝试通过经验方法来判断。随后，根据这些指标的数值，我们可以判断程序的哪些部分是瓶颈并对其进行编译。简而言之，我们只需在程序启动时对其进行性能分析，然后编译所需的代码片段即可。JIT 编译有不同的指标和不同的启发式方法。以下是一些最合理方法的非正式示例：

1. 如果程序片段被执行得足够频繁，就编译它。
2. 如果程序片段虽然偶尔被执行，但计算速度足够慢，就编译它。
3. 在编译程序片段时，忽略那些执行频率不足的部分。（例如，如果片段中包含一个 `if-else` 代码块，其中某条分支此前从未被执行过——且未来大概率也不会被执行——那么只编译该分支以外的整个片段岂不是更合理？这样既能减小编译后的代码体积，又能稍微提升运行速度。）
4. 如果之前的假设被违反，则重新编译该代码片段。

总而言之，有几个不太明显的指标用于确定哪些部分应该被编译，也有许多不太明显的启发式方法用于有效地编译代码（这些是我们为了在“编译一切，即使是不需要的部分”和“什么都不编译，甚至包括需要的部分”之间寻求平衡而做出的假设）。
:::

## JVM 内部构造

编译器为什么要调用解释器？

![](/assets/kotlin-edu-sinicization/the-jvm-under-the-hood.png)

::: info
但 JIT 编译器也需要调用解释器。为什么？

这是因为上一张幻灯片中讨论的假设。如果字节码中包含条件语句，那么很可能是有其原因的。因此，如果我们在编译代码时忽略了条件语句的一个分支，并认为“在大量字节码计算过程中该分支从未被执行过，所以短期内也不太可能被执行”，我们就必须做好承担这一假设所带来后果的准备。后来，被移除的分支可能不得不被执行。在这种情况下，JIT 编译器必须承担责任，并告知解释器使用原始字节码。这种过程被称为“去优化”，而包含此类假设（即突然被证明是错误的假设）的编译代码被称为“非进入代码”。还有另一种导致去优化的原因：“僵尸代码”。这是指一段时间内未被执行的编译代码（本应被移除）。
:::

```Java
class PiUtils {
    private static final double PI = 3.141592653589;

    public static double getPiSquared() {
        return PI * PI;
    }
}
```

替换为：

```Java
public static double getPiSquared() {
    return 9.869604401084375;
}
```

::: info
以下是一个非递归代码的示例。

请看这段代码片段。显然，`PI` 变量是常量，不会发生变化。因此，`getPiSquared` 函数返回的值仅取决于 `PI` 变量，每次调用时都会返回相同的值。所以，将其替换为一个仅返回该值且不浪费宝贵处理器周期（CPU 周期）的函数是非常合理的。
:::

```Java
class PiUtils {
    private static final double PI = 4;

    public static double getPiSquared() {
        return PI * PI;
    }
}
```

反射：

```Java
public static double getPiSquared() {
    return 9.869604401084375; // ❌ // [!code error]
}
```

::: info
但如果 `PI` 变量的值被更改了呢？（该如何实现？例如，通过反射。反射无所不能！）那么，我们的编译函数 `getPiSquared` 就会出错，因为它返回的值不正确。因此，我们应该回退到原始字节码，然后对该函数进行即时编译。
:::

## Kotlin 语言

- 可编译为 JVM 字节码。
- 与 Java 兼容。
  - 可在 Java 项目中使用。
  - 可使用 Java 库。
- 安全且简洁。
- 支持集成到编译流程中（编译器插件）。
- 由 Google 认可，它是 Android 应用的主要开发语言。

## Kotlin 编译器

![](/assets/kotlin-edu-sinicization/kotlin-compiler.png)

::: info
粗略地说，Kotlin 编译器主要由 3 个部分组成：

1. 首先是解析器，它接收源代码（对编译器而言，源代码看起来就像是纯文本），并将其转换为更便于后续处理的格式。解析器仅表示代码结构，不会尝试理解代码的含义，也不会根据代码中的名称来解析变量和类型等。
2. 其次是前端，它接收解析器处理过的源代码以及代码的编译时依赖项（如 Kotlin 或 Java 编译库），并确定代码的含义，以便将其传递给后续环节并编译为最终形式。因此，它会扩展解析器传入的源代码表示格式，并融入分析过程中获得的知识。它也可能改变或扩展这种表示形式。
3. 最后是后端，它将经过全面扩展、理解并经过错误检查的代码转换为最终结果，例如库的 `KLib` 文件（`klib` 是 Kotlin 库表示的格式）、JVM 的 Java 字节码、JS 平台的 JS 和/或 TS 文件，以及原生平台的可执行文件。这是编译器中最繁重的一部分。

现在让我们深入探讨。
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-2.png)

::: info
看起来有点复杂，对吧？老实说，这些模块还可以进一步拆解，分成更小的模块。但这会比较困难，而且超出了本课程的范围。

让我们从解析器开始。
:::

## 解析简述

![](/assets/kotlin-edu-sinicization/parsing-in-a-nutshell.png)

::: info
让我们来看这个简单的示例。起初，编译器拥有的只是源代码，这些源代码看起来不过是一堆纯文本文件。

第一步是将每个文件拆分为词素列表（忽略一些毫无用处的符号，如空格），并赋予它们简单的含义（如“标识符”、“关键字”、“分隔符”、“运算符”、“字面量”、“注释”等），从而将其转化为词法单元。这个过程称为词法分析，而执行该过程的软件（或编译器的组成部分）被称为词法分析器。

随后，编译器将词法单元列表转换为 CST（具体语法树）。该树表示了我们通常凭直觉推断出的层次结构。例如，在此处我们显然默认乘法在加法之前进行，且其结果用于加法运算。因此，首先我们将前三个词法单元合并到“乘积”（Product）顶点下，然后将“乘积”顶点与最后两个词法单元合并到“求和”（Sum）顶点下。（如果你了解无上下文文法及其树表示形式，那么 CST 正是这种树表示形式。）请注意，每个节点的子节点顺序至关重要。你还应注意到，CST 仍包含加号或星号等无用符号，但不包含某些其他显而易见的隐含属性（如返回类型或访问修饰符），这些内容将在本演示的后续部分中介绍。

最后，它可以将 CST 转换为 AST（抽象语法树）。这本质上是同一棵树，但每个词法单元要么被替换为它的含义（就像整数的文本表示被替换为整数本身那样），要么被移除（比如那些无用的加号和星号），而且每个节点的子节点不再通过子节点列表来引用，而是通过来自父节点的命名箭头来引用（就像幻灯片上的“左操作数”和“右操作数”那样）。请注意，这里不再有无用的符号，且子节点的排序已被命名所取代，尽管隐含信息仍然缺失。

你可以在经典的《龙书》（译者注：即《编译原理》）中阅读相关内容。
:::

## Kotlin 编译器

![](/assets/kotlin-edu-sinicization/kotlin-compiler-3.png)

将程序拆分为词法单元（关键字、标识符等）。

::: info
回到 Kotlin 编译器。首先，词法分析器会生成一个词法单元列表。
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-4.png)

将词法单元列表转换为 CST 或 AST

::: info
随后，语法分析器将其转换为 CST 或 AST。

Kotlin 编译器会生成 PSI（程序结构接口）或 Lighter AST。PSI 和 Lighter AST 分别是 IntelliJ 平台针对 CST 和 AST 提供的 API。编译过程中使用 Lighter AST，而在 IDE 中或进行语义搜索时则使用 PSI。
:::

## Kotlin 编译器：程序结构接口

![](/assets/kotlin-edu-sinicization/kotlin-compiler-psi.png)

::: info
IntelliJ IDEA 默认自带 PSI 查看器，也可通过插件安装。
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-psi-2.png)

::: info
以下是示例函数定义如何被划分为语法单元并表示为 PSI 的示例。

请注意，树中包含了所有符号，包括大括号、圆括号、点、冒号、分号以及其他从代码含义来看似乎无用的符号。但在这里，你不会找到 `return`、`public` 或其他通常会被跳过的元素，因为它们确实被跳过了。因此，尽管函数声明中包含这些元素，但在 CST 中并未体现。这是因为 CST 仅是文本本身的表示，而非其语义。所有这些信息仅在前端阶段推导出来。该阶段仅用于将纯文本转换为词法表示，不进行语法分析。

在解析器 CST 中，顶点被表示为与形式语法中（终结符和非终结符）符号对应的类型实例，而箭头则被表示为这些实例的字段（这意味着你可以通过父实例的相应字段访问任何子节点）。简而言之，可以说像 PSI 这样的任何 API 的结构图，就是给箭头命名的 CST。
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-psi-3.png)

::: info
这是示例代码（该函数）在 PSI 中的表示形式。在此，子树的根节点对应于函数体。
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-psi-4.png)

::: info
而作为 `println` 函数参数的字符串模板，则对应于顶点 `STRING_TEMPLATE`。但由于它是被调用函数的唯一参数，因此也对应于顶点 `VALUE_ARGUMENT`。
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-psi-5.png)

::: info
字符串模板中用户变量的使用对应于 `REFERENCE_EXPRESSION` 顶点。
:::

## Kotlin 编译器

![](/assets/kotlin-edu-sinicization/kotlin-compiler-5.png)

所谓的 FIR 树正在构建中。它与 PSI 类似，但具有可变性。

::: info
解析器会生成源代码的 Lighter AST 表示形式，而前端则将其转换为 FIR（前端中间表示形式），其结构与 Lighter AST 类似，但具有可变性。这使得你可以直接向同一棵树中添加关于词法单元的新信息，而非在树周围构建其他结构（例如“分段上下文”，这是一个庞大且占用大量资源的并发哈希表）。这意味着在前端处理初期，它会直接将树结构以 FIR 格式（而非 Lighter AST）重建，随后向其中填充推断出的信息（例如解析引用、推断类型等），并针对这个已充实信息的树运行诊断。此外，出于某些原因（如稍后将讨论的去糖化，或通过编译器插件进行的自动化复杂代码生成），它可能会修改该树。

实际上，前端被划分为许多阶段。在本课程中，这些阶段被归纳为3个主要阶段，以描述前端的主要工作。此外，目前默认情况下不生成 FIR，而是使用 Lighter AST 并将其传递给后端，同时推断出的信息存储在绑定上下文中。可以通过编译器标志启用 FIR，并且它很快将成为前端的默认表示形式。
:::

## 前端中间表示？又是棵树！

![](/assets/kotlin-edu-sinicization/fir-another-tree.png)

::: info
这是将一个类似示例表示为 FIR 的方式。在此，类型已经得到解析。在解析过程之前，类型要么表示为“用户类型引用”，要么根本不表示。确切地说，类型引用被填充了模拟的 `FirImplicitTypeRef` 顶点，这些顶点应当且将会被推导出的类型所替换。
:::

![](/assets/kotlin-edu-sinicization/fir-another-tree-2.png)

::: info
这是参数和返回类型在 FIR 中表示的位置。
:::

![](/assets/kotlin-edu-sinicization/fir-another-tree-3.png)

::: info
这是字符串模板的 FIR。
:::

![](/assets/kotlin-edu-sinicization/fir-another-tree-4.png)

::: info
`"Hello, "` 被表示为一个常量表达式。它也有一个类型引用！
:::

![](/assets/kotlin-edu-sinicization/fir-another-tree-5.png)

::: info
这是变量引用的表示位置。
:::

![](/assets/kotlin-edu-sinicization/fir-another-tree-6.png)

::: info
请记住，每个（继承 `Any` 接口的）对象都拥有 `toString(): String` 方法。因此从形式上讲，表达式 `"Hello, $user"` 实际上意味着 `"Hello, " + user.toString()`。这就是为什么 `toString` 函数调用也被插入到树中。实际上，字符串模板是通过经典的 `StringBuilder` 计算的。因此，它也会被插入到树中。
:::

## 前端中间表示：语法糖消除

```Kotlin
if (b) {
   println("Hello")
}

for (s in list) {
   println(s)
}

val (a, b) = "a" to "b"
```

语法糖消除：

```Kotlin
when {
   b -> println("Hello")
}

val <iterator> = list.iterator()
while (<iterator>.hasNext()) {
   val s = <iterator>.next()
   println(s)
}

val <destruct> = "a" to "b"
val a = <destruct>.component1()
val b = <destruct>.component2()
```

::: info
前端还会执行语法糖消除。语法糖消除是指将高级语法结构替换为等效的低级代码的过程。简而言之，语法糖消除就是将语法糖替换为“无糖”的等效表达。它能帮助你消除编译器代码中的冗余代码（例如为 `if` 和 `when` 表达式编写类似的代码），并使代码能够转换为平台操作。
:::

## Kotlin 编译器

![](/assets/kotlin-edu-sinicization/kotlin-compiler-6.png)

解析完全限定名称

::: info
解析器只是将用户定义的实体名称替换为相应的完全限定名称。换句话说，像 `Int` 这样的用户友好名称可能会被替换为像 `kotlin.Int` 这样的编译器友好型完全限定名称。
:::

## Kotlin 编译器：解析

```Kotlin
fun myFunction() {

}
```

**Library A**

**简写全限定名**：`myFunction`
**解析后的全限定名**：`org.libraryA.myFunction`

```Kotlin
fun myFunction() {

}
```

**Library B**

**简写全限定名**：`myFunction`
**解析后的全限定名**：`org.libraryB.myFunction`

::: info
举个例子。假设我们在不同的库或模块中有两个名称相同的函数。在原始的 FIR 树中，它们对应相同的节点 —— 名称为 `myFunction` 的函数节点。然而，这些函数是不同的，我们无法确切知道用户代码中调用了哪一个。或者，用户可以在 `import` 语句中重命名任何实体（例如 `import kotlin.collections.List as Tsil`）。因此，当遇到类似 `String` 或 `MyList` 这样的类型引用，或是存在大量相似的 `plus` 函数时，仅凭 `plus` 这样的函数引用，完全无法明确判断具体使用了哪种类型或函数。

在这种情况下，我们可以使用函数的完整路径（包括包名、父类和函数名）来解析完全限定名。通过完全限定名，我们可以确定具体实体。这使我们能够在编译的最初阶段就检查实体的可用性。此外，当实体是函数时，这还能让我们检查函数返回类型使用的正确性。
:::

## Kotlin 编译器

![](/assets/kotlin-edu-sinicization/kotlin-compiler-7.png)

推断所有类型并解析函数体

::: info
类型推断是编译器识别每个隐式类型的过程。
:::

```Kotlin
fun hello(user: String) = println("Hello, $user")
```

![](/assets/kotlin-edu-sinicization/kotlin-compiler-8.png)

::: info
例如，请看幻灯片上的代码片段。在生成 FIR 之后，函数的返回类型、用户参数的类型以及常量 `"Hello,"` 的类型分别被标记为 `ImplicitTypeRef`、`UserTypeRef`（`="String"`）和 `ResolvedTypeRef`（`=kotlin/String`）。这意味着字符串常量的类型从一开始就被解析出来，而参数的类型仅被描述为字符串 `"String"`，但尚未被解析，函数的返回类型则完全未被描述，因此将由类型推断决定。

随后，在解析过程中，我们会解析所有提及的实体，因此参数的类型被解析出来，但函数的返回类型仍未确定。

随后进行类型推断，最终根据函数主体的返回类型推导出函数的返回类型——该返回类型实际上是根据 `println` 函数的返回类型推导而来的，而 `println` 函数的返回类型是在类型解析完成后确定的。在类型推断过程中，会进行这一推导以及许多类似的推导。
:::

## Java 互操作性

### 空值处理

- Kotlin 中的 Java 可空类型

Java 源代码：

```Java
public class Main {
    public static String foo() {
       // TODO
    }
}
```

Kotlin 源代码：

```Kotlin
var a: ???? = foo()
```

::: info
在互操作性方面存在许多细节问题。例如，请看上面的这段 Java 代码。由于 Kotlin 与 Java 具有互操作性，因此可以从 Kotlin 中调用该 Java 函数。但 Java 并不具备空值安全机制。这引发了一个问题：该函数的返回类型在 Kotlin 中是如何表示的？
:::

`String!`

::: info
认为它会被表示为 `String?` 是合乎逻辑的。但实际情况要复杂一些。返回类型将被解释为 `String!`。
:::

- `String!` 表示类型范围：`[String..String?]`

::: info
此类类型被称为平台类型。当你拥有一个平台类型的值时，可以安全地将其强制转换为 `String` 或 `String?`。你也可以（并且应该）在收到该值的第一时间就对其进行强制转换或使用。但请注意，你不能将该类型标记为 `String!`。

如果你想更具体地了解平台类型 `T!` 的工作原理，可以非正式地这样理解：`T!` 要么是 `T`，要么是 `T?`，但我们无法确定。或者，你可以更正式地将其定义为“一种类型 `X`，使得类型 `X` 的值可以在预期类型 `T` 的地方使用，而类型 `T?` 的值可以在预期类型 `X` 的地方使用”。还有一种更严谨的定义，但它违背常识，除非你对自己的数学知识和技能充满信心，否则我们不建议阅读。
:::

- 空值处理注解 `@NotNull` 和 `@Nullable`

Java 源代码：

```Java
public class Main {
    @NotNull
    public static String foo() {
       // TODO
    }
}
```

Kotlin 源代码：

```Kotlin
var a: String = foo()
```

::: info
但你也可以在任何声明中，对任何类型的变量添加 `@NotNull` 或 `@Nullable` 注解，或者使用 Kotlin 编译器支持的其他注解。
:::

### 集合映射

- Kotlin 中的 Java 集合类型

Java 源代码：

```Java
public class Main {
    @NotNull
    public static List<@NotNull String> foo() {
       // TODO
    }
}
```

Kotlin 源代码：

```Kotlin
var a: ???? = foo()
```

::: info
另一个问题是，Java 中所有常见的集合接口（如 `List`、`Set`、`Map`、`Collection`、`Iterable` 等）默认都是可变的，而 Kotlin 则通过为每种情况提供两个不同的接口（例如 `MutableList` 和 `List`）来区分可变和不可变的选项。那么，变量的类型现在是什么呢？
:::

- `(Mutable)List<T>` 的类型范围是：`[MutableList<T>..List<T>]`

`(Mutable)List<String>`

::: info
同样地，我们还有平台类型 `(Mutable)List<String>`，它也是一个类型范围。
:::

## Kotlin 编译器：控制流与数据流分析

- 变量初始化分析：

  每个变量在使用前都会被初始化。

  每个不可变变量在初始化后不会被重新赋值。

  ```Kotlin
  val a: Int

  while(true) {
     if (Random.nextBoolean()) {
         a = 15
         break
     }
  }

  println(a) // 编译通过！
  ```

  ::: info
  正如你可能已经知道的，Kotlin 编译器非常智能，能够得出更高级的结论。它可以检查每个变量在使用前是否已被赋值，以及每个不可变变量在初始化后是否未被重新赋值。
  :::

- 返回值分析：

  如果返回类型不是 `Unit`，那么该函数除非返回某个值，否则不会将控制权交还给调用方。

  ```Kotlin
  fun bar(): Int {
     print("Again")
     while (true) {
         print(" and again")
     }
  } // 编译通过！

  fun baz(): Long {
     error("YOLO! :)")
  } // 编译通过！
  ```

  ::: info
  它可以检查并确保返回类型为非 `Unit` 的函数在返回某个值之前不会停止执行。
  :::

- 智能类型转换分析：

  如果类型检查成功，则被检查的值会自动转换为相应的类型。

  ```Kotlin
  fun Any?.printFirstElement() {
     when (this) {
         is List<*> -> get(0)
         is Iterable<*> -> iterator().next()
     }
  }

  fun String?.length(): Int =
     if (this == null) 0
     else length

  fun Int?.isEven(): Boolean =
     this != null && this % 2 == 0
  ```

  ::: info
  编译器还可以在类型检查之后（或者如果出于某种原因确定该变量可以安全地进行类型转换），自动将每个变量转换为相应的类型。

  显然，如果编译器无法进行这些分析，那么类型转换的代码将会非常冗长，或者难以编写和阅读！
  :::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-control-and-data-flow-analysis.png)

::: info
但编译器究竟是如何实现的呢？

对于每个函数，Kotlin 编译器都会生成一个控制流图，用来描述函数中的控制流。幻灯片上展示了一个简化版本。
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-control-and-data-flow-analysis-2.png)

::: info
在这里，我们可以看到起始状态，此时光标刚刚进入函数体。
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-control-and-data-flow-analysis-3.png)

::: info
随后它找到 `while` 循环，
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-control-and-data-flow-analysis-4.png)

::: info
评估其条件，
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-control-and-data-flow-analysis-5.png)

::: info
然后要么进入循环体，要么退出循环。
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-control-and-data-flow-analysis-6.png)

::: info
如果进入循环体，它会找到 `if` 语句并进入其中。
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-control-and-data-flow-analysis-7.png)

::: info
接着光标评估 `if` 条件，
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-control-and-data-flow-analysis-8.png)

::: info
要么进入 `if` 分支，要么退出该语句。
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-control-and-data-flow-analysis-9.png)

::: info
如果进入分支，则执行将变量转换为 `A` 的操作，并要么抛出异常，
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-control-and-data-flow-analysis-10.png)

::: info
要么继续执行 `break` 语句，使光标退出循环。
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-control-and-data-flow-analysis-11.png)

::: info
但如果光标退出 `if` 结构，则它会退出循环块，并返回对循环条件的评估。
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-control-and-data-flow-analysis-12.png)

::: info
如果光标退出循环，它将执行 `foo` 函数调用并
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-control-and-data-flow-analysis-13.png)

::: info
退出 `bar` 函数体。
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-control-and-data-flow-analysis-14.png)

::: info
但在编译器生成控制图时，它发现 `while` 循环条件始终为真。因此它理解到 `false` 箭头不可达，而通往函数调用节点的唯一路径是经过类型转换节点。于是，它对 x 执行智能类型转换，并成功解析出待调用的函数。

**警告**：此示例仅适用于 K2 编译器。你必须调用 `useK2()` 或将语言版本设置为 2.0。
:::

## Kotlin 编译器

![](/assets/kotlin-edu-sinicization/kotlin-compiler-9.png)

你曾在 IntelliJ IDEA 中见过的几乎所有检查。

::: info
最后一个阶段是诊断阶段，在此阶段我们会检查一些被禁止的情况。IntelliJ IDEA 中的几乎所有检查或编译时的错误都属于诊断范畴。在此阶段，编译器会再次遍历整个树结构，收集所有问题（包括错误和警告），将其显示给用户，如果存在错误，则停止执行。
:::

## Kotlin 编译器：诊断

![](/assets/kotlin-edu-sinicization/kotlin-compiler-diagnostics.png)

::: info
以上是一个诊断示例。
:::

## Kotlin 编译器

![](/assets/kotlin-edu-sinicization/kotlin-compiler-10.png)

在后端，我们**不进行解析**，仅使用接收到的信息

::: info
最后是后端。它接收前端生成的 FIR，并将其转换为平台代码。在后端，禁止对表示形式进行任何扩展（如解析），因为这些操作本应在前端完成。
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-11.png)

IR，一种与 FIR 略有不同的表示形式。

它仍然适用于所有平台。

::: info
第一阶段是 IR 生成。这实际上是中间层（位于前端和后端之间）的唯一阶段，但通常被视为后端的初始阶段。IR 生成器将 FIR 转换为 IR（中间表示）。FIR 完全对应源代码 —— 保留其词法结构（因为诊断需要），而 IR 用于代码生成，因此与源代码毫无对应关系。这是因为在后端，我们不需要前端推导出的所有信息（如完整的超类型列表等），而只需要必要的信息。
:::

## Kotlin 编译器：解析树

```Kotlin
fun hello(user: String) = println("Hello, $user")
```

::: info
请看以上代码片段作为示例。
:::

`public fun hello(user: kotlin.String): kotlin.Unit` _定义于文件 `Example.kt` 中的 `example` 包_

::: info
通过前端处理后，我们便知晓了该函数的完整声明，包括其访问修饰符、输入和返回类型的完全限定名称，以及它所在的文件。
:::

对值参数 `user: kotlin.String` 的引用，定义于 `example.hello` 中

::: info
我们也知道这个引用，包括它的声明位置和类型，
:::

`user` 类型：`kotlin.String`

::: info
该表达式，包括其类型，
:::

`"Hello, $user"` 类型：`kotlin.String`

::: info
该表达式，包括其类型，
:::

`println("Hello, $user")` 类型：`kotlin.Unit`

::: info
该表达式，包括其类型，
:::

调用：`kotlin.io.println(kotlin.String)`

::: info
以及该调用声明（包括被调用方的定义）。对于后端而言，如此详尽的描述毫无用处。因此，在转换为 IR 后，该树会被简化。
:::

## 中间表示？又是棵树！

代码：

```Kotlin
// file 'src/kotlin/example.kt'

package helloWorld

fun hello(user: String) = println("Hello, $user")

fun main(args: Array<String>) {
   val user = args[0]
   hello(user)
}
```

::: info
现在让我们来看看这段代码。
:::

它的 IR：

![](/assets/kotlin-edu-sinicization/ir-yet-another-tree.png)

::: info
这是该代码片段的 IR。看看吧，它的复杂程度绝对会让你大吃一惊！
:::

## 后端中间表示：深入解析

```Kotlin
fun hello(user: String) = println("Hello, $user")
```

![](/assets/kotlin-edu-sinicization/back-end-intermediate-representation-a-closer-look.png)

::: info
我们来看看对应于 `hello` 函数的那部分。
:::

![](/assets/kotlin-edu-sinicization/back-end-intermediate-representation-a-closer-look-2.png)

::: info
顶层节点描述了函数声明。
:::

![](/assets/kotlin-edu-sinicization/back-end-intermediate-representation-a-closer-look-3.png)

::: info
其中一个子节点描述了函数的唯一参数：`user`。
:::

![](/assets/kotlin-edu-sinicization/back-end-intermediate-representation-a-closer-look-4.png)

::: info
另一个子节点描述了函数体，它仅包含一个 `RETURN` 节点（因为单表达式函数就是返回唯一表达式值的函数）。
:::

![](/assets/kotlin-edu-sinicization/back-end-intermediate-representation-a-closer-look-5.png)

::: info
该表达式只是对标准库中 `println` 函数（更准确地说，是 `kotlin.io.println(Any?)` 函数）的调用。
:::

![](/assets/kotlin-edu-sinicization/back-end-intermediate-representation-a-closer-look-6.png)

::: info
该函数接受一个名为 `message` 的参数。此处的参数是一个字符串拼接，它包含两个参数：
:::

![](/assets/kotlin-edu-sinicization/back-end-intermediate-representation-a-closer-look-7.png)

::: info
常量字符串 `"Hello, "`
:::

![](/assets/kotlin-edu-sinicization/back-end-intermediate-representation-a-closer-look-8.png)

::: info
以及一个作为函数参数定义的字符串变量。
:::

## Kotlin 编译器

![](/assets/kotlin-edu-sinicization/kotlin-compiler-12.png)

特定于平台的代码，例如 JVM 的字节码

::: info
生成 IR 后，会对其进行优化。在此步骤中，编译器会执行适用于所有平台的优化操作，例如常量传播（将编译时常量替换为实际值）。
:::

![](/assets/kotlin-edu-sinicization/kotlin-compiler-13.png)

::: info
生成并优化 IR 后，它将由特定于平台的后端进行序列化或编译，转换为相应的平台格式（例如：针对 JVM 的 Java 字节码、针对 JS 平台的 JS 代码 —— 可能包含 TS 声明 —— 以及针对原生平台的机器码等）。
:::

## KLibs

JAR 类文件 —— 存储序列化的 IR，以便后续使用跨平台库。

![](/assets/kotlin-edu-sinicization/klibs.png)

::: info
假设你正在为多个平台编写一个 Kotlin 库。你有两种选择：为每个平台分别实现该库，或者只实现一次，然后将其代码编译并复用于所有平台。显然，第二种方案在维护、开发和测试方面都要简单得多。借助 Kotlin 多平台（Kotlin Multiplatform）概念，这完全可行。它允许你使用一种作为所有 Kotlin 方言（Kotlin/JVM、Kotlin/JS、Kotlin/Native 等）交集的 Kotlin 方言编写代码，随后该代码将像被复制粘贴一样，在每个平台上直接可用。因此，你可以通过编写通用代码，为所有平台实现共同的逻辑，且仅需实现一次。此外，你还可以选择在任意子集的平台之间共享代码，而非所有平台或仅限其中一个平台。当某些逻辑可抽象应用于部分平台（而非全部）时，此功能尤为实用。更进一步，你可以将实现委托给平台代码而非通用代码，这在逻辑决定了哪些声明可以抽象，但具体可抽象的实现因平台而异时，将极具价值。你可以在 Kotlin 文档的“多平台开发”章节中找到更多相关内容，建议从“代码共享原则”开始阅读。

但从编译器的角度来看，这究竟是如何运作的呢？其实，通用代码会首先被处理，生成 IR，随后该 IR 将在平台代码的编译过程中被使用。换句话说，你首先需要编译通用代码及其依赖项。在生成通用 IR 代码后，再利用该 IR、通用代码的依赖项以及平台代码的依赖项，分别编译各平台的代码。

但随后便会产生一个简单的问题：依赖项是以何种格式接收和使用的？例如，如果是 JVM 代码，可以编译为 Java 字节码并以这种形式使用。但这并不方便，而且共同代码也没有这样的格式。事实证明，答案同样简单：库是以序列化 IR 的形式共享的，这些 IR 被打包为独立的 ZIP 文件。此类文件称为 KLibs（即“Kotlin 库”），扩展名为 `.klib`。KLibs 与 JAR 文件非常相似。因此，任何多平台库都会以 KLib 文件的形式分发通用代码，并以特定于相应平台的格式分发平台代码。准确来说，源代码会被转换为优化的 IR，该表示既可以序列化为 KLib 文件以便日后反序列化并进一步使用，也可以与其他源（如 JVM、JS 或原生代码，或是其他依赖库中的 KLibs）结合，用于编译目标代码（JS/TS 代码、JVM 类或原生代码）。

幻灯片中的架构图可能包含多个不同平台的目标 —— 如 JVM、原生、JS、WASM 等。只是由于篇幅有限，无法全部展示。
:::

## 编译器插件

你可以通过编译器插件扩展**任何**编译阶段。为此，你需要实现编译器扩展并将其注册。

要注册扩展，你需要继承 [`CompilerPluginRegistrar`](https://github.com/JetBrains/kotlin/blob/master/compiler/plugin-api/src/org/jetbrains/kotlin/compiler/plugin/CompilerPluginRegistrar.kt)（旧版本中为 [`ComponentRegistrar`](https://github.com/JetBrains/kotlin/blob/master/compiler/plugin-api/src/org/jetbrains/kotlin/compiler/plugin/ComponentRegistrar.kt)）。

如果你需要支持 FIR 前端，请务必使用 `supportsK2 = true`

::: info
Kotlin 还有一个优势：你可以通过编译器插件扩展任何 Kotlin 编译器阶段。编译器插件会注册实现所需逻辑的编译器扩展。因此，它们应继承 `registrar` 类（参见幻灯片）。

请注意，Kotlin 编译器 API 目前处于实验阶段，这意味着即使是小版本更新之间也不兼容。

如果你感兴趣，这里有一篇关于创建自己的 Kotlin 编译器插件的教程（以系列文章的形式呈现），虽然内容稍显过时。
:::

### FIR 扩展

要查看扩展的完整列表，请参阅：`package org.jetbrains.kotlin.fir.extensions`（[链接](https://github.com/JetBrains/kotlin/tree/master/compiler/fir/providers/src/org/jetbrains/kotlin/fir/extensions)）。

举个例子：

```Kotlin
/*
 * 生成顶级类
 *
 * package foo.bar
 *
 * public final class MyClass {
 *     fun foo(): String = "Hello world"
 * }
 */
```

::: info
编译器扩展扩展了你需要扩展的阶段。你可以查阅 FIR 和 IR 扩展（参见幻灯片中的链接）。

以上是一个 FIR 扩展的示例，它创建了一个包含一个虚拟方法的虚拟类 `foo.bar.MyClass`。
:::

![](/assets/kotlin-edu-sinicization/compiler-plugins-fir-extensions.png)

::: info
首先需要了解的是 FIR 会话，它用于存储当前的编译器数据（例如编译器参数）。所有编译器逻辑组件（包括编译器插件）都会使用它。
:::

![](/assets/kotlin-edu-sinicization/compiler-plugins-fir-extensions-2.png)

::: info
其次是 `FirDeclarationGenerationExtension`。顾名思义，这是一个用于创建（生成）声明的扩展。我们在扩展中实现它，以创建我们自己的类 `foo.bar.MyClass`。
:::

![](/assets/kotlin-edu-sinicization/compiler-plugins-fir-extensions-3.png)

::: info
此外还有 `Name`、`FqName`、`ClassId` 和 `CallableId`。`Name` 仅存储函数、属性、类、类型别名等声明所使用的名称。`FqName` 表示任何实体的完全限定名称，且仅适用于完全限定名称的层级结构。
:::

![](/assets/kotlin-edu-sinicization/compiler-plugins-fir-extensions-4.png)

::: info
`ClassId` 表示分类器（即类、接口或对象）的 ID，并存储其包的完全限定名称等信息。类似地，`CallableId` 表示可调用项（例如函数、方法、属性获取器或设置器，或类构造函数）的 ID。

因此，我们刚刚定义了 `MY_CLASS_ID`（即我们类的 ID）和 `FOO_ID`（其方法的 ID），但目前尚未将它们告知编译器。
:::

![](/assets/kotlin-edu-sinicization/compiler-plugins-fir-extensions-5.png)

::: info
接下来，你可以描述如何在前端生成声明。实际上，`FirDeclarationGenerationExtension` 提供了一个 API，该 API 会调用 `getTopLevelClassIds` 和 `generateClassLikeDeclaration` 等函数，以获取新实体及其对应逻辑所需的必要信息。因此，你可以通过重写 `generateClassLikeDeclaration` 来生成类的本体。但逻辑生成通常在后端处理，前端仅保留模拟逻辑。这是因为声明实体并不困难，而逻辑生成本身在前端非常耗时，且前端仅需模拟逻辑即可。因此，我们采取这种方案：在重写的方法中编写模拟生成代码，并稍后通过后端扩展实现真正的逻辑生成。

至此，我们已说明了如何在检测到实体 ID 的瞬间生成其模拟版本，但尚未注册这些 ID。
:::

你可以使用一个特殊标记来标记编译器生成的**所有**内容，并在前端与后端之间传递**任何**信息。因此，这也有助于定位新的声明以生成其 IR。

![](/assets/kotlin-edu-sinicization/compiler-plugins-fir-extensions-6.png)

::: info
接下来是 `GeneratedDeclarationKey`。该类仅被对象继承。每个插件都有自己的键，用于标识这些实体属于编译逻辑的一部分。

例如，FIR 中的所有实体都拥有 `origin: FirDeclarationOrigin` 字段，该字段描述了它们的来源：它们是来自现有代码（如 Kotlin 和 Java 源代码及库），还是由 Kotlin 语言构造（如 SAM 构造器、合成实体等）生成，抑或是由编译器插件生成？由编译器插件生成的实体，其 `origin` 字段中存储着该插件的键。因此，该键标识了哪些实体是由插件生成的，并在创建类和函数时应使用该键。

你还可以使用此对象在前端和后端之间传递任何信息。
:::

请务必注册所有新的声明。

![](/assets/kotlin-edu-sinicization/compiler-plugins-fir-extensions-7.png)

::: info
现在，让我们向编译器告知我们要创建的实体。

正如我们之前讨论过的，我们需要重写一些函数，这些函数将向编译器（确切地说，是 `FirDeclarationGenerationExtension` 的 API）告知新的声明。这里，`getTopLevelClassIds` 应该返回我们顶级分类器的 ID（在本例中仅为 `foo.bar.Foo`），而 `hasPackage` 应该检查该完全限定名称是否代表扩展所创建的任何类的包。在本例中，出现的唯一包是 `foo.bar` 或 `MY_CLASS_ID.packageFqName`，因此我们只需检查它是否与该包的完全限定名称匹配。
:::

### IR 扩展

实际上，编译器针对 IR 只有一个扩展：[`IrGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/ir/backend.common/src/org/jetbrains/kotlin/backend/common/extensions/IrGenerationExtension.kt)。

你只需要实现一些*转换器*并将其注册即可：

```Kotlin
class SimpleIrGenerationExtension: IrGenerationExtension {
    override fun generate(moduleFragment: IrModuleFragment, pluginContext: IrPluginContext) {
        val transformers = listOf(SimpleIrBodyGenerator(pluginContext))
        for (transformer in transformers) {
            moduleFragment.acceptChildrenVoid(transformer)
        }
    }
}
```

别忘了检查键（使用 `interestedIn` 函数）！

::: info
这里我们正在实现后端扩展。实际上，IR 扩展只有一种类型。我们只需继承它并重写 `generate` 方法，该方法仅需创建必要的转换器并将其应用于 IR 树的叶节点（对应于 `IrModuleFragment`）。最后，每个继承了 `AbstractTransformerForGenerator` 抽象类的转换器都会执行逻辑生成。

另外，别忘了指定你只对标记了我们的键（`SimpleClassGenerator.Key`）的实体感兴趣。也就是说，要检查函数输入的 `key` 是否就是该键。
:::

### 常用插件

- [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) — 为可序列化类生成访问器代码。
- [all-open](https://kotlinlang.org/docs/all-open-plugin.html) — 将所有类标记为开放类。
- [kapt](https://kotlinlang.org/docs/kapt.html) — 一个注解处理器。
- [ksp](https://kotlinlang.org/docs/ksp-overview.html) — 用于开发轻量级编译器插件的 API。
- [Jetpack Compose](https://developer.android.com/jetpack/compose) — 根据声明式描述生成高效的用户界面。
- [Arrow Meta](https://github.com/arrow-kt/arrow-meta) — 支持所有 Arrow 库的编译器插件 API。
- ...
