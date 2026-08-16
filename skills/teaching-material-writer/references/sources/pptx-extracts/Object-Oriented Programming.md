# Object-Oriented Programming

共 42 页

## Slide 1
- Object-Oriented Programming
- Introduction and Basic Principles
- Kotlin
- @kotlin
- |  Developed by JetBrains

## Slide 2
- Object-oriented programming (OOP) – A programming paradigm based on the representation of a program as a set of objects and interactions between them
- Object-Oriented Programming

**[讲师备注]**
What is object-oriented programming (OOP)? OOP is a programming paradigm based on the representation of a program as a set of objects. 
Objects are data abstractions with internal representations (often called fields or properties) and methods for interacting with them. 
Most languages have a class-based OOP approach. What does that mean? Every object has a type. In a class-based approach, an object is an instance of a class. 
OOP itself is not a language specification or a specific language feature. OOP may be used with many languages. Some languages are even multi-paradigm. For example, you may use both OOP and functional programming (FP) with the same language. 
References: 
● Wikipedia, Object Oriented Programming – https://en.wikipedia.org/wiki/Object-oriented_programming

## Slide 3
- Class and Object
- Class – A set of attributes (fields, properties, data) and related methods (functions, procedures) that together represent some abstract entity.
- Attributes store state, while procedures express behavior.
- Classes are sometimes called prototypes.
- Object – An instance of a class, which has its own specific state.
- class Person:
- String attribute name
- Boolean attribute married
- Method greet
- Person x:
- name = "Olek",
- married = false
- x.greet()

**[讲师备注]**
Classes are an abstraction of what may exist, what attributes something should have, and how it can behave (that is, how you can interact with it). Objects, in contrast, represent something that actually does exist. 

A class is like a blueprint, and by following it you can build a representative of that class, i.e. a specific object.

## Slide 4
- Object (class/type) invariant
- Invariants place constraints on the state of an object, maintained by its methods right from construction.
- It is the object’s own responsibility to ensure that the invariant is being maintained.
- Corollaries:
- Public fields are nasty.
- If a field does not participate in the object’s invariant, then it is not clear how it belongs to this object at all, which is evidence of poor design choices.

**[讲师备注]**
Class invariants enable a form of reasoning called rely-guarantee. The idea is that you can rely on some things being true when they’re invoked. In other words, invariants are used to put some constraints on fields. 
For instance, if we have a class called Date containing day, month, and year fields, we’d like to be sure that the day property should have values between 1 and 31. 
Some programming languages have a built-in (native) syntax invariants, while others may require implementing it, for example by using assertions. 
However, every class implementation should guarantee that invariants are maintained. In other words, invariants should not be considered a language feature but rather an implementation-specific one. 
Invariants can play a role both when creating an object (in the example above, our demo-class Date should make sure the day is between 1 and 31 when creating a new object) and when updating its state (for example, the demo-class Date may provide the method setDay(day), and when it is invoked, we should also verify that the passed argument (day) is correct). 
By contrast, if the day field is public (that is, if it can be accessed directly), we cannot verify its value when updated. This means exposing public fields can be nasty. But at the same time, some programming languages may not provide us with access modifiers. 
References: 
Wikipedia. Class invariant – https://en.wikipedia.org/wiki/Class_invariant

## Slide 5
- Abstraction
- Objects are data abstractions with internal representations, along with methods to interact with those internal representations. There is no need to expose internal implementation details, so those may stay “inside” and be hidden.

**[讲师备注]**
Imagine we have a type Car, which contains multiple properties (states) and control methods, like startEngine() and stopEngine(). 
The implementation of these methods may be hidden, with the methods themselves being exposed by some kind of “contract” (interface). 
References: 
● Wikipedia. Abstraction (computer science) – https://en.wikipedia.org/wiki/Abstraction_(computer_science)

## Slide 6
- Encapsulation
- Encapsulation – The option to bundle data with methods operating on said data, which also allows you to hide the implementation details from the user.
- An object is a black box. It accepts messages and replies in some way.
- Encapsulation and the interface of a class are intertwined: Anything that is not part of the interface is encapsulated.
- OOP encapsulation differs from encapsulation in abstract data types.

**[讲师备注]**
Encapsulation is another fundamental principle of OOP programming that involves hiding implementation details. 
Let’s go back to the Car type example. The car’s engine can be started, and for this to happen some routines should be followed (e.g. check the fuel level, battery voltage, etc.). But the Car type can provide only the startEngine() method and hide the execution of all these routines from the outside world. 
References: 
What is encapsulation – https://www.dotnetfunda.com/articles/show/511/what-is-encapsulation

## Slide 7
- Abstraction vs Encapsulation
- Abstraction is about what others see and how they interact with an object.
- Encapsulation is about how an object operates internally and how it responds to messages.

**[讲师备注]**
What is the difference between abstraction and encapsulation? It seems they are similar and highly related. 
Abstraction means providing a generalization (and it may be functional abstraction or data abstraction). In short, you could say that abstraction dictates that some information is more important than other information, but (correctly) does not specify a specific mechanism for handling the unimportant information. 
Encapsulation means hiding the implementation details. We can hide both the state and some internal methods inside, prevent direct access, and expose only a limited number of methods. 
References: 
Abstraction, Encapsulation, and Information Hiding – http://www.tonymarston.co.uk/php-mysql/abstraction.txt  
Abstraction vs Encapsulation – https://www.javatpoint.com/abstraction-vs-encapsulation-in-java  
Stackoverflow. Abstraction vs Encapsulation – https://stackoverflow.com/questions/742341/difference-between-abstraction-and-encapsulation

## Slide 8
- Encapsulation
- Most programming languages provide special keywords for modifying the accessibility or visibility of attributes and methods.
- In Kotlin:
- publiс – Accessible to anyone
- private – Accessible only inside the class
- protected – Accessible inside the class and its inheritors
- internal – Accessible in the module

