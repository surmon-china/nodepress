/**
 * @file App global logger
 * @module utils/logger
 * @author Surmon <https://github.com/surmon-china>
 */

import chalk from 'chalk'

enum LoggerFn {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

const createLogger = (namespace = 'NP') => {
  const renderTime = () => {
    const now = new Date()
    return `[${now.toLocaleDateString()} ${now.toLocaleTimeString()}]`
  }
  const renderModule = (message: string) => {
    if (typeof message === 'string' && message.startsWith('[') && message.endsWith(']')) {
      return chalk.green.underline(message.substr(1, message.length - 2))
    } else {
      return message
    }
  }
  const renderMessage = (color: any, messages: any[]) => {
    return messages.map((m) => (typeof m === 'string' ? color(m) : m))
  }
  const renderLog = (method: LoggerFn, levelLabel: any, messageColor: any) => {
    return (message: string, ...args: any) => {
      return console[method](
        chalk.greenBright(`[${namespace}]`),
        renderTime(),
        levelLabel,
        renderModule(message),
        ...renderMessage(messageColor, args)
      )
    }
  }

  return {
    debug: renderLog(LoggerFn.Debug, chalk.cyan('[DEBUG]'), chalk.cyanBright),
    info: renderLog(LoggerFn.Info, chalk.blue('[_INFO]'), chalk.greenBright),
    warn: renderLog(LoggerFn.Warn, chalk.yellow('[_WARN]'), chalk.yellowBright),
    error: renderLog(LoggerFn.Error, chalk.red('[ERROR]'), chalk.redBright),
  }
}

const logger = createLogger()

export default logger
