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
import { EventKeys } from '@app/constants/events.constant'
import { UserPublic } from '@app/modules/user/user.model'
import { ArticleService } from '@app/modules/article/article.service'
import { CommentService } from '@app/modules/comment/comment.service'
import { CommentTargetType } from '@app/modules/comment/comment.constant'
import { CreateCommentDto } from '@app/modules/comment/comment.dto'
import { CommentWith } from '@app/modules/comment/comment.model'
import { getLocationText, getUserAgentText, linesToEmailContent } from '@app/transformers/email.transformer'
import { getMessageFromNormalError } from '@app/transformers/error.transformer'
import { getPermalink } from '@app/transformers/urlmap.transformer'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import { APP_BIZ } from '@app/app.config'

const logger = createLogger({ scope: 'CommentListener', time: isDevEnv })

@Injectable()
export class CommentListener {
  constructor(
    private readonly ipService: IPService,
    private readonly emailService: EmailService,
    private readonly commentService: CommentService,
    private readonly articleService: ArticleService
  ) {}

  @OnEvent(EventKeys.CommentCreated, { async: true })
  async handleCommentCreated(comment: CommentWith<UserPublic>) {
    const targetLink = getPermalink(comment.target_type, comment.target_id) + `#comment-${comment.id}`
    const targetTitle =
      comment.target_type === CommentTargetType.Page
        ? `Page #${comment.target_id}`
        : await this.articleService
            .getDetail(comment.target_id, { lean: true })
            .then((article) => `"${article.title}"`)
            .catch(() => `Article #${comment.target_id}`)

    // Email to admin
    const subject = `You have a new comment on "${targetTitle}"`
    this.emailService.sendMailAs(APP_BIZ.NAME, {
      to: APP_BIZ.ADMIN_EMAIL,
      subject,
      ...linesToEmailContent([
        subject,
        `Content: ${comment.content}`,
        `Author: ${comment.author_name || '-'} · ${comment.author_email || '-'} · ${comment.author_website || '-'}`,
        `Agent: ${comment.user_agent ? getUserAgentText(comment.user_agent) : 'unknown'}`,
        `IP: ${comment.ip || 'unknown'}`,
        `Location: ${comment.ip_location ? getLocationText(comment.ip_location) : 'unknown'}`,
        `URL: ${targetLink}`
      ])
    })

    // Email to parent comment author
    if (comment.parent_id) {
      try {
        const parentComment = await this.commentService.getDetail(comment.parent_id, 'withUser')
        const parentCommentEmail = parentComment.user?.email ?? parentComment.author_email ?? null
        if (parentCommentEmail && parentCommentEmail !== comment.author_email) {
          const subject = `Your comment #${parentComment.id} has a new reply`
          this.emailService.sendMailAs(APP_BIZ.FE_NAME, {
            to: parentCommentEmail,
            subject,
            ...linesToEmailContent([
              `Hello, ${parentComment.author_name}.`,
              `Your comment has a new reply from ${comment.author_name}:`,
              ``,
              `${comment.content}`,
              ``,
              `View on ${targetTitle}: ${targetLink}`
            ])
          })
        }
      } catch (error) {
        logger.warn('Failed to send email to parent comment author:', error)
      }
    }
  }

  @OnEvent(EventKeys.CommentCreateFailed, { async: true })
  async handleCommentCreateFailed(payload: { input: CreateCommentDto; visitor: QueryVisitor; error: any }) {
    const { input, visitor, error } = payload

    const subject = 'User comment creation failed'
    const location = visitor.ip ? await this.ipService.queryLocation(visitor.ip) : null

    this.emailService.sendMailAs(APP_BIZ.NAME, {
      to: APP_BIZ.ADMIN_EMAIL,
      subject,
      ...linesToEmailContent([
        `${subject}!`,
        `Comment Parent: ${input.parent_id}`,
        `Comment Target: ${input.target_type} - ${input.target_id}`,
        `Comment Content: ${input.content || '-'}`,
        `Comment Author: ${input.author_name || '-'} · ${input.author_email || '-'} · ${input.author_website || '-'}`,
        `Error Detail: ${getMessageFromNormalError(error)}`,
        `Author Agent: ${visitor.agent ? getUserAgentText(visitor.agent) : 'unknown'}`,
        `Referer: ${visitor.referer || 'unknown'}`,
        `IP: ${visitor.ip || 'unknown'}`,
        `Location: ${location ? getLocationText(location) : 'unknown'}`
      ])
    })
  }
}
