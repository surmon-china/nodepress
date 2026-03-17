"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARTICLE_HOTTEST_SORT_CONFIG = exports.ARTICLE_LISTED_PUBLIC_FILTER = exports.ARTICLE_PUBLIC_FILTER = exports.ArticleLanguage = exports.ArticleOrigin = exports.ArticleStatus = void 0;
const sort_constant_1 = require("../../constants/sort.constant");
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
exports.ARTICLE_PUBLIC_FILTER = Object.freeze({
    status: ArticleStatus.Published
});
exports.ARTICLE_LISTED_PUBLIC_FILTER = Object.freeze({
    ...exports.ARTICLE_PUBLIC_FILTER,
    unlisted: false
});
exports.ARTICLE_HOTTEST_SORT_CONFIG = Object.freeze({
    'stats.comments': sort_constant_1.SortOrder.Desc,
    'stats.likes': sort_constant_1.SortOrder.Desc
});
//# sourceMappingURL=article.constant.js.map