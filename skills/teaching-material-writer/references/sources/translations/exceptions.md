# 异常

::: info
本文翻译自：https://kotlinlang.org/education/
:::

## 是什么？为什么？

异常表示发生了*异常的*状况。

- 开发错误
- 由（程序外部）资源引发的错误
- 系统错误

为何使用异常：

- 将错误处理代码与常规代码分离
- 将错误向上传播至调用堆栈 —— 或许有人知道如何处理该错误
- 分组并区分错误类型

切勿将异常用于：

- 控制流
- 可控错误

::: info
今天我们将讨论异常。

异常是指在程序执行过程中发生的、会中断程序指令流的事件。可能出现各种类型的错误 —— 例如尝试打开不存在的文件、算术运算错误（除以 0）等等。还可能出现系统错误，例如应用程序内存不足，这种情况下就会触发相应的异常，如“内存不足错误”。

为什么我们要使用异常？

1. 将错误处理分离出来。一个很好的例子是用于打开、读取和关闭文件的简单代码片段。可能会发生多种错误，如“文件未找到”、“内存不足”、“磁盘空间不足”、“无法关闭文件”等。通过使用不同的异常类型，你可以利用异常处理语言特性分别处理这些错误。
2. 传播错误。假设你有一个包含 10 个函数的调用栈。假设第 1 个函数是我们的 `main()`，它调用第 2 个函数，而第 10 个函数尝试打开文件时触发了“文件未找到”异常。借助异常，你可以在 `main()` 函数内处理此错误 —— 异常将通过调用栈向上传播。

   请注意，在处理异步代码时，异常传播可能会比较棘手。Kotlin 提供了一种基于结构化并发原则的出色协程实现，但关于使用协程时的异常处理和传播，我们将在后面讨论。

3. 对错误类型进行分组。异常实际上是类。正如基类类型层次结构一样，错误类型也有一个层次结构。初始的异常层次结构（例如我们之前提到的与文件相关的异常）在标准库中已实现，但可以进行扩展 —— 你可以使用类继承并引入自己的异常类。

将异常用于控制流控制可能被视为反模式。异常专用于处理任何异常错误情况。异常与非局部 _Goto_ 语句非常相似，因此将其用于控制流可能会违反“最小惊讶原则”，并导致代码难以阅读和理解。
:::

## 怎么做？

```Kotlin
fun main() {
   throw Exception("Hello, world!")
}
```

或者更好的是：

```Kotlin
fun main() {
   val nullableString: String? = null
   println("Hello, NPE! ${nullableString!!}")
}

Exception in thread "main" java.lang.NullPointerException // [!code error]
```

::: info
异常机制是从 Java 引入 Kotlin 的。总体概念非常相似，但仍存在一些显著差异。

让我们来看一段抛出异常的简单代码。要“手动”（或显式）抛出异常，我们可以使用 `throw` 关键字和任意异常类型，例如 `Exception`。Kotlin 不支持受检查异常。换句话说，所有异常都是未检查的——无需显式处理任何异常。Kotlin 编译器不会强制要求你用 `try-catch` 包裹任何调用，也不会强制“重新抛出”任何异常。请尝试编译第一个代码片段——你会发现不会出现任何编译时错误。你可能已经注意到，Kotlin 的函数签名中没有 `throws` 子句。此外，Kotlin 中也没有 `throws` 关键字。但如果没有 `throws` 关键字，我们如何判断某个 Kotlin 函数是否可能抛出异常？你可以使用 KDoc 的 `@throws` 和 `@exception` 块注解：

```Kotlin
/**
* @throws Exception
*/
fun foo() {
   throw Exception()
}
```

为了与 Java 兼容，也可以使用 `@Throws` 注解：

```Kotlin
@Throws(Exception::class)
fun foo() {
   throw Exception()
}
```

你还记得 Kotlin 的空安全原则吗？即使使用了 `!!` 运算符，在 Kotlin 中我们仍然可能会遇到 `NullPointerException`。请看第二个代码示例。
:::

## 示例

```Kotlin
fun main() {
    try {
        throw Exception("An exception", RuntimeException("A cause"))
    } catch (e: Exception) {
        println("Message: ${e.message}")
        println("Cause: ${e.cause}")
        println("Exception: $e") // 底层会调用 toString()
        e.printStackTrace()
    } finally {
        println("Finally always executes")
    }
}
```

```Shell
Message: An exception
Cause: java.lang.RuntimeException: A cause
Exception: java.lang.Exception: An exception
Finally always executes
java.lang.Exception: An exception # [!code error:5]
		at MainKt.main(Main.kt:3)
		at MainKt.main(Main.kt)
Caused by: java.lang.RuntimeException: A cause
	... 2 more
```

::: info
如何在 Kotlin 中处理异常？

如果某些代码可能会抛出异常，我们可以使用 `try-catch` 语句将其包裹起来并处理异常。

请注意 `catch` 语句——右侧显式指定了异常类型。我们之前讨论过异常层次结构——如果将 `Exception` 替换为 `RuntimeException` 会怎样？试着运行这段代码。你会发现异常并未被捕获。这就是原则 3：“分组并区分错误类型”。在异常层次结构中，只有 `catch` 子句中指定的类型及其子类才会被捕获。

最后，本例中的 `finally` 代码块是可选的，可以省略。即使捕获了异常，`finally` 代码块仍会执行。

你可能会注意到，在这个代码示例中，我们将消息和原因都作为参数传递了。实际上，每个异常都可以拥有可选的消息和原因。在处理异常时，你可以获取这两个值。
:::

