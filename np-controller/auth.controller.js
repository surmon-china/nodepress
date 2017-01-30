/*
*
* 权限控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('../np-handle');
const Auth = require('../np-model/auth.model');
const config = require('../np-config');
const jwt = require('jsonwebtoken');
const authCtrl = {};

// 获取个人信息
authCtrl.GET = (req, res) => {
	Auth.find({}, '-_id name slogan gravatar')
	.then(([result = {}]) => {
		handleSuccess({ res, result, message: '用户权限获取成功' });
	})
	.catch(err => {
		handleError({ res, err, message: '获取失败' });
	})
};

// 生成登陆口令Token
authCtrl.POST = ({ body: { password }}, res) => {
	Auth.find({}, '-_id password')
	.then(([auth = { password: config.AUTH.DEFAULT_PASSWORD }]) => {
		if (Object.is(password, auth.password)) {
			const token = jwt.sign({
			  data: config.AUTH.data,
			  exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
			}, config.AUTH.jwtTokenSecret);
			handleSuccess({ res, result: { token }, message: '登陆成功' });
		} else {
			handleError({ res, err, message: '来者何人？' });
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
	
	// doPutAuth
	const doPutAuth = _id => {
		if (!auth.password) delete auth.password;
		if (auth.rel_new_password) auth.password = auth.rel_new_password;
		(_id ? Auth.findByIdAndUpdate(_id, auth, { new: true }) : new Auth(auth).save())
		.then(({ name, slogan, gravatar } = auth) => {
			handleSuccess({ res, result: { name, slogan, gravatar }, message: '用户权限修改成功' });
		})
		.catch(err => {
			handleError({ res, err, message: '用户权限修改失败' });
		})
	};

	// 修改前查询验证
	Auth.find({}, '_id name slogan gravatar password')
	.then(([auth = { password: config.AUTH.DEFAULT_PASSWORD }]) => {
		if (!!password && !Object.is(auth.password, password)) {
			handleError({ res, message: '原密码不正确' }); 
		} else {
			doPutAuth(auth._id);
		}
	})
	.catch(err => {
		handleError({ res, err, message: '修改权限失败' });
	})
};

// export
module.exports = (req, res) => { handleRequest({ req, res, controller: authCtrl })};
