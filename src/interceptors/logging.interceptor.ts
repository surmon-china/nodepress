import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { consola } from '@app/transforms/module.transform';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    consola.log('Before...');

    const now = Date.now();
    return call$.pipe(
      tap(() => consola.log(`After... ${Date.now() - now}ms`)),
    );
  }
}