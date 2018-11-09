/**
 * AuthCtrl module.
 * @file 权限控制器模块
 * @module controller/auth
 * @author Surmon <https://github.com/surmon-china>
 */

const CONFIG = require('app.config')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { Base64 } = require('js-base64')
const Auth = require('np-model/auth.model')
const authIsVerified = require('np-utils/np-auth')
const {
	handleError,
	handleSuccess,
	humanizedHandleError,
	buildController,
	initController
} = require('np-core/np-processor')

// controller
const AuthCtrl = initController()

// 密码编码
const decodePassword = pwd => pwd ? Base64.decode(pwd) : pwd

// md5编码
const md5Decode = password => {
	return crypto.createHash('md5').update(password).digest('hex')
}

// 获取个人信息
AuthCtrl.GET = (req, res) => {
	Auth.find({}, '-_id name slogan gravatar')
		.then(([result = {}]) => {
			handleSuccess({ res, result, message: '用户资料获取成功' })
		})
		.catch(humanizedHandleError(res, '用户资料获取失败'))
}

// 生成登陆口令 Token
AuthCtrl.POST = ({ body: { password }}, res) => {
	Auth.find({}, '-_id password')
<<<<<<< HEAD
		.then(([auth = { password: md5Decode(CONFIG.AUTH.defaultPassword) }]) => {
=======
		.then(([auth]) => {
			auth = auth || {}
			auth.password = auth.password || md5Decode(CONFIG.AUTH.defaultPassword)
>>>>>>> a345f161df5de5012b9be4202c8049860ffcd00b
			if (md5Decode(decodePassword(password)) === auth.password) {
				const token = jwt.sign({
					data: CONFIG.AUTH.data,
					exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
				}, CONFIG.AUTH.jwtTokenSecret)
				handleSuccess({ res, result: { token }, message: '登陆成功' })
			} else {
				handleError({ res, message: '来者何人!' })
			}
		})
		.catch(humanizedHandleError(res, '登录失败'))
}

// 检查 Token 的有效性
AuthCtrl.PATCH = (req, res) => {
	authIsVerified(req)
		? handleSuccess({ res, result: true, message: 'Token 验证成功' })
		: handleError({ res, result: false, code: 403, message: 'Token 验证不通过!' })
}

// 修改权限和个人信息
AuthCtrl.PUT = ({ body: auth }, res) => {

	// 初始化
	let { password, new_password, rel_new_password } = auth

	// 密码解码
	password = decodePassword(password)
	new_password = decodePassword(new_password)
	rel_new_password = decodePassword(rel_new_password)

	// 验证密码
	if (password || new_password || rel_new_password) {
		if ((!new_password || !rel_new_password) || new_password !== rel_new_password) {
			return handleError({ res, message: '密码不一致或无效' })
		}
		if ([new_password, rel_new_password].includes(password)) {
			return handleError({ res, message: '新旧密码不可一致' })
		}
	}
	
	// 修改前查询验证
	Auth.find({}, '_id name slogan gravatar password')
		.then(([_auth]) => {

			// 初始默认密码
			_auth.password = _auth.password || md5Decode(CONFIG.AUTH.defaultPassword)

			if (password) {
				// 判断旧密码是否一致
				if (_auth.password !== md5Decode(password)) {
					return handleError({ res, message: '原密码不正确' })
				}
				// 新密码赋值
				if (rel_new_password) {
					auth.password = md5Decode(rel_new_password)
					Reflect.deleteProperty(auth, 'new_password')
					Reflect.deleteProperty(auth, 'rel_new_password')
				}
			}

			(_auth._id
				? Auth.findByIdAndUpdate(_auth._id, auth, { new: true })
				: new Auth(auth).save()
			)
			.then(({ name, slogan, gravatar } = auth) => {
				handleSuccess({ res, result: { name, slogan, gravatar }, message: '用户权限修改成功' })
			})
			.catch(humanizedHandleError(res, '用户权限修改失败'))
		}).catch(humanizedHandleError(res, '用户权限修改失败'))
}

module.exports = buildController(AuthCtrl)
