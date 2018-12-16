
import * as TEXT from '@app/constants/text.constant';
import { UnauthorizedException } from '@nestjs/common';
import { TMessage } from '@app/interfaces/http.interface';

export class HttpUnauthorizedError extends UnauthorizedException {
  constructor(message?: TMessage, error?: any) {
    super(message || TEXT.HTTP_UNAUTHORIZED_TEXT_DEFAULT, error);
  }
}