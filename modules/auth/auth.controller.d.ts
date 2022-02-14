import { IPService } from '@app/processors/helper/helper.service.ip';
import { EmailService } from '@app/processors/helper/helper.service.email';
import { QueryParamsResult } from '@app/decorators/queryparams.decorator';
import { AuthLoginDTO, AuthUpdateDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { TokenResult } from './auth.interface';
import { Auth } from './auth.model';
export declare class AuthController {
    private readonly ipService;
    private readonly emailService;
    private readonly authService;
    constructor(ipService: IPService, emailService: EmailService, authService: AuthService);
    login({ visitor: { ip } }: QueryParamsResult, body: AuthLoginDTO): Promise<TokenResult>;
    getAdminInfo(): Promise<Auth>;
    putAdminInfo(auth: AuthUpdateDTO): Promise<Auth>;
    checkToken(): string;
    renewalToken(): TokenResult;
}
