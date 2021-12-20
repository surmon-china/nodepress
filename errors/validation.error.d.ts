import { HttpException } from '@nestjs/common';
export declare class ValidationError extends HttpException {
    constructor(error?: any);
}
