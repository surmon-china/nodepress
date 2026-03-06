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
exports.AdminController = void 0;
const throttler_1 = require("@nestjs/throttler");
const event_emitter_1 = require("@nestjs/event-emitter");
const common_1 = require("@nestjs/common");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const only_identity_decorator_1 = require("../../decorators/only-identity.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const events_constant_1 = require("../../constants/events.constant");
const admin_dto_1 = require("./admin.dto");
const admin_dto_2 = require("./admin.dto");
const admin_service_profile_1 = require("./admin.service.profile");
const admin_service_auth_1 = require("./admin.service.auth");
let AdminController = class AdminController {
    eventEmitter;
    adminProfileService;
    adminAuthService;
    constructor(eventEmitter, adminProfileService, adminAuthService) {
        this.eventEmitter = eventEmitter;
        this.adminProfileService = adminProfileService;
        this.adminAuthService = adminAuthService;
    }
    getAdminProfile() {
        return this.adminProfileService.getCache();
    }
    updateAdminProfile(dto) {
        return this.adminProfileService.update(dto);
    }
    async login({ visitor }, { password }) {
        const token = await this.adminAuthService.createTokenByPassword(password);
        this.eventEmitter.emit(events_constant_1.GlobalEventKey.AdminLoggedIn, visitor);
        return token;
    }
    async logout({ identity }, { refresh_token }) {
        await this.adminAuthService.revokeTokens(identity.token, refresh_token);
        this.eventEmitter.emit(events_constant_1.GlobalEventKey.AdminLoggedOut);
        return 'ok';
    }
    refreshToken({ refresh_token }) {
        return this.adminAuthService.refreshToken(refresh_token);
    }
    verifyToken() {
        return 'ok';
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, success_response_decorator_1.SuccessResponse)('Get admin profile succeeded'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAdminProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Update admin profile succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateAdminProfile", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { ttl: (0, throttler_1.minutes)(1), limit: 10 } }),
    (0, common_1.Post)('login'),
    (0, success_response_decorator_1.SuccessResponse)('Login succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_2.AuthLoginDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Logout succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_2.AuthLogoutDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "logout", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { ttl: (0, throttler_1.hours)(1), limit: 10 } }),
    (0, common_1.Post)('refresh-token'),
    (0, success_response_decorator_1.SuccessResponse)('Refresh token succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_2.AuthRefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('verify-token'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Token is valid'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AdminController.prototype, "verifyToken", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2,
        admin_service_profile_1.AdminProfileService,
        admin_service_auth_1.AdminAuthService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map