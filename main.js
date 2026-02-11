"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_1 = __importDefault(require("@fastify/cookie"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const transform_interceptor_1 = require("./interceptors/transform.interceptor");
const logging_interceptor_1 = require("./interceptors/logging.interceptor");
const exception_filter_1 = require("./filters/exception.filter");
const validation_pipe_1 = require("./pipes/validation.pipe");
const auth_service_1 = require("./core/auth/auth.service");
const app_environment_1 = require("./app.environment");
const app_module_1 = require("./app.module");
const app_config_1 = require("./app.config");
const logger_1 = __importDefault(require("./utils/logger"));
async function bootstrap() {
    const adapter = new platform_fastify_1.FastifyAdapter({ logger: false, trustProxy: true });
    const app = await core_1.NestFactory.create(app_module_1.AppModule, adapter, {
        logger: ['fatal', 'error', 'warn']
    });
    await app.register(cookie_1.default);
    await app.register(multipart_1.default, { limits: { fileSize: 1024 * 1024 * 20 }, throwFileSizeLimit: true });
    const authService = app.get(auth_service_1.AuthService);
    const fastify = app.getHttpAdapter().getInstance();
    fastify.addHook('onRequest', async (request) => {
        const token = authService.extractTokenFromAuthorization(request.headers.authorization);
        const isAuthenticated = Boolean(token && (await authService.verifyToken(token)));
        request.locals ??= {};
        request.locals.token = token;
        request.locals.isAuthenticated = isAuthenticated;
        request.locals.isUnauthenticated = !isAuthenticated;
    });
    app.enableCors({
        origin: app_environment_1.isDevEnv ? true : app_config_1.APP_BIZ.CORS_ALLOWED_ORIGINS,
        preflight: true,
        credentials: true,
        maxAge: 600,
        methods: ['HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    });
    app.useGlobalPipes(new validation_pipe_1.ValidationPipe());
    app.useGlobalFilters(new exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    if (app_environment_1.isDevEnv)
        app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    return await app.listen(app_config_1.APP_BIZ.PORT);
}
bootstrap().then((server) => {
    logger_1.default.success(`${app_config_1.APP_BIZ.NAME} app is running!`, `| env: ${app_environment_1.environment}`, `| at: ${JSON.stringify(server.address())}`);
});
//# sourceMappingURL=main.js.map