
// API分发
var configApi  = require('./apis/config.api');
var articleApi = require('./apis/article.api');

// 接口暴露
exports.config  = configApi;
exports.article = articleApi;