# Changelog

All notable changes to this project will be documented in this file.

### 4.13.0 (2025-01-04)

**Feature**

- Upgrade dependencies
- Use `picocolors` instead of `chalk`

### 4.10.0 (2024-08-06)

**Feature**

- Upgrade actions dependencies
- Upgrade dependencies
- Upgrade Eslint to v9

**Refactor**

- **[Google]** upgrade Google Analytics to v4
- **[Article]** optimize `getRelatedArticles` API
- **[Expansion]** rename module name from `expansion` to `extension`

### 4.9.0 (2024-05-20)

**Feature**

- **[Auth]** rename DB collection name from `Auth` to `Admin`

### 4.8.0 (2024-05-19)

**Feature**

- **[Category]** Add `/all` API
- Upgrade dependencies

### 4.7.0 (2024-05-10)

**Feature**

- Improve global throttler
- Improve global log interceptor format
- Upgrade dependencies

### 4.4.0 (2023-10-09)

**Breaking Change**

- Remove `/article/hottest` API

**Feature**

- **[Article]** Add `featured` field
- Upgrade dependencies

### 4.3.0 (2023-09-06)

**Feature**

- **[Article]** Add `mixed` language option
- **[Comment]** Add `/calendar` API
- **[Expansion]** Add daily statistics
- Upgrade dependencies

### 4.1.0 (2023-07-20)

**Feature**

- Add config `REDIS.namespace`
- Improve Redis Store

### 4.0.1 (2023-07-17)

**Feature**

- Rename field `tag.articles_count` to `tag.article_count`
- Rename field `category.articles_count` to `category.article_count`

**Fix**

- Fix `ArticleContext` data type
- Fix `DBBackupService` error

### 4.0.0 (2023-07-08)

**Feature**

- Upgrade nestjs v9 to v10
- Update various dependencies
- Use `pnpm` instead of `yarn` as a package management tool
- Use `dayjs` instead of `moment`
- Refactor and improve cache system
- Remove field `__v` from all models
- Rename field `create_at` to `created_at` and `update_at` to `updated_at`
- Rename field `article.thumb` to `article.thumbnail`
- Rename field `article.tag` to `article.tags`
- Rename field `article.category` to `article.categories`
- Rename field `article.disabled_comment` to `article.disabled_comments`
- Add `Bing` support to `SeoService`

**Fix**

- Fix googleAPI `Credentials` type
- Fix `Statistic` service error

### 3.14.0 (2022-12-22)

**Feature**

- Update various dependencies

### 3.13.1 (2022-12-21)

**Feature**

- Fix `mongodump` command args

### 3.13.0 (2022-09-23)

**Feature**

- `/vote/site` and `/vote/article` merged into `/vote/post`

### 3.12.0 (2022-09-23)

**Feature**

- Add vote model
- Improve feedback service

### 3.11.0 (2022-09-12)

**Feature**

- Anonymous user vote email.
- Add to `agent` vote notification email.

**Chore**

- Upgrade deps

### 3.10.1 (2022-05-16)

**Feature**

- Remove classified dir.
- Improve DB backup mail context

### 3.10.0 (2022-05-15)

**Feature**

- AliYun OSS to AWS S3
- Remove STSToken API for cloud storage

### 3.9.4 (2022-04-12)

**Feature**

- **[Helper]** improve `nodemailer` config
- **[Helper]** improve `akismet` types

**Chore**

- Upgrade deps

### 3.9.0 (2022-02-28)

**Feature**

- **[Option]** add `statement` `friend_links` field
- Add `feedback` module

### 3.8.4 (2022-02-19)

**Feature**

- **[Article]** add `lang` field

### 3.8.2 (2022-02-15)

**Feature**

- New API `/article/calendar`
- Refactoring API `/article/related/:id` to `/article/:id/context`
- Rename API `/article/hot` to `/article/hottest`
- Improve `Article` module

### 3.8.1 (2022-02-15)

**BugFix**

- fix `{ timestamps: false }` for
  - `article.meta.views`
  - `article.meta.likes`
  - `article.meta.comments`
  - `comment.vote`
  - `option.meta.likes`

### 3.8.0 (2022-02-14)

**Feature**

