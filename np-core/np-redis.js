/**
 * Redis module.
 * @file Redis 模块
 * @module core/redis
 * @author Surmon <https://github.com/surmon-china>
 */

const redis = require('redis')
const consola = require('consola')
const schedule = require('node-schedule')
const { isString } = require('np-helper/np-data-validate')

const memoryClient = {}
let redisClient = null
let redisIsAvailable = false

const connectRedis = () => {

	exports.redis = redisClient = redis.createClient({ detect_buffers: true })

	redisClient.on('error', err => {
		redisIsAvailable = false
		consola.warn('Redis连接失败！', err)
	})

	redisClient.on('ready', _ => {
		redisIsAvailable = true
		consola.ready('Redis已准备好！')
	})

	redisClient.on('reconnecting', _ => {
		consola.info('Redis正在重连！')
	})

	return redisClient
}

// set -> Promise
const hommizationSet = (key, value) => {
	return new Promise((resolve, reject) => {
		if (redisIsAvailable) {
			if (!isString(value)) {
				try {
					value = JSON.stringify(value)
				} catch (err) {
					value = value.toString()
				}
			}
			redisClient.set(key, value)
			return resolve(true)
		} else {
			memoryClient[key] = value
			return resolve(true)
		}
	})
}

// get -> Promise
const hommizationGet = key => {
	return new Promise((resolve, reject) => {
		if (!redisIsAvailable) {
			return resolve(memoryClient[key])
		} else {
			redisClient.get(key, (err, value) => {
				try {
					value = JSON.parse(value)
				} catch (error) {
					value = value.toString()
				}
				return err ? reject(err) : resolve(value)
			})
		}
	})
}

// promise -> redis
const hommizationPromise = options => {

	const { key, promise, ioMode = false } = options

	// 执行任务
	const doPromise = (resolve, reject) => {
		return promise()
			.then(data => {
				hommizationSet(key, data)
				resolve(data)
			})
			.catch(reject)
	}

	// Promise 拦截模式
	const handlePromiseMode = () => {
		return new Promise((resolve, reject) => {
			hommizationGet(key)
				.then(value => {
					value !== null && value !== undefined
						? resolve(value)
						: doPromise(resolve, reject)
				})
				.catch(reject)
		})
	}

	// 双向同步模式
	const handleIoMode = () => ({
		get: handlePromiseMode,
		update: () => new Promise(doPromise)
	})

	return ioMode ? handleIoMode() : handlePromiseMode()
}

// 定时或间隔时间
const hommizationInterval = options => {

	const { key, promise, timeout, timing } = options

	// 超时任务
	if (timeout) {
		((function promiseTask() {
			promise()
				.then(data => {
					hommizationSet(key, data)
					setTimeout(promiseTask, timeout.success)
				})
				.catch(err => {
					setTimeout(promiseTask, timeout.error || timeout.success)
				})
		})())
	}

	// 定时任务
	if (timing) {
		const promiseTask = () => {
			promise()
				.then(data => hommizationSet(key, data))
				.catch(err => setTimeout(promiseTask, timing.error))
		}
		promiseTask()
		schedule.scheduleJob(timing.schedule, promiseTask)
	}
	
	// 返回 Redis 获取器
	return () => hommizationGet(key)
}

exports.redis = redisClient
exports.set = hommizationSet
exports.get = hommizationGet
exports.connect = connectRedis
exports.promise = hommizationPromise
exports.interval = hommizationInterval
