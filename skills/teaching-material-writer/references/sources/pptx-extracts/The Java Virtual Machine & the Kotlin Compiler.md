# The Java Virtual Machine & the Kotlin Compiler

共 103 页

## Slide 1
- The Java Virtual Machine
- & the Kotlin Compiler
- Kotlin
- @kotlin
- |  Developed by JetBrains

## Slide 2
- The Java language
- Was created in 1995.
- Is an OOP language with strong static typing.
- Has Just-in-time (JIT) compilation.
- Uses the Java Virtual Machine (JVM).
- Has a garbage collector, meaning you can allocate memory and it will be freed automatically.

**[讲师备注]**
Strong typing is distinguished by the fact that the language does not allow mixing different types in expressions and does not perform automatic implicit conversions. For example, you cannot subtract a set from a string. Languages with weak typing perform many implicit conversions automatically, even if there's a loss of precision or conversions may be ambiguous. Like in JS, the operation 50 + '2' - '5' is well defined and returns 497 because in 50 + '2' the value 50 is converted to string and concatenation is applied to get '502' and in '502' - '5' both arguments are converted to numbers and subtraction is applied to get 497.

More about Java: Wikipedia, developer portal, documentation on oracle.com, OpenJDK project.

## Slide 3
- Compilation process – Java vs C

**[讲师备注]**
Before the introduction of Java, many computer programs were written for specific computer systems, and manual memory management was preferred, as it was more efficient and predictable (e.g. C, C++). Following the advent of Java in the second half of the 1990’s, automatic memory management has become a common practice.

The advantage of the JVM is the “write once, run anywhere” principle. It means that your code written in Java or any other JVM-language will be compiled to some Java bytecode that can be executed on any JVM implementation regardless of processor design, OS, and other platform-specific features. This is a big advantage of the JVM and Java itself, whereas low-level languages like C and C++ suffer from the inability to easily migrate a program from one OS to another while still allowing the program to run and compile well.

