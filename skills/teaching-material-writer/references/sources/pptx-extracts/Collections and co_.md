# Collections and co_

共 33 页

## Slide 1
- Collections
- and Co.
- Kotlin
- @kotlin
- |  Developed by JetBrains

## Slide 2
- What are they?
- A collection usually contains a number of objects (this number may also be zero) of the same type.
- Objects in a collection are called elements or items.
- Lists are ordered collections with access to elements by indices – integer numbers that reflect their position. Elements can occur more than once in a list.
- Sets are collections of unique elements. They reflect the mathematical abstraction of “set”: a group of objects without duplicates.
- Maps (or dictionaries) are sets of key-value pairs. The keys are unique, and each of them maps to exactly one value, while the values can be duplicated.

**[讲师备注]**
Today we will talk about collections in Kotlin. Let’s start with a general definition of the List, Set, and Map collection types. 

(information on the slide) 
(extra) Map (or dictionary; or associative array) 
Every collection type may have different implementations, for example, List may be implemented using an array or doubly linked list internally. We could say that List, Set, and Map are interfaces or specifications determining which operations are supported (for example, List supports insert item, remove item, get item by index, etc.) and every interface can be backed by multiple implementations. 
Most programming languages have List, Set, and Map data structure implementations in their standard libraries. Such implementations normally align with the definitions given on the slide. 
However, some specific implementations may be also found in different libraries (Apache Commons Collections or others), such as MultiValueMap (or just MultiMap) map/dictionary implementations. This implementation is also a set of key-value pairs, but one key may be associated with multiple values. MultiMap has slightly different semantics – while putting elements into it looks similar, retrieving an element by key returns a collection of items. In some programming languages, such specific data structures may be presented in a standard library, while in others they may be available as third-party libraries.  
References: 
Kotlin Discuss. The Standard Library and a Kotlin Manifesto – https://discuss.kotlinlang.org/t/the-standard-library-and-a-kotlin-manifesto/1303  
Data Structure Stories – https://medium.com/@duplessisjdp96/data-structure-stories-the-dictionary-map-associative-array-key-value-thingy-8579caa44579  
Guide to Multi Value Map – https://www.baeldung.com/apache-commons-multi-valued-map

## Slide 3
- How can they be used?
- Kotlin lets you manipulate collections independently of the exact types of objects stored in them.
- In other words, you add a String to a list of Strings the same way as you would do with Ints or a user-defined class.
- So, the Kotlin Standard Library offers generic interfaces, classes, and functions for creating, populating, and managing collections of any type.

**[讲师备注]**
The Kotlin Standard Library provides a wide set of tools for working with collections. As mentioned earlier, collections contain objects. But what types of objects? We may think of having different types of collection implementations for different types, e.g. IntList or StringList. As established in our previous lesson about generics, using collection interfaces and generics together works really well. In terms of collections, this means that, for example, List may be used to store either Int or String or any other custom data type thanks to generics. 
(optional) Default collections suit our needs most of the time. However, in some specific applications you may encounter performance and memory effectiveness issues, for example due to boxing/unboxing. We may be able to find some type-specific collection implementations or implement our own, however, they may be incompatible with standard interfaces. For example, take a look at TIntArrayList, linked below.
References: 
Kotlin Collections Overview – https://kotlinlang.org/docs/collections-overview.html  
Diving into Kotlin Collections – https://dev.to/kotlin/diving-into-kotlin-collections-587o  
Kotlin Discuss. Performance question related to boxing and interface implementation – https://discuss.kotlinlang.org/t/performance-question-related-to-boxing-and-interface-implementation/17387  
Performance Comparison of Primitive Lists – https://www.baeldung.com/java-list-primitive-performance  
Trove – https://trove4j.sourceforge.net/javadocs/gnu/trove/list/array/TIntArrayList.html

## Slide 4
- Taxonomy of collections
- Interfaces – Kotlin actually uses implementations from java.util

**[讲师备注]**
This slide presents the collection type hierarchy. You may notice there are mutable subtypes for every collection type. Mutable interfaces extend corresponding read-only ones with write operations like add or remove. (optional) That can be tricky, as both read-only and mutable interfaces may be backed by the same implementation. For example, if we try to compile this code, we will get compile-time error: 
val myList = listOf(1, 2, 3)
println(myList[1])
myList[2] = 100
for (e in myList) println("Value: $e")

