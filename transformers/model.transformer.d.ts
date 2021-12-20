import { Provider } from '@nestjs/common';
export interface TypegooseClass {
    new (...args: any[]): any;
}
export declare function getModelToken(modelName: string): string;
export declare function getProviderByTypegooseClass(typegooseClass: TypegooseClass): Provider;
export declare function InjectModel(model: TypegooseClass): (target: object, key: string | symbol, index?: number) => void;
