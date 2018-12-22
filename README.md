<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
  <span>&nbsp;&nbsp;&nbsp;</span>
  <img src="https://raw.githubusercontent.com/surmon-china/angular-admin/master/src/assets/img/logo.png" width="100" alt="Nest Logo" />
</p>

## NodePress

[![](https://badge.juejin.im/entry/58a5f22c8d6d810057c8f0a5/likes.svg?style=flat-square)](https://juejin.im/entry/58a5f22c8d6d810057c8f0a5/detail)
[![GitHub issues](https://img.shields.io/github/issues/surmon-china/nodepress.svg?style=flat-square)](https://github.com/surmon-china/nodepress/issues)
[![GitHub forks](https://img.shields.io/github/forks/surmon-china/nodepress.svg?style=flat-square)](https://github.com/surmon-china/nodepress/network)
[![GitHub stars](https://img.shields.io/github/stars/surmon-china/nodepress.svg?style=flat-square)](https://github.com/surmon-china/nodepress/stargazers)
[![GitHub last commit](https://img.shields.io/github/last-commit/google/skia.svg?style=flat-square)](https://github.com/surmon-china/nodepress)

#### RESTful API server application for my blog.

普通用户使用高级查询参数将被视为无权限，403
普通用户无特殊参数情况下，也无法拿到高级参数得到的数据

v3.0.0 使用 [Nest](https://github.com/nestjs/nest) 进行重构

- Maintained by [me](mailto://surmon@foxmail.com)
- Online site: https://surmon.me
- SRE service: [sre.surmon.me](https://github.com/surmon-china/sre.surmon.me)
- Web client for user: [surmon.me](https://github.com/surmon-china/surmon.me) By Nuxt.js(Vue)
- Web client for admin: [angular-admin](https://github.com/surmon-china/angular-admin) powered by Angular + Bootstrap4
- Native app client: [surmon.me.native](https://github.com/surmon-china/surmon.me.native) powered by React native

所有依赖：[在这里](https://github.com/surmon-china/nodepress/blob/master/package.json#L11)

更新记录：[在这里](https://github.com/surmon-china/nodepress/blob/master/CHANGELOG.md)

AUTH guard 的执行流程

request ---> middleware ---> guard ---> interceptor:before ---> pipe ---> controller ---> interceptor:after ---> filters

guard ->: guard -> guard.canActivate -> JwtStrategy.validate -> AuthService.validateAuthData -> guard.handleRequest

ReflectMetadata('TEST2', 'test-text')(descriptor.value); === Reflect.defineMetadata('TEST', statusCode, descriptor.value);

error.filters 有很大问题，还需要调整

## 接口概述

  - HTTP 状态码
    * `401` 未授权
    * `403` 权限不足
    * `404` 项目中不存在
    * `405` 无此方法
    * `500` 服务器挂了
    * `200` 正常

  - 数据特征码
    * `code`:
        * `1` 正常
        * `0` 异常
    * `message`: 一般均会返回
    * `debug`: 一般会返回错误发生节点的 err；在`code`为`0`的时候必须返回，方便调试
    * `result`: 一定会返回
        * 列表数据：一般返回`{ pagenation: {...}, data: {..} }`
        * 具体数据，如文章，则包含直接数据如`{ title: '', content: ... }`


## 数据结构

  - 通用
    * `extend` 通用扩展
        文章、分类、tag 表都包含 extend 字段，用于在后台管理中自定义扩展，类似于 wordpress 中的自定义字段功能，目前用来实现前台 icon 图标的 class 或者其他功能
    ···


  - 各种 CRUD 重要字段
    * `name`：名称
    * `_id`：mongodb 生成的 id，一般用于后台执行 CRUD 操作
    * `id`：插件生成的自增数字 id，类似 mysql 中的 id，具有唯一性，用于前台获取数据
    * `pid`：父级ID，用于建立数据表关系，与 id 字段映射
    ···

  - 数据组成的三种可能
    + 业务计算数据
    + 数据库真实存在数据
    + mongoose 支持的 virtual 虚拟数据

## 文件接口

  - 入口

    ```
    index.js -> 主程序入口

    引入配置，启动 Express 程序，启动并连接数据库，路由分发，启动服务
    ```

  - 配置

    ```
    app.config.js -> 主程序配置

    数据库、程序、第三方，一切可配置项
    ```

  - 核心模块

    ```
    core/np-routes.js -> 路由及请求响应相关逻辑
    
    core/np-redis.js ->  Redis/内存/存储的抽象模块

    core/np-mongodb.js -> 数据库连接启动

    core/np-constants.js -> 公共模型常量

    core/np-processor.js -> 超级解析器模块
    ```

  - 控制器

    ```
    controller/*.controller.js -> 各功能控制器
    ```

  - 数据模型

    ```
    model/*.model.js -> 各业务数据模型，映射 Mongoose 对应的模型方法
    ```
  
  - 辅助模块

    ```
    np-helper -> 用以辅助处理数据的模块
    ```
  
  - 扩展模块

    ```

    * 权限校验

    utils/np-auth.js -> 权限处理器
    
    权限验证方法，抽象出的对象；校验 jwt 的合理性、核对加密信息、核对时间戳

    
    * 网站地图

    utils/np-sitemap.js -> 地图生成器
    
    网站地图 xml 生成，抽象出的对象。
    包含 Tag、Article、Category 及一些死数据（页面）的集合，生成 xml 并写入本地
    
    
    * 百度实时更新服务

    utils/np-baidu-push.js -> 自动根据操作通知百度蜘蛛
    
    分别会在文章、分类、标签、进行 CUD 的时候调用此类

    
    * 垃圾评论校验

    utils/np-akismet.js -> 使用 akismet 过滤 spam
    
    本应该暴露三个方法：校验spam、提交spam、提交ham
    
    
    * 邮件服务

    utils/np-email.js -> 根据入参发送邮件
    
    程序启动时会自动校验，校验成功则根据入参发送邮件
    
    
    * 地理查询服务
  
    utils/np-ip.js -> 根据入参查询物理位置
    
    控制器内优先使用阿里云 IP 查询服务，当服务无效，使用本地 GEO 库查询
    
    
    * 搜索引擎主动提交服务
  
    utils/np-baidu-seo-push.js -> 根据入参主动提交搜索引擎收录
    
    目前只有百度
    ```

## 开发命令

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# incremental rebuild (webpack)
$ npm run webpack
$ npm run start:hmr

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
