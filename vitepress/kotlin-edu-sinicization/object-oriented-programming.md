# 面向对象编程——简介与基本原理

::: info
本文翻译自：https://kotlinlang.org/education/
:::

**面向对象编程（Object-oriented programming，OOP）** —— 一种将程序表示为一组对象及其之间交互关系的编程范式

::: info
什么是面向对象编程（OOP）？OOP 是一种基于将程序表示为一组对象的编程范式。对象是具有内部表示（通常称为字段或属性）以及用于与其交互的方法的数据抽象。大多数语言都采用基于类的 OOP 方法。这意味着什么？每个对象都有一个类型。在基于类的方案中，对象是类的实例。

OOP 本身并非一种语言规范或特定的语言特性。OOP 可应用于多种语言。有些语言甚至支持多范式。例如，你可以在同一门语言中同时使用 OOP 和函数式编程（FP）。
:::

## 类和对象

**类 Class** —— 一组属性（字段、属性、数据）及其相关方法（函数、过程），它们共同表示某种抽象实体。

属性用于存储状态，而过程则用于表达行为。

类有时也被称为原型。

**对象 Object** —— 类的实例，具有其自身的特定状态。

```Text
class Person:
- String attribute name
- Boolean attribute married
- Method greet

Person x:
    name = "Olek",
    married = false

x.greet()
```

::: info
类是对可能存在的事物、事物应具备的属性以及其行为方式（即如何与之交互）的一种抽象。相比之下，对象则代表实际存在的事物。

类就像是一份蓝图，遵循这份蓝图，你就可以构建该类的实例，即一个具体的对象。
:::

## 对象（类/类型）不变式

不变式对对象的状态施加了约束，这些约束从对象创建之初就由其方法来维护。确保维持不变式<ins>是对象自身的责任</ins>。

推论：

- 公共 `public` 字段是不佳的。
- 如果某个字段不参与对象的不变式约束，那么它究竟为何属于该对象就变得难以理解，这通常是设计选择不当的证据。

::: info
类不变式支持一种称为“依赖-保证”的推理方式。其核心思想是：在调用某些方法时，可以确信某些条件成立。换言之，不变式用于对字段施加约束。

例如，若有一个名为 `Date` 的类，包含 `day`、`month` 和 `year` 字段，我们需要确保 `day` 属性的取值范围在 1 到 31 之间。

某些编程语言内置了（原生）的不变式语法，而其他语言可能需要通过实现来支持，例如使用断言。

然而，每个类实现都应保证不变式的有效性。换言之，不应将不变式视为语言特性，而应视为实现层面的特性。

不变式既可在创建对象时发挥作用（如上例中，示例类 `Date` 在创建新对象时应确保 `day` 值在 1 到 31 之间），也可在更新其状态时发挥作用（例如，示例类 `Date` 可能提供 `setDay(day)` 方法，当该方法被调用时，我们也应验证传入的参数 `(day)` 是否正确）。

相比之下，如果 `day` 字段是 `public` 的（即可以直接访问的 `public` 字段），我们便无法在更新时验证其值。这意味着暴露 `public` 字段可能带来麻烦。但与此同时，某些编程语言可能不提供访问修饰符。
:::

## 抽象

对象是具有内部表示的数据抽象，并包含用于与这些内部表示进行交互的方法。由于无需暴露内部实现细节，因此这些细节可以保留在“内部”并被隐藏起来。

::: info
假设我们有一个 `Car` 类型，它包含多个属性（状态）和控制方法，例如 `startEngine()` 和 `stopEngine()`。

这些方法的实现可以被隐藏，而方法本身则通过某种“契约”（接口）对外暴露。
:::

## 封装

封装 —— 一种将数据与其相关的方法打包在一起的机制，同时还能向用户隐藏实现细节。

- 对象是一个黑盒子。它接收消息，并以某种方式进行响应。
- 封装与类的接口密不可分：凡是不属于接口的内容，均被封装起来。
- 面向对象编程中的封装与抽象数据类型中的封装有所不同。

::: info
封装是面向对象编程的另一项基本原则，涉及隐藏实现细节。

让我们回到 `Car` 类型的例子。汽车的发动机可以启动，而要实现这一点，需要遵循一些流程（例如检查燃油量、电池电压等）。但 `Car` 类型只需提供 `startEngine()` 方法，并将所有这些流程的执行过程对外部隐藏起来。
:::

## 抽象 vs 封装

抽象关注的是他人如何看待对象以及如何与之交互。

封装关注的是对象的内部运作方式以及它如何响应消息。

::: info
抽象和封装有什么区别？它们似乎很相似且密切相关。

抽象是指提供一种概括（可能是函数抽象或数据抽象）。简而言之，可以说抽象规定了某些信息比其他信息更重要，但（正确地）并未指定处理不重要信息的具体机制。

封装是指隐藏实现细节。我们可以将内部的状态和某些内部方法隐藏起来，防止直接访问，并仅暴露有限数量的方法。
:::

## 封装

大多数编程语言都提供了专门的关键词，用于修改属性和方法的访问权限或可见性。

在 Kotlin 中：

- `public` - 任何人都可访问
- `private` - 仅限<ins>类</ins>内部访问
- `protected` - <ins>类</ins>及其<ins>子类</ins>均可访问
- `internal` - 仅限<ins>模块</ins>内部访问

::: info
要实现封装，需要某些机制来将状态（属性）和方法隐藏起来，使其不被外部访问。大多数编程语言都提供了访问修饰符——例如 `public` 和 `private`，其中 `public` 表示对所有人可见，`private` 表示仅在类内部可见。Kotlin 中有四种访问修饰符。除了 `private` 和 `public` 之外，还有：

