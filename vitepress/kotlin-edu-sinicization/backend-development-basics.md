# Kotlin 后端开发基础

::: info
本文翻译自：https://kotlinlang.org/education/
:::

## 网络基础

- **计算机网络**：使计算机能够相互通信的系统

**互联网协议（IP）**：用于识别计算机的系统

**端口**：计算机上的通信通道（0-65535）

## 连接

- **连接**：两个程序之间的通信通道
  - 类似于两台计算机之间的电话通话

- **连接信息**：
  - 源 IP 和端口
  - 目标 IP 和端口

- **TCP 协议**：可靠、有序的传输

## IPv4

- 互联网协议地址（IP 地址）
- **x.x.x.x（地址结构）**:
  - **127.0.0.1（本地主机）**:
    - 始终指代你自己的计算机
    - 适用于无需网络连接的测试
    - 也可通过 `localhost` 访问
  - **0.0.0.0**:
    - 表示“所有可用网络接口”
    - 当服务器监听 0.0.0.0 时，它将接受来自任何网络接口的连接
    - 用于使服务器可从其他计算机访问
  - **255.255.255.255**：广播地址（发送给本地网络上的所有设备）
  - **192.168.x.x 和 10.x.x.x** 私有地址（仅在本地网络中有效）

## Sockets

- **Socket**：用于网络通信的编程工具

- **Sockets 的功能**：
  - 建立网络连接
  - 通过网络发送数据
  - 从网络接收数据

- **Kotlin 中的 Socket 类型**：
  - **Socket**：用于 TCP 连接（可靠）
  - **ServerSocket**：用于接受 TCP 连接
  - **DatagramSocket**：用于 UDP 通信（更简单、更快）

## 客户端-服务器模型

- **服务器 Server**：等待连接并提供服务的程序
  - 在特定端口上监听
  - 处理多个客户端连接
  - 示例：Web 服务器、游戏服务器、聊天服务器

- **客户端 Client**：连接到服务器以使用其服务的程序
  - 主动发起与服务器的连接
  - 通常具有用户界面
  - 示例：Web 浏览器、游戏客户端、聊天应用

- **通信**：双向数据交换

## 服务器 Socket

```Kotlin
// 在 8080 端口上创建一个服务器 Socket
val serverSocket = ServerSocket(8080)
println("Server started on port 8080")

// 接受一个客户端连接
val clientSocket = serverSocket.accept()
println("Client connected!")

// 创建一个 Writer，用于将数据发送给客户端
val writer = PrintWriter(clientSocket.getOutputStream(), true)

// 发送信息
writer.println("Hello from Kotlin server!")

// 清理
clientSocket.close()
serverSocket.close()
println("Server stopped")
```

## 客户端 Socket

```Kotlin
// 连接到服务器（localhost = 127.0.0.1）
val socket = Socket("localhost", 8080)
println("Connected to server")

// 配置 Reader 以接收数据
val reader = BufferedReader(InputStreamReader(socket.getInputStream()))

// 读取并打印来自服务器的消息
val message = reader.readLine()
println("Server says: $message")

// 清理
socket.close()
println("Connection closed")
```

## 什么是后端？

- 应用程序中用户无法直接交互的服务端部分
- 处理核心业务逻辑、数据存储和安全事务
- 与其他系统（数据库、服务等）进行通信
- 向前端（网页、移动应用）提供数据和功能
- 运行在服务器或云平台上
- 通常构建为一组服务或 API

## Web APIs

- API 通过 HTTP 在互联网上进行通信
- 客户端-服务器通信模型
- 常见格式：JSON, XML
- 技术无关（不同编程语言可以通信）
- 类型：
  - SOAP：使用 XML，结构更为严格
  - REST：使用 HTTP 方法，基于资源
  - GraphQL：API 查询语言，数据获取灵活
  - RPC：远程过程调用，基于操作

## HTTP

- 基于文本的通信协议（HTTP 1.*)
- 可处理文本和二进制数据

