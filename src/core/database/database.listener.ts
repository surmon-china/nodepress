/**
 * @file Database event listeners
 * @module module/database/listener
 * @author Surmon <https://github.com/surmon-china>
 */

import _throttle from 'lodash/throttle'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EmailService } from '@app/core/helper/helper.service.email'
import { EventKeys } from '@app/constants/events.constant'
import { APP_BIZ } from '@app/app.config'

@Injectable()
export class DatabaseListener {
  constructor(private readonly emailService: EmailService) {}

  private sendAlarmMail = _throttle((message: string) => {
    this.emailService.sendMailAs(APP_BIZ.NAME, {
      to: APP_BIZ.ADMIN_EMAIL,
      subject: 'MongoDB Database Error!',
      text: message,
      html: `<pre><code>${message}</code></pre>`
    })
  }, 10 * 1000)

  @OnEvent(EventKeys.DatabaseError, { async: true })
  async handleDatabaseError(error: any) {
    await this.sendAlarmMail(String(error))
  }
}
