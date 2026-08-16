# Introduction to Kotlin

共 26 页

## Slide 1
- Kotlin
- Introduction
- to Kotlin
- @kotlin
- |  Developed by JetBrains

## Slide 2
- Why Kotlin?
- Expressiveness/Conciseness
- Safety
- Portability/Compatibility
- Convenience
- High Quality IDE Support
- Community
- Android 👀
- More than a gazillion devices run Java Kotlin
- Lactose free
- Sugar free
- Gluten free

## Slide 3
- Logo

## Slide 4
- Name
- Kotlin is named after an island in the Gulf of Finland.

**[讲师备注]**
See Kotlin island on Google Maps :)

## Slide 5
- Hello, world!
- fun main(args: Array<String>) {
- println("Hello, world!")
- }
- fun main() {
- println("Hello, world!")
- }
- fun main() = println("Hello, world!")
- Where is “;”???

**[讲师备注]**
Semicolons are not mandatory nor prohibited. An expression can end with a semicolon, but it does not need to if it is separated from the next expression with a new line symbol.

## Slide 6
- The basics
- fun main(args: Array<String>) {
- print("Hello")
- println(", world!")
- }
- An entry point of a Kotlin application is the main top-level function.
- It accepts a variable number of String arguments that can be omitted.
- print prints its argument to the standard output.
- println prints its arguments and adds a line break.

**[讲师备注]**
See the docs for more on the program entry point.The next several slides cover the “Basic syntax” section of Kotlin docs.

## Slide 7
- Variables
- val/var myValue: Type = someValue
- var - mutable
- val - immutable
- Type can be inferred in most cases
- Assignment can be deferred
- val a: Int = 1	// immediate assignment
- var b = 2		// 'Int' type is inferred
- b = a 			// Reassigning to 'var' is okay
- val c: Int		// Type required when no initializer is provided
- c = 3			// Deferred assignment
- a = 4			// Error: Val cannot be reassigned

**[讲师备注]**
See the docs for more on variables.
Deferred variables SHOULD BE ASSIGNED before being used. However, the full description of how to use deferred assignment is rather complex, so it’s recommended that you don’t use it unless you need to.

Also, don’t confuse mutable variables and mutable values. A mutable variable lets you assign another value to it. A mutable value lets you mutate the variable’s value preserving the variable’s reference to the value.

## Slide 8
- Variables
- const val/val myValue: Type = someValue
- const val - compile-time const value
- val - immutable value
- for const val use uppercase for naming
- const val NAME = "Kotlin"	// can be calculated at compile-time
- val nameLowered = NAME.lowercase()	 // cannot be calculated at compile-time

**[讲师备注]**
See the docs for more on Properties.

## Slide 9
- Functions
- fun sum(a: Int, b: Int): Int {
- return a + b
- }
- fun mul(a: Int, b: Int) = a * b
- fun printMul(a: Int, b: Int): Unit {
- println(mul(a, b))
- }
- fun printMul1(a: Int = 1, b: Int) {
- println(mul(a, b))
- }
- fun printMul2(a: Int, b: Int = 1) = println(mul(a, b))
- Single expression function.
- Unit means that the function does not return anything meaningful.
- It can be omitted.
- Arguments can have default values.

**[讲师备注]**
See the docs for more on functions: here and here.

## Slide 10
- If expression
- fun maxOf(a: Int, b: Int) =
- if (a > b) {
- a
- } else {
- b
- }
- is the same as
- fun maxOf(a: Int, b: Int): Int {
- if (a > b) {
- return a
- } else {
- return b
- }
- }
- if can be an expression (it can return).
- Can be a one-liner:
- fun maxOf(a: Int, b: Int) = if (a > b) a else b

**[讲师备注]**
See the docs for more on conditional expressions and if.

## Slide 11
- When expression
- when (x) {
- 1 -> print("x == 1")
- 2 -> print("x == 2")
- else -> {
- print("x is neither 1 nor 2")
- }
- }
- when returns, the same way that if does.
- when {
- x < 0 -> print("x < 0")
- x > 0 -> print("x > 0")
- else -> {
- print("x == 0")
- }
- }
- The condition can be inside of the branches.

**[讲师备注]**
See the docs for more on when.

when evaluates the first suitable branch (if one exists). But beware of non-pure branch conditions, which when computes lazily. To be more precise, when consecutively evaluates branch conditions and, as soon as it finds the first branch condition that returns true, the when block starts evaluating the branch body. Thus, the when block evaluates all conditions up to and including the condition of the branch that will be evaluated (which also is the first condition that has a value of true), but no further conditions. It works this way because each when block is equivalent to consecutive if-else blocks. 

For example,when (15 as Number) {
	1 -> doFirst()
	in listOf(2, 3, 4, 5, 6) -> doSecond()	is Double -> doThird()	else -> doFourth()
}

