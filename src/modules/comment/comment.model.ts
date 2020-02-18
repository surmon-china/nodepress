/**
 * Comment model.
 * @file 评论模块数据模型
 * @module module/comment/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose';
import { prop, arrayProp, plugin, pre, index, defaultClasses } from '@typegoose/typegoose';
import { IsString, MaxLength, IsIn, IsIP, IsUrl, IsEmail, IsInt, IsBoolean, IsNotEmpty, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { mongoosePaginate, mongooseAutoIncrement } from '@app/transformers/mongoose.transformer';
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';
import { ECommentParentType, ECommentState } from '@app/interfaces/state.interface';
import { Extend } from '@app/models/extend.model';

// 评论作者
export class Author {
  @IsNotEmpty({ message: '作者名称？' })
  @IsString()
  @MaxLength(20)
  @prop({ required: true, validate: /\S+/ })
  name: string;

  @IsNotEmpty({ message: '作者邮箱？' })
  @IsString()
  @IsEmail()
  @prop({ required: true })
  email: string;

  @IsString()
  @IsUrl()
  @prop({ validate: /^((https|http):\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/ })
  site: string;
}

// 创建评论的基数据
export class CreateCommentBase extends defaultClasses.Base {
  // 评论所在的文章 Id
  @IsNotEmpty({ message: '文章 Id？' })
  @IsInt()
  @prop({ required: true })
  post_id: number;

  // 父级评论 Id
  @IsInt()
  @prop({ default: ECommentParentType.Self })
  pid: number;

  @IsNotEmpty({ message: '评论内容？' })
  @IsString({ message: '字符串？' })
  @MaxLength(3000)
  @prop({ required: true, validate: /\S+/ })
  content: string;

  // 用户 UA
  @prop({ validate: /\S+/ })
  agent?: string;

  // 评论作者
  @prop()
  author: Author;
}

@pre<Comment>('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
})
@plugin(mongoosePaginate)
@plugin(mongooseAutoIncrement.plugin, {
  model: Comment.name,
  field: 'id',
  startAt: 1,
  incrementBy: 1,
})
@index({ post_id: 1 })
export class Comment extends CreateCommentBase {
  // 评论发布状态
  @IsIn([ECommentState.Auditing, ECommentState.Deleted, ECommentState.Published, ECommentState.Spam])
  @IsInt()
  @prop({ default: ECommentState.Published })
  state: ECommentState;

  // 是否置顶
  @IsBoolean()
  @prop({ default: false })
  is_top: boolean;

  // 被赞数
  @IsInt()
  @prop({ default: 0 })
  likes: number;

  // IP 地址
  @IsIP()
  @prop()
  ip?: string;

  // IP物理地址
  @prop()
  ip_location?: any;

  @prop({ default: Date.now })
  create_at?: Date;

  @prop({ default: Date.now })
  update_at?: Date;

  @IsArray()
  @ArrayUnique()
  @arrayProp({ items: Extend })
  extends?: Extend[];
}

export class DelComments {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  comment_ids: Types.ObjectId[];

  @IsArray()
  @ArrayUnique()
  post_ids: number[];
}

export class PatchComments extends DelComments {
  @IsIn([ECommentState.Auditing, ECommentState.Deleted, ECommentState.Published, ECommentState.Spam])
  @IsInt()
  @prop({ default: ECommentState.Published })
  state: ECommentState;
}

export const CommentProvider = getProviderByTypegooseClass(Comment);
