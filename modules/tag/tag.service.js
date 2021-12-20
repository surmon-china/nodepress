"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const mongoose_interface_1 = require("../../interfaces/mongoose.interface");
const paginate_1 = require("../../utils/paginate");
const biz_interface_1 = require("../../interfaces/biz.interface");
const archive_service_1 = require("../archive/archive.service");
const article_model_1 = require("../article/article.model");
const tag_model_1 = require("./tag.model");
const CACHE_KEY = __importStar(require("../../constants/cache.constant"));
const logger_1 = __importDefault(require("../../utils/logger"));
let TagService = class TagService {
    constructor(cacheService, archiveService, seoService, tagModel, articleModel) {
        this.cacheService = cacheService;
        this.archiveService = archiveService;
        this.seoService = seoService;
        this.tagModel = tagModel;
        this.articleModel = articleModel;
        this.tagListCache = this.cacheService.promise({
            ioMode: true,
            key: CACHE_KEY.TAGS,
            promise: this.getListCacheTask.bind(this),
        });
        this.updateListCache().catch((error) => {
            logger_1.default.warn('[tag]', 'init getListCacheTask Error:', error);
        });
    }
    getListCacheTask() {
        const options = {
            page: 1,
            perPage: 888,
            sort: { _id: biz_interface_1.SortType.Desc },
        };
        return this.getList(null, options, false);
    }
    getListCache() {
        return this.tagListCache.get();
    }
    updateListCache() {
        return this.tagListCache.update();
    }
    async getCounts(matchQuerys = {}) {
        const counts = await this.articleModel.aggregate([
            { $match: matchQuerys },
            { $unwind: '$tag' },
            { $group: { _id: '$tag', num_tutorial: { $sum: 1 } } },
        ]);
        return counts;
    }
    async getList(querys, options, isAuthenticated) {
        const matchState = {
            state: biz_interface_1.PublishState.Published,
            public: biz_interface_1.PublicState.Public,
        };
        const tags = await this.tagModel.paginate(querys, options);
        const counts = await this.getCounts(isAuthenticated ? {} : matchState);
        const tagsObject = JSON.parse(JSON.stringify(tags));
        const newDocs = tagsObject.docs.map((tag) => {
            const found = counts.find((count) => String(count._id) === String(tag._id));
            return Object.assign(Object.assign({}, tag), { count: found ? found.num_tutorial : 0 });
        });
        return Object.assign(Object.assign({}, tagsObject), { docs: newDocs });
    }
    async create(newTag) {
        const existedTags = await this.tagModel.find({ slug: newTag.slug }).exec();
        if (existedTags.length) {
            throw '别名已被占用';
        }
        const tag = await this.tagModel.create(newTag);
        this.seoService.push((0, urlmap_transformer_1.getTagUrl)(tag.slug));
        this.archiveService.updateCache();
        this.updateListCache();
        return tag;
    }
    getDetailBySlug(slug) {
        return this.tagModel.findOne({ slug }).exec();
    }
    async update(tagID, newTag) {
        const existedTag = await this.tagModel.findOne({ slug: newTag.slug }).exec();
        if (existedTag && String(existedTag._id) !== String(tagID)) {
            throw '别名已被占用';
        }
        const tag = await this.tagModel.findByIdAndUpdate(tagID, newTag, { new: true }).exec();
        this.seoService.push((0, urlmap_transformer_1.getTagUrl)(tag.slug));
        this.archiveService.updateCache();
        this.updateListCache();
        return tag;
    }
    async delete(tagID) {
        const tag = await this.tagModel.findByIdAndRemove(tagID).exec();
        this.seoService.delete((0, urlmap_transformer_1.getTagUrl)(tag.slug));
        this.archiveService.updateCache();
        this.updateListCache();
        return tag;
    }
    async batchDelete(tagIDs) {
        const tags = await this.tagModel.find({ _id: { $in: tagIDs } }).exec();
        this.seoService.delete(tags.map((tag) => (0, urlmap_transformer_1.getTagUrl)(tag.slug)));
        const actionResult = await this.tagModel.deleteMany({ _id: { $in: tagIDs } }).exec();
        this.archiveService.updateCache();
        this.updateListCache();
        return actionResult;
    }
};
TagService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, model_transformer_1.InjectModel)(tag_model_1.Tag)),
    __param(4, (0, model_transformer_1.InjectModel)(article_model_1.Article)),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        archive_service_1.ArchiveService,
        helper_service_seo_1.SeoService, Object, Object])
], TagService);
exports.TagService = TagService;
//# sourceMappingURL=tag.service.js.map