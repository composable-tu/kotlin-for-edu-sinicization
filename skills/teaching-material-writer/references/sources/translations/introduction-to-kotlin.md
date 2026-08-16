# Kotlin 入门

::: info
本文翻译自：https://kotlinlang.org/education/
:::

## 为什么是 Kotlin？

- 表现力/简洁性
- 安全性
- 可移植性/兼容性
- 便捷性
- 高质量集成开发环境支持
- 社区
- Android 👀
- 无数台设备运行 ~~Java~~ Kotlin
- 无乳糖
- ~~无糖~~
- 无谷蛋白

::: info
译者注：这里“无乳糖”“无糖”“无谷蛋白”是一个双关梗，指 Kotlin 比 Java（咖啡 LOGO）具有更现代的语法与特性。“无糖”被划掉是因为 Kotlin 本身具有不少的语法糖。
:::

## LOGO

![](/assets/kotlin-edu-sinicization/kotlin-logo.png)

## 命名

![](/assets/kotlin-edu-sinicization/finland-kotlin.png)

Kotlin 命名来源于芬兰湾的一个岛屿

## Hello, world!（你好，世界！）

```Kotlin
fun main(args: Array<String>) {
    println("Hello, world!")
}

fun main() {
    println("Hello, world!")
}

fun main() = println("Hello, world!")
```

我 `;` 呢？？？

::: info
分号不是必须的，也不是被禁止的。表达式可以用分号结束，如果表达式与下一个表达式之间用换行隔开，则不需要分号。
:::

## 基础

```Kotlin
fun main(args: Array<String>) {
    print("Hello")
    println(", world!")
}
```

- Kotlin 应用程序的入口点是 `main` **顶层**函数。
- 它接受数量可变的 `String` 参数，这些参数可以省略。
- `print` 打印参数到标准输出。
- `println` 打印参数并换行。

## 变量

```Kotlin
val/var myValue: Type = someValue
```

- `var` – 可变
- `val` – 不可变
- 大多数情况下可以推断出类型
- 赋值可以推迟

```Kotlin
val a: Int = 1	// 立即赋值

var b = 2		// 推断出 Int 类型
b = a 			// 重新赋值给 var 也可以

val c: Int		// 未提供初始值时必须显式声明类型
c = 3			// 推迟赋值
a = 4			// 报错：val 不能重新赋值 // [!code error]
```

::: info
延迟赋值变量在使用前应先赋值。但关于如何使用延迟赋值的完整描述相当复杂，因此除非有必要，否则建议不要使用它。

另外，不要混淆可变变量和可变值。可变变量可以给变量赋值。可变值允许你改变变量的值，并保留变量对该值的引用。
:::

```Kotlin
const val/val myValue: Type = someValue
```

- `const val` - 编译时值
- `val` - 不可变值
- 对于 `const val`，使用大写字母命名

```Kotlin
const val NAME = "Kotlin"	// 可在编译时推算
val nameLowered = NAME.lowercase()	 // 在编译时无法推算
```

## 函数

```Kotlin
fun sum(a: Int, b: Int): Int {
    return a + b
}
```

```Kotlin
fun mul(a: Int, b: Int) = a * b // 单一表达式函数
```

```Kotlin
fun printMul(a: Int, b: Int): Unit { // Unit 表示函数不返回任何有意义的内容
    println(mul(a, b))
}
```

```Kotlin
fun printMul1(a: Int = 1, b: Int) { // Unit 可以省略
    println(mul(a, b))
}
```

```Kotlin
fun printMul2(a: Int, b: Int = 1) = println(mul(a, b)) // 参数可以有默认值
```

## `if` 表达式

```Kotlin
fun maxOf(a: Int, b: Int): Int {
    if (a > b) {
        return a
    } else {
        return b
    }
}
```

等同于：

```Kotlin
fun maxOf(a: Int, b: Int) =
    if (a > b) {
        a
    } else {
        b
    }
```

`if` 可以是一个表达式（可以 `return`）。

可以单行：

```Kotlin
fun maxOf(a: Int, b: Int) = if (a > b) a else b
```

## `when` 表达式

```Kotlin
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> {
        print("x is neither 1 nor 2")
    }
}
```

`when` 与 `if` 的返回方式相同。

```Kotlin
when {
    x < 0 -> print("x < 0")
    x > 0 -> print("x > 0")
    else -> {
        print("x == 0")
    }
}
```

条件判断可以写在分支内部。

::: info
`when` 会评估第一个符合条件的条件分支（如果存在）。但需要注意非纯的分支条件，因为 `when` 是按需计算的。更准确地说，`when` 会按顺序依次评估分支条件，一旦发现第一个返回 `true` 的条件，就会开始执行该分支的主体代码。因此，`when` 块会评估直至第一个 `true` 条件为止的所有条件，而不再评估后续的条件。其工作原理与连续的 `if-else` 语句块等效。

