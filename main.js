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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helmet_1 = __importDefault(require("helmet"));
const passport_1 = __importDefault(require("passport"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const error_filter_1 = require("./filters/error.filter");
const transform_interceptor_1 = require("./interceptors/transform.interceptor");
const logging_interceptor_1 = require("./interceptors/logging.interceptor");
const error_interceptor_1 = require("./interceptors/error.interceptor");
const app_environment_1 = require("./app.environment");
const logger_1 = __importDefault(require("./utils/logger"));
const APP_CONFIG = __importStar(require("./app.config"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, app_environment_1.isProdEnv ? { logger: false } : {});
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.use(body_parser_1.default.json({ limit: '1mb' }));
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(passport_1.default.initialize());
    app.useGlobalFilters(new error_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor(), new error_interceptor_1.ErrorInterceptor(), new logging_interceptor_1.LoggingInterceptor());
    return await app.listen(APP_CONFIG.APP.PORT);
}
bootstrap().then(() => {
    logger_1.default.info(`NodePress is running on ${APP_CONFIG.APP.PORT}, env: ${app_environment_1.environment}.`);
});
//# sourceMappingURL=main.js.map