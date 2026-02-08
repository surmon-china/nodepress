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
import { APP_BIZ } from '@app/app.config'

@Injectable()
export class AdminEventListener {
  constructor(
    private readonly emailService: EmailService,
    private readonly ipService: IPService
  ) {}

  @OnEvent(EventKeys.AdminLoggedIn, { async: true })
  async handleAdminLogin({ ip, ua }: QueryVisitor) {
    const subject = 'App has a new login activity'

    const location = ip ? await this.ipService.queryLocation(ip) : null
    const locationText = location ? [location.country, location.region, location.city].join(' · ') : 'unknown'

    const lines = [
      subject,
      `Time: ${new Date().toLocaleString('zh-CN')}`,
      `IP: ${ip || 'unknown'}`,
      `Location: ${locationText}`,
      `UA: ${ua || 'unknown'}`
    ]

    this.emailService.sendMailAs(APP_BIZ.NAME, {
      to: APP_BIZ.ADMIN_EMAIL,
      subject,
      text: lines.join('\n'),
      html: lines.map((line) => `<p>${line}</p>`).join('\n')
    })
  }

  @OnEvent(EventKeys.AdminLoggedOut, { async: true })
  async handleAdminLoggedOut(token: string) {
    // console.log('Admin logged out', token)
  }
}