例如：

```Kotlin
when (15 as Number) {
    1 -> doFirst()
    in listOf(2, 3, 4, 5, 6) -> doSecond()
	is Double -> doThird()
	else -> doFourth()
}
```

等同于:

```Kotlin
if (x == 1) { doFirst() }
else if (x in listOf(2, 3, 4, 5, 6)) { doSecond() }
else if (x is Double) { doThird() }
else { doFourth() }
```

此外，不带参数的 `when { ... }` 等效于 `when (true) { ... }`

`when` 允许的条件判断包括相等性判断（如 `1 -> { … }`）、类型判断（如 `is Int -> { … }`）以及包含判断（如 `in listOf(1, 2, 3, 5, 8, 13) -> { … }`）。

此外，`when` 可以作为表达式而非语句使用：

```Kotlin
val discountPercentage = when (cost) {
	in 0 until 300 -> 0
	in 300 until 1500 -> 5
    else -> 15
}
```

:::

## `when` 语句

```Kotlin
fun serveTeaTo(customer: Customer) {
    val teaSack = takeRandomTeaSack()

    when (teaSack) {
        is OolongSack -> error("We don't serve Chinese tea like $teaSack!")
        in trialTeaSacks, teaSackBoughtLastNight ->
            error("Are you insane?! We cannot serve uncertified tea!")
    }

    teaPackage.brew().serveTo(customer)
}
```

`when` 可以在一个分支中接受多个选项。如果 `when` 代码块被用作语句，则可以省略 `else` 分支。

## `&&` vs `and`

`if (a && b) { ... }` VS `if (a and b) { ... }`

与 `&&` 运算符不同，`and` 函数不会进行短路求值。

`or` 同理：

`if (a || b) { ... }` VS `if (a or b) { ... }`

::: info
`and` 与 `or` 运算符的 Lazy 与 Eager 版本的优缺点：

1. `&&` 与 `||` 运算符无法被重写（它们是内置操作）。如果你想对 `Boolean` 以外的类型应用 `and`/`or` 操作，那么你必须使用 `and`/`or`（它们是中缀函数，因此是可以重写的）。运算符重载将在面向对象编程一讲中介绍。
2. 在某些情况下，`&&`/`||` 运算符的左侧和右侧都会产生副作用（非纯函数，即它们除了计算布尔值之外，还会执行其他操作或改变某些状态），且无论左侧的值如何，你都需要计算右侧的值。在这种情况下，你应该使用 `and`/`or`。

例如：`result = result and someComputation()`。在这种情况下，无论 `result` 变量的值是什么，`someComputation()` 都会被执行。
:::

## 循环

```Kotlin
val items = listOf("apple", "banana", "kiwifruit")

for (item in items) {
    println(item)
}

for (index in items.indices) {
    println("item at $index is ${items[index]}")
}

for ((index, item) in items.withIndex()) {
    println("item at $index is $item")
}
```

::: info
在第三种情况下，`(index, item)` 声明中使用了解构声明。
:::

```Kotlin
val items = listOf("apple", "banana", "kiwifruit")

var index = 0
while (index < items.size) {
    println("item at $index is ${items[index]}")
    index++
}

var toComplete: Boolean
do {
    ...
    toComplete = ...
} while(toComplete)
```

条件变量可以在 `do…while` 循环中初始化。

循环中可以用 `break` 和 `continue` 标签：

```Kotlin
myLabel@ for (item in items) {
    for (anotherItem in otherItems) {
        if (...) break@myLabel
        else continue@myLabel
    }
}
```

## 区间

```Kotlin
val x = 10
if (x in 1..10) {
    println("fits in range")
}

for (x in 1..5) {
    print(x)
}

for (x in 9 downTo 0 step 3) {
    print(x)
}
```

`downTo` 和 `step` 是扩展函数，而不是关键字。

`..` 实际上是 `T.rangeTo(that: T)`

## 空安全

```Kotlin
val notNullText: String = "Definitely not null"
val nullableText1: String? = "Might be null"
val nullableText2: String? = null

fun funny(text: String?) {
    if (text != null)
        println(text)
    else
        println("Nothing to print :(")
}

fun funnier(text: String?) {
    val toPrint = text ?: "Nothing to print :("
    println(toPrint)
}
```

::: info
在 `if (text != null) { ... }` 代码块中，这里的 `text` 被智能转换为 `String`。也就是说，编译器能够理解 `text` 是一个 `String` 类型，因为 `if` 表达式已经检查并确认了 `text` 不可能为 `null`。

在某些 IDE 中，智能转换会被高亮显示（例如在 IntelliJ IDEA 中，除非在设置中关闭了该选项）。智能转换将在函数式编程、JVM 与 Kotlin 编译器两讲中更详细地讨论。
:::

