import { Component } from '@angular/core';
import { BaCheckbox } from '../../../../../theme/components';

@Component({
  selector: 'article-category',
  directives: [BaCheckbox],
  template: require('./category.html')
})

export class ArticleCategory {

  public categories = [
    {
      "_id": "579610183b6d2f7c19ed3e46",
      "id": 10,
      "name": "分类1 - xg",
      "slug": "cate2 - xg",
      "__v": 0,
      "extend": [],
      "created_at": "2016-07-25T13:11:52.091Z",
      "pid": null
    },
    {
      "_id": "57961c4a0975a2dc0de4b626",
      "id": 13,
      "name": "分类2",
      "slug": "cate2",
      "__v": 0,
      "extend": [],
      "created_at": "2016-07-25T14:03:54.158Z",
      "pid": "579610183b6d2f7c19ed3e46"
    },
    {
      "_id": "57961c500975a2dc0de4b627",
      "id": 14,
      "name": "分类3",
      "slug": "cate3",
      "__v": 0,
      "extend": [],
      "created_at": "2016-07-25T14:04:00.113Z",
      "pid": "57961c4a0975a2dc0de4b626"
    },
    {
      "_id": "57977b1a8333ccc88b763355",
      "id": 20,
      "name": "分类9",
      "slug": "cate9",
      "__v": 0,
      "extend": [],
      "created_at": "2016-07-26T15:00:42.561Z",
      "pid": null
    }
  ];

  constructor() {
  }

  // 处理分类级别
  handleCategory () {
    let _categories = this.categories; 
    let _cates = _categories.filter(category => !category.pid);
    let _childs = _categories.filter(category => !!category.pid);
    _childs.forEach(category => {
      // 找到符合条件的分类
      let _findParent = parents => {
        parents.forEach(cate => {
          let is_parent = cate._id === category.pid;
          let par_child = cate.childrens;
          // 如果拥有符合条件的分类
          if(is_parent) {
            cate.childrens = cate.childrens || [];
            cate.childrens.push(category);
            return;
          }
          // 如果不拥有，则判断是否有子集
          if(par_child && !!par_child.length) _findParent(par_child);
        });
      };
      _findParent(_cates);
    });
    console.log(_cates);
    this.categories = _cates;
  }

  ngOnInit() {

    this.handleCategory();
  }
}
