# Exceptions_

共 9 页

## Slide 1
- Exceptions
- Kotlin
- @kotlin
- |  Developed by JetBrains

## Slide 2
- What? Why?
- An exception signals that something went exceptionally wrong.
- Development mistakes
- Errors produced by external (to the program) resources
- System errors
- Why use exceptions:
- To separate error-handling code from regular code
- To propagate errors up the call stack – maybe someone knows how to deal with the error
- To group and differentiate error types
- Do NOT use exceptions for:
- Control flow
- Manageable errors

**[讲师备注]**
Today we will talk about Exceptions.
Exceptions are events that occur during program execution and disrupt the flow of program instructions. There may be different kinds of errors – trying to open a file which does not exist, incorrect arithmetic operation (division by zero) and so on. There may also be system errors, for instance, our application may be running out of memory, in which case a corresponding exception like “Out of Memory Error” would occur.
Why do we use exceptions?
To separate error handling. A good example is a simple piece of code to open, read and close a file. Multiple errors may occur like ”File not found”, “Not enough memory”, ”Not enough disk space”, “File cannot be closed” etc. Using different exception types, you may handle such errors separately using exception handling language features.
To propagate errors. Imagine you have a call stack of 10 functions. Let’s say function #1 is our main() calling function #2 and function #10 tries to open a file and the “File not found” exception occurs. With exceptions you may handle this error within the main() function – the exception will be propagated through the call stack.
Note that exception propagation may be tricky when working with asynchronous code. Kotlin provides us with an amazing coroutines implementation with structured concurrency principles, but we’ll discuss exception handling and propagation when using coroutines later.
To group error types. Exceptions are actually classes. Like the base types hierarchy, there is an error types hierarchy too. The initial exception hierarchy (e.g. the file-related exceptions that we talked about earlier) is implemented in a standard library, but may be extended – you may use class inheritance and introduce your own exception classes.
Using exceptions for control flow purposes may be considered an antipattern. Exceptions are meant for any exceptional error conditions. Exceptions are quite similar to non-local goto statements, so using them for control flow may break the Principles of Least Astonishment and make your code hard to read and understand. References:
Kotlin Documentation: Exceptions - https://kotlinlang.org/docs/exceptions.html
“Kotlin and Exceptions”, Roman Elizarov - https://elizarov.medium.com/kotlin-and-exceptions-8062f589d07
“What’s an Exception and Why Do I Care”, MIT - https://web.mit.edu/java_v1.0.2/www/tutorial/java/exceptions/definition.html
“Don’t Use Exceptions For Flow Control” - http://wiki.c2.com/?DontUseExceptionsForFlowControl
Principle of Least Astonishment (or “No Surprise Principle”) - https://en.wikipedia.org/wiki/Principle_of_least_astonishment
“Effective Java”, Item 69, Use Exceptions only for exceptional conditions. Joshua Bloch

## Slide 3
- How?
- fun main() {
- throw Exception("Hello, world!")
- }
- Or even better:
- fun main() {
- val nullableString: String? = null
- println("Hello, NPE! ${nullableString!!}")
- }
- Exception in thread "main" java.lang.NullPointerException

**[讲师备注]**
Exceptions came to Kotlin from Java. The overall concept is very similar, but still with some significant differences.
Let’s have a look at a simple piece of code that throws an exception. To throw an exception ”manually” (or explicitly) we may use the “throw” keyword and any exception type, for instance, “Exception”.Kotlin does not have checked exceptions. In other words, all exceptions are unchecked – no exception must be handled explicitly. The Kotlin compiler won’t force you to wrap any call with try-catch or “rethrow” any exception. Please try to compile the first code snippet – you will see that no compile-time error occurs.You may have noticed that the `throws` clause is missing from the function signature in Kotlin. Furthermore, there is no `throws` keyword in Kotlin. But if there is no `throws` keyword, how can we tell whether a given Kotlin function might throw an exception? You can use KDoc @throws and @exception block tags:
/**
* @throws Exception
*/
fun foo() {
   throw Exception()
}

