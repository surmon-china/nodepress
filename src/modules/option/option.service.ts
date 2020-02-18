/**
 * Option service.
 * @file 设置模块数据服务
 * @module module/option/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@app/transformers/model.transformer';
import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { Option } from './option.model';

@Injectable()
export class OptionService {
  constructor(@InjectModel(Option) private readonly optionModel: MongooseModel<Option>) {}

  // 请求设置
  public getOption(): Promise<Option> {
    return this.optionModel.findOne().exec();
  }

  // 修改设置
  public putOption(option: Option): Promise<Option> {

    // 置空 _id、likes 字段
    Reflect.deleteProperty(option, '_id');
    Reflect.deleteProperty(option, 'meta');

    return this.optionModel
      .findOne()
      .exec()
      .then(extantOption => {
        return extantOption
          ? Object.assign(extantOption, option).save().then(() => extantOption)
          : this.optionModel.create(option);
      });
  }
}
