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
exports.CommentEffectService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const article_service_sync_1 = require("../article/article.service.sync");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const comment_constant_1 = require("./comment.constant");
const comment_model_1 = require("./comment.model");
const logger = (0, logger_1.createLogger)({ scope: 'CommentEffectService', time: app_environment_1.isDevEnv });
let CommentEffectService = class CommentEffectService {
    articleSyncService;
    commentModel;
    constructor(articleSyncService, commentModel) {
        this.articleSyncService = articleSyncService;
        this.commentModel = commentModel;
    }
    async syncTargetEffects(targets) {
        if (!targets.length)
            return;
        const articleIds = this.getUniqueTargetIds(targets, comment_constant_1.CommentTargetType.Article);
        if (articleIds.length > 0) {
            await this.syncArticleCommentCounts(articleIds);
        }
    }
    getUniqueTargetIds(targets, type) {
        return [...new Set(targets.filter((t) => t.target_type === type).map((t) => t.target_id))];
    }
    async syncArticleCommentCounts(articleIds) {
        try {
            const counts = await this.commentModel.aggregate([
                {
                    $match: {
                        ...comment_constant_1.COMMENT_PUBLIC_FILTER,
                        target_type: comment_constant_1.CommentTargetType.Article,
                        target_id: { $in: articleIds }
                    }
                },
                { $group: { _id: '$target_id', comment_count: { $sum: 1 } } }
            ]);
            const countMap = new Map(counts.map((c) => [c._id, c.comment_count]));
            await Promise.all(articleIds.map((id) => this.articleSyncService.updateStatsComments(id, countMap.get(id) || 0)));
        }
        catch (error) {
            logger.warn('syncArticleCommentCounts failed!', error);
        }
    }
};
exports.CommentEffectService = CommentEffectService;
exports.CommentEffectService = CommentEffectService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, model_transformer_1.InjectModel)(comment_model_1.Comment)),
    __metadata("design:paramtypes", [article_service_sync_1.ArticleSyncService, Object])
], CommentEffectService);
//# sourceMappingURL=comment.service.effect.js.map