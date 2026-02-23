/**
 * @file Tag controller
 * @module module/tag/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import type { QueryFilter } from 'mongoose'
import { Controller, Get, Patch, Post, Delete, Query, Body, Param, ParseIntPipe } from '@nestjs/common'
import { OnlyIdentity, IdentityRole } from '@app/decorators/only-identity.decorator'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { PaginateOptions, PaginateResult } from '@app/utils/paginate'
import { CreateTagDto, UpdateTagDto, TagPaginateQueryDto, TagIdsDto } from './tag.dto'
import { TagService } from './tag.service'
import { Tag } from './tag.model'

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @SuccessResponse({ message: 'Get tags succeeded', usePaginate: true })
  getTags(
    @Query() query: TagPaginateQueryDto,
    @RequestContext() { identity }: IRequestContext
  ): Promise<PaginateResult<Tag>> {
    const { sort, page, per_page, ...filters } = query
    const queryFilter: QueryFilter<Tag> = {}
    const paginateOptions: PaginateOptions = { page, perPage: per_page, dateSort: sort }

    // search
    if (filters.keyword) {
      const keywordRegExp = new RegExp(filters.keyword, 'i')
      queryFilter.$or = [{ name: keywordRegExp }, { slug: keywordRegExp }, { description: keywordRegExp }]
    }

    // paginate
    return this.tagService.paginate(queryFilter, paginateOptions, !identity.isAdmin)
  }

  @Get('all')
  @SuccessResponse('Get all tags succeeded')
  getAllTags(@RequestContext() { identity }: IRequestContext): Promise<Tag[]> {
    return identity.isAdmin
      ? this.tagService.getAllTags({ aggregatePublicOnly: false })
      : this.tagService.getAllPublicTagsCache()
  }

  @Get(':id')
  @SuccessResponse('Get tag succeeded')
  getTag(@Param('id', ParseIntPipe) id: number): Promise<Tag> {
    return this.tagService.getDetail(id)
  }

  @Post()
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Create tag succeeded')
  createTag(@Body() dto: CreateTagDto): Promise<Tag> {
    return this.tagService.create(dto)
  }

  @Delete()
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Delete tags succeeded')
  deleteTags(@Body() { tag_ids }: TagIdsDto) {
    return this.tagService.batchDelete(tag_ids)
  }

  @Patch(':id')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Update Tag succeeded')
  updateTag(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTagDto): Promise<Tag> {
    return this.tagService.update(id, dto)
  }

  @Delete(':id')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Delete tag succeeded')
  deleteTag(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.delete(id)
  }
}
