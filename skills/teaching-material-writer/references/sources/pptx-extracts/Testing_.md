# Testing_

共 23 页

## Slide 1
- Testing
- Kotlin
- @kotlin
- |  Developed by JetBrains

**[讲师备注]**
In this lecture we are going to talk about testing — one of the many approaches to finding and fighting bugs in your programs.

## Slide 2
- Testing
- The software development experience we’ve accumulated over the many years unfortunately tells us that
- Every program contains bugs.
- If a program does not contain bugs, the algorithm that it implements contains them.
- If neither the program nor the algorithm contains bugs, no one needs the program (almost always).

**[讲师备注]**
Any program that has some kind of non-trivial behavior contains bugs. These may be in the implementation itself, in the algorithm the program approximates, in the compiler used to build the program, or in the operating system the program is run on. Unfortunately, any program that is guaranteed to be bug-free probably also isn’t of much use to anybody.

References:
https://en.wikipedia.org/wiki/Rice%27s_theorem

## Slide 3
- Testing
- Ariane 5
- However, everything is relative:
- A bug in a website might not really hurt anybody
- A bug in rocket launch calculations can result in terrible consequences and expenses (Ariane 5)
- A bug in a radiation-treatment device can lead to deaths (Therac-25)

**[讲师备注]**
Unfortunately, not all bugs are created equal. Some bugs only create minor problems for users. For instance, an error on a website may mean you’ll have to try to pay for your order several times, and that is fixable. Other errors may cause enormous monetary losses; for example, this is what happened with Ariane 5.

“On June 4, 1996, the engines of the very first Ariane 5 rocket caught fire, and it began to move away from the coast of French Guiana. After 37 seconds, the rocket flipped 90 degrees in the wrong direction, and less than two seconds later, aerodynamic forces tore the boosters off the main stage at an altitude of 4 km. This triggered a self-destruct mechanism, and the spacecraft turned into a giant fireball of liquid hydrogen. The catastrophic launch cost approximately $370 million. The launch of Ariane 5 is widely recognized as one of the most expensive software failures in history.”

The reason for the crash? A single incorrect conversion of a 64-bit floating point number to a 16-bit integer in the rocket’s software. 

Even worse, in some cases bugs can cause the loss of human life.

Several people were irradiated with lethal doses of radiation when being treated on a Therac-25 radiation therapy machine. Even after the bugs had supposedly been fixed, problems persisted and several more people tragically died. The problem arose because the configurations for two interconnected systems (irradiation mode and dosage) were polled at different frequencies, and if you made the changes too fast, they were not registered.

It is fairly obvious that we need to check our software for bugs.

## Slide 4
- Testing: history
- 60s: Do exhaustive testing.
- Early 70s: Show that the program works correctly.
- Late 70s: Show that the program does not work correctly.
- 80s: Prevent defects throughout development.

**[讲师备注]**
In the 60s, when our programs were smaller, we started out by trying to achieve fully exhaustive testing (i.e., trying to cover all possible paths in the code and all possible input combinations), but pretty soon we found out this was impossible. In the early 70s, we had a short period when testing was understood as a “demonstration of correctness”, but we quickly came to the realization that this was not feasible. To demonstrate correctness, we need exhaustiveness – and that is impossible to achieve.

In the second half of the 70s, the goal of testing was changed to “demonstration of incorrectness”, i.e., finding bugs. For a short period of time, we had this “conflict of approaches” between wanting to prove correctness vs incorrectness. But, as “demonstration of incorrectness” is, at least, feasible (if your program fails with a bug, it has a bug), this goal became the priority in software testing.

In the 80s we started understanding that, to have good software testing, we should put additional effort into how we develop programs; in other words, we began shifting from pure defect detection to defect prevention. On this model, testing principles should be applied not only to the compiled version of the program, but to all stages of its development, including the design, implementation, architecture, and the tests themselves. That is also when we started developing tools for automated testing.


References:
https://www.udacity.com/course/software-testing--cs258

## Slide 5
- Testing: goals
- Correct behavior of the product in all conditions.
- Compliance with the requirements.
- Information about the current state of the product.
- Error prevention and detection.
- Development cost reduction.

**[讲师备注]**
Although it may come as a surprise to many, our goals when testing software are not limited to the “demonstration of incorrectness”, i.e. “finding bugs”. In other words, software testing is not simply about ensuring that the software meets functional requirements.

