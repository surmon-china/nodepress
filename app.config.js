"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOOGLE = exports.BING_INDEXED = exports.DB_BACKUP = exports.AWS = exports.DISQUS = exports.AKISMET = exports.EMAIL = exports.REDIS = exports.MONGO_DB = exports.APP_BIZ = exports.PROJECT = void 0;
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
    AUTH: {
        expiresIn: arg({ key: 'auth_expires_in', default: 3600 }),
        jwtSecret: arg({ key: 'auth_secret', default: 'nodepress' }),
        data: arg({ key: 'auth_data', default: { user: 'root' } }),
        defaultPassword: arg({ key: 'auth_default_password', default: 'root' })
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
exports.AWS = {
    accessKeyId: arg('aws_access_key_id'),
    secretAccessKey: arg('aws_secret_access_key'),
    s3StaticRegion: arg('aws_s3_static_region'),
    s3StaticBucket: arg('aws_s3_static_bucket')
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