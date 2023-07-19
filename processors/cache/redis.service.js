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
exports.RedisService = void 0;
const lodash_1 = __importDefault(require("lodash"));
const redis_1 = require("redis");
const common_1 = require("@nestjs/common");
const helper_service_email_1 = require("../helper/helper.service.email");
const redis_store_1 = require("./redis.store");
const APP_CONFIG = __importStar(require("../../app.config"));
const logger_1 = __importDefault(require("../../utils/logger"));
const log = logger_1.default.scope('RedisService');
let RedisService = exports.RedisService = class RedisService {
    constructor(emailService) {
        this.emailService = emailService;
        this.sendAlarmMail = lodash_1.default.throttle((error) => {
            this.emailService.sendMailAs(APP_CONFIG.APP.NAME, {
                to: APP_CONFIG.APP.ADMIN_EMAIL,
                subject: `Redis Error!`,
                text: error,
                html: `<pre><code>${error}</code></pre>`
            });
        }, 1000 * 30);
        this.redisClient = (0, redis_1.createClient)(this.getOptions());
        this.redisStore = (0, redis_store_1.createRedisStore)(this.redisClient, APP_CONFIG.APP.DEFAULT_CACHE_TTL);
        this.redisClient.on('connect', () => log.info('connecting...'));
        this.redisClient.on('reconnecting', () => log.warn('reconnecting...'));
        this.redisClient.on('ready', () => log.info('readied (connected).'));
        this.redisClient.on('end', () => log.error('client end!'));
        this.redisClient.on('error', (error) => log.error(`client error!`, error.message));
        this.redisClient.connect();
    }
    retryStrategy(retries) {
        const errorMessage = `retryStrategy! retries: ${retries}`;
        log.error(errorMessage);
        this.sendAlarmMail(errorMessage);
        if (retries > 6) {
            return new Error('Redis maximum retries!');
        }
        return Math.min(retries * 1000, 3000);
    }
    getOptions() {
        const redisOptions = {
            socket: {
                host: APP_CONFIG.REDIS.host,
                port: APP_CONFIG.REDIS.port,
                reconnectStrategy: this.retryStrategy.bind(this)
            }
        };
        if (APP_CONFIG.REDIS.username) {
            redisOptions.username = APP_CONFIG.REDIS.username;
        }
        if (APP_CONFIG.REDIS.password) {
            redisOptions.password = APP_CONFIG.REDIS.password;
        }
        return redisOptions;
    }
    get client() {
        return this.redisClient;
    }
    get store() {
        return this.redisStore;
    }
};
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_email_1.EmailService])
], RedisService);
//# sourceMappingURL=redis.service.js.map