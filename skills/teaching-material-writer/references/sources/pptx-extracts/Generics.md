# Generics

共 37 页

## Slide 1
- Generics
- Kotlin
- @kotlin
- |  Developed by JetBrains

**[讲师备注]**
Today we are going to talk about generics: one of the ways you can write generic code capable of handling program entities of different types.

## Slide 2
- What? Why?
- fun quickSort(collection: CollectionOfInts) { ... }
- quickSort(listOf(1, 2, 3)) // OK
- quickSort(listOf(1.0, 2.0, 3.0)) // NOT OK
- fun quickSort(collection: CollectionOfDoubles) { ... } // overload (we’ll get back to this a bit later)
- quickSort(listOf(1.0, 2.0, 3.0)) // OK
- quickSort(listOf(1, 2, 3)) // OK
- Kotlin Number inheritors: Int, Double, Byte, Float, Long, Short
- Do we need 4 more implementations of quickSort?

**[讲师备注]**
Imagine that in your awesome Kotlin project you want to sort a collection of integers. To do that, you implement a quickSort function that takes your collection of integers as an input and sorts it. And everything works as expected: you can sort a list of integers [1, 2, 3] with it.

Some time later, in your project you decide you need to sort a collection of doubles, not integers. However, when you try to use your old quickSort function with a list of doubles [1.0, 2.0, 3.0], it does not work, because to sort collections of doubles you need another function that takes such collections as input. Luckily, you can implement that using a feature called “overloading”, which is the ability to have several functions with the same name but different parameters. After you implement quickSort for collections of doubles, both cases work.

Now imagine if, in the future, you need to sort floats or longs as well. Does that mean you will have to implement additional overloaded versions of quickSort? And are these versions really that different from each other? 

References:
https://en.wikipedia.org/wiki/Function_overloading 
https://espadrine.github.io/blog/posts/language-contradictions.html#Overloading

## Slide 3
- How?
- Does the quickSort algorithm actually care what is it sorting? No, as long as it can compare two values against each other.
- fun <T : Comparable<T>> quickSort(collection: Collection<T>): Collection<T> { ... }
- quickSort(listOf(1.0, 2.0, 3.0)) // OK
- quickSort(listOf(1, 2, 3)) // OK
- quickSort(listOf("one", "two", "three")) // OK

**[讲师备注]**
As it turns out, they are not different at all, as quickSort is a generic algorithm. All a quickSort implementation needs is a way to compare elements in the collection. We can write this in Kotlin using generics.

Assume in our quickSort case we can say the following: If you give us a collection of elements of some type T (Collection<T>) which can be compared to each other (<T : Comparable<T>>), we can sort this collection. When you call this function with a collection of doubles (Collection<Double>), a collection of integers (Collection<Int>) or a collection of strings (Collection<String>), Kotlin understands what type you want to use, and can compile and run your code successfully.

## Slide 4
- How?
- Generics allow you to write code that can work with any type or with types that should satisfy some rules (constraints) but are not limited in any other ways: type parameters.
- class Holder<T>(val value: T) { ... }
- val intHolder = Holder<Int>(23)
- val cupHolder = Holder("cup") // Generic parameter type can be inferred

**[讲师备注]**
Generics are written in angle brackets (<T>) and can be thought of as special type parameters or “placeholders” that we assign a specific type to when using generic code (calling a generic function or using a generic type). Inside generic declarations, you can use type parameters as you would use other types. 

In this example, we declare a holder type: a box which can hold a value of any type (and maybe do other awesome things with it), with the “any type” placeholder represented by a type parameter T. This T is used as a type for the val value: T property of your holder type.

When you use a generic type, you need to specify what type to use in place of a type parameter. You can do this explicitly by writing the type yourself in angle brackets (Holder<Int>). Alternatively (and this is the preferred way of doing this in Kotlin) you can specify it implicitly by using your generic code in such a way that it is clear what the type parameter should be assigned to.

If you attempt to make a holder for a cup (Holder(“cup”)), we can use the information about val value: T being assigned to “cup” to understand that type parameter T should be assigned to the type of cup, which is a string. This happens using a process called “type inference”, and we’ll discuss it later in our course. 

References:
https://kotlinlang.org/docs/generics.html

## Slide 5
- Constraints
- Sometimes we do not want to work with an arbitrary type and expect it to provide us with some functionality. In such cases type constraints in the form of upper bounds are used: upper bounds.
- class Pilot<T : Movable>(val vehicle: T) {
- fun go() { vehicle.move() }
- }
- val ryanGosling = Pilot<Car>(Car("Chevy", "Malibu"))
- val sullySullenberger = Pilot<Plane>(Plane("Airbus", "A320"))

