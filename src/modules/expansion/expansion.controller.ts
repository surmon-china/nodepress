/**
 * @file Expansion controller
 * @module module/expansion/controller
 * @author Surmon <https://github.com/surmon-china>
 */

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
  async uploadStatic(@UploadedFile() file: Express.Multer.File, @Body() body) {
    const result = await this.awsService.uploadFile({
      name: body.name,
      file: file.buffer,
      fileContentType: file.mimetype,
      region: APP_CONFIG.AWS.s3StaticRegion,
      bucket: APP_CONFIG.AWS.s3StaticBucket
    })

    return {
      ...result,
      url: `${APP_CONFIG.APP.STATIC_URL}/${result.key}`
    }
  }

  // https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/batchRunReports
  @Post('google-analytics/batch-run-reports')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Google analytics batchRunReports')
  googleAnalyticsBatchRunReports(@Body() requestBody) {
    return this.googleService.getAnalyticsData().properties.batchRunReports({
      property: `properties/${APP_CONFIG.GOOGLE.analyticsV4PropertyId}`,
      requestBody
    })
  }

  // https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/batchRunPivotReports
  @Post('google-analytics/batch-run-pivot-reports')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Google analytics batchRunPivotReports')
  googleAnalyticsBatchRunPivotReports(@Body() requestBody) {
    return this.googleService.getAnalyticsData().properties.batchRunPivotReports({
      property: `properties/${APP_CONFIG.GOOGLE.analyticsV4PropertyId}`,
      requestBody
    })
  }

  // https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runRealtimeReport
  @Post('google-analytics/run-realtime-report')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Google analytics runRealtimeReport')
  googleAnalyticsRunRealtimeReport(@Body() requestBody) {
    return this.googleService.getAnalyticsData().properties.runRealtimeReport({
      property: `properties/${APP_CONFIG.GOOGLE.analyticsV4PropertyId}`,
      requestBody
    })
  }
}
