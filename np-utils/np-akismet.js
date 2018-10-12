/**
 * Akismet spam module.
 * @file akismet-spam 反垃圾
 * @module utils/akismet
 * @author Surmon <https://github.com/surmon-china>
 */

const consola = require('consola')
const config = require('app.config')
const akismet = require('akismet-api')

let clientIsValid = false

const client = akismet.client({
	key: config.AKISMET.key,
	blog: config.AKISMET.blog
})

// check key
client.verifyKey().then(valid => {
	clientIsValid = valid
	if (valid) {
		consola.ready(`Akismet key 有效，已准备好工作!`)
	} else {
		consola.warn(`Akismet key 无效，无法工作!`)
	}
}).catch(err => {
	consola.warn('Akismet VerifyKey Error:', err.message)
})

// check spam
const checkSpam = comment => {
	consola.info('Akismet 验证评论中...', new Date())
	return new Promise((resolve, reject) => {
		if (clientIsValid) {
			client.checkSpam(comment).then(spam => {
				if (spam) {
					consola.warn('Akismet 验证不通过!', new Date())
					reject(new Error('spam!'))
				} else {
					consola.info('Akismet 验证通过', new Date())
					resolve(spam)
				}
			}).catch(err => {
				resolve(err)
			})
		} else {
			consola.warn('Akismet key 未认证，放弃验证')
			resolve('akismet key Invalid!')
		}
	})
}

// submit Interceptor
const handleCommentInterceptor = handle_type => {
	return comment => {
		if (clientIsValid) {
			consola.info(`Akismet ${handle_type}...`, new Date())
			client[handle_type](comment).then(result => {
				consola.info(`Akismet ${handle_type} success!`)
			}).catch(err => {
				consola.warn(`Akismet ${handle_type} failed!`, err)
			})
		} else {
			consola.warn('Akismet key Invalid!')
		}
	}
}

// akismet client
const akismetClient = {

	// check spam
	checkSpam,

	// submit spam
	submitSpam: handleCommentInterceptor('submitSpam'),

	// submit ham
	submitHam: handleCommentInterceptor('submitHam')
}

exports.akismet = akismet
exports.akismetClient = akismetClient
