/// <reference types="node" />
import { StorageClass, ServerSideEncryption, PutObjectRequest } from '@aws-sdk/client-s3';
export interface FileUploader {
    name: string;
    file: PutObjectRequest['Body'] | string | Uint8Array | Buffer;
    fileContentType?: string;
    region: string;
    bucket: string;
    classType?: StorageClass;
    encryption?: ServerSideEncryption;
}
export declare class AWSService {
    private createClient;
    getObjectAttributes(payload: {
        region: string;
        bucket: string;
        key: string;
    }): Promise<import("@aws-sdk/client-s3").GetObjectAttributesCommandOutput>;
    uploadFile(payload: FileUploader): Promise<{
        key: string;
        url: string;
        eTag: string | undefined;
        size: number | undefined;
    }>;
}
