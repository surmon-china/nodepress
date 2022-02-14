/**
 * @file Option service
 * @module module/option/service
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel, MongooseDoc } from '@app/interfaces/mongoose.interface'
import { CacheService, CacheIOResult } from '@app/processors/cache/cache.service'
import { Option, Blocklist, DEFAULT_OPTION } from './option.model'
import * as CACHE_KEY from '@app/constants/cache.constant'
import logger from '@app/utils/logger'

@Injectable()
export class OptionService {
  private optionCache: CacheIOResult<Omit<Option, 'blocklist'>>

  constructor(
    @InjectModel(Option) private readonly optionModel: MongooseModel<Option>,
    private readonly cacheService: CacheService
  ) {
    this.optionCache = this.cacheService.promise({
      ioMode: true,
      key: CACHE_KEY.OPTION,
      promise: () => this.ensureAppOption().then((option) => lodash.omit(option, ['blocklist'])),
    })

    this.optionCache.update().catch((error) => {
      logger.warn('[option]', 'init getAppOption', error)
    })
  }

  public async ensureAppOption(): Promise<MongooseDoc<Option>> {
    const option = await this.optionModel.findOne().exec()
    return option || (await this.optionModel.create({ ...DEFAULT_OPTION }))
  }

  public getOptionCacheForGuest() {
    return this.optionCache.get()
  }

  public async putOption(newOption: Option): Promise<Option> {
    // delete _id, likes fileds
    Reflect.deleteProperty(newOption, '_id')
    Reflect.deleteProperty(newOption, 'meta')

    await this.ensureAppOption()
    await this.optionModel.updateOne({}, newOption).exec()

    // update cache when option updated
    await this.optionCache.update()
    return await this.ensureAppOption()
  }

  public async appendToBlocklist(payload: { ips: string[]; emails: string[] }): Promise<Blocklist> {
    const option = await this.ensureAppOption()
    option.blocklist.ips = lodash.uniq([...option.blocklist.ips, ...payload.ips])
    option.blocklist.mails = lodash.uniq([...option.blocklist.mails, ...payload.emails])
    await option.save()
    return option.blocklist
  }

  public async removeFromBlocklist(payload: { ips: string[]; emails: string[] }): Promise<Blocklist> {
    const option = await this.ensureAppOption()
    option.blocklist.ips = option.blocklist.ips.filter((ip) => !payload.ips.includes(ip))
    option.blocklist.mails = option.blocklist.mails.filter((email) => !payload.emails.includes(email))
    await option.save()
    return option.blocklist
  }

  public async incrementLikes(): Promise<number> {
    const option = await this.ensureAppOption()
    option.meta.likes++
    await option.save({ timestamps: false })
    await this.optionCache.update()
    return option.meta.likes
  }
}
