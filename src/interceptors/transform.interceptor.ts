import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { THttpSuccessResponse, EStatus } from '@app/interfaces/http.interface';
import { TMessage } from '@app/interfaces/http.interface';
import * as META from '@app/constants/meta.constant';
import * as TEXT from '@app/constants/text.constant';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, THttpSuccessResponse<T>> {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, call$: Observable<T>): Observable<THttpSuccessResponse<T>> {
    const target = context.getHandler();
    const message = this.reflector.get<TMessage>(META.HTTP_SUCCESS_MESSAGE, target) || TEXT.HTTP_DEFAULT_SUCCESS_TEXT;
    return call$.pipe(map(data => ({ status: EStatus.Success, message, result: data })));
  }
}