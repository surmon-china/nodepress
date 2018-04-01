/*
*
* 七牛控制器
*
*/

const qiniu = require('qn');
const config = require('app.config');
const { handleRequest } = require('np-utils/np-handle');

const client = qiniu.create(config.QINIU);
const qiniuCtrl = {};

// 获取配置列表
qiniuCtrl.GET = (req, res) => {
	res.jsonp({ uptoken: client.uploadToken() });
};

module.exports = (req, res) => { handleRequest({ req, res, controller: qiniuCtrl })};
