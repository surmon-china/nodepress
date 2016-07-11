/*
*
* 文章控制器模块
*
*/

// 模拟数据
var articles = [{
      title: '文章一',
      description: '文章一描述',
      content: '我是文章一的内容',
      author: 'Surmon',
      date: '2016-09-02 16:03:27',
      comment: [],
      slug: 'hello-world',
      tags: ['css', 'js'],
      category: [1, 2]
    }, {
      title: '文章二',
      description: '文章二描述',
      content: '我是文章二的内容',
      author: 'Surmon',
      date: '2016-09-02 16:03:27',
      comment: [],
      slug: 'hello-world',
      tags: ['css', 'angular'],
      category: [1, 2]
    }, {
      title: '文章三',
      description: '文章三描述',
      content: '我是文章三的内容',
      author: 'Surmon',
      date: '2016-09-02 16:03:27',
      comment: [],
      slug: 'hello-world',
      tags: ['html', 'js'],
      category: [1, 2]
    }];

// 获取文章列表
exports.getList = function(params) {
  let data = {
    pagination: {
      total: articles.length,
      current_page: 1,
      total_page: 1,
      per_page: 10,
      query: params.query
    },
    data: articles
  };
  if (params.success) params.success(data);
  // if (params.error) params.success(data);
};

// 发布文章
exports.postItem = function(params) {
  let newArticle = params.body;
  if (!newArticle.title || !newArticle.content || !newArticle.author || !newArticle.date || !newArticle.category || !newArticle.category.length ) {
    if (params.error) params.error({ message: '缺少必要字段' });
    return false;
  } else {
    if (params.success) params.success(newArticle);
  }
};

// 批量修改文章
exports.putList = function(params) {
  // console.log(params);
  console.log('Hello,World!, 删除单篇文章');
};

// 批量删除文章
exports.delList = function(params) {
  // console.log(params);
  console.log('Hello,World!, 删除单篇文章');
};

// 获取单篇文章
exports.getItem = function(params) {
  // console.log(params);
  console.log('Hello,World!, 获取单篇文章');
};


// 修改单篇文章
exports.putItem = function(params) {
  // console.log(params);
  console.log('Hello,World!, 修改单篇文章');
};

// 删除单篇文章
exports.delItem = function(params) {
  // console.log(params);
  console.log('Hello,World!, 删除单篇文章');
};