/**
 * @file Article controller
 * @module module/article/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import { Types } from 'mongoose'
import { Controller, Get, Put, Post, Patch, Delete, Query, Body, UseGuards, HttpStatus } from '@nestjs/common'
import { QueryParams, QueryParamsResult } from '@app/decorators/queryparams.decorator'
import { Responsor } from '@app/decorators/responsor.decorator'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminMaybeGuard } from '@app/guards/admin-maybe.guard'
import { PermissionPipe } from '@app/pipes/permission.pipe'
import { ExposePipe } from '@app/pipes/expose.pipe'
import { SortType } from '@app/interfaces/biz.interface'
import { TagService } from '@app/modules/tag/tag.service'
import { CategoryService } from '@app/modules/category/category.service'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { ArticlePaginateQueryDTO, ArticleListQueryDTO, ArticleIDsDTO, ArticlesStateDTO } from './article.dto'
import { ARTICLE_HOT_SORT_PARAMS } from './article.model'
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
  @Responsor.paginate()
  @Responsor.handle('Get articles')
  async getArticles(
    @Query(PermissionPipe, ExposePipe) query: ArticlePaginateQueryDTO
  ): Promise<PaginateResult<Article>> {
    const { page, per_page, sort, ...filters } = query
    const paginateQuery: PaginateQuery<Article> = {}
    const paginateOptions: PaginateOptions = { page, perPage: per_page }

    // sort
    if (!lodash.isUndefined(sort)) {
      if (sort === SortType.Hot) {
        paginateOptions.sort = ARTICLE_HOT_SORT_PARAMS
      } else {
        paginateOptions.dateSort = sort
      }
    }

    // states
    if (!lodash.isUndefined(filters.state)) {
      paginateQuery.state = filters.state
    }
    if (!lodash.isUndefined(filters.public)) {
      paginateQuery.public = filters.public
    }
    if (!lodash.isUndefined(filters.origin)) {
      paginateQuery.origin = filters.origin
    }

    // search
    if (filters.keyword) {
      const trimmed = lodash.trim(filters.keyword)
      const keywordRegExp = new RegExp(trimmed, 'i')
      paginateQuery.$or = [{ title: keywordRegExp }, { content: keywordRegExp }, { description: keywordRegExp }]
    }

    // date
    if (filters.date) {
      const queryDateMS = new Date(filters.date).getTime()
      paginateQuery.create_at = {
        $gte: new Date((queryDateMS / 1000 - 60 * 60 * 8) * 1000),
        $lt: new Date((queryDateMS / 1000 + 60 * 60 * 16) * 1000),
      }
    }

    // tag | category
    if (filters.tag_slug) {
      const tag = await this.tagService.getDetailBySlug(filters.tag_slug)
      paginateQuery.tag = tag._id
    }
    if (filters.category_slug) {
      const category = await this.categoryService.getDetailBySlug(filters.category_slug)
      paginateQuery.category = category._id
    }

    // paginater
    return this.articleService.paginater(paginateQuery, paginateOptions)
  }

  @Get('hot')
  @Responsor.handle('Get hot articles')
  getHotArticles(@Query(ExposePipe) query: ArticleListQueryDTO): Promise<Array<Article>> {
    return query.count ? this.articleService.getHotArticles(query.count) : this.articleService.getHotArticlesCache()
  }

  @Get('related/:id')
  @Responsor.handle('Get related articles')
  async getRelatedArticles(
    @QueryParams() { params }: QueryParamsResult,
    @Query(ExposePipe) query: ArticleListQueryDTO
  ): Promise<Array<Article>> {
    const article = await this.articleService.getDetailByNumberIDOrSlug({ idOrSlug: Number(params.id) })
    return this.articleService.getRelatedArticles(article, query.count ?? 20)
  }

  @Get(':id')
  @UseGuards(AdminMaybeGuard)
  @Responsor.handle({
    message: 'Get article detail',
    error: HttpStatus.NOT_FOUND,
  })
  getArticle(@QueryParams() { params, isUnauthenticated }: QueryParamsResult): Promise<Article> {
    // guest user > number ID | slug
    if (isUnauthenticated) {
      const idOrSlug = isNaN(Number(params.id)) ? String(params.id) : Number(params.id)
      return this.articleService.getFullDetailForGuest(idOrSlug)
    }
    // admin user > Object ID | number ID
    return Types.ObjectId.isValid(params.id)
      ? this.articleService.getDetailByObjectID(params.id)
      : this.articleService.getDetailByNumberIDOrSlug({ idOrSlug: Number(params.id) })
  }

  @Post()
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Create article')
  createArticle(@Body() article: Article): Promise<Article> {
    return this.articleService.create(article)
  }

  @Put(':id')
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Update article')
  putArticle(@QueryParams() { params }: QueryParamsResult, @Body() article: Article): Promise<Article> {
    return this.articleService.update(params.id, article)
  }

  @Delete(':id')
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Delete article')
  delArticle(@QueryParams() { params }: QueryParamsResult): Promise<Article> {
    return this.articleService.delete(params.id)
  }

  @Patch()
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Update articles')
  patchArticles(@Body() body: ArticlesStateDTO) {
    return this.articleService.batchPatchState(body.article_ids, body.state)
  }

  @Delete()
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Delete articles')
  delArticles(@Body() body: ArticleIDsDTO) {
    return this.articleService.batchDelete(body.article_ids)
  }
}
