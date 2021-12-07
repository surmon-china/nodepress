/**
 * @file Option service
 * @module module/option/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { CacheService, CacheIOResult, CacheResult } from '@app/processors/cache/cache.service'
import { Option } from './option.model'
import * as CACHE_KEY from '@app/constants/cache.constant'
import logger from '@app/utils/logger'

@Injectable()
export class OptionService {
  // 配置表缓存
  private optionCache: CacheIOResult<Option>

  constructor(
    @InjectModel(Option) private readonly optionModel: MongooseModel<Option>,
    private readonly cacheService: CacheService
  ) {
    this.optionCache = this.cacheService.promise({
      ioMode: true,
      key: CACHE_KEY.OPTION,
      promise: this.getDBOption.bind(this),
    })
    this.optionCache.update().catch((error) => {
      logger.warn('[option]', 'init getDBOption Error:', error)
    })
  }

  public getDBOption() {
    return this.optionModel.findOne().exec()
  }

  public getOption(): CacheResult<Option> {
    return this.optionCache.get()
  }

  private async putDBOption(option: Option): Promise<Option> {
    // 置空 _id、likes 字段
    Reflect.deleteProperty(option, '_id')
    Reflect.deleteProperty(option, 'meta')

    const extantOption = await this.getDBOption()
    if (extantOption) {
      await extantOption.update(option)
      return this.getDBOption()
    } else {
      this.optionModel.create(option)
    }
  }

  public async putOption(option: Option): Promise<Option> {
    const newOption = await this.putDBOption(option)
    // 配置表发生更改后一定更新缓存
    this.optionCache.update()
    return newOption
  }
}
