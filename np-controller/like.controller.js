/*
*
* 点赞功能控制器
*
*/

const { handleError, handleSuccess } = require('np-utils/np-handle');
const config = require('np-config');

module.exports = (req, res) => {
	console.log(req.body)
	res.jsonp({ code: 1, message: '点赞成功', result: {}});
};