We can also use testing to check non-functional requirements, such as security, performance, or scalability. Or we can measure the intermediate (current) state of the project before it is released – for example, by checking the coverage of functional or non-functional requirements for the product. Additionally, if we integrate testing into our development process, it can actively help us with defect prevention. By catching errors early, we can significantly decrease development costs.

## Slide 6
- Testing: principles
- Testing demonstrates the presence of defects, but it does not prove their absence.
- The earlier the better.
- The absence of bugs is not an absolute goal.
- Many more.

**[讲师备注]**
We established that exhaustive testing is not possible, concluding that we should instead try to show the presence of bugs in the software. Empirical evidence shows that the Pareto principle applies to the distribution of bugs in your software. According to this principle, 20% of your program components are responsible for 80% of the bugs. This means that you should be zeroing in on these “buggy” components by running risk analyses and getting feedback, among other techniques

When a bug is found late in the development process (e.g., after release), the cost of fixing it is a lot higher than if we’d found the same bug earlier (e.g., during the design stage). Because of this, “The earlier you find a bug, the better” is another testing principle.

If you use the same techniques to find bugs over and over, you most probably will encounter a “pesticide paradox”, introduced by Boris Beizer in his book Software Testing Techniques. It is formulated as follows: “Every method you use to prevent or find bugs leaves a residue of more subtle bugs against which those methods are ineffectual.” To fight this effect, you need to regularly review the tests and techniques you use, gather testing feedback, and, if you see a decrease in testing effectiveness, introduce new testing methods (or tweak your existing methods).

However, “perfection” should not be your final goal in testing. Rather, the goal should be to test and refine your software up to a level where it is just good enough to be used by people. Perfect, bug-free software is an impossible goal, and trying to achieve it is a waste of time and resources.

References:
https://blog.qatestlab.com/2011/02/25/pareto-principle-in-software-testing/
https://deepsource.io/blog/exponential-cost-of-fixing-bugs/
https://www.practitest.com/blog/the-pesticide-paradox/
https://www.ranorex.com/blog/how-much-testing-is-enough/

## Slide 7
- Testing: types
- Functional – Checking the behavior given in the specifications.

**[讲师备注]**
We’ve learned that testing has various purposes – but there are also various types of testing. The basic kind is functional testing. As the name would imply, functional testing checks whether your program satisfies the functional part of the program specifications. Just like any other test, a functional test involves feeding different inputs to the program and making sure that the outputs are correct. You’re mostly checking the typical inputs that arise during day-to-day use of the program.

For example, you can test whether your web service correctly handles any available operations (sign-up, login, etc.).

References:
https://en.wikipedia.org/wiki/Software_testing#Testing_types,_techniques_and_tactics

## Slide 8
- Functional – Checking the behavior given in the specifications.
- Load – Simulating a real load (for example, a certain number of users on the server).
- Testing: types

**[讲师备注]**
Load testing focuses on checking how the program behaves under a significant load, which is (usually) more than the average expected load but still within the specification. This allows us to see how the software handles high loads and how its performance degrades. In a typical load test, you might take several of your functional tests and run them in parallel to see how the system performs when there are a lot of incoming requests. Another scenario might involve testing your program's behavior when the inputs are larger than usual.

## Slide 9
- Functional – Checking the behavior given in the specifications.
- Load – Simulating a real load.
- Stress – Checking the system’s operation under abnormal conditions (for example, a power outage or a huge number of operations per second).
- Testing: types

**[讲师备注]**
If we continue to test the system by increasing the load, at some point we’ll be putting the system under abnormal conditions, such as a number of requests per second that would be impossible under normal operations. This is where load testing becomes stress testing, the main purpose of which is to check how the system performs in the event that something unexpected happens.

## Slide 10
- Functional – Checking the behavior given in the specifications.
- Load – Simulating a real load.
- Stress – Checking the system’s operation under abnormal conditions.
- Configuration – Checking software using different system configurations.
- Testing: types

**[讲师备注]**
In many cases, the software can be run in different configurations. These configurations can be considered special kinds of “implicit” program inputs. Configuration testing focuses on running the software under different configurations. If your service can run with different database implementations or on different platforms, for example, then you may want to use configuration testing to ensure that you don’t encounter any errors in a specific configuration.

