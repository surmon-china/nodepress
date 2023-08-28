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
exports.FeedbackProvider = exports.Feedback = exports.FeedbackBase = exports.FEEDBACK_EMOTION_VALUES = exports.FEEDBACK_EMOTIONS = exports.FeedbackEmotion = void 0;
const auto_increment_1 = require("@typegoose/auto-increment");
const typegoose_1 = require("@typegoose/typegoose");
const class_validator_1 = require("class-validator");
const increment_constant_1 = require("../../constants/increment.constant");
const model_transformer_1 = require("../../transformers/model.transformer");
const paginate_1 = require("../../utils/paginate");
var FeedbackEmotion;
(function (FeedbackEmotion) {
    FeedbackEmotion[FeedbackEmotion["Terrible"] = 1] = "Terrible";
    FeedbackEmotion[FeedbackEmotion["Bad"] = 2] = "Bad";
    FeedbackEmotion[FeedbackEmotion["Neutral"] = 3] = "Neutral";
    FeedbackEmotion[FeedbackEmotion["Great"] = 4] = "Great";
    FeedbackEmotion[FeedbackEmotion["Amazing"] = 5] = "Amazing";
})(FeedbackEmotion || (exports.FeedbackEmotion = FeedbackEmotion = {}));
const emotionMap = new Map([
    {
        value: FeedbackEmotion.Terrible,
        text: FeedbackEmotion[FeedbackEmotion.Terrible],
        emoji: '😠'
    },
    {
        value: FeedbackEmotion.Bad,
        text: FeedbackEmotion[FeedbackEmotion.Bad],
        emoji: '🙁'
    },
    {
        value: FeedbackEmotion.Neutral,
        text: FeedbackEmotion[FeedbackEmotion.Neutral],
        emoji: '😐'
    },
    {
        value: FeedbackEmotion.Great,
        text: FeedbackEmotion[FeedbackEmotion.Great],
        emoji: '😃'
    },
    {
        value: FeedbackEmotion.Amazing,
        text: FeedbackEmotion[FeedbackEmotion.Amazing],
        emoji: '🥰'
    }
].map((item) => [item.value, item]));
exports.FEEDBACK_EMOTIONS = Array.from(emotionMap.values());
exports.FEEDBACK_EMOTION_VALUES = exports.FEEDBACK_EMOTIONS.map((e) => e.value);
class FeedbackBase {
    get emotion_text() {
        return emotionMap.get(this.emotion).text;
    }
    get emotion_emoji() {
        return emotionMap.get(this.emotion).emoji;
    }
}
exports.FeedbackBase = FeedbackBase;
__decorate([
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", Number)
], FeedbackBase.prototype, "tid", void 0);
__decorate([
    (0, class_validator_1.IsIn)(exports.FEEDBACK_EMOTION_VALUES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", Number)
], FeedbackBase.prototype, "emotion", void 0);
__decorate([
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(3000),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typegoose_1.prop)({ required: true, validate: /\S+/ }),
    __metadata("design:type", String)
], FeedbackBase.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], FeedbackBase.prototype, "user_name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], FeedbackBase.prototype, "user_email", void 0);
let Feedback = class Feedback extends FeedbackBase {
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
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ default: '' }),
    __metadata("design:type", String)
], Feedback.prototype, "remark", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
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
    (0, class_validator_1.IsOptional)(),
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
    (0, typegoose_1.plugin)(auto_increment_1.AutoIncrementID, increment_constant_1.generalAutoIncrementIDConfig),
    (0, typegoose_1.modelOptions)({
        options: { allowMixed: typegoose_1.Severity.ALLOW },
        schemaOptions: {
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