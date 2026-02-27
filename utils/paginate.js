"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoosePaginate = mongoosePaginate;
const merge_1 = __importDefault(require("lodash/merge"));
const app_config_1 = require("../app.config");
const DEFAULT_OPTIONS = Object.freeze({
    page: 1,
    perPage: app_config_1.APP_BIZ.PAGINATION_DEFAULT_SIZE,
    dateSort: -1
});
function doPaginate(queryFilter = {}, paginateOptions = {}, forceLean = false) {
    const { page, perPage, dateSort, projection, lean, $queryOptions, ...restOptions } = (0, merge_1.default)({ ...DEFAULT_OPTIONS }, { ...paginateOptions });
    const findQueryOptions = {
        ...restOptions,
        ...$queryOptions,
        lean: forceLean ? (lean ?? true) : false
    };
    const countQuery = this.countDocuments(queryFilter).lean().exec();
    const listQuery = this.find(queryFilter, projection, {
        skip: (page - 1) * perPage,
        limit: perPage,
        sort: dateSort ? { created_at: dateSort } : findQueryOptions.sort,
        ...findQueryOptions
    }).exec();
    return Promise.all([countQuery, listQuery]).then(([countResult, listResult]) => ({
        documents: listResult,
        total: countResult,
        page,
        perPage,
        totalPage: Math.ceil(countResult / perPage) || 1
    }));
}
function mongoosePaginate(schema) {
    schema.statics.paginate = function (filter, options) {
        return doPaginate.call(this, filter, options, false);
    };
    schema.statics.paginateRaw = function (filter, options) {
        return doPaginate.call(this, filter, options, true);
    };
}
//# sourceMappingURL=paginate.js.map