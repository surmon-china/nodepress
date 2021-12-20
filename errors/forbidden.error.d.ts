import { HttpException } from '@nestjs/common';
export declare class HttpForbiddenError extends HttpException {
    constructor(error?: any);
}
