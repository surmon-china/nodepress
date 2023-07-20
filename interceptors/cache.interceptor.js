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
exports.CacheInterceptor = void 0;
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const cache_decorator_1 = require("../decorators/cache.decorator");
const cache_service_1 = require("../processors/cache/cache.service");
const value_constant_1 = require("../constants/value.constant");
const cache_constant_1 = require("../constants/cache.constant");
const logger_1 = __importDefault(require("../utils/logger"));
const log = logger_1.default.scope('CacheInterceptor');
let CacheInterceptor = exports.CacheInterceptor = class CacheInterceptor {
    constructor(httpAdapterHost, cacheService) {
        this.httpAdapterHost = httpAdapterHost;
        this.cacheService = cacheService;
    }
    async intercept(context, next) {
        const key = this.trackBy(context);
        if (!key) {
            return next.handle();
        }
        const target = context.getHandler();
        const ttl = (0, cache_decorator_1.getCacheTTL)(target);
        try {
            const value = await this.cacheService.get((0, cache_constant_1.getDecoratorCacheKey)(key));
            if (!(0, value_constant_1.isNil)(value)) {
                return (0, rxjs_1.of)(value);
            }
            return next.handle().pipe((0, operators_1.tap)(async (response) => {
                if (response instanceof common_1.StreamableFile) {
                    return;
                }
                try {
                    await this.cacheService.set((0, cache_constant_1.getDecoratorCacheKey)(key), response, ttl);
                }
                catch (err) {
                    log.warn(`An error has occurred when inserting "key: ${key}", "value: ${response}"`);
                }
            }));
        }
        catch (error) {
            return next.handle();
        }
    }
    trackBy(context) {
        const { httpAdapter } = this.httpAdapterHost;
        const isHttpApp = Boolean(httpAdapter === null || httpAdapter === void 0 ? void 0 : httpAdapter.getRequestMethod);
        const cacheKey = (0, cache_decorator_1.getCacheKey)(context.getHandler());
        const request = context.switchToHttp().getRequest();
        const isGetRequest = isHttpApp && httpAdapter.getRequestMethod(request) === common_1.RequestMethod[common_1.RequestMethod.GET];
        return isHttpApp && isGetRequest && cacheKey ? cacheKey : value_constant_1.UNDEFINED;
    }
};
exports.CacheInterceptor = CacheInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost,
        cache_service_1.CacheService])
], CacheInterceptor);
//# sourceMappingURL=cache.interceptor.js.map