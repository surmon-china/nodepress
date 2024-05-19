/**
 * @file Global cache constant
 * @module constant/cache
 * @author Surmon <https://github.com/surmon-china>
 */

export enum CacheKeys {
  Option = 'option',
  Archive = 'archive',
  AllTags = 'all-tags',
  AllCategories = 'all-categories',
  TodayViewCount = 'today-view-count'
}

export const getDecoratorCacheKey = (key: string) => {
  return `decorator:${key}`
}

export const getDisqusCacheKey = (key: string) => {
  return `disqus:${key}`
}
