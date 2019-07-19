/**
 * Model transform.
 * @file 模型转换器
 * @description 用于将一个基本的 Typegoose 模型转换为 Model 和 Provider，及模型注入器
 * @module transform/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Connection } from 'mongoose';
import { Provider, Inject } from '@nestjs/common';
import { Typegoose, GetModelForClassOptions, ModelType } from 'typegoose';
import { DB_CONNECTION_TOKEN, DB_MODEL_TOKEN_SUFFIX } from '@app/constants/system.constant';

type TypegooseClass<T extends Typegoose> = new (...args: any[]) => T;

export function getModelToken(modelName: string): string {
  return modelName + DB_MODEL_TOKEN_SUFFIX;
}

// 根据 Typegoose 获取 Model
export function getModelBySchema<T extends Typegoose>(
  typegooseClass: TypegooseClass<T>,
  schemaOptions: GetModelForClassOptions = {},
): ModelType<T> {
  return new typegooseClass().getModelForClass(typegooseClass, schemaOptions);
}

// 根据 Model 获取 Provider
export function getProviderByModel<T>(model: ModelType<T>): Provider<T> {
  return {
    provide: getModelToken(model.modelName),
    useFactory: (connection: Connection) => model,
    inject: [DB_CONNECTION_TOKEN],
  };
}

// 根据 Typegoose 获取 Provider（会重复实例 Model，不建议使用）
export function getProviderBySchema<T extends Typegoose>(
  typegooseClass: TypegooseClass<T>,
  schemaOptions: GetModelForClassOptions = {},
): Provider<T> {
  return getProviderByModel(
    getModelBySchema(typegooseClass, schemaOptions),
  );
}

// 注入器
export function InjectModel<T extends Typegoose>(model: TypegooseClass<T>) {
  return Inject(getModelToken(model.name));
}
