import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import buildUnauthorizedException from '@app/errors/unauthorized';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(error, data) {
    if (data && !error) {
      return data;
    } else {
      throw error || buildUnauthorizedException();
    }
  }
}