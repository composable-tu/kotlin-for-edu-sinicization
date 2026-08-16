# 集合及其相关概念

::: info
本文翻译自：https://kotlinlang.org/education/
:::

## 什么是集合？

集合通常包含若干个同类型的对象（这个数量也可能是零）。

集合中的对象被称为元素或项。

- `List` 列表是有序集合，可以通过索引（反映其位置的整数）访问元素。列表中的元素可以重复出现。
- `Set` 去重集合是由唯一元素组成的集合。它们体现了“集合”这一数学抽象概念：一组不包含重复项的对象。
- `Map` 映射（或称字典）是由键值对组成的集合。键是唯一的，且每个键仅映射到一个值，而值可以重复。

::: info
今天我们将讨论 Kotlin 中的集合。首先，让我们从 `List`、`Set` 和 `Map` 这三种集合类型的一般定义开始。

_（幻灯片上的信息）_

_（补充）_ `Map`（或称字典；或关联数组）

每种集合类型可能有不同的实现方式，例如，`List` 内部可能通过数组或双向链表来实现。可以说，List、Set 和 Map 是接口或规范，用于确定支持哪些操作（例如，`List` 支持插入元素、移除元素、按索引获取元素等），而每个接口都可以由多种实现来支持。

大多数编程语言的标准库中都包含 `List`、`Set` 和 `Map` 数据结构的实现。此类实现通常与幻灯片中给出的定义一致。

然而，在某些库（如 Apache Commons Collections 等）中也能找到一些特定的实现，例如 `MultiValueMap`（或简称 `MultiMap`）的映射/字典实现。这种实现同样是一组键值对，但一个键可能与多个值相关联。`MultiMap` 的语义略有不同——虽然向其中添加元素的操作看起来相似，但通过键检索元素时会返回一个项目集合。在某些编程语言中，此类特定数据结构可能包含在标准库中，而在其他语言中则可能作为第三方库提供。
:::

## 如何使用它们？

Kotlin 允许你在不考虑集合中存储的对象具体类型的情况下，对集合进行操作。

换句话说，你向 `String` 列表中添加 `String` 的方式，与添加 `Int` 或用户自定义类完全相同。

因此，Kotlin 标准库提供了通用的接口、类和函数，用于创建、填充和管理任何类型的集合。

::: info
Kotlin 标准库提供了丰富的集合操作工具。如前所述，集合包含对象。但具体是哪些类型的对象呢？我们可能会认为针对不同类型应有不同的集合实现，例如 `IntList` 或 `StringList`。正如我们在关于泛型的上一课中所建立的，集合接口与泛型的结合使用效果非常出色。就集合而言，这意味着借助泛型，例如 `List` 既可以存储 `Int`，也可以存储 `String`，或者任何其他自定义数据类型。

_（可选）默认集合在大多数情况下都能满足我们的需求。但在某些特定应用中，你可能会遇到性能和内存效率问题，例如由于装箱/拆箱操作导致的。虽然我们可以寻找某些特定类型的集合实现，或者自行实现，但它们可能与标准接口不兼容。例如 `TIntArrayList`，它是 Trove 库中一种针对 `int` 类型的特化列表实现。_
:::

## 集合的分类

![](/assets/kotlin-edu-sinicization/kotlin-taxonomy-of-collections.png)

接口 —— Kotlin 实际上使用了 `java.util` 中的实现。

::: info
本幻灯片展示了集合类型的层次结构。你可能会注意到，每种集合类型都有可变子类型。可变接口通过添加或移除等写入操作，扩展了相应的只读接口。（可选）这可能会让人感到困惑，因为只读接口和可变接口可能由同一个实现支持。例如，如果尝试编译以下代码，将会引发编译时错误：

```Kotlin
val myList = listOf(1, 2, 3)
println(myList[1])
myList[2] = 100
for (e in myList) println("Value: $e")
```

在上面的代码片段中，`listOf` 是 Kotlin 标准库中用于轻松创建 `List` 集合的辅助方法（请注意，这里使用的是只读版本，而非可变版本）。要使其正常工作，我们可以简单地将 `listOf` 改为 `mutableListOf` 以获得可变集合：

```Kotlin
val myList = mutableListOf(1, 2, 3)
println(myList[1])
myList[2] = 100
for (e in myList) println("Value: $e")
```

