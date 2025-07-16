"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoosePaginate = mongoosePaginate;
exports.paginate = paginate;
const merge_1 = __importDefault(require("lodash/merge"));
const DEFAULT_OPTIONS = Object.freeze({
    page: 1,
    perPage: 16,
    dateSort: -1,
    lean: false
});
function mongoosePaginate(schema) {
    schema.statics.paginate = paginate;
}
function paginate(filterQuery = {}, options = {}) {
    const { page, perPage, dateSort, projection, $queryOptions, ...resetOptions } = (0, merge_1.default)({ ...DEFAULT_OPTIONS }, { ...options });
    const findQueryOptions = {
        ...resetOptions,
        ...$queryOptions
    };
    const countQuery = this.countDocuments(filterQuery).exec();
    const pageQuery = this.find(filterQuery, projection, {
        skip: (page - 1) * perPage,
        limit: perPage,
        sort: dateSort ? { _id: dateSort } : findQueryOptions.sort,
        ...findQueryOptions
    }).exec();
    return Promise.all([countQuery, pageQuery]).then(([countResult, pageResult]) => {
        const result = {
            documents: pageResult,
            total: countResult,
            page,
            perPage,
            totalPage: Math.ceil(countResult / perPage) || 1
        };
        return result;
    });
}
//# sourceMappingURL=paginate.js.map