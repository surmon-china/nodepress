/**
 * @file Options service
 * @module module/options/service
 * @author Surmon <https://github.com/surmon-china>
 */

import _omit from 'lodash/omit'
import _uniq from 'lodash/uniq'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel, MongooseDoc } from '@app/interfaces/mongoose.interface'
import { CacheService, CacheManualResult } from '@app/core/cache/cache.service'
import { Option, Blocklist, DEFAULT_OPTIONS } from './options.model'
import { CacheKeys } from '@app/constants/cache.constant'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'

const logger = createLogger({ scope: 'OptionsService', time: isDevEnv })

@Injectable()
export class OptionsService implements OnModuleInit {
  private optionsCache: CacheManualResult<Omit<Option, 'blocklist'>>

  constructor(
    @InjectModel(Option) private readonly optionsModel: MongooseModel<Option>,
    private readonly cacheService: CacheService
  ) {
    this.optionsCache = this.cacheService.manual({
      key: CacheKeys.Options,
      promise: () => {
        return this.ensureAppOptions().then((option) => {
          return _omit(option.toObject<Option>(), ['blocklist', '_id'])
        })
      }
    })
  }

  onModuleInit() {
    this.optionsCache.update().catch((error) => {
      logger.warn('Init getAppOptions failed!', error)
    })
  }

  public async ensureAppOptions(): Promise<MongooseDoc<Option>> {
    // MARK: To avoid blocking subsequent write operations, `.select(-1)` should not be used here.
    const options = await this.optionsModel.findOne().exec()
    return options ?? (await this.optionsModel.create({ ...DEFAULT_OPTIONS }))
  }

  public getOptionsCacheForGuest() {
    return this.optionsCache.get()
  }

  public async putOptions(newOptions: Option): Promise<Option> {
    // delete _id fields
    Reflect.deleteProperty(newOptions, '_id')
    // create and update
    await this.ensureAppOptions()
    await this.optionsModel.updateOne({}, newOptions).exec()
    // update cache when options updated
    await this.optionsCache.update()
    return await this.ensureAppOptions()
  }

  public async appendToBlocklist(payload: { ips: string[]; emails: string[] }): Promise<Blocklist> {
    const options = await this.ensureAppOptions()
    options.blocklist.ips = _uniq([...options.blocklist.ips, ...payload.ips])
    options.blocklist.mails = _uniq([...options.blocklist.mails, ...payload.emails])
    await options.save()
    return options.blocklist
  }

  public async removeFromBlocklist(payload: { ips: string[]; emails: string[] }): Promise<Blocklist> {
    const options = await this.ensureAppOptions()
    options.blocklist.ips = options.blocklist.ips.filter((ip) => !payload.ips.includes(ip))
    options.blocklist.mails = options.blocklist.mails.filter((email) => !payload.emails.includes(email))
    await options.save()
    return options.blocklist
  }
}
