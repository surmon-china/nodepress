/*
*
* 全局设置API模块
*
*/

// 依赖配置控制器
const CONFIG   = require('../../np-config');
var configCtrl = require(CONFIG.APP.ROOT_PATH + '/np-controller/config.controller');
var configApi  = {};

// 获取配置数据
configApi.GET = (req, res) => {
  configCtrl.get({
    query: req.query,
    success: data => {
      res.jsonp({ 
        code: 1, 
        message: '全局设置获取成功',
        result: data
      });
    },
    error: err => { 
      res.jsonp({ code: 0, message: '全局设置获取失败' }) 
    }
  });
};

// 修改配置数据
configApi.PUT = (req, res) => {
  res.jsonp({ code: 1, message: '全局配置更新成功' });
};

// 类型识别
configApi.method = (req, res) => {
  let method = req.method;
  let support = !!configApi[method];
  if (support) configApi[method](req, res);
  if (!support) res.jsonp({ code: 0, message: '请求不支持！' });
};

// 模块暴露
exports.all = configApi.method;