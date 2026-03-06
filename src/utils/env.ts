/**
 * @file Environment variable getter
 * @module utils/env
 * @author Surmon <https://github.com/surmon-china>
 */

import logger from './logger'
import { isDevEnv } from '../app.environment'

export const Transforms = {
  number: (v: string) => Number(v),
  json: <T>(v: string) => JSON.parse(v) as T
} as const

export interface EnvGetOptions<T> {
  key: string
  default?: T
  devFallback?: NoInfer<T>
  required?: boolean
  message?: string
  transform?: (raw: string) => T
}

/**
 * Create a type-safe getter for environment variables.
 * @param env - The environment object to read from, typically `process.env`
 * @param prefix - Optional prefix for all keys, used for namespace isolation (e.g. `"MYAPP"` → `MYAPP_KEY`)
 */
export function createEnvGetter(processEnv: NodeJS.ProcessEnv, prefix?: string) {
  const getKey = (key: string) => (prefix ? `${prefix}_${key}` : key)

  function get<T = string>(options: EnvGetOptions<T> & { default: T }): T
  function get<T = string>(options: EnvGetOptions<T> & { required: true }): T
  function get<T = string>(options: EnvGetOptions<T> & { devFallback: NoInfer<T> }): T
  function get<T = string>(options: EnvGetOptions<T>): T | undefined
  function get(key: string): string | undefined
  function get<T>(input: string | EnvGetOptions<T>): T | string | undefined {
    // Simple key lookup
    if (typeof input === 'string') {
      return processEnv[getKey(input)]
    }

    // If options is an object, extract the key and handle default and required logic
    const { key, required, message, transform, default: fallback, devFallback } = input
    const fullKey = getKey(key)
    const raw = processEnv[fullKey]

    if (raw === undefined) {
      // 1. Prefer explicit default (works in all environments)
      if (fallback !== undefined) return fallback

      // 2. Use devFallback in development only
      if (isDevEnv && devFallback !== undefined) {
        // Warn if also marked required, so developers know this must be set in production
        if (required) logger.warn(`"${fullKey}" is required in production. Currently using devFallback.`)
        return devFallback as T
      }

      // 3. Log error if required and no fallback resolved
      if (required) {
        logger.error(message ?? `Missing required environment variable: "${fullKey}"`)
      }

      // 4. Truly optional or forcefully bypassed, return undefined
      // HACK: We return `undefined as T` here to bypass strict type checking.
      // The goal is to allow the application to boot up unconditionally with minimal configuration (DX first),
      // while explicitly warning developers (via logger.error above) about what is critically missing.
      // By forcing the type to `T`, we avoid scattering `undefined` checks throughout the codebase
      // for features that might gracefully fail or remain unused during local evaluation.
      return undefined as T
    }

    // Transform raw string value if transformer provided
    return transform ? transform(raw) : (raw as T)
  }

  return get
}
