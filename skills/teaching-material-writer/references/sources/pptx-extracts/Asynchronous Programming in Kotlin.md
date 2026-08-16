# Asynchronous Programming in Kotlin

共 125 页

## Slide 1
- Asynchronous Programming in Kotlin
- Kotlin
- @kotlin
- |  Developed by JetBrains

## Slide 2
- What we’ll cover
- Parallel and asynchronous programming
- The history of coroutines
- Kotlin coroutines
- Inside CoroutineScope
- Channels
- More

**[讲师备注]**
This lecture covers the concept of asynchronous programming.
First we’ll discuss how it differs from parallel programming and how it solves some issues with it. After that we’ll go into some history. Then most of the lecture will be dedicated to Kotlin coroutines, an implementation of asynchronous programming in Kotlin.

## Slide 3
- Parallel programming
- New
- Runnable
- start
- Running
- Terminated
- scheduler
- done
- interrupted
- Blocked
- blocking call

**[讲师备注]**
Let's look back at the states of a thread when doing parallel programming in Kotlin.

A thread can be created in the New state if it is to going be started later or it can be created in the Runnable state. The transition to Runnable happens once.

At some point, the thread might transition to the Terminated state due to an exception, due to the work being done, or due to an interruption signal if that signal is being handled in the thread. (Remember that a thread is not obliged to terminate if an interruption signal is sent. The developer is responsible for that.) The transition to Terminated also happens once.

While working, the thread switches between Runnable, Running and Blocked. As was established in the previous lectures, the transition between Runnable and Running is not controlled by a developer but rather by the JVM scheduler, so the developer has almost no control over it.
 
This leaves the last and the most important transition: the one from Running to Blocked. This is fully controlled by the developer, since it happens when a thread tries to access some synchronization primitives or just goes to sleep.

This is very important, because it means that developers working on a parallel application have to pay a lot of attention to how they manage shared resources, how they synchronize threads, and how much time threads spend not doing any useful work, instead waiting for other threads or external events.

## Slide 4
- Parallel programming
- In reality, programs (threads) spend a lot of time waiting for data to be fetched from disk, network, etc.
- The number of threads that can be launched is limited by the underlying operating system (each takes some number of MBs).
- Threads aren’t cheap, as they require context switches which are costly.
- Threads aren’t always available. Some platforms, such as JavaScript, do not even support them.
- Working with threads is hard. Bugs in threads (which are extremely difficult to debug), race conditions, and deadlocks are common problems we suffer from in multi-threaded programming.
- Threads terminating due to exceptions is a problem that deserves to be a separate point.

**[讲师备注]**
In practice, applications frequently work with the network and must do so for external events. This results in them spending a lot of time not doing anything useful.

There’s a seemingly obvious solution to the problem of having a considerable number of threads that remain blocked because they’re waiting for an I/O operation to finish: we can just increase the number of threads so that they can complete more useful work while some of them are being blocked. This does not always work, however, because there is a limit to the number of threads an application can use. This limit might come from the OS or simply from not having enough memory to store the desired amount of threads, because each thread requires MBs of memory for its stack and so on.

Furthermore, simply doubling the number of threads, for instance, will not cut execution time in half, as when there are more threads, more time is spent switching contexts to get to the processor before beginning to do anything useful.Creating two times more threads does not speed up the execution time twofold, because more threads require more context switching to get to the processor and start actually executing something useful. The more threads there are, the larger the percentage of time spent managing those threads instead of doing actual work.

Moreover, multi-threaded applications require thorough control over shared resources due to the huge number of multi-threaded specific problems, like race-conditions and deadlocks. When these problems arise, they are extremely difficult to debug and localize.

Another problem is that not everything always goes according to the plan, and exceptions are bound to happen. When an unhandled exception occurs, the thread terminates, and this situation is extremely hard to deal with from another thread.

## Slide 5
- fun postItem(item: Item) {
- val token = preparePost()
- val post = submitPost(token, item)
- processPost(post)
- }
- fun preparePost(): Token { // requestToken
- // makes a request and consequently blocks the execution thread
- return token
- }
- An example

**[讲师备注]**
Let's look at a simple example of one of the problems that is sometimes addressed by going multi-threaded.

In this example, we have the function postItem, which calls two other functions that make requests across the network.

## Slide 6
- How this code gets executed on a single thread
- An example
- Thread

**[讲师备注]**
Imagine that we have a single-threaded application and we are calling the function from the previous slide.

## Slide 7
- Thread
- What we want
- An example
- submitPost
- processPost
- processPost

**[讲师备注]**
We would like the thread to be doing something useful all the time, executing the code of the application without any pauses.

## Slide 8
- What we get
- An example
- Thread
- submitPost
- processPost
- processPost
- blocked
- blocked

**[讲师备注]**
What actually happens is this: Right when the thread makes a network request, it can’t do anything until that request is completed, so for some amount of time it is blocked and cannot proceed with code execution. It doesn’t do anything, and it won’t perform any instructions if it gets some CPU time. It will just be stuck waiting for a response, at which point it will make another request and will be waiting again.

## Slide 9
- What happens when we go multi-threaded
- An example
- Thread
- sync
- work
- T#3
- throws
- blocked
- T#2
- work
- sync
- blocked
- sync
- aware of T#1 and T#2 results
- put results into shared memory
- terminated due to exception
- put results into shared memory

**[讲师备注]**
Now we try to make the application use 3 threads instead of one and call that function twice.

The first call is moved to Thread #2, and the second call is moved to Thread #3. Now these threads are blocked instead of the main thread, which can proceed with something useful.

When the threads get their results, they probably need to share them with the main thread somehow. This means that some synchronization mechanisms have to be used, which will likely block the thread, so the main thread will still be blocked at some point to get the results of Thread #2 and Thread #3.

Now that we have more threads, we would expect to be able to do more work. Instead, we’re faced with new blocks and the overall useful work time did not increase threefold.

Additionally, if Thread #3, for example, encounters some unexpected exception, then the main thread can no longer send it any work. It would either have to restart the thread or there would have to be a dedicated orchestrator thread that manages these things, further lowering the proportion of useful work time.

## Slide 10
- Asynchronous Programming

**[讲师备注]**
Asynchronous programming is a paradigm that tries to solve most of these problems.

## Slide 11
- fun preparePostAsync(callback: (Token) -> Unit) {
- // make request and return immediately
- // arrange callback to be invoked later
- }
- With callbacks, the idea is to pass one function as a parameter to another function and have this one invoked once the process has completed.
- fun postItem(item: Item) {
- preparePostAsync { token ->
- submitPostAsync(token, item) { post ->
- processPost(post)
- }
- }
- }
- Continuation passing style

**[讲师备注]**
In the continuation passing style, a function that was returning a Token becomes a function that accepts a callback function that accepts a Token as its argument.

So, instead of waiting for the result of the function at the callsite, you pass what is to be done with the result to that function and continue with your work instead of waiting for that function to finish.

## Slide 12
- fun postItem(item: Item) {
- preparePostAsync { token ->
- submitPostAsync(token, item) {
- post -> processPostAsync(post) {
- …
- }
- }
- }
- }
- The } ladder is the Stairway to Heaven Highway to “Callback Hell”.
- Where is the error handling?
- Callbacks are not asynchronous “by nature”.
- Continuation passing style

