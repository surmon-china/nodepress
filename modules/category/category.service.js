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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const cache_service_1 = require("../../core/cache/cache.service");
const archive_service_1 = require("../archive/archive.service");
const helper_service_seo_1 = require("../../core/helper/helper.service.seo");
const article_model_1 = require("../article/article.model");
const article_constant_1 = require("../article/article.constant");
const cache_constant_1 = require("../../constants/cache.constant");
const sort_constant_1 = require("../../constants/sort.constant");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const category_model_1 = require("./category.model");
const logger = (0, logger_1.createLogger)({ scope: 'CategoryService', time: app_environment_1.isDevEnv });
let CategoryService = class CategoryService {
    seoService;
    cacheService;
    archiveService;
    articleModel;
    categoryModel;
    allPublicCategoriesCache;
    constructor(seoService, cacheService, archiveService, articleModel, categoryModel) {
        this.seoService = seoService;
        this.cacheService = cacheService;
        this.archiveService = archiveService;
        this.articleModel = articleModel;
        this.categoryModel = categoryModel;
        this.allPublicCategoriesCache = this.cacheService.manual({
            key: cache_constant_1.CacheKeys.AllCategories,
            promise: () => this.getAllCategories({ aggregatePublicOnly: true })
        });
    }
    onModuleInit() {
        this.allPublicCategoriesCache.update().catch((error) => {
            logger.warn('Init getAllCategories failed!', error);
        });
    }
    getAllPublicCategoriesCache() {
        return this.allPublicCategoriesCache.get();
    }
    updateAllPublicCategoriesCache() {
        return this.allPublicCategoriesCache.update();
    }
    async aggregateArticleCount(categories, publicOnly) {
        if (!categories.length)
            return [];
        const categoryIds = categories.map((c) => c._id);
        const matchStage = publicOnly ? { ...article_constant_1.ARTICLE_PUBLIC_FILTER } : {};
        const counts = await this.articleModel.aggregate([
            { $match: { categories: { $in: categoryIds }, ...matchStage } },
            { $unwind: '$categories' },
            { $match: { categories: { $in: categoryIds } } },
            { $group: { _id: '$categories', count: { $sum: 1 } } }
        ]);
        const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]));
        return categories.map((category) => ({
            ...category,
            article_count: countMap.get(category._id.toString()) ?? 0
        }));
    }
    async paginate(filter, options, publicOnly) {
        const result = await this.categoryModel.paginateRaw(filter, options);
        const documents = await this.aggregateArticleCount(result.documents, publicOnly);
        return { ...result, documents };
    }
    async getAllCategories(options) {
        const allCategories = await this.categoryModel.find().lean().sort({ _id: sort_constant_1.SortOrder.Desc }).exec();
        return await this.aggregateArticleCount(allCategories, options.aggregatePublicOnly);
    }
    async getDetail(idOrSlug) {
        const category = await this.categoryModel
            .findOne(typeof idOrSlug === 'number' ? { id: idOrSlug } : { slug: idOrSlug })
            .lean()
            .exec();
        if (!category)
            throw new common_1.NotFoundException(`Category '${idOrSlug}' not found`);
        return category;
    }
    async create(input) {
        const existed = await this.categoryModel.findOne({ slug: input.slug }).lean().exec();
        if (existed) {
            throw new common_1.ConflictException(`Category slug '${input.slug}' already exists`);
        }
        const created = await this.categoryModel.create(input);
        this.updateAllPublicCategoriesCache();
        this.archiveService.updateCache();
        this.seoService.push((0, urlmap_transformer_1.getCategoryUrl)(created.slug));
        return created;
    }
    async update(categoryId, input) {
        const existed = await this.categoryModel.findOne({ slug: input.slug }).lean().exec();
        if (existed && existed.id !== categoryId) {
            throw new common_1.ConflictException(`Category slug '${input.slug}' already exists`);
        }
        const updated = await this.categoryModel
            .findOneAndUpdate({ id: categoryId }, { $set: input }, { returnDocument: 'after' })
            .exec();
        if (!updated)
            throw new common_1.NotFoundException(`Category '${categoryId}' not found`);
        this.updateAllPublicCategoriesCache();
        this.archiveService.updateCache();
        this.seoService.push((0, urlmap_transformer_1.getCategoryUrl)(updated.slug));
        return updated;
    }
    async delete(categoryId) {
        const deleted = await this.categoryModel.findOneAndDelete({ id: categoryId }).exec();
        if (!deleted)
            throw new common_1.NotFoundException(`Category '${categoryId}' not found`);
        await this.categoryModel
            .updateMany({ parent_id: deleted.id }, { $set: { parent_id: deleted.parent_id || null } })
            .exec();
        await this.articleModel.updateMany({ categories: deleted._id }, { $pull: { categories: deleted._id } }).exec();
        this.updateAllPublicCategoriesCache();
        this.archiveService.updateCache();
        this.seoService.delete((0, urlmap_transformer_1.getCategoryUrl)(deleted.slug));
        return deleted;
    }
    async batchDelete(categoryIds) {
        const categories = await this.categoryModel
            .find({ id: { $in: categoryIds } })
            .lean()
            .exec();
        const actionResult = await this.categoryModel.deleteMany({ id: { $in: categoryIds } }).exec();
        await this.categoryModel.updateMany({ parent_id: { $in: categoryIds } }, { $set: { parent_id: null } }).exec();
        const categoryObjectIds = categories.map((category) => category._id);
        await this.articleModel
            .updateMany({ categories: { $in: categoryObjectIds } }, { $pull: { categories: { $in: categoryObjectIds } } })
            .exec();
        this.updateAllPublicCategoriesCache();
        this.archiveService.updateCache();
        this.seoService.delete(categories.map((category) => (0, urlmap_transformer_1.getCategoryUrl)(category.slug)));
        return actionResult;
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, model_transformer_1.InjectModel)(article_model_1.Article)),
    __param(4, (0, model_transformer_1.InjectModel)(category_model_1.Category)),
    __metadata("design:paramtypes", [helper_service_seo_1.SeoService,
        cache_service_1.CacheService,
        archive_service_1.ArchiveService, Object, Object])
], CategoryService);
//# sourceMappingURL=category.service.js.map