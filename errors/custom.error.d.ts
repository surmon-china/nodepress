import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionInfo } from '@app/interfaces/response.interface';
export declare class CustomError extends HttpException {
    constructor(options: ExceptionInfo, statusCode?: HttpStatus);
}
