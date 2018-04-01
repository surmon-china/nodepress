/*
*
* 路由统一解析器
*
*/

exports.handleRequest = ({ req, res, controller }) => {
	const method = req.method;
	const support = !!controller[method];
	support && controller[method](req, res);
	support || res.status(405).jsonp({ code: 0, message: '不支持该请求类型！' });
};

exports.handleError = ({ res, message = '请求失败', err = null, code }) => {
	if (code) {
		res.status(code).jsonp({ code: 0, message, debug: err });
	} else {
		res.jsonp({ code: 0, message, debug: err });
	}
};

exports.handleSuccess = ({ res, message = '请求成功', result = null }) => {
	res.jsonp({ code: 1, message, result });
};

exports.handleThrottle = (method, delay) => {
	let canRun = true;
	return () => {
		if (canRun) {
			canRun = false;
			method();
			setTimeout(function() {
			 	canRun = true;
			}, delay);
		}
	}
};
