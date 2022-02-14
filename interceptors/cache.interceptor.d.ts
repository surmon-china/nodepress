import { Observable } from 'rxjs';
import { HttpAdapterHost, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { CacheService } from '@app/processors/cache/cache.service';
export declare class HttpCacheInterceptor implements NestInterceptor {
    private readonly httpAdapterHost;
    private readonly cacheService;
    constructor(httpAdapterHost: HttpAdapterHost, cacheService: CacheService);
    intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>>;
    trackBy(context: ExecutionContext): string | undefined;
}
