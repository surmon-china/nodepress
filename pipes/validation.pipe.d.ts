import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class ValidationPipe implements PipeTransform<any> {
    private toValidate;
    transform(value: any, { metatype }: ArgumentMetadata): Promise<any>;
}
