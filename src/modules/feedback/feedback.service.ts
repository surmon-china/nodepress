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
import { EmailService } from '@app/processors/helper/helper.service.email'
import { QueryVisitor } from '@app/decorators/queryparams.decorator'
import { isProdEnv } from '@app/app.environment'
import * as APP_CONFIG from '@app/app.config'
import { Feedback, FeedbackBase } from './feedback.model'

@Injectable()
export class FeedbackService {
  constructor(
    private readonly ipService: IPService,
    private readonly emailService: EmailService,
    @InjectModel(Feedback) private readonly feedbackModel: MongooseModel<Feedback>
  ) {}

  private async emailToAdmin(feedback: Feedback) {
    const subject = `You have a new feedback`
    const texts = [
      `${subject} on ${feedback.tid}.`,
      `Author: ${feedback.user_name || 'Anonymous user'}`,
      `Emotion: ${feedback.emotion_emoji} ${feedback.emotion_text} (${feedback.emotion})`,
      `Feedback: ${feedback.content}`,
    ]

    this.emailService.sendMailAs(APP_CONFIG.APP.FE_NAME, {
      to: APP_CONFIG.APP.ADMIN_EMAIL,
      subject,
      text: texts.join('\n'),
      html: texts.map((text) => `<p>${text}</p>`).join('\n'),
    })
  }

  public paginater(querys: PaginateQuery<Feedback>, options: PaginateOptions): Promise<PaginateResult<Feedback>> {
    return this.feedbackModel.paginate(querys, options)
  }

  public async create(feedback: FeedbackBase, visitor: QueryVisitor): Promise<MongooseDoc<Feedback>> {
    const ip_location = isProdEnv && visitor.ip ? await this.ipService.queryLocation(visitor.ip) : null
    const succeed = await this.feedbackModel.create({
      ...feedback,
      origin: visitor.origin,
      user_agent: visitor.ua,
      ip: visitor.ip,
      ip_location,
    })
    this.emailToAdmin(succeed)
    return succeed
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
