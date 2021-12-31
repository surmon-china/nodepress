/**
 * @file QueryParams decorator
 * @module decorator/query-params
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import { Types, isValidObjectId } from 'mongoose'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { VALIDATION_ERROR_DEFAULT, HTTP_PARAMS_PERMISSION_ERROR_DEFAULT } from '@app/constants/text.constant'
import { PublishState, PublicState, OriginState, CommentState, SortType } from '@app/interfaces/biz.interface'
import { HttpForbiddenError } from '@app/errors/forbidden.error'
import { HttpBadRequestError } from '@app/errors/bad-request.error'
import { PaginateOptions } from '@app/utils/paginate'

// 预置转换器可选字段
export enum QueryParamsField {
  Page = 'page',
  PerPage = 'per_page',
  Sort = 'sort',
  Date = 'date',
  Keyword = 'keyword',
  State = 'state',
  Public = 'public',
  Origin = 'origin',
  ParamsId = 'paramsId',
  CommentState = 'commentState',
}

// 内部参数类型
export interface QueryParamsConfig extends Omit<PaginateOptions, 'populate' | 'select'> {
  [key: string]: void | string | number | boolean | Types.ObjectId | Date | RegExp | QueryParamsConfig | any
}

export interface QueryVisitor {
  ip: string
  ua: string
  referer: string
}

export interface cookies {
  [key: string]: string
}

export interface QueryParamsResult {
  querys: Partial<QueryParamsConfig> // 用于 paginate 的查询参数
  options: Partial<QueryParamsConfig> // 用于 paginate 的查询配置参数
  params: Partial<QueryParamsConfig> // 路由参数
  origin: Partial<QueryParamsConfig> // 原味的 querys 参数
  request: any // 用于 request 的对象
  visitor: QueryVisitor
  cookies: cookies
  isAuthenticated: boolean // 是否鉴权
}

// 入参转换配置
interface TransformConfigObject {
  [key: string]: string | number | boolean
}
export type TransformConfig = QueryParamsField | string | TransformConfigObject

// 验证器结构
interface ValidateError {
  name: string
  field: QueryParamsField
  isAllowed: boolean
  isIllegal: boolean
  setValue(): void
}

/**
 * 参数解析器构造器
 * @function QueryParams
 * @description 根据入参配置是否启用某些参数的验证和解析
 * @example @QueryParams()
 * @example @QueryParams([EQPFields.State, EQPFields.Date, { [EQPFields.Page]: 1 }])
 * @example @QueryParams(['custom_query_params', { test_params: true, [EQueryParamsField.Sort]: false }])
 */