**[讲师备注]**
If we go back to our quickSort example, we can see we needed type T to be comparable, otherwise quickSort wouldn’t work. In other words, we wanted to put a constraint on the possible types we could fill the type parameter with.

This is done using type parameter constraints. They are written after the type parameter (T : Comparable<T>, T : Movable), are called upper bounds, and describe the supertypes that type parameter T must definitely have. Inside the generic code, this means we can use values of type T : A as if they had supertype A (we can call functions of type A, access properties of type A, etc.). Outside the generic code, we need to respect these constraints when we fill the type parameter.

In the pilot example on the slide, objects of this class have to pilot something that is movable (T : Movable). In the implementation of the go() function we use this restriction call vehicle.move(). When we create a pilot, we make sure their vehicle is movable (Car, Plane); if we attempt to make a pilot for a stone (assuming Stone ≮: Movable), the compiler will catch that and report an error.

## Slide 6
- Constraints continued
- There can be several parameter types, and generic classes can participate in inheritance.
- public interface MutableMap<K, V> : Map<K, V> { ... }
- There can also be several constraints (which means the type parameter has to implement several interfaces):
- fun <T, S> moveInAnAwesomeWayAndCompare(a: T, b: S) where T : Comparable<T>, S : Comparable<T>, T : Awesome, T : Movable { ... }

**[讲师备注]**
Similarly to regular function parameters, generic code can have several type parameters (Map<K, V>, Triple<A, B, C>). In most cases, generic code may be used the same way as non-generic code. For example, you can have a generic class as a supertype for some other type.

The MutableMap example on this slide works with two generic types, but there is an important difference between them. MutableMap<K ,V> is a generic type declaration that declares two type placeholders (K and V) you would need to fill when using it. The Map<K, V> supertype is a generic type use that passes the type parameters of MutableMap as type arguments to fill the placeholders of the Map interface. As we mentioned before, inside a generic declaration (MutableMap<K, V>) you can use its type parameters (K, V) as if they were full-blown regular types.

Type parameter constraints are also not limited to only one per type parameter. We can have several constraints if we need the type parameter to be a subtype of several types (implement several classes and interfaces). In such cases they are written using a where clause after the declaration “header”.

## Slide 7
- Star-projection
- When you do not care about the parameter type, you can use star-projection * (Any? / Nothing).
- fun printKeys(map: MutableMap<*, *>) { ... }

**[讲师备注]**
Sometimes you do not need any constraints whatsoever. For example, all maps have the same size:Int property, independent of their specific generic parameters.

In cases where you want to work with any instance of a generic class, regardless of the type parameters, you can substitute the generic parameters with stars. This is called star-projection.

Note 1: Working with methods that actually use generic parameters is almost impossible when using star-projection. For example, MutableList<*> will have add(element: Nothing) and get(index: Int): Any?

Note 2: For in and out projections, which we cover in later slides, star-projection works smarter:For Foo<out T : TUpper>, Foo<*> is equivalent to Foo<out TUpper>.
For Foo<in T>, Foo<*> is equivalent to Foo<in Nothing>.
For Foo<T : TUpper>, Foo<*> is equivalent to Foo<out TUpper> for reading values and to Foo<in Nothing> for writing values.
More in docs

## Slide 8
- Let's go back
- open class A
- open class B : A()
- class C : B()
- Nothing <: C <: B <: A <: Any
- This means that the Any class is the superclass for all the classes and at the same time Nothing is a subtype of any type

**[讲师备注]**
If we remember our discussions about object-oriented programming, when we describe inheritance, we also establish a subtyping relation between types. The class hierarchy on the slide will create the subtyping C <: B <: A. Additionally, all non-nullable types in Kotlin have Any as their supertype and Nothing as their subtype.

Returning to our present topic, how do generics change the subtyping story? In other words, how can generic types be substituted for one another? 

References:
1.  https://en.wikipedia.org/wiki/Subtyping

## Slide 9
- What is next?
- Consider a basic example:
- interface Holder<T> {
- fun push(newValue: T) // consumes an element
- fun pop(): T // produces an element
- fun size(): Int // does not interact with T
- }

**[讲师备注]**
Assume we improve our holder box type so that it can consume an element (via push), produce an element (via pop), and return the current number of elements inside (via size). How can we assign different holder boxes to each other? Can we assign Holder<Int> to a Holder<String>? What about Holder<Int> to Holder<Number>?

