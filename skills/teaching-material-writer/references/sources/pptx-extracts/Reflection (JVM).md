# Reflection (JVM)

共 45 页

## Slide 1
- Reflection (JVM)
- @kotlin
- |  Developed by JetBrains
- Kotlin

## Slide 2
- What is reflection?
- “Reflection can be defined as the ability of a program to manipulate as data something representing the state of the program during its own execution.”*   A simple example of reflection is redefining a class field of an object at runtime.
- *Daniel G Bobrow, Richard P Gabriel, and Jon L White. 1993. Object Oriented Programming: The CLOS Perspective (1993), 29–61.

**[讲师备注]**
Reflection can be defined as the ability of a program to manipulate as data something representing the state of the program during its own execution.
The only target we will consider in this lecture is the JVM.

## Slide 3
- Reflection in Java: an example
- Let’s create a simple Kotlin class:
- class Dog(val name: String, var age: Int) {
- fun bark() = println("bark")
- private fun privateBark() =
- println("private bark!")
- companion object {
- @JvmStatic
- fun publicStaticMethod() =
- println("Hi from public static")
- @JvmStatic
- private fun privateStaticMethod() =
- println("Hi from private static")
- fun publicNotReallyStaticMethod() =
- println("Hi from public not really static")
- private fun privateNotReallyStaticMethod() =
- println("Hi from private not really static")
- }
- }

**[讲师备注]**
Let's create a simple Kotlin class called “Dog”. This class has two fields: a read-only name and a mutable age. It also has two simple methods, with one being public and one private. 
Inside the class, we also created a companion object with four simple methods. The main difference between them is that two of them have the JvmStatic annotation. This annotation marks the methods as static in the JVM target, meaning that you can call this method from Java using Dog.publicStaticMethod(). If you don’t have this annotation, you have to use an intermediate level to call the function: Dog.Companion.publicNotReallyStaticMethod(). These examples are only for Java interoperability. In Kotlin code, you can call both methods directly using Dog.publicStaticMethod() and Dog.publicNotReallyStaticMethod().

## Slide 4
- Reflection in Java: the main entry point
- Instances of the class Class<T> represent classes and interfaces in a running Java (Kotlin) application. This is the main entry point for reflection.

**[讲师备注]**
Since Kotlin is fully compatible with Java code, you can easily use Java reflection. We will look at Java reflection first, and then the Kotlin analog. The best way to use reflection in Kotlin under the JVM is a combination of Java and Kotlin reflection. The main entry point for reflection is the class Class<T>, which can be accessed by calling ::class.java from any Kotlin object.

## Slide 5
- Reflection in Java: getting fields
- We can get all fields:
- println("Fields:")
- dog::class.java.fields.forEach { println(it.name) }
- But the result is an empty list!
- class Dog(val name: String, var age: Int) {
- fun bark() = println("bark")
- private fun privateBark() =
- println("private bark!")
- ...
- }

**[讲师备注]**
Going back to the example from the previous slides, we have a Dog class with two fields – name and age. Using reflection, for any object we can get a list of fields and print their names, for example, for a dog object with type Dog we will receive, as expected, a list of two field names – name and age. This can be done by accessing the fields of the Class<T> object. But in our example, we received an empty list – what could be the problem?

## Slide 6
- Reflection in Java: getting fields
- class Dog(val name: String, var age: Int)
- public final class Dog {
- @NotNull
- private final String name;
- private int age;
- ...
- }
- Java sources
- // ================Dog.class ================= // class version 52.0 (52)
- // access flags 0x31
- public final class Dog {
- // access flags 0x12
- private final Ljava/lang/String; name @Lorg/jetbrains/annotations/NotNull;() // invisible
- …
- }
- Kotlin bytecode

**[讲师备注]**
If we examine the Kotlin bytecode and the decompiled class files, we see that both our fields are private. To regulate Kotlin mutability in Java, getter and setter methods are created, but the fields themselves are private. And they return only public fields.