**[讲师备注]**
Support for encapsulation requires certain mechanisms for hiding the state (properties) and methods from the outside world. Most languages provide access modifiers – e.g. public and private, where public means accessible by everyone and private means accessible only inside the class. 
There are four access modifiers in Kotlin. In addition to private and public there are also: 
protected – Similar to private, but it allows access to a property/method inside both the class and its inheritors (we will talk about inheritance shortly).
internal – Visible inside the module. The visibility modifier is related to a project structure. A module is a set of source files compiled together, e.g. a Maven project. 
(optional) Access modifiers help us limit the visibility of properties/methods. Visibility may be validated at compile time. However, in many languages accessibility may be modified at runtime, e.g. using reflection. And let’s remember that some languages don’t have access modifiers at all. 
References: 
Kotlin visibility modifiers – https://kotlinlang.org/docs/visibility-modifiers.html

## Slide 9
- Inheritance
- Inheritance – The possibility to define a new class based on an already existing one, keeping all or some of the base class functionality (state/behavior).
- The class that is being inherited from is called a base or parent class
- The new class is called a derived class, a child, or an inheritor
- The derived class fully satisfies the specification of the base class, but it may have some extended features (state/behavior)

**[讲师备注]**
Inheritance is another fundamental principle of OOP. Using inheritance, we can introduce a type hierarchy where every inheritor will obtain features from the base class. Inheritors can also introduce new features and/or override (change) the inherited ones. 
Consider our car example again. There are actually different types of vehicles – light vehicles, trucks, buses, etc. But every truck has an engine, wheels, and a state (mileage, fuel level, etc.). So we can introduce a base type Vehicle first and implement the shared logic and state, then add specific vehicle types and set them up so that they inherit features from the Vehicle base type. 
References: 
Wikipedia. Inheritance (OOP)  – https://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)

## Slide 10
- Inheritance
- "General concept – specific concept".
- "Is-a" relationship.
- Motivation
- Keep shared code separate – in the base class – and reuse it.
- Type hierarchy, subtyping.
- Incremental design.
- Inheritance is often redundant and can be replaced with composition.

**[讲师备注]**
As we noted earlier, the base class may contain shared code that can be reused by its inheritors. For example, every vehicle can move, so the Vehicle type may have the move() method. Every vehicle has a state (e.g. mileage). The technique of extracting the shared characteristics and methods is called generalization. In this type of design, however, classes participating in a generalization relationship become tightly coupled. Any changes applied to the base class may affect its inheritors. 
On the contrary, any inheritor may have specific characteristics (for example, only trucks can have trailers). This is a specialization technique representing the so called "type-of relationship" (or "is-a" relationship, "truck is a vehicle").
In most scenarios, inheritance design can be replaced with composition. Composition can be captured with the phrase “one object is a part of another object”. Like inheritance, composition is a mechanism for reusing code and it also describes relationships between entities, but in this case there is no parent-child relationship.  
In our previous example, every Vehicle has an engine. Instead of keeping all the engine specifications in the Vehicle class, we can introduce additional Engine classes, establishing the relationship “All vehicle has an engine”. 
References: 
OOP Series. Composition – https://medium.com/geekculture/oop-series-composition-6c67a19cabd1  
Composition vs Inheritance – https://www.adservio.fr/post/composition-vs-inheritance#:~:text=The%20difference%20between%20inheritance%20and,class%2C%20thus%20breaking%20your%20code.

## Slide 11
- Subtyping
- An object can belong to several types (classes) at the same time
- Eleanor – A student, a woman, a beer enthusiast, and the reigning UFC champion.
- Nate – A developer, a man, an anime lover, and a recreational swimmer.
- Each type (class) defines an interface and expected behavior.
- So, in our example, while Eleanor is a student, she will exhibit a set of expected behaviors (such as turning in homework, studying for tests, etc.). When Eleanor gets her degree, she will stop being a student and she may cease to exhibit the associated behaviors, but her overall identity will not change and the behaviors associated with her other properties will be unaffected.

## Slide 12
- Subtyping
- Polygon
- Quadrangle
- Rectangle
- Square
- Rhombus
- Parallelogram
- IsoscelesTriangle
- RightTriangle
- Triangle

**[讲师备注]**
A simple type hierarchy is presented on the slide. Every type can have more than one inheritor. If the shape() method is introduced in the Polygon type and is visible to its inheritors (meaning the corresponding access modifier is specified), then this method will be available in all descendants, both direct (Quadrangle, Triangle) and indirect (Rectangle, Square etc.) 

At the same time, in this schematic example, no type has more than one base class, but that may in fact be possible in some programming languages. This kind of inheritance is called “multiple inheritance”, and it has been a controversial issue for years. Multiple inheritance may lead to something called the “Diamond Problem”. Consider the following pseudo code: 
class A:    
fun foo()
class B extends A:    
fun bar()
class C extends A:    
fun bar()
class D extends B, C:
fun baz() {       
foo() // implementation comes from A bar() // which bar exactly should we call, from type B or C?    
   }
References: 
Wikipedia. Multiple Inheritance – https://en.wikipedia.org/wiki/Multiple_inheritance

## Slide 13
- Polymorphism
- Polymorphism – A core OOP concept that refers to working with objects through their interfaces without knowledge about their specific types and internal structure.
- Inheritors can override and change the ancestral behavior.
- Objects can be used through their parents’ interfaces.
- The client code does not know (or care) if it is working with the base class or some child class, nor does it know what exactly happens “inside”.
- Liskov substitution principle (LSP) – If for each object o1 of type S, there is an object o2 of type T, such that for all programs P defined in terms of T the behavior of P is unchanged when o1 is substituted for o2, then S is a subtype of T.

**[讲师备注]**
Polymorphism = poly (many) + morphē (form).  
In computer science, polymorphism is the provision of a single interface to entities of different types. It describes situations in which something occurs in several different forms but provides similar methods to interact with.  
References: 
Wikipedia. Polymorphism (computer science) – https://en.wikipedia.org/wiki/Polymorphism_(computer_science)

## Slide 14
- OOP in Kotlin
- class UselessClass
- fun main() {
- val uselessObject = UselessClass() // () here is constructor invocation
- }