- `protected` - 与 `private` 类似，但允许在类及其继承类内部访问该属性/方法（我们稍后会讨论继承）。
- `internal` - 在模块内部可见。可见性修饰符与项目结构相关。模块是一组被一起编译的源文件，例如一个 Maven 项目。

（可选） 访问修饰符有助于我们限制属性/方法的可见性。可见性通常在编译时进行验证。然而，在许多语言中，访问权限可在运行时进行修改，例如通过反射。此外，请注意有些语言根本不提供访问修饰符。
:::

## 继承

继承 —— 基于已有的类定义新类，同时保留基类全部或部分功能（状态/行为）的能力。

- 被继承的类称为基类或父类
- 新类称为派生类、子类或继承类
- 派生类完全满足基类的规范，但可能具有一些扩展功能（状态/行为）

::: info
继承是面向对象编程的另一项基本原则。通过继承，我们可以建立类型层次结构，其中每个派生类都会从基类继承特性。派生类还可以引入新特性，并/或重写（修改）已继承的特性。

让我们再次以 Car 为例。实际上存在多种类型的车辆——轻型车、卡车、公交车等。但每辆卡车都拥有发动机、车轮以及状态（里程、油量等）。因此，我们可以先引入一个基类 `Vehicle` 并实现共有的逻辑和状态，然后添加具体的车辆类型，并将其配置为从 `Vehicle` 基类继承特性。
:::

- “总概念——具体概念”。
  - “……是……的”关系。
- 设计意图
  - 将共用的代码独立出来——放在基类中——以便复用。
  - 类型层次结构、子类型。
  - 增量设计。
- 继承往往是多余的，可以用组合来替代。

::: info
正如我们之前指出的，基类可能包含可供其子类复用的共享代码。例如，每辆车都能移动，因此 `Vehicle` 类型可能包含 `move()` 方法。每辆车都有一个状态（例如里程数）。提取这些共享特征和方法的技术称为泛化。然而，在此类设计中，参与泛化关系的类之间会形成紧密耦合。对基类所做的任何更改都可能影响其子类。

相反，任何子类都可能具有特定特征（例如，只有卡车才可能拖挂拖车）。这是一种称为“类型关系”（或“是”关系，“卡车是车辆”）的特化技术。

在大多数情况下，继承设计可以被组合设计所替代。组合可以用“一个对象是另一个对象的组成部分”这一短语来描述。与继承类似，组合是一种代码复用机制，同样描述了实体之间的关系，但在此情况下不存在父子关系。

在我们之前的示例中，每辆 `Vehicle` 都有一个 `Engine`。与其将所有发动机规格保存在 `Vehicle` 类中，我们不妨引入额外的 `Engine` 类，从而建立“所有车辆都有发动机”的关系。
:::

## 子类型

一个对象可以同时属于多种类型（类）

- 埃莉诺（Eleanor） —— 一名学生、一名女性、一名啤酒爱好者，以及现任 UFC 冠军。
- 内特（Nate） —— 一名开发者、一名男性、一名动漫爱好者，以及一名业余游泳者。

每种类型（类）都定义了一个接口及其预期行为。

因此，在我们的例子中，虽然埃莉诺是一名学生，她会表现出一系列预期行为（例如交作业、备考等）。当埃莉诺获得学位后，她将不再是学生，可能不再表现出相关的行为，但她的整体身份不会改变，与她的其他属性相关的行为也不会受到影响。

![](/assets/kotlin-edu-sinicization/oop-subtyping.png)

::: info
幻灯片上展示了一个简单的类型层次结构。每个类型都可以拥有多个继承者。如果在多边形 `Polygon` 类型中引入了 `shape()` 方法，并且该方法对它的子类可见（即指定了相应的访问修饰符），那么该方法将在所有子类中可用，包括直接子类（四边形、三角形）和间接子类（矩形、正方形等）。

同时，在这个示意图示例中，没有类型拥有多个基类，但在某些编程语言中这实际上是可能的。这种继承被称为“多重继承”，多年来一直是一个有争议的问题。多重继承可能会导致所谓的“菱形问题”。请看以下伪代码：

```Kotlin
class A :
    fun foo()

class B extends A:
    fun bar()

class C extends A:
    fun bar()

class D extends B, C:
    fun baz() {
        foo() //实现来自 A
        bar() // 究竟应该调用 B 类型的 bar 还是 C 类型的 bar？
    }
```

:::

## 多态

多态 —— 面向对象编程的核心概念，指通过对象的接口与其交互，而无需了解其具体类型和内部结构。

- 继承类可以重写并更改基类的行为。
- 对象可以通过其父类的接口被使用。
  - 客户端代码既不知道（也不关心）自己正在与基类还是某个子类交互，也不了解“内部”究竟发生了什么。

里氏替换原则 (Liskov substitution principle，LSP) —— 若对于类型 `S` 的每个对象 `o1`，都存在一个类型 `T` 的对象 `o2`，使得对于所有基于 `T` 定义的程序 `P`，当用 `o1` 替换 `o2` 时，`P` 的行为保持不变，则 `S` 是 `T` 的子类型。

::: info
多态 = poly（多）+ morphē（形态）。

在计算机科学中，多态是指为不同类型的实体提供单一接口。它描述了某种事物以多种不同形式存在，但提供类似交互方法的情况。
:::

## Kotlin 中的面向对象编程

```Kotlin
class UselessClass

fun main() {
	val uselessObject = UselessClass() // 这里的 () 表示构造函数调用
}
```

::: info
我们之前讨论了面向对象编程的基本原则，但并未涉及具体编程语言。现在让我们看看 Kotlin 是如何帮助我们遵循这些原则的。
:::

## 构造函数

