# 并行与并发编程

::: info
本文翻译自：https://kotlinlang.org/education/
:::

## 定义

根据维基百科：

- **并行计算**（Parallel computing）是一种“同时执行多个计算或进程”的计算方式。
- **并发计算**（Concurrent computing）是一种让多个计算在重叠的时间段内并发执行——而不是顺序执行——的计算方式。

可以只有并行而没有并发，也可以只有并发而没有并行。

**动机**

- 更快的运行速度
- 更好的响应性

::: info
并行计算与并发计算之间的区别可能并不明显，但它非常重要，因为这意味着你可以拥有：

- 一个并行的应用
- 一个并发的应用
- 一个既并行又并发的应用

使用并行的主要动机是提升代码性能，因为它允许你将工作负载拆分成可以同时执行的块，从而减少完成整个任务所花费的时间。

并发的主要动机是提升响应性。早在多核处理器出现之前，人们就已经利用并发来实现正常的用户界面了。
:::

## 并行 vs 并发

![](/assets/kotlin-edu-sinicization/parallelism-vs-concurrency.jpg)

::: info
这些图片展示了并行与并发之间的区别。

“核心”既可以是能够执行指令的物理 CPU 核心，也可以是分布式系统中的不同机器，等等。
:::

## 并发：进程 vs 线程

- 单线程进程
- 多线程进程

![](/assets/kotlin-edu-sinicization/concurrency-processes-vs-threads.jpg)

::: info
操作系统以进程为单位工作。每个进程拥有自己的（虚拟）内存，执行自己的代码，并从操作系统持有自己的资源（如文件描述符）。

出于安全考虑，进程通常无法访问其他进程的内存。

而线程则在单个进程内工作，这意味着它们共享虚拟内存和资源，但每个线程拥有自己的寄存器、栈（帧）和程序计数器（即正在执行的代码位置）。
:::

## 抢占式 vs 协作式调度

- 抢占式（Preemptive）：由操作系统中断任务
- 协作式（Cooperative）：由任务主动让出控制权

![](/assets/kotlin-edu-sinicization/preemptive-vs-cooperative-scheduling.jpg)

::: info
调度有多种模型，主要区别在于：由谁（或什么）来决定切换执行上下文，以及在何时切换。

在抢占式模型中，由操作系统调度器决定每个线程何时获得处理器时间、获得多少时间。用户对此的控制非常有限，因此在他们看来，调度基本上是随机的。

在协作式模型中，存在一些特定的、可以切换执行上下文的点。用户不知道哪些任务会被选中，但他们知道切换可能发生在哪里。
:::

## JVM 中的并行与并发编程

JVM 拥有自己的调度器：

- 它独立于操作系统的调度器
- 一个 JVM 线程 != 一个操作系统线程
- => 多线程的 JVM 应用可以运行在单线程的操作系统上（比如 DOS）

JVM 线程要么是守护线程（daemon），要么是用户线程（user thread）。

- 当所有用户线程结束时，应用就会停止。
- JVM 不会等待守护线程结束。

::: info
本讲只覆盖 Kotlin/JVM，因为 Kotlin/Native 的 API 尚不稳定，而且 Kotlin/Common 中（目前）根本没有并行编程 API。

通常，JVM 线程与操作系统线程是 1 对 1 映射的，但这并不是对 JVM 实现的强制要求，因此 N 对 1（如 DOS）或 1 对 N 的映射也是可能的。

用户线程用于常规任务，而守护线程用于日志之类的服务——它们并非必不可少，也就是说，即使它们的部分工作丢失也无关紧要。
:::

## JVM 中的并行编程

两个 Java 包：

- `java.lang` 包含基本原语：`Runnable`、`Thread` 等
- `java.util.concurrent` 包含同步原语和并发数据结构

Kotlin 包：

- `kotlin.concurrent` —— 对 Java 类的封装与扩展

## 回顾：单抽象方法接口

```Java
@FunctionalInterface
public interface Runnable {
   public abstract void run();
}
```

只有一个方法的接口。我们可以用 lambda 来实例化它。

```Kotlin
class RunnableWrapper(val runnable: Runnable)

val myWrapperObject =
   RunnableWrapper(
       object : Runnable {
           override fun run() {
               println("I run")
           }
       }
   )
val myWrapperLambda = RunnableWrapper { println("yo") }
```

::: info
让我们回顾一下上一讲讲过的单抽象方法接口（SAM）。

