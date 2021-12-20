/// <reference types="mongoose" />
import { PaginateResult } from '@app/utils/paginate';
import { Category, CategoriesPayload } from './category.model';
import { CategoryService } from './category.service';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    getCategories({ querys, options, isAuthenticated }: {
        querys: any;
        options: any;
        isAuthenticated: any;
    }): Promise<PaginateResult<Category>>;
    createCategory(category: Category): Promise<Category>;
    delCategories(body: CategoriesPayload): Promise<import("mongodb").DeleteResult>;
    getCategory(categoryID: any): Promise<Category[]>;
    putCategory({ params }: {
        params: any;
    }, category: Category): Promise<Category>;
    delCategory({ params }: {
        params: any;
    }): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & Category & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
}
