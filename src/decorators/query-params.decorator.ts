
import * as lodash from 'lodash';
import { Types } from 'mongoose';
import { createParamDecorator } from '@nestjs/common';
import { HttpForbiddenError } from '@app/errors/forbidden.error';
import { EPublishState, EPublicState, EOriginState, ESortType } from '@app/interfaces/state.interface';

export interface IOptions {
  [key: string]: string | number | Date | RegExp | IOptions;
}

export interface IParams {
  [key: string]: string | number | Types.ObjectId;
}

interface IValidateError {
  condition: boolean;
  message: string;
}

interface ITransformConfigBase {
  [key: string]: string | number;
}

export interface ITransformConfig {
  params: ITransformConfigBase;
  querys: ITransformConfigBase;
  options: ITransformConfigBase;
}

export const QueryParams = createParamDecorator((config: ITransformConfig, request) => {

  // 是否已验证权限
  const isAuthenticated = request.isAuthenticated();

  // 默认配置
  const transformConfig: ITransformConfig = Object.assign({
    params: {
      id: 'id',
    },
    querys: {
      page: 1,
    },
  }, config);

  // 初始参数
  const { date } = request.query;
  const paramsId = request.params[transformConfig.params.id];
  const [page, per_page, sort, state, ppublic, origin] = [
    request.query.page || transformConfig.querys.page,
    request.query.per_page,
    request.query.sort,
    request.query.state,
    request.query.public,
    request.query.origin,
  ].map(k => Number(k));

  // 查询参数
  const querys: IOptions = {};

  // 过滤条件
  const options: IOptions = {};

  // 路径参数
  const params: IParams = Object.assign({
    url: request.url,
  }, request.params);

  // 如果用户传了 ID，则转为数字或 ObjectId
  if (paramsId) {
    const isNumberType = isNaN(paramsId);
    params[transformConfig.params.id] = isNumberType ? Number(paramsId) : Types.ObjectId(paramsId);
  }

  // 排序方式
  if ([ESortType.Asc, ESortType.Desc].includes(sort)) {
    options.sort = { _id: ESortType.Desc };
  }

  // 目标页
  if (page) {
    options.page = page;
  }

  // 每页多少数据
  if (per_page) {
    options.limit = per_page;
  }

  // 时间查询
  if (date) {
    const getDate = new Date(date);
    if (getDate.toString() !== 'Invalid Date') {
      querys.create_at = {
        $gte: new Date(((getDate as any) / 1000 - 60 * 60 * 8) * 1000),
        $lt: new Date(((getDate as any) / 1000 + 60 * 60 * 16) * 1000),
      };
    }
  }

  // 发布状态
  if ([EPublishState.Published, EPublishState.Draft, EPublishState.Recycle].includes(state)) {
    querys.state = state;
  }

  // 公开状态
  if ([EPublicState.Public, EPublicState.Password, EPublicState.Secret].includes(ppublic)) {
    querys.public = ppublic;
  }

  // 来源状态
  if ([EOriginState.Original, EOriginState.Hybrid, EOriginState.Reprint].includes(origin)) {
    querys.public = origin;
  }

  // 如果是前台请求，却请求了各种管理员参数，则返回 403
  if (!isAuthenticated) {

    // 非已发布数据
    const isNotPublishedRequest: IValidateError = {
      condition: !lodash.isUndefined(querys.state) && querys.state !== EPublishState.Published,
      message: '非已发布数据',
    };

    // 非公开数据
    const isNotPublicRequest: IValidateError = {
      condition: !lodash.isUndefined(querys.public) && querys.public !== EPublicState.Public,
      message: '非公开数据',
    };

    // 非数字 ID 请求
    const validateParamsId = params[transformConfig.params.id];
    const isNotNumberIDRequest: IValidateError = {
      condition: validateParamsId && !lodash.isNumber(validateParamsId),
      message: '非数字 ID 请求',
    };

    // 权限条件
    const conditions: IValidateError[] = [
      isNotPublishedRequest, isNotPublicRequest, isNotNumberIDRequest,
    ];

    const errors = conditions.filter(condition => condition.condition);

    // 做判断
    if (errors.length) {
      throw new HttpForbiddenError('参数不合法：' + errors.map(err => err.message).join(';'));
    }
  }

  return { querys, options, params, origin: request.query };
});
