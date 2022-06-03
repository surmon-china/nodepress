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
exports.CacheConfigService = void 0;
const lodash_1 = __importDefault(require("lodash"));
const common_1 = require("@nestjs/common");
const helper_service_email_1 = require("../helper/helper.service.email");
const cache_store_1 = __importDefault(require("./cache.store"));
const APP_CONFIG = __importStar(require("../../app.config"));
const cache_logger_1 = require("./cache.logger");
let CacheConfigService = class CacheConfigService {
    constructor(emailService) {
        this.emailService = emailService;
        this.sendAlarmMail = lodash_1.default.throttle((error) => {
            this.emailService.sendMailAs(APP_CONFIG.APP.NAME, {
                to: APP_CONFIG.APP.ADMIN_EMAIL,
                subject: `Redis Error!`,
                text: error,
                html: `<pre><code>${error}</code></pre>`,
            });
        }, 1000 * 30);
    }
    retryStrategy(retries) {
        const errorMessage = `retryStrategy! retries: ${retries}`;
        cache_logger_1.redisLog.error(errorMessage);
        this.sendAlarmMail(errorMessage);
        if (retries > 6) {
            return new Error('Redis maximum retries!');
        }
        return Math.min(retries * 1000, 3000);
    }
    createCacheOptions() {
        const redisOptions = {
            socket: {
                host: APP_CONFIG.REDIS.host,
                port: APP_CONFIG.REDIS.port,
                reconnectStrategy: this.retryStrategy.bind(this),
            },
        };
        if (APP_CONFIG.REDIS.username) {
            redisOptions.username = APP_CONFIG.REDIS.username;
        }
        if (APP_CONFIG.REDIS.password) {
            redisOptions.password = APP_CONFIG.REDIS.password;
        }
        return {
            isGlobal: true,
            store: cache_store_1.default,
            redisOptions,
        };
    }
};
CacheConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_email_1.EmailService])
], CacheConfigService);
exports.CacheConfigService = CacheConfigService;
//# sourceMappingURL=cache.config.service.js.map