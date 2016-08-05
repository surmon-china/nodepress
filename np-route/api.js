
// API分发
var optionApi  = require('./apis/option.api');
var articleApi = require('./apis/article.api');
var categoryApi = require('./apis/category.api');
var tagApi = require('./apis/tag.api');
var pageApi = require('./apis/page.api');

// 接口暴露
exports.option  = optionApi;
exports.article  = articleApi;
exports.category = categoryApi;
exports.tag = tagApi;
exports.page = pageApi;