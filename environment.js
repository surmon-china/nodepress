/**
 * Environment module.
 * @file Environment 环境配置
 * @module nodepress/environment
 * @author Surmon <i@surmon.me>
 */

const environment = process.env.NODE_ENV
const isDevMode = Object.is(environment, 'development')
const isProdMode = Object.is(environment, 'production')

module.exports = {
  isDevMode,
  isProdMode,
  environment
}
