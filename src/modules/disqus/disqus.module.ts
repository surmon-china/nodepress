/**
 * @file Disqus module
 * @module module/disqus/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { OptionsModule } from '@app/modules/options/options.module'
import { ArticleModule } from '@app/modules/article/article.module'
import { CommentModule } from '@app/modules/comment/comment.module'
import { DisqusController } from './disqus.controller'
import { DisqusPublicService } from './disqus.service.public'
import { DisqusPrivateService } from './disqus.service.private'

@Module({
  imports: [HttpModule, OptionsModule, ArticleModule, CommentModule],
  controllers: [DisqusController],
  providers: [DisqusPublicService, DisqusPrivateService],
  exports: [DisqusPublicService, DisqusPrivateService]
})
export class DisqusModule {}
