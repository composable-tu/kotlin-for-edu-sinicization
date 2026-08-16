# Functional Programming

共 37 页

## Slide 1
- Functional
- Programming
- Kotlin
- @kotlin
- |  Developed by JetBrains

**[讲师备注]**
Today's topic is functional programming, one of the programming styles supported in Kotlin.

## Slide 2
- What is it?
- VS
- We are already familiar with object-oriented programming (OOP), but Kotlin also borrows concepts from functional programming (FP). FP is a programming paradigm where programs are constructed by applying and composing functions.
- var sum = 0
- for (item in list) {
- if (item > 0) {
- sum += item * item
- }
- }
- list.filter { it > 0 }.map { it * it }.sum()

**[讲师备注]**
Consider these two pieces of code for calculating the sum of positive elements in a particular collection. The execution instructions in the piece on the left have an imperative structure. 
But in Kotlin, we can also declare a sequence of transformations to achieve the same result.

## Slide 3
- Our approach
- FP, like other concepts, has its advantages and disadvantages, but we will focus on its strengths.
- Disclaimer: There won’t be any deep math or Haskell examples in this lecture. We will look at what we consider to be the most important FP features that can be used in Kotlin

**[讲师备注]**
In this lesson, we will only focus on the positive elements of the functional programming style applied in Kotlin.

## Slide 4
- We already know that…
- In Kotlin you can pass functions as the arguments of other functions:fun foo(bar: () -> Unit): Unit { ... }
- If a function’s last argument is a function, then it can be put outside the parentheses:fun baz(start: Int, end: Int, step: (Int) -> Unit): Unit { ... }baz(23, 42) { println("Magnificent!") }
- If a function’s only argument is a function, then parentheses can be omitted altogether:foo { println("Kotlin keeps on giving!") }

**[讲师备注]**
What language features enable us to do this?
First of all, there is the ability to use a function type as a parameter. Typical values that can be passed this way are lambdas, anonymous functions, and function references. The next feature is a improves the syntax for cases: Instead of writing the lambda inside the parentheses of the function call, we leave it outside of them.
And the parentheses can be omitted if no other parameters are passed.

## Slide 5
- Lambdas can be assigned to vals and reassigned in vars:
- var lambda1: (Int) -> Double = { r -> r * 6.28 }
- val lambda2 = { d: Int -> 3.14 * d.toDouble().pow(2) }
- lambda1 = lambda2
- Lambda expressions can be replaced with function syntax:
- val sum = fun(a: Int, b: Int): Int = a + b	val sum2 = { a:Int, b: Int -> a + b }
- Declaring functions inside functions is allowed:
- fun global() {	fun local() { ... }
- ...	local()
- ...}
- We already know that…

**[讲师备注]**
Instances of function types do not differ a lot from plain functions. We can store and change them in variables.
But instead of creating a variable initialized by a lambda, we also can declare a local named function in any block of code.

## Slide 6
- Higher order functions (HOFs)
- Functions that take other functions as arguments are called higher order functions.
- In Kotlin you frequently encounter them when working with collections:
- list.partition { it % 2 == 0 }  OR  list.partition { x -> x % 2 == 0 }
- Everything Kotlin allows you do with functions, which means that “functions in Kotlin are first-class citizens.”

**[讲师备注]**
https://kotlinlang.org/docs/lambdas.html#higher-order-functions

## Slide 7
- In functional programming, functions are designed to be pure. In simple terms, this means they cannot have a state. Loops have an iterator index, which is a state, so say goodbye to conventional loops.
- fun sumIter(term: (Double) -> Double, a: Double, next: (Double) -> Double, b: Double): Double {
- fun iter(a: Double, acc: Double): Double = if (a > b) acc else iter(next(a), acc + term(a))
- return iter(a, 0.0)
- }
- fun integral(f: (Double) -> Double, a: Double, b: Double, dx: Double): Double {
- fun addDx(x: Double) = x + dx
- return dx * sumIter(f, (a + (dx / 2.0)), ::addDx, b)
- }
- (This is a LISP program transcribed to Kotlin; nobody actually writes like this)
- Higher order functions (HOFs)

**[讲师备注]**
All functions in what is called “pure FP” are considered functions in the mathematical sense; they must neither mutate the state of the program nor have their own. Here is an example of a program rewritten from LISP, one of the first purely functional programming languages. As we see, there are no mutable variables, and even loops are replaced with recursion. The code in this example is pretty unconventional by typical Kotlin standards.

## Slide 8
- Often in the context of FP it is necessary to operate with the following functions: map, filter, and fold.
- map allows us to perform a function over each element in a collection:
- val list = listOf(1, 2, 3)
- list.map { it * it } // [1, 4, 9]
- Higher order functions (HOFs)

