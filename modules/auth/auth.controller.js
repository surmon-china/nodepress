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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const helper_service_ip_1 = require("../../processors/helper/helper.service.ip");
const helper_service_email_1 = require("../../processors/helper/helper.service.email");
const responser_decorator_1 = require("../../decorators/responser.decorator");
const queryparams_decorator_1 = require("../../decorators/queryparams.decorator");
const auth_dto_1 = require("./auth.dto");
const auth_service_1 = require("./auth.service");
const app_config_1 = require("../../app.config");
let AuthController = class AuthController {
    constructor(ipService, emailService, authService) {
        this.ipService = ipService;
        this.emailService = emailService;
        this.authService = authService;
    }
    async login({ visitor: { ip } }, body) {
        const token = await this.authService.adminLogin(body.password);
        if (ip) {
            this.ipService.queryLocation(ip).then((location) => {
                const subject = `App has a new login activity`;
                const locationText = location ? [location.country, location.region, location.city].join(' · ') : 'unknow';
                const content = `${subject}. IP: ${ip}, location: ${locationText}`;
                this.emailService.sendMailAs(app_config_1.APP_BIZ.NAME, {
                    to: app_config_1.APP_BIZ.ADMIN_EMAIL,
                    subject,
                    text: content,
                    html: content
                });
            });
        }
        return token;
    }
    checkToken() {
        return 'ok';
    }
    renewalToken() {
        return this.authService.createToken();
    }
    getAdminProfile() {
        return this.authService.getAdminProfile();
    }
    putAdminProfile(adminProfile) {
        return this.authService.putAdminProfile(adminProfile);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    responser_decorator_1.Responser.handle({ message: 'Login', error: common_1.HttpStatus.BAD_REQUEST }),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.AuthLoginDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('check'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Check token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AuthController.prototype, "checkToken", null);
__decorate([
    (0, common_1.Post)('renewal'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Renewal token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AuthController.prototype, "renewalToken", null);
__decorate([
    (0, common_1.Get)('admin'),
    responser_decorator_1.Responser.handle('Get admin profile'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAdminProfile", null);
__decorate([
    (0, common_1.Put)('admin'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Update admin profile'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AdminUpdateDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "putAdminProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [helper_service_ip_1.IPService,
        helper_service_email_1.EmailService,
        auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map