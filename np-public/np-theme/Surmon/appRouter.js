/*
*
* 路由模块
*
*/

// Index
import IndexView from './components/index/IndexView.vue'

// Articles
import ArticleView from './components/article/detail/DetailView.vue'

export default router => {
  router.map({
    '/': {
      name: 'index',
      component: IndexView
    },
    '/article/:article_slug': {
      name: 'article',
      component: ArticleView
    },
    /*
    '/article': {
      component: ArticleView
      component: {
        template: '<p>Hello from /b</p>'
        template: '<router-view></router-view>'
      },
      subRoutes: {
        // 当路径是 /article/:article_id 时进行渲染
        '/:article_id': { component: { template: 'D' }},
        // 当路径是 /c/e 时进行渲染
        '/e': { component: { template: 'E' }}
      }
    }
    */
  })

  // 路由重定向
  router.redirect({
    '*': '/'
  })

  // 路由每次变更
  router.beforeEach(() => {

    /*
    window.scrollTo(0, 0)

    // 登录中间验证，页面需要登录而没有登录的情况直接跳转登录
    if (transition.to.auth) {
      if (localStorage.userId) {
          transition.next();
      } else {
          var redirect = encodeURIComponent(transition.to.path);
          transition.redirect('/login?redirect=' + redirect);
      }
    } else {
      transition.next();
    }

    */
  })
}