In the snippet above listOf is a Kotlin Standard Library helper method for easily creating a List collection (notice that there it is a read-only variant, not a mutable one). To make it work, we can simply change listOf to mutableListOf to get a mutable collection: 
val myList = mutableListOf(1, 2, 3)
println(myList[1])
myList[2] = 100
for (e in myList) println("Value: $e")

Now consider this example. Do you think it would compile? If so, would it work smoothly? 
val myList = listOf(1, 2, 3)
(myList as MutableList)[2] = 100
for (e in myList) println("Value: $e")

The answer is yes – it will compile and work without any errors. That’s because both read-only and mutable lists have the same implementation. Be careful to avoid explicit unsafe type casts. 
References: 
● Collection Types – https://kotlinlang.org/docs/collections-overview.html#collection-types

## Slide 5
- Taxonomy of collections
- MutableIterable
- Iterable
- MutableCollection
- Collection
- List
- Set
- MutableList
- MutableSet
- Map
- MutableMap

**[讲师备注]**
Let’s have a look at one more type-hierarchy representation. Again we see both read-only and mutable variants.

## Slide 6
- Iterable
- All collections in Kotlin implement Iterable interface:
- /**
- * Classes that inherit from this interface can be represented as a sequence of elements that can be iterated over.
- * @param T is the type of element being iterated over. The iterator is covariant in its element type.
- */
- public interface Iterable<out T> {
- // Returns an iterator over the elements of this object.
- public operator fun iterator(): Iterator<T>
- }

**[讲师备注]**
As we saw on the previous slide, the Iterable type is at the top of the collections type hierarchy. This means that all collections in the Kotlin Standard Library are iterable. 
What does “iterable” mean? 
Iterating is the technical term for looping, so iterable collections are collections that can be looped over, for instance by using a for-loop. Here is a brief example: 
val myList = listOf(1, 2, 3)
for (item in myList) {
   println("Mylist item $item")
}
As you can see in the code snippet presented on the slide, the Iterable interface has the iterator method and its signature contains the operator keyword (remember Kotlin conventions).  What’s the difference between the Iterator and Iterable interfaces? The Iterable interface represents a data structure that can be iterated (looped) over, while the Iterator interface  provides methods to retrieve elements from the collection while iterating. 
References 
Kotlin Collections. Iterators – https://kotlinlang.org/docs/iterators.html  
Iterator vs Iterable – https://www.baeldung.com/java-iterator-vs-iterable

## Slide 7
- Iterable
- All collections in Kotlin are Iterable:
- val iterator = myIterableCollection.iterator()
- while (iterator.hasNext()) {
- iterator.next()
- }

**[讲师备注]**
A while loop may also be used to iterate over iterable collections. You may obtain an iterator explicitly and use the hasNext() method alongside a while loop to loop through the items. The hasNext() and next() methods are the ones declared in the Iterator interface. Let’s take a look at the interface: 
/**
* Returns the next element in the iteration.
*/
public operator fun next(): T

/**
* Returns `true` if the iteration has more elements.
*/
public operator fun hasNext(): Boolean

## Slide 8
- Iterable vs MutableIterable
- All collections in Kotlin are Iterable:
- val iterator = myIterableCollection.iterator()
- while (iterator.hasNext()) {
- iterator.next()
- }
- But some of them are MutableIterable:
- val iterator = myMutableIterableCollection.iterator()
- while (iterator.hasNext()) {
- iterator.next()
- iterator.remove() // Because it is a mutable iterator
- }

**[讲师备注]**
Remember the collection type hierarchy we saw on previous slides? It also included the MutableIterator interface. What is the difference? Have a look at this interface declaration: 
/**
* An iterator over a mutable collection. Provides the ability to remove elements while iterating.
* @see MutableCollection.iterator
*/
public interface MutableIterator<out T> : Iterator<T> {
   /**
    * Removes from the underlying collection the last element returned by this iterator.
    */
   public fun remove(): Unit
}
You can see that MutableIterator extends the Iterator interface and introduces an extra remove() method so that you can remove items while looping over them, as in the example code above. 
References: 
Kotlin Standard Library. MutableIterator – https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/

## Slide 9
- There are 2 kinds of collections: Collection and  MutableCollection. Collection implements only Iterable interface, while MutableCollection implements Collection and MutableIterable interfaces.
- Collection allows you to read values and make the collection  immutable.
- MutableCollection allows you to change the collection, for example by  adding or removing elements. In other words, it makes the collection mutable.
- val readonlyCollection = listOf(1, 2, 3)
- readonlyCollection.add(4) // ERROR: Unresolved reference: add
- val mutableCollection = mutableListOf(1, 2, 3)
- mutableCollection.add(4) // OK
- Different kinds of collections

