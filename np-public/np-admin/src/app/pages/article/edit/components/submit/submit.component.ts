import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'article-submit',
  directives: [],
  template: require('./submit.html')
})

export class ArticleSubmit {

  @Input() article;
  @Output() submitArticle = new EventEmitter();

  submit() {
    this.submitArticle.emit();
  }

  constructor() {
  }

  ngOnInit() {
  }
}
