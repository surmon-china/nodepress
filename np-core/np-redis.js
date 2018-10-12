/**
 * Redis module.
 * @file Redis 模块
 * @module core/redis
 * @author Surmon <https://github.com/surmon-china>
 */

const redis = require('redis')
const consola = require('consola')

const memoryClient = {}
let redisAvailable = false
let redisClient = null

exports.redis = null

exports.set = (key, value, callback) => {
	if (redisAvailable) {
		// consola.log('into redis')
		if (typeof value !== 'string') {
			try {
				value = JSON.stringify(value)
			} catch (err) {
				value = value.toString()
			}
		}
		redisClient.set(key, value, callback)
	} else {
		// consola.log('into memory')
		memoryClient[key] = value
	}
}

exports.get = (key, callback) => {
	if (redisAvailable) {
		redisClient.get(key, (err, value) => {
			try {
				value = JSON.parse(value)
			} catch (error) {
				// value = value
			}
			callback(err, value)
		})
	} else {
		callback(null, memoryClient[key])
		return memoryClient[key]
	}
}

exports.connect = () => {

	exports.redis = redisClient = redis.createClient({ detect_buffers: true })

	redisClient.on('error', err => {
		redisAvailable = false
		consola.warn('Redis连接失败！', err)
	})

	redisClient.on('ready', err => {
		redisAvailable = true
		consola.ready('Redis已准备好！')
	})

	redisClient.on('reconnecting', err => {
		consola.info('Redis正在重连！')
	})

	return redisClient
}