```Kotlin
class Person(val name: String, val surname: String, private var age: Int) {
            // ↑ 主要构造函数，默认使用。如果构造函数为空，可以省略括号
    init {
        findJob()
    }
                 // ↓ 次要构造函数
    constructor(name: String, parent: Person) : this(name, parent.surname, 0)
}
```

初始化顺序：主要构造函数 -> `init` 代码块 -> 次要构造函数

::: info
要在 Kotlin 中声明一个类，我们需要使用相应的 `class` 关键字。实际上，最简单的情况下，仅需一行代码即可声明一个类，例如：

```Kotlin
class Person(val name: String)
```

让我们来看看类声明的结构。在幻灯片中给出的示例中：

- `class` 是声明类的关键字。
- `Person` 是类名，遵循 Kotlin 编码规范，以大写字母开头。
- `(val name: String, val surname: String, private var age: Int)` – 这部分包含类属性（字段）和构造函数。

这种构造函数被称为主构造函数。但如果我们需要另一个构造函数呢？我们可以在类内部使用 `constructor` 关键字引入一个额外的构造函数。在这种情况下，次要构造函数必须通过 `this()` 调用主要构造函数，正如幻灯片中所示。

还可以添加一个 `init` 代码块。多个构造函数（主要、次要和初始化代码块）的存在可能让人感到困惑。只需记住初始化的顺序：主要 – `init` – 次要。这在某些情况下尤为重要，例如当我们创建一个 `person` 对象时：

```Kotlin
val person = Person("Alex Fitch", parent)
```

虽然使用了次要构造函数，但系统会先调用主要构造函数，接着是 `init` 块，最后才是次要构造函数。

你可能还会注意到，次要构造函数中不包含 `val` 或 `var`。这是因为类属性应在主要构造函数中定义，而非次要构造函数。

（可选）：如果你觉得构造函数和 `init` 代码块似乎很复杂，那你很走运。在大多数情况下，你并不需要这些特性。引用 Andrey Breslav 在其题为“Kotlin for Android: plain and simple”的演讲问答环节中的话：

- （听众）：如果我需要多个构造函数怎么办？
- （Andrey）：你不需要 :)

这是为什么呢？在其他语言中，你可能需要多个重写构造函数。而在 Kotlin 中，使用默认值更为简洁，这在绝大多数场景下都能解决你的问题，例如：

```Kotlin
class Person(val firstName: String, val lastName: String, var isEmployed: Boolean = true)
```

在这种情况下，调用构造函数时可以省略 `isEmployed` 参数：

```Kotlin
val p1 = Person("Alex", "Fitch")
val p2 = Person("George", "Hoffman", false)
```

上述代码片段中的两个对象实例化方式都是正确的。
:::

```Kotlin
open class Point(val x: Int, val y: Int) {
    constructor(other: Point) : this(other.x, other.y) { ... }

    constructor(circle: Circle) : this(circle.centre) { ... }
}
```

构造函数可以进行链式调用，但最终必须调用主构造函数。

次要构造函数的本体将在使用主要构造函数创建对象后执行。如果它调用了其他构造函数，则将在其他构造函数的本体执行完毕后执行。

继承类必须调用父类的构造函数：

```Kotlin
class ColoredPoint(val color: Color, x: Int, y: Int) : Point(x, y) { ... }
```

::: info
如果派生类拥有主要构造函数，则必须在该主要构造函数中根据其参数初始化基类。

在上例中，`ColoredPoint` 类继承自 `Point`，因此必须调用 `Point` 的构造函数（语法与次级构造函数的声明类似）。

你可能已经注意到 `Point` 类声明中添加了 `open` 关键字。为什么需要它？我们将在接下来的几张幻灯片中讨论。
:::

## `init` 代码块

```Kotlin
class Example(val value: Int, info: String) {
   val anotherValue: Int
   var info = "Description: $info"

   init {
       this.info += ", with value $value"
   }

   val thirdValue = computeAnotherValue() * 2

   private fun computeAnotherValue() = value * 10

   init {
       anotherValue = computeAnotherValue()
   }
}
```

可以有多个 `init` 块。

可以在位于这些 `init` 块后面的 `init` 块中初始化变量。

构造函数参数在 `init` 块中是可访问的，因此有时必须使用 `this`。

::: info

一个类中可能包含多个 `init` 代码块。不过，它们会被“合并”成一个 `init` 代码块，并在执行时保留声明顺序。

以下是一个稍显晦涩的示例：

```Kotlin
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
```

你可能已经注意到，两个 `init` 块之间添加了一个额外的次要构造函数。这不会以任何方式影响 `init` 块的执行。
:::

## 抽象

```Kotlin
interface RegularCat {
    fun pet()
    fun feed(food: Food)
}

interface SickCat {
    fun checkStomach()
    fun giveMedicine(pill: Pill)
}
```

接口**不能有**状态。（我们稍后会再回到这一点。）

```Kotlin
abstract class RegularCat {
    abstract val name: String

    abstract fun pet()
    abstract fun feed(food: Food)
}

abstract class SickCat {
    abstract val location: String

    abstract fun checkStomach()
    fun giveMedicine(pill: Pill) {}
}
```

抽象类不能拥有实例，但可以**拥有**状态。

::: info
让我们回到面向对象编程的抽象原则。

接口是关键的抽象工具之一。接口可以被视为实现该接口的类与外部世界之间的契约。接口中定义的方法必须全部由类来实现。在 Kotlin 中，这会在编译时进行检查。

在 Kotlin 中，接口不仅可以包含抽象方法，还可以包含方法实现和属性（但不包含状态）。例如：

```Kotlin
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
```

在此示例中，`title` 并非状态；它是任何实现该接口的类都必须具备的 `title` 属性。

