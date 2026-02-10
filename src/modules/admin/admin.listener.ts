/**
 * @file Admin auth event listeners
 * @module module/admin/listener
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EmailService } from '@app/core/helper/helper.service.email'
import { IPService } from '@app/core/helper/helper.service.ip'
import { EventKeys } from '@app/constants/events.constant'
import { QueryVisitor } from '@app/decorators/request-context.decorator'
import {
  getTimeText,
  getLocationText,
  getUserAgentText,
  linesToEmailContent
} from '@app/transformers/email.transformer'
import { APP_BIZ } from '@app/app.config'

@Injectable()
export class AdminListener {
  constructor(
    private readonly emailService: EmailService,
    private readonly ipService: IPService
  ) {}

  @OnEvent(EventKeys.AdminLoggedIn, { async: true })
  async handleAdminLogin({ ip, ua, referer }: QueryVisitor) {
    const subject = 'App has a new login activity'
    const location = ip ? await this.ipService.queryLocation(ip) : null

    this.emailService.sendMailAs(APP_BIZ.NAME, {
      to: APP_BIZ.ADMIN_EMAIL,
      subject,
      ...linesToEmailContent([
        `${subject}!`,
        `Time: ${getTimeText(new Date())}`,
        `Referer: ${referer || 'unknown'}`,
        `IP: ${ip || 'unknown'}`,
        `Location: ${location ? getLocationText(location) : 'unknown'}`,
        `UserAgent: ${ua ? getUserAgentText(ua) : 'unknown'}`
      ])
    })
  }
}
