# Build Systems

共 37 页

## Slide 1
- Build Systems
- Kotlin
- @kotlin
- |  Developed by JetBrains

**[讲师备注]**
Today we are going to talk about build systems: a principled way to transform your source code into something your computer can execute.

## Slide 2
- What? Why?
- Build system – Software that automates the process of getting some kind of an artifact (executable, library) from the source code. Build systems can be used for:
- Configuring your build once and using it forever (copy-paste into new projects)
- Unifying builds and reusing logic in various projects
- Dependencies management*
- Testing and verification
- Incremental builds*

**[讲师备注]**
You may be used to running your code by pressing a “magical” hotkey in your IDE. But that does not scale or generalize well enough to be used in real-world projects. That’s why we need build systems to help us with the activities presented on the slide.

* Not all build systems support dependencies management and incremental builds – for example, Maven.

## Slide 3
- How?

**[讲师备注]**
A build system is responsible for transforming your program from its original form (a collection of sources, icons, images, sounds, etc.) through a number of intermediate steps (which depend on what languages, frameworks, and operating systems are used in your program) to the final executable and/or distributable form that you can share with other people and that they can use “out of the box”.

## Slide 4
- Maven
- Declarative: You define the configuration without specifying how to achieve it.
- Convention: You describe what you need with specific rules.
- Lifecycle: It can support everything from compilation to tests and so on.
- Plugins allow you to do the unconventional heavy-lifting.
- Coordinates are located in pom.xml: groupId, artifactId, version.
- Repositories: You can load (and cache) the dependencies on demand.
- Learn more: search.maven.org (Maven Central)
- pom.xml
- Project Object Model
- xml

**[讲师备注]**
If we are talking about the JVM world, the most widely used build system used to be Maven. Unlike many other build systems, Maven is declarative: You describe what you want to build, but not how you want to build it. For custom handling during builds, you need to use custom plugins, which you either find and reuse or have to create from scratch yourself.

Maven heavily relies on conventions: To simplify the build process, you should give your project a predefined layout and use standard tools for compilation, testing, etc. If you need to customize any aspects of your build, you can do so, but it might require a lot of additional configuration and/or custom plugins.

Maven also introduces a simple way to share and use JVM dependencies. Every dependency has its “coordinates” (a structured tuple of strings that describe the dependency group name, artifact name, and version), which are universally understood by Maven and Maven-compatible tools. A dependency’s coordinates are enough for it to be found and downloaded during the build process.

References:
https://maven.apache.org/what-is-maven.html

## Slide 5
- pom.xml
- <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
- xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
- <modelVersion>4.0.0</modelVersion>
- <groupId>com.mycompany.app</groupId>
- <artifactId>my-app</artifactId>
- <version>1.0-SNAPSHOT</version>
- <properties>
- <maven.compiler.source>1.7</maven.compiler.source>
- <maven.compiler.target>1.7</maven.compiler.target>
- </properties>
- <dependencies>
- <dependency>
- <groupId>junit</groupId>
- <artifactId>junit</artifactId>
- <version>4.12</version>
- <scope>test</scope>
- </dependency>
- </dependencies>
- </project>

**[讲师备注]**
The main reason why Maven is not used as widely anymore is the same reason why it was the number one build system (in the JVM world) for a  time. While being declarative and convention based does simplify standard use-cases, as soon as you have a need for something specific (for example, incremental build support or non-trivial custom build logic), you have to bloat your configuration and maybe develop a lot of custom Maven plugins or you won’t be able to do it at all. And over time, the community accumulated enough problems to ask for an alternative build system.

The fact that Maven configuration is done in XML does not help with its popularity in this day and age.

## Slide 6
- Gradle
- DSL: It uses Kotlin or Groovy instead of XML.
- Tasks: You can define actions which might depend on each other and be quite complex.
- Plugins provide unconventional predefined tasks to do the heavy-lifting.
- Modules have independent compilation units. Each unit is built into a separate JAR (or some other kind of artifact).
- Repositories: You can reuse Maven repositories.
- Dependency Management: You can easily declare and resolve dependencies.
- Language Agnostic: Gradle can be used for Kotlin, Java, Scala, C++, JS, and COBOL.
- Learn more: docs.gradle.org
- build.gradle
- settings.gradle
- gradle

