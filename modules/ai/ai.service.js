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
exports.AiService = exports.logger = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const options_service_1 = require("../options/options.service");
const article_service_1 = require("../article/article.service");
const biz_constant_1 = require("../../constants/biz.constant");
const extras_constant_1 = require("../../constants/extras.constant");
const error_transformer_1 = require("../../transformers/error.transformer");
const extra_transformer_1 = require("../../transformers/extra.transformer");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const app_config_1 = require("../../app.config");
const ai_config_1 = require("./ai.config");
exports.logger = (0, logger_1.createLogger)({ scope: 'AIService', time: app_environment_1.isDevEnv });
let AiService = class AiService {
    httpService;
    optionsService;
    articleService;
    constructor(httpService, optionsService, articleService) {
        this.httpService = httpService;
        this.optionsService = optionsService;
        this.articleService = articleService;
    }
    requestAiGateway(options) {
        const { accountId, gatewayId, token } = app_config_1.CLOUDFLARE_AI_GATEWAY;
        const url = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/compat/chat/completions`;
        const requestParams = {
            stream: false,
            model: options.model,
            temperature: options.temperature,
            messages: [{ role: 'user', content: options.prompt }]
        };
        return this.httpService.axiosRef
            .post(url, requestParams, {
            headers: {
                'cf-aig-authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => ({
            provider: ai_config_1.AiModelsMap.get(options.model).provider,
            model: ai_config_1.AiModelsMap.get(options.model).model,
            content: response.data?.choices?.[0]?.message?.content
        }))
            .catch((error) => {
            const errorInfos = error.response?.data?.error;
            const errorObject = Array.isArray(errorInfos) ? errorInfos[0] : errorInfos;
            const errorMessage = (0, error_transformer_1.getMessageFromAxiosError)(errorObject ?? error);
            exports.logger.error(`AI Gateway Error: ${errorMessage}`);
            return Promise.reject(errorMessage);
        });
    }
    renderTemplate(template, data) {
        return template.replace(/{{(\w+)}}/g, (_, key) => data[key] || '');
    }
    async generateArticleSummary({ model, prompt, article_id }) {
        const article = await this.articleService.getDetailByNumberIdOrSlug({ numberId: article_id, lean: true });
        const promptTemplate = prompt ?? ai_config_1.DEFAULT_AI_PROMPT_TEMPLATES.articleSummary;
        const finalPrompt = this.renderTemplate(promptTemplate, { article: article.content });
        return await this.requestAiGateway({
            prompt: finalPrompt,
            model: model ?? ai_config_1.AiModelIds.DeepSeekChat,
            temperature: 0.4
        });
    }
    async generateArticleReview({ model, prompt, article_id }) {
        const article = await this.articleService.getDetailByNumberIdOrSlug({ numberId: article_id, lean: true });
        const promptTemplate = prompt ?? ai_config_1.DEFAULT_AI_PROMPT_TEMPLATES.articleReview;
        const finalPrompt = this.renderTemplate(promptTemplate, { article: article.content });
        return await this.requestAiGateway({
            prompt: finalPrompt,
            model: model ?? ai_config_1.AiModelIds.DeepSeekChat,
            temperature: 1.4
        });
    }
    async generateCommentReply(comment, payload) {
        let contextInfo = 'nil';
        if (comment.post_id === biz_constant_1.GUESTBOOK_POST_ID) {
            const options = await this.optionsService.ensureAppOptions();
            contextInfo = [
                `This message is from the blog's general guestbook.`,
                `The following is the blogger's "Statement & FAQ". You may extract relevant information from it IF the user's comment requires specific answers. Otherwise, feel free to ignore this section and respond naturally:`,
                `"""`,
                options.statement,
                `"""`
            ].join('\n');
        }
        else {
            const article = await this.articleService.getDetailByNumberIdOrSlug({
                numberId: comment.post_id,
                lean: true
            });
            contextInfo = [
                `Article Title: ${article.title}`,
                `Article Summary: ${(0, extra_transformer_1.getExtraValue)(article.extras, extras_constant_1.ArticleAiSummaryExtraKeys.Content) || article.content.substring(0, 800)}`
            ].join('\n');
        }
        const promptTemplate = payload?.prompt ?? ai_config_1.DEFAULT_AI_PROMPT_TEMPLATES.commentReply;
        const finalPrompt = this.renderTemplate(promptTemplate, {
            context: contextInfo,
            comment: comment.content
        });
        return await this.requestAiGateway({
            model: payload?.model ?? ai_config_1.AiModelIds.Gemini25Flash,
            prompt: finalPrompt,
            temperature: 0.8
        });
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        options_service_1.OptionsService,
        article_service_1.ArticleService])
], AiService);
//# sourceMappingURL=ai.service.js.map