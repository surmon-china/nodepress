import { ExecutionContext } from '@nestjs/common';
declare const AdminMaybeGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class AdminMaybeGuard extends AdminMaybeGuard_base {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
    handleRequest(error: any, authInfo: any, errInfo: any): any;
}
export {};