只需以 lambda 的形式提供那一个抽象方法的实现，就可以实例化它们。

`Runnable`——我们接下来的主题——是一个极其常见的接口，在 JVM 并行编程中被广泛使用。
:::

## 创建线程的方式

你可以继承 `Thread` 类，它同样实现了 `Runnable`。

```Kotlin
class MyThread : Thread() {
   override fun run() {
       println("${currentThread()} is running")
   }
}

fun main() {
   val myThread = MyThread()
   myThread.start()
}
```

::: info
`Thread` 是 JVM 中用来表示“可在独立线程上运行的工作”的类。

`Thread` 实现了上一张幻灯片提到的 `Runnable` 接口。

你可以继承 `Thread` 类、实现 `run` 方法，并在整个应用中使用它。
:::

### `run` vs `start`

永远不要调用 `Thread.run()`！

`run` 会在你当前的线程上执行，而 `start` 会创建一个新线程，并在新线程上执行 `run`。

```Kotlin
fun main() {
   val myThread1 = MyThread()
   myThread1.start() // 正确
   val myThread2 = MyThread()
   myThread2.run() // 当前线程被阻塞
}
```

::: info
由于 `Thread` 实现了 `Runnable`，你确实可以调用 `run`，但不应该这么做。`run` 只是“应该在独立线程上运行的代码”，直接调用它会让这段代码在调用它的线程上执行（没有任何并行性）。正确的做法是使用 `start` 来启动线程，它会把 `run` 的执行转移到独立的线程上，并且不会阻塞调用 `start` 的线程。
:::

### 实现 Runnable 接口

你可以实现 `Runnable` 接口并把它传给线程。同一个 `Runnable` 可以传给多个线程。

```Kotlin
fun main() {
   val myRunnable = Runnable { println("Sorry, gotta run!") }
   val thread1 = Thread(myRunnable)
   thread1.start()
   val thread2 = Thread(myRunnable)
   thread2.start()
}
```

::: info
一个更简单的方式是实现 `Runnable` 接口，然后把得到的类传给线程。

注意，`Thread` 是一个类，继承它意味着你不能再继承其他类。而 `Runnable` 是一个接口，实现它的类可以参与任何你想要的继承体系。

另一个好处是，你可以把同一个 `Runnable` 实例传给多个线程。当然，对于这些 runnable 或线程可能共享的任何资源，你都必须（一如既往地）小心。
:::

### Kotlin 的方式

Kotlin 有一种更简单的创建线程的方式，但在底层，创建和启动的还是那个老样子的线程。

```Kotlin
import kotlin.concurrent.thread

fun main() {
   val kotlinThread = thread {
       println("I start instantly, but you can pass an option to start me later")
   }
}
```

这是创建线程的首选方式。

::: info
`thread` 是一个 Kotlin 高阶函数，它接受一个 lambda（即 `run` 方法的实现），创建一个新线程并立即启动它。

你可以在文档中了解更多内容。

`thread` 还接受若干参数，对应 `Thread` 的各项属性，我们将在下一张幻灯片中介绍。例如，`thread(start = false, name = "Threadripper") { ... }` 会创建一个不会立即启动、且名为 “Threadripper” 的线程。
:::

## 线程属性

线程启动后，其属性不能再更改。

线程的主要属性：

- `id: Long` —— 线程的标识符
- `name: String`
- `priority: Int` —— 取值范围是 1 到 10，值越大优先级越高
- `daemon: Boolean`
- `state: Thread.state`
- `isAlive: Boolean`

::: info
优先级是一种请求调度器给某个线程分配更多或更少处理器时间的方式。
:::

## 线程的状态

| 状态            | `isAlive` |
| --------------- | --------- |
| `NEW`           | `false`   |
| `RUNNABLE`      | `true`    |
| `BLOCKED`       | `true`    |
| `WAITING`       | `true`    |
| `TIMED_WAITING` | `true`    |
| `TERMINATED`    | `false`   |

::: info
`state` 是具体的状态，而 `isAlive` 是一个更容易理解的标志位，只是表示线程正在执行某些东西。

当线程已创建但尚未启动时，它没有任何东西可执行，因此不是存活的。

显然，当线程完成了所有工作、或者遇到错误之后，它也不是存活的。

“阻塞”状态有好几种，因为线程可能因为不同的原因被阻塞：

- Blocked 表示它在等待某些操作系统事件，比如向 socket 写入数据。
- Waiting 表示它在等待某些资源，比如锁或条件。
- Timed waiting 表示线程正在睡眠，或者正在执行带超时的阻塞操作。
  :::

