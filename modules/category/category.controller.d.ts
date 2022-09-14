/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { QueryParamsResult } from '@app/decorators/queryparams.decorator';
import { PaginateResult } from '@app/utils/paginate';
import { CategoriesDTO, CategoryPaginateQueryDTO } from './category.dto';
import { CategoryService } from './category.service';
import { Category } from './category.model';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    getCategories(query: CategoryPaginateQueryDTO, { isUnauthenticated }: QueryParamsResult): Promise<PaginateResult<Category>>;
    createCategory(category: Category): Promise<Category>;
    delCategories(body: CategoriesDTO): Promise<import("mongodb").DeleteResult>;
    getCategory({ params }: QueryParamsResult): Promise<Category[]>;
    putCategory({ params }: QueryParamsResult, category: Category): Promise<Category>;
    delCategory({ params }: QueryParamsResult): Promise<Omit<import("@typegoose/typegoose").DocumentType<Category, import("@typegoose/typegoose/lib/types").BeAnObject>, "_id" | "id"> & Category & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
