"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_BACKUP = exports.AWS = exports.GOOGLE = exports.BAIDU_INDEXED = exports.AKISMET = exports.DISQUS = exports.EMAIL = exports.AUTH = exports.REDIS = exports.MONGO_DB = exports.CROSS_DOMAIN = exports.PROJECT = exports.APP = void 0;
const path_1 = __importDefault(require("path"));
const yargs_1 = require("yargs");
const ROOT_PATH = path_1.default.join(__dirname, '..');
const packageJSON = require(path_1.default.resolve(ROOT_PATH, 'package.json'));
exports.APP = {
    PORT: 8000,
    ROOT_PATH,
    DEFAULT_CACHE_TTL: 60 * 60 * 24,
    MASTER: 'Surmon',
    NAME: 'NodePress',
    URL: 'https://api.surmon.me',
    ADMIN_EMAIL: yargs_1.argv.admin_email || 'admin email, e.g. admin@example.com',
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
    issues: packageJSON.bugs.url,
};
exports.CROSS_DOMAIN = {
    allowedOrigins: ['https://surmon.me', 'https://cdn.surmon.me', 'https://admin.surmon.me'],
    allowedReferer: 'surmon.me',
};
exports.MONGO_DB = {
    uri: yargs_1.argv.db_uri || `mongodb://127.0.0.1:27017/NodePress`,
};
exports.REDIS = {
    host: yargs_1.argv.redis_host || 'localhost',
    port: yargs_1.argv.redis_port || 6379,
    username: (yargs_1.argv.redis_username || null),
    password: (yargs_1.argv.redis_password || null),
};
exports.AUTH = {
    expiresIn: yargs_1.argv.auth_expires_in || 3600,
    data: yargs_1.argv.auth_data || { user: 'root' },
    jwtTokenSecret: yargs_1.argv.auth_key || 'nodepress',
    defaultPassword: yargs_1.argv.auth_default_password || 'root',
};
exports.EMAIL = {
    port: 587,
    host: yargs_1.argv.email_host || 'your email host, e.g. smtp.qq.com',
    account: yargs_1.argv.email_account || 'your email address, e.g. admin@example.me',
    password: yargs_1.argv.email_password || 'your email password',
    from: `"${exports.APP.FE_NAME}" <${yargs_1.argv.email_from || yargs_1.argv.email_account}>`,
};
exports.DISQUS = {
    adminAccessToken: yargs_1.argv.disqus_admin_access_token || 'disqus admin access_token',
    adminUsername: yargs_1.argv.disqus_admin_username || 'disqus admin username',
    forum: yargs_1.argv.disqus_forum_shortname || 'disqus forum shortname',
    publicKey: yargs_1.argv.disqus_public_key || 'disqus application public_key',
    secretKey: yargs_1.argv.disqus_secret_key || 'disqus application secret_key',
};
exports.AKISMET = {
    key: yargs_1.argv.akismet_key || 'your akismet Key',
    blog: yargs_1.argv.akismet_blog || 'your akismet blog site, e.g. https://surmon.me',
};
exports.BAIDU_INDEXED = {
    site: yargs_1.argv.baidu_site || 'your baidu site domain. e.g. https://surmon.me',
    token: yargs_1.argv.baidu_token || 'your baidu seo push token',
};
exports.GOOGLE = {
    serverAccountFilePath: path_1.default.resolve(ROOT_PATH, 'classified', 'google_service_account.json'),
};
exports.AWS = {
    accessKeyId: yargs_1.argv.aws_access_key_id,
    secretAccessKey: yargs_1.argv.aws_secret_access_key,
    s3StaticRegion: yargs_1.argv.aws_s3_static_region,
    s3StaticBucket: yargs_1.argv.aws_s3_static_bucket,
};
exports.DB_BACKUP = {
    s3Region: yargs_1.argv.db_backup_s3_region,
    s3Bucket: yargs_1.argv.db_backup_s3_bucket,
    password: yargs_1.argv.db_backup_file_password,
};
//# sourceMappingURL=app.config.js.map