is equivalent to

if (x == 1) { doFirst() }
else if (x in listOf(2, 3, 4, 5, 6)) { doSecond() }
else if (x is Double) { doThird() }
else { doFourth() }In addition, when { … } is equivalent to when (true) { … }
When any value is provided, possible checks are equality checks (as 1 -> { … }), type checks (as is Int -> { … }) and inclusion checks (as in listOf(1, 2, 3, 5, 8, 13) -> { … }). 

Furthermore, when can be used as an expression instead of a statement:
val discountPercentage = when (cost) {	in 0 until 300 -> 0	in 300 until 1500 -> 5
	else -> 15
}

## Slide 12
- When statement
- fun serveTeaTo(customer: Customer) {
- val teaSack = takeRandomTeaSack()
- when (teaSack) {
- is OolongSack -> error("We don't serve Chinese tea like $teaSack!")
- in trialTeaSacks, teaSackBoughtLastNight ->
- error("Are you insane?! We cannot serve uncertified tea!")
- }
- teaPackage.brew().serveTo(customer)
- }
- when can accept several options in one branch. else branch can be omitted if when block is used as a statement.

**[讲师备注]**
See the docs for more on when.

## Slide 13
- && vs and
- if (a && b) { ... }     VS     if (a and b) { ... }
- Unlike the && operator, this function does not perform short-circuit evaluation.
- The same behavior with OR:
- if (a || b) { ... }     VS     if (a or b) { ... }

**[讲师备注]**
The pros and cons of the lazy and eager versions of the “and” and “or” operators:
The && and || operators cannot be overridden (they are built-in operations). If you want to apply an “and”/”or” operation to something other than Boolean, then you have to use and/or (they are infix functions and thus overridable). Operator overriding will be covered in the OOP lecture.
There are cases when both the left-hand and right-hand sides of the &&/|| operator have side effects (not pure, i.e. they do something other than computing the Boolean value or changing some state) and you need to compute the right-hand value regardless of the left-hand value. Then you should use and/or.
For example, result = result and someComputation(). In that case, someComputation() will be executed regardless of the result variable’s value.

## Slide 14
- Loops
- val items = listOf("apple", "banana", "kiwifruit")
- for (item in items) {
- println(item)
- }
- for (index in items.indices) {
- println("item at $index is ${items[index]}")
- }
- for ((index, item) in items.withIndex()) {
- println("item at $index is $item")
- }

**[讲师备注]**
See the docs for more on loops: here and here.In the third case, a destructuring declaration is used in the (index, item) declaration. It will be discussed in more detail in the OOP introduction lecture. You can also read about it in this doc article.

## Slide 15
- Loops
- val items = listOf("apple", "banana", "kiwifruit")
- var index = 0
- while (index < items.size) {
- println("item at $index is ${items[index]}")
- index++
- }
- var toComplete: Boolean
- do {
- ...
- toComplete = ...
- } while(toComplete)
- The condition variable can be initialized inside to the do…while loop.

**[讲师备注]**
See the docs for more on while loops: here and here.

## Slide 16
- Loops
- There are break and continue labels for loops:
- myLabel@ for (item in items) {
- for (anotherItem in otherItems) {
- if (...) break@myLabel
- else continue@myLabel
- }
- }

**[讲师备注]**
See the docs for more on returns.

## Slide 17
- Ranges
- val x = 10
- if (x in 1..10) {
- println("fits in range")
- }
- for (x in 1..5) {
- print(x)
- }
- for (x in 9 downTo 0 step 3) {
- print(x)
- }
- downTo and step are extension functions, not keywords.
- '..' is actually T.rangeTo(that: T)

**[讲师备注]**
See the docs for more on ranges.

## Slide 18
- Null safety
- val notNullText: String = "Definitely not null"
- val nullableText1: String? = "Might be null"
- val nullableText2: String? = null
- fun funny(text: String?) {
- if (text != null)
- println(text)
- else
- println("Nothing to print :(")
- }
- fun funnier(text: String?) {
- val toPrint = text ?: "Nothing to print :("
- println(toPrint)
- }

**[讲师备注]**
See the docs for more on null checks and null safety.The text in the if (text != null) { … } block here is smart-cast to String, i.e. the compiler does understand that text is a String because the if expression checks that text cannot be null. See the docs for more on null checks. Smart casts are highlighted in some IDEs (for example, in IntelliJ IDEA, unless the option is turned off in settings). Smart casts will be discussed in more detail in the FP and JVM & Kotlin compiler lectures. You can also refer to the docs for more on smart casts.