**[讲师备注]**
The first problem, which is easy to see in this approach, is the number of braces ({). You can google “callback hell” to find real-life examples of how unreadable and unmanageable this can be.

We have mentioned exception handling being a problem in multi-threading, but we have not yet addressed it in this context. In the CPS, error-handling is also complicated and leads to more boilerplate code. It is important to note that in the CPS, not only is error handling complicated, but writing loops or simple conditional statements is also challenging.

Last, but not least, the CPS is not asynchronous by nature. When you call postItem, your execution thread will wait for it to finish before proceeding further. Changing the signature to accept callback functions is just a syntactic change. For callbacks to work asynchronously, each of them has to be launched in some executor so they will not occupy the main thread.

## Slide 13
- Promise<T> encapsulates the callback.
- fun preparePostAsync(): Promise<Token> {
- // makes request and returns a promise that is completed later
- return promise
- }
- Futures, promises, and other approaches

**[讲师备注]**
Another approach in asynchronous programming is promises.

In this case, functions do not accept callbacks, but they don’t return their original return types either. Instead, they return a wrapper around their result. A wrapper is a special class that lets you either wait for the result or pass a callback to that class so it can be called when the result appears.

## Slide 14
- Promise<T> encapsulates the callback.
- fun postItem(item: Item) {
- preparePostAsync()		.thenCompose { token -> submitPostAsync(token, item) }		.thenAccept { post -> processPost(post) }		…}
- This model differs from the typical top-down imperative approach.
- There are different APIs, which vary across libraries, frameworks, and platforms.
- It employs the Promise<T> return type instead of the actual we need.
- Each thenCompute/Accept/Handle creates a new object.
- Error handling can be complicated.
- Futures, promises, and other approaches

**[讲师备注]**
This makes the code clearer, but it is still not the approach to writing code that most developers are used to.

There are a lot of implementations of promises with various names and APIs.

Notice that the functions return wrappers instead of the actual types that we are interested in. Moreover, these wrappers are objects and take up considerable memory.

Error handling can be complicated. This is also true for loops, but they are much easier than in the CPS.

## Slide 15
- suspend — a keyword in Kotlin marking suspendable function.
- suspend fun submitPost(token: Token, item: Item): Post {
- ...
- }
- suspend fun postItem(item: Item) {
- val token = preparePost()
- val post = submitPost(token, item)
- processPost(post)
- }
- This looks and feels sequential, allowing you to focus on the logic of your code.
- marks suspension points in IntelliJ IDEA.
- Kotlin coroutines

**[讲师备注]**
There is another alternative approach to asynchronous programming, which we’ll discuss at the end of this presentation. For the moment, however, we’ll address Kotlin’s recommended approach.

Kotlin has the suspend keyword, which marks functions that at some point wait for something (get blocked), meaning they can be moved away from the execution and brought back later. Functions marked with this keyword are called suspending functions.

Code with suspending functions looks like ordinary sequential code, but under the hood everything is done asynchronously and effectively. Note that all the usual language features can be used without issue, and exceptions are handled as always. So far this code does not require anything more than any of the other code you could write. (This picture will become more complicated a bit later).

IntelliJ IDEA flags calls to suspending functions with a special marker in the gutter (the area to the left of the editor).

## Slide 16
- The history of coroutines

## Slide 17
- Melvin Conway coined the term “coroutine” in 1958 for his assembly program.
- Coroutines were first introduced as a language feature in Simula’67 with the detach and resume commands.
- A coroutine can be thought of as an instance of a suspendable computation, i.e. one that can suspend at some point and later resume execution, possibly even on another thread.
- Coroutines calling each other (and passing data back and forth) can form the machinery for cooperative multitasking.
- Go’09, C#’12, Kotlin’17, C++’20, OpenJDK, Project Loom.
- History and definition

**[讲师备注]**
Coroutines are not a new concept. They existed long before Kotlin, Java, and even C.

Simula’67 was a groundbreaking language that inspired C++, and it had coroutines as one of its core features.

Scheme (1975) is also worth mentioning this context. It had call-with-current-continuation, which was an inspiration for Kotlin coroutines.

Coroutines can make up an application that will work on a cooperative multitasking model, where threads mostly work in preemptive multitasking.
Recently coroutines have found their way into a lot of languages.

## Slide 18
- Kotlin
- Coroutines came to Kotlin in version 1.1, and they became stable in version 1.3.
- suspend – A keyword for marking suspendable functions.
- kotlin.coroutines – A tiny part of the standard library.
- kotlinx.coroutines – A library with all the necessary functionality. It is not a part of the standard library, meaning there are no additional requirements for the host platform, facilitating multiplatform development.
- A coroutine is an instance of suspendable computation. It is conceptually similar to a thread in the sense that it takes a block of code to run and has a similar life-cycle. It is created and started, but it is not bound to any particular thread. It may suspend its execution in one thread and resume in another one. Moreover, like a future or a promise, it can complete with some result (which is either a value or an exception).

**[讲师备注]**
Most of the coroutines functionality is provided in the kotlinx.coroutines library. The main benefit of this is that almost nothing has to be done for coroutines to support the Kotlin compiler, since for the most part coroutines can be expressed via language features that are already present. Moreover, anyone who wants to can write their own implementation of coroutines without using the one provided by the Kotlin team.

## Slide 19
- Kotlin coroutines

## Slide 20
- Under the hood
- The compiler turns your suspend function:
- suspend fun submitPost(token: Token, item: Item): Post {...}
- Into:
- fun submitPost(token: Token, item: Item, cont: Continuation<Post>) {...}
- Where:
- public interface Continuation<in T> {
- public val context: CoroutineContext
- public fun resumeWith(result: Result<T>)
- }
- Continuation<in T> ∼ Generic callback

**[讲师备注]**
So we’ve made our submitPost function into a suspending function by adding the suspend modifier, and for some reason it has become asynchronous. Why?

The suspend modifier tells the compiler to change that function into something else. 

The compiler adds an additional last argument of the Continuation type, which is a generic class, and the return type of the function is given as a type parameter to the Continuation generic.

That looks a lot like a callback, which it actually is. So the compiler turns our function into a function that accepts a callback in the form of a Continuation object.

Continuation can be thought of as an object that represents all the code below the suspending call.

## Slide 21
- Under the hood
- Code with suspending calls:
- // code inside postItem
- // suspend call 0
- val token = preparePost()
- // suspend call 1
- val post = submitPost(token, item)
- // suspend call 2
- processPost(post)
- Is compiled into (simplified version)→

**[讲师备注]**
We’ve looked at what happens with the function signature, now let’s take a look at what happens with the body of that function.

Inside we call three functions, and we will consider all of them to be suspending functions as well. This way the compiler knows that inside the body of our function there are 3 more suspending calls.

## Slide 22
- Under the hood
- Code with suspending calls:
- // code inside postItem
- // suspend call 0
- val token = preparePost()
- // suspend call 1
- val post = submitPost(token, item)
- // suspend call 2
- processPost(post)
- Is compiled into ( simplified version ) →
- A large switch??? A state machine!
- Each label marks a suspension point.
- // some code here, continuation is created
- when(continuation.label) {
- 0 -> { // suspend call 0
- cont.label = 1;
- preparePost(cont);
- }
- 1 -> { // suspend call 1
- val token = prevResult;
- cont.label = 2;
- submitPost(token, item, cont);
- }
- 2 -> { // suspend call 2
- val post = prevResult;
- processPost(post, cont);
- }
- }
- // more code here

**[讲师备注]**
This is a simplified representation of what is happening. We’ll go into more detail later in this lecture.

The function’s body is turned into a finite-state machine, and each suspending call corresponds to a label in that state machine.

The main work of the function is happening inside a when. It executes its usual code, but when the time comes to call some other suspending function, it changes the label to the next one (makes a state-machine transition), and then it tells the application that it can be suspended and brought back later. That happens below the when and is not represented in the slide.

Here you may note that despite something quite sophisticated happening under the hood, the additional argument (continuation/callback) appears only at compile time. Furthermore, the state machine itself is a light-weight object, since everything that it stores would be on the stack while executing the function anyway (like the results of other function calls). The only additional data is the label, which is a single integer.

## Slide 23
- State of a coroutine
- label = 0
- label = 1
- label = 2
- SUSPENDED
- processPost
- post
- submitPost
- token
- preparePost

**[讲师备注]**
This is a visual representation of our example function as a finite-state machine.

It changes its labels inside when, and then goes to a suspended state, where it is waiting for something specific or can just be paused for some time. 
When the result appears or the executor decides that it is time for this function to continue, it is brought back to the execution and continues in the next state. The cycle is repeated until the final state is reached. From the final state, the execution is passed to the continuation that was initially passed to the function as an argument.

## Slide 24
- Practice
- Now we can finally post items without blocking the execution thread!
- fun nonBlockingItemPosting(...) {
- ...
- postItem(item)
- }

**[讲师备注]**
Now that we have a suspending function, postItem, that was promised to be asynchronous, we can use it in our code to post something without blocking the execution thread.

## Slide 25
- Practice
- Now we can finally post items without blocking the execution thread!
- fun nonBlockingItemPosting(...) {
- ...
- postItem(item)
- }
- The suspending function postItem should be called only from a coroutine or another suspending function.
- One cannot just walk into a suspending function.

**[讲师备注]**
But if we try to call this function from our ordinary code, we will get an error.

Suspending functions are used to make your code non-blocking.
 
This is done by marking points where the code waits for something and can be moved away from the execution thread to be replaced by something else that can be executed right now.

In order for that to be possible, there has to be that “something else”, which comes from the environment where the suspend call is being made. That environment is the CoroutineScope interface.

## Slide 26
- Inside CoroutineScope

## Slide 27
- Practice
- suspend functions can be called from other suspend functions or within CoroutineScope.
- fun main() = runBlocking { // this: CoroutineScope
- launch { // launch a new coroutine and continue
- delay(1000L) // non-blocking delay for 1 second (default time unit is ms)
- println("World!") // print after delay
- }
- print("Hello ") // main coroutine continues while the previous one is delayed
- }
- HOFs like launch are called coroutine builders.

**[讲师备注]**
The error that we get when trying to call a suspending function tells us that such functions can be called either from other suspending functions or within a CoroutineScope.

If we try calling from another suspending function, we will encounter the same issue; how will we call that function? This means we really need to know what CoroutineScope is.

At the early stages of its development, it was called CoroutineLifecycle, which gives us a bit more of a clue about what it actually is.

Here you see code that uses runBlocking, which creates a CoroutineScope where coroutines can be finally called.

runBlocking is a bridge between the blocking (ordinary) world and coroutines. It is uncommon in production and you should avoid using it, but it is useful for examples and testing (but runTest is preferable, which has replaced runBlockingTest).

Finally, inside the CoroutineScope we can write ordinary code or launch a coroutine that will asynchronously work in the background without blocking the main execution thread. We can think about launch as “fire and forget”. The code does not wait for launch to do anything, it just gets thrown into the scope to be executed at some point, while execution continues as though nothing happened. launch accepts a suspending block as an argument, which will be the code executed in a new coroutine. Things like launch that allow you to create new coroutines are called coroutine builders.

## Slide 28
- Sophisticated practice
- val jobs: List<Job> = List(1_000_000) {
- launch(Dispatchers.Default + CoroutineName("#$it")
- + CoroutineExceptionHandler { context, error ->
- println("${context[CoroutineName]?.name}: $error")
- }, // CoroutineContext
- CoroutineStart.LAZY // do not start instantly
- ) {
- delay(Random.nextLong(1000))
- if (it % 10 == 0) { throw Exception("No comments") }
- println("Hello from coroutine $it!")
- }
- }
- jobs.forEach { it.start() }
- Now we are going to cover all of this step by step.

**[讲师备注]**
Now that we know at least one way to get a scope, we can write things like this example within it.

Here we create a list of 1 million coroutines by calling launch 1 million times. 

Each launch accepts CoroutineContext as its first argument, a start type as its second argument, and the lambda block to be executed as third argument, and each returns a Job.

The start type is represented by the CoroutineStart enum. Here, we pass CoroutineStart.LAZY, meaning that coroutines will not start instantly, but only after start() is called.

## Slide 29
- Scope and context
- public interface CoroutineScope {
- public val coroutineContext: CoroutineContext
- }
- Easy, isn’t it?

**[讲师备注]**
CoroutineScope is an interface provided by the standard library, and its implementation can be found in kotlinx.coroutines or written from scratch. This interface only has one field – CoroutineContext.

## Slide 30
- Scope and context
- public interface CoroutineScope {
- public val coroutineContext: CoroutineContext
- }
- public interface CoroutineContext {
- public operator fun <E : Element> get(key: Key<E>): E?
- …
- public interface Element : CoroutineContext {
- public val key: Key<*>
- ...
- }
- }
- You can think of context like Map<Key<Element>, Element>

**[讲师备注]**
CoroutineContext is an interface that is designed to store information about the execution environment for coroutines.

You can think of it as a map from a class to an instance (object) of that class in the environment.

Each element of the context is a context on its own. It is designed to make working with contexts easy. For example, you can create a context by simply creating an instance of CoroutineName, and then you can add CoroutineDispatcher by simply using plus, which is overridden for contexts.

Why do we even need CoroutineScope if it only has one property – CoroutineContext? Couldn’t we achieve the same result by just using CoroutineContext?

This division is used to separate the coroutine’s execution environment/state, which is the context, from its behavior/lifecycle, which is the scope. We will revisit this idea when discussing structured concurrency.

## Slide 31
- Inside CoroutineScope
- Job

**[讲师备注]**
Now let’s look at what can be found inside the scope or context, starting with Job, which we have already seen as the return type of launch.

## Slide 32
- Job
- public interface Job : CoroutineContext.Element {
- public companion object Key : CoroutineContext.Key<Job>
- public fun start(): Boolean
- public fun cancel(cause: CancellationException? = null) public val children: Sequence<Job>
- ...
- }
- A Job is work that is executed in the background.
- It is a cancellable work item with a life-cycle that culminates in its completion.
- Jobs can be arranged into parent-child hierarchies.
- A child’s failure  immediately cancels its parent along with  all its other children. This behavior can be customized using SupervisorJob.

**[讲师备注]**
Job extends CoroutineContext.Element, which itself extends CoroutineContext, meaning that Job is also a context.

Here you can see how Key is usually created. It is a companion object of the interface that implements CoroutineContext.Key, with the class itself as generic argument. As a result, all instances of this specific interface share the same key, so it is a key for the whole class/interface.

Job represents a coroutine, some background work that is executed somewhere asynchronously.
 
It has the start() method, which we’ve already seen, along with and many others – for example, cancel, which allows you to stop the execution of the coroutine represented by this Job.

Job also stores links to all its children – all the other coroutines launched from within this specific Job.

What happens upon cancellation will be covered in the coming slides.

## Slide 33
- Job States
- New
- Active
- Completing
- Completed
- Cancelling
- Cancelled
- start
- complete
- finish
- finish
- cancel/fail
- wait for children

**[讲师备注]**
Job has similar states to Thread.

The major difference is that Job has no blocked state, since coroutines suspend instead of blocking.

Also, both the Cancelled and Completed states are accompanied by their ‘-ing’ analog. These exist because the coroutine finishes only when all of its children finish.

This means that a Job (coroutine) might complete all of its work successfully, but then it has to wait for its children to do the same, and one of its children might fail at this stage. If this happens, then despite Job itself succeeding, the whole load of work that was connected to it, including all of its children, has failed, and that is signaled by Job transitioning to the Cancelling and then Cancelled states.

## Slide 34
- Job states
- state | isAlive | isCompleted | isCancelled
- New | false | false | false
- Active | true | false | false
- Completing | true | false | false
- Cancelling | false | false | true
- Cancelled | false | true | true
- Completed | false | true | false

**[讲师备注]**
There are several flags, yet again similar to those of Thread, that might be useful when working with Job’s states.

## Slide 35
- Inside CoroutineScope
- Dispatchers

**[讲师备注]**
Next we are going to cover dispatchers, which are one of the most important aspects of kotlinx.coroutines.

## Slide 36
- Dispatchers
- public abstract class CoroutineDispatcher : ... {
- ...
- public abstract fun dispatch(context: CoroutineContext, block: Runnable)
- }
- Dispatchers.Default – A shared pool of background threads, at least 2, depending on the default number of CPU cores. It is an appropriate choice for compute-intensive coroutines.
- Dispatchers.IO – A shared pool of on-demand created threads and is designed for offloading IO-intensive blocking operations (such as file/socket IO).

**[讲师备注]**
Like Job, CoroutineDispatcher extends CoroutineContext.Element and is itself also a context. It has object : Key inside it, as well.

The most important thing in the dispatcher is the dispatch method. 

When we talked about what a suspending function is compiled into, we looked at the state machine and mentioned that some things also happen outside the when block. One of those things is the function passing its continuation (state machine after transition) to the dispatcher as an executable block, which is done via this method.

So, the state machine switches labels, executes some code, and then takes a dispatcher from its CoroutineContext and passes itself there to be executed asynchronously later. The need for a dispatcher is the reason why suspending functions need to be called only within a CoroutineScope, where a context with a dispatcher is present. 

There are several dispatchers, each of which has its own purpose, so it is important to know when to use each one of them.

## Slide 37
- Dispatchers
- Dispatchers.Main – A dispatcher that is confined to the Main thread operating with UI objects. Usually single-threaded, it is not present in core, but is instead provided by packages like android, swing, etc.
- Dispatchers.Unconfined – The unconfined dispatcher should not normally be used in code.
- Private thread pools can be created with newSingleThreadContext andnewFixedThreadPoolContext. (Both are @ExperimentalCoroutinesApi.)
- A view of a dispatcher with the guarantee that no more than parallelism coroutines are executed at the same time can be created via:
- // method of public abstract class CoroutineDispatcher@ExperimentalCoroutinesApipublic open fun limitedParallelism(parallelism: Int): CoroutineDispatcher { ... }

**[讲师备注]**
Unconfined

## Slide 38
- Dispatchers
- An arbitrary ExecutorService can be converted into a dispatcher with the asCoroutineDispatcher extension function.
- interface ExecutorService : Executor {
- fun execute(command: Runnable) // Executor is a SAM with this method
- ...
- }
- val myExecutorService: ExecutorService = ...
- val myDispatcher = myExecutorService.asCoroutineDispatcher()

**[讲师备注]**
If for some reason the dispatchers included in kotlinx.coroutines are not suitable for you, you can use newSingleThreadContext or newFixedThreadPoolContext, or you can convert an executor service (like newFixedThreadPoolExecutor) into a dispatcher.

## Slide 39
- internal class GlobalQueue : LockFreeTaskQueue<Task>(singleConsumer = false)
- internal class CoroutineScheduler(
- @JvmField val corePoolSize: Int, @JvmField val maxPoolSize: Int,
- @JvmField val idleWorkerKeepAliveNs: Long = ...,
- @JvmField val schedulerName: String = ...
- ) : Executor, Closeable {
- ...
- val globalCpuQueue = GlobalQueue()
- val globalBlockingQueue = GlobalQueue()
- ...
- }
- A peek under the hood

**[讲师备注]**
Each dispatcher in kotlinx.coroutines is an implementation of CoroutineScheduler. 

They all contain queues of tasks to perform. One is global and is shared across all dispatchers. 
Upon being called, a suspending function that was compiled into a state machine switches the label, executes some code, and then takes a dispatcher from CoroutineContext and adds its continuation to the queue of that dispatcher, to be executed when time is available.

## Slide 40
- internal class CoroutineScheduler(...) : Executor, Closeable {
- ...
- val workers = AtomicReferenceArray<Worker?>(maxPoolSize + 1)
- fun dispatch(
- block: Runnable,
- taskContext: TaskContext = NonBlockingContext,
- tailDispatch: Boolean = false
- ) {
- ...
- }
- }
- A peek under the hood

**[讲师备注]**
Next, each dispatcher has a pool of workers. Default has a number of workers equal to the number of CPU cores. IO has many more, and Main should only have one.

In the “Parallel Programming” lecture, atomics were identified as a “danger zone”, and here we can see that under-the-hood atomics are used to keep track of workers. So while this is an efficient and low-level way to drive the abstraction of coroutines, we do not recommend repeating it at home.

Since this is an implementation of the executor interface, it has an implementation of dispatch, where an executable block is placed in some queue for it to be taken by a worker later.

## Slide 41
- internal inner class Worker private constructor() : Thread() {
- ...
- val localQueue: WorkQueue = WorkQueue()
- var state = WorkerState.DORMANT
- fun findTask(scanLocalQueue: Boolean): Task? {
- // localQueue -> globalBlockingQueue
- return task ?: trySteal(blockingOnly = true)
- }
- }
- A peek under the hood

**[讲师备注]**
The worker itself is an inheritor of Thread, which has its own queue of tasks.

One interesting aspect of workers is that if a worker cannot find a job to do in its own pool or in its parent dispatcher’s pool, it might try to steal work from somewhere else to stay efficient and be doing something all the time.

## Slide 42
- Inside CoroutineScope
- Coroutines vs threads

**[讲师备注]**
Since we now know that, under the hood, coroutines work on workers, which are inheritors of threads, we may wonder about the benefit of using coroutines instead of using a threadpool and throwing tasks at it.

## Slide 43
- Adding contexts
- val jobs: List<Job> = List(1_000_000) {
- launch(
- BaseContext
- + SupervisorJob()
- + CoroutineName("#$it")
- + CoroutineExceptionHandler { context, error ->
- println("${context[CoroutineName]?.name}: $error")
- }, // launch’s first argument is CoroutineContext, which is a sum here
- ...
- ) { ... }
- Contexts can be added together. In this case, the rightmost value for a Key is taken as the resulting context.
- Since each Element implements CoroutineContext, this looks like a sum of elements.

**[讲师备注]**
First, let’s take a look at how to get the sum of contexts:
Context1 = Dispatcher1 + ExceptionHandler
Context2 = Dispatcher2 + CoroutineName
Context1 + Context2 -> ExceptionHandler + Dispatcher2 + CoroutineName
Context2 + Context1 -> CoroutineName + Dispatcher1 + ExceptionHandler

For each Key, the rightmost value is taken as the new context.

## Slide 44
- suspend fun preparePost(): Token = withContext(Dispatchers.IO) { ... }
- // submitPost also withContext(Dispatchers.IO)
- suspend fun processPost(post: Post) =
- withContext(Dispatchers.Default) { ... }
- suspend fun postItem(item: Item) {
- val token = preparePost()
- val post = submitPost(token, item) processPost(post)
- }
- // somewhere in our application's code there is a View and a CoroutineScope related to it
- viewScope.launch {
- postItem(someItem)
- // show the result in the UI somehow
- }
- Context switching

**[讲师备注]**
As we have seen, there are several dispatchers, each with its own purpose.

There is also a useful function called withContext, which allows you to change some parts of the context without launching a new coroutine.
 
As we have mentioned, a context’s parts are themselves contexts and can be summed. withContext adds what’s passed as arguments to the context where it has been called.

In the example above, it is used only to change the dispatcher for each function, meaning that each function specifies exactly on which pool of workers it should be executed.

## Slide 45
- How is this actually better than threads?
- Main
- UI
- IO
- Default
- time

**[讲师备注]**
Imagine that viewScope is using Main, which is usually connected to the UI of the application.

## Slide 46
- How is this actually better than threads?
- Main
- IO
- Default
- time
- post

**[讲师备注]**
We call our function in viewScope on the Main dispatcher.

## Slide 47
- How is this actually better than threads?
- Main
- IO
- Default
- time
- post
- fetch
- withContext(Dispatchers.IO)

**[讲师备注]**
It switches its context to IO to fetch some data in a blocking/waiting way.

## Slide 48
- How is this actually better than threads?
- Main
- IO
- Default
- time
- post
- blocked
- fetch

**[讲师备注]**
The IO thread waits for the data to be fetched.

## Slide 49
- How is this actually better than threads?
- Main
- IO
- Default
- time
- post
- blocked
- fetch
- done

**[讲师备注]**
submitPost also works on IO, so we won’t write it separately.

## Slide 50
- How is this actually better than threads?
- Main
- IO
- Default
- time
- post
- blocked
- fetch
- done
- process
- withContext(Dispatchers.Defalt)

**[讲师备注]**
Then the dispatcher is switched to Default for the process function.

## Slide 51
- How is this actually better than threads?
- Main
- IO
- Default
- time
- post
- blocked
- fetch
- done
- process
- Back to the original scope/dispatcher
- show

**[讲师备注]**
Finally, the dispatcher is switched back to Main, and the result is shown in the user interface.

## Slide 52
- How is this actually better than threads?
- Main
- IO
- Default
- time
- post
- blocked
- fetch
- done
- process
- show
- Not blocked

**[讲师备注]**
What was the point of all of this? While all of this was happening, the user could have been interacting with the UI because at no point was the main execution thread waiting for something or synchronizing with anything.

## Slide 53
- How is this actually better than threads?
- Main
- IO#1
- time
- post
- IO#2
- fetch
- IO#3
- blocked
- Def#1
- Def#2
- like
- sub
- dwnld
- post
- calc
- post
- upd
- done
- fetch
- blocked
- blocked
- done
- fetch
- blocked
- done
- fetch
- blocked
- fetch
- blocked
- done
- error
- fetch
- done
- blocked
- process
- analyze
- compute
- intense compute
- harder
- error
- better
- faster
- error
- stronger

**[讲师备注]**
In reality, the picture would look more like this.
 
Main is always occupied with handling user events or interface updates.

IO threads, which are plentiful, are constantly fetching data from the network or disk.

Processing (Default) threads are doing calculations and may encounter errors, which might be shown in the UI but do not affect the overall workflow of the application.

## Slide 54
- Coroutines - fibers - threads
- fun main(): Unit = runBlocking {
- repeat(1_000_000) { // it: Int
- delay(Random.nextLong(1000))
- println("Hello from coroutine $it!")
- }
- }

**[讲师备注]**
Let’s make another comparison to threads and try launching a million coroutines at once.
They’ll just be simple coroutines that will delay for some random time and then print.

## Slide 55
- Coroutines - fibers - threads
- fun main(): Unit = runBlocking {
- repeat(1_000_000) { // it: Int
- delay(Random.nextLong(1000))
- println("Hello from coroutine $it!")
- }
- }
- WRONG!
- The default behavior is sequential, you have to ask for concurrency.

**[讲师备注]**
But this was not the right way to launch coroutines. 

The way we’ve written this, everything simply works inside the scope created by runBlocking. Nothing is moved to the background, which means no concurrency can happen in this example.

## Slide 56
- Coroutines - fibers - threads
- fun main(): Unit = runBlocking {
- repeat(1_000_000) { // it: Int
- launch { // new asynchronous activity
- delay(1000L)
- println("Hello from coroutine $it!")
- }
- }
- }
- Coroutines are like light-weight threads.

**[讲师备注]**
By moving the code into a launch call, we ask to execute this code somewhere in the background and don’t wait for it to finish before moving to the next statement, which in this case is another iteration of the loop. This way, we will actually create a million coroutines that run simultaneously in the background.

## Slide 57
- Coroutines - fibers - threads
- fun main(): Unit {
- repeat(1_000_000) { // it: Int
- thread { // new thread
- sleep(1000L)
- println("Hello from thread $it!")
- }
- }
- }

**[讲师备注]**
This example can be easily translated into threads.

We remove runBlocking, because it is not required to start threads.

We replace launch, which creates a coroutine, with thread, which creates a thread.

We replace the suspending delay with the thread’s sleep.

## Slide 58
- Coroutines - fibers - threads
- fun main(): Unit {
- repeat(1_000_000) { // it: Int
- thread { // new thread
- sleep(1000L)
- println("Hello from thread $it!")
- }
- }
- }
- Exception in thread "main" java.lang.OutOfMemoryError: unable to create native thread: possibly out of memory or process/resource limits reached.

**[讲师备注]**
When we do this, we encounter a problem: On most machines, it is impossible to create a million threads at the same time.

## Slide 59
- Coroutines - fibers - threads
- fun main(): Unit = runBlocking {
- repeat(1_000_000) { // it: Int
- launch { // new asynchronous activity
- delay(1000L)
- println("Hello from coroutine $it!")
- }
- }
- }
- Coroutines are like light-weight threads.

**[讲师备注]**
The main takeaway here is that coroutines are not threads.

They help solve similar problems, but overall they are built differently.

## Slide 60
- Inside Coroutine Scope
- Thread switching problem

**[讲师备注]**
We know that coroutines use dispatchers to get execution time on some thread out of the dispatcher’s pool.
The problem is, we do not know which thread exactly will take our suspending function or its continuation, which might lead to unexpected problems for unprepared developers.

## Slide 61
- It is not guaranteed that the coroutine is going to be resumed on the same thread, so be very careful about calling suspending function while holding any monitor.
- val lock = ReentrantLock()
- suspend fun russianRoulette() {
- lock.lock()
- pullTheTrigger()
- lock.unlock()
- }
- Unlock might happen on another thread.
- Murphy’s law: “Anything that can go wrong will go wrong.”
- Then unlock will throw IllegalMonitorStateException.
- An important non-guarantee

**[讲师备注]**
One of the restrictions for Lock is that unlock can only be called by a thread which is currently holding the lock.
If you acquire some lock and then call a suspending function, your continuation will be placed in the dispatcher’s tasks queue, and another worker, which is another thread, might take it and try to release the lock.
At this point, a nasty exception will be thrown.
One way of solving this issue is to not use synchronization in coroutines, but there is also another way.

## Slide 62
- Mutual Exclusion ==> Mutex.
- val mutex = Mutex() // .lock() suspends, .tryLock() does not suspend
- var counter = 0
- suspend fun withMutex() {
- repeat(1_000) {
- launch {
- // protect each increment with lock
- mutex.withLock { counter++ }
- }
- }
- println("Counter = $counter") // Guaranteed `1000`
- }
- Mutual Exclusion

**[讲师备注]**
Locks are used for mutual exclusion in multi-threaded applications.
In coroutines Mutex is used for mutual exclusion.
One of its drawback is that there is no ReentrantMutex (like ReentrantLock), so one should be careful to not try to acquire the same Mutex twice.

## Slide 63
- Inside CoroutineScope
- Exceptions

**[讲师备注]**
What happens when an exception occurs in a coroutine?First of all, of course, it can be handled in a try/catch block.
But if any exception is not handled via a catch, then it is an unhandled exception, which stops coroutine execution and leaves the coroutine itself.

## Slide 64
- public interface CoroutineExceptionHandler : CoroutineContext.Element {
- public companion object Key : CoroutineContext.Key<...>
- public fun handleException(context: CoroutineContext, exception: Throwable)
- }
- Children coroutines delegate handling to their parents.
- Coroutines running with SupervisorJob do not propagate exceptions to their parents.
- CancellationExceptions are ignored.
- If there is a Job in the context, then Job.cancel is invoked.
- All instances of CoroutineExceptionHandler found via ServiceLoader are invoked.
- The current thread’s Thread.uncaughtExceptionHandler is invoked.
- Exception handling

**[讲师备注]**
An ExceptionHandler can be present inside a given context, but this is not the first thing that is used to solve the problem.

As has been mentioned, coroutines store links to their children coroutines, and each child coroutine can also access its parent.
.
When an unhandled exception occurs, the coroutine stops (cancels), cancels all of its children, and then tries to pass this exception to its parent Job.

SupervisorJob will ignore the exceptions of its children and ask them to handle those on their own by using their CoroutineExceptionHandler, while an ordinary parent Job will cancel itself and of all of its children and then use its CoroutineExceptionHandler. If another unhandled exception occurs in some child where there already is one, it will be a suppressed exception inside the first one.

If there is no CoroutineExceptionHandler, then exceptions are handled like unhandled exceptions in a Thread, by looking for a handler in services.

## Slide 65
- Exception propagation
- Job
- launch
- SupervisorJob
- launch
- launch
- launch

**[讲师备注]**
Imagine that we have a root Job, and inside it a launch has been called that has also called another launch. At the same time, a SupervisorJob with two children has also been created inside the root Job.

## Slide 66
- Exception propagation
- Job
- launch
- SupervisorJob
- launch
- launch
- launch
- exception

**[讲师备注]**
Now imagine an unhandled exception occurs in one of the SupervisorJob’s children, causing that child to be cancelled.

## Slide 67
- Exception propagation
- Job
- launch
- SupervisorJob
- launch
- launch
- launch
- exception
- Check this out

**[讲师备注]**
The child will try to delegate handling to its parent.

## Slide 68
- Exception propagation
- Job
- launch
- SupervisorJob
- launch
- launch
- launch
- exception
- No, thank you

**[讲师备注]**
Since the parent is a SupervisorJob, it will not do anything in response. And since there is no dedicated CoroutineExceptionHandler, the exception will most likely be handled via  Thread.uncaughtExceptionHandler, which will log it to stderr.

## Slide 69
- Exception propagation
- Job
- launch
- SupervisorJob
- launch
- launch
- launch
- handler

**[讲师备注]**
Now let’s imagine that first child of the root Job has a handler.

## Slide 70
- Exception propagation
- Job
- launch
- SupervisorJob
- launch
- launch
- launch
- handler
- exception

**[讲师备注]**
And an exception occurs in another launch.

## Slide 71
- Exception propagation
- Job
- launch
- SupervisorJob
- launch
- launch
- launch
- handler
- exception
- Check this out

**[讲师备注]**
That coroutine is cancelled, and it passes the exception to its parent.

## Slide 72
- Exception propagation
- Job
- launch
- SupervisorJob
- launch
- launch
- launch
- handler
- exception
- Check this out

**[讲师备注]**
Even though the parent has a handler, it will not be used, and the exception will be passed to the root Job.

## Slide 73
- Exception propagation
- Job
- launch
- SupervisorJob
- launch
- launch
- launch
- handler
- Cancel

**[讲师备注]**
Upon encountering an exception from its child, the root Job will cancel all of its children.

## Slide 74
- Exception propagation
- Job
- launch
- SupervisorJob
- launch
- launch
- launch
- handler
- Cancel

## Slide 75
- Exception propagation
- Job
- launch
- SupervisorJob
- launch
- launch
- launch
- handler

## Slide 76
- Exception Propagation
- Job
- launch
- SupervisorJob
- launch
- launch
- launch
- handler

**[讲师备注]**
In the end, everything will get cancelled.
 
If the root Job was not a root Job but was actually a child of something else, then after cancelling all of its children it would pass the exception further to its parent, and so on.

## Slide 77
- Now you see it
- val jobs: List<Job> = List(1_000_000) {
- launch(Dispatchers.Default + CoroutineName("#$it")
- + CoroutineExceptionHandler { context, error ->
- println("${context[CoroutineName]?.name}: $error")
- },
- CoroutineStart.LAZY
- ) {
- delay(Random.nextLong(1000))
- if (it % 10 == 0) { throw Exception("No comments") }
- println("Hello from coroutine $it!")
- }
- }
- jobs.forEach { it.start() }
- This exception handler is useless if this code is not inside a SupervisorJob.

**[讲师备注]**
Now that we know how exceptions are handled inside coroutines, we can say that in our example ExceptionHandler might be useless if this list of Jobs is not created within a SupervisorJob, because in this case it will never be used.

## Slide 78
- fun main() = runBlocking { // root coroutine
- val job1 = launch {
- delay(500)
- throw Exception("Some jobs just want to watch the world burn")
- }
- val job2 = launch {
- println("Going to do something extremely useful")
- delay(10000)
- println("I've done something extremely useful")
- }
- }
- Exception in job1 -> propagate to parent -> job2 gets cancelled
- Error handling

**[讲师备注]**
Imagine we have two Jobs inside our scope, and one of them is extremely important.

It gets launched and starts its important work, but then something less important fails and the important Job gets cancelled, which is a bummer.

## Slide 79
- fun main() {
- val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())
- with(scope) {
- val job1 = launch {
- throw Exception("Some jobs just want to watch the world burn")
- }
- val job2 = launch {
- delay(3000)
- println("I've done something extremely useful")
- }
- }
- scope.coroutineContext[Job]?.let { job ->
- runBlocking { job.children.forEach { it.join() } }
- } // `job1.join()` will throw, so `it.join()` should actually be in a `try/catch` block
- }
- Error handling

**[讲师备注]**
Instead, for a case like this, we should use SupervisorJob to guarantee that errors in other coroutines can’t cancel our important work.

This is also an example of how you can start coroutines without runBlocking or a suspending function.

The last lines are extremely important because they prevent your application from stopping until the root Job, and subsequently all of its children, have finished.

## Slide 80
- fun main() {
- // `someScope: CoroutineScope` already exists
- someScope.launch { // this coroutine is a child of someScope
- supervisorScope { // SupervisorJob inside
- val job1 = launch {
- throw Exception("Some jobs just want to watch the world burn")
- }
- val job2 = launch {
- println("Going to do something extremely useful")
- delay(3000)
- println("I've done something extremely useful")
- }
- }
- }
- ...
- }
- Error handling

**[讲师备注]**
There is a handy supervisorScope function, which replaces the Job in the scope with SupervisorJob. 
This can be extremely useful if you are already working in a specific scope.

## Slide 81
- fun main() {
- val scopeWithHandler = CoroutineScope(CoroutineExceptionHandler {
- context, error -> println("root handler called")
- })
- scopeWithHandler.launch {
- supervisorScope {
- launch { throw Exception() }
- launch(CoroutineExceptionHandler { context, error ->
- println("personal handler called")
- }) { throw Exception() }
- }
- }
- ...
- }
- Exceptions are not propagated to parents meaning you can override the handler.
- Error handling

**[讲师备注]**
Finally, we know that contexts are inherited and that only parts of them are replaced when withContext or something similar is used.

If we place an ExceptionHandler in the root Scope (in its Context), it will be used by all the children, which are created under SupervisorJob.

## Slide 82
- Inside CoroutineScope
- Structured concurrency

**[讲师备注]**
Coroutines forming a parent-children hierarchy, exceptions being propagated and never lost, and all the work being grouped into scopes – together these features make up the structured concurrency approach, which is much easier to work with than ordinary multi-threaded programming.

## Slide 83
- fun processReferences(refs: List<Reference>) {
- for (ref in refs) {
- val location = ref.resolveLocation()
- GlobalScope.launch {
- val content = downloadContent(location)
- processContent(content)
- }
- }
- }
- Downloads are launched in the background.
- GlobalScope – This is a delicate API and its use requires care. Make sure you fully read and understand the documentation of any declaration that is marked as a delicate API. The delicate part is that no Job is attached to the GlobalScope, making its use dangerous and inconvenient.
- Any downloadContent or processContent crash results in a coroutines leak.
- Error handling (revisited)

**[讲师备注]**
Imagine that you have to process a list of references, each of which requires a blocking network fetch, and you need all of them either to succeed together or fail together.

You could try writing something like this to process a list of references.

Here we see GlobalScope for the first time. It was introduced early in the development of kotlinx.coroutines to make performing some tasks easier, but now it can be considered deprecated because it mostly abandons the idea of structured concurrency. Anything launched in this scope behaves like an ordinary thread; it lives on its own and errors inside it are lost.

The problem is that if any one of the downloads fails, the others continue on without knowing about it, and this work might be end up being useless and a waste of time. We could address this by creating a shared synchronization flag, which is a multi-threaded way of doing things, but it is not the right way to go with coroutines.

## Slide 84
- suspend fun processReferences(refs: List<Reference>) {
- coroutineScope { // new scope with outer context, but a new Job
- for (ref in refs) {
- val location = ref.resolveLocation()
- launch { // child of the coroutineScope above
- val content = downloadContent(location)
- processContent(content)
- }
- }
- }
- }
- In the event of a downloadContent or processContent crash, the exception goes to the coroutineScope, which stores links to all child coroutines and will cancel them. This is an example of structured concurrency, a concept that is not present in threads.
- Structured concurrency

**[讲师备注]**
Instead, we can change our function to be a suspending function and create a scope inside it with the help of the coroutineScope higher-order function.

This way, we will create a separate Job inside the function that will accumulate launched coroutines and cancel all the other downloads if one fails.

## Slide 85
- A helpful convention
- This function takes a long time and waits for something:
- suspend fun work(...) { ... }
- This function launches more background work and quickly returns:
- fun CoroutineScope.backgroundWork(...) {
- launch { ... }
- }
- or:
- fun CoroutineScope.moreWork(...): Job = launch { ... }
- Not:
- suspend fun CoroutineScope.dontDoThisPlease()

**[讲师备注]**
A suspending function is a piece of work that requires time to finish and can be suspended at some point. A chain of suspending functions can be thought of as typical synchronous code that is interleaved with some other work.

At the same time, some work can be moved to the background via launch or another coroutine builder, which can be called within CoroutineScope or from a suspending function.

We have a convention to help you avoid mixing these two up:
Work that suspends should be placed inside a suspending function. This way the user knows that execution will continue after the called suspending function is done, and that it might involve suspending and letting something else work on the execution thread.
Work that happens in the background should be placed in a CoroutineScope extension function, informing the user that this work is done in the same scope but that it happens somewhere else and execution jumps to the code right after launch.

This is also a very important difference between CoroutineContext and CoroutineScope. Despite the latter being a simple interface with a single property of the CoroutineContext type, it is designed to be responsible for the structure of coroutines, like in this convention, while CoroutineContext is just a data storage.

## Slide 86
- fun CoroutineScope.processReferences(refs: List<Reference>) {
- for (ref in refs) {
- val location = ref.resolveLocation()
- launch { // child of coroutineScope
- val content = downloadContent(location)
- processContent(content)
- }
- }
- }
- A helpful convention

**[讲师备注]**
Using this convention, we can rewrite our function like this.

Now, if the user writes:

// refs exist
val msg = "A message"
processReferences(refs)
println(msg)

They should expect that their code will print the message almost instantly, even if downloading content takes a lot of time. This is because, for their execution thread, a message is created, then some work is launched in the background, which happens quickly, and then the message is printed without waiting for that background work to finish.

## Slide 87
- Inside CoroutineScope
- Coroutine cancellation

## Slide 88
- val job = launch(Dispatchers.Default) {
- repeat(5) {
- println("job: I'm sleeping $it...")
- Thread.sleep(500) // simulate blocking work
- }
- }
- yield() // lets the childJob work
- println("main: I'm tired of waiting!")
- job.cancel() // cancels the `job`
- job.join() // waits for `job`'s completion
- println("main: Now I can quit.")
- The coroutine (job) does not know that somebody is trying to cancel it.
- Cancellation is cooperative.
- Cancelling coroutines

**[讲师备注]**
Imagine we have a coroutine that does some blocking work in a loop.

At some point we might want to cancel it, either to stop the application or because we simply no longer need it to work.

Since we have a reference to the Job, we will try calling its cancel method.

The problem is that, in this example, the code inside the coroutine is not aware that it can be cancelled, just like how code in a thread may be unaware that somebody is trying to interrupt that thread.

So, in this example the last message will be printed after roughly 2500ms, since the Job will have to finish first.

## Slide 89
- val job = launch(Dispatchers.Default) {
- repeat(5) {
- try {
- println("job: I'm sleeping $it...")
- delay(500)
- } catch (e: CancellationException) {
- println("job: I won't give up $it")
- }
- }
- }
- yield()
- println("main: I'm tired of waiting!")
- job.cancelAndJoin() // cancel + join
- println("main: Now I can quit.")
- Cancelling coroutines

**[讲师备注]**
In another case, if there are any other suspending calls inside the coroutine, then we know that they are compiled into a state machine.
After the state machine transition, the compiled code checks whether the coroutine has been cancelled. If so, then CancellationException will be thrown at some suspension point, like how InterruptedException is thrown in threads.

Yet again, in this code we catch that exception and continue with our work, which is not good design – though it may sometimes be useful.

## Slide 90
- val job = launch(Dispatchers.Default) {
- var i = 0
- while (isActive && i < 5) { // check Job status
- println("job: I'm sleeping ${i++}...")
- Thread.sleep(500)
- }
- }
- delay(1300L)
- println("main: I'm tired of waiting!")
- job.cancelAndJoin()
- println("main: Now I can quit.")
- Cancelling coroutines

**[讲师备注]**
We have seen that there are Job states, and a coroutine can access the states of its own Job.

So, instead of relying on specific suspension points to lead to CancellationException, you can use the isActive flag to check whether a coroutine has been asked to cancel.

This will work even if the code inside the coroutine doesn’t have any suspension points.

## Slide 91
- val job = launch {
- try {
- repeat(1_000) {
- println("job: I'm sleeping $it...")
- delay(500L)
- }
- } finally {
- withContext(NonCancellable) {
- println("job: I'm running finally")
- delay(1000L)
- println("job: Delayed for 1 sec thanks to NonCancellable")
- }
- }
- }
- ...
- job.cancelAndJoin()
- Cancelling coroutines

**[讲师备注]**
In some cases, you may actually need it to be impossible to cancel some work. For extremely rare cases like these, there is a special CoroutineContext.Element named NonCancellable, which forbids cancelling this coroutine. It is sometimes used in finally blocks to release resources, for example.

## Slide 92
- Channels

**[讲师备注]**
Coroutines also make it possible to implement asynchronous channels.

## Slide 93
- Channel is like BlockingQueue, but with suspending calls instead of blocking ones.
- Blocking put → suspending send
- Blocking take → suspending receive
- No shared mutable state!
- Channels are still experimental
- public interface Channel<E> : SendChannel<in E>, ReceiveChannel<out E> {
- ... suspend fun send(element: E)
- ... suspend fun recieve(): E
- ...
- }
- There are also trySend and alike that do not wait.
- Communicating sequential processes

**[讲师备注]**
Communicating sequential processes is yet another aspect of asynchronous programming. This is where the work of different concurrent processes is orchestrated through channels that allow the sending and receiving of messages.

A channel can be thought of as a queue of messages that are sent and received in various places without a shared mutable state.

Some features of channels are still experimental, but they are stable for the most part and will stay in kotlinx.coroutines.
The base interfaces are SendChannel and ReceiveChannel, and their functionality is merged in the Channel interface.

## Slide 94
- fun main() = runBlocking {
- val channel = Channel<Int>()
- launch {
- for (x in 1..5)
- channel.send(x * x)
- }
- repeat(5) {
- println(channel.receive())
- }
- println("Done!")
- }
- Practice

**[讲师备注]**
In this example, a channel for integers is created.

Then a coroutine is launched that sends integers to this channel.

The main execution thread receives and prints these integers.

In the end, all of them will be printed – without the use of synchronization mechanisms.

## Slide 95
- fun CoroutineScope.numbersFrom(start: Int) = produce<Int> {
- var x = start
- while (true) send(x++) // infinite stream of integers from start
- }
- fun CoroutineScope.filter(numbers: ReceiveChannel<Int>, prime: Int) =
- produce<Int> { for (x in numbers) if (x % prime != 0) send(x) }
- fun main() = runBlocking {
- var cur = numbersFrom(2)
- repeat(10) {
- println(cur.receive())
- cur = filter(cur, prime)
- }
- coroutineContext.cancelChildren()
- }
- Prime Numbers

**[讲师备注]**
This is a more sophisticated example, where two ReceiveChannels are created by the produce coroutine builder.

The first ReceiveChannel generates an infinite sequence of integers, while the second one receives the integers from the first and filters out any that are divisible by a given integer.

Then in the main function, integers are received from the second channel. Each time this happens, however, a new channel is created via the second function using the previous channel and the last received integer.

In the end, this is a short implementation of the sieve of Eratosthenes using channels.

## Slide 96
- fun <T> CoroutineScope.production(ch: SendChannel<T>, msg: T) =
- launch { while (true) { delay(Random.nextLong(23)); ch.send(msg) } }
- fun <T> CoroutineScope.processing(ch: ReceiveChannel<T>, name: String) =
- launch { for (msg in ch) { println("$name: received $msg") } }
- fun main() = runBlocking {
- val channel = Channel<String>()
- listOf("foo", "bar", "baz").forEach { production(channel, it) }
- repeat(8) { processing(channel, "worker #$it") }
- delay(700)
- coroutineContext.cancelChildren(CancellationException("Enough!"))
- }
- Fan-in and fan-out

**[讲师备注]**
In this example, a single communication channel is created first.

Then, there are three producers, each of which sends its message to the channel after a random time interval.

Then there are eight workers that receive these messages and print them to the console.

Yet again, no synchronization mechanisms are used in this example. There are 3 writers and 8 readers, yet there aren’t any data races.

In the end, to stop the application, all the children of the current context are cancelled, including the producers and readers.

## Slide 97
- Details
- Channels are still experimental.
- Channels are fair, meaning that send and receive calls are served in a first-in first-out order.
- By default, channels have RENDEZVOUS capacity: no buffer at all. This behavior can be tweaked:  The user can specify buffer capacity, what to do when buffer overflows, and what to do with undelivered items.

**[讲师备注]**
Channels are like queues, and as such, they follow a FIFO order.

Also like queues, they have capacity inside them for a buffer, and the default is RENDEZVOUS, which means that the capacity is exactly 1. This can, however, be changed to an arbitrary buffer size.

## Slide 98
- suspend fun selector(
- channel1: ReceiveChannel<String>,
- channel2: ReceiveChannel<String>
- ): String = select<String> {
- // onReceive clause in select fails when the channel is closed
- channel1.onReceive { it: String -> "b -> '$it'" }
- channel2.onReceiveCatching { it: ChannelResult<String> ->
- val value = it.getOrNull()
- if (value != null) {
- "a -> '$value'"
- } else {
- "Channel 'a' is closed" // Select does not stop!
- }
- }
- }
- Select (experimental!)

**[讲师备注]**
Channels also support an interesting and experimental select expression, which you can read more about in the documentation.

## Slide 99
- Miscellaneous

## Slide 100
- Miscellaneous
- Beyond asynchronous programming

**[讲师备注]**
So far, we’ve just been talking about how coroutines enable you to do asynchronous programming, but they are useful for more than just that.

## Slide 101
- val fibonacci = sequence { // A coroutine builder!
- var cur = 1
- var next = 1
- while (true) {
- yield(cur) // A suspending call!
- cur += next
- next = cur - next
- }
- }
- val iter = fibonacci.iterator() // nothing happens yet
- println(iter.next()) // process up to the first yield -> 1
- println(iter.next()) // wake up and continue -> 1
- println(iter.next()) // 2 and then to infinity and beyond
- Sequences

**[讲师备注]**
Coroutines are also the foundation for sequences.

A sequence is a small scope with a Job inside, which allows you to calculate values only when you need them.

In a sense, after each value is calculated and retrieved, the sequence is suspended until it is called again.

## Slide 102
- Miscellaneous
- Under the hood: advanced

## Slide 103
- Remember this code?
- suspend fun postItem(item: Item) {
- val token = preparePost()
- val post = submitPost(token, item)
- processPost(post)
- }
- Now that we know much more, let’s get a better approximation of what’s going on under the hood.
- Under the hood

## Slide 104
- fun postItem(item: Item, completion: Continuation<Any?>) {
- class PostItemStateMachine(
- completion: Continuation<Any?>?,
- context: CoroutineContext?
- ): ContinuationImpl(completion) {
- var result: Result<Any?> = Result(null)
- var label: Int = 0
- var token: Token? = null
- var post: Post? = null
- ...
- }
- }
- Under the hood

**[讲师备注]**
The suspending function gets compiled into a function with the addition of an argument of the Continuation<T> type.

Inside that function, a class for the state machine of this function is declared.

This class stores what is usually on the stack of the function, like intermediary values.

Moreover, this class has a label and a special field for the last result that was calculated in this function. It is required both to store correct results and to track if an exception has occurred at some point.

## Slide 105
- fun postItem(item: Item, completion: Continuation<Any?>) {
- class PostItemStateMachine(...): ... {
- ...
- override fun invokeSuspend(result: Result<Any?>) {
- this.result = result
- postItem(item, this)
- }
- }
- val continuation = completion as? PostItemStateMachine ?: PostItemStateMachine(completion)
- ...
- }
- Under the hood

**[讲师备注]**
The first time that this function is called, it is passed all the code below it as its continuation.
 
That code below is not the state machine of the function, so on the first run it gets wrapped into a new instance of that state machine, and the original continuation is passed to the state machine for it to call it after it has done all of the work inside itself and got the result that is required for the original continuation.

Once this instance is created, after each label switch, the function (state machine) calls itself with this new instance and passes the cast, preventing a new state machine from being created on the subsequent suspensions and resumptions.

## Slide 106
- ...
- when(continuation.label) {
- 0 -> { ... }
- 1 -> {
- continuation.token = continuation.result.getOrThrow() as Token
- continuation.label = 2
- submitPost(continuation.token!!, continuation.item!!, continuation)
- }
- 2 -> { ... }
- 3 -> {
- continuation.finalResult = continuation.result.getOrThrow() as FinalResult
- continuation.completion.resume(continuation.finalResult!!)
- }
- else -> throw IllegalStateException(...)
- }
- ...
- Under the hood

**[讲师备注]**
Then it gets to the when part, where it checks its current label, executes code corresponding to the current label, and transitions to the new state.

In the last label, it calls the original continuation that has been passed to the function.

Below this when, after the transition, the state machine is given to the dispatcher that is present in the context to be called when a worker is available. There it also checks that the coroutine was not cancelled by something from the outside.

## Slide 107
- More
- Continuation as generic callback

**[讲师备注]**
Continuation, which we have now encountered several times, is a generic callback, and this is the key to understanding the machinery behind coroutines.

## Slide 108
- Here’s a refresher on what Continuation looks like:
- public interface Continuation<in T> {
- public val context: CoroutineContext
- public fun resumeWith(result: Result<T>)
- }
- We are given:
- suspend fun suspendAnswer() = 42
- suspend fun suspendSqr(x: Int) = x * x
- How can we run suspendSqr(suspendAnswer) without kotlinx.coroutines?
- Continuation

**[讲师备注]**
We know that a suspending function is compiled into something that expects a continuation to be passed.

kotlinx.coroutines provides us with several ways how to create scopes and call suspending functions within them.

But what if we want to call a suspending function without using kotlinx.coroutines?
Then we need to pass an implementation of Continuation to the compiled function.

## Slide 109
- Continuation is a generic callback, so we can go back to the continuation passing style:
- fun main() {
- ::suspendAnswer.startCoroutine(object : Continuation<Int> {
- override val context: CoroutineContext
- get() = CoroutineName("Empty Context Simulation")
- override fun resumeWith(result: Result<Int>) {
- val prevResult = result.getOrThrow()
- ::suspendSqr.startCoroutine(
- prevResult,
- Continuation(CoroutineName("Only name Context")) {
- it: Result<Int> -> println(it.getOrNull())
- }
- )
- } // Oh no!
- }) // Closing brackets are coming!
- } // Please help! I am being dragged into Callback Hell!!!
- Continuation

**[讲师备注]**
Each suspending function has a startCoroutine method in its namespace, and this can be used to invoke it without any scope and from outside a suspending function.

This example illustrates two ways of calling a suspending function without kotlinx.coroutines.

In the first invocation, an inplace implementation of Continuation is provided to the function.

In the second invocation, a Continuation(...) standard library function is used to instantiate an anonymous implementation of the interface.

A third (and obvious) way would be to write a full-fledged class for Continuation and use it when needed, which is exactly what is done in kotlinx.coroutines.

## Slide 110
- Miscellaneous
- To wrap existing async code or to implement your own?

**[讲师备注]**
Not all code is naturally suspending, and you might want to wrap some of your blocking calls into coroutines to use it in your asynchronous application properly.

## Slide 111
- suspend fun AsynchronousFileChannel.aRead(b: ByteBuffer, p: Int = 0) =
- // Scheme: call-with-current-continuation; call/cc
- suspendCoroutine { cont ->
- // CompletionHandler ~ Continuation
- read(b, p.toLong(), Unit, object : CompletionHandler<Int, Unit> {
- override fun completed(bytesRead: Int, attachment: Unit) {
- cont.resume(bytesRead)
- }
- override fun failed(exception: Throwable, attachment: Unit) {
- cont.resumeWithException(exception)
- }
- })
- }
- To wrap existing async code or to implement your own?

**[讲师备注]**
The standard library provides a special higher-order function that allows you to make the switch from blocking or already existing asynchronous code from a different library to Kotlin coroutines. All you need to do is write a way to call your function and pass its result to the continuation that appears in a coroutine.

## Slide 112
- fun main() = runBlocking {
- val readJob = launch(Dispatchers.IO) {
- val fileName = ...
- val channel = AsynchronousFileChannel.open(Paths.get(fileName))
- val buf = ByteBuffer.allocate(...)
- channel.use { // syntactic sugar for `try { ... } finally { channel.close() }`
- while (isActive) {
- ... = it.aRead(buf)
- ...
- }
- }
- }
- ...
- }
- To wrap existing async code or to implement your own?

**[讲师备注]**
Here’s how this code is now used in coroutines.

## Slide 113
- suspend fun cancellable(…) =
- suspendCancellableCoroutine { cancellableCont ->
- cancellableCont.invokeOnCancellation { throwable: Throwable? ->
- // release resources, etc.
- ...
- }
- ...
- cancellableCont.cancel(…)
- }
- To wrap existing async code or to implement your own?

**[讲师备注]**
There is also suspendCancellableCoroutine for cases where you want to be able to cancel the suspended work.

## Slide 114
- Miscellaneous
- async / await

## Slide 115
- async Task PostItem(Item item) {
- Task<Token> tokenTask = PreparePost();
- Post post = await SubmitPost(tokenTask.await(), item);
- ProcessPost();
- }
- async and await are keywords in C#.
- Awaiting does not block heavy OS thread.
- await is an explicit suspension point.
- await  is a single function, but depending on its environment it can result in 2 different behaviours.
- The C# approach was a great inspiration for the Kotlin team when they were designing coroutines, as it was for Dart, TS, JS, Python, Rust, C++...
- async / await in Kotlin

**[讲师备注]**
The last approach to asynchronous programming that we haven’t covered – but certainly not the least important, as it was the strongest inspiration for Kotlin coroutines – is async / await, which was introduced in C#.

It adds a special modifier that marks functions which can be suspended during execution.

Like with promises, the return type changes to Task<T> instead of simply T.

## Slide 116
- fun CoroutineScope.preparePostAsync(): Deferred<Token> = async<Token> { ... }
- suspend fun postItem(item: Item) {
- coroutineScope {
- val token = preparePost().await()
- val post = submitPost(token, item).await()
- processPost(post)
- }
- }
- Deferred<T> : Job is a Job that we can get some result from. async is just another coroutine builder. You can write exactly the same in Kotlin!
- But why would you do that? This is not idiomatic Kotlin.
- async / await in Kotlin

**[讲师备注]**
In Kotlin, async is just another coroutine builder.
 
The only difference is that it provides another implementation of Job – Deferred<T>, which has an await method.

With the ordinary Job, you know that it is doing something in the background and you can wait for it to finish by calling join.

With Deferred<T>, you also know the result type, T, and can ask for the result or even suspend until that result appears by calling await.

## Slide 117
- suspend fun postItemAsyncAwait(item: Item) {
- coroutineScope {
- val deferredToken = async { preparePost() }
- // some work
- val token = deferredToken.await()
- val deferredPost = async { submitPost(token, item) }
- // more work
- val post = deferredPost.await()
- processPost(post)
- }
- }
- async / await in Kotlin

**[讲师备注]**
This is an example of code that uses async / await.

## Slide 118
- Miscellaneous
- Coroutine builders

**[讲师备注]**
async is just another coroutine builder, but there are still more.

## Slide 119
- public fun CoroutineScope.launch(
- context: CoroutineContext,
- start: CoroutineStart,
- block: suspend CoroutineScope.() -> Unit // suspend lambda
- ): Job
- public fun <T> future(...): CompletableFuture<T> // jdk8/experimental
- public fun <T> CoroutineScope.async(...): Deferred<T>
- public fun <T> runBlocking(...): T // Avoid using it
- public fun <E> CoroutineScope.produce(
- context: CoroutineContext,
- capacity: Int,
- @BuilderInference block: suspend ProducerScope<E>.() -> Unit
- ): ReceiveChannel<E>
- And many more! Like actor.
- A zoo of them!

**[讲师备注]**
launch is the most common one, and we have seen it many times already.

future is a coroutine builder designed to make the move from Java easier.

runBlocking is a coroutine builder in the sense that it creates a root (parent) coroutine that waits for all the code inside of it to finish before stopping.

produce creates a coroutine that works with a Channel.

## Slide 120
- Actor ∼ coroutine + channel
- // Message types for counterActor – Command pattern
- sealed class CounterMsg
- // one-way message to increment
- object IncCounter : CounterMsg() counter
- // a request with a reply
- class GetCounter(val response: CompletableDeferred<Int>) : CounterMsg()
- Actor

**[讲师备注]**
actor is an interesting coroutine builder that can be used to work in the actor model.
An actor represents an entity that is doing some work in the background and can receive and send messages to communicate with other actors.

Usually messages are represented via command pattern classes.

## Slide 121
- // This function launches a new counter actor
- fun CoroutineScope.counterActor() = actor<CounterMsg> {
- var counter = 0 // actor state
- for (msg in channel) { // iterate over incoming messages
- when (msg) {
- is IncCounter -> counter++
- is GetCounter -> msg.response.complete(counter)
- }
- }
- }
- Frequently encapsulated into a separate class.
- Actor

**[讲师备注]**
Here you can see an actor that is ready to receive messages in its channel and process them.

actor is a coroutine builder that allows you to play with the Actor model idea, but usually actors are written as separate classes that encapsulate a Channel and a Job.

## Slide 122
- Miscellaneous
- Android

## Slide 123
- Check out developer.android.com to learn how coroutines are used (extensively) in modern Android development.
- class MyViewModel: ViewModel() {
- init {
- viewModelScope.launch { ... }
- }
- }
- A ViewModelScope is defined for each ViewModel in your app.
- A LifecycleScope is defined for each Lifecycle object.
- Flow, which is not covered in this lecture, is common in Android.
- Android

**[讲师备注]**
Coroutines are used heavily in Android development.

Almost every view of every application has a related CoroutineScope, where the background can be launched.

This is extremely useful because it allows the app to stop all unnecessary work as soon as the user leaves a view and its related scope is cancelled or destroyed.

## Slide 124
- github.com/Kotlin/KEEP/ – Kotlin design proposals, including coroutines
- kotlinlang.org – “Coroutines overview” and “Official libraries/kotlinx.coroutines”
- github.com/Kotlin/kotlinx.coroutines – A nicely documented resource
- Roman Elizarov’s talks on YouTube and posts on medium
- Flow<T> – Asynchronous Flow
- Kotlin sources at github.com/JetBrains/kotlin/
- All of the code from this presentation can be found in the corountines folder at github.com/bochkarevko/kotlin-things/
- Further Reading

## Slide 125
- Thanks!
- @kotlin
- |  Developed by JetBrains


--- 统计: 125 页, 111 页含讲师备注