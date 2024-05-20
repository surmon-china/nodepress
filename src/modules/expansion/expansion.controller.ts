/**
 * @file Expansion controller
 * @module module/expansion/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Auth } from 'googleapis'
import { Controller, Get, Post, Patch, UploadedFile, Body, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminMaybeGuard } from '@app/guards/admin-maybe.guard'
import { Responser } from '@app/decorators/responser.decorator'
import { QueryParams, QueryParamsResult } from '@app/decorators/queryparams.decorator'
import { AWSService } from '@app/processors/helper/helper.service.aws'
import { GoogleService } from '@app/processors/helper/helper.service.google'
import { StatisticService, Statistic } from './expansion.service.statistic'
import { DBBackupService } from './expansion.service.dbbackup'
import * as APP_CONFIG from '@app/app.config'

@Controller('expansion')
export class ExpansionController {
  constructor(
    private readonly awsService: AWSService,
    private readonly googleService: GoogleService,
    private readonly dbBackupService: DBBackupService,
    private readonly statisticService: StatisticService
  ) {}

  @Get('statistic')
  @UseGuards(AdminMaybeGuard)
  @Responser.handle('Get statistics')
  getSystemStatistics(@QueryParams() { isUnauthenticated }: QueryParamsResult): Promise<Statistic> {
    return this.statisticService.getStatistic(isUnauthenticated)
  }

  @Get('google-token')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Get Google credentials')
  getGoogleToken(): Promise<Auth.Credentials> {
    return this.googleService.getCredentials()
  }

  @Patch('database-backup')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Update database backup')
  updateDatabaseBackup() {
    return this.dbBackupService.backup()
  }

  @Post('upload')
  @UseGuards(AdminOnlyGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Responser.handle('Upload file to cloud storage')
  uploadStatic(@UploadedFile() file: Express.Multer.File, @Body() body) {
    return this.awsService
      .uploadFile({
        name: body.name,
        file: file.buffer,
        fileContentType: file.mimetype,
        region: APP_CONFIG.AWS.s3StaticRegion,
        bucket: APP_CONFIG.AWS.s3StaticBucket
      })
      .then((result) => ({
        ...result,
        url: `${APP_CONFIG.APP.STATIC_URL}/${result.key}`
      }))
  }
}
