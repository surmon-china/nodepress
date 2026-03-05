/**
 * @file Global cache constant
 * @module constant/cache
 * @author Surmon <https://github.com/surmon-china>
 */

export enum GlobalCacheKey {
  TodayViewCount = 'today-view-count',
  PublicOptions = 'public-options',
  PublicAdminProfile = 'public-admin-profile',
  PublicAllArticles = 'public-all-articles',
  PublicAllCategories = 'public-all-categories',
  PublicAllTags = 'public-all-tags'
}

export const getUserAuthStateCacheKey = (key: string) => {
  return `auth:user-oauth-state:${key}`
}

export const getInvalidatedTokenCacheKey = (key: string) => {
  return `auth:invalidated-token:${key}`
}

export const getRefreshTokenCacheKey = (key: string) => {
  return `auth:refresh-token:${key}`
}
