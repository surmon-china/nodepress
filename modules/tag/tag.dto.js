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
exports.TagIdsDto = exports.TagPaginateQueryDto = exports.UpdateTagDto = exports.CreateTagDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_validator_1 = require("class-validator");
const paginate_dto_1 = require("../../dtos/paginate.dto");
const querys_dto_1 = require("../../dtos/querys.dto");
const tag_model_1 = require("./tag.model");
class CreateTagDto extends (0, mapped_types_1.PickType)(tag_model_1.Tag, ['name', 'slug', 'description', 'extras']) {
}
exports.CreateTagDto = CreateTagDto;
class UpdateTagDto extends (0, mapped_types_1.PartialType)(CreateTagDto) {
}
exports.UpdateTagDto = UpdateTagDto;
class TagPaginateQueryDto extends (0, mapped_types_1.IntersectionType)(paginate_dto_1.PaginateOptionDto, querys_dto_1.KeywordQueryDto) {
}
exports.TagPaginateQueryDto = TagPaginateQueryDto;
class TagIdsDto {
    tag_ids;
}
exports.TagIdsDto = TagIdsDto;
__decorate([
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], TagIdsDto.prototype, "tag_ids", void 0);
//# sourceMappingURL=tag.dto.js.map