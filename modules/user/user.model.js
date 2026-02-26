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
exports.UserProvider = exports.User = exports.UserIdentity = exports.USER_PUBLIC_POPULATE_SELECT = void 0;
const auto_increment_1 = require("@typegoose/auto-increment");
const typegoose_1 = require("@typegoose/typegoose");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_validator_2 = require("class-validator");
const normalize_string_decorator_1 = require("../../decorators/normalize-string.decorator");
const database_constant_1 = require("../../constants/database.constant");
const model_transformer_1 = require("../../transformers/model.transformer");
const paginate_1 = require("../../utils/paginate");
const key_value_model_1 = require("../../models/key-value.model");
const user_constant_1 = require("./user.constant");
exports.USER_PUBLIC_POPULATE_SELECT = ['id', 'type', 'name', 'website', 'avatar_url'];
class UserIdentity {
    provider;
    uid;
    email;
    username;
    display_name;
    avatar_url;
    profile_url;
    linked_at;
}
exports.UserIdentity = UserIdentity;
__decorate([
    (0, class_validator_2.IsEnum)(user_constant_1.UserIdentityProvider),
    (0, class_validator_1.IsDefined)(),
    (0, typegoose_1.prop)({ type: String, enum: user_constant_1.UserIdentityProvider, required: true }),
    __metadata("design:type", String)
], UserIdentity.prototype, "provider", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_2.IsString)(),
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], UserIdentity.prototype, "uid", void 0);
__decorate([
    (0, class_validator_2.IsEmail)(),
    (0, class_validator_2.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    (0, typegoose_1.prop)({ type: String, default: null, trim: true }),
    __metadata("design:type", Object)
], UserIdentity.prototype, "email", void 0);
__decorate([
    (0, class_validator_2.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    (0, typegoose_1.prop)({ type: String, default: null, trim: true }),
    __metadata("design:type", Object)
], UserIdentity.prototype, "username", void 0);
__decorate([
    (0, class_validator_2.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    (0, typegoose_1.prop)({ type: String, default: null, trim: true }),
    __metadata("design:type", Object)
], UserIdentity.prototype, "display_name", void 0);
__decorate([
    (0, class_validator_2.IsUrl)(),
    (0, class_validator_2.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    (0, typegoose_1.prop)({ type: String, default: null, trim: true }),
    __metadata("design:type", Object)
], UserIdentity.prototype, "avatar_url", void 0);
__decorate([
    (0, class_validator_2.IsUrl)(),
    (0, class_validator_2.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    (0, typegoose_1.prop)({ type: String, default: null, trim: true }),
    __metadata("design:type", Object)
], UserIdentity.prototype, "profile_url", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], UserIdentity.prototype, "linked_at", void 0);
let User = class User {
    id;
    type;
    name;
    email;
    website;
    avatar_url;
    identities;
    extras;
    disabled;
    created_at;
    updated_at;
};
exports.User = User;
__decorate([
    (0, typegoose_1.prop)({ unique: true }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, class_validator_2.IsEnum)(user_constant_1.UserType),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ type: Number, enum: user_constant_1.UserType, default: user_constant_1.UserType.Standard, index: true }),
    __metadata("design:type", Number)
], User.prototype, "type", void 0);
__decorate([
    (0, class_validator_2.MaxLength)(100),
    (0, class_validator_2.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    (0, typegoose_1.prop)({ type: String, required: true, trim: true, validate: /\S+/, maxlength: 100 }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, class_validator_2.IsEmail)(),
    (0, class_validator_2.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    (0, typegoose_1.prop)({ type: String, default: null, trim: true }),
    __metadata("design:type", Object)
], User.prototype, "email", void 0);
__decorate([
    (0, class_validator_2.MaxLength)(500),
    (0, class_validator_2.IsUrl)({ require_protocol: true }),
    (0, class_validator_2.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    (0, typegoose_1.prop)({ type: String, default: null, trim: true, maxlength: 500 }),
    __metadata("design:type", Object)
], User.prototype, "website", void 0);
__decorate([
    (0, class_validator_2.MaxLength)(500),
    (0, class_validator_2.IsUrl)(),
    (0, class_validator_2.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    (0, typegoose_1.prop)({ type: String, default: null, trim: true, maxlength: 500 }),
    __metadata("design:type", Object)
], User.prototype, "avatar_url", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => UserIdentity),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_2.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ type: () => [UserIdentity], _id: false, default: [] }),
    __metadata("design:type", Array)
], User.prototype, "identities", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => key_value_model_1.KeyValueModel),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_2.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ type: () => [key_value_model_1.KeyValueModel], _id: false, default: [] }),
    __metadata("design:type", Array)
], User.prototype, "extras", void 0);
__decorate([
    (0, class_validator_2.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ type: Boolean, default: false, index: true }),
    __metadata("design:type", Boolean)
], User.prototype, "disabled", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now, immutable: true, index: true }),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
exports.User = User = __decorate([
    (0, typegoose_1.plugin)(paginate_1.mongoosePaginate),
    (0, typegoose_1.plugin)(auto_increment_1.AutoIncrementID, database_constant_1.GENERAL_DB_AUTO_INCREMENT_ID_CONFIG),
    (0, typegoose_1.index)({ 'identities.provider': 1, 'identities.uid': 1 }, {
        unique: true,
        partialFilterExpression: {
            'identities.provider': { $type: 'string' },
            'identities.uid': { $type: 'string' }
        }
    }),
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            id: false,
            versionKey: false,
            timestamps: {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        }
    })
], User);
exports.UserProvider = (0, model_transformer_1.getProviderByTypegooseClass)(User);
//# sourceMappingURL=user.model.js.map