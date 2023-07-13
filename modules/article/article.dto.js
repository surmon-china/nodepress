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
exports.ArticlesStateDTO = exports.ArticleIDsDTO = exports.ArticleCalendarQueryDTO = exports.ArticleListQueryDTO = exports.ArticlePaginateQueryDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const biz_constant_1 = require("../../constants/biz.constant");
const guest_decorator_1 = require("../../decorators/guest.decorator");
const value_transformer_1 = require("../../transformers/value.transformer");
const query_model_1 = require("../../models/query.model");
const paginate_model_1 = require("../../models/paginate.model");
const article_model_1 = require("./article.model");
class ArticlePaginateQueryDTO extends (0, mapped_types_1.IntersectionType)(paginate_model_1.PaginateOptionWithHotSortDTO, query_model_1.KeywordQueryDTO, query_model_1.DateQueryDTO) {
}
exports.ArticlePaginateQueryDTO = ArticlePaginateQueryDTO;
__decorate([
    (0, guest_decorator_1.WhenGuest)({ only: [biz_constant_1.PublishState.Published], default: biz_constant_1.PublishState.Published }),
    (0, class_validator_1.IsIn)(article_model_1.ARTICLE_PUBLISH_STATES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], ArticlePaginateQueryDTO.prototype, "state", void 0);
__decorate([
    (0, guest_decorator_1.WhenGuest)({ only: [biz_constant_1.PublicState.Public], default: biz_constant_1.PublicState.Public }),
    (0, class_validator_1.IsIn)(article_model_1.ARTICLE_PUBLIC_STATES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], ArticlePaginateQueryDTO.prototype, "public", void 0);
__decorate([
    (0, class_validator_1.IsIn)(article_model_1.ARTICLE_ORIGIN_STATES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], ArticlePaginateQueryDTO.prototype, "origin", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ArticlePaginateQueryDTO.prototype, "tag_slug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ArticlePaginateQueryDTO.prototype, "category_slug", void 0);
__decorate([
    (0, class_validator_1.IsIn)(article_model_1.ARTICLE_LANGUAGES),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ArticlePaginateQueryDTO.prototype, "lang", void 0);
class ArticleListQueryDTO {
}
exports.ArticleListQueryDTO = ArticleListQueryDTO;
__decorate([
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], ArticleListQueryDTO.prototype, "count", void 0);
class ArticleCalendarQueryDTO {
}
exports.ArticleCalendarQueryDTO = ArticleCalendarQueryDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ArticleCalendarQueryDTO.prototype, "timezone", void 0);
class ArticleIDsDTO {
}
exports.ArticleIDsDTO = ArticleIDsDTO;
__decorate([
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ArticleIDsDTO.prototype, "article_ids", void 0);
class ArticlesStateDTO extends ArticleIDsDTO {
}
exports.ArticlesStateDTO = ArticlesStateDTO;
__decorate([
    (0, class_validator_1.IsIn)(article_model_1.ARTICLE_PUBLISH_STATES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Number)
], ArticlesStateDTO.prototype, "state", void 0);
//# sourceMappingURL=article.dto.js.map