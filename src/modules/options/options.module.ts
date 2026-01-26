/**
 * @file Options module
 * @module module/options/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { OptionsController } from './options.controller'
import { OptionsProvider } from './options.model'
import { OptionsService } from './options.service'

@Module({
  controllers: [OptionsController],
  providers: [OptionsProvider, OptionsService],
  exports: [OptionsService]
})
export class OptionsModule {}
