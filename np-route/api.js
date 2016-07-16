
// API分发
var optionApi  = require('./apis/option.api');
var articleApi = require('./apis/article.api');
var categoryApi = require('./apis/category.api');

// 接口暴露
exports.option  = optionApi;
exports.article  = articleApi;
exports.category = categoryApi;