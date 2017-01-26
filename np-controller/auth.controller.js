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
	Auth.find({}, '-_id name slogan gravatar', (err, docs) => {
		if (err) {
			handleError({ res, err, message: '获取失败' });
			return false;
		}
		if (!docs.length) {
			new Auth().save(err => {
				if (err) {
					handleError({ res, err, message: '获取失败' });
					return false;
				} else {
					handleSuccess({
			      res,
			      message: '用户权限获取成功',
			      result: { data: { name: '', slogan: '', gravatar: '' }}
			    })
				}
			})
		} else {
			handleSuccess({
	      res,
	      message: '用户权限获取成功',
	      result: { data: docs[0] }
	    })
		}
	})
};

// 生成登陆口令Token
authCtrl.POST = ({ body: { password } }, res) => {
	Auth.find({}, (err, docs) => {
		// console.log(docs);
		if (err) {
			handleError({ res, err, message: '登录失败' });
			return false;
		}
		if (Object.is(password, (docs.length ? docs[0].password : config.APP.DEFAULT_PASSWORD))) {
			const token = jwt.sign({
			  data: config.AUTH.data,
			  exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
			}, config.AUTH.jwtTokenSecret);
			handleSuccess({
	      res,
	      message: '登陆成功',
	      result: { token }
	    })
		} else {
			return handleError({ res, err, message: '口令不正确' });
		}
	})
};

// 修改权限和个人信息
authCtrl.PUT = ({ name, slogan, gravatar, password, newPassword, relNewPassword }, res) => {
	console.log({ name, slogan, gravatar, password, newPassword, relNewPassword });
};

// 销毁登陆口令
authCtrl.DELETE = (req, res) => {

};

// export
module.exports = (req, res) => { handleRequest({ req, res, controller: authCtrl })};
