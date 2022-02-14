export declare const DEFAULT_AUTH: Readonly<Auth>;
export declare class Auth {
    name: string;
    slogan: string;
    avatar: string;
    password?: string;
}
export declare const AuthProvider: import("@nestjs/common").Provider<any>;
