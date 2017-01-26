/*
*
* 设置控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('../np-handle');
const Auth = require('../np-model/auth.model');
const optionCtrl = {};

// 获取权限
optionCtrl.GET = (req, res) => {
  console.log('来获取权限了');
};

// 修改权限
optionCtrl.PUT = ({ body }, res) => {
  console.log(body);
};

// export
module.exports = (req, res) => { handleRequest({ req, res, controller: optionCtrl })};
