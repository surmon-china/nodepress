import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'article-submit',
  directives: [],
  template: require('./submit.html')
})

export class ArticleSubmit {

  // 状态
  public article = {
    status: 1,
    public: 1,
    publish: 1
  }

  @Output() submitArticle = new EventEmitter();

  submit() {
    this.submitArticle.emit(this.article);
  }

  constructor() {
  }

  ngOnInit() {
  }
}
