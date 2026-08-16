# Parallel & Concurrent Programming

共 53 页

## Slide 1
- Parallel & Concurrent Programming
- Kotlin
- @kotlin
- |  Developed by JetBrains

## Slide 2
- Definition
- According to Wikipedia:
- Parallel computing is a type of computing “in which many calculations or processes are carried out simultaneously”.
- Concurrent computing is a form of computing in which several computations are executed concurrently – in overlapping time periods – instead of sequentially.
- It is possible to have parallelism without concurrency, and concurrency without parallelism.
- Motivation
- Faster runtime
- Improved responsiveness

**[讲师备注]**
The difference between parallel and concurrent computing might not be obvious, but it is nevertheless very important, because it means that you can have  
A parallel application 
A concurrent application 
A parallel and concurrent application 
The main motivation for using parallelism is the desire to improve the performance of your code, as it allows you to split the workload into chunks that can be executed simultaneously, hence reducing the time spent on the task overall. 
The main motivation for concurrency is the desire to increase responsiveness. This was used even before multi-core processors to enable proper user interfaces.

## Slide 3
- Parallelism vs concurrency

**[讲师备注]**
These pictures illustrate the difference between parallelism and concurrency. 
Cores can be physical CPU cores that can execute instructions, or they can be different machines in a distributed system, among other things.

## Slide 4
- Concurrency: processes vs threads
- Single-threaded process
- Multi-threaded process

**[讲师备注]**
Operating systems work with processes. Each process has its own (virtual) memory, executes its own code, and holds its own resources (like file descriptors) from the OS. 
For safety reasons, processes do not usually have access to the memory of other processes. 
Threads, on the other hand, work in a single process, meaning that they share virtual memory and resources, while each has its own register, stack (frame), and program counter (the code that is being performed).

## Slide 5
- Preemptive vs cooperative scheduling
- Preemptive: OS interrupts tasks
- Cooperative: task yields control

**[讲师备注]**
There are different models for scheduling, with the main difference being who or what decides to switch the execution context and when they do so. 
In a preemptive model, the OS scheduler chooses when each thread gets processor time and how much of this time it gets. The user has limited control over this, so to them it appears mostly random. 
In a cooperative model, there are specific points where the execution context can be switched. The user does not know which tasks will be chosen, but they do know where switches can happen.

## Slide 6
- Parallel and concurrent Programming
- in the JVM
- The JVM has its own scheduler
- It is independent from the OS scheduler
- A JVM thread != an OS thread
- => Multithreaded JVM apps can run on a single-threaded OS
- (DOS) JVM threads are either daemons or user threads.
- The app stops when all user threads are done.
- The JVM does not wait for daemon threads to finish.

**[讲师备注]**
This lecture covers only Kotlin/JVM, because the Kotlin/Native API is not yet stable and there is not a Parallel Programming API in Kotlin/Common at all (at the moment). 
Usually, JVM threads are mapped 1-to-1 to OS threads, but that is not a requirement for JVM implementations, so N-to-1 (DOS) or 1-to-N mapping is also possible. 
User threads are used for common tasks, while daemon threads are used for services like logging, which are not essential, meaning it is not critical if some parts of their work is lost.

## Slide 7
- Parallel programming in the JVM
- 2 Java packages
- java.lang contains basic primitives: Runnable, Thread, etc
- java.util.concurrent contains synchronization primitives and concurrent data structures
- Kotlin package
- kotlin.concurrent — Wrappers and extensions for Java classes

## Slide 8
- Throwback: Single abstract method interfaces
- @FunctionalInterface
- public interface Runnable {
- public abstract void run();
- }
- Interface with a single method. We can instantiate it with a lambda.
- class RunnableWrapper(val runnable: Runnable)
- val myWrapperObject =
- RunnableWrapper(
- object : Runnable {
- override fun run() {
- println("I run")
- }
- }
- )
- val myWrapperLambda = RunnableWrapper { println("yo") }

**[讲师备注]**
Let’s think back on single abstract method interfaces, which we covered in the previous lecture.  
They can be instantiated by providing only the implementation of that single abstract method as a lambda. 
Runnable, our next topic, is an extremely common interface that is widely used in JVM parallel programming.

## Slide 9
- You can inherit from the Thread class, which also implements Runnable.
- class MyThread : Thread() {
- override fun run() {
- println("${currentThread()} is running")
- }
- }
- fun main() {
- val myThread = MyThread()
- myThread.start()
- }
- Ways to create threads

