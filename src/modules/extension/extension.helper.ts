import { CacheService } from '@app/core/cache/cache.service'
import { CacheKeys } from '@app/constants/cache.constant'

export const getTodayViewsCount = async (cache: CacheService) => {
  const count = await cache.get<number>(CacheKeys.TodayViewCount)
  return count ? Number(count) : 0
}

export const increaseTodayViewsCount = async (cache: CacheService) => {
  const views = await getTodayViewsCount(cache)
  await cache.set(CacheKeys.TodayViewCount, views + 1)
  return views + 1
}

export const resetTodayViewsCount = (cache: CacheService) => {
  return cache.set(CacheKeys.TodayViewCount, 0)
}
