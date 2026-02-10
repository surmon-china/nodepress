/**
 * @file General helper module
 * @module core/helper/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module, Global } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { CounterService } from './helper.service.counter'
import { GoogleService } from './helper.service.google'
import { AkismetService } from './helper.service.akismet'
import { EmailService } from './helper.service.email'
import { SeoService } from './helper.service.seo'
import { IPService } from './helper.service.ip'
import { S3Service } from './helper.service.s3'

const services = [CounterService, GoogleService, AkismetService, S3Service, EmailService, SeoService, IPService]

@Global()
@Module({
  imports: [HttpModule],
  providers: services,
  exports: services
})
export class HelperModule {}
