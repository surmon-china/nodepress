
import { HttpException, HttpStatus } from '@nestjs/common';
import { THttpSuccessResponse, EStatus } from '@app/interfaces/http.interface';

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
          console.log('我很好奇谁先执行------HttpProcessor');
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
