import { Request } from 'express';
import { PipeTransform } from '@nestjs/common';
export declare class PermissionPipe implements PipeTransform<any> {
    protected readonly request: Request;
    constructor(request: Request);
    transform(value: any): any;
}
