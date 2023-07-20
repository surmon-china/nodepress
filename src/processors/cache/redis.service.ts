/**
 * @file Cache Redis service
 * @module processor/cache/redis.config
 * @author Surmon <https://github.com/surmon-china>
 */

// https://github.com/nestjs/cache-manager/blob/master/lib/cache.module.ts
// https://github.com/nestjs/cache-manager/blob/master/lib/cache.providers.ts
// https://gist.github.com/kyle-mccarthy/b6770b49ebfab88e75bcbac87b272a94

import lodash from 'lodash'
import { createClient, RedisClientType } from 'redis'
import { Injectable } from '@nestjs/common'
import { EmailService } from '@app/processors/helper/helper.service.email'
import { createRedisStore, RedisStore, RedisClientOptions } from './redis.store'
import * as APP_CONFIG from '@app/app.config'
import logger from '@app/utils/logger'

const log = logger.scope('RedisService')

@Injectable()
export class RedisService {
  private redisStore!: RedisStore
  private redisClient!: RedisClientType

  constructor(private readonly emailService: EmailService) {
    this.redisClient = createClient(this.getOptions()) as RedisClientType
    this.redisStore = createRedisStore(this.redisClient, {
      defaultTTL: APP_CONFIG.APP.DEFAULT_CACHE_TTL,
      namespace: APP_CONFIG.REDIS.namespace
    })
    // https://github.com/redis/node-redis#events
    this.redisClient.on('connect', () => log.info('connecting...'))
    this.redisClient.on('reconnecting', () => log.warn('reconnecting...'))
    this.redisClient.on('ready', () => log.info('readied (connected).'))
    this.redisClient.on('end', () => log.error('client end!'))
    this.redisClient.on('error', (error) => log.error(`client error!`, error.message))
    // connect
    this.redisClient.connect()
  }

  private sendAlarmMail = lodash.throttle((error: string) => {
    this.emailService.sendMailAs(APP_CONFIG.APP.NAME, {
      to: APP_CONFIG.APP.ADMIN_EMAIL,
      subject: `Redis Error!`,
      text: error,
      html: `<pre><code>${error}</code></pre>`
    })
  }, 1000 * 30)

  // https://github.com/redis/node-redis/blob/master/docs/client-configuration.md#reconnect-strategy
  private retryStrategy(retries: number): number | Error {
    const errorMessage = `retryStrategy! retries: ${retries}`
    log.error(errorMessage)
    this.sendAlarmMail(errorMessage)
    if (retries > 6) {
      return new Error('Redis maximum retries!')
    }
    return Math.min(retries * 1000, 3000)
  }

  // https://github.com/redis/node-redis/blob/master/docs/client-configuration.md
  private getOptions(): RedisClientOptions {
    const redisOptions: RedisClientOptions = {
      socket: {
        host: APP_CONFIG.REDIS.host,
        port: APP_CONFIG.REDIS.port as number,
        reconnectStrategy: this.retryStrategy.bind(this)
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
