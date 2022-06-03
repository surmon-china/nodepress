/**
 * @file Global cache constant
 * @module constant/cache
 * @author Surmon <https://github.com/surmon-china>
 */

export const CACHE_PREFIX = '__nodepress_cache_'
export const OPTION = CACHE_PREFIX + 'option'
export const ALL_TAGS = CACHE_PREFIX + 'all-tags'
export const HOTTEST_ARTICLES = CACHE_PREFIX + 'hottest-articles'
export const ARCHIVE = CACHE_PREFIX + 'archive'
export const TODAY_VIEWS = CACHE_PREFIX + 'today-views'

export const getDisqusCacheKey = (key: string) => {
  return `${CACHE_PREFIX}-disqus-${key}`
}
