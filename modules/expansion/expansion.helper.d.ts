import { CacheService } from '@app/processors/cache/cache.service';
export declare const getTodayViewsCount: (cache: CacheService) => Promise<number>;
export declare const increaseTodayViewsCount: (cache: CacheService) => Promise<number>;
export declare const resetTodayViewsCount: (cache: CacheService) => import("@app/processors/cache/cache.service").CacheResult<void>;
