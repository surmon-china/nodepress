/* 公共解析器 */

exports.handleRequest = ({ req, res, controller }) => {
  const method = req.method;
  const support = !!controller[method];
  support && controller[method](req, res);
  support || res.status(405).jsonp({ code: 0, message: '不支持该请求类型！' });
};

exports.handleError = ({ res, message = '请求失败', err = null }) => {
  res.jsonp({ code: 0, message, debug: err });
};

exports.handleSuccess = ({ res, message = '请求成功', result = null }) => {
  res.jsonp({ code: 1, message, result });
};
