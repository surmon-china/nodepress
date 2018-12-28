/**
 * Helper module.
 * @file Helper 模块
 * @module modules/helper/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module, HttpModule } from '@nestjs/common';
import { AkismetService } from './akismet.service';
import { BaiduSeoService } from './baidu-seo.service';
import { EmailService } from './email.service';
import { IpService } from './ip.service';

const services = [AkismetService, BaiduSeoService, EmailService, IpService];

@Module({
  imports: [HttpModule],
  providers: services,
  exports: services,
})
export class HelperModule {}
