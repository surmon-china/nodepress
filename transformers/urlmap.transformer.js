"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTagUrl = getTagUrl;
exports.getCategoryUrl = getCategoryUrl;
exports.getArticleUrl = getArticleUrl;
exports.getPageUrl = getPageUrl;
exports.getPermalink = getPermalink;
const app_config_1 = require("../app.config");
const pages_constant_1 = require("../constants/pages.constant");
function getTagUrl(tagSlug) {
    return `${app_config_1.APP_BIZ.FE_URL}/tag/${tagSlug}`;
}
function getCategoryUrl(categorySlug) {
    return `${app_config_1.APP_BIZ.FE_URL}/category/${categorySlug}`;
}
function getArticleUrl(articleId) {
    return `${app_config_1.APP_BIZ.FE_URL}/article/${articleId}`;
}
function getPageUrl(pageId) {
    return `${app_config_1.APP_BIZ.FE_URL}/${pages_constant_1.PAGES_ID[pageId]}`;
}
function getPermalink(targetType, targetId) {
    return targetType === 'article' ? getArticleUrl(targetId) : getPageUrl(targetId);
}
//# sourceMappingURL=urlmap.transformer.js.map