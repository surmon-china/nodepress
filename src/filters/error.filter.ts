
import * as lodash from 'lodash';
import { isDevMode } from '@app/app.environment';
import { EStatus, THttpErrorResponse, TExceptionOption, TMessage } from '@app/interfaces/http.interface';
import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';

// new HttpException({ message: '错误信息', error: '错误信息来源' }, status)
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const errorOption: TExceptionOption = exception.message as TExceptionOption;
    const isString = (value): value is TMessage => lodash.isString(value);
    const errMessage = isString(errorOption) ? errorOption : errorOption.message;
    const errorInfo = isString(errorOption) ? null : errorOption.error;
    const data: THttpErrorResponse = {
      status: EStatus.Error,
      message: errMessage,
      error: errorInfo ? String(errorInfo) : null,
      debug: isDevMode ? exception.stack : null,
    };
    return response.status(status).jsonp(data);
  }
}