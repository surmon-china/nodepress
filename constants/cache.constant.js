"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvalidatedTokenCacheKey = exports.getUserAuthStateCacheKey = exports.CacheKeys = void 0;
var CacheKeys;
(function (CacheKeys) {
    CacheKeys["TodayViewCount"] = "today-view-count";
    CacheKeys["PublicOptions"] = "public-options";
    CacheKeys["PublicAdminProfile"] = "public-admin-profile";
    CacheKeys["PublicAllArticles"] = "public-all-articles";
    CacheKeys["PublicAllCategories"] = "public-all-categories";
    CacheKeys["PublicAllTags"] = "public-all-tags";
})(CacheKeys || (exports.CacheKeys = CacheKeys = {}));
const getUserAuthStateCacheKey = (key) => {
    return `auth:user-oauth-state:${key}`;
};
exports.getUserAuthStateCacheKey = getUserAuthStateCacheKey;
const getInvalidatedTokenCacheKey = (key) => {
    return `auth:invalidated-token:${key}`;
};
exports.getInvalidatedTokenCacheKey = getInvalidatedTokenCacheKey;
//# sourceMappingURL=cache.constant.js.map