export const QueryParams = createParamDecorator(
  (customConfig: TransformConfig[], context: ExecutionContext): QueryParamsResult => {
    const request = context.switchToHttp().getRequest()

    // from passport middleware
    // https://github.com/jaredhanson/passport/blob/master/CHANGELOG.md
    // http://www.passportjs.org/docs/configure/
    const isAuthenticated = request.isAuthenticated()

    // 字段转换配置（字符串则代表启用，对象则代表默认值）
    const transformConfig: Partial<QueryParamsConfig> = {
      [QueryParamsField.Page]: 1,
      [QueryParamsField.PerPage]: true,
      [QueryParamsField.ParamsId]: 'id',
      [QueryParamsField.Sort]: true,
    }

    // 合并配置
    if (customConfig) {
      customConfig.forEach((field) => {
        if (lodash.isString(field)) {
          transformConfig[field] = true
        }
        if (lodash.isObject(field)) {
          Object.assign(transformConfig, field)
        }
      })
    }

    // 查询参数
    const querys: Partial<QueryParamsConfig> = {}

    // 过滤条件
    const options: Partial<QueryParamsConfig> = {}

    // 路径参数
    const params: QueryParamsConfig = lodash.merge({ url: request.url }, request.params)

    // 初始参数
    const date = request.query.date
    const paramsId = request.params[transformConfig.paramsId as string]
    const [page, per_page, sort, state, ppublic, origin] = [
      request.query.page || transformConfig.page,
      request.query.per_page,
      request.query.sort,
      request.query.state,
      request.query.public,
      request.query.origin,
    ].map((item) => (item != null ? Number(item) : item))

    // 参数提取验证规则
    // 1. field 用于校验这个字段是否被允许用做参数
    // 2. isAllowed 请求参数是否在允许规则之内 > 400
    // 3. isIllegal 请求参数是否不合法地调用了管理员权限参数 > 403
    // 任一条件返回错误；否则，设置或重置参数
    const validates: ValidateError[] = [
      {
        name: 'params.id',
        field: QueryParamsField.ParamsId,
        isAllowed: true,
        isIllegal: paramsId != null && !isAuthenticated && isValidObjectId(paramsId),
        setValue() {
          if (paramsId != null) {
            params[transformConfig.paramsId as string] =
              // ObjectId
              isValidObjectId(paramsId)
                ? new Types.ObjectId(paramsId)
                : isNaN(paramsId)
                ? // slug
                  String(paramsId)
                : // number ID
                  Number(paramsId)
          }
        },
      },
      {
        name: 'query.sort',
        field: QueryParamsField.Sort,
        isAllowed: lodash.isUndefined(sort) || [SortType.Asc, SortType.Desc, SortType.Hot].includes(sort),
        isIllegal: false,
        setValue() {
          options.sort = {
            _id: sort != null ? sort : SortType.Desc,
          }
        },
      },
      {
        name: 'query.page',
        field: QueryParamsField.Page,
        isAllowed: lodash.isUndefined(page) || (lodash.isInteger(page) && Number(page) > 0),
        isIllegal: false,
        setValue() {
          if (page != null) {
            options.page = page
          }
        },
      },
      {
        name: 'query.per_page',
        field: QueryParamsField.PerPage,
        isAllowed:
          lodash.isUndefined(per_page) ||
          (lodash.isInteger(per_page) && Number(per_page) > 0 && Number(per_page) <= 50),
        isIllegal: false,
        setValue() {
          if (per_page != null) {
            options.perPage = per_page
          }
        },
      },
      {
        name: 'query.date',
        field: QueryParamsField.Date,
        isAllowed: lodash.isUndefined(date) || new Date(date).toString() !== 'Invalid Date',
        isIllegal: false,
        setValue() {
          if (date != null) {
            const queryDate = new Date(date)
            querys.create_at = {
              $gte: new Date(((queryDate as any) / 1000 - 60 * 60 * 8) * 1000),
              $lt: new Date(((queryDate as any) / 1000 + 60 * 60 * 16) * 1000),
            }
          }
        },
      },
      {
        // comment or article BIZ
        name: 'query.state',
        field: QueryParamsField.State,
        isAllowed:
          lodash.isUndefined(state) ||
          (transformConfig[QueryParamsField.CommentState]
            ? [CommentState.Auditing, CommentState.Deleted, CommentState.Published, CommentState.Spam].includes(state)
            : [PublishState.Published, PublishState.Draft, PublishState.Recycle].includes(state)),
        isIllegal:
          !isAuthenticated &&
          state != null &&
          state !==
            (transformConfig[QueryParamsField.CommentState] ? CommentState.Published : PublishState.Published),
        setValue() {
          // admin/any || user/Published
          if (state != null) {
            querys.state = state
            return false
          }
          // user
          if (!isAuthenticated) {
            querys.state = transformConfig[QueryParamsField.CommentState]
              ? CommentState.Published
              : PublishState.Published
          }
        },
      },
      {
        name: 'query.public',
        field: QueryParamsField.Public,
        isAllowed:
          lodash.isUndefined(ppublic) ||
          [PublicState.Public, PublicState.Password, PublicState.Secret].includes(ppublic),
        isIllegal: ppublic != null && !isAuthenticated && ppublic !== PublicState.Public,
        setValue() {
          // admin/any || user/Public
          if (ppublic != null) {
            querys.public = ppublic
            return false
          }
          // user
          if (!isAuthenticated) {
            querys.public = PublicState.Public
          }
        },
      },
      {
        name: 'query.origin',
        field: QueryParamsField.Origin,
        isAllowed:
          lodash.isUndefined(origin) ||
          [OriginState.Original, OriginState.Hybrid, OriginState.Reprint].includes(origin),
        isIllegal: false,
        setValue() {
          if (origin != null) {
            querys.origin = origin
          }
        },
      },
    ]

    // 验证字段是否被允许
    const isEnabledField = (field) => field != null && field !== false

    // 验证参数及生成参数
    validates.forEach((validate) => {
      if (!isEnabledField(transformConfig[validate.field])) {
        return false
      }
      if (!validate.isAllowed) {
        throw new HttpBadRequestError(`${VALIDATION_ERROR_DEFAULT}: ${validate.name}`)
      }
      if (validate.isIllegal) {
        throw new HttpForbiddenError(`${HTTP_PARAMS_PERMISSION_ERROR_DEFAULT}: ${validate.name}`)
      }
      validate.setValue()
    })

    /**
     * 处理剩余的规则外参数
     * 1. 用户传入配置与默认配置混合得到需要处理的参数字段
     * 2. 内置一堆关键参数的校验器
     * 3. 剩下的非内部校验的非关键参数，在此合并至 querys
     */

    // 已处理字段
    const isProcessedFields = validates.map((validate) => validate.field)
    // 配置允许的字段
    const allAllowFields = Object.keys(transformConfig)
    // 剩余的待处理字段 = 配置允许的字段 - 已处理字段
    const todoFields = lodash.difference(allAllowFields, isProcessedFields)
    // 将所有待处理字段循环，将值循环至 querys
    todoFields.forEach((field) => {
      const targetValue = request.query[field]
      if (targetValue != null) querys[field] = targetValue
    })

    // 挂载到 request 上下文
    request.queryParams = { querys, options, params, isAuthenticated }

    // 来源 IP
    const ip =
      request.headers['x-forwarded-for'] ||
      request.headers['x-real-ip'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      request.ip ||
      request.ips[0]

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
    }
  }
)