- improve `guards`
- improve `QueryParams` decorator
- improve `Mongoose` types
- improve `Model` > `DTOs`
- improve `Option` module service
- improve `Expansion` statistic service
- Remove query `cache` field
- Rename `tag.count` `category.count` to `<target>.articles_count`
- Add API `/article/hot` `/article/related` `/tag/all`
- Add `PermissionPipe` `ExposePipe` pipes
- Rename `HttpProcessor` to `Responsor`
- Generate documentation by `compodoc`

### 3.7.15 (2022-02-01)

**Feature**

- **[MongoDB]** improve MongoDB config & backup

### 3.7.14 (2022-01-19)

**Feature**

- `express-rate-limit` > `@nestjs/throttler`
- **[Vote]** add throttler
- **[Disqus]** add throttler
- **[Comment]** add throttler

### 3.7.11 (2022-01-06)

**Feature**

- **[Disqus]** cache for userinfo & thread

### 3.7.6 (2022-01-05)

**Feature**

- **[Article]** random related articles
- **[Comment]** improve email content
- **[Vote]** send email to admin when new vote

### 3.7.4 (2022-01-01)

**Feature**

- **[Comment]** add `reviseIPLocation` service

### 3.7.2 (2021-12-31)

**Chore**

- email text

### v3.7.0 (2021-12-31)

**Feature**

- **[Like]** rename `Like` module to `Vote`
- **[Disqus]** add Disqus comment module
- **[Auth]** rename `gravatar` to `avatar`
- **[Article]** add `disabled_comment` field
- **[Article]** remove `t_content` field
- **[Option]** remove `icp` field
- **[Option]** rename `blacklist` to `blocklist`
- **[Comment]** remove `is_top` field
- **[Comment]** add `dislikes` field
- **[Comment]** hidden `ip`, `email` fields
- **[Comment]** add `email_hash` virtual field
- **[Helper]** IP location services to `ip-api.com` & `ipapi.co`

**Chore**

- Upgrade deps
- Remove `geoip-lite` dep

### v3.6.4 (2021-12-21)

**Chore**

- Improve deploy logic

### v3.6.3 (2021-12-07)

**Feature**

- Fix archive article query options

### v3.6.2 (2021-12-07)

**Feature**

- Remove `mongoose-paginate`
- Remove `APP.LIMIT` config
- Improve `AutoIncrementID.Config`
- Improve global paginate config

### v3.6.0 (2021-12-06)

**Feature**

- Remove `syndication` module
- Remove `cache-manager-redis-store`
- Add `archve` module
- Add global logger

**Chore**

- Upgrade deps

  - `Redis` > v4
  - `nest` > v8
  - `mongoose` > v6

### v3.5.2 (2021-07-27)

**Chore**

- Upgrade deps
- Update CI scripts
- Update ESLint config & format

### v3.4.4

**Feature**

- DB backup shell & path
- Support patch API to backup DB & recover DB

### v3.4.3

**Chore**

- Upgrade all deps
- Remove unused deps
- Update API Document
- Fix typos
- Add `cspell.json`

**Breaking Change**

- Remove `Vlog` `Music` `GitHub` modules to BFF server

### v3.4.2

**Chore**

- Upgrade all deps

**Breaking Change**

- comment content HTML -> markdown text
- remove marked module

### v3.4.1

**Chore**

- Upgrade all deps

**Feature**

- support redis `password` config

**Breaking Change**

- add fe public path
- remove legacy folder file path for syndication

### v3.4.0

