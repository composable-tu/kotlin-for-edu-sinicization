# Kotlin 异步编程

::: info
本文翻译自：https://kotlinlang.org/education/
:::

## 本章覆盖

- 并行与异步编程
- 协程的发展历程
- Kotlin 协程
- 深入解析 CoroutineScope
- 通道
- 更多

::: info
本讲将介绍异步编程的概念。

首先，我们将探讨它与并行编程的区别，以及它如何解决并行编程中的一些问题。随后，我们将简要回顾其发展历程。之后，本讲的大部分内容将聚焦于 Kotlin 协程 —— 这是 Kotlin 语言中实现异步编程的一种方式。
:::

## 并行编程

![](/assets/kotlin-edu-sinicization/parallel-programming.png)

::: info
让我们回顾一下在 Kotlin 中进行并行编程时线程的状态。

如果线程将在稍后启动，则可以在“新建”（New）状态下创建；也可以在“就绪”（Runnable）状态下创建。向“就绪”状态的转换仅发生一次。

在某个时刻，线程可能会因异常、任务完成，或因中断信号（如果该信号在该线程中被处理）而过渡到“已终止”（Terminated）状态。（请记住，即使发送了中断信号，线程也不一定非要终止。这取决于开发者。）向“已终止”状态的过渡也仅发生一次。

在运行过程中，线程会在“就绪”、“运行”和“阻塞”（Blocked）状态之间切换。正如前几讲所述，就绪与运行之间的转换不由开发者控制，而是由 JVM 调度器控制，因此开发者几乎无法对其进行控制。

这便留下了最后也是最重要的转换：从运行到阻塞的转换。这一转换完全由开发者控制，因为它发生在线程尝试访问某些同步原语或进入休眠状态时。

这一点非常重要，因为这意味着开发并行应用程序的开发者必须非常关注如何管理共享资源、如何同步线程，以及线程在等待其他线程或外部事件时，有多少时间没有进行任何有用的工作。
:::

- 实际上，程序（线程）会花费大量时间等待从磁盘、网络等处读取数据。
- 可启动的线程数量受底层操作系统的限制（每个线程都需要占用一定数量的内存）。
- 线程并非廉价资源，因为它们需要进行成本高昂的上下文切换。
- 线程并非总是可用。某些平台（如 JavaScript）甚至不支持线程。
- 处理线程非常困难。线程中的错误（极其难以调试）、竞争条件和死锁，是多线程编程中我们常遭遇的常见问题。
- 因异常导致线程终止，这是一个值得单独列出的问题。

::: info
实际上，应用程序经常需要处理网络事务，且必须响应外部事件。这导致它们花费大量时间处于无所事事的状态。

针对大量线程因等待 I/O 操作完成而被阻塞的问题，似乎有一个显而易见的解决方案：我们只需增加线程数量，这样当部分线程被阻塞时，其余线程仍能完成更多有用的工作。然而，这种方法并不总是有效，因为应用程序可使用的线程数量存在上限。这一限制可能源于操作系统，也可能仅仅是因为内存不足，无法容纳所需数量的线程 —— 毕竟每个线程都需要数兆字节的内存来存储其栈等资源。

此外，单纯将线程数翻倍并不能使执行时间减半——因为线程越多，在开始执行有意义的工作之前，用于切换上下文以获取处理器执行权的时间就越多。~~创建两倍数量的线程并不会使执行速度提升两倍，因为更多的线程需要进行更多的上下文切换才能获得处理器执行权并开始实际执行有意义的工作。~~线程越多，用于管理这些线程而非实际执行工作的时间占比就越大。

此外，由于存在大量多线程特有的问题（如竞争条件和死锁），多线程应用程序需要对共享资源进行严格控制。一旦出现这些问题，调试和定位将极其困难。

另一个问题是，并非一切总能按计划进行，异常在所难免。当发生未处理的异常时，线程会终止，而这种情况从另一个线程中处理起来极其困难。
:::

## 一个例子

```Kotlin
fun postItem(item: Item) {
    val token = preparePost()
    val post = submitPost(token, item)
    processPost(post)
}

fun preparePost(): Token { // requestToken
    // 发起请求，从而阻塞执行线程
    return token
}
```

::: info
让我们来看一个简单的示例，说明有时需要通过多线程来解决的问题之一。

在这个示例中，我们有一个名为 `postItem` 的函数，它会调用另外两个函数，这些函数会发起网络请求。
:::

该代码在单线程环境中的执行方式

![](/assets/kotlin-edu-sinicization/parallel-programming-an-example.png)

::: info
假设我们有一个单线程应用程序，并且正在调用上一张幻灯片中的函数。
:::

期望结果

![](/assets/kotlin-edu-sinicization/parallel-programming-an-example-2.png)

::: info
我们希望线程始终在执行有用的操作，能够不间断地执行应用程序的代码。
:::

实际结果

![](/assets/kotlin-edu-sinicization/parallel-programming-an-example-3.png)

::: info
实际情况是这样的：当线程发起网络请求时，在请求完成之前它无法执行任何操作，因此会阻塞一段时间，无法继续执行代码。在此期间它处于空闲状态，即使获得 CPU 时间也不会执行任何指令。它只会一直卡在那里等待响应，一旦收到响应，又会发起新的请求并再次进入等待状态。
:::

采用多线程时会发生什么

![](/assets/kotlin-edu-sinicization/parallel-programming-an-example-4.png)

::: info
现在我们尝试让应用程序使用 3 个线程（而非 1 个），并调用该函数两次。

第一次调用被分配给线程 #2，第二次调用被分配给线程 #3。此时被阻塞的是这些线程，而非主线程，因此主线程可以继续执行有用的任务。

当线程获得结果后，它们通常需要以某种方式与主线程共享。这意味着必须使用某些同步机制，而这些机制很可能会阻塞线程，因此主线程在某个时刻仍会因获取第 2 号和第 3 号线程的结果而被阻塞。

既然有了更多线程，我们本应能处理更多工作。然而，实际情况却是我们面临了新的阻塞，整体的有效工作时间并未增加三倍。

此外，如果例如线程 #3 遇到某些意外异常，主线程就无法再向其发送任何任务。此时要么必须重启该线程，要么需要一个专门的协调线程来管理这些事务，这将进一步降低有效工作时间的比例。
:::

## 异步编程

::: info
异步编程是一种旨在解决其中大部分问题的编程范式。
:::

### 续体传递风格

```Kotlin
fun preparePostAsync(callback: (Token) -> Unit) {
    // 发起请求并立即返回
    // 安排稍后调用回调
}
```

回调的核心思想是将一个函数作为参数传递给另一个函数，并在处理完成后调用该函数。

```Kotlin
fun postItem(item: Item) {
    preparePostAsync { token ->
        submitPostAsync(token, item) { post ->
            processPost(post)
        }
    }
}
```

::: info
在续体传递风格中，原本返回 Token 的函数变成了一个接受回调函数的函数，而该回调函数又将 Token 作为其参数。

因此，与其在调用处等待函数的结果，不如将对结果应执行的操作传递给该函数，然后继续进行后续工作，而不是等待该函数完成。
:::

- 这个 `}` 通往~~“天堂阶梯”~~“回调地狱”。
- 错误处理在哪里？
- **回调本身并非“天生”就是异步的。**

::: info
译者注：这里的「天堂阶梯」化用了 Led Zeppelin 乐队名曲《Stairway to Heaven》的梗。原作用删除线把它替换成「回调地狱」，暗示层层嵌套的回调看起来像通往天堂的阶梯，实则是把代码拖入维护的“地狱”。
:::

::: info
这种方法中最显而易见的问题，就是大括号（`{`）的数量。你可以搜索“回调地狱”，找到现实生活中的例子，了解这种写法会变得多么难以阅读和难以维护。

我们曾提到异常处理是多线程中的一个问题，但在本语境下尚未探讨。在续体传递风格中，错误处理同样复杂，并导致更多冗余代码。需要注意的是，在续体传递风格中，不仅错误处理复杂，编写循环或简单的条件语句也颇具挑战。

最后但同样重要的是，续体传递风格本身并非异步的。当你调用 `postItem` 时，执行线程会等待其完成后才继续执行。将签名改为接受回调函数仅仅是语法上的改变。要使回调异步工作，每个回调都必须在某个执行器中启动，这样才不会占用主线程。
:::

### Future、Promise 及其他方法

`Promise<T>` 封装了回调函数。

```Kotlin
fun preparePostAsync(): Promise<Token> {
    // 发起请求，并返回一个稍后完成的 Promise
    return promise
}
```

::: info
异步编程中的另一种方法是 Promise。

在这种情况下，函数不接受回调，但也不会返回其原始返回类型。相反，它们会返回一个包裹结果的包装器。包装器是一种特殊类，它允许你等待结果，或者向该类传递一个回调，以便在结果出现时调用它。
:::

```Kotlin
fun postItem(item: Item) {
    preparePostAsync()
        .thenCompose { token -> submitPostAsync(token, item) }
        .thenAccept { post -> processPost(post) }
        …
}
```

- 这种模型有别于典型的自上而下的命令式方法。
- 不同库、框架和平台提供的 API 各不相同。
- 它使用 `Promise<T>` 返回类型，而非我们实际需要的值。
- 每次调用 `thenCompute`/`Accept`/`Handle` 都会创建一个新对象。
- 错误处理可能比较复杂。

