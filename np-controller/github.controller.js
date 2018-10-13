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
const { handleSuccess } = require('np-core/np-processor')

// 获取远程项目列表
;((function getGithubRepositories() {
	request({
		url: `https://api.github.com/users/${CONFIG.GITHUB.username}/repos`,
		headers: { 'User-Agent': 'request' }
	}, (err, response, body) => {
		if (!err && response.statusCode == 200) {
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
			// consola.success('项目列表获取成功', peojects)
			redis.set('github-projects', peojects)
		} else {
			consola.warn('项目列表获取失败', 'err:', err, 'body:', body)
		}
		// 无论成功失败都定时更新，10 分钟一次
		setTimeout(getGithubRepositories, 1000 * 60 * 10)
	})
})())

// 获取内存中项目列表数据
module.exports = (req, res) => {
	redis.get('github-projects', (err, result) => {
		handleSuccess({ res, result, message: '项目列表获取成功' })
	})
}
