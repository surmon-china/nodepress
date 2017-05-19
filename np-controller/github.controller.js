/*
*
* Github控制器
*
*/

const redis = require('np-redis');
const request = require('request');
const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle');
const githubCtrl = {};

// 获取远程项目列表
const getGithubRepositories = () => {
  request({
    url: 'https://api.github.com/users/surmon-china/repos',
    headers: { 'User-Agent': 'request' }
  }, (err, response, body) => {
    if(!err && response.statusCode == 200) {
      redis.set('github-projects', body);
    } else {
      console.warn('项目列表获取失败', 'err:', err, 'body:', body);
    }
    // 无论成功失败都定时更新，10分钟一次
    setTimeout(getGithubRepositories, 1000 * 60 * 10);
  })
}

getGithubRepositories();

// 获取项目列表
githubCtrl.GET = (req, res) => {
  redis.get('github-projects', (err, github_projects) => {
    handleSuccess({ res, result: github_projects, message: '项目列表获取成功' });
  })
};

// export
module.exports = (req, res) => { handleRequest({ req, res, controller: githubCtrl })};
