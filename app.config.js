"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOOGLE_API = exports.BING_INDEXED = exports.GOOGLE_OAUTH = exports.GITHUB_OAUTH = exports.CLOUDFLARE_AI_GATEWAY = exports.DB_BACKUP = exports.S3_STORAGE = exports.AKISMET = exports.WEBHOOK = exports.EMAIL = exports.REDIS = exports.MONGO_DB = exports.APP_AUTH = exports.APP_BIZ = exports.PROJECT = void 0;
const path_1 = __importDefault(require("path"));
const env_1 = require("./utils/env");
const arg = (0, env_1.createEnvGetter)(process.env, 'NP');
const ROOT_PATH = path_1.default.join(__dirname, '..');
const packageJSON = require(path_1.default.resolve(ROOT_PATH, 'package.json'));
exports.PROJECT = Object.freeze({
    name: packageJSON.name,
    version: packageJSON.version,
    author: packageJSON.author,
    homepage: packageJSON.homepage,
    documentation: packageJSON.documentation,
    repository: packageJSON.repository.url
});
exports.APP_BIZ = Object.freeze({
    ROOT_PATH,
    PORT: 8000,
    DEFAULT_CACHE_TTL: 0,
    PAGINATION_MAX_SIZE: 50,
    PAGINATION_DEFAULT_SIZE: 16,
    NAME: 'NodePress',
    URL: 'https://api.surmon.me',
    ADMIN_EMAIL: arg({ key: 'ADMIN_EMAIL', required: true }),
    FE_NAME: 'Surmon.me',
    FE_URL: 'https://surmon.me',
    STATIC_URL: 'https://static.surmon.me',
    CORS_ALLOWED_ORIGINS: ['https://surmon.me', /\.surmon\.me$/],
    AI_AUTHOR_NAME: arg({ key: 'AI_AUTHOR_NAME', default: 'AI Assistant' }),
    AI_AUTHOR_EMAIL: arg({ key: 'AI_AUTHOR_EMAIL', default: null })
});
exports.APP_AUTH = Object.freeze({
    adminDefaultPassword: arg({ key: 'ADMIN_DEFAULT_PASSWORD', default: 'root' }),
    adminBcryptSaltRounds: arg({ key: 'ADMIN_BCRYPT_SALT_ROUNDS', default: 10, transform: env_1.Transforms.number }),
    jwtSecret: arg({ key: 'AUTH_JWT_SECRET', default: 'nodepress-secret' }),
    jwtIssuer: arg({ key: 'AUTH_JWT_ISSUER', default: 'nodepress' }),
    jwtAudience: arg({ key: 'AUTH_JWT_AUDIENCE', default: 'nodepress-api' }),
    jwtExpiresInForAdmin: 2 * 3600,
    refreshTokenExpiresInForAdmin: 30 * 24 * 3600,
    jwtExpiresInForUser: 7 * 24 * 3600,
    refreshTokenExpiresInForUser: 60 * 24 * 3600
});
exports.MONGO_DB = Object.freeze({
    uri: arg({ key: 'MONGODB_URI', default: 'mongodb://127.0.0.1:27017/NodePress' })
});
exports.REDIS = Object.freeze({
    namespace: arg({ key: 'REDIS_NAMESPACE', default: 'nodepress' }),
    host: arg({ key: 'REDIS_HOST', default: 'localhost' }),
    port: arg({ key: 'REDIS_PORT', default: 6379, transform: env_1.Transforms.number }),
    username: arg('REDIS_USERNAME'),
    password: arg('REDIS_PASSWORD')
});
exports.EMAIL = Object.freeze({
    port: 587,
    host: arg('EMAIL_HOST'),
    account: arg({ key: 'EMAIL_ACCOUNT', required: true }),
    password: arg({ key: 'EMAIL_PASSWORD', required: true }),
    from: `"${exports.APP_BIZ.FE_NAME}" <${arg('EMAIL_FROM') || arg('EMAIL_ACCOUNT')}>`
});
exports.WEBHOOK = Object.freeze({
    endpoint: arg('WEBHOOK_ENDPOINT'),
    secret: arg('WEBHOOK_SECRET')
});
exports.AKISMET = Object.freeze({
    apiKey: arg({ key: 'AKISMET_API_KEY', required: true }),
    blog: arg({ key: 'AKISMET_BLOG', required: true })
});
exports.S3_STORAGE = Object.freeze({
    endpoint: arg({ key: 'S3_ENDPOINT', required: true }),
    accessKeyId: arg({ key: 'S3_ACCESS_KEY_ID', required: true }),
    secretAccessKey: arg({ key: 'S3_SECRET_ACCESS_KEY', required: true }),
    s3StaticFileBucket: arg({ key: 'S3_STATIC_FILE_BUCKET', required: true }),
    s3StaticFileRegion: arg({ key: 'S3_STATIC_FILE_REGION', required: true })
});
exports.DB_BACKUP = Object.freeze({
    s3Region: arg({ key: 'DB_BACKUP_S3_REGION', required: true }),
    s3Bucket: arg({ key: 'DB_BACKUP_S3_BUCKET', required: true }),
    password: arg({ key: 'DB_BACKUP_FILE_PASSWORD', required: true })
});
exports.CLOUDFLARE_AI_GATEWAY = Object.freeze({
    accountId: arg({ key: 'CF_AIG_ACCOUNT_ID', required: true }),
    gatewayId: arg({ key: 'CF_AIG_ID', required: true }),
    token: arg({ key: 'CF_AIG_TOKEN', required: true })
});
exports.GITHUB_OAUTH = Object.freeze({
    clientId: arg({ key: 'OAUTH_GITHUB_CLIENT_ID', required: true }),
    clientSecret: arg({ key: 'OAUTH_GITHUB_CLIENT_SECRET', required: true }),
    scope: 'read:user user:email'
});
exports.GOOGLE_OAUTH = Object.freeze({
    clientId: arg({ key: 'OAUTH_GOOGLE_CLIENT_ID', required: true }),
    clientSecret: arg({ key: 'OAUTH_GOOGLE_CLIENT_SECRET', required: true }),
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
});
exports.BING_INDEXED = Object.freeze({
    site: arg({ key: 'BING_SITE', required: true }),
    apiKey: arg({ key: 'BING_API_KEY', required: true })
});
exports.GOOGLE_API = Object.freeze({
    analyticsV4PropertyId: arg({ key: 'GOOGLE_ANALYTICS_V4_PROPERTY_ID', required: true }),
    jwtServiceAccountCredentials: arg({
        key: 'GOOGLE_JWT_CRED_JSON',
        transform: env_1.Transforms.json,
        required: true
    })
});
//# sourceMappingURL=app.config.js.map