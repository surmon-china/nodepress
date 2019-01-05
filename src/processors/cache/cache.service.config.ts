/**
 * Cache config service.
 * @file Cache 配置器
 * @module processor/cache/config.service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as APP_CONFIG from '@app/app.config';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModuleOptions, CacheOptionsFactory, Injectable } from '@nestjs/common';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {

  // 重试策略
  public retryStrategy() {
    return {
      retry_strategy: (options: any) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          console.warn('Redis 连接出了问题：', options.error);
          return new Error('Redis 服务器拒绝连接');
        }
        if (options.total_retry_time > 1000 * 60) {
          return new Error('重试时间已用完');
        }
        if (options.attempt > 6) {
          return new Error('尝试次数已达极限');
        }
        return Math.min(options.attempt * 100, 3000);
      },
    };
  }

  // 缓存配置
  public createCacheOptions(): CacheModuleOptions {
    return { store: redisStore, ...APP_CONFIG.REDIS };
  }
}