**[讲师备注]**
This is where Gradle comes into play. It attempts to combine the best of both declarative and imperative ways of describing your builds by using DSL-rich general-purpose programming languages for configuration (Groovy and Kotlin). This allows you to have a simple declarative description for regular builds, which can be defined by convention, while also being able to customize more complex scenarios without the need to write a standalone plugin. If you need a plugin, however, you can also write one and customize your build that way.

For dependency management it uses the same coordinate-based approach as Maven, which makes it easily backwards-compatible with existing Maven-style dependency repositories.

Additionally, the extensibility of Gradle means you’re not limited to building JVM projects with it. It is flexible enough to be used (if needed) for building projects in non-JVM languages such as C++ or JavaScript.

References:
https://docs.gradle.org/current/userguide/what_is_gradle.html

## Slide 7
- New Gradle Project in IntelliJ IDEA

**[讲师备注]**
If you create a new project in IntelliJ Idea using the New Project wizard, Gradle will be chosen by default as the build tool. In the New Project wizard, you can also specify which JDK Gradle should use.

## Slide 8
- Java bytecode
- plugins {
- kotlin("jvm") version "1.8.0"
- application
- }
- group = "org.constructor.jetbrains.kotlin"
- version = "1.0-SNAPSHOT"
- repositories {
- mavenCentral()
- }
- dependencies {
- testImplementation(kotlin("test"))
- }
- tasks.test {
- useJUnitPlatform()
- }
- kotlin {
- jvmToolchain(8)
- }
- application {
- mainClass.set("MainKt")
- }
- Failed to calculate the value
- of task ':compileJava' property
- 'javaCompiler'. Unable to download
- toolchain matching these requirements:
- languageVersion=8, vendor=any,
- implementation=vendor-specific
- Unable to download toolchain. This
- might indicate that the combination
- (version, architecture, release/early
- access, …) for the requested
- JDK is not available. Could not read
- 'https:^/api.adoptopenjdk.net/v3/binary/latest/8/ga/mac/aarch64/jdk/h'
- as it does not exist.

**[讲师备注]**
You have to be careful when choosing the JDK, however. For example, in IntelliJ IDEA 2023.1, the default build script would be likely to fail, as quite frequently happens with Gradle. This is because we selected JDK 17 in the New Project wizard, while the generated script targets JDK 8.

## Slide 9
- Java bytecode
- I use JetBrains Runtime 17.0.5, so my JDK version is 17, and to fix the problem I do:
- kotlin {
- jvmToolchain(17)
- }
- But usually instead of jvmToolchain you will see:
- tasks.withType<KotlinCompile> {
- kotlinOptions.jvmTarget = "1.8"
- }

**[讲师备注]**
To fix this problem, we can adjust the version of jvmToolchain in  the Gradle build script, or I can completely change how the Kotlin target is configured by replacing the kotlin block with a configuration specifically for the KotlinCompile task, which is the more common approach. 
jvmToolchain is a relatively new Gradle feature. It is not covered in this lecture, but it is worth checking out in your free time. Link

## Slide 10
- Build script
- Gradle tries hard to look like a declarative build configuration while using a procedural language (Groovy or Kotlin).
- The first thing we see in build.gradle.kts is the plugins { ^^. } block, which is a method of:
- class org.gradle.kotlin.dsl.KotlinBuildScript
- :> abstract class ProjectDelegate
- :> interface Project : Comparable, ExtensionAware, PluginAware

**[讲师备注]**
As we have already mentioned, Gradle uses Kotlin or Groovy for configuration. 
Usually, build tools use declarative languages for configuration, which makes the task easier. 
In the case of Gradle, our script acts as an extension of an existing configuration (as dictated by the “Convention over Configuration” model). We are working in KotlinBuildScript, which itself is an implementation of a Project. So, when working in a build.gradle.kts file, you can think of  yourself as providing details to your Project class. Note: if you have several  build.gradle.kts files (subprojects), then each one has its own Project instance, that also inherits configuration from parents.