## Slide 7
- Reflection in Java: getting fields
- We can get all public fields:
- println("Fields:")
- dog::class.java.fields.forEach { println(it.name) }
- We can get all fields (with any modifiers):
- println("Declared fields:")
- dog::class.java.declaredFields.forEach { println(it.name) }
- Declared fields:
- name
- age

**[讲师备注]**
However, reflection is a powerful mechanism, and we can also use it to get access to private fields. To do this, we can use declaredFields. In this case, everything is fine with our example.

## Slide 8
- Reflection in Java: setting fields
- We can change any field:
- dog.name = "Bob" // ERROR!!
- dog::class.java.declaredFields.find { it.name == "name" }?.set(dog, "Bob")
- println(dog.name)
- Reflection magic

**[讲师备注]**
Now we have made sure that we can get all the fields. Not only can we get them as read-only objects, but we can also modify them. To do so, we simply find the field we need using its name and then call the set method with the object of the class and the value of the new field. Be sure to use the same type as your initial class requests, otherwise you will get a runtime error.

## Slide 9
- Reflection in Java: setting fields
- We can change any field:
- dog.name = "Bob" // ERROR!!
- dog::class.java.declaredFields.find { it.name == "name" }?.set(dog, "Bob")
- println(dog.name)
- Reflection magic
- Exception in thread "main" java.lang.IllegalAccessException: class MainKt cannot access a member of class Dog with modifiers "private final"
- at java.base/jdk.internal.reflect.Reflection.newIllegalAccessException(Reflection.java:392)
- at java.base/java.lang.reflect.AccessibleObject.checkAccess(AccessibleObject.java:674)
- at java.base/java.lang.reflect.Field.checkAccess(Field.java:1102) at java.base/java.lang.reflect.Field.set(Field.java:797)
- at MainKt.main(Main.kt:11)

**[讲师备注]**
So, this code should work, but we got an error. In fact, because the field is private, you cannot change it by default.

## Slide 10
- Reflection in Java: setting fields
- We can change any field:
- dog.name = "Bob" // ERROR!!
- dog::class.java.declaredFields.find { it.name == "name" }?.let{
- it.isAccessible = true
- it.set(dog, "Bob")
- }
- println(dog.name)
- Reflection magic
- Bob

**[讲师备注]**
However, the reflection mechanism allows you to specify the level of access to an object and then change it.

## Slide 11
- Reflection in Java: getting class methods
- We can get all of the methods in the class:
- println("Methods:")
- dog::class.java.methods.forEach { println(it.name) }
- Methods:
- getName
- getAge
- setAge
- bark
- publicStaticMethod
- wait
- wait
- wait
- equals
- toString
- hashCode
- getClass
- notify
- notifyAll
- class Dog(val name: String, var age: Int) {
- fun bark() = println("bark")
- private fun privateBark() = println("private bark!")
- companion object {
- @JvmStatic
- fun publicStaticMethod() = println("Hi from public static")
- @JvmStatic
- private fun privateStaticMethod() = println("Hi from private static")
- fun publicNotReallyStaticMethod() = println("Hi from public not really static")
- private fun privateNotReallyStaticMethod() = println("Hi from private not really static")
- }
- }

**[讲师备注]**
With reflection we can also get a list of all of the methods in the class. This final list will have more methods than there are in the original class.

## Slide 12
- Reflection in Java: getting class methods
- We can get all of the methods in the class:
- println("Methods:")
- dog::class.java.methods.forEach { println(it.name) }
- Methods:
- getName
- getAge
- setAge
- bark
- publicStaticMethod
- wait
- wait
- wait
- equals
- toString
- hashCode
- getClass
- notify
- notifyAll
- Standard Object methods

**[讲师备注]**
For example, there are several standard Object methods.

## Slide 13
- Reflection in Java: getting class methods
- We can get all of the methods in our class:
- println("Methods:")
- dog::class.java.methods.forEach { println(it.name) }
- Methods:
- getName
- getAge
- setAge
- bark
- publicStaticMethod
- wait
- wait
- wait
- equals
- toString
- hashCode
- getClass
- notify
- notifyAll
- Standard thread synchronization methods

