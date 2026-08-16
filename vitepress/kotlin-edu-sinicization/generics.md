# 泛型

::: info
本文翻译自：https://kotlinlang.org/education/
:::

今天我们要谈谈泛型：这是编写泛型代码的一种方式，这种代码能够处理不同类型的程序实体。

## 是什么？为什么？

```Kotlin
fun quickSort(collection: CollectionOfInts) { ... }
quickSort(listOf(1, 2, 3)) // OK
quickSort(listOf(1.0, 2.0, 3.0)) // NOT OK

fun quickSort(collection: CollectionOfDoubles) { ... } // 重载（稍后我们会再回到这一点）
quickSort(listOf(1.0, 2.0, 3.0)) // OK
quickSort(listOf(1, 2, 3)) // OK
```

Kotlin Number 的子类：`Int`、`Double`、`Byte`、`Float`、`Long`、`Short`

我们还需要另外 4 个 `quickSort` 的实现吗？

::: info
假设你在某个很棒的 Kotlin 项目中想要对一组整数进行排序。为此，你实现了一个 `quickSort` 函数，该函数将整数集合作为输入并对其进行排序。一切都按预期运行：你可以用它对整数列表 `[1, 2, 3]` 进行排序。

过了一段时间，你在项目中决定需要对一组双精度数（`double`）进行排序，而不是整数。然而，当你尝试将旧的 `quickSort` 函数用于双精度数列表 `[1.0, 2.0, 3.0]` 时，它无法正常工作，因为要对双精度数集合进行排序，你需要另一个将此类集合作为输入的函数。幸运的是，你可以利用“重载”这一特性来实现，即允许存在多个同名但参数不同的函数。当你为双精度集合实现快速排序后，这两种情况都能正常工作。

现在设想一下，如果将来你还需要对浮点数（`float`）或长整型（`long`）进行排序。这是否意味着你必须实现更多重载版本的 `quickSort`？而且这些版本之间真的有那么大的区别吗？
:::

## 怎么做？

快速排序算法真的会在意它排序的是什么吗？不会，只要它能对两个值进行比较就行。

```Kotlin
fun <T : Comparable<T>> quickSort(collection: Collection<T>): Collection<T> { ... }

quickSort(listOf(1.0, 2.0, 3.0)) // OK

quickSort(listOf(1, 2, 3)) // OK

quickSort(listOf("one", "two", "three")) // OK
```

::: info
事实证明，它们完全没有区别，因为快速排序（`quickSort`）是一个泛型算法。快速排序的实现只需一种比较集合中元素的方法。我们可以在 Kotlin 中使用泛型来编写这一实现。

假设在我们的快速排序场景中，我们可以这样定义：如果你提供一个由某种类型 `T` 的元素组成的集合（`Collection<T>`），且这些元素之间可以相互比较（`<T : Comparable<T>>`），那么我们就能对该集合进行排序。当你使用双精度集合（`Collection<Double>`）、整数集合（`Collection<Int>`）或字符串集合（`Collection<String>`）调用此函数时，Kotlin 能识别你希望使用的类型，并能成功编译和运行你的代码。
:::

泛型允许你编写能够处理任何类型，或处理那些需满足某些规则（约束）但不受其他限制的类型的代码：即类型参数。

```Kotlin
class Holder<T>(val value: T) { ... }

val intHolder = Holder<Int>(23)

val cupHolder = Holder("cup") // 泛型参数类型可被推断
```

::: info
泛型用尖括号（`<T>`）表示，可以将其视为特殊的类型参数或“占位符”，我们在使用泛型代码（调用泛型函数或使用泛型类型）时，会为其赋值一个具体类型。在泛型声明中，你可以像使用其他类型一样使用类型参数。

在此示例中，我们声明了一个容器类型：一个可以容纳任意类型值的盒子（并可能对其进行其他酷炫操作），其中“任意类型”的占位符由类型参数 `T` 表示。这个 `T` 被用作容器类型中 `val` 属性的类型。

使用泛型时，你需要指定用何种类型来替代类型参数。你可以通过在尖括号中显式写入类型（如 `Holder<Int>`）来实现。或者（这也是 Kotlin 中推荐的做法），你可以通过特定方式使用泛型代码，使其明确类型参数应被赋值为何种类型，从而隐式指定类型。

如果你尝试为一个杯子创建一个容器（`Holder("cup")`），我们可以利用 `val value: T` 被赋值给 `cup` 这一信息，推断出类型参数 `T` 应被赋值为杯子的类型，即字符串。这一过程称为“类型推断”，我们将在本课程的后续内容中详细讨论。
:::

## 约束

有时我们并不希望直接使用任意类型，而是期望该类型能提供某些特定功能。在这种情况下，我们会使用上界形式的类型约束：上界。

```Kotlin
class Pilot<T : Movable>(val vehicle: T) {
	fun go() { vehicle.move() }
}

val ryanGosling = Pilot<Car>(Car("Chevy", "Malibu"))
val sullySullenberger = Pilot<Plane>(Plane("Airbus", "A320"))
```

