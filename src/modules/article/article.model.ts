/**
 * Article model.
 * @file 文章模块数据模型
 * @module module/article/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { prop, index, plugin, pre, Ref, defaultClasses, modelOptions } from '@typegoose/typegoose';
import { IsString, IsNotEmpty, IsArray, IsDefined, IsIn, IsInt, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { mongoosePaginate } from '@app/transformers/mongoose.transformer';
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';
import { EPublishState, EPublicState, EOriginState } from '@app/interfaces/state.interface';
import { Category } from '@app/modules/category/category.model';
import { Extend } from '@app/models/extend.model';
import { Tag } from '@app/modules/tag/tag.model';

export function getDefaultMeta(): Meta {
  return {
    likes: 0,
    views: 0,
    comments: 0,
  };
}

// 元信息
export class Meta {
  @IsInt()
  @prop({ default: 0 })
  likes: number;

  @IsInt()
  @prop({ default: 0 })
  views: number;

  @IsInt()
  @prop({ default: 0 })
  comments: number;
}

@pre<Article>('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
})
@plugin(mongoosePaginate)
@plugin(AutoIncrementID, { field: 'id', startAt: 1 })
@modelOptions({
  schemaOptions: {
    toObject: { getters: true },
  }
})
@index(
  { title: 'text', content: 'text', description: 'text' },
  { name: 'SearchIndex', weights: {
    title: 10,
    content: 3,
    description: 18
  }}
)
export class Article extends defaultClasses.Base {
  @prop({ unique: true })
  id: number;

  @IsNotEmpty({ message: '文章标题？' })
  @IsString({ message: '字符串？' })
  @prop({ required: true, validate: /\S+/, text: true })
  title: string;

  @IsNotEmpty({ message: '文章内容？' })
  @IsString({ message: '字符串？' })
  @prop({ required: true, validate: /\S+/, text: true })
  content: string;

  // 列表时用的文章内容虚拟属性
  get t_content(): string {
    return this.content?.substring?.(0, 130);
  }

  @IsString({ message: '字符串？' })
  @prop({ text: true })
  description: string;

  // 缩略图
  @IsString({ message: '字符串？' })
  @prop()
  thumb: string;

  // 文章密码 -> 密码状态生效
  @IsString({ message: '字符串？' })
  @prop({ default: '' })
  password: string;

  // 文章关键字（SEO）
  @IsArray()
  @ArrayUnique()
  @prop({ type: () => [String] })
  keywords: string[];

  // 文章发布状态
  @IsDefined()
  @IsIn([EPublishState.Draft, EPublishState.Published, EPublishState.Recycle])
  @IsInt({ message: '发布状态？' })
  @prop({ enum: EPublishState, default: EPublishState.Published, index: true })
  state: EPublishState;

  // 文章公开状态
  @IsDefined()
  @IsIn([EPublicState.Public, EPublicState.Secret, EPublicState.Password])
  @IsInt({ message: '公开状态？' })
  @prop({ enum: EPublicState, default: EPublicState.Public, index: true })
  public: EPublicState;

  // 文章转载状态
  @IsDefined()
  @IsIn([EOriginState.Hybrid, EOriginState.Original, EOriginState.Reprint])
  @IsInt({ message: '转载状态？' })
  @prop({ enum: EOriginState, default: EOriginState.Original, index: true })
  origin: EOriginState;

  // 文章标签 https://typegoose.github.io/typegoose/docs/api/virtuals#virtual-populate
  @prop({ ref: () => Tag, index: true })
  tag: Ref<Tag>[];

  // 文章分类
  @IsArray()
  @ArrayNotEmpty({ message: '文章分类？' })
  @ArrayUnique()
  @prop({ ref: () => Category, required: true, index: true })
  category: Ref<Category>[];

  // 其他元信息
  @prop({ _id: false })
  meta: Meta;

  // 发布日期
  @prop({ default: Date.now, index: true })
  create_at?: Date;

  // 最后修改日期
  @prop({ default: Date.now })
  update_at?: Date;

  @IsArray()
  @ArrayUnique()
  @prop({ _id: false, type: () => [Extend] })
  extends: Extend[];

  // 相关文章
  related?: Article[];
}

export class DelArticles {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  article_ids: Types.ObjectId[];
}

export class PatchArticles extends DelArticles {
  @IsDefined()
  @IsIn([EPublishState.Draft, EPublishState.Published, EPublishState.Recycle])
  @IsInt({ message: '有效状态？' })
  @prop({ enum: EPublishState, default: EPublishState.Published })
  state: EPublishState;
}

export const ArticleProvider = getProviderByTypegooseClass(Article);