For Java interoperability, @Throws annotation may also be used:
@Throws(Exception::class)
fun foo() {
   throw Exception()
}Do you remember Kotlin Null Safety principles? Using the `!!` operator we may still get a NullPointerException in Kotlin. Please have a look at code sample #2. References:
Kotlin Documentation: Checked exceptions - https://kotlinlang.org/docs/exceptions.html#checked-exceptions
“Checked Exceptions”, Stephen Colebourne - https://blog.joda.org/2010/09/checked-exceptions-bijava_9688.html
”Java’s checked exceptions were a mistake”, Rod Waldhoff - https://radio-weblogs.com/0122027/stories/2003/04/01/JavasCheckedExceptionsWereAMistake.html

## Slide 4
- Example
- Message: An exceptionCause: java.lang.RuntimeException: A causeException: java.lang.Exception: An exceptionFinally always executesjava.lang.Exception: An exception		at MainKt.main(Main.kt:3)	at MainKt.main(Main.kt)Caused by: java.lang.RuntimeException: A cause	... 2 more
- fun main() {
- try {
- throw Exception("An exception", RuntimeException("A cause"))
- } catch (e: Exception) {
- println("Message: ${e.message}")
- println("Cause: ${e.cause}")
- println("Exception: $e") // toString() is called "under the hood"
- e.printStackTrace()
- } finally {
- println("Finally always executes")
- }
- }

**[讲师备注]**
How to handle Exceptions in Kotlin?
If some code may throw an Exception, we can wrap it with try-catch and handle exceptions.

Please have a look at the `catch` line – the exception type is specified explicitly on the right side. We talked about the exceptions hierarchy - what if we replace Exception with RuntimeException? Try to run this code. You may notice that the exception is not caught. That is principle #3: ”Group and differentiate error types”. In the exception hierarchy only the type specified in the `catch` clause and its descendants will be caught.
The finally the block is optional in this example and may be omitted. Even if an exception is caught, the finally block will be executed.
You may notice that, in this code example, we passed both the message and cause as arguments. Indeed, every exception may have an optional message and cause. When handling an exception, you may get both values. References:
Kotlin Documentation: Exception classes - https://kotlinlang.org/docs/exceptions.html#exception-classes

## Slide 5
- Another meaningful example
- data class Person(val name: String, val surname: String, val age: Int) {
- init {
- if (age < 0) {
- throw IllegalStateException("Age cannot be negative")
- }
- if (name.isEmpty() || surname.isEmpty()) {
- throw IllegalArgumentException("For blank names/surnames use -")
- }
- }
- }