## Slide 10
- What is next?
- interface Holder<T> {
- fun push(newValue: T) // consumes an element
- fun pop(): T // produces an element
- fun size(): Int // does not interact with T
- }
- In Kotlin there are type projections:
- G<T> // invariant, can consume and produce elements
- G<in T> // contravariant, can only consume elements
- G<out T> // covariant, can only produce elements
- G<*> // star-projection, does not interact with T

**[讲师备注]**
To explain subtyping for generic types, we first need to talk about type projections. You can think about type projections as modifiers for type parameters that change what you can do with them.

A type parameter may be one of the following kinds:
An invariant type parameter (the default option with no modifier), which can be used as a type you get as output from (produce) and use as input for (consume) your generic type
A covariant type parameter (modifier out), which can be used only as a type you get out from (produce) your generic type
A contravariant type parameter (modifier in), which can be used only as a type you put into (consume) your generic type

These belong to a feature known as “declaration-site variance” – when you specify the variance of your type parameters in declarations. Kotlin also supports “use-site variance” – when you specify the variance of your type parameters in uses – which we’ll discuss later. “Star-projection” (*) also belongs to use-site variance.

Let’s see how these restrictions can be used in your Kotlin code and what this “variance” actually means.

References:
https://kotlinlang.org/spec/type-system.html#declaration-site-variance
https://kotlinlang.org/spec/type-system.html#use-site-variance

## Slide 11
- Several examples
- G<T> // invariant, can consume and produce elements
- interface Holder<T> {
- fun push(newValue: T)// consumes an element: OK
- fun pop(): T // produces an element: OK
- fun size(): Int // does not interact with T: OK
- }

**[讲师备注]**
An invariant type parameter T – the default kind of type parameter – allows you to use T inside the generic declaration without any restrictions. You can use T both as a type for properties and function return types (something you produce from your type) and as a type for function parameters (something you consume in your type).

## Slide 12
- Several examples
- G<in T> // contravariant, can only consume elements
- interface Holder<in T> {
- fun push(newValue: T) // consumes an element: OK
- fun pop(): T // produces an element: ERROR: [TYPE_VARIANCE_CONFLICT_ERROR] Type parameter T is declared as 'in' but occurs in 'out' position in type T
- fun size(): Int // does not interact with T: OK
- }

**[讲师备注]**
A contravariant type parameter in T limits you to using T inside the generic declaration only as a type for function parameters (something you consume in your type). “In” is an easy mnemonic for remembering this (“I can put things of type T in, but not get them out”). If you attempt to violate this restriction, the Kotlin compiler will report an error.

## Slide 13
- Several examples
- G<out T> // covariant, can only produce elements
- interface Holder<out T> {
- fun push(newValue: T) // consumes an element: ERROR: [TYPE_VARIANCE_CONFLICT_ERROR] Type parameter T is declared as 'out' but occurs in 'in' position in type T
- fun pop(): T // produces an element: OK
- fun size(): Int // does not interact with T: OK
- }

**[讲师备注]**
The covariant type parameter out T works similarly, but in the opposite direction: It limits you to using T inside the generic declaration only as a type for something you produce from your type, as in function return values and properties. Again, “out” is an easy way to remember “I can get things of type T out, but not put them in”. The correctness of how you use a covariant type parameter is also checked by the Kotlin compiler.

## Slide 14
- Several examples
- interface Holder<T> {
- fun push(newValue: T) // consumes an element: OK
- fun pop(): T // produces an element: OK
- fun size(): Int // does not interact with T: OK
- }
- fun <T> foo1(holder: Holder<T>, t: T) {
- holder.push(t) // OK
- }
- fun <T> foo2(holder: Holder<*>, t: T) {
- holder.push(t) // ERROR: [TYPE_MISMATCH] Type mismatch. Required: Nothing. Found: T
- }
- fun foo1(holder: Holder<Any>, t: Any) {
- holder.push(t) // OK
- }

**[讲师备注]**
Last but not least, in some cases you may want to say “I don’t care what type a type parameter is filled with”. To express that, you use a star-projection: if you have a Holder<*>, you can only put Nothing in, but you can get Any? (thing) out. In many cases, when you have a star-projected generic type, you use those parts which are not dependent on its type parameters (such as Holder<*>.size() in our example).

## Slide 15
- Subtyping
- open class A
- open class B : A()      —--->  Nothing <: C <: B <: A <: Any
- class C : B()
- class Holder<T>(val value: T) { ... }
- Holder<Nothing> ??? Holder<C> ??? Holder<B> ??? Holder<A> ??? Holder<Any>

