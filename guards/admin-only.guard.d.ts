import { ExecutionContext } from '@nestjs/common';
declare const AdminOnlyGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class AdminOnlyGuard extends AdminOnlyGuard_base {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
    handleRequest(error: any, authInfo: any, errInfo: any): any;
}
export {};
