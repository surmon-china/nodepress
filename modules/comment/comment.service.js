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
const lodash_1 = __importDefault(require("lodash"));
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const mongoose_interface_1 = require("../../interfaces/mongoose.interface");
const paginate_1 = require("../../utils/paginate");
const biz_interface_1 = require("../../interfaces/biz.interface");
const helper_service_ip_1 = require("../../processors/helper/helper.service.ip");
const helper_service_email_1 = require("../../processors/helper/helper.service.email");
const helper_service_akismet_1 = require("../../processors/helper/helper.service.akismet");
const option_service_1 = require("../option/option.service");
const option_model_1 = require("../option/option.model");
const article_model_1 = require("../article/article.model");
const app_environment_1 = require("../../app.environment");
const comment_model_1 = require("./comment.model");
const logger_1 = __importDefault(require("../../utils/logger"));
const APP_CONFIG = __importStar(require("../../app.config"));
let CommentService = class CommentService {
    constructor(ipService, emailService, akismetService, optionService, articleModel, commentModel) {
        this.ipService = ipService;
        this.emailService = emailService;
        this.akismetService = akismetService;
        this.optionService = optionService;
        this.articleModel = articleModel;
        this.commentModel = commentModel;
    }
    sendMailToAdminAndTargetUser(comment, permalink) {
        const commentTypeText = comment.post_id === biz_interface_1.CommentPostID.Guestbook ? '留言' : '评论';
        const getContextPrefix = (isReply) => {
            const replyText = isReply ? '回复' : '';
            return `来自 ${comment.author.name} 的${commentTypeText}${replyText}：`;
        };
        const sendMailText = (contentPrefix) => `${contentPrefix}${comment.content}`;
        const sendMailHtml = (contentPrefix) => `
      <p>${contentPrefix}${comment.content}</p><br>
      <a href="${permalink}" target="_blank">[ 点击查看 ]</a>
    `;
        this.emailService.sendMail({
            to: APP_CONFIG.EMAIL.admin,
            subject: `博客有新的${commentTypeText}`,
            text: sendMailText(getContextPrefix(false)),
            html: sendMailHtml(getContextPrefix(false)),
        });
        if (comment.pid) {
            this.commentModel.findOne({ id: comment.pid }).then((parentComment) => {
                this.emailService.sendMail({
                    to: parentComment.author.email,
                    subject: `你在 ${APP_CONFIG.APP.NAME} 有新的${commentTypeText}回复`,
                    text: sendMailText(getContextPrefix(true)),
                    html: sendMailHtml(getContextPrefix(true)),
                });
            });
        }
    }
    submitCommentAkismet(action, comment, permalink, referer) {
        return this.akismetService[action]({
            permalink,
            user_ip: comment.ip,
            user_agent: comment.agent,
            referrer: referer,
            comment_type: 'comment',
            comment_author: comment.author.name,
            comment_author_email: comment.author.email,
            comment_author_url: comment.author.site,
            comment_content: comment.content,
            is_test: app_environment_1.isDevMode,
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
                {
                    $match: { state: biz_interface_1.CommentState.Published, post_id: { $in: postIDs } },
                },
                { $group: { _id: '$post_id', num_tutorial: { $sum: 1 } } },
            ]);
            if (!counts || !counts.length) {
                this.articleModel
                    .updateOne({ id: postIDs[0] }, {
                    $set: {
                        'meta.comments': 0,
                    },
                })
                    .exec();
            }
            else {
                counts.forEach((count) => {
                    this.articleModel
                        .updateOne({ id: count._id }, {
                        $set: {
                            'meta.comments': count.num_tutorial,
                        },
                    })
                        .exec();
                });
            }
        }
        catch (error) {
            logger_1.default.warn('[comment]', '更新评论 count 聚合数据前，查询失败', error);
        }
    }
    async updateCommentsStateWithBlacklist(comments, state, referrer) {
        const option = await this.optionService.getDBOption();
        const isSpam = state === biz_interface_1.CommentState.Spam;
        const action = isSpam ? helper_service_akismet_1.EAkismetActionType.SubmitSpam : helper_service_akismet_1.EAkismetActionType.SubmitHam;
        const todoFields = {
            mails: (comment) => comment.author.email,
            ips: (comment) => comment.ip,
        };
        Object.keys(todoFields).forEach((field) => {
            const data = option.blacklist[field];
            const getCommentField = todoFields[field];
            option.blacklist[field] = isSpam
                ? lodash_1.default.uniq([...data, ...comments.map(getCommentField)])
                : data.filter((value) => !comments.some((comment) => getCommentField(comment) === value));
        });
        comments.forEach((comment) => {
            this.submitCommentAkismet(action, comment, null, referrer);
        });
        option
            .save()
            .then(() => logger_1.default.info('[comment]', '评论状态转移后 -> 黑名单更新成功'))
            .catch((error) => logger_1.default.warn('[comment]', '评论状态转移后 -> 黑名单更新失败', error));
    }
    async validateCommentByBlacklist(comment) {
        const { blacklist } = await this.optionService.getDBOption();
        const { keywords, mails, ips } = blacklist;
        const blockIP = ips.includes(comment.ip);
        const blockEmail = mails.includes(comment.author.email);
        const blockKeyword = keywords.length && new RegExp(`${keywords.join('|')}`, 'ig').test(comment.content);
        const isBlocked = blockIP || blockEmail || blockKeyword;
        if (isBlocked) {
            throw '内容 || IP || 邮箱 -> 不合法';
        }
    }
    validateCommentByAkismet(comment, permalink, referer) {
        return this.submitCommentAkismet(helper_service_akismet_1.EAkismetActionType.CheckSpam, comment, permalink, referer);
    }
    getList(querys, options) {
        return this.commentModel.paginate(querys, options);
    }
    async create(comment, { ip, ua, referer }) {
        const newComment = Object.assign(Object.assign({}, comment), { ip, likes: 0, is_top: false, pid: Number(comment.pid), post_id: Number(comment.post_id), state: biz_interface_1.CommentState.Published, agent: ua || comment.agent });
        const permalink = newComment.post_id === biz_interface_1.CommentPostID.Guestbook ? (0, urlmap_transformer_1.getGuestbookPageUrl)() : (0, urlmap_transformer_1.getArticleUrl)(newComment.post_id);
        await Promise.all([
            this.validateCommentByBlacklist(newComment),
            this.validateCommentByAkismet(newComment, permalink, referer),
        ]);
        const ip_location = await this.ipService.query(ip);
        const succeedComment = await this.commentModel.create(Object.assign(Object.assign({}, newComment), { ip_location }));
        this.sendMailToAdminAndTargetUser(succeedComment, permalink);
        this.updateCommentCountWithArticle([succeedComment.post_id]);
        return succeedComment;
    }
    async batchPatchState(action, referer) {
        const { comment_ids, post_ids, state } = action;
        const actionResult = await this.commentModel
            .updateMany({ _id: { $in: comment_ids } }, { $set: { state } }, { multi: true })
            .exec();
        this.updateCommentCountWithArticle(post_ids);
        try {
            const todoComments = await this.commentModel.find({
                _id: { $in: comment_ids },
            });
            this.updateCommentsStateWithBlacklist(todoComments, state, referer);
        }
        catch (error) {
            logger_1.default.warn('[comment]', `对评论进行改变状态 ${state} 时，出现查询错误！`, error);
        }
        return actionResult;
    }
    getDetail(commentID) {
        return this.commentModel.findById(commentID).exec();
    }
    getDetailByNumberId(commentID) {
        return this.commentModel.findOne({ id: commentID }).exec();
    }
    async update(commentID, newComment, referer) {
        const comment = await this.commentModel.findByIdAndUpdate(commentID, newComment, { new: true }).exec();
        this.updateCommentCountWithArticle([comment.post_id]);
        this.updateCommentsStateWithBlacklist([comment], comment.state, referer);
        return comment;
    }
    async delete(commentID) {
        const comment = await this.commentModel.findByIdAndRemove(commentID).exec();
        this.updateCommentCountWithArticle([comment.post_id]);
        return comment;
    }
    async batchDelete(commentIDs, postIDs) {
        const result = await this.commentModel.deleteMany({ _id: { $in: commentIDs } }).exec();
        this.updateCommentCountWithArticle(postIDs);
        return result;
    }
};
CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, model_transformer_1.InjectModel)(article_model_1.Article)),
    __param(5, (0, model_transformer_1.InjectModel)(comment_model_1.Comment)),
    __metadata("design:paramtypes", [helper_service_ip_1.IPService,
        helper_service_email_1.EmailService,
        helper_service_akismet_1.AkismetService,
        option_service_1.OptionService, Object, Object])
], CommentService);
exports.CommentService = CommentService;
//# sourceMappingURL=comment.service.js.map