export declare enum EAkismetActionType {
    CheckSpam = "checkSpam",
    SubmitSpam = "submitSpam",
    SubmitHam = "submitHam"
}
export interface IContent {
    user_ip: string;
    user_agent: string;
    referrer: string;
    permalink: string;
    comment_type?: 'comment';
    comment_author?: string;
    comment_author_email?: string;
    comment_author_url?: string;
    comment_content?: string;
    is_test?: boolean;
}
export declare class AkismetService {
    private client;
    private clientIsValid;
    constructor();
    private initClient;
    private initVerify;
    private buildInterceptor;
    checkSpam(content: IContent): Promise<any>;
    submitSpam(content: IContent): Promise<any>;
    submitHam(content: IContent): Promise<any>;
}
