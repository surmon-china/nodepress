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
const cache_logger_1 = require("./cache.logger");
let CacheService = class CacheService {
    constructor(cacheManager) {
        this.isReadied = false;
        this.cacheStore = cacheManager.store;
        this.cacheStore.client.on('connect', () => {
            cache_logger_1.redisLog.info('connecting...');
        });
        this.cacheStore.client.on('reconnecting', () => {
            cache_logger_1.redisLog.warn('reconnecting...');
        });
        this.cacheStore.client.on('ready', () => {
            this.isReadied = true;
            cache_logger_1.redisLog.info('readied.');
        });
        this.cacheStore.client.on('end', () => {
            this.isReadied = false;
            cache_logger_1.redisLog.error('client end!');
        });
        this.cacheStore.client.on('error', (error) => {
            this.isReadied = false;
            cache_logger_1.redisLog.error(`client error!`, error.message);
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
                    cache_logger_1.cacheLog.warn(`timeout task failed! retry when after ${time / 1000}s,`, error);
                });
            };
            doPromise();
        }
        if (timing) {
            const doPromise = () => {
                promiseTask()
                    .then((data) => data)
                    .catch((error) => {
                    cache_logger_1.cacheLog.warn(`timing task failed! retry when after ${timing.error / 1000}s,`, error);
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