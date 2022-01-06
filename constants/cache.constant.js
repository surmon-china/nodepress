"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDisqusCacheKey = exports.TODAY_VIEWS = exports.ARCHIVE = exports.HOT_ARTICLES = exports.TAGS = exports.OPTION = exports.INFO = exports.CACHE_PREFIX = void 0;
exports.CACHE_PREFIX = '__nodepress_cache_';
exports.INFO = exports.CACHE_PREFIX + 'info';
exports.OPTION = exports.CACHE_PREFIX + 'option';
exports.TAGS = exports.CACHE_PREFIX + 'tags';
exports.HOT_ARTICLES = exports.CACHE_PREFIX + 'hot-articles';
exports.ARCHIVE = exports.CACHE_PREFIX + 'archive';
exports.TODAY_VIEWS = exports.CACHE_PREFIX + 'today-views';
const getDisqusCacheKey = (key) => {
    return `${exports.CACHE_PREFIX}-disqus-${key}`;
};
exports.getDisqusCacheKey = getDisqusCacheKey;
//# sourceMappingURL=cache.constant.js.map