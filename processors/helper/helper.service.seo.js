"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeoService = exports.SeoAction = void 0;
const APP_CONFIG = __importStar(require("../../app.config"));
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const error_transformer_1 = require("../../transformers/error.transformer");
const helper_service_google_1 = require("./helper.service.google");
const logger_1 = __importDefault(require("../../utils/logger"));
var SeoAction;
(function (SeoAction) {
    SeoAction["Push"] = "push";
    SeoAction["Update"] = "update";
    SeoAction["Delete"] = "delete";
})(SeoAction = exports.SeoAction || (exports.SeoAction = {}));
const ActionNameMap = {
    [SeoAction.Push]: '提交',
    [SeoAction.Update]: '更新',
    [SeoAction.Delete]: '删除',
};
let SeoService = class SeoService {
    constructor(httpService, googleService) {
        this.httpService = httpService;
        this.googleService = googleService;
    }
    pingBaidu(action, urls) {
        const urlKeyMap = {
            [SeoAction.Push]: 'urls',
            [SeoAction.Update]: 'update',
            [SeoAction.Delete]: 'del',
        };
        const urlKey = urlKeyMap[action];
        const actionText = `百度 ping [${ActionNameMap[action]}] 操作`;
        this.httpService.axiosRef
            .request({
            method: 'post',
            data: urls.join('\n'),
            headers: { 'Content-Type': 'text/plain' },
            url: `http://data.zz.baidu.com/${urlKey}?site=${APP_CONFIG.BAIDU_INDEXED.site}&token=${APP_CONFIG.BAIDU_INDEXED.token}`,
        })
            .then((response) => {
            logger_1.default.info(`[SEO]`, `${actionText}成功：`, urls, response.statusText);
        })
            .catch((error) => {
            logger_1.default.warn(`[SEO]`, `${actionText}失败：`, (0, error_transformer_1.getMessageFromAxiosError)(error));
        });
    }
    pingGoogle(action, urls) {
        const pingActionMap = {
            [SeoAction.Push]: 'URL_UPDATED',
            [SeoAction.Update]: 'URL_UPDATED',
            [SeoAction.Delete]: 'URL_DELETED',
        };
        const [url] = urls;
        const type = pingActionMap[action];
        const actionText = `Google ping [${ActionNameMap[action]}] 操作`;
        this.googleService
            .getCredentials()
            .then((credentials) => {
            return this.httpService.axiosRef
                .request({
                method: 'post',
                data: { url, type },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: ' Bearer ' + credentials.access_token,
                },
                url: `https://indexing.googleapis.com/v3/urlNotifications:publish`,
            })
                .then((response) => {
                logger_1.default.info(`[SEO]`, `${actionText}成功：`, url, response.statusText);
            })
                .catch((error) => Promise.reject((0, error_transformer_1.getMessageFromAxiosError)(error)));
        })
            .catch((error) => {
            logger_1.default.warn(`[SEO]`, `${actionText}失败：`, error);
        });
    }
    humanizedUrl(url) {
        return typeof url === 'string' ? [url] : url;
    }
    push(url) {
        const urls = this.humanizedUrl(url);
        this.pingBaidu(SeoAction.Push, urls);
        this.pingGoogle(SeoAction.Push, urls);
    }
    update(url) {
        const urls = this.humanizedUrl(url);
        this.pingBaidu(SeoAction.Update, urls);
        this.pingGoogle(SeoAction.Update, urls);
    }
    delete(url) {
        const urls = this.humanizedUrl(url);
        this.pingBaidu(SeoAction.Delete, urls);
        this.pingGoogle(SeoAction.Delete, urls);
    }
};
SeoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService, helper_service_google_1.GoogleService])
], SeoService);
exports.SeoService = SeoService;
//# sourceMappingURL=helper.service.seo.js.map