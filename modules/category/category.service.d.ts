/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose" />
import { MongooseModel, MongooseDoc, MongooseID } from '@app/interfaces/mongoose.interface';
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate';
import { ArchiveService } from '@app/modules/archive/archive.service';
import { SeoService } from '@app/processors/helper/helper.service.seo';
import { Article } from '@app/modules/article/article.model';
import { Category } from './category.model';
export declare class CategoryService {
    private readonly seoService;
    private readonly archiveService;
    private readonly articleModel;
    private readonly categoryModel;
    constructor(seoService: SeoService, archiveService: ArchiveService, articleModel: MongooseModel<Article>, categoryModel: MongooseModel<Category>);
    paginator(query: PaginateQuery<Category>, options: PaginateOptions, publicOnly: boolean): Promise<PaginateResult<Category>>;
    getDetailBySlug(slug: string): Promise<MongooseDoc<Category>>;
    create(newCategory: Category): Promise<MongooseDoc<Category>>;
    getGenealogyById(categoryID: MongooseID): Promise<Category[]>;
    update(categoryID: MongooseID, newCategory: Category): Promise<MongooseDoc<Category>>;
    delete(categoryID: MongooseID): Promise<Omit<import("@typegoose/typegoose").DocumentType<Category, import("@typegoose/typegoose/lib/types").BeAnObject>, "_id" | "id"> & Category & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    batchDelete(categoryIDs: MongooseID[]): Promise<import("mongodb").DeleteResult>;
}
