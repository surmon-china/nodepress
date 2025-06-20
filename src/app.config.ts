/**
 * @file App config
 * @module app/config
 * @author Surmon <https://github.com/surmon-china>
 * @description
 *  This file contains all configuration variables used throughout the project.
 *  Some configurations are hardcoded, while others are parsed from command-line arguments.
 *  Most of the options are not strictly required, but omitting them may disable related features.
 *  If you're certain you don't need a specific feature, you can provide an empty string to skip it.
 */

import path from 'path'
import { parseArgv, parseArgs } from '@app/utils/args'

const argvs = process.argv.slice(2)
const args = parseArgv<Record<string, string | number | void>>(argvs)
const arg = parseArgs(args)

const ROOT_PATH = path.join(__dirname, '..')
const packageJSON = require(path.resolve(ROOT_PATH, 'package.json'))

// Project Metadata
export const PROJECT = {
  name: packageJSON.name,
  version: packageJSON.version,
  author: packageJSON.author,
  homepage: packageJSON.homepage,
  documentation: packageJSON.documentation,
  repository: packageJSON.repository.url
}

// Application Core Configuration
export const APP_BIZ = {
  ROOT_PATH,
  /** Default server port (can be overridden) */
  PORT: 8000,
  /** Default cache time-to-live (TTL) in seconds. `0` disables caching. */
  DEFAULT_CACHE_TTL: 0,
  /** Application display name */
  NAME: 'NodePress',
  /** Backend API base URL */
  URL: 'https://api.surmon.me',
  /** Admin email used for notifications, integrations, etc. Required for features like sending emails and Disqus. */
  ADMIN_EMAIL: arg<string>({ key: 'admin_email' }),
  /** Frontend display name (used in email, SEO, etc.) */
  FE_NAME: 'Surmon.me',
  /** Frontend URL (used in SEO or link generation) */
  FE_URL: 'https://surmon.me',
  /** Static resource host URL */
  STATIC_URL: 'https://static.surmon.me',
  /** Cross-domain / CORS Configuration */
  CORS: {
    /** Allowed CORS origins */
    allowedOrigins: ['https://surmon.me', 'https://cdn.surmon.me', 'https://admin.surmon.me'],
    /** Allowed Referer domain */
    allowedReferer: 'surmon.me'
  },
  /** Authentication config */
  AUTH: {
    /** JWT token expiration time in seconds */
    expiresIn: arg({ key: 'auth_expires_in', default: 3600 }),
    /** JWT signing secret; must be secure in production */
    jwtSecret: arg({ key: 'auth_key', default: 'nodepress' }),
    /** Default payload for issued tokens */
    data: arg<any>({ key: 'auth_data', default: { user: 'root' } }),
    /** Default admin password */
    defaultPassword: arg({ key: 'auth_default_password', default: 'root' })
  }
}

// MongoDB Configuration
export const MONGO_DB = {
  /** MongoDB connection URI */
  uri: arg({ key: 'db_uri', default: 'mongodb://127.0.0.1:27017/NodePress' })
}

// Redis Configuration
export const REDIS = {
  /** As a prefix for Redis storage keys, used to distinguish data from other applications in Redis. */
  namespace: arg({ key: 'redis_namespace', default: 'nodepress' }),
  host: arg({ key: 'redis_host', default: 'localhost' }),
  port: arg({ key: 'redis_port', default: 6379 }),
  username: arg<string | void>('redis_username'),
  password: arg<string | void>('redis_password')
}

// Email Service Configuration
export const EMAIL = {
  /** SMTP port, usually 587 or 465 */
  port: 587,
  /** Email SMTP server host (e.g., `smtp.qq.com`) */
  host: arg<string>('email_host'),
  /** ESender email address, (e.g., `admin@example.me`) */
  account: arg<string>('email_account'),
  /** Email SMTP password */
  password: arg<string>('email_password'),
  /** Display name for email sender */
  from: `"${APP_BIZ.FE_NAME}" <${arg('email_from') || arg('email_account')}>`
}

// Akismet Configuration
export const AKISMET = {
  /** Akismet API key {@link https://akismet.com/developers/getting-started/#verify-key} */
  key: arg<string>('akismet_key'),
  /** Akismet blog URL for spam protection (e.g., `https://surmon.me`) */
  blog: arg<string>('akismet_blog')
}

// Disqus Comment System Configuration
export const DISQUS = {
  /** Disqus admin access_token (Permissions: Read, Write, Manage Forums) {@link https://disqus.com/api/applications/} */
  adminAccessToken: arg<string>('disqus_admin_access_token'),
  /** Disqus admin username */
  adminUsername: arg<string>('disqus_admin_username'),
  /** Disqus forum shortname */
  forum: arg<string>('disqus_forum_shortname'),
  /** Disqus application public_key {@link https://disqus.com/api/applications/} */
  publicKey: arg<string>('disqus_public_key'),
  /** Disqus application secret_key {@link https://disqus.com/api/applications/} */
  secretKey: arg<string>('disqus_secret_key')
}

// AWS S3 Configuration
export const AWS = {
  /** AWS Access Key ID */
  accessKeyId: arg<string>('aws_access_key_id'),
  /** AWS Secret Access Key */
  secretAccessKey: arg<string>('aws_secret_access_key'),
  /** AWS S3 Region for static file bucket */
  s3StaticRegion: arg<string>('aws_s3_static_region'),
  /** AWS S3 Bucket name for static files */
  s3StaticBucket: arg<string>('aws_s3_static_bucket')
}

// Database Backup Configuration
export const DB_BACKUP = {
  /** S3 region for storing backups */
  s3Region: arg<string>('db_backup_s3_region'),
  /** S3 bucket for database backup files */
  s3Bucket: arg<string>('db_backup_s3_bucket'),
  /** Password for backup file encryption */
  password: arg<string>('db_backup_file_password')
}

// Bing Webmaster Tools Configuration
export const BING_INDEXED = {
  /** Website URL submitted to Bing (e.g., `https://surmon.me`) */
  site: arg<string>('bing_site'),
  /** API key for Bing indexing {@link https://learn.microsoft.com/en-us/bingwebmaster/getting-access} */
  apiKey: arg<string>('bing_api_key')
}

// Google Integration Configuration
export const GOOGLE = {
  /** Google Analytics v4 Property ID */
  analyticsV4PropertyId: arg<string>('google_analytics_v4_property_id'),
  /** Service account credentials (JSON parsed) */
  jwtServiceAccountCredentials: args.google_jwt_cred_json ? JSON.parse(args.google_jwt_cred_json as string) : null
}