现在请看这个例子。你认为它能编译通过吗？如果能，运行起来会顺畅吗？

```Kotlin
val myList = listOf(1, 2, 3)
(myList as MutableList)[2] = 100
for (e in myList) println("Value: $e")
```

答案是肯定的——它不仅能编译通过，运行时也不会报错。这是因为只读列表和可变列表的实现是相同的。请务必注意，应避免显式进行不安全的类型转换。
:::

![](/assets/kotlin-edu-sinicization/kotlin-taxonomy-of-collections-2.png)

::: info
让我们再来看一种类型层次结构的表示形式。这里同样包含只读和可变两种变体。
:::

## 可迭代对象

Kotlin 中的所有集合都实现了 `Iterable` 接口：

```Kotlin
/**
* 继承此接口的类可以表示为一个可迭代的元素序列。
* @param T 是待迭代元素的类型。迭代器对其元素类型具有协变性。
*/
public interface Iterable<out T> {
    // 返回一个遍历该对象元素的迭代器。
    public operator fun iterator(): Iterator<T>
}
```

::: info
正如我们在上一张幻灯片中所见，`Iterable` 类型位于集合类型层次结构的顶端。这意味着 Kotlin 标准库中的所有集合都是可迭代的。

“可迭代”是什么意思？

迭代是循环的术语，因此可迭代集合是指可以进行循环遍历的集合，例如使用 `for` 循环。以下是一个简短的示例：

```Kotlin
val myList = listOf(1, 2, 3)
for (item in myList) {
   println("Mylist item $item")
}
```

如幻灯片中展示的代码片段所示，`Iterable` 接口包含 `iterator` 方法，且其签名中包含 `operator` 关键字（请记住 Kotlin 的运算符约定）。`Iterator` 接口与 `Iterable` 接口有何区别？`Iterable` 接口代表一种可进行迭代（循环）的数据结构，而 `Iterator` 接口则提供在迭代过程中从集合中获取元素的方法。
:::

Kotlin 中的所有集合都是可迭代的：

```Kotlin
val iterator = myIterableCollection.iterator()
while (iterator.hasNext()) {
   iterator.next()
}
```

::: info
也可以使用 `while` 循环来遍历可迭代集合。你可以显式获取一个迭代器，并结合 `hasNext()` 方法与 `while` 循环来遍历各项。`hasNext()` 和 `next()` 方法是 `Iterator` 接口中声明的方法。让我们来看看该接口：

```Kotlin
/**
* 返回迭代中的下一个元素。
*/
public operator fun next(): T
```

```Kotlin
/**
* 如果迭代中还有更多元素，则返回 `true`。
*/
public operator fun hasNext(): Boolean
```

:::

## 可迭代对象 vs 可变迭代对象

但其中一些是可变迭代对象（`MutableIterable`）：

```Kotlin
val iterator = myMutableIterableCollection.iterator()
while (iterator.hasNext()) {
   iterator.next()
   iterator.remove() // 因为它是可变迭代器
}
```

::: info
还记得我们在前几张幻灯片中看到的集合类型层次结构吗？其中也包含了 `MutableIterator` 接口。两者有何区别？请看这个接口声明：

```Kotlin
/**
* 可变集合的迭代器。支持在迭代过程中移除元素。
* @see MutableCollection.iterator
*/
public interface MutableIterator<out T> : Iterator<T> {
   /**
    * 从底层集合中移除该迭代器返回的最后一个元素。
    */
   public fun remove(): Unit
}
```

你可以看到，`MutableIterator` 继承了 `Iterator` 接口，并引入了一个额外的 `remove()` 方法，这样你就可以在遍历集合时移除元素，就像上面的示例代码所示。
:::

## 不同类型的集合

集合分为两种类型：`Collection` 和 `MutableCollection`。`Collection` 仅实现了 `Iterable` 接口，而 `MutableCollection` 则同时实现了 `Collection` 和 `MutableIterable` 接口。

`Collection` 允许你读取值，并使集合**不可变**。

`MutableCollection` 允许你修改集合，例如添加或移除元素。换句话说，它使集合**可变**。

