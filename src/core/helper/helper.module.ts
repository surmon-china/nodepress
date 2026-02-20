/**
 * @file General helper module
 * @module core/helper/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { HttpModule } from '@nestjs/axios'
import { Module, Global } from '@nestjs/common'
import { CounterService } from './helper.service.counter'
import { GoogleService } from './helper.service.google'
import { EmailService } from './helper.service.email'
import { SeoService } from './helper.service.seo'
import { IPService } from './helper.service.ip'
import { S3Service } from './helper.service.s3'

const services = [CounterService, GoogleService, S3Service, EmailService, SeoService, IPService]

@Global()
@Module({
  imports: [HttpModule],
  providers: services,
  exports: services
})
export class HelperModule {}
