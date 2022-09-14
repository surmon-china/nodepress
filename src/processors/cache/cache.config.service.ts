/**
 * @file Cache config service
 * @module processor/cache/config.service
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import { CacheOptionsFactory, Injectable } from '@nestjs/common'
import { EmailService } from '@app/processors/helper/helper.service.email'
import redisStore, { RedisStoreOptions, CacheStoreOptions } from './cache.store'
import * as APP_CONFIG from '@app/app.config'
import { redisLog } from './cache.logger'

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private readonly emailService: EmailService) {}

  private sendAlarmMail = lodash.throttle((error: string) => {
    this.emailService.sendMailAs(APP_CONFIG.APP.NAME, {
      to: APP_CONFIG.APP.ADMIN_EMAIL,
      subject: `Redis Error!`,
      text: error,
      html: `<pre><code>${error}</code></pre>`,
    })
  }, 1000 * 30)

  public retryStrategy(retries: number): number | Error {
    // https://github.com/redis/node-redis/blob/master/docs/client-configuration.md#reconnect-strategy
    const errorMessage = `retryStrategy! retries: ${retries}`
    redisLog.error(errorMessage)
    this.sendAlarmMail(errorMessage)
    if (retries > 6) {
      return new Error('Redis maximum retries!')
    }
    return Math.min(retries * 1000, 3000)
  }

  public createCacheOptions(): CacheStoreOptions {
    // https://github.com/redis/node-redis/blob/master/docs/client-configuration.md
    const redisOptions: RedisStoreOptions = {
      socket: {
        host: APP_CONFIG.REDIS.host,
        port: APP_CONFIG.REDIS.port as number,
        reconnectStrategy: this.retryStrategy.bind(this),
      },
    }
    if (APP_CONFIG.REDIS.username) {
      redisOptions.username = APP_CONFIG.REDIS.username
    }
    if (APP_CONFIG.REDIS.password) {
      redisOptions.password = APP_CONFIG.REDIS.password
    }
    return {
      isGlobal: true,
      store: redisStore,
      redisOptions,
    }
  }
}