抽象类的外观与接口相似，但可能包含状态和构造函数（或多个构造函数），尽管它们仍然无法被实例化。

任何类都可以实现多个接口，但只能继承一个抽象类。这也是二者之间的一项显著区别。
:::

## 封装

![](/assets/kotlin-edu-sinicization/oop-encapsulation.png)

::: info
在封装方面，我们可以大量使用 Kotlin 提供的访问修饰符。请记住，共有四种修饰符：

- Private
- Protected
- Public
- Internal
  :::

```Kotlin
abstract class RegularCat {
  protected abstract val isHungry: Boolean
  private fun poop(): Poop { /* 执行操作 */
  }
  abstract fun feed(food: Food)
}
class MyCat : RegularCat() {
  override val isHungry: Boolean = false
  override fun feed(food: Food) {
    if (isHungry) { /* 执行操作 */
    } else {
      poop()
    } // MyCat 无法执行 poop 操作
  }
}

Cannot access 'poop': it is invisible (private in a supertype) in 'MyCat' // [!code error]
```

::: info
在上例中，`MyCat` 是 `RegularCat` 类型的继承类。请注意 `poop()` 方法的可见性修饰符；它是 `private` 的，这意味着“仅在类内部可见”。如果我们在继承类中尝试使用 `poop()`，将会引发编译时错误。

要修正这段代码，我们可以修改 `poop()` 的签名，将 `private` 修饰符替换为 `protected`，这样该方法不仅在类内部可见，任何继承类也能访问它。

无论哪种情况，`poop()` 都会对外部世界隐藏。
:::

## 继承

```Kotlin
class SickDomesticCat : RegularCat(), CatAtHospital {
    override var isHungry: Boolean = false
        get() = field
        set(value) {...}

    override fun pet() {...}

    override fun feed(food: Food) {...}

    override fun checkStomach() {...}

    override fun giveMedicine(pill: Pill) {...}
}
```

要使一个类能够被其他类继承，该类应使用 **`open`** 关键字进行标记。（**抽象**类始终是 `open` 的。）

在 Kotlin 中，你只能从**一个类**继承，但可以从任意多个**接口**继承。

当你从一个类继承时，必须调用该类的构造函数，就像次要构造函数必须调用主要构造函数一样。

::: info
要继承一个非抽象类，该基类的声明中必须包含 `open` 关键字。为什么？因为 Kotlin 默认遵循“默认 `final`”原则。如果未显式声明为 `open`（即非 `final`），类和方法默认是 `final` 的。你认为这是为什么呢？一个可能的答案是：如果开发者希望自己的类被其他开发者使用，就应该妥善设计该类，并显式地用 `open` 关键字进行标记。这样做时，`open` 关键字就作为该类可继承的标识。

Joshua Bloch 提出了这一有用的原则：

> “要么为继承而设计并提供文档说明，要么就禁止继承。”（Joshua Bloch，《Effective Java》，第 19 条）

如前所述，一个类可以实现多个接口，但只能继承一个抽象类。请看幻灯片上的示例和类声明。在 `RegularCat` 和 `CatAtHospital` 中，哪个是接口，哪个是抽象类？正如我们之前讨论过的，抽象类具有构造函数。在这个示例中，我们可以看到对基类构造函数的调用：`RegularCat()`。因此它必须是一个抽象类。

与其他一些语言不同，在 Kotlin 中，接口和抽象类的声明顺序可以任意排列。假设我们有两个接口和一个抽象类，那么以下两种写法都是正确的：

```Kotlin
class SickDomesticCat : RegularCat(), CatAtHospital, DomesticPet
```

以及

```Kotlin
class SickDomesticCat : DomesticPet, CatAtHospital, RegularCat()
```

此外，以下这种写法（接口 – 抽象类 – 接口）也是正确的：

```Kotlin
class SickDomesticCat : DomesticPet, RegularCat(), CatAtHospital
```

要实现接口或抽象类中声明的抽象方法，必须使用 `override` 关键字，如上例所示。
:::

## 你为什么要禁止猫咪拉💩？！

```Kotlin
abstract class Cat {
  /* final */ fun anotherDay() {
    // 各种猫咪活动
    digest(findFood())
    poop(findWhereToPoop())
  }
  private fun poop(where: Place): Poop {...}
  private fun digest(food: Food) {
    // 不知道它们是如何运作的
    poop(findWhereToPoop())
  }
  abstract fun feed(food: Food)
  abstract fun findWhereToPoop(): Place
  abstract fun findFood(): Food
}
```

```Kotlin
class DomesticCat(
  val tray: Tray,
  val bowl: Bowl
) : Cat() {
  override fun feed(food: Food) {
    // 在碗里放些食物
  }

  override fun findWhereToPoop() = tray
  override fun findFood() {
    return bowl.getFood() ?: run {
      // 去别处找食物
    }
  }
}
```

## 重探多态

```Kotlin
interface DomesticAnimal {
    fun pet()
}

class Dog: DomesticAnimal {
    override fun pet() {...}
}

class Cat: DomesticAnimal {
    override fun pet() {...}
}

fun main() {
    val homeZoo = listOf<DomesticAnimal>(Dog(), Cat())
    homeZoo.forEach { it.pet() }
}
```

::: info
让我们回到多态原则，并在 Kotlin 中实现一个简单的示例。

在上方的代码中，我们的类型层次结构中有两种家养宠物 —— `Cat` 和 `Dog`。它们都提供了接口中声明的 `pet()` 方法，但其实现可能截然不同。然而，`Cat` 可以像 `Dog` 一样出现并被使用，反之亦然。我们可以将 `Cat` 和 `Dog` 类型的对象添加到同一个集合中，并分别调用它们的 `pet()` 方法。
:::

