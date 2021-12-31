import { Extend } from '@app/models/extend.model';
export declare const getExtendsObject: (_extends: Extend[]) => {
    [key: string]: string;
};
export declare const getExtendValue: (_extends: Extend[], key: string) => string | void;
