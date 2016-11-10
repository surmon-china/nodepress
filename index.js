'use strict'

// node --harmony index.js

// import
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const mongoosePaginate = require('mongoose-paginate')

// app modules
const CONFIG = require('./np-config')
const route = require('./np-route')
const mongodb = require('./np-mongo')
const app = express()

// 连接数据库
mongodb()

// 翻页全局配置
mongoosePaginate.paginate.options = {
  limit: 12
}

// app config
app.set('port', 8000)
app.use(bodyParser())

// 拦截器
app.all('*', (req, res, next) => {

  // Set Header
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  res.header("X-Powered-By", 'Nodepress 1.0.0')
  res.header("Content-Type", "application/json;charset=utf-8")

  // OPTIONS
  if (req.method == 'OPTIONS') return res.send(200)

  // CheckAuth
  next()
})

// Api
app.get('/', (req, res) => {
  res.jsonp(CONFIG.INFO)
})

// 全局option
app.all('/option', route.option.list)
app.all('/option/:option_id', route.option.item)

// menu菜单
// app.all('/menu', route.menu.list)
// app.all('/menu/:menu_id', route.menu.item)

// Article
app.all('/article', route.article.list)
app.all('/article/:article_id', route.article.item)

// Category
app.all('/category', route.category.list)
app.all('/category/:category_id', route.category.item)

// Tag
app.all('/tag', route.tag.list)
app.all('/tag/:tag_id', route.tag.item)

// Page
app.all('/page', route.page.list)
app.all('/page/:page_id', route.page.item)

/*
// Search
app.all('/search', route.search)
app.all('/search/:tag_id', route.search)
*/

// 404
app.all('*', (req, res) => {
  res.jsonp({
    code: 0,
    message: 'API不存在'
  })
})

// Start server
http.createServer(app).listen(app.get('port'), () => {
  console.log(`NodePress Run！port at ${app.get('port')}`)
})
