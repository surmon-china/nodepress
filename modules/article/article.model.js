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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleProvider = exports.Article = exports.ArticleMeta = exports.ARTICLE_HOTTEST_SORT_PARAMS = exports.ARTICLE_LIST_QUERY_GUEST_FILTER = exports.ARTICLE_LIST_QUERY_PROJECTION = exports.ARTICLE_FULL_QUERY_REF_POPULATE = exports.ARTICLE_ORIGIN_STATES = exports.ARTICLE_PUBLIC_STATES = exports.ARTICLE_PUBLISH_STATES = void 0;
const auto_increment_1 = require("@typegoose/auto-increment");
const typegoose_1 = require("@typegoose/typegoose");
const class_validator_1 = require("class-validator");
const increment_constant_1 = require("../../constants/increment.constant");
const model_transformer_1 = require("../../transformers/model.transformer");
const paginate_1 = require("../../utils/paginate");
const biz_interface_1 = require("../../interfaces/biz.interface");
const category_model_1 = require("../category/category.model");
const extend_model_1 = require("../../models/extend.model");
const tag_model_1 = require("../tag/tag.model");
exports.ARTICLE_PUBLISH_STATES = [biz_interface_1.PublishState.Draft, biz_interface_1.PublishState.Published, biz_interface_1.PublishState.Recycle];
exports.ARTICLE_PUBLIC_STATES = [biz_interface_1.PublicState.Public, biz_interface_1.PublicState.Secret, biz_interface_1.PublicState.Reserve];
exports.ARTICLE_ORIGIN_STATES = [biz_interface_1.OriginState.Original, biz_interface_1.OriginState.Reprint, biz_interface_1.OriginState.Hybrid];
exports.ARTICLE_FULL_QUERY_REF_POPULATE = ['category', 'tag'];
exports.ARTICLE_LIST_QUERY_PROJECTION = { content: false };
exports.ARTICLE_LIST_QUERY_GUEST_FILTER = Object.freeze({
    state: biz_interface_1.PublishState.Published,
    public: biz_interface_1.PublicState.Public,
});
exports.ARTICLE_HOTTEST_SORT_PARAMS = Object.freeze({
    'meta.comments': biz_interface_1.SortType.Desc,
    'meta.likes': biz_interface_1.SortType.Desc,
});
const ARTICLE_DEFAULT_META = Object.freeze({
    likes: 0,
    views: 0,
    comments: 0,
});
class ArticleMeta {
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], ArticleMeta.prototype, "likes", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], ArticleMeta.prototype, "views", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], ArticleMeta.prototype, "comments", void 0);
exports.ArticleMeta = ArticleMeta;
let Article = class Article {
};
__decorate([
    (0, typegoose_1.prop)({ unique: true }),
    __metadata("design:type", Number)
], Article.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9-_]+$/),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ default: null, validate: /^[a-zA-Z0-9-_]+$/, index: true }),
    __metadata("design:type", String)
], Article.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'title?' }),
    (0, typegoose_1.prop)({ required: true, validate: /\S+/, text: true }),
    __metadata("design:type", String)
], Article.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'content?' }),
    (0, typegoose_1.prop)({ required: true, validate: /\S+/, text: true }),
    __metadata("design:type", String)
], Article.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, typegoose_1.prop)({ text: true }),
    __metadata("design:type", String)
], Article.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsDefined)(),
    (0, typegoose_1.prop)({ type: () => [String] }),
    __metadata("design:type", Array)
], Article.prototype, "keywords", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Article.prototype, "thumb", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", Boolean)
], Article.prototype, "disabled_comment", void 0);
__decorate([
    (0, class_validator_1.IsIn)(exports.ARTICLE_PUBLISH_STATES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsDefined)(),
    (0, typegoose_1.prop)({ enum: biz_interface_1.PublishState, default: biz_interface_1.PublishState.Published, index: true }),
    __metadata("design:type", Number)
], Article.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsIn)(exports.ARTICLE_PUBLIC_STATES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsDefined)(),
    (0, typegoose_1.prop)({ enum: biz_interface_1.PublicState, default: biz_interface_1.PublicState.Public, index: true }),
    __metadata("design:type", Number)
], Article.prototype, "public", void 0);
__decorate([
    (0, class_validator_1.IsIn)(exports.ARTICLE_ORIGIN_STATES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsDefined)(),
    (0, typegoose_1.prop)({ enum: biz_interface_1.OriginState, default: biz_interface_1.OriginState.Original, index: true }),
    __metadata("design:type", Number)
], Article.prototype, "origin", void 0);
__decorate([
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, typegoose_1.prop)({ ref: () => category_model_1.Category, required: true, index: true }),
    __metadata("design:type", Array)
], Article.prototype, "category", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => tag_model_1.Tag, index: true }),
    __metadata("design:type", Array)
], Article.prototype, "tag", void 0);
__decorate([
    (0, typegoose_1.prop)({ _id: false, default: Object.assign({}, ARTICLE_DEFAULT_META) }),
    __metadata("design:type", ArticleMeta)
], Article.prototype, "meta", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now, index: true, immutable: true }),
    __metadata("design:type", Date)
], Article.prototype, "create_at", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Article.prototype, "update_at", void 0);
__decorate([
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    (0, typegoose_1.prop)({ _id: false, default: [], type: () => [extend_model_1.ExtendModel] }),
    __metadata("design:type", Array)
], Article.prototype, "extends", void 0);
Article = __decorate([
    (0, typegoose_1.plugin)(paginate_1.mongoosePaginate),
    (0, typegoose_1.plugin)(auto_increment_1.AutoIncrementID, increment_constant_1.generalAutoIncrementIDConfig),
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            toObject: { getters: true },
            timestamps: {
                createdAt: 'create_at',
                updatedAt: 'update_at',
            },
        },
    }),
    (0, typegoose_1.index)({ title: 'text', content: 'text', description: 'text' }, {
        name: 'SearchIndex',
        weights: {
            title: 10,
            description: 18,
            content: 3,
        },
    })
], Article);
exports.Article = Article;
exports.ArticleProvider = (0, model_transformer_1.getProviderByTypegooseClass)(Article);
//# sourceMappingURL=article.model.js.map