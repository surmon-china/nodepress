"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const operators_1 = require("rxjs/operators");
const common_1 = require("@nestjs/common");
const app_environment_1 = require("../app.environment");
const logger_1 = __importDefault(require("../utils/logger"));
let LoggingInterceptor = exports.LoggingInterceptor = class LoggingInterceptor {
    intercept(context, next) {
        if (!app_environment_1.isDevEnv) {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        const content = request.method + ' -> ' + request.url;
        logger_1.default.debug('+++ req：', content);
        const now = Date.now();
        return next.handle().pipe((0, operators_1.tap)(() => logger_1.default.debug('--- res：', content, `${Date.now() - now}ms`)));
    }
};
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map