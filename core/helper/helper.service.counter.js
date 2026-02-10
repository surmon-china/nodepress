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
exports.CounterService = void 0;
const common_1 = require("@nestjs/common");
const cache_service_1 = require("../cache/cache.service");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const logger = (0, logger_1.createLogger)({ scope: 'CounterService', time: app_environment_1.isDevEnv });
let CounterService = class CounterService {
    cacheService;
    constructor(cacheService) {
        this.cacheService = cacheService;
    }
    getGlobalCount = async (key) => {
        const count = await this.cacheService.get(key);
        return count ? Number(count) : 0;
    };
    incrementGlobalCount = async (key) => {
        const count = await this.getGlobalCount(key);
        await this.cacheService.set(key, count + 1);
        return count + 1;
    };
    resetGlobalCount = (key) => {
        return this.cacheService.set(key, 0);
    };
};
exports.CounterService = CounterService;
exports.CounterService = CounterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService])
], CounterService);
//# sourceMappingURL=helper.service.counter.js.map