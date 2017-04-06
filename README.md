## NodePress

A RESTful application.

- Author By Surmon Surmon@foxmail.com
- Online site: https://surmon.me
- Front end (User client): [surmon.me](https://github.com/surmon-china/surmon.me) By  Nuxt.js(Vue2) + Vuex
- Front end (Admin client): [angular-admin](https://github.com/surmon-china/angular-admin) By Angular4 + Bootstrap4
- App client: [surmon.me.native](https://github.com/surmon-china/surmon.me.native) By React native
- Build with Express + mongoose


## 文件目录

  - 入口文件

    ```
    index.js -> 主程序入口

    启动Express程序，启动并连接数据库，路由分发，引入配置
    ```

  - 配置文件

    ```
    np-config.js -> 主程序配置

    数据库配置（程序内部），全局使用（程序内部），其他配置（程序内部），基本信息（API输出）
    ```

  - 数据库

    ```
    np-mongo.js -> 数据库连接启动

    暴露数据库连接方法，以及包装后的mongoose对象
    ```

  - 路由

    ```
    np-routes.js -> 路由控制集合

    ```

  - 控制器

    ```
    np-controller -> 控制器

    ***.controller.js -> 各功能控制器

    ```

  - 数据模型

    ```
    np-model -> 数据模型

    ***.model.js -> 各功能数据模型，映射Mongoose对应的模型方法

    ```

  - 公共解析器

    ```
    np-utils/np-handle.js -> 请求处理器

    handleRequest -> API类型识别器
    handleError -> 控制器失败时解析函数
    handleSuccess -> 控制器成功时解析函数
    ```

  - 权限处理

    ```
    np-utils/np-auth.js -> 权限处理器
    
    权限验证方法，抽象出的对象
    首先会校验jwt的合理性，然后核对加密信息，核对时间戳
    ```

  - seo服务

    ```
    np-utils/np-sitemap.js -> 地图生成器
    
    网站地图xml生成，抽象出的对象
    包含Tag、Article、Category及一些死数据（页面）的集合，生成xml并写入本地
    实际上，在每次访问sitemap-api和有相关CRUD操作的时候都会被执行
    ```

  - 百度实时更新服务

    ```
    np-utils/np-baidu-push.js -> 自动根据操作通知百度蜘蛛
    
    分别会在文章、分类、标签、进行CUD的时候调用此类
    ```

  - 垃圾评论校验

    ```
    np-utils/np-akismet.js -> 使用akismet过滤spam
    
    本应该暴露三个方法：校验spam、提交spam、提交ham
    ```

  - 邮件服务

    ```
    np-utils/np-email.js -> 根据入参发送邮件
    
    程序启动时会自动校验，校验成功则根据入参发送邮件
    ```


## 接口概述

  - HTTP状态码
    * 401 权限不足
    * 403 权限不足
    * 404 项目中不存在
    * 405 无此方法
    * 500 服务器挂了
    * 200 正常

  - 数据特征码
    * code:
        * 1 正常
        * 0 异常
    * message:
        一般均会返回
    * debug:
        一般会返回错误发生节点的err
        在code为0的时候必须返回，方便调试
    * result:
        一定会返回，若请求为列表数据，一般返回`{ pagenation: {...}, data: {..} }`
        若请求具体数据，如文章，则包含直接数据如`{ title: '', content: ... }`


## 数据结构

  - 通用
    * extend 通用扩展
        文章、分类、tag表都包含extend字段，用于在后台管理中自定义扩展，类似于wordpress中的自定义字段功能，目前用来实现前台icon图标的class或者其他功能
    ···


  - 各种 CRUD 重要字段
    * name         - 名称
    * _id          - mongodb生成的id，一般用于后台执行CRUD操作
    * id           - 插件生成的自增数字id，类似mysql中的id，具有唯一性，用于前台获取数据
    * pid          - 父级ID，用于建立数据表关系，与id字段映射
    ···

  - 数据组成的三种可能
    * 数据库真实存在数据
    * mongoose支持的virtual虚拟数据
    * 计算数据

## Todos & Issues

- 驱动搜索引擎ping接口 文章发布后自动ping给搜索引擎xml
- ~~增加评论功能+黑名单，评论可自动校验spam，及黑名单（ip、邮箱、关键字的校验）~~
- ~~使用helmet + 手动优化，优化程序安全性~~
- ~~优化mongoose实例~~
- ~~优化数据表结构~~
- ~~更新数据时时间更新~~
- ~~修复时间检索失效~~
- ~~增加idle-gc内存回收~~
- ~~增加百度搜索引擎的实时提交~~
- ~~更新模块化别名~~
- ~~更新readme~~
- ~~rss订阅接口 https://github.com/dylang/node-rss~~
- ~~加入网站地图接口~~
- ~~网站地图由于缓存或者primise不能及时更新~~
- ~~网站地图的数据构成中文章需要筛选公开一发布的文章~~
- ~~对接百度统计开放平台api~~
- ~~密码存储需要使用md5加密机制~~
- ~~token... 等config信息使用node命令参数在shell中配置覆盖~~
- ~~lean 和 翻页插件一起使用，返回的id字段是_id bug~~
- ~~整理统一result的返回结构~~
- ~~围观后计数功能~~
- ~~多说转发热门文章接口~~
- ~~相关文章接口~~


## 开发命令

```bash
npm install

# 启动开发模式（需全局安装nodemon）
npm run dev

# 生产模式
npm start
pm2 start ecosystem.config.js
```


## 总项目架构

  - 服务端

    * [Express](http://www.expressjs.com.cn/ )

    * [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) JWT Json Web Token

  - 后台

    * [ng2-admin](https://akveo.github.io/ng2-admin/) [Angular 2](https://angular.cn/) MVVM

    * [Bootstrap 4](http://v4.bootcss.com/) UI

    * 富文本编辑器 
    
        - 最终使用CodeMirror实现了markdown编辑器

        - [ng2-quill-editor](https://github.com/surmon-china/ng2-quill-editor)
        
        - WebIDE （此项目中不再实现）

        - [Codiad](https://github.com/Codiad/Codiad) WebIDE

        - [CodeMirror](http://codemirror.net/) CodeMirror WebIDE

    * Other （此项目中不再实现）

        - [谷歌云输入法]() 云输入法

        - [Web Audio Editor](http://audiee.io/) 音频处理（剪切处理）

        - [webgl-filter](https://github.com/evanw/webgl-filter) WebGL 图片处理 - webgl-filter

        - [h5slides](https://github.com/Jinjiang/h5slides) h5slides 幻灯放映

        - [H5lock](https://github.com/lvming6816077/H5lock) H5手势解锁

        - [favico.js](http://lab.ejci.net/favico.js/) 网站通知徽标

        - [OS.js](https://github.com/os-js/OS.js) OS.js Web OS

        - [Antiscroll](https://github.com/Automattic/antiscroll) Dom代替原生滚动条

        - [APlayer](https://github.com/DIYgod/APlayer) APlayer音频播放器

        - [CommentCoreLibrary](https://github.com/jabbany/CommentCoreLibrary) JS栈弹幕解决方案

        - [CommentCoreLibrary](https://github.com/jabbany/CommentCoreLibrary) JS栈弹幕解决方案

  - 搜索引擎 （最终前端使用了Nuxt.js服务端首屏渲染）

    * [Prerender.io](https://prerender.io/) SEO

    * [Handlebars](http://handlebarsjs.com/) HTML 渲染

    * [Vue服务端渲染](https://vuefe.cn/guide/ssr.html)

  - 前台PC端 （仅参考）

    * [Vue2](http://cn.vuejs.org/) MVVM

    * [SOCKET.IO](http://socket.io/) 实时通讯

    * [HOWLER.JS](https://howlerjs.com/) 音频库

    * [Video.js](http://videojs.com/) 播放器

    * [vue-awesome-swiper](https://github.com/surmon-china/vue-awesome-swiper) 幻灯

  - 前台WAP端（基于PC端的CSS+Nuxt.js响应式实现）

    * [Vue2](http://cn.vuejs.org/) MVVM

    * [Vux](https://github.com/airyland/vux) UI

  - Android/IOS客户端（ReactNative实现）

    * [Weex](https://alibaba.github.io/weex/)

    * [NativeScript 2.0](https://www.nativescript.org/)

    * [React Native](http://reactnative.cn/)