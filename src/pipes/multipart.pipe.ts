/**
 * @file Multipart pipe
 * @module pipe/multipart
 * @author Surmon <https://github.com/surmon-china>
 */

import _isUndefined from 'lodash/isUndefined'
import type { PipeTransform } from '@nestjs/common'
import type { IFile } from '@nestjs/common/pipes/file/interfaces'
import type { FileTypeValidatorOptions } from '@nestjs/common/pipes/file'
import { Injectable, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common'
import { UnprocessableEntityException, PayloadTooLargeException } from '@nestjs/common'
import type { IUploadedFile } from '@app/decorators/uploaded-file.decorator'

export interface MultipartValidationOptions {
  allowedType?: FileTypeValidatorOptions['fileType']
  maxFileSize?: number
}

/**
 * @class MultipartValidationPipe
 * @classdesc Validate multipart.
 * @link https://medium.com/@davidkasumovfrontend/file-uploading-using-nestjs-fastify-64703cd83d02
 */
@Injectable()
export class MultipartValidationPipe implements PipeTransform {
  constructor(private options: MultipartValidationOptions = {}) {}

  async transform(file: IUploadedFile): Promise<IUploadedFile> {
    const validatorFile: IFile = {
      mimetype: file.mimetype,
      size: file.fileSize,
      buffer: file.buffer
    }

    // Validate file type
    if (this.options.allowedType) {
      const typeValidator = new FileTypeValidator({ fileType: this.options.allowedType })
      if (!(await typeValidator.isValid(validatorFile))) {
        throw new UnprocessableEntityException(typeValidator.buildErrorMessage(validatorFile))
      }
    }

    // Validate file size
    if (this.options.maxFileSize) {
      const sizeValidator = new MaxFileSizeValidator({ maxSize: this.options.maxFileSize })
      if (!(await sizeValidator.isValid(validatorFile))) {
        throw new PayloadTooLargeException(sizeValidator.buildErrorMessage(validatorFile))
      }
    }

    return file
  }
}
