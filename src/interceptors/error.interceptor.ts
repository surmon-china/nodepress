import { Injectable, NestInterceptor, ExecutionContext, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { TMessage } from '@app/interfaces/http';
import * as META from '@app/constants/meta';
import * as TEXT from '@app/constants/text';
import buildCustomError from '@app/errors/custom';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
    const target = context.getHandler();
    const statusCode = this.reflector.get<HttpStatus>(META.HTTP_ERROR_CODE, target);
    const message = this.reflector.get<TMessage>(META.HTTP_ERROR_MESSAGE, target) || TEXT.HTTP_DEFAULT_ERROR_TEXT;
    return call$.pipe(
      catchError(error => throwError(buildCustomError({ message, error }, statusCode))),
    );
  }
}