**[讲师备注]**
We’ve discussed fundamental OOP principles in general without talking about programming languages. Now let’s see how Kotlin helps us follow those principles.

## Slide 15
- class Person(val name: String, val surname: String, private var age: Int) {
- init {
- findJob()
- }
- constructor(name: String, parent: Person) : this(name, parent.surname, 0)
- }
- Constructors
- The order of initialization: the primary constructor -> the init block -> the secondary constructor
- The primary constructor, which is used by default. If it is empty, the brackets can be omitted
- The secondary constructor

**[讲师备注]**
To declare a class in Kotlin, we need the corresponding class keyword. In fact, at a bare minimum, you can declare a class with just a single line of code, e.g.: 
class Person(val name: String) 

Let’s have a look at the anatomy of a class declaration. In the example presented on the slide: 
class is the keyword for declaring a class. 
Person is the class name, which starts with capital letter – following Kotlin coding conventions.
(val name: String, val surname: String, private var age: Int)  – This part contains both class properties (fields) and the constructor. 
This type of constructor is called primary. But what if we need one more constructor? We can introduce an extra one using the constructor keyword inside the class. In such cases, the secondary constructor must call the primary constructor using this(), exactly as demonstrated on the slide. 
An init block can also be added. The presence of multiple constructors – primary, secondary, and initializer blocks – may seem confusing. Just remember the order of initialization: primary – init – secondary. This is relevant in cases where, for example, we create a person object like: 
val person = Person("Alex Fitch", parent)
A secondary constructor is used, but the primary one will be invoked first, then the init block, then the secondary constructor. 
You may also notice that the secondary constructor does not contain val or var. This is because class properties should be defined in the primary constructor, not the secondary one. 
(optional): If you’re feeling like constructors and init blocks seem complicated, you’re in luck. In most situations you won’t need all these features. To quote Andrey Breslav from the Q&A for his talk entitled “Kotlin for Android: plain and simple”: 
(Audience): What if I need more than one constructor? 
(Andrey): You don’t :)  
Why is this? Well, in other languages you may need multiple overloaded constructors. In Kotlin, it’s more concise to use default values, which will solve your issues in most scenarios, e.g.: 

class Person(val firstName: String, val lastName: String, var isEmployed: Boolean = true) 

In such cases, the argument isEmployed may be omitted when invoking the constructor: 

val p1 = Person("Alex", "Fitch") 
val p2 = Person("George", "Hoffman", false) 

Both instances of object creation are correct in the snippet above. 
References: 
Kotlin Classes – https://kotlinlang.org/docs/classes.html  
Kotlin Conding Conventions – https://kotlinlang.org/docs/coding-conventions.html  
Andrey Breslav, “Kotlin for Android: plain and simple” – https://www.youtube.com/watch?v=VU_L2_XGQ9s

## Slide 16
- open class Point(val x: Int, val y: Int) {
- constructor(other: Point) : this(other.x, other.y) { ... }
- constructor(circle: Circle) : this(circle.centre) { ... }
- }
- Constructors can be chained, but they should always call the primary constructor in the end.
- A secondary constructor’s body will be executed after the object is created with the primary constructor. If it calls other constructors, then it will be executed after the other constructors’ bodies are executed.
- Inheritor class must call parent’s constructor:
- class ColoredPoint(val color: Color, x: Int, y: Int) : Point(x, y) { ... }
- Constructors

**[讲师备注]**
If the derived class has a primary constructor, the base class can (and must) be initialized in that primary constructor according to its parameters. 
In the example above, the ColoredPoint class is inherited from Point, so the Point constructor must be invoked (the syntax is similar to secondary constructor declaration). 
You probably noticed the open keyword added to the Point class declaration. Why do we need this? We’ll talk about it in a few slides. 
References: 
Kotlin Inheritance – https://kotlinlang.org/docs/inheritance.html

## Slide 17
- class Example(val value: Int, info: String) {
- val anotherValue: Int
- var info = "Description: $info"
- init {
- this.info += ", with value $value"
- }
- val thirdValue = computeAnotherValue() * 2
- private fun computeAnotherValue() = value * 10
- init {
- anotherValue = computeAnotherValue()
- }
- }
- init blocks
- There can be several init blocks.
- Values can be initialized in init blocks that are written after them.
- Constructor parameters are accessible in init blocks, so sometimes you have to use this.

**[讲师备注]**
There may be more than one init block in a class. However, they are “joined” into a single init block, preserving the declaration order when executing. 
Here’s a slightly less intuitive example: 
class Example(val value: Int, info: String) {
   val anotherValue: Int
   var info = "Description: $info"

   init {
       this.info += ", with value $value"
   }

   constructor(value: Int) : this(value, "")

   val thirdValue = computeAnotherValue() * 2

   private fun computeAnotherValue() = value * 10

   init {
       anotherValue = computeAnotherValue()
   }
}

As you may have noticed, an extra secondary constructor is added between two init blocks. This does not affect the init blocks’ execution in any way. 
References: 
● Stackoverflow. Difference between init blocks and constructors in Kotlin – https://stackoverflow.com/questions/55356837/what-is-the-difference-between-init-block-and-constructor-in-kotlin 
 ● Init blocks – https://chetangupta.net/init-blocks/

## Slide 18
- interface RegularCat {
- fun pet()
- fun feed(food: Food)
- }
- interface SickCat {
- fun checkStomach()
- fun giveMedicine(pill: Pill)
- }
- Abstraction
- abstract class RegularCat {
- abstract val name: String
- abstract fun pet()
- abstract fun feed(food: Food)
- }
- abstract class SickCat {
- abstract val location: String
- abstract fun checkStomach()
- fun giveMedicine(pill: Pill) {}
- }
- Interfaces cannot have a state. (We’ll get back to this a bit later.)
- Abstract classes cannot have an instance, but can have a state.
- VS

**[讲师备注]**
Let’s get back to the OOP abstraction principle. 
One of the key abstraction tools is interface. An interface may be treated like a contract between the class implementing it and the outside world. Methods defined in an interface must all be implemented by a class. In Kotlin that would be checked at compile time. 
In Kotlin, interfaces can have not only abstract methods but also method implementations and properties (but not states). For example: 

