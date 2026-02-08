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
exports.AdminEventListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const helper_service_email_1 = require("../../core/helper/helper.service.email");
const helper_service_ip_1 = require("../../core/helper/helper.service.ip");
const events_constant_1 = require("../../constants/events.constant");
const app_config_1 = require("../../app.config");
let AdminEventListener = class AdminEventListener {
    emailService;
    ipService;
    constructor(emailService, ipService) {
        this.emailService = emailService;
        this.ipService = ipService;
    }
    async handleAdminLogin({ ip, ua }) {
        const subject = 'App has a new login activity';
        const location = ip ? await this.ipService.queryLocation(ip) : null;
        const locationText = location ? [location.country, location.region, location.city].join(' · ') : 'unknown';
        const lines = [
            subject,
            `Time: ${new Date().toLocaleString('zh-CN')}`,
            `IP: ${ip || 'unknown'}`,
            `Location: ${locationText}`,
            `UA: ${ua || 'unknown'}`
        ];
        this.emailService.sendMailAs(app_config_1.APP_BIZ.NAME, {
            to: app_config_1.APP_BIZ.ADMIN_EMAIL,
            subject,
            text: lines.join('\n'),
            html: lines.map((line) => `<p>${line}</p>`).join('\n')
        });
    }
    async handleAdminLoggedOut(token) {
    }
};
exports.AdminEventListener = AdminEventListener;
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.AdminLoggedIn, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminEventListener.prototype, "handleAdminLogin", null);
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.AdminLoggedOut, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminEventListener.prototype, "handleAdminLoggedOut", null);
exports.AdminEventListener = AdminEventListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_email_1.EmailService,
        helper_service_ip_1.IPService])
], AdminEventListener);
//# sourceMappingURL=admin.listener.js.map