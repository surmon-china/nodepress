import { Credentials } from 'google-auth-library';
import { CloudStorageService, IUpToken } from '@app/processors/helper/helper.service.cs';
import { GoogleService } from '@app/processors/helper/helper.service.google';
import { StatisticService, ITodayStatistic } from './expansion.service.statistic';
import { DBBackupService } from './expansion.service.dbbackup';
export declare class ExpansionController {
    private readonly googleService;
    private readonly statisticService;
    private readonly dbBackupService;
    private readonly cloudStorageService;
    constructor(googleService: GoogleService, statisticService: StatisticService, dbBackupService: DBBackupService, cloudStorageService: CloudStorageService);
    getSystemStatistics(): Promise<ITodayStatistic>;
    getCloudStorageUpToken(): Promise<IUpToken>;
    getGoogleToken(): Promise<Credentials>;
    updateDatabaseBackup(): Promise<string>;
}
