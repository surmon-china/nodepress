"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvalidatedTokenCacheKey = exports.getUserAuthStateCacheKey = exports.CacheKeys = void 0;
var CacheKeys;
(function (CacheKeys) {
    CacheKeys["Options"] = "options";
    CacheKeys["Archive"] = "archive";
    CacheKeys["AllTags"] = "all-tags";
    CacheKeys["AllCategories"] = "all-categories";
    CacheKeys["TodayViewCount"] = "today-view-count";
    CacheKeys["AdminProfile"] = "admin-profile";
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