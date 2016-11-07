
// API类型识别器
exports.ApiMethod = ({ api, req, res, type }) => {
  const method = req.method
  const support = !!api[type] && !!api[type][method]
  support && api[type][method](req, res)
  support || res.jsonp({ code: 0, message: '不支持该请求类型！' })
}

// 控制器请求器
exports.ControllerPromise = ({ req, res, controller, method, success, error, success_msg, error_msg }) => {
  success = success || (data => { res.jsonp({ code: 1, message: success_msg, result: data })})
  error = error || (err => { res.jsonp({ code: 0, message: err.message || error_msg, debug: err.debug || null })})
  controller[method]({
    body: req ? (req.body || {}) : {},
    query: req ? (req.query || {}) : {},
    params: req ? (req.params || {}) : {},
    error, success
  })
}

/*

// 数据层请求器
exports.commonModelPromise = options => {

  let model = options.model
  let method = options.method
  let params = options.params
  let error = options.error
  let success = options.success
  let callback = options.callback

  let callback_all = (err, data) => {
    err && !!error && error({ debug: err })
    !err && !!success && success(data)
    !!callback && callback(err, data)
  }

  if (!params) model[method](callback_all)
  if (!!params) model[method](params, callback_all)
  if (!!params && params.length > 1) model[method](params[0], params[1], callback_all)

}
*/
