# 反射（JVM）

::: info
本文翻译自：https://kotlinlang.org/education/
:::

## 什么是反射？

“反射可以定义为：程序将表示其自身执行期间状态的某种东西作为数据进行操纵的能力。”*

一个反射的简单例子是：在运行时重新定义对象中类的字段。

_\*Daniel G Bobrow, Richard P Gabriel, and Jon L White. 1993. Object Oriented Programming: The CLOS Perspective (1993), 29–61._

::: info
反射可以定义为：程序将表示其自身执行期间状态的某种东西作为数据进行操纵的能力。

本节课我们只考虑 JVM 这一个目标平台。
:::

## Java 中的反射

### 一个示例

让我们创建一个简单的 Kotlin 类：

```Kotlin
class Dog(val name: String, var age: Int) {
   fun bark() = println("bark")
   private fun privateBark() =
       println("private bark!")
   companion object {
       @JvmStatic
       fun publicStaticMethod() =
           println("Hi from public static")
       @JvmStatic
       private fun privateStaticMethod() =
           println("Hi from private static")
       fun publicNotReallyStaticMethod() =
           println("Hi from public not really static")
       private fun privateNotReallyStaticMethod() =
           println("Hi from private not really static")
   }
}
```

::: info
我们来创建一个名为 `Dog` 的简单 Kotlin 类。这个类有两个字段：只读的 `name` 和可变的 `age`。它还有两个简单的方法，一个是公有的，一个是私有的。

在类内部，我们还创建了一个伴生对象，其中有四个简单的方法。它们之间的主要区别在于，其中两个带有 `@JvmStatic` 注解。这个注解在 JVM 目标平台上将方法标记为静态的，这意味着你可以在 Java 中通过 `Dog.publicStaticMethod()` 调用这个方法。如果没有这个注解，你就必须通过一个中间层级来调用函数：`Dog.Companion.publicNotReallyStaticMethod()`。这些例子只是为了展示与 Java 的互操作。在 Kotlin 代码中，你可以直接使用 `Dog.publicStaticMethod()` 和 `Dog.publicNotReallyStaticMethod()` 调用这两个方法。
:::

### 主入口

`Class<T>` 类的实例表示正在运行的 Java（Kotlin）应用程序中的类和接口。这是反射的主入口。

![](/assets/kotlin-edu-sinicization/reflection-in-java-the-main-entry-point.png)

::: info
由于 Kotlin 与 Java 代码完全兼容，你可以轻松地使用 Java 反射。我们先来看 Java 反射，然后再看 Kotlin 的对应物。在 JVM 下使用 Kotlin 反射的最佳方式是 Java 反射与 Kotlin 反射相结合。反射的主入口是 `Class<T>` 类，可以通过在任何 Kotlin 对象上调用 `::class.java` 来访问它。
:::

### 获取字段

我们可以获取所有字段：

```Kotlin
println("Fields:")
dog::class.java.fields.forEach { println(it.name) }
```

但结果是一个空列表！

```Kotlin
class Dog(val name: String, var age: Int) {
   fun bark() = println("bark")
   private fun privateBark() =
       println("private bark!")
    ...
}
```

::: info
回到前面幻灯片中的例子，我们有一个 `Dog` 类，它有两个字段——`name` 和 `age`。使用反射，对于任何对象我们都可以获取字段列表并打印它们的名称，例如对于一个类型为 `Dog` 的 `dog` 对象，我们预期会得到两个字段名——`name` 和 `age`。这可以通过访问 `Class<T>` 对象的字段来实现。但在我们的例子中，我们得到的却是一个空列表——问题可能出在哪里呢？
:::

### 看看字节码

Kotlin 源码：

```Kotlin
class Dog(val name: String, var age: Int)
```

反编译出的 Java 源码：

```java
public final class Dog {
   @NotNull
   private final String name;
   private int age;
   ...
}
```

Kotlin 字节码：

```Java
// ================Dog.class ================= // class version 52.0 (52)
// access flags 0x31
public final class Dog {

// access flags 0x12
private final Ljava/lang/String; name @Lorg/jetbrains/annotations/NotNull;() // 不可见注解

…
}
```

