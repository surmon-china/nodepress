
// API类型识别器
exports.ApiMethod = ({ api, req, res, type }) => {
  const method = req.method
  const support = !!api[type] && !!api[type][method]
  support && api[type][method](req, res)
  support || res.status(405).jsonp({ code: 0, message: '不支持该请求类型！' })
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
