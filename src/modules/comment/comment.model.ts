/**
 * Comment model.
 * @file 评论模块数据模型
 * @module module/comment/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose';
import { prop, arrayProp, plugin, pre, Typegoose } from 'typegoose';
import { IsString, IsIn, IsInt, IsBoolean, IsNotEmpty, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { mongoosePaginate, mongooseAutoIncrement } from '@app/transforms/mongoose.transform';
import { ECommentParentType, ECommentState } from '@app/interfaces/state.interface';
import { Extend } from '@app/models/extend.model';

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

export class Comment extends Typegoose {

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
  @prop({ required: true, validate: /\S+/ })
  content: string;

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

  // 评论作者
  @prop()
  author: Author;

  // IP 地址
  @prop()
  ip?: string;

  // IP物理地址
  @prop()
  ip_location?: any;

  // 用户 UA
  @prop({ validate: /\S+/ })
  agent?: string;

  @prop({ default: Date.now })
  create_at?: Date;

  @prop({ default: Date.now })
  update_at?: Date;

  @IsArray()
  @ArrayUnique()
  @arrayProp({ items: Extend })
  extends?: Extend[];
}

// 评论作者
export class Author {
  @IsNotEmpty({ message: '作者名称？' })
  @IsString()
  @prop({ required: true, validate: /\S+/ })
  name: string;

  @IsNotEmpty({ message: '作者邮箱？' })
  @IsString()
  @prop({ required: true, validate: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/ })
  email: string;

  @IsString()
  @prop({ validate: /^((https|http):\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/ })
  site: string;
}

export class DelComments extends Typegoose {
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
