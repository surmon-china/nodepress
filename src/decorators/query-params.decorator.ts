
import * as lodash from 'lodash';
import { createParamDecorator } from '@nestjs/common';
import { EPublishState, EPublicState, EOriginState, ESortType } from '@app/interfaces/state.interface';

export interface IOption {
  [key: string]: string | number | Date | RegExp | IOption;
}

export const QueryParams = createParamDecorator((config, request) => {

  // 是否已验证权限
  const isAuthenticated = request.isAuthenticated();

  // 初始参数
  const { date } = request.query;
  const [page, per_page, sort, state, ppublic, origin] = [
    request.query.page || 1,
    request.query.per_page,
    request.query.sort,
    request.query.state,
    request.query.public,
    request.query.origin,
  ].map(k => Number(k));

  // 查询参数
  const querys: IOption = {};

  // 过滤条件
  const options: IOption = {};

  // 路径参数
  const params: IOption = {
    url: request.url,
  };

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

  // 如果是前台请求，则重置各种状态
  if (!isAuthenticated) {
    if (lodash.isFinite(querys.state)) {
      querys.state = EPublishState.Published;
    }
    if (lodash.isFinite(querys.public)) {
      querys.public = EPublicState.Public;
    }
  }

  return { querys, options, params, origin: request.query };
});