```Kotlin
val readonlyCollection = listOf(1, 2, 3)
readonlyCollection.add(4) // ERROR：未解析的引用：add // [!code error]

val mutableCollection = mutableListOf(1, 2, 3)
mutableCollection.add(4) // OK
```

::: info
“可变”一词已多次出现，但在集合中它具体指什么？简而言之，这意味着集合在创建后可以被修改。例如，可以添加或移除元素。而只读集合（或不可变集合）一旦创建就无法被修改。

根据集合类型层次结构，所有以 `mutable` 为前缀的集合类型都实现了 `MutableCollection`，而 `MutableCollection` 本身继承自 `MutableIterable`。
:::

## 可变集合 ≠ 可变变量

如果你创建了一个可变集合，则**无法**重新赋值给 `val` 变量。

```Kotlin
val mutableCollection = mutableListOf(1, 2, 3)
mutableCollection.add(4) // OK
mutableCollection = mutableListOf(4, 5, 6) // ERROR：Val 不能被重新赋值 // [!code error]
```

但你可以重新赋值给 `var`。

```Kotlin
var mutableCollection = mutableListOf(1, 2, 3)
mutableCollection.add(4) // OK
mutableCollection = mutableListOf(4, 5, 6) // OK
```

::: info
可变集合可以作为 `var` 变量声明，这意味着它可以被重新赋值。

_（可选）：_

_有时可变性可能会让人感到困惑。再来看一个例子：_

```Kotlin
data class Point(var x: Int, var y: Int)

val points = listOf(Point(1, 1), Point(2, 2))
println(points)

points[0].x = -1
// 将会打印什么？
println(points)
```

_声明了一个自定义数据类型 `Point`，并创建了一个只读（不可变）集合。我们无法修改不可变集合。但如果我们有一个不可变集合，并尝试修改其中一个元素，这段代码能编译通过吗？是的，因为该集合仍然是不可变的，且我们并未尝试修改它（例如添加新项）。与此同时，我们可以获取集合中的某个元素，而该元素本身是可变的。因此，不可变集合可以包含可变对象，这些对象本身是可以被修改的。_

_所以，当我们说集合是只读（不可变）的，是指该集合本身无法被修改；无法添加或移除项目。但此类集合中的项目可以是可变的，并且可以被修改。_
:::

## 集合的结构

![](/assets/kotlin-edu-sinicization/kotlin-the-anatomy-of-a-collection.png)

::: info
让我们来看看集合的结构，例如 `List`。如前所述，`List` 是一个继承自 `Collection` 接口的接口。打开 `MutableList` 的声明，检查它是否符合我们之前看到的集合类型层次结构。它继承了哪个接口？
:::

每个集合都有几个**基本**方法：

```Kotlin
public interface Collection<out E> : Iterable<E> {
    public val size: Int

    public fun isEmpty(): Boolean // 请使用此方法代替 size == 0

    public operator fun contains(element: @UnsafeVariance E): Boolean

    public fun containsAll(elements: Collection<@UnsafeVariance E>): Boolean
    ...
}
```

::: info
如果我们深入研究基础 `Collection` 接口的实现，会看到一些基础方法，例如 `isEmpty()`。由于 Kotlin 标准库中的所有集合都实现了 `Collection` 接口，因此 `isEmpty()` 应该是检查集合是否包含任何元素的首选方法。观察其他介绍过的集合方法，你会发现它们数量相当多。Kotlin 中的集合功能强大且灵活。不过，正如我们在下一张幻灯片中将看到的，并非所有方法都在接口中声明。
:::

实际上，扩展有**很多**：

```Kotlin
public val Collection<*>.indices: IntRange // 在循环中使用非常方便：
    get() = 0..size - 1                  // for (i in collection.indices) { ... }

public val <T> List<T>.lastIndex: Int
    get() = this.size - 1

// 请使用此方法代替 size != 0
public inline fun <T> Collection<T>.isNotEmpty(): Boolean = !isEmpty()

...
```

::: info
Kotlin 的扩展函数让我们能够访问更多的集合功能。Kotlin 标准库中包含多种集合扩展函数，其中一些已在上述示例中展示。此前我们曾看到 `Collection` 接口中的 `isEmpty()` 方法。此外还有 `isNotEmpty()` 扩展函数，用于检查集合是否至少包含一个元素。