## Slide 11
- Project
- The Project interface is the main API you use to interact with Gradle from your build file. From a Project, you have programmatic access to all of Gradle’s features. There is a one-to-one relationship between Projects and build.gradle files.
- Lifecycle:
- Assemble a Project object for each project.
- Create an org.gradle.api.initialization.Settings instance for the build.
- Evaluate the settings.gradle script, if present, using the Settings object.
- Use the Settings object to create the hierarchy of Project instances.
- Evaluate each Project by executing its build.gradle file.

**[讲师备注]**
The project interface is the configuration entry point provided by Gradle to developers. 
When describing a project as multi-module, people usually mean that the main (top-level) project, described in a top-level build.gradle file, includes other projects, each of them with a separate build.gradle.  
When Gradle is configuring your project, it creates a new instance of the Project class together with a Settings instance. Then it looks for settings.gradle, of which there should be only one for a Gradle project, and uses it to set up the settings. After it has the main Project instance and Settings, it evaluates build.gradle files starting with the top-level one.

## Slide 12
- Project: Settings
- If we take the following steps:
- Project -> New -> Module
- A new folder (which is a new module) appears. It has its own build.gradle.kts, but no settings.gradle.kts, while a new line is added to the settings file in the root:
- rootProject.name = "gradle-tutorial" include("module")
- Sidenote: For a single-project build, a settings file is optional.

**[讲师备注]**
If you create a new module in IntelliJ IDEA, you will get a new folder with new build.gradle and no settings, but the top level settings.gradle file will change: Now it will include the new module, telling Gradle that apart from running the top-level configuration script, it has to find another script in the specified folder.

## Slide 13
- Project: Settings
- Initialization
- Configuration
- Execution
- A small addition to settings.gradle.kts:
- rootProject.name = "gradle-tutorial"
- include("module")
- println("Initialization phase.")
- Initialization phase.
- > Task :prepareKotlinBuildScriptModel UP-TO-DATE
- BUILD SUCCESSFUL in 3s

**[讲师备注]**
If you add anything to the settings, Gradle will have to reconfigure the project.  
This does not necessarily lead to everything being reconfigured, but you have to remember that the settings are the first things Gradle evaluates, so it is sensitive to any changes in them. First, Gradle initializes the project and its settings, then it configures the project and subprojects, then you can move to the execution of specific tasks.

## Slide 14
- Project: Tasks
- A project is essentially a collection of Task objects. Each task performs some basic piece of work, such as compiling classes, running unit tests, or zipping up JAR files.
- There are:
- Default tasks;
- Tasks from plugins;
- Custom tasks, defined by the user right in the build configuration.
- Tasks can depend on each other. Gradle builds an acyclic directed graph of tasks.

**[讲师备注]**
After we have our Gradle project configured, we want to do things like build artifacts, run tests, etc. 
Build is a Gradle task. When your project is configured, all interactions are performed via tasks, which are defined in your project. You can think of your Gradle project as a collection of tasks. 
There are default Gradle tasks. There are tasks provided by plugins included in the Gradle configuration. And there are custom tasks, written right in the project configuration itself. 
Tasks can depend on each other. For example, building and testing are two separate tasks, but usually build depends on test, meaning that when you run build, test is executed beforehand. Tasks might take inputs (like a name to give the final executable) and provide outputs (the executable itself).

## Slide 15
- Tasks
- assemble
- kotlinCompile
- javaCompile
- compile
- jar
- test
- build
- ./gradlew build

**[讲师备注]**
Since tasks can and do depend on each other, when you call a task, you are not simply asking Gradle to perform that singular piece of work. 
In reality, Gradle has a graph that represents all tasks, and the “path of tasks” that calling any one of them will result in. For example, to build a Kotlin application, Gradle will perform a number of tasks, including compiling and testing.

## Slide 16
- Tasks
- assemble
- kotlinCompile
- javaCompile
- compile
- jar
- test
- build
- ./gradlew build -x test
- Build without running tests.