::: info
这使得代码更加清晰，但仍非大多数开发者习惯的编码方式。

存在许多名称和 API 各异的 Promise 实现。

请注意，这些函数返回的是包装器，而非我们真正关心的实际类型。此外，这些包装器是对象，会占用相当多的内存。

错误处理可能比较复杂。循环也是如此，但它们比续体传递风格中的实现要简单得多。
:::

### Kotlin 协程

`suspend` —— Kotlin 中的一个关键字，用于标记可挂起函数。

```Kotlin
suspend fun submitPost(token: Token, item: Item): Post {
    ...
}

suspend fun postItem(item: Item) {
    val token = preparePost()
    val post = submitPost(token, item)
    processPost(post)
}
```

这段代码看起来和感觉上都是顺序执行的，让你可以专注于代码的逻辑。

::: info
还有另一种异步编程的方法，我们将在本次演示的最后讨论。不过，目前我们将重点介绍 Kotlin 推荐的方法。

Kotlin 提供了 `suspend` 关键字，用于标记那些在某个时刻需要等待（被阻塞）的函数，这意味着它们可以暂时从执行流程中移出，稍后再被恢复。使用此关键字标记的函数被称为挂起函数。

包含挂起函数的代码看起来像普通的顺序代码，但在底层，一切都是异步且高效地完成的。请注意，所有常规语言特性均可正常使用，异常处理也与往常一样。到目前为止，这段代码所需的条件并不比你编写的任何其他代码更多。（稍后情况会变得稍微复杂一些）。

IntelliJ IDEA 会在边栏（编辑器左侧区域）中用特殊标记标注对挂起函数的调用。
:::

## 协程的历史

### 历史与定义

- 梅尔文·康威（Melvin Conway）于 1958 年为其**汇编**程序创造了“协程”（coroutine）这一术语。
- 协程作为语言特性首次出现在 Simula’67 中，并配有 `detach` 和 `resume` 命令。
- 协程可以被视为一种**可挂起**计算的实例，即可以在某个点挂起，随后恢复执行，甚至可能在另一个线程上继续执行。
- 协程之间相互调用（并传递数据）可以构成**协作式多任务**处理的机制。
- Go’09、C#’12、Kotlin’17、C++’20、OpenJDK、Project Loom。

::: info
协程并非新概念。早在 Kotlin、Java 甚至 C 语言出现之前，它们就已经存在了。

Simula’67 是一门开创性的语言，它启发了 C++ 的诞生，而协程正是其核心特性之一。

在此背景下，Scheme（1975）也值得一提。它拥有“带当前续体的调用”（call-with-current-continuation）机制，这正是 Kotlin 协程的灵感来源。

协程可以构建基于协作式多任务模型的应用程序，而线程则主要在抢占式多任务环境中运行。

近年来，协程已逐渐被引入到许多编程语言中。
:::

### Kotlin

协程在 Kotlin 1.1 版本中首次引入，并在 1.3 版本中正式稳定。

- `suspend` – 用于标记可挂起函数的关键字。
- `kotlin.coroutines` – 标准库中的一小部分。
- `kotlinx.coroutines` – 包含所有必要功能的库。它不属于标准库，这意味着对宿主平台没有额外要求，从而简化了多平台开发。

协程是可挂起计算的实例。从概念上讲，它与线程相似，因为它执行一段代码，且具有类似的生命周期。它会被创建并启动，但并不绑定到任何特定的线程。它可能在一个线程中挂起执行，并在另一个线程中恢复。此外，就像 Future 或 Promise 一样，它可以返回某种结果（可能是值，也可能是异常）。

::: info
大部分协程功能由 `kotlinx.coroutines` 库提供。其主要优势在于，几乎无需额外工作即可让协程支持 Kotlin 编译器，因为协程在很大程度上可以通过现有的语言特性来表达。此外，任何人都可以编写自己的协程实现，而无需使用 Kotlin 团队提供的实现。
:::

## Kotlin 协程

### 底层原理

编译器会将你的 `suspend` 函数：

```Kotlin
suspend fun submitPost(token: Token, item: Item): Post {...}
```

转换为：

```Kotlin
fun submitPost(token: Token, item: Item, cont: Continuation<Post>) {...}
```

其中：

```Kotlin
public interface Continuation<in T> {
    public val context: CoroutineContext
    public fun resumeWith(result: Result<T>)
}
```

`Continuation<in T>` ∼ 泛型回调

::: info
因此，我们通过添加 `suspend` 修饰符将 `submitPost` 函数变成了一个挂起函数，而不知为何它也变成了异步的。为什么？

`suspend` 修饰符告诉编译器将该函数转换为另一种形式。

编译器会添加一个额外的最后一个参数，类型为 `Continuation`（这是一个泛型类），并且函数的返回类型被作为 `Continuation` 泛型的类型参数。

这看起来很像回调，实际上它确实是回调。因此，编译器将我们的函数转换为一个接受 `Continuation` 对象形式的回调的函数。

可以将 `Continuation` 视为一个对象，它代表了挂起调用下方所有的代码。
:::

包含挂起调用的代码：

```Kotlin
// postItem 中的代码
// 挂起调用 0
val token = preparePost()
// 挂起调用 1
val post = submitPost(token, item)
// 挂起调用 2
processPost(post)
```

::: info
我们已经了解了函数签名会发生什么，现在来看看函数主体会发生什么。

在函数内部，我们调用了三个函数，我们将它们都视为挂起函数。这样，编译器就知道在函数主体中还有 3 个挂起调用。
:::

编译结果（简化版）如下：

```Kotlin
// 此处代码创建了续体
when(continuation.label) {
    0 -> { // 挂起调用 0
        cont.label = 1;
        preparePost(cont);
    }
    1 -> { // 挂起调用 1
        val token = prevResult;
        cont.label = 2;
        submitPost(token, item, cont);
    }
    2 -> { // 挂起调用 2
        val post = prevResult;
        processPost(post, cont);
    }
}
// 此处还有更多代码
```

~~一个巨大的 `switch` 语句？？？~~其实是状态机！

每个标签都标记了一个挂起点。

::: info
这是对当前发生情况的简化表示。我们将在本讲的后续部分进行更详细的探讨。

函数体被转换为一个有限状态机，每个挂起调用都对应于该状态机中的一个标签。

函数的主要工作发生在 `when` 语句内部。它执行常规代码，但当需要调用其他挂起函数时，会将标签切换到下一个（即进行状态机转换），然后告知应用程序该函数可以被挂起并稍后恢复。这一过程发生在 `when` 语句之后，未在幻灯片中展示。

这里值得注意的是，尽管底层发生了相当复杂的操作，但额外的参数（续体/回调）仅在编译时出现。此外，状态机本身是一个轻量级对象，因为它存储的所有内容在函数执行期间本就会位于栈上（如其他函数调用的结果）。唯一额外的数据是标签，它是一个单一的整数。
:::

### 协程的状态

![](/assets/kotlin-edu-sinicization/state-of-a-coroutine.png)

::: info
这是将我们的示例函数作为有限状态机进行的可视化表示。

当发生某些情况时，它会更改内部的标签，然后进入挂起状态，在此状态下，它要么在等待特定事件，要么只是暂停一段时间。

当结果出现或执行器决定该函数可以继续执行时，它会被唤醒并进入下一个状态。该循环会重复进行，直到到达最终状态。从最终状态开始，执行控制将传递给最初作为参数传入该函数的延续。
:::

### 实践

现在我们终于可以在不阻塞执行线程的情况下发布条目了！

```Kotlin
fun nonBlockingItemPosting(...) {
    ...
    postItem(item)
}
```

::: info
现在我们有了承诺为异步的挂起函数 `postItem`，就可以在代码中使用它来发布内容，而不会阻塞执行线程。
:::

**挂起函数 `postItem` 只能从协程或另一个挂起函数中调用。**

挂起函数可不是随便就能走进去的。

::: info
但如果我们尝试从普通代码中调用这个函数，就会得到一个错误。

挂起函数用于让你的代码变为非阻塞。

这是通过标记代码中需要等待某些事情的点来实现的：在这些点上，代码可以从执行线程上移走，由其他可以立即执行的内容取而代之。

为了使之成为可能，必须存在那个「其他内容」，而它来自发起挂起调用所在的环境。这个环境就是 `CoroutineScope` 接口。
:::

::: info
译者注：「挂起函数可不是随便就能走进去的。」（One cannot just walk into a suspending function.）化用了《指环王》的名梗「One does not simply walk into Mordor」（魔多可不是随随便便就能走进去的）。
:::

## 深入解析 CoroutineScope

### 实践

`suspend` 函数可以从其他 `suspend` 函数中调用，或在 `CoroutineScope` 内调用。

```Kotlin
fun main() = runBlocking { // this: CoroutineScope
    launch { // 启动一个新协程并继续执行
        delay(1000L) // 非阻塞地延迟 1 秒（默认时间单位是毫秒）
        println("World!") // 在延迟之后打印
    }
    print("Hello ") // 前一个协程延迟期间，主协程继续执行
}
```

像 `launch` 这样的高阶函数被称为协程构建器（coroutine builder）。

::: info
尝试调用挂起函数时得到的错误告诉我们：这类函数只能从其他挂起函数中调用，或在 `CoroutineScope` 内调用。

