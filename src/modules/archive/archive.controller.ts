/**
 * @file Archive controller
 * @module module/archive/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { UseGuards, Controller, Get, Patch } from '@nestjs/common'
import { JwtAuthGuard } from '@app/guards/auth.guard'
import { HttpProcessor } from '@app/decorators/http.decorator'
import { ArchiveService, ArchiveData } from './archive.service'

@Controller('archive')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Get()
  @HttpProcessor.handle('Get archive')
  getArchive(): Promise<ArchiveData> {
    return this.archiveService.getCache()
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Update archive cache')
  updateArchive(): Promise<any> {
    return this.archiveService.updateCache()
  }
}
