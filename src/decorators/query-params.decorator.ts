/**
 * QueryParams decorator.
 * @file 请求参数解析装饰器
 * @module decorator/query-params
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash';
import { Types } from 'mongoose';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HttpForbiddenError } from '@app/errors/forbidden.error';
import { HttpBadRequestError } from '@app/errors/bad-request.error';
import { EPublishState, EPublicState, EOriginState, ECommentState, ESortType } from '@app/interfaces/state.interface';

// 预置转换器可选字段
export enum EQueryParamsField {
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
export interface IQueryParamsConfig {
  [key: string]: string | number | boolean | Types.ObjectId | Date | RegExp | IQueryParamsConfig;
}

// 导出结构
export interface IQueryParamsResult {
  querys: IQueryParamsConfig; // 用于 paginate 的查询参数
  options: IQueryParamsConfig; // 用于 paginate 的查询配置参数
  params: IQueryParamsConfig; // 路由参数
  origin: IQueryParamsConfig; // 原味的 querys 参数
  request: any; // 用于 request 的对象
  visitors: { // 访客信息
    ip: string; // 真实 IP
    ua: string; // 用户 UA
    referer: string; // 跳转来源
  };
  isAuthenticated: boolean; // 是否鉴权
}

// 入参转换配置
interface ITransformConfigObject {
  [key: string]: string | number | boolean;
}
export type TTransformConfig = EQueryParamsField | string | ITransformConfigObject;

// 验证器结构
interface IValidateError {
  name: string;
  field: EQueryParamsField;
  isAllowed: boolean;
  isIllegal: boolean;
  setValue(): void;
}

/**
 * 参数解析器构造器
 * @function QueryParams
 * @description 根据入参配置是否启用某些参数的验证和解析
 * @example @QueryParams()
 * @example @QueryParams([EQPFields.State, EQPFields.Date, { [EQPFields.Page]: 1 }])
 * @example @QueryParams(['custom_query_params', { test_params: true, [EQueryParamsField.Sort]: false }])
 */