::: info
如果我们回到快速排序的示例，可以看到类型 `T` 必须可比较，否则快速排序将无法正常工作。换句话说，我们希望对类型参数可能填充的类型施加限制。

这通过类型参数约束来实现。它们写在类型参数之后（`T : Comparable<T>, T : Movable`），被称为上界，描述了类型参数 `T` 必须具备的超类型。在泛型代码内部，这意味着我们可以将类型 `T : A` 的值视为具有超类型 `A`（我们可以调用类型 `A` 的函数、访问类型 `A` 的属性等）。在泛型代码外部，我们在为类型参数赋值时必须遵守这些约束。

在幻灯片中的飞行员示例中，`Pilot` 类的对象必须驾驶可移动的物体（`T : Movable`）。在 `go()` 函数的实现中，我们利用这一限制来调用 `vehicle.move()`。创建飞行员时，我们会确保其驾驶的载具是可移动的（如 `Car`、`Plane`）；若试图为一块石头创建飞行员（假设 `Stone ≮: Movable`），编译器将捕获并报告错误。
:::

参数类型可以有多种，且泛型类可以参与继承。

```Kotlin
public interface MutableMap<K, V> : Map<K, V> { ... }
```

还可以有多个约束（这意味着类型参数必须实现多个接口）：

```Kotlin
fun <T, S> moveInAnAwesomeWayAndCompare(a: T, b: S) where T : Comparable<T>, S : Comparable<T>, T : Awesome, T : Movable { ... }
```

::: info
与常规函数参数类似，泛型代码可以包含多个类型参数（例如 `Map<K, V>`、`Triple<A, B, C>`）。在大多数情况下，泛型代码的使用方式与非泛型代码相同。例如，你可以将一个泛型类作为其他类型的超类。

本幻灯片中的 `MutableMap` 示例涉及两种泛型类型，但二者之间存在一个重要区别。`MutableMap<K, V>` 是一个泛型类型声明，它声明了两个类型占位符（`K` 和 `V`），在使用时需要填入具体类型。而 `Map<K, V>` 超类型则是对泛型类型的具体应用，它将 `MutableMap` 的类型参数作为类型实参传递，以填充 `Map` 接口的占位符。正如我们之前提到的，在泛型声明（`MutableMap<K, V>`）内部，你可以像使用完整的常规类型一样使用其类型参数（`K`、`V`）。

类型参数约束也不限于每个类型参数仅有一个。如果需要类型参数是多个类型的子类型（实现多个类和接口），我们可以设置多个约束。在这种情况下，它们通过在声明“头部”之后使用 `where` 子句来书写。
:::

## 星号投影

当你不在意参数类型时，可以使用*星号投影* `*`（`Any?` / `Nothing`）。

```Kotlin
fun printKeys(map: MutableMap<*, *>) { ... }
```

::: info
有时你根本不需要任何约束。例如，所有映射都具有相同的 `size:Int` 属性，与它们具体的泛型参数无关。

在需要处理泛型类的任意实例（无论其类型参数为何）的情况下，你可以用星号替换泛型参数。这被称为星号投影。

注 1：使用星号投影时，几乎无法处理那些实际使用泛型参数的方法。例如，`MutableList<*>` 将具有 `add(element: Nothing)` 和 `get(index: Int): Any?` 方法。

注 2：对于 `in` 和 `out` 投影（我们将在后续幻灯片中介绍），星号投影会更智能地工作：

- 对于 `Foo<out T : TUpper>`，`Foo<*>` 等同于 `Foo<out TUpper>`。
- 对于 `Foo<in T>`，`Foo<*>` 等同于 `Foo<in Nothing>`。
- 对于 `Foo<T : TUpper>`，`Foo<*>` 在读取值时等同于 `Foo<out TUpper>`，在写入值时等同于 `Foo<in Nothing>`。
  :::

## 回顾一下

```Kotlin
open class A
open class B : A()
class C : B()

Nothing <: C <: B <: A <: Any
```

这意味着 `Any` 类是所有类的*超类型*，同时 `Nothing` 是任何类型的*子类型*。

::: info
如果我们回顾关于面向对象编程的讨论，在描述继承时，我们也会在类型之间建立子类型关系。幻灯片上的类层次结构将形成 `C <: B <: A` 的子类型关系。此外，Kotlin 中所有不可空类型都以 `Any` 为超类型，以 `Nothing` 为子类型。

回到我们当前的主题，泛型如何改变这种子类型关系？换句话说，泛型类型如何相互替代？
:::

## 接下来？

看看这个基本示例：

```Kotlin
interface Holder<T> {
	fun push(newValue: T) // 消耗一个元素

    fun pop(): T // 生成一个元素

    fun size(): Int // 不与 T 交互
}
```