**[讲师备注]**
One group of frequently used higher-order functions in particular comes to mind when talking about functional style in Kotlin. Let’s start with the map function. 
As the name suggests, it transforms the source collection by applying a user-provided function. 

https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html

## Slide 9
- Often in the context of FP it is necessary to operate with the following functions: map, filter, and fold.
- map allows us to perform a function over each element in a collection.
- val list = listOf(1, 2, 3)
- list.map { it * it } // [1, 4, 9]
- Higher order functions (HOFs)
- What is the main difference between map and forEach?

**[讲师备注]**
Here is a question. What is the main difference between map and forEach?

The answer is that, as you see, map returns a list where each element results from transforming the source collection, while forEach returns just a  unit.

## Slide 10
- You can compose the functions to perform both operations:
- val list = listOf(1, 2, 3)
- list.map { it * it }.map { it + 1 } // [2, 5, 10]
- list.map { it * it + 1 } // [2, 5, 10]
- Higher order functions (HOFs)
- NB: to compose complex functions by default you can use sequences, but be careful.
- x
- x * x
- x + 1
- x * x and x + 1
- x * x + 1

**[讲师备注]**
Since map is an extension function, a chain of calls can be created to compose multiple transformations.

## Slide 11
- filter returns a list containing only elements that match a given predicate:
- val list = listOf(1, 2, 3)
- list.filter { it % 2 == 0 } // [2]
- Higher order functions (HOFs)

**[讲师备注]**
https://kotlinlang.org/docs/collection-filtering.html

## Slide 12
- Our third important function, fold, creates a mutable accumulator, which is updated on each round of the for and returns one value:
- val list = listOf(1, 2, 3)
- list.fold(0) { acc, x -> acc + x } // 6
- You can implement the fold function for any type, for example, you can fold a tree into a string representation.
- Higher order functions (HOFs)

**[讲师备注]**
https://kotlinlang.org/docs/collection-aggregate.html

## Slide 13
- There are also right and left folds. They are equivalent if the operation is associative: (a ○ b) ○ c = a ○ (b ○ c), but in any other case they yield different results.
- val list = listOf(1, 2, 3)
- list.fold(0) { acc, x -> acc + x } 	// (((0 + 1) + 2) + 3) = 6
- list.foldRight(0) { x, acc -> acc + x } // (1 + (2 + (3 + 0))) = 6
- "PWND".fold("") { acc, x -> "${acc}${acc}$x" } 		// PPWPPWNPPWPPWND
- "PWND".foldRight("") { x, acc -> "${acc}${acc}$x" } 	// DDNDDNWDDNDDNWP
- Be careful with the order of your lambdas’ arguments:
- list.fold(0) { acc, x -> acc - x } // (((0 - 1) - 2) - 3) = -6
- list.foldRight(0) { x, acc -> acc - x } // (-1 + (-2 + (0 - 3))) = -6
- list.foldRight(0) { acc, x -> acc - x } // (1 - (2 - (3 - 0))) = 2
- Higher order functions (HOFs)

## Slide 14
- val string = """
- One-one was a race horse.
- Two-two was one too.
- One-one won one race.
- Two-two won one too.
- """.trimIndent()
- val result = string
- .split(" ", "-", ".", System.lineSeparator())
- .filter { it.isNotEmpty() }
- .map { it.lowercase() }
- .groupingBy { it }
- .eachCount()
- .toList()
- .sortedBy { (_, count) -> count }
- .reversed()
- Higher order functions (HOFs)

**[讲师备注]**
Let’s trace a more complex chain of collection functions.

## Slide 15
- val string = """
- One-one was a race horse.
- Two-two was one too.
- One-one won one race.
- Two-two won one too.
- """.trimIndent()
- val result = string
- .split(" ", "-", ".", System.lineSeparator())
- Higher order functions (HOFs)
- [One, one, was, a, race, horse, , Two, two, was, one, too, , One, one, won, one, race, , Two, two, won, one, too, , ]

**[讲师备注]**
First, the string is tokenized into words by splitting it with whitespace and line separator delimiters. The intermediary result is a list of strings.

## Slide 16
- [One, one, was, a, race, horse, Two, two, was, one, too, One, one, won, one, race, Two, two, won, one, too]
- val string = """
- One-one was a race horse.
- Two-two was one too.
- One-one won one race.
- Two-two won one too.
- """.trimIndent()
- val result = string
- .split(" ", "-", ".", System.lineSeparator())
- .filter { it.isNotEmpty() }
- Higher order functions (HOFs)

