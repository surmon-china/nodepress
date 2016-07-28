## NodePress V1.1.0 开发者文档

----------

> Author By Surmon Surmon@foxmail.com
> 
> Site: http://surmon.me

----------

## 接口及流程

  - 公共资源目录
  
    ```
    REQUEST:    /[*resources]
    DIR:        /np-public/
    ROUTE:    
                /np-route/view.js
            -> /np-public/np-theme/Surmon
    ```

  - 前台目录
    
    ```
    REQUEST:    /
    OR:         /!*admin/***
    DIR:        /np-public/np-theme/[theme-dir]
    ROUTE:    
                /np-route/view.js
            -> /np-public/np-theme/Surmon
    ```
    
  - 后台目录
    
    ```
    REQUEST:    /admin
    OR:     /admin/***/***/***
    DIR:    /np-public/np-admin
    ROUTE:    
            /np-route/view.js
        -> /np-public/np-admin
    ```

  - API
        
    ```
    BASE:    /api
    ALL:        /api/***
    ROUTE:    
            /np-route/api.js
        -> /np-route/apis/***.api.js
        -> /np-controller/***.controller.js
        -> /np-model/***.model.js
    ```

----------

## 文件目录

  - 入口文件
    
    ```
    index.js -> 主程序入口
    
    启动Express程序，启动并连接数据库，路由分发，引入配置
    
    TODO: 配置检测，程序安装检测，数据库检测，待完善
    ```
    
  - 配置文件
    
    ```
    np-config.js -> 主程序配置
    
    数据库配置（程序内部），全局使用（程序内部），基本信息
    
    TODO: 配置检测，程序安装检测，待完善
    ```
    
  - 数据库
    
    ```
    np-mongo.js -> 数据库连接启动
    
    连接并启动数据库
    
    TODO: 连接失败时前台应该可以得到提示
    ```
    
  - 公共封装函数
    
    ```
    np-common.js -> api/ctrl/model公共函数
    
    commonApiMethod -> API类型识别器
    
    commonCtrlPromise -> 控制器请求器
    
    commonModelPromise -> 数据层请求器
    
    TODO: 数据层请求器会导致控制器方法语义不清晰
    ```
    
  - 路由
    
    ```
    np-route -> 路由文件夹
    
    api.js -> API路由
    
    view.js -> 视图路由
    
    apis/***.api.js -> 各功能API
    
    ```

  - 控制器
    
    ```
    np-controller -> 控制器文件夹
    
    ***.controller.js -> 各功能控制器
    
    ```
    
  - 数据模型
    
    ```
    np-model -> 数据模型文件夹
    
    ***.model.js -> 各功能数据模型，映射Mongoose对应的模型方法
    
    ```
    
  - 静态文件
    
    ```
    np-public -> 静态内容文件夹
    
    np-spider -> 蜘蛛访问渲染模板
    
    np-theme ->  PC端前台输出目录
    
    np-admin ->  PC端后台输出目录
    
    np-update -> 站内上传文件目录
    
    np-plugin -> 程序插件目录
    
    ```


----------

## 全站接口

  - 文章分类
  
    * 获取分类列表：

    ```
    API: /api/category  GET
    REMARK: 数组形式返回，需客户端自己组装嵌套数据
    ```

    * 添加分类：
    
    ```
    API: /api/category  POST
    DATA: {
        name: '分类名称',
        slug: 'cate_slug',
        pid: 'objectID' || null,
        description: '分类描述'
    }
    REMARK: pid和描述非必填项
    TODU: slug需具备唯一性，缺乏验证限制
    ```

    * 批量删除分类：
    
    ```
    API: /api/category  DELETE
    DATA: {
        categories: 'objectID,objectID,objectID,...'
    }
    ```
    
    * 获取单个分类（以及此分类上级关系）：
    
    ```
    API: /api/category/:category_id  GET
    PATH: {
        category_id: 'objectID'
    }
    REMARK: 数组形式返回，从前到后，分别是此分类的最高父级至自身
    ```
    
    * 修改单个分类：
    
    ```
    API: /api/category/:category_id  PUT
    DATA: {
        name: '分类名称',
        slug: 'cate_slug',
        pid: 'objectID' || null,
        description: '分类描述'
    }
    REMARK: 修改后返回最新数据，pid非必填，pid值应为objID || 0 || false || null
    TODU: slug需具备唯一性，缺乏验证限制
    ```
    
    * 删除单个分类：
    
    ```
    API: /api/category/:category_id  DELETE
    PATH: {
        category_id: 'objectID'
    }
    REMARK: 删除一个分类后，如果此分类包含子分类，则会将自己的子分类的pid自动更正为自己之前的pid或者NULL
    ```
    
----------

## 程序架构

  - 服务端
  
    * [Express](http://www.expressjs.com.cn/ )

    * [Express Generator](https://www.npmjs.com/package/express-generator) 中间件
    
    * [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) Auth Token

  - 后台
  
    * [ng2-admin](https://akveo.github.io/ng2-admin/)

    * [Bootstrap 4](http://v4.bootcss.com/)
        
    * [Angular 2](https://angular.cn/)
        
    * JQuery
        
  - 前台PC端
  
    * [Vue.js](http://cn.vuejs.org/) MVVM

    * [VueStrap](http://yuche.github.io/vue-strap/) UI
    
    * [SOCKET.IO](http://socket.io/) 实时通讯
    
    * [HOWLER.JS](https://howlerjs.com/) 音频库
    
    * [Video.js](http://videojs.com/) 播放器
        
  - 前台WAP端
  
    * [Vue.js](http://cn.vuejs.org/) MVVM

    * [Vux](https://github.com/airyland/vux) UI
        
  - Android/IOS客户端
  
    * [NativeScript 2.0](https://www.nativescript.org/)

    * [React Native](http://reactnative.cn/)


----------

## 插件机制

----------


## 主题机制

>  np-public/np-theme/[theme-dir] 应用主题
>  
>  np-public/np-spider/ 蜘蛛渲染输出