## 属性

```Kotlin
class PositiveAttitude(startingAttitude: Int) {
   var attitude = max(0, startingAttitude)
       set(value) =
           if (value >= 0) {
               field = value
           } else {
               println("Only positive attitude!")
               field = 0
           }

   var hiddenAttitude: Int = startingAttitude
       private set
       get() {
           if (isSecretelyNegative) {
               println("Don't ask this!")
               field += 10
           }
           return field
       }

   val isSecretelyNegative: Boolean
       get() = hiddenAttitude < 0
}
```

属性可以选择性地拥有初始化器、Getter 和 Setter。

请使用 `field` 关键字来访问 Getter 或 Setter 内部的值，否则可能会导致无限递归。

属性可能完全不包含（底层）字段。

::: info
之前我们看到，可以通过主构造函数定义类属性：

```Kotlin
class Person(val age: Int)

val person = Person(21)
person.age
```

但属性也可以在类里面声明：

```Kotlin
class Person {
    var fullname: String = ""
}

val person = Person()
person.fullname = "Alex Fitch"
```

属性可以像上例那样显式定义 Getter 和 Setter。要获取或更新字段值，应使用后备字段。`field` 是一个特殊关键字，仅在定义的 Getter 和 Setter 内部可见。

可见性修饰符也可应用于 Getter/Setter。例如，`private set` 表示该属性只能在类内部进行更新。
:::

```Kotlin
open class OpenBase(open val value: Int)

interface AnotherExample {
   /* abstract */ val anotherValue: OpenBase
}

open class OpenChild(value: Int) : OpenBase(value), AnotherExample {
   override var value: Int = 1000
       get() = field - 7
   override val anotherValue: OpenBase = OpenBase(value)
}

open class AnotherChild(value: Int) : OpenChild(value) {
   final override var value: Int = value
       get() = super.value // 否则将使用默认的 get()
       set(value) { field = value * 2 }
   final override val anotherValue: OpenChild = OpenChild(value) // 注意这里我们使用的是 OpenChild，而不是 OpenBase
}
```

属性可以是 `open` 或 `abstract` 的，这意味着它们的 Getter 和 Setter 可能（对于 `open`）或必须（对于 `abstract`）分别由子类重写。

接口可以拥有属性，但它们始终是 `abstract` 的。

你可以通过将属性标记为 `final` 来禁止进一步的重写。

::: info
除了可见性修饰符外，我们还可以控制 `final`/非 `final` 状态。请记住“默认 `final`”原则（接口除外）。在上面的示例中，`OpenBase` 类有一个带有 `open` 关键字的 `value` 属性，这意味着该属性可以在子类中被重写，并且可以引入自定义的 Getter 和 Setter。

同时，我们可以在子类中添加 `final` 关键字。比如 `AnotherChild` 类，它有一个被标记为 `final` 关键字的重写属性 `value`。如果存在像 `OneMoreChild(...) : AnotherChild(...)` 这样的子类，`value` 将无法在其中被重写。
:::

## 运算符重载

```Kotlin
class Example {
   operator fun plus(other: Example): Example { ... }
   operator fun dec() = this // 返回类型必须是其子类型
   operator fun get(i: Int, j: Int): SomeType { ... }
   operator fun get(x: Double?, y: String) = this
   operator fun <T> invoke(l: List<T>): SomeType { ... }
}

operator fun Example.rangeTo(other: Example): Iterator<Example> { ... }

fun main() {
   var ex1 = Example()
   val ex2 = ex1 + --ex1 // -- 会对 ex1 重新赋值，因此它必须是 var
   for (ex in ex1..ex2) {
       ex[23, 42]
       ex[null, "Wow"](listOf(1,2,3))
   }
}
```

允许进行运算符“重载”。

几乎所有的运算符都可以被重写。

运算符可以在类外部进行重写。

::: info
让我们看看以下示例：

```kotlin
html {
   head {
       title { +"XML encoding with Kotlin" }
   }
}
```

嗯对，这是 Kotlin 代码，尽管乍一看它一点也不像代码。我们从 Kotlin 类型安全构建器示例中获得了这个例子，它看起来像是一个 HTML DSL。但是 `+"XML encoding with Kotlin"` 是什么意思？如果我们尝试编译这一行，将会得到一个错误。在 Kotlin 中，字符串并没有一元 `+` 运算符。但它是如何工作的呢？

Kotlin 允许我们重写运算符。几乎每个运算符都可以被重载，包括一元和二元算术运算符、索引访问运算符等等。请查看 Kotlin 官方文档以了解所有可用于重载的运算符。

但在上面的示例中，一元 `+` 运算符被用于 `String`。我们该如何在类型之外重写运算符呢？引入重写运算符的一个绝佳选择是使用扩展函数！在这种情况下，基类保持不变。

```kotlin
operator fun String.unaryPlus(): String = this
```

注意，必须使用 `operator` 关键字。

请记住，成员函数的优先级高于扩展函数。如果任何类中已经存在重写运算符，则无法通过扩展函数对其进行重写。

请检查 `kotlin.String` 类，其中有一个运算符：

```Kotlin
public operator fun plus(other: Any?): String
```

因此，我们无法重写 `plus` 方法（即二元加法运算符）。然而，`unaryPlus()` 运算符可以通过扩展函数进行重写。
:::

## 扩展

Kotlin 能够<ins>扩展一个类</ins>或接口并为其添加新功能，<ins>而无需继承该类或*使用某些被禁用的魔法（反射）*</ins>。

```kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' 指代当前的 MutableList<T>
    this[index1] = this[index2]
    this[index2] = tmp
}
```

