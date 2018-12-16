
import * as TEXT from '@app/constants/text.constant';
import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationError extends HttpException {
  constructor(error?: any) {
    super(error, HttpStatus.BAD_REQUEST);
  }
}