**[讲师备注]**
There are also standard thread synchronization methods.

## Slide 14
- Reflection in Java: getting class methods
- We can get all of the methods in our class:
- println("Methods:")
- dog::class.java.methods.forEach { println(it.name) }
- Methods:
- getName
- getAge
- setAge
- bark
- publicStaticMethod
- wait
- wait
- wait
- equals
- toString
- hashCode
- getClass
- notify
- notifyAll
- class Dog(val name: String, var age: Int)
- For val we have only a getter, for var we can have both - a getter and a setter

**[讲师备注]**
As mentioned above, Kotlin's mutability is governed by getters and setters. For val we have only a getter since we cannot change the value, and for var we can have both a getter and a setter.

## Slide 15
- Reflection in Java: getting class methods
- We can get all of the methods in our class:
- println("Methods:")
- dog::class.java.methods.forEach { println(it.name) }
- Methods:
- getName
- getAge
- setAge
- bark
- publicStaticMethod
- wait
- wait
- wait
- equals
- toString
- hashCode
- getClass
- notify
- notifyAll
- Only public methods
- No methods from Companion
- (except JvmStatic)
- class Dog(val name: String, var age: Int) {
- fun bark() = println("bark")
- private fun privateBark() = println("private bark!")
- companion object {
- @JvmStatic
- fun publicStaticMethod() = println("Hi from public static")
- @JvmStatic
- private fun privateStaticMethod() = println("Hi from private static")
- fun publicNotReallyStaticMethod() = println("Hi from public not really static")
- private fun privateNotReallyStaticMethod() = println("Hi from private not really static")
- }
- }

**[讲师备注]**
Like fields, methods return only public methods of the current class or the companion object of that class marked with the JvmStatic annotation.

## Slide 16
- Reflection in Java: getting class methods
- With declaredMethods, we can get all methods (with any modifier), with the exception of inherited methods:
- println("Declared methods:")
- dog::class.java.declaredMethods.forEach { println(it.name) }
- Declared methods:
- getName
- getAge
- setAge
- bark
- privateBark
- publicStaticMethod
- privateStaticMethod
- class Dog(val name: String, var age: Int) {
- fun bark() = println("bark")
- private fun privateBark() = println("private bark!")
- companion object {
- @JvmStatic
- fun publicStaticMethod() = println("Hi from public static")
- @JvmStatic
- private fun privateStaticMethod() = println("Hi from private static")
- fun publicNotReallyStaticMethod() = println("Hi from public not really static")
- private fun privateNotReallyStaticMethod() = println("Hi from private not really static")
- }
- }

**[讲师备注]**
Unlike methods, declaredMethods returns all methods (with any modifier) from the current class and from the companion object within that class with the JvmStatic annotation, excluding inherited methods.

## Slide 17
- Reflection in Java: getting class methods
- With declaredMethods, we can get all methods (with any modifier), with the exception of inherited methods:
- println("Declared methods:")
- dog::class.java.declaredMethods.forEach { println(it.name) }
- Declared methods:
- getName
- getAge
- setAge
- bark
- privateBark
- publicStaticMethod
- privateStaticMethod
- class Dog(val name: String, var age: Int) {
- fun bark() = println("bark")
- private fun privateBark() = println("private bark!")
- companion object {
- @JvmStatic
- fun publicStaticMethod() = println("Hi from public static")
- @JvmStatic
- private fun privateStaticMethod() = println("Hi from private static")
- fun publicNotReallyStaticMethod() = println("Hi from public not really static")
- private fun privateNotReallyStaticMethod() = println("Hi from private not really static")
- }
- }
- From Companion returns only
- methods with JvmStatic