**[讲师备注]**
In some cases, you may want Gradle to skip some tasks, which you can make happen by providing additional arguments to Gradle. In this example we skip the test task while running build.

## Slide 17
- Project: Tasks
- The configuration language is the Kotlin (or Groovy) DSL, so anything is possible.
- You can add behavior to already existing tasks.
- fun Task.printName() = println("Hi! My name is ${this.name}")
- val task3 = tasks.register("thirdTask") {
- doFirst { printName() }
- }
- tasks.filter { task -> task.group?.let { it != "useless" } ?: false }
- .forEach {
- it.dependsOn(task3)
- }
- tasks.test {
- useJUnitPlatform()
- }

**[讲师备注]**
Since Gradle uses Turing-complete language for configuration, you can write literally anything in the configuration script. Please do not abuse this power. 
You can also take already existing tasks and re-configure them, for example by adding or removing dependencies. 
You can get a list of all available tasks by running ./gradlew tasks. That’s what you see in the Gradle tool window in IntelliJ IDEA.

## Slide 18
- Project: Tasks
- Tasks have inputs and outputs. Gradle caches the results of tasks. If on a new run inputs hash has not changed, Gradle uses the previous result there: UP-TO-DATE. If hash changed, but it is present in cache, then: FROM-CACHE. Otherwise, it still tries to reuse previous results.

**[讲师备注]**
Gradle takes its ability to do incremental builds a step further and tries to do everything incrementally. If your source files have not changed at all, and you just run build again providing a different name for the executable, then Gradle will not run test, since tests are up-to-date and nothing new should happen with them.

## Slide 19
- Project: Tasks
- tasks.register("targetTask") {
- group = "useless"
- dependsOn(tasks.named("dependencyTask"))
- println("${this.name}, configuration")
- doFirst {
- println("${this.name}, first in execution")
- }
- }
- tasks.register("dependencyTask") {
- println("${this.name}, configuration")
- doFirst {
- println("${this.name}, first in execution")
- }
- doLast {
- println("${this.name}, last in execution")
- }
- }
- ./gradlew :targetTask
- Executing 'targetTask'...
- > Configure project :
- targetTask, configuration
- dependencyTask, configuration
- > Task :dependencyTask
- dependencyTask, first in execution
- dependencyTask, last in execution
- > Task :targetTask
- targetTask, first in execution

**[讲师备注]**
Now let’s look at how to define your own tasks in Gradle. 
You can access the tasks property of the project in your configuration script.  
There, you can register a new task and give it a name.  
Register is a generic function that allows you to specify the class which your task extends, in which case you will get the base functionality of the extended class task right from the start. (We don’t do that in this example.) In the body (which is a lambda), you configure your task. This code runs when the Gradle project is configured. It is not the code of the task itself. 
The code of the task itself goes into either the doFirst or the doLast block. There are two different options because if you are extending an already defined task, then it already has something to do, and you need to decide whether your code should run before what’s already defined or after. 
You might encounter an approach to task creation that uses create instead of register. That is an outdated Gradle API. The difference is that create will configure the task eagerly, while register will do it the first time the task is called. This saves a lot of time for large projects that have a lot of modules and a lot of tasks that take time to configure, while each individual developer only needs a small subset of the existing tasks and does not need all of them to be configured right from the start

## Slide 20
- Plugins
- Most of Gradle’s useful features are added with plugins in the plugins block of a configuration script.
- Plugins add new tasks (e.g. JavaCompile), domain objects (e.g. SourceSet), and conventions (e.g. locating Java source at src/main/java), and they can also extend core objects and objects from other plugins.
- There are binary plugins and script plugins. Binary plugins are usually an external plugin jar. Script plugins are typically used within a build.

**[讲师备注]**
The first block you see in most Gradle scripts is the plugins block. 
Plugins are extensions of the Gradle configuration that provide predefined tasks and more. 
Barebones Gradle does not know how to build Java or Kotlin projects, but by adding the Kotlin plugin, we provide tasks that know how to assemble Kotlin applications or libraries.

