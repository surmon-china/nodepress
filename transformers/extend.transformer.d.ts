import { ExtendModel } from '@app/models/extend.model';
export declare const getExtendObject: (_extends: ExtendModel[]) => {
    [key: string]: string;
};
export declare const getExtendValue: (_extends: ExtendModel[], key: string) => string | void;
