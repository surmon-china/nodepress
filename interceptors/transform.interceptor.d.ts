import { Observable } from 'rxjs';
import { NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
import { HttpResponseSuccess } from '@app/interfaces/response.interface';
export declare class TransformInterceptor<T> implements NestInterceptor<T, T | HttpResponseSuccess<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T | HttpResponseSuccess<T>>;
}
