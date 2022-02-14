## v3.x 架构说明

### 接口概述

**HTTP 状态码** [`errors`](/src/errors)

- `400` 请求的业务被拒绝
- `401` 鉴权失败
- `403` 权限不足/请求参数需要访客为管理员角色
- `404` 资源不存在
- `405` 无此方法
- `500` 服务器挂了
- `200` 正常
- `201` POST 正常

**数据特征码** [`response.interface.ts`](/src/interfaces/response.interface.ts)

- `status`：
  - `success`：正常
  - `error`：异常
- `message`：永远返回，由 [`responsor.decorator`](/src/decorators/responsor.decorator) 装饰
- `error`：一般会返回错误发生节点的 error；在 `status` 为 `error` 的时候必须返回，方便调试
- `debug`：开发模式下为发生错误的堆栈，生产模式不返回
- `result`：在 `status` 为 `success` 的时候必须返回
  - 基本数据：例如文章，直接输出数据如 `{ title: '', content: '', ... }`
  - 列表数据：一般返回 `{ pagination: {...}, data: {..} }`

### 数据模型

**通用**

- `extend` 为数据表的通用扩展结构 [`Extend Model`](/src/models/extend.model.ts)
- 文章、分类、Tag 表都包含 `extend` 字段，用于在后台管理中自定义扩展，类似于 [WordPress Custom Fields](https://wordpress.org/support/article/custom-fields/)

**各表重要字段**

- `_id`：MongoDB 生成的 ID，一般用于后台执行 CRUD 操作
- `id`：插件生成的自增数字 ID，类似 MySQL 中的 ID，具有唯一性，用于前台获取数据
- `pid`：父级数据 ID，用于建立数据表关系，与 ID 字段映射

**数据组成的几种可能**

- 数据库真实存在数据
- 业务计算出的数据，非存储数据，如：统计数据
- Mongoose 支持的 virtual 虚拟数据

### 应用结构

**入口**

- `main.ts`：引入配置，启动主程序，引入各种全局服务
- `app.module.ts`：主程序根模块，负责各业务模块的聚合
- `app.controller.ts`：主程序根控制器
- `app.config.ts`：主程序配置，数据库、程序、第三方，一切可配置项
- `app.environment.ts：`全局环境变量

**请求处理流程**

1. `request`：收到请求
2. `middleware`：中间件过滤（跨域、来源校验等处理）
3. `guard`：守卫过滤（鉴权）
4. `interceptor:before`：数据流拦截器（本应用为空，即：无处理）
5. `pipe`：参数格式化/校验器，参数字段权限/校验，参数挂载至 `request` 上下文
6. `controller`：业务控制器
7. `service`：业务服务
8. `interceptor:after`：数据流拦截器（格式化数据、错误）
9. `filter`：捕获以上所有流程中出现的异常，如果任何一个环节抛出异常，则返回错误

**鉴权处理流程**

1. `guard`：[守卫](/src/guards) 分析请求
2. `guard.canActivate`：继承处理
3. `JwtStrategy.validate`：调用 [鉴权服务](/src/modules/auth/jwt.strategy.ts)
4. `guard.handleRequest`：[根据鉴权服务返回的结果作判断处理，通行或拦截](/src/guards/admin-only.guard.ts)

**鉴权级别**

- 任何写操作（CUD）都会校验必须的 Token [`admin-only.guard.ts`](/src/guards/admin-only.guard.ts)
- 涉及表数据读取的 GET 请求会智能校验 Token，无 Token 或 Token 验证生效则通行，否则不通行 [`admin-maybe.guard.ts`](/src/guards/admin-maybe.guard.ts)

**参数校验逻辑**

- 任何用户的请求参数不合法，将被校验器拦截，返回 400 [`validation.pipe.ts`](/src/pipes/validation.pipe.ts)
- 普通用户使用高级查询参数将被视为无权限，返回 403 [`permission.guard.ts`](/src/pipes/permission.pipe.ts)

**错误过滤器** [`error.filter.ts`](/src/filters/error.filter.ts)

**拦截器** [`interceptors`](/src/interceptors)

- [缓存拦截器](/src/interceptors/cache.interceptor.ts)：自定义这个拦截器是是要弥补框架不支持 ttl 参数的缺陷
- [数据流转换拦截器](/src/interceptors/transform.interceptor.ts)：当控制器所需的 Promise service 成功响应时，将在此被转换为标准的数据结构
- [数据流异常拦截器](/src/interceptors/error.interceptor.ts)：当控制器所需的 Promise service 发生错误时，错误将在此被捕获
- [日志拦截器](/src/interceptors/logging.interceptor.ts)：补充默认的全局日志

**装饰器扩展** [`decorators`](/src/decorators)

- [缓存装饰器](/src/decorators/cache.decorator.ts)：用于配置 `cache key / cache ttl`
- [响应装饰器](/src/decorators/responsor.decorator)：用于输出规范化的信息，如 `message` 和 翻页参数数据
- [请求参数装饰器](/src/decorators/queryparams.decorator.ts)：用户自动校验和格式化请求参数，包括 `query/params/ip` 等辅助信息
- [访客请求装饰器](/src/decorators/guest.decorator)：用于装饰 `class-validate` 中的子字段，为其增加一些供 `permission.pipe` 消费的配置项元数据

**守卫** [`guards`](/src/guards)

- 默认所有非 GET 请求会使用 [`AdminOnlyGuard`](/src/guards/admin-only.guard.ts) 守卫鉴权
- 所有涉及到多角色请求的 GET 接口会使用 [`AdminMaybeGuard`](/src/guards/admin-only.guard.ts) 进行鉴权

**中间件** [`middlewares`](/src/middlewares)

- [`CORS` 中间件](/src/middlewares/cors.middleware.ts)，用于处理跨域访问
- [`Origin` 中间件](/src/middlewares/origin.middleware.ts)，用于拦截各路不明请求

**管道** [`pipes`](/src/pipes)

- `validation.pipe` 用于验证所有基于 `class-validate` 的验证类的数据格式合法性
- `permission.pipe` 用于验证所有数据（格式已合法）的权限合法性

**业务模块** [`modules`](/src/modules)

- `Announcement`
- `Article`
- `Category`
- `Tag`
- `Comment`
- `Option`
- `Auth`：全局鉴权、Token、用户（Admin）
- `Vote`：赞踩评论、文章、主站
- `Disqus`：外接 Disqus 的业务服务
- `Archive`：全站数据缓存
- `Expansion`
  - 统计：业务数据统计业务
  - 备份：数据库备份业务（定时、手动）
  - 其他：其他第三方 token 等服务

**核心（全局）模块** [`processors`](/src/processors)

- [`database`](/src/processors/database)
  - 连接数据库和异常管理
- [`cache`](/src/processors/cache)
  - 基本的缓存数据 Set、Get
  - 扩展的 [`Promise` 工作模式](/src/processors/cache/cache.service.ts#L114)（双向同步/被动更新）
  - 扩展的 [`Interval` 工作模式](/src/processors/cache/cache.service.ts#L147)（超时更新/定时更新）
- [`helper`](/src/processors/helper)
  - [搜索引擎实时更新服务](/src/processors/helper/helper.service.seo.ts)：根据入参主动提交搜索引擎收录，支持百度、Google 服务；分别会在动态数据进行 CUD 操作的时候调用
  - [评论过滤服务](/src/processors/helper/helper.service.akismet.ts)：使用 Akismet 过滤 SPAM；暴露三个方法：校验 SPAM、提交 SPAM、提交 HAM
  - [邮件服务](/src/processors/helper/helper.service.email.ts)：根据入参发送邮件；程序启动时会自动校验客户端有效性，校验成功则根据入参发送邮件
  - [IP 地理查询服务](/src/processors/helper/helper.service.ip.ts)：根据入参查询 IP 物理位置；使用一些免费在线服务
  - [第三方云存储服务](/src/processors/helper/helper.service.cloud-storage)：生成云存储上传 Token（目前服务为 Aliyun OSS），后期可以添加 SDK 的更多支持，如管理文件
  - Google 证书（鉴权）服务：用于生成各 Google 应用的服务端证书

## Special issues

#### Google Indexing API

- [完整的配置流程文档](https://developers.google.com/search/apis/indexing-api/v3/quickstart)
- 「 统计用户的所有者角色 」添加页面 [在这里](https://www.google.com/webmains/verification/details?hl=zh-CN&domain=<xxx.com>)，而非 [新版的](https://search.google.com/search-console/users?resource_id=<xxx.com>)

#### Google Auth

- OAuth 2.0 客户端 ID、服务帐号密钥 都是 OAuth 授权类型
- [Auth 申请及管理页面](https://console.developers.google.com/apis/credentials)

#### Google Analytics Embed API

- [完整文档](https://developers.google.com/analytics/devguides/reporting/embed/v1/)
- [完整示例](https://ga-dev-tools.appspot.com/embed-api/)
- [服务端签发 token 鉴权示例](https://ga-dev-tools.appspot.com/embed-api/server-side-authorization/)
- [客户端 API 文档](https://developers.google.com/analytics/devguides/reporting/embed/v1/core-methods-reference)
- [将服务账户添加为 GA 的数据阅读者操作页面](https://marketingplatform.google.com/home/accounts)
