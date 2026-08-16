# 函数式编程

::: info
本文翻译自：https://kotlinlang.org/education/
:::

今天的主题是函数式编程，这是 Kotlin 支持的编程风格之一。

## 这是什么？

我们已经熟悉面向对象编程（OOP），但 Kotlin 还借鉴了函数式编程（FP）的概念。函数式编程是一种编程范式，其程序是通过**应用**和**组合函数**来构建的。

```Kotlin
var sum = 0
for (item in list) {
   if (item > 0) {
       sum += item * item
   }
}
```

```Kotlin
list.filter { it > 0 }.map { it * it }.sum()
```

::: info
请看以上两段用于计算特定集合中正数之和的代码。左侧代码中的执行指令具有命令式结构。

但在 Kotlin 中，我们也可以声明一系列转换来实现相同的结果。
:::

## 我们的方法

函数式编程与其他概念一样，既有优点也有缺点，但我们将重点关注其优势。

**免责声明**：本讲课中不会涉及深奥的数学内容或 Haskell 示例。我们将探讨那些我们认为在 Kotlin 中最值得使用的函数式编程特性。

::: info
在本节课中，我们将仅关注函数式编程风格在 Kotlin 中的积极应用。
:::

## 我们已经知道……

- 在 Kotlin 中，你可以将函数作为其他函数的参数传递：

  ```Kotlin
  fun foo(bar: () -> Unit): Unit { ... }
  ```

- 如果函数的最后一个参数是函数，则可以将其放在括号之外：

  ```Kotlin
  fun baz(start: Int, end: Int, step: (Int) -> Unit): Unit { ... }
  baz(23, 42) { println("Magnificent!") }
  ```

- 如果函数的唯一参数是一个函数，则可以完全省略括号：

  ```Kotlin
  foo { println("Kotlin keeps on giving!") }
  ```

::: info
哪些语言特性使我们能够做到这一点？

首先，是能够将函数类型用作参数。通常可以通过这种方式传递的值包括 `lambda` 表达式、匿名函数和函数引用。其次，是针对 `case` 语句的语法改进：不再将 `lambda` 表达式写在函数调用的括号内，而是将其置于括号之外。

此外，如果未传递其他参数，则可以省略括号。
:::

- Lambda 表达式可以赋值给 `val`，也可以重新赋值给 `var`：

  ```Kotlin
  var lambda1: (Int) -> Double = { r -> r * 6.28 }
  val lambda2 = { d: Int -> 3.14 * d.toDouble().pow(2) }
  lambda1 = lambda2
  ```

- Lambda 表达式可以用函数语法替换：

  ```Kotlin
  val sum = fun(a: Int, b: Int): Int = a + b
  val sum2 = { a:Int, b: Int -> a + b }
  ```

- 允许在函数内部声明函数：

  ```Kotlin
  fun global() {
    fun local() { ... }
  ...
    local()
  ...
  }
  ```

::: info
函数类型的实例与普通函数并无太大区别。我们可以将其存储在变量中并进行修改。

但除了创建由 `lambda` 初始化的变量外，我们还可以在任何代码块中声明一个命名的局部函数。
:::

## 高阶函数（HOFs）

将其他函数作为**参数**的函数被称为高阶函数。

在 Kotlin 中，处理集合时经常会遇到它们：

```Kotlin
list.partition { it % 2 == 0 }  或  list.partition { x -> x % 2 == 0 }
```

Kotlin 允许你对函数进行任何操作，这意味着“Kotlin 中的函数是第一公民”。

在函数式编程中，函数的设计原则是纯净的。通俗来说，这意味着它们不能持有状态。循环具有迭代器索引，而这本身就是一种状态，因此请告别*传统的*循环。

```Kotlin
fun sumIter(term: (Double) -> Double, a: Double, next: (Double) -> Double, b: Double): Double {
   fun iter(a: Double, acc: Double): Double = if (a > b) acc else iter(next(a), acc + term(a))
   return iter(a, 0.0)
}

fun integral(f: (Double) -> Double, a: Double, b: Double, dx: Double): Double {
   fun addDx(x: Double) = x + dx
   return dx * sumIter(f, (a + (dx / 2.0)), ::addDx, b)
}
```

