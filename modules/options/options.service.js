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
exports.OptionsService = void 0;
const omit_1 = __importDefault(require("lodash/omit"));
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const cache_service_1 = require("../../core/cache/cache.service");
const cache_constant_1 = require("../../constants/cache.constant");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const options_model_1 = require("./options.model");
const logger = (0, logger_1.createLogger)({ scope: 'OptionsService', time: app_environment_1.isDevEnv });
let OptionsService = class OptionsService {
    optionsModel;
    cacheService;
    optionsCache;
    constructor(optionsModel, cacheService) {
        this.optionsModel = optionsModel;
        this.cacheService = cacheService;
        this.optionsCache = this.cacheService.manual({
            key: cache_constant_1.CacheKeys.PublicOptions,
            promise: () => {
                return this.ensureOptions().then((option) => {
                    return (0, omit_1.default)(option, ['blocklist', '_id']);
                });
            }
        });
    }
    onModuleInit() {
        this.optionsCache.update().catch((error) => {
            logger.warn('Init getAppOptions failed!', error);
        });
    }
    getPublicOptionsCache() {
        return this.optionsCache.get();
    }
    ensureOptions() {
        return this.optionsModel
            .findOneAndUpdate(options_model_1.OPTIONS_SINGLETON_QUERY, { $setOnInsert: { ...options_model_1.DEFAULT_OPTIONS, ...options_model_1.OPTIONS_SINGLETON_QUERY } }, { upsert: true, setDefaultsOnInsert: true, returnDocument: 'after' })
            .lean()
            .exec();
    }
    async updateOptions(input) {
        await this.ensureOptions();
        const updated = await this.optionsModel
            .findOneAndUpdate(options_model_1.OPTIONS_SINGLETON_QUERY, { $set: input }, { returnDocument: 'after' })
            .exec();
        await this.optionsCache.update();
        return updated;
    }
    async appendToBlocklist({ ips, emails }) {
        await this.ensureOptions();
        const updated = await this.optionsModel
            .findOneAndUpdate(options_model_1.OPTIONS_SINGLETON_QUERY, { $addToSet: { 'blocklist.ips': { $each: ips }, 'blocklist.emails': { $each: emails } } }, { returnDocument: 'after' })
            .exec();
        return updated.blocklist;
    }
    async removeFromBlocklist({ ips, emails }) {
        await this.ensureOptions();
        const updated = await this.optionsModel
            .findOneAndUpdate(options_model_1.OPTIONS_SINGLETON_QUERY, { $pull: { 'blocklist.ips': { $in: ips }, 'blocklist.emails': { $in: emails } } }, { returnDocument: 'after' })
            .exec();
        return updated.blocklist;
    }
};
exports.OptionsService = OptionsService;
exports.OptionsService = OptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(options_model_1.Option)),
    __metadata("design:paramtypes", [Object, cache_service_1.CacheService])
], OptionsService);
//# sourceMappingURL=options.service.js.map