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
  PORT: 8000,
  ROOT_PATH,
  DEFAULT_CACHE_TTL: 60 * 60 * 24,
  MASTER: 'Surmon',
  NAME: 'NodePress',
  URL: 'https://api.surmon.me',
  ADMIN_EMAIL: (argv.admin_email as string) || 'admin email, e.g. admin@example.com',
  FE_NAME: 'Surmon.me',
  FE_URL: 'https://surmon.me',
}

export const PROJECT = {
  name: packageJSON.name,
  version: packageJSON.version,
  author: packageJSON.author,
  homepage: packageJSON.homepage,
  documentation: packageJSON.documentation,
  issues: packageJSON.bugs.url,
}

export const CROSS_DOMAIN = {
  allowedOrigins: ['https://surmon.me', 'https://cdn.surmon.me', 'https://admin.surmon.me'],
  allowedReferer: 'surmon.me',
}

export const MONGO_DB = {
  uri: (argv.db_uri as string) || `mongodb://127.0.0.1:27017/NodePress`,
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
  account: argv.email_account || 'your email address, e.g. admin@surmon.me',
  password: argv.email_password || 'your email password',
}

export const DISQUS = {
  // https://disqus.com/api/applications/<app_id> & Keep permissions: <Read, Write, Manage Forums>
  adminAccessToken: (argv.disqus_admin_access_token as string) || 'disqus admin access_token',
  adminUsername: (argv.disqus_admin_username as string) || 'disqus admin username',
  forum: (argv.disqus_forum_shortname as string) || 'disqus forum shortname',
  // https://disqus.com/api/applications/
  publicKey: (argv.disqus_public_key as string) || 'disqus application public_key',
  secretKey: (argv.disqus_secret_key as string) || 'disqus application secret_key',
}

export const AKISMET = {
  key: argv.akismet_key || 'your akismet Key',
  blog: argv.akismet_blog || 'your akismet blog site, e.g. https://surmon.me',
}

// https://ziyuan.baidu.com/linksubmit/index
export const BAIDU_INDEXED = {
  site: argv.baidu_site || 'your baidu site domain. e.g. https://surmon.me',
  token: argv.baidu_token || 'your baidu seo push token',
}

export const GOOGLE = {
  serverAccountFilePath: path.resolve(ROOT_PATH, 'classified', 'google_service_account.json'),
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
