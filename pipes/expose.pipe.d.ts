import { Request } from 'express';
import { PipeTransform } from '@nestjs/common';
declare global {
    namespace Express {
        interface Request {
            $validatedPayload?: any;
        }
    }
}
export declare class ExposePipe implements PipeTransform<any> {
    protected readonly request: Request;
    constructor(request: Request);
    transform(value: any): any;
}
