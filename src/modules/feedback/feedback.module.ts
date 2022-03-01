/**
 * @file Feedback module
 * @module module/feedback/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { FeedbackProvider } from './feedback.model'
import { FeedbackService } from './feedback.service'
import { FeedbackController } from './feedback.controller'

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackProvider, FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
