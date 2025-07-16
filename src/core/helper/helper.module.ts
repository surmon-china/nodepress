/**
 * @file General helper module
 * @module core/helper/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module, Global } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { GoogleService } from './helper.service.google'
import { AkismetService } from './helper.service.akismet'
import { AWSService } from './helper.service.aws'
import { EmailService } from './helper.service.email'
import { SeoService } from './helper.service.seo'
import { IPService } from './helper.service.ip'

const services = [GoogleService, AkismetService, AWSService, EmailService, SeoService, IPService]

@Global()
@Module({
  imports: [HttpModule],
  providers: services,
  exports: services
})
export class HelperModule {}
