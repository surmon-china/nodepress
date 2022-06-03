/**
 * @file Code transform
 * @module transformer/codec
 * @author Surmon <https://github.com/surmon-china>
 */

import { Base64 } from 'js-base64'
import { createHash } from 'crypto'

// Base64
export function decodeBase64(value: string): string {
  return value ? Base64.decode(value) : value
}

// md5
export function decodeMD5(value: string): string {
  return createHash('md5').update(value).digest('hex')
}
