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
exports.CommentListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const helper_service_email_1 = require("../../core/helper/helper.service.email");
const helper_service_ip_1 = require("../../core/helper/helper.service.ip");
const biz_constant_1 = require("../../constants/biz.constant");
const events_constant_1 = require("../../constants/events.constant");
const error_transformer_1 = require("../../transformers/error.transformer");
const email_transformer_1 = require("../../transformers/email.transformer");
const app_config_1 = require("../../app.config");
let CommentListener = class CommentListener {
    emailService;
    ipService;
    constructor(emailService, ipService) {
        this.emailService = emailService;
        this.ipService = ipService;
    }
    async handleCommentCreateFailed({ comment, visitor, error }) {
        const subject = 'User comment creation failed';
        const userAgent = visitor.ua ?? comment.agent;
        const location = visitor.ip ? await this.ipService.queryLocation(visitor.ip) : null;
        const targetPage = comment.post_id === biz_constant_1.GUESTBOOK_POST_ID ? 'Guestbook' : `Article ${comment.post_id}`;
        this.emailService.sendMailAs(app_config_1.APP_BIZ.NAME, {
            to: app_config_1.APP_BIZ.ADMIN_EMAIL,
            subject,
            ...(0, email_transformer_1.linesToEmailContent)([
                `${subject}!`,
                `CommentPid: ${comment.pid}`,
                `CommentPostId: ${targetPage}`,
                `CommentContent: ${comment.content || '-'}`,
                `CommentAuthor: ${comment.author.name || '-'} · ${comment.author.email || '-'} · ${comment.author.site || '-'}`,
                `ErrorDetail: ${(0, error_transformer_1.getMessageFromNormalError)(error)}`,
                `AuthorAgent: ${userAgent ? (0, email_transformer_1.getUserAgentText)(userAgent) : 'unknown'}`,
                `Referer: ${visitor.referer || 'unknown'}`,
                `IP: ${visitor.ip || 'unknown'}`,
                `Location: ${location ? (0, email_transformer_1.getLocationText)(location) : 'unknown'}`
            ])
        });
    }
};
exports.CommentListener = CommentListener;
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.CommentCreateFailed, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentListener.prototype, "handleCommentCreateFailed", null);
exports.CommentListener = CommentListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_email_1.EmailService,
        helper_service_ip_1.IPService])
], CommentListener);
//# sourceMappingURL=comment.listener.js.map