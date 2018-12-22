
import * as lodash from 'lodash';
import { isDevMode } from '@app/app.environment';
import { EStatus, THttpErrorResponse, TExceptionOption, TMessage } from '@app/interfaces/http.interface';
import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // const request = host.switchToHttp().getRequest();
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const errorOption: TExceptionOption = exception.message as TExceptionOption;
    const isString = (value): value is TMessage => lodash.isString(value);
    const errMessage = isString(errorOption) ? errorOption : errorOption.message;
    const errorInfo = isString(errorOption) ? null : errorOption.error;
    const parentErrorInfo = errorInfo ? String(errorInfo) : null;
    const isChildrenError = errorInfo.status && errorInfo.message;
    const resultError = isChildrenError ? errorInfo.message : parentErrorInfo;
    const resultStatus = isChildrenError ? errorInfo.status : status;
    const data: THttpErrorResponse = {
      status: EStatus.Error,
      message: errMessage,
      error: resultError,
      debug: isDevMode ? exception.stack : null,
    };
    return response.status(resultStatus).jsonp(data);
  }
}