interface UiObject {
   val title: String

   fun invalidate()

   fun printTitle() {
       println("Title: $title")
   }
}

class UiButton(override val title: String) : UiObject {
   override fun invalidate() {
       //…
   }
}

In this example, title is not a state; it’s a requirement for any class implementing that interface to have the title property. 
Abstract classes look like interfaces but may have a state and a constructor (or multiple constructors), though they still cannot be instantiated. 
Any class can implement multiple interfaces, but they extend only one abstract class. This is also a significant difference between the two. 
References: 
Kotlin Interfaces – https://kotlinlang.org/docs/interfaces.html  
Kotlin Abstract Classes https://kotlinlang.org/docs/classes.html#abstract-classes  
Kotlin Academy. Interface vs Abstract Class https://blog.kotlin-academy.com/abstract-class-vs-interface-in-kotlin-5ab8697c3a14

## Slide 19
- Encapsulation
- Private
- Protected
- Internal
- Public
- Class
- Inheritors
- Module
- Anyone

**[讲师备注]**
For encapsulation, we can heavily use access modifiers provided by Kotlin. Remember there are four modifiers: 
Private 
Protected 
Public 
Internal

## Slide 20
- abstract class RegularCat {
- protected abstract val isHungry: Boolean
- private fun poop(): Poop { /* do the thing */ }
- abstract fun feed(food: Food)
- }
- class MyCat : RegularCat() {
- override val isHungry: Boolean = false
- override fun feed(food: Food) {
- if (isHungry) { /* do the thing */ }
- else { poop() } // MyCat cannot poop
- }
- }
- Cannot access 'poop': it is invisible (private in a supertype) in 'MyCat'
- Encapsulation

**[讲师备注]**
In the example above, MyCat is the inheritor of the RegularCat type. Pay attention to the poop() method visibility modifier; it’s private, which means ”visible only inside the class”. If we try to use poop() in the inheritor, we will get a compile-time error. 
To fix this snippet, we can update the poop() signature and replace the private modifier with protected, which makes it visible inside the class and accessible by any inheritor. 
In both cases, poop() will be hidden from the outside world.

## Slide 21
- class SickDomesticCat : RegularCat(), CatAtHospital {
- override var isHungry: Boolean = false
- get() = field
- set(value) {...}
- override fun pet() {...}
- override fun feed(food: Food) {...}
- override fun checkStomach() {...}
- override fun giveMedicine(pill: Pill) {...}
- }
- Inheritance
- To allow a class to be inherited by other classes, the class should be marked with the open keyword. (Abstract classes are always open.)
- In Kotlin you can inherit only from one class, and from as many interfaces as you like.
- When you’re inheriting from a class, you have to call its constructor, just like how secondary constructors have to call the primary.

**[讲师备注]**
To extend a non-abstract class, that base class should have the open keyword in its declaration. Why? Kotlin follows the final by default principle. If not explicitly implemented as open (non-final), classes and methods are final. Why do you think this is the case? Well, one possible answer is that, if a developer wants a class to be used by other developers, they should design the class properly and mark it with the open keyword explicitly. When this is done, the open keyword is used as an indicator that the class is inheritable. 
Joshua Bloch introduced this helpful principle: 
> “Design and document for inheritance, or else prohibit it.”  (Joshua Bloch, Effective Java, Item 19) 
As mentioned earlier, one class may implement multiple interfaces, but it can extend only a single abstract class. PHave a look at the example on the slide and the class declaration. Of RegularCat and CatAtHospital, which one is an interface and which one is an abstract class? As we discussed earlier, abstract classes have a constructor. In this example we see the invocation of the base class constructor: RegularCat(). So it must be an abstract class. 
Unlike in some other languages, in Kotlin interfaces and abstract class can be specified in any order. Imagine we have two interfaces and one abstract class, so both of these variants are correct: 
class SickDomesticCat : RegularCat(), CatAtHospital, DomesticPet

and

class SickDomesticCat : DomesticPet, CatAtHospital, RegularCat()

Furthermore, this is also correct (interface – abstract class – interface): 

class SickDomesticCat : DomesticPet, RegularCat(), CatAtHospital


To implement an abstract method declared in an interface or abstract class, we must use the override keyword, as in the example above. 
References:
Kotlin Interfaces – https://kotlinlang.org/docs/interfaces.html 
Kotlin basics. Inheritance modifiers – https://medium.com/@HugoMatilla/kotlin-basics-inheritance-modifiers-final-open-abstract-and-override-b1072d728088 
Stackoverflow. Why are Kotlin classes final by default instead of open? – https://stackoverflow.com/questions/51680006/why-are-kotlin-classes-final-by-default-instead-of-open

## Slide 22
- abstract class Cat {
- /* final */ fun anotherDay() {
- // various cat activities
- digest(findFood())
- poop(findWhereToPoop())
- }
- private fun poop(where: Place): Poop {...}
- private fun digest(food: Food) {
- // don't know how they work
- poop(findWhereToPoop())
- }
- abstract fun feed(food: Food)
- abstract fun findWhereToPoop(): Place
- abstract fun findFood(): Food
- }
- Why do you prohibit a cat from pooping?!
- class DomesticCat(
- val tray: Tray,
- val bowl: Bowl
- ) : Cat() {
- override fun feed(food: Food) {
- // place some food in the bowl
- }
- override fun findWhereToPoop() = tray
- override fun findFood() {
- return bowl.getFood() ?: run {
- // find food somewhere else
- }
- }
- }

## Slide 23
- interface DomesticAnimal {
- fun pet()
- }
- class Dog: DomesticAnimal {
- override fun pet() {...}
- }
- class Cat: DomesticAnimal {
- override fun pet() {...}
- }
- fun main() {
- val homeZoo = listOf<DomesticAnimal>(Dog(), Cat())
- homeZoo.forEach { it.pet() }
- }
- Polymorphism revisited

