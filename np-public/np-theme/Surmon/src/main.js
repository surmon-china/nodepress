// es6引入模块

// Vue主程序
import Vue from 'vue'

// Vue - router
import Router from 'vue-router'

// filters
import { fromNow, toYMD, toHMS } from './filters/TimeFilter'
import { domain, textOverflow, numberFormat } from './filters/HtmlFilter'

// articles
import NewsView from './components/NewsView.vue'

// article - item
import ItemView from './components/ItemView.vue'

// user
import UserView from './components/UserView.vue'

// 主程序
import App from './components/App.vue'

// 启用路由
Vue.use(Router)

// 全局注册过滤器，(name obj)
Vue.filter('toYMD', toYMD)
Vue.filter('toHMS', toHMS)
Vue.filter('fromNow', fromNow)

Vue.filter('domain', domain)
Vue.filter('numberFormat', numberFormat)
Vue.filter('textOverflow', textOverflow)

// 实例化路由
var router = new Router()

// 全局路由
router.map({
  '/news/:page': {
    component: NewsView
  },
  '/user/:id': {
    component: UserView
  },
  '/item/:id': {
    component: ItemView
  }
})

// 路由每次变更
router.beforeEach(() => {
  window.scrollTo(0, 0)
})

// 路由重定向
router.redirect({
  '*': '/'
})

// 启动App
router.start(App, '#app')