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
exports.FeedbackListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const helper_service_email_1 = require("../../core/helper/helper.service.email");
const events_constant_1 = require("../../constants/events.constant");
const email_transformer_1 = require("../../transformers/email.transformer");
const feedback_model_1 = require("./feedback.model");
const app_config_1 = require("../../app.config");
let FeedbackListener = class FeedbackListener {
    emailService;
    constructor(emailService) {
        this.emailService = emailService;
    }
    async handleFeedbackCreated(feedback) {
        const subject = 'You have a new feedback';
        this.emailService.sendMailAs(app_config_1.APP_BIZ.FE_NAME, {
            to: app_config_1.APP_BIZ.ADMIN_EMAIL,
            subject,
            ...(0, email_transformer_1.linesToEmailContent)([
                `${subject} on '${feedback.tid}'.`,
                `Emotion: ${feedback.emotion_emoji} ${feedback.emotion_text} (${feedback.emotion})`,
                `Content: ${feedback.content}`,
                `Author: ${feedback.user_name || 'Anonymous user'}`,
                `Location: ${feedback.ip_location ? (0, email_transformer_1.getLocationText)(feedback.ip_location) : 'unknown'}`,
                `UserAgent: ${feedback.user_agent ? (0, email_transformer_1.getUserAgentText)(feedback.user_agent) : 'unknown'}`
            ])
        });
    }
};
exports.FeedbackListener = FeedbackListener;
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.FeedbackCreated, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [feedback_model_1.Feedback]),
    __metadata("design:returntype", Promise)
], FeedbackListener.prototype, "handleFeedbackCreated", null);
exports.FeedbackListener = FeedbackListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_email_1.EmailService])
], FeedbackListener);
//# sourceMappingURL=feedback.listener.js.map