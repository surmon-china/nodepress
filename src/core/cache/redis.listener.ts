/**
 * @file Redis event listeners
 * @module module/redis/listener
 * @author Surmon <https://github.com/surmon-china>
 */

import _throttle from 'lodash/throttle'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EmailService } from '@app/core/helper/helper.service.email'
import { EventKeys } from '@app/constants/events.constant'
import { APP_BIZ } from '@app/app.config'

@Injectable()
export class RedisListener {
  constructor(private readonly emailService: EmailService) {}

  private sendAlarmMail = _throttle((message: string) => {
    this.emailService.sendMailAs(APP_BIZ.NAME, {
      to: APP_BIZ.ADMIN_EMAIL,
      subject: 'Redis Error!',
      text: message,
      html: `<pre><code>${message}</code></pre>`
    })
  }, 30 * 1000)

  @OnEvent(EventKeys.RedisError, { async: true })
  async handleRedisError(error: any) {
    const message = error.errors?.map((e) => e.message) ?? error.message ?? error
    await this.sendAlarmMail(String(message))
  }
}