### 状态转换图

![](/assets/kotlin-edu-sinicization/thread-state-transition.png)

::: info
Runnable 状态表示线程“可以被执行”，也就是说，是否真的执行它由调度器决定。调度器可以在任意时刻、在代码的任意语句处把线程从处理器上移走（将其挂起）。

Running 方框是虚线的，因为我们可以把它看作一个虚拟状态。

为“Running”单独设立一个 `Thread.state` 是没有意义的，因为等你拿到这个信息时，调度器很可能已经把线程移回 Runnable 状态了。

线程只能从 Running 状态进入 Waiting 或 Blocked 状态，因为线程必须执行特定的操作才能阻塞自己或开始等待。
:::

## 操作线程状态的方法

- `val myThread = thread { ... }` —— 创建一个新线程
- `myThread.start()` —— 启动线程
- `myThread.join()` —— 让当前线程等待另一个线程结束
- `sleep(...)` —— 让当前线程睡眠
- `yield()` —— 尝试后退一步
- `myThread.interrupt()` —— 尝试中断一个线程
- `myThread.isInterrupted()` —— 检查线程是否被中断
- `interrupted()` —— 检查并清除中断标志

::: info
需要注意，`sleep` 是 `Thread` 类的静态方法。你可能会想这样写：

```Kotlin
val myThread = thread { ... } // 做一些工作
myThread.sleep(...)
```

然而，这会让**当前线程**睡眠，而不是 `myThread`，因为它是静态方法。

`yield()` 和 `interrupted()` 同样是静态方法。

`yield()` 是建议调度器把某个线程从执行中移走，不过调度器可以无视这个建议。
:::

## `sleep`、`join`、`yield`、`interrupt`

- `sleep` 和 `yield` 方法只适用于当前线程，这意味着你无法让另一个线程挂起。
- 所有阻塞和等待方法都可能抛出 `InterruptedException`。

::: info
阻塞和等待方法包括 `sleep` 和 `join`，以及各种等待资源的方法，我们稍后会讲到它们。
:::

## 经典的 Worker

```Kotlin
class ClassicWorker : Runnable {
   override fun run() {
       try {
           while (!Thread.interrupted()) {
               // 做一些工作
           }
       } catch (e: InterruptedException) {} // 完全合法的空 catch 块
   }
}
```

::: info
如果循环内部存在等待或阻塞操作，就会抛出 `InterruptedException`。

这里最主要的结论是：对可能的线程中断做出响应是我们自己的责任。线程不会仅仅因为有人发送了中断信号就停止工作。
:::

## 并行与共享内存：交错问题示例

并行线程可以访问同一块共享内存。

这常常导致在单线程环境中不可能出现的问题。

```Kotlin
class Counter {
   private var c = 0

   fun increment() {
       c++
   }
   fun decrement() {
       c--
   }
   fun value(): Int {
       return c
   }
}
```

对 `c` 的两个操作看起来都是单一、简单的语句。

然而，即使简单的语句也可能被虚拟机翻译成多个步骤，而这些步骤可能交错执行。

假设 Thread#1 和 Thread#2 同时调用 `increment`。如果 `c` 的初始值是 0，它们交错的动作可能遵循以下顺序：

```
T#1: Read value 0 from c.
T#2: Read value 0 from c.
T#1: Increment value — result is 1.
T#1: Write result 1 to c.
T#2: Increment value — result is 1.
T#2: Write result 1 to c.
```

::: info
共享内存下的并行执行是一种非常容易产生错误的方式。这里是一个简单的例子，展示使用它时可能出现的问题。

看起来对变量 `c` 的两个操作都是单一、简单的语句。然而，即使简单的语句也可能被虚拟机翻译成多个步骤，而调度器可能切换线程的执行，使得这些操作交错发生。

结果是，你可能会遇到从应用逻辑角度看并不合法的状态，就像这个例子：对 `increment` 的两次连续调用，结果 `c` 的值是 1，而不是期望的 2。

这类问题在存在共享可变状态时就会出现——这正是支持不可变性和函数式编程的有力论据。
:::

## 同步机制

- 互斥，例如 `Lock` 和 `synchronized` 关键字
- 并发数据结构和同步原语
- 直接操作共享内存的原子类（危险地带）

::: info
同步机制帮助我们修复在可变共享状态环境中出现的问题。

