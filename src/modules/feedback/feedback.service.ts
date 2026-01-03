/**
 * @file Feedback service
 * @module module/feedback/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose'
import type { QueryFilter } from 'mongoose'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel, MongooseDoc, MongooseId } from '@app/interfaces/mongoose.interface'
import { PaginateOptions, PaginateResult } from '@app/utils/paginate'
import { ROOT_FEEDBACK_TID } from '@app/constants/biz.constant'
import { IPService } from '@app/core/helper/helper.service.ip'
import { QueryVisitor } from '@app/decorators/request-context.decorator'
import { Feedback, FeedbackBase } from './feedback.model'

@Injectable()
export class FeedbackService {
  constructor(
    private readonly ipService: IPService,
    @InjectModel(Feedback) private readonly feedbackModel: MongooseModel<Feedback>
  ) {}

  public paginate(filter: QueryFilter<Feedback>, options: PaginateOptions): Promise<PaginateResult<Feedback>> {
    // MARK: can't use 'lean' with virtual 'emotion_text' | 'emotion_emoji'
    // MARK: keep 'paginate', the 'paginateRaw' method is not available here.
    return this.feedbackModel.paginate(filter, options)
  }

  public async create(feedback: FeedbackBase, visitor: QueryVisitor): Promise<MongooseDoc<Feedback>> {
    return this.feedbackModel.create({
      ...feedback,
      origin: visitor.origin,
      user_agent: visitor.ua,
      ip: visitor.ip,
      ip_location: visitor.ip ? await this.ipService.queryLocation(visitor.ip) : null
    })
  }

  public async update(feedbackId: MongooseId, newFeedback: Partial<Feedback>): Promise<MongooseDoc<Feedback>> {
    const updated = await this.feedbackModel.findByIdAndUpdate(feedbackId, newFeedback, { new: true }).exec()
    if (!updated) throw new NotFoundException(`Feedback '${feedbackId}' not found`)
    return updated
  }

  public async delete(feedbackId: MongooseId) {
    const deleted = await this.feedbackModel.findByIdAndDelete(feedbackId, null).exec()
    if (!deleted) throw new NotFoundException(`Feedback '${feedbackId}' not found`)
    return deleted
  }

  public batchDelete(feedbackIds: MongooseId[]) {
    return this.feedbackModel.deleteMany({ _id: { $in: feedbackIds } }).exec()
  }

  public async getRootFeedbackAverageEmotion(): Promise<number | null> {
    const [result] = await this.feedbackModel.aggregate<{ _id: Types.ObjectId; avgEmotion: number }>([
      { $match: { tid: ROOT_FEEDBACK_TID } },
      { $group: { _id: null, avgEmotion: { $avg: '$emotion' } } }
    ])
    return result ? Math.round(result.avgEmotion * 1000) / 1000 : null
  }
}
