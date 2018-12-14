/**
 * Handle module.
 * @file 路由统一解析器模块
 * @module utils/handle
 * @author Surmon <https://github.com/surmon-china>
 */

import { HttpException, HttpStatus } from '@nestjs/common';
import { THttpSuccessResponse, EStatus } from '@app/interfaces/http';
import { consola } from '@app/transforms/module.transform';

type TStatus = number;
type TMessage = string;

const errorMsg = message => `${message}失败`;
const successMsg = message => `${message}成功`;

export const handle = (message: TMessage, status?: TStatus) => {
  return (_, __, descriptor: PropertyDescriptor) => {
    const origin = descriptor.value;
    descriptor.value = function(...args) {
      return origin.apply(this, args)
        .then(response => {
          consola.log('我很好奇谁先执行------HttpProcessor');
          return response;
        },
        // ({
        //   ...response,
        //   message: successMsg(message),
        //   status: EStatus.Error,
        // })
        )
        .catch(error => {
          return Promise.reject(
            new HttpException(
              { message: errorMsg(message), error },
              status || HttpStatus.INTERNAL_SERVER_ERROR,
            ));
        });
    };
    return descriptor;
  };
};

export default {
  handle,
};

/*
export const handleRequest = ({ req, res, controller }) => {
  const method = req.method;
  controller[method]
    ? controller[method](req, res)
    : res.status(405).jsonp({ code: 0, message: '不支持该请求类型！' });
};

// 处理成功
export const handleSuccess = ({ res, result = null, message = '请求成功' }) => {
  res.jsonp({ code: 1, message, result });
};

// 处理错误
// export const handleError = ({ res, err = null, message = '请求失败', code }) => {
//   const json = { code: 0, message, debug: err };
//   code ? res.status(code).jsonp(json) : res.jsonp(json);
// };

// 更友好的成功处理
export const humanizedHandleSuccess = (res, message) => {
  return result => {
    return handleSuccess({ res, result, message });
  };
};

// 更友好的错误处理
export const humanizedHandleError = (res, message, code) => {
  return err => {
    return handleError({ res, err, message, code });
  };
};

// 处理翻页数据
export const handlePaginateData = data => ({
  data: data.docs,
  pagination: {
    total: data.total,
    current_page: data.page,
    total_page: data.pages,
    per_page: data.limit,
  },
});
*/
