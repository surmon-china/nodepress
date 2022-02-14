/// <reference types="mongoose" />
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
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
