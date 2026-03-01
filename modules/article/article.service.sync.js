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
exports.ArticleSyncService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const article_constant_1 = require("./article.constant");
const article_model_1 = require("./article.model");
let ArticleSyncService = class ArticleSyncService {
    articleModel;
    constructor(articleModel) {
        this.articleModel = articleModel;
    }
    removeTagsFromAllArticles(tagObjectIds) {
        const ids = Array.isArray(tagObjectIds) ? tagObjectIds : [tagObjectIds];
        return this.articleModel.updateMany({ tags: { $in: ids } }, { $pull: { tags: { $in: ids } } }).exec();
    }
    removeCategoriesFromAllArticles(categoryObjectIds) {
        const ids = Array.isArray(categoryObjectIds) ? categoryObjectIds : [categoryObjectIds];
        return this.articleModel
            .updateMany({ categories: { $in: ids } }, { $pull: { categories: { $in: ids } } })
            .exec();
    }
    async incrementStatistics(articleId, field) {
        const result = await this.articleModel
            .findOneAndUpdate({ id: articleId, ...article_constant_1.ARTICLE_PUBLIC_FILTER }, { $inc: { [`stats.${field}`]: 1 } }, { projection: { [`stats.${field}`]: 1 }, timestamps: false, returnDocument: 'after' })
            .lean()
            .exec();
        return result?.stats?.[field] ?? 0;
    }
    updateStatsComments(articleId, commentCount) {
        return this.articleModel
            .updateOne({ id: articleId }, { $set: { 'stats.comments': commentCount } }, { timestamps: false })
            .exec();
    }
};
exports.ArticleSyncService = ArticleSyncService;
exports.ArticleSyncService = ArticleSyncService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(article_model_1.Article)),
    __metadata("design:paramtypes", [Object])
], ArticleSyncService);
//# sourceMappingURL=article.service.sync.js.map