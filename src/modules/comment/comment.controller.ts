/**
 * @file Comment controller
 * @module module/comment/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import { Controller, Get, Put, Post, Patch, Delete, Body, UseGuards, HttpStatus } from '@nestjs/common'
import { JwtAuthGuard } from '@app/guards/auth.guard'
import { HumanizedJwtAuthGuard } from '@app/guards/humanized-auth.guard'
import { HttpProcessor } from '@app/decorators/http.decorator'
import { PaginateResult } from '@app/utils/paginate'
import { QueryParams, QueryParamsField } from '@app/decorators/query-params.decorator'
import { SortType } from '@app/interfaces/biz.interface'
import { CommentService } from './comment.service'
import { Comment, CreateCommentBase, CommentsPayload, CommentsStatePayload } from './comment.model'

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @UseGuards(HumanizedJwtAuthGuard)
  @HttpProcessor.paginate()
  @HttpProcessor.handle('Get comment list')
  getComments(
    @QueryParams([QueryParamsField.State, QueryParamsField.CommentState, 'post_id'])
    { querys, options, origin, isAuthenticated }
  ): Promise<PaginateResult<Comment>> {
    // 热门排序
    if (Number(origin.sort) === SortType.Hot) {
      options.sort = { likes: SortType.Desc }
    }

    // 关键词搜索
    const keyword = lodash.trim(origin.keyword)
    if (keyword) {
      const keywordRegExp = new RegExp(keyword, 'i')
      querys.$or = [{ content: keywordRegExp }, { 'author.name': keywordRegExp }, { 'author.email': keywordRegExp }]
    }

    return this.commentService.paginater(querys, options, !isAuthenticated)
  }

  @Post()
  @HttpProcessor.handle('Create comment')
  createComment(@Body() comment: CreateCommentBase, @QueryParams() { visitor }): Promise<Comment> {
    return this.commentService.createFormClient(comment, visitor)
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Update comments')
  patchComments(@QueryParams() { visitor }, @Body() body: CommentsStatePayload) {
    return this.commentService.batchPatchState(body, visitor.referer)
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Delete comments')
  delComments(@Body() body: CommentsPayload) {
    return this.commentService.batchDelete(body.comment_ids, body.post_ids)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle({ message: 'Get comment detail', error: HttpStatus.NOT_FOUND })
  getComment(@QueryParams() { params }): Promise<Comment> {
    return this.commentService.getDetailByNumberID(params.id).then((comment) => {
      return comment ? comment : Promise.reject('Comment not found')
    })
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Update comment')
  putComment(@QueryParams() { params, visitor }, @Body() comment: Comment): Promise<Comment> {
    return this.commentService.update(params.id, comment, visitor.referer)
  }

  @Put(':id/ip_location')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Update comment IP location')
  putCommentIPLocation(@QueryParams() { params }) {
    return this.commentService.reviseIPLocation(params.id)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Delete comment')
  delComment(@QueryParams() { params }) {
    return this.commentService.delete(params.id)
  }
}
