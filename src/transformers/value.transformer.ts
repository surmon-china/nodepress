/**
 * @file Value transformer
 * @module transformer/value
 * @author Surmon <https://github.com/surmon-china>
 */

import { isNumberString, isNumber, isDateString } from 'class-validator'

export function unknownToNumber(value: unknown): number | unknown {
  return isNumberString(value) ? Number(value) : value
}

export function numberToBoolean(value: number): boolean | number {
  return isNumber(value, {
    allowNaN: false,
    allowInfinity: false
  })
    ? Boolean(value)
    : value
}

// https://www.progress.com/blogs/understanding-iso-8601-date-and-time-format
export function unknownToDate(value: unknown): Date | unknown {
  return isDateString(value) ? new Date(value as string) : value
}
