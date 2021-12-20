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
exports.AuthProvider = exports.AuthPasswordPayload = exports.Auth = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const class_validator_1 = require("class-validator");
const model_transformer_1 = require("../../transformers/model.transformer");
class Auth {
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)({ message: '名字？' }),
    (0, typegoose_1.prop)({ default: '' }),
    __metadata("design:type", String)
], Auth.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)({ message: '你的口号呢？' }),
    (0, typegoose_1.prop)({ default: '' }),
    __metadata("design:type", String)
], Auth.prototype, "slogan", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)({ message: '头像？' }),
    (0, typegoose_1.prop)({ default: '' }),
    __metadata("design:type", String)
], Auth.prototype, "gravatar", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, typegoose_1.prop)({ select: false }),
    __metadata("design:type", String)
], Auth.prototype, "password", void 0);
exports.Auth = Auth;
class AuthPasswordPayload {
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsNotEmpty)({ message: '密码？' }),
    (0, class_validator_1.IsString)({ message: '字符串？' }),
    __metadata("design:type", String)
], AuthPasswordPayload.prototype, "password", void 0);
exports.AuthPasswordPayload = AuthPasswordPayload;
exports.AuthProvider = (0, model_transformer_1.getProviderByTypegooseClass)(Auth);
//# sourceMappingURL=auth.model.js.map