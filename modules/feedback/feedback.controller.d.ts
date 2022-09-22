import { QueryParamsResult } from '@app/decorators/queryparams.decorator';
import { PaginateResult } from '@app/utils/paginate';
import { EmailService } from '@app/processors/helper/helper.service.email';
import { FeedbackPaginateQueryDTO, FeedbacksDTO } from './feedback.dto';
import { Feedback, FeedbackBase } from './feedback.model';
import { FeedbackService } from './feedback.service';
export declare class FeedbackController {
    private readonly emailService;
    private readonly feedbackService;
    constructor(emailService: EmailService, feedbackService: FeedbackService);
    getFeedbacks(query: FeedbackPaginateQueryDTO): Promise<PaginateResult<Feedback>>;
    createFeedback(feedback: FeedbackBase, { visitor }: QueryParamsResult): Promise<Feedback>;
    deleteFeedbacks(body: FeedbacksDTO): Promise<import("mongodb").DeleteResult>;
    putFeedback({ params }: QueryParamsResult, feedback: Feedback): Promise<Feedback>;
    deleteFeedback({ params }: QueryParamsResult): Promise<import("../../interfaces/mongoose.interface").MongooseDoc<Feedback>>;
}
