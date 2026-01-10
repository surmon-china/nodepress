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
exports.ArticleService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const helper_service_seo_1 = require("../../core/helper/helper.service.seo");
const archive_service_1 = require("../archive/archive.service");
const category_service_1 = require("../category/category.service");
const tag_service_1 = require("../tag/tag.service");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const article_model_1 = require("./article.model");
let ArticleService = class ArticleService {
    seoService;
    tagService;
    categoryService;
    archiveService;
    articleModel;
    constructor(seoService, tagService, categoryService, archiveService, articleModel) {
        this.seoService = seoService;
        this.tagService = tagService;
        this.categoryService = categoryService;
        this.archiveService = archiveService;
        this.articleModel = articleModel;
    }
    async getNearArticles(articleId, type, count) {
        const typeFieldMap = {
            early: { field: '$lt', sort: -1 },
            later: { field: '$gt', sort: 1 }
        };
        const targetType = typeFieldMap[type];
        return this.articleModel
            .find({ ...article_model_1.ARTICLE_LIST_QUERY_GUEST_FILTER, id: { [targetType.field]: articleId } }, article_model_1.ARTICLE_LIST_QUERY_PROJECTION)
            .populate(article_model_1.ARTICLE_FULL_QUERY_REF_POPULATE)
            .sort({ id: targetType.sort })
            .limit(count)
            .lean()
            .exec();
    }
    getRelatedArticles(article, count) {
        const queryFilter = {
            ...article_model_1.ARTICLE_LIST_QUERY_GUEST_FILTER,
            tags: { $in: article.tags },
            categories: { $in: article.categories },
            id: { $ne: article.id }
        };
        return this.articleModel.aggregate([
            { $match: queryFilter },
            { $sample: { size: count } },
            { $project: article_model_1.ARTICLE_LIST_QUERY_PROJECTION },
            ...article_model_1.ARTICLE_FULL_QUERY_REF_POPULATE.map((field) => ({
                $lookup: {
                    from: field,
                    localField: field,
                    foreignField: '_id',
                    as: field
                }
            }))
        ]);
    }
    paginate(filter, options) {
        return this.articleModel.paginateRaw(filter, {
            ...options,
            projection: article_model_1.ARTICLE_LIST_QUERY_PROJECTION,
            populate: article_model_1.ARTICLE_FULL_QUERY_REF_POPULATE
        });
    }
    getAll() {
        return this.articleModel.find({}, null, {
            populate: article_model_1.ARTICLE_FULL_QUERY_REF_POPULATE
        });
    }
    getList(articleIds) {
        return this.articleModel
            .find({ id: { $in: articleIds } })
            .lean()
            .exec();
    }
    async getDetailByObjectId(articleId) {
        const article = await this.articleModel.findById(articleId).lean().exec();
        if (!article)
            throw new common_1.NotFoundException(`Article '${articleId}' not found`);
        return article;
    }
    async getDetailByNumberIdOrSlug({ numberId, slug, publicOnly = false, populate = false, lean = false }) {
        const queryFilter = {};
        if (slug)
            queryFilter.slug = slug;
        if (numberId)
            queryFilter.id = numberId;
        const articleQuery = this.articleModel
            .findOne(publicOnly ? { ...queryFilter, ...article_model_1.ARTICLE_LIST_QUERY_GUEST_FILTER } : queryFilter)
            .populate(populate ? article_model_1.ARTICLE_FULL_QUERY_REF_POPULATE : []);
        const article = lean ? await articleQuery.lean().exec() : await articleQuery.exec();
        if (!article)
            throw new common_1.NotFoundException(`Article '${numberId ?? slug}' not found`);
        return article;
    }
    async create(newArticle) {
        if (newArticle.slug) {
            const existedArticle = await this.articleModel.findOne({ slug: newArticle.slug }).lean().exec();
            if (existedArticle)
                throw new common_1.ConflictException(`Article slug '${newArticle.slug}' already exists`);
        }
        const article = await this.articleModel.create(newArticle);
        this.seoService.push((0, urlmap_transformer_1.getArticleUrl)(article.id));
        this.tagService.updateAllTagsCache();
        this.categoryService.updateAllCategoriesCache();
        this.archiveService.updateCache();
        return article;
    }
    async update(articleId, newArticle) {
        if (newArticle.slug) {
            const existedArticle = await this.articleModel.findOne({ slug: newArticle.slug }).lean().exec();
            if (existedArticle && !existedArticle._id.equals(articleId)) {
                throw new common_1.ConflictException(`Article slug '${newArticle.slug}' already exists`);
            }
        }
        Reflect.deleteProperty(newArticle, 'meta');
        Reflect.deleteProperty(newArticle, 'created_at');
        Reflect.deleteProperty(newArticle, 'updated_at');
        const article = await this.articleModel.findByIdAndUpdate(articleId, newArticle, { new: true }).exec();
        if (!article)
            throw new common_1.NotFoundException(`Article '${articleId}' not found`);
        this.seoService.update((0, urlmap_transformer_1.getArticleUrl)(article.id));
        this.tagService.updateAllTagsCache();
        this.categoryService.updateAllCategoriesCache();
        this.archiveService.updateCache();
        return article;
    }
    async delete(articleId) {
        const article = await this.articleModel.findByIdAndDelete(articleId, null).exec();
        if (!article)
            throw new common_1.NotFoundException(`Article '${articleId}' not found`);
        this.seoService.delete((0, urlmap_transformer_1.getArticleUrl)(article.id));
        this.tagService.updateAllTagsCache();
        this.categoryService.updateAllCategoriesCache();
        this.archiveService.updateCache();
        return article;
    }
    async batchPatchState(articleIds, state) {
        const actionResult = await this.articleModel
            .updateMany({ _id: { $in: articleIds } }, { $set: { state } })
            .exec();
        this.tagService.updateAllTagsCache();
        this.categoryService.updateAllCategoriesCache();
        this.archiveService.updateCache();
        return actionResult;
    }
    async batchDelete(articleIds) {
        const articles = await this.articleModel
            .find({ _id: { $in: articleIds } })
            .lean()
            .exec();
        const actionResult = await this.articleModel.deleteMany({ _id: { $in: articleIds } }).exec();
        this.seoService.delete(articles.map((article) => (0, urlmap_transformer_1.getArticleUrl)(article.id)));
        this.tagService.updateAllTagsCache();
        this.categoryService.updateAllCategoriesCache();
        this.archiveService.updateCache();
        return actionResult;
    }
    async getTotalCount(publicOnly) {
        return await this.articleModel.countDocuments(publicOnly ? article_model_1.ARTICLE_LIST_QUERY_GUEST_FILTER : {}).exec();
    }
    async getCalendar(publicOnly, timezone = 'GMT') {
        try {
            const calendar = await this.articleModel.aggregate([
                { $match: publicOnly ? article_model_1.ARTICLE_LIST_QUERY_GUEST_FILTER : {} },
                { $project: { day: { $dateToString: { date: '$created_at', format: '%Y-%m-%d', timezone } } } },
                { $group: { _id: '$day', count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]);
            return calendar.map(({ _id, ...rest }) => ({ ...rest, date: _id }));
        }
        catch (error) {
            throw new common_1.BadRequestException(`Invalid timezone identifier: '${timezone}'`);
        }
    }
    async incrementMetaStatistic(articleId, field) {
        const article = await this.getDetailByNumberIdOrSlug({
            numberId: articleId,
            publicOnly: true
        });
        article.meta[field]++;
        article.save({ timestamps: false });
        return article.meta[field];
    }
    async getMetaStatistic() {
        const [result] = await this.articleModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: '$meta.views' },
                    totalLikes: { $sum: '$meta.likes' }
                }
            }
        ]);
        if (!result) {
            return null;
        }
        return {
            totalViews: result.totalViews,
            totalLikes: result.totalLikes
        };
    }
    async isCommentableArticle(articleId) {
        const article = await this.articleModel.findOne({ id: articleId }).lean().exec();
        return Boolean(article && !article.disabled_comments);
    }
    async updateMetaComments(articleId, commentCount) {
        const findParams = { id: articleId };
        const patchParams = { $set: { 'meta.comments': commentCount } };
        return this.articleModel.updateOne(findParams, patchParams, { timestamps: false }).exec();
    }
};
exports.ArticleService = ArticleService;
exports.ArticleService = ArticleService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, model_transformer_1.InjectModel)(article_model_1.Article)),
    __metadata("design:paramtypes", [helper_service_seo_1.SeoService,
        tag_service_1.TagService,
        category_service_1.CategoryService,
        archive_service_1.ArchiveService, Object])
], ArticleService);
//# sourceMappingURL=article.service.js.map