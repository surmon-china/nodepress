
import * as lodash from 'lodash';
import * as META from '@app/constants/meta.constant';
import { ReflectMetadata, CacheKey } from '@nestjs/common';

interface ICacheOption {
  ttl?: number;
  key?: string;
}

type TCacheOptions = [string, number?] | [ICacheOption];

/*
统配构造器
@HttpCache(CACHE_KEY.INFO, 60 * 60)
@HttpCache({ key: CACHE_KEY.INFO, ttl: 60 * 60 })
*/
export function HttpCache(...args: TCacheOptions): MethodDecorator {
  const option = args[0];
  const isOption = (value): value is ICacheOption => lodash.isObject(option);
  const key: string = isOption(option) ? option.key : option;
  const ttl: number = isOption(option) ? option.ttl : (args[1] || null);
  return (_, __, descriptor: PropertyDescriptor) => {
    if (key) {
      CacheKey(key)(descriptor.value);
      // ReflectMetadata(META.HTTP_CACHE_KEY_METADATA, key)(descriptor.value);
    }
    if (ttl) {
      ReflectMetadata(META.HTTP_CACHE_TTL_METADATA, ttl)(descriptor.value);
    }
    return descriptor;
  };
}
