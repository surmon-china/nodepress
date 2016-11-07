// 数据库模块
const mongoose = require('mongoose')
const config   = require('./np-config')
const mongodb  = mongoose.connection

// 数据库
const db = () => {

  // 连接数据库
  mongoose.connect(config.MONGODB.uri)

  // 连接错误
  mongodb.on('error', error => {
    console.log(error)
  })

  // 连接成功
  mongodb.once('open', () => {
    console.log('mongoose 连接成功!')
    // 进一步处理，判断是否已初始化，执行初始化操作
  })

  return mongodb
}

module.exports = db
