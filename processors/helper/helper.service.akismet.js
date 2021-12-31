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
exports.AkismetService = exports.AkismetActionType = void 0;
const akismet_api_1 = __importDefault(require("akismet-api"));
const common_1 = require("@nestjs/common");
const error_transformer_1 = require("../../transformers/error.transformer");
const APP_CONFIG = __importStar(require("../../app.config"));
const logger_1 = __importDefault(require("../../utils/logger"));
var AkismetActionType;
(function (AkismetActionType) {
    AkismetActionType["CheckSpam"] = "checkSpam";
    AkismetActionType["SubmitSpam"] = "submitSpam";
    AkismetActionType["SubmitHam"] = "submitHam";
})(AkismetActionType = exports.AkismetActionType || (exports.AkismetActionType = {}));
let AkismetService = class AkismetService {
    constructor() {
        this.clientIsValid = false;
        this.initClient();
        this.initVerify();
    }
    initClient() {
        this.client = akismet_api_1.default.client({
            key: APP_CONFIG.AKISMET.key,
            blog: APP_CONFIG.AKISMET.blog,
        });
    }
    initVerify() {
        this.client
            .verifyKey()
            .then((valid) => (valid ? Promise.resolve(valid) : Promise.reject('Akismet Key 无效')))
            .then(() => {
            this.clientIsValid = true;
            logger_1.default.info('[Akismet]', 'key 有效，已准备好工作！');
        })
            .catch((error) => {
            this.clientIsValid = false;
            logger_1.default.error('[Akismet]', '验证失败！无法工作', (0, error_transformer_1.getMessageFromNormalError)(error));
        });
    }
    makeInterceptor(handleType) {
        return (content) => {
            return new Promise((resolve, reject) => {
                if (this.clientIsValid === false) {
                    const message = [`[Akismet]`, `verifyKey 失败，放弃 ${handleType} 操作！`];
                    logger_1.default.warn(...message);
                    return resolve(message.join(''));
                }
                logger_1.default.info(`[Akismet]`, `${handleType} 操作中...`, new Date());
                this.client[handleType](content)
                    .then((result) => {
                    if (handleType === AkismetActionType.CheckSpam && result) {
                        logger_1.default.warn(`[Akismet]`, `${handleType} 检测到 SPAM！`, new Date(), content);
                        reject('SPAM!');
                    }
                    else {
                        logger_1.default.info(`[Akismet]`, `${handleType} 操作成功！`);
                        resolve(result);
                    }
                })
                    .catch((error) => {
                    const message = [`[Akismet]`, `${handleType} 操作失败！`];
                    logger_1.default.error(...message, error);
                    reject(message.join(''));
                });
            });
        };
    }
    checkSpam(payload) {
        return this.makeInterceptor(AkismetActionType.CheckSpam)(payload);
    }
    submitSpam(payload) {
        return this.makeInterceptor(AkismetActionType.SubmitSpam)(payload);
    }
    submitHam(payload) {
        return this.makeInterceptor(AkismetActionType.SubmitHam)(payload);
    }
};
AkismetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AkismetService);
exports.AkismetService = AkismetService;
//# sourceMappingURL=helper.service.akismet.js.map