::: info
假设我们改进了这个容器类型，使其能够通过 `push` 方法消耗元素、通过 `pop` 方法生成元素，并通过 `size` 方法返回当前内部元素的数量。我们如何将不同的容器类型相互赋值？能否将 `Holder<Int>` 赋值给 `Holder<String>`？那么 `Holder<Int>` 赋值给 `Holder<Number>` 又如何？
:::

Kotlin 中有以下类型投影：

```Kotlin
G<T> // 不变型（invariant），可消耗和生成元素
G<in T> // 反协变型（contravariant），仅可消耗元素
G<out T> // 协变型（covariant），仅可生成元素
G<*> // 星号投影，不与 T 交互
```

::: info
要解释泛型类型的子类型关系，我们首先需要讨论类型投影。你可以将类型投影视为类型参数的修饰符，它们会改变你对类型参数的操作方式。

类型参数可能属于以下几种类型之一：

- 不变（invariant）类型参数（默认选项，无修饰符），既可用作从泛型类型中生成（作为输出）的类型，也可用作在泛型类型中消耗（作为输入）的类型
- 协变（covariant）类型参数（修饰符为 `out`），仅可用作从泛型类型中生成（输出）的类型
- 反协变（contravariant）类型参数（修饰符为 `in`），仅可用作在泛型类型中消耗（输入）的类型

这些属于“声明处变体”这一特性——即在声明中指定类型参数的变体。Kotlin 还支持“使用处变体”——即在使用处指定类型参数的变体——我们稍后将讨论这一点。“星号投影”（`*`）也属于使用处变体。

让我们看看这些限制如何在 Kotlin 代码中应用，以及这种“变体”究竟意味着什么。
:::

## 几个示例

```Kotlin
G<T> // 不变，可以消耗和生成元素

interface Holder<T> {
    fun push(newValue: T)// 消耗一个元素：OK

    fun pop(): T // 生成一个元素：OK

    fun size(): Int // 不与 T 交互：OK
}
```

::: info
不变型参数 `T`（即类型参数的默认类型）允许你在泛型声明中无限制地使用 `T`。你可以将 `T` 既用作属性的类型和函数返回类型（即从该类型中产出的内容），也可用作函数参数的类型（即在该类型中消耗的内容）。
:::

```Kotlin
G<in T> // 反协变，只能消耗元素

interface Holder<in T> {
    fun push(newValue: T) // 消耗一个元素：OK

    fun pop(): T // 生成一个元素：ERROR：[TYPE_VARIANCE_CONFLICT_ERROR] // [!code error]
    // 类型参数 T 被声明为 in，但在类型 T 中出现在 out 位置 // [!code error]

    fun size(): Int // 不与 T 交互：OK
}
```

::: info
反协变型参数 `in T` 限制了你在泛型声明中只能将 `T` 用作函数参数的类型（即你在类型中消耗的内容）。`In` 是一个容易记住的助记符（“我可以放入 `T` 类型的元素，但无法取出”）。如果你试图违反此限制，Kotlin 编译器将报告错误。
:::

```Kotlin
G<out T> // 协变，只能生成元素

interface Holder<out T> {
	fun push(newValue: T) // 消耗一个元素：ERROR：[TYPE_VARIANCE_CONFLICT_ERROR] // [!code error]
	// 类型参数 T 被声明为 out，但在类型 T 中出现在 in 位置 // [!code error]

    fun pop(): T // 生成一个元素：OK

    fun size(): Int // 不与 T 交互：OK
}
```

::: info
协变类型参数 `out T` 的工作原理类似，但方向相反：它限制你在泛型声明中只能将 `T` 用作类型所产出的内容（如函数返回值和属性）的类型。同样，`out` 是一个简单的助记法：“我可以取出 `T` 类型的值，但不能放入”。Kotlin 编译器也会检查协变类型参数的使用是否正确。
:::

```Kotlin
interface Holder<T> {
    fun push(newValue: T) // 消耗一个元素：OK
    fun pop(): T // 生成一个元素：OK
    fun size(): Int // 不与 T 交互：OK
}

fun <T> foo1(holder: Holder<T>, t: T) {
    holder.push(t) // OK
}

fun <T> foo2(holder: Holder<*>, t: T) {
    holder.push(t) // ERROR: [TYPE_MISMATCH]  // [!code error]
    // 类型不匹配。要求：Nothing。实际：T // [!code error]
}
```

而如果类型参数被填充为 `Any`，则可以正常放入元素：

```Kotlin
fun foo1(holder: Holder<Any>, t: Any) {
    holder.push(t) // OK
}
```

::: info
最后但同样重要的是，在某些情况下，你可能想表示“我不在乎类型参数被填充了什么类型”。要表达这一点，你需要使用星号投影：如果你有一个 `Holder<*>`，你只能向其中放入 `Nothing`，但可以取出 `Any? (thing)`。在许多情况下，当你拥有一个经过星号投影的泛型类型时，你会使用那些不依赖于其类型参数的部分（例如我们示例中的 `Holder<*>.size()`）。
:::

## 子类型