## HTTP 请求

```Shell
curl -v http://google.com
* Host google.com:80 was resolved.
* IPv6: (none)
* IPv4: 216.58.206.46
*   Trying 216.58.206.46:80...
* Connected to google.com (216.58.206.46) port 80
> GET / HTTP/1.1
> Host: google.com
> User-Agent: curl/8.7.1
> Accept: */*
>
* Request completely sent off
```

## HTTP 响应

```Shell
< HTTP/1.1 301 Moved Permanently
< Location: http://www.google.com/
< Content-Type: text/html; charset=UTF-8
< Content-Security-Policy-Report-Only: object-src 'none';base-uri 'self';script-src 'nonce-z-LCHgth0elAZCmPgxyuFA' 'strict-dynamic' 'report-sample' 'unsafe-eval' 'unsafe-inline' https: http:;report-uri https://csp.withgoogle.com/csp/gws/other-hp
< Date: Mon, 05 May 2025 10:57:07 GMT
< Expires: Wed, 04 Jun 2025 10:57:07 GMT
< Cache-Control: public, max-age=2592000
< Server: gws
< Content-Length: 219
< X-XSS-Protection: 0
< X-Frame-Options: SAMEORIGIN

<
<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>
The document has moved
<A HREF="http://www.google.com/">here</A>.
</BODY></HTML>
* Connection #0 指向 google.com 的记录保持不变
```

## REST

- REST = 表述性状态转移（Representational State Transfer）
- 由 Roy Fielding 在 2000 年提出的 Web API 架构风格
- 基于以下核心原则：
  - 使用 HTTP 方法（GET、POST、PUT、DELETE）
  - 基于资源（URL 代表资源）
  - 无状态（服务器不存储客户端状态）
  - 统一接口（一致的交互模式）
  - 客户端与服务器分离（独立演进）

## REST 中的 HTTP 方法

- **GET**：检索数据（只读，安全）
  - 示例：`GET /users/123` - 获取 ID 为 123 的用户
- **POST**：创建新资源
  - 示例：`POST /users` - 创建新用户
- **PUT**：更新现有资源（完全替换）
  - 示例：`PUT /users/123` - 更新用户 123 的全部数据
- **PATCH**：部分更新资源
  - 示例：`PATCH /users/123` - 更新用户 123 的部分数据
- **DELETE**：删除资源
  - 示例：`DELETE /users/123` - 删除用户 123

## REST 资源与 URL

- 资源是系统中的核心对象
  - 示例：用户、产品、任务
- URL（端点）用于标识资源
  - 集合：`/users`（所有用户）
  - 单个资源：`/users/123`（特定用户）
- 层次关系
  - `/users/123/orders`（用户 123 的订单）
- 用于筛选、排序和分页的查询参数
  - `/products?category=electronics&sort=price`

## HTTP 状态码

- 表示请求结果的数字代码
- 按首位数字分组：
  - **2xx**：成功
    - 200 OK，201 已创建，204 无内容
  - **3xx**：重定向
    - 301 永久移动，304 未修改
  - **4xx**：客户端错误
    - 400 请求错误，401 未授权，404 未找到
  - **5xx**：服务器错误
    - 500 内部服务器错误，503 服务不可用
- 帮助客户端理解发生了什么

## REST API 的优势

- **可扩展性**：无状态特性有助于扩展
- **灵活性**：客户端可独立演进
- **可移植性**：支持跨平台和跨语言
- **可视性**：清晰的 HTTP 交互
- **可靠性**：缓存和错误处理机制明确
- **简洁性**：更易于理解和实现
- **广泛采用**：行业标准

## 后端框架基础

- 框架提供结构和通用功能
- 处理重复性任务（路由、序列化等）
- 常见功能：
  - HTTP 服务器功能
  - 路由系统
  - 请求/响应处理
  - 数据验证
  - 数据库集成
  - 身份验证/授权
  - 测试支持
  - 日志记录与监控