查看 `kotlin.collections` 包以了解其他扩展函数，例如 `isNullOrEmpty()`，该函数虽然简单却非常实用：

```Kotlin
public inline fun <T> Collection<T>?.isNullOrEmpty(): Boolean {
   contract {
       returns(false) implies (this@isNullOrEmpty != null)
   }

   return this == null || this.isEmpty()
}
```

:::

## 集合内部原理

### 列表

```Kotlin
public interface List<out E> : Collection<E> {
	public operator fun get(index: Int): E // 配合 [] 使用很方便：collection[2]

	public fun indexOf(element: @UnsafeVariance E): Int
    public fun lastIndexOf(element: @UnsafeVariance E): Int

	public fun subList(fromIndex: Int, toIndex: Int): List<E>
    /* 创建引用副本：
       val list1 = mutableListOf(1, 2, 3)
       val list2 = list1.subList(0, 1)
       list1[0] += 1
       println(list1) // [2, 2, 3]
       println(list2) // [2] */
	...
}
```

::: info
如何操作集合中的元素？例如，如何获取其中一个元素？之前我们已经使用过这样的语法：

```Kotlin
val myList = listOf(1, 2, 3)
println(myList[1])
```

得益于 Kotlin 的索引访问运算符，我们可以轻松地通过索引获取元素。如本幻灯片所示，你可以使用 `get(index: Int)` 运算符函数来支持索引访问。你可以像这样显式地使用它：

```Kotlin
myList.get(1)
```

但我们建议使用索引访问运算符，因为它们更方便。

使用 `subList` 时要小心，并记住我们之前关于可变性的说明。`subList` 会创建一个引用副本。如果你修改子列表，父列表也会随之被修改，正如上面的示例所示。但若尝试向子列表中添加元素会发生什么？运行以下示例观察结果：

```Kotlin
val list1 = mutableListOf(1, 2, 3)
val list2 = list1.subList(0, 1)

list2[0] += 1
println(list1)

list2.add(10)
println(list1)
```

输出的结果是：

```Text
[2, 2, 3]
[2, 10, 2, 3]
```

你可以看到，虽然我们修改的是 `list2` 集合，但 `list1` 同时也发生了变化。
:::

要创建一个新的列表，可以使用特殊的**构建器**（默认是 `ArrayList`）：

```Kotlin
val list1 = emptyList<Int>() // 构建内部对象 EmptyList
val list2 = listOf<Int>() // 调用 emptyList()
val list3 = listOf(1, 2, 3) // 类型可以被推断

val list4 = mutableListOf<Int>() // 更好的写法是：ArrayList<Int>()
val list5 = mutableListOf(1, 2, 3) // 类型可以被推断
val list6 = buildList {
        // 构建 MutableList<Int>
        add(5)
        addAll(0, listOf(1, 2, 3))
    }
```

::: info
_`ArrayList` 是一种基于数组的实现。它的读取操作开销很小，添加操作通常也开销很小，但插入或删除操作的开销较大。_

正如我们所说，Kotlin 标准库提供了许多集合功能。此外还有多种辅助方法可用于快速创建集合，例如我们之前看到的 `listOf` 或 `mutableListOf` 方法。上面的示例展示了多种构建集合的方法。
:::

### 去重集合

```Kotlin
public interface Set<out E> : Collection<E> {
	abstract val size: Int

	abstract fun contains(element: @UnsafeVariance E): Boolean

    abstract fun containsAll(collection: Collection<E>): Boolean

    abstract fun isEmpty(): Boolean

    abstract fun iterator(): Iterator<E>
}
```

一个不支持重复元素的泛型无序集合。

它通过 `equals` 方法比较对象，而非检查对象是否*相同*。

::: info
我们已经讨论了 `List` 集合类型。现在让我们来谈谈 `Set` 集合类型。

与 `List` 不同，`Set` 通常不保留元素的顺序（尽管也有保留顺序的实现，例如 `LinkedHashSet`）。

`Set` 存储唯一的元素，这意味着不允许重复项。
:::

```Kotlin
class A(val primary: Int, val secondary: Int)
class B(val primary: Int, val secondary: Int) {
    override fun hashCode(): Int = primary

    override fun equals(other: Any?) = primary == (other as? B)?.primary
}

fun main() {
    val a = A(1,1)
    val b = A(1,2)
    val set = setOf(a, b)
    println(set) // 两个元素
}
```