如果我们尝试从另一个挂起函数中调用，也会遇到同样的问题：那个函数又该如何被调用呢？这意味着我们确实需要弄清楚 `CoroutineScope` 是什么。

在开发的早期阶段，它曾被称为 `CoroutineLifecycle`，这个名字能让我们对它的真实含义多一分线索。

这里的代码使用了 `runBlocking`，它创建了一个 `CoroutineScope`，终于可以在这个作用域中调用协程了。

`runBlocking` 是阻塞（普通）世界与协程之间的桥梁。它在生产环境中并不常见，你应当避免使用它，但它对示例和测试很有用（不过更推荐 `runTest`，它已经取代了 `runBlockingTest`）。

最后，在 `CoroutineScope` 内部，我们可以编写普通代码，也可以启动一个协程，让它在后台异步工作而不阻塞主执行线程。可以把 `launch` 理解为「发射后不管」（fire and forget）：代码不会等待 `launch` 做任何事情，它只是被丢进作用域里，在某个时刻被执行，而当前执行流程照常继续，仿佛什么都没发生。`launch` 接受一个挂起代码块作为参数，它将成为在新协程中执行的代码。像 `launch` 这种能让你创建新协程的东西被称为协程构建器（coroutine builder）。
:::

### 进阶实践

```Kotlin
val jobs: List<Job> = List(1_000_000) {
    launch(Dispatchers.Default + CoroutineName("#$it")
        + CoroutineExceptionHandler { context, error ->
            println("${context[CoroutineName]?.name}: $error")
        }, // CoroutineContext
        CoroutineStart.LAZY // 不立即启动
    ) {
        delay(Random.nextLong(1000))
        if (it % 10 == 0) { throw Exception("No comments") }
        println("Hello from coroutine $it!")
    }
}

jobs.forEach { it.start() }
```

接下来我们将逐步讲解这里面的所有内容。

::: info
既然我们已经知道了至少一种获取作用域的方法，就可以在其中编写这样的示例了。

这里我们通过调用一百万次 `launch`，创建了一个包含一百万个协程的列表。

每个 `launch` 的第一个参数是 `CoroutineContext`，第二个参数是启动类型，第三个参数是要执行的 lambda 代码块，并且每个 `launch` 都返回一个 `Job`。

启动类型由 `CoroutineStart` 枚举表示。这里我们传入 `CoroutineStart.LAZY`，意味着协程不会立即启动，而是在调用 `start()` 之后才开始。
:::

### 作用域与上下文

```Kotlin
public interface CoroutineScope {
    public val coroutineContext: CoroutineContext
}
```

很简单，不是吗？

::: info
`CoroutineScope` 是标准库提供的接口，其实现可以在 kotlinx.coroutines 中找到，也可以从头自行编写。这个接口只有一个字段 —— `CoroutineContext`。
:::

```Kotlin
public interface CoroutineScope {
    public val coroutineContext: CoroutineContext
}

public interface CoroutineContext {
    public operator fun <E : Element> get(key: Key<E>): E?
    …

    public interface Element : CoroutineContext {
        public val key: Key<*>
        ...
    }
}
```

你可以把上下文（context）想象成 `Map<Key<Element>, Element>`。

::: info
`CoroutineContext` 是一个用于存储协程执行环境信息的接口。

你可以把它看作一张从类到环境中该类实例（对象）的映射。

上下文中的每个元素本身也是一个上下文。这样设计是为了让上下文的操作更方便。例如，你只需创建一个 `CoroutineName` 实例就能得到一个上下文，然后只需使用为上下文重载的 `plus` 运算符，就能把 `CoroutineDispatcher` 加进来。

既然 `CoroutineScope` 只有一个属性 —— `CoroutineContext`，我们为什么还需要它呢？直接用 `CoroutineContext` 不能达到同样的效果吗？

这种划分是为了把协程的执行环境/状态（即上下文）与其行为/生命周期（即作用域）分离开来。在讨论结构化并发时，我们会再次回到这个思想。
:::

### `Job`

::: info
现在让我们来看看作用域或上下文中能找到什么，从 `Job` 开始 —— 我们已经见过它作为 `launch` 的返回类型。
:::

```Kotlin
public interface Job : CoroutineContext.Element {
    public companion object Key : CoroutineContext.Key<Job>
    public fun start(): Boolean
    public fun cancel(cause: CancellationException? = null)
    public val children: Sequence<Job>
    ...
}
```

- `Job` 是在后台执行的工作。
- 它是一个可取消的工作项，其生命周期以完成告终。
- `Job` 可以组织成父子层级结构。
- 子任务的失败会立即取消其父任务以及所有其他子任务。可以使用 `SupervisorJob` 定制这一行为。

::: info
`Job` 继承自 `CoroutineContext.Element`，而后者又继承自 `CoroutineContext`，这意味着 `Job` 也是一个上下文。

这里你可以看到 `Key` 通常是如何创建的：它是接口的伴生对象，实现了 `CoroutineContext.Key`，并以该类自身作为泛型参数。这样一来，这个特定接口的所有实例都共享同一个键，因此它是整个类/接口的键。

`Job` 代表一个协程，即在某处异步执行的后台工作。

它有我们已经见过的 `start()` 方法，以及许多其他方法 —— 例如 `cancel`，它允许你停止由这个 `Job` 表示的协程的执行。

`Job` 还保存着指向其所有子任务的链接 —— 即从这个特定的 `Job` 内部启动的所有其他协程。

取消时会发生什么，将在接下来的幻灯片中介绍。
:::

### `Job` 的状态

![](/assets/kotlin-edu-sinicization/job-states.png)

::: info
`Job` 的状态与 `Thread` 类似。

主要区别在于 `Job` 没有阻塞（blocked）状态，因为协程是挂起而不是阻塞。

此外，「已取消」（Cancelled）和「已完成」（Completed）状态都各自带有一个「-ing」进行中的对应状态。它们存在的原因是：协程只有在其所有子任务都完成时才算完成。

这意味着一个 `Job`（协程）可能已经成功完成了自己的全部工作，但随后它必须等待其子任务也完成，而其中一个子任务可能在这个阶段失败。如果发生这种情况，那么尽管 `Job` 本身成功了，与之关联的全部工作（包括其所有子任务）都已失败，并通过 `Job` 转换到「取消中」（Cancelling）、再到「已取消」（Cancelled）状态来发出信号。
:::

| 状态         | `isActive` | `isCompleted` | `isCancelled` |
| ------------ | ---------- | ------------- | ------------- |
| `New`        | `false`    | `false`       | `false`       |
| `Active`     | `true`     | `false`       | `false`       |
| `Completing` | `true`     | `false`       | `false`       |
| `Cancelling` | `false`    | `false`       | `true`        |
| `Cancelled`  | `false`    | `true`        | `true`        |
| `Completed`  | `false`    | `true`        | `false`       |

::: info
同样与 `Thread` 类似，有几个标志位在处理 `Job` 的状态时可能很有用。
:::

### 调度器

::: info
接下来我们要介绍调度器（dispatcher），它是 `kotlinx.coroutines` 中最重要的内容之一。
:::

```Kotlin
public abstract class CoroutineDispatcher : ... {
    ...
    public abstract fun dispatch(context: CoroutineContext, block: Runnable)
}
```

- `Dispatchers.Default` —— 一个共享的后台线程池，至少有 2 个线程，具体取决于 CPU 核心数的默认值。它是计算密集型协程的合适选择。
- `Dispatchers.IO` —— 一个共享的、按需创建线程的线程池，专为卸载 IO 密集型的阻塞操作（如文件/套接字 IO）而设计。

::: info
与 `Job` 一样，`CoroutineDispatcher` 继承自 `CoroutineContext.Element`，本身也是一个上下文。它内部同样有一个 `object : Key`。

调度器中最重要的东西是 `dispatch` 方法。

当我们讨论挂起函数会被编译成什么时，我们看过状态机，并提到一些事情也发生在 `when` 代码块之外。其中之一就是：函数通过这个方法，把自己的续体（转换后的状态机）作为可执行代码块传递给调度器。

因此，状态机切换标签、执行一些代码，然后从它的 `CoroutineContext` 中取出一个调度器，把自己交给调度器，以便稍后异步执行。对调度器的需要，正是挂起函数只能在 `CoroutineScope` 内调用的原因 —— 只有在作用域里才存在带有调度器的上下文。

调度器有好几种，每种都有自己的用途，因此了解何时使用哪一个非常重要。
:::

- `Dispatchers.Main` —— 限定在操作 UI 对象的主线程上的调度器。通常是单线程的；它不在核心库中，而是由 android、swing 等包提供。
- `Dispatchers.Unconfined` —— 非受限调度器，通常不应在代码中使用。
- 可以用 `newSingleThreadContext` 和 `newFixedThreadPoolContext` 创建私有线程池。（两者都标记为 `@ExperimentalCoroutinesApi`。）
- 可以通过以下方法创建一个调度器视图，保证同时执行的协程不超过 `parallelism` 个：

```Kotlin
// public abstract class CoroutineDispatcher 的方法
@ExperimentalCoroutinesApi
public open fun limitedParallelism(parallelism: Int): CoroutineDispatcher { ... }
```

任意 `ExecutorService` 都可以通过 `asCoroutineDispatcher` 扩展函数转换为调度器。

