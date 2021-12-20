export interface HttpCacheOption {
    ttl?: number;
    key?: string;
}
export declare function HttpCache(option: HttpCacheOption): MethodDecorator;
export declare function HttpCache(key: string, ttl?: number): MethodDecorator;
