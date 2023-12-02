/**
 * @file Vote service
 * @module module/vote/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { FilterQuery, QueryOptions } from 'mongoose'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel, MongooseDoc, MongooseID } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { Vote } from './vote.model'

@Injectable()
export class VoteService {
  constructor(@InjectModel(Vote) private readonly voteModel: MongooseModel<Vote>) {}

  public paginator(query: PaginateQuery<Vote>, options: PaginateOptions): Promise<PaginateResult<Vote>> {
    return this.voteModel.paginate(query, options)
  }

  public create(vote: Vote): Promise<MongooseDoc<Vote>> {
    return this.voteModel.create(vote)
  }

  public async update(voteID: MongooseID, newVote: Partial<Vote>): Promise<MongooseDoc<Vote>> {
    const vote = await this.voteModel.findByIdAndUpdate(voteID, newVote, { new: true }).exec()
    if (!vote) {
      throw `Vote '${voteID}' not found`
    }
    return vote
  }

  public async delete(voteID: MongooseID): Promise<MongooseDoc<Vote>> {
    const vote = await this.voteModel.findByIdAndRemove(voteID).exec()
    if (!vote) {
      throw `Vote '${voteID}' not found`
    }
    return vote
  }

  public batchDelete(voteIDs: MongooseID[]) {
    return this.voteModel.deleteMany({ _id: { $in: voteIDs } }).exec()
  }

  public async countDocuments(filter: FilterQuery<Vote>, options?: QueryOptions<Vote>): Promise<number> {
    return await this.voteModel.countDocuments(filter, options).exec()
  }
}
