/**
 * @file Feedback controller
 * @module module/feedback/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import { Controller, Get, Put, Post, Delete, Query, Body, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { ExposePipe } from '@app/pipes/expose.pipe'
import { Responsor } from '@app/decorators/responsor.decorator'
import { QueryParams, QueryParamsResult } from '@app/decorators/queryparams.decorator'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { numberToBoolean } from '@app/transformers/value.transformer'
import { FeedbackPaginateQueryDTO, FeedbacksDTO } from './feedback.dto'
import { Feedback, FeedbackBase } from './feedback.model'
import { FeedbackService } from './feedback.service'

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  @UseGuards(AdminOnlyGuard)
  @Responsor.paginate()
  @Responsor.handle('Get feedbacks')
  getFeedbacks(@Query(ExposePipe) query: FeedbackPaginateQueryDTO): Promise<PaginateResult<Feedback>> {
    const { sort, page, per_page, ...filters } = query
    const paginateQuery: PaginateQuery<Feedback> = {}
    const paginateOptions: PaginateOptions = { page, perPage: per_page, dateSort: sort }
    // target ID
    if (!lodash.isUndefined(filters.tid)) {
      paginateQuery.tid = filters.tid
    }
    // emotion
    if (!lodash.isUndefined(filters.emotion)) {
      paginateQuery.emotion = filters.emotion
    }
    // marked
    if (!lodash.isUndefined(filters.marked)) {
      paginateQuery.marked = numberToBoolean(filters.marked)
    }
    // search
    if (filters.keyword) {
      const trimmed = lodash.trim(filters.keyword)
      const keywordRegExp = new RegExp(trimmed, 'i')
      paginateQuery.$or = [
        { content: keywordRegExp },
        { user_name: keywordRegExp },
        { user_email: keywordRegExp },
        { remark: keywordRegExp },
      ]
    }

    return this.feedbackService.paginater(paginateQuery, paginateOptions)
  }

  // 30 seconds > limit 3
  @Throttle(3, 30)
  @Post()
  @Responsor.handle('Create feedback')
  createFeedback(@Body() feedback: FeedbackBase, @QueryParams() { visitor }: QueryParamsResult): Promise<Feedback> {
    return this.feedbackService.create(feedback, visitor)
  }

  @Delete()
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Delete feedbacks')
  deleteFeedbacks(@Body() body: FeedbacksDTO) {
    return this.feedbackService.batchDelete(body.feedback_ids)
  }

  @Put(':id')
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Update feedback')
  putFeedback(@QueryParams() { params }: QueryParamsResult, @Body() feedback: Feedback): Promise<Feedback> {
    return this.feedbackService.update(params.id, feedback)
  }

  @Delete(':id')
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Delete feedback')
  deleteFeedback(@QueryParams() { params }: QueryParamsResult) {
    return this.feedbackService.delete(params.id)
  }
}
