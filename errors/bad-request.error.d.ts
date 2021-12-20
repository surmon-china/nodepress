import { HttpException } from '@nestjs/common';
export declare class HttpBadRequestError extends HttpException {
    constructor(error?: any);
}
