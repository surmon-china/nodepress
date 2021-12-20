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
exports.ArticleService = exports.COMMON_USER_QUERY_PARAMS = void 0;
const lodash_1 = __importDefault(require("lodash"));
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const helper_service_seo_1 = require("../../processors/helper/helper.service.seo");
const cache_service_1 = require("../../processors/cache/cache.service");
const archive_service_1 = require("../archive/archive.service");
const tag_service_1 = require("../tag/tag.service");
const mongoose_interface_1 = require("../../interfaces/mongoose.interface");
const paginate_1 = require("../../utils/paginate");
const biz_interface_1 = require("../../interfaces/biz.interface");
const article_model_1 = require("./article.model");
const CACHE_KEY = __importStar(require("../../constants/cache.constant"));
exports.COMMON_USER_QUERY_PARAMS = Object.freeze({
    state: biz_interface_1.PublishState.Published,
    public: biz_interface_1.PublicState.Public,
});
let ArticleService = class ArticleService {
    constructor(tagService, cacheService, archiveService, seoService, articleModel) {
        this.tagService = tagService;
        this.cacheService = cacheService;
        this.archiveService = archiveService;
        this.seoService = seoService;
        this.articleModel = articleModel;
        this.hotArticleListCache = this.cacheService.interval({
            timeout: {
                success: 1000 * 60 * 30,
                error: 1000 * 60 * 5,
            },
            key: CACHE_KEY.HOT_ARTICLES,
            promise: () => {
                return this.getList.bind(this)(exports.COMMON_USER_QUERY_PARAMS, {
                    perPage: 10,
                    sort: this.getHotSortOption(),
                });
            },
        });
    }
    getUserHotListCache() {
        return this.hotArticleListCache();
    }
    async getRelatedArticles(article) {
        return this.articleModel
            .find(Object.assign(Object.assign({}, exports.COMMON_USER_QUERY_PARAMS), { tag: { $in: article.tag.map((t) => t._id) }, category: { $in: article.category.map((c) => c._id) } }), 'id title description thumb meta create_at update_at -_id')
            .exec();
    }
    getHotSortOption() {
        return {
            'meta.comments': biz_interface_1.SortType.Desc,
            'meta.likes': biz_interface_1.SortType.Desc,
        };
    }
    getList(querys, options) {
        return this.articleModel.paginate(querys, Object.assign({ populate: ['category', 'tag'], select: '-password -content' }, options));
    }
    getDetailByObjectId(articleID) {
        return this.articleModel.findById(articleID).exec();
    }
    getDetailByNumberId(articleID) {
        return this.articleModel
            .findOne(Object.assign({ id: articleID }, exports.COMMON_USER_QUERY_PARAMS))
            .select('-password')
            .populate(['category', 'tag'])
            .exec();
    }
    async getFullDetailForUser(articleID) {
        const article = await this.getDetailByNumberId(articleID);
        if (!article) {
            throw '文章不存在';
        }
        article.meta.views++;
        article.save();
        this.cacheService.get(CACHE_KEY.TODAY_VIEWS).then((views) => {
            this.cacheService.set(CACHE_KEY.TODAY_VIEWS, (views || 0) + 1);
        });
        const articleObject = article.toObject();
        const relatedArticles = await this.getRelatedArticles(articleObject);
        return Object.assign(articleObject, {
            related: lodash_1.default.sampleSize(relatedArticles, 12),
        });
    }
    async create(newArticle) {
        const article = await this.articleModel.create(Object.assign(Object.assign({}, newArticle), { meta: (0, article_model_1.getDefaultMeta)() }));
        this.seoService.push((0, urlmap_transformer_1.getArticleUrl)(article.id));
        this.archiveService.updateCache();
        this.tagService.updateListCache();
        return article;
    }
    async update(articleID, newArticle) {
        Reflect.deleteProperty(newArticle, 'meta');
        Reflect.deleteProperty(newArticle, 'create_at');
        Reflect.deleteProperty(newArticle, 'update_at');
        const article = await this.articleModel.findByIdAndUpdate(articleID, newArticle, { new: true }).exec();
        this.seoService.update((0, urlmap_transformer_1.getArticleUrl)(article.id));
        this.archiveService.updateCache();
        this.tagService.updateListCache();
        return article;
    }
    async delete(articleID) {
        const article = await this.articleModel.findByIdAndRemove(articleID).exec();
        this.seoService.delete((0, urlmap_transformer_1.getArticleUrl)(article.id));
        this.archiveService.updateCache();
        this.tagService.updateListCache();
        return article;
    }
    async batchPatchState(articleIDs, state) {
        const actionResult = await this.articleModel
            .updateMany({ _id: { $in: articleIDs } }, { $set: { state } }, { multi: true })
            .exec();
        this.archiveService.updateCache();
        this.tagService.updateListCache();
        return actionResult;
    }
    async batchDelete(articleIDs) {
        const articles = await this.articleModel.find({ _id: { $in: articleIDs } }).exec();
        this.seoService.delete(articles.map((article) => (0, urlmap_transformer_1.getArticleUrl)(article.id)));
        const actionResult = await this.articleModel.deleteMany({
            _id: { $in: articleIDs },
        });
        this.archiveService.updateCache();
        this.tagService.updateListCache();
        return actionResult;
    }
};
ArticleService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, model_transformer_1.InjectModel)(article_model_1.Article)),
    __metadata("design:paramtypes", [tag_service_1.TagService,
        cache_service_1.CacheService,
        archive_service_1.ArchiveService,
        helper_service_seo_1.SeoService, Object])
], ArticleService);
exports.ArticleService = ArticleService;
//# sourceMappingURL=article.service.js.map