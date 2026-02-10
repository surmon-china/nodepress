/**
 * @file Feedback event listeners
 * @module module/feedback/listener
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EmailService } from '@app/core/helper/helper.service.email'
import { EventKeys } from '@app/constants/events.constant'
import { getLocationText, getUserAgentText, linesToEmailContent } from '@app/transformers/email.transformer'
import { Feedback } from './feedback.model'
import { APP_BIZ } from '@app/app.config'

@Injectable()
export class FeedbackListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(EventKeys.FeedbackCreated, { async: true })
  async handleFeedbackCreated(feedback: Feedback) {
    const subject = 'You have a new feedback'

    this.emailService.sendMailAs(APP_BIZ.FE_NAME, {
      to: APP_BIZ.ADMIN_EMAIL,
      subject,
      ...linesToEmailContent([
        `${subject} on '${feedback.tid}'.`,
        `Emotion: ${feedback.emotion_emoji} ${feedback.emotion_text} (${feedback.emotion})`,
        `Content: ${feedback.content}`,
        `Author: ${feedback.user_name || 'Anonymous user'}`,
        `Location: ${feedback.ip_location ? getLocationText(feedback.ip_location) : 'unknown'}`,
        `UserAgent: ${feedback.user_agent ? getUserAgentText(feedback.user_agent) : 'unknown'}`
      ])
    })
  }
}
