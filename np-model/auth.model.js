/**
 * Auth model module.
 * @file 权限和用户数据模型
 * @module model/auth
 * @author Surmon <https://github.com/surmon-china>
 */

const crypto = require('crypto')
const config = require('app.config')
const { mongoose } = require('np-core/np-mongodb')

const authSchema = new mongoose.Schema({

	// 名字
	name: { type: String, default: '' },

	// 签名
	slogan: { type: String, default: '' },

	// 头像
	gravatar: { type: String, default: '' },

	// 密码
	password: { 
		type: String, 
		default: crypto.createHash('md5').update(config.AUTH.defaultPassword).digest('hex')
	}
})

module.exports = mongoose.model('Auth', authSchema)
