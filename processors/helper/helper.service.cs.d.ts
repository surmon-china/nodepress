import OSS from 'ali-oss';
export interface IUpToken {
    AccessKeyId: string;
    AccessKeySecret: string;
    SecurityToken: string;
    Expiration: string;
}
export declare class CloudStorageService {
    private sts;
    constructor();
    getToken(): Promise<IUpToken>;
    uploadFile(name: string, file: any, region: string, bucket: string): Promise<OSS.PutObjectResult>;
}
