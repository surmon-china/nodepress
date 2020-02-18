/**
 * Tag model.
 * @file 标签模块数据模型
 * @module module/tag/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose';
import { prop, arrayProp, plugin, pre, defaultClasses } from '@typegoose/typegoose';
import { IsString, MaxLength, IsAlphanumeric, IsNotEmpty, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { mongoosePaginate, mongooseAutoIncrement } from '@app/transformers/mongoose.transformer';
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';
import { Extend } from '@app/models/extend.model';

@pre<Tag>('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
})
@plugin(mongoosePaginate)
@plugin(mongooseAutoIncrement.plugin, {
  model: Tag.name,
  field: 'id',
  startAt: 1,
  incrementBy: 1,
})
export class Tag extends defaultClasses.Base {
  @IsNotEmpty({ message: '标签名称？' })
  @IsString({ message: '字符串？' })
  @prop({ required: true, validate: /\S+/ })
  name: string;

  @IsNotEmpty({ message: '标签别名？' })
  @IsString({ message: '字符串？' })
  @IsAlphanumeric('en-US', { message: 'slug 只允许字母和数字' })
  @MaxLength(30)
  @prop({ required: true, validate: /\S+/ })
  slug: string;

  @IsString({ message: '字符串？' })
  @prop()
  description: string;

  @IsArray()
  @ArrayUnique()
  @arrayProp({ items: Extend })
  extends: Extend[];

  @prop({ default: Date.now })
  create_at?: Date;

  @prop({ default: Date.now })
  update_at?: Date;

  count?: number;
}

export class DelTags {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  tag_ids: Types.ObjectId[];
}

export const TagProvider = getProviderByTypegooseClass(Tag);
