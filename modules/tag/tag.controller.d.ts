import { QueryParamsResult } from '@app/decorators/queryparams.decorator';
import { PaginateResult } from '@app/utils/paginate';
import { TagsDTO, TagPaginateQueryDTO } from './tag.dto';
import { TagService } from './tag.service';
import { Tag } from './tag.model';
export declare class TagController {
    private readonly tagService;
    constructor(tagService: TagService);
    getTags(query: TagPaginateQueryDTO, { isUnauthenticated }: QueryParamsResult): Promise<PaginateResult<Tag>>;
    getAllTags(): Promise<Array<Tag>>;
    createTag(tag: Tag): Promise<Tag>;
    delTags(body: TagsDTO): Promise<import("mongodb").DeleteResult>;
    putTag({ params }: QueryParamsResult, tag: Tag): Promise<Tag>;
    delTag({ params }: QueryParamsResult): Promise<Tag>;
}