## Elvis 运算符 `?:`

如果 `?:` 左侧的表达式不为 `null`，Elvis 运算符将返回该表达式；否则，它将返回右侧的表达式。

请注意，只有当左侧的结果为 `null` 时，才会计算右侧的表达式。

```Kotlin
fun loadInfoById(id: String): String? {
    val item = findItem(id) ?: return null
    return item.loadInfo() ?: throw Exception("...")
}
```

::: info
`x ?: y` 等同于 `if (x != null) x else y`。这句话完整描述了 Elvis 运算符的行为。
:::

## 安全调用

`someThing?.otherThing` 在 `someThing` 为 `null` 的情况下不会抛出 NPE（空指针异常）。

安全调用在链式操作中非常有用。例如，一名员工（Employee）可能会被分配到某个部门（Department），也可能没有。而该部门反过来可能有另一名员工作为部门负责人（Head），负责人可能有名字，也可能没有，而我们想要打印这个名字：

```Kotlin
fun printDepartmentHead(employee: Employee) {
    println(employee.department?.head?.name)
}
```

如果只想针对非空值进行打印，可以将安全调用运算符与 `let` 结合使用：

```Kotlin
employee.department?.head?.name?.let { println(it) }
```

## 非安全调用

非空断言运算符（`!!`）会将任何值转换为非空类型。如果该值为 `null`，它会抛出 NPE（空指针异常）。

```Kotlin
fun printDepartmentHead(employee: Employee) {
    println(employee.department!!.head!!.name!!)
}
```

**请避免使用非安全调用！**

## TODO

如果被调用，会在**运行时**抛出 `NotImplementedError`，并指出该操作未实现。

```Kotlin
// 如果调用此函数，运行时会抛出错误，但编译会通过
fun findItemOrNull(id: String): Item? = TODO("Find item $id")

// 完全无法编译
fun findItemOrNull(id: String): Item? = { }
```

::: info
TODO 通常用于勾勒逻辑原型并推迟其具体实现，因为一次性实现所有逻辑是很困难的。通过为所有必要的实体（类、接口及其方法和值）分配 TODO，然后由底向上逐步将 TODO 替换为实际实现，可以更轻松地完成增量开发。

由于 TODO 的实现方式，它允许存根代码通过编译。此外，所有 TODO 的使用都会被添加到 IntelliJ IDEA 的 TODO/FIXME 等列表中，因此你可以瞬间找到所有需要实现的内容，并确保万无一失。

此外，`error`、`require`、`requireNotNull`、`check` 和 `checkNotNull` 是（在特定谓词下）非常实用的便捷抛出异常的方式。

`error("<error description>")` 是 `throw IllegalStateException("<error description>")` 的简写，用于当事情未按计划进行且你需要为此抛出异常时。

`check(predicate) { "<error description>" }` 是 `if (!predicate) throw IllegalStateException("<error description>")` 的简写，其用法与 `error` 相同，但会为你检查谓词。

`require` 是 `if (!predicate) throw IllegalArgumentException("<error description>")` 的简写，用法与 `check` 相同，但用于函数输入不正确（格式错误）且你需要抛出与之相关的异常时。
:::

## 模板字符串与字符串构建器

```Kotlin
val i = 10
val s = "Kotlin"

println("i = $i")
println("Length of $s is ${s.length}")

val sb = StringBuilder()
sb.append("Hello")
sb.append(", world!")
println(sb.toString())
```

::: info
最后一个示例值得了解并理解，但在实际开发中，最好使用 `buildString`。例如，最后一个示例可以用更符合惯例的方式编写如下：

```Kotlin
val string = buildString {
    append("Hello")
    append(", world!")
}
println(string)
```

:::

## Lambda 表达式

```Kotlin
val sum: (Int, Int) -> Int = { x: Int, y: Int -> x + y }
val mul = { x: Int, y: Int -> x * y }
```

根据 Kotlin 的惯例，如果函数的最后一个参数是一个函数，那么作为对应参数传递的 Lambda 表达式可以放在圆括号之外：

```Kotlin
val badProduct = items.fold(1, { acc, e -> acc * e })
```

```Kotlin
val goodProduct = items.fold(1) { acc, e -> acc * e }
```

如果 Lambda 是唯一的参数，则可以完全省略括号（文档将此功能称为“尾随 Lambda 作为参数”）：

```Kotlin
run({ println("Not Cool") })
run { println("Very Cool") }
```

## 如有疑问

参见：

- [kotlinlang.org](https://kotlinlang.org)
- [kotlinlang.org/docs](https://kotlinlang.org/docs)
- [play.kotlinlang.org/byExample](https://play.kotlinlang.org/byExample)
