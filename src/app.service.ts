/**
 * App service.
 * @file App 全局服务
 * @module app.servicce
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  // 这里可以提供一些如 redis 的缓存服务
  root(): string {
   return 'Hello World!';
  }
}
