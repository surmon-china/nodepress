"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOOGLE_API = exports.BING_INDEXED = exports.GOOGLE_OAUTH = exports.GITHUB_OAUTH = exports.CLOUDFLARE_AI_GATEWAY = exports.DB_BACKUP = exports.S3_STORAGE = exports.AKISMET = exports.WEBHOOK = exports.EMAIL = exports.REDIS = exports.MONGO_DB = exports.APP_AUTH = exports.APP_BIZ = exports.PROJECT = void 0;
const path_1 = __importDefault(require("path"));
const args_1 = require("./utils/args");
const argvs = process.argv.slice(2);
const args = (0, args_1.parseArgv)(argvs);
const arg = (0, args_1.parseArgs)(args);
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
    NAME: 'NodePress',
    URL: 'https://api.surmon.me',
    ADMIN_EMAIL: arg({ key: 'admin_email' }),
    FE_NAME: 'Surmon.me',
    FE_URL: 'https://surmon.me',
    STATIC_URL: 'https://static.surmon.me',
    CORS_ALLOWED_ORIGINS: ['https://surmon.me', /\.surmon\.me$/],
    AI_AUTHOR_NAME: arg({ key: 'ai_author_name', default: 'AI Assistant' }),
    AI_AUTHOR_EMAIL: arg({ key: 'ai_author_email' })
});
exports.APP_AUTH = Object.freeze({
    adminDefaultPassword: arg({ key: 'admin_default_password', default: 'root' }),
    adminBcryptSaltRounds: arg({ key: 'admin_bcrypt_salt_rounds', default: 10 }),
    jwtSecret: arg({ key: 'auth_jwt_secret', default: 'nodepress-secret' }),
    jwtIssuer: arg({ key: 'auth_jwt_issuer', default: 'nodepress' }),
    jwtAudience: arg({ key: 'auth_jwt_audience', default: 'nodepress-api' }),
    jwtExpiresInForAdmin: 2 * 3600,
    jwtExpiresInForUser: 7 * 24 * 3600
});
exports.MONGO_DB = Object.freeze({
    uri: arg({ key: 'mongodb_uri', default: 'mongodb://127.0.0.1:27017/NodePress' })
});
exports.REDIS = Object.freeze({
    namespace: arg({ key: 'redis_namespace', default: 'nodepress' }),
    host: arg({ key: 'redis_host', default: 'localhost' }),
    port: arg({ key: 'redis_port', default: 6379 }),
    username: arg('redis_username'),
    password: arg('redis_password')
});
exports.EMAIL = Object.freeze({
    port: 587,
    host: arg('email_host'),
    account: arg('email_account'),
    password: arg('email_password'),
    from: `"${exports.APP_BIZ.FE_NAME}" <${arg('email_from') || arg('email_account')}>`
});
exports.WEBHOOK = Object.freeze({
    endpoint: arg('webhook_endpoint'),
    token: arg('webhook_token')
});
exports.AKISMET = Object.freeze({
    apiKey: arg('akismet_api_key'),
    blog: arg('akismet_blog')
});
exports.S3_STORAGE = Object.freeze({
    endpoint: arg('s3_endpoint'),
    accessKeyId: arg('s3_access_key_id'),
    secretAccessKey: arg('s3_secret_access_key'),
    s3StaticFileBucket: arg('s3_static_file_bucket'),
    s3StaticFileRegion: arg('s3_static_file_region')
});
exports.DB_BACKUP = Object.freeze({
    s3Region: arg('db_backup_s3_region'),
    s3Bucket: arg('db_backup_s3_bucket'),
    password: arg('db_backup_file_password')
});
exports.CLOUDFLARE_AI_GATEWAY = Object.freeze({
    accountId: arg('cf_aig_account_id'),
    gatewayId: arg('cf_aig_id'),
    token: arg('cf_aig_token')
});
exports.GITHUB_OAUTH = Object.freeze({
    clientId: arg('oauth_github_client_id'),
    clientSecret: arg('oauth_github_client_secret'),
    scope: 'read:user user:email'
});
exports.GOOGLE_OAUTH = Object.freeze({
    clientId: arg('oauth_google_client_id'),
    clientSecret: arg('oauth_google_client_secret'),
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
});
exports.BING_INDEXED = Object.freeze({
    site: arg('bing_site'),
    apiKey: arg('bing_api_key')
});
exports.GOOGLE_API = Object.freeze({
    analyticsV4PropertyId: arg('google_analytics_v4_property_id'),
    jwtServiceAccountCredentials: args.google_jwt_cred_json ? JSON.parse(args.google_jwt_cred_json) : null
});
//# sourceMappingURL=app.config.js.map