## Slide 21
- Plugins
- Gradle provides the core plugins (e.g. application, java) as part of its distribution.
- Applying a community plugin:
- plugins {
- application // core plugin
- kotlin("jvm") version "1.8.0" // id("org.jetbrains.kotlin.jvm") version "1.8.0"
- id("io.gitlab.arturbosch.detekt") version "1.21.0" apply false // later apply it in a subproject
- }
- There are also plugins that are built from buildSrc and then applied by id as though they were community plugins.
- Custom plugin repositories can be added via the pluginManagement { … } block in settings.gradle.kts.

**[讲师备注]**
When you just specify a plugin, it is instantly applied to the project and all subprojects. 
Sometimes, you may need a  plugin for some subprojects but not all of them. In that case, it is useful to include the plugin in a top-level script, specify the version there, and then in the relevant subprojects call the plugin by name to apply it there. When calling the plugin in the subprojects, you won’t need to specify the version, since Gradle will already know which one you’re using. 
Gradle plugins are stored in special repositories, and you can specify additional repositories in a special configuration block in your settings.gradle file. 
If the plugin is not stored anywhere but instead only exists as source code, then there is a special buildSrc folder for it. Gradle first runs buildSrc to know what is available there before configuring the project, but using buildSrc is dangerous, since it breaks some of Gradle caching mechanisms.

## Slide 22
- Plugins
- // our build.gradle.kts
- plugins {
- kotlin("jvm") version "1.8.0"
- application
- }
- kotlin { // provided by kotlin("jvm") community plugin
- jvmToolchain(8)
- }
- application { // provided by application core plugin
- mainClass.set("MainKt")
- }
- With this snippet, we’ve applied two plugins to our project.

**[讲师备注]**
In this example we apply two plugins: kotlin and application. Each of them provides a Gradle dsl extension that lets us configure their behavior. They also provide tasks for building Kotlin and executables.

## Slide 23
- Plugins
- // our build.gradle.kts
- plugins {
- kotlin("jvm") apply false
- kotlin("plugin.serialization") apply false
- }
- allProjects {
- apply {
- plugin("kotlin")
- }
- }
- Here we’ve applied only the Kotlin plugin to all modules in the project eagerly.

**[讲师备注]**
In this example we do not add plugins to the top level project, but rather to all subprojects.  
When we say they are applied eagerly, we mean that instead of waiting to configure these plugins until one of the tasks from the subprojects needs something from them, we configure them as soon as our project is configured. This is how the allProjects block works. In Gradle, eagerness and laziness are complicated concepts with a lot of caveats, and it would not be possible to sufficiently cover them in a single lecture.

## Slide 24
- Plugins
- // our build.gradle.kts
- plugins {
- kotlin("jvm") apply false
- kotlin("plugin.serialization") apply false
- }
- …
- val ignored = listOf("common")
- configure(subprojects.filter { it.name !in ignored }) {
- apply {
- plugin("kotlinx-serialization")
- }
- }
- We applied the kotlinx-serialization plugin to all modules except common.

**[讲师备注]**
At this point, we should point out that we are using the words “module” and “subproject”. IntelliJ IDEA treats Gradle subprojects as modules of your top-level project. Gradle considers each build.gradle file as representing a separate project, even though they are arranged in a hierarchical structure and might use tasks from the projects above them. This is more of a terminology issue than one of technical significance.

## Slide 25
- Dependency management
- Gradle will look for declared dependencies in repositories, which are local directories or remote repositories. This process is called dependency resolution.
- Once the dependencies are resolved, the resolution mechanism stores the underlying files of a dependency in a local cache (the local Maven repository).
- Gradle handles dependency resolution in the event that there are conflicting transitive dependencies. This behavior can also be customized.

**[讲师备注]**
One of the main features of Gradle is dependency management. 
For Gradle to manage dependencies, it has to know where to find them if they are not present on the current machine. 
If Gradle finds a dependency in a remote location, it stores the dependency locally for future uses. 
Gradle also handles situations where there are transitive dependencies with different versions, meaning that two parts of your application require the same artifact but different versions of it.

