"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermalinkByID = exports.getGuestbookPageUrl = exports.getArticleUrl = exports.getCategoryUrl = exports.getTagUrl = void 0;
const biz_constant_1 = require("../constants/biz.constant");
const APP_CONFIG = __importStar(require("../app.config"));
function getTagUrl(tagSlug) {
    return `${APP_CONFIG.APP.FE_URL}/tag/${tagSlug}`;
}
exports.getTagUrl = getTagUrl;
function getCategoryUrl(categorySlug) {
    return `${APP_CONFIG.APP.FE_URL}/category/${categorySlug}`;
}
exports.getCategoryUrl = getCategoryUrl;
function getArticleUrl(articleId) {
    return `${APP_CONFIG.APP.FE_URL}/article/${articleId}`;
}
exports.getArticleUrl = getArticleUrl;
function getGuestbookPageUrl() {
    return `${APP_CONFIG.APP.FE_URL}/guestbook`;
}
exports.getGuestbookPageUrl = getGuestbookPageUrl;
function getPermalinkByID(id) {
    return id === biz_constant_1.GUESTBOOK_POST_ID ? getGuestbookPageUrl() : getArticleUrl(id);
}
exports.getPermalinkByID = getPermalinkByID;
//# sourceMappingURL=urlmap.transformer.js.map