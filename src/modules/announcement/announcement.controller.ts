/**
 * @file Announcement controller
 * @module module/announcement/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import _trim from 'lodash/trim'
import { Controller, Get, Put, Post, Delete, Body, UseGuards, Query } from '@nestjs/common'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminMaybeGuard } from '@app/guards/admin-maybe.guard'
import { PermissionPipe } from '@app/pipes/permission.pipe'
import { ExposePipe } from '@app/pipes/expose.pipe'
import { Responser } from '@app/decorators/responser.decorator'
import { QueryParams, QueryParamsResult } from '@app/decorators/queryparams.decorator'
import { PaginateResult, PaginateQuery } from '@app/utils/paginate'
import { AnnouncementsDTO, AnnouncementPaginateQueryDTO } from './announcement.dto'
import { AnnouncementService } from './announcement.service'
import { Announcement } from './announcement.model'

@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  @UseGuards(AdminMaybeGuard)
  @Responser.paginate()
  @Responser.handle('Get announcements')
  getAnnouncements(
    @Query(PermissionPipe, ExposePipe) query: AnnouncementPaginateQueryDTO
  ): Promise<PaginateResult<Announcement>> {
    const { sort, page, per_page, ...filters } = query
    const { keyword, state } = filters
    const paginateQuery: PaginateQuery<Announcement> = {}

    // search
    if (keyword) {
      paginateQuery.content = new RegExp(_trim(keyword), 'i')
    }

    // state
    if (state != null) {
      paginateQuery.state = state
    }

    // paginator
    return this.announcementService.paginator(paginateQuery, {
      page,
      perPage: per_page,
      dateSort: sort
    })
  }

  @Post()
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Create announcement')
  createAnnouncement(@Body() announcement: Announcement) {
    return this.announcementService.create(announcement)
  }

  @Delete()
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Delete announcements')
  delAnnouncements(@Body() body: AnnouncementsDTO) {
    return this.announcementService.batchDelete(body.announcement_ids)
  }

  @Put(':id')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Update announcement')
  putAnnouncement(@QueryParams() { params }: QueryParamsResult, @Body() announcement: Announcement) {
    return this.announcementService.update(params.id, announcement)
  }

  @Delete(':id')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Delete announcement')
  delAnnouncement(@QueryParams() { params }: QueryParamsResult) {
    return this.announcementService.delete(params.id)
  }
}