**[讲师备注]**
The word “mutable” has appeared multiple times, but what does it mean in terms of collections? Well, it means that a collection may be modified after its creation. For example, items can be added or removed. Read-only collections (or immutable ones) cannot be modified once they are created. 
Every collection type prefixed with mutable implements MutableCollection, which itself extends MutableIterable, as established by the collection type hierarchy. 
References: 
Kotlin Standard Library. MutableCollection – https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-collection/

## Slide 10
- If you create a mutable collection, you cannot reassign the val variable.
- val mutableCollection = mutableListOf(1, 2, 3)
- mutableCollection.add(4) // OK
- mutableCollection = mutableListOf(4, 5, 6) // ERROR: Val cannot be reassigned
- But you can reassign var.
- var mutableCollection = mutableListOf(1, 2, 3)
- mutableCollection.add(4) // OK
- mutableCollection = mutableListOf(4, 5, 6) // OK
- Mutable Collection != Mutable Variable

**[讲师备注]**
A mutable collection may be introduced as a var variable, which means it may be reassigned. 
(optional): 
Sometimes mutability can be tricky. Have a look at one more example: 
data class Point(var x: Int, var y: Int)

val points = listOf(Point(1, 1), Point(2, 2))
println(points)

points[0].x = -1
// What will be printed?
println(points)

A custom data type Point is declared and a read-only (immutable) collection is created. We cannot modify an immutable collection. But if we have an immutable collection and we try to modify one of its elements, will this code compile? Yes, because that collection is still immutable and we don’t try to modify it (e.g. add new item). At the same time we can obtain one of a collection’s elements, which is itself mutable. So an immutable collection can contain mutable objects, which can themselves be modified. 
So when we say collection is read-only (immutable), we mean that collection cannot be modified; items cannot be added or removed. But items in such collections can be mutable and may be modified. 
References: 
Kotlin Basic Syntax – https://kotlinlang.org/docs/basic-syntax.html#variables

## Slide 11
- The anatomy of a collection
- interface List<out E>: Collection<E>
- Abstraction
- Projection. Accepts all inheriting types as elements.
- Parent generic
- Type name
- Generic type name
- Parent type name

**[讲师备注]**
Let’s have a look at the anatomy of a collection, for example, List. As mentioned previously, List is an interface extending the Collection interface. Open the MutableList declaration and check whether it corresponds to the collection type hierarchy we saw earlier. Which interface does it extend? 
References: 
Kotlin Standard Library. List – https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/  
Kotlin Standard Library. MutableList – https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/

## Slide 12
- The anatomy of a collection
- Each collection has several base methods:
- public interface Collection<out E> : Iterable<E> {
- public val size: Int
- public fun isEmpty(): Boolean
- public operator fun contains(element: @UnsafeVariance E): Boolean
- public fun containsAll(elements: Collection<@UnsafeVariance E>): Boolean
- ...
- }
- Use this instead of size == 0

**[讲师备注]**
If we dive into the implementation of the base Collection interface, we will see some base methods, e.g. isEmpty(). Because the Collection interface is implemented by all collections in the Kotlin Standard Library, isEmpty() should be the preferred way of checking whether a collection contains any elements. Looking at the other collection methods introduced, you’ll notice that there are quite a few of them. Collections in Kotlin are quite powerful and flexible. However, as we’ll see in the next slide, not all methods are declared in interfaces. 
References: 
Kotlin Standard Library. Collection – https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/#kotlin.collections.Collection

## Slide 13
- The anatomy of a collection
- Actually there are many extensions:
- public val Collection<*>.indices: IntRange
- get() = 0..size - 1
- public val <T> List<T>.lastIndex: Int
- get() = this.size - 1
- public inline fun <T> Collection<T>.isNotEmpty(): Boolean = !isEmpty()
- ...
- Convenient to use in loops:
- for (i in collection.indices) { ... }
- Use this instead of size != 0

