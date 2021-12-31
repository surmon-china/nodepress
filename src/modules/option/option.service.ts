/**
 * @file Option service
 * @module module/option/service
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { CacheService, CacheIOResult, CacheResult } from '@app/processors/cache/cache.service'
import { Option, Blocklist, DEFAULT_OPTION } from './option.model'
import * as CACHE_KEY from '@app/constants/cache.constant'
import logger from '@app/utils/logger'

@Injectable()
export class OptionService {
  private optionCache: CacheIOResult<Option>

  constructor(
    @InjectModel(Option) private readonly optionModel: MongooseModel<Option>,
    private readonly cacheService: CacheService
  ) {
    this.optionCache = this.cacheService.promise({
      ioMode: true,
      key: CACHE_KEY.OPTION,
      promise: () => {
        return this.getAppOption().then((option) => {
          Reflect.deleteProperty(option, 'blocklist')
          return option
        })
      },
    })

    this.optionCache.update().catch((error) => {
      logger.warn('[option]', 'init getAppOption', error)
    })
  }

  public async getAppOption(): Promise<Option> {
    const option = await this.optionModel.findOne().exec()
    return option ? option.toObject() : DEFAULT_OPTION
  }

  public getOptionUserCache(): CacheResult<Option> {
    return this.optionCache.get()
  }

  public async putOption(option: Option): Promise<Option> {
    // delete _id, likes fileds
    Reflect.deleteProperty(option, '_id')
    Reflect.deleteProperty(option, 'meta')

    let result: Option | void
    const extantOption = await this.optionModel.findOne().exec()
    if (extantOption) {
      await extantOption.update(option)
      result = await this.getAppOption()
    } else {
      result = await this.optionModel.create(option)
    }

    // update cache when option updated
    await this.optionCache.update()
    return result
  }

  public async appendToBlocklist(payload: { ips: string[]; emails: string[] }): Promise<Blocklist> {
    const option = await this.optionModel.findOne().exec()
    if (!option) {
      throw `Uninitialized option`
    }
    option.blocklist.ips = lodash.uniq([...option.blocklist.ips, ...payload.ips])
    option.blocklist.mails = lodash.uniq([...option.blocklist.mails, ...payload.emails])
    await option.save()
    return option.blocklist
  }

  public async removeFromBlocklist(payload: { ips: string[]; emails: string[] }): Promise<Blocklist> {
    const option = await this.optionModel.findOne().exec()
    if (!option) {
      throw `Uninitialized option`
    }
    option.blocklist.ips = option.blocklist.ips.filter((ip) => !payload.ips.includes(ip))
    option.blocklist.mails = option.blocklist.mails.filter((email) => !payload.emails.includes(email))
    await option.save()
    return option.blocklist
  }

  public async likeSite(): Promise<number> {
    const option = await this.optionModel.findOne().exec()
    if (!option) {
      throw `Uninitialized option`
    }

    option.meta.likes++
    await option.save()
    await this.optionCache.update()
    return option.meta.likes
  }
}