::: info
如果我们检查 Kotlin 字节码和反编译出的类文件，会看到我们的两个字段都是私有的。为了在 Java 层面实现 Kotlin 的可变性控制，编译器创建了 getter 和 setter 方法，但字段本身是私有的。而 `fields` 只返回公有字段。
:::

### `fields` 与 `declaredFields`

我们可以获取所有公有字段：

```Kotlin
println("Fields:")
dog::class.java.fields.forEach { println(it.name) }
```

我们也可以获取所有字段（无论修饰符是什么）：

```Kotlin
println("Declared fields:")
dog::class.java.declaredFields.forEach { println(it.name) }
```

输出：

```text
Declared fields:
name
age
```

::: info
不过，反射是一个强大的机制，我们也可以用它访问私有字段。为此，我们可以使用 `declaredFields`。这样一来，我们的例子就一切正常了。
:::

### 修改字段

我们可以修改任何字段：

```Kotlin
dog.name = "Bob" // 报错！！
```

↓ 反射魔法

```Kotlin
dog::class.java.declaredFields.find { it.name == "name" }?.set(dog, "Bob")
println(dog.name)
```

::: info
现在我们已经确认可以获取所有字段。我们不仅能以只读对象的形式获取它们，还可以修改它们。为此，我们只需按名称找到所需的字段，然后调用 `set` 方法，传入该类的对象和新字段值。一定要使用与原始类要求相同的类型，否则你会得到运行时错误。
:::

但直接运行时，我们会得到一个错误：

```text
Exception in thread "main" java.lang.IllegalAccessException: class MainKt cannot access a member of class Dog with modifiers "private final"
at java.base/jdk.internal.reflect.Reflection.newIllegalAccessException(Reflection.java:392)
at java.base/java.lang.reflect.AccessibleObject.checkAccess(AccessibleObject.java:674)
at java.base/java.lang.reflect.Field.checkAccess(Field.java:1102) at java.base/java.lang.reflect.Field.set(Field.java:797)
at MainKt.main(Main.kt:11)
```

::: info
按理说这段代码应该能工作，但我们却得到了一个错误。实际上，因为字段是私有的，默认情况下你无法修改它。
:::

反射机制允许你指定对对象的访问级别，然后再修改它：

```Kotlin
dog::class.java.declaredFields.find { it.name == "name" }?.let{
    it.isAccessible = true
    it.set(dog, "Bob")
}
println(dog.name)
```

输出：

```text
Bob
```

::: info
不过，反射机制允许你指定对对象的访问级别，然后再修改它。
:::

### 获取类的方法

我们可以获取类中的所有方法：

```Kotlin
println("Methods:")
dog::class.java.methods.forEach { println(it.name) }
```

输出：

```text
Methods:
getName
getAge
setAge
bark
publicStaticMethod
wait
wait
wait
equals
toString
hashCode
getClass
notify
notifyAll
```

对照我们的类：

```Kotlin
class Dog(val name: String, var age: Int) {
   fun bark() = println("bark")
   private fun privateBark() = println("private bark!")

   companion object {
       @JvmStatic
       fun publicStaticMethod() = println("Hi from public static")
       @JvmStatic
       private fun privateStaticMethod() = println("Hi from private static")
       fun publicNotReallyStaticMethod() = println("Hi from public not really static")
       private fun privateNotReallyStaticMethod() = println("Hi from private not really static")
   }
}
```

::: info
使用反射，我们还可以获取类中所有方法的列表。最终的列表会比原始类中的方法更多。
:::

其中：

- `equals`、`toString`、`hashCode`、`getClass` 是标准的 `Object` 方法；
- `wait`、`notify`、`notifyAll` 是标准的线程同步方法；
- `getName`、`getAge`、`setAge` 是属性的 getter 和 setter——Kotlin 的可变性由 getter 和 setter 控制：`val` 只有 getter（因为值不能改变），`var` 则两者都有；
- 只包含公有方法，且没有来自伴生对象的方法（除了带 `@JvmStatic` 注解的）。

