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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const biz_constant_1 = require("../../constants/biz.constant");
const value_constant_1 = require("../../constants/value.constant");
const helper_service_ip_1 = require("../../processors/helper/helper.service.ip");
const app_environment_1 = require("../../app.environment");
const feedback_model_1 = require("./feedback.model");
let FeedbackService = exports.FeedbackService = class FeedbackService {
    constructor(ipService, feedbackModel) {
        this.ipService = ipService;
        this.feedbackModel = feedbackModel;
    }
    paginator(query, options) {
        return this.feedbackModel.paginate(query, options);
    }
    async create(feedback, visitor) {
        return this.feedbackModel.create(Object.assign(Object.assign({}, feedback), { origin: visitor.origin, user_agent: visitor.ua, ip: visitor.ip, ip_location: app_environment_1.isProdEnv && visitor.ip ? await this.ipService.queryLocation(visitor.ip) : null }));
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
            { $group: { _id: null, avgEmotion: { $avg: '$emotion' } } }
        ]);
        return result ? Math.round(result.avgEmotion * 1000) / 1000 : value_constant_1.NULL;
    }
};
exports.FeedbackService = FeedbackService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, model_transformer_1.InjectModel)(feedback_model_1.Feedback)),
    __metadata("design:paramtypes", [helper_service_ip_1.IPService, Object])
], FeedbackService);
//# sourceMappingURL=feedback.service.js.map