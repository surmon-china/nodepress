<p align="center">
  <a href="https://github.com/surmon-china/nodepress" target="blank">
    <img src="https://raw.githubusercontent.com/surmon-china/nodepress/master/logo.png" height="90" alt="nodepress Logo" />
  </a>
</p>

# NodePress

[![nodepress](https://img.shields.io/badge/NODE-PRESS-83BA2F?style=for-the-badge&labelColor=90C53F)](https://github.com/surmon-china/nodepress)
[![GitHub stars](https://img.shields.io/github/stars/surmon-china/nodepress.svg?style=for-the-badge)](https://github.com/surmon-china/nodepress/stargazers)
[![GitHub issues](https://img.shields.io/github/issues-raw/surmon-china/nodepress.svg?style=for-the-badge)](https://github.com/surmon-china/nodepress/issues)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/surmon-china/nodepress/Deploy?label=deploy&style=for-the-badge)](https://github.com/surmon-china/nodepress/actions?query=workflow:%22Deploy%22)
[![GitHub license](https://img.shields.io/github/license/surmon-china/nodepress.svg?style=for-the-badge)](https://github.com/surmon-china/nodepress/blob/master/LICENSE)

**RESTful API service for [surmon.me](https://github.com/surmon-china/surmon.me) blog, powered by [nestjs](https://github.com/nestjs/nest), required [mongoDB](https://www.mongodb.com/) & [Redis](https://redis.io/).**

**适用于 [surmon.me](https://github.com/surmon-china/surmon.me) 的 RESTful API 服务；基于 [nestjs](https://github.com/nestjs/nest) (nodejs)；
需安装 [mongoDB](https://www.mongodb.com/) 和 [Redis](https://redis.io/) 方可完整运行。**

v3.x 使用 [nestjs](https://github.com/nestjs/nest) 进行重构，之前的 nodejs 版本在 [此分支](https://github.com/surmon-china/nodepress/tree/nodejs)。


**其他相关项目：**
- **web client for user:** [surmon.me](https://github.com/surmon-china/surmon.me) powered by [Vue (3)](https://vuejs.org)
- **web client for admin:** [angular-admin](https://github.com/surmon-china/angular-admin) powered by [Angular](https://github.com/angular/angular) & [Bootstrap](https://github.com/twbs/bootstrap)
- **native app client:** [surmon.me.native](https://github.com/surmon-china/surmon.me.native) powered by [react-native](https://github.com/facebook/react-native)


**更新记录：[CHANGELOG.md](https://github.com/surmon-china/nodepress/blob/master/CHANGELOG.md#changelog)**

**接口文档：[API_DOC.md](https://github.com/surmon-china/nodepress/blob/master/API_DOC.md)**

---

## v3.x 架构说明

### 接口概述

  - HTTP 状态码（详见 [errors](https://github.com/surmon-china/nodepress/tree/nest/src/errors) ）
    * `400` 请求的业务被拒绝
    * `401` 鉴权失败
    * `403` 权限不足/请求参数需要更高的权限
    * `404` 资源不存在
    * `405` 无此方法
    * `500` 服务器挂了
    * `200` 正常
    * `201` POST 正常

  - 数据特征码（详见 [http.interface.ts](https://github.com/surmon-china/nodepress/blob/master/src/interfaces/http.interface.ts) ）
    * `status`：
        * `success`：正常
        * `error`：异常
    * `message`：永远返回（由 [http.decorator](https://github.com/surmon-china/nodepress/blob/master/src/decorators/http.decorator.ts) 装饰）
    * `error`：一般会返回错误发生节点的 error；在 `status` 为 `error` 的时候必须返回，方便调试
    * `debug`：开发模式下为发生错误的堆栈，生产模式不返回
    * `result`：在 `status` 为 `success` 的时候必须返回
        * 列表数据：一般返回`{ pagination: {...}, data: {..} }`
        * 具体数据：例如文章，则包含直接数据如`{ title: '', content: ... }`

### 数据模型

  - 通用
    * `extend` 为通用扩展（[模型在此](https://github.com/surmon-china/nodepress/blob/master/src/models/extend.model.ts)）
    * 文章、分类、Tag 表都包含 extend 字段，用于在后台管理中自定义扩展，类似于 Wordpress 中的自定义字段功能，目前用来实现前台 icon 图标的 class 或者其他功能

  - 各表重要字段
    * `_id`：mongodb 生成的 id，一般用于后台执行 CRUD 操作
    * `id`：插件生成的自增数字 id，类似 mysql 中的 id，具有唯一性，用于前台获取数据
    * `pid`：父级 id，用于建立数据表关系，与 id 字段映射

  - 数据组成的几种可能
    * 数据库真实存在数据
    * 业务计算出的数据，非存储数据，如：统计数据
    * Mongoose 支持的 virtual 虚拟数据

### 应用结构

- 入口

  * `main.ts`：引入配置，启动主程序，引入各种全局服务
  * `app.module.ts`：主程序根模块，负责各业务模块的聚合
  * `app.controller.ts`：主程序根控制器
  * `app.config.ts`：主程序配置，数据库、程序、第三方，一切可配置项
  * `app.environment.ts：`全局环境变量

- 请求处理流程

  1. `request`：收到请求
  2. `middleware`：中间件过滤（跨域、来源校验等处理）
  3. `guard`：守卫过滤（鉴权）
  4. `interceptor:before`：数据流拦截器（本应用为空，即：无处理）
  5. `pipe`：参数提取（校验）器
  6. `controller`：业务控制器
  7. `service`：业务服务
  8. `interceptor:after`：数据流拦截器（格式化数据、错误）
  9. `filter`：捕获以上所有流程中出现的异常，如果任何一个环节抛出异常，则返回错误

- 鉴权处理流程

  1. `guard`：[守卫](https://github.com/surmon-china/nodepress/blob/master/src/guards/auth.guard.ts) 分析请求
  2. `guard.canActivate`：继承处理
  3. `JwtStrategy.validate`：调用 [鉴权服务](https://github.com/surmon-china/nodepress/blob/master/src/modules/auth/jwt.strategy.ts#L25)
  4. `guard.handleRequest`：[根据鉴权服务返回的结果作判断处理，通行或拦截](https://github.com/surmon-china/nodepress/blob/master/src/guards/auth.guard.ts#L11)

- 鉴权级别
  * 任何高级操作（CUD）都会校验必须的 Token（代码见 [auth.guard.ts](https://github.com/surmon-china/nodepress/blob/master/src/guards/auth.guard.ts) ）
  * 涉及表数据读取的 GET 请求会智能校验 Token，无 Token 或 Token 验证生效则通行，否则不通行（代码见 [humanized-auth.guard.ts](https://github.com/surmon-china/nodepress/blob/master/src/guards/humanized-auth.guard.ts) ）

- 参数校验逻辑（代码见 [query-params.decorator.ts](https://github.com/surmon-china/nodepress/blob/master/src/decorators/query-params.decorator.ts#L198) ）
  * 普通用户使用高级查询参数将被视为无权限，返回 403
  * 任何用户的请求参数不合法，将被校验器拦截，返回 400

- 错误过滤器（代码见 [error.filter.ts](https://github.com/surmon-china/nodepress/blob/master/src/filters/error.filter.ts) ）

- 拦截器 [interceptors](https://github.com/surmon-china/nodepress/tree/nest/src/interceptors)
  * [缓存拦截器](https://github.com/surmon-china/nodepress/blob/master/src/interceptors/cache.interceptor.ts)：自定义这个拦截器是是要弥补框架不支持 ttl 参数的缺陷
  * [数据流转换拦截器](https://github.com/surmon-china/nodepress/blob/master/src/interceptors/transform.interceptor.ts)：当控制器所需的 Promise service 成功响应时，将在此被转换为标准的数据结构
  * [数据流异常拦截器](https://github.com/surmon-china/nodepress/blob/master/src/interceptors/error.interceptor.ts)：当控制器所需的 Promise service 发生错误时，错误将在此被捕获
  * [日志拦截器](https://github.com/surmon-china/nodepress/blob/master/src/interceptors/logging.interceptor.ts)：代替默认的全局日志

- 装饰器扩展 [decorators](https://github.com/surmon-china/nodepress/tree/nest/src/decorators)
  * [缓存装饰器](https://github.com/surmon-china/nodepress/blob/master/src/decorators/cache.decorator.ts)：用于配置 `cache key / cache ttl`
  * [控制器响应装饰器](https://github.com/surmon-china/nodepress/blob/master/src/decorators/http.decorator.ts)：用于输出规范化的信息，如 `message` 和 翻页参数数据
  * [请求参数提取器](https://github.com/surmon-china/nodepress/blob/master/src/decorators/query-params.decorator.ts)：用户自动校验和格式化请求参数，包括 `query/params/辅助信息`

- 守卫 [guards](https://github.com/surmon-china/nodepress/tree/nest/src/guards)
  * 默认所有非 GET 请求会使用 [Auth](https://github.com/surmon-china/nodepress/blob/master/src/guards/auth.guard.ts) 守卫鉴权
  * 所有涉及到多角色请求的 GET 接口会使用 [HumanizedJwtAuthGuard](https://github.com/surmon-china/nodepress/blob/master/src/guards/humanized-auth.guard.ts) 进行鉴权

- 中间件 [middlewares](https://github.com/surmon-china/nodepress/tree/nest/src/middlewares)
  * [Cors 中间件](https://github.com/surmon-china/nodepress/blob/master/src/middlewares/cors.middleware.ts)，用于处理跨域访问
  * [Origin 中间件](https://github.com/surmon-china/nodepress/blob/master/src/middlewares/origin.middleware.ts)，用于拦截各路不明请求

- 管道 [pipes](https://github.com/surmon-china/nodepress/tree/nest/src/pipes)
  * validation.pipe 用于验证所有基于 class-validate 的验证类

- 业务模块 [modules](https://github.com/surmon-china/nodepress/tree/nest/src/modules)
  * 公告
  * 文章
  * 分类
  * 标签
  * 评论
  * 配置
  * 鉴权/登陆：全局鉴权业务和 Token 业务
  * 点赞：点赞评论、文章、主站
  * [聚合供稿](https://github.com/surmon-china/nodepress/blob/master/src/modules/syndication/syndication.service.ts)：负责聚和信息的输出和写入，如 Sitemap、RSSXML
  * 扩展模块
    + 统计：业务数据统计业务
    + 备份：数据库备份业务（定时、手动）
    + 其他：其他第三方 token 等服务

- 核心辅助模块 [processors](https://github.com/surmon-china/nodepress/tree/nest/src/processors)
  * [数据库](https://github.com/surmon-china/nodepress/blob/master/src/processors/database)
    + 连接数据库和异常自动重试
  * [缓存 / Redis](https://github.com/surmon-china/nodepress/blob/master/src/processors/cache)
    + 基本的缓存数据 Set、Get
    + 扩展的 [Promise 工作模式](https://github.com/surmon-china/nodepress/blob/master/src/processors/cache/cache.service.ts#L99)（双向同步/被动更新）
    + 扩展的 [Interval 工作模式](https://github.com/surmon-china/nodepress/blob/master/src/processors/cache/cache.service.ts#L138)（超时更新/定时更新）
  * [辅助 / Helper](https://github.com/surmon-china/nodepress/blob/master/src/processors/helper)
    + [搜索引擎实时更新服务](https://github.com/surmon-china/nodepress/blob/master/src/processors/helper/helper.service.seo.ts)：根据入参主动提交搜索引擎收录，支持百度、Google 服务；分别会在动态数据 进行 CUD 的时候调用对应方法
    + [评论过滤服务](https://github.com/surmon-china/nodepress/blob/master/src/processors/helper/helper.service.akismet.ts)：使用 akismet 过滤 spam；暴露三个方法：校验 spam、提交 spam、提交 ham
    + [邮件服务](https://github.com/surmon-china/nodepress/blob/master/src/processors/helper/helper.service.email.ts)：根据入参发送邮件；程序启动时会自动校验客户端有效性，校验成功则根据入参发送邮件
    + [IP 地理查询服务](https://github.com/surmon-china/nodepress/blob/master/src/processors/helper/helper.service.ip.ts)：根据入参查询 IP 物理位置；控制器内优先使用阿里云 IP 查询服务，当服务无效，~~使用本地 GEO 库查询~~，使用 ip.cn 等备用方案
    + [第三方云存储服务](https://github.com/surmon-china/nodepress/blob/master/src/processors/helper/helper.service.oss.ts)：生成云存储上传 Token（目前服务为 Aliyun OSS），后期可以添加 SDK 的更多支持，比如管理文件
    + Google 证书（鉴权）服务：用于生成各 Google 应用的服务端证书


## Special issues

#### Google Indexing API

- [完整的配置流程文档](https://developers.google.com/search/apis/indexing-api/v3/quickstart)
- 「 统计用户的所有者角色 」添加页面 [在这里](https://www.google.com/webmasters/verification/details?hl=zh-CN&domain=<xxx.com>)，而非 [新版的](https://search.google.com/search-console/users?resource_id=<xxx.com>)

#### Google Auth

- OAuth 2.0 客户端 ID、服务帐号密钥 都是 OAuth 授权类型
- [Auth 申请及管理页面](https://console.developers.google.com/apis/credentials)

#### Google Analytics Embed API

- [完整文档](https://developers.google.com/analytics/devguides/reporting/embed/v1/)
- [完整示例](https://ga-dev-tools.appspot.com/embed-api/)
- [服务端签发 token 鉴权示例](https://ga-dev-tools.appspot.com/embed-api/server-side-authorization/)
- [客户端 API 文档](https://developers.google.com/analytics/devguides/reporting/embed/v1/core-methods-reference)
- [将服务账户添加为 GA 的数据阅读者操作页面](https://marketingplatform.google.com/home/accounts)

## Development Setup

```bash
# 安装
$ yarn

# 开发
$ yarn start:dev

# 测试
$ yarn lint
$ yarn test
$ yarn test:e2e
$ yarn test:cov
$ yarn test:watch

# 构建
$ yarn build

# 生产环境运行
$ yarn start:prod

# 更新 GEO IP 库数据
$ yarn update-geo-db
```

## Actions setup

**Rule:**
- `any PR open` → `CI:Build test`
- `master PR closed & merged` → `CI:Deploy to server`

**Example:**
- `local:develop` → `remote:develop` → `CI:Build test`
- `remote:develop/master` → `remote:master → merged` → `CI:Deploy to server`
