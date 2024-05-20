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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const biz_constant_1 = require("../../constants/biz.constant");
const article_service_1 = require("../article/article.service");
const helper_service_ip_1 = require("../../processors/helper/helper.service.ip");
const helper_service_email_1 = require("../../processors/helper/helper.service.email");
const helper_service_akismet_1 = require("../../processors/helper/helper.service.akismet");
const option_service_1 = require("../option/option.service");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const comment_model_1 = require("./comment.model");
const app_environment_1 = require("../../app.environment");
const logger_1 = require("../../utils/logger");
const APP_CONFIG = __importStar(require("../../app.config"));
const logger = (0, logger_1.createLogger)({ scope: 'CommentService', time: app_environment_1.isDevEnv });
let CommentService = class CommentService {
    constructor(ipService, emailService, akismetService, optionService, articleService, commentModel) {
        this.ipService = ipService;
        this.emailService = emailService;
        this.akismetService = akismetService;
        this.optionService = optionService;
        this.articleService = articleService;
        this.commentModel = commentModel;
    }
    async emailToAdminAndTargetAuthor(comment) {
        let onWhere = '';
        if (comment.post_id === biz_constant_1.GUESTBOOK_POST_ID) {
            onWhere = 'guestbook';
        }
        else {
            const article = await this.articleService.getDetailByNumberIdOrSlug({ idOrSlug: comment.post_id });
            onWhere = `"${article.toObject().title}"`;
        }
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
        this.emailService.sendMailAs(APP_CONFIG.APP.FE_NAME, Object.assign({ to: APP_CONFIG.APP.ADMIN_EMAIL, subject }, getMailContent(subject)));
        if (comment.pid) {
            this.commentModel.findOne({ id: comment.pid }).then((parentComment) => {
                if (parentComment === null || parentComment === void 0 ? void 0 : parentComment.author.email) {
                    const subject = `Your comment #${parentComment.id} has a new reply`;
                    this.emailService.sendMailAs(APP_CONFIG.APP.FE_NAME, Object.assign({ to: parentComment.author.email, subject }, getMailContent(subject)));
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
                { $match: Object.assign(Object.assign({}, comment_model_1.COMMENT_GUEST_QUERY_FILTER), { post_id: { $in: postIds } }) },
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
        const blockIP = ips.includes(comment.ip);
        const blockEmail = mails.includes(comment.author.email);
        const blockKeyword = keywords.length && new RegExp(`${keywords.join('|')}`, 'ig').test(comment.content);
        const isBlocked = blockIP || blockEmail || blockKeyword;
        if (isBlocked) {
            return Promise.reject('content | email | IP > blocked');
        }
    }
    async verifyTargetCommentable(targetPostId) {
        if (targetPostId !== biz_constant_1.GUESTBOOK_POST_ID) {
            const isCommentable = await this.articleService.isCommentableArticle(targetPostId);
            if (!isCommentable) {
                return Promise.reject(`Comment target ${targetPostId} was disabled comment`);
            }
        }
    }
    getAll() {
        return this.commentModel.find().exec();
    }
    async paginator(query, options, hideIPEmail = false) {
        const result = await this.commentModel.paginate(query, options);
        if (!hideIPEmail) {
            return result;
        }
        return Object.assign(Object.assign({}, result), { documents: result.documents.map((item) => {
                const data = item.toJSON();
                Reflect.deleteProperty(data, 'ip');
                Reflect.deleteProperty(data.author, 'email');
                return data;
            }) });
    }
    normalizeNewComment(comment, visitor) {
        return Object.assign(Object.assign({}, comment), { pid: Number(comment.pid), post_id: Number(comment.post_id), state: biz_constant_1.CommentState.Published, likes: 0, dislikes: 0, ip: visitor.ip, ip_location: {}, agent: visitor.ua || comment.agent, extends: [] });
    }
    async create(comment) {
        const ip_location = app_environment_1.isProdEnv && comment.ip ? await this.ipService.queryLocation(comment.ip) : null;
        const succeededComment = await this.commentModel.create(Object.assign(Object.assign({}, comment), { ip_location }));
        this.updateCommentsCountWithArticles([succeededComment.post_id]);
        this.emailToAdminAndTargetAuthor(succeededComment);
        return succeededComment;
    }
    async createFormClient(comment, visitor) {
        const newComment = this.normalizeNewComment(comment, visitor);
        await this.verifyTargetCommentable(newComment.post_id);
        await Promise.all([
            this.verifyCommentValidity(newComment),
            this.submitCommentAkismet(helper_service_akismet_1.AkismetAction.CheckSpam, newComment, visitor.referer)
        ]);
        return this.create(newComment);
    }
    getDetailByObjectId(commentId) {
        return this.commentModel
            .findById(commentId)
            .exec()
            .then((result) => result || Promise.reject(`Comment '${commentId}' not found`));
    }
    getDetailByNumberId(commentId) {
        return this.commentModel
            .findOne({ id: commentId })
            .exec()
            .then((result) => result || Promise.reject(`Comment '${commentId}' not found`));
    }
    async update(commentId, newComment, referer) {
        const comment = await this.commentModel.findByIdAndUpdate(commentId, newComment, { new: true }).exec();
        if (!comment) {
            throw `Comment '${commentId}' not found`;
        }
        this.updateCommentsCountWithArticles([comment.post_id]);
        this.updateBlocklistAkismetWithComment([comment], comment.state, referer);
        return comment;
    }
    async delete(commentId) {
        const comment = await this.commentModel.findByIdAndDelete(commentId, null).exec();
        if (!comment) {
            throw `Comment '${commentId}' not found`;
        }
        this.updateCommentsCountWithArticles([comment.post_id]);
        return comment;
    }
    async batchPatchState(action, referer) {
        const { comment_ids, post_ids, state } = action;
        const actionResult = await this.commentModel
            .updateMany({ _id: { $in: comment_ids } }, { $set: { state } }, { multi: true })
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
    async countDocuments(filter, options) {
        return await this.commentModel.countDocuments(filter, options).exec();
    }
    async getTotalCount(publicOnly) {
        return await this.countDocuments(publicOnly ? comment_model_1.COMMENT_GUEST_QUERY_FILTER : {});
    }
    getCalendar(publicOnly, timezone = 'GMT') {
        return this.commentModel
            .aggregate([
            { $match: publicOnly ? comment_model_1.COMMENT_GUEST_QUERY_FILTER : {} },
            { $project: { day: { $dateToString: { date: '$created_at', format: '%Y-%m-%d', timezone } } } },
            { $group: { _id: '$day', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ])
            .then((calendar) => calendar.map((_a) => {
            var { _id } = _a, r = __rest(_a, ["_id"]);
            return (Object.assign(Object.assign({}, r), { date: _id }));
        }))
            .catch(() => Promise.reject(`Invalid timezone identifier: '${timezone}'`));
    }
    async reviseIPLocation(commentId) {
        const comment = await this.getDetailByObjectId(commentId);
        if (!comment.ip) {
            return `Comment '${commentId}' hasn't IP address`;
        }
        const location = await this.ipService.queryLocation(comment.ip);
        if (!location) {
            return `Empty location query result`;
        }
        comment.ip_location = Object.assign({}, location);
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