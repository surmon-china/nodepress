/*
*
* 分类API
*
*/

// 分类控制器、控制器请求器、请求类型识别器
var categoryApi       = { list: {}, item: {} };
var commonApiMethod   = require('../../np-common').commonApiMethod;
var commonCtrlPromise = require('../../np-common').commonCtrlPromise;
var categoryCtrl      = require('../../np-controller/category.controller');

// 获取分类列表
categoryApi.list.GET = (req, res) => {
  commonCtrlPromise({ req: req, res: res, controller: categoryCtrl, method: 'getList', success_msg: '分类列表获取成功', error_msg: '分类列表获取失败' });
};

// 发布分类
categoryApi.list.POST = (req, res) => {
  commonCtrlPromise({ req: req, res: res, controller: categoryCtrl, method: 'postItem', success_msg: '分类发布成功', error_msg: '分类发布失败' });
};

// 批量删除分类
categoryApi.list.DELETE = (req, res) => {
  commonCtrlPromise({ req: req, res: res, controller: categoryCtrl, method: 'delList', success_msg: '分类批量删除成功', error_msg: '分类批量删除失败' });
};

// 获取单个分类以及所有有关的分类
categoryApi.item.GET = (req, res) => {
  commonCtrlPromise({ req: req, res: res, controller: categoryCtrl, method: 'getItem', success_msg: '单个分类获取成功', error_msg: '单个分类获取失败' });
};

// 修改单个分类
categoryApi.item.PUT = (req, res) => {
  commonCtrlPromise({ req: req, res: res, controller: categoryCtrl, method: 'putItem', success_msg: '单个分类修改成功', error_msg: '单个分类修改失败' });
};

// 删除单个分类
categoryApi.item.DELETE = (req, res) => {
  commonCtrlPromise({ req: req, res: res, controller: categoryCtrl, method: 'delItem', success_msg: '单个分类删除成功', error_msg: '单个分类删除失败' });
};

// 模块暴露
exports.list = (req, res) => { commonApiMethod({ req: req, res: res, type: 'list', api: categoryApi })};
exports.item = (req, res) => { commonApiMethod({ req: req, res: res, type: 'item', api: categoryApi })};