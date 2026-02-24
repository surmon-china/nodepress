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
exports.UserPaginateQueryDto = exports.UpdateUserDto = exports.CreateUserDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const paginate_dto_1 = require("../../dtos/paginate.dto");
const querys_dto_1 = require("../../dtos/querys.dto");
const value_transformer_1 = require("../../transformers/value.transformer");
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
class CreateUserDto extends (0, mapped_types_1.PickType)(user_model_1.User, [
    'type',
    'name',
    'email',
    'website',
    'avatar_url',
    'identities',
    'extras'
]) {
}
exports.CreateUserDto = CreateUserDto;
class UpdateUserDto extends (0, mapped_types_1.PartialType)((0, mapped_types_1.PickType)(user_model_1.User, ['type', 'name', 'email', 'website', 'avatar_url', 'disabled', 'extras'])) {
}
exports.UpdateUserDto = UpdateUserDto;
class UserPaginateQueryDto extends (0, mapped_types_1.IntersectionType)(paginate_dto_1.PaginateOptionDto, querys_dto_1.KeywordQueryDto) {
    type;
    disabled;
}
exports.UserPaginateQueryDto = UserPaginateQueryDto;
__decorate([
    (0, class_validator_1.IsEnum)(user_constant_1.UserType),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], UserPaginateQueryDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToBoolean)(value)),
    __metadata("design:type", Boolean)
], UserPaginateQueryDto.prototype, "disabled", void 0);
//# sourceMappingURL=user.dto.js.map