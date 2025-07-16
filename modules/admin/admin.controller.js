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
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const helper_service_email_1 = require("../../core/helper/helper.service.email");
const helper_service_ip_1 = require("../../core/helper/helper.service.ip");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const auth_service_1 = require("../../core/auth/auth.service");
const admin_service_1 = require("./admin.service");
const admin_dto_1 = require("./admin.dto");
const app_config_1 = require("../../app.config");
let AdminController = class AdminController {
    ipService;
    emailService;
    adminService;
    authService;
    constructor(ipService, emailService, adminService, authService) {
        this.ipService = ipService;
        this.emailService = emailService;
        this.adminService = adminService;
        this.authService = authService;
    }
    async login({ visitor: { ip } }, body) {
        const token = await this.adminService.login(body.password);
        if (ip) {
            const location = await this.ipService.queryLocation(ip);
            const subject = 'App has a new login activity';
            const locationText = location ? [location.country, location.region, location.city].join(' · ') : 'unknow';
            const content = `${subject}. IP: ${ip}, location: ${locationText}`;
            this.emailService.sendMailAs(app_config_1.APP_BIZ.NAME, {
                to: app_config_1.APP_BIZ.ADMIN_EMAIL,
                subject,
                text: content,
                html: content
            });
        }
        return token;
    }
    async logout({ token }) {
        await this.authService.invalidateToken(token);
        return 'ok';
    }
    refreshToken() {
        return this.adminService.createToken();
    }
    checkToken() {
        return 'ok';
    }
    getAdminProfile() {
        return this.adminService.getProfile();
    }
    putAdminProfile(adminProfile) {
        return this.adminService.updateProfile(adminProfile);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('login'),
    (0, success_response_decorator_1.SuccessResponse)('Login succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.AuthLoginDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Logout succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Refresh token succeeded'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AdminController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Get)('check-token'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Token is valid'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AdminController.prototype, "checkToken", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, success_response_decorator_1.SuccessResponse)('Get admin profile succeeded'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAdminProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Update admin profile succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.AdminUpdateDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "putAdminProfile", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [helper_service_ip_1.IPService,
        helper_service_email_1.EmailService,
        admin_service_1.AdminService,
        auth_service_1.AuthService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map