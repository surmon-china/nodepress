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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
const common_1 = require("@nestjs/common");
const logger_1 = __importDefault(require("../../utils/logger"));
let CacheService = class CacheService {
    constructor(cacheManager) {
        this.isReadied = false;
        this.cacheStore = cacheManager.store;
        this.cacheStore.client.on('connect', () => {
            logger_1.default.info('[Redis]', 'connecting...');
        });
        this.cacheStore.client.on('reconnecting', () => {
            logger_1.default.warn('[Redis]', 'reconnecting...');
        });
        this.cacheStore.client.on('ready', () => {
            this.isReadied = true;
            logger_1.default.info('[Redis]', 'readied!');
        });
        this.cacheStore.client.on('end', () => {
            this.isReadied = false;
            logger_1.default.error('[Redis]', 'Client End!');
        });
        this.cacheStore.client.on('error', (error) => {
            this.isReadied = false;
            logger_1.default.error('[Redis]', `Client Error!`, error.message);
        });
        this.cacheStore.client.connect();
    }
    get(key) {
        if (!this.isReadied) {
            return Promise.reject('Redis has not ready!');
        }
        return this.cacheStore.get(key);
    }
    delete(key) {
        if (!this.isReadied) {
            return Promise.reject('Redis has not ready!');
        }
        return this.cacheStore.del(key);
    }
    set(key, value, options) {
        if (!this.isReadied) {
            return Promise.reject('Redis has not ready!');
        }
        return this.cacheStore.set(key, value, options);
    }
    promise(options) {
        const { key, promise, ioMode = false } = options;
        const doPromiseTask = async () => {
            const data = await promise();
            await this.set(key, data);
            return data;
        };
        const handlePromiseMode = async () => {
            const value = await this.get(key);
            return value !== null && value !== undefined ? value : await doPromiseTask();
        };
        const handleIoMode = () => ({
            get: handlePromiseMode,
            update: doPromiseTask,
        });
        return ioMode ? handleIoMode() : handlePromiseMode();
    }
    interval(options) {
        const { key, promise, timeout, timing, ioMode = false } = options;
        const promiseTask = async () => {
            const data = await promise();
            await this.set(key, data);
            return data;
        };
        if (timeout) {
            const doPromise = () => {
                promiseTask()
                    .then(() => {
                    setTimeout(doPromise, timeout.success);
                })
                    .catch((error) => {
                    const time = timeout.error || timeout.success;
                    setTimeout(doPromise, time);
                    logger_1.default.warn('[Redis]', `超时任务执行失败，${time / 1000}s 后重试`, error);
                });
            };
            doPromise();
        }
        if (timing) {
            const doPromise = () => {
                promiseTask()
                    .then((data) => data)
                    .catch((error) => {
                    logger_1.default.warn('[Redis]', `定时任务执行失败，${timing.error / 1000}s 后重试`, error);
                    setTimeout(doPromise, timing.error);
                });
            };
            doPromise();
            node_schedule_1.default.scheduleJob(timing.schedule, doPromise);
        }
        const getKeyCache = () => this.get(key);
        const handleIoMode = () => ({
            get: getKeyCache,
            update: promiseTask,
        });
        return ioMode ? handleIoMode() : getKeyCache;
    }
};
CacheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], CacheService);
exports.CacheService = CacheService;
//# sourceMappingURL=cache.service.js.map