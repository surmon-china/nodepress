/**
 * @file Expansion controller
 * @module module/expansion/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Credentials } from 'google-auth-library'
import { Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminMaybeGuard } from '@app/guards/admin-maybe.guard'
import { Responsor } from '@app/decorators/responsor.decorator'
import { QueryParams, QueryParamsResult } from '@app/decorators/queryparams.decorator'
import { CloudStorageService, UploadToken } from '@app/processors/helper/helper.service.cloud-storage'
import { GoogleService } from '@app/processors/helper/helper.service.google'
import { StatisticService, Statistic } from './expansion.service.statistic'
import { DBBackupService } from './expansion.service.dbbackup'

@Controller('expansion')
export class ExpansionController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly dbBackupService: DBBackupService,
    private readonly cloudStorageService: CloudStorageService,
    private readonly statisticService: StatisticService
  ) {}

  @Get('statistic')
  @UseGuards(AdminMaybeGuard)
  @Responsor.handle('Get statistic')
  getSystemStatistics(@QueryParams() { isUnauthenticated }: QueryParamsResult): Promise<Statistic> {
    return this.statisticService.getStatistic(isUnauthenticated)
  }

  @Get('uptoken')
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Get cloud storage upload token')
  getCloudStorageUploadToken(): Promise<UploadToken> {
    return this.cloudStorageService.getToken()
  }

  @Get('google-token')
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Get Google credentials')
  getGoogleToken(): Promise<Credentials> {
    return this.googleService.getCredentials()
  }

  @Patch('database-backup')
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Update database backup')
  updateDatabaseBackup() {
    return this.dbBackupService.backup()
  }
}
