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
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = exports.mongoosePaginate = void 0;
const DEFAULT_OPTIONS = Object.freeze({
    page: 1,
    perPage: 16,
    offset: 0,
    lean: false,
});
function mongoosePaginate(schema) {
    schema.statics.paginate = paginate;
}
exports.mongoosePaginate = mongoosePaginate;
function paginate(filterQuery = {}, options = {}) {
    const _a = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options), { page, perPage, offset, select, queryOptions } = _a, resetOptions = __rest(_a, ["page", "perPage", "offset", "select", "queryOptions"]);
    const skip = offset > 0 ? offset : (page - 1) * perPage;
    const countQuery = this.countDocuments ? this.countDocuments(filterQuery).exec() : this.count(filterQuery).exec();
    const pageQuery = this.find(filterQuery, select, Object.assign(Object.assign({ skip, limit: perPage }, resetOptions), queryOptions)).exec();
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