/**
 * @file Vote model
 * @module module/vote/model
 * @author Surmon <https://github.com/surmon-china>
 */

import type { MergeType } from 'mongoose'
import MongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, plugin, modelOptions, Ref, Severity } from '@typegoose/typegoose'
import { GENERAL_DB_AUTO_INCREMENT_ID_CONFIG } from '@app/constants/database.constant'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { MongooseDoc } from '@app/interfaces/mongoose.interface'
import { mongoosePaginate } from '@app/utils/paginate'
import { User } from '@app/modules/user/user.model'
import { IPLocation } from '@app/core/helper/helper.service.ip'
import { VoteTargetType, VoteType, VoteAuthorType } from './vote.constant'

export type VoteDoc = MongooseDoc<Vote>
export type VoteWithUser = MergeType<Vote, { user: User | null }>
export type VoteDocWithUser = MergeType<VoteDoc, { user: User | null }>

export type NormalizedVote = Omit<Vote, 'id' | 'created_at' | 'updated_at' | 'author_type'>

@plugin(mongoosePaginate)
@plugin(MongooseLeanVirtuals)
@plugin(AutoIncrementID, GENERAL_DB_AUTO_INCREMENT_ID_CONFIG)
@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    id: false,
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
  id: number

  @prop({ type: String, enum: VoteTargetType, required: true, index: true })
  target_type: VoteTargetType

  @prop({ type: Number, required: true, index: true })
  target_id: number

  @prop({ type: Number, enum: VoteType, required: true, index: true })
  vote_type: VoteType

  @prop({ type: String, default: null })
  author_name: string | null

  @prop({ type: String, default: null })
  author_email: string | null

  @prop({ ref: () => User, default: null, index: true })
  user: Ref<User> | null

  public get author_type(): VoteAuthorType {
    if (this.user) return VoteAuthorType.User
    if (this.author_name) return VoteAuthorType.Guest
    return VoteAuthorType.Anonymous
  }

  @prop({ type: String, default: null })
  ip: string | null

  @prop({ type: Object, default: null })
  ip_location: Partial<IPLocation> | null

  @prop({ type: String, default: null })
  user_agent: string | null

  @prop({ type: Date, default: Date.now, immutable: true })
  created_at?: Date

  @prop({ type: Date, default: Date.now })
  updated_at?: Date
}

export const VoteProvider = getProviderByTypegooseClass(Vote)
