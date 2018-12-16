
import * as TEXT from '@app/constants/text.constant';
import { BadRequestException } from '@nestjs/common';
import { TMessage } from '@app/interfaces/http.interface';

export class HttpUnauthorizedError extends BadRequestException {
  constructor(message?: TMessage, error?: any) {
    super(message || TEXT.HTTP_BAD_REQUEST_TEXT_DEFAULT, error);
  }
}