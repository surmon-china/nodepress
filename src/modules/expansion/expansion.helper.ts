import { CacheService } from '@app/processors/cache/cache.service'
import * as CACHE_KEY from '@app/constants/cache.constant'

export const getTodayViewsCount = async (cache: CacheService) => {
  const count = await cache.get<number>(CACHE_KEY.TODAY_VIEWS)
  return count ? Number(count) : 0
}

export const increaseTodayViewsCount = async (cache: CacheService) => {
  const views = await getTodayViewsCount(cache)
  await cache.set(CACHE_KEY.TODAY_VIEWS, views + 1)
  return views + 1
}

export const resetTodayViewsCount = (cache: CacheService) => {
  return cache.set(CACHE_KEY.TODAY_VIEWS, 0)
}
