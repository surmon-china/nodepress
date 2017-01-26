/*
*
* 权限和用户数据模型
*
*/

const mongoose = require('mongoose');
const config = require('../np-config');
const authSchema = new mongoose.Schema({

	// 名字
  name: { type: String, default: '' },

  // 签名
  slogan: { type: String, default: '' },

  // 头像
  gravatar: { type: String, default: '' },

  // 密码
  password: { type: String, default: config.APP.DEFAULT_PASSWORD }
});

const Auth = mongoose.model('Auth', authSchema);
module.exports = Auth;