## Ktor 简介

- 贴近 HTTP
- 面向 Kotlin 的轻量级异步 Web 框架
- 由 JetBrains 开发
- 非常适合微服务、HTTP API 和 RESTful 应用程序
- 当前版本：3.1.2（2025 年 3 月）
- 高度模块化，采用基于插件的架构

## 创建 Ktor 项目

- 访问 https://start.ktor.io 使用 Ktor 项目生成器
- 选择你的偏好设置：
  - 构建系统（推荐使用带 Kotlin DSL 的 Gradle）
  - Ktor 版本
  - 服务器引擎（Netty、CIO、Tomcat 等）
  - 所需插件

![](/assets/kotlin-edu-sinicization/ktor-starter.png)

## 启动 Ktor 应用程序

```Kotlin
fun main() {
   // 使用 Netty 引擎启动 Ktor 服务器
   embeddedServer(
       Netty,           // 引擎
       port = 8080,     // 端口
       host = "0.0.0.0",// 主机
       module = Application::module // 模块函数
   ).start(wait = true)
}
```

## 简单 Ktor 应用程序

```Kotlin
fun Application.module() {
   routing {
       get("/") {
           call.respondText("Hello World!")
       }
   }
}
```

## 构建路由

```Kotlin
fun Application.configureRouting() {
   routing {
       // 定义一个 GET 端点
       get("/") {
           call.respondText("Hello, Ktor!")
       }

       // 定义一个返回 JSON 响应的 GET 端点
       get("/info") {
           call.respond(mapOf("version" to "1.0"))
       }
   }
}
```

```Kotlin
       route("/api") {
           // 嵌套路由
           route("/v1") {
               // 任务 API 端点
               route("/tasks") {
                   get { /* 获取所有任务 */ }
                   post { /* 创建任务 */ }

                   // 路径参数
                   route("/{id}") {
                       get { /* 根据 ID 获取任务 */ }
                       put { /* 更新任务 */ }
                       delete { /* 删除任务 */ }
                   }
               }
           }
       }
```

## 请求参数

```Kotlin
// /tasks/42
get("/tasks/{id}") {
   val id = call.parameters["id"]?.toIntOrNull()
   if (id == null) {
       call.respond(HttpStatusCode.BadRequest, "Invalid ID format")
       return@get
   }
   // 使用 ID 参数
}
```

## 查询参数

```Kotlin
// /tasks?id=42

get("/tasks") {
   val id = call.queryParameters["id"]?.toIntOrNull()
   if (id == null) {
       call.respond(HttpStatusCode.BadRequest, "Invalid ID format")
       return@get
   }
   // 使用 ID 参数
}
```

## Ktor 中的插件

- ContentNegotiation：处理序列化和反序列化
- Routing：管理 HTTP 路由定义
- Authentication：处理用户身份验证
- CORS：管理跨源资源共享
- StatusPages：处理错误和异常
- Compression：压缩 HTTP 响应
- CallLogging：记录 HTTP 请求和响应

## 内容协商

https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Content_negotiation

![](/assets/kotlin-edu-sinicization/content-negotiation.png)

```Kotlin
fun Application.configureSerialization() {
   install(ContentNegotiation) {
       // 使用 kotlinx.serialization 处理 JSON
       json()

       // 替代方案：使用 Gson
       // gson()

       // 替代方案：使用 Jackson
       // jackson()
   }
}
```

```Kotlin
@Serializable
data class Task(
   val id: Int? = null,
   val title: String,
   val description: String,
   val completed: Boolean = false
)
```

### 发送

```Kotlin
fun Application.module() {
   routing {
       get("/") {
           call.respond(HttpStatusCode.OK, Task(....))
       }
   }
}
```

### 接收

