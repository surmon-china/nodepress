/**
 * App controller.
 * @file 主页控制器
 * @module app/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import * as APP_CONFIG from '@app/app.config';
import { Get, Controller } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  root(): any {
   return APP_CONFIG.INFO;
  }
}
