import { MongooseModel, MongooseDoc } from '@app/interfaces/mongoose.interface';
import { CacheService } from '@app/processors/cache/cache.service';
import { Option, Blocklist } from './option.model';
export declare class OptionService {
    private readonly optionModel;
    private readonly cacheService;
    private optionCache;
    constructor(optionModel: MongooseModel<Option>, cacheService: CacheService);
    ensureAppOption(): Promise<MongooseDoc<Option>>;
    getOptionCacheForGuest(): import("@app/processors/cache/cache.service").CacheResult<Omit<Option, "blocklist">>;
    putOption(newOption: Option): Promise<Option>;
    appendToBlocklist(payload: {
        ips: string[];
        emails: string[];
    }): Promise<Blocklist>;
    removeFromBlocklist(payload: {
        ips: string[];
        emails: string[];
    }): Promise<Blocklist>;
    incrementLikes(): Promise<number>;
}
