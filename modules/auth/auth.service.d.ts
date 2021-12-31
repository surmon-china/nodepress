import { JwtService } from '@nestjs/jwt';
import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { TokenResult } from './auth.interface';
import { Auth } from './auth.model';
export declare class AuthService {
    private readonly jwtService;
    private readonly authModel;
    constructor(jwtService: JwtService, authModel: MongooseModel<Auth>);
    private getExistedPassword;
    createToken(): TokenResult;
    validateAuthData(payload: any): Promise<any>;
    getAdminInfo(): Promise<Auth>;
    putAdminInfo(auth: Auth): Promise<Auth>;
    adminLogin(password: string): Promise<TokenResult>;
}
