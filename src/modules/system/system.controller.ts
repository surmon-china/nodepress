/**
 * @file System controller
 * @module module/system/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Get, Post, Body } from '@nestjs/common'
import { Controller, BadRequestException } from '@nestjs/common'
import { OnlyIdentity, IdentityRole } from '@app/decorators/only-identity.decorator'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { UploadedFile, IUploadedFile } from '@app/decorators/uploaded-file.decorator'
import { GoogleService } from '@app/core/helper/helper.service.google'
import { S3Service } from '@app/core/helper/helper.service.s3'
import { DBBackupService } from './system.service.dbbackup'
import { StatisticsService, Statistics } from './system.service.statistics'
import * as APP_CONFIG from '@app/app.config'

@Controller('system')
export class SystemController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly googleService: GoogleService,
    private readonly dbBackupService: DBBackupService,
    private readonly statisticsService: StatisticsService
  ) {}

  @Get('statistics')
  @SuccessResponse('Get statistics succeeded')
  getSystemStatistics(@RequestContext() { identity }: IRequestContext): Promise<Statistics> {
    return this.statisticsService.getStatistics(!identity.isAdmin)
  }

  @Post('database-backup')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Update database backup succeeded')
  updateDatabaseBackup() {
    return this.dbBackupService.backup()
  }

  @Get('static/list')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Get file list succeeded')
  async getStaticFileList(@RequestContext() { query }: IRequestContext) {
    const minLimit = 200
    const numberLimit = Number(query.limit)
    const limit = Number.isInteger(numberLimit) ? numberLimit : minLimit
    const result = await this.s3Service.getFileList({
      limit: limit < minLimit ? minLimit : limit,
      prefix: query.prefix,
      startAfter: query.startAfter,
      delimiter: query.delimiter,
      region: APP_CONFIG.S3_STORAGE.s3StaticFileRegion,
      bucket: APP_CONFIG.S3_STORAGE.s3StaticFileBucket
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
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Upload file to cloud storage succeeded')
  async uploadStaticFile(@UploadedFile() file: IUploadedFile) {
    if (!file.fields.key) {
      throw new BadRequestException('Missing required field: key')
    }

    const result = await this.s3Service.uploadFile({
      key: file.fields.key,
      file: file.buffer,
      fileContentType: file.mimetype,
      region: APP_CONFIG.S3_STORAGE.s3StaticFileRegion,
      bucket: APP_CONFIG.S3_STORAGE.s3StaticFileBucket
    })

    return {
      ...result,
      url: `${APP_CONFIG.APP_BIZ.STATIC_URL}/${result.key}`
    }
  }

  // https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/batchRunReports
  @Post('google-analytics/batch-run-reports')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Google analytics batchRunReports succeeded')
  googleAnalyticsBatchRunReports(@Body() requestBody) {
    return this.googleService.getAnalyticsDataClient().properties.batchRunReports({
      property: `properties/${APP_CONFIG.GOOGLE_API.analyticsV4PropertyId}`,
      requestBody
    })
  }

  // https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/batchRunPivotReports
  @Post('google-analytics/batch-run-pivot-reports')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Google analytics batchRunPivotReports succeeded')
  googleAnalyticsBatchRunPivotReports(@Body() requestBody) {
    return this.googleService.getAnalyticsDataClient().properties.batchRunPivotReports({
      property: `properties/${APP_CONFIG.GOOGLE_API.analyticsV4PropertyId}`,
      requestBody
    })
  }

  // https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runRealtimeReport
  @Post('google-analytics/run-realtime-report')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Google analytics runRealtimeReport succeeded')
  googleAnalyticsRunRealtimeReport(@Body() requestBody) {
    return this.googleService.getAnalyticsDataClient().properties.runRealtimeReport({
      property: `properties/${APP_CONFIG.GOOGLE_API.analyticsV4PropertyId}`,
      requestBody
    })
  }
}
