/**
 * @file User event listeners
 * @module module/user/listener
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EventKeys } from '@app/constants/events.constant'
import { EmailService } from '@app/core/helper/helper.service.email'
import { getTimeText, linesToEmailContent } from '@app/transformers/email.transformer'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import { APP_BIZ } from '@app/app.config'
import { User } from './user.model'

const logger = createLogger({ scope: 'UserListener', time: isDevEnv })

@Injectable()
export class UserListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(EventKeys.UserCreated)
  handleUserCreated(user: User) {
    logger.log(`New user created: ${user.name} (#${user.id})`)

    const subject = `New user registered: ${user.name} (#${user.id})`
    this.emailService.sendMailAs(APP_BIZ.FE_NAME, {
      to: APP_BIZ.ADMIN_EMAIL,
      subject,
      ...linesToEmailContent([
        subject,
        `ID: #${user.id}`,
        `Name: ${user.name}`,
        `Email: ${user.email || 'No email'}`,
        `Website: ${user.website || 'No website'}`,
        `Providers: ${user.identities.map((identity) => identity.provider).join(', ')}`,
        `Created At: ${getTimeText(user.created_at!)}`
      ])
    })
  }

  @OnEvent(EventKeys.UserDeleted)
  handleUserDeleted(user: User) {
    logger.log(`User deleted: ${user.name} (#${user.id})`)

    if (user.email) {
      const subject = `Your account at ${APP_BIZ.FE_NAME} has been deleted`
      this.emailService.sendMailAs(APP_BIZ.FE_NAME, {
        to: user.email,
        subject,
        ...linesToEmailContent([
          `Hi ${user.name},`,
          `Your account (#${user.id}) and all related data have been permanently deleted from our database.`,
          `We are sorry to see you go.`,
          ``,
          `Best regards,`,
          `${APP_BIZ.FE_NAME} Team`
        ])
      })
    }
  }
}
