/**
 * Mongoose module.
 * @file 数据库模块
 * @module core/mongoose
 * @author Surmon <https://github.com/surmon-china>
 */

const mongoose = require('mongoose')
const config = require('app.config')
const consola = require('consola')
const autoIncrement = require('mongoose-auto-increment')

mongoose.Promise = global.Promise

exports.mongoose = mongoose
exports.connect = () => {

	// 连接数据库
	mongoose.connect(config.MONGODB.uri, {
		useNewUrlParser: true,
		promiseLibrary: global.Promise
	})

	// 连接错误
	mongoose.connection.on('error', error => {
		consola.warn('数据库连接失败!', error)
	})

	// 连接成功
	mongoose.connection.once('open', () => {
		consola.ready('数据库连接成功!')
		// 自增 ID 初始化
		autoIncrement.initialize(mongoose.connection)
	})

	return mongoose
}
