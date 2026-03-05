/**
 * @file Article controller
 * @module module/article/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import _isUndefined from 'lodash/isUndefined'
import type { QueryFilter } from 'mongoose'
import { Inject, forwardRef } from '@nestjs/common'
import { Controller, Get, Patch, Post, Delete, Query, Body, Param, ParseIntPipe } from '@nestjs/common'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { OnlyIdentity, IdentityRole } from '@app/decorators/only-identity.decorator'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { PermissionPipe } from '@app/pipes/permission.pipe'
import { GlobalCacheKey } from '@app/constants/cache.constant'
import { SortMode } from '@app/constants/sort.constant'
import { CounterService } from '@app/core/helper/helper.service.counter'
import { CategoryService } from '@app/modules/category/category.service'
import { TagService } from '@app/modules/tag/tag.service'
import { PaginateOptions } from '@app/utils/paginate'
import { ArticlePaginateQueryDto, AllArticlesQueryDto } from './article.dto'
import { ArticleContextQueryDto, ArticleCalendarQueryDto } from './article.dto'
import { CreateArticleDto, UpdateArticleDto, ArticleIdsDto, ArticleIdsStatusDto } from './article.dto'
import { ARTICLE_HOTTEST_SORT_CONFIG } from './article.constant'
import { ArticleContextService } from './article.service.context'
import { ArticleStatsService } from './article.service.stats'
import { ArticleSyncService } from './article.service.sync'
import { ArticleService } from './article.service'
import { Article } from './article.model'

@Controller('articles')
export class ArticleController {
  constructor(
    private readonly counterService: CounterService,
    private readonly articleService: ArticleService,
    private readonly articleContextService: ArticleContextService,
    private readonly articleStatsService: ArticleStatsService,
    private readonly articleSyncService: ArticleSyncService,
    @Inject(forwardRef(() => TagService)) private readonly tagService: TagService,
    @Inject(forwardRef(() => CategoryService)) private readonly categoryService: CategoryService
  ) {}

  @Get()
  @SuccessResponse({ message: 'Get articles succeeded', usePaginate: true })
  async getArticles(@Query(PermissionPipe) query: ArticlePaginateQueryDto) {
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
      const keywordRegExp = new RegExp(filters.keyword, 'i')
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
      const tag = await this.tagService.getDetail(filters.tag_slug)
      queryFilter.tags = tag._id
    }
    if (filters.category_slug) {
      const category = await this.categoryService.getDetail(filters.category_slug)
      queryFilter.categories = category._id
    }

    // paginate
    return this.articleService.paginate(queryFilter, paginateOptions)
  }

  @Get('all')
  @SuccessResponse('Get all articles succeeded')
  public getAllArticles(
    @Query(PermissionPipe) { with_detail }: AllArticlesQueryDto,
    @RequestContext() { identity }: IRequestContext
  ) {
    return identity.isAdmin
      ? this.articleService.getAllArticles({ publicOnly: false, withDetail: !!with_detail })
      : this.articleService.getAllPublicArticlesCache()
  }

  @Get('calendar')
  @SuccessResponse('Get articles calendar succeeded')
  getArticlesCalendar(
    @Query() { timezone }: ArticleCalendarQueryDto,
    @RequestContext() { identity }: IRequestContext
  ) {
    return this.articleStatsService.getCalendar(!identity.isAdmin, timezone)
  }

  @Get(':id')
  @SuccessResponse('Get article detail succeeded')
  async getArticle(@Param('id', ParseIntPipe) id: number, @RequestContext() { identity }: IRequestContext) {
    const article = await this.articleService.getDetail(id, {
      publicOnly: !identity.isAdmin,
      populate: !identity.isAdmin,
      lean: true
    })
    if (!identity.isAdmin) {
      // increment article views
      this.articleSyncService.incrementStatistics(article.id, 'views')
      // increment global views
      this.counterService.incrementGlobalCount(GlobalCacheKey.TodayViewCount)
    }
    return article
  }

  @Get(':id/context')
  @SuccessResponse('Get context articles succeeded')
  async getArticleContext(
    @Param('id', ParseIntPipe) articleId: number,
    @Query() { related_count }: ArticleContextQueryDto
  ) {
    const [prevArticles, nextArticles, relatedArticles] = await Promise.all([
      this.articleContextService.getNearArticles(articleId, 'early', 1),
      this.articleContextService.getNearArticles(articleId, 'later', 1),
      this.articleService
        .getDetail(articleId, { publicOnly: true, lean: true })
        .then((article) => this.articleContextService.getRelatedArticles(article, related_count ?? 10))
    ])
    return {
      prev_article: prevArticles?.[0] || null,
      next_article: nextArticles?.[0] || null,
      related_articles: relatedArticles || []
    }
  }

  @Post()
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Create article succeeded')
  createArticle(@Body() dto: CreateArticleDto): Promise<Article> {
    return this.articleService.create(dto)
  }

  @Patch(':id')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Update article succeeded')
  updateArticle(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateArticleDto): Promise<Article> {
    return this.articleService.update(id, dto)
  }

  @Delete(':id')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Delete article succeeded')
  deleteArticle(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.delete(id)
  }

  @Patch()
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Update articles succeeded')
  updateArticlesStatus(@Body() dto: ArticleIdsStatusDto) {
    return this.articleService.batchUpdateStatus(dto.article_ids, dto.status)
  }

  @Delete()
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Delete articles succeeded')
  deleteArticles(@Body() { article_ids }: ArticleIdsDto) {
    return this.articleService.batchDelete(article_ids)
  }
}
