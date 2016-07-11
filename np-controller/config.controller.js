/*
*
* 设置控制器模块
*
*/

// 模拟数据
var configs = {
    title: {
      name: '网站标题',
      description: '网站的标题',
      content: 'Nodepress'
    },
    description: {
      name: '网站描述',
      description: '网站的描述',
      content: '基于MEAN结构的博客程序'
    },
    static: {
      name: '统计代码',
      description: '网站的统计代码',
      content: '<script>console.log("static");</script>'
    }
  };

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
