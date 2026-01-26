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
const auth_service_1 = require("../../core/auth/auth.service");
const codec_transformer_1 = require("../../transformers/codec.transformer");
const admin_model_1 = require("./admin.model");
const app_config_1 = require("../../app.config");
let AdminService = class AdminService {
    authService;
    adminModel;
    constructor(authService, adminModel) {
        this.authService = authService;
        this.adminModel = adminModel;
    }
    async validatePassword(plainPassword) {
        const existedProfile = await this.adminModel.findOne().select('+password').exec();
        if (existedProfile?.password) {
            return await bcryptjs_1.default.compare(plainPassword, existedProfile.password);
        }
        else {
            return plainPassword === app_config_1.APP_BIZ.PASSWORD.defaultPassword;
        }
    }
    createToken() {
        return {
            access_token: this.authService.signToken(),
            expires_in: app_config_1.APP_BIZ.AUTH_JWT.expiresIn
        };
    }
    async login(base64Password) {
        if (await this.validatePassword((0, codec_transformer_1.decodeBase64)(base64Password))) {
            return this.createToken();
        }
        else {
            throw new common_1.UnauthorizedException('Password incorrect');
        }
    }
    async getProfile() {
        const adminProfile = await this.adminModel.findOne().select('-_id').lean().exec();
        return adminProfile ?? admin_model_1.DEFAULT_ADMIN_PROFILE;
    }
    async updateProfile(adminProfile) {
        const { password: inputOldPassword, new_password: inputNewPassword, ...profile } = adminProfile;
        const newProfile = { ...profile };
        if (inputOldPassword || inputNewPassword) {
            if (!inputOldPassword || !inputNewPassword) {
                throw new common_1.BadRequestException('Incomplete passwords');
            }
            if (inputOldPassword === inputNewPassword) {
                throw new common_1.BadRequestException('Old password and new password cannot be the same');
            }
            if (!(await this.validatePassword((0, codec_transformer_1.decodeBase64)(inputOldPassword)))) {
                throw new common_1.BadRequestException('Old password incorrect');
            }
            const plainNewPassword = (0, codec_transformer_1.decodeBase64)(inputNewPassword);
            newProfile.password = await bcryptjs_1.default.hash(plainNewPassword, app_config_1.APP_BIZ.PASSWORD.bcryptSaltRounds);
        }
        const existedProfile = await this.adminModel.findOne().select('+password').exec();
        if (existedProfile) {
            await Object.assign(existedProfile, newProfile).save();
        }
        else {
            await this.adminModel.create(newProfile);
        }
        return this.getProfile();
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, model_transformer_1.InjectModel)(admin_model_1.Admin)),
    __metadata("design:paramtypes", [auth_service_1.AuthService, Object])
], AdminService);
//# sourceMappingURL=admin.service.js.map