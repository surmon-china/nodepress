/**
 * Routes module.
 * @file Routes 模块
 * @module core/routes
 * @author Surmon <https://github.com/surmon-china>
 */

const CONFIG = require('app.config')
const controller = require('np-controller')
const authIsVerified = require('np-utils/np-auth')
const { isProdMode, isDevMode } = require('environment')

const routes = app => {

  // 拦截器
  app.all('*', (req, res, next) => {

    
  })

  // api
  app.get('/', (req, res) => {
    res.jsonp(CONFIG.INFO)
  })

  // auth
  app.all('/auth', controller.auth)

  // 七牛 token
  app.all('/qiniu', controller.qiniu)

  // 全局 option
  app.all('/option', controller.option)

  // 常量配置
  app.get('/constants', controller.constants)

  // sitemap
  app.get('/sitemap.xml', controller.sitemap)

  // like
  app.post('/like', controller.like)

  // github
  app.get('/github', controller.github)

  // statistic
  app.get('/statistic', controller.statistic)

  // wallpaper
  app.get('/wallpaper/list', controller.wallpaper.list)
  app.get('/wallpaper/story', controller.wallpaper.story)

  // music
  app.get('/music/pic/:pic_id', controller.music.pic)
  app.get('/music/lrc/:song_id', controller.music.lrc)
  app.get('/music/url/:song_id', controller.music.url)
  app.get('/music/song/:song_id', controller.music.song)
  app.get('/music/list/:play_list_id', controller.music.list)

  // tag
  app.all('/tag', controller.tag.list)
  app.all('/tag/:tag_id', controller.tag.item)

  // category
  app.all('/category', controller.category.list)
  app.all('/category/:category_id', controller.category.item)

  // comment
  app.all('/comment', controller.comment.list)
  app.all('/comment/:comment_id', controller.comment.item)

  // article
  app.all('/article', controller.article.list)
  app.all('/article/:article_id', controller.article.item)

  // announcement
  app.all('/announcement', controller.announcement.list)
  app.all('/announcement/:announcement_id', controller.announcement.item)

  // 404
  app.all('*', (req, res) => {
    res.status(404).jsonp({
      code: 0,
      message: '无效的API请求'
    })
  })
}

module.exports = routes