## Slide 26
- Dependency management: Repositories
- repositories {
- mavenCentral()
- maven {
- url = uri("https://your.company.com/maven")
- credentials {
- username = USER_NAME
- password = PASSWORD
- }
- }
- flatDir {
- dirs("libraries")
- }
- }

**[讲师备注]**
To tell Gradle where to look for dependencies, you need to specify the repositories. 
An obvious one is mavenCentral, which is the main remote storage for JVM packages. 
In your company you may have a private Maven repository with private packages, which may require authorization. Gradle provides a way to configure that too. 
Sometimes you may want to use some local jars that you have. In such cases, you can declare that you have a directory that stores some artifacts, and Gradle will scan it to identify what is available there.

## Slide 27
- Dependency management: Dependencies
- val ktor_version: String by project
- dependencies {
- // the string notation, e.g. group:name:version implementation("io.ktor:ktor-server-core-jvm:$ktor_version")
- // map notation + api (internals are accessible)
- api("io.ktor", "ktor-server-netty-jvm", ktor_version)
- // dependency on another project
- implementation(project(":neighborProject"))
- // putting all jars from 'libs' onto compile classpath
- implementation(fileTree("libs"))
- // test dependency
- testImplementation(kotlin("test")) }

**[讲师备注]**
After you have defined your repositories, you can declare your dependencies, of which there are several different kinds:
API dependencies are transitively available to consumers of your code both at runtime and at compile time. 
Implementation dependencies are available to you at compile time (in source code), but they are not available to consumers of your code. 
testImplementation is like implementation, but it is only available to you for tests. 
runtimeOnly will include the dependency only at runtime, and compileOnly will include it only at compile time. 
And there are others.

## Slide 28
- Dependency management: Dependencies
- // settings.gradle.kts
- val utilitiesRepo = "https:^/github.com/JetBrains-Research/plugin-utilities.git"
- val utilitiesProjectName = "org.jetbrains.research.pluginUtilities"
- sourceControl {
- gitRepository(URI.create(utilitiesRepo)) {
- producesModule("$utilitiesProjectName:plugin-utilities-core")
- }
- }
- // build.gradle.kts
- val utilitiesProjectName = "org.jetbrains.research.pluginUtilities"
- dependencies {
- implementation("$utilitiesProjectName:plugin-utilities-core") {
- version {
- branch = main
- }
- }
- }
- Here we have one implementation dependency from the main branch of a GitHub repository.

**[讲师备注]**
There are other ways to locate and include dependencies. 
For example, you can build dependencies from sources and specify which branch to use when referring to a dependency from Git.
We are not going to cover more sophisticated options in detail, because they are used in a very specific cases, and are not widely used in general.

## Slide 29
- Gradle properties
- Properties are used to configure the behavior of Gradle itself and specific projects.
- From highest to lowest precedence:
- Command-line flags, such as --build-cache
- Properties stored in a local gradle.properties file.
- Properties stored in the ~/.gradle/gradle.properties file.
- Gradle properties, such as org.gradle.caching=true, which are typically stored in a gradle.properties file in a project root directory or GRADLE_USER_HOME environment variable.
- Environment variables
- For all available properties, see ./gradlew properties

**[讲师备注]**
Your Gradle build is configured using Gradle properties. There are multiple sources of possible values for your configuration, which are presented on the slide.

References:
https://docs.gradle.org/current/userguide/build_environment.html#sec:gradle_configuration_properties

## Slide 30
- Gradle properties
- // gradle.properties
- kotlin.code.style=official
- username=student
- // build.gradle.kts
- val username: String by project
- val kotlinCodeStyle = project.property("kotlin.code.style") as String
- tasks.register("printProps") {
- doLast {
- println(username)
- println(kotlinCodeStyle)
- println(System.getProperty("idea.version"))
- }
- }

**[讲师备注]**
Properties are key-value pairs, with the key being the property name and the value being the property value. If you need to use the property value in your build configuration, you can get it from the configuration via the property name (e.g., via project.property or using by project delegation).

