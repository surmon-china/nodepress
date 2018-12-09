/**
 * Handle module.
 * @file 路由统一解析器模块
 * @module utils/handle
 * @author Surmon <https://github.com/surmon-china>
 */

// const { isString, isArray } = require('np-helper/np-data-validate');

// 处理请求
export const handle = (params) => {
  console.log('说实话我不知道这是啥', params);
  return (target, methodName: string, descriptor: PropertyDescriptor) => {
    console.log('target-------', target, 'methodName-------', methodName, 'descriptor-------', descriptor);
    // 这个的需要改变来源，然后是你
    // new Promise((resolve, reject) => {
    //   resolve([]);
    // });
  };
};

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
export const handleError = ({ res, err = null, message = '请求失败', code }) => {
  const json = { code: 0, message, debug: err };
  code ? res.status(code).jsonp(json) : res.jsonp(json);
};

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

export default {
  handle,
};

/*
  promise<T>(
    promise: Promise<T>,
    successText?: string,
    failureText?: string,
    levels?: { [key: string]: string }
  ): Promise<T> {
    levels = this.getLevels(levels)
    promise.then(
      resolved => {
        if (successText) {
          // TODO: 模版渲染的单测
          successText = mustache.render(successText, { resolved })
          this[levels['resolve']](successText)
        }
      },
      rejected => this.exception(rejected, failureText, levels)
    )
    return promise
  }

  handle(successText?: string, failureText?: string, levels?: { [key: string]: string }) {
    levels = this.getLevels(levels)

    const me = this

    return replaceMethod(origin => function (...args) {
      const promise = origin.apply(this, args)
      return me.promise(promise, successText, failureText, levels)
    })
  }
  */