（这是一个转写为 Kotlin 的 LISP 程序；实际上没人会这样写代码）

::: info
所谓“纯函数式编程”中的所有函数都被视为数学意义上的函数；它们既不能改变程序的状态，也不应拥有自己的状态。以下是一个从 LISP（最早的纯函数式编程语言之一）重写的程序示例。如我们所见，其中没有可变变量，甚至循环也被递归所取代。以典型的 Kotlin 标准来看，本例中的代码相当非传统。
:::

在函数式编程的语境中，通常需要使用以下函数：`map`、`filter` 和 `fold`。

`map` 允许我们对集合中的每个元素应用一个函数：

```Kotlin
val list = listOf(1, 2, 3)
list.map { it * it } // [1, 4, 9]
```

::: info
在讨论 Kotlin 的函数式编程风格时，有一组常用的高阶函数尤为引人注目。让我们先从 `map` 函数开始。

顾名思义，它通过应用用户提供的函数来转换源集合。
:::

`map` 和 `forEach` 之间的主要区别是什么？

::: info
这里有一个问题：`map` 和 `forEach` 之间的主要区别是什么？

答案是：正如你所见，`map` 会返回一个列表，其中每个元素都是对源集合进行转换后得到的；而 `forEach` 仅返回一个 `Unit`。
:::

你可以将这两个函数**组合**起来，同时执行这两项操作：

```Kotlin
val list = listOf(1, 2, 3)
list.map { it * it }.map { it + 1 } // [2, 5, 10]

list.map { it * it + 1 } // [2, 5, 10]
```

![](/assets/kotlin-edu-sinicization/higher-order-functions.png)

**注意**：默认情况下，你可以使用序列来组合复杂函数，但请务必谨慎。

::: info
由于 `map` 是一个扩展函数，因此可以通过调用链来组合多个转换操作。
:::

`filter` 返回一个仅包含符合给定谓词的元素的列表：

```Kotlin
val list = listOf(1, 2, 3)
list.filter { it % 2 == 0 } // [2]
```

我们的第三个重要函数 `fold` 会创建一个可变累加器，该累加器会在 `for` 循环的每一轮中更新，并返回一个值：

```Kotlin
val list = listOf(1, 2, 3)
list.fold(0) { acc, x -> acc + x } // 6
```

你可以为任何类型实现 `fold` 函数，例如，你可以将一棵树折叠为字符串表示形式。

此外还有右 `fold` 和左 `fold`。如果运算具有结合律：$(a ○ b) ○ c = a ○ (b ○ c)$，则二者等价；但在其他情况下，它们会产生不同的结果。

```Kotlin
val list = listOf(1, 2, 3)
list.fold(0) { acc, x -> acc + x } 	// (((0 + 1) + 2) + 3) = 6
list.foldRight(0) { x, acc -> acc + x } // (1 + (2 + (3 + 0))) = 6

"PWND".fold("") { acc, x -> "${acc}${acc}$x" } 		// PPWPPWNPPWPPWND
"PWND".foldRight("") { x, acc -> "${acc}${acc}$x" } 	// DDNDDNWDDNDDNWP
```

请注意 `lambda` 表达式中参数的顺序：

```Kotlin
list.fold(0) { acc, x -> acc - x } // (((0 - 1) - 2) - 3) = -6
list.foldRight(0) { x, acc -> acc - x } // (-1 + (-2 + (0 - 3))) = -6
list.foldRight(0) { acc, x -> acc - x } // (1 - (2 - (3 - 0))) = 2 // [!code error]
```

```Kotlin
val string = """
    One-one was a race horse.
    Two-two was one too.
    One-one won one race.
    Two-two won one too.
""".trimIndent()

val result = string
    .split(" ", "-", ".", System.lineSeparator())
    .filter { it.isNotEmpty() }
    .map { it.lowercase() }
    .groupingBy { it }
    .eachCount()
    .toList()
    .sortedBy { (_, count) -> count }
    .reversed()
```