```Kotlin
interface ExecutorService : Executor {
    fun execute(command: Runnable) // Executor 是一个带有此方法的 SAM 接口
    ...
}

val myExecutorService: ExecutorService = ...
val myDispatcher = myExecutorService.asCoroutineDispatcher()
```

::: info
如果由于某种原因，`kotlinx.coroutines` 自带的调度器不适合你，你可以使用 `newSingleThreadContext` 或 `newFixedThreadPoolContext`，或者把一个执行器服务（如 `newFixedThreadPoolExecutor`）转换成调度器。
:::

### 一窥底层

```Kotlin
internal class GlobalQueue : LockFreeTaskQueue<Task>(singleConsumer = false)

internal class CoroutineScheduler(
    @JvmField val corePoolSize: Int, @JvmField val maxPoolSize: Int,
    @JvmField val idleWorkerKeepAliveNs: Long = ...,
    @JvmField val schedulerName: String = ...
) : Executor, Closeable {
    ...
    val globalCpuQueue = GlobalQueue()

    val globalBlockingQueue = GlobalQueue()
    ...
}
```

::: info
kotlinx.coroutines 中的每个调度器都是 `CoroutineScheduler` 的一个实现。

它们都包含待执行任务的队列。其中一个队列是全局的，在所有调度器之间共享。

被调用时，编译成状态机的挂起函数会切换标签、执行一些代码，然后从 `CoroutineContext` 中取出调度器，把自己的续体加入该调度器的队列，以便在有空闲时间时执行。
:::

```Kotlin
internal class CoroutineScheduler(...) : Executor, Closeable {
    ...
    val workers = AtomicReferenceArray<Worker?>(maxPoolSize + 1)

    fun dispatch(
        block: Runnable,
        taskContext: TaskContext = NonBlockingContext,
        tailDispatch: Boolean = false
    ) {
        ...
    }
}
```

::: info
其次，每个调度器都有一个 worker 池。`Default` 的 worker 数量等于 CPU 核心数，`IO` 的 worker 多得多，而 `Main` 应该只有一个。

在「并行编程」一讲中，原子操作（atomics）被标记为「危险地带」，而在这里我们可以看到，底层正是用原子操作来跟踪 worker 的。所以，尽管这是一种高效且底层的驱动协程抽象的方式，我们不建议大家在家自行模仿。

由于这是执行器接口的一个实现，它实现了 `dispatch`：在其中，可执行代码块被放入某个队列，等待稍后由 worker 取走。
:::

```Kotlin
internal inner class Worker private constructor() : Thread() {
    ...
    val localQueue: WorkQueue = WorkQueue()
    var state = WorkerState.DORMANT
    fun findTask(scanLocalQueue: Boolean): Task? {
        // localQueue -> globalBlockingQueue
        return task ?: trySteal(blockingOnly = true)
    }
}
```

::: info
worker 本身是 `Thread` 的子类，拥有自己的任务队列。

worker 的一个有趣之处在于：如果一个 worker 在自己的队列或所属调度器的队列中找不到工作，它可能会尝试从别处「偷」一些工作来做，以保持高效、始终有事可做。
:::

### 协程与线程

::: info
既然我们现在知道，协程在底层运行于 worker 之上，而 worker 是线程的子类，我们可能会问：使用协程相比使用线程池并把任务丢给它，好处在哪里？
:::

### 上下文相加

```Kotlin
val jobs: List<Job> = List(1_000_000) {
    launch(
        BaseContext
            + SupervisorJob()
            + CoroutineName("#$it")
            + CoroutineExceptionHandler { context, error ->
                println("${context[CoroutineName]?.name}: $error")
            }, // launch 的第一个参数是 CoroutineContext，这里是多个上下文之和
        ...
    ) { ... }
}
```

上下文可以相加。在这种情况下，同一个 `Key` 取最右边的值作为结果上下文。
由于每个 `Element` 都实现了 `CoroutineContext`，这看起来就像是元素求和。

::: info
首先，我们来看如何对上下文求和：

```
Context1 = Dispatcher1 + ExceptionHandler
Context2 = Dispatcher2 + CoroutineName
Context1 + Context2 -> ExceptionHandler + Dispatcher2 + CoroutineName
Context2 + Context1 -> CoroutineName + Dispatcher1 + ExceptionHandler
```

对于每个 `Key`，取最右边的值作为新上下文。
:::

### 上下文切换

```Kotlin
suspend fun preparePost(): Token = withContext(Dispatchers.IO) { ... }

// submitPost 同样使用 withContext(Dispatchers.IO)

suspend fun processPost(post: Post) =
    withContext(Dispatchers.Default) { ... }

suspend fun postItem(item: Item) {
    val token = preparePost()
    val post = submitPost(token, item)
    processPost(post)
}

// 在我们应用代码的某处，有一个 View 和一个与之关联的 CoroutineScope
viewScope.launch {
    postItem(someItem)
    // 以某种方式在 UI 中展示结果
}
```

::: info
如我们所见，调度器有好几种，各有用途。

还有一个有用的函数 `withContext`，它允许你更改上下文的某些部分，而无需启动新协程。

前面提到过，上下文的各个部分本身也是上下文，可以求和。`withContext` 会把作为参数传入的内容加到调用处的上下文上。

在上面的例子中，它只是用来为每个函数更换调度器，也就是说，每个函数都明确指定了自己应该在哪个 worker 线程池上执行。
:::

### 这究竟比线程好在哪里？

![](/assets/kotlin-edu-sinicization/coroutines-vs-threads-timeline.png)

::: info
想象 `viewScope` 使用的是 `Main`，它通常与应用程序的 UI 相关联。
:::

![](/assets/kotlin-edu-sinicization/coroutines-vs-threads-timeline-2.png)

::: info
我们在 `Main` 调度器的 `viewScope` 中调用这个函数。
:::

![](/assets/kotlin-edu-sinicization/coroutines-vs-threads-timeline-3.png)

::: info
它将上下文切换到 IO，以阻塞/等待的方式获取一些数据。
:::

![](/assets/kotlin-edu-sinicization/coroutines-vs-threads-timeline-4.png)

::: info
IO 线程等待数据被取回。
:::

![](/assets/kotlin-edu-sinicization/coroutines-vs-threads-timeline-5.png)

::: info
`submitPost` 也在 IO 上工作，所以我们不单独画出来。
:::

![](/assets/kotlin-edu-sinicization/coroutines-vs-threads-timeline-6.png)

::: info
然后为 `process` 函数把调度器切换到 Default。
:::

![](/assets/kotlin-edu-sinicization/coroutines-vs-threads-timeline-7.png)

::: info
最后，调度器切换回 Main，结果显示在用户界面中。
:::

![](/assets/kotlin-edu-sinicization/coroutines-vs-threads-timeline-8.png)

::: info
这一切的意义何在？在所有这些发生的过程中，用户一直可以与 UI 交互，因为主执行线程在任何时候都没有等待什么，也没有与任何东西同步。
:::

![](/assets/kotlin-edu-sinicization/coroutines-vs-threads-timeline-9.png)

::: info
在现实中，画面会更像这样。

Main 始终忙于处理用户事件或界面更新。

IO 线程数量众多，不断地从网络或磁盘获取数据。

处理（Default）线程在执行计算，可能遇到错误；这些错误可能会显示在 UI 中，但不会影响应用程序的整体工作流程。

译者注：幻灯片上穿插的「harder, better, faster, stronger」是 Daft Punk 乐队名曲《Harder, Better, Faster, Stronger》的梗。
:::

### 协程 – 纤程 – 线程

```Kotlin
fun main(): Unit = runBlocking {
    repeat(1_000_000) { // it: Int
        delay(Random.nextLong(1000))
        println("Hello from coroutine $it!")
    }
}
```

::: info
让我们再与线程做一次对比，尝试同时启动一百万个协程。它们只是简单的协程：随机延迟一段时间，然后打印。
:::

**不对！** 默认行为是顺序执行的，你必须主动要求并发。

::: info
但这不是启动协程的正确方式。

按我们这样的写法，一切都只是在 `runBlocking` 创建的作用域内工作。没有任何东西被移到后台，这意味着这个例子中不会发生任何并发。
:::

```Kotlin
fun main(): Unit = runBlocking {
    repeat(1_000_000) { // it: Int
        launch { // 新的异步活动
            delay(1000L)
            println("Hello from coroutine $it!")
        }
    }
}
```

协程就像轻量级线程。

::: info
通过把代码放进 `launch` 调用中，我们请求在后台某处执行这段代码，并且不等它完成就继续执行下一条语句 —— 在这个例子中就是循环的下一次迭代。这样，我们实际上会创建一百万个同时在后台运行的协程。
:::

```Kotlin
fun main(): Unit {
    repeat(1_000_000) { // it: Int
        thread { // 新线程
            sleep(1000L)
            println("Hello from thread $it!")
        }
    }
}
```

::: info
这个例子可以很容易地改写成线程版本。

我们去掉 `runBlocking`，因为启动线程不需要它。

我们把创建协程的 `launch` 换成创建线程的 `thread`。

我们把挂起的 `delay` 换成线程的 `sleep`。
:::

```
Exception in thread "main" java.lang.OutOfMemoryError: unable to create native thread: possibly out of memory or process/resource limits reached.
```

