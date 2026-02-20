/**
 * @file Announcement controller
 * @module module/announcement/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import _isUndefined from 'lodash/isUndefined'
import type { QueryFilter } from 'mongoose'
import { Controller, Get, Patch, Post, Delete, Body, Query, Param, ParseIntPipe } from '@nestjs/common'
import { OnlyIdentity, IdentityRole } from '@app/decorators/only-identity.decorator'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { PermissionPipe } from '@app/pipes/permission.pipe'
import { AnnouncementPaginateQueryDto, AnnouncementIdsDto } from './announcement.dto'
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './announcement.dto'
import { AnnouncementService } from './announcement.service'
import { Announcement } from './announcement.model'

@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  @SuccessResponse({ message: 'Get announcements succeeded', usePaginate: true })
  getAnnouncements(@Query(PermissionPipe) query: AnnouncementPaginateQueryDto) {
    const { sort, page, per_page, ...filters } = query
    const queryFilter: QueryFilter<Announcement> = {}

    // search
    if (filters.keyword) {
      queryFilter.content = new RegExp(filters.keyword, 'i')
    }
    // status
    if (!_isUndefined(filters.status)) {
      queryFilter.status = filters.status
    }

    return this.announcementService.paginate(queryFilter, {
      page,
      perPage: per_page,
      dateSort: sort
    })
  }

  @Post()
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Create announcement succeeded')
  createAnnouncement(@Body() dto: CreateAnnouncementDto): Promise<Announcement> {
    return this.announcementService.create(dto)
  }

  @Delete()
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Delete announcements succeeded')
  deleteAnnouncements(@Body() { announcement_ids }: AnnouncementIdsDto) {
    return this.announcementService.batchDelete(announcement_ids)
  }

  @Patch(':id')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Update announcement succeeded')
  updateAnnouncement(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAnnouncementDto) {
    return this.announcementService.update(id, dto)
  }

  @Delete(':id')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Delete announcement succeeded')
  deleteAnnouncement(@Param('id', ParseIntPipe) id: number) {
    return this.announcementService.delete(id)
  }
}
