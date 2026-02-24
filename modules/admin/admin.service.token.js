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
exports.AdminAuthTokenService = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../core/auth/auth.service");
const auth_constant_1 = require("../../constants/auth.constant");
const app_config_1 = require("../../app.config");
let AdminAuthTokenService = class AdminAuthTokenService {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    createToken() {
        return {
            expires_in: app_config_1.APP_AUTH.jwtExpiresInForAdmin,
            access_token: this.authService.signToken({ role: auth_constant_1.AuthRole.Admin }, { expiresIn: app_config_1.APP_AUTH.jwtExpiresInForAdmin })
        };
    }
    invalidateToken(token) {
        return this.authService.invalidateToken(token);
    }
};
exports.AdminAuthTokenService = AdminAuthTokenService;
exports.AdminAuthTokenService = AdminAuthTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AdminAuthTokenService);
//# sourceMappingURL=admin.service.token.js.map