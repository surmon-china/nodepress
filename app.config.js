"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOOGLE = exports.BING_INDEXED = exports.DB_BACKUP = exports.S3_STORAGE = exports.DISQUS = exports.AKISMET = exports.EMAIL = exports.REDIS = exports.MONGO_DB = exports.APP_BIZ = exports.PROJECT = void 0;
const path_1 = __importDefault(require("path"));
const args_1 = require("./utils/args");
const argvs = process.argv.slice(2);
const args = (0, args_1.parseArgv)(argvs);
const arg = (0, args_1.parseArgs)(args);
const ROOT_PATH = path_1.default.join(__dirname, '..');
const packageJSON = require(path_1.default.resolve(ROOT_PATH, 'package.json'));
exports.PROJECT = {
    name: packageJSON.name,
    version: packageJSON.version,
    author: packageJSON.author,
    homepage: packageJSON.homepage,
    documentation: packageJSON.documentation,
    repository: packageJSON.repository.url
};
exports.APP_BIZ = {
    ROOT_PATH,
    PORT: 8000,
    DEFAULT_CACHE_TTL: 0,
    NAME: 'NodePress',
    URL: 'https://api.surmon.me',
    ADMIN_EMAIL: arg({ key: 'admin_email' }),
    FE_NAME: 'Surmon.me',
    FE_URL: 'https://surmon.me',
    STATIC_URL: 'https://static.surmon.me',
    CORS_ALLOWED_ORIGINS: ['https://surmon.me', /\.surmon\.me$/],
    PASSWORD: {
        defaultPassword: arg({ key: 'default_password', default: 'root' }),
        bcryptSaltRounds: arg({ key: 'bcrypt_salt_rounds', default: 10 })
    },
    AUTH_JWT: {
        expiresIn: arg({ key: 'auth_jwt_expires_in', default: 3600 }),
        secret: arg({ key: 'auth_jwt_secret', default: 'nodepress' }),
        data: arg({ key: 'auth_jwt_data', default: { user: 'root' } })
    }
};
exports.MONGO_DB = {
    uri: arg({ key: 'db_uri', default: 'mongodb://127.0.0.1:27017/NodePress' })
};
exports.REDIS = {
    namespace: arg({ key: 'redis_namespace', default: 'nodepress' }),
    host: arg({ key: 'redis_host', default: 'localhost' }),
    port: arg({ key: 'redis_port', default: 6379 }),
    username: arg('redis_username'),
    password: arg('redis_password')
};
exports.EMAIL = {
    port: 587,
    host: arg('email_host'),
    account: arg('email_account'),
    password: arg('email_password'),
    from: `"${exports.APP_BIZ.FE_NAME}" <${arg('email_from') || arg('email_account')}>`
};
exports.AKISMET = {
    key: arg('akismet_key'),
    blog: arg('akismet_blog')
};
exports.DISQUS = {
    adminAccessToken: arg('disqus_admin_access_token'),
    adminUsername: arg('disqus_admin_username'),
    forum: arg('disqus_forum_shortname'),
    publicKey: arg('disqus_public_key'),
    secretKey: arg('disqus_secret_key')
};
exports.S3_STORAGE = {
    s3Endpoint: arg('s3_endpoint'),
    accessKeyId: arg('s3_access_key_id'),
    secretAccessKey: arg('s3_secret_access_key'),
    s3StaticFileRegion: arg('s3_static_file_region'),
    s3StaticFileBucket: arg('s3_static_file_bucket')
};
exports.DB_BACKUP = {
    s3Region: arg('db_backup_s3_region'),
    s3Bucket: arg('db_backup_s3_bucket'),
    password: arg('db_backup_file_password')
};
exports.BING_INDEXED = {
    site: arg('bing_site'),
    apiKey: arg('bing_api_key')
};
exports.GOOGLE = {
    analyticsV4PropertyId: arg('google_analytics_v4_property_id'),
    jwtServiceAccountCredentials: args.google_jwt_cred_json ? JSON.parse(args.google_jwt_cred_json) : null
};
//# sourceMappingURL=app.config.js.map