```Kotlin
post("/tasks") {
   try {
       // 将请求正文解析为任务 Task 对象
       val task = call.receive<Task>()

       // 处理任务
       // ...

       // 返回已创建的任务
       call.respond(HttpStatusCode.Created, task)
   } catch (e: ContentTransformationException) {
       call.respond(
           HttpStatusCode.BadRequest,
           "Invalid task format: ${e.message}"
       )
   }
}
```

## 错误处理

```Kotlin
fun Application.configureStatusPages() {
   install(StatusPages) {
       // 处理路由过程中抛出的异常
       exception<Throwable> { call, cause ->
           call.respond(HttpStatusCode.BadRequest, "Invalid request format")
       }
...
```

```Kotlin
       status(HttpStatusCode.NotFound) { call, status ->
           call.respond(
               status,
               mapOf("error" to "The requested resource was not found")
           )
       }
```

## 身份验证

https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication

![](/assets/kotlin-edu-sinicization/authentication.png)

## 身份验证基础配置

```Kotlin
fun Application.configureAuthentication() {
   install(Authentication) {
       // 基础身份验证
       basic("auth-basic") {
           validate { credentials ->
               if (credentials.name == "admin" &&
                   credentials.password == "password") {
                   UserIdPrincipal(credentials.name)
               } else {
                   null
               }
           }
       }
...
```

## 身份验证用例

```Kotlin
routing {
   // 公共路由
   get("/public") {
       call.respondText("Public endpoint")
   }

   // 受保护的路由
   authenticate("auth-basic") {
       get("/protected") {
           val principal = call.principal<UserIdPrincipal>()
           call.respondText("Protected endpoint, user: ${principal?.name}")
       }
   }
```

## 测试

```Kotlin
class TaskApiTest {

   @Test
   fun `get all tasks returns 200`() = testApplication {
       application {
           configureRoutine()
       }

       val client = createClient {
           install(ContentNegotiation) {
               json()
           }
       }

       // 执行测试请求
       val response = client.get("/tasks")

       // 验证响应
       assertEquals(HttpStatusCode.OK, response.status)
       val tasks = response.body<List<Task>>()
       assertEquals(2, tasks.size)
   }
}
```

## 数据库集成

- Ktor 本身不包含内置的数据库支持
- 常见选项：
  - **Exposed**：JetBrains 提供的 Kotlin SQL 库
  - **JDBC**：标准 Java 数据库连接
  - **MongoDB**：支持 Kotlin 驱动程序的 NoSQL 数据库
  - **Redis**：内存数据结构存储

- 创建基于数据库的仓库实现

## Exposed 设置

```Kotlin
dependencies {
   implementation("org.jetbrains.exposed:exposed-core:0.61.0")
   implementation("org.jetbrains.exposed:exposed-dao:0.61.0")
   implementation("org.jetbrains.exposed:exposed-jdbc:0.61.0")
   implementation("com.h2database:h2:2.1.214") // H2 数据库
}
```

## 定义表

```Kotlin
object Tasks : Table("tasks") {
   val id = integer("id").autoIncrement()
   val title = varchar("name", MAX_VARCHAR_LENGTH)
   val description = varchar("description", MAX_VARCHAR_LENGTH)
   val isCompleted = bool("completed").default(false)
}
```

## 连接数据库并创建表

```Kotlin
fun Application.configureDatabases() {
   val database = Database.connect(
       url = "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1",
       driver = "org.h2.Driver"
   )

   transaction(database) {
       // 创建表
       SchemaUtils.create(Tasks)
   }
}
```

## 插入数据

```Kotlin
val taskId = Tasks.insert {
   it[title] = "Learn Exposed"
   it[description] = "Go through the Get started with Exposed tutorial"
} get Tasks.id

val secondTaskId = Tasks.insert {
   it[title] = "Read The Hobbit"
   it[description] = "Read the first two chapters of The Hobbit"
   it[isCompleted] = true
} get Tasks.id
```

## 筛选数据

```Kotlin
Tasks.select(Tasks.id.count(), Tasks.isCompleted).groupBy(Tasks.isCompleted).forEach {
   println("${it[Tasks.isCompleted]}: ${it[Tasks.id.count()]} ")
}
```

