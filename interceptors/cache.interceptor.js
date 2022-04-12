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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpCacheInterceptor = void 0;
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const common_1 = require("@nestjs/common");
const cache_decorator_1 = require("../decorators/cache.decorator");
const cache_service_1 = require("../processors/cache/cache.service");
const SYSTEM = __importStar(require("../constants/system.constant"));
const APP_CONFIG = __importStar(require("../app.config"));
let HttpCacheInterceptor = class HttpCacheInterceptor {
    constructor(httpAdapterHost, cacheService) {
        this.httpAdapterHost = httpAdapterHost;
        this.cacheService = cacheService;
    }
    async intercept(context, next) {
        const call$ = next.handle();
        const key = this.trackBy(context);
        if (!key) {
            return call$;
        }
        const target = context.getHandler();
        const metaTTL = (0, cache_decorator_1.getHttpCacheTTL)(target);
        const ttl = metaTTL || APP_CONFIG.APP.DEFAULT_CACHE_TTL;
        try {
            const value = await this.cacheService.get(key);
            return value ? (0, rxjs_1.of)(value) : call$.pipe((0, operators_1.tap)((response) => this.cacheService.set(key, response, { ttl })));
        }
        catch (error) {
            return call$;
        }
    }
    trackBy(context) {
        const request = context.switchToHttp().getRequest();
        const httpServer = this.httpAdapterHost.httpAdapter;
        const isHttpApp = Boolean(httpServer === null || httpServer === void 0 ? void 0 : httpServer.getRequestMethod);
        const isGetRequest = isHttpApp && httpServer.getRequestMethod(request) === common_1.RequestMethod[common_1.RequestMethod.GET];
        const cacheKey = (0, cache_decorator_1.getHttpCacheKey)(context.getHandler());
        const isMatchedCache = isHttpApp && isGetRequest && cacheKey;
        return isMatchedCache ? cacheKey : undefined;
    }
};
HttpCacheInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(SYSTEM.HTTP_ADAPTER_HOST)),
    __metadata("design:paramtypes", [Object, cache_service_1.CacheService])
], HttpCacheInterceptor);
exports.HttpCacheInterceptor = HttpCacheInterceptor;
//# sourceMappingURL=cache.interceptor.js.map