我们将按照难度递增的顺序介绍其中 3 种。
:::

## 锁

```Kotlin
class LockedCounter {

   private var c = 0

   private val lock = ReentrantLock()

   fun increment() {
       lock.withLock { c++ }
   }

   // 其他方法同理
   …

}
```

::: info
引自 Oracle 文档：

> 锁是一种控制多个线程对共享资源进行访问的工具。

通常，锁提供对共享资源的独占访问：同一时刻只有一个线程能获取锁，而且所有对共享资源的访问都要求先获取锁。只有一个线程 => 互斥。

```Kotlin
lock.withLock { block }
```

是一个很有用的 Kotlin 高阶函数，它几乎等同于：

```Kotlin
lock.lock()
block
lock.unlock()
```

已经获取锁但尚未释放锁的代码称为“临界区”（critical section）——程序中需要与其他线程同步的部分。
:::

## `Lock` 接口

- `lock.lock()` —— 获取锁
- `lock.tryLock()` —— 尝试获取锁
- `lock.unlock()` —— 释放锁
- `lock.withLock { }` —— 在持有锁的情况下执行 lambda（内部有 try/catch）
- `lock.newCondition()` —— 创建一个与该锁关联的条件变量

::: info
只有当锁没有被任何其他线程持有时，才能获取它。如果其他线程已经持有该锁，当前线程会被阻塞，直到它能获取锁（或者被中断，此时会抛出 `InterruptedException`）。`tryLock` 在获取锁失败时不会阻塞线程。
:::

## 条件

```Kotlin
class PositiveLockedCounter {
   private var c = 0
   private val lock = ReentrantLock()
   private val condition = lock.newCondition()

   fun increment() {
       lock.withLock {
           c++
           condition.signal()
       }
   }

   fun decrement() {
       lock.withLock {
           while (c == 0) {
               condition.await()
           }
           c--
       }
   }

   fun value(): Int {
       return lock.withLock { c }
   }
}
```

条件允许持有锁的线程等待，直到另一个线程就某个事件向它发出信号。在内部，`await` 方法在被调用时会释放关联的锁，并在最终返回之前重新获取它。

::: info
如果条件 C 关联到锁 L，那么只有持有锁 L 的线程才能调用 `condition.await()` 或 `condition.signal()`。

让我们看看 `decrement` 函数中会发生什么：

假设某个线程 T 调用了 `decrement()`。

它首先会尝试获取锁，在成功之前会被阻塞。

获取锁之后，它会检查 `c` 的值，发现它是 0，于是调用 `condition.await()`。

这意味着 T 会释放锁并进入等待状态。

在某个时刻，另一个线程可能调用 `increment()`，并在其中执行 `condition.signal()`。

这会唤醒 T，但它不会立即运行，因为它处于自己的临界区中。要继续执行，它必须重新获取锁。

调用 `signal` 的线程正持有锁（否则它根本没法调用 `signal`）。它会释放锁，但其他某个线程可能先于 T 获取到它。

在某个时刻，T 会重新拿到锁，并对 `c` 执行递减。
:::

## `ReentrantLock` 类

- `ReentrantLock` —— 允许同一个线程多次获取锁
- `lock.getHoldCount()` —— 获取当前线程持有该锁的次数
- `lock.queuedThreads()` —— 获取正在等待该锁的线程集合
- `lock.isFair()` —— 检查锁的公平性

::: info
如果一个线程试图获取它自己已经持有的锁，它就会陷入死锁：它在等待锁被释放，却不知道锁其实就在自己手里，而锁又永远不可能被释放，因为线程被阻塞了——非常悲惨。`ReentrantLock` 不存在这个问题，它允许线程多次获取它。

如果任何想要获取锁的线程最终都能获取到它，这把锁就被认为是公平的。相反，假设一把锁有 3 个线程想要获取它，但其中 1 个被无视、永远拿不到，这种情况被称为“线程饥饿”（thread starvation）。
:::

## `synchronized` 语句

```Kotlin
class Counter {
   private var c = 0

   fun increment() {
       synchronized(this) { c++ }
   }

   …
}
```

在 JVM 中，每个对象都有一个与之关联的内置锁（又称监视器，monitor）。

::: info
在 JVM 中，每个对象内部都有一把“隐藏”的锁——内置锁。

你无法直接访问它，但可以通过 `synchronized` 高阶函数（在 Java 中是关键字）来使用它。

`synchronized(...)` 里可以放**任何**对象。
:::

