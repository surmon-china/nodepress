/**
 * @file App config
 * @module app/config
 * @author Surmon <https://github.com/surmon-china>
 * @description
 *  This file contains all configuration variables used throughout the project.
 *  Some configurations are hardcoded, while others are read from environment variables.
 *  Most of the options are not strictly required, but omitting them may disable related features.
 *  If you're certain you don't need a specific feature, you can leave the variable unset to skip it.
 */

import path from 'path'
import { createEnvGetter, Transforms } from '@app/utils/env'

const arg = createEnvGetter(process.env, 'NP')

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
  /** Default pagination page size for lists. */
  PAGINATION_DEFAULT_SIZE: 16,
  /** Application display name */
  NAME: 'NodePress',
  /** Backend API base URL */
  URL: 'https://api.surmon.me',
  /** Admin email used for notifications, integrations, etc. Required for features like sending emails. */
  ADMIN_EMAIL: arg({ key: 'ADMIN_EMAIL', required: true }),
  /** Frontend display name (used in email, SEO, etc.) */
  FE_NAME: 'Surmon.me',
  /** Frontend URL (used in SEO or link generation) */
  FE_URL: 'https://surmon.me',
  /** Static resource host URL */
  STATIC_URL: 'https://static.surmon.me',
  /** Allowed CORS origins */
  CORS_ALLOWED_ORIGINS: ['https://surmon.me', /\.surmon\.me$/],
  /** AI Assistant display name */
  AI_AUTHOR_NAME: arg({ key: 'AI_AUTHOR_NAME', default: 'AI Assistant' }),
  /** AI Assistant email used for notifications, integrations, etc. Required for features like sending emails. */
  AI_AUTHOR_EMAIL: arg<string | null>({ key: 'AI_AUTHOR_EMAIL', default: null })
})

export const APP_AUTH = Object.freeze({
  /** Default password for the admin user, used when no password is set in the database */
  adminDefaultPassword: arg({ key: 'ADMIN_DEFAULT_PASSWORD', default: 'root' }),
  /** Number of rounds for Bcrypt hashing (higher is more secure but slower) */
  adminBcryptSaltRounds: arg({ key: 'ADMIN_BCRYPT_SALT_ROUNDS', default: 10, transform: Transforms.number }),
  /** Global JWT signing secret. @important Must be a long, random string in production to prevent brute-force attacks. */
  jwtSecret: arg({ key: 'AUTH_JWT_SECRET', default: 'nodepress-secret' }),
  /** The 'iss' (issuer) claim identifies the principal that issued the JWT */
  jwtIssuer: arg({ key: 'AUTH_JWT_ISSUER', default: 'nodepress' }),
  /** The 'aud' (audience) claim identifies the recipients that the JWT is intended for */
  jwtAudience: arg({ key: 'AUTH_JWT_AUDIENCE', default: 'nodepress-api' }),
  /** Access Token (JWT) expiration time (seconds) for administrators. Recommended to be short (e.g., 1-2 hours) for higher security */
  jwtExpiresInForAdmin: 2 * 3600,
  /** Refresh Token expiration time (seconds) for administrators. (e.g., 30 days) */
  refreshTokenExpiresInForAdmin: 30 * 24 * 3600,
  /** Access Token (JWT) expiration time (seconds) for regular users. (e.g., 2 hours / 7 days) */
  jwtExpiresInForUser: 7 * 24 * 3600,
  /** Refresh Token expiration time (seconds) for regular users. (e.g., 60 days) */
  refreshTokenExpiresInForUser: 60 * 24 * 3600
})

// MongoDB Configuration
export const MONGO_DB = Object.freeze({
  /** MongoDB connection URI */
  uri: arg({ key: 'MONGODB_URI', default: 'mongodb://127.0.0.1:27017/NodePress' })
})

// Redis Configuration
export const REDIS = Object.freeze({
  /** As a prefix for Redis storage keys, used to distinguish data from other applications in Redis. */
  namespace: arg({ key: 'REDIS_NAMESPACE', default: 'nodepress' }),
  host: arg({ key: 'REDIS_HOST', default: 'localhost' }),
  port: arg({ key: 'REDIS_PORT', default: 6379, transform: Transforms.number }),
  username: arg('REDIS_USERNAME'),
  password: arg('REDIS_PASSWORD')
})

// Email Service Configuration
export const EMAIL = Object.freeze({
  /** SMTP port, usually 587 or 465 */
  port: 587,
  /** Email SMTP server host (e.g., `smtp.qq.com`) */
  host: arg('EMAIL_HOST'),
  /** Sender email address, (e.g., `admin@example.me`) */
  account: arg({ key: 'EMAIL_ACCOUNT', required: true }),
  /** Email SMTP password */
  password: arg({ key: 'EMAIL_PASSWORD', required: true }),
  /** Display name for email sender */
  from: `"${APP_BIZ.FE_NAME}" <${arg('EMAIL_FROM') || arg('EMAIL_ACCOUNT')}>`
})

