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
exports.AdminProvider = exports.Admin = exports.DEFAULT_ADMIN_PROFILE = exports.ADMIN_SINGLETON_QUERY = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const model_transformer_1 = require("../../transformers/model.transformer");
exports.ADMIN_SINGLETON_QUERY = Object.freeze({ singleton: true });
exports.DEFAULT_ADMIN_PROFILE = Object.freeze({
    name: 'Admin',
    slogan: 'This is admin slogan',
    avatar_url: ''
});
let Admin = class Admin {
    singleton;
    password;
    name;
    slogan;
    avatar_url;
};
exports.Admin = Admin;
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, default: true, unique: true, select: false }),
    __metadata("design:type", Boolean)
], Admin.prototype, "singleton", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true, validate: /\S+/, select: false }),
    __metadata("design:type", String)
], Admin.prototype, "password", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true, trim: true, validate: /\S+/ }),
    __metadata("design:type", String)
], Admin.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: '', trim: true }),
    __metadata("design:type", String)
], Admin.prototype, "slogan", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: '', trim: true }),
    __metadata("design:type", String)
], Admin.prototype, "avatar_url", void 0);
exports.Admin = Admin = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            versionKey: false
        }
    })
], Admin);
exports.AdminProvider = (0, model_transformer_1.getProviderByTypegooseClass)(Admin);
//# sourceMappingURL=admin.model.js.map