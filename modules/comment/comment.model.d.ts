import { CommentState } from '@app/constants/biz.constant';
import { IPLocation } from '@app/processors/helper/helper.service.ip';
import { KeyValueModel } from '@app/models/key-value.model';
export declare const COMMENT_STATES: readonly [CommentState.Auditing, CommentState.Published, CommentState.Deleted, CommentState.Spam];
export declare const COMMENT_GUEST_QUERY_FILTER: Readonly<{
    state: CommentState.Published;
}>;
export declare class Author {
    name: string;
    email?: string | null;
    site?: string | null;
    get email_hash(): string | null;
}
export declare class CommentBase {
    post_id: number;
    pid: number;
    content: string;
    agent?: string | null;
    author: Author;
}
export declare class Comment extends CommentBase {
    id?: number;
    state: CommentState;
    likes: number;
    dislikes: number;
    ip: string | null;
    ip_location: Partial<IPLocation> | null;
    create_at?: Date;
    update_at?: Date;
    extends: KeyValueModel[];
}
export declare const CommentProvider: import("@nestjs/common").Provider<any>;