## Slide 11
- Functional – Checking the behavior given in the specifications.
- Load – Simulating a real load.
- Stress – Checking the system’s operation under abnormal conditions.
- Configuration – checking software using different system configurations.
- Regression – Making sure new changes did not break anything that had worked previously.
- Testing: types

**[讲师备注]**
Yet another important kind of testing is regression testing, which focuses on “re-testing” new versions of the software against the cases previously established as problematic. You can do any type of testing at this stage. For example, you could do some functional testing together with stress testing after one change and decide to do only configuration testing after another.

If you follow good software development practices, you usually perform automatic regression testing on every commit to your project’s code base. This is called continuous integration, and it is one of the cornerstones of dealing with software bugs

References:
https://aws.amazon.com/devops/continuous-integration/

## Slide 12
- Functional – Checking the behavior given in the specifications.
- Load – Simulating a real load.
- Stress – Checking the system’s operation under abnormal conditions.
- Configuration – Checking software using different system configurations.
- Regression – Making sure new changes did not break anything that had worked previously.
- Others, e.g. security, compliance, etc.
- Testing: types

**[讲师备注]**
There are additional kinds of testing (e.g., security testing) we can do if needed. In practice, a good software testing pipeline includes different kinds of tests and different mixes test types.

This means you do not have pure configuration testing or pure stress testing; you usually have some kind of a mix. For example, you might stress test your software in different configurations, or you could run the functional tests for the requirements while loading the system at the same time, etc.

## Slide 13
- Testing: levels
- Unit testing – Testing components separately (checking modules, classes, functions).

**[讲师备注]**
Not only are there different kinds of software testing, but it can also be performed on different levels. The basic (and in some sense the most important) level is unit testing, which is when you check the individual components of your program: functions, classes, and modules. This level focuses on testing whether the primitive building blocks of the application work correctly in isolation.

References:
https://en.wikipedia.org/wiki/Software_testing#Testing_levels

## Slide 14
- Unit testing – Testing components separately (checking modules, classes, functions).
- Integration testing – Checking the interaction of components and program modules.
- Testing: levels

**[讲师备注]**
Integration testing is when you start testing interactions between several different components. These tests check whether the different blocks of your program agree on how they should work with each other, for example, verifying that one web service you have agrees on the data formats used to communicate with another service in the system.

## Slide 15
- Unit testing – Testing components separately (checking modules, classes, functions).
- Integration testing – Checking the interaction of components and program modules.
- System testing – Checking the entire system.
- Testing: levels

**[讲师备注]**
If you test the complete system by feeding it some inputs and seeing how it works (or doesn’t work, as the case may be), that’s system testing (or end-to-end testing). You often do different kinds of end-to-end testing in house, either manually or in an automated fashion, by using the system as its users would use it in real life. 

Alpha- and beta-testing, which is when you provide an early-access version of your software to users before the release, also fall into this level of testing.

## Slide 16
- Unit testing – Testing components separately (checking modules, classes, functions).
- Integration testing – Checking the interaction of components and program modules.
- System testing – Checking the entire system.
- Acceptance testing – Verifying system compliance with all the client requirements.
- Testing: levels

**[讲师备注]**
At any level, you may additionally check whether the module, integration, or system that is being tested satisfies the end-user (client) requirements. This is also known as acceptance testing. Most often it is combined with system-level testing, but that is not a hard requirement.

## Slide 17
- Unit testing
- For each non-trivial function, their own tests are written that check that the method works correctly:
- Frequent launch expected ⇒ should run fast
- One test ⇒ one use case

**[讲师备注]**
Taking a look at what we’ve just discussed, the most basic type of testing, and the one you will use most of the time, is functional unit testing. It focuses on checking that every important function works correctly for every important input.

Considering that, in many software development approaches, unit tests are run very often (see, for example, test-driven development), your unit tests should execute relatively fast. To simplify the process of identifying what went wrong (if an error happens), a single test should check a single functional case (for example, how a function performs on one specific input).

References:
https://en.wikipedia.org/wiki/Test-driven_development

## Slide 18
- Unit testing in Kotlin
- The JUnit5 framework is the most popular way to test Java and Kotlin programs.
- dependencies {
- ...
- testImplementation(platform("org.junit:junit-bom:5.8.2"))
- testImplementation("org.junit.jupiter:junit-jupiter:5.8.2")
- }
- tasks.test {
- useJUnitPlatform()
- }
- To run tests: ./gradlew test