**[讲师备注]**
Let’s return to the polymorphism principle and implement a simple example in Kotlin.  
In the code above, there are two domestic pets – Cat and Dog – in our type hierarchy. Each provides a pet() declared in the interface, but its implementation may be completely different. However, Cat may appear and be used in the same way as Dog, and vice-versa. We may add objects of both Cat and Dog types into the same collection and invoke pet() for each. 
References: 
Wikipedia. Polymorphism (computer science) – https://en.wikipedia.org/wiki/Polymorphism_(computer_science)

## Slide 24
- class PositiveAttitude(startingAttitude: Int) {
- var attitude = max(0, startingAttitude)
- set(value) =
- if (value >= 0) {
- field = value
- } else {
- println("Only positive attitude!")
- field = 0
- }
- var hiddenAttitude: Int = startingAttitude
- private set
- get() {
- if (isSecretelyNegative) {
- println("Don't ask this!")
- field += 10
- }
- return field
- }
- val isSecretelyNegative: Boolean
- get() = hiddenAttitude < 0
- }
- Properties
- Properties can optionally have an initializer, getter, and setter.
- Use the field keyword to access the values inside the getter or setter, otherwise you might encounter infinite recursion.
- Properties may have no (backing) filed at all.

**[讲师备注]**
Previously we saw that class properties can be defined via primary constructor: 
class Person(val age: Int)

val person = Person(21)
person.age
But properties may be also introduced in a class body: 
class Person {
   var fullname: String = ""
}

val person = Person()
person.fullname = "Alex Fitch"

Properties may have getters or setters explicitly defined, as in the example above. To obtain or update a field value, a backing field should be used. field is a special keyword and is only accessible within defined getters and setters. 
Visibility modifiers may also be applied to getters/setters. For example, private set means that that a property may be updated only inside the class. 
References: 
Kotlin Properties – https://kotlinlang.org/docs/properties.html  
Getters and Setters in Kotlin – https://www.baeldung.com/kotlin/getters-setters

## Slide 25
- open class OpenBase(open val value: Int)
- interface AnotherExample {
- /* abstract */ val anotherValue: OpenBase
- }
- open class OpenChild(value: Int) : OpenBase(value), AnotherExample {
- override var value: Int = 1000
- get() = field - 7
- override val anotherValue: OpenBase = OpenBase(value)
- }
- open class AnotherChild(value: Int) : OpenChild(value) {
- final override var value: Int = value
- get() = super.value // default get() is used otherwise
- set(value) { field = value * 2 }
- final override val anotherValue: OpenChild = OpenChild(value) // Notice that we use OpenChild here, not OpenBase
- }
- Properties
- Properties may be open or abstract, which means that their getters and setters might or must be overridden by inheritors, respectively.
- Interfaces can have properties, but they are always abstract.
- You can prohibit further overriding by marking a property final.

**[讲师备注]**
In addition to visibility modifiers, we can also control the final/non-final state. Keep in mind the “final by default” principle (except for interfaces). In the example above, the OpenBase class has a value property with an open keyword, which means that that property may be overridden in an inheritor and that custom getters and setters may be introduced. 
At the same time, we can add the final keyword in an inheritor. Take a look at the AnotherChild class, which has an overridden property value marked with the final keyword. If there is an inheritor like OneMoreChild(...) : AnotherChild(...), value cannot be overridden inside it. 
References: 
Stackoverflow. What is the `open` keyword for fields in Kotlin? – https://stackoverflow.com/questions/49076121/what-is-open-keyword-for-fields-in-kotlin

## Slide 26
- class Example {
- operator fun plus(other: Example): Example { ... }
- operator fun dec() = this // return type has to be a subtype
- operator fun get(i: Int, j: Int): SomeType { ... }
- operator fun get(x: Double?, y: String) = this
- operator fun <T> invoke(l: List<T>): SomeType { ... }
- }
- operator fun Example.rangeTo(other: Example): Iterator<Example> { ... }
- fun main() {
- var ex1 = Example()
- val ex2 = ex1 + --ex1 // -- reassigned ex1, so it has to be var
- for (ex in ex1..ex2) {
- ex[23, 42]
- ex[null, "Wow"](listOf(1,2,3))
- }
- }
- Operator overloading
- Operator “overloading” is allowed.
- Almost all operators can be overloaded.
- Operators can be overloaded outside of the class.

**[讲师备注]**
Let’s consider the following example: 
html {
   head {
       title { +"XML encoding with Kotlin" }
   }
}

Well, that’s Kotlin code, although it doesn’t look like code at all at first glance. We got this example from the Kotlin Typesafe Builders example, and it seems like an HTML DSL. But what is +"XML encoding with Kotlin"? If we try to compile this line, we will get an error. There is no unary + operator for strings in Kotlin. But how could that work? 
Kotlin allows us to overload operators. Almost every operator can be overloaded, including unary and binary arithmetic operators, indexed access operators, and more. Take a look at the Kotlin documentation for to see all the operators available for overloading. 
But in the example above, the unary + operator was used with String. How can we overload operators outside the type? A great option for introducing overloaded operators is to use extension functions! In such cases the base class is still untouched. 

operator fun String.unaryPlus(): String = this

Note that the operator keyword must be used. 

Just keep in mind that member functions take priority over extension functions. If there is an overloaded operator in any class, it cannot be overloaded with an extension function. 
Please check the kotlin.String class, where there is an operator: 
public operator fun plus(other: Any?): String

So we cannot overload the plus method which is the binary plus(formatted) operator. However, the unaryPlus() operator is available to be overloaded by an extension function. 
References: 
Operator Overloading – https://kotlinlang.org/docs/operator-overloading.html  
Type Safe Builders, DSL example – https://kotlinlang.org/docs/type-safe-builders.html

## Slide 27
- Kotlin provides the ability to extend a class or an interface with new functionality without having to inherit from the class or use forbidden magic (reflection)
- fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
- val tmp = this[index1] // 'this' is the given MutableList<T>
- this[index1] = this[index2]
- this[index2] = tmp
- }
- If the extended class already has the new method with the same name and signature, the original one will be used.
- Extensions

