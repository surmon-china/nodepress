/**
 * @file Comment controller
 * @module module/comment/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import { Controller, Get, Put, Post, Patch, Delete, Query, Body, UseGuards, HttpStatus } from '@nestjs/common'
import { Throttle, seconds } from '@nestjs/throttler'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminMaybeGuard } from '@app/guards/admin-maybe.guard'
import { PermissionPipe } from '@app/pipes/permission.pipe'
import { ExposePipe } from '@app/pipes/expose.pipe'
import { SortType } from '@app/constants/biz.constant'
import { Responser } from '@app/decorators/responser.decorator'
import { QueryParams, QueryParamsResult } from '@app/decorators/queryparams.decorator'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { CommentPaginateQueryDTO, CommentCalendarQueryDTO, CommentsDTO, CommentsStateDTO } from './comment.dto'
import { CommentService } from './comment.service'
import { Comment, CommentBase } from './comment.model'

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @UseGuards(AdminMaybeGuard)
  @Responser.paginate()
  @Responser.handle('Get comments')
  getComments(
    @Query(PermissionPipe, ExposePipe) query: CommentPaginateQueryDTO,
    @QueryParams() { isUnauthenticated }: QueryParamsResult
  ): Promise<PaginateResult<Comment>> {
    const { sort, page, per_page, ...filters } = query
    const paginateQuery: PaginateQuery<Comment> = {}
    const paginateOptions: PaginateOptions = { page, perPage: per_page }

    // sort
    if (!lodash.isUndefined(sort)) {
      if (sort === SortType.Hottest) {
        paginateOptions.sort = { likes: SortType.Desc }
      } else {
        paginateOptions.dateSort = sort
      }
    }

    // state
    if (!lodash.isUndefined(filters.state)) {
      paginateQuery.state = filters.state
    }

    // post ID
    if (!lodash.isUndefined(filters.post_id)) {
      paginateQuery.post_id = filters.post_id
    }

    // search
    if (filters.keyword) {
      const trimmed = lodash.trim(filters.keyword)
      const keywordRegExp = new RegExp(trimmed, 'i')
      paginateQuery.$or = [
        { content: keywordRegExp },
        { 'author.name': keywordRegExp },
        { 'author.email': keywordRegExp }
      ]
    }

    return this.commentService.paginator(paginateQuery, paginateOptions, isUnauthenticated)
  }

  @Get('calendar')
  @UseGuards(AdminMaybeGuard)
  @Responser.handle('Get comment calendar')
  getCommentCalendar(
    @Query(ExposePipe) query: CommentCalendarQueryDTO,
    @QueryParams() { isUnauthenticated }: QueryParamsResult
  ) {
    return this.commentService.getCalendar(isUnauthenticated, query.timezone)
  }

  @Post()
  @Throttle({ default: { ttl: seconds(30), limit: 6 } })
  @Responser.handle('Create comment')
  createComment(@Body() comment: CommentBase, @QueryParams() { visitor }: QueryParamsResult): Promise<Comment> {
    return comment.author.email
      ? this.commentService.createFormClient(comment, visitor)
      : Promise.reject(`author email should not be empty`)
  }

  @Patch()
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Update comments')
  patchComments(@QueryParams() { visitor }: QueryParamsResult, @Body() body: CommentsStateDTO) {
    return this.commentService.batchPatchState(body, visitor.referer)
  }

  @Delete()
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Delete comments')
  delComments(@Body() body: CommentsDTO) {
    return this.commentService.batchDelete(body.comment_ids, body.post_ids)
  }

  @Get(':id')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle({ message: 'Get comment detail', error: HttpStatus.NOT_FOUND })
  getComment(@QueryParams() { params }: QueryParamsResult): Promise<Comment> {
    return this.commentService.getDetailByObjectId(params.id).then((comment) => {
      return comment ? comment : Promise.reject('Comment not found')
    })
  }

  @Put(':id')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Update comment')
  putComment(@QueryParams() { params, visitor }: QueryParamsResult, @Body() comment: Comment): Promise<Comment> {
    return this.commentService.update(params.id, comment, visitor.referer)
  }

  @Put(':id/ip_location')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Update comment IP location')
  putCommentIPLocation(@QueryParams() { params }: QueryParamsResult) {
    return this.commentService.reviseIPLocation(params.id)
  }

  @Delete(':id')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Delete comment')
  delComment(@QueryParams() { params }: QueryParamsResult) {
    return this.commentService.delete(params.id)
  }
}
