/**
 * @file User account activity service
 * @module module/account/service.activity
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable, NotFoundException } from '@nestjs/common'
import { MongooseModel, MongooseId } from '@app/interfaces/mongoose.interface'
import { SortOrder } from '@app/constants/sort.constant'
import { InjectModel } from '@app/transformers/model.transformer'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import { CommentStatus, COMMENT_PUBLIC_FILTER } from '@app/modules/comment/comment.constant'
import { Comment } from '@app/modules/comment/comment.model'
import { Vote } from '@app/modules/vote/vote.model'

const logger = createLogger({ scope: 'AccountActivityService', time: isDevEnv })

@Injectable()
export class AccountActivityService {
  constructor(
    @InjectModel(Vote) private readonly voteModel: MongooseModel<Vote>,
    @InjectModel(Comment) private readonly commentModel: MongooseModel<Comment>
  ) {}

  public async getAllVotes(userObjectId: MongooseId): Promise<Vote[]> {
    return this.voteModel.find({ user: userObjectId }).sort({ created_at: SortOrder.Desc }).lean().exec()
  }

  public getAllPublicComments(userObjectId: MongooseId): Promise<Comment[]> {
    return this.commentModel
      .find({ user: userObjectId, ...COMMENT_PUBLIC_FILTER })
      .sort({ created_at: SortOrder.Desc })
      .lean()
      .exec()
  }

  public async deleteComment(userObjectId: MongooseId, commentId: number) {
    const result = await this.commentModel
      .updateOne({ id: commentId, user: userObjectId }, { $set: { status: CommentStatus.Trash } })
      .exec()

    if (result.matchedCount === 0) {
      throw new NotFoundException(`Comment '${commentId}' not found or not yours`)
    }

    return result
  }
}