::: info
例如，列表中有几个标准的 `Object` 方法。

也有标准的线程同步方法。

如前所述，Kotlin 的可变性由 getter 和 setter 控制。`val` 只有 getter，因为我们不能改变它的值；而 `var` 可以同时拥有 getter 和 setter。

和字段一样，`methods` 只返回当前类的公有方法，以及该类伴生对象中带 `@JvmStatic` 注解的方法。
:::

### `declaredMethods`

使用 `declaredMethods`，我们可以获取所有方法（无论修饰符是什么），但继承来的方法除外：

```Kotlin
println("Declared methods:")
dog::class.java.declaredMethods.forEach { println(it.name) }
```

输出：

```text
Declared methods:
getName
getAge
setAge
bark
privateBark
publicStaticMethod
privateStaticMethod
```

注意：从伴生对象中只返回带 `@JvmStatic` 注解的方法。

::: info
与 `methods` 不同，`declaredMethods` 返回当前类的所有方法（无论修饰符是什么），以及该类伴生对象中带 `@JvmStatic` 注解的方法，但不包括继承来的方法。
:::

### 伴生对象自己的方法

```Kotlin
println("Methods from companion:")
Dog.Companion::class.java.methods.forEach { println(it.name) }
```

输出：

```text
Methods from companion: publicNotReallyStaticMethod
publicStaticMethod
access$privateStaticMethod
wait
wait
wait
equals
toString
hashCode
getClass
notify
notifyAll
```

::: info
如果我们查看伴生对象中的方法列表，会发现一些额外的方法，比如 `access$privateStaticMethod`。
:::

```Kotlin
println("Declared methods from companion:")
Dog.Companion::class.java.declaredMethods.forEach { println(it.name) }
```

输出：

```text
Declared methods from companion:
publicNotReallyStaticMethod privateNotReallyStaticMethod
publicStaticMethod
privateStaticMethod
access$privateStaticMethod
```

::: info
`declaredMethods` 的情况也是如此。
:::

### 深入字节码

`Dog` 类：

```text
public final class Dog {
…
// access flags 0x19
public final static publicStaticMethod()V
@Lkotlin/jvm/JvmStatic;()
L0
GETSTATIC Dog.Companion : LDog$Companion;
INVOKEVIRTUAL Dog$Companion.publicStaticMethod ()V
RETURN
L1
MAXSTACK = 1
MAXLOCALS = 0
…
}
```

`Dog$Companion` 类：

```text
public final class Dog$Companion {
…
// access flags 0x11
public final publicStaticMethod()V
@Lkotlin/jvm/JvmStatic;()
L0
LINENUMBER 10 L0
LDC "Hi from public static"
ASTORE 1
L1
GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
ALOAD 1
INVOKEVIRTUAL java/io/PrintStream.println (Ljava/lang/Object;)V L2
L3
LINENUMBER 10 L3
RETURN
L4
LOCALVARIABLE this LDog$Companion; L0 L4 0
MAXSTACK = 2
MAXLOCALS = 2
…
}
```

`Dog` 类中的 `publicStaticMethod` 调用了真正的那个方法。

::: info
让我们看看伴生对象的方法在底层是如何工作的。对于带 `@JvmStatic` 注解的公有方法，一切都很清楚。我们只需在伴生对象内部创建这个方法，编译器就会自动在最初的 `Dog` 类中创建相同的方法。这使我们能够在 Java 中直接从 `Dog` 类调用 `publicStaticMethod` 方法。在这种情况下，`Dog` 类中的方法只是简单地调用伴生对象中的方法。
:::

再来看看私有的静态方法：

```text
public final class Dog$Companion {
…
 // access flags 0x12
 private final privateStaticMethod()V
 @Lkotlin/jvm/JvmStatic;()
 L0
 LINENUMBER 14 L0
 LDC "Hi from private static"
 ASTORE 1
 L1
 GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
 ALOAD 1
 INVOKEVIRTUAL java/io/PrintStream.println (Ljava/lang/Object;)V
 L2
 L3
 LINENUMBER 14 L3
 RETURN
 L4
 LOCALVARIABLE this LDog$Companion; L0 L4 0
 MAXSTACK = 2
 MAXLOCALS = 2
…
}
```

