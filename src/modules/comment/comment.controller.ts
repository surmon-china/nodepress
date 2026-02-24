/**
 * @file Comment controller
 * @module module/comment/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import _isUndefined from 'lodash/isUndefined'
import type { QueryFilter } from 'mongoose'
import { Get, Post, Patch, Delete, Query, Body, Param, Controller, ParseIntPipe } from '@nestjs/common'
import { BadRequestException } from '@nestjs/common'
import { Throttle, seconds } from '@nestjs/throttler'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { UserService } from '@app/modules/user/user.service'
import { User, UserPublic, USER_PUBLIC_POPULATE_SELECT } from '@app/modules/user/user.model'
import { OnlyIdentity, IdentityRole } from '@app/decorators/only-identity.decorator'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { PermissionPipe } from '@app/pipes/permission.pipe'
import { EventKeys } from '@app/constants/events.constant'
import { SortMode, SortOrder } from '@app/constants/sort.constant'
import { PaginateOptions, PaginateResult } from '@app/utils/paginate'
import { CommentPaginateQueryDto, CommentCalendarQueryDto } from './comment.dto'
import { CreateCommentDto, UpdateCommentDto, CommentIdsDto } from './comment.dto'
import { CommentIdsStatusDto, ClaimCommentsDto } from './comment.dto'
import { Comment, CommentWith } from './comment.model'
import { CommentStatsService } from './comment.service.stats'
import { CommentService } from './comment.service'

@Controller('comments')
export class CommentController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly commentStatsService: CommentStatsService,
    private readonly commentService: CommentService,
    private readonly userService: UserService
  ) {}

  @Post()
  @Throttle({ default: { ttl: seconds(30), limit: 6 } })
  @SuccessResponse('Create comment succeeded')
  async createComment(
    @RequestContext() { visitor, identity }: IRequestContext,
    @Body() input: CreateCommentDto
  ): Promise<CommentWith<UserPublic>> {
    try {
      // User flow: trusted user, no strict email validation required
      if (identity.isUser) {
        const user = await this.userService.findOne(identity.payload!.uid!)
        const userComment = this.commentService.normalize(input, { visitor, user })
        return this.commentService.validateAndCreate(userComment, visitor.referer ?? void 0)
      }

      // Guest flow: enforce author info validation
      const guestComment = this.commentService.normalize(input, { visitor })
      if (!guestComment.author_name || !guestComment.author_email) {
        throw new BadRequestException('Author name and email are required')
      }

      return this.commentService.validateAndCreate(guestComment, visitor.referer ?? void 0)
    } catch (error) {
      this.eventEmitter.emit(EventKeys.CommentCreateFailed, { input, visitor, error })
      throw error
    }
  }

  @Get()
  @SuccessResponse({ message: 'Get comments succeeded', usePaginate: true })
  async getComments(
    @Query(PermissionPipe) query: CommentPaginateQueryDto,
    @RequestContext() { identity }: IRequestContext
  ): Promise<PaginateResult<CommentWith<User> | CommentWith<UserPublic>>> {
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
    // target
    if (!_isUndefined(filters.target_type)) {
      queryFilter.target_type = filters.target_type
    }
    if (!_isUndefined(filters.target_id)) {
      queryFilter.target_id = filters.target_id
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
        { author_email: keywordRegExp }
      ]
    }

    // for admin: original structure data
    if (identity.isAdmin) {
      return await this.commentService.paginate<CommentWith<User>>(queryFilter, {
        ...paginateOptions,
        populate: 'user'
      })
    }

    // for guest: desensitizing personal information
    const result = await this.commentService.paginate<CommentWith<UserPublic>>(queryFilter, {
      ...paginateOptions,
      populate: { path: 'user', select: USER_PUBLIC_POPULATE_SELECT }
    })

    const publicParentSet = await this.commentService.getPublicCommentIdSet(
      result.documents.map((comment) => comment.parent_id).filter((id) => id != null)
    )

    return {
      ...result,
      documents: result.documents.map((document) => {
        document.orphaned = document.parent_id != null && !publicParentSet.has(document.parent_id)
        Reflect.deleteProperty(document, 'ip')
        Reflect.deleteProperty(document, 'author_email')
        return document
      })
    }
  }

  @Get('calendar')
  @SuccessResponse('Get comments calendar succeeded')
  getCommentsCalendar(
    @Query() query: CommentCalendarQueryDto,
    @RequestContext() { identity }: IRequestContext
  ): Promise<Array<{ date: string; count: number }>> {
    return this.commentStatsService.getCalendar(!identity.isAdmin, query.timezone)
  }

  @Patch('claim')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Claim comments succeeded')
  public async claimComments(@Body() dto: ClaimCommentsDto) {
    const user = await this.userService.findOne(dto.user_id)
    return await this.commentService.claimCommentsUser(dto.comment_ids, user._id)
  }

  @Patch('status')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Update comments status succeeded')
  updateCommentsStatus(@Body() dto: CommentIdsStatusDto) {
    return this.commentService.batchUpdateStatus(dto.comment_ids, dto.status)
  }

  @Delete()
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Delete comments succeeded')
  deleteComments(@Body() { comment_ids }: CommentIdsDto) {
    return this.commentService.batchDelete(comment_ids)
  }

  @Get(':id')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Get comment detail succeeded')
  getComment(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
    return this.commentService.getDetail(id)
  }

  @Patch(':id')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Update comment succeeded')
  updateComment(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCommentDto): Promise<Comment> {
    return this.commentService.update(id, dto)
  }

  @Delete(':id')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Delete comment succeeded')
  async deleteComment(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.delete(id)
  }
}
