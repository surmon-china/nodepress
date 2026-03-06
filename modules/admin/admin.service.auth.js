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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthService = void 0;
const common_1 = require("@nestjs/common");
const auth_service_access_token_1 = require("../../core/auth/auth.service.access-token");
const auth_service_refresh_token_1 = require("../../core/auth/auth.service.refresh-token");
const codec_transformer_1 = require("../../transformers/codec.transformer");
const auth_constant_1 = require("../../constants/auth.constant");
const app_config_1 = require("../../app.config");
const admin_service_profile_1 = require("./admin.service.profile");
let AdminAuthService = class AdminAuthService {
    adminProfileService;
    accessTokenService;
    refreshTokenService;
    constructor(adminProfileService, accessTokenService, refreshTokenService) {
        this.adminProfileService = adminProfileService;
        this.accessTokenService = accessTokenService;
        this.refreshTokenService = refreshTokenService;
    }
    async createToken() {
        const authPayload = { role: auth_constant_1.AuthRole.Admin };
        const expiresIn = app_config_1.APP_AUTH.jwtExpiresInForAdmin;
        const accessToken = this.accessTokenService.signToken(authPayload, { expiresIn });
        const refreshToken = this.refreshTokenService.generateToken();
        const refreshExpiresIn = app_config_1.APP_AUTH.refreshTokenExpiresInForAdmin;
        await this.refreshTokenService.storeToken(refreshToken, authPayload, refreshExpiresIn);
        return {
            token_type: 'Bearer',
            access_token: accessToken,
            expires_in: expiresIn,
            refresh_token: refreshToken
        };
    }
    async createTokenByPassword(base64Password) {
        const inputPassword = (0, codec_transformer_1.decodeBase64)(base64Password);
        const existedAdminDoc = await this.adminProfileService.getDocument();
        const isValidPassword = await this.adminProfileService.validatePassword(inputPassword, existedAdminDoc?.password);
        if (!isValidPassword) {
            throw new common_1.UnauthorizedException('Password incorrect');
        }
        return await this.createToken();
    }
    async refreshToken(refreshToken) {
        const payload = await this.refreshTokenService.getPayload(refreshToken);
        if (!payload || payload.role !== auth_constant_1.AuthRole.Admin) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        await this.refreshTokenService.revokeToken(refreshToken);
        return await this.createToken();
    }
    async revokeTokens(accessToken, refreshToken) {
        await this.accessTokenService.invalidateToken(accessToken);
        if (refreshToken)
            await this.refreshTokenService.revokeToken(refreshToken);
    }
};
exports.AdminAuthService = AdminAuthService;
exports.AdminAuthService = AdminAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_service_profile_1.AdminProfileService,
        auth_service_access_token_1.AuthAccessTokenService,
        auth_service_refresh_token_1.AuthRefreshTokenService])
], AdminAuthService);
//# sourceMappingURL=admin.service.auth.js.map