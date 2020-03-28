/**
 * Module transform.
 * @file 通用模块转换器
 * @description 用于兼容各种 Commomjs 包在 TS 下的不兼容问题
 * @module transformer/module
 * @author Surmon <https://github.com/surmon-china>
 */

import path from 'path';
export const packageJson = require(path.resolve(__dirname, '..', '..', 'package.json'));
export default {
  packageJson,
};