**[讲师备注]**
Kotlin extension functions give us access to even more collection features. There are multiple collection extension functions in the Kotlin Standard Library, some of which you can see in the examples above. Previously we saw the isEmpty() method in the Collection interface. There is also an isNotEmpty() extension function for checking whether a collection contains at least one element. 
Check out the kotlin.collections package to see additional extension functions, e.g. isNullOrEmpty(), which is quite simple yet helpful: 
public inline fun <T> Collection<T>?.isNullOrEmpty(): Boolean {
   contract {
       returns(false) implies (this@isNullOrEmpty != null)
   }

   return this == null || this.isEmpty()
}

References: 
Kotlin Standard Library. Collections – https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/  
Kotlin Standard Library. isNullOrEmpty – https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-null-or-empty.html

## Slide 14
- Сollections under the hood: List
- public interface List<out E> : Collection<E> {
- public operator fun get(index: Int): E
- public fun indexOf(element: @UnsafeVariance E): Int
- public fun lastIndexOf(element: @UnsafeVariance E): Int
- public fun subList(fromIndex: Int, toIndex: Int): List<E>
- ...
- }
- Make a referenced copy:
- val list1 = mutableListOf(1, 2, 3)
- val list2 = list1.subList(0, 1)
- list1[0] += 1
- println(list1) // [2, 2, 3]
- println(list2) // [2]
- Convenient to use with []: collection[2]

**[讲师备注]**
How do we work with collection items? For example, how do we get one? Previously we already used syntax like: 
val myList = listOf(1, 2, 3)
println(myList[1])

Thanks to Kotlin’s indexed access operators, we can easily retrieve elements by index. As you see on this slide, you can use the get(index: Int) operator function to support indexed access. You may use it explicitly like this:
 myList.get(1)

But we recommend using indexed access operators because they are more convenient. 
Be careful with subList, and remember what we’ve said about mutability. subList will create a referenced copy. If you modify a sublist, the parent list will also be modified as a result, as you can see in the example above. But what happens if you try to add an item to the sublist? Run the following example and see what happens: 
val list1 = mutableListOf(1, 2, 3)
val list2 = list1.subList(0, 1)

list2[0] += 1
println(list1)

list2.add(10)
println(list1)

The printed values are:

[2, 2, 3]
[2, 10, 2, 3]

You can see that we are modifying the list2 collection, but list1 is being modified as well. 

References: 
Kotlin Operator overloading – https://kotlinlang.org/docs/operator-overloading.html  
Kotlin Indexed access operators – https://kotlinlang.org/docs/operator-overloading.html#indexed-access-operator  
Kotlin Standard Library. Collections Operations overview – https://kotlinlang.org/docs/collection-operations.html#common-operations  
Kotlin Collection functions cheatsheet – https://medium.com/mobile-app-development-publication/kotlin-collection-functions-cheat-sheet-975371a96c4b

## Slide 15
- Сollections under the hood: List
- To create a new list you can use special builders (by default ArrayList):
- val list1 = emptyList<Int>() // Builds the internal object EmptyList
- val list2 = listOf<Int>() // Calls emptyList()
- val list3 = listOf(1, 2, 3) // The type can be inferred
- val list4 = mutableListOf<Int>() // But better: ArrayList<Int>()
- val list5 = mutableListOf(1, 2, 3) // The type can be inferred
- val list6 = buildList {
- // constructs MutableList<Int>
- add(5)
- addAll(0, listOf(1, 2, 3))
- }

**[讲师备注]**
ArrayList is an array-based implementation. It is cheap to read and generally cheap to add, but it is expensive to inject or remove. 
As we’ve said, the Kotlin Standard Library provides many collection features. There are also multiple helper methods for quickly creating collections, e.g. the listOf or mutableListOf methods that we saw earlier. The examples above offer multiple ways of constructing collections. 
References: 
Kotlin Standard Library. Constructing collections – https://kotlinlang.org/docs/constructing-collections.html

## Slide 16
- Сollections under the hood: Set
- public interface Set<out E> : Collection<E> {
- abstract val size: Int
- abstract fun contains(element: @UnsafeVariance E): Boolean
- abstract fun containsAll(collection: Collection<E>): Boolean
- abstract fun isEmpty(): Boolean
- abstract fun iterator(): Iterator<E>
- }
- A generic unordered collection of elements that does not support duplicate elements.
- It compares objects via the equals method instead of checking if the objects are the same.

**[讲师备注]**
We’ve discussed the List collection type. Now let’s talk about the Set collection type. 
Unlike List, Set normally does not preserve the order of items (though there are implementations that do, e.g. LinkedHashSet). 
Set stores unique items, meaning duplicates are not allowed. 
References: 
Kotlin Standard Library. Collections Overview. Sets – https://kotlinlang.org/docs/collections-overview.html#set

