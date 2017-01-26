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

const initAuth = (req, auth = {}) => {
	new Auth(auth).save(err => {
		if (err) return handleError({ res, err, message: '权限初始化失败' });
		handleSuccess({
      res,
      message: '用户权限操作成功',
      result: { name: '', slogan: '', gravatar: '' }
    })
	})
};

// 获取个人信息
authCtrl.GET = (req, res) => {
	Auth.find({}, '-_id name slogan gravatar', (err, docs) => {
		if (err) return handleError({ res, err, message: '获取失败' });
		if (!docs.length) initAuth(req);
		if (docs.length) {
			handleSuccess({
	      res,
	      message: '用户权限获取成功',
	      result: docs[0]
	    })
		}
	})
};

// 生成登陆口令Token
authCtrl.POST = ({ body: { password } }, res) => {
	Auth.find({}, '-_id password', (err, docs) => {
		if (err) return handleError({ res, err, message: '登录失败' });
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
			return handleError({ res, err, message: '来者何人？' });
		}
	})
};

// 修改权限和个人信息
authCtrl.PUT = ({ body, body: { name, slogan, gravatar, password, newPassword, relNewPassword }}, res) => {

	// 验证密码
	if (!!password && ((!newPassword || !relNewPassword) || !Object.is(newPassword, relNewPassword))) {
		return handleError({ res, message: '密码不一致或无效' });
	}

	if (!!password && (Object.is(password, newPassword) || Object.is(password, relNewPassword))) {
		return handleError({ res, message: '新旧密码不可一致' });
	}
	
	// doPutAuth
	const doPutAuth = _id => {
		Auth.findByIdAndUpdate(_id, body, (err, result) => {
	    err && handleError({ res, err, message: '用户权限修改失败' });
	    err || handleSuccess({
	      res,
	      result: { name, slogan, gravatar },
	      message: '用户权限修改成功'
	    })
	  })
	};

	// 修改前初始化
	Auth.find({}, '_id name slogan gravatar password', (err, docs) => {
		if (err) return handleError({ res, err, message: '修改前查询失败' });
		if (!docs.length) initAuth(req, body);
		if (docs.length) {
			if (!!password && Object.is(docs[0].password, password)) {
				handleError({ res, err, message: '原密码不正确' }); 
			} else {
				doPutAuth(docs[0]._id);
			}
		}
	})
};

// export
module.exports = (req, res) => { handleRequest({ req, res, controller: authCtrl })};
