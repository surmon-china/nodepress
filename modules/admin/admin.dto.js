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
exports.UpdateProfileDto = exports.AuthRefreshTokenDto = exports.AuthLogoutDto = exports.AuthLoginDto = void 0;
const class_validator_1 = require("class-validator");
const normalize_string_decorator_1 = require("../../decorators/normalize-string.decorator");
class AuthLoginDto {
    password;
}
exports.AuthLoginDto = AuthLoginDto;
__decorate([
    (0, class_validator_1.IsBase64)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AuthLoginDto.prototype, "password", void 0);
class AuthLogoutDto {
    refresh_token;
}
exports.AuthLogoutDto = AuthLogoutDto;
__decorate([
    (0, class_validator_1.IsHexadecimal)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AuthLogoutDto.prototype, "refresh_token", void 0);
class AuthRefreshTokenDto {
    refresh_token;
}
exports.AuthRefreshTokenDto = AuthRefreshTokenDto;
__decorate([
    (0, class_validator_1.IsHexadecimal)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AuthRefreshTokenDto.prototype, "refresh_token", void 0);
class UpdateProfileDto {
    name;
    slogan;
    avatar_url;
    password;
    new_password;
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "slogan", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "avatar_url", void 0);
__decorate([
    (0, class_validator_1.IsBase64)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsBase64)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "new_password", void 0);
//# sourceMappingURL=admin.dto.js.map