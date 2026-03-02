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
exports.ArticleContextService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const sort_constant_1 = require("../../constants/sort.constant");
const article_constant_1 = require("./article.constant");
const article_model_1 = require("./article.model");
const article_model_2 = require("./article.model");
let ArticleContextService = class ArticleContextService {
    articleModel;
    constructor(articleModel) {
        this.articleModel = articleModel;
    }
    async getNearArticles(articleId, type, count) {
        const typeFieldMap = {
            early: { field: '$lt', sort: -1 },
            later: { field: '$gt', sort: 1 }
        };
        const targetType = typeFieldMap[type];
        return this.articleModel
            .find({ ...article_constant_1.ARTICLE_PUBLIC_FILTER, id: { [targetType.field]: articleId } })
            .select(article_model_1.ARTICLE_LIST_QUERY_PROJECTION)
            .populate(article_model_1.ARTICLE_RELATION_FIELDS)
            .sort({ id: targetType.sort })
            .limit(count)
            .lean()
            .exec();
    }
    async getRelatedArticles(article, count) {
        if (!article.tags?.length || !article.categories?.length) {
            return [];
        }
        return await this.articleModel.aggregate([
            {
                $match: {
                    ...article_constant_1.ARTICLE_PUBLIC_FILTER,
                    tags: { $in: article.tags },
                    categories: { $in: article.categories },
                    id: { $ne: article.id }
                }
            },
            {
                $addFields: {
                    tagScore: { $size: { $setIntersection: ['$tags', article.tags] } },
                    categoryScore: { $size: { $setIntersection: ['$categories', article.categories] } }
                }
            },
            {
                $addFields: {
                    totalScore: {
                        $add: [{ $multiply: ['$tagScore', 2] }, '$categoryScore']
                    }
                }
            },
            { $sort: { totalScore: sort_constant_1.SortOrder.Desc, created_at: sort_constant_1.SortOrder.Desc } },
            { $limit: count * 2 },
            { $sample: { size: count } },
            { $project: article_model_1.ARTICLE_LIST_QUERY_PROJECTION },
            ...article_model_1.ARTICLE_RELATION_FIELDS.map((field) => ({
                $lookup: {
                    from: field,
                    localField: field,
                    foreignField: '_id',
                    as: field
                }
            }))
        ]);
    }
};
exports.ArticleContextService = ArticleContextService;
exports.ArticleContextService = ArticleContextService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(article_model_2.Article)),
    __metadata("design:paramtypes", [Object])
], ArticleContextService);
//# sourceMappingURL=article.service.context.js.map