## 同步方法

Java：

```Java
public class SynchronizedCounter {
   private int c = 0;

   public synchronized void increment() {
      c++;
   }

   …
}
```

Kotlin：

```Kotlin
class SynchronizedCounter {
   private var c = 0

   @Synchronized
   fun increment() {
       c++
   }
   …
}
```

::: info
类的同步方法就是用 `synchronized(this)` 包裹起来的方法。
:::

## `ReadWriteLock` 类

`ReadWriteLock` 允许多个读取者并发访问资源，但只允许单个写入者修改它。

- `rwLock.readLock()` —— 返回读锁
- `rwLock.writeLock()` —— 返回写锁
- `rwLock.read { ... }` —— 在读锁下执行 lambda
- `rwLock.write { ... }` —— 在写锁下执行 lambda

```Kotlin
class PositiveLockedCounter {
   private var c = 0
   private val rwLock = ReentrantReadWriteLock()

   fun increment() {
       rwLock.write { c++ }
   }

   fun decrement() {
       rwLock.write { c-- }
   }

   fun value(): Int {
       return rwLock.read { c }
   }
}
```

::: info
`ReadWriteLock` 是一种改良的锁。

普通锁只允许 1 个线程访问临界区。

`ReadWriteLock` 允许你区分读访问和写访问，其思想是：多个线程只是读取某些东西不会有任何问题，而写入则确实需要独占访问。

`ReadWriteLock` 同时封装了两把锁并把它们关联起来。这意味着：如果其他某个线程已经获取了写锁，或者有 1 个或多个线程已经获取了读锁，那么当前线程就无法获取写锁。读锁则不受其他读锁影响，但如果写锁已被获取，读锁就无法获取。

上面的例子展示了如何用 `ReadWriteLock` 实现一个线程安全的计数器。

获取值 `c` 不需要任何修改，因此可以放在 `read { … }` 中完成，多个线程可以同时调用 `value()`。
:::

## 并发阻塞集合

`java.util.concurrent` 是一个实现了阻塞与非阻塞并发集合的 Java 包，例如：

- `SynchronousQueue` —— 单元素会合（rendezvous）通道
- `ArrayBlockingQueue` —— 固定容量的队列
- `LinkedBlockingQueue` —— 无界阻塞队列
- `PriorityBlockingQueue` —— 无界阻塞优先队列

::: info
如果锁不足以解决线程之间信息共享的问题，你可以使用 `java.util.concurrent` 提供的并发（线程安全）集合。这张幻灯片列出了该包中几个流行的集合。

“阻塞”的意思是：例如，如果一个线程试图从空集合中取东西，或者试图往已经达到最大容量的集合里放东西，它就会被阻塞，直到能成功完成想要的操作。
:::

## 并发非阻塞集合

`java.util.concurrent` 是一个实现了阻塞与非阻塞并发集合的 Java 包，例如：

- `ConcurrentLinkedQueue` —— 非阻塞无界队列
- `ConcurrentLinkedDequeue` —— 非阻塞无界双端队列
- `ConcurrentHashMap` —— 并发无序哈希映射
- `ConcurrentSkipListMap` —— 并发有序哈希映射

::: info
`java.util.concurrent` 还提供了一些非阻塞集合。

当线程试图从空集合中取东西时，这些集合不会阻塞执行。它们通过使用无等待（wait-free）算法来做到这一点。

例如，要从 `ConcurrentLinkedQueue` 中取一个元素，你需要调用 `poll()`——如果队列为空它会返回 `null`，而不是等待别人往队列里放东西。由于 `null` 表示集合为空，你被禁止把 `null` 放进队列。

`ConcurrentSkipListMap` 类似于 `TreeMap`，但它基于跳表（skiplist）而不是树。
:::

## 同步原语

`java.util.concurrent` 还实现了并发数据结构和同步原语。

- `Exchanger` —— 阻塞式交换
- `Phaser` —— 屏障同步

::: info
`Exchanger` 提供单个方法 `exchange`，形如 `(x: V): V`。你可以在这些文档中了解更多。

`Phaser` 是一个可复用的同步屏障，你可以在其中注册多个线程。

每当一个线程向 phaser 报告自己到达（通过 `arrive` 或 `arriveAndAwaitAdvance`），它的相位（一个 `int` 计数器）就会加 1。

如果线程调用 `arriveAndAwaitAdvance`，phaser 会等待（阻塞），直到所有在其中注册的其他线程也都到达这个相位。线程可以从 phaser 中注销。

