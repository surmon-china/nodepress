"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDisqusCacheKey = exports.getDecoratorCacheKey = exports.CacheKeys = void 0;
var CacheKeys;
(function (CacheKeys) {
    CacheKeys["Option"] = "option";
    CacheKeys["Archive"] = "archive";
    CacheKeys["AllTags"] = "all-tags";
    CacheKeys["TodayViewCount"] = "today-view-count";
})(CacheKeys || (exports.CacheKeys = CacheKeys = {}));
const getDecoratorCacheKey = (key) => {
    return `decorator:${key}`;
};
exports.getDecoratorCacheKey = getDecoratorCacheKey;
const getDisqusCacheKey = (key) => {
    return `disqus:${key}`;
};
exports.getDisqusCacheKey = getDisqusCacheKey;
//# sourceMappingURL=cache.constant.js.map