## Slide 28
- The class that is being extended does not change at all; it is simply a new function that can be called like a method. It cannot access private members, for example.
- Extensions have static dispatch, rather than virtual dispatch by receiver type. An extension function being called is determined by the type of the expression on which the function is invoked, not by the type of the result from evaluating that expression at runtime.
- open class Shape
- class Rectangle: Shape()
- fun Shape.getName() = "Shape"
- fun Rectangle.getName() = "Rectangle"
- fun printClassName(s: Shape) {
- println(s.getName())
- }
- printClassName(Rectangle()) // "Shape", not Rectangle
- Extensions under the hood

## Slide 29
- data class Person(val name: String, val surname: String)
- infix fun String.with(other: String) = Person(this, other)
- fun main() {
- val realHero = "Ryan" with "Gosling"
- val (real, bean) = realHero
- }
- Infix functions

**[讲师备注]**
Now let’s talk about infix functions. What are they? 
Take a look at this example:

infix fun String.with(other: String) = Person(this, other)

This looks like an extension function, right? But what does the infix keyword do?

Although infix functions are declared as extension functions (with only the infix keyword added), the invocation of infix functions looks different from that of extension functions. An extension function is invoked just as a regular function: 
"Ryan".with("Gosling")

But if a function is marked as infix, we can omit some symbols and get: 
"Ryan" with "Gosling"

It may appear that there are some limitations when declaring infix functions. In the example above, we’re unlikely to pass more than one argument: 
"Ryan" with "Gosling", 21 //won't compile

And indeed there are a few limitations: 
Infix functions must be member functions or extension functions. 
Infix functions must have a single parameter which must not have default value and/or accept a variable number of arguments (vararg) 
When using infix functions, pay attention to operator precedence. For example arithmetic operators have higher precedence than infix functions. 
References:
Kotlin Functions. Infix notation –https://kotlinlang.org/docs/functions.html#infix-notation 
Operator Precedence –https://kotlinlang.org/docs/reference/grammar.html#expressions

## Slide 30
- class SomeData(val list: List<Int>) {
- operator fun component1() = list.first()
- operator fun component2() = SomeData(list.subList(1, list.size))
- operator fun component3() = "This is weird"
- }
- fun main() {
- val sd = SomeData(listOf(1, 2, 3))
- val (head, tail, msg) = sd
- val (h, t) = sd
- val (onlyComponent1) = sd
- }
- ComponentN operator
- Any class can overload any number of componentN methods that can be used in destructive declarations.
- Data classes have these methods by default.

**[讲师备注]**
Destructuring declarations are available for more than just data classes. We can support that convention with a plain “non-data” class. 
To do so, we manually implement  componentN() methods. To support destructuring declarations, those methods must be declared with an operator keyword. 
In the example above, if we need to omit the head and obtain the tail only, we can use an underscore: 
val (_, tail) = sd

References: 
Kotlin Destructuring Declarations – https://kotlinlang.org/docs/destructuring-declarations.html  
Destructuring Declarations in Kotlin – https://www.baeldung.com/kotlin/destructuring-declarations

## Slide 31
- data class User(val name: String, val age: Int)
- The compiler automatically derives:
- equals() and hashCode()
- toString() of the form User(name=John, age=42)
- componentN() functions corresponding to the properties in their order of declaration.
- copy() to copy an object, allowing you to alter some of its properties while keeping the rest unchanged
- The standard library provides the Pair and Triple classes, but named data classes are a much better design choice.
- Data classes

**[讲师备注]**
Data classes are one more amazing feature of Kotlin. Take a look at the example on the slide. We already know that simple classes can be declared just with a single line of code. But what does the data keyword change? 
With the use of only a single keyword, a class can get all the features presented on the slide. The User class still has a single-line declaration, while all the methods are added implicitly and we can use them. For example, destructuring declarations may be used:
val user = User("Alex", 25)
val (name, age) = user

There are no component1,component2 methods declared explicitly in the class. These methods are generated under the hood by the Kotlin compiler.
However, there are also some requirements and limitations: 
A data class constructor needs to have at least one property declared.
All constructor parameters need to be marked as either val or var. 
A data class cannot be abstract, open, sealed, or inner. 
The copy() and componentN() methods cannot be overridden. 
(optional) 
While doing your own research on the internet, you may come across questions like “How are tuples used in Kotlin?”. Well, there are no tuples. Consider the following pseudo-code example: 
fun getCoordinates() {
   x = 1
   y = 1
   return (x, y)
}

x, y = getCoordinates()

Without tuples, we cannot implement this the same way in Kotlin. But we actually don’t really need them. Instead we can introduce a simple data class and use destructuring declarations, so the pseudo-code example may be written in Kotlin like this: 
fun getCoordinates(): Point {
   return Point(2,3)
}

val (x, y) = getCoordinates()

Data classes are “cheap”, meaning you can easily add a data class with a single line of code. And the good thing is that multiple data classes may be declared in the same source file. 
References: 
Kotlin Data Classes – https://kotlinlang.org/docs/data-classes.html 
Data Classes in Kotlin – https://www.baeldung.com/kotlin/data-classes

## Slide 32
- Occasionally you have to wrap a class, but wrapping always causes overhead in both memory and execution time. Inline classes may help you get the desired behavior without paying for it with a drop in performance.
- interface Greeter {
- fun greet(): Unit
- }
- class MyGreeter(var myNameToday: String) : Greeter {
- override fun greet() = println("Hello, $myNameToday!")
- }
- @JvmInline
- /* final */ value class BadDayGreeter(val greeter: Greeter) : Greeter {
- override fun greet() {
- greeter.greet()
- println("Having a bad day, huh?")
- }
- }
- Inline (value) classes
- var greeter: Greeter = MyGreeter("Cyr")
- if (today.isBad()) { greeter = BadDayGreeter(greeter) }
- greeter.greet()

**[讲师备注]**
Inline classes are an optimization feature in Kotlin. If we target the JVM, we can use the @JvmInline annotation for our class wrapper, and all the other magic will be done by Kotlin compiler. In our code, it still looks like a regular class, but under the hood it is inlined to get performance or memory gains. 
References: 
Kotlin Inline Classes – https://kotlinlang.org/docs/inline-classes.html  
Value-based classes https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md