## Slide 17
- Сollections under the hood: Set
- class A(val primary: Int, val secondary: Int)
- class B(val primary: Int, val secondary: Int) {
- override fun hashCode(): Int = primary
- override fun equals(other: Any?) = primary == (other as? B)?.primary
- }
- fun main() {
- val a = A(1,1)
- val b = A(1,2)
- val set = setOf(a, b)
- println(set) // two elements
- }

**[讲师备注]**
Though Set stores unique elements, the uniqueness of those elements depends on the object types being added to any set. Imagine you have a simple class, A, as in the slide above. You can add two objects A(1,1) and A(1,2) to the set. So far, there is no problem, as the two objects have different properties.

## Slide 18
- Сollections under the hood: Set
- class A(val primary: Int, val secondary: Int)
- class B(val primary: Int, val secondary: Int) {
- override fun hashCode(): Int = primary
- override fun equals(other: Any?) = primary == (other as? B)?.primary
- }
- fun main() {
- val a = B(1,1)
- val b = B(1,2)
- val set = setOf(a, b)
- println(set) // only one element
- }

**[讲师备注]**
However, if we introduce type B with overridden equals and hashCode methods that check only the primary property, what will we have in the set? Try to run the example above with A first, then try to swap types: 
val a = B(1, 1)
val b = B(1, 2)
val set = setOf(a, b)
println(set) // how many elements are there?

What happened? Because we introduced custom equals and hashCode methods in type B, we got only one element in the set. Remember that the set itself uses only the equals and hashCode object methods to check whether the objects in the set are unique, so be careful when using custom types with overridden methods. 
References: 
Kotlin Discussions. How does Kotlin implement equals and hashCode – https://discuss.kotlinlang.org/t/how-does-kotlin-implement-equals-and-hashcode/940

## Slide 19
- Сollections under the hood: Set
- To create a new set you can use special builders (by default LinkedHashSet):
- val set1 = emptySet<Int>() // Builds the internal object EmptySet
- val set2 = setOf<Int>() // Calls emptySet()
- val set3 = setOf(1, 2, 3) // The type can be inferred
- val set4 = mutableSetOf<Int>() // But better: LinkedHashSet<Int>() or HashSet<Int>()
- val set5 = mutableSetOf(1, 2, 3) // The type can be inferred
- val set6 = buildSet {
- // constructs MutableSet<Int>
- add(5)
- addAll(listOf(1, 2, 3))
- }

**[讲师备注]**
LinkedHashSet is a doubly linked HashSet that preserves the injection order on iteration. It uses Asymptotic O(1) for adding and member checking and relies on the hashCode() function of elements. 
What type is used by the mutableListOf helper under the hood? Let’s have a look at its implementation: 
public fun <T> mutableSetOf(vararg elements: T): MutableSet<T> = elements.toCollection(LinkedHashSet(mapCapacity(elements.size)))

You can see that LinkedHashSet is used to store items. 
References: 
Kotlin Standard Library. mutableSetOf – https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html

## Slide 20
- Сollections under the hood: Map
- public interface Map<K, out V> {
- public fun containsKey(key: K): Boolean
- public fun containsValue(value: @UnsafeVariance V): Boolean
- public operator fun get(key: K): V?
- public fun getOrDefault(key: K, defaultValue: @UnsafeVariance V): V
- public val entries: Set<Map.Entry<K, V>>
- …
- }
- Convenient to use in loops:
- for ((key, value) in map.entries) { ... }

**[讲师备注]**
We’ve discussed the List and Set collection types, which means we have yet to talk about the Map type. A Map (also called an associated array or dictionary) is a data structure for storing key-value pairs. 
Let’s have a brief look at the Kotlin Standard Library’s Map interface declaration. Just as we saw in List and Set, there are multiple methods in the interface (and don’t forget the Kotlin extensions!).  
Similarly to Lists, we can retrieve any value by its key as follows: 
val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
println(numbersMap["one"])

  mapOf is a Kotlin Standard Library helper function for creating maps easily and quickly. We will discuss it on the next slide. And the code "one" to 1 is a convenient way to create pairs using the Kotlin infix function to, provided by the Kotlin Standard Library. However, the explicit use of get is also possible: 
println(numbersMap.get("one"))

