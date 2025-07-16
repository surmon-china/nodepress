/**
 * @file UploadedFile decorator
 * @module decorator/uploaded-file
 * @author Surmon <https://github.com/surmon-china>
 */

import type { FastifyRequest } from 'fastify'
import type { MultipartFile } from '@fastify/multipart'
import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common'

export interface IUploadedFile {
  file: MultipartFile['file']
  fileName: string
  fileSize: number
  mimetype: string
  encoding: string
  buffer: Buffer
  fields: Record<string, string>
}

/**
 * @function UploadedFile
 * @example ```@UploadedFile() file: IUploadedFile```
 */
export const UploadedFile = createParamDecorator(async (_, context: ExecutionContext): Promise<IUploadedFile> => {
  const request = context.switchToHttp().getRequest<FastifyRequest>()

  // Fastify MultipartFile
  const file = await request.file()
  if (!file) throw new BadRequestException('No file uploaded')

  // https://github.com/fastify/fastify-multipart/issues/196
  // https://github.com/fastify/fastify-multipart/issues/250
  // https://github.com/fastify/fastify-multipart
  // NOTE: This decorator reads the entire file into memory (Buffer).
  const buffer = await file.toBuffer()

  // Extract fields from the file
  const fields: IUploadedFile['fields'] = {}
  for (const [key, field] of Object.entries(file.fields ?? {})) {
    const item = Array.isArray(field) ? field[0] : field
    if (item && item.type === 'field') {
      fields[key] = item.value as string
    }
  }

  const uploadedFile: IUploadedFile = {
    file: file.file,
    fileName: file.filename,
    fileSize: buffer.byteLength,
    mimetype: file.mimetype,
    encoding: file.encoding,
    buffer,
    fields
  }

  return uploadedFile
})