**[讲师备注]**
Now that we’ve covered type projections, we can start talking about how subtyping works for generic types. If our generic type has an invariant type parameter – the one we can both produce and consume with – can we establish any subtyping between different versions of this type? If we have C <: B <: A (where T <: Q means T is a subtype of Q), can we say anything about the subtyping relation between Holder<C>, Holder<B>, and Holder<A>?

## Slide 16
- Subtyping
- open class A
- open class B : A()      —--->  Nothing <: C <: B <: A <: Any
- class C : B()
- class Holder<T>(val value: T) { ... }
- Holder<Nothing> <:> Holder<C> <:> Holder<B> <:> Holder<A> <:> Holder<Any>
- Generics are invariant!!
- val c: C = C()
- val b: B = c // C <: B, OK
- val holderC: Holder<C> = Holder(C())
- val holderB: Holder<B> = holderC // ERROR: Type mismatch. Required: Holder<B>. Found: Holder<C>.
- VS

**[讲师备注]**
Let’s consider both possible cases.

Assume Holder<C> <: Holder<B>, meaning we can substitute a value of type Holder<C> anywhere we could use a value of type Holder<B>. That unfortunately does not work, as the contravariant part of the Holder API does not allow for such substitution. We’ll have Holder<C>.push() (which accepts values of type C) being called with values of type B, which is incorrect.

Now assume it’s the other way around, and Holder<B> <: Holder<C>. In this case, the covariant part of the Holder API breaks, as we’ll have Holder<B>.pop(), which returns values of type B, being called where a value of type C is expected, which is, again, incorrect.

This means invariant type parameters cause their generic type to be invariant with respect to subtyping, and there is no subtyping relationship between different versions of an invariant generic type.

## Slide 17
- Subtyping
- open class A
- open class B : A()      —--->  Nothing <: C <: B <: A <: Any
- class C : B()
- class Holder<T>(val value: T) { ... }
- val holderC: Holder<C> = Holder(C())
- val holderB: Holder<B> = holderC //ERROR: Type mismatch. Required: Holder<B>. Found: Holder<C>.
- BUT
- val holderB: Holder<B> = Holder(C()) // OK, because of casting

**[讲师备注]**
It is important to note that some Kotlin code may look like it allows you to assign different invariant generic types to each other. For example, you can do val holderB: Holder<B> = Holder(C()), and the Holder(C()) will look like it has a Holder<C> type, when in actuality it doesn’t.

The Kotlin compiler is smart enough to understand that, to assign a value to Holder<B>, that value must also be of the Holder<B> type. And you can create a Holder<B> from a value of type C, as one can call its constructor (which expects B) with a value of type C. That is precisely what happens here, and the invariant generics remain invariant.

## Slide 18
- Subtyping
- class Holder<T> (var value: T?) {
- fun pop(): T? = value.also { value = null }
- fun push(newValue: T?): T? = value.also { value = newValue }
- fun steal(other: Holder<T>) { value = other.pop() }
- fun gift(other: Holder<T>) { other.push(pop()) }
- }
- Holder<Nothing> <:> Holder<C> <:> Holder<B> <:> Holder<A> <:> Holder<Any>
- val holderB: Holder<B> = Holder(B())
- val holderA: Holder<A> = Holder(null)
- holderA.steal(holderB) // ERROR: Type mismatch. Required: Holder<A>. Found: Holder<B>.
- holderB.gift(holderA) // ERROR: Type mismatch. Required: Holder<B>. Found: Holder<A>.

**[讲师备注]**
The absence of subtyping between invariant generic types means not only that we cannot assign different versions to each other, but also that we also cannot pass them as arguments to functions expecting such generic types. This is checked and enforced by the Kotlin compiler.

## Slide 19
- Type projection: in
- class Holder<T> (var value: T?) {
- ...
- fun gift(other: Holder<in T>) { other.push(pop()) }
- }
- holderB.gift(holderA) // OK
- Type projection: other is a restricted (projected) generic. You can only call methods that accept the type parameter T, which in this case means that you can only call push().
- This is contravariance:
- Nothing <: C <: B <: A <: Any
- Holder<Nothing> :> Holder<C> :> Holder<B> :> Holder<A> :> Holder<Any>

**[讲师备注]**
How do other kinds of type parameters (co- and contravariant ones) change the subtyping?

Well, if we look back the problems encountered when trying to make subtyping between invariant generic types work, we can see that they involve only contravariant or only covariant parts of the generic type API. If we also remember the limitation that arises when using a contravariant type parameter (we can only use functions which consume that type parameter, meaning we are limited to the contravariant part of the API), we find that it allows us to establish a subtyping relation between contravariant generic types!

Specifically, if we have C <: B <: A, we have the following:

