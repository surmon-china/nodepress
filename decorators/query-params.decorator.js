"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryParams = exports.QueryParamsField = void 0;
const lodash_1 = __importDefault(require("lodash"));
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const text_constant_1 = require("../constants/text.constant");
const biz_interface_1 = require("../interfaces/biz.interface");
const forbidden_error_1 = require("../errors/forbidden.error");
const bad_request_error_1 = require("../errors/bad-request.error");
var QueryParamsField;
(function (QueryParamsField) {
    QueryParamsField["Page"] = "page";
    QueryParamsField["PerPage"] = "per_page";
    QueryParamsField["Sort"] = "sort";
    QueryParamsField["Date"] = "date";
    QueryParamsField["Keyword"] = "keyword";
    QueryParamsField["State"] = "state";
    QueryParamsField["Public"] = "public";
    QueryParamsField["Origin"] = "origin";
    QueryParamsField["ParamsId"] = "paramsId";
    QueryParamsField["CommentState"] = "commentState";
})(QueryParamsField = exports.QueryParamsField || (exports.QueryParamsField = {}));
exports.QueryParams = (0, common_1.createParamDecorator)((customConfig, context) => {
    const request = context.switchToHttp().getRequest();
    const isAuthenticated = request.isAuthenticated();
    const transformConfig = {
        [QueryParamsField.Page]: 1,
        [QueryParamsField.PerPage]: true,
        [QueryParamsField.ParamsId]: 'id',
        [QueryParamsField.Sort]: true,
    };
    if (customConfig) {
        customConfig.forEach((field) => {
            if (lodash_1.default.isString(field)) {
                transformConfig[field] = true;
            }
            if (lodash_1.default.isObject(field)) {
                Object.assign(transformConfig, field);
            }
        });
    }
    const querys = {};
    const options = {};
    const params = lodash_1.default.merge({ url: request.url }, request.params);
    const date = request.query.date;
    const paramsId = request.params[transformConfig.paramsId];
    const [page, per_page, sort, state, ppublic, origin] = [
        request.query.page || transformConfig.page,
        request.query.per_page,
        request.query.sort,
        request.query.state,
        request.query.public,
        request.query.origin,
    ].map((item) => (item != null ? Number(item) : item));
    const validates = [
        {
            name: 'params.id',
            field: QueryParamsField.ParamsId,
            isAllowed: true,
            isIllegal: paramsId != null && !isAuthenticated && (0, mongoose_1.isValidObjectId)(paramsId),
            setValue() {
                if (paramsId != null) {
                    params[transformConfig.paramsId] =
                        (0, mongoose_1.isValidObjectId)(paramsId)
                            ? new mongoose_1.Types.ObjectId(paramsId)
                            : isNaN(paramsId)
                                ?
                                    String(paramsId)
                                :
                                    Number(paramsId);
                }
            },
        },
        {
            name: 'query.sort',
            field: QueryParamsField.Sort,
            isAllowed: lodash_1.default.isUndefined(sort) || [biz_interface_1.SortType.Asc, biz_interface_1.SortType.Desc, biz_interface_1.SortType.Hot].includes(sort),
            isIllegal: false,
            setValue() {
                options.sort = {
                    _id: sort != null ? sort : biz_interface_1.SortType.Desc,
                };
            },
        },
        {
            name: 'query.page',
            field: QueryParamsField.Page,
            isAllowed: lodash_1.default.isUndefined(page) || (lodash_1.default.isInteger(page) && Number(page) > 0),
            isIllegal: false,
            setValue() {
                if (page != null) {
                    options.page = page;
                }
            },
        },
        {
            name: 'query.per_page',
            field: QueryParamsField.PerPage,
            isAllowed: lodash_1.default.isUndefined(per_page) ||
                (lodash_1.default.isInteger(per_page) && Number(per_page) > 0 && Number(per_page) <= 50),
            isIllegal: false,
            setValue() {
                if (per_page != null) {
                    options.perPage = per_page;
                }
            },
        },
        {
            name: 'query.date',
            field: QueryParamsField.Date,
            isAllowed: lodash_1.default.isUndefined(date) || new Date(date).toString() !== 'Invalid Date',
            isIllegal: false,
            setValue() {
                if (date != null) {
                    const queryDate = new Date(date);
                    querys.create_at = {
                        $gte: new Date((queryDate / 1000 - 60 * 60 * 8) * 1000),
                        $lt: new Date((queryDate / 1000 + 60 * 60 * 16) * 1000),
                    };
                }
            },
        },
        {
            name: 'query.state',
            field: QueryParamsField.State,
            isAllowed: lodash_1.default.isUndefined(state) ||
                (transformConfig[QueryParamsField.CommentState]
                    ? [biz_interface_1.CommentState.Auditing, biz_interface_1.CommentState.Deleted, biz_interface_1.CommentState.Published, biz_interface_1.CommentState.Spam].includes(state)
                    : [biz_interface_1.PublishState.Published, biz_interface_1.PublishState.Draft, biz_interface_1.PublishState.Recycle].includes(state)),
            isIllegal: !isAuthenticated &&
                state != null &&
                state !==
                    (transformConfig[QueryParamsField.CommentState] ? biz_interface_1.CommentState.Published : biz_interface_1.PublishState.Published),
            setValue() {
                if (state != null) {
                    querys.state = state;
                    return false;
                }
                if (!isAuthenticated) {
                    querys.state = transformConfig[QueryParamsField.CommentState]
                        ? biz_interface_1.CommentState.Published
                        : biz_interface_1.PublishState.Published;
                }
            },
        },
        {
            name: 'query.public',
            field: QueryParamsField.Public,
            isAllowed: lodash_1.default.isUndefined(ppublic) ||
                [biz_interface_1.PublicState.Public, biz_interface_1.PublicState.Password, biz_interface_1.PublicState.Secret].includes(ppublic),
            isIllegal: ppublic != null && !isAuthenticated && ppublic !== biz_interface_1.PublicState.Public,
            setValue() {
                if (ppublic != null) {
                    querys.public = ppublic;
                    return false;
                }
                if (!isAuthenticated) {
                    querys.public = biz_interface_1.PublicState.Public;
                }
            },
        },
        {
            name: 'query.origin',
            field: QueryParamsField.Origin,
            isAllowed: lodash_1.default.isUndefined(origin) ||
                [biz_interface_1.OriginState.Original, biz_interface_1.OriginState.Hybrid, biz_interface_1.OriginState.Reprint].includes(origin),
            isIllegal: false,
            setValue() {
                if (origin != null) {
                    querys.origin = origin;
                }
            },
        },
    ];
    const isEnabledField = (field) => field != null && field !== false;
    validates.forEach((validate) => {
        if (!isEnabledField(transformConfig[validate.field])) {
            return false;
        }
        if (!validate.isAllowed) {
            throw new bad_request_error_1.HttpBadRequestError(`${text_constant_1.VALIDATION_ERROR_DEFAULT}: ${validate.name}`);
        }
        if (validate.isIllegal) {
            throw new forbidden_error_1.HttpForbiddenError(`${text_constant_1.HTTP_PARAMS_PERMISSION_ERROR_DEFAULT}: ${validate.name}`);
        }
        validate.setValue();
    });
    const isProcessedFields = validates.map((validate) => validate.field);
    const allAllowFields = Object.keys(transformConfig);
    const todoFields = lodash_1.default.difference(allAllowFields, isProcessedFields);
    todoFields.forEach((field) => {
        const targetValue = request.query[field];
        if (targetValue != null)
            querys[field] = targetValue;
    });
    request.queryParams = { querys, options, params, isAuthenticated };
    const ip = request.headers['x-forwarded-for'] ||
        request.headers['x-real-ip'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.ip ||
        request.ips[0];
    return {
        isAuthenticated,
        querys,
        options,
        params,
        request,
        origin: request.query,
        cookies: request.cookies,
        visitor: {
            ip: ip.replace('::ffff:', '').replace('::1', ''),
            ua: request.headers['user-agent'],
            referer: request.referer,
        },
    };
});
//# sourceMappingURL=query-params.decorator.js.map