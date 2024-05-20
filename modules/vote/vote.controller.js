"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteController = void 0;
const lodash_1 = __importDefault(require("lodash"));
const ua_parser_js_1 = require("ua-parser-js");
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const expose_pipe_1 = require("../../pipes/expose.pipe");
const responser_decorator_1 = require("../../decorators/responser.decorator");
const queryparams_decorator_1 = require("../../decorators/queryparams.decorator");
const helper_service_ip_1 = require("../../processors/helper/helper.service.ip");
const helper_service_email_1 = require("../../processors/helper/helper.service.email");
const option_service_1 = require("../option/option.service");
const article_service_1 = require("../article/article.service");
const comment_service_1 = require("../comment/comment.service");
const disqus_service_public_1 = require("../disqus/disqus.service.public");
const disqus_token_1 = require("../disqus/disqus.token");
const biz_constant_1 = require("../../constants/biz.constant");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const vote_dto_1 = require("./vote.dto");
const vote_model_1 = require("./vote.model");
const vote_service_1 = require("./vote.service");
const APP_CONFIG = __importStar(require("../../app.config"));
let VoteController = class VoteController {
    constructor(ipService, emailService, disqusPublicService, commentService, articleService, optionService, voteService) {
        this.ipService = ipService;
        this.emailService = emailService;
        this.disqusPublicService = disqusPublicService;
        this.commentService = commentService;
        this.articleService = articleService;
        this.optionService = optionService;
        this.voteService = voteService;
    }
    async queryIPLocation(ip) {
        return ip ? await this.ipService.queryLocation(ip) : null;
    }
    async getPostTitle(postId) {
        if (postId === biz_constant_1.GUESTBOOK_POST_ID) {
            return 'guestbook';
        }
        else {
            const article = await this.articleService.getDetailByNumberIdOrSlug({ idOrSlug: postId });
            return article.toObject().title;
        }
    }
    async getVoteAuthor(payload) {
        const { guestAuthor, disqusToken } = payload !== null && payload !== void 0 ? payload : {};
        if (disqusToken) {
            try {
                const disqusUserInfo = await this.disqusPublicService.getUserInfo(disqusToken);
                return {
                    type: vote_model_1.VoteAuthorType.Disqus,
                    data: {
                        id: disqusUserInfo.id,
                        name: disqusUserInfo.name,
                        username: disqusUserInfo.username,
                        url: disqusUserInfo.url,
                        profileUrl: disqusUserInfo.profileUrl
                    }
                };
            }
            catch (error) { }
        }
        if (guestAuthor) {
            return {
                type: vote_model_1.VoteAuthorType.Guest,
                data: guestAuthor
            };
        }
        return {
            type: vote_model_1.VoteAuthorType.Anonymous,
            data: null
        };
    }
    getAuthorString(voteAuthor) {
        if (voteAuthor.type === vote_model_1.VoteAuthorType.Disqus) {
            const disqusUser = voteAuthor.data;
            const isAdmin = disqusUser.username === APP_CONFIG.DISQUS.adminUsername;
            const userType = `Disqus ${isAdmin ? `moderator` : 'user'}`;
            return [`${disqusUser.name} (${userType})`, disqusUser.profileUrl].filter(Boolean).join(' · ');
        }
        if (voteAuthor.type === vote_model_1.VoteAuthorType.Guest) {
            const guestUser = voteAuthor.data;
            return [`${guestUser.name} (Guest user)`, guestUser.site].filter(Boolean).join(' · ');
        }
        return `Anonymous user`;
    }
    emailToTargetVoteMessage(payload) {
        const getLocationText = (location) => {
            return [location.country, location.region, location.city].join(' · ');
        };
        const getAgentText = (ua) => {
            var _a, _b, _c, _d, _e, _f;
            const uaResult = new ua_parser_js_1.UAParser(ua).getResult();
            return [
                `${(_a = uaResult.browser.name) !== null && _a !== void 0 ? _a : 'unknown_browser'}@${(_b = uaResult.browser.version) !== null && _b !== void 0 ? _b : 'unknown'}`,
                `${(_c = uaResult.os.name) !== null && _c !== void 0 ? _c : 'unknown_OS'}@${(_d = uaResult.os.version) !== null && _d !== void 0 ? _d : 'unknown'}`,
                `${(_e = uaResult.device.model) !== null && _e !== void 0 ? _e : 'unknown_device'}@${(_f = uaResult.device.vendor) !== null && _f !== void 0 ? _f : 'unknown'}`
            ].join(' · ');
        };
        const mailTexts = [
            `${payload.subject} on "${payload.on}".`,
            `Vote: ${payload.vote}`,
            `Author: ${payload.author}`,
            `Location: ${payload.location ? getLocationText(payload.location) : 'unknown'}`,
            `Agent: ${payload.userAgent ? getAgentText(payload.userAgent) : 'unknown'}`
        ];
        const textHTML = mailTexts.map((text) => `<p>${text}</p>`).join('');
        const linkHTML = `<a href="${payload.link}" target="_blank">${payload.on}</a>`;
        this.emailService.sendMailAs(APP_CONFIG.APP.FE_NAME, {
            to: payload.to,
            subject: payload.subject,
            text: mailTexts.join('\n'),
            html: [textHTML, `<br>`, linkHTML].join('\n')
        });
    }
    async voteDisqusThread(postId, vote, token) {
        const thread = await this.disqusPublicService.ensureThreadDetailCache(postId);
        const result = await this.disqusPublicService.voteThread({
            access_token: token || null,
            thread: thread.id,
            vote
        });
        return result;
    }
    getVotes(query) {
        const { sort, page, per_page } = query, filters = __rest(query, ["sort", "page", "per_page"]);
        const paginateQuery = {};
        const paginateOptions = { page, perPage: per_page, dateSort: sort };
        if (!lodash_1.default.isUndefined(filters.target_type)) {
            paginateQuery.target_type = filters.target_type;
        }
        if (!lodash_1.default.isUndefined(filters.target_id)) {
            paginateQuery.target_id = filters.target_id;
        }
        if (!lodash_1.default.isUndefined(filters.vote_type)) {
            paginateQuery.vote_type = filters.vote_type;
        }
        if (!lodash_1.default.isUndefined(filters.author_type)) {
            paginateQuery.author_type = filters.author_type;
        }
        return this.voteService.paginator(paginateQuery, paginateOptions);
    }
    deleteVotes(body) {
        return this.voteService.batchDelete(body.vote_ids);
    }
    async votePost(voteBody, token, { visitor }) {
        const likes = voteBody.post_id === biz_constant_1.GUESTBOOK_POST_ID
            ? await this.optionService.incrementLikes()
            : await this.articleService.incrementLikes(voteBody.post_id);
        this.voteDisqusThread(voteBody.post_id, voteBody.vote, token === null || token === void 0 ? void 0 : token.access_token).catch(() => { });
        this.getVoteAuthor({ guestAuthor: voteBody.author, disqusToken: token === null || token === void 0 ? void 0 : token.access_token }).then(async (voteAuthor) => {
            const ipLocation = await this.queryIPLocation(visitor.ip);
            await this.voteService.create({
                target_type: vote_model_1.VoteTarget.Post,
                target_id: voteBody.post_id,
                vote_type: voteBody.vote,
                author_type: voteAuthor.type,
                author: voteAuthor.data,
                user_agent: visitor.ua,
                ip: visitor.ip,
                ip_location: ipLocation
            });
            this.emailToTargetVoteMessage({
                to: APP_CONFIG.APP.ADMIN_EMAIL,
                subject: `You have a new post vote`,
                on: await this.getPostTitle(voteBody.post_id),
                vote: vote_model_1.voteTypeMap.get(voteBody.vote),
                author: this.getAuthorString(voteAuthor),
                userAgent: visitor.ua,
                location: ipLocation,
                link: (0, urlmap_transformer_1.getPermalinkById)(voteBody.post_id)
            });
        });
        return likes;
    }
    async voteComment(voteBody, token, { visitor }) {
        const result = await this.commentService.vote(voteBody.comment_id, voteBody.vote > 0);
        if (token) {
            try {
                const postId = await this.disqusPublicService.getDisqusPostIdByCommentId(voteBody.comment_id);
                if (postId) {
                    await this.disqusPublicService.votePost({
                        access_token: token.access_token,
                        post: postId,
                        vote: voteBody.vote
                    });
                }
            }
            catch (error) { }
        }
        this.getVoteAuthor({ guestAuthor: voteBody.author, disqusToken: token === null || token === void 0 ? void 0 : token.access_token }).then(async (voteAuthor) => {
            const ipLocation = await this.queryIPLocation(visitor.ip);
            await this.voteService.create({
                target_type: vote_model_1.VoteTarget.Comment,
                target_id: voteBody.comment_id,
                vote_type: voteBody.vote,
                author_type: voteAuthor.type,
                author: voteAuthor.data,
                user_agent: visitor.ua,
                ip: visitor.ip,
                ip_location: ipLocation
            });
            const comment = await this.commentService.getDetailByNumberId(voteBody.comment_id);
            const targetTitle = await this.getPostTitle(comment.post_id);
            const mailPayload = {
                vote: vote_model_1.voteTypeMap.get(voteBody.vote),
                on: `${targetTitle} #${comment.id}`,
                author: this.getAuthorString(voteAuthor),
                userAgent: visitor.ua,
                location: ipLocation,
                link: (0, urlmap_transformer_1.getPermalinkById)(comment.post_id) + `#comment-${comment.id}`
            };
            this.emailToTargetVoteMessage(Object.assign({ to: APP_CONFIG.APP.ADMIN_EMAIL, subject: `You have a new comment vote` }, mailPayload));
            if (comment.author.email) {
                this.emailToTargetVoteMessage(Object.assign({ to: comment.author.email, subject: `Your comment #${comment.id} has a new vote` }, mailPayload));
            }
        });
        return result;
    }
};
exports.VoteController = VoteController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.paginate(),
    responser_decorator_1.Responser.handle('Get votes'),
    __param(0, (0, common_1.Query)(expose_pipe_1.ExposePipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vote_dto_1.VotePaginateQueryDTO]),
    __metadata("design:returntype", Promise)
], VoteController.prototype, "getVotes", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Delete votes'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vote_dto_1.VotesDTO]),
    __metadata("design:returntype", void 0)
], VoteController.prototype, "deleteVotes", null);
__decorate([
    (0, common_1.Post)('/post'),
    (0, throttler_1.Throttle)({ default: { ttl: (0, throttler_1.minutes)(1), limit: 10 } }),
    responser_decorator_1.Responser.handle('Vote post'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, disqus_token_1.DisqusToken)()),
    __param(2, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vote_dto_1.PostVoteDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], VoteController.prototype, "votePost", null);
__decorate([
    (0, common_1.Post)('/comment'),
    (0, throttler_1.Throttle)({ default: { ttl: (0, throttler_1.seconds)(30), limit: 10 } }),
    responser_decorator_1.Responser.handle('Vote comment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, disqus_token_1.DisqusToken)()),
    __param(2, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vote_dto_1.CommentVoteDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], VoteController.prototype, "voteComment", null);
exports.VoteController = VoteController = __decorate([
    (0, common_1.Controller)('vote'),
    __metadata("design:paramtypes", [helper_service_ip_1.IPService,
        helper_service_email_1.EmailService,
        disqus_service_public_1.DisqusPublicService,
        comment_service_1.CommentService,
        article_service_1.ArticleService,
        option_service_1.OptionService,
        vote_service_1.VoteService])
], VoteController);
//# sourceMappingURL=vote.controller.js.map