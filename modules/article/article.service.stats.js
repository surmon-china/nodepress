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
exports.ArticleStatsService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const sort_constant_1 = require("../../constants/sort.constant");
const article_constant_1 = require("./article.constant");
const article_model_1 = require("./article.model");
let ArticleStatsService = class ArticleStatsService {
    articleModel;
    constructor(articleModel) {
        this.articleModel = articleModel;
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
    getTotalCount(publicOnly) {
        return this.articleModel
            .countDocuments(publicOnly ? article_constant_1.ARTICLE_PUBLIC_FILTER : {})
            .lean()
            .exec();
    }
    async getCalendar(publicOnly, timezone = 'GMT') {
        try {
            const calendar = await this.articleModel.aggregate([
                { $match: publicOnly ? article_constant_1.ARTICLE_PUBLIC_FILTER : {} },
                { $project: { day: { $dateToString: { date: '$created_at', format: '%Y-%m-%d', timezone } } } },
                { $group: { _id: '$day', count: { $sum: 1 } } },
                { $sort: { _id: sort_constant_1.SortOrder.Asc } }
            ]);
            return calendar.map(({ _id, ...rest }) => ({ ...rest, date: _id }));
        }
        catch (error) {
            throw new common_1.BadRequestException(`Invalid timezone identifier: '${timezone}'`);
        }
    }
    async getTotalStatistics() {
        const [result] = await this.articleModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: '$stats.views' },
                    totalLikes: { $sum: '$stats.likes' }
                }
            }
        ]);
        return {
            totalViews: result?.totalViews ?? 0,
            totalLikes: result?.totalLikes ?? 0
        };
    }
};
exports.ArticleStatsService = ArticleStatsService;
exports.ArticleStatsService = ArticleStatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(article_model_1.Article)),
    __metadata("design:paramtypes", [Object])
], ArticleStatsService);
//# sourceMappingURL=article.service.stats.js.map