/*
*
* Github控制器
*
*/

const request = require('request')
const config = require('app.config');
const redis = require('np-core/np-redis')
const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle')

const githubCtrl = {}

// 获取远程项目列表
const getGithubRepositories = () => {
	request({
		url: `https://api.github.com/users/${config.GITHUB.username}/repos`,
		headers: { 'User-Agent': 'request' }
	}, (err, response, body) => {
		if(!err && response.statusCode == 200) {
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
			redis.set('github-projects', peojects)
		} else {
			console.warn('项目列表获取失败', 'err:', err, 'body:', body)
		}
		// 无论成功失败都定时更新，10分钟一次
		setTimeout(getGithubRepositories, 1000 * 60 * 10)
	})
}

getGithubRepositories()

// 获取项目列表
githubCtrl.GET = (req, res) => {
	redis.get('github-projects', (err, github_projects) => {
		handleSuccess({ res, result: github_projects, message: '项目列表获取成功' })
	})
}

// export
module.exports = (req, res) => { handleRequest({ req, res, controller: githubCtrl })}
