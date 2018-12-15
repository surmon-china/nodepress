/**
 * Mongoose module.
 * @file 数据库模块
 * @module core/mongoose
 * @author Surmon <https://github.com/surmon-china>
 */

const console = require('console')
const CONFIG = require('app.config')
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const autoIncrement = require('mongoose-auto-increment')

// remove DeprecationWarning
mongoose.set('useFindAndModify', false)

// plugin options
mongoosePaginate.paginate.options = {
  limit: CONFIG.APP.LIMIT
}

// mongoose Promise
mongoose.Promise = global.Promise

// mongoose
exports.mongoose = mongoose

// connect
exports.connect = () => {

  // 连接数据库
  mongoose.connect(CONFIG.MONGODB.uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    promiseLibrary: global.Promise
  })

  // 连接错误
  mongoose.connection.on('error', error => {
    console.warn('数据库连接失败!', error)
  })

  // 连接成功
  mongoose.connection.once('open', () => {
    console.ready('数据库连接成功!')
  })

  // 自增 ID 初始化
  autoIncrement.initialize(mongoose.connection)
  
  // 返回实例
  return mongoose
}
