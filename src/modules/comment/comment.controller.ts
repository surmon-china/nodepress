/**
 * @file Comment controller
 * @module module/comment/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import _trim from 'lodash/trim'
import _isUndefined from 'lodash/isUndefined'
import type { QueryFilter } from 'mongoose'
import { Controller, Get, Put, Post, Patch, Delete, Query, Body, UseGuards } from '@nestjs/common'
import { Throttle, seconds } from '@nestjs/throttler'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminOptionalGuard } from '@app/guards/admin-optional.guard'
import { PermissionPipe } from '@app/pipes/permission.pipe'
import { SortMode, SortOrder } from '@app/constants/biz.constant'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { PaginateOptions, PaginateResult } from '@app/utils/paginate'
import { CommentPaginateQueryDTO, CommentCalendarQueryDTO, CommentsDTO, CommentsStatusDTO } from './comment.dto'
import { CommentService } from './comment.service'
import { Comment, CommentBase } from './comment.model'

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @UseGuards(AdminOptionalGuard)
  @SuccessResponse({ message: 'Get comments succeeded', usePaginate: true })
  async getComments(
    @Query(PermissionPipe) query: CommentPaginateQueryDTO,
    @RequestContext() { isUnauthenticated }: IRequestContext
  ): Promise<PaginateResult<Comment>> {
    const { sort, page, per_page, ...filters } = query
    const queryFilter: QueryFilter<Comment> = {}
    const paginateOptions: PaginateOptions = { page, perPage: per_page }

    // sort
    if (!_isUndefined(sort)) {
      if (sort === SortMode.Hottest) {
        paginateOptions.sort = { likes: SortOrder.Desc }
      } else {
        paginateOptions.dateSort = sort
      }
    }

    // status
    if (!_isUndefined(filters.status)) {
      queryFilter.status = filters.status
    }

    // post ID
    if (!_isUndefined(filters.post_id)) {
      queryFilter.post_id = filters.post_id
    }

    // search
    if (filters.keyword) {
      const trimmed = _trim(filters.keyword)
      const keywordRegExp = new RegExp(trimmed, 'i')
      queryFilter.$or = [
        { content: keywordRegExp },
        { 'author.name': keywordRegExp },
        { 'author.email': keywordRegExp }
      ]
    }

    const result = await this.commentService.paginate(queryFilter, paginateOptions)
    // for admin: original structure data
    if (!isUnauthenticated) return result
    // for guest: desensitizing personal information
    return {
      ...result,
      documents: result.documents.map((document) => {
        const comment = document.toObject()
        Reflect.deleteProperty(comment, 'ip')
        Reflect.deleteProperty(comment.author, 'email')
        return comment
      })
    }
  }

  @Get('calendar')
  @UseGuards(AdminOptionalGuard)
  @SuccessResponse('Get comments calendar succeeded')
  getCommentsCalendar(
    @Query() query: CommentCalendarQueryDTO,
    @RequestContext() { isUnauthenticated }: IRequestContext
  ) {
    return this.commentService.getCalendar(isUnauthenticated, query.timezone)
  }

  @Post()
  @Throttle({ default: { ttl: seconds(30), limit: 6 } })
  @SuccessResponse('Create comment succeeded')
  createComment(@Body() comment: CommentBase, @RequestContext() { visitor }: IRequestContext): Promise<Comment> {
    return this.commentService.createFormClient(comment, visitor)
  }

  @Patch()
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Update comments succeeded')
  patchComments(@RequestContext() { visitor }: IRequestContext, @Body() body: CommentsStatusDTO) {
    return this.commentService.batchPatchStatus(body, visitor.referer)
  }

  @Delete()
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Delete comments succeeded')
  delComments(@Body() body: CommentsDTO) {
    return this.commentService.batchDelete(body.comment_ids, body.post_ids)
  }

  @Get(':id')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Get comment detail succeeded')
  getComment(@RequestContext() { params }: IRequestContext): Promise<Comment> {
    return this.commentService.getDetailByObjectId(params.id)
  }

  @Put(':id')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Update comment succeeded')
  putComment(@RequestContext() { params, visitor }: IRequestContext, @Body() comment: Comment): Promise<Comment> {
    return this.commentService.update(params.id, comment, visitor.referer)
  }

  @Put(':id/ip_location')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Update comment IP location succeeded')
  putCommentIPLocation(@RequestContext() { params }: IRequestContext) {
    return this.commentService.reviseIPLocation(params.id)
  }

  @Delete(':id')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Delete comment succeeded')
  delComment(@RequestContext() { params }: IRequestContext) {
    return this.commentService.delete(params.id)
  }
}
