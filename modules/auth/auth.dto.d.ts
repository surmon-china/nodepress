import { Auth } from './auth.model';
export declare class AuthLoginDTO {
    password: string;
}
export declare class AuthUpdateDTO extends Auth {
    new_password?: string;
}
