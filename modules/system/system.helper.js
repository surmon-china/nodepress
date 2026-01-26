"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetGlobalTodayViewsCount = exports.incrementGlobalTodayViewsCount = exports.getGlobalTodayViewsCount = void 0;
const cache_constant_1 = require("../../constants/cache.constant");
const getGlobalTodayViewsCount = async (cache) => {
    const count = await cache.get(cache_constant_1.CacheKeys.TodayViewCount);
    return count ? Number(count) : 0;
};
exports.getGlobalTodayViewsCount = getGlobalTodayViewsCount;
const incrementGlobalTodayViewsCount = async (cache) => {
    const views = await (0, exports.getGlobalTodayViewsCount)(cache);
    await cache.set(cache_constant_1.CacheKeys.TodayViewCount, views + 1);
    return views + 1;
};
exports.incrementGlobalTodayViewsCount = incrementGlobalTodayViewsCount;
const resetGlobalTodayViewsCount = (cache) => {
    return cache.set(cache_constant_1.CacheKeys.TodayViewCount, 0);
};
exports.resetGlobalTodayViewsCount = resetGlobalTodayViewsCount;
//# sourceMappingURL=system.helper.js.map