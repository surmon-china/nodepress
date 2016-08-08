### Demo

<a target="_blank" href="http://akveo.com/ng2-admin/">Live Demo</a>

## Angular 1.x 版本 

[Blur Admin](http://akveo.github.io/blur-admin/)

## Angular 2 版本（当前使用）&& Documentation

[ng2-Admin](https://akveo.github.io/ng2-admin/)

## Based on
Angular 2, Bootstrap 4, Webpack and lots of awesome modules and plugins

## Can I hire you guys?
Yes!  Visit [our homepage](http://akveo.com/) or simply leave us a note to [contact@akveo.com](mailto:contact@akveo.com). We will be happy to work with you!

## Features
* TypeScript
* Webpack
* Responsive layout
* High resolution
* Bootstrap 4 CSS Framework
* Sass
* Angular 2
* jQuery
* Charts (Chartist, Chart.js)
* Maps (Google, Leaflet, amMap)
* and many more!

### 文件架构

config 开发配置

docs 文档

src 工程

  - index.html 入口文件

  - main.browser.ts 主程序入口

  - polyfills.browser.ts 兼容包

  - vendor.browser.ts 程序框架

  - custom.browser.ts 其他扩展

  - assets 资源文件夹

  - platform 平台文件夹

  - app 程序文件夹

    * index.ts 程序入口

    * app.scss

    * app.state.ts 好像是状态中转

    * app.routes.ts 路由文件，引入page组件里面定义的路由

    * app.loader.ts 加载器Scss 可能是用来做初始化或者监听的

    * app.component.ts app入口组件啊就像Vue.App

    * page （页面文件夹 => 对应一个组件）

      - ui  （公用UI组件）

        * components 组件

      - pages.routes.ts 总路由和左侧菜单配置

    * theme（一些公用的东西）

      - components 公用组件

      - directives 公用指令

      - pipes      管道 - 貌似是代替过滤器的东西

      - services   公用服务（一些异步类的数据处理，包括HTTP）

      - validators 验证器
