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
exports.AdminService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const cache_service_1 = require("../../core/cache/cache.service");
const cache_constant_1 = require("../../constants/cache.constant");
const codec_transformer_1 = require("../../transformers/codec.transformer");
const admin_model_1 = require("./admin.model");
const app_config_1 = require("../../app.config");
let AdminService = class AdminService {
    cacheService;
    adminModel;
    profileCache;
    constructor(cacheService, adminModel) {
        this.cacheService = cacheService;
        this.adminModel = adminModel;
        this.profileCache = this.cacheService.manual({
            key: cache_constant_1.CacheKeys.AdminProfile,
            promise: () => this.getProfile()
        });
    }
    onModuleInit() {
        this.profileCache.update();
    }
    getProfileCache() {
        return this.profileCache.get();
    }
    async getProfile() {
        const adminProfile = await this.adminModel.findOne(admin_model_1.ADMIN_SINGLETON_QUERY).select('-_id').lean().exec();
        return adminProfile ?? admin_model_1.DEFAULT_ADMIN_PROFILE;
    }
    getDocument() {
        return this.adminModel.findOne(admin_model_1.ADMIN_SINGLETON_QUERY).select('+password').exec();
    }
    async validatePassword(plainPassword, hashedPassword) {
        return hashedPassword
            ?
                await bcryptjs_1.default.compare(plainPassword, hashedPassword)
            :
                plainPassword === app_config_1.APP_AUTH.adminDefaultPassword;
    }
    async updateProfile(input) {
        const { password: inputOldPassword, new_password: inputNewPassword, ...profile } = input;
        const newProfile = { ...profile };
        const existedAdmin = await this.getDocument();
        if (!existedAdmin && !inputNewPassword) {
            throw new common_1.BadRequestException('First initialization must set password');
        }
        if (inputOldPassword || inputNewPassword) {
            if (!inputOldPassword || !inputNewPassword) {
                throw new common_1.BadRequestException('Incomplete passwords');
            }
            if (inputOldPassword === inputNewPassword) {
                throw new common_1.BadRequestException('Old password and new password cannot be the same');
            }
            if (!(await this.validatePassword((0, codec_transformer_1.decodeBase64)(inputOldPassword), existedAdmin?.password))) {
                throw new common_1.BadRequestException('Old password incorrect');
            }
            const plainNewPassword = (0, codec_transformer_1.decodeBase64)(inputNewPassword);
            newProfile.password = await bcryptjs_1.default.hash(plainNewPassword, app_config_1.APP_AUTH.adminBcryptSaltRounds);
        }
        if (existedAdmin) {
            await existedAdmin.set(newProfile).save();
        }
        else {
            await this.adminModel.create(newProfile);
        }
        return await this.profileCache.update();
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, model_transformer_1.InjectModel)(admin_model_1.Admin)),
    __metadata("design:paramtypes", [cache_service_1.CacheService, Object])
], AdminService);
//# sourceMappingURL=admin.service.js.map