**[讲师备注]**
Then we use filter to discard the empty strings.

## Slide 17
- [one, one, was, a, race, horse, two, two, was, one, too, one, one, won, one, race, two, two, won, one, too]
- val string = """
- One-one was a race horse.
- Two-two was one too.
- One-one won one race.
- Two-two won one too.
- """.trimIndent()
- val result = string
- .split(" ", "-", ".", System.lineSeparator())
- .filter { it.isNotEmpty() }
- .map { it.lowercase() }
- Higher order functions (HOFs)

**[讲师备注]**
Next we convert all the strings to lowercase. The intermediary collection is a list of strings, too.

## Slide 18
- {one=7, was=2, a=1, race=2, horse=1, two=4, too=2, won=2}
- OR
- string
- .split(...)
- .filter { it.isNotEmpty() }
- .groupBy({ it.lowercase() }, { it })
- .mapValues { (key, value) ->
- value.size
- }
- val string = """
- One-one was a race horse.
- Two-two was one too.
- One-one won one race.
- Two-two won one too.
- """.trimIndent()
- val result = string
- .split(" ", "-", ".", System.lineSeparator())
- .filter { it.isNotEmpty() }
- .map { it.lowercase() }
- .groupingBy { it }
- .eachCount()
- Higher order functions (HOFs)

**[讲师备注]**
Each step of such chains can be written in dozens of ways. In this example we can either use a grouping structure with the built-in counting extension or do it manually by taking a map and calculating the count ourselves. https://kotlinlang.org/docs/collection-grouping.html

## Slide 19
- [(one, 7), (was, 2), (a, 1), (race, 2), (horse, 1), (two, 4), (too, 2), (won, 2)]
- val string = """
- One-one was a race horse.
- Two-two was one too.
- One-one won one race.
- Two-two won one too.
- """.trimIndent()
- val result = string
- .split(" ", "-", ".", System.lineSeparator())
- .filter { it.isNotEmpty() }
- .map { it.lowercase() }
- .groupingBy { it }
- .eachCount()
- .toList()
- Higher order functions (HOFs)

**[讲师备注]**
And the final operation of this conversion is converting a Map of counts to a list.

## Slide 20
- [(a, 1), (horse, 1), (was, 2), (race, 2), (too, 2), (won, 2), (two, 4), (one, 7)]
- val string = """
- One-one was a race horse.
- Two-two was one too.
- One-one won one race.
- Two-two won one too.
- """.trimIndent()
- val result = string
- .split(" ", "-", ".", System.lineSeparator())
- .filter { it.isNotEmpty() }
- .map { it.lowercase() }
- .groupingBy { it }
- .eachCount()
- .toList()
- .sortedBy { (_, count) -> count }
- Higher order functions (HOFs)

**[讲师备注]**
Because we have a list, we can also get a sorted copy. We can choose a comparable attribute of the list’s element to sort by. In our example, we use the second value in the pair consisting of a word and its count.

## Slide 21
- [(one, 7), (two, 4), (won, 2), (too, 2), (race, 2), (was, 2), (horse, 1), (a, 1)]
- OR
- OR
- string
- .allFunnyFuncs(...)
- .toList()
- .sortedWith { l, r ->
- r.second - l.second
- }
- string
- .allFunnyFuncs(...)
- .toList()
- .sortedByDescending { (_, c) ->
- c
- }
- val string = """
- One-one was a race horse.
- Two-two was one too.
- One-one won one race.
- Two-two won one too.
- """.trimIndent()
- val result = string
- .split(" ", "-", ".", System.lineSeparator())
- .filter { it.isNotEmpty() }
- .map { it.lowercase() }
- .groupingBy { it }
- .eachCount()
- .toList()
- .sortedBy { (_, count) -> count }
- .reversed()
- Higher order functions (HOFs)

**[讲师备注]**
To achieve reversed order, we can reverse a list sorted in ascending order, request to sort in descending order, or compare by the difference of two numbers swapped.

## Slide 22
- Lambdas are not the only functions that can be passed as arguments to functions expecting other functions, as references to already defined functions can be as well:
- fun isEven(x: Int) = x % 2 == 0
- val isEvenLambda = { x: Int -> x % 2 == 0 }
- Same results, different calls:
- list.partition { it % 2 == 0 }
- list.partition(::isEven) // function reference
- list.partition(isEvenLambda)  // pass lambda by name
- Higher order functions (HOFs)

**[讲师备注]**
Because HOFs in Kotlin take arbitrary instances of function types, instead of lambdas we can pass function references and lambdas stored in variables.