::: info
虽然 `Set` 存储的是唯一元素，但这些元素的唯一性取决于添加到集合中的对象类型。假设你有一个简单的类 `A`，如上图所示。你可以将两个对象 `A(1,1)` 和 `A(1,2)` 添加到集合中。到目前为止，这没有问题，因为这两个对象的属性不同。
:::

```Kotlin
class A(val primary: Int, val secondary: Int)
class B(val primary: Int, val secondary: Int) {
    override fun hashCode(): Int = primary

    override fun equals(other: Any?) = primary == (other as? B)?.primary
}

fun main() {
    val a = B(1,1)
    val b = B(1,2)
    val set = setOf(a, b)
    println(set) // 只有一个元素
}
```

::: info
然而，如果我们引入类型 `B`，并重写了仅检查 `primary` 属性的 `equals` 和 `hashCode` 方法，那么集合中会包含什么？请先运行上面的示例（使用类型 `A`），然后尝试交换类型：

```Kotlin
val a = B(1, 1)
val b = B(1, 2)
val set = setOf(a, b)
println(set) // 集合中有多少个元素？
```

发生了什么？由于我们在类型 `B` 中引入了自定义的 `equals` 和 `hashCode` 方法，集合中只包含一个元素。请记住，集合本身仅使用对象的 `equals` 和 `hashCode` 方法来检查集合中的对象是否唯一，因此在使用带有重写方法的自定义类型时要格外小心。
:::

要创建一个新的集合，可以使用特殊的**构建器**（默认是 `LinkedHashSet`）：

```Kotlin
val set1 = emptySet<Int>() // 构建内部对象 EmptySet
val set2 = setOf<Int>() // 调用 emptySet()
val set3 = setOf(1, 2, 3) // 类型可以被推断

val set4 = mutableSetOf<Int>() // 更好的写法是：LinkedHashSet<Int>() 或 HashSet<Int>()
val set5 = mutableSetOf(1, 2, 3) // 类型可以被推断
val set6 = buildSet {
        // 构建 MutableSet<Int>
        add(5)
        addAll(listOf(1, 2, 3))
    }
```

::: info
`LinkedHashSet` 是一个双向链表式的 `HashSet`，在迭代时能保留元素的插入顺序。它在添加和成员检查时具有渐近 $O(1)$ 的时间复杂度，并依赖于元素的 `hashCode()` 函数。

`mutableSetOf` 辅助函数底层使用了什么类型？让我们看看它的实现：

```Kotlin
public fun <T> mutableSetOf(vararg elements: T): MutableSet<T> =
    elements.toCollection(LinkedHashSet(mapCapacity(elements.size)))
```

可以看到，它使用 `LinkedHashSet` 来存储项。
:::

### 映射

```Kotlin
public interface Map<K, out V> {
	public fun containsKey(key: K): Boolean

    public fun containsValue(value: @UnsafeVariance V): Boolean

    public operator fun get(key: K): V?

    public fun getOrDefault(key: K, defaultValue: @UnsafeVariance V): V

    public val entries: Set<Map.Entry<K, V>>
    /* 在循环中使用非常方便：
       for ((key, value) in map.entries) { ... } */

	…
}
```

::: info
我们已经讨论了 `List` 和 `Set` 这两种集合类型，这意味着我们还没有谈及 `Map` 类型。`Map`（也称为关联数组或字典）是一种用于存储键值对的数据结构。

让我们简要看看 Kotlin 标准库中 `Map` 接口的声明。正如我们在 `List` 和 `Set` 中所见，该接口包含多种方法（别忘了 Kotlin 扩展！）。

与 `List` 类似，我们可以按键名检索任意值，如下所示：

```Kotlin
val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
println(numbersMap["one"])
```

`mapOf` 是 Kotlin 标准库中用于快速创建 `Map` 的辅助函数。我们将在下一张幻灯片中讨论它。而代码 `"one" to 1` 是一种利用 Kotlin 标准库提供的 `to` 中缀函数来创建键值对的便捷方式。不过，也可以显式调用 `get`：

```Kotlin
println(numbersMap.get("one"))
```

`getOrDefault` 方法应被显式调用，以通过键检索元素或返回作为参数传递的默认值：

