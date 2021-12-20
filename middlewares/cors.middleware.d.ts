import { Request, Response } from 'express';
import { NestMiddleware } from '@nestjs/common';
export declare class CorsMiddleware implements NestMiddleware {
    use(request: Request, response: Response, next: any): any;
}