```text
public final class Dog {
…
 // access flags 0x1A
 private final static privateStaticMethod()V
 @Lkotlin/jvm/JvmStatic;()
 L0
 GETSTATIC Dog.Companion : LDog$Companion;
 INVOKESTATIC Dog$Companion.access$privateStaticMethod (LDog$Companion;)V
 RETURN
 L1
 MAXSTACK = 1
 MAXLOCALS = 0
…
}
```

`access$privateStaticMethod`——有一个来自 `Dog` 类的引用指向它，因为私有方法无法被直接调用。

::: info
对于带 `@JvmStatic` 注解的私有静态方法，情况稍有不同。在这种情况下，由于 `@JvmStatic` 注解，`Dog` 类内部仍然会生成额外的方法，但它无法调用伴生对象中的私有方法。

因此，我们需要在伴生对象内部创建一个额外的公有方法，名为 `access$privateStaticMethod`。这个新方法只是简单地调用 `privateStaticMethod`，从而允许我们从 `Dog` 类调用 `access$privateStaticMethod`。
:::

### 调用方法

我们可以调用方法：

```Kotlin
dog::class.java.methods.find { it.name == "bark" }?.invoke(dog)
```

传入一个对象以调用该方法。输出：`bark`

::: info
和字段一样，方法也可以被调用。你必须始终把目标对象实例作为第一个参数传入，然后是所有函数参数。由于我们的函数没有任何参数，所以我们不传参。
:::

我们甚至可以调用私有方法：

```Kotlin
dog::class.java.declaredMethods.find { it.name == "privateBark" }?.invoke(dog)
```

但我们需要小心，否则可能会得到这样的错误：

```text
Exception in thread "main" java.lang.IllegalAccessException: class MainKt cannot access a member of class Dog with modifiers "private final" 	at java.base/jdk.internal.reflect.Reflection.newIllegalAccessException(Reflection.java:392) 	at java.base/java.lang.reflect.AccessibleObject.checkAccess(AccessibleObject.java:674) 	at java.base/java.lang.reflect.Method.invoke(Method.java:560) 	at MainKt.main(Main.kt:26)
```

::: info
我们甚至可以调用私有方法，但我们需要小心，否则可能会遇到问题。
:::

要解决这个问题，我们只需要改变可访问性的值：

```Kotlin
dog::class.java.declaredMethods.find { it.name == "privateBark" }?.let{
    it.isAccessible = true
    it.invoke(dog)
}
```

输出：`private bark!`

::: info
要解决这个问题，我们只需要改变可访问性的值。
:::

### 调用静态方法

我们可以调用静态方法：

```Kotlin
dog::class.java.declaredMethods.find { it.name == "privateStaticMethod" }?.let{
    it.isAccessible = true
    it.invoke(null)
}
```

输出：`Hi from private static`

传入 `null` 以调用该方法。

::: info
如果我们要调用一个静态方法（字节码中带有 `ACC_STATIC` 标志），需要传入 `null` 作为类对象。
:::

### 其他函数

API 中还有很多其他很棒的函数可用！

https://docs.oracle.com/javase/8/docs/technotes/guides/reflection/index.html

还有许多其他有用的库在底层使用 Java Reflection API，比如 Reflections 和 ClassGraph。

::: info
如你所见，Java 反射允许你在程序运行时完成一些相当复杂的事情。要进一步了解 Java Reflection API 的能力，请查看官方文档。

此外，许多常见的任务，例如在运行时搜索实体，已经有各种库可以实现——它们在底层使用这套 API，但让使用起来更方便一些。
:::

## Kotlin 中的反射

你可以在 Kotlin 代码中使用 Java Reflection API，但有一些语言特有的特性它没有覆盖：

- 数据类（Data classes）
- 可空性（Nullability）
- 顶层函数（Top-level functions）
- 其他 Kotlin 特有的特性

Kotlin 有自己的反射 API，它（在 JVM 上）是基于 Java 反射实现的。https://kotlinlang.org/docs/reflection.html

