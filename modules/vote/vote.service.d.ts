import { MongooseModel, MongooseDoc, MongooseID } from '@app/interfaces/mongoose.interface';
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate';
import { Vote } from './vote.model';
export declare class VoteService {
    private readonly voteModel;
    constructor(voteModel: MongooseModel<Vote>);
    paginator(query: PaginateQuery<Vote>, options: PaginateOptions): Promise<PaginateResult<Vote>>;
    create(vote: Vote): Promise<MongooseDoc<Vote>>;
    update(voteID: MongooseID, newVote: Partial<Vote>): Promise<MongooseDoc<Vote>>;
    delete(voteID: MongooseID): Promise<MongooseDoc<Vote>>;
    batchDelete(voteIDs: MongooseID[]): Promise<import("mongodb").DeleteResult>;
}
