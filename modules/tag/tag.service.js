"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const cache_service_1 = require("../../processors/cache/cache.service");
const helper_service_seo_1 = require("../../processors/helper/helper.service.seo");
const biz_constant_1 = require("../../constants/biz.constant");
const archive_service_1 = require("../archive/archive.service");
const article_model_1 = require("../article/article.model");
const tag_model_1 = require("./tag.model");
const CACHE_KEY = __importStar(require("../../constants/cache.constant"));
const logger_1 = __importDefault(require("../../utils/logger"));
let TagService = class TagService {
    constructor(seoService, cacheService, archiveService, tagModel, articleModel) {
        this.seoService = seoService;
        this.cacheService = cacheService;
        this.archiveService = archiveService;
        this.tagModel = tagModel;
        this.articleModel = articleModel;
        this.allTagsCache = this.cacheService.promise({
            ioMode: true,
            key: CACHE_KEY.ALL_TAGS,
            promise: () => this.getAllTags(),
        });
        this.updateAllTagsCache().catch((error) => {
            logger_1.default.warn('[tag]', 'init tagPaginateCache', error);
        });
    }
    async aggregate(publicOnly, documents) {
        const counts = await this.articleModel.aggregate([
            { $match: publicOnly ? article_model_1.ARTICLE_LIST_QUERY_GUEST_FILTER : {} },
            { $unwind: '$tag' },
            { $group: { _id: '$tag', count: { $sum: 1 } } },
        ]);
        const hydratedDocs = documents.map((tag) => {
            const found = counts.find((item) => String(item._id) === String(tag._id));
            return Object.assign(Object.assign({}, tag), { articles_count: found ? found.count : 0 });
        });
        return hydratedDocs;
    }
    async getAllTags() {
        const allTags = await this.tagModel.find().lean().sort({ _id: biz_constant_1.SortType.Desc }).exec();
        const documents = await this.aggregate(true, allTags);
        return documents;
    }
    getAllTagsCache() {
        return this.allTagsCache.get();
    }
    updateAllTagsCache() {
        return this.allTagsCache.update();
    }
    async paginater(querys, options, publicOnly) {
        const tags = await this.tagModel.paginate(querys, Object.assign(Object.assign({}, options), { lean: true }));
        const documents = await this.aggregate(publicOnly, tags.documents);
        return Object.assign(Object.assign({}, tags), { documents });
    }
    getDetailBySlug(slug) {
        return this.tagModel
            .findOne({ slug })
            .exec()
            .then((result) => result || Promise.reject(`Tag '${slug}' not found`));
    }
    async create(newTag) {
        const existedTag = await this.tagModel.findOne({ slug: newTag.slug }).exec();
        if (existedTag) {
            throw `Tag slug '${newTag.slug}' is existed`;
        }
        const tag = await this.tagModel.create(newTag);
        this.seoService.push((0, urlmap_transformer_1.getTagUrl)(tag.slug));
        this.archiveService.updateCache();
        this.updateAllTagsCache();
        return tag;
    }
    async update(tagID, newTag) {
        const existedTag = await this.tagModel.findOne({ slug: newTag.slug }).exec();
        if (existedTag && String(existedTag._id) !== String(tagID)) {
            throw `Tag slug '${newTag.slug}' is existed`;
        }
        const tag = await this.tagModel.findByIdAndUpdate(tagID, newTag, { new: true }).exec();
        if (!tag) {
            throw `Tag '${tagID}' not found`;
        }
        this.seoService.push((0, urlmap_transformer_1.getTagUrl)(tag.slug));
        this.archiveService.updateCache();
        this.updateAllTagsCache();
        return tag;
    }
    async delete(tagID) {
        const tag = await this.tagModel.findByIdAndRemove(tagID).exec();
        if (!tag) {
            throw `Tag '${tagID}' not found`;
        }
        this.seoService.delete((0, urlmap_transformer_1.getTagUrl)(tag.slug));
        this.archiveService.updateCache();
        this.updateAllTagsCache();
        return tag;
    }
    async batchDelete(tagIDs) {
        const tags = await this.tagModel.find({ _id: { $in: tagIDs } }).exec();
        this.seoService.delete(tags.map((tag) => (0, urlmap_transformer_1.getTagUrl)(tag.slug)));
        const actionResult = await this.tagModel.deleteMany({ _id: { $in: tagIDs } }).exec();
        this.archiveService.updateCache();
        this.updateAllTagsCache();
        return actionResult;
    }
    async getTotalCount() {
        return await this.tagModel.countDocuments().exec();
    }
};
TagService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, model_transformer_1.InjectModel)(tag_model_1.Tag)),
    __param(4, (0, model_transformer_1.InjectModel)(article_model_1.Article)),
    __metadata("design:paramtypes", [helper_service_seo_1.SeoService,
        cache_service_1.CacheService,
        archive_service_1.ArchiveService, Object, Object])
], TagService);
exports.TagService = TagService;
//# sourceMappingURL=tag.service.js.map