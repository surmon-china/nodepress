/**
 * @file Article controller
 * @module module/article/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import _trim from 'lodash/trim'
import _isInteger from 'lodash/isInteger'
import _isUndefined from 'lodash/isUndefined'
import { Types } from 'mongoose'
import type { QueryFilter } from 'mongoose'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Controller, Get, Put, Post, Patch, Delete, Query, Body, UseGuards } from '@nestjs/common'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { PermissionPipe } from '@app/pipes/permission.pipe'
import { AdminOptionalGuard } from '@app/guards/admin-optional.guard'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { EventKeys } from '@app/constants/events.constant'
import { SortMode } from '@app/constants/biz.constant'
import { TagService } from '@app/modules/tag/tag.service'
import { CategoryService } from '@app/modules/category/category.service'
import { PaginateResult, PaginateOptions } from '@app/utils/paginate'
import { ArticlePaginateQueryDTO, ArticleCalendarQueryDTO, ArticleIdsDTO, ArticlesStatusDTO } from './article.dto'
import { ARTICLE_HOTTEST_SORT_CONFIG } from './article.constant'
import { ArticleService } from './article.service'
import { Article } from './article.model'

@Controller('article')
export class ArticleController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
    private readonly articleService: ArticleService
  ) {}

  @Get()
  @UseGuards(AdminOptionalGuard)
  @SuccessResponse({ message: 'Get articles succeeded', usePaginate: true })
  async getArticles(@Query(PermissionPipe) query: ArticlePaginateQueryDTO): Promise<PaginateResult<Article>> {
    const { page, per_page, sort, ...filters } = query
    const queryFilter: QueryFilter<Article> = {}
    const paginateOptions: PaginateOptions = { page, perPage: per_page }

    // sort
    if (!_isUndefined(sort)) {
      if (sort === SortMode.Hottest) {
        paginateOptions.sort = ARTICLE_HOTTEST_SORT_CONFIG
      } else {
        paginateOptions.dateSort = sort
      }
    }

    // states
    if (!_isUndefined(filters.status)) {
      queryFilter.status = filters.status
    }
    if (!_isUndefined(filters.origin)) {
      queryFilter.origin = filters.origin
    }
    if (!_isUndefined(filters.featured)) {
      queryFilter.featured = filters.featured
    }
    if (!_isUndefined(filters.lang)) {
      queryFilter.lang = filters.lang
    }

    // search
    if (filters.keyword) {
      const trimmed = _trim(filters.keyword)
      const keywordRegExp = new RegExp(trimmed, 'i')
      queryFilter.$or = [{ title: keywordRegExp }, { content: keywordRegExp }, { summary: keywordRegExp }]
    }

    // date
    if (filters.date) {
      const queryDateMS = new Date(filters.date).getTime()
      queryFilter.created_at = {
        $gte: new Date((queryDateMS / 1000 - 60 * 60 * 8) * 1000),
        $lt: new Date((queryDateMS / 1000 + 60 * 60 * 16) * 1000)
      }
    }

    // tag | category
    if (filters.tag_slug) {
      const tag = await this.tagService.getDetailBySlug(filters.tag_slug)
      queryFilter.tags = tag._id
    }
    if (filters.category_slug) {
      const category = await this.categoryService.getDetailBySlug(filters.category_slug)
      queryFilter.categories = category._id
    }

    // paginate
    return this.articleService.paginate(queryFilter, paginateOptions)
  }

  @Get('all')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Get all articles succeeded')
  getAllArticles() {
    return this.articleService.getAll()
  }

  @Get('calendar')
  @UseGuards(AdminOptionalGuard)
  @SuccessResponse('Get articles calendar succeeded')
  getArticlesCalendar(
    @Query() query: ArticleCalendarQueryDTO,
    @RequestContext() { isUnauthenticated }: IRequestContext
  ) {
    return this.articleService.getCalendar(isUnauthenticated, query.timezone)
  }

  @Get(':id/context')
  @SuccessResponse('Get context articles succeeded')
  async getArticleContext(@RequestContext() { params }: IRequestContext) {
    const articleId = Number(params.id)
    const [prevArticles, nextArticles, relatedArticles] = await Promise.all([
      this.articleService.getNearArticles(articleId, 'early', 1),
      this.articleService.getNearArticles(articleId, 'later', 1),
      this.articleService
        .getDetailByNumberIdOrSlug({ numberId: articleId, publicOnly: true, lean: true })
        .then((article) => this.articleService.getRelatedArticles(article, 20))
    ])
    return {
      prev_article: prevArticles?.[0] || null,
      next_article: nextArticles?.[0] || null,
      related_articles: relatedArticles || []
    }
  }

  @Get(':id')
  @UseGuards(AdminOptionalGuard)
  @SuccessResponse('Get article detail succeeded')
  async getArticle(@RequestContext() { params, isUnauthenticated }: IRequestContext): Promise<Article> {
    // Guest user > number ID | slug
    if (isUnauthenticated) {
      const isNumberTypeId = _isInteger(Number(params.id))
      const article = await this.articleService.getDetailByNumberIdOrSlug({
        numberId: isNumberTypeId ? Number(params.id) : undefined,
        slug: isNumberTypeId ? undefined : String(params.id),
        publicOnly: true,
        populate: true,
        lean: true
      })
      // increment article views
      this.articleService.incrementStatistics(article.id, 'views')
      // dispatch event to global
      this.eventEmitter.emit(EventKeys.ArticleViewed, article.id)
      return article
    }

    // Admin user > Object ID | number ID
    return Types.ObjectId.isValid(params.id)
      ? this.articleService.getDetailByObjectId(params.id)
      : this.articleService.getDetailByNumberIdOrSlug({ numberId: Number(params.id), lean: true })
  }

  @Post()
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Create article succeeded')
  async createArticle(@Body() article: Article): Promise<Article> {
    const created = this.articleService.create(article)
    this.eventEmitter.emit(EventKeys.ArticleCreated, created)
    return created
  }

  @Put(':id')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Update article succeeded')
  async putArticle(@RequestContext() { params }: IRequestContext, @Body() article: Article): Promise<Article> {
    const updated = await this.articleService.update(params.id, article)
    this.eventEmitter.emit(EventKeys.ArticleUpdated, updated)
    return updated
  }

  @Delete(':id')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Delete article succeeded')
  async delArticle(@RequestContext() { params }: IRequestContext) {
    const result = await this.articleService.delete(params.id)
    this.eventEmitter.emit(EventKeys.ArticleDeleted, result)
    return result
  }

  @Patch()
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Update articles succeeded')
  patchArticles(@Body() body: ArticlesStatusDTO) {
    return this.articleService.batchPatchStatus(body.article_ids, body.status)
  }

  @Delete()
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Delete articles succeeded')
  delArticles(@Body() body: ArticleIdsDTO) {
    return this.articleService.batchDelete(body.article_ids)
  }
}