## 仓库模式

- **是什么**：用于抽象数据访问逻辑的设计模式
- **为什么**：将业务逻辑与数据存储分离
- **优点**:
  - 可测试性（可以模拟仓库）
  - 灵活性（可轻松更换实现）
  - 可维护性（一致的数据访问 API）
  - 单一职责原则

## 任务仓库

```Kotlin
interface TaskRepository {
   // 获取所有任务
   suspend fun getAllTasks(): List<Task>

   // 按 ID 获取任务
   suspend fun getTaskById(id: Int): Task?

   // 创建新任务
   suspend fun createTask(task: Task): Task
   ...
```

## 测试仓库

```Kotlin
class InMemoryTaskRepository : TaskRepository {
   private val idCounter = AtomicInteger(1)
   private val tasks = ConcurrentHashMap<Int, Task>()

   init {
       // 添加一些初始任务
       createTask(Task(title = "Setup project", ...))
       createTask(Task(title = "Learn Ktor", ...))
   }

   override suspend fun getAllTasks(): List<Task> = tasks.values.toList()

   override suspend fun getTaskById(id: Int): Task? = tasks[id]
```

## 在生产环境运行

- 将应用程序打包为 JAR 或 WAR 文件
- 部署至：
  - 云服务提供商（AWS、GCP、Azure）
  - Kubernetes（K8s）
  - Docker 容器
  - Java Servlet 容器（Tomcat、Jetty）
- 通过环境变量进行配置
- 健康检查与监控
- 使用 Netty 或 CIO 引擎以获得最佳性能

## 健康检查

```Kotlin
routing {
   // 简单的健康检查
   get("/health") {
       call.respond(HttpStatusCode.OK, mapOf("status" to "UP"))
   }

   get("/health/detailed") {
       val databaseStatus = try {
           // 检查数据库连接
           taskRepository.ping()
           "UP"
       } catch (e: Throwable) {
           "DOWN"
       }

       // 确定整体状态
       val overallStatus = if (databaseStatus == "UP") "UP" else "DOWN"

       call.respond(
           if (overallStatus == "UP") HttpStatusCode.OK else HttpStatusCode.ServiceUnavailable,
           mapOf(
               "status" to overallStatus,
               "components" to mapOf(
                   "database" to databaseStatus
               ),
               "version" to "1.0.0"
           )
       )
   }
```

## 指标与监控

```Kotlin
implementation("io.ktor:ktor-server-metrics-micrometer")
implementation("io.micrometer:micrometer-registry-prometheus:1.11.0")
```

```Kotlin
install(MicrometerMetrics) {
       registry = appMicrometerRegistry

       // 为所有指标添加应用名称标签
       meterBinders = listOf(
           ClassLoaderMetrics(),
           JvmMemoryMetrics(),
           JvmGcMetrics(),
           ProcessorMetrics(),
           JvmThreadMetrics()
       )
   }
```

```Kotlin
   routing {
       get("/metrics") {
           call.respond(appMicrometerRegistry.scrape())
       }
   }
```

## 部署选项

- **JAR 部署**:
  - `./gradlew shadowJar`
  - `java -jar build/libs/application.jar`
- **Docker**:
  - Ktor 提供的简易 Dockerfile
  - `docker build -t myapp .`
  - `docker run -p 8080:8080 myapp`
- **Kubernetes**:
  - 定义资源需求
  - 运行状态/就绪状态的健康检查
  - 根据指标自动扩容/缩容
- **云平台**

## 资源

- **官方文档**：[ktor.io/docs](https://ktor.io/docs)
- **GitHub 仓库**：[github.com/ktorio/ktor](https://github.com/ktorio/ktor)
- **示例**：[github.com/ktorio/ktor-samples](https://github.com/ktorio/ktor-samples)
- **项目生成器**：[start.ktor.io](https://start.ktor.io)
