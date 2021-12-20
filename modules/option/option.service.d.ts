/// <reference types="mongoose" />
import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { CacheService, CacheResult } from '@app/processors/cache/cache.service';
import { Option } from './option.model';
export declare class OptionService {
    private readonly optionModel;
    private readonly cacheService;
    private optionCache;
    constructor(optionModel: MongooseModel<Option>, cacheService: CacheService);
    getDBOption(): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & Option & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    getOption(): CacheResult<Option>;
    private putDBOption;
    putOption(option: Option): Promise<Option>;
}
