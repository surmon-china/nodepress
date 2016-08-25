import { Component } from '@angular/core';
import { BaCard } from '../../../theme/components/baCard';
import { ArticleCategory } from './components/category';
import { ArticleDuoshuo } from './components/duoshuo';
import { ArticleSubmit } from './components/submit';
import { ArticleThumb } from './components/thumb';
import { ArticleMain } from './components/main';


@Component({
  selector: 'edit',
  directives: [BaCard, ArticleCategory, ArticleDuoshuo, ArticleSubmit, ArticleThumb, ArticleMain],
  template: require('./edit.html')
})

export class ArticleEdit {

  submitArticle(event) {
    console.log('Submit Article', event, this);
  }

  constructor() {
  }

  ngOnInit() {
  }
}
