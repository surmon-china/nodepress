/**
 * @file Extension controller
 * @module module/extension/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Get, Post, Patch, Body } from '@nestjs/common'
import { Controller, UseGuards, BadRequestException } from '@nestjs/common'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminOptionalGuard } from '@app/guards/admin-optional.guard'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { UploadedFile, IUploadedFile } from '@app/decorators/uploaded-file.decorator'
import { GoogleService } from '@app/core/helper/helper.service.google'
import { AWSService } from '@app/core/helper/helper.service.aws'
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
  @UseGuards(AdminOptionalGuard)
  @SuccessResponse('Get statistics succeeded')
  getSystemStatistics(@RequestContext() { isUnauthenticated }: IRequestContext): Promise<Statistic> {
    return this.statisticService.getStatistic(isUnauthenticated)
  }

  @Patch('database-backup')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Update database backup succeeded')
  updateDatabaseBackup() {
    return this.dbBackupService.backup()
  }

  @Get('static/list')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Get file list succeeded')
  async getStaticFileList(@RequestContext() { query }: IRequestContext) {
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
  @SuccessResponse('Upload file to cloud storage succeeded')
  async uploadStaticFile(@UploadedFile() file: IUploadedFile) {
    if (!file.fields.key) {
      throw new BadRequestException('Missing required field: key')
    }

    const result = await this.awsService.uploadFile({
      key: file.fields.key,
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
  @SuccessResponse('Google analytics batchRunReports succeeded')
  googleAnalyticsBatchRunReports(@Body() requestBody) {
    return this.googleService.getAnalyticsDataClient().properties.batchRunReports({
      property: `properties/${APP_CONFIG.GOOGLE.analyticsV4PropertyId}`,
      requestBody
    })
  }

  // https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/batchRunPivotReports
  @Post('google-analytics/batch-run-pivot-reports')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Google analytics batchRunPivotReports succeeded')
  googleAnalyticsBatchRunPivotReports(@Body() requestBody) {
    return this.googleService.getAnalyticsDataClient().properties.batchRunPivotReports({
      property: `properties/${APP_CONFIG.GOOGLE.analyticsV4PropertyId}`,
      requestBody
    })
  }

  // https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runRealtimeReport
  @Post('google-analytics/run-realtime-report')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Google analytics runRealtimeReport succeeded')
  googleAnalyticsRunRealtimeReport(@Body() requestBody) {
    return this.googleService.getAnalyticsDataClient().properties.runRealtimeReport({
      property: `properties/${APP_CONFIG.GOOGLE.analyticsV4PropertyId}`,
      requestBody
    })
  }
}
