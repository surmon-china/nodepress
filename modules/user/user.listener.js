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
exports.UserListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const events_constant_1 = require("../../constants/events.constant");
const helper_service_email_1 = require("../../core/helper/helper.service.email");
const email_transformer_1 = require("../../transformers/email.transformer");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const app_config_1 = require("../../app.config");
const user_model_1 = require("./user.model");
const logger = (0, logger_1.createLogger)({ scope: 'UserListener', time: app_environment_1.isDevEnv });
let UserListener = class UserListener {
    emailService;
    constructor(emailService) {
        this.emailService = emailService;
    }
    handleUserCreated(user) {
        const subject = `New user registered: ${user.name} (#${user.id})`;
        this.emailService.sendMailAs(app_config_1.APP_BIZ.FE_NAME, {
            to: app_config_1.APP_BIZ.ADMIN_EMAIL,
            subject,
            ...(0, email_transformer_1.linesToEmailContent)([
                subject,
                `ID: #${user.id}`,
                `Name: ${user.name}`,
                `Email: ${user.email || 'No email'}`,
                `Website: ${user.website || 'No website'}`,
                `Identities: ${user.identities.map((identity) => identity.provider).join(', ') || 'No identities'}`,
                `At: ${(0, email_transformer_1.getTimeText)(user.created_at)}`
            ])
        });
    }
    handleUserDeleted(user) {
        logger.log(`User deleted: ${user.name} (#${user.id})`);
        if (user.email) {
            const subject = `Your account at ${app_config_1.APP_BIZ.FE_NAME} has been deleted`;
            this.emailService.sendMailAs(app_config_1.APP_BIZ.FE_NAME, {
                to: user.email,
                subject,
                ...(0, email_transformer_1.linesToEmailContent)([
                    `Hi ${user.name},`,
                    `Your account (#${user.id}) and all related data have been permanently deleted from our database.`,
                    `We are sorry to see you go.`,
                    ``,
                    ``,
                    `Best regards,`,
                    `${app_config_1.APP_BIZ.FE_NAME} Team`
                ])
            });
        }
    }
};
exports.UserListener = UserListener;
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.GlobalEventKey.UserCreated),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_model_1.User]),
    __metadata("design:returntype", void 0)
], UserListener.prototype, "handleUserCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.GlobalEventKey.UserDeleted),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_model_1.User]),
    __metadata("design:returntype", void 0)
], UserListener.prototype, "handleUserDeleted", null);
exports.UserListener = UserListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_email_1.EmailService])
], UserListener);
//# sourceMappingURL=user.listener.js.map