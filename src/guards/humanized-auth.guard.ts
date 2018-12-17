import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { HttpUnauthorizedError } from '@app/errors/unauthorized.error';

@Injectable()
export class HumanizedJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(error, authInfo, errInfo) {
    const okToken = !!authInfo;
    const noToken = !authInfo && errInfo && errInfo.message === 'No auth token';
    if (!error && (okToken || noToken)) {
      return authInfo;
    } else {
      throw error || new HttpUnauthorizedError(null, errInfo && errInfo.message);
    }
  }
}