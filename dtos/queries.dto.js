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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeywordQueryDto = exports.DateQueryDto = void 0;
const escapeRegExp_1 = __importDefault(require("lodash/escapeRegExp"));
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const normalize_string_decorator_1 = require("../decorators/normalize-string.decorator");
class DateQueryDto {
    date;
}
exports.DateQueryDto = DateQueryDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    __metadata("design:type", String)
], DateQueryDto.prototype, "date", void 0);
class KeywordQueryDto {
    keyword;
}
exports.KeywordQueryDto = KeywordQueryDto;
__decorate([
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true, collapseSpaces: true }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? (0, escapeRegExp_1.default)(value) : value)),
    __metadata("design:type", String)
], KeywordQueryDto.prototype, "keyword", void 0);
//# sourceMappingURL=queries.dto.js.map