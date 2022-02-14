import { QueryParamsResult } from '@app/decorators/queryparams.decorator';
import { PaginateResult } from '@app/utils/paginate';
import { CommentPaginateQueryDTO, CommentsDTO, CommentsStateDTO } from './comment.dto';
import { CommentService } from './comment.service';
import { Comment, CommentBase } from './comment.model';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    getComments(query: CommentPaginateQueryDTO, { isUnauthenticated }: QueryParamsResult): Promise<PaginateResult<Comment>>;
    createComment(comment: CommentBase, { visitor }: QueryParamsResult): Promise<Comment>;
    patchComments({ visitor }: QueryParamsResult, body: CommentsStateDTO): Promise<import("mongodb").UpdateResult>;
    delComments(body: CommentsDTO): Promise<import("mongodb").DeleteResult>;
    getComment({ params }: QueryParamsResult): Promise<Comment>;
    putComment({ params, visitor }: QueryParamsResult, comment: Comment): Promise<Comment>;
    putCommentIPLocation({ params }: QueryParamsResult): Promise<string | import("@typegoose/typegoose").DocumentType<Comment, import("@typegoose/typegoose/lib/types").BeAnObject>>;
    delComment({ params }: QueryParamsResult): Promise<import("../../interfaces/mongoose.interface").MongooseDoc<Comment>>;
}
