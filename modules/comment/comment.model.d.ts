import { Types } from 'mongoose';
import { CommentState } from '@app/interfaces/biz.interface';
import { Extend } from '@app/models/extend.model';
export declare class Author {
    name: string;
    email: string;
    site: string;
}
export declare class CreateCommentBase {
    post_id: number;
    pid: number;
    content: string;
    agent?: string;
    author: Author;
}
export declare class Comment extends CreateCommentBase {
    id?: number;
    state: CommentState;
    is_top: boolean;
    likes: number;
    ip?: string;
    ip_location?: Record<string, any>;
    create_at?: Date;
    update_at?: Date;
    extends?: Extend[];
}
export declare class CommentsPayload {
    comment_ids: Types.ObjectId[];
    post_ids: number[];
}
export declare class CommentsStatePayload extends CommentsPayload {
    state: CommentState;
}
export declare const CommentProvider: import("@nestjs/common").Provider<any>;
