/*
*
* 权限控制器
*
*/

const config = require('app.config');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Base64 = require('js-base64').Base64;

const Auth = require('np-model/auth.model');

const authIsVerified = require('np-utils/np-auth');
const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle');

const authCtrl = {};

// md5编码
const md5Decode = pwd => {
	return crypto.createHash('md5').update(pwd).digest('hex');
};

// 获取个人信息
authCtrl.GET = (req, res) => {
	Auth.find({}, '-_id name slogan gravatar')
	.then(([result = {}]) => {
		handleSuccess({ res, result, message: '用户资料获取成功' });
	})
	.catch(err => {
		handleError({ res, err, message: '获取失败' });
	})
};

// 生成登陆口令Token
authCtrl.POST = ({ body: { password }}, res) => {
	Auth.find({}, '-_id password')
	.then(([auth = { password: md5Decode(config.AUTH.defaultPassword) }]) => {
		password = password ? Base64.decode(password) : password;
		if (Object.is(md5Decode(password), auth.password)) {
			const token = jwt.sign({
			  data: config.AUTH.data,
			  exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
			}, config.AUTH.jwtTokenSecret);
			handleSuccess({ res, result: { token }, message: '登陆成功' });
		} else {
			handleError({ res, message: '来者何人!' });
		}
	})
	.catch(err => handleError({ res, err, message: '登录失败' }));
};

// 检查 Token 的有效性
authCtrl.PATCH = (req, res) => {
	if (authIsVerified(req)) {
		handleSuccess({ res, result: true, message: 'Token 验证成功' });
	} else {
		handleError({ res, result: false, code: 403, message: 'Token 验证不通过!' });
	}
};

// 修改权限和个人信息
authCtrl.PUT = ({ body: auth }, res) => {

	// 初始化
	let { name, slogan, gravatar, password, new_password, rel_new_password } = auth;

	// 密码解码
	password = password ? Base64.decode(password) : password;
	new_password = new_password ? Base64.decode(new_password) : new_password;
	rel_new_password = rel_new_password ? Base64.decode(rel_new_password) : rel_new_password;

	// 验证密码
	if (!!password && ((!new_password || !rel_new_password) || !Object.is(new_password, rel_new_password))) {
		handleError({ res, message: '密码不一致或无效' });
		return false;
	};

	if (!!password && [new_password, rel_new_password].includes(password)) {
		handleError({ res, message: '新旧密码不可一致' });
		return false;
	};
	
	// 修改前查询验证
	Auth.find({}, '_id name slogan gravatar password')
	.then(([_auth = { password: md5Decode(config.AUTH.defaultPassword) }]) => {
		if (!!password && !Object.is(_auth.password, md5Decode(password))) {
			handleError({ res, message: '原密码不正确' });
		} else {
			if (rel_new_password) {
				auth.password = md5Decode(rel_new_password);
				delete auth.new_password;
				delete auth.rel_new_password;
			}
			(_auth._id ? Auth.findByIdAndUpdate(_auth._id, auth, { new: true }) : new Auth(auth).save())
			.then(({ name, slogan, gravatar } = auth) => {
				handleSuccess({ res, result: { name, slogan, gravatar }, message: '用户权限修改成功' });
			})
			.catch(err => handleError({ res, err, message: '用户权限修改失败' }));
		}
	}).catch(err => handleError({ res, err, message: '用户权限修改失败' }));
};

// export
module.exports = (req, res) => { handleRequest({ req, res, controller: authCtrl })};
