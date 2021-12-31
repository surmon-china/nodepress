import { AccessToken } from '@app/utils/disqus';
export declare const TOKEN_COOKIE_KEY = "_disqus";
export declare const encodeToken: (token: AccessToken) => string;
export declare const decodeToken: (token: string) => AccessToken | null;
export declare const CookieToken: (...dataOrPipes: (string | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
