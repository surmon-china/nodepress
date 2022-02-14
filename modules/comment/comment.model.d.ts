import { CommentState } from '@app/interfaces/biz.interface';
import { IPLocation } from '@app/processors/helper/helper.service.ip';
import { ExtendModel } from '@app/models/extend.model';
export declare const COMMENT_STATES: readonly [CommentState.Auditing, CommentState.Published, CommentState.Deleted, CommentState.Spam];
export declare const COMMENT_GUEST_QUERY_FILTER: Readonly<{
    state: CommentState;
}>;
export declare class Author {
    name: string;
    email?: string;
    site?: string;
    get email_hash(): string | null;
}
export declare class CommentBase {
    post_id: number;
    pid: number;
    content: string;
    agent?: string;
    author: Author;
}
export declare class Comment extends CommentBase {
    id?: number;
    state: CommentState;
    likes: number;
    dislikes: number;
    ip?: string;
    ip_location: null | (Partial<IPLocation> & {
        [key: string]: any;
    });
    create_at?: Date;
    update_at?: Date;
    extends: ExtendModel[];
}
export declare const CommentProvider: import("@nestjs/common").Provider<any>;
