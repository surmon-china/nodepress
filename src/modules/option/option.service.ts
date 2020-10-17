/**
 * Option service.
 * @file 设置模块数据服务
 * @module module/option/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@app/transformers/model.transformer';
import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { CacheService, ICacheIoResult, TCacheResult } from '@app/processors/cache/cache.service';
import { Option } from './option.model';
import * as CACHE_KEY from '@app/constants/cache.constant';

@Injectable()
export class OptionService {

  // 配置表缓存
  private optionCache: ICacheIoResult<Option>;

  constructor(
    @InjectModel(Option) private readonly optionModel: MongooseModel<Option>,
    private readonly cacheService: CacheService,
  ) {
    this.optionCache = this.cacheService.promise({
      ioMode: true,
      key: CACHE_KEY.OPTION,
      promise: this.getDBOption.bind(this),
    });
    this.optionCache.update()
  }

  public getDBOption() {
    return this.optionModel.findOne().exec();
  }

  public getOption(): TCacheResult<Option> {
    return this.optionCache.get();
  }

  private async putDBOption(option: Option): Promise<Option> {
    // 置空 _id、likes 字段
    Reflect.deleteProperty(option, '_id');
    Reflect.deleteProperty(option, 'meta');

    const extantOption = await this.getDBOption();
    if (extantOption) {
      await Object.assign(extantOption, option).save();
      return extantOption;
    } else {
      this.optionModel.create(option);
    }
  }

  public async putOption(option: Option): Promise<Option> {
    const newOption = await this.putDBOption(option);
    // 配置表发生更改后一定更新缓存
    this.optionCache.update();
    return newOption;
  }
}
