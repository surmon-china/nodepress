import { Credentials } from 'google-auth-library';
export declare class GoogleService {
    private jwtClient;
    constructor();
    private initClient;
    getCredentials(): Promise<Credentials>;
}
