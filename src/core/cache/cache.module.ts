/**
 * @file Cache module
 * @module core/cache/module
 * @author Surmon <https://github.com/surmon-china>
 */

// https://docs.nestjs.com/techniques/caching#different-stores
// https://docs.nestjs.com/techniques/caching#async-configuration
// MARK: No longer use cache-manager because the API between `cache-manager` and `@nestjs/cache-manager` is inconsistent.

import { Global, Module } from '@nestjs/common'
import { CacheService } from './cache.service'
import { RedisService } from './redis.service'
import { RedisListener } from './redis.listener'

@Global()
@Module({
  providers: [RedisService, CacheService, RedisListener],
  exports: [RedisService, CacheService]
})
export class CacheModule {}
