/**
 * GithubCtrl module.
 * @file Github 控制器模块
 * @module controller/github
 * @author Surmon <https://github.com/surmon-china>
 */

const request = require('request')
const consola = require('consola')
const CONFIG = require('app.config')
const redis = require('np-core/np-redis')
const { REDIS_CACHE_FIELDS } = require('np-core/np-constants')
const { humanizedHandleSuccess, humanizedHandleError } = require('np-core/np-processor')

// redis 任务
const redisGithubCache = redis.interval({
	key: REDIS_CACHE_FIELDS.github,
	timeout: {
		// 成功后 1小时 获取数据
		success: 1000 * 60 * 60,
		// 失败后 5分钟 获取数据
		error: 1000 * 60 * 5
	},
	promise() {
		return new Promise((resolve, reject) => {
			request({
				url: `https://api.github.com/users/${CONFIG.GITHUB.username}/repos?per_page=1000`,
				headers: { 'User-Agent': 'request' }
			}, (err, response, body) => {
				if (!err && response.statusCode == 200) {
					try {
						const peojects = JSON.parse(body).map(rep => {
							return {
								html_url: rep.html_url,
								name: rep.name || ' ',
								fork: rep.fork,
								forks: rep.forks,
								forks_count: rep.forks_count,
								description: rep.description || ' ',
								open_issues_count: rep.open_issues_count,
								stargazers_count: rep.stargazers_count,
								created_at: rep.created_at,
								language: rep.language
							}
						})
						return resolve(peojects)
					} catch (error) {
						consola.warn('github 控制器解析为 JSON 失败', body)
						return reject(body)
					}
				} else {
					consola.warn('项目列表获取失败', 'err:', err, 'body:', body)
					return reject(err)
				}
			})
		})
	}
})

// 获取内存中项目列表数据
module.exports = (req, res) => {
	redisGithubCache()
		.then(humanizedHandleSuccess(res, '项目列表获取成功'))
		.catch(humanizedHandleError(res, '项目列表获取失败'))
}
