
import { createParamDecorator } from '@nestjs/common';
import { EPublishState, EPublicState, ESortType } from '@app/interfaces/state.interface';

console.log('ESortType', Object.keys(ESortType));

export interface IOption {
  [key: string]: string | number | RegExp | IOption;
}

export const Paginate = createParamDecorator((config, request) => {

  // 初始参数
  const { keyword, page, per_page, state, sort } = request.query;

  // 查询参数
  const query: IOption = {};

  // 过滤条件
  const options: IOption = {};

  // 目标页
  if (sort) {
    options.sort = { _id: ESortType.Desc };
  }

  // 目标页
  if (page) {
    options.page = page;
  }

  // size
  if (per_page) {
    options.limit = per_page;
  }

  // 关键词查询
  if (keyword) {
    query.content = new RegExp(keyword);
  }

  // 按照 type 查询
  // if ([PUBLISH_STATE.draft, PUBLISH_STATE.published].includes(state)) {
  //   query.state = state;
  // }

  // 如果是前台请求，则重置公开状态和发布状态
  // if (!authIsVerified(req)) {
    // query.state = PUBLISH_STATE.published;
  // }

  return { query, options };
});