```Kotlin
val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
println(numbersMap.getOrDefault("two", -1))  // 由于映射中存在"two"键，因此打印出"2"。
println(numbersMap.getOrDefault("four", -1)) // 由于未找到"four"键，因此使用默认值，打印出"-1"。
```

`entries` 方法可用于遍历键值对。将其与解构声明结合使用，是遍历映射项的一种非常便捷的方式。
:::

要创建一个新的映射，可以使用特殊的**构建器**（默认使用 `LinkedHashMap`）：

```Kotlin
val map1 = emptyMap<Int, String>() // 构建内部对象 EmptyMap
val map2 = mapOf<Int, String>() // 调用 emptyMap()
val map3 = mapOf(1 to "one", 2 to "two") // 类型可以被推断

val map4 = mutableMapOf<Int, String>() // 更好的写法是：LinkedHashMap<...>() 或 HashMap<...>()
val map5 = mutableMapOf(1 to "one", 2 to "two") // 类型可以被推断
val map6 = buildMap {
        // 构建 MutableMap<Int, String>
        put(1, "one")
        putAll(mutableMapOf(2 to "two"))
    }
```

::: info
`LinkedHashMap` 是一种双向链表式的 `HashMap`，在迭代时能保留插入顺序。它通过元素的 `hashCode()` 函数实现按键添加和读取的渐近 $O(1)$ 时间复杂度。

与列表和集合类似，Kotlin 标准库中提供了多种辅助方法（或“构建器”）用于快速创建映射。同样，我们看到以 `mutable` 为前缀的辅助方法用于创建实现 `MutableCollection` 接口的映射。比较以下 `mapOf` 和 `mutableMapOf` 的实现：

```Kotlin
public fun <K, V> mapOf(vararg pairs: Pair<K, V>): Map<K, V> =
   if (pairs.size > 0) pairs.toMap(LinkedHashMap(mapCapacity(pairs.size))) else emptyMap()
```

```Kotlin
public fun <K, V> mutableMapOf(vararg pairs: Pair<K, V>): MutableMap<K, V> =
   LinkedHashMap<K, V>(mapCapacity(pairs.size)).apply { putAll(pairs) }
```

两者有何区别？你可能会注意到这两个函数都依赖于 `LinkedHashMap`；然而，它们的签名却不同。`mapOf` 返回 `Map` 类型，而 `mutableMapOf` 返回 `MutableMap`。请回想我们之前关于显式类型转换和集合实现的讨论；这两个方法在底层都会创建可变集合。如果你使用 `mapOf()` 方法创建集合，可以将该集合显式转换为可变类型并修改元素，且不会引发编译时错误。
:::

## 数组

- 既不是集合，也不具备可迭代性，但拥有**迭代器**。
- 具有**固定**大小，但其元素是**可变**的。

```Kotlin
/**
 * 表示一个数组（当目标平台为 JVM 时，特指 Java 数组）。
 * 可以使用标准库函数 [arrayOf]、[arrayOfNulls] 和 [emptyArray] 创建数组实例。
 */
public class Array<T> {
    public operator fun set(index: Int, value: T): Unit

    …
}
```

::: info
除了 `List`、`Set` 和 `Map` 这几种集合类型外，还有 `Array`。它实际上并非集合，因为它未实现 `Collection` 或 `Iterable` 接口；但它提供了 `iterator()` 方法来获取迭代器。这意味着可以使用 `for` 循环遍历其元素，例如：

```Kotlin
val array = arrayOf(1, 2, 3)
for (item in array) {
   print(" Array item: $item")
}
```

在上例中，我们还使用了 `arrayOf`，这是一个辅助函数，可让你轻松创建由给定项组成的数组。`Array` 具有固定大小且是可变的。
:::

Kotlin 还提供了用于表示基本类型数组的类，且不会产生装箱开销：`ByteArray`、`ShortArray`、`IntArray` 等。

```Kotlin
/**
 * 一个整型数组。当目标平台为 JVM 时，该类的实例将表示为 `int[]`。
 */
public class IntArray(size: Int) {
    public operator fun set(index: Int, value: T): Unit

    …
}
```

::: info
这些类与 `Array` 类没有继承关系，但它们拥有相同的方法和属性。每个类还都有一个对应的工厂函数。

