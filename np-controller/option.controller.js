/*
*
* 设置控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('../np-handle');
const Option = require('../np-model/option.model');
const optionCtrl = {};

// 获取权限
optionCtrl.GET = (req, res) => {
  Option.find({})
  .then(([result = {}]) => {
		handleSuccess({ res, result, message: '配置项获取成功' });
  })
  .catch(err => {
  	handleError({ res, err, message: '配置项获取失败' });
  });
};

// 修改权限
optionCtrl.PUT = ({ body: options, body: { _id } }, res) => {
  if (!_id) delete options._id;
  (!!_id ? Option.findByIdAndUpdate(_id, options, { new: true }) : new Option(options).save())
  .then((result = options) => {
		handleSuccess({ res, result, message: '配置项修改成功' });
  })
  .catch(err => {
  	handleError({ res, err, message: '配置项修改失败' });
  })
};

// export
module.exports = (req, res) => { handleRequest({ req, res, controller: optionCtrl })};
