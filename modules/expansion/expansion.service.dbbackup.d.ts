import { EmailService } from '@app/processors/helper/helper.service.email';
import { CloudStorageService } from '@app/processors/helper/helper.service.cloud-storage';
export declare class DBBackupService {
    private readonly emailService;
    private readonly cloudStorageService;
    constructor(emailService: EmailService, cloudStorageService: CloudStorageService);
    backup(): Promise<string>;
    private mailToAdmin;
    private doBackup;
}
