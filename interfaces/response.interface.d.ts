export declare type ResponseMessage = string;
export declare enum ResponseStatus {
    Error = "error",
    Success = "success"
}
export interface HttpResponseBase {
    status: ResponseStatus;
    message: ResponseMessage;
}
export declare type ExceptionInfo = ResponseMessage | {
    message: ResponseMessage;
    error?: any;
};
export interface HttpPaginateResult<T> {
    data: T;
    pagination: {
        total: number;
        current_page: number;
        total_page: number;
        per_page: number;
    };
}
export declare type HttpResponseError = HttpResponseBase & {
    error: any;
    debug?: string;
};
export declare type HttpResponseSuccess<T> = HttpResponseBase & {
    params?: any;
    result: T | HttpPaginateResult<T>;
};
export declare type HttpResponse<T> = HttpResponseError | HttpResponseSuccess<T>;
