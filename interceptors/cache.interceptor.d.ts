import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { HttpAdapterHost, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { CacheService } from '@app/processors/cache/cache.service';
export declare class HttpCacheInterceptor implements NestInterceptor {
    private readonly reflector;
    private readonly httpAdapterHost;
    private readonly cacheService;
    constructor(reflector: Reflector, httpAdapterHost: HttpAdapterHost, cacheService: CacheService);
    intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>>;
    trackBy(context: ExecutionContext): string | undefined;
}
