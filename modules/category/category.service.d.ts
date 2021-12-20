import { Types } from 'mongoose';
import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { PaginateResult, PaginateOptions } from '@app/utils/paginate';
import { ArchiveService } from '@app/modules/archive/archive.service';
import { SeoService } from '@app/processors/helper/helper.service.seo';
import { Article } from '@app/modules/article/article.model';
import { Category } from './category.model';
export declare class CategoryService {
    private readonly archiveService;
    private readonly seoService;
    private readonly articleModel;
    private readonly categoryModel;
    constructor(archiveService: ArchiveService, seoService: SeoService, articleModel: MongooseModel<Article>, categoryModel: MongooseModel<Category>);
    getList(querys: any, options: PaginateOptions, isAuthenticated: any): Promise<PaginateResult<Category>>;
    create(newCategory: Category): Promise<Category>;
    getGenealogyById(categoryID: Types.ObjectId): Promise<Category[]>;
    getDetailBySlug(slug: string): Promise<Category>;
    update(categoryID: Types.ObjectId, newCategory: Category): Promise<Category>;
    delete(categoryID: Types.ObjectId): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & Category & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    batchDelete(categoryIDs: Types.ObjectId[]): Promise<import("mongodb").DeleteResult>;
}
