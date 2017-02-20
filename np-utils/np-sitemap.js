/* 地图更新器 */

const fs = require('fs');
const sm = require('sitemap');
const config = require('np-config');
const Tag = require('np-model/tag.model');
const Article = require('np-model/article.model');
const Category = require('np-model/category.model');
let sitemap = null;
let pages = [
  { url: '', changefreq: 'always', priority: 1 },
  { url: '/about', changefreq: 'monthly', priority: 1 },
  { url: '/project', changefreq: 'monthly', priority: 1 },
  { url: '/sitemap', changefreq: 'always', priority: 1 },
  { url: '/guestbook', changefreq: 'always', priority: 1 }
];

// 获取数据
const getDatas = success => {
  sitemap = sm.createSitemap ({
    hostname: config.INFO.site || 'https://surmon.me',
    cacheTime: 600000,
    urls: [...pages]
  });
  Tag.find().sort({ '_id': -1 })
  .then(tags => {
    tags.forEach(tag => {
      sitemap.add({ 
        url: `/tag/${tag.slug}`, 
        changefreq: 'daily', 
        priority: 0.6 
      });
    })
    return Category.find().sort({ '_id': -1 });
  })
  .then(categories => {
    categories.forEach(category => {
      sitemap.add({ 
        url: `/category/${category.slug}`, 
        changefreq: 'daily', 
        priority: 0.6 
      });
    })
    return Article.find({ state: 1, public: 1 }).sort({ '_id': -1 });
  })
  .then(articles => {
    articles.forEach(article => {
      sitemap.add({ 
        url: `/article/${article.id}`, 
        changefreq: 'daily', 
        lastmodISO: article.create_time.toISOString(), 
        priority: 0.8 
      });
    })
    success();
  })
  .catch(err => {
    success();
    console.log('生成地图前获取数据库发生错误', err);
  })
};


// 获取地图
const buildSiteMap = (success, error) => {
  getDatas(() => {
    // console.log('data', sitemap);
    sitemap.toXML((err, xml) => {
      if (err && error) return error(err);
      if (!err && success) success(xml);
      fs.writeFileSync("../surmon.me/static/sitemap.xml", sitemap.toString());
      sitemap = null;
    });
  });
};

// export
module.exports = buildSiteMap;

