/**
 * @file Vote service
 * @module module/vote/service
 * @author Surmon <https://github.com/surmon-china>
 */

import type { QueryFilter } from 'mongoose'
import { Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { InjectModel } from '@app/transformers/model.transformer'
import { PaginateOptions, PaginateResult } from '@app/utils/paginate'
import { GlobalEventKey } from '@app/constants/events.constant'
import { User } from '@app/modules/user/user.model'
import { Vote, VoteDocWithUser, NormalizedVote } from './vote.model'

@Injectable()
export class VoteService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectModel(Vote) private readonly voteModel: MongooseModel<Vote>
  ) {}

  public countDocuments(filter: QueryFilter<Vote>): Promise<number> {
    return this.voteModel.countDocuments(filter).lean().exec()
  }

  public paginate<T = Vote>(filter: QueryFilter<Vote>, options: PaginateOptions): Promise<PaginateResult<T>> {
    return this.voteModel.paginateRaw<T>(filter, { ...options, lean: { virtuals: true } })
  }

  public async create(vote: NormalizedVote): Promise<VoteDocWithUser> {
    const created = await this.voteModel.create(vote)
    const populated = await created.populate<{ user: User | null }>('user')
    this.eventEmitter.emit(GlobalEventKey.VoteCreated, populated.toObject())
    return populated
  }

  public async delete(voteId: number): Promise<Vote> {
    const deleted = await this.voteModel.findOneAndDelete({ id: voteId }).exec()
    if (!deleted) throw new NotFoundException(`Vote '${voteId}' not found`)
    return deleted
  }

  public batchDelete(voteIds: number[]) {
    return this.voteModel.deleteMany({ id: { $in: voteIds } }).exec()
  }
}