**[讲师备注]**
One function may throw different types of exceptions (principle #3 ”Group and differentiate error types” again). Try to create the Person object, e.g.:

val person = Person("Alex", "", -1)
As you may have noticed, both age and surname are specified incorrectly. But if you run code like this, you’ll get only an `IllegalStateException`. As mentioned earlier, the exception will stop normal code flow, and an error will be propagated.

## Slide 6
- Dealing with exceptions
- You might:
- Handle the error properly and continue execution
- Handle something on your side and re-throw the exception
- try {
- val (n, s, a) = readLine()!!.split('/')
- val person = Person(n, s, a.toInt())
- addToDataBase(person)
- } catch (e: IllegalStateException) {
- println("You've entered a negative age! Why?")
- } catch (e: IllegalArgumentException) {
- println(e.message)
- } catch (e: NullPointerException) {
- println("NPE ;^)")
- } catch (e: Exception) {
- println("Something else went wrong")
- throw Exception("Failed to add to the database", e)
- } finally {
- println("See you in the next episodes!")
- }

**[讲师备注]**
Now let’s look at a slightly more complicated example. What if we have to handle different types of exceptions? Multiple catch blocks may be written. And again – the finally block is optional here, you may omit one and it would not affect exception handling.
Lastly, you may be wondering: What if we need to have a similar exception handler for `IllegalStateException` and `IllegalArgumentException`? For instance, in Java we could write the following:

class Main {
   public static void foo() throws IllegalStateException, IllegalArgumentException {
       //...
   }

   public static void main(String[] args) {
       try {
           foo();
       } catch (IllegalStateException | IllegalArgumentException e) {
           // handle exception
       }
   }
}

How do we get a similar implementation in Kotlin? Well, the thing is that Kotlin does not provide us with multi-catch blocks (see related Kotlin YouTrack issue). But you may use extremely flexible lambdas and corresponding Kotlin conventions to obtain a similar solution. For instance, please have a look at Roman Elizarov’s suggestion, added in May 2022:

inline fun <T, E> Result<T>.on(vararg exceptionClasses: KClass<out E>, action: (exception: E) -> Unit) =
   onFailure { exception ->
       if (exceptionClasses.any { it.isInstance(exception) }) action(exception as E)
   }

runCatching {
   // do some nasty things...
   .on(IllegalArgumentException::class, IllegalStateException::class) {
      kotlin.io.println("Something went terribly wrong ${it.message}")
   }
}

Looks very similar, right?
References:
“Multi-Catch Block”, Kotlin YouTrack - https://youtrack.jetbrains.com/issue/KT-7128
“How to catch many exceptions?”, Stackoverflow - https://stackoverflow.com/questions/36760489/how-to-catch-many-exceptions-at-the-same-time-in-kotlin

## Slide 7
- 👀
- And a lot in java.util

**[讲师备注]**
A few more words about the exception hierarchy. As mentioned earlier, Exceptions came from Java. And the corresponding exception hierarchy was reused. Please have a look at the hierarchy on the slide. Of course it’s not full, but you may notice “Exception” and its subclass “RuntimeException”. This is a very important part of Java, as “RuntimeException” and its descendants are unchecked exceptions. But just to reiterate – there are no checked exceptions in Kotlin.

You may also notice “message” and “cause” fields in Throwable – every exception has two optional values as we discussed earlier. Remember that an exception is a class – so you may use inheritance to introduce a specific exception, e.g.: 

class CustomException : Exception()

And throw, catch it as shown earlier.Remember principle #3: “Group and differentiate error types”, but try to reuse standard exceptions whenever possible.
Kotlin Documentation: Checked Exceptions - https://kotlinlang.org/docs/reference/exceptions.html#checked-exceptions
“Effective Java”, Item 72, Favor the use of standard exceptions. Joshua Bloch

## Slide 8
- Kotlin sugar
- try is an expression:
- val a: Int? = try { input.toInt() } catch (e: NumberFormatException) { null }
- More sugar:
- require(count >= 0) { "Count must be non-negative, was $count" }
- // IllegalArgumentException
- error("Error message")
- // IllegalStateException

**[讲师备注]**
Like almost any other language feature in Kotlin, try is an expression too. In such cases, the returned value will be the last expression in either try or catch blocks. Kotlin has some more extra functions in a standard library for working with exceptions. For example, `require`. Let’s have a look at its implementation: 
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

You may see that this function throws an ´IllegalArgumentException´ when the passed value is false.
Now let’s try to implement our Person data class with require instead of explicit exception throwing:

data class Person(val name: String, val surname: String, val age: Int) {
   init {
       require(age > 0)  { "Age cannot be negative or zero" }
   }
}
Pretty concise, don’t you think?
References:
Kotlin Documentation: Exception classes - https://kotlinlang.org/docs/exceptions.html#exception-classes 
Kotlin Standard Library: require() - https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html

## Slide 9
- Thanks!
- @kotlin
- |  Developed by JetBrains


--- 统计: 9 页, 7 页含讲师备注