Holder<in C> :> Holder<in B> :> Holder<in A>

This is an example of a use-site variance – when you specify the type parameter variance at its use-site (other: Holder<in T>), and not at the declaration-site (class Holder<in T>). This makes it possible to view your invariant generic type as being co- or contravariant in different parts of your program. Additionally, we have the following:

Holder<in C> :> Holder<C>

This means we can substitute an invariant instance of a generic type to a contravariant position, in a sense, “dropping” its covariant parts and “keeping” only the contravariant ones. This is a way to move from an “invariant universe” of generic types to a “contravariant universe”, but not the other way around. Once you have a type projection on one of your type parameters, you cannot “unproject” it back to an invariant type parameter in a type-safe manner.

## Slide 20
- Type projection: out
- class Holder<T> (var value: T?) {
- ...
- fun steal(other: Holder<out T>) { value = other.pop() }
- }
- holderA.steal(holderB) // OK
- Type projection: other is a restricted (projected) generic. You can only call methods that return the type parameter T, which in this case means that you can only call pop().
- This is covariance:
- Nothing <: C <: B <: A <: Any
- Holder<Nothing> <: Holder<C> <: Holder<B> <: Holder<A> <: Holder<Any>

**[讲师备注]**
Once again, the covariant type projection rules mirror the rules for a contravariant one. 

Specifically, if we have C<:B <: A, we have the following:

Holder<out C> <: Holder<out B> <: Holder<out A>. 

We also have the following:

Holder<out C> :> Holder<C>.

With a covariant type projection, we can only use functions which produce that type parameter.

## Slide 21
- Type projections
- class Holder<T> (var value: T?) {
- fun steal(other: Holder<out T>) {
- val oldValue = push(other.pop())
- other.push(oldValue) // ERROR: Type mismatch. Required: Nothing?. Found: T?.
- }
- fun gift(other: Holder<in T>) {
- val otherValue = other.push(pop())
- push(otherValue) // ERROR: Type mismatch. Required: T?. Found: Any?.
- }
- }
- out T returns something that can be cast to T and accepts literally Nothing.
- in T accepts something that can be cast to T and returns a meaningless Any?.

**[讲师备注]**
If you attempt to use a co- or contravariant type projection in a way that violates its limitations, you will encounter compilation errors similar to those presented on the slide. They may seem somewhat cryptic (Nothing? Any?), but this can be solved easily by looking at variance.

A covariant type parameter <out T> means you can produce T, but you can consume nothing (something that has no values). In the Kotlin type system, there is a type for that: Nothing. This means we can view <out T> as being <out T in Nothing>, explicitly specifying what happens with the co- and contravariant parts of the generic type API. For a covariant type parameter, it remains the same type for its covariant positions and is replaced with Nothing for its contravariant positions.

A contravariant type parameter <in T> means you can consume T, but you can produce anything (something that can be any value in your program). In the Kotlin type system, there is a type for that as well: Any?. We can do the same and view <in T> as <out Any? in T>; for a contravariant type parameter, it remains the same for its contravariant positions and is replaced with Any? for its covariant positions.

The actual handling of variance is more complex, but this is a good enough framework for understanding most practical cases.

## Slide 22
- Type erasure
- At runtime, the instances of generic types do not hold any information about their actual type arguments. The type information is said to be erased. The same byte-code is used in all usages of the generic as opposed to C++, where each template is compiled separately for each type parameter provided.
- Any MutableMap<K, V> becomes MutableMap<*, *> in the runtime*.
- Any Pilot<T : Movable> becomes Pilot<Movable>.
- * Actually, in the Kotlin/JVM runtime we have just java.util.Map to preserve compatibility with Java.

**[讲师备注]**
If you are familiar with the way generics work on the JVM, then at this point you might be asking yourself, “What about type erasure?” When you write Java code and run it on the JVM, the actual type arguments are “erased” from the compiled program, and at runtime, when we work with List<Int> and List<String>, we actually use the same (“raw”) generic List without type arguments (and without any information about its type arguments from the source code).

In Kotlin we use the same approach, because the compiled Kotlin code still has to run on the JVM, and the generic type arguments are erased. This means that we cannot test for a generic type instance with a specific type argument. For example, if (o is List<String>) does not work, we do not have a way to know at runtime what the List’s type argument actually is.

References:
https://cr.openjdk.java.net/~briangoetz/valhalla/erasure.html
https://docs.oracle.com/javase/tutorial/java/generics/rawTypes.html

