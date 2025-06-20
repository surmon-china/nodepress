/**
 * @file Parse command line arguments
 * @module utils/args
 * @author Surmon <https://github.com/surmon-china>
 */

import yargsArgv from 'yargs-parser'
import { isNil, isUndefined } from '@app/constants/value.constant'

export type DefaultArgs = Record<string, string | boolean | number>
export const parseArgv = <T = DefaultArgs>(argv: string[]): T => yargsArgv(argv)

export interface ArgGetOptions<T> {
  key: string
  default?: T
  required?: boolean
  message?: string
}

export function parseArgs(parsedArgs: Record<string, any>) {
  function get<T = any>(options: ArgGetOptions<T>): T
  function get<T = any>(key: string, defaultValue?: T): T
  function get<T = any>(input: string | ArgGetOptions<T>, defaultValue?: T): T {
    // If options is not provided, throw an error
    if (isNil(input)) {
      throw new Error('Argument options must be a string or an object with key and default properties.')
    }

    // If options is a string, return the value directly
    if (typeof input === 'string') {
      const value = parsedArgs[input]
      return isUndefined(value) ? (defaultValue as T) : value
    }

    // If options is an object, extract the key and handle default and required logic
    const key = input.key
    const value = parsedArgs[key]

    // If the key is required and the value is nil, throw an error
    if (input.required && isNil(value)) {
      throw new Error(input.message || `Missing required argument: "${key}". Please pass it using --${key}=<value>`)
    }

    // If the value is undefined, return the default value if provided
    if (isUndefined(value)) {
      return input.default as T
    }

    return value
  }

  return get
}
