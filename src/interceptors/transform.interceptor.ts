import { Injectable, NestInterceptor, ExecutionContext, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { THttpSuccessResponse, EStatus } from '@app/interfaces/http';
import { TMessage } from '@app/interfaces/http';
import * as META from '@app/constants/meta';
import * as TEXT from '@app/constants/text';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, THttpSuccessResponse<T>> {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, call$: Observable<T>): Observable<THttpSuccessResponse<T>> {
    const target = context.getHandler();
    const message = this.reflector.get<TMessage>(META.HTTP_SUCCESS_MESSAGE, target) || TEXT.HTTP_DEFAULT_SUCCESS_TEXT;
    return call$.pipe(map(data => ({ status: EStatus.Success, message, result: data })));
  }
}