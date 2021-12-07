/**
 * @file Comment model
 * @module module/comment/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose'
import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, plugin, modelOptions, Severity } from '@typegoose/typegoose'
import {
  IsString,
  MaxLength,
  IsIn,
  IsIP,
  IsUrl,
  IsEmail,
  IsInt,
  IsBoolean,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator'
import { generalAutoIncrementIDConfig } from '@app/constants/increment.constant'
import { mongoosePaginate } from '@app/utils/paginate'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { CommentParentID, CommentState } from '@app/interfaces/biz.interface'
import { Extend } from '@app/models/extend.model'

// 评论作者
export class Author {
  @IsNotEmpty({ message: '作者名称？' })
  @IsString()
  @MaxLength(20)
  @prop({ required: true, validate: /\S+/ })
  name: string

  @IsNotEmpty({ message: '作者邮箱？' })
  @IsString()
  @IsEmail()
  @prop({ required: true })
  email: string

  @IsString()
  @IsUrl()
  @prop({
    validate: /^((https|http):\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
  })
  site: string
}

// 创建评论的基数据
export class CreateCommentBase {
  // 评论所在的文章 Id
  @IsNotEmpty({ message: '文章 Id？' })
  @IsInt()
  @prop({ required: true, index: true })
  post_id: number

  // 父级评论 Id
  @IsInt()
  @prop({ default: CommentParentID.Self, index: true })
  pid: number

  @IsNotEmpty({ message: '评论内容？' })
  @IsString({ message: '字符串？' })
  @MaxLength(3000)
  @prop({ required: true, validate: /\S+/ })
  content: string

  // 用户 UA
  @prop({ validate: /\S+/ })
  agent?: string

  // 评论作者
  @prop({ _id: false })
  author: Author
}

@plugin(mongoosePaginate)
@plugin(AutoIncrementID, generalAutoIncrementIDConfig)
@modelOptions({
  // https://typegoose.github.io/typegoose/docs/api/decorators/model-options/#allowmixed
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  },
})
export class Comment extends CreateCommentBase {
  @prop({ unique: true })
  id?: number

  // 评论发布状态
  @IsIn([CommentState.Auditing, CommentState.Deleted, CommentState.Published, CommentState.Spam])
  @IsInt()
  @prop({ enum: CommentState, default: CommentState.Published, index: true })
  state: CommentState

  // 是否置顶
  @IsBoolean()
  @prop({ default: false })
  is_top: boolean

  // 被赞数
  @IsInt()
  @prop({ default: 0, index: true })
  likes: number

  // IP 地址
  @IsIP()
  @prop()
  ip?: string

  // IP物理地址
  @prop({ default: {}, type: Object })
  ip_location?: Record<string, any>

  @prop({ default: Date.now, immutable: true })
  create_at?: Date

  @prop({ default: Date.now })
  update_at?: Date

  @IsArray()
  @ArrayUnique()
  @prop({ _id: false, type: () => [Extend] })
  extends?: Extend[]
}

export class CommentsPayload {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  comment_ids: Types.ObjectId[]

  @IsArray()
  @ArrayUnique()
  post_ids: number[]
}

export class CommentsStatePayload extends CommentsPayload {
  @IsIn([CommentState.Auditing, CommentState.Deleted, CommentState.Published, CommentState.Spam])
  @IsInt()
  @prop({ enum: CommentState, default: CommentState.Published })
  state: CommentState
}

export const CommentProvider = getProviderByTypegooseClass(Comment)
