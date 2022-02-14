import { Credentials } from 'google-auth-library';
import { QueryParamsResult } from '@app/decorators/queryparams.decorator';
import { CloudStorageService, UploadToken } from '@app/processors/helper/helper.service.cloud-storage';
import { GoogleService } from '@app/processors/helper/helper.service.google';
import { StatisticService, Statistic } from './expansion.service.statistic';
import { DBBackupService } from './expansion.service.dbbackup';
export declare class ExpansionController {
    private readonly googleService;
    private readonly dbBackupService;
    private readonly cloudStorageService;
    private readonly statisticService;
    constructor(googleService: GoogleService, dbBackupService: DBBackupService, cloudStorageService: CloudStorageService, statisticService: StatisticService);
    getSystemStatistics({ isUnauthenticated }: QueryParamsResult): Promise<Statistic>;
    getCloudStorageUploadToken(): Promise<UploadToken>;
    getGoogleToken(): Promise<Credentials>;
    updateDatabaseBackup(): Promise<string>;
}
