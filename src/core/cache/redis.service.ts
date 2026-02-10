/**
 * @file Cache Redis service
 * @module core/cache/redis.service
 * @author Surmon <https://github.com/surmon-china>
 */

// https://github.com/nestjs/cache-manager/blob/master/lib/cache.module.ts
// https://github.com/nestjs/cache-manager/blob/master/lib/cache.providers.ts
// https://gist.github.com/kyle-mccarthy/b6770b49ebfab88e75bcbac87b272a94
// https://github.com/jaredwray/keyv/blob/main/packages/redis/src/index.ts

import { createClient, RedisClientOptions } from '@redis/client'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { getMessageFromNormalError } from '@app/transformers/error.transformer'
import { createLogger } from '@app/utils/logger'
import { createRedisStore, RedisStore } from './redis.store'
import { EventKeys } from '@app/constants/events.constant'
import { isDevEnv } from '@app/app.environment'
import * as APP_CONFIG from '@app/app.config'

const logger = createLogger({ scope: 'RedisService', time: isDevEnv })

// https://github.com/redis/node-redis/blob/master/docs/FAQ.md#redisclienttype
export type RedisClientType = ReturnType<typeof createClient>

@Injectable()
export class RedisService implements OnModuleInit {
  private redisStore!: RedisStore
  private redisClient!: RedisClientType

  constructor(private readonly eventEmitter: EventEmitter2) {
    // https://github.com/redis/node-redis
    this.redisClient = createClient(this.getOptions())
    this.redisStore = createRedisStore(this.redisClient, {
      defaultTTL: APP_CONFIG.APP_BIZ.DEFAULT_CACHE_TTL,
      namespace: APP_CONFIG.REDIS.namespace
    })

    // https://github.com/redis/node-redis#events
    this.redisClient.on('connect', () => logger.log('connecting...'))
    this.redisClient.on('reconnecting', () => logger.log('reconnecting...'))
    this.redisClient.on('ready', () => logger.success('connected. (readied)'))
    this.redisClient.on('end', () => logger.info('client end!'))
    this.redisClient.on('error', (error) => {
      logger.failure('client error!', String(error))
      this.eventEmitter.emit(EventKeys.RedisError, error)
    })
  }

  async onModuleInit() {
    try {
      await this.redisClient.connect()
    } catch (error) {
      logger.failure('Init connect failed!', getMessageFromNormalError(error))
    }
  }

  // https://github.com/redis/node-redis/blob/master/docs/client-configuration.md
  private getOptions(): RedisClientOptions {
    const redisOptions: RedisClientOptions = {
      socket: {
        host: APP_CONFIG.REDIS.host,
        port: APP_CONFIG.REDIS.port as number,
        // https://github.com/redis/node-redis/blob/master/docs/client-configuration.md#reconnect-strategy
        reconnectStrategy(retries: number) {
          if (retries > 6) {
            return new Error('Redis maximum retries!')
          } else {
            return Math.min(retries * 1000, 3000)
          }
        }
      }
    }

    if (APP_CONFIG.REDIS.username) {
      redisOptions.username = APP_CONFIG.REDIS.username
    }
    if (APP_CONFIG.REDIS.password) {
      redisOptions.password = APP_CONFIG.REDIS.password
    }

    return redisOptions
  }

  public get client(): RedisClientType {
    return this.redisClient
  }

  public get store(): RedisStore {
    return this.redisStore
  }
}