## Slide 23
- Lazy computations
- Consider the following code:
- fun <F> withFunction(
- number: Int, even: F, odd: F
- ): F = when (number % 2) {
- 0 -> even
- else -> odd
- }
- withFunction(4, println("even"), println("odd"))
- What will be printed to the console?

**[讲师备注]**
In this snippet, we take a number and two values: The first value is returned if the number is even, and the second one is returned if the number is odd. Then we pass four and call printing functions for both cases.

## Slide 24
- even odd
- Arguments of the withFunction function will be evaluated before its body is executed (eager execution).
- Consider the following code:
- fun <F> withFunction(
- number: Int, even: F, odd: F
- ): F = when (number % 2) {
- 0 -> even
- else -> odd
- }
- withFunction(4, println("even"), println("odd"))
- What will be printed into console?
- Lazy computations

**[讲师备注]**
Actually, this code prints both strings. Why? Because in imperative programming, all passed arguments are evaluated before the function is executed, like ingredients being gathered and measured before cooking. Both println calls are already made before checking the parity of four.

## Slide 25
- Lazy Deferred computations
- Consider the following code:
- fun <F> withLambda(
- number: Int, even: () -> F, odd: () -> F
- ): F = when (number % 2) {
- 0 -> even()
- else -> odd()
- }
- withLambda(4, { println("even") }, { println("odd") })
- It will print just even into the console because of the lazy deferred computations.

**[讲师备注]**
On the level of the language itself, Kotlin does not compute values lazily, but replacing the immediate calls with deferred ones by wrapping them into lambdas leads to the expected result.

## Slide 26
- Operator overloading
- class A<T>
- operator fun <T> A<T>.iterator(): Iterator<T> = TODO("Not yet implemented")
- VS
- Kotlin has extension functions that you can use to override operators, for example the iterator. That is, you do not need to create a new entity that inherits from the Iterable interface, as you would in OOP code.
- class MyIterable<T> : Iterable<T> { // you need access to the sources of MyIterable
- override fun iterator(): Iterator<T> {
- TODO("Not yet implemented")
- }
- }

**[讲师备注]**
The operator modifier is required in order for us to use our class in for loops as if it had a built-in
val aInstance = A<Int>()
for (value in aInstance) {
   // do something with the value
}

## Slide 27
- One last thing…
- Is this code correct?
- enum class Color {
- WHITE,
- AZURE,
- HONEYDEW
- }
- fun Color.getRGB() = when (this) {
- Color.WHITE -> "#FFFFFF"
- Color.AZURE -> "#F0FFFF"
- Color.HONEYDEW -> "F0FFF0"
- }

**[讲师备注]**
Lastly, let’s address how to handle data in a functional way. In full-fledged FP languages, the exhaustiveness of conditional expressions (comparable to Kotlin’s when) is checked. But is that how it works in Kotlin?

## Slide 28
- Is this code correct? Yes, because the compiler knows all of the possible values.
- enum class Color {
- WHITE,
- AZURE,
- HONEYDEW
- }
- fun Color.getRGB() = when (this) {
- Color.WHITE -> "#FFFFFF"
- Color.AZURE -> "#F0FFFF"
- Color.HONEYDEW -> "F0FFF0"
- }
- One last thing…

**[讲师备注]**
Yes. In this example, we have an enum class, and the compiler knows that there are no possible instances of it except the ones defined constantly. So, if our when (in any order and combination) handles each of the three values, we don’t need an else clause because it would never be applicable.

## Slide 29
- What is about this example?
- sealed class Color
- class WhiteColor: Color()
- class AzureColor: Color()
- class HoneydewColor: Color()
- fun Color.getRGB() = when (this) {
- is WhiteColor -> "#FFFFFF"
- is AzureColor -> "#F0FFFF"
- is HoneydewColor -> "F0FFF0"
- }
- One last thing…

**[讲师备注]**
But in Kotlin we also have sealed classes and interfaces. Their subclasses are limited to those defined in the same module with their parent. Are these subclasses subject to the same effect that applies to enums?

## Slide 30
- What about this example? Once again, the answer is yes, because the compiler knows about all possible children of the Color class at the compilation stage and no new classes can appear.
- sealed class Color
- class WhiteColor: Color()
- class AzureColor: Color()
- class HoneydewColor: Color()
- fun Color.getRGB() = when (this) {
- is WhiteColor -> "#FFFFFF"
- is AzureColor -> "#F0FFFF"
- is HoneydewColor -> "F0FFF0"
- }
- One last thing…

**[讲师备注]**
All possible child classes are being checked to see whether it’s necessary to include the “else” clause in the “when” expression.