The getOrDefault method should be invoked explicitly to either retrieve an element by its key or return a default value passed as an argument: 
val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3) println(numbersMap.getOrDefault("two", -1))  // “2” is  printed, as there is a “two” key in the map.println(numbersMap.getOrDefault("four", -1)) // “-1” is printed, as no “four” key found, so the default value is used.  
The entries method can be useful for iterating over key-value pairs. Using it together with destructuring declarations is a very convenient way to loop over map items. 
References: 
Kotlin Collections. Map-specific operations – https://kotlinlang.org/docs/map-operations.html  
Destructuring declarations – https://kotlinlang.org/docs/destructuring-declarations.html  
Kotlin Standard Library. `to` infix function – https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html

## Slide 21
- Сollections under the hood: Map
- To create a new map you can use special builders (by default LinkedHashMap):
- val map1 = emptyMap<Int, String>() // Builds the internal object EmptyMap
- val map2 = mapOf<Int, String>() // Calls emptyMap()
- val map3 = mapOf(1 to "one", 2 to "two") // The type can be inferred
- val map4 = mutableMapOf<Int, String>() // But better: LinkedHashMap<...>() or HashMap<...>()
- val map5 = mutableMapOf(1 to "one", 2 to "two") // The type can be inferred
- val map6 = buildMap {
- // constructs MutableMap<Int, String>
- put(1, "one")
- putAll(mutableMapOf(2 to "two"))
- }

**[讲师备注]**
LinkedHashMap is a doubly linked HashMap that preserves the injection order on iteration. It uses Asymptotic O(1) for adding and reading by key, and it relies on the hashCode() function of elements. 
Like for lists and sets, there are multiple helper methods (or “builders”) in the Kotlin Standard Library for quickly creating maps. And again, we see helpers prefixed with mutable for creating maps implementing the MutableCollection interface. Compare these implementations of mapOf and mutableMapOf: 
public fun <K, V> mapOf(vararg pairs: Pair<K, V>): Map<K, V> =
   if (pairs.size > 0) pairs.toMap(LinkedHashMap(mapCapacity(pairs.size))) else emptyMap()


public fun <K, V> mutableMapOf(vararg pairs: Pair<K, V>): MutableMap<K, V> =
   LinkedHashMap<K, V>(mapCapacity(pairs.size)).apply { putAll(pairs) }

What is the difference? You may notice that both functions rely on LinkedhashMap; however, their signatures are different. mapOf returns the Map type whereas mutableMapOf returns MutableMap. Remember what we said about explicit casts and collection implementations; both methods create mutable collections under the hood. If you create a collection using the mapOf() method, you can explicitly cast that collection to a mutable type and modify elements. No compile-time errors will occur. 
References: 
Kotlin Standard Library. emptyMap – https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-map.html  
Kotlin Standard Library. mapOf – https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html  
Kotlin Standard Library. mutableMapOf – https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html

## Slide 22
- Array
- Not a collection and not iterable, but has an iterator.
- Has a fixed size, but its elements are mutable.
- /**
- * Represents an array (specifically a Java array when targeting the JVM platform).
- * Array instances can be created using the [arrayOf], [arrayOfNulls], and [emptyArray] standard library functions.
- */
- public class Array<T> {
- public operator fun set(index: Int, value: T): Unit
- …
- }

**[讲师备注]**
In addition to the List, Set, and Map collection types, there is also Array. It is not actually a collection, as it does not implement Collection or Iterable interfaces; however, it provides the iterator() method for obtaining an iterator. This means its elements can be looped over with a for loop, for example: 
val array = arrayOf(1, 2, 3)
for (item in array) {
   print(" Array item: $item")
}
In the example above, we also use arrayOf, which is another helper that allows you to easily create an array of given items. Array has fixed size and is mutable . 
References: 
Kotlin Arrays – https://kotlinlang.org/docs/arrays.html  
Kotlin Standard Library. arrayOf – https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html

## Slide 23
- Array
- Kotlin also has classes that represent arrays of primitive types without boxing overhead: ByteArray, ShortArray, IntArray, and so on.
- /**
- * An array of ints. When targeting the JVM, instances of this class are represented as `int[]`.
- */
- public class IntArray(size: Int) {
- public operator fun set(index: Int, value: T): Unit
- …
- }

