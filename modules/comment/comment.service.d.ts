import { Types } from 'mongoose';
import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { PaginateResult, PaginateOptions } from '@app/utils/paginate';
import { IPService } from '@app/processors/helper/helper.service.ip';
import { EmailService } from '@app/processors/helper/helper.service.email';
import { AkismetService } from '@app/processors/helper/helper.service.akismet';
import { OptionService } from '@app/modules/option/option.service';
import { Article } from '@app/modules/article/article.model';
import { Comment, CreateCommentBase, CommentsStatePayload } from './comment.model';
export declare class CommentService {
    private readonly ipService;
    private readonly emailService;
    private readonly akismetService;
    private readonly optionService;
    private readonly articleModel;
    private readonly commentModel;
    constructor(ipService: IPService, emailService: EmailService, akismetService: AkismetService, optionService: OptionService, articleModel: MongooseModel<Article>, commentModel: MongooseModel<Comment>);
    private sendMailToAdminAndTargetUser;
    private submitCommentAkismet;
    private updateCommentCountWithArticle;
    private updateCommentsStateWithBlacklist;
    private validateCommentByBlacklist;
    private validateCommentByAkismet;
    getList(querys: any, options: PaginateOptions): Promise<PaginateResult<Comment>>;
    create(comment: CreateCommentBase, { ip, ua, referer }: {
        ip: any;
        ua: any;
        referer: any;
    }): Promise<Comment>;
    batchPatchState(action: CommentsStatePayload, referer: string): Promise<import("mongodb").UpdateResult>;
    getDetail(commentID: Types.ObjectId): Promise<Comment>;
    getDetailByNumberId(commentID: number): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & Comment & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    update(commentID: Types.ObjectId, newComment: Comment, referer: string): Promise<Comment>;
    delete(commentID: Types.ObjectId): Promise<Comment>;
    batchDelete(commentIDs: Types.ObjectId[], postIDs: number[]): Promise<import("mongodb").DeleteResult>;
}
