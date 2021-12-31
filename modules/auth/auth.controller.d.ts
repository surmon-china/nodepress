import { IPService } from '@app/processors/helper/helper.service.ip';
import { EmailService } from '@app/processors/helper/helper.service.email';
import { Auth, AuthPasswordPayload } from './auth.model';
import { AuthService } from './auth.service';
import { TokenResult } from './auth.interface';
export declare class AuthController {
    private readonly ipService;
    private readonly emailService;
    private readonly authService;
    constructor(ipService: IPService, emailService: EmailService, authService: AuthService);
    login({ visitor: { ip } }: {
        visitor: {
            ip: any;
        };
    }, body: AuthPasswordPayload): Promise<TokenResult>;
    getAdminInfo(): Promise<Auth>;
    putAdminInfo(auth: Auth): Promise<Auth>;
    checkToken(): string;
    renewalToken(): TokenResult;
}