## Slide 31
- Gradle properties
- projectDir/module/build.gradle.kts
- tasks.register("printProperty") {
- val prop: String? by project
- doLast {
- println(prop ?: "Not set")
- }
- }
- ./gradlew :module:printProperty -> Not set
- If we add prop="Prop set" to projectDir/module/gradle.properties, then:
- ./gradlew :module:printProperty -> Prop set
- ./gradlew -Pprop="Override prop":module:printProperty -> Override prop

**[讲师备注]**
Here is an example of how properties get resolved.

## Slide 32
- The Wrapper
- The recommended way to execute any Gradle build is with the help of the Gradle Wrapper.
- The Wrapper is a script that invokes a declared version of Gradle, downloading it beforehand if necessary.
- You can build projects, run them, and more with the Wrapper locally without needing to have the global Gradle on your machine.
- One way to upgrade the Gradle version is manually change the distributionUrl property in the Wrapper’s gradle-wrapper.properties file.
- – Gradle Documentation

**[讲师备注]**
To be as system agnostic as possible, each Gradle project includes the Gradle Wrapper.  
This means that as long as your system has the JVM, when you try to run Gradle, it will look for a suitable Gradle version in your system. If one is present, Gradle will use it, but if one is not present, Gradle will download the required distribution and then use that for the run. This leads to a rather strange approach to upgrading the Gradle version in your project: You have to change the version in a string that specifies the URL Gradle will try to download the needed distribution from.

## Slide 33
- Version catalog
- You can configure all plugins, dependencies, and versions in one of two places:
- inside settings.gradle.kts via dependencyResolutionManagement { versionCatalogs { … } }
- In a special TOML file, conventionally named libs.versions.toml and stored in the Gradle folder.
- The TOML file has a special structure:
- [versions]
- kotlin = "1.7.10"
- [libraries]
- junit-jupiter-api = {
- module = "org.junit.jupiter:junit-jupiter-api", version.ref = "junit-jupiter"
- }
- [plugins]
- kotlin-jvm = { id = "org.jetbrains.kotlin.jvm", version.ref = "kotlin" }

**[讲师备注]**
One of the problems in dependency management is managing versions. Sometimes it is hard to update them manually in the dependencies block. Specifying them in settings.Gradle may lead to unnecessary caching problems, and properties are also not suited for this, making it hard to know how to manage versions clearly and concisely. 
A version catalog is a way to solve this problem by having a single TOML file with all dependency versions that are of significance for the project.

## Slide 34
- Version catalog
- // build.gradle.kts
- plugins {
- val kotlinVersion = libs.versions.kotlin.get()
- id(libs.plugins.kotlin.jvm.get().pluginId) version kotlinVersion
- apply false
- }
- allProjects {
- dependencies {
- testImplementation(rootProject.libs.junit.jupiter.api)
- }
- }
- Here we’ve included one plugin and one dependency in the TOML file.

**[讲师备注]**
When you have a dedicated version catalog, you can just use it as a single source of truth in your build.gradle file.

## Slide 35
- Summary
- Gradle is a build automation tool, which uses Kotlin DSL as the configuration language;
- Gradle is a  JVM application, so it does not require any additional installation, and Gradle projects usually come with  a gradle wrapper to build them;
- Gradle follows “Convention over Configuration ” principle;
- Configuration for the project and each sub-project is defined in build.gradle.kts files;
- Most of the Gradle functionality comes from tasks, which are defined in plugins, or implemented in the project itself;
- Gradle manages dependencies, as long as the user has defined all versions or conflict resolution strategy.

## Slide 36
- Gradle can do so much more!
- Gradle support many additional features which we won’t be covering today:
- Caching
- Multi-module projects
- More blocks:
- allprojects { } and subprojects { }
- publishing { }
- artifacts { }
- Compatibility
- Resolution strategies
- Source sets

**[讲师备注]**
To be honest, we’ve left out a lot of what Gradle can do. Again, if you want to become a Gradle master, you should refer to its awesome documentation and tutorials.

References:
https://docs.gradle.org/current/userguide/what_is_gradle.html
https://gradle.org/kotlin/
https://gradle.org/guides/

## Slide 37
- Thanks!
- @kotlin
- |  Developed by JetBrains


--- 统计: 37 页, 35 页含讲师备注