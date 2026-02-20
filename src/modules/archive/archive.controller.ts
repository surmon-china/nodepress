/**
 * @file Archive controller
 * @module module/archive/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get, Post } from '@nestjs/common'
import { OnlyIdentity, IdentityRole } from '@app/decorators/only-identity.decorator'
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

  @Post('refresh')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Update archive cache succeeded')
  updateArchive(): Promise<any> {
    return this.archiveService.updateCache()
  }
}
