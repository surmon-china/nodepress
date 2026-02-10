/**
 * @file Webhook module
 * @module module/webhook/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { WebhookService } from './webhook.service'
import { WebhookListener } from './webhook.listener'

@Module({
  imports: [HttpModule],
  providers: [WebhookService, WebhookListener],
  exports: [WebhookService]
})
export class WebhookModule {}
