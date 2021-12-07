/**
 * @file App environment
 * @module app/environment
 * @author Surmon <https://github.com/surmon-china>
 */

export const environment = process.env.NODE_ENV
export const isDevMode = Object.is(environment, 'development')
export const isProdMode = Object.is(environment, 'production')
export const isTestMode = Object.is(environment, 'test')

export default {
  isDevMode,
  isProdMode,
  isTestMode,
  environment,
}
