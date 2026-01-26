"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARTICLE_HOTTEST_SORT_CONFIG = exports.ARTICLE_LIST_QUERY_GUEST_FILTER = exports.ARTICLE_LIST_QUERY_PROJECTION = exports.ARTICLE_FULL_QUERY_REF_POPULATE = exports.ARTICLE_ORIGINS = exports.ARTICLE_LANGUAGES = exports.ARTICLE_STATUSES = exports.ArticleLanguage = exports.ArticleOrigin = exports.ArticleStatus = void 0;
const biz_constant_1 = require("../../constants/biz.constant");
var ArticleStatus;
(function (ArticleStatus) {
    ArticleStatus[ArticleStatus["Draft"] = 0] = "Draft";
    ArticleStatus[ArticleStatus["Published"] = 1] = "Published";
    ArticleStatus[ArticleStatus["Private"] = 2] = "Private";
    ArticleStatus[ArticleStatus["Trash"] = -1] = "Trash";
})(ArticleStatus || (exports.ArticleStatus = ArticleStatus = {}));
var ArticleOrigin;
(function (ArticleOrigin) {
    ArticleOrigin[ArticleOrigin["Original"] = 0] = "Original";
    ArticleOrigin[ArticleOrigin["Reprint"] = 1] = "Reprint";
    ArticleOrigin[ArticleOrigin["Hybrid"] = 2] = "Hybrid";
})(ArticleOrigin || (exports.ArticleOrigin = ArticleOrigin = {}));
var ArticleLanguage;
(function (ArticleLanguage) {
    ArticleLanguage["English"] = "en";
    ArticleLanguage["Chinese"] = "zh";
    ArticleLanguage["Multiple"] = "mul";
})(ArticleLanguage || (exports.ArticleLanguage = ArticleLanguage = {}));
exports.ARTICLE_STATUSES = [
    ArticleStatus.Draft,
    ArticleStatus.Published,
    ArticleStatus.Private,
    ArticleStatus.Trash
];
exports.ARTICLE_LANGUAGES = [
    ArticleLanguage.English,
    ArticleLanguage.Chinese,
    ArticleLanguage.Multiple
];
exports.ARTICLE_ORIGINS = [ArticleOrigin.Original, ArticleOrigin.Reprint, ArticleOrigin.Hybrid];
exports.ARTICLE_FULL_QUERY_REF_POPULATE = ['categories', 'tags'];
exports.ARTICLE_LIST_QUERY_PROJECTION = { content: false };
exports.ARTICLE_LIST_QUERY_GUEST_FILTER = Object.freeze({
    status: ArticleStatus.Published
});
exports.ARTICLE_HOTTEST_SORT_CONFIG = Object.freeze({
    'stats.comments': biz_constant_1.SortOrder.Desc,
    'stats.likes': biz_constant_1.SortOrder.Desc
});
//# sourceMappingURL=article.constant.js.map