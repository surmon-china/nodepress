/*
*
* 设置控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle');
const Option = require('np-model/option.model');
const optionCtrl = {};

// 获取权限
optionCtrl.GET = (req, res) => {
	Option.findOne({})
	.then((result = {}) => {
		handleSuccess({ res, result, message: '配置项获取成功' });
	})
	.catch(err => {
		handleError({ res, err, message: '配置项获取失败' });
	});
};

// 修改权限
optionCtrl.PUT = ({ body: options, body: { _id }}, res) => {
	if (!_id) delete options._id;
	// 检测黑名单和ping地址列表不能存入空元素
	options.ping_sites = (options.ping_sites || []).filter(t => !!t);
	options.blacklist.ips = (options.blacklist.ips || []).filter(t => !!t);
	options.blacklist.mails = (options.blacklist.mails || []).filter(t => !!t);
	options.blacklist.keywords = (options.blacklist.keywords || []).filter(t => !!t);
	(!!_id ? Option.findByIdAndUpdate(_id, options, { new: true }) : new Option(options).save())
	.then((result = options) => {
		handleSuccess({ res, result, message: '配置项修改成功' });
	})
	.catch(err => {
		handleError({ res, err, message: '配置项修改失败' });
	})
};

// export
module.exports = (req, res) => { handleRequest({ req, res, controller: optionCtrl })};
