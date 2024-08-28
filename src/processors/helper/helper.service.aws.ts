/**
 * @file AWS storage service
 * @module module/extension/aws.service
 * @author Surmon <https://github.com/surmon-china>
 */

import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectAttributesCommand,
  ObjectAttributes,
  StorageClass,
  ServerSideEncryption,
  PutObjectRequest
} from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import * as APP_CONFIG from '@app/app.config'

export { StorageClass as AWSStorageClass, ServerSideEncryption as AWSServerSideEncryption } from '@aws-sdk/client-s3'

export interface FileUploader {
  name: string
  file: PutObjectRequest['Body'] | string | Uint8Array | Buffer
  fileContentType?: string
  region: string
  bucket: string
  classType?: StorageClass
  encryption?: ServerSideEncryption
}

export interface S3FileObject {
  key: string
  url: string
  eTag: string
  size: number
  lastModified?: Date
  storageClass?: StorageClass
}

@Injectable()
export class AWSService {
  private createClient(region: string) {
    return new S3Client({
      region,
      credentials: {
        accessKeyId: APP_CONFIG.AWS.accessKeyId,
        secretAccessKey: APP_CONFIG.AWS.secretAccessKey
      }
    })
  }

  private getAwsGeneralFileUrl(region: string, bucket: string, key: string) {
    // https://stackoverflow.com/questions/44400227/how-to-get-the-url-of-a-file-on-aws-s3-using-aws-sdk
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`
  }

  public getObjectAttributes(payload: { region: string; bucket: string; key: string }) {
    const s3Client = this.createClient(payload.region)
    const command = new GetObjectAttributesCommand({
      Bucket: payload.bucket,
      Key: payload.key,
      ObjectAttributes: Object.values(ObjectAttributes)
    })
    return s3Client.send(command)
  }

  public uploadFile(payload: FileUploader): Promise<S3FileObject> {
    const { region, bucket, name: key } = payload
    const s3Client = this.createClient(region)
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: payload.file,
      ContentType: payload.fileContentType,
      StorageClass: payload.classType ?? 'STANDARD',
      ServerSideEncryption: payload.encryption
    })
    return s3Client.send(command).then(() => {
      return this.getObjectAttributes({ region, bucket, key }).then((attributes) => ({
        key,
        url: this.getAwsGeneralFileUrl(region, bucket, key),
        size: attributes.ObjectSize!,
        eTag: attributes.ETag!,
        lastModified: attributes.LastModified,
        storageClass: attributes.StorageClass
      }))
    })
  }

  public getFileList(payload: { region: string; bucket: string; limit: number; prefix?: string; marker?: string }) {
    const s3Client = this.createClient(payload.region)
    const command = new ListObjectsCommand({
      Bucket: payload.bucket,
      Marker: payload.marker,
      Prefix: payload.prefix,
      MaxKeys: payload.limit
    })

    return s3Client.send(command).then((result) => ({
      name: result.Name,
      limit: result.MaxKeys,
      prefix: result.Prefix,
      marker: result.Marker,
      files: (result.Contents ?? []).map<S3FileObject>((object) => ({
        key: object.Key!,
        url: this.getAwsGeneralFileUrl(payload.region, payload.bucket, object.Key!),
        eTag: object.ETag!,
        size: object.Size!,
        lastModified: object.LastModified,
        storageClass: object.StorageClass
      }))
    }))
  }

  // TODO
  public async deleteFile() {}
}