```Kotlin
open class A
open class B : A()      —--->  Nothing <: C <: B <: A <: Any
class C : B()

class Holder<T>(val value: T) { ... }

Holder<Nothing> ??? Holder<C> ??? Holder<B> ??? Holder<A> ??? Holder<Any>
```

::: info
既然我们已经介绍了类型投影，接下来就可以探讨泛型类型的子类型关系是如何运作的。如果我们的泛型类型有一个不变的类型参数——即我们既可以生成也可以消耗的那个参数——那么我们能否在该类型的不同版本之间建立任何子类型关系？如果我们有 `C <: B <: A`（其中 `T <: Q` 表示 T 是 Q 的子类型），那么我们能否对 `Holder<C>`、`Holder<B>` 和 `Holder<A>` 之间的子类型关系做出任何推论？
:::

```Kotlin
Holder<Nothing> <:> Holder<C> <:> Holder<B> <:> Holder<A> <:> Holder<Any>
```

（原幻灯片中，上一行里的 `<:>` 均被划掉，表示这些类型之间不存在子类型关系。）

泛型是不变的！！

```Kotlin
val c: C = C()
val b: B = c // C <: B，OK
```

```Kotlin
val holderC: Holder<C> = Holder(C())
val holderB: Holder<B> = holderC // [!code error]
// ERROR：类型不匹配。要求：Holder<B>。实际：Holder<C>。 // [!code error]
```

::: info
假设 `Holder<C> <: Holder<B>`，这意味着我们可以在任何可以使用 `Holder<B>` 类型值的地方替换为 `Holder<C>` 类型的值。但这很遗憾行不通，因为 `Holder` API 的反协变部分不允许这种替换。这将导致 `Holder<C>.push()`（该方法接受类型为 `C` 的值）被传入类型为 `B` 的值，这是不正确的。

现在假设情况相反，即 `Holder<B> <: Holder<C>`。在这种情况下，`Holder` API 的协变部分会出现问题，因为我们会在预期 `C` 类型值的位置调用 `Holder<B>.pop()`（该方法返回 `B` 类型的值），这同样是不正确的。

这意味着不变类型参数会导致其泛型类型在子类型化方面保持不变，且不同版本的不变泛型类型之间不存在子类型化关系。
:::

但是

```Kotlin
val holderB: Holder<B> = Holder(C()) // OK，因为进行了类型转换
```

::: info
需要注意的是，某些 Kotlin 代码看似允许将不同不变泛型类型相互赋值。例如，你可以编写 `val holderB: Holder<B> = Holder(C())`，此时 `Holder(C())` 看似具有 `Holder<C>` 类型，但实际上并非如此。

Kotlin 编译器足够智能，能够理解：要将一个值赋给 `Holder<B>`，该值也必须是 `Holder<B>` 类型。你可以从类型为 `C` 的值创建 `Holder<B>`，因为可以向其构造函数（该构造函数期望参数类型为 `B`）传入类型为 `C` 的值。这正是此处发生的情况，且不变泛型仍然保持不变。
:::

```Kotlin
class Holder<T> (var value: T?) {
   fun pop(): T? = value.also { value = null }
   fun push(newValue: T?): T? = value.also { value = newValue }
   fun steal(other: Holder<T>) { value = other.pop() }
   fun gift(other: Holder<T>) { other.push(pop()) }
}

Holder<Nothing> <:> Holder<C> <:> Holder<B> <:> Holder<A> <:> Holder<Any>

val holderB: Holder<B> = Holder(B())
val holderA: Holder<A> = Holder(null)
holderA.steal(holderB) // ERROR：类型不匹配。要求：Holder<A>。实际：Holder<B>。 // [!code error]
holderB.gift(holderA) // ERROR：类型不匹配。要求：Holder<B>。实际：Holder<A>。 // [!code error]
```

（原幻灯片中，上面 `Holder<Nothing> <:> ... <:> Holder<Any>` 一行里的 `<:>` 均被划掉，表示这些类型之间不存在子类型关系。）

::: info
不变泛型类型之间不存在子类型关系，这意味着我们不仅无法将不同版本相互赋值，也无法将它们作为参数传递给期望此类泛型类型的函数。Kotlin 编译器会对此进行检查并强制执行。
:::

## 类型投影：`in`

```Kotlin
class Holder<T> (var value: T?) {
   ...
   fun gift(other: Holder<in T>) { other.push(pop()) }
}
holderB.gift(holderA) // OK
```

类型投影：`other` 是一个受限（投影）泛型。你只能调用**接受**类型参数 `T` 的方法，在本例中意味着你只能调用 `push()`。

这就是反协变：

```Kotlin
Nothing <: C <: B <: A <: Any
Holder<Nothing> :> Holder<C> :> Holder<B> :> Holder<A> :> Holder<Any>
```

::: info
其他类型的类型参数（协变和反协变类型参数）会如何改变子类型关系？

其实，如果回顾我们在尝试让不变泛型类型之间建立子类型关系时遇到的难题，就会发现这些问题仅涉及泛型 API 中反协变或协变的部分。如果我们还记得使用反协变型参数时出现的限制（我们只能使用消耗该类型参数的函数，这意味着我们仅限于 API 的反协变部分），我们会发现这允许我们在反协变泛型类型之间建立子类型关系！

