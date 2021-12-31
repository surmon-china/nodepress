import { PaginateResult } from '@app/utils/paginate';
import { CommentService } from './comment.service';
import { Comment, CreateCommentBase, CommentsPayload, CommentsStatePayload } from './comment.model';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    getComments({ querys, options, origin, isAuthenticated }: {
        querys: any;
        options: any;
        origin: any;
        isAuthenticated: any;
    }): Promise<PaginateResult<Comment>>;
    createComment(comment: CreateCommentBase, { visitor }: {
        visitor: any;
    }): Promise<Comment>;
    patchComments({ visitor }: {
        visitor: any;
    }, body: CommentsStatePayload): Promise<import("mongodb").UpdateResult>;
    delComments(body: CommentsPayload): Promise<import("mongodb").DeleteResult>;
    getComment({ params }: {
        params: any;
    }): Promise<Comment>;
    putComment({ params, visitor }: {
        params: any;
        visitor: any;
    }, comment: Comment): Promise<Comment>;
    delComment({ params }: {
        params: any;
    }): Promise<Comment>;
}
