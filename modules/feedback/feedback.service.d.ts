import { MongooseModel, MongooseDoc, MongooseID } from '@app/interfaces/mongoose.interface';
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate';
import { IPService } from '@app/processors/helper/helper.service.ip';
import { QueryVisitor } from '@app/decorators/queryparams.decorator';
import { Feedback, FeedbackBase } from './feedback.model';
export declare class FeedbackService {
    private readonly ipService;
    private readonly feedbackModel;
    constructor(ipService: IPService, feedbackModel: MongooseModel<Feedback>);
    paginator(query: PaginateQuery<Feedback>, options: PaginateOptions): Promise<PaginateResult<Feedback>>;
    create(feedback: FeedbackBase, visitor: QueryVisitor): Promise<MongooseDoc<Feedback>>;
    getDetail(feedbackID: MongooseID): Promise<MongooseDoc<Feedback>>;
    update(feedbackID: MongooseID, newFeedback: Partial<Feedback>): Promise<MongooseDoc<Feedback>>;
    delete(feedbackID: MongooseID): Promise<MongooseDoc<Feedback>>;
    batchDelete(feedbackIDs: MongooseID[]): Promise<import("mongodb").DeleteResult>;
    getRootFeedbackAverageEmotion(): Promise<number>;
}
