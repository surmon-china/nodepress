/**
 * @file Feedback service
 * @module module/feedback/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel, MongooseDoc, MongooseID } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { ROOT_FEEDBACK_TID } from '@app/constants/biz.constant'
import { IPService } from '@app/processors/helper/helper.service.ip'
import { QueryVisitor } from '@app/decorators/queryparams.decorator'
import { isProdEnv } from '@app/app.environment'
import { Feedback, FeedbackBase } from './feedback.model'

@Injectable()
export class FeedbackService {
  constructor(
    private readonly ipService: IPService,
    @InjectModel(Feedback) private readonly feedbackModel: MongooseModel<Feedback>
  ) {}

  public paginator(query: PaginateQuery<Feedback>, options: PaginateOptions): Promise<PaginateResult<Feedback>> {
    return this.feedbackModel.paginate(query, options)
  }

  public async create(feedback: FeedbackBase, visitor: QueryVisitor): Promise<MongooseDoc<Feedback>> {
    return this.feedbackModel.create({
      ...feedback,
      origin: visitor.origin,
      user_agent: visitor.ua,
      ip: visitor.ip,
      ip_location: isProdEnv && visitor.ip ? await this.ipService.queryLocation(visitor.ip) : null,
    })
  }

  public getDetail(feedbackID: MongooseID): Promise<MongooseDoc<Feedback>> {
    return this.feedbackModel
      .findById(feedbackID)
      .exec()
      .then((result) => result || Promise.reject(`Feedback '${feedbackID}' not found`))
  }

  public async update(feedbackID: MongooseID, newFeedback: Partial<Feedback>): Promise<MongooseDoc<Feedback>> {
    const feedback = await this.feedbackModel.findByIdAndUpdate(feedbackID, newFeedback, { new: true }).exec()
    if (!feedback) {
      throw `Feedback '${feedbackID}' not found`
    }
    return feedback
  }

  public async delete(feedbackID: MongooseID): Promise<MongooseDoc<Feedback>> {
    const feedback = await this.feedbackModel.findByIdAndRemove(feedbackID).exec()
    if (!feedback) {
      throw `Feedback '${feedbackID}' not found`
    }
    return feedback
  }

  public batchDelete(feedbackIDs: MongooseID[]) {
    return this.feedbackModel.deleteMany({ _id: { $in: feedbackIDs } }).exec()
  }

  public async getRootFeedbackAverageEmotion(): Promise<number> {
    const [result] = await this.feedbackModel.aggregate<{ _id: Types.ObjectId; avgEmotion: number }>([
      { $match: { tid: ROOT_FEEDBACK_TID } },
      { $group: { _id: null, avgEmotion: { $avg: '$emotion' } } },
    ])
    return Math.round(result.avgEmotion * 1000) / 1000
  }
}