众所周知，Kotlin 现在拥有基本数据类型——但并非在底层实现。Kotlin 中还提供了针对特定基本类型的数组实现，例如 `IntArray` 或 `ByteArray`，这些在针对 JVM 平台时非常有用（你好，Kotlin Multiplatform！）。

为什么我们需要基本数据类型的数组？试想我们需要在内存中保存 10 个 ID（类型为 `Int`）。使用列表或数组时，我们可能不会察觉到任何差异。但如果 ID 数量达到数千万呢？试着创建一个包含 1000 万个元素的集合，再创建一个类似的数组。两者在内存消耗和性能方面存在相当大的差异。如你所见，在对性能要求极高的处理和应用中，集合与数组的选择至关重要。你可以启用分析器来分析内存消耗，从而复现上述示例。
:::

## 区间

虽然不是集合，但标准类型定义了带有**迭代器**的数列：`CharProgression`、`IntProgression`、`LongProgression`：

```Kotlin
for (c in 'a'..'c') { ... } // CharProgression
for (i in 1..5) { ... }     // IntProgression
for (i in 1L..5L) { ... }   // LongProgression
```

有很多方法可以自定义它们：

```Kotlin
for (i in 10 downTo 0 step 3) { ... }
```

`downTo` 和 `step` 是中缀扩展函数。

::: info
获取一组元素的另一种方法是创建一个区间。Kotlin 提供了 `..` 运算符来实现这一点。整数数据类型的区间（例如 `Int` 或 `Long`）具有一项额外特性：它们可以被迭代，如幻灯片中所示。此类区间也被称为数列。

我们还可以检查给定项是否在区间内，例如：

```Kotlin
val intRange = 1..10
println(5 in intRange)
```

在这里，`in` 检查 `intRange` 是否包含元素 5。
:::

## 序列

它不是集合，但具有**迭代器**：

```Kotlin
/**
 * 一种通过迭代器返回值的序列。序列值是惰性求值的，且序列可能是无限的。
 */
public interface Sequence<out T> {
    public operator fun iterator(): Iterator<T>
}
```

::: info
还有一种类型需要讨论，那就是序列。与集合不同，序列不包含元素。相反，它们是在迭代过程中动态生成元素的。

如果我们查看 `Sequence` 接口，会发现它只声明了一个方法：`operator fun iterator()`。

序列提供了与 `Iterable` 相同的功能，但实现了另一种多步骤集合处理的方法。

序列的多步骤处理在可能的情况下会延迟执行，这意味着实际计算仅在请求整个处理链的结果时才会发生。
:::

要创建一个新的序列，可以使用特殊的**构建器**：

```Kotlin
val sequence1 = emptySequence<Int>() // 构建内部对象 EmptySequence
val sequence2 = sequenceOf<Int>() // 调用 emptySequence()
val sequence3 = sequenceOf(1, 2, 3) // 类型可以被推断
val sequence4 = sequence {
        // 构建 Sequence<Int>
        yield(1)
        yieldAll(listOf(2, 3))
    }

val sequence5 = generateSequence(1) { it + 2 } // `it` 是前一个元素
println(sequence5.take(5).toList()) // [1, 3, 5, 7, 9]
```

::: info
Kotlin 标准库中提供了多种用于创建序列的辅助函数（或构建器）。请看以下示例：

```Kotlin
val sequence4 = sequence {
   yield(1)
   yieldAll(listOf(2, 3))
}

print(sequence4.take(1).toList())
```

如果只取一个元素，是否会调用 `yieldAll`？正如我们所说，序列的多步处理是惰性执行的。在这个例子中，只有 `yield(1)` 会被调用。
:::

## 序列 vs 列表

```Kotlin
val words = "The quick brown fox jumps over the lazy dog".split(" ") // 返回一个列表
val lengthsList = words.filter { println("filter: $it"); it.length > 3 }
    .map { println("length: ${it.length}"); it.length }
    .take(4)

println("Lengths of first 4 words longer than 3 chars:")
println(lengthsList)
```

::: info
为什么我们需要序列？请参考幻灯片中给出的示例。

我们有一个字符串消息，需要：

- 筛选出至少 4 个字符的单词。
- 计算前 N 个选定单词的长度。