## Slide 18
- Reflection in Java: getting class methods
- println("Methods from companion:")
- Dog.Companion::class.java.methods.forEach { println(it.name) }
- Methods from companion: publicNotReallyStaticMethod
- publicStaticMethod
- access$privateStaticMethod
- wait
- wait
- wait
- equals
- toString
- hashCode
- getClass
- notify
- notifyAll
- class Dog(val name: String, var age: Int) {
- fun bark() = println("bark")
- private fun privateBark() = println("private bark!")
- companion object {
- @JvmStatic
- fun publicStaticMethod() = println("Hi from public static")
- @JvmStatic
- private fun privateStaticMethod() = println("Hi from private static")
- fun publicNotReallyStaticMethod() = println("Hi from public not really static")
- private fun privateNotReallyStaticMethod() = println("Hi from private not really static")
- }
- }

**[讲师备注]**
If we look at the list of methods in the companion object, we find several additional methods, such as access$privateStaticMethod.

## Slide 19
- Reflection in Java: getting class methods
- println("Declared methods from companion:")
- Dog.Companion::class.java.declaredMethods.forEach { println(it.name) }
- Declared methods from
- companion:
- publicNotReallyStaticMethod privateNotReallyStaticMethod
- publicStaticMethod
- privateStaticMethod
- access$privateStaticMethod
- class Dog(val name: String, var age: Int) {
- fun bark() = println("bark")
- private fun privateBark() = println("private bark!")
- companion object {
- @JvmStatic
- fun publicStaticMethod() = println("Hi from public static")
- @JvmStatic
- private fun privateStaticMethod() = println("Hi from private static")
- fun publicNotReallyStaticMethod() = println("Hi from public not really static")
- private fun privateNotReallyStaticMethod() = println("Hi from private not really static")
- }
- }

**[讲师备注]**
This is also the case for declaredMethods.

## Slide 20
- Reflection in Java: getting class methods
- public final class Dog {
- …
- // access flags 0x19
- public final static publicStaticMethod()V
- @Lkotlin/jvm/JvmStatic;()
- L0
- GETSTATIC Dog.Companion : LDog$Companion;
- INVOKEVIRTUAL Dog$Companion.publicStaticMethod ()V
- RETURN
- L1
- MAXSTACK = 1
- MAXLOCALS = 0
- …
- }
- public final class Dog$Companion {
- …
- // access flags 0x11
- public final publicStaticMethod()V
- @Lkotlin/jvm/JvmStatic;()
- L0
- LINENUMBER 10 L0
- LDC "Hi from public static"
- ASTORE 1
- L1
- GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
- ALOAD 1
- INVOKEVIRTUAL java/io/PrintStream.println (Ljava/lang/Object;)V L2
- L3
- LINENUMBER 10 L3
- RETURN
- L4
- LOCALVARIABLE this LDog$Companion; L0 L4 0
- MAXSTACK = 2
- MAXLOCALS = 2
- …
- }
- Invokes the real one
- publicStaticMethod

**[讲师备注]**
Consider how a companion object method works under the hood. For the public method with the JvmStatic annotation, everything is clear. We simply create this method inside the companion object and the same method is automatically created inside the initial Dog class by the compiler. This allows us to call the publicStaticMethod method directly from the Dog class in  Java. The method inside the Dog class simply calls the method from the companion object in this case.

## Slide 21
- Reflection in Java: getting class methods
- public final class Dog$Companion {
- …
- // access flags 0x12
- private final privateStaticMethod()V
- @Lkotlin/jvm/JvmStatic;()
- L0
- LINENUMBER 14 L0
- LDC "Hi from private static"
- ASTORE 1
- L1
- GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
- ALOAD 1
- INVOKEVIRTUAL java/io/PrintStream.println (Ljava/lang/Object;)V
- L2
- L3
- LINENUMBER 14 L3
- RETURN
- L4
- LOCALVARIABLE this LDog$Companion; L0 L4 0
- MAXSTACK = 2
- MAXLOCALS = 2
- …
- }
- public final class Dog {
- …
- // access flags 0x1A
- private final static privateStaticMethod()V
- @Lkotlin/jvm/JvmStatic;()
- L0
- GETSTATIC Dog.Companion : LDog$Companion;
- INVOKESTATIC Dog$Companion.access$privateStaticMethod (LDog$Companion;)V
- RETURN
- L1
- MAXSTACK = 1
- MAXLOCALS = 0
- …
- }
- Has a reference from the Dog class
- access$privateStaticMethod

