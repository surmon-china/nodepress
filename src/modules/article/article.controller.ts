/**
 * @file Article controller
 * @module module/article/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import _trim from 'lodash/trim'
import _isUndefined from 'lodash/isUndefined'
import { Types } from 'mongoose'
import { Controller, Get, Put, Post, Patch, Delete, Query, Body, UseGuards, HttpStatus } from '@nestjs/common'
import { QueryParams, QueryParamsResult } from '@app/decorators/queryparams.decorator'
import { Responser } from '@app/decorators/responser.decorator'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminMaybeGuard } from '@app/guards/admin-maybe.guard'
import { PermissionPipe } from '@app/pipes/permission.pipe'
import { ExposePipe } from '@app/pipes/expose.pipe'
import { SortType } from '@app/constants/biz.constant'
import { TagService } from '@app/modules/tag/tag.service'
import { CategoryService } from '@app/modules/category/category.service'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { ArticlePaginateQueryDTO, ArticleCalendarQueryDTO, ArticleIdsDTO, ArticlesStateDTO } from './article.dto'
import { ARTICLE_HOTTEST_SORT_PARAMS } from './article.model'
import { ArticleService } from './article.service'
import { Article } from './article.model'

@Controller('article')
export class ArticleController {
  constructor(
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
    private readonly articleService: ArticleService
  ) {}

  @Get()
  @UseGuards(AdminMaybeGuard)
  @Responser.paginate()
  @Responser.handle('Get articles')
  async getArticles(
    @Query(PermissionPipe, ExposePipe) query: ArticlePaginateQueryDTO
  ): Promise<PaginateResult<Article>> {
    const { page, per_page, sort, ...filters } = query
    const paginateQuery: PaginateQuery<Article> = {}
    const paginateOptions: PaginateOptions = { page, perPage: per_page }

    // sort
    if (!_isUndefined(sort)) {
      if (sort === SortType.Hottest) {
        paginateOptions.sort = ARTICLE_HOTTEST_SORT_PARAMS
      } else {
        paginateOptions.dateSort = sort
      }
    }

    // featured
    if (!_isUndefined(filters.featured)) {
      paginateQuery.featured = filters.featured
    }

    // language
    if (!_isUndefined(filters.lang)) {
      paginateQuery.lang = filters.lang
    }

    // states
    if (!_isUndefined(filters.state)) {
      paginateQuery.state = filters.state
    }
    if (!_isUndefined(filters.public)) {
      paginateQuery.public = filters.public
    }
    if (!_isUndefined(filters.origin)) {
      paginateQuery.origin = filters.origin
    }

    // search
    if (filters.keyword) {
      const trimmed = _trim(filters.keyword)
      const keywordRegExp = new RegExp(trimmed, 'i')
      paginateQuery.$or = [{ title: keywordRegExp }, { content: keywordRegExp }, { description: keywordRegExp }]
    }

    // date
    if (filters.date) {
      const queryDateMS = new Date(filters.date).getTime()
      paginateQuery.created_at = {
        $gte: new Date((queryDateMS / 1000 - 60 * 60 * 8) * 1000),
        $lt: new Date((queryDateMS / 1000 + 60 * 60 * 16) * 1000)
      }
    }

    // tag | category
    if (filters.tag_slug) {
      const tag = await this.tagService.getDetailBySlug(filters.tag_slug)
      paginateQuery.tags = tag._id
    }
    if (filters.category_slug) {
      const category = await this.categoryService.getDetailBySlug(filters.category_slug)
      paginateQuery.categories = category._id
    }

    // paginate
    return this.articleService.paginator(paginateQuery, paginateOptions)
  }

  @Get('calendar')
  @UseGuards(AdminMaybeGuard)
  @Responser.handle('Get article calendar')
  getArticleCalendar(
    @Query(ExposePipe) query: ArticleCalendarQueryDTO,
    @QueryParams() { isUnauthenticated }: QueryParamsResult
  ) {
    return this.articleService.getCalendar(isUnauthenticated, query.timezone)
  }

  @Get(':id/context')
  @Responser.handle('Get context articles')
  async getArticleContext(@QueryParams() { params }: QueryParamsResult) {
    const articleId = Number(params.id)
    const [prevArticles, nextArticles, relatedArticles] = await Promise.all([
      this.articleService.getNearArticles(articleId, 'early', 1),
      this.articleService.getNearArticles(articleId, 'later', 1),
      this.articleService
        .getDetailByNumberIdOrSlug({ idOrSlug: articleId, publicOnly: true })
        .then((article) => this.articleService.getRelatedArticles(article, 20))
    ])
    return {
      prev_article: prevArticles?.[0] || null,
      next_article: nextArticles?.[0] || null,
      related_articles: relatedArticles || []
    }
  }

  @Get(':id')
  @UseGuards(AdminMaybeGuard)
  @Responser.handle({
    message: 'Get article detail',
    error: HttpStatus.NOT_FOUND
  })
  getArticle(@QueryParams() { params, isUnauthenticated }: QueryParamsResult): Promise<Article> {
    // guest user > number ID | slug
    if (isUnauthenticated) {
      const idOrSlug = isNaN(Number(params.id)) ? String(params.id) : Number(params.id)
      return this.articleService.getFullDetailForGuest(idOrSlug)
    }
    // admin user > Object ID | number ID
    return Types.ObjectId.isValid(params.id)
      ? this.articleService.getDetailByObjectId(params.id)
      : this.articleService.getDetailByNumberIdOrSlug({ idOrSlug: Number(params.id) })
  }

  @Post()
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Create article')
  createArticle(@Body() article: Article): Promise<Article> {
    return this.articleService.create(article)
  }

  @Put(':id')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Update article')
  putArticle(@QueryParams() { params }: QueryParamsResult, @Body() article: Article): Promise<Article> {
    return this.articleService.update(params.id, article)
  }

  @Delete(':id')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Delete article')
  delArticle(@QueryParams() { params }: QueryParamsResult) {
    return this.articleService.delete(params.id)
  }

  @Patch()
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Update articles')
  patchArticles(@Body() body: ArticlesStateDTO) {
    return this.articleService.batchPatchState(body.article_ids, body.state)
  }

  @Delete()
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Delete articles')
  delArticles(@Body() body: ArticleIdsDTO) {
    return this.articleService.batchDelete(body.article_ids)
  }
}
