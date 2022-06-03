/**
 * @file App logger
 * @module utils/logger
 * @author Surmon <https://github.com/surmon-china>
 */

import chalk from 'chalk'

enum LoggerLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

const renderTime = () => {
  const now = new Date()
  return `[${now.toLocaleDateString()} ${now.toLocaleTimeString()}]`
}

const renderScope = (scope: string) => {
  return chalk.green.underline(scope)
}

const renderMessage = (color: chalk.Chalk, messages: any[]) => {
  return messages.map((m) => (typeof m === 'string' ? color(m) : m))
}

const renderLog = (method: LoggerLevel, level: string, color: chalk.Chalk, scope?: string) => {
  return (...messages: any) => {
    return console[method](
      chalk.greenBright(`[NP]`),
      renderTime(),
      level,
      scope ? renderScope(scope) : '',
      ...renderMessage(color, messages)
    )
  }
}

const createLogger = (scope?: string) => ({
  debug: renderLog(LoggerLevel.Debug, chalk.cyan('[DEBUG]'), chalk.cyanBright, scope),
  info: renderLog(LoggerLevel.Info, chalk.blue('[_INFO]'), chalk.greenBright, scope),
  warn: renderLog(LoggerLevel.Warn, chalk.yellow('[_WARN]'), chalk.yellowBright, scope),
  error: renderLog(LoggerLevel.Error, chalk.red('[ERROR]'), chalk.redBright, scope),
})

export default {
  ...createLogger(),
  scope: createLogger,
}
