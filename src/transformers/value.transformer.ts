/**
 * @file Value transformer
 * @module transformer/value
 * @author Surmon <https://github.com/surmon-china>
 */

import { isNumberString, isDateString } from 'class-validator'

// https://www.progress.com/blogs/understanding-iso-8601-date-and-time-format
export function unknownToDate(value: unknown): Date | unknown {
  return isDateString(value) ? new Date(value as string) : value
}

export function unknownToNumber(value: unknown): number | unknown {
  return isNumberString(value) ? Number(value) : value
}

export function unknownToBoolean(value: unknown): boolean | unknown {
  if ([true, 'true', 1, '1'].includes(value as any)) return true
  if ([false, 'false', 0, '0'].includes(value as any)) return false
  return value
}
