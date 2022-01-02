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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const biz_interface_1 = require("../../interfaces/biz.interface");
const article_service_1 = require("../article/article.service");
const helper_service_ip_1 = require("../../processors/helper/helper.service.ip");
const helper_service_email_1 = require("../../processors/helper/helper.service.email");
const helper_service_akismet_1 = require("../../processors/helper/helper.service.akismet");
const option_service_1 = require("../option/option.service");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const comment_model_1 = require("./comment.model");
const app_environment_1 = require("../../app.environment");
const logger_1 = __importDefault(require("../../utils/logger"));
const APP_CONFIG = __importStar(require("../../app.config"));
let CommentService = class CommentService {
    constructor(ipService, emailService, akismetService, optionService, articleService, commentModel) {
        this.ipService = ipService;
        this.emailService = emailService;
        this.akismetService = akismetService;
        this.optionService = optionService;
        this.articleService = articleService;
        this.commentModel = commentModel;
    }
    emailToAdminAndTargetAuthor(comment) {
        const isGuestbook = comment.post_id === biz_interface_1.CommentPostID.Guestbook;
        const onWhere = isGuestbook ? 'guestbook' : 'article-' + comment.post_id;
        const getMailTexts = (contentPrefix = '') => [
            `You have a new comment ${contentPrefix} on ${onWhere}.`,
            `${comment.author.name}: ${comment.content}`,
        ];
        const getMailHtml = (contentPrefix = '') => `
      ${getMailTexts(contentPrefix)
            .map((t) => `<p>${t}</p>`)
            .join('')}
      <br>
      <a href="${(0, urlmap_transformer_1.getPermalinkByID)(comment.post_id)}" target="_blank">Reply to ${comment.author.name}</a>
    `;
        this.emailService.sendMail({
            to: APP_CONFIG.EMAIL.admin,
            subject: `[${APP_CONFIG.APP.FE_NAME}] You have a new comment`,
            text: getMailTexts().join('\n'),
            html: getMailHtml(),
        });
        if (comment.pid) {
            this.commentModel.findOne({ id: comment.pid }).then((parentComment) => {
                if (parentComment === null || parentComment === void 0 ? void 0 : parentComment.author.email) {
                    this.emailService.sendMail({
                        to: parentComment.author.email,
                        subject: `[${APP_CONFIG.APP.FE_NAME}] You have a new comment reply`,
                        text: getMailTexts(`(reply)`).join('\n'),
                        html: getMailHtml(`(reply)`),
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
            permalink: (0, urlmap_transformer_1.getPermalinkByID)(comment.post_id),
            comment_type: comment.pid ? 'reply' : 'comment',
            comment_author: comment.author.name,
            comment_author_email: comment.author.email,
            comment_author_url: comment.author.site,
            comment_content: comment.content,
        });
    }
    async updateCommentCountWithArticle(postIDs) {
        postIDs = postIDs || [];
        postIDs = postIDs.map(Number).filter(Boolean);
        if (!postIDs.length) {
            return false;
        }
        try {
            const counts = await this.commentModel.aggregate([
                { $match: { state: biz_interface_1.CommentState.Published, post_id: { $in: postIDs } } },
                { $group: { _id: '$post_id', num_tutorial: { $sum: 1 } } },
            ]);
            if (!counts || !counts.length) {
                await this.articleService.updateMetaComments(postIDs[0], 0);
            }
            else {
                await Promise.all(counts.map((count) => this.articleService.updateMetaComments(count._id, count.num_tutorial)));
            }
        }
        catch (error) {
            logger_1.default.warn('[comment]', 'updateCommentCountWithArticle failed!', error);
        }
    }
    updateBlocklistAkismetWithComment(comments, state, referrer) {
        const isSPAM = state === biz_interface_1.CommentState.Spam;
        const action = isSPAM ? helper_service_akismet_1.AkismetActionType.SubmitSpam : helper_service_akismet_1.AkismetActionType.SubmitHam;
        comments.forEach((comment) => this.submitCommentAkismet(action, comment, referrer));
        const ips = comments.map((comment) => comment.ip).filter(Boolean);
        const emails = comments.map((comment) => comment.author.email).filter(Boolean);
        const blocklistAction = isSPAM
            ? this.optionService.appendToBlocklist({ ips, emails })
            : this.optionService.removeFromBlocklist({ ips, emails });
        blocklistAction
            .then(() => logger_1.default.info('[comment]', 'updateBlocklistAkismetWithComment.blocklistAction > succeed'))
            .catch((error) => logger_1.default.warn('[comment]', 'updateBlocklistAkismetWithComment.blocklistAction > failed', error));
    }
    async isNotBlocklisted(comment) {
        const { blocklist } = await this.optionService.getAppOption();
        const { keywords, mails, ips } = blocklist;
        const blockIP = ips.includes(comment.ip);
        const blockEmail = mails.includes(comment.author.email);
        const blockKeyword = keywords.length && new RegExp(`${keywords.join('|')}`, 'ig').test(comment.content);
        const isBlocked = blockIP || blockEmail || blockKeyword;
        if (isBlocked) {
            return Promise.reject('content | email | IP > blocked');
        }
    }
    async isCommentableTarget(targetPostID) {
        if (targetPostID !== biz_interface_1.CommentPostID.Guestbook) {
            const isCommentable = await this.articleService.isCommentableArticle(targetPostID);
            if (!isCommentable) {
                return Promise.reject(`Comment target ${targetPostID} was disabled comment`);
            }
        }
    }
    getAll() {
        return this.commentModel.find().exec();
    }
    async paginater(querys, options, hideIPEmail = false) {
        const result = await this.commentModel.paginate(querys, options);
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
        return Object.assign(Object.assign({}, comment), { pid: Number(comment.pid), post_id: Number(comment.post_id), state: biz_interface_1.CommentState.Published, likes: 0, dislikes: 0, ip: visitor.ip, ip_location: {}, agent: visitor.ua || comment.agent, extends: [] });
    }
    async create(comment) {
        const ip_location = app_environment_1.isProdEnv && comment.ip ? await this.ipService.queryLocation(comment.ip) : null;
        const succeedComment = await this.commentModel.create(Object.assign(Object.assign({}, comment), { ip_location }));
        this.updateCommentCountWithArticle([succeedComment.post_id]);
        this.emailToAdminAndTargetAuthor(succeedComment);
        return succeedComment;
    }
    async createFormClient(comment, visitor) {
        const newComment = this.normalizeNewComment(comment, visitor);
        await this.isCommentableTarget(newComment.post_id);
        await Promise.all([
            this.isNotBlocklisted(newComment),
            this.submitCommentAkismet(helper_service_akismet_1.AkismetActionType.CheckSpam, newComment, visitor.referer),
        ]);
        return this.create(newComment);
    }
    getDetailByObjectID(commentID) {
        return this.commentModel
            .findById(commentID)
            .exec()
            .then((result) => result || Promise.reject(`Comment "${commentID}" not found`));
    }
    getDetailByNumberID(commentID) {
        return this.commentModel
            .findOne({ id: commentID })
            .exec()
            .then((result) => result || Promise.reject(`Comment "${commentID}" not found`));
    }
    async vote(commentID, isLike) {
        const comment = await this.getDetailByNumberID(commentID);
        isLike ? comment.likes++ : comment.dislikes++;
        await comment.save();
        return {
            likes: comment.likes,
            dislikes: comment.dislikes,
        };
    }
    async update(commentID, newComment, referer) {
        const comment = await this.commentModel.findByIdAndUpdate(commentID, newComment, { new: true }).exec();
        if (!comment) {
            throw `Comment "${commentID}" not found`;
        }
        this.updateCommentCountWithArticle([comment.post_id]);
        this.updateBlocklistAkismetWithComment([comment], comment.state, referer);
        return comment;
    }
    async delete(commentID) {
        const comment = await this.commentModel.findByIdAndRemove(commentID).exec();
        if (!comment) {
            throw `Comment "${commentID}" not found`;
        }
        this.updateCommentCountWithArticle([comment.post_id]);
        return comment;
    }
    async batchPatchState(action, referer) {
        const { comment_ids, post_ids, state } = action;
        const actionResult = await this.commentModel
            .updateMany({ _id: { $in: comment_ids } }, { $set: { state } }, { multi: true })
            .exec();
        this.updateCommentCountWithArticle(post_ids);
        try {
            const todoComments = await this.commentModel.find({ _id: { $in: comment_ids } });
            this.updateBlocklistAkismetWithComment(todoComments, state, referer);
        }
        catch (error) {
            logger_1.default.warn('[comment]', `对评论进行改变状态 ${state} 时，出现查询错误！`, error);
        }
        return actionResult;
    }
    async batchDelete(commentIDs, postIDs) {
        const result = await this.commentModel.deleteMany({ _id: { $in: commentIDs } }).exec();
        this.updateCommentCountWithArticle(postIDs);
        return result;
    }
    async reviseIPLocation(commentID) {
        const comment = await this.getDetailByObjectID(commentID);
        if (!comment.ip) {
            return `Comment "${commentID}" hasn't IP address`;
        }
        const location = await this.ipService.queryLocation(comment.ip);
        if (!location) {
            return `Empty location query result`;
        }
        comment.ip_location = Object.assign({}, location);
        return await comment.save();
    }
};
CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(5, (0, model_transformer_1.InjectModel)(comment_model_1.Comment)),
    __metadata("design:paramtypes", [helper_service_ip_1.IPService,
        helper_service_email_1.EmailService,
        helper_service_akismet_1.AkismetService,
        option_service_1.OptionService,
        article_service_1.ArticleService, Object])
], CommentService);
exports.CommentService = CommentService;
//# sourceMappingURL=comment.service.js.map