::: info
让我们追踪一个更复杂的集合函数链。
:::

```Kotlin
val result = string
    .split(" ", "-", ".", System.lineSeparator()) // [!code ++]
```

```Text
[One, one, was, a, race, horse, , Two, two, was, one, too, , One, one, won,
 one, race, , Two, two, won, one, too, , ]
```

::: info
首先，通过空格和换行符分隔符将字符串拆分为单词。中间结果是一个字符串列表。
:::

```Kotlin
val result = string
    .split(" ", "-", ".", System.lineSeparator())
    .filter { it.isNotEmpty() } // [!code ++]
```

```Text
[One, one, was, a, race, horse, Two, two, was, one, too, One, one, won,
 one, race, Two, two, won, one, too]
```

::: info
然后我们使用 `filter` 过滤掉空字符串。
:::

```Kotlin
val result = string
    .split(" ", "-", ".", System.lineSeparator())
    .filter { it.isNotEmpty() }
    .map { it.lowercase() } // [!code ++]
```

```Text
[one, one, was, a, race, horse, two, two, was, one, too, one, one,
 won, one, race, two, two, won, one, too]
```

::: info
接下来我们将所有字符串转换为小写。中间集合同样是一个字符串列表。
:::

```Kotlin
val result = string
    .split(" ", "-", ".", System.lineSeparator())
    .filter { it.isNotEmpty() }
    .map { it.lowercase() }
    .groupingBy { it } // [!code ++:2]
    .eachCount()
```

或者：

```Kotlin
string
    .split(" ", "-", ".", System.lineSeparator())
    .filter { it.isNotEmpty() }
    .groupBy({ it.lowercase() }, { it }) // [!code ++:4]
    .mapValues { (key, value) ->
        value.size
    }
```

```Text
{one=7, was=2, a=1, race=2, horse=1, two=4, too=2, won=2}
```

::: info
此类链式操作的每一步都有数十种实现方式。在此示例中，我们可以使用内置计数扩展的组结构，也可以手动操作：通过 `map` 方法自行计算计数。
:::

```Kotlin
val result = string
    .split(" ", "-", ".", System.lineSeparator())
    .filter { it.isNotEmpty() }
    .map { it.lowercase() }
    .groupingBy { it }
    .eachCount()
    .toList() // [!code ++]
```

```Text
[(one, 7), (was, 2), (a, 1), (race, 2), (horse, 1), (two, 4), (too, 2), (won, 2)]
```

::: info
而此转换的最后一步是将计数 Map 转换为列表。
:::

```Kotlin
val result = string
    .split(" ", "-", ".", System.lineSeparator())
    .filter { it.isNotEmpty() }
    .map { it.lowercase() }
    .groupingBy { it }
    .eachCount()
    .toList()
    .sortedBy { (_, count) -> count } // [!code ++]
```

```Text
[(a, 1), (horse, 1), (was, 2), (race, 2), (too, 2), (won, 2), (two, 4), (one, 7)]
```

::: info
由于我们拥有一个列表，因此还可以获取其排序副本。我们可以选择列表元素中某个可比较的属性作为排序依据。在本例中，我们使用由单词及其计数组成的元组中的第二个值。
:::

```Kotlin
val result = string
    .split(" ", "-", ".", System.lineSeparator())
    .filter { it.isNotEmpty() }
    .map { it.lowercase() }
    .groupingBy { it }
    .eachCount()
    .toList()
    .sortedBy { (_, count) -> count }
    .reversed() // [!code ++]
```

或者

```Kotlin
string
    .allFunnyFuncs(...)
    .toList()
    .sortedWith { l, r -> // [!code ++:3]
        r.second - l.second
    }
```

或者

```Kotlin
string
    .allFunnyFuncs(...)
    .toList()
    .sortedByDescending { (_, c) -> // [!code ++:3]
        c
    }
```

```Text
[(one, 7), (two, 4), (won, 2), (too, 2), (race, 2), (was, 2), (horse, 1), (a, 1)]
```

::: info
若要实现反向排序，我们可以对按升序排列的列表进行反转、要求按降序排列，或者通过比较两个互换后数值之间的差值来实现。
:::

