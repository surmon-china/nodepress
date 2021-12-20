import { PaginateResult } from '@app/utils/paginate';
import { Tag, TagsPayload } from './tag.model';
import { TagService } from './tag.service';
export declare class TagController {
    private readonly tagService;
    constructor(tagService: TagService);
    getTags({ querys, options, origin, isAuthenticated }: {
        querys: any;
        options: any;
        origin: any;
        isAuthenticated: any;
    }): Promise<PaginateResult<Tag>>;
    createTag(tag: Tag): Promise<Tag>;
    delTags(body: TagsPayload): Promise<import("mongodb").DeleteResult>;
    putTag({ params }: {
        params: any;
    }, tag: Tag): Promise<Tag>;
    delTag({ params }: {
        params: any;
    }): Promise<Tag>;
}
