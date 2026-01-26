/**
 * @file Announcement controller
 * @module module/announcement/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import _trim from 'lodash/trim'
import type { QueryFilter } from 'mongoose'
import { Controller, Get, Put, Post, Delete, Body, UseGuards, Query } from '@nestjs/common'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminOptionalGuard } from '@app/guards/admin-optional.guard'
import { PermissionPipe } from '@app/pipes/permission.pipe'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { AnnouncementsDTO, AnnouncementPaginateQueryDTO } from './announcement.dto'
import { AnnouncementService } from './announcement.service'
import { Announcement } from './announcement.model'

@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  @UseGuards(AdminOptionalGuard)
  @SuccessResponse({ message: 'Get announcements succeeded', usePaginate: true })
  getAnnouncements(@Query(PermissionPipe) query: AnnouncementPaginateQueryDTO) {
    const { sort, page, per_page, ...filters } = query
    const queryFilter: QueryFilter<Announcement> = {}

    // search
    if (filters.keyword) {
      queryFilter.content = new RegExp(_trim(filters.keyword), 'i')
    }

    // status
    if (filters.status != null) {
      queryFilter.status = filters.status
    }

    // paginate
    return this.announcementService.paginate(queryFilter, {
      page,
      perPage: per_page,
      dateSort: sort
    })
  }

  @Post()
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Create announcement succeeded')
  createAnnouncement(@Body() announcement: Announcement) {
    return this.announcementService.create(announcement)
  }

  @Delete()
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Delete announcements succeeded')
  delAnnouncements(@Body() body: AnnouncementsDTO) {
    return this.announcementService.batchDelete(body.announcement_ids)
  }

  @Put(':id')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Update announcement succeeded')
  putAnnouncement(@RequestContext() { params }: IRequestContext, @Body() announcement: Announcement) {
    return this.announcementService.update(params.id, announcement)
  }

  @Delete(':id')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Delete announcement succeeded')
  delAnnouncement(@RequestContext() { params }: IRequestContext) {
    return this.announcementService.delete(params.id)
  }
}
