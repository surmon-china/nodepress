/**
 * Codec transform.
 * @file 编解码转换器
 * @description 编解码各种特定格式数据
 * @module transformer/codec
 * @author Surmon <https://github.com/surmon-china>
 */

import { Base64 } from 'js-base64';
import { createHash } from 'crypto';

// Base64 编码
export function decodeBase64(value: string): string {
  return value ? Base64.decode(value) : value;
}

// md5 编码
export function decodeMd5(value: string): string {
  return createHash('md5').update(value).digest('hex');
}