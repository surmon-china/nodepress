/**
 * Option module.
 * @file 设置模块
 * @module module/option/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { OptionController } from './option.controller';
import { OptionService } from './option.service';
import { Option } from './option.model';

@Module({
  imports: [TypegooseModule.forFeature(Option)],
  controllers: [OptionController],
  providers: [OptionService],
  exports: [OptionService],
})
export class OptionModule {}
