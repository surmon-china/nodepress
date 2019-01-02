/**
 * Helper module.
 * @file Helper 全局模块
 * @module processor/helper/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module, Global, HttpModule } from '@nestjs/common';
import { AkismetService } from './helper.service.akismet';
import { BaiduSeoService } from './helper.service.baidu-seo';
import { EmailService } from './helper.service.email';
import { IpService } from './helper.service.ip';

const services = [AkismetService, BaiduSeoService, EmailService, IpService];

@Global()
@Module({
  imports: [HttpModule],
  providers: services,
  exports: services,
})
export class HelperModule {}
