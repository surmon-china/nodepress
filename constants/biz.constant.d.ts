export declare enum Language {
    English = "en",
    Chinese = "zh"
}
export declare enum SortType {
    Asc = 1,
    Desc = -1,
    Hottest = 2
}
export declare enum PublishState {
    Draft = 0,
    Published = 1,
    Recycle = -1
}
export declare enum PublicState {
    Public = 1,
    Secret = -1,
    Reserve = 0
}
export declare enum OriginState {
    Original = 0,
    Reprint = 1,
    Hybrid = 2
}
export declare enum CommentState {
    Auditing = 0,
    Published = 1,
    Deleted = -1,
    Spam = -2
}
export declare const GUESTBOOK_POST_ID = 0;
export declare const ROOT_COMMENT_PID = 0;
export declare const ROOT_FEEDBACK_TID = 0;
