
import * as TEXT from '@app/constants/text';
import { UnauthorizedException } from '@nestjs/common';
import { TMessage } from '@app/interfaces/http';

export default (message?: TMessage, error?: any) => {
  return new UnauthorizedException(message || TEXT.HTTP_DEFAULT_UNAUTHORIZED_TEXT, error);
};