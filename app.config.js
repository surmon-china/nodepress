"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_BACKUP = exports.AWS = exports.GOOGLE = exports.BAIDU_INDEXED = exports.AKISMET = exports.DISQUS = exports.EMAIL = exports.AUTH = exports.REDIS = exports.MONGO_DB = exports.CROSS_DOMAIN = exports.PROJECT = exports.APP = void 0;
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs"));
const argv = yargs_1.default.argv;
const ROOT_PATH = path_1.default.join(__dirname, '..');
const packageJSON = require(path_1.default.resolve(ROOT_PATH, 'package.json'));
exports.APP = {
    PORT: 8000,
    ROOT_PATH,
    DEFAULT_CACHE_TTL: 60 * 60 * 24,
    MASTER: 'Surmon',
    NAME: 'NodePress',
    URL: 'https://api.surmon.me',
    ADMIN_EMAIL: argv.admin_email || 'admin email, e.g. admin@example.com',
    FE_NAME: 'Surmon.me',
    FE_URL: 'https://surmon.me',
    STATIC_URL: 'https://static.surmon.me',
};
exports.PROJECT = {
    name: packageJSON.name,
    version: packageJSON.version,
    author: packageJSON.author,
    homepage: packageJSON.homepage,
    documentation: packageJSON.documentation,
    repository: packageJSON.repository.url,
};
exports.CROSS_DOMAIN = {
    allowedOrigins: ['https://surmon.me', 'https://cdn.surmon.me', 'https://admin.surmon.me'],
    allowedReferer: 'surmon.me',
};
exports.MONGO_DB = {
    uri: argv.db_uri || `mongodb://127.0.0.1:27017/NodePress`,
};
exports.REDIS = {
    host: argv.redis_host || 'localhost',
    port: argv.redis_port || 6379,
    username: argv.redis_username || null,
    password: argv.redis_password || null,
};
exports.AUTH = {
    expiresIn: argv.auth_expires_in || 3600,
    data: argv.auth_data || { user: 'root' },
    jwtSecret: argv.auth_key || 'nodepress',
    defaultPassword: argv.auth_default_password || 'root',
};
exports.EMAIL = {
    port: 587,
    host: argv.email_host || 'your email host, e.g. smtp.qq.com',
    account: argv.email_account || 'your email address, e.g. admin@example.me',
    password: argv.email_password || 'your email password',
    from: `"${exports.APP.FE_NAME}" <${argv.email_from || argv.email_account}>`,
};
exports.DISQUS = {
    adminAccessToken: argv.disqus_admin_access_token || 'Disqus admin access_token',
    adminUsername: argv.disqus_admin_username || 'Disqus admin username',
    forum: argv.disqus_forum_shortname || 'Disqus forum shortname',
    publicKey: argv.disqus_public_key || 'Disqus application public_key',
    secretKey: argv.disqus_secret_key || 'Disqus application secret_key',
};
exports.AKISMET = {
    key: argv.akismet_key || 'your Akismet Key',
    blog: argv.akismet_blog || 'your Akismet blog site, e.g. https://surmon.me',
};
exports.BAIDU_INDEXED = {
    site: argv.baidu_site || 'your baidu site domain. e.g. https://surmon.me',
    token: argv.baidu_token || 'your baidu seo push token',
};
exports.GOOGLE = {
    jwtServiceAccountCredentials: argv.google_jwt_cred_json ? JSON.parse(argv.google_jwt_cred_json) : null,
};
exports.AWS = {
    accessKeyId: argv.aws_access_key_id,
    secretAccessKey: argv.aws_secret_access_key,
    s3StaticRegion: argv.aws_s3_static_region,
    s3StaticBucket: argv.aws_s3_static_bucket,
};
exports.DB_BACKUP = {
    s3Region: argv.db_backup_s3_region,
    s3Bucket: argv.db_backup_s3_bucket,
    password: argv.db_backup_file_password,
};
//# sourceMappingURL=app.config.js.map