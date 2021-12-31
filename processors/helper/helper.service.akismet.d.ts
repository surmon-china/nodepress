export declare enum AkismetActionType {
    CheckSpam = "checkSpam",
    SubmitSpam = "submitSpam",
    SubmitHam = "submitHam"
}
export interface AkismetPayload {
    user_ip: string;
    user_agent: string;
    referrer: string;
    permalink?: string;
    comment_type?: 'comment' | 'reply';
    comment_author?: string;
    comment_author_email?: string;
    comment_author_url?: string;
    comment_content?: string;
}
export declare class AkismetService {
    private client;
    private clientIsValid;
    constructor();
    private initClient;
    private initVerify;
    private makeInterceptor;
    checkSpam(payload: AkismetPayload): Promise<any>;
    submitSpam(payload: AkismetPayload): Promise<any>;
    submitHam(payload: AkismetPayload): Promise<any>;
}
