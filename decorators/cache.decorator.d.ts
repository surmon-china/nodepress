export interface HttpCacheOption {
    ttl?: number;
    key?: string;
}
export declare function HttpCache(option: HttpCacheOption): MethodDecorator;
export declare function HttpCache(key: string, ttl?: number): MethodDecorator;
export declare const getHttpCacheKey: (target: any) => HttpCacheOption['key'];
export declare const getHttpCacheTTL: (target: any) => HttpCacheOption['ttl'];
