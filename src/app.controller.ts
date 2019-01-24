/**
 * App controller.
 * @file 主页控制器
 * @module app/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import * as APP_CONFIG from '@app/app.config';
import * as CACHE_KEY from '@app/constants/cache.constant';
import { Get, Controller } from '@nestjs/common';
import { HttpCache } from '@app/decorators/cache.decorator';

@Controller()
export class AppController {

  @Get()
  @HttpCache(CACHE_KEY.INFO, 60 * 60)
  root(): any {
   return APP_CONFIG.INFO;
  }
}
