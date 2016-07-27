/*
*
* 文章API
*
*/

// 文章控制器、控制器请求器、请求类型识别器
var articleApi        = { list: {}, item: {} };
var commonApiMethod   = require('../../np-common').commonApiMethod;
var commonCtrlPromise = require('../../np-common').commonCtrlPromise;
var articleCtrl       = require('../../np-controller/article.controller');

// 获取文章列表
articleApi.list.GET = (req, res) => {
  commonCtrlPromise({ req: req, res: res, controller: articleCtrl, method: 'getList', success_msg: '文章列表获取成功', error_msg: '文章列表获取失败' });
};

// 发布文章
articleApi.list.POST = (req, res) => {
  commonCtrlPromise({ req: req, res: res, controller: articleCtrl, method: 'postItem', success_msg: '文章发布成功', error_msg: '文章发布失败' });
};

// 批量更新文章
articleApi.list.PUT = function(req, res){
  commonCtrlPromise({ req: req, res: res, controller: articleCtrl, method: 'putList', success_msg: '文章发布成功', error_msg: '文章发布失败' });
};

// 批量删除文章
articleApi.list.DELETE = (req, res) => {
  commonCtrlPromise({ req: req, res: res, controller: articleCtrl, method: 'delList', success_msg: '文章批量删除成功', error_msg: '文章批量删除失败' });
};

// 获取单篇文章 + 所有有关的文章 + 文章相关信息
articleApi.item.GET = (req, res) => {
  commonCtrlPromise({ req: req, res: res, controller: articleCtrl, method: 'getItem', success_msg: '单篇文章获取成功', error_msg: '单篇文章获取失败' });
};

// 修改单篇文章
articleApi.item.PUT = (req, res) => {
  commonCtrlPromise({ req: req, res: res, controller: articleCtrl, method: 'putItem', success_msg: '单篇文章修改成功', error_msg: '单篇文章修改失败' });
};

// 删除单篇文章
articleApi.item.DELETE = (req, res) => {
  commonCtrlPromise({ req: req, res: res, controller: articleCtrl, method: 'delItem', success_msg: '单篇文章删除成功', error_msg: '单篇文章删除失败' });
};

// 模块暴露
exports.list = (req, res) => { commonApiMethod({ req: req, res: res, type: 'list', api: articleApi })};
exports.item = (req, res) => { commonApiMethod({ req: req, res: res, type: 'item', api: articleApi })};