## Slide 33
- An Inline class must have exactly one primary constructor parameter,
- Inline classes can implement interfaces, declare properties (no backing fields), and have init blocks.
- Inline classes are not allowed to participate in a class hierarchy, which is to say they are automatically marked with the "final" keyword.
- The compiler tries to use the underlying type to produce the most performant code.
- @JvmInline
- /* final */ value class Name(val name: String) : Greeter {
- init {
- require(name.isNotEmpty()) { "An empty name is absurd!" }
- }
- // val withABackingField: String = "Not allowed"
- var length: Int
- get() = name.length
- set(value) { println("What do you expect to happen?") }
- override fun greet() { println("Hello, $name") }
- }
- Inline (value) classes

**[讲师备注]**
Inline classes are a subset of value-based classes. They don't have an identity and can only hold values. 
There are some limitations to keep in mind: 
Inline classes must have a single property initialized in the primary constructor. 
Inline classes must not participate in the type hierarchy. They may, however, implement interfaces. 
Getters and setters for the properties of inline classes cannot use backing fields.

## Slide 34
- Since inline classes are just wrappers and the compiler tries to use the underlying type, name mangling is introduced to solve possible signature clashing problems.
- fun foo(name: Name) { ... } -> public final void foo-<stable-hashcode>(name: String) { ... }
- fun foo(name: String) { ... } -> public final void foo(name: String) { ... }
- If you want to call such a function from Java code, then you should use the @JvmName annotation.
- @JvmName("fooName")
- fun foo(name: Name) { ... } -> public final void fooName(name: String) { ... }
- Inline (value) classes

**[讲师备注]**
An inline class is not a class under the hood. In the example above, Name is a wrapper for String. This means that under the hood we may get two functions with the same declarations (roughly speaking, Name will be replaced with String). To overcome function signatures clashing, inline class method names are mangled. 
But if they’re mangled, how can we use them from, let’s say, a Java application? We have to use one more annotation, @JvmName, to set the method names explicitly and to disable mangling. 
References: 
Koltin Inline Classes. Mangling – https://kotlinlang.org/docs/inline-classes.html#mangling

## Slide 35
- enum class Direction {
- NORTH, SOUTH, WEST, EAST
- }
- Each enum constant is an object. Each enum is an instance of the enum class, thus it can be initialized as:
- enum class Color(val rgb: Int) {
- RED(0xFF0000),
- GREEN(0x00FF00),
- BLUE(0x0000FF)
- }
- Enum classes can have methods or even implement interfaces.
- Enum classes

**[讲师备注]**
Enum is short for enumeration and refers to a set of predefined constants.  Why do we need it? Imagine we need to implement a compass. How would we describe the “NSWE” fixed set of directions? One possible option is no encode it with number constants: 
const val NORTH = 1
const val SOUTH = 2

But in such cases, this is still the Int type under the hood, so we don’t get any extra benefits or compile-time validations. But what is even more dangerous is that we may get confused about the constants and use the wrong one, e.g.: 
compass.getDirection() == Consts.MUNICH

Here, Consts.MUNICH could be the ID of a city declared as const val MUNICH = 313, but not a direction code. Under the hood all the constants are still Int, so we will get an error when we compile and run the code. 
In Kotlin, enum is a class. Each enum constant is an object. So can we add methods and properties? Yes, we can! For example, for the Color enum we may add rgb values as demonstrated on the slide. 
Methods are also allowed. We can introduce an abstract method inside the Color class, and every constant (object) must implement that method: 
enum class Color(val rgb: Int) {
   RED(0xFF0000) {
       override fun cmyk() {
           //...
       }
   },
   GREEN(0x00FF00) {
       override fun cmyk() {
           //...
       }
   };

   abstract fun cmyk();
}

Like abstract methods declared inside the class, enum classes can implement an interface (or multiple interfaces). 
To access the enum constant, we simply write Color.RED. 
References: 
Enum Classes – https://kotlinlang.org/docs/enum-classes.html  
Stackoverflow. Why use enums instead of constants? – https://stackoverflow.com/questions/11575376/why-use-enums-instead-of-constants-which-is-better-in-terms-of-software-design

## Slide 36
- val user = User("John", 23)
- val (name, age) = user // destructing declaration calls componentN()
- val (onlyName) = user
- val olderUser = user.copy(age = 42)
- val g = Color.valueOf("green".uppercase())
- when(g) {
- Color.RED -> println("blood")
- Color.GREEN -> println("grass")
- Color.BLUE -> println("sky")
- }
- Kotlin example

**[讲师备注]**
Let’s have a look at one more example of working with enums. Enums provide helper methods, for example, for getting the enum constant by name using the valueOf method. 
Enums can be also used with when clauses, as demonstrated in the slide. We have to either write a case for each enum constant (in the slide), or we can omit some constants using an else clause, e.g.: 
when (g) {
   Color.RED -> println("blood")
   else -> println("unknown")
}
Not covering all enum constants in the when expression will lead to a compilation error. Same applies to booleans and sealed classes.

References: 
Working with enum constants – https://kotlinlang.org/docs/enum-classes.html#working-with-enum-constants

## Slide 37
- sealed class Base {
- open var value: Int = 23
- open fun foo() = value * 2
- }
- open class Child1 : Base() {
- override fun foo() = value * 3
- final override var value: Int = 10
- set(value) = run { field = super.foo() }
- }
- class Child2 : Base()
- val b: Base = Child1()
- when(b) {
- is Child1 -> println(1)
- is Child2 -> println(2)
- }
- Sealed classes
- All of the inheritors of a sealed class must be known at compile time.
- Can be used in when the same way as enums can be.
- Not specific to sealed classes:
- Prohibit overriding an open fun or property by making it final.
- Access parents’ methods through super.

