import { Cache } from 'cache-manager';
export declare type CacheKey = string;
export declare type CacheResult<T> = Promise<T>;
export interface CacheIOResult<T> {
    get(): CacheResult<T>;
    update(): CacheResult<T>;
}
export interface CachePromiseOption<T> {
    key: CacheKey;
    promise(): CacheResult<T>;
}
export interface CachePromiseIOOption<T> extends CachePromiseOption<T> {
    ioMode?: boolean;
}
export declare type CacheIntervalResult<T> = () => CacheResult<T>;
export interface CacheIntervalOption<T> {
    key: CacheKey;
    promise(): CacheResult<T>;
    timeout?: {
        error?: number;
        success?: number;
    };
    timing?: {
        error: number;
        schedule: any;
    };
}
export interface CacheIntervalIOOption<T> extends CacheIntervalOption<T> {
    ioMode?: boolean;
}
export declare class CacheService {
    private cacheStore;
    private isReadied;
    constructor(cacheManager: Cache);
    get<T>(key: CacheKey): CacheResult<T>;
    delete(key: CacheKey): CacheResult<void>;
    set(key: CacheKey, value: any, options?: {
        ttl: number;
    }): CacheResult<void>;
    promise<T>(options: CachePromiseOption<T>): CacheResult<T>;
    promise<T>(options: CachePromiseIOOption<T>): CacheIOResult<T>;
    interval<T>(options: CacheIntervalOption<T>): CacheIntervalResult<T>;
    interval<T>(options: CacheIntervalIOOption<T>): CacheIOResult<T>;
}
