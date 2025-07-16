/**
 * @file Model transform & helper
 * @module transformer/model
 * @description transform Typegoose Class into model & provider & injecter
 * @link https://github.com/kpfromer/nestjs-typegoose/blob/master/src/typegoose.providers.ts
 * @author Surmon <https://github.com/surmon-china>
 */

import { Connection } from 'mongoose'
import { Provider, Inject } from '@nestjs/common'
import { getModelForClass } from '@typegoose/typegoose'
import { DB_CONNECTION_TOKEN, DB_MODEL_TOKEN_SUFFIX } from '@app/constants/database.constant'

export interface TypegooseClass {
  new (...args: any[])
}

export function getModelToken(modelName: string): string {
  return modelName + DB_MODEL_TOKEN_SUFFIX
}

// Get Provider by Class
export function getProviderByTypegooseClass(typegooseClass: TypegooseClass): Provider {
  return {
    provide: getModelToken(typegooseClass.name),
    useFactory: (connection: Connection) => getModelForClass(typegooseClass, { existingConnection: connection }),
    inject: [DB_CONNECTION_TOKEN]
  }
}

// Model injecter
export function InjectModel(model: TypegooseClass) {
  return Inject(getModelToken(model.name))
}
