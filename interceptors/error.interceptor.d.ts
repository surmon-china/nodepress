import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
export declare class ErrorInterceptor implements NestInterceptor {
    private readonly reflector;
    constructor(reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>;
}
