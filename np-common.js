// comment
exports.handleRequest = ({ req, res, controller }) => {
  const method = req.method
  const support = !!controller[method]
  support && controller[method](req, res)
  support || res.status(405).jsonp({ code: 0, message: '不支持该请求类型！' })
}

exports.handleError = ({ res, message, err }) => {
  res.jsonp({
    code: 0,
    message: message || '请求失败',
    debug: err || null
  })
}

exports.handleSuccess = ({ res, message, data }) => {
  res.jsonp({
    code: 1,
    message: message || '请求成功',
    result: data || null
  })
}
