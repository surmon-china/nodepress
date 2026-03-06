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
exports.UserAuthTokenService = void 0;
const common_1 = require("@nestjs/common");
const auth_service_access_token_1 = require("../../../core/auth/auth.service.access-token");
const auth_service_refresh_token_1 = require("../../../core/auth/auth.service.refresh-token");
const auth_constant_1 = require("../../../constants/auth.constant");
const app_config_1 = require("../../../app.config");
let UserAuthTokenService = class UserAuthTokenService {
    accessTokenService;
    refreshTokenService;
    constructor(accessTokenService, refreshTokenService) {
        this.accessTokenService = accessTokenService;
        this.refreshTokenService = refreshTokenService;
    }
    async createToken(userId) {
        const authPayload = { role: auth_constant_1.AuthRole.User, uid: userId };
        const expiresIn = app_config_1.APP_AUTH.jwtExpiresInForUser;
        const accessToken = this.accessTokenService.signToken(authPayload, { expiresIn });
        const refreshToken = this.refreshTokenService.generateToken();
        const refreshExpiresIn = app_config_1.APP_AUTH.refreshTokenExpiresInForUser;
        await this.refreshTokenService.storeToken(refreshToken, authPayload, refreshExpiresIn);
        return {
            token_type: 'Bearer',
            access_token: accessToken,
            expires_in: expiresIn,
            refresh_token: refreshToken
        };
    }
    async refreshToken(refreshToken) {
        const payload = await this.refreshTokenService.getPayload(refreshToken);
        if (!payload || payload.role !== auth_constant_1.AuthRole.User || !payload.uid) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        await this.refreshTokenService.revokeToken(refreshToken);
        return await this.createToken(payload.uid);
    }
    async revokeTokens(accessToken, refreshToken) {
        await this.accessTokenService.invalidateToken(accessToken);
        if (refreshToken)
            await this.refreshTokenService.revokeToken(refreshToken);
    }
};
exports.UserAuthTokenService = UserAuthTokenService;
exports.UserAuthTokenService = UserAuthTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_access_token_1.AuthAccessTokenService,
        auth_service_refresh_token_1.AuthRefreshTokenService])
], UserAuthTokenService);
//# sourceMappingURL=auth.service.token.js.map