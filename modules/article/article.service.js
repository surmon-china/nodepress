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
exports.ArticleService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const helper_service_seo_1 = require("../../processors/helper/helper.service.seo");
const cache_service_1 = require("../../processors/cache/cache.service");
const extension_helper_1 = require("../extension/extension.helper");
const archive_service_1 = require("../archive/archive.service");
const category_service_1 = require("../category/category.service");
const tag_service_1 = require("../tag/tag.service");
const value_constant_1 = require("../../constants/value.constant");
const article_model_1 = require("./article.model");
let ArticleService = class ArticleService {
    constructor(seoService, tagService, categoryService, cacheService, archiveService, articleModel) {
        this.seoService = seoService;
        this.tagService = tagService;
        this.categoryService = categoryService;
        this.cacheService = cacheService;
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
            .find(Object.assign(Object.assign({}, article_model_1.ARTICLE_LIST_QUERY_GUEST_FILTER), { id: { [targetType.field]: articleId } }), article_model_1.ARTICLE_LIST_QUERY_PROJECTION)
            .populate(article_model_1.ARTICLE_FULL_QUERY_REF_POPULATE)
            .sort({ id: targetType.sort })
            .limit(count)
            .exec();
    }
    getRelatedArticles(article, count) {
        const findParams = Object.assign(Object.assign({}, article_model_1.ARTICLE_LIST_QUERY_GUEST_FILTER), { tags: { $in: article.tags }, categories: { $in: article.categories }, id: { $ne: article.id } });
        return this.articleModel.aggregate([
            { $match: findParams },
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
    paginator(query, options) {
        return this.articleModel.paginate(query, Object.assign(Object.assign({}, options), { projection: article_model_1.ARTICLE_LIST_QUERY_PROJECTION, populate: article_model_1.ARTICLE_FULL_QUERY_REF_POPULATE }));
    }
    getList(articleIds) {
        return this.articleModel.find({ id: { $in: articleIds } }).exec();
    }
    getDetailByObjectId(articleId) {
        return this.articleModel
            .findById(articleId)
            .exec()
            .then((result) => result || Promise.reject(`Article '${articleId}' not found`));
    }
    getDetailByNumberIdOrSlug({ idOrSlug, publicOnly = false, populate = false }) {
        const params = {};
        if (typeof idOrSlug === 'string') {
            params.slug = idOrSlug;
        }
        else {
            params.id = idOrSlug;
        }
        return this.articleModel
            .findOne(publicOnly ? Object.assign(Object.assign({}, params), article_model_1.ARTICLE_LIST_QUERY_GUEST_FILTER) : params)
            .populate(populate ? article_model_1.ARTICLE_FULL_QUERY_REF_POPULATE : [])
            .exec()
            .then((result) => result || Promise.reject(`Article '${idOrSlug}' not found`));
    }
    async getFullDetailForGuest(target) {
        const article = await this.getDetailByNumberIdOrSlug({
            idOrSlug: target,
            publicOnly: true,
            populate: true
        });
        article.meta.views++;
        article.save({ timestamps: false });
        (0, extension_helper_1.increaseTodayViewsCount)(this.cacheService);
        return article.toObject();
    }
    async incrementLikes(articleId) {
        const article = await this.getDetailByNumberIdOrSlug({
            idOrSlug: articleId,
            publicOnly: true
        });
        article.meta.likes++;
        await article.save({ timestamps: false });
        return article.meta.likes;
    }
    async create(newArticle) {
        if (newArticle.slug) {
            const existedArticle = await this.articleModel.findOne({ slug: newArticle.slug }).exec();
            if (existedArticle) {
                throw `Article slug '${newArticle.slug}' is existed`;
            }
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
            const existedArticle = await this.articleModel.findOne({ slug: newArticle.slug }).exec();
            if (existedArticle && !existedArticle._id.equals(articleId)) {
                throw `Article slug '${newArticle.slug}' is existed`;
            }
        }
        Reflect.deleteProperty(newArticle, 'meta');
        Reflect.deleteProperty(newArticle, 'created_at');
        Reflect.deleteProperty(newArticle, 'updated_at');
        const article = await this.articleModel.findByIdAndUpdate(articleId, newArticle, { new: true }).exec();
        if (!article) {
            throw `Article '${articleId}' not found`;
        }
        this.seoService.update((0, urlmap_transformer_1.getArticleUrl)(article.id));
        this.tagService.updateAllTagsCache();
        this.categoryService.updateAllCategoriesCache();
        this.archiveService.updateCache();
        return article;
    }
    async delete(articleId) {
        const article = await this.articleModel.findByIdAndDelete(articleId, null).exec();
        if (!article) {
            throw `Article '${articleId}' not found`;
        }
        this.seoService.delete((0, urlmap_transformer_1.getArticleUrl)(article.id));
        this.tagService.updateAllTagsCache();
        this.categoryService.updateAllCategoriesCache();
        this.archiveService.updateCache();
        return article;
    }
    async batchPatchState(articleIds, state) {
        const actionResult = await this.articleModel
            .updateMany({ _id: { $in: articleIds } }, { $set: { state } }, { multi: true })
            .exec();
        this.tagService.updateAllTagsCache();
        this.categoryService.updateAllCategoriesCache();
        this.archiveService.updateCache();
        return actionResult;
    }
    async batchDelete(articleIds) {
        const articles = await this.articleModel.find({ _id: { $in: articleIds } }).exec();
        this.seoService.delete(articles.map((article) => (0, urlmap_transformer_1.getArticleUrl)(article.id)));
        const actionResult = await this.articleModel.deleteMany({ _id: { $in: articleIds } }).exec();
        this.tagService.updateAllTagsCache();
        this.categoryService.updateAllCategoriesCache();
        this.archiveService.updateCache();
        return actionResult;
    }
    async getTotalCount(publicOnly) {
        return await this.articleModel.countDocuments(publicOnly ? article_model_1.ARTICLE_LIST_QUERY_GUEST_FILTER : {}).exec();
    }
    getCalendar(publicOnly, timezone = 'GMT') {
        return this.articleModel
            .aggregate([
            { $match: publicOnly ? article_model_1.ARTICLE_LIST_QUERY_GUEST_FILTER : {} },
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
            return value_constant_1.NULL;
        }
        else {
            return {
                totalViews: result.totalViews,
                totalLikes: result.totalLikes
            };
        }
    }
    async isCommentableArticle(articleId) {
        const article = await this.articleModel.findOne({ id: articleId }).exec();
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
    __param(5, (0, model_transformer_1.InjectModel)(article_model_1.Article)),
    __metadata("design:paramtypes", [helper_service_seo_1.SeoService,
        tag_service_1.TagService,
        category_service_1.CategoryService,
        cache_service_1.CacheService,
        archive_service_1.ArchiveService, Object])
], ArticleService);
//# sourceMappingURL=article.service.js.map