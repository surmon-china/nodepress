/**
 * Helper module.
 * @file Helper 全局模块
 * @module processor/helper/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module, Global, HttpModule } from '@nestjs/common';
import { GoogleService } from './helper.service.google';
import { AkismetService } from './helper.service.akismet';
import { CloudStorageService } from './helper.service.cs';
import { EmailService } from './helper.service.email';
import { SeoService } from './helper.service.seo';
import { IPService } from './helper.service.ip';

const services = [GoogleService, AkismetService, CloudStorageService, EmailService, SeoService, IPService];

@Global()
@Module({
  imports: [HttpModule],
  providers: services,
  exports: services,
})
export class HelperModule {}
