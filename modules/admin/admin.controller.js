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
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const only_identity_decorator_1 = require("../../decorators/only-identity.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const codec_transformer_1 = require("../../transformers/codec.transformer");
const events_constant_1 = require("../../constants/events.constant");
const admin_dto_1 = require("./admin.dto");
const admin_service_token_1 = require("./admin.service.token");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    eventEmitter;
    adminService;
    authTokenService;
    constructor(eventEmitter, adminService, authTokenService) {
        this.eventEmitter = eventEmitter;
        this.adminService = adminService;
        this.authTokenService = authTokenService;
    }
    getAdminProfile() {
        return this.adminService.getProfileCache();
    }
    updateAdminProfile(dto) {
        return this.adminService.updateProfile(dto);
    }
    async login({ visitor }, dto) {
        const inputPassword = (0, codec_transformer_1.decodeBase64)(dto.password);
        const existedAdminDoc = await this.adminService.getDocument();
        const isValidPassword = await this.adminService.validatePassword(inputPassword, existedAdminDoc?.password);
        if (!isValidPassword) {
            throw new common_1.UnauthorizedException('Password incorrect');
        }
        const token = this.authTokenService.createToken();
        this.eventEmitter.emit(events_constant_1.EventKeys.AdminLoggedIn, visitor);
        return token;
    }
    async logout({ identity }) {
        await this.authTokenService.invalidateToken(identity.token);
        this.eventEmitter.emit(events_constant_1.EventKeys.AdminLoggedOut, identity.token);
        return 'ok';
    }
    refreshToken() {
        return this.authTokenService.createToken();
    }
    checkToken() {
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
    (0, common_1.Post)('login'),
    (0, success_response_decorator_1.SuccessResponse)('Login succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.AuthLoginDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Logout succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Refresh token succeeded'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AdminController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('check-token'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Token is valid'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AdminController.prototype, "checkToken", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2,
        admin_service_1.AdminService,
        admin_service_token_1.AdminAuthTokenService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map