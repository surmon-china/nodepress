/**
 * @file Feedback service
 * @module module/feedback/service
 * @author Surmon <https://github.com/surmon-china>
 */

import type { QueryFilter } from 'mongoose'
import { Injectable, NotFoundException } from '@nestjs/common'
import { MongooseModel, MongooseDoc, WithId } from '@app/interfaces/mongoose.interface'
import { InjectModel } from '@app/transformers/model.transformer'
import { PaginateOptions, PaginateResult } from '@app/utils/paginate'
import { QueryVisitor } from '@app/decorators/request-context.decorator'
import { IPService } from '@app/core/helper/helper.service.ip'
import { isProdEnv } from '@app/app.environment'
import { User } from '@app/modules/user/user.model'
import { CreateFeedbackDto, UpdateFeedbackDto } from './feedback.dto'
import { Feedback } from './feedback.model'

@Injectable()
export class FeedbackService {
  constructor(
    private readonly ipService: IPService,
    @InjectModel(Feedback) private readonly feedbackModel: MongooseModel<Feedback>
  ) {}

  public paginate<T = Feedback>(
    filter: QueryFilter<Feedback>,
    options: PaginateOptions
  ): Promise<PaginateResult<T>> {
    return this.feedbackModel.paginateRaw<T>(filter, { ...options, lean: { virtuals: true } })
  }

  public async create(
    input: CreateFeedbackDto,
    visitor: QueryVisitor,
    user?: WithId<User>
  ): Promise<MongooseDoc<Feedback>> {
    return await this.feedbackModel.create({
      ...input,
      user: user?._id ?? null,
      author_name: user?.name ?? input.author_name ?? null,
      author_email: user?.email ?? input.author_email ?? null,
      user_agent: visitor.agent,
      origin: visitor.origin,
      ip: visitor.ip,
      ip_location: isProdEnv && visitor.ip ? await this.ipService.queryLocation(visitor.ip) : null
    })
  }

  public async update(feedbackId: number, input: UpdateFeedbackDto): Promise<MongooseDoc<Feedback>> {
    const updated = await this.feedbackModel
      .findOneAndUpdate({ id: feedbackId }, { $set: input }, { returnDocument: 'after' })
      .exec()
    if (!updated) throw new NotFoundException(`Feedback '${feedbackId}' not found`)
    return updated
  }

  public async delete(feedbackId: number) {
    const deleted = await this.feedbackModel.findOneAndDelete({ id: feedbackId }).exec()
    if (!deleted) throw new NotFoundException(`Feedback '${feedbackId}' not found`)
    return deleted
  }

  public batchDelete(feedbackIds: number[]) {
    return this.feedbackModel.deleteMany({ id: { $in: feedbackIds } }).exec()
  }

  public async getAverageEmotion(): Promise<number | null> {
    const [result] = await this.feedbackModel.aggregate<{ _id: null; avgEmotion: number }>([
      { $group: { _id: null, avgEmotion: { $avg: '$emotion' } } }
    ])
    return result ? Math.round(result.avgEmotion * 1000) / 1000 : null
  }
}
