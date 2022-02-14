import { HttpStatus } from '@nestjs/common';
import { ResponseMessage } from '@app/interfaces/response.interface';
export interface ResponsorOptions extends Omit<DecoratorCreatorOption, 'usePaginate'> {
    transform?: boolean;
    paginate?: boolean;
}
export declare const getResponsorOptions: (target: any) => ResponsorOptions;
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
export declare const error: (message: ResponseMessage, statusCode?: HttpStatus | undefined) => MethodDecorator;
export declare const success: (message: ResponseMessage, statusCode?: HttpStatus | undefined) => MethodDecorator;
export declare function handle(args: HandleOptionConfig): MethodDecorator;
export declare const paginate: () => MethodDecorator;
export declare const Responsor: {
    error: (message: ResponseMessage, statusCode?: HttpStatus | undefined) => MethodDecorator;
    success: (message: ResponseMessage, statusCode?: HttpStatus | undefined) => MethodDecorator;
    handle: typeof handle;
    paginate: () => MethodDecorator;
};
export {};
