/**
 * Article model.
 * @file 文章模块数据模型
 * @module module/article/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose';
import { prop, arrayProp, plugin, pre, Ref, defaultClasses, modelOptions } from '@typegoose/typegoose';
import { IsString, IsNotEmpty, IsArray, IsDefined, IsIn, IsInt, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { mongoosePaginate, mongooseAutoIncrement } from '@app/transformers/mongoose.transformer';
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

@pre<Article>('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
})
@plugin(mongoosePaginate)
@plugin(mongooseAutoIncrement.plugin, {
  model: Article.name,
  field: 'id',
  startAt: 1,
  incrementBy: 1,
})
@modelOptions({
  schemaOptions: {
    toObject: { getters: true },
  }
})
export class Article extends defaultClasses.Base {
  id: number

  @IsNotEmpty({ message: '文章标题？' })
  @IsString({ message: '字符串？' })
  @prop({ required: true, validate: /\S+/ })
  title: string;

  @IsNotEmpty({ message: '文章内容？' })
  @IsString({ message: '字符串？' })
  @prop({ required: true, validate: /\S+/ })
  content: string;

  // 列表时用的文章内容虚拟属性
  get t_content() {
    const content = this.content;
    return content ? content.substring(0, 130) : content;
  }

  @IsString({ message: '字符串？' })
  @prop()
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
  @arrayProp({ items: String })
  keywords: string[];

  // 文章发布状态
  @IsDefined()
  @IsIn([EPublishState.Draft, EPublishState.Published, EPublishState.Recycle])
  @IsInt({ message: '有效状态？' })
  @prop({ default: EPublishState.Published })
  state: EPublishState;

  // 文章公开状态
  @IsDefined()
  @IsIn([EPublicState.Public, EPublicState.Secret, EPublicState.Password])
  @IsInt({ message: '有效状态？' })
  @prop({ default: EPublicState.Public })
  public: EPublicState;

  // 文章转载状态
  @IsDefined()
  @IsIn([EOriginState.Hybrid, EOriginState.Original, EOriginState.Reprint])
  @IsInt({ message: '有效状态？' })
  @prop({ default: EOriginState.Original })
  origin: EOriginState;

  // 文章标签
  @arrayProp({ itemsRef: Tag })
  tag: Ref<Tag>[];

  // 文章分类
  @arrayProp({ itemsRef: Category, required: true })
  category: Ref<Category>[];

  // 其他元信息
  @prop()
  meta: Meta;

  // 发布日期
  @prop({ default: Date.now })
  create_at?: Date;

  // 最后修改日期
  @prop({ default: Date.now })
  update_at?: Date;

  @IsArray()
  @ArrayUnique()
  @arrayProp({ items: Extend })
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
  @prop({ default: EPublishState.Published })
  state: EPublishState;
}

export const ArticleProvider = getProviderByTypegooseClass(Article);
