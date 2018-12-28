/**
 * Helper module.
 * @file Helper 模块
 * @module modules/helper/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module, Global, HttpModule } from '@nestjs/common';
import { AkismetService } from './helper.akismet.service';
import { BaiduSeoService } from './helper.baidu-seo.service';
import { EmailService } from './helper.email.service';
import { IpService } from './helper.ip.service';

const services = [AkismetService, BaiduSeoService, EmailService, IpService];

@Global()
@Module({
  imports: [HttpModule],
  providers: services,
  exports: services,
})
export class HelperModule {}
