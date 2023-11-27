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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AkismetService = exports.AkismetAction = void 0;
const akismet_api_1 = require("akismet-api");
const common_1 = require("@nestjs/common");
const value_constant_1 = require("../../constants/value.constant");
const error_transformer_1 = require("../../transformers/error.transformer");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const APP_CONFIG = __importStar(require("../../app.config"));
const logger = (0, logger_1.createLogger)({ scope: 'AkismetService', time: app_environment_1.isDevEnv });
var AkismetAction;
(function (AkismetAction) {
    AkismetAction["CheckSpam"] = "checkSpam";
    AkismetAction["SubmitSpam"] = "submitSpam";
    AkismetAction["SubmitHam"] = "submitHam";
})(AkismetAction || (exports.AkismetAction = AkismetAction = {}));
let AkismetService = class AkismetService {
    constructor() {
        this.clientIsValid = false;
        this.initClient();
        this.initVerify();
    }
    initClient() {
        this.client = new akismet_api_1.AkismetClient({
            key: APP_CONFIG.AKISMET.key,
            blog: APP_CONFIG.AKISMET.blog
        });
    }
    initVerify() {
        this.client
            .verifyKey()
            .then((valid) => (valid ? Promise.resolve(valid) : Promise.reject('Invalid Akismet key')))
            .then(() => {
            this.clientIsValid = true;
            logger.success('client init succeed.');
        })
            .catch((error) => {
            this.clientIsValid = false;
            logger.failure('client init failed!', '|', (0, error_transformer_1.getMessageFromNormalError)(error));
        });
    }
    makeInterceptor(handleType) {
        return (content) => {
            return new Promise((resolve, reject) => {
                if (!this.clientIsValid) {
                    const message = `${handleType} failed! reason: init failed`;
                    logger.warn(message);
                    return resolve(message);
                }
                logger.log(`${handleType}...`, new Date());
                this.client[handleType](Object.assign(Object.assign({}, content), { permalink: content.permalink || value_constant_1.UNDEFINED, comment_author: content.comment_author || value_constant_1.UNDEFINED, comment_author_email: content.comment_author_email || value_constant_1.UNDEFINED, comment_author_url: content.comment_author_url || value_constant_1.UNDEFINED, comment_content: content.comment_content || value_constant_1.UNDEFINED }))
                    .then((result) => {
                    if (handleType === AkismetAction.CheckSpam && result) {
                        logger.info(`${handleType} found SPAM!`, new Date(), content);
                        reject('SPAM!');
                    }
                    else {
                        logger.info(`${handleType} succeed.`);
                        resolve(result);
                    }
                })
                    .catch((error) => {
                    const message = `${handleType} failed!`;
                    logger.warn(message, error);
                    reject(message);
                });
            });
        };
    }
    checkSpam(payload) {
        return this.makeInterceptor(AkismetAction.CheckSpam)(payload);
    }
    submitSpam(payload) {
        return this.makeInterceptor(AkismetAction.SubmitSpam)(payload);
    }
    submitHam(payload) {
        return this.makeInterceptor(AkismetAction.SubmitHam)(payload);
    }
};
exports.AkismetService = AkismetService;
exports.AkismetService = AkismetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AkismetService);
//# sourceMappingURL=helper.service.akismet.js.map