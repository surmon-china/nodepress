import { Component } from '@angular/core';

@Component({
  selector: 'article-submit',
  directives: [],
  template: require('./submit.html')
})

export class ArticleSubmit {

  // 初始化
  public articleStatus = 1;
  public articlePublic = 1;
  public articlePublish = 1;

  submitArticle() {
    console.log('Submit Article', this);
  }

  constructor() {
  }

  ngOnInit() {
  }
}