**[讲师备注]**
These classes have no inheritance relation to the Array class, but they have the same set of methods and properties. Each of them also has a corresponding factory function 
As we know, there are now primitive data types in Kotlin – not, however, under the hood. There are also implementations of primitive type-specific arrays in Kotlin, like IntArray or ByteArray, which are useful when targeting the JVM platform (Hello, Kotlin Multiplatform!). 
Why do we need primitive data type arrays? Well, imagine we need to keep 10 IDs (of the Int type) in memory. We probably won’t notice any difference between using a list or an array. But what if we have tens of millions of IDs? Try to create a collection of 10 million items and then a similar array. There is a pretty huge difference in both memory consumption and performance. As you can see, the choice between collections and arrays is important in performance-critical processing and applications. You can reproduce the example above with a profiler enabled to analyze memory consumption. 
References: 
Kotlin Academy. Effective Kotlin: Consider Arrays with primitives for performance critical processing – https://blog.kotlin-academy.com/effective-kotlin-use-arrays-with-primitives-for-performance-critical-processing-297283ed1f90

## Slide 24
- Not collections, but there are defined progressions for standard types with iterators: CharProgression, IntProgression, LongProgression:
- for (c in 'a'..'c') { ... } // CharProgression
- for (i in 1..5) { ... }     // IntProgression
- for (i in 1L..5L) { ... }   // LongProgression
- There are a lot of ways to customize them:
- for (i in 10 downTo 0 step 3) { ... }
- downTo and step infix extension functions.
- Ranges

**[讲师备注]**
One more way to get a set of elements is to create a range. Kotlin provides the “..” operator to do so. Integral data type ranges (e.g. Int or Long) have an extra feature: They can be iterated over, as demonstrated on the slide. Such ranges are also called progressions. 
We can also check whether a given item is within the range, for example: 
val intRange = 1..10
println(5 in intRange)

Here, in checks whether intRange contains the element 5. 
References: 
Ranges and Progressions – https://kotlinlang.org/docs/ranges.html

## Slide 25
- Not a collection, but has an iterator:
- /**
- * A sequence that returns values through its iterator. The values are evaluated lazily, and the sequence is potentially infinite.
- */
- public interface Sequence<out T> {
- public operator fun iterator(): Iterator<T>
- }
- Sequence

**[讲师备注]**
One more type to discuss is Sequence. Unlike collections, sequences don't contain elements. Instead, they produce them while iterating. 
If we have a look at the Sequence interface, we will see only one method declared:  operator fun iterator(). 
Sequences offer the same functions as Iterable but implement another approach to multi-step collection processing. 
Multi-step processing of sequences is executed lazily when possible, meaning that the actual computing happens only when the result of the whole processing chain is requested. 
References: 
Sequences – https://kotlinlang.org/docs/sequences.html  
Kotlin Sequences. The story of lazy collection operations – https://medium.com/android-news/kotlin-sequences-ac6dc7c883d3

## Slide 26
- To create a new sequence you can use special builders:
- val sequence1 = emptySequence<Int>() // Builds the internal object EmptySequence
- val sequence2 = sequenceOf<Int>() // Calls emptySequence()
- val sequence3 = sequenceOf(1, 2, 3) // The type can be inferred
- val sequence4 = sequence {
- // constructs Sequence<Int>
- yield(1)
- yieldAll(listOf(2, 3))
- }
- val sequence5 = generateSequence(1) { it + 2 } // `it` is the previous element
- println(sequence5.take(5).toList()) // [1, 3, 5, 7, 9]
- Sequence

**[讲师备注]**
There are multiple helpers (or builders) for creating sequences in the Kotlin Standard Library. Consider the following example: 
val sequence4 = sequence {
   yield(1)
   yieldAll(listOf(2, 3))
}

print(sequence4.take(1).toList())

If only one item is taken, will yieldAll be invoked? As we said, multi-step processing of sequences is executed lazily. In this example only yield(1) is invoked.

## Slide 27
- val words = "The quick brown fox jumps over the lazy dog".split(" ") // Returns a list
- val lengthsList = words.filter { println("filter: $it"); it.length > 3 }
- .map { println("length: ${it.length}"); it.length }
- .take(4)
- println("Lengths of first 4 words longer than 3 chars:")
- println(lengthsList)
- Sequence vs List

**[讲师备注]**
Why do we need sequences? Consider the examples presented on the slide. 
We have a string message, and we need to: 
● Select words with at least 4 chars. 
● Calculate the lengths of first N words selected.
If we use the List collection type, we will go through the whole message and calculate every word length. Try running the code to make sure it works as expected.

