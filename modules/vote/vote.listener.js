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
exports.VoteListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const events_constant_1 = require("../../constants/events.constant");
const helper_service_email_1 = require("../../core/helper/helper.service.email");
const article_service_1 = require("../article/article.service");
const comment_service_1 = require("../comment/comment.service");
const comment_helper_1 = require("../comment/comment.helper");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const email_transformer_1 = require("../../transformers/email.transformer");
const email_transformer_2 = require("../../transformers/email.transformer");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const app_config_1 = require("../../app.config");
const vote_constant_1 = require("./vote.constant");
const logger = (0, logger_1.createLogger)({ scope: 'VoteListener', time: app_environment_1.isDevEnv });
let VoteListener = class VoteListener {
    emailService;
    articleService;
    commentService;
    constructor(emailService, articleService, commentService) {
        this.emailService = emailService;
        this.articleService = articleService;
        this.commentService = commentService;
    }
    async handleVoteCreated(vote) {
        try {
            const voteEmoji = vote.vote_type === vote_constant_1.VoteType.Upvote ? '👍' : '👎';
            const voteAction = vote_constant_1.VoteType[vote.vote_type];
            const voteText = `${voteEmoji}  ${voteAction}`;
            const sendMailToAdmin = (targetTitle, targetLink) => {
                this.emailService.sendMailAs(app_config_1.APP_BIZ.FE_NAME, {
                    to: app_config_1.APP_BIZ.ADMIN_EMAIL,
                    subject: `New vote on ${targetTitle}`,
                    ...(0, email_transformer_2.linesToEmailContent)([
                        `You have a new vote on ${targetTitle}.`,
                        `Link: ${targetLink}`,
                        `Type: ${voteText}`,
                        `Author: ${(0, email_transformer_1.getAuthorText)({ user: vote.user, name: vote.author_name, email: vote.author_email })}`,
                        `IP: ${vote.ip || 'Unknown'}`,
                        `Location: ${vote.ip_location ? (0, email_transformer_1.getLocationText)(vote.ip_location) : 'Unknown'}`,
                        `Agent: ${vote.user_agent ? (0, email_transformer_1.getUserAgentText)(vote.user_agent) : 'Unknown'}`
                    ])
                });
            };
            if (vote.target_type === vote_constant_1.VoteTargetType.Article) {
                const targetLink = (0, urlmap_transformer_1.getArticleUrl)(vote.target_id);
                const targetTitle = await this.articleService
                    .getDetail(vote.target_id, { lean: true })
                    .then((article) => `"${article.title}"`)
                    .catch(() => `article #${vote.target_id}`);
                sendMailToAdmin(targetTitle, targetLink);
            }
            if (vote.target_type === vote_constant_1.VoteTargetType.Comment) {
                const comment = await this.commentService.getDetail(vote.target_id, 'withUser');
                const targetLink = (0, urlmap_transformer_1.getPermalink)(comment.target_type, comment.target_id) + `#comment-${comment.id}`;
                const targetTitle = `comment #${comment.id}`;
                sendMailToAdmin(targetTitle, targetLink);
                const voteAuthorEmail = vote.user?.email ?? vote.author_email;
                const commentAuthorEmail = (0, comment_helper_1.getCommentNotificationEmail)(comment);
                if (!commentAuthorEmail)
                    return;
                if (commentAuthorEmail === voteAuthorEmail)
                    return;
                const subject = `Your comment #${comment.id} has a new vote`;
                this.emailService.sendMailAs(app_config_1.APP_BIZ.FE_NAME, {
                    to: commentAuthorEmail,
                    subject,
                    ...(0, email_transformer_2.linesToEmailContent)([
                        `Hello ${comment.author_name}, ${subject}.`,
                        `Target: ${targetTitle}`,
                        `Type: ${voteText}`,
                        `From: ${vote.author_name || 'Anonymous'}`,
                        `View on: ${targetLink}`
                    ])
                });
            }
        }
        catch (error) {
            logger.error('Error handling vote created event', error);
        }
    }
};
exports.VoteListener = VoteListener;
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.VoteCreated, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VoteListener.prototype, "handleVoteCreated", null);
exports.VoteListener = VoteListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_email_1.EmailService,
        article_service_1.ArticleService,
        comment_service_1.CommentService])
], VoteListener);
//# sourceMappingURL=vote.listener.js.map