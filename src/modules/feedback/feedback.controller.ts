/**
 * @file Feedback controller
 * @module module/feedback/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import _trim from 'lodash/trim'
import _isUndefined from 'lodash/isUndefined'
import { Controller, Get, Put, Post, Delete, Query, Body, UseGuards } from '@nestjs/common'
import { Throttle, seconds } from '@nestjs/throttler'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { EmailService } from '@app/core/helper/helper.service.email'
import { numberToBoolean } from '@app/transformers/value.transformer'
import { FeedbackPaginateQueryDTO, FeedbacksDTO } from './feedback.dto'
import { Feedback, FeedbackBase } from './feedback.model'
import { FeedbackService } from './feedback.service'
import * as APP_CONFIG from '@app/app.config'

@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly emailService: EmailService,
    private readonly feedbackService: FeedbackService
  ) {}

  @Get()
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse({ message: 'Get feedbacks succeeded', usePaginate: true })
  getFeedbacks(@Query() query: FeedbackPaginateQueryDTO): Promise<PaginateResult<Feedback>> {
    const { sort, page, per_page, ...filters } = query
    const paginateQuery: PaginateQuery<Feedback> = {}
    const paginateOptions: PaginateOptions = { page, perPage: per_page, dateSort: sort }
    // target ID
    if (!_isUndefined(filters.tid)) {
      paginateQuery.tid = filters.tid
    }
    // emotion
    if (!_isUndefined(filters.emotion)) {
      paginateQuery.emotion = filters.emotion
    }
    // marked
    if (!_isUndefined(filters.marked)) {
      paginateQuery.marked = numberToBoolean(filters.marked)
    }
    // search
    if (filters.keyword) {
      const trimmed = _trim(filters.keyword)
      const keywordRegExp = new RegExp(trimmed, 'i')
      paginateQuery.$or = [
        { content: keywordRegExp },
        { user_name: keywordRegExp },
        { user_email: keywordRegExp },
        { remark: keywordRegExp }
      ]
    }

    return this.feedbackService.paginate(paginateQuery, paginateOptions)
  }

  @Post()
  @Throttle({ default: { ttl: seconds(30), limit: 5 } })
  @SuccessResponse('Create feedback succeeded')
  async createFeedback(@Body() feedback: FeedbackBase, @RequestContext() { visitor }: IRequestContext) {
    const created = await this.feedbackService.create(feedback, visitor)
    const subject = `You have a new feedback`
    const texts = [
      `${subject} on ${created.tid}.`,
      `Author: ${created.user_name || 'Anonymous user'}`,
      `Emotion: ${created.emotion_emoji} ${created.emotion_text} (${created.emotion})`,
      `Feedback: ${created.content}`
    ]

    this.emailService.sendMailAs(APP_CONFIG.APP_BIZ.FE_NAME, {
      to: APP_CONFIG.APP_BIZ.ADMIN_EMAIL,
      subject,
      text: texts.join('\n'),
      html: texts.map((text) => `<p>${text}</p>`).join('\n')
    })

    return created
  }

  @Delete()
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Delete feedbacks succeeded')
  deleteFeedbacks(@Body() body: FeedbacksDTO) {
    return this.feedbackService.batchDelete(body.feedback_ids)
  }

  @Put(':id')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Update feedback succeeded')
  putFeedback(@RequestContext() { params }: IRequestContext, @Body() feedback: Feedback): Promise<Feedback> {
    return this.feedbackService.update(params.id, feedback)
  }

  @Delete(':id')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Delete feedback succeeded')
  deleteFeedback(@RequestContext() { params }: IRequestContext) {
    return this.feedbackService.delete(params.id)
  }
}
