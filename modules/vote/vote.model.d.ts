import { IPLocation } from '@app/processors/helper/helper.service.ip';
export declare enum VoteTarget {
    Post = 1,
    Comment = 2
}
export declare enum VoteType {
    Upvote = 1,
    Downvote = -1
}
export declare const voteTypeMap: Map<VoteType, string>;
export declare enum VoteAuthorType {
    Anonymous = 0,
    Guest = 1,
    Disqus = 2
}
export declare const VOTE_TYPES: readonly [VoteType.Upvote, VoteType.Downvote];
export declare const VOTE_TARGETS: readonly [VoteTarget.Post, VoteTarget.Comment];
export declare const VOTE_AUTHOR_TYPES: readonly [VoteAuthorType.Anonymous, VoteAuthorType.Guest, VoteAuthorType.Disqus];
export declare class Vote {
    id?: number;
    target_type: number;
    target_id: number;
    vote_type: number;
    author_type: number;
    author: Record<string, any> | null;
    ip: string | null;
    ip_location: Partial<IPLocation> | null;
    user_agent?: string | null;
    create_at?: Date;
    update_at?: Date;
}
export declare const VoteProvider: import("@nestjs/common").Provider<any>;
