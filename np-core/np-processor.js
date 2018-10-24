/**
 * Handle module.
 * @file 路由统一解析器模块
 * @module utils/handle
 * @author Surmon <https://github.com/surmon-china>
 */

const { isString, isArray } = require('np-helper/np-data-validate')

// 控制器初始化器
exports.initController = params => {
	if (!params) {
		return {}
	} else if (isString(params)) {
		return { [params]: {} }
	} else if (isArray(params)) {
		return Object.assign({}, ...params.map(k => ({ [k]: {} })))
	}
}

// 控制器包装器
exports.buildController = controller => {
	return (req, res) => {
		return exports.handleRequest({ req, res, controller })
	}
}

// 处理请求
exports.handleRequest = ({ req, res, controller }) => {
	const method = req.method
	controller[method]
		? controller[method](req, res)
		: res.status(405).jsonp({ code: 0, message: '不支持该请求类型！' })
}

// 处理成功
exports.handleSuccess = ({ res, result = null, message = '请求成功' }) => {
	res.jsonp({ code: 1, message, result })
}

// 处理错误
exports.handleError = ({ res, err = null, message = '请求失败', code }) => {
	const json = { code: 0, message, debug: err }
	code ? res.status(code).jsonp(json) : res.jsonp(json)
}

// 更友好的成功处理
exports.humanizedHandleSuccess = (res, message) => {
	return result => {
		return exports.handleSuccess({ res, result, message })
	}
}

// 更友好的错误处理
exports.humanizedHandleError = (res, message, code) => {
	return err => {
		return exports.handleError({ res, err, message, code })
	}
}

// 处理翻页数据
exports.handlePaginateData = data => ({
	data: data.docs,
	pagination: {
		total: data.total,
		current_page: data.page,
		total_page: data.pages,
		per_page: data.limit
	}
})