具体来说，若满足 `C <: B <: A`，则有如下关系：

```Kotlin
Holder<in C> :> Holder<in B> :> Holder<in A>
```

这是“使用处变体”的一个示例——即在类型参数的使用点（例如：`Holder<in T>`）而非声明点（例如：`class Holder<in T>`）指定其变体。这使得我们可以将不变泛型类型在程序的不同部分视为协变或反协变。此外，我们还有以下关系：

```Kotlin
Holder<in C> :> Holder<C>
```

这意味着我们可以将泛型类型的一个不变实例替换到反协变位置，从某种意义上说，就是“舍弃”其协变部分，而“保留”仅反协变部分。这是一种从泛型类型的“不变宇宙”转向“反协变宇宙”的方法，但反之则不可行。一旦对某个类型参数进行了类型投影，就无法以类型安全的方式将其“逆向投影”回不变的类型参数。
:::

## 类型投影：`out`

```Kotlin
class Holder<T> (var value: T?) {
   ...
   fun steal(other: Holder<out T>) { value = other.pop() }
}
holderA.steal(holderB) // OK
```

类型投影：`other` 是一个受限（投影）泛型。你只能调用**返回**类型参数 `T` 的方法，在本例中意味着你只能调用 `pop()`。

这就是协变：

```Kotlin
Nothing <: C <: B <: A <: Any
Holder<Nothing> <: Holder<C> <: Holder<B> <: Holder<A> <: Holder<Any>
```

::: info
同样地，协变类型投影规则与反协变类型投影规则相互对应。

具体来说，如果我们有 `C <: B <: A`，则有以下关系：

```Kotlin
Holder<out C> <: Holder<out B> <: Holder<out A>
```

我们还有以下关系：

```Kotlin
Holder<out C> :> Holder<C>
```

在协变类型投影下，我们只能使用返回该类型参数的函数。
:::

## 类型投影

```Kotlin
class Holder<T> (var value: T?) {
   fun steal(other: Holder<out T>) {
      val oldValue = push(other.pop())
	 other.push(oldValue) // ERROR：类型不匹配。要求：Nothing?。实际：T?。 // [!code error]
   }
   fun gift(other: Holder<in T>) {
      val otherValue = other.push(pop())
      push(otherValue) // ERROR：类型不匹配。要求：T?。实际类型：Any?。 // [!code error]
   }
}
```

`out T` 返回可转换为 `T` 的值，并接受字面上的 `Nothing`。
`in T` 接受可转换为 `T` 的值，并返回无意义的 `Any?`。

::: info
若尝试以违反其限制的方式使用协变或反协变类型投影，将会遇到与幻灯片中展示类似的编译错误。这些错误可能看起来有些晦涩（`Nothing`? `Any`?），但通过分析变体关系即可轻松解决。

协变类型参数 `<out T>` 意味着你可以生成 `T`，但无法消耗任何值（即没有任何具体值的数据）。在 Kotlin 类型系统中，有一个专门表示这种情况的类型：`Nothing`。这意味着我们可以将 `<out T>` 视为 `<out T in Nothing>`，从而明确指定泛型 API 中协变和反协变部分的行为。对于协变类型参数，其协变位置保持原类型不变，而反协变位置则被替换为 `Nothing`。

反协变型参数 `<in T>` 表示你可以消耗 `T`，但可以生成任何类型（即程序中可能出现的任意值）。在 Kotlin 类型系统中，也有一个专门的类型来表示这一点：`Any?`。我们可以采用同样的思路，将 `<in T>` 视为 `<out Any? in T>`；对于反协变型参数，其反协变位置保持原型不变，而协变位置则被替换为 `Any?`。

变体的实际处理机制更为复杂，但这个框架足以帮助我们理解大多数实际场景。
:::

## 类型擦除

在运行时，泛型类型的实例不包含任何关于其实际类型参数的信息。这种类型信息被称为被擦除。泛型的所有用法都使用相同的字节码，这与 C++ 不同——在 C++ 中，每个模板都会针对提供的每个类型参数单独编译。

- 任何 `MutableMap<K, V>` 在运行时都会变成 `MutableMap<*, *>`\*。
- 任何 `Pilot<T : Movable>` 在运行时都会变成 `Pilot<Movable>`。

\*实际上，在 **Kotlin/JVM** 运行时中，我们仅使用 `java.util.Map` 以保持与 Java 的兼容性。

::: info
如果你熟悉 JVM 上泛型的运作方式，那么此时你可能会自问：“类型擦除又如何工作呢？” 当你编写 Java 代码并在 JVM 上运行时，实际的类型参数会被从编译后的程序中“擦除”。在运行时，当我们操作 `List<Int>` 和 `List<String>` 时，实际上使用的是同一个（“原始”）泛型 `List`，它不包含类型参数（且不包含源代码中关于其类型参数的任何信息）。

