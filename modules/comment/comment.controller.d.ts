import { PaginateResult } from '@app/utils/paginate';
import { Comment, CreateCommentBase, CommentsPayload, CommentsStatePayload } from './comment.model';
import { CommentService } from './comment.service';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    getComments({ querys, options, origin }: {
        querys: any;
        options: any;
        origin: any;
    }): Promise<PaginateResult<Comment>>;
    createComment(comment: CreateCommentBase, { visitors }: {
        visitors: any;
    }): Promise<Comment>;
    patchComments({ visitors }: {
        visitors: any;
    }, body: CommentsStatePayload): Promise<import("mongodb").UpdateResult>;
    delComments(body: CommentsPayload): Promise<import("mongodb").DeleteResult>;
    getComment({ params }: {
        params: any;
    }): Promise<Comment>;
    putComment({ params, visitors }: {
        params: any;
        visitors: any;
    }, comment: Comment): Promise<Comment>;
    delComment({ params }: {
        params: any;
    }): Promise<Comment>;
}
