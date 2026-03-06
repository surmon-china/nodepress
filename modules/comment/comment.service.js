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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const event_emitter_1 = require("@nestjs/event-emitter");
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const events_constant_1 = require("../../constants/events.constant");
const helper_service_ip_1 = require("../../core/helper/helper.service.ip");
const article_service_1 = require("../article/article.service");
const user_model_1 = require("../user/user.model");
const comment_constant_1 = require("./comment.constant");
const comment_model_1 = require("./comment.model");
const comment_service_blocklist_1 = require("./comment.service.blocklist");
const comment_service_akismet_1 = require("./comment.service.akismet");
const comment_service_effect_1 = require("./comment.service.effect");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const logger = (0, logger_1.createLogger)({ scope: 'CommentService', time: app_environment_1.isDevEnv });
let CommentService = class CommentService {
    ipService;
    eventEmitter;
    articleService;
    akismetService;
    blocklistService;
    effectService;
    commentModel;
    constructor(ipService, eventEmitter, articleService, akismetService, blocklistService, effectService, commentModel) {
        this.ipService = ipService;
        this.eventEmitter = eventEmitter;
        this.articleService = articleService;
        this.akismetService = akismetService;
        this.blocklistService = blocklistService;
        this.effectService = effectService;
        this.commentModel = commentModel;
    }
    normalize(input, context) {
        const { visitor, extras, user } = context;
        return {
            ...input,
            parent_id: input.parent_id ?? null,
            status: comment_constant_1.CommentStatus.Approved,
            user: user?._id ?? null,
            author_type: user?._id ? comment_constant_1.CommentAuthorType.User : comment_constant_1.CommentAuthorType.Guest,
            author_name: user?.name ?? input.author_name,
            author_email: user?.email ?? input.author_email ?? null,
            author_website: user?.website ?? input.author_website ?? null,
            likes: 0,
            dislikes: 0,
            ip: visitor.ip,
            ip_location: null,
            user_agent: visitor.agent,
            extras: extras ?? []
        };
    }
    async create(input) {
        const ip_location = input.ip ? await this.ipService.queryLocation(input.ip) : null;
        const created = await this.commentModel.create({ ...input, ip_location });
        const populated = await created.populate('user', user_model_1.USER_PUBLIC_POPULATE_SELECT);
        this.effectService.syncTargetEffects([populated]);
        this.eventEmitter.emit(events_constant_1.GlobalEventKey.CommentCreated, populated.toObject());
        return populated;
    }
    async validateAndCreate(input, referer) {
        if (input.target_type === comment_constant_1.CommentTargetType.Article) {
            if (!(await this.articleService.isCommentableArticle(input.target_id))) {
                throw new common_1.BadRequestException(`Comment is disabled for article: ${input.target_id}`);
            }
        }
        const [isSpam] = await Promise.all([
            this.akismetService.checkSpam(this.akismetService.transformCommentToAkismet(input, referer)),
            this.blocklistService.validate(input)
        ]);
        if (isSpam) {
            throw new common_1.ForbiddenException('Comment blocked by Akismet SPAM.');
        }
        return this.create(input);
    }
    async getDetail(commentId, populate) {
        const query = this.commentModel.findOne({ id: commentId });
        if (populate === 'withUser') {
            query.populate('user');
        }
        else if (populate === 'withUserPublic') {
            query.populate('user', user_model_1.USER_PUBLIC_POPULATE_SELECT);
        }
        const comment = await query.exec();
        if (!comment)
            throw new common_1.NotFoundException(`Comment '${commentId}' not found`);
        return comment;
    }
    paginate(filter, options) {
        return this.commentModel.paginateRaw(filter, { ...options, lean: { virtuals: true } });
    }
    async getPublicCommentIdSet(commentIds) {
        if (!commentIds.length)
            return new Set();
        const found = await this.commentModel
            .find({ id: { $in: commentIds }, status: comment_constant_1.CommentStatus.Approved })
            .select('id')
            .lean()
            .exec();
        return new Set(found.map(({ id }) => id));
    }
    async update(commentId, input) {
        const updated = await this.commentModel
            .findOneAndUpdate({ id: commentId }, { $set: input }, { returnDocument: 'after' })
            .exec();
        if (!updated)
            throw new common_1.NotFoundException(`Comment '${commentId}' not found`);
        this.effectService.syncTargetEffects([updated]);
        this.blocklistService.syncByStatus([updated], updated.status);
        return updated;
    }
    async delete(commentId) {
        const deleted = await this.commentModel.findOneAndDelete({ id: commentId }).exec();
        if (!deleted)
            throw new common_1.NotFoundException(`Comment '${commentId}' not found`);
        this.effectService.syncTargetEffects([deleted]);
        return deleted;
    }
    async batchUpdateStatus(commentIds, status) {
        const comments = await this.commentModel
            .find({ id: { $in: commentIds } })
            .lean()
            .exec();
        const result = await this.commentModel.updateMany({ id: { $in: commentIds } }, { $set: { status } }).exec();
        this.blocklistService.syncByStatus(comments, status);
        this.effectService.syncTargetEffects(comments);
        return result;
    }
    async batchDelete(commentIds) {
        const targets = await this.commentModel
            .find({ id: { $in: commentIds } })
            .lean()
            .exec();
        const result = await this.commentModel.deleteMany({ id: { $in: commentIds } }).exec();
        this.effectService.syncTargetEffects(targets);
        return result;
    }
    claimCommentsUser(commentIds, userObjectId) {
        return this.commentModel
            .updateMany({ id: { $in: commentIds }, author_type: comment_constant_1.CommentAuthorType.Guest }, { $set: { user: userObjectId, author_type: comment_constant_1.CommentAuthorType.User } })
            .exec();
    }
    async incrementVote(commentId, field) {
        const updated = await this.commentModel
            .findOneAndUpdate({ id: commentId }, { $inc: { [field]: 1 } }, { returnDocument: 'after', timestamps: false })
            .lean()
            .exec();
        if (!updated)
            throw new common_1.NotFoundException(`Comment '${commentId}' not found`);
        return updated[field];
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(6, (0, model_transformer_1.InjectModel)(comment_model_1.Comment)),
    __metadata("design:paramtypes", [helper_service_ip_1.IPService,
        event_emitter_1.EventEmitter2,
        article_service_1.ArticleService,
        comment_service_akismet_1.CommentAkismetService,
        comment_service_blocklist_1.CommentBlocklistService,
        comment_service_effect_1.CommentEffectService, Object])
], CommentService);
//# sourceMappingURL=comment.service.js.map