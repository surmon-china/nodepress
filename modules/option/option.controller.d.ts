import { QueryParamsResult } from '@app/decorators/queryparams.decorator';
import { OptionService } from './option.service';
import { Option } from './option.model';
export declare class OptionController {
    private readonly optionService;
    constructor(optionService: OptionService);
    getOption({ isAuthenticated }: QueryParamsResult): import("../../processors/cache/cache.service").CacheResult<Omit<Option, "blocklist">>;
    putOption(option: Option): Promise<Option>;
}
