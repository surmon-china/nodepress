/*
*
* 权限控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle');
const Auth = require('np-model/auth.model');
const config = require('np-config');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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
	.then(([auth = { password: md5Decode(config.AUTH.DEFAULT_PASSWORD) }]) => {
		if (Object.is(md5Decode(password), auth.password)) {
			const token = jwt.sign({
			  data: config.AUTH.data,
			  exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
			}, config.AUTH.jwtTokenSecret);
			handleSuccess({ res, result: { token }, message: '登陆成功' });
		} else {
			handleError({ res, err, message: '来者何人!' });
		}
	})
	.catch(err => {
		handleError({ res, err, message: '登录失败' });
	})
};

// 修改权限和个人信息
authCtrl.PUT = ({ body: auth }, res) => {

	// 初始化
	let { name, slogan, gravatar, password, new_password, rel_new_password } = auth;

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
	.then(([_auth = { password: md5Decode(config.AUTH.DEFAULT_PASSWORD) }]) => {
		if (!!password && !Object.is(_auth.password, md5Decode(password))) {
			handleError({ res, message: '原密码不正确' }); 
		} else {
			if (!auth.password) delete auth.password;
			if (auth.rel_new_password) auth.password = md5Decode(auth.rel_new_password);
			return (_auth._id ? Auth.findByIdAndUpdate(_auth._id, auth, { new: true }) : new Auth(auth).save())
		}
	})
	.then(({ name, slogan, gravatar } = auth) => {
		handleSuccess({ res, result: { name, slogan, gravatar }, message: '用户权限修改成功' });
	})
	.catch(err => {
		handleError({ res, err, message: '用户权限修改失败' });
	})
};

// export
module.exports = (req, res) => { handleRequest({ req, res, controller: authCtrl })};
