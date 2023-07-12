/**
 * @file App config
 * @module app/config
 * @author Surmon <https://github.com/surmon-china>
 */

import path from 'path'
import yargs from 'yargs'

const argv = yargs.argv as Record<string, string | void>
const ROOT_PATH = path.join(__dirname, '..')
const packageJSON = require(path.resolve(ROOT_PATH, 'package.json'))

export const APP = {
  PORT: 8000,
  ROOT_PATH,
  DEFAULT_CACHE_TTL: 0,
  MASTER: 'Surmon',
  NAME: 'NodePress',
  URL: 'https://api.surmon.me',
  ADMIN_EMAIL: argv.admin_email || 'admin email, e.g. admin@example.com',
  FE_NAME: 'Surmon.me',
  FE_URL: 'https://surmon.me',
  STATIC_URL: 'https://static.surmon.me'
}

export const PROJECT = {
  name: packageJSON.name,
  version: packageJSON.version,
  author: packageJSON.author,
  homepage: packageJSON.homepage,
  documentation: packageJSON.documentation,
  repository: packageJSON.repository.url
}

export const CROSS_DOMAIN = {
  allowedOrigins: ['https://surmon.me', 'https://cdn.surmon.me', 'https://admin.surmon.me'],
  allowedReferer: 'surmon.me'
}

export const MONGO_DB = {
  uri: argv.db_uri || `mongodb://127.0.0.1:27017/NodePress`
}

export const REDIS = {
  host: argv.redis_host || 'localhost',
  port: argv.redis_port || 6379,
  username: argv.redis_username || null,
  password: argv.redis_password || null
}

export const AUTH = {
  expiresIn: argv.auth_expires_in || 3600,
  data: argv.auth_data || { user: 'root' },
  jwtSecret: argv.auth_key || 'nodepress',
  defaultPassword: argv.auth_default_password || 'root'
}

export const EMAIL = {
  port: 587,
  host: argv.email_host || 'your email host, e.g. smtp.qq.com',
  account: argv.email_account || 'your email address, e.g. admin@example.me',
  password: argv.email_password || 'your email password',
  from: `"${APP.FE_NAME}" <${argv.email_from || argv.email_account}>`
}

export const DISQUS = {
  // https://disqus.com/api/applications/<app_id> & Keep permissions: <Read, Write, Manage Forums>
  adminAccessToken: argv.disqus_admin_access_token || 'Disqus admin access_token',
  adminUsername: argv.disqus_admin_username || 'Disqus admin username',
  forum: argv.disqus_forum_shortname || 'Disqus forum shortname',
  // https://disqus.com/api/applications/
  publicKey: argv.disqus_public_key || 'Disqus application public_key',
  secretKey: argv.disqus_secret_key || 'Disqus application secret_key'
}

export const AKISMET = {
  key: argv.akismet_key || 'your Akismet Key',
  blog: argv.akismet_blog || 'your Akismet blog site, e.g. https://surmon.me'
}

// https://ziyuan.baidu.com/linksubmit/index
export const BAIDU_INDEXED = {
  site: argv.baidu_site || 'your baidu site domain. e.g. surmon.me',
  token: argv.baidu_token || 'your baidu seo push token'
}

// https://learn.microsoft.com/en-us/bingwebmaster/getting-access
export const BING_INDEXED = {
  site: argv.bing_site || 'your bing site url. e.g. https://surmon.me',
  apiKey: argv.bing_api_key || 'your bing webmaster api key'
}

export const GOOGLE = {
  jwtServiceAccountCredentials: argv.google_jwt_cred_json ? JSON.parse(argv.google_jwt_cred_json as string) : null
}

export const AWS = {
  accessKeyId: argv.aws_access_key_id as string,
  secretAccessKey: argv.aws_secret_access_key as string,
  s3StaticRegion: argv.aws_s3_static_region as string,
  s3StaticBucket: argv.aws_s3_static_bucket as string
}

export const DB_BACKUP = {
  s3Region: argv.db_backup_s3_region as string,
  s3Bucket: argv.db_backup_s3_bucket as string,
  password: argv.db_backup_file_password as string
}