**[讲师备注]**
Thread is a class in the JVM for representing work that can run on a separate thread. 
Thread implements the Runnable interface mentioned on the previous slide. 
You can inherit from the Thread class, implement the run method, and use it across your application.

## Slide 10
- Never call Thread.run()!
- run will execute on your thread, while start will create a new thread where run will be executed.
- fun main() {
- val myThread1 = MyThread()
- myThread1.start() // OK
- val myThread2 = MyThread()
- myThread2.run() // Current thread gets blocked
- }
- run vs start

**[讲师备注]**
Since Thread implements Runnable, you can call run, but you shouldn’t. run is just the code that should work on a separate thread, but calling it will cause that code to be executed on the thread that called it (without parallelism). Instead, threads should be launched using start, which moves the execution of run to a separate thread and does not block the thread that called start.

## Slide 11
- You can implement the Runnable interface and pass it to a thread. You can pass the same Runnable to several threads.
- fun main() {
- val myRunnable = Runnable { println("Sorry, gotta run!") }
- val thread1 = Thread(myRunnable)
- thread1.start()
- val thread2 = Thread(myRunnable)
- thread2.start()
- }
- Ways to create threads

**[讲师备注]**
An easier way is to implement the Runnable interface and pass the resulting class to a thread. 
Notice that Thread is a class, so inheriting from it will not allow you to inherit from some other class. Runnable, on the other hand, is an interface, meaning that the class you implemented can participate in any other hierarchy you want it to. 
Another nice thing here is that you can pass the same Runnable instance to several threads. You have to be careful (as always) with any resources that these runnables or /threads might share.

## Slide 12
- Kotlin has an even simpler way to create threads, but under the hood the same old thread is created and started.
- import kotlin.concurrent.thread
- fun main() {
- val kotlinThread = thread {
- println("I start instantly, but you can pass an option to start me later")
- }
- }
- This is the preferable way to create threads.
- Ways to create threads

**[讲师备注]**
thread is a higher-order Kotlin function that accepts a lambda (implementation of a run method) and creates a new thread, which is started instantly.
You can learn more about it in the documentation here. 
thread also accepts a number of arguments, which correspond to Thread properties, which we will talk about on the next slide. For example, thread(start = false, name = “Threadripper”) { ... } will create a thread that will not be started instantly and will have the name “Threadripper”.

## Slide 13
- A thread's properties cannot be changed after it is started.
- Main properties of a thread:
- id: Long — This is the thread's identifier
- name: String
- priority: Int — This can range from 1 to 10, with a larger value indicating higher priority
- daemon: Boolean
- state: Thread.state
- isAlive: Boolean
- Thread properties

**[讲师备注]**
Priority is a way to ask the scheduler to allocate more or less processor time to a given thread.

## Slide 14
- State of a thread
- state | isAlive
- NEW | false
- RUNNABLE | true
- BLOCKED | true
- WAITING | true
- TIMED_WAITING | true
- TERMINATED | false

**[讲师备注]**
State is specific, while isAlive is a flag that is easier to understand and just signals that the thread is executing something. 
When a thread has been created but has not started, it has nothing to execute and is not alive.  
Obviously, when the thread has finished all of its work or after it encounters an error, it is also not alive. 
There are different “blocked” states, because a thread can be blocked for different reasons. 
Blocked means it is waiting for some OS events, like a write to a socket. 
Waiting means it is waiting for some resource, like a lock or a condition. 
Timed waiting means the thread is sleeping or performing a blocking operation with timeout.

## Slide 15
- State of a thread
- New
- Runnable
- start
- Running
- Terminated
- terminate
- Waiting
- Blocked
- wait
- sleep
- …
- yield
- sched
- notify
- timeout
- …

**[讲师备注]**
Runnable is a state that indicates that a thread can be executed, meaning that it is up to the scheduler to decide whether it will be. The scheduler can move the thread away from the process (park it) at an arbitrary moment in time/statement in code. 
The Running box is dashed, because we can think of it as a virtual state. 
It would make no sense to have a separate Thread.state for “Running”, because by the time you got this information, there’s a good chance that the scheduler would already have moved the thread back to Runnable. 
A thread can go to the Waiting or Blocked state only from the Running state because the thread has to perform specific operations to block itself or to start waiting.

