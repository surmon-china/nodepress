/**
 * Category model.
 * @file 分类模块数据模型
 * @module module/category/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { prop, plugin, pre, defaultClasses } from '@typegoose/typegoose';
import { IsString, MaxLength, IsAlphanumeric, IsNotEmpty, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { mongoosePaginate } from '@app/transformers/mongoose.transformer';
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';
import { Extend } from '@app/models/extend.model';

@pre<Category>('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
})
@plugin(mongoosePaginate)
@plugin(AutoIncrementID, { field: 'id', startAt: 1 })
export class Category extends defaultClasses.Base {
  @prop({ unique: true })
  id: number;

  @IsNotEmpty({ message: '分类名称？' })
  @IsString({ message: '字符串？' })
  @prop({ required: true, validate: /\S+/ })
  name: string;

  @IsNotEmpty({ message: '分类别名？' })
  @IsString({ message: '字符串？' })
  @IsAlphanumeric('en-US', { message: 'slug 只允许字母和数字' })
  @MaxLength(30)
  @prop({ required: true, validate: /\S+/ })
  slug: string;

  @IsString({ message: '字符串？' })
  @prop()
  description: string;

  @prop({ ref: Category, default: null })
  pid: Types.ObjectId;

  @prop({ default: Date.now })
  create_at?: Date;

  @prop({ default: Date.now })
  update_at?: Date;

  @IsArray()
  @ArrayUnique()
  @prop({ _id: false, type: () => [Extend] })
  extends: Extend[];

  count?: number;
}

export class DelCategories {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  category_ids: Types.ObjectId[];
}

export const CategoryProvider = getProviderByTypegooseClass(Category);
