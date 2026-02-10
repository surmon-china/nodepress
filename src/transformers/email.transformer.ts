/**
 * @file Email content transform
 * @module transformer/email
 * @author Surmon <https://github.com/surmon-china>
 */

import { UAParser } from 'ua-parser-js'
import { IPLocation } from '@app/core/helper/helper.service.ip'
import { EmailOptions } from '@app/core/helper/helper.service.email'

export const getTimeText = (date: Date) => {
  const dtf = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  const parts = dtf.formatToParts(date)
  const f = (type) => parts.find((p) => p.type === type)?.value
  return `${f('year')}-${f('month')}-${f('day')} ${f('hour')}:${f('minute')}:${f('second')}`
}

export const getLocationText = (location: Partial<IPLocation>) => {
  return [location.country, location.region, location.city].join(' · ')
}

export const getUserAgentText = (userAgent: string) => {
  const parsed = UAParser(userAgent)
  const browser = parsed.browser.name ? `${parsed.browser.name}/${parsed.browser.version}` : 'Unknown Browser'
  const os = parsed.os.name ? `${parsed.os.name}/${parsed.os.version}` : 'Unknown OS'
  const device = parsed.device.vendor ? `${parsed.device.vendor} ${parsed.device.model}` : 'PC/Generic'
  return [browser, os, device].join(' · ')
}

export const linesToEmailContent = (lines: string[]): Pick<EmailOptions, 'text' | 'html'> => {
  return {
    text: lines.join('\n'),
    html: lines.map((text) => `<p>${text}</p>`).join('\n')
  }
}
