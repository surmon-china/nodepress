"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvalidatedTokenCacheKey = exports.getDisqusCacheKey = exports.CacheKeys = void 0;
var CacheKeys;
(function (CacheKeys) {
    CacheKeys["Options"] = "options";
    CacheKeys["Archive"] = "archive";
    CacheKeys["AllTags"] = "all-tags";
    CacheKeys["AllCategories"] = "all-categories";
    CacheKeys["TodayViewCount"] = "today-view-count";
})(CacheKeys || (exports.CacheKeys = CacheKeys = {}));
const getDisqusCacheKey = (key) => {
    return `disqus:${key}`;
};
exports.getDisqusCacheKey = getDisqusCacheKey;
const getInvalidatedTokenCacheKey = (key) => {
    return `auth:invalidated:${key}`;
};
exports.getInvalidatedTokenCacheKey = getInvalidatedTokenCacheKey;
//# sourceMappingURL=cache.constant.js.map