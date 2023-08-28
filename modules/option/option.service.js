"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionService = void 0;
const lodash_1 = __importDefault(require("lodash"));
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const cache_service_1 = require("../../processors/cache/cache.service");
const option_model_1 = require("./option.model");
const cache_constant_1 = require("../../constants/cache.constant");
const logger_1 = __importDefault(require("../../utils/logger"));
const log = logger_1.default.scope('OptionService');
let OptionService = class OptionService {
    constructor(optionModel, cacheService) {
        this.optionModel = optionModel;
        this.cacheService = cacheService;
        this.optionCache = this.cacheService.manual({
            key: cache_constant_1.CacheKeys.Option,
            promise: () => {
                return this.ensureAppOption().then((option) => {
                    return lodash_1.default.omit(option.toObject(), ['blocklist']);
                });
            }
        });
        this.optionCache.update().catch((error) => {
            log.warn('init getAppOption failed!', error);
        });
    }
    async ensureAppOption() {
        const option = await this.optionModel.findOne().exec();
        return option || (await this.optionModel.create(Object.assign({}, option_model_1.DEFAULT_OPTION)));
    }
    getOptionCacheForGuest() {
        return this.optionCache.get();
    }
    async putOption(newOption) {
        Reflect.deleteProperty(newOption, '_id');
        Reflect.deleteProperty(newOption, 'meta');
        await this.ensureAppOption();
        await this.optionModel.updateOne({}, newOption).exec();
        await this.optionCache.update();
        return await this.ensureAppOption();
    }
    async appendToBlocklist(payload) {
        const option = await this.ensureAppOption();
        option.blocklist.ips = lodash_1.default.uniq([...option.blocklist.ips, ...payload.ips]);
        option.blocklist.mails = lodash_1.default.uniq([...option.blocklist.mails, ...payload.emails]);
        await option.save();
        return option.blocklist;
    }
    async removeFromBlocklist(payload) {
        const option = await this.ensureAppOption();
        option.blocklist.ips = option.blocklist.ips.filter((ip) => !payload.ips.includes(ip));
        option.blocklist.mails = option.blocklist.mails.filter((email) => !payload.emails.includes(email));
        await option.save();
        return option.blocklist;
    }
    async incrementLikes() {
        const option = await this.ensureAppOption();
        option.meta.likes++;
        await option.save({ timestamps: false });
        await this.optionCache.update();
        return option.meta.likes;
    }
};
exports.OptionService = OptionService;
exports.OptionService = OptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(option_model_1.Option)),
    __metadata("design:paramtypes", [Object, cache_service_1.CacheService])
], OptionService);
//# sourceMappingURL=option.service.js.map