如果使用 `List` 集合类型，我们将遍历整个消息并计算每个单词的长度。请尝试运行代码，确保其按预期工作。
:::

```Kotlin
val words = "The quick brown fox jumps over the lazy dog".split(" ") // 返回一个列表
```

![](/assets/kotlin-edu-sinicization/kotlin-sequence-vs-list.png)

::: info
以上是我们实现方案的示意图。你会发现，我们计算了每个至少包含 4 个字母的单词的长度。因此，我们调用了 5 次 `.length` 方法，但最终只需要 4 个结果。看来我们有一些未使用的长度计算结果。
:::

```Kotlin
val words = "The quick brown fox jumps over the lazy dog".split(" ") // 返回一个列表
// 将列表转换为序列
val wordsSequence = words.asSequence()
val lengthsSequence = wordsSequence.filter { println("filter: $it"); it.length > 3 }
    .map { println("length: ${it.length}"); it.length }
    .take(4)

println(lengthsSequence) // 打印 `kotlin.sequences.TakeSequence@MEMORY_ADDR`

println("Lengths of first 4 words longer than 3 chars:")
// 终端操作：将结果转换为 List
println(lengthsSequence.toList()) // 顶部的代码被执行，随后打印 `[5, 5, 5, 4]`
```

::: info
现在让我们尝试使用序列重新实现这个解决方案。原理是一样的：先过滤单词，然后计算它们的长度。

试着运行这段代码。我们看到了什么不同？
:::

```Kotlin
val words = "The quick brown fox jumps over the lazy dog".split(" ") // 返回一个列表
val wordsSequence = words.asSequence()
```

![](/assets/kotlin-edu-sinicization/kotlin-sequence-vs-list-2.png)

::: info
这里，我们并不是遍历整个句子 —— 而是通过迭代来获取所需的结果。

正如我们所说，序列是惰性的，因此其多步迭代会延迟执行。
:::

## 集合操作

处理集合时可以使用**许多**不同的函数。如果你需要对集合进行某种操作，建议先在 Google 上搜索一下。大多数情况下，标准库中已经包含了你所需的函数，例如：

```Kotlin
public fun <T : Comparable<T>> List<T?>
        .binarySearch(element: T?, fromIndex: Int = 0, toIndex: Int = size): Int

public actual fun <T : Comparable<T>> MutableList<T>.sort(): Unit

public inline fun <T, K, V> Iterable<T>
        .groupBy(keySelector: (T) -> K, valueTransform: (T) -> V): Map<K, List<V>>

public inline fun <T> Iterable<T>
        .partition(predicate: (T) -> Boolean): Pair<List<T>, List<T>>
```

::: info
我们已经学习了多种集合数据类型，包括数组、序列以及区间/数列。每种类型都拥有多个“内置”（在接口中声明的）方法。但请记住，还有 Kotlin 扩展。Kotlin 标准库为我们提供了许多用于处理集合和其他数据类型的辅助函数。

如果你觉得需要一些自定义逻辑，请先查看 Kotlin 标准库的扩展，因为你所需的功能很可能已经实现了。

你可以快速浏览一下标准库的文档，了解已经实现了多少个辅助函数——可能有数百个。让我们尽可能地复用它们。
:::

```Kotlin
val exampleList = listOf(1, 2, 3, 4, 5, 6)
```

![](/assets/kotlin-edu-sinicization/kotlin-collection-operations.png)

```Kotlin
exampleList.chunked(2)
```

![](/assets/kotlin-edu-sinicization/kotlin-collection-operations-2.png)

```Kotlin
exampleList.chunked(2) { it.sum() }
```

![](/assets/kotlin-edu-sinicization/kotlin-collection-operations-3.png)

```Kotlin
exampleList.windowed(2)
```

![](/assets/kotlin-edu-sinicization/kotlin-collection-operations-4.png)

```Kotlin
exampleList.drop(1).intersect(List(6) { it - 1 })
```

![](/assets/kotlin-edu-sinicization/kotlin-collection-operations-5.png)

在未来的函数式编程课程中，我们将探讨更多操作。

::: info
由于我们有一个列表，因此也可以获取其排序后的副本。我们可以选择列表元素中某个可比较的属性作为排序依据。在本例中，我们使用由单词及其计数组成的对中的第二个值。
:::
