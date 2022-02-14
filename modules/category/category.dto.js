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
exports.CategoriesDTO = exports.CategoryPaginateQueryDTO = void 0;
const class_validator_1 = require("class-validator");
const paginate_model_1 = require("../../models/paginate.model");
class CategoryPaginateQueryDTO extends paginate_model_1.PaginateOptionDTO {
}
exports.CategoryPaginateQueryDTO = CategoryPaginateQueryDTO;
class CategoriesDTO {
}
__decorate([
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CategoriesDTO.prototype, "category_ids", void 0);
exports.CategoriesDTO = CategoriesDTO;
//# sourceMappingURL=category.dto.js.map