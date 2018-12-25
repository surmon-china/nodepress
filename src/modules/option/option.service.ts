/**
 * Option service.
 * @file 设置模块数据服务
 * @module modules/option/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TMongooseModel } from '@app/interfaces/mongoose.interface';
import { Option } from './option.model';

@Injectable()
export class OptionService {
  constructor(@InjectModel(Option) private readonly optionModel: TMongooseModel<Option>) {}

  // 请求设置
  async getOptions(): Promise<Option> {
    return this.optionModel.findOne();
  }

  // 修改设置
  async putOptions(option: Option): Promise<Option> {

    // 置空 _id、likes 字段
    Reflect.deleteProperty(option, '_id');
    Reflect.deleteProperty(option, 'meta');

    return this.optionModel.findOne(null, '-_id').then(extantOption => {
      return extantOption
        ? Object.assign(extantOption, option).save()
        : new this.optionModel(option).save();
    });
  }
}