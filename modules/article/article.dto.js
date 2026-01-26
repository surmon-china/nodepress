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
exports.ArticlesStatusDTO = exports.ArticleIdsDTO = exports.ArticleCalendarQueryDTO = exports.ArticlePaginateQueryDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_validator_2 = require("class-validator");
const guest_permission_decorator_1 = require("../../decorators/guest-permission.decorator");
const value_transformer_1 = require("../../transformers/value.transformer");
const query_model_1 = require("../../models/query.model");
const paginate_model_1 = require("../../models/paginate.model");
const article_constant_1 = require("./article.constant");
const article_constant_2 = require("./article.constant");
class ArticlePaginateQueryDTO extends (0, mapped_types_1.IntersectionType)(paginate_model_1.PaginateOptionWithHotSortDTO, query_model_1.KeywordQueryDTO, query_model_1.DateQueryDTO) {
    status;
    origin;
    featured;
    lang;
    tag_slug;
    category_slug;
}
exports.ArticlePaginateQueryDTO = ArticlePaginateQueryDTO;
__decorate([
    (0, guest_permission_decorator_1.WithGuestPermission)({ only: [article_constant_2.ArticleStatus.Published], default: article_constant_2.ArticleStatus.Published }),
    (0, class_validator_1.IsIn)(article_constant_1.ARTICLE_STATUSES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_2.IsNotEmpty)(),
    (0, class_validator_2.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], ArticlePaginateQueryDTO.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsIn)(article_constant_1.ARTICLE_ORIGINS),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_2.IsNotEmpty)(),
    (0, class_validator_2.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], ArticlePaginateQueryDTO.prototype, "origin", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_2.IsNotEmpty)(),
    (0, class_validator_2.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToBoolean)(value)),
    __metadata("design:type", Boolean)
], ArticlePaginateQueryDTO.prototype, "featured", void 0);
__decorate([
    (0, class_validator_1.IsIn)(article_constant_1.ARTICLE_LANGUAGES),
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsNotEmpty)(),
    (0, class_validator_2.IsOptional)(),
    __metadata("design:type", String)
], ArticlePaginateQueryDTO.prototype, "lang", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsNotEmpty)(),
    (0, class_validator_2.IsOptional)(),
    __metadata("design:type", String)
], ArticlePaginateQueryDTO.prototype, "tag_slug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsNotEmpty)(),
    (0, class_validator_2.IsOptional)(),
    __metadata("design:type", String)
], ArticlePaginateQueryDTO.prototype, "category_slug", void 0);
class ArticleCalendarQueryDTO {
    timezone;
}
exports.ArticleCalendarQueryDTO = ArticleCalendarQueryDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsNotEmpty)(),
    (0, class_validator_2.IsOptional)(),
    __metadata("design:type", String)
], ArticleCalendarQueryDTO.prototype, "timezone", void 0);
class ArticleIdsDTO {
    article_ids;
}
exports.ArticleIdsDTO = ArticleIdsDTO;
__decorate([
    (0, class_validator_2.ArrayNotEmpty)(),
    (0, class_validator_2.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ArticleIdsDTO.prototype, "article_ids", void 0);
class ArticlesStatusDTO extends ArticleIdsDTO {
    status;
}
exports.ArticlesStatusDTO = ArticlesStatusDTO;
__decorate([
    (0, class_validator_1.IsIn)(article_constant_1.ARTICLE_STATUSES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_2.IsDefined)(),
    __metadata("design:type", Number)
], ArticlesStatusDTO.prototype, "status", void 0);
//# sourceMappingURL=article.dto.js.map