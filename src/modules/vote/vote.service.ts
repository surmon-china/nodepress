/**
 * @file Vote service
 * @module module/vote/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable, NotFoundException } from '@nestjs/common'
import { FilterQuery, MongooseBaseQueryOptions } from 'mongoose'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel, MongooseDoc, MongooseId } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { Vote } from './vote.model'

@Injectable()
export class VoteService {
  constructor(@InjectModel(Vote) private readonly voteModel: MongooseModel<Vote>) {}

  public paginate(query: PaginateQuery<Vote>, options: PaginateOptions): Promise<PaginateResult<Vote>> {
    return this.voteModel.paginate(query, options)
  }

  public create(vote: Vote): Promise<MongooseDoc<Vote>> {
    return this.voteModel.create(vote)
  }

  public async update(voteId: MongooseId, newVote: Partial<Vote>): Promise<MongooseDoc<Vote>> {
    const updated = await this.voteModel.findByIdAndUpdate(voteId, newVote, { new: true }).exec()
    if (!updated) throw new NotFoundException(`Vote '${voteId}' not found`)
    return updated
  }

  public async delete(voteId: MongooseId) {
    const deleted = await this.voteModel.findByIdAndDelete(voteId, null).exec()
    if (!deleted) throw new NotFoundException(`Vote '${voteId}' not found`)
    return deleted
  }

  public batchDelete(voteIds: MongooseId[]) {
    return this.voteModel.deleteMany({ _id: { $in: voteIds } }).exec()
  }

  public async countDocuments(
    filter: FilterQuery<Vote>,
    options?: MongooseBaseQueryOptions<Vote>
  ): Promise<number> {
    return await this.voteModel.countDocuments(filter, options).exec()
  }
}
