/*
*
* 权限控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('../np-handle')
const Auth = require('../np-model/auth.model')
let authCtrl= {}

// 获取权限和个人信息
authCtrl.POST = ({ body }, res) => {
}

// 修改权限和个人信息
authCtrl.PUT = ({ body }, res) => {
	console.log(body);
}

// export
module.exports = (req, res) => { handleRequest({ req, res, controller: authCtrl })}
