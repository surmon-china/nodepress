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
exports.CommentProvider = exports.Comment = void 0;
const mongoose_lean_virtuals_1 = __importDefault(require("mongoose-lean-virtuals"));
const auto_increment_1 = require("@typegoose/auto-increment");
const typegoose_1 = require("@typegoose/typegoose");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_validator_2 = require("class-validator");
const class_validator_3 = require("class-validator");
const normalize_string_decorator_1 = require("../../decorators/normalize-string.decorator");
const database_constant_1 = require("../../constants/database.constant");
const user_model_1 = require("../user/user.model");
const key_value_model_1 = require("../../models/key-value.model");
const model_transformer_1 = require("../../transformers/model.transformer");
const codec_transformer_1 = require("../../transformers/codec.transformer");
const paginate_1 = require("../../utils/paginate");
const comment_constant_1 = require("./comment.constant");
let Comment = class Comment {
    id;
    status;
    target_type;
    target_id;
    parent_id;
    content;
    user;
    author_name;
    author_email;
    get author_email_hash() {
        const email = this.author_email?.trim().toLowerCase();
        return email ? (0, codec_transformer_1.hashMD5)(email) : null;
    }
    author_website;
    author_type;
    get author_status() {
        if (this.author_type === undefined)
            return comment_constant_1.CommentAuthorStatus.Guest;
        if (this.author_type === comment_constant_1.CommentAuthorType.Guest) {
            return comment_constant_1.CommentAuthorStatus.Guest;
        }
        else if (this.author_type === comment_constant_1.CommentAuthorType.User && !this.user) {
            return comment_constant_1.CommentAuthorStatus.Ghost;
        }
        else {
            return comment_constant_1.CommentAuthorStatus.Active;
        }
    }
    likes;
    dislikes;
    ip;
    ip_location;
    user_agent;
    extras;
    created_at;
    updated_at;
    orphaned;
};
exports.Comment = Comment;
__decorate([
    (0, typegoose_1.prop)({ unique: true }),
    __metadata("design:type", Number)
], Comment.prototype, "id", void 0);
__decorate([
    (0, class_validator_3.IsEnum)(comment_constant_1.CommentStatus),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: Number, enum: comment_constant_1.CommentStatus, default: comment_constant_1.CommentStatus.Published, index: true }),
    __metadata("design:type", Number)
], Comment.prototype, "status", void 0);
__decorate([
    (0, class_validator_3.IsEnum)(comment_constant_1.CommentTargetType),
    (0, class_validator_2.IsDefined)(),
    (0, typegoose_1.prop)({ type: String, enum: comment_constant_1.CommentTargetType, required: true, index: true }),
    __metadata("design:type", String)
], Comment.prototype, "target_type", void 0);
__decorate([
    (0, class_validator_3.IsInt)(),
    (0, class_validator_2.IsDefined)(),
    (0, typegoose_1.prop)({ type: Number, required: true, index: true }),
    __metadata("design:type", Number)
], Comment.prototype, "target_id", void 0);
__decorate([
    (0, class_validator_2.Min)(0),
    (0, class_validator_3.IsInt)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: Number, default: null }),
    __metadata("design:type", Object)
], Comment.prototype, "parent_id", void 0);
__decorate([
    (0, class_validator_2.MinLength)(3),
    (0, class_validator_2.MaxLength)(3000),
    (0, class_validator_2.IsNotEmpty)(),
    (0, class_validator_3.IsString)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    (0, typegoose_1.prop)({ type: String, required: true, trim: true, validate: /\S+/, maxlength: 3000 }),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => user_model_1.User, default: null, index: true }),
    __metadata("design:type", Object)
], Comment.prototype, "user", void 0);
__decorate([
    (0, class_validator_2.MaxLength)(100),
    (0, class_validator_3.IsString)(),
    (0, class_validator_2.IsNotEmpty)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    (0, typegoose_1.prop)({ type: String, required: true, trim: true, validate: /\S+/, maxlength: 100 }),
    __metadata("design:type", String)
], Comment.prototype, "author_name", void 0);
__decorate([
    (0, class_validator_3.IsEmail)(),
    (0, class_validator_3.IsString)(),
    (0, class_validator_2.IsOptional)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    (0, typegoose_1.prop)({ type: String, default: null, trim: true }),
    __metadata("design:type", Object)
], Comment.prototype, "author_email", void 0);
__decorate([
    (0, class_validator_2.MaxLength)(500),
    (0, class_validator_3.IsUrl)({ require_protocol: true }),
    (0, class_validator_3.IsString)(),
    (0, class_validator_2.IsOptional)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    (0, typegoose_1.prop)({ type: String, default: null, trim: true, maxlength: 500 }),
    __metadata("design:type", Object)
], Comment.prototype, "author_website", void 0);
__decorate([
    (0, class_validator_3.IsEnum)(comment_constant_1.CommentAuthorType),
    (0, class_validator_2.IsDefined)(),
    (0, typegoose_1.prop)({ type: String, enum: comment_constant_1.CommentAuthorType, required: true, index: true }),
    __metadata("design:type", String)
], Comment.prototype, "author_type", void 0);
__decorate([
    (0, class_validator_3.IsInt)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: Number, default: 0, min: 0 }),
    __metadata("design:type", Number)
], Comment.prototype, "likes", void 0);
__decorate([
    (0, class_validator_3.IsInt)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: Number, default: 0, min: 0 }),
    __metadata("design:type", Number)
], Comment.prototype, "dislikes", void 0);
__decorate([
    (0, class_validator_3.IsIP)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Comment.prototype, "ip", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, default: null }),
    __metadata("design:type", Object)
], Comment.prototype, "ip_location", void 0);
__decorate([
    (0, class_validator_3.IsString)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Comment.prototype, "user_agent", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => key_value_model_1.KeyValueModel),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_3.IsArray)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: () => [key_value_model_1.KeyValueModel], _id: false, default: [] }),
    __metadata("design:type", Array)
], Comment.prototype, "extras", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now, immutable: true, index: true }),
    __metadata("design:type", Date)
], Comment.prototype, "created_at", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Comment.prototype, "updated_at", void 0);
exports.Comment = Comment = __decorate([
    (0, typegoose_1.plugin)(paginate_1.mongoosePaginate),
    (0, typegoose_1.plugin)(mongoose_lean_virtuals_1.default),
    (0, typegoose_1.plugin)(auto_increment_1.AutoIncrementID, database_constant_1.GENERAL_DB_AUTO_INCREMENT_ID_CONFIG),
    (0, typegoose_1.index)({ user: 1, created_at: -1 }),
    (0, typegoose_1.index)({ target_type: 1, target_id: 1, status: 1, created_at: -1 }),
    (0, typegoose_1.modelOptions)({
        options: { allowMixed: typegoose_1.Severity.ALLOW },
        schemaOptions: {
            id: false,
            versionKey: false,
            toJSON: { virtuals: true },
            toObject: { virtuals: true },
            timestamps: {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        }
    })
], Comment);
exports.CommentProvider = (0, model_transformer_1.getProviderByTypegooseClass)(Comment);
//# sourceMappingURL=comment.model.js.map