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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisListener = void 0;
const throttle_1 = __importDefault(require("lodash/throttle"));
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const helper_service_email_1 = require("../helper/helper.service.email");
const events_constant_1 = require("../../constants/events.constant");
const app_config_1 = require("../../app.config");
let RedisListener = class RedisListener {
    emailService;
    constructor(emailService) {
        this.emailService = emailService;
    }
    sendAlarmMail = (0, throttle_1.default)((message) => {
        this.emailService.sendMailAs(app_config_1.APP_BIZ.NAME, {
            to: app_config_1.APP_BIZ.ADMIN_EMAIL,
            subject: 'Redis Error!',
            text: message,
            html: `<pre><code>${message}</code></pre>`
        });
    }, 30 * 1000);
    async handleRedisError(error) {
        const message = error.errors?.map((e) => e.message) ?? error.message ?? error;
        await this.sendAlarmMail(String(message));
    }
};
exports.RedisListener = RedisListener;
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.RedisError, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RedisListener.prototype, "handleRedisError", null);
exports.RedisListener = RedisListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_email_1.EmailService])
], RedisListener);
//# sourceMappingURL=redis.listener.js.map