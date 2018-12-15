/**
 * AnnouncementCtrl module.
 * @file 公告控制器模块
 * @module controller/announcement
 * @author Surmon <https://github.com/surmon-china>
 */

const authIsVerified = require('np-utils/np-auth');
const Announcement = require('np-model/announcement.model');
const { arrayIsInvalid } = require('np-helper/np-data-validate');
const { PUBLISH_STATE, SORT_TYPE } = require('np-core/np-constants');
const {
  handleError,
  handleSuccess,
  humanizedHandleError,
  humanizedHandleSuccess,
  handlePaginateData,
  buildController,
  initController,
} = require('np-core/np-processor');

// controller
const AnnouncementCtrl = initController(['list', 'item']);

// 获取公告列表
AnnouncementCtrl.list.GET = (req, res) => {

  // 初始参数
  const keyword = req.query.keyword;
  const [page, per_page, state] = [
    req.query.page || 1,
    req.query.per_page,
    req.query.state,
  ].map(k => Number(k));

  // 过滤条件
  const options = {
    page,
    sort: { _id: SORT_TYPE.desc },
  };

  if (!isNaN(per_page)) {
    options.limit = per_page;
  }

  // 查询参数
  const query = {};

  // 关键词查询
  if (keyword) {
    query.content = new RegExp(keyword);
  }

  // 按照 type 查询
  if ([PUBLISH_STATE.draft, PUBLISH_STATE.published].includes(state)) {
    query.state = state;
  }

  // 如果是前台请求，则重置公开状态和发布状态
  if (!authIsVerified(req)) {
    query.state = PUBLISH_STATE.published;
  }

  // 请求
  Announcement.paginate(query, options)
    .then(announcements => {
      handleSuccess({
        res,
        message: '公告列表获取成功',
        result: handlePaginateData(announcements),
      });
    })
    .catch(humanizedHandleError(res, '公告列表获取失败'));
};

// 发布公告
AnnouncementCtrl.list.POST = ({ body: announcement }, res) => {
  new Announcement(announcement).save()
    .then(humanizedHandleSuccess(res, '公告发布成功'))
    .catch(humanizedHandleError(res, '公告发布失败'));
};

// 批量删除公告
AnnouncementCtrl.list.DELETE = ({ body: { announcements }}, res) => {

  // 验证
  if (arrayIsInvalid(announcements)) {
    return handleError({ res, message: '缺少有效参数' });
  }

  // 删除
  Announcement.deleteMany({ _id: { $in: announcements }})
    .then(humanizedHandleSuccess(res, '公告批量删除成功'))
    .catch(humanizedHandleError(res, '公告批量删除失败'));
};

// 修改单个公告
AnnouncementCtrl.item.PUT = ({ params: { announcement_id }, body: announcement }, res) => {

  if (!announcement.content) {
    return handleError({ res, message: '内容不合法' });
  }

  Announcement.findByIdAndUpdate(announcement_id, announcement, { new: true })
    .then(humanizedHandleSuccess(res, '公告修改成功'))
    .catch(humanizedHandleError(res, '公告修改失败'));
};

// 删除单个公告
AnnouncementCtrl.item.DELETE = ({ params: { announcement_id }}, res) => {
  Announcement.findByIdAndRemove(announcement_id)
    .then(humanizedHandleSuccess(res, '公告删除成功'))
    .catch(humanizedHandleError(res, '公告删除失败'));
};

exports.list = buildController(AnnouncementCtrl.list);
exports.item = buildController(AnnouncementCtrl.item);

import {Get, Post, Body, Put, Delete, Query, Param, Controller} from '@nestjs/common';
import { Request } from 'express';
import { ArticleService } from './article.service';
import { CreateArticleDto, CreateCommentDto } from './dto';
import { ArticlesRO, ArticleRO } from './article.interface';
import { CommentsRO } from './article.interface';
import { User } from '../user/user.decorator';

import {
  ApiUseTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUseTags('articles')
@Controller('articles')
export class ArticleController {

  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ title: 'Get all articles' })
  @ApiResponse({ status: 200, description: 'Return all articles.'})
  @Get()
  async findAll(@Query() query): Promise<ArticlesRO> {
    return await this.articleService.findAll(query);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug): Promise<ArticleRO> {
    return await this.articleService.findOne({slug});
  }

  @Get(':slug/comments')
  async findComments(@Param('slug') slug): Promise<CommentsRO> {
    return await this.articleService.findComments(slug);
  }

  @ApiOperation({ title: 'Create article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(@User('id') userId: number, @Body('article') articleData: CreateArticleDto) {
    return this.articleService.create(userId, articleData);
  }

  @ApiOperation({ title: 'Update article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully updated.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':slug')
  async update(@Param() params, @Body('article') articleData: CreateArticleDto) {
    // Todo: update slug also when title gets changed
    return this.articleService.update(params.slug, articleData);
  }

  @ApiOperation({ title: 'Delete article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug')
  async delete(@Param() params) {
    return this.articleService.delete(params.slug);
  }

  @ApiOperation({ title: 'Create comment' })
  @ApiResponse({ status: 201, description: 'The comment has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/comments')
  async createComment(@Param('slug') slug, @Body('comment') commentData: CreateCommentDto) {
    return await this.articleService.addComment(slug, commentData);
  }

  @ApiOperation({ title: 'Delete comment' })
  @ApiResponse({ status: 201, description: 'The article has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug/comments/:id')
  async deleteComment(@Param() params) {
    const {slug, id} = params;
    return await this.articleService.deleteComment(slug, id);
  }

  @ApiOperation({ title: 'Favorite article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully favorited.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/favorite')
  async favorite(@User('id') userId: number, @Param('slug') slug) {
    return await this.articleService.favorite(userId, slug);
  }

  @ApiOperation({ title: 'Unfavorite article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully unfavorited.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug/favorite')
  async unFavorite(@User('id') userId: number, @Param('slug') slug) {
    return await this.articleService.unFavorite(userId, slug);
  }

  @ApiOperation({ title: 'Get article feed' })
  @ApiResponse({ status: 200, description: 'Return article feed.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('feed')
  async getFeed(@User('id') userId: number, @Query() query): Promise<ArticlesRO> {
    return await this.articleService.findFeed(userId, query);
  }

}
