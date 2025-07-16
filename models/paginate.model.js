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
exports.PaginateOptionWithHotSortDTO = exports.PaginateOptionDTO = exports.PaginateBaseOptionDTO = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const biz_constant_1 = require("../constants/biz.constant");
const value_transformer_1 = require("../transformers/value.transformer");
class PaginateBaseOptionDTO {
    page;
    per_page;
}
exports.PaginateBaseOptionDTO = PaginateBaseOptionDTO;
__decorate([
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], PaginateBaseOptionDTO.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], PaginateBaseOptionDTO.prototype, "per_page", void 0);
class PaginateOptionDTO extends PaginateBaseOptionDTO {
    sort;
}
exports.PaginateOptionDTO = PaginateOptionDTO;
__decorate([
    (0, class_validator_1.IsIn)([biz_constant_1.SortType.Asc, biz_constant_1.SortType.Desc]),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], PaginateOptionDTO.prototype, "sort", void 0);
class PaginateOptionWithHotSortDTO extends PaginateBaseOptionDTO {
    sort;
}
exports.PaginateOptionWithHotSortDTO = PaginateOptionWithHotSortDTO;
__decorate([
    (0, class_validator_1.IsIn)([biz_constant_1.SortType.Asc, biz_constant_1.SortType.Desc, biz_constant_1.SortType.Hottest]),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], PaginateOptionWithHotSortDTO.prototype, "sort", void 0);
//# sourceMappingURL=paginate.model.js.map