## Slide 19
- Elvis operator ?:
- If the expression to the left of ?: is not null, the Elvis operator returns it; otherwise, it returns the expression to the right.
- Note that the expression on the right-hand side is evaluated only if the left-hand side is null.
- fun loadInfoById(id: String): String? {
- val item = findItem(id) ?: return null
- return item.loadInfo() ?: throw Exception("...")
- }

**[讲师备注]**
See the docs for more on the Elvis operator.
x ?: y is equivalent to if (x != null) x else y. This fully describes the Elvis operator’s behavior.

## Slide 20
- Safe Calls
- someThing?.otherThing does not throw an NPE if someThing is null.
- Safe calls are useful in chains. For example, an employee may be assigned to a department (or not). That department may in turn have another employee as a department head, who may or may not have a name, which we want to print:
- fun printDepartmentHead(employee: Employee) {
- println(employee.department?.head?.name)
- }
- To print only for non-null values, you can use the safe call operator together with let:
- employee.department?.head?.name?.let { println(it) }

**[讲师备注]**
See the docs for more on null safety.More information about scope functions (let, apply, and others) can be found here. It makes more sense to read this documentation after the OOP introduction lecture.

## Slide 21
- Unsafe Calls
- Please, avoid using unsafe calls!
- The not-null assertion operator (!!) converts any value to a non-null type and throws an NPE exception if the value is null.
- fun printDepartmentHead(employee: Employee) {
- println(employee.department!!.head!!.name!!)
- }

**[讲师备注]**
See the docs for more on the !! operator.

## Slide 22
- TODO
- Always throws a NotImplementedError at run-time if called, stating that operation is not implemented.
- // Throws an error at run-time if calls this function, but compilesfun findItemOrNull(id: String): Item? = TODO("Find item $id")
- // Does not compile at allfun findItemOrNull(id: String): Item? = { }

**[讲师备注]**
See the docs for more on TODO here and here. Also see other similar functions: error, require, requireNotNull, check, checkNotNull, and assert.
TODO is usually used to prototype some logic but defer its implementation, because it’s hard to implement all the logic at once. It’s easier to implement it incrementally by assigning all necessary entities (classes, interfaces, and their methods and values) with TODOs and then replacing the TODOs with actual implementations step by step, from bottom to top.

Because of how TODO is implemented, it will allow the stub code to compile. Also, all TODO usages are added to the TODO/FIXME/etc. list in IntelliJ IDEA, so you can find everything you need to implement in the blink of an eye and be sure nothing is missed.Also, error, require, requireNotNull, check, and checkNotNull are very useful shortcuts for throwing exceptions (on certain predicates). 
error("<error description>”) is a shortcut for throw IllegalStateException("<error description>")which is used when something does not go as planned and you need to throw an exception about it. 
check(predicate) { "<error description>” } is a shortcut for if (!predicate) throw IllegalStateException("<error description>")which is used in the same way as error but checks a predicate for you. 
require is a shortcut for if (!predicate) throw IllegalArgumentException("<error description>")which is used in the same way as check but when function input is incorrect (in wrong form) and you need to throw an exception related to it.

## Slide 23
- String templates and the string builder
- val i = 10
- val s = "Kotlin"
- println("i = $i")
- println("Length of $s is ${s.length}")
- val sb = StringBuilder()
- sb.append("Hello")
- sb.append(", world!")
- println(sb.toString())

**[讲师备注]**
See the docs for more on string templates here and here.The last example is good to know and understand, but you’re better off using buildString in real life. For instance, the last example can be idiomatically written as follows:

val string = buildString {
  append("Hello")
  append(", world!")
}
println(string)

What’s going on here will be discussed in the OOP introduction lecture.

## Slide 24
- Lambda expressions
- val sum: (Int, Int) -> Int = { x: Int, y: Int -> x + y }
- val mul = { x: Int, y: Int -> x * y }
- According to Kotlin convention, if the last parameter of a function is a function, then a lambda expression passed as the corresponding argument can be placed outside the parentheses:
- val badProduct = items.fold(1, { acc, e -> acc * e })
- val goodProduct = items.fold(1) { acc, e -> acc * e }
- If the lambda is the only argument, the parentheses can be omitted entirely (the documentation calls this feature "trailing lambda as a parameter"):
- run({ println("Not Cool") })
- run { println("Very Cool") }

**[讲师备注]**
See the docs for more on trailing lambdas here and here.

## Slide 25
- When in doubt
- Go to:
- kotlinlang.org
- kotlinlang.org/docs
- play.kotlinlang.org/byExample

**[讲师备注]**
In the Kotlin docs, the language (syntax) part of Kotlin is covered in the “Basics” and “Concepts” sections. Standard library references are found in the “API reference” section. Formal language reference can be found in the “Language reference” section.

## Slide 26
- Thanks!
- @kotlin
- |  Developed by JetBrains


--- 统计: 26 页, 22 页含讲师备注