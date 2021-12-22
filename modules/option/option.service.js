"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const mongoose_interface_1 = require("../../interfaces/mongoose.interface");
const cache_service_1 = require("../../processors/cache/cache.service");
const option_model_1 = require("./option.model");
const CACHE_KEY = __importStar(require("../../constants/cache.constant"));
const logger_1 = __importDefault(require("../../utils/logger"));
let OptionService = class OptionService {
    constructor(optionModel, cacheService) {
        this.optionModel = optionModel;
        this.cacheService = cacheService;
        this.optionCache = this.cacheService.promise({
            ioMode: true,
            key: CACHE_KEY.OPTION,
            promise: this.getDBOption.bind(this),
        });
        this.optionCache.update().catch((error) => {
            logger_1.default.warn('[option]', 'init getDBOption Error:', error);
        });
    }
    updateCache() {
        return this.optionCache.update();
    }
    getDBOption() {
        return this.optionModel.findOne().exec();
    }
    getOption() {
        return this.optionCache.get();
    }
    async putDBOption(option) {
        Reflect.deleteProperty(option, '_id');
        Reflect.deleteProperty(option, 'meta');
        const extantOption = await this.getDBOption();
        if (extantOption) {
            await extantOption.update(option);
            return this.getDBOption();
        }
        else {
            this.optionModel.create(option);
        }
    }
    async putOption(option) {
        const newOption = await this.putDBOption(option);
        this.updateCache();
        return newOption;
    }
};
OptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(option_model_1.Option)),
    __metadata("design:paramtypes", [Object, cache_service_1.CacheService])
], OptionService);
exports.OptionService = OptionService;
//# sourceMappingURL=option.service.js.map