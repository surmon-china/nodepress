/*
*
* 标签控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('../np-handle');
const Article = require('../np-model/article.model');
const Tag = require('../np-model/tag.model');
const authIsVerified = require('../np-auth');
const buildSiteMap = require('../np-sitemap');
const tagCtrl = { list: {}, item: {} };

// 获取标签列表
tagCtrl.list.GET = (req, res) => {

  let { page = 1, per_page = 12, keyword = '' } = req.query;

  // 过滤条件
  const options = {
    sort: { _id: -1 },
    page: Number(page),
    limit: Number(per_page)
  };

  // 查询参数
  const keywordReg = new RegExp(keyword);
  const query = {
    "$or": [
      { 'name': keywordReg },
      { 'slug': keywordReg },
      { 'description': keywordReg }
    ]
  };

  const querySuccess = tags => {
    handleSuccess({
      res,
      message: '标签列表获取成功',
      result: {
        pagination: {
          total: tags.total,
          current_page: options.page,
          total_page: tags.pages,
          per_page: options.limit
        },
        data: tags.docs
      }
    });
  };

  // 查询article-tag的count聚合数据
  const getTagsCount = tags => {
    let $match = {};
    if (!authIsVerified(req)) {
      $match = { state: 1, public: 1 };
    }
    Article.aggregate([
      { $match },
      { $unwind : "$tag" }, 
      { $group: { 
        _id: "$tag", 
        num_tutorial: { $sum : 1 }}
      }
    ])
    .then(counts => {
      const newTags = tags.docs.map(t => {
        const finded = counts.find(c => String(c._id) === String(t._id));
        t.count = finded ? finded.num_tutorial : 0;
        return t;
      });
      tags.docs = newTags;
      querySuccess(tags);
    })
    .catch(err => {
      querySuccess(tags);
    })
  };

  // 请求标签
  Tag.paginate(query, options)
  .then(tags => {
    tags = JSON.parse(JSON.stringify(tags));
    getTagsCount(tags);
  })
  .catch(err => {
    handleError({ res, err, message: '标签列表获取失败' });
  })
};

// 发布标签
tagCtrl.list.POST = ({ body: tag, body: { slug }}, res) => {

  // 验证
  if (slug == undefined || slug == null) {
    handleError({ res, message: '缺少slug' });
    return false;
  };

  // 保存标签
  const saveTag = () => {
    new Tag(tag).save()
    .then((result = tag) => {
      handleSuccess({ res, result, message: '标签发布成功' });
      buildSiteMap();
    })
    .catch(err => {
      handleError({ res, err, message: '标签发布失败' });
    })
  };

  // 验证Slug合法性
  Tag.find({ slug })
  .then(({ length }) => {
    length ? handleError({ res, message: 'slug已被占用' }) : saveTag();
  })
  .catch(err => {
    handleError({ res, err, message: '标签发布失败' });
  })
};

// 批量删除标签
tagCtrl.list.DELETE = ({ body: { tags }}, res) => {

  // 验证
  if (!tags || !tags.length) {
    handleError({ res, message: '缺少有效参数' });
    return false;
  };

  Tag.remove({ '_id': { $in: tags }})
  .then(result => {
    handleSuccess({ res, result, message: '标签批量删除成功' });
    buildSiteMap();
  })
  .catch(err => {
    handleError({ res, err, message: '标签批量删除失败' });
  })
};

// 修改单个标签
tagCtrl.item.PUT = ({ params: { tag_id }, body: tag, body: { slug }}, res) => {

  if (!slug) {
    handleError({ res, message: 'slug不合法' });
    return false;
  };

  // 修改
  const putTag = () => {
    Tag.findByIdAndUpdate(tag_id, tag, { new: true })
    .then(result => {
      handleSuccess({ res, result, message: '标签修改成功' });
      buildSiteMap();
    })
    .catch(err => {
      handleError({ res, err, message: '标签修改失败' });
    })
  };

  // 修改前判断slug的唯一性，是否被占用
  Tag.find({ slug })
  .then(([_tag]) => {
    const hasExisted = (_tag && (_tag._id != tag_id));
    hasExisted ? handleError({ res, message: 'slug已存在' }) : putTag();
  })
  .catch(err => {
    handleError({ res, err, message: '修改前查询失败' });
  })
};

// 删除单个标签
tagCtrl.item.DELETE = ({ params: { tag_id }}, res) => {
  Tag.findByIdAndRemove(tag_id)
  .then(result => {
    handleSuccess({ res, result, message: '标签删除成功' });
    buildSiteMap();
  })
  .catch(err => {
    handleError({ res, err, message: '标签删除失败' });
  })
};

// export
exports.list = (req, res) => { handleRequest({ req, res, controller: tagCtrl.list })};
exports.item = (req, res) => { handleRequest({ req, res, controller: tagCtrl.item })};
