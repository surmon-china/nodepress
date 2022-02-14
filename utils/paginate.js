"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = exports.mongoosePaginate = void 0;
const merge_1 = __importDefault(require("lodash/merge"));
const DEFAULT_OPTIONS = Object.freeze({
    page: 1,
    perPage: 16,
    dateSort: -1,
    lean: false,
});
function mongoosePaginate(schema) {
    schema.statics.paginate = paginate;
}
exports.mongoosePaginate = mongoosePaginate;
function paginate(filterQuery = {}, options = {}) {
    const _a = (0, merge_1.default)(Object.assign({}, DEFAULT_OPTIONS), Object.assign({}, options)), { page, perPage, dateSort, projection, $queryOptions } = _a, resetOptions = __rest(_a, ["page", "perPage", "dateSort", "projection", "$queryOptions"]);
    const findQueryOptions = Object.assign(Object.assign({}, resetOptions), $queryOptions);
    const countQuery = this.countDocuments ? this.countDocuments(filterQuery).exec() : this.count(filterQuery).exec();
    const pageQuery = this.find(filterQuery, projection, Object.assign({ skip: (page - 1) * perPage, limit: perPage, sort: dateSort ? { _id: dateSort } : findQueryOptions.sort }, findQueryOptions)).exec();
    return Promise.all([countQuery, pageQuery]).then(([countResult, pageResult]) => {
        const result = {
            documents: pageResult,
            total: countResult,
            page,
            perPage,
            totalPage: Math.ceil(countResult / perPage) || 1,
        };
        return result;
    });
}
exports.paginate = paginate;
//# sourceMappingURL=paginate.js.map