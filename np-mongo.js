// 数据库模块
const mongoose = require('mongoose')
const config   = require('./np-config')
const init   = require('./np-init')
const mongodb  = mongoose.connection

// 数据库
const db = () => {

  // 连接数据库
  mongoose.connect(config.MONGODB.uri)

  // 连接错误
  mongodb.on('error', error => {
    console.log('数据库连接失败!', error)
  })

  // 连接成功
  mongodb.once('open', () => {
    console.log('数据库连接成功!')
    init()
  })

  return mongodb
}

module.exports = db
