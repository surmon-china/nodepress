/**
 * @file Extension controller
 * @module module/extension/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get, Post, Patch, UploadedFile, Body, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminMaybeGuard } from '@app/guards/admin-maybe.guard'
import { Responser } from '@app/decorators/responser.decorator'
import { QueryParams, QueryParamsResult } from '@app/decorators/queryparams.decorator'
import { GoogleService } from '@app/processors/helper/helper.service.google'
import { AWSService } from '@app/processors/helper/helper.service.aws'
import { StatisticService, Statistic } from './extension.service.statistic'
import { DBBackupService } from './extension.service.dbbackup'
import * as APP_CONFIG from '@app/app.config'

@Controller('extension')
export class ExtensionController {
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

  @Get('static/list')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Get file list from cloud storage')
  async getStaticFileList(@QueryParams() { query }: QueryParamsResult) {
    const minLimit = 200
    const numberLimit = Number(query.limit)
    const limit = Number.isInteger(numberLimit) ? numberLimit : minLimit
    const result = await this.awsService.getFileList({
      limit: limit < minLimit ? minLimit : limit,
      prefix: query.prefix,
      startAfter: query.startAfter,
      delimiter: query.delimiter,
      region: APP_CONFIG.AWS.s3StaticRegion,
      bucket: APP_CONFIG.AWS.s3StaticBucket
    })

    return {
      ...result,
      files: result.files.map((file) => ({
        ...file,
        url: `${APP_CONFIG.APP_BIZ.STATIC_URL}/${file.key}`,
        lastModified: file.lastModified?.getTime()
      }))
    }
  }

  @Post('static/upload')
  @UseGuards(AdminOnlyGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Responser.handle('Upload file to cloud storage')
  async uploadStaticFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
    const result = await this.awsService.uploadFile({
      name: body.name,
      file: file.buffer,
      fileContentType: file.mimetype,
      region: APP_CONFIG.AWS.s3StaticRegion,
      bucket: APP_CONFIG.AWS.s3StaticBucket
    })

    return {
      ...result,
      url: `${APP_CONFIG.APP_BIZ.STATIC_URL}/${result.key}`
    }
  }

  // https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/batchRunReports
  @Post('google-analytics/batch-run-reports')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Google analytics batchRunReports')
  googleAnalyticsBatchRunReports(@Body() requestBody) {
    return this.googleService.getAnalyticsDataClient().properties.batchRunReports({
      property: `properties/${APP_CONFIG.GOOGLE.analyticsV4PropertyId}`,
      requestBody
    })
  }

  // https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/batchRunPivotReports
  @Post('google-analytics/batch-run-pivot-reports')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Google analytics batchRunPivotReports')
  googleAnalyticsBatchRunPivotReports(@Body() requestBody) {
    return this.googleService.getAnalyticsDataClient().properties.batchRunPivotReports({
      property: `properties/${APP_CONFIG.GOOGLE.analyticsV4PropertyId}`,
      requestBody
    })
  }

  // https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runRealtimeReport
  @Post('google-analytics/run-realtime-report')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Google analytics runRealtimeReport')
  googleAnalyticsRunRealtimeReport(@Body() requestBody) {
    return this.googleService.getAnalyticsDataClient().properties.runRealtimeReport({
      property: `properties/${APP_CONFIG.GOOGLE.analyticsV4PropertyId}`,
      requestBody
    })
  }
}
