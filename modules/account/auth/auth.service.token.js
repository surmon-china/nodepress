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
const auth_service_1 = require("../../../core/auth/auth.service");
const auth_constant_1 = require("../../../constants/auth.constant");
const app_config_1 = require("../../../app.config");
let UserAuthTokenService = class UserAuthTokenService {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    createToken(user) {
        return this.authService.signToken({ role: auth_constant_1.AuthRole.User, uid: user.id }, { expiresIn: app_config_1.APP_AUTH.jwtExpiresInForUser });
    }
    invalidateToken(token) {
        return this.authService.invalidateToken(token);
    }
};
exports.UserAuthTokenService = UserAuthTokenService;
exports.UserAuthTokenService = UserAuthTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], UserAuthTokenService);
//# sourceMappingURL=auth.service.token.js.map