"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.resetTodayViewsCount = exports.increaseTodayViewsCount = exports.getTodayViewsCount = void 0;
const CACHE_KEY = __importStar(require("../../constants/cache.constant"));
const getTodayViewsCount = async (cache) => {
    const count = await cache.get(CACHE_KEY.TODAY_VIEWS);
    return count ? Number(count) : 0;
};
exports.getTodayViewsCount = getTodayViewsCount;
const increaseTodayViewsCount = async (cache) => {
    const views = await (0, exports.getTodayViewsCount)(cache);
    await cache.set(CACHE_KEY.TODAY_VIEWS, views + 1);
    return views + 1;
};
exports.increaseTodayViewsCount = increaseTodayViewsCount;
const resetTodayViewsCount = (cache) => {
    return cache.set(CACHE_KEY.TODAY_VIEWS, 0);
};
exports.resetTodayViewsCount = resetTodayViewsCount;
//# sourceMappingURL=expansion.helper.js.map