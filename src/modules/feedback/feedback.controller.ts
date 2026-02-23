/**
 * @file Feedback controller
 * @module module/feedback/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import _isUndefined from 'lodash/isUndefined'
import type { QueryFilter } from 'mongoose'
import { Controller, Get, Patch, Post, Delete, Query, Body, Param, ParseIntPipe } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Throttle, seconds } from '@nestjs/throttler'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { OnlyIdentity, IdentityRole } from '@app/decorators/only-identity.decorator'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { PaginateResult, PaginateOptions } from '@app/utils/paginate'
import { UserService } from '@app/modules/user/user.service'
import { EventKeys } from '@app/constants/events.constant'
import { CreateFeedbackDto, UpdateFeedbackDto, FeedbackPaginateQueryDto, FeedbackIdsDto } from './feedback.dto'
import { Feedback, FeedbackWithUser } from './feedback.model'
import { FeedbackService } from './feedback.service'

@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly userService: UserService,
    private readonly feedbackService: FeedbackService
  ) {}

  @Post()
  @Throttle({ default: { ttl: seconds(30), limit: 5 } })
  @SuccessResponse('Create feedback succeeded')
  async createFeedback(@Body() dto: CreateFeedbackDto, @RequestContext() { visitor, identity }: IRequestContext) {
    const user = identity.isUser ? await this.userService.findOne(identity.payload!.uid!) : void 0
    const created = await this.feedbackService.create(dto, visitor, user)
    this.eventEmitter.emit(EventKeys.FeedbackCreated, created.toObject())
    return created
  }

  @Get()
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse({ message: 'Get feedbacks succeeded', usePaginate: true })
  getFeedbacks(@Query() query: FeedbackPaginateQueryDto): Promise<PaginateResult<FeedbackWithUser>> {
    const { sort, page, per_page, ...filters } = query
    const queryFilter: QueryFilter<Feedback> = {}
    const paginateOptions: PaginateOptions = { page, perPage: per_page, dateSort: sort }

    // emotion
    if (!_isUndefined(filters.emotion)) {
      queryFilter.emotion = filters.emotion
    }
    // marked
    if (!_isUndefined(filters.marked)) {
      queryFilter.marked = filters.marked
    }
    // author type
    if (!_isUndefined(filters.author_type)) {
      queryFilter.author_type = filters.author_type
    }
    // search
    if (filters.keyword) {
      const keywordRegExp = new RegExp(filters.keyword, 'i')
      queryFilter.$or = [
        { content: keywordRegExp },
        { author_name: keywordRegExp },
        { author_email: keywordRegExp },
        { remark: keywordRegExp }
      ]
    }

    return this.feedbackService.paginate<FeedbackWithUser>(queryFilter, {
      ...paginateOptions,
      populate: 'user'
    })
  }

  @Delete()
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Delete feedbacks succeeded')
  deleteFeedbacks(@Body() { feedback_ids }: FeedbackIdsDto) {
    return this.feedbackService.batchDelete(feedback_ids)
  }

  @Patch(':id')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Update feedback succeeded')
  updateFeedback(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFeedbackDto): Promise<Feedback> {
    return this.feedbackService.update(id, dto)
  }

  @Delete(':id')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Delete feedback succeeded')
  deleteFeedback(@Param('id', ParseIntPipe) id: number): Promise<Feedback> {
    return this.feedbackService.delete(id)
  }
}