::: info
这样做时，我们会遇到一个问题：在大多数机器上，不可能同时创建一百万个线程。
:::

::: info
这里最重要的结论是：协程不是线程。

它们解决的问题相似，但总体而言，它们的构建方式不同。
:::

### 线程切换问题

::: info
我们知道，协程通过调度器在调度器线程池中的某个线程上获得执行时间。问题在于，我们不知道具体哪个线程会接管我们的挂起函数或其续体，这可能会给毫无准备的开发者带来意想不到的问题。
:::

### 一个重要的「不保证」

不保证协程会在同一个线程上恢复，因此在持有任何监视器（monitor）锁时调用挂起函数要非常小心。

```Kotlin
val lock = ReentrantLock()

suspend fun russianRoulette() {
    lock.lock()
    pullTheTrigger()
    lock.unlock()
}
```

解锁可能发生在另一个线程上。
墨菲定律：「凡是可能出错的事，就一定会出错。」
那么 `unlock` 将抛出 `IllegalMonitorStateException`。

::: info
`Lock` 的限制之一是：`unlock` 只能由当前持有锁的线程调用。

如果你获取了某个锁，然后调用一个挂起函数，你的续体将被放入调度器的任务队列，而另一个 worker —— 也就是另一个线程 —— 可能会取走它并尝试释放锁。

此时，一个棘手的异常将被抛出。

解决这个问题的一种办法是在协程中不使用同步机制，但还有另一种办法。
:::

### 互斥

互斥（Mutual Exclusion）==> `Mutex`。

```Kotlin
val mutex = Mutex() // .lock() 会挂起，.tryLock() 不会挂起
var counter = 0

suspend fun withMutex() {
    repeat(1_000) {
        launch {
            // 用锁保护每次自增
            mutex.withLock { counter++ }
        }
    }
    println("Counter = $counter") // 保证输出 `1000`
}
```

::: info
在多线程应用程序中，锁用于互斥。

在协程中，互斥使用 `Mutex`。

它的一个缺点是没有 `ReentrantMutex`（类似 `ReentrantLock`），所以要小心，不要尝试两次获取同一个 `Mutex`。
:::

### 异常

::: info
当协程中发生异常时会发生什么？首先，当然可以在 try/catch 块中处理它。
但如果任何异常没有通过 catch 处理，那它就是一个未处理的异常，它会停止协程的执行并离开协程本身。
:::

### 异常处理

```Kotlin
public interface CoroutineExceptionHandler : CoroutineContext.Element {
    public companion object Key : CoroutineContext.Key<...>
    public fun handleException(context: CoroutineContext, exception: Throwable)
}
```

- 子协程会把处理委托给父协程。
- 使用 `SupervisorJob` 运行的协程不会把异常传播给父协程。
- `CancellationException` 会被忽略。
- 如果上下文中存在 `Job`，则调用 `Job.cancel`。
- 所有通过 `ServiceLoader` 找到的 `CoroutineExceptionHandler` 实例都会被调用。
- 当前线程的 `Thread.uncaughtExceptionHandler` 会被调用。

::: info
上下文中可以存在一个 `ExceptionHandler`，但它不是解决问题的第一选择。

如前所述，协程保存着指向其子协程的链接，每个子协程也可以访问其父协程。

当未处理的异常发生时，协程会停止（取消），取消其所有子协程，然后尝试把这个异常传递给它的父 `Job`。

`SupervisorJob` 会忽略其子任务的异常，要求子任务使用自己的 `CoroutineExceptionHandler` 自行处理；而普通的父 `Job` 则会取消自身及其所有子任务，然后使用它自己的 `CoroutineExceptionHandler`。如果某个已经存在一个未处理异常的子任务中又发生了另一个未处理异常，后者将成为前者中的抑制异常（suppressed exception）。

如果没有 `CoroutineExceptionHandler`，异常会像线程中的未处理异常一样处理：在服务（services）中查找处理器。
:::

### 异常的传播

![](/assets/kotlin-edu-sinicization/exception-propagation.png)

::: info
想象我们有一个根 `Job`，它内部调用了一个 `launch`，而这个 `launch` 又调用了另一个 `launch`。与此同时，根 `Job` 中还创建了一个带有两个子任务的 `SupervisorJob`。
:::

**场景一**

![](/assets/kotlin-edu-sinicization/exception-propagation-2.png)

::: info
现在想象 `SupervisorJob` 的一个子任务中发生了未处理异常，导致该子任务被取消。
:::

![](/assets/kotlin-edu-sinicization/exception-propagation-3.png)

::: info
这个子任务会尝试把处理委托给它的父任务。
:::

![](/assets/kotlin-edu-sinicization/exception-propagation-4.png)

::: info
由于父任务是 `SupervisorJob`，它不会做任何响应。又由于没有专门的 `CoroutineExceptionHandler`，这个异常很可能会通过 `Thread.uncaughtExceptionHandler` 处理，记录到 stderr。
:::

**场景二**

![](/assets/kotlin-edu-sinicization/exception-propagation-5.png)

::: info
现在让我们想象根 `Job` 的第一个子任务有一个处理器。
:::

![](/assets/kotlin-edu-sinicization/exception-propagation-6.png)

::: info
而另一个 `launch` 中发生了异常。
:::

![](/assets/kotlin-edu-sinicization/exception-propagation-7.png)

::: info
那个协程被取消，并把异常传递给它的父任务。
:::

![](/assets/kotlin-edu-sinicization/exception-propagation-8.png)

::: info
尽管父任务有处理器，它也不会被使用，异常会被传递给根 `Job`。
:::

![](/assets/kotlin-edu-sinicization/exception-propagation-9.png)

::: info
遇到来自子任务的异常后，根 `Job` 会取消其所有子任务。
:::

![](/assets/kotlin-edu-sinicization/exception-propagation-10.png)

![](/assets/kotlin-edu-sinicization/exception-propagation-11.png)

![](/assets/kotlin-edu-sinicization/exception-propagation-12.png)

::: info
最终，一切都会被取消。

如果根 `Job` 并不是真正的根，而是某个其他任务的子任务，那么在取消其所有子任务之后，它会把异常继续传递给它的父任务，以此类推。
:::

### 现在你明白了

```Kotlin
val jobs: List<Job> = List(1_000_000) {
    launch(Dispatchers.Default + CoroutineName("#$it")
        + CoroutineExceptionHandler { context, error ->
            println("${context[CoroutineName]?.name}: $error")
        },
        CoroutineStart.LAZY
    ) {
        delay(Random.nextLong(1000))
        if (it % 10 == 0) { throw Exception("No comments") }
        println("Hello from coroutine $it!")
    }
}

jobs.forEach { it.start() }
```

如果这段代码不在 `SupervisorJob` 内，这个异常处理器就毫无用处。

::: info
既然我们已经知道协程中异常是如何处理的，就可以说：在我们的示例中，如果这个 `Job` 列表不是在 `SupervisorJob` 内创建的，`ExceptionHandler` 可能毫无用处，因为在这种情况下它永远不会被用到。
:::

### 错误处理

```Kotlin
fun main() = runBlocking { // 根协程
    val job1 = launch {
        delay(500)
        throw Exception("Some jobs just want to watch the world burn")
    }
    val job2 = launch {
        println("Going to do something extremely useful")
        delay(10000)
        println("I've done something extremely useful")
    }
}
```

job1 中的异常 -> 传播给父任务 -> job2 被取消

::: info
想象我们的作用域中有两个 `Job`，其中一个极其重要。

它启动后开始执行重要的工作，但随后某个不那么重要的任务失败了，导致这个重要的 `Job` 被取消 —— 真是太扫兴了。

译者注：异常信息「Some jobs just want to watch the world burn」化用了电影《蝙蝠侠：黑暗骑士》中小丑的台词「Some men just want to watch the world burn」（有些人就是想看着这个世界燃烧）。
:::

```Kotlin
fun main() {
    val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    with(scope) {
        val job1 = launch {
            throw Exception("Some jobs just want to watch the world burn")
        }
        val job2 = launch {
            delay(3000)
            println("I've done something extremely useful")
        }
    }
    scope.coroutineContext[Job]?.let { job ->
        runBlocking { job.children.forEach { it.join() } }
    } // `job1.join()` 会抛出异常，所以 `it.join()` 实际上应该放在 `try/catch` 块中
}
```

::: info
相反，对于这种情况，我们应该使用 `SupervisorJob`，以保证其他协程中的错误无法取消我们的重要工作。

这也是一个如何在不使用 `runBlocking` 或挂起函数的情况下启动协程的示例。

最后几行极其重要，因为在根 `Job`（及其所有子任务）完成之前，它们能防止你的应用程序退出。
:::

```Kotlin
fun main() {
    // `someScope: CoroutineScope` 已经存在
    someScope.launch { // 这个协程是 someScope 的子任务
        supervisorScope { // 内部是一个 SupervisorJob
            val job1 = launch {
                throw Exception("Some jobs just want to watch the world burn")
            }
            val job2 = launch {
                println("Going to do something extremely useful")
                delay(3000)
                println("I've done something extremely useful")
            }
        }
    }
    ...
}
```

::: info
有一个方便的 `supervisorScope` 函数，它会把作用域中的 `Job` 替换为 `SupervisorJob`。
如果你已经在某个特定作用域中工作，这会非常有用。
:::

