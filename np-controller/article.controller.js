/*
 *
 * 文章API
 *
 */

// 文章控制器、控制器请求器、请求类型识别器
const { ApiMethod, ControllerPromise } = require('../np-handle')
const controller = require('../np-controller/article.controller')

let articleApi = { list: {}, item: {} }

// 获取文章列表
articleApi.list.GET = (req, res) => {
	ControllerPromise({
		req, res, controller,
		method: 'getList',
		success_msg: '文章列表获取成功',
		error_msg: '文章列表获取失败'
	})
}

// 发布文章
articleApi.list.POST = (req, res) => {
	ControllerPromise({
		req, res, controller,
		method: 'postItem',
		success_msg: '文章发布成功',
		error_msg: '文章发布失败'
	})
}

// 批量更新文章
articleApi.list.PUT = function(req, res) {
	ControllerPromise({
		req, res, controller,
		method: 'putList',
		success_msg: '文章发布成功',
		error_msg: '文章发布失败'
	})
}

// 批量删除文章
articleApi.list.DELETE = (req, res) => {
	ControllerPromise({
		req, res, controller,
		method: 'delList',
		success_msg: '文章批量删除成功',
		error_msg: '文章批量删除失败'
	})
}

// 获取单篇文章 + 所有有关的文章 + 文章相关信息
articleApi.item.GET = (req, res) => {
	ControllerPromise({
		req, res, controller,
		method: 'getItem',
		success_msg: '单篇文章获取成功',
		error_msg: '单篇文章获取失败'
	})
}

// 修改单篇文章
articleApi.item.PUT = (req, res) => {
	ControllerPromise({
		req, res, controller,
		method: 'putItem',
		success_msg: '单篇文章修改成功',
		error_msg: '单篇文章修改失败'
	})
}

// 删除单篇文章
articleApi.item.DELETE = (req, res) => {
	ControllerPromise({
		req, res, controller,
		method: 'delItem',
		success_msg: '单篇文章删除成功',
		error_msg: '单篇文章删除失败'
	})
}

// 模块暴露
exports.list = (req, res) => {
	ApiMethod({ req, res, type: 'list', api: articleApi })
}
exports.item = (req, res) => {
	ApiMethod({ req, res, type: 'item', api: articleApi })
}
