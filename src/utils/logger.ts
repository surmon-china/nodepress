/**
 * @file App logger
 * @module utils/logger
 * @author Surmon <https://github.com/surmon-china>
 */

import pico from 'picocolors'

interface LoggerRenderOptions {
  consoler: (...messages: any[]) => void
  formatter(...messages: any[]): string
  label: string
  scope?: string
  time?: boolean
}

const renderLogger = (options: LoggerRenderOptions) => {
  return (...messages: any) => {
    const logs: any[] = []

    // label
    logs.push(options.label)

    // timestamp
    if (options.time) {
      const now = new Date()
      const formattedDate = now.toLocaleDateString()
      const formattedTime = now.toLocaleTimeString()
      const timestamp = `[${formattedDate} ${formattedTime}]`
      logs.push(timestamp)
    }

    // scope
    if (options.scope) {
      const scope = pico.green(pico.underline(pico.bold(options.scope)))
      logs.push(scope)
    }

    // message
    const msgs = messages.map((m) => (typeof m === 'string' ? options.formatter(m) : m))
    return options.consoler(...logs, ...msgs)
  }
}

export interface LoggerOptions {
  scope?: string
  time?: boolean
}

export const createLogger = (opts?: LoggerOptions) => ({
  // levels
  log: renderLogger({ label: '⚪', consoler: console.log, formatter: pico.cyanBright, ...opts }),
  info: renderLogger({ label: '🔵', consoler: console.info, formatter: pico.greenBright, ...opts }),
  warn: renderLogger({ label: '🟠', consoler: console.warn, formatter: pico.yellowBright, ...opts }),
  error: renderLogger({ label: '🔴', consoler: console.error, formatter: pico.redBright, ...opts }),
  debug: renderLogger({ label: '🟤', consoler: console.debug, formatter: pico.cyanBright, ...opts }),
  // aliases
  success: renderLogger({ label: '🟢', consoler: console.log, formatter: pico.greenBright, ...opts }),
  failure: renderLogger({ label: '🔴', consoler: console.warn, formatter: pico.redBright, ...opts })
})

export default createLogger()
