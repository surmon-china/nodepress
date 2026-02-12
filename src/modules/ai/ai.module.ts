/**
 * @file AI module
 * @module module/ai/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { OptionsModule } from '@app/modules/options/options.module'
import { ArticleModule } from '@app/modules/article/article.module'
import { CommentModule } from '@app/modules/comment/comment.module'
import { AiController } from './ai.controller'
import { AiListener } from './ai.listener'
import { AiService } from './ai.service'

@Module({
  imports: [HttpModule, OptionsModule, ArticleModule, CommentModule],
  controllers: [AiController],
  providers: [AiService, AiListener],
  exports: [AiService]
})
export class AiModule {}
