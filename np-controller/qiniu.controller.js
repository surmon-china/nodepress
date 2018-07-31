/*
*
* 七牛控制器
*
*/

const qiniu = require('qn');
const config = require('app.config');
const { handleRequest, handleSuccess } = require('np-utils/np-handle');

const client = qiniu.create(config.QINIU);
const qiniuCtrl = {};

// 获取配置列表
qiniuCtrl.GET = (req, res) => {
	const result = { uptoken: client.uploadToken() };
  handleSuccess({ res, result, message: 'upToken 获取成功' });
};

module.exports = (req, res) => { handleRequest({ req, res, controller: qiniuCtrl })};