## Slide 16
- val myThread = thread { ... } — Creates a new thread
- myThread.start() — Starts a thread
- myThread.join() — Causes the current thread to wait for another thread to finish
- sleep(...) —  Puts the current thread to sleep
- yield() — Tries to step back `
- myThread.interrupt() — Tries to interrupt a thread
- myThread.isInterrupted() — Checks whether thread was interrupted
- interrupted() — Checks and clears the interruption flag
- Ways to manipulate a thread's state

**[讲师备注]**
It is important to note that sleep is a static method of the Thread class. You may be inclined to to write: 
val myThread = thread { ... }// some workmyThread.sleep(...)
This would, however, put the current thread to sleep, not myThread, because it is a static method. 
yield() and interrupted() are also static methods. 
yield() advises the scheduler to move a given thread from execution, though the scheduler is free to ignore this advice.

## Slide 17
- The sleep and yield methods are only applicable to the current thread, which means that you cannot suspend another thread.
- All blocking and waiting methods can throw InterruptedException
- sleep, join, yield, interrupt

**[讲师备注]**
The blocking and waiting methods are sleep and join, along with various methods that wait for resources, which we are going to talk about later.

## Slide 18
- class ClassicWorker : Runnable {
- override fun run() {
- try {
- while (!Thread.interrupted()) {
- // do stuff
- }
- } catch (e: InterruptedException) {} // absolutely legal empty catch block
- }
- }
- Classic worker

**[讲师备注]**
InterruptedException will be thrown if there is an operation waiting or blocking inside the loop.
The main takeaway here is that it’s our responsibility to react to possible thread interruptions. Threads do not stop working just because someone has sent an interruption signal.

## Slide 19
- Parallel threads have access to the same shared memory.
- This often leads to problems that cannot arise in a single-threaded environment.
- Parallelism and shared memory: Examples of problematic interleaving
- class Counter {
- private var c = 0
- fun increment() {
- c++
- }
- fun decrement() {
- c--
- }
- fun value(): Int {
- return c
- }
- }
- Both operations on c are single, simple statements.
- However, even simple statements can be translated into multiple steps by the virtual machine, and those steps can be interleaved.

**[讲师备注]**
Parallel execution with shared memory is a very error-prone approach. Here is a simple example of possible problems that can arise when using it. 
It looks like both operations on variable c are single, simple statements. However, even simple statements can be translated into multiple steps by the virtual machine, and then the scheduler may switch threads’ executions so that those operations interleave.  

As a result, you may encounter states that are not valid with respect to the application’s logic, like in this example, where two subsequent calls to increment result in c’s value being equal to 1 instead of the expected 2. 
Problems like this arise when there is a shared mutable state, which is a strong argument for immutability and functional programming.

## Slide 20
- Parallel threads have access to the same shared memory.
- This often leads to problems that cannot arise in a single-threaded environment.
- Parallelism and shared memory: Examples of problematic interleaving
- class Counter {
- private var c = 0
- fun increment() {
- c++
- }
- fun decrement() {
- c--
- }
- fun value(): Int {
- return c
- }
- }
- Suppose both Thread#1 and Thread#2 invoke increment at the same time. If the initial value of c is 0, their interleaved actions might follow this sequence:
- T#1: Read value 0 from c.
- T#2: Read value 0 from c.
- T#1: Increment value — result is 1.
- T#1: Write result 1 to c.
- T#2: Increment value — result is 1.
- T#2: Write result 1 to c.

**[讲师备注]**
Parallel execution with shared memory is a very error-prone approach. Here is a simple example of possible problems that can arise when using it. 
It looks like both operations on variable c are single, simple statements. However, even simple statements can be translated into multiple steps by the virtual machine, and then the scheduler may switch threads’ executions so that those operations interleave.  

As a result, you may encounter states that are not valid with respect to the application’s logic, like in this example, where two subsequent calls to increment result in c’s value being equal to 1 instead of the expected 2. 
Problems like this arise when there is a shared mutable state, which is a strong argument for immutability and functional programming.

## Slide 21
- Synchronization mechanisms
- Mutual exclusion, such as Lock and the synchronized keyword
- Concurrent data structures and synchronization primitives
- Atomics, which work directly with shared memory (DANGER ZONE)

**[讲师备注]**
Synchronization mechanisms help us fix problems that arise in a mutable shared state environment. 
We are going to cover 3 of them in order of their increasing difficulty.

## Slide 22
- Locks
- class LockedCounter {
- private var c = 0
- private val lock = ReentrantLock()
- fun increment() {
- lock.withLock { c++ }
- }
- // same for other methods
- …
- }

**[讲师备注]**
From the Oracle docs:
A lock is a tool for controlling access to a resource that is shared by multiple threads.  
Typically, a lock provides exclusive access to a shared resource; only one thread at a time can acquire the lock, and all access to the shared resource requires that the lock be acquired first. Only one thread => mutual exclusion. 
lock.withLock { block } 

is a useful higher-order Kotlin function that is almost the same as 

lock.lock()
block
lock.unlock()

Code that has acquired a lock and  has not released it is called the “critical section” – the part of the program that should be synchronized with other threads.

## Slide 23
- The lock interface
- lock.lock() — Acquires the lock
- lock.tryLock() — Tries to acquire the lock
- lock.unlock() — Releases the lock
- lock.withLock { } — Executes a lambda with the lock held (has try/catch inside)
- lock.newCondition() — Creates a condition variable associated with the lock

**[讲师备注]**
Acquiring a lock is only possible when it is not held by any other thread. If any other thread already holds the lock, then the current thread will be blocked until it can acquire the lock (or is interrupted, in which case an InterruptedException will be thrown). tryLock does not block the thread if it fails to get the lock.

## Slide 24
- class PositiveLockedCounter {
- private var c = 0
- private val lock = ReentrantLock()
- private val condition = lock.newCondition()
- fun increment() {
- lock.withLock {
- c++
- condition.signal()
- }
- }
- fun decrement() {
- lock.withLock {
- while (c == 0) {
- condition.await()
- }
- c--
- }
- }
- fun value(): Int {
- return lock.withLock { c }
- }
- }
- Conditions
- A condition allows a thread holding a lock to wait until another thread signals it about a certain event. Internally, the await method releases the associated lock upon call, and acquires it back before finally returning it again.

**[讲师备注]**
If condition C is connected to lock L, then only a thread that holds lock L can call condition.await() or condition.signal(). 
Let’s look into what happens with the decrement function: 
Suppose some thread T has calls decrement(). 
It will first try to acquire the lock, and it will be blocked until it succeeds. 
After it has acquired the lock, it will check the value of c, see that it is zero, and call condition.await(). 
This means that T will release the lock and enter the waiting state. 
At some point in time, some other thread might call increment() and there it will execute condition.signal(). 
This will wake T up, but it will not run immediately because it is in its critical section. To continue, it has to acquire the lock again.  
The thread that called signal is holding the lock (otherwise it couldn’t have called signal in the first place). It will release it, but some other thread might acquire it before T. 
At some point, T will get the lock back and will decrement C.

## Slide 25
- The ReentrantLock class
- ReentrantLock – Allows the lock to be acquired multiple times by the same thread
- lock.getHoldCount() – Gets the number of holds on this lock by the current thread
- lock.queuedThreads() – Gets a collection of the threads waiting on this lock
- lock.isFair() – Checks the fairness of the lock

**[讲师备注]**
If a thread tries to acquire a lock that it is already holding, then it will be stuck in a deadlock. It is waiting for the lock to be released without knowing that it is actually already holding it, and the lock can never be released because the thread is blocked – very sad. This problem is not present for ReentrantLock, which allows a thread to acquire it several times. 
A lock is considered fair when any thread that wants to acquire the lock will acquire it at some point. By contrast, if a lock has, for example, 3 threads that want to acquire the lock but 1 of them is ignored and never gets it, the situation is referred to as “thread starvation”.

## Slide 26
- The synchronized statement
- class Counter {
- private var c = 0
- fun increment() {
- synchronized(this) { c++ }
- }
- …
- }
- In the JVM, every object has an intrinsic lock associated with it (aka a monitor).

**[讲师备注]**
In the JVM, every object has a “hidden” lock inside of it – an intrinsic lock. 
You cannot access it directly, but you can work with it via the synchronized higher-order function (keyword in Java).. 
You can use ANY object inside synchronized(...).

## Slide 27
- Synchronized method
- Java
- public class SynchronizedCounter {
- private int c = 0;
- public synchronized void increment() {
- c++;
- }
- …
- }
- Kotlin
- class SynchronizedCounter {
- private var c = 0
- @Synchronized
- fun increment() {
- c++
- }
- …
- }

**[讲师备注]**
A synchronized method of a class is a method that is wrapped with synchronized(this).

## Slide 28
- The ReadWriteLock class
- ReadWriteLock allows multiple readers to access a resource concurrently but only lets a single writer modify it.
- rwLock.readLock() – Returns the read lock
- rwLock.writeLock() – Returns the write lock
- rwLock.read { ... } – Executes lambda under a read lock
- rwLock.write { ... } – Executes lambda under a write lock

**[讲师备注]**
ReadWriteLock is a modified lock. 
Ordinary locks allow only 1 thread to access the critical section. 
ReadWriteLock allows you to distinguish between read access and write access, with the idea being that no problems arise if several threads simply read something, while writing does require exclusive access. 
ReadWriteLock encapsulates two locks at the same time and connects them. This means a thread cannot acquire the write lock if some other thread has already acquired it or if 1 or more threads has acquired a read lock. A read lock can be acquired regardless of whether other read locks have been, though it cannot be acquired if a write lock has been.

## Slide 29
- The ReadWriteLock Class
- class PositiveLockedCounter {
- private var c = 0
- private val rwLock = ReadWriteReentrantLock()
- fun increment() {
- rwLock.write { c++ }
- }
- fun decrement() {
- rwLock.write { c-- }
- }
- fun value(): Int {
- return rwLock.read { c }
- }
- }

**[讲师备注]**
This is an example of how ReadWriteLock can be used to make a thread-safe counter.  
Getting the value `c` does not require any modifications, so it can be done in read { … } and several threads can call value() at once.

## Slide 30
- Concurrent blocking collections
- java.util.concurrent is a Java package that implements both blocking and non-blocking concurrent collections, such as:
- SynchronousQueue – One-element rendezvous channel
- ArrayBlockingQueue – Fixed-capacity queue
- LinkedBlockingQueue – Unbounded blocking queue
- PriorityBlockingQueue – Unbounded blocking priority queue

**[讲师备注]**
If locks are not enough to solve the problem of information sharing between threads, you can use concurrent (thread-safe) collections provided by java.util.concurrent. This slide includes several popular collections from that package. 
“Blocking” means that, for example, if a thread tries to extract something from an empty collection or tries to put something into a collection that has already reached its maximum capacity, it will get blocked until it can perform the desired operation successfully.

## Slide 31
- Concurrent non-blocking collections
- java.util.concurrent is a Java package that implements both blocking and non-blocking concurrent collections, such as:
- ConcurrentLinkedQueue – Non-blocking unbounded queue
- ConcurrentLinkedDequeue – Non-blocking unbounded dequeue
- ConcurrentHashMap – Concurrent unordered hash-map
- ConcurrentSkipListMap – Concurrent sorted hash-map

**[讲师备注]**
Java.util.concurrent also has some non-blocking collections. 
These collections do not block execution when threads try to extract something from an empty collection. Their use of wait-free algorithms allows them to do this. 
For example, to get an element from ConcurrentLinkedQueue, you have to call poll(), which will return null if the queue is empty, instead of waiting for someone to put something into the queue. As null signifies that the collection is empty, you are prohibited from putting null into the queue. 
ConcurrentSkipListMap is similar to TreeMap, but it is based on a skiplist instead of a tree.

## Slide 32
- Synchronization primitives
- java.util.concurrent also implements concurrent data structures and synchronization primitives.
- Exchanger – Blocking exchange
- Phaser – Barrier synchronization

**[讲师备注]**
Exchanger provides a single method exchange, like this: (x: V): V. You can learn more about it in these docs.
Phaser is a reusable synchronization barrier where you can register several threads.  

Each time a thread signals a phaser about its arrival (via arrive or arriveAndAwaitAdvance), its phase (int counter) gets incremented. 
If a thread calls arriveAndAwaitAdvance, the phaser will wait (block) for all other threads registered in it to get to this phase as well. Threads can unregister from a phaser. 
CountDownLatch is a similar “barrier” synchronization primitive that is simpler and even more common, though it is also less flexible.

## Slide 33
- There are no guarantees when it comes to ordering!
- class OrderingTest {
- var x = 0
- var y = 0
- fun test() {
- thread {
- x = 1
- y = 1
- }
- thread {
- val a = y
- val b = x
- println("$a, $b")
- }
- }
- }
- Java Memory Model: Weak behaviors
- Possible outputs:
- 0, 0
- 0, 1
- 1, 1
- 1, 0

**[讲师备注]**
Let’s look at what can happen if we do not use any synchronization mechanisms to access a mutable state from different threads. There is a mutable state consisting of two mutable variables, x and y, both of which are 0. 
Thread 1 assigns both variables a value of 1. 
Thread 2 reads y and x and prints the result to the console. 
Possible outputs: 

0, 0 – Thread 2 does not see any changes made by Thread 1. 
0, 1 – Thread 2 sees the first change (x) made by Thread 1.
1, 1 – Thread 2 sees both changes. 
1, 0 – Thread 2 sees the second change but not the first one. 

Though it looks counterintuitive, there are a couple of reasons we may get the last of these outputs.  First of all, the compiler may change the order of operations in Thread 1, which can lead to this situation, as the compiler is obliged to guarantee the same order of changes for reads from Thread 1 while Thread 2 may see changes in different order. 

Secondly, even if instructions are executed in order, you may still encounter such behavior. Changes do not get written to RAM instantly. They first go to the cache, which can be thought of as a queue of changes to RAM. When Thread 2 wants to read y and x, it may first look into values that are in that queue and then go to RAM. The problem is that only the small first portion of the queue is checked. Hence, Thread 2 might see “y = 1”, but not “x = 1”, even though both changes are in the queue and not in RAM yet. In this case, even though the operations are executed in order, only the effect of the second one will be seen by Thread 2.

## Slide 34
- There are no guarantees when it comes to progress!
- class ProgressTest {
- var flag = false
- fun test() {
- thread {
- while (!flag) {}
- println("I am free!")
- }
- thread { flag = true }
- }
- }
- Java Memory Model: Weak behaviors
- Possible outputs:
- "I am free!"
- …
- …
- …
- hang!

**[讲师备注]**
In the default settings there is no guarantee that Thread 1 will ever see the flag change. The compiler might see that Thread 1 never changes flag, so it might change while(!flag) to while(!false) and then again to while(true).

## Slide 35
- There are no guarantees when it comes to progress!
- class ProgressTest {
- var flag = false
- fun test() {
- thread {
- while (true) {}
- println("I am free!")
- }
- thread { flag = true }
- }
- }
- Java Memory Model: Weak behaviors
- Possible outputs:
- "I am free!"
- …
- …
- …
- hang!

**[讲师备注]**
This is a valid interpretation of the previous code from the point view of the compiler.

## Slide 36
- JMM: Data-Race-Freedom Guarantee
- But what does JMM guarantee?
- Well-synchronized programs have simple interleaving semantics.

**[讲师备注]**
There is a phrase by Robin Milner: “Well typed programs cannot go wrong.” It means that a program for which type inference succeeds will not throw unexpected errors. JMM guarantees a similar concept: 
“Well-synchronized programs have simple interleaving semantics.”

## Slide 37
- JMM: Data-Race-Freedom Guarantee
- But what does JMM guarantee?
- Well-synchronized programs have simple interleaving semantics.
- Well-synchronized = Data-race-free
- Simple interleaving semantics = Sequentially consistent semantics
- Data-race-free programs have sequentially consistent semantics

**[讲师备注]**
“Well-synchronized” in this case can be thought of as meaning that there are no concurrent unsynchronized attempts to access shared non-atomic variables.

## Slide 38
- Volatile fields can be used to restore sequential consistency.
- JMM: Volatile fields
- class OrderingTest {
- @Volatile var x = 0
- @Volatile var y = 0
- fun test() {
- thread {
- x = 1
- y = 1
- }
- thread {
- val a = y
- val b = x
- println("$a, $b")
- }
- }
- }
- class ProgressTest {
- @Volatile var flag = false
- fun test() {
- thread {
- while (!flag) {}
- println("I am free!")
- }
- thread { flag = true }
- }
- }

**[讲师备注]**
@Volatile forces the value of a variable to be re-read from memory each time it is processed.
Thanks to this, while(!flag) cannot be turned into while(!false), since the thread is forced to read the flag each time it accesses it to check the condition of while.

## Slide 39
- Volatile variables can be used for synchronization.
- JMM: Volatile fields
- class OrderingTest {
- var x = 0
- @Volatile var y = 0
- fun test() {
- thread {
- x = 1
- y = 1
- }
- thread {
- val a = y
- val b = x
- println("$a, $b")
- }
- }
- }
- How do we know there is enough synchronization?

**[讲师备注]**
Making y volatile will make the “1,0”  case from the weak behavior output slide above impossible.
This is because of the happens-before relation, which we will cover next.

## Slide 40
- class OrderingTest {
- var x = 0
- @Volatile var y = 0
- fun test() {
- thread {
- x = 1
- y = 1
- }
- thread {
- val a = y
- val b = x
- println("$a, $b")
- }
- }
- }
- JMM: Happens-before relation
- Wx0
- Wy0
- Wx1
- Ry1
- Wy1
- Rx1
- V
- V
- rf
- rf
- po
- po
- po
- rf
- program-order
- reads-from
- po
- po

**[讲师备注]**
This graph represents a possible execution of the code on the left. Other executions are also possible (for example, Rx0 instead of Rx1) and will be represented by a different graph.

On the right-hand side of the slide, you can see the “program events” graph, where “WxV” means “write V to X” and “RxV” means “read V from x”. The superscript V accompanying write or read means that the variable being accessed is marked as volatile.
Program order refers to the order of statements in the code, and it corresponds to a given thread’s execution. 
Reads from is a relation that happens when the read operation sees the result of some write operation.

## Slide 41
- class OrderingTest {
- var x = 0
- @Volatile var y = 0
- fun test() {
- thread {
- x = 1
- y = 1
- }
- thread {
- val a = y
- val b = x
- println("$a, $b")
- }
- }
- }
- JMM: Happens-before relation
- Wx0
- Wy0
- Wx1
- Ry1
- Wy1
- Rx1
- V
- V
- rf
- sw
- po
- po
- po
- rf
- program-order
- reads-from
- po
- po
- sw
- Synchronizes-with
- -e.g. reads-from on Volatile field

**[讲师备注]**
Synchronizes with indicates a relation that appears when two operations force threads to synchronize.

## Slide 42
- class OrderingTest {
- var x = 0
- @Volatile var y = 0
- fun test() {
- thread {
- x = 1
- y = 1
- }
- thread {
- val a = y
- val b = x
- println("$a, $b")
- }
- }
- }
- JMM: Happens-before relation
- Wx0
- Wy0
- Wx1
- Ry1
- Wy1
- Rx1
- V
- V
- hb
- sw
- po
- po
- po
- rf
- program-order
- reads-from
- po
- po
- sw
- Synchronizes-with
- -e.g. reads-from on Volatile field
- hb
- happens-before
- = (po ∪ sw)+

**[讲师备注]**
Happens before is a transitive closure of the program order and synchronizes with relations. 
It means that synchronizations across different threads and programs inside specific threads together make some executions impossible. These restrictions allow you to write data-race-free programs. 
In the execution depicted in this slide (referring back to our previous scenario), Thread 2 reads 1 from y. This means that this instruction was executed after 1 was written to y in Thread 1 (this is the only write of 1 to y), which should have happened after Thread 1 has written 1 to x. In this case, the happens-before relation can be derived for Wx1 and Rx1.

## Slide 43
- class OrderingTest {
- var x = 0
- @Volatile var y = 0
- fun test() {
- thread {
- x = 1
- y = 1
- }
- thread {
- val a = y
- val b = x
- println("$a, $b")
- }
- }
- }
- JMM: Happens-before relation
- Wx0
- Wy0
- Wx1
- Ry1
- Wy1
- Rx0
- V
- V
- hb
- sw
- po
- po
- po
- rf
- program-order
- reads-from
- po
- po
- sw
- Synchronizes-with
- -e.g. reads-from on Volatile field
- hb
- happens-before
- = (po ∪ sw)+
- rf

**[讲师备注]**
The happens before relation for Wx1 and Rx1 means that if Thread 2 reads 1 from volatile y, it synchronizes with Thread 1 and must see all of its previous work, with the result that it cannot read 0 from x, only 1.

## Slide 44
- JMM: Synchronizing actions
- Read and write for volatile fields
- Lock and unlock
- Thread run and start, as well as finish and join

**[讲师备注]**
These are some actions that provide the synchronizes with relation.

## Slide 45
- JMM: DRF-SC again
- Two events form a data race if:
- Both are memory accesses to the same field.
- Both are plain (non-atomic) accesses.
- At least one of them is a write event.
- They are not related by happens before.
- Data-race-free programs have sequentially consistent semantics
- A program is data-race-free if, for every possible execution of this program, no two events form a data race.

## Slide 46
- But what about atomic operators on shared variables?
- class Counter {
- private val c = AtomicInteger()
- fun increment() {
- c.incrementAndGet()
- }
- fun decrement() {
- c.decrementAndGet()
- }
- fun value(): Int {
- return c.get()
- }
- }
- JMM: Atomics

**[讲师备注]**
The @Volatile annotation would not fix the bug in the Counter class example  
We would still be able to read the same value in two different threads, increment them separately in each thread, and then write the new value to the field, losing one increment because reading, incrementing, and writing are still non-trivial operations that can interleave despite the happens before relation provided by @Volatile.

The counter can instead be fixed by using an AtomicInteger instead of an ordinary Integer. 
Atomics make non-trivial operations seem trivial, as they force the execution to behave as though some operation were being performed via a single CPU instruction.

## Slide 47
- JMM: Atomics
- Atomic classes from package the java.util.concurrent.atomic package:
- AtomicInteger
- AtomicLong
- AtomicBoolean
- AtomicReference
- And their array counterparts:
- AtomicIntegerArray
- AtomicLongArray
- AtomicReferenceArray

## Slide 48
- JMM: Atomics
- get() – Reads a value with volatile semantics
- set(v) – Writes a value with volatile semantics
- getAndSet(v) – Atomically exchanges a value
- compareAndSet(e, v) – Atomically compares a value of atomic variable  with the expected value,  e,  and if they are equal, replaces content of atomic variable  with the desired value, v; returns a boolean indicating success or failure.
- compareAndExchange(e, v) – Atomically compares a value with an expected value, e, and if they are equal, replaces with the desired value, v; returns a read value.
- getAndIncrement(), addAndGet(d), etc – Perform Atomic arithmetic operations for ● numeric atomics (AtomicInteger, AtomicLong).
- …

**[讲师备注]**
compareAndSet is used extensively in lock-free data structures to replace blocking locks. A very simple example of a lock-free stack would look like this: 

class Node(
var next: Node,
val data: Int
)

var head: AtomicReference<Node> = AtomicReference(Node(...)) // simple example => no idea what should be in the first node’s `next`

fun push(newValue: Int) {
	val newNode = Node(head.get(), newValue)
	do {
		newNode.next = head.get()
	} while (!head.compareAndSet(newNode.next, newNode))
}

fun pop(): Int { // this will fail if there is only one node left, the head itself, but this is a simple example
	var current = head.get()
	while(!head.compareAndSet(current, current.next)) {
		current = head.get()
	}
	return current.data
}

## Slide 49
- JMM: Atomics
- Methods of atomic classes:
- …
- getXXX()
- setXXX(v)
- weakCompareAndSetXXX(e, v)
- compareAndExchangeXXX(e, v)
- In these cases, XXX is an access mode: Acquire, Release, Opaque, Plain
- You can learn more about Java Access Modes here:
- https://gee.cs.oswego.edu/dl/html/j9mm.html

**[讲师备注]**
There are several access modes with different semantics. 
Plain is absolutely not atomic and does not guarantee anything, while volatile guarantees synchronization, and then there are several modes in between.

## Slide 50
- class Node<T>(val value: T) {
- val next = AtomicReference<Node<T>>()
- }
- JMM: Atomics Problem

**[讲师备注]**
The main problem with atomics is that they are full-fledged objects. AtomicInteger is not a 4- or 8-byte integer, but rather an object with a header and a lot of additional data that can negatively affect application performance.

## Slide 51
- Use AtomicXXXFieldUpdater classes to directly modify volatile fields:
- class Counter {
- @Volatile private var c = 0
- companion object {
- private val updater = AtomicIntegerFieldUpdater.newUpdater(Counter::class.java, "c")
- }
- fun increment() {
- updater.incrementAndGet(this)
- }
- fun decrement() {
- updater.decrementAndGet(this)
- }
- fun value(): Int {
- return updater.get(this)
- }
- }
- Starting from JDK9, there is also the VarHandle class, which serves a similar purpose.
- JMM: Atomic field updaters

**[讲师备注]**
To solve the problem of there being lots of additional unnecessary data, you can use a separate Updater class to work with the desired class field.

## Slide 52
- The AtomicFU library is a recommended way to use atomic operations in Kotlin: https://github.com/Kotlin/kotlinx-atomicfu
- Kotlin: AtomicFU
- class Counter {
- private val c = atomic(0)
- fun increment() {
- c += 1
- }
- fun decrement() {
- c -= 1
- }
- fun value(): Int {
- return c.value
- }
- }
- It provides AtomicXXX classes with API similar to Java atomics.
- Under the hood compiler plugin replaces usage of atomics to AtomicXXXFieldUpdater or VarHandle.
- It also provides convenient extension functions, e.g. c.update { it + 1 }

**[讲师备注]**
AtomicFU is a library that provides a recommended way to work with atomics.

## Slide 53
- Thanks!
- @kotlin
- |  Developed by JetBrains


--- 统计: 53 页, 48 页含讲师备注