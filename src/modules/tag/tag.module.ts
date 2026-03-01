/**
 * @file Tag module
 * @module module/tag/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module, forwardRef } from '@nestjs/common'
import { ArticleModule } from '@app/modules/article/article.module'
import { TagController } from './tag.controller'
import { TagProvider } from './tag.model'
import { TagService } from './tag.service'
import { TagListener } from './tag.listener'

@Module({
  imports: [forwardRef(() => ArticleModule)],
  controllers: [TagController],
  providers: [TagProvider, TagService, TagListener],
  exports: [TagService]
})
export class TagModule {}
