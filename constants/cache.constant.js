"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefreshTokenCacheKey = exports.getInvalidatedTokenCacheKey = exports.getUserAuthStateCacheKey = exports.GlobalCacheKey = void 0;
var GlobalCacheKey;
(function (GlobalCacheKey) {
    GlobalCacheKey["DailyArticleViewCount"] = "daily-article-view-count";
    GlobalCacheKey["PublicOptions"] = "public-options";
    GlobalCacheKey["PublicAdminProfile"] = "public-admin-profile";
    GlobalCacheKey["PublicAllArticles"] = "public-all-articles";
    GlobalCacheKey["PublicAllCategories"] = "public-all-categories";
    GlobalCacheKey["PublicAllTags"] = "public-all-tags";
})(GlobalCacheKey || (exports.GlobalCacheKey = GlobalCacheKey = {}));
const getUserAuthStateCacheKey = (key) => {
    return `auth:user-oauth-state:${key}`;
};
exports.getUserAuthStateCacheKey = getUserAuthStateCacheKey;
const getInvalidatedTokenCacheKey = (key) => {
    return `auth:invalidated-token:${key}`;
};
exports.getInvalidatedTokenCacheKey = getInvalidatedTokenCacheKey;
const getRefreshTokenCacheKey = (key) => {
    return `auth:refresh-token:${key}`;
};
exports.getRefreshTokenCacheKey = getRefreshTokenCacheKey;
//# sourceMappingURL=cache.constant.js.map