```Kotlin
fun main() {
    val scopeWithHandler = CoroutineScope(CoroutineExceptionHandler {
        context, error -> println("root handler called")
    })
    scopeWithHandler.launch {
        supervisorScope {
            launch { throw Exception() }
            launch(CoroutineExceptionHandler { context, error ->
                println("personal handler called")
            }) { throw Exception() }
        }
    }
    ...
}
```

异常不会传播给父任务，这意味着你可以覆盖处理器。

::: info
最后，我们知道上下文是继承的，只有在使用 `withContext` 或类似函数时，其中的一部分才会被替换。

如果我们把一个 `ExceptionHandler` 放在根 `Scope`（它的上下文）中，它将被所有在 `SupervisorJob` 下创建的子任务使用。
:::

### 结构化并发

::: info
协程构成父子层级结构、异常被传播且永不丢失、所有工作被组织进作用域 —— 这些特性共同构成了结构化并发（structured concurrency）方法，它比传统的多线程编程更容易驾驭。
:::

### 错误处理（再谈）

```Kotlin
fun processReferences(refs: List<Reference>) {
    for (ref in refs) {
        val location = ref.resolveLocation()
        GlobalScope.launch {
            val content = downloadContent(location)
            processContent(content)
        }
    }
}
```

下载在后台启动。
`GlobalScope` —— 这是一个需要谨慎使用的 API（delicate API）。请务必完整阅读并理解任何被标记为 delicate API 的声明的文档。其「微妙」之处在于：`GlobalScope` 没有附加任何 `Job`，这使得它的使用既危险又不便。
任何 `downloadContent` 或 `processContent` 的崩溃都会导致协程泄漏。

::: info
想象你需要处理一个引用列表，每个引用都需要一次阻塞式的网络获取，并且你需要它们要么全部成功，要么全部失败。

你可能会尝试写这样的代码来处理这个引用列表。

这里我们第一次见到 `GlobalScope`。它在 kotlinx.coroutines 开发早期被引入，以便更容易地完成某些任务，但现在可以认为它已被弃用，因为它在很大程度上抛弃了结构化并发的思想。在这个作用域中启动的任何东西都表现得像普通线程：它自顾自地活着，其中的错误也会丢失。

问题在于，如果其中任何一个下载失败，其他下载会在毫不知情的情况下继续，而这些工作最终可能毫无用处、白白浪费时间。我们可以通过创建一个共享的同步标志来解决这个问题，但那是多线程的做法，不是协程的正确道路。
:::

### 结构化并发

```Kotlin
suspend fun processReferences(refs: List<Reference>) {
    coroutineScope { // 新的作用域：沿用外部上下文，但有一个新的 Job
        for (ref in refs) {
            val location = ref.resolveLocation()
            launch { // 上面这个 coroutineScope 的子任务
                val content = downloadContent(location)
                processContent(content)
            }
        }
    }
}
```

一旦 `downloadContent` 或 `processContent` 崩溃，异常会传给 `coroutineScope`，后者保存着指向所有子协程的链接，会将它们取消。这就是结构化并发的一个例子 —— 一个线程中并不存在的概念。

::: info
相反，我们可以把函数改成挂起函数，并借助 `coroutineScope` 高阶函数在其中创建一个作用域。

这样，我们会在函数内部创建一个独立的 `Job`，它会收纳启动的协程，并在其中一个下载失败时取消所有其他下载。
:::

### 一个有用的约定

这个函数耗时较长，需要等待某些事情：

```Kotlin
suspend fun work(...) { ... }
```

这个函数启动更多后台工作并很快返回：

```Kotlin
fun CoroutineScope.backgroundWork(...) {
    launch { ... }
}
```

或者：

```Kotlin
fun CoroutineScope.moreWork(...): Job = launch { ... }
```

而不要这样：

```Kotlin
suspend fun CoroutineScope.dontDoThisPlease()
```

::: info
挂起函数是一段需要时间来完成、并可能在某个点被挂起的工作。一串挂起函数调用可以看作典型的同步代码，只是其中穿插了一些其他工作。

同时，某些工作可以通过 `launch` 或其他协程构建器移到后台，这些构建器可以在 `CoroutineScope` 内或挂起函数中调用。

我们有一个约定来帮助你避免混淆这两者：
会挂起的工作应该放在挂起函数中。这样用户就知道：执行会在被调用的挂起函数完成后继续，期间可能涉及挂起并让其他工作使用执行线程。
发生在后台的工作应该放在 `CoroutineScope` 的扩展函数中，这告诉用户：这项工作在同一个作用域内完成，但它发生在别处，执行会跳到 `launch` 之后的代码。

这也是 `CoroutineContext` 与 `CoroutineScope` 之间一个非常重要的区别。尽管后者只是一个只有单个 `CoroutineContext` 类型属性的简单接口，但它被设计为对协程的结构负责（就像这个约定所体现的那样），而 `CoroutineContext` 只是一个数据存储。
:::

```Kotlin
fun CoroutineScope.processReferences(refs: List<Reference>) {
    for (ref in refs) {
        val location = ref.resolveLocation()
        launch { // coroutineScope 的子任务
            val content = downloadContent(location)
            processContent(content)
        }
    }
}
```

::: info
使用这个约定，我们可以把函数改写成这样。

现在，如果用户写：

```Kotlin
// refs 已存在
val msg = "A message"
processReferences(refs)
println(msg)
```

他们应该预期代码几乎会立即打印消息，即使下载内容需要很长时间。这是因为对他们的执行线程来说：先创建了一条消息，然后一些工作被启动到后台（这很快），接着消息就被打印出来，而不等待那些后台工作完成。
:::

### 协程的取消

```Kotlin
val job = launch(Dispatchers.Default) {
    repeat(5) {
        println("job: I'm sleeping $it...")
        Thread.sleep(500) // 模拟阻塞式工作
    }
}
yield() // 让子 job 有机会工作
println("main: I'm tired of waiting!")
job.cancel() // 取消 `job`
job.join() // 等待 `job` 完成
println("main: Now I can quit.")
```

协程（job）并不知道有人正试图取消它。
取消是协作式的（cooperative）。

::: info
想象我们有一个在循环中执行阻塞式工作的协程。

在某个时刻，我们可能想要取消它 —— 要么是为了停止应用程序，要么只是因为我们不再需要它工作。

由于我们持有 `Job` 的引用，我们会尝试调用它的 `cancel` 方法。

问题在于，在这个例子中，协程内部的代码并不知道自己可以被取消，就像线程中的代码可能不知道有人正试图中断该线程一样。

所以在这个例子中，最后一条消息会在大约 2500 毫秒后才打印出来，因为必须先等 `Job` 完成。
:::

```Kotlin
val job = launch(Dispatchers.Default) {
    repeat(5) {
        try {
            println("job: I'm sleeping $it...")
            delay(500)
        } catch (e: CancellationException) {
            println("job: I won't give up $it")
        }
    }
}
yield()
println("main: I'm tired of waiting!")
job.cancelAndJoin() // cancel + join
println("main: Now I can quit.")
```

::: info
在另一种情况下，如果协程内部有任何其他挂起调用，那么我们知道它们会被编译成状态机。
在状态机转换之后，编译后的代码会检查协程是否已被取消。如果是，那么 `CancellationException` 会在某个挂起点被抛出，就像线程中抛出 `InterruptedException` 一样。

同样，在这段代码中我们捕获了那个异常并继续我们的工作 —— 这不是好的设计，尽管有时它可能有用。
:::

```Kotlin
val job = launch(Dispatchers.Default) {
    var i = 0
    while (isActive && i < 5) { // 检查 Job 状态
        println("job: I'm sleeping ${i++}...")
        Thread.sleep(500)
    }
}
delay(1300L)
println("main: I'm tired of waiting!")
job.cancelAndJoin()
println("main: Now I can quit.")
```

::: info
我们已经看到，`Job` 是有状态的，协程可以访问自己 `Job` 的状态。

所以，除了依赖特定的挂起点抛出 `CancellationException` 之外，你还可以使用 `isActive` 标志来检查协程是否已被要求取消。

即使协程内部的代码没有任何挂起点，这种方法也有效。
:::

```Kotlin
val job = launch {
    try {
        repeat(1_000) {
            println("job: I'm sleeping $it...")
            delay(500L)
        }
    } finally {
        withContext(NonCancellable) {
            println("job: I'm running finally")
            delay(1000L)
            println("job: Delayed for 1 sec thanks to NonCancellable")
        }
    }
}
...
job.cancelAndJoin()
```

::: info
在某些情况下，你可能确实需要让某段工作无法被取消。针对这种极其罕见的场景，有一个特殊的 `CoroutineContext.Element` 名为 `NonCancellable`，它禁止取消这个协程。例如，它有时被用在 `finally` 块中来释放资源。
:::

## 通道

::: info
协程还让实现异步通道（channel）成为可能。
:::

### 通信顺序进程

`Channel` 类似 `BlockingQueue`，但用挂起调用代替阻塞调用。

- 阻塞的 `put` → 挂起的 `send`
- 阻塞的 `take` → 挂起的 `receive`
- 没有共享可变状态！
- 通道仍处于实验阶段

```Kotlin
public interface Channel<E> : SendChannel<in E>, ReceiveChannel<out E> {
    ... suspend fun send(element: E)
    ... suspend fun recieve(): E
    ...
}
```

