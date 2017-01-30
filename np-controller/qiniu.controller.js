/*
*
* 七牛控制器
*
*/

const { handleRequest } = require('../np-handle');
const config = require('../np-config');
const qiniu = require('qn');
const client = qiniu.create(config.QINIU);
const qiniuCtrl = {};

// 获取配置列表
qiniuCtrl.GET = (req, res) => {
  res.jsonp({ uptoken: client.uploadToken() });
}

module.exports = (req, res) => { handleRequest({ req, res, controller: qiniuCtrl })};