除了 `lambda` 表达式外，已定义函数的引用也可以作为*参数*传递给期望接收其他函数的函数：

```Kotlin
fun isEven(x: Int) = x % 2 == 0

val isEvenLambda = { x: Int -> x % 2 == 0 }
```

结果相同，调用方式不同：

```Kotlin
list.partition { it % 2 == 0 }
```

```Kotlin
list.partition(::isEven) // 函数引用
```

```Kotlin
list.partition(isEvenLambda)  // 按名称传递 lambda
```

::: info
由于 Kotlin 中的高阶函数可以接受任意函数类型的实例，因此除了 `lambda` 之外，我们还可以传递函数引用以及存储在变量中的 `lambda`。
:::

## 懒计算

请看以下代码：

```Kotlin
fun <F> withFunction(
    number: Int, even: F, odd: F
): F = when (number % 2) {
    0 -> even
    else -> odd
}

withFunction(4, println("even"), println("odd"))
```

控制台将输出什么？

::: info
在此代码片段中，我们接收一个数字和两个值：如果数字是偶数，则返回第一个值；如果数字是奇数，则返回第二个值。然后我们传入 `4`，并分别调用这两个情况下的打印函数。
:::

`withFunction` 函数的参数会在其函数体执行**之前**进行求值（急求值）。

```Text
even odd
```

::: info
实际上，这段代码会打印出两个字符串。为什么？因为在命令式编程中，所有传入的参数都会在函数执行之前进行求值，就像烹饪前先准备好并称量好食材一样。

在检查数字 `4` 的奇偶性之前，这两个 `println` 调用已经执行完毕。
:::

## 懒延迟计算

请看以下代码：

```Kotlin
fun <F> withLambda(
    number: Int, even: () -> F, odd: () -> F
): F = when (number % 2) {
    0 -> even()
    else -> odd()
}

withLambda(4, { println("even") }, { println("odd") })
```

由于采用了~~懒~~延迟计算，控制台只会输出 `even`。

::: info
从语言本身的层面来看，Kotlin 并不懒计算值，但通过将立即调用包装成 `lambda` 表达式并替换为延迟调用，最终会得到预期的结果。
:::

## 运算符重载

Kotlin 提供了扩展函数，你可以利用它们来重载运算符，例如 `iterator`。也就是说，你无需像在面向对象编程代码中那样，创建一个继承自 `Iterable` 接口的新实体。

```Kotlin
class MyIterable<T> : Iterable<T> { // 你需要访问 MyIterable 的源代码
    override fun iterator(): Iterator<T> {
        TODO("Not yet implemented")
    }
}
```

VS

```Kotlin
class A<T>
operator fun <T> A<T>.iterator(): Iterator<T> = TODO("Not yet implemented")
```

::: info
为了能在 `for` 循环中像使用内置类型一样使用该类，必须使用 `operator` 修饰符

```Kotlin
val aInstance = A<Int>()
for (value in aInstance) {
   // 对该值进行操作
}
```

:::

## 还有一件事……

这段代码正确吗？

```Kotlin
enum class Color {
    WHITE,
    AZURE,
    HONEYDEW
}

fun Color.getRGB() = when (this) {
   Color.WHITE -> "#FFFFFF"
   Color.AZURE -> "#F0FFFF"
   Color.HONEYDEW -> "F0FFF0"
}
```

::: info
最后，让我们探讨如何以函数式的方式处理数据。在成熟的函数式编程语言中，会检查条件表达式的穷尽性（类似于 Kotlin 的 `when`）。但在 Kotlin 中也是这样工作的吗？
:::

**是的**，因为编译器知道**所有**可能的值。

::: info
是的。在这个例子中，我们有一个枚举类，编译器知道除了那些作为常量定义的实例之外，不存在其他可能的实例。因此，如果我们的 `when` 子句（无论按何种顺序和组合）处理了这三个值中的每一个，我们就无需 `else` 子句，因为它永远不会被应用。
:::

这个例子呢？

