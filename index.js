'use strict'

// node --harmony index.js

// import
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const mongoosePaginate = require('mongoose-paginate')

// app modules
const CONFIG = require('./np-config')
const mongodb = require('./np-mongo')
const app = express()

// controller
const controller = require('./np-controller')

// 连接数据库
mongodb()

// 翻页全局配置
mongoosePaginate.paginate.options = {
  limit: CONFIG.APP.LIMIT
}

// app config
app.set('port', CONFIG.APP.PORT)
app.use(bodyParser.json({ limit: '1mb' }))
app.use(bodyParser.urlencoded({
  extended: true
}))

// 拦截器
app.all('*', (req, res, next) => {

  // Set Header
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  res.header("Content-Type", "application/json;charset=utf-8")
  res.header("X-Powered-By", 'Nodepress 1.0.0')

  // OPTIONS
  if (req.method == 'OPTIONS') return res.send(200)

  // CheckAuth
  next()
})

// Api
app.get('/', (req, res) => {
  res.jsonp(CONFIG.INFO)
})

// Auth
app.all('/auth', controller.auth)

// 七牛Token
app.all('/qiniu', controller.qiniu)

// 全局option
// app.all('/option', controller.option.list)
// app.all('/option/:option_id', controller.option.item)

// Article
app.all('/article', controller.article.list)
app.all('/article/:article_id', controller.article.item)

// announcement
app.all('/announcement', controller.announcement.list)
app.all('/announcement/:announcement_id', controller.announcement.item)

// Category
app.all('/category', controller.category.list)
app.all('/category/:category_id', controller.category.item)

// Tag
app.all('/tag', controller.tag.list)
app.all('/tag/:tag_id', controller.tag.item)

// Page
// app.all('/page', controller.page.list)
// app.all('/page/:page_id', controller.page.item)

/*
// Search
app.all('/search', controller.search)
app.all('/search/:tag_id', controller.search)
*/

// 404
app.all('*', (req, res) => {
  res.status(404).jsonp({
    code: 0,
    message: '无效的API请求'
  })
})

// Start server
http.createServer(app).listen(app.get('port'), () => {
  console.log(`NodePress Run！port at ${app.get('port')}`)
})
