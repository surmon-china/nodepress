/**
 * Option model.
 * @file 设置模块数据模型
 * @module module/option/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { prop, pre, defaultClasses } from '@typegoose/typegoose';
import { IsString, IsInt, IsUrl, IsNotEmpty, IsArray, ArrayUnique } from 'class-validator';
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';

// 元信息
class Meta {
  @IsInt()
  @prop({ default: 0 })
  likes: number;
}

// 黑名单
export class Blacklist {
  @IsArray()
  @ArrayUnique()
  @prop({ type: () => [String] })
  ips: string[];

  @IsArray()
  @ArrayUnique()
  @prop({ type: () => [String] })
  mails: string[];

  @IsArray()
  @ArrayUnique()
  @prop({ type: () => [String] })
  keywords: string[];
}

@pre<Option>('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
})
export class Option extends defaultClasses.Base {
  @IsNotEmpty({ message: '标题？' })
  @IsString()
  @prop({ required: true, validate: /\S+/ })
  title: string;

  @IsNotEmpty({ message: '副标题？' })
  @IsString()
  @prop({ required: true, validate: /\S+/ })
  sub_title: string;

  // 关键字
  @IsArray()
  @ArrayUnique()
  @prop({ type: () => [String] })
  keywords: string[];

  // 网站描述
  @IsString()
  @prop()
  description: string;

  // 站点地址
  @IsString()
  @IsUrl()
  @prop({ required: true })
  site_url: string;

  // 网站官邮
  @IsString()
  @prop({ required: true })
  site_email: string;

  // 备案号
  @IsString()
  @prop({ required: true })
  site_icp: string;

  // 黑名单
  @prop({ _id: false })
  blacklist: Blacklist;

  // 其他元信息
  @prop({ _id: false })
  meta: Meta;

  // 广告配置
  @IsString()
  @prop({ default: '' })
  ad_config: string;

  @prop({ default: Date.now })
  update_at?: Date;
}

export const OptionProvider = getProviderByTypegooseClass(Option);
