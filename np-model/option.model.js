/*
*
* 设置数据模型
*
*/

const mongoose = require('np-core/np-mongodb').mongoose;

const optionSchema = new mongoose.Schema({

	// 网站标题
	title:	{ type: String, required: true },

	// 网站副标题
	sub_title:	{ type: String, required: true },

	// 关键字
	keywords: [{ type: String }],

	// 网站描述
	description: String,

	// 站点地址
	site_url: { type: String, required: true },

	// 网站官邮
	site_email: String,

	// 备案号
	site_icp: String,

	// 搜索引擎ping
	ping_sites: [{ type: String, validate: /\S+/ }],

	// 黑名单
	blacklist: {
		ips: [{ type: String, validate: /\S+/ }],
		mails: [{ type: String, validate: /\S+/ }],
		keywords: [{ type: String, validate: /\S+/ }]
	},

	// 其他元信息
	meta: {
		
		// 被喜欢次数
		likes: { type: Number, default: 0 }
	}
});

const Option = mongoose.model('Option', optionSchema);
module.exports = Option;