::: info
由于 Kotlin 与 Java 完全互操作，你可以在 Kotlin 代码中使用 Java Reflection API。然而，有些 Kotlin 特性——例如类是否被标记为 `data`、类型的可空性以及顶层函数——是 Java Reflection API 无法识别的。为了照顾这类特性，Kotlin 拥有自己的反射 API，它（在 JVM 上）主要基于 Java 反射实现。
:::

### 一个示例

`KClass<T>` 类的实例表示正在运行的 Kotlin 应用程序中的类和接口。它是反射的主入口。

![](/assets/kotlin-edu-sinicization/reflection-in-kotlin-an-example.png)

::: info
Kotlin 反射的主入口是 `KClass<T>` 接口，可以通过在任何 Kotlin 对象上使用 `::class` 运算符来访问它。
:::

方法通常用于检查各种属性、获取成员函数等等：

```Kotlin
println(dog::class.isAbstract)
println(dog::class.isFinal)
```

输出：

```text
false true
```

```Kotlin
dog::class.memberProperties.forEach{ println(it.name) }
dog::class.memberFunctions.forEach{ println(it.name) }
```

输出：

```text
age
name

bark
privateBark
equals
hashCode
toString
```

别忘了在依赖列表中加入 kotlin-reflect！

::: info
有方法可用于检查属性，以及获取属性和成员函数。例如，我们可以检查一个类是否是抽象的或最终的。

Kotlin 反射默认不包含在 Kotlin 标准库中。如果你想使用 Kotlin 反射，需要将 kotlin-reflect 添加到你的依赖列表中。
:::

### 与类型一起使用

反射既可以用于函数，也可以用于类型：

```Kotlin
fun myTopLevelFun() = println("My top-level function")
```

```Kotlin
println(::myTopLevelFun.returnType)
println(::myTopLevelFun.returnType.isMarkedNullable)
```

输出：

```text
kotlin.Unit false
```

别忘了在依赖列表中加入 kotlin-reflect！

::: info
你还可以处理顶层函数及其类型，例如检查返回类型是否被标记为可空类型。
:::

### 结合 Java 与 Kotlin 实体

你可以通过 `kotlinFunction` 或 `kotlinProperty`，从 Java 的 `Method` 或 `Field` 获取 `KFunction` 或 `KProperty`：

```Kotlin
println(dog::class.java.declaredMethods
    .find { it.name == "privateStaticMethod" }?.kotlinFunction)
```

输出：

```text
fun Dog.Companion.privateStaticMethod(): kotlin.Unit
```

别忘了在依赖列表中加入 kotlin-reflect！

::: info
此外，你可以通过 `kotlinFunction` 或 `kotlinProperty`，从 Java 的 `Method` 或 `Field` 获取 `KFunction` 或 `KProperty`。
:::

### 底层原理

Kotlin 编译器会写入一个长长的注解（一条 protobuf 消息），其中包含所有必要的信息：

```text
@Lkotlin/Metadata;(mv={1, 8, 0}, k=1, d1={"\u0000\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0010\u0008\n\u0002\u0008\u0008\n\u0002\u0010\u0002\n\u0002\u0008\u0003\u0018\u0000 \u00102\u00020\u0001:\u0001\u0010B\u0015\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\u0002\u0010\u0006J\u0006\u0010\r\u001a\u00020\u000eJ\u0008\u0010\u000f\u001a\u00020\u000eH\u0002R\u001a\u0010\u0004\u001a\u00020\u0005X\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u0008\u0007\u0010\u0008\"\u0004\u0008\u0009\u0010\nR\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0008\n\u0000\u001a\u0004\u0008\u000b\u0010\u000c\u00a8\u0006\u0011"}, d2={"LDog;", "", "name", "", "age", "", "(Ljava/lang/String;I)V", "getAge", "()I", "setAge", "(I)V", "getName", "()Ljava/lang/String;", "bark", "", "privateBark", "Companion", "reflection"})
```

https://github.com/JetBrains/kotlin/blob/master/core/metadata/src/org/jetbrains/kotlin/metadata/ProtoBuf.java

