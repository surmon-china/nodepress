/**
 * @file Comment event listeners
 * @module module/comment/listener
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { QueryVisitor } from '@app/decorators/request-context.decorator'
import { EmailService } from '@app/core/helper/helper.service.email'
import { IPService } from '@app/core/helper/helper.service.ip'
import { GUESTBOOK_POST_ID } from '@app/constants/biz.constant'
import { EventKeys } from '@app/constants/events.constant'
import { CommentBase } from '@app/modules/comment/comment.model'
import { getMessageFromNormalError } from '@app/transformers/error.transformer'
import { getLocationText, getUserAgentText, linesToEmailContent } from '@app/transformers/email.transformer'
import { APP_BIZ } from '@app/app.config'

interface CommentCreateFailedEventPayload {
  visitor: QueryVisitor
  comment: CommentBase
  error: any
}

@Injectable()
export class CommentListener {
  constructor(
    private readonly emailService: EmailService,
    private readonly ipService: IPService
  ) {}

  @OnEvent(EventKeys.CommentCreateFailed, { async: true })
  async handleCommentCreateFailed({ comment, visitor, error }: CommentCreateFailedEventPayload) {
    const subject = 'User comment creation failed'
    const userAgent = visitor.ua ?? comment.agent
    const location = visitor.ip ? await this.ipService.queryLocation(visitor.ip) : null
    const targetPage = comment.post_id === GUESTBOOK_POST_ID ? 'Guestbook' : `Article ${comment.post_id}`

    this.emailService.sendMailAs(APP_BIZ.NAME, {
      to: APP_BIZ.ADMIN_EMAIL,
      subject,
      ...linesToEmailContent([
        `${subject}!`,
        `CommentPid: ${comment.pid}`,
        `CommentPostId: ${targetPage}`,
        `CommentContent: ${comment.content || '-'}`,
        `CommentAuthor: ${comment.author.name || '-'} · ${comment.author.email || '-'} · ${comment.author.site || '-'}`,
        `ErrorDetail: ${getMessageFromNormalError(error)}`,
        `AuthorAgent: ${userAgent ? getUserAgentText(userAgent) : 'unknown'}`,
        `Referer: ${visitor.referer || 'unknown'}`,
        `IP: ${visitor.ip || 'unknown'}`,
        `Location: ${location ? getLocationText(location) : 'unknown'}`
      ])
    })
  }
}