## Slide 28
- val words = "The quick brown fox jumps over the lazy dog".split(" ") // Returns a list
- Sequence vs List
- filter
- map
- take
- The
- quick
- brown
- fox
- jumps
- over
- the
- lazy
- dog
- quick
- brown
- jumps
- over
- lazy
- 5
- 5
- 5
- 4
- 4
- 5
- 5
- 5
- 4
- it.length > 3
- it.length

**[讲师备注]**
Here is a schematic representation of our implementation. You’ll see that we calculate the length of every word with at least 4 letters. So we invoked .length 5 times but, in the end, we needed only 4 answers. So it seems we have unused length invocation results.

## Slide 29
- val words = "The quick brown fox jumps over the lazy dog".split(" ") // Returns a list
- // Сonvert the List to a Sequence
- val wordsSequence = words.asSequence()
- val lengthsSequence = wordsSequence.filter { println("filter: $it"); it.length > 3 }
- .map { println("length: ${it.length}"); it.length }
- .take(4)
- println(lengthsSequence) // prints `kotlin.sequences.TakeSequence@MEMORY_ADDR`
- println("Lengths of first 4 words longer than 3 chars:")
- // Terminal operation: obtaining the result as a List
- println(lengthsSequence.toList()) // top code gets executed, then prints `[5, 5, 5, 4]`
- Sequence vs List

**[讲师备注]**
Now let’s try to re-implement our solution using sequences. The concept is the same: Filter the words first, then calculate their lengths. 
Try running this code. What difference do we see?

## Slide 30
- val words = "The quick brown fox jumps over the lazy dog".split(" ") // Returns a list
- val wordsSequence = words.asSequence()
- Sequence vs List
- filter
- map
- take
- toList
- The
- quick
- brown
- fox
- jumps
- over
- the
- lazy
- dog
- quick
- brown
- jumps
- over
- 5
- 5
- 5
- 4
- 5
- 5
- 5
- 4
- Processes sequentially, performing all operations
- Does not handle elements because we already have four

**[讲师备注]**
Here, we’re not looping over the whole sentence – we do iterations to get only the required result. 
As we said, sequences are lazy, so their multi-step iterations are executed lazily.

## Slide 31
- There are many different functions for working with collections. If you need to do something with a collection, Google it first. Most likely, the standard library already has the function you need, for example:
- public fun <T : Comparable<T>> List<T?>.binarySearch(element: T?, fromIndex: Int = 0, toIndex: Int = size): Int
- public actual fun <T : Comparable<T>> MutableList<T>.sort(): Unit
- public inline fun <T, K, V> Iterable<T>.groupBy(keySelector: (T) -> K, valueTransform: (T) -> V): Map<K, List<V>>
- public inline fun <T> Iterable<T>.partition(predicate: (T) -> Boolean): Pair<List<T>, List<T>>
- Collection operations

**[讲师备注]**
We’ve studied multiple collection data types, arrays, sequences, and ranges/progressions. Every type has multiple “built-in” (declared in the interface) methods. But remember there are also Kotlin extensions. The Kotlin Standard Library provides us with many helper functions for working with collections and other data types. 
If you feel you need some custom logic, check the Kotlin Standard Library extensions first, as what you need has probably already been implemented. 
You can take a quick look through the standard library documentation to get a sense of how many helpers have already been implemented – possibly hundreds. Let’s reuse them whenever possible. 
References: 
● Kotlin Standard Library. Collections – https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/

## Slide 32
- val exampleList = listOf(1, 2, 3, 4, 5, 6)
- exampleList.chunked(2)
- exampleList.chunked(2) { it.sum() }
- exampleList.windowed(2)
- exampleList.drop(1).intersect(List(6) { it - 1 })
- We will look into even more operations in our future lecture on Functional programming.
- Collection operations
- 1
- 2
- 3
- 4
- 5
- 6
- 1
- 2
- 3
- 4
- 5
- 6
- 1
- 2
- 2
- 3
- 3
- 4
- 4
- 5
- 5
- 6
- 2
- 3
- 4
- 11
- 7
- 3

**[讲师备注]**
Because we have a list, we can also get a sorted copy. We can choose a comparable attribute of the list’s element to sort by. In our example, we use the second value in the pair consisting of a word and its count.

## Slide 33
- Thanks!
- @kotlin
- |  Developed by JetBrains


--- 统计: 33 页, 31 页含讲师备注