::: info
你可能会好奇这是如何工作的，因为编译生成的类文件并不包含任何关于 Kotlin 特有特性的信息。答案其实很简单：Kotlin 编译器为每个 JVM 类创建一个包含所有必要信息的长注解，其形式是协议缓冲区（protocol buffer）消息。然后反射运行时会在底层读取这些信息。
:::

## 为什么需要反射？

- 它真的非常酷！你可以随心所欲地操纵你的程序。
- 它通常用于框架中，例如 Spring、JUnit 等。你可以根据用户的信息创建实体。
- 它可以用来测试你的应用程序（可以访问私有字段、方法等）。

::: info
为什么你会考虑使用反射？

首先，只是为了好玩——能够随心所欲地操纵你的程序真的很棒，这样做可以让你更好地理解 Kotlin 在底层是如何工作的，以及不同的 Kotlin 结构会被编译成什么。

在现实生活中，反射常用于 Spring 和 JUnit 等框架中。它通常根据用户信息创建实体，例如生成额外的类。

反射有时也用于测试，因为它允许你访问并测试程序中的所有私有实体。

不过，反射确实有其风险，甚至可能破坏你的程序！
:::

## 有什么缺点？

- 存在破坏程序的风险。例如，如果你通过重构重命名一个方法，反射调用中的方法名不会被自动重命名，因为反射可能以字符串形式引用旧名称。这可能导致严重的问题。
- 性能会下降，因为所有操作都在运行时执行。
- 它不允许编译期优化。

**如果你真的不需要反射，就避免使用它！**

::: info
当然，使用反射也有缺点。

如你可能已经注意到的，我们大多通过字符串常量来访问函数或字段。通过重构更改函数名并不会改变这个常量，这可能导致程序崩溃。

此外，一个主要的缺点是性能，因为所有操作都在运行时执行。

最后一个缺点同样影响性能。由于操作在运行时执行，因此无法进行任何编译期优化。

鉴于这些缺点，如果你真的不需要反射，最好避免使用它！
:::

## `MethodHandles`

`MethodHandles` 是一个提供对程序各个部分访问能力的 API：

- `MethodHandles.Lookup` 提供对字段和方法的访问。
- `MethodType` 用参数类型和返回类型定义一个方法签名。
- 方法和字段通过“直接”方法句柄（direct method handles）访问。
- 还提供句柄适配器（handle adapters）。

::: info
`MethodHandles` 于 Java 1.7 引入，是一个与反射类似的 API，最初是为了支持 JVM 上的动态语言而设计的，但后来事实证明，在我们已知要调用的方法和字段的签名信息的场景下，它是反射的高性能替代品。

`MethodHandles.Lookup` 是一个工厂，允许我们获取字段和方法的方法句柄。

`MethodType` 只是存储方法的参数类型和返回类型。

这个 API 之所以如此命名，是因为它通过直接句柄访问方法和字段：这些句柄只在查找（lookup）时一次性精确地确定被调用的方法变体、是否有权调用该方法等等。这种确定性使其比反射更高效——例如，反射总是需要将参数数组与方法匹配以确保类型安全。

此外，该 API 还包含句柄适配器，可以对被处理方法的参数进行预处理、对返回值进行后处理，从而方便地组合多个方法句柄。
:::

`MethodHandles` 不是反射的一种形式，但它们非常相似：

- 它们可以用于与反射类似的任务。
- 它们工作得更好，因为可以应用 JIT 优化，并且需要更少的调用正确性检查。

::: info
总结一下。不应将方法句柄视为反射 API。`MethodHandles.Lookup` 本身无法枚举一个类的方法，也无法识别它们的签名。

反射和方法句柄都支持动态方法调用，二者甚至可以结合使用，因为方法可以用反射解析，再用方法句柄调用。

方法句柄的性能通常更好，这归因于更少的访问检查和参数检查，以及 JVM 执行的特殊 JIT 优化。
:::

两种查找方式：

- `MethodHandles.publicLookup()`：只提供对公有字段和方法的访问，这些字段和方法可以从任何地方访问。
- `MethodHandles.lookup()`：提供对调用此查找的位置可用的字段和方法的访问。

