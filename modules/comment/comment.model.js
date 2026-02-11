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
exports.CommentProvider = exports.Comment = exports.CommentBase = exports.Author = void 0;
const auto_increment_1 = require("@typegoose/auto-increment");
const typegoose_1 = require("@typegoose/typegoose");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_validator_2 = require("class-validator");
const database_constant_1 = require("../../constants/database.constant");
const paginate_1 = require("../../utils/paginate");
const model_transformer_1 = require("../../transformers/model.transformer");
const biz_constant_1 = require("../../constants/biz.constant");
const codec_transformer_1 = require("../../transformers/codec.transformer");
const key_value_model_1 = require("../../models/key-value.model");
const comment_constant_1 = require("./comment.constant");
let Author = class Author {
    name;
    email;
    site;
    get email_hash() {
        const email = this.email?.trim().toLowerCase();
        return email ? (0, codec_transformer_1.decodeMD5)(email) : null;
    }
};
exports.Author = Author;
__decorate([
    (0, class_validator_2.MaxLength)(20),
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsNotEmpty)(),
    (0, typegoose_1.prop)({ required: true, validate: /\S+/ }),
    __metadata("design:type", String)
], Author.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Author.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({ require_protocol: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Author.prototype, "site", void 0);
exports.Author = Author = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            versionKey: false,
            toJSON: { virtuals: true },
            toObject: { virtuals: true }
        }
    })
], Author);
class CommentBase {
    post_id;
    pid;
    content;
    author;
    agent;
}
exports.CommentBase = CommentBase;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_2.IsNotEmpty)({ message: 'post ID?' }),
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", Number)
], CommentBase.prototype, "post_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, typegoose_1.prop)({ default: biz_constant_1.ROOT_COMMENT_PID, index: true }),
    __metadata("design:type", Number)
], CommentBase.prototype, "pid", void 0);
__decorate([
    (0, class_validator_2.MinLength)(3),
    (0, class_validator_2.MaxLength)(3000),
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsNotEmpty)({ message: 'comment content?' }),
    (0, typegoose_1.prop)({ required: true, validate: /\S+/ }),
    __metadata("design:type", String)
], CommentBase.prototype, "content", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Author),
    (0, class_validator_2.ValidateNested)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_2.IsNotEmpty)(),
    (0, class_validator_2.IsDefined)({ message: 'comment author?' }),
    (0, typegoose_1.prop)({ _id: false, required: true }),
    __metadata("design:type", Author)
], CommentBase.prototype, "author", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: String }),
    __metadata("design:type", String)
], CommentBase.prototype, "agent", void 0);
let Comment = class Comment extends CommentBase {
    id;
    status;
    likes;
    dislikes;
    ip;
    ip_location;
    extras;
    created_at;
    updated_at;
};
exports.Comment = Comment;
__decorate([
    (0, typegoose_1.prop)({ unique: true }),
    __metadata("design:type", Number)
], Comment.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsIn)(comment_constant_1.COMMENT_STATUSES),
    (0, class_validator_1.IsInt)(),
    (0, typegoose_1.prop)({ enum: comment_constant_1.CommentStatus, default: comment_constant_1.CommentStatus.Published, index: true }),
    __metadata("design:type", Number)
], Comment.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, typegoose_1.prop)({ default: 0, index: true }),
    __metadata("design:type", Number)
], Comment.prototype, "likes", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, typegoose_1.prop)({ default: 0, index: true }),
    __metadata("design:type", Number)
], Comment.prototype, "dislikes", void 0);
__decorate([
    (0, class_validator_1.IsIP)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Comment.prototype, "ip", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, default: null }),
    __metadata("design:type", Object)
], Comment.prototype, "ip_location", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => key_value_model_1.KeyValueModel),
    (0, class_validator_2.ValidateNested)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    (0, typegoose_1.prop)({ _id: false, default: [], type: () => [key_value_model_1.KeyValueModel] }),
    __metadata("design:type", Array)
], Comment.prototype, "extras", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now, immutable: true }),
    __metadata("design:type", Date)
], Comment.prototype, "created_at", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Comment.prototype, "updated_at", void 0);
exports.Comment = Comment = __decorate([
    (0, typegoose_1.plugin)(paginate_1.mongoosePaginate),
    (0, typegoose_1.plugin)(auto_increment_1.AutoIncrementID, database_constant_1.GENERAL_DB_AUTO_INCREMENT_ID_CONFIG),
    (0, typegoose_1.modelOptions)({
        options: { allowMixed: typegoose_1.Severity.ALLOW },
        schemaOptions: {
            id: false,
            versionKey: false,
            timestamps: {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        }
    })
], Comment);
exports.CommentProvider = (0, model_transformer_1.getProviderByTypegooseClass)(Comment);
//# sourceMappingURL=comment.model.js.map