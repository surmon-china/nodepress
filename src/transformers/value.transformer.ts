/**
 * @file Value transformer
 * @description 基本数据转换
 * @module transformer/value
 * @author Surmon <https://github.com/surmon-china>
 */

import { isNumberString, isDateString } from 'class-validator'

export function unknowToNumber(value: unknown): number | unknown {
  return isNumberString(value) ? Number(value) : value
}

// https://www.progress.com/blogs/understanding-iso-8601-date-and-time-format
export function unknowToDate(value: unknown): Date | unknown {
  return isDateString(value) ? new Date(value as string) : value
}
