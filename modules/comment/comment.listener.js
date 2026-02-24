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
const events_constant_1 = require("../../constants/events.constant");
const article_service_1 = require("../article/article.service");
const comment_service_1 = require("./comment.service");
const comment_helper_1 = require("./comment.helper");
const comment_constant_1 = require("./comment.constant");
const email_transformer_1 = require("../../transformers/email.transformer");
const error_transformer_1 = require("../../transformers/error.transformer");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const app_config_1 = require("../../app.config");
const logger = (0, logger_1.createLogger)({ scope: 'CommentListener', time: app_environment_1.isDevEnv });
let CommentListener = class CommentListener {
    ipService;
    emailService;
    commentService;
    articleService;
    constructor(ipService, emailService, commentService, articleService) {
        this.ipService = ipService;
        this.emailService = emailService;
        this.commentService = commentService;
        this.articleService = articleService;
    }
    async handleCommentCreated(comment) {
        const targetLink = (0, urlmap_transformer_1.getPermalink)(comment.target_type, comment.target_id) + `#comment-${comment.id}`;
        const targetTitle = comment.target_type === comment_constant_1.CommentTargetType.Page
            ? `Page #${comment.target_id}`
            : await this.articleService
                .getDetail(comment.target_id, { lean: true })
                .then((article) => `"${article.title}"`)
                .catch(() => `Article #${comment.target_id}`);
        const subject = `You have a new comment on "${targetTitle}"`;
        this.emailService.sendMailAs(app_config_1.APP_BIZ.NAME, {
            to: app_config_1.APP_BIZ.ADMIN_EMAIL,
            subject,
            ...(0, email_transformer_1.linesToEmailContent)([
                subject,
                `Content: ${comment.content}`,
                `Author: ${comment.author_name || '-'} · ${comment.author_email || '-'} · ${comment.author_website || '-'}`,
                `Agent: ${comment.user_agent ? (0, email_transformer_1.getUserAgentText)(comment.user_agent) : 'unknown'}`,
                `IP: ${comment.ip || 'unknown'}`,
                `Location: ${comment.ip_location ? (0, email_transformer_1.getLocationText)(comment.ip_location) : 'unknown'}`,
                `URL: ${targetLink}`
            ])
        });
        if (comment.parent_id) {
            try {
                const parentComment = await this.commentService.getDetail(comment.parent_id, 'withUser');
                const parentCommentEmail = (0, comment_helper_1.getCommentNotificationEmail)(parentComment);
                if (!parentCommentEmail)
                    return;
                if (parentCommentEmail === comment.author_email)
                    return;
                const subject = `Your comment #${parentComment.id} has a new reply`;
                this.emailService.sendMailAs(app_config_1.APP_BIZ.FE_NAME, {
                    to: parentCommentEmail,
                    subject,
                    ...(0, email_transformer_1.linesToEmailContent)([
                        `Hello, ${parentComment.author_name || 'there'}.`,
                        `Your comment has a new reply from ${comment.author_name}:`,
                        ``,
                        `${comment.content}`,
                        ``,
                        `View on ${targetTitle}: ${targetLink}`
                    ])
                });
            }
            catch (error) {
                logger.warn('Failed to send email to parent comment author:', error);
            }
        }
    }
    async handleCommentCreateFailed(payload) {
        const { input, visitor, error } = payload;
        const subject = 'User comment creation failed';
        const location = visitor.ip ? await this.ipService.queryLocation(visitor.ip) : null;
        this.emailService.sendMailAs(app_config_1.APP_BIZ.NAME, {
            to: app_config_1.APP_BIZ.ADMIN_EMAIL,
            subject,
            ...(0, email_transformer_1.linesToEmailContent)([
                `${subject}!`,
                `Comment Parent: ${input.parent_id}`,
                `Comment Target: ${input.target_type} - ${input.target_id}`,
                `Comment Content: ${input.content || '-'}`,
                `Comment Author: ${input.author_name || '-'} · ${input.author_email || '-'} · ${input.author_website || '-'}`,
                `Error Detail: ${(0, error_transformer_1.getMessageFromNormalError)(error)}`,
                `Author Agent: ${visitor.agent ? (0, email_transformer_1.getUserAgentText)(visitor.agent) : 'unknown'}`,
                `Referer: ${visitor.referer || 'unknown'}`,
                `IP: ${visitor.ip || 'unknown'}`,
                `Location: ${location ? (0, email_transformer_1.getLocationText)(location) : 'unknown'}`
            ])
        });
    }
};
exports.CommentListener = CommentListener;
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.CommentCreated, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentListener.prototype, "handleCommentCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.CommentCreateFailed, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentListener.prototype, "handleCommentCreateFailed", null);
exports.CommentListener = CommentListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_ip_1.IPService,
        helper_service_email_1.EmailService,
        comment_service_1.CommentService,
        article_service_1.ArticleService])
], CommentListener);
//# sourceMappingURL=comment.listener.js.map