`CountDownLatch` 是一个类似的“屏障”同步原语，它更简单、也更常见，不过灵活性也更差。
:::

## Java 内存模型（JMM）

### 弱行为

顺序没有任何保证！

```Kotlin
class OrderingTest {
   var x = 0
   var y = 0
   fun test() {
       thread {
           x = 1
           y = 1
       }
       thread {
           val a = y
           val b = x
           println("$a, $b")
       }
   }
}
```

可能的输出：

```
0, 0
0, 1
1, 1
1, 0
```

::: info
让我们看看，如果不使用任何同步机制来从不同线程访问可变状态，会发生什么。这里的可变状态由两个可变变量 `x` 和 `y` 组成，它们都是 0。

线程 1 把两个变量都赋值为 1。

线程 2 读取 `y` 和 `x`，并把结果打印到控制台。

可能的输出：

- `0, 0` —— 线程 2 看不到线程 1 做出的任何修改。
- `0, 1` —— 线程 2 看到线程 1 做出的第一个修改（`x`）。
- `1, 1` —— 线程 2 看到两个修改。
- `1, 0` —— 线程 2 看到第二个修改，却看不到第一个。

虽然最后一种输出看起来违反直觉，但我们确实可能得到它，原因有几个。首先，编译器可能改变线程 1 中操作的顺序——编译器只保证线程 1 自己读取时看到相同的修改顺序，而线程 2 看到的修改顺序可能不同，这就会导致这种情况。

其次，即使指令按顺序执行，你仍然可能遇到这种行为。修改不会立刻写入内存（RAM）。它们首先进入缓存——可以把缓存想象成一个通往 RAM 的修改队列。当线程 2 想要读取 `y` 和 `x` 时，它可能先查看队列中的值，然后再去读 RAM。问题是，队列中只有最前面的一小部分会被检查。因此，即使两个修改都还在队列里、尚未进入 RAM，线程 2 也可能看到 “y = 1” 却看不到 “x = 1”。在这种情况下，尽管操作是按顺序执行的，线程 2 也只会看到第二个操作的效果。
:::

#### 进展也没有任何保证

```Kotlin
class ProgressTest {
   var flag = false
   fun test() {
       thread {
           while (!flag) {}
           println("I am free!")
       }
       thread { flag = true }
   }
}
```

可能的输出：

```
"I am free!"
…
…
…
hang!
```

::: info
在默认设置下，不能保证线程 1 最终能看到 `flag` 的变化（它可能永远看不到）。编译器可能发现线程 1 从不修改 `flag`，于是把 `while(!flag)` 改成 `while(!false)`，进而改成 `while(true)`。
:::

编译器眼中的合法版本：

```Kotlin
class ProgressTest {
   var flag = false
   fun test() {
       thread {
           while (true) {}
           println("I am free!")
       }
       thread { flag = true }
   }
}
```

::: info
从编译器的角度来看，这是上一段代码的一种合法解读。
:::

### 无数据竞争保证

那么 JMM 保证了什么？

> 同步良好的程序具有简单的交错语义。

::: info
Robin Milner 有一句名言：“类型良好的程序不会出错。”意思是：类型推断成功的程序不会抛出意料之外的错误。JMM 保证了一个类似的概念：

“同步良好的程序具有简单的交错语义。”
:::

进一步解读：

- 同步良好（Well-synchronized） = 无数据竞争（Data-race-free）
- 简单的交错语义 = 顺序一致（sequentially consistent）语义

**无数据竞争的程序具有顺序一致的语义。**

::: info
这里的“同步良好”可以理解为：不存在对共享非原子变量的、未同步的并发访问尝试。
:::

### `volatile` 字段

`volatile` 字段可用于恢复顺序一致性。

```Kotlin
class OrderingTest {
   @Volatile var x = 0
   @Volatile var y = 0
   fun test() {
       thread {
           x = 1
           y = 1
       }
       thread {
           val a = y
           val b = x
           println("$a, $b")
       }
   }
}
```

```Kotlin
class ProgressTest {
   @Volatile var flag = false
   fun test() {
       thread {
           while (!flag) {}
           println("I am free!")
       }
       thread { flag = true }
   }
}
```

::: info
`@Volatile` 强制变量在每次被处理时都重新从内存中读取其值。

正因如此，`while(!flag)` 不会被改成 `while(!false)`，因为线程每次访问 `flag` 来检查 `while` 条件时，都被强制重新读取它。
:::

