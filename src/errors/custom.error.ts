
import * as TEXT from '@app/constants/text.constant';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TExceptionOption } from '@app/interfaces/http.interface';

export class CustomError extends HttpException {
  constructor(options: TExceptionOption, statusCode?: HttpStatus) {
    super(options, statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
  }
}