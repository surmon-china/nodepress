/**
 * @file Extension statistic service
 * @module module/extension/statistic.service
 * @author Surmon <https://github.com/surmon-china>
 */

import schedule from 'node-schedule'
import { Injectable } from '@nestjs/common'
import { CacheService } from '@app/core/cache/cache.service'
import { EmailService } from '@app/core/helper/helper.service.email'
import { VoteTarget, VoteType } from '@app/modules/vote/vote.model'
import { VoteService } from '@app/modules/vote/vote.service'
import { ArticleService } from '@app/modules/article/article.service'
import { CommentService } from '@app/modules/comment/comment.service'
import { FeedbackService } from '@app/modules/feedback/feedback.service'
import { TagService } from '@app/modules/tag/tag.service'
import { getGlobalTodayViewsCount, resetGlobalTodayViewsCount } from './extension.helper'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import * as APP_CONFIG from '@app/app.config'

const logger = createLogger({ scope: 'StatisticService', time: isDevEnv })

const DEFAULT_STATISTIC = Object.freeze({
  tags: null,
  articles: null,
  comments: null,
  totalViews: null,
  totalLikes: null,
  todayViews: null,
  averageEmotion: null
})

export type Statistic = Record<keyof typeof DEFAULT_STATISTIC, number | null>

@Injectable()
export class StatisticService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly emailService: EmailService,
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
    private readonly feedbackService: FeedbackService,
    private readonly voteService: VoteService,
    private readonly tagService: TagService
  ) {
    // daily data cleaning at 00:01
    schedule.scheduleJob('1 0 0 * * *', async () => {
      try {
        const todayViewsCount = await getGlobalTodayViewsCount(this.cacheService)
        await this.dailyStatisticsTask(todayViewsCount)
      } finally {
        resetGlobalTodayViewsCount(this.cacheService).catch((error) => {
          logger.warn('reset TODAY_VIEWS failed!', error)
        })
      }
    })
  }

  private async dailyStatisticsTask(todayViews: number) {
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const createdAt = { $gte: oneDayAgo, $lt: now }
    const [todayNewComments, todayArticleUpVotes, todayCommentUpVotes, todayCommentDownVotes] = await Promise.all([
      this.commentService.countDocuments({ created_at: createdAt }),
      this.voteService.countDocuments({
        created_at: createdAt,
        target_type: VoteTarget.Post,
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

    const emailContents = [
      `Today views: ${todayViews}`,
      `Today new comments: ${todayNewComments}`,
      `Today new post votes: +${todayArticleUpVotes}`,
      `Today new comment votes: +${todayCommentUpVotes}, -${todayCommentDownVotes}`
    ]

    this.emailService.sendMailAs(APP_CONFIG.APP_BIZ.NAME, {
      to: APP_CONFIG.APP_BIZ.ADMIN_EMAIL,
      subject: 'Daily Statistics',
      text: emailContents.join('\n'),
      html: emailContents.map((text) => `<p>${text}</p>`).join('\n')
    })
  }

  public getStatistic(publicOnly: boolean) {
    const statisticData: Statistic = { ...DEFAULT_STATISTIC }
    const tasks = Promise.all([
      this.tagService.getTotalCount().then((value) => {
        statisticData.tags = value
      }),
      this.articleService.getTotalCount(publicOnly).then((value) => {
        statisticData.articles = value
      }),
      this.commentService.getTotalCount(publicOnly).then((value) => {
        statisticData.comments = value
      }),
      this.feedbackService.getRootFeedbackAverageEmotion().then((value) => {
        statisticData.averageEmotion = value ?? 0
      }),
      this.articleService.getMetaStatistic().then((value) => {
        statisticData.totalViews = value?.totalViews ?? 0
        statisticData.totalLikes = value?.totalLikes ?? 0
      }),
      getGlobalTodayViewsCount(this.cacheService).then((value) => {
        statisticData.todayViews = value
      })
    ])

    return tasks
      .then(() => statisticData)
      .catch((error) => {
        logger.warn('getStatistic task partial failed!', error)
        return Promise.resolve(statisticData)
      })
  }
}
