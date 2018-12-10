
import { isDevMode } from '@app/app.environment';
import { EStatus, THttpErrorResponse } from '@app/interfaces/http';
import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';

/*
new HttpException({ message: '错误信息', error: '错误信息来源' }, status)
*/
@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = error instanceof HttpException
      ? error.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const { message, error: errorInfo } = error.message as any;
    const data: THttpErrorResponse = {
      status: EStatus.Error,
      message,
      error: String(errorInfo),
      debug: isDevMode ? error.stack : null,
    };
    return response.status(status).jsonp(data);
  }
}