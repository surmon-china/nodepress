/**
 * @file Options service
 * @module module/options/service
 * @author Surmon <https://github.com/surmon-china>
 */

import _omit from 'lodash/omit'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { CacheService, CacheManualResult } from '@app/core/cache/cache.service'
import { GlobalCacheKey } from '@app/constants/cache.constant'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import { Option, OptionPublic, Blocklist, DEFAULT_OPTIONS, OPTIONS_SINGLETON_QUERY } from './options.model'
import { UpdateOptionsDto } from './options.dto'

const logger = createLogger({ scope: 'OptionsService', time: isDevEnv })

@Injectable()
export class OptionsService implements OnModuleInit {
  private optionsCache: CacheManualResult<OptionPublic>

  constructor(
    @InjectModel(Option)
    private readonly optionsModel: MongooseModel<Option>,
    private readonly cacheService: CacheService
  ) {
    this.optionsCache = this.cacheService.manual({
      key: GlobalCacheKey.PublicOptions,
      promise: () => {
        return this.ensureOptions().then((option) => {
          return _omit(option, ['blocklist', '_id']) as OptionPublic
        })
      }
    })
  }

  onModuleInit() {
    this.optionsCache.update().catch((error) => {
      logger.warn('Init getAppOptions failed!', error)
    })
  }

  public getPublicOptionsCache(): Promise<OptionPublic> {
    return this.optionsCache.get()
  }

  public ensureOptions(): Promise<Option> {
    return this.optionsModel
      .findOneAndUpdate(
        OPTIONS_SINGLETON_QUERY,
        { $setOnInsert: { ...DEFAULT_OPTIONS, ...OPTIONS_SINGLETON_QUERY } },
        { upsert: true, setDefaultsOnInsert: true, returnDocument: 'after' }
      )
      .lean()
      .exec()
  }

  public async updateOptions(input: UpdateOptionsDto): Promise<Option> {
    // ensure and update
    await this.ensureOptions()
    const updated = await this.optionsModel
      .findOneAndUpdate(OPTIONS_SINGLETON_QUERY, { $set: input }, { returnDocument: 'after' })
      .lean()
      .exec()
    // update cache when options updated
    await this.optionsCache.update()
    return updated!
  }

  public async appendToBlocklist({ ips, emails }: Pick<Blocklist, 'ips' | 'emails'>): Promise<Blocklist> {
    await this.ensureOptions()
    const updated = await this.optionsModel
      .findOneAndUpdate(
        OPTIONS_SINGLETON_QUERY,
        { $addToSet: { 'blocklist.ips': { $each: ips }, 'blocklist.emails': { $each: emails } } },
        { returnDocument: 'after' }
      )
      .exec()
    return updated!.blocklist
  }

  public async removeFromBlocklist({ ips, emails }: Pick<Blocklist, 'ips' | 'emails'>): Promise<Blocklist> {
    await this.ensureOptions()
    const updated = await this.optionsModel
      .findOneAndUpdate(
        OPTIONS_SINGLETON_QUERY,
        { $pull: { 'blocklist.ips': { $in: ips }, 'blocklist.emails': { $in: emails } } },
        { returnDocument: 'after' }
      )
      .exec()
    return updated!.blocklist
  }
}
