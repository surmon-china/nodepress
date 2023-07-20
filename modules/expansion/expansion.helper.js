"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetTodayViewsCount = exports.increaseTodayViewsCount = exports.getTodayViewsCount = void 0;
const cache_constant_1 = require("../../constants/cache.constant");
const getTodayViewsCount = async (cache) => {
    const count = await cache.get(cache_constant_1.CacheKeys.TodayViewCount);
    return count ? Number(count) : 0;
};
exports.getTodayViewsCount = getTodayViewsCount;
const increaseTodayViewsCount = async (cache) => {
    const views = await (0, exports.getTodayViewsCount)(cache);
    await cache.set(cache_constant_1.CacheKeys.TodayViewCount, views + 1);
    return views + 1;
};
exports.increaseTodayViewsCount = increaseTodayViewsCount;
const resetTodayViewsCount = (cache) => {
    return cache.set(cache_constant_1.CacheKeys.TodayViewCount, 0);
};
exports.resetTodayViewsCount = resetTodayViewsCount;
//# sourceMappingURL=expansion.helper.js.map