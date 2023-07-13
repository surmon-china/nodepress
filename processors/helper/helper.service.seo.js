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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeoService = exports.SEOAction = void 0;
const APP_CONFIG = __importStar(require("../../app.config"));
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const error_transformer_1 = require("../../transformers/error.transformer");
const helper_service_google_1 = require("./helper.service.google");
const logger_1 = __importDefault(require("../../utils/logger"));
const log = logger_1.default.scope('SeoService');
var SEOAction;
(function (SEOAction) {
    SEOAction["Push"] = "push";
    SEOAction["Update"] = "update";
    SEOAction["Delete"] = "delete";
})(SEOAction || (exports.SEOAction = SEOAction = {}));
let SeoService = exports.SeoService = class SeoService {
    constructor(httpService, googleService) {
        this.httpService = httpService;
        this.googleService = googleService;
    }
    pingGoogle(action, urls) {
        const pingActionMap = {
            [SEOAction.Push]: 'URL_UPDATED',
            [SEOAction.Update]: 'URL_UPDATED',
            [SEOAction.Delete]: 'URL_DELETED'
        };
        const [url] = urls;
        const type = pingActionMap[action];
        const actionText = `Google ping [${action}] action`;
        this.googleService
            .getCredentials()
            .then((credentials) => {
            return this.httpService.axiosRef
                .request({
                method: 'post',
                url: `https://indexing.googleapis.com/v3/urlNotifications:publish`,
                data: { url, type },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${credentials.access_token}`
                }
            })
                .then((response) => log.info(`${actionText} succeed.`, url, response.statusText))
                .catch((error) => Promise.reject((0, error_transformer_1.getMessageFromAxiosError)(error)));
        })
            .catch((error) => log.warn(`${actionText} failed!`, error));
    }
    pingBing(urls) {
        this.httpService.axiosRef
            .request({
            method: 'post',
            url: `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${APP_CONFIG.BING_INDEXED.apiKey}`,
            headers: { 'Content-Type': 'application/json' },
            data: {
                siteUrl: APP_CONFIG.BING_INDEXED.site,
                urlList: urls
            }
        })
            .then((response) => {
            log.info(`Bing ping action succeed.`, urls, response.statusText);
        })
            .catch((error) => {
            log.warn(`Bing ping action failed!`, (0, error_transformer_1.getMessageFromAxiosError)(error));
        });
    }
    pingBaidu(action, urls) {
        this.httpService.axiosRef
            .request({
            method: 'post',
            data: urls.join('\n'),
            headers: { 'Content-Type': 'text/plain' },
            url: `http://data.zz.baidu.com/urls?site=${APP_CONFIG.BAIDU_INDEXED.site}&token=${APP_CONFIG.BAIDU_INDEXED.token}`
        })
            .then((response) => {
            log.info(`Baidu ping [${action}] succeed.`, urls, response.statusText);
        })
            .catch((error) => {
            log.warn(`Baidu ping [${action}] failed!`, (0, error_transformer_1.getMessageFromAxiosError)(error));
        });
    }
    humanizedUrl(url) {
        return typeof url === 'string' ? [url] : url;
    }
    push(url) {
        const urls = this.humanizedUrl(url);
        this.pingGoogle(SEOAction.Push, urls);
        this.pingBaidu(SEOAction.Push, urls);
        this.pingBing(urls);
    }
    update(url) {
        const urls = this.humanizedUrl(url);
        this.pingBaidu(SEOAction.Update, urls);
        this.pingGoogle(SEOAction.Update, urls);
        this.pingBing(urls);
    }
    delete(url) {
        const urls = this.humanizedUrl(url);
        this.pingBaidu(SEOAction.Delete, urls);
        this.pingGoogle(SEOAction.Delete, urls);
        this.pingBing(urls);
    }
};
exports.SeoService = SeoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        helper_service_google_1.GoogleService])
], SeoService);
//# sourceMappingURL=helper.service.seo.js.map