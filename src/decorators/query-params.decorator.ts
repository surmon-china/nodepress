/**
 * QueryParams decorator.
 * @file 请求参数解析装饰器
 * @module decorator/query-params
 * @author Surmon <https://github.com/surmon-china>
 */

import * as lodash from 'lodash';
import { Types } from 'mongoose';
import { createParamDecorator } from '@nestjs/common';
import { HttpForbiddenError } from '@app/errors/forbidden.error';
import { HttpBadRequestError } from '@app/errors/bad-request.error';
import { EPublishState, EPublicState, EOriginState, ESortType } from '@app/interfaces/state.interface';

export interface IOptions {
  [key: string]: string | number | Date | RegExp | IOptions;
}

export interface IParams {
  [key: string]: string | number | Types.ObjectId;
}

interface ITransformConfigBase {
  [key: string]: string | number | boolean;
}

// 导出参数结构
export interface ITransformConfig {
  params: ITransformConfigBase;
  querys: ITransformConfigBase;
  options: ITransformConfigBase;
}

// 验证器结构
interface IValidateError {
  name: string;
  isTodo: boolean;
  isAllowed: boolean;
  isIllegal: boolean;
  setValue(): void;
}

/**
 * 参数解析器构造器
 * @function QueryParams
 * @description 根据入参配置是否启用某些参数的验证和解析
 * @example @QueryParams()
 * @example @QueryParams({ options: { page: 1 } })
 * @example @QueryParams({ params: { id: 'listId' } })
 * @example @QueryParams({ querys: { state: true, date: true } })
 */
export const QueryParams = createParamDecorator((config: ITransformConfig, request) => {

  // 是否已验证权限
  const isAuthenticated = request.isAuthenticated();

  // 获取有效 IP 地址
  const requestIp = (
    request.headers['x-forwarded-for'] ||
    request.headers['x-real-ip'] ||
    request.connection.remoteAddress ||
    request.socket.remoteAddress ||
    request.connection.socket.remoteAddress ||
    request.ip ||
    request.ips[0]
  ).replace('::ffff:', '');

  // 字段转换配置（传入字符串则代表默认值，传入 false 则代表不启用，初始为默认值或 false）
  const fieldsConfig: ITransformConfig = lodash.merge({
    querys: {},
    params: { id: 'id' },
    options: { page: 1, per_page: true, sort: true },
  }, config);
  const isTodoField = field => field != null && field !== false;

  // 查询参数
  const querys: IOptions = {};

  // 过滤条件
  const options: IOptions = {};

  // 路径参数
  const params: IParams = lodash.merge({ url: request.url }, request.params);

  // 初始参数
  const date = request.query.date;
  const paramsId = request.params[fieldsConfig.params.id as string];
  const [page, per_page, sort, state, ppublic, origin] = [
    request.query.page || fieldsConfig.options.page,
    request.query.per_page,
    request.query.sort,
    request.query.state,
    request.query.public,
    request.query.origin,
  ].map(item => item != null ? Number(item) : item);

  // 参数提取验证规则
  // 1. isTodo 这条校验规则是否执行
  // 2. isAllowed 请求参数是否在允许规则之内 -> 400
  // 3. isIllegal 请求参数是否不合法地调用了管理员权限参数 -> 403
  // 任一条件返回错误；否则，设置或重置参数
  const validates: IValidateError[] = [
    {
      name: '路由/ID',
      isTodo: isTodoField(fieldsConfig.params.id),
      isAllowed: true,
      isIllegal: paramsId != null && !isAuthenticated && isNaN(paramsId),
      setValue() {
        // 如果用户传了 ID，则转为数字或 ObjectId
        if (paramsId != null) {
          params[fieldsConfig.params.id as string] = isNaN(paramsId)
            ? Types.ObjectId(paramsId)
            : Number(paramsId);
        }
      },
    },
    {
      name: '排序/sort',
      isTodo: isTodoField(fieldsConfig.options.sort),
      isAllowed: lodash.isUndefined(sort) || [ESortType.Asc, ESortType.Desc, ESortType.Hot].includes(sort),
      isIllegal: false,
      setValue() {
        if (sort != null) {
          options.sort = sort === ESortType.Hot
            ? { likes: ESortType.Desc }
            : { _id: sort };
        }
      },
    },
    {
      name: '目标页/page',
      isTodo: isTodoField(fieldsConfig.options.page),
      isAllowed: lodash.isUndefined(page) || (lodash.isInteger(page) && page > 0),
      isIllegal: false,
      setValue() {
        if (page != null) {
          options.page = page;
        }
      },
    },
    {
      name: '每页数量/per_page',
      isTodo: isTodoField(fieldsConfig.options.per_page),
      isAllowed: lodash.isUndefined(per_page) || (lodash.isInteger(per_page) && per_page > 0),
      isIllegal: false,
      setValue() {
        if (per_page != null) {
          options.limit = per_page;
        }
      },
    },
    {
      name: '日期查询/date',
      isTodo: isTodoField(fieldsConfig.querys.date),
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
      name: '发布状态/state',
      isTodo: isTodoField(fieldsConfig.querys.state),
      isAllowed: lodash.isUndefined(state) || [EPublishState.Published, EPublishState.Draft, EPublishState.Recycle].includes(state),
      isIllegal: state != null && !isAuthenticated && state !== EPublishState.Published,
      setValue() {
        // 管理员/任意状态 || 普通用户/已发布
        if (state != null) {
          querys.state = state;
          return false;
        }
        // 普通用户/未设置
        if (!isAuthenticated) {
          querys.state = EPublishState.Published;
        }
      },
    },
    {
      name: '公开状态/public',
      isTodo: isTodoField(fieldsConfig.querys.public),
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
      isTodo: isTodoField(fieldsConfig.querys.origin),
      isAllowed: lodash.isUndefined(origin) || [EOriginState.Original, EOriginState.Hybrid, EOriginState.Reprint].includes(origin),
      isIllegal: false,
      setValue() {
        if (origin != null) {
          querys.origin = origin;
        }
      },
    },
  ];

  // 验证参数及生成参数
  validates.forEach(validate => {
    if (!validate.isTodo) {
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

  // 挂载到 request 上下文
  request.requestParams = { querys, options, params, isAuthenticated };

  return {
    querys,
    options,
    params,
    origin: request.query,
    ip: requestIp,
    isAuthenticated,
  };
});
