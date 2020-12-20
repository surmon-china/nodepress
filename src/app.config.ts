/**
 * App config.
 * @file 应用运行配置
 * @module app/config
 * @author Surmon <https://github.com/surmon-china>
 */

import path from 'path';
import { argv } from 'yargs';

const APP_ROOT_PATH = __dirname;
const PROJECT_ROOT_PATH = path.join(APP_ROOT_PATH, '..');
const FE_PATH = path.join(PROJECT_ROOT_PATH, '..', 'surmon.me');
const FE_PUBLIC_PATH = path.join(FE_PATH, 'public');
const packageJSON = require(path.resolve(PROJECT_ROOT_PATH, 'package.json'));

export const APP = {
  LIMIT: 16,
  PORT: 8000,
  MASTER: 'Surmon',
  NAME: 'Surmon.me',
  URL: 'https://surmon.me',
  FRONT_END_PATH: FE_PATH,
  FRONT_END_PUBLIC_PATH: FE_PUBLIC_PATH,
  ROOT_PATH: APP_ROOT_PATH,
  PROJECT_ROOT_PATH
};

export const PROJECT = {
  name: packageJSON.name,
  version: packageJSON.version,
  author: packageJSON.author,
  site: APP.URL,
  homepage: packageJSON.homepage,
  issues: packageJSON.bugs.url
};

export const CROSS_DOMAIN = {
  allowedOrigins: ['https://surmon.me', 'https://cdn.surmon.me', 'https://admin.surmon.me'],
  allowedReferer: 'surmon.me',
};

export const MONGO_DB = {
  uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/NodePress`,
  username: argv.db_username || 'DB_username',
  password: argv.db_password || 'DB_password',
};

export const REDIS = {
  host: argv.redis_host || 'localhost',
  port: argv.redis_port || 6379,
  password: (argv.redis_password || null) as string,
  ttl: null,
  defaultCacheTTL: 60 * 60 * 24,
};

export const AUTH = {
  expiresIn: argv.auth_expires_in || 3600,
  data: argv.auth_data || { user: 'root' },
  jwtTokenSecret: argv.auth_key || 'nodepress',
  defaultPassword: argv.auth_default_password || 'root',
};

export const EMAIL = {
  account: argv.email_account || 'your email address, e.g. i@surmon.me',
  password: argv.email_password || 'your email password',
  from: '"Surmon" <i@surmon.me>',
  admin: 'surmon@foxmail.com',
};

export const AKISMET = {
  key: argv.akismet_key || 'your akismet Key',
  blog: argv.akismet_blog || 'your akismet blog site, e.g. https://surmon.me',
};

export const COMMON_SERVICE = {
  aliyunIPAuth: argv.aliyun_ip_auth,
  juheIPAuth: argv.juhe_ip_auth,
};

export const BAIDU = {
  site: argv.baidu_site || 'your baidu site domain. e.g. surmon.me',
  token: argv.baidu_token || 'your baidu seo push token',
};

export const GOOGLE = {
  serverAccountFilePath: path.resolve(__dirname, '..', 'classified', 'google_service_account.json'),
};

export const CLOUD_STORAGE = {
  accessKey: argv.cs_access_key as string || 'cloudstorage access key for cloud storage',
  secretKey: argv.cs_secret_key as string || 'cloudstorage secret key for cloud storage',
  aliyunAcsARN: argv.cs_aliyun_acs as string || 'aliyun Acs ARN, e.g. acs:ram::xxx:role/xxx',
};

export const DB_BACKUP = {
  bucket: argv.db_backup_bucket as string || 'cloudstorage bucket name for dbbackup',
  region: argv.db_backup_region as string || 'cloudstorage region for dbbackup, e.g. oss-cn-hangzhou',
};