## Slide 23
- Type erasure
- As a corollary, you cannot override a function (in Kotlin/JVM) by changing generic type parameters:
- fun quickSort(collection: Collection<Int>) { ... }
- fun quickSort(collection: Collection<Double>) { ... }
- Both become quickSort(collection: Collection<*>) and their signatures clash.
- But you can use the JvmName annotation:
- @JvmName("quickSortInt")
- fun quickSort(collection: Collection<Int>) { ... }
- fun quickSort(collection: Collection<Double>) { ... }

**[讲师备注]**
Type erasure also means that on the JVM platform we cannot easily override a function using different generic type arguments. Both functions from the slide (valid and distinguishable from each other in Kotlin) will become the same function on the JVM platform (a function which accepts a raw Collection), and they will clash.

To work around this platform-specific feature, you can use a @JvmName annotation on one of the functions. This annotation changes the platform-specific name for its function, and the quickSort functions stop clashing (as they now have different names).

References:
https://kotlinlang.org/docs/java-to-kotlin-interop.html#handling-signature-clashes-with-jvmname

## Slide 24
- Nullability in generics
- Contrary to common sense, in Kotlin a type parameter specified as T can be nullable.
- class Holder<T>(val value: T) { ... } // Notice there is no `?`
- val holderA: Holder<A?> = Holder(null) // T = A? and that is OK
- To prohibit such behavior, you can use a non-nullable Any as a constraint.
- class Holder<T : Any>(val value: T) { ... }
- val holderA: Holder<A?> = Holder(null) // ERROR: Type argument is not within its bounds. Expected: Any. Found: A?.
- You may also find intersection helpful:
- fun <T> elvisLike(x: T, y: T & Any): T & Any = x ?: y
- T & Any is populated with all values from T besides null

**[讲师备注]**
Remembering what we said about nullability in Kotlin, you may think type parameters cannot be null, because they are not marked as such by a question mark. However, if you think about what a type parameter is (a placeholder for another type), there is no reason to limit it to a non-nullable type only. That is why a type parameter T can be filled by a nullable type (Holder<A?>).

If you want to restrict a type parameter to be non-nullable, you can say it belongs to the non-nullable universe of types by saying its upper bound (its supertype) is Any (which is the universal supertype for all non-nullable types). For such type parameters, it is a compile-time error to fill them with nullable types. 

Alternatively, if you need to make a type parameter non-nullable when it is used as a type inside a generic declaration (for example, as a function parameter), but cannot make the type parameter itself non-nullable, you may use the definitely non-null type T & Any.

References:
https://github.com/Kotlin/KEEP/issues/268

## Slide 25
- Inline functions
- If they are used as first-class objects, functions are stored as objects, thus requiring memory allocations, which introduce runtime overhead.
- fun foo(str: String, call: (String) -> Unit) {
- call(str)
- }
- fun main() {
- foo("Top level function with lambda example") { print(it) }
- }

**[讲师备注]**
Turning to a different topic, let’s talk about inline functions, which (somewhat surprisingly) have some interesting interactions with generics.

In Kotlin, functions are first-class objects, meaning you can work with them just the same as you would with other objects in your program. For example, you can declare a function that takes another function as an argument and calls it, saves it to a property, or passes it further into the code.

When you call such functions, you may pass a lambda expression as a function type argument, which, in some sense, creates an anonymous function to use in this case. However, such anonymous functions are represented as special objects at runtime, which introduces some amount of overhead on every call, (as you need to allocate memory for this object, initialize it, etc.).

Again, the actual rules of how lambdas are represented at runtime are more complicated than what we’re describing here, but they are good enough for most regular Kotlin code. 

References:
https://kotlinlang.org/docs/lambdas.html

## Slide 26
- Inline functions
- fun foo(str: String, call: (String) -> Unit) {
- call(str)
- }
- public static final void foo(@NotNull String str, @NotNull Function1 call) {
- Intrinsics.checkNotNullParameter(str, "str");
- Intrinsics.checkNotNullParameter(call, "call");
- call.invoke(str);
- }
- public static final void main() {
- foo("Top level function with lambda example", (Function1)foo$call$lambda$1.INSTANCE);
- }
- This call invokes the print function by passing the string as an argument.

**[讲师备注]**
If we take a look at how the code from the previous slide is compiled to Java-like code, we’ll see how a simple lambda is represented and used.

First, as this lambda is pure (does not store any internal state and does not read any external state), its function object is stored as a static INSTANCE and reused between different invocations. Second, this function object provides an invoke method, which takes a String as an argument and returns void, mirroring the lambda function type (String) -> Unit.