## Slide 4
- Java bytecode
- public class examples/Main {
- public <init>()V
- L0
- LINENUMBER 3 L0
- ALOAD 0
- INVOKESPECIAL java/lang/Object.<init> ()V
- RETURN
- L1
- LOCALVARIABLE this Lorg/examples/Main; L0 L1 0
- MAXSTACK = 1
- MAXLOCALS = 1
- public static main([Ljava/lang/String;)V
- L0
- LINENUMBER 5 L0
- GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
- LDC "Hello, World!"
- ICONST_0
- ANEWARRAY java/lang/Object
- INVOKEVIRTUAL java/io/PrintStream.print
- (Ljava/lang/String;[Ljava/lang/Object;)Ljava/io/PrintStream;
- POP
- L1
- LINENUMBER 6 L1
- RETURN
- L2
- LOCALVARIABLE args [Ljava/lang/String; L0 L2 0
- MAXSTACK = 3
- MAXLOCALS = 1
- }
- public class Main {
- public static void main(String[] args) {
- System.out.print("Hello, World!");
- }
- }

**[讲师备注]**
JVM bytecode is more high-level than machine code. It knows about the Java type system, and it is targeted at an abstract stack-based machine, while modern physical machines are register-based.

More about Java bytecode: Wikipedia, JVM 19 specs with JVM instruction set, an article about different kinds of VMs, and Wikipedia page about stack machines.

## Slide 5
- The JVM under the hood
- .сlass fileswith bytecodes
- Class loadingservices
- Memory management(heap, GC)
- JVM
- bytecode -> machine code
- translation services
- Interpreter
- JIT-compiler

**[讲师备注]**
One of the core components of the JVM is the interpreter, which takes JVM bytecode and interpretes it line by line, turning the code into native code that can be accepted by the physical machine that the application is running on.
In addition to the interpreter and class loading services, there is a memory manager, task scheduler, and much more.

## Slide 6
- Memory organisation
- JVM memory is divided into two parts:
- Static memory, or non-heap memory, is created when the JVM starts, and it primarily stores class structures, fields, method data, and the code for methods and constructors.
- Loaded classes
- Stacks of all threads
- Service memory for the JVM itself
- Small – roughly 1024 KB for stacks
- Heap memory is the runtime data area shared among all JVM threads, and it is used  to allocate memory for all Java objects.
- All objects created during a program’s execution
- Large – from several MB up to several TB

**[讲师备注]**
JVM memory is divided into two parts: heap memory and static memory. 
Static memory is created on JVM startup and stores per-class structures such as the runtime constant pool, field and method data, and code for methods and constructors, as well as interned strings. This memory type is also used to store the code of the JVM itself, JVM internal structures, loaded profiler agent code, data, and more. 
The heap is the runtime data area that allocates memory for all Java objects. It is created when the JVM is started, and it can grow or shrink in size as the application runs. The heap can be of a fixed or variable size depending on the garbage collection strategy. The size of a fixed heap can be specified using the -Xms VM option, while the maximum size for a variable heap can be set using the -Xmx option.

## Slide 7
- Weak generational hypothesis
- According to the weak generational hypothesis, objects tend to die young.
- A related assumption is that, as an object lives longer, the likelihood will be that it will continue to live increases.
- total size of objects
- lifetime

## Slide 8
- Generations
- The memory of a program can be divided into two generations:
- Young
- Old
- Garbage collection (GC) can be similarly divided:
- Small GC clears only objects from young generation
- Full GC clears objects from both generations

**[讲师备注]**
This weak generational hypothesis is used in garbage collection, which is the process of automatically freeing memory that is no longer used by a program. Following the weak generational hypothesis, a program's memory is divided into two generations: young and old. Objects are created as members of the young generation, and then they are moved to the old one once they have survived a certain number of garbage collection cycles.
The idea behind this division is that most objects will need to be garbage collected shortly after they are created. Garbage collection is performed more frequently on the young generation, and it can be performed with less overhead because the objects that are less likely to need to be collected will be in the older generation. This can improve the performance of the garbage collector and the program as a whole.

## Slide 9
- Dead objects
- Stack
- Young generation
- Old generation
- A
- B
- C
- D
- E

**[讲师备注]**
When garbage collection is triggered, the garbage collector reclaims the memory occupied by dead objects. A dead object is an object, in either generation, that does not have any references.  
Consider this example. In the young generation we have three objects: A, B, and C. They all have references, either from the stack or from other objects, so at first glance, they all seem to be living objects. 

If we consider the two objects from the old generation, D and E, we find that object E has no references, making it a dead object. 

However, since object C’s only reference is from a dead object, it can be considered dead as well.

## Slide 10
- Serial garbage collector
- The first garbage collector created was the serial garbage collector, which is single-threaded, and the parallel and CMS garbage collectors are based on it.
- In the serial garbage collector, the heap is divided into 4 areas:
- ○ Eden – Roughly 8/10 of the young generation
- ○ Survivor 0 – Roughly 1/10 of the young generation
- ○ Survivor 1 –  Roughly 1/10 of the young generation
- ○ Tenured – Roughly 2/3 of the heap
- (Almost) All objects are created in the Eden area.
- Tenured
- Eden
- Old generation
- S0
- S1
- Young generation

**[讲师备注]**
The first garbage collector developed was the serial garbage collector. It is single-threaded, which means that all garbage collection operations are performed in one thread. All subsequent garbage collectors have worked on the same principle, with some modifications and optimizations. 
The heap memory is divided into 4 areas: Eden, which occupies 8/10 of the available space for the young generation; two equally sized Survivor areas, which are also for the young generation; and Tenured, which takes up about 2/3 of the free memory on the heap. 
Just about all objects are initially placed in the Eden area. However, there are some exceptions. For example, heavyweight constants that are likely to be used throughout the life of the program can be placed in the Tenured area immediately.

## Slide 11
- No available space in Eden
- Before GC:
- Memory to free, dead objects
- After GC:
- Surviving objects
- Current state:
- How garbage collection works

**[讲师备注]**
Consider this example of how the serial garbage collector works.  
Initially, all 4 heap areas are empty. During the execution of the program, all objects are placed in Eden, and at some point this area runs out of space. 
At this moment, the process of small garbage collection starts with the young generation and then move on to the older generation. First, all dead and surviving objects in the Eden area are calculated, and then all surviving objects are moved sequentially to the Survivor 0 region to remove the empty space between them.

## Slide 12
- After GC:
- No available space in Eden
- Before GC:
- Current state:
- How garbage collection works

**[讲师备注]**
New objects will continue to be placed in the Eden area until it is full again, at which point the small garbage collection process is once again performed. First, all dead and surviving objects in the Eden and Survivor 0 areas are calculated, then all surviving objects are moved sequentially to the Survivor 1 area.

## Slide 13
- No available space in Eden
- Before GC:
- After GC:
- Current state:
- How garbage collection works

**[讲师备注]**
This process is repeated until one of the Survivor areas runs out of space. Each iteration of small garbage collection moves objects from the occupied Survivor area and the Eden area to the free Survivor area.

## Slide 14
- No available space in Eden
- Before GC:
- After GC:
- Not enough space to move objects from Eden to Survivor 1
- Current state:
- How garbage collection works

**[讲师备注]**
If there is not enough free space for one of the Survivor areas to receive objects from Eden, a full garbage collection process is started. In this case, objects that have survived through a given number of rounds of garbage collection are moved to the Tenured area, and the remaining objects are moved to the free Survivor area.

## Slide 15
- Just-in-time compilation
- Program profiling occurs at runtime.
- Pieces of code are compiled for a specific platform to optimize the execution time.
- Interpreting a command is much slower than executing it directly on the processor.
- Why, then, do we need the interpreter?

**[讲师备注]**
All programming languages either are interpreted in place or are statically compiled to some code (machine code, bytecode, etc.) that is then interpreted in place by either hardware or specially designed software (an interpreter). Such compilation is called ahead-of-time (AOT) compilation. For example, It is used by C, C++, D, Rust, Haskell, C#, JVM-based languages, TS, etc., but not by Python, JS, Ruby.To get even better execution speed, the JVM platform actively uses dynamic compilation, which is also called just-in-time (JIT) compilation. Dynamic compilation improves performance by translating chunks of Java bytecode into optimized native code in the background while the application is running. The principle of operation differs significantly from static compilers and the JVM uses a different set of compilation techniques to produce high-performance code.

Bytecode can be compiled into platform-specific executable code in different ways. Then, there are several tiers of optimization. The JVM might analyze which code is the bottleneck and optimize it for the current platform, using platform-specific optimizations that AOT cannot use. More about it: AOT (Wikipedia), JIT (Wikipedia).

## Slide 16
- Just-in-time compilation
- Interpreter
- Starts working almost instantly.
- The performance of the executable code is poor.
- Why, then, do we need the interpreter?
- JIT-compiler
- Kicks in after a long delay (needs time for optimizations).
- The performance of the executable (compiled) code is high.
- vs

## Slide 17
- Just-in-time compilation
- Code that will take a long time to run or code that runs frequently, because the compilation overhead will be covered by the profit from having optimized execution.
- What sorts of  JIT code are worth compiling?

## Slide 18
- Just-in-time compilation
- Some guy named Alan Turing said it is impossible.
- But empirically it is possible. If a piece of code took a long enough time to execute once, then most likely the same will be true in the future.
- How can we understand which pieces of code will take a long time to execute?

**[讲师备注]**
In purely theoretical terms, there is no way to determine which parts of a program are bottlenecks. But we can try to do so empirically by introducing some metrics and measuring them during a short period at the start. Then, depending on their values, we can judge which parts of the program are bottlenecks and compile them. Simply, we can just profile the program at the start and then compile the parts we need to. There are different metrics and different heuristics of JIT compilation. Here are a few informal examples of the most sensible approaches:
Compile a snippet of the program if it is executed frequently enough.
Compile a snippet of the program if it is executed from time to time but it’s computation is slow enough.
Compile a snippet of the program while ignoring the parts of it that are not executed frequently enough.(For example, if you have an if-else block in the snippet where one of the branches has never been executed before – and thus probably won’t be executed in the future either – then doesn’t it make sense to just compile the entire snippet except for the branch? This will make the compiled code smaller and a bit faster.)
Recompile a snippet if a previous assumption was violated.

In summary, there are several not-so-obvious metrics for determining which parts should be compiled and a lot of not-so-obvious heuristics for compiling the code effectively (assumptions we make in our search for the balance between “compile everything, even the parts we don’t need” and “compile nothing, not even the parts we do need”).

When the JVM is run, it starts with code interpretation and profiling at the same time. This process is called “JVM warm-up”. After a very short while (when it has collected enough data for metrics) it starts JIT compilation, which compiles some functions to machine code. During that time, interpretation never stops! The interpreter continuously executes the program. Sometimes, however, it does not interpret the original bytecode, but rather blindly follows instructions from the JIT compiler, that is, it executes whatever compiled code was given to it by the JIT compiler. (This “blind following” works the same way as changing a reference, which is really fast.) After that, interpretation and profiling are performed continuously in parallel, whereas JIT compiles the necessary code only when it’s needed and does it in parallel with both the interpreter and the profiler. The fact that functions are the units that are measured and just-in-time compiled is called “granularity”.

## Slide 19
- The JVM under the hood
- Why does the compiler need to access the interpreter?
- .сlass fileswith bytecodes
- Class loadingservices
- Memory management(heap, GC)
- JVM
- bytecode -> machine code
- translation services
- Interpreter
- JIT-compiler

**[讲师备注]**
But the JIT compiler also needs to access the interpreter. Why?It’s because of the assumptions discussed on the previous slide. If bytecode has a conditional statement, then most probably there is a reason for it. So if we compiled the code while ignoring one of the condition’s branches and saying that “the branch was never executed during a lot of computations of the bytecode, so there is high probability it won’t be executed for a while too”, we should be ready for consequences of that assumption. Later, the removed branch may have to be executed. In this case, the  JIT compiler will have to take responsibility and tell the interpreter to use the original bytecode. This type of process is called “deoptimization”, and compiled code with this type of assumption (an assumption that is suddenly proven wrong) is called “non-entrant code”. There is also another example of reason for deoptimization: “zombie code”. This is compiled code that has not been executed for a while (and that should just be removed).

## Slide 20
- The JVM under the hood
- Why does the compiler need to access the interpreter?
- class PiUtils {
- private static final double PI = 3.141592653589;
- public static double getPiSquared() {
- return PI * PI;
- }
- }
- public static double getPiSquared() {
- return 9.869604401084375;
- }

**[讲师备注]**
Here is an example of a piece of non-entrant code.

Consider the code snippet. Obviously, the PI variable is constant and is not going to change. Thus, the getPiSquared function, which returns some value depending only on the PI variable, is going to return the same value each time it is called. So it makes a lot of sense to replace it with a function that just returns the value and does not waste precious processor cycles.

## Slide 21
- The JVM under the hood
- Why does the compiler need to access the interpreter?
- class PiUtils {
- private static final double PI = 4;
- public static double getPiSquared() {
- return PI * PI;
- }
- }
- public static double getPiSquared() {
- return 9.869604401084375;
- }
- Reflection

**[讲师备注]**
But what if the PI variable’s value is changed? (How is this done? With reflection, for example. Reflection can do anything!) Then our compiled function getPiSquared is now incorrect because it returns an incorrect value. Hence, we should fall back to the original bytecode and then just-in-time compile the function again.

## Slide 22
- The Kotlin language
- Can be compiled into JVM bytecode.
- Is interoperable with Java.
- Can work in Java projects.
- Can use Java libraries.
- Is safe and concise.
- Provides the ability to integrate into the compilation process (compiler plugins).
- Is the main development language for Android applications, according to Google.

## Slide 23
- Kotlin compiler
- Parser
- Backend
- Frontend
- .kt files

**[讲师备注]**
As a first approximation, the Kotlin compiler consists of 3 main parts:
The first is the parser, which takes your source code (which looks like a plain text to the compiler) and converts it to a format that is more convenient for the rest of the process. It just represents the code structure and does not try to understand the meaning of the code or resolve variables and types by their names in the code, and so on.
Then there is the frontend, which takes source code parsed by the parser and compile time dependencies of the code (like Kotlin or Java compiled libraries) and determines the meaning of the code so it can be passed further and be compiled to the final form(s). As a result, it extends the format that represents the source code and is received from the parser, adding knowledge gained from the analysis. It may also change or extend the representation.
Finally, there is the backend, which turns code that has been fully extended, understood, and checked for mistakes into the final result, such as KLib files for libraries (klib is the format of Kotlin library representations), Java bytecode for JVM, JS and/or TS files for the JS platform, and executable files for the native platform. It’s the heaviest part of the compiler.

Now let’s dig in.

## Slide 24
- Kotlin compiler
- Lexer
- .kt files
- PSI or Lighter AST builder
- Diagnostics
- Type inference
- Resolution
- IR generator
- IR optimizer
- Parser
- Frontend
- Backend
- JVM
- JavaScript
- Native
- Other
- (WASM, Python, etc.?)

**[讲师备注]**
Looks a bit complex, doesn’t it? Honestly, these blocks could be broken down even further, into even smaller blocks. But this would be difficult and would go beyond the scope of this course.Let’s start with the parser.

## Slide 25
- Parsing in a nutshell
- '2 * 7 + 3'
- '2'
- '*'
- '7'
- '+'
- '3'
- Sum
- '+'
- '3'
- Product
- '*'
- '2'
- '7'
- Sum
- 3
- Product
- 2
- 7
- Source code
- List of tokens
- CST
- AST
- left operand
- right operand
- left operand
- right operand

**[讲师备注]**
Let’s look at this dummy example. In the beginning, the compiler has only source code that seems to be no more than just plain text files. The first step is to divide each file into a list of lexemes (omitting some very useless symbols, like spaces) and giving them a simple meaning (like “identifier”, “keyword”, “separator”, “operator”, “literal”, “comment”, etc.), thereby making tokens of them. The process is called lexical analysis and a piece of software (or part of a compiler) that performs it is called a lexer. More about lexical analysis can be found here: Wikipedia.

Then the compiler converts the list of tokens into a CST (a concrete syntax tree). The tree represents the hierarchy that we usually infer by reflex. For example, here we obviously imply that multiplication is performed before summation and its result is used in the summation. So at first we unite the first three tokens under a Product vertex, and then unite the Product vertex with the last two tokens under the Sum vertex. (If you know what context-free grammar is and what its tree representation is, then CST is exactly that tree representation.) Note that order of each vertex’s children matters. You should also note that the CST still contains useless symbols like a plus sign or asterisk but does not contain some other obvious implicit properties (like return type or access modifiers), which will be covered later in this presentation. More about syntactic analysis can be found here: Wikipedia.At last it can convert the CST into an AST (an abstract syntax tree). It’s exactly the same tree, but each token is either replaced with its meaning (like how the text representation of an integer is replaced with the integer itself) or removed (like for the useless plus signs and asterisks) and each node’s children are referenced not via a list of children but via named arrows from the parent (like “left operand” and “right operand” on the slide). Note how there are no more useless symbols and how children ordering has been replaced with children naming, though implicit information still is missing.You can read about it in the great “Dragon Book”.

## Slide 26
- Kotlin compiler
- Splitting the program into tokens (keywords, identifiers, etc.).
- Lexer
- .kt files
- PSI or Lighter AST builder
- Diagnostics
- Type inference
- Resolution
- IR generator
- IR optimizer
- Parser
- Frontend
- Backend
- JVM
- JavaScript
- Native
- Other
- (WASM, Python, etc.?)

**[讲师备注]**
Back to the Kotlin compiler. At first, the lexer produces the list of tokens.Kotlin lexical keywords and lexical description: specification of syntax and grammar, keywords and operators, ANTLR description of Kotlin grammar in the Kotlin specification repo, Kotlin compiler inner lexer generator in Kotlin repo.

## Slide 27
- Kotlin compiler
- Converting the list of tokens into CST or AST
- PSI or Lighter AST builder
- Lexer
- .kt files
- Diagnostics
- Type inference
- Resolution
- IR generator
- IR optimizer
- Parser
- Frontend
- Backend
- JVM
- JavaScript
- Native
- Other
- (WASM, Python, etc.?)

**[讲师备注]**
Then the parser converts it into either a CST or an AST.The Kotlin compiler produces either a PSI (program structure interface) or a Lighter AST. PSI and Lighter AST are IntelliJ Platform APIs for the CST and AST, respectively. During compilation a Lighter AST is used. But a PSI is used in IDEs or for semantic search.

## Slide 28
- Kotlin compiler: PSI

**[讲师备注]**
A PSI viewer is available in IntelliJ IDEA out of the box or via a plugin.

## Slide 29
- Kotlin compiler: PSI
- 'String'
- fun hello(user: String) = ...
- FUN
- 'fun'
- ' '
- 'hello'
- VALUE_PARAMETER_LIST
- ' '
- '='
- ' '
- ...
- VALUE_PARAMETER
- ')'
- '('
- 'user'
- ':'
- ' '
- ...

**[讲师备注]**
This is how the sample function definition is divided into tokens and represented as a PSI.Notice that all symbols are included in the tree, including braces, parenthesis, dots, colons, semicolons, and other symbols that may seem useless in terms of what the code means. But here you won’t find return, public, or any other usually skipped elements because they are skipped. Hence, they are not represented in the CST despite being meant by function declarations. This is because the CST is a representation of the text itself, but not its meaning. All this information is inferred on the frontend only. This phase is only used for transforming plain text into lexical representation. No syntax analysis is performed.

In parser CSTs, vertices are represented as instances of types corresponding to (terminal and nonterminal) symbols of the formal grammar, and arrows are represented as the instances’ fields (which means you can access any child via the corresponding field of the parent instance). Simply, one can say that the scheme of any API like a PSI is the CST where arrows are named.

## Slide 30
- Kotlin compiler: PSI
- CALL_EXPRESSION
- REFERENCE_EXPRESSION
- VALUE_ARGUMENT
- ')'
- '('
- fun hello(user: String) = println("Hello, $user")
- VALUE_ARGUMENT_LIST
- 'println'
- STRING_TEMPLATE
- '\"'
- LITERAL_STRING_TEMPLATE_ENTRY
- SHORT_STRING_TEMPLATE_ENTRY
- '\"'
- 'Hello, '
- '$'
- REFERENCE_EXPRESSION
- 'user'

**[讲师备注]**
This is how the sample code (the function) is represented in a PSI. Here the root of the subtree corresponds to the function body.

## Slide 31
- Kotlin compiler: PSI
- CALL_EXPRESSION
- REFERENCE_EXPRESSION
- VALUE_ARGUMENT
- ')'
- '('
- fun hello(user: String) = println("Hello, $user")
- VALUE_ARGUMENT_LIST
- 'println'
- STRING_TEMPLATE
- '\"'
- LITERAL_STRING_TEMPLATE_ENTRY
- SHORT_STRING_TEMPLATE_ENTRY
- '\"'
- 'Hello, '
- '$'
- REFERENCE_EXPRESSION
- 'user'

**[讲师备注]**
And the string template that is an argument of println corresponds to the vertex STRING_TEMPLATE. But because it is the only argument of the called function it also corresponds to VALUE_ARGUMENT vertex.

## Slide 32
- Kotlin compiler: PSI
- CALL_EXPRESSION
- REFERENCE_EXPRESSION
- VALUE_ARGUMENT
- ')'
- '('
- fun hello(user: String) = println("Hello, $user")
- VALUE_ARGUMENT_LIST
- 'println'
- STRING_TEMPLATE
- '\"'
- LITERAL_STRING_TEMPLATE_ENTRY
- SHORT_STRING_TEMPLATE_ENTRY
- '\"'
- 'Hello, '
- '$'
- REFERENCE_EXPRESSION
- 'user'

**[讲师备注]**
The usage of the user variable in the string template corresponds to the REFERENCE_EXPRESSION vertex.

## Slide 33
- Kotlin compiler
- The so-called FIR tree is being built,. It’s an analogue of the PSI, but it’s mutable.
- Lexer
- .kt files
- PSI or Lighter AST builder
- Diagnostics
- Type inference
- Resolution
- IR generator
- IR optimizer
- Parser
- Frontend
- Backend
- JVM
- JavaScript
- Native
- Other
- (WASM, Python, etc.?)

**[讲师备注]**
Whereas the parser creates a Lighter AST representation of the source code, the frontend converts it to an FIR (a front-end intermediate representation), which is arranged similarly to a Lighter AST but is instead mutable. This allows you to add new information about the tokens to exactly the same tree instead of some different structures constructed around the tree (like “banding context”, which is a big concurrent and very bulky hashmap). This means that at the beginning, the frontend just reconstructs the tree in the FIR format instead of Lighter AST and then fills it with inferred information (for example, it resolves references, infers types etc.) and runs diagnostics on the tree full of information. Also, it may change the tree for certain reasons, such as desugaring, which will be discussed a bit later, or automated complex code generation via compiler plugin.In reality, the frontend is divided into a lot of phases. In this course, the phases are grouped into 3 larger phases that describe the main front-end jobs. (The full list of phases is available here.) Also, currently FIR is not produced by default and Lighter AST is used and is passed to the backend instead, meanwhile inferred information is stored in a banding context. FIR usage can be turned on with a compiler flag, and soon it will become the default representation on the frontend.

## Slide 34
- SimpleFunction (name = hello)
- ValueParameter (name = user)
- ResolvedTypeRef(=kotlin/String)
- ...
- fun hello(user: String) = println("Hello, $user")
- ResolvedTypeRef(=kotlin/Unit)
- body
- returnTypeRef
- valueParameters
- returnTypeRef
- FIR? Another tree!

**[讲师备注]**
This is how a similar example is represented as an FIR. Here, types are already resolved. Before the resolution process, the types are either represented as “user type reference” or not represented at all. Precisely, the type references are plugged with mock FirImplicitTypeRef vertices that should be and will be substituted with the inferred types.

## Slide 35
- SimpleFunction (name = hello)
- ValueParameter (name = user)
- ResolvedTypeRef(=kotlin/String)
- ...
- fun hello(user: String) = println("Hello, $user")
- ResolvedTypeRef(=kotlin/Unit)
- body
- returnTypeRef
- valueParameters
- returnTypeRef
- FIR? Another tree!

**[讲师备注]**
This is where parameter and return types are represented in the FIR.

## Slide 36
- StringConcatenationCall
- ArgumentList
- FunctionCall
- fun hello(user: String) = println("Hello, $user")
- ResolvedTypeRef (=kotlin/String)
- ConstExpression (value = "Hello, ", kind = String)
- ResolvedTypeRef(=kotlin/String)
- QualifiedAccessExpression
- ResolvedTypeRef (=kotlin/String)
- ResolvedNameReference (name = toString)
- ResolvedTypeRef (=kotlin/String)
- ResolvedNameReference (name = user)
- typeRef
- calleeReference
- typeRef
- calleeReference
- explictReceiver
- typeRef
- arguments
- arguments
- typeRef
- argumentList
- FIR? Another tree!

**[讲师备注]**
This is the FIR of the string template.

## Slide 37
- StringConcatenationCall
- ArgumentList
- FunctionCall
- fun hello(user: String) = println("Hello, $user")
- ResolvedTypeRef (=kotlin/String)
- ConstExpression (value = "Hello, ", kind = String)
- ResolvedTypeRef(=kotlin/String)
- QualifiedAccessExpression
- ResolvedTypeRef (=kotlin/String)
- ResolvedNameReference (name = toString)
- ResolvedTypeRef (=kotlin/String)
- ResolvedNameReference (name = user)
- typeRef
- calleeReference
- typeRef
- calleeReference
- explictReceiver
- typeRef
- arguments
- arguments
- typeRef
- argumentList
- FIR? Another tree!

**[讲师备注]**
The "Hello, " is represented as a constant expression. And it has a type reference too!

## Slide 38
- StringConcatenationCall
- ArgumentList
- FunctionCall
- fun hello(user: String) = println("Hello, $user")
- ResolvedTypeRef (=kotlin/String)
- ConstExpression (value = "Hello, ", kind = String)
- ResolvedTypeRef(=kotlin/String)
- QualifiedAccessExpression
- ResolvedTypeRef (=kotlin/String)
- ResolvedNameReference (name = toString)
- ResolvedTypeRef (=kotlin/String)
- ResolvedNameReference (name = user)
- typeRef
- calleeReference
- typeRef
- calleeReference
- explictReceiver
- typeRef
- arguments
- arguments
- typeRef
- argumentList
- FIR? Another tree!

**[讲师备注]**
This is where the variable reference is represented.

## Slide 39
- StringConcatenationCall
- ArgumentList
- FunctionCall
- fun hello(user: String) = println("Hello, $user")
- ResolvedTypeRef (=kotlin/String)
- ConstExpression (value = "Hello, ", kind = String)
- ResolvedTypeRef(=kotlin/String)
- QualifiedAccessExpression
- ResolvedTypeRef (=kotlin/String)
- ResolvedNameReference (name = toString)
- ResolvedTypeRef (=kotlin/String)
- ResolvedNameReference (name = user)
- typeRef
- calleeReference
- typeRef
- calleeReference
- explictReceiver
- typeRef
- arguments
- arguments
- typeRef
- argumentList
- FIR? Another tree!

**[讲师备注]**
Remember that each object (that inherits the Any interface) has a method toString(): String. So formally, the expression "Hello, $user" actually means "Hello, " + user.toString(). That’s why the toString function call is also inserted into the tree. Actually, string templates are computed via the good old StringBuilder. Thus, it will also be inserted into the tree.

## Slide 40
- if (b) {
- println("Hello")
- }
- for (s in list) {
- println(s)
- }
- val (a, b) = "a" to "b"
- FIR: desugaring
- when {
- b -> println("Hello")
- }
- val <iterator> = list.iterator()
- while (<iterator>.hasNext()) {
- val s = <iterator>.next()
- println(s)
- }
- val <destruct> = "a" to "b"
- val a = <destruct>.component1()
- val b = <destruct>.component2()

**[讲师备注]**
The frontend also performs desugaring. Desugaring is the process of replacing high-level constructions with equivalent low-level code. Simply put, desugaring replaces syntax sugar with “sugar-free” equivalents. It allows you to eliminate boilerplate in compiler code (like writing similar code for if and when expressions) and make the code ready for conversion into platform operations.

## Slide 41
- Kotlin compiler
- Resolving the FQ names
- Lexer
- .kt files
- PSI or Lighter AST builder
- Diagnostics
- Type inference
- Resolution
- IR generator
- IR optimizer
- Parser
- Frontend
- Backend
- JVM
- JavaScript
- Native
- Other
- (WASM, Python, etc.?)

**[讲师备注]**
The resolver just replaces the names of entities defined by the user with their fully qualified analogues. In other words, a user-friendly name like “Int” might be replaced with a compiler-friendly FQ name like “kotlin.Int”.

## Slide 42
- Kotlin compiler: resolve
- fun myFunction() {
- }
- fun myFunction() {
- }
- Library A
- Library B
- Short FQ name: myFunction
- Resolved FQ name: org.libraryA.myFunction
- Short FQ name: myFunction
- Resolved FQ name: org.libraryB.myFunction

**[讲师备注]**
Consider an example. Let's say we have two functions in different libraries or modules, but with the same name. In the original FIR tree, we have the same nodes for them – the functions’ nodes with the name myFunction. However, these functions are different and we don't know exactly which of them is called in the user code. Or the user can rename any entity in the import statement (like import kotlin.collections.List as Tsil). So when you see any type reference like String or MyList or a function reference like plus when there are a lot of similar plus functions, it’s not obvious at all what type or function is used exactly.
In this case, we can resolve the fully qualified (FQ) names with the full paths of the functions – the package, parent classes, and function name. And using the FQ name, we can determine the entity. This allows us to check the availability of the entities during the very first steps . Also, when the entity is a function, this allows us to check the correctness of the function’s return type usage.

## Slide 43
- Kotlin compiler
- Infers all types and resolves functions bodies
- Lexer
- .kt files
- PSI or Lighter AST builder
- Diagnostics
- Type inference
- Resolution
- IR generator
- IR optimizer
- Parser
- Frontend
- Backend
- JVM
- JavaScript
- Native
- Other
- (WASM, Python, etc.?)

**[讲师备注]**
Type inference is a process through which the compiler understands what each implicit type is.

## Slide 44
- Kotlin compiler
- fun hello(user: String) = println("Hello, $user")
- SimpleFirFunction (name = hello)
- ValueParameter (name = user)
- ConstExpression (value = "Hello, ", kind = String)
- ...
- ResolvedTypeRef (=kotlin/String)
- UserTypeRef (="String")
- ImplicitTypeRef
- ResolvedTypeRef (=kotlin/String)
- ResolvedTypeRef (=kotlin/Unit)
- body
- valueParameters
- returnTypeRef
- returnTypeRef
- typeRef
- Type resolution
- Type inference

**[讲师备注]**
For example, consider the code snippet on the slide. Right after the FIR is generated, the function’s return type, the user parameter’s type, and the "Hello, " constant’s type are marked as ImplicitTypeRef, UserTypeRef (="String"), and ResolvedTypeRef (=kotlin/String). This means that the string constant’s type is resolved from the start, whereas the parameter’s type is just described as a string "String", but still is not resolved, and the function’s return type is not described at all, so it will be inferred.After that, during resolution, we resolve all mentioned entities, so the parameter’s type is resolved, but the function’s return type still is undetermined.

Then we perform type inference, which finally infers the function’s return type from the body return type, which actually is inferred from the println function’s return type that is determined after resolution. This and a lot of similar deductions are performed during type inference.

## Slide 45
- Java interoperability: nullability
- Java sources
- public class Main {
- public static String foo() {
- // TODO
- }
- }
- Kotlin sourcesvar a: ???? = foo()
- Java nullable types in Kotlin

**[讲师备注]**
There are a lot of nuances when it comes to interoperability. For example, consider a piece of Java code like the one shown here. Kotlin is interoperable with Java, so the Java function can be called from Kotlin. But Java has no null safety. This raises the question: How is the function’s return type represented in Kotlin?

## Slide 46
- Java interoperability: nullability
- Java sources
- public class Main {
- public static String foo() {
- // TODO
- }
- }
- Kotlin sourcesvar a: ???? = foo()
- String!
- Java nullable types in Kotlin

**[讲师备注]**
It makes sense to assume that it will be represented as String?. But the reality is a bit more complicated. The return type will be interpreted as a String!.

## Slide 47
- Java interoperability: nullability
- Java sources
- public class Main {
- public static String foo() {
- // TODO
- }
- }
- Kotlin sourcesvar a: ???? = foo()
- String!
- Java nullable types in Kotlin
- String! is the type range: [String..String?]

**[讲师备注]**
Such types are called platform types. When you have a value of a platform type you can safely cast it to either String or String?. You also can (and should) cast it or use it the moment you receive it. But note that you cannot denote the type as String!.

If you are interested in more concrete explanation of how platform type T! works, then you can informally think of it like this: T! is either T or T?, but we cannot be sure. Or you can define it a bit more formally as “a type X such that a value of type X can be used where type T is expected and a value of type T? can be used where X is expected”. There is an even more formal definition, but it defies common sense and we do not recommend reading it unless you are confident in your math knowledge and skills.More on this topic: about platform types in Kotlin docs, about range types (abstraction of platform type) in Kotlin specs.

## Slide 48
- Java interoperability: nullability
- Java sources
- public class Main {
- @NotNull
- public static String foo() {
- // TODO
- }
- }
- Kotlin sourcesvar a: String = foo()
- Java nullable types in Kotlin
- Nullability annotations @NotNull and @Nullable

**[讲师备注]**
But you also can annotate any type in any declaration with either @NotNull or @Nullable, or you can use other annotations that the Kotlin compiler supports.More about: supported nullability annotations.

## Slide 49
- Java interoperability: collection mapping
- Java sources
- public class Main {
- @NotNull
- public static List<@NotNull String> foo() {
- // TODO
- }
- }
- Java collection types in Kotlin
- Kotlin sourcesvar a: ???? = foo()

**[讲师备注]**
Another problem is that all common collection interfaces in Java (like List, Set, Map, Collection, Iterable, etc.) are mutable by default, whereas Kotlin differentiates mutable and immutable alternatives by having two different interfaces for each case (MutableList and List, for example). So what is the variable’s type now?

## Slide 50
- Java interoperability: collection mapping
- Java sources
- public class Main {
- @NotNull
- public static List<@NotNull String> foo() {
- // TODO
- }
- }
- Java collection types in Kotlin
- (Mutable)List<T> is the type range: [MutableList<T>..List<T>]
- Kotlin sourcesvar a: ???? = foo()
- (Mutable)List<String>

**[讲师备注]**
In the same way, we have the platform type (Mutable)List<String>, which is a type range as well.

More about: types mapping docs.

## Slide 51
- Kotlin compiler: control- and data-flow analysis
- Variable initialization analysis
- Return analysis
- Smart cast analysis
- val a: Int
- while(true) {
- if (Random.nextBoolean()) {
- a = 15
- break
- }
- }
- println(a) // It compiles!
- Each variable is initialized before being used.
- Each immutable variable is not reassigned after initialization.

**[讲师备注]**
As you already may know, the Kotlin compiler is smart and can draw more advanced conclusions. It can check whether each variable is assigned a value before it is used, and whether each immutable variable is not reassigned after initialization.

## Slide 52
- Kotlin compiler: control- and data-flow analysis
- Variable initialization analysis
- Return analysis
- Smart cast analysis
- fun bar(): Int {
- print("Again")
- while (true) {
- print(" and again")
- }
- } // It compiles!
- fun baz(): Long {
- error("YOLO! :)")
- } // It compiles!
- If the return type is not Unit, then the function won’t return control unless it returns something.

**[讲师备注]**
It can check to ensure that a function with a non-Unit return type does not stop its execution until it returns something.

## Slide 53
- Kotlin compiler: control- and data-flow analysis
- Variable initialization analysis
- Return analysis
- Smart cast analysis
- fun Any?.printFirstElement() {
- when (this) {
- is List<*> -> get(0)
- is Iterable<*> -> iterator().next()
- }
- }
- fun String?.length(): Int =
- if (this == null) 0
- else length
- fun Int?.isEven(): Boolean =
- this != null && this % 2 == 0
- If type check is successful, then the checked value is automatically casted to the corresponding type.

**[讲师备注]**
The compiler can also automatically cast each variable to the corresponding type after type checks (or if it is sure for some reason that the variable can be safely cast).

Obviously, the type cast would be very verbose or hard to write and read if the compiler could not perform the analyses!

## Slide 54
- Kotlin compiler: control- and data-flow analysis
- Enter function bar
- Enter while loop
- Evaluate loop condition
- Exit loop
- Enter loop block
- Evaluate if condition
- Enter if
- Type operator: x as A
- Exit if
- Exit loop block
- Jump: break
- Function call: x.foo()
- Exit function bar
- true
- true
- false
- false
- interface A {
- fun foo()
- }
- fun bar(x: Any, b: Boolean) {
- while (true) {
- if (b) {
- x as A
- break
- }
- }
- x.foo()
- }
- Enter if branch

**[讲师备注]**
But how does the compiler do it?

For each function, the Kotlin compiler creates a CFG (control-flow graph), which describes the control flow in the function. You can see a simplified version on the slide.

## Slide 55
- Kotlin compiler: control- and data-flow analysis
- Enter function bar
- Enter while loop
- Evaluate loop condition
- Exit loop
- Enter loop block
- Evaluate if condition
- Enter if
- Exit if
- Exit loop block
- Function call: x.foo()
- Exit function bar
- true
- false
- interface A {
- fun foo()
- }
- fun bar(x: Any, b: Boolean) {
- while (true) {
- if (b) {
- x as A
- break
- }
- }
- x.foo()
- }
- Type operator: x as A
- Jump: break
- true
- false
- Enter if branch

**[讲师备注]**
Here we can see the start state where the cursor has just entered the function’s body.

## Slide 56
- Kotlin compiler: control- and data-flow analysis
- Enter function bar
- Enter while loop
- Evaluate loop condition
- Exit loop
- Enter loop block
- Evaluate if condition
- Enter if
- Exit if
- Exit loop block
- Function call: x.foo()
- Exit function bar
- true
- false
- interface A {
- fun foo()
- }
- fun bar(x: Any, b: Boolean) {
- while (true) {
- if (b) {
- x as A
- break
- }
- }
- x.foo()
- }
- Type operator: x as A
- Jump: break
- true
- false
- Enter if branch

**[讲师备注]**
Then it finds the while loop,

## Slide 57
- Kotlin compiler: control- and data-flow analysis
- Enter function bar
- Enter while loop
- Evaluate loop condition
- Exit loop
- Enter loop block
- Evaluate if condition
- Enter if
- Exit if
- Exit loop block
- Function call: x.foo()
- Exit function bar
- true
- false
- interface A {
- fun foo()
- }
- fun bar(x: Any, b: Boolean) {
- while (true) {
- if (b) {
- x as A
- break
- }
- }
- x.foo()
- }
- Type operator: x as A
- Jump: break
- true
- false
- Enter if branch

**[讲师备注]**
evaluates its condition,

## Slide 58
- Kotlin compiler: control- and data-flow analysis
- Enter function bar
- Enter while loop
- Evaluate loop condition
- Exit loop
- Enter loop block
- Evaluate if condition
- Enter if
- Exit if
- Exit loop block
- Function call: x.foo()
- Exit function bar
- true
- false
- interface A {
- fun foo()
- }
- fun bar(x: Any, b: Boolean) {
- while (true) {
- if (b) {
- x as A
- break
- }
- }
- x.foo()
- }
- Type operator: x as A
- Jump: break
- true
- false
- Enter if branch

**[讲师备注]**
and either enters the loop’s body or exits the loop.

## Slide 59
- Kotlin compiler: control- and data-flow analysis
- Enter function bar
- Enter while loop
- Evaluate loop condition
- Exit loop
- Enter loop block
- Evaluate if condition
- Enter if
- Exit if
- Exit loop block
- Function call: x.foo()
- Exit function bar
- true
- false
- interface A {
- fun foo()
- }
- fun bar(x: Any, b: Boolean) {
- while (true) {
- if (b) {
- x as A
- break
- }
- }
- x.foo()
- }
- Type operator: x as A
- Jump: break
- true
- false
- Enter if branch

**[讲师备注]**
If it enters the body, then it finds the if construction and enters it.

## Slide 60
- Kotlin compiler: control- and data-flow analysis
- Enter function bar
- Enter while loop
- Evaluate loop condition
- Exit loop
- Enter loop block
- Evaluate if condition
- Enter if
- Exit if
- Exit loop block
- Function call: x.foo()
- Exit function bar
- true
- false
- interface A {
- fun foo()
- }
- fun bar(x: Any, b: Boolean) {
- while (true) {
- if (b) {
- x as A
- break
- }
- }
- x.foo()
- }
- Type operator: x as A
- Jump: break
- true
- false
- Enter if branch

**[讲师备注]**
Then the cursor evaluates the if condition and

## Slide 61
- Kotlin compiler: control- and data-flow analysis
- Enter function bar
- Enter while loop
- Evaluate loop condition
- Exit loop
- Enter loop block
- Evaluate if condition
- Enter if
- Exit if
- Exit loop block
- Function call: x.foo()
- Exit function bar
- true
- false
- interface A {
- fun foo()
- }
- fun bar(x: Any, b: Boolean) {
- while (true) {
- if (b) {
- x as A
- break
- }
- }
- x.foo()
- }
- Type operator: x as A
- Jump: break
- true
- false
- Enter if branch

**[讲师备注]**
either enters the if branch or exits the construction.

## Slide 62
- Kotlin compiler: control- and data-flow analysis
- Enter function bar
- Enter while loop
- Evaluate loop condition
- Exit loop
- Enter loop block
- Evaluate if condition
- Enter if
- Type operator: x as A
- Exit if
- Exit loop block
- Jump: break
- Function call: x.foo()
- Exit function bar
- true
- true
- false
- false
- interface A {
- fun foo()
- }
- fun bar(x: Any, b: Boolean) {
- while (true) {
- if (b) {
- x as A
- break
- }
- }
- x.foo()
- }
- Enter if branch

**[讲师备注]**
If it enters the branch, then it executes the cast to A and either throws an exception

## Slide 63
- Kotlin compiler: control- and data-flow analysis
- Enter function bar
- Enter while loop
- Evaluate loop condition
- Exit loop
- Enter loop block
- Evaluate if condition
- Enter if
- Type operator: x as A
- Exit if
- Exit loop block
- Jump: break
- Function call: x.foo()
- Exit function bar
- true
- true
- false
- false
- interface A {
- fun foo()
- }
- fun bar(x: Any, b: Boolean) {
- while (true) {
- if (b) {
- x as A
- break
- }
- }
- x.foo()
- }
- Enter if branch

**[讲师备注]**
or continues to the break command that makes the cursor exit the loop.

## Slide 64
- Kotlin compiler: control- and data-flow analysis
- Enter function bar
- Enter while loop
- Evaluate loop condition
- Exit loop
- Enter loop block
- Evaluate if condition
- Enter if
- Type operator: x as A
- Exit if
- Exit loop block
- Jump: break
- Function call: x.foo()
- Exit function bar
- true
- true
- false
- false
- interface A {
- fun foo()
- }
- fun bar(x: Any, b: Boolean) {
- while (true) {
- if (b) {
- x as A
- break
- }
- }
- x.foo()
- }
- Enter if branch

**[讲师备注]**
But if the cursor exits the if construct, then it exits the loop block and goes back to the evaluation of the loop condition.

## Slide 65
- Kotlin compiler: control- and data-flow analysis
- Enter function bar
- Enter while loop
- Evaluate loop condition
- Exit loop
- Enter loop block
- Evaluate if condition
- Enter if
- Type operator: x as A
- Exit if
- Exit loop block
- Jump: break
- Function call: x.foo()
- Exit function bar
- true
- true
- false
- false
- interface A {
- fun foo()
- }
- fun bar(x: Any, b: Boolean) {
- while (true) {
- if (b) {
- x as A
- break
- }
- }
- x.foo()
- }
- Enter if branch

**[讲师备注]**
If the cursor exits the loop, it performs the foo function call and

## Slide 66
- Kotlin compiler: control- and data-flow analysis
- Enter function bar
- Enter while loop
- Evaluate loop condition
- Exit loop
- Enter loop block
- Evaluate if condition
- Enter if
- Type operator: x as A
- Exit if
- Exit loop block
- Jump: break
- Function call: x.foo()
- Exit function bar
- true
- true
- false
- false
- interface A {
- fun foo()
- }
- fun bar(x: Any, b: Boolean) {
- while (true) {
- if (b) {
- x as A
- break
- }
- }
- x.foo()
- }
- Enter if branch

**[讲师备注]**
exits the function bar body.

## Slide 67
- Kotlin compiler: control- and data-flow analysis
- Enter function bar
- Enter while loop
- Evaluate loop condition
- Exit loop
- Enter loop block
- Evaluate if condition
- Enter if
- Type operator: x as A
- Exit if
- Exit loop block
- Jump: break
- Function call: x.foo()
- Exit function bar
- true
- true
- false
- false
- interface A {
- fun foo()
- }
- fun bar(x: Any, b: Boolean) {
- while (true) {
- if (b) {
- x as A
- break
- }
- }
- x.foo()
- }
- Enter if branch
- x is A

**[讲师备注]**
But when the compiler produces the graph, it sees that the while loop condition is always true. So it understands that the false arrow is unreachable and the only way to the function call node goes through the cast node. Thus, it performs the smart cast on x and successfully resolves the function to call.

Warning: This example works only with the K2 compiler. You either have to apply useK2() or set the language version to 2.0.

## Slide 68
- Kotlin compiler
- Almost all checks you've ever seen in IntelliJ IDEA.
- Lexer
- .kt files
- PSI or Lighter AST builder
- Diagnostics
- Type inference
- Resolution
- IR generator
- IR optimizer
- Parser
- Frontend
- Backend
- JVM
- JavaScript
- Native
- Other
- (WASM, Python, etc.?)

**[讲师备注]**
The last stage is diagnostics, where we check for some forbidden cases. Almost all checks in IntelliJ IDEA or errors during compilation are diagnostics. During this stage, the compiler goes through the whole tree one more time, collects all the problems (both errors and warnings), prints them to user and, if there is an error, it stops.

## Slide 69
- Kotlin compiler: diagnostics

**[讲师备注]**
Here’s an example of diagnostics.

## Slide 70
- Kotlin compiler
- On the backend, we DO NOT resolve, but only use the received information
- Lexer
- .kt files
- PSI or Lighter AST builder
- Diagnostics
- Type inference
- Resolution
- IR generator
- IR optimizer
- Parser
- Frontend
- Backend
- JVM
- JavaScript
- Native
- Other
- (WASM, Python, etc.?)

**[讲师备注]**
Lastly, there is the backend. It takes the FIR generated by the frontend and converts it to platform code. On the backend, any extension of the representation, like resolution, is prohibited because it should have been performed on the frontend.

## Slide 71
- Kotlin compiler
- IR, a representation slightly different from FIR.It is still common for all platforms.
- Lexer
- .kt files
- PSI or Lighter AST builder
- Diagnostics
- Type inference
- Resolution
- IR generator
- IR optimizer
- Parser
- Frontend
- Backend
- JVM
- JavaScript
- Native
- Other
- (WASM, Python, etc.?)

**[讲师备注]**
The first stage is IR generation. It is actually the only stage of the middleend (between the frontend and backend), but usually it is treated as an initial stage of the backend. The IR generator converts the FIR to an IR (intermediate representation). Whereas the FIR completely corresponds to the source code – preserving its lexical structure, as it is needed for the diagnostics – the IR is needed for code generation and thus does not correspond to the source code whatsoever. That’s because, on the backend, we don’t need all of the same information that is inferred on the frontend, like the full list of supertypes and so on, but only necessary information.

## Slide 72
- fun hello(user: String) = println("Hello, $user")
- Kotlin compiler: resolved tree

**[讲师备注]**
Consider this code snippet as an example.

## Slide 73
- fun hello(user: String) = println("Hello, $user")
- Kotlin compiler: resolved tree
- public fun hello(user: kotlin.String): kotlin.Unit defined in example in file Example.kt

**[讲师备注]**
After the frontend, we know the full declaration of this function, including its access modifier, the fully qualified names of its input and return types, and in which file it is placed.

## Slide 74
- fun hello(user: String) = println("Hello, $user")
- Kotlin compiler: resolved tree
- Reference to value-parameter user: kotlin.String defined in example.hello

**[讲师备注]**
We also know this reference, including its declaration place and its type,

## Slide 75
- fun hello(user: String) = println("Hello, $user")
- Kotlin compiler: resolved tree
- Type: kotlin.String

**[讲师备注]**
this expression, including its type,

## Slide 76
- fun hello(user: String) = println("Hello, $user")
- Kotlin compiler: resolved tree
- Type: kotlin.String

**[讲师备注]**
this expression, including its type,

## Slide 77
- fun hello(user: String) = println("Hello, $user")
- Kotlin compiler: resolved tree
- Type: kotlin.Unit

**[讲师备注]**
this expression, including its type,

## Slide 78
- fun hello(user: String) = println("Hello, $user")
- Kotlin compiler: resolved tree
- Call: kotlin.io.println(kotlin.String)

**[讲师备注]**
and this call declaration, including the callee definition. Such a thorough description is useless for the backend. So the tree is simplified after conversion to the IR.

## Slide 79
- // file 'src/kotlin/example.kt'
- package helloWorld
- fun hello(user: String) = println("Hello, $user")
- fun main(args: Array<String>) {
- val user = args[0]
- hello(user)
- }
- The code:
- IR? Yet another tree!

**[讲师备注]**
Now let’s consider this code snippet.

## Slide 80
- FUN name:hello visibility:public modality:FINAL <>(user:kotlin.String)
- returnType:kotlin.Unit
- FILE fqName:helloWorld fileName:/example.kt
- CALL 'public final fun println (message: kotlin.Any?): kotlin.Unit [inline] declared in kotlin.io.ConsoleKt'
- type=kotlin.Unit origin=null
- FUN name:main visibility:public modality: FINAL <>(args:kotlin.Array<kotlin.String>)
- returnType:kotlin.Unit
- VALUE_PARAMETER name:user index:0 type:kotlin.String
- BLOCK_BODY
- VALUE_PARAMETER name:args index:0 type:kotlin.Array<kotlin.String>
- BLOCK_BODY
- RETURN type=kotlin.Nothing
- from='public final fun hello (user: kotlin.String): kotlin.Unit declared in helloworld'
- VAR name:user type:kotlin.String [val]
- STRING_CONCATENATION type=kotlin.String
- CALL 'public final fun get (index: kotlin.Int): T of kotlin.Array [operator] declared in kotlin.Array'
- type kotlin.String origin=null
- CALL 'public final fun hello (user: kotlin.String): kotlin.Unit declared in helloworld'
- type kotlin.Unit origin=null
- CONST String type=kotlin.String value="Hello, "
- GET VAR 'user: kotlin.String
- declared in helloWorld.hello'
- type=kotlin.String origin=null
- GET_VAR 'args: kotlin.Array<kotlin.String>
- declared in helloworld.main'
- type=kotlin.Array<kotLin.String> origin=null
- CONST Int type=kotlin.Int value=0
- GET_VAR 'val user: kotlin.String [val]
- declared in helloworld.main'
- type=kotlin.String origin=null
- user:
- index:
- $this:
- message:
- Its IR:
- IR? Yet another tree!

**[讲师备注]**
Here’s the IR of the snippet. Look and be horrified by its complexity!

## Slide 81
- Back-end intermediate representation: a closer look
- FUN name:hello visibility:public modality:FINAL <>(user:kotlin.String)
- returnType:kotlin.Unit
- fun hello(user: String) = println("Hello, $user")
- VALUE_PARAMETER name:user index:0 type:kotlin.String
- BLOCK_BODY
- RETURN type=kotlin.Nothing
- from='public final fun hello (user: kotlin.String): kotlin.Unit declared in helloworld'
- STRING_CONCATENATION type=kotlin.String
- CONST String type=kotlin.String value="Hello, "
- GET VAR 'user: kotlin.String declared in helloworld.hello' type=kotlin.String origin=null
- CALL 'public final fun println (message: kotlin.Any?): kotlin.Unit [inline] declared in kotlin.io.ConsoleKt' type=kotlin.Unit origin=null
- message:

**[讲师备注]**
Let’s look at the part that corresponds to the hello function.

## Slide 82
- Back-end intermediate representation: a closer look
- fun hello(user: String) = println("Hello, $user")
- FUN name:hello visibility:public modality:FINAL <>(user:kotlin.String)
- returnType:kotlin.Unit
- VALUE_PARAMETER name:user index:0 type:kotlin.String
- BLOCK_BODY
- RETURN type=kotlin.Nothing
- from='public final fun hello (user: kotlin.String): kotlin.Unit declared in helloworld'
- STRING_CONCATENATION type=kotlin.String
- CONST String type=kotlin.String value="Hello, "
- GET VAR 'user: kotlin.String declared in helloworld.hello' type=kotlin.String origin=null
- CALL 'public final fun println (message: kotlin.Any?): kotlin.Unit [inline] declared in kotlin.io.ConsoleKt' type=kotlin.Unit origin=null
- message:

**[讲师备注]**
The top node describes the function declaration.

## Slide 83
- Back-end intermediate representation: a closer look
- fun hello(user: String) = println("Hello, $user")
- FUN name:hello visibility:public modality:FINAL <>(user:kotlin.String)
- returnType:kotlin.Unit
- VALUE_PARAMETER name:user index:0 type:kotlin.String
- BLOCK_BODY
- RETURN type=kotlin.Nothing
- from='public final fun hello (user: kotlin.String): kotlin.Unit declared in helloworld'
- STRING_CONCATENATION type=kotlin.String
- CONST String type=kotlin.String value="Hello, "
- GET VAR 'user: kotlin.String declared in helloworld.hello' type=kotlin.String origin=null
- CALL 'public final fun println (message: kotlin.Any?): kotlin.Unit [inline] declared in kotlin.io.ConsoleKt' type=kotlin.Unit origin=null
- message:

**[讲师备注]**
One of its children describes the function’s only parameter: user.

## Slide 84
- Back-end intermediate representation: a closer look
- fun hello(user: String) = println("Hello, $user")
- FUN name:hello visibility:public modality:FINAL <>(user:kotlin.String)
- returnType:kotlin.Unit
- VALUE_PARAMETER name:user index:0 type:kotlin.String
- BLOCK_BODY
- RETURN type=kotlin.Nothing
- from='public final fun hello (user: kotlin.String): kotlin.Unit declared in helloworld'
- STRING_CONCATENATION type=kotlin.String
- CONST String type=kotlin.String value="Hello, "
- GET VAR 'user: kotlin.String declared in helloworld.hello' type=kotlin.String origin=null
- CALL 'public final fun println (message: kotlin.Any?): kotlin.Unit [inline] declared in kotlin.io.ConsoleKt' type=kotlin.Unit origin=null
- message:

**[讲师备注]**
The remaining child describes the function’s body, which consists only of the RETURN node (because a single-expression function is just a function that returns the value of the only expression).

## Slide 85
- Back-end intermediate representation: a closer look
- fun hello(user: String) = println("Hello, $user")
- FUN name:hello visibility:public modality:FINAL <>(user:kotlin.String)
- returnType:kotlin.Unit
- VALUE_PARAMETER name:user index:0 type:kotlin.String
- BLOCK_BODY
- RETURN type=kotlin.Nothing
- from='public final fun hello (user: kotlin.String): kotlin.Unit declared in helloworld'
- STRING_CONCATENATION type=kotlin.String
- CONST String type=kotlin.String value="Hello, "
- GET VAR 'user: kotlin.String declared in helloworld.hello' type=kotlin.String origin=null
- CALL 'public final fun println (message: kotlin.Any?): kotlin.Unit [inline] declared in kotlin.io.ConsoleKt' type=kotlin.Unit origin=null
- message:

**[讲师备注]**
The expression is just a call of the println function (or more precisely, the kotlin.io.println(Any?) function) from the standard library.

## Slide 86
- Back-end intermediate representation: a closer look
- fun hello(user: String) = println("Hello, $user")
- FUN name:hello visibility:public modality:FINAL <>(user:kotlin.String)
- returnType:kotlin.Unit
- VALUE_PARAMETER name:user index:0 type:kotlin.String
- BLOCK_BODY
- RETURN type=kotlin.Nothing
- from='public final fun hello (user: kotlin.String): kotlin.Unit declared in helloworld'
- STRING_CONCATENATION type=kotlin.String
- CONST String type=kotlin.String value="Hello, "
- GET VAR 'user: kotlin.String declared in helloworld.hello' type=kotlin.String origin=null
- CALL 'public final fun println (message: kotlin.Any?): kotlin.Unit [inline] declared in kotlin.io.ConsoleKt' type=kotlin.Unit origin=null
- message:

**[讲师备注]**
The function consumes an argument named message. Here the argument is a string concatenation that consumes two arguments:

## Slide 87
- Back-end intermediate representation: a closer look
- fun hello(user: String) = println("Hello, $user")
- FUN name:hello visibility:public modality:FINAL <>(user:kotlin.String)
- returnType:kotlin.Unit
- VALUE_PARAMETER name:user index:0 type:kotlin.String
- BLOCK_BODY
- RETURN type=kotlin.Nothing
- from='public final fun hello (user: kotlin.String): kotlin.Unit declared in helloworld'
- STRING_CONCATENATION type=kotlin.String
- CONST String type=kotlin.String value="Hello, "
- GET VAR 'user: kotlin.String declared in helloworld.hello' type=kotlin.String origin=null
- CALL 'public final fun println (message: kotlin.Any?): kotlin.Unit [inline] declared in kotlin.io.ConsoleKt' type=kotlin.Unit origin=null
- message:

**[讲师备注]**
the constant string "Hello, "

## Slide 88
- Back-end intermediate representation: a closer look
- fun hello(user: String) = println("Hello, $user")
- FUN name:hello visibility:public modality:FINAL <>(user:kotlin.String)
- returnType:kotlin.Unit
- VALUE_PARAMETER name:user index:0 type:kotlin.String
- BLOCK_BODY
- RETURN type=kotlin.Nothing
- from='public final fun hello (user: kotlin.String): kotlin.Unit declared in helloworld'
- STRING_CONCATENATION type=kotlin.String
- CONST String type=kotlin.String value="Hello, "
- GET VAR 'user: kotlin.String declared in helloworld.hello' type=kotlin.String origin=null
- CALL 'public final fun println (message: kotlin.Any?): kotlin.Unit [inline] declared in kotlin.io.ConsoleKt' type=kotlin.Unit origin=null
- message:

**[讲师备注]**
and a string variable that is defined as an argument of the function.

## Slide 89
- Kotlin compiler
- Platform-specific code, such as bytecode for the JVM
- Lexer
- .kt files
- PSI or Lighter AST builder
- Diagnostics
- Type inference
- Resolution
- IR generator
- IR optimizer
- Parser
- Frontend
- Backend
- JVM
- JavaScript
- Native
- Other
- (WASM, Python, etc.?)

**[讲师备注]**
After the IR is generated, it is optimized. During this step, the compiler performs the optimizations that are the same for all platforms, like constant propagation (the substitution of compile-time constants with their actual values).

## Slide 90
- Kotlin compiler
- Lexer
- .kt files
- PSI or Lighter AST builder
- Diagnostics
- Type inference
- IR generator
- IR optimizer
- Parser
- Frontend
- Backend
- Platform-specific code, such as bytecode for the JVM
- JVM
- JavaScript
- Native
- Other
- (WASM, Python, etc.?)
- Resolution

**[讲师备注]**
After the IR is generated and optimized, it is serialized or compiled by a platform-specific backend into a corresponding platform format (Java bytecode for the JVM, JS code – potentially with TS declarations – for the JS platform, machine code for native platforms, etc.).

## Slide 91
- KLibs
- JAR analogues – store a serialized IR for the subsequent use of cross-platform libraries.
- Common code
- JVM code
- Native code
- Kotlin/Native
- Kotlin/JVM
- Classes
- Native objects
- KLib

**[讲师备注]**
Imagine you are writing a Kotlin library for several platforms. You have two options: to implement the library for each platform separately or to implement it once and compile/re-use its code for all platforms. Obviously, the second option is way simpler to maintain, develop, and test. And it is possible with the Kotlin Multiplatform concept. This allows you to write code in a dialect of Kotlin that is an intersection of all Kotlin dialects (Kotlin/JVM, Kotlin/JS, Kotlin/Native, etc.), which will then be available to the code on each platform as if it had been copy-pasted in. As a result, you can implement common logic for all platforms exactly once by writing it as common code. It’s also possible to share code between any subset of platforms as opposed to all of them or exactly one of them, which is very useful when you have some logic that can be abstracted to several but not all platforms. Furthermore, you can delegate implementation to platform code instead of common code, which is very useful when you have logic that dictates which declarations can be abstracted, but the specific implementations that can be abstracted differ from one platform to another. You can find more on this in the “Multiplatform development” section of the Kotlin docs, starting with “Sharing code principles”.

But how exactly does it work from the compiler’s point of view? Well, common code is processed first, generating the IR, which is then used during the compilation of platform code. In other words, you start by compiling common code with its dependencies. After you’ve generated the common IR code, you compile the code for each platform with the IR, common code dependencies, and the platform code dependencies.

But then you have this simple question: In what format do you receive and use the dependencies? If we are talking about JVM code, for example, then it can be compiled to Java bytecode and used in this form. But this is not really convenient and there is no such format for common code. As it turns out, the answer is just as simple; libraries are shared as serialized IRs that are archived as individual ZIP files. Such files are called KLibs (which stands for “Kotlin Libraries”) and have the extension “.klib”. KLibs are very similar to JARs. Thus, any multiplatform library is distributed as a KLib file for common code and in a platform-specific format for the corresponding platform code. To be precise, source code is converted into an optimized IR that can be either serialized as KLib files for future deserialization and further usage or used with other sources (like JVM, JS, or Native code or other KLibs from other dependency libraries) to compile result code (JS/TS code, JVM classes, or Native code).

The scheme on the slide may contain several targets on various platforms – the JVM, Native, JS, WASM, etc. There just wasn’t enough space for all of them.

## Slide 92
- Compiler plugins
- You can extend any compile phase via compiler plugins. To do so, you need to implement compiler extensions and register them.
- To register extensions, you need to inherit from CompilerPluginRegistrar ( ComponentRegistrar for previous versions).
- Don’t forget to use supportsK2 = true if you need to support the FIR frontend

**[讲师备注]**
Kotlin has one more advantage: You can extend any Kotlin compiler phase via compiler plugins. Compiler plugins register compiler extensions that implement the logic you need. Hence, they should inherit the registrar class (see slide).

Beware that the Kotlin compiler API is experimental, which means that even patch versions are not compatible.

In case you are interested, here is a slightly outdated tutorial (in the form of a series of articles) about creating your own Kotlin compiler plugin.

## Slide 93
- Compiler plugins: FIR extensions
- To get the full list of the extensions, please see: package org.jetbrains.kotlin.fir.extensions (link).
- Consider an example:
- /*
- * Generates top level class
- *
- * package foo.bar
- *
- * public final class MyClass {
- *     fun foo(): String = "Hello world"
- * }
- */

**[讲师备注]**
Compiler extensions extend the phases you need to extend. You can look up FIR and IR extensions (see link on the slide).Here is an example of an FIR extension that creates a dummy class foo.bar.MyClass with a dummy method.

## Slide 94
- class SimpleClassGenerator(session: FirSession) : FirDeclarationGenerationExtension(session) {
- companion object {
- // foo.bar.MyClass
- val MY_CLASS_ID = ClassId(
- FqName.fromSegments(listOf("foo", "bar")),
- Name.identifier("MyClass")
- )
- // foo.bar.MyClass.foo
- val FOO_ID = CallableId(MY_CLASS_ID, Name.identifier("foo"))
- }
- override fun generateClassLikeDeclaration(classId: ClassId): FirClassLikeSymbol<*>? {
- ...
- }
- ...
- }
- Compiler plugins: FIR extensions

**[讲师备注]**
The first important thing is the FIR Session (see the API for more), which stores current compiler data (like compiler arguments). It is used by all of the compiler logic parts, including compiler plugins.

## Slide 95
- class SimpleClassGenerator(session: FirSession) : FirDeclarationGenerationExtension(session) {
- companion object {
- // foo.bar.MyClass
- val MY_CLASS_ID = ClassId(
- FqName.fromSegments(listOf("foo", "bar")),
- Name.identifier("MyClass")
- )
- // foo.bar.MyClass.foo
- val FOO_ID = CallableId(MY_CLASS_ID, Name.identifier("foo"))
- }
- override fun generateClassLikeDeclaration(classId: ClassId): FirClassLikeSymbol<*>? {
- ...
- }
- ...
- }
- Compiler plugins: FIR extensions

**[讲师备注]**
Then there is FirDeclarationGenerationExtension. As the name implies, it is an extension that creates (generates) a declaration. We implement it in our extension to create our own class, foo.bar.MyClass.

## Slide 96
- class SimpleClassGenerator(session: FirSession) : FirDeclarationGenerationExtension(session) {
- companion object {
- // foo.bar.MyClass
- val MY_CLASS_ID = ClassId(
- FqName.fromSegments(listOf("foo", "bar")),
- Name.identifier("MyClass")
- )
- // foo.bar.MyClass.foo
- val FOO_ID = CallableId(MY_CLASS_ID, Name.identifier("foo"))
- }
- override fun generateClassLikeDeclaration(classId: ClassId): FirClassLikeSymbol<*>? {
- ...
- }
- ...
- }
- Compiler plugins: FIR extensions

**[讲师备注]**
Then there are Name, FqName, ClassId, and CallableId. Name just holds the name that is used by declarations like functions, properties, classes, type aliases, etc. FqName represents the fully qualified name of any entity and works only with the hierarchy of fully qualified names.

## Slide 97
- class SimpleClassGenerator(session: FirSession) : FirDeclarationGenerationExtension(session) {
- companion object {
- // foo.bar.MyClass
- val MY_CLASS_ID = ClassId(
- FqName.fromSegments(listOf("foo", "bar")),
- Name.identifier("MyClass")
- )
- // foo.bar.MyClass.foo
- val FOO_ID = CallableId(MY_CLASS_ID, Name.identifier("foo"))
- }
- override fun generateClassLikeDeclaration(classId: ClassId): FirClassLikeSymbol<*>? {
- ...
- }
- ...
- }
- Compiler plugins: FIR extensions

**[讲师备注]**
ClassId represents the ID of a classifier (i.e. class, interface, or object) and also stores such information as its package FQ name. In a similar way, CallableId represents the ID of something callable (for example, function, method, property getter or setter, or class constructor).

Thus, we have just defined MY_CLASS_ID, the ID of our class, and FOO_ID, its method ID, but we have not informed the compiler about them for now.

## Slide 98
- class SimpleClassGenerator(session: FirSession) : FirDeclarationGenerationExtension(session) {
- companion object {
- // foo.bar.MyClass
- val MY_CLASS_ID = ClassId(
- FqName.fromSegments(listOf("foo", "bar")),
- Name.identifier("MyClass")
- )
- // foo.bar.MyClass.foo
- val FOO_ID = CallableId(MY_CLASS_ID, Name.identifier("foo"))
- }
- override fun generateClassLikeDeclaration(classId: ClassId): FirClassLikeSymbol<*>? {
- ...
- }
- ...
- }
- Compiler plugins: FIR extensions

**[讲师备注]**
Then you can describe how to generate the declaration on the frontend. Actually, FirDeclarationGenerationExtension provides an API that will ask functions like getTopLevelClassIds and generateClassLikeDeclaration to provide the necessary information for new entities and their corresponding logic. So you can generate the class’s body by overriding generateClassLikeDeclaration. But logic generation is usually processed on the backend, leaving only mock logic on frontend. This is because it’s not that hard to declare the entities, but the logic generation itself is very slow on the frontend, and mock logic is sufficient there. Thus, we go this route by writing the mock generation in the overriding of the method and by implementing true logic generation via back-end extension later.Thus, we’ve described how to generate a mock version of the entities the moment we see their IDs, but we still have not registered their IDs.

## Slide 99
- You use a special key to mark everything generated by the compiler and can transfer any information between frontend and backend. So it also helps to find the new declaration to generate it’s IR.
- class SimpleClassGenerator(session: FirSession) : FirDeclarationGenerationExtension(session) {
- object Key : GeneratedDeclarationKey()
- ...
- }
- Compiler plugins: FIR extensions

**[讲师备注]**
Then there is GeneratedDeclarationKey. The class is inherited only by objects. Each plugin has its own key, which is used to signify that the entities are part of the compile logic.For example, all entities in the FIR have the origin: FirDeclarationOrigin field, which describes their origin: Did they come from existing code (like Kotlin and Java sources and libraries), or are they generated by Kotlin language constructions (like SAM constructors, synthetic entities, etc.), or are they generated by compiler plugins? Entities generated by compiler plugin have origin that store the plugin’s key. So the key marks which entities are generated by the plugin and should be used while creating our class and function.You can also use this object to transfer any information between the frontend and backend.

## Slide 100
- Don’t forget to register all new declarations.
- class SimpleClassGenerator(session: FirSession) : FirDeclarationGenerationExtension(session) {
- ...
- override fun getTopLevelClassIds(): Set<ClassId> {
- return setOf(MY_CLASS_ID)
- }
- override fun hasPackage(packageFqName: FqName): Boolean {
- return packageFqName == MY_CLASS_ID.packageFqName
- }
- }
- Compiler plugins: FIR extensions

**[讲师备注]**
Now let’s inform the compiler about entities we want to create.

As we’ve already discussed, we need to override functions that will tell the compiler (precisely, the API of FirDeclarationGenerationExtension) about new declarations. Here getTopLevelClassIds should return the IDs of our top level classifiers (only foo.bar.Foo in our case), and hasPackage should check whether this FQ name represents the package of any of the classes the extension creates. In our case, the only package that appears is foo.bar or MY_CLASS_ID.packageFqName, so we just check whether it matches the package’s FQ name.

## Slide 101
- Actually, the compiler has only one extension for IRs: IrGenerationExtension.
- You just need to implement some transformers and accept them:
- class SimpleIrGenerationExtension: IrGenerationExtension {
- override fun generate(moduleFragment: IrModuleFragment, pluginContext: IrPluginContext) {
- val transformers = listOf(SimpleIrBodyGenerator(pluginContext))
- for (transformer in transformers) {
- moduleFragment.acceptChildrenVoid(transformer)
- }
- }
- }
- Don’t forget to check the key (use the interestedIn function)!
- Compiler plugins: IR extensions

**[讲师备注]**
Here we are implementing the back-end extension. Actually, there is only one type of IR extension. We need only to inherit it and override the generate method, which just creates the necessary transformers and applies them to the leaf element of the IR tree (corresponding to IrModuleFragment). Finally, each transformer that is inheritor of AbstractTransformerForGenerator abstract class, performs the logic generation.

And don’t forget to specify that you are only interestedIn entities marked with our key – SimpleClassGenerator.Key. That is to say, check that the function input key is the key.

## Slide 102
- kotlinx.serialization — Generates visitor code for serializable classes.
- all-open — Marks all classes as open classes.
- kapt — An annotation processor.
- ksp — An API for developing lightweight compiler plugins.
- Jetpack Compose — Generates efficient UI from its declarative description.
- Arrow Meta — Compiler plugin API that empowers all Arrow libraries.
- ...
- Compiler plugins: popular plugins

## Slide 103
- Thanks!
- @kotlin
- |  Developed by JetBrains


--- 统计: 103 页, 96 页含讲师备注