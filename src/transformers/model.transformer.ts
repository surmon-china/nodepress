/**
 * Model transform.
 * @file 模型转换器
 * @description 用于将一个基本的 Typegoose 模型转换为 Model 和 Provider，及模型注入器
 * @description Fork from: https://github.com/kpfromer/nestjs-typegoose/blob/master/src/typegoose.providers.ts
 * @module transformer/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Connection } from 'mongoose';
import { Provider, Inject } from '@nestjs/common';
import { getModelForClass } from '@typegoose/typegoose';
import { DB_CONNECTION_TOKEN, DB_MODEL_TOKEN_SUFFIX } from '@app/constants/system.constant';

export interface TypegooseClass {
  new (...args: any[]);
}

export function getModelToken(modelName: string): string {
  return modelName + DB_MODEL_TOKEN_SUFFIX;
}

// 根据 Class 获取 Provider
export function getProviderByTypegooseClass(typegooseClass: TypegooseClass): Provider {
  return {
    provide: getModelToken(typegooseClass.name),
    useFactory: (connection: Connection) => getModelForClass(
      typegooseClass,
      { existingConnection: connection }
    ),
    inject: [DB_CONNECTION_TOKEN]
  };
}

// Model 注入器
export function InjectModel(model: TypegooseClass) {
  return Inject(getModelToken(model.name));
}
