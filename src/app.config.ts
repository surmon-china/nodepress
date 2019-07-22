/**
 * App config.
 * @file 应用运行配置
 * @module app/config
 * @author Surmon <https://github.com/surmon-china>
 */

import * as path from 'path';
import { argv } from 'yargs';
import { packageJson } from '@app/transforms/module.transform';

export const APP = {
  LIMIT: 16,
  PORT: 8000,
  ROOT_PATH: __dirname,
  NAME: 'Surmon.me',
  URL: 'https://surmon.me',
  FRONT_END_PATH: path.join(__dirname, '..', '..', 'surmon.me'),
};

export const CROSS_DOMAIN = {
  allowedOrigins: ['https://surmon.me', 'https://cdn.surmon.me', 'https://admin.surmon.me'],
  allowedReferer: 'surmon.me',
};

export const MONGODB = {
  uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/NodePress`,
  username: argv.db_username || 'DB_username',
  password: argv.db_password || 'DB_password',
};

export const REDIS = {
  host: argv.redis_host || 'localhost',
  port: argv.redis_port || 6379,
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
  account: argv.email_account || 'your email address like : i@surmon.me',
  password: argv.email_password || 'your email password',
  from: '"Surmon" <i@surmon.me>',
  admin: 'surmon@foxmail.com',
};

export const AKISMET = {
  key: argv.akismet_key || 'your akismet Key',
  blog: argv.akismet_blog || 'your akismet blog site, like: https://surmon.me',
};

export const GITHUB = {
  username: 'surmon-china',
};

export const ALIYUN = {
  ip: argv.aliyun_ip_auth,
};

export const BAIDU = {
  site: argv.baidu_site || 'your baidu site domain like : surmon.me',
  token: argv.baidu_token || 'your baidu seo push token',
};

export const GOOGLE = {
  serverAccountFilePath: path.resolve(__dirname, '..', 'classified', 'google_service_account.json'),
};

export const QINIU = {
  accessKey: argv.qn_accessKey || 'qiniu access key',
  secretKey: argv.qn_secretKey || 'qiniu secret key',
  bucket: argv.qn_bucket || 'qiniu bucket name',
  origin: argv.qn_origin || 'qiniu origin url',
  uploadURL: argv.qn_uploadURL || 'http://up.qiniu.com/',
};

export const INFO = {
  name: packageJson.name,
  version: packageJson.version,
  author: packageJson.author,
  site: APP.URL,
  github: 'https://github.com/surmon-china',
  homepage: packageJson.homepage,
  issues: packageJson.bugs.url,
  powered: ['Vue', 'Nuxt.js', 'nestjs', 'ReactNative', 'Angular', 'Bootstrap', 'Nodejs', 'MongoDB', 'Express', 'Nginx'],
};
