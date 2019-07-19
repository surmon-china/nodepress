/**
 * Tag model.
 * @file 标签模块数据模型
 * @module module/tag/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose';
import { prop, arrayProp, plugin, pre, Typegoose } from 'typegoose';
import { IsString, MaxLength, IsAlphanumeric, IsNotEmpty, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { mongoosePaginate, mongooseAutoIncrement } from '@app/transforms/mongoose.transform';
import { getModelBySchema, getProviderByModel } from '@app/transforms/model.transform';
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

export class Tag extends Typegoose {
  @IsNotEmpty({ message: '标签名称？' })
  @IsString({ message: '字符串？' })
  @prop({ required: true, validate: /\S+/ })
  name: string;

  @IsNotEmpty({ message: '标签别名？' })
  @IsString({ message: '字符串？' })
  @IsAlphanumeric({ message: 'slug 只允许字母和数字' })
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

  _id?: Types.ObjectId;
  count?: number;
}

export class DelTags extends Typegoose {

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  tag_ids: Types.ObjectId[];
}

export const TagModel = getModelBySchema(Tag);
export const TagProvider = getProviderByModel(TagModel);