如果被扩展的类**已经拥有**一个具有相同名称和签名的新方法，则会优先使用**原始**方法。

## 扩展背后的原理

被扩展的类本身完全不会改变；扩展仅仅是一个可以像方法一样被调用的新函数。例如，它无法访问类的私有成员。

扩展采用的是静态分发，而不是基于接收者类型的虚拟分发。调用的扩展函数是由调用该函数的表达式类型决定的，而不是由运行时评估该表达式所得结果的类型决定的。

```kotlin
open class Shape
class Rectangle: Shape()

fun Shape.getName() = "Shape"
fun Rectangle.getName() = "Rectangle"

fun printClassName(s: Shape) {
    println(s.getName())
}

printClassName(Rectangle()) // 输出 "Shape"，而不是 "Rectangle"
```

## 中缀函数

```Kotlin
data class Person(val name: String, val surname: String)

infix fun String.with(other: String) = Person(this, other)

fun main() {
   val realHero = "Ryan" with "Gosling"
   val (real, bean) = realHero
}
```

::: info
现在让我们来谈谈中缀函数。它们是什么？

请看这个例子：

```kotlin
infix fun String.with(other: String) = Person(this, other)
```

这看起来像是一个扩展函数，对吧？但 `infix` 关键字的作用是什么呢？

虽然中缀函数是以扩展函数的形式声明的（仅增加了 `infix` 关键字），但中缀函数的调用方式与扩展函数不同。扩展函数的调用方式与普通函数无异：

```Kotlin
"Ryan".with("Gosling")
```

但如果一个函数被标记为 `infix`，我们可以省略一些符号，写成：

```Kotlin
"Ryan" with "Gosling"
```

在声明中缀函数时，似乎存在一些限制。在上面的例子中，我们不太可能传递多个参数：

```Kotlin
"Ryan" with "Gosling", 21 // 无法编译
```

事实上，确实存在以下几点限制：

- 中缀函数必须是成员函数或扩展函数。
- 中缀函数必须有且仅有一个参数，该参数不能有默认值，且不能是可变参数。

使用中缀函数时，请注意运算符优先级。例如，算术运算符的优先级高于中缀函数。
:::

## ComponentN 运算符

```Kotlin
class SomeData(val list: List<Int>) {
   operator fun component1() = list.first()
   operator fun component2() = SomeData(list.subList(1, list.size))
   operator fun component3() = "This is weird"
}

fun main() {
   val sd = SomeData(listOf(1, 2, 3))
   val (head, tail, msg) = sd
   val (h, t) = sd
   val (onlyComponent1) = sd
}
```

任何类都可以重载任意数量的 `componentN` 方法，这些方法可用于解构声明。

数据类默认拥有这些方法。

::: info
解构声明不仅限于数据类。我们可以让普通的“非数据”类也支持这种约定。

为此，我们需要手动实现 `componentN()` 方法。为了支持解构声明，这些方法必须使用 `operator` 关键字声明。

在上面的示例中，如果我们想要忽略 `head` 而仅获取尾部 `tail`，可以使用下划线：

```Kotlin
val (_, tail) = sd
```

:::

## 数据类

```Kotlin
data class User(val name: String, val age: Int)
```

编译器会自动推导出：

- `equals()` 和 `hashCode()`
- 格式为 `User(name=John, age=42)` 的 `toString()`
- 与属性按声明顺序对应的 `componentN()` 函数。
- `copy()` 用于复制对象，允许你修改其中某些属性，同时保持其余属性不变

标准库提供了 `Pair` 和 `Triple` 类，但命名数据类是更好的设计选择。

::: info
数据类是 Kotlin 的又一项出色特性。请看幻灯片上的示例。我们已经知道，简单的类只需一行代码即可声明。但 `data` 关键字带来了什么变化呢？

仅通过使用一个关键字，类就能获得幻灯片上展示的所有特性。`User` 类依然保持一行声明，而所有方法都会隐式添加，我们可以直接使用它们。例如，可以使用解构声明：

```Kotlin
val user = User("Alex", 25)
val (name, age) = user
```

该类中并未显式声明 `component1` 和 `component2` 方法。这些方法是由 Kotlin 编译器在后台自动生成的。

不过，也有一些要求和限制：

- 数据类的构造函数必须至少声明一个属性。
- 所有构造函数参数都必须标记为 `val` 或 `var`。
- 数据类不能是抽象类、开放类、密封类或内部类。
- 无法重写 `copy()` 和 `componentN()` 方法。

（可选）当你在网上进行自主研究时，可能会遇到诸如“Kotlin 中如何使用元组？”之类的问题。其实，Kotlin 中并没有元组。请看以下伪代码示例：

```Kotlin
fun getCoordinates() {
    x = 1
    y = 1
    return (x, y)
}

x, y = getCoordinates()
```

由于没有元组，我们无法在 Kotlin 中以相同方式实现此功能。但实际上我们并不真正需要元组。我们可以引入一个简单的数据类并使用解构声明取而代之，因此该伪代码示例在 Kotlin 中可写为：

```Kotlin
fun getCoordinates(): Point {
    return Point(2, 3)
}

val (x, y) = getCoordinates()
```

数据类写法很“轻量”，这意味着只需一行代码即可轻松添加一个数据类。而且，在同一个源文件中可以声明多个数据类，这也是其优点之一。
:::

## 内联（值）类

有时你需要对类进行封装，但封装总会带来内存和执行时间的开销。内联类或许能帮助你实现所需的行为，同时避免因性能下降而付出代价。

