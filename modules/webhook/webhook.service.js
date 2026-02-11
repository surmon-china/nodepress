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
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const error_transformer_1 = require("../../transformers/error.transformer");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const app_config_1 = require("../../app.config");
const logger = (0, logger_1.createLogger)({ scope: 'WebhookService', time: app_environment_1.isDevEnv });
let WebhookService = class WebhookService {
    httpService;
    constructor(httpService) {
        this.httpService = httpService;
    }
    dispatch(event, payload) {
        if (!app_config_1.WEBHOOK.endpoint)
            return;
        const postData = {
            event,
            timestamp: Date.now(),
            data: payload
        };
        logger.log(`Dispatching event: ${event}...`);
        this.httpService.axiosRef
            .post(app_config_1.WEBHOOK.endpoint, postData, {
            timeout: 15000,
            headers: {
                'X-Webhook-Token': app_config_1.WEBHOOK.token || '',
                'User-Agent': `${app_config_1.APP_BIZ.NAME}-Webhook-Service`
            }
        })
            .then((result) => {
            logger.success(`Event ${event} dispatched successfully.`, result.data);
        })
            .catch((error) => {
            logger.failure(`Event ${event} dispatch failed!`, (0, error_transformer_1.getMessageFromAxiosError)(error));
        });
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map