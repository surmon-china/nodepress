"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_BACKUP = exports.ALIYUN_CLOUD_STORAGE = exports.GOOGLE = exports.BAIDU_INDEXED = exports.AKISMET = exports.DISQUS = exports.EMAIL = exports.AUTH = exports.REDIS = exports.MONGO_DB = exports.CROSS_DOMAIN = exports.PROJECT = exports.APP = void 0;
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
    ADMIN_EMAIL: yargs_1.argv.admin_email || 'admin email, e.g. admin@surmon.me',
    FE_NAME: 'Surmon.me',
    FE_URL: 'https://surmon.me',
};
exports.PROJECT = {
    name: packageJSON.name,
    version: packageJSON.version,
    author: packageJSON.author,
    homepage: packageJSON.homepage,
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
    account: yargs_1.argv.email_account || 'your email address, e.g. admin@surmon.me',
    password: yargs_1.argv.email_password || 'your email password',
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
    site: yargs_1.argv.baidu_site || 'your baidu site domain. e.g. surmon.me',
    token: yargs_1.argv.baidu_token || 'your baidu seo push token',
};
exports.GOOGLE = {
    serverAccountFilePath: path_1.default.resolve(ROOT_PATH, 'classified', 'google_service_account.json'),
};
exports.ALIYUN_CLOUD_STORAGE = {
    accessKey: yargs_1.argv.cs_access_key || 'cloudstorage access key for cloud storage',
    secretKey: yargs_1.argv.cs_secret_key || 'cloudstorage secret key for cloud storage',
    aliyunAcsARN: yargs_1.argv.cs_aliyun_acs || 'aliyun Acs ARN, e.g. acs:ram::xxx:role/xxx',
};
exports.DB_BACKUP = {
    bucket: yargs_1.argv.db_backup_bucket || 'cloudstorage bucket name for dbbackup',
    region: yargs_1.argv.db_backup_region || 'cloudstorage region for dbbackup, e.g. oss-cn-hangzhou',
};
//# sourceMappingURL=app.config.js.map