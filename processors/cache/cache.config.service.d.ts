import { CacheOptionsFactory } from '@nestjs/common';
import { EmailService } from '@app/processors/helper/helper.service.email';
import { CacheStoreOptions } from './cache.store';
export declare class CacheConfigService implements CacheOptionsFactory {
    private readonly emailService;
    constructor(emailService: EmailService);
    private sendAlarmMail;
    retryStrategy(retries: number): number | Error;
    createCacheOptions(): CacheStoreOptions;
}
