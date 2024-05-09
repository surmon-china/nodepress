"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const operators_1 = require("rxjs/operators");
const common_1 = require("@nestjs/common");
const app_environment_1 = require("../app.environment");
const logger_1 = require("../utils/logger");
const logger = (0, logger_1.createLogger)({ scope: 'LoggingInterceptor', time: app_environment_1.isDevEnv });
let LoggingInterceptor = class LoggingInterceptor {
    intercept(context, next) {
        if (!app_environment_1.isDevEnv) {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        const content = request.method.padStart(6, '_') + ' -> ' + request.url;
        logger.debug('+++ REQ:', content);
        const now = Date.now();
        return next.handle().pipe((0, operators_1.tap)(() => logger.debug('--- RES:', content, '|', `${Date.now() - now}ms`)));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map