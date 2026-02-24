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
exports.OptionalAuthorDto = void 0;
const class_validator_1 = require("class-validator");
const normalize_string_decorator_1 = require("../decorators/normalize-string.decorator");
class OptionalAuthorDto {
    author_name;
    author_email;
}
exports.OptionalAuthorDto = OptionalAuthorDto;
__decorate([
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    __metadata("design:type", String)
], OptionalAuthorDto.prototype, "author_name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    __metadata("design:type", String)
], OptionalAuthorDto.prototype, "author_email", void 0);
//# sourceMappingURL=author.dto.js.map