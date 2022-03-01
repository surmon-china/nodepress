import { KeyValueModel } from '@app/models/key-value.model';
export declare const getExtendObject: (_extends: KeyValueModel[]) => {
    [key: string]: string;
};
export declare const getExtendValue: (_extends: KeyValueModel[], key: string) => string | void;
