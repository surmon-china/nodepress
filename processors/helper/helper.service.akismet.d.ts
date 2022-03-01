export declare enum AkismetAction {
    CheckSpam = "checkSpam",
    SubmitSpam = "submitSpam",
    SubmitHam = "submitHam"
}
export interface AkismetPayload {
    user_ip: string;
    user_agent: string;
    referrer: string;
    permalink?: string | null;
    comment_type?: 'comment' | 'reply';
    comment_author?: string | null;
    comment_author_email?: string | null;
    comment_author_url?: string | null;
    comment_content?: string | null;
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
