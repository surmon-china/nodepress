export declare const DISQUS_PUBKEY = "E8Uh5l5fHZ6gD8U3KycjAIAk46f68Zw7C6eW8WSjZvCLXebZ7p0r1yrYDrLilk2F";
export interface AccessToken {
    username: string;
    user_id: number;
    access_token: string;
    expires_in: number;
    token_type: string;
    state: any;
    scope: string;
    refresh_token: string;
}
export interface RequestParams {
    access_token?: string;
    [key: string]: any;
}
export interface DisqusConfig {
    apiKey: string;
    apiSecret: string;
}
export declare class Disqus {
    private config;
    constructor(config: DisqusConfig);
    request<T = any>(resource: string, params?: RequestParams, usePublic?: boolean): Promise<{
        code: number;
        response: T;
    }>;
    getAuthorizeURL(type: string | undefined, scope: string, uri: string): string;
    getOAuthAccessToken(code: string, uri: string): Promise<AccessToken>;
    refreshOAuthAccessToken<T = any>(refreshtoken: string): Promise<T>;
}