Kotlin 采用了相同的方法，因为编译后的 Kotlin 代码仍需在 JVM 上运行，且泛型类型参数会被擦除。这意味着我们无法通过特定类型参数来检测泛型类型的实例。例如，`if (o is List<String>)` 无法生效，因为我们无法在运行时得知 `List` 的类型参数究竟是什么。
:::

作为推论，你无法通过更改泛型类型参数来重写函数**（在 Kotlin/JVM 中）**：

```Kotlin
fun quickSort(collection: Collection<Int>) { ... }
fun quickSort(collection: Collection<Double>) { ... }
```

两者都会变成 `quickSort(collection: Collection<*>)`，导致其签名冲突。

但你可以使用 `JvmName` 注解：

```Kotlin
@JvmName("quickSortInt")
fun quickSort(collection: Collection<Int>) { ... }
fun quickSort(collection: Collection<Double>) { ... }
```

::: info
类型擦除还意味着在 JVM 平台上，我们无法轻易通过使用不同的泛型类型参数来重写函数。幻灯片中的这两个函数（在 Kotlin 中是有效的且彼此可区分的）在 JVM 平台上将变成同一个函数（一个接受原始 `Collection` 的函数），从而发生冲突。

为解决这一平台特有的问题，可以在其中一个函数上使用 `@JvmName` 注解。该注解会更改函数的 JVM 平台特定名称，从而使 `quickSort` 函数不再发生冲突（因为它们现在拥有不同的名称）。
:::

## 泛型中的可空性

与常识相反，在 Kotlin 中，指定为 `T` 的类型参数可以是可空的。

```Kotlin
class Holder<T>(val value: T) { ... } // 注意这里没有 `?`
val holderA: Holder<A?> = Holder(null) // T = A? 且这是允许的
```

若要禁止此类行为，可使用非空的 `Any` 作为约束。

```Kotlin
class Holder<T : Any>(val value: T) { ... }
val holderA: Holder<A?> = Holder(null) // ERROR：类型参数超出其边界。预期：Any。实际：A?。 // [!code error]
```

交集类型可能也有帮助：

```Kotlin
fun <T> elvisLike(x: T, y: T & Any): T & Any = x ?: y
```

`T & Any` 包含 `T` 类型中除 `null` 以外的所有值

::: info
回顾我们之前关于 Kotlin 中可空性的讨论，你可能会认为类型参数不能为空，因为它们没有用问号标记。然而，如果你思考一下类型参数的本质（即另一个类型的占位符），就没有理由将其仅限制为非空类型。这就是为什么类型参数 `T` 可以由可空类型（`Holder<A?>`）填充。

若要将类型参数限制为不可空，可通过将其上界（即超类型）设为 `Any`（这是所有不可空类型的通用超类型）来表明其属于不可空类型集合。对于此类类型参数，若将其赋值为可空类型，则会引发编译时错误。

另外，如果需要将类型参数作为泛型声明中的类型（例如作为函数参数）使用时使其为非空，但无法直接将该类型参数本身设为非空，则可以使用确定非空类型 `T & Any`。
:::

## 内联函数

如果将函数作为一等对象使用，它们会被作为对象存储，因此需要分配内存，这会带来运行时开销。

```Kotlin
fun foo(str: String, call: (String) -> Unit) {
	call(str)
}

fun main() {
	foo("Top level function with lambda example") { print(it) }
}
```

::: info
转而谈谈另一个话题，让我们来讨论一下内联函数，它们（有些出人意料地）与泛型之间存在一些有趣的交互。

在 Kotlin 中，函数是一等对象，这意味着你可以像处理程序中的其他对象一样操作它们。例如，你可以声明一个函数，该函数将另一个函数作为参数，并调用它、将其保存到属性中，或将其进一步传递到代码中。

调用此类函数时，你可以将一个 `lambda` 表达式作为函数类型参数传入，这在某种意义上会生成一个用于此处的匿名函数。然而，此类匿名函数在运行时会被表示为特殊的对象，这会在每次调用时引入一定的开销（因为你需要为该对象分配内存、初始化它等）。

同样，关于 `lambda` 在运行时如何表示的实际规则比我们在此描述的更为复杂，但对于大多数常规的 Kotlin 代码而言，这些说明已经足够了。
:::

```Kotlin
fun foo(str: String, call: (String) -> Unit) {
    call(str)
}
```

编译成：

```Java
public static final void foo(@NotNull String str, @NotNull Function1 call) {
    Intrinsics.checkNotNullParameter(str, "str");
    Intrinsics.checkNotNullParameter(call, "call");
    call.invoke(str);
}
public static final void main() {
    foo("Top level function with lambda example", (Function1)foo$call$lambda$1.INSTANCE);
}
```

`call` 通过将字符串作为参数传递来调用 `print` 函数。

::: info
如果我们看看上一张幻灯片中的代码是如何编译成类似 Java 的代码的，就会看到一个简单的 `lambda` 表达式是如何表示和使用的。

