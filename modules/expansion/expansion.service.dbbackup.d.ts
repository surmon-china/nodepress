import { CloudStorageService } from '@app/processors/helper/helper.service.cs';
export declare class DBBackupService {
    private readonly cloudStorageService;
    constructor(cloudStorageService: CloudStorageService);
    backup(): Promise<void>;
}
