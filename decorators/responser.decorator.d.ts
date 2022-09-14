import { HttpStatus } from '@nestjs/common';
import { ResponseMessage } from '@app/interfaces/response.interface';
export interface ResponserOptions extends Omit<DecoratorCreatorOption, 'usePaginate'> {
    transform?: boolean;
    paginate?: boolean;
}
export declare const getResponserOptions: (target: any) => ResponserOptions;
interface DecoratorCreatorOption {
    errorCode?: HttpStatus;
    successCode?: HttpStatus;
    errorMessage?: ResponseMessage;
    successMessage?: ResponseMessage;
    usePaginate?: boolean;
}
interface HandleOption {
    error?: HttpStatus;
    success?: HttpStatus;
    message: ResponseMessage;
    usePaginate?: boolean;
}
declare type HandleOptionConfig = ResponseMessage | HandleOption;
export declare const error: (message: ResponseMessage, statusCode?: HttpStatus) => MethodDecorator;
export declare const success: (message: ResponseMessage, statusCode?: HttpStatus) => MethodDecorator;
export declare function handle(args: HandleOptionConfig): MethodDecorator;
export declare const paginate: () => MethodDecorator;
export declare const Responser: {
    error: (message: ResponseMessage, statusCode?: HttpStatus) => MethodDecorator;
    success: (message: ResponseMessage, statusCode?: HttpStatus) => MethodDecorator;
    handle: typeof handle;
    paginate: () => MethodDecorator;
};
export {};
