/**
 * Option controller.
 * @file 设置模块控制器
 * @module module/option/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { OptionService } from './option.service';
import { Option } from './option.model';

@Controller('option')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Get()
  @HttpProcessor.handle('获取设置')
  getOption(): Promise<Option> {
    return this.optionService.getOption();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('修改设置')
  putOption(@Body() option: Option): Promise<Option> {
    return this.optionService.putOption(option);
  }
}
