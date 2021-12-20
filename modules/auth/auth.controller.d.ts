import { IPService } from '@app/processors/helper/helper.service.ip';
import { EmailService } from '@app/processors/helper/helper.service.email';
import { AuthService } from './auth.service';
import { TokenResult } from './auth.interface';
import { Auth, AuthPasswordPayload } from './auth.model';
export declare class AuthController {
    private readonly ipService;
    private readonly emailService;
    private readonly authService;
    constructor(ipService: IPService, emailService: EmailService, authService: AuthService);
    getAdminInfo(): Promise<Auth>;
    putAdminInfo(auth: Auth): Promise<Auth>;
    login({ visitors: { ip } }: {
        visitors: {
            ip: any;
        };
    }, body: AuthPasswordPayload): Promise<TokenResult>;
    checkToken(): string;
    renewalToken(): TokenResult;
}