```Kotlin
sealed class Color

class WhiteColor: Color()
class AzureColor: Color()
class HoneydewColor: Color()

fun Color.getRGB() = when (this) {
   is WhiteColor -> "#FFFFFF"
   is AzureColor -> "#F0FFFF"
   is HoneydewColor -> "F0FFF0"
}
```

::: info
但在 Kotlin 中，我们也有密封类和密封接口。它们的子类仅限于与父类或父接口定义在同一模块中的类或接口。这些子类是否也受到与枚举相同的影响？
:::

答案依然是**肯定**的，因为编译器在编译阶段就已经知道 `Color` 类的**所有**可能子类，且不会出现新的类。

::: info
系统会检查所有可能的子类，以确定是否需要在 `when` 表达式中包含 `else` 子句。
:::

请看以下代码：

```Kotlin
sealed class Color
class WhiteColor(val name: String): Color()
class AzureColor(val name: String): Color()
class HoneydewColor(val name: String): Color()
```

这些类**都有**共同的部分，而且我们知道这些是**唯一**可能的子类。让我们将这段代码移到基类中。

::: info
让我们看看本页面的代码，看看能否对其进行一些改进。在每个颜色类中，我们都定义了一个同类型的 `name` 属性。
:::

```Kotlin
sealed class Color
class WhiteColor(val name: String): Color()
class AzureColor(val name: String): Color()
class HoneydewColor(val name: String): Color()
```

↓

```Kotlin
sealed class NewColor(val name: String)
class WhiteColor(name: String): NewColor(name)
class AzureColor(name: String): NewColor(name)
class HoneydewColor(name: String): NewColor(name)
```

实际上，这些类是**等价的**，即第一个版本中的*每个*函数都可以重写为*第二个*版本的形式。

::: info
因此，我们每个类的接口都变得相同了。
:::

```Kotlin
fun Color.getUserRGB() = when (this) {
   is WhiteColor -> "${this.name}: #FFFFFF"
   is AzureColor -> "${this.name}: #F0FFFF"
   is HoneydewColor -> "${this.name}: F0FFF0"
}
```

```Kotlin
fun NewColor.getUserRGB() = when (this) {
   is WhiteColor -> "${this.name}: #FFFFFF"
   is AzureColor -> "${this.name}: #F0FFFF"
   is HoneydewColor -> "${this.name}: F0FFF0"
}
```

在第一个函数中，我们使用了智能类型转换，但在第二个函数中则没有。

::: info
现在让我们来详细分析一下。在上面的函数中，`name` 属性只有在 `this` 被转换为各个子类时才可用。但当我们将接口设为相同时，`name` 属性对所有 `NewColor` 实例都可用，且无需了解具体的继承者信息。
:::

**数学时间！**我们其实可以用数学术语来重写这个表达式：

```Kotlin
WhiteColor * String + … + HoneydewColor * String ≃ String * (WhiteColor + … + HoneydewColor)
```

::: info
实际上，某些类型与某些数学运算之间存在对应关系。
:::

之所以能这样做，是因为我们实际上是在处理**代数数据类型\***，因此可以利用它们的特性。

_\*这并非完全准确，但在涉及密封类的绝大多数情况下，这种写法是成立的。_

::: info
函数式编程者总是向大家强调代数类型。如果我们将密封类视为其子类的和，并将具有属性的类视为判别式与值的乘积，那么我们就可以对这些类型进行代数运算。Kotlin 并未彻底实现这些原则，但已足够满足实际应用需求。
:::

## 最后思考

Kotlin 中的函数式编程并不会取代面向对象编程。这两种编程范式各有优缺点，关键在于将它们结合起来，从而编写出简洁、易读且易于理解的代码！

如果你对 Kotlin 中的函数式编程感兴趣，并希望进行更深入的研究，请访问此链接：https://arrow-kt.io/

::: info
看到第一张关于猴子的幻灯片后，你可能会认为函数式编程是 Kotlin 中一种更高级、更符合语言习惯的编程风格。

但事实并非如此。实际上，你应该在程序中混合使用多种编程风格，才能获得最佳效果。

你可以使用 Arrow 项目来增加项目中函数式代码的比例。
:::