**[讲师备注]**
Things are a bit different for the private static method with the JvmStatic annotation. In this case, the extra method is still generated inside the Dog class because of the JvmStatic annotation, but it cannot call the private method from the companion object.

## Slide 22
- Reflection in Java: getting class methods
- Cannot call the private method directly
- access$privateStaticMethod
- public final class Dog {
- …
- // access flags 0x1A
- private final static privateStaticMethod()V
- @Lkotlin/jvm/JvmStatic;()
- L0
- GETSTATIC Dog.Companion : LDog$Companion;
- INVOKESTATIC Dog$Companion.access$privateStaticMethod (LDog$Companion;)V
- RETURN
- L1
- MAXSTACK = 1
- MAXLOCALS = 0
- …
- }

**[讲师备注]**
Because of this, we need to create an extra public method called access$privateStaticMethod inside the companion object. This new method simply calls privateStaticMethod, allowing us to call access$privateStaticMethod from the Dog class.

## Slide 23
- Reflection from Java: invoking methods
- We can invoke methods:
- dog::class.java.methods.find { it.name == "bark" }?.invoke(dog)
- Pass an object to invoke the method
- bark

**[讲师备注]**
Like fields, methods can be called. You must always pass a class object as the first argument, and all function arguments. Since we have a function without any arguments, we don't pass them.

## Slide 24
- Reflection in Java: invoking methods
- We can even invoke private methods:
- dog::class.java.declaredMethods.find { it.name == "privateBark" }?.invoke(dog)
- But we need to be careful, or we may get an error like this:
- Exception in thread "main" java.lang.IllegalAccessException: class MainKt cannot access a member of class Dog with modifiers "private final" 	at java.base/jdk.internal.reflect.Reflection.newIllegalAccessException(Reflection.java:392) 	at java.base/java.lang.reflect.AccessibleObject.checkAccess(AccessibleObject.java:674) 	at java.base/java.lang.reflect.Method.invoke(Method.java:560) 	at MainKt.main(Main.kt:26)

**[讲师备注]**
We can even invoke private methods, but we need to be careful or we might run into problems.

## Slide 25
- Reflection in Java: invoking methods
- We can even invoke private methods:
- dog::class.java.declaredMethods.find { it.name == "privateBark" }?.invoke(dog)
- dog::class.java.declaredMethods.find { it.name == "privateBark" }?.let{
- it.isAccessible = true
- it.invoke(dog)
- }
- private bark!

**[讲师备注]**
To solve this problem, we just need to change the accessibility value.

## Slide 26
- Reflection in Java: invoking static methods
- We can invoke static methods:
- dog::class.java.declaredMethods.find { it.name == "privateStaticMethod" }?.let{
- it.isAccessible = true
- it.invoke(null)
- }
- Hi from private static
- Pass null to invoke the method

**[讲师备注]**
If we invoke a static method (with the ACC_STATIC flag in the bytecode), we need to pass null as the class object.

## Slide 27
- Reflection from Java: other functions
- Other great functions are available in the API!
- https://docs.oracle.com/javase/8/docs/technotes/guides/reflection/index.html
- There are also lots of other helpful libraries that use the Java Reflection API under the hood, like Reflections and ClassGraph.

**[讲师备注]**
As you can see, Java reflection allows you to do some rather complex things during the runtime of your program. To learn more about the capabilities of the Java Reflection API, check out the official documentation. 
Additionally, many common tasks, such as searching for entities at runtime, have already been made possible through various libraries that use the API under the hood but make working with it a little more convenient.

## Slide 28
- Reflection in Kotlin
- You can use the Java Reflection API in Kotlin code, but there are some specific language features that it does not cover:
- Data classes
- Nullability
- Top-level functions
- Other Kotlin-specific features
- Kotlin has its own API for reflection, which is implemented on top of Java reflection (for JVM).  https://kotlinlang.org/docs/reflection.html

