export declare class Auth {
    name: string;
    slogan: string;
    gravatar: string;
    password?: string;
    new_password?: string;
}
export declare class AuthPasswordPayload {
    password: string;
}
export declare const AuthProvider: import("@nestjs/common").Provider<any>;