## Slide 27
- Inline functions
- public static final void foo(@NotNull String str, @NotNull Function1 call) {
- Intrinsics.checkNotNullParameter(str, "str");
- Intrinsics.checkNotNullParameter(call, "call");
- call.invoke(str);
- }
- “Under the hood” an instance of a Function class is created, i.e. allocated:
- foo("...", new Function() {
- @Override
- public void invoke() {
- ...
- }
- });

**[讲师备注]**
If our lambda was non-pure or the compiler decided not to reuse its object between calls, the result would be the creation of a new function object on every call to foo. Can we do something to avoid this overhead?

## Slide 28
- Inline functions
- We can use the inline keyword to inline the function, copying its code to the call site:
- inline fun foo(str: String, call: (String) -> Unit) {
- call(str)
- }
- fun main() {
- foo("Top level function with lambda example", ::print)
- }
- public static final void main() {
- String str$iv = "Top level function with lambda example";
- int $i$f$foo = false;
- int var3 = false;
- System.out.print(str$iv);
- }

**[讲师备注]**
Well, considering we know what function foo does and what lambda we pass to it as an argument and then call, we could copy-paste everything on the call site, merging the function and lambda bodies together in a single block of code, avoiding the overhead. This is called “inlining”, and you could do it manually. Luckily, you don’t have to! Kotlin supports inline functions: functions that are automatically inlined on their call sites, mainly for the specific purpose of avoiding the overhead from lambda creation.

The `$i$f$foo` notation we use when talking about inline functions is an approximate representation of how the JVM bytecode is generated for the discussed cases. The exact details of what happens on the JVM level fall outside the scope of this lecture.

References:
https://kotlinlang.org/docs/inline-functions.html
https://en.wikipedia.org/wiki/Inline_expansion

## Slide 29
- Inline functions
- inline affects not only the function itself, but also all the lambdas passed as arguments.
- If you do not want some of the lambdas passed to an inline function to be inlined (for example, inlining large functions is not recommended), you can mark some of the function parameters with the noinline modifier.
- inline fun foo(str: String, call1: (String) -> Unit, noinline call2: (String) -> Unit) {
- call1(str) // Will be inlined
- call2(str) // Will not be inlined
- }

**[讲师备注]**
When inlining a function, the Kotlin compiler “fuses” the function body together with all lambdas passed as arguments by default. As such, lambdas effectively disappear as program values (there are no function objects to pass around), and we cannot store them in properties, return them from functions, or pass them as non-inline arguments to other functions.

If you would like to avoid inlining a function type argument (for example, because you need to store it and call it later), you can mark it as noinline. This signals to the compiler that lambdas passed to this argument should not be inlined. As they will be represented as function objects, you can work with them as with any other objects in your program.

References:
https://kotlinlang.org/docs/inline-functions.html#noinline

## Slide 30
- Inline functions
- You can use return in inlined lambdas, this is called non-local return, which can lead to unexpected behaviour:
- inline fun foo(call1: () -> Unit, call2: () -> Unit) {
- call1()
- call2()
- }
- fun main() {
- println("Step#1")
- foo({ println("Step#2")
- return },
- { println("Step#3") })
- println("Step#4")
- }
- -> Output:
- Step#1
- Step#2

**[讲师备注]**
As inline lambdas are inlined (as the name implies), Kotlin supports a feature called “non-local return”: if you use an unlabeled return in an inline lambda (which are forbidden in regular lambdas), you will return not from the lambda, but rather from the outer function declaration in which the lambda is used. For the example on this slide, the return in the lambda passed to function foo will cause the program to return from the lambda’s outer function declaration main, and it will print only “Step#1” and “Step#2” when executed.

This may seem somewhat confusing, as labeled returns in lambas work “as expected” and return from the lambda itself. Here’s a good rule for remembering and understanding this: A simple unlabeled return always returns from its enclosing function declaration. 

References:
https://kotlinlang.org/docs/inline-functions.html#non-local-returns
https://kotlinlang.org/docs/returns.html#return-to-labels

## Slide 31
- Inline functions
- To prohibit returning from the lambda expression we can mark the lambda as crossinline.
- inline fun foo(crossinline call1: () -> Unit, call2: () -> Unit) {
- call1()
- call2()
- }
- fun main() {
- println("Step#1")
- foo({ println("Step#2")
- return }, // ERROR: 'return' is not allowed here
- { println("Step#3") })
- println("Step#4")
- }
- return@foo  is allowed and fine, though

**[讲师备注]**
noinline lambdas do not support non-local returns, but they are also not inlined. If you want to have a lambda that is inlined but for which non-local returns should be forbidden, you can mark it as crossinline. For such lambdas, an unlabeled return results in a compile-time error.

