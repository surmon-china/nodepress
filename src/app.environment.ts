/**
 * @file App environment
 * @module app/environment
 * @author Surmon <https://github.com/surmon-china>
 */

export const environment = process.env.NODE_ENV
export const isDevEnv = environment === 'development'
export const isProdEnv = environment === 'production'

export default {
  isDevEnv,
  isProdEnv,
  environment
}
