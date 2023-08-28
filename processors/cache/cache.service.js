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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
const common_1 = require("@nestjs/common");
const value_constant_1 = require("../../constants/value.constant");
const redis_service_1 = require("./redis.service");
const logger_1 = __importDefault(require("../../utils/logger"));
const log = logger_1.default.scope('CacheService');
let CacheService = class CacheService {
    constructor(redisService) {
        this.redisService = redisService;
    }
    set(key, value, ttl) {
        return this.redisService.store.set(key, value, ttl);
    }
    get(key) {
        return this.redisService.store.get(key);
    }
    delete(key) {
        return this.redisService.store.delete(key);
    }
    async execPromise(options) {
        const data = await options.promise();
        await this.set(options.key, data);
        return data;
    }
    async once(options) {
        const data = await this.get(options.key);
        return (0, value_constant_1.isNil)(data) ? await this.execPromise(options) : data;
    }
    manual(options) {
        return {
            get: () => this.once(options),
            update: () => this.execPromise(options)
        };
    }
    interval(options) {
        const execIntervalTask = () => {
            this.execPromise(options)
                .then(() => {
                setTimeout(execIntervalTask, options.interval);
            })
                .catch((error) => {
                setTimeout(execIntervalTask, options.retry);
                log.warn(`interval task failed! retry when after ${options.retry / 1000}s,`, error);
            });
        };
        execIntervalTask();
        return () => this.get(options.key);
    }
    schedule(options) {
        const execScheduleTask = () => {
            this.execPromise(options).catch((error) => {
                log.warn(`schedule task failed! retry when after ${options.retry / 1000}s,`, error);
                setTimeout(execScheduleTask, options.retry);
            });
        };
        execScheduleTask();
        node_schedule_1.default.scheduleJob(options.schedule, execScheduleTask);
        return () => this.get(options.key);
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], CacheService);
//# sourceMappingURL=cache.service.js.map