**[讲师备注]**
Because Kotlin is fully interoperable with Java, you can use the Java Reflection API in Kotlin code. However, there are Kotlin features, such as whether a class is marked data, nullability of types, and top-level functions, that are not recognized by the Java Reflection API. To account for features like these, Kotlin has its own API for reflection, which is implemented mostly on top of the Java reflection (for JVM).

## Slide 29
- Reflection in Kotlin: an example
- Instances of the class KClass<T> represent classes and interfaces in a running Kotlin application. The main entry point for reflection.

**[讲师备注]**
The main entry point for Kotlin reflection is the interface KClass<T>, which can be accessed by using ::class operator from any Kotlin object.

## Slide 30
- Reflection in Kotlin: an example
- Methods are typically used to check any properties and get member functions, among other things:
- printIn(dog::class.isAbstract)
- printIn(dog::class.isFinal)
- false true
- dog::class.memberProperties.forEach{ println(it.name) }
- dog::class.memberFunctions.forEach{ println(it.name) }
- age
- name
- bark
- privateBark
- equals
- hashCode
- toString
- Don’t forget to include kotlin-reflect in the dependencies list!

**[讲师备注]**
Methods are available to check properties, as well as get properties and member functions. For example, we can check if a property is abstract or final.  
Kotlin reflection is not included in the Kotlin Standard Library by default. If you want to use Kotlin reflection, you’ll need to add kotlin-reflect to your dependency list.

## Slide 31
- Reflection in Kotlin: usage with types
- Reflection can be used with both functions and types:
- fun myTopLevelFun() = println("My top-level function")
- kotlin.Unit false
- printIn(::myTopLevelFun.returnType)
- printIn(::myTopLevelFun.returnType.isMarkedNullable)
- Don’t forget to include kotlin-reflect in the dependencies list!

**[讲师备注]**
You can also work with top level functions and with their types, e.g. to check if the return type is marked as a nullable type.

## Slide 32
- Reflection in Kotlin: combining Java and Kotlin entities
- You can get KFunction or KProperty by Method or Field from Java via kotlinFunction or kotlinProperty:
- fun Dog.Companion.privateStaticMethod(): kotlin.Unit
- println(dog::class.java.returnType)
- .find { it.name == "privateStaticMethod" }?.kotlinFunction)
- Don’t forget to include kotlin-reflect in the dependencies list!

**[讲师备注]**
Additionally, you can get KFunction or KProperty by Method or Field from Java via kotlinFunction or kotlinProperty.

