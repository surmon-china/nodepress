/*
*
* 设置控制器模块
*
*/

// 模拟数据


// 获取网站配置
exports.get = function(params) {
  let data = { data: configs };
  if (params.success) params.success(data);
  // if (params.error) params.success(data);
};

// 批量修改文章
exports.put = function(params) {
  // console.log(params);
  console.log('Hello,World!, 删除单篇文章');
};