export const QueryParams = createParamDecorator((customConfig: TTransformConfig[], context: ExecutionContext): IQueryParamsResult => {

  // context to request
  const request = context.switchToHttp().getRequest();

  // 是否已验证权限
  const isAuthenticated = request.isAuthenticated();

  // 字段转换配置（字符串则代表启用，对象则代表默认值）
  const transformConfig: IQueryParamsConfig = {
    [EQueryParamsField.Page]: 1,
    [EQueryParamsField.PerPage]: true,
    [EQueryParamsField.ParamsId]: 'id',
    [EQueryParamsField.Sort]: true,
  };

  // 合并配置
  if (customConfig) {
    customConfig.forEach(field => {
      if (lodash.isString(field)) {
        transformConfig[field] = true;
      }
      if (lodash.isObject(field)) {
        Object.assign(transformConfig, field);
      }
    });
  }

  // console.log('--------------------------------- transformConfig\n', transformConfig);

  // 查询参数
  const querys: IQueryParamsConfig = {};

  // 过滤条件
  const options: IQueryParamsConfig = {};

  // 路径参数
  const params: IQueryParamsConfig = lodash.merge({ url: request.url }, request.params);

  // 初始参数
  const date = request.query.date;
  const paramsId = request.params[transformConfig.paramsId as string];
  const [page, per_page, sort, state, ppublic, origin] = [
    request.query.page || transformConfig.page,
    request.query.per_page,
    request.query.sort,
    request.query.state,
    request.query.public,
    request.query.origin,
  ].map(item => item != null ? Number(item) : item);

  // 参数提取验证规则
  // 1. field 用于校验这个字段是否被允许用做参数
  // 2. isAllowed 请求参数是否在允许规则之内 -> 400
  // 3. isIllegal 请求参数是否不合法地调用了管理员权限参数 -> 403
  // 任一条件返回错误；否则，设置或重置参数
  const validates: IValidateError[] = [
    {
      name: '路由/ID',
      field: EQueryParamsField.ParamsId,
      isAllowed: true,
      isIllegal: paramsId != null && !isAuthenticated && isNaN(paramsId),
      setValue() {
        // 如果用户传了 ID，则转为数字或 ObjectId
        if (paramsId != null) {
          params[transformConfig.paramsId as string] = isNaN(paramsId)
            ? Types.ObjectId(paramsId)
            : Number(paramsId);
        }
      },
    },
    {
      name: '排序/sort',
      field: EQueryParamsField.Sort,
      isAllowed: lodash.isUndefined(sort) || [ESortType.Asc, ESortType.Desc, ESortType.Hot].includes(sort),
      isIllegal: false,
      setValue() {
        options.sort = {
          _id: sort != null
            ? sort
            : ESortType.Desc,
        };
      },
    },
    {
      name: '目标页/page',
      field: EQueryParamsField.Page,
      isAllowed: lodash.isUndefined(page) || (lodash.isInteger(page) && Number(page) > 0),
      isIllegal: false,
      setValue() {
        if (page != null) {
          options.page = page;
        }
      },
    },
    {
      name: '每页数量/per_page',
      field: EQueryParamsField.PerPage,
      isAllowed: lodash.isUndefined(per_page) || (lodash.isInteger(per_page) && Number(per_page) > 0),
      isIllegal: false,
      setValue() {
        if (per_page != null) {
          options.limit = per_page;
        }
      },
    },
    {
      name: '日期查询/date',
      field: EQueryParamsField.Date,
      isAllowed: lodash.isUndefined(date) || new Date(date).toString() !== 'Invalid Date',
      isIllegal: false,
      setValue() {
        if (date != null) {
          const queryDate = new Date(date);
          querys.create_at = {
            $gte: new Date(((queryDate as any) / 1000 - 60 * 60 * 8) * 1000),
            $lt: new Date(((queryDate as any) / 1000 + 60 * 60 * 16) * 1000),
          };
        }
      },
    },
    {
      name: '发布状态/state', // 评论或其他数据
      field: EQueryParamsField.State,
      isAllowed: lodash.isUndefined(state) ||
        (transformConfig[EQueryParamsField.CommentState]
          ? [ECommentState.Auditing, ECommentState.Deleted, ECommentState.Published, ECommentState.Spam].includes(state)
          : [EPublishState.Published, EPublishState.Draft, EPublishState.Recycle].includes(state)
        ),
      isIllegal:
        !isAuthenticated &&
        state != null &&
        state !== (
          transformConfig[EQueryParamsField.CommentState]
            ? ECommentState.Published
            : EPublishState.Published
        ),
      setValue() {
        // 管理员/任意状态 || 普通用户/已发布
        if (state != null) {
          querys.state = state;
          return false;
        }
        // 普通用户/未设置
        if (!isAuthenticated) {
          querys.state = transformConfig[EQueryParamsField.CommentState]
            ? ECommentState.Published
            : EPublishState.Published;
        }
      },
    },
    {
      name: '公开状态/public',
      field: EQueryParamsField.Public,
      isAllowed: lodash.isUndefined(ppublic) || [EPublicState.Public, EPublicState.Password, EPublicState.Secret].includes(ppublic),
      isIllegal: ppublic != null && !isAuthenticated && ppublic !== EPublicState.Public,
      setValue() {
        // 管理员/任意状态 || 普通用户/公开
        if (ppublic != null) {
          querys.public = ppublic;
          return false;
        }
        // 普通用户/未设置
        if (!isAuthenticated) {
          querys.public = EPublicState.Public;
        }
      },
    },
    {
      name: '来源状态/origin',
      field: EQueryParamsField.Origin,
      isAllowed: lodash.isUndefined(origin) || [EOriginState.Original, EOriginState.Hybrid, EOriginState.Reprint].includes(origin),
      isIllegal: false,
      setValue() {
        if (origin != null) {
          querys.origin = origin;
        }
      },
    },
  ];

  // 验证字段是否被允许
  const isEnableField = field => field != null && field !== false;

  // 验证参数及生成参数
  validates.forEach(validate => {
    if (!isEnableField(transformConfig[validate.field])) {
      return false;
    }
    if (!validate.isAllowed) {
      throw new HttpBadRequestError('参数不合法：' + validate.name);
    }
    if (validate.isIllegal) {
      throw new HttpForbiddenError('权限与参数匹配不合法：' + validate.name);
    }
    validate.setValue();
  });

  /**
   * 处理剩余的规则外参数
   * 1. 用户传入配置与默认配置混合得到需要处理的参数字段
   * 2. 内置一堆关键参数的校验器
   * 3. 剩下的非内部校验的非关键参数，在此合并至 querys
   */

  // 已处理字段
  const isProcessedFields = validates.map(validate => validate.field);
  // 配置允许的字段
  const allAllowFields = Object.keys(transformConfig);
  // 剩余的待处理字段 = 配置允许的字段 - 已处理字段
  const todoFields = lodash.difference(allAllowFields, isProcessedFields);
  // 将所有待处理字段循环，将值循环至 querys
  todoFields.forEach(field => {
    const targetValue = request.query[field];
    if (targetValue != null) querys[field] = targetValue;
  });

  // 挂载到 request 上下文
  request.queryParams = { querys, options, params, isAuthenticated };

  // 来源 IP
  const ip = (
    request.headers['x-forwarded-for'] ||
    request.headers['x-real-ip'] ||
    request.connection.remoteAddress ||
    request.socket.remoteAddress ||
    request.connection.socket.remoteAddress ||
    request.ip ||
    request.ips[0]
  ).replace('::ffff:', '');

  // 用户标识
  const ua = request.headers['user-agent'];

  const result = {
    querys,
    options,
    params,
    request,
    origin: request.query,
    visitors: { ip, ua, referer: request.referer },
    isAuthenticated,
  };

  // console.log('queryParams\n', request.queryParams);
  // console.log('origin\n', request.query);
  // console.log('visitors\n', result.visitors);
  return result;
});
