"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
const auth_guard_1 = require("../../guards/auth.guard");
const helper_service_ip_1 = require("../../processors/helper/helper.service.ip");
const helper_service_email_1 = require("../../processors/helper/helper.service.email");
const http_decorator_1 = require("../../decorators/http.decorator");
const query_params_decorator_1 = require("../../decorators/query-params.decorator");
const auth_service_1 = require("./auth.service");
const auth_model_1 = require("./auth.model");
const APP_CONFIG = __importStar(require("../../app.config"));
let AuthController = class AuthController {
    constructor(ipService, emailService, authService) {
        this.ipService = ipService;
        this.emailService = emailService;
        this.authService = authService;
    }
    getAdminInfo() {
        return this.authService.getAdminInfo();
    }
    putAdminInfo(auth) {
        return this.authService.putAdminInfo(auth);
    }
    async login({ visitors: { ip } }, body) {
        const token = await this.authService.adminLogin(body.password);
        const ipLocation = await this.ipService.query(ip);
        const subject = '博客有新的登陆行为';
        const city = (ipLocation === null || ipLocation === void 0 ? void 0 : ipLocation.city) || '未知城市';
        const country = (ipLocation === null || ipLocation === void 0 ? void 0 : ipLocation.country) || '未知国家';
        const content = `来源 IP：${ip}，地理位置为：${country} - ${city}`;
        this.emailService.sendMail({
            subject,
            to: APP_CONFIG.EMAIL.admin,
            text: `${subject}，${content}`,
            html: `${subject}，${content}`,
        });
        return token;
    }
    checkToken() {
        return 'ok';
    }
    renewalToken() {
        return this.authService.createToken();
    }
};
__decorate([
    (0, common_1.Get)('admin'),
    http_decorator_1.HttpProcessor.handle('获取管理员信息'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAdminInfo", null);
__decorate([
    (0, common_1.Put)('admin'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('修改管理员信息'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_model_1.Auth]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "putAdminInfo", null);
__decorate([
    (0, common_1.Post)('login'),
    http_decorator_1.HttpProcessor.handle({ message: '登陆', error: common_1.HttpStatus.BAD_REQUEST }),
    __param(0, (0, query_params_decorator_1.QueryParams)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_model_1.AuthPasswordPayload]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('check'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('检测 Token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AuthController.prototype, "checkToken", null);
__decorate([
    (0, common_1.Post)('renewal'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('Token 续签'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AuthController.prototype, "renewalToken", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [helper_service_ip_1.IPService,
        helper_service_email_1.EmailService,
        auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map