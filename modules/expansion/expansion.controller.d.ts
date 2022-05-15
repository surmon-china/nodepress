/// <reference types="multer" />
import { Credentials } from 'google-auth-library';
import { QueryParamsResult } from '@app/decorators/queryparams.decorator';
import { AWSService } from '@app/processors/helper/helper.service.aws';
import { GoogleService } from '@app/processors/helper/helper.service.google';
import { StatisticService, Statistic } from './expansion.service.statistic';
import { DBBackupService } from './expansion.service.dbbackup';
export declare class ExpansionController {
    private readonly awsService;
    private readonly googleService;
    private readonly dbBackupService;
    private readonly statisticService;
    constructor(awsService: AWSService, googleService: GoogleService, dbBackupService: DBBackupService, statisticService: StatisticService);
    getSystemStatistics({ isUnauthenticated }: QueryParamsResult): Promise<Statistic>;
    getGoogleToken(): Promise<Credentials>;
    updateDatabaseBackup(): Promise<{
        url: string;
        key: string;
    }>;
    uploadStatic(file: Express.Multer.File, body: any): Promise<{
        url: string;
        key: string;
        eTag: string | undefined;
        size: number | undefined;
    }>;
}
