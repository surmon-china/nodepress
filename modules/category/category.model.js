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
exports.CategoryProvider = exports.Category = void 0;
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
let Category = class Category {
    id;
    parent_id;
    name;
    slug;
    description;
    extras;
    created_at;
    updated_at;
    article_count;
};
exports.Category = Category;
__decorate([
    (0, typegoose_1.prop)({ unique: true }),
    __metadata("design:type", Number)
], Category.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ type: Number, default: null }),
    __metadata("design:type", Object)
], Category.prototype, "parent_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    (0, typegoose_1.prop)({ type: String, required: true, trim: true, validate: /\S+/ }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, class_validator_2.MaxLength)(30),
    (0, class_validator_2.Matches)(/^[a-zA-Z0-9-_]+$/),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    (0, typegoose_1.prop)({ type: String, required: true, unique: true, trim: true, validate: /^[a-zA-Z0-9-_]+$/ }),
    __metadata("design:type", String)
], Category.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    (0, typegoose_1.prop)({ type: String, default: '', trim: true }),
    __metadata("design:type", String)
], Category.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => key_value_model_1.KeyValueModel),
    (0, class_validator_2.ValidateNested)({ each: true }),
    (0, class_validator_2.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ type: () => [key_value_model_1.KeyValueModel], _id: false, default: [] }),
    __metadata("design:type", Array)
], Category.prototype, "extras", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now, immutable: true, index: true }),
    __metadata("design:type", Date)
], Category.prototype, "created_at", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Category.prototype, "updated_at", void 0);
exports.Category = Category = __decorate([
    (0, typegoose_1.plugin)(paginate_1.mongoosePaginate),
    (0, typegoose_1.plugin)(auto_increment_1.AutoIncrementID, database_constant_1.GENERAL_DB_AUTO_INCREMENT_ID_CONFIG),
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
], Category);
exports.CategoryProvider = (0, model_transformer_1.getProviderByTypegooseClass)(Category);
//# sourceMappingURL=category.model.js.map