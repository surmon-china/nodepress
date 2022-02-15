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
exports.VoteController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const queryparams_decorator_1 = require("../../decorators/queryparams.decorator");
const responsor_decorator_1 = require("../../decorators/responsor.decorator");
const helper_service_ip_1 = require("../../processors/helper/helper.service.ip");
const helper_service_email_1 = require("../../processors/helper/helper.service.email");
const option_service_1 = require("../option/option.service");
const article_service_1 = require("../article/article.service");
const comment_service_1 = require("../comment/comment.service");
const disqus_service_public_1 = require("../disqus/disqus.service.public");
const disqus_token_1 = require("../disqus/disqus.token");
const biz_interface_1 = require("../../interfaces/biz.interface");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const vote_dto_1 = require("./vote.dto");
const APP_CONFIG = __importStar(require("../../app.config"));
let VoteController = class VoteController {
    constructor(ipService, emailService, disqusPublicService, commentService, articleService, optionService) {
        this.ipService = ipService;
        this.emailService = emailService;
        this.disqusPublicService = disqusPublicService;
        this.commentService = commentService;
        this.articleService = articleService;
        this.optionService = optionService;
    }
    async getAuthor(author, token) {
        if (token) {
            try {
                const userInfo = await this.disqusPublicService.getUserInfo(token);
                const isAdmin = userInfo.username === APP_CONFIG.DISQUS.adminUsername;
                const moderator = isAdmin ? ` / Moderator` : '';
                return [`${userInfo.name} (Disqus user${moderator})`, userInfo.url, userInfo.profileUrl]
                    .filter(Boolean)
                    .join(' · ');
            }
            catch (error) { }
        }
        if (author) {
            return `${author.name} (Guest user)`;
        }
        return null;
    }
    async getTargetTitle(post_id) {
        if (post_id === biz_interface_1.CommentPostID.Guestbook) {
            return 'guestbook';
        }
        else {
            const article = await this.articleService.getDetailByNumberIDOrSlug({ idOrSlug: post_id });
            return article.toObject().title;
        }
    }
    emailToTargetVoteMessage(message) {
        const mailTexts = [
            `${message.subject} on "${message.on}".`,
            `Vote: ${message.vote}`,
            `Author: ${message.author}`,
            `Location: ${message.location
                ? [message.location.country, message.location.region, message.location.city].join(' · ')
                : 'unknow'}`,
        ];
        const textHTML = mailTexts.map((text) => `<p>${text}</p>`).join('');
        const linkHTML = `<a href="${message.link}" target="_blank">${message.on}</a>`;
        this.emailService.sendMailAs(APP_CONFIG.APP.FE_NAME, {
            to: message.to,
            subject: message.subject,
            text: mailTexts.join('\n'),
            html: [textHTML, `<br>`, linkHTML].join('\n'),
        });
    }
    async voteDisqusThread(articleID, vote, token) {
        const thread = await this.disqusPublicService.ensureThreadDetailCache(articleID);
        const result = await this.disqusPublicService.voteThread({
            access_token: token || null,
            thread: thread.id,
            vote,
        });
        return result;
    }
    async likeSite(voteBody, token, { visitor }) {
        const likes = await this.optionService.incrementLikes();
        this.voteDisqusThread(biz_interface_1.CommentPostID.Guestbook, 1, token === null || token === void 0 ? void 0 : token.access_token).catch(() => { });
        this.getAuthor(voteBody.author, token === null || token === void 0 ? void 0 : token.access_token).then(async (author) => {
            if (author) {
                this.emailToTargetVoteMessage({
                    to: APP_CONFIG.APP.ADMIN_EMAIL,
                    subject: `You have a new site vote`,
                    on: await this.getTargetTitle(biz_interface_1.CommentPostID.Guestbook),
                    vote: '+1',
                    author: author || 'Anonymous user',
                    location: await this.ipService.queryLocation(visitor.ip),
                    link: (0, urlmap_transformer_1.getPermalinkByID)(biz_interface_1.CommentPostID.Guestbook),
                });
            }
        });
        return likes;
    }
    async voteArticle(voteBody, token, { visitor }) {
        const likes = await this.articleService.incrementLikes(voteBody.article_id);
        this.voteDisqusThread(voteBody.article_id, voteBody.vote, token === null || token === void 0 ? void 0 : token.access_token).catch(() => { });
        this.getAuthor(voteBody.author, token === null || token === void 0 ? void 0 : token.access_token).then(async (author) => {
            if (author) {
                this.emailToTargetVoteMessage({
                    to: APP_CONFIG.APP.ADMIN_EMAIL,
                    subject: `You have a new article vote`,
                    on: await this.getTargetTitle(voteBody.article_id),
                    vote: '+1',
                    author,
                    location: await this.ipService.queryLocation(visitor.ip),
                    link: (0, urlmap_transformer_1.getPermalinkByID)(voteBody.article_id),
                });
            }
        });
        return likes;
    }
    async voteComment(voteBody, token, { visitor }) {
        const result = await this.commentService.vote(voteBody.comment_id, voteBody.vote > 0);
        if (token) {
            try {
                const postID = await this.disqusPublicService.getDisqusPostIDByCommentID(voteBody.comment_id);
                if (postID) {
                    await this.disqusPublicService.votePost({
                        access_token: token.access_token,
                        post: postID,
                        vote: voteBody.vote,
                    });
                }
            }
            catch (error) { }
        }
        this.getAuthor(voteBody.author, token === null || token === void 0 ? void 0 : token.access_token).then((author) => {
            if (author) {
                this.commentService.getDetailByNumberID(voteBody.comment_id).then(async (comment) => {
                    const tagetTitle = await this.getTargetTitle(comment.post_id);
                    const mailParams = {
                        vote: voteBody.vote > 0 ? '+1' : '-1',
                        on: `${tagetTitle} #${comment.id}`,
                        author,
                        location: await this.ipService.queryLocation(visitor.ip),
                        link: (0, urlmap_transformer_1.getPermalinkByID)(comment.post_id),
                    };
                    this.emailToTargetVoteMessage(Object.assign({ to: APP_CONFIG.APP.ADMIN_EMAIL, subject: `You have a new comment vote` }, mailParams));
                    if (comment.author.email) {
                        this.emailToTargetVoteMessage(Object.assign({ to: comment.author.email, subject: `Your comment #${comment.id} has a new vote` }, mailParams));
                    }
                });
            }
        });
        return result;
    }
};
__decorate([
    (0, throttler_1.Throttle)(10, 60 * 60),
    (0, common_1.Post)('/site'),
    responsor_decorator_1.Responsor.handle('Vote site'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, disqus_token_1.DisqusToken)()),
    __param(2, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vote_dto_1.VoteAuthorDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], VoteController.prototype, "likeSite", null);
__decorate([
    (0, throttler_1.Throttle)(15, 60),
    (0, common_1.Post)('/article'),
    responsor_decorator_1.Responsor.handle('Vote article'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, disqus_token_1.DisqusToken)()),
    __param(2, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vote_dto_1.PageVoteDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], VoteController.prototype, "voteArticle", null);
__decorate([
    (0, throttler_1.Throttle)(10, 30),
    (0, common_1.Post)('/comment'),
    responsor_decorator_1.Responsor.handle('Vote comment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, disqus_token_1.DisqusToken)()),
    __param(2, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vote_dto_1.CommentVoteDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], VoteController.prototype, "voteComment", null);
VoteController = __decorate([
    (0, common_1.Controller)('vote'),
    __metadata("design:paramtypes", [helper_service_ip_1.IPService,
        helper_service_email_1.EmailService,
        disqus_service_public_1.DisqusPublicService,
        comment_service_1.CommentService,
        article_service_1.ArticleService,
        option_service_1.OptionService])
], VoteController);
exports.VoteController = VoteController;
//# sourceMappingURL=vote.controller.js.map