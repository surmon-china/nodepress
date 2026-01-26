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
exports.FeedbackProvider = exports.Feedback = exports.FeedbackBase = void 0;
const auto_increment_1 = require("@typegoose/auto-increment");
const typegoose_1 = require("@typegoose/typegoose");
const class_validator_1 = require("class-validator");
const class_validator_2 = require("class-validator");
const database_constant_1 = require("../../constants/database.constant");
const model_transformer_1 = require("../../transformers/model.transformer");
const paginate_1 = require("../../utils/paginate");
const feedback_constant_1 = require("./feedback.constant");
class FeedbackBase {
    tid;
    emotion;
    get emotion_text() {
        return feedback_constant_1.emotionsMap.get(this.emotion).text;
    }
    get emotion_emoji() {
        return feedback_constant_1.emotionsMap.get(this.emotion).emoji;
    }
    content;
    user_name;
    user_email;
}
exports.FeedbackBase = FeedbackBase;
__decorate([
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_2.IsNotEmpty)(),
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", Number)
], FeedbackBase.prototype, "tid", void 0);
__decorate([
    (0, class_validator_2.IsIn)(feedback_constant_1.FEEDBACK_EMOTION_VALUES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_2.IsNotEmpty)(),
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", Number)
], FeedbackBase.prototype, "emotion", void 0);
__decorate([
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(3000),
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsNotEmpty)(),
    (0, typegoose_1.prop)({ required: true, validate: /\S+/ }),
    __metadata("design:type", String)
], FeedbackBase.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], FeedbackBase.prototype, "user_name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], FeedbackBase.prototype, "user_email", void 0);
let Feedback = class Feedback extends FeedbackBase {
    id;
    marked;
    remark;
    origin;
    user_agent;
    ip;
    ip_location;
    created_at;
    updated_at;
};
exports.Feedback = Feedback;
__decorate([
    (0, typegoose_1.prop)({ unique: true }),
    __metadata("design:type", Number)
], Feedback.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, typegoose_1.prop)({ default: false, index: true }),
    __metadata("design:type", Boolean)
], Feedback.prototype, "marked", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ default: '' }),
    __metadata("design:type", String)
], Feedback.prototype, "remark", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Feedback.prototype, "origin", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, typegoose_1.prop)({ default: null }),
    __metadata("design:type", String)
], Feedback.prototype, "user_agent", void 0);
__decorate([
    (0, class_validator_1.IsIP)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Feedback.prototype, "ip", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, default: null }),
    __metadata("design:type", Object)
], Feedback.prototype, "ip_location", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now, immutable: true }),
    __metadata("design:type", Date)
], Feedback.prototype, "created_at", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Feedback.prototype, "updated_at", void 0);
exports.Feedback = Feedback = __decorate([
    (0, typegoose_1.plugin)(paginate_1.mongoosePaginate),
    (0, typegoose_1.plugin)(auto_increment_1.AutoIncrementID, database_constant_1.GENERAL_DB_AUTO_INCREMENT_ID_CONFIG),
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
], Feedback);
exports.FeedbackProvider = (0, model_transformer_1.getProviderByTypegooseClass)(Feedback);
//# sourceMappingURL=feedback.model.js.map