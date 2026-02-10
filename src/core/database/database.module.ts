/**
 * @file Database module
 * @module core/database/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module, Global } from '@nestjs/common'
import { databaseProvider } from './database.provider'
import { DatabaseListener } from './database.listener'

@Global()
@Module({
  providers: [databaseProvider, DatabaseListener],
  exports: [databaseProvider]
})
export class DatabaseModule {}