## 另一个有意义的例子

```Kotlin
data class Person(val name: String, val surname: String, val age: Int) {
   init {
       if (age < 0) {
           throw IllegalStateException("Age cannot be negative")
       }
       if (name.isEmpty() || surname.isEmpty()) {
           throw IllegalArgumentException("For blank names/surnames use -")
       }
   }
}
```

::: info
一个函数可能会抛出不同类型的异常（再次涉及原则 3“分组并区分错误类型”）。试着创建一个 `Person` 对象，例如：

```Kotlin
val person = Person("Alex", "", -1)
```

正如你可能注意到的，年龄和姓氏都指定错误了。但如果你运行这样的代码，只会得到一个 `IllegalStateException`。如前所述，该异常将中断正常的代码流程，并传播错误。
:::

## 处理异常

```Kotlin
try {
   val (n, s, a) = readLine()!!.split('/')
   val person = Person(n, s, a.toInt())
   addToDataBase(person)
} catch (e: IllegalStateException) {
   println("You've entered a negative age! Why?")
} catch (e: IllegalArgumentException) {
   println(e.message)
} catch (e: NullPointerException) {
   println("NPE ;^)")
} catch (e: Exception) {
   println("Something else went wrong")
   throw Exception("Failed to add to the database", e)
} finally {
   println("See you in the next episodes!")
}
```

你可以：

- 正确处理错误并继续执行
- 在你这边进行处理，然后重新抛出异常

::: info
现在我们来看一个稍微复杂一点的例子。如果我们需要处理不同类型的异常该怎么办？此时可以编写多个 `catch` 代码块。同样地，这里的 `finally` 代码块是可选的，即使省略它也不会影响异常处理。

最后，你可能会想：如果我们需要为 `IllegalStateException` 和 `IllegalArgumentException` 编写类似的异常处理程序该怎么办？例如，在 Java 中我们可以这样写：

```java
class Main {
   public static void foo() throws IllegalStateException, IllegalArgumentException {
       //...
   }

   public static void main(String[] args) {
       try {
           foo();
       } catch (IllegalStateException | IllegalArgumentException e) {
           // 处理异常
       }
   }
}
```

如何在 Kotlin 中实现类似的功能？问题在于 Kotlin 并不提供多重 `catch` 块（参见相关的 Kotlin YouTrack 问题）。但你可以利用极其灵活的 `lambda` 表达式和相应的 Kotlin 惯例来获得类似的解决方案。例如，请看 Roman Elizarov 于 2022 年 5 月提出的建议：

```Kotlin
inline fun <T, E> Result<T>.on(vararg exceptionClasses: KClass<out E>, action: (exception: E) -> Unit) =
   onFailure { exception ->
       if (exceptionClasses.any { it.isInstance(exception) }) action(exception as E)
   }

runCatching {
   // 做一些糟糕的事情...
   .on(IllegalArgumentException::class, IllegalStateException::class) {
      kotlin.io.println("Something went terribly wrong ${it.message}")
   }
}
```

看起来非常相似，对吧？
:::

## 👀

![](/assets/kotlin-edu-sinicization/kotlin-exception.png)

以及在 `java.util` 中还有很多。

::: info
再谈谈异常层次结构。如前所述，Kotlin 的异常继承自 Java，并沿用了相应的异常层次结构。请看幻灯片上的层次结构。当然，这并非完整列表，但你可能会注意到 `Exception` 及其子类 `RuntimeException`。这是 Java 中的一个非常重要的部分，因为 `RuntimeException` 及其子类属于未检查异常。但需要再次强调 —— Kotlin 中不存在受检查异常。

你可能还会注意到 `Throwable` 中的 `message` 和 `cause` 字段——正如我们之前讨论的那样，每个异常都有两个可选值。请记住，异常是一个类——因此你可以使用继承来引入特定的异常，例如：

```Kotlin
class CustomException : Exception()
```

并像之前展示的那样抛出和捕获它。

请记住原则 3：“分组并区分错误类型”，但应尽可能复用标准异常。
:::

## Kotlin 语法糖

`try` 是一个表达式

```Kotlin
val a: Int? = try { input.toInt() } catch (e: NumberFormatException) { null }
```

更多语法糖：

```Kotlin
require(count >= 0) { "Count must be non-negative, was $count" }
// IllegalArgumentException

error("Error message")
// IllegalStateException
```

::: info
与 Kotlin 中几乎所有其他语言特性一样，`try` 也是一个表达式。在这种情况下，返回值将是 `try` 或 `catch` 代码块中的最后一个表达式。Kotlin 的标准库中还提供了一些用于处理异常的额外函数，例如 `require`。让我们来看看它的实现：

```Kotlin
@kotlin.internal.InlineOnly
public inline fun require(value: Boolean, lazyMessage: () -> Any): Unit {
   contract {
       returns() implies value
   }
   if (!value) {
       val message = lazyMessage()
       throw IllegalArgumentException(message.toString())
   }
}
```

你可以看到，当传入的值为 `false` 时，该函数会抛出 `IllegalArgumentException`。

现在，让我们尝试使用 `require` 来实现 `Person` 数据类，而不是显式抛出异常：

```Kotlin
data class Person(val name: String, val surname: String, val age: Int) {
   init {
       require(age > 0)  { "Age cannot be negative or zero" }
   }
}
```

相当简洁，你觉得呢？
:::
