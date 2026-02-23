/**
 * @file Normalize string decorator
 * @module decorator/normalize-string
 * @author Surmon <https://github.com/surmon-china>
 */

import { Transform, TransformOptions } from 'class-transformer'

export interface NormalizeStringOptions {
  trim?: boolean
  collapseSpaces?: boolean
}

export function normalizeString(value: unknown, options: NormalizeStringOptions = {}) {
  if (typeof value !== 'string') return value

  const { trim = false, collapseSpaces = false } = options

  let result = value

  if (trim) result = result.trim()
  if (collapseSpaces) result = result.replace(/\s+/g, ' ')

  return result
}

export function NormalizeString(options: NormalizeStringOptions, transformOptions?: TransformOptions) {
  return Transform(({ value }) => normalizeString(value, options), transformOptions)
}