## Slide 32
- Inline functions
- crossinline is especially useful when the lambda from an inline function is being called from another context, for example, if it is used to instantiate a Runnable:
- inline fun drive(crossinline specialCall: (String) -> Unit, call: (String) -> Unit) {
- val nightCall = Runnable { specialCall("There's something inside you") }
- call("I'm giving you a nightcall to tell you how I feel")
- thread { nightCall.run() }
- call("I'm gonna drive you through the night, down the hills")
- }
- fun main() {
- drive({ System.err.println(it) }) { println(it) }
- }

**[讲师备注]**
crossinline lambdas are used if the lambda is not directly called inside an inline function, but is instead captured and called from a nested scope. For example, if it is used inside a Runnable instance created and used in a function. 

We can still inline such lambdas to the scope in which they are used, but it is impossible to preserve the non-local returns. That is why we need a separate crossinline modifier.

## Slide 33
- Inline reified functions
- Sometimes you need to access a type passed as a parameter:
- fun <T: Animal> foo() {
- println(T::class) // ERROR: Cannot use 'T' as reified type parameter. Use a class instead —--> add a param: t: KClass<T>
- }
- You can use the reified keyword with inline functions:
- inline fun <reified T: Animal> foo() {
- println(T::class) // OK
- }
- Note that the compiler has to be able to know the actual type passed as a type argument so that it can modify the generated bytecode to use the corresponding class directly.

**[讲师备注]**
Now let’s talk about how inline functions and generics work together. Since inline functions are inlined at their call sites, for every generic function call that is inlined we could record and propagate the actual type arguments to the inlined bodies. If we do that, we could in some sense “unerase” such type parameters and use them as known types inside the function body. For example, we could explore their structure via T::class.

To enable this feature, we just need to mark the type parameter of an inline function as reified. This hints to the compiler that it needs to propagate the type arguments from call sites to support using them inside the function directly. Additionally, it also requires the type arguments used as reified type parameters to be known at runtime (for example, a concrete Kotlin type or another reified type parameter); if a type is unknown (for example, a non-reified type parameter that is erased at runtime), it cannot be used as a reified type parameter.

References:
https://kotlinlang.org/docs/inline-functions.html#reified-type-parameters

## Slide 34
- open class A
- class B : A()
- class C : A() { fun consume(other: A): C = this }
- fun <T, S : R, R> funny(
- source: Iterator<????>,
- target: MutableCollection<????>,
- base: ????,
- how: ????
- ) {
- var result: R = base
- for (value in source) {
- result = how(result, value)
- target.add(result)
- }
- }
- fun main() {
- val wtf = mutableListOf<A>()
- val src = mapOf(3.14 to B(), 2 to B(), "Hello" to B())
- val c = C()
- funny(src.values.iterator(), wtf, c) { r, t -> r.consume(t) }
- }

**[讲师备注]**
Here’s a puzzle: Try to fill in the gaps with type parameters so that the code is correct!

## Slide 35
- (in)Variance
- class Holder<T>(val value: T) { ... }
- open class A
- open class B : A()
- class C : B()
- A hierarchy is in place (and don’t forget about the same hierarchy with nullability):
- Nothing -> C -> B -> A -> Any
- Variance of Generics would give us another hierarchy:
- Holder<Nothing> -> Holder<C> -> Holder<B> -> Holder<A> -> Holder<Any>
- But this is not the case, since Generics are invariant.
- val holderC = Holder(C())
- val holderB: Holder<B> = holderC // Error: Type mismatch. Required: Holder<B>. Found: Holder<C>.
- NB: code below works, since C() passed as an argument is being cast to B, nothing to do with variance.val kotlinIsSmart: Holder<B> = Holder(C())

## Slide 36
- More
- class Holder<T> (var value: T?) {
- fun pop(): T? = value.also { value = null }
- fun push(newValue: T?): T? = value.also { value = newValue }
- fun steal(other: Holder<T>) { value = other.pop() }
- fun gift(other: Holder<T>) { other.push(pop()) }
- }
- val holderB: Holder<B> = Holder(B())
- val holderA: Holder<A> = Holder(null)
- holderA.steal(holderB) // Error: Type mismatch. Required: Holder<A>. Found: Holder<B>.
- holderB.gift(holderA) // Error: Type mismatch. Required: Holder<B>. Found: Holder<A>.
- But why not? B can be easily cast to A inside steal or gift and everything should be fine.

## Slide 37
- Thanks!
- @kotlin
- |  Developed by JetBrains


--- 统计: 37 页, 34 页含讲师备注