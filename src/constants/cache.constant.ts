/**
 * @file Global cache constant
 * @module constant/cache
 * @author Surmon <https://github.com/surmon-china>
 */

export enum CacheKeys {
  Options = 'options',
  Archive = 'archive',
  AllTags = 'all-tags',
  AllCategories = 'all-categories',
  TodayViewCount = 'today-view-count',
  AdminProfile = 'admin-profile'
}

export const getUserAuthStateCacheKey = (key: string) => {
  return `auth:user-oauth-state:${key}`
}

export const getInvalidatedTokenCacheKey = (key: string) => {
  return `auth:invalidated-token:${key}`
}
