/**
 * Handle module.
 * @file 路由统一解析器模块
 * @module utils/handle
 * @author Surmon <https://github.com/surmon-china>
 */

import * as lodash from 'lodash';
import * as META from '@app/constants/meta.constant';
import * as TEXT from '@app/constants/text.constant';
import { ReflectMetadata, HttpStatus } from '@nestjs/common';
import { TMessage } from '@app/interfaces/http.interface';

// 构造器参数
interface IBuildDecoratorOption {
  errCode?: HttpStatus;
  successCode?: HttpStatus;
  errMessage?: TMessage;
  successMessage?: TMessage;
  usePaginate?: boolean;
}

// handle 参数
interface IHandleOption {
  error?: HttpStatus;
  success?: HttpStatus;
  message: TMessage;
  usePaginate?: boolean;
}
type THandleOption = TMessage | IHandleOption;

// 构造请求装饰器
const buildHttpDecorator = (options: IBuildDecoratorOption): MethodDecorator => {
  const { errMessage, successMessage, errCode, successCode, usePaginate } = options;
  return (_, __, descriptor: PropertyDescriptor) => {
    if (errCode) {
      ReflectMetadata(META.HTTP_ERROR_CODE, errCode)(descriptor.value);
    }
    if (successCode) {
      ReflectMetadata(META.HTTP_SUCCESS_CODE, successCode)(descriptor.value);
    }
    if (errMessage) {
      ReflectMetadata(META.HTTP_ERROR_MESSAGE, errMessage)(descriptor.value);
    }
    if (successMessage) {
      ReflectMetadata(META.HTTP_SUCCESS_MESSAGE, successMessage)(descriptor.value);
    }
    if (usePaginate) {
      ReflectMetadata(META.HTTP_RES_TRANSFORM_PAGINATE, true)(descriptor.value);
    }
    return descriptor;
  };
};

// 异常构造器
export const error = (message: TMessage, statusCode?: HttpStatus): MethodDecorator => {
  return buildHttpDecorator({ errMessage: message, errCode: statusCode });
};

// 成功构造器
export const success = (message: TMessage, statusCode?: HttpStatus): MethodDecorator => {
  return buildHttpDecorator({ successMessage: message, successCode: statusCode });
};

/*
统配构造器
@HttpProcessor.handle('获取项目列表')
@HttpProcessor.handle({ message: '操作', err: 500, success: 200, usePaginate: true })
*/
export const handle = (...args: [THandleOption]): MethodDecorator => {
  const option = args[0];
  const isOption = (value: THandleOption): value is IHandleOption => lodash.isObject(option);
  const message: TMessage = isOption(option) ? option.message : option;
  const errMessage: TMessage = message + TEXT.HTTP_ERROR_SUFFIX;
  const successMessage: TMessage = message + TEXT.HTTP_SUCCESS_SUFFIX;
  const errCode: HttpStatus = isOption(option) ? option.error : null;
  const successCode: HttpStatus = isOption(option) ? option.success : null;
  const usePaginate: boolean = isOption(option) ? option.usePaginate : null;
  return buildHttpDecorator({ errCode, successCode, errMessage, successMessage, usePaginate });
};

// 分页装饰器
export const paginate = (): MethodDecorator => {
  return buildHttpDecorator({ usePaginate: true });
};

export const HttpProcessor = { error, success, handle, paginate };