首先，由于该 `lambda` 是纯函数（不存储任何内部状态，也不读取任何外部状态），其函数对象被存储为静态 `INSTANCE`，并在不同调用之间复用。其次，该函数对象提供了一个 `invoke` 方法，该方法接受一个 `String` 作为参数并返回 `void`，这与 `lambda` 函数的类型 `(String) -> Unit` 相对应。
:::

“在底层”，会创建（即分配）一个 `Function` 类的实例：

```Java
foo("...", new Function() {
    @Override
    public void invoke () {
        ...
    }
});
```

::: info
如果我们的 `lambda` 表达式是非纯函数，或者编译器决定不在调用之间复用其对象，那么每次调用 `foo` 时都会创建一个新的函数对象。我们能否采取一些措施来避免这种开销？
:::

我们可以使用 `inline` 关键字将函数内联，将其代码复制到调用位置：

```Kotlin
inline fun foo(str: String, call: (String) -> Unit) {
	call(str)
}
fun main() {
	foo("Top level function with lambda example", ::print)
}
```

编译成：

```Java
public static final void main() {
String str$iv = "Top level function with lambda example";
     int $i$f$foo = false;
     int var3 = false;
     System.out.print(str$iv);
}
```

::: info
既然我们知道 `foo` 函数的作用，也清楚作为参数传递给它的 `lambda` 表达式以及后续的调用方式，那么我们完全可以在调用处直接复制粘贴所有内容，将函数体和 `lambda` 表达式合并为一个代码块，从而避免额外开销。这被称为“内联”，你可以手动实现。幸运的是，你无需亲自动手！Kotlin 支持内联函数：这类函数会在调用处自动内联，其主要目的是避免因创建 `lambda` 表达式而产生的开销。

我们在讨论内联函数时使用的 `$i$f$foo` 表示法，是对 JVM 在上述情况下生成字节码过程的一种近似描述。JVM 层面的具体实现细节超出了本讲的范围。
:::

`inline` 不仅影响函数本身，还影响作为参数传递的所有 `lambda` 表达式。

如果你不希望传递给 `inline` 函数的某些 `lambda` 表达式被内联（例如，不建议对大型函数进行内联），可以使用 `noinline` 修饰符标记部分函数参数。

```Kotlin
inline fun foo(str: String, call1: (String) -> Unit, noinline call2: (String) -> Unit) {
	call1(str) // 将被内联
    call2(str) // 不会被内联
}
```

::: info
在对函数进行内联时，Kotlin 编译器默认会将函数体与作为参数传递的所有 `lambda` 表达式“融合”在一起。因此，这些 `lambda` 表达式实际上会作为程序值消失（不再有可传递的函数对象），我们无法将其存储在属性中、从函数中返回，或作为非内联参数传递给其他函数。

若需避免对函数类型参数进行内联（例如，因需将其存储并稍后调用），可将其标记为 `noinline`。这会告知编译器，传递给该参数的 `lambda` 表达式不应被内联。由于它们将以函数对象的形式呈现，因此你可以像处理程序中的其他对象一样对其进行操作。
:::

你可以在内联 `lambda` 表达式中使用 `return` 语句，这被称为非局部返回，可能会导致意外的行为：

```Kotlin
inline fun foo(call1: () -> Unit, call2: () -> Unit) {
    call1()
    call2()
}
fun main() {
    println("Step#1")
    foo(
        {
            println("Step#2")
            return
        },
        { println("Step#3") })
    println("Step#4")
}
```

```Text
-> Output:
    Step#1
    Step#2
```

::: info
由于内联 `lambda` 会被内联（顾名思义），Kotlin 支持一项名为“非局部返回”的功能：如果你在内联 `lambda` 中使用无标签的 `return` 语句（这在普通 `lambda` 中是被禁止的），那么返回操作将不会从 `lambda` 本身开始，而是从包含该 `lambda` 的外部函数声明处开始。以本幻灯片中的示例为例，传递给 `foo` 函数的 `lambda` 中的 `return` 语句将导致程序从 `lambda` 的外层函数声明 `main` 处返回，执行时仅会打印“`Step#1`”和“`Step#2`”。

这可能让人有些困惑，因为带标签的返回语句在 `lambda` 中会“如预期”地从 `lambda` 本身返回。以下是一条有助于记忆和理解此规则的经验法则：简单的无标签 `return` 语句总是从其外围的函数声明处返回。
:::

要禁止从 `lambda` 表达式中返回，我们可以将该 `lambda` 标记为 `crossinline`。

```Kotlin
inline fun foo(crossinline call1: () -> Unit, call2: () -> Unit) {
    call1()
    call2()
}
fun main() {
    println("Step#1")
    foo(
        {
            println("Step#2")
            return // ERROR：此处不允许使用 return // [!code error]
        },
        { println("Step#3") })
    println("Step#4")
}
```

不过，`return@foo` 是允许的且没有问题。

