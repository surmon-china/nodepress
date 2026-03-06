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
exports.CategoryIdsDto = exports.CategoryPaginateQueryDto = exports.UpdateCategoryDto = exports.CreateCategoryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_validator_1 = require("class-validator");
const paginate_dto_1 = require("../../dtos/paginate.dto");
const queries_dto_1 = require("../../dtos/queries.dto");
const category_model_1 = require("./category.model");
class CreateCategoryDto extends (0, mapped_types_1.PickType)(category_model_1.Category, [
    'parent_id',
    'name',
    'slug',
    'description',
    'extras'
]) {
}
exports.CreateCategoryDto = CreateCategoryDto;
class UpdateCategoryDto extends (0, mapped_types_1.PartialType)(CreateCategoryDto) {
}
exports.UpdateCategoryDto = UpdateCategoryDto;
class CategoryPaginateQueryDto extends (0, mapped_types_1.IntersectionType)(paginate_dto_1.PaginateOptionDto, queries_dto_1.KeywordQueryDto) {
}
exports.CategoryPaginateQueryDto = CategoryPaginateQueryDto;
class CategoryIdsDto {
    category_ids;
}
exports.CategoryIdsDto = CategoryIdsDto;
__decorate([
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], CategoryIdsDto.prototype, "category_ids", void 0);
//# sourceMappingURL=category.dto.js.map