- Upgrade deps
- Fix bilibili video API url
- Add AD config field (options)
- `Promise` to `async await`
- `mongoose-auto-increment` to [`auto-increment`](https://github.com/typegoose/auto-increment/)
- ~~`mongoose-paginate` to [`mongoose-paginate-v2`](https://github.com/aravindnc/mongoose-paginate-v2#readme)~~
- [Add documents id field to unique index](https://typegoose.github.io/typegoose/docs/api/decorators/prop#unique)
- [Improve sub documents `_id: false` option](https://typegoose.github.io/typegoose/docs/api/decorators/prop#_id)
- [Improve documents `enum` option](https://typegoose.github.io/typegoose/docs/api/decorators/prop#enum)

### v3.3.3

- Wallpaper module support `en`
- Enable `esModuleInterop` for `tsconfig`

### v3.3.2

- Fix article/hotList `query.state`
- Upgrade TypeScript deep
- Update `Optional Chaining`

### v3.3.0

- Rename Sitemap module to Syndication module
- Add RSS service with Syndication module
- Add renewal API with Auth module
- Improve akismet module
- Remove geo-ip service
- Upgrade Nest
- Upgrade Mongoose (remove MongoDB's autoConnect)
- Upgrade RedisStore (workaround `is_cacheable_value` option)
- Upgrade typegoose (Remove `getModelForSchema`)
- Upgrade all dependencies
- Replace ESLint with TSLint

### v3.2.6

- Upgrade mongoose
- Update README.md
- Update FUNDING.yml

### v3.2.4

- Replace QINIU to Aliyun OSS
- Update uptoken and dbbackup module

### v3.2.3

- Remove project page with sitemap

### v3.2.2

- Add datebase backup service
- Add actions
- Update global console method

### v3.2.0

- 更新 所有依赖
- 更新 sitemap 模块及进行优化
- 更新 缓存及数据库模块、在核心节点增加告警服务
- 更新 SEO ping 服务
- 增加 API 文档
- 增加 logo 资源
- 增加 模型构造器、Provider 构造器、模型注入器
- 增加 Google 证书服务
- ~~增加 compodoc 文档构建器，但不实用~~
- 优化 各模型搜索业务完善为大小写通配，并 trim 处理
- 优化 验证模型
- 优化 鉴权业务
- 优化 helper 模块
- 优化 设置表
- 去除 对 nestjs-typegoose 模块的依赖
- 废弃 枚举常量接口

### v3.1.0

- Update nestjs to v6.0
- 修正邮件服务文案错误
- 修复更新密码覆盖问题
- 修正缓存请求服务的问题
- 修正配置读取类型错误问题
- 升级 Wallpaper 业务

### v3.0.0

- 使用 [Nest](https://github.com/nestjs/nest) 进行重构
- 增加 Bilibili Vlog 业务模块

### v2.2.0

- opeitime logic
- add constants api

### v2.1.4

- 增加统计数据接口
- 优化密码更新机制

### v2.1.2

- 升级完善全站缓存机制
- 增加时间定点任务库

### v2.1.0

- 优化编码风格
- 完善项目信息
- 完善 Js Doc 信息
- Music 控制器增加 limit 参数
- Github 控制器优化数据
- 增加 bing-wallpaper API 服务
- 使用更友好的 consola 日志模块
- 为控制器和 Model 抽象出单独的状态常量

### v2.0.0

- 文章增加原创、转载字段
- 优化评论系统的业务
  - submitSpam 与移至黑名单功能映射
  - 移黑功能，会自动将 SPAM 信息提交至 akismet，同时添加至系统黑名单
- 升级 akismet-api 库，增加两项功能
- 升级 geoip-lite 库
- 升级 helmet 库
- 升级 jsonwebtoken 库，根据版本调整逻辑
- 升级 marked
- 升级 mongoose 库
- 升级 nodemailer 库，更新逻辑，去除 nodemailer-smtp-transport 库
- 升级 redis 库
- 升级 request 库
- 升级 sitemap 库，优化部分逻辑
- 升级 yargs 库
- fork mongoose-paginate 修复旧方法警告问题
- 更新密码加密机制
- 增加检查 Token 有效性接口

### v1.2.0

- 重构了播放器 API

### v1.1.0

- 修复了评论数 bug

### v1.0.0

- 驱动搜索引擎 ping 接口 文章发布后自动 ping 给搜索引擎 xml
- 增加评论功能+黑名单，评论可自动校验 spam，及黑名单 (ip、邮箱、关键字的校验)
- 使用 helmet + 手动优化，优化程序安全性
- 优化 mongoose 实例
- 优化数据表结构
- 更新数据时时间更新
- 修复时间检索失效
- 增加 idle-gc 内存回收
- 增加百度搜索引擎的实时提交
- 更新模块化别名
- 更新 README.md
- 加入网站地图接口
- 网站地图由于缓存或者 primise 不能及时更新
- 网站地图的数据构成中文章需要筛选公开一发布的文章
- 对接百度统计开放平台 api
- 密码存储需要使用 md5 加密机制
- token... 等 config 信息使用 node 命令参数在 shell 中配置覆盖
- lean 和 翻页插件一起使用，返回的 id 字段是 \_id bug
- 整理统一 result 的返回结构
- 围观后计数功能
- 多说转发热门文章接口
- 相关文章接口
- 使用 Redis 缓存标签、播放器、Github 数据
