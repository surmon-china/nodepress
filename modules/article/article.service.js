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
const sort_constant_1 = require("../../constants/sort.constant");
const helper_service_seo_1 = require("../../core/helper/helper.service.seo");
const archive_service_1 = require("../archive/archive.service");
const category_service_1 = require("../category/category.service");
const tag_service_1 = require("../tag/tag.service");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const article_constant_1 = require("./article.constant");
const article_model_1 = require("./article.model");
const article_model_2 = require("./article.model");
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
    paginate(filter, options) {
        return this.articleModel.paginateRaw(filter, {
            ...options,
            populate: article_model_2.ARTICLE_RELATION_FIELDS
        });
    }
    getAll() {
        return this.articleModel.find({}, null, {
            sort: { _id: sort_constant_1.SortOrder.Desc },
            populate: article_model_2.ARTICLE_RELATION_FIELDS
        });
    }
    async getDetail(idOrSlug, options = {}) {
        const { publicOnly = false, populate = false, lean = false } = options;
        const queryFilter = {};
        if (typeof idOrSlug === 'number')
            queryFilter.id = idOrSlug;
        if (typeof idOrSlug === 'string')
            queryFilter.slug = idOrSlug;
        const articleQuery = this.articleModel
            .findOne(publicOnly ? { ...queryFilter, ...article_constant_1.ARTICLE_PUBLIC_FILTER } : queryFilter)
            .populate(populate ? article_model_2.ARTICLE_RELATION_FIELDS : [])
            .select(article_model_2.ARTICLE_WITH_CONTENT_PROJECTION);
        const article = lean ? await articleQuery.lean().exec() : await articleQuery.exec();
        if (!article)
            throw new common_1.NotFoundException(`Article '${idOrSlug}' not found`);
        return article;
    }
    async create(input) {
        if (input.slug) {
            const existed = await this.articleModel.findOne({ slug: input.slug }).lean().exec();
            if (existed)
                throw new common_1.ConflictException(`Article slug '${input.slug}' already exists`);
        }
        const created = await this.articleModel.create(input);
        this.seoService.push((0, urlmap_transformer_1.getArticleUrl)(created.id));
        this.tagService.updateAllPublicTagsCache();
        this.categoryService.updateAllPublicCategoriesCache();
        this.archiveService.updateCache();
        return created;
    }
    async update(articleId, input) {
        if (input.slug) {
            const existed = await this.articleModel.findOne({ slug: input.slug }).lean().exec();
            if (existed && existed.id !== articleId) {
                throw new common_1.ConflictException(`Article slug '${input.slug}' already exists`);
            }
        }
        Reflect.deleteProperty(input, 'id');
        Reflect.deleteProperty(input, 'stats');
        Reflect.deleteProperty(input, 'created_at');
        Reflect.deleteProperty(input, 'updated_at');
        const updated = await this.articleModel
            .findOneAndUpdate({ id: articleId }, { $set: input }, { returnDocument: 'after' })
            .exec();
        if (!updated)
            throw new common_1.NotFoundException(`Article '${articleId}' not found`);
        this.seoService.update((0, urlmap_transformer_1.getArticleUrl)(updated.id));
        this.tagService.updateAllPublicTagsCache();
        this.categoryService.updateAllPublicCategoriesCache();
        this.archiveService.updateCache();
        return updated;
    }
    async delete(articleId) {
        const deleted = await this.articleModel.findOneAndDelete({ id: articleId }).exec();
        if (!deleted)
            throw new common_1.NotFoundException(`Article '${articleId}' not found`);
        this.seoService.delete((0, urlmap_transformer_1.getArticleUrl)(deleted.id));
        this.tagService.updateAllPublicTagsCache();
        this.categoryService.updateAllPublicCategoriesCache();
        this.archiveService.updateCache();
        return deleted;
    }
    async batchUpdateStatus(articleIds, status) {
        const actionResult = await this.articleModel
            .updateMany({ id: { $in: articleIds } }, { $set: { status } })
            .exec();
        this.tagService.updateAllPublicTagsCache();
        this.categoryService.updateAllPublicCategoriesCache();
        this.archiveService.updateCache();
        return actionResult;
    }
    async batchDelete(articleIds) {
        const articles = await this.articleModel
            .find({ id: { $in: articleIds } })
            .lean()
            .exec();
        const actionResult = await this.articleModel.deleteMany({ id: { $in: articleIds } }).exec();
        this.seoService.delete(articles.map((article) => (0, urlmap_transformer_1.getArticleUrl)(article.id)));
        this.tagService.updateAllPublicTagsCache();
        this.categoryService.updateAllPublicCategoriesCache();
        this.archiveService.updateCache();
        return actionResult;
    }
    async isCommentableArticle(articleId) {
        const article = await this.articleModel.findOne({ id: articleId }).lean().exec();
        return Boolean(article && !article.disabled_comments);
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