`volatile` 变量可用于同步：

```Kotlin
class OrderingTest {
   var x = 0
   @Volatile var y = 0
   fun test() {
       thread {
           x = 1
           y = 1
       }
       thread {
           val a = y
           val b = x
           println("$a, $b")
       }
   }
}
```

我们怎么知道同步已经足够了？

::: info
把 `y` 标记为 `volatile`，会让前面“弱行为输出”幻灯片中的 “1,0” 情况变得不可能。

这要归功于 happens-before 关系，我们接下来就讲它。
:::

### Happens-before 关系

```Kotlin
class OrderingTest {
   var x = 0
   @Volatile var y = 0
   fun test() {
       thread {
           x = 1
           y = 1
       }
       thread {
           val a = y
           val b = x
           println("$a, $b")
       }
   }
}
```

上面代码的一次可能执行，可以用“程序事件”图来表示（`WxV` 表示“向 x 写入 V”，`RxV` 表示“从 x 读出 V”；上标 V 表示被访问的变量标记为 `volatile`）：

![](/assets/kotlin-edu-sinicization/jmm-happens-before.png)

::: info
这张图表示了左边代码的一次可能执行。其他执行也是可能的（例如 `Rx0` 而不是 `Rx1`），它们会对应不同的图。

“程序顺序”指代码中语句的顺序，对应某个给定线程的执行。

“读自”（reads-from）是一种关系：当读操作看到了某个写操作的结果时成立。
:::

再加入 **synchronizes-with** 关系：

![](/assets/kotlin-edu-sinicization/jmm-happens-before-2.png)

::: info
synchronizes-with 表示当两个操作迫使线程之间发生同步时出现的关系。
:::

而 **happens-before** 是程序顺序与 synchronizes-with 关系的传递闭包：

![](/assets/kotlin-edu-sinicization/jmm-happens-before-3.png)

```
hb = (po ∪ sw)⁺
```

::: info
happens-before 是程序顺序（po）和 synchronizes-with（sw）关系的传递闭包。

这意味着：不同线程之间的同步，与各个线程内部的程序顺序结合在一起，使得某些执行成为不可能。这些限制让你能够写出无数据竞争的程序。
:::

![](/assets/kotlin-edu-sinicization/jmm-happens-before-4.png)

::: info
在本幻灯片描绘的执行中（回到我们之前的场景），线程 2 从 `y` 读到了 1。这意味着这条指令是在线程 1 向 `y` 写入 1 之后执行的（这是对 `y` 写入 1 的唯一一次写操作），而那次写入又应该发生在线程 1 向 `x` 写入 1 之后。于是，在 `Wx1` 和 `Rx1` 之间可以推导出 happens-before 关系。

如果线程 2 从 `volatile` 的 `y` 读到了 1，它就与线程 1 发生了同步，必须看到线程 1 此前的所有工作——结果是它不可能从 `x` 读到 0，只能读到 1。
:::

### 同步动作

- 对 `volatile` 字段的读和写
- 加锁（lock）和解锁（unlock）
- 线程的 `run` 与 `start`，以及结束与 `join`

::: info
以上是一些能提供 synchronizes-with 关系的动作。
:::

### 再谈 DRF-SC

两个事件构成数据竞争（data race），当且仅当：

- 两者都是对同一字段的内存访问。
- 两者都是普通（非原子）访问。
- 其中至少一个是写事件。
- 它们之间没有 happens-before 关系。

**无数据竞争的程序具有顺序一致的语义。**

如果一个程序的所有可能执行中都不存在构成数据竞争的两个事件，这个程序就是无数据竞争的。

### 原子类

那么，对共享变量的原子操作呢？

```Kotlin
class Counter {
   private val c = AtomicInteger()

   fun increment() {
       c.incrementAndGet()
   }

   fun decrement() {
       c.decrementAndGet()
   }

   fun value(): Int {
       return c.get()
   }
}
```

::: info
`@Volatile` 注解无法修复 `Counter` 类示例中的 bug。

我们仍然可能在两个不同的线程中读到相同的值，各自分别递增，然后把新值写回字段——丢失一次递增。因为“读取、递增、写入”仍然是非平凡的操作，尽管 `@Volatile` 提供了 happens-before 关系，它们仍然可能交错。

改用 `AtomicInteger` 代替普通的 `Int` 才能修复这个计数器。

原子类让非平凡的操作表现得像平凡操作一样：它们强制执行的对外表现就如同某个操作是通过单条 CPU 指令完成的。
:::