```Kotlin
interface Greeter {
   fun greet(): Unit
}

class MyGreeter(var myNameToday: String) : Greeter {
   override fun greet() = println("Hello, $myNameToday!")
}

@JvmInline
/* final */ value class BadDayGreeter(val greeter: Greeter) : Greeter {
   override fun greet() {
       greeter.greet()
       println("Having a bad day, huh?")
   }
}
```

```Kotlin
var greeter: Greeter = MyGreeter("Cyr")
if (today.isBad()) { greeter = BadDayGreeter(greeter) }
greeter.greet()
```

::: info
内联类是 Kotlin 的一项优化特性。如果我们的目标平台是 JVM，可以在类包装器上使用 `@JvmInline` 注解，其余的工作将由 Kotlin 编译器自动完成。在代码中，它看起来仍像一个普通的类，但在底层已被内联，从而提升了性能或节省了内存。
:::

- 内联类必须且仅有一个主要构造函数参数。
- 内联类可以实现接口、声明属性（不包含后备字段）并包含 `init` 块。
- 内联类不允许参与类继承体系，也就是说它们会被自动标记为 `final` 关键字。
- 编译器会尝试利用底层类型生成性能最佳的代码。

```Kotlin
@JvmInline
/* final */ value class Name(val name: String) : Greeter {
   init {
       require(name.isNotEmpty()) { "An empty name is absurd!" }
   }

   // val withABackingField: String = "Not allowed"

   var length: Int
       get() = name.length
       set(value) { println("What do you expect to happen?") }

   override fun greet() { println("Hello, $name") }
}
```

::: info
内联类是基于值的类的子集。它们没有身份，只能存储值。

需要注意以下几点限制：

- 内联类必须在主构造函数中初始化一个属性。
- 内联类不得参与类型层次结构。但它们可以实现接口。
- 内联类属性的获取器和设置器不能使用后备字段。
  :::

由于内联类只是包装器，且编译器会尝试使用底层类型，因此引入了名称修饰机制来解决可能出现的签名冲突问题。

```Kotlin
fun foo(name: Name) { ... } -> public final void foo-<stable-hashcode>(name: String) { ... }
```

```Kotlin
fun foo(name: String) { ... } -> public final void foo(name: String) { ... }
```

若要在 Java 代码中调用此类函数，应使用 `@JvmName` 注解。

```Kotlin
@JvmName("fooName")
fun foo(name: Name) { ... } -> public final void fooName(name: String) { ... }
```

::: info
内联类在底层并非真正的类。在上例中，`Name` 是 `String` 的包装类。这意味着在底层，我们可能会得到两个声明相同的函数（粗略地说，`Name` 将被替换为 `String`）。为了解决函数签名冲突的问题，内联类的方法名称会被重命名。

但如果它们被重命名了，我们又该如何在（例如）Java 应用程序中调用它们呢？我们需要使用另一个注解 `@JvmName`，来显式设置方法名并禁用重命名机制。
:::

## 枚举类

```Kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```

每个枚举常量都是一个对象。

每个枚举都是枚举类的实例，因此可以这样初始化：

```Kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

枚举类可以拥有方法，甚至可以实现接口。

::: info
Enum 是“enumeration”（枚举）的缩写，指的是一组预定义的常量。我们为什么需要它？假设我们需要实现一个指南针。该如何描述“北南西东”这组固定的方向呢？一种可能的做法是使用数字常量来表示：

```Kotlin
const val NORTH = 1
const val SOUTH = 2
```

但在这种情况下，底层仍为 `Int` 类型，因此我们无法获得任何额外好处或编译时验证。但更危险的是，我们可能会混淆这些常量并使用错误的常量，例如：

```Kotlin
compass.getDirection() == Consts.MUNICH
```

在此处，`Consts.MUNICH` 可能是声明为 `const val MUNICH = 313` 的城市 ID，而非方向代码。由于底层所有常量仍为 `Int` 类型，因此编译并运行代码时会报错。

在 Kotlin 中，`enum` 是一种类。每个枚举常量都是一个对象。那么，我们可以添加方法和属性吗？当然可以！例如，对于 `Color` 枚举，我们可以像幻灯片中所示的那样添加 RGB 值。

方法也是允许的。我们可以在 `Color` 类中引入一个抽象方法，并且每个常量（对象）都必须实现该方法：

```Kotlin
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
```

与类内部声明的抽象方法类似，枚举类也可以实现一个（或多个）接口。

要访问枚举常量，只需写 `Color.RED`。
:::

## Kotlin 示例

```Kotlin
val user = User("John", 23)

val (name, age) = user // 解构声明会调用 componentN()

val (onlyName) = user

val olderUser = user.copy(age = 42)

val g = Color.valueOf("green".uppercase())

when(g) {
    Color.RED -> println("blood")
    Color.GREEN -> println("grass")
    Color.BLUE -> println("sky")
}
```

::: info
让我们再来看一个关于枚举的示例。枚举提供了辅助方法，例如，可以通过 `valueOf` 方法按名称获取枚举常量。

如幻灯片所示，枚举还可以与 `when` 子句配合使用。我们可以为每个枚举常量编写一个分支（如幻灯片所示），也可以使用 `else` 子句省略某些常量，例如：

```Kotlin
when (g) {
   Color.RED -> println("blood")
   else -> println("unknown")
}
```

如果在 `when` 表达式中未涵盖所有枚举常量，将会导致编译错误。布尔类型和密封类也同样适用此规则。
:::

## 密封类

```Kotlin
sealed class Base {
   open var value: Int = 23
   open fun foo() = value * 2
}
open class Child1 : Base() {
   override fun foo() = value * 3
   final override var value: Int = 10
       set(value) = run { field = super.foo() }
}
class Child2 : Base()

