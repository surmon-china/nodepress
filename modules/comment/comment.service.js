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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const biz_constant_1 = require("../../constants/biz.constant");
const article_service_1 = require("../article/article.service");
const helper_service_ip_1 = require("../../core/helper/helper.service.ip");
const helper_service_email_1 = require("../../core/helper/helper.service.email");
const helper_service_akismet_1 = require("../../core/helper/helper.service.akismet");
const option_service_1 = require("../option/option.service");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const comment_model_1 = require("./comment.model");
const app_environment_1 = require("../../app.environment");
const logger_1 = require("../../utils/logger");
const APP_CONFIG = __importStar(require("../../app.config"));
const logger = (0, logger_1.createLogger)({ scope: 'CommentService', time: app_environment_1.isDevEnv });
let CommentService = class CommentService {
    ipService;
    emailService;
    akismetService;
    optionService;
    articleService;
    commentModel;
    constructor(ipService, emailService, akismetService, optionService, articleService, commentModel) {
        this.ipService = ipService;
        this.emailService = emailService;
        this.akismetService = akismetService;
        this.optionService = optionService;
        this.articleService = articleService;
        this.commentModel = commentModel;
    }
    async emailToAdminAndTargetAuthor(comment) {
        const onWhere = comment.post_id === biz_constant_1.GUESTBOOK_POST_ID
            ? 'guestbook'
            : await this.articleService
                .getDetailByNumberIdOrSlug({ numberId: comment.post_id, lean: true })
                .then((article) => `"${article.title}"`);
        const authorName = comment.author.name;
        const getMailContent = (subject = '') => {
            const texts = [`${subject} on ${onWhere}.`, `${authorName}: ${comment.content}`];
            const textHTML = texts.map((text) => `<p>${text}</p>`).join('');
            const replyText = `Reply to ${authorName} #${comment.id}`;
            const commentLink = (0, urlmap_transformer_1.getPermalinkById)(comment.post_id) + `#comment-${comment.id}`;
            const linkHTML = `<a href="${commentLink}" target="_blank">${replyText}</a>`;
            return {
                text: texts.join('\n'),
                html: [textHTML, `<br>`, linkHTML].join('\n')
            };
        };
        const subject = `You have a new comment`;
        this.emailService.sendMailAs(APP_CONFIG.APP_BIZ.FE_NAME, {
            to: APP_CONFIG.APP_BIZ.ADMIN_EMAIL,
            subject,
            ...getMailContent(subject)
        });
        if (comment.pid) {
            this.commentModel.findOne({ id: comment.pid }).then((parentComment) => {
                if (parentComment?.author.email) {
                    const subject = `Your comment #${parentComment.id} has a new reply`;
                    this.emailService.sendMailAs(APP_CONFIG.APP_BIZ.FE_NAME, {
                        to: parentComment.author.email,
                        subject,
                        ...getMailContent(subject)
                    });
                }
            });
        }
    }
    submitCommentAkismet(action, comment, referer) {
        return this.akismetService[action]({
            user_ip: comment.ip,
            user_agent: comment.agent,
            referrer: referer || '',
            permalink: (0, urlmap_transformer_1.getPermalinkById)(comment.post_id),
            comment_type: comment.pid ? 'reply' : 'comment',
            comment_author: comment.author.name,
            comment_author_email: comment.author.email,
            comment_author_url: comment.author.site,
            comment_content: comment.content
        });
    }
    async updateCommentsCountWithArticles(postIds) {
        postIds = postIds.map(Number).filter(Boolean);
        if (!postIds.length) {
            return false;
        }
        try {
            const counts = await this.commentModel.aggregate([
                { $match: { ...comment_model_1.COMMENT_GUEST_QUERY_FILTER, post_id: { $in: postIds } } },
                { $group: { _id: '$post_id', num_tutorial: { $sum: 1 } } }
            ]);
            if (!counts || !counts.length) {
                await this.articleService.updateMetaComments(postIds[0], 0);
            }
            else {
                await Promise.all(counts.map((count) => {
                    return this.articleService.updateMetaComments(count._id, count.num_tutorial);
                }));
            }
        }
        catch (error) {
            logger.warn('updateCommentCountWithArticle failed!', error);
        }
    }
    updateBlocklistAkismetWithComment(comments, state, referer) {
        const isSPAM = state === biz_constant_1.CommentState.Spam;
        const action = isSPAM ? helper_service_akismet_1.AkismetAction.SubmitSpam : helper_service_akismet_1.AkismetAction.SubmitHam;
        comments.forEach((comment) => this.submitCommentAkismet(action, comment, referer));
        const ips = comments.map((comment) => comment.ip).filter(Boolean);
        const emails = comments.map((comment) => comment.author.email).filter(Boolean);
        const blocklistAction = isSPAM
            ? this.optionService.appendToBlocklist({ ips, emails })
            : this.optionService.removeFromBlocklist({ ips, emails });
        blocklistAction
            .then(() => logger.info('updateBlocklistAkismetWithComment.blocklistAction succeeded.'))
            .catch((error) => logger.warn('updateBlocklistAkismetWithComment.blocklistAction failed!', error));
    }
    async verifyCommentValidity(comment) {
        const { blocklist } = await this.optionService.ensureAppOption();
        const { keywords, mails, ips } = blocklist;
        const blockByIP = ips.includes(comment.ip);
        const blockByEmail = mails.includes(comment.author.email);
        const blockByKeyword = keywords.length && new RegExp(`${keywords.join('|')}`, 'ig').test(comment.content);
        if (blockByIP || blockByEmail || blockByKeyword) {
            const reason = blockByIP ? 'Blocked IP' : blockByEmail ? 'Blocked Email' : 'Blocked Keywords';
            throw new common_2.ForbiddenException(`Comment blocked. Reason: ${reason}`);
        }
    }
    async verifyTargetCommentable(targetPostId) {
        if (targetPostId !== biz_constant_1.GUESTBOOK_POST_ID) {
            if (!(await this.articleService.isCommentableArticle(targetPostId))) {
                throw new common_2.BadRequestException(`Comment is not allowed on post ID: ${targetPostId}`);
            }
        }
    }
    getAll() {
        return this.commentModel.find().lean().exec();
    }
    paginate(filter, options) {
        return this.commentModel.paginate(filter, options);
    }
    normalizeNewComment(comment, visitor) {
        return {
            ...comment,
            pid: Number(comment.pid),
            post_id: Number(comment.post_id),
            state: biz_constant_1.CommentState.Published,
            likes: 0,
            dislikes: 0,
            ip: visitor.ip,
            ip_location: {},
            agent: visitor.ua || comment.agent,
            extends: []
        };
    }
    async create(comment) {
        const ip_location = app_environment_1.isProdEnv && comment.ip ? await this.ipService.queryLocation(comment.ip) : null;
        const succeededComment = await this.commentModel.create({
            ...comment,
            ip_location
        });
        this.updateCommentsCountWithArticles([succeededComment.post_id]);
        this.emailToAdminAndTargetAuthor(succeededComment);
        return succeededComment;
    }
    async createFormClient(comment, visitor) {
        if (!comment.author.email) {
            throw new common_2.BadRequestException('Author email should not be empty');
        }
        const newComment = this.normalizeNewComment(comment, visitor);
        await this.verifyTargetCommentable(newComment.post_id);
        await Promise.all([
            this.verifyCommentValidity(newComment),
            this.submitCommentAkismet(helper_service_akismet_1.AkismetAction.CheckSpam, newComment, visitor.referer)
        ]);
        return this.create(newComment);
    }
    async getDetailByObjectId(commentId) {
        const comment = await this.commentModel.findById(commentId).exec();
        if (!comment)
            throw new common_2.NotFoundException(`Comment '${commentId}' not found`);
        return comment;
    }
    async getDetailByNumberId(commentId) {
        const comment = await this.commentModel.findOne({ id: commentId }).exec();
        if (!comment)
            throw new common_2.NotFoundException(`Comment '${commentId}' not found`);
        return comment;
    }
    async update(commentId, newComment, referer) {
        const updated = await this.commentModel.findByIdAndUpdate(commentId, newComment, { new: true }).exec();
        if (!updated)
            throw new common_2.NotFoundException(`Comment '${commentId}' not found`);
        this.updateCommentsCountWithArticles([updated.post_id]);
        this.updateBlocklistAkismetWithComment([updated], updated.state, referer);
        return updated;
    }
    async delete(commentId) {
        const deleted = await this.commentModel.findByIdAndDelete(commentId, null).exec();
        if (!deleted)
            throw new common_2.NotFoundException(`Comment '${commentId}' not found`);
        this.updateCommentsCountWithArticles([deleted.post_id]);
        return deleted;
    }
    async batchPatchState(action, referer) {
        const { comment_ids, post_ids, state } = action;
        const actionResult = await this.commentModel
            .updateMany({ _id: { $in: comment_ids } }, { $set: { state } })
            .exec();
        this.updateCommentsCountWithArticles(post_ids);
        try {
            const todoComments = await this.commentModel.find({ _id: { $in: comment_ids } });
            this.updateBlocklistAkismetWithComment(todoComments, state, referer);
        }
        catch (error) {
            logger.warn(`batchPatchState to ${state} failed!`, error);
        }
        return actionResult;
    }
    async batchDelete(commentIds, postIds) {
        const result = await this.commentModel.deleteMany({ _id: { $in: commentIds } }).exec();
        this.updateCommentsCountWithArticles(postIds);
        return result;
    }
    async countDocuments(queryFilter, queryOptions) {
        return await this.commentModel.countDocuments(queryFilter, queryOptions).exec();
    }
    async getTotalCount(publicOnly) {
        return await this.countDocuments(publicOnly ? comment_model_1.COMMENT_GUEST_QUERY_FILTER : {});
    }
    async getCalendar(publicOnly, timezone = 'GMT') {
        try {
            const calendar = await this.commentModel.aggregate([
                { $match: publicOnly ? comment_model_1.COMMENT_GUEST_QUERY_FILTER : {} },
                { $project: { day: { $dateToString: { date: '$created_at', format: '%Y-%m-%d', timezone } } } },
                { $group: { _id: '$day', count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]);
            return calendar.map(({ _id, ...rest }) => ({ ...rest, date: _id }));
        }
        catch (error) {
            throw new common_2.BadRequestException(`Invalid timezone identifier: '${timezone}'`, String(error));
        }
    }
    async reviseIPLocation(commentId) {
        const comment = await this.getDetailByObjectId(commentId);
        if (!comment.ip) {
            throw new common_2.BadRequestException(`Comment '${commentId}' hasn't IP address`);
        }
        const location = await this.ipService.queryLocation(comment.ip);
        if (!location) {
            throw new common_1.InternalServerErrorException(`Failed to resolve location for IP: ${comment.ip}`);
        }
        comment.ip_location = { ...location };
        return await comment.save();
    }
    async vote(commentId, isLike) {
        const comment = await this.getDetailByNumberId(commentId);
        isLike ? comment.likes++ : comment.dislikes++;
        await comment.save({ timestamps: false });
        return {
            likes: comment.likes,
            dislikes: comment.dislikes
        };
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(5, (0, model_transformer_1.InjectModel)(comment_model_1.Comment)),
    __metadata("design:paramtypes", [helper_service_ip_1.IPService,
        helper_service_email_1.EmailService,
        helper_service_akismet_1.AkismetService,
        option_service_1.OptionService,
        article_service_1.ArticleService, Object])
], CommentService);
//# sourceMappingURL=comment.service.js.map