#### java.util.concurrent.atomic 包

`java.util.concurrent.atomic` 包中的原子类：

- `AtomicInteger`
- `AtomicLong`
- `AtomicBoolean`
- `AtomicReference`

以及它们的数组版本：

- `AtomicIntegerArray`
- `AtomicLongArray`
- `AtomicReferenceArray`

#### 原子类的方法

- `get()` —— 以 `volatile` 语义读取值
- `set(v)` —— 以 `volatile` 语义写入值
- `getAndSet(v)` —— 原子地交换值
- `compareAndSet(e, v)` —— 原子地把原子变量的值与期望值 `e` 比较，如果相等，就把原子变量的内容替换为目标值 `v`；返回表示成功或失败的布尔值
- `compareAndExchange(e, v)` —— 原子地把值与期望值 `e` 比较，如果相等就替换为目标值 `v`；返回读到的值
- `getAndIncrement()`、`addAndGet(d)` 等 —— 对数值型原子类（`AtomicInteger`、`AtomicLong`）执行原子算术运算
- ……

::: info
`compareAndSet` 在无锁数据结构中被广泛使用，用于取代阻塞锁。一个非常简单的无锁栈示例是这样的：

```Kotlin
class Node(
    var next: Node,
    val data: Int
)

var head: AtomicReference<Node> = AtomicReference(Node(...)) // 简单示例 => 不管第一个节点的 next 里应该是什么

fun push(newValue: Int) {
    val newNode = Node(head.get(), newValue)
    do {
        newNode.next = head.get()
    } while (!head.compareAndSet(newNode.next, newNode))
}

fun pop(): Int { // 如果只剩一个节点（即 head 本身），这里会失败，不过这只是个简单示例
    var current = head.get()
    while(!head.compareAndSet(current, current.next)) {
        current = head.get()
    }
    return current.data
}
```

:::

#### 访问模式

原子类的方法还包括：

```
…
getXXX()
setXXX(v)
weakCompareAndSetXXX(e, v)
compareAndExchangeXXX(e, v)
```

其中 `XXX` 是一种访问模式：`Acquire`、`Release`、`Opaque`、`Plain`。

你可以在这里进一步了解 Java 访问模式：https://gee.cs.oswego.edu/dl/html/j9mm.html

::: info
访问模式有好几种，语义各不相同。

`Plain` 完全不是原子的，也不保证任何东西；`volatile` 保证同步；两者之间还有几种模式。
:::

### 原子类的问题

```Kotlin
class Node<T>(val value: T) {
   val next = AtomicReference<Node<T>>()
}
```

![](/assets/kotlin-edu-sinicization/jmm-atomics-problem.jpg)

::: info
原子类的主要问题在于：它们是实实在在的对象。`AtomicInteger` 不是一个 4 字节或 8 字节的整数，而是一个带有对象头和大量附加数据的对象，这会对应用性能产生负面影响。
:::

### 原子字段更新器

使用 `AtomicXXXFieldUpdater` 类直接修改 `volatile` 字段：

```Kotlin
class Counter {
   @Volatile private var c = 0
   companion object {
       private val updater = AtomicIntegerFieldUpdater.newUpdater(Counter::class.java, "c")
   }
   fun increment() {
       updater.incrementAndGet(this)
   }
   fun decrement() {
       updater.decrementAndGet(this)
   }
   fun value(): Int {
       return updater.get(this)
   }
}
```

从 JDK 9 开始，还有用途类似的 `VarHandle` 类。

::: info
为了解决大量不必要的附加数据问题，你可以使用一个单独的 Updater 类来操作目标类的字段。
:::

## Kotlin：AtomicFU

AtomicFU 库是在 Kotlin 中使用原子操作的推荐方式：https://github.com/Kotlin/kotlinx-atomicfu

```Kotlin
class Counter {
   private val c = atomic(0)
   fun increment() {
       c += 1
   }
   fun decrement() {
       c -= 1
   }
   fun value(): Int {
       return c.value
   }
}
```

- 它提供与 Java 原子类 API 类似的 `AtomicXXX` 类。
- 在底层，编译器插件会把对原子类的使用替换为 `AtomicXXXFieldUpdater` 或 `VarHandle`。
- 它还提供便捷的扩展函数，例如 `c.update { it + 1 }`。

::: info
AtomicFU 是一个提供了推荐的原子类使用方式的库。
:::
