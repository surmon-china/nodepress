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
// eslint-disable-next-line @typescript-eslint/no-require-imports
const packageJSON = require(path.resolve(ROOT_PATH, 'package.json'))

// Project Information
export const PROJECT = Object.freeze({
  name: packageJSON.name,
  version: packageJSON.version,
  author: packageJSON.author,
  homepage: packageJSON.homepage,
  documentation: packageJSON.documentation,
  repository: packageJSON.repository.url
})

// Application Core Configuration
export const APP_BIZ = Object.freeze({
  ROOT_PATH,
  /** Default server port (can be overridden) */
  PORT: 8000,
  /** Default cache time-to-live (TTL) in seconds. `0` disables caching. */
  DEFAULT_CACHE_TTL: 0,
  /** The maximum number of items allowed per page in paginated requests. */
  PAGINATION_MAX_SIZE: 50,
  PAGINATION_DEFAULT_SIZE: 16,
  /** Application display name */
  NAME: 'NodePress',
  /** Backend API base URL */
  URL: 'https://api.surmon.me',
  /** Admin email used for notifications, integrations, etc. Required for features like sending emails. */
  ADMIN_EMAIL: arg<string>({ key: 'admin_email' }),
  /** Frontend display name (used in email, SEO, etc.) */
  FE_NAME: 'Surmon.me',
  /** Frontend URL (used in SEO or link generation) */
  FE_URL: 'https://surmon.me',
  /** Static resource host URL */
  STATIC_URL: 'https://static.surmon.me',
  /** Allowed CORS origins */
  CORS_ALLOWED_ORIGINS: ['https://surmon.me', /\.surmon\.me$/],
  /** AI Assistant display name */
  AI_AUTHOR_NAME: arg<string>({ key: 'ai_author_name', default: 'AI Assistant' }),
  /** AI Assistant email used for notifications, integrations, etc. Required for features like sending emails. */
  AI_AUTHOR_EMAIL: arg<string>({ key: 'ai_author_email' })
})

export const APP_AUTH = Object.freeze({
  /** Default password for the admin user, used when no password is set in the database */
  adminDefaultPassword: arg({ key: 'admin_default_password', default: 'root' }),
  /** Number of rounds for Bcrypt hashing (higher is more secure but slower) */
  adminBcryptSaltRounds: arg({ key: 'admin_bcrypt_salt_rounds', default: 10 }),
  /** Global JWT signing secret. @important Must be a long, random string in production to prevent brute-force attacks. */
  jwtSecret: arg({ key: 'auth_jwt_secret', default: 'nodepress-secret' }),
  /** The 'iss' (issuer) claim identifies the principal that issued the JWT */
  jwtIssuer: arg({ key: 'auth_jwt_issuer', default: 'nodepress' }),
  /** The 'aud' (audience) claim identifies the recipients that the JWT is intended for */
  jwtAudience: arg({ key: 'auth_jwt_audience', default: 'nodepress-api' }),
  /** Token expiration time (seconds) for administrators. Recommended to be short (e.g., 1-2 hours) for higher security */
  jwtExpiresInForAdmin: 2 * 3600,
  /** Token expiration time (seconds) for regular users. Can be longer (e.g., 7 days) to provide a better user experience by reducing re-logins */
  jwtExpiresInForUser: 7 * 24 * 3600
})

// MongoDB Configuration
export const MONGO_DB = Object.freeze({
  /** MongoDB connection URI */
  uri: arg({ key: 'mongodb_uri', default: 'mongodb://127.0.0.1:27017/NodePress' })
})

// Redis Configuration
export const REDIS = Object.freeze({
  /** As a prefix for Redis storage keys, used to distinguish data from other applications in Redis. */
  namespace: arg({ key: 'redis_namespace', default: 'nodepress' }),
  host: arg({ key: 'redis_host', default: 'localhost' }),
  port: arg({ key: 'redis_port', default: 6379 }),
  username: arg<string | void>('redis_username'),
  password: arg<string | void>('redis_password')
})

// Email Service Configuration
export const EMAIL = Object.freeze({
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
})

/** Webhook Configuration {@link https://github.com/surmon-china/surmon.me.ai} */
export const WEBHOOK = Object.freeze({
  /** The target URL where the webhook notifications will be sent */
  endpoint: arg<string>('webhook_endpoint'),
  /** Secret token for authenticating and verifying webhook requests */
  token: arg<string>('webhook_token')
})

// Akismet Configuration
export const AKISMET = Object.freeze({
  /** Akismet API key {@link https://akismet.com/developers/getting-started/#verify-key} */
  apiKey: arg<string>('akismet_api_key'),
  /** Akismet blog URL for spam protection (e.g., `https://surmon.me`) {@link https://akismet.com/developers/detailed-docs/key-verification/} */
  blog: arg<string>('akismet_blog')
})

// S3 Storage Configuration
export const S3_STORAGE = Object.freeze({
  /** S3 endpoint */
  endpoint: arg<string>('s3_endpoint'),
  /** S3 Access Key ID */
  accessKeyId: arg<string>('s3_access_key_id'),
  /** S3 Secret Access Key */
  secretAccessKey: arg<string>('s3_secret_access_key'),
  /** S3 Bucket name for static files */
  s3StaticFileBucket: arg<string>('s3_static_file_bucket'),
  /** S3 Region for static file bucket */
  s3StaticFileRegion: arg<string>('s3_static_file_region')
})

// Database Backup Configuration
export const DB_BACKUP = Object.freeze({
  /** S3 region for storing backups */
  s3Region: arg<string>('db_backup_s3_region'),
  /** S3 bucket for database backup files */
  s3Bucket: arg<string>('db_backup_s3_bucket'),
  /** Password for backup file encryption */
  password: arg<string>('db_backup_file_password')
})

/** Cloudflare AI Gateway Configuration {@link https://developers.cloudflare.com/ai-gateway/usage/chat-completion/} */
export const CLOUDFLARE_AI_GATEWAY = Object.freeze({
  /** The unique identifier for your Cloudflare account */
  accountId: arg<string>('cf_aig_account_id'),
  /** The specific AI Gateway name created in the Cloudflare dashboard */
  gatewayId: arg<string>('cf_aig_id'),
  /** API token for gateway authentication (optional if using universal endpoint) */
  token: arg<string>('cf_aig_token')
})

/** GitHub OAuth Configuration {@link https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps} */
export const GITHUB_OAUTH = Object.freeze({
  clientId: arg<string>('oauth_github_client_id'),
  clientSecret: arg<string>('oauth_github_client_secret'),
  scope: 'read:user user:email'
})

/** Google OAuth Configuration {@link https://developers.google.com/identity/protocols/oauth2} */
export const GOOGLE_OAUTH = Object.freeze({
  clientId: arg<string>('oauth_google_client_id'),
  clientSecret: arg<string>('oauth_google_client_secret'),
  scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
})

// Bing Webmaster Tools Configuration
export const BING_INDEXED = Object.freeze({
  /** Website URL submitted to Bing (e.g., `https://surmon.me`) */
  site: arg<string>('bing_site'),
  /** API key for Bing indexing {@link https://learn.microsoft.com/en-us/bingwebmaster/getting-access} */
  apiKey: arg<string>('bing_api_key')
})

// Google Integration Configuration
export const GOOGLE_API = Object.freeze({
  /** Google Analytics v4 Property ID */
  analyticsV4PropertyId: arg<string>('google_analytics_v4_property_id'),
  /** Service account credentials (JSON parsed) */
  jwtServiceAccountCredentials: args.google_jwt_cred_json ? JSON.parse(args.google_jwt_cred_json as string) : null
})
