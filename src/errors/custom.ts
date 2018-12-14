
import { HttpException, HttpStatus } from '@nestjs/common';
import { TExceptionOption } from '@app/interfaces/http';

export default (options: TExceptionOption, statusCode?: HttpStatus) => {
  return new HttpException(options, statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
};