/**
 * @file Vote event listener
 * @module module/vote/listener
 */

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { GlobalEventKey } from '@app/constants/events.constant'
import { EmailService } from '@app/core/helper/helper.service.email'
import { ArticleService } from '@app/modules/article/article.service'
import { CommentService } from '@app/modules/comment/comment.service'
import { getCommentNotificationEmail } from '@app/modules/comment/comment.helper'
import { getArticleUrl, getPermalink } from '@app/transformers/urlmap.transformer'
import { getLocationText, getUserAgentText, getAuthorText } from '@app/transformers/email.transformer'
import { linesToEmailContent } from '@app/transformers/email.transformer'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import { APP_BIZ } from '@app/app.config'
import { VoteWithUser } from './vote.model'
import { VoteTargetType, VoteType } from './vote.constant'

const logger = createLogger({ scope: 'VoteListener', time: isDevEnv })

@Injectable()
export class VoteListener {
  constructor(
    private readonly emailService: EmailService,
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService
  ) {}

  @OnEvent(GlobalEventKey.VoteCreated, { async: true })
  async handleVoteCreated(vote: VoteWithUser) {
    try {
      const voteEmoji = vote.vote_type === VoteType.Upvote ? '👍' : '👎'
      const voteAction = VoteType[vote.vote_type]
      const voteText = `${voteEmoji}  ${voteAction}`

      const sendMailToAdmin = (targetTitle: string, targetLink: string) => {
        this.emailService.sendMailAs(APP_BIZ.FE_NAME, {
          to: APP_BIZ.ADMIN_EMAIL,
          subject: `New vote on ${targetTitle}`,
          ...linesToEmailContent([
            `You have a new vote on ${targetTitle}.`,
            `Link: ${targetLink}`,
            `Type: ${voteText}`,
            `Author: ${getAuthorText({ user: vote.user, name: vote.author_name, email: vote.author_email })}`,
            `IP: ${vote.ip || 'Unknown'}`,
            `Location: ${vote.ip_location ? getLocationText(vote.ip_location) : 'Unknown'}`,
            `Agent: ${vote.user_agent ? getUserAgentText(vote.user_agent) : 'Unknown'}`
          ])
        })
      }

      // 1. Vote on Article -> Send email to Admin only.
      if (vote.target_type === VoteTargetType.Article) {
        const targetLink = getArticleUrl(vote.target_id)
        const targetTitle = await this.articleService
          .getDetail(vote.target_id, { lean: true })
          .then((article) => `"${article.title}"`)
          .catch(() => `article #${vote.target_id}`)
        sendMailToAdmin(targetTitle, targetLink)
      }

      // 2. Vote on Comment -> Send email to Admin.
      if (vote.target_type === VoteTargetType.Comment) {
        const comment = await this.commentService.getDetail(vote.target_id, 'withUser')
        const targetLink = getPermalink(comment.target_type, comment.target_id) + `#comment-${comment.id}`
        const targetTitle = `comment #${comment.id}`
        sendMailToAdmin(targetTitle, targetLink)

        //  If the voter is NOT the comment author, also send an email to the comment author.
        const voteAuthorEmail = vote.user?.email ?? vote.author_email
        const commentAuthorEmail = getCommentNotificationEmail(comment)

        if (!commentAuthorEmail) return
        if (commentAuthorEmail === voteAuthorEmail) return

        const subject = `Your comment #${comment.id} has a new vote`
        this.emailService.sendMailAs(APP_BIZ.FE_NAME, {
          to: commentAuthorEmail,
          subject,
          ...linesToEmailContent([
            `Hello ${comment.author_name}, ${subject}.`,
            `Target: ${targetTitle}`,
            `Type: ${voteText}`,
            `From: ${vote.author_name || 'Anonymous'}`,
            `View on: ${targetLink}`
          ])
        })
      }
    } catch (error) {
      logger.error('Error handling vote created event', error)
    }
  }
}
