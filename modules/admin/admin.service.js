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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
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
    async getExistedPassword() {
        const auth = await this.adminModel.findOne(undefined, '+password').exec();
        return auth?.password || (0, codec_transformer_1.decodeMD5)(app_config_1.APP_BIZ.AUTH.defaultPassword);
    }
    createToken() {
        return {
            access_token: this.authService.signToken(),
            expires_in: app_config_1.APP_BIZ.AUTH.expiresIn
        };
    }
    async login(password) {
        const existedPassword = await this.getExistedPassword();
        const loginPassword = (0, codec_transformer_1.decodeMD5)((0, codec_transformer_1.decodeBase64)(password));
        if (loginPassword === existedPassword) {
            return this.createToken();
        }
        else {
            throw new common_1.UnauthorizedException('Password incorrect');
        }
    }
    async getProfile() {
        const adminProfile = await this.adminModel.findOne(undefined, '-_id').exec();
        return adminProfile ? adminProfile.toObject() : admin_model_1.DEFAULT_ADMIN_PROFILE;
    }
    async updateProfile(adminProfile) {
        const { password, new_password, ...profile } = adminProfile;
        const payload = { ...profile };
        if (password || new_password) {
            if (!password || !new_password) {
                throw new common_1.BadRequestException('Incomplete passwords');
            }
            if (password === new_password) {
                throw new common_1.BadRequestException('Old password and new password cannot be the same');
            }
            const oldPassword = (0, codec_transformer_1.decodeMD5)((0, codec_transformer_1.decodeBase64)(password));
            const existedPassword = await this.getExistedPassword();
            if (oldPassword !== existedPassword) {
                throw new common_1.BadRequestException('Old password incorrect');
            }
            payload.password = (0, codec_transformer_1.decodeMD5)((0, codec_transformer_1.decodeBase64)(new_password));
        }
        const existedAuth = await this.adminModel.findOne(undefined, '+password').exec();
        if (existedAuth) {
            await Object.assign(existedAuth, payload).save();
        }
        else {
            await this.adminModel.create(payload);
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