## Slide 33
- Reflection in Kotlin: under the hood
- The Kotlin compiler will write a long annotation (a protobuf message) with all the necessary information:
- @Lkotlin/Metadata;(mv={1, 8, 0}, k=1, d1={"\u0000
- \n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0010\u0008\n\u0002
- \u0008\u0008\n\u0002\u0010\u0002\n\u0002\u0008\u0003\u0018\u0000
- \u00102\u00020\u0001:\u0001\u0010B\u0015\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010
- \u0004\u001a\u00020\u0005\u00a2\u0006\u0002\u0010\u0006J\u0006\u0010\r\u001a\u00020\u000eJ\u0008\u0010
- \u000f\u001a\u00020\u000eH\u0002R\u001a\u0010\u0004\u001a\u00020\u0005X\u0086\u000e\u00a2\u0006\u000
- e\n\u0000\u001a\u0004\u0008\u0007\u0010\u0008\"\u0004\u0008\u0009\u0010\nR\u0011\u0010\u0002\u001a\u00
- 020\u0003\u00a2\u0006\u0008\n\u0000\u001a\u0004\u0008\u000b\u0010\u000c\u00a8\u0006\u0011"},
- d2={"LDog;", "", "name", "", "age", "", "(Ljava/lang/String;I)V", "getAge", "()I", "setAge", "(I)V", "getName", "()Ljava/
- lang/String;", "bark", "", "privateBark", "Companion", "reflection"})
- https://github.com/JetBrains/kotlin/blob/master/core/metadata/src/org/jetbrains/kotlin/metadata/ProtoBuf.java

**[讲师备注]**
You may be wondering how this works, since class files are created during compilation that do not contain any information about Kotlin-specific features. The answer is quite simple. The Kotlin compiler creates a long annotation with all the necessary information for each JVM class in the form of a protoсol buffer. And then the reflection runtime reads that information under the hood.

## Slide 34
- Why is reflection necessary?
- It’s just really cool!
- You can manipulate your program however you want.
- It’s usually is used in frameworks, e.g. Spring, JUnit, etc.
- You can create entities based on the user’s information.
- It can be used to test your application (have access to private fields, methods, etc.).

**[讲师备注]**
Why would you consider using reflection? 
Firstly, just for fun – it's just really to be able to manipulate your program however you want, and doing so can give you a better understanding of how Kotlin works under the hood, as well as what different Kotlin constructs compile into. 
In real life, reflection is often used in frameworks such as Spring and JUnit. It typically creates entities based on user information, generating extra classes for example. 
Reflection is also sometimes used for testing, since it allows you to access and test all the private entities in your program.

However, reflection does have its risks, and it can even break things in your program!

## Slide 35
- What are the drawbacks?
- There’s a risk of breaking things in your program.
- For example, if you use refactoring to rename a method, it will not be renamed automatically in reflection calls, since the reflection may refer to the old name as a string. This can lead to serious problems.
- Your performance will be degraded, as all operations are performed at runtime.
- It does not allow for compile-time optimizations.
- Avoid using reflection if you don't really need it!

**[讲师备注]**
Of course, using reflection has its drawbacks. 
As you may have noticed, we mostly access functions or fields using string constants. Changing the function’s name via refactoring will not change this constant, which may lead to the program breaking. 
In addition, one of the major drawbacks is performance, as all operations are performed at run-time. 
The last drawback also affects performance. Since operations are performed at runtime, no compile-time optimizations can be performed. 
In light of these downsides, it is best to avoid using reflection if you don't really need it!

## Slide 36
- MethodHandles
- MethodHandles is an API that provides access to various parts of your program:
- MethodHandles.Lookup provides access to fields and methods.
- MethodType defines a method signature with types of parameters and the return type.
- Methods and fields are accessed with “direct” method handles.
- Handle adapters are available.

**[讲师备注]**
MethodHandles, introduced in Java 1.7, is an API similar to reflection but was initially designed to support dynamic languages on the JVM, but turned out to be a performant alternative to reflection in scenarios when we have information about signatures of methods and fields we wish to invoke.

MethodHandles.Lookup is a factory that allows one to obtain method handles for fields and methods.

MethodType just stores the parameter types of a method and its return type.

This API is named as such because it accesses methods and fields through direct handles that, just once, during lookup, precisely identify the method variant being called, whether access to call the method is available, etc. This specificity makes it more efficient than reflection, which, for example, always needs to match an argument array with the method to ensure type safety.

Furthermore, the API includes handle adapters that enable the preprocessing of arguments and post-processing of the return value of a handled method, conveniently combining several method handles.

## Slide 37
- MethodHandles
- MethodHandles are not a form of reflection, but they are very similar.
- They can be used for tasks similar to those performed with reflection.
- They work better because JIT optimizations can be applied and fewer call correctness checks are necessary.

**[讲师备注]**
Let's sum it up. One should not regard method handles as a reflection API. MethodHandles.Lookup cannot enumerate the methods of a class or identify their signatures by itself.

Both reflection and method handles enable dynamic method invocation and can even be combined, because methods can be resolved with reflection but called with method handles.

The performance of method handles is generally better, attributable to fewer access and argument checks and special JIT optimizations performed by the JVM.

## Slide 38
- MethodHandles
- MethodHandles.publicLookup():
- Provides access only to public fields and methods that can be accessed from anywhere.
- MethodHandles.lookup():
- Provides access to fields and methods available in the place from which this lookup is called.

**[讲师备注]**
We can request two types of method handles lookup.The public lookup allows access only to public fields and methods that can be called from anywhere, so it will work the same way regardless of where you acquire it.

However, when you perform a simple lookup, it will have full access to everything that can be accessed from the class in which the lookup is acquired. This behavior is named caller-sensitive. Such a lookup won’t allow you to break any encapsulation because it will enable you to call private methods of the class where the lookup is acquired, but it won’t allow access to private methods of any other classes. Unless you intend to break the encapsulation of your class, you should not expose this lookup to other classes.
There are still few ways to bypass encapsulation with method handles, such as accessing a method that was made accessible through reflection (we’ll talk about it) or by using a special private lookup. However, the latter one is beyond the scope of the presentation, as it requires some understanding of the Java 9+ modules.

## Slide 39
- MethodHandles: example
- We can find a getter and invoke it:
- val lookup = MethodHandles.lookup()
- val getProp = lookup.findVirtual(
- Dog::class.java,
- "getName",
- MethodType.methodType(String::class.java)
- )
- println(getProp.invoke(dog))
- Andy

**[讲师备注]**
First, a lookup object is obtained. Then, it proceeds to find a virtual (opposing to static) method, getName, which returns a String, in Dog class. The method is called on an instance of Dog.

## Slide 40
- MethodHandles: example
- Private methods can be invoked with help from the Reflection API:
- val privateBarkMethod = Dog::class.java.getDeclaredMethod("privateBark")
- privateBarkMethod.isAccessible = true
- val privateBarkMH = lookup.unreflect(privateBarkMethod)
- privateBarkMH.invoke(dog)
- private bark!

**[讲师备注]**
And in this example we are bypassing the encapsulation of a private method. First, we receive the Method with reflection, then we convert it to MethodHandle by calling unreflect function of lookup. Then we just call it.

## Slide 41
- MethodHandles: example
- We can also call any known method:
- val mt = MethodType.methodType(Int::class.javaPrimitiveType)
- val mh = lookup.findVirtual(List::class.java, "size", mt)
- val i = mh.invokeExact(listOf(1, 2, 3)) as Int
- println(i)
- 3

**[讲师备注]**
Here we are using a MethodType object to store a signature and locate a matching method in the List interface. The size method takes no arguments and returns an int, and then we are calling it on a list with, obviously, three elements.

## Slide 42
- MethodHandles: example
- We can also call any known method:
- val mt = MethodType.methodType(Int::class.javaPrimitiveType)
- val mh = lookup.findVirtual(List::class.java, "size", mt)
- val i = mh.invokeExact(listOf(1, 2, 3)) as Int
- println(i)
- In fact, invokeExact provide neither casting to the expected return class nor any conversions (like boxing/unboxing).

**[讲师备注]**
The difference between invoke and invokeExact in Java's method handles is how they handle types. invoke adapts argument types to fit the method handle's signature, making it more flexible but slower. invokeExact requires exact type matches, which makes it faster but less flexible.

## Slide 43
- MethodHandles: example
- We can also call any known method:
- val mt = MethodType.methodType(Int::class.javaPrimitiveType)
- val mh = lookup.findVirtual(List::class.java, "size", mt)
- val i = mh.invokeExact(arrayOf(1, 2, 3)) as Int
- println(i)
- Exception in thread "main" java.lang.invoke.WrongMethodTypeException: expected (List)int but found (Integer[])int 	at java.base/java.lang.invoke.Invokers.newWrongMethodTypeException(Invokers.java:523) 	at java.base/java.lang.invoke.Invokers.checkExactType(Invokers.java:532) 	at MainKt.main(Main.kt:71)

**[讲师备注]**
Anyway, all type checks are done and passing some unrelated to List type will fail.

## Slide 44
- Takeaways
- If you have the opportunity to solve a problem without reflection, do it.
- If you can't solve a problem without reflection, consider alternatives like MethodHandler.
- The Java Reflection API can be awkward to use, consider using Kotlin reflection instead.
- Be prepared to catch very strange and unusual bugs! :)

## Slide 45
- Thanks!
- @kotlin


--- 统计: 45 页, 41 页含讲师备注