::: info
非内联 `lambda` 不支持非局部返回，但它们也不会被内联。如果你希望 `lambda` 被内联，同时禁止非局部返回，可以将其标记为 `crossinline`。对于此类 `lambda`，未标记的 `return` 会导致编译时错误。
:::

当内联函数中的 `lambda` 表达式在另一个上下文中被调用时，`crossinline` 特别有用，例如，当它被用于实例化一个 `Runnable` 时：

```Kotlin
inline fun drive(crossinline specialCall: (String) -> Unit, call: (String) -> Unit) {
   val nightCall = Runnable { specialCall("There's something inside you") }
   call("I'm giving you a nightcall to tell you how I feel")
   thread { nightCall.run() }
   call("I'm gonna drive you through the night, down the hills")
}
fun main() {
   drive({ System.err.println(it) }) { println(it) }
}
```

::: info
当 `lambda` 表达式未直接在内联函数内部调用，而是被捕获并从嵌套作用域中调用时，会使用 `crossinline` 修饰符。例如，当它在函数中创建并使用的 `Runnable` 实例内部时。

我们仍然可以将此类 `lambda` 表达式内联到其使用的作用域中，但无法实现非局部返回。这就是为什么我们需要一个单独的 `crossinline` 修饰符。
:::

## 内联具体化函数

有时你需要访问作为参数传递的类型：

```Kotlin
fun <T: Animal> foo() {
	println(T::class) // Error：不能将 T 用作具体化类型参数。 // [!code error]
	// 请改用类 --> 添加参数：t: KClass<T> // [!code error]
}
```

你可以在 `inline` 内联函数中使用 `reified` 关键字：

```Kotlin
inline fun <reified T: Animal> foo() {
	println(T::class) // OK
}
```

请注意，编译器必须能够识别作为类型实参传递的实际类型，这样它才能修改生成的字节码，直接使用相应的类。

::: info
现在让我们探讨内联函数与泛型如何协同工作。由于内联函数会在其调用处被内联，对于每个被内联的泛型函数调用，我们可以记录并传播实际的类型参数至内联函数体。若能做到这一点，我们便能在某种意义上“恢复”这些类型参数，并在函数体内将其作为已知类型使用。例如，我们可以通过 `T::class` 探索其结构。

要启用此功能，我们只需将内联函数的类型参数标记为 `reified`。这会提示编译器需要从调用位置传播类型参数，以支持在函数内部直接使用它们。此外，作为具体化类型参数使用的类型参数还需在运行时已知（例如具体的 Kotlin 类型或另一个具体化类型参数）；如果类型未知（例如在运行时被擦除的非具体化类型参数），则无法将其用作具体化类型参数。
:::

```Kotlin
open class A
class B : A()
class C : A() { fun consume(other: A): C = this }

fun <T, S : R, R> funny(
   source: Iterator<????>,
   target: MutableCollection<????>,
   base: ????,
   how: ????
) {
   var result: R = base
   for (value in source) {
       result = how(result, value)
       target.add(result)
   }
}

fun main() {
   val wtf = mutableListOf<A>()
   val src = mapOf(3.14 to B(), 2 to B(), "Hello" to B())
   val c = C()
   funny(src.values.iterator(), wtf, c) { r, t -> r.consume(t) }
}
```

::: info
来个小挑战：试着用类型参数填补空缺，让代码变得正确！
:::

## （不）变体

```Kotlin
class Holder<T>(val value: T) { ... }
open class A
open class B : A()
class C : B()
```

此时存在一个继承层次结构（别忘了还有包含可空性的相同层次结构）：

```Kotlin
Nothing -> C -> B -> A -> Any
```

泛型的变体本应给我们带来另一个层次结构：

```Kotlin
Holder<Nothing> -> Holder<C> -> Holder<B> -> Holder<A> -> Holder<Any>
```

但实际情况并非如此，因为泛型是不变的。

```Kotlin
val holderC = Holder(C())
val holderB: Holder<B> = holderC // Error：类型不匹配。
// 要求：Holder<B>。实际：Holder<C>。
```

注意：下面的代码可以运行，因为作为参数传递的 `C()` 被强制转换为 `B`，这与变体无关。

```Kotlin
val kotlinIsSmart: Holder<B> = Holder(C())
```

## 更多

```Kotlin
class Holder<T> (var value: T?) {
   fun pop(): T? = value.also { value = null }
   fun push(newValue: T?): T? = value.also { value = newValue }
   fun steal(other: Holder<T>) { value = other.pop() }
   fun gift(other: Holder<T>) { other.push(pop()) }
}
val holderB: Holder<B> = Holder(B())
val holderA: Holder<A> = Holder(null)
holderA.steal(holderB) // Error：类型不匹配。要求：Holder<A>。实际：Holder<B>。 // [!code error]
holderB.gift(holderA) // Error：类型不匹配。要求：Holder<B>。实际：Holder<A>。 // [!code error]
```

但这为什么不行呢？在 `steal` 或 `gift` 方法内部，`B` 可以轻松地转换为 `A`，一切应该都没问题。