**[讲师备注]**
Sealed classes offer one more way of implementing classes in Kotlin. When the sealed keyword is added to a class declaration, it introduces some limitations to the type hierarchy. If a class is sealed, its inheritors must all be defined in the same module and known at compile time. This gives us more control over inheritance and allows us to guarantee that no other subclasses (inheritors) can appear outside. 
A sealed class is itself abstract – so no open modifier is required – and it cannot be instantiated. 
As a sealed class hierarchy is restricted, it’s possible to verify that all cases are covered when the when expression is used. 
References: 
Kotlin Sealed Classes – https://kotlinlang.org/docs/sealed-classes.html

## Slide 38
- Single Abstract Method (SAM) interface
- Interface that has one abstract method.
- Kotlin allows us to use a lambda instead of a class definition to implement a SAM.
- Functional interfaces (SAM)
- fun interface IntPredicate {
- fun accept(i: Int): Boolean
- }
- val isEven = object : IntPredicate {
- override fun accept(i: Int): Boolean {
- return i % 2 == 0
- }
- }
- val isEven = IntPredicate { it % 2 == 0 }
- fun main() {
- println("Is 7 even? - ${isEven.accept(7)}")
- }
- vs

**[讲师备注]**
A Single Abstract Method (SAM) interface is an interface that has only one abstract method. A classic example is the UI action listener interface: 
interface ActionListener {

   /**
    * Invoked when an action occurs.
    */
   fun actionPerformed(event: ActionEvent);
}

In many languages, such interfaces are used heavily.  
In Kotlin we can introduce the SAM interface as well. In addition, instead of implementing interfaces and having extra class or object expressions (as shown on the slide) we may use lambdas. 
If we’re using any Java library in our Kotlin project, we can use lambdas for Java SAM interfaces as well. For example: 
import javax.swing.Jbutton

val button = JButton()
button.addActionListener { println("Button clicked") }

References: 
Kotlin Functional Interfaces (SAM) – https://kotlinlang.org/docs/fun-interfaces.html  
SAM Conventions in Kotlin – https://www.baeldung.com/kotlin/sam-conversions

## Slide 39
- object DataProviderManager {
- fun registerDataProvider(provider: DataProvider) {
- // ...
- }
- val allDataProviders: Collection<DataProvider>
- get() = // ...
- }
- DataProviderManager.registerDataProvider(...)
- Kotlin singleton

**[讲师备注]**
We’ve discussed many OOP principles and aspects. Now it’s time to talk about design patterns. 
What are design patterns? 
In general, a design pattern is a typical solution to commonly occurring problems in software design. 
Design patterns are not bound to any specific programming language, instead, the same design pattern may be implemented in slightly different ways in different languages. 
But why are we talking about design patterns in this Koltin lecture? The thing is that Kotlin provides us with a built-in implementation of one design pattern called a “singleton”. 
A singleton is a design pattern that restricts the instantiation of a class to a singular instance. Typically singletons are supposed to be globally accessible. 
Critics consider singletons to be anti-pattern. Why? One reason is that using them may increase code coupling and may lead to hidden dependencies in the code, so they must be used wisely. 
There are different techniques for implementing singletons in different programming languages. However, Kotlin simplifies singletons greatly – let’s see how. 

Take a look at the code on the slide. It looks like a class, right? But instead of the class keyword we see the object keyword. The object keyword is our way of implementing the singleton pattern in Kotlin. It’s also called “Object Declaration”.  A declared object initialization is made in a thread-safe manner and occurs on first access. To access the object and its methods, use the object name directly:
 
DataProviderManager.registerDataProvider(...)
This looks like a static field access, right? That’s what we’ll be covering next. 
  
References: 
Wikipedia. Design Patterns https://en.wikipedia.org/wiki/Software_design_pattern  
Wikipedia. Gang of Four Design Patterns https://en.wikipedia.org/wiki/Design_Patterns  
Wikipedia. Singleton Pattern https://en.wikipedia.org/wiki/Singleton_pattern  
Singletons are evil https://wiki.c2.com/?SingletonsAreEvil  
Singletons are good https://wiki.c2.com/?SingletonsAreGood  
Object Declarations https://kotlinlang.org/docs/object-declarations.html#object-declarations-overview

## Slide 40
- An object declaration inside a class can be marked with the companion keyword.
- Companion objects are like static members:
- The Factory Method
- Constants
- Etc.
- Visibility modifiers are applicable.
- Use @JvmStatic to go full static.
- Companion objects
- interface Factory<T> {
- fun create(): T
- }
- class MyClass {
- companion object : Factory<MyClass> {
- private var counter: Int = 0
- override fun create(): MyClass =
- MyClass().also { counter += 1}
- }
- // … some code …
- }
- val f: Factory<MyClass> = MyClass.Companion
- val instance1 = f.create()
- val instance2 = f.create()

**[讲师备注]**
As you probably noticed, there were no static keywords in any of our code snippets. Kotlin doesn’t contain static keywords. 
But there are companion objects. An object declaration inside any class can be enhanced with the companion keyword. In such a case, the companion object’s members can be called simply by using the class name as the qualifier, without any need to create that class instance (object). 
Using companion objects we may implement a static factory method. In the example, we can simply write: 
MyClass.create()

So create() looks like a static method of MyClass, but in fact it is a companion object member function. 
Another use-case scenario is static constants. Using companion objects we may define constants accessible without class instantiation: 
class MyClass {
   companion object {
       const val MY_VALUE = 1
   }
}

print("Const value: ${MyClass.MY_VALUE}")

MY_VALUE defined inside the companion object is accessible without MyClass object instance similar to a static constant.

References: 
Kotlin Companion Objects – https://kotlinlang.org/docs/object-declarations.html#companion-objects  
Static Methods Behavior in Kotlin – https://www.baeldung.com/kotlin/static-methods

## Slide 41
- Kotlin Type Hierarchy
- Int
- Any
- String
- List<T>
- Parent
- MutableList<T>
- Child
- Nothing
- Int?
- Any?
- String?
- List<T>?
- Parent?
- MutableList<T>?
- Child?
- Nothing?

## Slide 42
- Thanks!
- @kotlin
- |  Developed by JetBrains


--- 统计: 42 页, 35 页含讲师备注