**[讲师备注]**
To do unit testing in Kotlin on the JVM, people usually use the JUnit testing framework. Currently, JUnit5 is the up-to-date version of this framework. To add JUnit to your Gradle project, you need to:
Add it as a dependency for your test implementations (you do not need JUnit when you run your program standalone).
Register JUnit platform as the test framework Gradle should use (use JUnitPlatform in the tasks.test configuration block).


References:
https://junit.org/junit5/docs/current/user-guide/
https://kotlinlang.org/docs/jvm-test-using-junit.html

## Slide 19
- class MyTests {
- @Test
- @DisplayName("Check if the calculator works correctly")
- fun testCalculator() {
- Assertions.assertEquals(
- 3,
- myCalculator(1, 2, "+"),
- "Assertion error message"
- )
- }
- }
- Unit testing in Kotlin

**[讲师备注]**
A simple test looks something like this.

The test is a function marked with the @Test annotation. When you run your tests, all such functions are run in some order.
In the body of the test function you can write any code needed to execute the parts of the program you want to test.
When you need to check the results (e.g., to compare the function-under-test outputs with some reference values), you use one of the available assert* helper functions.
For a better looking output, you can use the @DisplayName annotation to specify the name that will be displayed by JUnit when the test function is run.

In our example, we check whether the output of the myCalculator function is equal to 3 given the [1, 2, “+”] inputs, with the help of the assertEquals function.

## Slide 20
- class MyParametrizedTests {
- companion object {
- @JvmStatic
- fun calculatorInputs() = listOf(
- Arguments.of(1, 2, "+", 3),
- Arguments.of(0, 5, "+", 5),
- )
- }
- @ParameterizedTest
- @MethodSource("calculatorInputs")
- fun testCalculator(a: Int, b: Int, op: String, expected: Int) {
- Assertions.assertEquals(expected, myCalculator(a, b, op), "Assertion error message")
- }
- }
- Unit testing in Kotlin

**[讲师备注]**
If you want to test the same function on different sets of inputs, you have the option of writing several separate test functions, which supply interesting inputs to the function that is being tested. But that creates a lot of copy-and-pasted code, known to cause problems when you need to change the code in the future.

Alternatively, you can create a single parameterized test, which takes some inputs and checks the target function using them, together with a list of parameters to use as these inputs. To do that, create a @ParameterizedTest test and specify the source for the parameters to use as inputs when running it. Taking the method source as our example, the function used in @MethodSource must be a static function (hence, it is placed in a companion object and marked as @JvmStatic) that returns a collection of Arguments, a simple container for the parameterized test inputs.

References:
https://junit.org/junit5/docs/current/user-guide/#writing-tests-parameterized-tests
https://junit.org/junit5/docs/current/user-guide/#writing-tests-parameterized-tests-sources

## Slide 21
- There are many annotations for tests customization.
- @BeforeEach – Methods with this annotation are run before each test.
- @AfterEach – Methods with this annotation are run after each test.
- @BeforeAll – Methods with this annotation are run before all tests in the class.
- @AfterAll – Methods with this annotation are run after all tests in the class.
- Unit testing in Kotlin

**[讲师备注]**
There are a lot of options available for test customization in JUnit. If you need to do something during the test lifecycle (e.g., before or after the execution of a single test or test suite), for example, open a file before the test and close it afterwards, you can hook into the lifecycle using one of the annotations provided in JUnit. For further details on the features available in JUnit, we encourage you to check out its documentation.

References:
https://junit.org/junit5/docs/current/user-guide/#writing-tests-test-instance-lifecycle
https://junit.org/junit5/docs/current/user-guide/

## Slide 22
- Code quality
- Often, testing includes checking not only the correctness of the functionality but also the quality of the code itself.
- Static code analyzers such as detekt, ktlint, and diktat exist to help you avoid having to do this manually.
- The build of static analyzers should also be green.

**[讲师备注]**
Besides software testing, which helps us check whether our code runs correctly, we can also use different “flavors” of static analysis, which look at the code itself without running it. For example, we can measure the code quality: whether the code contains known problematic patterns, whether it is formatted properly, etc. There are a number of different tools available to help you with that.

References:
https://en.wikipedia.org/wiki/Static_program_analysis

## Slide 23
- Thanks!
- @kotlin
- |  Developed by JetBrains


--- 统计: 23 页, 22 页含讲师备注