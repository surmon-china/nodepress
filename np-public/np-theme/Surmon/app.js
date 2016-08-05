/*
*
* 主程序模块
*
*/

// Vue主程序
import Vue from 'vue'
import Router from 'vue-router'
import RouterMap from './appRouter'
import Resource from 'vue-resource'
import VueAsyncData from 'vue-async-data'

// filters
import { fromNow, toYMD, toHMS } from './filters/TimeFilter.js'
import { domain, textOverflow, numberFormat } from './filters/HtmlFilter.js'

// 主程序
import App from './App.vue'

// 注册插件
Vue.use(Router)
Vue.use(Resource)
Vue.use(VueAsyncData)

// 注册过滤器，(name obj)
// Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));
// Object.keys(filter).forEach(function(k) {
//   Vue.filter(k, filter[k]);
// });
// Vue.filter('toYMD', toYMD)
// Vue.filter('toHMS', toHMS)
// Vue.filter('fromNow', fromNow)

// Vue.filter('domain', domain)
// Vue.filter('numberFormat', numberFormat)
// Vue.filter('textOverflow', textOverflow)

//directive
// var directive = require('./directive')

// Object.keys(directive).forEach(function(k) {
//   Vue.directive(k, directive[k]);
// });

// 路由 -> http://router.vuejs.org/zh-cn/options.html
const router = new Router({
  history: true,
  saveScrollPosition: false,
  transitionOnLoad: true
})

// 全局路由 -> http://router.vuejs.org/zh-cn/api/map.html
RouterMap(router);

// 启动App
router.start(App, 'app')