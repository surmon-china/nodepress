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
const uniq_1 = __importDefault(require("lodash/uniq"));
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const cache_service_1 = require("../../core/cache/cache.service");
const options_model_1 = require("./options.model");
const cache_constant_1 = require("../../constants/cache.constant");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const logger = (0, logger_1.createLogger)({ scope: 'OptionsService', time: app_environment_1.isDevEnv });
let OptionsService = class OptionsService {
    optionsModel;
    cacheService;
    optionsCache;
    constructor(optionsModel, cacheService) {
        this.optionsModel = optionsModel;
        this.cacheService = cacheService;
        this.optionsCache = this.cacheService.manual({
            key: cache_constant_1.CacheKeys.Options,
            promise: () => {
                return this.ensureAppOptions().then((option) => {
                    return (0, omit_1.default)(option.toObject(), ['blocklist', '_id']);
                });
            }
        });
    }
    onModuleInit() {
        this.optionsCache.update().catch((error) => {
            logger.warn('Init getAppOptions failed!', error);
        });
    }
    async ensureAppOptions() {
        const options = await this.optionsModel.findOne().exec();
        return options ?? (await this.optionsModel.create({ ...options_model_1.DEFAULT_OPTIONS }));
    }
    getOptionsCacheForGuest() {
        return this.optionsCache.get();
    }
    async putOptions(newOptions) {
        Reflect.deleteProperty(newOptions, '_id');
        await this.ensureAppOptions();
        await this.optionsModel.updateOne({}, newOptions).exec();
        await this.optionsCache.update();
        return await this.ensureAppOptions();
    }
    async appendToBlocklist(payload) {
        const options = await this.ensureAppOptions();
        options.blocklist.ips = (0, uniq_1.default)([...options.blocklist.ips, ...payload.ips]);
        options.blocklist.mails = (0, uniq_1.default)([...options.blocklist.mails, ...payload.emails]);
        await options.save();
        return options.blocklist;
    }
    async removeFromBlocklist(payload) {
        const options = await this.ensureAppOptions();
        options.blocklist.ips = options.blocklist.ips.filter((ip) => !payload.ips.includes(ip));
        options.blocklist.mails = options.blocklist.mails.filter((email) => !payload.emails.includes(email));
        await options.save();
        return options.blocklist;
    }
};
exports.OptionsService = OptionsService;
exports.OptionsService = OptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(options_model_1.Option)),
    __metadata("design:paramtypes", [Object, cache_service_1.CacheService])
], OptionsService);
//# sourceMappingURL=options.service.js.map