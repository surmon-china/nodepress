
/**
 * App module transform.
 * @file 模块转换器
 * @module app.utils.module.transform
 * @author Surmon <https://github.com/surmon-china>
 */

export const consola = require('consola');
export const request = require('request-promise');
export const packageJson = require('../../package.json');

export default {
  consola,
  request,
  packageJson,
};