::: info
我们可以请求两种类型的方法句柄查找。公有查找（public lookup）只允许访问可以从任何地方调用的公有字段和方法，因此无论你在哪里获取它，它的行为都是一样的。

然而，当你执行普通查找（lookup）时，它将完全访问在获取该查找的类中可以访问的一切。这种行为称为“调用者敏感”（caller-sensitive）。这样的查找不会让你破坏任何封装，因为它允许你调用获取查找的那个类的私有方法，但不允许访问任何其他类的私有方法。除非你有意破坏自己类的封装，否则不应将此查找暴露给其他类。

仍有少数方法可以用方法句柄绕过封装，例如访问一个通过反射设为可访问的方法（我们接下来会讲到），或者使用特殊的私有查找（private lookup）。不过后者超出了本次课程的范围，因为它需要理解 Java 9+ 的模块机制。
:::

### 示例

我们可以找到一个 getter 并调用它：

```Kotlin
val lookup = MethodHandles.lookup()
val getProp = lookup.findVirtual(
   Dog::class.java,
   "getName",
   MethodType.methodType(String::class.java)
)
println(getProp.invoke(dog))
```

输出：`Andy`

::: info
首先，获取一个查找对象。然后，它在 `Dog` 类中查找一个虚方法（与静态方法相对）`getName`，该方法返回一个 `String`。最后在一个 `Dog` 实例上调用该方法。
:::

借助 Reflection API 也可以调用私有方法：

```Kotlin
val privateBarkMethod = Dog::class.java.getDeclaredMethod("privateBark")
privateBarkMethod.isAccessible = true

val privateBarkMH = lookup.unreflect(privateBarkMethod)
privateBarkMH.invoke(dog)
```

输出：`private bark!`

::: info
在这个例子中，我们绕过了一个私有方法的封装。首先，我们用反射获取 `Method`，然后通过调用查找对象的 `unreflect` 函数将其转换为 `MethodHandle`。然后我们直接调用它。
:::

我们也可以调用任何已知的方法：

```Kotlin
val mt = MethodType.methodType(Int::class.javaPrimitiveType)
val mh = lookup.findVirtual(List::class.java, "size", mt)
val i = mh.invokeExact(listOf(1, 2, 3)) as Int
println(i)
```

输出：`3`

::: info
这里我们使用一个 `MethodType` 对象来存储签名，并在 `List` 接口中定位匹配的方法。`size` 方法不接受参数并返回一个 `int`，然后我们用一个显然包含三个元素的列表调用它。
:::

事实上，`invokeExact` 既不提供到预期返回类的转换，也不提供任何类型转换（如装箱/拆箱）。

::: info
Java 方法句柄中 `invoke` 和 `invokeExact` 的区别在于它们处理类型的方式。`invoke` 会将参数类型适配为方法句柄签名所需的类型，因此更灵活但更慢。`invokeExact` 要求类型完全匹配，因此更快但不够灵活。
:::

如果我们传入错误的类型：

```Kotlin
val mt = MethodType.methodType(Int::class.javaPrimitiveType)
val mh = lookup.findVirtual(List::class.java, "size", mt)
val i = mh.invokeExact(arrayOf(1, 2, 3)) as Int
println(i)
```

```text
Exception in thread "main" java.lang.invoke.WrongMethodTypeException: expected (List)int but found (Integer[])int 	at java.base/java.lang.invoke.Invokers.newWrongMethodTypeException(Invokers.java:523) 	at java.base/java.lang.invoke.Invokers.checkExactType(Invokers.java:532) 	at MainKt.main(Main.kt:71)
```

::: info
无论如何，所有类型检查都会执行，传入与 `List` 无关的类型将会失败。
:::

## 要点回顾

- 如果你有机会不用反射解决问题，那就别用反射。
- 如果不用反射解决不了问题，可以考虑 `MethodHandles` 之类的替代方案。
- Java Reflection API 用起来可能很别扭，可以考虑改用 Kotlin 反射。
- 准备好捕捉非常奇怪和不寻常的 bug 吧！:)
