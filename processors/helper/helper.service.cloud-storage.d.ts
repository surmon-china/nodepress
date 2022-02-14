import OSS from 'ali-oss';
export interface UploadToken {
    AccessKeyId: string;
    AccessKeySecret: string;
    SecurityToken: string;
    Expiration: string;
}
export declare class CloudStorageService {
    private sts;
    constructor();
    getToken(): Promise<UploadToken>;
    uploadFile(name: string, file: any, region: string, bucket: string): Promise<OSS.PutObjectResult>;
}
