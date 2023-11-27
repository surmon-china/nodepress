/**
 * @file Vote model
 * @module module/vote/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, plugin, modelOptions, Severity } from '@typegoose/typegoose'
import { IsString, IsIP, IsIn, IsInt, IsOptional, IsNotEmpty } from 'class-validator'
import { GENERAL_AUTO_INCREMENT_ID_CONFIG } from '@app/constants/increment.constant'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { mongoosePaginate } from '@app/utils/paginate'
import { IPLocation } from '@app/processors/helper/helper.service.ip'

export enum VoteTarget {
  Post = 1,
  Comment = 2
}

export enum VoteType {
  Upvote = 1,
  Downvote = -1
}

export const voteTypeMap = new Map([
  [VoteType.Upvote, '+1'],
  [VoteType.Downvote, '-1']
])

export enum VoteAuthorType {
  Anonymous = 0,
  Guest = 1,
  Disqus = 2
}

export const VOTE_TYPES = [VoteType.Upvote, VoteType.Downvote] as const
export const VOTE_TARGETS = [VoteTarget.Post, VoteTarget.Comment] as const
export const VOTE_AUTHOR_TYPES = [VoteAuthorType.Anonymous, VoteAuthorType.Guest, VoteAuthorType.Disqus] as const

@plugin(mongoosePaginate)
@plugin(AutoIncrementID, GENERAL_AUTO_INCREMENT_ID_CONFIG)
@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
})
export class Vote {
  @prop({ unique: true })
  id?: number

  @IsIn(VOTE_TARGETS)
  @IsInt()
  @IsNotEmpty()
  @prop({ required: true, index: true })
  target_type: number

  @IsInt()
  @IsNotEmpty()
  @prop({ required: true, index: true })
  target_id: number

  @IsIn(VOTE_TYPES)
  @IsInt()
  @IsNotEmpty()
  @prop({ required: true, index: true })
  vote_type: number

  @IsIn(VOTE_AUTHOR_TYPES)
  @IsInt()
  @IsNotEmpty()
  @prop({ required: true, index: true })
  author_type: number

  @prop({ type: Object, default: null })
  author: Record<string, any> | null

  // IP address
  @IsIP()
  @IsOptional()
  @prop({ type: String, default: null })
  ip: string | null

  // IP location
  @prop({ type: Object, default: null })
  ip_location: Partial<IPLocation> | null

  // user agent
  @IsString()
  @prop({ type: String, default: null })
  user_agent?: string | null

  @prop({ default: Date.now, immutable: true })
  created_at?: Date

  @prop({ default: Date.now })
  updated_at?: Date
}

export const VoteProvider = getProviderByTypegooseClass(Vote)
