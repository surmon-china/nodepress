
// API类型识别器
exports.commonApiMethod = options => {
  let api = options.api;
  let req = options.req;
  let res = options.res;
  let type = options.type;
  let method = req.method;
  let support = !!api[type] && !!api[type][method];
  support && api[type][method](req, res);
  support || res.jsonp({ code: 0, message: '不支持该请求类型！' });
};

// 控制器请求器
exports.commonCtrlPromise = options => {

  let req = options.req;
  let res = options.res;
  let method = options.method;
  let error_msg = options.error_msg;
  let success_msg = options.success_msg;
  let controller = options.controller;
  let success_callback = options.success || (data => { res.jsonp({ code: 1, message: success_msg, result: data })});
  let error_callback = options.success || (err => { res.jsonp({ code: 0, message: err.message || error_msg, debug: err.debug || null })});

  controller[method]({
    body: req.body,
    query: req.query,
    params: req.params,
    error: error_callback,
    success: success_callback
  });
};

// 数据层请求器
exports.commonModelPromise = options => {

  let model = options.model;
  let method = options.method;
  let params = options.params;
  let error = options.error;
  let success = options.success;
  let callback = options.callback;

  let callback_all = (err, data) => {
    err && !!error && error({ debug: err });
    !err && !!success && success(data);
    !!callback && callback(err, data);
  };

  if (!params) model[method](callback_all);
  if (!!params) model[method](params, callback_all);
  if (!!params && params.length > 1) model[method](params[0], params[1], callback_all);
  
};