export interface GeneralDisqusParams {
    [key: string]: any;
}
export declare enum ThreadState {
    Open = "open",
    Closed = "closed"
}
export declare class CallbackCodePayload {
    code: string;
}
export declare class ThreadPostIDPayload {
    post_id: string;
}
export declare class CommentIDPayload {
    comment_id: number;
}