还有 `trySend` 等不会等待的函数。

::: info
通信顺序进程（Communicating Sequential Processes，CSP）是异步编程的又一个方面。在这种模型中，不同并发进程的工作通过通道来编排，通道允许发送和接收消息。

可以把通道想象成一个消息队列，消息在不同的地方被发送和接收，而不需要共享可变状态。

通道的一些特性仍处于实验阶段，但它们大部分已经稳定，并将留在 kotlinx.coroutines 中。
基础接口是 `SendChannel` 和 `ReceiveChannel`，它们的功能合并在 `Channel` 接口中。
:::

### 实践

```Kotlin
fun main() = runBlocking {
    val channel = Channel<Int>()
    launch {
        for (x in 1..5)
            channel.send(x * x)
    }
    repeat(5) {
        println(channel.receive())
    }
    println("Done!")
}
```

::: info
在这个例子中，创建了一个整数通道。

然后启动一个协程，向这个通道发送整数。

主执行线程接收并打印这些整数。

最终，所有整数都会被打印出来 —— 而没有使用任何同步机制。
:::

### 素数

```Kotlin
fun CoroutineScope.numbersFrom(start: Int) = produce<Int> {
    var x = start
    while (true) send(x++) // 从 start 开始的无限整数流
}

fun CoroutineScope.filter(numbers: ReceiveChannel<Int>, prime: Int) =
    produce<Int> { for (x in numbers) if (x % prime != 0) send(x) }

fun main() = runBlocking {
    var cur = numbersFrom(2)
    repeat(10) {
        println(cur.receive())
        cur = filter(cur, prime)
    }
    coroutineContext.cancelChildren()
}
```

::: info
这是一个更复杂的例子，其中两个 `ReceiveChannel` 由 `produce` 协程构建器创建。

第一个 `ReceiveChannel` 生成无限整数序列，第二个接收第一个发来的整数，并过滤掉所有能被给定整数整除的数。

然后在 main 函数中，从第二个通道接收整数。不过每次接收后，都会用上一个通道和最后接收到的整数，通过第二个函数创建一个新通道。

最终，这就是用通道实现的埃拉托色尼筛法（sieve of Eratosthenes）的简短实现。
:::

### 扇入与扇出

```Kotlin
fun <T> CoroutineScope.production(ch: SendChannel<T>, msg: T) =
    launch { while (true) { delay(Random.nextLong(23)); ch.send(msg) } }

fun <T> CoroutineScope.processing(ch: ReceiveChannel<T>, name: String) =
    launch { for (msg in ch) { println("$name: received $msg") } }

fun main() = runBlocking {
    val channel = Channel<String>()
    listOf("foo", "bar", "baz").forEach { production(channel, it) }
    repeat(8) { processing(channel, "worker #$it") }
    delay(700)
    coroutineContext.cancelChildren(CancellationException("Enough!"))
}
```

::: info
在这个例子中，首先创建了一个通信通道。

然后有三个生产者，每个都在一段随机的时间间隔后把自己的消息发送到通道中。

接着有八个 worker，接收这些消息并打印到控制台。

同样，这个例子中没有使用任何同步机制。有 3 个写入者和 8 个读取者，却没有任何数据竞争。

最后，为了停止应用程序，当前上下文的所有子任务（包括生产者和读取者）都被取消。
:::

### 细节

- 通道仍处于实验阶段。
- 通道是公平的（fair）：`send` 和 `receive` 调用按先进先出（FIFO）顺序被服务。
- 默认情况下，通道的容量为 `RENDEZVOUS`：完全没有缓冲区。这一行为可以调整：用户可以指定缓冲区容量、缓冲区溢出时的行为，以及如何处理未送达的元素。

::: info
通道像队列一样，遵循 FIFO 顺序。

也和队列一样，它们内部有缓冲区容量，默认是 `RENDEZVOUS`，意味着容量恰好为 1。不过，它可以被改为任意缓冲区大小。
:::

### `select`（实验性！）

```Kotlin
suspend fun selector(
    channel1: ReceiveChannel<String>,
    channel2: ReceiveChannel<String>
): String = select<String> {
    // select 中的 onReceive 子句在通道关闭时会失败
    channel1.onReceive { it: String -> "b -> '$it'" }
    channel2.onReceiveCatching { it: ChannelResult<String> ->
        val value = it.getOrNull()
        if (value != null) {
            "a -> '$value'"
        } else {
            "Channel 'a' is closed" // Select 不会停止！
        }
    }
}
```

::: info
通道还支持一个有趣且实验性的 `select` 表达式，你可以在文档中阅读更多相关内容。
:::

## 更多

### 异步编程之外

::: info
到目前为止，我们讨论的还只是协程如何让你进行异步编程，但它们的用途不止于此。
:::

### 序列

```Kotlin
val fibonacci = sequence { // 一个协程构建器！
    var cur = 1
    var next = 1
    while (true) {
        yield(cur) // 一个挂起调用！
        cur += next
        next = cur - next
    }
}

val iter = fibonacci.iterator() // 此时什么都没有发生
println(iter.next()) // 执行到第一个 yield -> 1
println(iter.next()) // 唤醒并继续 -> 1
println(iter.next()) // 2，然后一路奔向无限
```

::: info
协程也是序列（sequence）的基础。

序列是一个内部带有 `Job` 的小作用域，它允许你只在你需要的时候才计算值。

从某种意义上说，每算出一个值并被取走后，序列就会挂起，直到再次被调用。

译者注：代码注释「to infinity and beyond」（飞向宇宙，浩瀚无垠）是《玩具总动员》中巴斯光年的口头禅。
:::

### 底层原理：进阶

还记得这段代码吗？

```Kotlin
suspend fun postItem(item: Item) {
    val token = preparePost()
    val post = submitPost(token, item)
    processPost(post)
}
```

现在我们知道得更多了，让我们更精确地看看底层到底发生了什么。

```Kotlin
fun postItem(item: Item, completion: Continuation<Any?>) {

    class PostItemStateMachine(
        completion: Continuation<Any?>?,
        context: CoroutineContext?
    ): ContinuationImpl(completion) {
        var result: Result<Any?> = Result(null)
        var label: Int = 0

        var token: Token? = null
        var post: Post? = null
        ...
    }
}
```

::: info
挂起函数会被编译成一个增加了 `Continuation<T>` 类型参数的函数。

在这个函数内部，声明了该函数的状态机类。

这个类存储通常位于函数栈上的东西，比如中间值。

此外，这个类有一个标签（label）和一个特殊字段，用于保存该函数中最近计算出的结果。它既用于存储正确的结果，也用于追踪某个时刻是否发生了异常。
:::

```Kotlin
fun postItem(item: Item, completion: Continuation<Any?>) {

    class PostItemStateMachine(...): ... {
        ...
        override fun invokeSuspend(result: Result<Any?>) {
            this.result = result
            postItem(item, this)
        }
    }

    val continuation = completion as? PostItemStateMachine ?: PostItemStateMachine(completion)
    ...
}
```

::: info
第一次调用这个函数时，传入的续体是它下方的所有代码。

而下方的代码并不是这个函数的状态机，所以在第一次运行时，它会被包装进该状态机的一个新实例中，原始的续体被传给状态机，以便状态机在完成其内部所有工作、得到原始续体所需的结果之后调用它。

一旦这个实例被创建，在每次标签切换之后，函数（状态机）会以这个新实例调用自身，并完成类型转换，从而避免在后续的挂起和恢复中创建新的状态机。
:::

```Kotlin
...
when(continuation.label) {
    0 -> { ... }
    1 -> {
        continuation.token = continuation.result.getOrThrow() as Token
        continuation.label = 2
        submitPost(continuation.token!!, continuation.item!!, continuation)
    }
    2 -> { ... }
    3 -> {
        continuation.finalResult = continuation.result.getOrThrow() as FinalResult
        continuation.completion.resume(continuation.finalResult!!)
    }
    else -> throw IllegalStateException(...)
}
...
```

::: info
然后进入 `when` 部分：检查当前的标签，执行与当前标签对应的代码，并转换到新状态。

在最后一个标签中，它调用最初传入函数的原始续体。

在这个 `when` 之下、状态转换之后，状态机会被交给上下文中存在的调度器，以便在有 worker 可用时被调用。在那里还会检查协程是否被外部取消了。
:::

### 续体：作为泛型回调

::: info
我们已经多次遇到的 `Continuation` 是一个泛型回调，这是理解协程背后机制的关键。
:::

回顾一下 `Continuation` 的样子：

```Kotlin
public interface Continuation<in T> {
    public val context: CoroutineContext
    public fun resumeWith(result: Result<T>)
}
```

给定：

```Kotlin
suspend fun suspendAnswer() = 42
suspend fun suspendSqr(x: Int) = x * x
```

如何在不使用 kotlinx.coroutines 的情况下运行 `suspendSqr(suspendAnswer)`？

::: info
我们知道，挂起函数会被编译成一个期待传入续体的东西。

kotlinx.coroutines 为我们提供了几种创建作用域并在其中调用挂起函数的方法。

但如果我们想在不使用 kotlinx.coroutines 的情况下调用挂起函数呢？
那么我们就需要向编译后的函数传递一个 `Continuation` 的实现。
:::

`Continuation` 是一个泛型回调，所以我们可以回到续体传递风格：

