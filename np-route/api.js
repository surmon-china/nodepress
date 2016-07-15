
// API分发
var optionApi  = require('./apis/option.api');
var articleApi = require('./apis/article.api');

// 接口暴露
exports.option  = optionApi;
exports.article = articleApi;