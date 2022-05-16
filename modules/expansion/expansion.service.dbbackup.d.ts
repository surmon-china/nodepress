import { EmailService } from '@app/processors/helper/helper.service.email';
import { AWSService, UploadResult } from '@app/processors/helper/helper.service.aws';
export declare class DBBackupService {
    private readonly emailService;
    private readonly awsService;
    constructor(emailService: EmailService, awsService: AWSService);
    backup(): Promise<UploadResult>;
    private mailToAdmin;
    private doBackup;
}
