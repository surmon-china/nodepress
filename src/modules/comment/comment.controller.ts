/**
 * Comment controller.
 * @file 评论模块控制器
 * @module module/comment/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash';
import { PaginateResult } from 'mongoose';
import { Controller, Get, Put, Post, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { HumanizedJwtAuthGuard } from '@app/guards/humanized-auth.guard';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { QueryParams, EQueryParamsField } from '@app/decorators/query-params.decorator';
import { ESortType } from '@app/interfaces/state.interface';
import { Comment, CreateCommentBase, DelComments, PatchComments } from './comment.model';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @UseGuards(HumanizedJwtAuthGuard)
  @HttpProcessor.paginate()
  @HttpProcessor.handle('获取评论列表')
  getComments(
    @QueryParams([
      EQueryParamsField.State,
      EQueryParamsField.CommentState,
      'post_id',
    ]) { querys, options, origin },
  ): Promise<PaginateResult<Comment>> {

    // 热门排序
    if (Number(origin.sort) === ESortType.Hot) {
      options.sort = { likes: ESortType.Desc };
    }

    // 关键词搜索
    const keyword = lodash.trim(origin.keyword);
    if (keyword) {
      const keywordRegExp = new RegExp(keyword, 'i');
      querys.$or = [
        { content: keywordRegExp },
        { 'author.name': keywordRegExp },
        { 'author.email': keywordRegExp },
      ];
    }

    return this.commentService.getList(querys, options);
  }

  @Post()
  @HttpProcessor.handle('添加评论')
  createComment(@Body() comment: CreateCommentBase, @QueryParams() { visitors }): Promise<Comment> {
    return this.commentService.create(comment, visitors);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('批量修改评论')
  patchComments(@QueryParams() { visitors }, @Body() body: PatchComments): Promise<Comment> {
    return this.commentService.batchPatchState(body, visitors.referer);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('批量删除评论')
  delComments(@Body() body: DelComments) {
    return this.commentService.batchDelete(body.comment_ids, body.post_ids);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('获取单个评论详情')
  getComment(@QueryParams() { params }): Promise<Comment> {
    return this.commentService.getDetailByNumberId(params.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('修改单个评论')
  putComment(@QueryParams() { params, visitors }, @Body() comment: Comment): Promise<Comment> {
    return this.commentService.update(params.id, comment, visitors.referer);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('删除单个评论')
  delComment(@QueryParams() { params }) {
    return this.commentService.delete(params.id);
  }
}
