"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const biz_constant_1 = require("../../constants/biz.constant");
const helper_service_ip_1 = require("../../processors/helper/helper.service.ip");
const helper_service_email_1 = require("../../processors/helper/helper.service.email");
const app_environment_1 = require("../../app.environment");
const APP_CONFIG = __importStar(require("../../app.config"));
const feedback_model_1 = require("./feedback.model");
let FeedbackService = class FeedbackService {
    constructor(ipService, emailService, feedbackModel) {
        this.ipService = ipService;
        this.emailService = emailService;
        this.feedbackModel = feedbackModel;
    }
    async emailToAdmin(feedback) {
        const subject = `You have a new feedback`;
        const texts = [
            `${subject} on ${feedback.tid}.`,
            `Author: ${feedback.user_name || 'Anonymous user'}`,
            `Emotion: ${feedback.emotion_emoji} ${feedback.emotion_text} (${feedback.emotion})`,
            `Feedback: ${feedback.content}`,
        ];
        this.emailService.sendMailAs(APP_CONFIG.APP.FE_NAME, {
            to: APP_CONFIG.APP.ADMIN_EMAIL,
            subject,
            text: texts.join('\n'),
            html: texts.map((text) => `<p>${text}</p>`).join('\n'),
        });
    }
    paginater(querys, options) {
        return this.feedbackModel.paginate(querys, options);
    }
    async create(feedback, visitor) {
        const ip_location = app_environment_1.isProdEnv && visitor.ip ? await this.ipService.queryLocation(visitor.ip) : null;
        const succeed = await this.feedbackModel.create(Object.assign(Object.assign({}, feedback), { origin: visitor.origin, user_agent: visitor.ua, ip: visitor.ip, ip_location }));
        this.emailToAdmin(succeed);
        return succeed;
    }
    getDetail(feedbackID) {
        return this.feedbackModel
            .findById(feedbackID)
            .exec()
            .then((result) => result || Promise.reject(`Feedback '${feedbackID}' not found`));
    }
    async update(feedbackID, newFeedback) {
        const feedback = await this.feedbackModel.findByIdAndUpdate(feedbackID, newFeedback, { new: true }).exec();
        if (!feedback) {
            throw `Feedback '${feedbackID}' not found`;
        }
        return feedback;
    }
    async delete(feedbackID) {
        const feedback = await this.feedbackModel.findByIdAndRemove(feedbackID).exec();
        if (!feedback) {
            throw `Feedback '${feedbackID}' not found`;
        }
        return feedback;
    }
    batchDelete(feedbackIDs) {
        return this.feedbackModel.deleteMany({ _id: { $in: feedbackIDs } }).exec();
    }
    async getRootFeedbackAverageEmotion() {
        const [result] = await this.feedbackModel.aggregate([
            { $match: { tid: biz_constant_1.ROOT_FEEDBACK_TID } },
            { $group: { _id: null, avgEmotion: { $avg: '$emotion' } } },
        ]);
        return Math.round(result.avgEmotion * 1000) / 1000;
    }
};
FeedbackService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, model_transformer_1.InjectModel)(feedback_model_1.Feedback)),
    __metadata("design:paramtypes", [helper_service_ip_1.IPService,
        helper_service_email_1.EmailService, Object])
], FeedbackService);
exports.FeedbackService = FeedbackService;
//# sourceMappingURL=feedback.service.js.map