```Kotlin
fun main() {
    ::suspendAnswer.startCoroutine(object : Continuation<Int> {
        override val context: CoroutineContext
            get() = CoroutineName("Empty Context Simulation")

        override fun resumeWith(result: Result<Int>) {
            val prevResult = result.getOrThrow()
            ::suspendSqr.startCoroutine(
                prevResult,
                Continuation(CoroutineName("Only name Context")) {
                    it: Result<Int> -> println(it.getOrNull())
                }
            )
        } // 哦不！
    }) // 右括号大军正在逼近！
} // 救命！我正被拖进回调地狱！！！
```

::: info
每个挂起函数的命名空间中都有一个 `startCoroutine` 方法，它可以用来在没有任何作用域、也不在挂起函数内的情况下调用该函数。

这个示例展示了两种在不使用 kotlinx.coroutines 的情况下调用挂起函数的方式。

第一种调用中，向函数提供了一个就地实现的 `Continuation`。

第二种调用中，使用了标准库的 `Continuation(...)` 函数来实例化该接口的一个匿名实现。

第三种（也是显而易见的）方式是为 `Continuation` 编写一个完整的类，并在需要时使用它 —— 这正是 kotlinx.coroutines 所做的。
:::

### 包装已有的异步代码，还是自己实现？

::: info
并非所有代码天然就是挂起的，你可能想把一些阻塞调用包装进协程，以便在异步应用中正确使用它们。
:::

```Kotlin
suspend fun AsynchronousFileChannel.aRead(b: ByteBuffer, p: Int = 0) =
    // 方案：call-with-current-continuation（call/cc）
    suspendCoroutine { cont ->
        // CompletionHandler ~ Continuation
        read(b, p.toLong(), Unit, object : CompletionHandler<Int, Unit> {
            override fun completed(bytesRead: Int, attachment: Unit) {
                cont.resume(bytesRead)
            }

            override fun failed(exception: Throwable, attachment: Unit) {
                cont.resumeWithException(exception)
            }
        })
    }
```

::: info
标准库提供了一个特殊的高阶函数，让你可以从阻塞代码或其他库中已有的异步代码切换到 Kotlin 协程。你所要做的只是写出调用你的函数的方式，并把它的结果传递给协程中出现的续体。
:::

```Kotlin
fun main() = runBlocking {
    val readJob = launch(Dispatchers.IO) {
        val fileName = ...
        val channel = AsynchronousFileChannel.open(Paths.get(fileName))
        val buf = ByteBuffer.allocate(...)
        channel.use { // `try { ... } finally { channel.close() }` 的语法糖
            while (isActive) {
                ... = it.aRead(buf)
                ...
            }
        }
    }
    ...
}
```

::: info
下面展示了这段代码现在如何在协程中使用。
:::

```Kotlin
suspend fun cancellable(…) =
    suspendCancellableCoroutine { cancellableCont ->
        cancellableCont.invokeOnCancellation { throwable: Throwable? ->
            // 释放资源等
            ...
        }

        ...

        cancellableCont.cancel(…)
    }
```

::: info
还有 `suspendCancellableCoroutine`，用于你希望能够取消被挂起的工作的场景。
:::

### `async` / `await`

```Kotlin
async Task PostItem(Item item) {
    Task<Token> tokenTask = PreparePost();
    Post post = await SubmitPost(tokenTask.await(), item);
    ProcessPost();
}
```

- `async` 和 `await` 是 C# 中的关键字。
- 等待（await）不会阻塞重量级的操作系统线程。
- `await` 是一个显式的挂起点。
- `await` 是单个函数，但根据环境不同，它可以产生两种不同的行为。
- C# 的方案是 Kotlin 团队设计协程时的重要灵感来源，对 Dart、TS、JS、Python、Rust、C++ 等也是如此。

::: info
我们还没有介绍的最后一种异步编程方法 —— 但绝非不重要，因为它是 Kotlin 协程最强烈的灵感来源 —— 就是 C# 引入的 `async` / `await`。

它添加了一个特殊的修饰符，用于标记在执行过程中可以挂起的函数。

与 promise 一样，返回类型变为 `Task<T>`，而不再是简单的 `T`。
:::

```Kotlin
fun CoroutineScope.preparePostAsync(): Deferred<Token> = async<Token> { ... }

suspend fun postItem(item: Item) {
    coroutineScope {
        val token = preparePost().await()
        val post = submitPost(token, item).await()
        processPost(post)
    }
}
```

`Deferred<T> : Job` 是一个可以从中获取结果的 `Job`。`async` 只是另一个协程构建器。在 Kotlin 中你可以写出完全一样的代码！

但你为什么要这样做呢？这不是符合 Kotlin 习惯（idiomatic）的写法。

::: info
在 Kotlin 中，`async` 只是另一个协程构建器。

唯一的区别是它提供了 `Job` 的另一种实现 —— `Deferred<T>`，它有一个 `await` 方法。

对于普通的 `Job`，你知道它在后台做着什么，并且可以通过调用 `join` 等待它完成。

而对于 `Deferred<T>`，你还知道结果的类型 `T`，并且可以通过调用 `await` 来请求结果，甚至挂起直到结果出现。
:::

```Kotlin
suspend fun postItemAsyncAwait(item: Item) {
    coroutineScope {
        val deferredToken = async { preparePost() }
        // 一些工作
        val token = deferredToken.await()
        val deferredPost = async { submitPost(token, item) }
        // 更多工作
        val post = deferredPost.await()
        processPost(post)
    }
}
```

::: info
这是一个使用 `async` / `await` 的代码示例。
:::

### 协程构建器

::: info
`async` 只是另一个协程构建器，但还有更多。
:::

#### 琳琅满目！

```Kotlin
public fun CoroutineScope.launch(
    context: CoroutineContext,
    start: CoroutineStart,
    block: suspend CoroutineScope.() -> Unit // 挂起 lambda
): Job
public fun <T> future(...): CompletableFuture<T> // jdk8/experimental
public fun <T> CoroutineScope.async(...): Deferred<T>
public fun <T> runBlocking(...): T // 避免使用它
public fun <E> CoroutineScope.produce(
    context: CoroutineContext,
    capacity: Int,
    @BuilderInference block: suspend ProducerScope<E>.() -> Unit
): ReceiveChannel<E>
```

还有更多！比如 `actor`。

::: info
`launch` 是最常见的一个，我们已经见过很多次了。

`future` 是为让从 Java 迁移更容易而设计的协程构建器。

`runBlocking` 也算协程构建器，因为它会创建一个根（父）协程，等待其中所有代码完成后才停止。

`produce` 创建一个与 `Channel` 配合工作的协程。
:::

#### `actor`

Actor ∼ 协程 + 通道

```Kotlin
// counterActor 的消息类型 —— 命令模式
sealed class CounterMsg
// 单向的自增消息
object IncCounter : CounterMsg()
// 带回复的请求
class GetCounter(val response: CompletableDeferred<Int>) : CounterMsg()
```

::: info
`actor` 是一个有趣的协程构建器，可以用来按 `actor` 模型工作。

`actor` 代表一个在后台执行某些工作的实体，它可以接收和发送消息，与其他 `actor` 通信。

消息通常用命令模式（command pattern）的类来表示。
:::

```Kotlin
// 这个函数启动一个新的计数器 actor
fun CoroutineScope.counterActor() = actor<CounterMsg> {
    var counter = 0 // actor 的状态
    for (msg in channel) { // 遍历传入的消息
        when (msg) {
            is IncCounter -> counter++
            is GetCounter -> msg.response.complete(counter)
        }
    }
}
```

通常会被封装到一个单独的类中。

::: info
这里你可以看到一个 `actor`，它准备好接收其通道中的消息并处理它们。

`actor` 是一个让你可以体验 Actor 模型思想的协程构建器，但通常 actor 会被写成单独的类，封装一个 `Channel` 和一个 `Job`。
:::

### Android

访问 [developer.android.com](https://developer.android.com)，了解协程在现代 Android 开发中（被大量）如何使用。

```Kotlin
class MyViewModel: ViewModel() {
    init {
        viewModelScope.launch { ... }
    }
}
```

- 应用中的每个 `ViewModel` 都定义了一个 `ViewModelScope`。
- 每个 `Lifecycle` 对象都定义了一个 `LifecycleScope`。
- 本讲未涉及的 `Flow` 在 Android 中很常见。

::: info
协程在 Android 开发中被大量使用。

几乎每个应用的每个视图都有一个关联的 `CoroutineScope`，可以在其中启动后台工作。

这非常有用，因为一旦用户离开某个视图、其关联的作用域被取消或销毁，应用就可以停止所有不必要的工作。
:::

### 延伸阅读

- github.com/Kotlin/KEEP/ —— Kotlin 设计提案，包括协程
- kotlinlang.org ——「Coroutines overview」与「Official libraries/`kotlinx.coroutines`」
- github.com/Kotlin/`kotlinx.coroutines` —— 一份文档完善的资源
- Roman Elizarov 在 YouTube 上的演讲和在 Medium 上的文章
- `Flow<T>` —— 异步流（Asynchronous Flow）
- Kotlin 源码：github.com/JetBrains/kotlin/
- 本演示中的所有代码可以在 github.com/bochkarevko/kotlin-things/ 的 coroutines 目录中找到
