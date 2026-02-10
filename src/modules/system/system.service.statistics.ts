/**
 * @file System statistics service
 * @module module/system/statistics.service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { CounterService } from '@app/core/helper/helper.service.counter'
import { EmailService } from '@app/core/helper/helper.service.email'
import { VoteTarget, VoteType } from '@app/modules/vote/vote.constant'
import { VoteService } from '@app/modules/vote/vote.service'
import { ArticleService } from '@app/modules/article/article.service'
import { CommentService } from '@app/modules/comment/comment.service'
import { FeedbackService } from '@app/modules/feedback/feedback.service'
import { TagService } from '@app/modules/tag/tag.service'
import { CacheKeys } from '@app/constants/cache.constant'
import { linesToEmailContent } from '@app/transformers/email.transformer'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import * as APP_CONFIG from '@app/app.config'

const logger = createLogger({ scope: 'StatisticsService', time: isDevEnv })

const DEFAULT_STATISTICS = Object.freeze({
  tags: null,
  articles: null,
  comments: null,
  totalViews: null,
  totalLikes: null,
  todayViews: null,
  averageEmotion: null
})

export type Statistics = Record<keyof typeof DEFAULT_STATISTICS, number | null>

@Injectable()
export class StatisticsService {
  constructor(
    private readonly emailService: EmailService,
    private readonly counterService: CounterService,
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
    private readonly feedbackService: FeedbackService,
    private readonly voteService: VoteService,
    private readonly tagService: TagService
  ) {}

  // Aggregate all stats and reset daily data at 00:01.
  @Cron('1 0 0 * * *', { name: 'DailyStatisticsJob' })
  async sendDailyStatisticsEmail() {
    try {
      const now = new Date()
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const createdAt = { $gte: oneDayAgo, $lt: now }
      const [todayViews, todayNewComments, todayArticleUpVotes, todayCommentUpVotes, todayCommentDownVotes] =
        await Promise.all([
          this.counterService.getGlobalCount(CacheKeys.TodayViewCount),
          this.commentService.countDocuments({ created_at: createdAt }),
          this.voteService.countDocuments({
            created_at: createdAt,
            target_type: VoteTarget.Article,
            vote_type: VoteType.Upvote
          }),
          this.voteService.countDocuments({
            created_at: createdAt,
            target_type: VoteTarget.Comment,
            vote_type: VoteType.Upvote
          }),
          this.voteService.countDocuments({
            created_at: createdAt,
            target_type: VoteTarget.Comment,
            vote_type: VoteType.Downvote
          })
        ])

      this.emailService.sendMailAs(APP_CONFIG.APP_BIZ.NAME, {
        to: APP_CONFIG.APP_BIZ.ADMIN_EMAIL,
        subject: 'Daily Statistics',
        ...linesToEmailContent([
          `Today views: ${todayViews}`,
          `Today new comments: ${todayNewComments}`,
          `Today new post votes: +${todayArticleUpVotes}`,
          `Today new comment votes: +${todayCommentUpVotes}, -${todayCommentDownVotes}`
        ])
      })
    } finally {
      this.counterService.resetGlobalCount(CacheKeys.TodayViewCount).catch((error) => {
        logger.warn('reset TODAY_VIEWS failed!', error)
      })
    }
  }

  public getStatistics(publicOnly: boolean) {
    const statistics: Statistics = { ...DEFAULT_STATISTICS }
    const tasks = Promise.all([
      this.tagService.getTotalCount().then((value) => {
        statistics.tags = value
      }),
      this.articleService.getTotalCount(publicOnly).then((value) => {
        statistics.articles = value
      }),
      this.commentService.getTotalCount(publicOnly).then((value) => {
        statistics.comments = value
      }),
      this.feedbackService.getRootFeedbackAverageEmotion().then((value) => {
        statistics.averageEmotion = value ?? 0
      }),
      this.articleService.getTotalStatistics().then((value) => {
        statistics.totalViews = value?.totalViews ?? 0
        statistics.totalLikes = value?.totalLikes ?? 0
      }),
      this.counterService.getGlobalCount(CacheKeys.TodayViewCount).then((value) => {
        statistics.todayViews = value
      })
    ])

    return tasks
      .then(() => statistics)
      .catch((error) => {
        logger.warn('getStatistics task partial failed!', error)
        return Promise.resolve(statistics)
      })
  }
}
