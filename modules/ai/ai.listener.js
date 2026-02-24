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
exports.AiListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const events_constant_1 = require("../../constants/events.constant");
const extras_constant_1 = require("../../constants/extras.constant");
const comment_service_1 = require("../comment/comment.service");
const comment_constant_1 = require("../comment/comment.constant");
const user_constant_1 = require("../user/user.constant");
const extra_transformer_1 = require("../../transformers/extra.transformer");
const app_config_1 = require("../../app.config");
const ai_service_1 = require("./ai.service");
let AiListener = class AiListener {
    aiService;
    commentService;
    constructor(aiService, commentService) {
        this.aiService = aiService;
        this.commentService = commentService;
    }
    async handleCommentCreated(comment) {
        if (comment.parent_id !== null)
            return;
        if (comment.status !== comment_constant_1.CommentStatus.Published)
            return;
        if (comment.content.trim().length < 5)
            return;
        if ((0, extra_transformer_1.getExtraValue)(comment.extras, extras_constant_1.CommentAiGenerationExtraKeys.Flag))
            return;
        if (comment.user?.type === user_constant_1.UserType.Moderator)
            return;
        try {
            const aiResult = await this.aiService.generateCommentReply(comment);
            const aiComment = {
                target_type: comment.target_type,
                target_id: comment.target_id,
                parent_id: comment.id,
                content: aiResult.content,
                author_name: app_config_1.APP_BIZ.AI_AUTHOR_NAME,
                author_email: app_config_1.APP_BIZ.AI_AUTHOR_EMAIL,
                author_website: null
            };
            const aiCommentExtras = [
                { key: extras_constant_1.CommentAiGenerationExtraKeys.Flag, value: 'true' },
                { key: extras_constant_1.CommentAiGenerationExtraKeys.Model, value: aiResult.model },
                { key: extras_constant_1.CommentAiGenerationExtraKeys.Provider, value: aiResult.provider }
            ];
            const aiVisitor = {
                ip: null,
                agent: null,
                origin: null,
                referer: null
            };
            const createdComment = await this.commentService.create(this.commentService.normalize(aiComment, {
                visitor: aiVisitor,
                extras: aiCommentExtras
            }));
            ai_service_1.logger.success('AI auto-reply comment succeeded.', createdComment.id);
        }
        catch (error) {
            ai_service_1.logger.error('AI auto-reply comment failed!', error);
        }
    }
};
exports.AiListener = AiListener;
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.CommentCreated, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiListener.prototype, "handleCommentCreated", null);
exports.AiListener = AiListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        comment_service_1.CommentService])
], AiListener);
//# sourceMappingURL=ai.listener.js.map