val b: Base = Child1()
when(b) {
   is Child1 -> println(1)
   is Child2 -> println(2)
}
```

`sealed` 类的所有继承者必须在编译时已知。

`when` 用法与枚举类型类似。

以下不限于 `sealed` 类：

- 将 `open fun` 或属性声明为 `final` 来禁止对其进行重写。
- 使用 `super` 访问父类的方法。

::: info
密封类为 Kotlin 提供了另一种实现类的方式。当在类声明中添加 `sealed` 关键字时，它会对类型层次结构引入一些限制。如果一个类是密封的，那么它的继承类必须都定义在同一个模块中，并且在编译时已知。这使我们能够更好地控制继承，并确保不会出现其他子类（继承类）。

密封类本身是抽象的——因此无需 `open` 修饰符——且无法被实例化。

由于密封类层次结构受到限制，在使用 `when` 表达式时，可以验证所有情况均已被覆盖。
:::

## 函数式接口（单一抽象方法）

单一抽象方法（Single Abstract Method，SAM）接口：

- 包含一个抽象方法。
- Kotlin 允许我们使用 `lambda` 表达式代替类定义来实现单一抽象方法。

```Kotlin
val isEven = object : IntPredicate {
   override fun accept(i: Int): Boolean {
       return i % 2 == 0
   }
}
```

```Kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}
```

```Kotlin
fun main() {
   println("Is 7 even? - ${isEven.accept(7)}")
}
```

```Kotlin
val isEven = IntPredicate { it % 2 == 0 }
```

::: info
单一抽象方法（SAM）接口是一种仅包含一个抽象方法的接口。一个经典的例子是 UI 动作监听器接口：

```Kotlin
interface ActionListener {

   /**
    * 动作发生时调用。
    */
   fun actionPerformed(event: ActionEvent);
}
```

在许多编程语言中，此类接口被广泛使用。

在 Kotlin 中，我们也可以引入 SAM 接口。此外，与其实现接口并引入额外的类或对象表达式（如幻灯片所示），我们也可以使用 `lambda` 表达式。

如果我们在 Kotlin 项目中使用了任何 Java 库，也可以使用 `lambda` 表达式处理 Java 的 SAM 接口。例如：

```Kotlin
import javax.swing.Jbutton

val button = JButton()
button.addActionListener { println("Button clicked") }
```

:::

## Kotlin 单例

```Kotlin
object DataProviderManager {
    fun registerDataProvider(provider: DataProvider) {
        // ...
    }

    val allDataProviders: Collection<DataProvider>
        get() = // ...
}

DataProviderManager.registerDataProvider(...)
```

::: info
我们已经讨论了许多面向对象编程的原则和方面。现在是时候谈谈设计模式了。

什么是设计模式？

一般而言，设计模式是解决软件设计中常见问题的典型方案。

设计模式并不局限于任何特定的编程语言，相反，同一种设计模式在不同的语言中可能会以略有不同的方式实现。

但为什么要在这次 Kotlin 讲座中讨论设计模式呢？原因在于 Kotlin 为我们提供了一个名为“单例”的设计模式的内置实现。

单例是一种将类实例化限制为唯一实例的设计模式。通常，单例应可被全局访问。

批评者认为单例模式是一种反模式。为什么？原因之一是使用单例模式可能会增加代码耦合度，并导致代码中出现隐式依赖，因此必须谨慎使用。

不同编程语言实现单例模式的技术各不相同。然而，Kotlin 极大地简化了单例模式——让我们来看看具体如何实现。

请看幻灯片上的代码。看起来像是一个类对吧？但这里用的不是 `class` 关键字，而是 `object` 关键字。`object` 关键字是我们在 Kotlin 中实现单例模式的方式，也被称为“对象声明”。声明式对象的初始化是以线程安全的方式进行的，并在首次访问时发生。要访问该对象及其方法，请直接使用对象名称：

```Kotlin
DataProviderManager.registerDataProvider(...)
```

这看起来像是在访问静态字段，对吧？这就是我们接下来要讲解的内容。
:::

## 伴生对象

- 类内部的对象声明可以使用 `companion` 关键字进行标记。
- 伴生对象类似于静态成员：
  - 工厂方法
  - 常量
  - 等等。
- 可见性修饰符同样适用。
- 使用 `@JvmStatic` 可以使其完全静态化。

```Kotlin
interface Factory<T> {
    fun create(): T
}

class MyClass {
    companion object : Factory<MyClass> {
        private var counter: Int = 0
        override fun create(): MyClass =
                MyClass().also { counter += 1}
    }
    // … 一些代码 …
}

val f: Factory<MyClass> = MyClass.Companion
val instance1 = f.create()
val instance2 = f.create()
```

::: info
你可能已经注意到，我们在任何代码片段中都没有使用 `static` 关键字。Kotlin 并不包含 `static` 关键字。

但它支持伴生对象。任何类内部的对象声明都可以通过 `companion` 关键字进行增强。在这种情况下，只需将类名作为限定符，即可直接调用伴生对象的成员，而无需创建该类的实例（对象）。

利用伴生对象，我们可以实现静态工厂方法。在示例中，我们可以简单地写成：

```Kotlin
MyClass.create()
```

因此 `create()` 看起来像是 `MyClass` 的静态方法，但实际上它是伴生对象的成员函数。

另一个用例是静态常量。通过伴生对象，我们可以定义无需实例化类即可访问的常量：

```Kotlin
class MyClass {
   companion object {
       const val MY_VALUE = 1
   }
}

print("Const value: ${MyClass.MY_VALUE}")
```

在伴生对象内部定义的 `MY_VALUE` 无需 `MyClass` 对象实例即可访问，这与静态常量类似。
:::

## Kotlin 类型层次结构

![](/assets/kotlin-edu-sinicization/kotlin-type-hierarchy.png)
