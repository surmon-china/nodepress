/**
 * Cache config.
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
        console.warn('Redis 连接出了问题：', options);
        if (options.error && options.error.code === 'ECONNREFUSED') {
          return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60) {
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 2) {
          return new Error('Max attempts exhausted');
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
