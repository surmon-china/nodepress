/**
 * @file App config
 * @module app/config
 * @author Surmon <https://github.com/surmon-china>
 */

import path from 'path'
import { argv } from 'yargs'

const ROOT_PATH = path.join(__dirname, '..')
const packageJSON = require(path.resolve(ROOT_PATH, 'package.json'))

export const APP = {
  LIMIT: 16,
  PORT: 8000,
  MASTER: 'Surmon',
  NAME: 'Surmon.me',
  URL: 'https://surmon.me',
  ROOT_PATH,
  DEFAULT_CACHE_TTL: 60 * 60 * 24,
}

export const PROJECT = {
  name: packageJSON.name,
  version: packageJSON.version,
  author: packageJSON.author,
  site: APP.URL,
  homepage: packageJSON.homepage,
  issues: packageJSON.bugs.url,
}

export const CROSS_DOMAIN = {
  allowedOrigins: ['https://surmon.me', 'https://cdn.surmon.me', 'https://admin.surmon.me'],
  allowedReferer: 'surmon.me',
}

export const MONGO_DB = {
  uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/NodePress`,
  username: argv.db_username || 'DB_username',
  password: argv.db_password || 'DB_password',
}

export const REDIS = {
  host: argv.redis_host || 'localhost',
  port: argv.redis_port || 6379,
  username: (argv.redis_username || null) as string,
  password: (argv.redis_password || null) as string,
}

export const AUTH = {
  expiresIn: argv.auth_expires_in || 3600,
  data: argv.auth_data || { user: 'root' },
  jwtTokenSecret: argv.auth_key || 'nodepress',
  defaultPassword: argv.auth_default_password || 'root',
}

export const EMAIL = {
  account: argv.email_account || 'your email address, e.g. i@surmon.me',
  password: argv.email_password || 'your email password',
  from: '"Surmon" <i@surmon.me>',
  admin: 'surmon@foxmail.com',
}

export const AKISMET = {
  key: argv.akismet_key || 'your akismet Key',
  blog: argv.akismet_blog || 'your akismet blog site, e.g. https://surmon.me',
}

export const COMMON_SERVICE = {
  aliyunIPAuth: argv.aliyun_ip_auth,
  juheIPAuth: argv.juhe_ip_auth,
}

// https://ziyuan.baidu.com/linksubmit/index
export const BAIDU_INDEXED = {
  site: argv.baidu_site || 'your baidu site domain. e.g. surmon.me',
  token: argv.baidu_token || 'your baidu seo push token',
}

export const GOOGLE = {
  serverAccountFilePath: path.resolve(__dirname, '..', 'classified', 'google_service_account.json'),
}

export const ALIYUN_CLOUD_STORAGE = {
  accessKey: (argv.cs_access_key as string) || 'cloudstorage access key for cloud storage',
  secretKey: (argv.cs_secret_key as string) || 'cloudstorage secret key for cloud storage',
  aliyunAcsARN: (argv.cs_aliyun_acs as string) || 'aliyun Acs ARN, e.g. acs:ram::xxx:role/xxx',
}

export const DB_BACKUP = {
  bucket: (argv.db_backup_bucket as string) || 'cloudstorage bucket name for dbbackup',
  region: (argv.db_backup_region as string) || 'cloudstorage region for dbbackup, e.g. oss-cn-hangzhou',
}