/** Webhook Configuration {@link https://github.com/surmon-china/surmon.me.ai} */
export const WEBHOOK = Object.freeze({
  /** The target URL where the webhook notifications will be sent */
  endpoint: arg('WEBHOOK_ENDPOINT'),
  /** Secret for authenticating and verifying webhook requests */
  secret: arg('WEBHOOK_SECRET')
})

// Akismet Configuration
export const AKISMET = Object.freeze({
  /** Akismet API key {@link https://akismet.com/developers/getting-started/#verify-key} */
  apiKey: arg({ key: 'AKISMET_API_KEY', required: true }),
  /** Akismet blog URL for spam protection (e.g., `https://surmon.me`) {@link https://akismet.com/developers/detailed-docs/key-verification/} */
  blog: arg({ key: 'AKISMET_BLOG', required: true })
})

// S3 Storage Configuration
export const S3_STORAGE = Object.freeze({
  /** S3 endpoint */
  endpoint: arg({ key: 'S3_ENDPOINT', required: true }),
  /** S3 Access Key ID */
  accessKeyId: arg({ key: 'S3_ACCESS_KEY_ID', required: true }),
  /** S3 Secret Access Key */
  secretAccessKey: arg({ key: 'S3_SECRET_ACCESS_KEY', required: true }),
  /** S3 Bucket name for static files */
  s3StaticFileBucket: arg({ key: 'S3_STATIC_FILE_BUCKET', required: true }),
  /** S3 Region for static file bucket */
  s3StaticFileRegion: arg({ key: 'S3_STATIC_FILE_REGION', required: true })
})

// Database Backup Configuration
export const DB_BACKUP = Object.freeze({
  /** S3 region for storing backups */
  s3Region: arg({ key: 'DB_BACKUP_S3_REGION', required: true }),
  /** S3 bucket for database backup files */
  s3Bucket: arg({ key: 'DB_BACKUP_S3_BUCKET', required: true }),
  /** Password for backup file encryption */
  password: arg({ key: 'DB_BACKUP_FILE_PASSWORD', required: true })
})

/** Cloudflare AI Gateway Configuration {@link https://developers.cloudflare.com/ai-gateway/usage/chat-completion/} */
export const CLOUDFLARE_AI_GATEWAY = Object.freeze({
  /** The unique identifier for your Cloudflare account */
  accountId: arg({ key: 'CF_AIG_ACCOUNT_ID', required: true }),
  /** The specific AI Gateway name created in the Cloudflare dashboard */
  gatewayId: arg({ key: 'CF_AIG_ID', required: true }),
  /** API token for gateway authentication (optional if using universal endpoint) */
  token: arg({ key: 'CF_AIG_TOKEN', required: true })
})

/** GitHub OAuth Configuration {@link https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps} */
export const GITHUB_OAUTH = Object.freeze({
  clientId: arg({ key: 'OAUTH_GITHUB_CLIENT_ID', required: true }),
  clientSecret: arg({ key: 'OAUTH_GITHUB_CLIENT_SECRET', required: true }),
  scope: 'read:user user:email'
})

/** Google OAuth Configuration {@link https://developers.google.com/identity/protocols/oauth2} */
export const GOOGLE_OAUTH = Object.freeze({
  clientId: arg({ key: 'OAUTH_GOOGLE_CLIENT_ID', required: true }),
  clientSecret: arg({ key: 'OAUTH_GOOGLE_CLIENT_SECRET', required: true }),
  scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
})

// Bing Webmaster Tools Configuration
export const BING_INDEXED = Object.freeze({
  /** Website URL submitted to Bing (e.g., `https://surmon.me`) */
  site: arg({ key: 'BING_SITE', required: true }),
  /** API key for Bing indexing {@link https://learn.microsoft.com/en-us/bingwebmaster/getting-access} */
  apiKey: arg({ key: 'BING_API_KEY', required: true })
})

// Google Integration Configuration
export const GOOGLE_API = Object.freeze({
  /** Google Analytics v4 Property ID */
  analyticsV4PropertyId: arg({ key: 'GOOGLE_ANALYTICS_V4_PROPERTY_ID', required: true }),
  /** Service account credentials (JSON parsed) */
  jwtServiceAccountCredentials: arg<any>({
    key: 'GOOGLE_JWT_CRED_JSON',
    transform: Transforms.json,
    required: true
  })
})