## Slide 31
- Consider the following code:
- sealed class Color
- class WhiteColor(val name: String): Color()
- class AzureColor(val name: String): Color()
- class HoneydewColor(val name: String): Color()
- We have the common part in all classes and we know that these are the only possible subclasses. Let’s move this code into the base class.
- One last thing…

**[讲师备注]**
Let’s look at the code on this slide and see if we can’t improve it a bit. In each of the color classes we have a property name of the same type.

## Slide 32
- sealed class Color
- class WhiteColor(val name: String): Color()
- class AzureColor(val name: String): Color()
- class HoneydewColor(val name: String): Color()
- sealed class NewColor(val name: String)
- class WhiteColor(name: String): NewColor(name)
- class AzureColor(name: String): NewColor(name)
- class HoneydewColor(name: String): NewColor(name)
- Actually, we have equivalent classes, i.e. each function for the first version can be rewritten as the second one.
- One last thing…

**[讲师备注]**
As a result, the interface of each of our classes has become the same.

## Slide 33
- sealed class Color
- class WhiteColor(val name: String): Color()
- class AzureColor(val name: String): Color()
- class HoneydewColor(val name: String): Color()
- sealed class NewColor(val name: String)
- class WhiteColor(name: String): NewColor(name)
- class AzureColor(name: String): NewColor(name)
- class HoneydewColor(name: String): NewColor(name)
- One last thing…
- In the first function, we have smart casts, but in the second one we don't have them.
- fun Color.getUserRGB() = when (this) {
- is WhiteColor -> "${this.name}: #FFFFFF"
- is AzureColor -> "${this.name}: #F0FFFF"
- is HoneydewColor -> "${this.name}: F0FFF0"
- }
- fun NewColor.getUserRGB() = when (this) {
- is WhiteColor -> "${this.name}: #FFFFFF"
- is AzureColor -> "${this.name}: #F0FFFF"
- is HoneydewColor -> "${this.name}: F0FFF0"
- }

**[讲师备注]**
Now let’s take a more detailed look. In the function above, the name property becomes available only when this gets casted to each of the subclasses. But when we make the interface the same, the name becomes available for all instances of NewColor without information about the exact inheritor.

## Slide 34
- Math time! We can actually rewrite this in math terms:
- WhiteColor * String + … + HoneydewColor * String ≃ String * (WhiteColor + … + HoneydewColor)
- sealed class Color
- class WhiteColor(val name: String): Color()
- class AzureColor(val name: String): Color()
- class HoneydewColor(val name: String): Color()
- sealed class NewColor(val name: String)
- class WhiteColor(name: String): NewColor(name)
- class AzureColor(name: String): NewColor(name)
- class HoneydewColor(name: String): NewColor(name)
- One last thing…
- fun Color.getUserRGB() = when (this) {
- is WhiteColor -> "${this.name}: #FFFFFF"
- is AzureColor -> "${this.name}: #F0FFFF"
- is HoneydewColor -> "${this.name}: F0FFF0"
- }
- fun NewColor.getUserRGB() = when (this) {
- is WhiteColor -> "${this.name}: #FFFFFF"
- is AzureColor -> "${this.name}: #F0FFFF"
- is HoneydewColor -> "${this.name}: F0FFF0"
- }

**[讲师备注]**
Actually, there is a correspondence between certain types and certain math operations.

## Slide 35
- Math time! We can actually rewrite this in math terms:
- WhiteColor * String + … + HoneydewColor * String ≃ String * (WhiteColor + … + HoneydewColor)
- This is possible because we are actually operating with algebraic data types* and can use their properties.
- *This is not entirely true, but for most cases with sealed classes it works.
- One last thing…

**[讲师备注]**
Functional programmers always tell everyone about algebraic types. If we consider sealed classes as sums of their subclasses and classes with a property as products of a discriminator and value, we can do algebra on these types. Kotlin doesn’t implement these principles thoroughly, but it does implement them enough for practical usage.

## Slide 36
- Final thought
- FP in Kotlin does not kill OOP. Each of the concepts brings its own advantages and disadvantages, and it is important to combine them in order to get concise, readable and understandable code!
- If you are interested in the topic of FP in Kotlin for a more detailed study, come here: https://arrow-kt.io/

**[讲师备注]**
After seeing the first slide with monkeys, you might think that FP is a more advanced and idiomatic programming style to use in Kotlin. 
But this isn’t the case. In reality, you should combine styles within your program to achieve the best results. 
You can use the Arrow project to increase the share of functional-style code in your project.

## Slide 37
- Thanks!
- @kotlin
- |  Developed by JetBrains


--- 统计: 37 页, 35 页含讲师备注