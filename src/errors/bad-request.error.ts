
import * as TEXT from '@app/constants/text.constant';
import { HttpException, HttpStatus } from '@nestjs/common';

export class HttpBadRequestError extends HttpException {
  constructor(error?: any) {
    super(error || TEXT.HTTP_BAD_REQUEST_TEXT_DEFAULT, HttpStatus.BAD_REQUEST);
  }
}