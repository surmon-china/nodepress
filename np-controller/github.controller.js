/*
*
* Github控制器
*
*/

const request = require('request');
const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle');
const githubCtrl = {};

// 获取项目列表
githubCtrl.GET = (req, res) => {
  request({
    url: 'https://api.github.com/users/surmon-china/repos',
    headers: { 'User-Agent': 'request' }
  }, (err, response, body) => {
    console.log(body);
    if(!err && response.statusCode == 200) {
      handleSuccess({ res, result: JSON.parse(body), message: '项目列表获取成功' });
    } else {
      handleError({ res, err, message: '项目列表获取失败' });
    }
  })
};

// export
module.exports = (req, res) => { handleRequest({ req, res, controller: githubCtrl })};
