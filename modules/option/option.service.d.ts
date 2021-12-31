import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { CacheService, CacheResult } from '@app/processors/cache/cache.service';
import { Option, Blocklist } from './option.model';
export declare class OptionService {
    private readonly optionModel;
    private readonly cacheService;
    private optionCache;
    constructor(optionModel: MongooseModel<Option>, cacheService: CacheService);
    getAppOption(): Promise<Option>;
    getOptionUserCache(): CacheResult<Option>;
    putOption(option: Option): Promise<Option>;
    appendToBlocklist(payload: {
        ips: string[];
        emails: string[];
    }): Promise<Blocklist>;
    removeFromBlocklist(payload: {
        ips: string[];
        emails: string[];
    }): Promise<Blocklist>;
    likeSite(): Promise<number>;
}
