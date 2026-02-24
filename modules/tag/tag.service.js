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
exports.TagService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const cache_service_1 = require("../../core/cache/cache.service");
const helper_service_seo_1 = require("../../core/helper/helper.service.seo");
const archive_service_1 = require("../archive/archive.service");
const article_constant_1 = require("../article/article.constant");
const article_model_1 = require("../article/article.model");
const cache_constant_1 = require("../../constants/cache.constant");
const sort_constant_1 = require("../../constants/sort.constant");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const tag_model_1 = require("./tag.model");
const logger = (0, logger_1.createLogger)({ scope: 'TagService', time: app_environment_1.isDevEnv });
let TagService = class TagService {
    seoService;
    cacheService;
    archiveService;
    tagModel;
    articleModel;
    allPublicTagsCache;
    constructor(seoService, cacheService, archiveService, tagModel, articleModel) {
        this.seoService = seoService;
        this.cacheService = cacheService;
        this.archiveService = archiveService;
        this.tagModel = tagModel;
        this.articleModel = articleModel;
        this.allPublicTagsCache = this.cacheService.manual({
            key: cache_constant_1.CacheKeys.AllTags,
            promise: () => this.getAllTags({ aggregatePublicOnly: true })
        });
    }
    onModuleInit() {
        this.allPublicTagsCache.update().catch((error) => {
            logger.warn('Init getAllTags failed!', error);
        });
    }
    getAllPublicTagsCache() {
        return this.allPublicTagsCache.get();
    }
    updateAllPublicTagsCache() {
        return this.allPublicTagsCache.update();
    }
    async aggregateArticleCount(tags, publicOnly) {
        if (!tags.length)
            return [];
        const tagIds = tags.map((c) => c._id);
        const matchStage = publicOnly ? { ...article_constant_1.ARTICLE_PUBLIC_FILTER } : {};
        const counts = await this.articleModel.aggregate([
            { $match: { tags: { $in: tagIds }, ...matchStage } },
            { $unwind: '$tags' },
            { $match: { tags: { $in: tagIds } } },
            { $group: { _id: '$tags', count: { $sum: 1 } } }
        ]);
        const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]));
        return tags.map((tag) => ({
            ...tag,
            article_count: countMap.get(tag._id.toString()) ?? 0
        }));
    }
    async paginate(filter, options, publicOnly) {
        const result = await this.tagModel.paginateRaw(filter, options);
        const documents = await this.aggregateArticleCount(result.documents, publicOnly);
        return { ...result, documents };
    }
    async getAllTags(options) {
        const allTags = await this.tagModel.find().lean().sort({ _id: sort_constant_1.SortOrder.Desc }).exec();
        return await this.aggregateArticleCount(allTags, options.aggregatePublicOnly);
    }
    async getTotalCount() {
        return await this.tagModel.countDocuments().lean().exec();
    }
    async getDetail(idOrSlug) {
        const tag = await this.tagModel
            .findOne(typeof idOrSlug === 'number' ? { id: idOrSlug } : { slug: idOrSlug })
            .lean()
            .exec();
        if (!tag)
            throw new common_1.NotFoundException(`Tag '${idOrSlug}' not found`);
        return tag;
    }
    async create(input) {
        const existed = await this.tagModel.findOne({ slug: input.slug }).lean().exec();
        if (existed)
            throw new common_1.ConflictException(`Tag slug '${input.slug}' already exists`);
        const created = await this.tagModel.create(input);
        this.updateAllPublicTagsCache();
        this.archiveService.updateCache();
        this.seoService.push((0, urlmap_transformer_1.getTagUrl)(created.slug));
        return created;
    }
    async update(tagId, input) {
        const existed = await this.tagModel.findOne({ slug: input.slug }).lean().exec();
        if (existed && existed.id !== tagId) {
            throw new common_1.ConflictException(`Tag slug '${input.slug}' already exists`);
        }
        const updated = await this.tagModel
            .findOneAndUpdate({ id: tagId }, { $set: input }, { returnDocument: 'after' })
            .exec();
        if (!updated)
            throw new common_1.NotFoundException(`Tag '${tagId}' not found`);
        this.updateAllPublicTagsCache();
        this.archiveService.updateCache();
        this.seoService.push((0, urlmap_transformer_1.getTagUrl)(updated.slug));
        return updated;
    }
    async delete(tagId) {
        const deleted = await this.tagModel.findOneAndDelete({ id: tagId }).exec();
        if (!deleted)
            throw new common_1.NotFoundException(`Tag '${tagId}' not found`);
        await this.articleModel.updateMany({ tags: deleted._id }, { $pull: { tags: deleted._id } }).exec();
        this.updateAllPublicTagsCache();
        this.archiveService.updateCache();
        this.seoService.delete((0, urlmap_transformer_1.getTagUrl)(deleted.slug));
        return deleted;
    }
    async batchDelete(tagIds) {
        const tags = await this.tagModel
            .find({ id: { $in: tagIds } })
            .lean()
            .exec();
        const actionResult = await this.tagModel.deleteMany({ id: { $in: tagIds } }).exec();
        const tagObjectIds = tags.map((tag) => tag._id);
        await this.articleModel
            .updateMany({ tags: { $in: tagObjectIds } }, { $pull: { tags: { $in: tagObjectIds } } })
            .exec();
        this.updateAllPublicTagsCache();
        this.archiveService.updateCache();
        this.seoService.delete(tags.map((tag) => (0, urlmap_transformer_1.getTagUrl)(tag.slug)));
        return actionResult;
    }
};
exports.TagService = TagService;
exports.TagService = TagService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, model_transformer_1.InjectModel)(tag_model_1.Tag)),
    __param(4, (0, model_transformer_1.InjectModel)(article_model_1.Article)),
    __metadata("design:paramtypes", [helper_service_seo_1.SeoService,
        cache_service_1.CacheService,
        archive_service_1.ArchiveService, Object, Object])
], TagService);
//# sourceMappingURL=tag.service.js.map