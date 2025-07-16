/**
 * @file Archive controller
 * @module module/archive/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { UseGuards, Controller, Get, Patch } from '@nestjs/common'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { ArchiveService, ArchiveData } from './archive.service'

@Controller('archive')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Get()
  @SuccessResponse('Get archive succeeded')
  getArchive(): Promise<ArchiveData> {
    return this.archiveService.getCache()
  }

  @Patch()
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Update archive cache succeeded')
  updateArchive(): Promise<any> {
    return this.archiveService.updateCache()
  }
}
