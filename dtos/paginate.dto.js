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
exports.PaginateOptionWithHotSortDto = exports.PaginateOptionDto = exports.PaginateBaseOptionDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const value_transformer_1 = require("../transformers/value.transformer");
const sort_constant_1 = require("../constants/sort.constant");
const app_config_1 = require("../app.config");
class PaginateBaseOptionDto {
    page;
    per_page;
}
exports.PaginateBaseOptionDto = PaginateBaseOptionDto;
__decorate([
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], PaginateBaseOptionDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(app_config_1.APP_BIZ.PAGINATION_MAX_SIZE),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], PaginateBaseOptionDto.prototype, "per_page", void 0);
class PaginateOptionDto extends PaginateBaseOptionDto {
    sort;
}
exports.PaginateOptionDto = PaginateOptionDto;
__decorate([
    (0, class_validator_1.IsIn)([sort_constant_1.SortMode.Oldest, sort_constant_1.SortMode.Latest]),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], PaginateOptionDto.prototype, "sort", void 0);
class PaginateOptionWithHotSortDto extends PaginateBaseOptionDto {
    sort;
}
exports.PaginateOptionWithHotSortDto = PaginateOptionWithHotSortDto;
__decorate([
    (0, class_validator_1.IsIn)([sort_constant_1.SortMode.Oldest, sort_constant_1.SortMode.Latest, sort_constant_1.SortMode.Hottest]),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], PaginateOptionWithHotSortDto.prototype, "sort", void 0);
//# sourceMappingURL=paginate.dto.js.map