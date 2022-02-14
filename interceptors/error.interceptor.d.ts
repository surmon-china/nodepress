import { Observable } from 'rxjs';
import { NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
export declare class ErrorInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>;
}
